# Optional refinement, without restarting the design

Use this only when the user asks for options, wants control, or requests a specific tweak. Default use is automatic through [automatic-workflow.md](automatic-workflow.md). Do not open a selector, ask for aesthetic approval or show a questionnaire before the first result merely because this guide exists.

## Respond at the requested level

- **Direct instruction:** “Make it warmer,” “use Poppins,” or “tighten the spacing” is enough to act. Change the relevant choices, preserve unrelated decisions and recheck affected constraints. Do not require the user to confirm the same instruction in a selector.
- **A few alternatives:** Show two or three meaningful, viable options with the current/recommended choice first. Compare actual headline/body text for fonts and real UI roles for palettes, not names and abstract swatches alone. Ask one focused question when a choice is genuinely requested.
- **Interactive exploration:** If the user asks for a picker, controls or a comparison preview, create or open a local preview in the available host. Use the actual shortlisted font files, palettes and project content. Reuse the color helper's theme/simulation controls where useful. A static comparison or concise choices are valid fallbacks if an interactive host is unavailable; never claim a selector opened if it did not.

## Build selectors from valid choices

Filter font options using the font helper for the required text, styles and features before presenting them. Load actual font assets rather than relying on a browser's similarly named installed face. Keep licenses with preview assets. State whether font-loading and shaping were verified.

Generate color alternatives through the color helper with the current locked values. Changing a seed or theme can invalidate text and action pairs; recalculate before calling the result usable. Show an explicit conflict for an invalid combination instead of silently changing a lock or exporting it as a passing palette. Color-vision simulation is a review aid, not a different palette to save accidentally.

Useful controls, selected to fit the request, include font pairing, palette character, light/dark mode, density, corner treatment and motion amount. Avoid dumping all controls into every task. Keep the current design visible and offer a reset when interactive edits are supported. Separate temporary preview changes from applying them to the project; apply when the user's request authorizes it. Never imply a local browser control persists to source files unless that behavior is implemented.

After applying the chosen adjustment, update the existing tokens/design record where relevant and recheck the changed text, surfaces, layout and states. Continue with the new choices as constraints in subsequent work; do not repeat discovery or rerank the whole design unnecessarily.
