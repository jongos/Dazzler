# Generative Design Canvas

Style Science owns the independent GDC core at [jongos/style-science](https://github.com/jongos/style-science). Dazzler consumes a versioned, hash-recorded copy in `scripts/gdc/`. The core supports JavaScript and Python. HTML is the initial rendering adapter, including React/Vue output; it is not the core implementation language.

For substantial HTML documents and interfaces, author a verification plan using [the example](../scripts/gdc/example-plan.json) and [schema](../scripts/gdc/plan.schema.json). Translate explicit content, style locks, contrast requirements and target viewports into requirements. Preserve the actual native implementation. Do not turn subjective preferences into hard constraints or routinely ask users for mathematical inputs.

Capture each declared environment with a host-provided Playwright Page and `capture(page, plan, environmentId)` from `scripts/gdc/html.mjs`. Set viewport/theme, render the actual artifact and exercise the relevant state before capture. The adapter does not navigate, launch a browser or install anything. Other collection tools may produce the same snapshot contract; disclose their provenance and coverage.

Run `node scripts/gdc/engine.mjs plan.json snapshots.json` or `python scripts/gdc/gdc.py plan.json snapshots.json`. Both return pass, fail or unknown, with per-requirement measurements. Exit 0 means all declared checks passed; 2 is fail/unknown; 1 is invalid input. Missing environments, mismatched plan hashes and unsupported paint produce unknown, never pass. A failed required check excludes a candidate until repaired. Preserve the plan, observations and report with the artifact.

Coverage is deliberately narrow: horizontal document overflow, declared text presence/layout visibility, explicit computed-style locks, and declared opaque sRGB text/background pairs. It does not prove absence of overlap or clipping, font glyph coverage, keyboard behavior, chart truth, page-break quality or complete accessibility. The contrast collector supports leaf text with its own opaque solid background and no detected effects; gradients, inherited fills and complex paint need other measurements. Do not redesign an artifact merely to satisfy the collector's limitations.

Use the existing delivery gates for everything else. Record GDC reports as evidence for their specific measurements; they cannot pass distinction or replace final rendered review. Compare feasible candidates using the prompt and actual composition. There is no validated aesthetic ranking, universal weights, learned generator or demonstrated quality gain. DOCX, slides and motion retain their existing native workflows.

The external core preserves Dazzler reference knowledge with provenance and a curated executable registry. Imported guidance remains mixed guidance until individual claims are formalized. Existing mathematical palette exploration remains in the color engine; future migration must retain its numerical and legacy-output tests.

Research follows the core's evaluation protocol: compute-matched baseline, isolated representation/verification ablations, blinded human and task outcomes, and preregistration before data collection. Runtime portability and quality transfer are separate claims. Non-significance is not equivalence.
