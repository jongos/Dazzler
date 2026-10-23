import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { reviewFindings, assessMeasurement } from "../skills/dazzler-frontend/scripts/review.mjs";
import { RULES, ruleIdFor } from "../skills/dazzler-frontend/scripts/review-rules.mjs";
import { planWorkflow, assessEvidence } from "../skills/dazzler-frontend/scripts/workflow.mjs";

function observation(ruleId = "DZ-004", consequence = "presentation", scope = "local") {
  return {
    ruleId,
    location: "fixture",
    status: "fail",
    source: "judged",
    verification: "observed",
    evidence: ["synthetic.png"],
    detail: "Synthetic schema fixture only",
    fix: "Repair the observed issue",
    impact: { consequence, scope, reason: "Fixture user impact" },
  };
}
const report = (observations) => ({ target: "synthetic", revision: "r1", observations });

test("Finding-review CLI accepts one file, leaves it unchanged and rejects extra arguments", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "dazzler-review-test-"));
  try {
    const file = path.join(dir, "review.json"),
      content = JSON.stringify(report([observation()]));
    writeFileSync(file, content);
    const run = (...args) =>
      spawnSync(process.execPath, ["skills/dazzler-frontend/scripts/review.mjs", ...args], {
        encoding: "utf8",
      });
    const result = run(file);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).highestLeverage.ruleId, "DZ-004");
    assert.equal(readFileSync(file, "utf8"), content);
    assert.notEqual(run(file, "unexpected").status, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("Stable rule identities cover plans, aliases and the documented registry", () => {
  const expected = [
    "content",
    "render",
    "headings",
    "distinction",
    "edgeCases",
    "responsive",
    "accessibility",
    "behavior",
    "reuse",
    "performance",
    "forms",
    "motion",
    "data",
    "print",
    "editability",
  ];
  expected.forEach((check, i) =>
    assert.equal(ruleIdFor(check), `DZ-${String(i + 1).padStart(3, "0")}`),
  );
  assert.equal(ruleIdFor("heading-transform"), "DZ-003");
  assert.equal(ruleIdFor("horizontal-overflow"), "DZ-006");
  assert.equal(ruleIdFor("unknown"), null);
  const doc = readFileSync("skills/dazzler-frontend/references/review-rules.md", "utf8");
  for (const id of Object.keys(RULES)) assert(doc.includes(id));
  for (const kind of ["interface", "document", "slides", "chart", "illustration"])
    assert(planWorkflow({ kind }).checks.every((c) => RULES[c.ruleId]));
});

test("Impact tiers preserve a single prioritized fix and do not equate taste with compliance", () => {
  const data = report([
    observation(),
    observation("DZ-011", "degraded-task", "shared"),
    observation("DZ-008", "blocked-task", "primary"),
  ]);
  const before = structuredClone(data),
    result = reviewFindings(data);
  assert.deepEqual(
    result.findings.map((f) => f.tier),
    ["blocking", "important", "polish"],
  );
  assert.equal(result.highestLeverage.ruleId, "DZ-008");
  assert.deepEqual(data, before);
  assert.equal(reviewFindings(report([])).highestLeverage, null);
  assert.equal(reviewFindings(report([observation("DZ-001")])).findings[0].tier, "important");
  assert.equal(
    assessEvidence({
      task: {},
      target: "fixture",
      revision: "r1",
      observations: [],
      reviewObservations: data.observations,
    }).status,
    "findings",
  );
});

test("Thresholds preserve precision, applicability, exceptions and existing measure policy", () => {
  const m = {
    applicability: "applies",
    reason: "Applicable rendered pair",
    ratio: 4.4999,
    largeText: false,
  };
  assert.equal(assessMeasurement("DZ-101", m).status, "fail");
  assert.equal(assessMeasurement("DZ-101", { ...m, ratio: 4.5 }).status, "pass");
  assert.equal(assessMeasurement("DZ-101", { ...m, ratio: 3, largeText: true }).status, "pass");
  const target = { applicability: "applies", reason: "Exceptions reviewed", width: 24, height: 24 };
  assert.equal(assessMeasurement("DZ-103", target).status, "pass");
  assert.equal(assessMeasurement("DZ-103", { ...target, width: 23 }).status, "fail");
  assert.equal(
    assessMeasurement("DZ-103", {
      ...target,
      width: 18,
      applicability: "exception",
      reason: "Sufficient spacing verified",
    }).status,
    "excluded",
  );
  assert.equal(
    assessMeasurement("DZ-103", { ...target, applicability: "unknown" }).status,
    "not-run",
  );
  assert.equal(
    assessMeasurement("DZ-104", { applicability: "applies", reason: "Body", measureCh: 60.1 })
      .status,
    "fail",
  );
  assert.throws(() => assessMeasurement("DZ-103", { ...target, width: NaN }));
  assert.throws(() => assessMeasurement("DZ-101", { ...m, width: 24 }));
});

test("Evidence labels, numeric outcomes, missing coverage and malformed input cannot be laundered", () => {
  const measured = {
    ...observation("DZ-101"),
    source: "measured",
    verification: "reproduced",
    measurement: {
      applicability: "applies",
      reason: "Rendered body text",
      ratio: 3,
      largeText: false,
    },
  };
  assert.equal(reviewFindings(report([measured])).findings[0].confidence, "high");
  assert.equal(reviewFindings(report([observation()])).findings[0].confidence, "medium");
  assert.equal(
    reviewFindings(report([{ ...observation(), verification: "inferred" }])).findings[0].confidence,
    "low",
  );
  const pending = {
    ruleId: "DZ-103",
    location: "fixture",
    status: "not-run",
    source: "measured",
    verification: "unavailable",
    evidence: [],
    detail: "Spacing unavailable",
  };
  assert.equal(reviewFindings(report([pending])).notRun[0].confidence, "unavailable");
  for (const bad of [
    { ...measured, status: "pass" },
    { ...measured, verification: "inferred" },
    { ...measured, evidence: [] },
    { ...measured, measurement: undefined },
    { ...measured, ruleId: "missing" },
    { ...measured, ruleId: "toString" },
    { ...measured, confidence: 0.99 },
    { ...measured, impact: { ...measured.impact, scope: "all" } },
    { ...measured, impact: undefined },
    { ...pending, status: "pass" },
    { ...measured, source: "judged" },
    { ...measured, fix: "" },
  ])
    assert.throws(() => reviewFindings(report([bad])));
  assert.throws(() => reviewFindings(report([measured, measured])));
  assert.throws(() => reviewFindings(report(Array(129).fill(pending))));
});
