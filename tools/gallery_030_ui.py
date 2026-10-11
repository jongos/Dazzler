"""Author new spatial arrangements around the existing local demo controls."""

from gallery_030 import R, S, O, OLD, H, BASE, save, start
from lxml import html
import json

U = {
    "webapp-workspace": (
        "The Author Notebook",
        "Young Serif",
        "#2544A0",
        "#D3DCFF",
        "A two-page writing notebook pairs a narrow revision margin with a broad editable manuscript; chapter context closes the desk.",
    ),
    "webapp-board": (
        "The Release Staircase",
        "Office Code Pro",
        "#9C2A14",
        "#FFD74A",
        "A wide four-step production staircase leads from assignments to a separate publication checkpoint; the deadline is a lower closing band.",
    ),
    "webapp-settings": (
        "The Delivery Switchboard",
        "Poppins",
        "#442F89",
        "#E6D5FF",
        "A compact settings console places delivery choices beside a tall confirmation clock and separates urgent-message policy beneath the form.",
    ),
    "data-revenue": (
        "The Membership Observatory",
        "Young Serif",
        "#8A274F",
        "#FFF2B8",
        "A dark plotting wall gives the trend the full width; measure switches sit in a slim rail and the exact ledger follows below.",
    ),
    "data-operations": (
        "The Station Workbench",
        "Archivo",
        "#934100",
        "#FFFFFF",
        "A horizontal station strip sits above a side-by-side reading and exception workbench; units and operating limits remain explicit.",
    ),
    "restaurant-fine-dining": (
        "The Garden Invitation",
        "Libre Baskerville",
        "#173D2A",
        "#CCFF79",
        "A centered garden invitation introduces a narrow course trail with service notes alongside; the botanical drawing becomes a small stamp.",
    ),
    "restaurant-cafe": (
        "The Coffee Counter",
        "Oswald",
        "#71224C",
        "#FFE0EF",
        "A numbered product counter sits beside a tall paper receipt; the cart remains visible beside the choices rather than above them.",
    ),
    "restaurant-reservations": (
        "The Seating Request Desk",
        "Young Serif",
        "#6D370D",
        "#FFEAA3",
        "A seating atlas occupies a wide left panel with a compact request form to its right; access guidance follows as a separate ribbon.",
    ),
    "restaurant-menu": (
        "The Lunch Bulletin",
        "Archivo",
        "#203D9C",
        "#BDEBFF",
        "Search and dietary filters form a horizontal toolbar above a single-column illustrated-style dish ledger; the ingredient warning is a left margin note.",
    ),
    "business-portal": (
        "The Project Review Room",
        "Poppins",
        "#3A5A13",
        "#E1F1C8",
        "A vertical milestone spine accompanies a document review sheet; document tabs sit across the sheet and the review action closes the evidence.",
    ),
}


def main():
    start()
    briefs = []
    for ident, (title, font, accent, paper, why) in U.items():
        old = html.parse(
            str(OLD / "ui" / ident / "index.html"),
            parser=html.HTMLParser(encoding="utf-8"),
        )

        def get(xpath):
            nodes = old.xpath(xpath)
            if not nodes:
                raise ValueError((ident, xpath))
            return "".join(
                html.tostring(e, encoding="unicode", with_tail=False) for e in nodes
            )

        def cls(name):
            return get(
                '//*[contains(concat(" ",normalize-space(@class)," ")," '
                + name
                + ' ")]'
            )

        def byid(name):
            return get('//*[@id="' + name + '"]')

        lead = old.xpath(
            '//*[contains(concat(" ",normalize-space(@class)," ")," lead ")]'
        )
        product_copy = (
            lead[0].text_content()
            if lead
            else "Explore the dishes and choose what suits your lunch."
        )
        if ident == "restaurant-cafe":
            product_copy = "Three good reasons to stop. A fictional pickup counter."
        tag = old.xpath(
            '//*[contains(concat(" ",normalize-space(@class)," ")," eyebrow ")]'
        )[0].text_content()
        extra = ""
        if ident == "restaurant-fine-dining":
            extra = get("//main//header/p[not(@class)]")
        head = (
            '<header><p class="eyebrow">'
            + H(tag)
            + "</p><h1>"
            + H(title)
            + '</h1><p class="lead">'
            + H(product_copy)
            + "</p>"
            + extra
            + "</header>"
        )
        css = ""
        if ident == "webapp-workspace":
            body = (
                head
                + '<div class="notebook-desk"><aside>'
                + cls("revision")
                + "</aside><div>"
                + cls("writing")
                + "</div></div>"
                + cls("chapterline")
            )
            css = '.notebook-desk{display:grid;grid-template-columns:1fr 2.1fr;gap:40px;border-block:2px solid var(--accent);padding:30px 0}.writing{background:white;padding:30px}.writing textarea{min-height:390px;padding:20px 0;border:0;font:18px/1.8 "Young Serif"}.chapterline{display:flex;justify-content:space-between;gap:20px;margin-top:30px}.revision h2{font-size:1.5rem}.revision details{border-top:1px solid;padding-top:20px}'
        elif ident == "webapp-board":
            body = (
                head
                + "<section><h2>Advance Each Assignment</h2>"
                + byid("tasks")
                + byid("status")
                + '</section><div class="finish">'
                + cls("deadline")
                + byid("done")
                + cls("release-note")
                + "</div>"
            )
            css = "#tasks{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;align-items:start}.task{padding:20px;background:#FFF;border-bottom:8px solid var(--accent);display:flex;flex-direction:column;gap:15px}.task:nth-child(2){margin-top:28px}.task:nth-child(3){margin-top:56px}.task:nth-child(4){margin-top:84px}.task h2{font-size:1.2rem}.task button{margin-top:auto}.finish{display:grid;grid-template-columns:1fr 1fr 2fr;gap:30px;border-top:3px solid;padding-top:25px;margin-top:40px}.deadline{font-size:2rem;font-weight:bold}"
        elif ident == "webapp-settings":
            body = (
                head
                + '<div class="switchboard"><div>'
                + byid("settings")
                + '</div><aside class="clock"><p class="eyebrow">NEXT ROUTINE DELIVERY</p>'
                + byid("time")
                + '<p>One daily digest, at your selected time.</p></aside></div><aside class="policy"><h2>Urgent Mentions Stay Separate</h2><p>This preview groups routine messages. Important mentions remain outside the digest.</p></aside>'
            )
            css = ".switchboard{display:grid;grid-template-columns:1.4fr 1fr;gap:50px}.clock{background:var(--accent);color:white;padding:40px;align-self:start;min-height:320px;display:flex;flex-direction:column;justify-content:center}.clock strong{font-size:clamp(3rem,6vw,6rem)}fieldset{border:1px solid;padding:20px;margin:25px 0}fieldset label{margin:14px 0}.policy{margin-top:35px;border-left:12px solid var(--accent);padding-left:25px}"
        elif ident == "data-revenue":
            body = (
                '<div class="observatory"><aside>'
                + head
                + cls("actions")
                + '</aside><section class="plot"><figure>'
                + byid("chart-title")
                + byid("chart")
                + byid("status")
                + '</figure></section><section class="wide"><h2>The Exact Annual Record</h2>'
                + byid("values")
                + "<p>Synthetic observations. Measures use separate scales and do not establish causality.</p></section></div>"
            )
            css = ".observatory{display:grid;grid-template-columns:1fr 2.2fr;gap:35px}.observatory h1{font-size:clamp(2.2rem,3.2vw,3.8rem)}.plot{background:#271725;color:white;padding:30px}.bars{display:flex;align-items:end;gap:12px;height:340px}.bar{display:flex;flex:1;flex-direction:column;align-items:center;font-size:13px;gap:8px}.bar i{display:block;background:#F59AC8;width:100%}figcaption{font-weight:bold;font-size:15px}"
        elif ident == "data-operations":
            body = (
                head
                + cls("stations")
                + '<div class="workbench">'
                + byid("inspector")
                + cls("exception")
                + "</div>"
            )
            css = ".stations{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:20px 0;border-block:2px solid var(--accent)}.workbench{display:grid;grid-template-columns:1.4fr 1fr;gap:30px;margin:35px 0}#inspector{padding:40px;background:#FFE3B0}.reading-value{font-size:5rem;font-variant-numeric:tabular-nums}.exception{padding:30px;border-left:12px solid #A5222B;background:#FFF0F1}.exception h2{font-size:1.5rem}"
        elif ident == "restaurant-fine-dining":
            # Extract only the authored header's child paragraphs; preserve the real button and hidden course list.
            body = (
                '<div class="invitation">'
                + cls("botanical")
                + head
                + byid("courses-button")
                + '</div><div class="supper-trail">'
                + byid("courses")
                + cls("service")
                + "</div>"
            )
            css = ".invitation{text-align:center;max-width:850px;margin:auto}.invitation h1,.invitation p{margin-left:auto;margin-right:auto}.botanical{width:130px;margin:0 auto 15px}.supper-trail{display:grid;grid-template-columns:1.5fr 1fr;gap:50px;margin-top:45px}.courses{list-style:none;padding:0}.courses li{padding:24px 0;border-bottom:1px solid}.courses li strong{font-size:1.5rem;display:block}.service{border:2px solid;padding:28px;align-self:start}"
        elif ident == "restaurant-cafe":
            body = (
                head
                + '<div class="counter"><section><h2>Choose Your Counter Order</h2>'
                + cls("actions")
                + byid("products")
                + byid("status")
                + '<p>Sample prices before tax. No purchase or pickup request is submitted.</p></section><aside class="receipt"><h2>Your Sample Receipt</h2>'
                + byid("cart")
                + '<p>Subtotal <strong id="total">$0.00</strong></p>'
                + byid("clear")
                + "<p>Local demonstration. No order or payment is submitted.</p></aside></div>"
            )
            css = '.counter{display:grid;grid-template-columns:2fr 1fr;gap:45px}#products{display:grid;grid-template-columns:1fr 1fr;gap:25px}#products article{padding:25px;border-top:10px solid var(--accent);background:white}#products h2{font-size:1.6rem}.receipt{background:white;padding:30px;border-top:12px dashed var(--accent);align-self:start}#total{display:block;font:3rem "Oswald"}'
        elif ident == "restaurant-reservations":
            # The zone buttons are outside the form; their existing click handlers update its zone field.
            form = old.xpath('//*[@id="booking"]')[0]
            zones = form.xpath('.//*[@class="zones"]')[0]
            zones.getparent().remove(zones)
            body = (
                head
                + '<div class="atlas"><section><h2>Find Your Place</h2>'
                + html.tostring(zones, encoding="unicode")
                + '</section><div class="request-sheet">'
                + html.tostring(form, encoding="unicode")
                + "</div></div>"
                + cls("access")
            )
            css = ".atlas{display:grid;grid-template-columns:1.6fr 1fr;gap:40px}.zones{display:grid;grid-template-columns:1fr 1fr;gap:20px;background:#D7AD53;padding:25px}.zones button{min-height:180px;display:flex;flex-direction:column;justify-content:center;gap:15px;background:#FFF7DF;color:#542907}.zones button:last-child{grid-column:1/-1}.zone-mark{font-size:2rem}.request-sheet{background:white;padding:28px}.access{border-top:2px solid;margin-top:35px;padding-top:20px}.requestline{display:block}"
        elif ident == "restaurant-menu":
            oldhead = old.xpath("//main//header")[0]
            controls = "".join(
                html.tostring(e, encoding="unicode")
                for e in oldhead
                if e.tag not in ("h1", "p")
            )
            body = (
                head
                + '<div class="filterbar">'
                + controls
                + byid("result-count")
                + '</div><div class="lunch-board"><aside>'
                + cls("allergy")
                + "</aside><section><h2>Today’s Dishes</h2>"
                + byid("menu-items")
                + "</section></div>"
            )
            css = ".filterbar{display:flex;align-items:center;gap:20px;flex-wrap:wrap;background:white;padding:25px}.filterbar input[type=search]{width:260px;margin:0}.lunch-board{display:grid;grid-template-columns:1fr 2.5fr;gap:40px;margin-top:35px}#menu-items article{display:grid;grid-template-columns:1fr auto;gap:10px;border-top:3px solid var(--accent);padding:25px 0}#menu-items h2{font-size:1.6rem}#menu-items p{grid-column:1/-1}.allergy{border-left:8px solid #A52332;padding-left:20px}"
        else:
            body = (
                head
                + '<div class="review-room">'
                + cls("milestone-ribbon")
                + '<div class="review-sheet">'
                + cls("documents")
                + get('//*[@class="folio-review"]/article')
                + "</div></div><p>No approval or message is sent. Local review can be undone.</p>"
            )
            css = ".review-room{display:grid;grid-template-columns:1fr 2fr;gap:50px}.milestone-ribbon ol{border-left:3px solid var(--accent);padding-left:25px}.milestone-ribbon li{padding:20px 0}.review-sheet{background:white;border-top:12px solid var(--accent);padding:35px}.documents{display:flex;gap:16px;border-bottom:1px solid;padding-bottom:25px}.review-sheet article{padding-top:25px}#preview{font-size:1.3rem;line-height:1.8}"
        responsive = "@media(max-width:750px){.notebook-desk,.switchboard,.observatory,.workbench,.supper-trail,.counter,.atlas,.lunch-board,.review-room,.finish{display:block}.chapterline{display:block}.chapterline span{display:block;margin:12px 0}#tasks{grid-template-columns:1fr}.task:nth-child(n){margin-top:0}.clock,.plot,.receipt,.request-sheet{margin-top:25px}.stations{grid-template-columns:1fr 1fr}.zones{display:block}.zones button{width:100%;margin:12px 0}#products{grid-template-columns:1fr}.filterbar input[type=search]{width:100%}.filterbar{display:block}.review-sheet{padding:22px}.bars{gap:6px}.bar{font-size:11px}.reading-value{font-size:3.5rem}}"
        folder = O / "ui" / ident
        (folder / "styles.css").write_text(
            ":root{--accent:"
            + accent
            + ";--paper:"
            + paper
            + ';--display:"'
            + font
            + '"}'
            + BASE
            + css
            + responsive,
            encoding="utf-8",
        )
        scripts = "".join(
            html.tostring(e, encoding="unicode") for e in old.xpath("//script")
        )
        page = (
            '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'
            + H(title)
            + '</title><link rel="stylesheet" href="../../fonts/fonts.css"><link rel="stylesheet" href="styles.css"><body><nav class="top"><a href="../../index.html">Dazzler Design Gallery</a><span>Fictional Local Demo</span></nav><main>'
            + body
            + "</main><footer>Original Dazzler design. Apache-2.0. Local font notices accompany the files. Synthetic data; no live service.</footer>"
            + scripts
            + "</body></html>"
        )
        prompt = f"Use Dazzler to design {title.lower()} for its fictional reader task. {why} Retain the existing data and functional controls, with keyboard and mobile access. Use {font}, {accent} and {paper}. Preserve factual caveats and local-only behavior; do not imply real booking, payment, publication or account changes."
        data = json.loads((folder / "template.json").read_text(encoding="utf-8"))
        data.update(title=title, prompt=prompt)
        save(folder / "template.json", data)
        import re

        page = re.sub(
            r'(<script id="template-data" type="application/json">).*?(</script>)',
            lambda m: m[1]
            + json.dumps(data, ensure_ascii=False).replace("<", "\\u003c")
            + m[2],
            page,
            flags=re.S,
        )
        (folder / "index.html").write_text(page, encoding="utf-8")
        briefs.append(
            dict(
                id=ident,
                prompt=prompt,
                direction=title,
                rationale=why,
                font=font,
                surface=paper + " / " + accent,
                composition=title,
                directionsConsidered=[
                    "A compact conventional dashboard",
                    title,
                    "An immersive full-screen story",
                ],
                selectionReason=why,
                structuralChanges=[
                    why,
                    "Reorders controls and supporting evidence into the "
                    + title.lower()
                    + " sequence.",
                    "Uses "
                    + font
                    + " hierarchy with new control grouping and surface proportions.",
                ],
            )
        )
    save(S / "interface-briefs.json", briefs)


if __name__ == "__main__":
    main()
