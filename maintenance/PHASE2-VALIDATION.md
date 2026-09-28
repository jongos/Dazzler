# Phase 2 validation — 0.17.0

Checked September 28, 2026. Installation and onboarding implementation is ready; automatic host-loading acceptance remains incomplete.

## Observed results

- 53 Node and 41 Python tests passed. New regressions cover managed lifecycle operations, local modifications, corrupt hashes, failed extracted health, unsafe archive paths/links, unsupported trace claims and starter resource references.
- All eight archives passed structure, local-link, resource/license, size-budget and extracted-helper checks. The standalone installer is checksummed alongside them. The compact profile remains within its 24,000,000-byte expanded budget. The Claude marketplace hash matches the actual plugin ZIP; this is a locally checked manifest, not a live Claude install.
- The 19-starter gallery passed 1440/390/320-pixel reflow, font loading and keyboard disclosure checks. Desktop capture was visually reviewed. Existing gallery/manual checks passed all 30 cards, four filters and linked examples/images. Templates themselves were unchanged.
- Pinned skills CLI 1.7.0 was unpacked with lifecycle scripts disabled and its integrity checked. Isolated local-source project/user installation and removal passed. Reinstall succeeded but deleted a sentinel local edit. That demonstrated the need for managed conflict protection. These trials did not test remote directory ranking or remote Git fetch/update.
- A fresh full Codex release ZIP was installed with the new standalone installer in an isolated project. Through explicit approved desktop tool access, the agent read its SKILL.md, looked up starter D3, selected/exported licensed fonts, generated passing tokens, exported a synthetic HTML decision brief with embedded font notices, and rendered it at 1440/390 pixels. Both inspections reported no overflow or findings; desktop rendering was visually reviewed. This verifies an explicit-path functional workflow, not implicit discovery or a new host session.

The Windows x64 offline kit restored 5,913 files into a fresh directory. All three engine builds completed with Node network APIs blocked and the resulting 682-file runtime inventory matched. Optional browser and Office runtimes are still host prerequisites.

## Real triggering trial

The original 20-positive/10-negative suite was attempted once for each description in fresh ephemeral Codex CLI 0.158.0-alpha.2.1 sessions. Each variant used the same CLI-default model setting, read-only sandbox, 60-second timeout and disabled global Dazzler entry. The local native prompt catalog confirmed the isolated candidate; no explicit invocation or expected label was supplied. The CLI did not expose the resolved default model identifier.

| Description | TP | FP | FN | TN | Unrun | Precision | Recall on observed cases |
|---|---:|---:|---:|---:|---:|---|---:|
| Saved baseline | 0 | 0 | 1 | 2 | 27 | Undefined | 0 |
| Current | 0 | 0 | 1 | 2 | 27 | Undefined | 0 |

Forty-two tool-policy-blocked turns and twelve timeouts account for the 54 unrun cases. These are not passes or valid negative observations. The six completed observable turns provide no evidence of successful loading or a meaningful description comparison. Preserve this unsuccessful trial rather than claiming measured triggering quality. Raw transcripts remain local; the published report carries bounded outcome evidence and trace digests, not private host context. The suite is original coverage, not independently held-out validation; starter-derived prompts were not mixed into it.

## Host status and release gates

Claude marketplace installation/cloud upload and Grok Bot discovery, resource access, update and design-task acceptance remain unverified. Grok Bot's public documentation does not establish the specific multi-file route. Its status page deliberately does not promote a dedicated supported archive. Public skills directory availability was not verified by the available web tool.

The Phase 2 package work can ship independently. Issues requiring successful live host behavior must remain open until those observations exist. A locally valid archive, test fixture or explicit-path helper run is not a substitute. CI and public release verification are reported after publication; this source report does not pre-claim those outcomes.

## Notes and evidence

- [Redacted real Codex trial](reports/codex-triggering-2026-09-28.json)
- [Isolated skills CLI lifecycle results](reports/skills-cli-1.7.0.json)
- [Installation and update guide](ONBOARDING.md)
- [Grok Bot compatibility status](../platforms/GROK-BOT-STATUS.md)
- [Starter library](../docs/starters/index.html)

Original implementation: Jon Gosier / Dazzler, Apache-2.0. Retained libraries and fonts keep their own notices.
