<p align="center"><img src="docs/assets/dazzler-banner.svg" alt="Dazzler — Give your ideas a visual voice" width="100%"></p>

# Dazzler

[![Dazzler on AI Agents Listing](https://aiagentslisting.com/dazzler/badge.svg?claim=28bc33cf9f063439d153fdbb037a7dcc)](https://aiagentslisting.com/mcp/dazzler)

**Turn a brief into a coherent, polished design.** Dazzler gives your AI agent practical tools for typography, color, layout, charts and print. Ask for the result you want; it chooses the details, builds the artifact and checks what it can render.

Dazzler builds upon [Style Science](https://github.com/jongos/style-science), a design reasoning and mathematical framework for agents and systems.

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
| Better-grounded comparisons | Separates measured constraints from advisory model evidence, detects stale or missing observations and compares declared outcomes without claiming a beauty score. |
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
python install_skill.py install --host codex --scope project --root /absolute/project --version 0.31.1 --archive dazzler-codex.zip --checksums SHA256SUMS.txt
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

**[Explore all 30 live examples](https://jongos.github.io/Dazzler/templates/)**

Ten editable Word documents, ten editorial HTML documents and ten interactive interfaces. Every snapshot below shows a rebuilt artifact with a distinct typographic and color identity. The Word previews show complete pages rendered with LibreOffice; browser previews show full-page compositions.

Fictional scenarios demonstrate a launch decision, a six-year membership story, soil-drainage observations, an evidence review, a recovery runbook, menus and keyboard-selectable seating. Open an example to inspect its data or try its local controls. All actions remain demonstrations; no booking, purchase or account change is submitted.

Dazzler chooses the relevant typography, color, layout, chart and print treatment automatically. Existing brand choices stay in control. Documents retain editable structures; HTML and UI editions include local fonts, chart assets, notices and print styles.

<details>
<summary>View the complete snapshot gallery</summary>

### Editable Word documents

<table>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-professional.html"><img src="docs/templates/previews/docx-professional.jpg" alt="Harbor Exchange Launch Decision — DOCX snapshot" width="100%"></a><br><strong>Harbor Exchange Launch Decision</strong> · DOCX</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-legal.html"><img src="docs/templates/previews/docx-legal.jpg" alt="Orchard Lane Notice Review — DOCX snapshot" width="100%"></a><br><strong>Orchard Lane Notice Review</strong> · DOCX</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-business.html"><img src="docs/templates/previews/docx-business.jpg" alt="Juniper Studio Service Proposal — DOCX snapshot" width="100%"></a><br><strong>Juniper Studio Service Proposal</strong> · DOCX</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-fun.html"><img src="docs/templates/previews/docx-fun.jpg" alt="Night Market on Alder Street — DOCX snapshot" width="100%"></a><br><strong>Night Market on Alder Street</strong> · DOCX</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-family.html"><img src="docs/templates/previews/docx-family.jpg" alt="River House Weekend Plan — DOCX snapshot" width="100%"></a><br><strong>River House Weekend Plan</strong> · DOCX</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-presentation.html"><img src="docs/templates/previews/docx-presentation.jpg" alt="Library After Hours Pilot — DOCX snapshot" width="100%"></a><br><strong>Library After Hours Pilot</strong> · DOCX</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-school.html"><img src="docs/templates/previews/docx-school.jpg" alt="Rain Garden Observation Notebook — DOCX snapshot" width="100%"></a><br><strong>Rain Garden Observation Notebook</strong> · DOCX</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-marketing.html"><img src="docs/templates/previews/docx-marketing.jpg" alt="Second Life Repair Campaign — DOCX snapshot" width="100%"></a><br><strong>Second Life Repair Campaign</strong> · DOCX</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-restaurant.html"><img src="docs/templates/previews/docx-restaurant.jpg" alt="Morrow Seasonal Supper Menu — DOCX snapshot" width="100%"></a><br><strong>Morrow Seasonal Supper Menu</strong> · DOCX</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/docx/preview-technical.html"><img src="docs/templates/previews/docx-technical.jpg" alt="Relay Queue Recovery Runbook — DOCX snapshot" width="100%"></a><br><strong>Relay Queue Recovery Runbook</strong> · DOCX</td></tr>
</table>

### Editorial HTML documents

<table>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/professional.html"><img src="docs/templates/previews/html-professional.jpg" alt="Harbor Exchange Launch Decision — HTML snapshot" width="100%"></a><br><strong>Harbor Exchange Launch Decision</strong> · HTML</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/legal.html"><img src="docs/templates/previews/html-legal.jpg" alt="Orchard Lane Notice Review — HTML snapshot" width="100%"></a><br><strong>Orchard Lane Notice Review</strong> · HTML</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/business.html"><img src="docs/templates/previews/html-business.jpg" alt="Juniper Studio Service Proposal — HTML snapshot" width="100%"></a><br><strong>Juniper Studio Service Proposal</strong> · HTML</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/fun.html"><img src="docs/templates/previews/html-fun.jpg" alt="Night Market on Alder Street — HTML snapshot" width="100%"></a><br><strong>Night Market on Alder Street</strong> · HTML</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/family.html"><img src="docs/templates/previews/html-family.jpg" alt="River House Weekend Plan — HTML snapshot" width="100%"></a><br><strong>River House Weekend Plan</strong> · HTML</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/presentation.html"><img src="docs/templates/previews/html-presentation.jpg" alt="Library After Hours Pilot — HTML snapshot" width="100%"></a><br><strong>Library After Hours Pilot</strong> · HTML</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/school.html"><img src="docs/templates/previews/html-school.jpg" alt="Rain Garden Observation Notebook — HTML snapshot" width="100%"></a><br><strong>Rain Garden Observation Notebook</strong> · HTML</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/marketing.html"><img src="docs/templates/previews/html-marketing.jpg" alt="Second Life Repair Campaign — HTML snapshot" width="100%"></a><br><strong>Second Life Repair Campaign</strong> · HTML</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/restaurant.html"><img src="docs/templates/previews/html-restaurant.jpg" alt="Morrow Seasonal Supper Menu — HTML snapshot" width="100%"></a><br><strong>Morrow Seasonal Supper Menu</strong> · HTML</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/html/technical.html"><img src="docs/templates/previews/html-technical.jpg" alt="Relay Queue Recovery Runbook — HTML snapshot" width="100%"></a><br><strong>Relay Queue Recovery Runbook</strong> · HTML</td></tr>
</table>

### Interactive interfaces

<table>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/webapp-workspace/index.html"><img src="docs/templates/previews/webapp-workspace.jpg" alt="The Author Notebook — UI snapshot" width="100%"></a><br><strong>The Author Notebook</strong> · UI</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/webapp-board/index.html"><img src="docs/templates/previews/webapp-board.jpg" alt="The Release Staircase — UI snapshot" width="100%"></a><br><strong>The Release Staircase</strong> · UI</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/webapp-settings/index.html"><img src="docs/templates/previews/webapp-settings.jpg" alt="The Delivery Switchboard — UI snapshot" width="100%"></a><br><strong>The Delivery Switchboard</strong> · UI</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/data-revenue/index.html"><img src="docs/templates/previews/data-revenue.jpg" alt="The Membership Observatory — UI snapshot" width="100%"></a><br><strong>The Membership Observatory</strong> · UI</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/data-operations/index.html"><img src="docs/templates/previews/data-operations.jpg" alt="The Station Workbench — UI snapshot" width="100%"></a><br><strong>The Station Workbench</strong> · UI</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/restaurant-fine-dining/index.html"><img src="docs/templates/previews/restaurant-fine-dining.jpg" alt="The Garden Invitation — UI snapshot" width="100%"></a><br><strong>The Garden Invitation</strong> · UI</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/restaurant-cafe/index.html"><img src="docs/templates/previews/restaurant-cafe.jpg" alt="The Coffee Counter — UI snapshot" width="100%"></a><br><strong>The Coffee Counter</strong> · UI</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/restaurant-reservations/index.html"><img src="docs/templates/previews/restaurant-reservations.jpg" alt="The Seating Request Desk — UI snapshot" width="100%"></a><br><strong>The Seating Request Desk</strong> · UI</td></tr>
<tr><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/restaurant-menu/index.html"><img src="docs/templates/previews/restaurant-menu.jpg" alt="The Lunch Bulletin — UI snapshot" width="100%"></a><br><strong>The Lunch Bulletin</strong> · UI</td><td width="50%"><a href="https://jongos.github.io/Dazzler/templates/ui/business-portal/index.html"><img src="docs/templates/previews/business-portal.jpg" alt="The Project Review Room — UI snapshot" width="100%"></a><br><strong>The Project Review Room</strong> · UI</td></tr>
</table>

</details>

## What runs locally

The core helpers use Python and Node.js with bundled resources: no API keys, npm install or network service is required. Browser review needs an available browser runtime; native Word and PowerPoint exports need their existing Python libraries. Dazzler reports unavailable checks instead of claiming they passed. Contrast reports cover measured pairs, not complete accessibility certification.

Developers can start with [the tools guide](tools/README.md). Release validation covers tests, extracted archives, resource hashes and reproducibility across Windows/Linux and Node 20/22. The Windows offline build kit is a separate maintainer download, not a skill-upload package.

## Feedback

Send ideas, feature requests and feedback to **Jon Gosier at [jon@filmhedge.com](mailto:jon@filmhedge.com)**.

## Agent Workflow Improvements

Focused audit, layout, adapt, optimize, clarify and extract procedures complement the existing design controls. Task-aware planning selects relevant checks; evidence assessment keeps failures and unrun checks visible. See [agent workflows](skills/dazzler-frontend/references/agent-workflows.md), [frontend engineering](skills/dazzler-frontend/references/frontend-engineering.md) and the [research/change plan](maintenance/DESIGN-CHANGE-PLAN.md). All thirty release examples use newly authored, task-specific compositions with native and browser review evidence.

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
- [Download the template library](https://github.com/jongos/Dazzler/releases/download/v0.31.1/dazzler-templates.zip)
- [open an issue](https://github.com/jongos/Dazzler/issues)

Interactive illustrations use SVG.js and React/Vue Img Mapper under MIT, with runtime/parser notices retained. [Live examples](https://jongos.github.io/Dazzler/illustrations/).

- [Native Codex ZIP](https://github.com/jongos/Dazzler/releases/download/v0.31.1/dazzler-codex.zip)
- [Compact Claude ZIP](https://github.com/jongos/Dazzler/releases/download/v0.31.1/dazzler-claude-compact.zip)

### Comparison notes

[Where Dazzler fits](docs/COMPARISON.md) compared to similar tools and resources out there.

## Dazzler, Style Science and Longshot

**Create with Dazzler. Reason with Style Science. Test with Longshot.**

- [Dazzler](https://github.com/jongos/Dazzler) creates and refines interfaces and visual outputs.
- [Style Science](https://github.com/jongos/style-science) makes design requirements, constraints and supporting evidence inspectable.
- [Longshot](https://github.com/jongos/Longshot) independently walks rendered user tasks, challenges designer assumptions, and reports reproducible flaws and supported strengths.

Carry the task and constraints through the process: create a design, check its declared requirements, then challenge the experience with Longshot. Use findings to guide separately authorized revisions and retest the same task. These are complementary tools, not a mandatory automated pipeline; passing checks or agent walkthroughs does not establish human usability.

[Meet Longshot](https://jongos.github.io/Longshot/) · Skill: `longshot-human-centered-ui`.
