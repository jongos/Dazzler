// Original Dazzler task planning and reported-evidence coverage. Apache-2.0.
// No browser execution, network access, project mutation or inferred certification.
import path from "node:path";
import { pathToFileURL } from "node:url";
import { readJSON } from "./runtime.mjs";
import { cli } from "./cli.mjs";
import { resolveRefinement } from "./refinement.mjs";
import { ruleIdFor } from "./review-rules.mjs";
import { reviewFindings } from "./review.mjs";
import { planDensity } from "./density.mjs";
import { planComposition } from "./composition-plan.mjs";

export const CASE_REQUIREMENTS = Object.freeze({
  density: Object.freeze(["task", "space", "access"]),
  coordinatedViews: Object.freeze(["selection", "filter", "keyboard", "narrow"]),
  operationalState: Object.freeze(["scope", "persistence", "recovery"]),
  expertSettings: Object.freeze(["defaults", "validation", "save-reset"]),
});

const checks = {
  density:
    "Name the primary task and justify initial-view versus later placement. Measure its actual position at representative widths and heights with the host runner or render-focus.mjs; inspect crowding, overlays and control access. Revise provisional density from rendered evidence, not a compactness quota.",
  coordinatedViews:
    "Exercise shared stable-ID selection from both views, filtering/removal, clear selection, keyboard access and narrow-screen view switching without losing context.",
  operationalState:
    "Exercise persistent scope versus transient search, account/workspace isolation, reload/reset, stale data and applicable partial bulk failures with recovery.",
  expertSettings:
    "Verify domain labels, units, defaults, invalid and dependent values, temporary overrides versus saved settings, save failure and reset scope.",
  edgeCases:
    "Before implementation select relevant failure cases; before delivery exercise them in the actual artifact, repair and recheck. Cover long/missing content, narrow layouts and zoom, font fallback, interaction recovery, and print breaks where applicable. Record cases, outcomes and exclusions; unavailable checks remain not-run.",
  distinction:
    "For new substantial designs compare two focused rendered structures using the same content and constraints, then record the selected composition and visible reasons. Review defining move, supporting decisions and restraint. Preserve approved compositions and small-edit scope; generic or incoherent output needs revision.",
  content:
    "Reconcile every required task, fact, control, link and deliverable with its implementation location and completion condition; appearance is not coverage",
  render:
    "Review the saved revision in representative rendered views, inspect affected neighbors, repair findings and capture fresh recheck evidence; see rendered-review.md",
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
    "Test longer copy and extra rows in an editable copy; verify rendered fonts, native styles and reading order. For data-linked charts edit a source value and confirm labels and geometry update together; disclose static or manual graphics.",
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
  object(
    task,
    ["kind", "framework", "scope", "intent", "features", "density", "composition"],
    "workflow task",
  );
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
    features.length > 8 ||
    new Set(features).size !== features.length ||
    features.some(
      (f) =>
        ![
          "forms",
          "motion",
          "data",
          "print",
          "editable",
          "coordinatedViews",
          "operationalState",
          "expertSettings",
        ].includes(f),
    )
  )
    throw Error("Invalid workflow features");
  const refinement = resolveRefinement({ intent });
  const compositionSupported = ["interface", "document", "slides"].includes(kind);
  if (!compositionSupported && task.composition !== undefined)
    throw Error("Composition planning supports interfaces, documents and slides");
  const densityInput = task.density === undefined ? {} : task.density;
  planDensity(densityInput);
  const sharedDensity = {
    ...(intent === "compact" ? { preference: "compact" } : {}),
    ...densityInput,
  };
  const composition = compositionSupported
    ? planComposition(task.composition === undefined ? {} : task.composition, {
        kind,
        scope,
        readOnly: refinement.readOnly,
        sharedDensity,
      })
    : undefined;
  const density = planDensity({
    existingSystem: scope === "small",
    ...(intent === "compact" ? { preference: "compact" } : {}),
    ...densityInput,
  });
  const ids = new Set(["content", "render", "headings", "distinction", "edgeCases"]);
  const references = new Set([
    "delivery-gates.md",
    "art-direction.md",
    "rendered-review.md",
    "review-rules.md",
    "density.md",
  ]);
  if (
    scope === "substantial" ||
    task.density !== undefined ||
    ["compact", "layout", "adapt", "audit"].includes(intent)
  )
    ids.add("density");
  for (const feature of features) {
    const reference = {
      coordinatedViews: "coordinated-views.md",
      operationalState: "operational-state.md",
      expertSettings: "expert-settings.md",
    }[feature];
    if (reference) references.add(reference);
  }
  if (["interface", "document"].includes(kind)) references.add("gdc.md");
  if (scope === "substantial") {
    references.add("art-direction.md");
    if (compositionSupported) references.add("composition-decisions.md");
    if (compositionSupported && !refinement.readOnly) references.add("execution-review.md");
    ids.add("distinction");
  }
  if (kind === "interface") {
    references.add("frontend-engineering.md");
    references.add("review-loop.md");
    if (scope === "substantial") {
      references.add("web-design-space.md");
      if (!refinement.readOnly) references.add("component-foundations.md");
    }
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
    task: {
      kind,
      framework,
      scope,
      intent,
      features: [...features],
      ...(task.density !== undefined ? { density: structuredClone(task.density) } : {}),
      ...(task.composition !== undefined ? { composition: structuredClone(task.composition) } : {}),
    },
    density,
    ...(composition ? { composition } : {}),
    readOnly: refinement.readOnly,
    references: [...references],
    procedure: [
      "Identify the user task and authoritative product facts separately from visual choices",
      "Inspect the affected implementation, accepted tokens and reusable components",
      "Choose relevant edge cases before implementation; test them before final delivery",
      ...refinement.procedure,
      refinement.readOnly
        ? "Report findings with locations and evidence; do not apply changes"
        : "Implement a focused slice, render representative content, repair observed problems and recheck affected views and neighbors at the final revision",
    ],
    checks: [...ids].map((id) => ({
      id,
      ruleId: ruleIdFor(id),
      instruction: checks[id],
      status: "not-run",
      ...(CASE_REQUIREMENTS[id] ? { requiredCases: [...CASE_REQUIREMENTS[id]] } : {}),
    })),
    limits:
      "A plan is not execution. Small scopes still require checks for any affected behavior. Add relevant features or use substantial scope when uncertain.",
  };
}

export function assessEvidence(input) {
  object(
    input,
    ["task", "target", "revision", "observations", "reviewObservations"],
    "evidence report",
  );
  const target = text(input.target, "target"),
    revision = text(input.revision, "revision");
  const plan = planWorkflow(input.task);
  if (!Array.isArray(input.observations) || input.observations.length > 32)
    throw Error("Invalid observations");
  const byId = new Map();
  for (const observation of input.observations) {
    object(
      observation,
      ["id", "status", "evidence", "detail", "designReview", "renderReview", "cases"],
      "observation",
    );
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
    if (observation.renderReview !== undefined) {
      if (observation.id !== "render") throw Error("Render review belongs to render");
      const review = observation.renderReview;
      object(review, ["revision", "views", "findings"], "render review");
      if (text(review.revision, "render revision") !== revision)
        throw Error("Render review must match the assessed revision");
      if (!Array.isArray(review.views) || !review.views.length || review.views.length > 64)
        throw Error("Describe representative rendered views");
      const names = new Set();
      for (const view of review.views) {
        object(view, ["name", "environment", "evidence", "detail"], "rendered view");
        for (const field of ["name", "environment", "evidence", "detail"])
          text(view[field], "rendered view " + field);
        if (names.has(view.name)) throw Error("Duplicate rendered view");
        names.add(view.name);
      }
      if (!Array.isArray(review.findings) || review.findings.length > 64)
        throw Error("Invalid render findings");
      for (const finding of review.findings) {
        object(finding, ["issue", "status", "resolution", "recheckEvidence"], "render finding");
        text(finding.issue, "render issue");
        if (!["open", "resolved"].includes(finding.status))
          throw Error("Invalid render finding status");
        if (finding.resolution !== undefined) text(finding.resolution, "render resolution");
        if (finding.recheckEvidence !== undefined)
          text(finding.recheckEvidence, "render recheck evidence");
        if (finding.status === "resolved") {
          text(finding.resolution, "render resolution");
          text(finding.recheckEvidence, "render recheck evidence");
        }
        if (observation.status === "pass" && finding.status === "open")
          throw Error("Open render findings cannot pass");
      }
    }
    if (observation.id === "render" && observation.status === "pass" && !observation.renderReview)
      throw Error("A render pass requires a revision-bound render review");
    if (observation.cases !== undefined) {
      if (
        (observation.id !== "edgeCases" && !CASE_REQUIREMENTS[observation.id]) ||
        !Array.isArray(observation.cases) ||
        !observation.cases.length ||
        observation.cases.length > 32
      )
        throw Error("Invalid edge cases");
      const names = new Set();
      for (const c of observation.cases) {
        object(c, ["name", "status", "detail"], "edge case");
        text(c.name, "case name");
        text(c.detail, "case detail");
        if (names.has(c.name) || !["pass", "fail", "not-run", "excluded"].includes(c.status))
          throw Error("Invalid case status or duplicate name");
        names.add(c.name);
      }
    }
    if (
      observation.id === "edgeCases" &&
      observation.status === "pass" &&
      (!observation.cases?.some((c) => c.status === "pass") ||
        observation.cases.some((c) => ["fail", "not-run"].includes(c.status)))
    )
      throw Error("An edge-case pass requires tested cases and no failed or unrun cases");
    if (observation.status === "pass" && CASE_REQUIREMENTS[observation.id]) {
      const cases = observation.cases ?? [];
      if (
        !cases.some((c) => c.status === "pass") ||
        cases.some((c) => ["fail", "not-run"].includes(c.status)) ||
        CASE_REQUIREMENTS[observation.id].some((name) => !cases.some((c) => c.name === name))
      )
        throw Error(
          "A capability pass requires its named cases, tested coverage and no failed or unrun cases",
        );
    }
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
  const review =
    input.reviewObservations === undefined
      ? null
      : reviewFindings({ target, revision, observations: input.reviewObservations });
  return {
    schemaVersion: 1,
    target,
    revision,
    task: plan.task,
    readOnly: plan.readOnly,
    status:
      failures.length || review?.findings.length
        ? "findings"
        : missing.length || review?.notRun.length
          ? "incomplete"
          : "evidence-complete",
    reportedPasses: results.filter((c) => c.status === "pass").length,
    failures,
    missing,
    results: results.map((r) => ({ ...r, ruleId: ruleIdFor(r.id) })),
    ...(review ? { review } : {}),
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
