# Color selection and implementation

Use this when choosing or materially changing a palette. Preserve existing tokens for small edits. Infer direction from the brief, content, audience and brand; ask only when a missing requirement changes the result. A mood describes a design intent, not a universal psychological or cultural effect.

## Choose a direction

The [palette catalog](color-palettes.json) contains 88 attributed starting points across calm, bold, romantic, luxurious, earthy, playful, professional, dramatic, cozy, minimal and Japanese-inspired categories. The last category is the upstream editorial grouping, not a rule about Japanese audiences. Search relevant moods or use the helper's shortlist. It matches explicit mood words and documented synonyms, not semantic understanding; the agent evaluates the candidates against the project. Do not force a catalog palette on a brand or invent a match when none fits.

Use a brand seed or palette as a starting point. Select monochromatic, analogous, complementary, split-complementary, triadic, tetradic or square relationships where appropriate. Three colors and a 60/30/10 composition can be useful constraints, but neither is mandatory. Area, chroma and lightness affect hierarchy as much as hue. Harmony does not imply readable contrast.

The helper preserves curated primary/secondary/accent hues when a palette alone is selected. An explicit base or harmony overrides those hues. With a base alone, it defaults to analogous; choose another harmony when the brief warrants it. Exact `brand` colors are retained, while functional tokens use related variants. Backgrounds and role colors are newly derived, not copies of the upstream palette's accessibility claims.

## Generate locally

Node.js 22 or newer is recommended. No npm installation, API key, network request or system settings change is needed for normal use. The vendored engine contains @ankhorage/color-theory 0.3.1 and Culori 4.0.2 under MIT. If Node is unavailable, use the guidance with available tools and report contrast as unverified until measured; do not fabricate numerical results or automatically install a runtime.

From the project directory, replacing `/path/to/frontend-design` with the installed skill's absolute path:

```shell
node /path/to/frontend-design/scripts/colors.mjs recommend --mood "cozy minimal"
node /path/to/frontend-design/scripts/colors.mjs list
node /path/to/frontend-design/scripts/colors.mjs generate --palette CLM-01 --out ./palette-review
node /path/to/frontend-design/scripts/colors.mjs generate --base '#345678' --harmony splitComplementary --out ./brand-review
node /path/to/frontend-design/scripts/colors.mjs generate --config ./brand-input.json --out ./locked-review
```

Output destinations must be new directories outside the skill, with an existing parent. Existing directories are never overwritten. Configuration accepts `base`, `palette`, `mood`, `harmony`, and `locked`; CLI values override corresponding configuration values. Example:

```json
{
  "base": "#345678",
  "harmony": "analogous",
  "locked": {
    "light": { "background": "#FFFFFF", "action": "#345678" },
    "dark": { "brand": "#345678" }
  }
}
```

Supported locked tokens are `brand`, `secondary`, `accent`, `background`, `surface`, `text`, `muted`, `border`, `action`, `onAction`, `actionHover`, `onActionHover`, `focus`, `danger`, `success`, `warning`, `info`. Locking a token preserves that exact value; it does not automatically regenerate the seeds. Use `base` for the generation seed. Never silently change an owner's locked color to make a check pass.

Outputs:

- `palette.json`: seeds, source attribution, versioned engine, full candidate decisions, ramp diagnostics, tokens, measured pairs and failures.
- `colors.css`: semantic CSS variables for light and dark modes.
- `preview.html`: portable component, text, status and focus specimen with theme and approximate color-vision simulation controls; no network assets.
- `licenses/`: upstream MIT notices and the original adapter's Apache license, preserved when sharing the generated package.

Exit code 0 means the requested command succeeded; generation also passed all listed role pairs. Exit code 2 means no recommendation or unresolved generation constraints. For unresolved generation, only `palette.json` is written; no CSS or preview is exported. Exit code 1 means an input or I/O error. Inspect failures and choose a different allowed variant, separate surface, or non-color treatment. If satisfying a required brand lock needs a user decision, explain the concrete conflict and alternatives.

## Validate functional roles

Use perceptual OKLCH ramps and gamut-safe sRGB exports rather than treating HSL lightness as a contrast measure. The engine retains diagnostics for weak steps, grayscale seeds and limited ranges. A passing contrast report does not remove those aesthetic warnings: inspect the ramp and choose a more useful seed or fewer meaningful steps when necessary.

The generated system checks normal text, muted text and status text against both page and surface at 4.5:1; action fills, borders and focus against those surfaces at 3:1; and action labels against normal/hover fills at 4.5:1. Comparisons use unrounded values. `brand`, `secondary` and `accent` are raw decorative seeds, not promises of safe text colors. Functional links should use a measured text token and a non-color cue such as underlining.

These are documented default relationships, not a complete accessibility audit. Recheck the actual adjacency in the product: a focus ring on another fill, nested surfaces, selected controls or a chart may create a relationship not listed here. Use an offset focus ring against the validated surrounding surface or measure its actual neighbors. Disabled controls, decoration and logotypes have distinct requirements; do not require every arbitrary swatch pair to pass 3:1.

For WCAG AA, normal text needs 4.5:1. Large text has a 3:1 threshold at 18pt regular (24 CSS px) or 14pt bold (about 18.67 CSS px), not 18px bold. Thin or unusual fonts benefit from more margin even when their token pair passes. Qualifying functional non-text information needs 3:1 against adjacent colors. Do not use hue alone to communicate state: include text, icons, line styles or patterns as appropriate.

The helper accepts only opaque six-digit hex. Composite translucent content against its real background before measuring. Check the worst relevant areas of gradients/images separately. Validate light and dark themes independently; inversion and hue rotation do not establish contrast. Color-vision simulations are approximate review aids, never certification or substitutes for redundant meaning.

## Review with typography and export

Select fonts through [the typography workflow](typography.md). The generic preview uses system fonts intentionally; apply the project's chosen licensed fonts and actual copy when implementing. Inspect body text, muted labels, small numbers, buttons, errors and keyboard focus at mobile and desktop widths. Check font weights, anti-aliasing, reading density, color area and visual hierarchy together.

Prefer a single contextual choice with a short rationale. Offer alternatives only when the decision is materially open. Keep generated brand artifacts in the user's project, not this plugin's source repository. Preserve provenance and license notices when exporting. Never describe a mathematical shortlist as an objectively best aesthetic or a passing role table as full WCAG compliance.

## Attribution and standards

- [hue3, pinned source](https://github.com/ktzzypo938/hue3/tree/a306210b7240e183366998ce39fbe7543cc09b41): mood palette data, names and atmosphere descriptions retained under [MIT](hue3-LICENSE.txt). Mandatory three-color rules, inaccurate contrast advice and Claude-specific instructions were not adopted.
- [Ankhorage color-theory](https://github.com/ankhorage/color-theory): pinned published 0.3.1 engine with [MIT notice](../scripts/vendor/ankhorage-color-theory-LICENSE.txt); [Culori](https://github.com/Evercoder/culori) 4.0.2 with [MIT notice](../scripts/vendor/culori-LICENSE.txt). Bundle hashes and versions: [provenance](../scripts/vendor/provenance.json).
- [bivex/brand-color-palette-generator](https://github.com/bivex/brand-color-palette-generator/tree/34120ac72e8153dd26ce2f995dba277477c74ce6): preview/export interaction inspiration only; no code copied and no dependency on Colormind.
- [WCAG 2.2 text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
