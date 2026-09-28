import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "fonts", ROOT / "skills/dazzler-frontend/scripts/fonts.py"
)
fonts = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fonts)


class FontWorkflowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = fonts.load()["fonts"]

    def test_literary_body_shortlist(self):
        result = fonts.shortlist(self.catalog, "body", ["literary"], "An introduction")
        self.assertIn(result[0]["id"], ["eb-garamond", "junicode", "libre-baskerville"])

    def test_devanagari_never_silently_falls_back_to_latin(self):
        result = fonts.shortlist(self.catalog, "body", text="नमस्ते दुनिया")
        self.assertTrue(result)
        self.assertTrue(all(x["id"] == "poppins" for x in result))

    def test_missing_glyph_has_no_result(self):
        self.assertEqual(fonts.shortlist(self.catalog, "body", text="\U0010ffff"), [])

    def test_italic_is_real_style(self):
        self.assertEqual(
            fonts.shortlist(self.catalog, "heading", italic=True, family="oswald"), []
        )
        result = fonts.shortlist(
            self.catalog, "body", italic=True, family="cooper-hewitt"
        )
        self.assertTrue(result)
        self.assertIn("Italic", result[0]["file"])

    def test_variable_weight_range(self):
        self.assertTrue(fonts.shortlist(self.catalog, "ui", weight=550, family="inter"))
        self.assertEqual(
            fonts.shortlist(self.catalog, "body", weight=900, family="eb-garamond"), []
        )

    def test_byte_budget_and_feature_filter(self):
        self.assertEqual(fonts.shortlist(self.catalog, "ui", max_bytes=10), [])
        self.assertEqual(
            fonts.shortlist(self.catalog, "ui", features=["not-a-feature"]), []
        )

    def test_export_keeps_notices_and_checks_overwrite(self):
        family = next(f for f in self.catalog if f["id"] == "work-sans")
        filename = family["files"][0]["filename"]
        with tempfile.TemporaryDirectory() as td:
            dest = fonts.export(family, td, [filename])
            self.assertTrue((dest / "OFL.txt").is_file())
            self.assertTrue((dest / "SOURCE.md").is_file())
            self.assertEqual(len(list(dest.glob("*.ttf"))), 1)
            self.assertIn("font-display: swap", (dest / "fonts.css").read_text())
            with self.assertRaises(ValueError):
                fonts.export(family, td, [filename])

    def test_excluded_font_cannot_be_exported(self):
        family = next(f for f in self.catalog if f["id"] == "nimbus-sans-l")
        with tempfile.TemporaryDirectory() as td:
            with self.assertRaises(ValueError):
                fonts.export(family, td)
            self.assertEqual(list(Path(td).iterdir()), [])

    def test_hash_failure_writes_nothing(self):
        family = json.loads(
            json.dumps(next(f for f in self.catalog if f["id"] == "bagnard"))
        )
        family["files"][0]["sha256"] = "0" * 64
        with tempfile.TemporaryDirectory() as td:
            with self.assertRaises(ValueError):
                fonts.export(family, td)
            self.assertEqual(list(Path(td).iterdir()), [])


if __name__ == "__main__":
    unittest.main()
