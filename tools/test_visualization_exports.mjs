import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { render } from "../skills/dazzler-frontend/scripts/visualize.mjs";
const root = path.resolve(process.argv[2]);
await mkdir(root, { recursive: true });
const base = {
  title: "Quarterly revenue",
  description: "Fictional example. Compare the same USD units across periods.",
  source: "Dazzler demonstration data",
  unit: "USD",
  data: [
    { x: "Q1", y: 42000, series: "Subscriptions" },
    { x: "Q2", y: 54000, series: "Subscriptions" },
    { x: "Q3", y: 61000, series: "Subscriptions" },
    { x: "Q1", y: 17000, series: "Services" },
    { x: "Q2", y: 21000, series: "Services" },
    { x: "Q3", y: 24000, series: "Services" },
  ],
};
const cases = {
  bar: base,
  line: { ...base, type: "line" },
  area: { ...base, type: "area" },
  scatter: {
    ...base,
    type: "scatter",
    xLabel: "Response time (minutes)",
    yLabel: "Rating",
    unit: "",
    data: [
      { x: 2, y: 9 },
      { x: 5, y: 8 },
      { x: 9, y: 6 },
      { x: 14, y: 4 },
    ],
  },
  histogram: { ...base, type: "histogram" },
  boxplot: { ...base, type: "boxplot" },
  heatmap: { ...base, type: "heatmap" },
  network: {
    type: "network",
    title: "Delivery dependencies",
    source: "Fictional project",
    network: {
      nodes: [{ id: "Research" }, { id: "Design" }, { id: "Build" }, { id: "Review" }],
      links: [
        { source: "Research", target: "Design" },
        { source: "Design", target: "Build" },
        { source: "Build", target: "Review" },
      ],
    },
  },
  treemap: {
    type: "treemap",
    title: "Illustrative allocation",
    treemap: {
      name: "Budget",
      children: [
        { name: "Research", value: 20 },
        { name: "Design", value: 45 },
        { name: "Build", value: 35 },
      ],
    },
  },
  map: {
    type: "map",
    title: "Illustrative locations",
    map: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Sample A" },
          geometry: { type: "Point", coordinates: [-74, 40.7] },
        },
        {
          type: "Feature",
          properties: { name: "Sample B" },
          geometry: { type: "Point", coordinates: [-118.2, 34] },
        },
      ],
    },
  },
  micro: {
    ...base,
    type: "line",
    format: "react",
    data: [
      { x: "Mon", y: 4 },
      { x: "Tue", y: 7 },
      { x: "Wed", y: 5 },
      { x: "Thu", y: 9 },
    ],
  },
  office: { ...base, format: "docx" },
  dark: { ...base, background: "#20252C" },
};
for (const [name, cfg] of Object.entries(cases)) {
  await render(cfg, path.join(root, name));
}
await writeFile(path.join(root, "cases.json"), JSON.stringify(Object.keys(cases)));
console.log("Generated " + Object.keys(cases).length + " renderer fixtures.");
