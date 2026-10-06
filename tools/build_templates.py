"""Build the original Dazzler templates; python-docx is an authoring dependency only."""

import argparse
import hashlib
import html
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

sys.path.insert(
    0, str(Path(__file__).resolve().parents[1] / "skills/dazzler-frontend/scripts")
)
from headings import heading, html_headings
from template_documents import DOCS
from template_interfaces import UIS, build_ui
from template_editorial import render_docx, render_html
from template_showcase import enrich
from template_features import prepare

DOCS, UIS = enrich(DOCS, UIS)

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills/dazzler-frontend"
OUT = SKILL / "assets/templates"
VERSION = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))["version"]


def fonts():
    folder = OUT / "fonts"
    folder.mkdir(exist_ok=True)
    selected = [
        ("work-sans", "WorkSans[wght].ttf"),
        ("young-serif", "Young-Serif[wght].woff2"),
        ("archivo", "Archivo[wdth,wght].ttf"),
        ("libre-baskerville", "LibreBaskerville[wght].woff2"),
        ("poppins", "Poppins-Bold.ttf"),
        ("oswald", "Oswald[wght].woff2"),
        ("office-code-pro", "OfficeCodePro-Regular.woff2"),
    ]
    italics = {
        "work-sans": "WorkSans-Italic[wght].ttf",
        "young-serif": "Young-Serif-Italic[wght].woff2",
        "poppins": "Poppins-BoldItalic.ttf",
        "archivo": "Archivo-Italic[wdth,wght].ttf",
        "libre-baskerville": "LibreBaskerville-Italic[wght].woff2",
    }
    for family, filename in selected:
        filenames = [filename] + ([italics[family]] if family in italics else [])
        if not all((folder / family / name).exists() for name in filenames):
            with tempfile.TemporaryDirectory() as scratch:
                subprocess.run(
                    [
                        sys.executable,
                        str(SKILL / "scripts/fonts.py"),
                        "export",
                        family,
                        "--dest",
                        scratch,
                        *[arg for name in filenames for arg in ["--file", name]],
                    ],
                    check=True,
                    capture_output=True,
                )
                shutil.copytree(
                    Path(scratch) / family, folder / family, dirs_exist_ok=True
                )
    (folder / "fonts.css").write_text(
        "".join('@import url("' + family + '/fonts.css");\n' for family, _ in selected),
        encoding="utf-8",
    )


def gallery():
    from template_gallery import publish

    publish(DOCS, UIS, OUT, VERSION)


def refresh_hashes(catalog):
    catalog["files"] = {
        p.relative_to(OUT).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest()
        for p in sorted(OUT.rglob("*"))
        if p.is_file() and p.name != "catalog.json"
    }
    (OUT / "catalog.json").write_text(
        json.dumps(catalog, indent=2) + "\n", encoding="utf-8"
    )


def build(web_only=False):
    if web_only and not all((OUT / "docx" / f"{d['id']}.docx").is_file() for d in DOCS):
        raise ValueError("Build the Word templates before refreshing web previews")
    for name in ["docx", "html", "ui"]:
        (OUT / name).mkdir(parents=True, exist_ok=True)
    fonts()
    prepare(DOCS, UIS, OUT)
    catalog = {
        "schemaVersion": 3,
        "version": VERSION,
        "creator": "Jon Gosier",
        "license": "Apache-2.0",
        "templates": [],
    }
    for d in DOCS:
        d["title"] = heading(d["title"])
        for page in d["pages"]:
            page["title"] = heading(page["title"])
            for block in page.get("blocks", []):
                if block.get("type") == "h":
                    block["text"] = heading(block["text"])
        if not web_only:
            render_docx(d, OUT / "docx" / f"{d['id']}.docx")
        render_html(d, OUT / "html" / f"{d['id']}.html")
        for format in ["docx", "html"]:
            catalog["templates"].append(
                dict(
                    id=format + "-" + d["id"],
                    category=d["id"],
                    format=format,
                    title=d["title"],
                    use=d["use"],
                    path=f"{format}/{d['id']}.{format}",
                    fonts=(
                        [d["font"], "Arial"]
                        if format == "docx"
                        else ["Work Sans", d["headingFont"]]
                    ),
                    design=d["voice"],
                    capabilities=d["capabilities"],
                    dataset="data/" + d["id"] + ".json",
                    plannedPages=len(d["pages"]),
                    orientation="landscape" if d.get("landscape") else "portrait",
                    content="Fictional worked example. Replace sample details and verify facts before use.",
                )
            )
    for d in UIS:
        d["title"] = heading(d["title"])
        build_ui(d, OUT / "ui" / d["id"])
        catalog["templates"].append(
            dict(
                id=d["id"],
                category=d["category"],
                format="ui",
                title=d["title"],
                use=d["intro"],
                path="ui/" + d["id"],
                layout=d["layout"],
                files=["index.html", "styles.css", "template.json"],
                demo=True,
            )
        )
    policy_css = "\n:root{--measure-body:60ch;--grid-columns:4;--grid-gutter:1rem;--grid-margin:1.5rem} :where(p,li,blockquote,figcaption,dd):not(:where(table *,nav *,pre *,code *)){max-inline-size:var(--measure-body)} [data-grid]{display:grid;grid-template-columns:repeat(var(--grid-columns),minmax(0,1fr));gap:var(--grid-gutter)} @media(min-width:48rem){:root{--grid-columns:8}} @media(min-width:75rem){:root{--grid-columns:12}}\n"
    for path in [*(OUT / "html").glob("*.html"), *(OUT / "ui").glob("*/index.html")]:
        text = html_headings(path.read_text(encoding="utf-8"))
        if "</style>" in text:
            text = text.replace("</style>", policy_css + "</style>", 1)
        else:
            css = path.parent / "styles.css"
            css.write_text(
                css.read_text(encoding="utf-8") + policy_css, encoding="utf-8"
            )
        path.write_text(text, encoding="utf-8")
    shutil.copy2(SKILL / "LICENSE.txt", OUT / "LICENSE.txt")
    (OUT / "NOTICE.txt").write_text(
        "Original Dazzler templates copyright 2026 Jon Gosier. Apache-2.0. All bundled fonts retain the notices in fonts/. Charts use the local Dazzler visualization workflow; the seating guide retains its accompanying runtime notices. All content is fictional sample material. DOCX fonts are referenced, not embedded.\n",
        encoding="utf-8",
    )
    subprocess.run(
        ["node", str(ROOT / "tools/prepare_template_sources.mjs")], check=True
    )
    gallery()
    refresh_hashes(catalog)
    print(
        "Built 20 web templates; retained Word files."
        if web_only
        else "Built 10 DOCX, 10 HTML and 10 purpose-specific UI templates."
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--gallery-only", action="store_true")
    parser.add_argument("--web-only", action="store_true")
    args = parser.parse_args()
    if args.gallery_only:
        gallery()
        refresh_hashes(json.loads((OUT / "catalog.json").read_text(encoding="utf-8")))
    else:
        build(web_only=args.web_only)
