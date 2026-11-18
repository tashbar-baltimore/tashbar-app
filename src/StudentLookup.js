/* STUDENT LOOKUP (Head of School 2026-11-18: "there should be a way that when you look up a student, all the information about the
   student is there, their code, their everything. And everything can be changed ... from one way to look up one student").
   Claude Code builder. Server side of StudentLookupUI.html (the "Find a student" bar on the staff screen).
   - slFind: every student this staff member may see (name, grade, school) for the search box. Light: no lesson data.
   - slInfo: one student's details (name, grade, school, parents) and what this staff member may change.
   - slSave: change name and grade (Head of School or that school's admin).
   School moves, parents and sign-in codes use the existing functions and rules (acMoveStudents, acSaveParent, sgFreeCode, sgSetCode).
   Sign-in codes stay secret: only their salt and hash are kept, so an old code is never shown, only replaced. */
function slGradeOf_(note) { var m = /grade\s+(K|\d)/i.exec(String(note || '')); return m ? m[1].toUpperCase() : ''; }
function slCan_(token) {
  var s = sgStaff_(token), w = s.who || {}, admin = null;
  try { admin = acAdmin_(token); } catch (e) { admin = null; }
  return { s: s, head: w.role === 'head', admin: admin };
}
function slFind(token) {
  slCan_(token);   /* staff only; sets what this staff member may see */
  var mem = acMembers_(), names = {}; acSchools_().forEach(function (x) { names[x.id] = x.name; });
  return msRows_('roster').filter(function (r) { return r[0] && r[7] !== false && (!TL_SCOPE_ || TL_SCOPE_[String(r[0])]); }).map(function (r) {
    var id = String(r[0]), sc = mem[id] || AC.DEF;
    return { id: id, name: String(r[1]), grade: slGradeOf_(r[8]), school: names[sc] || (sc === AC.DEF ? AC.DEFNAME : sc), test: /^TEST-/.test(id) };
  }).sort(function (a, b) { return a.name.localeCompare(b.name); });
}
function slInfo(token, sid) {
  sid = String(sid || ''); var c = slCan_(token); tlGuard_(token, sid);
  var row = msRows_('roster').filter(function (r) { return String(r[0]) === sid && r[7] !== false; })[0];
  if (!row) throw new Error('That student is not on the list.');
  var mem = acMembers_(), school = mem[sid] || AC.DEF, schools = acSchools_();
  var mySchool = schools.filter(function (x) { return x.id === school; })[0];
  var parents = acParentRows_().filter(function (p) { return p.active && p.sids.indexOf(sid) >= 0; }).map(function (p) { return { id: p.id, name: p.name, title: p.title, email: p.email, phone: p.phone }; });
  var canEdit = !!(c.admin && (c.admin.head || c.admin.school === school));
  var others = canEdit ? acParentRows_().filter(function (p) { return p.active && p.sids.indexOf(sid) < 0 && (c.admin.head || p.school === c.admin.school); })
    .map(function (p) { return { id: p.id, name: p.title || p.name, kids: p.sids.length }; }).sort(function (a, b) { return a.name.localeCompare(b.name); }) : [];
  return { id: sid, name: String(row[1]), grade: slGradeOf_(row[8]), note: String(row[8] || ''), school: school, schoolName: mySchool ? mySchool.name : AC.DEFNAME,
    schools: c.head ? schools.map(function (x) { return { id: x.id, name: x.name }; }) : [], parents: parents, otherParents: others,
    can: { edit: canEdit, move: !!c.head, parents: canEdit, code: true } };
}
function slSave(token, sid, x) {
  sid = String(sid || ''); x = x || {}; tlGuard_(token, sid);
  var me = acAdmin_(token), school = acSchoolOf_(sid); acMine_(me, school);
  var name = acClean_(x.name, 60), g = String(x.grade == null ? '' : x.grade).toUpperCase().trim(), gn = g === 'K' ? 0 : Number(g);
  if (name.length < 3 || name.indexOf(' ') < 0) throw new Error('Type the student’s first and last name.');
  if (!(g !== '' && gn >= 0 && gn <= 8 && Math.round(gn) === gn)) throw new Error('Pick the grade, K to 8.');
  return sgLock_(function () {
    var sh = msTab_('roster'), rows = msRows_('roster');
    if (rows.some(function (r) { return r[7] !== false && String(r[0]) !== sid && String(r[1]).toLowerCase() === name.toLowerCase(); })) throw new Error(name + ' is already on the list.');
    for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === sid && rows[i][7] !== false) {
      var r = rows[i], note = String(r[8] || ''), gtxt = 'grade ' + (gn === 0 ? 'K' : gn), changes = [];
      if (String(r[1]) !== name) changes.push('name was ' + String(r[1]));
      if (slGradeOf_(note) !== (gn === 0 ? 'K' : String(gn))) changes.push(gtxt);
      if (!changes.length) return { ok: true, same: true };
      note = /grade\s+(K|\d)/i.test(note) ? note.replace(/grade\s+(K|\d)/i, gtxt) : (gtxt + (note ? ' · ' + note : ''));
      note += ' · ' + changes.join(', ') + ' (changed ' + sgToday_() + ' by ' + me.name + ')';
      sh.getRange(i + 2, 2).setValue(name); sh.getRange(i + 2, 9).setValue(note.slice(0, 1500));
      acBump_(); return { ok: true };
    }
    throw new Error('That student is not on the list.');
  });
}
/* link / unlink a parent who is already in the system (keeps every other detail of the parent as it is; acSaveParent rules apply) */
function slParentLink_(token, sid, pid, on) {
  sid = String(sid || ''); pid = String(pid || ''); tlGuard_(token, sid);
  var p = acParentRows_().filter(function (q) { return q.id === pid; })[0]; if (!p) throw new Error('That parent is not on the list.');
  var sids = p.sids.filter(function (x) { return x !== sid; }); if (on) sids.push(sid);
  if (!sids.length) throw new Error('This is the parent’s only child. To stop this parent signing in, use Schools & Families.');
  return acSaveParent(token, { id: p.id, name: p.name, title: p.title, email: p.email, phone: p.phone, sids: sids, active: true });
}
function slLinkParent(token, sid, pid) { return slParentLink_(token, sid, pid, true); }
function slUnlinkParent(token, sid, pid) { return slParentLink_(token, sid, pid, false); }
