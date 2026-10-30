"""Validate advertised release links separately from unreleased source metadata."""

import argparse
import json
import re
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
API = "https://api.github.com/repos/jongos/Dazzler"


def validate_remote(meta, release, tag):
    expected = "v" + meta["version"]
    if (
        release.get("tag_name") != expected
        or release.get("draft")
        or not release.get("published_at")
    ):
        raise ValueError("Advertised release is not published")
    if tag.get("ref") != "refs/tags/" + expected:
        raise ValueError("Advertised source tag does not exist")
    actual = {
        a["name"] for a in release.get("assets", []) if a.get("state") == "uploaded"
    }
    missing = set(meta["assets"]) - actual
    if missing:
        raise ValueError("Missing published assets: " + ", ".join(sorted(missing)))


def validate_links(root=ROOT, online=False):
    meta = json.loads((root / "maintenance/published-release.json").read_text())
    if not re.fullmatch(r"\d+\.\d+\.\d+", meta["version"]):
        raise ValueError("Invalid published version")
    files = [
        root / "README.md",
        root / "maintenance/ONBOARDING.md",
        root / "docs/index.html",
        root / "docs/guide.js",
        *list((root / "platforms").rglob("*.md")),
    ]
    for p in files:
        text = p.read_text(encoding="utf-8")
        for version in re.findall(
            r"(?:releases/(?:download|tag)/v|tree/v|--ref v|--version )(\d+\.\d+\.\d+)",
            text,
        ):
            if version != meta["version"]:
                raise ValueError("Unpublished or stale install version in " + str(p))
        for asset in re.findall(
            r"github\.com/jongos/Dazzler/releases/download/v[\d.]+/([\w.-]+)", text
        ):
            if asset not in meta["assets"]:
                raise ValueError("Unknown release asset: " + asset)
    if online:

        def get(path):
            request = Request(
                API + path,
                headers={
                    "User-Agent": "Dazzler-release-link-check",
                    "Accept": "application/vnd.github+json",
                },
            )
            with urlopen(request, timeout=15) as response:
                data = response.read(2_000_001)
            if len(data) > 2_000_000:
                raise ValueError("Release response too large")
            return json.loads(data)

        version = "v" + meta["version"]
        validate_remote(
            meta, get("/releases/tags/" + version), get("/git/ref/tags/" + version)
        )
    print(
        "Published release links passed:",
        meta["version"],
        "live" if online else "snapshot only",
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--online", action="store_true")
    validate_links(online=parser.parse_args().online)
