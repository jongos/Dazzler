import test from "node:test";
import assert from "node:assert/strict";
import browser from "../skills/dazzler-frontend/scripts/browser.cjs";
test("browser rejects non-web schemes, credentials and oversized viewport requests", () => {
  for (const value of [
    "javascript:alert(1)",
    "data:text/html,test",
    "ftp://example.com",
    "https://user:pass@example.com",
  ])
    assert.throws(() => browser.targetURL(value));
  assert.match(browser.targetURL("tests/fixtures/studio.html"), /^file:/);
  for (const widths of [[], [0], [9000], [390.5], Array(7).fill(390)])
    assert.throws(() => browser.widths({ widths }));
  assert.deepEqual(browser.widths({}), [1440, 390]);
});
