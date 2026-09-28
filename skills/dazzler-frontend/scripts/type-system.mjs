// Original bounded typography model. Apache-2.0.
import { readFileSync } from "node:fs";
const catalog = JSON.parse(
  readFileSync(new URL("../references/font-catalog.json", import.meta.url), "utf8"),
);
const round = (n) => +n.toFixed(6);
export function typography(input, fonts, scale) {
  const options = input.typography ?? {};
  const direction = options.direction ?? "editorial";
  if (options.mode !== undefined && !["fluid", "static"].includes(options.mode))
    throw Error("Unknown typography mode");
  const ratios = { restrained: 1.2, editorial: 1.333, expressive: 1.5 };
  if (!(direction in ratios)) throw Error("Unknown typography direction");
  const from = options.minViewport ?? 360,
    to = options.maxViewport ?? 1440;
  const ratio = options.maxRatio ?? ratios[direction];
  if (
    ![from, to, ratio].every(Number.isFinite) ||
    from < 320 ||
    to > 2560 ||
    to <= from ||
    ratio < 1.05 ||
    ratio > 1.5
  )
    throw Error("Invalid fluid endpoints");
  if (options.script !== undefined && !["latin", "mixed"].includes(options.script))
    throw Error("Use latin or mixed typography script");
  const legacy = input.schemaVersion === 1;
  const result = {};
  for (let step = -1; step <= 6; step++) {
    const key = `step${step}`,
      min = scale[key];
    const max =
      legacy || options.mode === "static" || step <= 0
        ? min
        : round(((input.baseSize ?? 16) / 16) * ratio ** step);
    const low = Math.min(min, max),
      high = Math.max(min, max);
    const slope = (((max - min) * 16) / (to - from)) * 100,
      intercept = min - (slope * from) / 1600;
    const role = step > 1 ? "heading" : "body";
    const requested = step > 1 ? 600 : 400;
    const family = catalog.fonts.find(
      (f) => f.name === fonts[role] || f.files?.some((face) => face.css_family === fonts[role]),
    );
    const normal = family?.files?.filter((f) => f.css_style === "normal" && f.path) ?? [];
    let face =
      normal.find(
        (f) => f.axes?.wght && requested >= f.axes.wght.min && requested <= f.axes.wght.max,
      ) ??
      normal.find((f) => f.weight === requested) ??
      normal[0];
    const weight = face?.axes?.wght
      ? Math.max(face.axes.wght.min, Math.min(face.axes.wght.max, requested))
      : (face?.weight ?? requested);
    result[key] = {
      role,
      minRem: min,
      maxRem: max,
      minViewport: from,
      maxViewport: to,
      printRem: min,
      css:
        low === high
          ? `${min}rem`
          : `clamp(${low}rem, calc(${round(intercept)}rem + ${round(slope)}vw), ${high}rem)`,
      lineHeight: step <= 1 ? 1.6 : options.script === "latin" ? 1.2 : 1.45,
      letterSpacing: options.script === "latin" && step > 2 ? -0.015 : 0,
      weight,
      opticalSizing: face?.axes?.opsz ? "auto" : "none",
      axes: face?.axes ?? {},
      face: face?.path ?? null,
    };
    const override = options.overrides?.[key];
    if (override)
      for (const [prop, range] of Object.entries({
        lineHeight: [1, 3],
        letterSpacing: [-0.05, 0.3],
        weight: [100, 900],
      })) {
        const v = override[prop];
        if (v !== undefined) {
          if (!Number.isFinite(v) || v < range[0] || v > range[1])
            throw Error("Invalid typography override");
          result[key][prop] = v;
        }
      }
    if (face && !face.axes?.wght) {
      face = normal.find((f) => f.weight === result[key].weight) ?? face;
      result[key].face = face.path;
      result[key].axes = face.axes ?? {};
      result[key].opticalSizing = face.axes?.opsz ? "auto" : "none";
    }
    if (
      face &&
      (face.axes?.wght
        ? result[key].weight < face.axes.wght.min || result[key].weight > face.axes.wght.max
        : !normal.some((f) => f.weight === result[key].weight))
    )
      throw Error("Requested weight is not supported by the selected family");
  }
  return { direction, script: options.script ?? "mixed", steps: result };
}

export function enhanceType(result, input) {
  if (input.schemaVersion === 1) return result;
  const model = typography(input, result.system.fonts, result.system.type);
  result.system.schemaVersion = 2;
  result.system.typography = model;
  let css = "\n:root {\n",
    print = "@media print { :root {\n",
    theme = "@theme inline {\n";
  result.dtcg.typography = {};
  result.tailwind.theme.extend.fontSize = {};
  for (const [key, t] of Object.entries(model.steps)) {
    css += `--type-${key}:${t.css};--leading-${key}:${t.lineHeight};--tracking-${key}:${t.letterSpacing}em;--weight-${key}:${t.weight};--optical-${key}:${t.opticalSizing};\n`;
    print += `--type-${key}:${t.printRem}rem;\n`;
    theme += `--text-${key}:var(--type-${key});--text-${key}--line-height:var(--leading-${key});--text-${key}--letter-spacing:var(--tracking-${key});--text-${key}--font-weight:var(--weight-${key});\n`;
    result.tailwind.theme.extend.fontSize[key] = [
      `var(--type-${key})`,
      {
        lineHeight: `var(--leading-${key})`,
        letterSpacing: `var(--tracking-${key})`,
        fontWeight: `var(--weight-${key})`,
      },
    ];
    result.dtcg.typography[key] = {
      $type: "typography",
      $value: {
        fontFamily: result.system.fonts[t.role],
        fontSize: { value: t.printRem, unit: "rem" },
        fontWeight: t.weight,
        lineHeight: t.lineHeight,
        letterSpacing: { value: round(t.letterSpacing * t.printRem), unit: "rem" },
      },
      $extensions: { "com.dazzler.fluid": t },
    };
  }
  result.css += css + "}\n" + print + "}}\n";
  result.theme += theme + "}\n";
  result.system.notes.push(
    "DTCG typography and DESIGN.md use static print sizes; full fluid endpoints remain in the canonical typography model and com.dazzler.fluid extension. Optical sizing is emitted only for a selected catalog face with opsz. Coverage and actual exported font loading still require inspection.",
  );
  return result;
}

export function specimen(system) {
  const escape = (v) =>
    String(v).replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  const steps =
    system.typography?.steps ??
    Object.fromEntries(Object.entries(system.type).map(([k]) => [k, { role: "body" }]));
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Typography specimen</title><link rel="stylesheet" href="tokens.css"><style>body{overflow-wrap:anywhere;margin:0;padding:clamp(16px,4vw,64px);font-family:var(--font-body);color:var(--color-text);background:var(--color-background)}article{max-width:70rem;margin:0 auto 2rem;overflow-wrap:anywhere}p{max-width:65ch}small{font:14px system-ui} @page{margin:16mm}@media print{body{padding:0;background:white}article{break-inside:avoid}}</style><h1>Typography specimen</h1><p>Inspect the project fonts, actual text and fallback shaping. Family names alone do not load font files.</p>${Object.entries(
    steps,
  )
    .map(
      ([key, t]) =>
        `<article><small>${key} / ${escape(system.fonts[t.role])}</small><p data-step="${key}" style="font-family:var(--font-${t.role});font-size:var(--type-${key});line-height:var(--leading-${key},1.5);letter-spacing:var(--tracking-${key},0);font-weight:var(--weight-${key},400);font-optical-sizing:var(--optical-${key},none)">Clear ideas deserve room to breathe — even when a heading becomes unexpectedly long.</p></article>`,
    )
    .join(
      "",
    )}<article lang="ar" dir="rtl"><p>تصميم واضح وأفكار مترابطة</p></article><article lang="ja"><p>読みやすい文字と明確な情報の階層。</p></article><article><p>0123456789 · $12,345.67 · 28 September 2026</p></article></html>`;
}
