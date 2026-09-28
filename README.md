# ChatGPT Design Skills

A frontend design skill adapted for ChatGPT/Codex environments that support local skills. It guides deliberate typography, color, layout, interface copy, interaction, and visual verification while respecting an existing brand and technology stack.

## Credit

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

There are no required runtime packages, API keys, Claude tools, MCP servers, or external services. The upstream folder contained only a skill and its license. Optional host capabilities are used when available and appropriate; they are not bundled or installed automatically. A particular frontend project may have its own dependencies.

## License

This repository, including the adaptations, is licensed under the [Apache License, Version 2.0](LICENSE). The original skill's license is also retained inside its folder so standalone copies preserve the license.
