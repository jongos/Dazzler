# Native Typography and Editing

Use an installed font only after checking the target renderer's actual family and styles. A bundled web font is not automatically available to Word or PowerPoint. Shortlist appropriate faces first; choose a verified available face or host-supported project font registration. Do not silently install OS fonts, convert a licensed font or promise embedded-font portability. Preserve an explicit brand font; report a real availability conflict. System fallbacks remain valid, but create hierarchy through scale, weight, genuine italics, spacing and alignment rather than accepting default document styling.

Use `python scripts/native_office.py inspect artifact.docx` (or `.pptx`) for a bounded native-structure and declared-font inventory. It does not certify rendering, licensing, reading order or font substitution. Compare the exported PDF's actual font identities and style variants with the chosen faces; retain the render and inspect it at reading size. Never treat a declaration as successful font loading.

## Data That Remains Editable

For slides with changing data, prefer a native data-linked chart. With an already-available python-pptx runtime:

```shell
python scripts/native_office.py chart draft.pptx --data chart.json --slide 3 --box 1 1.5 10 4.5 --kind column --out charted.pptx
```

The box uses inches. Output must be new. JSON has `categories` (labels) and `series` (objects with `name` and equally long `values`). Values are finite numbers or explicit `null`; null stays missing. The helper inserts an editable chart and embedded workbook; it does not choose a finished visual style. Apply the brief's fonts/colors, units, direct labels and non-color distinctions using the native authoring API, then render. Column charts with nonnegative values start at zero. Do not use a nonzero baseline to exaggerate bars.

Keep authoritative data beside the generation source. Test changing a value through the native chart data API, rerender and verify that both geometry and labels change together. Preserve the original in a separate stress copy. Never claim edit resilience from object counts alone.

For Word, use the existing native chart runtime when available. Otherwise keep editable source tables and regenerate the graphic from the same source data; state that the graphic is not data-linked in Word. Do not present manually editable bar widths as a chart that recalculates. This helper adds charts to PowerPoint only. No optional library is installed automatically.

Inspect every final page/slide and a representative expanded heading, longer label or extra row. Include the densest interior in the early structural comparison; a beautiful cover cannot compensate for weak continuation pages.
