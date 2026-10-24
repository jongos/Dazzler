import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from comparison_progress import snapshot


class ProgressTests(unittest.TestCase):
    def test_live_log_overrides_old_not_run_without_claiming_completion(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            trial = root / "trial"
            trial.mkdir()
            manifest = {
                "trials": [
                    {
                        "id": "brief",
                        "arm": "baseline",
                        "folder": "trial",
                        "status": "not-run",
                    }
                ]
            }
            (root / "manifest.json").write_text(json.dumps(manifest))
            self.assertEqual(snapshot(root)["trials"][0]["status"], "not-run")
            (trial / "events.jsonl").write_text(
                '{"type":"turn.started"}\n{"unfinished":'
            )
            (trial / "index.html").write_text("test")
            result = snapshot(root)
            self.assertEqual(result["trials"][0]["status"], "running")
            self.assertEqual(result["completedTrials"], 0)
            self.assertEqual(result["readyPairs"], 0)
            (trial / "events.jsonl").write_text('{"type":"turn.completed"}\n')
            self.assertEqual(snapshot(root)["trials"][0]["status"], "finalizing")
            manifest["trials"][0]["status"] = "timeout"
            (root / "manifest.json").write_text(json.dumps(manifest))
            self.assertEqual(snapshot(root)["trials"][0]["status"], "timeout")

    def test_completed_pair_does_not_imply_independent_review(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            trials = [
                {
                    "id": "brief",
                    "arm": arm,
                    "folder": arm,
                    "status": "completed",
                    "eligibleForReview": True,
                }
                for arm in ["baseline", "dazzler"]
            ]
            (root / "manifest.json").write_text(json.dumps({"trials": trials}))
            result = snapshot(root)
            self.assertEqual(result["readyPairs"], 1)
            self.assertEqual(result["agentReviewedPairs"], 0)
            trials[0]["reviewStatus"] = "informed-agent-reviewed"
            (root / "manifest.json").write_text(json.dumps({"trials": trials}))
            self.assertEqual(snapshot(root)["agentReviewedPairs"], 0)
            trials[1]["reviewStatus"] = "informed-agent-reviewed"
            (root / "manifest.json").write_text(json.dumps({"trials": trials}))
            self.assertEqual(snapshot(root)["agentReviewedPairs"], 1)


if __name__ == "__main__":
    unittest.main()
