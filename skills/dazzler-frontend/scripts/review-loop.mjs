// Execute existing scoped checks; never edits the reviewed source or invents review passes.
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { writeFile, realpath } from "node:fs/promises";
import { createRequire } from "node:module";
import { readJSON, readLimited, createOutput } from "./runtime.mjs";
import { planWorkflow } from "./workflow.mjs";
import { renderFeedback } from "./review-feedback.mjs";
const { audit } = createRequire(import.meta.url)("./browser.cjs");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");

export function summarize(plan, result, revision, sourceStable) {
  const count = result.reports.reduce((n, r) => n + r.findings.length + r.designReview.length, 0);
  const gaps = result.reports.some(
    (r) => r.truncated || r.notRun?.length || r.compositionLimitReached,
  );
  return {
    schemaVersion: 1,
    revision,
    status: !sourceStable
      ? "stale"
      : result.pageErrors.length
        ? "blocked"
        : count
          ? "findings"
          : gaps
            ? "incomplete"
            : "review-needed",
    candidateCount: count,
    sourceStable,
    readOnly: plan.readOnly,
    nextAction: !sourceStable
      ? "Source changed during capture; discard this evidence and rerun."
      : plan.readOnly
        ? "Report candidates and remaining checks; do not edit the project."
        : count
          ? "Inspect applicability and task impact, repair source, then rerun with a new revision."
          : "Complete the remaining visual and interaction review; a clean scan is not approval.",
    remainingChecks: plan.checks.map((c) => ({
      id: c.id,
      status: "not-run",
      detail: c.detail ?? c.instruction ?? "Requires actual review beyond this bounded scan",
    })),
    limits:
      "Execution proves these helpers ran. Supplied file hashes cover only the named files, not every dependency or server state. No finding is automatically resolved and no aesthetic quality is certified.",
  };
}

export async function runReview(input, destination) {
  const allowed = [
    "task",
    "target",
    "revision",
    "files",
    "widths",
    "height",
    "primaryTargets",
    "previous",
  ];
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input) ||
    Object.keys(input).some((k) => !allowed.includes(k))
  )
    throw Error("Invalid review configuration");
  for (const key of ["target", "revision"])
    if (typeof input[key] !== "string" || !input[key].trim() || input[key].length > 2000)
      throw Error("Provide " + key);
  const plan = planWorkflow(input.task ?? {});
  if (plan.task.kind !== "interface")
    throw Error(
      "Use native document/slide rendering and workflow assessment for this format; browser evidence is not native validation",
    );
  if (
    !Array.isArray(input.files) ||
    input.files.length < 1 ||
    input.files.length > 64 ||
    input.files.some((f) => typeof f !== "string" || !f.trim())
  )
    throw Error("Name 1–64 source files for revision binding");
  const files = await Promise.all(input.files.map((f) => realpath(f)));
  if (new Set(files).size !== files.length) throw Error("Duplicate source paths");
  const snapshot = async () => {
    const entries = [];
    for (const f of files) entries.push([f, hash(await readLimited(f))]);
    return Object.fromEntries(entries);
  };
  const before = await snapshot();
  let previous = null;
  if (input.previous) {
    previous = await readJSON(input.previous);
    if (
      previous.schemaVersion !== 1 ||
      previous.target !== input.target ||
      previous.revision === input.revision ||
      !previous.sources ||
      !previous.summary ||
      typeof previous.summary.candidateCount !== "number"
    )
      throw Error("Previous run must be a matching review with a different revision");
  }
  const out = await createOutput(destination);
  await writeFile(path.join(out, "plan.json"), JSON.stringify(plan, null, 2));
  try {
    const result = await audit("audit", input.target, out, {
      widths: input.widths,
      height: input.height,
      primaryTargets: input.primaryTargets,
      revision: input.revision,
    });
    const after = await snapshot();
    const summary = summarize(
      plan,
      result,
      input.revision,
      JSON.stringify(before) === JSON.stringify(after),
    );
    const record = {
      schemaVersion: 1,
      target: input.target,
      revision: input.revision,
      sources: before,
      summary,
      previous: previous
        ? {
            revision: previous.revision,
            candidateCount: previous.summary.candidateCount,
            note: "Historical count only; locations and findings are not stable identities across revisions.",
          }
        : null,
    };
    await writeFile(path.join(out, "review-run.json"), JSON.stringify(record, null, 2));
    await writeFile(path.join(out, "report.html"), renderFeedback(result, summary));
    return record;
  } catch (error) {
    await writeFile(
      path.join(out, "review-run.json"),
      JSON.stringify(
        {
          schemaVersion: 1,
          target: input.target,
          revision: input.revision,
          sources: before,
          status: "blocked",
          reason: String(error.message).slice(0, 2000),
        },
        null,
        2,
      ),
    );
    throw error;
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    if (process.argv.length !== 4) throw Error("Use review-loop.mjs INPUT.json NEW_DIRECTORY");
    console.log(
      JSON.stringify(await runReview(await readJSON(process.argv[2]), process.argv[3]), null, 2),
    );
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
