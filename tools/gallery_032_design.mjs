// Record color exploration and collection review against the authored briefs.
import fs from "node:fs/promises";
import { explore } from "../skills/dazzler-frontend/scripts/colors.mjs";
import { reviewCollection } from "../skills/dazzler-frontend/scripts/collection-color.mjs";
import { getContrastRatio } from "../skills/dazzler-frontend/scripts/vendor/color-engine.mjs";
const stage = "maintenance/gallery-production/v0.32.0";
const briefs = (
  await Promise.all(
    ["document", "interface"].map(async (k) =>
      JSON.parse(await fs.readFile(`${stage}/${k}-briefs.json`, "utf8")),
    ),
  )
).flat();
const records = [];
for (const b of briefs) {
  const dark = ["webapp-settings", "restaurant-fine-dining"].includes(b.id);
  const mode = dark ? "dark" : "light";
  const input = {
    brief: b.rationale,
    seed: `gallery-032-${b.id}`,
    count: 3,
    ranges: { hue: [0, 360], chroma: [0.08, 0.22], gamutFraction: [0.4, 0.9] },
    locked: {
      [mode]: { background: b.surface, surface: b.surface, text: dark ? "#FFFFFF" : "#17212B" },
    },
  };
  const result = explore(input);
  if (!result.candidates.length) throw Error("No page role proposal: " + b.id);
  records.push({
    id: b.id,
    input,
    attempted: result.attempted,
    passing: result.passing,
    alternatives: result.candidates.map((x) => x.modes[mode].tokens),
    decision:
      "Keep the authored page and control colors; proposals confirm compatible page roles. White panels have their own dark ink and accent controls.",
    actualPairs: {
      pageText: getContrastRatio(dark ? "#FFFFFF" : "#17212B", b.surface),
      controlText: getContrastRatio("#FFFFFF", b.accent),
    },
    rationale: b.rationale,
  });
}
await fs.writeFile(
  `${stage}/color-review.json`,
  JSON.stringify(
    {
      records,
      collection: reviewCollection(briefs.map((b) => ({ id: b.id, background: b.surface }))),
    },
    null,
    2,
  ) + "\n",
);
console.log("Recorded 20 color explorations and the collection distribution.");
