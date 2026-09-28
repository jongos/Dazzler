# Font catalog

Checked 2026-09-28: **25 families; 24 bundled**.

This is a dated inventory. Confirm suitability against the actual project text and requirements.

Descriptions and suggested roles are editorial judgments. Site listings, audited distribution facts, and implementation mappings are separate. Script tags describe encoded characters, not guaranteed full language coverage or correct shaping. Check actual project text.

Binary technical attributes are in [font-catalog.json](font-catalog.json): SHA-256, source URL/commit or archive hash, family/subfamily/version, raw OS/2 weight/width and embedding flags, CSS mappings, variable axes, glyph/codepoint counts, Unicode ranges/scripts, GSUB/GPOS scripts/features, default digit widths, metrics, formats and byte sizes.

CSS weights/styles below follow named upstream styles, with explicit corrections for inconsistent legacy metadata; original binaries remain unchanged. Raw values remain in JSON. In particular Cooper Hewitt encodes weights as 701–714 and omits italic flags, while some old Thin fonts encode weights as 250/275. Do not use those raw numbers blindly as CSS weights.

Apache 2.0 covers our instructions and scripts. Fonts retain their individual licenses. Copy each selected font with its support files; see [typography.md](typography.md).

| Family | Suggested roles | Distribution license | Bundle |
|---|---|---|---|
| [Aileron](#aileron) | ui, body, heading | Author No Rights Reserved dedication (directory: CC0-1.0) | bundled |
| [Archivo](#archivo) | ui, body, heading, display | OFL-1.1 | bundled |
| [Bagnard](#bagnard) | heading, display | OFL-1.1 | bundled |
| [Bluu Next](#bluu-next) | heading, display | OFL-1.1 | bundled |
| [Cooper Hewitt](#cooper-hewitt) | ui, heading, body | OFL-1.1 | bundled |
| [Cotham Sans](#cotham-sans) | body, heading | OFL-1.1 | bundled |
| [EB Garamond](#eb-garamond) | body, heading | OFL-1.1 | bundled |
| [Gap Sans](#gap-sans) | display, heading | OFL-1.1 | bundled |
| [Inter](#inter) | ui, body, heading | OFL-1.1 | bundled |
| [Junicode](#junicode) | body, heading | OFL-1.1 | bundled |
| [League Gothic](#league-gothic) | heading, display | OFL-1.1 | bundled |
| [Liberation Sans](#liberation-sans) | ui, body, heading | OFL-1.1 | bundled |
| [Libre Baskerville](#libre-baskerville) | body, heading | OFL-1.1 | bundled |
| [M+ M Type-1](#mplus-mtype-1) | code, ui, body | OFL-1.1 | bundled |
| [Nimbus Sans L](#nimbus-sans-l) | ui, body, heading | Downloaded archive: GPLv2 with document exception; not bundled | manual-review |
| [Office Code Pro](#office-code-pro) | code, ui | OFL-1.1 | bundled |
| [Ostrich Sans](#ostrich-sans) | display, heading | OFL-1.1 | bundled |
| [Oswald](#oswald) | heading, display | OFL-1.1 | bundled |
| [Poppins](#poppins) | ui, heading, body | OFL-1.1 | bundled |
| [Reglo](#reglo) | heading, display | OFL-1.1 | bundled |
| [Roboto](#roboto) | ui, body, heading | Apache-2.0 | bundled |
| [Terminal Grotesque](#terminal-grotesque-open) | display, heading | OFL-1.1 | bundled |
| [Tex Gyre Heros](#tex-gyre-heros) | ui, body, heading | GUST Font License 1.0 / LPPL-1.3c-or-later | bundled |
| [Work Sans](#work-sans) | ui, body, heading | OFL-1.1 | bundled |
| [Young Serif](#young-serif) | heading, body, display | OFL-1.1 | bundled |

<a id="aileron"></a>
## Aileron

**Character and fit (editorial):** An airy neo-grotesque with softened details. A restrained choice for clear interfaces and understated identities.

**Suggested contexts:** clean, quiet, modern, minimal. **Roles:** ui, body, heading.

**Site listing:** sans-serif; CC0 1.0 Universal; Ultralight 100, Ultralight Italic 100, Thin 200, Thin Italic 200, Light 300, Light Italic 300, Regular 400, Italic 400, Semibold 600, Semibold Italic 600, Bold 700, Bold Italic 700, Heavy 800, Heavy Italic 800, Black 900, Black Italic 900.

**Verified distribution:** Author No Rights Reserved dedication (directory: CC0-1.0). **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| Aileron-Black.otf | 900 / normal | otf; 29.2 KiB | 338 / 337 | Static |
| Aileron-BlackItalic.otf | 900 / italic | otf; 30.1 KiB | 340 / 337 | Static |
| Aileron-Bold.otf | 700 / normal | otf; 28.5 KiB | 338 / 337 | Static |
| Aileron-BoldItalic.otf | 700 / italic | otf; 30.2 KiB | 340 / 337 | Static |
| Aileron-Heavy.otf | 800 / normal | otf; 29.4 KiB | 338 / 337 | Static |
| Aileron-HeavyItalic.otf | 800 / italic | otf; 30.7 KiB | 340 / 337 | Static |
| Aileron-Italic.otf | 400 / italic | otf; 28.9 KiB | 340 / 337 | Static |
| Aileron-Light.otf | 300 / normal | otf; 27.7 KiB | 338 / 337 | Static |
| Aileron-LightItalic.otf | 300 / italic | otf; 28.7 KiB | 340 / 337 | Static |
| Aileron-Regular.otf | 400 / normal | otf; 27.0 KiB | 338 / 337 | Static |
| Aileron-SemiBold.otf | 600 / normal | otf; 28.2 KiB | 338 / 337 | Static |
| Aileron-SemiBoldItalic.otf | 600 / italic | otf; 29.3 KiB | 340 / 337 | Static |
| Aileron-Thin.otf | 200 / normal | otf; 27.9 KiB | 338 / 337 | Static |
| Aileron-ThinItalic.otf | 200 / italic | otf; 28.8 KiB | 340 / 337 | Static |
| Aileron-UltraLight.otf | 100 / normal | otf; 27.0 KiB | 338 / 337 | Static |
| Aileron-UltraLightItalic.otf | 100 / italic | otf; 28.3 KiB | 340 / 337 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Latn, Zinh, Zyyy.

**OpenType features (union; per-file availability varies):** aalt, cpsp, kern, liga, locl, mark, salt.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="archivo"></a>
## Archivo

**Character and fit (editorial):** A sturdy grotesque with an industrial, editorial voice. Width variation helps adapt dense headlines and information layouts.

**Suggested contexts:** industrial, editorial, confident, modern. **Roles:** ui, body, heading, display.

**Site listing:** sans-serif; SIL Open Font License v.1.1; Regular 400, Italic 400, Medium 500, Medium Italic 500, Semibold 600, Semibold Italic 600, Bold 700, Bold Italic 700.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| Archivo-Italic[wdth,wght].ttf | 100 900 / italic | ttf; 724.0 KiB | 832 / 653 | wght: 100–900 (default 600); wdth: 62–125 (default 100) |
| Archivo[wdth,wght].ttf | 100 900 / normal | ttf; 643.2 KiB | 834 / 653 | wght: 100–900 (default 600); wdth: 62–125 (default 100) |

**Encoded Unicode scripts (union; per-file coverage varies):** Grek, Latn, Zinh, Zyyy, Zzzz.

**OpenType features (union; per-file availability varies):** aalt, case, ccmp, dnom, frac, kern, liga, lnum, locl, mark, mkmk, numr, onum, ordn, pnum, rvrn, sinf, subs, sups, tnum, zero.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="bagnard"></a>
## Bagnard

**Character and fit (editorial):** An irregular, carved-looking serif with a handmade historical voice. Useful for cultural identities and short expressive titles.

**Suggested contexts:** historical, handmade, playful, cultural. **Roles:** heading, display.

**Site listing:** serif; SIL Open Font License v.1.1; Regular 400.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| Bagnard.otf | 400 / normal | otf; 12.6 KiB | 157 / 149 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Latn, Zyyy.

**OpenType features (union; per-file availability varies):** kern.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="bluu-next"></a>
## Bluu Next

**Character and fit (editorial):** An angular, high-contrast serif with a forceful editorial presence. Suits large cultural or fashion headlines.

**Suggested contexts:** dramatic, editorial, sharp, fashion. **Roles:** heading, display.

**Site listing:** serif; SIL Open Font License v.1.1; Bold 700, Bold Italic 700.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| bluunext-bold-webfont.woff2 | 700 / normal | woff2; 29.9 KiB | 389 / 326 | Static |
| bluunext-bolditalic-webfont.woff2 | 700 / italic | woff2; 12.5 KiB | 317 / 284 | Static |
| bluunext-titling.woff2 | 400 / normal | woff2; 19.5 KiB | 302 / 270 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Grek, Latn, Zinh, Zyyy.

**OpenType features (union; per-file availability varies):** aalt, case, cpsp, dlig, dnom, frac, kern, liga, lnum, locl, mark, mkmk, numr, onum, salt, ss01, sups, zero.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="cooper-hewitt"></a>
## Cooper Hewitt

**Character and fit (editorial):** A compact, geometric sans with a composed institutional tone. Strong for museum, architecture, and exhibition identities.

**Suggested contexts:** cultural, architectural, geometric, institutional. **Roles:** ui, heading, body.

**Site listing:** sans-serif; SIL Open Font License v.1.1; Thin 100, Thin Italic 100, Light 300, Light Italic 300, Book 400, Book Italic 400, Medium 500, Medium Italic 500, Semibold 600, Semibold Italic 600, Bold 700, Bold Italic 700, Heavy 800, Heavy Italic 800.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| CooperHewitt-Bold.otf | 700 / normal | otf; 87.9 KiB | 561 / 566 | Static |
| CooperHewitt-BoldItalic.otf | 700 / italic | otf; 89.9 KiB | 561 / 566 | Static |
| CooperHewitt-Book.otf | 400 / normal | otf; 87.6 KiB | 561 / 566 | Static |
| CooperHewitt-BookItalic.otf | 400 / italic | otf; 90.2 KiB | 561 / 566 | Static |
| CooperHewitt-Heavy.otf | 800 / normal | otf; 87.6 KiB | 561 / 566 | Static |
| CooperHewitt-HeavyItalic.otf | 800 / italic | otf; 89.9 KiB | 564 / 569 | Static |
| CooperHewitt-Light.otf | 300 / normal | otf; 87.2 KiB | 561 / 566 | Static |
| CooperHewitt-LightItalic.otf | 300 / italic | otf; 90.1 KiB | 561 / 566 | Static |
| CooperHewitt-Medium.otf | 500 / normal | otf; 87.7 KiB | 561 / 566 | Static |
| CooperHewitt-MediumItalic.otf | 500 / italic | otf; 90.1 KiB | 561 / 566 | Static |
| CooperHewitt-Semibold.otf | 600 / normal | otf; 88.2 KiB | 561 / 566 | Static |
| CooperHewitt-SemiboldItalic.otf | 600 / italic | otf; 90.2 KiB | 561 / 566 | Static |
| CooperHewitt-Thin.otf | 100 / normal | otf; 86.9 KiB | 561 / 566 | Static |
| CooperHewitt-ThinItalic.otf | 100 / italic | otf; 87.2 KiB | 561 / 566 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Latn, Zyyy, Zzzz.

**OpenType features (union; per-file availability varies):** case, dlig, dnom, frac, kern, locl, numr, sinf, ss01, sups, tnum.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="cotham-sans"></a>
## Cotham Sans

**Character and fit (editorial):** A plainspoken grotesque with a slightly idiosyncratic rhythm. Useful when a quiet identity should avoid a polished corporate feel.

**Suggested contexts:** quiet, independent, editorial, minimal. **Roles:** body, heading.

**Site listing:** sans-serif; SIL Open Font License v.1.1; Regular 400.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| CothamSans.otf | 400 / normal | otf; 9.5 KiB | 105 / 103 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Latn, Zyyy.

**OpenType features (union; per-file availability varies):** kern.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="eb-garamond"></a>
## EB Garamond

**Character and fit (editorial):** A literary old-style serif with delicate rhythm and traditional proportions. A candidate for long reading, publishing, and heritage identities.

**Suggested contexts:** literary, historical, elegant, editorial. **Roles:** body, heading.

**Site listing:** serif; SIL Open Font License v.1.1; Regular 400, Italic 400, Medium 500, Medium Italic 500, Semibold 600, Semibold Italic 600, Bold 700, Bold Italic 700, Extrabold 800, Extrabold Italic 800.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| EBGaramond-Italic[wght].ttf | 400 800 / italic | ttf; 736.8 KiB | 3075 / 1972 | wght: 400–800 (default 400) |
| EBGaramond[wght].ttf | 400 800 / normal | ttf; 831.2 KiB | 3247 / 2091 | wght: 400–800 (default 400) |

**Encoded Unicode scripts (union; per-file coverage varies):** Cyrl, Grek, Latn, Zinh, Zyyy, Zzzz.

**OpenType features (union; per-file availability varies):** aalt, c2pc, c2sc, case, dlig, dnom, fina, frac, hist, hlig, init, kern, liga, lnum, locl, mark, mkmk, numr, onum, ordn, pcap, pnum, rlig, sinf, smcp, ss01, ss02, ss03, ss04, ss05, ss06, ss07, subs, sups, swsh, tnum.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="gap-sans"></a>
## Gap Sans

**Character and fit (editorial):** A deliberately irregular display sans with a rough, experimental energy. Best for arts posters and short graphic statements.

**Suggested contexts:** experimental, playful, cultural, rough. **Roles:** display, heading.

**Site listing:** display; SIL Open Font License v.1.1; Regular 400, Bold 700, Black 900.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| gapsans-webfont.woff2 | 400 / normal | woff2; 21.1 KiB | 220 / 217 | Static |
| gapsansblack-webfont.woff2 | 900 / normal | woff2; 18.5 KiB | 220 / 217 | Static |
| gapsansbold-webfont.woff2 | 700 / normal | woff2; 19.4 KiB | 220 / 217 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Latn, Zyyy.

**OpenType features (union; per-file availability varies):** None reported.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="inter"></a>
## Inter

**Character and fit (editorial):** A highly legible contemporary sans with optical sizing and extensive interface features. Useful for dense product interfaces when clarity leads.

**Suggested contexts:** technical, clean, neutral, modern. **Roles:** ui, body, heading.

**Site listing:** sans-serif; SIL Open Font License v.1.1; Thin 100, Thin Italic 100, Extralight 200, Extralight Italic 200, Light 300, Light Italic 300, Regular 400, Italic 400, Medium 500, Medium Italic 500, Semibold 600, Semibold Italic 600, Bold 700, Bold Italic 700, Extrabold 800, Extrabold Italic 800, Black 900, Black Italic 900.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| InterVariable-Italic.woff2 | 100 900 / italic | woff2; 378.9 KiB | 2901 / 2816 | opsz: 14–32 (default 14); wght: 100–900 (default 400) |
| InterVariable.woff2 | 100 900 / normal | woff2; 344.0 KiB | 2937 / 2852 | opsz: 14–32 (default 14); wght: 100–900 (default 400) |

**Encoded Unicode scripts (union; per-file coverage varies):** Bopo, Cyrl, Grek, Latn, Zinh, Zyyy, Zzzz.

**OpenType features (union; per-file availability varies):** aalt, calt, case, ccmp, cpsp, cv01, cv02, cv03, cv04, cv05, cv06, cv07, cv08, cv09, cv10, cv11, cv12, cv13, cv14, dlig, dnom, frac, kern, locl, mark, mkmk, numr, ordn, pnum, salt, sinf, ss01, ss02, ss03, ss04, ss05, ss06, ss07, ss08, subs, sups, tnum, zero.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="junicode"></a>
## Junicode

**Character and fit (editorial):** A scholarly serif with historical texture and extensive specialist characters. A strong candidate for humanities and archival publishing.

**Suggested contexts:** scholarly, historical, literary, cultural. **Roles:** body, heading.

**Site listing:** serif; SIL Open Font License v.1.1; Regular 400, Italic 400, Bold 700, Bold Italic 700.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| JunicodeVF-Italic.woff2 | 300 700 / italic | woff2; 1017.0 KiB | 5064 / 3162 | wght: 300–700 (default 400); wdth: 75–125 (default 100); ENLA: 0–100 (default 0) |
| JunicodeVF-Roman.woff2 | 300 700 / normal | woff2; 978.5 KiB | 5033 / 3162 | wght: 300–700 (default 400); wdth: 75–125 (default 100); ENLA: 0–100 (default 0) |

**Encoded Unicode scripts (union; per-file coverage varies):** Bopo, Cyrl, Goth, Grek, Latn, Runr, Zinh, Zyyy, Zzzz.

**OpenType features (union; per-file availability varies):** aalt, c2pc, c2sc, calt, case, ccmp, cv01, cv02, cv03, cv04, cv05, cv06, cv07, cv08, cv09, cv10, cv11, cv12, cv13, cv14, cv15, cv16, cv17, cv18, cv19, cv20, cv21, cv22, cv23, cv24, cv25, cv26, cv27, cv28, cv29, cv30, cv31, cv32, cv33, cv34, cv35, cv36, cv37, cv38, cv39, cv40, cv41, cv42, cv43, cv44, cv45, cv46, cv47, cv48, cv49, cv50, cv51, cv52, cv53, cv54, cv55, cv56, cv57, cv58, cv59, cv60, cv61, cv62, cv63, cv64, cv65, cv66, cv67, cv68, cv69, cv70, cv71, cv72, cv73, cv74, cv75, cv76, cv77, cv78, cv79, cv80, cv81, cv82, cv83, cv84, cv85, cv86, cv87, cv88, cv89, cv90, cv91, cv92, cv93, cv94, cv95, cv96, cv97, cv98, dlig, dnom, frac, hlig, kern, liga, lnum, locl, mark, mkmk, nalt, numr, onum, ordn, ornm, pcap, pnum, rlig, rtlm, rvrn, sinf, smcp, ss01, ss02, ss03, ss04, ss05, ss06, ss07, ss08, ss10, ss12, ss13, ss14, ss15, ss16, ss17, ss18, ss19, ss20, subs, sups, swsh, tnum, zero.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="league-gothic"></a>
## League Gothic

**Character and fit (editorial):** A tall condensed grotesque with a direct, poster-like voice. Fits space-constrained headlines, sports, and bold editorial display.

**Suggested contexts:** condensed, energetic, industrial, editorial. **Roles:** heading, display.

**Site listing:** sans-serif; SIL Open Font License v.1.1; Regular 400, Condensed 400, Italic 400, Condensed Italic 400.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| LeagueGothic-Italic.woff2 | 400 / italic | woff2; 12.0 KiB | 327 / 326 | Static |
| LeagueGothic-Condensed.woff2 | 400 / normal | woff2; 11.8 KiB | 327 / 326 | Static |
| LeagueGothic-CondensedItalic.woff2 | 400 / italic | woff2; 13.3 KiB | 327 / 326 | Static |
| LeagueGothic-Regular.woff2 | 400 / normal | woff2; 12.0 KiB | 325 / 324 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Latn, Zyyy.

**OpenType features (union; per-file availability varies):** kern.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="liberation-sans"></a>
## Liberation Sans

**Character and fit (editorial):** A familiar, pragmatic sans for office-style layouts and compatibility-sensitive documents. Its restrained voice keeps attention on content.

**Suggested contexts:** neutral, institutional, practical, clean. **Roles:** ui, body, heading.

**Site listing:** sans-serif; SIL Open Font License v.1.1; Regular 400, Italic 400, Bold 700, Bold Italic 700.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| LiberationSans-BoldItalic.ttf | 700 / italic | ttf; 399.4 KiB | 2622 / 2327 | Static |
| LiberationSans-Italic.ttf | 400 / italic | ttf; 406.1 KiB | 2622 / 2327 | Static |
| LiberationSans-Bold.ttf | 700 / normal | ttf; 404.7 KiB | 2620 / 2327 | Static |
| LiberationSans-Regular.ttf | 400 / normal | ttf; 401.1 KiB | 2620 / 2327 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Bopo, Copt, Cyrl, Grek, Hebr, Latn, Zinh, Zyyy.

**OpenType features (union; per-file availability varies):** ccmp, dlig, kern, locl, mark, mkmk, subs, sups.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="libre-baskerville"></a>
## Libre Baskerville

**Character and fit (editorial):** An open, sturdy transitional serif suited to sustained screen reading. Adds editorial authority without extreme stroke contrast.

**Suggested contexts:** editorial, literary, trustworthy, traditional. **Roles:** body, heading.

**Site listing:** serif; SIL Open Font License v.1.1; Regular 400, Italic 400, Bold 700.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| LibreBaskerville-Italic[wght].woff2 | 400 700 / italic | woff2; 60.2 KiB | 864 / 789 | wght: 400–700 (default 400) |
| LibreBaskerville[wght].woff2 | 400 700 / normal | woff2; 62.5 KiB | 861 / 789 | wght: 400–700 (default 400) |

**Encoded Unicode scripts (union; per-file coverage varies):** Grek, Latn, Zinh, Zyyy, Zzzz.

**OpenType features (union; per-file availability varies):** aalt, case, ccmp, dlig, frac, kern, liga, locl, mark, mkmk, ordn, sinf, ss01, subs, sups.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="mplus-mtype-1"></a>
## M+ M Type-1

**Character and fit (editorial):** A clear, utilitarian monospaced design spanning Latin and Japanese text. Useful for technical, bilingual, and code-adjacent compositions.

**Suggested contexts:** technical, japanese, monospaced, practical. **Roles:** code, ui, body.

**Site listing:** sans-serif; SIL Open Font License v.1.1; Thin 100, Light 300, Regular 400, Medium 500, Bold 700.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| mplus-1m-bold.ttf | 700 / normal | ttf; 1534.2 KiB | 7749 / 7418 | Static |
| mplus-1m-light.ttf | 300 / normal | ttf; 1535.7 KiB | 7749 / 7418 | Static |
| mplus-1m-medium.ttf | 500 / normal | ttf; 1527.7 KiB | 7749 / 7418 | Static |
| mplus-1m-regular.ttf | 400 / normal | ttf; 1528.3 KiB | 7749 / 7418 | Static |
| mplus-1m-thin.ttf | 100 / normal | ttf; 1542.3 KiB | 7749 / 7418 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Bopo, Cyrl, Grek, Hani, Hira, Kana, Latn, Zinh, Zyyy.

**OpenType features (union; per-file availability varies):** ccmp, jp04, liga, vert.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="nimbus-sans-l"></a>
## Nimbus Sans L

**Character and fit (editorial):** A neutral neo-grotesque in the Helvetica tradition. Its familiar proportions suit conventional editorial and information layouts.

**Suggested contexts:** neutral, traditional, clean, institutional. **Roles:** ui, body, heading.

**Site listing:** sans-serif; GNU General Public License v.3.0; Regular 400, Italic 400, Bold 700, Bold Italic 700.

**Verified distribution:** Downloaded archive: GPLv2 with document exception; not bundled. **Status:** manual-review.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| NimbusSanL-ReguItal.ttf | 400 / italic | ttf; 102.5 KiB | 685 / 682 | Static |
| NimbusSanL-ReguCondItal.ttf | 400 / italic | ttf; 73.2 KiB | 505 / 502 | Static |
| NimbusSanL-ReguCond.ttf | 400 / normal | ttf; 75.2 KiB | 505 / 502 | Static |
| NimbusSanL-Regu.ttf | 400 / normal | ttf; 104.1 KiB | 685 / 682 | Static |
| NimbusSanL-BoldItal.ttf | 700 / italic | ttf; 106.6 KiB | 685 / 682 | Static |
| NimbusSanL-BoldCondItal.ttf | 700 / italic | ttf; 74.7 KiB | 505 / 502 | Static |
| NimbusSanL-BoldCond.ttf | 700 / normal | ttf; 74.1 KiB | 505 / 502 | Static |
| NimbusSanL-Bold.ttf | 700 / normal | ttf; 110.1 KiB | 685 / 682 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Cyrl, Grek, Latn, Zyyy, Zzzz.

**OpenType features (union; per-file availability varies):** None reported.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="office-code-pro"></a>
## Office Code Pro

**Character and fit (editorial):** A crisp programmer-oriented monospace, adapted from Source Code Pro. Useful for code, logs, and carefully aligned technical data.

**Suggested contexts:** technical, monospaced, practical, clean. **Roles:** code, ui.

**Site listing:** monospace; SIL Open Font License v.1.1; Light 300, Light Italic 300, Regular 400, Italic 400, Medium 500, Medium Italic 500, Bold 700, Bold Italic 700.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| OfficeCodePro-Bold.woff2 | 700 / normal | woff2; 28.3 KiB | 496 / 433 | Static |
| OfficeCodePro-BoldItalic.woff2 | 700 / italic | woff2; 29.3 KiB | 496 / 433 | Static |
| OfficeCodePro-Light.woff2 | 300 / normal | woff2; 29.2 KiB | 496 / 433 | Static |
| OfficeCodePro-LightItalic.woff2 | 300 / italic | woff2; 30.4 KiB | 496 / 433 | Static |
| OfficeCodePro-Medium.woff2 | 500 / normal | woff2; 28.9 KiB | 496 / 433 | Static |
| OfficeCodePro-MediumItalic.woff2 | 500 / italic | woff2; 30.2 KiB | 496 / 433 | Static |
| OfficeCodePro-Regular.woff2 | 400 / normal | woff2; 28.5 KiB | 496 / 433 | Static |
| OfficeCodePro-RegularItalic.woff2 | 400 / italic | woff2; 29.5 KiB | 496 / 433 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Grek, Latn, Zinh, Zyyy, Zzzz.

**OpenType features (union; per-file availability varies):** aalt, ccmp, dnom, frac, locl, mark, mkmk, numr, ordn, salt, sinf, subs, sups.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="ostrich-sans"></a>
## Ostrich Sans

**Character and fit (editorial):** A very narrow, elongated display face with a range of decorative treatments. Suits poster lettering and brief playful headlines.

**Suggested contexts:** condensed, playful, retro, decorative. **Roles:** display, heading.

**Site listing:** display; SIL Open Font License v.1.1; Light 300, Medium 500, Bold 700, Black 900, Heavy 900.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| OstrichSans-Black.otf | 900 / normal | otf; 7.7 KiB | 118 / 115 | Static |
| OstrichSans-Bold.otf | 700 / normal | otf; 12.9 KiB | 112 / 109 | Static |
| OstrichSans-Heavy.otf | 900 / normal | otf; 19.0 KiB | 310 / 303 | Static |
| OstrichSans-Light.otf | 300 / normal | otf; 7.1 KiB | 117 / 114 | Static |
| OstrichSans-Medium.otf | 500 / normal | otf; 15.5 KiB | 311 / 304 | Static |
| OstrichSansDashed-Medium.otf | 500 / normal | otf; 147.7 KiB | 119 / 116 | Static |
| OstrichSansInline-Italic.otf | 400 / italic | otf; 23.2 KiB | 209 / 208 | Static |
| OstrichSansInline-Regular.otf | 400 / normal | otf; 21.5 KiB | 209 / 208 | Static |
| OstrichSansRounded-Medium.otf | 500 / normal | otf; 8.2 KiB | 118 / 115 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Latn, Zyyy, Zzzz.

**OpenType features (union; per-file availability varies):** kern.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="oswald"></a>
## Oswald

**Character and fit (editorial):** A compact gothic sans with a strong vertical rhythm. Works for economical headlines, navigation accents, and assertive editorial layouts.

**Suggested contexts:** condensed, editorial, industrial, confident. **Roles:** heading, display.

**Site listing:** sans-serif; SIL Open Font License v.1.1; Extralight 200, Light 300, Regular 400, Medium 500, Semibold 600, Bold 700.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| Oswald[wght].woff2 | 200 700 / normal | woff2; 70.2 KiB | 883 / 850 | wght: 200–700 (default 400) |

**Encoded Unicode scripts (union; per-file coverage varies):** Cyrl, Grek, Latn, Zinh, Zyyy.

**OpenType features (union; per-file availability varies):** aalt, case, ccmp, dlig, frac, kern, liga, locl, mark, mkmk, ordn, sups.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="poppins"></a>
## Poppins

**Character and fit (editorial):** A circular geometric sans with a friendly, orderly voice and Devanagari support. Suits approachable products and bilingual identities.

**Suggested contexts:** geometric, friendly, modern, playful. **Roles:** ui, heading, body.

**Site listing:** sans-serif; SIL Open Font License v.1.1; Thin 100, Thin Italic 100, Extralight 200, Extralight Italic 200, Light 300, Light Italic 300, Regular 400, Italic 400, Medium 500, Medium Italic 500, Semibold 600, Semibold Italic 600, Bold 700, Bold Italic 700, Extrabold 800, Extrabold Italic 800, Black 900, Black Italic 900.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| Poppins-Black.ttf | 900 / normal | ttf; 149.8 KiB | 1060 / 471 | Static |
| Poppins-BlackItalic.ttf | 900 / italic | ttf; 170.0 KiB | 1060 / 471 | Static |
| Poppins-Bold.ttf | 700 / normal | ttf; 152.3 KiB | 1060 / 471 | Static |
| Poppins-BoldItalic.ttf | 700 / italic | ttf; 174.9 KiB | 1060 / 471 | Static |
| Poppins-ExtraBold.ttf | 800 / normal | ttf; 151.2 KiB | 1060 / 471 | Static |
| Poppins-ExtraBoldItalic.ttf | 800 / italic | ttf; 172.3 KiB | 1060 / 471 | Static |
| Poppins-ExtraLight.ttf | 200 / normal | ttf; 159.7 KiB | 1060 / 471 | Static |
| Poppins-ExtraLightItalic.ttf | 200 / italic | ttf; 184.3 KiB | 1060 / 471 | Static |
| Poppins-Italic.ttf | 400 / italic | ttf; 180.2 KiB | 1060 / 471 | Static |
| Poppins-Light.ttf | 300 / normal | ttf; 158.1 KiB | 1060 / 471 | Static |
| Poppins-LightItalic.ttf | 300 / italic | ttf; 182.6 KiB | 1060 / 471 | Static |
| Poppins-Medium.ttf | 500 / normal | ttf; 154.9 KiB | 1060 / 471 | Static |
| Poppins-MediumItalic.ttf | 500 / italic | ttf; 178.7 KiB | 1060 / 471 | Static |
| Poppins-Regular.ttf | 400 / normal | ttf; 156.6 KiB | 1060 / 471 | Static |
| Poppins-SemiBold.ttf | 600 / normal | ttf; 153.6 KiB | 1060 / 471 | Static |
| Poppins-SemiBoldItalic.ttf | 600 / italic | ttf; 176.9 KiB | 1060 / 471 | Static |
| Poppins-Thin.ttf | 100 / normal | ttf; 159.8 KiB | 1060 / 471 | Static |
| Poppins-ThinItalic.ttf | 100 / italic | ttf; 185.1 KiB | 1060 / 471 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Deva, Grek, Latn, Zinh, Zyyy.

**OpenType features (union; per-file availability varies):** abvm, abvs, akhn, blwf, blwm, blws, half, haln, nukt, pres, psts, rkrf, rphf, ss01, ss02, ss03, ss04, vatu.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="reglo"></a>
## Reglo

**Character and fit (editorial):** A dense geometric sans with a punchy identity-led tone. Effective for concise headings, posters, and strong labels.

**Suggested contexts:** geometric, confident, cultural, bold. **Roles:** heading, display.

**Site listing:** sans-serif; SIL Open Font License v.1.1; Bold 700.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| Reglo-Bold.otf | 700 / normal | otf; 9.5 KiB | 116 / 115 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Latn, Zyyy.

**OpenType features (union; per-file availability varies):** cpsp, kern.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="roboto"></a>
## Roboto

**Character and fit (editorial):** A practical sans balancing constructed forms with open reading shapes. Useful for familiar application interfaces and mixed-language text.

**Suggested contexts:** practical, neutral, modern, technical. **Roles:** ui, body, heading.

**Site listing:** sans-serif; SIL Open Font License v.1.1; Thin 100, Thin Italic 100, Extralight 200, Extralight Italic 200, Light 300, Light Italic 300, Regular 400, Italic 400, Medium 500, Medium Italic 500, Semibold 600, Semibold Italic 600, Bold 700, Bold Italic 700, Extrabold 800, Extrabold Italic 800, Black 900, Black Italic 900.

**Verified distribution:** Apache-2.0. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| Roboto-Black.ttf | 900 / normal | ttf; 496.3 KiB | 3387 / 2772 | Static |
| Roboto-BlackItalic.ttf | 900 / italic | ttf; 513.4 KiB | 3387 / 2772 | Static |
| Roboto-Bold.ttf | 700 / normal | ttf; 502.2 KiB | 3387 / 2772 | Static |
| Roboto-BoldItalic.ttf | 700 / italic | ttf; 520.4 KiB | 3387 / 2772 | Static |
| Roboto-Italic.ttf | 400 / italic | ttf; 520.9 KiB | 3387 / 2772 | Static |
| Roboto-Light.ttf | 300 / normal | ttf; 506.4 KiB | 3387 / 2772 | Static |
| Roboto-LightItalic.ttf | 300 / italic | ttf; 526.9 KiB | 3387 / 2772 | Static |
| Roboto-Medium.ttf | 500 / normal | ttf; 499.6 KiB | 3387 / 2772 | Static |
| Roboto-MediumItalic.ttf | 500 / italic | ttf; 521.0 KiB | 3387 / 2772 | Static |
| Roboto-Regular.ttf | 400 / normal | ttf; 503.0 KiB | 3387 / 2772 | Static |
| Roboto-Thin.ttf | 100 / normal | ttf; 510.5 KiB | 3387 / 2772 | Static |
| Roboto-ThinItalic.ttf | 100 / italic | ttf; 526.0 KiB | 3387 / 2772 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Bopo, Cyrl, Grek, Latn, Zinh, Zyyy, Zzzz.

**OpenType features (union; per-file availability varies):** c2sc, ccmp, cpsp, dlig, dnom, frac, kern, liga, lnum, locl, mark, mkmk, numr, onum, pnum, salt, smcp, ss01, ss02, ss03, ss04, ss05, ss06, ss07, tnum, unic.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="terminal-grotesque-open"></a>
## Terminal Grotesque

**Character and fit (editorial):** A pixel-derived experimental grotesque with a digital, rough-edged presence. Useful for expressive technology and arts display work.

**Suggested contexts:** experimental, digital, rough, playful. **Roles:** display, heading.

**Site listing:** display; SIL Open Font License v.1.1; Regular 400.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| terminal-grotesque.ttf | 400 / normal | ttf; 49.7 KiB | 214 / 211 | Static |
| terminal-grotesque_open.otf | 400 / normal | otf; 103.4 KiB | 231 / 228 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Latn, Zyyy.

**OpenType features (union; per-file availability varies):** kern, liga.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="tex-gyre-heros"></a>
## Tex Gyre Heros

**Character and fit (editorial):** A disciplined neo-grotesque with a conventional Swiss voice. Useful for neutral information design and standard or condensed layouts.

**Suggested contexts:** neutral, institutional, clean, traditional. **Roles:** ui, body, heading.

**Site listing:** sans-serif; GUST Font License v.1.0; Regular 400, Condensed Regular 400, Italic 400, Condensed Italic 400, Bold 700, Condensed Bold 700, Bold Italic 700, Condensed Bold Italic 700.

**Verified distribution:** GUST Font License 1.0 / LPPL-1.3c-or-later. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| texgyreheros-bold.otf | 700 / normal | otf; 117.9 KiB | 1090 / 675 | Static |
| texgyreheros-bolditalic.otf | 700 / italic | otf; 117.5 KiB | 1090 / 675 | Static |
| texgyreheros-italic.otf | 400 / italic | otf; 116.5 KiB | 1090 / 675 | Static |
| texgyreheros-regular.otf | 400 / normal | otf; 116.7 KiB | 1090 / 675 | Static |
| texgyreheroscn-bold.otf | 700 / normal | otf; 116.9 KiB | 1090 / 675 | Static |
| texgyreheroscn-bolditalic.otf | 700 / italic | otf; 117.8 KiB | 1090 / 675 | Static |
| texgyreheroscn-italic.otf | 400 / italic | otf; 116.9 KiB | 1090 / 675 | Static |
| texgyreheroscn-regular.otf | 400 / normal | otf; 115.1 KiB | 1090 / 675 | Static |

**Encoded Unicode scripts (union; per-file coverage varies):** Grek, Latn, Zinh, Zyyy.

**OpenType features (union; per-file availability varies):** c2sc, cpsp, dlig, frac, kern, liga, lnum, locl, onum, pnum, salt, size, smcp, ss01, ss02, ss03, ss04, tnum, zero.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="work-sans"></a>
## Work Sans

**Character and fit (editorial):** A relaxed grotesque with a useful balance of personality and readability. Suitable for approachable editorial sites and product interfaces.

**Suggested contexts:** friendly, editorial, practical, modern. **Roles:** ui, body, heading.

**Site listing:** sans-serif; SIL Open Font License v.1.1; Thin 100, Thin Italic 100, Extralight 200, Extralight Italic 200, Light 300, Light Italic 300, Regular 400, Italic 400, Medium 500, Medium Italic 500, Semibold 600, Semibold Italic 600, Bold 700, Bold Italic 700, Extrabold 800, Extrabold Italic 800, Black 900, Black Italic 900.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| WorkSans-Italic[wght].ttf | 100 900 / italic | ttf; 328.9 KiB | 1229 / 754 | wght: 100–900 (default 400) |
| WorkSans[wght].ttf | 100 900 / normal | ttf; 352.6 KiB | 1349 / 754 | wght: 100–900 (default 400) |

**Encoded Unicode scripts (union; per-file coverage varies):** Grek, Latn, Zinh, Zyyy, Zzzz.

**OpenType features (union; per-file availability varies):** aalt, c2sc, calt, case, ccmp, cpsp, cswh, dlig, dnom, frac, hist, kern, liga, lnum, locl, mark, mkmk, nalt, numr, onum, ordn, ornm, pnum, rvrn, salt, sinf, smcp, ss01, ss02, ss03, ss04, ss05, ss06, subs, sups, swsh, titl, tnum, zero.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

<a id="young-serif"></a>
## Young Serif

**Character and fit (editorial):** A generous, rounded old-style serif with a warm, substantial voice. Useful for food, lifestyle, cultural, and personable editorial work.

**Suggested contexts:** warm, friendly, editorial, expressive. **Roles:** heading, body, display.

**Site listing:** serif; SIL Open Font License v.1.1; Regular 400.

**Verified distribution:** OFL-1.1. **Status:** bundled.

| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |
|---|---|---|---|---|
| Young-Serif-Italic[wght].woff2 | 300 700 / italic | woff2; 107.2 KiB | 1518 / 922 | wght: 300–700 (default 300) |
| Young-Serif[wght].woff2 | 300 700 / normal | woff2; 92.4 KiB | 1363 / 922 | wght: 300–700 (default 300) |

**Encoded Unicode scripts (union; per-file coverage varies):** Grek, Latn, Zinh, Zyyy, Zzzz.

**OpenType features (union; per-file availability varies):** aalt, c2sc, calt, case, ccmp, cpsp, dlig, dnom, frac, ital, kern, liga, lnum, locl, mark, numr, onum, ordn, pnum, rlig, sinf, smcp, ss01, ss03, ss04, ss05, subs, sups, tnum, zero.

Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.

## Notes and credits

Catalog discovery: [Open Foundry](https://open-foundry.com/). All linked font-detail pages were reviewed at the recorded date. Original font binaries and their legal notices remain unchanged. Repository URLs and distribution cautions below preserve the audit trail.

### Aileron

[Directory page](https://open-foundry.com/fonts/aileron) · Creators listed: Sori Sagano.

**Distribution notes:** The former ssagano/Aileron GitHub URL returns 404; the author's download is the source. No Rights Reserved is embedded; the site labels the dedication CC0.

**Project page:** https://dotcolon.net/fonts/aileron/

No working primary repository verified; the directory links only to github.com. Historical ssagano/Aileron returns 404.

Directory's repository field (may be historical, a mirror, or a placeholder): https://github.com/

**Pinned distribution:** `{"archive_url": "https://dotcolon.net/files/fonts/aileron_0102.zip", "archive_sha256": "a93a1327f44912a7b1410ad0056fec3e904074413b0bd9da550f6175587cf958"}`


### Archivo

[Directory page](https://open-foundry.com/fonts/archivo) · Creators listed: Hector Gatti.

**Distribution notes:** Open Foundry describes Archivo Black while listing Archivo styles. The bundle is Archivo, not the separate Archivo Black family.

**Project page:** https://www.omnibus-type.com/fonts/archivo/

**GitHub repository:** https://github.com/Omnibus-Type/Archivo

**Pinned distribution:** `{"repo": "Omnibus-Type/Archivo", "commit": "211127690e8ff106c36c935f7e5e697114cff103"}`


### Bagnard

[Directory page](https://open-foundry.com/fonts/bagnard) · Creators listed: Sebastien Sanfilippo.

**Distribution notes:** One regular style. Do not invent bold or italic faces; test small text carefully.

**Project page:** https://github.com/sebsan/bagnard

**GitHub repository:** https://github.com/sebsan/bagnard

**Pinned distribution:** `{"repo": "sebsan/bagnard", "commit": "31415d5e03d2088941fecae2c4ea9f2e6ca0446a"}`


### Bluu Next

[Directory page](https://open-foundry.com/fonts/bluu-next) · Creators listed: Jean-Baptiste Morizot.

**Distribution notes:** Bold, bold italic and titling files are bundled. This is not a broad-weight body-text family.

**Project page:** http://www.velvetyne.fr/fonts/bluu

**GitHub repository:** https://github.com/velvetyne/BluuNext

Directory's repository field (may be historical, a mirror, or a placeholder): https://github.com/jbmorizot/BluuNext/

**Pinned distribution:** `{"repo": "velvetyne/BluuNext", "commit": "a1d39f03faef4288ed99dca9f9a757b30e0b2627"}`


### Cooper Hewitt

[Directory page](https://open-foundry.com/fonts/cooper-hewitt) · Creators listed: Chester Jenkins.

**Distribution notes:** Binaries are from Font Library because the museum's download returned 403. Source UFOs and license remain available in the museum's GitHub repository.

**Project page:** https://www.cooperhewitt.org/open-source-at-cooper-hewitt/cooper-hewitt-the-typeface-by-chester-jenkins/

**GitHub repository:** https://github.com/cooperhewitt/cooperhewitt-typeface

**Pinned distribution:** `{"archive_url": "https://fontlibrary.org/assets/downloads/cooper-hewitt/cbff2bac99d77efd80f9b17689bcfc8c/cooper-hewitt.zip", "archive_sha256": "df5b0869296092fca85742a6295db8bbdedb4e1e19ecaafd195bbabd1ef22d4e"}`


### Cotham Sans

[Directory page](https://open-foundry.com/fonts/cotham-sans) · Creators listed: Sebastien Sanfilippo.

**Distribution notes:** A single regular style; use another family when multiple weights or true italics are needed.

**GitHub repository:** https://github.com/sebsan/Cotham

Directory's repository field (may be historical, a mirror, or a placeholder): http://github.com/sebsan/Cotham

**Pinned distribution:** `{"repo": "sebsan/Cotham", "commit": "eca5c6d0cdaea789e06a3118147c0ecbabe20e94"}`


### EB Garamond

[Directory page](https://open-foundry.com/fonts/eb-garamond) · Creators listed: Georg Duffner.

**Distribution notes:** The bundle uses Google Fonts' contemporary EB Garamond distribution, not every optical-size design in Georg Duffner's original project.

**Project page:** http://www.georgduffner.at/ebgaramond/

**GitHub repository:** https://github.com/georgd/EB-Garamond

**Pinned distribution:** `{"repo": "google/fonts", "commit": "23e54b51ddffbc7713c583748e3bd86f62b1fa4a"}`


### Gap Sans

[Directory page](https://open-foundry.com/fonts/gap-sans) · Creators listed: Alexandre Liziard, Étienne Ozeray.

**Distribution notes:** Regular, bold and black are separate files. Avoid dense body copy and critical small UI labels.

**Project page:** https://github.com/Interstices-/GapSans

**GitHub repository:** https://github.com/Interstices-/GapSans

**Pinned distribution:** `{"repo": "Interstices-/GapSans", "commit": "24e59f53bbfac3c7d8e4eb8db89ae828f9f8fba7"}`


### Inter

[Directory page](https://open-foundry.com/fonts/inter) · Creators listed: Rasmus Andersson.

**Distribution notes:** Use because it fits the task, not as an unconditional default. The bundle contains variable roman and italic webfonts.

**Project page:** https://rsms.me/inter/

**GitHub repository:** https://github.com/rsms/inter

Directory's repository field (may be historical, a mirror, or a placeholder): https://github.com/rsms/inter/

**Pinned distribution:** `{"repo": "rsms/inter", "commit": "353b61b9f4430d5f420d56605a6e7993e0941470"}`


### Junicode

[Directory page](https://open-foundry.com/fonts/junicode) · Creators listed: Peter Baker.

**Distribution notes:** The bundle is current Junicode 2 variable webfonts. The site's old Fromager mirror and historical character counts are not the current distribution. Test specialist shaping and private-use characters explicitly.

**Project page:** https://junicode.sourceforge.io/

**GitHub repository:** https://github.com/psb1558/Junicode-font

Directory's repository field (may be historical, a mirror, or a placeholder): https://github.com/Fromager/junicode

**Pinned distribution:** `{"repo": "psb1558/Junicode-font", "commit": "6978714c2bb053861a68489c052b1c88e7596bfb"}`


### League Gothic

[Directory page](https://open-foundry.com/fonts/league-gothic) · Creators listed: Tyler Finck, Caroline Hadilaksono, Micah Rich.

**Distribution notes:** Four release webfonts include regular and condensed widths, each upright and italic. Condensed is a separate CSS family alias.

**Project page:** http://github.com/theleagueof/league-gothic

**GitHub repository:** https://github.com/theleagueof/league-gothic

**Pinned distribution:** `{"archive_url": "https://github.com/theleagueof/league-gothic/releases/download/1.601/LeagueGothic-1.601.zip", "archive_sha256": "bcb78e7edcba6fbfe56c855737ddf82c40f57f093ef3b7890667e25c69ac3a08"}`


### Liberation Sans

[Directory page](https://open-foundry.com/fonts/liberation-sans) · Creators listed: Steve Matteson.

**Distribution notes:** Liberation Sans targets Arial metrics. Times New Roman and Courier compatibility belong to other Liberation families, not this one.

**Project page:** https://github.com/liberationfonts

**GitHub repository:** https://github.com/liberationfonts/liberation-fonts

Directory's repository field (may be historical, a mirror, or a placeholder): https://github.com/liberationfonts

**Pinned distribution:** `{"archive_url": "https://github.com/liberationfonts/liberation-fonts/files/7261482/liberation-fonts-ttf-2.1.5.tar.gz", "archive_sha256": "7191c669bf38899f73a2094ed00f7b800553364f90e2637010a69c0e268f25d0"}`


### Libre Baskerville

[Directory page](https://open-foundry.com/fonts/libre-baskerville) · Creators listed: Pablo Impallari, Rodrigo Fuenzalida.

**Distribution notes:** Current bundled variable files offer more styles than the three historically listed by Open Foundry.

**GitHub repository:** https://github.com/impallari/Libre-Baskerville

**Pinned distribution:** `{"repo": "impallari/Libre-Baskerville", "commit": "9852edf75ece3af500a5ec61245f94788c3d4633"}`


### M+ M Type-1

[Directory page](https://open-foundry.com/fonts/mplus-mtype-1) · Creators listed: Coji Morishita.

**Distribution notes:** M+ 1m is the legacy M Type-1 family. Do not confuse it with newer proportional M PLUS 1/2 discussed in the site's description. Files come from a labeled legacy mirror; Japanese glyphs increase payload size.

**Project page:** https://mplusfonts.github.io/

**GitHub repository:** https://github.com/rayshan/mplus-fonts

Directory's repository field (may be historical, a mirror, or a placeholder): https://github.com/

**Pinned distribution:** `{"repo": "rayshan/mplus-fonts", "commit": "0d4459efc913a91f33c3f08b219a5a95d282c7b8"}`


### Nimbus Sans L

[Directory page](https://open-foundry.com/fonts/nimbus-sans-l) · Creators listed: URW Type Foundry.

**Distribution notes:** Not bundled. The downloaded Font Library archive contains GPLv2 plus a document exception, despite the site's GPLv3 label. Its README points to separate PfaEdit sources that were not verified. User approval alone cannot resolve missing redistribution evidence; use a verified alternative or obtain the corresponding sources and terms first.

**Project page:** https://fontlibrary.org/en/font/nimbus-sans-l

No repository for the exact downloaded legacy distribution verified. Font Library is the checked distribution source.

Directory's repository field (may be historical, a mirror, or a placeholder): https://fontlibrary.org/en/font/nimbus-sans-l


### Office Code Pro

[Directory page](https://open-foundry.com/fonts/office-code-pro) · Creators listed: Nathan Rutzky.

**Distribution notes:** The original nathco repository returns 404. The bundle uses the explicitly labeled case community mirror with OFL notices; only the standard family is bundled, not the dotted-zero D variant.

**Project page:** https://www.fontsquirrel.com/fonts/office-code-pro

**GitHub repository:** https://github.com/case/font-office-code-pro-mirror

Directory's repository field (may be historical, a mirror, or a placeholder): https://github.com/nathco/Office-Code-Pro

**Pinned distribution:** `{"repo": "case/font-office-code-pro-mirror", "commit": "15154bcbb5fb90ce40c35810434045b715a15fca"}`


### Ostrich Sans

[Directory page](https://open-foundry.com/fonts/ostrich-sans) · Creators listed: Tyler Finck.

**Distribution notes:** Treat as display lettering, not a normal lowercase reading face. Dashed, rounded and inline designs are distinct variants; do not map them all onto one CSS weight axis.

**GitHub repository:** https://github.com/theleagueof/ostrich-sans

**Pinned distribution:** `{"repo": "theleagueof/ostrich-sans", "commit": "a949d40d0576d12ba26e2a45e19c91fd0228c964"}`


### Oswald

[Directory page](https://open-foundry.com/fonts/oswald) · Creators listed: Vernon Adams, Cyreal, Kalapi Gajjar.

**Distribution notes:** The current variable bundle is upright only. Do not manufacture italics or infer the legacy italic source designs are bundled.

**GitHub repository:** https://github.com/googlefonts/OswaldFont

**Pinned distribution:** `{"repo": "googlefonts/OswaldFont", "commit": "89795261ac9eeb9aa8cd99f43982c4e4b0e53261"}`


### Poppins

[Directory page](https://open-foundry.com/fonts/poppins) · Creators listed: Jonny Pinhorn, ITF.

**Distribution notes:** The Open Foundry description mistakenly discusses Bagnard. This entry instead uses the ITF/Google distribution and inspected font data. Stable static files are bundled rather than the upstream beta variable files.

**Project page:** https://www.indiantypefoundry.com/fonts/poppins

**GitHub repository:** https://github.com/itfoundry/Poppins

Directory's repository field (may be historical, a mirror, or a placeholder): https://github.com/itfoundry/poppins

**Pinned distribution:** `{"repo": "google/fonts", "commit": "23e54b51ddffbc7713c583748e3bd86f62b1fa4a"}`


### Reglo

[Directory page](https://open-foundry.com/fonts/reglo) · Creators listed: Sebastien Sanfilippo.

**Distribution notes:** One bold face. Do not use it as an all-purpose multi-weight text family.

**GitHub repository:** https://github.com/sebsan/Reglo

**Pinned distribution:** `{"repo": "sebsan/Reglo", "commit": "3b465388f0b45930e5217edc1fc82c5b6514e80c"}`


### Roboto

[Directory page](https://open-foundry.com/fonts/roboto) · Creators listed: Christian Robertson.

**Distribution notes:** The bundle follows the site's roboto-2 GitHub source: Apache 2.0, six upright weights plus italics. The site's OFL label and nine-weight listing refer to a different generation. Do not mix Roboto versions silently.

**Project page:** https://github.com/googlefonts/roboto-2

**GitHub repository:** https://github.com/googlefonts/roboto-2

**Pinned distribution:** `{"repo": "googlefonts/roboto-2", "commit": "38062f4b4a0be4346d07a928408da21602545e9e"}`


### Terminal Grotesque

[Directory page](https://open-foundry.com/fonts/terminal-grotesque-open) · Creators listed: Raphaël Bastide, Jérémy Landes.

**Distribution notes:** The site's slug emphasizes the Open variant. Both original and Open are bundled as separate faces. The GitHub license file contains an unrelated Blackout header; both font binaries carry their own full OFL and Terminal Grotesque notice, extracted and retained as the applicable evidence.

**Project page:** https://velvetyne.fr/fonts/terminal-grotesque/

**GitHub repository:** https://github.com/StudioTriple/Terminal-Grotesque

Directory's repository field (may be historical, a mirror, or a placeholder): https://gitlab.com/raphaelbastide/Terminal-Grotesque

**Pinned distribution:** `{"repo": "StudioTriple/Terminal-Grotesque", "commit": "40c09199041e81b17effa6da68ded63025df1cff"}`


### Tex Gyre Heros

[Directory page](https://open-foundry.com/fonts/tex-gyre-heros) · Creators listed: Boguslaw Jackowski, Janusz Nowacki.

**Distribution notes:** No official GitHub repository was verified. GUST is the primary distributor. Eight unmodified OTFs are bundled with GFL/LPPL terms, the manifest, and the complete upstream distribution archive; preserve these together.

**Project page:** https://www.gust.org.pl/projects/e-foundry/tex-gyre/heros

No official GitHub repository verified; use GUST.

**Pinned distribution:** `{"archive_url": "https://www.gust.org.pl/projects/e-foundry/tex-gyre/heros/tg_heros-otf-2_609-31_03_2026.zip", "archive_sha256": "a5803bb6211202b0e52447bbcbd41a209716b0952224c1116a28b6d342225abe", "complete_archive_url": "https://www.gust.org.pl/projects/e-foundry/tex-gyre/heros/tg_heros-TDS_distr-2_609-31_03_2026.zip", "complete_archive_sha256": "1bf430dbb818c86d86881dadf9139790f8dd763f6d002e6a152f9c65b7bcb602"}`


### Work Sans

[Directory page](https://open-foundry.com/fonts/work-sans) · Creators listed: Wei Huang.

**Distribution notes:** The bundle uses variable upright and italic TTF files. Copy only the styles needed by a project and budget their full-file download sizes.

**GitHub repository:** https://github.com/weiweihuanghuang/Work-Sans

**Pinned distribution:** `{"repo": "weiweihuanghuang/Work-Sans", "commit": "b35c81086186162164947bd39574683073d9b268"}`


### Young Serif

[Directory page](https://open-foundry.com/fonts/young-serif) · Creators listed: Bastien Sozeau.

**Distribution notes:** The site's specimen lists regular only. The bundle uses the newer upstream variable roman and italic files; confirm the desired version before matching an older brand specimen.

**Project page:** https://noirblancrouge.com/fonts/young-serif/

**GitHub repository:** https://github.com/noirblancrouge/YoungSerif

**Pinned distribution:** `{"repo": "noirblancrouge/YoungSerif", "commit": "8a6c3ceeed5e52bd77b0dfad6b76e99096b9fd4b"}`
