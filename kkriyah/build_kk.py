"""Build the live package for Kindergarten Math from the reviewed preview page (pilot/k-math.html).
Out: KLessonsPage.html (stand-alone page, for testing), KLessons.html (the app add-on, page embedded), KLessons.js (server, read only).
"""
import json, re, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'k-kriyah.html'), encoding='utf-8').read()

def rep(s, a, b, n=1):
    c = s.count(a)
    if c != n:
        sys.exit('pattern count %d != %d: %r' % (c, n, a[:80]))
    return s.replace(a, b)

p = src
# no outside fonts (no double slash anywhere, works offline); the font stack falls back to Comic Sans / Trebuchet
p = re.sub(r'<link rel="preconnect"[^>]*>\n', '', p)
p = re.sub(r'<link rel="stylesheet" href="https:[^>]*>\n', '', p)
p = rep(p, '    <span class="mode">Preview: nothing is saved to the school</span>\n', '')
p = rep(p, "const FAST=/fast/.test(location.search)?0.04:1;", "const FAST=(window.KK_FAST||/fast/.test(location.search))?0.04:1;\nlet EPOCH=0, CUR=null;\nfunction post(m){ try{ if(window.parent&&window.parent!==window) window.parent.postMessage(m,'*'); }catch(e){} }")
p = rep(p, "const wait=ms=>new Promise(r=>setTimeout(r,ms*FAST));", "const wait=ms=>{ const ep=EPOCH; return new Promise(r=>setTimeout(()=>{ if(ep===EPOCH) r(); },ms*FAST)); };")
p = rep(p, "function say(t){ lastLine=t; cap.textContent=t; const spk=$('spk');\n  return new Promise(res=>{", "function say(t){ lastLine=t; cap.textContent=t; const spk=$('spk'); const ep=EPOCH;\n  return new Promise(res0=>{ const res=()=>{ if(ep===EPOCH) res0(); };")
p = rep(p, "let done={}; try{ done=JSON.parse(localStorage.getItem('kkriyah-done')||'{}')||{}; }catch(e){}",
        "let done=Object.assign({},window.KK_DONE||{}); try{ Object.assign(done,JSON.parse(localStorage.getItem('kkriyah-done')||'{}')||{}); }catch(e){}")
p = rep(p, "const r=await G[kind](c); BOT=null; const first=r[0], line=r[1]||'';",
        "const r=await G[kind](c); BOT=null; const first=r[0], line=r[1]||''; if(CUR) post({tlK:1, skill:CUR, phase:mode==='check'?'check':'practice', item:String(kind)+(c.intro?' (real life)':''), first:!!first});")
p = rep(p, "async function lesson(Ls){ stars=0;", "async function lesson(Ls){ EPOCH++; CUR=Ls.id; stars=0;")
p = rep(p, "  window.__kit.last={id:Ls.id,ok:ok,stars:stars};", "  window.__kit.last={id:Ls.id,ok:ok,stars:stars}; post({tlKDone:1, skill:Ls.id, ok:ok, stars:stars});")
p = rep(p, "function menu(){ try{", "function menu(){ EPOCH++; CUR=null; try{")
p = rep(p, "$('home').onclick=()=>{ location.hash=''; location.reload(); };", "$('home').onclick=()=>{ menu(); };")
p = rep(p, "const h=location.hash.slice(1), hi=", "const h=String(window.KK_OPEN||location.hash.slice(1)), hi=")
assert '//' not in p, [m.start() for m in re.finditer('//', p)][:5]
open(os.path.join(HERE, 'KKriyahPage.html'), 'w', encoding='utf-8').write(p)

lessons = re.findall(r"\{id:'(LK\.KRI\.L01\.\d\d\.[a-z])',t:'([^']*)',e:'([^']*)'", p)
assert len(lessons) == 11, lessons
ids = [l[0] for l in lessons]

page_js = json.dumps(p, ensure_ascii=False).replace('<', '\\u003c').replace('>', '\\u003e')
assert '//' not in page_js and '<' not in page_js


def kr(a):
    a = a.replace('window.KL=', 'window.KK=').replace('window.KL.', 'window.KK.').replace('KL_DONE', 'KK_DONE').replace('KL_OPEN', 'KK_OPEN').replace('KL_FAST', 'KK_FAST')
    a = a.replace('K_LESSONS_LIVE', 'K_KRIYAH_LIVE').replace('klov', 'kkov').replace('klcard', 'kkcard').replace('klbar', 'kkbar').replace('klx', 'kkx').replace('data-kl', 'data-kk').replace('dataset.kl', 'dataset.kk')
    a = a.replace('st.klm', 'st.kkm').replace('.klm', '.kkm')
    a = a.replace('Kindergarten Math', 'Kindergarten Kriyah').replace('🍎', '✡️').replace('16 lessons that talk to you: count, add, shapes and more.', '11 lessons that talk to you: the whole Aleph-Beis and the dot letters.').replace('of 16.', 'of 11.')
    a = a.replace("'K lessons'", "'K kriyah'").replace('KLessons.html', 'KKriyah.html')
    return a

addon = r'''<script>
/* KLessons.html — KINDERGARTEN MATH, 16 lessons in the new style (00 LESSON RULE). Claude Code builder, 2026-11-18.
   Head of School: "Let's do the full kindergarten curriculum ... with huge amounts of variety and games" and "I want it all to be published live."
   Built like KinderKriyah.html (v148/v197), which is live and proven:
     - the lesson page runs inside its own sealed frame (srcdoc, sandbox allow-scripts), so its styles never touch the app;
     - the page tells the app each finished item {tlK:1, skill, phase, item, first}; the app checks the message came from THIS frame
       and saves it as an evidence row, skill "KLESSON.<skill id>", through saveStudent/msSave. The server decides any pay (msCheckPay_),
       exactly like Kodesh Quest. Nothing here sets an amount. The "KLESSON." prefix keeps these rows OUT of grid mastery and placement.
     - at the end {tlKDone:1, skill, ok (0-3 on the check), stars}: the best check score is kept in the boy's state, st.klm[skill].
   WHO SEES IT: the "Kindergarten Math" card shows for boys whose roster grade is K or 1 (server klMe, read only), and for TEST- boys.
     SWITCH: window.K_LESSONS_LIVE = true -> those boys; false -> TEST- boys only.
   FOR OTHER PARTS OF THE APP: window.KL.has(skillId), window.KL.open(skillId) opens that lesson directly (LessonPop / Today can call it).
   English device voice only (no Hebrew in these lessons). No double slash in this file. */
(function(){
if(typeof render!=='function'||typeof A==='undefined') return;
window.K_LESSONS_LIVE = true;
const PAGE=__PAGE__;
const LIST=__LIST__;
const IDS=LIST.map(l=>l[0]);
let ME=null, qT=null;
function isTest(st){ return /^TEST-/.test(String(st&&st.id||'')); }
function on(st){ if(!st) return false; if(isTest(st)) return true; return !!(window.K_LESSONS_LIVE&&ME&&ME.sid===st.id&&(ME.grade===0||ME.grade===1)); }
function me(){ try{ const st=A.st; if(!st||(ME&&ME.sid===st.id)) return; const sid=st.id; ME={sid:sid,grade:null};
  if(typeof run!=='function'||typeof SRV==='undefined'||!SRV.token) return;
  run('klMe',SRV.token).then(r=>{ if(!ME||ME.sid!==sid) return; ME={sid:sid,grade:(r&&typeof r.grade==='number')?r.grade:null}; try{ if(A.view==='hub'&&A.st&&A.st.id===sid&&on(A.st)) render(); }catch(e){} }).catch(()=>{}); }catch(e){} }
function doneMap(st){ const m={}; try{ const k=st&&st.klm; if(k&&typeof k==='object') IDS.forEach(id=>{ if(typeof k[id]==='number') m[id]=k[id]; }); }catch(e){} return m; }
try{ if(!document.getElementById('kl-css')){ const s=document.createElement('style'); s.id='kl-css'; s.textContent=`
.klcard{margin:14px 0;border-radius:24px;background:linear-gradient(135deg,#FFF6D8,#E8F6FF);border:3px solid #FFC83D;display:flex;align-items:center;gap:16px;padding:16px 20px;color:#1F2A44;box-shadow:0 6px 0 #EADFB8}
.klcard .ki{font-size:46px}.klcard .kt{flex:1}.klcard b{display:block;font-size:24px}.klcard small{font-size:16px;opacity:.85}
.klcard button{border:0;border-radius:18px;padding:14px 24px;font:inherit;font-weight:900;font-size:22px;background:#2FBF71;color:#fff;cursor:pointer;min-height:60px;box-shadow:0 5px 0 #1f8a51}
.klov{position:fixed;inset:0;z-index:2147483000;background:#FFF6D8;display:flex;flex-direction:column}
.klov .klbar{display:flex;justify-content:flex-end;padding:6px 10px;background:#FFF6D8}
.klov .klx{border:0;border-radius:14px;padding:10px 18px;font:inherit;font-weight:900;font-size:18px;background:#1F2A44;color:#fff;cursor:pointer;min-height:48px}
.klov iframe{flex:1;width:100%;border:0;background:#E8F6FF}`; document.head.appendChild(s); } }catch(e){}
const _find=window.tlFindLevelCard;
window.tlFindLevelCard=function(st){ let h=''; try{ h=_find?_find(st):''; }catch(e){}
  try{ me(); if(st&&A.view==='hub'&&on(st)){ const d=doneMap(st), n=Object.keys(d).length;
    h+='<section class="klcard" data-klcard="1"><span class="ki" aria-hidden="true">🍎</span><span class="kt"><b>Kindergarten Math</b><small>16 lessons that talk to you: count, add, shapes and more.'+(n?' You finished '+n+' of 16.':'')+'</small></span><button type="button" data-kl="open">Play</button></section>'; } }catch(e){}
  return h; };
function open(id){ close(true); const st=A&&A.st; const ov=document.createElement('div'); ov.className='klov'; ov.id='klov';
  ov.innerHTML='<div class="klbar"><button class="klx" type="button" data-kl="close" aria-label="Close Kindergarten Math">✕ Done</button></div><iframe title="Kindergarten Math" sandbox="allow-scripts" allow="autoplay"></iframe>';
  document.body.appendChild(ov);
  const pre='\u003cscript>window.KK_DONE='+JSON.stringify(doneMap(st))+';window.KK_OPEN='+JSON.stringify(IDS.indexOf(id)>=0?id:'')+';'+(window.KK_FAST?'window.KK_FAST=1;':'')+'\u003c/scr'+'ipt>';
  ov.querySelector('iframe').srcdoc=pre+PAGE; }
function close(quiet){ const o=document.getElementById('klov'); if(o) o.remove(); if(quiet) return; try{ if(qT){ clearTimeout(qT); qT=null; if(A.st&&typeof saveStudent==='function') saveStudent(A.st); } }catch(e){} try{ if(A.view==='hub') render(); }catch(e){} }
document.addEventListener('click',e=>{ const b=e.target&&e.target.closest&&e.target.closest('[data-kl]'); if(!b) return; const k=b.getAttribute('data-kl'); if(k==='open'){ e.preventDefault(); open(''); } else if(k==='close'){ e.preventDefault(); close(); } });
window.addEventListener('message',e=>{ try{ const d=e.data; if(!d||typeof d!=='object'||(d.tlK!==1&&d.tlKDone!==1)) return;
  const f=document.querySelector('#klov iframe'); if(!f||e.source!==f.contentWindow) return;
  if(typeof A==='undefined'||!A.st||typeof saveStudent!=='function'||typeof SRV==='undefined') return;
  const skill=String(d.skill||''); if(IDS.indexOf(skill)<0) return;
  if(d.tlK===1){ const item=String(d.item||'').replace(/[^A-Za-z0-9 ()-]/g,'').slice(0,60)||'item', ph=d.phase==='check'?'check':'practice', first=!!d.first;
    SRV.pendingEv.push({at:Date.now(),student:A.st.id,skill:'KLESSON.'+skill,phase:ph,item:item,first:first,tries:first?1:2,hints:0,ms:0,ok:true});
    if(SRV.pendingEv.length>50) SRV.pendingEv.splice(0,SRV.pendingEv.length-50); }
  else { const ok=Math.max(0,Math.min(3,Math.round(Number(d.ok)||0))); const st=A.st; if(!st.klm||typeof st.klm!=='object') st.klm={}; st.klm[skill]=Math.max(Number(st.klm[skill])||0,ok); }
  clearTimeout(qT); qT=setTimeout(()=>{ qT=null; try{ saveStudent(A.st); }catch(x){} },2500);
}catch(err){ console.error('K lessons',err); } });
window.KL={ has:id=>IDS.indexOf(String(id))>=0, open:id=>open(String(id||'')), list:()=>LIST.slice(), on:()=>{ try{ return on(A.st); }catch(e){ return false; } } };
})();
</script>
'''
addon = addon.replace('__PAGE__', page_js).replace('__LIST__', json.dumps([[l[0], l[1]] for l in lessons], ensure_ascii=False))
body = addon.replace('<script>\n', '', 1).rsplit('</script>', 1)[0]
assert '//' not in body, [body[m.start()-40:m.start()+20] for m in re.finditer('//', body)][:3]
import re as _r; _bad=[body[m.start()-60:m.start()+30] for m in _r.finditer('</?script',body)]; assert not _bad, _bad
addon = kr(addon)
open(os.path.join(HERE, 'KKriyah.html'), 'w', encoding='utf-8').write(addon)

js = '''/* KLessonsServer.js — KINDERGARTEN MATH (KLessons.html add-on). Claude Code builder, 2026-11-18. Head of School: publish all of kindergarten live.
   klMe(token): the signed-in boy's roster grade (pfGrade_, "grade K" in the roster note -> 0), so the home shows the
   Kindergarten Math card only to K and 1st grade boys. Read only: no writes, no money, no mastery, no placement.
   Lesson results are saved by the app's own saveStudent/msSave (evidence rows, skill "KLESSON.<id>"); nothing new on the server for that. */
function klMe(token) {
  var s = msSession_(token);
  if (!s || s.role !== 'kid' || !s.sid) return { grade: null };
  var g = null;
  try { g = typeof pfGrade_ === 'function' ? pfGrade_({ id: String(s.sid) }, null) : null; } catch (e) { g = null; }
  return { grade: (g == null || isNaN(Number(g))) ? null : Number(g) };
}
'''
pass
print('ok', len(p), len(addon), ids)
