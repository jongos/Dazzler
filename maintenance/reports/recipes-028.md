# Recipe Integration — October 7, 2026

Initially implemented locally for 0.28.0, then approved for shipment. The corrected release is 0.28.1 after a maintenance lockfile error blocked 0.28.0 CI. No study expansion, rejected recipes, inference calls or installation changes were made. The source study files were read without modification.

## What Changed

The skill now routes substantial design work to an optional recipe workflow alongside original directions. `scripts/recipes.py` offers `contexts`, `shortlist`, `get` and `record`. A shortlist uses a brief's audience, content, interaction, brand and existing-system terms plus agent-supplied arrangement preferences. It returns up to five candidates; the default is three. Full details are read only for an individual lookup or derivation record.

The index is 595,405 bytes on disk and never needs to enter the prompt. The full winner-only knowledge package is 3,249,125 bytes. No new runtime dependency is required. Existing platform assembly includes the data, license and helper; the template-only download remains template-only.

Shortlisting is transparent lexical retrieval with structural/type/palette diversity. Input order and category counts do not rank candidates. Unanimous votes break otherwise equal choices. This is not semantic inference or a calibrated aesthetic model: the agent must assess fit, reject unsuitable suggestions and preserve explicit constraints. Nothing automatically merges recipe values into studio tokens or replaces a saved design system.

Internal derivation records include the recipe ID, exact dataset revision, selection rationale and adaptations. They mark outputs as derived and untested until separate implementation evidence exists. Source raw votes remain accessible as evidence, not a probability of beauty. Reference IDs and study machinery are omitted from the shipped data; no uninspected reference sites were copied or fetched.

## Source Pin

- Dataset revision: `sha256:686eb8f4a8bb2457b43add204e89d9fc0c017eb7f49c494aaa5cdd71fac4f567`.
- Source checkout commit: `fa26b162836c1fc3c9420b89a71df36aefb41a42`. The study was uncommitted, so this commit alone does not identify it; the exact input hashes do.
- 1,000 retained recipes; 2,318 combinations; 6,954 judgments; 915 unanimous and 85 split winners; model `jev-1.13.0`.
- All requested guides, winners, summary, study README and license are hash-recorded. Those source-file hashes remained unchanged after integration.

## Validation

- Python: 78 tests run, one skipped, no failures; eight focused recipe tests cover all five contexts, detail hashes, lookup, filtering, order/count independence, agreement tie-breaking, missing/corrupt data, lazy loading and derivation semantics.
- Node: 101 tests passed, preserving existing studio/color/composition workflows.
- Fonts: 24 families, 121 binaries and 200 support assets validated. Runtime integrity: 1,699 files passed.
- Five synthetic adaptations were rendered at 1440px and 390px. Font loading, page/table overflow, automated WCAG A/AA checks, keyboard activation and representative controls passed in all ten views. Captures were visually reviewed for hierarchy, wrapping, readable content and responsive order.
- Corrections during review: use the emitted `Inter Variable` CSS family rather than the catalog name; use real heading weights without synthesized bold; give the software status column room to show its full text.
- Existing gallery browser checks passed: 30 cards and linked examples/images, guide cards and four filters at both widths. Formatting, local links, version checks and whitespace checks passed.
- All ten archives passed structure, size and resource checks. The nine skill packages also passed extracted recipe lookup/shortlisting and existing helper/installer tests. Largest archive: 13,637,001 bytes compressed, 23,092,761 bytes unpacked, below the 24,000,000-byte gate.

The five integration probes are functional tests, not new user templates or evidence that these recipes are aesthetically superior. Their restrained presentation is not a new Dazzler default. No claim is made that all 1,000 recipes have been rendered or that automated checks establish complete accessibility.

| Context | Source Recipe | Exercised Behavior |
|---|---|---|
| Editorial | R0551 | Reading column, keyboard disclosure, real article text |
| Commerce | R0723 | Product comparison, filtering and inspection feedback |
| Culture | R1409 | Program table, visit information and accessible action |
| Information | R2158 | Labeled search, filtered guidance and result status |
| Software | R0150 | Request table/inspector, keyboard controls and explicit brand override |

Machine evidence and screenshots are in [the integration evidence folder](../recipe-integration/). Reproduce locally with `python tools/recipe_smoke.py NEW_OUTPUT`, then `node tools/test_recipes_browser.cjs NEW_OUTPUT`. Browser CI includes both commands. This does not run Jev or regenerate the source study.

## Publication Gate

The initial gate correctly failed with **Regenerate after runtime changes**. Following explicit approval to ship, all 30 artifacts were rebuilt with the current skill, all ten Word pages and 40 desktop/mobile browser views were inspected, and the evidence manifest was renewed. `python tools/validate_gallery_release.py maintenance/gallery-release.json` now passes. Theme tokenization is part of assembly; all 40 final browser captures match the inspected output exactly. The [gallery review](../gallery-production/v0.28.0/REVIEW.md) records the scope and recipe consideration. The first hosted run exposed a scheduler dependency corrupted by the earlier broad version bump. The 0.28.1 correction restores the last published dependency metadata, adds an installed-metadata regression and passes a clean isolated npm installation plus 79 Python tests (one optional skip). Hosted CI and cross-OS archive reproducibility remain separate release checks; local checks do not establish their result.

## Notes

Recipe data is adapted from Jon Gosier's Style Science under Apache-2.0. The skill's closing provenance note and bundled license retain attribution. The study is text-only and winner-targeted, based on a single minimalist reference directory; it supplies no rendered-site comparison, human preference finding or causal design law. Existing Dazzler art direction and explicit user requirements take precedence.

The retained recipe source is now public at Style Science commit `b29504abf762a43ce4e2819372eb0342243e4c54`. Re-import reproduced the index, 1,000 details and license byte-for-byte. The project owner confirmed permission to use the retained TypeSafe evidence; this is customer-confirmed permission, not independent verification of contractual rights. Earlier releases used an unpublished snapshot; publication does not retroactively change that history.
