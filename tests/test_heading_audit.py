import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "skills/dazzler-frontend/scripts"
sys.path.insert(0, str(SCRIPTS))
from heading_audit import audit, collect, xml


class HeadingAuditTests(unittest.TestCase):
    def test_word_inheritance_tables_and_split_runs(self):
        ns = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / "sample.docx"
            with zipfile.ZipFile(path, "w") as z:
                z.writestr(
                    "word/styles.xml",
                    f'<w:styles xmlns:w="{ns}"><w:style w:styleId="Editorial"><w:basedOn w:val="Heading1"/></w:style></w:styles>',
                )
                z.writestr(
                    "word/document.xml",
                    f'<w:document xmlns:w="{ns}"><w:body><w:tbl><w:tr><w:tc><w:p><w:pPr><w:pStyle w:val="Editorial"/></w:pPr><w:r><w:t>Follow the </w:t></w:r><w:hyperlink><w:r><w:t>money</w:t></w:r></w:hyperlink></w:p></w:tc></w:tr></w:tbl><w:p><w:r><w:t>body stays unchanged</w:t></w:r></w:p></w:body></w:document>',
                )
                z.writestr(
                    "word/header1.xml",
                    f'<w:hdr xmlns:w="{ns}"><w:p><w:pPr><w:outlineLvl w:val="1"/></w:pPr><w:r><w:t>How it works</w:t></w:r></w:p></w:hdr>',
                )
            before = path.read_bytes()
            report = audit(collect(path))
            self.assertEqual(report["checked"], 2)
            self.assertEqual(
                [r["expected"] for r in report["failures"]],
                ["Follow the Money", "How It Works"],
            )
            self.assertEqual(path.read_bytes(), before)

    def test_html_nested_headings_ignore_script_and_body(self):
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / "page.html"
            path.write_text(
                '<h1>Know <em>the limits</em></h1><div role="heading"><div>How it works</div></div><p>body unchanged</p><script>"<h2>fake heading</h2>"</script><template><h3>not rendered</h3></template>',
                encoding="utf-8",
            )
            report = audit(collect(path))
            self.assertEqual(report["checked"], 2)
            self.assertEqual(
                [f["expected"] for f in report["failures"]],
                ["Know the Limits", "How It Works"],
            )
            path.write_text("<h1>Know the Limits</h1>", encoding="utf-8")
            self.assertEqual(audit(collect(path))["status"], "pass")
            path.write_text("<h1>Unclosed", encoding="utf-8")
            with self.assertRaises(ValueError):
                collect(path)

    def test_powerpoint_preserves_split_words(self):
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / "slides.pptx"
            with zipfile.ZipFile(path, "w") as z:
                z.writestr(
                    "ppt/slides/slide1.xml",
                    '<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><p:sp><p:nvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr><p:txBody><a:p><a:r><a:t>How it wo</a:t></a:r><a:r><a:t>rks</a:t></a:r></a:p></p:txBody></p:sp></p:sld>',
                )
            self.assertEqual(
                audit(collect(path))["failures"][0]["expected"], "How It Works"
            )

    def test_inventory_exceptions_and_cli_exit_codes(self):
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / "headings.json"
            path.write_text(
                json.dumps(
                    [{"location": "/report h1", "text": "How it works with API"}]
                )
            )

            def run(*args):
                return subprocess.run(
                    [
                        sys.executable,
                        str(SCRIPTS / "heading_audit.py"),
                        str(path),
                        *args,
                    ],
                    capture_output=True,
                    text=True,
                )

            self.assertEqual(run().returncode, 1)
            self.assertEqual(run("--case", "preserve").returncode, 0)
            self.assertEqual(run("--lang", "fr").returncode, 0)
            path.write_text("[]")
            self.assertEqual(run().returncode, 2)
            path.write_text('[{"text": "missing location"}]')
            self.assertEqual(run().returncode, 2)
        self.assertEqual(
            audit([{"location": "title", "text": "API and iPhone"}])["status"], "pass"
        )

    def test_markdown_fences_and_setext(self):
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / "manual.md"
            path.write_text(
                "# How it works\n\n```md\n# not a heading\n```\n\nKnow the limits\n---\n",
                encoding="utf-8",
            )
            self.assertEqual(audit(collect(path))["checked"], 2)

    def test_xml_entity_rejection_in_multiple_encodings(self):
        content = '<!DOCTYPE x [<!ENTITY x "bad">]><x>&x;</x>'
        for encoding in ("utf-8", "utf-16", "utf-32"):
            with self.assertRaises(ValueError):
                xml(content.encode(encoding))

    def test_markdown_metadata_and_code_are_not_headings(self):
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / "notes.md"
            path.write_text(
                "---\ntitle: metadata only\n---\n```text\ncode\n```\n---\n# Real Heading\n",
                encoding="utf-8",
            )
            self.assertEqual(
                collect(path), [{"location": "line:8", "text": "Real Heading"}]
            )

    def test_every_packaged_host_keeps_delivery_gate(self):
        spec = importlib.util.spec_from_file_location(
            "audit_platforms", ROOT / "tools/build_platforms.py"
        )
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        for platform in module.PLATFORMS:
            skill = module.skill_text(platform)
            self.assertIn("scripts/heading_audit.py", skill)
            self.assertIn("references/document-design.md", skill)
            self.assertLess(len(skill.encode("utf-8")), 8000)


if __name__ == "__main__":
    unittest.main()
