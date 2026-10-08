# Developer change notes

## 2026-10-08 — 0.29.0: Reproducible Recipes and a New Gallery

**Changed:** Re-imported the byte-identical recipe payload from the public source commit and retained customer-confirmed permission qualifications. Re-authored the full gallery from task-specific briefs with current Dazzler guidance. Earlier maintenance fixes remain in commit 96665da.

**Added:** New gallery prompts, native and browser renders, comparative review evidence, and public source provenance.

**Why:** Resolve the publication boundary without changing the retained study or treating model votes as aesthetic evidence; demonstrate the current skill through newly authored work.

**Validation:** 101 Node tests passed; 83 Python tests completed with one skip. All 30 gallery records passed freshness validation; ten native Word documents rendered as ten pages, and twenty browser examples passed desktop/mobile overflow, axe and applicable interaction checks. Field-guide/gallery checks, 121 browser font loads, pinned GDC validation under optimized Python, integrity, links, formatting and all ten platform archives passed. Skill bundles are approximately 13.4 MB compressed / 23 MB unpacked. Actual authenticated host installation and implicit triggering remain separate open verification tasks. Recipe permission is customer-confirmed, not independently verified. Git push does not publish release assets or update an installed skill.

## 2026-10-08 — Audit Status and Issue Reconciliation

**Changed:** README and onboarding now identify the October 2 Gen Agent Trust Hub Pass / SAFE report, verified October 8, instead of presenting the older failure as current. Historical reports are preserved.

**Added:** Focused follow-up tracking for authenticated Claude upload verification and optional controlled demos. Implicit-trigger evaluation remains open without repeating completed implementation work.

**Why:** Separate completed fixes from external verification and optional promotional work. A dated audit is not certification of all releases.

**Validation:** Checked the published audit and existing issue evidence, confirmed shipped branding and package guards, and checked local documentation links and diff whitespace. No release or installed skill change.

## 2026-10-08 — Provenance and CI Maintenance (#41–44)

**Changed:** GDC imports now read the recorded Git commit blobs rather than checkout line endings, with explicit per-file and metadata errors even under optimized Python. Personal-path scanning covers tracked UTF-8 text; maintenance paths and historical publication wording are corrected. Recipe documentation identifies the unpublished source honestly, and imports require clean committed inputs.

**Added:** Pinned upstream GDC verification and font, chart, hotspot, native, signature and palette browser checks in CI, with a browser timeout. Focused provenance/path regression tests and a recipe release blocker prevent shipping the current unpublished source or pending terms review. Color-preview QA is explicitly manual.

**Why:** Make source claims reproducible, catch user-facing regressions, and prevent machine-specific details or unpublished provenance from silently entering another release. The GDC JSON changes normalize bytes only; no verifier behavior or template design changed.

**Validation:** 101 Node tests and the expanded browser sequence passed locally; all 121 bundled font files loaded. Four new regression cases passed, pinned GDC validation passed with python -O, and the 1,699-file runtime inventory passed. All 83 Python cases completed successfully (one optional skip), and local links passed across 228 documents. Local test packages built, but platform validation also correctly stops at the source-release gate; no package approval is claimed. Release validation intentionally blocks on #41 until Style-Science #20 publishes the dataset and #11 resolves output terms. No new release, upstream research import, installation change or GitHub issue closure is included.

## 2026-10-08 — AI Agents Listing Ownership Badge

**Changed:** Display the AI Agents Listing badge below the README title.

**Added:** The listing-provided claim badge and link to Dazzler's directory page.

**Why:** Allow the directory to verify repository control for the owner's listing claim.

**Validation:** Matched the badge Markdown to the live claim page; checked the complete diff and whitespace. The existing gallery evidence validator passes for all 30 examples. This documentation-only update does not change the skill, runtime, packaging or gallery.

## 2026-10-07 — 0.28.1: Preserve Dependency Pins During Release Bumps

**Changed:** Restore React DOM's scheduler requirement and scheduler 0.27.0 tarball from the last published lockfile. Only Dazzler's own version fields move to 0.28.1. The pushed 0.28.0 tag is preserved and its failed release remains unpublished.

**Added:** A regression check comparing installed React DOM/scheduler versions and dependency requirements with the lockfile.

**Why:** A broad earlier version replacement changed dependency metadata without changing its checksum. Cached local dependencies concealed the error; clean GitHub installs correctly rejected it. No dependency upgrade is intended.

**Validation:** Clean dependency installation passed in an isolated folder; all 79 Python tests ran with one optional skip and no failures. Formatting and release metadata checks passed. Runtime design files and inspected gallery renders are unchanged by this maintenance correction; platform archives and the offline kit are rebuilt for 0.28.1.

## 2026-10-07 — 0.28.0: Recipe Starting Points

**Changed:** Substantial design work can consider contextual recipes alongside original directions. Brand requirements, existing systems and Dazzler's design and delivery rules remain authoritative.

**Added:** A locally hash-recorded, winner-only dataset (source unpublished; see issue #41) with a compact local index, individual recipe lookup, varied brief-based shortlists and internal derivation records. Data and helper ship through existing platform packages without new runtime dependencies. Focused loading, filtering, fallback, evidence and cross-context tests accompany the integration.

**Why:** Reuse useful color/type/layout relationships without turning a text-only study into a fixed template library or aesthetic score. Source agreement only breaks otherwise equal choices; adapted designs need their own rendered checks.

**Validation:** See `maintenance/reports/recipes-028.md` for test, browser and package results. After publication approval, all 30 gallery artifacts were regenerated and visually reviewed with the current runtime. The release gallery gate passes. The source study was not expanded. No rejected recipes, credentials or network inference are included.

## 2026-10-07 — 0.28.0: Restore Color Range to the Collection

**Changed:** Rebuilt the 30 examples with independently selected vivid, dark, white and neutral directions. Palette exploration now supplies compatible roles to the gallery authoring pipeline. Native Word ink is checked against page and cell fills; the proposal uses a side-by-side scope and fee ledger.

**Added:** Reproducible color and font selection records, an advisory collection-color helper, regression coverage for pale palettes with different hues, and refreshed complete-page/mobile previews. Gallery assembly now runs theme tokenization before hashing, so rebuilding preserves editable color contracts without a manual repair step.

**Why:** Fixed pale-paper/dark-accent pairs bypassed the palette engine and made unrelated templates look like one house style. A successful contrast or provenance check did not establish collection-wide visual range.

**Validation:** Rendered review and package results are recorded in maintenance/gallery-production/v0.28.0/REVIEW.md. All 40 browser captures remained byte-identical after final CSS tokenization; the CSS contract regression check is retained.

## 2026-10-07 — Preserve Vendored Provenance Across Checkouts

**Changed:** Preserve exact bytes for vendored design-check inputs in Git and platform archives.

**Added:** Extracted-package provenance validation.

**Why:** Fresh CI checkouts normalized source line endings and invalidated the recorded source hash, although the local files passed.

**Validation:** The provenance regression passes locally; refreshed checkout checks run on Windows and Linux before publication.

## 2026-10-07 — 0.27.0: Rebuild the Complete Demonstration Gallery

**Changed:** Replaced all 30 legacy examples with newly authored Word, HTML and interface compositions. Half the Word collection uses deliberate colored page surfaces; native text and tables remain editable. Gallery thumbnails show complete compositions. The README and field guide now describe the new scenarios and correctly identify LibreOffice as the Word preview renderer.

**Added:** Fresh synthetic briefs, full desktop/mobile captures, per-example visual review and previous-release comparisons. The local export gets a working return page. The authoring pipeline preserves theme contracts when rerun, and browser checks cover the new controls, heading case and accessible reflow.

**Why:** The old fixed builder and viewport crops concealed the newer art-direction capabilities. Recoloring those artifacts could not demonstrate a different composition. The replacement collection organizes each example around its reader's task.

**Validation:** All 30 examples were visually inspected, including all ten rendered Word pages and desktop/mobile browser layouts. Repairs addressed title-rule inheritance, table crowding, proposal overflow, date spacing, clock fit and chart-label contrast. Regression and provenance results are recorded in `maintenance/gallery-production/v0.27.0/REVIEW.md`. Release checks passed: 99 Node tests, 70 Python tests (one optional skip), ten extracted platform/template archives, browser checks and all 30 gallery provenance entries. The offline kit now includes gallery briefs and prior-release evidence; gallery identity hashes are portable across Windows and Linux line endings.

## 2026-10-07 — 0.27.0: Reader-task scenario regressions

**Changed:** Document direction generation can condition grid, density and reference navigation on the section's reading task. Explicit layout locks still win. All HTML document data tables now receive the labelled keyboard-scroll treatment previously limited to three categories; shared hint CSS replaces duplicate pilot rules.

**Added:** Synthetic reader scenarios evaluated externally in the browser, with seeded local regression coverage for sustained reading, comparison, reference lookup and user overrides. Mixed-document guidance selects structure per section. No hosted runtime dependency or upstream classifier code is included.

**Why:** Independent random axis choices did not account for how readers use content, and keyboard table access depended on category rather than behavior.

**Validation:** 99 Node tests, nine template tests and three architecture tests passed. All 20 rebuilt web templates passed desktop/mobile browser checks; the refreshed 737-file runtime inventory passed. Results and limitations are recorded in `maintenance/JEV-DESIGN-EVALUATION.md`. These changes belong to the current unreleased 0.27.0 development version; no visual-superiority claim or publication is implied.

## 2026-10-07 — 0.27.0: Prompt-led surfaces and gallery provenance

**Changed:** New document guidance selects page surfaces from the prompt, never an assumed white background. The native exporter honors paletteMode, paints the selected full-page background and removes conflicting Word theme-font bindings. Template examples no longer drive automatic design selection. Every shipment requires fresh prompt-generated gallery outputs and visual comparison against peers and the previous release.

**Added:** Optional structural direction exploration with the existing color engine, exact background locks, native Word/PDF proof builder, and a fail-closed release-gallery evidence validator. Reference observations cover Adobe, Envato and DesignCrowd without importing commercial assets.

**Why:** Fixed template constructors and default white paper constrained visible output despite broad available capabilities. Prompt-driven composition and renderer verification must determine the final design.

**Validation:** 89 JavaScript tests and 69 Python tests passed (one optional Python test skipped); ten development packages validated. Six two-page native Word/PDF studies, two editing-stress copies and yellow/dark-blue native-export fixtures were rendered and checked. See maintenance/DOCUMENT-DESIGN-REVIEW.md. The legacy gallery has not completed the new regeneration gate and is not certified for shipment. Color contrast and categorical distance are not aesthetic quality scores.

## 2026-10-07 — 0.27.0 development: Activate art direction and chart storytelling

**Changed:** New designs and substantial restyles now start with a subject-specific visual idea in the skill entrypoint and automatic workflow. Substantial workflow evidence includes a rendered distinction check. The token helper identifies unconfigured font/color defaults as scaffolding rather than a selected identity. Existing small scopes, brand locks and numerical defaults remain compatible.

**Added:** Validated source-anchored annotations and labelled reference lines for single-series bar/line/scatter HTML/SVG charts. Unsupported adapters reject editorial layers rather than silently discard them. Added a reproducible same-content specimen: neutral baseline, field atlas, public campaign and evidence-first dossier, including real bundled fonts, a data-derived coverage graphic and separately composed mobile charts.

**Why:** Optional catalogs were not reliably activated; generic defaults and recipe-based compositions remained easy to deliver. The installed local skill was also a separate stale unmanaged copy. The correction connects an art-direction decision to visible output and its review, rather than counting capabilities or equating numerical checks with taste.

**Validation:** Targeted chart/workflow tests passed. Four specimens passed actual font loading, exact source values, keyboard disclosure, axe and reflow at 1440/390; desktop and mobile captures were visually reviewed. Full-suite and package results are recorded in the activation report. This remains local development; no blind superiority claim or external publication is implied.

## 2026-10-06 — 0.27.0: Content-led templates and scoped agent workflows

**Changed:** Rebuilt Legal, Professional and Business Word/HTML templates around different reader tasks. The memo uses native metadata and quiet record counts, the brief puts its decision before compact measures, and the proposal uses explicit terms and a delivery sequence. Updated typography, table treatment, continuation hierarchy, chart axes, native image descriptions and actual gallery captures. Proposal sections flow under editing rather than forcing a sparse intervening page. Removed the guidance-level quota for decorative treatments and added structure-before-styling and rendered comparison requirements. Retained the other seven document and ten UI compositions.

**Added:** A shared content-preserving architecture transformation, native paragraph roles, regression checks for content and hierarchy, and labelled keyboard-scrollable mobile tables. Also includes the original task-aware workflow/evidence helper and audit, layout, adapt, optimize, clarify and extract procedures from this local development cycle. Audit and critique remain read-only; evidence coverage is not independent verification.

**Why:** The first benchmark found every template unchanged: workflow guidance had not reached the generator. Shared title/metric/callout recipes produced surface variation despite different reading tasks. The fix changes actual artifact structure and preserves an immutable before/after comparison rather than treating test counts or color changes as design quality.

**Validation:** 85 Node tests and 67 Python tests pass, with one symlink-permission skip. All 20 browser templates pass desktop/mobile, axe, font, content and interaction checks, including keyboard scrolling in pilot tables. All ten Word samples render to the expected 20 pages; the six pilot pages were visually inspected against baseline renders made in the same Word environment. All authored content values and baseline Word text tokens are retained. Three combined editing-stress cases were rendered: Legal and Professional retain two pages; Business grows to three and retains a sparse closing page, so heavy edits still require repagination. Formatting, local links and the 707-file runtime inventory pass. All ten fresh ZIPs pass structure/resource checks and extracted-helper smoke tests within the 24 MB limits. The local gallery passes all 30 links and both viewports, and the field guide passes its browser regression suite. Changes are local and unpublished; no blind study or repeated agent-generation benchmark is claimed.

## 2026-10-06 — 0.26.0: Rebuilt working collection

**Changed:** Rebuilt all 30 templates with context-specific title treatments, tinted data tables, deliberate phrase emphasis and focused UI framing. Preserved the reconciled fictional data and existing interactions. Updated the field guide, gallery and host editions. The catalog now follows the package version.

**Added:** Shared editorial profiles, Word heading regression checks and browser checks covering generated headings before and after interactions. The browser bundle embeds the existing local heading rules without a filesystem dependency. Snapshot capture waits for the seating map to load.

**Why:** Make the shipped examples demonstrate the current design-first guidance, including purposeful color and protected Title Case. Correct a school-year mismatch and shorten two chart labels so they remain readable.

**Validation:** All ten Word documents rendered in Microsoft Word to their expected 20 pages and were visually reviewed, together with the 20 browser templates. LibreOffice was unavailable; Word PDF export and PDFium provided the native-document verification. 79 Node tests and 64 Python tests pass (one platform-specific skip). All 20 web templates pass desktop/mobile layout, automated accessibility, heading and interaction checks; the field guide and all 30 gallery links pass. Local links, formatting and the 703-file runtime inventory pass. Host ZIPs remain below 24 MB compressed and unpacked. Browser script budgets allow 12 KB of readable source including the shared casing rules.

## 2026-10-06 — 0.25.1: Focused amplification within the existing design

**Changed:** The bolder workflow now compares a weak section with its neighbors, reuses underused brand elements, strengthens one focal move and quiets competing emphasis. Reviews include adjacent pages or sections and scoped before/after checks. Existing Dazzler rules take precedence.

**Added:** An internal refinement procedure with regression coverage for retained tokens, colors and motion, a concise amplification pass, reviewed-source provenance and its Apache-2.0 license. The listing's inaccessible fork is distinguished from the primary reference actually inspected. Runtime code is Dazzler's own implementation.

**Why:** Fill a composition gap without adding extreme-scale defaults, palette bans, mandatory questions or another skill dependency. Keep the design-first editorial integration from 0.25.0.

**Validation:** 79 Node tests pass, including bolder routing and preservation of explicit type ratios, spacing, fonts, colors and motion. Existing cross-host, heading, license, runtime and package checks remain applicable. The guidance is qualitative; no automated aesthetic-quality claim is made.

## 2026-10-06 — 0.25.0: Design-first editorial craft

**Changed:** Dazzler now reviews newly authored or editable copy for empty phrasing, unsupported praise and inconsistent terminology. User intent, factual integrity, accessibility and the chosen design direction take precedence over writing preferences. Expressive formatting, purposeful fragments, protected wording and author voice remain intact.

**Added:** A concise editorial workflow, eight manual review scenarios, pinned source provenance and the retained MIT notice. All host editions and the portable prompt inherit the guidance without a runtime dependency.

**Why:** Improve the language inside designed artifacts without turning editorial heuristics into rigid bans or flattening the design. Visual-only work preserves supplied wording; critique-only work remains read-only.

**Validation:** 77 Node tests and 64 Python tests pass (one Windows symlink case skipped), including entrypoint size, cross-host routing and retained-license checks. Manual scenarios are provided for observed host evaluation, not claimed as automated editorial-quality passes.

## 2026-10-06 — 0.24.0: Final heading gates and deliberate document design

**Changed:** Every Dazzler document and web workflow now requires a final heading-case check, including custom exporters and other artifact tools. Document design defaults apply throughout the body: purposeful surfaces, editorial layouts, selective emphasis and useful callouts matched to the brief. Reserved styling retains a visual identity; explicit plain requests remain supported.

**Added:** A read-only, standard-library heading auditor for DOCX, PPTX, HTML, Markdown and rendered heading inventories; cross-host workflow tests; concise delivery and document-design guidance.

**Why:** A custom Word exporter bypassed the existing authoring helper. Checking saved headings closes that workflow gap without flattening formatted runs. Clear composition requirements prevent font-and-heading-only styling from being treated as a finished design.

**Validation:** 76 Node tests and 64 Python tests pass (one Windows symlink case skipped). Eight new regressions cover Word inheritance, tables, headers and split runs; nested HTML; slide titles; Markdown metadata; explicit exceptions; CLI outcomes; XML entity rejection; and cross-host delivery gates. Runtime integrity, links, formatting and version checks pass. Semantic coverage remains explicit: custom visual headings and dynamic pages need rendered comparison.

## 2026-09-29 — 0.23.1: Retire a flagged font dependency and constrain CSS import

**Changed:** Removed the complete Gap Sans distribution and catalog entry after a directory audit flagged its attribution domain. No copyright text was edited in retained fonts; the earlier distribution remains unchanged in Git history and earlier releases. The full catalog now bundles 23 families; the compact six-family selection is unchanged. CSS token import omits resource references, executable expressions, markup, controls and escaped declarations, reporting an omission count.

**Added:** Regression coverage for dependency retirement and CSS import with network/process calls blocked, plus concise documentation of enforced input boundaries and their limits.

**Why:** Remove an unnecessary flagged dependency rather than obscure its notices, and narrow the data imported into design proposals. Legitimate local design helpers remain available. Repository repairs do not by themselves clear a third-party audit.

**Validation:** 76 Node tests and 56 Python tests pass (one Windows symlink case skipped). All 121 retained font binaries match their recorded metadata and load in Chromium; the 695-file runtime inventory, local links, version guards and formatting checks pass. Rebuilt package checks and external reassessment are tracked in issue 40; no cleared public verdict is claimed.

## 2026-09-29 — Directory registration and source removal guidance

**Changed:** Corrected source-install removal guidance for shared project skill directories. Agent-specific removal can retain a discoverable copy; named-skill removal without an agent filter removes Dazzler across the current project.

**Added:** Verified skills.sh listing/badge, explicit removal postconditions and a separate audit follow-up in issue 40.

**Why:** Complete issue 20's discovery and lifecycle work without mistaking a successful CLI message for removal or a directory listing for security approval. Explicit host selection remains intentional; the managed installer does not guess which hosts to modify.

**Validation:** One official skills@1.7.0 project install with default telemetry passed the 701-file health check. Reproduced agent-specific retention; removal without an agent filter cleared the directory, lock entry and list result. The wildcard agent option was rejected. Public skill content, repository listing and one-install badge were observed. The audit remains Critical/Fail and is not claimed resolved. Documentation links and release guards pass; no runtime or release package changed.


## 2026-09-28 — 0.23.0: A redesigned field guide and portable distribution

**Changed:** Rebuilt the field guide around an editorial introduction, local prompt builder, searchable 30-example gallery, host setup and concise verification guidance. Source installs are prominent; compact downloads retain integrity checks and rollback.

**Added:** Portable, Claude, Cursor and Gemini manifests; square brand assets; Grok Bot and Gemini extension archives; SwiftUI, Compose and Flutter token proposals with regression fixtures. Release checks now guard onboarding commands and every manifest version.

**Why:** Make the skill easier to understand, discover and install while extending the existing token system to native app projects. Keep external host acceptance separate from local validation.

**Validation:** 76 Node tests and 54 Python tests pass (one Windows symlink case skipped). Guide browser checks cover fonts, axe, keyboard controls, copy denial, prompt injection, three viewports and actual 200% text scaling; all six print pages were inspected. All 30 gallery destinations pass. Portable schema and strict Claude manifests validate; Gemini compact install/discovery/uninstall passes under Node 22. Packages retain 24 MB compressed/unpacked gates and extracted-helper checks. See `maintenance/RELEASE-023.md` for exact host limits and remaining issues; no hosted-upload or controlled model-comparison success is claimed.

## 2026-09-28 — 0.22.0: Smaller packages and safer installation

- **Changed:** All host downloads use the compact profile with six font families, all 30 templates and complete rendering helpers. Both ZIP and unpacked content are capped at 24 MB. The full 24-family source collection is retained. README and platform guides lead with benefits and concise installation steps.
- **Added:** Non-executing installer integrity checks, whole-archive path preflight, bounded metadata reads, malicious-path/no-execution regressions and real package install/update/rollback/removal checks in CI. The compact Claude filename is a byte-identical compatibility alias.
- **Why:** Reduce downloads and staging I/O, avoid running code merely to validate an archive, and remove repeated documentation. Heading protection uses a character mask; installer inventory checks each entry once instead of repeatedly checking its ancestors.
- **Validation:** 72 Node and 51 Python tests passed; one Windows symlink test requires host privileges and is also covered on Linux CI. A dense 7,800-character heading fixture with 100 repeated protected terms fell from 9,731 ms to 22 ms median across five local runs with identical output; this is a stress case, not an end-to-end speed claim. A 547-file inventory took 0.49 seconds versus 1.77 seconds before on the same files, with identical hashes. Dependency audit reported no known advisories. Extracted archives, managed lifecycle tests, browser checks, offline rebuild and reproducible CI gate publication. Live cloud upload and host activation remain unverified.

## 2026-09-28 — 0.21.0 template continuation correction

- **Changed:** Template token exports retain the 4/8/12 responsive grid after their semantic aliases are appended. Heading tokenization keeps accented words intact rather than treating their letters as separate words.
- **Added:** A browser regression that applies a real template contract before measuring all three breakpoints, plus shared accented-name casing fixtures.
- **Why:** A later root-level alias could otherwise override the earlier responsive declarations during retheming.
- **Validation:** The real-template continuation fixture verifies 390/800/1440 widths, alongside existing text, print and saved-record checks. Runtime inventory, platform archives, marketplace pin and offline kit are regenerated together.

## 2026-09-28 — 0.21.0 release documentation correction

- **Changed:** Moved the field manual's notes, credits, download links and footer after all feature chapters.
- **Added:** None.
- **Why:** Later chapters had accumulated after the closing credits; the manual now follows the requested end-of-document attribution convention consistently.
- **Validation:** Local gallery/link checks cover the reordered manual. Runtime and platform archives are unchanged; the matching offline kit includes this documentation correction.

## 2026-09-28 — 0.21.0: Phase 6 design defaults and issue reconciliation

- **Changed:** New schema-3 systems choose context-sensitive tone, protected English heading case, 60ch maximum prose measure and responsive grid tokens. Explicit settings, brand locks and schema-1/2 records retain precedence. DOCX/HTML/UI templates and the field manual adopt the editorial policy; chart and illustration headings preserve data labels and IDs.
- **Added:** Twelve design principles with enforcement boundaries; shared Python/Node heading fixtures; project-local licensed-font import and coverage-based selection; package gates against private/unreviewed fonts; measured danger foregrounds and optional AAA text targets; browser reading-width, heading and target-size review candidates; six behavioral review briefs and a 30-template reconciliation with before/after captures.
- **Why:** Resolve the remaining actionable design ideas while distinguishing design preferences from accessibility requirements and local packaging checks from live-host verification. Correct Claude plugin starter namespaces, explain unmanaged-install/empty-rollback recovery, and ignore project backups without replacing existing ignore rules. No new runtime dependency or upstream source import is required.
- **Validation:** 72 Node and 49 Python tests passed; 20 HTML/UI examples passed responsive, font, interaction and data checks; native Word rendered 20 pages across ten templates with expected pagination. Grid breakpoints, 200% text, saved-system continuation, print fallbacks, bounded browser evidence, six composition fixtures and gallery navigation were checked. Integrity covers 700 files; 124 font binaries and 206 font/support assets passed. Archive, compact-size, offline-rebuild and cross-platform CI checks gate publication. Host upload/invocation, Grok, live Figma and native-app verification remain explicitly limited; see maintenance/phase6/README.md.

## 2026-09-28 — 0.20.0: Optional design handoffs and evidence-based guidance

- **Changed:** Supplied design files now route to a bounded read-only evidence workflow; optional comps route through actual implementation and browser review. Existing project choices remain authoritative. Platform guides, the field manual and website starters explain these conditional paths without adding a default questionnaire.
- **Added:** Figma evidence/mode/conflict mapping guidance, an opt-in raster-comp comparison procedure, a colorful handoff guide linked to existing template demos, a dated capability comparison and a local end-to-end handoff check. Host instructions remain progressively disclosed within package context budgets.
- **Why:** Make adjacent design workflows useful without inventing connector access, treating image proposals as functional interfaces, or promoting untested native/host support. No new runtime dependency or upstream code is imported.
- **Validation:** Existing 69 Node / 45 Python regression suite; local CSS conflict evidence, no automatic locks, raster-wrapper comparison, unchanged source, keyboard form checks and handoff-guide reflow/fonts/assets. Extracted archives, context/license inventories, Windows offline restore and cross-platform CI gate publication. Live Figma, image generation, Grok Bot installation, native-app exports and comparative output quality are not verified; see maintenance/PHASE5-VALIDATION.md.

## 2026-09-28 — 0.19.0 release validation correction

- **Changed:** The cross-runtime default-output fixture normalizes numeric metadata to 12 significant digits while retaining exact comparisons for exported strings. Runtime output is unchanged.
- **Added:** Portable baseline digests derived from the published 0.18.0 implementation, checked with Node 22 and 24; regenerated offline kit.
- **Why:** GitHub's Node 20/22 jobs exposed V8 floating-point diagnostic differences of up to 1.14e-13 against Node 24. These were not design changes; same-runtime old/new outputs remain byte-identical.
- **Validation:** Direct old/new comparisons for all three baseline inputs on Node 22 and 24, plus the composition regressions. Windows/Linux CI and uploaded asset hashes are checked before publishing the draft release.

## 2026-09-28 — 0.19.0: Purpose-based composition and controlled refinement

- **Changed:** Substantial layout work now selects a content contract before styling. Browser inspection separates measured composition candidates from accessibility findings and retains contextual exceptions. Named refinements preserve existing facts, controls, brand tokens and framework; critique is read-only and harden is scoped to UI resilience. Small refinements keep accepted font/color choices. Omitted controls preserve the selected schema’s defaults.
- **Added:** Eight responsive layout archetypes; a versioned five-rule composition registry with numeric evidence and snapshot node IDs; a shared resolver for bolder, quieter, typeset, colorize, polish, harden, critique and distill; optional saved variance/density/motion controls; independent rendered fixtures, comparison captures, reserved routing tasks and eight trigger prompts. Updated the field manual, public composition guide and all platform editions.
- **Why:** Give structure and refinement concrete, reusable support without imposing an aesthetic questionnaire or treating intentional repetition as a defect. Explicit choices win over optional dials, and content preservation matters more than reducing element or candidate counts. Runtime helpers remain internally maintained with no new external dependency. Platform-specific host details now load from a linked reference; archive validation enforces the 8 KB entrypoint and 12 KB reference budgets in every edition.
- **Validation:** 69 Node and 45 Python tests; six rendered composition fixtures with the benign form false-positive documented; two reserved routing tasks; narrow/wide refinement comparisons, reduced-motion and content/control checks; direct v0.18 default/legacy comparison; isolated local behavioral evaluations. Extracted-platform helpers, inventory/license/font checks and the Windows offline rebuild accompany publication. See maintenance/PHASE4-VALIDATION.md for evidence and limits. New implicit-trigger prompts remain unmeasured on live hosts; candidate counts are not a quality score or AI-authorship detector.

## 2026-09-28 — 0.18.0: Persistent systems, fluid typography and compatible themes

- **Changed:** Windows short-path aliases are canonicalized after link checks; shadcn detection reads actual color declarations and refuses mixed/unknown syntax. YAML comment-only values cannot become colors. Substantial design work discovers and continues existing project records before selecting a new direction. Schema 2 provides fluid type, leading, tracking, supported weights and static print values; explicit schema 1 preserves legacy output. HTML/DOCX exports consume typography metrics, and native document borders use the chosen palette. Platform guides and the field manual explain continuity and interchange boundaries.
- **Added:** Bounded read-only record discovery, safe DESIGN.md subset import/export, canonical resume with consistency checks, a development-only pinned conformance linter, Tailwind v3/v4 and static DTCG typography mappings, compatible shadcn light/dark proposals, a public typography specimen, continuation/security regressions and a compiled component/browser fixture. All full helper packages share the additions.
- **Why:** Preserve visual identity between sessions without requiring routine user configuration, make responsive type and print behavior explicit, and adapt to existing component conventions without installing or overwriting them. Unknown source fields remain evidence and exact color conflicts remain unresolved.
- **Validation:** 59 Node and 45 Python tests; pinned external linter; supported static-token round trips; direct legacy comparison against v0.17; fresh-process canonical continuation; Chromium narrow/wide, 200% text and print checks; native Word print review. Platform archives, font/license/integrity, release/link checks and a Windows offline rebuild accompany publication. See maintenance/PHASE3-VALIDATION.md for evidence and limits. Live AI-host triggering, Claude upload acceptance and Grok Bot remain unverified; deterministic fixtures do not establish host behavior.

## 2026-09-28 — 0.17.0: Managed installation and nineteen practical starting points

- **Changed:** Phase 2 onboarding now routes from one short prompt to the appropriate installed helpers and host tools. Platform builds translate starter invocation syntax and include a compact, on-demand reference index. The field manual links a new responsive starter library with local licensed typography. Evaluation reports distinguish observed outcomes, unavailable access and undefined metrics.
- **Added:** Nineteen structured starters across nine categories; an offline starter lookup; a release-only standalone managed installer with explicit host/scope/version selection, dry-run, bounded ZIP checks, extracted health verification, managed-file receipts, conflict refusal, one-version backup, rollback and owned-only uninstall. Added a Claude marketplace pinned to the actual plugin archive hash, a genuine Codex CLI evaluation adapter, isolated third-party CLI review evidence, installation regressions and browser checks. Grok Bot compatibility has an explicit evidence/status page.
- **Why:** Make ordinary design tasks easier to start without requiring users to choose fonts or configuration. Isolated testing proved that the established CLI replaces locally modified installations, justifying a small internally maintained installer. Preserve document/slide object boundaries and distinguish functional package checks from real host discovery.
- **Validation:** 53 Node tests and 41 Python tests passed during implementation, including corrupt hashes, failed health, traversal/link rejection, local-edit refusal, update/rollback/uninstall and trace grading. Starter gallery checks passed at 1440/390/320 pixels with local fonts and keyboard disclosures; the existing 30-card gallery/manual checks passed. Skills CLI 1.7.0 fresh project/user install, reinstall and removal were exercised in isolated roots with telemetry disabled; reinstall removed the sentinel edit as documented. All 60 original Codex baseline/current trials were attempted: each variant yielded 27 unrun, one observed false negative and two observed true negatives, with no observed positive load. Host tool-policy denials/timeouts prevent a valid triggering comparison; no improvement is claimed. Claude and Grok Bot live installation remain unverified. All eight release archives passed extracted-helper, resource and profile checks; the 5,913-file Windows kit restored and rebuilt all engines with Node network APIs blocked, matching the 682-file runtime inventory. CI and public release results are reported separately after push.

## 2026-09-28 — 0.16.0: Safer evidence, focused templates and explicit release profiles

- **Changed:** Repository instructions now require the current operator's active-session publication authority; identities and historical permissions do not transfer. Browser reports omit raw page prose and IDs, bound observations, label imported values as untrusted evidence, constrain navigation and reject unchecked HTTP redirects. CSS imports cap files, bytes and declaration counts. Font tokens use catalog-derived serif/mono/sans fallbacks with explicit overrides and matching Tailwind classification. UI scripts are compiled per layout, removing unrelated renderers and controls while preserving local preview behavior.
- **Added:** A versioned native Codex ZIP with host metadata and install/update/uninstall/checksum instructions; a compact Claude profile with six general font families and all 30 templates, including their licensed local subsets; per-profile version/capability inventories, compressed/unpacked size reports and a 24,000,000-byte compact budget. Full desktop editions remain available. Added hostile-evidence, redirect, fallback, authority and template DOM-reference regressions. Field manual, gallery and platform guides describe the current editions.
- **Why:** Address Phase 1 issues #11–#16 without transferring permission, changing user projects, fetching runtime resources or hiding missing capabilities. History is intentionally preserved: no force push, tag replacement, identity rewrite or old-release deletion is included. Public feedback remains jon@filmhedge.com. Scoped scripts reduce each UI payload from 19.8 KB to roughly 0.3–4.3 KB.
- **Validation:** 53 Node and 36 Python tests passed, plus all 20 HTML/UI templates at desktop/mobile sizes and the 30-card gallery. Browser regressions cover hostile text/IDs, bounded DOM evidence, cross-origin redirects, explicit allowed origins, local-file escape prevention, and actual serif/mono rendering with web fonts blocked. All eight ZIPs passed extracted helper, inventory, license, link and size checks; native skill/plugin validators and source font hashes passed. The compact archive is approximately 11.25 MB compressed / 19.38 MB unpacked; exact byte counts accompany the release. The Windows x64 offline kit is rebuilt with current source and pinned dependencies. Real Claude chat/API upload acceptance and native AI-host behavior remain unverified; issue #13 retains that outstanding host check. Browser boundaries reduce exposure but do not provide an OS sandbox or prompt-injection guarantee. Local asset inventories detect drift, not authenticity.

## 2026-09-28 — 0.15.0: Reviewable, portable maintenance and reusable themes

- **Changed:** Addressed issues #1–#10 with repository-only publishing authority, a 6 KB helper-first skill, per-family font references, consistent CLI help/errors, formatted authored code, version-addressed license files, normalized archive line endings and synchronized release versions. The café label contrast is corrected. All 20 HTML/UI sources now have readable styles and separate semantic token contracts; irrelevant example styles are omitted, and studio can produce a replacement token stylesheet. Font coverage deduplicates text once and binary-searches Unicode ranges. Package builds discard verified temporary staging copies after archiving instead of retaining every expanded platform.
- **Added:** Windows/Linux Node 20/22 CI, browser accessibility checks, release/link/context/license/CLI regressions, token contracts, and a 20-positive/10-negative implicit-trigger suite with baseline/current host-adapter reporting. The Windows x64 offline build ZIP moves to release assets; only its manifest remains tracked. Original notices and source attribution remain intact.
- **Why:** Keep user-project authority separate from maintainer permissions, reduce context and Git growth, expose maintainable customization points, and make releases reproducible and regressions visible.
- **Validation:** 51 Node and 32 Python tests passed, as did formatting, resource/font integrity, release/link checks and extracted platform checks. All 20 browser templates were checked at desktop/mobile widths, including automated accessibility and contextual interactions. All 20 Word-page previews were refreshed. A one-file café retheme passed desktop/mobile accessibility checks. The offline kit restored and rebuilt all three engine groups with Node network APIs blocked and matched the runtime inventory. ZIP entry order, platform metadata and authored line endings are explicitly normalized. Actual AI-host implicit selection remains unmeasured: absent runners report not-run, never pass. Automated accessibility checks do not certify complete accessibility. The offline kit is Windows x64 only; Node/Python and optional browser/Office tools remain prerequisites. CI status is reported separately after push.

## 2026-09-28 — 0.14.0: Thirty expressive, data-rich template demonstrations

- **Changed:** Rebuilt all ten Word documents, ten HTML documents and ten UI examples with context-specific typography, contrasting color roles, selective bold emphasis, italic voice and deliberate print layouts. Skill defaults now apply these treatments automatically when appropriate while preserving brand, readability and user constraints. Template exports carry their relevant datasets, charts and seating-guide assets. The revenue filter correctly selects each of all four quarters from twelve months.
- **Added:** Deterministic, explicitly fictional scenarios with reconciled financial totals, six plant observations, a 1,000-event delivery fixture, detailed operational records and richer restaurant content; twelve locally rendered chart assets; a working native seating-region guide; seven selected font families with five genuine italic companions. Added 30 captured thumbnails, all 20 actual Word-page images, source-hash capture records, a filterable gallery and full snapshot collections in the README and field manual. Added reproducible capture/publication tools and regression checks for dataset arithmetic, export completeness, snapshot freshness and document text-role contrast. All platform downloads and the offline maintenance kit are refreshed.
- **Why:** Make each example demonstrate a useful outcome rather than a generic layout. Data, editorial hierarchy, interaction and print treatment now support the specific decision or activity. The default skill selects relevant capabilities without turning design choices into user setup work. Actual artifact captures make the collection reviewable before download.
- **Validation:** 35 Node tests and 27 Python tests passed. All 20 HTML/UI templates passed 1440px/390px overflow, image/font loading and context-specific interaction checks with external requests blocked, including all revenue quarters and pointer/keyboard seating selection. Microsoft Word rendered the ten DOCX files to their intended 20 pages; the ten HTML document print editions also total 20 pages. Reviewed rendered layouts and corrected spillover pages and inherited Word font overrides. Checked 30 gallery cards, 30 field-manual cards, all four gallery filters and all linked examples/images; the README contains 30 snapshot links. Skill/plugin validators, resource integrity and all six platform archives passed. Word chart figures are static images with companion synthetic data, not editable native Office charts; the optional R adapter remains unrun. These checks do not certify complete accessibility or every AI host's design behavior.

## 2026-09-28 — 0.13.0: Local independence and runtime hardening

- **Changed:** Standalone image guides now use a 3.8 KB original browser-native adapter; existing React/Vue integrations remain available. Chart previews omit the compiler (791,505 to 519,022 bytes, 34% smaller), chart engines load on demand, and category ordering uses a linear lookup. Export directories are resolved outside the installed skill. Added bounded JSON/artwork reads, map geometry limits, restrictive interaction CSP, and readable descriptions when the interaction runtime fails. Corrected single-point map framing.
- **Added:** A complete retained source/build kit for the recorded Windows AMD64 platform, a local integrity inventory and health checker, deterministic routing hints, offline rebuild verification, native rectangle/circle/polygon tests, archive traversal tests and corruption detection. Package installation scripts are disabled by repository defaults. Updated the field guide, four interaction examples and platform packages.
- **Why:** Normal core use must not require original repositories, package registries, CDNs or model services. Maintainable licensed snapshots let Dazzler adopt reviewed upstream changes deliberately. Host Node/Python, browser inspection and optional native Office/document libraries remain explicit prerequisites; the kit does not claim to bundle all operating-system tools or establish a security certification.
- **Validation:** 35 Node and 24 Python tests passed. Four interaction adapters passed offline desktop/mobile, keyboard and touch checks; native geometry, cleanup, CSP rejection and missing-runtime fallback passed. Thirteen chart fixtures and four guide/gallery pages passed browser checks. The retained kit rebuilt all three engine groups with Node network APIs blocked and matched the resource inventory. npm advisory audit reported zero known vulnerabilities on the pinned set. Seven fresh-process samples on the maintenance host measured chart import median 164 to 107 ms and illustration import 127 to 113 ms; studio import varied from 97 to 118 ms, so this is not a blanket speed claim. Skill/plugin validation and extracted platform checks accompany the release. Native R chart execution remains unavailable on this host.

## 2026-09-28 — 0.12.0: Interactive artwork and image hotspots

- **Changed:** Added automatic selection between vector-region and image-hotspot adapters based on artwork and the existing framework. Updated the skill, field guide, public examples and platform packages; implementation credits remain in closing notes.
- **Added:** Validated static SVG import, measured PNG/JPEG dimensions, named regions, responsive image maps, pointer/touch/keyboard activation, selection details, text equivalents, vector zoom/pan/reset, portable integration modules, dependency fragments and 15 retained dependency notices with bundle hashes. Added separate React and Vue browser adapters, geometry/security regression checks and extracted-package export checks.
- **Why:** Turn supplied illustrations into useful explanations without requiring users to pick libraries or configure routine design details. The adapters preserve the application stack and artwork. They do not invent image regions, install frameworks into projects automatically or treat a successful export as completed browser verification.
- **Validation:** Unit and browser checks cover static SVG allowlisting, local paint references, invalid geometry, exact dimensions, escaping, overwrite refusal, license hashes, desktop/mobile layout, actual region clicks, keyboard selection, touch activation and zoom/reset. Review corrected an older Vue component's first-load lifecycle and replaced a text-obscuring SVG highlight with a separate selection outline. Original upstream bundles are unchanged except normal compilation. All 26 Node tests and 21 Python tests passed, along with skill/plugin validators, all six platform archives, extracted interactive exports and four responsive documentation/gallery pages. All three browser adapters passed offline desktop/mobile, pointer, keyboard and touch checks.

## 2026-09-28 — 0.11.1: Keep working guidance focused on the task

- **Changed:** Moved implementation credits, repository links, download/source references and inspiration acknowledgments into closing notes across authored documentation, platform instructions, the font catalog and public guides. Moved font-specific source and distribution details to the catalog's final notes while retaining technical selection data in each family entry. Removed speculative addition lists.
- **Added:** A maintenance convention for closing credits and a clear fine-print footer in generated color previews. Updated the catalog and template-gallery generators so regenerated pages retain the new organization. Refreshed platform downloads with the same instructions.
- **Why:** Keep the main reading experience focused on using Dazzler while retaining discoverable attribution, useful download links and exact license/provenance records. Chart data-source labels, original legal files, dependency identifiers and machine-readable audit metadata remain intact. The separately requested three-project assessment does not install new integrations or add a roadmap to the skill.
- **Validation:** 21 Python tests and 20 Node tests passed. Checked documentation link placement, catalog regeneration, guide/gallery layouts and interactions, skill/plugin structure and all six release archives. Full platform archives render a chart and execute core helpers after extraction. No new infographic dependency was installed or executed; this update does not change the existing native Office verification limitation.

## 2026-09-28 — 0.11.0: Automatic visualization adapters

- **Changed:** Extended automatic chart routing beyond palettes and mockups. The skill now selects Vega/Vega-Lite for seven standard chart types, selected D3 modules for networks/treemaps/maps, Microcharts for compact React trends, or an optional mschart route for native DOCX/PPTX charts. Updated the field guide to Edition 06, platform guides and downloadable packages.
- **Added:** Offline renderer bundles, exact dependency pins, 58 package license notices and output hashes; validated chart data and CSV/table equivalents; real SVG/HTML exports; responsive Vega rendering and scatter pan/zoom; actual Microcharts SSR and branded React source; guarded R export script and explicit native-runtime fallback reports; public rendered examples and adapter documentation. Added visualization unit/browser checks and rendering from extracted platform archives.
- **Why:** Add reproducible, data-driven geometry while preserving Dazzler's automatic design choices, licensed fonts, shared colors and the project's existing stack. Chart-selection references are recorded in the closing notes; no collection content or linked graphics were copied.
- **Validation:** 21 Python tests and 20 Node color/visualization tests passed. Thirteen actual outputs passed Chromium SVG/table/runtime checks at 1440px and 390px, including scatter zoom. Visual review fixed dark-axis contrast, mobile label sizing, categorical ordering, accidental filled line paths, area-stack imputation artifacts and a server-renderer process lifetime issue. Nine dedicated renderer tests cover invalid/missing/duplicate data, native fallback, escaping, overwrite refusal, topology and bundle hashes. Skill/plugin validation and six archive validations passed; full archives render a chart after extraction. Native Office creation remains untested because R is absent; its API was checked against upstream source and the missing-runtime path executed. No claim of native AI-host agent testing or full accessibility certification is made.

## 2026-09-28 — 0.10.0: Templates grounded in their intended use

- **Changed:** Reworked all 30 templates from generic outlines into contextual fictional examples. Documents now include relevant decisions, evidence gaps, payment schedules, weekly logistics, experiment results, campaign budgets, menu descriptions and technical contracts. Each UI has a distinct workflow and suitable information density. Updated the field guide to Edition 05, template selection guidance, gallery and every optional platform package.
- **Added:** Gallery thumbnails and a per-template review; reconciled revenue period/CSV calculations; support queue resolution and response targets; sprint assignee filtering; settings dirty/discard state; café quantity/subtotal controls; restaurant service-day validation; client deliverable review and local approval/revision. Split the authoring source into document, interface, style and interaction modules so categories can evolve independently. Catalog schema 2 records planned document pages and worked-example context.
- **Maintenance follow-up:** Removed the interface generator trailing blank line and BOM; no generated artifact changed. Staged whitespace validation passed.
- **Why:** A reusable template should model the actual task, not merely repeat a title, three cards and a generic table. Contextual examples demonstrate useful content density while the skill replaces every fictional fact with verified project details. Interactions remain explicitly local; no backend services or new runtime dependencies were added.
- **Validation:** All 21 Python tests passed. All 20 HTML/UI templates passed desktop/mobile overflow, font, JavaScript and contextual interaction checks, with visual review of screenshots. All 10 final DOCX files rendered through installed Word into 17 inspected pages. Simple-background text contrast, gallery/guide layouts, skill/plugin validators and six archive validations passed. Review fixed missing assignee options, a body/grid class collision and narrow-screen chart overflow. Bundled LibreOffice was unavailable; Word rendering used fresh working copies after repeated-file automation stalled. Real AI-host model sessions and production services remain untested.

## 2026-09-28 — 0.9.0: Thirty reusable templates

- **Changed:** Added automatic template selection/export to the skill, refreshed the field guide to Edition 04, and included the library in every full platform package. Added a browsable GitHub Pages gallery and a separate template-only download.
- **Added:** Ten editable DOCX files and ten matching HTML documents covering professional, legal, business, fun, family, presentation, school, marketing, restaurant and technical uses. Ten UI folders each contain HTML, CSS and JSON: three webapps, two data dashboards, four restaurant experiences and one business portal. Added a hashed catalog, safe copy helper, original local demo interactions, authoring/gallery build tools and template tests. All original layouts/demo code are Apache-2.0; existing font files retain their licenses.
- **Why:** Give the automatic design workflow practical starting structures without asking users to choose every design detail. Copying preserves required fonts and notices, refuses overwrites, and leaves the installed library intact. DOCX uses referenced desktop fonts; UI data and actions are explicitly illustrative and local.
- **Validation:** 21 Python tests passed, covering resource integrity, category counts, exports, overwrite refusal, Word tables/title styles and JSON consistency alongside existing font/project tests. All 20 HTML/UI templates passed Chromium checks at 1440px and 390px, font loading and applicable search, dialog, board, filter, form, cart and CSV actions. All ten DOCX files were rendered through installed Word to PDF and visually inspected as one-page documents; the bundled LibreOffice renderer was unavailable. All six ZIPs passed integrity checks; five full platform archives passed extracted helper checks. The gallery and guide passed responsive checks, and simple-background text contrast passed across the HTML/UI templates. Skill/plugin validation passed. Other-host agent sessions and arbitrary customized content are not certified by these checks.

## 2026-09-28 — 0.8.0: Integrated design studio

- **Changed:** Connected brand evidence, shared tokens, typography, charts, assets, design review and document output in the automatic skill workflow. Updated the field guide to Edition 03, the README, host guides and all platform packages. Existing brand constraints and host permission controls remain authoritative.
- **Added:** CSS/rendered brand import; complete system generation with CSS, supported DTCG primitives and Tailwind exports; rendered inspection; six content scenarios; a font pairing lab; categorical/sequential/diverging chart styling with non-color cues; 15 original Apache-licensed SVG assets; visual/text change previews with guarded apply/revert; HTML and optional native DOCX/PPTX exports; and four executable cross-platform evaluation briefs with explicit run status and artifact assertions.
- **Why:** Make the ten approved capabilities available through one invocation, using the existing licensed fonts and measured color engine. Optional browser/native libraries use the host runtime; the skill chooses supported paths and does not make users configure every design decision.
- **Validation:** 17 Python and 16 Node tests passed. Chromium checked deliberately flawed inspector fixtures, stress scenarios, actual font loading, responsive HTML documents/slides and field-guide controls. Native DOCX/PPTX content, tables, fonts and continuation structure passed structural checks. All five archives passed resource links, 206 font/support hashes, 15 graphic hashes, engine integrity and extracted helper checks; skill/plugin validation passed. Native office rendering and real Claude/Fable, Gemini, Cursor and Copilot model runs remain unverified. Contrast heuristics and chart checks are scoped measurements, not accessibility certification; prepared evaluation matrices remain not-run until a real runner executes them.

## 2026-09-28 — 0.7.0: Optional editions for other AI hosts

- **Changed:** Versioned the package at 0.7.0 and linked platform downloads from the README. Existing Codex skill behavior is unchanged. Fable is treated as an Anthropic model using the Claude edition, not an invented separate integration.
- **Added:** Claude/Fable, Gemini CLI, Cursor and Copilot adapter folders; complete downloadable skill ZIPs; a Claude Code plugin ZIP; a guidance-only portable prompt; a standard-library builder; checksum manifests; and an archive/resource/extracted-helper validator. Installation guides cite current official documentation and disclose host/account limitations.
- **Why:** Offer practical optional distributions while maintaining fonts, palette resources and design guidance in one canonical source. Exported packages omit Codex-specific routing/UI metadata and owner-specific maintenance/push permissions. All original asset bytes, credits and licenses remain intact.
- **Validation:** All five archives passed structure, local reference, 206 font/support-file hashes, bundled color-engine integrity, and extracted Python/Node helper execution checks. Four generated skill manifests and the existing plugin manifest passed validators. The portable prompt explicitly disclaims native installation, bundled assets and execution. Native Claude/Fable, Gemini CLI, Cursor and Copilot sessions and Claude chat uploads were not available/tested; packaging validity is not an end-to-end compatibility claim. Git staged whitespace validation passed. No design algorithm changes or new behavioral agent evaluation.

## 2026-09-28 — Preserve published font notices

- **Changed:** Excluded original documentation font notices from Git whitespace and line-ending normalization; removed trailing whitespace from embedded HTML comments.
- **Added:** Git attributes for documentation license files.
- **Why:** Preserve upstream license bytes while keeping authored HTML clean; the initial publishing check identified upstream trailing spaces.
- **Validation:** License content retained and staged whitespace checks passed. No rendered content or interaction changes.


## 2026-09-28 — Publish the Dazzler field manual

- **Changed:** Linked the live manual prominently from the README, preserving the owner's latest branding edits. Configured GitHub Pages to publish `main` / `docs` so future committed documentation updates deploy automatically.
- **Added:** The self-contained interactive manual at `docs/index.html`, `.nojekyll`, original font licenses, and documentation publishing guidance. Includes embedded fonts, chapter navigation, copyable prompts, a brief selector, creator story, feedback address, migration guidance, and upstream credits.
- **Why:** Let repository visitors read and use the HTML manual in a browser without downloading files or installing dependencies. This publication is explicitly authorized by the owner; it does not broaden permission to publish unrelated design projects.
- **Validation:** The manual is copied from the previously browser-verified Dazzler edition (desktop and 390/320px layouts, font loading, copying, selector, disclosures, focus and measured accent contrast). Checked copied file integrity and staged whitespace before publishing. Live deployment is verified separately after push; no plugin behavior or version change.

## 2026-09-28 — 0.6.0: Dazzler identity and repository migration

- **Changed:** Renamed the GitHub repository to `jongos/Dazzler`, plugin identifier to `dazzler`, display name to Dazzler, and skill folder/invocation to `dazzler-frontend` / `$dazzler-frontend`. Updated the SSH remote, canonical checkout, installed personal-skill junction, maintenance instructions, package metadata, helper/test paths, links, and byte-preserving Git attributes. Older release notes and upstream source names remain historical records.
- **Added:** Original spectrum SVG README banner, rewritten quick-start/toolkit/install/developer sections, upgrade guidance, Jon Gosier's creator credit and X-Men naming story, and `jon@filmhedge.com` for feedback, feature requests, and ideas (also in plugin author metadata).
- **Why:** Give the project a distinct identity while keeping automatic design behavior, licensed assets, upstream attribution, and the authorized commit/push workflow intact. Consumers must update path-based imports and invoke the renamed skill; use a new chat to refresh discovery. No font binaries, upstream notices, or design algorithms were changed.
- **Validation:** Plugin and skill validators passed. Nine font workflow tests and eleven color tests passed, including all 88 palette seeds. All 124 bundled fonts and 206 asset/support files passed checksum validation, including staged Git bytes. Active local Markdown references were checked and the banner was rendered and visually inspected in Chromium. Git diff whitespace checks passed. The installed junction resolves to the renamed skill. This release checks migration integrity, not a new behavioral evaluation of generated designs.

Each entry accompanies the commit and push containing the described changes.

## 2026-09-28 — 0.5.0: Automatic design orchestration with optional refinement

- **Changed:** Calling `$frontend-design` with a task now explicitly defaults to agent-selected fonts, colors, composition and interactions through implementation and verification. The agent runs existing helpers internally; routine aesthetic uncertainty no longer becomes a question, selector, approval gate or request for the user to run commands. Direct tweaks preserve unrelated choices. Skill/plugin prompts and README lead with this experience.
- **Added:** One automatic workflow connecting brief interpretation, deslop reasoning, font constraints/export, measured color generation, component craft and final review; a separate opt-in refinement guide for focused choices or actual interactive previews; three additional manual behavioral scenarios for automatic use, requested controls and missing runtimes.
- **Why:** Make the existing stack operate as one design capability without adding a duplicate decision engine or runtime dependency. The agent supplies contextual judgment, the helpers supply constraint evidence, and rendering checks the combined result. Brand locks, task scope and necessary external-action permissions remain intact; missing runtimes use available alternatives with explicit verification limits.
- **Validation:** Skill/plugin structure, local links, YAML/JSON/version consistency and staged whitespace checks. Compatibility smoke checks found eligible font families at 400/700 for editorial and numeric-interface samples and passing 44-pair light/dark color systems for cozy/professional directions. These verify helper compatibility, not aesthetic superiority. The 15 manual behavioral cases were reviewed as scenarios, not executed as independent agent evaluations. No font files, upstream algorithms, dependencies or preview code changed.

## 2026-09-28 — 0.4.0: Integrate the design framework

- **Changed:** The skill now connects artifact purpose, audience and existing design constraints to a deliberate direction, semantic tokens, component-state craft and an evidence-based review of the rendered result. Existing fonts, measured-color tools, brand locks, stack choices and project token authority remain in force. Small edits do not acquire a mandatory discovery or documentation cycle.
- **Added:** Four adapted guides covering the framework, durable design records, interface craft and design audits; 12 manual behavioral scenarios; creator credit, the original MIT notice, a pinned source revision and a 22-file source inventory with adaptation mapping. Only `skills/frontend-design-deslop` is integrated; the root license is retained solely as its governing notice. No wider-project features or new runtime dependencies are added.
- **Why:** Make design decisions specific to the task and improve component completeness beyond surface styling. The adaptation avoids blanket bans on fonts/colors, mandatory user approval gates, stale-document overrides and an unexplained numeric taste score. It also corrects upstream focus-outline and modal-focus recommendations and distinguishes WCAG 2.4.13 AAA from AA.
- **Validation:** Skill/plugin structure, local reference links, JSON/version consistency, license hash and staged whitespace checks. Manual instruction review covered brand locks, small edits, existing token authority, read-only screenshot audits and applicable component states. The new behavioral scenarios are not reported as executed agent evaluations. No rendering or executable helper changes were made, so previous browser/helper results were not rerun or claimed for this guidance update.

## 2026-09-28 — 0.3.0: Perceptual color selection and semantic palette validation

- **Changed:** The skill now selects color direction from the brief and existing brand, then measures functional roles instead of assuming a harmonious palette is accessible. Locked colors remain exact; conflicting requirements produce an explicit unresolved report and no CSS/HTML export. Typography and rendered-state review remain part of the workflow.
- **Added:** 88 attributed palette entries; an offline Node helper; a pinned, bundled color engine; OKLCH/gamut-aware generation; light/dark semantic tokens; per-candidate decisions, ramp diagnostics and full-precision contrast reports; portable CSS/JSON/HTML export with original licenses; theme and approximate color-vision previews. Added a reviewed palette importer, reproducible bundle build, behavioral tests and optional Chromium checks. No external color service is used.
- **Why:** Combine useful mood inspiration with deterministic color checks while avoiding upstream three-color mandates, incorrect accessibility heuristics, unsafe white-text choices and a commercial-use-restricted API. Explicit brand seeds override inspiration. Raw brand/accent swatches remain distinct from validated functional colors. MIT resources retain their notices alongside the Apache adapter.
- **Validation:** Eleven color tests and nine existing font tests passed, along with plugin/skill validators. Color checks cover near-threshold contrast, multiple-surface no-match cases, gamut mapping, grayscale/extreme ramp diagnostics, brand preservation, invalid input, portable license export and bundle integrity. All 88 catalog seeds generated light/dark systems passing their 44 listed role-pair checks. Chromium verified both themes, three simulations per theme, visible keyboard focus, the preview action, mobile overflow and zero external requests/page errors. A detected mobile overflow was fixed. These results cover specified opaque-color roles, not complete WCAG conformance or project-specific typography, gradients, alpha or chart differentiation.

## 2026-09-28 — 0.2.0: Typography selection and licensed open-font catalog

- **Changed:** Typography is now an explicit design foundation. The skill chooses a contextual best-fit font when the brief permits it, preserving brand requirements and filtering actual text, styles, features and byte budgets before visual judgment. The root Apache license now explicitly excludes third-party fonts. CSS mappings distinguish named styles from malformed legacy OS/2 metadata.
- **Added:** A crawl-based catalog of all 25 Open Foundry families, technical binary inventory, editorial descriptions, GitHub/source URLs, pinned downloads and hashes, 24 bundled families containing 124 unmodified font files, per-family license/copyright/source notices, and a full upstream archive for TeX Gyre Heros. Added offline recommendation/export tooling that preserves notices, developer crawl/inspection/validation tools, browser-load checks, and guidance for font approval or manual installation. No system fonts are installed.
- **Why:** Give design tasks a practical, reusable typography library while avoiding unsupported site claims, wrong-generation licenses, missing glyphs, fake styles, and font assets silently relicensed under Apache. Nimbus Sans L remains unbundled because its corresponding source-distribution evidence is incomplete. Mirrors and unavailable original repositories are labeled; Poppins, M+ and Roboto directory discrepancies are documented.
- **Validation:** Nine workflow tests passed, covering language/weight/style constraints, no-match behavior, byte/feature filters, license-preserving export, overwrite rejection, excluded-font rejection, and pre-write hash checks. All 124 font binaries and 206 total asset files passed checksum and re-inspected metadata validation. All 124 faces loaded in Chromium without font-load or page errors; desktop/mobile specimen sheets were captured. Plugin and skill validators passed. Browser checks establish loadability, not exhaustive language shaping or suitability for every project; those remain task-specific.

## 2026-09-28 — Link installed skill to source and publish maintenance updates

- **Changed:** Skill maintenance now routes to a canonical GitHub repository and a workflow that finishes authorized updates with a commit, push, and remote SHA verification. The owner's installed skill is linked to the permanent checkout rather than maintained as a separate copy.
- **Added:** Repository agent instructions, a maintenance guide, and this developer changelog. Each future update must document changed behavior, additions, rationale, and validation in the same commit.
- **Why:** Prevent divergence between the installed skill and GitHub and give developers a durable explanation of each published update. Publication applies to plugin maintenance, not client projects created with the skill.
- **Validation:** Plugin and skill structure validators; staged whitespace checks; installed-link target and file identity checks. Remote commit verification is performed after pushing. No background watcher is introduced.

## 2026-09-28 — Initial release, 0.1.0

Historical note for commit `1a84ba1` (recorded with the following maintenance update).

- **Changed:** Adapted the upstream frontend-design instructions for ChatGPT/Codex, preserving explicit brands and existing technology stacks.
- **Added:** Plugin manifest, skill UI metadata, optional host-tool routing, responsive and interaction verification guidance, README source credit, and preserved Apache 2.0 licensing.
- **Why:** Make the original design guidance reusable in the local OpenAI environment without requiring Claude tooling.
- **Validation:** Plugin and skill validators passed; the initial commit was verified against `origin/main`.

## Notes and credits

Version 0.4.0 adapted Samuel Berthe’s frontend-design-deslop framework. Version 0.3.0 used hue3 palette entries, @ankhorage/color-theory 0.3.1 and Culori 4.0.2. Version 0.11.0 credited bkrsln/dataviz for chart-reference discovery. Original notices and pinned provenance remain included.

Version 0.12.0 credits SVG.js 3.2.8, React Img Mapper 2.0.2, Vue Img Mapper 0.1.0, their React/Vue runtimes, and @xmldom/xmldom 0.9.12. See the third-party notice inventory for exact versions and original MIT terms.

## 2026-10-07 — Open Web Composition (0.27.0 Local Development)

**Changed:** New designs default to expressive treatment across industries; older saved policy remains stable on resume. Custom composition purposes are accepted.

**Added:** Optional authored page-composition CSS export with responsive regions, arbitrary proportional columns, deliberate surfaces and preserved design records; autonomous web design guidance grounded in reviewed references.

**Why:** Industry stereotypes and finite layout vocabulary were constraining the agent before it could make a subject-specific design.

**Validation:** Regression tests cover output, bounds, contrast and persistence. Rendered proof and final check results are recorded in the local web design review. This is not a published release or evidence of universal aesthetic superiority.

## 2026-10-07 — Maximum Character Within the Brief (0.27.0 Local Development)

**Changed:** Every Dazzler output now aims for an emphatic prompt-specific voice, including basic professional work; generic output requires revision. Small edits preserve scope and established identity.

**Added:** Research-grounded art-direction principles and structured distinction evidence across all workflow kinds/scopes. Passing claims without an observed design review, or with a generic/incoherent verdict, are rejected.

**Why:** An expressive default alone allowed acceptable-but-interchangeable work to count as finished. Constraints should redirect ambition into the available design dimensions rather than remove ambition.

**Validation:** Workflow regression tests exercise all output kinds, missing evidence, rejected generic passes and read-only behavior. Aesthetic effectiveness still requires rendered outputs and human evaluation; no universal reaction is guaranteed.

## 2026-10-07 — Continuous Palette Mathematics (0.27.0 Local Development)

**Changed:** New-palette guidance defaults to continuous exploration beyond the 88 reference palettes and seven named harmonies. Existing selected palettes and saved systems remain compatible.

**Added:** Original seed-rotated Halton exploration, a 24-step gamut chroma-boundary solve, perceptual farthest-first candidate selection, authored secondary/accent/neutral seeds and chromatic surfaces in the existing color generator; ordinary studio and export integration.

**Why:** Catalog matching, fixed hue offsets and nearly neutral surfaces limited the usable output space. The upstream math is now a foundation for new combinations, not a limit on the design vocabulary.

**Validation:** Regression coverage includes gamut boundaries, replay, separation, persisted studio output, malformed ranges, conflicting locks and honest partial/unresolved results. Mathematical diversity is not proof of aesthetic superiority.

### 2026-10-07 — Color relationship knowledge (local development)

- **Changed:** Active color workflow now connects geometric starting points to perceptual correction and continuous exploration.
- **Added:** Structured relationship formulas, square/rectangle distinction, coordinate-space and accessibility math, with community context separated from technical sources.
- **Why:** Extend the existing framework without forcing preset families or routine base-color questions.
- **Validation:** JSON parsing, reference/size checks and sealed runtime health; unchanged palette runtime retains the tested generation behavior.

### 2026-10-07 — Independent Style Science GDC consumer (0.27.0 local development)

- **Changed:** Browser document/interface workflow now routes to scoped GDC measurement in addition to existing design and delivery gates.
- **Added:** Versioned JavaScript/Python runtime copy, schema, example, provenance hashes and importer from the independent Style Science checkout.
- **Why:** Separate portable executable knowledge from plugin prompts, while retaining native medium semantics and honest unknown outcomes.
- **Validation:** Numerical, missing-evidence and cross-language conformance fixtures; actual browser adapter checks. Human quality benefits remain untested.
