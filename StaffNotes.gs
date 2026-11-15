/* StaffNotes.js — v182 (takeover3, HoS 2026-11-13: "keep on going… do all of them… so easy, so fun, so helpful in every way").
   The staff desk, on the server:
   1. PICKS (sheet SG_Picks): a rebbe or teacher picks a lesson for one boy or a whole group. The boy sees it on his home screen
      ("📌 Rabbi X picked this for you") with one Start button. A pick is done when he masters the lesson (or passes the bechina).
   2. NOTES (sheet SG_Notes): short, dated staff notes on a boy: note, praise, concern, parent contact, goal. STAFF ONLY.
      A praise or goal can ALSO be sent to the boy as a shout-out; he sees it once, big, with confetti (sheet SG_Seen).
   3. THIS WEEK (sgWeek): every boy's week (Sunday to Friday): days active, minutes, answers, right, lessons mastered,
      bechinas, where he is stuck, and the change from last week. For a printed or emailed weekly summary.
   Append-only sheets (the newest row wins; undo = a new row), all writes under sgLock_. Nothing here pays money or changes levels.
   No "double slash" in this file. */
var SGD = {
  PICK: 'SG_Picks', PICK_H: ['at', 'student_id', 'lesson_id', 'lesson_name', 'by_id', 'by_name', 'note', 'undo'],
  NOTE: 'SG_Notes', NOTE_H: ['at', 'note_id', 'student_id', 'by_id', 'by_name', 'kind', 'text', 'to_boy', 'undo', 'target'],
  SEEN: 'SG_Seen', SEEN_H: ['at', 'student_id', 'note_id', 'thanks'],
  KINDS: { note: '📝 Note', praise: '🌟 Praise', concern: '⚠️ Concern', parent: '📞 Parent contact', goal: '🎯 Goal', star: '⭐ Star of the week', torah: '📜 Torah moment', shabbos: '🕯️ Shabbos message' },
  SHOUT_DAYS: 14
};
function sgdTab_(name, head) { var ss = msBook_(), sh = ss.getSheetByName(name); if (!sh) { sh = ss.insertSheet(name); sh.getRange(1, 1, 1, head.length).setValues([head]); sh.setFrozenRows(1); } return sh; }
function sgdRows_(name, len) { var sh = msBook_().getSheetByName(name); if (!sh) return []; var n = sh.getLastRow(); return n < 2 ? [] : sh.getRange(2, 1, n - 1, len).getValues(); }
function sgdTrue_(v) { return v === true || String(v).toUpperCase() === 'TRUE'; }
function sgdT_(v) { if (!v) return 0; var t = (v instanceof Date ? v : new Date(v)).getTime(); return isNaN(t) ? 0 : t; }
function sgdRoster_() { var o = {}; msRoster_().forEach(function (r) { o[r.id] = r.name; }); return o; }
function sgdStates_(only) { var o = {}; msRows_('state').forEach(function (r) { var sid = String(r[0]); if (only && !only[sid]) return; try { o[sid] = JSON.parse(r[1]); } catch (e) {} }); return o; }

/* every lesson a staff member may pick: General Studies (the Teacher mode list) + Limudei Kodesh. [id, name, subject, level] */
function sgdCatalog_() {
  var out = [], seen = {};
  try { tmCatalog_().forEach(function (x) { if (seen[x.id]) return; seen[x.id] = 1; out.push([x.id, x.name, x.subj, x.level]); }); } catch (e) {}
  try { var L = sgpKodeshLessons_(); Object.keys(L.order).forEach(function (k) { L.order[k].forEach(function (id) { if (seen[id]) return; seen[id] = 1; out.push([id, L.names[id] || id, 'LK:' + k, plMathLevel_(id)]); }); }); } catch (e) {}
  return out;
}
function sgPickCatalog(token) { sgStaff_(token); return { lessons: sgdCatalog_(), tracks: SGP_TRACK_NAMES }; }
function sgdLessonName_(id) { var hit = sgdCatalog_().filter(function (x) { return x[0] === id; })[0]; return hit ? hit[1] : ''; }

/* ---------- 1. picks ---------- */
function sgdPicks_() {
  var out = {};
  sgdRows_(SGD.PICK, SGD.PICK_H.length).forEach(function (r) { var sid = String(r[1] || ''), id = String(r[2] || ''); if (!sid || !id) return; var k = sid + '|' + id;
    if (sgdTrue_(r[7])) delete out[k]; else out[k] = { sid: sid, id: id, name: String(r[3] || id), byId: String(r[4] || ''), by: String(r[5] || ''), note: String(r[6] || ''), at: sgdT_(r[0]) }; });
  return out;
}
function sgdDone_(st, id, sid, MK) { return !!((st && st.skills && st.skills[id] && st.skills[id].m) || (MK && MK[sid + '|' + id])); }
function sgPick(token, sids, lessonId, note, undo) {
  var s = sgStaff_(token), who = sgWho_(s); lessonId = String(lessonId || ''); sids = (Array.isArray(sids) ? sids : [sids]).map(String);
  var R = sgdRoster_(); sids = sids.filter(function (x, i, a) { return R[x] && a.indexOf(x) === i; });
  if (!sids.length) throw new Error('Pick at least one boy on the list.');
  if (sids.length > 60) throw new Error('That is too many boys at once.');
  var name = sgdLessonName_(lessonId); if (!name && !undo) throw new Error('That lesson was not found.');
  note = String(note || '').replace(/[\u0000-\u001F]/g, ' ').trim().slice(0, 160);
  sgLock_(function () { var sh = sgdTab_(SGD.PICK, SGD.PICK_H), now = new Date();
    sh.getRange(sh.getLastRow() + 1, 1, sids.length, SGD.PICK_H.length).setValues(sids.map(function (sid) { return [now, sid, lessonId, name || lessonId, who.id || '', who.name || 'Staff', note, !!undo]; })); });
  return sgDesk(token);
}

/* ---------- 2. notes + shout-outs ---------- */
function sgdNotes_() {
  var out = {}, order = [];
  sgdRows_(SGD.NOTE, SGD.NOTE_H.length).forEach(function (r) { var id = String(r[1] || ''); if (!id) return;
    if (sgdTrue_(r[8])) { delete out[id]; return; }
    if (!out[id]) order.push(id);
    out[id] = { id: id, at: sgdT_(r[0]), sid: String(r[2] || ''), byId: String(r[3] || ''), by: String(r[4] || ''), kind: SGD.KINDS[String(r[5])] ? String(r[5]) : 'note', text: String(r[6] || ''), toBoy: sgdTrue_(r[7]), target: sgdTarget_(r[9]) }; });
  return order.filter(function (id) { return out[id]; }).map(function (id) { return out[id]; });
}
function sgdTarget_(v) { if (!v) return null; try { var t = JSON.parse(String(v)); return t && t.k && t.level ? { k: String(t.k), level: Number(t.level) } : null; } catch (e) { return null; } }
/* v188: progress toward a goal "finish <Kodesh track> Level N": every lesson of that track up to that level */
function sgdGoalProgress_(t, st, sid, L, MK) { var ids = (L.order[t.k] || []).filter(function (id) { return plMathLevel_(id) <= t.level; }); if (!ids.length) return null;
  var sk = (st && st.skills) || {}, done = ids.filter(function (id) { return (sk[id] && sk[id].m) || MK[sid + '|' + id]; }).length;
  return { k: t.k, track: SGP_TRACK_NAMES[t.k] || t.k, level: t.level, done: done, total: ids.length }; }
function sgdSeen_() { var o = {}; sgdRows_(SGD.SEEN, SGD.SEEN_H.length).forEach(function (r) { var k = String(r[1]) + '|' + String(r[2]); if (!o[k]) o[k] = sgdT_(r[0]); if (sgdTrue_(r[3])) o['T' + k] = sgdT_(r[0]); }); return o; }
function sgNotes(token, sid) {
  sgStaff_(token); sid = String(sid || ''); var seen = sgdSeen_();
  var list = sgdNotes_().filter(function (n) { return n.sid === sid; }).reverse(), L = null, st = null, MK = {};
  list.forEach(function (n) { n.seen = n.toBoy ? (seen[sid + '|' + n.id] || 0) : 0; n.thanks = n.toBoy ? (seen['T' + sid + '|' + n.id] || 0) : 0;
    if (n.target) { if (!L) { L = sgpKodeshLessons_(); st = sgdStates_((function () { var o = {}; o[sid] = 1; return o; })())[sid] || {}; try { MK = sgpMarks_(); } catch (e) {} } n.progress = sgdGoalProgress_(n.target, st, sid, L, MK); } });
  return { sid: sid, kinds: SGD.KINDS, notes: list };
}
function sgNote(token, sid, kind, text, toBoy, target) {
  var s = sgStaff_(token), who = sgWho_(s); sid = String(sid || ''); kind = SGD.KINDS[String(kind)] ? String(kind) : 'note';
  if (!sgdRoster_()[sid]) throw new Error('That boy is not on the list.');
  text = String(text || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, 600);
  if (!text) throw new Error('Write a few words first.');
  toBoy = !!toBoy && (kind === 'praise' || kind === 'goal' || kind === 'star' || kind === 'torah' || kind === 'shabbos');
  var tg = ''; if (kind === 'goal' && target && target.k && target.level) { var L = sgpKodeshLessons_(); if (!(L.order[String(target.k)] || []).length) throw new Error('Pick a Kodesh track for the goal.'); tg = JSON.stringify({ k: String(target.k), level: Math.max(1, Math.min(20, Math.round(Number(target.level) || 0))) }); }
  sgLock_(function () { var sh = sgdTab_(SGD.NOTE, SGD.NOTE_H); if (!sh.getRange(1, 10).getValue()) sh.getRange(1, 10).setValue('target'); sh.appendRow([new Date(), Utilities.getUuid(), sid, who.id || '', who.name || 'Staff', kind, text, toBoy, false, tg]); });
  return sgNotes(token, sid);
}
function sgNoteDelete(token, noteId) {
  var s = sgStaff_(token), who = sgWho_(s); noteId = String(noteId || '');
  var n = sgdNotes_().filter(function (x) { return x.id === noteId; })[0]; if (!n) throw new Error('That note is already gone.');
  if (n.byId && n.byId !== who.id && !sgIsHead_(s)) throw new Error('Only the person who wrote it (or the Head of School) can delete it.');
  sgLock_(function () { sgdTab_(SGD.NOTE, SGD.NOTE_H).appendRow([new Date(), noteId, n.sid, who.id || '', who.name || 'Staff', n.kind, '', false, true]); });
  return sgNotes(token, n.sid);
}

/* the staff desk: every open pick (done or not) and a short note count per boy, for badges on the grids */
function sgDesk(token) {
  sgStaff_(token); var P = sgdPicks_(), keys = Object.keys(P), need = {}; keys.forEach(function (k) { need[P[k].sid] = 1; });
  var ST = sgdStates_(need), MK = {}; try { MK = sgpMarks_(); } catch (e) {}
  var picks = keys.map(function (k) { var p = P[k]; p.done = sgdDone_(ST[p.sid], p.id, p.sid, MK); if (p.done) { var x = ST[p.sid] && ST[p.sid].skills && ST[p.sid].skills[p.id]; p.doneAt = x && x.at ? Number(x.at) : 0; } return p; })
    .filter(function (p) { return !p.done || !p.doneAt || p.doneAt > Date.now() - 14 * 86400000; });
  var notes = {}, since = Date.now() - 30 * 86400000;
  sgdNotes_().forEach(function (n) { var o = notes[n.sid] = notes[n.sid] || { n: 0, recent: 0, last: 0, kind: '' }; o.n++; if (n.at > since) o.recent++; if (n.at >= o.last) { o.last = n.at; o.kind = n.kind; } });
  return { at: Date.now(), picks: picks, notes: notes, kinds: SGD.KINDS };
}

/* ---------- the boy's side ---------- */
function sgdKid_(token) { var s = msSession_(token); if (!s || !s.sid || s.role === 'staff') throw new Error('Please sign in again.'); return s; }
function sgMyDesk(token) {
  var s = sgdKid_(token), sid = s.sid, P = sgdPicks_(), st = sgdStates_((function () { var o = {}; o[sid] = 1; return o; })())[sid] || {}, MK = {}; try { MK = sgpMarks_(); } catch (e) {}
  var picks = Object.keys(P).map(function (k) { return P[k]; }).filter(function (p) { return p.sid === sid; }).map(function (p) { return { id: p.id, name: p.name, by: p.by, note: p.note, at: p.at, done: sgdDone_(st, p.id, sid, MK) }; })
    .sort(function (a, b) { return (a.done - b.done) || (b.at - a.at); }).slice(0, 8);
  var seen = sgdSeen_(), since = Date.now() - SGD.SHOUT_DAYS * 86400000;
  var L = null, now = Date.now();
  var shouts = sgdNotes_().filter(function (n) { if (n.sid !== sid || !n.toBoy) return false; if (n.kind === 'star' || n.kind === 'shabbos') return n.at > now - 7 * 86400000; if (n.kind === 'torah') return n.at > now - 3 * 86400000; if (n.kind === 'goal') return n.at > now - 120 * 86400000; return n.at > since; }).reverse().slice(0, 8)
    .map(function (n) { var o = { id: n.id, by: n.by, kind: n.kind, text: n.text, at: n.at, seen: !!seen[sid + '|' + n.id], thanked: !!seen['T' + sid + '|' + n.id] };
      if (n.target) { if (!L) L = sgpKodeshLessons_(); o.progress = sgdGoalProgress_(n.target, st, sid, L, MK); } return o; })
    .filter(function (o) { return !(o.kind === 'goal' && o.progress && o.progress.done >= o.progress.total && o.at < now - 7 * 86400000); });
  var par = null; try { par = sgsGet_('parsha'); if (par && par.lesson) par.done = sgdDone_(st, par.lesson, sid, MK); } catch (e) {}
  var chl = 0; try { chl = Number((sgsGet_('chmlv') || {})[sid]) || 0; } catch (e) {}   /* v202: the Chumash level his rebbe set (ChumashPage) */
  return { sid: sid, now: Date.now(), picks: picks, shouts: shouts, parsha: par, chmLv: chl };
}
function sgShoutSeen(token, ids, thanks) {   /* v189: thanks = the boy tapped "Thank you" (his rebbe sees ❤️) */
  var s = sgdKid_(token), sid = s.sid; ids = (Array.isArray(ids) ? ids : [ids]).map(String).slice(0, 10); if (!ids.length) return true;
  var mine = {}; sgdNotes_().forEach(function (n) { if (n.sid === sid && n.toBoy) mine[n.id] = 1; }); var seen = sgdSeen_();
  ids = ids.filter(function (id) { return mine[id] && (thanks ? !seen['T' + sid + '|' + id] : !seen[sid + '|' + id]); }); if (!ids.length) return true;
  sgLock_(function () { var sh = sgdTab_(SGD.SEEN, SGD.SEEN_H), now = new Date(); if (!sh.getRange(1, 4).getValue()) sh.getRange(1, 4).setValue('thanks');
    sh.getRange(sh.getLastRow() + 1, 1, ids.length, 4).setValues(ids.map(function (id) { return [now, sid, id, !!thanks]; })); });
  return true;
}

/* v189: one note (usually a 🎯 goal) for many boys at once, e.g. the whole Show group */
function sgNoteMany(token, sids, kind, text, toBoy, target) {
  sgStaff_(token); var R = sgdRoster_(); sids = (Array.isArray(sids) ? sids : [sids]).map(String).filter(function (x, i, a) { return R[x] && a.indexOf(x) === i; });
  if (!sids.length) throw new Error('Pick at least one boy on the list.'); if (sids.length > 80) throw new Error('That is too many boys at once.');
  sids.forEach(function (sid) { sgNote(token, sid, kind, text, toBoy, target); });
  return sgDesk(token);
}

/* ---------- 3. this week ---------- */
function sgdAddDays_(ymd, n) { var p = ymd.split('-').map(Number), d = new Date(Date.UTC(p[0], p[1] - 1, p[2] + n, 12)); return d.toISOString().slice(0, 10); }
function sgdWeekStart_(back) {   /* the Sunday that starts this week (New York), minus back weeks */
  var today = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd'), p = today.split('-').map(Number), dow = new Date(Date.UTC(p[0], p[1] - 1, p[2], 12)).getUTCDay();
  return sgdAddDays_(today, -dow - 7 * (back || 0));
}
function sgdDayKey_(t) { return Utilities.formatDate(new Date(t), 'America/New_York', 'yyyy-MM-dd'); }
function sgWeek(token, back) {
  sgStaff_(token); back = Math.max(0, Math.min(12, Math.round(Number(back) || 0)));
  var start = sgdWeekStart_(back), end = sgdAddDays_(start, 7), pstart = sgdAddDays_(start, -7), days = [];
  for (var i = 0; i < 6; i++) days.push(sgdAddDays_(start, i));
  var R = {}; msRoster_().forEach(function (r) { if (!/^TEST-/.test(r.id)) R[r.id] = r.name; });
  var B = {}; Object.keys(R).forEach(function (sid) { B[sid] = { id: sid, name: R[sid], days: [0, 0, 0, 0, 0, 0], a: 0, ok: 0, ka: 0, kok: 0, min: 0, pa: 0, pok: 0, last: 0, sk: {}, times: [], mg: 0, mk: 0, mIds: [], marks: 0, praise: 0, notes: 0 }; });
  /* read the evidence from the end back to the start of LAST week (in pieces, at most 60,000 rows) */
  var es = msTab_('evidence'), m = es.getLastRow(), row = m, readRows = 0, done = false;
  while (!done && row >= 2 && readRows < 60000) {
    var from = Math.max(2, row - 4999), vals = es.getRange(from, 1, row - from + 1, 6).getValues(); readRows += vals.length; row = from - 1;
    for (var j = vals.length - 1; j >= 0; j--) { var r = vals[j], t = sgdT_(r[0]); if (!t) continue; var dk = sgdDayKey_(t); if (dk < pstart) { done = true; break; }
      var b = B[String(r[1] || '')]; if (!b) continue; b.last = Math.max(b.last, t); var ok = Number(r[5]) === 1;
      if (dk >= end) continue;
      if (dk < start) { b.pa++; if (ok) b.pok++; continue; }
      var di = days.indexOf(dk); if (di >= 0) b.days[di]++;
      var sk = String(r[2] || ''), kod = /^(LK|HEB)\./.test(sk); if (kod) { b.ka++; if (ok) b.kok++; } else { b.a++; if (ok) b.ok++; }
      var x = b.sk[sk] = b.sk[sk] || { ok: 0, miss: 0 }; if (ok) x.ok++; else x.miss++; b.times.push(t); }
  }
  /* "last seen" for boys with no answers in these two weeks */
  var ST = sgdStates_(), MK = {}; try { MK = sgpMarks_(); } catch (e) {}
  var names = {};
  Object.keys(B).forEach(function (sid) { var b = B[sid], st = ST[sid] || {}, sk = st.skills || {};
    b.times.sort(function (p, q) { return p - q; }); var mins = 0; for (var k = 1; k < b.times.length; k++) mins += Math.min(b.times[k] - b.times[k - 1], 5 * 60000); b.min = Math.round(mins / 60000) + (b.times.length ? 1 : 0); delete b.times;
    Object.keys(sk).forEach(function (id) { var v = sk[id]; if (!v || !v.m || !v.at) return; var dk = sgdDayKey_(Number(v.at)); if (dk < start || dk >= end) return; if (/^(LK|HEB)\./.test(id)) b.mk++; else b.mg++; b.mIds.push(id); names[id] = 1; });
    if (!b.last && st.updatedAt) b.last = sgdT_(st.updatedAt);
    b.stuck = Object.keys(b.sk).filter(function (id) { var x = b.sk[id]; return x.miss >= 4 && x.ok < x.miss * 1.5 && !(sk[id] && sk[id].m) && !MK[sid + '|' + id]; }).map(function (id) { names[id] = 1; return [id, b.sk[id].miss, b.sk[id].ok]; });
    b.skills = Object.keys(b.sk).length; delete b.sk; b.mIds = b.mIds.slice(0, 12);
    var dv = st.dav || {}; b.dav = days.filter(function (d) { return dv[d] && dv[d].length; }).length;
    b.chm = sgChmOf_(st, start, end); });
  sgdRows_(SGP_MARK_TAB, SGP_MARK_HEAD.length).forEach(function (r) { var dk = r[0] ? sgdDayKey_(sgdT_(r[0])) : ''; if (dk >= start && dk < end && !sgdTrue_(r[6]) && B[String(r[1])]) B[String(r[1])].marks++; });
  sgdNotes_().forEach(function (n) { var dk = sgdDayKey_(n.at); if (dk >= start && dk < end && B[n.sid]) { B[n.sid].notes++; if (n.kind === 'praise') B[n.sid].praise++; } });
  var nm = {}; try { var cat = sgdCatalog_(); cat.forEach(function (x) { if (names[x[0]]) nm[x[0]] = x[1]; }); } catch (e) {}
  var boys = Object.keys(B).map(function (k) { return B[k]; }).sort(function (a, b) { return a.name.localeCompare(b.name); });
  return { at: Date.now(), back: back, start: start, end: end, days: days, boys: boys, names: nm, readRows: readRows };
}

/* ---------- 4. 🎓 ready for a bechina (v185) ----------
   A boy who has mastered EVERY lesson of a Kodesh level in the app, and has no rebbe mark on that level yet, is ready for a
   level bechina. sgLevelBechina marks every lesson of that level at once (rows in KD_Marks, note 'level'). */
function sgBechinaReady(token) {
  sgStaff_(token); var L = sgpKodeshLessons_(), ST = sgdStates_(), MK = {}; try { MK = sgpMarks_(); } catch (e) {}
  var R = {}; msRoster_().forEach(function (r) { if (!/^TEST-/.test(r.id)) R[r.id] = r.name; });
  var out = [];
  Object.keys(R).forEach(function (sid) { var sk = (ST[sid] || {}).skills || {};
    Object.keys(L.order).forEach(function (k) { var by = {}; L.order[k].forEach(function (id) { var lv = plMathLevel_(id); (by[lv] = by[lv] || []).push(id); });
      Object.keys(by).forEach(function (lv) { var ids = by[lv], last = 0, ok = ids.every(function (id) { var x = sk[id]; if (x && x.m) { last = Math.max(last, Number(x.at) || 0); return true; } return false; });
        if (!ok || !ids.length) return; if (ids.some(function (id) { return MK[sid + '|' + id]; })) return;
        out.push({ sid: sid, name: R[sid], k: k, track: SGP_TRACK_NAMES[k] || k, level: Number(lv), n: ids.length, at: last }); }); }); });
  out.sort(function (a, b) { return b.at - a.at; });
  return { at: Date.now(), ready: out.slice(0, 200) };
}
function sgLevelBechina(token, sid, k, level, undo) {
  var s = sgStaff_(token), who = sgWho_(s); sid = String(sid || ''); k = String(k || ''); level = Number(level) || 0;
  if (!sgdRoster_()[sid]) throw new Error('That boy is not on the list.');
  var ids = (sgpKodeshLessons_().order[k] || []).filter(function (id) { return plMathLevel_(id) === level; });
  if (!ids.length) throw new Error('No lessons on that level.');
  sgLock_(function () { var sh = sgpMarkTab_(), now = new Date();
    sh.getRange(sh.getLastRow() + 1, 1, ids.length, SGP_MARK_HEAD.length).setValues(ids.map(function (id) { return [now, sid, id, who.id || '', who.name || 'Staff', 'level ' + level, !!undo]; })); });
  return sgBechinaReady(token);
}

/* ---------- 5. 🧑‍🏫 teach it together (v187) ----------
   From "Stuck on the same lesson": start a Teacher-mode class (TeacherMode.js sessions) for those boys on that ONE lesson,
   General Studies OR Limudei Kodesh (Teacher mode's own list has no Kodesh lessons). The boy side is ClassMode.html, unchanged. */
function sgTeachTogether(token, sids, lessonId, minutes) {
  var s = sgStaff_(token), who = sgWho_(s); lessonId = String(lessonId || ''); minutes = Math.round(Number(minutes) || 0);
  var R = sgdRoster_(); sids = (Array.isArray(sids) ? sids : [sids]).map(String).filter(function (x, i, a) { return R[x] && a.indexOf(x) === i; });
  if (!sids.length) throw new Error('Pick at least one boy on the list.');
  var name = sgdLessonName_(lessonId); if (!name) throw new Error('That lesson was not found.');
  if (!(minutes >= TM.MIN && minutes <= TM.MAX)) throw new Error('Pick how long: ' + TM.MIN + ' to ' + TM.MAX + ' minutes.');
  var subj = /^(LK|HEB)\./.test(lessonId) ? 'LK' : tmSubjOf_(lessonId);
  return sgLock_(function () {
    var list = tmRead_();
    list.forEach(function (x) { x.sids = x.sids.filter(function (id) { return sids.indexOf(id) < 0; }); });
    list = list.filter(function (x) { return x.sids.length; });
    var now = Date.now();
    list.push({ id: Utilities.getUuid(), skill: lessonId, skills: [lessonId], name: name, subj: subj, sids: sids, by: who.name || 'Staff', byId: who.id || '', start: now, until: now + minutes * 60000 });
    return tmWrite_(list).map(tmPublic_);
  });
}

/* ---------- 6. 🎉 new since you last looked (v190) ----------
   Everything good that happened since time t: lessons mastered, bechinas passed, picked lessons done, thank-yous to me. */
function sgSince(token, t) {
  var s = sgStaff_(token), who = sgWho_(s); t = Number(t) || 0; var now = Date.now(); if (!t || t < now - 14 * 86400000) t = now - 86400000;
  var R = {}; msRoster_().forEach(function (r) { if (!/^TEST-/.test(r.id)) R[r.id] = r.name; });
  var ST = sgdStates_(), names = {}, by = {};
  var add = function (sid, kind, id, at) { if (!R[sid]) return; var b = by[sid] = by[sid] || { sid: sid, name: R[sid], mastered: [], bechina: 0, picks: 0, thanks: 0, last: 0 };
    if (kind === 'm') { b.mastered.push(id); names[id] = 1; } else if (kind === 'b') b.bechina++; else if (kind === 'p') b.picks++; else if (kind === 't') b.thanks++; b.last = Math.max(b.last, at); };
  Object.keys(ST).forEach(function (sid) { var sk = (ST[sid] && ST[sid].skills) || {}; Object.keys(sk).forEach(function (id) { var x = sk[id]; if (x && x.m && Number(x.at) > t && !x.bechina) add(sid, 'm', id, Number(x.at)); }); });
  sgdRows_(SGP_MARK_TAB, SGP_MARK_HEAD.length).forEach(function (r) { var at = sgdT_(r[0]); if (at > t && !sgdTrue_(r[6])) add(String(r[1]), 'b', String(r[2]), at); });
  var P = sgdPicks_(); Object.keys(P).forEach(function (k) { var p = P[k], x = ST[p.sid] && ST[p.sid].skills && ST[p.sid].skills[p.id]; if (x && x.m && Number(x.at) > t && Number(x.at) > p.at) add(p.sid, 'p', p.id, Number(x.at)); });
  var mine = {}; sgdNotes_().forEach(function (n) { if (n.byId && n.byId === who.id) mine[n.sid + '|' + n.id] = 1; });
  sgdRows_(SGD.SEEN, SGD.SEEN_H.length).forEach(function (r) { var at = sgdT_(r[0]); if (at > t && sgdTrue_(r[3]) && mine[String(r[1]) + '|' + String(r[2])]) add(String(r[1]), 't', '', at); });
  var nm = {}; try { sgdCatalog_().forEach(function (x) { if (names[x[0]]) nm[x[0]] = x[1]; }); } catch (e) {}
  var boys = Object.keys(by).map(function (k) { var b = by[k]; b.n = b.mastered.length; b.mastered = b.mastered.slice(0, 8); return b; }).sort(function (a, b) { return b.last - a.last; });
  return { at: now, since: t, boys: boys, names: nm };
}

/* v191: praise, goals and stars written since a week's start, for many boys at once (weekly reports for every parent) */
function sgWeekNotes(token, sids, start) {
  sgStaff_(token); var want = {}; (Array.isArray(sids) ? sids : []).forEach(function (x) { want[String(x)] = 1; });
  var p = String(start || '').split('-').map(Number), t0 = p.length === 3 ? new Date(p[0], p[1] - 1, p[2]).getTime() : Date.now() - 7 * 86400000, out = {};
  sgdNotes_().forEach(function (n) { if (!want[n.sid] || n.at < t0 || !(n.kind === 'praise' || n.kind === 'goal' || n.kind === 'star')) return; (out[n.sid] = out[n.sid] || []).push({ id: n.id, kind: n.kind, text: n.text, by: n.by, at: n.at }); });
  return out;
}


/* ---------- 7. v197: settings (Parsha of the week), the class sky, davening ---------- */
var SGS = { TAB: 'SG_Settings', H: ['at', 'key', 'value', 'by_id', 'by_name'],
  PARSHIYOS: ['Bereishis', 'Noach', 'Lech Lecha', 'Vayeira', 'Chayei Sarah', 'Toldos', 'Vayeitzei', 'Vayishlach', 'Vayeishev', 'Mikeitz', 'Vayigash', 'Vayechi',
    'Shemos', 'Va\'eira', 'Bo', 'Beshalach', 'Yisro', 'Mishpatim', 'Terumah', 'Tetzaveh', 'Ki Sisa', 'Vayakheil', 'Pekudei', 'Vayikra', 'Tzav', 'Shemini', 'Tazria',
    'Metzora', 'Acharei Mos', 'Kedoshim', 'Emor', 'Behar', 'Bechukosai', 'Bamidbar', 'Nasso', 'Beha\'aloscha', 'Shelach', 'Korach', 'Chukas', 'Balak', 'Pinchas',
    'Matos', 'Masei', 'Devarim', 'Va\'eschanan', 'Eikev', 'Re\'eh', 'Shoftim', 'Ki Seitzei', 'Ki Savo', 'Nitzavim', 'Vayeilech', 'Ha\'azinu', 'Vezos Habracha'] };
function sgsGet_(key) { var v = null; sgdRows_(SGS.TAB, SGS.H.length).forEach(function (r) { if (String(r[1]) === key) { try { v = JSON.parse(String(r[2])); } catch (e) { v = null; } } }); return v; }
function sgParshaInfo(token) { sgStaff_(token); var p = sgsGet_('parsha'), done = [], ST = sgdStates_();
  if (p && p.lesson) { var MK = {}; try { MK = sgpMarks_(); } catch (e) {} msRoster_().forEach(function (r) { if (sgdDone_(ST[r.id], p.lesson, r.id, MK)) done.push(r.id); }); }
  /* v202: each boy's Chumash page (ChumashPage.html, st.chm): his level, the level his rebbe set, parshiyos mastered, this week's Parsha */
  var set = sgsGet_('chmlv') || {}, chm = {};
  msRoster_().forEach(function (r) { if (/^TEST-/.test(r.id)) return; var c = sgChmOf_(ST[r.id] || {}, '', ''); c.set = Number(set[r.id]) || 0;
    var pp = (((ST[r.id] || {}).chm || {}).p || {})[p && p.name || ''] || null; c.cur = pp ? { m: pp.m || [], k: pp.k || {} } : null; chm[r.id] = c; });
  return { parshiyos: SGS.PARSHIYOS, parsha: p, done: done, chm: chm }; }
/* v202: a boy's Chumash summary. start/end ('' = all time) pick the parshiyos he mastered in that week. */
function sgChmOf_(st, start, end) {
  var c = (st && st.chm) || {}, P = c.p || {}, n = 0, wk = [];
  Object.keys(P).forEach(function (k) { var x = P[k] || {}, m = x.m || []; if (m.length) { n++;
    if (start && x.at) { var dk = sgdDayKey_(Number(x.at)); if (dk >= start && dk < end) wk.push([k, Math.max.apply(null, m)]); } } });
  return { lv: Number(c.lv) || 0, n: n, wk: wk, last: c.last || '', used: Object.keys(P).length };
}
/* v202: the rebbe sets the Chumash level for one or more boys (0 = let the boy choose) */
function sgChmSetLevel(token, sids, lv) {
  var s = sgStaff_(token), who = sgWho_(s); lv = Math.round(Number(lv) || 0); if (lv < 0 || lv > 8) throw new Error('Pick a level from 1 to 8.');
  var R = {}; msRoster_().forEach(function (r) { R[r.id] = 1; });
  sgLock_(function () { var cur = sgsGet_('chmlv') || {}; (Array.isArray(sids) ? sids : [sids]).forEach(function (sid) { sid = String(sid); if (!R[sid]) return; if (lv) cur[sid] = lv; else delete cur[sid]; });
    sgdTab_(SGS.TAB, SGS.H).appendRow([new Date(), 'chmlv', JSON.stringify(cur), who.id || '', who.name || 'Staff']); });
  return sgParshaInfo(token);
}
/* the rebbe picks this week's Parsha (never computed: a wrong Parsha is worse than none) and, if he wants, one Kodesh lesson that goes with it */
function sgSetParsha(token, name, lessonId, note) {
  var s = sgStaff_(token), who = sgWho_(s); name = String(name || ''); lessonId = String(lessonId || '');
  if (name && SGS.PARSHIYOS.indexOf(name) < 0) throw new Error('Pick a Parsha from the list.');
  var lname = lessonId ? sgdLessonName_(lessonId) : ''; if (lessonId && !lname) throw new Error('That lesson was not found.');
  var v = name ? { name: name, lesson: lessonId, lessonName: lname, note: String(note || '').slice(0, 200), at: Date.now(), by: who.name || 'Staff' } : null;
  sgLock_(function () { sgdTab_(SGS.TAB, SGS.H).appendRow([new Date(), 'parsha', JSON.stringify(v), who.id || '', who.name || 'Staff']); });
  return sgParshaInfo(token);
}
/* the class sky (projector): what happened since `since` for the boys in sids. Effort only: no scores, no ranking. */
function sgClassSky(token, sids, since) {
  sgStaff_(token); var want = {}, R = sgdRoster_(); (Array.isArray(sids) ? sids : []).forEach(function (x) { if (R[x]) want[String(x)] = 1; });
  var all = !Object.keys(want).length; since = Number(since) || (Date.now() - 120000); var es = msTab_('evidence'), m = es.getLastRow(), ev = [], day0 = sgToday_(), today = { n: 0, k: 0, boys: {} };
  if (m >= 2) es.getRange(Math.max(2, m - 2999), 1, Math.min(m - 1, 3000), 6).getValues().forEach(function (r) { var sid = String(r[1] || ''); if (!R[sid] || /^TEST-/.test(sid)) return; if (!all && !want[sid]) return;
    var t = sgdT_(r[0]); if (!t) return; var k = /^(LK|HEB)\./.test(String(r[2] || ''));
    if (sgdDayKey_(t) === day0) { today.n++; if (k) today.k++; today.boys[sid] = 1; }
    if (t > since) ev.push({ t: t, first: String(R[sid]).split(' ')[0], k: k }); });
  ev.sort(function (a, b) { return a.t - b.t; });
  return { now: Date.now(), ev: ev.slice(-80), today: { n: today.n, k: today.k, boys: Object.keys(today.boys).length } };
}
