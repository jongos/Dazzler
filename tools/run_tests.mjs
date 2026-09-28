// Expand test paths ourselves so Windows Node 20 does not depend on shell globbing.
import fs from "node:fs";
import { spawnSync } from "node:child_process";
const files = fs
  .readdirSync("tests")
  .filter((name) => name.endsWith(".test.mjs"))
  .sort()
  .map((name) => "tests/" + name);
const result = spawnSync(process.execPath, ["--test", ...files], { stdio: "inherit" });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
