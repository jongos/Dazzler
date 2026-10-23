# Operational State

Use for repeated work involving queues, batch actions, saved views or ongoing sessions. Add `operationalState` to workflow features when relevant. Domain expertise alone does not establish a compact layout; use the actual work and [density planner](density.md).

## Preserve Useful Context

Separate persistent work scope (workspace, queue, date range, saved filters) from temporary search and hover. Decide persistence by purpose, not by persisting every field. Preserve appropriate column widths, sorting and panels without retaining stale permissions, selected records or sensitive text unnecessarily.

Namespace stored preferences by user, workspace and schema version. On identity/workspace changes, reset or revalidate scoped state before presenting actions; never replay another context's selection. Validate stored data, tolerate corrupt/obsolete values and unavailable storage, and provide an understandable reset. Do not treat local storage as authorization or a safe place for private records. Use existing application storage rules.

A refresh should preserve safe work context while reconciling selections against current data and permissions. Communicate stale/offline data and pending work. Do not imply a successful backend operation from a local demonstration.

## Bulk Work and Recovery

Show what an action affects: selected count, visible subset or all matching results. Prevent duplicate submissions while pending. Report successes and failures separately; preserve failed items for correction and retry only the appropriate subset. Provide cancellation or undo only when the underlying operation supports it. Choose confirmation, progress and persistent feedback from consequences, duration and recoverability rather than arbitrary item-count thresholds.

Keep domain labels and status visible where needed. Shortcuts supplement discoverable controls. Preserve input and task context during errors without presenting outdated data as current.

## Review Cases

A passing `operationalState` observation needs `scope`, `persistence`, and `recovery` cases. Exercise workspace/account change, reload, malformed saved state, unavailable storage, filter reset, refresh/removal, duplicate activation and applicable partial failures. Explain exclusions when a behavior is not implemented; at least one case must actually be tested. Never fabricate a backend to satisfy a checklist.

## Notes and Credits

Adapted from [Dembrandt operational expert UI](https://github.com/dembrandt/dembrandt-skills/blob/c4ad177dea5b864f779f8c722f28cf04f760cb22/skills/operational-expert-tool-ui/SKILL.md), copyright 2026 Dembrandt, under the [MIT license](dembrandt-LICENSE.txt). Persistent context and workflow scope are retained; blanket whitespace rejection, fixed row heights and item-count feedback thresholds are not.
