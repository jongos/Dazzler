"""Read-only local integrity and capability check. No downloads or installations."""

import hashlib
import importlib.util
import json
from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]


def content_digest(path):
    data = path.read_bytes()
    if path.suffix.lower() in (
        ".md",
        ".json",
        ".mjs",
        ".cjs",
        ".js",
        ".py",
        ".r",
        ".css",
        ".html",
        ".svg",
        ".csv",
        ".txt",
        ".yaml",
        ".yml",
    ):
        data = data.replace(b"\r\n", b"\n")
    return hashlib.sha256(data).hexdigest()


def check(root=ROOT):
    manifest = json.loads(
        (root / "references/integrity.json").read_text(encoding="utf-8")
    )
    problems = []
    for relative, expected in manifest["files"].items():
        path = (root / relative).resolve()
        if not path.is_relative_to(root.resolve()):
            raise ValueError("Unsafe inventory path")
        if not path.is_file():
            problems.append({"file": relative, "issue": "missing"})
        elif content_digest(path) != expected:
            problems.append({"file": relative, "issue": "modified"})
    return {
        "status": "pass" if not problems else "fail",
        "checkedFiles": len(manifest["files"]),
        "problems": problems,
        "core": {
            "python": sys.version.split()[0],
            "nodeAvailable": bool(shutil.which("node")),
        },
        "optional": {
            "RscriptAvailable": bool(shutil.which("Rscript")),
            "pythonDocxAvailable": importlib.util.find_spec("docx") is not None,
            "pythonPptxAvailable": importlib.util.find_spec("pptx") is not None,
        },
        "notes": [
            "Integrity is compared with the local release inventory; it is not a cryptographic signature or a security certification.",
            "Browser and native Office execution need host runtimes. Availability is not rendering verification.",
        ],
    }


if __name__ == "__main__":
    result = check()
    print(json.dumps(result, indent=2))
    sys.exit(0 if result["status"] == "pass" else 1)
