# Color Appearance and Useful Math

Use with the [color workflow](color-workflow.md) when choosing palettes, ramps, gradients, neutrals or cross-format tokens. Improve the authored colors and their relationships; Dazzler cannot measure spectra, calibrate displays or optimize for a particular viewer's display. This is design guidance, not an implementation of Apple CMF 2026.

## The Transferable Lesson

Apple's 2026 calibration overview explains why matching standard coordinates can still produce appearance mismatches with narrowband displays. Its work changes the measurement observer and derives calibration targets from spectral assumptions. The Apple-authored 2025 paper explores idealized spectral definitions of standard primaries. These are related research directions, not interchangeable algorithms: the paper's broad step-function spectra are not the overview's three-monochromatic-primary construction. Neither cited document supplies the full Apple CMF 2026 curves for Dazzler to implement.

For design, the useful lesson is to name the model and preserve its limits. Keep three separate questions:

- **Color identity:** Are values interpreted in the intended color space and profile?
- **Perceptual structure:** Do lightness, chroma, hue, area and adjacency support the hierarchy?
- **Accessibility:** Do the final functional pairs meet their contrast requirements and communicate without color alone?

A success on one question does not answer the other two. The rules below are Dazzler's application of established color math, not Apple's recommendations for UI palettes.

## Why Coordinates Cannot Recover a Spectrum

For an emissive spectrum `S(lambda)` and observer functions `c_o(lambda)`, the tristimulus response is `t_o = integral S(lambda) * c_o(lambda) d lambda`, with consistent units and normalization. Sampling gives `t_o = A_o * s`, where `A_o` is a 3-by-N matrix including wavelength weights. Many spectra can have the same three responses. If `A_o * d = 0` but `A_p * d != 0`, spectra `s` and `s+d` match observer `o` but not `p`, provided both spectra are physically nonnegative. This is the information-loss problem behind observer metamerism.

Consequences for Dazzler:

- RGB or XYZ values alone do not determine an arbitrary spectrum or a universal transform to a different physiological observer. Do not invent spectra, Apple CMF tables, correction matrices or device-specific tint fixes from screenshots or hex values.
- This does **not** prevent ordinary sRGB/Display P3/XYZ conversions within a defined colorimetric system. Use established conversions, transfer functions, white points and chromatic adaptation when required. Chromatic adaptation changes the reference white, not the physiological observer. Converting coordinates is not calibrating hardware.
- Chromaticity `x=X/(X+Y+Z), y=Y/(X+Y+Z)` drops intensity. Scaling a nonzero XYZ triplet leaves xy unchanged; black has no defined xy. Chromaticity distance is neither text contrast nor a complete perceptual difference metric.

## Choose the Math for the Job

### Preserve Color Identity

Keep each input's color-space/profile identity with its values. CSS hex and `rgb()` are sRGB, not generic untagged RGB. `color(display-p3 ...)` uses different primaries; reusing its three numbers as sRGB changes the color. D65 is a reference white, not a warm/cool UI tint. Display P3 uses D65 and the sRGB transfer function; do not confuse it with cinema DCI-P3. Preserve valid image/document profiles through export where the tool supports them and state unknown profiles rather than guessing from appearance.

Dazzler's current color helper accepts opaque six-digit sRGB hex and exports sRGB tokens. For an external wide-gamut source, use an available verified conversion before invoking it, record the source, mapping and fallback, and report a conflict if conversion would violate an exact brand lock. Do not feed P3 components directly into the helper or imply it now exports wide gamut.

### Use Linear Light for Light Arithmetic

Apply the sRGB decoding formula in [relationship knowledge](color-relationships.json) before calculating relative luminance or physically additive light mixtures. Encode again for output. A normalized encoded channel of `0.5` decodes to about `0.214041`, not half the light. A 50/50 linear-light mixture of black and white encodes to about `0.735357`, which rounds to `#BCBCBC`; averaging the encoded channels instead rounds to `#808080`. These are different operations, not competing definitions of the same midpoint.

For a perceptually even authored ramp, use OKLab/OKLCH instead of assuming linear light will look evenly spaced. Explicitly choose a supported gradient interpolation space. Alpha compositing is a separate operation: measure the colors actually composited by the target renderer against the real background, rather than assuming every CSS or Office pipeline blends in linear light. Check relevant gradient stops and intermediate regions, not endpoints alone.

### Use Perceptual Coordinates for Palette Structure

OKLCH separates approximate lightness `L`, chroma `C` and hue `h`. Its Cartesian form is `a=C*cos(h), b=C*sin(h)` with angle units converted correctly. OKLab distance is `sqrt(dL^2 + da^2 + db^2)`. Use it to compare candidates within the same model and scale, not to certify harmony, legibility or a universally noticeable difference. Dazzler's existing `0.025` palette-separation threshold is only a diversity heuristic.

Equal OKLCH lightness does not mean equal WCAG relative luminance. Preserve separate measurements for each. For a sequential data ramp, inspect ordered lightness and distinguishable exported steps; categorical colors still need labels or other non-color cues. Near zero chroma, hue is undefined or unstable, so do not create hue-rotation rules from numerical noise. When interpolating hue, choose the path explicitly: 350 to 10 degrees can pass through 0 rather than 180. Respect an intentional longer path.

### Budget Chroma Within the Output Gamut

At fixed lightness and hue, available chroma depends on the destination gamut. Dazzler already estimates `C_max(L,h)` for sRGB; choose `C <= f*C_max` with `0 <= f <= 1` and any stricter authored cap. This is a design-space bound, not a model of the user's display. Avoid arbitrary per-channel clipping as a palette-design strategy because it can distort relationships. Use the existing gamut mapper, then inspect actual quantized output for collapsed steps, shifted hues and failed role pairs. Reducing chroma is one repair option, not a requirement to mute every design.

### Judge Neutrals in Context

Keep a deliberately warm or cool surface when the brief calls for it. Judge neutrals alongside real typography, adjacent fills, images and color area in both themes; an isolated swatch is weak evidence for the composition. Do not apply an inverse tint to all tokens because one screenshot looks warm. An authored neutral in a defined color space is not a promise that every viewer or display sees the same white. Preserve hierarchy with lightness separation, readable roles and redundant meaning, rather than relying on tiny hue differences.

## Apply and Verify

1. Record source color space/profile, approved brand locks and intended output space. Keep these notes with the chosen palette in the existing design record; do not invent new helper configuration fields.
2. Explore lightness, chroma and hue with the existing generator. Review neutral relationships, color area and semantic roles using actual content.
3. Map to the supported output gamut and quantize, then recompute contrast on those exported values. Use the existing WCAG sRGB luminance formula and unrounded thresholds; do not replace its coefficients with Apple calibration coordinates or OKLCH `L`.
4. Measure each real adjacency after compositing. Keep text targets distinct from graphical targets and test light/dark themes separately. Do not relax thresholds to compensate for a perceptual model.
5. Inspect ramps, gradients and chart distinctions at their actual size, with labels or other non-color cues. Numerical differences and approximate color-vision simulations do not prove usability.
6. Deliver the palette, source/mapping decisions, measured pairs and unverified conditions. Say what was rendered and tested; do not promise identical appearance across devices or viewers.

## Notes and Credits

- Apple, [Display Color Calibration with Apple CMF 2026](https://www.apple.com/iphone/pdf/Display_Color_Calibration_with_Apple_CMF_Tech_Overview_SEPT_2026.pdf), September 2026, pp. 3–6: observer/calibration distinction and limits of primary-coordinate-only transformations. Research context only; no curves, code or calibration targets imported.
- Yuteng Zhu et al. (Apple), [Spectral Definition of Standard Color Space Primaries for Display](https://doi.org/10.2352/CIC.2025.33.1.27), CIC 2025, pp. 142–146, [publisher full text](https://library.imaging.org/admin/apis/public/api/ist/website/downloadArticle/cic/33/1/27), CC BY 4.0: spectral-response formulation and observer metamerism. Equations are restated in column-vector notation; no paper figures or spectral datasets are bundled.
- W3C, [CSS Color 4](https://www.w3.org/TR/css-color-4/): color-space identity, conversion, interpolation, gamut mapping and compositing. Follow supported target-renderer behavior; the specification is a work in progress.
- Björn Ottosson, [A Perceptual Color Space for Image Processing](https://bottosson.github.io/posts/oklab/): OKLab/OKLCH geometry and modeling assumptions. Dazzler retains its pinned existing engine.
- W3C, [WCAG 2.2 contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): relative luminance, thresholds and actual foreground/background evaluation. Calibration research does not amend these accessibility rules.
