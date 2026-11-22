const {chromium}=require('playwright');const B=require('../../tests/lib/build.js');const FAKE=require('./fake.js');const fs=require('fs');
(async()=>{const K=B.kid();const br=await chromium.launch();const ctx=await br.newContext();await ctx.addInitScript(FAKE,{tools:K.tools,parts:K.parts});
const pg=await ctx.newPage();await pg.route('**/*',r=>r.request().url()==='http://app.test/'?r.fulfill({contentType:'text/html',body:K.page}):r.abort());await pg.goto('http://app.test/');
await pg.waitForFunction(()=>window.TLT&&typeof BANK_ALL!=='undefined'&&Object.keys(BANK_ALL).length>500,null,{timeout:180000});await pg.waitForTimeout(15000);
const ids=process.env.IDS.split(',');
const out=await pg.evaluate(ids=>ids.map(id=>{let it=[];try{it=buildMission(id);}catch(e){}
 const g=GEN[id];return {id,name:skillName(id),TL:(window.TL_TEACH||{})[id]||null,genHow:g?g.how:null,
 items:it.map(x=>({ph:x.phase,t:x.kind||x.t,q:String(x.q).slice(0,140),a:x.correct!=null?String(x.correct).slice(0,80):x.a,o:(x.shown||[]).slice(0,4).map(String).map(s=>s.slice(0,40))}))};}),ids);
fs.writeFileSync('tools/audit/out/dump.json',JSON.stringify(out,null,1));await br.close();})();
