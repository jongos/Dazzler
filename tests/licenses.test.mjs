import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";

test("editorial adaptation retains its pinned MIT notice and destinations", async () => {
  const base = "skills/dazzler-frontend/";
  const provenance = JSON.parse(
    await fs.readFile(base + "references/editorial-provenance.json", "utf8"),
  );
  const license = (
    await fs.readFile(base + "references/" + provenance.licenseFile, "utf8")
  ).replaceAll("\r\n", "\n");
  assert.equal(
    createHash("sha256").update(license).digest("hex"),
    provenance.sourceSha256Lf.LICENSE,
  );
  assert.match(license, /Copyright \(c\) 2026 Peter Yang/);
  for (const file of provenance.adaptedFiles) await fs.access(base + file);
  const portable = await fs.readFile("platforms/portable/DAZZLER-PROMPT.md", "utf8");
  assert(portable.replaceAll("\r\n", "\n").includes(license));
});
for (const engine of ["viz", "hotspots"])
  test(engine + " retains a versioned notice for every package", async () => {
    const base = "skills/dazzler-frontend/scripts/vendor/" + engine;
    const provenance = JSON.parse(await fs.readFile(base + "/provenance.json", "utf8"));
    for (const pkg of provenance.packages) {
      assert(pkg.licenseFiles?.length);
      for (const file of pkg.licenseFiles) {
        assert(file.includes("@" + pkg.version + "-"));
        assert(provenance.files[file]);
        await fs.access(base + "/" + file);
      }
    }
    const expected = new Set(provenance.packages.flatMap((p) => p.licenseFiles));
    assert.equal((await fs.readdir(base + "/licenses")).length, expected.size);
  });
