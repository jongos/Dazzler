# Third-party notices

## Frontend design deslop framework

Creator: **Samuel Berthe ([samber](https://github.com/samber))**, copyright 2026 Samuel Berthe. Adapted from only [`skills/frontend-design-deslop`](https://github.com/samber/cc-skills/tree/f866b800353719270a9ea101a41c5e2a2618d460/skills/frontend-design-deslop) in `samber/cc-skills`, upstream skill version 1.2.2, commit `f866b800353719270a9ea101a41c5e2a2618d460`.

The applicable repository-root [MIT license is preserved verbatim](skills/dazzler-frontend/references/deslop-LICENSE.txt). Its notice applies to the adapted framework guidance and upstream-derived evaluation scenarios. Retain it with substantial copies. No other skills, agents, installers or repository configuration were imported; the root license was retrieved solely to preserve the governing notice.

Adaptation: consolidated the framework into design direction, a proportionate design record, interface craft and a render-based audit; connected typography/color to our existing verified resources; retained brand and stack choices; replaced rigid aesthetic bans and compulsory approvals with contextual decisions; corrected focus-outline, modal-focus and WCAG level guidance. Fixed palette/token presets and the upstream tool allowlist were not imported. [Source inventory and mapping](skills/dazzler-frontend/references/deslop-provenance.json) record the reviewed folder and content destinations. The evaluation cases are manual scenarios, not evidence of executed agent tests.

## Color resources

The mood catalog reuses palette values, names and atmosphere descriptions from [hue3](https://github.com/ktzzypo938/hue3/tree/a306210b7240e183366998ce39fbe7543cc09b41), copyright 2026 hue3 contributors, under [MIT](skills/dazzler-frontend/references/hue3-LICENSE.txt). Its original instructions and erroneous contrast guidance are not incorporated. Our importer restructures the entries and records per-file source links.

The generated [color engine](skills/dazzler-frontend/scripts/vendor/color-engine.mjs) bundles @ankhorage/color-theory 0.3.1 (copyright 2026 Ankhorage, [MIT](skills/dazzler-frontend/scripts/vendor/ankhorage-color-theory-LICENSE.txt)) and Culori 4.0.2 (copyright 2018 Dan Burzo, [MIT](skills/dazzler-frontend/scripts/vendor/culori-LICENSE.txt)). These portions are not relicensed under Apache. Exact package versions and npm integrity are pinned in `package-lock.json`; the bundle hash is in [provenance.json](skills/dazzler-frontend/scripts/vendor/provenance.json). The build selects upstream exports and bundles their code without changing upstream algorithms.

The original adapter, semantic-role orchestration and preview template are Apache-2.0. The MIT-licensed [bivex/brand-color-palette-generator](https://github.com/bivex/brand-color-palette-generator/tree/34120ac72e8153dd26ce2f995dba277477c74ce6) inspired interaction ideas only; no code is redistributed. Colormind, TinyColor, RandomColor and Chroma.js are not dependencies of this plugin. esbuild is a pinned development-only bundler, not shipped runtime code. Preserve the exported `licenses` folder and provenance when distributing generated color artifacts.

## Fonts

The plugin's original instructions, scripts and annotations are Apache-2.0. **Font binaries and upstream support files retain the terms below.** These assets have not been relicensed, converted, subsetted or internally renamed. SHA-256 hashes and exact download URLs are recorded in [the inventory](skills/dazzler-frontend/references/font-catalog.json). Each family folder includes copyright/license evidence and a source notice; preserve those when copying fonts to projects.

Open Foundry supplied the discovery directory, not a blanket license grant for every asset. We did not bundle its specimen artwork, backgrounds or site code. The complete [font catalog](skills/dazzler-frontend/references/font-catalog.md) links every directory page and explains repository, version and license discrepancies.

| Bundled family | Applicable license / evidence | Preserved files |
|---|---|---|
| Aileron | Author's No Rights Reserved dedication; Open Foundry labels it CC0-1.0 | [Notices](skills/dazzler-frontend/assets/fonts/aileron/) |
| Archivo | OFL-1.1 | [Notices](skills/dazzler-frontend/assets/fonts/archivo/) |
| Bagnard | OFL-1.1 | [Notices](skills/dazzler-frontend/assets/fonts/bagnard/) |
| Bluu Next | OFL-1.1; reserved font name in upstream notice | [Notices](skills/dazzler-frontend/assets/fonts/bluu-next/) |
| Cooper Hewitt | OFL-1.1; binaries from Font Library, source/license from Cooper Hewitt | [Notices](skills/dazzler-frontend/assets/fonts/cooper-hewitt/) |
| Cotham Sans | OFL-1.1 | [Notices](skills/dazzler-frontend/assets/fonts/cotham-sans/) |
| EB Garamond | OFL-1.1; Google Fonts distribution | [Notices](skills/dazzler-frontend/assets/fonts/eb-garamond/) |
| Gap Sans | OFL-1.1 | [Notices](skills/dazzler-frontend/assets/fonts/gap-sans/) |
| Inter | OFL-1.1 | [Notices](skills/dazzler-frontend/assets/fonts/inter/) |
| Junicode | OFL-1.1; Junicode 2 distribution | [Notices](skills/dazzler-frontend/assets/fonts/junicode/) |
| League Gothic | OFL-1.1; release 1.601 | [Notices](skills/dazzler-frontend/assets/fonts/league-gothic/) |
| Liberation Sans | OFL-1.1; release 2.1.5 | [Notices](skills/dazzler-frontend/assets/fonts/liberation-sans/) |
| Libre Baskerville | OFL-1.1 | [Notices](skills/dazzler-frontend/assets/fonts/libre-baskerville/) |
| M+ M Type-1 (M+ 1m) | OFL-1.1; legacy rayshan mirror, not newer M PLUS 1/2 | [Notices](skills/dazzler-frontend/assets/fonts/mplus-mtype-1/) |
| Office Code Pro | OFL-1.1; case community mirror, original repository unavailable | [Notices](skills/dazzler-frontend/assets/fonts/office-code-pro/) |
| Ostrich Sans | OFL-1.1 | [Notices](skills/dazzler-frontend/assets/fonts/ostrich-sans/) |
| Oswald | OFL-1.1 | [Notices](skills/dazzler-frontend/assets/fonts/oswald/) |
| Poppins | OFL-1.1; stable Google Fonts distribution | [Notices](skills/dazzler-frontend/assets/fonts/poppins/) |
| Reglo | OFL-1.1 | [Notices](skills/dazzler-frontend/assets/fonts/reglo/) |
| Roboto 2 | Apache-2.0; not the site's differently licensed Roboto 3 download | [Notices](skills/dazzler-frontend/assets/fonts/roboto/) |
| Terminal Grotesque / Open | OFL-1.1 in each font's embedded full license | [Notices](skills/dazzler-frontend/assets/fonts/terminal-grotesque-open/) |
| TeX Gyre Heros | GUST Font License 1.0 / LPPL-1.3c-or-later; includes complete upstream archive and manifest | [Notices](skills/dazzler-frontend/assets/fonts/tex-gyre-heros/) |
| Work Sans | OFL-1.1 | [Notices](skills/dazzler-frontend/assets/fonts/work-sans/) |
| Young Serif | OFL-1.1 | [Notices](skills/dazzler-frontend/assets/fonts/young-serif/) |

OFL fonts must keep their licenses and notices, may not be sold by themselves, and may require a different font name for modified versions when Reserved Font Names apply. The precise per-font notice controls. Do not assume the Apache license at the root overrides these terms.

Aileron's author page and embedded copyright field say No Rights Reserved; the included standard CC0 text was obtained from the SPDX license-text mirror to preserve the directory's designation. It is not a new grant from us.

Terminal Grotesque's GitHub `LICENSE.md` has an unrelated Blackout header. It is retained without alteration as upstream material, but the applicable Terminal Grotesque notice and full OFL are embedded in **both actual binaries** and are also preserved in `*-EMBEDDED-LICENSE.txt`. No font rights are inferred from the unrelated header.

**Excluded:** Nimbus Sans L is cataloged, but no binary is distributed here. The checked Font Library archive includes GPLv2 and a document exception, and refers to corresponding PfaEdit source files elsewhere. Those sources were not verified. The catalog therefore requires exact-release/source review before redistribution; a user approval does not replace those requirements.

## Original graphics and optional runtimes

The 12 icons and three illustrations in `skills/dazzler-frontend/assets/graphics` are original Dazzler SVG artwork, copyright 2026 Jon Gosier, under Apache-2.0. Their catalog records file hashes and usage guidance. Playwright/Chromium, python-docx and python-pptx are optional host-provided runtimes, not vendored into these packages. Their respective licenses apply to any separately installed copies.

## Original template library

The 30 document/interface templates and their demo code are original Dazzler material by Jon Gosier, distributed under Apache-2.0. Bundled Work Sans and Young Serif files are unmodified copies of the existing licensed catalog exports with their source/copyright/license notices. DOCX files reference Arial or Georgia; those desktop fonts are not redistributed.

## Visualization runtimes

Vega 6.4.0 and Vega-Lite 6.4.3 (BSD-3-Clause; UW Interactive Data Lab and contributors), selected D3 modules (ISC; Mike Bostock and contributors), Microcharts 0.19.1 (MIT), and React/React DOM 19.2.4 (MIT) support the offline adapters. All 58 constituent package notices and exact versions are retained in `skills/dazzler-frontend/scripts/vendor/viz/licenses/` and `provenance.json`. Transitive license labels include MIT, BSD-3-Clause, ISC and Unlicense. These components retain their original terms; they are not relicensed as Apache-2.0.

The optional R adapter calls externally installed mschart and officer; these packages are not redistributed. Credit David Gohel, ArData and contributors. Resource discovery credits bkrsln/dataviz; no source, artwork or guide text was imported from that directory or its linked collections.
