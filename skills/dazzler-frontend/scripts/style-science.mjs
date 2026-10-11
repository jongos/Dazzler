// Dazzler's offline boundary around the pinned Style Science consumer. Apache-2.0.
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { readJSON } from "./runtime.mjs";
import { cli } from "./cli.mjs";
import { inspectDistribution, negotiate } from "./gdc/consumer.mjs";
const directory = fileURLToPath(new URL("./gdc/", import.meta.url));
const fallback = "Use Dazzler's existing design rules and native rendered checks";
const boundary = {
  automaticAction: false,
  releaseEligible: false,
  networkRequired: false,
  nativeReviewRequired: true,
};

export async function reviewScience(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw Error("Expected a review object");
  const operation = input.operation ?? "capabilities";
  const fields = {
    capabilities: ["operation", "request"],
    decision: ["operation", "plan", "snapshots", "contract", "observations"],
    comparison: ["operation", "plan", "baseline", "candidate", "spec"],
  };
  if (
    !Object.hasOwn(fields, operation) ||
    Object.keys(input).some((k) => !fields[operation].includes(k))
  )
    throw Error("Unsupported operation or fields");
  if (Number(process.versions.node.split(".")[0]) < 22)
    return {
      ...boundary,
      status: "unsupported",
      reason: "This optional consumer requires Node 22 or newer",
      fallback,
    };
  let expected;
  try {
    expected = await readJSON(path.join(directory, "provenance.json"));
  } catch {
    return {
      ...boundary,
      status: "invalid",
      reason: "Missing or malformed local provenance",
      fallback,
    };
  }
  const inspection = await inspectDistribution(directory, expected);
  if (inspection.status !== "verified")
    return { ...boundary, status: inspection.status, reason: inspection.reason, fallback };
  if (operation === "capabilities")
    return {
      ...negotiate(
        inspection,
        input.request ?? {
          contractVersion: "1.0.0",
          planSchema: 1,
          modules: ["core", "decision", "canvas"],
          checks: [],
        },
      ),
      ...boundary,
      sourceRevision: inspection.sourceRevision,
    };
  let evidence;
  if (operation === "decision") {
    const { reviewCandidate } = await import("./gdc/decision.mjs");
    evidence = reviewCandidate(input.plan, input.snapshots, input.contract, input.observations);
  } else {
    const { compareCanvas } = await import("./gdc/canvas.mjs");
    evidence = compareCanvas(input.plan, input.baseline, input.candidate, input.spec);
  }
  return {
    status: evidence.status,
    operation,
    sourceRevision: inspection.sourceRevision,
    evidence,
    ...boundary,
    limitation:
      "Model eligibility is an evidence classification, not permission to ship or a probability of beauty. Measurement bounds are not statistical confidence.",
    fallback,
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await cli(
    "node style-science.mjs [--input review.json]",
    { input: { type: "string" } },
    async ({ input }) => {
      console.log(JSON.stringify(await reviewScience(input ? await readJSON(input) : {}), null, 2));
    },
  );
}
