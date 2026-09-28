"""Find a beginner prompt and its real capability requirements, entirely offline."""

import argparse
import json
from pathlib import Path


def select(starter_id=None, category=None):
    rows = json.loads(
        (Path(__file__).resolve().parents[1] / "references/starters.json").read_text(
            encoding="utf-8"
        )
    )["starters"]
    selected = [
        row
        for row in rows
        if (not starter_id or row["id"] == starter_id.upper())
        and (not category or row["category"] == category)
    ]
    if not selected:
        raise ValueError(
            "No matching starter; omit filters to list available IDs and categories"
        )
    return (
        selected
        if starter_id
        else [
            {key: row[key] for key in ("id", "category", "title", "prompt")}
            for row in selected
        ]
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--id")
    parser.add_argument("--category")
    args = parser.parse_args()
    try:
        print(json.dumps(select(args.id, args.category), indent=2))
    except ValueError as error:
        parser.exit(1, str(error) + "\n")
