import test from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, cp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  inspectDistribution,
  negotiate,
} from "../skills/dazzler-frontend/scripts/gdc/consumer.mjs";
import {
  assessChoice,
  decisionFingerprint,
} from "../skills/dazzler-frontend/scripts/gdc/decision.mjs";
import { compareCanvas } from "../skills/dazzler-frontend/scripts/gdc/canvas.mjs";
import { fingerprint } from "../skills/dazzler-frontend/scripts/gdc/engine.mjs";
import { reviewScience } from "../skills/dazzler-frontend/scripts/style-science.mjs";
const dir = fileURLToPath(new URL("../skills/dazzler-frontend/scripts/gdc/", import.meta.url));
const load = async (name) => JSON.parse(await readFile(path.join(dir, name), "utf8"));
const contract = {
  id: "comparison",
  identityPolicy: "1.0.0",
  context: { task: "Compare three plans", audience: "New members" },
  requiredContext: ["task", "audience"],
  options: {
    aligned: "Aligned complete design",
    narrative: "Sequential complete design",
    unknown: "Insufficient evidence",
  },
  abstainOptions: ["unknown"],
};
function observations(c = contract) {
  return ["baseline", "reordered", "relabeled"].map((variant) => ({
    variant,
    contractHash: decisionFingerprint(c),
    provider: "typesafe",
    requestedModel: "jev-latest",
    resolvedModel: "jev-1.13.0",
    optionMap: { a: "aligned", b: "narrative", u: "unknown" },
    answer: { choice: "a", confidence: 0.8, probabilities: { a: 0.8, b: 0.1, u: 0.1 } },
  }));
}
function snapshots(plan) {
  return plan.environments.map((environment) => ({
    environment,
    planHash: fingerprint(plan),
    measurements: {
      overflow: { scrollWidth: environment.width, clientWidth: environment.width },
      title: { visible: true, text: "GDC probe" },
      contrast: { foreground: "#000000", background: "#ffffff" },
      lock: { value: "rgb(0, 0, 0)" },
    },
  }));
}
test("Consumer distinguishes available instruments from unsupported and unknown claims", async () => {
  const inspection = await inspectDistribution(dir, await load("provenance.json"));
  assert.equal(inspection.status, "verified");
  const result = negotiate(inspection, {
    contractVersion: "1.0.0",
    planSchema: 1,
    modules: ["core", "decision", "canvas", "retrieval"],
    checks: ["model-choice", "word-pagination", "new-check"],
  });
  assert.equal(result.status, "partial");
  assert.deepEqual(
    result.checks.map((x) => x.status),
    ["supported", "unsupported", "unknown"],
  );
  const temp = await mkdtemp(path.join(tmpdir(), "dazzler-consumer-"));
  try {
    await cp(dir, temp, { recursive: true });
    await writeFile(path.join(temp, "decision.mjs"), "tampered");
    assert.equal(
      (await inspectDistribution(temp, await load("provenance.json"))).status,
      "invalid",
    );
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
test("Advisory evidence preserves missing, stale, mixed, tied and unstable states", () => {
  const obs = observations();
  assert.equal(assessChoice(contract, obs).status, "advisory");
  for (const [mutate, status] of [
    [(x) => (x[0].contractHash = "stale"), "stale"],
    [(x) => (x[0].resolvedModel = null), "needs-model"],
    [(x) => (x[0].provider = "openai"), "model-mismatch"],
    [
      (x) => {
        x[0].answer.choice = "b";
        x[0].answer.probabilities = { a: 0.1, b: 0.8, u: 0.1 };
      },
      "unstable",
    ],
  ]) {
    const x = structuredClone(obs);
    mutate(x);
    assert.equal(assessChoice(contract, x).status, status);
  }
  assert.equal(assessChoice({ ...contract, context: {} }, obs).status, "needs-context");
  assert.equal(
    assessChoice(
      contract,
      obs.map((o) => ({ ...o, resolvedModel: "jev-latest" })),
    ).releaseEligible,
    false,
  );
  assert.equal(
    assessChoice(
      contract,
      obs.map((o) => ({
        ...o,
        answer: { choice: "a", confidence: 0, probabilities: { a: 0.45, b: 0.45, u: 0.1 } },
      })),
    ).status,
    "ambiguous",
  );
});
test("Measured comparisons reject stale outcomes and cannot override feasibility", async () => {
  const plan = await load("example-plan.json"),
    snap = snapshots(plan);
  const spec = {
    context: "Synthetic task fixture",
    metrics: [
      {
        id: "time",
        unit: "ms",
        instrument: "fixture-clock",
        direction: "minimize",
        minimumEffect: 5,
      },
    ],
  };
  const artifact = (id, lower, upper) => ({
    id,
    revision: id + "-1",
    snapshots: snap,
    outcomes: plan.environments.map((e) => ({
      environment: e.id,
      metric: "time",
      unit: "ms",
      instrument: "fixture-clock",
      context: spec.context,
      artifactRevision: id + "-1",
      source: "measurement",
      lower,
      upper,
    })),
  });
  const baseline = artifact("before", 100, 110),
    candidate = artifact("after", 70, 80);
  assert.equal(compareCanvas(plan, baseline, candidate, spec).results[0].status, "improved");
  candidate.outcomes[0].artifactRevision = "old";
  assert.equal(compareCanvas(plan, baseline, candidate, spec).status, "incomplete");
  candidate.snapshots = [];
  assert.equal(compareCanvas(plan, baseline, candidate, spec).status, "blocked");
  const report = await reviewScience({
    operation: "decision",
    plan,
    snapshots: [],
    contract,
    observations: observations(),
  });
  assert.equal(
    report.status,
    Number(process.versions.node.split(".")[0]) < 22 ? "unsupported" : "blocked",
  );
  assert.equal(report.releaseEligible, false);
  assert.equal(report.automaticAction, false);
  await assert.rejects(() => reviewScience({ operation: "infer" }));
});
test("Python and JavaScript agree on Unicode identities and advisory evidence", () => {
  const c = { ...contract, context: { ...contract.context, "😀": "astral", "！": "fullwidth" } },
    obs = observations(c);
  const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
  const run = spawnSync(
    python,
    [
      "-X",
      "utf8",
      "-c",
      "import json,sys; from decision import assess_choice; x=json.load(sys.stdin); print(json.dumps(assess_choice(x['contract'],x['observations'])))",
    ],
    { cwd: dir, encoding: "utf8", input: JSON.stringify({ contract: c, observations: obs }) },
  );
  assert.equal(run.status, 0, run.stderr || String(run.error));
  assert.deepEqual(JSON.parse(run.stdout), assessChoice(c, obs));
});
