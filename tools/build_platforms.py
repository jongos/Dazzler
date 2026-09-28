"""Build self-contained platform packages from canonical Dazzler resources (stdlib only)."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'skills/dazzler-frontend'
PLATFORMS = ('claude', 'gemini', 'cursor', 'copilot')


def skill_text(platform):
    text = (SOURCE / 'SKILL.md').read_text(encoding='utf-8')
    text = re.sub(r'When asked to update this skill.*?\n\n', '', text, count=1)
    start = text.index('## Implement with available capabilities')
    end = text.index('## Verify the result', start)
    routing = (ROOT / f'platforms/{platform}/HOST.md').read_text(encoding='utf-8')
    text = text[:start] + routing + '\n\n' + text[end:]
    text = text.replace('This version adds ChatGPT/Codex tool routing and verification,',
                        'This edition adds host-specific tool routing and verification,')
    if platform == 'claude':
        return text.replace('Use $dazzler-frontend to ...', '/dazzler-frontend ...')
    return text.replace('$dazzler-frontend', 'Dazzler')


def assemble(platform, target):
    target.mkdir(parents=True)
    for name in ('references', 'scripts', 'assets'):
        shutil.copytree(SOURCE / name, target / name,
                        ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
    for name in ('LICENSE.txt', 'PROVENANCE.md'):
        shutil.copy2(SOURCE / name, target / name)
    (target / 'SKILL.md').write_text(skill_text(platform), encoding='utf-8')
    notices = (ROOT / 'THIRD_PARTY_NOTICES.md').read_text(encoding='utf-8')
    notices = notices.replace('skills/dazzler-frontend/', '')
    (target / 'THIRD_PARTY_NOTICES.md').write_text(notices, encoding='utf-8')
    shutil.copy2(ROOT / f'platforms/{platform}/README.md', target / 'INSTALL.md')
    return target


def archive(folder, output):
    # Stable names/order/timestamps; original binary/license bytes remain unchanged.
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED) as bundle:
        for path in sorted(folder.rglob('*')):
            if path.is_file():
                info = zipfile.ZipInfo(path.relative_to(folder.parent).as_posix(), (2026, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o100644 << 16
                bundle.writestr(info, path.read_bytes())


def build(destination):
    destination = Path(destination).resolve()
    if destination.exists():
        raise ValueError('Use a new output directory; existing outputs are not overwritten')
    destination.mkdir(parents=True)
    manifest = json.loads((ROOT / '.codex-plugin/plugin.json').read_text())
    for platform in PLATFORMS:
        skill = assemble(platform, destination / platform / 'dazzler-frontend')
        archive(skill, destination / f'dazzler-{platform}.zip')
    plugin = destination / 'claude-plugin/dazzler'
    assemble('claude', plugin / 'skills/dazzler-frontend')
    (plugin / '.claude-plugin').mkdir()
    (plugin / '.claude-plugin/plugin.json').write_text(json.dumps({
        'name': 'dazzler', 'version': manifest['version'],
        'description': manifest['description'], 'author': manifest['author'],
        'repository': manifest['repository'], 'license': 'Apache-2.0'
    }, indent=2)+'\n', encoding='utf-8')
    shutil.copy2(ROOT / 'LICENSE', plugin / 'LICENSE')
    shutil.copy2(ROOT / 'platforms/claude/README.md', plugin / 'README.md')
    archive(plugin, destination / 'dazzler-claude-plugin.zip')
    shutil.copy2(ROOT / 'platforms/portable/DAZZLER-PROMPT.md', destination / 'DAZZLER-PROMPT.md')
    files = sorted(destination.glob('*.zip')) + [destination / 'DAZZLER-PROMPT.md']
    (destination / 'SHA256SUMS.txt').write_text(''.join(
        hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name+'\n' for p in files), encoding='utf-8')
    return files


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', required=True, type=Path)
    args = parser.parse_args()
    for path in build(args.out):
        print(path)
