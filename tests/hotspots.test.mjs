import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import {
  normalize,
  validateSVG,
  imageDimensions,
  render,
} from "../skills/dazzler-frontend/scripts/hotspots.mjs";
const region = { id: "room", label: "Room", description: "The room description." };
const sample = { title: "Floor plan", imageAlt: "A single room.", regions: [region] };
const art =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect id="room" width="90" height="90" fill="#7048E8"/></svg>';
test("interactive input rejects duplicate IDs and invalid image geometry", () => {
  assert.throws(() => normalize({ ...sample, regions: [region, region] }));
  for (const coords of [
    [0, 0, 101, 90],
    [4, 4, 2, 3],
    [0, 0, NaN, 50],
  ])
    assert.throws(() =>
      normalize({
        ...sample,
        kind: "image",
        width: 100,
        height: 100,
        regions: [{ ...region, shape: "rect", coords }],
      }),
    );
  assert.throws(() =>
    normalize({
      ...sample,
      kind: "image",
      width: 100,
      height: 100,
      regions: [{ ...region, shape: "poly", coords: [1, 1, 2, 2, 3, 3] }],
    }),
  );
  assert.equal(normalize(sample).kind, "svg");
});
test("SVG validation keeps permitted geometry and rejects active/external content", () => {
  assert.match(validateSVG(art, [region]).artwork, /id="room"/);
  for (const bad of [
    art.replace("<rect", "<script"),
    art.replace('fill="#7048E8"', 'onclick="alert(1)"'),
    art.replace('fill="#7048E8"', 'style="fill:red"'),
    art.replace('fill="#7048E8"', 'fill="url(https://example.com/a)"'),
    art.replace("<rect", "<image"),
    art.replace("<svg ", "<!DOCTYPE svg><svg "),
  ])
    assert.throws(() => validateSVG(bad, [region]));
  assert.throws(() => validateSVG(art, [{ id: "missing" }]));
});
test("SVG local paints, namespaces and hierarchy limits are checked", () => {
  const gradient = art
    .replace(
      "<rect",
      '<defs><linearGradient id="paint"><stop offset="0" stop-color="#7048E8"/></linearGradient></defs><rect',
    )
    .replace('fill="#7048E8"', 'fill="url(#paint)"');
  assert.match(validateSVG(gradient, [region]).artwork, /linearGradient/);
  assert.throws(() => validateSVG(art.replace('fill="#7048E8"', 'fill="url(#missing)"'), [region]));
  assert.throws(() =>
    validateSVG(
      art
        .replace("<rect", '<g xmlns="http://www.w3.org/1999/xhtml"><rect')
        .replace("</svg>", "</g></svg>"),
      [region],
    ),
  );
});
test("image dimensions are measured rather than inferred from region bounds", () => {
  const png = Buffer.alloc(24);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png);
  png.writeUInt32BE(900, 16);
  png.writeUInt32BE(520, 20);
  assert.deepEqual(imageDimensions(png), { mime: "image/png", width: 900, height: 520 });
  assert.throws(() => imageDimensions(Buffer.from("not an image")));
});
test("exports preserve values, notices and escaped text and refuse overwrite", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "dazzler-hotspot-"));
  try {
    const source = path.join(root, "art.svg");
    await writeFile(source, art);
    const out = path.join(root, "out");
    const r = await render({ ...sample, title: "</script><script>alert(1)</script>" }, source, out);
    assert.equal(r.renderer, "svgjs");
    assert(
      !(await readFile(path.join(out, "index.html"), "utf8")).includes("<script>alert(1)</script>"),
    );
    assert.match(await readFile(path.join(out, "regions.csv"), "utf8"), /The room description/);
    assert.match(await readFile(path.join(out, "INTEGRATE.md"), "utf8"), /Notes and credits/);
    await assert.rejects(render(sample, source, out));
    await assert.rejects(
      render(
        {
          ...sample,
          kind: "image",
          width: 99,
          height: 100,
          regions: [{ ...region, shape: "rect", coords: [0, 0, 90, 90] }],
        },
        source,
        path.join(root, "bad"),
      ),
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
test("all interactive bundles and license files match their inventory", async () => {
  const base = new URL("../skills/dazzler-frontend/scripts/vendor/hotspots/", import.meta.url),
    p = JSON.parse(await readFile(new URL("provenance.json", base), "utf8"));
  for (const name of ["@svgdotjs/svg.js", "react-img-mapper", "vue-img-mapper", "@xmldom/xmldom"])
    assert(p.packages.some((x) => x.name === name));
  for (const [file, hash] of Object.entries(p.files))
    assert.equal(
      createHash("sha256")
        .update(await readFile(new URL(file, base)))
        .digest("hex"),
      hash,
      file,
    );
});
