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
/* HoS 2026-11-20 ("why is it showing the old screen still?"): a boy his rebbe has not placed yet had no map, so he saw the old home.
   Now, the same rule the Library and Learn by Level already use: not placed in a core subject -> his grade's level (Level 1 = kindergarten).
   A rebbe's placement always wins. The subject is marked byGrade so nothing pretends a rebbe chose it. */
var KM_GRADE_SUBJ = ['MATH', 'READ', 'LANG'];
function kmGradeOf_(sid) { try { var row = msRows_('roster').filter(function (r) { return String(r[0]) === sid; })[0]; return row ? libGradeOf_(row[8]) : null; } catch (e) { return null; } }
function kmMapFor_(sid, opt) {
  opt = opt || {};
  var B = {}; plBuilt_().forEach(function (x) { B[x] = 1; });
  var st = opt.st || {}; if (!opt.st) msStateRowOf_(sid).forEach(function (r) { if (String(r[0]) === sid) { try { st = JSON.parse(r[1]) || {}; } catch (e) { st = {}; } } });
  var states = {}; states[sid] = st;
  var all = plPlacements_(), place = {}, mine = {}, byGrade = {}; Object.keys(all).forEach(function (k) { place[k] = all[k]; });
  Object.keys(all[sid] || {}).forEach(function (k) { mine[k] = all[sid][k]; });
  var grade = opt.grade != null ? opt.grade : kmGradeOf_(sid);
  if (grade != null && grade >= 0) KM_GRADE_SUBJ.forEach(function (k) { if (!(mine[k] && mine[k].level)) { mine[k] = { level: Math.min(9, grade + 1), start: '', at: 0, by: 'grade' }; byGrade[k] = 1; } });
  place[sid] = mine;
  var ctx = { built: B, place: place, states: states, ev: {}, pf: {} }, mast = sgMastered_(st), sk = st.skills || {};
  /* LEVEL CHECKS (PathfinderLevel.js, HoS 2026-11-20): which Math / Reading levels have a check / a Level Pass, and the skills he
     already showed he knows. Known skills are skipped like mastered ones for his goal (never written to his skills, never paid). */
  var lc = null, kn = {}; if (!opt.noLc && typeof pfLcMap_ === 'function') { try { lc = pfLcMap_(sid); lc.known.forEach(function (id) { kn[id] = 1; }); } catch (e) { lc = null; } }
  var mastK = {}; Object.keys(mast).forEach(function (id) { mastK[id] = 1; }); Object.keys(kn).forEach(function (id) { mastK[id] = 1; });
  var names = {}, want = {}, subjects = {};
  SG_SUBJ.forEach(function (x) {
    var k = x[0], c = sgCell_(sid, k, ctx, mastK, {});
    if (!c.level) return;
    c.skills = (c.skills || []).map(function (y) { return kn[y[0]] && !mast[y[0]] ? [y[0], y[1], 0, 1] : [y[0], y[1], mast[y[0]] ? 1 : 0]; });
    var list = plList_(k) || [];
    list.forEach(function (y) { names[y[0]] = [y[1], y[2] || '']; });
    var built = (c.skills || []).filter(function (y) { return y[1]; }), strand = c.now ? kmStrand_(c.now) : '';
    var u = strand ? built.filter(function (y) { return kmStrand_(y[0]) === strand; }) : built;
    subjects[k] = { name: x[1], level: c.level, byGrade: !!byGrade[k], now: c.now, next: c.next, prev: c.prev, skills: c.skills,
      unit: { name: strand ? kmStrandName_(k, strand) : '', ids: u.map(function (y) { return y[0]; }), done: u.filter(function (y) { return y[2] || y[3]; }).length, total: u.length },
      strands: (c.skills || []).reduce(function (o, y) { var s = kmStrand_(y[0]); if (s && !o[s]) o[s] = kmStrandName_(k, s); return o; }, {}) };
    [c.now, c.next, c.prev].concat((c.skills || []).map(function (y) { return y[0]; })).forEach(function (id) { if (id) want[id] = 1; });
  });
  var kodesh = {}, K = { order: {}, names: {} }, kp = {};
  try { K = sgpKodeshLessons_() || K; } catch (e) {}
  try { kp = opt.kp || libKpAll_(); } catch (e) { kp = {}; }
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
  var res = { v: 1, sid: sid, at: now, subjects: subjects, kodesh: kodesh, growth: { days: KM_DAYS, week: g.steps, prev: g.prev, total: g.total }, names: out };
  if (lc) res.lc = lc;
  return res;
}
function kmStrand_(id) { return String(id || '').split('.')[1] || ''; }
function kmStrandName_(k, strand) { return (SG_STRAND[k] && SG_STRAND[k][strand]) || strand; }
/* "Chumash Level 3: Tell the Perek" -> "Tell the Perek" (the map already says the track and level) */
function kmKodeshName_(n) { return String(n || '').replace(/^[^:]{2,40}:\s*/, ''); }
/* Kodesh lesson names already say the skill ("Translate a Pasuk Myself"); the second line names the track and level. */
var KM_TRACK = { KRI: 'Kriyah', CHU: 'Chumash', RAS: 'Rashi', MSH: 'Mishnayos', GEM: 'Gemara' };
function kmKodeshWhat_(id) { var p = String(id).split('.'); return (KM_TRACK[p[1]] || p[1]) + ' Level ' + Number(String(p[2] || '').slice(1)); }

/* The staff "See what the kids see" preview (CurriculumPreview, PreviewKid.html) shows a MADE-UP boy (id PREVIEW, grade 4 = Level 5 by default)
   on the real map home, so staff see exactly the new home a boy sees. No real student data: no state row is read. */
function kmDemoMap_(grade) {
  grade = grade == null ? 4 : grade;
  var lv = Math.min(9, grade + 1), now = Date.now(), sk = {};
  ['MATH', 'READ'].forEach(function (k) { var list = (plList_(k) || []).filter(function (x) { return plMathLevel_(x[0]) === lv; }), B = {}; plBuilt_().forEach(function (x) { B[x] = 1; });
    list.filter(function (x) { return B[x[0]]; }).slice(0, 2).forEach(function (x, i) { sk[x[0]] = { m: true, at: now - (i + 1) * 864e5, first: true, stars: 3 }; }); });
  var m = kmMapFor_('PREVIEW', { st: { id: 'PREVIEW', skills: sk }, grade: grade, kp: {}, noLc: true });
  m.preview = true; return m;
}
