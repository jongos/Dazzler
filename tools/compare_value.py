"""Prepare/run isolated synthetic same-brief trials. No automatic grading or publication.

No command runs without --run. All attempts, prompts, logs and timings are retained.
This is a descriptive pilot, not a causal or population-level quality estimate.
"""

import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import time
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills/dazzler-frontend"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def inventory(root):
    return {
        p.relative_to(root).as_posix(): digest(p)
        for p in sorted(root.rglob("*"))
        if p.is_file() and "__pycache__" not in p.parts
    }


def trace_summary(raw, stderr=""):
    events = []
    for line in raw.splitlines():
        try:
            events.append(json.loads(line))
        except ValueError:
            continue
    completed = any(e.get("type") == "turn.completed" for e in events)
    reads = []
    for event in events:
        item = event.get("item", {})
        if (
            event.get("type") == "item.completed"
            and item.get("type") == "command_execution"
            and item.get("exit_code") == 0
        ):
            output = item.get("aggregated_output", "")
            if "# Dazzler Frontend" in output and "name: dazzler-frontend" in output:
                reads.append(item.get("id"))
    usage = next(
        (e.get("usage") for e in reversed(events) if e.get("type") == "turn.completed"),
        None,
    )
    return {
        "turnCompleted": completed,
        "skillReadEvents": reads,
        "usage": usage,
        "executionPolicyBlocked": "blocked by policy" in stderr.lower(),
    }


def prepare(out, model, effort, timeout, repetitions):
    out = Path(out).resolve()
    if out.is_relative_to(SKILL.resolve()) or SKILL.resolve().is_relative_to(out):
        raise ValueError("Trial output must not overlap the skill source")
    if not 30 <= timeout <= 1800 or not 1 <= repetitions <= 5:
        raise ValueError("Timeout must be 30–1800 seconds and repetitions 1–5")
    for value in (model, effort):
        if not value.strip() or len(value) > 120:
            raise ValueError("Explicit model and effort required")
    out.mkdir(parents=True, exist_ok=False)
    suite_path = ROOT / "maintenance/value-study/briefs.json"
    suite = json.loads(suite_path.read_text(encoding="utf-8"))
    # A single frozen skill copy, never a live mutable source during the experiment.
    snapshot = out / "skill/dazzler-frontend"
    shutil.copytree(SKILL, snapshot, ignore=shutil.ignore_patterns("__pycache__"))
    skill_hashes = inventory(snapshot)
    (out / "skill-inventory.json").write_text(
        json.dumps(skill_hashes, indent=2) + "\n", encoding="utf-8"
    )
    disabled = []
    for base in [Path.home() / ".codex/skills", Path.home() / ".agents/skills"]:
        if base.exists():
            disabled.extend(
                str(p.parent.resolve()).replace("\\", "/")
                for p in base.rglob("SKILL.md")
            )
    options = [
        "-c",
        "project_doc_max_bytes=0",
        "-c",
        "skills.max_context_tokens=1",
        "-c",
        "skills.config=["
        + ",".join(
            "{path=" + json.dumps(p) + ",enabled=false}" for p in sorted(set(disabled))
        )
        + "]",
        "-c",
        'approval_policy="never"',
        "-c",
        "model_reasoning_effort=" + json.dumps(effort),
    ]
    cases = []
    for rep in range(repetitions):
        for i, case in enumerate(suite["cases"]):
            # Counterbalance first arm; all attempts remain in the record.
            for arm in (
                ["baseline", "dazzler"]
                if (i + rep) % 2 == 0
                else ["dazzler", "baseline"]
            ):
                folder = out / f"{case['id']}-{rep+1}-{arm}"
                folder.mkdir()
                for family in ["inter", "eb-garamond"]:
                    shutil.copytree(
                        SKILL / "assets/fonts" / family, folder / "fonts" / family
                    )
                shared = (
                    "Synthetic controlled design task. Work only in this trial directory. Do not inspect neighboring trials, memory, private files or other projects. "
                    "Do not browse, install dependencies, use external services, deploy or commit. "
                    "You may use the available local Node/Python and Playwright runtimes for checks. "
                    "Both trial arms receive the same Inter and EB Garamond font files and notices in fonts/. Use these or system fallbacks; no remote assets. "
                    "Create the artifact from the brief, review it with available tools, and finish within the assigned wall-clock budget. "
                    "Do not copy an existing example or template. Write a concise REVIEW.md with actual checks and limitations; no invented evidence.\n\n"
                )
                instruction = (
                    f"Use Dazzler by reading {snapshot.as_posix()}/SKILL.md and relevant resources. That skill directory is the only permitted read outside this trial besides local runtimes.\n"
                    if arm == "dazzler"
                    else "Use your ordinary design ability without loading any design skill or external design guidance.\n"
                )
                prompt = (
                    shared
                    + instruction
                    + f"Budget: {timeout} seconds.\n\n"
                    + case["prompt"]
                )
                (folder / "prompt.txt").write_text(prompt, encoding="utf-8")
                cases.append(
                    {
                        "id": case["id"],
                        "repetition": rep + 1,
                        "arm": arm,
                        "folder": folder.name,
                        "briefSha256": hashlib.sha256(
                            case["prompt"].encode()
                        ).hexdigest(),
                        "promptSha256": digest(folder / "prompt.txt"),
                        "status": "not-run",
                    }
                )
    manifest = {
        "schemaVersion": 1,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "modelRequested": model,
        "effortRequested": effort,
        "timeoutSeconds": timeout,
        "repetitions": repetitions,
        "suiteSha256": digest(suite_path),
        "skillInventorySha256": digest(out / "skill-inventory.json"),
        "options": options,
        "selection": "All attempts; first completed output without maintainer repair. Alternating arm order.",
        "limitations": [
            "Requested model alias is not a provider snapshot pin.",
            "Host catalog suppression and instructions reduce contamination but do not prove isolation of provider/system context.",
            "Equal wall-clock caps are not equal token consumption; record actual usage.",
            "HTML print document only; native Word behavior is not evaluated.",
            "No human preference, task success or aesthetic superiority is inferred from captures or tests.",
        ],
        "trials": cases,
    }
    write_manifest(out, manifest)
    return manifest


def write_manifest(out, manifest):
    (out / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )


def run(out, manifest, codex, limit=None):
    if limit is not None and not 1 <= limit <= len(manifest["trials"]):
        raise ValueError("Trial limit is outside the prepared range")
    executable = shutil.which(codex)
    if not executable:
        raise ValueError("Codex CLI unavailable")
    manifest["hostVersion"] = subprocess.run(
        [executable, "--version"], capture_output=True, text=True, timeout=30
    ).stdout.strip()
    for trial in manifest["trials"][:limit]:
        folder = out / trial["folder"]
        command = [
            executable,
            "exec",
            "--ignore-user-config",
            "--ephemeral",
            "--json",
            "--sandbox",
            "workspace-write",
            "--skip-git-repo-check",
            "-m",
            manifest["modelRequested"],
            "-C",
            str(folder),
            *manifest["options"],
            "-",
        ]
        trial["startedAt"] = datetime.now(timezone.utc).isoformat()
        trial["command"] = command
        start = time.monotonic()
        # Files retain partial output on timeout instead of discarding a failed attempt.
        with (folder / "events.jsonl").open("w", encoding="utf-8") as stdout, (
            folder / "stderr.txt"
        ).open("w", encoding="utf-8") as stderr:
            try:
                result = subprocess.run(
                    command,
                    input=(folder / "prompt.txt").read_text(encoding="utf-8"),
                    text=True,
                    encoding="utf-8",
                    stdout=stdout,
                    stderr=stderr,
                    cwd=folder,
                    timeout=manifest["timeoutSeconds"],
                    shell=False,
                )
                trial.update(
                    status="completed" if result.returncode == 0 else "host-failed",
                    exitCode=result.returncode,
                )
            except subprocess.TimeoutExpired:
                trial["status"] = "timeout"
            except OSError as error:
                trial.update(status="unavailable", error=str(error))
        trial["seconds"] = round(time.monotonic() - start, 3)
        trial.update(
            trace_summary(
                (folder / "events.jsonl").read_text(encoding="utf-8", errors="replace"),
                (folder / "stderr.txt").read_text(encoding="utf-8", errors="replace"),
            )
        )
        if trial["executionPolicyBlocked"]:
            trial["status"] = "host-policy-blocked"
        trial["artifactPresent"] = (folder / "index.html").is_file()
        trial["files"] = inventory(folder)
        trial["reviewStatus"] = "not-run"
        # Do not infer successful generation from the child's exit code.
        trial["eligibleForReview"] = (
            trial["status"] == "completed"
            and trial["turnCompleted"]
            and trial["artifactPresent"]
            and (
                bool(trial["skillReadEvents"])
                if trial["arm"] == "dazzler"
                else not trial["skillReadEvents"]
            )
        )
        write_manifest(out, manifest)
        print(
            trial["folder"],
            trial["status"],
            "artifact",
            trial["artifactPresent"],
            "eligible",
            trial["eligibleForReview"],
            flush=True,
        )
        if trial["status"] == "host-policy-blocked" or (
            trial["status"] in ["host-failed", "unavailable"]
            and not trial["turnCompleted"]
        ):
            manifest["stoppedReason"] = (
                "Host failed; remaining trials retained as not-run"
            )
            break
    if inventory(out / "skill/dazzler-frontend") != json.loads(
        (out / "skill-inventory.json").read_text()
    ):
        manifest["invalidated"] = "Frozen skill changed during trials"
    write_manifest(out, manifest)


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--model", required=True)
    p.add_argument("--effort", required=True)
    p.add_argument("--timeout", type=int, default=240)
    p.add_argument("--repetitions", type=int, default=1)
    p.add_argument("--run", action="store_true")
    p.add_argument("--codex", default="codex")
    p.add_argument("--limit", type=int)
    a = p.parse_args()
    manifest = prepare(a.out, a.model, a.effort, a.timeout, a.repetitions)
    if a.run:
        run(a.out.resolve(), manifest, a.codex, a.limit)
    print(a.out.resolve() / "manifest.json")
