import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  converter,
  formatHex,
  getContrastRatio,
} from "../skills/dazzler-frontend/scripts/vendor/color-engine.mjs";

const rgb = converter("rgb");
const linear = converter("lrgb");
const lab = converter("oklab");
const close = (a, b, epsilon = 1e-9) => assert.ok(Math.abs(a - b) < epsilon, `${a} != ${b}`);
const decode = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = (color) => {
  const c = rgb(color);
  return 0.2126 * decode(c.r) + 0.7152 * decode(c.g) + 0.0722 * decode(c.b);
};

test("documented midpoints distinguish encoded sRGB from linear light", () => {
  const encoded = { mode: "rgb", r: 0.5, g: 0.5, b: 0.5 };
  const light = { mode: "lrgb", r: 0.5, g: 0.5, b: 0.5 };
  close(linear(encoded).r, 0.21404114048223255);
  close(rgb(light).r, 0.7353569830524495);
  close(luminance(encoded), decode(0.5));
  close(luminance(light), 0.5);
  assert.equal(formatHex(encoded).toUpperCase(), "#808080");
  assert.equal(formatHex(light).toUpperCase(), "#BCBCBC");
  assert.ok(getContrastRatio(formatHex(encoded), "#FFFFFF") > 3.9);
  assert.ok(getContrastRatio(formatHex(light), "#FFFFFF") < 2);
});

test("same OKLCH L and C do not establish equal luminance or passing white labels", () => {
  const colors = [30, 150].map((h) => ({ mode: "oklch", l: 0.6, c: 0.08, h }));
  const values = colors.map(luminance);
  assert.ok(Math.abs(values[0] - values[1]) > 0.015);
  for (const color of colors) {
    close(lab(color).l, 0.6);
    const hex = formatHex(color);
    close(getContrastRatio(hex, "#FFFFFF"), 1.05 / (luminance(hex) + 0.05));
    assert.ok(getContrastRatio(hex, "#FFFFFF") < 4.5);
  }
});

test("ordinary Display P3 conversion changes components and round-trips in gamut", () => {
  const source = { mode: "p3", r: 0.6, g: 0.3, b: 0.2 };
  const converted = rgb(source);
  assert.ok([converted.r, converted.g, converted.b].every((c) => c >= 0 && c <= 1));
  close(converted.r, 0.6450835111128909);
  assert.notEqual(formatHex(source), formatHex({ ...source, mode: "rgb" }));
  const restored = converter("p3")(converted);
  for (const channel of ["r", "g", "b"]) close(restored[channel], source[channel]);
});

test("OKLab geometry handles hue wrap and powerless hue without raw-angle distance", () => {
  const a = lab({ mode: "oklch", l: 0.6, c: 0.1, h: 350 });
  const b = lab({ mode: "oklch", l: 0.6, c: 0.1, h: 10 });
  const distance = Math.hypot(a.l - b.l, a.a - b.a, a.b - b.b);
  close(distance, 2 * 0.1 * Math.sin((10 * Math.PI) / 180));
  const neutral = (h) => lab({ mode: "oklch", l: 0.6, c: 0, h });
  const first = neutral(30);
  const second = neutral(240);
  close(first.a, second.a);
  close(first.b, second.b);
});

test("synthetic metamer counterexample demonstrates missing spectral information", () => {
  // Algebra fixture only: these small matrices are not human or Apple CMFs.
  const observerA = [
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 1],
  ];
  const observerB = [
    [1, 0, 0, 1.2],
    [0, 1, 0, 1],
    [0, 0, 1, 1],
  ];
  const response = (matrix, spectrum) =>
    matrix.map((row) => row.reduce((sum, weight, i) => sum + weight * spectrum[i], 0));
  const spectra = [
    [2, 2, 2, 0],
    [1, 1, 1, 1],
  ];
  assert.ok(spectra.flat().every((v) => v >= 0));
  assert.deepEqual(response(observerA, spectra[0]), response(observerA, spectra[1]));
  assert.notDeepEqual(response(observerB, spectra[0]), response(observerB, spectra[1]));
});

test("appearance guide is routed from the skill and workflow with honest review fixtures", async () => {
  const root = new URL("../skills/dazzler-frontend/", import.meta.url);
  for (const file of [
    "SKILL.md",
    "references/color-workflow.md",
    "references/automatic-workflow.md",
  ])
    assert.match(
      await readFile(new URL(file, root), "utf8"),
      /\]\((?:references\/)?color-appearance\.md\)/,
    );
  const guide = await readFile(new URL("references/color-appearance.md", root), "utf8");
  assert.ok(Buffer.byteLength(guide) <= 12000);
  assert.match(guide, /Display_Color_Calibration_with_Apple_CMF_Tech_Overview_SEPT_2026\.pdf/);
  assert.match(guide, /10\.2352\/CIC\.2025\.33\.1\.27/);
  const fixtures = JSON.parse(await readFile(new URL("evals/color-appearance.json", root), "utf8"));
  assert.equal(fixtures.kind, "behavioral-review-briefs");
  assert.match(fixtures.status, /real-host run must supply its own artifact evidence/);
  assert.equal(new Set(fixtures.cases.map((c) => c.id)).size, 5);
  assert.ok(fixtures.cases.every((c) => c.brief && c.review.length >= 4));
});
