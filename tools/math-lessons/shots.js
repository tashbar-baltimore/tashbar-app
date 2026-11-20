const fs=require('fs'); const {chromium}=require('playwright');
const src=fs.readFileSync(process.argv[2],'utf8'); const i=src.indexOf('const PAGE=')+11; let j=i+1; while(true){ if(src[j]==='\\'){j+=2;continue} if(src[j]==='"')break; j++; }
const PAGE=JSON.parse(src.slice(i,j+1)); const OUT=process.argv[3];
const WANT=[[0,/VALUE of the red/],[2,/Add\. Line up/],[6,/^Divide /],[8,/Compare\. Which sign/],[11,/Compare the decimals/],[14,/Read the protractor/],[14,/What kind of angle/],[15,/How do these two lines/],[15,/dashed red line/],[16,/How much longer is the longest/],[13,/AREA/],[17,/What is the rule/]];
(async()=>{ const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
  await pg.route('**/*',r=>r.request().url().startsWith('http://kit.test')?r.fulfill({contentType:'text/html; charset=utf-8',body:'<script>window.KL_FAST=1;window.KL_NO_TTS=1;</script>'+PAGE}):r.abort());
  await pg.goto('http://kit.test/'); let n=0;
  for(const [k,re] of WANT){ await pg.evaluate(k=>{ const f=document.getElementById('fin'); if(f) f.remove(); window.__kit.start(k); },k); await pg.waitForTimeout(80); const t0=Date.now(); let got=false;
    while(Date.now()-t0<30000&&!got){ const st=await pg.evaluate(src=>{ const re=new RegExp(src); if(document.getElementById('fin')) return {done:1}; const sc=document.getElementById('scene'); const ok=[...sc.querySelectorAll('[data-ok]')].filter(e=>e.onclick); if(ok.length===1){ if(re.test(document.getElementById('cap').textContent)) return {hit:1}; ok[0].click(); return {c:1}; } const bot=window.__kit.bot&&window.__kit.bot(); if(bot){ bot(); } return {w:1}; },re.source);
      if(st.done) break; if(st.hit){ await pg.waitForTimeout(150); await pg.screenshot({path:OUT+'/s'+String(n++).padStart(2,'0')+'.png'}); got=true; } else await pg.waitForTimeout(25); } }
  await b.close(); console.log('shots',n); })();
