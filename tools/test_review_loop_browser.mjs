import assert from "node:assert/strict";
import path from "node:path";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { runReview } from "../skills/dazzler-frontend/scripts/review-loop.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = path.resolve(process.argv[2] ?? "dist/browser/review-loop");
await mkdir(root, { recursive: false });
const input = path.join(root, "fixture.html");
const fixture = (good) =>
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Review Fixture</title><body style="margin:24px;background:white;color:#172139;font:16px Arial"><h1>Reserve a Workshop</h1><p style="max-width:${good ? "50" : "80"}ch;color:${good ? "#172139" : "#aaa"}">${"Choose a workshop time and retain the confirmation for your visit. ".repeat(8)}</p><button style="width:${good ? "220" : "18"}px;height:${good ? "48" : "18"}px;padding:0" aria-label="Reserve Workshop">${good ? "Reserve Workshop" : "X"}</button></body></html>`;
await writeFile(input, fixture(false));
const config = {
  target: input,
  revision: "synthetic-r1",
  task: { kind: "interface", intent: "audit", scope: "small" },
  files: [input],
  widths: [390, 1440],
  height: 800,
};
const first = await runReview(config, path.join(root, "before"));
assert(first.summary.candidateCount > 0);
assert(first.summary.readOnly);
assert.equal(await readFile(input, "utf8"), fixture(false));
const measured = JSON.parse(await readFile(path.join(root, "before/report.json"), "utf8"));
assert.equal(measured.reports.length, 2);
assert(
  measured.reports.every((r) => r.captureSize.width > 0 && Object.keys(r.elementBoxes).length > 0),
);
await writeFile(input, fixture(true));
const second = await runReview(
  { ...config, revision: "synthetic-r2", previous: path.join(root, "before/review-run.json") },
  path.join(root, "after"),
);
assert(second.summary.candidateCount < first.summary.candidateCount);
assert.notEqual(second.summary.status, "pass");
assert(second.summary.remainingChecks.length > 0);
assert.notDeepEqual(first.sources, second.sources);
assert.equal(await readFile(input, "utf8"), fixture(true));
await assert.rejects(
  runReview(
    { ...config, revision: "synthetic-r2", previous: path.join(root, "after/review-run.json") },
    path.join(root, "invalid"),
  ),
  /different revision/,
);
await assert.rejects(
  runReview({ ...config, target: "javascript:alert(1)" }, path.join(root, "blocked")),
);
assert.equal(
  JSON.parse(await readFile(path.join(root, "blocked/review-run.json"), "utf8")).status,
  "blocked",
);
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1100, height: 850 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(pathToFileURL(path.join(root, "before/report.html")).href);
  assert((await page.locator("svg a").count()) > 0);
  await page.locator("svg a").first().focus();
  await page.keyboard.press("Enter");
  assert.match(page.url(), /#finding-/);
  assert.equal(errors.length, 0);
  await page.screenshot({ path: path.join(root, "feedback-desktop.png"), fullPage: false });
  await page.setViewportSize({ width: 390, height: 844 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: path.join(root, "feedback-mobile.png"), fullPage: false });
  console.log(
    JSON.stringify({
      status: "pass",
      before: first.summary.candidateCount,
      after: second.summary.candidateCount,
      views: 4,
      sourcePreserved: true,
      reportErrors: errors.length,
      output: root,
    }),
  );
} finally {
  await browser.close();
}
