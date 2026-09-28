<p align="center"><img src="docs/assets/dazzler-banner.svg" alt="Dazzler — Give your ideas a visual voice. Typography, color, composition, and craft." width="100%"></p>

<p align="center"><strong>Supercharged Design for A.I.</strong></p>

<p align="center"><a href="https://jongos.github.io/Dazzler/">Read the field manual</a> · <a href="#-start-with-an-idea">Get started</a> · <a href="#-the-design-toolkit">The toolkit</a> · <a href="#-install-dazzler">Install</a> · <a href="mailto:jon@filmhedge.com">Send an idea</a></p>

# Dazzler

**Dazzler gives your frontend a visual voice.** Describe what you want to make and who it’s for. The skill chooses suitable fonts, measured colors, layout, and interactions, then implements and reviews the result using the tools available in your ChatGPT/Codex host.

## ✨ Start with an idea

```text
Use $dazzler-frontend to build a welcoming website for a neighborhood
pottery studio. Help visitors explore classes and book a first session.
```

Dazzler can be used to help design anything: documents, websites, or UI interfaces.

**Already building something?** Dazzler preserves your brand, stack, and explicit constraints. Small edits stay small.

```text
Use $dazzler-frontend to improve this dashboard’s hierarchy and spacing.
Keep our brand colors, React components, and existing behavior.
```

**Want to steer?** Say “make it warmer,” “keep our exact blue,” or “show me two font pairings.” Focused comparisons and controls appear when requested. See the [automatic workflow](skills/dazzler-frontend/references/automatic-workflow.md) and [optional controls](skills/dazzler-frontend/references/design-controls.md).

## 🌈 The design toolkit

| | What Dazzler brings | What it means for your project |
|---|---|---|
| **Aa · Typography** | 25 cataloged families; 24 bundled families containing 124 unmodified font files | Fonts chosen for real characters, styles, technical needs, reading comfort, and personality. |
| **● · Color** | 88 mood palettes, perceptual ramps, semantic light/dark tokens | Contextual choices plus measured contrast for specified role pairs. Brand locks remain exact. |
| **↗ · Composition** | Purpose, audience, hierarchy, grouping, and component craft | A direction informed by the task rather than the same template everywhere. |
| **✓ · Review** | Responsive inspection, relevant interactions, keyboard focus, and honest verification | A clear account of what was checked and what remains unverified. |

### Native Typography

Dazzler checks actual text coverage, required weights and italics, features, and file size before comparing character. It exports selected project-local files with their licenses and CSS. Web work normally requires no desktop font installation.

Browse the [font catalog](skills/dazzler-frontend/references/font-catalog.md), [typography workflow](skills/dazzler-frontend/references/typography.md), or [technical inventory](skills/dazzler-frontend/references/font-catalog.json). 

### Color Suite

The [color workflow](skills/dazzler-frontend/references/color-workflow.md) turns a chosen palette into measured color roles. It generates CSS tokens, provenance, contrast reports, and a portable preview. Conflicting locked colors produce an unresolved report instead of silently changing your brand.

A passing report covers its listed opaque-color pairs. It does **not** certify complete WCAG conformance, image backgrounds, charts, or a finished interface. Those require review in context.

### Design Framework

The adapted [design framework](skills/dazzler-frontend/references/deslop.md) connects purpose to visual decisions, supported by [interface craft](skills/dazzler-frontend/references/interface-craft.md), an optional [design record](skills/dazzler-frontend/references/design-record.md), and a [design audit](skills/dazzler-frontend/references/design-audit.md). It preserves your direction without universal font/color bans or compulsory approvals for aesthetic choices.

## ✦ The Dazzler studio — new in 0.8.0

Ten connected tools extend the automatic workflow. Ask for the outcome; Dazzler selects the relevant tools internally.

| Capability | What is now included |
|---|---|
| Brand import | CSS evidence and conflicts, plus computed browser styles at multiple widths |
| Shared design tokens | Type, spacing, radius, elevation, motion and measured light/dark colors; CSS, DTCG primitives and Tailwind adapters |
| Rendered inspection | Screenshots and reports for overflow, clipping, images, labels, contrast candidates and focus probes |
| Content stress testing | Temporary long-text, large-number, missing-image, empty-data and error scenarios |
| Font pairing lab | Actual-copy specimens, fallback/final geometry, file sizes and local load measurements |
| Chart styling | Categorical, sequential and diverging palettes, labels, patterns, marker/dash cues and graphic contrast |
| Original asset catalog | 12 outline icons and three geometric illustrations with licenses, usage notes and hashes |
| Reversible previews | Before/after screenshots, escaped source diffs, atomic single-file apply/revert and stale-edit protection |
| Documents and slides | Shared-brand HTML editions, optional verified font embedding, and native DOCX/PPTX exporters |
| Cross-platform evaluations | Four repeatable briefs, configurable real-host runner, artifact assertions, hashes and explicit unrun/manual-review states |

Examples: “Match our existing site,” “Stress-test this dashboard,” “Carry this design into a report and slides,” or “Show me the warmer version.”

**[Studio workflow and command reference](skills/dazzler-frontend/references/design-studio.md)**. Browser inspection needs an existing Playwright/Chromium runtime (or equivalent host tools); DOCX/PPTX need existing `python-docx`/`python-pptx`. Core import, tokens, charts, assets, changes and HTML exports stay lightweight. Automated findings require review; no complete accessibility, native pagination, or cross-model design-quality certification is claimed.

## ✦ Thirty templates — the showcase collection

**[Explore all 30 live examples](https://jongos.github.io/Dazzler/templates/)**

Ten editable Word documents, ten editorial HTML documents and ten interactive interfaces. Every snapshot below shows a rebuilt artifact with a distinct typographic and color identity. The Word previews show actual Microsoft Word pages.

Rich fictional scenarios demonstrate reconciled budgets, a 12-month revenue story, experimental observations, evidence review, delivery outcomes, menus and accessible seating exploration. Open an example to inspect its data or try its local controls. All actions remain demonstrations; no booking, purchase or account change is submitted.

Dazzler chooses the relevant typography, color, layout, chart and print treatment automatically. Existing brand choices stay in control. Documents retain editable structures; HTML and UI editions include local fonts, chart assets, notices and print styles.

### Editable Word documents

<table>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-professional.html"><img src="docs/templates/previews/docx-professional.jpg" alt="Customer portal launch — DOCX snapshot" width="100%"></a><br><strong>Customer portal launch</strong> · DOCX</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-legal.html"><img src="docs/templates/previews/docx-legal.jpg" alt="Supplier exit review — DOCX snapshot" width="100%"></a><br><strong>Supplier exit review</strong> · DOCX</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-business.html"><img src="docs/templates/previews/docx-business.jpg" alt="Customer onboarding redesign — DOCX snapshot" width="100%"></a><br><strong>Customer onboarding redesign</strong> · DOCX</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-fun.html"><img src="docs/templates/previews/docx-fun.jpg" alt="The great game night — DOCX snapshot" width="100%"></a><br><strong>The great game night</strong> · DOCX</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-family.html"><img src="docs/templates/previews/docx-family.jpg" alt="Our week at a glance — DOCX snapshot" width="100%"></a><br><strong>Our week at a glance</strong> · DOCX</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-presentation.html"><img src="docs/templates/previews/docx-presentation.jpg" alt="Approve the onboarding pilot — DOCX snapshot" width="100%"></a><br><strong>Approve the onboarding pilot</strong> · DOCX</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-school.html"><img src="docs/templates/previews/docx-school.jpg" alt="How light affects seedling growth — DOCX snapshot" width="100%"></a><br><strong>How light affects seedling growth</strong> · DOCX</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-marketing.html"><img src="docs/templates/previews/docx-marketing.jpg" alt="Make the first visit easy — DOCX snapshot" width="100%"></a><br><strong>Make the first visit easy</strong> · DOCX</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-restaurant.html"><img src="docs/templates/previews/docx-restaurant.jpg" alt="Juniper dinner menu — DOCX snapshot" width="100%"></a><br><strong>Juniper dinner menu</strong> · DOCX</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-technical.html"><img src="docs/templates/previews/docx-technical.jpg" alt="Order status webhook delivery — DOCX snapshot" width="100%"></a><br><strong>Order status webhook delivery</strong> · DOCX</td></tr>
</table>

### Editorial HTML documents

<table>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/professional.html"><img src="docs/templates/previews/html-professional.jpg" alt="Customer portal launch — HTML snapshot" width="100%"></a><br><strong>Customer portal launch</strong> · HTML</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/legal.html"><img src="docs/templates/previews/html-legal.jpg" alt="Supplier exit review — HTML snapshot" width="100%"></a><br><strong>Supplier exit review</strong> · HTML</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/business.html"><img src="docs/templates/previews/html-business.jpg" alt="Customer onboarding redesign — HTML snapshot" width="100%"></a><br><strong>Customer onboarding redesign</strong> · HTML</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/fun.html"><img src="docs/templates/previews/html-fun.jpg" alt="The great game night — HTML snapshot" width="100%"></a><br><strong>The great game night</strong> · HTML</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/family.html"><img src="docs/templates/previews/html-family.jpg" alt="Our week at a glance — HTML snapshot" width="100%"></a><br><strong>Our week at a glance</strong> · HTML</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/presentation.html"><img src="docs/templates/previews/html-presentation.jpg" alt="Approve the onboarding pilot — HTML snapshot" width="100%"></a><br><strong>Approve the onboarding pilot</strong> · HTML</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/school.html"><img src="docs/templates/previews/html-school.jpg" alt="How light affects seedling growth — HTML snapshot" width="100%"></a><br><strong>How light affects seedling growth</strong> · HTML</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/marketing.html"><img src="docs/templates/previews/html-marketing.jpg" alt="Make the first visit easy — HTML snapshot" width="100%"></a><br><strong>Make the first visit easy</strong> · HTML</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/restaurant.html"><img src="docs/templates/previews/html-restaurant.jpg" alt="Juniper dinner menu — HTML snapshot" width="100%"></a><br><strong>Juniper dinner menu</strong> · HTML</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/technical.html"><img src="docs/templates/previews/html-technical.jpg" alt="Order status webhook delivery — HTML snapshot" width="100%"></a><br><strong>Order status webhook delivery</strong> · HTML</td></tr>
</table>

### Interactive interfaces

<table>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/webapp-workspace/index.html"><img src="docs/templates/previews/webapp-workspace.jpg" alt="Projects overview — UI snapshot" width="100%"></a><br><strong>Projects overview</strong> · UI</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/webapp-board/index.html"><img src="docs/templates/previews/webapp-board.jpg" alt="Onboarding sprint — UI snapshot" width="100%"></a><br><strong>Onboarding sprint</strong> · UI</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/webapp-settings/index.html"><img src="docs/templates/previews/webapp-settings.jpg" alt="Profile &amp; preferences — UI snapshot" width="100%"></a><br><strong>Profile &amp; preferences</strong> · UI</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/data-revenue/index.html"><img src="docs/templates/previews/data-revenue.jpg" alt="Revenue performance — UI snapshot" width="100%"></a><br><strong>Revenue performance</strong> · UI</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/data-operations/index.html"><img src="docs/templates/previews/data-operations.jpg" alt="Support command desk — UI snapshot" width="100%"></a><br><strong>Support command desk</strong> · UI</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/restaurant-fine-dining/index.html"><img src="docs/templates/previews/restaurant-fine-dining.jpg" alt="The season, at the table. — UI snapshot" width="100%"></a><br><strong>The season, at the table.</strong> · UI</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/restaurant-cafe/index.html"><img src="docs/templates/previews/restaurant-cafe.jpg" alt="Your usual, or something new. — UI snapshot" width="100%"></a><br><strong>Your usual, or something new.</strong> · UI</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/restaurant-reservations/index.html"><img src="docs/templates/previews/restaurant-reservations.jpg" alt="Make an evening of it. — UI snapshot" width="100%"></a><br><strong>Make an evening of it.</strong> · UI</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/restaurant-menu/index.html"><img src="docs/templates/previews/restaurant-menu.jpg" alt="Good food. Your kind of lunch. — UI snapshot" width="100%"></a><br><strong>Good food. Your kind of lunch.</strong> · UI</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/business-portal/index.html"><img src="docs/templates/previews/business-portal.jpg" alt="Alder Studio / Brand &amp; website — UI snapshot" width="100%"></a><br><strong>Alder Studio / Brand &amp; website</strong> · UI</td></tr>
</table>

## 🚀 Install Dazzler

For a host that supports local Codex skills:

1. Download and extract the Dazzler archive listed in the closing notes.

2. Copy `skills/dazzler-frontend` into `$CODEX_HOME/skills`, or `~/.codex/skills` when `CODEX_HOME` is unset. The default Windows directory is `%USERPROFILE%\.codex\skills`.
3. Start a new chat if your host hasn’t refreshed its skill catalog. Invoke **`$dazzler-frontend`**.

Review an existing installation before replacing it. A maintained checkout can use a directory link to keep the installed skill connected to source.

The plugin identifier is **`dazzler`**, its display name is **Dazzler**, and its skill is **`dazzler-frontend`**. Hosts exposing qualified names may show `dazzler:dazzler-frontend`. The repository includes `.codex-plugin/plugin.json`; plugin import depends on the host. Cloning alone does not install anything into a ChatGPT account.

**Upgrading from ChatGPT Design Skills?** This is the same project, renamed in version 0.6.0. Use the remote listed in the closing notes, install/link the renamed skill folder, and use `$dazzler-frontend` in new prompts. Verify the new installation before retiring duplicate discovery entries. Historical release notes retain their original names.

## 🌍 Other AI platforms

Optional editions are available for **Claude (including Fable), Gemini CLI, Cursor, and GitHub Copilot**, plus a portable prompt for other chat hosts. Each full package shares Dazzler’s licensed fonts, color tools and design guidance.

**[Choose a platform and download →](platforms/README.md)**

Packages are locally validated and aligned with each host’s documented skill format; native host sessions and cloud uploads have not been tested. Fable uses the Claude edition.

## 🛠 Under the hood

Normal use needs no API keys, Claude CLI, Anthropic SDK, MCP server, npm installation, or third-party Python packages. The agent uses available Python 3 and Node.js runtimes internally; Node.js 22+ is recommended for the color helper. When a runtime or preview tool is unavailable, it uses available verified resources and reports the limits. Optional host tools are used only when appropriate; project-specific dependencies still apply.

<details>
<summary><strong>Developer interfaces: fonts, colors, and validation</strong></summary>

These commands support development and inspection. Users do not need to run them to request a design.

```shell
python skills/dazzler-frontend/scripts/fonts.py recommend --role body --mood literary --text "A thoughtful introduction"
python skills/dazzler-frontend/scripts/fonts.py export work-sans --dest ./public/fonts --file "WorkSans[wght].ttf"
node skills/dazzler-frontend/scripts/colors.mjs recommend --mood "cozy minimal"
node skills/dazzler-frontend/scripts/colors.mjs generate --base '#7048E8' --harmony splitComplementary --out ./palette-review
python -m unittest discover -s tests -p "test_*.py"
node --test tests/colors.test.mjs
```

Font export preserves notices and makes project-local copies; it never installs OS fonts. Rankings are shortlist heuristics, not aesthetic verdicts. Color export requires a new destination and includes notices; evaluate the actual project with its selected typography.

Maintainers rebuild the color engine with exact versions in `package-lock.json`. Binary font inspection uses `requirements-dev.txt`; those maintenance dependencies do not belong in every designed project. See [tools](tools/README.md).

</details>

Completed agent-driven maintenance includes validation, a commit, and a push, as documented in [AGENTS.md](AGENTS.md) and [MAINTENANCE.md](skills/dazzler-frontend/MAINTENANCE.md). 

## 💌 Feedback, feature requests & ideas

Have an idea for what Dazzler should do next? Contact **Jon Gosier at [jon@filmhedge.com](mailto:jon@filmhedge.com)** or open an issue.

### Templates with context

The 0.10.0 library replaces generic outlines with 30 worked starting points: priced proposals, evidence-led memos, full-week planners, course-based menus, technical RFCs and purpose-specific interfaces. Dashboard totals reconcile; café orders have quantities; booking requests respect service days; client portals support deliverable review. Every example is fictional and must be adapted to the actual project. [See the per-template review](docs/template-review-0.10.0.md).

### Charts that share your design system

Dazzler renders standard charts, network/hierarchy/map layouts, compact React trends, and optional editable Word/PowerPoint charts. The skill selects the route and retains source data, labels, colors and provenance. [Visualization reference](skills/dazzler-frontend/references/visualization.md). Native Office requires an available R runtime; it was not executed on the maintenance host.

### Illustrations you can explore

Clickable vector regions and image hotspots now come with responsive layouts, keyboard/touch selection, detail panels and readable text alternatives. Dazzler chooses the route from the artwork and existing framework. [Interaction reference](skills/dazzler-frontend/references/interactive-illustrations.md).

Routine design helpers run from local bundled resources. Standalone image interactions use a lightweight browser-native adapter; existing framework integrations remain available. The release includes an integrity checker and automatic routing guidance. Optional native Office and browser tools use existing host runtimes.

## Notes and credits

Created by **Jon Gosier** and named after **Dazzler, one of his favorite X-Men characters**. The name celebrates a love of expressive design. This is an independent project, with no affiliation to Disney/Marvel, OpenAI, or Anthropic.

### Attribution

- **Original frontend guidance:** [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates), specifically its [creative-design/frontend-design folder](https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/skills/creative-design/frontend-design). Adapted with its original Apache-2.0 license and [provenance](skills/dazzler-frontend/PROVENANCE.md) retained.
- **De-slop framework:** **Samuel Berthe ([samber](https://github.com/samber))**, from [frontend-design-deslop](https://github.com/samber/cc-skills/tree/f866b800353719270a9ea101a41c5e2a2618d460/skills/frontend-design-deslop). Only that folder’s framework was adapted, not the wider project. MIT notice and [source inventory](skills/dazzler-frontend/references/deslop-provenance.json) remain included.
- **Font discovery and typography:** [Open Foundry](https://open-foundry.com/) and the individual font creators credited in the catalog and bundled notices.
- **Color foundations:** [hue3](https://github.com/ktzzypo938/hue3), [Ankhorage color-theory](https://github.com/ankhorage/color-theory), and [Culori](https://github.com/Evercoder/culori). [bivex’s palette generator](https://github.com/bivex/brand-color-palette-generator) informed preview/export interactions; no code or external service from it is incorporated.

### License

Our original instructions, scripts, catalog annotations, and Dazzler artwork use [Apache License 2.0](LICENSE). **Fonts, upstream support files, adapted framework guidance, palette data, and vendored libraries retain their respective third-party licenses.** See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and adjacent notices. Renaming the project does not change those terms.

### Downloads and maintenance links

[Source archive](https://github.com/jongos/Dazzler/archive/refs/heads/main.zip). Maintainer remote: `git@github.com:jongos/Dazzler.git`.

Visualization credits: Vega/Vega-Lite, D3, Microcharts, React, and the optional mschart/officer runtime; see [third-party notices](THIRD_PARTY_NOTICES.md). Resource discovery: [bkrsln/dataviz](https://github.com/bkrsln/dataviz); no collection content was copied.

- [Browse the live gallery](https://jongos.github.io/Dazzler/templates/)
- [Download the template library](https://github.com/jongos/Dazzler/releases/download/v0.14.0/dazzler-templates.zip)
- [open an issue](https://github.com/jongos/Dazzler/issues)

Interactive illustrations use SVG.js and React/Vue Img Mapper under MIT, with runtime/parser notices retained. [Live examples](https://jongos.github.io/Dazzler/illustrations/).
