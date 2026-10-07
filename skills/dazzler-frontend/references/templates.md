# Template library

These files demonstrate possible outputs of the skill. Do not automatically select one as the structure or appearance for a new task. Start with the user's prompt and generate its own design system, including a deliberate page background. Inspect examples to understand capabilities, not to inherit their look. Export an example only when the user explicitly selects it or asks to work from that file. Preserve verified facts and supplied brand constraints.

The 0.27 collection was authored from fresh fictional briefs. Its saved previews are evidence for these specific artifacts, not for later edits.

The machine-readable inventory is [catalog.json](../assets/templates/catalog.json). It contains 30 entries, file hashes, category, format, purpose and font information.

## Documents: 10 DOCX and 10 matching HTML files

| Category | Starting point |
|---|---|
| Professional | Executive launch decision |
| Legal | Evidence-review memorandum with chronology and unresolved questions |
| Business | Proposal with scope, deliverables and timing |
| Fun | Neighborhood night-market program |
| Family | Three-day family planner |
| Presentation | Landscape pilot presentation handout |
| School | Soil-drainage observation notebook |
| Marketing | Campaign creative brief |
| Restaurant | Seasonal dining menu |
| Technical | Queue recovery runbook |

IDs follow `docx-professional` and `html-professional`, replacing the category as needed. DOCX files use editable Word styles and native tables. Desktop fonts are context-specific Arial, Georgia or Consolas, referenced rather than embedded; inspect substitution in the target application. HTML files select from seven bundled families, including display, serif, sans and monospace faces with available genuine italic companions with local font notices, responsive layouts and print rules. The legal layout supplies no legal clauses or jurisdiction-specific advice. The presentation document is a Word handout, not a PPTX deck.

## UI: 10 folders

Each folder contains `index.html`, `styles.css`, and `template.json`.

| ID | Purpose and local interaction |
|---|---|
| webapp-workspace | Manuscript editor, live word count and local draft save |
| webapp-board | Production assignment ledger with forward-stage actions |
| webapp-settings | Digest-time clock and channel preferences |
| data-revenue | Annual revenue/member chart, metric selection and exact values |
| data-operations | Process stations, reading inspector and attention queue |
| restaurant-fine-dining | Tasting-room invitation with course reveal |
| restaurant-cafe | Menu filters and an order preview |
| restaurant-reservations | Reservation request form and local summary |
| restaurant-menu | Searchable lunch index and vegetarian filter |
| business-portal | Dated project ledger, document preview and reversible local review |

No template submits data, accepts payments or makes bookings. The manuscript Save action stores its draft locally in the browser; other demo actions reset on reload. Labels disclose demo behavior. Connect authorized services only when the project calls for them. Example restaurant names, people, prices and figures are fictional. Keep the JSON and the embedded `template-data` block synchronized when changing interactive sample data; edit HTML/CSS for displayed content and layout. JSON is a design/data specification, not a live configuration server. No npm build or network font service is required.

## Export an Explicitly Selected Example

```shell
python scripts/templates.py list --format ui --category restaurant
python scripts/templates.py export restaurant-cafe --out NEW_PROJECT_DIR
python scripts/templates.py export docx-business --out NEW_PROJECT_DIR
```

The helper verifies hashes, refuses overwrites and copies the required fonts, licenses, scenario data, charts and interaction assets with relative paths intact. Open the returned entrypoint. Do not copy HTML alone and lose its font folder. A DOCX export has no bundled font dependency. Reusing the templates does not require the authoring dependency `python-docx`.

For final documents, follow the host's document workflow and render the customized result. For UI, test the actual content at narrow/wide widths, keyboard focus and primary actions. Defaults are not evidence of accessibility for later changes.

## The Current Collection

Thirty independently authored examples cover ten Word documents, ten HTML documents and ten interfaces. The Word collection has ten complete pages, including three landscape layouts. A launch decision, evidence chronology, fee-led proposal, event program, weekend planner, pilot handout, science notebook, campaign, supper menu and recovery runbook each use a composition suited to the reader's task.

The interfaces include a manuscript editor, production ledger, digest settings, six-year membership chart, station inspector, tasting menu, coffee ticket, table planner, lunch index and client review ledger. Actions are local demonstrations. The manuscript save action uses browser storage; no interface sends data to a service.

Open `assets/templates/index.html` to compare complete browser captures and LibreOffice-rendered Word pages. Word text and tables remain editable. The PDF and screenshots record the reviewed layout; other renderers, font substitutions and later edits can change it. Inspect every customized page before delivery.

Structured JSON retains synthetic source content and figures. Keep it synchronized with displayed content and embedded interface data. Replace fictional names, dates, prices and claims with verified project facts. Use charts and interactions only when they serve the task; examples are not mandatory palettes or layouts.

## Theme one file

HTML and UI source is formatted for direct editing. Each example has a separate `tokens.css` and a semantic `tokens.json` contract. Edit that stylesheet for precise brand choices, or run `node scripts/studio.mjs tokens --config BRAND_JSON --template TEMPLATE_TOKENS_JSON --out NEW_DIRECTORY` and replace only the example’s `tokens.css` with the generated one. Recheck rendered contrast and hierarchy after retheming; locked colors may conflict. Re-export chart figures and artwork separately when their colors must change.

## Notes and credits

Original template layouts, synthetic scenarios and demo code: Jon Gosier, Apache-2.0. Fonts retain their separate notices. Collection authoring: `tools/gallery_027.py` and `tools/gallery_027_ui.py`; publication source: `tools/publish_template_gallery.py`. Generation is a maintenance operation, not a user setup step.
