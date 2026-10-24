# Compose for the Reader's Task

Use for new designs and substantial restyles. The agent interprets the brief automatically; this is not a questionnaire. Explicit requirements, accepted structure, brand, accessibility and source fidelity precede suggestions. For small changes preserve the surrounding composition.

## Make Decisions Together

Name the reader, primary activity, decisive content and intended voice in the existing design record. Choose an organizing relationship that makes that activity easier: compare aligned alternatives, browse groups then focus, follow a narrative, manipulate a working object, or decide from evidence. These are examples, not an exhaustive vocabulary. Mixed artifacts can use different relationships by section while sharing typography, color roles and navigation.

Develop type, space, surface and imagery as one composition. A narrow evidence column needs compatible font metrics and shorter labels; a spacious narrative needs enough substantive content to earn its pauses. A dense workspace can contain a generous explanation region. Choose surface coverage from emphasis, reading duration, brand and output medium—not industry stereotypes, recipe order or a requirement to look colorful. Use the existing density, typography, color and recipe tools; this guidance adds no theme engine.

Where useful, pass interpreted context to `workflow.mjs plan`:

```json
{"kind":"interface","composition":{"medium":"application","activity":"operate","content":["text","data","steps"],"requirements":["Preserve the approved navy brand and existing navigation"]}}
```

Supported media: `website`, `application`, `document`, `slides`. Activities: `discover`, `compare`, `decide`, `operate`, `understand`, `read`. Content: `text`, `data`, `images`, `steps`. The planner returns two unranked organizing relationships with format-specific craft and material guidance. It does not parse requirement strings or certify compatibility: the agent must reject conflicts. Missing context stays `needs-interpretation`; do not guess from a keyword. `existingSystem: true`, small scope and read-only audits suppress new alternatives. Requirements are retained verbatim. Use direct design reasoning when these categories do not express the task.

## Craft by Medium

| Medium | Decisions that should reach the output | Check beyond the opener |
| --- | --- | --- |
| Website | Arrival promise, content-led section changes, useful navigation, images with a real explanatory role | Exploration to action on mobile; a long section must earn its space |
| Application | Working object, task frequency, persistent context, reversible actions, operational states | Dense real data, keyboard use, empty/error states; avoid marketing-style heroes over routine work |
| Document | Reading sequence, native paragraph/run styles, aligned comparisons, page furniture and intentional pagination | Densest interior, continuation tables, longer edits and print; avoid an impressive cover with generic body pages |
| Slides | A communicative job per slide, argument sequence, statement/evidence/explanation rhythm, presentation versus leave-behind needs | A middle sequence and dense evidence slide at viewing distance; avoid repeated title-plus-three-cards and unsupported giant claims |

Use the existing web/document direction helpers for exploratory variation, not as ranked answers. For slides, compose the narrative before selecting slide arrangements; native editable content and legible evidence take priority over visual tricks. No new library of fixed layouts is required.

## Edit the Composition

Use the two bounded slices in [visual decisions](visual-decisions.md) where applicable. Change information sequence, grouping or spatial relationships between them; keep facts and constraints constant. A palette swap is not another structure. Choose the stronger task fit, not whichever has more decoration or greater parameter distance.

Before final review, remove elements that do not communicate, orient, distinguish or support action. Merge repeated cards only when their grouping is redundant; preserve cards when they represent independently actionable objects. Replace accidental empty space with useful relationships, while keeping whitespace that separates ideas or supports reading. Cut repeated headings and redundant labels without deleting required information. Refine numerals, alignment, line endings and rhythm before adding more effects.

Inspect whether the defining idea survives real content, narrow layouts, long labels, dense interiors and native export. Keep ordinary regions as carefully composed as the opener. Record the selected relationship, consequential adaptations and visible reasons in the existing record, never as application copy. Functional tests and structural variety do not establish aesthetic superiority.
