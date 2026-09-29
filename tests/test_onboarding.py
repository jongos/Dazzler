import hashlib
import importlib.util
import json
from pathlib import Path
import stat
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def module(path):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


class OnboardingTests(unittest.TestCase):
    def test_inventory_refuses_linked_children(self):
        installer = module(ROOT / "tools/install_skill.py")
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            outside = root / "outside"
            outside.mkdir()
            (outside / "private.txt").write_text("private")
            owned = root / "owned"
            owned.mkdir()
            try:
                (owned / "linked").symlink_to(outside, target_is_directory=True)
            except OSError:
                self.skipTest("Host does not permit test symlinks")
            with self.assertRaisesRegex(ValueError, "Linked path"):
                installer.inventory(owned)

    def test_starters_resolve_real_resources(self):
        skill = ROOT / "skills/dazzler-frontend"
        rows = json.loads((skill / "references/starters.json").read_text())["starters"]
        templates = {
            x["id"]
            for x in json.loads((skill / "assets/templates/catalog.json").read_text())[
                "templates"
            ]
        }
        self.assertEqual(len(rows), 19)
        self.assertEqual(len({x["id"] for x in rows}), 19)
        for row in rows:
            self.assertTrue(row["prompt"].startswith("Use $dazzler-frontend to "))
            for ref in row["references"]:
                self.assertTrue((skill / "references" / ref).is_file())
            for helper in row["helpers"]:
                path = skill / "scripts" / helper["script"]
                self.assertTrue(path.is_file())
                if helper["subcommand"]:
                    self.assertIn(
                        helper["subcommand"], path.read_text(encoding="utf-8")
                    )
            self.assertTrue(set(row["templates"]) <= templates)
            self.assertTrue(row["hostCapabilities"] and row["limitations"])
        lookup = module(skill / "scripts/starters.py")
        self.assertEqual(lookup.select("b2")[0]["id"], "B2")
        with self.assertRaises(ValueError):
            lookup.select("missing")

    def fixture(self, root, version):
        archive = root / "dazzler-codex.zip"
        with zipfile.ZipFile(archive, "w") as bundle:
            bundle.writestr("dazzler-frontend/SKILL.md", "Test " + version)
            bundle.writestr(
                "dazzler-frontend/scripts/health.py", "print('fixture health')\n"
            )
            bundle.writestr(
                "dazzler-frontend/references/package-profile.json",
                json.dumps({"version": version, "host": "codex", "profile": "full"}),
            )
        with zipfile.ZipFile(archive, "a") as bundle:
            files = {
                n.removeprefix("dazzler-frontend/"): hashlib.sha256(
                    bundle.read(n)
                ).hexdigest()
                for n in bundle.namelist()
                if n.startswith(
                    ("dazzler-frontend/scripts/", "dazzler-frontend/references/")
                )
            }
            bundle.writestr(
                "dazzler-frontend/references/integrity.json",
                json.dumps({"schemaVersion": 1, "files": files}),
            )
        sums = root / "SHA256SUMS.txt"
        sums.write_text(
            hashlib.sha256(archive.read_bytes()).hexdigest()
            + "  "
            + archive.name
            + "\n"
        )
        return archive, sums

    def test_managed_install_update_conflict_rollback_uninstall(self):
        installer = module(ROOT / "tools/install_skill.py")
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            archive, sums = self.fixture(root, "1.0.0")
            args = dict(root=root, host="codex", scope="project")
            installer.operate(
                "install",
                **args,
                archive=archive,
                checksums=sums,
                version="1.0.0",
                dry_run=True
            )
            target = root / ".agents/skills/dazzler-frontend"
            self.assertFalse(target.exists())
            installer.operate(
                "install", **args, archive=archive, checksums=sums, version="1.0.0"
            )
            with self.assertRaisesRegex(ValueError, "No previous version"):
                installer.operate("rollback", **args)
            edited = target / "personal.txt"
            edited.write_text("Keep this")
            with self.assertRaisesRegex(ValueError, "Local changes"):
                installer.operate("uninstall", **args)
            edited.unlink()
            ignore = root / ".dazzler-backups/.gitignore"
            ignore.parent.mkdir(exist_ok=True)
            ignore.write_text("# Existing rule\ncache/\n")
            archive, sums = self.fixture(root, "1.1.0")
            installer.operate(
                "install", **args, archive=archive, checksums=sums, version="1.1.0"
            )
            self.assertEqual((target / "SKILL.md").read_text(), "Test 1.1.0")
            self.assertEqual(
                (root / ".dazzler-backups/.gitignore").read_text(),
                "# Existing rule\ncache/\n*\n",
            )
            installer.operate("rollback", **args)
            self.assertEqual((target / "SKILL.md").read_text(), "Test 1.0.0")
            installer.operate("uninstall", **args)
            self.assertFalse(target.exists())
            self.assertTrue((root / ".dazzler-backups/codex-project").is_dir())

    def test_unsafe_archives_and_unmanaged_install_are_refused(self):
        installer = module(ROOT / "tools/install_skill.py")
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            for name in [
                "../outside",
                "/absolute",
                "dazzler-frontend/../escape",
                "dazzler-frontend/C:evil",
                "dazzler-frontend/CON.txt",
                "dazzler-frontend/.dazzler-install.json",
            ]:
                archive = root / "bad.zip"
                with zipfile.ZipFile(archive, "w") as bundle:
                    bundle.writestr(name, "bad")
                with self.assertRaises(ValueError):
                    installer.extract(archive, root / "stage")
            with zipfile.ZipFile(root / "bad.zip", "w") as bundle:
                link = zipfile.ZipInfo("dazzler-frontend/link")
                link.external_attr = (stat.S_IFLNK | 0o777) << 16
                bundle.writestr(link, "../outside")
            with self.assertRaises(ValueError):
                installer.extract(root / "bad.zip", root / "stage")
            target = root / ".agents/skills/dazzler-frontend"
            target.mkdir(parents=True)
            (target / "mine.txt").write_text("mine")
            with self.assertRaisesRegex(ValueError, "unmanaged"):
                installer.operate("uninstall", root, "codex", "project")
            self.assertTrue((target / "mine.txt").exists())

    def test_trace_claims_are_not_loading_evidence(self):
        adapter = module(ROOT / "tools/evaluate_codex.py")
        trace = "\n".join(
            json.dumps(x)
            for x in [
                {
                    "type": "item.completed",
                    "item": {"type": "agent_message", "text": "I used Dazzler"},
                },
                {"type": "turn.completed"},
            ]
        )
        self.assertFalse(adapter.grade(trace, "", 0)["observedLoaded"])
        self.assertNotIn("observedLoaded", adapter.grade(trace, "blocked by policy", 0))
        self.assertNotIn("observedLoaded", adapter.grade("", "", 1))
        observed = json.dumps(
            {
                "type": "item.completed",
                "item": {
                    "type": "command_execution",
                    "command": "Get-Content .agents/skills/dazzler-frontend/SKILL.md",
                    "exit_code": 0,
                    "aggregated_output": "name: dazzler-frontend\n# Dazzler Frontend",
                },
            }
        )
        self.assertTrue(adapter.grade(observed, "", 0)["observedLoaded"])

    def test_bad_hash_and_failed_health_leave_install_untouched(self):
        installer = module(ROOT / "tools/install_skill.py")
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            archive, sums = self.fixture(root, "1.0.0")
            args = dict(
                root=root,
                host="codex",
                scope="project",
                archive=archive,
                checksums=sums,
                version="1.0.0",
            )
            installer.operate("install", **args)
            target = root / ".agents/skills/dazzler-frontend/SKILL.md"
            before = target.read_bytes()
            sums.write_text("0" * 64 + "  dazzler-codex.zip\n")
            with self.assertRaisesRegex(ValueError, "checksum mismatch"):
                installer.operate("install", **args)
            self.assertEqual(target.read_bytes(), before)
            with zipfile.ZipFile(archive, "w") as bundle:
                bundle.writestr(
                    "dazzler-frontend/scripts/health.py", "raise SystemExit(1)\n"
                )
                bundle.writestr(
                    "dazzler-frontend/references/package-profile.json",
                    json.dumps(
                        {"version": "1.0.0", "host": "codex", "profile": "full"}
                    ),
                )
            sums.write_text(
                hashlib.sha256(archive.read_bytes()).hexdigest()
                + "  dazzler-codex.zip\n"
            )
            with self.assertRaises((ValueError, FileNotFoundError)):
                installer.operate("install", **args)
            self.assertEqual(target.read_bytes(), before)

    def test_archive_preflight_leaves_no_partial_files(self):
        installer = module(ROOT / "tools/install_skill.py")
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            for bad in (
                "dazzler-frontend/./bad",
                "dazzler-frontend//bad",
                "dazzler-frontend/control\x01",
                "dazzler-frontend/valid/child",
            ):
                archive = root / "bad.zip"
                with zipfile.ZipFile(archive, "w") as bundle:
                    bundle.writestr("dazzler-frontend/valid", "keep")
                    bundle.writestr(bad, "bad")
                with self.assertRaises(ValueError):
                    installer.extract(archive, root / "staged")
                self.assertFalse((root / "staged").exists())

    def test_installer_never_executes_archive_code(self):
        installer = module(ROOT / "tools/install_skill.py")
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            archive, sums = self.fixture(root, "1.0.0")
            with zipfile.ZipFile(archive) as bundle:
                contents = {n: bundle.read(n) for n in bundle.namelist()}
            contents["dazzler-frontend/scripts/health.py"] = (
                b"raise RuntimeError('Must never execute')\n"
            )
            manifest = json.loads(
                contents["dazzler-frontend/references/integrity.json"]
            )
            manifest["files"]["scripts/health.py"] = hashlib.sha256(
                contents["dazzler-frontend/scripts/health.py"]
            ).hexdigest()
            contents["dazzler-frontend/references/integrity.json"] = json.dumps(
                manifest
            ).encode()
            with zipfile.ZipFile(archive, "w") as bundle:
                for name, data in contents.items():
                    bundle.writestr(name, data)
            sums.write_text(
                hashlib.sha256(archive.read_bytes()).hexdigest()
                + "  "
                + archive.name
                + "\n"
            )
            result = installer.operate(
                "install",
                root,
                "codex",
                "project",
                archive=archive,
                checksums=sums,
                version="1.0.0",
                dry_run=True,
            )
            self.assertEqual(result["health"], "passed")


if __name__ == "__main__":
    unittest.main()
