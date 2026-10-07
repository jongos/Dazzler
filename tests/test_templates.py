import hashlib
import importlib.util
import json
import re
from pathlib import Path
import tempfile
import unittest
import sys
from collections import Counter
from zipfile import ZipFile
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "templates", ROOT / "skills/dazzler-frontend/scripts/templates.py"
)
templates = importlib.util.module_from_spec(spec)
spec.loader.exec_module(templates)


class TemplateTests(unittest.TestCase):
    def test_generated_document_headings(self):
        sys.path.insert(0, str(ROOT / "skills/dazzler-frontend/scripts"))
        from heading_audit import audit, collect

        for path in (ROOT / "skills/dazzler-frontend/assets/templates/docx").glob(
            "*.docx"
        ):
            with self.subTest(template=path.name):
                self.assertEqual(audit(collect(path))["status"], "pass")

    def test_ui_scripts_only_reference_existing_elements(self):
        scripts = set()
        for file in (ROOT / "skills/dazzler-frontend/assets/templates/ui").glob(
            "*/index.html"
        ):
            text = file.read_text(encoding="utf-8")
            script = re.search(r"<script>(.*?)</script>", text, re.S)[1]
            ids = set(re.findall(r'id="([^"]+)"', text))
            referenced = set(re.findall(r'\$\("([^"]+)"\)', script))
            self.assertFalse(
                referenced - ids, f"{file.parent.name}: {referenced - ids}"
            )
            # Includes the shared protected-casing rules; no network runtime.
            self.assertLess(len(script.encode()), 12000)
            scripts.add(hashlib.sha256(script.encode()).hexdigest())
        self.assertEqual(len(scripts), 10)

    def test_counts_categories_and_integrity(self):
        c = templates.catalog()
        self.assertEqual(
            Counter(t["format"] for t in c["templates"]),
            {"docx": 10, "html": 10, "ui": 10},
        )
        self.assertEqual(
            Counter(t["category"] for t in c["templates"] if t["format"] == "ui"),
            {
                "general-webapp": 3,
                "data-visualization": 2,
                "restaurant": 4,
                "generic-business": 1,
            },
        )
        for path, digest in c["files"].items():
            self.assertEqual(
                hashlib.sha256((templates.ROOT / path).read_bytes()).hexdigest(),
                digest,
                path,
            )

    def test_exports_preserve_resources_and_refuse_overwrite(self):
        with tempfile.TemporaryDirectory() as td:
            for ident in ["docx-legal", "html-family", "restaurant-cafe"]:
                out = Path(td) / ident
                result = templates.export(ident, out)
                self.assertTrue(Path(result["entrypoint"]).is_file())
                self.assertTrue((out / "LICENSE.txt").is_file())
                if result["format"] != "docx":
                    self.assertTrue((out / "fonts/work-sans/fonts.css").is_file())
                with self.assertRaises(ValueError):
                    templates.export(ident, out)
            with self.assertRaises(ValueError):
                templates.export("unknown", Path(td) / "unknown")

    def test_word_structure_and_no_inherited_title_rule(self):
        ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
        for t in templates.select("docx"):
            with ZipFile(templates.ROOT / t["path"]) as z:
                document = ET.fromstring(z.read("word/document.xml"))
                styles = ET.fromstring(z.read("word/styles.xml"))
                self.assertFalse(styles.findall(".//w:pBdr", ns))
                self.assertTrue(document.findall(".//w:tbl", ns))
                self.assertTrue(document.findall(".//w:tblHeader", ns))
                self.assertGreater(len("".join(document.itertext())), 700, t["id"])
                sample = json.loads(
                    (templates.ROOT / t["dataset"]).read_text(encoding="utf8")
                )
                text = "".join(document.itertext())
                self.assertIn(sample["lead"], text)
                self.assertIn(sample["closing"], text)
                if t.get("architecture") == "service-proposal":
                    # Logical sections flow when edited; capture checks assert the sample page count.
                    self.assertFalse(document.findall('.//w:br[@w:type="page"]', ns))
                    self.assertEqual(
                        len(document.findall('.//w:pStyle[@w:val="Title"]', ns)),
                        t["plannedPages"],
                    )
                else:
                    self.assertEqual(
                        len(document.findall('.//w:br[@w:type="page"]', ns)) + 1,
                        t["plannedPages"],
                    )

    def test_json_matches_embedded_data(self):
        import re

        for t in templates.select("ui"):
            folder = templates.ROOT / t["path"]
            s = (folder / "index.html").read_text(encoding="utf-8")
            embedded = re.search(
                r'<script id="template-data" type="application/json">(.*?)</script>',
                s,
                re.S,
            ).group(1)
            self.assertEqual(
                json.loads(embedded),
                json.loads((folder / "template.json").read_text(encoding="utf-8")),
            )

    def test_showcase_data_reconciles(self):
        load = lambda name: json.loads(
            (templates.ROOT / "data" / f"{name}.json").read_text(encoding="utf-8")
        )
        for item in templates.select("docx"):
            data = load(item["category"])
            self.assertTrue(data["fictional"])
            self.assertEqual(len(data["document"]), item["plannedPages"])
        professional = load("professional")
        self.assertIn("1,250", professional["intro"])
        self.assertIn("1,150", professional["intro"])
        self.assertEqual(1150 / 1250 * 100, 92)
        self.assertIn("100 unmatched records", str(professional["rows"]))
        fees = [
            int(row[2].replace("$", "").replace(",", ""))
            for row in load("business")["rows"]
        ]
        self.assertEqual(sum(fees), 24000)
        import statistics

        for row in load("school")["rows"]:
            values = [int(x) for x in re.findall(r"\d+", row[1])]
            self.assertEqual(statistics.median(values), int(row[2].split()[0]))
        revenue = json.loads(
            (templates.ROOT / "ui/data-revenue/template.json").read_text(
                encoding="utf8"
            )
        )["data"]
        self.assertEqual(len(revenue["years"]), 6)
        self.assertEqual(len(revenue["revenue"]), len(revenue["members"]))
        self.assertEqual(sum(revenue["revenue"]), 806)
        self.assertEqual(revenue["members"][-1], 480)

    def test_showcase_snapshots_and_exported_dependencies(self):
        for item in templates.catalog()["templates"]:
            self.assertGreater(
                (templates.ROOT / "previews" / f'{item["id"]}.jpg').stat().st_size,
                10000,
            )
        with tempfile.TemporaryDirectory() as td:
            for ident in ["html-school", "data-revenue", "restaurant-reservations"]:
                out = Path(td) / ident
                templates.export(ident, out)
                if ident == "html-school":
                    self.assertTrue((out / "data/school.json").is_file())
                    self.assertIn(
                        "<svg", (out / "html/school.html").read_text(encoding="utf8")
                    )
                else:
                    folder = out / "ui" / ident
                    for name in [
                        "index.html",
                        "styles.css",
                        "tokens.css",
                        "tokens.json",
                        "template.json",
                    ]:
                        self.assertTrue((folder / name).is_file())
        captures = []
        for name in ["word-captures.json", "browser-captures.json"]:
            captures.extend(
                json.loads(
                    (templates.ROOT / "previews" / name).read_text(encoding="utf-8")
                )
            )
        by_id = {item["id"]: item for item in captures}
        self.assertEqual(len(by_id), 30)
        for item in templates.catalog()["templates"]:
            source = templates.ROOT / item["path"]
            if item["format"] == "ui":
                source = source / "index.html"
            self.assertEqual(
                hashlib.sha256(source.read_bytes()).hexdigest(),
                by_id[item["id"]]["sourceSha256"],
            )

    def test_document_theme_text_contrast(self):
        def luminance(color):
            channels = [int(color[i : i + 2], 16) / 255 for i in (1, 3, 5)]
            linear = [
                v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
                for v in channels
            ]
            return sum(a * b for a, b in zip(linear, [0.2126, 0.7152, 0.0722]))

        for item in templates.select("docx"):
            theme = json.loads(
                (templates.ROOT / item["dataset"]).read_text(encoding="utf-8")
            )["design"]
            for role, surface in [
                ("text", "paper"),
                ("accentText", "paper"),
                ("onAccent", "accent"),
            ]:
                values = sorted([luminance(theme[role]), luminance(theme[surface])])
                self.assertGreaterEqual(
                    (values[1] + 0.05) / (values[0] + 0.05),
                    4.5,
                    item["id"] + " " + role,
                )


if __name__ == "__main__":
    unittest.main()
