import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "design_context", ROOT / "skills/dazzler-frontend/scripts/design_context.py"
)
context = importlib.util.module_from_spec(spec)
spec.loader.exec_module(context)


class ContextTests(unittest.TestCase):
    def test_existing_location_ambiguity_and_shadcn(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            (root / "brand").mkdir()
            (root / "brand/DESIGN.md").write_text("Keep existing location")
            (root / "app.css").write_text("button{color:hsl(var(--primary))}")
            (root / "components.json").write_text(
                json.dumps({"tailwind": {"css": "app.css", "cssVariables": True}})
            )
            found = context.discover(root)
            self.assertEqual(found["primaryRecord"], "brand/DESIGN.md")
            self.assertEqual(found["shadcn"]["convention"], "hsl-channels")
            (root / "DESIGN.md").write_text("Conflicting record")
            self.assertTrue(context.discover(root)["ambiguous"])
            self.assertIsNone(context.discover(root)["primaryRecord"])

    def test_oversize_and_external_css_are_not_read(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            (root / "DESIGN.md").write_text("x" * 262145)
            (root / "components.json").write_text(
                json.dumps(
                    {"tailwind": {"css": "../outside.css", "cssVariables": True}}
                )
            )
            found = context.discover(root)
            self.assertFalse(found["shadcn"]["supported"])
            self.assertTrue(any("byte-budget" in x for x in found["skipped"]))
            self.assertFalse(any(x["path"] == "DESIGN.md" for x in found["records"]))

    def test_declared_color_conventions_without_inline_bindings(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            (root / "components.json").write_text(
                json.dumps({"tailwind": {"css": "app.css", "cssVariables": True}})
            )
            css = root / "app.css"
            css.write_text(":root{--background:0 0% 100%;--primary:222.2 47.4% 11.2%}")
            self.assertEqual(
                context.discover(root)["shadcn"]["convention"], "hsl-channels"
            )
            css.write_text(":root{--background:oklch(1 0 0);--primary:#123456}")
            self.assertEqual(
                context.discover(root)["shadcn"]["convention"], "color-values"
            )
            css.write_text(":root{--background:0 0% 100%;--primary:#123456}")
            self.assertFalse(context.discover(root)["shadcn"]["supported"])
