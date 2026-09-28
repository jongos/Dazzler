"""Validate distributable structure, asset integrity, local links, and extracted helpers."""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys
import tempfile
import zipfile


def validate(folder):
    folder = Path(folder).resolve()
    sums = dict(line.split('  ', 1)[::-1] for line in (folder/'SHA256SUMS.txt').read_text().splitlines())
    for name, digest in sums.items():
        assert hashlib.sha256((folder/name).read_bytes()).hexdigest() == digest, name
    for archive in sorted(folder.glob('*.zip')):
        with zipfile.ZipFile(archive) as z:
            names = z.namelist()
            assert len(names) == len(set(names))
            assert not any(PurePosixPath(n).is_absolute() or '..' in PurePosixPath(n).parts for n in names)
            if archive.name=='dazzler-templates.zip':
                catalog=json.loads(z.read('dazzler-templates/catalog.json'))
                assert len(catalog['templates'])==30
                for relative,digest in catalog['files'].items():assert hashlib.sha256(z.read('dazzler-templates/'+relative)).hexdigest()==digest
                print('dazzler-templates.zip: all 30 templates and resource hashes passed')
                continue
            entry = next(n for n in names if n.endswith('/SKILL.md'))
            prefix = entry.removesuffix('SKILL.md')
            text = z.read(entry).decode()
            assert 'name: dazzler-frontend' in text and '## Verify the result' in text
            assert 'MAINTENANCE.md' not in text and '$dazzler-frontend' not in text
            assert not any(n.endswith('MAINTENANCE.md') or n.endswith('agents/openai.yaml') for n in names)
            templates=json.loads(z.read(prefix+'assets/templates/catalog.json'))
            assert len(templates['templates'])==30
            for relative,digest in templates['files'].items():assert hashlib.sha256(z.read(prefix+'assets/templates/'+relative)).hexdigest()==digest
            for required in ('scripts/studio.mjs','scripts/project.py','scripts/browser.cjs','scripts/evaluate.py','evals/cross-platform.json','references/design-studio.md','references/visualization.md','scripts/visualize.mjs','scripts/office-chart.R'):
                assert prefix+required in names, required
            graphics=json.loads(z.read(prefix+'references/asset-catalog.json'))
            assert len(graphics['assets'])==15
            for asset in graphics['assets']:
                assert hashlib.sha256(z.read(prefix+asset['path'])).hexdigest()==asset['sha256']
            catalog = json.loads(z.read(prefix+'references/font-catalog.json'))
            checked = 0
            for family in catalog['fonts']:
                if family['status'] != 'bundled': continue
                for item in family['files'] + family['support_files']:
                    assert hashlib.sha256(z.read(prefix+item['path'])).hexdigest() == item['sha256']
                    checked += 1
            assert checked == 206
            viz=json.loads(z.read(prefix+'scripts/vendor/viz/provenance.json'))
            for relative,digest in viz['files'].items():
                assert hashlib.sha256(z.read(prefix+'scripts/vendor/viz/'+relative)).hexdigest()==digest
            hotspots = json.loads(z.read(prefix+'scripts/vendor/hotspots/provenance.json'))
            for relative,digest in hotspots['files'].items():
                assert hashlib.sha256(z.read(prefix+'scripts/vendor/hotspots/'+relative)).hexdigest()==digest
            assert prefix+'references/interactive-illustrations.md' in names
            prov = json.loads(z.read(prefix+'scripts/vendor/provenance.json'))
            assert hashlib.sha256(z.read(prefix+'scripts/vendor/color-engine.mjs')).hexdigest() == prov['sha256']
            for n in names:
                if not n.endswith('.md') or '/assets/' in n: continue
                for link in re.findall(r'\]\(([^)]+)\)', z.read(n).decode()):
                    if re.match(r'^(https?:|mailto:|#)',link):continue
                    import posixpath
                    target=posixpath.normpath(posixpath.join(posixpath.dirname(n),link.split('#')[0]))
                    assert target in names or any(x.startswith(target.rstrip('/')+'/') for x in names), (n,link)
            if 'plugin' in archive.name:
                manifest=json.loads(z.read('dazzler/.claude-plugin/plugin.json'))
                expected=json.loads((Path(__file__).resolve().parents[1]/'.codex-plugin/plugin.json').read_text())
                assert manifest['name']=='dazzler' and manifest['version']==expected['version']
            with tempfile.TemporaryDirectory() as temp:
                z.extractall(temp)
                skill=Path(temp)/prefix
                config=Path(temp)/'chart-input.json'
                config.write_text(json.dumps({'title':'Package smoke check','data':[{'x':'A','y':1},{'x':'B','y':3}]}))
                subprocess.run(['node',str(skill/'scripts/visualize.mjs'),'--config',str(config),'--out',str(Path(temp)/'chart-output')],capture_output=True,text=True,check=True,timeout=30)
                assert (Path(temp)/'chart-output/chart.svg').read_text().startswith('<svg')
                art=Path(temp)/'art.svg'
                art.write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect id="room" width="90" height="90"/></svg>')
                interactive=Path(temp)/'interactive.json'
                interactive.write_text(json.dumps({'title':'Illustration package check','imageAlt':'A room.','regions':[{'id':'room','label':'Room','description':'A sample room.'}]}))
                subprocess.run(['node',str(skill/'scripts/hotspots.mjs'),'--config',str(interactive),'--art',str(art),'--out',str(Path(temp)/'interactive-output')],capture_output=True,text=True,check=True,timeout=30)
                assert json.loads((Path(temp)/'interactive-output/report.json').read_text())['renderer']=='svgjs'
                result=subprocess.run([sys.executable,'-X','utf8',str(skill/'scripts/fonts.py'),'recommend','--role','body','--text','Dazzler'],capture_output=True,text=True,check=True)
                assert json.loads(result.stdout)
                result=subprocess.run(['node',str(skill/'scripts/colors.mjs'),'recommend','--mood','cozy'],capture_output=True,text=True,check=True)
                assert json.loads(result.stdout)
                cfg=Path(temp)/'system-input.json';cfg.write_text('{"brand":{"seed":"#345678"}}')
                subprocess.run(['node',str(skill/'scripts/studio.mjs'),'tokens','--config',str(cfg),'--out',str(Path(temp)/'system')],capture_output=True,text=True,check=True)
                assert json.loads((Path(temp)/'system/design-system.json').read_text())['palette']['modes']['light']['tokens']['brand']=='#345678'
                subprocess.run([sys.executable,'-X','utf8',str(skill/'scripts/project.py'),'assets','--kind','icon','--ids','check','--out',str(Path(temp)/'icons')],capture_output=True,text=True,check=True)
                subprocess.run([sys.executable,'-X','utf8',str(skill/'scripts/evaluate.py'),'--host','package-check','--out',str(Path(temp)/'eval')],capture_output=True,text=True,check=True)
                assert all(r['status']=='not-run' for r in json.loads((Path(temp)/'eval/evaluation.json').read_text())['results'])
                subprocess.run([sys.executable,'-X','utf8',str(skill/'scripts/templates.py'),'export','restaurant-cafe','--out',str(Path(temp)/'template-export')],capture_output=True,text=True,check=True)
                assert (Path(temp)/'template-export/ui/restaurant-cafe/index.html').is_file()
            print(f'{archive.name}: structure, links, 206 font/support hashes, 15 graphics, color/viz engines and extracted core/studio/chart/evaluation helpers passed')


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('folder',type=Path)
    validate(parser.parse_args().folder)
