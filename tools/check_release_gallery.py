"""Require fresh gallery evidence or a version-bound owner preservation record."""

import hashlib
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tools.validate_gallery_release import validate

ROOT = Path(__file__).resolve().parents[1]
TEXT = {".html", ".css", ".json", ".js", ".mjs", ".txt", ".md", ".svg", ".csv"}


def digest(path):
    data = path.read_bytes()
    if path.suffix.lower() in TEXT:
        data = data.replace(b"\r\n", b"\n")
    return hashlib.sha256(data).hexdigest()


def inventory(root):
    assets = root / "skills/dazzler-frontend/assets"
    docs = root / "docs"
    return {
        p.relative_to(root).as_posix(): digest(p)
        for base in (assets, docs)
        for p in base.rglob("*")
        if p.is_file()
        and (
            base == assets
            or p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".svg"}
        )
    }


def check(root=ROOT):
    record = root / "maintenance/gallery-preservation.json"
    version = json.loads((root / "package.json").read_text())["version"]
    if not record.exists():
        return validate(root / "maintenance/gallery-release.json", root)
    data = json.loads(record.read_text())
    if data.get("version") != version:
        raise ValueError("Preservation authorization does not cover this release")
    if not data.get("ownerInstruction") or len(data.get("baselineCommit", "")) != 40:
        raise ValueError("Preservation record lacks owner instruction or baseline")
    skill = root / "skills/dazzler-frontend"
    if data.get("runtimeSha256") != digest(
        skill / "references/integrity.json"
    ) or data.get("skillSha256") != digest(skill / "SKILL.md"):
        raise ValueError("Preservation record is stale after runtime/skill changes")
    if not data.get("files") or data["files"] != inventory(root):
        raise ValueError("Preserved assets changed, disappeared or were added")
    print(
        f"Preserved gallery verified: {len(data['files'])} files; no fresh visual review claimed"
    )
    return len(data["files"])


if __name__ == "__main__":
    check()
