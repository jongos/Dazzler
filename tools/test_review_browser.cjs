// Synthetic runtime regression; no gallery assets or screenshots are written.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { inspect } = require("../skills/dazzler-frontend/scripts/browser.cjs");

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
    await page.setContent(`<html lang="en"><body style="background:white;color:black">
      <button style="width:18px;height:18px;padding:0">X</button>
      <p style="font:16px Arial;color:#999">Low contrast text</p>
      <p style="font:16px Arial;width:70ch">${"Representative sustained reading content. ".repeat(8)}</p>
      <p style="background:linear-gradient(white,black)">Requires compositing review</p>
      </body></html>`);
    // The production bundled contrast engine, not a fixture calculation.
    const engine = await import("../skills/dazzler-frontend/scripts/vendor/color-engine.mjs");
    const report = await inspect(page, engine);
    assert(report.designReview.some((f) => f.check === "target-size" && f.ruleId === "DZ-103"));
    assert(report.designReview.some((f) => f.check === "body-measure" && f.ruleId === "DZ-104"));
    assert(report.findings.some((f) => f.check === "text-contrast" && f.ruleId === "DZ-101"));
    assert(report.notRun.some((f) => f.ruleId === "DZ-101" && f.status === "not-run"));
    for (const f of [...report.designReview, ...report.findings]) {
      assert(f.ruleId);
      assert.equal(f.source, "measured");
      assert.equal(f.priorityStatus, "needs-impact-review");
    }
    await page.setContent('<button style="width:24px;height:24px;padding:0">X</button>');
    assert(!(await inspect(page, engine)).designReview.some((f) => f.check === "target-size"));
    const { assessMeasurement } = await import("../skills/dazzler-frontend/scripts/review.mjs");
    for (const width of [59.9, 60, 60.1, 60.3, 60.5, 60.6]) {
      await page.setContent(
        `<p style="font:16px monospace;width:${width}ch">${"Reading text. ".repeat(30)}</p>`,
      );
      const value = await page.locator("p").evaluate((e) => {
        const canvas = document.createElement("canvas").getContext("2d");
        canvas.font = getComputedStyle(e).font;
        return e.getBoundingClientRect().width / canvas.measureText("0").width;
      });
      const finding = (await inspect(page, engine)).designReview.find((f) => f.ruleId === "DZ-104");
      assert.equal(
        Boolean(finding),
        assessMeasurement("DZ-104", {
          applicability: "applies",
          reason: "Synthetic body",
          measureCh: value,
        }).status === "fail",
      );
      if (finding)
        assert.equal(
          assessMeasurement("DZ-104", {
            applicability: "applies",
            reason: "Scanner result",
            measureCh: finding.estimatedCh,
          }).status,
          "fail",
        );
    }
    console.log("Synthetic rendered review IDs, thresholds and not-run coverage passed");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
