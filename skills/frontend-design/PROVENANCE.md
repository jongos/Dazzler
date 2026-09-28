# Source and adaptation

Source: https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/skills/creative-design/frontend-design

Inspected on 2026-09-28 from the main branch. The source directory contained SKILL.md and LICENSE.txt only. No executable dependencies, bundled assets, linked helper scripts, or mandatory Claude tools were declared. The typography book mentioned in the source is guidance, not a runtime dependency. The surrounding repository's CLI installer is not required for this standalone skill.

The upstream Apache 2.0 LICENSE.txt is included unchanged. The adapted SKILL.md carries a modification notice. This is a local adaptation, not an official Anthropic or OpenAI product.

Changes: restructured design guidance; removed the assumed client history and mandatory confirmation step; preserved explicit brand and stack choices; added optional routing to existing Sites, visualization, image-generation, and browser capabilities; added implementation and verification boundaries. No external tool dependency is declared in agents/openai.yaml because the skill can guide design without one.

OpenAI skill format reference: https://developers.openai.com/plugins/build/skills

The folder is intended for this local ChatGPT/Codex environment's personal skills directory. The ZIP is a portable copy, not evidence of installation in other ChatGPT accounts or cloud environments.

Typography expansion, 2026-09-28: the original dependency audit above describes the source skill, not this expanded package. Version 0.2.0 adds a catalog of 25 Open Foundry families, 24 bundled families under their individual terms, and an optional standard-library Python selection/export helper. Consult references/font-catalog.md and each assets/fonts/*/SOURCE.md for attribution and licensing; font assets are not covered by the skill's Apache license.
