import test from "node:test";
import assert from "node:assert/strict";
import { planWorkflow } from "../skills/dazzler-frontend/scripts/workflow.mjs";

test("Composition follows activity across all four media without forcing a theme", () => {
  for (const [medium, kind, activity] of [
    ["website", "interface", "discover"],
    ["application", "interface", "operate"],
    ["document", "document", "read"],
    ["slides", "slides", "decide"],
  ]) {
    const task = {
      kind,
      composition: {
        medium,
        activity,
        content: ["text"],
        requirements: ["Exact brand colors; retain approved headings"],
      },
    };
    const before = structuredClone(task);
    const plan = planWorkflow(task);
    assert.equal(plan.composition.status, "provisional");
    assert.equal(new Set(plan.composition.alternatives.map((a) => a.id)).size, 2);
    assert.deepEqual(plan.composition.requirements, task.composition.requirements);
    assert(plan.references.includes("composition-decisions.md"));
    assert(!Object.hasOwn(plan.composition, "palette"));
    assert.deepEqual(task, before);
    assert(plan.checks.every((c) => c.status === "not-run"));
  }
  const compare = planWorkflow({ composition: { medium: "application", activity: "compare" } });
  const operate = planWorkflow({ composition: { medium: "application", activity: "operate" } });
  assert.notDeepEqual(compare.composition.alternatives, operate.composition.alternatives);
});

test("Composition preserves existing work and unknown context", () => {
  for (const extra of [
    { scope: "small" },
    { intent: "audit" },
    { composition: { medium: "website", activity: "discover", existingSystem: true } },
  ]) {
    const result = planWorkflow({
      composition: { medium: "website", activity: "discover" },
      ...extra,
    });
    assert.equal(result.composition.status, "preserve");
    assert.deepEqual(result.composition.alternatives, []);
  }
  assert.equal(planWorkflow({}).composition.status, "needs-interpretation");
  assert.equal(planWorkflow({ kind: "document" }).composition.status, "needs-interpretation");
  assert(!Object.hasOwn(planWorkflow({ kind: "chart" }), "composition"));
});

test("Composition rejects conflicting kinds and malformed context", () => {
  for (const composition of [
    null,
    [],
    { medium: "slides" },
    { activity: "__proto__" },
    { content: ["images", "images"] },
    { requirements: [null] },
    { existingSystem: "yes" },
    { palette: "red" },
  ])
    assert.throws(() => planWorkflow({ composition }));
  assert.throws(() => planWorkflow({ kind: "chart", composition: {} }));
});
