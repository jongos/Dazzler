import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { verify, fingerprint } from "../skills/dazzler-frontend/scripts/gdc/engine.mjs";
import { planWorkflow } from "../skills/dazzler-frontend/scripts/workflow.mjs";
const dir = new URL("../skills/dazzler-frontend/scripts/gdc/", import.meta.url);
test("GDC vendored files match provenance and incomplete evidence never passes", async () => {
  const provenance = JSON.parse(await readFile(new URL("provenance.json", dir), "utf8"));
  assert.equal(provenance.repository, "https://github.com/jongos/style-science");
  for (const [name, hash] of Object.entries(provenance.files))
    assert.equal(
      createHash("sha256")
        .update(await readFile(new URL(name, dir)))
        .digest("hex"),
      hash,
    );
  const plan = JSON.parse(await readFile(new URL("example-plan.json", dir), "utf8"));
  assert.equal(verify(plan, []).status, "unknown");
  assert.equal(fingerprint(plan).length, 64);
});
test("Dazzler routes HTML-capable work to GDC without replacing native delivery gates", () => {
  for (const kind of ["interface", "document"])
    assert.ok(planWorkflow({ kind }).references.includes("gdc.md"));
  assert.ok(planWorkflow({ kind: "document" }).checks.some((c) => c.id === "print"));
  assert.ok(planWorkflow({ kind: "interface" }).checks.some((c) => c.id === "distinction"));
});
