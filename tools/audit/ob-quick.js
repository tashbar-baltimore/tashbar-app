/* quick One Bite test only (same pretend server and made-up boys as tests/run.js) */
const {chromium}=require('playwright');const B=require('../../tests/lib/build.js');const FAKE=require('./fake.js');
(async()=>{const K=B.kid();const br=await chromium.launch();const ctx=await br.newContext({viewport:{width:390,height:844}});await ctx.addInitScript(FAKE,{tools:K.tools,parts:K.parts});
const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(String(e).slice(0,200)));pg.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(m.text().slice(0,200));});
await pg.route('**/*',r=>r.request().url()==='http://app.test/'?r.fulfill({contentType:'text/html',body:K.page}):r.abort());await pg.goto('http://app.test/');
await pg.waitForFunction(()=>window.TLT&&typeof BANK_ALL!=='undefined'&&Object.keys(BANK_ALL).length>500,null,{timeout:180000});await pg.waitForTimeout(15000);
const r=await require('../../tests/lib/onebite.js')(pg);console.log(JSON.stringify(r,null,1));console.log('page errors',errs);await br.close();})();
