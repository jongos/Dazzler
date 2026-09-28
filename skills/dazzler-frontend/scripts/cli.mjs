import { parseArgs } from "node:util";

export async function cli(usage, options, action, positionalCount = 0) {
  try {
    const { values, positionals } = parseArgs({
      strict: true,
      allowPositionals: true,
      options: { ...options, help: { type: "boolean" } },
    });
    if (values.help) {
      console.log("Usage: " + usage);
      return;
    }
    if (positionals.length !== positionalCount)
      throw Error("Expected " + positionalCount + " positional argument(s)");
    await action(values, positionals);
  } catch (error) {
    console.error("Error: " + String(error.message).replace(/[\r\n]+/g, " "));
    console.error("Usage: " + usage);
    process.exitCode = 1;
  }
}
