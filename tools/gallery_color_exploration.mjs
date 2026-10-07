// Authored color intents for the collection; the engine supplies compatible roles.
import fs from "node:fs/promises";
import { explore } from "../skills/dazzler-frontend/scripts/colors.mjs";
const directions = [
  [
    "professional",
    "#FFFFFF",
    255,
    "Electric cobalt on white; the settlement decision owns the blue field.",
  ],
  [
    "legal",
    "#FFFFFF",
    35,
    "Black-letter evidence with vermilion marginal findings; restrained white is intentional.",
  ],
  [
    "business",
    "#C9FF32",
    155,
    "Acid-lime proposal with deep green delivery ledger; optimistic commercial energy.",
  ],
  ["fun", "#FF542E", 305, "Vermilion night-market poster with violet and lemon counterpoints."],
  [
    "family",
    "#FFFFFF",
    225,
    "Bright sky-blue itinerary, sunny packing field and coral day markers on white.",
  ],
  ["presentation", "#4821CE", 85, "Immersive violet presentation with luminous yellow numerals."],
  [
    "school",
    "#FFDE26",
    145,
    "Sun-yellow field notebook with botanical green evidence and blue observations.",
  ],
  [
    "marketing",
    "#FF3191",
    255,
    "Hot-pink repair campaign with a cobalt evidence band and black typography.",
  ],
  [
    "restaurant",
    "#082D26",
    80,
    "Midnight-green supper menu with warm luminous type and citrus course markers.",
  ],
  [
    "technical",
    "#091522",
    195,
    "Night-mode recovery runbook with cyan steps and a separately labelled red stop condition.",
  ],
  [
    "webapp-workspace",
    "#FCFCF8",
    40,
    "Quiet neutral writing paper with a precise orange editorial rail; the manuscript remains calm.",
  ],
  [
    "webapp-board",
    "#F5FF00",
    265,
    "Broadcast-yellow production lanes with black ink and electric violet stage controls.",
  ],
  [
    "webapp-settings",
    "#1648E8",
    210,
    "Full royal-blue schedule studio with white controls and a luminous cyan clock.",
  ],
  [
    "data-revenue",
    "#FFFFFF",
    300,
    "White analytical canvas with vivid violet bars and a black chart field; exact labels stay primary.",
  ],
  [
    "data-operations",
    "#061F27",
    170,
    "Dark instrument panel with electric mint readings and orange warning evidence.",
  ],
  [
    "restaurant-fine-dining",
    "#24103D",
    70,
    "Aubergine dining theatre with a luminous apricot course numeral.",
  ],
  [
    "restaurant-cafe",
    "#FF6726",
    230,
    "Orange coffee counter with electric blue ordering controls and a white receipt.",
  ],
  [
    "restaurant-reservations",
    "#FFFFFF",
    155,
    "White room-planning canvas with vivid green selected tables and coral request panel.",
  ],
  [
    "restaurant-menu",
    "#BCF432",
    300,
    "Lime lunch index with plum type, magenta category marks and clear prices.",
  ],
  [
    "business-portal",
    "#FFFFFF",
    255,
    "White client ledger with a cobalt project masthead and green review evidence.",
  ],
];
const output = {};
for (const [id, background, hue, brief] of directions) {
  const dark = [
    "presentation",
    "restaurant",
    "technical",
    "webapp-settings",
    "data-operations",
    "restaurant-fine-dining",
  ].includes(id);
  const mode = dark ? "dark" : "light";
  const config = {
    brief,
    seed: "dazzler-028-" + id,
    count: 3,
    ranges: {
      hue: [hue, hue + 10],
      chroma: [0.18, 0.32],
      gamutFraction: [0.8, 1],
      neutralChroma: [0, 0.015],
    },
    locked: {
      [mode]: {
        background,
        surface: background,
        success: dark ? "#FFFFFF" : "#000000",
        warning: dark ? "#FFFFFF" : "#000000",
        info: dark ? "#FFFFFF" : "#000000",
      },
    },
  };
  const result = explore(config);
  if (!result.candidates.length) throw Error("No compatible roles for " + id);
  const choices = {
    professional: 1,
    business: 1,
    fun: 1,
    family: 1,
    presentation: 0,
    school: 1,
    marketing: 0,
    restaurant: 2,
    technical: 2,
    "webapp-workspace": 2,
    "data-revenue": 1,
    "data-operations": 2,
    "restaurant-fine-dining": 1,
    "restaurant-menu": 1,
    "business-portal": 1,
  };
  const selectedIndex = choices[id] ?? 0;
  const selected = result.candidates[selectedIndex];
  output[id] = {
    brief,
    mode,
    config,
    attempted: result.attempted,
    passing: result.passing,
    alternatives: result.candidates.map((c) => ({ input: c.input, tokens: c.modes[mode].tokens })),
    selected: selectedIndex,
    tokens: selected.modes[mode].tokens,
    selectionReason:
      "Authored surface supports the stated content direction; functional companions pass role checks. Final composition requires rendered review.",
  };
}
await fs.mkdir("maintenance/gallery-production/v0.28.0", { recursive: true });
await fs.writeFile(
  "maintenance/gallery-production/v0.28.0/color-decisions.json",
  JSON.stringify(output, null, 2) + "\n",
);
console.log("Explored and recorded 20 content-specific color systems.");
