import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
from tools import vendor_gdc, validate_release, import_recipes


class ProvenanceTests(unittest.TestCase):
    def test_blob_import_ignores_worktree_and_optimized_check_detects_drift(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            source = root / "source"
            source.mkdir()

            def git(*args):
                return subprocess.check_output(
                    ["git", "-C", str(source), *args], stderr=subprocess.STDOUT
                )

            git("init")
            git("config", "user.name", "Synthetic Tester")
            git("config", "user.email", "test@example.invalid")
            git("config", "core.autocrlf", "false")
            for name in vendor_gdc.FILES:
                path = source / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(b"original\n")
            (source / "package.json").write_text(
                json.dumps({"name": "@style-science/gdc", "version": "0.1.0"})
            )
            git("add", ".")
            git("commit", "-m", "fixture")
            revision = git("rev-parse", "HEAD").decode().strip()
            (source / "engine.mjs").write_bytes(b"uncommitted\r\n")
            with patch.object(vendor_gdc, "ROOT", root):
                vendor_gdc.vendor(source, revision=revision)
                target = root / "skills/dazzler-frontend/scripts/gdc"
                self.assertEqual((target / "engine.mjs").read_bytes(), b"original\n")
                vendor_gdc.vendor(source, check=True)
                (target / "engine.mjs").write_bytes(b"drift")
                script = (
                    "from pathlib import Path; from tools import vendor_gdc as v; v.ROOT=Path("
                    + repr(str(root))
                    + "); v.vendor(Path("
                    + repr(str(source))
                    + "), check=True)"
                )
                run = subprocess.run(
                    [sys.executable, "-O", "-c", script],
                    cwd=Path(__file__).resolve().parents[1],
                    capture_output=True,
                    text=True,
                )
                self.assertNotEqual(run.returncode, 0)
                self.assertIn("Vendored content drift: engine.mjs", run.stderr)
                with self.assertRaisesRegex(
                    ValueError, "Vendored content drift: engine.mjs"
                ):
                    vendor_gdc.vendor(source, check=True)

    def test_release_refuses_unpublished_or_unreviewed_recipes(self):
        with self.assertRaisesRegex(ValueError, "unpublished"):
            validate_release.validate_recipe_release(
                {"sourceWorkingTreeModified": True}
            )
        with self.assertRaisesRegex(ValueError, "terms"):
            validate_release.validate_recipe_release(
                {
                    "sourceWorkingTreeModified": False,
                    "redistributionTermsStatus": "pending review",
                }
            )
        validate_release.validate_recipe_release({"sourceWorkingTreeModified": False})

    def test_dirty_recipe_import_fails_before_writing(self):
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder)
            subprocess.run(
                ["git", "init", str(source)], check=True, capture_output=True
            )
            (source / "untracked.txt").write_text("synthetic")
            with self.assertRaisesRegex(ValueError, "clean committed source"):
                import_recipes.build(source)

    def test_personal_path_guard_covers_maintenance(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            subprocess.run(["git", "init", str(root)], check=True, capture_output=True)
            path = root / "maintenance" / "review.md"
            path.parent.mkdir()
            path.write_text(
                "C:"
                + chr(92)
                + "Users"
                + chr(92)
                + "ExampleOwner"
                + chr(92)
                + "private"
            )
            subprocess.run(
                ["git", "-C", str(root), "add", "."], check=True, capture_output=True
            )
            with self.assertRaisesRegex(ValueError, "maintenance/review.md"):
                validate_release.validate_personal_paths(root)
            path.write_text("%USERPROFILE%/project")
            validate_release.validate_personal_paths(root)


if __name__ == "__main__":
    unittest.main()
