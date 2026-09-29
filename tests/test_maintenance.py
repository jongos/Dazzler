import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]


def module(file):
    spec = importlib.util.spec_from_file_location(file.stem, file)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


class MaintenanceTests(unittest.TestCase):
    def test_authored_archive_entries_ignore_checkout_line_endings(self):
        build = module(ROOT / "tools/build_platforms.py")
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            a = root / "a" / "skill"
            b = root / "b" / "skill"
            a.mkdir(parents=True)
            b.mkdir(parents=True)
            for folder, newline in [(a, b"\n"), (b, b"\r\n")]:
                (folder / "SKILL.md").write_bytes(
                    newline.join([b"# Test", b"content", b""])
                )
                (folder / "assets").mkdir()
                (folder / "assets/LICENSE.txt").write_bytes(b"Original\r\nnotice\r\n")
            (a / "Z.txt").write_bytes(b"z\n")
            (b / "Z.txt").write_bytes(b"z\r\n")
            build.archive(a, root / "a.zip")
            build.archive(b, root / "b.zip")
            self.assertEqual(
                (root / "a.zip").read_bytes(), (root / "b.zip").read_bytes()
            )
            import zipfile

            with zipfile.ZipFile(root / "a.zip") as archive:
                self.assertEqual(archive.namelist(), sorted(archive.namelist()))
                self.assertTrue(all(i.create_system == 3 for i in archive.infolist()))

    def test_triggering_without_runner_is_not_a_measurement(self):
        harness = module(ROOT / "skills/dazzler-frontend/scripts/triggering.py")
        with tempfile.TemporaryDirectory() as td:
            report = harness.run(Path(td) / "run", "unconfigured")
            self.assertEqual(
                len(report["results"]),
                2
                * len(
                    json.loads(
                        (harness.SKILL / "evals/triggering.json").read_text(
                            encoding="utf-8"
                        )
                    )["cases"]
                ),
            )
            self.assertTrue(all(r["status"] == "not-run" for r in report["results"]))
            self.assertEqual(report["summary"]["current"]["observed"], 0)

    def test_triggering_observations_count_false_positives_and_reject_invalid(self):
        from unittest.mock import patch

        harness = module(ROOT / "skills/dazzler-frontend/scripts/triggering.py")

        class Process:
            returncode = 0

        with tempfile.TemporaryDirectory() as td:
            for loaded, expected in [
                (True, {"observed": 38, "passed": 24}),
                ("true", {"observed": 0, "passed": 0}),
            ]:

                def runner(*args, **kwargs):
                    (Path(kwargs["cwd"]) / "observation.json").write_text(
                        json.dumps(
                            {"loaded": loaded, "evidence": "Synthetic fixture only"}
                        )
                    )
                    return Process()

                with patch.object(harness.subprocess, "run", side_effect=runner):
                    report = harness.run(
                        Path(td) / str(type(loaded).__name__), "fixture", ["unused"]
                    )
                self.assertEqual(report["summary"]["current"], expected)

    def test_template_css_has_only_tokenized_colors(self):
        import re

        base = ROOT / "skills/dazzler-frontend/assets/templates"
        for folder in ["html", "ui"]:
            for file in (base / folder).rglob("*.css"):
                if file.name == "tokens.css":
                    continue
                self.assertIsNone(
                    re.search(r"#[0-9a-fA-F]{3,8}\b", file.read_text(encoding="utf-8")),
                    str(file),
                )

    def test_repository_instructions_do_not_transfer_publication_permission(self):
        for relative in ["AGENTS.md", "maintenance/MAINTENANCE.md"]:
            text = (ROOT / relative).read_text(encoding="utf-8").lower()
            self.assertNotIn("owner has authorized", text)
            self.assertNotIn("owner explicitly authorized", text)
            self.assertNotIn("without requesting separate push permission", text)
            self.assertIn("active conversation", text)

    def test_context_and_installation_boundaries(self):
        skill = ROOT / "skills/dazzler-frontend"
        self.assertLessEqual((skill / "SKILL.md").stat().st_size, 8000)
        self.assertLess((skill / "references/font-catalog.md").stat().st_size, 3000)
        catalog = json.loads(
            (skill / "references/font-catalog.json").read_text(encoding="utf-8")
        )
        self.assertEqual(
            {p.stem for p in (skill / "references/fonts").glob("*.md")},
            {family["id"] for family in catalog["fonts"]},
        )
        self.assertFalse((skill / "MAINTENANCE.md").exists())
        for file in [skill / "SKILL.md", *list((skill / "references").rglob("*.md"))]:
            self.assertLessEqual(file.stat().st_size, 12000, str(file))
            text = file.read_text(encoding="utf-8").lower()
            self.assertNotIn("c:\\users\\jongo", text)
            self.assertNotIn("owner explicitly authorized", text)


if __name__ == "__main__":
    unittest.main()
