"""Validate distributable structure, asset integrity, local links, and extracted helpers."""

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys
import tempfile
import zipfile


def validate(folder):
    from validate_release import validate as validate_source
    from install_skill import operate

    validate_source()
    folder = Path(folder).resolve()
    sums = dict(
        line.split("  ", 1)[::-1]
        for line in (folder / "SHA256SUMS.txt").read_text().splitlines()
    )
    for name, digest in sums.items():
        assert hashlib.sha256((folder / name).read_bytes()).hexdigest() == digest, name
    sizes = json.loads((folder / "PACKAGE-SIZES.json").read_text(encoding="utf-8"))
    for archive in sorted(folder.glob("*.zip")):
        with zipfile.ZipFile(archive) as z:
            names = z.namelist()
            assert sizes["packages"][archive.name] == {
                "compressedBytes": archive.stat().st_size,
                "unpackedBytes": sum(i.file_size for i in z.infolist()),
                "files": len(names),
            }
            assert archive.stat().st_size <= 24_000_000
            assert sum(i.file_size for i in z.infolist()) <= 24_000_000
            assert len(names) == len(set(names))
            assert not any(
                PurePosixPath(n).is_absolute()
                or ".." in PurePosixPath(n).parts
                or "\\" in n
                or ":" in n
                for n in names
            )
            if archive.name == "dazzler-templates.zip":
                catalog = json.loads(z.read("dazzler-templates/catalog.json"))
                assert len(catalog["templates"]) == 30
                for relative, digest in catalog["files"].items():
                    assert (
                        hashlib.sha256(
                            z.read("dazzler-templates/" + relative)
                        ).hexdigest()
                        == digest
                    )
                print(
                    "dazzler-templates.zip: all 30 templates and resource hashes passed"
                )
                continue
            entry = next(n for n in names if n.endswith("/SKILL.md"))
            prefix = entry.removesuffix("SKILL.md")
            text = z.read(entry).decode()
            if "claude" in archive.name:
                invocation = (
                    "/dazzler:dazzler-frontend "
                    if "plugin" in archive.name
                    else "/dazzler-frontend "
                )
                wrong = (
                    "/dazzler-frontend " if "plugin" in archive.name else "/dazzler:"
                )
                for starter in [
                    entry,
                    *[n for n in names if n.startswith(prefix + "references/starters")],
                ]:
                    prompt_text = z.read(starter).decode()
                    assert wrong not in prompt_text, (archive.name, starter)
                    if starter.endswith("starters.json") or starter == entry:
                        assert invocation in prompt_text, (archive.name, starter)
            assert len(z.read(entry)) <= 8000, (archive.name, "entrypoint budget")
            for reference in names:
                if reference.startswith(prefix + "references/") and reference.endswith(
                    ".md"
                ):
                    assert len(z.read(reference)) <= 12000, (
                        archive.name,
                        reference,
                        "reference budget",
                    )
            assert (
                "name: Dazzler"
                if archive.name == "dazzler-grokbot.zip"
                else "name: dazzler-frontend"
            ) in text and "## Verify the result" in text
            profile = json.loads(z.read(prefix + "references/package-profile.json"))
            if archive.name == "dazzler-grokbot.zip":
                assert prefix == "dazzler/"
                assert "description: >-\n  use this when " in text
            if archive.name == "dazzler-gemini-extension.zip":
                extension = json.loads(z.read("dazzler/gemini-extension.json"))
                assert extension["name"] == "dazzler"
                assert extension["version"] == profile["version"]
                assert prefix == "dazzler/skills/dazzler-frontend/"
            assert profile["profile"] == "compact"
            assert sum(i.file_size for i in z.infolist()) <= profile["maxUnpackedBytes"]
            assert archive.stat().st_size <= profile["maxUnpackedBytes"]
            assert "MAINTENANCE.md" not in text
            if archive.name != "dazzler-codex.zip":
                assert "$dazzler-frontend" not in text
                assert "references/platform-host.md" in text
                assert prefix + "references/platform-host.md" in names
            else:
                assert prefix + "agents/openai.yaml" in names
            assert not any(
                n.endswith("MAINTENANCE.md")
                or (
                    archive.name != "dazzler-codex.zip"
                    and n.endswith("agents/openai.yaml")
                )
                for n in names
            )
            templates = json.loads(z.read(prefix + "assets/templates/catalog.json"))
            assert len(templates["templates"]) == 30
            for relative, digest in templates["files"].items():
                assert (
                    hashlib.sha256(
                        z.read(prefix + "assets/templates/" + relative)
                    ).hexdigest()
                    == digest
                )
            for required in (
                "scripts/studio.mjs",
                "scripts/project.py",
                "scripts/browser.cjs",
                "scripts/evaluate.py",
                "evals/cross-platform.json",
                "references/design-studio.md",
                "references/visualization.md",
                "scripts/visualize.mjs",
                "scripts/office-chart.R",
            ):
                assert prefix + required in names, required
            graphics = json.loads(z.read(prefix + "references/asset-catalog.json"))
            assert len(graphics["assets"]) == 15
            for asset in graphics["assets"]:
                assert (
                    hashlib.sha256(z.read(prefix + asset["path"])).hexdigest()
                    == asset["sha256"]
                )
            catalog = json.loads(z.read(prefix + "references/font-catalog.json"))
            checked = 0
            for family in catalog["fonts"]:
                if family["status"] != "bundled":
                    continue
                for item in family["files"] + family["support_files"]:
                    assert (
                        hashlib.sha256(z.read(prefix + item["path"])).hexdigest()
                        == item["sha256"]
                    )
                    checked += 1
            assert checked == profile["fontSupportFiles"]
            bundled_ids = [
                f["id"] for f in catalog["fonts"] if f["status"] == "bundled"
            ]
            assert bundled_ids == profile["fontFamilies"]
            if profile["profile"] == "full":
                assert checked == 206
            else:
                assert len(bundled_ids) == 6
                assert profile["maxUnpackedBytes"] == 24_000_000
                assert not any(
                    n.startswith(prefix + "assets/fonts/")
                    and n.split("/fonts/", 1)[1].split("/")[0] not in bundled_ids
                    for n in names
                )
            viz = json.loads(z.read(prefix + "scripts/vendor/viz/provenance.json"))
            for relative, digest in viz["files"].items():
                assert (
                    hashlib.sha256(
                        z.read(prefix + "scripts/vendor/viz/" + relative)
                    ).hexdigest()
                    == digest
                )
            hotspots = json.loads(
                z.read(prefix + "scripts/vendor/hotspots/provenance.json")
            )
            for relative, digest in hotspots["files"].items():
                assert (
                    hashlib.sha256(
                        z.read(prefix + "scripts/vendor/hotspots/" + relative)
                    ).hexdigest()
                    == digest
                )
            assert prefix + "references/interactive-illustrations.md" in names
            prov = json.loads(z.read(prefix + "scripts/vendor/provenance.json"))
            assert (
                hashlib.sha256(
                    z.read(prefix + "scripts/vendor/color-engine.mjs")
                ).hexdigest()
                == prov["sha256"]
            )
            for n in names:
                if not n.endswith(".md") or "/assets/" in n:
                    continue
                for link in re.findall(r"\]\(([^)]+)\)", z.read(n).decode()):
                    if re.match(r"^(https?:|mailto:|#)", link):
                        continue
                    import posixpath

                    target = posixpath.normpath(
                        posixpath.join(posixpath.dirname(n), link.split("#")[0])
                    )
                    assert target in names or any(
                        x.startswith(target.rstrip("/") + "/") for x in names
                    ), (n, link)
            if "plugin" in archive.name:
                manifest = json.loads(z.read("dazzler/.claude-plugin/plugin.json"))
                expected = json.loads(
                    (
                        Path(__file__).resolve().parents[1]
                        / ".codex-plugin/plugin.json"
                    ).read_text()
                )
                assert (
                    manifest["name"] == "dazzler"
                    and manifest["version"] == expected["version"]
                )
            with tempfile.TemporaryDirectory() as temp:
                if "plugin" not in archive.name and archive.name not in (
                    "dazzler-grokbot.zip",
                    "dazzler-gemini-extension.zip",
                ):
                    install_root = Path(temp) / "managed"
                    install_root.mkdir()
                    args = dict(
                        root=install_root, host=profile["host"], scope="project"
                    )
                    source = dict(
                        archive=archive,
                        checksums=folder / "SHA256SUMS.txt",
                        version=profile["version"],
                    )
                    operate("install", **args, **source, dry_run=True)
                    operate("install", **args, **source)
                    operate("install", **args, **source)
                    operate("rollback", **args)
                    operate("uninstall", **args)
                z.extractall(temp)
                skill = Path(temp) / prefix
                health = subprocess.run(
                    [sys.executable, str(skill / "scripts/health.py")],
                    capture_output=True,
                    text=True,
                    check=True,
                    timeout=30,
                )
                assert json.loads(health.stdout)["status"] == "pass"
                if archive.name == "dazzler-grokbot.zip":
                    task = Path(temp) / "task.json"
                    task.write_text('{"kind":"chart"}')
                    routed = subprocess.run(
                        ["node", str(skill / "scripts/route.mjs"), str(task)],
                        capture_output=True,
                        text=True,
                        check=True,
                        timeout=30,
                    )
                    assert json.loads(routed.stdout)["networkRequired"] is False
                    page = Path(temp) / "index.html"
                    page.write_text(
                        "<!doctype html><title>Local check</title><p>Dazzler</p>"
                    )
                    env = {
                        k: v
                        for k, v in os.environ.items()
                        if k not in ("DAZZLER_NODE_MODULES", "NODE_PATH")
                    }
                    browser = subprocess.run(
                        [
                            "node",
                            "--no-global-search-paths",
                            str(skill / "scripts/browser.cjs"),
                            "inspect",
                            str(page),
                            str(Path(temp) / "browser-check"),
                        ],
                        cwd=temp,
                        env=env,
                        capture_output=True,
                        text=True,
                        timeout=30,
                    )
                    assert (
                        browser.returncode != 0
                        and "Playwright unavailable" in browser.stderr
                    )
                native_config = Path(temp) / "native-input.json"
                native_config.write_text('{"brand":{"seed":"#7048E8"}}')
                subprocess.run(
                    [
                        "node",
                        str(skill / "scripts/studio.mjs"),
                        "tokens",
                        "--config",
                        str(native_config),
                        "--out",
                        str(Path(temp) / "native"),
                        "--format",
                        "flutter",
                    ],
                    capture_output=True,
                    text=True,
                    check=True,
                    timeout=30,
                )
                assert (Path(temp) / "native/dazzler_theme.dart").is_file()
                config = Path(temp) / "chart-input.json"
                config.write_text(
                    json.dumps(
                        {
                            "title": "Package smoke check",
                            "data": [{"x": "A", "y": 1}, {"x": "B", "y": 3}],
                        }
                    )
                )
                subprocess.run(
                    [
                        "node",
                        str(skill / "scripts/visualize.mjs"),
                        "--config",
                        str(config),
                        "--out",
                        str(Path(temp) / "chart-output"),
                    ],
                    capture_output=True,
                    text=True,
                    check=True,
                    timeout=30,
                )
                assert (
                    (Path(temp) / "chart-output/chart.svg")
                    .read_text()
                    .startswith("<svg")
                )
                art = Path(temp) / "art.svg"
                art.write_text(
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect id="room" width="90" height="90"/></svg>'
                )
                interactive = Path(temp) / "interactive.json"
                interactive.write_text(
                    json.dumps(
                        {
                            "title": "Illustration package check",
                            "imageAlt": "A room.",
                            "regions": [
                                {
                                    "id": "room",
                                    "label": "Room",
                                    "description": "A sample room.",
                                }
                            ],
                        }
                    )
                )
                subprocess.run(
                    [
                        "node",
                        str(skill / "scripts/hotspots.mjs"),
                        "--config",
                        str(interactive),
                        "--art",
                        str(art),
                        "--out",
                        str(Path(temp) / "interactive-output"),
                    ],
                    capture_output=True,
                    text=True,
                    check=True,
                    timeout=30,
                )
                assert (
                    json.loads(
                        (Path(temp) / "interactive-output/report.json").read_text()
                    )["renderer"]
                    == "svgjs"
                )
                result = subprocess.run(
                    [
                        sys.executable,
                        "-X",
                        "utf8",
                        str(skill / "scripts/fonts.py"),
                        "recommend",
                        "--role",
                        "body",
                        "--text",
                        "Dazzler",
                    ],
                    capture_output=True,
                    text=True,
                    check=True,
                )
                assert json.loads(result.stdout)
                result = subprocess.run(
                    [
                        "node",
                        str(skill / "scripts/colors.mjs"),
                        "recommend",
                        "--mood",
                        "cozy",
                    ],
                    capture_output=True,
                    text=True,
                    check=True,
                )
                assert json.loads(result.stdout)
                cfg = Path(temp) / "system-input.json"
                cfg.write_text(
                    '{"brand":{"seed":"#345678"},"refinement":{"intent":"bolder","density":4}}'
                )
                subprocess.run(
                    [
                        "node",
                        str(skill / "scripts/studio.mjs"),
                        "tokens",
                        "--config",
                        str(cfg),
                        "--out",
                        str(Path(temp) / "system"),
                    ],
                    capture_output=True,
                    text=True,
                    check=True,
                )
                assert (
                    json.loads((Path(temp) / "system/design-system.json").read_text())[
                        "palette"
                    ]["modes"]["light"]["tokens"]["brand"]
                    == "#345678"
                )
                layout_brief = Path(temp) / "layout-brief.json"
                layout_brief.write_text(
                    '{"task":"apply","content":["fields","submit"]}'
                )
                layout_result = subprocess.run(
                    [
                        "node",
                        str(skill / "scripts/layouts.mjs"),
                        "recommend",
                        "--config",
                        str(layout_brief),
                    ],
                    capture_output=True,
                    text=True,
                    check=True,
                )
                assert (
                    json.loads(layout_result.stdout)["recommendations"][0]["id"]
                    == "focused-form"
                )
                controls = Path(temp) / "controls.json"
                controls.write_text('{"intent":"critique"}')
                refinement_result = subprocess.run(
                    ["node", str(skill / "scripts/refinement.mjs"), str(controls)],
                    capture_output=True,
                    text=True,
                    check=True,
                )
                assert json.loads(refinement_result.stdout)["readOnly"] is True
                workflow_task = Path(temp) / "workflow-task.json"
                workflow_task.write_text('{"intent":"audit","features":["forms"]}')
                workflow_result = subprocess.run(
                    [
                        "node",
                        str(skill / "scripts/workflow.mjs"),
                        "plan",
                        str(workflow_task),
                    ],
                    capture_output=True,
                    text=True,
                    check=True,
                )
                workflow_plan = json.loads(workflow_result.stdout)
                assert workflow_plan["readOnly"] is True
                assert all(c["status"] == "not-run" for c in workflow_plan["checks"])
                assert any(c["id"] == "forms" for c in workflow_plan["checks"])
                subprocess.run(
                    [
                        sys.executable,
                        "-X",
                        "utf8",
                        str(skill / "scripts/project.py"),
                        "assets",
                        "--kind",
                        "icon",
                        "--ids",
                        "check",
                        "--out",
                        str(Path(temp) / "icons"),
                    ],
                    capture_output=True,
                    text=True,
                    check=True,
                )
                subprocess.run(
                    [
                        sys.executable,
                        "-X",
                        "utf8",
                        str(skill / "scripts/evaluate.py"),
                        "--host",
                        "package-check",
                        "--out",
                        str(Path(temp) / "eval"),
                    ],
                    capture_output=True,
                    text=True,
                    check=True,
                )
                assert all(
                    r["status"] == "not-run"
                    for r in json.loads(
                        (Path(temp) / "eval/evaluation.json").read_text()
                    )["results"]
                )
                subprocess.run(
                    [
                        sys.executable,
                        "-X",
                        "utf8",
                        str(skill / "scripts/templates.py"),
                        "export",
                        "restaurant-cafe",
                        "--out",
                        str(Path(temp) / "template-export"),
                    ],
                    capture_output=True,
                    text=True,
                    check=True,
                )
                assert (
                    Path(temp) / "template-export/ui/restaurant-cafe/index.html"
                ).is_file()
            print(
                f"{archive.name}: structure, links, {checked} font/support hashes, 15 graphics, color/viz engines and extracted core/studio/chart/evaluation helpers passed"
            )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("folder", type=Path)
    validate(parser.parse_args().folder)
