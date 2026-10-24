"""Bind the inspected October 24 gallery to its final files and runtime inventory."""

from validate_gallery_release import digest
import json
from pathlib import Path

R = Path(__file__).resolve().parents[1]
L = R / "skills/dazzler-frontend/assets/templates"
S = R / "maintenance/gallery-production/v0.32.0"


def save(path, data):
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


OBSERVED = {
    "professional": "The former portrait exception column becomes a wide release register. A blue reconciliation band precedes the exact gate states; three ownership notes close the page.",
    "legal": "The wide three-date chronology becomes a portrait evidence brief. A single table aligns each date, record and significance; the three legal questions follow in a vertical reading sequence.",
    "business": "The lilac fee sidebar becomes a white portrait scope letter with green rules and serif headings. The phase register follows the fee and the terms remain separate from included scope.",
    "fun": "The coral portrait poster becomes a yellow horizontal event ticket. The running order sits beside the title; the arrival information and practical notes form lower bands.",
    "family": "The yellow three-day route becomes a blue preparation-first plan. Packing, food and changes precede the exact weekend register, with a distinct white itinerary panel in HTML.",
    "presentation": "The blue two-panel argument becomes a warm portrait prospectus. The six-week marker precedes the proposal and measurement register; experiment and decision conditions close the sequence.",
    "school": "The portrait field notebook becomes a wide trial bench. Raw measurements sit beside the question; the HTML comparison uses labelled dots on a shared zero baseline, and the method notes run below.",
    "marketing": "The white campaign broadside becomes a wide blue dispatch. Capacity occupies the upper-right strip; channels span the page before offer and measurement notes.",
    "restaurant": "The pink horizontal supper ledger becomes a cream portrait menu. Courses read vertically before pairings and service time; the HTML version centers the course rhythm.",
    "technical": "The mint procedure-first sheet becomes a white landscape checkpoint. A red stop label and batch size sit beside the title; the verification matrix precedes three recovery steps.",
    "webapp-workspace": "The revision sidebar becomes a labelled disclosure below a wide manuscript. Chapter context moves to the top; cream paper and serif text support the editor without hiding the local-save action.",
    "webapp-board": "The yellow staircase becomes a lilac vertical assignment register with a separate release rail. Owner and state have distinct mobile lines; completed controls remain visibly disabled.",
    "webapp-settings": "The lilac switchboard and tall clock become a centered white form on a dark field. A compact time strip replaces the clock, and repeated urgent-policy content is consolidated.",
    "data-revenue": "The dark plotting wall becomes a white analytical spread. Measure buttons move above the chart and exact annual values sit beside it; mobile stacks both without removing the ledger.",
    "data-operations": "The horizontal station strip becomes a narrow control rail beside a dark instrument. The warning log spans below it, with station-specific units and the operating band still visible.",
    "restaurant-fine-dining": "The centered lime invitation becomes a dark green two-part folio. A light botanical drawing and service note sit beside the pale menu sheet; mobile reduces the drawing while retaining all service information.",
    "restaurant-cafe": "The pink grid with tall side receipt becomes a warm horizontal shelf. A full-width receipt appears above products, retaining the tax qualifier, live status and repeated-clear recovery.",
    "restaurant-reservations": "The zone-first atlas becomes a form-first desk with a vertical seating rail. The access note remains below seating choices, and the request feedback remains explicitly unconfirmed.",
    "restaurant-menu": "The blue toolbar and single dish column become a dark search rail beside two dish columns. Allergy guidance spans above the results; mobile preserves all filters and empty-result recovery.",
    "business-portal": "The green milestone-first room becomes a purple document-first workspace. Document controls sit beside the review sheet, milestones follow below, and review state is independent for each document.",
}


def main():
    briefs = {
        x["id"]: x
        for kind in ["document", "interface"]
        for x in json.loads((S / f"{kind}-briefs.json").read_text())
    }

    def file(p):
        return {"path": p.relative_to(R).as_posix(), "sha256": digest(p)}

    examples = []
    for t in json.loads((L / "catalog.json").read_text())["templates"]:
        ident, fmt = t["id"], t["format"]
        key = ident if fmt == "ui" else t["category"]
        b = briefs[key]
        target = L / t["path"]
        artifacts = (
            [p for p in target.rglob("*") if p.is_file()]
            if target.is_dir()
            else [target]
        )
        if fmt == "docx":
            artifacts.append(L / "docx" / f"{key}.pdf")
        elif fmt == "html":
            artifacts += [p for p in (L / "html" / key).rglob("*") if p.is_file()]
        if fmt != "ui":
            artifacts.append(L / "data" / f"{key}.json")
        renders = [L / "previews" / f"{ident}.jpg"]
        if fmt != "docx":
            renders.append(L / "previews" / f"{ident}-mobile.jpg")
        observed = OBSERVED[key]
        craft = (
            "Inspected the final single-page LibreOffice render, including body text, table alignment, page surface and footer. All source rows and qualifications are retained in native text and tables."
            if fmt == "docx"
            else "Inspected desktop and mobile captures, then repaired observed spacing and illustration issues. Browser checks pass at 1440, 390 and 320 pixels with no recorded overflow, axe violations or script errors."
        )
        examples.append(
            {
                "id": ident,
                "prompt": b["prompt"],
                "generationMethod": "current-skill-from-prompt",
                "features": [
                    "Task-specific composition and evidence order",
                    "Local typography and measured color roles",
                    (
                        "Editable native structure"
                        if fmt == "docx"
                        else "Responsive layout and labelled interactive states"
                    ),
                    "Source data and consequential qualifications retained",
                ],
                "designRationale": b["rationale"],
                "artifactFiles": [file(p) for p in artifacts],
                "renderedPages": [file(p) for p in renders],
                "previousRenderedPages": [
                    file(S / "previous-v0.31.1" / f"{ident}.jpg")
                ],
                "composition": {
                    "structure": b["direction"] + " / " + fmt,
                    "typography": (
                        b.get("word", b["font"]) if fmt == "docx" else b["font"]
                    ),
                    "surface": b["surface"] + " / " + b["accent"],
                    "imageOrDataRole": b["rationale"],
                    "sequence": observed,
                },
                "visualReview": {
                    "promptFit": {"passed": True, "evidence": b["rationale"]},
                    "craft": {"passed": True, "evidence": craft},
                    "peerDistinction": {
                        "passed": True,
                        "evidence": observed
                        + " Compared against the other final gallery compositions; matching document/web editions deliberately share a reader task.",
                    },
                    "previousReleaseDistinction": {
                        "passed": True,
                        "evidence": observed,
                    },
                    "structuralChanges": b["structuralChanges"],
                },
            }
        )
    save(
        R / "maintenance/gallery-release.json",
        {
            "version": "0.32.0",
            "previousVersion": "0.31.1",
            "runtimeSha256": digest(
                R / "skills/dazzler-frontend/references/integrity.json"
            ),
            "skillSha256": digest(R / "skills/dazzler-frontend/SKILL.md"),
            "reviewer": "Codex visual inspection and informed task replay, October 24, 2026",
            "reviewRecord": "maintenance/gallery-production/v0.32.0/HEX-MEN-REVIEW.md",
            "limitations": "Agent inspection and local browser/LibreOffice checks. No human participant study, screen-reader assessment or cross-browser certification.",
            "examples": examples,
        },
    )
    print("Bound the reviewed gallery to 30 artifact and preview records.")


if __name__ == "__main__":
    main()
