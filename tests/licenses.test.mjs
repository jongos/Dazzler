import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
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
