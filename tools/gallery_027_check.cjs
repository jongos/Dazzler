const { chromium } = require("playwright");
const fs = require("node:fs/promises"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
(async () => {
  const root = path.resolve(
      process.env.DAZZLER_GALLERY_STAGE || "maintenance/gallery-production/v0.29.0",
    ),
    out = path.join(root, "renders");
  await fs.mkdir(out, { recursive: true });
  const source = process.env.DAZZLER_GALLERY_SOURCE || path.join(root, "artifacts");
  const { heading } = await import("../skills/dazzler-frontend/scripts/headings.mjs");
  async function headings(page, id) {
    for (const text of await page.locator("h1,h2,h3,h4,h5,h6").allTextContents()) {
      const t = text.replace(/\s+/g, " ").trim();
      assert.equal(t, heading(t), id + ": " + t);
    }
  }
  const docs = JSON.parse(await fs.readFile(path.join(root, "document-briefs.json"), "utf8"));
  const uis = JSON.parse(await fs.readFile(path.join(root, "interface-briefs.json"), "utf8"));
  const browser = await chromium.launch();
  const results = [];
  try {
    const page = await browser.newPage();
    await page.route(/^https?:/, (r) => r.abort());
    for (const d of [
      ...docs.map((d) => ({ ...d, kind: "html" })),
      ...uis.map((d) => ({ ...d, kind: "ui" })),
    ]) {
      const id = d.kind === "html" ? "html-" + d.id : d.id,
        errors = [];
      const onError = (e) => errors.push(e.message);
      page.on("pageerror", onError);
      const file = path.join(source, d.kind, d.id + (d.kind === "html" ? ".html" : "/index.html"));
      await page.goto(pathToFileURL(file).href);
      await page.evaluate(() => document.fonts.ready);
      await headings(page, id);
      await page.addScriptTag({ path: require.resolve("axe-core") });
      const views = [];
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        );
        const axe = await page.evaluate(async () =>
          (
            await axe.run(document, {
              runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
            })
          ).violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
        );
        await page.screenshot({ path: path.join(out, `${id}-${width}.png`), fullPage: true });
        views.push({ width, overflow, axe });
      }
      let interaction = "not-applicable";
      if (d.kind === "ui") {
        switch (d.id) {
          case "webapp-workspace":
            await page.locator("#draft").fill("A new local draft with seven words.");
            await page.locator("#save").click();
            assert.match(await page.locator("#status").innerText(), /saved|unavailable/);
            break;
          case "webapp-board":
            await page.locator('[data-index="0"]').click();
            assert.match(await page.locator("#status").innerText(), /Review/);
            break;
          case "webapp-settings":
            await page.locator("#digest").selectOption("17:00");
            await page.locator("#settings button").click();
            assert.match(await page.locator("#status").innerText(), /17:00/);
            break;
          case "data-revenue":
            await page.locator('[data-metric="members"]').click();
            assert.match(await page.locator("#chart-title").innerText(), /Members/);
            assert.match(await page.locator("#chart").innerText(), /480/);
            break;
          case "data-operations":
            await page.locator('[data-station="0"]').click();
            assert.match(await page.locator("#inspector").innerText(), /18.4/);
            break;
          case "restaurant-fine-dining":
            await page.locator("#courses-button").click();
            assert(await page.locator("#courses").isVisible());
            break;
          case "restaurant-cafe":
            await page.locator('[data-add="0"]').click();
            await page.locator('[data-add="0"]').click();
            assert.equal(await page.locator("#total").innerText(), "$9.00");
            await page.locator("#clear").click();
            assert.equal(await page.locator("#total").innerText(), "$0.00");
            break;
          case "restaurant-reservations":
            await page.locator('[data-zone="Quiet Corner"]').click();
            await page.locator("#date").fill("2027-07-23");
            await page.locator("#booking button[type=submit]").click();
            assert.match(await page.locator("#status").innerText(), /Quiet Corner.*Not confirmed/);
            break;
          case "restaurant-menu":
            await page.locator("#search").fill("lentil");
            assert.equal(await page.locator(".dish-row").count(), 2);
            await page.locator("#search").fill("zzzz");
            assert.match(await page.locator("#menu-items").innerText(), /No dishes/);
            break;
          case "business-portal":
            await page.locator('[data-doc="Schedule"]').click();
            assert.match(await page.locator("#preview").innerText(), /18 July/);
            await page.locator("#approve").click();
            assert.match(await page.locator("#status").innerText(), /preview only/);
            break;
        }
        interaction = "pass";
        await headings(page, id);
      }
      results.push({ id, views, errors, interaction });
      page.off("pageerror", onError);
      console.log(
        id +
          ": " +
          (views.every((v) => !v.overflow && !v.axe.length) && !errors.length ? "pass" : "REVIEW"),
      );
    }
    await fs.writeFile(path.join(root, "browser-checks.json"), JSON.stringify(results, null, 2));
    assert(
      results.every((x) => !x.errors.length && x.views.every((v) => !v.overflow && !v.axe.length)),
      "Browser accessibility or overflow failures",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
