import json
import tempfile
import unittest
from pathlib import Path
from tools.check_release_gallery import check, digest, inventory


class PreservationTests(unittest.TestCase):
    def test_preservation_rejects_stale_scope_and_changed_inventory(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            files = {
                "package.json": '{"version":"0.32.5"}',
                "skills/dazzler-frontend/SKILL.md": "skill",
                "skills/dazzler-frontend/references/integrity.json": "{}",
                "skills/dazzler-frontend/assets/templates/sample.html": "<h1>Retained</h1>",
                "docs/sample.png": "synthetic image",
            }
            for name, text in files.items():
                p = root / name
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_text(text)
            record = root / "maintenance/gallery-preservation.json"
            record.parent.mkdir()
            data = {
                "version": "0.32.5",
                "baselineCommit": "a" * 40,
                "ownerInstruction": "Preserve gallery",
                "runtimeSha256": digest(
                    root / "skills/dazzler-frontend/references/integrity.json"
                ),
                "skillSha256": digest(root / "skills/dazzler-frontend/SKILL.md"),
                "files": inventory(root),
            }
            record.write_text(json.dumps(data))
            self.assertEqual(check(root), 2)
            for name in files:
                p = root / name
                original = p.read_bytes()
                p.write_text(
                    '{"version":"0.32.6"}' if name == "package.json" else "changed"
                )
                with self.assertRaises(ValueError):
                    check(root)
                p.write_bytes(original)
            extra = root / "docs/extra.png"
            extra.write_bytes(b"new")
            with self.assertRaises(ValueError):
                check(root)
            extra.unlink()
            missing = root / "docs/sample.png"
            missing.unlink()
            with self.assertRaises(ValueError):
                check(root)

    def test_text_hashes_are_platform_independent(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "file.html"
            p.write_bytes(b"a\r\nb\r\n")
            windows = digest(p)
            p.write_bytes(b"a\nb\n")
            self.assertEqual(windows, digest(p))
