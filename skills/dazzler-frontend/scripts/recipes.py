"""Offline advisory recipe discovery. Never generates UI or overrides project tokens."""

import argparse
import hashlib
import json
import math
from pathlib import Path
import re

DATA = Path(__file__).resolve().parents[1] / "references/recipes"
CONTEXTS = ("editorial", "commerce", "culture", "information", "software")
NOTICE = "Text-only model heuristics, not aesthetic probabilities or rendered validation. Adapted output is derived and untested until reviewed."
STOP = set(
    "a an the and or for to of with in on is are this that use build design page site".split()
)


def read(path, limit):
    with Path(path).open("rb") as stream:
        data = stream.read(limit + 1)
    if len(data) > limit:
        raise ValueError("Recipe data exceeds size limit")
    return data


def sha(data):
    return hashlib.sha256(data).hexdigest()


def words(text):
    return set(re.findall(r"[a-z0-9]+", text.lower())) - STOP


def load_index(root=DATA):
    root = Path(root)
    provenance = json.loads(read(root / "provenance.json", 32_000))
    data = read(root / "index.json", 1_500_000)
    if sha(data) != provenance["indexSha256"]:
        raise ValueError("Recipe index hash mismatch")
    index = json.loads(data)
    rows = index["recipes"]
    if index["schemaVersion"] != 1 or not isinstance(rows, list) or len(rows) != 1000:
        raise ValueError("Unsupported recipe index")
    ids = set()
    for r in rows:
        if (
            not re.fullmatch(r"R[0-9]{4}", r["id"])
            or r["id"] in ids
            or r["context"] not in CONTEXTS
        ):
            raise ValueError("Invalid recipe identity")
        if r["winnerVotes"] not in (2, 3) or not re.fullmatch(
            r"[a-f0-9]{64}", r["sha256"]
        ):
            raise ValueError("Invalid recipe evidence")
        ids.add(r["id"])
    return provenance, rows


def lookup(recipe_id, root=DATA):
    if not isinstance(recipe_id, str) or not re.fullmatch(r"R[0-9]{4}", recipe_id):
        raise ValueError("Use a recipe ID such as R0001")
    provenance, rows = load_index(root)
    row = next((r for r in rows if r["id"] == recipe_id), None)
    if row is None:
        return {
            "status": "no-match",
            "fallback": "Continue Dazzler's normal design workflow.",
        }
    data = read(Path(root) / "details" / (recipe_id + ".json"), 24_000)
    if sha(data) != row["sha256"]:
        raise ValueError("Recipe detail hash mismatch")
    detail = json.loads(data)
    if detail["id"] != recipe_id or detail["context"] != row["context"]:
        raise ValueError("Recipe detail identity mismatch")
    return {
        "status": "ok",
        "datasetRevision": provenance["datasetRevision"],
        "notice": NOTICE,
        "recipe": detail,
    }


def validate_request(request):
    allowed = {
        "contexts",
        "brief",
        "audience",
        "content",
        "interactions",
        "brand",
        "existingSystem",
        "preferArrangements",
        "requireArrangements",
        "limit",
    }
    if not isinstance(request, dict) or set(request) - allowed:
        raise ValueError("Unknown recipe request fields")
    contexts = request.get("contexts", [])
    if (
        not isinstance(contexts, list)
        or len(contexts) > 5
        or any(c not in CONTEXTS for c in contexts)
    ):
        raise ValueError("Use known recipe contexts")
    for key in (
        "brief",
        "audience",
        "content",
        "interactions",
        "brand",
        "existingSystem",
    ):
        if (
            not isinstance(request.get(key, ""), str)
            or len(request.get(key, "")) > 4000
        ):
            raise ValueError("Brief fields must be strings of at most 4000 characters")
    if not request.get("brief", "").strip():
        raise ValueError("A meaningful brief is required")
    for key in ("preferArrangements", "requireArrangements"):
        value = request.get(key, [])
        if (
            not isinstance(value, list)
            or len(value) > 10
            or any(not isinstance(x, str) or len(x) > 80 for x in value)
        ):
            raise ValueError("Arrangement choices must be short string lists")
    if (
        type(request.get("limit", 3)) is not int
        or not 1 <= request.get("limit", 3) <= 5
    ):
        raise ValueError("Shortlists contain one to five recipes")


def difference(a, b):
    # Surface colors, type pairing and structure must vary, not just recipe IDs.
    def distance(x, y):
        return math.sqrt(
            sum((int(x[i : i + 2], 16) - int(y[i : i + 2], 16)) ** 2 for i in (1, 3, 5))
        )

    palette = (
        max(
            distance(a["palette"][k], b["palette"][k])
            for k in ("background", "accent", "surface")
        )
        >= 100
    )
    return (
        int(palette)
        + int(a["fonts"] != b["fonts"])
        + int(a["arrangement"] != b["arrangement"])
    )


def shortlist(request, root=DATA):
    validate_request(request)
    provenance, rows = load_index(root)
    if not request.get("contexts"):
        return {
            "status": "no-match",
            "candidates": [],
            "fallback": "Infer a relevant context from the task or use the normal workflow; do not force an unrelated recipe.",
        }
    query = words(
        " ".join(
            request.get(k, "")
            for k in (
                "brief",
                "audience",
                "content",
                "interactions",
                "brand",
                "existingSystem",
            )
        )
    )
    task = words(request.get("interactions", "") + " " + request.get("content", ""))
    candidates = []
    for r in rows:
        if r["context"] not in request["contexts"]:
            continue
        if (
            request.get("requireArrangements")
            and r["arrangement"] not in request["requireArrangements"]
        ):
            continue
        terms = words(
            " ".join(
                [
                    r["style"],
                    r["arrangement"],
                    r["affordance"],
                    r["fontCharacter"],
                    *r["fonts"],
                    r["palette"]["name"],
                ]
            )
        )
        matches = sorted(query & terms)
        fit = len(matches) + 2 * len(
            task & words(r["affordance"] + " " + r["arrangement"])
        )
        if r["arrangement"] in request.get("preferArrangements", []):
            fit += 6
        if not fit:
            continue
        tie = sha((json.dumps(request, sort_keys=True) + r["id"]).encode())
        candidates.append((r, fit, matches, tie))
    chosen = []
    while candidates and len(chosen) < request.get("limit", 3):
        eligible = [
            c
            for c in candidates
            if all(difference(c[0], old[0]) >= 2 for old in chosen)
        ]
        if not eligible:
            break
        # Relevance precedes diversity, agreement and brief-seeded tie breaking.
        selected = max(
            eligible,
            key=lambda c: (
                c[1],
                min((difference(c[0], old[0]) for old in chosen), default=0),
                c[0]["winnerVotes"],
                c[3],
            ),
        )
        chosen.append(selected)
        candidates.remove(selected)
    result = []
    for row, _, matched, _ in chosen:
        result.append(
            {
                "id": row["id"],
                "context": row["context"],
                "style": row["style"],
                "arrangement": row["arrangement"],
                "palette": row["palette"],
                "fonts": row["fonts"],
                "sourceAgreement": f"{row['winnerVotes']}/3 correlated model presentations",
                "rationale": {
                    "matchedTerms": matched,
                    "preferredArrangement": row["arrangement"]
                    in request.get("preferArrangements", []),
                    "context": row["context"],
                },
            }
        )
    return {
        "status": "ok" if result else "no-match",
        "datasetRevision": provenance["datasetRevision"],
        "notice": NOTICE,
        "candidates": result,
        "selectionMethod": "Lexical retrieval and structural diversity; agent must judge actual task fit. No popularity, context-count weighting or calibrated confidence.",
        "constraints": "Brand, audience, content, interaction requirements and existing system remain authoritative. Suggestions do not alter tokens or apply fonts.",
        "fallback": "Use fewer candidates or the normal font/color/composition workflow when no suitable recipe fits; never relax explicit constraints.",
    }


def record(request, root=DATA):
    if not isinstance(request, dict) or set(request) != {
        "recipeId",
        "rationale",
        "adaptations",
    }:
        raise ValueError("A derivation needs recipeId, rationale and adaptations")
    if (
        not isinstance(request["rationale"], str)
        or not 20 <= len(request["rationale"]) <= 4000
    ):
        raise ValueError("Record a specific selection rationale")
    changes = request["adaptations"]
    if (
        not isinstance(changes, list)
        or not 1 <= len(changes) <= 30
        or any(not isinstance(x, str) or not 1 <= len(x) <= 1000 for x in changes)
    ):
        raise ValueError("Record adaptations or explicitly state what was retained")
    found = lookup(request["recipeId"], root)
    if found["status"] != "ok":
        return found
    return {
        "status": "ok",
        "recipeId": request["recipeId"],
        "datasetRevision": found["datasetRevision"],
        "rationale": request["rationale"],
        "adaptations": changes,
        "relationship": "derived-from-recipe",
        "implementationValidation": "not-run",
        "notice": NOTICE,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("contexts", "shortlist", "get", "record"))
    parser.add_argument("value", nargs="?")
    args = parser.parse_args()
    try:
        if args.command == "contexts":
            result = {"contexts": list(CONTEXTS), "notice": NOTICE}
        elif args.command == "get":
            result = lookup(args.value)
        else:
            if not args.value:
                parser.error("Supply a local JSON request file")
            request = json.loads(read(args.value, 32_000))
            if args.command == "shortlist":
                validate_request(request)
            result = (shortlist if args.command == "shortlist" else record)(request)
    except (OSError, ValueError, KeyError, TypeError) as error:
        result = {
            "status": "unavailable",
            "reason": str(error),
            "fallback": "Use Dazzler's existing font, color and composition workflow. Do not claim recipe validation.",
        }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
