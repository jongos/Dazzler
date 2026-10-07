# Dazzler 0.27 Gallery Review

All 30 examples were freshly authored from synthetic briefs using the current art-direction and document/web guidance. The previous 0.26 snapshots are retained beside this report. The earlier working library is preserved in `work/gallery-before-027`.

## Results

- Ten editable Word documents: all ten complete pages rendered with LibreOffice and visually inspected. Five use colored full-page vector surfaces; three use landscape geometry. Copy and tables remain native.
- Twenty browser examples: full desktop and mobile captures reviewed at 1440 and 390 pixels. No page overflow or reported WCAG A/AA axe violations in the tested states. All ten primary UI interactions and rendered heading checks pass.
- The assembled gallery passes 30-image loading, local link, format-filter, mobile reflow and axe checks. Manuscript saving survives reload.
- 99 Node regressions and 70 Python tests passed (one optional Python test skipped). Field-guide, gallery and design-system browser checks passed.
- The runtime inventory passes for 693 files. The release-gallery manifest passes for all 30 examples and binds final artifacts and their dependencies to complete captures and prior-release evidence.
- All ten final platform/template archives passed structure, links, resource hashes, size gates and extracted helper checks. Clearing obsolete development archives resolved the earlier disk-space interruption.

## Repairs from Render Review

Removed inherited blue title rules; widened and padded Word table cells; repaired proposal spillover; restored event and menu hours; separated the family planner from the numbered presentation structure; made recovery steps distinct native lanes; applied colored page surfaces without rasterizing text. Mobile fixes cover grid min-content overflow, touching date lines, clock fit, chart-label contrast and visible table-scroll guidance.

Gallery thumbnails now contain whole compositions. Word previews identify LibreOffice honestly and include the rendered PDF. The field guide and README use the new scenarios and snapshots. Existing template IDs remain stable, while the scenarios and UI controls have intentionally changed; maintenance tests now exercise those behaviors.

## Limits

Visual distinction is a recorded reviewer judgment, not a machine beauty score. Automated accessibility checks do not replace assistive-technology testing. Word itself was not used for the final successful renders, and fonts or edits can change pagination. Jev was not used as an image judge and no Jev runtime or copied implementation was added. Release validation is complete; GitHub publication status is recorded separately in the release.

## Reproduction Notes

The collection-specific authoring scripts are `tools/gallery_027.py` and `tools/gallery_027_ui.py`. Source formatting, browser checks, reviewed-library assembly and evidence binding are separate operations. Render and inspect fresh output before promoting it; a hash refresh does not renew visual approval. Disposable staging copies were cleared after disk exhaustion. Original Dazzler work, Apache-2.0; bundled fonts retain their notices.
