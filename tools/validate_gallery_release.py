"""Fail closed until every gallery example has current generation and visual-review evidence.
Run before publishing: python tools/validate_gallery_release.py MANIFEST.json
Hashes prove provenance and freshness, not aesthetic quality. Review is explicit human/agent evidence.
"""

import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def digest(path):
    data = path.read_bytes()
    if path.name in ("SKILL.md", "integrity.json"):
        data = data.replace(b"\r\n", b"\n")
    return hashlib.sha256(data).hexdigest()


def validate(manifest, root=ROOT):
    data = json.loads(Path(manifest).read_text(encoding="utf-8"))
    version = json.loads((root / "package.json").read_text())["version"]
    skill = root / "skills/dazzler-frontend"
    catalog = json.loads(
        (skill / "assets/templates/catalog.json").read_text(encoding="utf-8")
    )
    assert data["version"] == version, "Gallery must use the release version"
    assert data["runtimeSha256"] == digest(
        skill / "references/integrity.json"
    ), "Regenerate after runtime changes"
    assert data["skillSha256"] == digest(skill / "SKILL.md"), "Stale skill entrypoint"
    assert (
        data["previousVersion"] != version
    ), "Compare against the previous shipped version"
    expected = {x["id"] for x in catalog["templates"]}
    assert len(data["examples"]) == len(expected)
    assert {
        x["id"] for x in data["examples"]
    } == expected, "Every shipped example needs evidence"

    def artifact(entry):
        path = (root / entry["path"]).resolve()
        assert path.is_relative_to(root.resolve()), "Evidence must be repository-local"
        assert (
            path.is_file() and digest(path) == entry["sha256"]
        ), "Stale or missing evidence"
        return entry["sha256"]

    signatures = []
    for example in data["examples"]:
        assert (
            len(example["prompt"].strip()) >= 40
        ), "Retain the complete meaningful sample prompt"
        assert (
            example["generationMethod"] == "current-skill-from-prompt"
        ), "Preset reskins do not qualify"
        assert len(example["features"]) >= 3 and all(
            x.strip() for x in example["features"]
        ), "Exercise current capabilities"
        assert example["designRationale"].strip()
        assert example["artifactFiles"] and example["renderedPages"]
        for file in example["artifactFiles"]:
            artifact(file)
        item = next(x for x in catalog["templates"] if x["id"] == example["id"])
        target = skill / "assets/templates" / item["path"]
        required = (
            [target / name for name in item.get("files", [])]
            if target.is_dir()
            else [target]
        )
        recorded = {(root / f["path"]).resolve() for f in example["artifactFiles"]}
        assert required and all(
            p.resolve() in recorded for p in required
        ), "Evidence must cover the shipped artifact"
        current = [artifact(file) for file in example["renderedPages"]]
        previous = [artifact(file) for file in example["previousRenderedPages"]]
        assert previous and set(current).isdisjoint(
            previous
        ), "Unchanged renders are not a fresh gallery"
        review = example["visualReview"]
        for key in [
            "promptFit",
            "craft",
            "peerDistinction",
            "previousReleaseDistinction",
        ]:
            assert (
                review[key]["passed"] is True
                and len(review[key]["evidence"].strip()) >= 30
            ), key
        assert (
            len(review["structuralChanges"]) >= 3
        ), "Palette-only changes do not qualify"
        signature = tuple(
            example["composition"][key]
            for key in [
                "structure",
                "typography",
                "surface",
                "imageOrDataRole",
                "sequence",
            ]
        )
        assert all(
            sum(a != b for a, b in zip(signature, old)) >= 3 for old in signatures
        ), "Repeated composition across gallery peers"
        signatures.append(signature)
    return len(expected)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(
            "Provide the reviewed gallery manifest; legacy builders cannot certify a release."
        )
    print(
        "Gallery evidence passed:",
        validate(Path(sys.argv[1])),
        "examples. Visual judgments remain reviewer evidence, not a machine beauty score.",
    )
