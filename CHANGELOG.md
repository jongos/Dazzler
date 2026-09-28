# Developer change notes

Each entry accompanies the commit and push containing the described changes.

## 2026-09-28 — 0.2.0: Typography selection and licensed open-font catalog

- **Changed:** Typography is now an explicit design foundation. The skill chooses a contextual best-fit font when the brief permits it, preserving brand requirements and filtering actual text, styles, features and byte budgets before visual judgment. The root Apache license now explicitly excludes third-party fonts. CSS mappings distinguish named styles from malformed legacy OS/2 metadata.
- **Added:** A crawl-based catalog of all 25 Open Foundry families, technical binary inventory, editorial descriptions, GitHub/source URLs, pinned downloads and hashes, 24 bundled families containing 124 unmodified font files, per-family license/copyright/source notices, and a full upstream archive for TeX Gyre Heros. Added offline recommendation/export tooling that preserves notices, developer crawl/inspection/validation tools, browser-load checks, and guidance for font approval or manual installation. No system fonts are installed.
- **Why:** Give design tasks a practical, reusable typography library while avoiding unsupported site claims, wrong-generation licenses, missing glyphs, fake styles, and font assets silently relicensed under Apache. Nimbus Sans L remains unbundled because its corresponding source-distribution evidence is incomplete. Mirrors and unavailable original repositories are labeled; Poppins, M+ and Roboto directory discrepancies are documented.
- **Validation:** Nine workflow tests passed, covering language/weight/style constraints, no-match behavior, byte/feature filters, license-preserving export, overwrite rejection, excluded-font rejection, and pre-write hash checks. All 124 font binaries and 206 total asset files passed checksum and re-inspected metadata validation. All 124 faces loaded in Chromium without font-load or page errors; desktop/mobile specimen sheets were captured. Plugin and skill validators passed. Browser checks establish loadability, not exhaustive language shaping or suitability for every project; those remain task-specific.

## 2026-09-28 — Link installed skill to source and publish maintenance updates

- **Changed:** Skill maintenance now routes to a canonical GitHub repository and a workflow that finishes authorized updates with a commit, push, and remote SHA verification. The owner's installed skill is linked to the permanent checkout rather than maintained as a separate copy.
- **Added:** Repository agent instructions, a maintenance guide, and this developer changelog. Each future update must document changed behavior, additions, rationale, and validation in the same commit.
- **Why:** Prevent divergence between the installed skill and GitHub and give developers a durable explanation of each published update. Publication applies to plugin maintenance, not client projects created with the skill.
- **Validation:** Plugin and skill structure validators; staged whitespace checks; installed-link target and file identity checks. Remote commit verification is performed after pushing. No background watcher is introduced.

## 2026-09-28 — Initial release, 0.1.0

Historical note for commit `1a84ba1` (recorded with the following maintenance update).

- **Changed:** Adapted the upstream frontend-design instructions for ChatGPT/Codex, preserving explicit brands and existing technology stacks.
- **Added:** Plugin manifest, skill UI metadata, optional host-tool routing, responsive and interaction verification guidance, README source credit, and preserved Apache 2.0 licensing.
- **Why:** Make the original design guidance reusable in the local OpenAI environment without requiring Claude tooling.
- **Validation:** Plugin and skill validators passed; the initial commit was verified against `origin/main`.
