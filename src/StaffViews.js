/* StaffViews.js — v176 (server side of StaffPlus.html; a .js and an .html file cannot share a name) (takeover3, HoS 2026-11-13: "deep dive into the staff portal… make Limudei Kodesh as comprehensive and as
   important as the other grid… very useful, simple, clear, fast, transparent"). READ-ONLY data for the new staff views (StaffPlus.html).
   Nothing here writes. Kodesh never enters General Studies totals. TEST- boys are left out (as on the Kodesh page). */

var SGP_TRACK_NAMES = { KRI: 'Kriyah', CHU: 'Chumash', RAS: 'Rashi', MSH: 'Mishnayos', GEM: 'Gemara', LSH: 'Lashon Hakodesh', KES: 'Krias Shema', PAR: 'Parsha', NAV: 'Navi',
  MFG: 'Mefarshim', TEF: 'Tefillah', HAL: 'Halacha', YT: 'Yomim Tovim', MID: 'Middos', TOL: 'Toldos' };
var SGP_TRACK_ORDER = ['KRI', 'CHU', 'RAS', 'MSH', 'GEM', 'LSH', 'TEF', 'HAL', 'PAR', 'NAV', 'YT', 'MID', 'KES', 'MFG', 'TOL'];

/* the Kodesh lessons in teaching order, per track, with names (from KodeshMore; HEB.* = Lashon Hakodesh) */
/* v190: the parsed list is cached (key = pack stamp, so a new KodeshMore pack is read at once) and kept for the rest of the call */
var SGP_KL_MEMO_ = null;
function sgpKodeshLessons_() {
  if (SGP_KL_MEMO_) return SGP_KL_MEMO_;
  var key = 'sgp_kl:' + (typeof TL_PACK_STAMP !== 'undefined' ? TL_PACK_STAMP : '0') + ':k3tt8', c = null;
  try { c = CacheService.getScriptCache(); var hit = c.get(key); if (hit) { SGP_KL_MEMO_ = JSON.parse(hit); return SGP_KL_MEMO_; } } catch (e) {}
  var L = sgpKodeshLessonsRead_();
  if (L.order && Object.keys(L.order).length) { SGP_KL_MEMO_ = L; try { var j = JSON.stringify(L); if (c && j.length < 95000) c.put(key, j, 21600); } catch (e) {} }
  return L;
}
function sgpKodeshLessonsRead_() {
  var t = ''; try { t = tlFileText_('KodeshMore'); } catch (e) { return { order: {}, names: {} }; }
  var kx = ''; try { kx = tlFileText_('KriyahMore'); } catch (e) {}   /* v203: the nekudos (KriyahMore.html), placed after the Kriyah Level 1 lessons */
  var order = {}, names = {}, seen = {}, m;
  var re = /['"](LK\.([A-Z]+)\.L(\d\d)\.\d\d(?:\.[a-z])?)['"]\s*:\s*\{\s*["']?name["']?\s*:\s*(['"])((?:\\.|(?!\4)[^\\])*)\4/g;
  while ((m = re.exec(t))) { if (seen[m[1]]) continue; seen[m[1]] = 1; (order[m[2]] = order[m[2]] || []).push(m[1]); names[m[1]] = m[5].replace(/\\(.)/g, '$1'); }
  var hre = /['"](HEB\.[A-Z]+\.L(\d\d)\.\d\d)['"]\s*:\s*\{\s*["']?name["']?\s*:\s*(['"])((?:\\.|(?!\3)[^\\])*)\3/g;
  while ((m = hre.exec(t))) { if (seen[m[1]]) continue; seen[m[1]] = 1; (order.LSH = order.LSH || []).push(m[1]); names[m[1]] = m[4].replace(/\\(.)/g, '$1'); }
  if (kx) { var kn = [], km; var kre = /['"](LK\.KRI\.L\d\d\.\d\d\.[a-z])['"]\s*:\s*\{\s*name\s*:\s*(['"])((?:\\.|(?!\2)[^\\])*)\2/g;
    while ((km = kre.exec(kx))) { if (seen[km[1]]) continue; seen[km[1]] = 1; kn.push(km[1]); names[km[1]] = km[3].replace(/\\(.)/g, '$1'); }
    var TO = ['LK.KRI.L01.06.a', 'LK.KRI.L01.06.b', 'LK.KRI.L01.07.a', 'LK.KRI.L01.07.b', 'LK.KRI.L02.01.a', 'LK.KRI.L01.08.a', 'LK.KRI.L01.07.c', 'LK.KRI.L01.08.b', 'LK.KRI.L02.04.a', 'LK.KRI.L02.02.a', 'LK.KRI.L02.02.b', 'LK.KRI.L02.03.a', 'LK.KRI.L02.03.b', 'LK.KRI.L02.05.a', 'LK.KRI.L02.06.a'];   /* v238 Blending */
    kn.sort(function (a, b) { return TO.indexOf(a) - TO.indexOf(b); });
    var K = order.KRI = order.KRI || [], at = 0; K.forEach(function (id, i) { if (/^LK\.KRI\.L01\./.test(id)) at = i + 1; }); order.KRI = K.slice(0, at).concat(kn, K.slice(at)); }
  var tx = ''; try { tx = tlFileText_('TorahTracks'); } catch (e) {}   /* v204: Halacha, Tefillah, Yom Tov, Middos, Parsha, Navi */
  if (tx) { var tre = /['"](LK\.([A-Z]+)\.L(\d\d)\.\d\d(?:\.[a-z])?)['"]\s*:\s*\{\s*name\s*:\s*(['"])((?:\\.|(?!\4)[^\\])*)\4/g;
    while ((m = tre.exec(tx))) { if (seen[m[1]]) continue; seen[m[1]] = 1; (order[m[2]] = order[m[2]] || []).push(m[1]); names[m[1]] = m[5].replace(/\\(.)/g, '$1'); }
    ['TEF', 'HAL', 'PAR', 'NAV', 'YT', 'MID'].forEach(function (k) { if (order[k]) order[k].sort(); }); }
  if (order.LSH) order.LSH.sort(function (a, b) { return plMathLevel_(a) - plMathLevel_(b); });   /* HEB ladder by level */
  return { order: order, names: names };
}
function sgpTrackOf_(id) { id = String(id); if (/^HEB\./.test(id)) return 'LSH'; var m = /^LK\.([A-Z]+)\./.exec(id); return m ? m[1] : ''; }

/* the Limudei Kodesh grid: every boy x every Kodesh track, like the General Studies grid */
function sgKodeshGrid(token) {
  sgStaff_(token);
  var L = sgpKodeshLessons_(), tracks = SGP_TRACK_ORDER.filter(function (k) { return (L.order[k] || []).length; });
  Object.keys(L.order).forEach(function (k) { if (tracks.indexOf(k) < 0) tracks.push(k); });
  var states = {}; msRows_('state').forEach(function (r) { try { states[String(r[0])] = JSON.parse(r[1]); } catch (e) {} });
  var evAll = sgEvidence_(), now = Date.now(), MK = {}; try { MK = sgpMarks_(); } catch (e) {}
  var boys = msRoster_().filter(function (r) { return !/^TEST-/.test(r.id); }).map(function (r) {
    var sk = (states[r.id] || {}).skills || {}, ev = evAll[r.id] || {}, cells = {}, marked = {};
    Object.keys(MK).forEach(function (k) { if (k.indexOf(r.id + '|') === 0) marked[k.slice(r.id.length + 1)] = MK[k]; });
    tracks.forEach(function (k) {
      var ids = L.order[k] || [], mast = function (id) { return !!((sk[id] && sk[id].m) || marked[id]); }, done = ids.filter(mast).length;
      var i = -1; for (var j = 0; j < ids.length; j++) if (!mast(ids[j])) { i = j; break; }
      var cur = i >= 0 ? ids[i] : '', nxt = i >= 0 ? (ids.slice(i + 1).filter(function (x) { return !mast(x); })[0] || '') : '';
      var lvl = cur ? plMathLevel_(cur) : (ids.length ? plMathLevel_(ids[ids.length - 1]) : 0);
      var inL = ids.filter(function (x) { return plMathLevel_(x) === lvl; }), inLdone = inL.filter(mast).length;
      var mine = Object.keys(ev).filter(function (s) { return sgpTrackOf_(s) === k; }), last = 0, missToday = 0, ansToday = 0;
      mine.forEach(function (s) { last = Math.max(last, ev[s].last || 0); });
      var e = cur ? ev[cur] : null; if (e) missToday = e.missToday || 0;
      var status = 'gray';
      if (!ids.length) status = 'none';
      else if (!cur) status = 'green';
      else if (e && e.miss >= 4 && !mast(cur)) status = 'red';
      else if (done || mine.length) status = 'yellow';
      cells[k] = { done: done, total: ids.length, level: lvl, lvDone: inLdone, lvTotal: inL.length, now: cur, next: nxt, status: status, dot: !!(e && e.missToday >= 3), last: last,
        miss: e ? e.miss : 0, ok: e ? e.ok : 0, lvl: inL.map(function (x) { var mk = marked[x]; return [x, mast(x) ? 1 : 0, mk ? mk.by : '', mk ? mk.at : 0, (sk[x] && sk[x].m) ? 1 : 0]; }) };
    });
    return { id: r.id, name: r.name, cells: cells };
  }).sort(function (a, b) { return a.name.localeCompare(b.name); });
  var names = {}; Object.keys(L.names).forEach(function (id) { names[id] = L.names[id]; });
  return { at: now, tracks: tracks.map(function (k) { return [k, SGP_TRACK_NAMES[k] || k, (L.order[k] || []).length]; }), boys: boys, names: names };
}

/* today at a glance: who is working, answers, right, mastered today (General Studies and Kodesh apart) */
function sgToday(token) {
  sgStaff_(token);
  var names = {}; msRoster_().forEach(function (x) { if (!/^TEST-/.test(x.id)) names[x.id] = x.name; });
  var es = msTab_('evidence'), m = es.getLastRow(), today = sgToday_(), by = {};
  if (m >= 2) es.getRange(Math.max(2, m - 7999), 1, Math.min(m - 1, 8000), 10).getValues().forEach(function (r) {
    var sid = String(r[1] || ''); if (!names[sid]) return;
    var at = r[0] instanceof Date ? r[0] : new Date(r[0]); if (isNaN(at) || Utilities.formatDate(at, 'America/New_York', 'yyyy-MM-dd') !== today) return;
    var sk = String(r[2] || ''), kod = /^(LK|HEB)\./.test(sk), b = by[sid] = by[sid] || { a: 0, ok: 0, ka: 0, kok: 0, last: 0, first: 0, skills: {} };
    if (kod) { b.ka++; if (Number(r[5]) === 1) b.kok++; } else { b.a++; if (Number(r[5]) === 1) b.ok++; }
    var t = at.getTime(); b.last = Math.max(b.last, t); b.first = b.first ? Math.min(b.first, t) : t; b.skills[sk] = 1;
  });
  var mt = {}; msRows_('state').forEach(function (r) { var sid = String(r[0]); if (!names[sid]) return; var st = null; try { st = JSON.parse(r[1]); } catch (e) {} var sk = (st && st.skills) || {}, g = 0, k = 0;
    Object.keys(sk).forEach(function (id) { var x = sk[id]; if (!x || !x.m || !x.at) return; if (Utilities.formatDate(new Date(Number(x.at)), 'America/New_York', 'yyyy-MM-dd') !== today) return; if (/^(LK|HEB)\./.test(id)) k++; else g++; });
    mt[sid] = [g, k]; });
  var boys = Object.keys(names).map(function (sid) { var b = by[sid] || { a: 0, ok: 0, ka: 0, kok: 0, last: 0, first: 0, skills: {} }, x = mt[sid] || [0, 0];
    return { id: sid, name: names[sid], answers: b.a, right: b.ok, kAnswers: b.ka, kRight: b.kok, last: b.last, first: b.first, skills: Object.keys(b.skills).length, mastered: x[0], kMastered: x[1] }; })
    .sort(function (a, b) { return a.name.localeCompare(b.name); });
  return { at: Date.now(), day: today, boys: boys };
}

/* levels: Math, Reading, Social Studies — who set each one and when, and the last check he took */
function sgLevels(token) {
  sgStaff_(token);
  var P = plPlacements_(), checks = {};
  plRows_('checks').forEach(function (r) { var sid = String(r[1] || ''), sub = String(r[2] || ''); if (!sid || !sub) return; var at = r[0] ? new Date(r[0]).getTime() : 0;
    var c = (checks[sid] = checks[sid] || {}); if (!c[sub] || at >= c[sub].at) c[sub] = { level: Number(r[3]) || 0, at: at }; });
  var boys = msRoster_().filter(function (r) { return !/^TEST-/.test(r.id); }).map(function (r) {
    var p = P[r.id] || {}, out = {};
    ['MATH', 'READ', 'SOC'].forEach(function (k) { var x = p[k]; out[k] = x && x.level ? { level: x.level, by: x.by || '', at: x.at || 0 } : null; });
    return { id: r.id, name: r.name, place: out, checks: checks[r.id] || {} };
  }).sort(function (a, b) { return a.name.localeCompare(b.name); });
  return { at: Date.now(), worlds: PL.WORLDS, boys: boys };
}

/* ===== v177 (takeover3): groups picker, rebbe bechina sign-off for Kodesh lessons, and a boy's day minute by minute ===== */

/* every group a staff member can filter by: his own classes (My classes), all classes (Head of School), and the placement groups */
function sgGroups(token) {
  var s = sgStaff_(token), who = sgWho_(s), head = sgIsHead_(s), out = [];
  try { crRows_(CR.CLS).map(crClassRow_).filter(function (c) { return c.active && (head || c.staffId === who.id); }).forEach(function (c) {
    out.push({ id: 'c:' + c.id, name: c.name + (c.staffId === who.id ? '' : ' (' + c.staff + ')'), kind: c.staffId === who.id ? 'mine' : 'class', sids: c.sids || [] }); }); } catch (e) {}
  try { plGroups_().forEach(function (g) { out.push({ id: 'g:' + g.id, name: g.name, kind: 'group', sids: g.members || [] }); }); } catch (e) {}
  return out.map(function (g) { g.sids = (g.sids || []).filter(function (x) { return !TL_SCOPE_ || !!TL_SCOPE_[String(x)]; }); return g; });   /* Access.js scope */
}

/* Kodesh bechina marks: KD_Marks (append only; the newest row for a boy + lesson wins; undo = a row with undo TRUE).
   Kept OUTSIDE the boy's saved state, so his own saves can never wipe a mark; msLoad merges marks into what he sees. */
var SGP_MARK_TAB = 'KD_Marks', SGP_MARK_HEAD = ['at', 'student_id', 'lesson_id', 'by_id', 'by_name', 'note', 'undo'];
function sgpMarkTab_() { var ss = msBook_(), sh = ss.getSheetByName(SGP_MARK_TAB); if (!sh) { sh = ss.insertSheet(SGP_MARK_TAB); sh.getRange(1, 1, 1, SGP_MARK_HEAD.length).setValues([SGP_MARK_HEAD]); sh.setFrozenRows(1); } return sh; }
function sgpMarks_() {
  var sh = msBook_().getSheetByName(SGP_MARK_TAB); if (!sh) return {}; var n = sh.getLastRow(); if (n < 2) return {};
  var out = {}; sh.getRange(2, 1, n - 1, SGP_MARK_HEAD.length).getValues().forEach(function (r) { var sid = String(r[1] || ''), id = String(r[2] || ''); if (!sid || !id) return;
    var undo = r[6] === true || String(r[6]).toUpperCase() === 'TRUE'; var k = sid + '|' + id; if (undo) delete out[k]; else out[k] = { at: r[0] ? new Date(r[0]).getTime() : 0, by: String(r[4] || ''), note: String(r[5] || '') }; });
  return out;
}
/* called by msLoad (MiddleSchool.js): a marked lesson shows as mastered on the boy's own screen */
function sgpMergeMarks_(states) {
  var M = sgpMarks_(), keys = Object.keys(M); if (!keys.length) return;
  keys.forEach(function (k) { var i = k.indexOf('|'), sid = k.slice(0, i), id = k.slice(i + 1), st = states[sid]; if (!st) return; st.skills = st.skills || {};
    if (!(st.skills[id] && st.skills[id].m)) st.skills[id] = { m: true, at: M[k].at || Date.now(), first: false, stars: 2, bechina: M[k].by || 'rebbe' }; });
}
function sgKodeshMark(token, sid, lessonId, note, undo) { tlGuard_(token, sid);
  var s = sgStaff_(token), who = sgWho_(s); sid = String(sid || ''); lessonId = String(lessonId || '');
  if (!msRoster_().some(function (x) { return x.id === sid; })) throw new Error('That student is not on the list.');
  var L = sgpKodeshLessons_(); if (!L.names[lessonId]) throw new Error('That is not a Limudei Kodesh lesson.');
  sgLock_(function () { sgpMarkTab_().appendRow([new Date(), sid, lessonId, who.id || '', who.name || 'Staff', String(note || '').slice(0, 200), !!undo]); });
  return sgKodeshGrid(token);
}

/* one boy's day, minute by minute (today's answers, grouped into lessons) */
function sgBoyDay(token, sid) { tlGuard_(token, sid);
  sgStaff_(token); sid = String(sid || '');
  var es = msTab_('evidence'), m = es.getLastRow(), today = sgToday_(), rows = [];
  if (m >= 2) es.getRange(Math.max(2, m - 7999), 1, Math.min(m - 1, 8000), 10).getValues().forEach(function (r) {
    if (String(r[1] || '') !== sid) return; var at = r[0] instanceof Date ? r[0] : new Date(r[0]); if (isNaN(at) || Utilities.formatDate(at, 'America/New_York', 'yyyy-MM-dd') !== today) return;
    rows.push({ t: at.getTime(), sk: String(r[2] || ''), ph: String(r[3] || ''), ok: Number(r[5]) === 1, s: Number(r[9]) || 0 }); });
  rows.sort(function (a, b) { return a.t - b.t; });
  var blocks = []; rows.forEach(function (x) { var b = blocks[blocks.length - 1]; if (!b || b.sk !== x.sk || x.t - b.to > 20 * 60000) { b = { sk: x.sk, from: x.t, to: x.t, marks: [] }; blocks.push(b); } b.to = x.t; b.marks.push(x.ok ? 1 : 0); });
  return { day: today, blocks: blocks };
}

/* v177: one boy, one Kodesh track, every lesson (for the drawer: level tabs, marks on any level) */
function sgKodeshBoy(token, sid, k) { tlGuard_(token, sid);
  sgStaff_(token); sid = String(sid || ''); k = String(k || '');
  var L = sgpKodeshLessons_(), ids = L.order[k] || []; if (!ids.length) throw new Error('No lessons in that track yet.');
  var st = {}; msRows_('state').some(function (r) { if (String(r[0]) === sid) { try { st = JSON.parse(r[1]); } catch (e) {} return true; } return false; });
  var sk = st.skills || {}, MK = {}; try { MK = sgpMarks_(); } catch (e) {}
  return { sid: sid, k: k, lessons: ids.map(function (id) { var mk = MK[sid + '|' + id]; return [id, L.names[id] || id, plMathLevel_(id), (sk[id] && sk[id].m) ? 1 : 0, mk ? mk.by : '', mk ? mk.at : 0]; }) };
}
