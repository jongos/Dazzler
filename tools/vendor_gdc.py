"""Vendor a user-selected local Style Science checkout into Dazzler, with hashes."""

from pathlib import Path
import argparse
import hashlib
import json
import shutil
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


def vendor(source, check=False):
    source = source.resolve()
    package = json.loads((source / "package.json").read_text(encoding="utf-8"))
    if package["name"] != "@style-science/gdc":
        raise ValueError("Expected Style Science GDC checkout")
    target = ROOT / "skills/dazzler-frontend/scripts/gdc"
    hashes = {
        dest: hashlib.sha256((source / src).read_bytes()).hexdigest()
        for src, dest in FILES.items()
    }
    revision = subprocess.check_output(
        ["git", "-C", str(source), "rev-parse", "HEAD"], text=True
    ).strip()
    dirty = subprocess.check_output(
        ["git", "-C", str(source), "status", "--porcelain"], text=True
    ).strip()
    if dirty:
        raise ValueError(
            "Commit the independent source before vendoring; do not label working changes as a revision"
        )
    manifest = {
        "schemaVersion": 1,
        "repository": "https://github.com/jongos/style-science",
        "version": package["version"],
        "sourceRevision": revision,
        "files": hashes,
    }
    if check:
        actual = json.loads((target / "provenance.json").read_text(encoding="utf-8"))
        assert actual == manifest, "GDC manifest drift"
        assert set(p.name for p in target.iterdir() if p.is_file()) == set(hashes) | {
            "provenance.json"
        }, "Unexpected vendored file"
        for name, digest in hashes.items():
            assert (
                hashlib.sha256((target / name).read_bytes()).hexdigest() == digest
            ), name
        print("GDC consumer matches independent source")
        return
    target.mkdir(parents=True, exist_ok=True)
    for src, dest in FILES.items():
        shutil.copy2(source / src, target / dest)
    (target / "provenance.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    print("Vendored GDC", package["version"])


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    vendor(args.source, args.check)
