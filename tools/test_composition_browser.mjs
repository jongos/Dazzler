import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { createRequire } from "node:module";
import { tokens } from "../skills/dazzler-frontend/scripts/studio.mjs";
import { recommend } from "../skills/dazzler-frontend/scripts/layouts.mjs";
const require = createRequire(import.meta.url),
  { inspect, navigation } = require("../skills/dazzler-frontend/scripts/browser.cjs");
const engine = await import("../skills/dazzler-frontend/scripts/vendor/color-engine.mjs");
const out = path.resolve(process.argv[2] ?? "dist/composition-review");
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
const summary = [];
try {
  const page = await browser.newPage({ serviceWorkers: "block" });
  for (const [name, purpose] of [
    ["repetitive", "editorial-feature"],
    ["catalog", "catalog-menu"],
    ["workspace", "dense-workspace"],
    ["editorial", "editorial-feature"],
    ["heldout-form", "focused-form"],
    ["heldout-decorated", "focused-form"],
  ]) {
    const source = path.resolve("tests/fixtures/composition/" + name + ".html"),
      before = await fs.readFile(source, "utf8");
    await navigation(page, source, {});
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(pathToFileURL(source).href);
    const report = await inspect(page, engine, { purpose });
    const review = report.composition.findings.filter((f) => f.status === "review-candidate"),
      retained = report.composition.findings.filter((f) => f.status === "retained-candidate");
    summary.push({
      name,
      purpose,
      review: review.map((f) => f.rule),
      retained: retained.map((f) => f.rule),
      accessibility: report.findings,
    });
    await fs.writeFile(path.join(out, name + ".json"), JSON.stringify(report, null, 2));
    await page.screenshot({ path: path.join(out, name + ".png"), fullPage: true });
    if (name === "repetitive") assert.equal(new Set(review.map((f) => f.rule)).size, 5);
    if (name === "editorial") assert.equal(review.length, 0);
    if (name === "heldout-form") {
      assert.deepEqual(
        review.map((f) => f.rule),
        ["repetitive-section-rhythm"],
      );
      summary.at(-1).disposition =
        "Retain: consistent form groups help predictable completion. This is a false-positive aesthetic candidate.";
    }
    if (["catalog", "workspace"].includes(name)) {
      assert.equal(review.length, 0);
      assert(retained.length > 0);
    }
    if (name === "heldout-decorated") assert(review.length >= 2);
    await page.setViewportSize({ width: 320, height: 900 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.equal(await fs.readFile(source, "utf8"), before, "Review modified source");
  }
  const holdouts = JSON.parse(
    await fs.readFile("skills/dazzler-frontend/evals/composition-holdouts.json", "utf8"),
  );
  for (const task of holdouts.tasks)
    assert.equal(recommend(task).recommendations[0].id, task.expectedArchetype);
  // Same content and controls under two resolver-generated directions, not an aesthetic score.
  let textBefore;
  const sizes = [];
  for (const [name, controls] of [
    ["quieter", { intent: "quieter", density: 7, motion: 1 }],
    ["bolder", { intent: "bolder", density: 3, motion: 8 }],
  ]) {
    const result = tokens({ refinement: controls });
    const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Direction comparison</title><style>${result.css}body{margin:0;padding:24px;overflow-wrap:anywhere;background:var(--color-background);color:var(--color-text);font:var(--type-step0)/1.6 system-ui}main{max-width:65rem;margin:auto}h1{font-size:var(--type-step5);line-height:1.2}button,input{font:inherit;min-height:var(--target-min);padding:var(--component-padding);max-width:100%;box-sizing:border-box}button{color:var(--color-on-action);background:var(--color-action);transition:background var(--duration-normal)}label,input{display:block}</style><main><h1>Make room for the next idea.</h1><p>A synthetic workshop application. Keep every required field and the primary action.</p><label for="email">Email (required)</label><input id="email" required type="email"><p>Applications close October 18.</p><button>Submit application</button></main></html>`;
    const file = path.join(out, name + ".html");
    await fs.writeFile(file, html);
    await navigation(page, file, {});
    await page.goto(pathToFileURL(file).href);
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({ path: path.join(out, name + "-" + width + ".png"), fullPage: true });
    }
    const content = await page.locator("main").innerText();
    if (textBefore) assert.equal(content, textBefore);
    textBefore = content;
    assert.equal(await page.locator("input[required]").count(), 1);
    assert.equal(await page.getByRole("button", { name: "Submit application" }).count(), 1);
    const metrics = await page.evaluate(() => ({
      body: parseFloat(getComputedStyle(document.body).fontSize),
      target: document.querySelector("button").getBoundingClientRect().height,
      display: parseFloat(getComputedStyle(document.querySelector("h1")).fontSize),
    }));
    assert(metrics.body >= 16 && metrics.target >= 44);
    sizes.push(metrics.display);
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await page.locator("button").evaluate((el) => getComputedStyle(el).transitionDuration),
      "0s",
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
  assert(sizes[1] > sizes[0]);
  await fs.writeFile(
    path.join(out, "assessment.json"),
    JSON.stringify(
      {
        fixtures: summary,
        interpretation:
          "Two intentionally problematic fixtures flagged. Among four benign/conventional fixtures, editorial has no candidates, catalog/workspace retain repetition with context, and the held-out form has one false-positive rhythm candidate retained after review. Small authored set, not a population accuracy estimate or AI-host evaluation.",
        heldoutTasks: holdouts.tasks.length,
      },
      null,
      2,
    ),
  );
  console.log(
    "Six rendered fixtures, context exceptions, two held-out routing tasks, preserved content/controls, reduced motion and responsive comparisons passed",
  );
} finally {
  await browser.close();
}
