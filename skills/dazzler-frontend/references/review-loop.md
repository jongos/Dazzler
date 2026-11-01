# Execute and Inspect the Review Loop

For web interface work, use the existing workflow planner and browser checks together. Infer task, audience and constraints from the supplied brief and current project record. Reuse composition and density decisions; do not introduce a new global aesthetic or require a picker. Native documents and slides retain their native rendering workflow.

1. Implement the authorized scope. Preserve existing facts, brand, design rules and small-edit boundaries.
2. Run the command below against the actual saved output with representative desktop/mobile views and named source files. No package installation or external inference is performed. Browser navigation retains the existing origin restrictions.
3. Open `report.html`. Numbered outlines link to finding details on the actual capture. Numbers locate findings, not their severity. Inspect applicability and task impact, then use the existing traceable finding assessment to prioritize. Keep justified exceptions with reasons; do not add visual-style bans.
4. Repair applicable findings in source, then rerun into a new directory with a new revision and optional `previous` pointing to the prior `review-run.json`. Old locations are not stable across revisions; disappearing candidates do not prove a fix.
5. Complete the listed remaining checks in the existing workflow assessment: required tasks/content, visual craft, real interaction and edge cases. Do not convert a successful capture or a clean detector result into a visual-quality or accessibility pass. Audit and critique only report; they do not authorize repairs.

```sh
node scripts/review-loop.mjs review-input.json NEW_REVIEW_DIRECTORY
```

Example input (paths resolve from the current working directory):

```json
{
  "task": {"kind":"interface", "scope":"small", "intent":"audit"},
  "target":"preview/index.html",
  "revision":"saved-revision-2",
  "files":["preview/index.html", "preview/styles.css"],
  "widths":[1440,390],
  "height":900
}
```

Use actual files and revision identifiers, not the example names. Up to 64 named files, each at most 8 MB, are hashed before and after execution. This detects changes to those files, not every dependency or dynamic server state. Add relevant source files deliberately. If files change during capture, the result is stale. A missing browser runtime or execution error produces a blocked record; use permitted host tools and disclose the gap. Do not fabricate successful local execution.

The runner writes only a new review directory: the plan, captures, measured report, visible feedback and revision record. It never writes the reviewed source, installs hooks or selects a repair automatically. Reports contain project evidence; keep them local unless sharing is authorized. A report is a local review artifact, not application copy.

The overlay is a captured view, not an editor. It shows at most 100 numbered outlines per view, with all findings listed. DOM indexes and boxes are capture-local; animation or asynchronous content can change between measurement and screenshot. Verify moving content with the host browser. Unsupported measurements, bounded sampling and untested behavior remain visible gaps. Review final source and fresh captures after any repair.

## Notes and Credits

Workflow inspiration: [Impeccable](https://impeccable.style/) by Paul Bakaus, particularly continuous feedback and in-context review. Dazzler's implementation is original; no Impeccable code, dependencies or style prohibitions are imported.
