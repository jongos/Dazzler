// Compile one layout's offline preview behavior; esbuild is a build-only dependency.
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
const layout = process.argv[2];
if (
  ![
    "workspace",
    "board",
    "settings",
    "revenue",
    "operations",
    "cafe",
    "menu",
    "reservations",
    "business",
    "dining",
  ].includes(layout)
)
  throw Error("Unknown template layout");
const result = await build({
  entryPoints: [fileURLToPath(new URL("./template_interactions.js", import.meta.url))],
  bundle: true,
  write: false,
  format: "iife",
  target: "es2020",
  treeShaking: true,
  minifySyntax: true,
  define: { DAZZLER_LAYOUT: JSON.stringify(layout) },
});
process.stdout.write(result.outputFiles[0].text);
