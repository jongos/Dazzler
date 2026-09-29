# Dazzler for GitHub Copilot

Download `dazzler-copilot.zip`, `install_skill.py` and `SHA256SUMS.txt` from the same release. From that folder, with Python 3.10+ available:

```sh
python install_skill.py install --host copilot --scope project --root /absolute/project --version 0.23.0 --archive dazzler-copilot.zip --checksums SHA256SUMS.txt
```

The project must exist. Add `--dry-run` to validate without installing. The installer verifies archive paths, checksums and every inventoried resource without executing package code. It refuses unmanaged installations or local edits and retains one prior managed version for rollback.

For a manual install, verify the checksum and copy the complete `dazzler-frontend` folder into `.github/skills/` in the project. Back up an existing installation outside discovery paths before replacing it; do not merge versions. This installer supports Copilot project scope only. Refresh the host and ask:

```text
Use Dazzler to build a welcoming studio website.
```

## Included

Six general-purpose font families, all 30 templates, offline color/chart/illustration engines, saved design systems and the full reference guides. Template-local font files stay with their templates. Each archive is capped at 24 MB compressed and unpacked; `references/package-profile.json` lists exactly what is installed. Other font families remain optional in the catalog and available from the full source checkout.

The agent chooses fonts, colors and layout automatically. For examples, open the installed `references/starters.md`. Core helpers require Python/Node; browser review and native Office exports use optional host runtimes. No Dazzler API key or npm installation is needed.

## Update or remove

Repeat the installation command with the new version and matching release files. Use the installer's `rollback` or `uninstall` action with the same host, scope and root. Uninstall retains the previous backup; it does not touch your projects. Hosted skills and managed plugins use the host's own removal/update flow.

Archive, size and helper checks are automated. Real host activation, cloud uploads and optional integrations remain unverified unless separately recorded. Checksums detect mismatched files; obtain the installer and manifest from a trusted release.

## Notes and credits

Packaging reference (checked September 28, 2026): [official documentation](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills). Creator: Jon Gosier. Feedback: jon@filmhedge.com. Original Dazzler code/instructions are Apache-2.0; bundled third-party resources retain their own licenses.

- [dazzler-copilot.zip](https://github.com/jongos/Dazzler/releases/download/v0.23.0/dazzler-copilot.zip)
- [Browse the gallery](https://jongos.github.io/Dazzler/templates/)
- [download only the templates](https://github.com/jongos/Dazzler/releases/download/v0.23.0/dazzler-templates.zip)
