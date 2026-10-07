# Mathematical Palette Exploration

October 7, 2026. Dazzler 0.27.0 local development.

## What the Math Adds

The 88 catalog palettes remain references. New palette work now defaults to agent-authored continuous exploration through the existing color engine. Natural-language intent becomes numeric ranges chosen by the agent; the helper does not interpret prose or guarantee semantic fit.

1. A seed-rotated Halton sequence samples 15 continuous coordinates, including independent hue relationships, lightness, chroma, neutral character, surface character and gamut utilization. This spreads a bounded search across the requested parameter space rather than choosing only fixed harmony offsets or random RGB triples.
2. At each hue and lightness, 24 bisection steps estimate the sRGB chroma boundary. Requested chroma is capped by a selected fraction of that boundary, reducing collapse caused by mapping different out-of-gamut requests onto the same edge. Final colors are still gamut-mapped and quantized to ordinary opaque sRGB hex.
3. The existing semantic-role engine solves functional colors and checks their actual contrast pairs. Hard locks win. Impossible or undiscovered solutions remain unresolved; no failing candidate gets CSS.
4. Farthest-first selection maximizes the minimum RMS OKLab distance across five roles in both themes. The 0.025 separation threshold is a diversity heuristic, not a beauty score, a universal perceptual threshold or an optimal packing proof.

The sampled coordinates are not a set of new templates. The agent can choose arbitrary supported ranges, exact secondary/accent/neutral seeds and colored surfaces. Selected inputs feed the existing studio, native-document and chart token workflows and persist without randomness on resume.

## Measured Results

The reproducible audit used 64 seeds across four authored intents: mineral/botanical, night-sky exhibition, basic professional report, and sunlit festival. It explored 3,072 configurations; all passed the engine's listed role-pair checks. The selector returned 384 palettes, all with distinct complete token sets and no duplicate returns. See audit.json for each seed and minimum within-set distance.

These measurements establish variety for this fixture population. They do not establish billions of distinct high-quality palettes, exponential aesthetic improvement, real-world preference or a universal prompt match. A 128-bit seed is reproducibility machinery, not a count of unique designs.

The contextual board contains 24 candidates at desktop and mobile sizes. Text, supporting surfaces and working controls use actual generated tokens. Its deliberately repeated layout isolates color relationships; it is not a release-template collection. Review values and samples in index.html and studies.json.

## Validation

- 96 JavaScript tests passed, including numerical gamut boundaries, deterministic replay, perceptual separation, studio persistence, exact legacy exports, invalid ranges and locked-color conflicts.
- 70 Python tests ran: 69 passed, one skipped.
- Twenty-four rendered candidates at 1440 and 390 pixels: no horizontal overflow, tested keyboard selection feedback, no violations in the selected axe WCAG A/AA rules. This is bounded coverage, not accessibility certification.
- All 29 review-board headings passed the final heading audit.
- Formatting, source links, skill validation, release metadata and runtime sealing passed.

No publication or external asset copying. Human judgments of composition, color area and prompt fit remain necessary. Source code and statistical distance cannot certify beauty.

## Mathematical Sources

The established engine already provides OKLCH conversion, gamut mapping and contrast. The new sampling, boundary exploration and selection code is original Dazzler orchestration built on it. Read [Oklab's author](https://bottosson.github.io/posts/oklab/), [CSS Color 4](https://www.w3.org/TR/css-color-4/#ok-lab) and [Culori's API](https://culorijs.org/api/) for the underlying color-space and conversion foundations. Existing Apache/MIT notices remain intact.
