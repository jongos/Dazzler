"""Vendor a user-selected local Style Science checkout into Dazzler, with hashes."""

from pathlib import Path
import argparse
import hashlib
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    "engine.mjs": "engine.mjs",
    "gdc.py": "gdc.py",
    "html.mjs": "html.mjs",
    "knowledge/registry.json": "registry.json",
    "schemas/plan.schema.json": "plan.schema.json",
    "examples/plan.json": "example-plan.json",
    "LICENSE": "LICENSE",
}


def vendor(source, check=False, revision=None):
    source = source.resolve()
    target = ROOT / "skills/dazzler-frontend/scripts/gdc"
    actual = json.loads((target / "provenance.json").read_text()) if check else None
    ref = revision or (actual["sourceRevision"] if check else "HEAD")
    revision = subprocess.check_output(
        ["git", "-C", str(source), "rev-parse", "--verify", ref + "^{commit}"],
        text=True,
    ).strip()

    def blob(name):
        return subprocess.check_output(
            ["git", "-C", str(source), "cat-file", "blob", revision + ":" + name]
        )

    package = json.loads(blob("package.json"))
    if package["name"] != "@style-science/gdc":
        raise ValueError("Expected Style Science GDC checkout")
    data = {dest: blob(src) for src, dest in FILES.items()}
    hashes = {name: hashlib.sha256(value).hexdigest() for name, value in data.items()}
    manifest = {
        "schemaVersion": 1,
        "repository": "https://github.com/jongos/style-science",
        "version": package["version"],
        "sourceRevision": revision,
        "files": hashes,
    }
    if check:
        errors = []
        for key in ("schemaVersion", "repository", "version", "sourceRevision"):
            if actual.get(key) != manifest[key]:
                errors.append(
                    f"Metadata drift: {key}: {actual.get(key)} != {manifest[key]}"
                )
        if set(actual.get("files", {})) != set(hashes):
            errors.append("Manifest file membership drift")
        for name, digest in hashes.items():
            if actual.get("files", {}).get(name) != digest:
                errors.append(f"Upstream content drift: {name}")
            path = target / name
            if (
                not path.is_file()
                or hashlib.sha256(path.read_bytes()).hexdigest() != digest
            ):
                errors.append(f"Vendored content drift: {name}")
        if {p.name for p in target.iterdir() if p.is_file()} != set(hashes) | {
            "provenance.json"
        }:
            errors.append("Unexpected vendored file membership")
        if errors:
            raise ValueError("\n".join(errors))
        print("GDC consumer matches committed upstream blobs", revision)
        return
    target.mkdir(parents=True, exist_ok=True)
    for name, value in data.items():
        (target / name).write_bytes(value)
    (target / "provenance.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    print("Vendored GDC", package["version"], revision)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--check", action="store_true")
    parser.add_argument(
        "--revision",
        help="Immutable source commit; --check defaults to the recorded pin",
    )
    args = parser.parse_args()
    vendor(args.source, args.check, args.revision)
