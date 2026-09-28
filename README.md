<p align="center"><img src="docs/assets/dazzler-banner.svg" alt="Dazzler — Give your ideas a visual voice. Typography, color, composition, and craft." width="100%"></p>

<p align="center"><strong>Supercharged Design for A.I.</strong></p>

<p align="center"><a href="#-start-with-an-idea">Get started</a> · <a href="#-the-design-toolkit">The toolkit</a> · <a href="#-install-dazzler">Install</a> · <a href="mailto:jon@filmhedge.com">Send an idea</a></p>

# Dazzler

**Dazzler gives your frontend a visual voice.** Describe what you want to make and who it’s for. The skill chooses suitable fonts, measured colors, layout, and interactions, then implements and reviews the result using the tools available in your ChatGPT/Codex host.

Created by **Jon Gosier** and named after **Dazzler, one of his favorite X-Men characters**. The name celebrates a love of expressive design. This is an independent project, with no affiliation to Disney/Marvel, OpenAI, or Anthropic.

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
| **● · Color** | 88 attributed mood palettes, perceptual ramps, semantic light/dark tokens | Contextual inspiration plus measured contrast for specified role pairs. Brand locks remain exact. |
| **↗ · Composition** | Purpose, audience, hierarchy, grouping, and component craft | A direction informed by the task rather than the same template everywhere. |
| **✓ · Review** | Responsive inspection, relevant interactions, keyboard focus, and honest verification | A clear account of what was checked and what remains unverified. |

### Native Typography

Dazzler checks actual text coverage, required weights and italics, features, and file size before comparing character. It exports selected project-local files with their licenses and CSS. Web work normally requires no desktop font installation.

Browse the [font catalog](skills/dazzler-frontend/references/font-catalog.md), [typography workflow](skills/dazzler-frontend/references/typography.md), or [technical inventory](skills/dazzler-frontend/references/font-catalog.json). 

### Color Suite

The [color workflow](skills/dazzler-frontend/references/color-workflow.md) connects curated inspiration to a bundled Ankhorage/Culori engine. It generates CSS tokens, provenance, contrast reports, and a portable preview. Conflicting locked colors produce an unresolved report instead of silently changing your brand.

A passing report covers its listed opaque-color pairs. It does **not** certify complete WCAG conformance, image backgrounds, charts, or a finished interface. Those require review in context.

### Design Framework

The adapted [design framework](skills/dazzler-frontend/references/deslop.md) connects purpose to visual decisions, supported by [interface craft](skills/dazzler-frontend/references/interface-craft.md), an optional [design record](skills/dazzler-frontend/references/design-record.md), and a [design audit](skills/dazzler-frontend/references/design-audit.md). It preserves your direction without universal font/color bans or compulsory approvals for aesthetic choices.

## 🚀 Install Dazzler

For a host that supports local Codex skills:

1. Clone the repository:

   ```shell
   git clone https://github.com/jongos/Dazzler.git dazzler
   ```

2. Copy `skills/dazzler-frontend` into `$CODEX_HOME/skills`, or `~/.codex/skills` when `CODEX_HOME` is unset. The default Windows directory is `%USERPROFILE%\.codex\skills`.
3. Start a new chat if your host hasn’t refreshed its skill catalog. Invoke **`$dazzler-frontend`**.

Review an existing installation before replacing it. A maintained checkout can use a directory link to keep the installed skill connected to source.

The plugin identifier is **`dazzler`**, its display name is **Dazzler**, and its skill is **`dazzler-frontend`**. Hosts exposing qualified names may show `dazzler:dazzler-frontend`. The repository includes `.codex-plugin/plugin.json`; plugin import depends on the host. Cloning alone does not install anything into a ChatGPT account.

**Upgrading from ChatGPT Design Skills?** This is the same project, renamed in version 0.6.0. Update your Git remote to `git@github.com:jongos/Dazzler.git`, install/link the renamed skill folder, and use `$dazzler-frontend` in new prompts. Verify the new installation before retiring duplicate discovery entries. Historical release notes retain their original names.

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

Have an idea for what Dazzler should do next? Contact **Jon Gosier at [jon@filmhedge.com](mailto:jon@filmhedge.com)** or [open an issue](https://github.com/jongos/Dazzler/issues).

## 🤝 Credits

- **Original frontend guidance:** [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates), specifically its [creative-design/frontend-design folder](https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/skills/creative-design/frontend-design). Adapted with its original Apache-2.0 license and [provenance](skills/dazzler-frontend/PROVENANCE.md) retained.
- **De-slop framework:** **Samuel Berthe ([samber](https://github.com/samber))**, from [frontend-design-deslop](https://github.com/samber/cc-skills/tree/f866b800353719270a9ea101a41c5e2a2618d460/skills/frontend-design-deslop). Only that folder’s framework was adapted, not the wider project. MIT notice and [source inventory](skills/dazzler-frontend/references/deslop-provenance.json) remain included.
- **Font discovery and typography:** [Open Foundry](https://open-foundry.com/) and the individual font creators credited in the catalog and bundled notices.
- **Color foundations:** [hue3](https://github.com/ktzzypo938/hue3), [Ankhorage color-theory](https://github.com/ankhorage/color-theory), and [Culori](https://github.com/Evercoder/culori). [bivex’s palette generator](https://github.com/bivex/brand-color-palette-generator) informed preview/export interactions; no code or external service from it is incorporated.

## License

Our original instructions, scripts, catalog annotations, and Dazzler artwork use [Apache License 2.0](LICENSE). **Fonts, upstream support files, adapted framework guidance, palette data, and vendored libraries retain their respective third-party licenses.** See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and adjacent notices. Renaming the project does not change those terms.
