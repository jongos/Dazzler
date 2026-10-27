# Choose a Component Foundation

Use this during substantial interface work or when a new behavior needs a component. The agent makes the choice from the project and task; the user need not select a library. This workflow does not install dependencies or authorize migration. Documents and slides do not need a UI foundation.

## Inspect Before Choosing

Read the package manifest, lockfile, existing components, framework, styling system and design record. Identify required behaviors: selection, validation, editable data, modal focus, touch interaction, localization and supported browsers. Reuse a compatible existing implementation. A missing behavior is a scoped gap, not a reason to replace a working system.

Use semantic HTML when it adequately meets the interaction needs. For a new React surface requiring richer behavior, compare only relevant candidates:

| Situation | Candidate | Check Before Adoption |
| --- | --- | --- |
| Familiar application controls, useful starter composition, editable source desired | shadcn with Base UI | Inspect generated source and transitive dependencies; retain only useful variants and adapt the visual defaults |
| A distinct composition or styling contract makes wrappers an obstacle | Direct Base UI | Budget for authored styles, labels, states and composition; verify each primitive's API |
| Complex accessible selection, collection interaction or internationalized controls are central | React Aria Components | Verify the actual required behavior and locale; test collection and focus contracts rather than assuming compliance |

These are conditional candidates, not a league table. Preserve a suitable existing Radix, Mantine, MUI or other system. Non-React projects stay in their framework. Do not combine overlapping primitive systems for the same control without a documented gap. A shadcn theme file alone does not establish the primitive base or an installed registry client.

## Decide and Record

Choose the smallest coherent foundation that satisfies the task, stack, maintenance and delivery constraints. Record the inspected evidence, required behaviors, chosen foundation and rejected alternative in the existing design record. If evidence is insufficient, inspect the missing capability or build one bounded local slice; do not turn unknowns into a numerical confidence score. Preserve existing dependencies during small fixes and reviews.

The foundation supplies behavior and reusable structure. Dazzler still chooses typography, semantic color roles, composition, density by region, responsive adaptation and motion from the brief. Neither library defaults nor trial results override brand requirements or existing design rules. A new package is not a design direction.

Inspect registry output before execution: imports, dependency changes, local file targets, lifecycle scripts and licenses. Pin resolved versions in the project's normal lockfile. Keep source notices. Use only authorized installation workflows; never install an MCP server or upload private designs just to obtain components. Core Dazzler remains offline and does not bundle these libraries.

## Verify the Integrated Result

Test representative content and primary tasks in production builds. For forms and editable data, check labels, invalid values, pending and failed saves, retained drafts, cancel and success. For search and dialogs, test keyboard selection, empty results, initial focus, modal containment, Escape and return focus. Check actual contrast, narrow layouts, zoom, touch access, reduced motion and portal styling. Inspect reset styles, width limits and overlapping transform utilities after adapting generated components; a desktop screenshot can hide a broken mobile dialog. Add locale, RTL and assistive-technology tests when required; unavailable coverage remains unrun.

When comparing foundations, use the same fixture, task, browser and visual directions. Separate shared application code from adapters and report production JavaScript/CSS and compressed bytes. Record adaptation work and observed defects; source lines are not development speed, bundle size is not interaction latency, and automated checks are not accessibility certification. Review actual screenshots before making visual claims. Keep trial artifacts outside the template gallery.

## Notes and Credits

Selection guidance informed by [shadcn/ui](https://ui.shadcn.com/docs), [Base UI](https://base-ui.com/react/overview/about) and [React Aria](https://react-aria.adobe.com/). Their implementations and notices belong to their respective authors. No upstream component code is bundled in the Dazzler skill.
