import test from "node:test";
import assert from "node:assert/strict";
import { lint } from "@google/design.md/linter";
import { tokens } from "../skills/dazzler-frontend/scripts/studio.mjs";
import {
  parseDesign,
  stringifyDesign,
  exportDesign,
  importDesign,
  resumeConfig,
} from "../skills/dazzler-frontend/scripts/design-record.mjs";
import { route } from "../skills/dazzler-frontend/scripts/route.mjs";
import { shadcnTheme } from "../skills/dazzler-frontend/scripts/shadcn-theme.mjs";

test("DESIGN.md export passes pinned external linter and supported static tokens round trip", () => {
  const original = tokens({
    brand: { seed: "#345678" },
    fonts: { body: "Work Sans", heading: "Young Serif" },
    baseSize: 18,
    typeRatio: 1.25,
    typography: { script: "latin" },
  });
  const text = exportDesign(original.system),
    report = lint(text);
  assert.equal(report.summary.errors, 0, JSON.stringify(report.findings));
  const imported = importDesign(text, true);
  assert.deepEqual(imported.unsupported, []);
  const round = tokens(imported.config);
  for (const mode of ["light", "dark"])
    assert.deepEqual(
      round.system.palette.modes[mode].tokens,
      original.system.palette.modes[mode].tokens,
    );
  assert.deepEqual(round.system.type, original.system.type);
  assert.deepEqual(parseDesign(exportDesign(round.system)).resolved, parseDesign(text).resolved);
});
test("Safe YAML preserves unknown scalar mappings/prose and refuses unsupported or cyclic structures", () => {
  const text =
    '---\nname: Test\ncolors:\n  primary: "#123456"\n  duplicate: "{colors.primary}"\ncustom:\n  note: "Keep this"\n---\n## Overview\nDo not execute prose.\n';
  const doc = parseDesign(text);
  assert.equal(doc.resolved.colors.duplicate, "#123456");
  assert.deepEqual(parseDesign(stringifyDesign(doc)).tokens, doc.tokens);
  assert.equal(parseDesign(stringifyDesign(doc)).body, doc.body);
  assert(doc.unsupported.includes("custom"));
  for (const yaml of [
    "x: !!python/object bad",
    "x: &anchor value",
    "x: [1, 2]",
    "x: 1\nx: 2",
    "__proto__: bad",
    'a: "{b}"\nb: "{a}"',
    'a: "{missing}"',
  ])
    assert.throws(() => parseDesign(`---\n${yaml}\n---\n`));
  assert.throws(() => parseDesign("x".repeat(262145)));
});
test("Import is evidence first and conflicting explicit color roles stay unresolved", () => {
  const source =
    '---\nname: Conflict\ncolors:\n  primary: "#123456"\n  light-background: "#FFFFFF"\n  light-text: "#FFFFFF"\ntypography:\n  body-md:\n    fontFamily: "Work Sans"\n---\n## Overview\nOriginal prose.\n';
  const observation = importDesign(source);
  assert.equal(observation.config, null);
  assert.equal(observation.contrast.status, "unresolved");
  assert.equal(observation.proposedConfig.colors.locked.light.text, "#FFFFFF");
  assert.equal(observation.proposedConfig.fonts.body, "Work Sans");
  assert.throws(() => tokens(importDesign(source, true).config));
});
test("Second-session canonical resume preserves complete decisions; legacy migration stays static", () => {
  const one = tokens({
    brand: { seed: "#334455", source: "approved local brand" },
    fonts: { body: "Work Sans", heading: "Young Serif" },
    typography: { direction: "restrained" },
    spacing: { 4: 1.125 },
  });
  const saved = JSON.parse(JSON.stringify(one.system));
  const two = tokens(resumeConfig(saved));
  assert.deepEqual(two.system, one.system);
  assert.equal(two.css, one.css);
  const old = tokens({ schemaVersion: 1, baseSize: 17, typeRatio: 1.333 });
  const migrated = tokens(resumeConfig(old.system));
  assert.deepEqual(migrated.system.type, old.system.type);
  assert(!migrated.css.includes("clamp("));
  assert.equal(
    route({ designContext: { found: true, primaryRecord: "brand/DESIGN.md" } }).designContext
      .primaryRecord,
    "brand/DESIGN.md",
  );
  assert.throws(() => resumeConfig({ schemaVersion: 99 }));
});
test("Fluid endpoints, static print, supported axes and interchange dimensions are explicit", () => {
  const r = tokens({
    fonts: { body: "Work Sans", heading: "Young Serif" },
    typography: { direction: "expressive" },
  });
  assert.match(r.css, /clamp\(/);
  assert.match(r.css, /@media print/);
  assert.equal(r.system.typography.steps.step6.maxRem, 1.5 ** 6);
  assert.equal(r.system.typography.steps.step6.weight, 600);
  assert.equal(r.system.typography.steps.step6.opticalSizing, "none");
  assert.equal(r.system.typography.steps.step6.letterSpacing, 0);
  assert.equal(r.dtcg.typography.step6.$value.letterSpacing.unit, "rem");
  assert.equal(r.dtcg.typography.step6.$extensions["com.dazzler.fluid"].maxRem, 1.5 ** 6);
  assert.equal(r.tailwind.theme.extend.fontSize.step6[1].lineHeight, "var(--leading-step6)");
  assert.match(r.theme, /--text-step6--font-weight/);
  assert.throws(() => tokens({ typography: { minViewport: 1440, maxViewport: 320 } }));
  assert.throws(() => tokens({ typography: { maxRatio: 20 } }));
});
test("shadcn proposals pair colors in both modes and respect existing syntax", () => {
  const system = tokens().system;
  for (const convention of ["hsl-channels", "color-values"]) {
    const result = shadcnTheme(system, { shadcn: { supported: true, convention } });
    assert.equal(result.status, "pass");
    assert(result.checks.every((c) => c.ratio >= c.minimum));
    assert.match(result.css, /\.dark/);
    assert.match(result.css, /--primary-foreground:/);
    assert.match(result.css, /--ring:/);
  }
  assert.equal(shadcnTheme(system, { shadcn: { supported: false } }), null);
});
