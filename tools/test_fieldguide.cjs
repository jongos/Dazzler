const { chromium } = require("playwright");
const fs = require("node:fs/promises"),
  path = require("node:path"),
  assert = require("node:assert/strict"),
  { pathToFileURL } = require("node:url");
(async () => {
  const out = path.resolve(process.argv[2] || "dist/fieldguide-review");
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  try {
    await page.goto(pathToFileURL(path.resolve("docs/index.html")).href);
    await page.evaluate(() => document.fonts.ready);
    assert(
      await page.evaluate(
        () =>
          document.fonts.check('16px "Work Sans"') && document.fonts.check('24px "Young Serif"'),
      ),
    );
    await page.screenshot({ path: path.join(out, "guide-desktop.png") });
    await page.addScriptTag({ path: require.resolve("axe-core") });
    const axe = await page.evaluate(() =>
      axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } }),
    );
    await fs.writeFile(
      path.join(out, "accessibility.json"),
      JSON.stringify(axe.violations, null, 2),
    );
    assert.deepEqual(
      axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      [],
    );
    await page.locator("#brief").fill('<img src=x onerror="alert(1)"> A bookshop.');
    assert((await page.locator("#built-prompt").textContent()).includes("<img"));
    assert.equal(await page.locator("#built-prompt img").count(), 0);
    await page
      .locator("#brief")
      .fill("A local bookshop. Help readers discover new arrivals and events.");
    await page.locator("#control").scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(out, "guide-brief.png") });
    await page.locator('[data-filter="ui"]').click();
    assert.equal(await page.locator(".showcase-grid article:visible").count(), 10);
    await page.locator("#search").fill("zz-no-match");
    assert.equal(await page.locator(".showcase-grid article:visible").count(), 0);
    assert.match(await page.locator("#results").textContent(), /^0 of/);
    await page.locator("#search").fill("");
    await page.locator('[data-filter="all"]').click();
    assert.equal(await page.locator(".showcase-grid article:visible").count(), 30);
    await page.locator('[data-filter="docx"]').focus();
    await page.keyboard.press("Space");
    assert.equal(await page.locator(".showcase-grid article:visible").count(), 10);
    await page.locator('[data-filter="all"]').click();
    await page.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: async () => {
            throw Error("Denied");
          },
        },
        configurable: true,
      }),
    );
    await page.locator("#copy-prompt").click();
    await page.waitForFunction(() =>
      document.querySelector("#notice").textContent.includes("manually"),
    );
    await page.locator("#host").selectOption("gemini");
    assert.match(await page.locator("#install-command").textContent(), /gemini extensions install/);
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => scrollTo(0, 0));
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({ path: path.join(out, `guide-${width}.png`) });
    }
    const normalSize = await page.evaluate(() =>
      parseFloat(getComputedStyle(document.body).fontSize),
    );
    await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
    assert.equal(
      await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize)),
      normalSize * 2,
    );
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.evaluate(() => (document.documentElement.style.fontSize = ""));
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: path.join(out, "field-guide.pdf"),
      preferCSSPageSize: true,
      printBackground: true,
    });
    assert.deepEqual(errors, []);
    console.log(
      "Field guide: fonts, axe, prompt injection, filtering, host controls, reflow, enlarged text and PDF generation passed.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
