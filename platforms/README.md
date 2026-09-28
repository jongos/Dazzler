# Choose your Dazzler edition

The core typography, color tools and design guidance are shared. Platform adapters change tool routing and installation, not the design standard. No edition auto-installs another host or changes its permissions.

| Host | Installation guide | Download |
|---|---|---|
| ChatGPT/Codex | [Existing native edition](../README.md#-install-dazzler) | Use `skills/dazzler-frontend` |
| Claude Code / Claude chat, including Fable | [Claude guide](claude/README.md) | [Skill ZIP](https://github.com/jongos/Dazzler/releases/download/v0.8.0/dazzler-claude.zip) · [Code plugin ZIP](https://github.com/jongos/Dazzler/releases/download/v0.8.0/dazzler-claude-plugin.zip) |
| Gemini CLI | [Gemini guide](gemini/README.md) | [Skill ZIP](https://github.com/jongos/Dazzler/releases/download/v0.8.0/dazzler-gemini.zip) |
| Cursor Agent | [Cursor guide](cursor/README.md) | [Skill ZIP](https://github.com/jongos/Dazzler/releases/download/v0.8.0/dazzler-cursor.zip) |
| GitHub Copilot agents | [Copilot guide](copilot/README.md) | [Skill ZIP](https://github.com/jongos/Dazzler/releases/download/v0.8.0/dazzler-copilot.zip) |
| Other chat hosts | [Portable instructions](portable/DAZZLER-PROMPT.md) | [Prompt file](https://github.com/jongos/Dazzler/releases/download/v0.8.0/DAZZLER-PROMPT.md) |

Fable is an Anthropic Claude model and uses the Claude host's format, not a separate platform package. The portable prompt is guidance only: it cannot install skills or provide fonts, scripts, execution or verified measurements to a text-only chat.

Full ZIPs carry unmodified fonts, licenses and the offline helper bundle. They are generated from `skills/dazzler-frontend` plus the relevant `HOST.md`, without Codex UI metadata, owner-specific maintenance permissions, or Windows paths. Platform source folders intentionally do not duplicate font binaries. Installation paths and capabilities are based on official documentation linked in each guide, checked September 28, 2026. Native host sessions and cloud uploads have not been tested.

## Maintain the editions

Run `python tools/build_platforms.py --out dist/platforms-0.8.0` using a new output directory, then `python tools/validate_platforms.py dist/platforms-0.8.0`. The build uses Python's standard library and stable ZIP ordering/timestamps. Upload the ZIPs, prompt file and `SHA256SUMS.txt` as release assets only after validation. Update download versions together on the next release. Do not edit generated ZIPs or maintain separate copies of the catalogs. This build neither installs nor publishes anything.

## Studio tools in 0.8.0

Full packages now include brand import, system-token export, browser inspection, content stress tests, a font-pairing lab, chart palettes, original SVG assets, reversible change previews, document/slide exports and the evaluation harness. Core tools remain offline; browser features need an existing Playwright/Chromium environment, and native DOCX/PPTX need existing Python libraries. These capabilities are not guaranteed by every host. Use the included `references/design-studio.md` guide; absent tools must be disclosed rather than simulated.
