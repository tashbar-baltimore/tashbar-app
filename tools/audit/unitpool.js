/* Dump every question a unit check can draw: the unit's own items, and every check question of each skill and review skill
   (buildMission run several times, de-duplicated), plus each skill lesson's teaching and practice, for a fresh reviewer.
   UNITS=C68.U77,C68.U78 OUT=path.json node tools/audit/unitpool.js */
const {chromium}=require('playwright');const B=require('../../tests/lib/build.js');const FAKE=require('./fake.js');const fs=require('fs');
(async()=>{const K=B.kid();const br=await chromium.launch();const ctx=await br.newContext();await ctx.addInitScript(FAKE,{tools:K.tools,parts:K.parts});
const pg=await ctx.newPage();await pg.route('**/*',r=>r.request().url()==='http://app.test/'?r.fulfill({contentType:'text/html',body:K.page}):r.abort());await pg.goto('http://app.test/');
await pg.waitForFunction(()=>window.TLT&&typeof BANK_ALL!=='undefined'&&Object.keys(BANK_ALL).length>500,null,{timeout:180000});await pg.waitForTimeout(15000);
const ids=process.env.UNITS.split(',');
const out=await pg.evaluate(ids=>ids.map(uid=>{const u=TLCORE.units.byId[uid];
 if(!u) return {uid,missing:true};
 const sk=(u.skills||[]).concat(u.review||[]);
 const skills=sk.map(id=>{const seen={},checks=[],lesson=[];for(let r=0;r<25;r++){let it=[];try{it=buildMission(id);}catch(e){}
   it.forEach(x=>{const key=x.phase+'|'+x.q+'|'+JSON.stringify(x.shown||x.tiles||'');if(seen[key])return;seen[key]=1;
     const row={phase:x.phase,t:x.t,kind:x.kind||(x.act&&x.act.type)||null,q:x.q,p:x.p||'',pic:x.pic||'',h:x.h||'',shown:x.shown||null,correct:x.correct,tiles:x.tiles||null,how:x.how||(x.act&&x.act.how)||null,act:x.act||null};
     if(x.phase==='check') checks.push(row); else if(r===0) lesson.push(row);});}
   return {id,name:(typeof skillName==='function'?skillName(id):id),review:(u.review||[]).indexOf(id)>=0,checks,lesson};});
 return {uid,unit:JSON.parse(JSON.stringify(u)),skills};}),ids);
fs.writeFileSync(process.env.OUT,JSON.stringify(out,null,1));await br.close();})();
