"""Run prepared Phase 1 trials through automatic approval after a successful preflight."""

import argparse
import json
from pathlib import Path

from compare_value import digest, inventory, run, write_manifest, trace_summary


def check_preflight(folder):
    events = folder / "events.jsonl"
    raw = events.read_text(encoding="utf-8-sig")
    parsed = [json.loads(line) for line in raw.splitlines() if line.strip()]
    successes = [
        e["item"]
        for e in parsed
        if e.get("type") == "item.completed"
        and e.get("item", {}).get("type") == "command_execution"
        and e["item"].get("exit_code") == 0
    ]
    if (
        not trace_summary(raw)["turnCompleted"]
        or len(successes) < 2
        or not any("READY" in e.get("aggregated_output", "") for e in successes)
        or (folder / "probe.txt").read_text().strip() != "READY"
    ):
        raise ValueError(
            "Preflight needs successful traced write/read and actual READY file"
        )
    if (
        "blocked by policy"
        in (folder / "stderr.txt").read_text(encoding="utf-8-sig").lower()
    ):
        raise ValueError("Preflight contains a policy denial")
    return {
        "eventsSha256": digest(events),
        "probeSha256": digest(folder / "probe.txt"),
        "stderrSha256": digest(folder / "stderr.txt"),
        "mode": "automatic-review",
    }


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--preflight", type=Path, required=True)
    p.add_argument("--limit", type=int)
    args = p.parse_args()
    out = args.out.resolve()
    manifest = json.loads((out / "manifest.json").read_text())
    evidence = check_preflight(args.preflight.resolve())
    if inventory(out / "skill/dazzler-frontend") != json.loads(
        (out / "skill-inventory.json").read_text()
    ):
        raise ValueError("Frozen skill changed")
    if inventory(out / "shared-fonts") != manifest["sharedFontsInventory"]:
        raise ValueError("Shared font assets changed")
    if digest(out / "suite.json") != manifest["suiteSha256"]:
        raise ValueError("Suite changed")
    if (
        any(t["status"] != "not-run" for t in manifest["trials"])
        and manifest.get("hostApprovalMode") != "automatic-review"
    ):
        raise ValueError("Do not mix approval modes in an existing run")
    manifest.update(
        hostApprovalMode="automatic-review",
        generationGate="preflight-passed",
        preflightEvidence=evidence,
    )
    write_manifest(out, manifest)
    run(out, manifest, "codex", args.limit)


if __name__ == "__main__":
    main()
