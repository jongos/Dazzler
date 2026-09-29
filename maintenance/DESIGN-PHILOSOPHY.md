# Design Philosophy: Evidence and Enforcement

This maintainer record connects the twelve shipped principles to public evidence and actual checks. It extends the Phase 6 assessment; it does not claim access to paid books or reproduce their content. The installable skill retains the shorter operational rules.

## Public-Page Assessment

Reviewed 2026-09-28. Source keys resolve in the closing notes. These summaries are original paraphrases, limited to the inspected pages.

| Key | Useful principles | Adoption and limits |
| --- | --- | --- |
| N | Show system state; use familiar language; offer recovery; favor recognition; keep secondary detail out of the main task. | Visible feedback, named actions, reversible previews and progressive disclosure. Heuristics still need user/task evidence. |
| B | Body typography carries the reading experience; balance size, leading and measure; use emphasis sparingly. | Real font weights, genuine italics, explicit measure and print review. Dazzler deliberately supports reviewed open fonts rather than adopting a general preference for commercial faces. |
| E | Establish a few useful layout constraints; let content determine dimensions; allow composition to adapt. | Intrinsic reflow, maximum prose measure and content-based layouts. No universal page geometry. |
| C | Shared increments organize alignment; consistent spacing connects elements; grids can adapt across breakpoints. | Spacing-derived 4/8/12-column tokens. Existing project grids remain authoritative. |
| W | Contrast is evaluated between foreground and background; normal and large text have different thresholds; some content has defined exceptions. | Measured text-role pairs and explicit unresolved locks. A palette result does not certify every rendered state. |
| T | Combine relative size with viewport adaptation; bound fluid scales; use relative measures and unitless leading; account for font-loading cost. | Rem-aware fluid scales, font subsets/selection budgets and static print sizes. A ch unit estimates width, not an exact count of letters. |
| F | Choose chart form from the analytical relationship; distinguish correlation from causation; use a zero baseline for magnitude bars; distinguish geographic rates from totals. | Adapter selection, labeled units, preserved input rows and table alternatives. No copied charts, figures or template code. |

## Consensus Matrix

E = explicit in the inspected page; I = our application of its reasoning; — = not established there. Absence is not disagreement. Exact thresholds are adopted only where the cited criterion supplies them; other values are documented house choices.

| Principle | N | B | E | C | W | T | F |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Task and action clarity | E | — | — | — | — | — | E |
| Visible hierarchy and selective emphasis | E | E | I | I | — | E | I |
| Readable measure and typography | — | E | E | — | I | E | — |
| Consistent scales and relationships | E | I | E | E | — | E | — |
| Measured color roles | — | — | — | — | E | — | — |
| Responsive adaptation | — | — | E | E | — | E | — |
| Feedback and recovery | E | — | — | — | — | — | — |
| Honest quantitative representation | — | — | — | — | — | — | E |

## Twelve Operational Principles

Paths below are relative to `skills/dazzler-frontend/`. Tests live in the repository's `tests/` directory. The exact house defaults and exceptions are in `references/design-philosophy.md`.

| Principle and reason | Testable rule / enforcement | Remaining human judgment |
| --- | --- | --- |
| 1. Make the next action clear: reduce uncertainty. N | `references/deslop.md`, `interface-craft.md`; browser accessible-name and interaction checks. | Whether the action serves the audience. |
| 2. Fit the stakes: expressive and reserved work have different needs. N (inference) | `scripts/design-policy.mjs` context routing and saved explicit overrides; policy regression tests. | Context classification, cultural expectations. |
| 3. Make reading comfortable: readable text is the main interface. B/E/T | Default maximum 60ch; reflow and print candidates in `browser.cjs`, policy tokens and native document helpers. | Real line lengths, language and Word pagination. |
| 4. Make headings recognizable: retain names and meaning. House policy | Protected casing fixtures shared by Python/Node; preserve authored non-English and brand strings. | Editorial casing is not a universal rule. |
| 5. Build hierarchy: help readers allocate attention. B/T/N | `type-system.mjs` bounded scales, actual font metadata, fluid and static print output. | The intended first, second and third read. |
| 6. Organize relationships: related items should look related. E/C | `layouts.mjs`, spacing-derived grid tokens and composition contracts. | Whether a grid is appropriate at all. |
| 7. Give color a job: measurable readability beats harmony alone. W | `colors.mjs` AA text-role checks at 4.5:1 normal and 3:1 large text; optional AAA. | Image backgrounds, compositing and unmeasured states. |
| 8. Make risk unmistakable: users need prevention and recovery. N/W | Danger/onDanger roles, labels and non-color guidance; locked conflicts fail explicitly. | Appropriate confirmation or undo for the actual consequence. |
| 9. Deliver the fonts: a family name is not an installed asset. T (inference) | `fonts.py` coverage and license/hash gates; compact-profile installed-family filtering. | User-font authorization and native face registration. |
| 10. Make controls usable beyond the mouse: input methods vary. N (inference) | `browser.cjs` accessible-name, focus and target candidates; field-guide semantic controls and keyboard review. | Target exceptions, assistive technology and real task completion. |
| 11. Show honest evidence: design must not invent the data. F | `visualize.mjs` input validation and data-preservation tests; fictional template labels. | Data interpretation and causal claims. |
| 12. Verify and remember decisions: implementation is not observation. N/T (inference) | `design-record.mjs` bounded import and legacy resume; browser/artifact review, 30-template audit and field-guide tests. | Conflicting brand sources, usability, complete accessibility and host acceptance. |

## Resolved Tradeoffs

The 60ch measure, protected English Title Case, expressive/reserved routing and red danger default are configurable Dazzler policy, not a consensus standard. Existing brand and language choices win. Brand locks that fail measured contrast are reported for reconciliation rather than silently changed or declared compliant. WCAG 2 ratios remain the conformance metric; other perceptual metrics can inform review but do not replace it.

System fonts remain appropriate for an established app or native accessibility behavior. Bundled open fonts add character when licensed, covered and affordable to load. Native exports start with platform fonts until the app registers correct faces; they are theme proposals, not evidence of native compilation.

The prior 30-template audit remains the broad fixture review. This release adds the redesigned manual as a worked application: distinct hierarchy, task-based navigation, measured rendered contrast, local prompt handling, reflow and print checks. It does not invent an aesthetic score or a controlled comparison with an unskilled model.

| Disagreement | Default and deviation |
| --- | --- |
| Expressive versus reserved | Route by stakes; explicit project direction wins. |
| Reading measure | Maximum 60ch for prose; override for language, medium or verified reading needs. |
| Grid rigor | Shared spacing and optional columns; retain established grids or deliberate freeform composition. |
| System versus bundled fonts | Deliverable licensed faces with coverage and budget checks; keep system fonts when native scaling or an existing app calls for them. |
| Contrast metric | WCAG 2 role ratios; perceptual models remain advisory. |
| Brand placement | Preserve brand identity, but reconcile unreadable foreground/background pairs explicitly. |
| Destructive emphasis | Labeled danger role plus recovery/confirmation proportionate to the consequence; never color alone. |
| All caps | Short authored labels may use caps; avoid automatic repeated shouting in headings. Preserve names and acronyms. |
| Density | Fit the task; compact data tools and generous editorial pages have different needs. |

## Gaps and Regression Coverage

Principles 1, 2, 5 and 6 still require judgment about the actual audience; geometric checks cannot establish usefulness. Principles 3, 7, 8 and 10 require final rendering, enlarged text and interaction review. Native platform compilation is explicitly outside the bundled runtime. Principle 9 cannot verify a user's legal rights from a declaration. Principle 11 preserves rows but cannot establish that supplied facts are true. These boundaries are retained in the operational references rather than converted into false automated passes.

Principle 12's concrete external evidence gaps remain tracked in issues 9 (host reads), 13 (hosted upload) and 37 (controlled comparison). Directory discovery remains issue 20. Five starter exercise descriptions now cover hierarchy, measure, type coverage, contrast, keyboard use, honest data and saved decisions. The cross-host document case checks measure/emphasis/font availability; the system case now expects current schema 3 rather than its stale schema-2 assertion. Unrun host evals remain unrun.

The comparison helper rendered three historical pairs: DOCX professional, HTML marketing and UI workspace. The existing audit records six changed heading positions out of seven in the professional document, two native pages, and the adopted approximate 60ch measure; HTML/UI rows record measure/grid presence and heading deltas. Pixel differences are not presented as contrast improvements or usability scores. No new contrast delta is claimed from a JPEG.

## Notes and Sources

- N: [NN/g, Ten Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/), sections 1–10.
- B: [Butterick, Summary of Key Rules](https://practicaltypography.com/summary-of-key-rules.html), body text and emphasis.
- E: [Every Layout, Axioms](https://every-layout.dev/rudiments/axioms/), constraints and measure.
- C: [Carbon, 2x Grid Overview](https://carbondesignsystem.com/elements/2x-grid/overview/), grid and spacing.
- W: [W3C, Understanding Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), criterion and intent.
- T: [web.dev, Typography](https://web.dev/learn/design/typography), scaling, line length, loading and variable fonts.
- F: [Financial Times, Visual Vocabulary](https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary), correlation, ranking, magnitude and spatial sections. Research only; no FT assets are redistributed.
- [Phase 6 decisions, comparisons and 30-template audit](phase6/README.md). Paid books listed in the issue were not accessed; no chapter-level findings are asserted. A GOV.UK page returned only a redirect and contributes no evidence here.
- Helper-rendered comparisons: [DOCX](phase6/comparisons/docx-professional/compare.html), [HTML](phase6/comparisons/html-marketing/compare.html), [UI](phase6/comparisons/webapp-workspace/compare.html).
