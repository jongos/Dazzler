# Dazzler for Codex

Download `dazzler-codex.zip`, `install_skill.py` and `SHA256SUMS.txt` from the same release. From that folder, with Python 3.10+ available:

```sh
python install_skill.py install --host codex --scope project --root /absolute/project --version 0.26.0 --archive dazzler-codex.zip --checksums SHA256SUMS.txt
```

The project must exist. Add `--dry-run` to validate without installing. The installer verifies archive paths, checksums and every inventoried resource without executing package code. It refuses unmanaged installations or local edits and retains one prior managed version for rollback.

For a manual install, verify the checksum and copy the complete `dazzler-frontend` folder into `.agents/skills/` in the project. Back up an existing installation outside discovery paths before replacing it; do not merge versions. User installs may instead use `--scope user --root /absolute/user-home`. Refresh the host and ask:

```text
$dazzler-frontend build a welcoming studio website.
```

## Included

Six general-purpose font families, all 30 templates, offline color/chart/illustration engines, saved design systems and the full reference guides. Template-local font files stay with their templates. Each archive is capped at 24 MB compressed and unpacked; `references/package-profile.json` lists exactly what is installed. Other font families remain optional in the catalog and available from the full source checkout.

The agent chooses fonts, colors and layout automatically. For examples, open the installed `references/starters.md`. Core helpers require Python/Node; browser review and native Office exports use optional host runtimes. No Dazzler API key or npm installation is needed.

## Update or remove

Repeat the installation command with the new version and matching release files. Use the installer's `rollback` or `uninstall` action with the same host, scope and root. Uninstall retains the previous backup; it does not touch your projects. Hosted skills and managed plugins use the host's own removal/update flow.

Archive, size and helper checks are automated. Real host activation, cloud uploads and optional integrations remain unverified unless separately recorded. Checksums detect mismatched files; obtain the installer and manifest from a trusted release.

## Notes and credits

Creator: Jon Gosier. Feedback: jon@filmhedge.com. Apache-2.0; bundled assets retain their licenses.

[Download native skill](https://github.com/jongos/Dazzler/releases/download/v0.26.0/dazzler-codex.zip) · [Checksums](https://github.com/jongos/Dazzler/releases/download/v0.26.0/SHA256SUMS.txt)

[Official skill discovery guidance](https://learn.chatgpt.com/docs/build-skills) · [Plugin distribution](https://developers.openai.com/plugins/build/plugins)
