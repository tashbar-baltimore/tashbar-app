// node quick3.js game w h outprefix  -> <prefix>-lesson.png and <prefix>-find.png (full look)
const path=require('path'),fs=require('fs'),os=require('os'),cp=require('child_process');
const [game,w,h,out]=process.argv.slice(2);
const dist=fs.mkdtempSync(path.join(os.tmpdir(),'q-'));cp.execFileSync(process.execPath,[require('path').join(__dirname,'..','..','..','build.js')],{env:Object.assign({},process.env,{V2_OUT:dist})});
(async()=>{const b=await require('playwright').chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const pg=await (await b.newContext({viewport:{width:+w,height:+h}})).newPage();
await pg.route('**/*',r=>{const u=new URL(r.request().url());const f=path.join(dist,u.pathname.slice(1));return fs.existsSync(f)?r.fulfill({path:f}):r.fulfill({status:404,body:''});});
await pg.goto('http://v2.test/k-shapes/'+game+'.html?fast=1&shot=1');await pg.waitForFunction(()=>window.__shp&&window.__shp.ready,null,{timeout:120000});
const shot=async f=>{await pg.evaluate(()=>{window.__shotDraw=true;});await pg.waitForTimeout(1500);await pg.screenshot({path:f,timeout:240000});await pg.evaluate(()=>{window.__shotDraw=false;});};
await pg.click('#start',{force:true});let lessonShot=false;
for(let i=0;i<200;i++){const n=await pg.evaluate(()=>window.__shp.name);if(n==='find'||n==='bonus')break;
  if(n==='tap'){ if(!lessonShot){lessonShot=true;await shot(out+'-lesson.png');}
    await pg.evaluate(()=>{window.__shotDraw=true;});await pg.waitForTimeout(200);
    const p=await pg.evaluate(()=>{const s=window.__shp;const a=s.tapTarget&&s.tapTarget();if(a)return a;const c=(s.cornerPtsP&&s.cornerPtsP())||(s.cornerPts&&s.cornerPts())||[];return c[0]||null;});
    if(p)await pg.mouse.click(p.x,p.y);await pg.evaluate(()=>{window.__shotDraw=false;});}
  await pg.waitForTimeout(300);}
await pg.waitForTimeout(2000);await shot(out+'-find.png');await b.close();})();
