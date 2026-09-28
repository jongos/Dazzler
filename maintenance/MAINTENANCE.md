# Plugin source and publishing workflow

Read this only when maintaining the skill/plugin itself, not when using it to design a user's project.

Locate the repository checkout before editing. The owner may link their local installed skill to this checkout; verify the link rather than assuming a personal path. For a cached plugin installation, update its source and follow the host's reinstall procedure; do not edit a disposable cache.

The owner explicitly authorized automatic commit and push as part of completed plugin updates on 2026-09-28. Carry this through without requesting separate push permission unless a later instruction changes the scope. This is an agent maintenance workflow, not a background file watcher: arbitrary manual saves do not trigger Git operations.

1. Inspect the Git root, remote, current branch, and working tree. Fetch the remote. Integrate a newer remote with a fast-forward when safe before editing; preserve unrelated or unfinished work. Never force-push or reset away changes. If history diverges, resolve only within the task's authorization and report any remaining blocker.
2. Make the requested source changes and retain the Apache 2.0 license and attribution. Update the plugin semantic version for behavior or packaging changes; documentation-only updates need not bump it.
3. Append a dated developer entry to `CHANGELOG.md` in the same commit as the update. Include a descriptive title and **Changed**, **Added**, **Why**, and **Validation** fields. State "None" when there are no additions. Describe concrete behavior and developer implications, not just filenames. Do not put private client material or credentials in source or notes.
4. Run the available plugin and skill validators for affected files, check references, and run relevant functional checks for any executable changes. Inspect the complete staged diff and `git diff --cached --check`. Stage only files belonging to the update. Record actual checks and any limitations in the notes.
5. Commit with a concise developer-facing subject and push to the configured upstream (normally `origin/main`). Every push introducing updates must carry the corresponding changelog entry. If the remote rejects a push, fetch and inspect; never overwrite remote history. Failed validation or authentication is a blocker to report, not a successful publication.
6. Verify the remote branch SHA matches the intended local commit. Report the commit link, notable changes, and any unresolved limitation. Distinguish local commits from successfully pushed changes.

Do not commit or publish generated websites, client assets, or unrelated repositories under this authorization.

Keep implementation-source credits, repository links and inspiration acknowledgments in a closing notes or fine-print section of each human-readable document. Keep product explanations focused on current capabilities; do not add speculative addition lists. Preserve original license files, machine-readable provenance and functional identifiers.

## Self-contained maintenance

Use the release-only Windows x64 offline kit to restore source and exact build inputs into a new workspace by downloading `offline-build-windows-x64.zip` and the matching `manifest.json` from the same release into a directory, then running `python tools/offline_build.py restore --from KIT_DIRECTORY --out NEW_DIRECTORY`. On Windows x64, run the three Node build scripts without npm installation, then tests. The kit includes package sources and original licenses, not Node/Python or optional browser/Office installations.

Treat upstream changes as reviewed imports. Never fetch upstream code during skill invocation. For an intentional update, inspect the diff, license and advisory changes, pin exact versions, rebuild, test behavior, update notices and regenerate the kit. Retain the previous release for rollback. After final changes run `python tools/seal_runtime.py`, the health check and platform validation. Keep kit hashes and release notes in the same commit. The local inventory is not a digital signature.

## Notes and credits

Canonical repository: https://github.com/jongos/Dazzler

SSH remote: `git@github.com:jongos/Dazzler.git`

The archive is a release asset, never a tracked Git file. Keep only its manifest in the tree; old archives remain in earlier releases. Hash checks detect corruption, not authenticity. Linux, macOS and ARM contributors should use the pinned package lock with their own compatible runtime; this kit contains a Windows x64 esbuild executable. Do not rewrite repository history to remove older kit commits.
