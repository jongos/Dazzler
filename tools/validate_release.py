"""Reject release-version drift and owner-only instructions in the installable skill."""

import json, re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def validate_personal_paths(root=ROOT):
    names = (
        subprocess.check_output(["git", "ls-files", "-z"], cwd=root)
        .decode()
        .split("\0")
    )
    failures = []
    pattern = re.compile(
        r"[A-Za-z]:[\\/]Users[\\/](?!Public(?:[\\/]|$)|Default(?:[\\/]|$)|<|%|\$)[^\\/\s`\"']+",
        re.I,
    )
    for name in filter(None, names):
        path = root / name
        if not path.is_file():
            continue
        data = path.read_bytes()
        if b"\0" in data:
            continue
        try:
            text = data.decode("utf-8-sig")
        except UnicodeDecodeError:
            continue
        if pattern.search(text):
            failures.append(name)
    if failures:
        raise ValueError(
            "Personal Windows paths in tracked text: " + ", ".join(failures)
        )


def validate_recipe_release(provenance):
    if provenance.get("sourceWorkingTreeModified") is not False:
        raise ValueError(
            "Recipe release blocked: unpublished/modified source; resolve Dazzler #41 and Style-Science #20"
        )
    if provenance.get("redistributionTermsStatus", "").startswith("pending"):
        raise ValueError("Recipe release blocked: redistribution terms review pending")


def validate():
    validate_personal_paths(ROOT)
    validate_recipe_release(
        json.loads(
            (
                ROOT / "skills/dazzler-frontend/references/recipes/provenance.json"
            ).read_text(encoding="utf-8")
        )
    )
    version = json.loads((ROOT / "package.json").read_text())["version"]
    assert (
        json.loads((ROOT / ".codex-plugin/plugin.json").read_text())["version"]
        == version
    )
    for manifest in (
        "plugin.json",
        ".claude-plugin/plugin.json",
        ".cursor-plugin/plugin.json",
        "gemini-extension.json",
    ):
        assert json.loads((ROOT / manifest).read_text())["version"] == version, manifest
    lock = json.loads((ROOT / "package-lock.json").read_text())
    assert lock["version"] == version == lock["packages"][""]["version"]
    first = re.search(
        r"^## .*? — (\d+\.\d+\.\d+):",
        (ROOT / "CHANGELOG.md").read_text(encoding="utf-8"),
        re.M,
    )
    assert first and first[1] == version
    for file in [
        ROOT / "README.md",
        ROOT / "maintenance/ONBOARDING.md",
        ROOT / "docs/index.html",
        ROOT / "docs/guide.js",
        *list((ROOT / "platforms").rglob("*.md")),
    ]:
        text = file.read_text(encoding="utf-8")
        for found in re.findall(
            r"(?:releases/(?:download|tag)/v|tree/v|--version )(\d+\.\d+\.\d+)", text
        ):
            assert found == version, (file, found)
        assert not re.search(r"dist/platforms-\d+\.\d+\.\d+", text), file
    skill = ROOT / "skills/dazzler-frontend"
    assert not (skill / "MAINTENANCE.md").exists()
    for file in [skill / "SKILL.md", *list((skill / "references").rglob("*.md"))]:
        text = file.read_text(encoding="utf-8")
        assert not re.search(
            r"C:[\\/]Users[\\/]jongo|owner (?:explicitly )?authorized|without requesting separate push permission",
            text,
            re.I,
        ), file
    print("Release versions and installable permission boundaries passed:", version)


if __name__ == "__main__":
    validate()
