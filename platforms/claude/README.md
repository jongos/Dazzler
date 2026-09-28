# Dazzler for Claude / Fable

Full helper editions share persistent design records, schema-2 fluid typography with print fallbacks, and compatible shadcn theme proposals. Read references/persistent-systems.md in the installed skill. These helpers do not install components or overwrite project records. Host-specific execution remains subject to available tools.

Download **dazzler-claude.zip** from the closing download links.

Extract the archive and copy its complete `dazzler-frontend` folder into `~/.claude/skills/`. Do not overwrite an existing installation without reviewing it. Refresh skills or start a new session, then ask:

```text
/dazzler-frontend build a welcoming studio website.
```

The archive includes the platform entrypoint, font catalog, 24 licensed font families, Python helper, bundled Node color engine, all reference guides, and license/provenance notices. No API key or npm installation is required by Dazzler. Python/Node execution and browser inspection depend on your host; unavailable checks must be disclosed.

This repository folder contains the platform adapter and installation guidance, **not** a standalone installable skill. Use the complete ZIP or build it with `python tools/build_platforms.py --out dist/platforms` from the repository root. The builder combines the canonical skill with `HOST.md`; assets are maintained once.

## Claude chat and Fable

Fable is a Claude model, so it uses this same edition; choose it in your host if your account offers it.

For Claude chat, try **dazzler-claude-compact.zip** through your host's custom skill upload flow. The compact profile contains six general-purpose families (Work Sans, Young Serif, Office Code Pro, Inter, Bluu Next and League Gothic), all 30 templates with their local font subsets, the offline engines, and complete applicable licenses. Other catalog families are explicitly marked optional; Dazzler automatically chooses an included family. Use the full desktop edition when the wider font collection is needed.

The builder enforces **24,000,000 bytes unpacked** for the compact skill and publishes exact compressed/unpacked sizes in `PACKAGE-SIZES.json`. This leaves headroom below the documented Claude API 30 MB uncompressed limit; it does not establish Claude chat's current upload limit. Real Claude chat upload acceptance remains unverified. API execution is offline: no package installation or runtime network is assumed.

Verify `SHA256SUMS.txt` before extraction/upload. `references/package-profile.json` identifies the version, installed families and resources; `python scripts/health.py` verifies that profile's inventory. For an update, back up and replace the complete installed folder instead of merging versions. For a manual uninstall, remove only that skill folder; use the host's removal UI for hosted skills.

## Optional Claude Code plugin

Unzip `dazzler-claude-plugin.zip`, then start Claude Code with `claude --plugin-dir /absolute/path/to/dazzler`. Invoke `/dazzler:dazzler-frontend`. The plugin includes `.claude-plugin/plugin.json` and its own complete skill resources. Install either the standalone skill or plugin to avoid duplicate entries. Plugin documentation is linked in the closing notes.

## Validation status

Documentation-aligned packaging with local archive, license, resource and helper checks. Not end-to-end tested inside Claude / Fable; a valid archive does not guarantee account eligibility, upload acceptance, or agent behavior. Keep the core skill enabled for automatic selection where supported; host consent still applies.

## Studio tools

Full packages now include brand import, system-token export, browser inspection, content stress tests, a font-pairing lab, chart palettes, original SVG assets, reversible change previews, document/slide exports and the evaluation harness. Core tools remain offline; browser features need an existing Playwright/Chromium environment, and native DOCX/PPTX need existing Python libraries. These capabilities are not guaranteed by every host. Use the included `references/design-studio.md` guide; absent tools must be disclosed rather than simulated.

## Template library in 0.9.0

Full skill packages include 10 DOCX templates, 10 matching HTML templates and 10 UI templates with HTML, CSS and JSON. Each now has a distinct visual identity, robust fictional scenarios and an actual captured preview. Contextual charts, genuine italic fonts, editable structures and print treatments are selected automatically; relevant data and interaction assets travel with exports. Dazzler selects and copies a suitable starting point automatically. Browse the gallery or download only the templates. Keep the shared fonts folder with HTML/UI files. DOCX fonts are referenced, not embedded.

## Interactive illustrations

Full editions include validated vector-region and image-hotspot exporters, offline previews, keyboard/touch controls, text alternatives and integration modules for the existing project framework. Follow references/interactive-illustrations.md in the package.

Routine design helpers run from local bundled resources. Standalone image interactions use a lightweight browser-native adapter; existing framework integrations remain available. The release includes an integrity checker and automatic routing guidance. Optional native Office and browser tools use existing host runtimes.

## Quick starts

The package includes 19 beginner prompts in `references/starters.md`, grouped by task. Read one category at a time. Host-specific invocation is applied during packaging; Claude plugin users prefix the command with `/dazzler:`. Advanced fields are optional.

## Marketplace installation

The release-pinned marketplace supports the full Code plugin with its archive hash. Local build checks validate the pin; actual Claude installation remains unverified. Use the marketplace commands in the closing notes, then invoke `/dazzler:dazzler-frontend`.

## Notes and credits

Packaging reference (checked September 28, 2026): [official documentation](https://code.claude.com/docs/en/skills). Creator: Jon Gosier. Feedback: jon@filmhedge.com. Original Dazzler code/instructions are Apache-2.0; bundled third-party resources retain their own licenses.

- [dazzler-claude.zip](https://github.com/jongos/Dazzler/releases/download/v0.18.0/dazzler-claude.zip)
- [Anthropic Fable](https://www.anthropic.com/claude/fable)
- [Official upload instructions](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
- [Plugin documentation](https://code.claude.com/docs/en/plugins)
- [Browse the gallery](https://jongos.github.io/Dazzler/templates/)
- [download only the templates](https://github.com/jongos/Dazzler/releases/download/v0.18.0/dazzler-templates.zip)

- [Compact Claude skill](https://github.com/jongos/Dazzler/releases/download/v0.18.0/dazzler-claude-compact.zip)
- [Claude API skill limits](https://platform.claude.com/docs/en/build-with-claude/skills-guide)

Marketplace: `/plugin marketplace add jongos/Dazzler`, then `/plugin install dazzler@dazzler`.
