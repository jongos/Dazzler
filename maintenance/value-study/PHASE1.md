# Eight-Brief Comparison Pilot

## Status

Completed on October 24, 2026. All sixteen trials finished successfully under the verified automatic-approval route, producing eight reviewable pairs across four formats. Independent agent review and native stress rendering are complete; blinded human review remains pending. See [the results](PHASE1-RESULTS.md). This pilot tests current Dazzler against the same host without Dazzler; revised Dazzler is a later condition.

The runner had specified `approval_policy="never"`. Its commands were denied before execution. A new preflight using the documented `--approve-for-me` option completed the same write/read through automatic review while retaining workspace-write sandboxing. The actual `READY` file and successful command events were verified. No global configuration, managed policy or sandbox bypass was changed. This establishes the approval-mode fix for this environment; it does not establish that every future command will be approved.

`tools/run_phase1.py` checks the successful preflight evidence, frozen skill, suite and font hashes before starting. It removes the conflicting `never` option only for this run, records automatic-review mode for both arms, and preserves prior attempts. Already attempted trials are skipped on resume. The new run is kept separate from the blocked preparation under the local `work/phase1-approved-20261024/` directory.

The first preflight could not initialize the host service in the parent sandbox. A permitted elevated parent initialized the signed-in host while retaining the child's workspace-write sandbox. The child command to write and read `READY` was rejected as `blocked by policy`. No probe file was created. The runner was not allowed to launch the sixteen design trials. No policy settings were changed during that failed attempt. The later authorized automatic-review preflight described above established the working route.

Parent-side native capability checks succeeded: a synthetic DOCX and PPTX each converted to a one-page PDF with expected text and rasterized successfully. This confirms the installed authoring/rendering path, not the child host's ability to use it. See the [sanitized preflight record](phase1-preflight-2026-10-24.json).

## Cases

| Format | Expressive / Exploratory | Restrained / Operational |
|---|---|---|
| Website | After Hours ceramics school | Northline calibration service |
| Application | Watershed observation explorer | Hearth Works repair dispatch |
| Word and PDF | Mend Together festival guide | Library upgrade decision brief |
| Slides and PDF | Echo Rooms exhibition proposal | Municipal shade pilot decision |

The [briefs](phase1-briefs.json) contain synthetic facts, required outputs and observable acceptance checks. They prescribe communication tasks rather than layouts. They are development cases once exposed, not future held-out tests. No existing gallery example is reused.

## Frozen Conditions

- Source: published commit `89895d07234cde830b20cb02ce9f6ad5a1744730`, independent of the dirty local checkout. A hash inventory preserves the exact 1,731 skill resources.
- Host: Codex CLI `0.163.0-alpha.11.2`; requested model `gpt-6-astra`, reasoning `low`, matching the inspected local configuration. These are requested settings, not a provider snapshot guarantee.
- One baseline/treatment pair per brief, 16 planned attempts. First arm alternates between cases.
- Equal 900-second caps; actual tokens and duration recorded separately. Equal caps do not guarantee equal consumption. No dollar-cost estimate is inferred.
- Identical full bundled font assets and local native-authoring/browser tools in both arms. Fonts are shared read-only rather than copied sixteen times. Each artifact copies only selected fonts and their notices.
- No external assets, browsing, installation, private material or hand-repaired outputs. Original locally authored graphics are allowed in both arms. This restriction limits conclusions about image-rich production work.
- The treatment reads the frozen skill and relevant resources. The baseline does not load design guidance. Inspect traces for contamination; catalog suppression does not prove complete isolation.

Preparation uses `tools/prepare_phase1.py` with an explicit source revision, model, effort, new output directory and a local runtime-notes file. Runtime paths and raw host logs remain in ignored `work/`; they are not portable published configuration. Preparation never invokes inference. The older three-brief suite remains intact.

## Resume Gates

1. Use a host where the existing authorized sandbox can actually write and read a synthetic file. Preserve the failed preflight. Do not disable managed policy to obtain a pass.
2. Verify native authoring and rendering for DOCX and PPTX, and browser screenshot access. Mere library imports or installed executable paths are not renderer passes.
3. Record the successful preflight evidence and conditions before clearing the manifest's generation block. If host/model/settings change, prepare a fresh run and keep both arms matched.
4. Verify suite, prompts, shared fonts and skill hashes; run the two arms without inspecting or repairing earlier outputs. Stop on host failure. Retain incomplete and failed artifacts.
5. Require the native file and PDF for Office cases. File presence only makes an output a review candidate; inspect OOXML, editability, rendered pages and stress copies separately.

## Review After Generation

Live progress is available in each run's `progress.json`. `tools/comparison_progress.py RUN_DIRECTORY --watch` refreshes it every 15 seconds, including the last event timestamp and actual output files. This observer works with the already-running legacy worker without rewriting its manifest. An unfinished event log means observed running activity, not proof of process liveness; check the process if activity stalls. New runner invocations also persist `running`, start/finish times and atomic manifest updates. Completed generation, review eligibility and independent review remain separate states.

Capture web outputs at 1440×900 and 390×844; inspect a 320px stress view and keyboard interaction. Exercise each brief's checks, including error recovery, synchronized states, missing data, reload and reset where specified. Render every document page and slide, verify facts and inspect the requested editing stress copy. Record failures separately from aesthetic judgment.

Create neutral A/B review copies after eligibility checks, with a randomized mapping kept outside the review materials. Reviewers see the brief and artifacts, not prompts, source paths or arm labels. Report task fit, hierarchy, typography, composition, distinctiveness and preference with visible reasons; preserve ties and disagreement. Human judgments remain pending until a person supplies them. Agent review is identified separately.

Compare collection structure and page roles, not just accent colors. Check that intentional brand consistency is not penalized as repetition. A critical content or functional defect blocks a quality win. Eight pairs are exploratory: report each pair, category results, failures, time and token usage rather than claiming population-level superiority or a validated 65% win rate.

## Preservation

No canonical design rules, templates or thumbnails are changed by this pilot. Compare the recorded skill and gallery inventories before and after work. Keep all probe files and trial outputs outside the gallery. No commit, push, release or installation is part of this phase.

## Notes

Runner setup follows [Codex non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode). This local host's observed policy denial takes precedence over documented capability. Synthetic briefs and evaluation code are original Dazzler work; bundled fonts retain their notices.
