import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location(
    "gallery_gate",
    Path(__file__).resolve().parents[1] / "tools/validate_gallery_release.py",
)
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)


class GalleryReleaseTests(unittest.TestCase):
    def test_release_requires_current_artifact_and_real_comparison_evidence(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)

            def save(name, data):
                p = root / name
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_text(data, encoding="utf-8")
                return {"path": name, "sha256": gate.digest(p)}

            save("package.json", '{"version":"1.0.0"}')
            prefix = "skills/dazzler-frontend/"
            runtime = save(prefix + "references/integrity.json", "{}")
            skill = save(prefix + "SKILL.md", "current skill")
            save(
                prefix + "assets/templates/catalog.json",
                '{"templates":[{"id":"sample","path":"sample.html"}]}',
            )
            artifact = save(prefix + "assets/templates/sample.html", "original design")
            current = save("review/current.png", "current render fixture")
            previous = save("review/previous.png", "previous render fixture")
            review = {
                k: {
                    "passed": True,
                    "evidence": "Reviewer compared the actual page structure and hierarchy.",
                }
                for k in [
                    "promptFit",
                    "craft",
                    "peerDistinction",
                    "previousReleaseDistinction",
                ]
            }
            review["structuralChanges"] = [
                "new sequence",
                "new grid",
                "new type hierarchy",
            ]
            example = {
                "id": "sample",
                "prompt": "Create an expressive fictional report with a yellow field and editable evidence.",
                "generationMethod": "current-skill-from-prompt",
                "features": ["color", "typography", "chart"],
                "designRationale": "A clear evidence sequence.",
                "artifactFiles": [artifact],
                "renderedPages": [current],
                "previousRenderedPages": [previous],
                "composition": dict(
                    zip(
                        [
                            "structure",
                            "typography",
                            "surface",
                            "imageOrDataRole",
                            "sequence",
                        ],
                        ["split", "serif", "yellow", "chart", "evidence-first"],
                    )
                ),
                "visualReview": review,
            }
            data = {
                "version": "1.0.0",
                "previousVersion": "0.9.0",
                "runtimeSha256": runtime["sha256"],
                "skillSha256": skill["sha256"],
                "examples": [example],
            }
            manifest = root / "manifest.json"

            def run(value):
                manifest.write_text(json.dumps(value), encoding="utf-8")
                return gate.validate(manifest, root)

            self.assertEqual(run(data), 1)
            for field, value in [
                ("generationMethod", "preset-reskin"),
                ("previousRenderedPages", [current]),
                ("artifactFiles", [current]),
                ("prompt", "short"),
            ]:
                invalid = copy.deepcopy(data)
                invalid["examples"][0][field] = value
                with self.assertRaises(AssertionError):
                    run(invalid)
            stale = copy.deepcopy(data)
            stale["runtimeSha256"] = "stale"
            with self.assertRaises(AssertionError):
                run(stale)
            save(prefix + "assets/templates/sample.html", "changed after review")
            with self.assertRaises(AssertionError):
                run(data)


if __name__ == "__main__":
    unittest.main()
