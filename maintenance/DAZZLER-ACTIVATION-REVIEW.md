# Dazzler: From Available Features to Visible Design

October 7, 2026. Local development review; not a published release or a blind superiority study.

## Diagnosis

The principal problem is the distance between possessing design tools and making design decisions that use them.

1. **The active copy was stale.** `%USERPROFILE%\.codex\skills\dazzler-frontend` is an independent unmanaged directory, not a link to the source checkout. Its entrypoint differs from the current source and its runtime inventory contains 703 files. Source changes alone therefore do not change this installed skill. This is a confirmed local activation failure, not an explanation for every output on every host.
2. **The easiest executable path is generic.** `studio.mjs` falls back to system fonts and a purple seed. `template_features.py` explicitly sets every generated template chart to Arial. Those defaults are usable scaffolding but do not select an identity. The many catalogs and adapters mostly require deliberate selection and integration.
3. **Earlier changes improved discipline more than expression.** The three document pilots changed their reading structures, but stripping shaded titles and metric strips was not sufficient to establish a memorable design idea. A quieter document is not automatically a more distinctive one.
4. **Verification favored correctness.** Existing checks catch breakage, inaccurate values and inaccessible interactions. They cannot establish aesthetic quality. Counting fonts, helpers, screenshots or passed checks gives no evidence that a reader sees a distinctive, coherent result.

## What Makes Dazzler Recognizable

The recognizable quality should be a coherent design idea carried through the artifact, rather than a permanent Dazzler skin. A field atlas, a festival playbill and an investment brief should look unmistakably different. Typography, composition, illustrations and data graphics should reinforce the selected direction.

This requires decisions about proportion and sequence: what receives the largest area, what the reader sees first, where the page becomes dense or quiet, and how explanatory text connects to evidence. More colors or more components cannot substitute for these decisions.

## Changes Implemented

- The skill entrypoint and automatic workflow now begin new designs and substantial restyles with subject-specific art direction. Small fixes preserve the existing system. The new reference connects decisions to actual exported fonts, source-aware chart design, useful original graphics, interactions and native document structure.
- Substantial workflow plans now include a rendered distinction check alongside correctness checks. It asks for an actual baseline and visible changes beyond palette; it does not assign an aesthetic score.
- Modern token outputs explicitly identify unconfigured font/color defaults as scaffolding. Legacy schema outputs remain byte-compatible with the existing regression fixtures.
- The chart renderer now accepts source-anchored annotations and labelled reference lines for single-series bar, line and scatter HTML/SVG. Annotation y positions come from existing nonmissing rows. Unsupported encodings and native/compact adapters reject these features rather than silently discarding them. Wording and benchmark provenance still require author review.
- A reproducible same-content study uses the actual bundled font files, token helper and chart renderer. It contains a neutral baseline, editorial field atlas, public campaign with a data-derived coverage graphic, and an evidence-first technical dossier. Narrow screens receive separately composed charts rather than clipped desktop plots.

## Inspect the Evidence

- [Neutral baseline](../skills/dazzler-frontend/assets/art-direction/baseline.html)
- [Field atlas](../skills/dazzler-frontend/assets/art-direction/atlas.html)
- [Public campaign](../skills/dazzler-frontend/assets/art-direction/signal.html)
- [Technical dossier](../skills/dazzler-frontend/assets/art-direction/ledger.html)
- Browser captures and machine-readable checks: `signature-review/`.

All four share the same core copy and six synthetic coverage values: 18, 21, 24, 29, 34 and 42 percent. The campaign adds a derived 42-of-100 graphic. The neutral baseline is constructed for this study; it is not an old agent run. The earlier immutable template benchmark remains separate.

## Verification and Limits

86 Node tests passed. 68 Python cases ran: 67 passed and one symlink-permission case was skipped. Four visual directions passed at 1440 and 390 pixels: actual font loading, six exact source values, keyboard-operated disclosure, no page overflow and zero axe violations in the selected WCAG rules. These checks do not establish complete accessibility. Desktop and narrow rendered examples were visually inspected; mobile chart treatment was corrected after inspection. Local links pass across 167 Markdown/HTML files. Formatting and the 722-file runtime inventory pass. All ten final host/template packages passed validation, including extracted helper execution.

The local installed skill was refreshed from the full source library after staged hash and health verification. All 733 installed source/support files match. The previous 714-file installation remains intact at `%USERPROFILE%\Dazzler\installation-backups\dazzler-frontend-20261007-original`; its inventory was verified after the move. Installed chart execution and the new distinction check passed. See `signature-review/activation.json` for the exact paths and entrypoint hash. This is a full manual local development installation, not a managed release install or automatic updater. Source edits made later will still need a deliberate refresh. At the time of this local review, no commit, push or public deployment had been performed; this report was subsequently published with the repository.

This change improves the executable chart vocabulary, the agent's activation instructions and the available examples. It does not prove that future agent generations will consistently outperform other tools. The next meaningful evaluation is a blinded repeated same-brief comparison with independent ratings for audience fit, composition, typography, data clarity and distinctiveness, disqualifying factual or functional regressions. Do not turn those ratings into an invented objective taste score.

The existing 30-template gallery was not broadly redesigned again in this iteration. Its old chart defaults remain a separate migration task; the new specimen deliberately demonstrates the richer path before propagating it indiscriminately. Native DOCX annotation support was not added, and no static chart is represented as editable.

## Research Notes

[Pentagram's SSG identity](https://www.pentagram.com/work/sustainability-solutions-group) is relevant because its organizing idea extends across type, graphics, data and reports. The lesson adopted here is coherence across media, not copying that project's assets or style.

[FT Visual Vocabulary](https://github.com/Financial-Times/chart-doctor/blob/main/visual-vocabulary/README.md) organizes chart choice around the relationship being communicated. [Observable Plot's text marks](https://observablehq.github.io/plot/marks/text) show how labels can participate directly in the graphic. These support the move from a generic plot to an explained comparison, while retaining exact source values.
