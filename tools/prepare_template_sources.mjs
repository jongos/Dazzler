// Compile readable, independently themeable template sources; maintenance dependencies only.
import fs from "node:fs/promises";
import path from "node:path";
import postcss from "postcss";
import prettier from "prettier";
import { getContrastRatio } from "../skills/dazzler-frontend/scripts/vendor/color-engine.mjs";
const root = path.resolve("skills/dazzler-frontend/assets/templates");
const colors =
  /#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})\b|(?:rgba?|hsla?)\([^()]*\)|\b(?:white|black|transparent)\b/gi;
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);

function tokenize(css, context) {
  const tree = postcss.parse(css),
    values = {},
    bindings = {};
  // Drop scoped rules belonging only to other showcase examples before assigning tokens.
  tree.walkRules((rule) => {
    const selectors = rule.selectors.filter((selector) => {
      const scopes = [...selector.matchAll(/\.(?:template|doc)-([a-z-]+)/g)].map((x) => x[1]);
      return !scopes.length || scopes.includes(context);
    });
    if (!selectors.length) rule.remove();
    else rule.selectors = selectors;
  });
  tree.walkRules((rule) => {
    if (rule.selector === ":root") {
      rule.walkDecls((d) => {
        if (d.prop.startsWith("--")) {
          values[d.prop] = d.value;
          d.remove();
        }
      });
      if (!rule.nodes.length) rule.remove();
    }
  });
  const roleFor = (prop, value, selector) => {
    if (/shadow|border|outline/.test(prop)) return "border";
    const light = getContrastRatio(value, "#ffffff") < 2;
    if (/background|fill/.test(prop)) return light ? "background" : "action";
    if (light) return "onAction";
    return /muted|small|caption/.test(selector) ? "muted" : "text";
  };
  for (const [key, value] of Object.entries(values))
    bindings[key] = {
      role:
        {
          "--accent": "action",
          "--secondary": "accent",
          "--bright": "surface",
          "--paper": "background",
          "--ink": "text",
          "--tint": "surface",
        }[key] ?? null,
      value,
    };
  tree.walkDecls((decl) => {
    const selector = decl.parent.selector ?? decl.parent.name ?? "component";
    let n = 0;
    decl.value = decl.value.replace(colors, (color) => {
      // Descriptive selector/property names make a retheme diff understandable.
      const stem =
        "--" +
        (context === "seating" ? "seating-" : "") +
        slug(selector) +
        "-" +
        slug(decl.prop) +
        (n++ ? "-" + n : "");
      let key = stem,
        i = 2;
      while (key in values && values[key] !== color) key = stem + "-" + i++;
      values[key] = color;
      bindings[key] = {
        role: color.toLowerCase() === "transparent" ? null : roleFor(decl.prop, color, selector),
        value: color,
      };
      return "var(" + key + ")";
    });
  });
  return {
    css: tree.toString(),
    tokens:
      ":root {\n" +
      Object.entries(values)
        .map(([k, v]) => "  " + k + ": " + v + ";")
        .join("\n") +
      "\n}\n",
    contract: {
      schemaVersion: 1,
      bindings,
      notes:
        "Replace tokens.css using studio.mjs tokens --template tokens.json, then inspect rendered contrast. No component stylesheet changes are required.",
    },
  };
}

async function write(file, text, parser) {
  if (parser === "html")
    text = text.replace(
      /class="(?:table-wrap|revenue-chart)"(?! tabindex)/g,
      (match) => match + ' tabindex="0"',
    );
  await fs.writeFile(
    file,
    await prettier.format(text, {
      parser,
      printWidth: 100,
      htmlWhitespaceSensitivity: "css",
      endOfLine: "lf",
    }),
  );
}
for (const name of (await fs.readdir(path.join(root, "html"))).filter((n) => n.endsWith(".html"))) {
  const file = path.join(root, "html", name),
    dir = name.slice(0, -5);
  let html = await fs.readFile(file, "utf8");
  const match = html.match(/<style>([\s\S]*?)<\/style>/);
  if (!match) throw Error("Expected generated inline document stylesheet: " + name);
  const result = tokenize(match[1], dir);
  await fs.mkdir(path.join(root, "html", dir), { recursive: true });
  html = html.replace(
    match[0],
    `<link rel="stylesheet" href="${dir}/tokens.css"><link rel="stylesheet" href="${dir}/styles.css">`,
  );
  await write(path.join(root, "html", dir, "styles.css"), result.css, "css");
  await write(path.join(root, "html", dir, "tokens.css"), result.tokens, "css");
  await fs.writeFile(
    path.join(root, "html", dir, "tokens.json"),
    JSON.stringify(result.contract, null, 2) + "\n",
  );
  await write(file, html, "html");
}
for (const name of await fs.readdir(path.join(root, "ui"))) {
  const dir = path.join(root, "ui", name),
    file = path.join(dir, "styles.css");
  let css = await fs.readFile(file, "utf8");
  const data = JSON.parse(await fs.readFile(path.join(dir, "template.json"), "utf8"));
  const result = tokenize(css, data.layout);
  await write(file, '@import url("tokens.css");\n' + result.css, "css");
  await write(path.join(dir, "tokens.css"), result.tokens, "css");
  await fs.writeFile(
    path.join(dir, "tokens.json"),
    JSON.stringify(result.contract, null, 2) + "\n",
  );
  await write(
    path.join(dir, "index.html"),
    await fs.readFile(path.join(dir, "index.html"), "utf8"),
    "html",
  );
}
const seating = path.join(root, "ui/restaurant-reservations/seating");
let roomHTML = await fs.readFile(path.join(seating, "index.html"), "utf8");
let roomCSS = await fs.readFile(path.join(seating, "hotspots.css"), "utf8");
roomHTML = roomHTML.replace(/<style>([\s\S]*?)<\/style>/g, (_, css) => {
  roomCSS += "\n" + css;
  return "";
});
const room = tokenize(roomCSS, "seating");
await fs.writeFile(path.join(seating, "index.html"), roomHTML);
await write(
  path.join(seating, "hotspots.css"),
  '@import url("../tokens.css");\n' + room.css,
  "css",
);
await fs.appendFile(path.join(seating, "../tokens.css"), room.tokens);
const contractPath = path.join(seating, "../tokens.json");
const contract = JSON.parse(await fs.readFile(contractPath, "utf8"));
Object.assign(contract.bindings, room.contract.bindings);
await fs.writeFile(contractPath, JSON.stringify(contract, null, 2) + "\n");
console.log("Formatted and tokenized 20 HTML/UI template sources.");
