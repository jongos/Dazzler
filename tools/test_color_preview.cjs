/* Optional browser QA: run against a generated preview folder. Requires Playwright. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const folder = path.resolve(process.argv[2]);
  const result = JSON.parse(fs.readFileSync(path.join(folder, 'palette.json'), 'utf8'));
  assert.equal(result.status, 'pass');
  const browser = await chromium.launch({ headless: true });
  const errors = [], network = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
    await page.goto(pathToFileURL(path.join(folder, 'preview.html')).href);
    for (const theme of ['light', 'dark']) {
      await page.selectOption('#theme', theme);
      const token = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-background').trim());
      assert.equal(token, result.modes[theme].tokens.background);
      await page.locator('#action').focus();
      assert.equal(await page.locator('#action').evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
      await page.screenshot({ path: path.join(folder, `preview-${theme}.png`), fullPage: true });
      for (const vision of ['protanopia', 'deuteranopia', 'tritanopia', 'normal']) {
        await page.selectOption('#vision', vision);
        assert.equal(await page.locator('#vision').inputValue(), vision);
      }
    }
    await page.locator('#action').click();
    assert.match(await page.locator('#feedback').innerText(), /completed/);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.selectOption('#theme', 'light');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: path.join(folder, 'preview-mobile.png'), fullPage: true });
    assert.deepEqual(errors, []);
    assert.deepEqual(network, []);
    const report = { themes: 2, simulationsPerTheme: 3, focus: 'pass', action: 'pass', mobileOverflow: false, errors, network };
    fs.writeFileSync(path.join(folder, 'browser-qa.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
