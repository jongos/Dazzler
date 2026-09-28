---
name: frontend-design
description: Design and refine distinctive web interfaces, pages, dashboards, and components with intentional typography, layout, color, and interaction. Use for frontend visual design and implementation; keep established brand systems and the user's chosen stack.
license: Apache-2.0; see LICENSE.txt
---

# Frontend Design

When asked to update this skill or its plugin, read [MAINTENANCE.md](MAINTENANCE.md) first. It identifies the canonical GitHub source and the owner-authorized workflow for pushing updates with developer notes. It does not apply to projects created using this skill.

Adapted and modified on 2026-09-28 from davila7/claude-code-templates, creative-design/frontend-design. This version adds ChatGPT/Codex tool routing and verification, and revises the workflow to preserve existing brands and user scope. See [provenance](PROVENANCE.md).

Create a usable interface whose visual identity follows its subject and audience. Make deliberate choices instead of applying the same aesthetic to every project. An explicit brief, reference, or established design system takes precedence over novelty.

## Establish the direction

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

This is an instruction-only skill. It requires no Claude CLI, Anthropic API, MCP server, model-specific SDK, or package installation.

- Existing codebase: use its framework, package manager, components, tokens, and available development commands. Add dependencies only when the actual feature warrants them. Keep CSS specificity predictable.
- Complete new website: when the installed Sites skill applies, read and follow it for creation and preview. This skill supplies aesthetic guidance, not a replacement hosting workflow.
- Inline interactive explanation or mockup: use the installed visualization skill when available and suited to the requested output.
- Original raster artwork: use the installed image-generation skill/tool when needed. Prefer existing assets or code-native vector graphics when appropriate.
- Rendered inspection: use the available browser or preview tools and their instructions. Do not assume a particular browser, localhost port, or screenshot API exists.

These integrations are optional and selected by the requested deliverable. Do not install them automatically, switch platforms unexpectedly, or call unavailable tools. If preview or execution is unavailable, provide the useful source or specification and identify what remains unverified. Do not claim a static mockup has working backend behavior. Publishing and other external actions retain the user's authorization requirements.

## Verify the result

Review the design against the brief: which decisions are specific to this product, and which merely repeat familiar defaults? Revise unjustified choices without violating requested styling.

For implemented interfaces, use proportionate checks:

- Inspect the actual rendered output at a narrow and a wide viewport when tools permit; fix overflow, clipping, broken assets, and weak hierarchy.
- Exercise the primary action and relevant loading, empty, error, and success states. Preserve existing behavior during styling changes.
- Check semantic controls, accessible names, keyboard access, visible focus, contrast, and reduced motion where applicable.
- Run the project's relevant build, lint, or tests when justified by the change. A screenshot does not establish functional correctness, and a passing build does not establish visual quality.

Deliver the implementation, preview, or requested artifact with a short account of what changed and what was actually checked. Distinguish completed checks from limitations; avoid unsupported claims of production readiness.
