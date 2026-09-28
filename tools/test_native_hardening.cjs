const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{const root=path.resolve(process.argv[2],'native');const browser=await chromium.launch();try{const page=await browser.newPage({viewport:{width:390,height:900}});await page.goto(pathToFileURL(path.join(root,'index.html')).href);await page.waitForSelector('[data-renderer]');const config=JSON.parse(await fs.readFile(path.join(root,'hotspots.json'),'utf8'));
 config.regions[1].shape='circle';config.regions[1].coords=[660,200,90];config.regions[2].shape='poly';config.regions[2].coords=[40,340,860,340,860,475,40,475];
 await page.evaluate(config=>{const node=document.createElement('div');node.id='test-native';document.body.append(node);window.disposeNative=DazzlerHotspots.mount(node,config);},config);
 for(const name of ['workshop','garden']){await page.locator('#test-native [data-native-region='+name+']').click();assert.equal(await page.locator('#test-native').getAttribute('data-selected'),name);}
 await page.evaluate(()=>{const s=document.createElement('script');s.textContent='window.untrustedScriptExecuted=true';document.head.append(s);});assert.equal(await page.evaluate(()=>window.untrustedScriptExecuted),undefined);
 assert(await page.evaluate(async()=>{try{await fetch('https://example.com');return false;}catch{return true;}}));
 await page.evaluate(()=>window.disposeNative());assert.equal(await page.locator('#test-native > *').count(),0);
 const html=await fs.readFile(path.join(root,'index.html'),'utf8');await fs.writeFile(path.join(root,'fallback.html'),html.replace('src="runtime.js"','src="missing-runtime.js"'));
 await page.goto(pathToFileURL(path.join(root,'fallback.html')).href);assert.equal(await page.locator('#illustration h2').count(),3);assert.match(await page.locator('#illustration').textContent(),/all region descriptions are shown/);
 console.log('Native circle/polygon geometry, cleanup, CSP rejection and missing-runtime text fallback passed.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
