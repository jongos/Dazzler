// Apply a validated template contract to the existing studio token system.
export function templateCSS(contract, palette, fonts) {
  if (
    contract?.schemaVersion !== 1 ||
    !contract.bindings ||
    Object.keys(contract.bindings).length > 2000
  )
    throw Error("Invalid template token contract");
  const roles = palette.modes.light.tokens,
    lines = [];
  for (const [key, binding] of Object.entries(contract.bindings)) {
    if (!/^--[a-z0-9-]+$/.test(key)) throw Error("Invalid template token name");
    let value;
    if (binding.role) {
      if (!Object.hasOwn(roles, binding.role)) throw Error("Unknown template color role");
      value = roles[binding.role];
    } else if (key === "--display") value = JSON.stringify(fonts.heading);
    else if (binding.value === "transparent") value = "transparent";
    else throw Error("Unsupported literal in template token contract: " + key);
    lines.push("  " + key + ": " + value + ";");
  }
  return (
    "\n/* Template semantic aliases; replace this file and review the rendered result. */\n:root {\n" +
    lines.join("\n") +
    "\n}\n"
  );
}
