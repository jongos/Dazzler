// Original Dazzler compositional candidate generator. Apache-2.0.
// Produces reviewable design decisions, not a quality score or a finished document.
import { createHash, randomBytes } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { readJSON } from "./runtime.mjs";
import { cli } from "./cli.mjs";
import { generate } from "./colors.mjs";
import { formatHex, toGamut, getContrastRatio } from "./vendor/color-engine.mjs";

export const axes = Object.freeze({
  pageSurface: ["light", "tinted", "saturated", "dark"],
  opener: ["type-led", "split-field", "evidence-led", "image-led", "side-rail", "framed"],
  grid: ["single", "asymmetric", "two-column", "modular"],
  typeRelationship: ["serif-sans", "sans-serif", "condensed-sans", "mono-sans"],
  colorRole: ["ink-accent", "saturated-opener", "split-surface", "monochrome"],
  navigation: ["folio-line", "side-index", "section-tab", "running-band"],
  motif: ["rules", "geometry", "typographic", "organic", "data-derived"],
  table: ["rules", "banded", "grouped", "minimal"],
  density: ["open", "balanced", "compact"],
  alignment: ["left", "centered-title", "offset"],
  imageTreatment: ["none", "panorama", "inset", "duotone", "cutout"],
  evidence: ["chart-led", "table-led", "annotated", "prose-led"],
  rhythm: ["statement-evidence-detail", "question-answer-detail", "overview-detail-action"],
});
const structural = [
  "opener",
  "grid",
  "typeRelationship",
  "navigation",
  "motif",
  "density",
  "alignment",
  "evidence",
  "rhythm",
];
// Reading tasks constrain relationships, not palettes, fonts or industry styles.
const readingTasks = {
  continuous: { grid: ["single", "asymmetric"], density: ["open", "balanced"] },
  comparison: { grid: ["two-column", "modular"], density: ["balanced", "compact"] },
  reference: {
    grid: ["two-column", "modular"],
    density: ["balanced", "compact"],
    navigation: ["side-index", "section-tab"],
  },
};
export function distance(a, b) {
  return structural.filter((k) => a[k] !== b[k]).length;
}
function object(x, keys, label) {
  if (
    !x ||
    typeof x !== "object" ||
    Array.isArray(x) ||
    Object.keys(x).some((k) => !keys.includes(k))
  )
    throw Error("Invalid " + label);
}
function valid(d, content) {
  return (
    !((d.opener === "image-led" || d.imageTreatment !== "none") && !content.includes("image")) &&
    !(d.opener === "image-led" && d.imageTreatment === "none") &&
    !(
      (d.opener === "evidence-led" || d.motif === "data-derived" || d.evidence !== "prose-led") &&
      !content.includes("data")
    )
  );
}
export function directions(input) {
  object(
    input,
    ["purpose", "content", "seed", "count", "locks", "background", "readingTask"],
    "direction request",
  );
  if (typeof input.purpose !== "string" || !input.purpose.trim() || input.purpose.length > 1000)
    throw Error("Provide a purpose of 1–1000 characters");
  if (
    input.readingTask !== undefined &&
    (typeof input.readingTask !== "string" || !Object.hasOwn(readingTasks, input.readingTask))
  )
    throw Error("Use continuous, comparison or reference for a section's reading task");
  const taskAxes = readingTasks[input.readingTask] ?? {};
  if (input.background !== undefined && !/^#[0-9a-f]{6}$/i.test(input.background))
    throw Error("Use an opaque six-digit background color");
  const content = input.content ?? ["prose"];
  if (
    !Array.isArray(content) ||
    content.length > 6 ||
    new Set(content).size !== content.length ||
    content.some((x) => !["prose", "data", "image", "quote", "steps", "comparison"].includes(x))
  )
    throw Error("Invalid content inventory");
  const count = input.count ?? 3;
  if (!Number.isInteger(count) || count < 1 || count > 8) throw Error("Use 1–8 candidates");
  const seed = input.seed ?? randomBytes(8).toString("hex");
  if (typeof seed !== "string" || !seed.length || seed.length > 120)
    throw Error("Use a seed of 1–120 characters");
  const locks = input.locks ?? {};
  object(locks, Object.keys(axes), "direction locks");
  for (const [k, v] of Object.entries(locks))
    if (!axes[k].includes(v)) throw Error("Unsupported " + k + " choice");
  if (
    (locks.opener === "image-led" || (locks.imageTreatment && locks.imageTreatment !== "none")) &&
    !content.includes("image")
  )
    throw Error("Image direction requires available imagery");
  if (
    (locks.opener === "evidence-led" ||
      locks.motif === "data-derived" ||
      (locks.evidence && locks.evidence !== "prose-led")) &&
    !content.includes("data")
  )
    throw Error("Evidence direction requires source data");
  if (locks.opener === "image-led" && locks.imageTreatment === "none")
    throw Error("Image-led direction requires image treatment");
  const hash = createHash("sha256")
    .update(seed + "\n" + input.purpose)
    .digest();
  let state = hash.readUInt32LE(0) || 1;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
  const pick = (a) => a[Math.floor(random() * a.length)];
  const candidates = [];
  const requiredDistance = Math.min(4, structural.filter((k) => !Object.hasOwn(locks, k)).length);
  for (let attempt = 0; attempt < 512 && candidates.length < count; attempt++) {
    const d = Object.fromEntries(
      Object.entries(axes).map(([k, v]) => [k, locks[k] ?? pick(taskAxes[k] ?? v)]),
    );
    if (!content.includes("image")) d.imageTreatment = "none";
    if (!content.includes("data")) d.evidence = "prose-led";
    if (
      !valid(d, content) ||
      candidates.some(
        (c) =>
          distance(c.choices, d) < requiredDistance ||
          JSON.stringify(c.choices) === JSON.stringify(d),
      )
    )
      continue;
    const hue = Math.floor(random() * 360);
    const [l, c] = {
      light: [0.975, 0.012],
      tinted: [0.89, 0.065],
      saturated: [0.74, 0.17],
      dark: [0.22, 0.045],
    }[d.pageSurface];
    const gamut = toGamut("rgb", "oklch");
    const background =
      input.background ??
      formatHex(
        gamut({ mode: "oklch", l, c: d.colorRole === "monochrome" ? 0 : c, h: hue }),
      ).toUpperCase();
    const base = formatHex(
      gamut({ mode: "oklch", l: 0.55, c: d.colorRole === "monochrome" ? 0 : 0.14, h: hue }),
    );
    const mode =
      getContrastRatio("#FFFFFF", background) > getContrastRatio("#000000", background)
        ? "dark"
        : "light";
    const palette = generate({ base, locked: { [mode]: { background, surface: background } } });
    if (palette.status !== "pass") continue;
    const pagePalette = {
      backgroundSource: input.background ? "explicit" : "exploration",
      mode,
      tokens: palette.modes[mode].tokens,
      checks: palette.modes[mode].checks,
      status: "pass",
    };
    candidates.push({
      id: "direction-" + (candidates.length + 1),
      choices: d,
      pagePalette,
      parameters: {
        titleScalePt: 32 + Math.round(random() * 32),
        outerMarginIn: +(0.55 + random() * 0.35).toFixed(2),
        accentHue: hue,
      },
      review: [
        "Explain how the composition serves the supplied purpose",
        "Render an opener and a dense interior page in the target format",
        "Inspect content, contrast, typography, reading order and editing resilience",
      ],
      status: "unrendered",
    });
  }
  return {
    schemaVersion: 1,
    purpose: input.purpose,
    content: [...content],
    seed,
    locks: { ...locks },
    ...(input.readingTask ? { readingTask: input.readingTask } : {}),
    candidates,
    requested: count,
    selection:
      "The agent selects and develops the strongest content fit after rendering; order is not rank.",
    limits:
      "These are combinable starting decisions, not a finite template catalog, trained distribution, perceptual diversity score or proof of quality. Invent further structures when the brief benefits. Parameters require contrast and layout verification.",
    ...(candidates.length < count
      ? {
          warning:
            "Constraints reduced the available distinct candidates; do not weaken locks to fill the count.",
        }
      : {}),
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  await cli(
    "document-directions.mjs request.json",
    {},
    async (v, args) => {
      if (!args[0]) throw Error("Missing request file");
      console.log(JSON.stringify(directions(await readJSON(args[0])), null, 2));
    },
    1,
  );
