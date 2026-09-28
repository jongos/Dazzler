import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  normalize,
  specification,
  render,
  vegaSVG,
  d3SVG,
} from "../skills/dazzler-frontend/scripts/visualize.mjs";
const sample = {
  title: "Revenue by quarter",
  unit: "USD",
  data: [
    { x: "Q1", y: 12 },
    { x: "Q2", y: 18 },
    { x: "Q3", y: 15 },
  ],
};
test("map geometry rejects unbounded recursion and non-geographic coordinates", () => {
  const chart = (geometry) =>
    normalize({
      type: "map",
      map: { type: "FeatureCollection", features: [{ type: "Feature", geometry }] },
    });
  assert.throws(() => d3SVG(chart({ type: "Point", coordinates: [181, 0] })));
  let nested = { type: "Point", coordinates: [0, 0] };
  for (let i = 0; i < 14; i++) nested = { type: "GeometryCollection", geometries: [nested] };
  assert.throws(() => d3SVG(chart(nested)));
  assert.throws(() =>
    d3SVG(chart({ type: "MultiPoint", coordinates: Array.from({ length: 50001 }, () => [0, 0]) })),
  );
  assert.match(d3SVG(chart({ type: "Point", coordinates: [-74, 40] })).svg, /<path/);
});
test("reject invalid, ambiguous and nonfinite data", () => {
  for (const data of [
    [],
    [{ x: "A", y: "3" }],
    [{ x: "A", y: Infinity }],
    [{ x: "A", y: null }],
    [
      { x: "A", y: 1 },
      { x: "A", y: 2 },
    ],
  ])
    assert.throws(() => normalize({ ...sample, data }));
  assert.throws(() => normalize({ ...sample, colors: ["red"] }));
  assert.throws(() => normalize({ ...sample, format: "react", type: "bar" }));
});
test("missing values remain missing and grouped bars retain series", () => {
  const n = normalize({
    ...sample,
    data: [
      { x: "Q1", y: null, series: "A" },
      { x: "Q1", y: 8, series: "B" },
    ],
  });
  assert.equal(n.data[0].y, null);
  assert.equal(n.warnings.length, 1);
  const s = specification(n);
  assert.equal(s.encoding.xOffset.field, "series");
  assert.equal(s.encoding.y.scale.zero, true);
});
test("all standard encodings produce actual Vega SVG", async () => {
  for (const type of ["bar", "line", "area", "scatter", "histogram", "boxplot", "heatmap"]) {
    const n = normalize({
      ...sample,
      type,
      data: [
        { x: 1, y: 12 },
        { x: 2, y: 18 },
        { x: 3, y: 15 },
      ],
      xType: type === "scatter" ? "quantitative" : "ordinal",
    });
    const { svg } = await vegaSVG(specification(n));
    assert.match(svg, /<svg/);
    assert(!svg.includes("NaN"));
  }
});
test("D3 layouts validate references and preserve table data", () => {
  assert.throws(() =>
    d3SVG(
      normalize({
        type: "network",
        network: { nodes: [{ id: "a" }], links: [{ source: "a", target: "missing" }] },
      }),
    ),
  );
  const n = normalize({
    type: "treemap",
    treemap: {
      name: "Root",
      children: [
        { name: "A", value: 4 },
        { name: "B", value: 6 },
      ],
    },
  });
  assert.equal(d3SVG(n).rows.length, 3);
  assert.throws(() => d3SVG(normalize({ type: "treemap", treemap: { name: "bad", value: -1 } })));
});
test("exports escape content, preserve values, refuse overwrite and use native fallback honestly", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "dazzler-viz-"));
  try {
    const out = path.join(root, "chart");
    const r = await render({ ...sample, title: "</script><script>alert(1)</script>" }, out);
    assert.equal(r.status, "rendered");
    const html = await readFile(path.join(out, "index.html"), "utf8");
    assert(!html.includes("<script>alert(1)</script>"));
    assert((await readFile(path.join(out, "data.csv"), "utf8")).includes('"Q2","18"'));
    await assert.rejects(render(sample, out));
    const office = await render({ ...sample, format: "docx" }, path.join(root, "office"));
    assert(["runtime-unavailable", "rendered", "failed"].includes(office.nativeOffice));
    if (office.nativeOffice !== "rendered") assert.equal(office.status, "fallback");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("line geometry is unfilled, ordered and readable on dark backgrounds", () => {
  const n = normalize({ ...sample, type: "line", background: "#20252C" }),
    s = specification(n);
  assert.equal(s.mark.filled, false);
  assert.equal(s.encoding.order.field, "_order");
  assert.equal(s.config.axis.labelColor, "#FFFFFF");
});
test("Microcharts generates real standalone SVG and branded React source", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "dazzler-micro-"));
  try {
    const out = path.join(root, "micro");
    await render({ ...sample, type: "area", format: "react", colors: ["#234567"] }, out);
    const svg = await readFile(path.join(out, "chart.svg"), "utf8"),
      jsx = await readFile(path.join(out, "DazzlerSparkline.jsx"), "utf8");
    assert.match(svg, /^<svg xmlns=/);
    assert.match(svg, /aria-label=/);
    assert(svg.includes("#234567"));
    assert(jsx.includes('color={"#234567"}'));
    assert(jsx.includes("fill={true}"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
test("all redistributed visualization files match the provenance hashes", async () => {
  const { createHash } = await import("node:crypto");
  const base = new URL("../skills/dazzler-frontend/scripts/vendor/viz/", import.meta.url),
    p = JSON.parse(await readFile(new URL("provenance.json", base), "utf8"));
  assert(p.packages.some((x) => x.name === "vega-lite"));
  assert(p.packages.some((x) => x.name === "@microcharts/react"));
  for (const [f, h] of Object.entries(p.files))
    assert.equal(
      createHash("sha256")
        .update(await readFile(new URL(f, base)))
        .digest("hex"),
      h,
      f,
    );
});

test("area stacking groups by category without creating phantom zero points", async () => {
  const s = specification(
    normalize({
      ...sample,
      type: "area",
      data: [
        { x: "Q2", y: 3, series: "A" },
        { x: "Q1", y: 4, series: "A" },
        { x: "Q2", y: 2, series: "B" },
        { x: "Q1", y: 1, series: "B" },
      ],
    }),
  );
  assert.deepEqual(s.encoding.x.sort, ["Q2", "Q1"]);
  const { compiled, svg } = await vegaSVG(s);
  const transforms = compiled.data.flatMap((d) => d.transform ?? []);
  assert(!transforms.some((t) => t.type === "impute"));
  const stack = transforms.find((t) => t.type === "stack");
  assert.deepEqual(stack.groupby, ["x"]);
  assert(!svg.includes("NaN"));
});
