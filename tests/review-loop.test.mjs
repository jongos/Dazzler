import test from "node:test";
import assert from "node:assert/strict";
import { summarize, runReview } from "../skills/dazzler-frontend/scripts/review-loop.mjs";
import { renderFeedback } from "../skills/dazzler-frontend/scripts/review-feedback.mjs";
import { planWorkflow } from "../skills/dazzler-frontend/scripts/workflow.mjs";
const result = () => ({
  reports: [{ findings: [], designReview: [], notRun: [] }],
  pageErrors: [],
});
test("Executed scans cannot erase remaining review or turn into quality approval", () => {
  const plan = planWorkflow({ kind: "interface", intent: "audit" });
  assert(plan.references.includes("review-loop.md"));
  const clean = summarize(plan, result(), "r1", true);
  assert.equal(clean.status, "review-needed");
  assert(clean.readOnly);
  assert(clean.remainingChecks.every((c) => c.status === "not-run"));
  assert.match(clean.nextAction, /do not edit/);
  const dirty = result();
  dirty.reports[0].findings.push({ check: "form-label" });
  assert.equal(summarize(plan, dirty, "r1", true).status, "findings");
  dirty.reports[0].notRun.push({ reason: "unsupported" });
  dirty.reports[0].findings = [];
  assert.equal(summarize(plan, dirty, "r1", true).status, "incomplete");
  dirty.pageErrors.push("failure");
  assert.equal(summarize(plan, dirty, "r1", true).status, "blocked");
  assert.equal(summarize(plan, dirty, "r1", false).status, "stale");
});
test("Feedback escapes imported text and refuses remote or active screenshot paths", () => {
  const r = result();
  r.reports[0] = {
    findings: [{ check: "<script>alert(1)</script>", selector: "body descendant 1" }],
    designReview: [],
    screenshot: "javascript:alert(1)",
    captureSize: { width: 100, height: 100 },
    elementBoxes: { "body descendant 1": { x: 1, y: 1, width: 30, height: 30 } },
  };
  const html = renderFeedback(r);
  assert(!html.includes("<script>"));
  assert(!html.includes('href="javascript:'));
  assert(html.includes("&lt;script&gt;"));
  assert(html.includes("Capture unavailable"));
  r.reports[0].screenshot = "390-baseline.png";
  const marked = renderFeedback(r);
  assert(marked.includes('href="#finding-0-0"'));
  assert(marked.includes('aria-label="Finding 1:'));
});
test("Native formats and malformed review requests are rejected before output", async () => {
  await assert.rejects(
    runReview({ target: "x", revision: "r", task: { kind: "document" }, files: ["x"] }, "unused"),
    /native/,
  );
  await assert.rejects(
    runReview({ target: "x", revision: "r", files: [], unknown: true }, "unused"),
    /Invalid/,
  );
  await assert.rejects(runReview({ target: "x", revision: "r", files: [] }, "unused"), /1–64/);
});
