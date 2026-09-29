// Local handoff mechanics only: no live Figma or image-generation claim.
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { chromium } from "playwright";

const out = path.resolve(process.argv[2] ?? "dist/handoff-review");
await fs.mkdir(out, { recursive: false });
function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.error?.message);
}
const observed = path.resolve("tests/fixtures/handoff-observed.css");
const css = await fs.readFile(observed, "utf8");
run(process.env.DAZZLER_PYTHON ?? "python", [
  "skills/dazzler-frontend/scripts/project.py",
  "brand",
  observed,
  "--out",
  path.join(out, "observed.json"),
]);
const evidence = JSON.parse(await fs.readFile(path.join(out, "observed.json"), "utf8"));
assert.equal(evidence.status, "review-required");
assert.deepEqual(evidence.locks, {});
assert.equal(evidence.conflicts.length, 1);
assert.deepEqual(evidence.conflicts[0].values, ["#173eac", "#91afff"]);
assert.equal(await fs.readFile(observed, "utf8"), css);

const implementation =
  '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Synthetic workshop</title><style>body{font:18px/1.5 system-ui;margin:24px;max-width:800px;color:#202638}button,input{font:inherit;min-height:44px;max-width:100%}button{background:#173eac;color:white;padding:10px}h1{color:#173eac}label{display:block}:focus-visible{outline:3px solid #ae4210;outline-offset:4px}</style><h1>Saturday clay workshop</h1><p>June 12 · 10 am · $45 per person</p><form><label for="email">Email for workshop details</label><input id="email" type="email" required><button type="submit">Request details</button></form></html>';
const after = path.join(out, "implementation.html");
await fs.writeFile(after, implementation);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(after).href);
  // A deterministic captured fixture stands in for a supplied raster, not an AI-generated comp.
  await page.screenshot({ path: path.join(out, "proposal.png") });
  const before = path.join(out, "comp.html");
  await fs.writeFile(
    before,
    '<!doctype html><html lang="en"><meta charset="utf-8"><title>Fixture proposal</title><style>body{margin:0}img{display:block;width:100%}</style><img src="proposal.png" alt="Synthetic workshop proposal"></html>',
  );
  const config = path.join(out, "comparison.json");
  await fs.writeFile(
    config,
    JSON.stringify({
      before,
      after,
      width: 1280,
      reason: "Local wrapper path verification; not an image-generation or fidelity benchmark.",
    }),
  );
  run(process.execPath, [
    "skills/dazzler-frontend/scripts/browser.cjs",
    "compare",
    config,
    path.join(out, "comparison"),
  ]);
  for (const file of ["before.png", "after.png", "compare.html", "compare.json"])
    assert((await fs.stat(path.join(out, "comparison", file))).size > 0);
  assert.equal(await fs.readFile(after, "utf8"), implementation);
  await page.locator("#email").focus();
  await page.keyboard.press("Tab");
  assert.equal(await page.locator("button").evaluate((el) => el === document.activeElement), true);
  assert.equal(await page.locator("form").evaluate((el) => el.checkValidity()), false);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve("docs/handoff/index.html")).href);
  await page.evaluate(() => document.fonts.ready);
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert(
      await page
        .locator("img")
        .evaluateAll((els) => els.every((el) => el.complete && el.naturalWidth > 0)),
    );
    await page.screenshot({ path: path.join(out, `guide-${width}.png`), fullPage: true });
  }
  await page.locator("summary").first().focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("details[open]").count(), 1);
  assert(await page.evaluate(() => document.fonts.check('18px "Work Sans"')));
  assert(await page.evaluate(() => document.fonts.check('48px "Young Serif"')));
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: path.join(out, "guide.pdf"), format: "A4", printBackground: true });
  assert.deepEqual(errors, []);
  console.log(
    "Local evidence conflicts, raster wrapper comparison, source preservation, keyboard form checks and guide reflow/fonts/images/print export passed. Live Figma and image generation not tested.",
  );
} finally {
  await browser.close();
}
