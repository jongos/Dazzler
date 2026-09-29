import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


health = module("health", ROOT / "skills/dazzler-frontend/scripts/health.py")
offline = module("offline", ROOT / "tools/offline_build.py")
import sys

sys.path.insert(
    0, str(Path(__file__).resolve().parents[1] / "skills/dazzler-frontend/scripts")
)

project = module(
    "hardening_project", ROOT / "skills/dazzler-frontend/scripts/project.py"
)


class HardeningTests(unittest.TestCase):
    def test_integrity_detects_modified_and_missing_resources(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            (root / "references").mkdir()
            file = root / "sample.mjs"
            file.write_bytes(b"local\r\n")
            (root / "references/integrity.json").write_text(
                json.dumps({"files": {"sample.mjs": health.content_digest(file)}})
            )
            self.assertEqual(health.check(root)["status"], "pass")
            file.write_bytes(b"local\n")
            self.assertEqual(health.check(root)["status"], "pass")
            file.write_text("changed")
            self.assertEqual(health.check(root)["problems"][0]["issue"], "modified")
            file.unlink()
            self.assertEqual(health.check(root)["problems"][0]["issue"], "missing")

    def test_build_restore_rejects_traversal_before_writing(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            archive = root / "offline-build.zip"
            payload = b"unsafe"
            with zipfile.ZipFile(archive, "w") as z:
                z.writestr("../escape", payload)
            (root / "manifest.json").write_text(
                json.dumps(
                    {
                        "archiveSha256": hashlib.sha256(
                            archive.read_bytes()
                        ).hexdigest(),
                        "files": {"../escape": hashlib.sha256(payload).hexdigest()},
                    }
                )
            )
            with self.assertRaises(ValueError):
                offline.restore(root, root / "output")
            self.assertFalse((root / "output").exists())

    def test_project_rejects_oversized_input(self):
        with tempfile.TemporaryDirectory() as td:
            file = Path(td) / "input.json"
            file.write_bytes(b" " * 8_000_001)
            with self.assertRaises(ValueError):
                project.read(file)
