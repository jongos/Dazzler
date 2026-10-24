# Gallery Review for 0.32.0

The collection contains ten editable Word documents, ten HTML documents and ten interactive examples. The source data is fictional. This review covers the local artifacts and their rendered output.

## Dazzler

The [document briefs](document-briefs.json) and [interface briefs](interface-briefs.json) record the task, competing directions, chosen composition, typography and surface. The 20 directions produce 30 artifacts. Each was authored around its existing reader task; the old gallery supplied data and functional controls, not a layout to recolor. Previous captures are retained in [previous-v0.31.1](previous-v0.31.1).

The legal brief uses a portrait evidence sequence; the event uses a wide ticket; the school example puts measurements beside the question; the restaurant menu uses centered course rhythm; the recovery sheet puts the stop matrix before the procedure. Interfaces use a manuscript desk, assignment register, settings sheet, analytical spread, instrument panel, dining folio, product shelf, request desk, dish catalog and document review workspace.

[Font review](font-and-recipe-review.json) checks the selected web families at weights 400 and 700 against the brief text. Native documents use installed Arial, Georgia or Consolas. [Color review](color-review.json) retains authored page colors and compares role proposals. Its pale-surface flag was reviewed: light reading surfaces are intentional for the reference documents and analytical pages, balanced by the yellow event ticket, dark digest and dining fields, and strong evidence panels. Color alone does not establish distinction; the page structures were compared visually.

## Style Science

[Captured observations and results](style-science.json) use the Style Science HTML adapter and verification engine. Each of 20 web artifacts declares a visible heading and no document overflow at widths 1440, 390 and 320. Accessibility and contrast checks are recorded separately in [browser checks](browser-checks.json). These checks cover declared conditions; visual craft is assessed from the captures.

## Spiral

The review workflow is bounded to this browser preview. Source: `ui/business-portal/index.html`, document-tab handlers and review action. Known: Materials and Schedule are separate documents; the interface sends no approval or message. Assumed scenario: one reviewer switches between documents during a review. Unknown: any production service, delivery recipient or cross-user acknowledgment; none is claimed.

| Event | Reviewer-visible state | Next owner and action | Wait or exit condition |
|---|---|---|---|
| Open Materials | Materials awaits local review | Reviewer reads the displayed version | Review or switch document |
| Mark Materials | Materials marked reviewed in this preview | Reviewer may inspect Schedule | No external recipient or delivery exists |
| Switch to Schedule | Schedule awaits local review | Reviewer reads Schedule separately | Materials review cannot complete this task |
| Return to Materials | Its review mark remains | Reviewer may undo that mark | Undo returns Materials to awaiting review |
| Reload preview | Local review marks reset | Reviewer starts a new preview review | No persisted approval is implied |

The former shared review boolean allowed a mark to carry across a document switch. The revised state is keyed by document. The counterexample is executable in the task replay: review Materials, switch to Schedule, and inspect its status. Given a reviewed document, when another is opened, then the new document must show its own review state. Given an existing mark, undo must affect only that document. Both scenarios passed.

The reservation rehearsal keeps a seating preference separate from a booking. Selecting Quiet Corner changes the request field; the submit action produces a local preview labelled Not confirmed. A missing date blocks that action. No guest or restaurant receives a message. The production board retains each named owner, state and publication condition; moving a local ticket does not publish work.

## Shatterstar

| Proposal | Retained task and entry point | Tradeoff and counterexample | Decision |
|---|---|---|---|
| Remove repeated digest-policy panel | Urgent-message rule remains beside the form and in the lead | Removing every mention would conceal an exception | Remove the duplicate panel; keep the rule |
| Put revision advice in a labelled disclosure | Revision Notes opens with keyboard below the manuscript | An editor may prefer advice visible while writing | Keep the label and full advice; reversible disclosure |
| Replace staircase spacing with assignment rows | Owner, state, Move Forward and completion remain visible | Dense rows can merge labels on mobile | Separate mobile labels and retain disabled completion controls |
| Merge review status across documents | No valid replacement for document-specific state | A reviewed Materials file could appear to approve Schedule | Reject; track each document independently |
| Remove exact data because a chart is present | Exact annual values and raw drainage trials remain | A chart cannot replace exact lookup | Reject; retain both representations |

The user authorized implementation. These changes do not retire APIs or external capabilities. Reverting this commit restores the previous examples; no stored production data is migrated. Passing local task checks supports the retained paths, not a claim of improved human performance. A useful next human check is whether editors find Revision Notes when needed; failure would favor keeping the advice open.

## Mojo

Titles now identify the task: Your Daily Digest, Station Readings, Choose Your Evening and Review the Next Step. Repeated policy and footer explanations were shortened. Decision-relevant language remains beside actions: local saving, subtotal before tax, allergy guidance, unconfirmed requests, unsent approval and uncertain source evidence. Numerical data and the legal document's delivery-versus-acceptance distinction were preserved.

## Longshot

[Ten task journeys](longshot-journeys.json) cover saving and returning to a draft, completion, keyboard actions, alternate metrics, station inspection, disclosures, repeated clear, missing input, empty results and independent review undo. The reviewer authored the changes and knew the source; these are informed task replays, not clean first-encounter tests or human participant results. Tests use rendered controls with DOM assertions. Screen readers and other browser engines were not exercised.

| Finding | Evidence and repair | Retest |
|---|---|---|
| School heading overflow at 320 px | The word Observation exceeded the narrow layout. Reduced the mobile heading size. | Declared overflow check passes at 320 px |
| Cafe status target lost during composition | Adding or clearing still changed the ticket but raised a missing-element error. Restored the live status region. | Repeated add/filter/clear passes without script errors |
| Mobile board labels ran together | Rendered owner and state were adjacent without separation. Put each label on its own line. | Reviewed the revised mobile capture |
| Dining illustration lacked contrast | Dark purple leaves receded into the dark green field. Applied a light botanical color and reduced mobile scale. | Reviewed the revised desktop and mobile captures |
| Review mark crossed document boundaries | One boolean represented both documents. Replaced it with per-document state. | Switching and undo scenarios pass |

Primary paths remain available in all ten interfaces. No observed failure remains in the tested states. Native Word pages were rendered with LibreOffice and checked for page count, text flow, data fidelity and clipping; other Office renderers can repaginate.

## Reproduction

The authoring order is `gallery_032.py`, `prepare_template_sources.mjs`, native rendering, `gallery_032_check.cjs`, `gallery_032_journeys.cjs`, and `gallery_032_assemble.py`. Set `STYLE_SCIENCE_ROOT` to a reviewed local Style Science checkout. Set `PLAYWRIGHT_CHANNEL=chrome` when using an installed Chrome; otherwise use the host's Playwright Chromium. Native rendering uses the host's document renderer and LibreOffice. Inspect all final captures before binding the gallery manifest; the assembler does not certify a visual review.

## Final validation

All ten platform archives passed structure, resource hashes and extracted-helper checks. The template archive passed all 30 artifact/resource inventories. Release metadata and installable permission boundaries passed at 0.32.0; the gallery validator passed all 30 examples. Runtime integrity passed for 1,720 files. Local links passed across 191 Markdown/HTML files. The gallery regression rejects both stale catalog and stale manifest versions. The staged diff passed whitespace checks.

## Notes

Original examples and maintenance tools: Apache-2.0. Font licenses remain in the distributed files. Hex Men sources: [Dazzler](https://github.com/jongos/Dazzler), [Style Science](https://github.com/jongos/style-science), [Longshot](https://github.com/jongos/Longshot), [Spiral](https://github.com/jongos/Spiral), [Shatterstar](https://github.com/jongos/Shatterstar), [Mojo](https://github.com/jongos/Mojo).
