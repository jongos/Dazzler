// Conservative English heading casing. Original Apache-2.0 implementation.
import { readFileSync } from "node:fs";
export const rules = JSON.parse(
  readFileSync(new URL("../references/title-case.json", import.meta.url), "utf8"),
);
export function heading(text, options = {}) {
  const { case: casing = "title", lang = "en", preserve = [] } = options;
  if (typeof text !== "string" || text.length > 10000)
    throw Error("Heading must be text of at most 10000 characters");
  if (!["title", "sentence", "upper", "preserve"].includes(casing) || typeof lang !== "string")
    throw Error("Invalid heading case or language");
  if (
    !Array.isArray(preserve) ||
    preserve.length > 100 ||
    preserve.some((x) => typeof x !== "string" || !x || x.length > 160)
  )
    throw Error("Invalid heading preserve list");
  if (!/^en(?:-|$)/i.test(lang) || ["sentence", "preserve"].includes(casing)) return text;
  const protectedPattern =
    /`[^`]*`|<(?:code|kbd|samp)\b[^>]*>[\s\S]*?<\/(?:code|kbd|samp)>|<[^>]*>|&(?:#[0-9]+|#x[0-9a-f]+|[a-z]+);|"[^"]*"|“[^”]*”|‘[^’]*’|«[^»]*»|(?<!\w)'[^']*'|(?:https?:\/\/|www\.)\S+|\S+@\S+|[^\s<>]*[0-9_/\\()][^\s<>]*|\b[A-Za-z]+\.[A-Za-z.]+\b/gi;
  const spans = [...text.matchAll(protectedPattern)].map((m) => [m.index, m.index + m[0].length]);
  for (const value of preserve)
    for (let p = text.indexOf(value); p !== -1; p = text.indexOf(value, p + value.length))
      spans.push([p, p + value.length]);
  const words = [...text.matchAll(/\p{L}+(?:['’]\p{L}+)?/gu)].filter(
    (m) => !spans.some(([a, b]) => m.index < b && m.index + m[0].length > a),
  );
  if (casing === "title" && text === text.toUpperCase()) return text;
  let result = "",
    end = 0;
  words.forEach((m, i) => {
    const word = m[0],
      start = m.index,
      stop = start + word.length;
    let replacement = word;
    if (
      !spans.some(([a, b]) => start < b && stop > a) &&
      (casing === "upper" || word === word.toLowerCase())
    ) {
      const between = i ? text.slice(words[i - 1].index + words[i - 1][0].length, start) : "";
      const afterBreak = i === 0 || /[:—]\s*$/.test(between);
      const pair =
        i > 0 &&
        /^\s+$/.test(between) &&
        rules.phrasalPairs.includes(words[i - 1][0].toLowerCase() + " " + word.toLowerCase());
      if (casing === "upper") replacement = /[a-z][A-Z]/.test(word) ? word : word.toUpperCase();
      else if (afterBreak || i === words.length - 1 || pair || !rules.smallWords.includes(word))
        replacement = word[0].toUpperCase() + word.slice(1);
    }
    result += text.slice(end, start) + replacement;
    end = stop;
  });
  return result + text.slice(end);
}
export function headingOptions(input = {}, system = {}) {
  const type = system.typography ?? {};
  return {
    case: input.headingCase ?? type.headingCase ?? "title",
    lang: input.lang ?? type.lang ?? "en",
    preserve: input.preserve ?? type.preserve ?? [],
  };
}
