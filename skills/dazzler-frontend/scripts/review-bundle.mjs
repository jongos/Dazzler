// Local review provenance, not a visual-quality score. Apache-2.0.
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { readJSON } from "./runtime.mjs";

const dimensions = ["correctness", "taskSupport", "craft", "distinctiveness"];
function text(v) {
  return typeof v === "string" && v.trim().length > 0 && v.length <= 4000;
}
export function validateJudgments(record) {
  if (!record || !text(record.idea) || !text(record.relationship) || !text(record.tradeoff))
    throw Error("Describe the subject-specific idea, visible relationship and tradeoff");
  for (const key of dimensions) {
    const item = record[key];
    if (
      !item ||
      !["supported", "needs-work", "not-reviewed"].includes(item.status) ||
      !text(item.reason)
    )
      throw Error("Invalid judgment: " + key);
    if (
      !Array.isArray(item.evidence) ||
      item.evidence.length > 32 ||
      item.evidence.some((v) => !text(v))
    )
      throw Error("Invalid judgment evidence: " + key);
    if (item.status !== "not-reviewed" && item.evidence.length === 0)
      throw Error("Reviewed judgments require evidence: " + key);
  }
  return record;
}
function digest(root, relative) {
  if (
    !text(relative) ||
    relative.includes("\\") ||
    path.posix.isAbsolute(relative) ||
    relative.split("/").some((p) => !p || p === "." || p === ".." || p.includes(":"))
  )
    throw Error("Use a relative file path within the review root");
  const base = fs.realpathSync(root);
  const file = fs.realpathSync(path.resolve(base, relative));
  const stat = fs.statSync(file);
  if (!file.startsWith(base + path.sep) || !stat.isFile())
    throw Error("Review file escapes root or is not a file");
  if (stat.size > 64 * 1024 * 1024) throw Error("Review file exceeds 64 MiB");
  return createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}
function paths(list, label) {
  if (
    !Array.isArray(list) ||
    !list.length ||
    list.length > 512 ||
    new Set(list).size !== list.length
  )
    throw Error("Invalid " + label + " list");
}
export function sealBundle(root, spec) {
  if (!spec || !text(spec.revision)) throw Error("Missing saved revision");
  paths(spec.inputs, "inputs");
  paths(spec.captures, "captures");
  if (spec.inputs.some((v) => spec.captures.includes(v)))
    throw Error("Inputs and captures overlap");
  validateJudgments(spec.judgments);
  for (const key of dimensions)
    for (const ref of spec.judgments[key].evidence)
      if (![...spec.inputs, ...spec.captures].includes(ref))
        throw Error("Evidence is not in bundle: " + ref);
  const hash = (list) => Object.fromEntries(list.map((p) => [p, digest(root, p)]));
  return {
    schemaVersion: 1,
    revision: spec.revision,
    inputs: hash(spec.inputs),
    captures: hash(spec.captures),
    judgments: spec.judgments,
    boundary:
      "Hashes detect changes after sealing, not whether captures depict inputs. Seal only after inspecting freshly rendered output. Judgments are reported, not certified.",
  };
}
export function verifyBundle(root, bundle) {
  if (!bundle || bundle.schemaVersion !== 1 || !text(bundle.revision))
    throw Error("Invalid review bundle");
  validateJudgments(bundle.judgments);
  const changed = [];
  for (const group of ["inputs", "captures"]) {
    if (!bundle[group] || typeof bundle[group] !== "object" || Array.isArray(bundle[group]))
      throw Error("Invalid bundle files");
    paths(Object.keys(bundle[group]), group);
    for (const [file, hash] of Object.entries(bundle[group])) {
      if (typeof hash !== "string" || !/^[a-f0-9]{64}$/.test(hash)) throw Error("Invalid digest");
      try {
        if (digest(root, file) !== hash) changed.push(file);
      } catch {
        changed.push(file);
      }
    }
  }
  for (const key of dimensions)
    for (const ref of bundle.judgments[key].evidence)
      if (!Object.hasOwn(bundle.inputs, ref) && !Object.hasOwn(bundle.captures, ref))
        throw Error("Unbound judgment evidence");
  return {
    current: changed.length === 0,
    changed,
    judgments: bundle.judgments,
    needsReview: dimensions.filter((k) => bundle.judgments[k].status !== "supported"),
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const [command, root, source, output] = process.argv.slice(2);
    if (!["seal", "verify"].includes(command) || !root || !source)
      throw Error("review-bundle.mjs seal ROOT SPEC OUTPUT | verify ROOT BUNDLE");
    const data = await readJSON(source);
    if (command === "seal") {
      if (!output) throw Error("Provide a new output path");
      fs.writeFileSync(output, JSON.stringify(sealBundle(root, data), null, 2) + "\n", {
        flag: "wx",
      });
    } else {
      const result = verifyBundle(root, data);
      console.log(JSON.stringify(result, null, 2));
      if (!result.current) process.exitCode = 1;
    }
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
