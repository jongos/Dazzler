"""Run the original implicit-trigger suite in fresh real Codex sessions.

Requires a signed-in CLI. Writes raw traces locally; publish only reviewed summaries.
No expected labels enter host prompts. No model overrides or explicit skill invocation.
"""

import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills/dazzler-frontend"


def grade(stdout, stderr, exit_code):
    events = []
    for line in stdout.splitlines():
        try:
            events.append(json.loads(line))
        except ValueError:
            continue
    for event in events:
        item = event.get("item", {})
        if (
            event.get("type") == "item.completed"
            and item.get("type") == "command_execution"
            and item.get("exit_code") == 0
        ):
            command = item.get("command", "").replace("\\", "/").lower()
            output = item.get("aggregated_output", "")
            if (
                "dazzler-frontend/skill.md" in command
                and "# Dazzler Frontend" in output
                and "name: dazzler-frontend" in output
            ):
                return {
                    "observedLoaded": True,
                    "evidence": "Successful host command read candidate SKILL.md and returned its name and heading",
                }
    if "blocked by policy" in stderr:
        return {
            "status": "host-policy-blocked",
            "evidence": "Host tool execution rejected by policy; loading could not be observed",
        }
    if exit_code == 0 and any(e.get("type") == "turn.completed" for e in events):
        return {
            "observedLoaded": False,
            "evidence": "Completed host turn without a successful candidate SKILL.md read in the JSONL trace",
        }
    return {
        "status": "unavailable",
        "evidence": "Host did not complete a observable turn",
    }


def run(out, codex, disabled, timeout):
    out = Path(out).resolve()
    out.mkdir(parents=True, exist_ok=False)
    suite = json.loads((SKILL / "evals/triggering.json").read_text(encoding="utf-8"))
    text = (SKILL / "SKILL.md").read_text(encoding="utf-8")
    descriptions = {
        "baseline": suite["baselineDescription"],
        "current": re.search(r"^description: (.*)$", text, re.M)[1],
    }
    options = ["-c", "project_doc_max_bytes=0"]
    if disabled:
        options += [
            "-c",
            "skills.config=["
            + ",".join(
                "{path=" + json.dumps(str(p).replace("\\", "/")) + ",enabled=false}"
                for p in disabled
            )
            + "]",
        ]
    for variant, description in descriptions.items():
        target = out / variant / ".agents/skills/dazzler-frontend"
        shutil.copytree(SKILL, target, ignore=shutil.ignore_patterns("__pycache__"))
        (target / "SKILL.md").write_text(
            re.sub(
                r"^description: .*$", "description: " + description, text, flags=re.M
            ),
            encoding="utf-8",
        )
        subprocess.run(["git", "init", "-q", str(out / variant)], check=True)

    def trial(pair):
        variant, case = pair
        command = [
            codex,
            "exec",
            "--ignore-user-config",
            "--ephemeral",
            "--json",
            "--sandbox",
            "read-only",
            "--skip-git-repo-check",
            "-C",
            str(out / variant),
            *options,
            case["prompt"],
        ]
        row = {
            "variant": variant,
            "case": case["id"],
            "expectedLoaded": case["expectedLoaded"],
        }
        try:
            process = subprocess.run(
                command,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=timeout,
                shell=False,
            )
            raw = process.stdout
            (out / f'{variant}-{case["id"]}.jsonl').write_text(raw, encoding="utf-8")
            row.update(grade(raw, process.stderr, process.returncode))
            row["traceSha256"] = hashlib.sha256(raw.encode()).hexdigest()
            if "observedLoaded" in row:
                row["status"] = (
                    "pass"
                    if row["observedLoaded"] == case["expectedLoaded"]
                    else "fail"
                )
        except subprocess.TimeoutExpired:
            row.update(
                status="timeout",
                evidence="Host did not finish within the common timeout",
            )
        print(variant, case["id"], row["status"], flush=True)
        return row

    # Independent benchmark sessions, never cooperating agents or shared conversation state.
    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(
            pool.map(trial, [(v, c) for v in descriptions for c in suite["cases"]])
        )
    spec = importlib.util.spec_from_file_location(
        "triggering", SKILL / "scripts/triggering.py"
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    version = subprocess.run(
        [codex, "--version"], capture_output=True, text=True, check=True
    ).stdout.strip()
    report = {
        "schemaVersion": 1,
        "host": version,
        "model": "Host default; no model override; resolved model not reported by JSONL",
        "settings": {
            "sandbox": "read-only",
            "ignoreUserConfig": True,
            "ephemeral": True,
            "timeoutSeconds": timeout,
            "projectDocMaxBytes": 0,
            "repetitions": 1,
        },
        "descriptions": descriptions,
        "suiteSha256": hashlib.sha256(
            (SKILL / "evals/triggering.json").read_bytes()
        ).hexdigest(),
        "metrics": module.metrics(results),
        "results": results,
        "limitations": [
            "Original suite, not starter-derived or independently held out.",
            "Single stochastic run per prompt/description; no causal improvement claim.",
            "Policy-blocked and incomplete turns count as unrun, never passes.",
            "Raw traces stay local; this report contains only reviewed loading evidence.",
        ],
    }
    (out / "report.json").write_text(
        json.dumps(report, indent=2) + "\n", encoding="utf-8"
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", required=True)
    parser.add_argument("--codex", default="codex")
    parser.add_argument("--disable-skill-path", action="append", default=[])
    parser.add_argument("--timeout", type=int, default=60)
    args = parser.parse_args()
    run(args.out, args.codex, args.disable_skill_path, args.timeout)
