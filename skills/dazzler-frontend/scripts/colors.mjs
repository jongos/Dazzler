#!/usr/bin/env node
// Original adapter: Apache-2.0. Bundled upstream engine and palette data: MIT.
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { readJSON, createOutput } from "./runtime.mjs";
import {
  generateHarmonyRoleColors,
  generateColorSwatch,
  selectColorSwatchStep,
  selectReadableForeground,
  getContrastRatio,
  createDefaultSemanticStatusSwatches,
  converter,
  toGamut,
  formatHex,
  filterDeficiencyProt,
  filterDeficiencyDeuter,
  filterDeficiencyTrit,
} from "./vendor/color-engine.mjs";

const skill = fileURLToPath(new URL("../", import.meta.url));
const catalog = JSON.parse(
  await readFile(new URL("../references/color-palettes.json", import.meta.url), "utf8"),
);
const toOklch = converter("oklch");
const gamut = toGamut("rgb", "oklch");
const roles = [
  "brand",
  "secondary",
  "accent",
  "background",
  "surface",
  "text",
  "muted",
  "border",
  "action",
  "onAction",
  "actionHover",
  "onActionHover",
  "focus",
  "danger",
  "onDanger",
  "success",
  "warning",
  "info",
];
const harmonies = [
  "monochromatic",
  "analogous",
  "complementary",
  "splitComplementary",
  "triadic",
  "tetradic",
  "square",
];
const aliases = {
  calm: "serene meditation peaceful spa",
  bold: "energetic sports confident",
  romantic: "soft wedding pastel",
  luxurious: "luxury premium elegant",
  earthy: "natural organic botanical",
  playful: "fun vibrant creative",
  professional: "corporate business reliable",
  dramatic: "dark cinematic gaming",
  cozy: "warm cafe autumn home",
  minimal: "clean simple restrained",
  japanese: "wabi-sabi sakura matcha ukiyo-e",
};

export function hex(value) {
  if (typeof value !== "string" || !/^#[\da-f]{6}$/i.test(value))
    throw new Error("Colors must be opaque #RRGGBB values.");
  return value.toUpperCase();
}

export function recommend(mood, limit = 3) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 88)
    throw new Error("Limit must be an integer from 1 to 88.");
  const words =
    String(mood ?? "")
      .toLowerCase()
      .match(/[a-z]+(?:-[a-z]+)*/g) ?? [];
  if (!words.length) throw new Error("Provide mood words from the brief, or list the catalog.");
  return catalog.palettes
    .map((p) => {
      const tags = `${p.mood} ${aliases[p.mood]}`.split(" ");
      const matches = words.filter((w) => tags.includes(w));
      return { ...p, score: matches.length, matched: matches };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
}

function validateConfig(input) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Configuration must be an object.");
  for (const key of Object.keys(input)) {
    if (!["base", "palette", "mood", "harmony", "locked", "target"].includes(key))
      throw new Error(`Unknown configuration field: ${key}`);
  }
  if (
    input.locked !== undefined &&
    (!input.locked || typeof input.locked !== "object" || Array.isArray(input.locked))
  ) {
    throw new Error("locked must contain light/dark token objects.");
  }
  for (const [mode, tokens] of Object.entries(input.locked ?? {})) {
    if (
      !["light", "dark"].includes(mode) ||
      !tokens ||
      typeof tokens !== "object" ||
      Array.isArray(tokens)
    ) {
      throw new Error("locked must contain light/dark token objects.");
    }
    for (const [role, color] of Object.entries(tokens)) {
      if (!roles.includes(role)) throw new Error(`Unknown locked role: ${role}`);
      hex(color);
    }
  }
}

export function generate(input, { legacy = false } = {}) {
  validateConfig(input);
  if (input.target !== undefined && !["AA", "AAA"].includes(input.target))
    throw Error("Target must be AA or AAA");
  const textMinimum = input.target === "AAA" ? 7 : 4.5;
  let palette;
  if (input.palette) {
    palette = catalog.palettes.find((p) => p.id === input.palette);
    if (!palette) throw new Error(`Unknown palette: ${input.palette}`);
  } else if (input.mood) {
    palette = recommend(input.mood, 1)[0];
    if (!palette && !input.base)
      throw new Error("No mood match. Inspect the catalog or supply a brand base color.");
  }
  if (!palette && !input.base) throw new Error("Supply base, palette, or a recognized mood.");
  const base = hex(input.base ?? palette.colors.primary);
  const harmony = input.harmony ?? "analogous";
  if (!harmonies.includes(harmony)) throw new Error(`Unknown harmony: ${harmony}`);
  const generated = generateHarmonyRoleColors(base, harmony);
  // Explicit brand/harmony input takes precedence over the inspiration palette.
  const useCurated = palette && !input.base && !input.harmony;
  const secondary = hex(useCurated ? palette.colors.secondary : (generated.secondary?.hex ?? base));
  const accent = hex(useCurated ? palette.colors.accent : (generated.tertiary?.hex ?? secondary));
  const hue = toOklch(base).h ?? 0;
  const primaryRamp = generateColorSwatch(accent);
  const neutralRamp = generateColorSwatch(
    formatHex(gamut({ mode: "oklch", l: 0.55, c: 0.008, h: hue })),
  );
  const statuses = createDefaultSemanticStatusSwatches();
  const result = {
    schemaVersion: 1,
    status: "pass",
    input,
    provenance: {
      palette: palette
        ? { id: palette.id, name: palette.name, mood: palette.mood, source: palette.source }
        : null,
      paletteUse: useCurated
        ? "curated hues; role colors derived and validated"
        : "brand/harmony overrides palette hues",
      base,
      harmony: useCurated ? "curated" : harmony,
      engine: "@ankhorage/color-theory 0.3.1 + culori 4.0.2",
      selection:
        "Mood shortlist is heuristic; contrast checks are numerical, not aesthetic certification.",
    },
    diagnostics: {
      harmony: generated.diagnostics,
      accentRamp: primaryRamp.diagnostics,
      neutralRamp: neutralRamp.diagnostics,
      statusRamps: statuses.diagnostics,
    },
    modes: {},
    limitations: [
      "Opaque sRGB hex only; composite alpha and measure image/gradient backgrounds separately.",
      "Checks cover listed role pairs only, not WCAG conformance of a complete interface.",
      "Color-vision simulations are approximate review aids, not pass/fail certification.",
      "Brand/secondary/accent are decorative seeds; use validated text/action tokens for functional content.",
      "Locked colors are preserved; unresolved constraints require a design decision.",
    ],
  };
  for (const mode of ["light", "dark"]) {
    const light = mode === "light";
    const locks = Object.fromEntries(
      Object.entries(input.locked?.[mode] ?? {}).map(([k, v]) => [k, hex(v)]),
    );
    const neutral = (l) => hex(formatHex(gamut({ mode: "oklch", l, c: 0.008, h: hue })));
    const tokens = {
      brand: base,
      secondary,
      accent,
      background: neutral(light ? 0.985 : 0.12),
      surface: neutral(light ? 0.95 : 0.19),
      ...locks,
    };
    const selections = {};
    const contexts = (minimumContrast) =>
      ["background", "surface"].map((id) => ({ id, against: tokens[id], minimumContrast }));
    const choose = (role, ramp, l, c, minimum, h = hue) => {
      if (locks[role]) return;
      const selection = selectColorSwatchStep(
        ramp,
        { lightness: l, chroma: c, hueDegrees: h },
        contexts(minimum),
        "lower-step",
      );
      selections[role] = selection;
      tokens[role] = selection.selected?.hex ? hex(selection.selected.hex) : null;
    };
    choose("text", neutralRamp.swatch, light ? 0.18 : 0.95, 0.008, textMinimum);
    choose("muted", neutralRamp.swatch, light ? 0.45 : 0.72, 0.008, textMinimum);
    choose("border", neutralRamp.swatch, light ? 0.6 : 0.55, 0.008, 3);
    const accentInfo = toOklch(accent);
    choose("action", primaryRamp.swatch, light ? 0.43 : 0.72, accentInfo.c, 3, accentInfo.h ?? hue);
    choose(
      "actionHover",
      primaryRamp.swatch,
      light ? 0.33 : 0.82,
      accentInfo.c,
      3,
      accentInfo.h ?? hue,
    );
    choose("focus", primaryRamp.swatch, light ? 0.43 : 0.72, accentInfo.c, 3, accentInfo.h ?? hue);
    for (const [role, swatch] of Object.entries(statuses.swatches)) {
      const seed = toOklch(statuses.seeds[role]);
      choose(role, swatch, light ? 0.43 : 0.75, seed.c, textMinimum, seed.h);
    }
    for (const [role, background] of [
      ["onAction", "action"],
      ["onActionHover", "actionHover"],
      ...(!legacy ? [["onDanger", "danger"]] : []),
    ]) {
      if (locks[role]) continue;
      if (!tokens[background]) {
        tokens[role] = null;
        continue;
      }
      const selection = selectReadableForeground(
        tokens[background],
        ["#000000", "#FFFFFF"],
        textMinimum,
        "first",
      );
      selections[role] = selection;
      tokens[role] = selection.selected?.foreground ? hex(selection.selected.foreground) : null;
    }
    const checks = [];
    const check = (foreground, background, minimum) => {
      const ratio =
        tokens[foreground] && tokens[background]
          ? getContrastRatio(tokens[foreground], tokens[background])
          : null;
      checks.push({
        foreground,
        background,
        minimum,
        ratio,
        passes: ratio !== null && ratio >= minimum,
      });
    };
    for (const bg of ["background", "surface"]) {
      for (const fg of ["text", "muted", "danger", "success", "warning", "info"])
        check(fg, bg, textMinimum);
      for (const fg of ["border", "action", "actionHover", "focus"]) check(fg, bg, 3);
    }
    check("onAction", "action", textMinimum);
    check("onActionHover", "actionHover", textMinimum);
    if (!legacy) check("onDanger", "danger", textMinimum);
    const failures = checks.filter((c) => !c.passes);
    result.modes[mode] = {
      tokens,
      locked: Object.keys(locks),
      selections,
      checks,
      failures,
      notes:
        tokens.action === tokens.actionHover
          ? ["Hover color did not change; add an underline or another non-color affordance."]
          : [],
    };
    if (!legacy) {
      const brandHue = toOklch(tokens.brand).h ?? 0;
      result.modes[mode].notes.push(
        "Danger needs a text label and confirmation or undo; color alone is insufficient.",
      );
      if (toOklch(tokens.brand).c > 0.04 && (brandHue < 45 || brandHue > 350))
        result.modes[mode].notes.push(
          "Review red brand/danger distinction with labels, icons and placement; brand locks remain unchanged.",
        );
    }
    if (failures.length) result.status = "unresolved";
  }
  return result;
}

const cssName = (name) => name.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
export function css(result) {
  if (result.status !== "pass")
    throw new Error("Cannot export CSS with unresolved role constraints.");
  return (
    Object.entries(result.modes)
      .map(([mode, data]) => {
        const selector = mode === "light" ? ':root, [data-theme="light"]' : '[data-theme="dark"]';
        return (
          `${selector} {\n  color-scheme: ${mode};\n` +
          Object.entries(data.tokens)
            .map(([k, v]) => `  --color-${cssName(k)}: ${v};`)
            .join("\n") +
          "\n}"
        );
      })
      .join("\n\n") + "\n"
  );
}

const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
export function preview(result) {
  const styles = css(result);
  const simulations = {};
  for (const [mode, data] of Object.entries(result.modes)) {
    simulations[mode] = { normal: data.tokens };
    for (const [name, filter] of [
      ["protanopia", filterDeficiencyProt],
      ["deuteranopia", filterDeficiencyDeuter],
      ["tritanopia", filterDeficiencyTrit],
    ]) {
      simulations[mode][name] = Object.fromEntries(
        Object.entries(data.tokens).map(([key, value]) => [key, formatHex(filter()(value))]),
      );
    }
  }
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Color and typography preview</title><style>${styles}
*{box-sizing:border-box}body{margin:0;background:var(--color-background);color:var(--color-text);font:16px/1.6 system-ui,sans-serif}
main{max-width:1100px;margin:auto;padding:32px;overflow-wrap:anywhere}h1{font-size:clamp(2rem,6vw,3.5rem);line-height:1.1;letter-spacing:-.035em}h2{line-height:1.2}
.controls,.swatches{display:flex;gap:16px;flex-wrap:wrap}.card{background:var(--color-surface);padding:24px;margin:24px 0;border:1px solid var(--color-border);border-radius:12px}
button,select,input{font:inherit;padding:10px 14px;border-radius:6px;border:1px solid var(--color-border);max-width:100%}input,select{background:var(--color-surface);color:var(--color-text)}
input::placeholder{color:var(--color-muted);opacity:1}button{cursor:pointer;background:var(--color-action);color:var(--color-on-action)}button:hover{background:var(--color-action-hover);color:var(--color-on-action-hover);text-decoration:underline}
:focus-visible{outline:3px solid var(--color-focus);outline-offset:4px}.muted{color:var(--color-muted)}.status{font-weight:650}.swatch{width:104px}.chip{height:60px;border-radius:6px}
table{border-collapse:collapse;width:100%;font-size:14px}td,th{text-align:left;border-bottom:1px solid var(--color-border);padding:8px}.scroll{overflow:auto}small{font-size:14px}
</style><main><p class="muted">LOCAL DESIGN REVIEW · ${escape(result.provenance.palette?.name ?? result.provenance.base)}</p>
<h1>A palette should serve the reading experience.</h1><p>Review hierarchy, readable copy, focus and meaning together. This specimen uses system fonts; replace them with the project's selected licensed fonts during implementation.</p>
<div class="controls"><label>Theme <select id="theme"><option>light</option><option>dark</option></select></label><label>Vision simulation <select id="vision"><option>normal</option><option>protanopia</option><option>deuteranopia</option><option>tritanopia</option></select></label></div>
<p class="muted" id="simulation-note">Contrast results describe the original tokens. Simulations are approximate visual aids.</p>
<section class="card"><h2>Plan something worth reading</h2><p>Body copy, $12,345.67, and supporting information should stay legible at ordinary sizes.</p><p class="muted">Secondary text retains normal-text contrast on both surfaces.</p><label>Email <input type="email" placeholder="you@example.com"></label> <button type="button" id="action">Preview action</button><p id="feedback" aria-live="polite"></p>
${["success", "warning", "danger", "info"].map((role) => `<p class="status" style="color:var(--color-${role})">${role === "danger" ? "Error" : role[0].toUpperCase() + role.slice(1)}: Meaning is also conveyed by this text label.</p>`).join("")}</section>
<h2>Tokens</h2><div class="swatches">${roles.map((role) => `<div class="swatch"><div class="chip" style="background:var(--color-${cssName(role)})"></div><small>${role}</small></div>`).join("")}</div>
<h2>Measured role pairs</h2><p>4.5:1 for normal text; 3:1 for the listed functional boundaries. A passing table does not certify the complete interface.</p><div class="scroll"><table><thead><tr><th>Mode</th><th>Foreground / background</th><th>Ratio</th><th>Minimum</th></tr></thead><tbody>${Object.entries(
    result.modes,
  )
    .flatMap(([mode, data]) =>
      data.checks.map(
        (c) =>
          `<tr><td>${mode}</td><td>${c.foreground} / ${c.background}</td><td>${c.ratio.toFixed(3)}</td><td>${c.minimum}</td></tr>`,
      ),
    )
    .join("")}</tbody></table></div>
<footer class="muted" aria-label="Notes and credits">All comparisons use unrounded ratios. Palette attribution: ${escape(result.provenance.palette?.source ?? "Custom brand seed")}. See accompanying JSON and licenses for provenance.</footer></main>
<script>const maps=${JSON.stringify(simulations)};const theme=document.getElementById('theme'),vision=document.getElementById('vision');function update(){document.documentElement.dataset.theme=theme.value;for(const [key,value]of Object.entries(maps[theme.value][vision.value]))document.documentElement.style.setProperty('--color-'+key.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()),value)}theme.addEventListener('change',update);vision.addEventListener('change',update);document.getElementById('action').addEventListener('click',()=>document.getElementById('feedback').textContent='Preview action completed.');update();</script></html>`;
}

export async function exportResult(result, destination) {
  const dest = await createOutput(destination);
  await writeFile(path.join(dest, "palette.json"), JSON.stringify(result, null, 2) + "\n");
  if (result.status !== "pass") return; // Evidence only; never ship unresolved CSS or HTML.
  await writeFile(path.join(dest, "colors.css"), css(result));
  await writeFile(path.join(dest, "preview.html"), preview(result));
  await mkdir(path.join(dest, "licenses"));
  for (const [source, name] of [
    ["references/hue3-LICENSE.txt", "hue3-LICENSE.txt"],
    ["scripts/vendor/ankhorage-color-theory-LICENSE.txt", "ankhorage-color-theory-LICENSE.txt"],
    ["scripts/vendor/culori-LICENSE.txt", "culori-LICENSE.txt"],
    ["LICENSE.txt", "Apache-2.0.txt"],
  ])
    await copyFile(path.join(skill, source), path.join(dest, "licenses", name));
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      mood: { type: "string" },
      limit: { type: "string" },
      palette: { type: "string" },
      base: { type: "string" },
      harmony: { type: "string" },
      config: { type: "string" },
      out: { type: "string" },
      help: { type: "boolean" },
    },
  });
  if (values.help) {
    console.log(
      'colors.mjs list | recommend --mood "cozy minimal" [--limit 3] | generate [--base #RRGGBB | --palette ID | --mood WORDS] [--harmony analogous] [--config input.json] [--out NEW_DIRECTORY]',
    );
    return;
  }
  if (positionals.length !== 1) throw new Error("Expected one command. Use --help.");
  let result;
  if (positionals[0] === "list") result = catalog;
  else if (positionals[0] === "recommend") {
    result = recommend(values.mood, Number(values.limit ?? 3));
    if (!result.length) process.exitCode = 2;
  } else if (positionals[0] === "generate") {
    const config = values.config ? await readJSON(values.config) : {};
    const input = {
      ...config,
      ...Object.fromEntries(
        ["mood", "palette", "base", "harmony"]
          .filter((k) => values[k] !== undefined)
          .map((k) => [k, values[k]]),
      ),
    };
    result = generate(input);
    if (values.out) await exportResult(result, values.out);
    if (result.status !== "pass") process.exitCode = 2;
  } else throw new Error("Unknown command. Use --help.");
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
