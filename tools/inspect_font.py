"""Read font metadata without changing the font. Requires fonttools and brotli."""
from pathlib import Path
import hashlib
from fontTools.ttLib import TTFont
from fontTools.unicodedata import script


def ranges(values):
    result = []
    for value in sorted(values):
        if result and value == result[-1][1] + 1:
            result[-1][1] = value
        else:
            result.append([value, value])
    return result


def inspect(path):
    path = Path(path)
    with TTFont(path) as font:
        names = font['name']
        cmap = font.getBestCmap() or {}
        os2 = font['OS/2']
        axes = {a.axisTag: {'min': a.minValue, 'default': a.defaultValue, 'max': a.maxValue}
                for a in font['fvar'].axes} if 'fvar' in font else {}
        features = set()
        layout_scripts = set()
        for tag in ('GSUB', 'GPOS'):
            if tag in font:
                table = font[tag].table
                if table.FeatureList:
                    features.update(x.FeatureTag for x in table.FeatureList.FeatureRecord)
                if table.ScriptList:
                    layout_scripts.update(x.ScriptTag for x in table.ScriptList.ScriptRecord)
        italic = bool(os2.fsSelection & 1) or bool(font['head'].macStyle & 2)
        digit_widths = [font['hmtx'][cmap[c]][0] for c in range(48, 58) if c in cmap]
        return {
            'filename': path.name, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
            'bytes': path.stat().st_size, 'format': path.suffix.lstrip('.'),
            'family': names.getDebugName(16) or names.getDebugName(1),
            'subfamily': names.getDebugName(17) or names.getDebugName(2),
            'postscript_name': names.getDebugName(6), 'version': names.getDebugName(5),
            'copyright': names.getDebugName(0), 'license_description': names.getDebugName(13),
            'license_url': names.getDebugName(14), 'weight': os2.usWeightClass,
            'width_class': os2.usWidthClass, 'style': 'italic' if italic else 'normal',
            'fixed_pitch': bool(font['post'].isFixedPitch), 'embedding_bits': os2.fsType,
            'tabular_default_digits': len(digit_widths) == 10 and len(set(digit_widths)) == 1,
            'units_per_em': font['head'].unitsPerEm, 'x_height': getattr(os2, 'sxHeight', None),
            'cap_height': getattr(os2, 'sCapHeight', None),
            'glyph_count': font['maxp'].numGlyphs, 'codepoint_count': len(cmap),
            'unicode_ranges': ranges(cmap), 'unicode_scripts': sorted({script(c) for c in cmap}),
            'layout_scripts': sorted(layout_scripts), 'features': sorted(features), 'axes': axes,
        }
