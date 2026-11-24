/* TODAY'S LIST (Core Growth job D, HoS 2026-11-24; plan: docs/core-growth/D-plan.md).
   "I would much rather make it dependent on covering a certain amount of material." / "If you do everything, you get your bonus."
   A boy's day is a LIST of material to cover, taken from where he stands on each ladder: core first (Reading, then Writing and
   Language), then Math, then Kodesh, then Science or Social Studies (they take turns by day). NO minutes and NO timers.
   - A line is covered by a lesson he MASTERED today in that subject (the server's own paid "Mastered <id>" ledger row, never what the
     page says), or by a LEVEL CHECK he passed today there (he showed he already knows it, so a fast boy moves on at once).
   - A subject with nothing at his level gives its lines to Reading (core first). Nothing anywhere = an empty list (Arcade open, no bonus).
   - MONEY: nothing here pays. Money.js moneyDailyGoal_ asks tdlStatus_ whether the whole list is done and then pays the SAME daily bonus
     (rule dailyGoal, same key daily3:, so the treasure chest follows by itself). Every amount stays in MONEY.RULES.
   - Behind a switch: TDL_LIVE 'test' = TEST- boys only (now). 'on' = every boy = HoS DECISION. Until then real boys keep "3 lessons".
   - K-1 boys (grade 0-1) keep the games-only home and the old rule for now; their list of games is the next job D step. */
var TDL_LIVE = 'test';
var TDL = {
  VERSION: 'tdl-0.1.0',
  /* Suggested default (HoS DECISION pending, D-plan.md section 4): 6 things, about 45-60 minutes for a typical boy. */
  DEFAULT: { READ: 2, LANG: 1, MATH: 1, KODESH: 1, KNOW: 1 },
  ORDER: ['READ', 'LANG', 'MATH', 'KODESH', 'KNOW'],
  NAMES: { READ: 'Reading', LANG: 'Writing', MATH: 'Math', KODESH: 'Kodesh', SCI: 'Science', SOC: 'Social Studies' },
  MAX_EACH: 5,
  CACHE_S: 21600
};
function tdlIsTest_(sid) { return /^TEST-/.test(String(sid || '')); }
function tdlGrade_(sid) { try { return typeof kmGradeOf_ === 'function' ? kmGradeOf_(String(sid)) : null; } catch (e) { return null; } }
function tdlOn_(sid) {
  sid = String(sid || '');
  if (!sid || TDL_LIVE === 'off') return false;
  if (TDL_LIVE !== 'on' && !tdlIsTest_(sid)) return false;
  var g = tdlGrade_(sid); return !(g != null && g <= 1);   /* K-1: games-only home, unchanged for now */
}
/* which line of the list a skill belongs to */
function tdlSubjOf_(id) {
  var m = /^([A-Z]+)\./.exec(String(id || '')); if (!m) return '';
  var p = m[1];
  if (p === 'READ') return 'READ';
  if (p === 'LANG' || p === 'WRIT') return 'LANG';
  if (p === 'MATH') return 'MATH';
  if (p === 'LK' || p === 'HEB') return 'KODESH';
  if (p === 'SCI' || p === 'SS') return 'KNOW';
  return '';
}
/* how much of each subject: the default, then the school's setting, then his own (staff screens come in a later job D PR) */
function tdlClean_(o) {
  var out = {}; if (!o || typeof o !== 'object') return null;
  TDL.ORDER.forEach(function (k) { if (o[k] == null) return; var n = Number(o[k]); if (Number.isInteger(n) && n >= 0 && n <= TDL.MAX_EACH) out[k] = n; });
  return out;
}
function tdlAmounts_(sid) {
  var a = JSON.parse(JSON.stringify(TDL.DEFAULT));
  ['tdl:default', 'tdl:boy:' + sid].forEach(function (id) {
    var v = null; try { v = typeof setting_ === 'function' ? tdlClean_(setting_(id)) : null; } catch (e) { v = null; }
    if (v) Object.keys(v).forEach(function (k) { a[k] = v[k]; });
  });
  return a;
}
/* what he has at his level today, from his own map (KidMap.js), kept for the day so the list does not change under him */
function tdlAvail_(sid, day) {
  var ck = 'tdl_av_' + sid + '_' + day, c = null;
  try { c = CacheService.getScriptCache(); var hit = c.get(ck); if (hit) return JSON.parse(hit); } catch (e) {}
  var m = null; try { m = kmMapFor_(String(sid)); } catch (e) { m = null; }
  var S = (m && m.subjects) || {}, K = (m && m.kodesh) || {}, av = {};
  ['READ', 'LANG', 'MATH'].forEach(function (k) { if (S[k] && S[k].now) av[k] = k; });
  var kk = Object.keys(K).filter(function (k) { return K[k] && K[k].now; });
  if (kk.length) { var pref = ['K:CHU', 'K:GEM', 'K:MSH', 'K:RAS', 'K:KRI']; kk.sort(function (a, b) { return (pref.indexOf(a) < 0 ? 9 : pref.indexOf(a)) - (pref.indexOf(b) < 0 ? 9 : pref.indexOf(b)); }); av.KODESH = kk[0]; }
  else if (S.HEB && S.HEB.now) av.KODESH = 'HEB';
  var p = day.split('-'), dn = Math.floor(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5), know = dn % 2 === 0 ? ['SCI', 'SOC'] : ['SOC', 'SCI'];   /* take turns by day */
  for (var i = 0; i < know.length; i++) if (S[know[i]] && S[know[i]].now) { av.KNOW = know[i]; break; }
  try { if (c) c.put(ck, JSON.stringify(av), TDL.CACHE_S); } catch (e) {}
  return av;
}
/* what he really covered today: the server's paid mastery rows and today's level check passes */
function tdlCovered_(sid, day) {
  var cov = {}, pre = 'ms:' + sid + ':Mastered ';
  function add(k, id) { if (!k) return; (cov[k] = cov[k] || []).push(id); }
  moneyRowsFor_(sid).slice().sort(function (a, b) { return a.at < b.at ? -1 : a.at > b.at ? 1 : 0; }).forEach(function (r) {
    if (String(r.key || '').indexOf(pre) !== 0 || moneyDay_(r.at) !== day) return;
    var id = String(r.key).slice(pre.length); add(tdlSubjOf_(id), id);
  });
  try {
    if (typeof pfLcPasses_ === 'function') { var P = pfLcPasses_(sid);
      ['MATH', 'READ'].forEach(function (k) { Object.keys(P[k] || {}).forEach(function (L) { var x = P[k][L]; if (x && x.at && !x.old && moneyDay_(new Date(x.at).toISOString()) === day) add(k, 'LEVELCHECK.' + k + '.L' + L); }); }); }
  } catch (e) {}
  return cov;
}
function tdlStatus_(sid) {
  sid = String(sid || ''); var day = moneyDay_(), amt = tdlAmounts_(sid), av = tdlAvail_(sid, day), cov = tdlCovered_(sid, day);
  var items = [], spare = 0;
  TDL.ORDER.forEach(function (k) { var n = amt[k] || 0; if (!n) return; if (!av[k] && !(cov[k] && cov[k].length)) { spare += n; return; } items.push({ k: k, n: n }); });
  if (spare && items.length) { var t = items.filter(function (x) { return x.k === 'READ'; })[0] || items[0]; t.n += spare; }
  var done = 0, total = 0;
  items.forEach(function (x) {
    var ids = (cov[x.k] || []).slice(0, x.n); x.c = ids.length; x.ids = ids; x.w = av[x.k] || '';
    x.name = x.k === 'KNOW' ? TDL.NAMES[av.KNOW || 'SCI'] : TDL.NAMES[x.k]; done += x.c; total += x.n;
  });
  return { v: 1, on: true, day: day, items: items, done: done, total: total, complete: total > 0 && done >= total,
    paid: moneyHasKey_('daily3:' + sid + ':' + day), bonusCents: moneyRule_('dailyGoal') };
}
/* the boy's page asks for his list (sign-in and after each save). Real boys get null while TDL_LIVE is 'test'. */
function tdlToday(token) {
  var s = msSession_(token);
  if (!s || s.role !== 'kid' || !s.sid) throw new Error('This is for students only.');
  return tdlOn_(s.sid) ? tdlStatus_(s.sid) : null;
}
