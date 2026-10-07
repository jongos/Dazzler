// Advisory palette-distribution review. These thresholds flag repetition, not quality.
import { converter } from "./vendor/color-engine.mjs";

export function reviewCollection(items) {
  if (!Array.isArray(items) || !items.length || items.length > 200)
    throw Error("Supply 1–200 independently designed examples");
  const convert = converter("oklch");
  const seen = new Set();
  const rows = items.map((item) => {
    if (!item || typeof item.id !== "string" || !item.id || seen.has(item.id))
      throw Error("Unique example IDs are required");
    seen.add(item.id);
    if (!/^#[0-9a-f]{6}$/i.test(item.background)) throw Error("Use opaque background hex");
    const c = convert(item.background);
    const treatment =
      c.l < 0.5
        ? "dark"
        : c.c >= 0.12
          ? "chromatic"
          : c.l > 0.9 && c.c < 0.015
            ? "white-or-neutral"
            : "light-tinted";
    return { id: item.id, background: item.background, lightness: c.l, chroma: c.c, treatment };
  });
  const counts = Object.fromEntries(
    ["dark", "chromatic", "white-or-neutral", "light-tinted"].map((k) => [
      k,
      rows.filter((r) => r.treatment === k).length,
    ]),
  );
  const flags = Object.entries(counts)
    .filter(([, n]) => items.length >= 5 && n / items.length > 0.7)
    .map(
      ([k, n]) =>
        `${n}/${items.length} dominant surfaces are ${k}; review whether this repetition serves the brief.`,
    );
  const pale = rows.filter((r) => r.lightness > 0.85 && r.chroma < 0.06).length;
  if (items.length >= 5 && pale / items.length > 0.7)
    flags.push(
      `${pale}/${items.length} surfaces are pale and low-chroma, regardless of hue; inspect color area across the rendered collection.`,
    );
  return {
    rows,
    counts,
    flags,
    requiresVisualReview: true,
    limits:
      "Background coordinates omit color area, typography, images and nested surfaces. Related format variants should be counted once. Flags can be justified by a shared brand; they never force recoloring or certify beauty.",
  };
}
