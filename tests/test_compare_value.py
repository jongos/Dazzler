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
    def test_phase1_has_two_native_cases_per_format(self):
        data = json.loads(
            (ROOT / "maintenance/value-study/phase1-briefs.json").read_text()
        )
        study.validate_suite(data)
        from collections import Counter

        self.assertEqual(
            Counter(c["format"] for c in data["cases"]),
            {"website": 2, "application": 2, "document": 2, "slides": 2},
        )
        for case in data["cases"]:
            if case["format"] in ["document", "slides"]:
                self.assertIn("artifact.pdf", case["outputs"])
                self.assertIn(
                    (
                        "artifact.docx"
                        if case["format"] == "document"
                        else "artifact.pptx"
                    ),
                    case["outputs"],
                )

    def test_bad_trial_paths_rejected(self):
        for name, outputs in [
            ("../escape", ["index.html"]),
            ("valid", ["../escape"]),
            ("valid", []),
        ]:
            with self.assertRaises(ValueError):
                study.validate_suite(
                    {"cases": [{"id": name, "prompt": "test", "outputs": outputs}]}
                )

    def test_preflight_block_stops_before_host_launch(self):
        with self.assertRaisesRegex(ValueError, "preflight"):
            study.run(
                Path("unused"),
                {"generationGate": "blocked-pending-successful-host-preflight"},
                "codex",
            )

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
