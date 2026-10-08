<p align="center"><img src="docs/assets/dazzler-banner.svg" alt="Dazzler — Give your ideas a visual voice" width="100%"></p>

# Dazzler

[![Dazzler on AI Agents Listing](https://aiagentslisting.com/dazzler/badge.svg?claim=28bc33cf9f063439d153fdbb037a7dcc)](https://aiagentslisting.com/mcp/dazzler)

**Turn a brief into a coherent, polished design.** Dazzler gives your AI agent practical tools for typography, color, layout, charts and print. Ask for the result you want; it chooses the details, builds the artifact and checks what it can render.

```text
Use $dazzler-frontend to redesign this dashboard so the important numbers stand out.
```

[Explore the field manual](https://jongos.github.io/Dazzler/) · [Try the live templates](https://jongos.github.io/Dazzler/templates/) · [Choose your platform](platforms/README.md)

![A 30-second guided tour of the Dazzler field guide](docs/assets/dazzler-walkthrough.gif)

*A guided walkthrough of the brief builder and worked examples, not a timed AI-generation recording.*

## Why use Dazzler?

| What you need | What Dazzler does |
|---|---|
| A design that fits the brief | Chooses expressive or restrained typography, colors and composition for the audience. |
| Consistency across a project | Resumes saved design decisions and preserves your existing brand and components. |
| Clear charts and reports | Carries shared colors and type into visualizations, documents and slides without changing the data. |
| Documents with visual character | Automatically composes background panels, editorial layouts, selective emphasis and useful callouts to fit the brief. |
| Copy that fits the design | Removes empty phrasing while preserving voice, facts and useful emphasis. Good design takes priority over rigid writing rules. |
| Consistent heading case | Audits saved headings across documents and pages, including work authored through other tools; reports coverage gaps. |
| A useful starting point | Includes 30 worked templates with fictional data, editable structures and local assets. |
| More directions to explore | Retrieves a small, varied shortlist from 1,000 adaptable recipes across five project contexts. Brand rules win; the agent still builds and checks the actual design. |
| Fewer finishing problems | Checks rendered layouts, font loading, keyboard controls and relevant print pages when those tools are available. |
| Control when you want it | Responds to “bolder,” “quieter,” “typeset,” “colorize” and other focused refinements. |

No design questionnaire is required. Fonts, colors and layout are automatic; your instructions and brand constraints take precedence.

Recipes are text-screened ideas, not finished templates or proof of beauty. Agents load details only when needed through the [recipe workflow](skills/dazzler-frontend/references/design-recipes.md); missing or unsuitable recipes fall back to Dazzler's existing tools.

## Install once

For a compatible local agent, run:

```sh
npx skills add jongos/Dazzler --skill dazzler-frontend
```

Requires Node 22.20+. Select your agent in the installer. This downloads the larger source skill, including the full font catalog. The installer may replace local changes: back them up first. Its optional install telemetry supports directory rankings; set `DISABLE_TELEMETRY=1` to opt out. Listing or ranking is not guaranteed. For a pinned, smaller package with rollback, use the method below.


Download the host ZIP, `install_skill.py` and `SHA256SUMS.txt` from the release linked below. With Python 3.10+ available, run this from the download folder for an existing project:

```sh
python install_skill.py install --host codex --scope project --root /absolute/project --version 0.28.1 --archive dazzler-codex.zip --checksums SHA256SUMS.txt
```

Restart or refresh the agent, then ask it to use `$dazzler-frontend`. Add `--dry-run` to inspect an installation first. The installer checks hashes and resource completeness without executing downloaded scripts; updates preserve one previous version and refuse local edits.

Claude, Gemini CLI, Cursor and Copilot have matching packages and [short installation guides](platforms/README.md). Claude Code plugins use `/dazzler:dazzler-frontend`; standalone Claude skills use `/dazzler-frontend`. A portable prompt is available for other chat hosts. A downloaded skill does not install itself into a ChatGPT account.

Every host ZIP is capped at **24 MB compressed and unpacked**, with six versatile font families, all 30 templates and the complete rendering helpers. The larger font catalog remains in the source checkout; missing families are never represented as installed. The compact Claude filename remains an alias of the standard Claude download.

See [installation, updates and rollback](maintenance/ONBOARDING.md) for user-wide installs or an existing manual installation. Local package checks do not guarantee cloud-upload acceptance or account eligibility.

## Start with the outcome

```text
Use $dazzler-frontend to make this restaurant menu colorful and easy to scan.
Use $dazzler-frontend to turn this CSV into a branded revenue report.
Use $dazzler-frontend to improve this landing page while keeping our logo and colors.
```

Browse [19 starter prompts](https://jongos.github.io/Dazzler/starters/), the [composition guide](https://jongos.github.io/Dazzler/composition/) or the [typography specimen](https://jongos.github.io/Dazzler/typography/). Optional design handoff and visual-comp workflows use tools already available to your agent.

## Thirty examples to build on

Ten Word documents, ten editorial HTML documents and ten interactive interfaces show distinct typography, color and layout. Dazzler 0.28.1 adds distinct matter-memo, decision-brief and service-proposal architectures to the document collection, with native reading order and quieter continuation pages. Headings are checked in generated documents and interactive states. Their data is fictional; adapt it to your project. Word previews are actual rendered pages, and interface actions are local demonstrations.

<details>
<summary>View the complete snapshot gallery</summary>

### Editable Word documents

<table>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-professional.html"><img src="docs/templates/previews/docx-professional.jpg" alt="Customer Portal Launch — DOCX snapshot" width="100%"></a><br><strong>Customer Portal Launch</strong> · DOCX</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-legal.html"><img src="docs/templates/previews/docx-legal.jpg" alt="Supplier Exit Review — DOCX snapshot" width="100%"></a><br><strong>Supplier Exit Review</strong> · DOCX</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-business.html"><img src="docs/templates/previews/docx-business.jpg" alt="Customer Onboarding Redesign — DOCX snapshot" width="100%"></a><br><strong>Customer Onboarding Redesign</strong> · DOCX</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-fun.html"><img src="docs/templates/previews/docx-fun.jpg" alt="The Great Game Night — DOCX snapshot" width="100%"></a><br><strong>The Great Game Night</strong> · DOCX</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-family.html"><img src="docs/templates/previews/docx-family.jpg" alt="Our Week at a Glance — DOCX snapshot" width="100%"></a><br><strong>Our Week at a Glance</strong> · DOCX</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-presentation.html"><img src="docs/templates/previews/docx-presentation.jpg" alt="Approve the Onboarding Pilot — DOCX snapshot" width="100%"></a><br><strong>Approve the Onboarding Pilot</strong> · DOCX</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-school.html"><img src="docs/templates/previews/docx-school.jpg" alt="How Light Affects Seedling Growth — DOCX snapshot" width="100%"></a><br><strong>How Light Affects Seedling Growth</strong> · DOCX</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-marketing.html"><img src="docs/templates/previews/docx-marketing.jpg" alt="Make the First Visit Easy — DOCX snapshot" width="100%"></a><br><strong>Make the First Visit Easy</strong> · DOCX</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-restaurant.html"><img src="docs/templates/previews/docx-restaurant.jpg" alt="Juniper Dinner Menu — DOCX snapshot" width="100%"></a><br><strong>Juniper Dinner Menu</strong> · DOCX</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-technical.html"><img src="docs/templates/previews/docx-technical.jpg" alt="Order Status Webhook Delivery — DOCX snapshot" width="100%"></a><br><strong>Order Status Webhook Delivery</strong> · DOCX</td></tr>
</table>

### Editorial HTML documents

<table>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/professional.html"><img src="docs/templates/previews/html-professional.jpg" alt="Customer Portal Launch — HTML snapshot" width="100%"></a><br><strong>Customer Portal Launch</strong> · HTML</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/legal.html"><img src="docs/templates/previews/html-legal.jpg" alt="Supplier Exit Review — HTML snapshot" width="100%"></a><br><strong>Supplier Exit Review</strong> · HTML</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/business.html"><img src="docs/templates/previews/html-business.jpg" alt="Customer Onboarding Redesign — HTML snapshot" width="100%"></a><br><strong>Customer Onboarding Redesign</strong> · HTML</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/fun.html"><img src="docs/templates/previews/html-fun.jpg" alt="The Great Game Night — HTML snapshot" width="100%"></a><br><strong>The Great Game Night</strong> · HTML</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/family.html"><img src="docs/templates/previews/html-family.jpg" alt="Our Week at a Glance — HTML snapshot" width="100%"></a><br><strong>Our Week at a Glance</strong> · HTML</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/presentation.html"><img src="docs/templates/previews/html-presentation.jpg" alt="Approve the Onboarding Pilot — HTML snapshot" width="100%"></a><br><strong>Approve the Onboarding Pilot</strong> · HTML</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/school.html"><img src="docs/templates/previews/html-school.jpg" alt="How Light Affects Seedling Growth — HTML snapshot" width="100%"></a><br><strong>How Light Affects Seedling Growth</strong> · HTML</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/marketing.html"><img src="docs/templates/previews/html-marketing.jpg" alt="Make the First Visit Easy — HTML snapshot" width="100%"></a><br><strong>Make the First Visit Easy</strong> · HTML</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/restaurant.html"><img src="docs/templates/previews/html-restaurant.jpg" alt="Juniper Dinner Menu — HTML snapshot" width="100%"></a><br><strong>Juniper Dinner Menu</strong> · HTML</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/technical.html"><img src="docs/templates/previews/html-technical.jpg" alt="Order Status Webhook Delivery — HTML snapshot" width="100%"></a><br><strong>Order Status Webhook Delivery</strong> · HTML</td></tr>
</table>

### Interactive interfaces

<table>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/webapp-workspace/index.html"><img src="docs/templates/previews/webapp-workspace.jpg" alt="Projects Overview — UI snapshot" width="100%"></a><br><strong>Projects Overview</strong> · UI</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/webapp-board/index.html"><img src="docs/templates/previews/webapp-board.jpg" alt="Onboarding Sprint — UI snapshot" width="100%"></a><br><strong>Onboarding Sprint</strong> · UI</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/webapp-settings/index.html"><img src="docs/templates/previews/webapp-settings.jpg" alt="Profile &amp; Preferences — UI snapshot" width="100%"></a><br><strong>Profile &amp; Preferences</strong> · UI</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/data-revenue/index.html"><img src="docs/templates/previews/data-revenue.jpg" alt="Revenue Performance — UI snapshot" width="100%"></a><br><strong>Revenue Performance</strong> · UI</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/data-operations/index.html"><img src="docs/templates/previews/data-operations.jpg" alt="Support Command Desk — UI snapshot" width="100%"></a><br><strong>Support Command Desk</strong> · UI</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/restaurant-fine-dining/index.html"><img src="docs/templates/previews/restaurant-fine-dining.jpg" alt="The Season, at the Table. — UI snapshot" width="100%"></a><br><strong>The Season, at the Table.</strong> · UI</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/restaurant-cafe/index.html"><img src="docs/templates/previews/restaurant-cafe.jpg" alt="Your Usual, or Something New. — UI snapshot" width="100%"></a><br><strong>Your Usual, or Something New.</strong> · UI</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/restaurant-reservations/index.html"><img src="docs/templates/previews/restaurant-reservations.jpg" alt="Make an Evening of It. — UI snapshot" width="100%"></a><br><strong>Make an Evening of It.</strong> · UI</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/restaurant-menu/index.html"><img src="docs/templates/previews/restaurant-menu.jpg" alt="Good Food. Your Kind of Lunch. — UI snapshot" width="100%"></a><br><strong>Good Food. Your Kind of Lunch.</strong> · UI</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/business-portal/index.html"><img src="docs/templates/previews/business-portal.jpg" alt="Alder Studio / Brand &amp; Website — UI snapshot" width="100%"></a><br><strong>Alder Studio / Brand &amp; Website</strong> · UI</td></tr>
</table>

</details>

## What runs locally

The core helpers use Python and Node.js with bundled resources: no API keys, npm install or network service is required. Browser review needs an available browser runtime; native Word and PowerPoint exports need their existing Python libraries. Dazzler reports unavailable checks instead of claiming they passed. Contrast reports cover measured pairs, not complete accessibility certification.

Developers can start with [the tools guide](tools/README.md). Release validation covers tests, extracted archives, resource hashes and reproducibility across Windows/Linux and Node 20/22. The Windows offline build kit is a separate maintainer download, not a skill-upload package.

## Feedback

Send ideas, feature requests and feedback to **Jon Gosier at [jon@filmhedge.com](mailto:jon@filmhedge.com)**.

## Agent Workflow Improvements

Focused audit, layout, adapt, optimize, clarify and extract procedures complement the existing design controls. Task-aware planning selects relevant checks; evidence assessment keeps failures and unrun checks visible. See [agent workflows](skills/dazzler-frontend/references/agent-workflows.md), [frontend engineering](skills/dazzler-frontend/references/frontend-engineering.md) and the [research/change plan](maintenance/DESIGN-CHANGE-PLAN.md). The Legal, Professional and Business document pilots now use task-specific architectures in Word and HTML; the remaining examples retain their existing compositions.

## Notes and credits

Editorial guidance includes an adaptation of Peter Yang's [No AI Slop](https://github.com/petergyang/no-ai-slop), under [MIT](skills/dazzler-frontend/references/editorial-LICENSE.txt). Dazzler's design-first changes and pinned source are recorded in its provenance.

Created by **Jon Gosier** and named after **Dazzler, one of his favorite X-Men characters**. The name celebrates a love of expressive design. This is an independent project, with no affiliation to Disney/Marvel, OpenAI, or Anthropic.

### Attribution

- **Original frontend guidance:** [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates), specifically its [creative-design/frontend-design folder](https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/skills/creative-design/frontend-design). Adapted with its original Apache-2.0 license and [provenance](skills/dazzler-frontend/PROVENANCE.md) retained.
- **De-slop framework:** **Samuel Berthe ([samber](https://github.com/samber))**, from [frontend-design-deslop](https://github.com/samber/cc-skills/tree/f866b800353719270a9ea101a41c5e2a2618d460/skills/frontend-design-deslop). Only that folder’s framework was adapted, not the wider project. MIT notice and [source inventory](skills/dazzler-frontend/references/deslop-provenance.json) remain included.
- **Font discovery and typography:** [Open Foundry](https://open-foundry.com/) and the individual font creators credited in the catalog and bundled notices.
- **Color foundations:** [hue3](https://github.com/ktzzypo938/hue3), [Ankhorage color-theory](https://github.com/ankhorage/color-theory), and [Culori](https://github.com/Evercoder/culori). [bivex’s palette generator](https://github.com/bivex/brand-color-palette-generator) informed preview/export interactions; no code or external service from it is incorporated.

### License

Our original instructions, scripts, catalog annotations, and Dazzler artwork use [Apache License 2.0](LICENSE). **Fonts, upstream support files, adapted framework guidance, palette data, and vendored libraries retain their respective third-party licenses.** See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and adjacent notices. Renaming the project does not change those terms.

### Downloads and maintenance links

[![skills.sh installs](https://skills.sh/b/jongos/dazzler)](https://skills.sh/jongos/dazzler/dazzler-frontend)

The directory listing is live. Its Gen Agent Trust Hub report dated October 2, 2026 shows **Pass / SAFE**, verified October 8. This scanner result is not a blanket security certification or verification of every later release. [Read the audit](https://www.skills.sh/jongos/dazzler/dazzler-frontend/security/agent-trust-hub) and [repair history](https://github.com/jongos/Dazzler/issues/40). See [installation and removal guidance](maintenance/ONBOARDING.md) for the shared-project-directory behavior of the skills CLI.

[Contributor source archive (unpinned main)](https://github.com/jongos/Dazzler/archive/refs/heads/main.zip). Maintainer remote: `git@github.com:jongos/Dazzler.git`.

Visualization credits: Vega/Vega-Lite, D3, Microcharts, React, and the optional mschart/officer runtime; see [third-party notices](THIRD_PARTY_NOTICES.md). Resource discovery: [bkrsln/dataviz](https://github.com/bkrsln/dataviz); no collection content was copied.

- [Browse the live gallery](https://jongos.github.io/Dazzler/templates/)
- [Download the template library](https://github.com/jongos/Dazzler/releases/download/v0.28.1/dazzler-templates.zip)
- [open an issue](https://github.com/jongos/Dazzler/issues)

Interactive illustrations use SVG.js and React/Vue Img Mapper under MIT, with runtime/parser notices retained. [Live examples](https://jongos.github.io/Dazzler/illustrations/).

- [Native Codex ZIP](https://github.com/jongos/Dazzler/releases/download/v0.28.1/dazzler-codex.zip)
- [Compact Claude ZIP](https://github.com/jongos/Dazzler/releases/download/v0.28.1/dazzler-claude-compact.zip)

### Comparison notes

[Where Dazzler fits](docs/COMPARISON.md) separates **verified here**, **documented**, and **not assessed** claims, with primary sources and current limitations. Reviewed September 28, 2026. No popularity or speculative candidate lists are used.
