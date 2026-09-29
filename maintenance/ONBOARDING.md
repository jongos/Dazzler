# Install once. Begin with a sentence.

Quick source install: `npx skills add jongos/Dazzler --skill dazzler-frontend`. Requires Node 22.20+. Choose the agent interactively. This uses the larger source catalog and can replace local edits. Install telemetry contributes to directory rankings; set `DISABLE_TELEMETRY=1` to opt out. A directory listing is not guaranteed. Use the pinned downloads below for compact size and managed rollback.

Choose one host and one scope. After installation, ask `Use $dazzler-frontend to…` in Codex, `/dazzler-frontend …` in Claude Code, or ask for Dazzler in the other supported agents. Fonts, colors and layout are automatic. The [19 starter prompts](../skills/dazzler-frontend/references/starters.md) explain supported results and optional controls.

## Managed local installer

Use Python 3.10 or newer. Download the matching host skill ZIP, `install_skill.py` and `SHA256SUMS.txt` from the same release, or use `tools/install_skill.py` from that release's source checkout. Review the source before running it. The examples below use the checkout path; for the standalone download use `python install_skill.py` instead. It makes no network requests and does not detect or install other hosts.

```sh
python tools/install_skill.py install --host codex --scope project --root /absolute/project --version 0.23.0 --archive /downloads/dazzler-codex.zip --checksums /downloads/SHA256SUMS.txt --dry-run
```

Remove `--dry-run` to install. Select `claude`, `gemini`, `cursor` or `copilot` with its matching archive. For user scope, explicitly pass `--scope user --root /absolute/user-home`; Copilot supports project scope only here. The installer uses the selected host's documented skill folder, refuses linked paths and unmanaged existing installs, validates archive paths and hashes, then verifies the resource inventory without executing archive code. Dry-run performs the same validation without changing the installation root. Only use release archives and manifests from a publisher you trust: checksum consistency is not independent authentication.

To update, run the same install command with an exact new version and its matching files. Every managed file and extra file is checked first. Local edits or additions cause a conflict, never a forced overwrite. Preserve and reconcile those edits in a separate copy before proceeding. The previous clean installation is retained outside discovery folders at `.dazzler-backups/HOST-SCOPE` beneath the explicit root. A successful later update replaces that one previous backup; keep a separate copy for longer history. Do not run concurrent installers against the same root.

```sh
python tools/install_skill.py rollback --host codex --scope project --root /absolute/project
python tools/install_skill.py uninstall --host codex --scope project --root /absolute/project --dry-run
```

Rollback swaps the clean current and previous versions. Uninstall without `--dry-run` removes only the clean, receipt-owned active folder; it retains the backup. Unmanaged, modified or linked installations are refused. The receipt is a local change detector, not a tamper-proof signature. An older manual install can remain in place; test a fresh project installation before deliberately migrating it. Never keep duplicate active discovery paths.

## Established skills CLI

The reviewed version is `skills@1.7.0`, requiring Node 22.20 or newer. Fresh project and isolated user installation, reinstall and removal were exercised. Its reinstall operation deleted a locally added file in the isolated test. Therefore use it only for a fresh installation or after preserving and reviewing an existing installation. Do not use unattended update/reinstall on edited skills. The managed installer above exists to cover this observed gap.

Set `DISABLE_TELEMETRY=1` or `DO_NOT_TRACK=1` in the installer's process environment if you want its telemetry disabled. Both were set during testing. This external installation utility uses the network; Dazzler's bundled design helpers remain offline. Live website/browser tasks still require the network. Public directory discovery is an external service outcome and is not guaranteed by a repository test.

Use the pinned source command in the closing notes. Omit `--global` for project scope and specify `--agent` rather than installing into all detected hosts. Avoid `--yes` until you have reviewed the selected destination. Direct archive mode's default 10 MiB download ceiling is too small for these packages; use the reviewed source route or the managed local installer.

## Claude marketplace

The root marketplace manifest pins the Claude plugin archive by release version and SHA-256. The build verifies that pin against the actual reproducible ZIP. In Claude Code, add the marketplace and install `dazzler@dazzler`, then invoke `/dazzler:dazzler-frontend`. Install either the plugin or standalone skill to avoid duplication. Local manifest/archive validation is not an actual Claude installation or cloud-upload acceptance test.

## Migrate a Manual Install

An installation without a Dazzler receipt is unmanaged. Move that directory to a safe location, retain any personal edits, then run a fresh managed install. Do not create or copy a receipt by hand. Keep the manual copy until the new installation has been checked.

Rollback requires a previous managed update. With no backup, the installer says so directly. Project backups carry their own `.gitignore`; existing rules are preserved. Review backups already tracked by Git before separately untracking them. The installer does not alter the repository index.

## Notes and references

- Pinned CLI: `npx skills@1.7.0 add https://github.com/jongos/Dazzler/tree/v0.23.0/skills/dazzler-frontend --skill dazzler-frontend --agent codex --copy`
- Claude commands: `/plugin marketplace add jongos/Dazzler`, then `/plugin install dazzler@dazzler`.
- [Release downloads](https://github.com/jongos/Dazzler/releases/tag/v0.23.0)
- [Skills CLI source](https://github.com/vercel-labs/skills), MIT. Reviewed package SHA-512: `OfePnDft+Xt9/tCoHdCUe5fkM8i+Q3QOSQO53hm7mKtsXyvc+CKOAAliVWZ484HS3cWx+6r+ob0AArixs3jYXw==`.
- [Claude marketplace format](https://code.claude.com/docs/en/plugin-marketplaces)
- [Codex skills](https://developers.openai.com/codex/skills/)

Original installer and starter code: Jon Gosier / Dazzler, Apache-2.0. Feedback: jon@filmhedge.com.
