# Local Issue Remediation — 0.32.5

## Changes

- **#54:** Public installation links target published 0.30.0 while source metadata remains 0.32.5. The published-release manifest and validator check the tag, publication status and uploaded asset names. CI runs the live check once on Linux/Node 20. Release metadata tests cover source/download version separation and Gemini tag drift.
- **#55:** Read-only audit and critique plans omit component selection. Both component and engineering references explicitly prohibit design-record writes during those modes. Implementation workflows remain available.
- **#52:** Browser scanning and assessment use the existing strict 60ch body-measure rule. Findings preserve measurement precision instead of rounding failing values to passing ones. Six rendered boundary cases compare scanner findings with assessment.
- **#53:** Maintenance linting now runs in a child process with a 256 KiB UTF-8 input limit, five-second timeout, 1 MiB output limit and 128 MiB Node old-space limit. Tests use the helper and reject oversized input before execution. This is containment, not a vulnerability fix or an OS sandbox; old-space is not a total-memory cap. The upstream linter embeds Zod 3.25.76, so a package override alone would not remove that code. The advisory remains unresolved. No dependency or license was changed.

## Verification

- Full JavaScript suite: 135 passed.
- Full Python suite: 109 run, 4 skipped, no failures. Skips concern optional native Office runtimes and unavailable symlink capability.
- Targeted suites: 22 JavaScript and 4 Python checks passed, including subprocess and temporary-file checks after authorization.
- Synthetic browser review passed, including six boundary widths; no templates or thumbnails were generated.
- Live published-release tag and all 16 expected asset names verified for 0.30.0.
- Source metadata validation, local links, Prettier and Black checks passed.
- 554 existing asset and documentation-image hashes remain unchanged.

All 10 local distribution archives built and passed platform validation, including size limits, extracted runtime checks and package integrity. Final source health passed for 1,729 inventoried files. Source commit/push and managed local installation were subsequently authorized. No release publication, deployment or issue closure is included.

## Notes and Credits

The maintenance linter is supplied by `@google/design.md`; its bundled dependency remains subject to upstream remediation. Advisory: https://github.com/advisories/GHSA-mrhx-c7xc-m3w5. Other existing dependency advisories are outside these four issues and are not claimed resolved.
