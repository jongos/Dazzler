import importlib.util
import json
from pathlib import Path
import platform
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location(
    "offline_build", Path(__file__).resolve().parents[1] / "tools/offline_build.py"
)
kit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(kit)


class RestorePathTests(unittest.TestCase):
    def restore_entries(self, entries, reject=True):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            archive = root / "offline-build.zip"
            with zipfile.ZipFile(archive, "w") as z:
                for name, data in entries:
                    z.writestr(name, data)
            (root / "manifest.json").write_text(
                json.dumps(
                    {
                        "archive": archive.name,
                        "archiveSha256": kit.sha(archive.read_bytes()),
                        "platform": platform.system(),
                        "architecture": platform.machine(),
                        "files": {name: kit.sha(data) for name, data in entries},
                    }
                )
            )
            target = root / "restored"
            if reject:
                with self.assertRaises(ValueError):
                    kit.restore(root, target)
                self.assertFalse(target.exists(), "Reject before writing any files")
            else:
                kit.restore(root, target)
                for name, data in entries:
                    self.assertEqual((target / name).read_bytes(), data)

    def test_rejects_aliases_and_nonportable_names(self):
        for name in (
            "./readme.txt",
            "folder//readme.txt",
            "readme.txt.",
            "NUL.txt",
            "COM\u00b9.log",
            "LPT\u00b2.txt",
            "con.anything",
            "nested/aux/config",
            "name ",
            "a\x01.txt",
        ):
            with self.subTest(name=name):
                self.restore_entries([("readme.txt", b"first"), (name, b"second")])

    def test_rejects_case_collisions(self):
        self.restore_entries([("readme.txt", b"first"), ("README.TXT", b"second")])
        self.restore_entries([("FOLDER", b"first"), ("folder/child.txt", b"second")])

    def test_rejects_parent_file_collision_before_writes(self):
        self.restore_entries([("folder", b"first"), ("folder/child.txt", b"second")])

    def test_restores_valid_nested_files(self):
        self.restore_entries(
            [("folder/a.txt", b"a"), ("folder/b.txt", b"b")], reject=False
        )
