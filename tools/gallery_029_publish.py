"""Assemble reviewed 0.29 artifacts without regenerating their designs."""

import hashlib, json, html, shutil, re
from pathlib import Path
from PIL import Image
from gallery_029 import R, S, O, OLD, D, save


def digest(p):
    return hashlib.sha256(
        p.read_bytes().replace(b"\r\n", b"\n")
        if p.name in ("SKILL.md", "integrity.json")
        else p.read_bytes()
    ).hexdigest()


def jpg(src, dst, width=1100):
    im = Image.open(src).convert("RGB")
    im.thumbnail((width, 10000))
    im.save(dst, quality=88, optimize=True)


def assemble():
    out = S / "reviewed-library"
    if out.exists():
        raise SystemExit("Reviewed library already exists; inspect before replacing.")
    shutil.copytree(O, out)
    checks = json.loads((S / "browser-checks.json").read_text())
    if len(checks) != 20 or any(
        x["errors"] or any(v["overflow"] or v["axe"] for v in x["views"])
        for x in checks
    ):
        raise ValueError("Browser checks failed")
    catalog = json.loads((OLD / "catalog.json").read_text(encoding="utf-8"))
    catalog["version"] = "0.29.0"
    briefs = {
        x["id"]: x
        for name in ["document", "interface"]
        for x in json.loads((S / f"{name}-briefs.json").read_text(encoding="utf-8"))
    }
    captures = {"word": [], "browser": []}
    for t in catalog["templates"]:
        ident = t["id"]
        fmt = t["format"]
        key = t["category"] if fmt != "ui" else ident
        b = briefs[key]
        t.pop("architecture", None)
        t["design"] = b["direction"]
        t["fonts"] = [
            b["word"] if fmt == "docx" else b["font"],
            "Arial" if fmt == "docx" else "Work Sans",
        ]
        if fmt != "ui":
            d = json.loads((out / t["dataset"]).read_text(encoding="utf-8"))
            t["title"] = d["title"]
            t["use"] = d["lead"]
            t["plannedPages"] = 1 if fmt == "docx" else None
            t["orientation"] = b["orientation"]
        else:
            t["title"] = b["direction"]
            t["use"] = b["rationale"]
        target = out / t["path"]
        source = target / "index.html" if target.is_dir() else target
        if fmt == "docx":
            render = S / (
                "word-school-final" if key == "school" else "word-final/" + key
            )
            pages = list(render.glob("page-*.png"))
            if len(pages) != 1:
                raise ValueError(f"Unexpected pagination: {ident}")
            jpg(pages[0], out / "previews" / f"{ident}.jpg")
            shutil.copy2(
                out / "previews" / f"{ident}.jpg", out / "previews" / f"{ident}-p1.jpg"
            )
            shutil.copy2(next(render.glob("*.pdf")), out / "docx" / f"{key}.pdf")
            (out / "docx" / f"preview-{key}.html").write_text(
                f'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(t["title"])}</title><style>body{{margin:30px auto;max-width:1100px;padding:0 20px;font:18px/1.6 Arial;background:#eee;color:#17252b}}img{{width:100%;height:auto}}a{{color:#123a8c;margin-right:20px}}</style><h1>{html.escape(t["title"])}</h1><p><a href="../index.html">Gallery</a><a href="{key}.docx">Editable Word File</a><a href="{key}.pdf">Rendered PDF</a></p><p>One complete page rendered with LibreOffice. Recheck pagination after edits or font substitution.</p><img src="../previews/{ident}-p1.jpg" alt="Complete rendered page"><footer>Fictional Dazzler example. Apache-2.0. Native text and tables remain editable.</footer></html>',
                encoding="utf-8",
            )
            row = {"id": ident, "engine": "LibreOffice", "pages": 1}
            files = [source]
            kind = "word"
        else:
            for w, suffix in [(1440, ""), (390, "-mobile")]:
                jpg(
                    S / "renders" / f"{ident}-{w}.png",
                    out / "previews" / f"{ident}{suffix}.jpg",
                    1100 if w == 1440 else 390,
                )
            row = {
                "id": ident,
                "engine": "Chromium / Playwright",
                "fullPage": True,
                "viewport": {"width": 1440, "height": 1000},
            }
            kind = "browser"
            files = list((out / "fonts").rglob("*")) + (
                [source] + list((out / "html" / key).rglob("*"))
                if fmt == "html"
                else list(target.rglob("*"))
            )
        row.update(
            sourceSha256=digest(source),
            preview=f"previews/{ident}.jpg",
            dependencies={
                p.relative_to(out).as_posix(): digest(p) for p in files if p.is_file()
            },
        )
        captures[kind].append(row)
    for kind, rows in captures.items():
        save(out / "previews" / f"{kind}-captures.json", rows)
    index = (
        (OLD / "index.html")
        .read_text(encoding="utf-8")
        .replace("The 0.28 Collection", "The 0.29 Collection")
    )
    cards = []
    for t in catalog["templates"]:
        href = (
            f'docx/preview-{t["category"]}.html'
            if t["format"] == "docx"
            else t["path"] + ("/index.html" if t["format"] == "ui" else "")
        )
        cards.append(
            f'<article data-format="{t["format"]}"><a href="{href}"><img loading="lazy" src="previews/{t["id"]}.jpg" alt="{html.escape(t["title"])} — complete composition"><p class="label">{t["format"].upper()} / {t["category"]}</p><h2>{html.escape(t["title"])}</h2></a><p>{html.escape(t["use"])}</p></article>'
        )
    index = re.sub(
        r'(<main class="grid">).*?(</main>)',
        lambda m: m[1] + "".join(cards) + m[2],
        index,
        flags=re.S,
    )
    (out / "index.html").write_text(index, encoding="utf-8")
    catalog["files"] = {
        p.relative_to(out).as_posix(): digest(p)
        for p in sorted(out.rglob("*"))
        if p.is_file() and p.name != "catalog.json"
    }
    save(out / "catalog.json", catalog)
    target = R / "skills/dazzler-frontend/assets/templates"
    backup = R / "work/gallery-before-029-promotion"
    if backup.exists():
        raise ValueError("Promotion backup exists")
    if not target.resolve().is_relative_to(
        R.resolve()
    ) or not backup.resolve().is_relative_to(R.resolve()):
        raise ValueError("Unexpected path")
    target.rename(backup)
    shutil.copytree(out, target)
    print("Promoted 30 reviewed examples; original library preserved at", backup)


if __name__ == "__main__":
    assemble()
