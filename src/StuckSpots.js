/* StuckSpots.js — "Where kids get stuck" for staff (Head of School 2026-11-18: strengthen the teaching; teachers see what to reteach).
   READ ONLY. Staff only (sgStaff_). Uses the answers already recorded in the evidence tab (date, student, skill, phase, item, ok, first, tries, hints, secs).
   Returns the questions most often missed on the first try in the last 14 days (at least 3 answers), with how many boys tried them and how many
   asked for help. Respects the staff member's scope (Access.js TL_SCOPE_): a teacher sees only the boys he may see. TEST- boys are left out.
   No names of boys are returned. Shown by StuckSpotsPage.html on the staff screen. */
function sgStuckSpots(token) {
  sgStaff_(token);
  var since = Date.now() - 14 * 864e5, by = {};
  var sh = msTab_('evidence'), n = sh.getLastRow();
  if (n < 2) return { since: 14, rows: [] };
  var rows = sh.getRange(2, 1, n - 1, 10).getValues();
  var scope = (typeof TL_SCOPE_ !== 'undefined' && TL_SCOPE_) ? TL_SCOPE_ : null;
  rows.forEach(function (r) {
    var t = r[0] instanceof Date ? r[0].getTime() : new Date(r[0]).getTime();
    if (!(t >= since)) return;
    var sid = String(r[1] || ''); if (!sid || /^TEST-/.test(sid)) return;
    if (scope && !scope[sid]) return;
    var skill = String(r[2] || ''), item = String(r[4] || ''); if (!skill || !item) return;
    var k = skill + '|' + item, o = by[k] || (by[k] = { skill: skill, phase: String(r[3] || ''), item: item, n: 0, miss: 0, help: 0, boys: {} });
    o.n++; if (!(Number(r[5]) === 1 && Number(r[6]) === 1)) o.miss++;
    if (Number(r[8]) > 0) o.help++;
    o.boys[sid] = 1;
  });
  var names = {}; try { names = typeof sgNames_ === 'function' ? sgNames_() : {}; } catch (e) { names = {}; }
  var nm = function (id) { var x = names[id]; return x ? (Array.isArray(x) ? String(x[0]) : String(x)) : id; };
  var out = Object.keys(by).map(function (k) { return by[k]; }).filter(function (o) { return o.n >= 3; })
    .map(function (o) { return { skill: o.skill, name: nm(o.skill), phase: o.phase, item: o.item.slice(0, 120), tries: o.n, missPct: Math.round(100 * o.miss / o.n), boys: Object.keys(o.boys).length, help: o.help }; })
    .sort(function (a, b) { return b.missPct - a.missPct || b.boys - a.boys; }).slice(0, 25);
  return { since: 14, rows: out };
}
