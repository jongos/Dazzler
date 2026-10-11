# Generative Design Canvas

For substantial interfaces and HTML documents, use the offline consumer to check which instruments are available:

```shell
node scripts/style-science.mjs
node scripts/style-science.mjs --input review.json
```

This optional consumer requires Node 22+. Other Dazzler workflows keep their existing runtime requirements. Unsupported runtimes, missing modules and unknown checks fall back to existing design rules and native delivery gates. No network requests, model calls, browser installation or automatic design changes occur. Python 3.10+ consumers are also available in `scripts/gdc/`.

## Measure the Actual Implementation

Author a verification plan using [the example](../scripts/gdc/example-plan.json) and [schema](../scripts/gdc/plan.schema.json). Translate explicit content, style locks, contrast requirements and viewports into requirements. Do not turn preferences into hard constraints or ask users for mathematical inputs by default.

Capture each declared environment with an existing Playwright Page and `capture(page, plan, environmentId)` from `scripts/gdc/html.mjs`. Render the real artifact and exercise its relevant state first. The adapter does not launch or navigate a browser. Other collectors can supply the same snapshot contract when their provenance and coverage are recorded.

Run `node scripts/gdc/engine.mjs plan.json snapshots.json` or `python scripts/gdc/gdc.py plan.json snapshots.json`. Missing environments, stale plan hashes and unsupported paint remain unknown. Required failures exclude a candidate until repaired. Preserve the plan, observations and report with the artifact.

Coverage is narrow: horizontal overflow, declared text presence/layout visibility, computed-style locks and opaque sRGB text/background pairs. It does not prove absence of overlap, font coverage, keyboard behavior, truthful charts, pagination or complete accessibility. Complex paint needs other measurements; do not redesign merely to satisfy a collector.

## Compare Coherent Candidates

Use `operation: "comparison"` with `plan`, `baseline`, `candidate` and `spec`. Each artifact supplies an ID, revision, snapshots and outcomes. Each outcome identifies the environment, metric, unit, instrument, context, artifact revision and lower/upper measurement bounds; its source must be `measurement`. The spec names the context and metrics with a direction and practical minimum effect.

Use meaningful outcomes such as measured task duration or overflow under the same conditions. Missing observations, changed revisions and incompatible units stay unknown. Bounds yield improved, worsened, negligible or inconclusive results; they are not confidence intervals or aesthetic scores. A blocked candidate cannot win through another metric. Tradeoffs, visual craft and final selection remain with the agent and user.

## Assess Existing Model Evidence

Only when authorized observations already exist, use `operation: "decision"` with `plan`, `snapshots`, `contract` and `observations`. A contract names the decision, required textual context, complete design options and explicit abstention options. New contracts use `identityPolicy: "1.0.0"`.

Bind baseline, reordered and relabeled observations to the exact contract fingerprint. Retain provider, requested model and resolved model separately. Aliases, bare digests and unknown providers are unpinned; mixed identities, stale bindings, ties, disagreement and missing context cannot become a confident recommendation. The reviewed identity policy is not a model recommendation or authentication mechanism. Never restamp historical judgments as new evidence.

An upstream `releaseEligible` field describes version-pinned advisory evidence only. Dazzler's wrapper always leaves automatic action and release permission false. No model agreement establishes beauty or replaces a rendered check. Never transmit a brief or call a provider merely because this helper exists.

## Keep Native Gates

User and brand requirements remain first. Recipes remain adaptable starting points; the existing dataset has not changed. Keep typography, composition, content, responsive, accessibility and native Word/slide gates. These instruments do not select templates automatically or replace creative generation and visual review.

The upstream consumer contract currently supports core verification, advisory decisions and bounded comparisons. Language, relations, retrieval, rendered inspection, token interchange, native DOCX adapters and constraint-repair experiments remain outside this shipped integration. Their research status does not justify default design rules.

## Notes and Provenance

Adapted from Jon Gosier's [Style Science](https://github.com/jongos/style-science), Apache-2.0, pinned to `1b28e8e6cb4572e4aafc7814b65de0f576cc5907`. Original module bytes and licenses are retained in `scripts/gdc/`; `provenance.json` records hashes and `SOURCE.json` supports capability inspection. Local inventory consistency is not independent authentication. Research and incomplete working-tree changes are not imported.
