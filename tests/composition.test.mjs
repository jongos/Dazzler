import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import test from "node:test";
import assert from "node:assert/strict";
import { recommend, catalog } from "../skills/dazzler-frontend/scripts/layouts.mjs";
import { resolveRefinement } from "../skills/dazzler-frontend/scripts/refinement.mjs";
import { tokens } from "../skills/dazzler-frontend/scripts/studio.mjs";
import { resumeConfig } from "../skills/dazzler-frontend/scripts/design-record.mjs";
import { reviewComposition } from "../skills/dazzler-frontend/scripts/composition.mjs";
import { route } from "../skills/dazzler-frontend/scripts/route.mjs";
test("Purpose routing ranks content matches and reports incomplete contracts", () => {
  assert.equal(catalog.layouts.length, 8);
  for (const layout of catalog.layouts) {
    const input = { task: layout.tasks[0], content: layout.content };
    assert.equal(recommend(input).recommendations[0].id, layout.id);
    assert.deepEqual(recommend(input), recommend(input));
  }
  assert.equal(recommend({ task: "unknown", content: [] }).status, "insufficient-context");
  assert(
    recommend({ task: "apply", content: ["fields"] }).recommendations[0].missingContent.includes(
      "submit",
    ),
  );
  assert.throws(() => recommend({ task: "apply", content: "fields" }));
});
test("Refinement rejects invalid controls and critique cannot generate edits", () => {
  for (const value of [0, 11, -1, 1.5, NaN, Infinity, "4", null])
    assert.throws(() => resolveRefinement({ density: value }));
  assert.throws(() => resolveRefinement({ publish: true }));
  assert.throws(() => resolveRefinement({ intent: "unknown" }));
  assert.throws(() => resolveRefinement({ intent: null }));
  assert(resolveRefinement({ intent: "critique" }).readOnly);
  assert.throws(() => tokens({ refinement: { intent: "critique" } }));
  const badCommand = spawnSync(
    process.execPath,
    [
      "skills/dazzler-frontend/scripts/studio.mjs",
      "import-design",
      "--config",
      "missing-design.md",
      "--out",
      "unused-output",
      "--intent",
      "critique",
    ],
    { encoding: "utf8" },
  );
  assert.equal(badCommand.status, 1);
  assert.match(badCommand.stderr, /Refinement flags require tokens/);
  assert.throws(() => resolveRefinement({ intent: "critique", density: 2 }));
  assert.throws(() => tokens({ schemaVersion: 1, refinement: { density: 2 } }));
  for (const intent of [
    "bolder",
    "quieter",
    "typeset",
    "colorize",
    "polish",
    "harden",
    "distill",
  ]) {
    const result = resolveRefinement({ intent });
    assert(result.preserve.includes("Required content and controls"));
    assert(result.procedure.length >= 2);
  }
});
test("Bolder planning preserves explicit tokens and does not add motion or recolor", () => {
  const input = {
    typography: { maxRatio: 1.3 },
    spacing: { 4: 2 },
    motion: { normal: 0 },
    fonts: { body: "Work Sans", heading: "Young Serif" },
    colors: {
      base: "#123456",
      locked: { light: { brand: "#123456" }, dark: { brand: "#123456" } },
    },
  };
  const before = structuredClone(input);
  const plain = tokens(input);
  const bold = tokens({ ...input, refinement: { intent: "bolder", variance: 2 } });
  assert.deepEqual(input, before);
  assert.equal(bold.system.typography.steps.step1.maxRem, 1.3);
  assert.equal(bold.system.spacing[4], 2);
  assert.equal(bold.system.motion.normal, 0);
  assert.deepEqual(bold.system.palette, plain.system.palette);
  assert.deepEqual(bold.system.fonts, plain.system.fonts);
  const plan = resolveRefinement({ intent: "bolder", variance: 2 });
  assert.equal(plan.effective.variance, 2);
  assert.equal(plan.effective.motion, "auto");
  assert(plan.procedure.some((step) => step.includes("adjacent sections")));
  assert(plan.procedure.some((step) => step.includes("before and after")));
  assert(route({ refinement: { intent: "bolder" } }).refinement.procedure.length > 2);
});
test("Dial values are deterministic and monotone for numeric token effects, with constraints intact", () => {
  let previous = null;
  for (let value = 1; value <= 10; value++) {
    const input = {
      fonts: { body: "Work Sans", heading: "Young Serif" },
      colors: {
        base: "#123456",
        locked: { light: { brand: "#123456" }, dark: { brand: "#123456" } },
      },
      refinement: { variance: value, density: value, motion: value },
    };
    const saved = structuredClone(input),
      result = tokens(input);
    assert.deepEqual(input, saved);
    assert.deepEqual(tokens(input), result);
    assert.equal(result.system.palette.modes.light.tokens.brand, "#123456");
    assert.equal(result.system.type.step0, 1);
    assert(result.css.includes("--target-min:44px"));
    assert(result.css.includes("prefers-reduced-motion"));
    if (previous) {
      assert(result.system.spacing[4] < previous.system.spacing[4]);
      assert(result.system.motion.normal > previous.system.motion.normal);
      assert(
        result.system.typography.steps.step6.maxRem > previous.system.typography.steps.step6.maxRem,
      );
    }
    previous = result;
  }
  assert.throws(() => tokens({ baseSize: 12, refinement: { density: 10 } }));
  const fixed = tokens({
    typography: { maxRatio: 1.3 },
    spacing: { 4: 2 },
    motion: { normal: 150 },
    refinement: { variance: 10, density: 10, motion: 10 },
  });
  assert.equal(fixed.system.spacing[4], 2);
  assert.equal(fixed.system.motion.normal, 150);
  assert.equal(fixed.system.typography.steps.step1.maxRem, 1.3);
});
test("Saved refinement resumes without cumulative drift; omitted controls preserve schema defaults", () => {
  const first = tokens({ refinement: { intent: "bolder", density: 7 } });
  assert.deepEqual(tokens(resumeConfig(first.system)), first);
  assert.deepEqual(tokens({}), tokens({ schemaVersion: 3 }));
  const plain = tokens({ schemaVersion: 1 });
  assert.equal(plain.system.schemaVersion, 1);
  assert(!plain.system.refinement);
  const routed = route({
    refinement: { intent: "critique" },
    composition: { task: "menu", content: ["items", "categories"] },
  });
  assert(routed.refinement.readOnly);
  assert.equal(routed.composition.recommendations[0].id, "catalog-menu");
});
const node = (id) => ({
  nodeId: id,
  parentId: 0,
  tag: "ARTICLE",
  width: 200,
  height: 150,
  fontSize: 16,
  weight: 400,
  padding: "16px",
  radius: "12px",
  shadow: "0 2px 4px #000",
  surface: true,
});
test("Review candidates keep evidence and exceptions separate from failures", () => {
  const nodes = Array.from({ length: 6 }, (_, i) => node(i + 1));
  const report = reviewComposition(nodes);
  assert(report.findings.some((f) => f.rule === "repeated-card-geometry"));
  assert(report.findings.every((f) => f.severity === "review" && f.nodeIds.length));
  const retained = reviewComposition(nodes, { purpose: "catalog-menu" });
  assert(retained.findings.every((f) => f.exceptionReason && f.status === "retained-candidate"));
  const explicit = reviewComposition(nodes, {
    exceptions: [{ rule: "pervasive-chrome", reason: "Customer-selected tile treatment" }],
  });
  assert(explicit.findings.find((f) => f.rule === "pervasive-chrome").exceptionReason);
  assert.equal(reviewComposition(nodes, false).status, "not-requested");
  assert.throws(() => reviewComposition(nodes, { exceptions: [{ rule: "unknown", reason: "" }] }));
  assert.throws(() => reviewComposition(Array(1501).fill(node(1))));
});

test("Omitted controls preserve published 0.18 defaults and exact export strings", () => {
  const fixture = JSON.parse(
    readFileSync(new URL("./fixtures/phase4-defaults.json", import.meta.url), "utf8"),
  );
  for (const c of fixture.cases)
    assert.equal(
      createHash("sha256")
        // V8 versions vary below meaningful precision in color diagnostics.
        // Normalize numeric metadata only; every exported string stays exact.
        .update(
          JSON.stringify(
            tokens({ ...c.input, schemaVersion: c.input.schemaVersion ?? 2 }),
            (_, v) => (typeof v === "number" ? +v.toPrecision(12) : v),
          ),
        )
        .digest("hex"),
      c.normalizedSha256,
    );
});
