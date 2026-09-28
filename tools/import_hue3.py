"""Import reviewed hue3 palette facts from a pinned checkout; never import its instructions."""
import argparse
import json
from pathlib import Path
import re
import subprocess

PIN = 'a306210b7240e183366998ce39fbe7543cc09b41'
ROOT = Path(__file__).resolve().parents[1]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('checkout', type=Path)
    args = parser.parse_args()
    actual = subprocess.check_output(['git', '-C', str(args.checkout), 'rev-parse', 'HEAD'], text=True).strip()
    if actual != PIN or subprocess.check_output(['git', '-C', str(args.checkout), 'status', '--porcelain'], text=True).strip():
        raise SystemExit('Expected a clean checkout at the reviewed hue3 commit.')
    palettes = []
    for source in sorted((args.checkout / 'references').glob('*.md')):
        if source.stem == 'color-theory':
            continue
        for block in re.split(r'(?m)^## ', source.read_text(encoding='utf-8'))[1:]:
            heading = block.splitlines()[0]
            match = re.fullmatch(r'([A-Z]+-\d+) — (.+)', heading)
            if not match:
                raise ValueError(f'Unexpected heading: {heading}')
            roles = dict(re.findall(r'\| (Primary|Secondary|Accent) \d+% \| (#[0-9A-Fa-f]{6})', block))
            extended = dict(re.findall(r'(Background|Surface|Text|Border) (#[0-9A-Fa-f]{6})', block))
            if len(roles) != 3 or len(extended) != 4:
                raise ValueError(f'Incomplete palette: {heading}')
            palettes.append({
                'id': match[1], 'name': match[2], 'mood': source.stem,
                'colors': {key.lower(): value.upper() for key, value in (roles | extended).items()},
                'atmosphere': re.search(r'\*\*Atmosphere:\*\* (.+)', block)[1],
                'source': f'https://github.com/ktzzypo938/hue3/blob/{PIN}/references/{source.name}',
            })
    if len(palettes) != 88 or len({p['id'] for p in palettes}) != 88:
        raise ValueError('Expected exactly 88 unique reviewed palettes.')
    dest = ROOT / 'skills/dazzler-frontend/references'
    (dest / 'color-palettes.json').write_text(json.dumps({
        'source_commit': PIN, 'license': 'MIT; see hue3-LICENSE.txt',
        'note': 'Editorial starting points, not accessibility-certified tokens. Mood associations are contextual.',
        'palettes': palettes,
    }, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    # Preserve the upstream Git blob, independent of checkout CRLF conversion.
    (dest / 'hue3-LICENSE.txt').write_bytes(subprocess.check_output(
        ['git', '-C', str(args.checkout), 'show', f'{PIN}:LICENSE']))
    print(f'Imported {len(palettes)} palettes from {PIN}.')

if __name__ == '__main__':
    main()
