// Original Dazzler task planning and reported-evidence coverage. Apache-2.0.
// No browser execution, network access, project mutation or inferred certification.
import path from "node:path";
import { pathToFileURL } from "node:url";
import { readJSON } from "./runtime.mjs";
import { cli } from "./cli.mjs";
import { resolveRefinement } from "./refinement.mjs";

const checks = {
  distinction:
    "Review the strongest coherent prompt-specific voice: defining move, supporting decisions and restraint. Generic or incoherent output needs revision. For small edits preserve the established voice within scope.",
  content: "Compare required facts, copy, controls and links with the brief",
  render: "Inspect the final rendered affected area and its neighbors",
  headings: "Audit final semantic headings and preserve explicit casing exceptions",
  responsive: "Inspect narrow/wide layouts, zoom and long-content reflow",
  accessibility: "Check semantics, accessible names, keyboard/focus and actual contrast",
  behavior: "Exercise the primary user task and relevant empty/loading/error states",
  reuse: "Compare existing components/tokens with the diff; justify new dependencies",
  performance: "Compare a relevant baseline and result under the same measured conditions",
  forms: "Verify labels, validation, pending submission, recovery and retained input",
  motion: "Verify reduced motion and that content/task completion never waits for animation",
  data: "Reconcile chart/table values, units, missing values and text alternatives",
  print: "Inspect every rendered page for clipping, breaks and readable labels",
  editability:
    "Test longer copy and extra rows in an editable copy; inspect native styles and reading order",
};
function object(value, allowed, label) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).some((k) => !allowed.includes(k))
  )
    throw Error("Invalid " + label);
}
function text(value, label, limit = 2000) {
  if (typeof value !== "string" || !value.trim() || value.length > limit)
    throw Error("Invalid " + label);
  return value;
}
export function planWorkflow(task = {}) {
  object(task, ["kind", "framework", "scope", "intent", "features"], "workflow task");
  const {
    kind = "interface",
    framework = "none",
    scope = "substantial",
    intent = "auto",
    features = [],
  } = task;
  if (!["interface", "document", "slides", "chart", "illustration"].includes(kind))
    throw Error("Unsupported task kind");
  if (!["none", "react", "vue", "other"].includes(framework)) throw Error("Unsupported framework");
  if (!["small", "substantial"].includes(scope)) throw Error("Unsupported scope");
  if (
    !Array.isArray(features) ||
    features.length > 5 ||
    new Set(features).size !== features.length ||
    features.some((f) => !["forms", "motion", "data", "print", "editable"].includes(f))
  )
    throw Error("Invalid workflow features");
  const refinement = resolveRefinement({ intent });
  const ids = new Set(["content", "render", "headings", "distinction"]);
  const references = new Set(["delivery-gates.md", "art-direction.md"]);
  if (["interface", "document"].includes(kind)) references.add("gdc.md");
  if (scope === "substantial") {
    references.add("art-direction.md");
    ids.add("distinction");
  }
  if (kind === "interface") {
    references.add("frontend-engineering.md");
    if (scope === "substantial") references.add("web-design-space.md");
    if (scope === "substantial" || ["audit", "adapt", "layout", "harden"].includes(intent)) {
      ids.add("responsive");
      ids.add("accessibility");
      ids.add("behavior");
    }
    if (scope === "substantial" || intent === "extract") ids.add("reuse");
    ids.add("accessibility");
    if (["audit", "optimize"].includes(intent)) {
      ids.add("performance");
      ids.add("behavior");
    }
  }
  if (["document", "slides"].includes(kind)) {
    references.add("document-design.md");
    if (scope === "substantial") references.add("document-design-space.md");
    references.add("document-archetypes.md");
    ids.add("print");
    ids.add("accessibility");
    if (features.includes("editable")) ids.add("editability");
  }
  if (["chart", "illustration"].includes(kind)) {
    references.add(kind === "chart" ? "visualization.md" : "interactive-illustrations.md");
    ids.add("accessibility");
    if (kind === "chart") ids.add("data");
    else ids.add("behavior");
  }
  for (const feature of features) ids.add(feature === "editable" ? "editability" : feature);
  return {
    schemaVersion: 1,
    task: { kind, framework, scope, intent, features: [...features] },
    readOnly: refinement.readOnly,
    references: [...references],
    procedure: [
      "Identify the user task and authoritative product facts separately from visual choices",
      "Inspect the affected implementation, accepted tokens and reusable components",
      ...refinement.procedure,
      refinement.readOnly
        ? "Report findings with locations and evidence; do not apply changes"
        : "Implement within scope, then inspect the actual result and repair regressions",
    ],
    checks: [...ids].map((id) => ({ id, instruction: checks[id], status: "not-run" })),
    limits:
      "A plan is not execution. Small scopes still require checks for any affected behavior. Add relevant features or use substantial scope when uncertain.",
  };
}

export function assessEvidence(input) {
  object(input, ["task", "target", "revision", "observations"], "evidence report");
  const target = text(input.target, "target"),
    revision = text(input.revision, "revision");
  const plan = planWorkflow(input.task);
  if (!Array.isArray(input.observations) || input.observations.length > 32)
    throw Error("Invalid observations");
  const byId = new Map();
  for (const observation of input.observations) {
    object(observation, ["id", "status", "evidence", "detail", "designReview"], "observation");
    if (!plan.checks.some((c) => c.id === observation.id) || byId.has(observation.id))
      throw Error("Unknown or duplicate check");
    if (!["pass", "fail", "not-run"].includes(observation.status))
      throw Error("Invalid evidence status");
    text(observation.detail, "observation detail");
    if (!Array.isArray(observation.evidence) || observation.evidence.length > 16)
      throw Error("Invalid evidence references");
    observation.evidence.forEach((e) => text(e, "evidence reference"));
    if (observation.status !== "not-run" && !observation.evidence.length)
      throw Error("Reported pass/fail requires evidence references");
    if (observation.designReview !== undefined) {
      if (observation.id !== "distinction") throw Error("Design review belongs to distinction");
      const review = observation.designReview;
      object(
        review,
        ["voice", "promptFit", "definingMove", "supportingChoices", "restraint", "verdict"],
        "design review",
      );
      for (const field of ["voice", "promptFit", "definingMove", "restraint"])
        text(review[field], "design review " + field);
      if (
        !Array.isArray(review.supportingChoices) ||
        review.supportingChoices.length < 1 ||
        review.supportingChoices.length > 8
      )
        throw Error("Describe supporting design choices");
      review.supportingChoices.forEach((value) => text(value, "supporting choice"));
      if (!["distinctive", "generic", "incoherent"].includes(review.verdict))
        throw Error("Invalid design verdict");
      if (observation.status === "pass" && review.verdict !== "distinctive")
        throw Error(
          "Generic or incoherent output cannot pass distinction; revise and render again",
        );
    }
    if (
      observation.id === "distinction" &&
      observation.status === "pass" &&
      !observation.designReview
    )
      throw Error("A distinction pass requires an observed design review");
    byId.set(observation.id, structuredClone(observation));
  }
  const results = plan.checks.map(
    (c) =>
      byId.get(c.id) ?? {
        id: c.id,
        status: "not-run",
        evidence: [],
        detail: "No observation supplied",
      },
  );
  const failures = results.filter((c) => c.status === "fail").map((c) => c.id);
  const missing = results.filter((c) => c.status === "not-run").map((c) => c.id);
  return {
    schemaVersion: 1,
    target,
    revision,
    task: plan.task,
    readOnly: plan.readOnly,
    status: failures.length ? "findings" : missing.length ? "incomplete" : "evidence-complete",
    reportedPasses: results.filter((c) => c.status === "pass").length,
    failures,
    missing,
    results,
    limits:
      "Coverage of supplied observations only. References, freshness and claimed outcomes are not independently verified; this is not a quality score, accessibility certification or release approval.",
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  await cli(
    "workflow.mjs plan|assess INPUT.json",
    {},
    async (_v, args) => {
      if (!["plan", "assess"].includes(args[0]) || !args[1])
        throw Error("Use plan or assess with an input file");
      const input = await readJSON(args[1]);
      console.log(
        JSON.stringify(args[0] === "plan" ? planWorkflow(input) : assessEvidence(input), null, 2),
      );
    },
    2,
  );
