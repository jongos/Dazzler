// Theme existing components; never install or overwrite framework files. Apache-2.0.
import { converter, getContrastRatio } from "./vendor/color-engine.mjs";
const hsl = converter("hsl");
export function shadcnTheme(system, context) {
  if (!context?.shadcn?.supported) return null;
  const convention = context.shadcn.convention;
  if (!["hsl-channels", "color-values"].includes(convention))
    throw Error("Unsupported shadcn color convention");
  const pairs = [
    ["background", "foreground"],
    ["card", "card-foreground"],
    ["popover", "popover-foreground"],
    ["primary", "primary-foreground"],
    ["secondary", "secondary-foreground"],
    ["muted", "muted-foreground"],
    ["accent", "accent-foreground"],
    ["destructive", "destructive-foreground"],
  ];
  const checks = [];
  let css =
    "/* Proposed theme. Merge after comparing existing variables; not an automatic overwrite. */\n";
  for (const [mode, data] of Object.entries(system.palette.modes)) {
    const t = data.tokens;
    const values = {
      background: t.background,
      foreground: t.text,
      card: t.surface,
      "card-foreground": t.text,
      popover: t.surface,
      "popover-foreground": t.text,
      primary: t.action,
      "primary-foreground": t.onAction,
      secondary: t.surface,
      "secondary-foreground": t.text,
      muted: t.surface,
      "muted-foreground": t.muted,
      accent: t.surface,
      "accent-foreground": t.text,
      destructive: t.danger,
      "destructive-foreground":
        getContrastRatio("#FFFFFF", t.danger) >= getContrastRatio("#000000", t.danger)
          ? "#FFFFFF"
          : "#000000",
      border: t.border,
      input: t.border,
      ring: t.focus,
    };
    if (Object.values(values).some((v) => !/^#[\da-f]{6}$/i.test(v)))
      throw Error("Missing shadcn semantic role");
    css += (mode === "light" ? ":root" : ".dark") + " {\n";
    for (const [key, value] of Object.entries(values)) {
      const c = hsl(value);
      const rendered =
        convention === "hsl-channels"
          ? `${+(c.h ?? 0).toFixed(3)} ${+(c.s * 100).toFixed(3)}% ${+(c.l * 100).toFixed(3)}%`
          : value;
      css += `--${key}:${rendered};\n`;
    }
    css += `--radius:${system.radius.medium}rem;\n}\n`;
    for (const [bg, fg] of pairs)
      checks.push({
        mode,
        background: bg,
        foreground: fg,
        ratio: getContrastRatio(values[fg], values[bg]),
        minimum: 4.5,
      });
    checks.push({
      mode,
      foreground: "ring",
      background: "background",
      ratio: getContrastRatio(values.ring, values.background),
      minimum: 3,
    });
  }
  return {
    css,
    checks,
    status: checks.every((c) => c.ratio >= c.minimum) ? "pass" : "unresolved",
    notes: [
      "Destructive uses the measured danger color with the higher-contrast black/white foreground. Preserve established semantic intent. Existing variables and components must be reviewed before integration.",
    ],
  };
}
