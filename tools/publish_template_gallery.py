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
    if "## Thirty examples to build on" not in readme.read_text(encoding="utf-8"):
        readme = ROOT / "REFERENCE.md"
    text = readme.read_text(encoding="utf-8")
    text, replacements = re.subn(
        r"(?:## ✦ Thirty templates|## Thirty examples to build on).*?(?=## 🚀 Install Dazzler|## What runs locally)",
        lambda _: intro.replace(
            "## ✦ Thirty templates — the showcase collection",
            "## Thirty examples to build on",
        )
        + "<details>\n<summary>View the complete snapshot gallery</summary>\n\n"
        + "".join(markdown)
        + "</details>\n\n",
        text,
        flags=re.S,
    )
    if replacements != 1:
        raise ValueError(
            "Expected exactly one README gallery section; refusing a stale snapshot index"
        )
    readme.write_text(text, encoding="utf-8")
    guide = ROOT / "docs/index.html"
    text = guide.read_text(encoding="utf-8")
    by_id = {t["id"]: t for t in catalog["templates"]}

    def update_card(match):
        card = match[0]
        image = re.search(r'templates/previews/([^"/]+)\.jpg', card)
        if not image:
            return card
        item = by_id[image[1]]
        title = html.escape(item["title"])
        card = re.sub(
            r"<h3>.*?</h3>", lambda _: "<h3>" + title + "</h3>", card, flags=re.S
        )
        card = re.sub(
            r'alt="[^"]*"',
            lambda _: 'alt="' + title + " — " + item["format"].upper() + ' snapshot"',
            card,
            count=1,
        )
        return card

    matching_cards = re.findall(r"<article\b[^>]*>.*?</article>", text, re.S)
    if sum("templates/previews/" in c for c in matching_cards) != 30:
        raise ValueError(
            "Expected 30 existing guide cards; preserve the guide structure"
        )
    text = re.sub(r"<article\b[^>]*>.*?</article>", update_card, text, flags=re.S)
    guide.write_text(text, encoding="utf-8")
    print("Synced 30 gallery artifacts and current reference/guide captions.")
