import test from "node:test";
import assert from "node:assert/strict";
import { planDensity } from "../skills/dazzler-frontend/scripts/density.mjs";
import { resolveRefinement } from "../skills/dazzler-frontend/scripts/refinement.mjs";

test("Automatic density chooses from task evidence, not profession or page-fill goals", () => {
  assert.equal(planDensity().selected, "balanced");
  assert.equal(planDensity({ existingSystem: true }).selected, "current");
  assert.equal(
    planDensity({ activities: ["scan", "compare"], contentVolume: "large" }).selected,
    "tighter",
  );
  assert.equal(planDensity({ activities: ["read", "learn"] }).selected, "roomier");
  assert.equal(planDensity({ activities: ["compare", "read"] }).selected, "balanced");
  assert.equal(planDensity({ activities: ["scan"], contentVolume: "small" }).selected, "balanced");
  assert.equal(planDensity({ primaryTaskDisplaced: true }).selected, "balanced");
  assert.equal(planDensity({ existingSystem: true, activities: ["batch"] }).selected, "current");
  assert.equal(planDensity({ existingSystem: true, avoidableSpace: true }).selected, "tighter");
});
test("Rendered feedback revises provisional decisions without shrinking text or touch controls", () => {
  const tight = planDensity({ activities: ["scan"], inputMode: "touch" });
  assert.equal(tight.selected, "tighter");
  assert.equal(tight.dimensions.components, "preserve");
  const revised = planDensity({ activities: ["scan"], crowding: true });
  assert.equal(revised.selected, "roomier");
  assert.equal(revised.reviewStatus, "not-run");
  const both = planDensity({ avoidableSpace: true, crowding: true });
  assert.equal(both.selected, "mixed");
  assert.equal(both.dimensions.layout, "tighter");
  assert.equal(both.dimensions.components, "roomier");
  assert.equal(both.dimensions.reading, "preserve-readable-type-and-measure");
  assert.equal(both.provisional, true);
});
test("Regions vary while global preferences and locks remain authoritative", () => {
  const regions = [
    { id: "queue", activities: ["compare"], contentVolume: "large" },
    { id: "explain", activities: ["read"] },
  ];
  const result = planDensity({ regions });
  assert.equal(result.selected, "mixed");
  assert.deepEqual(
    result.regions.map((r) => r.selected),
    ["tighter", "roomier"],
  );
  assert(
    planDensity({ preference: "balanced", regions }).regions.every(
      (r) => r.selected === "balanced",
    ),
  );
  assert(
    planDensity({
      locked: true,
      regions: [{ id: "x", locked: false, preference: "compact" }],
    }).regions.every((r) => r.selected === "current"),
  );
  assert.equal(planDensity({ preference: "compact" }).selected, "tighter");
  assert.equal(planDensity({ preference: "comfortable" }).selected, "roomier");
  assert.deepEqual(planDensity({ locked: true }).candidates, ["current"]);
  assert.equal(resolveRefinement({ intent: "compact" }).effective.density, "auto");
  assert.equal(resolveRefinement({ intent: "compact", density: 7 }).effective.density, 7);
});
test("Density inputs are bounded, reject ambiguous values and do not mutate", () => {
  for (const input of [
    null,
    [],
    { preference: "dense" },
    { avoidableSpace: "false" },
    { locked: 1 },
    { unknown: true },
    { activities: ["compare", "compare"] },
    { activities: ["banker"] },
    { inputMode: "phone" },
    { contentVolume: Infinity },
    { regions: [] },
    { regions: Array.from({ length: 13 }, (_, i) => ({ id: String(i) })) },
    { regions: [{ id: "a" }, { id: "a" }] },
    { regions: [{ id: "a", regions: [{ id: "b" }] }] },
    { regions: [{ id: "" }] },
  ])
    assert.throws(() => planDensity(input));
  const input = { activities: ["read"], regions: [{ id: "body", crowding: true }] };
  const original = structuredClone(input);
  planDensity(input);
  assert.deepEqual(input, original);
});
