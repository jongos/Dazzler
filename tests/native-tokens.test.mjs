import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { tokens } from "../skills/dazzler-frontend/scripts/studio.mjs";
import { nativeTokens } from "../skills/dazzler-frontend/scripts/native-tokens.mjs";
for (const format of ["swiftui", "compose", "flutter"]) {
  test(`native ${format} preserves reviewed output and both mode roles`, () => {
    const system = tokens({ brand: { seed: "#7048E8" } }).system;
    const result = nativeTokens(system, format);
    assert.equal(
      result.code,
      readFileSync(new URL(`./fixtures/native/${result.name}`, import.meta.url), "utf8").replace(
        /\r\n/g,
        "\n",
      ),
    );
    for (const mode of ["light", "dark"])
      for (const role of ["action", "onAction", "danger", "onDanger"])
        assert(
          result.code.includes(system.palette.modes[mode].tokens[role].slice(1).toUpperCase()),
        );
  });
}
test("native export refuses invalid format, colors and dimensions; font text is not executable code", () => {
  const system = tokens({ fonts: { body: '"; malicious(); //' } }).system;
  assert(!nativeTokens(system, "compose").code.includes("malicious"));
  assert.throws(() => nativeTokens(system, "unknown"));
  system.palette.modes.dark.tokens.action = "url(secret)";
  assert.throws(() => nativeTokens(system, "swiftui"));
  const fresh = tokens().system;
  fresh.type.step0 = Infinity;
  assert.throws(() => nativeTokens(fresh, "flutter"));
});
