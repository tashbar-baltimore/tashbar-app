/* ===== Access.js (takeover4, HoS request 2026-11-15): schools, roles, parents and who-may-see-whom.
   WHO SEES WHOM (enforced on the server, not only on the screen):
   - Head of School (MS_Staff role "head"): every school, every student.
   - School admin (role "admin"): every student in HIS school; manages that school's staff, students and parents.
   - Rebbe / teacher: the students in HIS classes (My classes). Until he has a class, he sees his school (so nobody is locked out).
   - Office / canteen staff: their school.
   - Parent (MS_Parents, 4-digit code on the same sign-in pad, unique across everyone): only his own children.
   - Student: himself; lists of other students (Arena, goals) show only his own school.
   A "school" can be a real school, a family or a homeschool group: whoever is in it sees only its students.
   Everyone already in the app belongs to the default school (AC.DEF) until moved, so nothing changes until the Head of School sets it up.
   HOW: msSession_ calls tlApplyScope_ for every signed-in call; msRoster_ then lists only students in scope, and every server
   function that takes a student id calls tlGuard_ first. Tabs: MS_Schools, MS_SchoolMembers, MS_StaffScope, MS_Parents, MS_ParentNotes. ===== */
var TL_SCOPE_ = null, TL_SESS_ = null, TL_SCOPE_INFO_ = null;
var AC = {
  DEF: 'TASHBAR', DEFNAME: 'Tashbar of Baltimore', TTL: 300,
  H: {
    MS_Schools: ['school_id', 'name', 'kind', 'active', 'created', 'by', 'note'],
    MS_SchoolMembers: ['student_id', 'school_id', 'updated', 'by'],
    MS_StaffScope: ['staff_id', 'school_id', 'scope', 'updated', 'by'],
    MS_Parents: ['parent_id', 'name', 'code_salt', 'code_hash', 'sids', 'school_id', 'active', 'email', 'phone', 'created', 'last_in', 'title'],
    MS_ParentNotes: ['id', 'at', 'parent_id', 'parent_name', 'student_id', 'kind', 'text', 'time', 'repeat', 'date', 'active', 'ack_at', 'ack_day']
  },
  KINDS: ['school', 'family', 'homeschool', 'group'],
  REPEATS: ['daily', 'weekdays', 'once', 'next']
};
function acTab_(name) {
  var ss = msBook_(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.getRange(1, 1, 1, AC.H[name].length).setValues([AC.H[name]]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function acRows_(name) { var sh = msBook_().getSheetByName(name); if (!sh) return []; var n = sh.getLastRow(); return n < 2 ? [] : sh.getRange(2, 1, n - 1, AC.H[name].length).getValues(); }
function acOn_(v) { return !(v === false || String(v).toUpperCase() === 'FALSE'); }
function acClean_(s, n) { return String(s == null ? '' : s).replace(/[\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n); }
function acVer_() { return PropertiesService.getScriptProperties().getProperty('TL_ACCESS_VER') || '1'; }
function acBump_() { var p = PropertiesService.getScriptProperties(); p.setProperty('TL_ACCESS_VER', String(Number(p.getProperty('TL_ACCESS_VER') || 1) + 1)); }
function acToday_() { return Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd'); }

/* ---------- facts ---------- */
function acSchools_() {
  var out = [{ id: AC.DEF, name: AC.DEFNAME, kind: 'school', active: true }], seen = {}; seen[AC.DEF] = 1;
  acRows_('MS_Schools').forEach(function (r) {
    var id = String(r[0] || ''); if (!id) return;
    if (seen[id]) { if (id === AC.DEF) { out[0].name = String(r[1] || AC.DEFNAME); out[0].kind = String(r[2] || 'school'); } return; }
    seen[id] = 1; out.push({ id: id, name: String(r[1] || id), kind: String(r[2] || 'school'), active: acOn_(r[3]) });
  });
  return out;
}
function acMembers_() { var o = {}; acRows_('MS_SchoolMembers').forEach(function (r) { if (r[0]) o[String(r[0])] = String(r[1] || AC.DEF); }); return o; }
function acSchoolOf_(sid, mem) { return (mem || acMembers_())[String(sid)] || AC.DEF; }
function acActiveIds_() { return msRows_('roster').filter(function (r) { return r[0] && r[7] !== false; }).map(function (r) { return String(r[0]); }); }
function acStaffRows_() {
  var sh = msBook_().getSheetByName('MS_Staff'), n = sh ? sh.getLastRow() : 0;
  return n < 2 ? [] : sh.getRange(2, 1, n - 1, 6).getValues().filter(function (r) { return r[0]; }).map(function (r) { return { id: String(r[0]), name: String(r[1]), active: acOn_(r[4]), role: String(r[5] || '').toLowerCase() }; });
}
function acScopeRows_() { var o = {}; acRows_('MS_StaffScope').forEach(function (r) { if (r[0]) o[String(r[0])] = { school: String(r[1] || AC.DEF), scope: String(r[2] || '') }; }); return o; }
function acDefaultMode_(role) { return role === 'head' ? 'all' : (role === 'rebbe' || role === 'teacher') ? 'classes' : 'school'; }
function acClassSids_(staffId) {
  var o = {}; if (typeof crRows_ !== 'function') return o;
  try { crRows_(CR.CLS).forEach(function (r) { if (String(r[1]) !== staffId || !acOn_(r[7])) return; var a = []; try { a = JSON.parse(r[5] || '[]'); } catch (e) {} a.forEach(function (sid) { o[String(sid)] = 1; }); }); } catch (e) {}
  return o;
}
function acParentRows_() {
  return acRows_('MS_Parents').map(function (r, i) {
    var sids = []; try { sids = JSON.parse(r[4] || '[]'); } catch (e) { sids = String(r[4] || '').split(/[,\s]+/).filter(Boolean); }
    return { row: i + 2, id: String(r[0] || ''), name: String(r[1] || ''), salt: String(r[2] || ''), hash: String(r[3] || ''), sids: sids.map(String), school: String(r[5] || AC.DEF), active: acOn_(r[6]), email: String(r[7] || ''), phone: String(r[8] || ''), last: r[10] ? new Date(r[10]).getTime() : 0, title: String(r[11] || '') };
  }).filter(function (p) { return p.id; });
}
function acParentMatch_(code) {
  code = String(code || ''); if (!/^\d{4,8}$/.test(code)) return null;
  var ps = acParentRows_();
  for (var i = 0; i < ps.length; i++) if (ps[i].active && ps[i].salt && msHash_(ps[i].salt, code) === ps[i].hash) return ps[i];
  return null;
}

/* ---------- the scope of one signed-in session ---------- */
function acCompute_(s) {
  var mem = acMembers_(), ids = acActiveIds_(), set = function (list) { var o = {}; list.forEach(function (x) { o[x] = 1; }); return o; };
  var inSchool = function (sch) { return ids.filter(function (id) { return (mem[id] || AC.DEF) === sch; }); };
  if (s.role === 'kid') { var ks = acSchoolOf_(s.sid, mem); return { all: false, mode: 'kid', school: ks, sids: set(inSchool(ks)) }; }
  if (s.role === 'parent') {
    var p = acParentRows_().filter(function (x) { return x.id === s.pid; })[0];
    if (!p || !p.active) return { all: false, mode: 'parent', school: '', sids: {} };
    var act = set(ids); return { all: false, mode: 'parent', school: p.school, sids: set(p.sids.filter(function (x) { return act[x]; })) };
  }
  if (s.role === 'staff') {
    var w = s.who; if (!w || !w.id) return { all: false, mode: 'school', school: AC.DEF, sids: set(inSchool(AC.DEF)) };   /* old practice code: the default school only */
    if (w.role === 'head') return { all: true, mode: 'all', school: '*', sids: null };
    var sc = acScopeRows_()[w.id] || {}, school = sc.school || AC.DEF, mode = sc.scope || acDefaultMode_(w.role), sch = inSchool(school);
    if (mode === 'classes') {
      var cs = acClassSids_(w.id), schSet = set(sch), mine = Object.keys(cs).filter(function (x) { return schSet[x]; });
      if (mine.length) return { all: false, mode: 'classes', school: school, sids: set(mine) };
      return { all: false, mode: 'school', school: school, sids: schSet, fallback: true };
    }
    return { all: false, mode: 'school', school: school, sids: set(sch) };
  }
  return { all: false, mode: 'none', school: '', sids: {} };
}
function tlApplyScope_(token, s) {
  TL_SESS_ = s;
  var c = CacheService.getScriptCache(), key = 'tl_scope_' + acVer_() + '_' + token, hit = c.get(key), info = null;
  if (hit) { try { info = JSON.parse(hit); } catch (e) { info = null; } }
  if (!info) { info = acCompute_(s); try { c.put(key, JSON.stringify(info), AC.TTL); } catch (e) {} }
  TL_SCOPE_INFO_ = info; TL_SCOPE_ = info.all ? null : (info.sids || {});
  return info;
}
/* Every server function that takes a student id (or a list) calls this first. Students acting on themselves are checked by msCanSee_. */
function tlGuard_(token, sids) {
  var s = msSession_(token);
  if (s.role === 'kid') return s;
  var list = Array.isArray(sids) ? sids : [sids];
  list.forEach(function (sid) { if (sid != null && sid !== '' && TL_SCOPE_ && !TL_SCOPE_[String(sid)]) throw new Error('That student is not in your school or class.'); });
  return s;
}
/* The class editor must offer the whole school, even to a teacher who only sees his classes. */
function tlSchoolScope_(fn) {
  var keep = TL_SCOPE_, info = TL_SCOPE_INFO_;
  try {
    if (info && !info.all && info.school && info.mode === 'classes') { var mem = acMembers_(), o = {}; acActiveIds_().forEach(function (id) { if ((mem[id] || AC.DEF) === info.school) o[id] = 1; }); TL_SCOPE_ = o; }
    return fn();
  } finally { TL_SCOPE_ = keep; }
}
function tlScopeKey_() { return TL_SCOPE_INFO_ && !TL_SCOPE_INFO_.all ? String(TL_SCOPE_INFO_.school || '') : '*'; }   /* for caches of school-wide numbers */
function tlAssignNewStudent_(sid) {   /* a student added by a staff member joins that staff member's school */
  var info = TL_SCOPE_INFO_; if (!info || info.all || !info.school || info.school === AC.DEF) return;
  acTab_('MS_SchoolMembers').appendRow([String(sid), info.school, new Date(), 'added']); acBump_();
}

/* ---------- who is managing ---------- */
function acAdmin_(token) {
  var s = sgStaff_(token), w = s.who || {};
  if (w.role === 'head') return { head: true, id: w.id, name: w.name, school: '*' };
  if (w.role === 'admin') { var sc = acScopeRows_()[w.id] || {}; return { head: false, id: w.id, name: w.name, school: sc.school || AC.DEF }; }
  throw new Error('Only the Head of School or a school admin can change access.');
}
function acMine_(me, school) { if (!me.head && school !== me.school) throw new Error('That is not your school.'); }
function acMyScope(token) {   /* the staff screen shows a small line: what this staff member sees */
  var s = sgStaff_(token), i = TL_SCOPE_INFO_ || {}, sch = acSchools_().filter(function (x) { return x.id === i.school; })[0];
  return { mode: i.mode, school: i.school, schoolName: i.all ? 'All schools' : sch ? sch.name : AC.DEFNAME, count: i.sids ? Object.keys(i.sids).length : null, fallback: !!i.fallback, role: (s.who && s.who.role) || '', canAdmin: !!(s.who && (s.who.role === 'head' || s.who.role === 'admin')) };
}
function acAdminLoad(token) {
  var me = acAdmin_(token), mem = acMembers_(), sc = acScopeRows_();
  var schools = acSchools_().filter(function (x) { return me.head || x.id === me.school; });
  var students = msRows_('roster').filter(function (r) { return r[0] && r[7] !== false && !/^TEST-/.test(String(r[0])); }).map(function (r) { var id = String(r[0]); return { id: id, name: String(r[1]), school: mem[id] || AC.DEF }; })
    .filter(function (x) { return me.head || x.school === me.school; }).sort(function (a, b) { return a.name.localeCompare(b.name); });
  var classes = {}; try { crRows_(CR.CLS).forEach(function (r) { if (acOn_(r[7])) classes[String(r[1])] = (classes[String(r[1])] || 0) + 1; }); } catch (e) {}
  var staff = acStaffRows_().filter(function (x) { return x.active && x.role !== 'canteen'; }).map(function (x) { var o = sc[x.id] || {}; return { id: x.id, name: x.name, role: x.role, school: o.school || AC.DEF, scope: o.scope || acDefaultMode_(x.role), classes: classes[x.id] || 0 }; })
    .filter(function (x) { return me.head || x.school === me.school; }).sort(function (a, b) { return a.name.localeCompare(b.name); });
  var parents = acParentRows_().filter(function (p) { return me.head || p.school === me.school; }).map(function (p) { return { id: p.id, name: p.name, title: p.title, sids: p.sids, school: p.school, active: p.active, email: p.email, phone: p.phone, last: p.last }; });
  return { me: me, schools: schools, students: students, staff: staff, parents: parents, kinds: AC.KINDS };
}
function acSaveSchool(token, x) {
  var me = acAdmin_(token); if (!me.head) throw new Error('Only the Head of School can add or change schools.');
  x = x || {}; var name = acClean_(x.name, 80), kind = AC.KINDS.indexOf(x.kind) >= 0 ? x.kind : 'school';
  if (name.length < 2) throw new Error('Type the school or family name.');
  return sgLock_(function () {
    var sh = acTab_('MS_Schools'), rows = acRows_('MS_Schools'), id = String(x.id || '');
    if (id) { for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === id) { sh.getRange(i + 2, 2, 1, 3).setValues([[name, kind, x.active !== false]]); acBump_(); return { id: id }; }
      if (id === AC.DEF) { sh.appendRow([AC.DEF, name, kind, true, new Date(), me.name, 'default school']); acBump_(); return { id: id }; } }
    var base = name.toUpperCase().replace(/[^A-Z0-9]+/g, '').slice(0, 10) || 'SCHOOL', nid = base, k = 2, taken = {}; acSchools_().forEach(function (s) { taken[s.id] = 1; });
    while (taken[nid]) nid = base + (k++);
    sh.appendRow([nid, name, kind, true, new Date(), me.name, '']); acBump_(); return { id: nid };
  });
}
function acMoveStudents(token, sids, school) {
  var me = acAdmin_(token); school = String(school || ''); sids = (sids || []).map(String).slice(0, 500);
  if (!acSchools_().some(function (s) { return s.id === school; })) throw new Error('Pick a school.');
  if (!me.head) throw new Error('Only the Head of School can move students between schools.');
  return sgLock_(function () {
    var sh = acTab_('MS_SchoolMembers'), rows = acRows_('MS_SchoolMembers'), at = {}; rows.forEach(function (r, i) { at[String(r[0])] = i + 2; });
    sids.forEach(function (sid) { var line = [sid, school, new Date(), me.name]; if (at[sid]) sh.getRange(at[sid], 1, 1, 4).setValues([line]); else { sh.appendRow(line); at[sid] = sh.getLastRow(); } });
    acBump_(); return { moved: sids.length };
  });
}
function acSaveStaffScope(token, staffId, school, scope, role) {
  var me = acAdmin_(token); staffId = String(staffId || ''); school = String(school || AC.DEF); scope = ['school', 'classes'].indexOf(scope) >= 0 ? scope : 'school';
  var st = acStaffRows_().filter(function (x) { return x.id === staffId; })[0]; if (!st) throw new Error('That staff member is not on the list.');
  if (st.role === 'head') throw new Error('The Head of School always sees everything.');
  var cur = (acScopeRows_()[staffId] || {}).school || AC.DEF; acMine_(me, cur); acMine_(me, school);
  if (!acSchools_().some(function (s) { return s.id === school; })) throw new Error('Pick a school.');
  role = String(role || '').toLowerCase();
  if (role && ['rebbe', 'teacher', 'office', 'admin'].indexOf(role) < 0) throw new Error('Pick a role: rebbe, teacher, office or school admin.');
  if (role === 'admin' && !me.head) throw new Error('Only the Head of School can make a school admin.');
  return sgLock_(function () {
    var sh = acTab_('MS_StaffScope'), rows = acRows_('MS_StaffScope'), line = [staffId, school, scope, new Date(), me.name], done = false;
    for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === staffId) { sh.getRange(i + 2, 1, 1, 5).setValues([line]); done = true; break; }
    if (!done) sh.appendRow(line);
    if (role && role !== st.role) { var ss = msBook_().getSheetByName('MS_Staff'), n = ss.getLastRow(), ids = ss.getRange(2, 1, n - 1, 1).getValues(); for (var j = 0; j < ids.length; j++) if (String(ids[j][0]) === staffId) { ss.getRange(j + 2, 6).setValue(role); break; } }
    acBump_(); return { ok: true };
  });
}
/* Parents. A new code is shown ONCE (only its salt and hash are kept). */
function acFreeParentCode_() {
  var ps = acParentRows_();
  for (var k = 0; k < 500; k++) {
    var c = ('000' + Math.floor(Math.random() * 10000)).slice(-4);   /* 4 digits, like every code on the sign-in pad; unique across students, staff and parents */
    if (typeof sgCodeOk_ === 'function' ? !sgCodeOk_(c) : /^(\d)\1+$/.test(c)) continue;
    if (ps.some(function (p) { return p.salt && msHash_(p.salt, c) === p.hash; })) continue;
    if (typeof msStaffMatch_ === 'function' && msStaffMatch_(c)) continue;
    if (typeof sgCodeTaken_ === 'function' && sgCodeTaken_(c)) continue;
    return c;
  }
  throw new Error('Could not make a code. Try again.');
}
function acSaveParent(token, x) {
  var me = acAdmin_(token); x = x || {};
  var name = acClean_(x.name, 80), title = acClean_(x.title, 30), email = acClean_(x.email, 200), phone = acClean_(x.phone, 40);
  if (name.length < 2) throw new Error('Type the parent’s name.');
  if (email && !/^[^@\s,;]+@[^@\s,;]+\.[^@\s,;]+$/.test(email)) throw new Error('That email does not look right.');
  var mem = acMembers_(), act = {}; acActiveIds_().forEach(function (i) { act[i] = 1; });
  var sids = (x.sids || []).map(String).filter(function (s) { return act[s]; }).slice(0, 12);
  if (!sids.length) throw new Error('Pick at least one child.');
  var school = acSchoolOf_(sids[0], mem); sids.forEach(function (s) { acMine_(me, acSchoolOf_(s, mem)); });
  return sgLock_(function () {
    var sh = acTab_('MS_Parents'), ps = acParentRows_(), p = x.id ? ps.filter(function (q) { return q.id === String(x.id); })[0] : null, code = null;
    if (x.id && !p) throw new Error('That parent is not on the list.');
    if (p) { acMine_(me, p.school); sh.getRange(p.row, 2).setValue(name); sh.getRange(p.row, 5, 1, 5).setValues([[JSON.stringify(sids), school, x.active !== false, email, phone]]); sh.getRange(p.row, 12).setValue(title); }
    else {
      var max = 0; ps.forEach(function (q) { var m = /^P(\d+)$/.exec(q.id); if (m) max = Math.max(max, Number(m[1])); });
      var id = 'P' + ('000' + (max + 1)).slice(-4), salt = Utilities.getUuid(); code = acFreeParentCode_();
      sh.appendRow([id, name, salt, msHash_(salt, code), JSON.stringify(sids), school, true, email, phone, new Date(), '', title]); p = { id: id };
    }
    acBump_(); return { id: p.id, code: code };
  });
}
function acParentNewCode(token, pid) {
  var me = acAdmin_(token);
  return sgLock_(function () {
    var p = acParentRows_().filter(function (q) { return q.id === String(pid || ''); })[0]; if (!p) throw new Error('That parent is not on the list.');
    acMine_(me, p.school); var code = acFreeParentCode_(), salt = Utilities.getUuid();
    acTab_('MS_Parents').getRange(p.row, 3, 1, 2).setValues([[salt, msHash_(salt, code)]]); acBump_(); return { code: code };
  });
}

/* ---------- parent portal ---------- */
function ppPage_() {
  return HtmlService.createHtmlOutput(tlTheme_(HtmlService.createHtmlOutputFromFile('ParentPage').getContent(), 'staff'))
    .setTitle('Tashbar Learning · Parents').addMetaTag('viewport', 'width=device-width, initial-scale=1').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}
function ppMe_(token) {
  var s = msSession_(token); if (!s || s.role !== 'parent' || !s.pid) throw new Error('Please sign in again with your parent code.');
  var p = acParentRows_().filter(function (q) { return q.id === s.pid; })[0]; if (!p || !p.active) throw new Error('This parent code is no longer active. Please ask the school.');
  return p;
}
function ppKid_(token, sid) { var p = ppMe_(token); sid = String(sid || ''); if (!TL_SCOPE_ || !TL_SCOPE_[sid]) throw new Error('You can only see your own children.'); return p; }
function ppNotesOf_(sid) {
  return acRows_('MS_ParentNotes').filter(function (r) { return String(r[4]) === sid && acOn_(r[10]); }).map(function (r) {
    return { id: String(r[0]), at: r[1] ? new Date(r[1]).getTime() : 0, pid: String(r[2]), from: String(r[3]), kind: String(r[5]), text: String(r[6]), time: String(r[7] || ''), repeat: String(r[8] || ''), date: String(r[9] || ''), ack: r[11] ? new Date(r[11]).getTime() : 0, ackDay: String(r[12] || '') };
  });
}
function ppLoad(token) {
  var p = ppMe_(token), names = sgNames_(), w0 = famWeekStart_(), d7 = Date.now() - 7 * 864e5, kn = {};
  try { kn = famKodeshNames_(); } catch (e) {}
  try { var sh = acTab_('MS_Parents'); sh.getRange(p.row, 11).setValue(new Date()); } catch (e) {}
  var kids = msRoster_().map(function (r) {
    var ctx = sgCtxFor_(r.id), row = sgRow_(r, ctx), st = ctx.states[r.id] || {}, sk = st.skills || {}, week = [], ev = (ctx.ev[r.id] || {});
    Object.keys(sk).forEach(function (k) { if (sk[k] && sk[k].m && Number(sk[k].at) >= w0) week.push((names[k] && names[k][0]) || kn[k] || k); });
    var tries = 0, right = 0, active = 0; Object.keys(ev).forEach(function (k) { var e = ev[k]; if (e.last >= d7) { active++; tries += e.ok + e.miss; right += e.ok; } });
    var subj = SG_SUBJ.map(function (s) { var c = row.cells[s[0]] || {}; return { key: s[0], name: s[1], level: c.level || 0, status: c.status || 'gray', now: c.now ? ((names[c.now] && names[c.now][0]) || kn[c.now] || '') : '' }; }).filter(function (x) { return x.level || x.status !== 'gray'; });
    var bal = null; try { if (typeof moneyBalance_ === 'function') bal = moneyBalance_(r.id); } catch (e) {}
    return { id: r.id, name: r.name, first: String(r.name).split(' ')[0], streak: (st.streak && st.streak.n) || 0, week: week, month: row.mm, ever: row.mt, subjects: subj, practice7: { skills: active, tries: tries, right: right }, balance: bal, notes: ppNotesOf_(r.id), teachers: ppTeachers_(r.id) };
  }).sort(function (a, b) { return a.name.localeCompare(b.name); });
  return { parent: { id: p.id, name: p.name, title: p.title }, kids: kids, repeats: AC.REPEATS, today: acToday_() };
}
function ppTeachers_(sid) {
  var mem = acMembers_(), school = acSchoolOf_(sid, mem), sc = acScopeRows_();
  return acStaffRows_().filter(function (x) { return x.active && x.role !== 'canteen' && ((sc[x.id] || {}).school || AC.DEF) === school; }).map(function (x) { return { id: x.id, name: x.name, role: x.role }; }).sort(function (a, b) { return a.name.localeCompare(b.name); });
}
function ppSaveNote(token, sid, n) {
  var p = ppKid_(token, sid); n = n || {};
  var text = acClean_(n.text, 240), kind = n.kind === 'note' ? 'note' : 'reminder', repeat = AC.REPEATS.indexOf(n.repeat) >= 0 ? n.repeat : 'daily', time = String(n.time || ''), date = String(n.date || '');
  if (text.length < 2) throw new Error('Type the reminder.');
  if (kind === 'reminder' && repeat !== 'next' && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Pick a time.');
  if (repeat === 'once' && !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Pick the day.');
  if (ppNotesOf_(String(sid)).filter(function (x) { return x.pid === p.id; }).length >= 20) throw new Error('That is a lot of reminders. Please remove an old one first.');
  return sgLock_(function () {
    var id = 'N' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
    acTab_('MS_ParentNotes').appendRow([id, new Date(), p.id, p.title || p.name, String(sid), kind, text, repeat === 'next' ? '' : time, repeat, date, true, '', '']);
    return { id: id };
  });
}
function ppDeleteNote(token, id) {
  var p = ppMe_(token); id = String(id || '');
  return sgLock_(function () {
    var sh = acTab_('MS_ParentNotes'), rows = acRows_('MS_ParentNotes');
    for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === id) { if (String(rows[i][2]) !== p.id) throw new Error('You can only remove your own reminders.'); sh.getRange(i + 2, 11).setValue(false); return { ok: true }; }
    throw new Error('That reminder is gone already.');
  });
}
function ppMessageTeacher(token, sid, staffId, text) {
  var p = ppKid_(token, sid); text = acClean_(text, 600); staffId = String(staffId || '');
  if (text.length < 2) throw new Error('Type your message.');
  var t = ppTeachers_(String(sid)).filter(function (x) { return x.id === staffId; })[0]; if (!t) throw new Error('Pick a teacher.');
  var kid = msRoster_().filter(function (r) { return r.id === String(sid); })[0];
  var c = CacheService.getScriptCache(), k = 'pp_msg_' + p.id + '_' + acToday_(), n = Number(c.get(k) || 0); if (n >= 20) throw new Error('Please send more messages tomorrow.');
  return sgLock_(function () {
    crTab_(CR.MSG).appendRow(['M' + Date.now().toString(36), new Date(), String(sid), (p.title || p.name) + ' (parent of ' + (kid ? kid.name : sid) + ')', t.id, t.name, text, '']);
    try { c.put(k, String(n + 1), 86400); } catch (e) {}
    return { ok: true };
  });
}

/* ---------- the student's side: reminders from home ---------- */
function kpDue_(n, now) {
  var hm = Utilities.formatDate(now, 'America/New_York', 'HH:mm'), day = Utilities.formatDate(now, 'America/New_York', 'yyyy-MM-dd'), dow = Number(Utilities.formatDate(now, 'America/New_York', 'u'));
  if (n.ackDay === day && n.repeat !== 'next') return false;
  if (n.repeat === 'next' || n.kind === 'note') return !n.ack;
  if (n.repeat === 'once' && n.date !== day) return false;
  if (dow === 6) return false;   /* never on Shabbos */
  if (n.repeat === 'weekdays' && dow === 7) return false;   /* weekdays = Monday to Friday */
  return n.time && hm >= n.time;
}
function kpMine(token) {
  var s = msSession_(token); if (!s || s.role !== 'kid' || !s.sid) return { due: [] };
  var now = new Date();
  return { due: ppNotesOf_(String(s.sid)).filter(function (n) { return kpDue_(n, now); }).map(function (n) { return { id: n.id, text: n.text, from: n.from, time: n.time, kind: n.kind }; }) };
}
function kpAck(token, id) {
  var s = msSession_(token); if (!s || s.role !== 'kid') throw new Error('Please sign in again.'); id = String(id || '');
  return sgLock_(function () {
    var sh = acTab_('MS_ParentNotes'), rows = acRows_('MS_ParentNotes');
    for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === id && String(rows[i][4]) === String(s.sid)) { sh.getRange(i + 2, 12, 1, 2).setValues([[new Date(), acToday_()]]); if (String(rows[i][8]) === 'next' || String(rows[i][8]) === 'once') sh.getRange(i + 2, 11).setValue(false); return { ok: true }; }
    return { ok: false };
  });
}
function acSelfTest() { return { schools: acSchools_().length, parents: acParentRows_().length, notes: acRows_('MS_ParentNotes').length, ver: acVer_() }; }

/* ---------- Curriculum Preview (HoS request 2026-11-15): staff browse every subject, level and skill, watch Teacher Time,
   try any lesson as a student in a SANDBOX, and see every question with its answer. The page is the real student app (same
   lessons, nothing copied) with a guard (cpPrelude_) that lets only the read-only lesson loaders reach the server; every other
   server call (save, money, progress) is answered on the page itself and never sent. Staff only (cpLoad checks the session). ---------- */
function cpPrelude_() {
  return '<script>(function(){ try{ var g=window.google&&google.script; if(!g) return; var real=g.run;' +
    ' var ALLOW={msQuestTools:1,msQuestToolsGet:1,msQuestToolsParts:1,msAppUrl:1,cpLoad:1,cgSync:1,cgReview:1};' +
    ' function mk(){ var s=null,f=null,u=null,p=new Proxy({}, {get:function(t,k){' +
    '  if(k==="withSuccessHandler") return function(fn){ s=fn; return p; }; if(k==="withFailureHandler") return function(fn){ f=fn; return p; }; if(k==="withUserObject") return function(o){ u=o; return p; };' +
    '  if(ALLOW[k]) return function(){ var r=real; if(s) r=r.withSuccessHandler(s); if(f) r=r.withFailureHandler(f); if(u!==null) r=r.withUserObject(u); return r[k].apply(r,arguments); };' +
    '  return function(){ var a=arguments; setTimeout(function(){ if(s) s(k==="msLoad"?{states:{},roster:[]}:{ok:true,preview:true}, u); },0); window.TL_CP_BLOCKED=(window.TL_CP_BLOCKED||0)+1; }; }}); return p; }' +
    ' try{ Object.defineProperty(g,"run",{get:mk,configurable:true}); }catch(e){ window.google={script:{host:g.host,url:g.url,history:g.history}}; Object.defineProperty(window.google.script,"run",{get:mk}); }' +
    ' window.TL_PREVIEW=true; }catch(e){} })();</script>';
}
function cpPage_() {
  var page = HtmlService.createHtmlOutputFromFile('QuestPage').getContent(), add = '';
  try { add = HtmlService.createHtmlOutputFromFile('CurriculumPreview').getContent(); } catch (e) {}
  try { add += HtmlService.createHtmlOutputFromFile('CurriculumGuide').getContent(); } catch (e) {}   /* v243 takeover2: Curriculum Guide overview, coverage, What's new, review status (server: CurriculumReview.js) */
  try { add += HtmlService.createHtmlOutputFromFile('PreviewKid').getContent(); } catch (e) {}   /* v266 takeover3: split screen, click a lesson and see the real kid screen */
  var h = page.indexOf('<head>'); page = h < 0 ? cpPrelude_() + page : page.slice(0, h + 6) + cpPrelude_() + page.slice(h + 6);
  var i = page.lastIndexOf('</body>'); page = i < 0 ? page + add : page.slice(0, i) + add + page.slice(i);
  return HtmlService.createHtmlOutput(tlSound_(tlTheme_(page, 'boy'))).setTitle('Tashbar Learning · Curriculum Preview')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}
function cpLoad(token) { var s = sgStaff_(token); return { ok: true, name: (s.who && s.who.name) || 'Staff', url: ScriptApp.getService().getUrl() }; }
