"""Bind the October 11 visual review to the final 0.30 artifacts and runtime."""

import json
from gallery_030 import R, S, save
from gallery_030_publish import digest

# Observations from inspected native pages and desktop/mobile browser captures.
OBSERVATIONS = {
    "professional": "The blue release-gate map becomes a red-accented dossier: the reconciliation percentage sits beside the decision prose, with the gate register below. Monospaced type separates this operational record from the proposals and menus.",
    "legal": "The pink serif evidence matrix becomes a white, navy sans-serif chronology. Three dates precede three review questions; delivery and acceptance remain explicitly different claims.",
    "business": "The portrait fee waterfall becomes a landscape proposal with fee boundaries at left and the deliverable ledger at right. Included scope and working terms close in two separate columns on lilac.",
    "fun": "The wide timetable becomes a tall coral event poster. Arrival details now precede the large title and program; three practical notes close the sheet without competing with the date.",
    "family": "The packing-first sheet becomes a horizontal three-day route. The itinerary now precedes packing, food and contingency notes; green serif headings and a yellow page distinguish it from the legal chronology.",
    "presentation": "The vertical speaker sequence becomes a wide argument paired with a white experiment panel. The six-week period sits beside the proposal, and the measurement register spans the lower blue page.",
    "school": "The landscape lab bench becomes a portrait field notebook. Exact trial times sit between the method and interpretation, with the controlled volume at the end. Serif headings and ruled web margins replace the monospaced instrument treatment.",
    "marketing": "The wide channel assignment becomes a tall white broadside. A large campaign statement leads, capacity becomes a side annotation, and the channel register precedes two separated offer and measurement notes.",
    "restaurant": "The serif supper card becomes a wide monospaced ledger on pink. Three course columns now align horizontally beneath a service-time header, and pairings close the page instead of sharing the dish flow.",
    "technical": "The horizontal checkpoint strip becomes a portrait control sheet. A stop message leads, three recovery steps run down the left, and the verification table occupies its own right-hand panel. The mobile table scrolls within a focusable region.",
    "webapp-workspace": "The full-width manuscript with a bottom revision desk becomes a narrow revision margin beside the editable page. Chapter context closes the notebook; mobile places the revision prompt above the manuscript and retains local saving.",
    "webapp-board": "The two-column production rack becomes a four-step staircase across the desktop. Deadline and publication checks move below the tickets; mobile stacks them without horizontal page overflow, and completed controls remain disabled.",
    "webapp-settings": "The horizontal daily time band becomes a tall clock beside the form. The urgent-message exception closes beneath both; mobile keeps the form before its result and all labels remain adjacent to controls.",
    "data-revenue": "The side-by-side white chart and ledger become a dark plot with a narrow control rail and an exact-value table below. A yellow page and serif masthead frame the data while each measure retains its zero baseline.",
    "data-operations": "The vertical station selector on a dark field becomes a horizontal station strip on white. A large reading sits beside the warning log; mobile preserves station controls before the reading and its explanation.",
    "restaurant-fine-dining": "The pink seasonal folio becomes a centered green invitation on lime. The botanical mark leads to the title, then the expandable course trail and room note; service time, price qualification and local-only status remain visible.",
    "restaurant-cafe": "The yellow counter's horizontal receipt becomes a pink product grid beside a tall ticket. Mobile lists filters, products and then the receipt; clearing twice keeps a zero subtotal and prices remain qualified as before tax.",
    "restaurant-reservations": "The form-first row becomes an atmosphere atlas beside the request sheet. The access note closes below; mobile presents zones before the form and the selected zone remains a preference rather than a confirmed booking.",
    "restaurant-menu": "The narrow search rail and two-column dish index become a top filter bar, a separate allergy margin and a vertical dish ledger on blue. Empty searches report zero dishes and clearing restores all four.",
    "business-portal": "The large review folio with a bottom milestone ribbon becomes a left milestone spine beside a white review sheet. Document tabs sit across the sheet; mobile places milestones first and retains reversible local review.",
}


def main():
    skill = R / "skills/dazzler-frontend"
    library = skill / "assets/templates"
    briefs = {
        b["id"]: b
        for kind in ("document", "interface")
        for b in json.loads((S / f"{kind}-briefs.json").read_text(encoding="utf-8"))
    }

    def evidence(path):
        return {"path": path.relative_to(R).as_posix(), "sha256": digest(path)}

    examples = []
    for item in json.loads((library / "catalog.json").read_text())["templates"]:
        ident, fmt = item["id"], item["format"]
        key = ident if fmt == "ui" else item["category"]
        brief = briefs[key]
        target = library / item["path"]
        files = (
            [target / f for f in item.get("files", [])] if target.is_dir() else [target]
        )
        if fmt == "html":
            files += sorted((library / "html" / key).rglob("*"))
        renders = [library / "previews" / f"{ident}.jpg"]
        if fmt != "docx":
            renders.append(library / "previews" / f"{ident}-mobile.jpg")
        else:
            files.append(library / "docx" / f"{key}.pdf")
        observation = OBSERVATIONS[key]
        craft = (
            "Inspected the complete single-page LibreOffice render: native text and tables remain readable, the footer fits, and no content is clipped. PDF font names match the selected installed face. Later edits or another host may repaginate."
            if fmt == "docx"
            else "Inspected full-page Chromium captures at 1440 and 390 pixels. Headings, foreground contrast, reading order and control placement remain legible; automated axe, page-overflow and applicable interaction checks passed."
        )
        examples.append(
            {
                "id": ident,
                "prompt": brief["prompt"],
                "generationMethod": "current-skill-from-prompt",
                "features": [
                    "Competing art directions and context-specific composition",
                    "Offline typography selection and explicit color roles",
                    (
                        "Editable native structure and page review"
                        if fmt == "docx"
                        else "Responsive hierarchy and keyboard-accessible controls where applicable"
                    ),
                    "Exact fictional evidence and qualifications retained",
                ],
                "designRationale": brief["rationale"],
                "artifactFiles": [evidence(p) for p in files if p.is_file()],
                "renderedPages": [evidence(p) for p in renders],
                "previousRenderedPages": [
                    evidence(S / "previous-v0.29.0" / f"{ident}.jpg")
                ],
                "composition": {
                    "structure": brief["direction"] + " / " + fmt,
                    "typography": (brief["word"] if fmt == "docx" else brief["font"])
                    + " / "
                    + brief["direction"]
                    + " hierarchy",
                    "surface": brief["surface"],
                    "imageOrDataRole": brief["rationale"],
                    "sequence": observation,
                },
                "visualReview": {
                    "promptFit": {
                        "passed": True,
                        "evidence": brief["rationale"]
                        + " The supplied fictional facts and local-only qualifications remain visible.",
                    },
                    "craft": {"passed": True, "evidence": craft},
                    "peerDistinction": {"passed": True, "evidence": observation},
                    "previousReleaseDistinction": {
                        "passed": True,
                        "evidence": observation,
                    },
                    "structuralChanges": brief["structuralChanges"],
                },
            }
        )
    save(
        R / "maintenance/gallery-release.json",
        {
            "version": "0.30.0",
            "previousVersion": "0.29.0",
            "runtimeSha256": digest(skill / "references/integrity.json"),
            "skillSha256": digest(skill / "SKILL.md"),
            "reviewer": "Codex visual inspection, October 11, 2026",
            "limitations": "Agent review and deterministic checks, not human preference research or a beauty score. No live inference. Native pagination was verified in LibreOffice on the build host only.",
            "examples": examples,
        },
    )


if __name__ == "__main__":
    main()
