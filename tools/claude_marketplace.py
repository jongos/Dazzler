"""Generate or verify the release-pinned Claude archive marketplace manifest."""

import argparse
import hashlib
import json
import re
from urllib.request import urlopen
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def generate(packages, check=False):
    version = json.loads((ROOT / "package.json").read_text())["version"]
    archive = Path(packages) / "dazzler-claude-plugin.zip"
    manifest = {
        "name": "dazzler",
        "description": "Automatic typography, color, interfaces, charts and document design.",
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


def check_published():
    """Verify the advertised archive without requiring an unreleased source pin."""
    manifest = json.loads((ROOT / ".claude-plugin/marketplace.json").read_text())
    source = manifest["plugins"][0]["source"]
    url = source["url"]
    if source.get("source") != "archive" or not re.fullmatch(
        r"https://github\.com/jongos/Dazzler/releases/download/v[0-9]+\.[0-9]+\.[0-9]+/dazzler-claude-plugin\.zip",
        url,
    ):
        raise ValueError("Marketplace must reference a versioned Dazzler release")
    if not re.fullmatch(r"[a-f0-9]{64}", source.get("sha256", "")):
        raise ValueError("Marketplace requires a SHA256 digest")
    digest = hashlib.sha256()
    size = 0
    with urlopen(url, timeout=60) as response:
        while chunk := response.read(1024 * 1024):
            size += len(chunk)
            if size > 64 * 1024 * 1024:
                raise ValueError("Published archive exceeds verification limit")
            digest.update(chunk)
    if size == 0 or digest.hexdigest() != source["sha256"]:
        raise ValueError("Published archive differs from marketplace digest")
    print("Published Claude marketplace archive verified")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("packages", type=Path, nargs="?")
    parser.add_argument("--published", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.published:
        if args.packages or args.check:
            parser.error("--published cannot be combined with packages or --check")
        check_published()
    elif args.packages:
        generate(args.packages, args.check)
    else:
        parser.error("packages or --published is required")
