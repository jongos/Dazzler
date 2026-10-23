import test from "node:test";
import assert from "node:assert/strict";
import { assessEvidence, planWorkflow } from "../skills/dazzler-frontend/scripts/workflow.mjs";

function fixture() {
  return {
    target: "synthetic route",
    revision: "r2",
    task: { scope: "small" },
    observations: [
      {
        id: "render",
        status: "pass",
        evidence: ["synthetic.png"],
        detail: "Schema fixture only",
        renderReview: {
          revision: "r2",
          views: [
            {
              name: "mobile",
              environment: "Synthetic browser 390x844 at 100%",
              evidence: "synthetic.png",
              detail: "Fixture; no real rendering",
            },
          ],
          findings: [],
        },
      },
    ],
  };
}

test("Render evidence requires matching revision, views and rechecked repairs", () => {
  const good = fixture();
  good.observations[0].renderReview.findings.push({
    issue: "Wrapped control clipped",
    status: "resolved",
    resolution: "Removed fixed height",
    recheckEvidence: "r2-mobile.png",
  });
  const copy = structuredClone(good);
  const result = assessEvidence(good);
  assert.equal(result.results.find((c) => c.id === "render").status, "pass");
  assert.equal(result.status, "incomplete");
  assert.deepEqual(good, copy);
  for (const mutate of [
    (x) => delete x.observations[0].renderReview,
    (x) => (x.observations[0].renderReview.revision = "r1"),
    (x) => (x.observations[0].renderReview.views = []),
    (x) => x.observations[0].renderReview.views.push(x.observations[0].renderReview.views[0]),
    (x) => (x.observations[0].renderReview.views[0].environment = ""),
    (x) => (x.observations[0].renderReview.findings[0].status = "open"),
    (x) => delete x.observations[0].renderReview.findings[0].recheckEvidence,
    (x) => delete x.observations[0].renderReview.findings[0].resolution,
    (x) => (x.observations[0].id = "content"),
    (x) => (x.observations[0].renderReview.findings = null),
    (x) => (x.observations[0].renderReview.views = Array(65).fill({})),
  ]) {
    const bad = structuredClone(good);
    mutate(bad);
    assert.throws(() => assessEvidence(bad));
  }
});

test("Open findings and unavailable rendering remain honest; audits stay read-only", () => {
  const input = fixture();
  input.task.intent = "audit";
  input.observations[0].status = "fail";
  input.observations[0].renderReview.findings = [{ issue: "Clipped label", status: "open" }];
  assert.equal(assessEvidence(input).status, "findings");
  assert.equal(assessEvidence(input).readOnly, true);
  input.observations[0] = {
    id: "render",
    status: "not-run",
    evidence: [],
    detail: "Renderer unavailable",
  };
  assert(assessEvidence(input).missing.includes("render"));
  for (const kind of ["interface", "document", "slides", "chart", "illustration"])
    assert(planWorkflow({ kind }).references.includes("rendered-review.md"));
});
