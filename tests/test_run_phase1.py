import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from run_phase1 import check_preflight


class ApprovedPreflightTests(unittest.TestCase):
    def fixture(self, folder, commands=True, blocked=False):
        events = [{"type": "turn.completed"}]
        if commands:
            events += [
                {
                    "type": "item.completed",
                    "item": {
                        "type": "command_execution",
                        "exit_code": 0,
                        "aggregated_output": output,
                    },
                }
                for output in ["", "READY"]
            ]
        (folder / "events.jsonl").write_text("\n".join(json.dumps(e) for e in events))
        (folder / "stderr.txt").write_text("blocked by policy" if blocked else "")
        (folder / "probe.txt").write_text("READY")

    def test_requires_tool_evidence_not_just_file_or_self_report(self):
        with tempfile.TemporaryDirectory() as temp:
            folder = Path(temp)
            self.fixture(folder, commands=False)
            with self.assertRaises(ValueError):
                check_preflight(folder)

    def test_rejects_policy_denial(self):
        with tempfile.TemporaryDirectory() as temp:
            folder = Path(temp)
            self.fixture(folder, blocked=True)
            with self.assertRaises(ValueError):
                check_preflight(folder)

    def test_success_records_evidence_hashes(self):
        with tempfile.TemporaryDirectory() as temp:
            folder = Path(temp)
            self.fixture(folder)
            evidence = check_preflight(folder)
            self.assertEqual(evidence["mode"], "automatic-review")
            self.assertEqual(len(evidence["eventsSha256"]), 64)


if __name__ == "__main__":
    unittest.main()
