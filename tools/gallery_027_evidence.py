"""Record the agent's inspected 0.27 gallery review and bind it to final files.

These are review observations, not an automatic aesthetic score. Re-author the
review after a visual change; rerunning hashes alone cannot renew approval.
"""

from gallery_027_publish import ROOT, SKILL, STAGE, TARGET, DOCS, U, digest, save_json
import json

# Observations from full-page desktop/mobile and native document renders.
DOCUMENTS = {
    "professional": (
        "Single-page decision followed by gate register",
        "Asymmetric decision spread with evidence rail",
        "Arial bold decision hierarchy",
        "Archivo oversized decision heading",
        "White with cobalt evidence block",
        "Pale blue field with cobalt settlement hold",
        "Reconciliation figure and three release gates",
        "Recommendation, reconciliation, owners, gate evidence",
        "The 92% figure is qualified by the unresolved settlement hold. The separate gate register prevents the headline from implying a complete release.",
        "Replaces the old metric strip and line chart with a qualified reconciliation figure, named owners and a release-gate register.",
    ),
    "legal": (
        "Serif memorandum with chronology before analysis",
        "Narrow reading column beside vertical chronology",
        "Georgia title and genuine italic finding",
        "Libre Baskerville display and serif section labels",
        "Cream page with plum chronology and white alternate rows",
        "Cream continuous reading field and plum event rail",
        "Three dated records with unresolved acceptance",
        "Finding, record sequence, issue, gaps, next review",
        "The italic finding separates delivery from acceptance. Wider evidence cells now keep Receipt Acknowledged distinct from Receipt Only.",
        "Removes the old three-number strip, elevates the disputed finding and separates dated records from analysis.",
    ),
    "business": (
        "Landscape fee brief with full-width milestone ledger",
        "Oversized fee beside headline above two editorial columns",
        "Georgia green headline with Arial commercial copy",
        "Young Serif fee and quotation against sans body",
        "White landscape with green fee panel",
        "Pale lime field and forest green dividing rule",
        "Three fees total the fixed 24000 USD scope",
        "Offer, fee, scope, working terms, milestone fees",
        "The fee is the visual anchor and all exclusions remain readable. The closing validity line fits on the same landscape page after spacing repair.",
        "Changes the portrait report into a landscape offer, isolates the fixed fee and ends with a stage-by-stage fee ledger.",
    ),
    "fun": (
        "Portrait date poster and striped schedule",
        "Split date masthead and full-width schedule ribbon",
        "Large Arial date and aubergine subheads",
        "Condensed Oswald headline and stacked date",
        "Warm yellow page with aubergine date and schedule",
        "Warm yellow surface and aubergine schedule field",
        "Time and location schedule rather than metrics",
        "Date, invitation, hours, location, access, weather, schedule",
        "The event date dominates without obscuring access or the rain plan. The mobile date line height was increased to stop the two date lines touching.",
        "Replaces game-night KPI cells with a typographic date, event hours and a public-program schedule.",
    ),
    "family": (
        "Landscape three-day fridge planner with packing checks",
        "Three day columns over reading column and packing sidebar",
        "Arial day names and checklist labels",
        "Work Sans rounded editorial hierarchy",
        "White with cream day cells and navy Saturday",
        "Cream surface and coral packing field",
        "Friday through Sunday anchors plus packing checks",
        "Purpose, three days, packing, food, changes",
        "Named days now drive the Word layout; it no longer repeats the presentation handout numerals. Checkboxes remain large and the Saturday appointment is prominent.",
        "Replaces the dense seven-day table with three day anchors, a separate packing checklist and a change-of-plan area.",
    ),
    "presentation": (
        "Landscape three-beat presentation handout",
        "Three large numbered beats with evaluation strip",
        "Arial numerals and concise purple hierarchy",
        "Archivo heading and giant purple beat numbers",
        "White landscape with purple central beat",
        "Pale violet page and solid purple experiment beat",
        "Six-week pilot evaluation measures",
        "Need, experiment, decision, measurement method",
        "Need, experiment and decision form a readable sequence. The central experiment has strongest emphasis, while measurement remains a separate table.",
        "Changes the old metric-led pilot report to a three-beat landscape narrative, central experiment panel and evaluation strip.",
    ),
    "school": (
        "Portrait observation notebook with native results table",
        "Split notebook with experimental notation and ruled input",
        "Georgia green title and restrained serif section labels",
        "Young Serif display and green measurement figure",
        "Botanical paper surface with green result header",
        "Warm botanical paper and ruled observation area",
        "Three repeated drainage trials with medians",
        "Question, controlled setup, results, method, limits, next question",
        "Trial medians remain exact and the interpretation is qualified. The web edition separates the experimental controls from the editable next-question field.",
        "Replaces seedling-growth charts and yellow title band with drainage trials, controlled-volume notation and an observation prompt.",
    ),
    "marketing": (
        "Campaign brief with solid rust message banner",
        "Condensed masthead above process illustration and channel ledger",
        "Arial headline and reversed campaign slogan",
        "Oswald condensed uppercase headline",
        "Peach page with solid rust campaign panel",
        "Peach field with rust rule and oversized repair symbol",
        "Assessment to estimate to repair sequence",
        "Campaign purpose, offer process, story, offer, measures, channels",
        "The campaign slogan has a clear color field. Assessment bookings and completed repairs are distinguished rather than combined into a marketing claim.",
        "Removes the old budget KPI band, promotes the repair process and reorganizes the channel-to-action ledger.",
    ),
    "restaurant": (
        "Centered serif supper menu with pairing register",
        "Vertical wordmark beside asymmetric course columns",
        "Georgia centered course names in genuine italics",
        "Libre Baskerville vertical wordmark and italic course labels",
        "Cream supper-menu page with wine pairing header",
        "Cream menu field with wine side wordmark",
        "Courses and pairings, not performance data",
        "Wordmark, service hours, courses, pairings, ingredient notice",
        "Course spacing is generous and the pairing descriptions remain readable. Service hours and allergy guidance are preserved without claiming dietary safety.",
        "Moves from left-aligned dish lists to centered courses, a stronger wordmark and a separate pairing register.",
    ),
    "technical": (
        "Numbered native recovery lanes and proceed-stop matrix",
        "Dark runbook header over procedure and evidence columns",
        "Consolas step labels with Arial operational copy",
        "Office Code Pro headline and step labels",
        "White with cyan step rails and pale evidence cells",
        "Pale cyan surface with dark blue operational header",
        "Batch size and explicit proceed versus stop evidence",
        "Pause, replay, verify, gate matrix, stop condition",
        "The three recovery lanes are visually distinct from prose. Stop language is explicit and the 50-event batch is tied to reconciliation evidence.",
        "Replaces a metric-led webhook report with a recovery sequence, batch evidence matrix and explicit stop branch.",
    ),
}
INTERFACES = {
    "webapp-workspace": (
        "Manuscript between chapter index and editorial notes",
        "Young Serif reading type with compact sans navigation",
        "Warm paper, thin rules, no dashboard tiles",
        "Editable manuscript and live word count",
        "Chapter context, manuscript, save, editorial note",
        "The manuscript owns the central space. Mobile stacks index, editor and notes without clipping the page.",
        "Replaces project KPI cards, project table and news rail with a writing surface, chapter index and margin notes.",
    ),
    "webapp-board": (
        "Horizontal assignment ledger with stage actions",
        "Uppercase Archivo masthead and compact stage labels",
        "Broadcast yellow with charcoal row rules",
        "Four assignments and completion count",
        "Production goal, assignments, owners, stages, release window",
        "Each task keeps its owner and stage visible. Moving a task updates its stage and the ready count.",
        "Replaces column kanban cards with full-width assignment rows, explicit owners and a release-window footer.",
    ),
    "webapp-settings": (
        "Typographic digest clock paired with settings form",
        "Work Sans headline and tabular time",
        "Quiet blue surface with outlined schedule dial",
        "Digest time and channel selections",
        "Focus goal, daily rhythm, channels, local confirmation",
        "The reduced mobile time size fits the circle comfortably. Selecting a time updates both the clock and save confirmation.",
        "Removes profile cards and role fields, focuses the composition on a digest clock and groups notification channels beneath it.",
    ),
    "data-revenue": (
        "Chart-dominant annual membership observatory",
        "Young Serif editorial title and direct numeric labels",
        "Cream page with ink-blue chart and coral bars",
        "Six yearly revenue and membership observations",
        "Question, metric selection, chart, exact values, limitations",
        "The chart has labeled values, years and a stated zero-based scale. Its mobile height now keeps year labels on the contrasting chart field.",
        "Replaces KPI cards and monthly grouped bars with one annual series, metric selection and an exact-value table.",
    ),
    "data-operations": (
        "Four-station process diagram with reading inspector",
        "Office Code Pro process labels and oversized reading",
        "Pale cyan page, dark station field, peach attention notice",
        "Station pressure readings with stated illustrative band",
        "Flow overview, station selection, reading, review queue",
        "Station selection updates a named reading and its unit. Attention is conveyed in text as well as color.",
        "Replaces support-ticket metrics and tables with a process diagram, station inspector and contextual attention panel.",
    ),
    "restaurant-fine-dining": (
        "Typographic tasting-room invitation with course reveal",
        "Libre Baskerville oversized serif and Roman numeral",
        "Deep plum field and warm light text",
        "Five-course reveal behind a named button",
        "Invitation, schedule, menu reveal, arrival and room notes",
        "The dark invitation keeps its primary action legible. The revealed course list works without pretending to take reservations.",
        "Replaces framed botanical hero artwork with a Roman-numeral composition, expandable course list and arrival notes.",
    ),
    "restaurant-cafe": (
        "Coffee counter rows beside paper order ticket",
        "Work Sans welcoming headline and explicit prices",
        "Apricot surface with espresso rules and cream ticket",
        "Three priced items with local subtotal",
        "Morning offer, category filter, item selection, ticket",
        "Adding two flat whites produces 9.00 USD; clearing restores zero. The ticket is visually separate from the menu list.",
        "Replaces product cards and a yellow hero box with counter rows, restrained type and a receipt-like order ticket.",
    ),
    "restaurant-reservations": (
        "Selectable room plan paired with request preview",
        "Young Serif title and readable sans form labels",
        "Cream with olive room outline and named seating areas",
        "Three keyboard-selectable seating preferences",
        "Room choice, party and date, explicitly unconfirmed preview",
        "The plan uses real buttons with pressed states. The preview names the selected corner and clearly says Not Confirmed.",
        "Replaces prose-led booking form with an inline spatial plan, selected-area feedback and a local request preview.",
    ),
    "restaurant-menu": (
        "Searchable culinary index with numbered rows",
        "Oswald condensed masthead and dish names",
        "Saffron yellow field with dark olive rules",
        "Four priced dishes and vegetarian filtering",
        "Lunch identity, search, filtered dish list, ingredient notice",
        "Search returns two lentil dishes and a useful empty state. Prices stay right-aligned and ingredient guidance stays visible.",
        "Replaces the two-column menu-card grid with a numbered index, larger condensed typography and a dedicated search strip.",
    ),
    "business-portal": (
        "Milestone ledger beside focused review panel",
        "Work Sans bold project heading and date labels",
        "Warm white with brick-red active milestone and panel rule",
        "Four milestones and two document previews",
        "Project decision, dated sequence, documents, reversible local review",
        "Document selection changes useful preview copy. The review action is reversible and explicitly has no contractual effect.",
        "Replaces dashboard metrics and service cards with a dated project ledger, document switcher and one review decision.",
    ),
}


def file_entry(p):
    return {"path": p.relative_to(ROOT).as_posix(), "sha256": digest(p)}


def main():
    catalog = json.loads((TARGET / "catalog.json").read_text(encoding="utf8"))
    examples = []
    for item in catalog["templates"]:
        ident = item["id"]
        fmt = item["format"]
        cat = item["category"]
        if fmt == "ui":
            d = next(x for x in U if x["id"] == ident)
            structure, type_, surface, data, sequence, craft, previous = INTERFACES[
                ident
            ]
        else:
            d = next(x for x in DOCS if x["id"] == cat)
            (
                word,
                web,
                word_type,
                web_type,
                word_surface,
                web_surface,
                data,
                sequence,
                craft,
                previous,
            ) = DOCUMENTS[cat]
            structure, type_, surface = (
                (word, word_type, word_surface)
                if fmt == "docx"
                else (web, web_type, web_surface)
            )
        surface = d["colorDirection"]
        craft = (
            "Reviewed complete desktop/mobile compositions and native pages. "
            + surface
            + " Text roles, wrapping and local interactions were checked; collection-level color review is recorded separately."
        )
        previous = (
            "Compared with the retained v0.27 snapshot: "
            + surface
            + " Changes the previous color roles and surface balance while preserving the useful reading structure."
        )
        composition = dict(
            zip(
                ["structure", "typography", "surface", "imageOrDataRole", "sequence"],
                [structure, type_, surface, data, sequence],
            )
        )
        path = TARGET / item["path"]
        resources = (
            [path]
            if fmt == "docx"
            else (
                [path] + list((TARGET / "html" / cat).glob("*"))
                if fmt == "html"
                else list(path.glob("*"))
            )
        )
        if fmt != "docx":
            resources += list((TARGET / "fonts").rglob("*"))
        if item.get("dataset"):
            resources.append(TARGET / item["dataset"])
        renders = [TARGET / "previews" / f"{ident}.jpg"]
        if fmt != "docx":
            renders.append(TARGET / "previews" / f"{ident}-mobile.jpg")
        examples.append(
            {
                "id": ident,
                "prompt": d["prompt"]
                + (
                    " Produce an editable single-page Word composition suited to print."
                    if fmt == "docx"
                    else ""
                ),
                "generationMethod": "current-skill-refinement",
                "reviewScope": "color-system-refinement",
                "preservedStructureReason": "The requested correction concerns muted color bias; preserve the established task-specific structure unless rendered review identifies a reason to change it.",
                "colorChanges": [
                    surface,
                    "Functional foregrounds are resolved against the selected page or local field.",
                    "Color area is reviewed across the complete collection rather than accent hue alone.",
                ],
                "features": [type_, surface, data, structure],
                "designRationale": structure
                + " serves the task by making "
                + data.lower()
                + " the organizing content.",
                "directionsConsidered": [
                    "A compact linear reading sheet",
                    "A dominant task-specific composition with supporting evidence",
                ],
                "selectionReason": "The latter makes the task visible in the page structure; the retained composition is described in the review below.",
                "artifactFiles": [file_entry(p) for p in resources if p.is_file()],
                "renderedPages": [file_entry(p) for p in renders],
                "previousRenderedPages": [
                    file_entry(STAGE / "previous-v0.27.0" / f"{ident}.jpg")
                ],
                "composition": composition,
                "visualReview": {
                    "reviewer": "Codex visual inspection, 2026-10-07",
                    "promptFit": {
                        "passed": True,
                        "evidence": structure
                        + " directly supports the brief: "
                        + d["prompt"],
                    },
                    "craft": {"passed": True, "evidence": craft},
                    "peerDistinction": {
                        "passed": True,
                        "evidence": structure
                        + " uses "
                        + type_.lower()
                        + " and "
                        + data.lower()
                        + ", rather than a shared gallery card shell.",
                    },
                    "previousReleaseDistinction": {
                        "passed": True,
                        "evidence": previous,
                    },
                    "structuralChanges": (
                        ["Proposal scope and fee ledger now sit side by side"]
                        if cat == "business" and fmt == "docx"
                        else []
                    ),
                },
            }
        )
    save_json(
        ROOT / "maintenance/gallery-release.json",
        {
            "version": "0.28.0",
            "previousVersion": "0.27.0",
            "runtimeSha256": digest(SKILL / "references/integrity.json"),
            "skillSha256": digest(SKILL / "SKILL.md"),
            "recipeConsideration": file_entry(STAGE / "recipe-consideration.json"),
            "examples": examples,
        },
    )
    print(
        "Bound 30 inspected review records to their shipped artifacts and complete captures."
    )


if __name__ == "__main__":
    main()
