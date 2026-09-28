"""Validate bundled assets against the inventory and optionally re-inspect binaries."""

import argparse
import importlib.util
import json
import hashlib
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills/dazzler-frontend"
spec = importlib.util.spec_from_file_location("font_helper", SKILL / "scripts/fonts.py")
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)


def validate(binary=False, staged=False):
    data = helper.load()
    ids = [f["id"] for f in data["fonts"]]
    assert len(ids) == len(set(ids)) == data["family_count"]
    count = 0
    referenced = set()
    for family in data["fonts"]:
        if family["status"] != "bundled":
            assert all(f["path"] is None for f in family["files"])
            assert family.get("manual_steps")
            continue
        assert family["files"] and family["support_files"]
        descriptors = set()
        for entry in family["files"] + family["support_files"]:
            path = helper.checked_file(entry)
            referenced.add(path.resolve())
            assert path.stat().st_size == entry["bytes"]
            if staged:
                relative = path.relative_to(ROOT).as_posix()
                contents = subprocess.check_output(
                    ["git", "show", ":" + relative], cwd=ROOT
                )
                assert (
                    hashlib.sha256(contents).hexdigest() == entry["sha256"]
                ), f"Git byte drift: {relative}"
        for face in family["files"]:
            count += 1
            key = (
                face["css_family"],
                face["css_weight"],
                face["css_style"],
                face["css_stretch"],
            )
            assert key not in descriptors, f'Ambiguous CSS faces: {family["id"]} {key}'
            descriptors.add(key)
            if binary:
                from inspect_font import inspect

                actual = inspect(helper.checked_file(face))
                actual.pop("license_description")
                for field, value in actual.items():
                    assert (
                        value == face[field]
                    ), f'Metadata drift: {family["id"]}/{face["filename"]}: {field}'
    on_disk = {p.resolve() for p in (SKILL / "assets/fonts").rglob("*") if p.is_file()}
    assert on_disk == referenced, "Uncataloged or missing asset files"
    assert (
        sum(f["status"] == "bundled" for f in data["fonts"])
        == data["bundled_family_count"]
    )
    print(
        f"Validated {len(ids)} families, {count} bundled font binaries, {len(referenced)} total asset files."
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--inspect-binaries", action="store_true")
    parser.add_argument("--staged", action="store_true")
    args = parser.parse_args()
    validate(args.inspect_binaries, args.staged)
