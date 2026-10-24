# Carry the Design Idea Through Execution

For substantial new work, use this with the existing composition and rendered-review workflow. Preserve brand, facts, accessibility, approved structure and all existing design rules. Small edits do not need a new concept or candidate round.

## Make the Subject Visible

Name the relationship the artifact must explain or enable, then show it in the composition: an itinerary, a handover, an approval tradeoff, a spatial route. These are examples, not required layouts. Record one visible consequence and one tradeoff in the existing design record. If changing names and colors would make the result equally suitable for an unrelated brief, inspect whether the subject needs a more specific representation. Familiar controls and restrained documents can still be the right answer; novelty is not a quota.

Keep author-supplied constraints separate from inferred choices. Do not write a synthetic brief that prescribes the palette, density and layout and then claim to have tested automatic selection.

## Test a Meaningful Slice

Use the existing two-slice step, not another candidate round. Hold source facts and constraints constant. Compare the medium's hard part: a mobile programme with access details, a selected-item working state, a dense native document page, or a native three-slide argument. Do not use a generic HTML opener as evidence of Office pagination or slide rhythm. Inspect at actual reading size and record the concrete tradeoff; default to the simpler viable option when tied.

Choose challenging content that belongs to this task: uneven text lengths, similar names, realistic row counts, an exception or unavailable value. Add synthetic material only in development fixtures, label it, and keep it out of authoritative user facts. Test longer edits in a separate native copy rather than corrupting the deliverable.

## Review Craft Where the Work Happens

- **Websites:** connect visual assets to content; inspect the path from arrival to exploration on narrow screens. An illustration must earn the space it displaces.
- **Applications:** inspect selection and action together, including return to the list, filter changes and error recovery. Recompose narrow states when stacking desktop panels separates the working object from its controls. Preserve readable text and touch targets.
- **Documents:** set column widths from contents, align comparable numbers, distinguish totals and decisions, and review continuation headers and longer edits. Do not add decoration to compensate for weak tables.
- **Slides:** show the relationship the argument depends on; remove redundant labels and chart furniture where safe. Inspect a middle sequence at presentation size, including source-driven chart edits. Keep sketches distinct from measured plans.

Judge **correctness**, **task support**, **craft** and **distinctiveness** separately. For each, record supported / needs-work / not-reviewed, the observed reason and evidence. A functional or accessibility pass does not settle the other judgments. Revise consequential scoped weaknesses once, then recheck; disclose unresolved tradeoffs instead of claiming excellence or iterating without a stopping condition.

## Bind the Review to the Saved Files

Use the existing browser/Office runner to render final artifacts, then regenerate any contact sheets from those same captures. Include source assets affecting the render (CSS, scripts, fonts and data) in the evidence inventory, not only the HTML. Do not seal a pre-existing contact sheet as a fresh render.

Optional offline helper, usable inside that runner:

```js
import { sealBundle, verifyBundle } from './scripts/review-bundle.mjs';
// Resolve the import from the installed skill. Paths below are relative to the project root.
const manifest = sealBundle(root, {
  revision: 'saved-revision', inputs: ['index.html', 'styles.css'], captures: ['review/mobile.png'],
  judgments: {
    idea: 'The content-specific idea', relationship: 'Where it appears', tradeoff: 'What it costs',
    correctness: {status: 'supported', reason: 'Observed facts', evidence: ['index.html']},
    taskSupport: {status: 'supported', reason: 'Observed task behavior', evidence: ['review/mobile.png']},
    craft: {status: 'needs-work', reason: 'Observed weakness', evidence: ['review/mobile.png']},
    distinctiveness: {status: 'not-reviewed', reason: 'No visual inspection yet', evidence: []}
  }
});
// Save manifest only after inspecting fresh renders; verifyBundle(root, manifest) detects subsequent changes.
```

The helper reads local files, validates references and hashes their bytes. It cannot establish that a screenshot depicts those inputs, that the inventory is exhaustive, or that reported judgments are true. A current bundle is not a beauty score, release gate or publication permission. Keep metadata outside visible application copy.
