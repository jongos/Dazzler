"""Record distributable executable and asset integrity after review and testing."""

import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1] / "skills/dazzler-frontend"
sys.path.insert(0, str(ROOT / "scripts"))
from health import content_digest

files = {}
for directory in ("scripts", "assets", "references"):
    for path in sorted((ROOT / directory).rglob("*")):
        if (
            path.is_file()
            and "__pycache__" not in path.parts
            and path.name != "integrity.json"
        ):
            files[path.relative_to(ROOT).as_posix()] = content_digest(path)
(ROOT / "references/integrity.json").write_text(
    json.dumps({"schemaVersion": 1, "files": files}, indent=2) + "\n", encoding="utf-8"
)
print(f"Sealed {len(files)} files")
