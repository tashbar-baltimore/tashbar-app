/* GRADE INTAKE (LEARN BY LEVEL section 3, Head of School DECISION 2026-11-18 2245-ET: "the look follows the age").
   Claude Code builder. Staff are the source of truth: the roster note "grade K".."grade 8" decides a boy's world.
   - lblAskGrade:        a boy with NO grade on file answers "What grade are you in?" ONCE. Saved as UNCONFIRMED (look only).
   - lblGradesToConfirm: staff list of those answers.  lblConfirmGrade: staff confirm or change -> written to the roster note.
   - lblClassPreview / lblClassSave: bulk class lists ("First Last, Grade[, Class]"). Preview first, then one Save all.
   - lblGradeUpPreview / lblGradeUp / lblGradeUpUndo: "Move everyone up one grade" for a new school year, with undo.
   Every roster change is noted on the roster history line, the same way Student Lookup (slSave) does it.
   No money, mastery, evidence, placement, sign-in protection or parent email changes. Codes stay salt + hash (sgFreeCode/sgSetCode).
   NEW STUDENTS: adding a roster row is done by the app's EXISTING add-student function. The firebase builder sets ONE line:
     LBL_INTAKE.addStudent = function (token, name, grade) { ...existing add... return { id: newSid }; };
   Until that line is set, Save all still updates existing students and lists new ones as "waiting". */
var LBL_INTAKE = { addStudent: null, ASK: 'LBL_GRADE_ASK', CLASS: 'LBL_CLASS', UNDO: 'LBL_GRADEUP_UNDO' };
/* new students go through the app's own sgAddStudent (StaffGrid.js): its name, grade and code rules, its school assignment.
   Pasting a class list counts as "this is a real Tashbar student" (sgAddStudent's onRoster tick). */
LBL_INTAKE.addStudent = function (token, name, grade) {
  if (typeof sgAddStudent !== 'function' || typeof sgFreeCode !== 'function') return null;
  var c = sgFreeCode(token).code, r = sgAddStudent(token, name, grade, c, true);
  return r && r.id ? { id: r.id, code: c } : null;
};
function lblProp_(k, v) { var p = PropertiesService.getScriptProperties(); if (arguments.length > 1) { p.setProperty(k, JSON.stringify(v)); return v; } try { return JSON.parse(p.getProperty(k) || '{}') || {}; } catch (e) { return {}; } }
function lblGradeTxt_(n) { return 'grade ' + (n === 0 ? 'K' : n); }
function lblGradeShow_(n) { return n == null ? '' : (n === 0 ? 'K' : String(n)); }
function lblRosterIdx_() { var rows = msRows_('roster'), m = {}; rows.forEach(function (r, i) { if (r[0] && r[7] !== false) m[String(r[0])] = i; }); return { rows: rows, at: m }; }
/* write one grade into a roster note (call inside sgLock_). Returns false if nothing changed. */
function lblWriteGrade_(sh, rows, i, n, by, why) {
  var note = String(rows[i][8] || ''), cur = /grade\s+(K|\d)/i.exec(note), gtxt = lblGradeTxt_(n);
  if (cur && lblGradeNum_(cur[1]) === n) return false;
  note = cur ? note.replace(/grade\s+(K|\d)/i, gtxt) : (gtxt + (note ? ' · ' + note : ''));
  note += ' · ' + gtxt + ' (' + why + ' ' + sgToday_() + ' by ' + by + ')';
  sh.getRange(i + 2, 9).setValue(note.slice(0, 1500)); rows[i][8] = note.slice(0, 1500); return true;
}
function lblAdminFor_(token, sid) { var me = acAdmin_(token); acMine_(me, acSchoolOf_(sid)); return me; }
function lblInScope_(me, sid) { try { acMine_(me, acSchoolOf_(sid)); return true; } catch (e) { return false; } }

/* ---------- the boy: asked once ---------- */
function lblAskGrade(token, grade) {
  var s = msSession_(token); if (!s || s.role !== 'kid' || !s.sid) throw new Error('Please sign in again.');
  var sid = String(s.sid), n = lblGradeNum_(grade);
  if (n == null) throw new Error('Pick your grade.');
  if (lblRosterGrade_(sid) != null) throw new Error('Your school already set your grade.');
  return sgLock_(function () {
    var m = lblProp_(LBL_INTAKE.ASK);
    if (m[sid]) throw new Error('You already told us your grade. Thank you!');
    m[sid] = { g: lblGradeShow_(n), at: new Date().toISOString() }; lblProp_(LBL_INTAKE.ASK, m);
    return { ok: true, plan: lblPlanFor_(sid) };
  });
}

/* ---------- staff: Grades to confirm ---------- */
function lblGradesToConfirm(token) {
  var me = acAdmin_(token), m = lblProp_(LBL_INTAKE.ASK), R = lblRosterIdx_(), out = [];
  Object.keys(m).forEach(function (sid) {
    var i = R.at[sid]; if (i == null || lblRosterGrade_(sid) != null || !lblInScope_(me, sid)) return;
    out.push({ id: sid, name: String(R.rows[i][1]), said: m[sid].g, at: m[sid].at });
  });
  return out.sort(function (a, b) { return a.name.localeCompare(b.name); });
}
function lblConfirmGrade(token, sid, grade) {
  sid = String(sid || ''); tlGuard_(token, sid); var me = lblAdminFor_(token, sid), n = lblGradeNum_(grade);
  if (n == null) throw new Error('Pick the grade, K to 8.');
  return sgLock_(function () {
    var R = lblRosterIdx_(), i = R.at[sid]; if (i == null) throw new Error('That student is not on the list.');
    var m = lblProp_(LBL_INTAKE.ASK), said = m[sid] ? m[sid].g : null;
    lblWriteGrade_(msTab_('roster'), R.rows, i, n, me.name, said != null && lblGradeNum_(said) === n ? 'confirmed' : 'set (he said ' + (said == null ? '?' : said) + ')');
    delete m[sid]; lblProp_(LBL_INTAKE.ASK, m); acBump_();
    return { ok: true, id: sid, grade: lblGradeShow_(n) };
  });
}

/* ---------- staff: Class lists (bulk) ---------- */
function lblNameKey_(s) {
  s = String(s || '').toLowerCase().replace(/[^a-z]/g, '');
  s = s.replace(/kh|ch|ck/g, 'k').replace(/ph/g, 'f').replace(/tz|ts/g, 's').replace(/sh/g, 'S').replace(/th/g, 't');
  s = s.replace(/[vw]/g, 'b').replace(/[cqh]/g, 'k').replace(/z/g, 's').replace(/f/g, 'p');
  return (s.charAt(0) + s.slice(1).replace(/[aeiouy]/g, '')).replace(/(.)\1+/g, '$1');
}
function lblCleanName_(s) { return String(s || '').replace(/\s+/g, ' ').trim().slice(0, 60); }
function lblParseGrade_(s) {
  s = String(s || '').toUpperCase().replace(/GRADE|GR\.?|ST|ND|RD|TH|\s/g, '');
  if (s === 'K' || s === 'KG' || s === 'KINDERGARTEN' || s === 'KINDERGARTE' || s === '0') return 0;
  return /^\d$/.test(s) ? lblGradeNum_(s) : null;
}
function lblParseLines_(text) {
  return String(text || '').split(/\r?\n/).map(function (line, i) { return { n: i + 1, raw: line }; }).filter(function (x) { return x.raw.trim(); }).map(function (x) {
    var parts = x.raw.indexOf('\t') >= 0 ? x.raw.split('\t') : x.raw.split(','), name, grade, cls;
    parts = parts.map(function (p) { return p.trim(); });
    if (parts.length >= 3 && lblParseGrade_(parts[2]) != null && lblParseGrade_(parts[1]) == null && !/\d/.test(parts[1])) { name = parts[0] + ' ' + parts[1]; grade = parts[2]; cls = parts[3] || ''; }   /* First, Last, Grade */
    else { name = parts[0]; grade = parts[1]; cls = parts[2] || ''; }
    return { line: x.n, name: lblCleanName_(name), gradeText: String(grade == null ? '' : grade).trim(), grade: lblParseGrade_(grade), cls: lblCleanName_(cls) };
  }).filter(function (r) { return !(/^name$|first/i.test(r.name) && /grade/i.test(r.gradeText)); });   /* header row */
}
function lblClassPlan_(token, text) {
  var me = acAdmin_(token), R = lblRosterIdx_(), byName = {}, byKey = {};
  Object.keys(R.at).forEach(function (sid) { var nm = String(R.rows[R.at[sid]][1]); var k = nm.toLowerCase(); (byName[k] = byName[k] || []).push(sid); var kk = lblNameKey_(nm); (byKey[kk] = byKey[kk] || []).push(sid); });
  var seen = {}, rows = lblParseLines_(text).map(function (r) {
    var out = { line: r.line, name: r.name, grade: lblGradeShow_(r.grade), cls: r.cls };
    var low = r.name.toLowerCase();
    if (r.name.length < 3 || r.name.indexOf(' ') < 0) return Object.assign(out, { status: 'unclear', why: 'Type first and last name.' });
    if (r.grade == null) return Object.assign(out, { status: 'unclear', why: r.gradeText ? 'Grade "' + r.gradeText + '" is not K to 8.' : 'Grade is missing.' });
    if (seen[low]) return Object.assign(out, { status: 'unclear', why: 'Same name twice in this list (line ' + seen[low] + ').' });
    seen[low] = r.line;
    var ex = byName[low] || [];
    if (ex.length > 1) return Object.assign(out, { status: 'unclear', why: 'Two students already have this name. Use Find a student.' });
    if (ex.length === 1) {
      var sid = ex[0], cur = lblRosterGrade_(sid); out.id = sid; out.was = lblGradeShow_(cur);
      if (!lblInScope_(me, sid)) return Object.assign(out, { status: 'unclear', why: 'This student is in another school.' });
      return Object.assign(out, cur === r.grade ? { status: 'same' } : { status: 'update' });
    }
    var sim = (byKey[lblNameKey_(r.name)] || []).map(function (s) { return String(R.rows[R.at[s]][1]); });
    if (sim.length) return Object.assign(out, { status: 'unclear', why: 'Looks like ' + sim.join(' or ') + '. Fix the spelling, or write it exactly to update that student.', similar: sim });
    return Object.assign(out, { status: 'new' });
  });
  var count = { new: 0, update: 0, same: 0, unclear: 0 }; rows.forEach(function (r) { count[r.status]++; });
  return { rows: rows, count: count, canAdd: typeof LBL_INTAKE.addStudent === 'function', me: me };
}
function lblClassPreview(token, text) { var p = lblClassPlan_(token, text); delete p.me; return p; }
function lblClassSave(token, text) {
  /* 1. grade updates for students already on the list, under the lock */
  var p = sgLock_(function () {
    var p = lblClassPlan_(token, text), sh = msTab_('roster'), R = lblRosterIdx_(); p.updated = [];
    p.rows.forEach(function (r) { if (r.status === 'update' && lblWriteGrade_(sh, R.rows, R.at[r.id], lblGradeNum_(r.grade), p.me.name, 'class list')) p.updated.push({ id: r.id, name: r.name, grade: r.grade, was: r.was }); });
    if (p.updated.length) acBump_(); return p;
  });
  /* 2. new students through the app's existing add-student function and code rules (they take their own locks) */
  var codes = [], waiting = [];
  p.rows.forEach(function (r) {
    if (r.status !== 'new') return;
    if (typeof LBL_INTAKE.addStudent !== 'function') { waiting.push(r.name); return; }
    var a = LBL_INTAKE.addStudent(token, r.name, r.grade) || {}; if (!a.id) { waiting.push(r.name); return; }
    sgLock_(function () { var R = lblRosterIdx_(), i = R.at[String(a.id)]; if (i != null && lblRosterGrade_(a.id) == null) lblWriteGrade_(msTab_('roster'), R.rows, i, lblGradeNum_(r.grade), p.me.name, 'class list'); });
    var code = a.code; if (!code) { code = sgFreeCode(token).code; sgSetCode(token, a.id, code); }   /* shown once, kept only as salt + hash */
    codes.push({ id: a.id, name: r.name, grade: r.grade, code: code }); r.id = a.id;
  });
  /* 3. optional class / rebbe, kept beside the roster (script property), never in the roster note */
  sgLock_(function () { var cls = lblProp_(LBL_INTAKE.CLASS); p.rows.forEach(function (r) { if (r.id && r.cls && r.status !== 'unclear') cls[r.id] = r.cls; }); lblProp_(LBL_INTAKE.CLASS, cls); });
  return { updated: p.updated, added: codes, waiting: waiting, skipped: p.rows.filter(function (r) { return r.status === 'unclear'; }) };
}

/* ---------- staff: Move everyone up one grade (new school year) ---------- */
function lblGradeUpPlan_(token) {
  var me = acAdmin_(token), R = lblRosterIdx_(), up = [], stay = [];
  Object.keys(R.at).forEach(function (sid) {
    if (/^TEST-/.test(sid) && !me.head) return;
    if (!lblInScope_(me, sid)) return;
    var g = lblRosterGrade_(sid), nm = String(R.rows[R.at[sid]][1]); if (g == null) return;
    if (g >= 8) stay.push({ id: sid, name: nm, grade: '8', why: 'Finished grade 8. Staff decide (remove or keep).' });
    else up.push({ id: sid, name: nm, from: lblGradeShow_(g), to: lblGradeShow_(g + 1) });
  });
  return { up: up.sort(function (a, b) { return a.name.localeCompare(b.name); }), stay: stay, me: me };
}
function lblGradeUpPreview(token) { var p = lblGradeUpPlan_(token); return { up: p.up, stay: p.stay, canUndo: !!lblProp_(LBL_INTAKE.UNDO).at }; }
function lblGradeUp(token) {
  return sgLock_(function () {
    var p = lblGradeUpPlan_(token), sh = msTab_('roster'), R = lblRosterIdx_(), undo = { at: new Date().toISOString(), by: p.me.name, notes: {} };
    p.up.forEach(function (u) { var i = R.at[u.id], before = String(R.rows[i][8] || ''); if (lblWriteGrade_(sh, R.rows, i, lblGradeNum_(u.to), p.me.name, 'new school year')) undo.notes[u.id] = { before: before, after: String(R.rows[i][8]) }; });
    lblProp_(LBL_INTAKE.UNDO, undo); acBump_();
    return { moved: Object.keys(undo.notes).length, stay: p.stay };
  });
}
function lblGradeUpUndo(token) {
  var me = acAdmin_(token);
  return sgLock_(function () {
    var u = lblProp_(LBL_INTAKE.UNDO); if (!u.at) throw new Error('Nothing to undo.');
    var sh = msTab_('roster'), R = lblRosterIdx_(), back = 0, changed = [];
    Object.keys(u.notes).forEach(function (sid) {
      var i = R.at[sid]; if (i == null || !lblInScope_(me, sid)) return;
      if (String(R.rows[i][8] || '') !== u.notes[sid].after) { changed.push(String(R.rows[i][1])); return; }   /* changed since: keep the newer note */
      sh.getRange(i + 2, 9).setValue(u.notes[sid].before); back++;
    });
    PropertiesService.getScriptProperties().deleteProperty(LBL_INTAKE.UNDO); acBump_();
    return { back: back, keptBecauseChangedSince: changed };
  });
}
