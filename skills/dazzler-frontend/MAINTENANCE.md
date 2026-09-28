# Plugin source and publishing workflow

Read this only when maintaining the skill/plugin itself, not when using it to design a user's project.

On the owner's Windows installation, the permanent checkout is `C:\Users\jongo\Codex\dazzler`. The personal skill directory `C:\Users\jongo\.codex\skills\dazzler-frontend` links to its `skills\dazzler-frontend` directory. Edit the checkout so installed instructions and tracked source stay identical. On another machine, locate or clone the repository instead of assuming these paths exist. For a cached plugin installation, update its source and follow the host's reinstall procedure; do not edit a disposable cache.

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

Use the checked-in `maintenance/offline-build/` kit to restore source and exact build inputs into a new workspace with `python tools/offline_build.py restore --from maintenance/offline-build --out NEW_DIRECTORY`. On its recorded platform, run the three Node build scripts without npm installation, then tests. The kit includes package sources and original licenses, not Node/Python or optional browser/Office installations.

Treat upstream changes as reviewed imports. Never fetch upstream code during skill invocation. For an intentional update, inspect the diff, license and advisory changes, pin exact versions, rebuild, test behavior, update notices and regenerate the kit. Retain the previous release for rollback. After final changes run `python tools/seal_runtime.py`, the health check and platform validation. Keep kit hashes and release notes in the same commit. The local inventory is not a digital signature.

## Notes and credits

Canonical repository: https://github.com/jongos/Dazzler

SSH remote: `git@github.com:jongos/Dazzler.git`
