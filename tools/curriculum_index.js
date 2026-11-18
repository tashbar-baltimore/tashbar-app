/* CURRICULUM INDEX: an exact inventory of every lesson the boys can get, for the Departments Course map
   (Head of School 2026-11-18: "everything that's being taught ... sequential order and skill levels, exact lessons as they're taught ...
   what do we have, what do we not have, what needs to be worked on").
   It runs the real student page and every lesson pack in a simulated browser (jsdom; no server calls, no student data) and reads:
   - every lesson in BANK_ALL (teach / practice / check items and their kinds) and every generated Math skill in GEN (with sample questions),
   - the teaching order: the ladders in src/Placement.js (MATH, READ, LANG, SCI, SOC, with names, descriptions and unbuilt skills)
     and TL_LK_ORDER (every Kodesh track),
   - extras: Teacher Time lessons (TL_TEACH), full Kindergarten game lessons (KL.list), Science labs and lesson pages (TL_SCI_*).
   Output: src/CurriculumIndex.js (var CI_INDEX = {...}), read by DeptMap.js. Rebuild it at every publish:
     npm i --no-save jsdom@24.1.3 && node web/build.js && node tools/curriculum_index.js web/dist src/Placement.js src/CurriculumIndex.js */
const { JSDOM, VirtualConsole } = require('jsdom'); const fs = require('fs'); const vm = require('vm');
const [DIST, PLACEMENT, OUT, FULLDIR] = process.argv.slice(2);   /* FULLDIR (optional): one JSON file per lesson with its FULL contents, for the Departments lesson-plan view (served next to the staff page) */
const html = fs.readFileSync(DIST + '/index.html', 'utf8').replace(/<script src="\/boot.js"><\/script>/, '');
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: new VirtualConsole(), url: 'https://tashbar-learning-live.web.app/',
  beforeParse(w) { w.google = { script: { run: new Proxy({}, { get: () => function () { return this; } }) } }; w.fetch = () => new Promise(() => {});
    w.speechSynthesis = { speak() {}, cancel() {} }; w.SpeechSynthesisUtterance = function () {}; w.Audio = function () { return { play() { return Promise.resolve(); } }; };
    w.matchMedia = () => ({ matches: false, addListener() {}, addEventListener() {} }); w.scrollTo = () => {}; } });
const w = dom.window; let partErrors = 0;
for (const h of JSON.parse(fs.readFileSync(DIST + '/parts/manifest.json', 'utf8')).order) { try { w.eval(fs.readFileSync(DIST + '/parts/' + h + '.js', 'utf8')); } catch (e) { partErrors++; } }
const page = JSON.parse(w.eval(`(function(){
  var clip=function(s,n){ s=String(s==null?'':s).replace(/<[^>]*>/g,' ').replace(/\\s+/g,' ').trim(); return s.length>n?s.slice(0,n-1)+'…':s; };
  var q=function(it){ return clip(it&&(it.q||it.prompt||it.p||it.text||it.stem||''),80); };
  var kinds=function(arr){ var k={}; (arr||[]).forEach(function(it){ var t=(it&&it.t)||(it&&it.o?'mc':'num'); k[t]=(k[t]||0)+1; }); return k; };
  var sk={}, sci={};
  Object.getOwnPropertyNames(window).filter(function(n){ return /^TL_SCI_/.test(n); }).forEach(function(n){ try{ var s=JSON.stringify(window[n]); var m=s.match(/SCI\\.[A-Z]+\\.L\\d\\d\\.\\d\\d/g)||[]; m.forEach(function(id){ sci[id]=1; }); }catch(e){} });
  var kl={}; try{ (KL.list()||[]).forEach(function(x){ kl[x[0]]=1; }); }catch(e){}
  Object.keys(BANK_ALL).forEach(function(id){ var b=BANK_ALL[id]||{}, all=(b.teach||[]).concat(b.practice||[],b.check||[]);
    sk[id]={ n:clip(b.name||id,70), t:(b.teach||[]).length, p:(b.practice||[]).length, c:(b.check||[]).length, k:kinds((b.practice||[]).concat(b.check||[])),
      s:(b.practice||[]).slice(0,3).map(q).filter(Boolean), w:all.some(function(it){ return it&&it.t==='write'; })?1:0 }; });
  Object.keys(GEN).forEach(function(id){ var g=GEN[id], s=[], k={}; for(var i=0;i<6;i++){ try{ var it=g.gen(); var t=it.t||(it.o?'mc':'num'); k[t]=(k[t]||0)+1; if(s.length<3) s.push(q(it)); }catch(e){} }
    sk[id]={ n:clip(g.name||id,70), t:3, p:6, c:3, k:k, s:s, g:1, how:(g.how||[]).map(function(h){ return clip(h,90); }).slice(0,3) }; });
  Object.keys(sk).forEach(function(id){ if(typeof TL_TEACH!=='undefined'&&TL_TEACH[id]) sk[id].tt=1; if(kl[id]) sk[id].kl=1; if(sci[id]) sk[id].lab=1; });
  Object.keys(kl).forEach(function(id){ if(!sk[id]) sk[id]={ n:id, t:0, p:0, c:0, k:{}, s:[], kl:1 }; else sk[id].kl=1; });
  var lk={}; try{ Object.keys(TL_LK_ORDER).forEach(function(t){ lk[t]=TL_LK_ORDER[t].slice(); }); }catch(e){}
  return JSON.stringify({ sk:sk, lk:lk }); })()`));
/* the ladders (teaching order, names, descriptions, also skills not built yet) straight from the server file */
const ctx = {}; vm.createContext(ctx); vm.runInContext(fs.readFileSync(PLACEMENT, 'utf8').replace(/^\s*function [\s\S]*$/m, ''), ctx);
const lad = {}; [['MATH', 'MATH_K8'], ['READ', 'READ_K8'], ['LANG', 'LANG_K8'], ['SCI', 'SCI_K8'], ['SOC', 'SS_K12']].forEach(([k, v]) => {
  try { lad[k] = vm.runInContext(v, ctx).map(x => [x[0], String(x[1] || ''), String(x[2] || '').slice(0, 140)]); } catch (e) { lad[k] = []; } });
const out = { built: new Date().toISOString(), sk: {}, lad: lad, lk: page.lk };
/* compact rows: [name, teach, practice, check, kinds "t:n,t:n", flags, samples, how] */
Object.keys(page.sk).sort().forEach(id => { const s = page.sk[id];
  out.sk[id] = [s.n, s.t, s.p, s.c, Object.keys(s.k).map(t => t + ':' + s.k[t]).join(','), (s.g ? 'g' : '') + (s.tt ? 't' : '') + (s.kl ? 'k' : '') + (s.lab ? 'l' : '') + (s.w ? 'w' : ''), s.s || [], s.how || []]; });
const js = '/* CurriculumIndex.js: GENERATED by tools/curriculum_index.js from the live page and lesson packs. Do not edit by hand; rebuild it. */\n' +
  'var CI_INDEX = ' + JSON.stringify(out) + ';\n';
if (js.indexOf('//') >= 0) { /* keep the house rule for generated text too: a double slash inside a string is fine in .js, but avoid surprises */ }
fs.writeFileSync(OUT, js);
if (FULLDIR) {
  const full = JSON.parse(w.eval(`(function(){ var o={}, keep=['t','q','o','a','alt','h','why','how','tiles','pairs','bins','items','cells','pic','checks','min','re','p','kb','unit'];
    var item=function(it){ var r={}; keep.forEach(function(k){ if(it&&it[k]!=null) r[k]=it[k]; }); if(!r.t) r.t=r.o?'mc':'num'; return r; };
    Object.keys(BANK_ALL).forEach(function(id){ var b=BANK_ALL[id]||{}; o[id]={ id:id, name:b.name||id, teach:(b.teach||[]).map(item), practice:(b.practice||[]).map(item), check:(b.check||[]).map(item) }; });
    Object.keys(GEN).forEach(function(id){ var g=GEN[id], s=[]; for(var i=0;i<8;i++){ try{ s.push(item(g.gen())); }catch(e){} } o[id]={ id:id, name:g.name||id, gen:1, how:g.how||[], samples:s }; });
    if(typeof TL_TEACH!=='undefined') Object.keys(o).forEach(function(id){ if(TL_TEACH[id]) o[id].tt=TL_TEACH[id]; });
    try{ (KL.list()||[]).forEach(function(x){ (o[x[0]]=o[x[0]]||{id:x[0],name:x[1]}).kl=1; }); }catch(e){}
    return JSON.stringify(o); })()`));
  fs.mkdirSync(FULLDIR, { recursive: true }); let n = 0, bytes = 0;
  Object.keys(full).forEach(id => { if (!/^[A-Za-z0-9.]+$/.test(id)) return; const t = JSON.stringify(full[id]); fs.writeFileSync(FULLDIR + '/' + id + '.json', t); n++; bytes += t.length; });
  console.log('full lesson files', n, 'bytes', bytes);
}
console.log('skills', Object.keys(out.sk).length, '| ladders', Object.keys(lad).map(k => k + ' ' + lad[k].length).join(', '), '| kodesh tracks', Object.keys(page.lk).length, '| bytes', js.length, '| part errors', partErrors);
process.exit(0);
