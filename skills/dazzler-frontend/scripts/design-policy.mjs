// Original project defaults; explicit settings and legacy records take precedence.
import { heading } from "./headings.mjs";
export function resolvePolicy(input = {}) {
  const requested = input.tone ?? "auto";
  if (!["auto", "expressive", "reserved"].includes(requested)) throw Error("Invalid tone");
  const context = String(input.context ?? "").slice(0, 10000);
  const match = context.match(
    /\b(legal|finance|financial|banking|insurance|government|clinical|compliance|contract|board (?:report|memo|meeting|pack|paper)|enterprise|B2B|admin|RFC|access-critical)\b/i,
  );
  const tone = requested === "auto" ? (match ? "reserved" : "expressive") : requested;
  const measure = input.measure ?? 60;
  if (!Number.isFinite(measure) || measure < 30 || measure > 100)
    throw Error("Measure must be 30–100ch");
  const headingCase = input.typography?.headingCase ?? "title";
  const lang = input.typography?.lang ?? "en";
  const preserve = input.typography?.preserve ?? [];
  heading("validation", { case: headingCase, lang, preserve });
  return {
    tone,
    reason:
      requested !== "auto"
        ? "Explicit project choice"
        : match
          ? `Reserved context: ${match[0].toLowerCase()}`
          : "Expressive default",
    measure,
    headingCase,
    lang,
    preserve,
  };
}
export function preparePolicy(input) {
  const p = resolvePolicy(input);
  return {
    ...input,
    ...(p.tone === "reserved" && !input.colors && !input.brand?.seed
      ? {
          colors: { base: "#405879", ...(input.brand?.locks ? { locked: input.brand.locks } : {}) },
        }
      : {}),
    typography: {
      direction: p.tone === "reserved" ? "restrained" : "expressive",
      ...input.typography,
    },
    motion: {
      fast: 120,
      normal: p.tone === "reserved" ? 160 : 200,
      slow: p.tone === "reserved" ? 200 : 320,
      ...input.motion,
    },
  };
}
export function applyPolicy(result, input) {
  const p = resolvePolicy(input);
  result.system.schemaVersion = 3;
  result.system.policy = p;
  Object.assign(result.system.typography, {
    headingCase: p.headingCase,
    lang: p.lang,
    preserve: p.preserve,
    measure: p.measure,
  });
  result.system.grid = {
    columns: { small: 4, medium: 8, large: 12 },
    gutterRem: result.system.spacing[4],
    marginRem: result.system.spacing[6],
  };
  result.css += `\n:root { --measure-body: ${p.measure}ch; --grid-columns: 4; --grid-gutter: var(--space-4); --grid-margin: var(--space-6); }\n:where(p, li, blockquote, figcaption, dd):not(:where(table *, nav *, pre *, code *)) { max-inline-size: var(--measure-body); }\n[data-grid] { display:grid; grid-template-columns:repeat(var(--grid-columns),minmax(0,1fr)); gap:var(--grid-gutter); padding-inline:var(--grid-margin); }\n@media(min-width:48rem){:root{--grid-columns:8}}\n@media(min-width:75rem){:root{--grid-columns:12}}\n`;
  result.dtcg.layout = {
    measure: {
      $type: "string",
      $value: `${p.measure}ch`,
      $description: "CSS character-relative measure; not a physical dimension",
    },
    gridColumns: { $type: "number", $value: 12 },
    gutter: { $type: "dimension", $value: { value: result.system.spacing[4], unit: "rem" } },
    margin: { $type: "dimension", $value: { value: result.system.spacing[6], unit: "rem" } },
  };
  result.tailwind.theme.extend.maxWidth = { prose: "var(--measure-body)" };
  result.tailwind.theme.extend.gridTemplateColumns = {
    dazzler: "repeat(var(--grid-columns),minmax(0,1fr))",
  };
  result.theme += "\n@theme inline { --container-prose: var(--measure-body); }\n";
  return result;
}
