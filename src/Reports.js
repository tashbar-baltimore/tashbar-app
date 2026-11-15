/* ===== Reports.js (v68, takeover builder, 2026-11-11): "Report a problem" + hardest questions.
   Boys pick one of 4 set reasons (no typing, so no silly text). Staff may add a short note.
   Reports go to the school database tab "Problem_Reports". Staff see them, grouped by question, on the staff screen,
   next to the questions most boys miss (from MS_Evidence). Nothing here touches money or lesson rules. ===== */
var RP = {
  TAB: 'Problem_Reports',
  HEAD: ['at', 'role', 'who_id', 'who_name', 'skill_id', 'phase', 'item', 'reason', 'note', 'status'],
  REASONS: { wrong: 'The answer is wrong', confusing: 'I don\'t understand the question', broken: 'The picture or sound doesn\'t work', other: 'Something else is wrong' },
  BOY_DAY_MAX: 8
};
function rpSheet_() {
  var ss = msBook_(), sh = ss.getSheetByName(RP.TAB);
  if (!sh) { sh = ss.insertSheet(RP.TAB); sh.getRange(1, 1, 1, RP.HEAD.length).setValues([RP.HEAD]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function rpClip_(s, n) { return String(s == null ? '' : s).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n); }
function msReport(token, r) {
  var s = msSession_(token); r = r || {};
  var reason = String(r.reason || ''); if (!RP.REASONS[reason]) throw new Error('Pick what is wrong.');
  var staff = s.role === 'staff', who = staff ? String((s.who && s.who.id) || 'staff') : String(s.sid || '');
  var c = CacheService.getScriptCache(), k = 'rp_' + who + '_' + Utilities.formatDate(new Date(), 'America/New_York', 'yyyyMMdd'), n = Number(c.get(k) || 0);
  if (!staff && n >= RP.BOY_DAY_MAX) return { ok: false, limit: true };
  try { c.put(k, String(n + 1), 21600); } catch (e) {}
  rpSheet_().appendRow([new Date(), staff ? 'staff' : 'boy', who, staff ? String((s.who && s.who.name) || 'Staff') : '', rpClip_(r.skill, 40), rpClip_(r.phase, 12), rpClip_(r.item, 400), reason, staff ? rpClip_(r.note, 300) : '', 'open']);
  return { ok: true };
}
function sgReports(token) {
  sgStaff_(token);
  var names = {}; msRoster_().forEach(function (x) { names[x.id] = x.name; });
  var sh = rpSheet_(), n = sh.getLastRow(), groups = {};
  if (n >= 2) sh.getRange(Math.max(2, n - 1999), 1, Math.min(n - 1, 2000), RP.HEAD.length).getValues().forEach(function (r) {
    if (String(r[9]) !== 'open') return;
    var key = String(r[4]) + '|' + String(r[6]), g = groups[key] = groups[key] || { skill: String(r[4]), item: String(r[6]), phase: String(r[5]), n: 0, reasons: {}, notes: [], who: [], last: 0 };
    g.n++; g.reasons[r[7]] = (g.reasons[r[7]] || 0) + 1;
    var at = r[0] instanceof Date ? r[0].getTime() : 0; if (at > g.last) g.last = at;
    if (r[8]) g.notes.push(String(r[3] || 'Staff') + ': ' + String(r[8]));
    var nm = r[1] === 'staff' ? String(r[3] || 'Staff') : (names[r[2]] || 'a student'); if (g.who.indexOf(nm) < 0 && g.who.length < 6) g.who.push(nm);
  });
  var reports = Object.keys(groups).map(function (k) { return groups[k]; }).sort(function (a, b) { return b.n - a.n || b.last - a.last; }).slice(0, 80);
  /* hardest questions: practice/check answers in the last 20,000 rows; real boys only; at least 8 answers */
  var es = msTab_('evidence'), m = es.getLastRow(), q = {};
  if (m >= 2) es.getRange(Math.max(2, m - 19999), 1, Math.min(m - 1, 20000), 6).getValues().forEach(function (r) {
    var sid = String(r[1] || ''), ph = String(r[3] || ''); if (!sid || /^TEST-/.test(sid) || (ph !== 'practice' && ph !== 'check')) return;
    var key = String(r[2]) + '|' + String(r[4]), x = q[key] = q[key] || { skill: String(r[2]), item: String(r[4]), n: 0, miss: 0, boys: {} };
    x.n++; if (Number(r[5]) !== 1) x.miss++; x.boys[sid] = 1;
  });
  var hard = Object.keys(q).map(function (k) { var x = q[k]; return { skill: x.skill, item: x.item, n: x.n, miss: x.miss, boys: Object.keys(x.boys).length, rate: x.miss / x.n }; })
    .filter(function (x) { return x.n >= 8 && x.boys >= 3 && x.rate >= 0.35; }).sort(function (a, b) { return b.rate - a.rate || b.n - a.n; }).slice(0, 30);
  return { reports: reports, hard: hard, reasons: RP.REASONS };
}
function sgReportDone(token, skill, item) {
  sgStaff_(token); skill = String(skill || ''); item = String(item || '');
  return sgLock_(function () {
    var sh = rpSheet_(), n = sh.getLastRow(); if (n < 2) return sgReports(token);
    var v = sh.getRange(2, 1, n - 1, RP.HEAD.length).getValues();
    v.forEach(function (r, i) { if (String(r[9]) === 'open' && String(r[4]) === skill && String(r[6]) === item) sh.getRange(i + 2, 10).setValue('done'); });
    return sgReports(token);
  });
}

/* ===== v70: "Needs you now" for the staff screen. Reads the latest 4,000 answers (today only).
   stuck   = 4+ misses in a row on the skill he is on now
   guess   = 5 of his last 6 answers in under 2 seconds, with 3+ of them wrong
   checkin = he failed the same skill's check twice today
   idle    = he answered in the last 40 minutes, but nothing for 10+ minutes
   Real boys only (TEST- ids left out). ===== */
function sgNow(token) {
  sgStaff_(token);
  var names = {}; msRoster_().forEach(function (x) { names[x.id] = x.name; });
  var es = msTab_('evidence'), m = es.getLastRow(), now = Date.now(), today = sgToday_(), by = {};
  if (m >= 2) es.getRange(Math.max(2, m - 3999), 1, Math.min(m - 1, 4000), 10).getValues().forEach(function (r) {
    var sid = String(r[1] || ''); if (!sid || /^TEST-/.test(sid) || !names[sid]) return;
    var at = r[0] instanceof Date ? r[0] : new Date(r[0]); if (isNaN(at) || Utilities.formatDate(at, 'America/New_York', 'yyyy-MM-dd') !== today) return;
    (by[sid] = by[sid] || []).push({ t: at.getTime(), sk: String(r[2] || ''), ph: String(r[3] || ''), ok: Number(r[5]) === 1, s: Number(r[9]) || 0 });
  });
  var out = [];
  Object.keys(by).forEach(function (sid) {
    var a = by[sid].sort(function (x, y) { return x.t - y.t; }), last = a[a.length - 1], cur = last.sk, run = 0, i;
    for (i = a.length - 1; i >= 0 && a[i].sk === cur; i--) { if (a[i].ok) break; run++; }
    var six = a.slice(-6), fast = six.filter(function (x) { return x.s > 0 && x.s < 2; }).length, wrong = six.filter(function (x) { return !x.ok; }).length;
    var checkFails = {}; a.forEach(function (x) { if (x.ph === 'check' && !x.ok) checkFails[x.sk] = (checkFails[x.sk] || 0) + 1; });
    var idleMin = Math.floor((now - last.t) / 60000);
    if (run >= 4) out.push({ sid: sid, name: names[sid], kind: 'stuck', skill: cur, n: run, at: last.t });
    else if (six.length >= 6 && fast >= 5 && wrong >= 3) out.push({ sid: sid, name: names[sid], kind: 'guess', skill: cur, n: fast, at: last.t });
    else if ((checkFails[cur] || 0) >= 4) out.push({ sid: sid, name: names[sid], kind: 'checkin', skill: cur, n: checkFails[cur], at: last.t });
    else if (idleMin >= 10 && idleMin <= 40) out.push({ sid: sid, name: names[sid], kind: 'idle', skill: cur, n: idleMin, at: last.t });
  });
  var rank = { stuck: 0, checkin: 1, guess: 2, idle: 3 };
  return { at: now, list: out.sort(function (x, y) { return rank[x.kind] - rank[y.kind] || y.at - x.at; }).slice(0, 25) };
}
