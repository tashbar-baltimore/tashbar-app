/* Tashbar Learning: "Take a picture" answers (Head of School 2026-11-08). Made-up students only for now.
   A boy photographs his paper answer. The photo is saved to Drive ("Tashbar Photos/<student id>/date_skill_item.jpg"),
   Drive reads it (OCR through the Advanced Drive Service), and the text is compared with the expected answer.
   - Clear match: marked right at once; the boy's normal answer flow pays through the ledger (Money.gs).
   - No clear match: status "waiting". Never marked wrong automatically.
   Waiting photos are listed in "Tashbar Photos/_check/waiting_photos.json" every 15 minutes. A scheduled Claude task
   (or a person) writes "results_*.json" files into "_check"; the 15-minute trigger applies them and moves them to "_check/done".
   Teacher check on the staff page is built in and switched OFF (PHOTO_TEACHER_REVIEW). */
var PHOTO = {
  ROOT_ID: '1WlTfKyp0jgEKOS27aWse_C3XjiQ0D19f',     /* Shared Drive: Tashbar Photos */
  CHECK_ID: '1XprOUZv1Hn5OXbYCeZtemUYiOt_sxByw',    /* Tashbar Photos/_check */
  DONE_ID: '1f_Unmdc-FOKj7JDN_yPaIogSLvHvXf-1',     /* Tashbar Photos/_check/done */
  TAB: 'MS_Photos',
  HEAD: ['photoId', 'at', 'studentId', 'skill', 'item', 'prompt', 'expected', 'driveFileId', 'ocrText', 'status', 'checkedBy', 'note', 'paidAt'],
  MAX_BYTES: 4 * 1024 * 1024
};
var PHOTO_TEACHER_REVIEW = false;   /* true = staff page (?ms=1&staff=1) shows "Photos to check" with Right / Not yet */

function photoTab_() {
  var ss = msBook_(), sh = ss.getSheetByName(PHOTO.TAB);
  if (!sh) { sh = ss.insertSheet(PHOTO.TAB); sh.getRange(1, 1, 1, PHOTO.HEAD.length).setValues([PHOTO.HEAD]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function photoRows_() {
  var sh = photoTab_(), n = sh.getLastRow();
  if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, PHOTO.HEAD.length).getValues().map(function (r, i) {
    var o = { row: i + 2 }; PHOTO.HEAD.forEach(function (h, k) { o[h] = r[k]; }); return o;
  }).filter(function (o) { return o.photoId; });
}
function photoSet_(row, fields) {
  var sh = photoTab_();
  Object.keys(fields).forEach(function (k) { var c = PHOTO.HEAD.indexOf(k); if (c >= 0) sh.getRange(row, c + 1).setValue(fields[k]); });
}
function photoStudentFolder_(sid) {
  var root = DriveApp.getFolderById(PHOTO.ROOT_ID), it = root.getFoldersByName(sid);
  return it.hasNext() ? it.next() : root.createFolder(sid);
}

/* ---------- reading the photo ---------- */
function photoOcr_(fileId) {
  var doc = Drive.Files.copy({ name: 'ocr-tmp-' + fileId, mimeType: MimeType.GOOGLE_DOCS, parents: [PHOTO.CHECK_ID] }, fileId,
    { ocrLanguage: 'en', supportsAllDrives: true });
  try { return DocumentApp.openById(doc.id).getBody().getText().slice(0, 4000); }
  finally { try { DriveApp.getFileById(doc.id).setTrashed(true); } catch (e) {} }
}
function photoNorm_(s) {
  return String(s || '').toLowerCase()
    .replace(/[⁄∕]/g, '/').replace(/[½]/g, ' 1/2').replace(/[¼]/g, ' 1/4').replace(/[¾]/g, ' 3/4')
    .replace(/[$¢°%]/g, ' ')
    .replace(/\b(cents?|dollars?|inches|inch|in|feet|foot|ft|yards?|yd|miles?|mi|cm|mm|km|m|kg|g|lbs?|oz|ml|l|units?|sq|square|degrees?|hours?|hrs?|minutes?|min|seconds?|sec)\b/g, ' ')
    .replace(/(\d),(\d{3})/g, '$1$2').replace(/\s*\/\s*/g, '/').replace(/\s*r\s*(\d)/g, 'r$1')
    .replace(/\s+/g, ' ').trim();
}
function photoVal_(t) {
  t = String(t).trim(); var m;
  if ((m = /^(\d+) (\d+)\/(\d+)$/.exec(t))) return +m[1] + (+m[2]) / (+m[3] || NaN);
  if ((m = /^(\d+)\/(\d+)$/.exec(t))) return (+m[1]) / (+m[2] || NaN);
  return Number(t);
}
/* true only on a clear match: the last number written, or a number right after "=" or "answer", equals the expected answer */
function photoMatch_(ocr, expected) {
  var e = photoNorm_(expected), o = photoNorm_(ocr);
  if (!e || !o) return false;
  if (o.replace(/\s/g, '') === e.replace(/\s/g, '')) return true;
  if (/^\d+r\d+$/.test(e.replace(/\s/g, ''))) {
    var rems = o.replace(/\s/g, '').match(/\d+r\d+/g) || []; return rems.length > 0 && rems[rems.length - 1] === e.replace(/\s/g, '');
  }
  var ev = photoVal_(e); if (!isFinite(ev)) return false;
  var re = /\d+ \d+\/\d+|\d+\/\d+|\d*\.\d+|\d+/g, toks = o.match(re) || [];
  if (!toks.length) return false;
  var cands = [toks[toks.length - 1]], m, r2 = /(=|answer|ans)\s*:?\s*(\d+ \d+\/\d+|\d+\/\d+|\d*\.\d+|\d+)/g;
  while ((m = r2.exec(o))) cands.push(m[2]);
  return cands.some(function (t) { var v = photoVal_(t); return isFinite(v) && Math.abs(v - ev) < 1e-6; });
}

function photoSaveHere_(sid, name, b64) {
  var bytes = Utilities.base64Decode(b64); if (bytes.length > PHOTO.MAX_BYTES) throw new Error('That picture is too big. Please try again.');
  var file = photoStudentFolder_(sid).createFile(Utilities.newBlob(bytes, 'image/jpeg', name)), text = '', note = '';
  try { text = photoOcr_(file.getId()); } catch (e) { note = 'reader error: ' + String(e.message || e).slice(0, 120); }
  return { fileId: file.getId(), text: text, note: note };
}
/* ---------- call from the boy's page ---------- */
/* item = "<phase>|<question text>" (the same key the answer flow uses). expected '' = writing (the text fills his box). */
function msPhotoSubmit(token, sid, skill, item, prompt, expected, dataUrl) { tlGuard_(token, sid);
  var sess = msSession_(token); sid = String(sid || '');
  if (!msCanSee_(sess, sid)) throw new Error('Not allowed.');
  if (!msRoster_().some(function (r) { return r.id === sid; })) throw new Error('Unknown student.');
  skill = String(skill || '').slice(0, 40); item = String(item || '').slice(0, 135); prompt = String(prompt || '').slice(0, 300); expected = String(expected || '').slice(0, 60);
  var m = /^data:image\/(jpeg|jpg|png);base64,(.+)$/.exec(String(dataUrl || ''));
  if (!m) throw new Error('That picture did not come through. Please try again.');
  if (m[2].length * 3 / 4 > PHOTO.MAX_BYTES) throw new Error('That picture is too big. Please try again.');
  var day = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd_HHmmss');
  var safe = function (s) { return String(s).replace(/[^A-Za-z0-9-]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'x'; };
  var name = day + '_' + safe(skill) + '_' + safe(item.split('|').slice(1).join(' ')) + '.jpg';
  /* saving the picture and reading it need Google Drive: done by the Apps Script app (photoSaveHere_); the record is kept here */
  var saved = typeof TL_REMOTE_ === 'function' ? TL_REMOTE_('photoSave', [sid, name, m[2]]) : photoSaveHere_(sid, name, m[2]);
  var file = { getId: function () { return saved.fileId; } };
  var text = saved.text || '', status = 'waiting', note = saved.note || '';
  if (!expected) { status = text.trim() ? 'right' : 'waiting'; note = note || 'writing: text put in their box'; }
  else if (photoMatch_(text, expected)) status = 'right';
  var id = 'ph-' + Utilities.getUuid().slice(0, 13);
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    photoTab_().appendRow([id, new Date(), sid, skill, item, prompt, expected, file.getId(), text, status, status === 'right' ? 'reader' : '', note, '']);
  } finally { lock.releaseLock(); }
  return { ok: true, photoId: id, status: status, text: expected ? '' : text.slice(0, 3000) };
}

/* Notes for the boy on photos that were checked later (shown once on his home screen). */
function msPhotoNotes(token) {
  var sess = msSession_(token); if (sess.role !== 'kid') return [];
  var since = Date.now() - 7 * 864e5;
  return photoRows_().filter(function (o) { return String(o.studentId) === sess.sid && (o.checkedBy === 'claude' || o.checkedBy === 'teacher') && new Date(o.at).getTime() > since; })
    .slice(-10).map(function (o) { return { id: o.photoId, status: String(o.status), note: String(o.note || ''), skill: String(o.skill), prompt: String(o.prompt).slice(0, 80) }; });
}

/* ---------- applying a mark (Claude results file, or a teacher) ---------- */
/* right -> pay the right answer through the ledger (same key as a typed answer, so it never pays twice);
   for a check question, also pay "Mastered" if this was the missing third check. wrong -> encouraging note only. */
function photoApply_(o, mark, note, by) {
  if (!o || String(o.status) !== 'waiting') return false;
  var sid = String(o.studentId), skill = String(o.skill), item = String(o.item), phase = item.split('|')[0];
  if (mark === 'right') {
    var prefix = 'ms:' + sid + ':';
    moneyEarn_(sid, 'correct', prefix + 'ok:' + skill + '|' + item, skill, '', 'Correct answer (photo) · ' + skill);
    var es = msTab_('evidence');
    es.appendRow([new Date(), sid, skill, phase, item.split('|').slice(1).join('|').slice(0, 120), 1, 0, 1, 0, 0]);
    if (phase === 'check') {
      var checks = msRows_('evidence').filter(function (r) { return String(r[1]) === sid && String(r[2]) === skill && r[3] === 'check' && r[5] == 1; }).length;
      var st = msRows_('state').filter(function (r) { return String(r[0]) === sid; })[0], mastered = false;
      try { var js = st ? JSON.parse(st[1]) : {}; mastered = !!(js.skills && js.skills[skill] && js.skills[skill].m); } catch (e) {}
      if (mastered && checks >= 3) moneyEarn_(sid, 'msSkillMastered', prefix + 'Mastered ' + skill, skill, '', 'Mastered ' + skill);
    }
    moneyDailyGoal_(sid); moneyStreak_(sid);
    photoSet_(o.row, { status: 'right', checkedBy: by, note: String(note || 'Right!').slice(0, 200), paidAt: new Date() });
  } else {
    photoSet_(o.row, { status: 'wrong', checkedBy: by, note: String(note || 'Not quite yet. Look at it again with your teacher. You can do this!').slice(0, 200) });
  }
  return true;
}

/* ---------- 15-minute trigger ---------- */
function photoCron() {
  /* The school's records live on Firebase now: this runs there (every 15 minutes), asking the Apps Script app only for the Drive files.
     On Apps Script itself it does nothing, so marks and money are never written to the old Sheets. */
  if (typeof TL_REMOTE_ !== 'function') return { skipped: 'runs on Firebase' };
  var lock = LockService.getScriptLock(); lock.waitLock(25000);
  try {
    var files = TL_REMOTE_('photoResults', []), rows = null, applied = 0, used = [];
    files.forEach(function (f) {
      rows = rows || photoRows_();
      var list = [];
      try { list = JSON.parse(f.text); if (!Array.isArray(list)) list = list && list.results || []; } catch (e) { list = []; }
      list.slice(0, 500).forEach(function (r) {
        var mark = String(r && r.mark || '').toLowerCase(); if (mark !== 'right' && mark !== 'wrong') return;
        var o = rows.filter(function (x) { return x.photoId === String(r.photoId || ''); })[0];
        if (photoApply_(o, mark, String(r.note || ''), 'claude')) { o.status = mark; applied++; }
      });
      used.push(f.id);
    });
    var waiting = photoRows_().filter(function (o) { return String(o.status) === 'waiting'; }).map(function (o) {
      return { photoId: o.photoId, driveFileId: o.driveFileId, prompt: String(o.prompt), expected: String(o.expected) };
    });
    if (used.length) TL_REMOTE_('photoDone', [used]);
    TL_REMOTE_('photoWaiting', [JSON.stringify(waiting, null, 1)]);
    return { applied: applied, waiting: waiting.length };
  } finally { lock.releaseLock(); }
}
/* Run once from the editor: installs the 15-minute trigger (no duplicates). */
function photoInstall() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'photoCron') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('photoCron').timeBased().everyMinutes(15).create();
  photoTab_();
  return photoCron();
}

/* ---------- teacher check (switched OFF unless PHOTO_TEACHER_REVIEW = true) ---------- */
function msPhotoReviewOn() { return PHOTO_TEACHER_REVIEW === true; }
function msPhotoList(token) {
  var sess = msSession_(token); if (sess.role !== 'staff' || !PHOTO_TEACHER_REVIEW) return [];
  return photoRows_().filter(function (o) { return String(o.status) === 'waiting'; }).slice(0, 20).map(function (o) {
    var img = ''; try { var b = DriveApp.getFileById(o.driveFileId).getBlob(); img = 'data:image/jpeg;base64,' + Utilities.base64Encode(b.getBytes()); } catch (e) {}
    return { photoId: o.photoId, studentId: String(o.studentId), skill: String(o.skill), prompt: String(o.prompt), expected: String(o.expected), ocrText: String(o.ocrText).slice(0, 500), img: img };
  });
}
function msPhotoMark(token, photoId, mark) {
  var sess = msSession_(token); if (sess.role !== 'staff' || !PHOTO_TEACHER_REVIEW) throw new Error('Staff only.');
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var o = photoRows_().filter(function (x) { return x.photoId === String(photoId); })[0];
    return { ok: photoApply_(o, mark === 'right' ? 'right' : 'wrong', mark === 'right' ? 'Right!' : 'Not yet. Let’s look at it together.', 'teacher') };
  } finally { lock.releaseLock(); }
}

/* Quest add-on (✍️ Write it + 📷 Take a picture). Served by msQuestTools() and run by QuestPage.html after start,
   so QuestPage.html stays under the Apps Script page size limit (~256 KB; the page goes blank above it). */
var QUEST_TOOLS = {
  css: "\n.phtools{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-top:14px}\n.phtools .btn.phbig{font-size:20px!important;padding:14px 24px!important;min-height:56px}\n.wrhint{background:none;border:0;color:var(--soft);font:600 15px var(--body,inherit);cursor:pointer;text-decoration:underline;padding:6px}\n.phbox{margin-top:14px;text-align:center}.phprev{max-width:100%;max-height:46vh;border-radius:14px;border:3px solid var(--line)}\n.phbtns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:12px}.phmsg{font-weight:700}\n",
  js: "\nfunction tlPT(){ const ph=A.photo;\n if(ph&&ph.busy) return '<div class=\"phbox\"><p class=\"phmsg\">Sending your picture…</p></div>';\n if(ph&&ph.url) return `<div class=\"phbox\"><img class=\"phprev\" src=\"${ph.url}\" alt=\"Your picture\"><div class=\"phbtns\"><button class=\"btn go big\" data-act=\"photosend\">Send</button><button class=\"btn big\" data-act=\"photoretake\">Retake</button><button class=\"btn\" data-act=\"photocancel\">Cancel</button></div></div>`;\n return '<div class=\"phtools\"><button type=\"button\" class=\"btn phbig\" data-act=\"photo\">📷 Take a picture</button><button type=\"button\" class=\"wrhint\" data-act=\"writeit\" title=\"Write with your stylus\">✍️ Write it</button></div>'; }\nfunction tlWriteIt(){ const box=document.getElementById('numin')||document.getElementById('wr'); if(box){ box.focus(); } toast('Write with your stylus: on the keyboard that pops up, tap the ✍️ pen key.'); }\nfunction tlPhotoPick(){ let inp=document.getElementById('phin'); if(!inp){ inp=document.createElement('input'); inp.type='file'; inp.accept='image/*'; inp.setAttribute('capture','environment'); inp.id='phin'; inp.style.display='none'; document.body.appendChild(inp);\n  inp.addEventListener('change',()=>{ const f=inp.files&&inp.files[0]; inp.value=''; if(!f) return; const img=new Image(), u=URL.createObjectURL(f);\n   img.onload=()=>{ const k=Math.min(1,1600/Math.max(img.width,img.height)), c=document.createElement('canvas'); c.width=Math.round(img.width*k); c.height=Math.round(img.height*k); c.getContext('2d').drawImage(img,0,0,c.width,c.height); URL.revokeObjectURL(u); A.photo={url:c.toDataURL('image/jpeg',0.82),at:A.play&&A.play.i}; render(); };\n   img.onerror=()=>{ URL.revokeObjectURL(u); toast('That picture didn’t open. Try again.'); }; img.src=u; }); }\n inp.click(); }\nfunction tlPhotoSend(){ const p=A.play, ph=A.photo; if(!p||!ph||!ph.url||ph.busy) return; const it=p.items[p.i], st=A.st, write=it.t==='write';\n ph.busy=true; render();\n run('msPhotoSubmit',SRV.token,st.id,it.skill||p.id,(it.phase||'')+'|'+it.q.slice(0,80),it.q.slice(0,300),write?'':fracOrNum(it),ph.url).then(r=>{\n  A.photo=null;\n  if(write){ if(r&&r.text){ p.text=((p.text||'').trim()+'\\n'+r.text).trim(); render(); toast('Your writing is in the box. Check it, tick the boxes, then turn it in.'); } else { render(); toast('Got it! Your picture is being checked. You can also type here.'); } return; }\n  if(r&&r.status==='right') return answer(fracOrNum(it));\n  p.tries++; p.results[p.i]={ok:true,pending:true,first:false,tries:p.tries,phase:it.phase,skill:it.skill||p.id,q:it.q.slice(0,80)};\n  p.fb={ok:true,cheer:'Got it! Your answer is being checked. You’ll see it in your bank soon.'}; render();\n }).catch(e=>{ A.photo=null; render(); toast('Couldn’t send the picture. Check the Wi-Fi and try again.'); }); }\nfunction tlPhotoNotes(){ if(!SRV.token) return; run('msPhotoNotes',SRV.token).then(list=>{ let seen=[]; try{ seen=JSON.parse(localStorage.getItem('tl-phseen')||'[]'); }catch(e){}\n  const fresh=(list||[]).filter(x=>seen.indexOf(x.id)<0); if(!fresh.length) return; const x=fresh[0];\n  toast(x.status==='right'?`Your photo answer was checked: right! It’s in your bank.`:`Your photo answer was checked. ${x.note}`);\n  try{ localStorage.setItem('tl-phseen',JSON.stringify(seen.concat(fresh.map(y=>y.id)).slice(-200))); }catch(e){} }).catch(()=>{}); }\nwindow.TLT={tools:tlPT,notes:tlPhotoNotes,acts:{writeit:tlWriteIt,photo:tlPhotoPick,photoretake:()=>{ A.photo=null; tlPhotoPick(); },photosend:tlPhotoSend,photocancel:()=>{ A.photo=null; render(); }}};\n"
};
function msQuestToolsBody_() {
  /* TL-038: MathMore.html (Math Levels 4+) rides along with the Quest tools, in its own eval so an error there cannot break Write it / Take a picture. */
  var mm = '', rm = '', sm = '';
  try { rm = tlFileText_('ReadMore').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* TL-041: Reading lessons, own eval */
  try { sm = tlFileText_('ScienceMore').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { sm += '\n' + tlFileText_('ScienceMore2').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* SCI-PAGE 2026-11-10: Science lessons, own eval, after ReadMore */
  var el = ''; try { el = tlFileText_('ElectivesMore').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v50: Electives (Nuclear Science first), own eval, after ScienceMore */
  var ffm = ''; try { ffm = tlFileText_('FactsMore').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v161: Fact Finders K-12 (needs BANK_ALL, startMission, tlFindLevelCard), eval right after ElectivesMore */
  var agd = ''; try { agd = tlFileText_('AnswerGuard').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v164: AnswerGuard (no box, example or hint may show THIS question's answer), eval right after FactsHowTo; also in Speed.js TL_PART_FILES */
  var ffh = ''; try { ffh = tlFileText_('FactsHowTo').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v161: Fact Finders How to do it, eval right after HowToDo */
  try { mm = tlFileText_('MathMore').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {}
  var mo = ''; try { mo = tlFileText_('Motivation').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* UPGRADE Phase 3 2026-11-10: motivation (goal bar, combo, kind misses, quest, streaks, level-up, bests, mystery, weekly replay, Shabbos page) */
  var jj = ''; try { jj = tlFileText_('JokeJar').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v117: Joke Jar + Joke Book + cheers (DECISION 1726), after Motivation so it wraps p3Ans */
  var sml = ''; try { sml = tlFileText_('SimchaLife').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v119: B'Simcha morning vort + Chizuk Minute (CHANGE 1632), TEST boys first */
  var trb = ''; try { trb = tlFileText_('TalkRebbe').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v128: Talk to my Rebbe or Teacher (DECISION 2230) */
  var kqp = ''; try { kqp = tlFileText_('KodeshQuestPage').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { kqp += '\n' + tlFileText_('KodeshArt2').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v285: KodeshQuestPage pack hit the upload size, so new Kodesh art goes in KodeshArt2, joined right after it (like HowToDo2) */ /* v178: Kodesh Quest page (pack), right before KinderKriyah. Also in Speed.js. */
  var kkr = ''; try { kkr = tlFileText_('KinderKriyah').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v133: Kinder Kriyah letter games (CHANGE 2116) */
  var gd = ''; try { gd = tlFileText_('Guides').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* UPGRADE Phase 4 2026-11-10: guide characters Rabbi K and Rabbi S */
  var px = ''; try { px = tlFileText_('Pictures').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* UPGRADE Phase 4 2026-11-10: pictures for key words on every lesson screen */
  var mu = ''; try { mu = tlFileText_('Music').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { mu += '\n' + tlFileText_('EnergyMusic').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* 2026-11-18 HoS: ENERGY MUSIC, 54 high-energy songs (same part as Music) */ /* UPGRADE Phase 5 2026-11-10: real music + sound effects */
  var trd = ''; try { trd = tlFileText_('TradesMore').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v54: Trades panel (Spark Path · Electricity) */
  var cpm = ''; try { cpm = tlFileText_('ComputingMore').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v64: Computing lessons + home panel, after TradesMore */
  var lfm = ''; try { lfm = tlFileText_('LifeMore').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v76: Life and Money lessons + home panel */
  var kdm = ''; try { kdm = tlFileText_('KodeshMore').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v88: Limudei Kodesh lessons + home panel (own subject LK) */
  var smm = ''; try { smm = tlFileText_('SimchaMore').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v116: B'Simcha lessons + home panel (own subject SIM, TEST- boys only via SIM_LIVE) */
  var ssm = ''; try { ssm = tlFileText_('SocialMore').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* Social Studies lessons (SS L1 v2 + L2) + home panel, after LifeMore */
  var shn = ''; try { shn = tlFileText_('Shine').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v67: boy-page visual polish */
  var hlp = ''; try { hlp = tlFileText_('Helpers').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v68: Report a problem (and later boy helpers) */
  var rvw = ''; try { rvw = tlFileText_('Review').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v69: spaced review */
  var adp = ''; try { adp = tlFileText_('Adapt').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v70: fast track + step back */
  var htd = ''; try { htd = tlFileText_('HowToDo').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { htd += '\n' + tlFileText_('HowToDo2').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { htd += '\n' + tlFileText_('HowToDo3').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v291: HowToDo2 reached the upload size; new How-to blocks go in HowToDo3, joined right after it */ /* v139: HowToDo was split in two (upload size); part 2 runs right after part 1 */ /* v52: How to do it on every question (Island Rule) */
  var hpl = ''; try { hpl = tlFileText_('HomePlus').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v148: HomePlus = new boy home (plan, adventures, what's new) + splash, big cursor, cha-ching; before ClassMode so ClassMode still wraps everything */
  var sto = ''; try { sto = tlFileText_('StoreKid').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v164: Tashbar Store + cash on every screen + paycheck + payday (Store.js), right after HomePlus. Also listed in Speed.js TL_PART_FILES. */
  var akt = ''; try { akt = tlFileText_('Activities').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v167: lesson-page engine upgrade (sort, pairs, type, spotall, Why? card, try together, warm-up, unknown-type guard). Also in Speed.js. */
  var kmo = ''; try { kmo = tlFileText_('KindsMore').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { kmo += '\n' + tlFileText_('KindsMore2').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { kmo += '\n' + tlFileText_('KindsMore3').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v312 (takeover4): the Kodesh blocks (Chumash/Torah Tracks Teacher Time, TL_HOWFILL, TL_K2_HEB, TL_SRC) moved out of KindsMore into KindsMore3, joined last; state proven identical */ /* v309: KindsMore reached the upload size; new END-of-KindsMore blocks go in KindsMore2, joined right after it (also in Speed.js) */ /* v179: KindsMore (pack) = one new-kind item + How-to box for 214 skills, right after Activities. Also in Speed.js. */
  var rpk = ''; try { rpk = tlFileText_('RebbePick').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v182: From my rebbe (picked lessons + shout-outs, StaffNotes.js), after KindsMore, before ClassMode. Also in Speed.js TL_PART_FILES. */
  var ohv = ''; try { ohv = tlFileText_('OlamHaba').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v191: Olam Haba cloud (every answer = effort = light; Kodesh brighter), after RebbePick, before ClassMode. Also in Speed.js TL_PART_FILES. */
  var tpl = ''; try { tpl = tlFileText_('TorahPlus').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v197: TorahPlus (Shabbos/Yom Tov, davening, Parsha, Torah scroll), after OlamHaba, before ClassMode. Also in Speed.js. */
  var chp = ''; try { chp = tlFileText_('ChumashPage').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v199: the Chumash page (all 54 parshiyos, every word; Chumash.js), after TorahPlus, before ClassMode. Also in Speed.js. */
  var krm = ''; try { krm = tlFileText_('KriyahMore').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v203: the nekudos (Kriyah K3), after ChumashPage, before ClassMode. Also in Speed.js. */
  var ttk = ''; try { ttk = tlFileText_('TorahTracks').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { ttk += '\n' + tlFileText_('TaryagQuest').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* Taryag Quest (lane T, all 613 mitzvos in the Rambam's order), joined right after TorahTracks (also in Speed.js) */ /* v204: Torah Tracks (Halacha, Tefillah, Yom Tov, Middos, Parsha, Navi), after KriyahMore, before ClassMode. Also in Speed.js. */
  var arn = ''; try { arn = tlFileText_('ArenaPage').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v212: Chavrusa Arena (duels in every subject; Arena.js), after TorahTracks. Also in Speed.js. */
  var tmx = ''; try { tmx = tlFileText_('ClassMode').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v51: Teacher mode lock on the boy page, LAST so it wraps everything */
  var hlf = ''; try { hlf = tlFileText_('HomeLift').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v208: HomeLift (chizuk band, no empty space, Olam Haba white-and-gold cloud), LAST, after ClassMode. Also in Speed.js TL_PART_FILES. */
  var lwy = ''; try { lwy = tlFileText_('LearnWays').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* v243: LearnWays (practice questions asked a different way by age and form), LAST, after HomeLift. Also in Speed.js TL_PART_FILES. */
  var dpt = ''; try { dpt = tlFileText_('DailyPath').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* PF stage D: DailyPath (daily path from the Pathfinder profile, quick climb moments; TEST boys with a profile only), LAST, after LearnWays. Also in Speed.js TL_PART_FILES. */
  var blb = ''; try { blb = tlFileText_('BoyLibrary').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { blb += '\n' + tlFileText_('HomeLayout').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { blb += '\n' + tlFileText_('MasteryReview').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { blb += '\n' + tlFileText_('WelcomeJoy').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { blb += '\n' + tlFileText_('HomeFocus').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { blb += '\n' + tlFileText_('LessonPop').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { blb += '\n' + tlFileText_('LearnFlow').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { blb += '\n' + tlFileText_('VoicePro').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* HoS 2026-11-18: VoicePro (natural Google voice for all speech, Litvish letter sounds), after LearnFlow (also in Speed.js) */ try { blb += '\n' + tlFileText_('WorldThemeUI').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { blb += '\n' + tlFileText_('KMathGamesUI').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { blb += '\n' + tlFileText_('K1LettersUI').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} try { blb += '\n' + tlFileText_('LblGateUI').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* LEARN BY LEVEL (HoS DECISION 2245-ET): age worlds, K-1 games, Today + nothing above level (TEST boys until TL_LBL_LIVE). Also in Speed.js. */ /* HoS 2026-11-18: LearnFlow (Learn-first card, Help me, clean question cards), after LessonPop (also in Speed.js) */ /* HoS 2026-11-18: LessonPop (bright lesson screens, CSS only), after HomeFocus (also in Speed.js) */ /* HoS 2026-11-17: HomeFocus (three doors: calm home, bright pop-ups), after WelcomeJoy (also in Speed.js) */ /* HoS 2026-11-17: WelcomeJoy (bright celebration welcome, fanfare, Happy Mix on Let's go), after MasteryReview (also in Speed.js) */ /* HoS TEACHING RULE (DECISION 1005-ET): spaced review until automatic + review in every lesson (MasteryReview.html, MR_LIVE), after HomeLayout (also in Speed.js) */ /* HOME-OVERHAUL: organized home + Library v2 (TEST- boys only, HOME_LAYOUT_LIVE), joined LAST after BoyLibrary (also in Speed.js) */ /* Library: My Library on the boy's home screen (Library.js libMyLibrary; LIB.BOY_LIVE), LAST, after DailyPath. Also in Speed.js TL_PART_FILES. */
  var rpx = ''; try { rpx = tlFileText_('RealPics').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* PICS-1 2026-11-18: real pictures with a box, arrow and label (RealPics.html), after KLessons */
  var krx = ''; try { krx = tlFileText_('KReading').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* Kindergarten Reading lessons (KReading.html), right after KLessons, own eval (also in Speed.js) */
  var klx = ''; try { klx = tlFileText_('KLessons').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* Kindergarten Math lessons (KLessons.html), loaded last, own eval */
  var sfitx = ''; try { sfitx = tlFileText_('ScreenFit').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* SCREEN-FIT safety net (ScreenFit.html, yosef@ audit 2026-11-18 0945-ET): a full-screen box that does not fit scrolls, loaded last */
  var kkx = ''; try { kkx = tlFileText_('KKriyah').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* Kriyah nekudos lessons (KKriyah.html), loaded last, own eval */
  var g1x = ''; try { g1x = tlFileText_('G1Math').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* 1st Grade Math lessons (G1Math.html), loaded last, own eval */
  var g1rx = ''; try { g1rx = tlFileText_('G1Reading').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* 1st Grade Reading lessons (G1Reading.html), loaded last, own eval */
  var g2x = ''; try { g2x = tlFileText_('G2Math').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* 2nd Grade Math lessons (G2Math.html), loaded last, own eval */
  var g2rx = ''; try { g2rx = tlFileText_('G2Reading').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* 2nd Grade Reading lessons (G2Reading.html), loaded last, own eval */
  var g3x = ''; try { g3x = tlFileText_('G3Math').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* 3rd Grade Math lessons (G3Math.html), loaded last, own eval */
  var g3rx = ''; try { g3rx = tlFileText_('G3Reading').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* 3rd Grade Reading lessons (G3Reading.html), loaded last, own eval */
  var klnx = ''; try { klnx = tlFileText_('KLearn').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* one Learn door (KLearn.html), loaded last, own eval */
  var kscx = ''; try { kscx = tlFileText_('KScience').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* Kindergarten Science and World lessons (KScience.html), loaded last, own eval */
  var kwrtx = ''; try { kwrtx = tlFileText_('KWriting').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* Kindergarten Writing lessons (KWriting.html), loaded last, own eval */
  var g1sctx = ''; try { g1sctx = tlFileText_('G1Science').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* 1st Grade Science and World lessons (G1Science.html), loaded last, own eval */
  var g1wrtx = ''; try { g1wrtx = tlFileText_('G1Writing').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* 1st Grade Writing lessons (G1Writing.html), loaded last, own eval */
  var g2sctx = ''; try { g2sctx = tlFileText_('G2Science').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* 2nd Grade Science and World lessons (G2Science.html), loaded last, own eval */
  var g2wrtx = ''; try { g2wrtx = tlFileText_('G2Writing').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* 2nd Grade Writing lessons (G2Writing.html), loaded last, own eval */
  var g3sctx = ''; try { g3sctx = tlFileText_('G3Science').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* 3rd Grade Science and World, 30 lessons lessons (G3Science.html), loaded last, own eval */
  var g3wrtx = ''; try { g3wrtx = tlFileText_('G3Writing').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* 3rd Grade Writing, 9 lessons lessons (G3Writing.html), loaded last, own eval */
  var keltx = ''; try { keltx = tlFileText_('KElectives').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* Think, Talk, Sing and Draw, 40 elective lessons lessons (KElectives.html), loaded last, own eval */
  var algx = ''; try { algx = tlFileText_('AlgebraAscent').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} /* Algebra Ascent, 73 algebra lessons for grades 7-8 (AlgebraAscent.html), loaded last, own eval */
  var ck = ''; try { ck = tlFileText_('CanteenKid').replace(/^\s*<script>/,'').replace(/<\/script>\s*$/,''); } catch (e) {} return { css: QUEST_TOOLS.css, js: QUEST_TOOLS.js + '\n;try{(0,eval)(' + JSON.stringify(ck) + ');}catch(e){console.error("CanteenKid",e);}' + '\n;try{(0,eval)(' + JSON.stringify(mm) + ');}catch(e){console.error("MathMore",e);}' + '\n;try{(0,eval)(' + JSON.stringify(rm) + ');}catch(e){console.error("ReadMore",e);}' + '\n;try{(0,eval)(' + JSON.stringify(sm) + ');}catch(e){console.error("ScienceMore",e);}' + '\n;try{(0,eval)(' + JSON.stringify(el) + ');}catch(e){console.error("ElectivesMore",e);}' + '\n;try{(0,eval)(' + JSON.stringify(ffm) + ');}catch(e){console.error("FactsMore",e);}' + '\n;try{(0,eval)(' + JSON.stringify(trd) + ');}catch(e){console.error("TradesMore",e);}try{(0,eval)(' + JSON.stringify(cpm) + ');}catch(e){console.error("ComputingMore",e);}try{(0,eval)(' + JSON.stringify(lfm) + ');}catch(e){console.error("LifeMore",e);}try{(0,eval)(' + JSON.stringify(ssm) + ');}catch(e){console.error("SocialMore",e);}try{(0,eval)(' + JSON.stringify(kdm) + ');}catch(e){console.error("KodeshMore",e);}try{(0,eval)(' + JSON.stringify(smm) + ');}catch(e){console.error("SimchaMore",e);}try{(0,eval)(' + JSON.stringify(shn) + ');}catch(e){console.error("Shine",e);}try{(0,eval)(' + JSON.stringify(hlp) + ');}catch(e){console.error("Helpers",e);}try{(0,eval)(' + JSON.stringify(rvw) + ');}catch(e){console.error("Review",e);}try{(0,eval)(' + JSON.stringify(adp) + ');}catch(e){console.error("Adapt",e);}' + '\n;try{(0,eval)(' + JSON.stringify(mo) + ');}catch(e){console.error("Motivation",e);}' + '\n;try{(0,eval)(' + JSON.stringify(jj) + ');}catch(e){console.error("JokeJar",e);}' + '\n;try{(0,eval)(' + JSON.stringify(sml) + ');}catch(e){console.error("SimchaLife",e);}' + '\n;try{(0,eval)(' + JSON.stringify(trb) + ');}catch(e){console.error("TalkRebbe",e);}' + '\n;try{(0,eval)(' + JSON.stringify(kqp) + ');}catch(e){console.error("KodeshQuestPage",e);}' + '\n;try{(0,eval)(' + JSON.stringify(kkr) + ');}catch(e){console.error("KinderKriyah",e);}' + '\n;try{(0,eval)(' + JSON.stringify(gd) + ');}catch(e){console.error("Guides",e);}' + '\n;try{(0,eval)(' + JSON.stringify(px) + ');}catch(e){console.error("Pictures",e);}' + '\n;try{(0,eval)(' + JSON.stringify(mu) + ');}catch(e){console.error("Music",e);}' + '\n;try{(0,eval)(' + JSON.stringify(htd) + ');}catch(e){console.error("HowToDo",e);}' + '\n;try{(0,eval)(' + JSON.stringify(ffh) + ');}catch(e){console.error("FactsHowTo",e);}' + '\n;try{(0,eval)(' + JSON.stringify(agd) + ');}catch(e){console.error("AnswerGuard",e);}' + '\n;try{(0,eval)(' + JSON.stringify(hpl) + ');}catch(e){console.error("HomePlus",e);}' + '\n;try{(0,eval)(' + JSON.stringify(sto) + ');}catch(e){console.error("StoreKid",e);}' + '\n;try{(0,eval)(' + JSON.stringify(akt) + ');}catch(e){console.error("Activities",e);}' + '\n;try{(0,eval)(' + JSON.stringify(kmo) + ');}catch(e){console.error("KindsMore",e);}' + '\n;try{(0,eval)(' + JSON.stringify(rpk) + ');}catch(e){console.error("RebbePick",e);}' + '\n;try{(0,eval)(' + JSON.stringify(ohv) + ');}catch(e){console.error("OlamHaba",e);}' + '\n;try{(0,eval)(' + JSON.stringify(tpl) + ');}catch(e){console.error("TorahPlus",e);}' + '\n;try{(0,eval)(' + JSON.stringify(chp) + ');}catch(e){console.error("ChumashPage",e);}' + '\n;try{(0,eval)(' + JSON.stringify(krm) + ');}catch(e){console.error("KriyahMore",e);}' + '\n;try{(0,eval)(' + JSON.stringify(ttk) + ');}catch(e){console.error("TorahTracks",e);}' + '\n;try{(0,eval)(' + JSON.stringify(arn) + ');}catch(e){console.error("ArenaPage",e);}' + '\n;try{(0,eval)(' + JSON.stringify(tmx) + ');}catch(e){console.error("ClassMode",e);}' + '\n;try{(0,eval)(' + JSON.stringify(hlf) + ');}catch(e){console.error("HomeLift",e);}' + '\n;try{(0,eval)(' + JSON.stringify(lwy) + ');}catch(e){console.error("LearnWays",e);}' + '\n;try{(0,eval)(' + JSON.stringify(dpt) + ');}catch(e){console.error("DailyPath",e);}' + '\n;try{(0,eval)(' + JSON.stringify(blb) + ');}catch(e){console.error("BoyLibrary",e);}' + '\n;try{(0,eval)(' + JSON.stringify(klx) + ');}catch(e){console.error("KLessons",e);}' + '\n;try{(0,eval)(' + JSON.stringify(krx) + ');}catch(e){console.error("KReading",e);}' + '\n;try{(0,eval)(' + JSON.stringify(rpx) + ');}catch(e){console.error("RealPics",e);}' + '\n;try{(0,eval)(' + JSON.stringify(sfitx) + ');}catch(e){console.error("ScreenFit",e);}' + '\n;try{(0,eval)(' + JSON.stringify(kkx) + ');}catch(e){console.error("KKriyah",e);}' + '\n;try{(0,eval)(' + JSON.stringify(g1x) + ');}catch(e){console.error("G1Math",e);}' + '\n;try{(0,eval)(' + JSON.stringify(g1rx) + ');}catch(e){console.error("G1Reading",e);}' + '\n;try{(0,eval)(' + JSON.stringify(g2x) + ');}catch(e){console.error("G2Math",e);}' + '\n;try{(0,eval)(' + JSON.stringify(g2rx) + ');}catch(e){console.error("G2Reading",e);}' + '\n;try{(0,eval)(' + JSON.stringify(g3x) + ');}catch(e){console.error("G3Math",e);}' + '\n;try{(0,eval)(' + JSON.stringify(g3rx) + ');}catch(e){console.error("G3Reading",e);}' + '\n;try{(0,eval)(' + JSON.stringify(klnx) + ');}catch(e){console.error("KLearn",e);}' + '\n;try{(0,eval)(' + JSON.stringify(kscx) + ');}catch(e){console.error("KScience",e);}' + '\n;try{(0,eval)(' + JSON.stringify(kwrtx) + ');}catch(e){console.error("KWriting",e);}' + '\n;try{(0,eval)(' + JSON.stringify(g1sctx) + ');}catch(e){console.error("G1Science",e);}' + '\n;try{(0,eval)(' + JSON.stringify(g1wrtx) + ');}catch(e){console.error("G1Writing",e);}' + '\n;try{(0,eval)(' + JSON.stringify(g2sctx) + ');}catch(e){console.error("G2Science",e);}' + '\n;try{(0,eval)(' + JSON.stringify(g2wrtx) + ');}catch(e){console.error("G2Writing",e);}' + '\n;try{(0,eval)(' + JSON.stringify(g3sctx) + ');}catch(e){console.error("G3Science",e);}' + '\n;try{(0,eval)(' + JSON.stringify(g3wrtx) + ');}catch(e){console.error("G3Writing",e);}' + '\n;try{(0,eval)(' + JSON.stringify(keltx) + ');}catch(e){console.error("KElectives",e);}' + '\n;try{(0,eval)(' + JSON.stringify(algx) + ');}catch(e){console.error("AlgebraAscent",e);}' };
}
/* v67 speed (takeover builder): the boy page used to download every add-on (about 2.9 MB) at every sign-in.
   Now msQuestTools returns a small loader. The Chromebook keeps the add-ons in IndexedDB with their hash and asks
   msQuestToolsGet(hash): the server answers "same" (nothing to download) or sends the new code once. Same code, same order. */
var TL_TOOLS_LOADER = "(function(){var K='tl-tools',DB=null;" +
  "function go(js){try{(0,eval)(js);}catch(e){console.error('QuestTools',e);}try{if(typeof A!=='undefined'&&(A.view==='play'||A.view==='hub'||A.view==='result'))render();}catch(e){}}" +
  "function put(v){if(!DB)return;try{DB.transaction('kv','readwrite').objectStore('kv').put(v,K);}catch(e){}}" +
  "function ask(c){google.script.run.withSuccessHandler(function(r){if(r&&r.same&&c){go(c.js);return;}if(r&&r.js){go(r.js);put({h:r.h,js:r.js});}}).withFailureHandler(function(e){if(c)go(c.js);else console.error('QuestTools',e);}).msQuestToolsGet(c&&c.h?c.h:'');}" +
  "function get(){if(!DB)return ask(null);try{var q=DB.transaction('kv').objectStore('kv').get(K);q.onsuccess=function(){ask(q.result||null);};q.onerror=function(){ask(null);};}catch(e){ask(null);}}" +
  "try{var r=indexedDB.open('tashbar-tools',1);r.onupgradeneeded=function(){r.result.createObjectStore('kv');};r.onsuccess=function(){DB=r.result;get();};r.onerror=function(){ask(null);};r.onblocked=function(){ask(null);};}catch(e){ask(null);}" +
  "})();";
function msQuestTools() { return { css: QUEST_TOOLS.css, js: typeof tlLoader2_ === 'function' ? tlLoader2_() : TL_TOOLS_LOADER }; }   /* v162: piece-by-piece cache (Speed.js); old loader = fallback. ADDING A FILE ABOVE? Add it to TL_PART_FILES in Speed.js too (same place in the order). */
function msQuestToolsGet(have) {
  var t = msQuestToolsBody_(), js = t.js;
  var h = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, js, Utilities.Charset.UTF_8).map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
  if (have && String(have) === h) return { same: 1, h: h };
  return { h: h, js: js };
}

/* Editor test: photoSelfTest() checks the matching rules without touching Drive. */
function photoSelfTest() {
  var t = [['3 x 4 = 12', '12', true], ['12 cm', '12', true], ['$2.50', '2.5', true], ['3/4', '0.75', true], ['1 1/2 in', '1.5', true],
    ['answer: 7 R2', '7R2', true], ['5 + 6 = 11', '12', false], ['', '12', false], ['scribble', '9', false], ['1,250', '1250', true]];
  return t.map(function (x) { var got = photoMatch_(x[0], x[1]); return (got === x[2] ? 'ok ' : 'FAIL ') + JSON.stringify(x); }).join('\n');
}
