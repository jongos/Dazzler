---
name: dazzler-frontend
description: Automatically design and refine interfaces, branded documents and slides. Import brand evidence, choose licensed fonts and assets, generate measured tokens and chart palettes, implement and inspect. Offer controls only when requested; preserve the user's brand and stack.
license: Apache-2.0; see LICENSE.txt
---

# Dazzler Frontend

When asked to update this skill or its plugin, read [MAINTENANCE.md](MAINTENANCE.md) first. It identifies the canonical GitHub source and the owner-authorized workflow for pushing updates with developer notes. It does not apply to projects created using this skill.

Adapted and modified on 2026-09-28 from davila7/claude-code-templates, creative-design/frontend-design. This version adds ChatGPT/Codex tool routing and verification, and revises the workflow to preserve existing brands and user scope. See [provenance](PROVENANCE.md).

Create a usable interface whose visual identity follows its subject and audience. Make deliberate choices instead of applying the same aesthetic to every project. An explicit brief, reference, or established design system takes precedence over novelty.

## Automatic by default

`Use $dazzler-frontend to ...` is enough. Follow [the automatic workflow](references/automatic-workflow.md): understand the task, choose a coherent direction, run the relevant font and color helpers yourself, implement, inspect and refine. The user does not need to select a mood, font, palette, harmony, component library or layout, run commands, or approve routine aesthetic choices. Infer reasonable choices from the brief and available context and complete the requested deliverable. A progress explanation is not an approval gate.

Keep internal candidate comparisons and helper configuration out of the user's way. Deliver one considered result with a brief rationale, not a menu of decisions or an offer to start. “Best” means best fit for the task under the available evidence, then checked in context; a heuristic score alone does not decide quality.

Switch to [optional refinement controls](references/design-controls.md) only when the user asks for alternatives, wants to choose, or requests a tweak. Preserve all choices they have already supplied. Ask a necessary question only when the task itself cannot be responsibly completed from context, such as an indispensable missing input or contradictory non-negotiable requirements; uncertain taste is not a blocker. External-action permissions still apply.

## Design from purpose

For substantial new interfaces, redesigns or requests to make a UI less generic, use [the adapted deslop framework](references/deslop.md), credited to **Samuel Berthe (samber)**. It connects artifact type and audience to a design direction, tokens, component states and a review of the actual result. Inspect existing design records and tokens first. Infer a useful direction from the brief without mandatory approval gates, preserve brand choices, and reuse the [design-record guide](references/design-record.md) when durable project documentation is warranted. For a small edit, apply only the relevant [interface craft](references/interface-craft.md); do not expand it into a redesign.

## Make typography a design foundation

When the brief leaves fonts open, automatically choose a best-fit face for the project's audience, content, reading task and visual character. Read [the typography workflow](references/typography.md) for selection and implementation, then consult relevant entries in [the font catalog](references/font-catalog.md). The catalog covers all 25 families found on Open Foundry on 2026-09-28; 24 families have licensed, unmodified files bundled in `assets/fonts/`.

Filter by actual character coverage, needed weights/italics, technical features and loading budget before comparing subjective character. Typography includes hierarchy, measure, spacing and rendering, not just a font name. Choose and implement without asking for a routine font approval when a suitable bundled option is available and project edits are authorized. Explain the choice briefly. Preserve established brand fonts, never silently replace a missing language/style requirement, and use the workflow's exact-source guidance when manual approval or desktop installation is necessary.

## Establish the direction

When choosing or substantially changing colors, follow [the color workflow](references/color-workflow.md). Infer mood and audience from the brief, preserve locked brand colors, and select contextual inspiration from the attributed palette catalog or generate from a brand seed. Use perceptual ramps and measured semantic roles for light/dark themes; never treat color harmony or a mood label as evidence of accessible contrast. The optional offline helper generates CSS tokens, provenance, contrast reports and a reviewable preview. If constraints conflict it reports no match instead of silently changing locked colors. Review the actual interface with the chosen typography, non-color state cues and keyboard focus before delivery.

Identify the product, audience, main task, content, and constraints from the request and available project context. Inspect relevant existing screens and components before changing an interface. Infer unspecified aesthetic preferences and proceed; do not treat them as missing requirements that need questions. Do not invent company facts, testimonials, performance claims, or customer logos to fill a layout. Mark illustrative data clearly.

For a substantial new design, briefly describe a coherent visual direction before implementing it:

- Palette: a small set of named color tokens and their roles.
- Typography: one or two appropriate families, clear hierarchy, readable measure, and intentional spacing.
- Composition: content order, alignment, density, responsive behavior, and the element that deserves the most attention.
- Identity: a concrete connection between the subject matter and the visual decisions.

For a small edit, apply the existing tokens directly. Avoid turning a minor adjustment into a redesign or a mandatory planning ceremony.

## Design with purpose

Choose the opening treatment around what users need to understand or do first. A useful demonstration, image, headline, or primary task can each lead; dashboards need not acquire marketing heroes.

Use typography to communicate hierarchy and personality. Favor readable body measures, often around 45–80 characters, with spacing suited to the typeface. Respect supplied fonts and practical loading constraints; include fallbacks.

Make borders, labels, grouping, and numbering express relationships. Number items when sequence or rank matters. Use cards when they clarify independent objects. A headline accent, all-caps label, decorative gradient, monospace caption, or repeated card grid should have a reason in the brief rather than appear automatically. These are options, not forbidden styles.

Concentrate expressive detail where it earns attention. Keep surrounding navigation and controls legible. Use motion to explain state changes; limit unsolicited animation and respect reduced-motion preferences.

Write concise interface copy from the user's perspective. Name actions by their outcome, use consistent vocabulary, and make empty and error states explain the next useful step. Keep implementation terminology out of ordinary user flows unless it helps a decision.

## Use the integrated design studio

For a new document or interface whose structure matches a bundled starting point, use [the template library](references/templates.md). It provides ten DOCX documents, ten matching HTML documents and ten UI folders. Select the best fit automatically, export it with `scripts/templates.py`, and adapt its content, typography and colors to the brief. Preserve the accompanying licenses and test the customized output; existing brand systems take priority.

For relevant tasks, follow [the studio workflows](references/design-studio.md). The agent selects and runs these tools internally; the user still only supplies a brief. Do not run every tool for every task.

- Extend an existing identity with the CSS/rendered brand importer; resolve conflicting evidence against authoritative project rules before making locks.
- Generate shared typography, color, spacing, radius, elevation and motion tokens. Export CSS, supported DTCG primitives and Tailwind adapters appropriate to the actual project version.
- Use the font pairing lab to compare actual copy, available styles, local loading and fallback wrapping. Choose contextually, not by a single score.
- Generate chart-specific palettes with stable series IDs, patterns, marker/dash cues and measured graphic contrast; add direct labels and text/table equivalents.
- Select original licensed icons/illustrations from the asset catalog when they serve the content; preserve an existing brand system.
- Inspect rendered layouts and stress-test long copy, numbers, empty data, missing imagery and errors. Review candidates before editing; DOM simulations do not prove real backend recovery.
- When the user requests alternatives, create before/after previews and reversible single-file plans. Apply authorized changes without another taste-approval gate; refuse stale plans that would overwrite intervening edits.
- Carry the same system into document/slide exports. Use the host's document or presentation workflow for native deliverables when available, preserve supplied content and inspect the target rendering. Native font embedding and pagination are not assumed.
- For authorized evaluation work, run the cross-platform suite with the actual available host runner. No host run means not-run, not passed; never substitute a fixture for a real model evaluation.

Browser tools require an existing Playwright/Chromium installation or equivalent host tooling; native DOCX/PPTX helpers require existing Python libraries. Use available capabilities automatically, keep maintenance dependencies out of client projects, and disclose unavailable execution or checks. Optional tools do not authorize purchases, deployments or unrelated edits.

## Implement with available capabilities

The design guidance requires no Claude CLI, Anthropic API, MCP server or model-specific SDK. Use the offline Python font helper and bundled Node color helper internally when those decisions are in scope and the runtimes are available. Normal use needs no npm install or third-party Python packages. Catalog-maintenance dependencies are separate and must not be installed in the user's project merely to use the skill. The automatic workflow explains how to continue when a runtime is unavailable.

- Existing codebase: use its framework, package manager, components, tokens, and available development commands. Add dependencies only when the actual feature warrants them. Keep CSS specificity predictable.
- Complete new website: when the installed Sites skill applies, read and follow it for creation and preview. This skill supplies aesthetic guidance, not a replacement hosting workflow.
- Inline interactive explanation or mockup: use the installed visualization skill when available and suited to the requested output.
- Original raster artwork: use the installed image-generation skill/tool when needed. Prefer existing assets or code-native vector graphics when appropriate.
- Rendered inspection: use the available browser or preview tools and their instructions. Do not assume a particular browser, localhost port, or screenshot API exists.

These integrations are optional and selected by the requested deliverable. Do not install them automatically, switch platforms unexpectedly, or call unavailable tools. If preview or execution is unavailable, provide the useful source or specification and identify what remains unverified. Do not claim a static mockup has working backend behavior. Publishing and other external actions retain the user's authorization requirements.

## Verify the result

Review the design against the brief: which decisions are specific to this product, and which merely repeat familiar defaults? Revise unjustified choices without violating requested styling.

Use [the design audit](references/design-audit.md) to compare the actual composition with the intended direction and check applicable component states. Distinguish verified checks, failures, unavailable checks and features outside scope. A common font, hue or layout is not a defect by itself; fix failures of purpose, hierarchy or behavior instead of enforcing a style blacklist.

For implemented interfaces, use proportionate checks:

- Inspect the actual rendered output at a narrow and a wide viewport when tools permit; fix overflow, clipping, broken assets, and weak hierarchy.
- Exercise the primary action and relevant loading, empty, error, and success states. Preserve existing behavior during styling changes.
- Check semantic controls, accessible names, keyboard access, visible focus, contrast, and reduced motion where applicable.
- Run the project's relevant build, lint, or tests when justified by the change. A screenshot does not establish functional correctness, and a passing build does not establish visual quality.

Deliver the implementation, preview, or requested artifact with a short account of what changed and what was actually checked. Distinguish completed checks from limitations; avoid unsupported claims of production readiness.
