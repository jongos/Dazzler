const { chromium } = require("playwright");
const fs = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const assert = require("node:assert/strict");
(async () => {
  const out = path.resolve(process.argv[2]);
  const browser = await chromium.launch();
  const reports = [];
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(pathToFileURL(path.join(out, "index.html")).href);
      assert.equal(await page.locator("article").count(), 24);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      const button = page.getByRole("button", { name: "Review This Direction" }).first();
      await button.focus();
      await page.keyboard.press("Enter");
      assert.equal(
        await page.locator("[role=status]").first().textContent(),
        "Selected for local review",
      );
      await page.addScriptTag({ path: require.resolve("axe-core") });
      const violations = await page.evaluate(async () =>
        (
          await axe.run(document, {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
          })
        ).violations.map((v) => ({ id: v.id, count: v.nodes.length })),
      );
      assert.deepEqual(violations, []);
      for (let i = 0; i < 4; i++)
        await page
          .locator("section")
          .nth(i)
          .screenshot({ path: path.join(out, `intent-${i}-${width}.png`) });
      reports.push({
        width,
        candidates: 24,
        overflow: false,
        keyboard: "pass",
        axeViolations: violations,
      });
    }
    assert.deepEqual(errors, []);
    await fs.writeFile(path.join(out, "browser-checks.json"), JSON.stringify(reports, null, 2));
    console.log(JSON.stringify(reports));
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
