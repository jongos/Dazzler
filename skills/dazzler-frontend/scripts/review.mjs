// Assess reported findings, not screenshots or conformance. No network or mutations.
import path from "node:path";
import { pathToFileURL } from "node:url";
import { readJSON } from "./runtime.mjs";
import { cli } from "./cli.mjs";
import { RULES, THRESHOLDS as T } from "./review-rules.mjs";

function object(v, keys, label) {
  if (
    !v ||
    typeof v !== "object" ||
    Array.isArray(v) ||
    Object.keys(v).some((k) => !keys.includes(k))
  )
    throw Error("Invalid " + label);
}
function text(v, label) {
  if (typeof v !== "string" || !v.trim() || v.length > 2000) throw Error("Invalid " + label);
  return v;
}
function number(v, min, max) {
  if (!Number.isFinite(v) || v < min || v > max) throw Error("Invalid measurement");
  return v;
}
function choice(v, choices, label) {
  if (!choices.includes(v)) throw Error("Invalid " + label);
  return v;
}

// Applicability is explicitly supplied by the reviewer; thresholds never infer exceptions.
export function assessMeasurement(ruleId, m) {
  object(
    m,
    ["applicability", "reason", "ratio", "largeText", "width", "height", "measureCh"],
    "measurement",
  );
  choice(m.applicability, ["applies", "exception", "unknown"], "applicability");
  text(m.reason, "applicability reason");
  const fields = {
    "DZ-101": ["ratio", "largeText"],
    "DZ-102": ["ratio"],
    "DZ-103": ["width", "height"],
    "DZ-104": ["measureCh"],
  }[ruleId];
  if (!fields || Object.keys(m).some((k) => !["applicability", "reason", ...fields].includes(k)))
    throw Error("Measurement does not match rule");
  let value, threshold, meets;
  if (ruleId === "DZ-101" || ruleId === "DZ-102") {
    value = number(m.ratio, 1, 21);
    if (ruleId === "DZ-101" && typeof m.largeText !== "boolean")
      throw Error("Specify large text applicability");
    threshold =
      ruleId === "DZ-102" ? T.nonTextContrast : m.largeText ? T.largeTextContrast : T.textContrast;
    meets = value >= threshold;
  } else if (ruleId === "DZ-103") {
    value = Math.min(number(m.width, 0, 100000), number(m.height, 0, 100000));
    threshold = T.targetMinimumCssPx;
    meets = value >= threshold;
  } else {
    value = number(m.measureCh, 0, 100000);
    threshold = T.bodyMeasureCh;
    meets = value <= threshold;
  }
  return {
    value,
    threshold,
    status:
      m.applicability === "unknown"
        ? "not-run"
        : m.applicability === "exception"
          ? "excluded"
          : meets
            ? "pass"
            : "fail",
  };
}

export function reviewFindings(input) {
  object(input, ["target", "revision", "observations"], "finding review");
  text(input.target, "target");
  text(input.revision, "revision");
  if (!Array.isArray(input.observations) || input.observations.length > 128)
    throw Error("Invalid review observations");
  const identities = new Set();
  const results = input.observations.map((o) => {
    object(
      o,
      [
        "ruleId",
        "location",
        "status",
        "source",
        "verification",
        "evidence",
        "detail",
        "measurement",
        "impact",
        "fix",
      ],
      "review observation",
    );
    const rule = Object.hasOwn(RULES, o.ruleId) ? RULES[o.ruleId] : null;
    if (!rule) throw Error("Unknown rule ID");
    text(o.location, "location");
    text(o.detail, "detail");
    const key = JSON.stringify([o.ruleId, o.location]);
    if (identities.has(key)) throw Error("Duplicate rule and location");
    identities.add(key);
    choice(o.status, ["pass", "fail", "not-run", "excluded"], "status");
    choice(o.source, ["measured", "judged"], "source");
    choice(o.verification, ["reproduced", "observed", "inferred", "unavailable"], "verification");
    if (!Array.isArray(o.evidence) || o.evidence.length > 16) throw Error("Invalid evidence");
    o.evidence.forEach((e) => text(e, "evidence"));
    if (o.status !== "not-run" && (!o.evidence.length || o.verification === "unavailable"))
      throw Error("An outcome requires observed evidence");
    if (o.source === "measured" && o.verification === "inferred")
      throw Error("Inferred evidence is judged, not measured");
    if (o.fix !== undefined) text(o.fix, "fix");
    let measurement;
    if (o.measurement !== undefined) {
      if (o.source !== "measured") throw Error("Numerical checks require measured source");
      measurement = assessMeasurement(o.ruleId, o.measurement);
      if (measurement.status !== o.status)
        throw Error("Status contradicts measurement or applicability");
    } else if (
      ["DZ-101", "DZ-102", "DZ-103", "DZ-104"].includes(o.ruleId) &&
      o.status !== "not-run"
    ) {
      throw Error("This rule requires a measurement; use its broader review rule for judgment");
    }
    const confidence =
      o.status === "not-run"
        ? "unavailable"
        : o.source === "measured" && o.verification === "reproduced"
          ? "high"
          : o.verification === "inferred"
            ? "low"
            : "medium";
    let tier = null;
    if (o.status === "fail") {
      object(o.impact, ["consequence", "scope", "reason"], "impact");
      choice(
        o.impact.consequence,
        ["blocked-task", "harm", "degraded-task", "presentation"],
        "consequence",
      );
      choice(o.impact.scope, ["shared", "primary", "local"], "impact scope");
      text(o.impact.reason, "impact reason");
      text(o.fix, "fix");
      tier = ["blocked-task", "harm"].includes(o.impact.consequence)
        ? "blocking"
        : o.impact.consequence === "degraded-task" ||
            rule.kind === "standard" ||
            rule.kind === "constraint"
          ? "important"
          : "polish";
    } else if (o.impact !== undefined || o.fix !== undefined)
      throw Error("Only findings carry impact and a fix");
    return {
      ...structuredClone(o),
      rule: rule.title,
      ruleKind: rule.kind,
      confidence,
      tier,
      ...(measurement ? { assessment: measurement } : {}),
    };
  });
  const tiers = { blocking: 0, important: 1, polish: 2 };
  const scopes = { shared: 0, primary: 1, local: 2 };
  const findings = results
    .filter((r) => r.status === "fail")
    .sort(
      (a, b) =>
        tiers[a.tier] - tiers[b.tier] ||
        scopes[a.impact.scope] - scopes[b.impact.scope] ||
        a.ruleId.localeCompare(b.ruleId) ||
        a.location.localeCompare(b.location),
    );
  const first = findings[0];
  return {
    schemaVersion: 1,
    target: input.target,
    revision: input.revision,
    results,
    findings,
    notRun: results.filter((r) => r.status === "not-run"),
    highestLeverage: first
      ? {
          ruleId: first.ruleId,
          location: first.location,
          fix: first.fix,
          why: first.impact.reason,
          basis:
            "Highest impact tier, then shared/primary scope; stable ID/location breaks ties, not an ROI estimate",
        }
      : null,
    limits:
      "Reported evidence only; confidence describes evidence support, not probability or aesthetic quality. Scope and impact are reviewer judgments. Missing checks are not implicitly covered. No ship-readiness score or release approval.",
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  await cli(
    "review.mjs INPUT.json",
    {},
    async (_v, args) => {
      if (args.length !== 1) throw Error("Provide one review file");
      console.log(JSON.stringify(reviewFindings(await readJSON(args[0])), null, 2));
    },
    1,
  );
