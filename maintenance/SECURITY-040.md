# Directory Audit Repair — 0.23.1

The September 29 audit flagged a domain in Gap Sans's original copyright metadata, local helper execution and imported-content boundaries. This repair removes the font dependency and narrows CSS evidence import. It does not claim that the original font binaries were malicious or that a repository change automatically clears a directory verdict.

## Dependency Removal

Gap Sans binaries, support files and catalog/recommendation entries are removed together. Required notices were not edited to conceal the domain. Earlier releases and Git history retain the original distribution. Other font notices remain unchanged. The full catalog contains 24 family records with 23 bundled families; compact packages still include six families. No template depends on the retired font.

Core font helpers select and export local, hash-checked assets. They do not download attribution URLs. The flagged domain was not a runtime download endpoint in the inspected source.

## Input and Execution Boundaries

CSS token import is text-only and bounded by file count, bytes and observation count. It checks source containment, drops comments, and now omits resource URLs, executable expressions, markup, control characters and escaped declarations. It reports how many declarations were omitted. A regression test blocks network and process calls while importing hostile CSS and verifies that ordinary font/color evidence survives without creating locks.

Existing DESIGN.md tests cover unsafe keys, executable YAML tags, cycles and expansion budgets. Generated previews escape supplied labels and font strings. Imported prose remains untrusted evidence; these controls do not promise to detect every natural-language prompt injection.

Python and Node helpers remain executable because measured font selection, color validation and artifact export need them. Their presence is a capability, not proof of malicious behavior. Browser rendering remains a separate permission-sensitive operation that may execute project scripts; text import does not render pages.

## Verification

- 76 Node tests and 56 Python tests pass; one Windows symlink case is skipped.
- All 121 retained font binaries match their metadata and hashes and load in Chromium without errors.
- The runtime inventory covers 695 files; health and local-link checks pass.
- Platform archives are rebuilt with the retired catalog entry removed. Package verification and CI results are recorded in issue 40.
- External reassessment is pending. Keep the public warning until a fresh provider verdict is verified.

## Notes and Sources

- [Tracked findings and reassessment](https://github.com/jongos/Dazzler/issues/40).
- [Published audit](https://skills.sh/jongos/dazzler/dazzler-frontend/security/agent-trust-hub).
- [Directory support process](https://skills.sh/contact) and [provider scanner](https://ai.gendigital.com/skill-scanner).
