"""Create or restore the reviewed local build kit; never downloads or runs install scripts."""

import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import platform
import shutil
import zipfile
import re

ROOT = Path(__file__).resolve().parents[1]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def create(output):
    output = Path(output)
    output.mkdir(parents=True, exist_ok=False)
    archive_name = (
        "offline-build-"
        + platform.system().lower()
        + "-"
        + {"AMD64": "x64", "x86_64": "x64", "aarch64": "arm64"}.get(
            platform.machine(), platform.machine().lower()
        )
        + ".zip"
    )
    paths = []
    for directory in (
        "tools",
        "tests",
        "skills",
        "node_modules",
        "platforms",
        ".codex-plugin",
        ".claude-plugin",
        ".cursor-plugin",
        "assets",
        ".github",
        "docs",
        "maintenance/phase6",
        "maintenance/recipe-integration",
        "maintenance/gallery-production/v0.29.0/previous-v0.28.1",
    ):
        paths.extend(
            p
            for p in (ROOT / directory).rglob("*")
            if p.is_file()
            and not p.is_symlink()
            and not any(part in ("__pycache__", ".bin") for part in p.parts)
        )
    paths.extend(
        ROOT / name
        for name in (
            ".npmrc",
            ".prettierrc.json",
            ".prettierignore",
            "AGENTS.md",
            "maintenance/MAINTENANCE.md",
            "maintenance/requirements.txt",
            "maintenance/GALLERY-GENERATION.md",
            "maintenance/gallery-release.json",
            "maintenance/gallery-production/v0.29.0/document-briefs.json",
            "maintenance/gallery-production/v0.29.0/interface-briefs.json",
            "maintenance/gallery-production/v0.29.0/browser-checks.json",
            "maintenance/gallery-production/v0.29.0/native-fonts.json",
            "maintenance/gallery-production/v0.29.0/REVIEW.md",
            "maintenance/gallery-production/v0.29.0/recipe-consideration.json",
            "maintenance/ONBOARDING.md",
            "maintenance/DESIGN-PHILOSOPHY.md",
            "maintenance/RELEASE-023.md",
            "maintenance/SECURITY-040.md",
            "maintenance/PHASE2-VALIDATION.md",
            "maintenance/PHASE3-VALIDATION.md",
            "maintenance/PHASE4-VALIDATION.md",
            "maintenance/PHASE5-VALIDATION.md",
            "maintenance/reports/composition-0.19.0.json",
            "maintenance/reports/codex-triggering-2026-09-28.json",
            "maintenance/reports/skills-cli-1.7.0.json",
            "maintenance/reports/recipes-028.md",
            "README.md",
            "CHANGELOG.md",
            ".gitattributes",
            "plugin.json",
            "gemini-extension.json",
            "package.json",
            "package-lock.json",
            "LICENSE",
            "THIRD_PARTY_NOTICES.md",
        )
    )
    inventory = {}
    with zipfile.ZipFile(
        output / archive_name, "w", compression=zipfile.ZIP_DEFLATED
    ) as archive:
        for path in sorted(paths):
            data = path.read_bytes()
            name = path.relative_to(ROOT).as_posix()
            info = zipfile.ZipInfo(name, (2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, data)
            inventory[name] = sha(data)
    manifest = {
        "schemaVersion": 2,
        "archive": archive_name,
        "platform": platform.system(),
        "architecture": platform.machine(),
        "archiveSha256": sha((output / archive_name).read_bytes()),
        "files": inventory,
        "notes": "Complete local build inputs, original licenses and pinned package source. Node/Python are host prerequisites. The esbuild executable is platform-specific. No install scripts or network needed on the recorded platform.",
    }
    (output / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    print(
        f"Archived {len(inventory)} files, {(output/archive_name).stat().st_size} bytes: {archive_name}"
    )


def restore(source, target):
    source = Path(source)
    target = Path(target).resolve()
    manifest = json.loads((source / "manifest.json").read_text(encoding="utf-8"))
    name = manifest.get("archive", "offline-build.zip")
    if not re.fullmatch(r"offline-build(?:-[a-z0-9-]+)?\.zip", name):
        raise ValueError("Unsafe archive name")
    if manifest.get("platform") and (
        manifest["platform"] != platform.system()
        or manifest["architecture"] != platform.machine()
    ):
        raise ValueError(
            "This kit requires its recorded platform and architecture; use the package lock on other systems"
        )
    archive = source / name
    if (
        archive.stat().st_size > 150_000_000
        or sha(archive.read_bytes()) != manifest["archiveSha256"]
    ):
        raise ValueError("Build archive integrity failure")
    if target.exists():
        raise ValueError("Use a new destination")
    # Validate every entry before creating a destination; never trust ZIP extraction paths.
    with zipfile.ZipFile(archive) as z:
        entries = z.infolist()
        if len(entries) > 15000 or sum(i.file_size for i in entries) > 300_000_000:
            raise ValueError("Archive exceeds limits")
        names = [i.filename for i in entries]
        if len(set(names)) != len(names) or set(names) != set(manifest["files"]):
            raise ValueError("Archive inventory mismatch")
        for info in entries:
            name = PurePosixPath(info.filename)
            if (
                name.is_absolute()
                or ".." in name.parts
                or "\\" in info.filename
                or ":" in info.filename
                or (info.external_attr >> 16) & 0o170000 == 0o120000
            ):
                raise ValueError("Unsafe archive entry")
            if sha(z.read(info)) != manifest["files"][info.filename]:
                raise ValueError("Modified archive entry")
        target.mkdir(parents=True)
        for info in entries:
            path = target / info.filename
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(z.read(info))
    print(
        json.dumps(
            {
                "restored": str(target),
                "platform": manifest["platform"],
                "architecture": manifest["architecture"],
                "network": "not used",
                "installationScripts": "not run",
            }
        )
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="action", required=True)
    p = sub.add_parser("create")
    p.add_argument("--out", required=True)
    p = sub.add_parser("restore")
    p.add_argument("--from", dest="source", required=True)
    p.add_argument("--out", required=True)
    args = parser.parse_args()
    if args.action == "create":
        create(args.out)
    else:
        restore(args.source, args.out)
