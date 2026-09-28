# Template library

Use a template when its structure fits the task. Automatically choose by purpose, content density and interaction needs; preserve the user's existing design system. Adapt the exported copy, replacing illustrative content and bracketed fields with supplied facts. A template is a starting point, not a mandatory aesthetic or a reason to invent facts.

The machine-readable inventory is [catalog.json](../assets/templates/catalog.json). It contains 30 entries, file hashes, category, format, purpose and font information.

## Documents: 10 DOCX and 10 matching HTML files

| Category | Starting point |
|---|---|
| Professional | Project status report |
| Legal | Matter memorandum with questions, facts, analysis and authorities |
| Business | Proposal with scope, deliverables and timing |
| Fun | Game night invitation |
| Family | Weekly planner |
| Presentation | Landscape presentation handout and speaker outline |
| School | Student project report |
| Marketing | Campaign creative brief |
| Restaurant | Seasonal dining menu |
| Technical | Technical design specification |

IDs follow `docx-professional` and `html-professional`, replacing the category as needed. DOCX files use editable Word styles and native tables. Desktop fonts are Arial or Georgia, referenced rather than embedded; inspect substitution in the target application. HTML files use bundled Work Sans and Young Serif with local font notices, responsive layouts and print rules. The legal layout supplies no legal clauses or jurisdiction-specific advice. The presentation document is a Word handout, not a PPTX deck.

## UI: 10 folders

Each folder contains `index.html`, `styles.css`, and `template.json`.

| ID | Purpose and local interaction |
|---|---|
| webapp-workspace | Project overview, search and add-project dialog |
| webapp-board | Task board with add and move actions |
| webapp-settings | Profile, notification and privacy preferences |
| data-revenue | Revenue trend with a data table and CSV download |
| data-operations | Capacity bars with a data table and CSV download |
| restaurant-fine-dining | Editorial seasonal dining site |
| restaurant-cafe | Menu filters and an order preview |
| restaurant-reservations | Reservation request form and local summary |
| restaurant-menu | Categorized menu with filters |
| business-portal | Client projects, search and update-request preview |

No template submits data, accepts payments, makes bookings or persists changes. Labels disclose demo behavior. Connect authorized services only when the project calls for them. Example restaurant names, people, prices and figures are fictional. Keep the JSON and the embedded `template-data` block synchronized when changing interactive sample data; edit HTML/CSS for displayed content and layout. JSON is a design/data specification, not a live configuration server. No npm build or network font service is required.

## Select and export internally

```shell
python scripts/templates.py list --format ui --category restaurant
python scripts/templates.py export restaurant-cafe --out NEW_PROJECT_DIR
python scripts/templates.py export docx-business --out NEW_PROJECT_DIR
```

The helper verifies hashes, refuses overwrites and copies the required fonts/licenses with relative paths intact. Open the returned entrypoint. Do not copy HTML alone and lose its font folder. A DOCX export has no bundled font dependency. Reusing the templates does not require the authoring dependency `python-docx`.

For final documents, follow the host's document workflow and render the customized result. For UI, test the actual content at narrow/wide widths, keyboard focus and primary actions. Defaults are not evidence of accessibility for later changes.

Original template layouts and demo code: Jon Gosier, Apache-2.0. Fonts retain their separate notices. Rebuild source: repository `tools/build_templates.py`; library generation is a maintenance operation, not a user setup step.
