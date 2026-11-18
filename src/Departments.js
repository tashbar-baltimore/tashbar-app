/* Departments.js — DEPARTMENTS in the staff portal, Phase 1 (Head of School 2026-11-18: "a kindergarten department, and everything kindergarten
   is in that spot for them to see ... each one independent ... department heads").
   - 11 starting departments (4 by grade, 7 by subject). Every existing lesson/skill is sorted in AUTOMATICALLY by its subject (skill ID prefix)
     and grade (its level), so no department opens empty. One lesson can be in two departments (e.g. Kindergarten and Math).
   - What cannot be sorted goes to an Unsorted list the Head of School sees and can assign with one tap.
   - Lessons first seen after the departments were set up get a "New" badge for 14 days (first-seen dates in the MS_DeptSeen tab).
   - Roles: Head of School (MS_Staff role "head") sees and sets up everything; a department HEAD and MEMBERS see only their departments.
     Every call is checked here on the server (sgStaff_ + membership); Access.js scope still limits which boys anyone sees.
   - READ ONLY for lessons, progress and money. Setup (members, moves) is stored in the script setting TL_DEPTS (small JSON).
   Page: DepartmentsPage.html (added in sgPage_). Calls are in API_ALLOW: dpMine, dpOpen, dpAdmin, dpSave. */
var DP_BASE = '2026-11-18';   /* everything that existed on the day departments started counts as not new */
var DP_DEFAULT = [
  { id: 'K', name: 'Kindergarten', icon: '🧸', grades: [0, 0], subj: null, goal: 'Everything our kindergarten boys learn.' },
  { id: 'G12', name: 'Early Grades (1–2)', icon: '🌱', grades: [1, 2], subj: null, goal: 'Grades 1 and 2, every subject.' },
  { id: 'G35', name: 'Upper Elementary (3–5)', icon: '🚀', grades: [3, 5], subj: null, goal: 'Grades 3 to 5, every subject.' },
  { id: 'G68', name: 'Middle School (6–8)', icon: '🎓', grades: [6, 8], subj: null, goal: 'Grades 6 to 8, every subject.' },
  { id: 'LK', name: 'Limudei Kodesh', icon: '📜', grades: null, subj: ['LK'], goal: 'Kriyah, Chumash, Mishnayos, Gemara, Halacha, Tefillah and more.' },
  { id: 'MATH', name: 'Math', icon: '📐', grades: null, subj: ['MATH'], goal: 'Math, K to 8.' },
  { id: 'RW', name: 'Reading & Writing', icon: '📖', grades: null, subj: ['READ'], goal: 'Reading, writing and language, K to 8.' },
  { id: 'SCI', name: 'Science', icon: '🔬', grades: null, subj: ['SCI'], goal: 'Science, K to 8.' },
  { id: 'SOC', name: 'Social Studies', icon: '🌍', grades: null, subj: ['SOC'], goal: 'Social studies and history.' },
  { id: 'ELEC', name: 'Electives, Trades & Computing', icon: '🛠️', grades: null, subj: ['ELEC'], goal: 'Electives, trades, computing and life skills.' },
  { id: 'HEART', name: 'Heart & Soul', icon: '💗', grades: null, subj: ['HEART'], goal: "B'Simcha, Hashem Moments and middos programs." }
];
/* skill ID prefix -> subject family */
function dpSubj_(id) {
  var p = String(id || '').split('.')[0];
  if (p === 'MATH') return 'MATH';
  if (p === 'READ' || p === 'LANG' || p === 'WRIT') return 'READ';
  if (p === 'SCI') return 'SCI';
  if (p === 'SS' || p === 'SOC' || p === 'HIST' || p === 'JHIST' || p === 'GEO' || p === 'CIV') return 'SOC';
  if (p === 'LK' || p === 'HEB' || p === 'KOD' || p === 'TQ') return 'LK';
  if (p === 'COMP' || p === 'ELEC' || p === 'LIFE' || p === 'TRADE' || p === 'TR' || p === 'ART' || p === 'THINK') return 'ELEC';
  if (p === 'SIM' || p === 'BS' || p === 'BSIM' || p === 'HS' || p === 'MID' || p === 'HM') return 'HEART';
  return '';
}
/* grade from the level in the ID (L01 = kindergarten for general studies; Kodesh levels are the grade itself) */
function dpGrade_(id) {
  var m = /\.L(\d\d)\./.exec(String(id || '') + '.'); if (!m) return null;
  var L = Number(m[1]), s = dpSubj_(id);
  var g = s === 'LK' ? L : L - 1;
  return g >= 0 && g <= 8 ? g : null;
}
function dpCfg_() {
  var c = {}; try { c = JSON.parse(PropertiesService.getScriptProperties().getProperty('TL_DEPTS') || '{}'); } catch (e) { c = {}; }
  c.members = c.members || {}; c.moves = c.moves || {}; c.extra = c.extra || [];
  c.depts = DP_DEFAULT.concat(c.extra).filter(function (d) { return !(c.retired || {})[d.id]; });
  return c;
}
function dpSaveCfg_(c) { var o = { members: c.members, moves: c.moves, extra: c.extra, retired: c.retired || {} }; var j = JSON.stringify(o); if (j.length > 8500) throw new Error('Too much setup to save.'); PropertiesService.getScriptProperties().setProperty('TL_DEPTS', j); }
/* every lesson/skill the app knows: {id: name} */
function dpCatalog_() {
  var c = CacheService.getScriptCache(), hit = c.get('dp_cat_v2'); if (hit) { try { return JSON.parse(hit); } catch (e) {} }
  var o = {};
  try { var L = sgCatalog_().list; Object.keys(L).forEach(function (k) { (L[k] || []).forEach(function (x) { if (x && x[0]) o[x[0]] = String(x[1] || x[0]); }); }); } catch (e) {}
  try { var n = sgNames_(); Object.keys(n).forEach(function (k) { if (!o[k]) o[k] = Array.isArray(n[k]) ? String(n[k][0]) : String(n[k]); }); } catch (e) {}
  try { var kk = typeof famKodeshNames_ === 'function' ? famKodeshNames_() : {}; Object.keys(kk).forEach(function (k) { if (!o[k]) o[k] = String(kk[k]); }); } catch (e) {}
  try { var st = typeof tlFileText_ === 'function' ? tlFileText_('SimchaMore') : '', re = /"(SIM\.L\d\d\.\d\d)"\s*:\s*\{\s*"name"\s*:\s*"((?:\\.|[^"\\])*)"/g, m;   /* B'Simcha lessons (Heart & Soul) */
    while ((m = re.exec(st))) if (!o[m[1]]) o[m[1]] = m[2]; } catch (e) {}
  try { c.put('dp_cat_v2', JSON.stringify(o), 600); } catch (e) {}
  return o;
}
function dpIn_(d, id, moves) {
  if ((moves[id] || []).indexOf(d.id) >= 0) return true;
  var s = dpSubj_(id), g = dpGrade_(id);
  if (d.and) {   /* niche department (DeptCurr.js dpDeptAdd): every rule it has must match */
    if (d.subj && d.subj.indexOf(s) < 0) return false;
    if (d.grades && !(g != null && g >= d.grades[0] && g <= d.grades[1])) return false;
    if (d.pre && !d.pre.some(function (p) { return String(id).indexOf(p + '.') === 0 || String(id) === p; })) return false;
    return !!(d.subj || d.grades || d.pre);
  }
  if (d.subj && d.subj.indexOf(s) >= 0) return true;
  if (d.grades && g != null && g >= d.grades[0] && g <= d.grades[1]) return true;
  return false;
}
/* first-seen dates (for the New badge) */
function dpSeen_(ids) {
  var ss = msBook_(), sh = ss.getSheetByName('MS_DeptSeen');
  if (!sh) { sh = ss.insertSheet('MS_DeptSeen'); sh.getRange(1, 1, 1, 2).setValues([['skillId', 'firstSeen']]); }
  var n = sh.getLastRow(), seen = {}, today = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd'), first = n < 2;
  if (n >= 2) sh.getRange(2, 1, n - 1, 2).getValues().forEach(function (r) { if (r[0]) seen[String(r[0])] = r[1] instanceof Date ? Utilities.formatDate(r[1], 'America/New_York', 'yyyy-MM-dd') : String(r[1]); });
  var add = ids.filter(function (id) { return !seen[id]; });
  if (add.length) { var day = first ? '2000-01-01' : today; sh.getRange(sh.getLastRow() + 1, 1, add.length, 2).setValues(add.map(function (id) { seen[id] = day; return [id, day]; })); }
  return seen;
}
function dpWho_(token) { var s = sgStaff_(token), w = sgWho_(s); return { s: s, id: String(w.id || ''), name: String(w.name || ''), head: sgIsHead_(s) }; }
function dpRole_(cfg, who, deptId) { if (who.head) return 'hos'; var m = cfg.members[deptId] || {}; return m[who.id] || ''; }
/* the departments this person may open, with lesson counts */
function dpMine(token) {
  var who = dpWho_(token), cfg = dpCfg_(), cat = dpCatalog_(), ids = Object.keys(cat);
  var list = cfg.depts.filter(function (d) { return !!dpRole_(cfg, who, d.id); }).map(function (d) {
    var n = ids.filter(function (id) { return dpIn_(d, id, cfg.moves); }).length;
    var heads = Object.keys(cfg.members[d.id] || {}).filter(function (k) { return cfg.members[d.id][k] === 'head'; }).length;
    return { id: d.id, name: d.name, icon: d.icon, goal: d.goal, lessons: n, role: dpRole_(cfg, who, d.id), members: Object.keys(cfg.members[d.id] || {}).length, heads: heads };
  });
  return { hos: who.head, depts: list };
}
/* one department: its lessons (with started / mastered counts) and its boys (with progress in this department only) */
function dpOpen(token, deptId) {
  var who = dpWho_(token), cfg = dpCfg_(); deptId = String(deptId || '');
  var d = cfg.depts.filter(function (x) { return x.id === deptId; })[0]; if (!d) throw new Error('No such department.');
  var role = dpRole_(cfg, who, deptId); if (!role) throw new Error('You are not in this department.');
  var cat = dpCatalog_(), ids = Object.keys(cat).filter(function (id) { return dpIn_(d, id, cfg.moves); });
  var seen = dpSeen_(Object.keys(cat)), newSince = Utilities.formatDate(new Date(Date.now() - 14 * 864e5), 'America/New_York', 'yyyy-MM-dd');
  var inD = {}; ids.forEach(function (id) { inD[id] = 1; });
  var roster = msRoster_().filter(function (r) { return !/^TEST-/.test(r.id); }), allow = {}; roster.forEach(function (r) { allow[r.id] = r; });
  var started = {}, mastered = {}, boys = [], states = {};
  msRows_('state').forEach(function (r) { var sid = String(r[0] || ''); if (allow[sid]) states[sid] = r; });
  roster.forEach(function (rr) {
    var sid = rr.id, r = states[sid] || [], st = {}; try { st = JSON.parse(r[1] || '{}') || {}; } catch (e) { st = {}; }
    var sk = st.skills || {}, b = { id: sid, name: rr.name, started: 0, mastered: 0, last: r[2] instanceof Date ? r[2].getTime() : 0, grade: null };
    Object.keys(sk).forEach(function (id) { if (!inD[id]) return; started[id] = (started[id] || 0) + 1; b.started++; if (sk[id] && sk[id].m) { mastered[id] = (mastered[id] || 0) + 1; b.mastered++; } });
    try { b.grade = typeof pfdGrade_ === 'function' ? pfdGrade_(sid) : null; } catch (e) { b.grade = null; }
    var known = b.grade != null && b.grade !== '' && !isNaN(Number(b.grade));
    var fits = !d.grades || (known ? (Number(b.grade) >= d.grades[0] && Number(b.grade) <= d.grades[1]) : b.started > 0);
    if (fits) boys.push(b);
  });
  var lessons = ids.map(function (id) { return { id: id, name: cat[id], subj: dpSubj_(id), grade: dpGrade_(id), started: started[id] || 0, mastered: mastered[id] || 0, isNew: !!(seen[id] && seen[id] >= newSince && seen[id] > DP_BASE) }; })
    .sort(function (a, b) { return (a.subj < b.subj ? -1 : a.subj > b.subj ? 1 : 0) || ((a.grade == null ? 99 : a.grade) - (b.grade == null ? 99 : b.grade)) || (a.id < b.id ? -1 : 1); });
  boys.sort(function (a, b) { return b.last - a.last; });
  var mem = cfg.members[deptId] || {};
  return { dept: { id: d.id, name: d.name, icon: d.icon, goal: d.goal }, role: role, lessons: lessons, boys: boys.slice(0, 400), members: Object.keys(mem).map(function (k) { return { id: k, role: mem[k], name: dpStaffName_(k) }; }) };
}
function dpStaff_() {
  var sh = msBook_().getSheetByName('MS_Staff'), n = sh ? sh.getLastRow() : 0; if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, 6).getValues().filter(function (r) { return r[0] && r[4] !== false && String(r[4]).toUpperCase() !== 'FALSE'; }).map(function (r) { return { id: String(r[0]), name: String(r[1]), role: String(r[5] || '').toLowerCase() }; });
}
function dpStaffName_(id) { var s = dpStaff_().filter(function (x) { return x.id === id; })[0]; return s ? s.name : id; }
/* Head of School setup: every department, its members, every staff member, and the lessons no department holds */
function dpAdmin(token) {
  var who = dpWho_(token); if (!who.head) throw new Error('Only the Head of School can set up departments.');
  var cfg = dpCfg_(), cat = dpCatalog_();
  var unsorted = Object.keys(cat).filter(function (id) { return !cfg.depts.some(function (d) { return dpIn_(d, id, cfg.moves); }); }).map(function (id) { return { id: id, name: cat[id] }; });
  return { depts: cfg.depts.map(function (d) { return { id: d.id, name: d.name, icon: d.icon }; }), members: cfg.members, staff: dpStaff_().filter(function (s) { return s.role !== 'canteen'; }).map(function (s) { return { id: s.id, name: s.name }; }), unsorted: unsorted.slice(0, 300), unsortedCount: unsorted.length };
}
/* change setup: what = 'member' {dept, staff, role: 'head'|'member'|''} or 'move' {skill, dept}. Head of School, or a department head for his own department's members and moves in. */
function dpSave(token, what, a) {
  var who = dpWho_(token), cfg = dpCfg_(); a = a || {};
  var dept = String(a.dept || ''); if (!cfg.depts.some(function (d) { return d.id === dept; })) throw new Error('No such department.');
  var mine = dpRole_(cfg, who, dept); if (!(who.head || mine === 'head')) throw new Error('Only the Head of School or this department’s head can change this.');
  if (what === 'member') {
    var sid = String(a.staff || ''), role = String(a.role || ''); if (!dpStaff_().some(function (s) { return s.id === sid; })) throw new Error('Unknown staff member.');
    if (role === 'head' && !who.head) throw new Error('Only the Head of School can name a department head.');
    cfg.members[dept] = cfg.members[dept] || {}; if (role === 'head' || role === 'member') cfg.members[dept][sid] = role; else delete cfg.members[dept][sid];
  } else if (what === 'move') {
    var sk = String(a.skill || '').slice(0, 40); if (!dpCatalog_()[sk]) throw new Error('Unknown lesson.');
    var l = cfg.moves[sk] || []; if (l.indexOf(dept) < 0) l.push(dept); cfg.moves[sk] = l;
  } else throw new Error('Unknown change.');
  dpSaveCfg_(cfg);
  return true;
}
