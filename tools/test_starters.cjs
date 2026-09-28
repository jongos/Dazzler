const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
(async () => {
  const out = path.resolve(process.argv[2] || "dist/starter-review");
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(pathToFileURL(path.resolve("docs/starters/index.html")).href);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("article").count(), 19);
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({ path: path.join(out, `starters-${width}.png`) });
    }
    const summary = page.locator("summary").first();
    await summary.focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("details[open]").count(), 1);
    assert(await page.evaluate(() => document.fonts.check('18px "Work Sans"')));
    assert(await page.evaluate(() => document.fonts.check('48px "Young Serif"')));
    assert.deepEqual(errors, []);
    console.log(
      "19 starters: desktop, mobile, narrow reflow, fonts and keyboard disclosure passed",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
