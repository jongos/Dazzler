# Choose Density From the Task

Use [visual decisions](visual-decisions.md) to identify the primary task, inspect its actual placement and reuse the host review entry point. The optional `render-focus.mjs` helper measures an existing Playwright page; it does not select density or certify usability.

Automatically infer activities from the brief, supplied content and existing interface; users need not answer a density questionnaire. Explicit preferences, brand constraints and numeric token choices remain authoritative. Neither compactness nor whitespace is inherently better. Do not infer density solely from profession, industry, a small screen or a word such as professional.

## Provisional Selection

`planDensity` in `scripts/density.mjs` now selects a provisional direction instead of returning null in automatic mode. It does not change CSS. `workflow.mjs plan` includes the plan; pass optional `density` context there or through `route.mjs` under `workflow.density`. The agent supplies interpreted evidence, implements the appropriate relationships, renders, and revises the choice without routine user questions.

Inputs are optional and bounded:

- `preference`: auto, compact, balanced or comfortable. `locked: true` preserves the current constraints even if observations suggest conflict.
- `activities`: scan, compare, batch, read, learn, decide, showcase. Choose only actual tasks, not imagined user traits.
- `contentVolume`: small, moderate or large; `inputMode`: pointer, touch or mixed. Unknown values are omitted rather than guessed.
- `existingSystem`: retain established spacing unless explicit preference or observed problems justify a scoped change.
- Observed `avoidableSpace`, `crowding`, `primaryTaskDisplaced`: booleans from actual review, not claims inferred from token values.
- `regions`: 1–12 uniquely identified regions with the same fields except nested regions. Shared fields are inherited; region evidence can refine them. A shared explicit preference or lock cannot be overridden by a region.

Repeated scanning/comparison/batch work favors bringing related information together. Reading, learning and consequential decisions favor useful separation. Mixed tasks start balanced or use region decisions. Sparse content alone never justifies stretching a page. With no evidence, start balanced for new work or preserve an existing system, then inspect. These are heuristics, not user-research findings.

The output separates information organization, layout, component treatment and reading. It returns current, tighter, balanced, roomier or mixed, with rationale, candidates and not-run review status. No global spacing factor, font reduction, fixed row height or automatic content hiding is applied. Numeric density controls retain their existing explicit behavior.

Example mixed screen:

```json
{"regions":[{"id":"queue","activities":["scan","compare"],"contentVolume":"large","inputMode":"mixed"},{"id":"decision","activities":["read","decide"]}]}
```

Keep the queue's comparisons close while giving the explanation deliberate grouping. Keep usable controls in both. A roomier reading region does not mean a giant title, oversized margins or a narrower page everywhere.

## Render, Repair and Reconsider

Inspect actual space use at representative viewport widths AND heights or printed page sizes. Identify empty wrappers, oversized hero/min-height areas, stacked padding, unnecessarily separate cards and repeated scrolling between related facts. Retain whitespace that supports comprehension, grouping, imagery, writing or interaction. Missing content is not permission to invent filler.

Feed observed waste and crowding back into the planner. Both can coexist: remove wrapper waste while improving local separation. Displaced primary content alone does not prove waste; long documents and genuine content volume may need scrolling. Compare the same content and viewport before/after. Stop when the scoped task is accessible and observed problems are resolved, not when the screen reaches a target fill percentage.

The `density` workflow check requires cases `task` (visibility, comparison and scrolling burden), `space` (waste versus crowding) and `access` (text, controls, reflow/zoom and applicable print behavior). Reference final-revision captures and actual tests. Preserve required content, disclosures, readable type/line spacing, the existing body-measure policy, focus, targets and logical reading order. An exclusion needs a reason; an unavailable check remains not-run. The helper validates reported coverage, not screenshot truth or aesthetic quality.

## Notes and Credits

Dazzler's planner and tests are original Apache-2.0 code. Context questions were informed by [Dembrandt operational guidance](https://github.com/dembrandt/dembrandt-skills/blob/c4ad177dea5b864f779f8c722f28cf04f760cb22/skills/operational-expert-tool-ui/SKILL.md), copyright 2026 Dembrandt, [MIT](dembrandt-LICENSE.txt). Its blanket compactness and fixed size prescriptions are not adopted.
