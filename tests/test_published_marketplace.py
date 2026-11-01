import hashlib
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from tools import claude_marketplace as marketplace


class PublishedMarketplaceTests(unittest.TestCase):
    def test_published_archive_verification(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / ".claude-plugin").mkdir()
            source = {
                "source": "archive",
                "url": "https://github.com/jongos/Dazzler/releases/download/v0.32.5/dazzler-claude-plugin.zip",
                "sha256": hashlib.sha256(b"archive").hexdigest(),
            }
            path = root / ".claude-plugin/marketplace.json"

            def write():
                path.write_text(json.dumps({"plugins": [{"source": source}]}))

            write()
            with patch.object(marketplace, "ROOT", root), patch.object(
                marketplace, "urlopen", return_value=io.BytesIO(b"archive")
            ):
                marketplace.check_published()
            with patch.object(marketplace, "ROOT", root), patch.object(
                marketplace, "urlopen", return_value=io.BytesIO(b"wrong")
            ):
                with self.assertRaisesRegex(ValueError, "differs"):
                    marketplace.check_published()
            source["url"] = "https://example.com/archive.zip"
            write()
            with patch.object(marketplace, "ROOT", root), patch.object(
                marketplace, "urlopen"
            ) as fetch:
                with self.assertRaisesRegex(ValueError, "versioned"):
                    marketplace.check_published()
                fetch.assert_not_called()
