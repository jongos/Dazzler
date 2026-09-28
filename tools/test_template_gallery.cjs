// Validate the local published collection, or a supplied live base URL, with existing Playwright.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{
 const base=process.argv[2]||pathToFileURL(path.resolve('docs')+path.sep).href;
 const output=path.resolve(process.argv[3]||'dist/gallery-review');await fs.mkdir(output,{recursive:true});
 const browser=await chromium.launch();const page=await browser.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));
 const ready=async()=>{await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});assert.deepEqual(await page.evaluate(()=>[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)),[])};
 try {
  for(const [file,selector,label] of [['templates/index.html','.grid article','gallery'],['index.html','.showcase-grid article','guide']]){
   await page.goto(new URL(file,base).href);await ready();assert.equal(await page.locator(selector).count(),30);
   for(const width of [1440,390]){await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' overflow');await page.screenshot({path:path.join(output,label+'-'+width+'.png'),fullPage:true});}
   if(label==='gallery')for(const format of ['docx','html','ui','all']){await page.locator('[data-filter='+format+']').click();assert.equal(await page.locator('article[data-format]:visible').count(),format==='all'?30:10)}
  }
  await page.goto(new URL('templates/index.html',base).href);
  const links=await page.locator('.picture').evaluateAll(nodes=>nodes.map(a=>a.href));assert.equal(new Set(links).size,30);
  for(const url of links){const response=await page.goto(url);if(response)assert(response.ok(),url);await ready();if(url.includes('preview-'))assert(await page.locator('main img').count()>=1)}
  assert.deepEqual(errors,[]);
  console.log('30 gallery cards, 30 guide cards, four filters, both viewports and all 30 linked examples/images passed.');
 } finally {await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
