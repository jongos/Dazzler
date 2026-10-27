# Component Foundation Trial — 2026-10-27

The local trial supports conditional selection, not a universal library default. All three foundations completed the same bounded tasks after integration repairs and supported both authored visual directions. This is implementation evidence, not a human preference study or proof of accessibility compliance.

## Scope

One synthetic conference programme: session form, three-option searchable venue selector, native editable capacity table and modal editor. Shared React application logic, fixtures, fonts and CSS; separate library adapters. The native table is intentionally shared: this does not compare data-grid packages, virtualization or React Aria's Table component. Four initial records include long titles and accented names. Local save success/failure is simulated; no backend or private data is used.

Two treatments were applied to every foundation: a compact teal operational workbench and an orange/purple editorial programme with larger serif hierarchy and more space. Desktop 1440×1000 and narrow 390×844 views were rendered in headless Chromium with reduced motion. Narrow views are viewport tests, not physical mobile-device or virtual-keyboard tests. The same source task is retained in both directions; this is not a novel-composition competition.

## Results

| Foundation | Gzip JavaScript | Gzip CSS | Combined |
| --- | ---: | ---: | ---: |
| shadcn + Base UI | 145.4 KiB | 8.2 KiB | 153.6 KiB |
| Direct Base UI | 126.4 KiB | 2.0 KiB | 128.4 KiB |
| React Aria Components | 127.4 KiB | 2.0 KiB | 129.4 KiB |

Production minified independent entry bundles include React and application code. CSS includes the common authored styles and, for shadcn, generated Tailwind styles. Fonts are shared across entries and excluded from the table: 565,472 raw bytes across three files, loaded as used. Gzip bytes are build measurements, not measured network transfer or interaction latency. Unused dependencies in the trial's tooling folder are not bundled into the apps or Dazzler.

The final matrix passed 144 behavior checks in 12 cases: no page overflow; invalid capacity and correction; initial focus and modal containment; empty form; empty search; keyboard selection; disabled pending submission; retained failed-save draft; successful retry; Escape focus return; cancel; no page exceptions. Axe checks of the initial and failed-save modal states reported zero violations across 24 scans. Twenty-four final screenshots were inspected through contact sheets, with individual images used to diagnose defects.

## What Needed Repair

- A generated dialog used CSS `translate` utilities while the common stylesheet used `transform: translate`. Their combination moved the modal off-screen on mobile. The integration now explicitly resolves translation and width limits.
- Tailwind's reset altered inherited heading weight and spacing. Shared typography now declares those values explicitly.
- An overly broad trial selector hid labels inside the React Aria dialog. It now targets only the duplicated visual selector label while preserving its accessible name.
- React Aria's Button did not honor the shared adapter's native `disabled` prop. The saving label changed while the control remained active. The adapter now maps to `isDisabled` and `onPress`, and every variant explicitly checks its pending disabled state.
- Disabling the focused submit button then exposed focus loss after save in the React Aria variant, preventing Escape dismissal. The shared form now focuses its error or success feedback when the operation settles. The full retry and dismissal journey is rechecked.
- The shared form incorrectly marked a valid title invalid after simulated server failure. Field-invalid state now reflects the field, while save failure remains a form-level error. Success feedback is announced inside the open modal.
- Initial focus checks needed to await the library's asynchronous focus transition. The final test waits for containment before continuing; it does not ignore escaped focus.

These were integration and test-harness findings, not established upstream defects. Mobile table guidance now explicitly tells users to scroll to edit guest counts. The horizontal table scroll is deliberate; real product research may justify an alternate mobile representation.

## Selection Implications

Reuse the current system first. Native HTML remains appropriate when it meets the task. For new richer React work:

- **Direct Base UI:** smallest bundle here and direct control of authored structure. It still needs custom styling, labels and behavior review.
- **shadcn with Base UI:** useful editable starter components, but wrapper/style adaptation mattered in this trial. Its additional payload bought prebuilt variants; the trial did not show faster delivery.
- **React Aria:** comparable compressed size to direct Base UI in this slice. Its complex collection and internationalization features remain reasons to investigate it for those needs; they were not evaluated here.

The skill's selection workflow records required behavior, stack compatibility, the chosen foundation and why an alternative was rejected. It does not install any of these libraries, impose a house style, replace an existing framework or convert a small fix into a migration.

## Effort and Limits

One author implemented the shared shell and three small adapters sequentially. shadcn generated eight component files; direct Base UI and React Aria used authored compositions. Setup exposed imports absent from the registry's short dependency preview, so the actual generated source was inspected and its imports resolved. No randomized timing or independent developer study was performed: source-line counts and elapsed agent time would not establish development speed.

Unrun: screen-reader sessions, Safari/Firefox, physical touch devices, virtual keyboards, 200% browser zoom, RTL/localized controls, large or asynchronous collections, real server persistence, interaction-latency benchmarks and human preference testing. The result does not establish that one library produces better design. All three still require Dazzler's existing design direction and rendered review.

## Local Evidence and Reproduction

The separate `component-foundation-trial-20261027` evidence folder retains the exact package lock, inspected registry responses, imported source/license, shared app, adapters, build script, browser test, bundle metadata, npm advisory report, earlier failure reports and final screenshots. It is local trial output, not a new template library or a published package.

Install that folder's locked dependencies with lifecycle scripts disabled, compile its Tailwind stylesheet, run `build.mjs`, then `test.cjs`. Its browser harness and font-copy step use this workstation's existing runtimes; port those local paths before reproduction elsewhere. These machine paths are confined to local test tooling and are not in the distributed skill.

## Validation

134 JavaScript tests pass. The Python suite completed 108 tests successfully with one skip. Release-version and documentation-link checks pass. The integrity inventory checks 1,729 resources. All ten local archives pass extracted-package validation and remain below the 24 MB gate; the largest is 12,913,374 bytes. A pre/post SHA-256 inventory confirms 754 protected design-rule, template, thumbnail and asset files are byte-identical. At trial completion, no baseline evaluation had been restarted and no commit, push, release, deployment or installed-skill replacement had been performed.

## Notes and Credits

Tested versions: shadcn CLI 4.22.2, Base UI 1.9.0, React Aria Components 1.22.1, React/React DOM 19.2.4, Tailwind 4.3.1 and esbuild 0.28.2. Registry source was retrieved on 2026-10-27 from the official base-nova registry and retained with its license; CLI pinning alone does not pin mutable registry content. The retained source and hashes identify what was tested.

Sources: [shadcn](https://ui.shadcn.com/docs), [Base UI](https://base-ui.com/react/components/combobox), [React Aria](https://react-aria.adobe.com/ComboBox). shadcn and Base UI use MIT licenses; React Aria uses Apache-2.0. Work Sans and Young Serif are bundled locally with their open-font notices. The npm advisory check reported no known vulnerabilities at test time; it is not a security certification. No upstream component implementation is bundled into Dazzler.
