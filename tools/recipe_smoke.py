"""Build five synthetic integration probes; these are not library templates or aesthetic tests."""

import argparse
import html
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "skills/dazzler-frontend/scripts"))
import fonts
import recipes


def build(out):
    out = Path(out).resolve()
    out.mkdir(parents=True, exist_ok=False)
    briefs = json.loads((ROOT / "tests/fixtures/recipe-briefs.json").read_text())
    catalog = fonts.load()["fonts"]
    available = {
        f["name"]: f
        for f in catalog
        if f["status"] == "bundled"
        and f["id"] in {"work-sans", "young-serif", "inter", "league-gothic"}
    }
    titles = [
        "The River After Rain",
        "Made to Be Repaired",
        "An Evening of Sound",
        "Find Your Permit",
        "Service Requests",
    ]
    content = [
        '<article><p class="lead">How a city learns to make room for its river.</p><h2>A Wider View</h2><p>On the morning after heavy rain, the riverside path tells two stories: where the water has been and which places people still need to reach. This fictional field note follows three crossings and the communities around them.</p><blockquote>Make the river visible in the decisions that shape its banks.</blockquote><h2>Along the Water</h2><p>Our walking route begins at the east bridge. The lower path is closed, while the upper crossing remains open. Clear route information matters as much as the long-term plan.</p><details><summary>Read the Field Notes</summary><p>Illustrative observations only. Check local conditions before travel.</p></details></article>',
        '<label for="filter">Availability</label><select id="filter"><option value="all">All Bags</option><option value="ready">Ready to Ship</option></select><div class="products"><article><p class="number">18 L</p><h2>Daily Pack</h2><p>Replaceable straps, recycled canvas.</p><p><strong>$120</strong> · Ready to ship</p><button data-product="Daily Pack">View Daily Pack</button></article><article data-later><p class="number">28 L</p><h2>Weekend Pack</h2><p>A larger opening and removable frame.</p><p><strong>$180</strong> · Available next month</p><button data-product="Weekend Pack">View Weekend Pack</button></article></div><p id="result" role="status">Choose a bag to inspect its details.</p>',
        '<p class="lead">Three performances. One shared listening room.</p><div class="poster"><p class="number">18 OCT</p><p>Doors 18:30 · Performance Hall<br>Step-free entrance on River Street</p></div><h2>The Program</h2><table><caption>Illustrative Evening Schedule</caption><thead><tr><th>Time</th><th>Performance</th></tr></thead><tbody><tr><td>19:00</td><td>Open Water — String Quartet</td></tr><tr><td>20:00</td><td>Quiet Signals — Electronic Set</td></tr><tr><td>21:00</td><td>Night Chorus — Vocal Ensemble</td></tr></tbody></table><button id="action">Check Visit Details</button><p id="result" role="status">Select the button for access information.</p>',
        '<p class="lead">Start with what you need to do.</p><label for="query">Search Permit Guidance</label><input id="query" type="search" placeholder="Try garden"><button id="action">Search Guidance</button><p id="result" role="status">Three guidance topics.</p><div class="guidance"><article data-topic="garden"><h2>Garden Structures</h2><p>Find the drawings and measurements needed before applying.</p></article><article data-topic="events"><h2>Community Events</h2><p>Review location, attendance and access information.</p></article><article data-topic="signs"><h2>Shop Signs</h2><p>Check placement and size requirements for a new sign.</p></article></div>',
        '<p class="lead">Review the queue and inspect the next request.</p><div class="workspace"><table><caption>Illustrative Open Requests</caption><thead><tr><th>Request</th><th>Status</th><th>Action</th></tr></thead><tbody><tr><td>Broken Path Light</td><td>New</td><td><button data-record="Broken Path Light">Inspect Light</button></td></tr><tr><td>Loose Handrail</td><td>Assigned</td><td><button data-record="Loose Handrail">Inspect Handrail</button></td></tr></tbody></table><aside aria-label="Selected Request"><h2>Request Details</h2><p id="result" role="status">Select a request to inspect it.</p></aside></div>',
    ]
    script = """const result=document.querySelector('#result');document.querySelectorAll('[data-product]').forEach(b=>b.onclick=()=>result.textContent=b.dataset.product+' has replaceable straps and a repair guide.');document.querySelector('#filter')?.addEventListener('change',e=>document.querySelector('[data-later]').hidden=e.target.value==='ready');document.querySelectorAll('[data-record]').forEach(b=>b.onclick=()=>result.textContent=b.dataset.record+' — assigned to the maintenance team.');document.querySelector('#action')?.addEventListener('click',()=>{const q=document.querySelector('#query');if(q){let n=0;document.querySelectorAll('[data-topic]').forEach(a=>{a.hidden=!a.textContent.toLowerCase().includes(q.value.toLowerCase());if(!a.hidden)n++;});result.textContent=n+' matching topic'+(n===1?'':'s')+'.';}else result.textContent='Step-free entry and accessible seating are available in this fictional example.';});"""
    evidence = []
    for i, brief in enumerate(briefs):
        context = brief["contexts"][0]
        result = recipes.shortlist(brief)
        selected = result["candidates"][0]
        recipe = recipes.lookup(selected["id"])["recipe"]
        palette = dict(recipe["palette"])
        changes = [
            "Adapted content and controls to the synthetic brief; retained the recipe's core arrangement intent.",
            "Body size at least 16px, line height at least 1.5, reading measure capped at 60ch; responsive single-column reflow.",
        ]
        if context == "software":
            palette.update(
                background="#FFFFFF",
                surface="#EDF3FA",
                text="#14283F",
                accent="#0047AB",
                accentText="#FFFFFF",
            )
            changes.append(
                "Explicit test brand locks replace the suggested palette; existing table and navigation semantics retained."
            )
        selected_fonts = {}
        css_links = []
        for role in ("heading", "body"):
            wanted = recipe["fonts"][role]
            fallback = (
                "Young Serif"
                if role == "heading" and "serif" in recipe["fonts"]["fontCharacter"]
                else "Work Sans"
            )
            font = available.get(wanted, available[fallback])
            selected_fonts[role] = font["files"][0]["css_family"]
            if font["name"] != wanted:
                changes.append(
                    f"{role}: substituted available {font['name']} for {wanted}; verify wrapping after substitution."
                )
            target = out / "fonts" / font["id"]
            if not target.exists():
                fonts.export(font, out / "fonts")
            sample = (
                html.unescape(__import__("re").sub("<[^>]+>", " ", content[i]))
                + titles[i]
            )
            assert any(
                fonts.covers(face, sample) and fonts.supports_weight(face, 400)
                for face in font["files"]
            )
            css_links.append(
                f'<link rel="stylesheet" href="fonts/{font["id"]}/fonts.css">'
            )
        n = recipe["numeric"]
        css = f"""*{{box-sizing:border-box}}body{{margin:0;background:{palette['background']};color:{palette['text']};font-family:'{selected_fonts['body']}',sans-serif;font-size:{max(16,n['bodyPx'])}px;line-height:{max(1.5,n['lineHeight'])}}}main{{max-width:{n['maxWidthPx']}px;margin:auto;padding:clamp(20px,5vw,70px)}}h1,h2{{font-family:'{selected_fonts['heading']}',serif;line-height:1.12}}h1{{font-size:clamp(2.5rem,6vw,{max(40,n['headingPx'])}px);max-width:18ch}}h2{{font-size:1.6rem}}p,blockquote{{max-width:{min(60,n['measureCh'])}ch}}.lead{{font-size:1.2em}}header{{border-top:10px solid {palette['accent']};padding-top:20px;margin-bottom:36px}}article,aside,.poster{{padding:24px;background:{palette['surface']};border-radius:{n['radiusPx']}px}}article+article{{margin-top:20px}}.products,.workspace{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:{max(16,n['gapPx'])}px;margin:24px 0}}.products article+article{{margin-top:0}}.number{{font-size:3rem;margin:0;font-weight:700}}blockquote{{border-left:5px solid {palette['accent']};padding-left:20px;margin:28px 0}}button,select,input,summary{{font:inherit;min-height:44px}}button{{background:{palette['accent']};color:{palette['accentText']};border:0;padding:12px 18px;cursor:pointer;margin:8px 0}}input,select{{max-width:100%;padding:8px}}label{{display:block;margin-top:24px}}:focus-visible{{outline:3px solid {palette['text']};outline-offset:4px}}table{{width:100%;border-collapse:collapse;margin:24px 0}}th,td{{text-align:left;padding:12px 8px;border-bottom:1px solid currentColor;overflow-wrap:anywhere}}caption{{text-align:left;font-weight:bold}}footer{{margin-top:40px;border-top:1px solid currentColor;padding-top:16px}}[hidden]{{display:none!important}}@media(max-width:650px){{.products,.workspace{{grid-template-columns:1fr}}article,aside{{padding:16px}}th,td{{padding:8px 4px}}}}"""
        css += ".workspace table{table-layout:fixed}.workspace th:nth-child(2){width:30%}.workspace td button{width:100%;padding:10px 6px;overflow-wrap:anywhere}"
        css += "h1,h2{font-weight:400}body{font-synthesis:none}"
        page = f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{titles[i]}</title>{"".join(css_links)}<style>{css}</style></head><body><main><header><p>Fictional Demonstration</p><h1>{titles[i]}</h1></header>{content[i]}<footer>Illustrative content. Controls demonstrate local behavior only.</footer></main><script>{script}</script></body></html>'
        (out / f"{context}.html").write_text(page, encoding="utf8")
        record = recipes.record(
            {
                "recipeId": selected["id"],
                "rationale": f"Selected for {context}: {selected['arrangement']} supports the supplied reader task and representative content.",
                "adaptations": changes,
            }
        )
        evidence.append(
            {
                "context": context,
                "selection": result,
                "derivation": record,
                "actualFonts": selected_fonts,
                "actualPalette": palette,
            }
        )
    (out / "internal-decisions.json").write_text(
        json.dumps(evidence, indent=2), encoding="utf8"
    )
    print(
        f"Built five derived probes in {out}; rendering and interaction checks still required"
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("out", type=Path)
    build(parser.parse_args().out)
