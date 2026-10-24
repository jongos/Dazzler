# Dazzler for Grok Bot

Download `dazzler-grokbot.zip` from the release below. Inspect it, then locate your host's configured workflow directory. Extract the ZIP's `dazzler/` folder there; the result is `<workflow-directory>/dazzler/SKILL.md`. Replace `<workflow-directory>` with your own host setting rather than copying another machine's absolute path. Refresh the workflow list and ask Grok Bot to use Dazzler on a small local page.

This is a manual installation based on the reported host layout. Local extraction, resource hashes and helpers are tested; host indexing and a fresh end-to-end Grok Bot install are not verified. Do not copy it into a disposable plugin cache. The managed five-host installer does not target this host.

Before updating, save any changes and keep the old folder outside the workflow directory for rollback. Replace only this skill folder after checking the release checksum. To uninstall, remove that folder through the host's file controls. No API key is included or required by Dazzler itself.

## Notes and downloads

[Release](https://github.com/jongos/Dazzler/releases/tag/v0.32.1). Apache-2.0; included fonts and libraries retain their notices. Installation path and display-name convention were supplied by the host user in issue 19; they are not a vendor compatibility certification.
