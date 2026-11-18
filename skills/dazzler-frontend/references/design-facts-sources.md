# Where Design Facts Come From

Use this order whenever you need a reliable answer about colors, spacing, typography, components or patterns. Do not treat blog posts, model defaults or a quick web search as equal to the project's own sources.

## 1. The project you are working in

Start with files and code already in the repository:

- Token files (`tokens.css`, `*.tokens.json`, Tailwind theme, design-system JSON, component libraries the project already uses).
- The project's design record (`DESIGN.md`, `design-system.json`, or whatever the repo names as canonical).
- Living UI: read components, styles and stories before inventing new values.

If the brief and the repo disagree on a material point, treat the user's current instruction as the task and the repo as the default implementation. Ask only when you cannot tell which source should win.

## 2. Official product or design-system documentation

When the stack names a design system, read its official docs and token lists first:

- Published style guides, brand PDFs and vendor documentation shipped with the framework.
- Package README and doc sites for the UI kit actually installed in `package.json`.

Prefer the version that matches the installed package, not a newer doc page for an unpinned release.

## 3. A configured design-system connector (when present)

If the host or project exposes an MCP server or similar connector for a named design system (for example WordPress WPDS, shadcn registry, Storybook index), use it for canonical component APIs, token names and usage rules.

Do **not** install a new connector, publish designs externally or replace the stack just to look up a fact. If no connector is configured, skip this step and say so.

## 4. Dazzler's bundled references and local helpers

When the project has no authoritative design system, use Dazzler's craft guides and offline helpers:

- [Typography](typography.md), [color workflow](color-workflow.md), [interface craft](interface-craft.md), [component foundations](component-foundations.md).
- Measured tools such as `scripts/colors.mjs`, `scripts/fonts.py`, and `scripts/studio.mjs` for tokens you author in this task.

These are general design skill, not a replacement for an established product system.

## 5. Web search (last resort)

Search the open web only when steps 1–4 cannot answer a specific, bounded question (for example a browser support note or a licensing detail).

Before relying on search results for design tokens or component APIs:

- Say that no local or official source was found.
- Prefer primary sources (specs, vendor docs, repository tags) over summaries.
- Warn the user that unofficial pages may be stale or wrong for their installed version.

If the user asks you to skip straight to web search for something their repo or MCP already covers, decline politely and point them to the authoritative source instead.

## When nothing authoritative exists

This is common for greenfield mockups and early prototypes. In that case:

1. State clearly that values are **proposed**, not extracted from an official system.
2. Record assumptions in the design record or delivery note (audience, primary task, chosen scale).
3. Build a small token set (type, spacing, color roles) and keep components on those variables.
4. Run the [code-only self-check](code-only-self-check.md) from source and tokens before calling the design finished.
5. Label any illustrative copy and fictional branding as such.

Do not present invented tokens as if they came from the user's brand guide.

## Notes and credits

Source-order guidance informed by the public [WordPress WPDS agent skill](https://github.com/WordPress/agent-skills/blob/trunk/skills/wpds/SKILL.md) (prefer canonical design-system sources over web search). Wording and scope are original to Dazzler; no upstream text was copied.