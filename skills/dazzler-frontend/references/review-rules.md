# Traceable, Prioritized Reviews

Use this for audits and findings discovered in the rendered review loop. Preserve existing design rules, explicit exceptions and brand locks. Do not invent flaws or require a long report for a small change.

Record each finding as **location, rule ID, measured/judged, confidence with basis, impact tier, observation, fix and reason**. Finish with the single highest-impact fix and why. If there are no supported findings, say so; report unavailable checks separately. Never pad the list with polish suggestions.

## Stable Rule Registry

IDs are permanent identities, not severity numbers. Renames retain the ID; retired IDs are never reused. The executable registry and thresholds live in `scripts/review-rules.mjs`. Add a migration note here if an identity changes; no IDs are retired in this version.

| ID | Check | Basis |
| --- | --- | --- |
| DZ-001 | Required content and facts | Brief/constraint |
| DZ-002 | Rendered implementation | Evidence coverage |
| DZ-003 | Protected heading case | Dazzler guidance, with overrides |
| DZ-004 | Brief-fit design voice | Judgment |
| DZ-005 | Relevant edge cases | Evidence coverage |
| DZ-006 | Responsive layout | Evidence coverage |
| DZ-007 | Accessibility review coverage | Evidence coverage, not conformance |
| DZ-008 | Primary task and recovery | Observed behavior |
| DZ-009 | Existing components and tokens | Project constraint |
| DZ-010 | Performance | Measured baseline/result |
| DZ-011 | Form operation and recovery | Observed behavior |
| DZ-012 | Motion and reduced motion | Observed behavior |
| DZ-013 | Data integrity and alternatives | Source/constraint |
| DZ-014 | Print pages | Rendered evidence |
| DZ-015 | Editing resilience | Observed behavior |
| DZ-101 | Text contrast | WCAG 2.2 SC 1.4.3 AA; 4.5:1 ordinary, 3:1 qualifying large text |
| DZ-102 | Non-text contrast | WCAG 2.2 SC 1.4.11 AA; 3:1 for applicable identifying information |
| DZ-103 | Pointer target size | WCAG 2.2 SC 2.5.8 AA; 24Ã—24 CSS px, with exceptions |
| DZ-104 | Body measure | Existing Dazzler 60ch guidance, with overrides; not WCAG |
| DZ-105 | Accessible name candidate | Requires semantic/interaction review |
| DZ-106 | Form label candidate | Requires semantic/interaction review |
| DZ-107 | Image loading | Measured load state |
| DZ-108 | Image alternative candidate | Requires purpose/context review |
| DZ-109 | Clipping candidate | Requires rendered review |

Review applicability before declaring a standard failure. Target-size exceptions include sufficient spacing, equivalent controls, inline text, user-agent controls and essential presentation. The 44Ã—44 target belongs to enhanced AAA guidance; a project may choose it, but it is not the AA minimum. Large text is at least 18pt or 14pt bold. Text and non-text contrast have distinct applicability and exceptions; do not apply 3:1 to every border. Do not round a failing ratio up to a pass. Unsupported compositing remains unmeasured.

Browser body-measure candidates include a 0.5ch detection tolerance for approximate geometry. This is a screening tolerance, not a change to the existing 60ch design guidance. Actual character count varies with content and font; `ch` is not a universal characters-per-line measurement. Do not import a blanket 45â€“75-character rule or shrink typography to silence a warning.

## Impact and Evidence

- **Blocking:** observed inability to complete an in-scope task, loss of essential information, or a supported risk of harm/data loss. Explain who is affected and how.
- **Important:** degraded task performance, or an applicable standard/required-constraint failure without evidence of a blocking consequence.
- **Polish:** a supported presentation improvement with no demonstrated task obstruction. A preference is not a compliance violation.

Prioritize by tier, then shared-component/primary-task scope. Stable rule/location order breaks otherwise equal ties; it is not an estimate of benefit or effort. State the reason for the first recommendation rather than claiming an optimal ROI. Unknown impact requires investigation, not an invented severity.

**Measured** means an instrument or direct check supplied the observation; its user impact can still be judged. **Judged** means a contextual interpretation. Confidence describes evidence support: **high** for reproduced measurements, **medium** for a single observation or grounded judgment, **low** for an explicitly inferred judgment, **unavailable** for not-run checks. These are not probabilities, beauty scores or guarantees. Cite a standard only when it applies; label taste and project guidance honestly.

## Helpers

`node scripts/review.mjs review.json` assesses a report with `target`, `revision` and `observations`. Each observation has `ruleId`, `location`, `status` (`pass`, `fail`, `not-run`, `excluded`), `source` (`measured`, `judged`), `verification` (`reproduced`, `observed`, `inferred`, `unavailable`), `evidence` (references) and `detail`. A failure additionally needs `fix` and `impact: {consequence, scope, reason}`. Consequence is `blocked-task`, `harm`, `degraded-task` or `presentation`; scope is `shared`, `primary` or `local`.

For DZ-101â€“104, observed outcomes need `measurement` with `applicability` (`applies`, `exception`, `unknown`), a `reason`, and the appropriate values: `ratio` plus `largeText` boolean; `ratio`; `width` and `height` in CSS pixels; or `measureCh`. Unknown applicability requires `not-run`; a justified exception is `excluded`. Missing measurements cannot become measured passes. For qualitative reading concerns use DZ-004 or DZ-006 instead of inventing a number.

The workflow assessor optionally accepts the same array as `reviewObservations`. Findings or not-run checks prevent an overall evidence-complete result. Existing reports without this field remain supported; their absence does not prove that detailed review occurred. Plans and results now carry stable rule IDs. Browser findings retain their legacy severity for compatibility and add rule/evidence labels; they require impact review before becoming prioritized findings. Unsupported contrast cases are explicitly listed as not-run.

Neither helper opens evidence files, verifies truth, certifies accessibility nor authorizes release. Keep private evidence local. Agents construct the report from actual work; users need not fill JSON or answer aesthetic questionnaires.

## Task-Specific Review IDs

DZ-016: density (judgment). DZ-017: coordinatedViews (evidence). DZ-018: operationalState (evidence). DZ-019: expertSettings (evidence). These append to the existing registry without renumbering it. Density is not an accessibility standard or a universal compactness target.

## Notes and Sources

Standards: [text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), [minimum targets](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [enhanced targets](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html). Checked October 23, 2026. Review traceability and prioritization were informed by the comparables in Dazzler issues #48 and #50: [UX Critique](https://github.com/Thecsiz/ux-critique), [Design Critique MCP](https://github.com/rimaskavaliauskas/design-critique-mcp), and [Superfuture Design Review](https://github.com/Superfuture/design-review). No implementation code was imported.
