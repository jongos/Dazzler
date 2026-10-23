# Default Edge-Case Review

Plan relevant cases before implementation and test the actual artifact before final delivery. Internal drafts are necessary for rendering; they are not verified deliverables. Scope checks to the affected design and its neighbors, including small edits. Use `workflow.mjs plan` and `assess` to record coverage; these helpers do not execute tests.

- Content: longest realistic labels, missing/empty values, zero and negative values, extra rows, translated text or long identifiers where relevant. Preserve facts and units.
- Layout: narrow/wide screens, 200% text sizing, wrapping, clipping, sticky overlays and reading order. Scroll only where it helps the task; never hide lost content.
- Typography and surfaces: delayed/unavailable fonts, actual script and weight coverage, hierarchy, contrast on every real surface and non-color status cues. White, neutral and colored backgrounds require the same prompt-fit judgment.
- Controls: keyboard and visible focus, empty/no-result/loading/error states, disabled/completed controls, repeated actions, invalid input, recovery and retained data. Test only states the artifact actually implements; disclose simulated behavior.
- Documents/slides: all rendered pages, longer copy and extra rows in a test copy, page breaks, repeated headers, grayscale/print readability where relevant and font substitution.

Record tested cases, evidence and results. Explain exclusions briefly. A missing runtime or untested state is unverified, never a pass. Repair observed failures and rerender. Do not claim exhaustive coverage or accessibility certification. If verification is unavailable, identify the limitation with the deliverable.
