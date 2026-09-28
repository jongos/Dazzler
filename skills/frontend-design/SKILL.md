---
name: frontend-design
description: Design, refine, and de-slop web interfaces with intentional typography, perceptual color palettes, layout, and interaction. Use for frontend design, implementation, or making a UI less generic while preserving the user's brand and stack.
license: Apache-2.0; see LICENSE.txt
---

# Frontend Design

When asked to update this skill or its plugin, read [MAINTENANCE.md](MAINTENANCE.md) first. It identifies the canonical GitHub source and the owner-authorized workflow for pushing updates with developer notes. It does not apply to projects created using this skill.

Adapted and modified on 2026-09-28 from davila7/claude-code-templates, creative-design/frontend-design. This version adds ChatGPT/Codex tool routing and verification, and revises the workflow to preserve existing brands and user scope. See [provenance](PROVENANCE.md).

Create a usable interface whose visual identity follows its subject and audience. Make deliberate choices instead of applying the same aesthetic to every project. An explicit brief, reference, or established design system takes precedence over novelty.

## Design from purpose

For substantial new interfaces, redesigns or requests to make a UI less generic, use [the adapted deslop framework](references/deslop.md), credited to **Samuel Berthe (samber)**. It connects artifact type and audience to a design direction, tokens, component states and a review of the actual result. Inspect existing design records and tokens first. Infer a useful direction from the brief without mandatory approval gates, preserve brand choices, and reuse the [design-record guide](references/design-record.md) when durable project documentation is warranted. For a small edit, apply only the relevant [interface craft](references/interface-craft.md); do not expand it into a redesign.

## Make typography a design foundation

When the brief leaves fonts open, automatically choose a best-fit face for the project's audience, content, reading task and visual character. Read [the typography workflow](references/typography.md) for selection and implementation, then consult relevant entries in [the font catalog](references/font-catalog.md). The catalog covers all 25 families found on Open Foundry on 2026-09-28; 24 families have licensed, unmodified files bundled in `assets/fonts/`.

Filter by actual character coverage, needed weights/italics, technical features and loading budget before comparing subjective character. Typography includes hierarchy, measure, spacing and rendering, not just a font name. Choose and implement without asking for a routine font approval when a suitable bundled option is available and project edits are authorized. Explain the choice briefly. Preserve established brand fonts, never silently replace a missing language/style requirement, and use the workflow's exact-source guidance when manual approval or desktop installation is necessary.

## Establish the direction

When choosing or substantially changing colors, follow [the color workflow](references/color-workflow.md). Infer mood and audience from the brief, preserve locked brand colors, and select contextual inspiration from the attributed palette catalog or generate from a brand seed. Use perceptual ramps and measured semantic roles for light/dark themes; never treat color harmony or a mood label as evidence of accessible contrast. The optional offline helper generates CSS tokens, provenance, contrast reports and a reviewable preview. If constraints conflict it reports no match instead of silently changing locked colors. Review the actual interface with the chosen typography, non-color state cues and keyboard focus before delivery.

Identify the product, audience, main task, content, and constraints from the request and available project context. Inspect relevant existing screens and components before changing an interface. Ask only when missing information materially changes the result; otherwise state a reasonable assumption and proceed. Do not invent company facts, testimonials, performance claims, or customer logos to fill a layout. Mark illustrative data clearly.

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

## Implement with available capabilities

The design guidance requires no Claude CLI, Anthropic API, MCP server or model-specific SDK. An optional offline Python helper shortlists and copies bundled fonts with their licenses; normal use needs no third-party Python packages. Catalog-maintenance tools have separate development dependencies.

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
