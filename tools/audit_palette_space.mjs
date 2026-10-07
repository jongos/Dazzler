import { heading } from "../skills/dazzler-frontend/scripts/headings.mjs";
// Original palette-space measurement and contextual review board. Apache-2.0.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { explore } from "../skills/dazzler-frontend/scripts/colors.mjs";
import { paletteDistance } from "../skills/dazzler-frontend/scripts/palette-space.mjs";
const out = path.resolve(process.argv[2]);
await mkdir(out, { recursive: true });
const briefs = [
  {
    brief: "Warm mineral paper with cool botanical accents",
    ranges: {
      hue: [110, 170],
      secondaryOffset: [-110, -50],
      accentOffset: [100, 180],
      neutralOffset: [-110, -70],
      chroma: [0.08, 0.26],
      lightSurface: [0.85, 0.96],
      surfaceChroma: [0.025, 0.08],
    },
  },
  {
    brief: "Night-sky science exhibition with luminous signals",
    ranges: {
      hue: [240, 310],
      chroma: [0.12, 0.3],
      gamutFraction: [0.7, 0.98],
      darkSurface: [0.12, 0.22],
      surfaceChroma: [0.035, 0.12],
    },
  },
  {
    brief: "Basic professional report with warm paper and precise ink",
    ranges: {
      hue: [20, 80],
      chroma: [0.02, 0.085],
      neutralChroma: [0.008, 0.025],
      lightSurface: [0.94, 0.98],
      surfaceChroma: [0.005, 0.025],
    },
  },
  {
    brief: "Sunlit festival with warm fields and electric counterpoints",
    ranges: {
      hue: [25, 100],
      chroma: [0.14, 0.3],
      gamutFraction: [0.65, 0.98],
      lightSurface: [0.78, 0.92],
      surfaceChroma: [0.06, 0.15],
    },
  },
];
const reviews = briefs.map((b, i) => ({
  ...b,
  ...explore({ ...b, count: 6, seed: "visual-study-" + i }),
}));
const seen = new Set(),
  measurements = [];
let attempted = 0,
  passing = 0,
  returned = 0;
for (let i = 0; i < 64; i++) {
  const r = explore({ ...briefs[i % 4], count: 6, seed: "math-audit-" + i });
  attempted += r.attempted;
  passing += r.passing;
  returned += r.candidates.length;
  let min = null;
  for (let j = 0; j < r.candidates.length; j++) {
    seen.add(JSON.stringify(Object.values(r.candidates[j].modes).map((m) => m.tokens)));
    for (let q = 0; q < j; q++) {
      const d = paletteDistance(r.candidates[j], r.candidates[q]);
      min = min === null ? d : Math.min(min, d);
    }
  }
  measurements.push({
    seed: r.seed,
    status: r.status,
    returned: r.candidates.length,
    minDistance: min,
  });
}
await writeFile(
  path.join(out, "audit.json"),
  JSON.stringify(
    {
      requests: 64,
      attempted,
      passing,
      returned,
      unique: seen.size,
      duplicateReturned: returned - seen.size,
      measurements,
      limits: "Fixture coverage, not an estimate of all possible palettes or a measure of beauty.",
    },
    null,
    2,
  ),
);
await writeFile(path.join(out, "studies.json"), JSON.stringify(reviews, null, 2));
const esc = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
let body = "";
for (const [i, r] of reviews.entries()) {
  body += `<section><h2>${esc(heading(r.brief))}</h2><p>Six alternatives from one agent-authored intent. ${r.passing}/${r.attempted} candidate systems passed the listed role checks.</p><div class="grid">`;
  for (const [j, p] of r.candidates.entries()) {
    const t = p.modes[i === 1 ? "dark" : "light"].tokens;
    body += `<article style="background:${t.background};color:${t.text};border-color:${t.border}"><small>Candidate ${j + 1}</small><h3>${i === 2 ? "A Clear Decision" : i === 1 ? "Signals After Dark" : i === 3 ? "A Day in Full Color" : "Rooted in the Landscape"}</h3><p>Same content. Different color relationships. Read the evidence, then choose the next step.</p><div class="field" aria-hidden="true"><i style="background:${t.brand}"></i><i style="background:${t.secondary}"></i><i style="background:${t.accent}"></i></div><div class="surface" style="background:${t.surface};border-color:${t.border}"><span style="color:${t.muted}">Supporting text on its actual surface</span><p><button style="background:${t.action};color:${t.onAction};--focus:${t.focus}" onclick="this.nextElementSibling.textContent='Selected for local review'">Review This Direction</button><span role="status"></span></p></div><details><summary>Color Values</summary><p>${["brand", "secondary", "accent", "background", "surface"].map((k) => esc(k) + ": " + t[k]).join("<br>")}</p></details></article>`;
  }
  body += "</div></section>";
}
await writeFile(
  path.join(out, "index.html"),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Color Relationships, Explored</title><style>*{box-sizing:border-box}body{margin:0;background:#151821;color:#F5EFE1;font:17px/1.5 system-ui,sans-serif}main{max-width:1500px;margin:auto;padding:3rem}h1{font:700 clamp(2.5rem,6vw,6rem)/1 Georgia,serif;max-width:14ch}h2{font-size:1.7rem;margin-top:3rem;max-width:40ch}.intro{max-width:65ch}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}article{padding:1.5rem;border:1px solid;min-width:0}h3{font:700 2rem/1.1 Georgia,serif}.field{display:flex;height:90px;margin:1.5rem 0}.field i:first-child{flex:5}.field i:nth-child(2){flex:3}.field i:last-child{flex:2}.surface{padding:1rem;border:1px solid}button{font:inherit;border:0;padding:.8rem;min-height:44px;cursor:pointer}button:focus-visible{outline:3px solid var(--focus);outline-offset:4px}summary{padding:.7rem 0;cursor:pointer}summary:focus-visible{outline:3px solid currentColor}small{font-size:14px}details p{font-size:14px;overflow-wrap:anywhere}[role=status]{display:block;margin-top:1rem;font-size:14px}@media(max-width:1000px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){main{padding:1rem}.grid{grid-template-columns:1fr}}</style><main><p>Dazzler / Mathematical Color Exploration</p><h1>Color Relationships, Explored</h1><p class="intro">Original combinations generated through the existing color engine. Seed-rotated Halton coverage, gamut-boundary solving and perceptual separation expand the palette space. These contextual specimens test color relationships; they are not new layout templates or a beauty ranking.</p>${body}<footer><p>Fictional copy. Licensed color-engine notices remain in Dazzler; no reference artwork was copied. All values are opaque sRGB. Geometry encourages diversity, not guaranteed aesthetic quality.</p></footer></main></html>`,
);
console.log(JSON.stringify({ attempted, passing, returned, unique: seen.size, out }));
