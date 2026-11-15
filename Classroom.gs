/* Classroom.js — HoS DECISION 2230 (2026-11-12), takeover2 builder.
   1. "Talk to my Rebbe or Teacher": a boy picks ANY staff member and writes a note. Only that staff member sees it
      (crInbox returns only the signed-in staff member's own notes; no report, export or other staff view reads MS_Messages).
   2. Staff "My classes": each staff member keeps his own classes (a name, a subject, his boys).
   3. Staff "My lessons": each staff member writes his own lessons (multiple-choice questions, optional How to do it line).
      Teacher lessons have skill ids TCH.<id>. They NEVER pay money (MiddleSchool.js msCheckPay_ skips TCH.*; CLAUDE.md money rule).
   4. Class session: a staff member starts one of his classes on one or more lessons (any built lesson, or his own) for a time;
      the boys' screens lock to only those lessons (TeacherMode.js session store + ClassMode.html on the boy page).
   Sheets: MS_Messages, MS_Classes, MS_TeacherLessons (created on first use). */
var CR = { MSG: 'MS_Messages', CLS: 'MS_Classes', LES: 'MS_TeacherLessons',
  H: { MS_Messages: ['id', 'at', 'from_sid', 'from_name', 'to_staff', 'to_name', 'text', 'read_at'],
       MS_Classes: ['id', 'staff_id', 'staff_name', 'name', 'subject', 'sids', 'created', 'active'],
       MS_TeacherLessons: ['id', 'staff_id', 'staff_name', 'subject', 'title', 'json', 'created', 'active'] },
  MAXMSG: 1000, PERDAY: 15, MAXQ: 25 };

function crTab_(name) {
  var ss = msBook_(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.getRange(1, 1, 1, CR.H[name].length).setValues([CR.H[name]]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function crRows_(name) { var sh = crTab_(name), n = sh.getLastRow(); return n < 2 ? [] : sh.getRange(2, 1, n - 1, CR.H[name].length).getValues(); }
function crClean_(s, max) { return String(s == null ? '' : s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max); }
function crOn_(v) { return !(v === false || String(v).toUpperCase() === 'FALSE'); }

/* the staff who can receive notes: real staff rows, active, not canteen-only */
function crStaffAll_() {
  var sh = msBook_().getSheetByName('MS_Staff'), n = sh ? sh.getLastRow() : 0;
  if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, 6).getValues().filter(function (r) { return r[0] && crOn_(r[4]) && String(r[5] || '').toLowerCase() !== 'canteen'; })
    .map(function (r) { return { id: String(r[0]), name: String(r[1]) }; }).sort(function (a, b) { return a.name.localeCompare(b.name); });
}
function crKid_(token) { var s = msSession_(token); if (!s || s.role !== 'kid' || !s.sid) throw new Error('Please sign in again.'); return s; }
function crMe_(token) {
  var s = sgStaff_(token), w = s.who;
  if (!w || !w.id || w.id === 'staff') throw new Error('Please sign in with your own staff code to use this.');
  return { id: w.id, name: w.name, head: w.role === 'head' };
}
function crBoyName_(sid) { var r = msRoster_().filter(function (x) { return x.id === sid; })[0]; return r ? r.name : sid; }

/* ---------- 1. Talk to my Rebbe or Teacher ---------- */
function crStaffList(token) { crKid_(token); return crStaffAll_(); }
function crSend(token, staffId, text) {
  var s = crKid_(token); staffId = String(staffId || ''); text = crClean_(text, CR.MAXMSG);
  if (!text) throw new Error('Write your note first.');
  var to = crStaffAll_().filter(function (x) { return x.id === staffId; })[0];
  if (!to) throw new Error('Pick who to send it to.');
  var c = CacheService.getScriptCache(), k = 'crmsg_' + s.sid + '_' + sgToday_(), n = Number(c.get(k) || 0);
  if (n >= CR.PERDAY) throw new Error('You sent a lot of notes today. You can talk to your rebbe in person, too.');
  return sgLock_(function () {
    crTab_(CR.MSG).appendRow([Utilities.getUuid(), new Date().toISOString(), s.sid, crBoyName_(s.sid), to.id, to.name, text, '']);
    c.put(k, String(n + 1), 86400);
    return { ok: true, to: to.name };
  });
}
/* staff: ONLY my own notes */
function crInbox(token) {
  var me = crMe_(token);
  return crRows_(CR.MSG).filter(function (r) { return String(r[4]) === me.id; })
    .map(function (r) { return { id: String(r[0]), at: String(r[1]), from: String(r[3]), sid: String(r[2]), text: String(r[6]), read: !!r[7] }; })
    .reverse().slice(0, 200);
}
function crUnread(token) { var me = crMe_(token); return crRows_(CR.MSG).filter(function (r) { return String(r[4]) === me.id && !r[7]; }).length; }
function crMarkRead(token, id) {
  var me = crMe_(token); id = String(id || '');
  return sgLock_(function () {
    var sh = crTab_(CR.MSG), rows = crRows_(CR.MSG);
    for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === id && String(rows[i][4]) === me.id) { if (!rows[i][7]) sh.getRange(i + 2, 8).setValue(new Date().toISOString()); return true; }
    return false;
  });
}

/* ---------- 2. My classes ---------- */
function crClassRow_(r) { var sids = []; try { sids = JSON.parse(r[5] || '[]'); } catch (e) {} return { id: String(r[0]), staffId: String(r[1]), staff: String(r[2]), name: String(r[3]), subject: String(r[4]), sids: sids, active: crOn_(r[7]) }; }
function crMyClasses_(me) { return crRows_(CR.CLS).map(crClassRow_).filter(function (c) { return c.active && c.staffId === me.id; }); }
function crClasses(token) {
  var me = crMe_(token);
  return { me: me, classes: crMyClasses_(me), boys: msRoster_().map(function (r) { return { id: r.id, name: r.name }; }).sort(function (a, b) { return a.name.localeCompare(b.name); }) };
}
function crSaveClass(token, c) {
  var me = crMe_(token); c = c || {};
  var name = crClean_(c.name, 60), subject = crClean_(c.subject, 40);
  if (!name) throw new Error('Give the class a name.');
  var roster = {}; msRoster_().forEach(function (r) { roster[r.id] = 1; });
  var sids = (Array.isArray(c.sids) ? c.sids : []).map(String).filter(function (x, i, a) { return roster[x] && a.indexOf(x) === i; });
  if (!sids.length) throw new Error('Pick at least one boy.');
  return sgLock_(function () {
    var sh = crTab_(CR.CLS), rows = crRows_(CR.CLS), id = String(c.id || '');
    for (var i = 0; id && i < rows.length; i++) if (String(rows[i][0]) === id) {
      if (String(rows[i][1]) !== me.id) throw new Error('That is not your class.');
      sh.getRange(i + 2, 4, 1, 3).setValues([[name, subject, JSON.stringify(sids)]]); return crMyClasses_(me);
    }
    sh.appendRow([Utilities.getUuid(), me.id, me.name, name, subject, JSON.stringify(sids), new Date().toISOString(), true]);
    return crMyClasses_(me);
  });
}
function crDeleteClass(token, id) {
  var me = crMe_(token); id = String(id || '');
  return sgLock_(function () {
    var sh = crTab_(CR.CLS), rows = crRows_(CR.CLS);
    for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === id && String(rows[i][1]) === me.id) sh.getRange(i + 2, 8).setValue(false);
    return crMyClasses_(me);
  });
}

/* ---------- 3. My lessons ---------- */
function crLessonRow_(r) { var j = {}; try { j = JSON.parse(r[5] || '{}'); } catch (e) {} return { id: String(r[0]), staffId: String(r[1]), staff: String(r[2]), subject: String(r[3]), title: String(r[4]), intro: j.intro || '', qs: j.qs || [], active: crOn_(r[7]) }; }
function crAllLessons_() { return crRows_(CR.LES).map(crLessonRow_).filter(function (l) { return l.active; }); }
function crLessons(token) { var me = crMe_(token); return crAllLessons_().filter(function (l) { return l.staffId === me.id; }); }
function crSaveLesson(token, l) {
  var me = crMe_(token); l = l || {};
  var title = crClean_(l.title, 80), subject = crClean_(l.subject, 40), intro = crClean_(l.intro, 400);
  if (!title) throw new Error('Give the lesson a title.');
  var qs = (Array.isArray(l.qs) ? l.qs : []).slice(0, CR.MAXQ).map(function (q) {
    var wrong = (Array.isArray(q && q.wrong) ? q.wrong : []).map(function (w) { return crClean_(w, 120); }).filter(String).slice(0, 3);
    return { q: crClean_(q && q.q, 240), right: crClean_(q && q.right, 120), wrong: wrong, how: crClean_(q && q.how, 300) };
  }).filter(function (q) { return q.q && q.right && q.wrong.length; });
  if (!qs.length) throw new Error('Add at least one question with a right answer and at least one wrong answer.');
  qs.forEach(function (q, i) { if (q.wrong.some(function (w) { return w.toLowerCase() === q.right.toLowerCase(); })) throw new Error('Question ' + (i + 1) + ': a wrong answer is the same as the right one.'); });
  var json = JSON.stringify({ intro: intro, qs: qs });
  return sgLock_(function () {
    var sh = crTab_(CR.LES), rows = crRows_(CR.LES), id = String(l.id || '');
    for (var i = 0; id && i < rows.length; i++) if (String(rows[i][0]) === id) {
      if (String(rows[i][1]) !== me.id) throw new Error('That is not your lesson.');
      sh.getRange(i + 2, 4, 1, 3).setValues([[subject, title, json]]); return crLessons(token);
    }
    sh.appendRow([Utilities.getUuid().slice(0, 8), me.id, me.name, subject, title, json, new Date().toISOString(), true]);
    return crLessons(token);
  });
}
function crDeleteLesson(token, id) {
  var me = crMe_(token); id = String(id || '');
  return sgLock_(function () {
    var sh = crTab_(CR.LES), rows = crRows_(CR.LES);
    for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === id && String(rows[i][1]) === me.id) sh.getRange(i + 2, 8).setValue(false);
    return crLessons(token);
  });
}
/* the boy page needs the questions of a teacher lesson in his running class */
function crLessonBody_(id) {
  var l = crAllLessons_().filter(function (x) { return 'TCH.' + x.id === id; })[0];
  return l ? { id: 'TCH.' + l.id, title: l.title, subject: l.subject, intro: l.intro, qs: l.qs, by: l.staff } : null;
}

/* every built lesson in every subject, with its name (plBuilt_ covers General Studies only) */
function crCatalog_() {
  var c = CacheService.getScriptCache(), hit = c.get('cr_cat_v1'); if (hit) return JSON.parse(hit);
  var html = '';
  ['MathMore', 'ReadMore', 'ScienceMore', 'ElectivesMore', 'ComputingMore', 'LifeMore', 'SocialMore', 'KodeshMore', 'SimchaMore'].forEach(function (f) { try { html += tlFileText_(f); } catch (e) {} });
  try { html += HtmlService.createHtmlOutputFromFile('QuestPage').getContent(); } catch (e) {}
  var re = /['"]((?:MATH|READ|WRIT|LANG|VOC|SCI|ELEC|COMP|LIFE|SS|LK|HEB|SIM)(?:\.[A-Z]+)?\.L\d\d\.\d\d(?:\.[a-z])?)['"]\s*\]?\s*[:=]\s*\{\s*["']?name["']?\s*:\s*(['"`])((?:\\.|(?!\2)[^\\])*)\2/g, m, seen = {}, out = [];
  while ((m = re.exec(html))) { if (seen[m[1]]) continue; seen[m[1]] = 1; out.push([m[1], m[3].replace(/\\(.)/g, '$1').slice(0, 90)]); }
  try { c.put('cr_cat_v1', JSON.stringify(out), 600); } catch (e) {}
  return out;
}
function crCatalog(token) { crMe_(token); return crCatalog_(); }

/* ---------- 4. Start a class on chosen lessons ---------- */
function crStartClass(token, classId, skills, minutes) {
  var me = crMe_(token); classId = String(classId || ''); minutes = Math.round(Number(minutes) || 0);
  var cls = crMyClasses_(me).filter(function (c) { return c.id === classId; })[0];
  if (!cls) throw new Error('Pick one of your classes.');
  var mine = {}; crAllLessons_().forEach(function (l) { if (l.staffId === me.id) mine['TCH.' + l.id] = l.title; });
  var built = {}; plBuilt_().forEach(function (x) { built[x] = 1; });
  var names = {}; crCatalog_().forEach(function (x) { names[x[0]] = x[1]; });
  skills = (Array.isArray(skills) ? skills : []).map(String).filter(function (x, i, a) { return a.indexOf(x) === i && (mine[x] || built[x] || names[x]); }).slice(0, 12);
  if (!skills.length) throw new Error('Pick at least one lesson.');
  if (!(minutes >= TM.MIN && minutes <= TM.MAX)) throw new Error('Pick how long: ' + TM.MIN + ' to ' + TM.MAX + ' minutes.');
  var roster = {}; msRoster_().forEach(function (r) { roster[r.id] = 1; });
  var sids = cls.sids.filter(function (x) { return roster[x]; });
  if (!sids.length) throw new Error('This class has no boys on the list.');
  var title = skills.length === 1 ? (mine[skills[0]] || names[skills[0]] || skills[0]) : cls.name;
  return sgLock_(function () {
    var list = tmRead_();
    list.forEach(function (x) { x.sids = x.sids.filter(function (id) { return sids.indexOf(id) < 0; }); });
    list = list.filter(function (x) { return x.sids.length; });
    var now = Date.now();
    list.push({ id: Utilities.getUuid(), skill: skills[0], skills: skills, cls: cls.id, clsName: cls.name, name: title, subj: tmSubjOf_(skills[0]), sids: sids, by: me.name, byId: me.id, start: now, until: now + minutes * 60000 });
    return tmWrite_(list).map(tmPublic_);
  });
}
/* my running classes (any staff member can still see and end every class in the old Teacher mode panel) */
function crRunning(token) { var me = crMe_(token); return tmRead_().filter(function (s) { return s.byId === me.id; }).map(tmPublic_); }
function crEndClass(token, id) { var me = crMe_(token); id = String(id || ''); return sgLock_(function () { return tmWrite_(tmRead_().filter(function (x) { return !(x.id === id && (x.byId === me.id || me.head)); })).map(tmPublic_); }); }

/* ---------- 5. Staff accounts (Head of School only) ---------- */
var CR_ROLES = ['rebbe', 'teacher', 'head', 'office', 'canteen'];
function crHead_(token) { var me = crMe_(token); if (!me.head) throw new Error('Only the Head of School can change staff accounts.'); return me; }
function crStaffAdmin(token) { crHead_(token); return cnStaffAll_().map(function (x) { return { id: x.id, name: x.name, role: x.role, active: x.active }; }).sort(function (a, b) { return a.name.localeCompare(b.name); }); }
function crCodeFree_(code, exceptId) {
  if (code === '7300') return false;
  if (cnStaffAll_().some(function (x) { return x.id !== exceptId && x.salt && msHash_(x.salt, code) === x.hash; })) return false;
  if (msRoster_().some(function (r) { return r.salt && msHash_(r.salt, code) === r.hash; })) return false;
  return true;
}
function crStaffSave(token, x) {
  var me = crHead_(token); x = x || {};
  var name = crClean_(x.name, 60), role = String(x.role || 'teacher').toLowerCase(), code = String(x.code || '').replace(/\D/g, ''), id = String(x.id || '');
  if (name.length < 2) throw new Error('Write the staff member’s name.');
  if (CR_ROLES.indexOf(role) < 0) throw new Error('Pick a role.');
  if (code && !/^\d{4,8}$/.test(code)) throw new Error('The code must be 4 to 8 numbers.');
  if (!id && !code) throw new Error('Give the new staff member a code (4 to 8 numbers).');
  if (code && !crCodeFree_(code, id)) throw new Error('That code is already used. Pick a different code.');
  var active = x.active !== false;
  if (id === me.id && (!active || role !== 'head')) throw new Error('You cannot turn off your own Head of School account.');
  return sgLock_(function () {
    var sh = msBook_().getSheetByName('MS_Staff'), all = cnStaffAll_();
    if (id) {
      var row = all.filter(function (y) { return y.id === id; })[0]; if (!row) throw new Error('That staff member is not on the list.');
      sh.getRange(row.row, 2).setValue(name); sh.getRange(row.row, 5).setValue(active); sh.getRange(row.row, 6).setValue(role);
      if (code) { var salt = Utilities.getUuid(); sh.getRange(row.row, 3, 1, 2).setValues([[salt, msHash_(salt, code)]]); }
    } else {
      var nid; do { nid = 'STF-' + (1000 + Math.floor(Math.random() * 9000)); } while (all.some(function (y) { return y.id === nid; }));
      var salt2 = Utilities.getUuid(); sh.appendRow([nid, name, salt2, msHash_(salt2, code), true, role, '', '']);
    }
    return crStaffAdmin(token);
  });
}

/* editor self-test: shapes only, no writes */
function crSelfTest() { return { staff: crStaffAll_().length, tabs: [CR.MSG, CR.CLS, CR.LES].map(function (t) { return t + ':' + CR.H[t].length; }) }; }
