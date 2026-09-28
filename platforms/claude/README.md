# Dazzler for Claude / Fable

Download **dazzler-claude.zip** from the closing download links.

Extract the archive and copy its complete `dazzler-frontend` folder into `~/.claude/skills/`. Do not overwrite an existing installation without reviewing it. Refresh skills or start a new session, then ask:

```text
/dazzler-frontend build a welcoming studio website.
```

The archive includes the platform entrypoint, font catalog, 24 licensed font families, Python helper, bundled Node color engine, all reference guides, and license/provenance notices. No API key or npm installation is required by Dazzler. Python/Node execution and browser inspection depend on your host; unavailable checks must be disclosed.

This repository folder contains the platform adapter and installation guidance, **not** a standalone installable skill. Use the complete ZIP or build it with `python tools/build_platforms.py --out dist/platforms` from the repository root. The builder combines the canonical skill with `HOST.md`; assets are maintained once.

## Claude chat and Fable

Fable is a Claude model, so it uses this same edition; choose it in your host if your account offers it.

For Claude chat, upload `dazzler-claude.zip` through Customize > Skills > Create skill > Upload a skill, where custom skills are available. The ZIP contains one `dazzler-frontend` folder with `SKILL.md`, resources and licenses. Host upload limits, account availability and execution capabilities apply; the full asset bundle is approximately 23 MB compressed. This upload has not been exercised in Claude chat. Upload instructions are linked in the closing notes.

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

## Notes and credits

Packaging reference (checked September 28, 2026): [official documentation](https://code.claude.com/docs/en/skills). Creator: Jon Gosier. Feedback: jon@filmhedge.com. Original Dazzler code/instructions are Apache-2.0; bundled third-party resources retain their own licenses.

- [dazzler-claude.zip](https://github.com/jongos/Dazzler/releases/download/v0.15.0/dazzler-claude.zip)
- [Anthropic Fable](https://www.anthropic.com/claude/fable)
- [Official upload instructions](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
- [Plugin documentation](https://code.claude.com/docs/en/plugins)
- [Browse the gallery](https://jongos.github.io/Dazzler/templates/)
- [download only the templates](https://github.com/jongos/Dazzler/releases/download/v0.15.0/dazzler-templates.zip)
