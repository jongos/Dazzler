#!/usr/bin/env node
// Dazzler visualization adapters. Original integration: Apache-2.0.
import { readFile, writeFile, mkdir, copyFile, cp } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { chart, escapeHTML as esc } from "./studio.mjs";
import { getContrastRatio } from "./vendor/color-engine.mjs";
import { readJSON, createOutput } from "./runtime.mjs";
import {
  hierarchy,
  treemap,
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  geoPath,
  geoMercator,
} from "./vendor/viz/d3.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url)),
  vendor = path.join(HERE, "vendor/viz");
const json = (x) => JSON.stringify(x).replaceAll("<", "\\u003c");
const csv = (rows) =>
  rows
    .map((row) => row.map((v) => '"' + String(v ?? "").replaceAll('"', '""') + '"').join(","))
    .join("\n") + "\n";
const text = (s, fallback) => (typeof s === "string" && s.length <= 300 ? s : fallback);
const hex = (s) => typeof s === "string" && /^#[0-9a-f]{6}$/i.test(s);
const finite = (n) => typeof n === "number" && Number.isFinite(n);
export function normalize(input) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw Error("Expected a chart object");
  const type =
    input.type ??
    {
      trend: "line",
      relationship: "scatter",
      distribution: "histogram",
      composition: "bar",
      comparison: "bar",
    }[input.goal] ??
    "bar";
  if (
    ![
      "bar",
      "line",
      "area",
      "scatter",
      "histogram",
      "boxplot",
      "heatmap",
      "network",
      "treemap",
      "map",
    ].includes(type)
  )
    throw Error("Unsupported chart type");
  const width = input.width ?? 720,
    height = input.height ?? 380;
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 320 ||
    width > 1600 ||
    height < 200 ||
    height > 1200
  )
    throw Error("Use width 320–1600 and height 200–1200");
  const n = {
    schemaVersion: 1,
    type,
    title: text(input.title, "Chart"),
    description: text(input.description, "Values supplied by the project."),
    source: text(input.source, "Source not provided"),
    unit: text(input.unit, ""),
    xLabel: text(input.xLabel, "Category"),
    yLabel: text(input.yLabel, "Value"),
    font: text(input.font, "Arial"),
    background: input.background ?? "#FFFFFF",
    width,
    height,
    xType: input.xType ?? (type === "scatter" ? "quantitative" : "nominal"),
    warnings: [],
  };
  if (!hex(n.background)) throw Error("Use an opaque six-digit background color");
  if (!["nominal", "ordinal", "quantitative", "temporal"].includes(n.xType))
    throw Error("Invalid xType");
  if (["network", "treemap", "map"].includes(type)) {
    n.special = structuredClone(input[type]);
    if (!n.special) throw Error("Provide " + type + " data");
    n.series = ["Data"];
  } else {
    if (!Array.isArray(input.data) || input.data.length === 0 || input.data.length > 10000)
      throw Error("Provide 1–10000 data rows");
    n.data = input.data.map((r, i) => {
      if (
        !r ||
        typeof r !== "object" ||
        !["string", "number"].includes(typeof r.x) ||
        String(r.x).length > 300 ||
        r.x === "" ||
        (typeof r.x === "number" && !finite(r.x)) ||
        !(r.y === null || finite(r.y))
      )
        throw Error("Invalid x/y at row " + i);
      if (n.xType === "quantitative" && !finite(r.x))
        throw Error("Quantitative x requires numbers");
      if (
        n.xType === "temporal" &&
        (typeof r.x !== "string" ||
          !/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(r.x) ||
          !Number.isFinite(Date.parse(r.x)))
      )
        throw Error("Temporal x requires ISO dates");
      return { x: r.x, y: r.y, series: text(r.series, "Data") };
    });
    const order = new Map();
    for (const r of n.data) {
      if (!order.has(r.x)) order.set(r.x, order.size);
      r._order = order.get(r.x);
    }
    n.series = [...new Set(n.data.map((r) => r.series))];
    if (n.series.length > 8) throw Error("Use at most 8 series; facet a larger comparison");
    if (n.data.every((r) => r.y === null)) throw Error("All values are missing");
    if (n.data.some((r) => r.y === null))
      n.warnings.push("Missing values remain missing; they are not replaced with zero.");
    if (["bar", "line", "area", "heatmap"].includes(type)) {
      const keys = n.data.map((r) => JSON.stringify([r.x, r.series]));
      if (new Set(keys).size !== keys.length)
        throw Error("Duplicate x/series rows: explicitly aggregate or choose another chart");
    }
  }
  const p = chart({
    count: Math.max(2, n.series.length),
    background: n.background,
    labels: n.series.length === 1 ? [n.series[0], "Unused"] : n.series,
  });
  n.colors = input.colors ?? p.entries.slice(0, n.series.length).map((e) => e.color);
  if (
    !Array.isArray(n.colors) ||
    n.colors.length !== n.series.length ||
    n.colors.some((c) => !hex(c))
  )
    throw Error("Provide one opaque hex color per series");
  n.palette = p.entries.slice(0, n.series.length).map((e, i) => ({
    ...e,
    color: n.colors[i],
    contrast: getContrastRatio(n.colors[i], n.background),
  }));
  if (n.palette.some((e) => e.contrast < 3))
    n.warnings.push(
      "One or more supplied graphic colors are below 3:1 against the chart background.",
    );
  n.format = input.format ?? "html";
  if (!["html", "svg", "react", "docx", "pptx"].includes(n.format))
    throw Error("Unsupported output format");
  n.engine =
    n.format === "react"
      ? "microcharts"
      : ["docx", "pptx"].includes(n.format)
        ? "mschart"
        : ["network", "treemap", "map"].includes(type)
          ? "d3"
          : "vega";
  if (
    n.engine === "microcharts" &&
    (n.series.length !== 1 || !["line", "area"].includes(type) || n.data.some((r) => r.y === null))
  )
    throw Error(
      "Compact React export supports one complete line/area series; use Vega for other cases",
    );
  if (n.engine === "mschart" && !["bar", "line", "area", "scatter"].includes(type))
    throw Error("Native Office adapter supports bar, line, area and scatter");
  return n;
}
export function specification(n) {
  const ink =
    getContrastRatio("#FFFFFF", n.background) > getContrastRatio("#20252C", n.background)
      ? "#FFFFFF"
      : "#20252C";
  const color = {
    field: "series",
    type: "nominal",
    scale: { domain: n.series, range: n.colors },
    legend: n.series.length === 1 ? null : { title: null },
  };
  const enc = {
    x: { field: "x", type: n.xType, title: n.xLabel, sort: null },
    y: {
      field: "y",
      type: "quantitative",
      title: n.yLabel + (n.unit ? " (" + n.unit + ")" : ""),
      scale: { zero: true },
    },
    color,
    tooltip: [
      { field: "x", title: n.xLabel },
      { field: "y", title: n.yLabel },
      { field: "series" },
    ],
  };
  let mark = {
    type: n.type === "scatter" ? "point" : n.type,
    filled: n.type !== "line",
    aria: true,
  };
  if (n.type === "bar" && n.series.length > 1) enc.xOffset = { field: "series" };
  if (["line", "area"].includes(n.type)) {
    mark.point = true;
    mark.invalid = "break-paths-show-domains";
    enc.order = ["nominal", "ordinal"].includes(n.xType)
      ? { field: "_order", type: "quantitative" }
      : { field: "x", type: n.xType };
    if (n.type === "line") enc.strokeDash = { field: "series", type: "nominal" };
  }
  if (n.type === "area") {
    delete enc.order;
    enc.y.stack = "zero";
    enc.y.impute = null;
    if (["nominal", "ordinal"].includes(n.xType)) enc.x.sort = [...new Set(n.data.map((r) => r.x))];
  }
  if (n.type === "scatter") {
    enc.shape = { field: "series", type: "nominal" };
    mark.size = 80;
  }
  if (n.type === "histogram") {
    mark = { type: "bar", aria: true };
    enc.x = { field: "y", type: "quantitative", bin: true, title: n.yLabel };
    enc.y = { aggregate: "count", type: "quantitative", title: "Count" };
    delete enc.tooltip;
  }
  if (n.type === "boxplot") {
    mark = { type: "boxplot", extent: 1.5, aria: true };
    delete enc.tooltip;
  }
  if (n.type === "heatmap") {
    mark = { type: "rect", aria: true };
    enc.x = { field: "x", type: "nominal", title: n.xLabel };
    enc.y = { field: "series", type: "nominal", title: null };
    enc.color = {
      field: "y",
      type: "quantitative",
      scale: { range: [n.background, n.colors[0]] },
      title: n.unit || n.yLabel,
    };
  }
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v6.json",
    description: n.description,
    data: { values: n.data },
    width: n.width,
    height: n.height,
    background: n.background,
    mark,
    encoding: enc,
    ...(n.type === "scatter"
      ? { params: [{ name: "zoom", select: "interval", bind: "scales" }] }
      : {}),
    config: {
      font: n.font,
      view: { stroke: null },
      axis: {
        labelFontSize: 12,
        titleFontSize: 13,
        labelLimit: 110,
        labelAngle: 0,
        labelOverlap: true,
        labelColor: ink,
        titleColor: ink,
        domainColor: ink,
        tickColor: ink,
        gridColor: ink,
        gridOpacity: 0.18,
      },
      legend: { labelFontSize: 12, labelColor: ink, titleColor: ink, orient: "bottom" },
    },
  };
}
export async function vegaSVG(spec) {
  const { compile, parse, View } = await import("./vendor/viz/vega.mjs");
  const compiled = compile(spec).spec;
  const view = new View(parse(compiled), {
    renderer: "none",
    loader: {
      load: async () => {
        throw Error("External data loading disabled");
      },
      sanitize: async () => {
        throw Error("External assets disabled");
      },
    },
  });
  try {
    await view.runAsync();
    return { svg: await view.toSVG(), compiled };
  } finally {
    view.finalize();
  }
}
export function d3SVG(n) {
  const w = n.width,
    h = n.height,
    fill = n.colors[0];
  let body = "",
    rows = [];
  if (n.type === "network") {
    const { nodes, links } = n.special;
    if (
      !Array.isArray(nodes) ||
      !nodes.length ||
      nodes.length > 150 ||
      !Array.isArray(links) ||
      links.length > 1000
    )
      throw Error("Network requires 1–150 nodes and at most 1000 links");
    const ids = new Set();
    for (const node of nodes) {
      if (typeof node.id !== "string" || ids.has(node.id) || node.id.length > 100)
        throw Error("Network IDs must be unique strings");
      ids.add(node.id);
    }
    if (links.some((l) => !ids.has(l.source) || !ids.has(l.target)))
      throw Error("Network link refers to a missing node");
    const ns = nodes.map((x) => ({ id: x.id, label: text(x.label, x.id) })),
      ls = links.map((x) => ({ source: x.source, target: x.target }));
    const sim = forceSimulation(ns)
      .force(
        "link",
        forceLink(ls)
          .id((x) => x.id)
          .distance(80),
      )
      .force("charge", forceManyBody().strength(-180))
      .force("collision", forceCollide(25))
      .force("center", forceCenter(w / 2, h / 2))
      .stop();
    sim.tick(180);
    sim.stop();
    for (const x of ns) {
      x.x = Math.max(40, Math.min(w - 70, x.x));
      x.y = Math.max(35, Math.min(h - 25, x.y));
    }
    body =
      ls
        .map(
          (l) =>
            `<line x1="${l.source.x}" y1="${l.source.y}" x2="${l.target.x}" y2="${l.target.y}" stroke="#89929B"/>`,
        )
        .join("") +
      ns
        .map(
          (x) =>
            `<g><circle cx="${x.x}" cy="${x.y}" r="8" fill="${fill}"/><text x="${x.x + 12}" y="${x.y + 4}">${esc(x.label)}</text></g>`,
        )
        .join("");
    rows = [["Source", "Target"], ...links.map((l) => [l.source, l.target])];
  } else if (n.type === "treemap") {
    let count = 0;
    function verify(x, depth = 0) {
      if (!x || typeof x.name !== "string" || x.name.length > 100 || depth > 30 || ++count > 300)
        throw Error("Invalid or oversized hierarchy");
      if (x.children) {
        if (!Array.isArray(x.children) || !x.children.length)
          throw Error("Children must be nonempty");
        x.children.forEach((v) => verify(v, depth + 1));
      } else if (!finite(x.value) || x.value < 0)
        throw Error("Leaf values must be nonnegative numbers");
    }
    verify(n.special);
    const root = hierarchy(n.special)
      .sum((x) => (x.children ? 0 : x.value))
      .sort((a, b) => b.value - a.value);
    if (!root.value) throw Error("Treemap total must be positive");
    treemap().size([w, h]).padding(4)(root);
    body = root
      .leaves()
      .map(
        (x) =>
          `<g><rect x="${x.x0}" y="${x.y0}" width="${x.x1 - x.x0}" height="${x.y1 - x.y0}" fill="${fill}"/><title>${esc(x.data.name)}: ${x.value}</title>${x.x1 - x.x0 > 90 && x.y1 - x.y0 > 42 ? `<text x="${x.x0 + 8}" y="${x.y0 + 20}" fill="white">${esc(x.data.name.slice(0, 12))}</text>` : ""}</g>`,
      )
      .join("");
    rows = [
      ["Item", "Value"],
      ...root.leaves().map((x) => [
        x
          .ancestors()
          .reverse()
          .map((a) => a.data.name)
          .join(" / "),
        x.value,
      ]),
    ];
  } else {
    if (
      n.special.type !== "FeatureCollection" ||
      !Array.isArray(n.special.features) ||
      !n.special.features.length ||
      n.special.features.length > 2000
    )
      throw Error("Map requires a GeoJSON FeatureCollection with 1–2000 features");
    let vertices = 0;
    function geometry(g, depth = 0) {
      if (!g || depth > 12) throw Error("Invalid map geometry depth");
      if (g.type === "GeometryCollection") {
        if (!Array.isArray(g.geometries) || !g.geometries.length)
          throw Error("Empty geometry collection");
        for (const child of g.geometries) geometry(child, depth + 1);
        return;
      }
      const levels = {
        Point: 0,
        MultiPoint: 1,
        LineString: 1,
        MultiLineString: 2,
        Polygon: 2,
        MultiPolygon: 3,
      };
      if (!(g.type in levels)) throw Error("Unsupported map geometry");
      function coordinates(c, level) {
        if (!Array.isArray(c) || !c.length) throw Error("Empty map coordinates");
        if (level) {
          for (const child of c) coordinates(child, level - 1);
        } else if (
          ++vertices > 50000 ||
          c.length < 2 ||
          c.length > 3 ||
          !c.every(finite) ||
          Math.abs(c[0]) > 180 ||
          Math.abs(c[1]) > 90
        )
          throw Error("Map coordinates exceed geographic or complexity limits");
      }
      coordinates(g.coordinates, levels[g.type]);
    }
    for (const feature of n.special.features) {
      if (feature?.type !== "Feature") throw Error("Expected GeoJSON feature");
      geometry(feature.geometry);
    }
    const projection = geoMercator(),
      bounds = geoPath(projection).bounds(n.special);
    if (bounds[0][0] === bounds[1][0] && bounds[0][1] === bounds[1][1])
      projection
        .center(projection.invert(bounds[0]))
        .translate([w / 2, h / 2])
        .scale(Math.min(w, h) / 6);
    else
      projection.fitExtent(
        [
          [15, 15],
          [w - 15, h - 15],
        ],
        n.special,
      );
    const draw = geoPath(projection);
    body = n.special.features
      .map((f, i) => {
        const d = draw(f);
        if (!d || /NaN|Infinity/.test(d)) throw Error("Invalid map geometry");
        return `<path d="${d}" fill="${fill}" stroke="${n.background}"><title>${esc(f.properties?.name ?? "Feature " + (i + 1))}</title></path>`;
      })
      .join("");
    rows = [
      ["Feature"],
      ...n.special.features.map((f, i) => [f.properties?.name ?? "Feature " + (i + 1)]),
    ];
  }
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(n.title)}"><title>${esc(n.title)}</title><desc>${esc(n.description)}</desc><rect width="100%" height="100%" fill="${n.background}"/><g font-family="${esc(n.font)}" font-size="12" fill="${getContrastRatio("#FFFFFF", n.background) > getContrastRatio("#20252C", n.background) ? "#FFFFFF" : "#20252C"}">${body}</g></svg>`,
    rows,
  };
}
export async function render(input, out) {
  const n = normalize(input);
  let spec,
    svg,
    compiled,
    rows = n.data ? [["X", "Y", "Series"], ...n.data.map((r) => [r.x, r.y, r.series])] : [];
  if (n.engine === "d3") {
    ({ svg, rows } = d3SVG(n));
  } else if (n.engine === "microcharts") {
    const { renderSparkline } = await import("./vendor/viz/microcharts.mjs");
    const raw = renderSparkline({
      data: n.data.map((r) => r.y),
      title: n.title,
      color: n.colors[0],
      fill: n.type === "area",
    });
    svg = raw.match(/<svg[\s\S]*?<\/svg>/)?.[0];
    if (!svg) throw Error("Microcharts did not render SVG");
    const css = await readFile(path.join(vendor, "microcharts.css"), "utf8");
    svg = svg
      .replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"')
      .replace(
        /(<svg[^>]*>)/,
        "$1<style>" +
          css +
          ":root{--mc-stroke:" +
          n.colors[0] +
          ";--mc-positive:" +
          n.colors[0] +
          ";--mc-accent:" +
          n.colors[0] +
          "}</style>",
      );
  } else {
    spec = specification(n);
    ({ svg, compiled } = await vegaSVG(spec));
  }
  out = await createOutput(out);
  const write = (file, data) => writeFile(path.join(out, file), data, "utf8");
  await write("chart.svg", svg);
  await write("data.csv", csv(rows));
  await write("chart.json", JSON.stringify(n, null, 2) + "\n");
  if (spec) await write("spec.vl.json", JSON.stringify(spec, null, 2) + "\n");
  await cp(path.join(vendor, "licenses"), path.join(out, "licenses"), { recursive: true });
  await copyFile(path.join(HERE, "../LICENSE.txt"), path.join(out, "LICENSE.txt"));
  await copyFile(path.join(vendor, "provenance.json"), path.join(out, "renderer-provenance.json"));
  const table = `<div class="table-wrap"><table><caption>Underlying data — missing values are blank</caption><thead><tr>${rows[0].map((x) => `<th>${esc(x)}</th>`).join("")}</tr></thead><tbody>${rows
    .slice(1)
    .map((row) => "<tr>" + row.map((x) => `<td>${esc(x ?? "")}</td>`).join("") + "</tr>")
    .join("")}</tbody></table></div>`;
  let scripts = "",
    style = "";
  if (n.engine === "vega") {
    const runtime = (await readFile(path.join(vendor, "vega-browser.js"), "utf8")).replaceAll(
      "</script",
      "<\\/script",
    );
    scripts = `<script>${runtime}</script><script>const spec=${json(compiled)};const view=new DazzlerVega.View(DazzlerVega.parse(spec),{renderer:'svg',container:'#chart',hover:true,loader:{load:async()=>{throw Error('External data disabled')},sanitize:async()=>{throw Error('External assets disabled')}}});const resize=()=>view.width(Math.max(240,Math.min(${n.width},document.querySelector('#chart').clientWidth-90))).runAsync().catch(()=>{document.querySelector('#notice').textContent='Interactive render unavailable; use the saved SVG and data table.'});resize();new ResizeObserver(resize).observe(document.querySelector('#chart'));</script>`;
  }
  if (n.engine === "microcharts")
    style =
      (await readFile(path.join(vendor, "microcharts.css"), "utf8")) +
      ":root{--mc-stroke:" +
      n.colors[0] +
      ";--mc-positive:" +
      n.colors[0] +
      ";--mc-accent:" +
      n.colors[0] +
      "}";
  await write(
    "index.html",
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(n.title)}</title><style>${style}*{box-sizing:border-box}body{font:16px/1.55 Arial,sans-serif;color:#20252c;background:#f5f6f8;margin:0}main{max-width:1100px;margin:30px auto;padding:30px;background:white}h1{font-size:30px}#chart{overflow:auto}#chart>svg{max-width:none;height:auto}table{border-collapse:collapse;width:100%;font-size:14px}td,th{padding:10px;border-bottom:1px solid #ccd2da;text-align:left}.table-wrap{overflow:auto}a{color:#344d86}footer{font-size:12px}button{font:inherit;padding:8px 14px}details{margin:25px 0}:focus-visible{outline:3px solid #344d86;outline-offset:3px}@media(max-width:600px){main{margin:0;padding:20px}}@media print{button{display:none}main{margin:0}}</style><main><h1>${esc(n.title)}</h1><p>${esc(n.description)}</p><p>${esc(n.source)}${n.unit ? " · " + esc(n.unit) : ""}</p><div id="chart" tabindex="0" aria-label="Chart; scroll horizontally if needed">${svg}</div><p id="notice" role="status">${n.type === "scatter" ? "Drag to pan; scroll to zoom. The source table preserves exact values." : ""}</p><p><a href="chart.svg" download>Download SVG</a> · <a href="data.csv" download>Download data</a> <button onclick="print()">Print / PDF</button></p><details open><summary>View underlying data</summary>${table}</details><footer>${esc(n.warnings.join(" "))} Renderer: ${n.engine}. Fonts are references; verify the final artifact.</footer></main>${scripts}</html>`,
  );
  if (n.engine === "microcharts") {
    await write(
      "DazzlerSparkline.jsx",
      `import {Sparkline} from '@microcharts/react/sparkline';\nimport '@microcharts/react/styles.css';\nexport default function DazzlerSparkline(){return <Sparkline data={${json(n.data.map((r) => r.y))}} title={${json(n.title)}} color={${json(n.colors[0])}} fill={${n.type === "area"}}/>;}\n`,
    );
    await write(
      "dependencies.json",
      JSON.stringify(
        {
          dependencies: { "@microcharts/react": "0.19.1" },
          peerDependencies: { react: "^18.0.0 || ^19.0.0" },
          notes: "Merge into the existing React project; do not replace its package.json.",
        },
        null,
        2,
      ),
    );
  }
  const report = {
    engine: n.engine,
    status: "rendered",
    nativeOffice: "not-requested",
    warnings: n.warnings,
    files: ["index.html", "chart.svg", "data.csv", "chart.json"],
  };
  if (n.engine === "mschart") {
    await write(
      "office-data.csv",
      csv([["x", "y", "series"], ...n.data.map((r) => [r.x, r.y, r.series])]),
    );
    await write(
      "office-options.csv",
      csv([
        ["key", "value"],
        ...Object.entries({
          type: n.type,
          title: n.title,
          font: n.font,
          background: n.background,
          ink:
            getContrastRatio("#FFFFFF", n.background) > getContrastRatio("#20252C", n.background)
              ? "#FFFFFF"
              : "#20252C",
          xLabel: n.xLabel,
          yLabel: n.yLabel + (n.unit ? " (" + n.unit + ")" : ""),
          format: n.format,
          width: 6,
          height: 3.5,
        }),
      ]),
    );
    await write(
      "office-series.csv",
      csv([["series", "color"], ...n.series.map((s, i) => [s, n.colors[i]])]),
    );
    await copyFile(path.join(HERE, "office-chart.R"), path.join(out, "office-chart.R"));
    const result = spawnSync(
      "Rscript",
      ["--vanilla", path.resolve(out, "office-chart.R"), path.resolve(out)],
      { encoding: "utf8", timeout: 120000, windowsHide: true },
    );
    report.nativeOffice =
      result.error?.code === "ENOENT"
        ? "runtime-unavailable"
        : result.status === 0
          ? "rendered"
          : "failed";
    if (report.nativeOffice !== "rendered") {
      report.status = "fallback";
      report.warnings.push(
        "Native chart not produced. Install R with mschart >=0.5.1 and officer >=0.7.5 in an approved runtime, then run Rscript --vanilla office-chart.R OUTPUT_DIRECTORY. SVG/HTML are static fallbacks, not editable Office charts.",
      );
      report.diagnostic = result.error?.message || result.stderr;
    } else report.files.push("chart." + n.format);
  }
  await write("report.json", JSON.stringify(report, null, 2) + "\n");
  return report;
}

import { cli } from "./cli.mjs";
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  await cli(
    "visualize.mjs --config chart.json --out NEW_DIRECTORY",
    { config: { type: "string" }, out: { type: "string" } },
    async (v, args) => {
      if (!v.config || !v.out) throw Error("Missing --config or --out");
      console.log(JSON.stringify(await render(await readJSON(v.config), path.resolve(v.out))));
    },
    0,
  );
