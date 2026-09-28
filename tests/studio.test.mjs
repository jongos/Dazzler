import test from 'node:test';
import assert from 'node:assert/strict';
import {tokens,chart,chartPreview} from '../skills/dazzler-frontend/scripts/studio.mjs';

test('system preserves locked seed and integrates font/spacing/motion overrides',()=>{
 const r=tokens({brand:{seed:'#345678',fonts:{body:'Work Sans'},locks:{light:{brand:'#345678'}}},spacing:{4:1.25},motion:{fast:0}});
 assert.equal(r.system.palette.modes.light.tokens.brand,'#345678');assert.equal(r.system.fonts.body,'Work Sans');
 assert.match(r.css,/--space-4: 1.25rem/);assert.match(r.css,/--duration-fast: 0ms/);assert.match(r.css,/prefers-reduced-motion/);
 assert.equal(r.dtcg.space[4].$value.value,1.25);assert.equal(r.dtcg.color.light.brand.$value.colorSpace,'srgb');assert.match(r.theme,/@theme inline/);
});
test('invalid and conflicting constraints fail rather than export unsafe tokens',()=>{
 assert.throws(()=>tokens({colors:{base:'#345678',locked:{light:{background:'#FFFFFF',text:'#FFFFFF'}}}}));
 assert.throws(()=>tokens({spacing:{'bad; color:red':2}}));assert.throws(()=>tokens({typeRatio:5}));assert.throws(()=>tokens({motion:{fast:-10}}));
});
test('font names are escaped as CSS strings',()=>{assert.match(tokens({fonts:{body:'x"; color:red; "'}}).css,/x\\"; color:red; \\"/)});
test('all chart modes support light and dark surfaces with stable IDs and non-color cues',()=>{
 for(const kind of ['categorical','sequential','diverging'])for(const background of ['#FFFFFF','#16181B']){
  const r=chart({kind,background,count:5,ids:['a','b','c','d','e']});assert.equal(r.status,'pass');assert.equal(r.entries.length,5);assert.equal(new Set(r.entries.map(e=>e.shape)).size,5);assert.deepEqual(r.entries.map(e=>e.id),['a','b','c','d','e']);assert(r.entries.every(e=>e.contrast>=3));assert.equal(r.distances.length,10);
 }
});
test('chart preview escapes labels and rejects invalid configurations',()=>{
 const r=chart({count:2,labels:['<script>alert(1)</script>','B']});assert(!chartPreview(r).includes('<script>'));assert.match(chartPreview(r),/<table>/);
 assert.throws(()=>chart({count:9}));assert.throws(()=>chart({hue:NaN}));assert.throws(()=>chart({count:2,ids:['a','a']}));
});
