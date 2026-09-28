"""Render the reviewed JSON catalog into a readable reference (standard library)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'skills/dazzler-frontend/references'


def render():
    data = json.loads((REF / 'font-catalog.json').read_text(encoding='utf-8'))
    notes = []
    lines = ['# Font catalog', '',
             f"Checked {data['checked_at']}: **{data['family_count']} families; {data['bundled_family_count']} bundled**.", '',
             'This is a dated inventory. Confirm suitability against the actual project text and requirements.', '',
             'Descriptions and suggested roles are editorial judgments. Site listings, audited distribution facts, and implementation mappings are separate. Script tags describe encoded characters, not guaranteed full language coverage or correct shaping. Check actual project text.', '',
             'Binary technical attributes are in [font-catalog.json](font-catalog.json): SHA-256, source URL/commit or archive hash, family/subfamily/version, raw OS/2 weight/width and embedding flags, CSS mappings, variable axes, glyph/codepoint counts, Unicode ranges/scripts, GSUB/GPOS scripts/features, default digit widths, metrics, formats and byte sizes.', '',
             'CSS weights/styles below follow named upstream styles, with explicit corrections for inconsistent legacy metadata; original binaries remain unchanged. Raw values remain in JSON. In particular Cooper Hewitt encodes weights as 701–714 and omits italic flags, while some old Thin fonts encode weights as 250/275. Do not use those raw numbers blindly as CSS weights.', '',
             'Apache 2.0 covers our instructions and scripts. Fonts retain their individual licenses. Copy each selected font with its support files; see [typography.md](typography.md).', '',
             '| Family | Suggested roles | Distribution license | Bundle |',
             '|---|---|---|---|']
    for f in data['fonts']:
        lines.append(f"| [{f['name']}](#{f['id']}) | {', '.join(f['roles'])} | {f['license']} | {f['status']} |")
    for f in data['fonts']:
        lines += ['', f'<a id="{f["id"]}"></a>', f"## {f['name']}", '',
                  f"**Character and fit (editorial):** {f['description']}", '',
                  f"**Suggested contexts:** {', '.join(f['moods'])}. **Roles:** {', '.join(f['roles'])}.", '',
                  f"**Site listing:** {f['directory_classification']}; {f['directory_license']}; " + ', '.join(f"{i['name']} {i['weight']}" for i in f['directory_instances']) + '.', '',
                  f"**Verified distribution:** {f['license']}. **Status:** {f['status']}.", '',
                  ]
        notes += ['', f"### {f['name']}", '', f"[Directory page]({f['directory_url']}) · Creators listed: {', '.join(f['creators'])}.", '', f"**Distribution notes:** {f['cautions']}", '']
        if f.get('project_url'):
            notes += [f"**Project page:** {f['project_url']}", '']
        if f.get('github_repository'):
            notes += [f"**GitHub repository:** {f['github_repository']}", '']
        if f.get('github_status'):
            notes += [f['github_status'], '']
        if f.get('directory_repository_url') and f['directory_repository_url'] != f.get('github_repository'):
            notes += [f"Directory's repository field (may be historical, a mirror, or a placeholder): {f['directory_repository_url']}", '']
        if f.get('distribution'):
            notes += ['**Pinned distribution:** `' + json.dumps(f['distribution'], ensure_ascii=False) + '`', '']
        lines += ['| File / style | CSS weight / style | Format; size | Glyphs / codepoints | Variable axes |', '|---|---|---|---|---|']
        for v in f['files']:
            axes = '; '.join(f"{k}: {a['min']:g}–{a['max']:g} (default {a['default']:g})" for k,a in v['axes'].items()) or 'Static'
            lines.append(f"| {v['filename']} | {v['css_weight']} / {v['css_style']} | {v['format']}; {v['bytes'] / 1024:.1f} KiB | {v['glyph_count']} / {v['codepoint_count']} | {axes} |")
        scripts = sorted({s for v in f['files'] for s in v['unicode_scripts']})
        features = sorted({s for v in f['files'] for s in v['features']})
        lines += ['', '**Encoded Unicode scripts (union; per-file coverage varies):** ' + ', '.join(scripts) + '.', '',
                  '**OpenType features (union; per-file availability varies):** ' + (', '.join(features) or 'None reported') + '.', '',
                  'Use the JSON record for exact per-file ranges and metadata. Mere character presence does not establish language shaping quality.']
    lines += ['', '## Notes and credits', '', 'Catalog discovery: [Open Foundry](https://open-foundry.com/). All linked font-detail pages were reviewed at the recorded date. Original font binaries and their legal notices remain unchanged. Repository URLs and distribution cautions below preserve the audit trail.'] + notes
    (REF / 'font-catalog.md').write_text('\n'.join(lines).rstrip() + '\n', encoding='utf-8')


if __name__ == '__main__':
    render()
