"""Assemble the reviewed 0.27 gallery. Does not publish to a remote service.

Authoring and capture are separate steps. This copies reviewed artifacts, keeps
the previous working library in work/, and hashes the shipped dependencies.
"""

import hashlib
import html
import json
import shutil
from pathlib import Path
from PIL import Image
from gallery_027 import ROOT, SKILL, STAGE, OUT as AUTHORED, DOCS
from gallery_027_ui import U

TARGET = SKILL / "assets/templates"
OUT = STAGE / "reviewed-library"


def digest(p):
    data = p.read_bytes()
    if p.name in ("SKILL.md", "integrity.json"):
        data = data.replace(b"\r\n", b"\n")
    return hashlib.sha256(data).hexdigest()


def save_json(path, data):
    path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf8"
    )


def jpg(source, target, width=1100):
    im = Image.open(source).convert("RGB")
    im.thumbnail((width, 10000))
    im.save(target, quality=88, optimize=True)


def assemble():
    checks = json.loads((STAGE / "browser-checks.json").read_text())
    assert len(checks) == 20 and all(
        not x["errors"] and all(not v["overflow"] and not v["axe"] for v in x["views"])
        for x in checks
    )
    OUT.mkdir(exist_ok=True)
    for name in ["html", "ui", "fonts", "data", "previews"]:
        shutil.copytree(AUTHORED / name, OUT / name, dirs_exist_ok=True)
    (OUT / "docx").mkdir(exist_ok=True)
    backup = ROOT / "work/gallery-before-027"
    if not backup.exists():
        shutil.copytree(TARGET, backup)
    for name in ["LICENSE.txt", "NOTICE.txt"]:
        shutil.copy2(TARGET / name, OUT / name)
    catalog = {
        "schemaVersion": 3,
        "version": "0.27.0",
        "creator": "Jon Gosier",
        "license": "Apache-2.0",
        "templates": [],
    }
    captures = {"word": [], "browser": []}
    for d in DOCS:
        source = STAGE / "word-sources" / f"{d['id']}.docx"
        shutil.copy2(source, OUT / "docx" / source.name)
        render = STAGE / (
            "word-final-business"
            if d["id"] == "business"
            else "word-reviewed/" + d["id"]
        )
        pages = sorted(render.glob("page-*.png"))
        assert len(pages) == 1, f"Review unexpected page count: {d['id']}"
        data = {
            **d,
            "fictional": True,
            "design": {
                "accent": d["accent"],
                "secondary": d["accent"],
                "paper": d["paper"],
            },
            "document": [
                {
                    "title": d["title"],
                    "sections": d["sections"],
                    "headers": d["headers"],
                    "rows": d["rows"],
                }
            ],
        }
        save_json(OUT / "data" / f"{d['id']}.json", data)
        for fmt in ["docx", "html"]:
            ident = fmt + "-" + d["id"]
            item = {
                "id": ident,
                "category": d["id"],
                "format": fmt,
                "title": d["title"],
                "use": d["lead"],
                "path": f"{fmt}/{d['id']}.{fmt}",
                "fonts": (
                    [d["word"], "Arial"] if fmt == "docx" else [d["font"], "Work Sans"]
                ),
                "design": d["layout"],
                "dataset": "data/" + d["id"] + ".json",
                "plannedPages": 1 if fmt == "docx" else None,
                "orientation": (
                    "landscape"
                    if fmt == "docx"
                    and d["id"] in ["business", "family", "presentation"]
                    else "portrait"
                ),
                "content": "Fictional worked example. Replace sample details and verify facts before use.",
            }
            catalog["templates"].append(item)
            if fmt == "docx":
                jpg(pages[0], OUT / "previews" / f"{ident}.jpg")
                shutil.copy2(
                    OUT / "previews" / f"{ident}.jpg",
                    OUT / "previews" / f"{ident}-p1.jpg",
                )
                pdf = next(render.glob("*.pdf"))
                shutil.copy2(pdf, OUT / "docx" / f"{d['id']}.pdf")
                (OUT / "docx" / f"preview-{d['id']}.html").write_text(
                    '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'
                    + html.escape(d["title"])
                    + "</title><style>body{margin:30px auto;max-width:1100px;padding:0 20px;font:18px/1.6 Arial;background:#eee;color:#17252b}img{width:100%;height:auto}a{color:#123a8c;margin-right:20px}</style><h1>"
                    + html.escape(d["title"])
                    + '</h1><p><a href="../index.html">Gallery</a><a href="'
                    + d["id"]
                    + '.docx">Editable Word File</a><a href="'
                    + d["id"]
                    + '.pdf">Rendered PDF</a></p><p>One complete page, rendered with LibreOffice. Word may paginate differently after edits or font substitution.</p><img src="../previews/'
                    + ident
                    + '-p1.jpg" alt="Complete rendered page of '
                    + html.escape(d["title"])
                    + '"><footer><small>Fictional Dazzler example. Apache-2.0. Native text and tables remain editable in the Word file.</small></footer></html>',
                    encoding="utf8",
                )
                captures["word"].append(
                    {
                        "id": ident,
                        "engine": "LibreOffice",
                        "pages": 1,
                        "sourceSha256": digest(OUT / item["path"]),
                        "preview": f"previews/{ident}.jpg",
                    }
                )
            else:
                jpg(
                    STAGE / "renders" / f"{ident}-1440.png",
                    OUT / "previews" / f"{ident}.jpg",
                )
                jpg(
                    STAGE / "renders" / f"{ident}-390.png",
                    OUT / "previews" / f"{ident}-mobile.jpg",
                    390,
                )
                captures["browser"].append(
                    {
                        "id": ident,
                        "engine": "Chromium / Playwright",
                        "fullPage": True,
                        "viewport": {"width": 1440, "height": 1000},
                        "sourceSha256": digest(OUT / item["path"]),
                        "preview": f"previews/{ident}.jpg",
                    }
                )
    for d in U:
        cat = (
            "general-webapp"
            if d["id"].startswith("webapp-")
            else (
                "data-visualization"
                if d["id"].startswith("data-")
                else (
                    "restaurant"
                    if d["id"].startswith("restaurant-")
                    else "generic-business"
                )
            )
        )
        item = {
            "id": d["id"],
            "category": cat,
            "format": "ui",
            "title": d["title"],
            "use": d["prompt"],
            "path": "ui/" + d["id"],
            "files": [
                "index.html",
                "styles.css",
                "tokens.css",
                "tokens.json",
                "template.json",
            ],
            "fonts": [d["font"], "Work Sans"],
            "design": d["title"],
            "content": "Fictional local interaction. No live service.",
        }
        catalog["templates"].append(item)
        for width, suffix in [(1440, ""), (390, "-mobile")]:
            jpg(
                STAGE / "renders" / f"{d['id']}-{width}.png",
                OUT / "previews" / f"{d['id']}{suffix}.jpg",
                1100 if width == 1440 else 390,
            )
        captures["browser"].append(
            {
                "id": d["id"],
                "engine": "Chromium / Playwright",
                "fullPage": True,
                "viewport": {"width": 1440, "height": 1000},
                "sourceSha256": digest(OUT / item["path"] / "index.html"),
                "preview": f"previews/{d['id']}.jpg",
            }
        )
    cards = []
    for t in catalog["templates"]:
        href = (
            "docx/preview-" + t["category"] + ".html"
            if t["format"] == "docx"
            else t["path"] + ("/index.html" if t["format"] == "ui" else "")
        )
        cards.append(
            '<article data-format="'
            + t["format"]
            + '"><a href="'
            + href
            + '"><img loading="lazy" src="previews/'
            + t["id"]
            + '.jpg" alt="'
            + html.escape(t["title"])
            + ' — complete composition"><p class="label">'
            + t["format"].upper()
            + " / "
            + t["category"]
            + "</p><h2>"
            + html.escape(t["title"])
            + "</h2></a><p>"
            + html.escape(
                t["use"]
                if t["format"] != "ui"
                else next(d["action"] for d in U if d["id"] == t["id"])
                + " · Local Interactive Example"
            )
            + "</p></article>"
        )
    (OUT / "index.html").write_text(
        """<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dazzler — Thirty Ways to Make It Matter</title><link rel="stylesheet" href="fonts/fonts.css"><style>*{box-sizing:border-box}body{margin:0;background:#f6f1e7;color:#202332;font:17px/1.5 "Work Sans",Arial}header,main,footer{max-width:1440px;margin:auto;padding:40px 5vw}header{border-bottom:4px solid #55308a}h1{font:400 clamp(3rem,7vw,6.5rem)/1 "Young Serif";max-width:15ch;letter-spacing:-.05em}header p{max-width:65ch}.label{font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:#55308a}.filters{display:flex;flex-wrap:wrap;gap:12px;margin:28px 0}button{font:inherit;padding:12px 24px;border:1px solid #55308a;background:transparent;color:#55308a;cursor:pointer}button[aria-pressed=true]{background:#55308a;color:white}a{color:inherit}a:focus-visible,button:focus-visible{outline:3px solid #b94320;outline-offset:5px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:35px 24px}article{min-width:0;border-top:1px solid #55308a;padding-top:18px}article[hidden]{display:none}article a{text-decoration:none}article img{width:100%;height:390px;object-fit:contain;background:#e8e3db}article h2{font-size:24px;line-height:1.2;margin:10px 0}article>p{font-size:14px}footer{border-top:1px solid #55308a;font-size:13px}@media(max-width:1000px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:650px){.grid{grid-template-columns:1fr}article img{height:440px}}</style><header><p class="label">Dazzler / The 0.27 Collection</p><h1>Thirty Ways to Make It Matter.</h1><p>Decision briefs. Reading rooms. Night markets. Each example starts with a different task and earns its own typography, color and composition.</p><p>Open a complete design, try its local controls or download editable Word content. These are fictional demonstrations, not default layouts for your next project.</p><div class="filters" aria-label="Example Format"><button data-filter="all" aria-pressed="true">All 30</button><button data-filter="docx" aria-pressed="false">Word</button><button data-filter="html" aria-pressed="false">HTML</button><button data-filter="ui" aria-pressed="false">Interfaces</button></div><p id="count" role="status">30 examples</p></header><main class="grid">"""
        + "".join(cards)
        + """</main><footer>Full-page browser captures and complete LibreOffice-rendered Word pages. Recheck layout after edits; other renderers can differ. Original designs and synthetic data by Jon Gosier, Apache-2.0. Font licenses accompany the files. <a href="NOTICE.txt">Credits and Notices</a></footer><script>document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{const f=b.dataset.filter;let n=0;document.querySelectorAll('article').forEach(a=>{a.hidden=f!=='all'&&a.dataset.format!==f;if(!a.hidden)n++});document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('#count').textContent=n+' examples'});</script></html>""",
        encoding="utf8",
    )
    for kind, rows in captures.items():
        for row in rows:
            t = next(t for t in catalog["templates"] if t["id"] == row["id"])
            files = (
                [OUT / t["path"]]
                if t["format"] == "docx"
                else list((OUT / "fonts").rglob("*"))
                + (
                    [OUT / t["path"]] + list((OUT / "html" / t["category"]).rglob("*"))
                    if t["format"] == "html"
                    else list((OUT / t["path"]).rglob("*"))
                )
            )
            row["dependencies"] = {
                p.relative_to(OUT).as_posix(): digest(p) for p in files if p.is_file()
            }
        save_json(OUT / "previews" / f"{kind}-captures.json", rows)
    catalog["files"] = {
        p.relative_to(OUT).as_posix(): digest(p)
        for p in sorted(OUT.rglob("*"))
        if p.is_file() and p.name != "catalog.json"
    }
    save_json(OUT / "catalog.json", catalog)
    # Copy first, then remove only obsolete library files already preserved above.
    shutil.copytree(OUT, TARGET, dirs_exist_ok=True)
    for old in TARGET.rglob("*"):
        if old.is_file() and not (OUT / old.relative_to(TARGET)).is_file():
            assert (backup / old.relative_to(TARGET)).is_file(), "No backup for " + str(
                old
            )
            old.unlink()
    print("Promoted 30 reviewed examples. Previous working files preserved in", backup)


if __name__ == "__main__":
    assemble()
