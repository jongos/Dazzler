import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";
import { build } from "esbuild";
import { tokens } from "../skills/dazzler-frontend/scripts/studio.mjs";
import { specimen } from "../skills/dazzler-frontend/scripts/type-system.mjs";
import { shadcnTheme } from "../skills/dazzler-frontend/scripts/shadcn-theme.mjs";

const out = path.resolve(process.argv[2] ?? "dist/design-system-review");
await fs.mkdir(out, { recursive: true });
const input = {
  fonts: { body: "Work Sans", heading: "Young Serif" },
  typography: { direction: "editorial", script: "mixed" },
};
const first = tokens(input);
await fs.writeFile(path.join(out, "design-system.json"), JSON.stringify(first.system));
// A fresh process resumes the serialized record, with no in-memory state from session one.
execFileSync(process.execPath, [
  "skills/dazzler-frontend/scripts/studio.mjs",
  "resume",
  "--config",
  path.join(out, "design-system.json"),
  "--out",
  path.join(out, "session-two"),
]);
const second = JSON.parse(await fs.readFile(path.join(out, "session-two/design-system.json")));
assert.deepEqual(second, first.system);
const imports = ["work-sans", "young-serif"]
  .map(
    (f) =>
      `@import url("${pathToFileURL(path.resolve(`docs/templates/fonts/${f}/fonts.css`)).href}");`,
  )
  .join("\n");
await fs.writeFile(path.join(out, "tokens.css"), imports + "\n" + first.css);
await fs.writeFile(path.join(out, "specimen.html"), specimen(first.system));
const mapped = shadcnTheme(first.system, {
  shadcn: { supported: true, convention: "color-values" },
});
assert.equal(mapped.status, "pass");
await fs.writeFile(
  path.join(out, "shadcn.css"),
  mapped.css +
    "body{font:18px/1.6 system-ui;color:var(--foreground);background:var(--background);padding:24px}main{max-width:800px;margin:auto}.card{padding:24px;border:1px solid var(--border);border-radius:var(--radius);background:var(--card);color:var(--card-foreground)}.button{background:var(--primary);color:var(--primary-foreground);padding:12px 20px;border:0;border-radius:var(--radius);font:inherit}.button:focus-visible{outline:3px solid var(--ring);outline-offset:4px}.muted{color:var(--muted-foreground)}",
);
await build({
  entryPoints: ["tests/fixtures/shadcn/App.jsx"],
  outfile: path.join(out, "app.js"),
  bundle: true,
  format: "iife",
  minify: true,
});
await fs.writeFile(
  path.join(out, "shadcn.html"),
  '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Theme fixture</title><link rel="stylesheet" href="shadcn.css"><div id="root"></div><script src="app.js"></script></html>',
);
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.route("**/*", (route) =>
    route.request().url().startsWith("file:") ? route.continue() : route.abort(),
  );
  await page.goto(pathToFileURL(path.join(out, "specimen.html")).href);
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() =>
    [...document.fonts]
      .filter((f) => f.status === "loaded")
      .map((f) => f.family.replaceAll(String.fromCharCode(34), "")),
  );
  assert(loaded.includes("Work Sans") && loaded.includes("Young Serif"), JSON.stringify(loaded));
  const sizes = [];
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    sizes.push(
      await page
        .locator('[data-step="step6"]')
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    );
    await page.screenshot({ path: path.join(out, `type-${width}.png`) });
  }
  assert(sizes[0] < sizes[2]);
  // 200% text scaling plus narrow reflow; not a claim of OS/browser zoom certification.
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.addStyleTag({ content: "html{font-size:200%}" });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: "print" });
  const printSize = await page
    .locator('[data-step="step6"]')
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  assert(Math.abs(printSize - first.system.typography.steps.step6.printRem * 16) < 0.1);
  await page.pdf({ path: path.join(out, "specimen.pdf"), format: "A4", printBackground: true });
  await page.emulateMedia({ media: "screen" });
  await page.goto(pathToFileURL(path.join(out, "shadcn.html")).href);
  for (const mode of ["light", "dark"]) {
    await page.setViewportSize({ width: 390, height: 1000 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.equal(
      await page.evaluate(() => document.documentElement.classList.contains("dark")),
      mode === "dark",
    );
    await page.screenshot({ path: path.join(out, `shadcn-${mode}.png`) });
    await page.getByRole("button", { name: "Switch theme" }).focus();
    await page.keyboard.press("Enter");
  }
  await page.setContent(
    `<style>${first.css}</style><div data-grid><div>Example</div></div><p>Readable body</p>`,
  );
  for (const [width, columns] of [
    [390, 4],
    [800, 8],
    [1440, 12],
  ]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.equal(
      await page
        .locator("[data-grid]")
        .evaluate((e) => getComputedStyle(e).gridTemplateColumns.split(" ").length),
      columns,
    );
    assert.equal(
      await page
        .locator("p")
        .evaluate((e) => getComputedStyle(e).getPropertyValue("--measure-body").trim()),
      "60ch",
    );
  }
  console.log(
    "Two-process continuation, 320/390/1440 reflow, 200% text, print endpoints, multilingual specimen and compiled light/dark component fixture passed",
  );
} finally {
  await browser.close();
}
