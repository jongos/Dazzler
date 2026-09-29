import json
from pathlib import Path
import sys
import tempfile
import unittest
import importlib.util
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "skills/dazzler-frontend/scripts"))
from headings import heading, html_headings
from local_fonts import import_local, metadata, project_catalog


class PolicyTests(unittest.TestCase):
    def test_private_or_unreviewed_fonts_cannot_be_packaged(self):
        spec = importlib.util.spec_from_file_location(
            "phase6_builder", ROOT / "tools/build_platforms.py"
        )
        builder = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(builder)
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            source = root / "source"
            (source / "references").mkdir(parents=True)
            (source / "references/font-catalog.json").write_text('{"fonts":[]}')
            private = source / "user-fonts.json"
            private.write_text("{}")
            with patch.object(builder, "SOURCE", source):
                with self.assertRaisesRegex(ValueError, "Private project font"):
                    builder.assemble("codex", root / "package")
                private.unlink()
                (source / "unexpected.ttf").write_bytes(b"not an inventoried font")
                with self.assertRaisesRegex(ValueError, "Unreviewed font binary"):
                    builder.assemble("codex", root / "package")
                self.assertFalse((root / "package").exists())

    def test_shared_heading_vectors_and_body_preservation(self):
        for case in json.loads(
            (ROOT / "tests/fixtures/heading-cases.json").read_text(encoding="utf-8")
        ):
            self.assertEqual(
                heading(case["input"], case.get("options")), case["expected"]
            )
        self.assertEqual(
            html_headings("<h2>an example</h2><p>keep body lower</p>"),
            "<h2>An Example</h2><p>keep body lower</p>",
        )

    def test_script_templates_are_not_heading_copy(self):
        source = "<h2>page title</h2><script>const s = `<h2>${tasks.filter(t => t.owner)}</h2>`;</script>"
        expected = source.replace("page title", "Page Title")
        self.assertEqual(html_headings(source), expected)

    def test_local_font_metadata_import_and_boundaries(self):
        font = next(
            (ROOT / "skills/dazzler-frontend/assets/fonts/work-sans").glob("*.ttf")
        )
        face = metadata(font)
        self.assertIn("Work Sans", face["css_family"])
        self.assertTrue(
            any(low <= ord("A") <= high for low, high in face["unicode_ranges"])
        )
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            source = root / "source"
            source.mkdir()
            (source / font.name).write_bytes(font.read_bytes())
            dest = root / "project/fonts"
            result = import_local(source, dest, "User-declared desktop/web license")
            self.assertEqual(result["imported"], 1)
            record = json.loads((dest / "user-fonts.json").read_text())
            self.assertEqual(
                project_catalog(dest / "user-fonts.json")[0]["name"], face["css_family"]
            )
            self.assertFalse(record["redistributable"])
            self.assertFalse(record["licenseVerified"])
            self.assertEqual((dest / ".gitignore").read_text(), "*\n")
            with self.assertRaises(ValueError):
                import_local(source, dest, "custom")
            (source / "broken.ttf").write_bytes(b"invalid")
            with self.assertRaises(ValueError):
                import_local(source, root / "invalid", "custom")
            self.assertFalse((root / "invalid").exists())
            (dest / font.name).write_bytes(b"modified")
            with self.assertRaises(ValueError):
                project_catalog(dest / "user-fonts.json")
