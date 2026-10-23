import test from "node:test";
import assert from "node:assert/strict";
import {
  planWorkflow,
  assessEvidence,
  CASE_REQUIREMENTS,
} from "../skills/dazzler-frontend/scripts/workflow.mjs";
import { route } from "../skills/dazzler-frontend/scripts/route.mjs";
const features = ["coordinatedViews", "operationalState", "expertSettings"];
test("Context-specific capabilities route to references, stable IDs and required evidence", () => {
  const plan = planWorkflow({ features, density: { activities: ["scan"] } });
  assert.equal(plan.density.selected, "tighter");
  for (const [id, ref] of [
    ["coordinatedViews", "coordinated-views.md"],
    ["operationalState", "operational-state.md"],
    ["expertSettings", "expert-settings.md"],
  ]) {
    assert(plan.references.includes(ref));
    assert(plan.checks.find((c) => c.id === id).requiredCases.length);
    assert(!planWorkflow({ scope: "small" }).references.includes(ref));
  }
  assert.equal(
    route({ workflow: { features, density: { activities: ["read"] } } }).workflow.density.selected,
    "roomier",
  );
  assert.equal(planWorkflow({ intent: "compact" }).density.selected, "tighter");
  assert.equal(
    planWorkflow({ intent: "compact", density: { locked: true } }).density.selected,
    "current",
  );
});
test("Named cases cannot conceal missing, failed, unavailable or all-excluded behavior", () => {
  for (const [id, names] of Object.entries(CASE_REQUIREMENTS)) {
    const base = { task: { features }, target: "synthetic", revision: "r1", observations: [] };
    const cases = names.map((name) => ({
      name,
      status: "pass",
      detail: "Synthetic schema test only",
    }));
    const observation = { id, status: "pass", detail: "Fixture", evidence: ["fixture-log"], cases };
    assert.doesNotThrow(() => assessEvidence({ ...base, observations: [observation] }));
    for (const broken of [
      undefined,
      cases.slice(1),
      cases.map((c) => ({ ...c, status: "excluded" })),
      cases.map((c, i) => (i ? c : { ...c, status: "not-run" })),
      cases.map((c, i) => (i ? c : { ...c, status: "fail" })),
    ])
      assert.throws(() =>
        assessEvidence({ ...base, observations: [{ ...observation, cases: broken }] }),
      );
    assert.throws(() =>
      assessEvidence({ ...base, observations: [{ ...observation, cases: [...cases, cases[0]] }] }),
    );
    const unrun = assessEvidence({
      ...base,
      observations: [{ id, status: "not-run", detail: "No renderer", evidence: [] }],
    });
    assert(unrun.missing.includes(id));
  }
});

test("Explicit compact intent survives context and malformed density is rejected", () => {
  assert.equal(
    planWorkflow({ intent: "compact", density: { activities: ["read"] } }).density.selected,
    "tighter",
  );
  assert.equal(planWorkflow({ scope: "small" }).density.selected, "current");
  assert.throws(() => planWorkflow({ density: null }));
});
