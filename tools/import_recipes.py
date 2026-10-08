"""Import only retained recipe knowledge from an explicitly supplied local checkout."""

import argparse
import collections
import hashlib
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "skills/dazzler-frontend/references/recipes"
CONTEXTS = ("editorial", "commerce", "culture", "information", "software")


def digest(data):
    return hashlib.sha256(data).hexdigest()


def packed(value):
    return (
        json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n"
    ).encode()


def build(source):
    source = Path(source).resolve()
    names = [
        "evaluation/recipe-study/winners.json",
        "evaluation/recipe-study/summary.json",
        "evaluation/recipe-study/README.md",
        "guides/recipes/README.md",
        *[f"guides/recipes/{c}.md" for c in CONTEXTS],
        "LICENSE",
    ]
    dirty = subprocess.check_output(
        ["git", "status", "--porcelain"], cwd=source
    ).strip()
    if dirty:
        raise ValueError(
            "Recipe import requires a clean committed source; unpublished working data is not release eligible"
        )
    commit = subprocess.check_output(
        ["git", "rev-parse", "HEAD"], cwd=source, text=True
    ).strip()
    inputs = {
        n: subprocess.check_output(
            ["git", "cat-file", "blob", commit + ":" + n], cwd=source
        )
        for n in names
    }
    winners = json.loads(inputs[names[0]])
    summary = json.loads(inputs[names[1]])
    assert len(winners) == summary["winners"] == 1000
    assert len({r["id"] for r in winners}) == 1000
    counts = collections.Counter(r["context"] for r in winners)
    assert set(counts) == set(CONTEXTS)
    for context, count in counts.items():
        assert count == summary["byContext"][context]["winners"]
        guide = inputs[f"guides/recipes/{context}.md"].decode()
        assert sum(line.startswith("### R") for line in guide.splitlines()) == count
    revision = "sha256:" + digest(inputs[names[0]])
    index = []
    outputs = {}
    for r in winners:
        assert re.fullmatch(r"R[0-9]{4}", r["id"]), "Unsafe recipe ID"
        selection = r["selection"]
        votes = selection["judgments"]
        assert (
            selection["winner"]
            and selection["evidenceClass"] == "text-only-model-heuristic"
        )
        assert len(votes) == 3
        decoded = [v["decode"][v["answer"]["choice"]] for v in votes]
        assert decoded.count("winner") == selection["winnerVotes"] >= 2
        assert selection["stable"] == (selection["winnerVotes"] == 3)
        assert all(v["model"] == summary["model"] for v in votes)
        detail = {
            k: r[k]
            for k in (
                "id",
                "context",
                "brief",
                "palette",
                "fonts",
                "style",
                "arrangement",
                "structure",
                "affordance",
                "numeric",
                "prompt",
                "checks",
            )
        }
        detail["selection"] = {
            k: selection[k]
            for k in ("evidenceClass", "winnerVotes", "stable", "judgments")
        }
        data = packed(detail)
        outputs[f"details/{r['id']}.json"] = data
        index.append(
            {
                "id": r["id"],
                "context": r["context"],
                "style": r["style"],
                "arrangement": r["arrangement"],
                "affordance": r["affordance"],
                "fonts": [r["fonts"]["heading"], r["fonts"]["body"]],
                "fontCharacter": r["fonts"]["fontCharacter"],
                "palette": r["palette"],
                "numeric": r["numeric"],
                "winnerVotes": selection["winnerVotes"],
                "sha256": digest(data),
            }
        )
    outputs["index.json"] = packed({"schemaVersion": 1, "recipes": index})
    outputs["LICENSE.txt"] = inputs["LICENSE"].replace(b"\r\n", b"\n")
    provenance = {
        "schemaVersion": 1,
        "datasetRevision": revision,
        "repository": "https://github.com/jongos/style-science",
        "sourceCommit": commit,
        "sourceWorkingTreeModified": False,
        "sourcePublicationStatus": "committed; verify public availability before release",
        "sourceFiles": {n: digest(data) for n, data in inputs.items()},
        "license": "Apache-2.0",
        "model": summary["model"],
        "study": summary["study"],
        "tested": summary["tested"],
        "judgments": summary["judgments"],
        "retained": len(winners),
        "unanimous": summary["unanimousWinners"],
        "contexts": dict(counts),
        "indexSha256": digest(outputs["index.json"]),
        "limitations": [
            v.replace("per user instruction", "by project policy")
            for v in summary["limitations"]
        ],
        "omitted": "Rejected recipes, study executables, source factor indices and reference URL IDs are not shipped. URLs were uninspected inspiration clues, not visual evidence.",
    }
    outputs["provenance.json"] = packed(provenance)
    if DEST.exists():
        raise ValueError(
            "Recipe destination already exists; review an explicit migration before replacing it"
        )
    for name, data in outputs.items():
        target = DEST / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    assert all(
        subprocess.check_output(
            ["git", "cat-file", "blob", commit + ":" + n], cwd=source
        )
        == data
        for n, data in inputs.items()
    ), "Source changed during import"
    print(
        json.dumps(
            {
                "recipes": len(index),
                "bytes": sum(map(len, outputs.values())),
                "revision": revision,
            }
        )
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    build(parser.parse_args().source)
