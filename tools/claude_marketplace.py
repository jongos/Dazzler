"""Generate or verify the release-pinned Claude archive marketplace manifest."""

import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def generate(packages, check=False):
    version = json.loads((ROOT / "package.json").read_text())["version"]
    archive = Path(packages) / "dazzler-claude-plugin.zip"
    manifest = {
        "name": "dazzler",
        "owner": {"name": "Jon Gosier", "email": "jon@filmhedge.com"},
        "plugins": [
            {
                "name": "dazzler",
                "description": "Automatic typography, color, interfaces, charts and document design",
                "source": {
                    "source": "archive",
                    "url": f"https://github.com/jongos/Dazzler/releases/download/v{version}/{archive.name}",
                    "sha256": hashlib.sha256(archive.read_bytes()).hexdigest(),
                },
            }
        ],
    }
    path = ROOT / ".claude-plugin/marketplace.json"
    if check:
        if json.loads(path.read_text(encoding="utf-8")) != manifest:
            raise ValueError("Marketplace differs from the built release archive")
    else:
        path.parent.mkdir(exist_ok=True)
        path.write_text(
            json.dumps(manifest, indent=2) + "\n", encoding="utf-8", newline="\n"
        )
    print(
        "Claude marketplace archive pin verified"
        if check
        else "Claude marketplace generated"
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("packages", type=Path)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    generate(args.packages, args.check)
