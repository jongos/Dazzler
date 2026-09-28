# Choose your Dazzler edition

Full helper editions share persistent design records, schema-2 fluid typography with print fallbacks, and compatible shadcn theme proposals. Read references/persistent-systems.md in the installed skill. These helpers do not install components or overwrite project records. Host-specific execution remains subject to available tools.

The core typography, color tools and design guidance are shared. Platform adapters change tool routing and installation, not the design standard. No edition auto-installs another host or changes its permissions.

| Host | Installation guide | Download |
|---|---|---|
| ChatGPT/Codex | [Native edition](codex/README.md) | Versioned Codex skill ZIP |
| Claude Code / Claude chat, including Fable | [Claude guide](claude/README.md) | Compact upload ZIP · Full skill ZIP · Code plugin ZIP |
| Gemini CLI | [Gemini guide](gemini/README.md) | Skill ZIP |
| Cursor Agent | [Cursor guide](cursor/README.md) | Skill ZIP |
| GitHub Copilot agents | [Copilot guide](copilot/README.md) | Skill ZIP |
| Other chat hosts | [Portable instructions](portable/DAZZLER-PROMPT.md) | Prompt file |

Fable is an Anthropic Claude model and uses the Claude host's format, not a separate platform package. The portable prompt is guidance only: it cannot install skills or provide fonts, scripts, execution or verified measurements to a text-only chat.

Full ZIPs carry unmodified fonts, licenses and the offline helper bundle. They are generated from `skills/dazzler-frontend` plus the relevant `HOST.md`, without transferable maintenance permissions or personal Windows paths. Only the Codex edition carries Codex UI metadata. Platform source folders intentionally do not duplicate font binaries. Installation paths and capabilities are based on official documentation linked in each guide, checked September 28, 2026. Native host sessions and cloud uploads have not been tested.

## Maintain the editions

Run `python tools/build_platforms.py --out dist/platforms` using a new output directory, then `python tools/validate_platforms.py dist/platforms`. The build uses Python's standard library and stable ZIP ordering/timestamps and LF-normalized authored text, while original assets and legal notices remain byte-exact. Upload the ZIPs, prompt file and `SHA256SUMS.txt` as release assets only after validation. Rebuild from the same tagged commit and compare archive hashes to the released SHA256SUMS; `tools/validate_release.py` rejects inconsistent current versions. Do not edit generated ZIPs or maintain separate copies of the catalogs. This build neither installs nor publishes anything.

## Studio tools

Full packages now include brand import, system-token export, browser inspection, content stress tests, a font-pairing lab, chart palettes, original SVG assets, reversible change previews, document/slide exports and the evaluation harness. Core tools remain offline; browser features need an existing Playwright/Chromium environment, and native DOCX/PPTX need existing Python libraries. These capabilities are not guaranteed by every host. Use the included `references/design-studio.md` guide; absent tools must be disclosed rather than simulated.

## Template library

Full skill packages include 10 DOCX templates, 10 matching HTML templates and 10 UI templates with HTML, CSS and JSON. Each now has a distinct visual identity, robust fictional scenarios and an actual captured preview. Contextual charts, genuine italic fonts, editable structures and print treatments are selected automatically; relevant data and interaction assets travel with exports. Dazzler selects and copies a suitable starting point automatically. Browse the gallery or download only the templates. Keep the shared fonts folder with HTML/UI files. DOCX fonts are referenced, not embedded.

## Visualization adapters

Every full package includes the same offline Vega/Vega-Lite, selected D3 and Microcharts rendering bundles, their license notices, and the optional mschart R adapter. Generated React components use the host project React runtime. Native Office export requires R, mschart >=0.5.1 and officer >=0.7.5; missing runtimes produce an explicit fallback report. Consult references/visualization.md in the package. No external model service is required.

## Interactive illustrations

Full editions include validated vector-region and image-hotspot exporters, offline previews, keyboard/touch controls, text alternatives and integration modules for the existing project framework. Follow references/interactive-illustrations.md in the package.

Routine design helpers run from local bundled resources. Standalone image interactions use a lightweight browser-native adapter; existing framework integrations remain available. The release includes an integrity checker and automatic routing guidance. Optional native Office and browser tools use existing host runtimes.

## Notes and credits

- [Skill ZIP](https://github.com/jongos/Dazzler/releases/download/v0.18.0/dazzler-claude.zip)
- [Code plugin ZIP](https://github.com/jongos/Dazzler/releases/download/v0.18.0/dazzler-claude-plugin.zip)
- [Skill ZIP](https://github.com/jongos/Dazzler/releases/download/v0.18.0/dazzler-gemini.zip)
- [Skill ZIP](https://github.com/jongos/Dazzler/releases/download/v0.18.0/dazzler-cursor.zip)
- [Skill ZIP](https://github.com/jongos/Dazzler/releases/download/v0.18.0/dazzler-copilot.zip)
- [Prompt file](https://github.com/jongos/Dazzler/releases/download/v0.18.0/DAZZLER-PROMPT.md)
- [Browse the gallery](https://jongos.github.io/Dazzler/templates/)
- [download only the templates](https://github.com/jongos/Dazzler/releases/download/v0.18.0/dazzler-templates.zip)

- [Native Codex skill ZIP](https://github.com/jongos/Dazzler/releases/download/v0.18.0/dazzler-codex.zip)
- [Compact Claude ZIP](https://github.com/jongos/Dazzler/releases/download/v0.18.0/dazzler-claude-compact.zip)
