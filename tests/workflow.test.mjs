import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { planWorkflow, assessEvidence } from "../skills/dazzler-frontend/scripts/workflow.mjs";
import { resolveRefinement } from "../skills/dazzler-frontend/scripts/refinement.mjs";
import { route } from "../skills/dazzler-frontend/scripts/route.mjs";
import { tokens } from "../skills/dazzler-frontend/scripts/studio.mjs";

test("Workflow scope routes relevant checks without requiring unrelated runtimes", () => {
  const small = planWorkflow({ scope: "small" });
  assert(!small.checks.some((c) => c.id === "performance"));
  assert(!small.checks.some((c) => c.id === "editability"));
  const doc = planWorkflow({ kind: "document", features: ["editable", "data"] });
  for (const id of ["print", "editability", "data", "accessibility"])
    assert(doc.checks.some((c) => c.id === id));
  assert(!doc.checks.some((c) => c.id === "responsive"));
  const task = { kind: "interface", framework: "vue", scope: "small", intent: "optimize" };
  const copy = structuredClone(task);
  const performance = planWorkflow(task);
  assert(performance.checks.some((c) => c.id === "performance"));
  assert(performance.checks.some((c) => c.id === "behavior"));
  assert.deepEqual(task, copy);
  assert.deepEqual(planWorkflow(task), performance);
  assert(performance.checks.every((c) => c.status === "not-run"));
});

test("Router integrates shared intent and refuses conflicting workflow context", () => {
  assert(!Object.hasOwn(route({}), "workflow"));
  const routed = route({
    framework: "react",
    refinement: { intent: "audit" },
    workflow: { scope: "small", features: ["forms"] },
  });
  assert(routed.options.readOnly);
  assert(routed.workflow.readOnly);
  assert.equal(routed.workflow.task.framework, "react");
  assert(routed.workflow.checks.some((c) => c.id === "forms"));
  assert.throws(() => route({ workflow: { kind: "document" } }));
  assert.throws(() => route({ workflow: null }));
});

test("Audit stays read-only through routing and token generation", () => {
  assert(resolveRefinement({ intent: "audit" }).readOnly);
  assert.throws(() => resolveRefinement({ intent: "audit", motion: 2 }), /read-only/);
  assert.throws(() => tokens({ refinement: { intent: "audit" } }), /read-only/);
  for (const intent of ["layout", "adapt", "optimize", "clarify", "extract"]) {
    const result = resolveRefinement({ intent });
    assert(!result.readOnly);
    assert.equal(result.effective.motion, "auto");
    assert.equal(result.effective.density, "auto");
    assert(result.procedure.length >= 2);
  }
});

test("Evidence coverage never converts omissions, failures or malformed claims to passes", () => {
  const task = { scope: "small" };
  const input = { task, target: "settings route", revision: "fixture-r1", observations: [] };
  const empty = assessEvidence(input);
  assert.equal(empty.status, "incomplete");
  assert.equal(empty.reportedPasses, 0);
  assert.equal(empty.missing.length, planWorkflow(task).checks.length);
  const observations = planWorkflow(task).checks.map((c) => ({
    id: c.id,
    status: "pass",
    evidence: ["fixture-review.txt"],
    detail: "Synthetic test observation, not a real artifact review",
    ...(c.id === "distinction"
      ? {
          designReview: {
            voice: "Precise editorial",
            promptFit: "Professional memo",
            definingMove: "Decision-led hierarchy",
            supportingChoices: ["Aligned numeric comparisons"],
            restraint: "Monochrome printable body",
            verdict: "distinctive",
          },
        }
      : {}),
  }));
  const complete = assessEvidence({ ...input, observations });
  assert.equal(complete.status, "evidence-complete");
  assert.match(complete.limits, /not independently verified/);
  const copy = structuredClone(observations);
  const mixed = assessEvidence({
    ...input,
    observations: [{ ...observations[0], status: "fail" }],
  });
  assert.equal(mixed.status, "findings");
  assert.equal(mixed.failures.length, 1);
  assert(mixed.missing.length > 0);
  assert.deepEqual(observations, copy);
  for (const bad of [
    [{ ...observations[0], evidence: [] }],
    [observations[0], observations[0]],
    [{ ...observations[0], id: "made-up-check" }],
    [{ ...observations[0], status: "not-applicable" }],
    [{ ...observations[0], detail: " " }],
  ])
    assert.throws(() => assessEvidence({ ...input, observations: bad }));
  assert.throws(() => assessEvidence({ ...input, revision: "" }));
  const pending = assessEvidence({
    ...input,
    observations: [
      { ...observations[0], status: "not-run", evidence: [], detail: "Runtime unavailable" },
    ],
  });
  assert.equal(pending.status, "incomplete");
});

test("Workflow inputs reject unknown fields, invalid enums and oversized or duplicate features", () => {
  for (const input of [
    null,
    [],
    { scope: "tiny" },
    { kind: "email" },
    { framework: "next" },
    { intent: "invented" },
    { features: ["forms", "forms"] },
    { features: "forms" },
    { features: ["backend"] },
    { publish: true },
  ])
    assert.throws(() => planWorkflow(input));
});

test("CLI plans and assesses local JSON without editing inputs", () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), "dazzler-workflow-"));
  try {
    const file = path.join(dir, "task.json");
    writeFileSync(file, JSON.stringify({ kind: "chart" }));
    const run = (command) =>
      spawnSync(process.execPath, ["skills/dazzler-frontend/scripts/workflow.mjs", command, file], {
        encoding: "utf8",
      });
    const planned = run("plan");
    assert.equal(planned.status, 0, planned.stderr);
    assert(JSON.parse(planned.stdout).checks.some((c) => c.id === "data"));
    writeFileSync(
      file,
      JSON.stringify({
        target: "chart.svg",
        revision: "r1",
        task: { kind: "chart" },
        observations: [],
      }),
    );
    const assessed = run("assess");
    assert.equal(assessed.status, 0, assessed.stderr);
    assert.equal(JSON.parse(assessed.stdout).status, "incomplete");
    assert.notEqual(run("invented").status, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("Every format retains a distinction gate and generic claims cannot pass", () => {
  for (const kind of ["interface", "document", "slides", "chart", "illustration"])
    for (const scope of ["small", "substantial"])
      assert(planWorkflow({ kind, scope }).checks.some((c) => c.id === "distinction"));
  const base = { task: { kind: "document" }, target: "fixture memo", revision: "fixture-r2" };
  const observation = {
    id: "distinction",
    status: "pass",
    evidence: ["fixture.png"],
    detail: "Synthetic review",
  };
  assert.throws(() => assessEvidence({ ...base, observations: [observation] }), /design review/);
  const review = {
    voice: "Exacting professional",
    promptFit: "Simple memo",
    definingMove: "Decision and evidence pairing",
    supportingChoices: ["Tabular figures"],
    restraint: "No decoration",
    verdict: "generic",
  };
  assert.throws(
    () => assessEvidence({ ...base, observations: [{ ...observation, designReview: review }] }),
    /cannot pass/,
  );
  const failed = assessEvidence({
    ...base,
    observations: [{ ...observation, status: "fail", designReview: review }],
  });
  assert.equal(failed.status, "findings");
  assert(failed.failures.includes("distinction"));
  const missing = assessEvidence({ ...base, observations: [] });
  assert(missing.missing.includes("distinction"));
  assert(planWorkflow({ intent: "audit" }).readOnly);
});
