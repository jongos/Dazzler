#!/usr/bin/env node
/* Optional browser tooling. Uses an existing Playwright + Chromium installation. Apache-2.0. */
const fs = require("node:fs/promises"),
  path = require("node:path"),
  { pathToFileURL } = require("node:url");
const { createRequire } = require("node:module");
function runtime() {
  try {
    return require("playwright");
  } catch {
    if (process.env.DAZZLER_NODE_MODULES)
      return createRequire(path.join(process.env.DAZZLER_NODE_MODULES, "_dazzler.cjs"))(
        "playwright",
      );
    throw Error(
      "Playwright unavailable. Use a host browser, or provide an existing dependency directory through DAZZLER_NODE_MODULES; no installation was attempted.",
    );
  }
}
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
function targetURL(input) {
  return /^https?:\/\//.test(input) || input.startsWith("file:")
    ? input
    : pathToFileURL(path.resolve(input)).href;
}
async function collect(page) {
  return page.evaluate(() => {
    const visible = (e) => {
      const r = e.getBoundingClientRect();
      const s = getComputedStyle(e);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
    };
    const identify = (e) =>
      e.id
        ? "#" + e.id
        : e.tagName.toLowerCase() +
          (e.classList.length ? "." + [...e.classList].slice(0, 2).join(".") : "");
    const findings = [],
      texts = [],
      styles = [];
    let count = 0;
    for (const e of document.querySelectorAll("body *")) {
      if (!visible(e)) continue;
      const s = getComputedStyle(e),
        r = e.getBoundingClientRect(),
        selector = identify(e);
      if (r.right > innerWidth + 1 || r.left < -1)
        findings.push({
          check: "horizontal-overflow",
          selector,
          rect: { left: r.left, right: r.right },
          severity: "warning",
        });
      if (e.matches("button,a,input:not([type=hidden]),select,textarea,[role=button]")) {
        const labelled = (e.getAttribute("aria-labelledby") || "")
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent || "")
          .join("");
        const name =
          e.getAttribute("aria-label") ||
          labelled ||
          e.labels?.[0]?.textContent ||
          e.textContent ||
          e.getAttribute("alt") ||
          e.getAttribute("title") ||
          (e.matches("input[type=submit],input[type=button]") ? e.value : "");
        if (!name.trim())
          findings.push({ check: "accessible-name-candidate", selector, severity: "error" });
        if (
          e.matches("input,select,textarea") &&
          !e.labels?.length &&
          !e.hasAttribute("aria-label") &&
          !labelled
        )
          findings.push({ check: "form-label", selector, severity: "error" });
      }
      if ((e.tagName === "IMG" && !e.complete) || (e.tagName === "IMG" && e.naturalWidth === 0))
        findings.push({ check: "broken-image", selector, severity: "error" });
      if (e.tagName === "IMG" && !e.hasAttribute("alt"))
        findings.push({ check: "missing-alt", selector, severity: "error" });
      if (e.scrollHeight > e.clientHeight + 2 && ["hidden", "clip"].includes(s.overflowY))
        findings.push({ check: "clipped-content-candidate", selector, severity: "warning" });
      if ([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
        let bg = null,
          unsupported = false,
          a = e;
        while (a) {
          const st = getComputedStyle(a);
          if (st.backgroundImage !== "none" || Number(st.opacity) < 1) unsupported = true;
          if (
            !bg &&
            st.backgroundColor !== "rgba(0, 0, 0, 0)" &&
            st.backgroundColor !== "transparent"
          ) {
            if (!st.backgroundColor.startsWith("rgb(")) unsupported = true;
            bg = st.backgroundColor;
          }
          a = a.parentElement;
        }
        texts.push({
          selector,
          text: e.textContent.slice(0, 90),
          color: s.color,
          background: bg ?? "rgb(255, 255, 255)",
          fontSize: parseFloat(s.fontSize),
          fontWeight: parseInt(s.fontWeight) || 400,
          unsupported,
        });
      }
      if (count++ < 1500)
        styles.push({
          selector,
          font: s.fontFamily,
          size: s.fontSize,
          color: s.color,
          background: s.backgroundColor,
          gap: s.gap,
          radius: s.borderRadius,
          padding: s.padding,
        });
    }
    const counts = (key) =>
      Object.entries(styles.reduce((a, s) => ((a[s[key]] = (a[s[key]] || 0) + 1), a), {})).sort(
        (a, b) => b[1] - a[1],
      );
    return {
      viewport: { width: innerWidth, height: innerHeight },
      overflow: document.documentElement.scrollWidth > innerWidth,
      findings,
      texts,
      brand: {
        fonts: counts("font"),
        colors: counts("color"),
        surfaces: counts("background"),
        spacing: counts("gap"),
        radii: counts("radius"),
        observations: styles,
      },
      fonts: [...document.fonts].map((f) => ({ family: f.family, status: f.status })),
      limitations: [
        "Heuristic DOM checks are not a full accessibility audit.",
        "Pseudo-elements, images, alpha compositing, gradients and complex backgrounds require manual review.",
        "Repeated spacing values describe usage, not aesthetic correctness.",
      ],
    };
  });
}
function rgb(s) {
  const m = /^rgb\((\d+),?\s+(\d+),?\s+(\d+)\)$/.exec(s);
  return m
    ? "#" +
        m
          .slice(1)
          .map((x) => Number(x).toString(16).padStart(2, "0"))
          .join("")
    : null;
}
async function inspect(page, engine) {
  const report = await collect(page);
  for (const t of report.texts) {
    const a = rgb(t.color),
      b = rgb(t.background);
    if (t.unsupported || !a || !b) {
      t.status = "not-checked";
      continue;
    }
    t.ratio = engine.getContrastRatio(a, b);
    t.minimum = t.fontSize >= 24 || (t.fontSize >= 18.66 && t.fontWeight >= 700) ? 3 : 4.5;
    t.status = t.ratio >= t.minimum ? "pass" : "fail";
    if (t.status === "fail")
      report.findings.push({
        check: "text-contrast",
        selector: t.selector,
        ratio: t.ratio,
        minimum: t.minimum,
        severity: "error",
      });
  }
  return report;
}
async function focusProbe(page) {
  return page.evaluate(() => {
    const results = [];
    for (const e of [...document.querySelectorAll("button,a[href],input,select,textarea")].slice(
      0,
      30,
    )) {
      if (e.disabled) continue;
      e.focus();
      const s = getComputedStyle(e);
      results.push({
        element: e.id || e.tagName,
        received: document.activeElement === e,
        indicator: s.outlineStyle !== "none" || s.boxShadow !== "none",
      });
    }
    return {
      method:
        "Programmatic focus probe; actual keyboard order and obscuration still require inspection.",
      results,
    };
  });
}
async function audit(command, input, out, config = {}) {
  const { chromium } = runtime(),
    browser = await chromium.launch({ headless: true });
  const engine = await import(pathToFileURL(path.join(__dirname, "vendor/color-engine.mjs")).href);
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const reports = [];
    const cases =
      command === "stress"
        ? ["baseline", "long-text", "large-numbers", "missing-images", "empty-data", "errors"]
        : ["baseline"];
    for (const width of config.widths ?? [1440, 390])
      for (const scenario of cases) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(targetURL(input));
        await page.evaluate(() => document.fonts.ready);
        const modified = await page.evaluate(
          ({ scenario, selectors }) => {
            let count = 0;
            const change = (selector, fn) => {
              document.querySelectorAll(selector).forEach((e) => {
                fn(e);
                count++;
              });
            };
            if (scenario === "long-text")
              change(
                selectors?.text ?? '[data-dazzler-stress="text"],h1,h2,button,label',
                (e) =>
                  (e.textContent =
                    "International collaboration and accessibility requirements — " +
                    e.textContent.repeat(3)),
              );
            if (scenario === "large-numbers")
              change(
                selectors?.number ?? '[data-dazzler-stress="number"]',
                (e) => (e.textContent = "9,999,999,999.99"),
              );
            if (scenario === "missing-images")
              change("img", (e) => (e.src = "data:image/png;base64,broken"));
            if (scenario === "empty-data")
              change(selectors?.data ?? '[data-dazzler-stress="data"]', (e) => {
                e.textContent = "No results";
              });
            if (scenario === "errors")
              change(selectors?.error ?? '[data-dazzler-stress="error"]', (e) => {
                e.hidden = false;
                e.textContent =
                  "Unable to save. Your input is preserved. Check your connection and try again.";
              });
            return count;
          },
          { scenario, selectors: config.selectors },
        );
        const report = await inspect(page, engine);
        report.scenario = scenario;
        report.modifiedElements = modified;
        report.scenarioStatus =
          scenario === "baseline" ? "executed" : modified ? "simulated" : "not-applicable";
        report.screenshot = `${width}-${scenario}.png`;
        await page.screenshot({ path: path.join(out, report.screenshot), fullPage: true });
        if (scenario === "baseline") report.focus = await focusProbe(page);
        reports.push(report);
      }
    const result = {
      schemaVersion: 1,
      command,
      target: input,
      reports,
      pageErrors: errors,
      limitations: [
        "Stress changes are temporary DOM simulations, not real server errors or proof of recovery behavior.",
        "No source files are changed. Review screenshot findings before applying fixes.",
      ],
    };
    await fs.writeFile(path.join(out, "report.json"), JSON.stringify(result, null, 2));
    const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Dazzler ${command} report</title><style>body{font:16px system-ui;max-width:1100px;margin:auto;padding:32px}img{max-width:100%;max-height:500px;object-fit:contain;object-position:top}article{border-top:1px solid;padding:24px 0}pre{white-space:pre-wrap}</style><h1>Dazzler ${command}</h1><p>Automated candidates for review, not accessibility certification.</p>${reports.map((r) => `<article><h2>${r.viewport.width}px · ${r.scenario}</h2><p>${r.scenarioStatus} · ${r.findings.length} findings</p><a href="${r.screenshot}"><img alt="${r.scenario} screenshot" src="${r.screenshot}"></a><pre>${esc(JSON.stringify(r.findings, null, 2))}</pre></article>`).join("")}</html>`;
    await fs.writeFile(path.join(out, "report.html"), html);
    return result;
  } finally {
    await browser.close();
  }
}
async function fontLab(config, out) {
  if (!Array.isArray(config.pairs) || !config.pairs.length || config.pairs.length > 6)
    throw Error("Provide 1–6 font pairings");
  const links = [];
  let fileBytes = 0;
  for (const [i, pair] of config.pairs.entries()) {
    for (const role of ["heading", "body"]) {
      const css = path.resolve(pair[role].css),
        folder = path.dirname(css);
      await fs.access(path.join(folder, "selection.json"));
      const name = `pair-${i}-${role}`;
      await fs.cp(folder, path.join(out, name), {
        recursive: true,
        errorOnExist: true,
        force: false,
      });
      links.push(`${name}/${path.basename(css)}`);
      for (const f of await fs.readdir(folder)) {
        if (/\.(woff2?|otf|ttf)$/.test(f)) fileBytes += (await fs.stat(path.join(folder, f))).size;
      }
    }
  }
  const content = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Dazzler font lab</title><style>body{font:16px system-ui;padding:24px;max-width:1100px;margin:auto}.pair{padding:24px;border-top:1px solid}.sample{max-width:65ch;font-synthesis:none}.sample h2{font-size:42px;line-height:1.2}.sample p{font-size:18px;line-height:1.6}</style><h1>Font pairing lab</h1><p>Actual copy, licensed exported faces, fallback measurements and final wrapping.</p>${config.pairs.map((p, i) => `<article class="pair"><h2>${esc(p.name ?? `Pair ${i + 1}`)}</h2><div class="sample" id="pair-${i}"><h2>${esc(config.heading ?? "A thoughtful introduction")}</h2><p>${esc(config.body ?? "Choose a pairing that supports your audience, character and reading task.")}</p></div></article>`).join("")}</html>`;
  const file = path.join(out, "font-lab.html");
  await fs.writeFile(file, content);
  const { chromium } = runtime(),
    browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
    await page.goto(pathToFileURL(file).href);
    const before = await page.locator(".sample").evaluateAll((es) =>
      es.map((e) => ({
        height: e.getBoundingClientRect().height,
        width: e.getBoundingClientRect().width,
      })),
    );
    const started = Date.now();
    for (const href of links)
      await page.addStyleTag({ url: pathToFileURL(path.join(out, href)).href });
    for (const [i, p] of config.pairs.entries()) {
      await page.locator(`#pair-${i} h2`).evaluate((e, f) => {
        e.style.fontFamily = JSON.stringify(f.family);
        e.style.fontWeight = f.weight ?? 400;
      }, p.heading);
      await page.locator(`#pair-${i} p`).evaluate((e, f) => {
        e.style.fontFamily = JSON.stringify(f.family);
        e.style.fontWeight = f.weight ?? 400;
      }, p.body);
    }
    await page.evaluate(() => document.fonts.ready);
    const elapsed = Date.now() - started;
    const after = await page.locator(".sample").evaluateAll((es) =>
      es.map((e) => ({
        height: e.getBoundingClientRect().height,
        width: e.getBoundingClientRect().width,
        overflow: e.scrollWidth > e.clientWidth,
      })),
    );
    const fonts = await page.evaluate(() =>
      [...document.fonts].map((f) => ({ family: f.family, status: f.status })),
    );
    await page.screenshot({ path: path.join(out, "font-lab.png"), fullPage: true });
    const persisted = await page.content();
    await fs.writeFile(file, persisted.replaceAll(pathToFileURL(out + path.sep).href, ""));
    const result = {
      pairs: config.pairs.map((p, i) => ({
        name: p.name,
        before: before[i],
        after: after[i],
        heightDelta: after[i].height - before[i].height,
      })),
      fonts,
      assetBytes: fileBytes,
      localLoadMilliseconds: elapsed,
      notes: [
        "Local cold-page sample; not network performance or Core Web Vitals CLS.",
        "Fallback/final block geometry is measured, not a shaping or readability certification.",
      ],
    };
    await fs.writeFile(path.join(out, "font-lab.json"), JSON.stringify(result, null, 2));
    return result;
  } finally {
    await browser.close();
  }
}
async function visualCompare(config, out) {
  const { chromium } = runtime(),
    browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: config.width ?? 1280, height: 900 } });
    for (const side of ["before", "after"]) {
      await page.goto(targetURL(config[side]));
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(out, side + ".png"), fullPage: true });
    }
    await fs.writeFile(
      path.join(out, "compare.html"),
      `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Dazzler design comparison</title><style>body{font:16px system-ui;padding:24px}main{display:grid;grid-template-columns:1fr 1fr;gap:20px}img{width:100%}@media(max-width:650px){main{grid-template-columns:1fr}}</style><h1>Before / after</h1><p>${esc(config.reason ?? "Review the proposed change before applying it.")}</p><main><section><h2>Before</h2><img src="before.png" alt="Before design"></section><section><h2>After</h2><img src="after.png" alt="Proposed design"></section></main><p>This preview does not modify source files. Use the project change planner to apply or revert a reviewed file.</p></html>`,
    );
  } finally {
    await browser.close();
  }
}
async function main() {
  const { values, positionals } = require("node:util").parseArgs({
    strict: true,
    allowPositionals: true,
    options: { help: { type: "boolean" } },
  });
  if (values.help) {
    console.log(
      "Usage: browser.cjs inspect|stress|brand|fontlab|compare INPUT NEW_DIR [CONFIG_JSON]",
    );
    return;
  }
  if (positionals.length < 3 || positionals.length > 4)
    throw Error("Expected command, input, output and optional config");
  const [command, input, out, configuration] = positionals;
  if (!["inspect", "stress", "brand", "fontlab", "compare"].includes(command) || !input || !out)
    throw Error(
      "Usage: browser.cjs inspect|stress|brand URL_OR_FILE NEW_DIR [CONFIG_JSON] OR fontlab|compare CONFIG_JSON NEW_DIR",
    );
  await fs.mkdir(out, { recursive: false });
  const config = configuration ? JSON.parse(await fs.readFile(configuration, "utf8")) : {};
  let result;
  if (command === "fontlab" || command === "compare") {
    const cfg = JSON.parse(await fs.readFile(input, "utf8"));
    result = command === "fontlab" ? await fontLab(cfg, out) : await visualCompare(cfg, out);
  } else {
    result = await audit(command, input, out, config);
    if (command === "brand")
      await fs.writeFile(
        path.join(out, "brand.json"),
        JSON.stringify(
          {
            schemaVersion: 1,
            source: input,
            viewports: result.reports.map((r) => ({ viewport: r.viewport, ...r.brand })),
            locks: {},
            notes: [
              "Computed styles are observations, not authorization to reuse brand assets or infer licenses. Resolve conflicts against existing brand rules.",
            ],
          },
          null,
          2,
        ),
      );
  }
  console.log(JSON.stringify({ command, out, status: "complete" }));
}
if (require.main === module)
  main().catch((e) => {
    console.error(String(e.message).replace(/[\r\n]+/g, " "));
    console.error(
      "Usage: browser.cjs inspect|stress|brand|fontlab|compare INPUT NEW_DIR [CONFIG_JSON]",
    );
    process.exitCode = 1;
  });
module.exports = { collect, inspect, audit, fontLab, visualCompare };
