"""Install a verified local Dazzler release into one explicit host and scope.

No downloads, telemetry, shell execution, automatic host detection or forced updates.
Checksums establish consistency with the supplied release manifest, not authenticity.
"""

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import stat
import subprocess
import sys
import tempfile
import uuid
import zipfile

HOSTS = {
    "codex": ".agents",
    "claude": ".claude",
    "gemini": ".gemini",
    "cursor": ".cursor",
    "copilot": ".github",
}
RECEIPT = ".dazzler-install.json"


def digest(path):
    result = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            result.update(block)
    return result.hexdigest()


def safe_path(path):
    path = Path(os.path.abspath(path))
    for parent in [path, *path.parents]:
        if parent.is_symlink() or (
            parent.exists()
            and getattr(parent.lstat(), "st_file_attributes", 0)
            & getattr(stat, "FILE_ATTRIBUTE_REPARSE_POINT", 0)
        ):
            raise ValueError(f"Linked path refused: {parent}")
    return path


def inventory(root):
    files = {}
    for path in root.rglob("*"):
        safe_path(path)
        if path.is_file() and path != root / RECEIPT:
            files[path.relative_to(root).as_posix()] = digest(path)
    return files


def clean_owned(root, host, scope):
    safe_path(root)
    if not (root / RECEIPT).is_file():
        raise ValueError(
            f"Found an unmanaged Dazzler installation at {root}; preserve it by moving it aside before installing. See ONBOARDING: Migrate a Manual Install."
        )
    receipt = json.loads(safe_path(root / RECEIPT).read_text(encoding="utf-8"))
    if (
        receipt.get("owner") != "dazzler-managed-v1"
        or receipt.get("host") != host
        or receipt.get("scope") != scope
    ):
        raise ValueError("This installation is not owned by this installer/host/scope")
    if inventory(root) != receipt["files"]:
        raise ValueError(
            "Local changes detected; preserve/reconcile them before updating or removing"
        )
    return receipt


def extract(archive, destination):
    seen = set()
    with zipfile.ZipFile(archive) as bundle:
        members = bundle.infolist()
        if len(members) > 4000 or sum(m.file_size for m in members) > 100_000_000:
            raise ValueError("Archive exceeds file or expanded-byte budget")
        for member in members:
            name = member.filename
            if RECEIPT in PurePosixPath(name).parts:
                raise ValueError("An archive cannot supply an installation receipt")
            parts = PurePosixPath(name).parts
            if (
                not parts
                or parts[0] != "dazzler-frontend"
                or "\\" in name
                or any(
                    p in (".", "..")
                    or ":" in p
                    or p.endswith((".", " "))
                    or re.fullmatch(
                        r"(?i)(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?", p
                    )
                    for p in parts
                )
            ):
                raise ValueError("Unsafe archive path")
            kind = stat.S_IFMT(member.external_attr >> 16)
            if kind not in (0, stat.S_IFREG, stat.S_IFDIR) or member.flag_bits & 1:
                raise ValueError(
                    "Links, special files and encrypted members are refused"
                )
            key = name.rstrip("/").casefold()
            if key in seen:
                raise ValueError("Duplicate or case-colliding archive path")
            seen.add(key)
            path = destination.joinpath(*parts)
            if member.is_dir():
                path.mkdir(parents=True, exist_ok=True)
            else:
                path.parent.mkdir(parents=True, exist_ok=True)
                with bundle.open(member) as source, path.open("xb") as target:
                    shutil.copyfileobj(source, target)
    return destination / "dazzler-frontend"


def operate(
    action, root, host, scope, archive=None, checksums=None, version=None, dry_run=False
):
    root = safe_path(root)
    if scope == "user" and host == "copilot":
        raise ValueError("This adapter supports Copilot project scope only")
    if not root.is_dir():
        raise ValueError(
            "Provide an existing explicit project root or isolated user home"
        )
    target = safe_path(root / HOSTS[host] / "skills/dazzler-frontend")
    backup = safe_path(root / ".dazzler-backups" / f"{host}-{scope}")
    result = {
        "action": action,
        "target": str(target),
        "host": host,
        "scope": scope,
        "dryRun": dry_run,
    }
    if target.exists():
        clean_owned(target, host, scope)
    elif action != "install":
        raise ValueError("No managed installation exists")
    if action == "uninstall":
        if not dry_run:
            shutil.rmtree(target)
        return {**result, "retainedBackup": backup.exists()}
    if action == "rollback":
        if not backup.exists():
            raise ValueError(
                "No previous version to roll back to; install an update before using rollback"
            )
        clean_owned(backup, host, scope)
        if not dry_run:
            swap = backup.parent / ("pending-" + uuid.uuid4().hex)
            target.rename(swap)
            try:
                backup.rename(target)
            except OSError:
                swap.rename(target)
                raise
            # If this rename fails, leave the newer copy at pending-* for recovery.
            # Never use auto-cleaning temporary storage for a user's installed copy.
            swap.rename(backup)
        return result
    if not version or not re.fullmatch(r"\d+\.\d+\.\d+", version):
        raise ValueError("Provide an exact release version")
    if archive is None or checksums is None:
        raise ValueError("Install requires --archive and --checksums")
    archive = safe_path(archive)
    if archive.name != f"dazzler-{host}.zip" or archive.stat().st_size > 80_000_000:
        raise ValueError("Select the matching full host skill archive")
    hashes = {}
    for line in Path(checksums).read_text(encoding="utf-8").splitlines():
        match = re.fullmatch(r"([a-f0-9]{64})  ([^/\\]+)", line)
        if not match or match[2] in hashes:
            raise ValueError("Malformed or duplicate checksum entry")
        hashes[match[2]] = match[1]
    if digest(archive) != hashes.get(archive.name):
        raise ValueError("Release checksum mismatch")
    if backup.exists():
        clean_owned(backup, host, scope)
    # Dry-run validates the archive and health too, without changing the install root.
    with tempfile.TemporaryDirectory(prefix="dazzler-check-") as temp:
        staged = extract(archive, Path(temp))
        profile = json.loads(
            (staged / "references/package-profile.json").read_text(encoding="utf-8")
        )
        if (
            profile.get("version") != version
            or profile.get("host") != host
            or profile.get("profile") != "full"
        ):
            raise ValueError(
                "Requested version/host does not match the full archive profile"
            )
        process = subprocess.run(
            [sys.executable, "-B", str(staged / "scripts/health.py")],
            capture_output=True,
            text=True,
            timeout=60,
            shell=False,
        )
        if process.returncode:
            raise ValueError("Extracted health check failed: " + process.stderr[-500:])
        receipt = {
            "owner": "dazzler-managed-v1",
            "version": version,
            "host": host,
            "scope": scope,
            "archiveSha256": hashes[archive.name],
            "files": inventory(staged),
        }
        (staged / RECEIPT).write_text(
            json.dumps(receipt, indent=2) + "\n", encoding="utf-8"
        )
        if dry_run:
            return {**result, "version": version, "health": "passed"}
        target.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(
            prefix="dazzler-stage-", dir=target.parent
        ) as adjacent:
            ready = Path(adjacent) / "ready"
            shutil.copytree(staged, ready)
            # Recheck immediately before changing managed files.
            if target.exists():
                clean_owned(target, host, scope)
            if target.exists():
                backup.parent.mkdir(parents=True, exist_ok=True)
                ignore = safe_path(backup.parent / ".gitignore")
                if scope == "project":
                    # Preserve existing rules; hide all backups including this file.
                    previous = (
                        ignore.read_text(encoding="utf-8") if ignore.exists() else ""
                    )
                    if "*" not in previous.splitlines():
                        with ignore.open("a", encoding="utf-8") as handle:
                            handle.write(
                                (
                                    "\n"
                                    if previous and not previous.endswith("\n")
                                    else ""
                                )
                                + "*\n"
                            )
                if backup.exists():
                    clean_owned(backup, host, scope)
                    shutil.rmtree(backup)
                target.rename(backup)
            try:
                ready.rename(target)
            except OSError:
                if backup.exists() and not target.exists():
                    backup.rename(target)
                raise
    return {**result, "version": version, "health": "passed"}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["install", "rollback", "uninstall"])
    parser.add_argument("--root", required=True, type=Path)
    parser.add_argument("--host", required=True, choices=HOSTS)
    parser.add_argument("--scope", required=True, choices=["project", "user"])
    parser.add_argument("--archive", type=Path)
    parser.add_argument("--checksums", type=Path)
    parser.add_argument("--version")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    try:
        print(json.dumps(operate(**vars(args)), indent=2))
    except (
        OSError,
        ValueError,
        KeyError,
        subprocess.TimeoutExpired,
        zipfile.BadZipFile,
    ) as error:
        parser.exit(1, str(error) + "\n")
