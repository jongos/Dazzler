"""Observe comparison evidence without changing trial outputs or runner state."""

import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import time


def snapshot(root):
    manifest = json.loads((root / "manifest.json").read_text(encoding="utf-8"))
    trials = []
    for trial in manifest["trials"]:
        folder = root / trial["folder"]
        log = folder / "events.jsonl"
        events = []
        if log.exists():
            for line in log.read_text(
                encoding="utf-8-sig", errors="replace"
            ).splitlines():
                try:
                    events.append(json.loads(line))
                except ValueError:
                    pass  # The live writer may not have finished its last line.
        ended = any(e.get("type") in ["turn.completed", "turn.failed"] for e in events)
        status = trial["status"]
        terminal = status not in ["not-run", "running"]
        if not terminal and events:
            status = "finalizing" if ended else "running"
        present = [
            name
            for name in trial.get("requiredOutputs", ["index.html"])
            if (folder / name).is_file() and (folder / name).stat().st_size
        ]
        last = events[-1] if events else {}
        item = last.get("item", {})
        # A heartbeat is the observer's liveness, not proof the child is making progress.
        trials.append(
            {
                "id": trial["id"],
                "arm": trial["arm"],
                "status": status,
                "outputsPresent": present,
                "events": len(events),
                "lastEvent": last.get("type"),
                "lastItem": item.get("type"),
                "lastActivityAt": (
                    datetime.fromtimestamp(
                        log.stat().st_mtime, timezone.utc
                    ).isoformat()
                    if log.exists()
                    else None
                ),
                "eligibleForReview": trial.get("eligibleForReview", False),
                "reviewStatus": trial.get("reviewStatus", "not-run"),
            }
        )
    pairs = {}
    for trial in trials:
        pairs.setdefault(trial["id"], []).append(trial)
    return {
        "observedAt": datetime.now(timezone.utc).isoformat(),
        "completedTrials": sum(t["status"] == "completed" for t in trials),
        "readyPairs": sum(
            len(pair) == 2 and all(t["eligibleForReview"] for t in pair)
            for pair in pairs.values()
        ),
        "agentReviewedPairs": sum(
            len(pair) == 2
            and all(t["reviewStatus"] == "informed-agent-reviewed" for t in pair)
            for pair in pairs.values()
        ),
        "totalTrials": len(trials),
        "trials": trials,
        "note": "Running is inferred from unfinished event logs; consult process liveness if activity stalls. Validation and review remain separate from generation.",
    }


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("root", type=Path)
    p.add_argument("--watch", action="store_true")
    args = p.parse_args()
    previous = None
    while True:
        try:
            result = snapshot(args.root)
        except json.JSONDecodeError:
            if not args.watch:
                raise
            time.sleep(1)
            continue
        target = args.root / "progress.json"
        temporary = target.with_suffix(".tmp")
        temporary.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
        temporary.replace(target)
        state = [
            (t["id"], t["arm"], t["status"], t["outputsPresent"])
            for t in result["trials"]
        ]
        if state != previous:
            print(
                json.dumps({k: v for k, v in result.items() if k != "trials"}),
                flush=True,
            )
            for trial in result["trials"]:
                if trial["status"] != "not-run":
                    print(
                        trial["id"],
                        trial["arm"],
                        trial["status"],
                        trial["outputsPresent"],
                        trial["lastItem"],
                        flush=True,
                    )
            previous = state
        if not args.watch or all(
            t["status"] not in ["not-run", "running", "finalizing"]
            for t in result["trials"]
        ):
            break
        time.sleep(15)


if __name__ == "__main__":
    main()
