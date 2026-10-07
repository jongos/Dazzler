import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]


class ReleaseMetadataTests(unittest.TestCase):
    def test_release_bump_preserves_installed_dependency_metadata(self):
        lock = json.loads((ROOT / "package-lock.json").read_text())["packages"]
        for name in ("react-dom", "scheduler"):
            path = ROOT / "node_modules" / name / "package.json"
            if not path.exists():
                self.skipTest(
                    "Install maintenance dependencies to compare their metadata"
                )
            installed = json.loads(path.read_text())
            entry = lock["node_modules/" + name]
            self.assertEqual(entry["version"], installed["version"], name)
            self.assertEqual(
                entry.get("dependencies", {}), installed.get("dependencies", {}), name
            )

    def test_all_current_version_references_and_drift_guards(self):
        spec = importlib.util.spec_from_file_location(
            "release", ROOT / "tools/validate_release.py"
        )
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        with tempfile.TemporaryDirectory() as tmp:
            module.ROOT = root = Path(tmp)
            for name in (
                "package.json",
                "package-lock.json",
                "plugin.json",
                ".codex-plugin/plugin.json",
                ".claude-plugin/plugin.json",
                ".cursor-plugin/plugin.json",
                "gemini-extension.json",
                "CHANGELOG.md",
                "README.md",
                "maintenance/ONBOARDING.md",
                "docs/index.html",
                "docs/guide.js",
                "skills/dazzler-frontend/SKILL.md",
            ):
                path = root / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes((ROOT / name).read_bytes())
            with contextlib.redirect_stdout(io.StringIO()):
                module.validate()
            path = root / "maintenance/ONBOARDING.md"
            original = path.read_text(encoding="utf8")
            for value in ("tree/v0.0.1", "--version 0.0.1", "releases/download/v0.0.1"):
                path.write_text(original + "\n" + value, encoding="utf8")
                with self.assertRaises(AssertionError):
                    module.validate()
            path.write_text(original, encoding="utf8")
            for manifest in (
                "plugin.json",
                ".claude-plugin/plugin.json",
                ".cursor-plugin/plugin.json",
                "gemini-extension.json",
            ):
                path = root / manifest
                data = json.loads(path.read_text())
                original = data["version"]
                data["version"] = "0.0.1"
                path.write_text(json.dumps(data))
                with self.assertRaises(AssertionError):
                    module.validate()
                data["version"] = original
                path.write_text(json.dumps(data))

    def test_portable_identity_and_brand_paths(self):
        portable = json.loads((ROOT / "plugin.json").read_text())
        self.assertEqual(
            portable["$schema"],
            "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
        )
        self.assertLessEqual(
            set(portable),
            {
                "$schema",
                "name",
                "version",
                "description",
                "author",
                "homepage",
                "repository",
                "license",
                "keywords",
                "extensions",
            },
        )
        codex = json.loads((ROOT / ".codex-plugin/plugin.json").read_text())
        for role in ("logo", "composerIcon"):
            path = ROOT / codex["interface"][role]
            self.assertTrue(path.is_file())
            self.assertLess(path.stat().st_size, 5 * 1024 * 1024)
        self.assertTrue(
            json.loads((ROOT / ".claude-plugin/marketplace.json").read_text())[
                "description"
            ]
        )
