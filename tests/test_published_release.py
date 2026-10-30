import unittest
from tools.check_release_links import validate_remote


class PublishedReleaseTests(unittest.TestCase):
    def test_public_release_and_uploaded_assets(self):
        meta = {"version": "1.2.3", "assets": ["skill.zip"]}
        release = {
            "tag_name": "v1.2.3",
            "draft": False,
            "published_at": "2026-10-30",
            "assets": [{"name": "skill.zip", "state": "uploaded"}],
        }
        tag = {"ref": "refs/tags/v1.2.3"}
        validate_remote(meta, release, tag)
        for changed in [
            {**release, "draft": True},
            {**release, "assets": []},
            {**release, "published_at": None},
            {**release, "tag_name": "v9.0.0"},
        ]:
            with self.assertRaises(ValueError):
                validate_remote(meta, changed, tag)
        with self.assertRaises(ValueError):
            validate_remote(meta, release, {"ref": "refs/heads/main"})
