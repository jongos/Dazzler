// Original Dazzler same-content art-direction specimen. Apache-2.0.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tokens } from "../skills/dazzler-frontend/scripts/studio.mjs";
import {
  normalize,
  specification,
  vegaSVG,
} from "../skills/dazzler-frontend/scripts/visualize.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "skills/dazzler-frontend/assets/art-direction");
await mkdir(out, { recursive: true });
const data = [18, 21, 24, 29, 34, 42].map((y, i) => ({ x: String(2020 + i), y }));
const title = "More Shade. More City.";
const intro =
  "Six years of shade coverage in a fictional city. The canopy has grown, but the next decision is where to plant.";
const finding =
  "Coverage increased by 24 percentage points, from 18% to 42%. The 2025 result is 2 points above the illustrative 40% target.";
const notes =
  "Synthetic demonstration data, not a measured city or forecast. Coverage alone does not establish equitable access or a causal health benefit.";
const variants = [
  {
    id: "baseline",
    name: "Neutral Baseline",
    font: "Arial",
    heading: "Arial",
    ink: "#313647",
    paper: "#FFFFFF",
    accent: "#7048E8",
  },
  {
    id: "atlas",
    name: "Field Atlas",
    font: "Work Sans",
    heading: "Young Serif",
    ink: "#153E35",
    paper: "#F2F0E6",
    accent: "#245D4A",
  },
  {
    id: "signal",
    name: "Public Campaign",
    font: "Work Sans",
    heading: "Archivo",
    ink: "#1C2823",
    paper: "#F1D650",
    accent: "#1C2823",
  },
  {
    id: "ledger",
    name: "Technical Dossier",
    font: "Work Sans",
    heading: "Archivo",
    ink: "#153354",
    paper: "#F3F6FA",
    accent: "#225AA5",
  },
];
const common = `*{box-sizing:border-box}.mobile-chart{display:none}.canopy{margin:25px 0}.canopy svg{width:100%;max-width:380px}@media(max-width:650px){.desktop-chart{display:none}.mobile-chart{display:block}}body{margin:0;color:var(--ink);background:var(--paper);font:17px/1.6 var(--font-body)}a{color:inherit}p{max-width:58ch}header,main,footer{max-width:1320px;margin:auto;padding:28px 5vw}header{display:flex;justify-content:space-between;border-bottom:1px solid currentColor;font-size:12px;letter-spacing:.08em}nav{display:flex;gap:18px;flex-wrap:wrap}.eyebrow{text-transform:uppercase;letter-spacing:.12em;font-size:12px;font-weight:600}h1,h2{font-family:var(--font-heading);font-weight:500;line-height:1.02}h1{font-size:clamp(52px,7vw,104px);letter-spacing:-.045em;max-width:10ch;margin:28px 0}h2{font-size:30px;margin:0 0 20px}figure{margin:0;min-width:0}figcaption{font-size:13px;margin-top:16px;border-top:1px solid;padding-top:12px}.chart{overflow:auto}.chart svg{display:block;max-width:100%;height:auto}table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums}td,th{text-align:left;padding:12px 0;border-bottom:1px solid #8B9994}details{margin:28px 0}summary{cursor:pointer;font-weight:600}footer{font-size:13px;border-top:1px solid;margin-top:40px}footer p{max-width:80ch}.measure{display:flex;gap:26px;align-items:baseline}.measure strong{font-size:80px;line-height:1;font-weight:500;letter-spacing:-.07em}.measure span{max-width:13ch;font-size:14px}.fact{border-top:1px solid;padding-top:18px;margin-top:32px}.fact b{font-variant-numeric:tabular-nums}.visual{margin-top:48px}.source{font-size:13px}.rule{height:8px;background:var(--ink);margin:16px 0}.section-number{font-size:13px;font-variant-numeric:tabular-nums}a:focus-visible,summary:focus-visible,.chart:focus-visible{outline:3px solid currentColor;outline-offset:5px}@media(max-width:650px){header{display:block}nav{margin-top:12px;gap:12px}header,main,footer{padding:22px 6vw}.chart svg{min-width:0}h1{font-size:62px}.measure strong{font-size:64px}}@media print{nav{display:none}header,main,footer{padding:18px}h1{font-size:64px}.chart{overflow:visible}.chart svg{min-width:0!important}details{break-inside:avoid}}`;
const css = {
  baseline: `body{background:#F6F7FA}main{background:white;margin-top:24px}h1{font-size:44px;max-width:none;letter-spacing:-.025em}.opening{text-align:center}.opening p{margin-inline:auto}.measure{justify-content:center;background:#EEE9FA;border-radius:14px;padding:24px}.measure strong{font-size:48px}.visual{padding:24px;border:1px solid #D4D9E0;border-radius:14px}header{border:0}.fact{border:0}`,
  atlas: `.opening{display:grid;grid-template-columns:1.1fr 1fr;gap:6vw;align-items:end}.lead{font-size:21px}.margin-note{border-left:1px solid;padding-left:26px}.visual{display:grid;grid-template-columns:180px minmax(0,1fr);gap:32px;border-top:1px solid;padding-top:26px}.visual h2{font-size:26px}.measure strong{font-family:'Young Serif';font-size:98px}.leaf{display:inline-block;width:34px;height:48px;background:var(--ink);border-radius:100% 0;transform:rotate(24deg);margin-right:10px}@media(max-width:800px){.opening,.visual{grid-template-columns:1fr}.margin-note{border-left:0;border-top:1px solid;padding:25px 0 0}.visual{gap:16px}}`,
  signal: `header{font-weight:700;border-bottom:3px solid}h1{font-variation-settings:'wdth' 70,'wght' 900;font-size:clamp(90px,13vw,185px);text-transform:uppercase;line-height:.84;letter-spacing:-.055em;max-width:8ch}.opening{display:grid;grid-template-columns:1.3fr .7fr;gap:4vw;align-items:center}.lead{font-size:20px}.margin-note{border-top:8px solid;padding-top:28px}.measure strong{font-family:Archivo;font-weight:900;font-size:112px}.visual{border-top:8px solid;padding-top:24px}.visual>div:first-child{display:flex;justify-content:space-between;align-items:baseline}h2{font-weight:800;font-size:38px}.chart{max-width:950px}footer{border-top:3px solid}@media(max-width:800px){.opening{grid-template-columns:1fr}h1{font-size:115px;max-width:8ch}.margin-note{border-top:2px solid}.visual>div:first-child{display:block}}`,
  ledger: `header{font-family:'Office Code Pro',monospace}.opening{display:grid;grid-template-columns:.75fr 1.25fr;gap:5vw}.title-block{border-right:1px solid;padding-right:36px}h1{font-size:58px;font-weight:700;max-width:9ch}.eyebrow,.section-number,.measure strong{font-family:'Office Code Pro',monospace}.measure strong{font-size:92px}.margin-note{display:grid;grid-template-columns:1fr;align-content:center}.visual{display:grid;grid-template-columns:220px minmax(0,1fr);gap:36px;border-top:3px solid;padding-top:26px}h2{font-size:24px;font-weight:700}.fact{font-size:15px}.source{font-family:'Office Code Pro';font-size:11px}@media(max-width:800px){.opening,.visual{grid-template-columns:1fr}.title-block{border:0;padding:0}h1{font-size:65px;max-width:11ch}.visual{gap:16px}}`,
};
for (const v of variants) {
  const system = tokens({ fonts: { body: v.font, heading: v.heading }, brand: { seed: v.accent } });
  await writeFile(path.join(out, `${v.id}-tokens.css`), system.css);
  const config = {
    type: "line",
    title: "Shade Coverage, 2020–2025",
    description: finding,
    source: notes,
    data,
    width: 780,
    height: 280,
    font: v.font,
    colors: [v.accent],
    background: v.paper,
    xLabel: "Year",
    yLabel: "Shade Coverage",
    unit: "%",
    ...(v.id === "baseline"
      ? {}
      : {
          annotations: [
            { x: "2023", text: "2023: 29%", position: "below" },
            { x: "2025", text: "2025: 42%" },
          ],
          referenceLines: [{ y: 40, label: "Illustrative target: 40%" }],
        }),
  };
  const n = normalize(config);
  const { svg } = await vegaSVG(specification(n));
  const mobileConfig = {
    ...config,
    width: 320,
    height: 250,
    ...(v.id === "baseline" ? {} : { annotations: [{ x: "2025", text: "2025: 42%" }] }),
  };
  const { svg: mobileSvg } = await vegaSVG(specification(normalize(mobileConfig)));
  const canopy = `<svg viewBox="0 0 300 180" role="img" aria-label="42 of 100 units filled: 42 percent shade coverage; each unit represents one percentage point"><title>42% Shade Coverage</title>${Array.from({ length: 100 }, (_, i) => `<rect x="${(i % 20) * 15}" y="${Math.floor(i / 20) * 33}" width="11" height="27" rx="5" fill="${i < 42 ? v.ink : "none"}" stroke="${v.ink}" stroke-width="1"/>`).join("")}</svg>`;
  await writeFile(path.join(out, `${v.id}-chart.json`), JSON.stringify(config, null, 2) + "\n");
  const links = variants
    .map(
      (x) => `<a href="${x.id}.html" ${x.id === v.id ? 'aria-current="page"' : ""}>${x.name}</a>`,
    )
    .join("");
  const table = `<details><summary>Inspect the Six Source Values</summary><table><caption>Shade Coverage · Synthetic Example</caption><thead><tr><th scope="col">Year</th><th scope="col">Coverage</th></tr></thead><tbody>${data.map((r) => `<tr><th scope="row">${r.x}</th><td>${r.y}%</td></tr>`).join("")}</tbody></table></details>`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — ${v.name}</title><link rel="stylesheet" href="../templates/fonts/fonts.css"><link rel="stylesheet" href="${v.id}-tokens.css"><style>:root{--ink:${v.ink};--paper:${v.paper}}${common}${css[v.id]}</style></head><body><header><span>COMMON GROUND / STUDY 006</span><nav aria-label="Art Directions">${links}</nav></header><main><section class="opening"><div class="title-block"><p class="eyebrow">Urban Canopy / 2020–2025</p><h1>${title}</h1><p class="lead">${intro}</p></div><div class="margin-note">${v.id === "signal" ? `<div class="canopy">${canopy}<p class="source">42 filled units / 42% coverage</p></div>` : ""}<p class="eyebrow">The Change in Coverage</p><div class="measure">${v.id === "atlas" ? '<span class="leaf" aria-hidden="true"></span>' : ""}<strong>+24</strong><span>percentage points<br>over six years</span></div><p class="fact">${finding}</p></div></section><section class="visual"><div><p class="section-number">01 / THE EVIDENCE</p><h2>A Growing Canopy</h2></div><figure><div class="chart" tabindex="0" role="region" aria-label="Shade coverage chart"><div class="desktop-chart">${svg}</div><div class="mobile-chart">${mobileSvg}</div></div><figcaption>18% in 2020 → 42% in 2025. The vertical scale starts at zero.</figcaption>${table}</figure></section><p class="source">${notes}</p></main><footer><p>Same core copy and six values, four visual directions. These are study directions, not a universal Dazzler style or a superiority benchmark.</p><p>Original Dazzler specimen. Local fonts retain their licenses in the <a href="../templates/fonts/work-sans/OFL.txt">font license</a>. Chart rendered by the bundled Vega adapter.</p></footer></body></html>`;
  let finalHTML = html;
  if (v.id === "ledger") {
    const note = html
      .match(/<div class="margin-note">[\s\S]*?<\/div><\/section>/)[0]
      .replace(/<\/section>$/, "");
    finalHTML = html
      .replace(note, "")
      .replace('<section class="visual">', '<div class="dossier-body"><section class="visual">')
      .replace("</figure></section>", "</figure></section>" + note + "</div>");
    finalHTML = finalHTML.replace(
      "</style>",
      ".opening{display:block}.title-block{border:0;padding:0}h1{max-width:none;font-size:64px;margin:20px 0}.lead{max-width:70ch}.dossier-body{display:grid;grid-template-columns:minmax(0,2fr) minmax(260px,1fr);gap:40px;margin-top:40px;border-top:3px solid;padding-top:24px}.visual{display:block;border:0;margin:0;padding:0}.margin-note{border-left:1px solid;padding-left:30px;align-content:start}.measure{display:block}.measure span{display:block;max-width:none}.fact{margin-top:20px}@media(max-width:850px){.dossier-body{display:block}.margin-note{border:0;border-top:1px solid;margin-top:28px;padding:24px 0 0}h1{font-size:52px}}</style>",
    );
  }
  await writeFile(path.join(out, `${v.id}.html`), finalHTML);
}
await writeFile(
  path.join(out, "index.html"),
  '<!doctype html><html lang="en"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=atlas.html"><title>Dazzler Art Directions</title><a href="atlas.html">View the Art-Direction Study</a></html>',
);
await writeFile(
  path.join(out, "data.csv"),
  "Year,Coverage Percent\n" + data.map((r) => `${r.x},${r.y}`).join("\n") + "\n",
);
console.log(out);
