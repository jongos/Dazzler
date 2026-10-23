# Controlled Value Study

This study asks whether adding Dazzler improves the same host's output enough to justify its time, context and operational cost. It is separate from the gallery. Never regenerate or replace templates as part of a comparison.

## Protocol

The three synthetic briefs cover a public website, an operational dashboard and a printable HTML decision memo. They freeze required facts, brand accents and working interactions without prescribing composition, density or colored backgrounds. The document trial does not evaluate Word export.

Prepare a run with `python tools/compare_value.py --out NEW_DIRECTORY --model MODEL --effort EFFORT`. Explicit `--run` executes signed-in Codex trials. Use the same available model/effort for every arm. `--timeout` sets the shared wall-clock cap (default 240 seconds); `--repetitions` supports 1–5. A model alias is recorded as requested, not falsely represented as a provider snapshot. Do not silently substitute a model.

Each pair receives the same brief, local font assets, runtime permissions, output requirements and time cap. The treatment explicitly reads a frozen Dazzler snapshot. The baseline uses the host without design-skill guidance. Host skill descriptions are suppressed and personal skills disabled for these child processes only; user settings and installations are not changed. Inspect traces for contamination or denied access before claiming a valid comparison. This configuration cannot establish that hidden provider context was identical.

Arm order alternates by case and repetition. Retain every attempt, timeout and failure; do not rerun only the weaker result or repair artifacts by hand. A completed host turn is not a completed artifact. A successful traced skill read is required for treatment eligibility. All outputs, prompts, source inventory, timing and token usage remain in the new study directory. Actual costs may be unavailable; do not infer dollars from tokens without the applicable pricing.

## Review and Acceptance

1. Verify the same brief hashes, host/settings, budgets, frozen source inventory and execution access. A blocked or contaminated trial is unassessed, not a low-quality design.
2. Render eligible web artifacts at 1440×900 and 390×844 with loaded fonts. Render every document print page. Exercise the requested task, errors and empty states. Record actual screenshots, DOM/interaction results, artifact hashes and runtime conditions. Do not treat a source token check as rendered contrast.
3. Report retained requirements, factual errors, interaction failures, accessibility findings, overflow, rendering failures, elapsed time and token usage separately. Any critical factual/functional defect disqualifies that artifact from a quality win.
4. Present all paired artifacts with neutral A/B identifiers for human review, keeping the mapping separate. Ask about brief fit, hierarchy, visual coherence and preference separately. Measure correction time only when a reviewer actually performs corrections; task success only when participants actually attempt tasks. No synthetic human ratings.
5. Preserve ties and mixed results. One pair per context is an exploratory demonstration. Repeated held-out briefs and reviewers are needed before general claims. The published briefs become development cases, not future held-out tests.
6. A genuine generation demonstration must record actual execution with elapsed time. Label cuts, time compression and event-log replay explicitly; a gallery walkthrough is not a generation recording. Do not expose raw logs or account paths without reviewing them for publication.

Issue #46 is complete only with three attributable paired outputs and an honest generation demonstration. A harness, tests, failed host attempts or attractive manually created examples do not satisfy it. No live study runs in CI; fixture tests validate the evidence parser only.

## Current Status

See [the October 23 pilot report](2026-10-23.md). The full-workflow pilot is blocked by child-host execution policy; there are no eligible paired artifacts or quality results. The runner now stops on a detected policy block. No host policy is bypassed.

## Notes

Tracks [Dazzler #46](https://github.com/jongos/Dazzler/issues/46). Host workflow reference: [OpenAI skill evaluations](https://developers.openai.com/blog/eval-skills). Code and synthetic briefs are original Dazzler material, Apache-2.0. Trial fonts retain their bundled notices.
