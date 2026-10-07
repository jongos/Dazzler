"""Discover and copy Dazzler templates with their required fonts and licenses. Standard library only."""

import argparse
import hashlib
import html
import json
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1] / "assets/templates"


def catalog():
    return json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))


def select(format=None, category=None):
    return [
        t
        for t in catalog()["templates"]
        if (not format or t["format"] == format)
        and (not category or t["category"] == category)
    ]


def export(identifier, destination):
    data = catalog()
    template = next((t for t in data["templates"] if t["id"] == identifier), None)
    if template is None:
        raise ValueError("Unknown template ID")
    target = Path(destination).resolve()
    if target == ROOT or target.is_relative_to(ROOT.parents[1]):
        raise ValueError("Export into the project, not the installed skill")
    if target.exists():
        raise ValueError("Use a new directory; existing files are not overwritten")
    rel = template["path"]
    prefix = rel + "/" if template["format"] == "ui" else None
    chart_id = template["category"] if template["format"] != "ui" else template["id"]
    required = [
        p
        for p in data["files"]
        if p == rel
        or (prefix and p.startswith(prefix))
        or (
            template["format"] == "html"
            and p.startswith("html/" + template["category"] + "/")
        )
        or p == template.get("dataset")
        or p in ("LICENSE.txt", "NOTICE.txt")
        or (
            template["format"] != "docx"
            and (
                p.startswith("fonts/")
                or p.startswith("charts/" + chart_id + "-")
                or p.startswith("charts/" + chart_id + ".")
            )
        )
    ]
    for relative in required:
        source = (ROOT / relative).resolve()
        if (
            not source.is_relative_to(ROOT)
            or hashlib.sha256(source.read_bytes()).hexdigest()
            != data["files"][relative]
        ):
            raise ValueError("Template resource integrity check failed: " + relative)
    target.mkdir(parents=True)
    for relative in required:
        out = target / relative
        out.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / relative, out)
    selection = {
        **template,
        "entrypoint": str(
            target / rel / ("index.html" if template["format"] == "ui" else "")
        ),
        "notice": "Copy preserves relative font links and licenses. Customize the exported copy; keep the installed library unchanged.",
    }
    (target / "selection.json").write_text(
        json.dumps(selection, indent=2) + "\n", encoding="utf-8"
    )
    if template["format"] != "docx":
        entry = rel + ("/index.html" if template["format"] == "ui" else "")
        (target / "index.html").write_text(
            '<!doctype html><html lang="en"><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1">'
            "<title>Exported Dazzler Example</title><main><h1>"
            + html.escape(template["title"])
            + '</h1><p><a href="'
            + html.escape(entry, quote=True)
            + '">Open the Example</a></p>'
            "<p>This copy contains one selected fictional example and its local dependencies.</p>"
            '<p><a href="NOTICE.txt">Credits and Notices</a></p></main></html>',
            encoding="utf-8",
        )
    return selection


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    sub = p.add_subparsers(dest="command", required=True)
    s = sub.add_parser("list")
    s.add_argument("--format", choices=["docx", "html", "ui"])
    s.add_argument("--category")
    e = sub.add_parser("export")
    e.add_argument("id")
    e.add_argument("--out", required=True)
    args = p.parse_args()
    try:
        result = (
            select(args.format, args.category)
            if args.command == "list"
            else export(args.id, args.out)
        )
    except (ValueError, OSError) as exc:
        raise SystemExit(str(exc))
    print(json.dumps(result, indent=2, ensure_ascii=False))
