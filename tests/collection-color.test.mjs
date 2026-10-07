import test from "node:test";
import assert from "node:assert/strict";
import { reviewCollection } from "../skills/dazzler-frontend/scripts/collection-color.mjs";
test("Collection review flags pale repetition even across different hues", () => {
  const r = reviewCollection(
    ["#EEF3FF", "#FAF5EC", "#F1F6E9", "#F5EFFF", "#EAF5F5"].map((background, i) => ({
      id: String(i),
      background,
    })),
  );
  assert.ok(r.flags.length);
  assert.equal(r.requiresVisualReview, true);
});
test("Color range is advisory and rejects ambiguous input", () => {
  const r = reviewCollection(
    ["#FFFFFF", "#FF3191", "#091522", "#4821CE", "#C9FF32"].map((background, i) => ({
      id: String(i),
      background,
    })),
  );
  assert.equal(r.flags.length, 0);
  assert.throws(() => reviewCollection([{ id: "x", background: "transparent" }]));
  assert.throws(() =>
    reviewCollection([
      { id: "x", background: "#FFFFFF" },
      { id: "x", background: "#000000" },
    ]),
  );
});
