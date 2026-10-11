# Adversarial Review — October 11, 2026

Reviewed restore/install boundaries, bounded input/output helpers, template export, document export, heading extraction and the pending Style Science wrapper. This was a targeted code review with synthetic regression tests, not a security certification or exhaustive audit.

## Confirmed and Fixed

- **Restore integrity:** Distinct archive names such as `readme.txt` and `./readme.txt` or case variants could overwrite the same destination after their individual hashes passed. Reserved Windows names could discard content; file/parent collisions could leave partial output. Restore now preflights portable canonical paths, file types and collisions before creating the destination. Valid nested files still restore byte-for-byte.
- **Heading extraction:** `<h1>Hello<br>world</h1>` became `Helloworld`, hiding the lowercase second word. Explicit line breaks now separate words without separating inline text runs such as `Inter<em>national</em>`.
- **PowerPoint data loss:** A one-row table produced no table slide because pagination started beyond the last row. It now survives export; multi-page tables retain all data rows and repeated headers.
- **Malformed tables:** Strings, mappings, empty row lists and null rows could become character cells or fail deep inside a renderer. All document export modes now reject them before writing; an absent or empty table remains valid.
- **Native heading boundaries:** Word and PowerPoint line breaks or tabs could join separate words and conceal case errors. Extraction preserves these boundaries without splitting text runs inside a word.
- **Gallery publication:** A renamed README section no longer matched the publisher's legacy expression, silently retaining old captions. The publisher supports the current section and rejects missing or duplicate targets; all thirty captions were checked against the current catalog.

Each behavior failed its new regression test before the fix. The PowerPoint check reopens the generated native file and reads its actual tables. The project test module also now sets its helper import path, allowing isolated execution.

## Verification and Boundaries

105 Node tests passed. Python completed 91 tests with one optional skip. Additional archive fixtures cover superscript Windows device names and file/parent case collisions. Browser checks exercise empty search/reset, completed controls and repeated empty-order clearing. Runtime hashes were regenerated after the fixes. Existing Style Science changes and unrelated local assets were preserved. No upstream source modules were modified.

Archive fixtures and document content were synthetic and local. These tests establish the specific behavior above, not universal filesystem safety. Separate gallery evidence records the actual native and desktop/mobile renders. Font inventory and browser loading passed; optional binary metadata reinspection was unavailable because this Python environment lacks fontTools. Existing font binaries were unchanged. Release and installation checks are recorded in the shipment notes.
