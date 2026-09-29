// Original measured composition candidates. Apache-2.0. No authorship inference.
import { readFileSync } from "node:fs";
export const registry = JSON.parse(
  readFileSync(new URL("../references/composition-rules.json", import.meta.url), "utf8"),
);
const variation = (values) => {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return mean
    ? Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length) / mean
    : 0;
};
const shared = (values) => {
  const counts = new Map();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return Math.max(0, ...counts.values()) / Math.max(1, values.length);
};
export function reviewComposition(measurements, context = {}) {
  if (!Array.isArray(measurements) || measurements.length > 1500)
    throw Error("Composition requires at most 1500 measured nodes");
  if (context === false)
    return { registryVersion: registry.registryVersion, status: "not-requested", findings: [] };
  if (!context || typeof context !== "object" || Array.isArray(context))
    throw Error("Invalid composition context");
  const purposes = [
    "editorial-feature",
    "split-narrative",
    "list-detail",
    "dense-workspace",
    "analytic-report",
    "focused-form",
    "catalog-menu",
    "poster-event",
  ];
  if (context.purpose !== undefined && !purposes.includes(context.purpose))
    throw Error("Unknown composition purpose");
  const exceptions = context.exceptions ?? [];
  if (
    !Array.isArray(exceptions) ||
    exceptions.length > 20 ||
    exceptions.some(
      (e) =>
        !registry.rules.some((r) => r.id === e.rule) ||
        typeof e.reason !== "string" ||
        !e.reason.trim() ||
        e.reason.length > 500,
    )
  )
    throw Error("Exceptions require a known rule and a bounded reason");
  for (const n of measurements)
    if (
      !n ||
      ![n.nodeId, n.parentId, n.width, n.height, n.fontSize, n.weight].every(Number.isFinite) ||
      typeof n.tag !== "string" ||
      typeof n.padding !== "string" ||
      typeof n.radius !== "string" ||
      typeof n.shadow !== "string"
    )
      throw Error("Invalid measured node");
  const findings = [];
  const emit = (rule, nodes, evidence) => {
    const exception = exceptions.find((e) => e.rule === rule.id);
    const reason =
      exception?.reason ??
      (rule.contextExceptions.includes(context.purpose)
        ? "Intentional repetition or compact hierarchy can support " +
          context.purpose +
          "; verify against the actual task"
        : null);
    findings.push({
      rule: rule.id,
      severity: "review",
      status: reason ? "retained-candidate" : "review-candidate",
      nodeIds: nodes.slice(0, 100).map((n) => n.nodeId),
      evidence,
      applicableContext: context.purpose ?? "unspecified",
      exceptionReason: reason,
      rationale: rule.rationale,
    });
  };
  const surfaces = measurements.filter((n) => n.surface && n.width >= 80 && n.height >= 40),
    sections = measurements.filter((n) => n.tag === "SECTION");
  for (const rule of registry.rules) {
    const t = rule.thresholds;
    if (rule.id === "repeated-card-geometry") {
      const groups = new Map();
      for (const n of surfaces) {
        if (!groups.has(n.parentId)) groups.set(n.parentId, []);
        groups.get(n.parentId).push(n);
      }
      for (const nodes of groups.values()) {
        const widthVariation = variation(nodes.map((n) => n.width)),
          heightVariation = variation(nodes.map((n) => n.height));
        if (
          nodes.length >= t.minimum &&
          widthVariation <= t.maximumVariation &&
          heightVariation <= t.maximumVariation
        )
          emit(rule, nodes, { count: nodes.length, widthVariation, heightVariation });
      }
    } else if (rule.id === "repetitive-section-rhythm") {
      const heightVariation = variation(sections.map((n) => n.height)),
        sharedPadding = shared(sections.map((n) => n.padding));
      if (
        sections.length >= t.minimum &&
        heightVariation <= t.maximumVariation &&
        sharedPadding >= t.minimumSharedPadding
      )
        emit(rule, sections, { count: sections.length, heightVariation, sharedPadding });
    } else if (rule.id === "flattened-type-hierarchy") {
      const heads = measurements.filter((n) => /^H[1-6]$/.test(n.tag)),
        body = measurements.filter((n) => n.tag === "P" && n.directText);
      if (heads.length >= t.minimumHeadings && body.length >= t.minimumBody) {
        const bodySize = body.map((n) => n.fontSize).sort((a, b) => a - b)[
            Math.floor(body.length / 2)
          ],
          bodyWeight = body.map((n) => n.weight).sort((a, b) => a - b)[Math.floor(body.length / 2)];
        const ratio = Math.max(...heads.map((n) => n.fontSize)) / Math.max(bodySize, 1),
          weightDifference = Math.max(...heads.map((n) => n.weight)) - bodyWeight;
        if (ratio < t.maximumRatio && weightDifference <= t.maximumWeightDifference)
          emit(rule, heads, {
            headingCount: heads.length,
            bodyCount: body.length,
            ratio,
            weightDifference,
          });
      }
    } else if (rule.id === "pervasive-chrome") {
      const decorated = surfaces.filter((n) => parseFloat(n.radius) > 0 && n.shadow !== "none");
      const share = decorated.length / Math.max(1, surfaces.length),
        sharedStyle = shared(decorated.map((n) => n.radius + "|" + n.shadow));
      if (
        surfaces.length >= t.minimum &&
        share >= t.minimumSharedStyle &&
        sharedStyle >= t.minimumSharedStyle
      )
        emit(rule, decorated, {
          surfaceCount: surfaces.length,
          decoratedShare: share,
          sharedStyle,
        });
    } else if (rule.id === "pervasive-decoration") {
      const gradients = sections.filter((n) => n.gradient);
      const share = gradients.length / Math.max(1, sections.length);
      if (sections.length >= t.minimum && share >= t.minimumGradientShare)
        emit(rule, gradients, { sectionCount: sections.length, gradientShare: share });
    }
  }
  return {
    registryVersion: registry.registryVersion,
    status: "review-only",
    measuredNodes: measurements.length,
    findings,
    limitations: [
      "Heuristic candidates require the brief and rendered inspection; no aesthetic score or AI authorship inference",
      "Palette and punctuation alone are not failure signals; accessibility findings remain separate",
      "Snapshot node IDs are positions in this report, not stable cross-session selectors",
    ],
  };
}
