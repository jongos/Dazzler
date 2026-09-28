import fs from "node:fs/promises";
import { tokens } from "../skills/dazzler-frontend/scripts/studio.mjs";
import { specimen } from "../skills/dazzler-frontend/scripts/type-system.mjs";
const result = tokens({
  fonts: { body: "Work Sans", heading: "Young Serif" },
  typography: { direction: "editorial", script: "mixed" },
});
await fs.mkdir("docs/typography", { recursive: true });
await fs.writeFile("docs/typography/index.html", specimen(result.system));
await fs.writeFile(
  "docs/typography/tokens.css",
  '@import url("../templates/fonts/work-sans/fonts.css");\n@import url("../templates/fonts/young-serif/fonts.css");\n' +
    result.css,
);
console.log("Built public typography specimen with local licensed fonts");
