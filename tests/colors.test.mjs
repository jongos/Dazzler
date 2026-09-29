import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import {
  generate,
  recommend,
  css,
  preview,
  exportResult,
} from "../skills/dazzler-frontend/scripts/colors.mjs";
import {
  getContrastRatio,
  selectReadableForeground,
  generateColorSwatch,
  selectColorSwatchStep,
  generateHarmonyRoleColors,
  converter,
  toGamut,
  formatHex,
} from "../skills/dazzler-frontend/scripts/vendor/color-engine.mjs";

test("WCAG reference ratios and near-threshold foreground choice use full precision", () => {
  assert.equal(getContrastRatio("#000000", "#FFFFFF"), 21);
  assert.equal(getContrastRatio("#123456", "#123456"), 1);
  assert.ok(getContrastRatio("#777777", "#FFFFFF") < 4.5);
  const result = selectReadableForeground("#777777", ["#FFFFFF", "#000000"], 4.5, "first");
  assert.equal(result.selected.foreground.toUpperCase(), "#000000");
  assert.equal(result.candidates[0].passesMinimum, false);
});

test("selection rejects impossible simultaneous surfaces without a silent fallback", () => {
  const { swatch } = generateColorSwatch("#557799");
  const selection = selectColorSwatchStep(
    swatch,
    { lightness: 0.5, chroma: 0.1 },
    [
      { id: "black", against: "#000000", minimumContrast: 7 },
      { id: "white", against: "#FFFFFF", minimumContrast: 7 },
    ],
    "lower-step",
  );
  assert.equal(selection.selected, null);
  assert.ok(selection.candidates.every((c) => c.rejectionReasons.includes("contrast")));
});

test("perceptual harmony preserves exact brand seed and maps generated colors to sRGB", () => {
  for (const seed of ["#FF0000", "#000000", "#FFFFFF", "#777777"]) {
    const harmony = generateHarmonyRoleColors(seed, "triadic");
    assert.equal(harmony.primary.hex.toUpperCase(), seed);
    for (const color of harmony.colors) assert.match(color.hex, /^#[a-f\d]{6}$/i);
  }
  const mapped = toGamut("rgb", "oklch")({ mode: "oklch", l: 0.6, c: 0.4, h: 140 });
  assert.ok([mapped.r, mapped.g, mapped.b].every((v) => v >= 0 && v <= 1));
  assert.match(formatHex(mapped), /^#[a-f\d]{6}$/i);
});

test("extreme ramps retain warning diagnostics and grayscale harmony is identified", () => {
  for (const seed of ["#000000", "#FFFFFF"]) {
    const ramp = generateColorSwatch(seed);
    assert.ok(ramp.diagnostics.warnings.length > 0);
    assert.equal(ramp.diagnostics.isUsable, false);
  }
  assert.equal(generateHarmonyRoleColors("#777777", "triadic").diagnostics.isHueReliable, false);
});

test("recommendations match mood words and return no results for an unknown mood", () => {
  assert.equal(recommend("literally-unmatched-mood").length, 0);
  assert.ok(recommend("cozy minimal").every((p) => ["cozy", "minimal"].includes(p.mood)));
  assert.equal(recommend("corporate")[0].mood, "professional");
});

test("normal brand generation validates both themes and preserves seeds", () => {
  const result = generate({ base: "#345678", harmony: "splitComplementary" });
  assert.equal(result.status, "pass");
  for (const mode of Object.values(result.modes)) {
    assert.equal(mode.tokens.brand, "#345678");
    assert.ok(mode.checks.every((c) => c.passes && c.ratio >= c.minimum));
    assert.equal(mode.checks.length, 23);
  }
  const oklch = converter("oklch");
  assert.ok(
    oklch(result.modes.light.tokens.background).l > oklch(result.modes.dark.tokens.background).l,
  );
  assert.match(css(result), /data-theme="dark"/);
});

test("locked brand tokens are never repaired silently and invalid CSS cannot be exported", () => {
  const result = generate({
    base: "#123456",
    locked: { light: { action: "#777777", onAction: "#FFFFFF" } },
  });
  assert.equal(result.modes.light.tokens.action, "#777777");
  assert.equal(result.modes.light.tokens.onAction, "#FFFFFF");
  assert.equal(result.status, "unresolved");
  assert.ok(result.modes.light.failures.some((c) => c.foreground === "onAction"));
  assert.throws(() => css(result), /unresolved/);
  assert.throws(() => preview(result), /unresolved/);
});

test("rejects unsupported transparency, malformed colors and unknown configuration keys", () => {
  for (const input of [
    { base: "#fff" },
    { base: "#11223380" },
    { base: "red" },
    { base: "#123456", locked: { light: { bogus: "#FFFFFF" } } },
    { base: "#123456", minimumContrast: 1 },
    { base: "#123456", harmony: "imaginary" },
  ]) {
    assert.throws(() => generate(input));
  }
});

test("all 88 inspiration palettes generate either validated tokens or an explicit unresolved report", async () => {
  const catalog = JSON.parse(
    await readFile(
      new URL("../skills/dazzler-frontend/references/color-palettes.json", import.meta.url),
    ),
  );
  assert.equal(catalog.palettes.length, 88);
  let passed = 0;
  for (const palette of catalog.palettes) {
    const result = generate({ palette: palette.id });
    assert.equal(result.provenance.palette.source, palette.source);
    const failures = Object.values(result.modes).flatMap((mode) => mode.failures);
    if (result.status === "pass") {
      assert.equal(failures.length, 0);
      passed++;
    } else assert.ok(failures.length > 0);
  }
  assert.ok(passed > 0);
  console.log(
    `Palette audit: ${passed}/88 generated complete passing role systems; ${88 - passed} explicitly unresolved.`,
  );
});

test("export produces portable preview, CSS, provenance and licenses; refuses overwrites", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "color-export-"));
  try {
    const dest = path.join(root, "pass");
    const result = generate({ base: "#345678" });
    await exportResult(result, dest);
    assert.equal((await readdir(path.join(dest, "licenses"))).length, 4);
    const html = await readFile(path.join(dest, "preview.html"), "utf8");
    assert.ok(!/src="https?:|href="https?:|fetch\(/.test(html));
    assert.match(html, /protanopia/);
    await assert.rejects(exportResult(result, dest));
    const failed = generate({
      base: "#345678",
      locked: { dark: { text: "#000000", background: "#000000" } },
    });
    await exportResult(failed, path.join(root, "fail"));
    assert.deepEqual(await readdir(path.join(root, "fail")), ["palette.json"]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("bundle matches recorded hash and carries pinned license notices", async () => {
  const dir = new URL("../skills/dazzler-frontend/scripts/vendor/", import.meta.url);
  const provenance = JSON.parse(await readFile(new URL("provenance.json", dir)));
  const bundle = await readFile(new URL("color-engine.mjs", dir));
  assert.equal(createHash("sha256").update(bundle).digest("hex"), provenance.sha256);
  assert.deepEqual(
    provenance.packages.map((p) => p.version),
    ["0.3.1", "4.0.2"],
  );
  assert.match(await readFile(new URL("culori-LICENSE.txt", dir), "utf8"), /Dan Burzo/);
  assert.match(
    await readFile(new URL("ankhorage-color-theory-LICENSE.txt", dir), "utf8"),
    /Ankhorage/,
  );
});
