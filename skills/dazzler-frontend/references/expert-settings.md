# Expert Settings

Use for configuration, constraint editors and professional tools where users understand the domain but need not know implementation details. Add `expertSettings` to workflow features. Keep the ordinary path automatic; do not add a settings interface to outputs that do not need one.

## Make Consequences Understandable

Describe what a setting changes in the user's work. Group by domain purpose rather than data type. Show units for dimensional quantities and explain meaningful ranges, tradeoffs and dependencies. Keep identifiers and unitless counts accurately labeled; do not invent units.

Use established defaults with their actual provenance. If no safe default exists for a consequential decision, explain what is required rather than inventing one. Prefer familiar choices for common tasks; reveal advanced controls when useful. Preserve explicit user choices and existing design-system conventions.

## Saved Values and Temporary Overrides

Keep defaults, saved preferences, current draft and applied values distinct. A session-only override must not silently rewrite saved settings. Name reset scope: reset this field, discard draft, restore saved values or restore defaults. Preserve valid falsy values such as zero and false; absence is not the same as either.

Validate finite numbers, bounds, units and cross-field dependencies before applying. Do not silently clamp or reinterpret invalid input. Keep invalid drafts available for correction without applying them. Explain disabled controls and dependencies. Prevent duplicate save requests; on failure retain the draft and show that saved values are unchanged. Clear sensitive/scoped drafts on account/workspace change according to the project's rules.

Use the existing product's save model, persistence and accessible components. A working-looking settings screen must not imply persistence that does not exist.

## Review Cases

A passing `expertSettings` observation needs `defaults`, `validation`, and `save-reset` cases. Check default/custom indicators, zero/false values, units, invalid and dependent inputs, temporary overrides, save failure, reload and the exact reset scope. Exercise keyboard access and long translated labels when relevant. Record unavailable backend coverage as not-run, not a successful save.

## Notes and Credits

Adapted from [Dembrandt domain expert configuration](https://github.com/dembrandt/dembrandt-skills/blob/c4ad177dea5b864f779f8c722f28cf04f760cb22/skills/domain-expert-configuration/SKILL.md), copyright 2026 Dembrandt, under the [MIT license](dembrandt-LICENSE.txt). Existing Dazzler design rules and automatic operation take precedence; no Dembrandt runtime is required.
