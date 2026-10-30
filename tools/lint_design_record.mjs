// Maintenance-only containment for an upstream linter with a bundled vulnerable Zod.
// This limits exposure; it does not patch Zod or provide an OS security sandbox.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
export function lint(text) {
  if (typeof text !== "string" || Buffer.byteLength(text, "utf8") > 262144)
    throw Error("Design lint input exceeds the 256 KiB maintenance limit");
  const result = spawnSync(
    process.execPath,
    [
      "--max-old-space-size=128",
      "--input-type=module",
      "-e",
      'import {lint} from "@google/design.md/linter";let input="";for await(const chunk of process.stdin)input+=chunk;process.stdout.write(JSON.stringify(lint(input)));',
    ],
    {
      cwd: root,
      input: text,
      encoding: "utf8",
      timeout: 5000,
      maxBuffer: 1048576,
    },
  );
  if (result.error || result.status !== 0)
    throw Error("Isolated design lint failed or exceeded its resource budget");
  return JSON.parse(result.stdout);
}
