const { chromium } = require("playwright"),
  fs = require("node:fs/promises"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
(async () => {
  const root = path.resolve(process.argv[2]),
    names = JSON.parse(await fs.readFile(path.join(root, "cases.json"), "utf8"));
  const b = await chromium.launch();
  try {
    const p = await b.newPage();
    let errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    for (const name of names) {
      errors = [];
      await p.goto(pathToFileURL(path.join(root, name, "index.html")).href);
      await p.waitForTimeout(120);
      assert.equal(await p.locator("#chart svg").count(), 1, name);
      for (const width of [1440, 390]) {
        await p.setViewportSize({ width, height: 950 });
        assert(
          await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          name + " overflow",
        );
        await p.screenshot({ path: path.join(root, name, width + ".png"), fullPage: true });
      }
      assert.deepEqual(errors, [], name);
      assert((await p.locator("table tbody tr").count()) > 0, name);
      if (name === "scatter") {
        const before = await p.locator("#chart svg").innerHTML();
        await p.locator("#chart").hover();
        await p.mouse.wheel(0, 100);
        await p.waitForTimeout(100);
        assert.notEqual(await p.locator("#chart svg").innerHTML(), before, "scatter zoom");
      }
    }
    console.log(
      names.length +
        " rendered outputs passed desktop/mobile, SVG, table, runtime and scatter zoom checks.",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
