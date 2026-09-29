# Grok Bot compatibility status

Reviewed September 28, 2026. **Unverified installation; no dedicated supported package.**

The host documents support for skills and compatible plugins. That establishes general capability, but not Dazzler's multi-file discovery, resource access, refresh/update semantics or a completed design task. No authenticated Grok Bot session was available for this review or the Phase 5 recheck. Discovery/invocation has not been reproduced, so no dedicated edition is promoted. Grok Build is a different host; an installer's `grok` adapter does not verify Grok Bot.

A community report describes a user workflow folder, a saved skill entry and successful standalone Linux helper commands. Those are useful observations, not independently reproduced installation evidence. In particular, a saved entrypoint alone does not establish that the font files, licenses, scripts and references remain accessible to the agent. A Bot template does not automatically transport arbitrary custom scripts or dependencies.

Use the portable prompt only as design guidance where file execution is unavailable. It supplies neither bundled resources nor measured checks. Do not put credentials or private data in a shared bot template. No install path or dedicated ZIP is promoted as supported here.

Verification requires a real host session: install one complete versioned package in an isolated scope, observe its discovered entrypoint, read a bundled reference and font notice, execute a helper, produce and inspect one design artifact, then replace the package and prove the new version is used. Remove the isolated installation and confirm discovery stops. Until those observations exist, retain this status.

## Notes and references

- [Grok Bot 101](https://x.ai/bot/guides/grok-bot-101)
- [Grok Bot templates](https://x.ai/bot/guides/templates-for-grok-bot)
- Community evidence: [compatibility issue 19](https://github.com/jongos/Dazzler/issues/19). Reported environment and paths have not been independently verified.
- [Portable guidance](portable/DAZZLER-PROMPT.md)
