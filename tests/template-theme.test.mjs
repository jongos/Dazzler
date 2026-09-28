import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { tokens } from "../skills/dazzler-frontend/scripts/studio.mjs";
import { templateCSS } from "../skills/dazzler-frontend/scripts/template-theme.mjs";
test("all template contracts retheme every binding without editing component CSS", () => {
  const { system } = tokens({ brand: { seed: "#195A8C" } });
  for (const type of ["html", "ui"])
    for (const dir of fs
      .readdirSync(`skills/dazzler-frontend/assets/templates/${type}`, { withFileTypes: true })
      .filter((x) => x.isDirectory())) {
      const contract = JSON.parse(
        fs.readFileSync(`skills/dazzler-frontend/assets/templates/${type}/${dir.name}/tokens.json`),
      );
      const css = templateCSS(contract, system.palette, system.fonts);
      for (const key of Object.keys(contract.bindings)) assert(css.includes(`${key}: `), key);
      assert(!css.includes("undefined"));
    }
});
test("template aliases reject malformed names and unknown roles", () => {
  const { system } = tokens();
  for (const bindings of [
    { "--x;bad": { role: "text" } },
    { "--valid": { role: "unknown" } },
    { "--valid": { value: "red;bad" } },
  ])
    assert.throws(() => templateCSS({ schemaVersion: 1, bindings }, system.palette, system.fonts));
});
