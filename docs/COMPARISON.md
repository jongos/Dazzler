# Where Dazzler fits

Reviewed September 28, 2026 for Dazzler 0.20.0. This is a capability guide, not a ranking or a head-to-head quality benchmark.

**Verified here** means exercised in this repository's tests or recorded local trials. **Documented** means described by the publisher and read during this review. **Not assessed** means no suitable trial was performed; it does not mean a capability is absent.

## Dazzler's practical focus

| Need | Evidence status | Scope and limit |
|---|---|---|
| Fonts selected for real text | Verified here | Full editions contain 24 licensed families / 124 font binaries; compact contains six general families. Coverage, styles and bytes are checked. Shaping still needs the target renderer. |
| Measured brand colors | Verified here | Perceptual palette generation, exact supported locks and role-pair contrast checks; full-page accessibility still needs review. |
| Persistent design choices | Verified here | Saved records, supported DESIGN.md subset, fluid type and compatible shadcn proposals; not lossless arbitrary-format interchange. |
| Composition and refinements | Verified here | Eight layout contracts, eight intents, optional dials and five contextual review rules. Candidate counts do not establish aesthetic quality or AI authorship. |
| Documents, charts and illustrations | Verified here, with limits | Thirty templates, browser charts and keyboard-accessible illustration fixtures. Native editable Office charts require an optional runtime and were not executed here. |
| Installation and distribution | Verified here, with limits | Managed installer tests, rollback and extracted helpers; cross-OS archive hashes verified for the preceding release. Current release CI must pass before publication. Package checks do not establish every host's discovery or upload behavior. |
| Figma and optional comps | Documented workflow | Read-only evidence mapping and opt-in comp-to-implementation guidance. No live Figma trial, variable write-back or image generator is bundled. |
| Implicit skill activation | Not assessed conclusively | A trigger harness exists, but host denials/timeouts and limited observations prevent a valid baseline/current improvement claim. New prompts remain unmeasured. |

Choose Dazzler when bundled licensed assets, explicit brand constraints, local numerical helpers and several output formats matter. The footprint is larger than a short instruction-only skill. Exact compressed/unpacked bytes are published in each release's `PACKAGE-SIZES.json`; compact and full resources differ.

Core font, color, layout and token helpers use bundled files without network access. Browser inspection of live sites, connector reads, image-generation services and initial downloads can use the network. Browser/Office runtimes and project dependencies remain prerequisites. The Windows x64 offline kit is platform-specific; it is not a promise of offline operation for every host task.

SwiftUI, Compose and Flutter exports are not validated Dazzler capabilities. Grok Bot installation remains unverified without an authenticated discovery/invocation trial. No comparative speed, adoption or creative-quality superiority is claimed.

## Notes, comparison evidence and credits

The following alternatives were reviewed through their public primary documentation on the date above. **Documented** describes their stated capabilities; their execution, installation and output quality were **not assessed** in this review. Features omitted from a row are not claimed to be missing.

| Product | Documented focus | When to investigate it |
|---|---|---|
| Anthropic frontend-design | Concise visual-direction, typography and critique instructions | You want a small instruction-focused starting point. |
| UI UX Pro Max | Searchable design guidance and persistent master/page design records | You want a broad searchable design knowledge base. |
| Impeccable | Named refinement commands, browser iteration and deterministic design detectors | You want a command-oriented design review workflow. |
| Taste Skill | Frontend guidance plus separate image-generation reference-board skills | You want to explore an image-first proposal workflow. |
| Google DESIGN.md | A portable design-system format with lint, diff and token export tools | You primarily need documented design-system interchange. |

Sources: [Anthropic skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design), [UI UX Pro Max documentation](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), [Impeccable documentation](https://github.com/pbakaus/impeccable), [Taste Skill documentation](https://github.com/Leonxlnx/taste-skill), [DESIGN.md documentation](https://github.com/google-labs-code/design.md). No competitor code was imported for this review. Credits remain with their respective authors.

Dazzler evidence: [Phase 2](../maintenance/PHASE2-VALIDATION.md), [Phase 3](../maintenance/PHASE3-VALIDATION.md), [Phase 4](../maintenance/PHASE4-VALIDATION.md), [Phase 5](../maintenance/PHASE5-VALIDATION.md), [host status](../platforms/GROK-BOT-STATUS.md). Feedback: [jon@filmhedge.com](mailto:jon@filmhedge.com).
