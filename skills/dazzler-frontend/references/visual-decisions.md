# Make Visual Decisions From Rendered Evidence

For new substantial designs, develop two inexpensive structural slices before completing the artifact. Use the same facts, brand locks, representative content and font sizes. Change information order, spatial organization or representation—not merely hue, border radius or headings. A slice is the primary screen plus its densest region, or an opener and interior page/slide. Keep these in the project's scratch area; they are not a second deliverable or a reason to ask the user to choose.

Inspect both at the actual reading size. Choose on task access, hierarchy, content accuracy, expressive fit and editing resilience. Record a brief reason and the capture references in the existing design record. Keep ties honest; choose the simpler viable implementation when neither is stronger. Do not create alternatives for small fixes, a supplied approved composition, or constraints that already settle the structure. Do not repeat candidate rounds indefinitely. Existing Dazzler rules and explicit requirements remain authoritative.

## Primary Task Placement

Before rendering, name what must be understood or acted on first and why. Decide whether each target belongs in the initial viewport/page or can follow supporting context. A chart for analysis and an assignment action usually deserve early access; sustained reading or a deliberate exhibition opening may justify more space. This is an inferred task decision, not a universal fold quota. Preserve touch targets, readable type and explicit density preferences.

The existing `browser.cjs inspect INPUT NEW_DIRECTORY CONFIG.json` entry point accepts optional `height`, `revision` and `primaryTargets`. Targets use the fields below; existing `widths` still applies. It emits viewport captures and primary-task observations alongside its normal checks. No extra review wrapper is required.

Reuse the host's existing Playwright page when available:

```js
import { captureFocus } from '/installed/skill/scripts/render-focus.mjs';
const observation = await captureFocus(page, {
  revision: 'saved-revision-id', screenshot: 'review/desktop.png',
  targets: [{id:'primary', selector:'#primary-action', placement:'initial', reason:'Complete the repeated dispatch task'}]
});
```

Resolve the module relative to the installed skill; the path above is illustrative. Set the viewport width AND height first and reproduce the intended state. The helper does not navigate, install dependencies or choose a browser. Use it only on authored/authorized output, not to execute imported evidence. Ambiguous/missing selectors return unknown instead of a false pass. A reachable target still needs keyboard/touch journey testing. Inspect screenshots for overlays, clipping, crowding and visual priority; geometry cannot establish those.

For documents, make the same decision by page role: where are the recommendation, comparison, schedule and action? Inspect every rendered page and a longer-content copy. Reduce avoidable introduction or change arrangement before shrinking text. For slides, judge at presentation size, not only a contact sheet.

## One Review Entry Point Per Artifact

Reuse the project's existing browser/Office test entry point. Add primary-placement observations to it rather than rebuilding a second review stack. Run font loading, overflow, rendered contrast and relevant interactions together; retain actual failures and unknown coverage. A GDC adapter is optional when it repeats a measurement already made reliably by the host. Do not spend design time repairing a redundant adapter merely to obtain a second badge. Keep numerical results and visual judgments distinct.

After a layout or font change, rerender the affected views. Retain the final revision, primary-task rationale, observed defect, correction and recheck capture. No universal beauty score or required color treatment follows from this workflow.
