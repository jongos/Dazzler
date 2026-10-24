# Render, Review and Refine

Use [visual decisions](visual-decisions.md) to identify the primary task, inspect its actual placement and reuse the host review entry point. The optional `render-focus.mjs` helper measures an existing Playwright page; it does not select density or certify usability.

Use this loop for the affected scope, preserving Dazzler's design rules and the user's constraints. It does not require multiple agents, new tools or a separate report for small edits.

1. **Establish context.** Read the existing design record, tokens and affected components. Inspect actual variants, font assets and the installed framework version before using its APIs. Consult relevant local documentation first; do not install another component library to imitate a reference.
2. **Interpret references.** If supplied, inspect screenshots for useful relationships: hierarchy, grouping, rhythm, content order and interaction cues. State what fits this brief and what does not. A screenshot is neither a brand lock nor evidence of behavior, accessibility or permission to copy assets. Keep proposed choices separate from user-approved decisions.
3. **Build a focused slice.** Use representative content and real font loading. Establish the main reading or interaction task before polishing repeated components. Preserve working structure; a review finding does not authorize a broader redesign.
4. **Inspect the render.** For responsive UI, review desktop and mobile at representative widths AND heights, plus affected states and neighbors. For native documents/slides, inspect every final page/slide at reading size. Check hierarchy, content order, font fallback, actual contrast, clipping and space use. Judge whether space serves the task or unnecessarily displaces it; neither compactness nor spaciousness is the goal by default. Exercise controls separately from screenshot review.
5. **Repair and recheck.** Record the observed problem, make the smallest coherent repair, render again and inspect affected views and shared-component consumers. A changed font, token or layout can invalidate earlier evidence. Use the final saved revision for the delivery review; do not reuse an older screenshot as proof of a fix. Stop when scoped findings are resolved and relevant checks have run. If a blocker, unavailable runtime or scope boundary prevents this, disclose the remaining coverage instead of claiming completion or endlessly restyling.
6. **Retain useful decisions.** Update the existing project record with accepted direction, reasons, canonical implementation links and remaining uncertainty. Keep proposals, implemented choices and user approvals distinct. These are project-specific decisions, not new global defaults. Keep private references and review metadata out of visible application copy and external services.

Deterministic checks support this loop; they do not judge the whole composition. Text-only classifiers can assess textual constraints but cannot inspect screenshots. Visual judgments remain reported observations, not proof of aesthetic quality.

For substantial new work, [execution review](execution-review.md) separates craft judgments from functional checks and optionally binds the final evidence bundle to file hashes. Rebuild contact sheets after corrections; old summaries are not final evidence.

## Reported Render Evidence

When using `workflow.mjs assess`, a passing `render` observation requires `renderReview`:

- `revision`: exactly the assessment's saved revision identifier.
- `views`: 1–64 uniquely named views, each with `name`, `environment` (renderer, viewport/page, zoom and relevant state), `evidence` (actual capture reference), and `detail` (what was inspected and observed).
- `findings`: up to 64 items with `issue` and `status` (`open` or `resolved`). Resolved findings also require `resolution` and `recheckEvidence` from the assessed revision. Use an empty array when no problems were observed; do not invent a repair.

Keep the observation's usual `evidence` and `detail` fields. Open findings cannot accompany a pass. Old pass records without `renderReview` must be reviewed and supplemented, or marked `not-run`; missing fields must not be auto-filled as evidence. The validator checks report structure and revision equality, not file contents, capture freshness or honesty. Review the actual evidence. This is not an automated browser runner or release approval.

## Notes

Workflow synthesis informed by the [shared UI-agent overview](https://share.google/aimode/Muhu6HSjU1q31Hvpd). No external implementation was imported; existing Dazzler rules remain authoritative.
