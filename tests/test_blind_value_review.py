import json
from pathlib import Path
import random
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from blind_value_review import build
from compare_value import validate_suite


class BlindReviewTests(unittest.TestCase):
    def test_pair_pack_has_no_prefilled_preference_or_public_mapping(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            run = root / "run"
            captures = root / "captures"
            run.mkdir()
            captures.mkdir()
            trials = []
            for arm in ["baseline", "dazzler"]:
                folder = captures / arm
                folder.mkdir()
                for name in ["full-1440.png", "full-390.png"]:
                    (folder / name).write_bytes(b"image")
                trials.append(
                    {
                        "id": "brief",
                        "arm": arm,
                        "folder": arm,
                        "repetition": 1,
                        "format": "website",
                        "status": "completed",
                        "eligibleForReview": True,
                    }
                )
            (run / "manifest.json").write_text(json.dumps({"trials": trials}))
            (run / "suite.json").write_text(
                json.dumps({"cases": [{"id": "brief", "prompt": "Synthetic test"}]})
            )
            out = root / "pack"
            self.assertEqual(build(run, captures, out, random.Random(4)), 1)
            ratings = json.loads((out / "review/ratings.json").read_text())
            self.assertIsNone(ratings[0]["overall"])
            self.assertFalse((out / "review/mapping.json").exists())
            self.assertEqual(len(list((out / "review/case-01").glob("*.png"))), 4)
            with self.assertRaises(FileExistsError):
                build(run, captures, out)
            trials[0]["status"] = "timeout"
            (run / "manifest.json").write_text(json.dumps({"trials": trials}))
            with self.assertRaises(ValueError):
                build(run, captures, root / "incomplete")

    def test_fresh_suite_covers_all_formats(self):
        data = json.loads(
            (
                Path(__file__).resolve().parents[1]
                / "maintenance/value-study/phase2-briefs.json"
            ).read_text()
        )
        validate_suite(data)
        for kind in ["website", "application", "document", "slides"]:
            self.assertEqual(sum(c["format"] == kind for c in data["cases"]), 2)


if __name__ == "__main__":
    unittest.main()
