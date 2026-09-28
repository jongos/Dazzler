// Dazzler deterministic routing hints. Apache-2.0. No network or install step.
import { pathToFileURL } from "node:url";
import path from "node:path";
import { readJSON } from "./runtime.mjs";
export function route(input = {}) {
  const { kind = "interface", framework = "none", format = "html", interactive = false } = input;
  if (!["interface", "document", "slides", "chart", "illustration"].includes(kind))
    throw Error("Unsupported task kind");
  if (!["none", "react", "vue", "other"].includes(framework)) throw Error("Unsupported framework");
  const result = {
    kind,
    framework,
    format,
    helper: null,
    options: {},
    reasons: [],
    verification: [],
    networkRequired: false,
  };
  if (kind === "illustration") {
    result.helper = "hotspots.mjs";
    result.options = {
      kind: input.artwork === "svg" ? "svg" : "image",
      framework: ["react", "vue"].includes(framework) ? framework : "native",
    };
    result.reasons.push(
      input.artwork === "svg"
        ? "Preserve named vector regions."
        : framework === "none" || framework === "other"
          ? "Use browser-native image regions without adding a framework."
          : "Reuse the existing application framework.",
    );
    result.verification = [
      "Artwork dimensions and region geometry",
      "Keyboard, pointer and touch activation",
      "Visible labels and all-region text alternative",
    ];
  } else if (kind === "chart") {
    result.helper = "visualize.mjs";
    const type =
      input.type ??
      (input.goal === "trend" ? "line" : input.goal === "relationship" ? "scatter" : "bar");
    const compact =
      framework === "react" &&
      input.compact === true &&
      ["line", "area"].includes(type) &&
      input.seriesCount === 1 &&
      input.hasMissingValues === false;
    result.options = {
      type,
      format: ["docx", "pptx", "svg"].includes(format) ? format : compact ? "react" : "html",
    };
    result.reasons.push(
      compact
        ? "Compact complete single-series trend in the existing React UI."
        : "Use the full chart renderer to preserve labels, missing values and data semantics.",
    );
    result.verification = [
      "Source values and missing-value semantics",
      "Legible labels and source table",
    ];
    if (["docx", "pptx"].includes(format)) {
      result.optionalRuntime = "R with approved chart packages";
      result.reasons.push(
        "Native editable charts require an existing optional runtime; otherwise deliver a clearly labelled static fallback.",
      );
    }
  } else {
    result.helper = kind === "interface" ? "studio.mjs" : "project.py";
    result.reasons.push(
      "Preserve supplied brand tokens; use local font and palette catalogs for unspecified choices.",
    );
    result.verification = [
      "Content accuracy",
      "Final rendered layout",
      "Font coverage and contrast",
    ];
  }
  return result;
}

import { cli } from "./cli.mjs";
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  await cli(
    "route.mjs task.json",
    {},
    async (v, args) => {
      if (!args[0]) throw Error("Missing task file");
      console.log(JSON.stringify(route(await readJSON(args[0])), null, 2));
    },
    1,
  );
