"""Measure implicit loading with a real host adapter; absent observations are never passes."""

import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess

SKILL = Path(__file__).resolve().parents[1]


def run(out, host, command=None, timeout=120):
    if command is not None and (
        not isinstance(command, list)
        or not command
        or not all(isinstance(x, str) for x in command)
    ):
        raise ValueError("Command must be a JSON argv array")
    if not host.strip() or timeout < 1:
        raise ValueError("Provide a host and positive timeout")
    out = Path(out).resolve()
    out.mkdir(parents=True, exist_ok=False)
    suite = json.loads((SKILL / "evals/triggering.json").read_text(encoding="utf-8"))
    current = re.search(
        r"^description: (.*)", (SKILL / "SKILL.md").read_text(encoding="utf-8"), re.M
    ).group(1)
    results = []
    for variant, description in [
        ("baseline", suite["baselineDescription"]),
        ("current", current),
    ]:
        for case in suite["cases"]:
            folder = out / variant / case["id"]
            folder.mkdir(parents=True)
            # Keep the expected result out of the host request to avoid leaking the answer.
            request = {
                "prompt": case["prompt"],
                "candidateSkill": {
                    "name": "dazzler-frontend",
                    "description": description,
                },
                "outputFile": str(folder / "observation.json"),
            }
            request_file = folder / "request.json"
            request_file.write_text(json.dumps(request, indent=2), encoding="utf-8")
            row = {
                "variant": variant,
                "case": case["id"],
                "expectedLoaded": case["expectedLoaded"],
                "status": "not-run",
            }
            if command:
                args = [
                    x.replace("{request_file}", str(request_file)).replace(
                        "{output_dir}", str(folder)
                    )
                    for x in command
                ]
                try:
                    process = subprocess.run(
                        args,
                        cwd=folder,
                        capture_output=True,
                        text=True,
                        timeout=timeout,
                        shell=False,
                    )
                    row["exitCode"] = process.returncode
                    if process.returncode:
                        row["status"] = "runner-failed"
                    elif not (folder / "observation.json").is_file():
                        row["status"] = "missing-observation"
                    else:
                        raw = (folder / "observation.json").read_bytes()
                        observation = json.loads(raw)
                        if (
                            type(observation.get("loaded")) is not bool
                            or not isinstance(observation.get("evidence"), str)
                            or not observation["evidence"].strip()
                        ):
                            raise ValueError(
                                "Observation needs boolean loaded and nonempty host evidence"
                            )
                        row.update(
                            observedLoaded=observation["loaded"],
                            evidence=observation["evidence"],
                            observationSha256=hashlib.sha256(raw).hexdigest(),
                            status=(
                                "pass"
                                if observation["loaded"] == case["expectedLoaded"]
                                else "fail"
                            ),
                        )
                except subprocess.TimeoutExpired:
                    row["status"] = "timeout"
                except (OSError, ValueError) as error:
                    row.update(status="invalid-or-unavailable", error=str(error))
            results.append(row)
    summary = {
        v: {
            "observed": sum(
                r["status"] in ("pass", "fail") for r in results if r["variant"] == v
            ),
            "passed": sum(r["status"] == "pass" for r in results if r["variant"] == v),
        }
        for v in ("baseline", "current")
    }
    report = {
        "schemaVersion": 1,
        "host": host,
        "summary": summary,
        "results": results,
        "notes": "A host adapter must observe actual skill loading in a fresh session. Fixture tests validate this harness, not host selection behavior.",
    }
    (out / "triggering.json").write_text(
        json.dumps(report, indent=2) + "\n", encoding="utf-8"
    )
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--command-file")
    parser.add_argument("--timeout", type=int, default=120)
    args = parser.parse_args()
    try:
        print(
            json.dumps(
                run(
                    args.out,
                    args.host,
                    (
                        json.loads(Path(args.command_file).read_text())
                        if args.command_file
                        else None
                    ),
                    args.timeout,
                ),
                indent=2,
            )
        )
    except (OSError, ValueError) as error:
        parser.exit(1, str(error) + "\n")
