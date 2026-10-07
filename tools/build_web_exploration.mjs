// Original synthetic studies of authored composition export. Apache-2.0.
// These are implementation evidence, not templates or a prompt-to-site engine.
import { mkdir, writeFile, cp } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tokens } from "../skills/dazzler-frontend/scripts/studio.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.resolve(process.argv[2]);
await mkdir(out, { recursive: true });
await cp(
  path.join(root, "skills/dazzler-frontend/assets/templates/fonts"),
  path.join(out, "fonts"),
  { recursive: true },
);
const reg = (id, start, span, extra = {}) => ({
  id,
  desktop: { start, span },
  mobile: { start: 1, span: 1 },
  ...extra,
});
const section = (id, columns, surface, ink, regions) => ({
  id,
  columns,
  mobileColumns: [1],
  surface,
  ink,
  gapRem: 2,
  paddingRem: 3,
  regions,
});
const common = `*{box-sizing:border-box}body{margin:0;font:17px/1.55 'Work Sans',Arial,sans-serif}h1,h2,p,figure{margin:0}h1,h2{line-height:1.05}p{max-width:58ch}button,input,select{font:inherit}button,select{min-height:44px;cursor:pointer}button{border:1px solid currentColor;padding:.65rem 1rem;background:transparent;color:inherit}button:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid currentColor;outline-offset:5px}header,footer{padding:1rem 3rem;display:flex;gap:1rem;justify-content:space-between;flex-wrap:wrap}header{border-bottom:1px solid}footer{border-top:1px solid;font-size:13px}a{color:inherit}.tag{font-size:12px;letter-spacing:.12em;text-transform:uppercase}.stack>*+*{margin-top:1.5rem}svg{display:block;width:100%;height:auto}table{border-collapse:collapse;width:100%}th,td{text-align:left;border-bottom:1px solid;padding:.6rem}summary{cursor:pointer;min-height:44px;padding:.5rem 0}@media(max-width:48rem){header,footer{padding:1rem 1.25rem}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation:none!important}}`;
const faces = "";
const studies = [
  {
    id: "pulse",
    title: "Find Your Rhythm",
    prompt: "Make an interactive page that teaches beginners to recognize a four-beat rhythm.",
    idea: "The playable beat grid occupies the main stage; tempo is a large editable number.",
    font: "Archivo",
    surface: "#1732AB",
    ink: "#FFFFFF",
    sections: [
      section("lesson", [2, 3], "#1732AB", "#FFFFFF", [
        reg("title", 1, 1),
        reg("instrument", 2, 1),
      ]),
      section("explain", [1, 1, 1], "#DFFF70", "#152337", [
        reg("step-one", 1, 1),
        reg("step-two", 2, 1),
        reg("step-three", 3, 1),
      ]),
    ],
    css: `body{background:#1732AB;color:white}h1{font:800 clamp(3rem,7vw,7rem)/.95 Archivo,sans-serif;letter-spacing:-.045em}.instrument{border:1px solid #FFFFFF;padding:2rem}.beats{display:grid;grid-template-columns:repeat(4,1fr);gap:.6rem;margin:2rem 0}.beat{aspect-ratio:1;min-width:0;padding:0;font-size:clamp(1rem,3vw,3rem)}.beat[aria-pressed=true]{background:#DFFF70;color:#152337}.tempo{font:700 4rem/1 Archivo;display:block;margin:1rem 0}input{width:100%}.step{font:700 3rem Archivo}h2{font-size:1.4rem;margin:.5rem 0}.instrument p{font-size:14px}@media(max-width:48rem){.instrument{padding:1rem}}`,
    html: `<section data-dazzler-section="lesson"><div data-dazzler-region="title" class="stack"><p class="tag">An Experiment in Timing / 01</p><h1>Find Your<br>Rhythm</h1><p>Four beats. One repeating idea. Build a pattern and count it out loud.</p><p>This is a silent visual lesson. No sound or recording is used.</p></div><div data-dazzler-region="instrument" class="instrument"><label for="tempo">Tempo · beats per minute</label><output class="tempo" id="bpm" for="tempo">96</output><input id="tempo" type="range" min="40" max="180" value="96"><div class="beats">${[1, 2, 3, 4].map((n) => `<button class="beat" aria-label="Accent beat ${n}" aria-pressed="${n === 1}">${n}</button>`).join("")}</div><p id="pattern" role="status">Accented beats: 1</p><p>Tap a beat to accent it. Use Tab and Space on a keyboard.</p></div></section><section data-dazzler-section="explain">${[
      ["one", "Listen With Your Eyes", "The bright squares mark your accents."],
      ["two", "Count the Space", "A quiet beat still belongs to the pattern."],
      ["three", "Try Another Pattern", "Accent 2 and 4. Count the difference."],
    ]
      .map(
        ([id, t, d], i) =>
          `<div data-dazzler-region="step-${id}"><span class="step">0${i + 1}</span><h2>${t}</h2><p>${d}</p></div>`,
      )
      .join("")}</section>`,
    js: `document.querySelector('#tempo').addEventListener('input',e=>document.querySelector('#bpm').value=e.target.value);document.querySelectorAll('.beat').forEach(b=>b.addEventListener('click',()=>{b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true');const chosen=[...document.querySelectorAll('.beat[aria-pressed=true]')].map(x=>x.textContent);document.querySelector('#pattern').textContent='Accented beats: '+(chosen.join(', ')||'none')}));`,
  },
  {
    id: "water",
    title: "Read the River",
    prompt:
      "Explain monthly water measurements for a fictional river and let readers compare two monitoring stations.",
    idea: "An editorial margin frames the chart as the dominant evidence; the station control changes both plot and table.",
    font: "Young Serif",
    surface: "#EFEDE3",
    ink: "#153F3B",
    sections: [
      section("report", [1, 3], "#EFEDE3", "#153F3B", [reg("margin", 1, 1), reg("evidence", 2, 1)]),
    ],
    css: `body{background:#EFEDE3;color:#153F3B}h1{font:400 clamp(3rem,5vw,5.5rem)/1.04 'Young Serif',serif;letter-spacing:-.04em}.margin{border-right:1px solid;padding-right:2rem}.margin p{margin-top:1.5rem}.plot{background:#153F3B;color:#EFEDE3;padding:1.5rem;margin-top:2rem}select{padding:.6rem;background:transparent;color:inherit;border:1px solid;max-width:100%}figcaption{font-size:14px;margin-top:1rem}.row{display:flex;justify-content:space-between;gap:1rem;align-items:center;flex-wrap:wrap}h2{font:400 1.6rem 'Young Serif'}details{margin-top:1.5rem}@media(max-width:48rem){.margin{border-right:0;border-bottom:1px solid;padding:0 0 2rem}.plot{padding:.75rem}.plot svg text{font-size:38px}}`,
    html: `<section data-dazzler-section="report"><aside data-dazzler-region="margin" class="margin"><p class="tag">Field Notes / No. 04</p><h1>Read the River</h1><p>Water changes. A single measurement cannot tell the whole story.</p><p>Compare six months at two fictional stations. Values are illustrative dissolved oxygen measurements, not safety advice.</p></aside><div data-dazzler-region="evidence"><div class="row"><h2>One River, Two Stations</h2><label>Station <select id="station"><option value="upper">Upper reach</option><option value="lower">Lower reach</option></select></label></div><figure class="plot"><svg viewBox="0 0 700 360" role="img" aria-labelledby="chart-title chart-desc"><title id="chart-title">Dissolved Oxygen, January–June</title><desc id="chart-desc">Upper reach: 8, 9, 8, 7, 6, 7 milligrams per liter.</desc><g stroke="#839B8E" stroke-width="1">${[70, 130, 190, 250, 310].map((y) => `<path d="M55 ${y}H670"/>`).join("")}</g><g fill="currentColor" font-size="17">${[10, 8, 6, 4, 2].map((v, i) => `<text x="15" y="${76 + i * 60}">${v}</text>`).join("")}${["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => `<text x="${55 + i * 118}" y="345" text-anchor="middle">${m}</text>`).join("")}</g><polyline id="series" fill="none" stroke="#DFFF70" stroke-width="5" points="55,130 173,100 291,130 409,160 527,190 645,160"/></svg><figcaption>Monthly dissolved oxygen · mg/L. Axis begins at 2. Synthetic data.</figcaption></figure><details open><summary>Read the Exact Measurements</summary><table><caption id="table-caption">Upper reach · mg/L</caption><thead><tr><th scope="col">Month</th><th scope="col">Dissolved oxygen</th></tr></thead><tbody>${["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => `<tr><th scope="row">${m}</th><td>${[8, 9, 8, 7, 6, 7][i]}</td></tr>`).join("")}</tbody></table></details></div></section>`,
    js: `document.querySelector('#station').addEventListener('change',e=>{const values=e.target.value==='upper'?[8,9,8,7,6,7]:[7,7,6,5,4,5];const name=e.target.selectedOptions[0].textContent;document.querySelector('#series').setAttribute('points',values.map((v,i)=>(55+i*118)+','+(370-v*30)).join(' '));document.querySelectorAll('tbody td').forEach((c,i)=>c.textContent=values[i]);document.querySelector('#table-caption').textContent=name+' · mg/L';document.querySelector('#chart-desc').textContent=name+': '+values.join(', ')+' milligrams per liter.'});`,
  },
  {
    id: "print",
    title: "Make an Impression",
    prompt:
      "Create a program page for a fictional community print festival, with a filterable schedule.",
    idea: "A typographic festival poster opens into a compact chronological program; medium filters help visitors plan.",
    font: "Archivo",
    surface: "#F25C38",
    ink: "#251B2C",
    sections: [
      section("poster", [3, 1], "#F25C38", "#251B2C", [
        reg("headline", 1, 1),
        reg("edition", 2, 1),
      ]),
      section("program", [1, 3], "#F8DCE7", "#251B2C", [
        reg("filters", 1, 1),
        reg("schedule", 2, 1),
      ]),
    ],
    css: `body{background:#F25C38;color:#251B2C}h1{font:900 clamp(3.2rem,10vw,10rem)/.9 Archivo,sans-serif;letter-spacing:-.055em}.edition{display:flex;flex-direction:column;justify-content:space-between;gap:2rem}.seal{border:3px solid;border-radius:50%;aspect-ratio:1;display:grid;place-items:center;font:800 4rem Archivo;max-width:190px}.filters{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.5rem}.filters button[aria-pressed=true]{background:#251B2C;color:#F8DCE7}.event{display:grid;grid-template-columns:6rem 1fr;gap:1rem;padding:1.5rem 0;border-top:2px solid}.event[hidden]{display:none}.event h3{font:700 1.6rem Archivo;margin:0 0 .5rem}.event time{font-size:1.4rem}h2{font:700 2rem Archivo}@media(max-width:48rem){.edition{flex-direction:row;align-items:center}.seal{min-width:100px;font-size:2rem}.event{grid-template-columns:1fr;gap:.3rem}}`,
    html: `<section data-dazzler-section="poster"><div data-dazzler-region="headline" class="stack"><p class="tag">Ink Commons / A Fictional Festival</p><h1>Make an<br>Impression</h1></div><div data-dazzler-region="edition" class="edition"><div class="seal" aria-label="Edition 3">03</div><p>One day.<br>Many ways to leave a mark.<br>Illustrative program.</p></div></section><section data-dazzler-section="program"><div data-dazzler-region="filters"><h2>Your Day in Ink</h2><div class="filters" role="group" aria-label="Filter schedule">${["All", "Relief", "Screen"].map((x, i) => `<button aria-pressed="${i === 0}" data-filter="${x}">${x}</button>`).join("")}</div><p id="count" role="status">3 sessions</p></div><div data-dazzler-region="schedule">${[
      [
        "10:00",
        "Relief",
        "Carve Your First Block",
        "A hands-on introduction to marks, pressure and negative space.",
      ],
      ["12:30", "Screen", "Color Through a Screen", "Layer two inks and discover a third color."],
      [
        "15:00",
        "Relief",
        "The Collective Print",
        "Bring individual marks together in one shared impression.",
      ],
    ]
      .map(
        ([t, m, h, p]) =>
          `<article class="event" data-medium="${m}"><time>${t}</time><div><p class="tag">${m}</p><h3>${h}</h3><p>${p}</p></div></article>`,
      )
      .join("")}</div></section>`,
    js: `document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',x===b));document.querySelectorAll('.event').forEach(x=>x.hidden=b.dataset.filter!=='All'&&x.dataset.medium!==b.dataset.filter);const n=document.querySelectorAll('.event:not([hidden])').length;document.querySelector('#count').textContent=n+' session'+(n===1?'':'s')}));`,
  },
];
for (const s of studies) {
  const config = {
    context: s.prompt,
    fonts: { body: "Work Sans", heading: s.font },
    brand: { seed: s.surface },
    pageComposition: { idea: s.idea, sections: s.sections },
  };
  const built = tokens(config);
  await writeFile(
    path.join(out, s.id + ".design-system.json"),
    JSON.stringify(built.system, null, 2),
  );
  await writeFile(
    path.join(out, s.id + ".html"),
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${s.title}</title><link rel="stylesheet" href="fonts/fonts.css"><style>${built.css}\n${faces}\n${common}\n${s.css}</style><body><header><span>Dazzler / Original Study</span><a href="index.html">All Studies</a></header><main>${s.html}</main><footer><span>Fictional demonstration · No external services</span><span>Original composition, shipped open fonts</span></footer><script>${s.js}</script></body></html>`,
  );
}
await writeFile(
  path.join(out, "index.html"),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Open Composition Studies</title><style>body{font:18px/1.6 Arial;background:#171725;color:#faf4e5;max-width:850px;margin:3rem auto;padding:1.5rem}a{color:#dfff70}li{margin:2rem 0}p{max-width:60ch}</style><h1>Three Prompts. Three Structures.</h1><p>Original, agent-authored studies using the current composition exporter. These are implementation proofs, not a template menu or a claim of automatic aesthetic superiority.</p><ul>${studies.map((s) => `<li><a href="${s.id}.html">${s.title}</a><p>Prompt: ${s.prompt}</p><p>Design decision: ${s.idea}</p></li>`).join("")}</ul></html>`,
);
await writeFile(
  path.join(out, "prompts.json"),
  JSON.stringify(
    studies.map(({ id, prompt, idea }) => ({
      id,
      prompt,
      idea,
      method:
        "Agent-authored semantic HTML and interactions using studio pageComposition CSS; not a prompt parser.",
    })),
    null,
    2,
  ),
);
console.log(out);
