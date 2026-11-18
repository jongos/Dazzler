#!/usr/bin/env node
// Read-only contrast and token discipline checks; no browser required.
import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { getContrastRatio } from "./vendor/color-engine.mjs";

const PAIRS = [
  { foreground: "text", background: "background", minimum: 4.5 },
  { foreground: "text", background: "surface", minimum: 4.5 },
  { foreground: "muted", background: "background", minimum: 4.5 },
  { foreground: "onAction", background: "action", minimum: 3 },
];

function checkDesignSystem(system) {
  const findings = [];
  const modes = system.palette?.modes ?? {};
  for (const [mode, data] of Object.entries(modes)) {
    const tokens = data?.tokens ?? {};
    for (const pair of PAIRS) {
      const fg = tokens[pair.foreground];
      const bg = tokens[pair.background];
      if (!fg || !bg) continue;
      const ratio = getContrastRatio(fg, bg);
      if (ratio < pair.minimum) {
        findings.push({
          kind: "contrast",
          mode,
          foreground: pair.foreground,
          background: pair.background,
          ratio: Number(ratio.toFixed(3)),
          minimum: pair.minimum,
        });
      }
    }
  }
  const sizes = (system.type?.scale ?? [])
    .map((step) => step.size)
    .filter((value) => Number.isFinite(value));
  const uniqueSizes = [...new Set(sizes)].sort((a, b) => a - b);
  if (uniqueSizes.length && uniqueSizes.length < 4) {
    findings.push({
      kind: "type-scale",
      message: "Fewer than four distinct type steps in design-system.json",
      sizes: uniqueSizes,
    });
  }
  for (let index = 1; index < uniqueSizes.length; index++) {
    if (uniqueSizes[index] < uniqueSizes[index - 1]) {
      findings.push({
        kind: "type-scale",
        message: "Type sizes are not monotonic",
        sizes: uniqueSizes,
      });
      break;
    }
  }
  const body = uniqueSizes.find((size) => size >= 15.5 && size <= 16.5) ?? uniqueSizes[0];
  if (body !== undefined && body < 16) {
    findings.push({
      kind: "type-scale",
      message: "Body size below 16px without an explicit brief exception",
      bodySize: body,
    });
  }
  return findings;
}

async function scanCss(cssPath) {
  const css = await readFile(cssPath, "utf8");
  const findings = [];
  const hexLiterals = css.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
  const usesVariables = /--[\w-]+/.test(css);
  if (hexLiterals.length > 8 && usesVariables) {
    findings.push({
      kind: "token-discipline",
      message: "Many raw hex values in a stylesheet that also defines CSS variables; prefer tokens",
      sampleCount: hexLiterals.length,
    });
  }
  if (/outline\s*:\s*none/.test(css) && !/:focus-visible/.test(css)) {
    findings.push({
      kind: "focus",
      message: "outline:none present without :focus-visible replacement",
    });
  }
  if (!/prefers-reduced-motion/.test(css) && /(transition|animation)/.test(css)) {
    findings.push({
      kind: "motion",
      message: "Motion styles without prefers-reduced-motion guard",
      severity: "advisory",
    });
  }
  const lengths = [...css.matchAll(/(?:padding|margin|gap)\s*:\s*([^;]+)/g)].flatMap(
    (match) => match[1].match(/\d*\.?\d+(?:px|rem)/g) ?? [],
  );
  const offGrid = lengths.filter((token) => {
    const value = parseFloat(token);
    const unit = token.replace(/[\d.]/g, "");
    const px = unit === "rem" ? value * 16 : value;
    return px > 0 && Math.abs(px / 4 - Math.round(px / 4)) > 0.01;
  });
  if (offGrid.length > 3) {
    findings.push({
      kind: "spacing",
      message: "Several spacing values are not on a 4px grid",
      examples: [...new Set(offGrid)].slice(0, 6),
    });
  }
  const breakpoints = [...css.matchAll(/@media[^{]*\(\s*(?:min|max)-width\s*:\s*([^)]+)\)/g)].map(
    (match) => match[1].trim(),
  );
  return { findings, breakpoints: [...new Set(breakpoints)] };
}

async function main() {
  const {
    values: { system, css },
  } = parseArgs({
    options: {
      system: { type: "string" },
      css: { type: "string" },
    },
  });
  if (!system && !css) {
    console.error(
      "Usage: node scripts/token-self-check.mjs --system design-system.json [--css styles.css]",
    );
    process.exit(2);
  }
  const report = { status: "pass", findings: [] };
  if (system) {
    const parsed = JSON.parse(await readFile(system, "utf8"));
    report.findings.push(...checkDesignSystem(parsed));
  }
  if (css) {
    const cssReport = await scanCss(css);
    report.findings.push(...cssReport.findings);
    report.breakpoints = cssReport.breakpoints;
  }
  if (report.findings.some((item) => item.severity !== "advisory")) {
    report.status = "needs-work";
  }
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.status === "pass" ? 0 : 1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
