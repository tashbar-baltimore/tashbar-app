/* ---------- Curriculum Guide (HoS DECISION 2026-11-15 2000Z: "the most important thing"): the staff overview on top of the
   Curriculum Preview (Access.js cpPage_). Staff see intention, method, coverage, what is new, and mark each skill
   reviewed / rebbe-checked / flagged. Staff only (sgStaff_). No student data: one row per SKILL in tab CP_Review.
   Columns: id | hash | firstSeen | changedAt | status | note | by | at | reviewedHash
   - hash: a fingerprint the page computes from the skill's lesson content. A new hash means the content changed.
   - firstSeen/changedAt drive "What's new". The very first sync is a baseline (no skill is shown as new).
   - status: '' | 'ok' (approved) | 'rebbe' (rebbe-checked) | 'flag' (needs fixing). reviewedHash = the content that was reviewed,
     so a skill that changes after its review shows "changed since review". ---------- */
var CG_TAB = 'CP_Review';
var CG_H = ['id', 'hash', 'firstSeen', 'changedAt', 'status', 'note', 'by', 'at', 'reviewedHash'];

function cgTab_() {
  var ss = msBook_(), sh = ss.getSheetByName(CG_TAB);
  if (!sh) { sh = ss.insertSheet(CG_TAB); sh.getRange(1, 1, 1, CG_H.length).setValues([CG_H]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function cgRows_(sh) { var n = sh.getLastRow(); return n < 2 ? [] : sh.getRange(2, 1, n - 1, CG_H.length).getValues(); }
function cgIso_(v) { if (!v) return ''; try { return (v instanceof Date ? v : new Date(v)).toISOString(); } catch (e) { return String(v); } }
function cgOut_(r) { return [cgIso_(r[2]), cgIso_(r[3]), String(r[4] || ''), String(r[5] || ''), String(r[6] || ''), cgIso_(r[7]), String(r[8] || '')]; }

/* hashes: {skillId: fingerprint}. Returns {ok, baseline, map:{id:[firstSeen, changedAt, status, note, by, at, reviewedHash]}, me} */
function cgSync(token, hashes) {
  var s = sgStaff_(token), me = (s.who && s.who.name) || 'Staff';
  if (!hashes || typeof hashes !== 'object') hashes = {};
  var l = LockService.getScriptLock(); l.waitLock(20000);
  try {
    var sh = cgTab_(), rows = cgRows_(sh), at = {}, now = new Date(), baseline = rows.length === 0, add = [], dirty = false;
    rows.forEach(function (r, i) { at[String(r[0])] = i; });
    Object.keys(hashes).forEach(function (id) {
      var h = String(hashes[id] || '').slice(0, 40); id = String(id).slice(0, 60); if (!/^[A-Z]+\.[A-Za-z0-9.]+$/.test(id)) return;
      if (at[id] === undefined) { add.push([id, h, baseline ? '' : now, baseline ? '' : now, '', '', '', '', '']); }
      else { var r = rows[at[id]]; if (String(r[1]) !== h) { r[1] = h; r[3] = now; dirty = true; } }
    });
    if (dirty && rows.length) sh.getRange(2, 1, rows.length, CG_H.length).setValues(rows);
    if (add.length) sh.getRange(sh.getLastRow() + 1, 1, add.length, CG_H.length).setValues(add);
    var map = {}; rows.concat(add).forEach(function (r) { map[String(r[0])] = cgOut_(r); });
    return { ok: true, baseline: baseline, map: map, me: me };
  } finally { l.releaseLock(); }
}

/* status: '' | 'ok' | 'rebbe' | 'flag'. note up to 500 chars. hash = the content being reviewed. */
function cgReview(token, id, status, note, hash) {
  var s = sgStaff_(token), me = (s.who && s.who.name) || 'Staff';
  id = String(id || '').slice(0, 60); if (!/^[A-Z]+\.[A-Za-z0-9.]+$/.test(id)) throw new Error('Unknown skill.');
  status = String(status || ''); if (['', 'ok', 'rebbe', 'flag'].indexOf(status) < 0) throw new Error('Unknown status.');
  note = String(note == null ? '' : note).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, 500);
  hash = String(hash || '').slice(0, 40);
  var l = LockService.getScriptLock(); l.waitLock(20000);
  try {
    var sh = cgTab_(), rows = cgRows_(sh), now = new Date(), i = -1;
    for (var k = 0; k < rows.length; k++) if (String(rows[k][0]) === id) { i = k; break; }
    var r = i >= 0 ? rows[i] : [id, hash, now, now, '', '', '', '', ''];
    r[4] = status; r[5] = note; r[6] = status ? me : ''; r[7] = status ? now : ''; r[8] = status ? hash : '';
    if (i >= 0) sh.getRange(i + 2, 1, 1, CG_H.length).setValues([r]); else sh.getRange(sh.getLastRow() + 1, 1, 1, CG_H.length).setValues([r]);
    return { ok: true, row: cgOut_(r) };
  } finally { l.releaseLock(); }
}
