import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm,mkdir} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {readJSON,readLimited,createOutput} from '../skills/dazzler-frontend/scripts/runtime.mjs';
import {route} from '../skills/dazzler-frontend/scripts/route.mjs';
test('bounded reads reject oversized and reserved/deep JSON input',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'dazzler-input-'));try{const file=path.join(root,'input');await writeFile(file,'123456');await assert.rejects(readLimited(file,5));await writeFile(file,'{"__proto__":{}}');await assert.rejects(readJSON(file));await writeFile(file,'['.repeat(70)+'0'+']'.repeat(70));await assert.rejects(readJSON(file));await writeFile(file,'{"name":"ok"}');assert.deepEqual(await readJSON(file),{name:'ok'});}finally{await rm(root,{recursive:true,force:true});}
});
test('exports refuse skill writes and existing directories',async()=>{
 await assert.rejects(createOutput(new URL('../skills/dazzler-frontend/forbidden-test-output',import.meta.url).pathname.replace(/^\/([A-Z]:)/i,'$1')));
 const root=await mkdtemp(path.join(os.tmpdir(),'dazzler-output-'));try{const out=path.join(root,'out');await createOutput(out);await assert.rejects(createOutput(out));}finally{await rm(root,{recursive:true,force:true});}
});
test('routing preserves frameworks and does not narrow incomplete chart semantics',()=>{
 assert.equal(route({kind:'illustration',artwork:'png'}).options.framework,'native');assert.equal(route({kind:'illustration',artwork:'png',framework:'vue'}).options.framework,'vue');assert.equal(route({kind:'illustration',artwork:'svg'}).options.kind,'svg');
 assert.equal(route({kind:'chart',framework:'react',compact:true,type:'line',seriesCount:1,hasMissingValues:false}).options.format,'react');assert.equal(route({kind:'chart',framework:'react',compact:true,type:'line',seriesCount:1,hasMissingValues:true}).options.format,'html');assert.equal(route({kind:'chart',format:'docx'}).options.format,'docx');assert.throws(()=>route({framework:'invented'}));
});
