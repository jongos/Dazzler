# ChatGPT Design Skills

A frontend design skill adapted for ChatGPT/Codex environments that support local skills. It guides deliberate typography, color, layout, interface copy, interaction, and visual verification while respecting an existing brand and technology stack.

## Typography and open fonts

Version 0.2.0 adds a [catalog of all 25 Open Foundry families](skills/frontend-design/references/font-catalog.md), checked on September 28, 2026. It includes technical attributes extracted from actual binaries, editorial descriptions, GitHub/source URLs, license evidence and known directory errors. **24 families / 124 unmodified font files are bundled**; Nimbus Sans L is cataloged with manual source/license guidance.

The skill automatically chooses fonts appropriate to the brief while respecting existing brand choices. It checks actual text, required styles and features before visual fit. The [typography guide](skills/frontend-design/references/typography.md) covers pairings, performance, licenses, fallbacks, and desktop installation when needed. An offline helper can recommend candidates and export selected files with their notices and ready-to-use CSS:

```shell
python skills/frontend-design/scripts/fonts.py recommend --role body --mood literary --text "A thoughtful introduction"
python skills/frontend-design/scripts/fonts.py export work-sans --dest ./public/fonts --file "WorkSans[wght].ttf"
```

The helper makes project-local copies, never OS installations. Its ranking is a transparent shortlist heuristic; the agent makes the final contextual choice and checks rendering. See [third-party notices](THIRD_PARTY_NOTICES.md) and the [machine-readable inventory](skills/frontend-design/references/font-catalog.json) for exact versions, sources, hashes, and font-specific terms.

## Color theory and palette tools

Version 0.3.0 adds [88 attributed mood palettes](skills/frontend-design/references/color-palettes.json) and an [offline color workflow](skills/frontend-design/references/color-workflow.md). It combines hue3's curated inspiration with pinned Ankhorage/Culori perceptual generation, sRGB gamut mapping, semantic light/dark tokens, and measured contrast selection. Brand locks remain exact; unresolved constraints produce a report instead of usable CSS.

```shell
node skills/frontend-design/scripts/colors.mjs recommend --mood "cozy minimal"
node skills/frontend-design/scripts/colors.mjs generate --base '#345678' --harmony splitComplementary --out ./palette-review
```

The new output folder contains CSS, a detailed JSON report, a portable HTML preview with theme/color-vision simulation controls, and license notices. The preview uses system fonts; evaluate the actual project with its selected fonts. A passing report covers its listed role pairs, not complete WCAG conformance. Node.js 22+ is recommended; the helper works offline without npm installation. Upstream licenses stay with the catalog and bundled engine.

Credit to [hue3](https://github.com/ktzzypo938/hue3), [Ankhorage color-theory](https://github.com/ankhorage/color-theory), and [Culori](https://github.com/Evercoder/culori) for the reused resources. [bivex's palette generator](https://github.com/bivex/brand-color-palette-generator) informed the preview/export interaction design; no code or external service was incorporated from it.

## Original skill credit

This project adapts the **frontend-design** skill from [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates), specifically [cli-tool/components/skills/creative-design/frontend-design](https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/skills/creative-design/frontend-design). Credit belongs to the original project's authors and contributors for the source design guidance.

The original skill was inspected on September 28, 2026. Its Apache 2.0 license is preserved, and the adapted skill includes a modification notice and [provenance record](skills/frontend-design/PROVENANCE.md). This is an independent adaptation, not an official OpenAI or Anthropic product.

## What changed

- Adapted the workflow for ChatGPT/Codex and the tools available in the host environment.
- Preserved explicit user direction, established brands, and existing project stacks.
- Added optional routing to Sites, visualization, image generation, and browser capabilities.
- Added practical checks for responsive rendering, keyboard access, state handling, and primary interactions.
- Removed assumptions about client history and unnecessary mandatory confirmation.

## Install the standalone skill

Clone this repository, then copy `skills/frontend-design` into your personal Codex skills directory: `$CODEX_HOME/skills`, or `~/.codex/skills` when `CODEX_HOME` is unset. On Windows the default is `%USERPROFILE%\.codex\skills`.

If a skill with that name already exists, review the differences before replacing it. Start a new chat if the host has not refreshed its skill catalog.

The repository also includes `.codex-plugin/plugin.json` for hosts that accept the OpenAI plugin format. Plugin import availability depends on the host; cloning the repository alone does not install it into a ChatGPT account.

## Development and update history

Plugin maintenance follows [AGENTS.md](AGENTS.md) and the [maintenance workflow](skills/frontend-design/MAINTENANCE.md). Completed agent-driven updates include validation, a Git commit, and a push to this repository. Each push includes developer notes in [CHANGELOG.md](CHANGELOG.md) covering what changed, what was added, why, and validation.

For an actively maintained local installation, link the personal skill directory to the checkout's `skills/frontend-design` folder instead of copying it. Preserve any existing installation before creating the link. This keeps the installed instructions and repository source in sync. This workflow does not run a background watcher or push arbitrary file saves.

## Usage examples

For a standalone installation:

```text
Use $frontend-design to create a landing page for a neighborhood ceramics studio.
```

```text
Use $frontend-design to improve this dashboard while preserving its existing brand and React stack.
```

The skill can also be selected automatically for relevant frontend design requests. If installed through a plugin, use the skill name exposed by that host.

## Dependencies

There are no required API keys, Claude tools, MCP servers, or external services. The font helper uses Python 3's standard library; the color helper uses Node.js and its checked-in library bundle. Maintainers rebuild that bundle using the exact versions and integrity entries in `package-lock.json`; ordinary skill use does not need npm. Binary font inspection uses `requirements-dev.txt`. Optional host capabilities are used when available and appropriate; they are not installed automatically. A particular frontend project may have its own dependencies.

## License

Our original instructions, scripts, and catalog annotations are licensed under the [Apache License, Version 2.0](LICENSE). **Bundled fonts, upstream support files, mood palette data and vendored color libraries retain their own licenses**; they are not relicensed as Apache. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and adjacent notices. The original skill's Apache license is retained inside the skill folder as well.
