"""Author the 0.29 gallery from task-specific briefs; review is a separate step."""

from pathlib import Path
import json, shutil, re, html, sys
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

R = Path(__file__).resolve().parents[1]
S = R / "maintenance/gallery-production/v0.29.0"
O = S / "artifacts"
OLD = R / "work/gallery-before-029"
H = html.escape
# New direction decisions, not a selection of preset template layouts.
D = {
    "professional": (
        "Release Gate Map",
        "Archivo",
        "Arial",
        "#004EC4",
        "#FFFFFF",
        "portrait",
        "gates",
        "A release boundary, with the unresolved settlement gate separated from the two ready services.",
    ),
    "legal": (
        "Evidence and Inference",
        "Libre Baskerville",
        "Georgia",
        "#702659",
        "#FFF4FA",
        "portrait",
        "evidence",
        "A counsel-facing evidence matrix followed by a compact issue and next-action register.",
    ),
    "business": (
        "The Fee Waterfall",
        "Young Serif",
        "Georgia",
        "#006548",
        "#E5FF3D",
        "portrait",
        "waterfall",
        "The three work stages carry the fee story, with commercial terms treated as a closing contract strip.",
    ),
    "fun": (
        "The Evening Program",
        "Oswald",
        "Arial",
        "#8A183A",
        "#FFD950",
        "landscape",
        "program",
        "A broad stage program makes time the navigation; practical arrival information occupies a distinct ticket panel.",
    ),
    "family": (
        "Pack Plan Leave",
        "Work Sans",
        "Arial",
        "#173D8F",
        "#ADE0FF",
        "portrait",
        "packing",
        "A packing-first household sheet with a compact weekend itinerary and an open change notice.",
    ),
    "presentation": (
        "The Speaker Brief",
        "Archivo",
        "Arial",
        "#5526A5",
        "#FFFFFF",
        "portrait",
        "speaker",
        "An annotated speaking brief separates the argument, the six-week test and the decision criteria.",
    ),
    "school": (
        "The Lab Bench",
        "Office Code Pro",
        "Consolas",
        "#0B613D",
        "#D5FF8B",
        "landscape",
        "lab",
        "A wide observation bench aligns raw trial times with a truthful median comparison and a methods panel.",
    ),
    "marketing": (
        "Campaign Dispatch",
        "Poppins",
        "Arial",
        "#861028",
        "#FFAB91",
        "landscape",
        "dispatch",
        "A channel-to-action map presents the campaign as a working assignment with capacity qualified as planning.",
    ),
    "restaurant": (
        "At the Shared Table",
        "Young Serif",
        "Georgia",
        "#823B16",
        "#FFF6DF",
        "portrait",
        "menu",
        "A typographic supper card groups dishes by their role in the meal and gives pairings a separate side rhythm.",
    ),
    "technical": (
        "Recovery Decision Tree",
        "Office Code Pro",
        "Consolas",
        "#164BB5",
        "#E7EFFF",
        "landscape",
        "tree",
        "A stop-check-resume decision sequence makes the safe boundary visible before the reference matrix.",
    ),
}


def save(p, d):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(d, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def table(d):
    return (
        '<div class="table-wrap" tabindex="0" role="region" aria-label="'
        + H(d["title"])
        + ' evidence"><table><thead><tr>'
        + "".join("<th>" + H(x) + "</th>" for x in d["headers"])
        + "</tr></thead><tbody>"
        + "".join(
            "<tr>"
            + "".join(
                "<"
                + ('th scope="row"' if i == 0 else "td")
                + ">"
                + H(x)
                + "</"
                + ("th" if i == 0 else "td")
                + ">"
                for i, x in enumerate(row)
            )
            + "</tr>"
            for row in d["rows"]
        )
        + "</tbody></table></div>"
    )


def blocks(d):
    return "".join(
        f'<section class="note note-{i}"><p class="eyebrow">0{i+1} / {H(d["id"])}</p><h2>{H(a)}</h2><p>{H(b)}</p></section>'
        for i, (a, b) in enumerate(d["sections"])
    )


CSS = """*{box-sizing:border-box}body{margin:0;color:#17212B;background:var(--paper);font:17px/1.6 "Work Sans",Arial}a{color:inherit}nav,footer{padding:18px 5vw;font-size:13px;border-bottom:1px solid currentColor}nav{display:flex;justify-content:space-between;gap:20px}main{max-width:1280px;margin:auto;padding:55px 5vw}h1,h2,h3{font-family:var(--display);line-height:1.05;margin:0 0 20px}h1{font-size:clamp(2.6rem,5.8vw,5.4rem);max-width:18ch;letter-spacing:-.035em}h2{font-size:1.6rem}p{max-width:60ch}.eyebrow{font:700 12px/1.5 "Work Sans";letter-spacing:.12em;text-transform:uppercase}.lead{font-size:1.3rem;max-width:46ch}.hero{border-bottom:8px solid var(--accent);padding-bottom:30px;margin-bottom:32px}.notes{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;margin:32px 0}.note{border-top:2px solid var(--accent);padding-top:20px}.feature{padding:28px;background:var(--accent);color:white}.feature strong{font:700 clamp(2.5rem,6vw,5rem)/1 var(--display)}.feature p{margin-bottom:0}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;text-align:left;font-size:15px}th,td{padding:16px 14px;vertical-align:top;border-bottom:1px solid #8B9299}thead{background:#17212B;color:white}tbody th{font-weight:600}.closing{margin-top:30px;border-top:3px solid var(--accent);padding-top:20px;font-weight:600}blockquote{font:italic 1.5rem/1.4 "Libre Baskerville";margin:30px 0;max-width:45ch}svg{width:100%;height:auto}button,input,select,textarea{font:inherit}button{padding:12px 20px;cursor:pointer;background:var(--accent);color:white;border:2px solid var(--accent)}:focus-visible{outline:3px solid #D84100;outline-offset:4px}@media(max-width:700px){main{padding:30px 22px}.notes{grid-template-columns:1fr}nav{flex-wrap:wrap}h1{font-size:2.7rem}th,td{padding:10px 8px}table{min-width:320px}}@media print{nav{display:none}main{padding:0}body{background:white}.notes{break-inside:avoid}footer{font-size:9pt}h1{font-size:32pt}}"""
EXTRA = {
    "gates": ".hero{display:grid;grid-template-columns:2fr 1fr;gap:32px}.feature{margin:30px 0}.notes{grid-template-columns:1fr 1fr 1fr}.note:last-child{background:#E2EDFF;padding:24px}",
    "evidence": '.hero{padding-left:12%;border-bottom:1px solid}.notes{grid-template-columns:1fr 2fr}.note:first-child{grid-row:span 2}.feature{display:flex;align-items:center;gap:30px;margin:30px 0}.lead{font-family:"Libre Baskerville";font-style:italic}',
    "waterfall": ".hero{background:#006548;color:white;padding:40px}.notes{grid-template-columns:2fr 1fr}.note:last-child{grid-column:1/-1}.feature{background:transparent;color:#006548;border-bottom:3px solid;padding:20px 0}tbody tr:nth-child(2){background:#FFFFFF}thead{background:#006548}",
    "program": '.hero h1{max-width:20ch}.feature{display:flex;gap:40px;align-items:center}.notes{grid-template-columns:2fr 1fr 1fr}.table-wrap{margin-top:35px}tbody th{font-family:"Oswald";font-size:2rem}thead{background:#8A183A}',
    "packing": ".hero{border:0;max-width:850px}.notes{grid-template-columns:2fr 1fr}.note:first-child{border:3px solid #173D8F;padding:28px;grid-row:span 2}.feature{display:none}.table-wrap{background:white;padding:18px}.closing{background:#FFE7C6;padding:25px}",
    "speaker": '.hero{border-left:16px solid #5526A5;border-bottom:0;padding-left:32px}.notes{display:block;counter-reset:speech}.note{padding:22px 0 22px 100px;position:relative}.note:before{counter-increment:speech;content:counter(speech);position:absolute;left:10px;font:70px/1 "Archivo";color:#5526A5}.feature{float:right;width:30%;margin:0 0 25px 25px}.table-wrap{clear:both}',
    "lab": ".hero{border-bottom:0}.hero h1{font-size:clamp(2.4rem,4vw,4rem);max-width:26ch}.labbench{display:grid;grid-template-columns:1fr 1fr;gap:30px}.feature{background:#FFFFFF;color:#0B613D;border:3px solid}.notes{font-size:16px}thead{background:#0B613D}",
    "dispatch": ".hero{display:grid;grid-template-columns:2fr 1fr;gap:30px}.notes{grid-template-columns:1fr 1fr 1fr}.feature{background:#9C1632}.table-wrap{border:3px solid #9C1632}tbody td{padding:24px 16px}h1{max-width:16ch}",
    "menu": ".hero{text-align:center;border-bottom:1px solid;max-width:800px;margin:auto}.hero h1,.hero p{margin-left:auto;margin-right:auto}.notes{grid-template-columns:1fr 1fr}.note:last-child{grid-column:1/-1;text-align:center}.note p{white-space:pre-line}.feature{text-align:center;background:transparent;color:#823B16;padding:15px}.feature strong{font-size:2.5rem}thead{background:#823B16}",
    "tree": ".hero h1{font-size:clamp(2.5rem,4vw,4rem);max-width:25ch}.notes{gap:10px}.note{background:white;border-top:10px solid #164BB5;padding:25px}.note:first-child{border-color:#B7192F}.feature{display:flex;align-items:center;gap:30px}.table-wrap{margin-top:30px}",
}


def shade(cell, color):
    pr = cell._tc.get_or_add_tcPr()
    el = OxmlElement("w:shd")
    el.set(qn("w:fill"), color.lstrip("#"))
    pr.append(el)


def para(
    container, text, size=11, bold=False, color="#17212B", font="Arial", style=None
):
    p = container.add_paragraph(style=style)
    p.paragraph_format.space_after = Pt(7)
    p.paragraph_format.line_spacing = 1.12
    run = p.add_run(text)
    run.font.name = font
    run.font.size = Pt(size)
    run.bold = bold
    run.font.color.rgb = RGBColor.from_string(color.lstrip("#"))
    return p


def word(d, config):
    name, font, wfont, accent, paper, orientation, layout, rationale = config
    doc = Document()
    sec = doc.sections[0]
    sec.page_width = Inches(11.7 if orientation == "landscape" else 8.3)
    sec.page_height = Inches(8.3 if orientation == "landscape" else 11.7)
    sec.top_margin = sec.bottom_margin = Inches(0.55)
    sec.left_margin = sec.right_margin = Inches(0.6)
    for st in doc.styles:
        if st.type == 1:
            st.font.name = wfont
            st.font.size = Pt(11)
            rf = st.element.find(".//" + qn("w:rFonts"))
            if rf is not None:
                for key in list(rf.attrib):
                    if "Theme" in key:
                        del rf.attrib[key]
            for e in list(st.element.iter(qn("w:pBdr"))):
                e.getparent().remove(e)

    def P(c, text, size=11, bold=False, color="#17212B", style=None):
        return para(c, text, size, bold, color, wfont, style)

    def panel(c, text, bg=accent, fg="#FFFFFF", size=24):
        t = c.add_table(rows=1, cols=1) if c is doc else c.add_table(rows=1, cols=1)
        cell = t.cell(0, 0)
        shade(cell, bg)
        P(cell, text, size, True, fg)
        return cell

    def sections(c, items):
        for title, body in items:
            P(c, title, 15, True, accent, "Heading 1")
            P(c, body, 11)

    def ledger(c):
        t = c.add_table(rows=1, cols=3)
        for i, h in enumerate(d["headers"]):
            t.cell(0, i).text = h
            shade(t.cell(0, i), accent)
        flag = OxmlElement("w:tblHeader")
        t.rows[0]._tr.get_or_add_trPr().append(flag)
        for ri, row in enumerate(d["rows"]):
            for cell, x in zip(t.add_row().cells, row):
                cell.text = x
                shade(cell, paper if ri % 2 == 0 else "#FFFFFF")
        for i, row in enumerate(t.rows):
            for cell in row.cells:
                for p in cell.paragraphs:
                    p.paragraph_format.space_after = Pt(8)
                    p.paragraph_format.space_before = Pt(5)
                    for run in p.runs:
                        run.font.name = wfont
                        run.font.size = Pt(10)
                        run.bold = i == 0
                        run.font.color.rgb = RGBColor.from_string(
                            "FFFFFF" if i == 0 else "17212B"
                        )

    def columns(items):
        t = doc.add_table(rows=1, cols=len(items))
        for cell, item in zip(t.rows[0].cells, items):
            shade(cell, paper)
            sections(cell, [item])

    P(doc, d["tag"] + " / " + name.upper(), 9, True, accent)
    P(doc, d["title"], 32, True, "#000000", "Title")
    P(doc, d["lead"], 12, True, accent)
    if layout == "gates":
        panel(doc, "LIMITED RELEASE  /  SETTLEMENT ON HOLD", size=19)
        P(doc, d["intro"], 12)
        ledger(doc)
        P(
            doc,
            "92% Reconciled Is Not Full Release Readiness",
            18,
            True,
            accent,
            "Heading 1",
        )
        sections(doc, d["sections"])
    elif layout == "evidence":
        P(doc, "Record First  /  Conclusion Second", 19, True, accent, "Heading 1")
        ledger(doc)
        P(doc, d["intro"], 11)
        P(doc, d["stat"] + " Events  /  " + d["label"], 16, True, accent)
        for title, body in d["sections"]:
            P(doc, title, 15, True, accent, "Heading 1")
            p = P(doc, body, 12)
            p.paragraph_format.left_indent = Inches(0.35)
    elif layout == "waterfall":
        P(doc, d["stat"], 46, True, accent)
        P(doc, d["label"], 11)
        P(doc, d["intro"], 11)
        ledger(doc)
        sections(doc, d["sections"])
    elif layout == "program":
        t = doc.add_table(rows=1, cols=2)
        left, right = t.rows[0].cells
        shade(left, accent)
        P(left, d["stat"], 52, True, "#FFFFFF")
        P(left, d["label"], 15, True, "#FFFFFF")
        P(left, d["intro"], 11, False, "#FFFFFF")
        ledger(right)
        columns(d["sections"])
    elif layout == "packing":
        panel(doc, "PACK TOGETHER", size=22)
        P(doc, d["sections"][0][1], 12)
        for text in [
            "Rain Jackets and Bottles",
            "Medication With the Responsible Adult",
            "Chargers and a Book Each",
        ]:
            P(doc, "[  ]  " + text, 13, True, accent)
        ledger(doc)
        P(doc, d["intro"], 11)
        sections(doc, d["sections"][1:])
        P(doc, "Change of Plan  __________________________________", 12, True, accent)
    elif layout == "speaker":
        panel(doc, d["stat"] + " / " + d["label"], size=18)
        P(doc, d["intro"], 11)
        for i, (title, body) in enumerate(d["sections"]):
            P(doc, str(i + 1) + "  " + title, 22, True, accent, "Heading 1")
            P(doc, body, 12)
        ledger(doc)
    elif layout == "lab":
        P(doc, d["stat"] + " / " + d["label"], 19, True, accent)
        P(doc, d["intro"], 11)
        ledger(doc)
        columns(d["sections"])
    elif layout == "dispatch":
        t = doc.add_table(rows=1, cols=2)
        left, right = t.rows[0].cells
        shade(left, accent)
        P(left, "KEEP THE GOOD THINGS", 30, True, "#FFFFFF")
        P(left, d["stat"] + " illustrative slots", 18, True, "#FFFFFF")
        P(left, d["intro"], 11, False, "#FFFFFF")
        ledger(right)
        columns(d["sections"])
    elif layout == "menu":
        P(doc, d["stat"] + " / " + d["label"], 15, True, accent)
        for title, body in d["sections"]:
            p = P(doc, title, 20, True, accent, "Heading 1")
            p.paragraph_format.space_before = Pt(12)
            P(doc, body, 13)
        ledger(doc)
        P(doc, d["intro"], 10)
    elif layout == "tree":
        panel(doc, "PAUSE  >  CHECKPOINT  >  REPLAY  >  VERIFY", size=20)
        P(doc, d["stat"] + " events in the first batch", 20, True, accent)
        P(doc, d["intro"], 11)
        columns(d["sections"])
        ledger(doc)
    P(doc, d["closing"], 10, True, accent)
    P(sec.footer, "Fictional Worked Example / " + name + " / 01", 8)
    doc.save(O / "docx" / f'{d["id"]}.docx')


def main():
    for name in ["html", "ui", "docx", "data", "previews"]:
        (O / name).mkdir(parents=True, exist_ok=True)
    shutil.copytree(OLD / "fonts", O / "fonts", dirs_exist_ok=True)
    for n in ["LICENSE.txt", "NOTICE.txt"]:
        shutil.copy2(OLD / n, O / n)
    briefs = []
    for ident, c in D.items():
        d = json.loads((OLD / "data" / f"{ident}.json").read_text(encoding="utf-8"))
        name, font, wfont, accent, paper, ori, layout, why = c
        d.update(font=font, word=wfont, accent=accent, paper=paper, layout=layout)
        prompt = f'Use Dazzler to create a fictional {ident} document for its real reader task: {d["lead"]} Preserve the supplied numbers and qualifications. Develop a new {name.lower()} composition, with {why.lower()} Use {font} in HTML and verified {wfont} for native Word. Make print and mobile reading clear; use purposeful {accent} color against {paper}. Do not copy the earlier gallery layout.'
        d["prompt"] = prompt
        d["design"] = {
            "accent": accent,
            "secondary": accent,
            "paper": paper,
            "text": "#17212B",
            "accentText": accent,
            "onAccent": "#FFFFFF",
        }
        d["document"] = [
            {
                "title": d["title"],
                "sections": d["sections"],
                "headers": d["headers"],
                "rows": d["rows"],
            }
        ]
        save(O / "data" / f"{ident}.json", d)
        feature = f'<aside class="feature"><strong>{H(d["stat"])}</strong><p>{H(d["label"])}</p></aside>'
        hero = f'<header class="hero"><div><p class="eyebrow">{H(d["tag"])} / {H(name)}</p><h1>{H(d["title"])}</h1></div><p class="lead">{H(d["lead"])}</p></header>'
        notes = '<div class="notes">' + blocks(d) + "</div>"
        intro = "<p>" + H(d["intro"]) + "</p>"
        t = table(d)
        if layout in ("gates", "evidence", "waterfall", "program", "dispatch"):
            body = hero + t + feature + intro + notes
        elif layout == "lab":
            svg = (
                '<svg viewBox="0 0 600 230" role="img" aria-label="Median drainage times in seconds, zero baseline: sand 40, garden soil 87, clay-rich soil 168"><path d="M170 15V200H580" fill="none" stroke="#17212B"/>'
                + "".join(
                    f'<text x="0" y="{45+i*65}" font-size="16">{H(row[0])}</text><rect x="170" y="{20+i*65}" width="{v*2}" height="35" fill="{accent}"/><text x="{180+v*2}" y="{45+i*65}" font-size="16">{v}</text>'
                    for i, (row, v) in enumerate(zip(d["rows"], [40, 87, 168]))
                )
                + '<text x="170" y="225" font-size="14">0 · Seconds, common zero baseline</text></svg>'
            )
            body = (
                hero
                + '<div class="labbench"><div>'
                + feature
                + intro
                + "</div>"
                + svg
                + "</div>"
                + t
                + notes
            )
        elif layout == "packing":
            body = hero + notes + t + intro
        elif layout == "menu":
            body = hero + feature + notes + t + intro
        else:
            body = hero + feature + intro + notes + t
        css = (
            ":root{--accent:"
            + accent
            + ";--paper:"
            + paper
            + ';--display:"'
            + font
            + '"}'
            + CSS
            + EXTRA[layout]
            + "@media(max-width:700px){.hero,.notes,.labbench{display:block}.note{margin:25px 0}.feature{float:none;width:auto}.feature strong{font-size:2.5rem}}"
        )
        (O / "html" / f"{ident}.html").write_text(
            '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'
            + H(d["title"])
            + '</title><link rel="stylesheet" href="../fonts/fonts.css"><style>'
            + css
            + '</style><body><nav><a href="../index.html">Dazzler Design Gallery</a><span>Fictional '
            + H(name)
            + "</span></nav><main>"
            + body
            + '<p class="closing">'
            + H(d["closing"])
            + "</p></main><footer>Original design and synthetic facts · Apache-2.0. Font notices accompany the files.</footer></body></html>",
            encoding="utf-8",
        )
        word(d, c)
        briefs.append(
            {
                "id": ident,
                "prompt": prompt,
                "direction": name,
                "rationale": why,
                "composition": layout,
                "font": font,
                "word": wfont,
                "surface": paper + " / " + accent,
                "orientation": ori,
                "directionsConsidered": [
                    "Continuous narrative with a summary rail",
                    name,
                    "Image-led opening with appended evidence",
                ],
                "selectionReason": why,
                "structuralChanges": [
                    "Moves the evidence or action into the organizing position described by "
                    + name,
                    "Replaces the previous title-to-metric arrangement with "
                    + layout
                    + " reading order",
                    "Uses "
                    + font
                    + " hierarchy and "
                    + ori
                    + " native geometry with newly grouped content",
                ],
            }
        )
    save(S / "document-briefs.json", briefs)


if __name__ == "__main__":
    main()
