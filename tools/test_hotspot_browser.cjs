const { chromium } = require("playwright"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
(async () => {
  const root = path.resolve(process.argv[2]),
    browser = await chromium.launch();
  try {
    for (const engine of ["svg", "react", "vue", "native"]) {
      const page = await browser.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.route(/^https?:/, (r) => r.abort());
      await page.goto(pathToFileURL(path.join(root, engine, "index.html")).href);
      await page.waitForSelector("[data-renderer]");
      if (engine !== "svg" && engine !== "native")
        await page.waitForFunction(
          () =>
            document.querySelectorAll("area").length === 3 &&
            document.querySelector("img").naturalWidth > 0,
        );
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 950 });
        await page.waitForTimeout(120);
        assert(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          engine + " page overflow",
        );
        await page.locator('[data-region-button="garden"]').click();
        assert.equal(await page.locator("#illustration").getAttribute("data-selected"), "garden");
        assert.equal(await page.locator(".hotspot-panel h2").textContent(), "Sculpture garden");
        if (engine === "svg") {
          await page.locator('[data-dazzler-region="workshop"]').focus();
          await page.keyboard.press("Enter");
          assert.equal(
            await page.locator("#illustration").getAttribute("data-selected"),
            "workshop",
          );
          const initial = await page.locator(".hotspot-visual svg").getAttribute("viewBox");
          await page.getByRole("button", { name: "Zoom in", exact: true }).click();
          assert.notEqual(
            await page.locator(".hotspot-visual svg").getAttribute("viewBox"),
            initial,
          );
          await page.getByRole("button", { name: "Reset view", exact: true }).click();
          assert.equal(await page.locator(".hotspot-visual svg").getAttribute("viewBox"), initial);
        } else if (engine === "native") {
          await page.locator("[data-native-region=workshop]").focus();
          await page.keyboard.press("Enter");
          assert.equal(
            await page.locator("#illustration").getAttribute("data-selected"),
            "workshop",
          );
          await page.locator("[data-native-region=gallery]").click();
          assert.equal(
            await page.locator("#illustration").getAttribute("data-selected"),
            "gallery",
          );
        } else {
          const area = page.locator("area").nth(1);
          await area.focus();
          await page.keyboard.press("Enter");
          assert.equal(
            await page.locator("#illustration").getAttribute("data-selected"),
            "workshop",
          );
          const box = await page.locator(".hotspot-visual img").boundingBox();
          await page.mouse.click(box.x + (box.width * 200) / 900, box.y + (box.height * 200) / 520);
          assert.equal(
            await page.locator("#illustration").getAttribute("data-selected"),
            "gallery",
            engine + " pointer geometry",
          );
          assert.equal(
            await page.locator(".hotspot-visual img").getAttribute("alt"),
            "Floor plan with a gallery and workshop above a sculpture garden.",
          );
        }
        await page.screenshot({ path: path.join(root, engine, width + ".png"), fullPage: true });
      }
      assert.deepEqual(errors, [], engine + " browser errors");
      assert.equal(await page.locator("details h3").count(), 3);
      console.log(
        engine +
          " passed responsive rendering, region selection, keyboard, pointer geometry and text alternative checks.",
      );
      await page.close();
    }
    const context = await browser.newContext({
      viewport: { width: 390, height: 850 },
      hasTouch: true,
      isMobile: true,
    });
    for (const engine of ["svg", "react", "vue", "native"]) {
      const p = await context.newPage();
      await p.goto(pathToFileURL(path.join(root, engine, "index.html")).href);
      await p.locator('[data-region-button="garden"]').tap();
      assert.equal(await p.locator("#illustration").getAttribute("data-selected"), "garden");
      if (engine === "svg") {
        await p.locator('[data-dazzler-region="gallery"]').tap();
      } else if (engine === "native") {
        await p.locator("[data-native-region=gallery]").tap();
      } else {
        await p.waitForFunction(() => document.querySelectorAll("area").length === 3);
        const box = await p.locator(".hotspot-visual img").boundingBox();
        await p.touchscreen.tap(box.x + (box.width * 200) / 900, box.y + (box.height * 200) / 520);
      }
      assert.equal(await p.locator("#illustration").getAttribute("data-selected"), "gallery");
      await p.close();
    }
    await context.close();
    console.log("All four adapters passed touch selection.");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
