import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { tokens } from "../skills/dazzler-frontend/scripts/studio.mjs";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

test("adaptation manifest lists pinned guidance and bundles", async () => {
  const manifest = JSON.parse(
    await readFile("skills/dazzler-frontend/references/adaptation-sources.json", "utf8"),
  );
  assert.equal(manifest.skillInvocationFetchesUpstream, false);
  assert(manifest.guidanceAdaptations.length >= 3);
  assert(manifest.vendoredRuntimes.length >= 3);
  for (const entry of manifest.guidanceAdaptations) {
    await readFile(path.join("skills/dazzler-frontend", entry.provenance), "utf8");
  }
});

test("check_adaptation_drift.mjs --local passes on the pinned tree", () => {
  const result = spawnSync(process.execPath, ["tools/check_adaptation_drift.mjs", "--local"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout);
  assert.equal(report.mode, "local");
  assert(report.guidanceFilesPinned > 20);
  assert(report.bundles.every((item) => item.status === "match"));
});

test("token-self-check passes a generated design-system and flags CSS focus gaps", async () => {
  const system = tokens({ brand: { seed: "#345678" }, baseSize: 16, typeRatio: 1.2 }).system;
  const dir = await mkdtemp(path.join(tmpdir(), "dazzler-self-check-"));
  const systemPath = path.join(dir, "design-system.json");
  await writeFile(systemPath, JSON.stringify(system));
  const badCss = path.join(dir, "bad.css");
  await writeFile(
    badCss,
    "button { outline: none; padding: 13px; transition: color 1s; color: #111; }",
  );
  const good = spawnSync(
    process.execPath,
    ["skills/dazzler-frontend/scripts/token-self-check.mjs", "--system", systemPath],
    { encoding: "utf8", cwd: process.cwd() },
  );
  assert.equal(good.status, 0, good.stderr || good.stdout);
  const bad = spawnSync(
    process.execPath,
    ["skills/dazzler-frontend/scripts/token-self-check.mjs", "--css", badCss],
    { encoding: "utf8" },
  );
  assert.equal(bad.status, 1, bad.stdout);
  assert.match(bad.stdout, /focus/);
});
