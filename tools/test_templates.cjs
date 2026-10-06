// Local template behavior and responsive layout checks; use an existing Playwright runtime.
const { chromium } = require("playwright"),
  fs = require("node:fs/promises"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
(async () => {
  const capture = !process.argv.includes("--check-only");
  const { heading } = await import("../skills/dazzler-frontend/scripts/headings.mjs");
  async function checkHeadings(page, id) {
    const texts = await page.locator("h1,h2,h3,h4,h5,h6,[role=heading]").allTextContents();
    for (const raw of texts) {
      const text = raw.replace(/\s+/g, " ").trim();
      assert.equal(text, heading(text), id + ": rendered heading " + text);
    }
  }
  const root = path.resolve("skills/dazzler-frontend/assets/templates"),
    out = path.resolve(process.argv[2]);
  await fs.mkdir(out, { recursive: true });
  const catalog = JSON.parse(await fs.readFile(path.join(root, "catalog.json"), "utf8")),
    browser = await chromium.launch();
  const checks = [],
    captures = [];
  try {
    const page = await browser.newPage({ acceptDownloads: true });
    let errors = [],
      external = [];
    await page.route(/^https?:/, (route) => {
      external.push(route.request().url());
      return route.abort();
    });
    page.on("pageerror", (e) => errors.push(e.message));
    for (const t of catalog.templates.filter((t) => t.format !== "docx")) {
      errors = [];
      await page.goto(
        pathToFileURL(path.join(root, t.path, t.format === "ui" ? "index.html" : "")).href,
      );
      await page.evaluate(() => document.fonts.ready);
      await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
      assert.deepEqual(
        await page.evaluate(async () => {
          await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
          return [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src);
        }),
        [],
        t.id + " broken images",
      );
      await checkHeadings(page, t.id);
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        if (await page.locator("iframe").count()) {
          await page.locator("iframe").scrollIntoViewIfNeeded();
          const frame = page.frameLocator("iframe");
          await frame.locator("#illustration").waitFor();
          await frame.locator("img").evaluateAll(async (images) => {
            await Promise.all(images.map((image) => image.decode()));
          });
        }
        const accessibility = await page.evaluate(() =>
          axe.run(document, {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
          }),
        );
        assert.deepEqual(
          accessibility.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
          [],
          t.id + " accessibility",
        );

        assert(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          t.id + " overflow",
        );
        if (t.format === "ui") {
          assert(
            await page.evaluate(() => {
              const header = document.querySelector(".top").getBoundingClientRect();
              return [...document.querySelectorAll(".top nav a")].every(
                (link) => link.getBoundingClientRect().bottom <= header.bottom + 1,
              );
            }),
            t.id + " navigation escaped its header",
          );
        }
        await page.screenshot({
          path: path.join(out, t.id + "-" + width + ".png"),
          fullPage: true,
        });
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.evaluate(() => scrollTo(0, 0));
      if (capture)
        await page.screenshot({
          path: path.join(root, "previews", t.id + ".jpg"),
          type: "jpeg",
          quality: 88,
        });
      await page.pdf({
        path: path.join(out, t.id + ".pdf"),
        printBackground: true,
        preferCSSPageSize: true,
      });
      assert(
        (await page.evaluate(
          () => [...document.fonts].filter((f) => f.status === "loaded").length,
        )) > 0,
        t.id + " fonts",
      );
      if (t.format === "ui") {
        const cfg = JSON.parse(await fs.readFile(path.join(root, t.path, "template.json"), "utf8"));
        assert.deepEqual(
          await page.locator("#template-data").evaluate((e) => JSON.parse(e.textContent)),
          cfg,
        );
        const save = async () => page.locator("#dialog-save").click();
        if (cfg.layout === "workspace") {
          await page.locator("#search").fill("no match");
          assert(await page.locator("#empty").isVisible());
          await page.locator("#search").fill("");
          await page.locator('[data-dialog="project"]').click();
          await page.locator("#entry").fill("New sample");
          await save();
          assert.equal(await page.locator(".project-row").count(), cfg.projects.length + 1);
        }
        if (cfg.layout === "board") {
          await page.locator("#owner-filter").selectOption("Alex");
          assert.equal(
            await page.locator(".task").count(),
            cfg.tasks.filter((t) => t.owner === "Alex").length,
          );
          await page.locator("#owner-filter").selectOption("Everyone");
          await page.locator('[data-dialog="task"]').click();
          await page.locator("#entry").fill("Review launch");
          await save();
          assert.equal(await page.locator(".task").count(), cfg.tasks.length + 1);
          await page.locator("[data-move]").first().click();
          assert.match(await page.locator("#status").innerText(), /moved/);
        }
        if (cfg.layout === "settings") {
          await page.locator("#name").fill("Taylor");
          assert.match(await page.locator("#dirty").innerText(), /Unsaved/);
          await page.locator('#settings button[type="reset"]').click();
          assert.equal(await page.locator("#name").inputValue(), "Alex Morgan");
          await page.locator("#settings button").last().click();
          assert.match(await page.locator("#dirty").innerText(), /Saved/);
        }
        if (cfg.layout === "revenue") {
          assert(
            (await page.locator("#revenue-metrics").innerText()).includes(
              new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                cfg.months.reduce((s, x) => s + x.gross - x.refunds, 0),
              ),
            ),
          );
          await page.locator("#period").selectOption("q2");
          assert((await page.locator("#revenue-metrics").innerText()).includes("$175,400.00"));
          assert.equal(await page.locator("#revenue-table tbody tr").count(), 3);
          const dl = page.waitForEvent("download");
          await page.locator('[data-action="download"]').click();
          const csv = await fs.readFile(await (await dl).path(), "utf8");
          assert(csv.includes("Apr"));
          assert(!csv.includes("Jan"));
        }
        if (cfg.layout === "operations") {
          assert.equal(
            await page.locator(".ticket").count(),
            cfg.tickets.filter((t) => t.status === "Open").length,
          );
          await page.locator("[data-resolve]").first().click();
          assert.equal(
            await page.locator(".ticket").count(),
            cfg.tickets.filter((t) => t.status === "Open").length - 1,
          );
          await page.locator("#show-resolved").check();
          assert.equal(await page.locator(".ticket").count(), cfg.tickets.length);
          await page.locator("#queue").selectOption("Billing");
          assert.equal(
            await page.locator(".ticket").count(),
            cfg.tickets.filter((t) => t.queue === "Billing").length,
          );
          const dl = page.waitForEvent("download");
          await page.locator('[data-action="download"]').click();
          assert((await dl).suggestedFilename().endsWith(".csv"));
        }
        if (cfg.layout === "reservations") {
          await page.locator("#guest").fill("Taylor");
          await page.locator("#guest-email").fill("taylor@example.com");
          await page.locator('input[name="time"]').first().check();
          await page.locator("#reservation button").click();
          assert((await page.locator("#dialog-content").innerText()).includes("Taylor"));
          await save();
          assert.match(await page.locator("#status").innerText(), /No table/);
        }
        if (cfg.layout === "cafe") {
          await page.locator('[data-filter="Coffee"]').click();
          assert.equal(
            await page.locator(".product").count(),
            cfg.items.filter((x) => x.category === "Coffee").length,
          );
          await page.locator('[data-filter="All"]').click();
          await page.locator('[data-add="0"]').click({ clickCount: 2 });
          await page.locator('[data-add="3"]').click();
          assert.equal(await page.locator("#subtotal").innerText(), "$13.50");
          await page.locator('[data-quantity="0"][data-delta="-1"]').click();
          assert.equal(await page.locator("#subtotal").innerText(), "$9.00");
          await page.locator('[data-action="cart"]').click();
          await save();
          assert.match(await page.locator("#status").innerText(), /Nothing was sent/);
        }
        if (cfg.layout === "menu") {
          await page.locator("#vegan").check();
          assert.equal(
            await page.locator(".menu-dish").count(),
            cfg.items.filter((x) => x.vegan).length,
          );
          await page.locator("#menu-search").fill("lemon");
          assert.equal(await page.locator(".menu-dish").count(), 2);
          await page.locator("#menu-search").fill("no such dish");
          assert(await page.locator("#menu-empty").isVisible());
        }
        if (cfg.layout === "revenue") {
          for (const quarter of [1, 3, 4]) {
            await page.locator("#period").selectOption("q" + quarter);
            const total = cfg.months
              .slice((quarter - 1) * 3, quarter * 3)
              .reduce((sum, x) => sum + x.gross - x.refunds, 0);
            assert(
              (await page.locator("#revenue-metrics").innerText()).includes(
                new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                  total,
                ),
              ),
            );
          }
        }
        if (cfg.layout === "reservations") {
          await page.locator("iframe").scrollIntoViewIfNeeded();
          const frame = page.frameLocator("iframe");
          for (const id of ["window", "quiet", "social"]) {
            await frame.locator('[data-native-region="' + id + '"]').click();
            assert.equal(await frame.locator("#illustration").getAttribute("data-selected"), id);
          }
          await frame.locator("button[data-region-button=window]").focus();
          await page.keyboard.press("Enter");
          assert.equal(
            await frame.locator("#illustration").getAttribute("data-selected"),
            "window",
          );
        }
        if (cfg.layout === "business") {
          await page.locator('[data-brief="0"]').click();
          assert((await page.locator("#dialog-content").innerText()).includes("Review Checklist"));
          await page.keyboard.press("Escape");
          await page.locator('[data-approve="0"]').click();
          assert(
            (await page.locator(".deliverable").first().innerText()).includes(
              "Approved in preview",
            ),
          );
          await page.locator('[data-dialog="revision"]').click();
          await page.locator("#entry").fill("Clarify the headline");
          await save();
          assert(
            (await page.locator(".deliverable").first().innerText()).includes(
              "Clarify the headline",
            ),
          );
        }
        const broken = await page.evaluate(() =>
          [...document.querySelectorAll('a[href^="#"]')]
            .filter((a) => !document.getElementById(a.getAttribute("href").slice(1)))
            .map((a) => a.getAttribute("href")),
        );
        assert.deepEqual(broken, [], t.id + " broken anchors");
      }
      await checkHeadings(page, t.id);
      captures.push({
        id: t.id,
        engine: "Chromium",
        viewport: { width: 1440, height: 1000 },
        sourceSha256: require("node:crypto")
          .createHash("sha256")
          .update(await fs.readFile(path.join(root, t.path, t.format === "ui" ? "index.html" : "")))
          .digest("hex"),
      });
      assert.deepEqual(external, [], t.id + " external dependency");
      assert.deepEqual(errors, [], t.id + " page errors");
      checks.push({
        id: t.id,
        viewports: [1440, 390],
        fonts: "loaded",
        interactionChecks: t.format === "ui" ? "passed" : "printable worked example",
      });
    }
    if (capture)
      await fs.writeFile(
        path.join(root, "previews/browser-captures.json"),
        JSON.stringify(captures, null, 2) + "\n",
      );
    await fs.writeFile(path.join(out, "checks.json"), JSON.stringify(checks, null, 2));
    console.log(
      "20 HTML/UI templates passed responsive, font, context-specific interaction and data checks.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
