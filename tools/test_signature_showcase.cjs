const { chromium } = require("playwright");
const fs = require("node:fs/promises");
const path = require("node:path");
const assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
(async () => {
  const root = path.resolve("skills/dazzler-frontend/assets/art-direction");
  const out = path.resolve(process.argv[2]);
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.route(/^https?:/, (r) => r.abort());
    for (const id of ["baseline", "atlas", "signal", "ledger"]) {
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1100 });
        await page.goto(pathToFileURL(path.join(root, id + ".html")).href);
        await page.evaluate(() => document.fonts.ready);
        assert(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          id + " overflow",
        );
        const fonts = await page.evaluate(() => ({
          body: getComputedStyle(document.body).fontFamily,
          heading: getComputedStyle(document.querySelector("h1")).fontFamily,
          loaded: [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family),
        }));
        if (id !== "baseline") {
          assert(fonts.loaded.includes("Work Sans"));
          assert(fonts.loaded.includes(id === "atlas" ? "Young Serif" : "Archivo"));
        }
        await page.locator("summary").focus();
        await page.keyboard.press("Enter");
        assert((await page.locator("details").getAttribute("open")) !== null);
        assert.equal(await page.locator("tbody tr").count(), 6);
        assert.deepEqual(await page.locator("tbody td").allTextContents(), [
          "18%",
          "21%",
          "24%",
          "29%",
          "34%",
          "42%",
        ]);
        await page.keyboard.press("Enter");
        await page.addScriptTag({ path: require.resolve("axe-core") });
        const violations = await page.evaluate(
          async () =>
            (
              await axe.run(document, {
                runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
              })
            ).violations,
        );
        assert.deepEqual(
          violations.map((v) => ({ id: v.id, nodes: v.nodes.length })),
          [],
          id + " axe",
        );
        await page.screenshot({ path: path.join(out, `${id}-${width}.png`), fullPage: true });
        results.push({ id, width, fonts, sourceRows: 6, axeViolations: 0 });
      }
    }
    assert.deepEqual(errors, []);
    await fs.writeFile(path.join(out, "checks.json"), JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
  console.log(
    "Four same-content directions: fonts, values, keyboard, axe and reflow passed at 1440/390.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
