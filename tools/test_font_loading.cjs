/* Optional browser QA. Requires Playwright and a Chromium installation. */
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { chromium } = require("playwright");

(async () => {
  const root = path.resolve(__dirname, "../skills/dazzler-frontend");
  const catalog = JSON.parse(
    fs.readFileSync(path.join(root, "references/font-catalog.json"), "utf8"),
  );
  const fonts = catalog.fonts.filter((f) => f.status === "bundled");
  const faces = fonts.flatMap((f) => f.files.map((v) => ({ ...v, id: f.id, name: f.name })));
  const routes = new Map(faces.map((f) => ["/" + f.path, path.join(root, f.path)]));
  const html = `<!doctype html><meta charset="utf-8"><title>Bundled font specimens</title>
  <style>body{font:16px system-ui;margin:32px;background:#fff;color:#181818}h1{font:600 30px system-ui}main{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}article{border-top:1px solid #bbb;padding-top:12px;min-height:170px;overflow-wrap:anywhere}h2{font:600 14px system-ui;margin:0 0 15px}p{margin:8px 0}.sample{font-size:28px;line-height:1.25}.small{font-size:15px;line-height:1.5}.meta{font:11px system-ui;color:#555}@media(max-width:700px){main{grid-template-columns:1fr}body{margin:16px}}</style>
  <h1>Open Foundry — bundled font specimens</h1><p>24 families · original font bytes · local browser QA</p><main></main>
  <script>
  const faces=${JSON.stringify(faces).replace(/</g, "\\u003c")};
  const families=${JSON.stringify(fonts.map((f) => ({ id: f.id, name: f.name, description: f.description }))).replace(/</g, "\\u003c")};
  window.results=[];
  window.ready=(async()=>{
    for(let i=0;i<faces.length;i++){
      const f=faces[i];
      try {
        const face=new FontFace('QA'+i,'url('+encodeURI('/'+f.path)+')',{weight:f.css_weight,style:f.css_style,stretch:f.css_stretch});
        await face.load();document.fonts.add(face);results.push({file:f.path,status:face.status});
      }catch(error){results.push({file:f.path,error:String(error)});}
    }
    for(const family of families){
      const ff=faces.filter(f=>f.id===family.id);
      const normal=ff.filter(f=>f.css_style==='normal');
      const priority=f=>(/condensed|titling|inline|dashed|rounded/i.test(f.filename)?10:0)+(/regular|book/i.test(f.filename)?-5:0)+(f.axes.wght?-3:0);
      const selected=normal.sort((a,b)=>priority(a)-priority(b))[0]||ff[0];
      const index=faces.indexOf(selected);const card=document.createElement('article');
      const title=document.createElement('h2');title.textContent=family.name;card.append(title);
      for(const [klass,copy] of [['sample','Form follows meaning.'],['small','Aa Bb 0123456789 — Il1 O0 rn'],['meta',selected.filename]]){
        const p=document.createElement('p');p.className=klass;p.textContent=copy;
        if(klass!=='meta'){p.style.fontFamily='"QA'+index+'"';p.style.fontStyle=selected.css_style;const w=selected.css_weight.split(' ').map(Number);p.style.fontWeight=Math.min(Math.max(400,w[0]),w[w.length-1]);}
        card.append(p);
      }
      document.querySelector('main').append(card);
    }
    await document.fonts.ready;return results;
  })();</script>`;
  const server = http.createServer((req, res) => {
    const url = decodeURI(new URL(req.url, "http://localhost").pathname);
    if (url === "/") {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(html);
      return;
    }
    const file = routes.get(url);
    if (!file) {
      res.statusCode = 404;
      res.end();
      return;
    }
    res.setHeader("Content-Type", "application/octet-stream");
    res.end(fs.readFileSync(file));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto("http://127.0.0.1:" + server.address().port);
    const results = await page.evaluate(() => window.ready);
    const failed = results.filter((f) => f.error);
    const report = {
      families: fonts.length,
      files: results.length,
      loaded: results.length - failed.length,
      failed,
      errors,
    };
    const out = process.argv[2];
    if (out) {
      fs.mkdirSync(out, { recursive: true });
      fs.writeFileSync(path.join(out, "browser-font-report.json"), JSON.stringify(report, null, 2));
      await page.screenshot({ path: path.join(out, "font-specimens-desktop.png"), fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: path.join(out, "font-specimens-mobile.png"), fullPage: true });
    }
    console.log(JSON.stringify(report, null, 2));
    if (failed.length || errors.length) process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
