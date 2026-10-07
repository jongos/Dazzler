const { chromium } = require("playwright");
const fs = require("node:fs/promises"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
(async () => {
  const root = path.resolve(process.argv[2]);
  const decisions = JSON.parse(
    await fs.readFile(path.join(root, "internal-decisions.json"), "utf8"),
  );
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const d of decisions) {
      for (const width of [1440, 390]) {
        const page = await browser.newPage({ viewport: { width, height: 1000 } });
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(pathToFileURL(path.join(root, d.context + ".html")).href);
        await page.evaluate(() => document.fonts.ready);
        for (const family of new Set(Object.values(d.actualFonts))) {
          assert(
            await page.evaluate(
              (f) =>
                [...document.fonts].some(
                  (x) => x.family.replace(/["']/g, "") === f && x.status === "loaded",
                ),
              family,
            ),
            family,
          );
        }
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        assert(
          await page
            .locator("td")
            .evaluateAll((cells) => cells.every((c) => c.scrollWidth <= c.clientWidth + 1)),
        );
        const visible = await page.locator("body").innerText();
        assert(!/R\d{4}|jev|datasetRevision|winnerVotes/i.test(visible));
        await page.addScriptTag({ path: require.resolve("axe-core") });
        const violations = await page.evaluate(async () =>
          (
            await axe.run(document, {
              runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
            })
          ).violations.map((x) => ({ id: x.id, targets: x.nodes.map((n) => n.target) })),
        );
        assert.deepEqual(violations, [], `${d.context}/${width}`);
        const control = page.locator("button,summary").first();
        await control.focus();
        assert(await control.evaluate((el) => el === document.activeElement));
        await page.keyboard.press("Enter");
        if (d.context === "editorial")
          assert(await page.locator("details").evaluate((el) => el.open));
        if (d.context === "commerce") {
          assert.match(await page.locator("#result").innerText(), /replaceable straps/);
          await page.locator("#filter").selectOption("ready");
          assert(await page.locator("[data-later]").isHidden());
        }
        if (d.context === "culture")
          assert.match(await page.locator("#result").innerText(), /Step-free entry/);
        if (d.context === "information") {
          await page.locator("#query").fill("garden");
          await page.locator("#action").click();
          assert.equal(await page.locator("#result").innerText(), "1 matching topic.");
        }
        if (d.context === "software") {
          assert.match(await page.locator("#result").innerText(), /maintenance team/);
          assert.equal(
            await page
              .locator("button")
              .first()
              .evaluate((el) => getComputedStyle(el).backgroundColor),
            "rgb(0, 71, 171)",
          );
        }
        assert.deepEqual(errors, []);
        await page.screenshot({
          path: path.join(root, `${d.context}-${width}.png`),
          fullPage: true,
        });
        results.push({
          context: d.context,
          width,
          fontsLoaded: true,
          overflow: false,
          axeViolations: violations,
          keyboardControl: "passed",
          interaction: "passed",
        });
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  await fs.writeFile(path.join(root, "browser-results.json"), JSON.stringify(results, null, 2));
  console.log(
    "Five derived recipe probes passed desktop/mobile fonts, overflow, axe and keyboard/interaction checks. This does not establish aesthetic quality.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
