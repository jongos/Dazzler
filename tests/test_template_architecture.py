"""Guard content preservation and semantic divergence, not a subjective beauty score."""

import sys
from pathlib import Path
from collections import Counter
import unittest
from zipfile import ZipFile
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(ROOT / "skills/dazzler-frontend/scripts"))
from template_architecture import compose, PROFILES
from template_documents import DOCS
from template_interfaces import UIS
from template_showcase import enrich


def payload(value):
    if isinstance(value, str):
        return [value]
    if isinstance(value, (list, tuple)):
        return sum((payload(x) for x in value), [])
    return []


def words(page):
    return Counter(
        [page["title"]]
        + sum(
            (
                payload(b.get(k, []))
                for b in page["blocks"]
                for k in ["text", "label", "items", "headers", "rows", "values"]
            ),
            [],
        )
    )


class ArchitectureTests(unittest.TestCase):
    def test_composition_preserves_all_content_and_is_repeatable(self):
        docs, _ = enrich(DOCS, UIS)
        for source in docs:
            result = compose(source)
            self.assertEqual(
                [words(p) for p in source["pages"]],
                [words(p) for p in result["pages"]],
                source["id"],
            )
            self.assertEqual(compose(result), result)
            self.assertEqual(result["sample"]["document"], result["pages"])
            if source["id"] not in PROFILES:
                self.assertEqual(source, result)

    def test_reader_task_controls_order_and_representation(self):
        docs = {d["id"]: compose(d) for d in enrich(DOCS, UIS)[0]}
        legal = docs["legal"]["pages"][0]["blocks"]
        self.assertEqual(legal[0]["type"], "metadata")
        self.assertEqual(legal[-1]["type"], "facts")
        brief = docs["professional"]["pages"][0]["blocks"]
        self.assertLess(
            next(i for i, b in enumerate(brief) if b["type"] == "callout"),
            next(i for i, b in enumerate(brief) if b["type"] == "facts"),
        )
        proposal = docs["business"]["pages"][0]["blocks"]
        self.assertTrue(any(b["type"] == "sequence" for b in proposal))
        self.assertTrue(any(b["type"] == "terms" for b in proposal))
        for ident in PROFILES:
            self.assertFalse(
                any(
                    b["type"] == "metrics"
                    for p in docs[ident]["pages"]
                    for b in p["blocks"]
                )
            )

    def test_generated_word_uses_native_roles_and_print_geometry(self):
        import json

        ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
        catalog = json.loads(
            (ROOT / "skills/dazzler-frontend/assets/templates/catalog.json").read_text(
                encoding="utf8"
            )
        )
        for item in (t for t in catalog["templates"] if t["format"] == "docx"):
            with ZipFile(
                ROOT / "skills/dazzler-frontend/assets/templates" / item["path"]
            ) as z:
                doc = ET.fromstring(z.read("word/document.xml"))
                self.assertTrue(doc.findall('.//w:pStyle[@w:val="Title"]', ns))
                self.assertTrue(doc.findall(".//w:tblHeader", ns))
                self.assertFalse(
                    doc.findall(".//w:drawing", ns),
                    "Native copy, not a rasterized page",
                )
                size = doc.find(".//w:pgSz", ns)
                width = int(size.get("{" + ns["w"] + "}w"))
                height = int(size.get("{" + ns["w"] + "}h"))
                self.assertEqual(width > height, item["orientation"] == "landscape")


if __name__ == "__main__":
    unittest.main()
