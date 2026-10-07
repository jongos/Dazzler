// Original continuous palette exploration over Dazzler's existing color engine. Apache-2.0.
import { createHash, randomBytes } from "node:crypto";
import { converter, toGamut, formatHex } from "./vendor/color-engine.mjs";
const oklch = converter("oklch"),
  lab = converter("oklab"),
  rgb = converter("rgb"),
  gamut = toGamut("rgb", "oklch");
const fields = {
  gamutFraction: [0.35, 0.98],
  hue: [0, 360],
  lightness: [0.42, 0.82],
  chroma: [0.045, 0.24],
  secondaryOffset: [15, 175],
  accentOffset: [175, 345],
  neutralOffset: [-70, 70],
  neutralChroma: [0.008, 0.065],
  lightSurface: [0.78, 0.98],
  darkSurface: [0.1, 0.29],
  surfaceChroma: [0.012, 0.12],
};
function object(v, keys) {
  if (
    !v ||
    typeof v !== "object" ||
    Array.isArray(v) ||
    Object.keys(v).some((k) => !keys.includes(k))
  )
    throw Error("Invalid palette exploration fields");
}
export function radicalInverse(index, base) {
  let value = 0,
    weight = 1 / base;
  while (index > 0) {
    value += (index % base) * weight;
    index = Math.floor(index / base);
    weight /= base;
  }
  return value;
}
export function maximumChroma(l, h) {
  if (!Number.isFinite(l) || l < 0 || l > 1 || !Number.isFinite(h))
    throw Error("Invalid gamut coordinates");
  if (l === 0 || l === 1) return 0;
  let lo = 0,
    hi = 0.5;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2,
      c = rgb({ mode: "oklch", l, c: mid, h: ((h % 360) + 360) % 360 });
    if ([c.r, c.g, c.b].every((v) => v >= 0 && v <= 1)) lo = mid;
    else hi = mid;
  }
  return lo;
}
export function paletteSpace(input = {}) {
  object(input, ["brief", "seed", "count", "base", "ranges", "locked", "target"]);
  if (typeof input.brief !== "string" || !input.brief.trim() || input.brief.length > 2000)
    throw Error("Describe the color intent from the prompt");
  const count = input.count ?? 6;
  if (!Number.isInteger(count) || count < 1 || count > 24) throw Error("Explore 1–24 candidates");
  const seed = input.seed ?? randomBytes(16).toString("hex");
  if (typeof seed !== "string" || !seed.length || seed.length > 128)
    throw Error("Invalid exploration seed");
  if (
    input.base !== undefined &&
    (typeof input.base !== "string" || !/^#[0-9a-f]{6}$/i.test(input.base))
  )
    throw Error("Base requires opaque hex");
  object(input.ranges === undefined ? {} : input.ranges, Object.keys(fields));
  const ranges = { ...fields, ...input.ranges };
  const bounds = {
    gamutFraction: [0, 1],
    hue: [0, 360],
    lightness: [0.05, 0.95],
    chroma: [0, 0.4],
    secondaryOffset: [-360, 360],
    accentOffset: [-360, 360],
    neutralOffset: [-360, 360],
    neutralChroma: [0, 0.15],
    lightSurface: [0.55, 0.995],
    darkSurface: [0.015, 0.45],
    surfaceChroma: [0, 0.3],
  };
  for (const [key, v] of Object.entries(ranges)) {
    const [lo, hi] = bounds[key];
    if (
      !Array.isArray(v) ||
      v.length !== 2 ||
      !v.every(Number.isFinite) ||
      v[0] < lo ||
      v[1] > hi ||
      v[0] > v[1]
    )
      throw Error("Invalid range: " + key);
  }
  // Cranley-Patterson rotation of a Halton sequence: even exploration, reproducible variation.
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];
  const shifts = primes.map(
    (_, i) =>
      createHash("sha256")
        .update(seed + ":" + i)
        .digest()
        .readUInt32BE(0) /
      2 ** 32,
  );
  let dimension = 0,
    point = 1,
    fraction = 1;
  const sample = (k) => {
    const d = dimension++;
    if (d >= primes.length) throw Error("Palette sampler dimension budget exceeded");
    const u = (radicalInverse(point, primes[d]) + shifts[d]) % 1;
    return ranges[k][0] + u * (ranges[k][1] - ranges[k][0]);
  };
  const color = (l, c, h) =>
    formatHex(
      gamut({
        mode: "oklch",
        l,
        c: Math.min(c, maximumChroma(l, h) * fraction),
        h: ((h % 360) + 360) % 360,
      }),
    ).toUpperCase();
  const configs = [];
  for (let i = 0; i < count * 8; i++) {
    dimension = 0;
    point = i + 1;
    fraction = sample("gamutFraction");
    const h = sample("hue"),
      c = sample("chroma"),
      l = sample("lightness");
    const base = input.base ?? color(l, c, h);
    const b = oklch(base),
      anchor = b.c > 0.0001 ? (b.h ?? h) : h;
    const secondHue = anchor + sample("secondaryOffset"),
      accentHue = anchor + sample("accentOffset"),
      neutralHue = anchor + sample("neutralOffset");
    const nc = sample("neutralChroma"),
      sc = sample("surfaceChroma"),
      ll = sample("lightSurface"),
      dl = sample("darkSurface");
    configs.push({
      base,
      seeds: {
        secondary: color(sample("lightness"), sample("chroma"), secondHue),
        accent: color(sample("lightness"), sample("chroma"), accentHue),
        neutral: color(0.55, nc, neutralHue),
      },
      surfaces: {
        light: {
          background: color(ll, sc, neutralHue),
          surface: color(Math.max(0.5, ll - 0.035), sc * 0.65, neutralHue),
        },
        dark: {
          background: color(dl, sc, neutralHue),
          surface: color(Math.min(0.49, dl + 0.045), sc * 0.65, neutralHue),
        },
      },
      ...(input.locked !== undefined ? { locked: structuredClone(input.locked) } : {}),
      ...(input.target !== undefined ? { target: input.target } : {}),
    });
  }
  return { seed, count, brief: input.brief, ranges: structuredClone(ranges), configs };
}
export function paletteDistance(a, b) {
  const roles = ["brand", "secondary", "accent", "background", "surface"];
  let sum = 0;
  for (const mode of ["light", "dark"])
    for (const role of roles) {
      const x = lab(a.modes[mode].tokens[role]),
        y = lab(b.modes[mode].tokens[role]);
      sum += (x.l - y.l) ** 2 + (x.a - y.a) ** 2 + (x.b - y.b) ** 2;
    }
  return Math.sqrt(sum / 10);
}
export function diversePalettes(pool, count) {
  if (!pool.length) return [];
  const remaining = [...pool],
    chosen = [remaining.shift()];
  while (chosen.length < count && remaining.length) {
    let index = -1,
      best = 0;
    for (let i = 0; i < remaining.length; i++) {
      const d = Math.min(...chosen.map((p) => paletteDistance(p, remaining[i])));
      if (d > best) {
        best = d;
        index = i;
      }
    }
    if (index < 0 || best < 0.025) break;
    chosen.push(remaining.splice(index, 1)[0]);
  }
  return chosen;
}
