"""Assemble actual renders and previews; does not certify visual review."""
from gallery_032 import R,L,S,B,save
from PIL import Image,ImageDraw
import json,shutil,hashlib
from lxml import html

def digest(p):
 data=p.read_bytes()
 return hashlib.sha256(data).hexdigest()

def jpg(source,target,width=1100):
 im=Image.open(source).convert('RGB');im.thumbnail((width,20000));im.save(target,quality=90,optimize=True)

def main():
 checks=json.loads((S/'browser-checks.json').read_text())
 assert len(checks)==20 and all(not x['errors'] and all(not v['axe'] and not v['overflow'] for v in x['views']) for x in checks)
 briefs={b['id']:b for typ in ['document','interface'] for b in json.loads((S/f'{typ}-briefs.json').read_text())}
 catalog=json.loads((B/'catalog.json').read_text());catalog['version']='0.32.0'
 captures={'word':[],'browser':[]}
 for t in catalog['templates']:
  ident,fmt=t['id'],t['format'];key=ident if fmt=='ui' else t['category'];b=briefs[key]
  t['design']=b['direction'];t['fonts']=[b.get('word',b['font']) if fmt=='docx' else b['font'],'Arial' if fmt=='docx' else 'Work Sans']
  if fmt=='ui':t['title']=b['direction'];t['use']=b['rationale']
  else:t['orientation']=b['orientation'];t['dataPresentation']='table'
  src=L/t['path'];src=src/'index.html' if src.is_dir() else src
  if fmt=='docx':
   pages=sorted((S/'word'/key).glob('page-*.png'));assert len(pages)==1,(ident,len(pages))
   t['plannedPages']=1;jpg(pages[0],L/'previews'/f'{ident}.jpg');jpg(pages[0],L/'previews'/f'{ident}-p1.jpg')
   shutil.copy2(S/'word'/key/f'{key}.pdf',L/'docx'/f'{key}.pdf')
   row={'id':ident,'engine':'LibreOffice','pages':len(pages)};kind='word';deps=[src]
  else:
   for w,suffix in [(1440,''),(390,'-mobile')]:jpg(S/'renders'/f'{ident}-{w}.png',L/'previews'/f'{ident}{suffix}.jpg',1100 if w==1440 else 390)
   row={'id':ident,'engine':'Chrome / Playwright','fullPage':True,'viewport':{'width':1440,'height':1000}};kind='browser'
   deps=[src]+list((L/'fonts').rglob('*'))+(list((L/'html'/key).rglob('*')) if fmt=='html' else list(src.parent.rglob('*')))
  row.update(sourceSha256=digest(src),preview=f'previews/{ident}.jpg',dependencies={p.relative_to(L).as_posix():digest(p) for p in deps if p.is_file()})
  captures[kind].append(row)
 # Preserve gallery filtering and existing links, replacing only each card's copy.
 tree=html.parse(str(L/'index.html'))
 for t in catalog['templates']:
  images=tree.xpath('//img[contains(@src,"'+t['id']+'.jpg")]')
  for image in images:
   card=image
   while card.tag!='article':card=card.getparent()
   card.xpath('.//h2')[0].text=t['title'];image.set('alt',t['title']+' — complete composition')
   paragraphs=card.xpath('./p')
   if paragraphs:paragraphs[-1].text=t['use']
 (L/'index.html').write_text('<!doctype html>'+html.tostring(tree,encoding='unicode'),encoding='utf-8')
 for kind,rows in captures.items():save(L/'previews'/f'{kind}-captures.json',rows)
 catalog['files']={p.relative_to(L).as_posix():digest(p) for p in sorted(L.rglob('*')) if p.is_file() and p.name!='catalog.json'}
 save(L/'catalog.json',catalog)
 # Rendered review sheets are intermediates; the shipped JPEGs are the evidence.
 groups={'word':sorted((S/'word').glob('*/page-*.png')),'desktop':sorted((S/'renders').glob('*-1440.png')),'mobile':sorted((S/'renders').glob('*-390.png'))}
 for kind,paths in groups.items():
  for offset in range(0,len(paths),4):
   canvas=Image.new('RGB',(1600,2200),'#ddd');draw=ImageDraw.Draw(canvas)
   for i,p in enumerate(paths[offset:offset+4]):
    im=Image.open(p).convert('RGB');im.thumbnail((780,1040));x=i%2*800;y=i//2*1100
    canvas.paste(im,(x+10,y+40));draw.text((x+10,y+10),p.parent.name+'/'+p.stem,fill='black')
   canvas.save(S/f'contact-{kind}-{offset//4}.jpg',quality=92)
 print('Assembled 30 current thumbnails and 20 mobile previews.')

if __name__=='__main__':main()
