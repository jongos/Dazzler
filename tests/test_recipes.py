import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "skills/dazzler-frontend/scripts/recipes.py"
spec = importlib.util.spec_from_file_location("recipes", SCRIPT)
recipes = importlib.util.module_from_spec(spec)
spec.loader.exec_module(recipes)
BRIEFS = json.loads((ROOT / "tests/fixtures/recipe-briefs.json").read_text())


class RecipeTests(unittest.TestCase):
    def test_pinned_winner_only_inventory_and_details(self):
        provenance, rows = recipes.load_index()
        self.assertEqual(provenance["judgments"], 6954)
        self.assertEqual(provenance["tested"], 2318)
        self.assertEqual(sum(r["winnerVotes"] == 3 for r in rows), 915)
        self.assertEqual(len(list((recipes.DATA / "details").glob("*.json"))), 1000)
        for row in rows:
            data = (recipes.DATA / "details" / (row["id"] + ".json")).read_bytes()
            self.assertEqual(hashlib.sha256(data).hexdigest(), row["sha256"])
            value = json.loads(data)
            self.assertEqual(value["id"], row["id"])
            self.assertEqual(value["selection"]["winnerVotes"], row["winnerVotes"])
            self.assertEqual(len(value["selection"]["judgments"]), 3)
            self.assertEqual(value["checks"]["renderedStatus"], "not-run")
            self.assertNotIn("referenceIds", value["selection"])
            self.assertLessEqual(value["numeric"]["measureCh"], 60)

    def test_context_shortlists_and_diversity(self):
        _, rows = recipes.load_index()
        by_id = {r["id"]: r for r in rows}
        for brief in BRIEFS:
            with self.subTest(context=brief["contexts"]):
                result = recipes.shortlist(brief)
                self.assertEqual(result["status"], "ok")
                self.assertTrue(1 <= len(result["candidates"]) <= 3)
                self.assertTrue(
                    all(r["context"] in brief["contexts"] for r in result["candidates"])
                )
                self.assertIn(
                    result["candidates"][0]["arrangement"], brief["preferArrangements"]
                )
                chosen = [by_id[r["id"]] for r in result["candidates"]]
                for i, r in enumerate(chosen):
                    self.assertTrue(
                        all(recipes.difference(r, other) >= 2 for other in chosen[:i])
                    )

    def test_input_order_and_category_counts_do_not_rank(self):
        provenance, rows = recipes.load_index()
        expected = recipes.shortlist(BRIEFS[0])
        changed = copy.deepcopy(provenance)
        changed["contexts"] = {"software": 999999, "editorial": 0}
        with patch.object(
            recipes, "load_index", return_value=(changed, list(reversed(rows)))
        ):
            self.assertEqual(expected, recipes.shortlist(BRIEFS[0]))

    def test_unanimous_only_breaks_equally_suitable_choices(self):
        provenance, rows = recipes.load_index()
        first, second = copy.deepcopy(rows[0]), copy.deepcopy(rows[0])
        second["id"] = "R9999"
        first["winnerVotes"], second["winnerVotes"] = 2, 3
        brief = {"contexts": ["editorial"], "brief": "Reading reference", "limit": 1}
        with patch.object(
            recipes, "load_index", return_value=(provenance, [first, second])
        ):
            self.assertEqual(recipes.shortlist(brief)["candidates"][0]["id"], "R9999")
            first["style"] = "reading reference archival documentary journal"
            brief["brief"] += " archival documentary journal"
            self.assertEqual(
                recipes.shortlist(brief)["candidates"][0]["id"], first["id"]
            )

    def test_lookup_and_derived_record_preserve_evidence_boundary(self):
        found = recipes.lookup("R0001")
        self.assertEqual(found["recipe"]["fonts"]["heading"], "Archivo")
        decision = recipes.record(
            {
                "recipeId": "R0001",
                "rationale": "Reading-column relationships fit the article and its supporting notes.",
                "adaptations": [
                    "Preserved approved brand colors; substituted an available heading font."
                ],
            }
        )
        self.assertEqual(decision["relationship"], "derived-from-recipe")
        self.assertEqual(decision["implementationValidation"], "not-run")
        self.assertEqual(decision["datasetRevision"], found["datasetRevision"])
        self.assertNotIn("winner", decision)

    def test_no_fit_constraints_and_input_are_preserved(self):
        brief = copy.deepcopy(BRIEFS[0])
        brief["requireArrangements"] = ["unavailable-arrangement"]
        before = copy.deepcopy(brief)
        self.assertEqual(recipes.shortlist(brief)["status"], "no-match")
        self.assertEqual(brief, before)
        brief.pop("requireArrangements")
        brief["contexts"] = []
        self.assertEqual(recipes.shortlist(brief)["candidates"], [])
        self.assertEqual(recipes.lookup("R9999")["status"], "no-match")
        with self.assertRaises(ValueError):
            recipes.lookup("../../LICENSE")
        with self.assertRaises(ValueError):
            recipes.shortlist({"contexts": ["unknown"], "brief": "example"})

    def test_shortlisting_does_not_load_details(self):
        original = recipes.read
        calls = []

        def observed(path, limit):
            calls.append(str(path))
            return original(path, limit)

        with patch.object(recipes, "read", side_effect=observed):
            recipes.shortlist(BRIEFS[0])
        self.assertEqual(len(calls), 2)
        self.assertFalse(any("details" in p for p in calls))

    def test_missing_and_corrupt_data(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            with self.assertRaises(OSError):
                recipes.load_index(root)
            shutil.copy(recipes.DATA / "provenance.json", root)
            (root / "index.json").write_text("{}")
            with self.assertRaisesRegex(ValueError, "hash mismatch"):
                recipes.load_index(root)
            shutil.copy(recipes.DATA / "index.json", root / "index.json")
            with self.assertRaises(OSError):
                recipes.lookup("R0001", root)
            (root / "details").mkdir()
            (root / "details/R0001.json").write_text("{}")
            with self.assertRaisesRegex(ValueError, "hash mismatch"):
                recipes.lookup("R0001", root)
            script = root / "isolated/scripts/recipes.py"
            script.parent.mkdir(parents=True)
            shutil.copy(SCRIPT, script)
            result = subprocess.run(
                [sys.executable, str(script), "get", "R0001"],
                capture_output=True,
                text=True,
                check=True,
            )
            self.assertEqual(json.loads(result.stdout)["status"], "unavailable")


if __name__ == "__main__":
    unittest.main()
