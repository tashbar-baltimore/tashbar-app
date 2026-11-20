const fs=require('fs'); const {chromium}=require('playwright');
const src=fs.readFileSync(process.argv[2],'utf8'); const i=src.indexOf('const PAGE=')+11; let j=i+1; while(true){ if(src[j]==='\\'){j+=2;continue} if(src[j]==='"')break; j++; }
const PAGE=JSON.parse(src.slice(i,j+1)); const ROUNDS=+(process.argv[3]||1), SHOT=process.argv[4];
(async()=>{ const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:390,height:844}}); const errs=[];
  pg.on('pageerror',e=>errs.push(String(e))); pg.on('console',m=>{ if(m.type()==='error') errs.push('console: '+m.text()); });
  await pg.route('**/*',r=>r.request().url().startsWith('http://kit.test')?r.fulfill({contentType:'text/html; charset=utf-8',body:'<script>window.KL_FAST=1;window.KL_NO_TTS=1;window.KL_TTS="http:"+"/"+"/127.0.0.1:1";</script>'+PAGE}):r.abort());
  await pg.goto('http://kit.test/'); const ids=await pg.evaluate(()=>window.__kit.lessons); const res=[];
  for(let round=0;round<ROUNDS;round++) for(let k=0;k<ids.length;k++){ const t0=Date.now(); let clicks=0, bad=0, overflow=0;
    await pg.evaluate(k=>{ const f=document.getElementById('fin'); if(f) f.remove(); window.__kit.start(k); },k); await pg.waitForTimeout(80);
    while(Date.now()-t0<90000){ const st=await pg.evaluate(()=>{ if(document.getElementById('fin')) return {done:1};
        const sc=document.getElementById('scene'); const ok=[...sc.querySelectorAll('[data-ok]')].filter(e=>e.onclick); const chs=[...sc.querySelectorAll('.ch,.pic')].filter(e=>e.onclick);
        const bot=window.__kit.bot&&window.__kit.bot(); const ov=document.documentElement.scrollWidth>window.innerWidth+2;
        if(ok.length===1){ ok[0].click(); return {click:1,n:chs.length,ov}; } if(ok.length>1) return {multi:ok.length};
        if(bot){ bot(); return {bot:1,ov}; } return {wait:1}; });
      if(st.done) break; if(st.multi){ bad++; await pg.evaluate(()=>[...document.querySelectorAll('#scene [data-ok]')][0].click()); }
      if(st.click){ clicks++; if(st.n<2) bad++; } if(st.ov) overflow++; await pg.waitForTimeout(st.wait?60:30); }
    const fin=await pg.evaluate(()=>!!document.getElementById('fin')); const last=await pg.evaluate(()=>window.__kit.last);
    if(SHOT&&round===0&&k<3) await pg.screenshot({path:SHOT+'-'+k+'.png'});
    res.push({id:ids[k],fin,clicks,bad,overflow,ok:last&&last.ok,ms:Date.now()-t0}); }
  console.log('clicks per lesson',res.map(r=>r.clicks).join(','),'ids',[...new Set(res.map(r=>r.id))].length);console.log(JSON.stringify(res.filter(r=>!r.fin||r.bad||r.ok!==3||r.overflow||r.clicks<15)),'\nlessons',res.length,'finished',res.filter(r=>r.fin&&r.ok===3).length,'errors',errs.length); errs.slice(0,15).forEach(e=>console.log(' ERR',e.slice(0,300)));
  await b.close(); })();
