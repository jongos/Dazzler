// Original bounded refinement resolver. Apache-2.0. Does not edit a project.
import { pathToFileURL } from "node:url";
import path from "node:path";
import { cli } from "./cli.mjs";
import { readJSON } from "./runtime.mjs";
const procedures = {
  bolder: [
    "Compare the scoped target with adjacent sections; identify underused existing type, motifs and spacing",
    "Strengthen one focal move within the selected design; quiet competing emphasis instead of enlarging everything",
    "Vary sectional pace where useful while preserving reading order, primary actions and Dazzler's existing rules",
    "Review structure using actual content; do not rely on a dramatic headline or an unfilled image placeholder",
    "Compare before and after in context, including reflow and print; verify neighboring content and controls remain intact",
    "Measure actual hierarchy and paired contrast; preserve exact colors, facts, explicit tokens and reduced motion",
  ],
  quieter: [
    "Reduce competing display emphasis and motion; review unnecessary shadows and accent surfaces",
    "Retain primary actions, state distinctions and contrast",
  ],
  typeset: [
    "Check actual copy with fonts.py; tune reading measure, leading and supported weights",
    "Verify required glyphs, genuine styles, reflow and print; never claim coverage from family names",
  ],
  colorize: [
    "Use colors.mjs with existing exact locks to propose semantic colors",
    "Recheck actual role contrast; report conflicts instead of relaxing locks",
  ],
  polish: [
    "Correct observed alignment, spacing and missing UI states in the affected scope",
    "Compare relevant rendered evidence; fewer findings is not sufficient if behavior regresses",
  ],
  harden: [
    "Run browser.cjs stress and inspect text scaling, empty/error and keyboard states",
    "UI resilience only; simulated states do not prove server recovery or security",
  ],
  critique: [
    "Inspect and report purpose, composition, typography, accessibility and behavior",
    "Read-only: return evidence and recommendations without project edits",
  ],
  distill: [
    "Remove only redundant decoration or wrappers supported by the brief",
    "Preserve all required content, controls, labels, disclosures and behavior; compare before/after inventory",
  ],
};
export function resolveRefinement(input = {}) {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input) ||
    Object.keys(input).some((k) => !["intent", "variance", "density", "motion"].includes(k))
  )
    throw Error("Unknown refinement control");
  const intent = input.intent === undefined ? "auto" : input.intent;
  if (intent !== "auto" && !Object.hasOwn(procedures, intent))
    throw Error("Unknown refinement intent");
  const requested = { intent };
  for (const key of ["variance", "density", "motion"]) {
    const v = input[key] === undefined ? "auto" : input[key];
    if (v !== "auto" && (!Number.isInteger(v) || v < 1 || v > 10))
      throw Error("Use auto or an integer from 1 to 10 for " + key);
    requested[key] = v;
  }
  const effective = { ...requested };
  if (intent === "bolder" && effective.variance === "auto") effective.variance = 8;
  if (intent === "quieter") {
    if (effective.variance === "auto") effective.variance = 3;
    if (effective.motion === "auto") effective.motion = 2;
  }
  if (
    intent === "critique" &&
    ["variance", "density", "motion"].some((k) => requested[k] !== "auto")
  )
    throw Error("Critique is read-only; omit change controls");
  return {
    schemaVersion: 1,
    requested,
    effective,
    active: intent !== "auto" || Object.values(requested).some((v) => v !== "auto"),
    readOnly: intent === "critique",
    procedure: procedures[intent] ?? [
      "Continue the existing direction and infer unspecified choices from the task",
    ],
    preserve: [
      "Required content and controls",
      "Exact brand locks and explicit token choices",
      "Existing framework and authorization scope",
    ],
    motionPolicy:
      "Interaction feedback only; never gate content or task completion; respect reduced motion",
  };
}
export function prepareRefinement(input, resolution) {
  if (!resolution.active) return input;
  if (input.schemaVersion === 1)
    throw Error(
      "Refinement controls require schema 2; keep schema 1 unchanged or deliberately migrate",
    );
  if (resolution.readOnly)
    throw Error(
      "Critique produces a read-only report; use refinement.mjs without token generation",
    );
  if (
    (input.baseSize !== undefined && input.baseSize < 16) ||
    (input.typeScale?.step0 !== undefined && input.typeScale.step0 < 1)
  )
    throw Error(
      "Refinement requires a body size of at least 16px; reconcile the explicit constraint",
    );
  const out = structuredClone(input),
    e = resolution.effective;
  if (e.variance !== "auto")
    out.typography = { maxRatio: +(1.2 + (e.variance - 1) * 0.025).toFixed(3), ...out.typography };
  if (e.density !== "auto") {
    const factor = 1.4 - (e.density - 1) * 0.07;
    out.spacing = {
      ...Object.fromEntries(
        [0, 1, 2, 3, 4, 6, 8, 12, 16, 24].map((n) => [n, +(n * 0.25 * factor).toFixed(4)]),
      ),
      ...out.spacing,
    };
  }
  if (e.motion !== "auto") {
    const normal = Math.round(((e.motion - 1) * 320) / 9);
    out.motion = {
      fast: Math.round(normal * 0.6),
      normal,
      slow: Math.round(normal * 1.6),
      ...out.motion,
    };
  }
  return out;
}
export function refinementCSS(resolution) {
  const density = resolution.effective.density;
  return `\n:root{--target-min:44px;--component-padding:${density === "auto" ? 1 : +(1.4 - (density - 1) * 0.07).toFixed(3)}rem;}\n`;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  await cli(
    "refinement.mjs CONTROLS.json",
    {},
    async (v, args) =>
      console.log(JSON.stringify(resolveRefinement(await readJSON(args[0])), null, 2)),
    1,
  );
