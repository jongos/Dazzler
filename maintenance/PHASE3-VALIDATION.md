# Phase 3 validation

Release 0.18.0 implements persistent design context, bounded DESIGN.md interchange, schema-2 fluid typography and compatible shadcn theme proposals. The runtime remains offline; the pinned conformance linter is development-only.

## Evidence

- 59 JavaScript tests cover the pinned interchange linter, supported-value round trips, unsafe YAML, unresolved color locks, canonical continuation, real font metadata, static interchange and both theme syntaxes.
- 45 Python tests cover bounded discovery, existing record location, ambiguity, external/oversized paths and exporter typography input limits alongside the prior regression suite.
- A fresh Node process resumes serialized canonical data exactly. This is a deterministic two-process continuation fixture, not a live AI-host evaluation.
- Legacy output was compared directly against the published 0.17.0 implementation for default and custom configurations; complete returned outputs matched in schema-1 mode.
- Chromium renders 320/390/1440 widths, 200% text scaling, static print sizes and a compiled original shadcn-style React fixture with light/dark toggling and keyboard interaction. Local licensed font CSS is loaded. No registry component was downloaded or installed.
- Print specimen pages and a native Word export were visually inspected. The Word host may substitute unavailable desktop fonts; no OS fonts were installed. Web font loading does not establish native Word font availability.
- Platform archives, inventories, licenses, font hashes, links and release versions are checked before publication. The Windows x64 offline kit includes exact build inputs and original dependency licenses.

## Limits

The parser intentionally supports a safe YAML subset, not arbitrary YAML. It preserves original text, parsed unknown mappings and Markdown prose; canonical serialization does not preserve YAML comments/formatting. DESIGN.md/DTCG interchange uses static typography; fluid data lives in the canonical record and DTCG extension. Multi-file project adoption requires a reviewed project diff. The basic PPTX exporter retains fixed layout sizing.

Browser fixtures are not universal accessibility certification. Arabic/Japanese fallback samples do not certify all script shaping or coverage. Cross-platform live implicit skill selection, Claude upload acceptance and Grok Bot remain subject to the Phase 2 report's unverified limitations.

## Notes and credits

Development conformance: @google/design.md 0.4.0, Google and contributors, Apache-2.0. Theme convention reference: https://ui.shadcn.com/docs/theming. Original adapter tests and fixtures: Dazzler, Apache-2.0.
