import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { heading } from "../skills/dazzler-frontend/scripts/headings.mjs";
import { tokens } from "../skills/dazzler-frontend/scripts/studio.mjs";
import { resolvePolicy } from "../skills/dazzler-frontend/scripts/design-policy.mjs";
import { resumeConfig } from "../skills/dazzler-frontend/scripts/design-record.mjs";
import { generate } from "../skills/dazzler-frontend/scripts/colors.mjs";
const cases = JSON.parse(
  readFileSync(new URL("./fixtures/heading-cases.json", import.meta.url), "utf8"),
);
test("Protected heading cases share vectors with native document exports", () => {
  for (const c of cases) assert.equal(heading(c.input, c.options), c.expected, c.input);
  assert.throws(() => heading("Title", { case: "invalid" }));
  assert.throws(() => heading("Title", { preserve: [null] }));
  const repeated = "eBay and a colorful guide. ".repeat(300);
  assert.equal(
    heading(repeated, { preserve: Array(100).fill("eBay") }),
    heading(repeated, { preserve: ["eBay"] }),
  );
});
test("New work is expressive across industries and explicit overrides survive resume", () => {
  for (const context of [
    "legal memo",
    "finance dashboard",
    "government service",
    "clinical intake",
    "enterprise admin",
    "compliance review",
  ])
    assert.equal(resolvePolicy({ context }).tone, "expressive");
  for (const context of [
    "portfolio",
    "festival",
    "restaurant menu",
    "consumer app",
    "editorial story",
    "marketing site",
  ])
    assert.equal(resolvePolicy({ context }).tone, "expressive");
  assert.equal(resolvePolicy({ context: "finance", tone: "reserved" }).tone, "reserved");
  assert.equal(resolvePolicy({ context: "finance", policyGeneration: 1 }).tone, "reserved");
  const legacy = tokens({ context: "finance", policyGeneration: 1 });
  delete legacy.system.configuration.policyGeneration;
  assert.equal(tokens(resumeConfig(legacy.system)).system.policy.tone, "reserved");
  const input = {
    context: "legal memo",
    tone: "expressive",
    measure: 72,
    typography: { headingCase: "preserve", lang: "en-GB", preserve: ["eBay"] },
    motion: { normal: 0 },
  };
  const built = tokens(input);
  assert.equal(built.system.schemaVersion, 3);
  assert.equal(built.system.typography.measure, 72);
  assert.equal(built.system.motion.normal, 0);
  assert.deepEqual(tokens(resumeConfig(built.system)), built);
  assert.equal(tokens({ schemaVersion: 2 }).system.policy, undefined);
  assert.equal(
    tokens({
      context: "legal memo",
      brand: { locks: { light: { brand: "#A12345" }, dark: { brand: "#A12345" } } },
    }).system.palette.modes.light.tokens.brand,
    "#A12345",
  );
  assert.match(tokens().css, /--measure-body: 60ch/);
  assert.match(tokens().css, /grid-template-columns/);
});
test("Danger foreground is measured and AAA conflicts remain explicit", () => {
  const p = generate({ base: "#cc2233" });
  for (const mode of Object.values(p.modes)) {
    assert(mode.checks.some((x) => x.foreground === "onDanger" && x.passes));
    assert(mode.notes.some((x) => x.includes("brand/danger")));
  }
  const locked = generate({
    base: "#7048E8",
    target: "AAA",
    locked: { light: { text: "#777777", background: "#FFFFFF" } },
  });
  assert.equal(locked.status, "unresolved");
  assert.equal(locked.modes.light.tokens.text, "#777777");
  assert(locked.modes.light.failures.some((x) => x.foreground === "text" && x.minimum === 7));
});
