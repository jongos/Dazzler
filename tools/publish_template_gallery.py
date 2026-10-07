"""Sync only the canonical, public template library into the GitHub Pages docs folder."""

from pathlib import Path
import shutil
import json
import html
import re

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / "skills/dazzler-frontend/assets/templates"
target = ROOT / "docs/templates"
if __name__ == "__main__":
    for old in target.rglob("*"):
        if old.is_file() and not (source / old.relative_to(target)).exists():
            old.unlink()
    shutil.copytree(source, target, dirs_exist_ok=True)
    catalog = json.loads((source / "catalog.json").read_text(encoding="utf-8"))
    cards = []
    markdown = []
    for fmt, label in [
        ("docx", "Editable Word documents"),
        ("html", "Editorial HTML documents"),
        ("ui", "Interactive interfaces"),
    ]:
        entries = [t for t in catalog["templates"] if t["format"] == fmt]
        markdown.append("### " + label + "\n\n<table>\n")
        for index, t in enumerate(entries):
            ident = t["id"]
            name = html.escape(t["title"])
            rel = (
                "docx/preview-" + t["category"] + ".html"
                if fmt == "docx"
                else t["path"] + ("/index.html" if fmt == "ui" else "")
            )
            link = "https://jongos.github.io/Dazzler/templates/" + rel
            if index % 2 == 0:
                markdown.append("<tr>")
            markdown.append(
                f'<td width="50%"><a href="{link}"><img src="docs/templates/previews/{ident}.jpg" alt="{name} — {fmt.upper()} snapshot" width="100%"></a><br><strong>{name}</strong> · {fmt.upper()}</td>'
            )
            if index % 2 == 1:
                markdown.append("</tr>\n")
            cards.append(
                f'<article><a href="templates/{rel}"><img loading="lazy" src="templates/previews/{ident}.jpg" alt="{name} — {fmt.upper()} snapshot"><span>{fmt.upper()} / {html.escape(t["category"])}</span><h3>{name}</h3></a></article>'
            )
        markdown.append("</table>\n\n")
    intro = """## ✦ Thirty templates — the showcase collection

**[Explore all 30 live examples](https://jongos.github.io/Dazzler/templates/)**

Ten editable Word documents, ten editorial HTML documents and ten interactive interfaces. Every snapshot below shows a rebuilt artifact with a distinct typographic and color identity. The Word previews show complete pages rendered with LibreOffice; browser previews show full-page compositions.

Fictional scenarios demonstrate a launch decision, a six-year membership story, soil-drainage observations, an evidence review, a recovery runbook, menus and keyboard-selectable seating. Open an example to inspect its data or try its local controls. All actions remain demonstrations; no booking, purchase or account change is submitted.

Dazzler chooses the relevant typography, color, layout, chart and print treatment automatically. Existing brand choices stay in control. Documents retain editable structures; HTML and UI editions include local fonts, chart assets, notices and print styles.

"""
    readme = ROOT / "README.md"
    text = readme.read_text(encoding="utf-8")
    text = re.sub(
        r"## ✦ Thirty templates.*?(?=## 🚀 Install Dazzler)",
        lambda _: intro + "".join(markdown),
        text,
        flags=re.S,
    )
    readme.write_text(text, encoding="utf-8")
    guide = ROOT / "docs/index.html"
    text = guide.read_text(encoding="utf-8")
    section = (
        """<section id="templates" class="chapter"><div class="section-label"><span>08 / THE SHOWCASE COLLECTION</span><span>30 REBUILT EXAMPLES</span></div><h2>One skill.<br>Thirty distinct voices.</h2><p class="intro">Start with the outcome. Dazzler brings the typography, color, composition, data and print craft. These fictional examples range from vivid white-page accents and saturated fields to luminous dark interfaces. Each choice serves a different task.</p><p>Every thumbnail is a captured artifact. Word links reveal the actual rendered pages and an editable download; HTML and UI links open the working example. Explore complete compositions, purposeful charts, a seating plan, filters and local preview actions.</p><p><a href="templates/">Open the filterable template gallery ↗</a></p><style>.showcase-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.showcase-grid article{border:1px solid #cbc5d7;background:#fff;min-width:0}.showcase-grid img{display:block;width:100%;height:320px;object-fit:contain;background:#f2f2f2}.showcase-grid a{display:block;color:#272139;text-decoration:none}.showcase-grid span{display:block;padding:15px 15px 0;font-size:10px;letter-spacing:.08em}.showcase-grid h3{font-size:19px;padding:0 15px 18px;margin:10px 0}.showcase-grid a:focus-visible{outline:3px solid #713ac6}@media(max-width:900px){.showcase-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:580px){.showcase-grid{grid-template-columns:1fr}}@media print{.showcase-grid article{break-inside:avoid}}</style><div class="showcase-grid">"""
        + "".join(cards)
        + """</div><details><summary>Use an example as your starting point</summary><p>Call the skill with your goal. It develops a direction from the brief; it exports a template only when you explicitly select one. It replaces fictional facts with your verified content, preserves your brand and reviews the customized result. Word fonts are referenced, not embedded; inspect the result on the target computer. These template snapshots demonstrate this release, not a guarantee for later edits.</p></details></section>"""
    )
    text = re.sub(
        r'<section id="templates".*?(?=<section id="visualizations")',
        lambda _: section,
        text,
        flags=re.S,
    )
    guide.write_text(text, encoding="utf-8")
    print(
        "Synced public template gallery to docs/templates; publishing requires the normal Git workflow."
    )
