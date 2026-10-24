"""Prepare neutral rendered review copies; never infer a human rating or run inference."""

import argparse
import json
from pathlib import Path
import random
import shutil


def build(run, captures, destination, rng=None):
    run, captures, destination = map(Path, (run, captures, destination))
    manifest = json.loads((run / "manifest.json").read_text(encoding="utf-8"))
    suite = json.loads((run / "suite.json").read_text(encoding="utf-8"))
    briefs = {c["id"]: c["prompt"] for c in suite["cases"]}
    pairs = {}
    for t in manifest["trials"]:
        if not t.get("eligibleForReview") or t["status"] != "completed":
            raise ValueError(
                "All attempts must be retained and complete before blind packing"
            )
        if Path(t["folder"]).name != t["folder"] or t["arm"] not in [
            "baseline",
            "dazzler",
        ]:
            raise ValueError("Invalid trial identity")
        key = (t["id"], t["repetition"])
        pair = pairs.setdefault(key, {})
        if t["arm"] in pair:
            raise ValueError("Duplicate arm")
        pair[t["arm"]] = t
    if any(set(p) != {"baseline", "dazzler"} for p in pairs.values()):
        raise ValueError("Each repetition needs both arms")
    rng = rng or random.SystemRandom()
    jobs = []
    mapping = []
    forms = []
    for index, ((brief, rep), pair) in enumerate(pairs.items(), 1):
        case = f"case-{index:02d}"
        arms = list(pair)
        rng.shuffle(arms)
        forms.append(
            {
                "case": case,
                "brief": briefs[brief],
                "status": "awaiting-human-review",
                "taskFit": None,
                "hierarchy": None,
                "legibility": None,
                "distinctiveness": None,
                "overall": None,
                "reason": None,
                "observedProblems": [],
            }
        )
        for label, arm in zip(["A", "B"], arms):
            t = pair[arm]
            folder = captures / t["folder"]
            names = (
                ["full-1440.png", "full-390.png"]
                if t["format"] in ["website", "application"]
                else ["artifact.pdf"]
            )
            for number, name in enumerate(names, 1):
                src = folder / name
                if not src.is_file():
                    raise ValueError(f"Missing independent render: {src}")
                jobs.append(
                    (src, Path("review") / case / f"{label}-{number}{src.suffix}")
                )
            mapping.append(
                {
                    "case": case,
                    "label": label,
                    "arm": arm,
                    "brief": brief,
                    "repetition": rep,
                }
            )
    destination.mkdir(parents=True, exist_ok=False)
    for src, relative in jobs:
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, target)
    (destination / "private").mkdir()
    (destination / "private/mapping.json").write_text(
        json.dumps(mapping, indent=2), encoding="utf-8"
    )
    (destination / "review/ratings.json").write_text(
        json.dumps(forms, indent=2), encoding="utf-8"
    )
    (destination / "review/INSTRUCTIONS.txt").write_text(
        "Review rendered artifacts and the brief only. Choose A, B or tie for each criterion; explain visible reasons. "
        "Do not inspect source, metadata, private mapping or original trial paths. Record actual human identity and date separately. "
        "No rating is prefilled. Screenshots do not establish interaction behavior. Do not infer accessibility or factual accuracy from visual polish. "
        "The administrator must keep private/ outside the material supplied to reviewers.\n",
        encoding="utf-8",
    )
    return len(pairs)


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--run", required=True, type=Path)
    p.add_argument("--captures", required=True, type=Path)
    p.add_argument("--out", required=True, type=Path)
    a = p.parse_args()
    print("Blind pairs:", build(a.run, a.captures, a.out))
