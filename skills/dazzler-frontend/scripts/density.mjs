// Space-use planning only; the host implements and verifies the selected candidate.
export function planDensity(input = {}) {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input) ||
    Object.keys(input).some(
      (k) =>
        !["preference", "avoidableSpace", "crowding", "primaryTaskDisplaced", "locked"].includes(k),
    )
  )
    throw Error("Invalid density input");
  const preference = input.preference ?? "auto";
  if (!["auto", "compact", "comfortable"].includes(preference))
    throw Error("Invalid density preference");
  for (const key of ["avoidableSpace", "crowding", "primaryTaskDisplaced", "locked"])
    if (input[key] !== undefined && typeof input[key] !== "boolean")
      throw Error("Density observations must be booleans");
  const candidates = new Set(["current"]);
  if (!input.locked) {
    if (preference === "compact" || input.avoidableSpace || input.primaryTaskDisplaced)
      candidates.add("tighter");
    if (preference === "comfortable" || input.crowding) candidates.add("roomier");
  }
  return {
    preference,
    selected: input.locked
      ? "current"
      : preference === "auto"
        ? null
        : preference === "compact"
          ? "tighter"
          : "roomier",
    candidates: [...candidates],
    reason: input.locked
      ? "Preserve explicit density constraints; report conflicts"
      : preference === "auto"
        ? "Interpret the brief and compare rendered candidates; neither compact nor spacious is the default"
        : "Explicit user preference, subject to retained constraints and verification",
    procedure: [
      "Identify the reader task, medium, content volume and established design system",
      "Distinguish useful whitespace from empty wrappers, redundant padding and oversized minimum heights",
      "For tighter candidates remove structural waste before reducing local gaps; preserve deliberate grouping",
      "For roomier candidates relieve observed crowding rather than adding uniform padding",
      "Check primary content and actions at representative viewport heights or page sizes; the fold is not fixed",
      "Compare real content, narrow screens, enlarged text, keyboard targets and print breaks before selecting",
    ],
    preserve: [
      "Required content and disclosures",
      "Readable type and line spacing",
      "Touch targets and focus visibility",
      "Brand locks and logical reading order",
    ],
    limits:
      "Observations are supplied by the host, not measured by this helper. No DOM changes, automatic CSS compression or quality certification.",
  };
}
