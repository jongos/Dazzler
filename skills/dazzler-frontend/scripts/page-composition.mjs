// Original open page composition compiler. Apache-2.0.
// Agent-authored relationships, not a catalog, prompt interpreter or taste score.
import { getContrastRatio } from "./vendor/color-engine.mjs";

function object(value, keys) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).some((k) => !keys.includes(k))
  )
    throw Error("Invalid page composition fields");
}
function number(value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max)
    throw Error("Invalid composition dimension");
  return value;
}
function text(value, limit) {
  if (typeof value !== "string" || !value.trim() || value.length > limit)
    throw Error("Describe the composition and its purpose");
}
function id(value) {
  if (typeof value !== "string" || !/^[a-z][a-z0-9-]{0,63}$/.test(value))
    throw Error("Use a simple composition identifier");
  return value;
}
function grid(values) {
  if (!Array.isArray(values) || !values.length || values.length > 24)
    throw Error("Provide 1–24 proportional columns");
  return values.map((v) => `minmax(0,${number(v, 0.1, 20)}fr)`).join(" ");
}
function pair(surface, ink) {
  if (![surface, ink].every((v) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v)))
    throw Error("Composition surfaces and ink require opaque hex colors");
  const ratio = getContrastRatio(surface, ink);
  if (ratio < 4.5)
    throw Error(
      "Composition text contrast is below 4.5:1; preserve the surface and revise its ink",
    );
  return ratio;
}
function placement(value, columns) {
  object(value, ["start", "span"]);
  const start = number(value.start, 1, columns),
    span = number(value.span, 1, columns);
  if (!Number.isInteger(start) || !Number.isInteger(span) || start + span - 1 > columns)
    throw Error("Region exceeds its composition grid");
  return `${start}/span ${span}`;
}
export function compilePageComposition(plan) {
  object(plan, ["idea", "sections"]);
  text(plan.idea, 1000);
  if (!Array.isArray(plan.sections) || !plan.sections.length || plan.sections.length > 40)
    throw Error("Provide 1–40 authored sections");
  const css = [],
    mobile = [],
    ids = new Set(),
    checks = [];
  for (const s of plan.sections) {
    object(s, [
      "id",
      "columns",
      "mobileColumns",
      "gapRem",
      "paddingRem",
      "surface",
      "ink",
      "regions",
    ]);
    id(s.id);
    if (ids.has(s.id)) throw Error("Duplicate composition section");
    ids.add(s.id);
    const desktopGrid = grid(s.columns),
      smallGrid = grid(s.mobileColumns);
    const ratio = pair(s.surface, s.ink),
      gap = number(s.gapRem, 0, 8),
      padding = number(s.paddingRem, 0, 16);
    const selector = `[data-dazzler-section="${s.id}"]`;
    css.push(
      `${selector}{display:grid;grid-template-columns:${desktopGrid};gap:${gap}rem;padding:${padding}rem;background:${s.surface};color:${s.ink}}`,
    );
    mobile.push(
      `${selector}{grid-template-columns:${smallGrid};padding:${Math.min(padding, 1.25)}rem;gap:${Math.min(gap, 2)}rem}`,
    );
    if (!Array.isArray(s.regions) || !s.regions.length || s.regions.length > 60)
      throw Error("Provide 1–60 semantic regions per section");
    const regions = new Set();
    for (const r of s.regions) {
      object(r, [
        "id",
        "desktop",
        "mobile",
        "font",
        "sizeRem",
        "lineHeight",
        "align",
        "surface",
        "ink",
      ]);
      id(r.id);
      if (regions.has(r.id)) throw Error("Duplicate composition region");
      regions.add(r.id);
      const target = `${selector}>[data-dazzler-region="${r.id}"]`;
      const desktop = placement(r.desktop, s.columns.length),
        small = placement(r.mobile, s.mobileColumns.length);
      let declarations = `grid-column:${desktop};min-width:0;overflow-wrap:anywhere;`;
      if (r.font !== undefined) {
        if (!["body", "heading", "mono"].includes(r.font)) throw Error("Unknown font role");
        declarations += `font-family:var(--font-${r.font}, ${r.font === "mono" ? "monospace" : "sans-serif"});`;
      }
      if (r.sizeRem !== undefined) {
        if (!Array.isArray(r.sizeRem) || r.sizeRem.length !== 2)
          throw Error("Provide fluid type endpoints");
        const [a, b] = r.sizeRem;
        number(a, 0.75, 18);
        number(b, a, 18);
        declarations += `font-size:clamp(${a}rem,calc(${a}rem + ${(b - a) * 1.5}vw),${b}rem);`;
      }
      if (r.lineHeight !== undefined)
        declarations += `line-height:${number(r.lineHeight, 0.9, 2)};`;
      if (r.align !== undefined) {
        if (!["start", "center", "end"].includes(r.align)) throw Error("Unknown text alignment");
        declarations += `text-align:${r.align};`;
      }
      if (r.surface !== undefined || r.ink !== undefined) {
        const background = r.surface ?? s.surface,
          ink = r.ink ?? s.ink;
        checks.push({ section: s.id, region: r.id, ratio: pair(background, ink) });
        declarations += `background:${background};color:${ink};`;
      }
      css.push(`${target}{${declarations}}`);
      mobile.push(`${target}{grid-column:${small}}`);
    }
    checks.push({ section: s.id, ratio });
  }
  css.push(`@media(max-width:48rem){${mobile.join("\n")}}`);
  return {
    css: css.join("\n"),
    plan: structuredClone(plan),
    checks,
    status: "requires-render",
    notes: [
      "Bind section and region identifiers to semantic HTML in reading order. No HTML or interactions are invented.",
      "Verify actual fonts, descendants, focus, mobile reflow and behavior; token contrast is not a rendered accessibility certificate.",
      "Use custom CSS and native components when the brief exceeds this optional compiler. There is no required page archetype.",
    ],
  };
}
