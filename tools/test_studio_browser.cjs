const assert = require("node:assert/strict"),
  path = require("node:path"),
  fs = require("node:fs/promises");
const { audit, fontLab, visualCompare } = require("../skills/dazzler-frontend/scripts/browser.cjs");
(async () => {
  const out = path.resolve(process.argv[2]);
  await fs.mkdir(out, { recursive: false });
  for (const name of ["inspect", "stress", "brand", "compare"])
    await fs.mkdir(path.join(out, name));
  const fixture = path.resolve("tests/fixtures/studio.html");
  const inspected = await audit("inspect", fixture, path.join(out, "inspect"));
  assert(inspected.reports.some((r) => r.overflow));
  assert(inspected.reports[0].findings.some((f) => f.check === "text-contrast"));
  assert(inspected.reports[0].findings.some((f) => f.check === "form-label"));
  assert(inspected.reports[0].texts.some((t) => t.status === "not-checked"));
  const stressed = await audit("stress", fixture, path.join(out, "stress"), { widths: [390] });
  assert.equal(stressed.reports.length, 6);
  assert(stressed.reports.every((r) => r.scenario === "baseline" || r.modifiedElements > 0));
  const brand = await audit("brand", fixture, path.join(out, "brand"), { widths: [390] });
  assert(brand.reports[0].brand.fonts.length);
  await visualCompare({ before: fixture, after: fixture }, path.join(out, "compare"));
  assert(
    (await fs.readFile(path.join(out, "compare/compare.html"), "utf8")).includes("Before / after"),
  );
  console.log(
    "Browser checks passed: known overflow/contrast/label defects, complex-background exclusion, six stress scenarios, brand observations and visual comparison.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
