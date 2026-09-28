# Design resource maintenance

## Deslop framework

The framework is adapted guidance, not a separately installed upstream skill. Review only the requested `skills/frontend-design-deslop` folder at the pinned revision recorded in `references/deslop-provenance.json`; retrieve its governing license as needed. Preserve creator credit and the MIT notice. Review changes against our brand, scope, typography, measured-color and accessibility rules before adoption. Do not blindly replace the adapted guides with upstream files or broaden the import to other skills.

`skills/dazzler-frontend/evals/deslop-cases.json` contains manual behavioral evaluation scenarios. For an authorized evaluation run, use an isolated project, inspect actual outputs and record evidence. Fixture presence and structural validation do not establish behavioral success. For guidance-only edits, inspect the relevant scenarios, validate skill/plugin structure and local links, and state whether agent/browser execution was performed. Update developer notes with the real validation boundary.

## Color resources

Normal color helper use needs Node.js (22+ recommended), not npm, network access or a service account. Rebuild with `npm ci --ignore-scripts --no-audit --no-fund` then `npm run build:colors`. The lockfile pins @ankhorage/color-theory 0.3.1, Culori 4.0.2 and esbuild 0.28.2. esbuild is development-only. The build copies MIT notices and records the generated engine's SHA-256. Commit the bundle, notices and provenance with dependency changes; never edit generated bundle code directly.

Run `npm run test:colors` for ratio, gamut, grayscale/extreme ramp, locked brand, no-match, export, catalog and hash regressions. For preview changes, also run `node tools/test_color_preview.cjs /path/to/new-preview-folder` with Playwright available via NODE_PATH. The browser check opens the generated local artifact, exercises both themes and simulation controls, and captures desktop/mobile screenshots. These checks are not complete WCAG or color-vision certification. Review actual typography and components in each design task.

## Font catalog

The catalog is a reviewed snapshot, not a live scraper dependency. Normal skill use and `scripts/fonts.py` need only Python's standard library.

1. Run `python tools/crawl_open_foundry.py --out /path/to/new-snapshot.json` to capture current directory facts. The scraper uses the site's public Nuxt payload, fails on a missing schema, and does not download fonts. Compare all detail pages with the existing catalog. Do not adopt license labels or repository placeholders without checking them.
2. Follow the family author/publisher's repository or release archive. Inspect the exact font's license, notices, version and any source-distribution requirements. For a mirror, label it as such. Pin GitHub downloads to a commit; preserve archive URL and SHA-256 for release downloads. Do not blindly refresh all binaries from moving URLs.
3. Preserve original bytes, copyright, license, and provenance in `assets/fonts/<id>/`. Changes to a font, including format conversion or subsetting, require a separate review of its license and reserved names. Keep GUST's full archive and manifest with TeX Gyre Heros. Keep Nimbus excluded until its exact source-distribution requirements are resolved.
4. With `requirements-dev.txt` installed in a development environment, use `tools/inspect_font.py`'s `inspect(path)` to derive technical data. Update `references/font-catalog.json` with separate directory claims, binary facts, editorial judgments and deliberate CSS descriptors. Do not erase raw OS/2 values when correcting CSS mappings. Update asset/support hashes. Record the exact source URL of each downloaded font. License URLs and commits live in each family's source notice and distribution record.
5. Run `python tools/render_font_catalog.py`, `python tools/validate_fonts.py --inspect-binaries`, and `python -m unittest discover -s tests -v`. Check actual browser loading for new or replaced binaries. A parsed font is not necessarily accepted by a browser's sanitizer.
6. Bump the plugin version, update the counts and developer changelog, and follow `AGENTS.md` to commit, push and verify the remote SHA. Review public files for accidental client data or machine-specific temporary paths.

The SHA-256 inventory detects accidental changes; it is not an independent signature from each font's author. Source availability and branch heads can change after the snapshot date. Font metadata may overstate coverage; test real text and shaping for the intended language.

Asset files use `-text -whitespace` in `.gitattributes` so Git preserves upstream line endings and intentional whitespace without rewriting license text or invalidating the inventory. Whitespace checks still apply to our code and documentation outside the asset tree. After staging an update, run `python tools/validate_fonts.py --staged` to compare the actual Git blobs to every recorded asset hash.

Optional browser check: with Playwright and its Chromium runtime available in the development environment, run `node tools/test_font_loading.cjs /path/to/qa-output`. It serves only cataloged local font files on a temporary loopback server, loads every bundled face, and writes a JSON report plus desktop/mobile specimen screenshots. These browser dependencies are not required for skill use and are not bundled.

## Visualization runtimes

Run `npm ci --ignore-scripts --no-audit --no-fund`, then `npm run build:visualization`. Exact package versions and tarball integrity are pinned in package-lock.json. The build collects licenses for every constituent package discovered through the bundler metadata and records output hashes. Microcharts uses the pinned React legacy synchronous server renderer to avoid a lingering streaming MessagePort; re-evaluate that private build entry when upgrading React. Generated React source uses public package imports. Run `npm run test:visualization`, then `node tools/test_visualization_exports.mjs NEW_DIR` and `node tools/test_visualization_browser.cjs NEW_DIR` with Playwright available. Native R execution needs a separate runtime and should be recorded as untested when absent. Package validation checks viz hashes and renders from extracted archives.

## Interactive illustration builds

Run `npm run build:hotspots` after `npm ci --ignore-scripts --no-audit --no-fund`. This builds separate vector, React and Vue browser bundles and the XML validator, retaining all constituent notices and hashes. Run `npm run test:hotspots`, generate fixtures with `node tools/test_hotspot_exports.mjs NEW_DIR`, then run `node tools/test_hotspot_browser.cjs NEW_DIR` with Playwright available. The Vue adapter requests an initial update after image load for its pinned older component; preserve that tested compatibility behavior when upgrading.

Run `python tools/seal_runtime.py` after final review, then `python skills/dazzler-frontend/scripts/health.py`. Use `tools/offline_build.py` to capture or restore the maintainer-only source kit; the release-only kit can rebuild the three engines on Windows x64 without package installation; other OS/architectures use the pinned package lock. `tools/no_network.cjs` blocks Node networking during verification; it is not an OS sandbox.

## Template showcase maintenance

`python tools/build_templates.py` rebuilds all 30 artifacts from deterministic fictional scenarios, selected local font faces and the actual chart/region exporters. It requires existing python-docx, Node and Playwright; it does not install them. `node tools/test_templates.cjs QA_DIRECTORY` checks both browser widths, data/filter behavior, local assets and seating interactions, then captures the 20 HTML/UI thumbnails and print PDFs.

On Windows with Microsoft Word available, run `tools/capture_word_templates.ps1 -Output PDF_DIRECTORY`, then `python tools/capture_template_pages.py PDF_DIRECTORY` with existing PDFium/Pillow. The capture step requires planned native pagination, emits all 20 Word-page snapshots and records source hashes. Inspect rendered pages visually; a page-count assertion is not a layout review. Other native renderers may be used after changing the recorded engine label honestly.

After snapshots, run `python tools/build_templates.py --gallery-only` to refresh the gallery and byte inventory, then `python tools/publish_template_gallery.py` to update the public collection, README and field manual from that inventory. Re-run browser/Word capture after changing the rendered source. Each main gallery contains 30 distinct snapshots. Keep the canonical and public template folders synchronized before sealing resources and building release packages.

## Release checks

Run `npm test`, `npm run format:check`, `python -m black --check tools tests skills/dazzler-frontend/scripts`, `python tools/check_links.py` and `python tools/validate_release.py`. CI runs core checks on Windows/Ubuntu and Node 20/22, plus browser accessibility on Ubuntu. Install maintainer-only Python tools from `maintenance/requirements.txt`.

The offline ZIP is a release asset with a matching manifest and SHA256SUMS; never add it to Git. Download the Windows x64 kit and manifest from the same release into one folder before restoring. Hashes detect corruption, not a malicious replacement of both files. Older kit commits remain in history; future regenerations do not add another tracked binary.

## Notes and credits

To refresh the curated catalog, review a new hue3 commit and license first. Update the explicit pin and parser in `tools/import_hue3.py`, then run it with a clean checkout. The current import accepts only a306210b7240e183366998ce39fbe7543cc09b41 and exactly 88 unique records. It extracts palette facts and editorial descriptions without importing upstream skill instructions. Its count/schema assertions intentionally require review when upstream changes.
