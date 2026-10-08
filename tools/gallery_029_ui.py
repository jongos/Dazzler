"""New UI compositions; retain tested local behaviors and synthetic data only."""

import json, re, html
from gallery_029 import R, S, O, OLD, save, CSS

B = {
    "webapp-workspace": (
        "The Revision Desk",
        "Libre Baskerville",
        "#79321A",
        "#FFF4E9",
        "A top manuscript strip opens into a full-width writing sheet, followed by a horizontal revision desk.",
        """<header><p class="eyebrow">MARGIN / REVISION DESK</p><h1>One Chapter,<br>One Clear Thought.</h1><p class="lead">A quiet place to draft, followed by a deliberate editing pass.</p></header><div class="chapterline"><span>01 · At the River</span><span>02 · The Returning Path</span><span>03 · What We Kept</span></div><section class="writing"><label for="draft">Chapter One Manuscript</label><textarea id="draft">The river had changed its course since we last walked this bank. Where the old path ended, a narrow bridge now joined the two neighborhoods. We crossed slowly, reading the marks left by the winter water.

On the far side, someone had planted a row of willows. Their roots held the edge of the new path.</textarea><div class="actions"><button id="save">Save Draft Locally</button><span id="count"></span></div><p id="status" role="status"></p></section><section class="revision"><h2>The Next Revision</h2><blockquote>Let the landscape carry the change.</blockquote><details><summary>Open the Editing Checklist</summary><p>Clarify the time jump. Retain the willow image. Read the final sentence aloud. Keep a separate copy of important work.</p></details></section>""",
        '.chapterline{display:flex;gap:30px;flex-wrap:wrap;padding:22px 0;border-block:1px solid}.writing{background:white;padding:38px;margin-top:28px;box-shadow:12px 12px 0 #E8BA9C}.writing textarea{width:100%;min-height:300px;border:0;border-bottom:1px solid;font:20px/1.8 "Libre Baskerville";resize:vertical}.revision{display:grid;grid-template-columns:1fr 2fr;gap:30px;margin-top:60px}.revision details{grid-column:2}',
    ),
    "webapp-board": (
        "The Production Rack",
        "Oswald",
        "#4D21A3",
        "#F0E8FF",
        "A production rack puts four assignments into vertical ticket columns beneath a narrow deadline spine.",
        """<div class="rack"><header><p class="eyebrow">SIGNAL / EPISODE 08</p><h1>The Night Shift</h1><p class="lead">Four assignments between the recording and the release.</p><p class="deadline">FRIDAY<br><strong>16:00</strong></p><p id="done"></p></header><section><h2>Move the Work Forward</h2><div id="tasks"></div><p id="status" role="status"></p><aside class="release-note"><h2>Before Publication</h2><p>Fact check and transcript approval are required. Each button advances only this local demonstration; no production system changes.</p></aside></section></div>""",
        '.rack{display:grid;grid-template-columns:280px 1fr;gap:50px}.rack header{background:#4D21A3;color:white;padding:30px}.deadline strong{font:70px "Oswald"}#tasks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}.task{padding:28px;background:white;border-top:12px solid #4D21A3;display:flex;flex-direction:column;gap:18px}.task h2{margin:0}.task button{margin-top:auto}.stage{font-weight:bold}.release-note{margin-top:35px;padding:25px;border:2px solid}',
    ),
    "webapp-settings": (
        "Your Notification Day",
        "Work Sans",
        "#00534A",
        "#FFFFFF",
        "A horizontal daily rhythm pairs a schedule band with a two-column preferences form and explicit urgent-message exception.",
        """<header><p class="eyebrow">STILL / NOTIFICATION SETTINGS</p><h1>A Day With Fewer Interruptions</h1><p class="lead">Keep urgent mentions visible. Gather routine messages into one delivery.</p></header><section class="dayline"><span>START</span><strong id="time">09:00</strong><span>ONE DAILY DIGEST</span><span>FINISH</span></section><form id="settings"><div><h2>Set the Delivery Window</h2><label for="digest">Digest Time</label><select id="digest"><option value="09:00">09:00 · Start of Day</option><option value="13:00">13:00 · After Lunch</option><option value="17:00">17:00 · End of Day</option></select><p>Urgent mentions remain separate from routine summaries.</p></div><fieldset><legend>Delivery Channels</legend><label><input type="checkbox" checked> Mentions and Replies</label><label><input type="checkbox" checked> Project Summaries</label><label><input type="checkbox"> Product News</label></fieldset><button>Apply to This Preview</button><p id="status" role="status"></p></form>""",
        ".dayline{background:#00534A;color:white;display:flex;align-items:center;justify-content:space-between;gap:15px;padding:35px;margin:35px 0}.dayline strong{font-size:clamp(2rem,5vw,5rem)}#settings{display:grid;grid-template-columns:1fr 1fr;gap:35px}fieldset{border:2px solid;padding:25px}fieldset label{display:block;margin:20px 0}",
    ),
    "data-revenue": (
        "Annual Evidence Ledger",
        "Archivo",
        "#154A9B",
        "#FFFFFF",
        "An annual ledger puts the exact table beside a bounded comparison chart, with a compact measure-switching masthead.",
        """<header class="ledgerhead"><div><p class="eyebrow">COMMON GROUND / 2021–2026</p><h1>Six Years,<br>Two Measures</h1></div><p class="lead">Membership and revenue describe different parts of the same organization. Compare each on its own scale.</p></header><div class="actions"><button data-metric="revenue" aria-pressed="true">Revenue</button><button data-metric="members" aria-pressed="false">Members</button></div><div class="evidencegrid"><figure><figcaption id="chart-title"></figcaption><div id="chart"></div><p id="status" role="status"></p></figure><section><h2>The Annual Record</h2><div id="values"></div><p>Synthetic observations. Separate measures, not evidence of causality.</p></section></div>""",
        ".ledgerhead{display:grid;grid-template-columns:1fr 1fr;gap:35px;border-bottom:8px solid #154A9B;margin-bottom:30px}.evidencegrid{display:grid;grid-template-columns:1.3fr 1fr;gap:40px;align-items:start;margin-top:35px}figure{margin:0;background:#E8F1FF;padding:22px}.bars{display:flex;align-items:end;gap:12px;height:320px}.bar{display:flex;flex:1;flex-direction:column;align-items:center;font-size:13px;gap:8px}.bar i{display:block;background:#154A9B;width:100%}figcaption{font-weight:bold;font-size:14px}",
    ),
    "data-operations": (
        "Station Inspection Log",
        "Office Code Pro",
        "#006A70",
        "#E0FFFF",
        "A vertical station selector becomes an inspection instrument beside a large live reading and a separate exception log.",
        """<header><p class="eyebrow">TIDE / FICTIONAL FACILITY</p><h1>Inspect Before You Intervene</h1><p class="lead">Four stations report different units. Select a station to read its own operating context.</p></header><div class="instrument"><nav aria-label="Stations" class="stations"><button data-station="0">01 · Intake</button><button data-station="1">02 · Filter</button><button data-station="2">03 · Storage</button><button data-station="3">04 · Outlet</button></nav><section id="inspector" aria-live="polite"></section></div><section class="exception"><h2>Exception Log</h2><strong>Attention · Filter Pressure</strong><p>2.8 bar is above the illustrative 1.5–2.5 bar band. Inspect the filter before changing a setting. This is synthetic telemetry, not an operational control.</p></section>""",
        'body:has(.instrument){background:#062F36;color:#FFFFFF}.instrument{color:#17212B;display:grid;grid-template-columns:230px 1fr;border:3px solid #006A70;margin:35px 0}.stations{background:#C3FFFF;display:flex;flex-direction:column;padding:20px;border:0;gap:12px}#inspector{padding:30px;background:white}.reading-value{font:80px/1 "Office Code Pro";margin:20px 0}.exception{color:#17212B;border-left:10px solid #AE1430;padding:15px 30px;background:white}',
    ),
    "restaurant-fine-dining": (
        "The Seasonal Folio",
        "Young Serif",
        "#6B224B",
        "#FFF1F6",
        "A botanical course folio replaces the numeral poster with a table-centered menu reveal and a small service ledger.",
        """<div class="folio"><header><p class="eyebrow">VESPER / TWELVE SEATS</p><h1>A Table for the Season</h1><p class="lead">Five courses, paced for conversation.</p><p>Wednesday–Saturday · 19:00<br>Sample price $95 per person before tax.</p><button id="courses-button" aria-expanded="false" aria-controls="courses">Explore the Menu</button></header><div class="botanical" aria-hidden="true"><svg viewBox="0 0 400 430"><path d="M200 400Q150 200 240 40" fill="none" stroke="#6B224B" stroke-width="5"/><g fill="#6B224B"><ellipse cx="180" cy="290" rx="65" ry="23" transform="rotate(25 180 290)"/><ellipse cx="233" cy="230" rx="65" ry="23" transform="rotate(-30 233 230)"/><ellipse cx="191" cy="160" rx="57" ry="20" transform="rotate(35 191 160)"/><ellipse cx="241" cy="90" rx="43" ry="19" transform="rotate(-35 241 90)"/></g></svg></div></div><section id="courses" hidden><h2>The Five Courses</h2><ol class="courses"><li>Tomato Water · Basil Oil</li><li>Roast Beet · Cultured Cream</li><li>Market Fish · Fennel</li><li>Summer Squash · Brown Butter</li><li>Plum · Almond</li></ol><p>Tell the team about allergies before ordering. Menu and price are fictional.</p></section><section class="service"><h2>At Your Pace</h2><p>A small dining room, a long conversation and an unhurried sequence. This example does not accept reservations.</p></section>""",
        ".folio{display:grid;grid-template-columns:1.3fr 1fr;align-items:center;gap:40px}.botanical{border:1px solid #6B224B;border-radius:50% 50% 0 0;padding:30px}.courses{display:grid;grid-template-columns:repeat(5,1fr);gap:25px;padding:30px;list-style-position:inside}.courses li{border-top:2px solid;padding-top:20px}.service{max-width:700px;margin:40px auto;border-block:1px solid;padding:30px;text-align:center}",
    ),
    "restaurant-cafe": (
        "The Counter Ledger",
        "Oswald",
        "#A52D10",
        "#FFC64D",
        "A horizontal receipt strip precedes a spacious product counter; the order remains visible without a sidebar ticket.",
        """<header class="cafehead"><div><p class="eyebrow">PAPER CUP / OPEN 07:00–15:00</p><h1>First Coffee.<br>Then Everything Else.</h1></div><p class="lead">Three good reasons to stop.<br>A fictional pickup counter.</p></header><section class="receipt"><div><h2>Your Order</h2><div id="cart">Your ticket is empty.</div></div><p>Subtotal <strong id="total">$0.00</strong></p><button id="clear">Clear Order</button></section><div class="actions"><button data-filter="all" aria-pressed="true">All</button><button data-filter="coffee" aria-pressed="false">Coffee</button><button data-filter="bakery" aria-pressed="false">Bakery</button></div><div id="products"></div><p id="status" role="status"></p><p>Sample prices before tax. No purchase or pickup request is submitted.</p>""",
        '.cafehead{display:flex;gap:40px;align-items:end;justify-content:space-between}.receipt{display:flex;align-items:center;justify-content:space-between;gap:25px;border-block:3px dashed;padding:25px 0;margin:35px 0}.receipt strong{font:40px "Oswald"}.product{display:flex;justify-content:space-between;gap:30px;padding:30px 0;border-bottom:2px solid}.product h2{font-size:2rem}.cart-line{display:flex;gap:25px}',
    ),
    "restaurant-reservations": (
        "A Table That Fits",
        "Poppins",
        "#215B38",
        "#FFFFFF",
        "A request-first reservation sheet aligns date and party controls above three explicitly labeled atmosphere choices.",
        """<header><p class="eyebrow">SOLSTICE / TABLE PREFERENCES</p><h1>Plan the Conversation</h1><p class="lead">Start with your visit, then choose the atmosphere. A preference is not a confirmed reservation.</p></header><form id="booking"><div class="requestline"><label for="date">Preferred Date<input id="date" type="date" required></label><label for="party">Party Size<select id="party"><option>2 guests</option><option>4 guests</option><option>6 guests</option></select></label><label for="zone">Preferred Zone<input id="zone" value="Window Table" readonly></label></div><section class="zones" aria-label="Table Preferences"><button type="button" data-zone="Window Table"><span class="zone-mark">☀</span>Window Table<br><small>Bright · Seats 2</small></button><button type="button" data-zone="Quiet Corner"><span class="zone-mark">◌</span>Quiet Corner<br><small>Lower Traffic · Seats 2</small></button><button type="button" data-zone="Shared Table"><span class="zone-mark">◎</span>Shared Table<br><small>Social · Seats 6</small></button></section><button type="submit">Preview Request</button><p id="status" role="status"></p></form><aside class="access"><h2>Make the Visit Work</h2><p>Step-free entrance. Confirm access, availability and dietary needs with the venue. No information leaves this demonstration.</p></aside>""",
        ".requestline{display:grid;grid-template-columns:repeat(3,1fr);gap:25px;margin:35px 0}.zones{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:35px}.zones button{padding:35px 15px;background:white;color:#215B38;line-height:1.6}.zones button[aria-pressed=true]{background:#215B38;color:white}.zone-mark{display:block;font-size:50px}.access{border-top:3px solid;margin-top:40px;padding:25px 0}",
    ),
    "restaurant-menu": (
        "The Lunch Index",
        "Work Sans",
        "#9D2226",
        "#FFE154",
        "An indexed lunch board uses a narrow search column and a two-column dish field, followed by a clearly separated allergy note.",
        """<div class="lunch"><header><p class="eyebrow">SAFFRON / UNTIL 15:00</p><h1>Find Your Lunch</h1><label for="search">Find a Dish<input id="search" type="search" placeholder="Lentil or chicken"></label><label class="veg"><input id="veg" type="checkbox"> Vegetarian Only</label><p id="result-count" role="status"></p></header><section aria-label="Lunch Dishes"><div id="menu-items"></div></section></div><aside class="allergy"><h2>Before You Order</h2><p>Vegetarian labels describe ingredients, not allergy safety. Ask about preparation and cross-contact. Sample USD prices; no orders are accepted.</p></aside>""",
        ".lunch{display:grid;grid-template-columns:270px 1fr;gap:50px}.lunch h1{font-size:3.5rem}.veg{display:block;margin:25px 0}#menu-items{display:grid;grid-template-columns:1fr 1fr;gap:25px}.dish-row{border:2px solid #9D2226;padding:25px;background:white;display:flex;flex-direction:column;gap:15px}.dish-number{font-size:13px;letter-spacing:.2em}.dish-row h2{font-size:1.6rem}.price{font-size:2rem;margin-top:auto}.allergy{max-width:800px;margin:45px 0 0 auto;border-top:2px solid;padding:20px}",
    ),
    "business-portal": (
        "The Review Folio",
        "Libre Baskerville",
        "#174878",
        "#E7F1FF",
        "A two-page-like review folio makes the document preview primary, with a bottom milestone ribbon and reversible approval state.",
        """<header><p class="eyebrow">FIELDWORK / CLIENT REVIEW</p><h1>The Courtyard Project</h1><p class="lead">Review the material direction before detailed design begins.</p></header><div class="folio-review"><nav class="documents" aria-label="Project Documents"><button data-doc="Materials">Materials</button><button data-doc="Schedule">Schedule</button></nav><article><p class="eyebrow">DOCUMENT PREVIEW</p><h2 id="preview-title">Materials</h2><p id="preview">The proposal pairs reclaimed brick with pale timber and a permeable courtyard surface. Final specifications and costs remain subject to confirmation.</p><button id="approve">Mark Reviewed Locally</button><p id="status" role="status"></p></article></div><section class="milestone-ribbon"><h2>Project Sequence</h2><ol><li>06 Jun<br>Site Survey · Complete</li><li>20 Jun<br>Concept Review · Complete</li><li>04 Jul<br>Material Direction · Review</li><li>18 Jul<br>Detailed Design · Planned</li></ol></section><p>No approval or message is sent. Local review can be undone.</p>""",
        ".folio-review{display:grid;grid-template-columns:180px 1fr;background:white;margin-top:35px;border:1px solid #174878}.documents{display:flex;flex-direction:column;gap:15px;padding:25px;border:0;background:#D1E4FC}.folio-review article{padding:45px}.folio-review article p{font-size:20px}.milestone-ribbon{border-top:5px solid #174878;margin-top:45px;padding-top:25px}.milestone-ribbon ol{display:grid;grid-template-columns:repeat(4,1fr);gap:25px;padding-left:20px}",
    ),
}


def main():
    briefs = []
    for ident, (title, font, accent, paper, why, body, css) in B.items():
        old = (OLD / "ui" / ident / "index.html").read_text(encoding="utf-8")
        script = re.findall(r"<script>(.*?)</script>", old, re.S)[0]
        data = json.loads(
            (OLD / "ui" / ident / "template.json").read_text(encoding="utf-8")
        )
        data["title"] = title
        data["prompt"] = (
            "Use Dazzler to build a fictional "
            + title.lower()
            + ". "
            + why
            + " Preserve all synthetic data and working local controls. Use "
            + font
            + " with "
            + accent
            + " on "
            + paper
            + ". Compose for desktop and mobile; do not imply a live service."
        )
        folder = O / "ui" / ident
        folder.mkdir(parents=True, exist_ok=True)
        save(folder / "template.json", data)
        base = (
            CSS
            + "label{display:block;font-weight:600}input:not([type=checkbox]),select{display:block;width:100%;padding:12px;border:1px solid #66717A;background:white;color:#17212B;margin:8px 0 20px}input[type=checkbox]{width:20px;height:20px;vertical-align:middle}.actions{display:flex;flex-wrap:wrap;gap:12px;margin:24px 0}button[aria-pressed=false]{background:transparent;color:var(--accent)}button:disabled{opacity:.65;cursor:default}figure{min-width:0}.table-scroll{overflow:auto}p[role=status]{min-height:1.6em}small{font-size:14px}.reading-value{font-variant-numeric:tabular-nums}"
        )
        responsive = "@media(max-width:750px){.rack,.evidencegrid,.ledgerhead,.instrument,.folio,.lunch,.folio-review,.revision,#settings{display:block}.cafehead,.receipt,.dayline{display:flex;flex-wrap:wrap}.rack header{border:0}.requestline,.zones,#menu-items,.courses,.milestone-ribbon ol{grid-template-columns:1fr}.writing{padding:20px}.writing textarea{font-size:17px}.documents{flex-direction:row}.stations{display:grid;grid-template-columns:1fr 1fr}.folio-review article{padding:25px}.botanical{max-width:300px;margin:30px auto}.rack h1{font-size:3rem}#tasks{grid-template-columns:1fr}.lunch header{margin-bottom:35px}.bar{font-size:11px}.bars{gap:6px}.evidencegrid section{margin-top:30px}}"
        (folder / "styles.css").write_text(
            ":root{--accent:"
            + accent
            + ";--paper:"
            + paper
            + ';--display:"'
            + font
            + '"}\n'
            + base
            + css
            + responsive,
            encoding="utf-8",
        )
        (folder / "index.html").write_text(
            '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'
            + title
            + '</title><link rel="stylesheet" href="../../fonts/fonts.css"><link rel="stylesheet" href="styles.css"><body><nav class="top"><a href="../../index.html">Dazzler Design Gallery</a><span>Fictional Local Demo</span></nav><main>'
            + body
            + '</main><footer>Original design · Apache-2.0. Local font notices accompany the files. Synthetic data; no live service.</footer><script id="template-data" type="application/json">'
            + json.dumps(data, ensure_ascii=False)
            + "</script><script>"
            + script
            + "</script></body></html>",
            encoding="utf-8",
        )
        briefs.append(
            {
                "id": ident,
                "prompt": data["prompt"],
                "direction": title,
                "rationale": why,
                "font": font,
                "surface": paper + " / " + accent,
                "directionsConsidered": [
                    "A conventional card dashboard",
                    title,
                    "An immersive editorial cover",
                ],
                "selectionReason": why,
                "structuralChanges": [
                    "Replaces the previous spatial arrangement with " + why,
                    "Moves the primary interaction into the new "
                    + title.lower()
                    + " sequence",
                    "Uses "
                    + font
                    + " hierarchy with newly grouped control and evidence regions",
                ],
            }
        )
    save(S / "interface-briefs.json", briefs)


if __name__ == "__main__":
    main()
