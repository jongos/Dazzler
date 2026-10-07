const { chromium } = require("playwright");
const fs = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const assert = require("node:assert/strict");
(async () => {
  const out = path.resolve(process.argv[2]);
  const browser = await chromium.launch();
  const results = [];
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.route(/^https?:/, (r) => r.abort());
    for (const id of ["pulse", "water", "print"])
      for (const width of [1440, 390, 320]) {
        await page.setViewportSize({ width, height: 1100 });
        await page.goto(pathToFileURL(path.join(out, id + ".html")).href);
        await page.evaluate(() => document.fonts.ready);
        assert(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          id + " overflow",
        );
        const loaded = await page.evaluate(() =>
          [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family),
        );
        assert(loaded.includes("Work Sans"));
        assert(loaded.includes(id === "water" ? "Young Serif" : "Archivo"));
        if (id === "pulse") {
          await page.getByRole("button", { name: "Accent beat 2", exact: true }).focus();
          await page.keyboard.press("Space");
          assert.equal(await page.locator("#pattern").textContent(), "Accented beats: 1, 2");
          await page.locator("#tempo").focus();
          await page.keyboard.press("ArrowRight");
          assert.equal(await page.locator("#bpm").textContent(), "97");
        }
        if (id === "water") {
          assert(
            await page.locator("svg").evaluate((svg) => {
              const edge = svg.getBoundingClientRect();
              const labels = [...svg.querySelectorAll("text")]
                .slice(-6)
                .map((n) => n.getBoundingClientRect());
              return labels.every(
                (b, i) =>
                  b.left >= edge.left &&
                  b.right <= edge.right &&
                  (!i || labels[i - 1].right <= b.left),
              );
            }),
            "Chart month labels fit without overlaps",
          );

          await page.locator("#station").focus();
          await page.keyboard.press("ArrowDown");
          await page.keyboard.press("Enter");
          assert.deepEqual(await page.locator("tbody td").allTextContents(), [
            "7",
            "7",
            "6",
            "5",
            "4",
            "5",
          ]);
          assert.equal(
            await page.locator("#series").getAttribute("points"),
            "55,160 173,160 291,190 409,220 527,250 645,220",
          );
        }
        if (id === "print") {
          await page.getByRole("button", { name: "Screen", exact: true }).focus();
          await page.keyboard.press("Enter");
          assert.equal(await page.locator(".event:visible").count(), 1);
          assert.equal(await page.locator("#count").textContent(), "1 session");
        }
        await page.addScriptTag({ path: require.resolve("axe-core") });
        const violations = await page.evaluate(async () =>
          (
            await axe.run(document, {
              runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
            })
          ).violations.map((v) => ({ id: v.id, nodes: v.nodes.length })),
        );
        assert.deepEqual(violations, [], id + " axe");
        assert(!/\u00c2|\u00c3/.test(await page.locator("body").innerText()), "UTF-8 text");
        await page.screenshot({ path: path.join(out, id + "-" + width + ".png"), fullPage: true });
        results.push({
          id,
          width,
          fonts: loaded,
          overflow: false,
          keyboardTask: "pass",
          axeViolations: violations,
        });
      }
    assert.deepEqual(errors, []);
    await fs.writeFile(path.join(out, "verified.json"), JSON.stringify(results, null, 2));
    console.log(JSON.stringify({ renders: results.length, status: "pass" }));
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
