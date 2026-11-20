<script>
/* G3Math.html — 3rd GRADE MATH (Level 4), ALL 24 lessons, ALL 21 Level 2 lessons (K-3 overhaul S2a) in the new style (00 LESSON RULE). Claude Code builder, 2026-11-18.
   Head of School: "Let's do the full kindergarten curriculum ... with huge amounts of variety and games" and "I want it all to be published live."
   Built like KinderKriyah.html (v148/v197), which is live and proven:
     - the lesson page runs inside its own sealed frame (srcdoc, sandbox allow-scripts), so its styles never touch the app;
     - the page tells the app each finished item {tlK:1, skill, phase, item, first}; the app checks the message came from THIS frame
       and saves it as an evidence row, skill "KLESSON.<skill id>", through saveStudent/msSave. The server decides any pay (msCheckPay_),
       exactly like Kodesh Quest. Nothing here sets an amount. The "KLESSON." prefix keeps these rows OUT of grid mastery and placement.
     - at the end {tlKDone:1, skill, ok (0-3 on the check), stars}: the best check score is kept in the boy's state, st.g3m[skill].
   WHO SEES IT: the "Kindergarten Reading" card shows for boys whose roster grade is K or 1 (server klMe, read only), and for TEST- boys.
     SWITCH: window.G3_MATH_LIVE = true -> those boys; false -> TEST- boys only.
   FOR OTHER PARTS OF THE APP: window.G3M.has(skillId), window.G3M.open(skillId) opens that lesson directly (LessonPop / Today can call it).
   Voice: the Google English teacher voice (TTS-1), with the device voice as fallback. No Hebrew. No double slash in this file. */
(function(){
if(typeof render!=='function'||typeof A==='undefined') return;
window.G3_MATH_LIVE = true;
const PAGE=@@PAGE@@;
const LIST=[["MATH.OPS.L04.04", "MATH.OPS.L04.04"], ["MATH.OPS.L04.05", "MATH.OPS.L04.05"], ["MATH.OPS.L04.06", "MATH.OPS.L04.06"], ["MATH.OPS.L04.01", "MATH.OPS.L04.01"], ["MATH.OPS.L04.07", "MATH.OPS.L04.07"], ["MATH.OPS.L04.02", "MATH.OPS.L04.02"], ["MATH.OPS.L04.08", "MATH.OPS.L04.08"], ["MATH.PV.L04.01", "MATH.PV.L04.01"], ["MATH.OPS.L04.03", "MATH.OPS.L04.03"], ["MATH.OPS.L04.09", "MATH.OPS.L04.09"], ["MATH.FRAC.L04.02", "MATH.FRAC.L04.02"], ["MATH.FRAC.L04.01", "MATH.FRAC.L04.01"], ["MATH.FRAC.L04.03", "MATH.FRAC.L04.03"], ["MATH.FRAC.L04.04", "MATH.FRAC.L04.04"], ["MATH.FRAC.L04.05", "MATH.FRAC.L04.05"], ["MATH.ALG.L04.01", "MATH.ALG.L04.01"], ["MATH.MEAS.L04.01", "MATH.MEAS.L04.01"], ["MATH.MEAS.L04.02", "MATH.MEAS.L04.02"], ["MATH.MEAS.L04.03", "MATH.MEAS.L04.03"], ["MATH.MEAS.L04.04", "MATH.MEAS.L04.04"], ["MATH.MEAS.L04.05", "MATH.MEAS.L04.05"], ["MATH.STAT.L04.01", "MATH.STAT.L04.01"], ["MATH.GEO.L04.01", "MATH.GEO.L04.01"], ["MATH.MIX.L04.01", "MATH.MIX.L04.01"]];
const IDS=LIST.map(l=>l[0]);
let ME=null, qT=null;
function isTest(st){ return /^TEST-/.test(String(st&&st.id||'')); }
function on(st){ if(!st) return false; if(isTest(st)) return true; return !!(window.G3_MATH_LIVE&&ME&&ME.sid===st.id&&(typeof ME.grade==="number"&&ME.grade>=3&&ME.grade<=4)); }
function me(){ try{ const st=A.st; if(!st||(ME&&ME.sid===st.id)) return; const sid=st.id; ME={sid:sid,grade:null};
  if(typeof run!=='function'||typeof SRV==='undefined'||!SRV.token) return;
  run('klMe',SRV.token).then(r=>{ if(!ME||ME.sid!==sid) return; ME={sid:sid,grade:(r&&typeof r.grade==='number')?r.grade:null}; try{ if(A.view==='hub'&&A.st&&A.st.id===sid&&on(A.st)) render(); }catch(e){} }).catch(()=>{}); }catch(e){} }
function doneMap(st){ const m={}; try{ const k=st&&st.g3m; if(k&&typeof k==='object') IDS.forEach(id=>{ if(typeof k[id]==='number') m[id]=k[id]; }); }catch(e){} return m; }
try{ if(!document.getElementById('g3m-css')){ const s=document.createElement('style'); s.id='g3m-css'; s.textContent=`
.g3mcard{margin:14px 0;border-radius:24px;background:linear-gradient(135deg,#FFF6D8,#E8F6FF);border:3px solid #FFC83D;display:flex;align-items:center;gap:16px;padding:16px 20px;color:#1F2A44;box-shadow:0 6px 0 #EADFB8}
.g3mcard .ki{font-size:46px}.g3mcard .kt{flex:1}.g3mcard b{display:block;font-size:24px}.g3mcard small{font-size:16px;opacity:.85}
.g3mcard button{border:0;border-radius:18px;padding:14px 24px;font:inherit;font-weight:900;font-size:22px;background:#2FBF71;color:#fff;cursor:pointer;min-height:60px;box-shadow:0 5px 0 #1f8a51}
.g3mov{position:fixed;inset:0;z-index:2147483000;background:#FFF6D8;display:flex;flex-direction:column}
.g3mov .g3mbar{display:flex;justify-content:flex-end;padding:6px 10px;background:#FFF6D8}
.g3mov .g3mx{border:0;border-radius:14px;padding:10px 18px;font:inherit;font-weight:900;font-size:18px;background:#1F2A44;color:#fff;cursor:pointer;min-height:48px}
.g3mov iframe{flex:1;width:100%;border:0;background:#E8F6FF}`; document.head.appendChild(s); } }catch(e){}
const _find=window.tlFindLevelCard;
window.tlFindLevelCard=function(st){ let h=''; try{ h=_find?_find(st):''; }catch(e){}
  try{ me(); if(st&&A.view==='hub'&&on(st)){ const d=doneMap(st), n=Object.keys(d).length;
    h+='<section class="g3mcard" data-g3mcard="1"><span class="ki" aria-hidden="true">🗼</span><span class="kt"><b>3rd Grade Math</b><small>All 24 lessons: times tables, division, fractions, area, time and more.'+(n?' You finished '+n+' of 24.':'')+'</small></span><button type="button" data-g3m="open">Play</button></section>'; } }catch(e){}
  return h; };
function open(id){ close(true); const st=A&&A.st; const ov=document.createElement('div'); ov.className='g3mov'; ov.id='g3mov';
  ov.innerHTML='<div class="g3mbar"><button class="g3mx" type="button" data-g3m="close" aria-label="Close 3rd Grade Math">✕ Done</button></div><iframe title="3rd Grade Math" sandbox="allow-scripts" allow="autoplay"></iframe>';
  document.body.appendChild(ov);
  const pre='\u003cscript>window.KL_DONE='+JSON.stringify(doneMap(st))+';window.KL_OPEN='+JSON.stringify(IDS.indexOf(id)>=0?id:'')+';'+(window.KL_FAST?'window.KL_FAST=1;':'')+'\u003c/scr'+'ipt>';
  ov.querySelector('iframe').srcdoc=pre+PAGE; }
function close(quiet){ const o=document.getElementById('g3mov'); if(o) o.remove(); if(quiet) return; try{ if(qT){ clearTimeout(qT); qT=null; if(A.st&&typeof saveStudent==='function') saveStudent(A.st); } }catch(e){} try{ if(A.view==='hub') render(); }catch(e){} }
document.addEventListener('click',e=>{ const b=e.target&&e.target.closest&&e.target.closest('[data-g3m]'); if(!b) return; const k=b.getAttribute('data-g3m'); if(k==='open'){ e.preventDefault(); open(''); } else if(k==='close'){ e.preventDefault(); close(); } });
window.addEventListener('message',e=>{ try{ const d=e.data; if(!d||typeof d!=='object'||(d.tlK!==1&&d.tlKDone!==1)) return;
  const f=document.querySelector('#g3mov iframe'); if(!f||e.source!==f.contentWindow) return;
  if(typeof A==='undefined'||!A.st||typeof saveStudent!=='function'||typeof SRV==='undefined') return;
  const skill=String(d.skill||''); if(IDS.indexOf(skill)<0) return;
  if(d.tlK===1){ const item=String(d.item||'').replace(/[^A-Za-z0-9 ()-]/g,'').slice(0,60)||'item', ph=d.phase==='check'?'check':'practice', first=!!d.first;
    SRV.pendingEv.push({at:Date.now(),student:A.st.id,skill:'KLESSON.'+skill,phase:ph,item:item,first:first,tries:first?1:2,hints:0,ms:0,ok:true});
    if(SRV.pendingEv.length>50) SRV.pendingEv.splice(0,SRV.pendingEv.length-50); }
  else { const ok=Math.max(0,Math.min(3,Math.round(Number(d.ok)||0))); const st=A.st; if(!st.g3m||typeof st.g3m!=='object') st.g3m={}; st.g3m[skill]=Math.max(Number(st.g3m[skill])||0,ok); }
  clearTimeout(qT); qT=setTimeout(()=>{ qT=null; try{ saveStudent(A.st); }catch(x){} },2500);
}catch(err){ console.error('G3 math',err); } });
window.G3M={ has:id=>IDS.indexOf(String(id))>=0, open:id=>open(String(id||'')), list:()=>LIST.slice(), on:()=>{ try{ return on(A.st); }catch(e){ return false; } } };
})();
</script>
