"""Build self-contained platform packages from canonical Dazzler resources (stdlib only)."""

import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil
import zipfile
import tempfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "skills/dazzler-frontend"
PLATFORMS = ("codex", "claude", "gemini", "cursor", "copilot", "grokbot")


def skill_text(platform, plugin=False):
    text = (SOURCE / "SKILL.md").read_text(encoding="utf-8")
    text = re.sub(r"When asked to update this skill.*?\n\n", "", text, count=1)
    if platform == "codex":
        return text
    start = text.index("## Implement with available capabilities")
    end = text.index("## Verify the result", start)
    routing = (
        "## Implement with available capabilities\n\n"
        "Follow [host routing](references/platform-host.md) when implementing. "
        "Use only available tools and the authorized project's stack; state unavailable checks. "
        "Respect host consent and project permissions. This skill grants no permission to "
        "push, publish, purchase or install OS fonts. Keep original asset notices."
    )
    text = text[:start] + routing + "\n\n" + text[end:]
    text = text.replace(
        "This version adds ChatGPT/Codex tool routing and verification,",
        "This edition adds host-specific tool routing and verification,",
    )
    if platform == "claude":
        invocation = "/dazzler:dazzler-frontend" if plugin else "/dazzler-frontend"
        return text.replace("Use $dazzler-frontend to ...", invocation + " ...")
    if platform == "grokbot":
        text = text.replace("name: dazzler-frontend", "name: Dazzler")
        text = re.sub(
            r"description: (.*)",
            lambda m: "description: >-\n  use this when you need to "
            + m[1][0].lower()
            + m[1][1:],
            text,
            count=1,
        )
    return text.replace("$dazzler-frontend", "Dazzler")


LITE_FAMILIES = {
    "work-sans",
    "young-serif",
    "office-code-pro",
    "inter",
    "bluu-next",
    "league-gothic",
}


def seal_profile(target, platform, profile):
    catalog_path = target / "references/font-catalog.json"
    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    if profile == "compact":
        for family in catalog["fonts"]:
            if family["status"] != "bundled" or family["id"] in LITE_FAMILIES:
                continue
            directory = target / "assets/fonts" / family["id"]
            assert directory.parent == target / "assets/fonts"
            if directory.exists():
                shutil.rmtree(directory)
            reference = target / "references/fonts" / (family["id"] + ".md")
            if reference.is_file():
                reference.write_text(
                    "**Optional in this compact edition.** This family's catalog binaries are not installed; use an included alternative or the full edition. The information below describes the full catalog.\n\n"
                    + reference.read_text(encoding="utf-8"),
                    encoding="utf-8",
                )
            family["status"] = "optional-pack"
            family["manual_steps"] = [
                "Use an included alternative automatically, or obtain the full edition to use this family. Never imply the missing files are installed."
            ]
            for face in family["files"]:
                face["path"] = None
            family["support_files"] = []
        notices_path = target / "THIRD_PARTY_NOTICES.md"
        notices = notices_path.read_text(encoding="utf-8")
        for family in catalog["fonts"]:
            if family["status"] == "optional-pack":
                notices = notices.replace(
                    f"[Notices](assets/fonts/{family['id']}/)",
                    f"[Optional family information](references/fonts/{family['id']}.md)",
                )
        notices_path.write_text(
            "Compact profile: catalog families marked optional are not installed. Original notices for included binaries remain alongside those files, including template-local subsets. Full-catalog attribution below is retained for context.\n\n"
            + notices,
            encoding="utf-8",
        )
        catalog["bundled_family_count"] = len(LITE_FAMILIES)
        catalog_path.write_text(json.dumps(catalog, indent=2) + "\n", encoding="utf-8")
    bundled = [f for f in catalog["fonts"] if f["status"] == "bundled"]
    templates = json.loads(
        (target / "assets/templates/catalog.json").read_text(encoding="utf-8")
    )
    version = json.loads((ROOT / "package.json").read_text())["version"]
    record = {
        "schemaVersion": 1,
        "version": version,
        "host": platform,
        "profile": profile,
        "maxUnpackedBytes": 24_000_000 if profile == "compact" else 80_000_000,
        "fontFamilies": [f["id"] for f in bundled],
        "fontSupportFiles": sum(
            len(f["files"]) + len(f["support_files"]) for f in bundled
        ),
        "templates": len(templates["templates"]),
        "notes": [
            "Template-local font subsets remain with their templates; they are not general font-catalog installations.",
            "Host upload and execution compatibility require a real host test; package validation is not host acceptance.",
        ],
    }
    (target / "references/package-profile.json").write_text(
        json.dumps(record, indent=2) + "\n", encoding="utf-8"
    )
    import sys

    sys.path.insert(0, str(SOURCE / "scripts"))
    from health import content_digest

    files = {
        p.relative_to(target).as_posix(): content_digest(p)
        for directory in ("scripts", "assets", "references")
        for p in sorted(
            (target / directory).rglob("*"),
            key=lambda p: p.relative_to(target).as_posix(),
        )
        if p.is_file() and "__pycache__" not in p.parts and p.name != "integrity.json"
    }
    (target / "references/integrity.json").write_text(
        json.dumps({"schemaVersion": 1, "files": files}, indent=2) + "\n",
        encoding="utf-8",
    )
    size = sum(len(canonical_bytes(p)) for p in target.rglob("*") if p.is_file())
    if size > record["maxUnpackedBytes"]:
        raise ValueError(f"{platform}/{profile} exceeds unpacked budget: {size}")


def assemble(platform, target, profile="compact", plugin=False):
    catalog = json.loads(
        (SOURCE / "references/font-catalog.json").read_text(encoding="utf-8")
    )
    allowed = {
        "OFL-1.1",
        "Apache-2.0",
        "GUST Font License 1.0 / LPPL-1.3c-or-later",
        "Author No Rights Reserved dedication (directory: CC0-1.0)",
    }
    known = {
        face["sha256"]
        for family in catalog["fonts"]
        if family["status"] == "bundled"
        for face in family["files"]
        if face.get("path")
    }
    for family in catalog["fonts"]:
        if family["status"] == "bundled" and family["license"] not in allowed:
            raise ValueError("Unreviewed bundled font license")
    for resource in SOURCE.rglob("*"):
        if resource.name == "user-fonts.json":
            raise ValueError("Private project font manifests cannot enter a release")
        if resource.is_file() and resource.suffix.lower() in (
            ".ttf",
            ".otf",
            ".woff",
            ".woff2",
            ".ttc",
        ):
            if hashlib.sha256(resource.read_bytes()).hexdigest() not in known:
                raise ValueError("Unreviewed font binary in release: " + resource.name)

    def omitted(directory, names):
        excluded = {n for n in names if n == "__pycache__" or n.endswith(".pyc")}
        if profile == "compact" and Path(directory) == SOURCE / "assets/fonts":
            excluded.update(n for n in names if n not in LITE_FAMILIES)
        return excluded

    target.mkdir(parents=True)
    for name in ("references", "scripts", "assets", "evals"):
        shutil.copytree(
            SOURCE / name,
            target / name,
            ignore=omitted,
        )
    for name in ("LICENSE.txt", "PROVENANCE.md"):
        shutil.copy2(SOURCE / name, target / name)
    (target / "SKILL.md").write_text(
        skill_text(platform, plugin), encoding="utf-8", newline="\n"
    )
    notices = (ROOT / "THIRD_PARTY_NOTICES.md").read_text(encoding="utf-8")
    notices = notices.replace("skills/dazzler-frontend/", "")
    (target / "THIRD_PARTY_NOTICES.md").write_text(notices, encoding="utf-8")
    shutil.copy2(ROOT / f"platforms/{platform}/README.md", target / "INSTALL.md")
    if platform == "codex":
        shutil.copytree(SOURCE / "agents", target / "agents")
    else:
        shutil.copy2(
            ROOT / f"platforms/{platform}/HOST.md",
            target / "references/platform-host.md",
        )
        for starter in (target / "references").glob("starters*"):
            text = starter.read_text(encoding="utf-8")
            text = text.replace(
                "Use $dazzler-frontend to ",
                (
                    ("/dazzler:dazzler-frontend " if plugin else "/dazzler-frontend ")
                    if platform == "claude"
                    else "Use Dazzler to "
                ),
            )
            starter.write_text(text, encoding="utf-8", newline="\n")
    seal_profile(target, platform, profile)
    return target


def canonical_bytes(path):
    data = path.read_bytes()
    preserved = (
        any(part in ("assets", "vendor", "gdc") for part in path.parts)
        or path.name.endswith("-LICENSE.txt")
        or "dazzler-templates" in path.parts
    )
    if not preserved and (
        path.name == "LICENSE"
        or path.suffix
        in (
            ".md",
            ".py",
            ".mjs",
            ".cjs",
            ".js",
            ".css",
            ".json",
            ".yaml",
            ".yml",
            ".R",
            ".txt",
        )
    ):
        data = data.replace(b"\r\n", b"\n")
    return data


def archive(folder, output):
    # Stable names/order/timestamps; original binary/license bytes remain unchanged.
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as bundle:
        for path in sorted(
            folder.rglob("*"), key=lambda p: p.relative_to(folder).as_posix()
        ):
            if path.is_file():
                info = zipfile.ZipInfo(
                    path.relative_to(folder.parent).as_posix(), (2026, 1, 1, 0, 0, 0)
                )
                info.create_system = 3
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o100644 << 16
                bundle.writestr(info, canonical_bytes(path), compresslevel=9)


def build(destination):
    destination = Path(destination).resolve()
    if destination.exists():
        raise ValueError(
            "Use a new output directory; existing outputs are not overwritten"
        )
    destination.mkdir(parents=True)
    manifest = json.loads((ROOT / ".codex-plugin/plugin.json").read_text())
    for platform in PLATFORMS:
        with tempfile.TemporaryDirectory(dir=destination, prefix="build-") as temp:
            stage = Path(temp).resolve()
            assert stage.parent == destination
            skill = assemble(
                platform,
                stage / ("dazzler" if platform == "grokbot" else "dazzler-frontend"),
            )
            archive(skill, destination / f"dazzler-{platform}.zip")
    with tempfile.TemporaryDirectory(dir=destination, prefix="build-") as temp:
        extension = Path(temp) / "dazzler"
        assemble("gemini", extension / "skills/dazzler-frontend")
        shutil.copy2(
            ROOT / "gemini-extension.json", extension / "gemini-extension.json"
        )
        shutil.copy2(ROOT / "LICENSE", extension / "LICENSE")
        archive(extension, destination / "dazzler-gemini-extension.zip")
    # Keep the previous upload filename as a byte-identical compatibility alias.
    shutil.copyfile(
        destination / "dazzler-claude.zip", destination / "dazzler-claude-compact.zip"
    )
    with tempfile.TemporaryDirectory(dir=destination, prefix="build-") as temp:
        stage = Path(temp).resolve()
        assert stage.parent == destination
        plugin = stage / "dazzler"
        assemble("claude", plugin / "skills/dazzler-frontend", plugin=True)
        (plugin / ".claude-plugin").mkdir()
        (plugin / ".claude-plugin/plugin.json").write_text(
            json.dumps(
                {
                    "name": "dazzler",
                    "version": manifest["version"],
                    "description": manifest["description"],
                    "author": manifest["author"],
                    "repository": manifest["repository"],
                    "license": "Apache-2.0",
                },
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
        shutil.copy2(ROOT / "LICENSE", plugin / "LICENSE")
        shutil.copy2(ROOT / "platforms/claude/README.md", plugin / "README.md")
        archive(plugin, destination / "dazzler-claude-plugin.zip")
        templates = stage / "dazzler-templates"
        shutil.copytree(SOURCE / "assets/templates", templates)
        archive(templates, destination / "dazzler-templates.zip")
    (destination / "DAZZLER-PROMPT.md").write_bytes(
        canonical_bytes(ROOT / "platforms/portable/DAZZLER-PROMPT.md")
    )
    (destination / "install_skill.py").write_bytes(
        canonical_bytes(ROOT / "tools/install_skill.py")
    )
    sizes = {}
    for file in sorted(destination.glob("*.zip")):
        with zipfile.ZipFile(file) as bundle:
            if (
                file.stat().st_size > 24_000_000
                or sum(x.file_size for x in bundle.infolist()) > 24_000_000
            ):
                raise ValueError(f"Release archive exceeds 24 MB budget: {file.name}")
            sizes[file.name] = {
                "compressedBytes": file.stat().st_size,
                "unpackedBytes": sum(x.file_size for x in bundle.infolist()),
                "files": len(bundle.infolist()),
            }
    (destination / "PACKAGE-SIZES.json").write_text(
        json.dumps({"version": manifest["version"], "packages": sizes}, indent=2)
        + "\n",
        encoding="utf-8",
        newline="\n",
    )
    files = sorted(destination.glob("*.zip")) + [
        destination / "DAZZLER-PROMPT.md",
        destination / "PACKAGE-SIZES.json",
        destination / "install_skill.py",
    ]
    (destination / "SHA256SUMS.txt").write_text(
        "".join(
            hashlib.sha256(p.read_bytes()).hexdigest() + "  " + p.name + "\n"
            for p in files
        ),
        encoding="utf-8",
        newline="\n",
    )
    return files


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", required=True, type=Path)
    args = parser.parse_args()
    for path in build(args.out):
        print(path)
