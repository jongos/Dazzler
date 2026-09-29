"""Offline font shortlist and project-local export. Python standard library only."""

import argparse
import hashlib
import json
import shutil
import sys
import unicodedata
from bisect import bisect_right
from pathlib import Path
from urllib.parse import quote

SKILL = Path(__file__).resolve().parents[1]
CATALOG = SKILL / "references/font-catalog.json"


def load():
    return json.loads(CATALOG.read_text(encoding="utf-8"))


def covers(face, text):
    # Check NFC characters rather than inferring support from script labels.
    chars = {ord(c) for c in unicodedata.normalize("NFC", text) if c not in "\n\r\t"}
    return covers_codes(face, chars)


def covers_codes(face, chars):
    ranges = face["unicode_ranges"]
    starts = [lo for lo, hi in ranges]
    return all(
        (index := bisect_right(starts, cp) - 1) >= 0 and cp <= ranges[index][1]
        for cp in chars
    )


def supports_weight(face, weight):
    values = [float(v) for v in face["css_weight"].split()]
    return min(values) <= weight <= max(values)


def shortlist(
    fonts,
    role,
    moods=(),
    text="",
    weight=400,
    italic=False,
    monospace=False,
    features=(),
    max_bytes=None,
    family=None,
):
    results = []
    chars = {ord(c) for c in unicodedata.normalize("NFC", text) if c not in "\n\r\t"}
    for font in fonts:
        if font["status"] not in ("bundled", "project-local") or (
            family and font["id"] != family
        ):
            continue
        if role not in font["roles"]:
            continue
        faces = []
        for face in font["files"]:
            if face["css_style"] != ("italic" if italic else "normal"):
                continue
            if not supports_weight(face, weight) or not covers_codes(face, chars):
                continue
            if monospace and not face["fixed_pitch"]:
                continue
            if max_bytes is not None and face["bytes"] > max_bytes:
                continue
            if any(
                ft not in face["features"]
                and not (ft == "tnum" and face["tabular_default_digits"])
                for ft in features
            ):
                continue
            faces.append(face)
        if not faces:
            continue
        matches = sorted(set(moods) & set(font["moods"]))
        # Scores express curated fit only, not a learned or objective quality measure.
        score = 10 + 3 * len(matches)
        face = min(faces, key=lambda f: (f["bytes"], f["filename"]))
        results.append(
            {
                "id": font["id"],
                "name": font["name"],
                "score": score,
                "matched_moods": matches,
                "description": font["description"],
                "roles": font["roles"],
                "reference": font.get(
                    "reference", "references/fonts/" + font["id"] + ".md"
                ),
                "cautions": font["cautions"],
                "license": font["license"],
                "file": face["filename"],
                "css_family": face["css_family"],
                "css_weight": face["css_weight"],
                "css_style": face["css_style"],
                "bytes": face["bytes"],
                "alternatives": [f["filename"] for f in faces],
                "coverage_checked": bool(text),
                "reason": "Matches role and requested file-level constraints; compare visually before final selection.",
            }
        )
    return sorted(results, key=lambda r: (-r["score"], r["name"]))


def checked_file(entry):
    path = (SKILL / entry["path"]).resolve()
    if not path.is_relative_to(SKILL.resolve()):
        raise ValueError("Asset path leaves the skill directory")
    if hashlib.sha256(path.read_bytes()).hexdigest() != entry["sha256"]:
        raise ValueError(f"Checksum mismatch: {path.name}")
    return path


def css_for(faces):
    blocks = [
        "/* Unmodified bundled fonts; keep accompanying licenses and SOURCE.md. */"
    ]
    for face in faces:
        fmt = {"otf": "opentype", "ttf": "truetype", "woff": "woff", "woff2": "woff2"}[
            face["format"]
        ]
        blocks.append(
            "@font-face {\n"
            f"  font-family: {json.dumps(face['css_family'])};\n"
            f"  src: url(\"./{quote(face['filename'])}\") format(\"{fmt}\");\n"
            f"  font-weight: {face['css_weight']};\n"
            f"  font-style: {face['css_style']};\n"
            f"  font-stretch: {face['css_stretch']};\n"
            "  font-display: swap;\n}"
        )
    return "\n\n".join(blocks) + "\n"


def export(font, destination, filenames=()):
    if font["status"] != "bundled":
        raise ValueError(font.get("manual_steps", "Font requires manual review"))
    known = {f["filename"] for f in font["files"]}
    if set(filenames) - known:
        raise ValueError(
            "Unknown file selection: " + ", ".join(sorted(set(filenames) - known))
        )
    faces = [f for f in font["files"] if not filenames or f["filename"] in filenames]
    target = Path(destination).expanduser().resolve() / font["id"]
    if target.exists():
        raise ValueError(
            f"Destination already exists; inspect it instead of overwriting: {target}"
        )
    if target.is_relative_to(SKILL.resolve()):
        raise ValueError("Export to the project, not inside the installed skill")
    if not font.get("support_files"):
        raise ValueError("Missing license/provenance support files")
    entries = faces + font["support_files"]
    # Preflight every hash before writing anything.
    sources = [(checked_file(e), e) for e in entries]
    target.mkdir(parents=True)
    for src, _ in sources:
        shutil.copy2(src, target / src.name)
    (target / "fonts.css").write_text(css_for(faces), encoding="utf-8")
    (target / "selection.json").write_text(
        json.dumps(
            {
                "catalog_date": load()["checked_at"],
                "family": font["id"],
                "license": font["license"],
                "selected_files": [f["filename"] for f in faces],
                "note": "Project-local copy; no OS font installation or remote service was used.",
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    return target


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("list")
    rec = sub.add_parser("recommend")
    rec.add_argument(
        "--role", choices=["ui", "body", "heading", "display", "code"], required=True
    )
    rec.add_argument(
        "--mood", action="append", default=[], help="Repeat; see catalog mood tags"
    )
    txt = rec.add_mutually_exclusive_group()
    txt.add_argument("--text", default="")
    txt.add_argument("--text-file", type=Path)
    rec.add_argument("--weight", type=int, default=400)
    rec.add_argument("--italic", action="store_true")
    rec.add_argument("--monospace", action="store_true")
    rec.add_argument("--feature", action="append", default=[])
    rec.add_argument("--max-bytes", type=int)
    rec.add_argument("--family")
    rec.add_argument("--limit", type=int, default=3)
    rec.add_argument(
        "--user-fonts",
        type=Path,
        help="Explicit project-local user-fonts.json; never discovered automatically",
    )
    exp = sub.add_parser("export")
    exp.add_argument("family")
    exp.add_argument("--dest", required=True, type=Path)
    exp.add_argument(
        "--file",
        action="append",
        default=[],
        help="Repeat to copy only required styles",
    )
    imp = sub.add_parser("import-local")
    imp.add_argument("--src", required=True, type=Path)
    imp.add_argument("--dest", required=True, type=Path)
    imp.add_argument("--license", required=True)
    imp.add_argument("--license-file", type=Path)
    args = parser.parse_args()
    fonts = load()["fonts"]
    try:
        if args.command == "import-local":
            from local_fonts import import_local

            result = import_local(args.src, args.dest, args.license, args.license_file)
        elif args.command == "list":
            result = [
                {k: f[k] for k in ("id", "name", "status", "roles", "moods", "license")}
                for f in fonts
            ]
        elif args.command == "recommend":
            if args.user_fonts:
                from local_fonts import project_catalog

                fonts += project_catalog(args.user_fonts)
            if not 1 <= args.weight <= 1000 or args.limit < 1:
                raise ValueError("Use a weight from 1 to 1000 and a positive limit")
            text = (
                args.text_file.read_text(encoding="utf-8")
                if args.text_file
                else args.text
            )
            result = shortlist(
                fonts,
                args.role,
                args.mood,
                text,
                args.weight,
                args.italic,
                args.monospace,
                args.feature,
                args.max_bytes,
                args.family,
            )[: args.limit]
            if not result:
                print(
                    json.dumps(
                        {
                            "matches": [],
                            "action": "No bundled face satisfies these constraints. Preserve required language/style needs; inspect the catalog or obtain a verified alternative.",
                        }
                    )
                )
                return 2
        else:
            font = next((f for f in fonts if f["id"] == args.family), None)
            if font is None:
                raise ValueError("Unknown family; use the list command")
            result = {"exported_to": str(export(font, args.dest, args.file))}
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except (ValueError, OSError) as exc:
        print(str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
