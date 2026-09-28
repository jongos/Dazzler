# Developer change notes

Each entry accompanies the commit and push containing the described changes.

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
