// Maintenance-only: compare pinned upstream guidance hashes and local bundles.
// Skill invocation must not run this with --online.
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILL = path.join(REPO, "skills/dazzler-frontend");

const shaLf = (text) => createHash("sha256").update(text.replaceAll("\r\n", "\n")).digest("hex");

const isSha = (value) => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);

function parseGithubRepo(url) {
  const match = String(url).match(/github\.com\/([^/]+)\/([^/.]+)/i);
  return match ? { owner: match[1], repo: match[2] } : null;
}

function checksFromProvenance(record, provenancePath) {
  const repo =
    parseGithubRepo(record.repository) ??
    parseGithubRepo(record.reviewedRepository) ??
    parseGithubRepo(record.source);
  if (!repo || !record.commit) {
    return { error: `Missing repository or commit in ${provenancePath}` };
  }
  const files = [];
  if (record.source_inventory) {
    for (const item of record.source_inventory) {
      files.push({ path: item.path, expectedSha256: item.sha256 });
    }
  }
  if (record.sourceSha256Lf) {
    for (const [filePath, digest] of Object.entries(record.sourceSha256Lf)) {
      files.push({ path: filePath, expectedSha256: digest });
    }
  }
  return {
    label: provenancePath,
    owner: repo.owner,
    repo: repo.repo,
    commit: record.commit,
    files,
  };
}

async function loadManifest() {
  const manifest = JSON.parse(
    await readFile(path.join(SKILL, "references/adaptation-sources.json"), "utf8"),
  );
  return manifest;
}

async function localBundleChecks(manifest) {
  const results = [];
  for (const entry of manifest.vendoredRuntimes ?? []) {
    const provenance = JSON.parse(await readFile(path.join(SKILL, entry.provenance), "utf8"));
    const bundlePath = path.join(SKILL, entry.bundle);
    const bytes = await readFile(bundlePath);
    const actual = createHash("sha256").update(bytes).digest("hex");
    const bundleName = path.basename(entry.bundle);
    const expected = provenance.sha256 ?? provenance.files?.[bundleName];
    results.push({
      kind: "bundle",
      id: entry.id,
      bundle: entry.bundle,
      expectedSha256: expected,
      actualSha256: actual,
      status: expected && actual === expected ? "match" : "drift",
    });
  }
  return results;
}

async function structureChecks(manifest) {
  const checks = [];
  const errors = [];
  for (const entry of manifest.guidanceAdaptations ?? []) {
    const provenancePath = path.join(SKILL, entry.provenance);
    const record = JSON.parse(await readFile(provenancePath, "utf8"));
    const parsed = checksFromProvenance(record, entry.provenance);
    if (parsed.error) {
      errors.push(parsed.error);
      continue;
    }
    for (const file of parsed.files) {
      if (!isSha(file.expectedSha256)) {
        errors.push(`Invalid sha256 for ${file.path} in ${entry.provenance}`);
      }
    }
    checks.push(parsed);
  }
  return { checks, errors };
}

async function onlineChecks(checks) {
  const drift = [];
  const skipped = [];
  for (const group of checks) {
    for (const file of group.files) {
      const url = `https://raw.githubusercontent.com/${group.owner}/${group.repo}/${group.commit}/${file.path}`;
      let response;
      try {
        response = await fetch(url, { redirect: "follow" });
      } catch (error) {
        skipped.push({ url, reason: String(error) });
        continue;
      }
      if (!response.ok) {
        drift.push({
          source: group.label,
          path: file.path,
          url,
          issue: `HTTP ${response.status}`,
        });
        continue;
      }
      const actual = shaLf(await response.text());
      if (actual !== file.expectedSha256) {
        drift.push({
          source: group.label,
          path: file.path,
          url,
          expectedSha256: file.expectedSha256,
          actualSha256: actual,
        });
      }
    }
  }
  return { drift, skipped };
}

async function main() {
  const online = process.argv.includes("--online");
  const manifest = await loadManifest();
  const { checks, errors } = await structureChecks(manifest);
  const bundles = await localBundleChecks(manifest);

  const report = {
    mode: online ? "online" : "local",
    skillInvocationFetchesUpstream: manifest.skillInvocationFetchesUpstream,
    guidanceFilesPinned: checks.reduce((n, group) => n + group.files.length, 0),
    bundles,
    errors,
  };

  if (online) {
    const remote = await onlineChecks(checks);
    report.upstream = remote;
  } else {
    report.note =
      "Local mode validates pins and bundle hashes only. Run with --online during maintenance to compare upstream files.";
  }

  console.log(JSON.stringify(report, null, 2));

  const bundleFail = bundles.some((item) => item.status !== "match");
  const structureFail = errors.length > 0;
  const remoteFail = online && report.upstream?.drift?.length > 0;
  process.exit(bundleFail || structureFail || remoteFail ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
