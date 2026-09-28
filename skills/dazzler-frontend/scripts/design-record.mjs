// Original DESIGN.md subset adapter: no YAML dependency or executable tags. Apache-2.0.
import { generate } from "./colors.mjs";
const forbidden = new Set(["__proto__", "constructor", "prototype"]);
const keyPattern = /^[a-zA-Z0-9_-]+$/;
function scalar(value) {
  if (value.startsWith('"')) return JSON.parse(value);
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replace(/''/g, "'");
  if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(value)) {
    const number = Number(value);
    if (!Number.isFinite(number)) throw Error("Nonfinite YAML number");
    return number;
  }
  if (/^[!&*\[\]{>|]|^(?:true|false|null|~)$/.test(value) || value.includes(" #"))
    throw Error("Unsupported YAML scalar; quote strings and use nested mappings");
  return value;
}
export function parseDesign(text) {
  if (typeof text !== "string" || Buffer.byteLength(text) > 262144)
    throw Error("DESIGN.md exceeds 256 KiB");
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(text);
  if (!match)
    throw Error("Expected fenced YAML front matter; legacy prose requires deliberate migration");
  const data = {},
    stack = [{ indent: -2, value: data }];
  let count = 0;
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    if (++count > 1000) throw Error("Too many YAML entries");
    const m = /^( *)([a-zA-Z0-9_-]+):(?: +(.*))?$/.exec(line);
    if (!m || m[1].length % 2 || m[1].length > 16 || forbidden.has(m[2]))
      throw Error("Unsupported YAML mapping syntax");
    const indent = m[1].length;
    while (stack.at(-1).indent >= indent) stack.pop();
    if (indent !== stack.at(-1).indent + 2) throw Error("Invalid YAML indentation");
    const parent = stack.at(-1).value;
    if (Object.hasOwn(parent, m[2])) throw Error("Duplicate YAML key");
    parent[m[2]] = m[3] === undefined ? {} : scalar(m[3]);
    if (m[3] === undefined) stack.push({ indent, value: parent[m[2]] });
  }
  let resolutions = 0;
  function resolve(value, trail = []) {
    if (++resolutions > 10000) throw Error("Token expansion exceeds budget");
    if (typeof value === "string" && /^\{[^{}]+\}$/.test(value)) {
      const name = value.slice(1, -1),
        parts = name.split(".");
      if (trail.includes(name) || trail.length > 16 || parts.some((p) => forbidden.has(p)))
        throw Error("Cyclic or unsafe token reference");
      let target = data;
      for (const part of parts) {
        if (!target || typeof target !== "object" || !Object.hasOwn(target, part))
          throw Error("Broken token reference: " + name);
        target = target[part];
      }
      return resolve(target, [...trail, name]);
    }
    if (value && typeof value === "object")
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolve(v, trail)]));
    return value;
  }
  const resolved = resolve(data);
  const unsupported = Object.keys(data).filter(
    (k) =>
      ![
        "version",
        "name",
        "description",
        "colors",
        "typography",
        "spacing",
        "rounded",
        "components",
      ].includes(k),
  );
  return {
    tokens: data,
    resolved,
    body: match[2],
    original: text,
    unsupported,
    trust: "untrusted-evidence",
  };
}
export function stringifyDesign(document) {
  function emit(value, depth = 0) {
    return Object.entries(value)
      .map(([key, item]) => {
        if (!keyPattern.test(key) || forbidden.has(key)) throw Error("Unsafe token key");
        if (item && typeof item === "object" && !Array.isArray(item))
          return `${" ".repeat(depth)}${key}:\n${emit(item, depth + 2)}`;
        if (
          !["number", "string"].includes(typeof item) ||
          (typeof item === "number" && !Number.isFinite(item))
        )
          throw Error("Unsupported token value");
        return `${" ".repeat(depth)}${key}: ${JSON.stringify(item)}\n`;
      })
      .join("");
  }
  return "---\n" + emit(document.tokens) + "---\n" + document.body;
}
export function exportDesign(system) {
  const colors = { primary: system.palette.modes.light.tokens.brand };
  for (const [mode, values] of Object.entries(system.palette.modes))
    for (const [key, value] of Object.entries(values.tokens)) colors[`${mode}-${key}`] = value;
  const typography = {};
  for (const [key, size] of Object.entries(system.type)) {
    const t = system.typography?.steps[key];
    typography[key] = {
      fontFamily: system.fonts[t?.role ?? "body"],
      fontSize: `${t?.printRem ?? size}rem`,
      fontWeight: t?.weight ?? 400,
      lineHeight: t?.lineHeight ?? 1.6,
      letterSpacing: `${t?.letterSpacing ?? 0}em`,
    };
  }
  return stringifyDesign({
    tokens: {
      version: "alpha",
      name: "Dazzler project design",
      colors,
      typography,
      spacing: Object.fromEntries(Object.entries(system.spacing).map(([k, v]) => [k, `${v}rem`])),
      rounded: Object.fromEntries(Object.entries(system.radius).map(([k, v]) => [k, `${v}rem`])),
    },
    body: "## Overview\n\nContinue this design using the adjacent design-system.json canonical record. Preserve established values unless the task authorizes a change.\n\n## Colors\n\nLight and dark semantic roles are measured against their paired backgrounds. Original explicit locks remain in the canonical record.\n\n## Typography\n\nStatic print sizes are exchanged here. Full fluid endpoints, selected-face capabilities and rationale remain in design-system.json. Font names do not prove installation or licensing; retain exported font notices.\n\n## Layout\n\nSpacing uses rem dimensions. Preserve established component structure.\n\n## Shapes\n\nRadius uses rem dimensions.\n",
  });
}
export function importDesign(text, accepted = false) {
  const document = parseDesign(text),
    unsupported = [...document.unsupported],
    locked = { light: {}, dark: {} };
  if (document.resolved.components) unsupported.push("components: preserved, not mapped");
  const roles = new Set(Object.keys(generate({ base: "#7048E8" }).modes.light.tokens));
  for (const [key, value] of Object.entries(document.resolved.colors ?? {})) {
    const match = /^(light|dark)-(.+)$/.exec(key);
    if (match && roles.has(match[2]) && /^#[a-fA-F0-9]{6}$/.test(value))
      locked[match[1]][match[2]] = value;
    else if (key === "primary" && /^#[a-fA-F0-9]{6}$/.test(value)) {
      if (!document.resolved.colors?.["light-brand"]) locked.light.brand = value;
      if (!document.resolved.colors?.["dark-brand"]) locked.dark.brand = value;
    } else unsupported.push(`colors.${key}`);
  }
  const fonts = {},
    typography = document.resolved.typography ?? {};
  for (const [role, key] of [
    ["body", "step0"],
    ["heading", "step3"],
  ])
    if (typeof typography[key]?.fontFamily === "string") fonts[role] = typography[key].fontFamily;
  fonts.body ??= typography["body-md"]?.fontFamily ?? typography.body?.fontFamily;
  fonts.heading ??= typography.h1?.fontFamily;
  for (const role of Object.keys(fonts)) if (fonts[role] === undefined) delete fonts[role];
  const groups = {};
  for (const [source, target] of [
    ["spacing", "spacing"],
    ["rounded", "radius"],
  ]) {
    groups[target] = {};
    for (const [key, value] of Object.entries(document.resolved[source] ?? {})) {
      const m = /^(\d+(?:\.\d+)?)(rem|px)$/.exec(value);
      if (m) groups[target][key] = Number(m[1]) / (m[2] === "px" ? 16 : 1);
      else unsupported.push(`${source}.${key}`);
    }
  }
  const typeScale = {},
    overrides = {};
  for (const [key, value] of Object.entries(typography)) {
    if (!/^step(?:-1|[0-6])$/.test(key)) {
      unsupported.push(`typography.${key}`);
      continue;
    }
    const size = /^(\d+(?:\.\d+)?)(rem|px)$/.exec(value.fontSize);
    const tracking = /^(-?\d+(?:\.\d+)?)em$/.exec(value.letterSpacing ?? "0em");
    if (
      !size ||
      !tracking ||
      typeof value.lineHeight !== "number" ||
      typeof value.fontWeight !== "number"
    ) {
      unsupported.push(`typography.${key}`);
      continue;
    }
    const expectedFamily = Number(key.slice(4)) > 1 ? fonts.heading : fonts.body;
    if (value.fontFamily && value.fontFamily !== expectedFamily)
      unsupported.push(`typography.${key}.fontFamily`);
    typeScale[key] = Number(size[1]) / (size[2] === "px" ? 16 : 1);
    overrides[key] = {
      lineHeight: value.lineHeight,
      letterSpacing: Number(tracking[1]),
      weight: value.fontWeight,
    };
    for (const property of Object.keys(value))
      if (
        !["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing"].includes(property)
      )
        unsupported.push(`typography.${key}.${property}`);
  }
  const typeConfig =
    Object.keys(typeScale).length === 8
      ? { typeScale, typography: { mode: "static", overrides } }
      : {};
  if (Object.keys(typeScale).length && Object.keys(typeScale).length !== 8)
    unsupported.push("typography: incomplete eight-step mapping");
  const config = {
    schemaVersion: 2,
    fonts,
    ...groups,
    ...typeConfig,
    colors: { base: locked.light.brand ?? "#7048E8", locked },
  };
  const contrast = generate(config.colors);
  return {
    document,
    config: accepted ? config : null,
    proposedConfig: config,
    accepted,
    unsupported,
    contrast,
    notes: [
      "Import preserves the complete parsed tree and prose. Only listed semantic colors, family roles and rem/px spacing/radius map into Dazzler. Complete step-1 through step6 typography maps to static sizes/leading/tracking; use the canonical record to resume fluid behavior. No observed value becomes an adopted constraint until the agent accepts the designated source.",
    ],
  };
}

export function resumeConfig(system) {
  if (![1, 2].includes(system.schemaVersion)) throw Error("Unsupported design-system schema");
  if (system.schemaVersion === 2 && system.configuration)
    return structuredClone(system.configuration);
  if (!system.fonts || !system.palette?.modes || !system.type?.step0)
    throw Error("Incomplete legacy design system");
  return {
    schemaVersion: 1,
    fonts: system.fonts,
    fontFallbacks: Object.fromEntries(
      Object.entries(system.fontRoles ?? {}).map(([k, v]) => [k, v.fallback]),
    ),
    typeScale: system.type,
    baseSize: system.type.step0 * 16,
    typeRatio: system.type.step1 / system.type.step0,
    spacing: system.spacing,
    radius: system.radius,
    motion: system.motion,
    colors: {
      base: system.palette.modes.light.tokens.brand,
      locked: Object.fromEntries(
        Object.entries(system.palette.modes).map(([mode, data]) => [mode, data.tokens]),
      ),
    },
  };
}
