// Synthetic scenario checks only; no gallery generation or production-backend claims.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
(async () => {
  const out = path.resolve(process.argv[2] || "work/task-capabilities-browser");
  if (fs.existsSync(out)) throw Error("Use a new output directory");
  fs.mkdirSync(out, { recursive: true });
  const html = fs.readFileSync(path.join(__dirname, "../tests/fixtures/task-capabilities.html"));
  const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(html);
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const url = `http://127.0.0.1:${server.address().port}`;
    await page.goto(url);
    const pressed = async (container, id) =>
      page.locator(`#${container} [data-id=${id}]`).getAttribute("aria-pressed");
    await page.locator("#rows [data-id=a]").click();
    assert.equal(await pressed("plot", "a"), "true");
    await page.locator("#plot [data-id=b]").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.evaluate(() => document.activeElement?.dataset.id), "b");
    assert.equal(await pressed("rows", "b"), "true");
    await page.click("#sort");
    assert.equal(await pressed("plot", "a"), "true");
    await page.click("#apply");
    await page.waitForFunction(
      () => document.querySelector("#feedback").textContent === "1 completed; 1 failed",
    );
    assert.equal(await pressed("rows", "b"), "true");
    assert.equal(await pressed("rows", "a"), "false");
    await page.selectOption("#scope", "ready");
    assert.equal(await page.locator("[aria-pressed=true]").count(), 0);
    await page.fill("#search", "Inventory");
    await page.reload();
    assert.equal(await page.inputValue("#scope"), "ready");
    assert.equal(await page.inputValue("#search"), "");
    await page.selectOption("#workspace", "B");
    assert.equal(await page.inputValue("#scope"), "all");
    assert.equal(await page.locator("[aria-pressed=true]").count(), 0);
    await page.selectOption("#workspace", "A");
    assert.equal(await page.inputValue("#scope"), "ready");
    await page.fill("#wait", "0");
    await page.uncheck("#retry");
    await page.click("#preview");
    assert.match(await page.textContent("#settingStatus"), /saved: 15/);
    await page.click("#reset");
    assert.equal(await page.inputValue("#wait"), "15");
    await page.fill("#wait", "70");
    await page.click("#save");
    assert.match(await page.textContent("#settingStatus"), /0 to 60/);
    await page.fill("#wait", "0");
    await page.uncheck("#retry");
    await page.check("#failSave");
    await page.click("#save");
    assert.match(await page.textContent("#settingStatus"), /failed/);
    assert.equal(await page.inputValue("#wait"), "0");
    await page.uncheck("#failSave");
    await page.click("#save");
    await page.reload();
    assert.equal(await page.inputValue("#wait"), "0");
    assert.equal(await page.isChecked("#retry"), false);
    await page.evaluate(() => localStorage.setItem("fixture:v1:user-1:A", "broken"));
    await page.reload();
    assert.equal(await page.inputValue("#wait"), "15");
    const { planDensity } = await import("../skills/dazzler-frontend/scripts/density.mjs");
    const decision = planDensity({
      avoidableSpace: true,
      activities: ["compare"],
      inputMode: "mixed",
    });
    const before = await page.locator("#apply").boundingBox();
    before.y += await page.evaluate(() => scrollY);
    const font = await page
      .locator("p")
      .first()
      .evaluate((e) => getComputedStyle(e).fontSize);
    await page.screenshot({ path: path.join(out, "desktop-before.png"), fullPage: true });
    await page.evaluate((choice) => (document.body.dataset.density = choice), decision.selected);
    const after = await page.locator("#apply").boundingBox();
    after.y += await page.evaluate(() => scrollY);
    assert(after.y < before.y - 80, JSON.stringify({ before, after }));
    assert.equal(after.height, before.height);
    assert.equal(
      await page
        .locator("p")
        .first()
        .evaluate((e) => getComputedStyle(e).fontSize),
      font,
    );
    await page.screenshot({ path: path.join(out, "desktop-after.png"), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("#rows [data-id=a]").click();
    await page.click("#plotTab");
    assert.equal(await pressed("plot", "a"), "true");
    await page.click("#clear");
    assert.equal(await pressed("plot", "a"), "false");
    await page.screenshot({ path: path.join(out, "mobile.png"), fullPage: true });
    await page.addStyleTag({ content: "body,button,input,select{font-size:32px}" });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: path.join(out, "mobile-large-text.png"), fullPage: true });
    await page.addInitScript(
      () =>
        (Storage.prototype.setItem = function () {
          throw Error("Storage denied");
        }),
    );
    await page.reload();
    await page.selectOption("#scope", "ready");
    assert.match(await page.textContent("#feedback"), /not saved/);
    assert.deepEqual(errors, []);
    fs.writeFileSync(
      path.join(out, "result.json"),
      JSON.stringify(
        {
          status: "pass",
          scope: "Synthetic fixture only; not generated-output quality or backend verification",
          density: decision,
          taskY: { before: before.y, after: after.y },
          checks: [
            "bidirectional selection",
            "keyboard",
            "sort",
            "filter",
            "partial failure",
            "scope isolation",
            "reload",
            "invalid storage",
            "storage unavailable",
            "temporary settings",
            "save failure",
            "zero/false persistence",
            "reset",
            "density geometry",
            "mobile switch",
            "enlarged text",
          ],
        },
        null,
        2,
      ),
    );
    console.log("Synthetic interaction and density scenarios passed; captures: " + out);
  } finally {
    if (browser) await browser.close();
    await new Promise((r) => server.close(r));
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
