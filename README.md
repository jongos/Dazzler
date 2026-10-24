![Dazzler](docs/assets/dazzler-banner.svg)

# Dazzler

**Turn a Brief Into a Design With Character.**

Dazzler gives your agent the tools to create and refine websites, interfaces, reports and slides. It shapes typography, color and layout around your audience, brand and content.

## The Problem

You know what a web page, report or slide deck should help people do. You may not know how it should look. A legal brief and a festival poster should not look alike.

If you ask an AI agent to build it, the agent has to make those choices too.

## What This Does About It

Dazzler is a skill: a folder of instructions you add to an AI agent. You describe what people should understand or do. Dazzler then picks fonts, colors and layout that fit your audience. It keeps your facts and your brand.

After building, it checks what people will actually receive: the layout, how the page works, and how it prints where that matters. It tells you about any check it could not do.

**Example.** Ask: “Build a welcoming website for an independent bookshop. Help visitors find new arrivals and upcoming events.” You do not have to name fonts or colors. Dazzler chooses them.

## Put It to Work

- **Give a product a visual voice.** Build a landing page that explains the offer and makes the next step clear.
- **Make complex information readable.** Refine a dashboard, chart or report around its most important questions.
- **Carry a design across formats.** Bring related type, color and hierarchy to interfaces and visual documents.
- **Improve what already exists.** Ask for a bolder direction, quieter typography, a stronger hierarchy or a focused finishing pass.

## Start With the Outcome

```sh
npx skills add jongos/Dazzler --skill dazzler-frontend
```

Use a compatible agent and Node 22.20+ for this installer. See the [platform guides](platforms/README.md) for other supported installation and invocation options.

```text
Use $dazzler-frontend to refine this dashboard. Make the urgent work easy
to find while keeping our brand, content and existing components.
```

Bring a brief, existing work or a goal. Dazzler chooses the visual details within your requirements.

[Explore the field guide](https://jongos.github.io/Dazzler/) · [Browse fictional worked examples](https://jongos.github.io/Dazzler/templates/) · [Installation and rollback](maintenance/ONBOARDING.md)

## Part of the Hex Men Collection

[Hex Men](https://github.com/jongos/Hex-Men) is a directory of independent projects by Jon Gosier. Each project stands on its own; these are its members.

| Project | What It Does |
|---|---|
| [Hex Men](https://github.com/jongos/Hex-Men) | Directory of independent projects |
| **Dazzler** (this repository) | Create and refine expressive visual interfaces |
| [Longshot](https://github.com/jongos/Longshot) | Independently test rendered UI tasks and provide replayable evidence |
| [Style Science](https://github.com/jongos/style-science) | Provide inspectable design reasoning, constraints and evidence |
| [Spiral](https://github.com/jongos/Spiral) | Rehearse role-limited asynchronous workflows before building |
| [Shatterstar](https://github.com/jongos/Shatterstar) | Propose reversible evidence-backed simplification while preserving important tasks |
| [Mojo](https://github.com/jongos/Mojo) | Remove repetition, needless nuance and overly cautious language from AI outputs |
| [Colossus](https://github.com/jongos/Colossus) | Inventory selected developer workspaces read-only and surface evidence-backed questions |

## Further Reading

[Detailed project reference](REFERENCE.md) · [Notices and credits](REFERENCE.md#notes-and-credits)

Created by Jon Gosier. Original work is Apache-2.0; fonts and libraries retain their own licenses and attribution. See [LICENSE](LICENSE).
