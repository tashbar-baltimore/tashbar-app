const {chromium}=require('playwright');const path=require('path');
const NM=path.join(__dirname,'deps/node_modules/three');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
for(const [tag,vp] of [['cb',{width:1366,height:768}],['ph',{width:390,height:844}]]){
const p=await b.newPage({viewport:vp});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.route('https://cdn.jsdelivr.net/npm/three@0.160.0/**',r=>{const rel=r.request().url().split('three@0.160.0/')[1];r.fulfill({path:path.join(NM,rel),contentType:'text/javascript'})});
await p.route('https://fonts.googleapis.com/**',r=>r.abort());
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(2500);
const shot=async n=>p.screenshot({path:`sample/3d-${tag}-${n}.png`});
await shot('0');
await p.click('#start',{force:true});await p.waitForTimeout(3000);await shot('1');
await p.waitForTimeout(7300);await shot('2morph');
await p.waitForSelector('body[data-tap-ready]',{timeout:60000});await shot('3letter');
// tap the letter in the middle
const L=(await p.evaluate(()=>window.__info())).l1;await p.mouse.click(L[0],L[1]);
await p.waitForSelector('#next.show',{timeout:30000});await shot('4veis');
await p.click('#next',{force:true});await p.waitForTimeout(5500);await shot('5demo');
await p.waitForSelector('body[data-drag-ready]',{timeout:60000});await p.waitForTimeout(500);
const info=async()=>p.evaluate(()=>window.__info&&window.__info());
const dragTo=async(fx,fy,tx,ty)=>{await p.mouse.move(fx,fy);await p.mouse.down();await p.mouse.move(tx,ty,{steps:10});await p.mouse.up();};
let i=await info();
// wrong first
await dragTo(i.card[0],i.card[1],...(i.k==='b'?i.hv:i.hb));await p.waitForTimeout(900);await shot('6wrong');
await p.waitForTimeout(6000);
for(let n=0;n<10;n++){i=await info();if(i.done)break;if(!i.ready){await p.waitForTimeout(800);continue;}
 await dragTo(i.card[0],i.card[1],...(i.k==='b'?i.hb:i.hv));await p.waitForTimeout(700);if(n===1)await shot('7right');await p.waitForTimeout(2400);}
await p.waitForSelector('.yay.show',{timeout:30000}).catch(()=>{});await p.waitForTimeout(900);await shot('8end');
console.log(tag,'errors:',errs.slice(0,5));}
await b.close();})();
