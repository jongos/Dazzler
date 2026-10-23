# Coordinated Views

Use when two representations of the same entities support different real tasks: table/chart, list/map, or rows/timeline. Do not add a second view for decoration. Infer relevance from the requested interactions; users need not name this pattern. Add `coordinatedViews` to workflow features when implementing or reviewing it.

## Interaction Contract

- Give entities stable IDs. Selection and shared filters have one owner; never synchronize by row position or display label. Keep hover, keyboard focus and committed selection distinct. Both representations consume the same filtered data and category meanings.
- A selection from either view updates the other without stealing keyboard focus. If the corresponding item is offscreen, reveal it when useful without breaking an ongoing scroll or edit. Provide a named clear-selection control and a non-color indicator.
- Decide explicitly what happens when filters, permissions or refresh remove selected entities: clear them or visibly retain an out-of-view selection. Never leave invisible selected records eligible for a bulk action without an explicit scope/count. Distinguish selected visible rows from all matching results.
- Put shared filters above the views; keep pan/zoom and other representation-only controls local. Do not let visual zoom silently filter the table unless that behavior is intentional and communicated.
- At narrow widths, choose stacked views or a view switch from the task and available space. Preserve selection and filters across switches. Keep keyboard-operable access to every action; a chart click must not be the only path.

Use the existing state architecture. Avoid mirrored stores and effect loops. Keep data and filtering bounded; for large datasets use the project's established pagination or virtualization contract, including selection across pages. Verify category labels, units and missing values as well as color.

## Review Cases

For a reported `coordinatedViews` pass, supply `cases` named `selection`, `filter`, `keyboard`, and `narrow`, with status and actual observations. Exercise selection from both views, sorting, clear, selected-item removal, keyboard controls and switching at mobile width. Include duplicate labels with distinct IDs. Reference actual captures/tests in the parent observation; a schema fixture is not evidence about the user's app.

## Notes and Credits

Adapted from [Dembrandt coordinated data views](https://github.com/dembrandt/dembrandt-skills/blob/c4ad177dea5b864f779f8c722f28cf04f760cb22/skills/coordinated-data-views/SKILL.md), copyright 2026 Dembrandt, under the [MIT license](dembrandt-LICENSE.txt). Dazzler retains brief-led layout, accessibility, brand and density rules; fixed splits and automatic compactness were not adopted.
