# Dazzler for Gemini CLI

Download **[dazzler-gemini.zip](https://github.com/jongos/Dazzler/releases/download/v0.7.0/dazzler-gemini.zip)**.

Extract the archive and copy its complete `dazzler-frontend` folder into `~/.gemini/skills/`. Do not overwrite an existing installation without reviewing it. Refresh skills or start a new session, then ask:

```text
Use Dazzler to build a welcoming studio website.
```

The archive includes the platform entrypoint, font catalog, 24 licensed font families, Python helper, bundled Node color engine, all reference guides, and license/provenance notices. No API key or npm installation is required by Dazzler. Python/Node execution and browser inspection depend on your host; unavailable checks must be disclosed.

This repository folder contains the platform adapter and installation guidance, **not** a standalone installable skill. Use the complete ZIP or build it with `python tools/build_platforms.py --out dist/platforms-0.7.0` from the repository root. The builder combines the canonical skill with `HOST.md`; assets are maintained once.

## Validation status

Documentation-aligned packaging with local archive, license, resource and helper checks. Not end-to-end tested inside Gemini CLI; a valid archive does not guarantee account eligibility, upload acceptance, or agent behavior. Keep the core skill enabled for automatic selection where supported; host consent still applies.

Packaging reference (checked September 28, 2026): [official documentation](https://geminicli.com/docs/cli/skills/). Creator: Jon Gosier. Feedback: jon@filmhedge.com. Original Dazzler code/instructions are Apache-2.0; bundled third-party resources retain their own licenses.
