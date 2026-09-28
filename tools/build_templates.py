"""Build the original Dazzler templates; python-docx is an authoring dependency only."""
import argparse
import hashlib
import html
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
from template_documents import DOCS, render_docx, render_html
from template_interfaces import UIS, build_ui

ROOT=Path(__file__).resolve().parents[1]
SKILL=ROOT/'skills/dazzler-frontend'
OUT=SKILL/'assets/templates'
VERSION='0.10.0'

def fonts():
    folder=OUT/'fonts';folder.mkdir(exist_ok=True)
    for family,filename in [('work-sans','WorkSans[wght].ttf'),('young-serif','Young-Serif[wght].woff2')]:
        if not (folder/family).exists():
            with tempfile.TemporaryDirectory() as scratch:
                subprocess.run([sys.executable,str(SKILL/'scripts/fonts.py'),'export',family,'--dest',scratch,'--file',filename],check=True,capture_output=True)
                shutil.copytree(Path(scratch)/family,folder/family)
    (folder/'fonts.css').write_text('@import url("work-sans/fonts.css");\n@import url("young-serif/fonts.css");\n',encoding='utf-8')

def gallery():
    e=lambda x:html.escape(str(x),quote=True)
    def preview(id):
        return '<img src="previews/'+id+'.jpg" alt="'+e(id.replace('-',' '))+' template preview" loading="lazy">' if (OUT/'previews'/f'{id}.jpg').exists() else ''
    docs=''.join('<article>'+preview('html-'+d['id'])+'<div><small>'+e(d['id'].upper())+'</small><h2>'+e(d['title'])+'</h2><p>'+e(d['use'])+'</p><p><a href="html/'+d['id']+'.html">Preview HTML</a> · <a href="docx/'+d['id']+'.docx" download>Download Word</a></p></div></article>' for d in DOCS)
    uis=''.join('<article>'+preview(d['id'])+'<div><small>'+e(d['category'].upper())+'</small><h2>'+e(d['brand'])+'</h2><p>'+e(d['title'])+'</p><p><a href="ui/'+d['id']+'/index.html">Open interface</a> · <a href="ui/'+d['id']+'/template.json">JSON</a></p></div></article>' for d in UIS)
    css="*{box-sizing:border-box}body{margin:0;background:#F6F3ED;color:#20252C;font:16px/1.6 'Work Sans',Arial,sans-serif}header,main,footer{max-width:1320px;margin:auto;padding:28px 5%}header{display:flex;justify-content:space-between;border-bottom:1px solid #B7BEC5}a{color:#503581;text-underline-offset:4px}h1{font:48px/1.15 'Young Serif',Georgia,serif;max-width:20ch}h2{font-size:22px;line-height:1.3;margin:10px 0}h3{font-size:27px;margin-top:45px}.intro{max-width:70ch}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}article{background:white;border:1px solid #C8CDD0;overflow:hidden;border-radius:8px}article>div{padding:23px}article img{width:100%;height:220px;object-fit:cover;object-position:top;border-bottom:1px solid #C8CDD0}article small{font-size:10px;letter-spacing:.09em;color:#515C69}article p{font-size:14px}.button{display:inline-block;background:#503581;color:white;padding:12px 18px;border-radius:5px;text-decoration:none}:focus-visible{outline:3px solid #503581;outline-offset:4px}@media(max-width:800px){.grid{grid-template-columns:1fr 1fr}}@media(max-width:550px){.grid{grid-template-columns:1fr}h1{font-size:36px}}"
    page='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dazzler template library</title><link rel="stylesheet" href="fonts/fonts.css"><style>'+css+'</style></head><body><header><strong>Dazzler / Template library</strong><a href="https://jongos.github.io/Dazzler/">Field guide</a></header><main><p>30 WORKED STARTING POINTS · '+VERSION+'</p><h1>Designed for the work they need to do.</h1><p class="intro">A proposal with a scope and payment schedule. A planner with pickups and dinner. A café with an order bag. Explore thirty context-specific templates with fictional examples you can replace with your own content.</p><h3>Documents in Word and HTML</h3><div class="grid">'+docs+'</div><h3>Interfaces</h3><div class="grid">'+uis+'</div></main><footer>Original templates by Jon Gosier · Apache-2.0 · <a href="mailto:jon@filmhedge.com">Feedback</a><p>All examples are fictional. UI interactions are local demonstrations. Fonts retain their own licenses.</p><a class="button" href="https://github.com/jongos/Dazzler/releases/download/v'+VERSION+'/dazzler-templates.zip">Download the library</a></footer></body></html>'
    (OUT/'index.html').write_text(page,encoding='utf-8')

def refresh_hashes(catalog):
    catalog['files']={p.relative_to(OUT).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(OUT.rglob('*')) if p.is_file() and p.name!='catalog.json'}
    (OUT/'catalog.json').write_text(json.dumps(catalog,indent=2)+'\n',encoding='utf-8')

def build():
    for name in ['docx','html','ui']:(OUT/name).mkdir(parents=True,exist_ok=True)
    fonts();catalog={'schemaVersion':2,'version':VERSION,'creator':'Jon Gosier','license':'Apache-2.0','templates':[]}
    for d in DOCS:
        render_docx(d,OUT/'docx'/f"{d['id']}.docx");render_html(d,OUT/'html'/f"{d['id']}.html")
        for format in ['docx','html']:
            catalog['templates'].append(dict(id=format+'-'+d['id'],category=d['id'],format=format,title=d['title'],use=d['use'],path=f"{format}/{d['id']}.{format}",fonts=[d['font']] if format=='docx' else ['Work Sans','Young Serif'],plannedPages=len(d['pages']),orientation='landscape' if d.get('landscape') else 'portrait',content='Fictional worked example. Replace sample details and verify facts before use.'))
    for d in UIS:
        build_ui(d,OUT/'ui'/d['id']);catalog['templates'].append(dict(id=d['id'],category=d['category'],format='ui',title=d['title'],use=d['intro'],path='ui/'+d['id'],layout=d['layout'],files=['index.html','styles.css','template.json'],demo=True))
    shutil.copy2(SKILL/'LICENSE.txt',OUT/'LICENSE.txt')
    (OUT/'NOTICE.txt').write_text('Original Dazzler templates copyright 2026 Jon Gosier. Apache-2.0. Work Sans and Young Serif retain their accompanying licenses. All content is fictional sample material. DOCX fonts are referenced, not embedded.\n',encoding='utf-8')
    gallery();refresh_hashes(catalog);print('Built 10 DOCX, 10 HTML and 10 purpose-specific UI templates.')

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--gallery-only',action='store_true');args=parser.parse_args()
    if args.gallery_only:gallery();refresh_hashes(json.loads((OUT/'catalog.json').read_text(encoding='utf-8')))
    else:build()
