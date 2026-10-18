import test from "node:test";
import assert from "node:assert/strict";
import { planDensity } from "../skills/dazzler-frontend/scripts/density.mjs";
import { resolveRefinement } from "../skills/dazzler-frontend/scripts/refinement.mjs";
test("Automatic density stays undecided and does not assume either extreme", () => {
  assert.equal(planDensity().selected, null);
  assert.deepEqual(planDensity().candidates, ["current"]);
  assert.deepEqual(planDensity({ avoidableSpace: true }).candidates, ["current", "tighter"]);
  assert.deepEqual(planDensity({ crowding: true }).candidates, ["current", "roomier"]);
  const both = planDensity({ avoidableSpace: true, crowding: true });
  assert.equal(both.selected, null);
  assert.equal(both.candidates.length, 3);
});
test("Explicit preferences respect locks and compact intent does not shrink all spacing", () => {
  assert.equal(planDensity({ preference: "compact" }).selected, "tighter");
  assert.equal(planDensity({ preference: "comfortable" }).selected, "roomier");
  assert.deepEqual(planDensity({ preference: "compact", locked: true }).candidates, ["current"]);
  assert.equal(resolveRefinement({ intent: "compact" }).effective.density, "auto");
  assert.equal(resolveRefinement({ intent: "compact", density: 7 }).effective.density, 7);
});
test("Malformed observations fail and inputs are not mutated", () => {
  for (const input of [
    null,
    [],
    { preference: "dense" },
    { avoidableSpace: "false" },
    { locked: 1 },
    { unknown: true },
  ])
    assert.throws(() => planDensity(input));
  const input = { primaryTaskDisplaced: true };
  planDensity(input);
  assert.deepEqual(input, { primaryTaskDisplaced: true });
});
