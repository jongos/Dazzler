# Choose your Dazzler edition

Every host package contains the same design tools, six versatile font families and all 30 templates. The adapter changes installation and tool routing. Fonts, colors and layout are automatic once installed.

| Host | Guide | Skill archive |
|---|---|---|
| Codex | [Install](codex/README.md) | `dazzler-codex.zip` |
| Claude / Fable | [Install](claude/README.md) | `dazzler-claude.zip` |
| Gemini CLI | [Install](gemini/README.md) | `dazzler-gemini.zip` |
| Cursor | [Install](cursor/README.md) | `dazzler-cursor.zip` |
| Copilot | [Install](copilot/README.md) | `dazzler-copilot.zip` |
| Grok Bot | [Install](grokbot/README.md) | `dazzler-grokbot.zip` |
| Other chat hosts | [Portable prompt](portable/DAZZLER-PROMPT.md) | Guidance only; no executable tools |

Download the archive, installer and checksums from the same release. The guides include a single installation command, manual installation and update/removal instructions. Claude Code also has a plugin ZIP with the `/dazzler:dazzler-frontend` command. The previous compact Claude filename is a byte-identical alias.

## Package budgets

All skill/plugin and template ZIPs must stay below 24,000,000 bytes compressed **and** unpacked. Exact sizes are published in `PACKAGE-SIZES.json`. These are Dazzler's release gates; external host limits and account eligibility still apply. The larger Windows offline build kit is a maintainer recovery tool, not an installable skill.

Included families are Work Sans, Young Serif, Office Code Pro, Inter, Bluu Next and League Gothic. Templates keep their own licensed font resources. The complete 24-family collection remains in the source checkout. Use that checkout deliberately when a task needs the larger collection; don't merge its files into a managed compact installation.

Core helpers use bundled resources with Python/Node. Browser inspection and native Office export need their optional runtimes. No package installs those tools or changes host permissions. Gemini CLI extension installation and skill discovery were exercised locally; AI invocation, other host activation and cloud uploads remain separate checks. Gemini also offers `dazzler-gemini-extension.zip` for its native extension manager.

## For maintainers

Build with `python tools/build_platforms.py --out dist/new-release`, then run `python tools/validate_platforms.py dist/new-release`. Use a new destination. The builder skips optional font binaries before staging, creates deterministic archives, enforces size limits and preserves original notices. CI checks identical output across Windows/Linux and Node 20/22.

## Grok Bot

See [manual workflow installation](grokbot/README.md). The release contains a dedicated display-name/frontmatter edition; actual host indexing remains unverified.

## Notes and downloads

[Release files](https://github.com/jongos/Dazzler/releases/tag/v0.24.0) · [Field manual](https://jongos.github.io/Dazzler/) · [Template gallery](https://jongos.github.io/Dazzler/templates/)

Created by Jon Gosier. Feedback: jon@filmhedge.com. Dazzler code is Apache-2.0; bundled resources retain their own licenses.
