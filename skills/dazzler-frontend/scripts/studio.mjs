#!/usr/bin/env node
// Dazzler design systems and data visualization. Apache-2.0.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {parseArgs} from 'node:util';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {generate,css as colorCSS} from './colors.mjs';
import {converter,formatHex,toGamut,getContrastRatio} from './vendor/color-engine.mjs';
const gamut=toGamut('rgb','oklch'), lab=converter('oklab');
export const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cssString=s=>'"'+String(s).replace(/[\x00-\x1f\x7f]/g,'').replace(/\\/g,'\\\\').replace(/"/g,'\\"')+'"';
function positive(n,label){if(!Number.isFinite(n)||n<=0)throw Error(`${label} must be positive`);return n;}
export function tokens(input={}){
  const palette=generate(input.colors??{base:input.brand?.seed??'#7048E8',...(input.brand?.locks?{locked:input.brand.locks}:{})});
  if(palette.status!=='pass')throw Error('Locked color roles are unresolved; inspect the color helper report');
  const base=positive(input.baseSize??16,'baseSize'),ratio=positive(input.typeRatio??1.2,'typeRatio');
  if(base<12||base>24||ratio<1.05||ratio>1.5)throw Error('Use baseSize 12–24 and typeRatio 1.05–1.5');
  const fonts={body:input.fonts?.body??input.brand?.fonts?.body??'system-ui',heading:input.fonts?.heading??input.brand?.fonts?.heading??input.fonts?.body??input.brand?.fonts?.body??'system-ui'};
  for(const font of Object.values(fonts))if(typeof font!=='string'||font.length>160)throw Error('Invalid font family');
  const scale=Object.fromEntries(Array.from({length:8},(_,i)=>['step'+(i-1),+(base*ratio**(i-1)/16).toFixed(4)]));
  const system={schemaVersion:1,fonts,type:scale,spacing:Object.fromEntries([0,1,2,3,4,6,8,12,16,24].map(n=>[n,n*.25])),
    radius:{none:0,small:.25,medium:.5,large:1,pill:999},elevation:{none:'none',raised:'0 2px 8px rgb(0 0 0 / 0.12)',overlay:'0 12px 40px rgb(0 0 0 / 0.2)'},
    motion:{fast:120,normal:200,slow:320,easing:'cubic-bezier(0.2, 0, 0, 1)'},palette,
    provenance:input.brand?.source??null,notes:['Font families are references, not proof of installed files or licensing.','Spacing/radius defaults may be overridden by project constraints.']};
  for(const group of ['spacing','radius'])if(input[group]){for(const [key,value] of Object.entries(input[group])){if(!/^[a-z0-9-]+$/i.test(key)||!Number.isFinite(value)||value<0)throw Error(`Invalid ${group} override`);system[group][key]=value;}}
  if(input.motion)for(const key of ['fast','normal','slow'])if(input.motion[key]!==undefined){if(!Number.isFinite(input.motion[key])||input.motion[key]<0||input.motion[key]>5000)throw Error('Invalid duration');system.motion[key]=input.motion[key];}
  let css=colorCSS(palette)+'\n:root {\n';
  for(const [key,value] of Object.entries(fonts))css+=`  --font-${key}: ${cssString(value)}, sans-serif;\n`;
  for(const [group,values] of Object.entries({type:scale,space:system.spacing,radius:system.radius}))for(const [key,value] of Object.entries(values))css+=`  --${group}-${key}: ${value}rem;\n`;
  for(const [key,value] of Object.entries(system.elevation))css+=`  --shadow-${key}: ${value};\n`;
  for(const key of ['fast','normal','slow'])css+=`  --duration-${key}: ${system.motion[key]}ms;\n`;
  css+=`  --ease-default: ${system.motion.easing};\n}\n@media (prefers-reduced-motion: reduce) { :root { --duration-fast: 0ms; --duration-normal: 0ms; --duration-slow: 0ms; } }\n`;
  const dtcg={};
  for(const [name,values] of Object.entries({type:scale,space:system.spacing,radius:system.radius}))dtcg[name]=Object.fromEntries(Object.entries(values).map(([k,v])=>[k,{$type:'dimension',$value:{value:v,unit:'rem'}}]));
  dtcg.font=Object.fromEntries(Object.entries(fonts).map(([k,v])=>[k,{$type:'fontFamily',$value:v}]));
  dtcg.color=Object.fromEntries(Object.entries(palette.modes).map(([mode,v])=>[mode,Object.fromEntries(Object.entries(v.tokens).map(([k,hex])=>[k,{$type:'color',$value:{colorSpace:'srgb',components:[1,3,5].map(n=>parseInt(hex.slice(n,n+2),16)/255),alpha:1}}]))]));
  dtcg.duration=Object.fromEntries(['fast','normal','slow'].map(k=>[k,{$type:'duration',$value:{value:system.motion[k],unit:'ms'}}]));
  // Adapter uses variable references rather than duplicated values. Import tokens.css first.
  const tailwind={theme:{extend:{colors:Object.fromEntries(Object.keys(palette.modes.light.tokens).map(k=>[k,`var(--color-${k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())})`])),
    fontFamily:Object.fromEntries(Object.keys(fonts).map(k=>[k,[`var(--font-${k})`]])),spacing:Object.fromEntries(Object.keys(system.spacing).map(k=>[k,`var(--space-${k})`]))}}};
  const theme='@theme inline {\n'+Object.keys(palette.modes.light.tokens).map(k=>{const name=k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase());return `  --color-dazzler-${name}: var(--color-${name});`}).join('\n')+'\n  --font-sans: var(--font-body);\n  --font-display: var(--font-heading);\n}\n';
  return {system,css,dtcg,tailwind,theme};
}
const shapes=['circle','square','triangle','diamond','cross','star','hexagon','plus'];
export function chart(input={}){
  const kind=input.kind??'categorical',count=input.count??6,bg=input.background??'#FFFFFF';
  if(!['categorical','sequential','diverging'].includes(kind)||!Number.isInteger(count)||count<2||count>8)throw Error('Choose categorical/sequential/diverging and 2–8 entries');
  if(!/^#[\da-f]{6}$/i.test(bg))throw Error('Background must be opaque hex');
  if(input.hue!==undefined&&!Number.isFinite(input.hue))throw Error('Hue must be finite');
  if(input.ids&&(!Array.isArray(input.ids)||input.ids.length!==count||input.ids.some(x=>typeof x!=='string')))throw Error('Provide one string ID per series');
  const labels=input.labels??Array.from({length:count},(_,i)=>`Series ${i+1}`);
  if(labels.length!==count||labels.some(s=>typeof s!=='string'))throw Error('Provide one label per entry');
  const dark=getContrastRatio('#FFFFFF',bg)>getContrastRatio('#000000',bg);
  const entries=labels.map((label,i)=>{
    const h=kind==='categorical'?(input.hue??265)+i*137.508:kind==='sequential'?(input.hue??265):(i<(count-1)/2?250:30);
    const l=kind==='categorical'?(dark?.76:.43):kind==='sequential'?(dark?.48:.28)+(i/(count-1))*.27:(dark?.48:.28)+(.25*(1-Math.abs(2*i/(count-1)-1)));
    let color=formatHex(gamut({mode:'oklch',l,c:kind==='diverging'&&i===(count-1)/2?.015:.13,h}));
    // Non-text graphics threshold against the requested surface, not text conformance.
    for(let n=0;n<20&&getContrastRatio(color,bg)<3;n++)color=formatHex(gamut({mode:'oklch',l:Math.max(.08,Math.min(.92,l+(dark?1:-1)*.02*(n+1))),c:.13,h}));
    return {id:input.ids?.[i]??`series-${i+1}`,label,color,shape:shapes[i],dash:['none','6 3','2 3','8 3 2 3'][i%4],pattern:`pattern-${i+1}`,contrast:getContrastRatio(color,bg)};
  });
  if(new Set(entries.map(e=>e.id)).size!==count)throw Error('Series IDs must be unique');
  const distances=[];for(let i=0;i<count;i++)for(let j=i+1;j<count;j++){const a=lab(entries[i].color),b=lab(entries[j].color);distances.push({a:entries[i].id,b:entries[j].id,distance:Math.hypot(a.l-b.l,a.a-b.a,a.b-b.b)});}
  return {schemaVersion:1,kind,background:bg,entries,distances,status:entries.every(e=>e.contrast>=3)?'pass':'unresolved',
    notes:['Pass refers only to 3:1 graphic/surface contrast. Pairwise OKLab distances are diagnostics, not color-vision certification.','Keep series IDs, labels, shapes and dash styles stable across themes. Recompute colors per background.','Provide a table or equivalent text, and label categories directly. Do not use these graphic colors for small text without measuring it.']};
}
export function chartPreview(report){
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Dazzler chart palette</title><style>body{font:18px system-ui;max-width:900px;margin:40px auto;padding:20px}td,th{padding:12px;text-align:left}svg{background:${report.background};max-width:100%}</style><h1>${escapeHTML(report.kind)} chart palette</h1><p>Labels, patterns and a data table accompany color. Bars below are illustrative samples.</p><svg viewBox="0 0 800 ${report.entries.length*55}" role="img" aria-label="Illustrative palette bars">${report.entries.map((e,i)=>`<defs><pattern id="${e.pattern}" width="${5+i*2}" height="${5+i*2}" patternUnits="userSpaceOnUse"><rect width="100%" height="100%" fill="${e.color}"/><path d="M0 0L${5+i*2} ${5+i*2}" stroke="${report.background}" stroke-width="2"/></pattern></defs><rect x="10" y="${i*55+5}" width="${180+i*60}" height="38" fill="url(#${e.pattern})"/>`).join('')}</svg><table><caption>Palette key — use your real chart values in production</caption><thead><tr><th>Series</th><th>Color</th><th>Marker</th><th>Graphic contrast</th></tr></thead><tbody>${report.entries.map(e=>`<tr><th scope="row">${escapeHTML(e.label)}</th><td>${e.color}</td><td>${e.shape}</td><td>${e.contrast.toFixed(2)}:1</td></tr>`).join('')}</tbody></table><p>${escapeHTML(report.notes.join(' '))}</p></html>`;
}
async function main(){const {positionals,values}=parseArgs({allowPositionals:true,options:{config:{type:'string'},out:{type:'string'}}});if(!values.config||!values.out)throw Error('Usage: studio.mjs tokens|chart --config input.json --out NEW_DIR');const input=JSON.parse(await readFile(values.config,'utf8'));const command=positionals[0];if(!['tokens','chart'].includes(command))throw Error('Unknown command');const result=command==='tokens'?tokens(input):chart(input);await mkdir(values.out,{recursive:false});const write=(name,data)=>writeFile(path.join(values.out,name),typeof data==='string'?data:JSON.stringify(data,null,2)+'\n');if(command==='tokens'){await write('design-system.json',result.system);await write('tokens.css',result.css);await write('tokens.dtcg.json',result.dtcg);await write('tailwind.config.cjs','module.exports = '+JSON.stringify(result.tailwind,null,2)+';\n');await write('tailwind-theme.css',result.theme);}else{await write('chart.json',result);await write('preview.html',chartPreview(result));}console.log(JSON.stringify({command,out:values.out,status:result.status??'pass'}));}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)main().catch(e=>{console.error(e.message);process.exitCode=1});
