// Dazzler shared local runtime. Apache-2.0; no third-party imports or network access.
import {open,realpath,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function readLimited(file,limit=8_000_000){
 const handle=await open(file,'r');try{const stat=await handle.stat();if(!stat.isFile()||stat.size>limit)throw Error('Input must be a regular file of at most '+limit+' bytes');const buffer=Buffer.alloc(Math.min(stat.size+1,limit+1));let total=0;while(total<buffer.length){const {bytesRead}=await handle.read(buffer,total,buffer.length-total,total);if(!bytesRead)break;total+=bytesRead;}if(total>limit||total>stat.size)throw Error('Input exceeds size limit or changed during read');return buffer.subarray(0,total);}finally{await handle.close();}
}
export async function readJSON(file){const input=JSON.parse((await readLimited(file)).toString('utf8'));const pending=[[input,0]];let count=0;while(pending.length){const [value,depth]=pending.pop();if(++count>150000||depth>64)throw Error('JSON structure exceeds limits');if(value&&typeof value==='object')for(const [key,child] of Object.entries(value)){if(['__proto__','prototype','constructor'].includes(key))throw Error('Reserved JSON key: '+key);pending.push([child,depth+1]);}}return input;}
export async function createOutput(destination){
 const skill=await realpath(fileURLToPath(new URL('../',import.meta.url)));
 const parent=await realpath(path.dirname(path.resolve(destination))),resolved=path.join(parent,path.basename(destination));
 const relative=path.relative(skill,resolved);if(!relative||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative)))throw Error('Export outside the installed skill');
 await mkdir(resolved,{recursive:false});return resolved;
}
