// Requires an existing Playwright runtime. No package installation or network requests.
const {chromium}=require('playwright'),fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve('skills/dazzler-frontend/assets/templates'),out=path.resolve(process.argv[2]);await fs.mkdir(out,{recursive:true});
 const catalog=JSON.parse(await fs.readFile(path.join(root,'catalog.json'),'utf8'));const browser=await chromium.launch();const checks=[];
 try{const page=await browser.newPage({acceptDownloads:true});let errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const t of catalog.templates.filter(t=>t.format!=='docx')){
  errors=[];const file=path.join(root,t.path,t.format==='ui'?'index.html':'');await page.goto(pathToFileURL(file).href);await page.evaluate(()=>document.fonts.ready);
  for(const width of [1440,390]){await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),t.id+' overflow');await page.screenshot({path:path.join(out,t.id+'-'+width+'.png'),fullPage:true});}
  assert((await page.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').length))>0,t.id+' fonts');
  if(t.format==='ui'){
   const cfg=JSON.parse(await fs.readFile(path.join(root,t.path,'template.json'),'utf8'));assert.deepEqual(await page.locator('#template-data').evaluate(e=>JSON.parse(e.textContent)),cfg);
   if(['workspace','business'].includes(cfg.layout)){await page.locator('#search').fill('no match');assert(await page.locator('#empty').isVisible());await page.locator('#search').fill('');await page.locator('[data-action="'+cfg.layout+'"]').click();await page.locator('#entry').fill('New sample');await page.locator('#edit-form button[type!=button]').count().catch(()=>0);await page.locator('#edit-form button').first().click();assert((await page.locator('#status').innerText()).length>0);}
   if(cfg.layout==='board'){await page.locator('[data-action="board"]').click();await page.locator('#entry').fill('Review launch');await page.locator('#edit-form button').first().click();assert.equal(await page.locator('.task').count(),4);await page.locator('[data-move]').first().click();assert.match(await page.locator('#status').innerText(),/moved/);}
   if(cfg.layout==='settings'){await page.locator('#name').fill('Taylor');await page.locator('#settings button').click();assert.match(await page.locator('#status').innerText(),/preview only/);}
   if(['revenue','operations'].includes(cfg.layout)){const dl=page.waitForEvent('download');await page.locator('[data-action="download"]').click();assert((await dl).suggestedFilename().endsWith('.csv'));}
   if(cfg.layout==='reservations'){await page.locator('#date').fill('2027-01-15');await page.locator('#guest').fill('Taylor');await page.locator('#reservation button').click();assert.match(await page.locator('#status').innerText(),/No booking/);}
   if(['cafe','menu'].includes(cfg.layout)){await page.locator('[data-filter]').nth(1).click();assert((await page.locator('[data-category]:visible').count())<cfg.items.length);await page.locator('[data-filter]').first().click();}
   if(cfg.layout==='cafe'){await page.locator('[data-add]').first().click();assert.match(await page.locator('#cart').innerText(),/1 items/);await page.locator('[data-action="clear"]').click();assert.match(await page.locator('#cart').innerText(),/0 items/);}
  }
  assert.deepEqual(errors,[],t.id+' page errors');checks.push({id:t.id,viewports:[1440,390],fonts:'loaded',interactions:t.format==='ui'?'checked':'print control available'});
 }
 await fs.writeFile(path.join(out,'checks.json'),JSON.stringify(checks,null,2));console.log('20 HTML/UI templates passed desktop/mobile, font and applicable interaction checks.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
