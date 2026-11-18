# Design Self-Check Without Screenshots

Use when you cannot render the UI or inspect pixels: no browser, no vision tools, or the artifact is still source-only. This complements—not replaces—the [execution loop](review-loop.md) and [rendered review](rendered-review.md). Record each item as **pass**, **fail**, **not checked**, or **not applicable**.

## Before you start

Read [where design facts come from](design-facts-sources.md). Self-checks judge **your implementation against stated tokens and CSS**, not against guesswork from a search engine.

## 1. Semantic color pairs (measured)

When the project has `design-system.json` or Dazzler studio output, measure opaque text and action pairs:

```shell
node scripts/token-self-check.mjs --system design-system.json
```

For ad hoc hex pairs, use the bundled engine (same math as the color helper):

```shell
node -e "import{getContrastRatio}from'./scripts/vendor/color-engine.mjs';const p=process.argv.slice(1);console.log(getContrastRatio(p[0],p[1]).toFixed(2))" "#17212B" "#EEE9F6"
```

Targets (WCAG 2.x, normal text unless noted):

- Body and labels on background or surface: **4.5:1** minimum (7:1 is a sensible stretch goal for long reading).
- Large bold display type (≥24px regular or ≥18.66px bold): **3:1** minimum.
- Action fill with label (`onAction` on `action`): **3:1** minimum for the control boundary; label on fill still needs readable text contrast.

Opaque hex only. Gradients, images, glass and alpha stacks need a separate note; do not claim a passing ratio without naming the simplified pair you measured.

## 2. Type scale

From CSS or token files, list distinct `font-size` values (and `line-height` if set explicitly).

- Expect a **small ladder** (roughly four to six steps), not many one-off sizes.
- Body text should stay at or above **16px** (or `1rem` with a 16px root) unless the brief demands smaller legal copy—and then justify it.
- Heading steps should increase monotonically (no `h3` larger than `h2` in the same theme).
- If the project uses Dazzler's `typeRatio` / `baseSize`, confirm sizes match the generated scale rather than stray literals in components.

## 3. Spacing scale

Collect margin, padding and gap values from tokens or stylesheets.

- Prefer values on a **4px or 8px grid** (including `0.25rem`/`0.5rem` with a 16px root).
- Flag isolated "magic numbers" that do not map to the project scale unless they solve a documented layout exception.
- Section rhythm: neighboring blocks should reuse the same gap tokens, not alternating arbitrary stacks.

Quick scan example (adjust the path):

```shell
rg -oE '(padding|margin|gap):\s*[^;]+' styles/*.css | sort -u
```

## 4. Focus and keyboard (from source)

Without clicking, verify the stylesheet defines real focus styles:

- Interactive selectors include `:focus-visible` (not only `:focus` removed with `outline: none`).
- Visible focus uses at least **2px** outline or ring with contrast against both light and dark surfaces where both exist.
- `prefers-reduced-motion: reduce` shortens or removes nonessential transitions (search for the media query).

In HTML/JSX, confirm buttons and links are native or have `role` + keyboard handlers; icon-only controls need an accessible name in markup (`aria-label` or visible text).

## 5. Responsive breakpoints

From CSS, list `@media` width thresholds.

- Document which layout changes at each breakpoint (navigation, columns, table scroll).
- At minimum, mentally test **narrow (~375px)**, **tablet (~768px)**, and **wide (~1280px)** against the rules: no mandatory horizontal page scroll for main content, long strings use `overflow-wrap` or scroll containers, touch targets at least **44×44px** where the UI is touch-first.

Source review cannot prove absence of overflow; mark overflow checks as **not checked** until a render exists.

## 6. Token discipline

- Colors, spacing and fonts flow through **variables or theme objects**, not repeated raw hex in component files (small one-offs need a reason).
- Avoid `!important` patches that hide token mistakes.
- Inline styles should carry dynamic values (position, size), not one-off typography or palette choices.

## 7. Template smell (read the structure)

From HTML/JSX alone, ask:

- If you swapped the logo and headline for another product in the same category, would the page still feel specific to **this** brief? If yes, the layout may still be generic.
- Is there one clear primary action per view?
- Can you name one memorable element? If not, hierarchy may be flat.

This is judgment from structure, not a ban on common patterns.

## Report

Summarize failures with file references and the token or rule violated. Fix in tokens first, then components. After code changes, rerun `token-self-check.mjs` where applicable. When browser review becomes available, run the normal verification pass and note which self-check items were superseded by rendered evidence.

## Notes and credits

Checklist structure informed by public no-vision frontend design practice (measurable contrast, spacing ladder, breakpoints, focus). Wording and Dazzler-specific tooling are original; no upstream text was copied.