# Release Gallery: Prompt-Generated Demonstrations

The gallery shows what the current Dazzler skill can produce. It is not a catalog of default layouts. Every shipment requires a newly authored gallery from varied, ambitious sample prompts. Preserve previous shipped galleries as comparison evidence, not inputs to recolor.

1. Read the current skill and capability inventory. Write complete fictional briefs with audience, purpose, content and constraints. Deliberately cover different expressive territories, page surfaces, typography, chart questions, information densities and interactions. Do not specify a preselected template ID or reproduce a previous composition. Prompts may request any appropriate surface, including white.
2. Invoke the current skill's normal prompt-to-design workflow for each brief. Develop competing directions and author the selected result. Use applicable current features deeply; do not force unrelated features into every example. The candidate helper is optional exploration, not a finite design catalog or an automatic prompt interpreter.
3. Render actual Word/PDF files and browser outputs, inspect every page and interaction, and repair failures. Keep native text/tables where editability is advertised. Record the prompt, runtime identity, actual feature use, rationale, final files and rendered evidence.
4. Review the gallery together and against the previous shipped gallery. Every example must be substantially different in composition, typography and page sequence or evidence/image organization. Palette swaps, renamed themes and different random seeds alone fail. Preserve legibility, content fidelity and editing quality; novelty is not a substitute for craft. Reject recurring silhouettes across peers. A new release must look like a new body of work.
5. Save a repository-local manifest for `tools/validate_gallery_release.py`. Include version, previousVersion, runtimeSha256 (hash of references/integrity.json), skillSha256 (hash of SKILL.md), and one examples entry per catalog ID. Each entry contains prompt, generationMethod=current-skill-from-prompt, features, designRationale, artifactFiles, renderedPages, previousRenderedPages (each path and sha256), composition (structure, typography, surface, imageOrDataRole, sequence), and visualReview. Review records require promptFit, craft, peerDistinction and previousReleaseDistinction with passed and descriptive evidence, plus at least three structuralChanges. Describe actual visible changes, not desired outcomes.
6. Run the evidence validator before publishing. Exact duplicate render hashes and incomplete/stale records fail. Categorical differences and changed hashes cannot certify visual diversity: the recorded visual review is mandatory and must be grounded in inspected renders. Do not fabricate provenance for legacy files.

The old `build_templates.py` reproduces legacy fixed examples for maintenance only. It cannot generate or certify the fresh release gallery. Export helpers remain available when a user explicitly selects an example. The 0.27 collection has now been authored and reviewed across all 30 examples. Its manifest records the exact shipped artifacts, full-page captures and comparisons with 0.26.0. Any subsequent artifact or runtime change invalidates the corresponding evidence and requires renewed checks.

## Notes

Original Dazzler maintenance guidance, Apache-2.0. Reference observations are retained in the skill's document-design-space guide.

## Scoped Color Refinements

When the user requests color correction while retaining useful layouts, record `reviewScope: color-system-refinement`, the preserved-structure reason and specific color changes. Keep the same final-render, contrast, peer and previous-release review gates. Do not invent structural changes to satisfy a rebuild checklist. Use the advisory collection check and inspect actual color area before accepting the set.
