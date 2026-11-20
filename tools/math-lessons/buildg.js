/* node buildg.js <workdir with g3page.html,g3wrapper.js> <lessons.js> <out pack> <grade 5..8> <card blurb> <icon>
   lessons.js must define its lessons with mk<grade>('MATH.X.L0<grade+1>.NN', ...) and start with L.length=0. */
const fs=require('fs'); const [W,LES,OUT,GS,BLURB,ICON]=process.argv.slice(2); const G=+GS, LV=G+1;
const ORD={4:'4th',5:'5th',6:'6th',7:'7th',8:'8th'}[G], WORD={4:'Fourth',5:'Fifth',6:'Sixth',7:'Seventh',8:'Eighth'}[G];
let page=fs.readFileSync(W+'/engine-page.html','utf8'); const files=LES.split(','); const les=files.map(f=>fs.readFileSync(f,'utf8')).join(String.fromCharCode(10)); const own=fs.readFileSync(files[files.length-1],'utf8');
const mark='/* ================= RUNNER ================= */'; if(page.split(mark).length!==2) throw 'runner mark';
page=page.replace(mark,()=>les+String.fromCharCode(10)+mark);
const rep=(s,a,b,n)=>{ const c=s.split(a).length-1; if(n!=null&&c!==n) throw 'count '+a+' '+c; return s.split(a).join(b); };
page=rep(page,'<title>Third Grade Math Lessons</title>','<title>'+WORD+' Grade Math Lessons</title>',1);
page=rep(page,'3rd Grade Math <small>Level 4 lessons in the new style</small>',ORD+' Grade Math <small>Level '+LV+' lessons in the new style</small>');
page=rep(page,"'g3math-done'","'g"+G+"math-done'",2);
let w=fs.readFileSync(W+'/engine-wrapper.js','utf8');
const IDS=[...own.matchAll(new RegExp("mk"+G+"\\('(MATH\\.[A-Z]+\\.L0"+LV+"\\.\\d\\d)'",'g'))].map(m=>m[1]); if(!IDS.length) throw 'no ids';
w=w.replace(/const LIST=\[[^\n]*\];/,'const LIST='+JSON.stringify(IDS.map(i=>[i,i])).replace(/","/g,'", "').replace(/\],\[/g,'], [')+';');
w=rep(w,'ME.grade>=3&&ME.grade<=4','ME.grade>='+G+'&&ME.grade<='+Math.min(G+1,8),1);
w=rep(w,'All 24 lessons: times tables, division, fractions, area, time and more.','All '+IDS.length+' lessons: '+BLURB,1);
w=rep(w,"' You finished '+n+' of 24.'","' You finished '+n+' of "+IDS.length+".'",1);
w=rep(w,'aria-hidden="true">🗼</span>','aria-hidden="true">'+ICON+'</span>',1);
for(const [a,b] of [['G3_MATH_LIVE','G'+G+'_MATH_LIVE'],['G3M','G'+G+'M'],['g3m','g'+G+'m'],['G3 math','G'+G+' math'],['3rd GRADE MATH (Level 4), ALL 24 lessons, ALL 21 Level 2 lessons (K-3 overhaul S2a)',ORD.toUpperCase()+' GRADE MATH (Level '+LV+'), ALL '+IDS.length+' lessons (Claude Code, yosef@ session, 2026-11-20, on the K-3 lesson engine)'],['G3Math.html','G'+G+'Math.html'],['3rd Grade Math',ORD+' Grade Math']]) w=w.split(a).join(b);
const enc=JSON.stringify(page).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
const out=w.replace('@@PAGE@@',()=>enc); fs.writeFileSync(OUT,out);
const ds=(out.match(/\/\//g)||[]).length; console.log('bytes',Buffer.byteLength(out),'ids',IDS.length,'doubleslash',ds,'g3left',(w.match(/g3|G3/g)||[]).length); if(ds) throw 'double slash found';
