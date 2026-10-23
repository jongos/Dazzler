import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "compare_value", ROOT / "tools/compare_value.py"
)
study = importlib.util.module_from_spec(spec)
spec.loader.exec_module(study)


class ComparisonEvidenceTests(unittest.TestCase):
    def test_self_report_does_not_prove_skill_loaded(self):
        raw = "\n".join(
            json.dumps(e)
            for e in [
                {
                    "type": "item.completed",
                    "item": {"type": "agent_message", "text": "I used Dazzler"},
                },
                {
                    "type": "turn.completed",
                    "usage": {"input_tokens": 100, "output_tokens": 10},
                },
            ]
        )
        result = study.trace_summary(raw)
        self.assertTrue(result["turnCompleted"])
        self.assertEqual(result["skillReadEvents"], [])
        self.assertEqual(result["usage"]["output_tokens"], 10)

    def test_policy_block_overrides_completed_turn(self):
        result = study.trace_summary(
            '{"type":"turn.completed"}', "Rejected: blocked by policy"
        )
        self.assertTrue(result["executionPolicyBlocked"])

    def test_only_successful_native_skill_read_counts(self):
        item = {
            "id": "fixture-read",
            "type": "command_execution",
            "exit_code": 0,
            "aggregated_output": "name: dazzler-frontend\n# Dazzler Frontend",
        }
        self.assertEqual(
            study.trace_summary(json.dumps({"type": "item.completed", "item": item}))[
                "skillReadEvents"
            ],
            ["fixture-read"],
        )
        item["exit_code"] = 1
        self.assertEqual(
            study.trace_summary(json.dumps({"type": "item.completed", "item": item}))[
                "skillReadEvents"
            ],
            [],
        )
        self.assertEqual(study.trace_summary("not JSON")["skillReadEvents"], [])

    def test_briefs_cover_three_contexts_without_reusing_gallery(self):
        data = json.loads((ROOT / "maintenance/value-study/briefs.json").read_text())
        self.assertEqual(
            [c["id"] for c in data["cases"]], ["website", "dashboard", "document"]
        )
        self.assertEqual(len(set(c["prompt"] for c in data["cases"])), 3)


if __name__ == "__main__":
    unittest.main()
