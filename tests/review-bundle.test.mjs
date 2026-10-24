import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { sealBundle, verifyBundle } from "../skills/dazzler-frontend/scripts/review-bundle.mjs";
import { planWorkflow } from "../skills/dazzler-frontend/scripts/workflow.mjs";

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dazzler-evidence-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const name of ["index.html", "styles.css", "capture.png"])
    fs.writeFileSync(path.join(root, name), name);
  const judgments = {
    idea: "A venue itinerary",
    relationship: "Times aligned with stops",
    tradeoff: "Less room for imagery",
  };
  for (const key of ["correctness", "taskSupport", "craft", "distinctiveness"])
    judgments[key] = {
      status: "supported",
      reason: "Observed in the fixture",
      evidence: ["capture.png"],
    };
  return {
    root,
    spec: {
      revision: "r1",
      inputs: ["index.html", "styles.css"],
      captures: ["capture.png"],
      judgments,
    },
  };
}
test("Detects changed dependencies and stale or missing captures without changing judgments", (t) => {
  const { root, spec } = fixture(t);
  spec.judgments.craft.status = "needs-work";
  const bundle = sealBundle(root, spec);
  assert.equal(verifyBundle(root, bundle).current, true);
  assert.deepEqual(verifyBundle(root, bundle).needsReview, ["craft"]);
  fs.writeFileSync(path.join(root, "styles.css"), "changed");
  fs.unlinkSync(path.join(root, "capture.png"));
  assert.deepEqual(verifyBundle(root, bundle).changed, ["styles.css", "capture.png"]);
});
test("Rejects escaping paths, duplicate entries and unsupported evidence", (t) => {
  const { root, spec } = fixture(t);
  for (const file of ["../outside", "/etc/passwd", "C:/private", "a/../index.html", "a\\b"])
    assert.throws(() => sealBundle(root, { ...spec, inputs: [file] }));
  assert.throws(() => sealBundle(root, { ...spec, captures: ["capture.png", "capture.png"] }));
  spec.judgments.craft.evidence = ["unlisted.png"];
  assert.throws(() => sealBundle(root, spec));
  spec.judgments.craft.evidence = [];
  assert.throws(() => sealBundle(root, spec));
  spec.judgments.craft.status = "not-reviewed";
  assert.deepEqual(verifyBundle(root, sealBundle(root, spec)).needsReview, ["craft"]);
});
test("Plans medium-specific execution without replacing constraints or small-edit scope", () => {
  const slices = new Set();
  for (const medium of ["website", "application", "document", "slides"]) {
    const task = {
      kind: ["website", "application"].includes(medium) ? "interface" : medium,
      composition: { medium, activity: "decide", requirements: ["Keep our brand"] },
    };
    const plan = planWorkflow(task);
    assert(plan.references.includes("execution-review.md"));
    assert.deepEqual(plan.composition.requirements, ["Keep our brand"]);
    slices.add(plan.composition.execution.slice);
    assert.equal(planWorkflow({ ...task, scope: "small" }).composition.execution, null);
    assert.equal(planWorkflow({ ...task, intent: "audit" }).composition.execution, null);
  }
  assert.equal(slices.size, 4);
  assert.equal(planWorkflow({}).composition.execution, null);
});
