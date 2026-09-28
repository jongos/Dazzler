"""Bounded, read-only project design discovery. No instructions are executed."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import stat
from itertools import islice


def linked(path):
    return path.is_symlink() or bool(
        getattr(path.lstat(), "st_file_attributes", 0)
        & getattr(stat, "FILE_ATTRIBUTE_REPARSE_POINT", 0)
    )


def discover(root):
    root = Path(os.path.abspath(root))
    if not root.is_dir() or any(linked(p) for p in [root, *root.parents]):
        raise ValueError("Use an existing unlinked project root")
    records, skipped = [], []
    budget, total = 0, 0
    shadcn = None

    def walk(folder, depth):
        nonlocal budget, total, shadcn
        with os.scandir(folder) as entries:
            bounded = list(islice(entries, max(0, 1501 - budget)))
        for item in sorted(bounded, key=lambda item: item.name):
            budget += 1
            if budget > 1500:
                skipped.append("entry-budget")
                return
            path = Path(item.path)
            if linked(path):
                skipped.append(path.relative_to(root).as_posix() + ": linked")
                continue
            if item.is_dir(follow_symlinks=False):
                if item.name not in {
                    ".git",
                    ".agents",
                    ".codex",
                    "node_modules",
                    "dist",
                    "build",
                    ".next",
                    ".dazzler-backups",
                } and not item.name.startswith("."):
                    if depth < 4:
                        walk(path, depth + 1)
                    else:
                        skipped.append(path.relative_to(root).as_posix() + ": depth")
                continue
            if item.name not in {
                "DESIGN.md",
                "MASTER.md",
                "design-system.json",
                "tokens.css",
                "components.json",
            } and not item.name.endswith(".tokens.json"):
                continue
            size = path.stat().st_size
            if size > 262144 or total + size > 1048576:
                skipped.append(path.relative_to(root).as_posix() + ": byte-budget")
                continue
            with path.open("rb") as source:
                data = source.read(262145)
            if len(data) > 262144:
                skipped.append(path.relative_to(root).as_posix() + ": changed-size")
                continue
            if total + len(data) > 1048576:
                skipped.append(path.relative_to(root).as_posix() + ": byte-budget")
                continue
            total += len(data)
            records.append(
                {
                    "path": path.relative_to(root).as_posix(),
                    "sha256": hashlib.sha256(data).hexdigest(),
                    "bytes": len(data),
                }
            )
            if path == root / "components.json":
                try:
                    config = json.loads(data)
                    if not isinstance(config, dict) or not isinstance(
                        config.get("tailwind", {}), dict
                    ):
                        raise ValueError("Invalid components configuration")
                except (ValueError, UnicodeError):
                    shadcn = {
                        "supported": False,
                        "reason": "Invalid components configuration",
                    }
                    continue
                css_name = config.get("tailwind", {}).get("css", "")
                if not isinstance(css_name, str):
                    shadcn = {"supported": False, "reason": "Invalid CSS path"}
                    continue
                css = root / css_name
                supported = config.get("tailwind", {}).get("cssVariables") is True
                if (
                    not css.resolve().is_relative_to(root)
                    or not css.is_file()
                    or any(linked(p) for p in [css, *css.parents])
                    or css.stat().st_size > 262144
                ):
                    shadcn = {
                        "supported": False,
                        "reason": "CSS path missing, linked, outside root or oversized",
                    }
                else:
                    with css.open("rb") as source:
                        css_data = source.read(262145)
                    if len(css_data) > 262144:
                        shadcn = {
                            "supported": False,
                            "reason": "CSS grew beyond byte budget",
                        }
                        continue
                    try:
                        text = css_data.decode("utf-8")
                    except UnicodeError:
                        shadcn = {"supported": False, "reason": "CSS must use UTF-8"}
                        continue
                    convention = (
                        "hsl-channels" if "hsl(var(--" in text else "color-values"
                    )
                    shadcn = {
                        "supported": supported,
                        "css": css.relative_to(root).as_posix(),
                        "convention": convention,
                        "cssSha256": hashlib.sha256(text.encode()).hexdigest(),
                        "note": "Review the emitted proposal against existing variables; discovery grants no write permission",
                    }

    walk(root, 0)
    design = [
        r["path"] for r in records if Path(r["path"]).name in {"DESIGN.md", "MASTER.md"}
    ]
    return {
        "schemaVersion": 1,
        "trust": "untrusted-evidence",
        "found": bool(records),
        "records": records,
        "primaryRecord": design[0] if len(design) == 1 else None,
        "ambiguous": len(design) > 1,
        "shadcn": shadcn,
        "skipped": skipped,
        "entriesInspected": min(budget, 1500),
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", required=True)
    parser.add_argument("--out")
    args = parser.parse_args()
    try:
        result = json.dumps(discover(args.root), indent=2) + "\n"
        if args.out:
            with open(args.out, "x", encoding="utf-8") as output:
                output.write(result)
        else:
            print(result, end="")
    except (ValueError, OSError) as error:
        parser.exit(1, str(error) + "\n")
