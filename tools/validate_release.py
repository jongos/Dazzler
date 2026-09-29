"""Reject release-version drift and owner-only instructions in the installable skill."""

import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def validate():
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
