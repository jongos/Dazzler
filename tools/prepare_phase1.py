"""Freeze a Git revision and prepare eight paired trials; never invokes inference."""

import argparse
import io
import json
from pathlib import Path
import subprocess
import zipfile

from compare_value import ROOT, prepare, inventory, write_manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--revision", required=True)
    parser.add_argument("--model", required=True)
    parser.add_argument("--effort", required=True)
    parser.add_argument("--runtime-notes", type=Path, required=True)
    parser.add_argument("--timeout", type=int, default=900)
    parser.add_argument(
        "--suite",
        type=Path,
        default=ROOT / "maintenance/value-study/phase1-briefs.json",
    )
    parser.add_argument("--repetitions", type=int, default=1)
    args = parser.parse_args()
    revision = subprocess.check_output(
        ["git", "rev-parse", "--verify", args.revision + "^{commit}"],
        cwd=ROOT,
        text=True,
    ).strip()
    out = args.out.resolve()
    out.mkdir(parents=True, exist_ok=False)
    protected = {
        relative: inventory(ROOT / relative)
        for relative in ["skills/dazzler-frontend", "docs/templates"]
    }
    (out / "protected-before.json").write_text(
        json.dumps(protected, indent=2), encoding="utf-8"
    )
    archive = subprocess.check_output(
        ["git", "archive", "--format=zip", revision, "skills/dazzler-frontend"],
        cwd=ROOT,
    )
    source = out / "source"
    with zipfile.ZipFile(io.BytesIO(archive)) as z:
        for entry in z.infolist():
            target = (source / entry.filename).resolve()
            if not target.is_relative_to(source.resolve()):
                raise ValueError("Archive path outside snapshot")
            if entry.is_dir():
                target.mkdir(parents=True, exist_ok=True)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(z.read(entry))
    manifest = prepare(
        out / "trials",
        args.model,
        args.effort,
        args.timeout,
        args.repetitions,
        suite_path=args.suite,
        skill_source=source / "skills/dazzler-frontend",
        runtime_notes=args.runtime_notes.read_text(encoding="utf-8"),
        all_fonts=True,
    )
    manifest.update(
        sourceRevision=revision,
        pilot="phase1-eight-briefs",
        generationGate="blocked-pending-successful-host-preflight",
    )
    write_manifest(out / "trials", manifest)
    (out / "trials/suite.json").write_bytes(args.suite.read_bytes())
    print(
        json.dumps(
            {
                "revision": revision,
                "trials": len(manifest["trials"]),
                "manifest": str(out / "trials/manifest.json"),
            }
        )
    )


if __name__ == "__main__":
    main()
