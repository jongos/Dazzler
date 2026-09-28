# Dazzler for Codex

Download the versioned `dazzler-codex.zip` and matching `SHA256SUMS.txt`. Verify the archive SHA-256 before extraction. This is the native skill edition with `agents/openai.yaml`, all fonts, templates and offline helpers.

1. Extract into a temporary directory. Keep the complete `dazzler-frontend` folder intact.
2. For a project, copy that folder into `.agents/skills/`. For your user account, use `$HOME/.agents/skills/` (on Windows, `$HOME` is the PowerShell user home). Create the parent directory if needed. Avoid duplicate installations under different discovery roots. Existing working `.codex/skills` installations can remain until deliberately migrated.
3. Open or refresh the Codex session and invoke `$dazzler-frontend`. Ask it to locate its installed directory and run `python scripts/health.py` from there. A passing inventory verifies files, not optional browser or Office capabilities.

### Fresh user installation commands

Run in the download directory containing both files. These commands refuse an existing installation; use the update procedure below for that case. Node and Python must already be available.

macOS/Linux:

```sh
grep '  dazzler-codex.zip$' SHA256SUMS.txt | shasum -a 256 -c - || exit 1
dazzler_parent="$HOME/.agents/skills"
test ! -e "$dazzler_parent/dazzler-frontend" || exit 1
mkdir -p "$dazzler_parent"
unzip dazzler-codex.zip -d "$dazzler_parent"
python3 "$dazzler_parent/dazzler-frontend/scripts/health.py"
```

Windows PowerShell:

```powershell
$expected = ((Get-Content ./SHA256SUMS.txt | Where-Object { $_ -match '  dazzler-codex.zip$' }) -split '  ')[0]
if (-not $expected -or (Get-FileHash ./dazzler-codex.zip -Algorithm SHA256).Hash.ToLower() -ne $expected) { throw 'Checksum mismatch' }
$dazzlerParent = Join-Path $HOME '.agents/skills'
$dazzlerInstall = Join-Path $dazzlerParent 'dazzler-frontend'
if (Test-Path -LiteralPath $dazzlerInstall) { throw 'Review the existing installation before updating' }
New-Item -ItemType Directory -Force -Path $dazzlerParent | Out-Null
Expand-Archive -LiteralPath ./dazzler-codex.zip -DestinationPath $dazzlerParent
python (Join-Path $dazzlerInstall 'scripts/health.py')
```

To update, verify the new download, back up the existing skill directory outside discovery paths, and replace that entire directory. Do not merge versions or edit a managed plugin cache. If installed as a plugin, update through that host's plugin workflow instead. A development symlink should point to a reviewed checkout.

To uninstall a manually copied skill, remove only the installed `dazzler-frontend` folder from the discovery path. If it is a symlink, unlink it without deleting its target. Restart or refresh the session; projects created using Dazzler remain separate. Uninstall managed plugins through their host.

## Notes and credits

Creator: Jon Gosier. Feedback: jon@filmhedge.com. Apache-2.0; bundled assets retain their licenses.

[Download native skill](https://github.com/jongos/Dazzler/releases/download/v0.16.0/dazzler-codex.zip) · [Checksums](https://github.com/jongos/Dazzler/releases/download/v0.16.0/SHA256SUMS.txt)

[Official skill discovery guidance](https://learn.chatgpt.com/docs/build-skills) · [Plugin distribution](https://developers.openai.com/plugins/build/plugins)
