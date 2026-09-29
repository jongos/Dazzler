import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
for (const file of [
  "route.mjs",
  "layouts.mjs",
  "refinement.mjs",
  "visualize.mjs",
  "hotspots.mjs",
  "studio.mjs",
  "browser.cjs",
  "colors.mjs",
]) {
  const run = (args) =>
    spawnSync(process.execPath, [path.resolve("skills/dazzler-frontend/scripts", file), ...args], {
      encoding: "utf8",
    });
  test(file + " supports help and rejects missing/unknown arguments cleanly", () => {
    const help = run(["--help"]);
    assert.equal(help.status, 0);
    assert.match(help.stdout, /usage|colors.mjs/i);
    assert.equal(help.stderr, "");
    for (const args of [[], ["--unknown"]]) {
      const result = run(args);
      assert.notEqual(result.status, 0);
      assert(result.stderr.length);
      assert.doesNotMatch(result.stderr, /\n\s+at |node:internal/);
    }
  });
  test(file + " reports missing inputs without a stack dump", () => {
    const args =
      file === "route.mjs"
        ? ["not-a-real-file.json"]
        : file === "browser.cjs"
          ? ["inspect", "--invalid", "unused"]
          : file === "colors.mjs"
            ? ["generate", "--config", "not-a-real-file.json"]
            : file === "studio.mjs"
              ? ["tokens", "--config", "not-a-real-file.json", "--out", "unused"]
              : [
                  "--config",
                  "not-a-real-file.json",
                  "--out",
                  "unused",
                  ...(file === "hotspots.mjs" ? ["--art", "missing.svg"] : []),
                ];
    const result = run(args);
    assert.notEqual(result.status, 0);
    assert.doesNotMatch(result.stderr, /\n\s+at |node:internal/);
  });
}
