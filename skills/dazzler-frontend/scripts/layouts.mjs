// Original purpose-based layout catalog resolver. Apache-2.0.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { readJSON } from "./runtime.mjs";
import { cli } from "./cli.mjs";
export const catalog = JSON.parse(
  readFileSync(new URL("../references/layouts.json", import.meta.url), "utf8"),
);
export function recommend(input = {}) {
  if (
    typeof input.task !== "string" ||
    input.task.length > 120 ||
    !Array.isArray(input.content) ||
    input.content.length > 30 ||
    input.content.some((x) => typeof x !== "string" || x.length > 80)
  )
    throw Error("Provide a short task and content-role array");
  const ranked = catalog.layouts
    .map((layout) => {
      const task = layout.tasks.includes(input.task),
        present = layout.content.filter((x) => input.content.includes(x));
      return {
        ...layout,
        score: (task ? 4 : 0) + present.length,
        reasons: [
          ...(task ? ["Task matches " + input.task] : []),
          ...present.map((x) => "Content includes " + x),
        ],
        missingContent: layout.content.filter((x) => !input.content.includes(x)),
      };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id, "en"));
  return {
    schemaVersion: 1,
    recommendations: ranked.slice(0, 3),
    status: ranked.length ? "candidates" : "insufficient-context",
    notes: [
      "Choose by actual task and content. Preserve existing composition when it already fits. Scores are routing evidence, not quality ratings.",
    ],
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  await cli(
    "layouts.mjs recommend --config BRIEF.json",
    { config: { type: "string" } },
    async (v, args) => {
      if (args[0] !== "recommend" || !v.config) throw Error("Use recommend with --config");
      console.log(JSON.stringify(recommend(await readJSON(v.config)), null, 2));
    },
    1,
  );
