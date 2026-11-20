const fs=require('fs'); const {chromium}=require('playwright');
const src=fs.readFileSync(process.argv[2],'utf8'); const i=src.indexOf('const PAGE=')+11; let j=i+1; while(true){ if(src[j]==='\\'){j+=2;continue} if(src[j]==='"')break; j++; }
const PAGE=JSON.parse(src.slice(i,j+1)); const S=[];
(async()=>{ const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1024,height:900}});
  await pg.route('**/*',r=>r.request().url().startsWith('http://kit.test')?r.fulfill({contentType:'text/html; charset=utf-8',body:'<script>window.KL_FAST=1;window.KL_NO_TTS=1;</script>'+PAGE}):r.abort());
  await pg.goto('http://kit.test/'); const n=await pg.evaluate(()=>window.__kit.lessons.length);
  for(let round=0;round<4;round++) for(let k=0;k<n;k++){ await pg.evaluate(k=>{ const f=document.getElementById('fin'); if(f) f.remove(); window.__kit.start(k); },k); await pg.waitForTimeout(80); const t0=Date.now();
    while(Date.now()-t0<60000){ const st=await pg.evaluate(()=>{ if(document.getElementById('fin')) return {done:1}; const sc=document.getElementById('scene'); const ok=[...sc.querySelectorAll('[data-ok]')].filter(e=>e.onclick);
        if(ok.length===1){ const r={cap:document.getElementById('cap').textContent,scene:sc.innerText.replace(/\s+/g,' ').slice(0,400),ok:ok[0].textContent.trim(),opts:[...sc.querySelectorAll('.ch,.pic')].map(x=>x.textContent.trim())}; ok[0].click(); return r; }
        const bot=window.__kit.bot&&window.__kit.bot(); if(bot){ bot(); return {bot:1}; } return {w:1}; });
      if(st.done) break; if(st.cap) S.push(st); await pg.waitForTimeout(25); } }
  fs.writeFileSync(process.argv[3],JSON.stringify(S)); console.log('samples',S.length); await b.close(); })();
