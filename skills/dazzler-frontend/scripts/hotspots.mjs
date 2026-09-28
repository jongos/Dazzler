#!/usr/bin/env node
// Original Dazzler interactive-illustration exporter, Apache-2.0.
import {readFile,writeFile,mkdir,copyFile,cp,realpath} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {parseArgs} from 'node:util';
import {randomUUID} from 'node:crypto';
import {DOMParser,XMLSerializer} from './vendor/hotspots/xml.mjs';
import {escapeHTML as esc} from './studio.mjs';
const HERE=path.dirname(fileURLToPath(import.meta.url));
const NS='http://www.w3.org/2000/svg';
const ID=/^[A-Za-z_][A-Za-z0-9_.-]{0,99}$/;
const text=(s,max)=>typeof s==='string'&&s.length>0&&s.length<=max;
const safeJSON=v=>JSON.stringify(v).replaceAll('<','\\u003c');
const finite=n=>typeof n==='number'&&Number.isFinite(n);
export function normalize(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Expected an illustration configuration');
 const kind=input.kind??'svg',framework=input.framework??'react';
 if(!['svg','image'].includes(kind)||!['react','vue'].includes(framework))throw Error('Use kind svg/image and framework react/vue');
 if(!text(input.title,200)||!text(input.imageAlt,500))throw Error('Provide a title and meaningful imageAlt');
 if(!Array.isArray(input.regions)||input.regions.length<1||input.regions.length>60)throw Error('Provide 1–60 regions');
 const color=input.color??'#7048E8';if(!/^#[0-9a-f]{6}$/i.test(color))throw Error('Use an opaque six-digit color');
 const width=input.width,height=input.height;
 if(kind==='image'&&(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>10000||height>10000))throw Error('Provide actual image width/height in pixels, at most 10000');
 const ids=new Set();
 const regions=input.regions.map(r=>{
  if(!r||typeof r.id!=='string'||!ID.test(r.id)||ids.has(r.id)||!text(r.label,150)||!text(r.description,3000))throw Error('Regions need unique IDs, labels and descriptions');ids.add(r.id);
  const result={id:r.id,label:r.label,description:r.description};
  if(kind==='image'){
   const {shape,coords}=r;if(!['rect','circle','poly'].includes(shape)||!Array.isArray(coords)||coords.some(v=>!finite(v)||v<0))throw Error('Invalid region shape or coordinates');
   if(shape==='rect'&&(coords.length!==4||coords[0]>=coords[2]||coords[1]>=coords[3]||coords[2]>width||coords[3]>height))throw Error('Rectangle must lie within the image');
   if(shape==='circle'&&(coords.length!==3||coords[2]<=0||coords[0]-coords[2]<0||coords[1]-coords[2]<0||coords[0]+coords[2]>width||coords[1]+coords[2]>height))throw Error('Circle must lie within the image');
   if(shape==='poly'&&(coords.length<6||coords.length>200||coords.length%2||coords.some((v,i)=>v>(i%2?height:width))))throw Error('Polygon must contain 3–100 points inside the image');
   if(shape==='poly'){let area=0;for(let i=0;i<coords.length;i+=2){const j=(i+2)%coords.length;area+=coords[i]*coords[j+1]-coords[j]*coords[i+1];}if(Math.abs(area)<0.01)throw Error('Polygon must have a nonzero area');}
   Object.assign(result,{shape,coords:[...coords]});
  }
  return result;
 });
 return {kind,framework,title:input.title,imageAlt:input.imageAlt,description:text(input.description,1000)?input.description:'Explore the labeled regions.',source:text(input.source,500)?input.source:'',font:text(input.font,150)?input.font:'Arial, sans-serif',color,width,height,regions};
}

export function validateSVG(source,regions){
 if(typeof source!=='string'||source.length>2_000_000||/<!DOCTYPE|<!ENTITY|<\?/i.test(source.replace(/^\s*<\?xml[^?]*\?>/,'')))throw Error('Use a static SVG without declarations, entities or processing instructions');
 const doc=new DOMParser({onError:(_level,message)=>{throw Error(message);}}).parseFromString(source,'image/svg+xml');
 const root=doc.documentElement;if(root.localName!=='svg'||root.namespaceURI!==NS)throw Error('Artwork must be an SVG document');
 const vb=root.getAttribute('viewBox')?.trim().split(/[ ,]+/).map(Number);
 if(!vb||vb.length!==4||vb.some(n=>!Number.isFinite(n))||vb[2]<=0||vb[3]<=0||Math.max(...vb.map(Math.abs))>100000)throw Error('SVG needs a finite positive viewBox');
 const tags=new Set('svg g path rect circle ellipse line polyline polygon text tspan title desc defs linearGradient radialGradient stop clipPath'.split(' '));
 const attrs=new Set('id xmlns viewBox width height x y x1 x2 y1 y2 cx cy r rx ry d points transform fill stroke stroke-width stroke-linecap stroke-linejoin stroke-miterlimit stroke-dasharray stroke-dashoffset opacity fill-opacity stroke-opacity fill-rule clip-rule clip-path font-family font-size font-weight font-style text-anchor dominant-baseline dx dy rotate letter-spacing word-spacing gradientUnits gradientTransform spreadMethod offset stop-color stop-opacity fx fy fr preserveAspectRatio vector-effect'.split(' '));
 const ids=new Map();const refs=[];let count=0;
 function visit(node,depth=0){
  if(depth>40||++count>5000)throw Error('SVG exceeds complexity limit');
  if(node.nodeType===1){
   if(node.namespaceURI!==NS||!tags.has(node.localName))throw Error('Unsupported SVG element: '+node.nodeName);
   for(const a of Array.from(node.attributes)){
    if(!attrs.has(a.name)||a.value.length>100000)throw Error('Unsupported SVG attribute: '+a.name);
    if(a.name==='xmlns'&&a.value!==NS)throw Error('Unexpected namespace');
    if(a.name==='id'){if(!ID.test(a.value)||ids.has(a.value))throw Error('Invalid or duplicate SVG ID');ids.set(a.value,node);}
    if(/url\s*\(/i.test(a.value)){
     const match=/^url\(#([A-Za-z_][A-Za-z0-9_.-]{0,99})\)$/.exec(a.value);
     if(!match||!['fill','stroke','clip-path'].includes(a.name))throw Error('Only local SVG paint/clip references are allowed');refs.push(match[1]);
    }
    if(/(?:https?:|data:|javascript:|expression\s*\(|[<>])/i.test(a.value)&&a.name!=='xmlns')throw Error('External or active SVG content is not supported');
   }
  }else if(![3,4,8].includes(node.nodeType))throw Error('Unsupported SVG node');
  for(const child of Array.from(node.childNodes))visit(child,depth+1);
 }
 visit(root);for(const id of refs)if(!ids.has(id))throw Error('Missing SVG reference '+id);
 for(const r of regions){const node=ids.get(r.id);if(!node||!['g','path','rect','circle','ellipse','polygon','polyline'].includes(node.localName))throw Error('Region must name a visible SVG shape/group: '+r.id);let parent=node.parentNode;while(parent&&parent!==root){if(['defs','clipPath'].includes(parent.localName))throw Error('Region is not visible: '+r.id);parent=parent.parentNode;}}
 // Canonical serialized XML is embedded only after the complete validation succeeds.
 root.setAttribute('width',String(vb[2]));root.setAttribute('height',String(vb[3]));
 return {artwork:new XMLSerializer().serializeToString(root),width:vb[2],height:vb[3]};
}

export function imageDimensions(bytes){
 if(bytes.length>=24&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return {mime:'image/png',width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};
 if(bytes[0]===255&&bytes[1]===216){let pos=2;while(pos+8<bytes.length){if(bytes[pos]!==255)break;const marker=bytes[pos+1];if(marker===0xD9||marker===0xDA)break;const length=bytes.readUInt16BE(pos+2);if(length<2||pos+2+length>bytes.length)break;if([0xC0,0xC1,0xC2,0xC3,0xC5,0xC6,0xC7,0xC9,0xCA,0xCB,0xCD,0xCE,0xCF].includes(marker))return {mime:'image/jpeg',height:bytes.readUInt16BE(pos+5),width:bytes.readUInt16BE(pos+7)};pos+=2+length;}}
 throw Error('Use a valid PNG, JPEG or static SVG image');
}

export async function render(input,artFile,out){
 const config=normalize(input);const bytes=await readFile(artFile);if(bytes.length>8_000_000)throw Error('Artwork must be at most 8 MB');
 let artwork,extension;
 if(config.kind==='svg'||path.extname(artFile).toLowerCase()==='.svg'){
  const parsed=validateSVG(bytes.toString('utf8'),config.kind==='svg'?config.regions:[]);extension='svg';artwork=Buffer.from(parsed.artwork);
  if(config.kind==='svg')Object.assign(config,parsed);
  else{if(parsed.width!==config.width||parsed.height!==config.height)throw Error('Configured dimensions must match the SVG viewBox');config.artwork='data:image/svg+xml;base64,'+artwork.toString('base64');}
 }else{
  const dimensions=imageDimensions(bytes);if(dimensions.width!==config.width||dimensions.height!==config.height)throw Error('Configured dimensions must match the actual image');
  extension=dimensions.mime==='image/png'?'png':'jpg';artwork=bytes;config.artwork='data:'+dimensions.mime+';base64,'+bytes.toString('base64');
 }
 const engine=config.kind==='svg'?'svg':config.framework;
 config.mapName='dazzler-'+randomUUID();
 config.credit=engine==='svg'?'Interactive SVG: SVG.js, MIT.':'Image regions: '+(engine==='react'?'React Img Mapper and React':'Vue Img Mapper and Vue')+', MIT.';
 const skillRoot=await realpath(path.join(HERE,'..'));const parent=await realpath(path.dirname(path.resolve(out)));const dest=path.join(parent,path.basename(out));
 if(dest===skillRoot||dest.startsWith(skillRoot+path.sep))throw Error('Export into the project, outside the installed skill');
 await mkdir(dest,{recursive:false});
 const write=(name,data)=>writeFile(path.join(dest,name),data);
 await write('illustration.'+extension,artwork);await write('hotspots.json',JSON.stringify(config,null,2)+'\n');
 await write('regions.csv',[['ID','Label','Description'],...config.regions.map(r=>[r.id,r.label,r.description])].map(row=>row.map(s=>'"'+s.replaceAll('"','""')+'"').join(',')).join('\n')+'\n');
 await copyFile(path.join(HERE,'hotspots.css'),path.join(dest,'hotspots.css'));
 await copyFile(path.join(HERE,'hotspot-'+engine+'.mjs'),path.join(dest,'adapter.mjs'));
 await copyFile(path.join(HERE,'hotspot-ui.mjs'),path.join(dest,'hotspot-ui.mjs'));
 const vendor=path.join(HERE,'vendor/hotspots');await copyFile(path.join(vendor,engine+'.js'),path.join(dest,'runtime.js'));await cp(path.join(vendor,'licenses'),path.join(dest,'licenses'),{recursive:true});await copyFile(path.join(vendor,'provenance.json'),path.join(dest,'renderer-provenance.json'));await copyFile(path.join(HERE,'../LICENSE.txt'),path.join(dest,'LICENSE.txt'));
 const dependencies=engine==='svg'?{'@svgdotjs/svg.js':'3.2.8'}:engine==='react'?{'react-img-mapper':'2.0.2'}:{'vue-img-mapper':'0.1.0'};
 await write('dependencies.json',JSON.stringify({dependencies,hostRuntime:engine==='react'?'Use the existing compatible React/React DOM runtime':engine==='vue'?'Use the existing compatible Vue 3 runtime':'No framework needed',notes:'Merge only the required dependency into the existing project. Do not replace its manifest.'},null,2)+'\n');
 await write('INTEGRATE.md',`# Interactive illustration\n\nImport the accompanying CSS, load hotspots.json as a module or data object, then call the adapter with an empty DOM container. Use the returned cleanup function when the host component unmounts. In React/Vue, mount only after the container exists. The adapter manages its own subtree.\n\n\`\`\`js\nimport {mount} from './adapter.mjs';\nconst dispose = mount(container, config);\n// On host unmount: dispose();\n\`\`\`\n\nKeep hotspot coordinates in original image pixels. Keep SVG region IDs matched to the descriptions. Re-export after changing artwork. This adapter accepts only validated exported configuration; rerun the CLI for new SVG input. Use the existing host runtime and merge dependencies.json rather than replacing package.json. Review keyboard, touch, labels and resizing in the final page. Fonts are referenced, not installed or embedded.\n\n## Notes and credits\n\n${config.credit} Original Dazzler adapter: Apache-2.0. Preserve LICENSE.txt, licenses/ and renderer-provenance.json when sharing.\n`);
 const fallback=config.regions.map(r=>'<h2>'+esc(r.label)+'</h2><p>'+esc(r.description)+'</p>').join('');
 await write('index.html',`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(config.title)}</title><link rel="stylesheet" href="hotspots.css"><style>body{margin:0;background:#f4f5f8}</style><main id="illustration"></main><noscript><h1>${esc(config.title)}</h1>${fallback}</noscript><script src="runtime.js"></script><script>try{DazzlerHotspots.mount(document.querySelector('#illustration'),${safeJSON(config)});}catch(error){document.querySelector('#illustration').textContent='Interactive preview failed: '+error.message;}</script></html>`);
 const report={status:'exported',renderer:engine==='svg'?'svgjs':engine+'-img-mapper',regionCount:config.regions.length,validation:'Input and SVG allowlist checked; browser interaction and visual review still required.',files:['index.html','illustration.'+extension,'regions.csv','hotspots.json','adapter.mjs','hotspot-ui.mjs','hotspots.css','dependencies.json','INTEGRATE.md']};await write('report.json',JSON.stringify(report,null,2)+'\n');return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){const {values}=parseArgs({options:{config:{type:'string'},art:{type:'string'},out:{type:'string'}}});if(!values.config||!values.art||!values.out)throw Error('Use --config input.json --art illustration.svg|png|jpg --out NEW_DIRECTORY');render(JSON.parse(await readFile(values.config,'utf8')),path.resolve(values.art),path.resolve(values.out)).then(r=>console.log(JSON.stringify(r))).catch(e=>{console.error(e.message);process.exitCode=1;});}
