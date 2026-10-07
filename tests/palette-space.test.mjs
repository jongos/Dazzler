import test from "node:test";
import assert from "node:assert/strict";
import { explore, generate, css } from "../skills/dazzler-frontend/scripts/colors.mjs";
import {
  paletteSpace,
  paletteDistance,
  maximumChroma,
  radicalInverse,
} from "../skills/dazzler-frontend/scripts/palette-space.mjs";
import { converter } from "../skills/dazzler-frontend/scripts/vendor/color-engine.mjs";
import { tokens } from "../skills/dazzler-frontend/scripts/studio.mjs";
import { resumeConfig } from "../skills/dazzler-frontend/scripts/design-record.mjs";
test("Chroma boundary follows the actual sRGB gamut at each lightness and hue", () => {
  const rgb = converter("rgb");
  for (const l of [0.15, 0.4, 0.65, 0.9])
    for (const h of [0, 45, 90, 160, 230, 300]) {
      const c = maximumChroma(l, h),
        inside = rgb({ mode: "oklch", l, c: c * 0.999, h }),
        outside = rgb({ mode: "oklch", l, c: c + 0.00001, h });
      assert([inside.r, inside.g, inside.b].every((v) => v >= 0 && v <= 1));
      assert([outside.r, outside.g, outside.b].some((v) => v < 0 || v > 1));
    }
  assert.equal(maximumChroma(0, 40), 0);
  assert.equal(maximumChroma(1, 40), 0);
  assert.throws(() => maximumChroma(NaN, 30));
  assert.deepEqual(
    [1, 2, 3, 4].map((i) => radicalInverse(i, 2)),
    [0.5, 0.25, 0.75, 0.125],
  );
});
test("Continuous exploration is reproducible, varied and compatible with existing studio records", () => {
  const input = {
    brief: "Mineral surfaces and sharp botanical accents",
    seed: "regression-v1",
    count: 6,
  };
  const a = explore(input),
    b = explore(input);
  assert.deepEqual(a, b);
  assert.equal(a.status, "candidates");
  assert.equal(a.candidates.length, 6);
  for (let i = 0; i < a.candidates.length; i++) {
    const p = a.candidates[i];
    assert.equal(p.status, "pass");
    assert(Object.values(p.modes).every((m) => m.checks.every((c) => c.passes)));
    for (let j = 0; j < i; j++) assert(paletteDistance(p, a.candidates[j]) >= 0.025);
  }
  assert.notDeepEqual(
    explore({ ...input, seed: "regression-v2" }).candidates.map((p) => p.input),
    a.candidates.map((p) => p.input),
  );
  const built = tokens({ colors: a.candidates[0].input });
  assert.deepEqual(tokens(resumeConfig(built.system)), built);
  assert.match(css(a.candidates[0]), /--color-background/);
});
test("Authored seeds and surfaces persist, locks win, impossible constraints stay unresolved", () => {
  const result = generate({
    base: "#234567",
    seeds: { secondary: "#C68440", accent: "#477229", neutral: "#756044" },
    surfaces: { light: { background: "#FFF2C0", surface: "#F2E6B8" } },
    locked: { light: { background: "#FFF0C0" } },
  });
  assert.equal(result.modes.light.tokens.secondary, "#C68440");
  assert.equal(result.modes.light.tokens.accent, "#477229");
  assert.equal(result.modes.light.tokens.background, "#FFF0C0");
  assert.equal(result.modes.light.tokens.surface, "#F2E6B8");
  const bad = explore({
    brief: "Conflicting locked surfaces",
    seed: "fixed",
    count: 1,
    target: "AAA",
    locked: { light: { background: "#000000", surface: "#FFFFFF" } },
  });
  assert.equal(bad.status, "unresolved");
  assert.equal(bad.candidates.length, 0);
  assert.equal(bad.failures[0].modes.light.tokens.background, "#000000");
  assert.throws(() => css(bad.failures[0]));
  const exact = explore({
    brief: "Keep this identity",
    seed: "fixed",
    count: 2,
    base: "#345678",
    locked: { light: { brand: "#AABBCC" }, dark: { brand: "#AABBCC" } },
  });
  assert(exact.candidates.every((p) => p.modes.light.tokens.brand === "#AABBCC"));
});
test("Malformed exploration cannot bypass validation and tight spaces do not invent diversity", () => {
  for (const bad of [
    { brief: "" },
    { brief: "x", count: 25 },
    { brief: "x", ranges: { chroma: [0.3, 0.1] } },
    { brief: "x", ranges: { hue: [0, NaN] } },
    { brief: "x", ranges: { mood: "blue" } },
    { brief: "x", base: "red" },
    { brief: "x", base: ["#123456"] },
    { brief: "x", locked: null },
    { brief: "x", target: false },
    { brief: "x", ranges: null },
  ])
    assert.throws(() => explore(bad));
  for (const bad of [
    { base: "#123456", seeds: { accent: "red" } },
    { base: "#123456", surfaces: { light: { text: "#FFFFFF" } } },
    { base: "#123456", seeds: [] },
  ])
    assert.throws(() => generate(bad));
  const ranges = Object.fromEntries(
    Object.entries(paletteSpace({ brief: "x", seed: "fixed", count: 1 }).ranges).map(([k, v]) => [
      k,
      [v[0], v[0]],
    ]),
  );
  const tight = explore({ brief: "fixed coordinates", seed: "fixed", count: 4, ranges });
  assert(tight.candidates.length <= 1);
  assert.notEqual(tight.status, "candidates");
});
