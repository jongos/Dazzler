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

const taskFixture = () => ({
  medium: "application",
  activity: "operate",
  requirements: ["Keep the brand"],
  tasks: [
    {
      id: "borrow",
      goal: "Record a loan",
      activity: "operate",
      priority: "primary",
      completion: "Loan is saved",
    },
    {
      id: "compare",
      goal: "Compare equipment",
      activity: "compare",
      priority: "supporting",
      completion: "Differences remain visible",
    },
  ],
  contexts: [
    { id: "wide", density: { activities: ["scan"], contentVolume: "large" } },
    { id: "narrow", density: { crowding: true, inputMode: "touch" } },
  ],
});

test("Task contracts retain every task and never infer completion", () => {
  for (const [medium, kind] of [
    ["website", "interface"],
    ["application", "interface"],
    ["document", "document"],
    ["slides", "slides"],
  ]) {
    const composition = { ...taskFixture(), medium };
    const before = structuredClone(composition);
    const p = planWorkflow({ kind, composition });
    assert.deepEqual(
      p.composition.contract.tasks.map(({ coverage, structures, ...t }) => t),
      composition.tasks,
    );
    assert(
      p.composition.contract.tasks.every(
        (t) => t.coverage === "unverified" && t.structures.length === 2,
      ),
    );
    assert.deepEqual(p.composition.contract.constraints, composition.requirements);
    assert.deepEqual(composition, before);
    assert(p.checks.every((c) => c.status === "not-run"));
  }
});

test("Contexts use their own evidence but inherit explicit shared density constraints", () => {
  const composition = taskFixture();
  assert.deepEqual(
    planWorkflow({ composition }).composition.densityContexts.map((c) => c.plan.selected),
    ["tighter", "roomier"],
  );
  for (const density of [
    { locked: true },
    { preference: "comfortable" },
    { preference: "balanced" },
  ]) {
    const p = planWorkflow({ density, composition });
    assert(p.composition.densityContexts.every((c) => c.plan.selected === p.density.selected));
  }
  assert(
    planWorkflow({ intent: "compact", composition }).composition.densityContexts.every(
      (c) => c.plan.selected === "tighter",
    ),
  );
  assert(
    planWorkflow({
      intent: "compact",
      density: { preference: "comfortable" },
      composition,
    }).composition.densityContexts.every((c) => c.plan.selected === "roomier"),
  );
  const p = planWorkflow({ density: { crowding: true }, composition });
  assert.equal(p.composition.densityContexts[0].plan.selected, "tighter");
  const nested = {
    ...composition,
    contexts: [
      {
        id: "mobile",
        density: {
          locked: false,
          preference: "compact",
          regions: [{ id: "actions", locked: false, preference: "compact" }],
        },
      },
    ],
  };
  assert.equal(
    planWorkflow({ density: { locked: true }, composition: nested }).composition.densityContexts[0]
      .plan.regions[0].selected,
    "current",
  );
});

test("Preserved work suppresses task structures, density changes and optional refinement", () => {
  for (const extra of [
    { scope: "small" },
    { intent: "audit" },
    { composition: { ...taskFixture(), existingSystem: true } },
  ]) {
    const p = planWorkflow({ composition: taskFixture(), ...extra }).composition;
    assert.equal(p.refinementBudget, null);
    assert.deepEqual(p.alternatives, []);
    assert(p.contract.tasks.every((t) => t.structures.length === 0 && t.coverage === "unverified"));
    assert(p.densityContexts.every((c) => c.plan.selected === "current"));
  }
  assert.equal(planWorkflow({}).composition.refinementBudget, null);
  assert.equal(
    planWorkflow({ composition: { medium: "website" } }).composition.refinementBudget,
    null,
  );
  const budget = planWorkflow({ composition: taskFixture() }).composition.refinementBudget;
  assert.equal(budget.candidateRounds, 1);
  assert.equal(budget.optionalRevisionPasses, 1);
  assert.match(budget.stop, /Do not waive correctness or accessibility/);
});

test("Task and context contracts reject malformed and oversized inputs", () => {
  const t = taskFixture().tasks[0];
  for (const tasks of [
    null,
    {},
    [null],
    [{ ...t, priority: "optional" }],
    [{ ...t, activity: "__proto__" }],
    [{ ...t, completion: " " }],
    [{ ...t, id: "x".repeat(81) }],
    [{ ...t, goal: "x".repeat(1001) }],
    [t, t],
    Array.from({ length: 25 }, (_, i) => ({ ...t, id: String(i) })),
  ])
    assert.throws(() => planWorkflow({ composition: { ...taskFixture(), tasks } }));
  for (const contexts of [
    null,
    {},
    [null],
    [{ id: "a", density: null }],
    [{ id: "a", density: { unknown: true } }],
    [
      { id: "a", density: {} },
      { id: "a", density: {} },
    ],
    Array.from({ length: 9 }, (_, i) => ({ id: String(i), density: {} })),
  ])
    assert.throws(() => planWorkflow({ composition: { ...taskFixture(), contexts } }));
});
