import {build} from 'esbuild';
import {readFile,writeFile,mkdir,readdir,copyFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd(),dest=path.join(root,'skills/dazzler-frontend/scripts/vendor/viz');
await mkdir(path.join(dest,'licenses'),{recursive:true});
const packages=new Map(),files={};
for(const [entry,name] of [['viz','vega'],['d3','d3'],['microcharts','microcharts']]){
 const result=await build({entryPoints:[`tools/${entry}-entry.mjs`],outfile:path.join(dest,name+'.mjs'),bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,legalComments:'inline',metafile:true,define:{'process.env.NODE_ENV':'"production"'}});
 for(const input of Object.keys(result.metafile.inputs)){
  if(!input.includes('node_modules/'))continue;
  let dir=path.dirname(path.resolve(input));
  while(dir!==root){try{const pkg=JSON.parse(await readFile(path.join(dir,'package.json'),'utf8'));if(pkg.name){packages.set(dir,pkg);break;}}catch{}dir=path.dirname(dir);}
 }
}
await build({entryPoints:['tools/viz-entry.mjs'],outfile:path.join(dest,'vega-browser.js'),bundle:true,format:'iife',globalName:'DazzlerVega',platform:'browser',target:'es2022',minify:true,legalComments:'inline'});
await copyFile('node_modules/@microcharts/react/dist/styles.css',path.join(dest,'microcharts.css')).catch(async()=>{await copyFile('node_modules/@microcharts/react/dist/styles/index.css',path.join(dest,'microcharts.css'));});
const notices=[];
for(const [dir,pkg] of packages){
 const names=(await readdir(dir)).filter(n=>/^(license|copying|notice)(\.|$)/i.test(n));
 if(!names.length)throw Error('Missing license: '+pkg.name);
 for(const name of names)await copyFile(path.join(dir,name),path.join(dest,'licenses',pkg.name.replaceAll('/','__')+'-'+name));
 notices.push({name:pkg.name,version:pkg.version,license:pkg.license,repository:pkg.repository});
}
async function inventory(folder){for(const e of await readdir(folder,{withFileTypes:true})){const p=path.join(folder,e.name);if(e.isDirectory())await inventory(p);else if(e.name!=='provenance.json')files[path.relative(dest,p).replaceAll('\\','/')]=createHash('sha256').update(await readFile(p)).digest('hex');}}
await inventory(dest);await writeFile(path.join(dest,'provenance.json'),JSON.stringify({build:'tools/build_visualization.mjs; exact package-lock.json integrity',packages:notices.sort((a,b)=>a.name.localeCompare(b.name)),files},null,2)+'\n');
console.log(`Built visualization bundles with ${notices.length} package notices.`);
