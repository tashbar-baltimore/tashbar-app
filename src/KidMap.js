/* ===== THE BOY'S OWN MAP (Head of School 2026-11-20: "The boy's whole world is HIS MAP" ... "a KID-SAFE server call that returns ONLY his own data").
   kmMyMap(token): for the signed-in boy only (a kid token; staff and parent tokens are refused). It never takes a student id, so a boy
   cannot ask for anyone else. Read only. It reuses the staff map's own logic, not a copy of it:
     - subjects: per subject he is placed in, the same cell the staff grid shows (sgCell_ in StaffGrid.js: level, now, next, prev, the
       level's skills [id, built, mastered]) plus his UNIT the way the staff map draws it (StaffHome.html unitNow): the run of built
       skills of the same kind (strand) inside his level, the one his goal is in. Its last step is the finish line (the "boss").
     - strands: the name of every kind of skill in his level (for his SKILL TREE: one branch per kind).
     - kodesh: Kriyah, Chumash, Rashi, Mishnayos, Gemara, the same as sgKodeshMap (sgKodeshFor_ in StaffViews.js).
     - growth: his mastered steps in the last 7 days and the 7 before (sgStepsFor_, the logic of sgMapReport), and the total ever.
     - names: for every step in the answer, [game name, the real skill in plain words] (HoS 2026-11-20: "it should be clear what they're
       actually learning ... I learned how to multiply"). The map always shows both: "Multiply Mountain · Multiply multi-digit numbers".
   The evidence tab is not read (it is the staff-only red/yellow status and the slowest read), so this is cheap enough to ride along with
   sign-in (msSignInFast adds it as .map: no extra trip to the server). Also callable on its own (API_ALLOW) to refresh after a lesson. */
var KM_DAYS = 7;
function kmMyMap(token) {
  var s = msSession_(token);
  if (!s || s.role !== 'kid' || !s.sid) throw new Error('This is for students only.');
  return kmMapFor_(String(s.sid));
}
function kmMapFor_(sid) {
  var B = {}; plBuilt_().forEach(function (x) { B[x] = 1; });
  var st = {}; msStateRowOf_(sid).forEach(function (r) { if (String(r[0]) === sid) { try { st = JSON.parse(r[1]) || {}; } catch (e) { st = {}; } } });
  var states = {}; states[sid] = st;
  var ctx = { built: B, place: plPlacements_(), states: states, ev: {}, pf: {} }, mast = sgMastered_(st), sk = st.skills || {};
  var names = {}, want = {}, subjects = {};
  SG_SUBJ.forEach(function (x) {
    var k = x[0], c = sgCell_(sid, k, ctx, mast, {});
    if (!c.level) return;
    var list = plList_(k) || [];
    list.forEach(function (y) { names[y[0]] = [y[1], y[2] || '']; });
    var built = (c.skills || []).filter(function (y) { return y[1]; }), strand = c.now ? kmStrand_(c.now) : '';
    var u = strand ? built.filter(function (y) { return kmStrand_(y[0]) === strand; }) : built;
    subjects[k] = { name: x[1], level: c.level, now: c.now, next: c.next, prev: c.prev, skills: c.skills,
      unit: { name: strand ? kmStrandName_(k, strand) : '', ids: u.map(function (y) { return y[0]; }), done: u.filter(function (y) { return y[2]; }).length, total: u.length },
      strands: (c.skills || []).reduce(function (o, y) { var s = kmStrand_(y[0]); if (s && !o[s]) o[s] = kmStrandName_(k, s); return o; }, {}) };
    [c.now, c.next, c.prev].concat((c.skills || []).map(function (y) { return y[0]; })).forEach(function (id) { if (id) want[id] = 1; });
  });
  var kodesh = {}, K = { order: {}, names: {} }, kp = {};
  try { K = sgpKodeshLessons_() || K; } catch (e) {}
  try { kp = libKpAll_(); } catch (e) { kp = {}; }
  try { kodesh = sgKodeshFor_(sid, sk, K, kp); } catch (e) { kodesh = {}; }
  Object.keys(kodesh).forEach(function (k) { var c = kodesh[k]; [c.now, c.next, c.prev].concat(c.skills.map(function (y) { return y[0]; })).forEach(function (id) { if (id) want[id] = 1; }); });
  var now = Date.now(), since = now - KM_DAYS * 864e5, g = sgStepsFor_(sk, since, since - KM_DAYS * 864e5);
  g.steps.forEach(function (y) { want[y[0]] = 1; });
  var N = {}; try { N = sgNames_(); } catch (e) {}
  var out = {};
  Object.keys(want).forEach(function (id) {
    if (/^LK\./.test(id) && K.names && K.names[id]) { out[id] = [kmKodeshName_(K.names[id]), kmKodeshWhat_(id)]; return; }
    out[id] = names[id] || (N[id] ? [N[id][0], ''] : null) || (K.names && K.names[id] ? [kmKodeshName_(K.names[id]), ''] : null) ||
      (typeof CI_INDEX !== 'undefined' && CI_INDEX.sk && CI_INDEX.sk[id] ? [CI_INDEX.sk[id][0], ''] : [id, '']);
  });
  return { v: 1, sid: sid, at: now, subjects: subjects, kodesh: kodesh, growth: { days: KM_DAYS, week: g.steps, prev: g.prev, total: g.total }, names: out };
}
function kmStrand_(id) { return String(id || '').split('.')[1] || ''; }
function kmStrandName_(k, strand) { return (SG_STRAND[k] && SG_STRAND[k][strand]) || strand; }
/* "Chumash Level 3: Tell the Perek" -> "Tell the Perek" (the map already says the track and level) */
function kmKodeshName_(n) { return String(n || '').replace(/^[^:]{2,40}:\s*/, ''); }
/* Kodesh lesson names already say the skill ("Translate a Pasuk Myself"); the second line names the track and level. */
var KM_TRACK = { KRI: 'Kriyah', CHU: 'Chumash', RAS: 'Rashi', MSH: 'Mishnayos', GEM: 'Gemara' };
function kmKodeshWhat_(id) { var p = String(id).split('.'); return (KM_TRACK[p[1]] || p[1]) + ' Level ' + Number(String(p[2] || '').slice(1)); }
