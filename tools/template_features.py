"""Build real local chart and interaction artifacts for the template scenarios."""

import json, subprocess, tempfile, shutil, html
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def prepare(docs, uis, out):
    (out / "charts").mkdir(exist_ok=True)
    (out / "data").mkdir(exist_ok=True)
    jobs = []
    for d in docs:
        n = 0
        for pg in d["pages"]:
            for block in pg["blocks"]:
                if block["type"] == "chart":
                    n += 1
                    block["asset"] = d["id"] + "-" + str(n)
                    jobs.append(
                        (
                            block["asset"],
                            block["label"],
                            block["rows"],
                            block["kind"],
                            block["unit"],
                            d,
                        )
                    )
        (out / "data" / f"{d['id']}.json").write_text(
            json.dumps(
                {
                    "schemaVersion": 1,
                    **d["sample"],
                    "design": {
                        k: d[k]
                        for k in (
                            "accent",
                            "secondary",
                            "bright",
                            "paper",
                            "headingFont",
                            "voice",
                        )
                    },
                    "capabilities": d["capabilities"],
                },
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
    for d in uis:
        kind = d["layout"]
        rows = None
        title = ""
        unit = ""
        chart_kind = "bar"
        if kind == "workspace":
            rows = [
                (x["name"], round(100 * x["done"] / x["total"])) for x in d["projects"]
            ]
            title = "Progress across the portfolio"
            unit = "percent complete"
        elif kind == "board":
            rows = [("D" + str(i + 1), v) for i, v in enumerate(d["burndown"])]
            title = "Reference burn-down path"
            unit = "remaining points"
            chart_kind = "line"
        elif kind == "settings":
            rows = [
                (day, v)
                for day, v in zip(
                    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    d["notificationVolumes"],
                )
            ]
            title = "A quieter notification rhythm"
            unit = "sample notifications"
            chart_kind = "line"
        elif kind == "revenue":
            rows = [(x["month"], x["gross"] - x["refunds"]) for x in d["months"]]
            title = "The year in net revenue"
            unit = "USD"
            chart_kind = "line"
        elif kind == "operations":
            rows = [(str(8 + i) + ":00", v) for i, v in enumerate(d["arrivals"])]
            title = "Arrivals across the shift"
            unit = "tickets"
            chart_kind = "line"
        elif kind == "business":
            rows = [("Kickoff", 4800), ("Review", 4800), ("Handover", 2400)]
            title = "A fee tied to delivery"
            unit = "USD"
        if rows:
            d["showcaseChart"] = {
                "asset": d["id"],
                "title": title,
                "rows": rows,
                "unit": unit,
            }
            jobs.append((d["id"], title, rows, chart_kind, unit, d))
    with tempfile.TemporaryDirectory() as scratch:
        scratch = Path(scratch)
        for ident, title, rows, kind, unit, d in jobs:
            cfg = {
                "type": kind,
                "title": title,
                "description": "Synthetic worked example. Exact values accompany the graphic.",
                "source": "Original Dazzler synthetic scenario",
                "data": [{"x": x, "y": y} for x, y in rows],
                "colors": [d["accent"] if d["id"] != "presentation" else "#393783"],
                "width": 720,
                "height": 200,
                "font": "Arial",
                "unit": unit,
            }
            if d.get("architecture"):
                cfg["xLabel"] = (
                    "Reporting week"
                    if d["id"] == "professional"
                    else "Delivery milestone"
                )
                cfg["yLabel"] = "Accepted" if d["id"] == "professional" else "Payment"
            file = scratch / (ident + ".json")
            file.write_text(json.dumps(cfg), encoding="utf-8")
            dest = scratch / ident
            subprocess.run(
                [
                    "node",
                    str(ROOT / "skills/dazzler-frontend/scripts/visualize.mjs"),
                    "--config",
                    str(file),
                    "--out",
                    str(dest),
                ],
                check=True,
                capture_output=True,
            )
            shutil.copy2(dest / "chart.svg", out / "charts" / f"{ident}.svg")
            shutil.copy2(dest / "chart.json", out / "charts" / f"{ident}.json")
        # Native image regions are a real portable Dazzler export, not a mock interaction.
        d = next(x for x in uis if x["layout"] == "reservations")
        art = scratch / "room.svg"
        art.write_text(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360"><rect width="720" height="360" fill="#F9F2FD"/><rect x="25" y="25" width="250" height="130" rx="16" fill="#D6D2F0"/><rect x="445" y="25" width="250" height="130" rx="16" fill="#BEE0D4"/><rect x="180" y="205" width="360" height="130" rx="50" fill="#EBCB89"/><text x="60" y="95" font-size="22" font-family="Arial" fill="#262039">WINDOW TABLES</text><text x="490" y="95" font-size="22" font-family="Arial" fill="#262039">QUIET CORNER</text><text x="270" y="278" font-size="22" font-family="Arial" fill="#262039">SHARED TABLE</text></svg>',
            encoding="utf-8",
        )
        regions = [
            dict(r, shape="rect", coords=c)
            for r, c in zip(
                d["rooms"],
                [[25, 25, 275, 155], [445, 25, 695, 155], [180, 205, 540, 335]],
            )
        ]
        cfg = {
            "kind": "image",
            "framework": "native",
            "title": "Find your kind of evening",
            "imageAlt": "Illustrative room with window tables, a quiet corner and a shared table.",
            "width": 720,
            "height": 360,
            "regions": regions,
            "color": d["accent"],
            "source": "Fictional dining room. Selecting a region expresses no reservation or availability.",
        }
        file = scratch / "room.json"
        file.write_text(json.dumps(cfg), encoding="utf-8")
        dest = scratch / "seating"
        subprocess.run(
            [
                "node",
                str(ROOT / "skills/dazzler-frontend/scripts/hotspots.mjs"),
                "--config",
                str(file),
                "--art",
                str(art),
                "--out",
                str(dest),
            ],
            check=True,
            capture_output=True,
        )
        seating = out / "ui" / d["id"] / "seating"
        if seating.exists():
            for old in seating.rglob("*"):
                if old.is_file() and not (dest / old.relative_to(seating)).exists():
                    old.unlink()
        shutil.copytree(dest, seating, dirs_exist_ok=True)
    subprocess.run(
        ["node", str(ROOT / "tools/render_template_charts.cjs"), str(out / "charts")],
        check=True,
    )


def ui_feature(d):
    e = lambda x: html.escape(str(x), quote=True)
    k = d["layout"]
    if "showcaseChart" in d:
        c = d["showcaseChart"]
        copy = {
            "workspace": "Accepted work is visible, and the unfinished work has an owner. Percentages use each project’s own task count.",
            "board": "A reference path for the sprint, not a claim of achieved work. Use the live board above to move the current tasks.",
            "settings": "Seven synthetic daily counts show why a digest can reduce interruptions. Preference changes stay in this preview.",
            "revenue": "A full-year view complements the period selector. Gross minus refunds reconciles to net for every month.",
            "operations": "The arrival profile gives context to the queue snapshot. It is historical sample data, not a live forecast.",
            "business": "Three milestones add to the $12,000 sample engagement. Approval and revision actions are local demonstrations.",
        }[k]
        return (
            '<section class="showcase-panel"><div><p class="eyebrow">THE BIGGER PICTURE</p><h2>'
            + e(c["title"])
            + "</h2><p>"
            + e(copy)
            + '</p></div><figure><img src="../../charts/'
            + c["asset"]
            + '.svg" alt="'
            + e(c["title"])
            + '"><details><summary>Read exact values</summary><table><tbody>'
            + "".join(
                "<tr><th>"
                + e(a)
                + "</th><td>"
                + e(v)
                + " "
                + e(c["unit"])
                + "</td></tr>"
                for a, v in c["rows"]
            )
            + "</tbody></table></details></figure></section>"
        )
    if k == "reservations":
        return '<section class="room-guide"><h2>A place that suits your evening</h2><p>Explore the room before making a request. Seating preferences are illustrative and never confirm availability.</p><iframe src="seating/index.html" title="Interactive seating preferences" loading="lazy"></iframe><img class="print-plan" src="seating/illustration.svg" alt="Sample dining room plan"><p class="print-plan">Window tables: bright and social. Quiet corner: away from the bar. Shared table: group conversation. Confirm access and availability directly.</p></section>'
    if k == "dining":
        return (
            '<section class="producer-story"><p class="eyebrow">A FICTIONAL SEASONAL JOURNAL</p><h2>Good ingredients.<br><em>Thoughtfully put together.</em></h2><div class="producer-grid">'
            + "".join(
                "<article><strong>"
                + e(x["ingredient"])
                + "</strong><p>"
                + e(x["name"])
                + " · "
                + str(x["distanceKm"])
                + " km in this imagined supply map</p></article>"
                for x in d["producers"]
            )
            + "</div><p>These producer relationships are invented for the design example, not sourcing claims about a real restaurant.</p></section>"
        )
    if k == "cafe":
        return (
            '<section class="morning-note"><div><p class="eyebrow">BAKED FOR THE MORNING</p><h2>Small rituals.<br><em>A brighter day.</em></h2><p>84 pastries in today’s fictional bake. Choose a coffee, a warm bite and a pickup preview. The bag calculates from your selected quantities.</p></div>'
            + cup_art()
            + "</section>"
        )
    return '<section class="market-note"><p class="eyebrow">A MENU THAT MAKES ROOM</p><h2>Find a new favorite.</h2><p>Filter by course, search an ingredient or explore vegan recipes. Labels describe the example recipe; speak with the team about allergies and cross-contact.</p><strong>Summer 2027 / 14 dishes and drinks / Freshly imagined</strong></section>'


def cup_art():
    return '<svg viewBox="0 0 420 280" role="img" aria-label="Original illustration of a coffee cup and a pastry"><rect width="420" height="280" rx="140" fill="#F5C735"/><ellipse cx="185" cy="230" rx="100" ry="15" fill="#AA4B2933"/><path d="M95 85h150l-15 128H115z" fill="#FFF9EC"/><ellipse cx="170" cy="85" rx="75" ry="22" fill="#753819"/><ellipse cx="170" cy="85" rx="48" ry="14" fill="#DDA977"/><path d="M246 114q70-8 55 55q-10 28-62 9" fill="none" stroke="#FFF9EC" stroke-width="18"/><path d="M160 48q-22-18 0-34M191 49q-22-18 0-34" fill="none" stroke="#753819" stroke-width="4"/><path d="M280 226q25-90 94-41l-15 54z" fill="#B95522"/><path d="M303 205l18 25M326 192l18 34M351 193l4 24" stroke="#F0B256" stroke-width="8"/></svg>'
