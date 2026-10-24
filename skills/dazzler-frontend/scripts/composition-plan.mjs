// Original task-to-composition guidance. Apache-2.0. No aesthetic ranking or rendering.
const activities = {
  discover: ["browse-and-focus", "guided-sequence"],
  compare: ["aligned-comparison", "overview-and-detail"],
  decide: ["decision-and-evidence", "alternatives-and-consequences"],
  operate: ["work-surface-and-context", "staged-task"],
  understand: ["overview-and-detail", "guided-sequence"],
  read: ["continuous-narrative", "annotated-narrative"],
};
const organizations = {
  "browse-and-focus": "Expose meaningful groups, then reveal one item with its context intact.",
  "guided-sequence":
    "Order the material around the reader's next question rather than equal-sized sections.",
  "aligned-comparison":
    "Align shared criteria and units so differences are visible without repeated searching.",
  "overview-and-detail":
    "Establish the whole, then connect details back to it through stable labels and navigation.",
  "decision-and-evidence":
    "State the decision, place decisive evidence beside it, then expose qualifications and next steps.",
  "alternatives-and-consequences":
    "Organize by real alternatives and their consequences; retain uncertainty and tradeoffs.",
  "work-surface-and-context":
    "Keep the working object and relevant controls together; subordinate explanation without hiding it.",
  "staged-task":
    "Group dependent actions into visible stages with retained input, progress and recovery.",
  "continuous-narrative":
    "Let argument and paragraph rhythm set the sequence; use interruptions only when they aid reading.",
  "annotated-narrative":
    "Keep the narrative intact while tying supporting evidence to precise passages.",
};
const craft = {
  website:
    "Connect arrival, exploration and action; vary section structure by content and preserve orientation on narrow screens.",
  application:
    "Compose around real working states and task frequency; preserve keyboard order, selection, feedback and recovery.",
  document:
    "Resolve opener and dense interior together; use native styles, running context, stable tables and deliberate page breaks.",
  slides:
    "Give each slide a communicative job; vary statement, evidence and explanation beats while preserving narrative continuity and reading distance.",
};
export function planComposition(
  input = {},
  { kind = "interface", scope = "substantial", readOnly = false } = {},
) {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input) ||
    Object.keys(input).some(
      (k) => !["medium", "activity", "content", "requirements", "existingSystem"].includes(k),
    )
  )
    throw Error("Invalid composition input");
  const {
    medium = kind === "interface" ? undefined : kind,
    activity,
    content = [],
    requirements = [],
    existingSystem = false,
  } = input;
  if (
    medium !== undefined &&
    (!Object.hasOwn(craft, medium) ||
      (kind === "interface" ? !["website", "application"].includes(medium) : medium !== kind))
  )
    throw Error("Composition medium conflicts with task kind");
  if (activity !== undefined && !Object.hasOwn(activities, activity))
    throw Error("Invalid composition activity");
  if (
    !Array.isArray(content) ||
    content.length > 4 ||
    new Set(content).size !== content.length ||
    content.some((c) => !["text", "data", "images", "steps"].includes(c))
  )
    throw Error("Invalid composition content");
  if (
    !Array.isArray(requirements) ||
    requirements.length > 16 ||
    requirements.some((r) => typeof r !== "string" || !r.trim() || r.length > 1000)
  )
    throw Error("Invalid composition requirements");
  if (typeof existingSystem !== "boolean") throw Error("Invalid composition existingSystem");
  const preserve = scope === "small" || existingSystem || readOnly;
  return {
    status: preserve ? "preserve" : medium && activity ? "provisional" : "needs-interpretation",
    medium: medium ?? null,
    activity: activity ?? null,
    requirements: [...requirements],
    alternatives:
      preserve || !medium || !activity
        ? []
        : activities[activity].map((id) => ({ id, relationship: organizations[id] })),
    craft: medium
      ? craft[medium]
      : "Infer website versus application from the task, not its industry or palette.",
    execution:
      preserve || !medium || !activity
        ? null
        : {
            idea: "Name the subject-specific relationship and show one visible consequence; preserve explicit constraints separately from inferred choices.",
            slice:
              medium === "slides"
                ? "Compare a native middle sequence of three slides, including evidence and explanation."
                : medium === "document"
                  ? "Compare a native dense interior page with realistic unequal columns and a longer-edit copy."
                  : medium === "application"
                    ? "Compare selection-to-action states with realistic records on desktop and narrow screens."
                    : "Compare arrival-to-exploration with substantive content and access details on narrow screens.",
            judgments: ["correctness", "taskSupport", "craft", "distinctiveness"],
            evidence:
              "Regenerate captures and contact sheets from the saved revision; optionally seal their hashes with review-bundle.mjs inside the existing runner.",
          },
    material: [
      ...(content.includes("data")
        ? [
            "Choose comparison, trend or distribution encoding from the question; keep units and missing values visible.",
          ]
        : []),
      ...(content.includes("images")
        ? [
            "Use images only when available, licensed and relevant; derive crop and placement from their role.",
          ]
        : [
            "No image-led dependency is established; use text, structure or verified original graphics.",
          ]),
      ...(content.includes("steps")
        ? ["Make order and dependencies visible; do not turn every step into a decorative card."]
        : []),
    ],
    boundary:
      "Unranked organizing relationships, not templates. Interpret the full brief and brand first; reject any conflicting suggestion. Choose density with density.mjs and type/color with existing tools. No fonts, surface colors or grids are forced.",
    review:
      "Render representative content; compare organizing relationships, hierarchy and task fit. Geometry or structural difference is not proof of quality.",
  };
}
