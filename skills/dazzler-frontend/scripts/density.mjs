// Original Dazzler. Provisional space-use decisions, not CSS or visual certification.
const activities = ["scan", "compare", "batch", "read", "learn", "decide", "showcase"];
const booleans = ["avoidableSpace", "crowding", "primaryTaskDisplaced", "locked", "existingSystem"];
const fields = ["preference", ...booleans, "activities", "inputMode", "contentVolume", "regions"];
function validate(input, region = false) {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input) ||
    Object.keys(input).some(
      (k) => !(region ? [...fields.filter((k) => k !== "regions"), "id"] : fields).includes(k),
    )
  )
    throw Error("Invalid density input");
  if (
    input.preference !== undefined &&
    !["auto", "compact", "balanced", "comfortable"].includes(input.preference)
  )
    throw Error("Invalid density preference");
  for (const key of booleans)
    if (input[key] !== undefined && typeof input[key] !== "boolean")
      throw Error("Density observations must be booleans");
  if (
    input.activities !== undefined &&
    (!Array.isArray(input.activities) ||
      input.activities.length > activities.length ||
      new Set(input.activities).size !== input.activities.length ||
      input.activities.some((a) => !activities.includes(a)))
  )
    throw Error("Invalid density activities");
  if (input.inputMode !== undefined && !["pointer", "touch", "mixed"].includes(input.inputMode))
    throw Error("Invalid input mode");
  if (
    input.contentVolume !== undefined &&
    !["small", "moderate", "large"].includes(input.contentVolume)
  )
    throw Error("Invalid content volume");
  if (region && (typeof input.id !== "string" || !input.id.trim() || input.id.length > 80))
    throw Error("Invalid density region ID");
}
function choose(input) {
  const preference = input.preference ?? "auto";
  const active = input.activities ?? [];
  const operational = active.some((a) => ["scan", "compare", "batch"].includes(a));
  const comprehension = active.some((a) => ["read", "learn", "decide", "showcase"].includes(a));
  const reasons = [];
  let selected = input.existingSystem ? "current" : "balanced";
  let layout = selected;
  let components = "preserve";
  if (input.locked) {
    selected = layout = "current";
    reasons.push(
      "Retain explicit constraints; report any observed conflicts without overriding them",
    );
  } else if (preference !== "auto") {
    selected = layout = { compact: "tighter", balanced: "balanced", comfortable: "roomier" }[
      preference
    ];
    reasons.push(
      "Explicit preference takes precedence; preserve reading and interaction requirements",
    );
  } else if (input.avoidableSpace && input.crowding) {
    selected = "mixed";
    layout = "tighter";
    components = "roomier";
    reasons.push(
      "Remove structural waste while relieving local crowding; do not apply one spacing multiplier",
    );
  } else if (input.crowding) {
    selected = layout = "roomier";
    reasons.push("Observed crowding requires separation or restructuring");
  } else if (input.avoidableSpace) {
    selected = layout = "tighter";
    reasons.push("Observed structural waste can be removed without shrinking text or controls");
  } else if (input.existingSystem) {
    reasons.push(
      "Preserve the established system until task or rendered evidence justifies a change",
    );
  } else if (operational && comprehension) {
    reasons.push(
      "Mixed scanning and comprehension tasks need differentiated regions; begin balanced",
    );
  } else if (operational && input.contentVolume !== "small") {
    selected = layout = "tighter";
    reasons.push(
      "Repeated scanning, comparison or batch work benefits from bringing related content together",
    );
  } else if (comprehension) {
    selected = layout = "roomier";
    reasons.push(
      "Reading, learning, decisions or showcase content needs deliberate grouping and emphasis, not blanket padding",
    );
  } else {
    reasons.push(
      "Evidence does not favor either extreme; begin balanced without stretching sparse content",
    );
  }
  if (!input.locked && selected === "tighter" && input.inputMode === "pointer" && operational)
    components = "review-padding";
  if (input.inputMode === "touch" || input.inputMode === "mixed")
    reasons.push("Retain usable touch controls; reorganize content instead of compressing targets");
  if (input.primaryTaskDisplaced)
    reasons.push(
      "Inspect why the primary task is displaced; content volume alone does not justify compression",
    );
  const candidates = input.locked
    ? ["current"]
    : [
        ...new Set([
          selected,
          "current",
          ...(input.crowding ? ["roomier"] : []),
          ...(input.avoidableSpace ? ["tighter"] : []),
        ]),
      ];
  return {
    preference,
    selected,
    candidates,
    reason: reasons.join(". "),
    dimensions: {
      information: operational ? "keep-comparison-context" : "retain-required-content",
      layout,
      components,
      reading: "preserve-readable-type-and-measure",
    },
    provisional: true,
    reviewStatus: "not-run",
  };
}
export function planDensity(input = {}) {
  validate(input);
  if (
    input.regions !== undefined &&
    (!Array.isArray(input.regions) || !input.regions.length || input.regions.length > 12)
  )
    throw Error("Provide 1–12 density regions");
  const ids = new Set();
  const { regions = [], ...shared } = input;
  const planned = regions.map((region) => {
    validate(region, true);
    if (ids.has(region.id)) throw Error("Duplicate density region");
    ids.add(region.id);
    const merged = { ...shared, ...region };
    if (shared.locked) merged.locked = true;
    if (shared.preference && shared.preference !== "auto") merged.preference = shared.preference;
    return { id: region.id, ...choose(merged) };
  });
  const result = choose(input);
  if (planned.length) {
    const choices = [...new Set(planned.map((r) => r.selected))];
    result.selected = choices.length === 1 ? choices[0] : "mixed";
    result.dimensions.layout = result.selected;
    result.candidates = [...new Set([result.selected, ...result.candidates])];
    result.reason =
      "Use region decisions; shared constraints and explicit preferences remain authoritative";
  }
  return {
    ...result,
    regions: planned,
    procedure: [
      "Infer activities and content from the actual brief; do not use profession or industry labels as density rules",
      "Remove empty wrappers and stacked padding before reducing local gaps; preserve useful grouping",
      "Compare primary task visibility and scrolling burden at representative widths AND heights",
      "Check realistic content, enlarged text, fallback fonts, controls and print breaks before retaining the choice",
      "Feed observed avoidableSpace/crowding back into this planner; repair and recheck the affected regions",
    ],
    preserve: [
      "Required content and disclosures",
      "Readable type and line spacing",
      "Touch targets and focus visibility",
      "Brand locks and logical reading order",
    ],
    limits:
      "Host-supplied context and observations, not independent measurements. No global spacing multiplier, DOM mutation or aesthetic score. Decisions remain provisional until rendered review.",
  };
}
