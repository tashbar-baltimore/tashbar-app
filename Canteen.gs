/* Tashbar Daily Sign-Off, Canteen Cash, Canteen kiosk and Canteen Crew (v18, 2026-11-09, by CLAUDE for the Head of School).
   MONEY RULES (Head of School, final):
   - Tashbar Bank "$" = lesson money (Money.gs). v162 (HoS 2026-11-13): a boy may buy a Canteen Card in the Tashbar Store (Store.js);
     it is written to Canteen Purchases as a credit row (minus amount, 'Store card <id>'), so the sheet's own formula adds it.
   - Canteen Cash = the rewards sheet (Student Accounts H). ONLY staff add it, ONLY through the daily sign-off below:
     3 goals a session (On time, Did his work, Middos), $0.20 each (Program Rules B6); AM+PM Mon-Thu, AM only Fri and Sun.
   - Canteen Cash goes down only through canteen purchases (one row per sale in Canteen Purchases).
   Nothing a boy does in the app adds Canteen Cash. Formulas in the rewards sheet are never written to.
   Pages: ?so=1 staff tools (SignOffPage.html), ?canteen=1 kiosk (CanteenPage.html). Boy card + Canteen Crew lessons: CanteenKid.html. */
var CN = {
  TEST_ID: '1L-L0M59vJmO3kd48CuTdw8xzKe-vDtVbN5jVA5yx3ZE',   /* TEST COPY - Tashbar Cash Rewards - canteen trial */
  MASTER_ID: '1ePyb5mW6EuY5q696Uk46GMMiNWxw5eGq2eQf1pehcG8', /* Tashbar Cash Rewards - MASTER Database - 2026-27 */
  FIRST: 5, DP_LAST: 17004, CP_LAST: 3000,
  CREW: ['VOC.CREW.01', 'VOC.CREW.02', 'VOC.CREW.03', 'VOC.CREW.04', 'VOC.CREW.05', 'VOC.CREW.06'],
  MENU: 'Canteen Menu',
  MENU_HDR: ['Item ID', 'Item', 'Price $', 'Emoji', 'Picture URL (optional)', 'Stock (blank = not counted)', 'On (TRUE/FALSE)'],
  LOG: 'SO_Log',
  LOG_HDR: ['saved_at', 'date', 'session', 'class', 'staff_id', 'staff_name', 'student_id', 'att', 'on_time', 'work', 'middos', 'action'],
  NO_PM: 'No afternoon class',
  LOW: 3
};

/* ---------- basics ---------- */
function cnTz_() { return Session.getScriptTimeZone() || 'America/New_York'; }
function cnDay_(d) { return Utilities.formatDate(d || new Date(), cnTz_(), 'yyyy-MM-dd'); }
function cnDateObj_(ymd) { var p = String(ymd).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
function cnDow_(ymd) { return Number(Utilities.formatDate(cnDateObj_(ymd), cnTz_(), 'u')) % 7; } /* 0 = Sunday ... 6 = Shabbos */
function cnAddDays_(ymd, n) { var d = cnDateObj_(ymd); d.setDate(d.getDate() + n); return cnDay_(d); }
function cnWeekStart_(ymd) { return cnAddDays_(ymd, -cnDow_(ymd)); } /* Sunday, like WEEKDAY(A,1) in the sheet */
function cnYmd_(v, tz) { if (v instanceof Date) return Utilities.formatDate(v, tz || cnTz_(), 'yyyy-MM-dd'); var s = String(v || '').trim(); return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : ''; }
function cnCheckYmd_(ymd) { ymd = String(ymd || ''); if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) throw new Error('Bad date.'); return ymd; }
function cnAmOnly_(ymd) { var w = cnDow_(ymd); return w === 0 || w === 5; } /* Sunday and Friday: AM only */
function cnBookId_() { return PropertiesService.getScriptProperties().getProperty('CANTEEN_SHEET_ID') || CN.TEST_ID; }
function cnBook_() { return SpreadsheetApp.openById(cnBookId_()); }
function cnIsMaster_() { return cnBookId_() === CN.MASTER_ID; }
/* v18 date fix (2026-11-09): the rewards sheets have no time zone set, so Sheets treats their dates as GMT. Read and write rewards-sheet dates in that sheet's own zone. */
function cnBookTz_(ss) { return (ss || cnBook_()).getSpreadsheetTimeZone() || 'GMT'; }
/* Editor switches. The app writes to the TEST COPY until cnUseMaster() is run. */
function cnUseTestCopy() { PropertiesService.getScriptProperties().setProperty('CANTEEN_SHEET_ID', CN.TEST_ID); Logger.log('Canteen Cash now uses the TEST COPY.'); }
function cnUseMaster() { PropertiesService.getScriptProperties().setProperty('CANTEEN_SHEET_ID', CN.MASTER_ID); Logger.log('Canteen Cash now uses the MASTER rewards sheet.'); }
function cnClean_(s, n) { return String(s == null ? '' : s).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n || 60); }

/* ---------- staff ---------- */
function cnStaffAll_() {
  var sh = msBook_().getSheetByName('MS_Staff'), n = sh ? sh.getLastRow() : 0;
  if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, 8).getValues().map(function (r, i) {
    return { row: i + 2, id: String(r[0]), name: String(r[1]), salt: String(r[2]), hash: String(r[3]),
      active: !(r[4] === false || String(r[4]).toUpperCase() === 'FALSE'),
      role: String(r[5] || 'teacher').toLowerCase(), am: String(r[6] || ''), pm: String(r[7] || '') };
  }).filter(function (s) { return s.id; });
}
/* Used by msSignInCode / msSignIn so a staff session knows WHO signed in. */
function cnStaffInfo_(code) {
  code = String(code || '');
  var s = cnStaffAll_().filter(function (x) { return x.active && msHash_(x.salt, code) === x.hash; })[0];
  return s ? { id: s.id, name: s.name, role: s.role } : null;
}
function cnStaff_(token) {
  var sess = msSession_(token);
  if (sess.role !== 'staff' || !sess.staff || !sess.staff.id) throw new Error('Please sign in again with your staff code.');
  var s = cnStaffAll_().filter(function (x) { return x.id === sess.staff.id && x.active; })[0];
  if (!s || s.role === 'canteen') throw new Error('Please sign in again with your staff code.');
  return s;
}
function cnHead_(s) { if (s.role !== 'head') throw new Error('Head of School only.'); }

/* ---------- boys ---------- */
function cnBoys_() {
  var sh = msTab_('roster'), n = sh.getLastRow();
  if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, 12).getValues().map(function (r, i) {
    return { row: i + 2, id: String(r[0]), name: String(r[1]), salt: r[5], hash: r[6],
      active: !(r[7] === false || String(r[7]).toUpperCase() === 'FALSE'),
      am: String(r[9] || ''), pm: String(r[10] || ''), crew: String(r[11] || '') };
  }).filter(function (b) { return b.id && b.active; });
}
function cnReal_(b) { return !msIsTest_(b.id); }
function cnByName_(a, b) { return a.name < b.name ? -1 : a.name > b.name ? 1 : 0; }

/* ---------- one-time setup (run in the editor) ---------- */
/* Classes from the Head of School's two code emails (Nov 8): AM class = the teacher each boy is listed under.
   PM groups from the roster email of the same day. IDs only here: no names, no codes. */
var CN_AM = {
  'Rabbi Grant': ['T006', 'T007', 'T008', 'T009', 'T010', 'T011', 'T012', 'T014', 'T015', 'T017', 'T018', 'T019', 'T020', 'T021'],
  'Rabbi Kosman': ['T050', 'T051', 'T052', 'T053', 'T054', 'T055', 'T056', 'T057', 'T058'],
  'Rabbi Metzger': ['T042', 'T060', 'T045', 'T061', 'T062', 'T063'],
  'Rabbi Rosenberg': ['T031', 'T032', 'T033', 'T034', 'T035', 'T037', 'T038', 'T039'],
  'Rabbi Shear': ['T022', 'T023', 'T024', 'T025', 'T013', 'T027', 'T016', 'T028', 'T029', 'T030'],
  'Rabbi Swaitiyki': ['T065', 'T040', 'T041', 'T059', 'T043', 'T044', 'T046', 'T066', 'T048', 'T049'],
  'Morah Sackett': ['T064', 'TP-01', 'TP-02', 'TP-03', 'TP-04', 'TP-05']
};
var CN_PM = {
  'Mr. Heyman': ['T006', 'T007', 'T008', 'T010', 'T024', 'T014', 'T019', 'T030'],
  'Rabbi Israelov': ['T022', 'T023', 'T035', 'T025', 'T015', 'T028', 'T039', 'T020'],
  'Rabbi Grant & Rabbi Shear': ['T011', 'T013', 'T027', 'T016', 'T018', 'T029', 'T021'],
  'Baseball glove': ['T065', 'T031', 'T050', 'T040', 'T032', 'T059', 'T043', 'T033', 'T060', 'T045', 'T046', 'T063', 'T037', 'T038', 'T048', 'T062'],
  'Soccer ball': ['T041', 'T042', 'T051', 'T044', 'T034', 'T061', 'T052', 'T053', 'T054', 'T055', 'T056', 'T057', 'T049', 'T058'],
  'No afternoon class': ['T066']
};
var CN_STAFF = { /* staff_id: [role, AM class, PM class] */
  S1001: ['head', '', ''], S1002: ['teacher', 'Rabbi Grant', 'Rabbi Grant & Rabbi Shear'], S1003: ['teacher', '', 'Mr. Heyman'],
  S1004: ['teacher', '', 'Rabbi Israelov'], S1005: ['teacher', 'Rabbi Kosman', ''], S1006: ['teacher', 'Rabbi Metzger', ''],
  S1007: ['teacher', 'Rabbi Rosenberg', ''], S1008: ['teacher', 'Morah Sackett', ''], S1009: ['teacher', 'Rabbi Swaitiyki', ''],
  S1010: ['teacher', 'Rabbi Shear', 'Rabbi Grant & Rabbi Shear']
};
function cnInvert_(m) { var o = {}; Object.keys(m).forEach(function (k) { m[k].forEach(function (id) { o[id] = k; }); }); return o; }

function cnSetupClasses() {
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  var out = [];
  try {
    var am = cnInvert_(CN_AM), pm = cnInvert_(CN_PM);
    var rs = msTab_('roster'), n = rs.getLastRow();
    if (!rs.getRange(1, 10).getValue()) rs.getRange(1, 10, 1, 3).setValues([['am_class', 'pm_class', 'crew']]).setFontWeight('bold');
    var rows = rs.getRange(2, 1, n - 1, 12).getValues();
    var noteAm = [], notePm = [], needAm = [], needPm = [], amVals = [];
    rows.forEach(function (r) {
      var id = String(r[0]), a = am[id] || '', p = pm[id] || '';
      var keepA = String(r[9] || ''), keepP = String(r[10] || '');
      amVals.push([a || keepA, p || keepP]);
      if (!id || r[7] === false || msIsTest_(id)) return;
      var note = String(r[8] || ''), ma = /AM:\s*([^·]+)/.exec(note), mp = /PM:\s*([^·]+)/.exec(note);
      if (ma && a && ma[1].trim() !== a) noteAm.push(id);
      if (mp && p && mp[1].trim() !== p) notePm.push(id);
      if (mp && !p) notePm.push(id + '(email: none)');
      if (!a && !keepA) needAm.push(id);
      if (!p && !keepP) needPm.push(id);
    });
    rs.getRange(2, 10, rows.length, 2).setValues(amVals);
    out.push('MS_Roster am_class/pm_class filled (' + rows.length + ' rows).');
    out.push('Differs from MS_Roster note, AM: ' + (noteAm.join(', ') || 'none'));
    out.push('Differs from MS_Roster note, PM: ' + (notePm.join(', ') || 'none'));
    out.push('Needs a class, AM: ' + (needAm.join(', ') || 'none'));
    out.push('Needs a class, PM: ' + (needPm.join(', ') || 'none'));
    /* rewards sheet Student Accounts column C (class) vs the emails */
    try {
      [CN.MASTER_ID].forEach(function (bid) {
        var sa = SpreadsheetApp.openById(bid).getSheetByName('Student Accounts'), v = sa.getRange(5, 1, sa.getLastRow() - 4, 3).getValues(), dif = [], missing = [];
        v.forEach(function (x) { var id = String(x[0]); if (!id) return; if (am[id] && String(x[2]).trim() !== am[id]) dif.push(id + ' (sheet: ' + x[2] + ')'); });
        Object.keys(am).forEach(function (id) { if (!v.some(function (x) { return String(x[0]) === id; })) missing.push(id); });
        out.push('Rewards Student Accounts class differs from the emails (AM): ' + (dif.join(', ') || 'none'));
        out.push('In the emails but no rewards account: ' + (missing.join(', ') || 'none'));
      });
    } catch (e) { out.push('Could not compare with the rewards sheet: ' + e.message); }
    /* staff */
    var ss = msBook_().getSheetByName('MS_Staff');
    if (!ss.getRange(1, 6).getValue()) ss.getRange(1, 6, 1, 3).setValues([['role', 'am_class', 'pm_class']]).setFontWeight('bold');
    cnStaffAll_().forEach(function (s) { var c = CN_STAFF[s.id]; if (c) ss.getRange(s.row, 6, 1, 3).setValues([c]); });
    out.push('MS_Staff role/am_class/pm_class filled.');
    if (!cnStaffAll_().some(function (s) { return s.role === 'canteen'; })) {
      var used = cnBoys_().concat(cnStaffAll_()), code, k = 0;
      do { code = String(2000 + Math.floor(Math.random() * 5000)); k++; }
      while (k < 200 && (code === '7300' || used.some(function (u) { return u.salt && msHash_(String(u.salt), code) === String(u.hash); })));
      var salt = Utilities.getUuid();
      ss.appendRow(['S1011', 'Canteen', salt, msHash_(salt, code), true, 'canteen', '', '']);
      out.push('Canteen account S1011 added. CANTEEN CODE (give to the Head of School only, never into HQ): ' + code);
    } else out.push('Canteen account already exists.');
    cnLogTab_();
  } finally { lock.releaseLock(); }
  Logger.log(out.join('\n'));
  return out.join('\n');
}
function cnLogTab_() {
  var b = msBook_(), sh = b.getSheetByName(CN.LOG);
  if (!sh) { sh = b.insertSheet(CN.LOG); sh.getRange(1, 1, 1, CN.LOG_HDR.length).setValues([CN.LOG_HDR]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}

/* ---------- daily sign-off ---------- */
function cnClassesOf_(boys, which) { var o = {}; boys.forEach(function (b) { var c = which === 'AM' ? b.am : b.pm; if (c && c !== CN.NO_PM) o[c] = 1; }); return Object.keys(o).sort(); }
function cnMyClass_(s, session) { var c = session === 'AM' ? s.am : s.pm; return c || ''; }
function cnHasAccount_() {
  var sa = cnBook_().getSheetByName('Student Accounts'), v = sa.getRange(5, 1, sa.getLastRow() - 4, 1).getValues(), o = {};
  v.forEach(function (r) { if (r[0]) o[String(r[0])] = 1; }); return o;
}
function cnLogRows_() { var sh = cnLogTab_(), n = sh.getLastRow(); return n < 2 ? [] : sh.getRange(2, 1, n - 1, CN.LOG_HDR.length).getValues(); }
/* latest log row per date|session|student */
function cnLatest_(from, to) {
  var o = {};
  cnLogRows_().forEach(function (r) {
    var d = cnYmd_(r[1]); if (!d || d < from || d > to) return;
    o[d + '|' + r[2] + '|' + r[6]] = { at: r[0], date: d, session: String(r[2]), cls: String(r[3]), staffId: String(r[4]), staff: String(r[5]), sid: String(r[6]), att: String(r[7]), ot: Number(r[8]) || 0, wk: Number(r[9]) || 0, md: Number(r[10]) || 0 };
  });
  return o;
}

function cnSignoffLoad(token, opt) {
  var s = cnStaff_(token); opt = opt || {};
  var today = cnDay_(), date = opt.date ? cnCheckYmd_(opt.date) : today;
  if (s.role !== 'head' && date !== today) date = today;
  if (date > today) throw new Error('That day has not come yet.');
  var amOnly = cnAmOnly_(date), shabbos = cnDow_(date) === 6;
  var session = opt.session === 'PM' && !amOnly ? 'PM' : 'AM';
  var boys = cnBoys_().filter(cnReal_);
  var classes = s.role === 'head' ? cnClassesOf_(boys, session) : [cnMyClass_(s, session)].filter(String);
  var mine = { AM: cnMyClass_(s, 'AM'), PM: cnMyClass_(s, 'PM') };
  if (s.role !== 'head' && !opt.session && !mine.AM && mine.PM && !amOnly) { session = 'PM'; classes = [mine.PM]; }
  var cls = opt.cls && classes.indexOf(opt.cls) >= 0 ? opt.cls : classes[0] || '';
  var list = boys.filter(function (b) { return cls && (session === 'AM' ? b.am : b.pm) === cls; }).sort(cnByName_);
  var latest = cnLatest_(date, date), signed = null, marks = {};
  list.forEach(function (b) { var x = latest[date + '|' + session + '|' + b.id]; if (x) { marks[b.id] = x; if (!signed || x.at > signed.at) signed = { at: x.at, staff: x.staff }; } });
  var acct = cnHasAccount_();
  return {
    me: { id: s.id, name: s.name, role: s.role, am: mine.AM, pm: mine.PM }, today: today, date: date, session: session, amOnly: amOnly, shabbos: shabbos,
    classes: classes, cls: cls, canEdit: s.role === 'head' || date === today,
    boys: list.map(function (b) { var m = marks[b.id]; return { id: b.id, name: b.name, rewards: !!acct[b.id], mark: m ? { att: m.att, ot: m.ot, wk: m.wk, md: m.md } : null }; }),
    signed: signed ? { at: new Date(signed.at).getTime(), staff: signed.staff } : null,
    sheet: cnIsMaster_() ? 'master' : 'test'
  };
}

function cnSignoffSave(token, req) {
  var s = cnStaff_(token); req = req || {};
  var today = cnDay_(), date = cnCheckYmd_(req.date || today);
  if (date > today) throw new Error('That day has not come yet.');
  if (s.role !== 'head' && date !== today) throw new Error('Teachers can fix today only. Ask the Head of School for older days.');
  if (cnDow_(date) === 6) throw new Error('No sign-off on Shabbos.');
  var session = req.session === 'PM' ? 'PM' : 'AM';
  if (session === 'PM' && cnAmOnly_(date)) throw new Error('No PM session on Friday or Sunday.');
  var cls = cnClean_(req.cls, 60);
  if (!cls) throw new Error('Pick a class.');
  if (s.role !== 'head' && cnMyClass_(s, session) !== cls) throw new Error('That is not your class.');
  var boys = {}; cnBoys_().forEach(function (b) { boys[b.id] = b; });
  var rows = (req.rows || []).slice(0, 80).map(function (r) {
    var id = String(r.id || ''), b = boys[id];
    if (!b || (session === 'AM' ? b.am : b.pm) !== cls) throw new Error('A boy on this list is not in ' + cls + '.');
    var att = ['P', 'L', 'A'].indexOf(r.att) >= 0 ? r.att : 'P';
    return { b: b, att: att, ot: att === 'A' ? 0 : (r.ot ? 1 : 0), wk: att === 'A' ? 0 : (r.wk ? 1 : 0), md: att === 'A' ? 0 : (r.md ? 1 : 0) };
  });
  if (!rows.length) throw new Error('No boys to sign off.');
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    var ss = cnBook_(), dp = ss.getSheetByName('Daily Points'), acct = cnHasAccount_(), btz = cnBookTz_(ss);
    var col = session === 'AM' ? 3 : 7, stamp = Utilities.formatDate(new Date(), cnTz_(), 'HH:mm');
    var v = dp.getRange(CN.FIRST, 1, CN.DP_LAST - CN.FIRST + 1, 2).getValues(), idx = {}, last = CN.FIRST - 1;
    for (var i = 0; i < v.length; i++) { if (v[i][1] !== '' && v[i][1] !== null) { last = i + CN.FIRST; var d = cnYmd_(v[i][0], btz); if (d) idx[d + '|' + String(v[i][1])] = i + CN.FIRST; } }
    var log = [], written = 0, skipped = 0, now = new Date();
    rows.forEach(function (x) {
      var action = 'new';
      if (acct[x.b.id]) {
        var row = idx[date + '|' + x.b.id];
        if (!row) {
          row = ++last;
          if (row > CN.DP_LAST) throw new Error('Daily Points is full. Tell the office.');
          dp.getRange(row, 1, 1, 2).setValues([[Utilities.parseDate(date, btz, 'yyyy-MM-dd'), x.b.id]]);
          idx[date + '|' + x.b.id] = row;
        } else {
          var before = dp.getRange(row, col, 1, 1).getValue(); if (before !== '' && before !== null) action = 'fix';
        }
        dp.getRange(row, col, 1, 4).setValues([x.att === 'A' ? ['A', '', '', ''] : [x.att, x.ot, x.wk, x.md]]);
        /* no PM session (Fri/Sun, or a boy with no afternoon class): PM mirrors AM attendance so the day totals by the sheet's own rules */
        if (session === 'AM' && (cnAmOnly_(date) || x.b.pm === CN.NO_PM)) {
          var g = dp.getRange(row, 7).getValue();
          if (g === '' || g === null || g === '-' || (g === 'A' && dp.getRange(row, 8).getValue() === '')) dp.getRange(row, 7, 1, 4).setValues([x.att === 'A' ? ['A', '', '', ''] : ['-', 0, 0, 0]]);
        }
        var pqr = dp.getRange(row, 16, 1, 3).getValues()[0];
        var note = String(pqr[2] || '').split(' | ').filter(function (t) { return t && t.indexOf('App ' + session + ':') !== 0; });
        note.push('App ' + session + ': ' + cls + ', ' + s.name + ' ' + stamp + (cnAmOnly_(date) && session === 'AM' ? ' (no PM session today)' : x.b.pm === CN.NO_PM && session === 'AM' ? ' (no afternoon class)' : ''));
        var p = String(pqr[0] || ''); if (p.indexOf('app sign-off') < 0) p = p ? p + '; app sign-off' : 'app sign-off';
        var q = String(pqr[1] || ''); if (q.indexOf(s.name) < 0) q = q ? q + '; ' + s.name : s.name;
        dp.getRange(row, 16, 1, 3).setValues([[p, q, note.join(' | ')]]);
        written++;
      } else skipped++;
      log.push([now, date, session, cls, s.id, s.name, x.b.id, x.att, x.ot, x.wk, x.md, acct[x.b.id] ? action : 'no rewards account']);
    });
    var lt = cnLogTab_(); lt.getRange(lt.getLastRow() + 1, 1, log.length, log[0].length).setValues(log);
    SpreadsheetApp.flush();
    return { ok: true, saved: rows.length, written: written, noAccount: skipped, at: now.getTime() };
  } finally { lock.releaseLock(); }
}

/* Reports: attendance, lateness and goals by boy, class, teacher and week; late 3+ this week; classes not signed off today. */
function cnReport(token, weekStart) {
  var s = cnStaff_(token), today = cnDay_();
  var ws = weekStart ? cnWeekStart_(cnCheckYmd_(weekStart)) : cnWeekStart_(today), we = cnAddDays_(ws, 6);
  var boys = cnBoys_().filter(cnReal_), byId = {}; boys.forEach(function (b) { byId[b.id] = b; });
  var mineAm = s.am, minePm = s.pm, head = s.role === 'head';
  var see = function (b) { return head || (mineAm && b.am === mineAm) || (minePm && b.pm === minePm); };
  var latest = cnLatest_(ws, we), A = {}, C = {}, T = {};
  function add(o, k, x) { var r = o[k] || (o[k] = { key: k, sessions: 0, P: 0, L: 0, A: 0, ot: 0, wk: 0, md: 0, goals: 0 }); r.sessions++; r[x.att]++; if (x.att !== 'A') { r.goals++; r.ot += x.ot; r.wk += x.wk; r.md += x.md; } }
  Object.keys(latest).forEach(function (k) {
    var x = latest[k], b = byId[x.sid]; if (!b || !see(b)) return;
    if (!head && !((x.session === 'AM' && x.cls === mineAm) || (x.session === 'PM' && x.cls === minePm))) return;
    add(A, x.sid, x); add(C, x.session + ' · ' + x.cls, x); add(T, x.staff, x);
  });
  var boysOut = Object.keys(A).map(function (id) { var r = A[id]; r.id = id; r.name = byId[id].name; r.am = byId[id].am; r.pm = byId[id].pm; r.flag = r.L >= 3; return r; }).sort(cnByName_);
  /* today */
  var todayRows = cnLatest_(today, today), status = [];
  if (cnDow_(today) !== 6) {
    (cnAmOnly_(today) ? ['AM'] : ['AM', 'PM']).forEach(function (sess) {
      cnClassesOf_(boys, sess).forEach(function (c) {
        if (!head && !((sess === 'AM' && c === mineAm) || (sess === 'PM' && c === minePm))) return;
        var who = null; Object.keys(todayRows).forEach(function (k) { var x = todayRows[k]; if (x.session === sess && x.cls === c) who = x.staff; });
        status.push({ session: sess, cls: c, signed: !!who, by: who || '' });
      });
    });
  }
  return { week: ws, weekEnd: we, today: today, boys: boysOut, classes: Object.keys(C).sort().map(function (k) { return C[k]; }), teachers: Object.keys(T).sort().map(function (k) { return T[k]; }), late3: boysOut.filter(function (r) { return r.flag; }).map(function (r) { return { id: r.id, name: r.name, late: r.L }; }), todayStatus: status, head: head };
}

/* ---------- Head of School: Classes ---------- */
function cnClasses(token) {
  var s = cnStaff_(token); cnHead_(s);
  var boys = cnBoys_().filter(cnReal_).sort(cnByName_), staff = cnStaffAll_().filter(function (x) { return x.active && x.role !== 'canteen'; });
  var am = {}, pm = {};
  Object.keys(CN_AM).forEach(function (k) { am[k] = 1; }); Object.keys(CN_PM).forEach(function (k) { pm[k] = 1; });
  boys.forEach(function (b) { if (b.am) am[b.am] = 1; if (b.pm) pm[b.pm] = 1; });
  staff.forEach(function (x) { if (x.am) am[x.am] = 1; if (x.pm) pm[x.pm] = 1; });
  return {
    boys: boys.map(function (b) { return { id: b.id, name: b.name, am: b.am, pm: b.pm }; }),
    staff: staff.map(function (x) { return { id: x.id, name: x.name, role: x.role, am: x.am, pm: x.pm }; }),
    amClasses: Object.keys(am).sort(), pmClasses: Object.keys(pm).sort(),
    needs: boys.filter(function (b) { return !b.am || !b.pm; }).map(function (b) { return { id: b.id, name: b.name, am: b.am, pm: b.pm }; })
  };
}
function cnSetBoyClass(token, sid, which, cls) {
  var s = cnStaff_(token); cnHead_(s);
  var b = cnBoys_().filter(function (x) { return x.id === String(sid); })[0]; if (!b) throw new Error('Unknown boy.');
  msTab_('roster').getRange(b.row, which === 'PM' ? 11 : 10).setValue(cnClean_(cls, 60));
  return { ok: true };
}
function cnSetStaffClass(token, staffId, which, cls) {
  var s = cnStaff_(token); cnHead_(s);
  var t = cnStaffAll_().filter(function (x) { return x.id === String(staffId); })[0]; if (!t) throw new Error('Unknown staff member.');
  msBook_().getSheetByName('MS_Staff').getRange(t.row, which === 'PM' ? 8 : 7).setValue(cnClean_(cls, 60));
  return { ok: true };
}

/* ---------- Canteen Cash (view only for the boy) ---------- */
function cnBalances_() {
  var sa = cnBook_().getSheetByName('Student Accounts'), v = sa.getRange(5, 1, sa.getLastRow() - 4, 8).getValues(), o = {};
  v.forEach(function (r) { if (r[0]) o[String(r[0])] = Math.round(Number(r[7] || 0) * 100) / 100; });
  return o;
}
function cnBalance_(sid) { var o = cnBalances_(); return Object.prototype.hasOwnProperty.call(o, sid) ? o[sid] : null; }
function cnStates_() { var o = {}; msRows_('state').forEach(function (r) { try { o[String(r[0])] = JSON.parse(r[1]); } catch (e) {} }); return o; }
function cnCrewDone_(sid, states) {
  var st = {}; if (states) st = states[sid] || {}; else { var one = msStateRow_(sid).row; if (one) { try { st = JSON.parse(one[1]); } catch (e) {} } }   /* SPEED 2: one boy = only his record */
  var sk = st.skills || {}, keys = [];
  try { if (typeof moneyRowsFor_ === 'function') keys = moneyRowsFor_(sid).map(function (r) { return r.key; }); } catch (e) {}
  return CN.CREW.filter(function (id) { return (sk[id] && sk[id].m) || keys.indexOf('ms:' + sid + ':Mastered ' + id) >= 0; });
}
function cnKidInfo(token) {
  var sess = msSession_(token);
  if (sess.role !== 'kid' || !sess.sid) return { ok: false };
  var sid = sess.sid, b = cnBoys_().filter(function (x) { return x.id === sid; })[0], done = cnCrewDone_(sid);
  var isCrew = !!b && (b.crew === 'crew' || done.length === CN.CREW.length);
  if (isCrew && b.crew !== 'crew') msTab_('roster').getRange(b.row, 12).setValue('crew');
  var open = null, menuN = 0; try { open = cnOrders_().filter(function (o) { return o.sid === sid && cnOrdOpen_(o); }).map(cnOrdOut_)[0] || null; menuN = cnMenu_(true).length; } catch (e) {}   /* v61 app orders */
  return { ok: true, cash: cnBalance_(sid), order: open, menuN: menuN, crew: { assigned: !!b && (b.crew === 'assigned' || b.crew === 'crew'), isCrew: isCrew, done: done, all: CN.CREW } };
}

/* ---------- Canteen Crew (staff assign) ---------- */
function cnCrewList(token) {
  var s = cnStaff_(token), states = cnStates_();
  return { head: s.role === 'head', boys: cnBoys_().filter(cnReal_).sort(cnByName_).map(function (b) {
    var done = (b.crew ? cnCrewDone_(b.id, states) : []);
    return { id: b.id, name: b.name, am: b.am, crew: b.crew, done: done.length, of: CN.CREW.length };
  }) };
}
function cnCrewAssign(token, sid, on) {
  cnStaff_(token);
  var b = cnBoys_().filter(function (x) { return x.id === String(sid); })[0]; if (!b) throw new Error('Unknown boy.');
  var v = on ? (b.crew === 'crew' ? 'crew' : 'assigned') : '';
  msTab_('roster').getRange(b.row, 12).setValue(v);
  return { ok: true, crew: v };
}

/* ---------- Canteen Menu (in the rewards sheet) ---------- */
function cnMenuSheet_(ss) {
  ss = ss || cnBook_(); var sh = ss.getSheetByName(CN.MENU);
  if (!sh) {
    sh = ss.insertSheet(CN.MENU);
    sh.getRange(1, 1, 1, CN.MENU_HDR.length).setValues([CN.MENU_HDR]).setFontWeight('bold'); sh.setFrozenRows(1);
    sh.getRange(2, 1, 2, 7).setValues([['M001', 'Sample: Pretzels', 0.5, '🥨', '', 10, false], ['M002', 'Sample: Water bottle', 0.75, '💧', '', 10, false]]);
  }
  return sh;
}
function cnMenu_(onlyOn, ss) {
  var sh = cnMenuSheet_(ss), n = sh.getLastRow(); if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, 7).getValues().map(function (r, i) {
    var stock = r[5] === '' || r[5] === null ? '' : Math.max(0, Math.floor(Number(r[5]) || 0));
    return { row: i + 2, id: String(r[0]), name: String(r[1]), price: Math.round(Number(r[2] || 0) * 100) / 100, emoji: String(r[3] || ''), pic: String(r[4] || ''), stock: stock, on: r[6] === true || String(r[6]).toUpperCase() === 'TRUE' };
  }).filter(function (m) { return m.id && m.name && (!onlyOn || m.on); });
}
function cnMenuAuth_(token) {
  try { var k = cnKiosk_(token); return { name: k.name, role: k.role }; } catch (e) {}
  var s = cnStaff_(token); cnHead_(s); return { name: s.name, role: s.role };
}
function cnMenuList(token) { cnMenuAuth_(token); return cnMenu_(false); }
function cnMenuSave(token, it) {
  cnMenuAuth_(token); it = it || {};
  var name = cnClean_(it.name, 40); if (!name) throw new Error('Give the item a name.');
  var price = Math.round(Number(it.price) * 100) / 100; if (!(price >= 0 && price <= 50)) throw new Error('Price must be between $0.00 and $50.00.');
  var emoji = cnClean_(it.emoji, 8), raw = String(it.pic || '').trim(), pic = '';
  if (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(raw)) { if (raw.length > 48000) throw new Error('That photo is too big. Try another one.'); pic = raw; }   /* v66: photo taken in the app, shrunk on the device */
  else { pic = cnClean_(raw, 300); if (pic && !/^https:\/\//.test(pic)) throw new Error('Picture must be an https:// link.'); }
  var stock = it.stock === '' || it.stock === null || it.stock === undefined ? '' : Math.floor(Number(it.stock));
  if (stock !== '' && !(stock >= 0 && stock <= 9999)) throw new Error('Stock must be a whole number (or blank).');
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = cnMenuSheet_(), list = cnMenu_(false), cur = list.filter(function (m) { return m.id === String(it.id || ''); })[0];
    var line = [name, price, emoji, pic, stock, !!it.on];
    if (cur) { sh.getRange(cur.row, 2, 1, 6).setValues([line]); return { ok: true, id: cur.id }; }
    var max = 0; list.forEach(function (m) { var k = Number(String(m.id).replace(/\D/g, '')); if (k > max) max = k; });
    var id = 'M' + ('00' + (max + 1)).slice(-3);
    sh.appendRow([id].concat(line)); return { ok: true, id: id };
  } finally { lock.releaseLock(); }
}

/* ---------- Canteen kiosk ---------- */
function cnKioskDoGet_(e) {
  return tlThemePage_('CanteenPage', 'canteen')
    .setTitle('Tashbar Canteen').addMetaTag('viewport', 'width=device-width, initial-scale=1').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}
function cnSoDoGet_(e) {
  return tlThemePage_('SignOffPage', 'staff')
    .setTitle('Tashbar Daily Sign-Off').addMetaTag('viewport', 'width=device-width, initial-scale=1').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}
function cnKioskSignIn(code) {
  code = String(code || '').replace(/\D/g, '').slice(0, 8);
  var cache = CacheService.getScriptCache(), tries = Number(cache.get('cn_try') || 0);
  if (tries >= 10) return { ok: false, wait: true };
  var s = code.length >= 4 ? cnStaffAll_().filter(function (x) { return x.active && msHash_(x.salt, code) === x.hash; })[0] : null;
  if (!s || (s.role !== 'canteen' && s.role !== 'head')) { cache.put('cn_try', String(tries + 1), 600); return { ok: false }; }
  var token = Utilities.getUuid();
  cache.put('cn_tok_' + token, JSON.stringify({ id: s.id, name: s.name, role: s.role }), 12 * 3600);
  return { ok: true, token: token, name: s.name, role: s.role };
}
function cnKiosk_(token) {
  if (!token || typeof token !== 'string' || token.length > 80) throw new Error('Please sign in again.');
  var raw = CacheService.getScriptCache().get('cn_tok_' + token); if (!raw) throw new Error('Please sign in again.');
  return JSON.parse(raw);
}
function cnKioskBoot(token) {
  var k = cnKiosk_(token), states = cnStates_(), boys = cnBoys_().filter(cnReal_).sort(cnByName_), bal = cnBalances_();
  var crew = boys.filter(function (b) { return b.crew === 'crew' || (b.crew === 'assigned' && cnCrewDone_(b.id, states).length === CN.CREW.length); });
  return {
    me: k, sheet: cnIsMaster_() ? 'master' : 'test', today: cnDay_(),
    menu: cnMenu_(true).map(function (m) { return { id: m.id, name: m.name, price: m.price, emoji: m.emoji, pic: m.pic, stock: m.stock }; }),
    boys: boys.filter(function (b) { return Object.prototype.hasOwnProperty.call(bal, b.id); }).map(function (b) { return { id: b.id, name: b.name, cls: b.am }; }),
    crew: crew.map(function (b) { return { id: b.id, name: b.name }; })
  };
}
function cnKioskCheckBoy(token, sid, code) {
  cnKiosk_(token);
  sid = String(sid || '').slice(0, 20); code = String(code || '').replace(/\D/g, '').slice(0, 8);
  var cache = CacheService.getScriptCache(), tk = 'cn_btry_' + sid, tries = Number(cache.get(tk) || 0);
  if (tries >= 5) return { ok: false, wait: true };
  var b = cnBoys_().filter(function (x) { return x.id === sid; })[0];
  if (!b || msHash_(b.salt, code) !== b.hash) { cache.put(tk, String(tries + 1), 600); return { ok: false, wait: tries + 1 >= 5 }; }
  cache.remove(tk);
  var ticket = Utilities.getUuid(); cache.put('cn_boy_' + ticket, sid, 300);
  return { ok: true, ticket: ticket, id: b.id, name: b.name, balance: cnBalance_(sid) };
}
function cnCpScan_(cp) {
  var v = cp.getRange(CN.FIRST, 1, CN.CP_LAST - CN.FIRST + 1, 6).getValues(), last = CN.FIRST - 1;
  for (var i = 0; i < v.length; i++) if (v[i][1] !== '' && v[i][1] !== null) last = i + CN.FIRST;
  return { v: v, last: last, tz: cnBookTz_(cp.getParent()) };
}
function cnKioskBuy(token, ticket, cart, cashier, saleId) {
  var k = cnKiosk_(token), cache = CacheService.getScriptCache();
  saleId = String(saleId || '').replace(/[^A-Za-z0-9-]/g, '').slice(0, 40);
  if (saleId.length < 8) throw new Error('Bad sale. Start again.');
  var prev = cache.get('cn_sale_' + saleId); if (prev) return JSON.parse(prev);
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    prev = cache.get('cn_sale_' + saleId); if (prev) return JSON.parse(prev);
    var ss = cnBook_(), cp = ss.getSheetByName('Canteen Purchases'), scan = cnCpScan_(cp);
    for (var i = 0; i < scan.v.length; i++) if (String(scan.v[i][5]).indexOf('Sale ' + saleId + ' ') === 0) {
      var dupSid = String(scan.v[i][1]); return { ok: true, dup: true, saleId: saleId, total: Number(scan.v[i][3]), after: cnBalance_(dupSid), items: String(scan.v[i][2]) };
    }
    var sid = cache.get('cn_boy_' + String(ticket || '').slice(0, 80)); if (!sid) throw new Error('Please type your code again.');
    var menu = {}; cnMenu_(true, ss).forEach(function (m) { menu[m.id] = m; });
    var qty = {}; (cart || []).slice(0, 30).forEach(function (c) { var id = String(c.id || ''), q = Math.floor(Number(c.qty) || 0); if (q > 0) qty[id] = (qty[id] || 0) + q; });
    var lines = [], cents = 0;
    Object.keys(qty).forEach(function (id) {
      var m = menu[id], q = Math.min(qty[id], 20); if (!m) throw new Error('An item is no longer on the menu. Start again.');
      if (m.stock !== '' && q > m.stock) throw new Error(m.name + (m.stock ? ': only ' + m.stock + ' left.' : ' is sold out.'));
      lines.push({ m: m, q: q }); cents += Math.round(m.price * 100) * q;
    });
    if (!lines.length) throw new Error('The cart is empty.');
    var cashierName = 'Staff (' + k.name + ')';
    if (cashier && cashier !== 'staff') {
      var cb = cnBoys_().filter(function (b) { return b.id === String(cashier); })[0];
      if (!cb || !(cb.crew === 'crew' || cnCrewDone_(cb.id).length === CN.CREW.length)) throw new Error('Only Canteen Crew boys can be cashier.');
      cashierName = cb.name + ' (Crew)';
    }
    SpreadsheetApp.flush();
    var before = cnBalance_(sid);
    if (before === null) throw new Error('No Canteen Cash account for this boy. Ask the office.');
    var total = cents / 100;
    if (Math.round(before * 100) < cents) return { ok: false, short: true, before: before, total: total };
    var row = scan.last + 1;
    if (row > CN.CP_LAST) throw new Error('The purchase list is full (row ' + CN.CP_LAST + '). Tell the office.');
    var itemsText = lines.map(function (l) { return l.m.name + (l.q > 1 ? ' x' + l.q : ''); }).join(', ');
    cp.getRange(row, 1, 1, 6).setValues([[cnDay_(), sid, itemsText, total, cashierName, 'Sale ' + saleId + ' · kiosk ' + k.name]]);
    var msh = cnMenuSheet_(ss);
    lines.forEach(function (l) { if (l.m.stock !== '') msh.getRange(l.m.row, 6).setValue(l.m.stock - l.q); });
    SpreadsheetApp.flush();
    var after = cnBalance_(sid);
    var res = { ok: true, saleId: saleId, total: total, before: before, after: after, items: itemsText };
    cache.put('cn_sale_' + saleId, JSON.stringify(res), 21600); cache.remove('cn_boy_' + ticket);
    return res;
  } finally { lock.releaseLock(); }
}
function cnLastSale_(scan) {
  var voided = {};
  scan.v.forEach(function (r) { var m = /^Void of Sale (\S+)/.exec(String(r[5])); if (m) voided[m[1]] = 1; });
  for (var i = scan.last - CN.FIRST; i >= 0; i--) {
    var m = /^Sale (\S+) /.exec(String(scan.v[i][5]));
    if (m && !voided[m[1]]) return { row: i + CN.FIRST, saleId: m[1], date: cnYmd_(scan.v[i][0], scan.tz), sid: String(scan.v[i][1]), items: String(scan.v[i][2]), total: Number(scan.v[i][3]), cashier: String(scan.v[i][4]) };
  }
  return null;
}
function cnKioskLastSale(token) {
  cnKiosk_(token);
  var last = cnLastSale_(cnCpScan_(cnBook_().getSheetByName('Canteen Purchases'))); if (!last) return null;
  var b = cnBoys_().filter(function (x) { return x.id === last.sid; })[0]; last.name = b ? b.name : last.sid; return last;
}
function cnKioskVoid(token, saleId, reason) {
  var k = cnKiosk_(token); reason = cnClean_(reason, 120);
  if (reason.length < 3) throw new Error('Write a reason for the void.');
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    var ss = cnBook_(), cp = ss.getSheetByName('Canteen Purchases'), scan = cnCpScan_(cp), last = cnLastSale_(scan);
    if (!last || last.saleId !== String(saleId)) throw new Error('That is not the last sale any more. Look again.');
    var row = scan.last + 1; if (row > CN.CP_LAST) throw new Error('The purchase list is full. Tell the office.');
    cp.getRange(row, 1, 1, 6).setValues([[cnDay_(), last.sid, 'VOID of ' + last.items, -last.total, k.name, 'Void of Sale ' + last.saleId + ': ' + reason]]);
    /* put the stock back */
    var msh = cnMenuSheet_(ss), menu = cnMenu_(false, ss);
    last.items.split(', ').forEach(function (t) { var m = /^(.*?)(?: x(\d+))?$/.exec(t), it = menu.filter(function (x) { return x.name === m[1]; })[0]; if (it && it.stock !== '') msh.getRange(it.row, 6).setValue(it.stock + Number(m[2] || 1)); });
    SpreadsheetApp.flush();
    return { ok: true, saleId: last.saleId, refunded: last.total, after: cnBalance_(last.sid) };
  } finally { lock.releaseLock(); }
}
function cnKioskReport(token, date) {
  cnKiosk_(token); date = date ? cnCheckYmd_(date) : cnDay_();
  var ss = cnBook_(), scan = cnCpScan_(ss.getSheetByName('Canteen Purchases')), sales = 0, total = 0, voids = 0, voidTotal = 0, items = {};
  scan.v.forEach(function (r) {
    if (cnYmd_(r[0], scan.tz) !== date) return; var f = String(r[5]);
    if (/^Sale /.test(f)) { sales++; total += Number(r[3]) || 0; String(r[2]).split(', ').forEach(function (t) { var m = /^(.*?)(?: x(\d+))?$/.exec(t); items[m[1]] = (items[m[1]] || 0) + Number(m[2] || 1); }); }
    else if (/^Void of Sale /.test(f)) { voids++; voidTotal += -(Number(r[3]) || 0); String(r[2]).replace(/^VOID of /, '').split(', ').forEach(function (t) { var m = /^(.*?)(?: x(\d+))?$/.exec(t); items[m[1]] = (items[m[1]] || 0) - Number(m[2] || 1); }); }
  });
  var menu = cnMenu_(false, ss);
  return { date: date, sales: sales, voids: voids, gross: Math.round(total * 100) / 100, voided: Math.round(voidTotal * 100) / 100, net: Math.round((total - voidTotal) * 100) / 100,
    items: Object.keys(items).filter(function (k) { return items[k]; }).map(function (k) { return { name: k, qty: items[k] }; }).sort(function (a, b) { return b.qty - a.qty; }),
    low: menu.filter(function (m) { return m.on && m.stock !== '' && m.stock <= CN.LOW; }).map(function (m) { return { name: m.name, stock: m.stock }; }) };
}

/* ---------- editor self-test (fictional, TEST COPY only) ---------- */
function cnSelfTest() {
  if (cnIsMaster_()) throw new Error('Self-test runs on the TEST COPY only. Run cnUseTestCopy first.');
  var out = [], ymd = cnDay_();
  out.push('sheet=' + cnBookId_() + ' today=' + ymd + ' dow=' + cnDow_(ymd) + ' amOnly=' + cnAmOnly_(ymd) + ' weekStart=' + cnWeekStart_(ymd));
  out.push('boys=' + cnBoys_().length + ' staff=' + cnStaffAll_().length + ' AM classes=' + cnClassesOf_(cnBoys_(), 'AM').join('/'));
  out.push('menu=' + JSON.stringify(cnMenu_(false)));
  Logger.log(out.join('\n')); return out.join('\n');
}

/* ---------- App orders (v61, 2026-11-11, Head of School: every boy may order; money comes off only at pickup) ----------
   Boy's app: sees the menu (items switched On) and his Canteen Cash, sends an order -> Pending.
   Canteen kiosk: Orders tab -> Ready -> Picked up. "Picked up" charges through cnKioskBuy (same purchase row, stock and balance check
   as a counter sale; the sale id is the order id, so a double tap never charges twice). Cancelled orders charge nothing.
   Orders live in the school database tab CN_Orders (never in the rewards sheet). */
CN.ORD = 'CN_Orders';
CN.ORD_HDR = ['order_id', 'student_id', 'name', 'items_json', 'est_total', 'status', 'created_at', 'updated_at', 'by', 'sale_id', 'note'];
function cnOrdTab_() {
  var b = msBook_(), sh = b.getSheetByName(CN.ORD);
  if (!sh) { sh = b.insertSheet(CN.ORD); sh.getRange(1, 1, 1, CN.ORD_HDR.length).setValues([CN.ORD_HDR]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function cnOrders_() {
  var sh = cnOrdTab_(), n = sh.getLastRow(); if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, CN.ORD_HDR.length).getValues().map(function (r, i) {
    var items = []; try { items = JSON.parse(r[3] || '[]'); } catch (e) {}
    return { row: i + 2, id: String(r[0]), sid: String(r[1]), name: String(r[2]), items: items, est: Number(r[4]) || 0, status: String(r[5]),
      at: r[6] ? new Date(r[6]).getTime() : 0, upd: r[7] ? new Date(r[7]).getTime() : 0, by: String(r[8] || ''), saleId: String(r[9] || ''), note: String(r[10] || '') };
  }).filter(function (o) { return o.id; });
}
function cnOrdSet_(o, status, by, saleId, note) {
  cnOrdTab_().getRange(o.row, 6, 1, 6).setValues([[status, new Date(o.at), new Date(), String(by || '').slice(0, 60), saleId || o.saleId || '', String(note || o.note || '').slice(0, 120)]]);
}
function cnOrdOut_(o) { return { id: o.id, sid: o.sid, name: o.name, items: o.items, est: o.est, status: o.status, at: o.at, upd: o.upd, by: o.by, note: o.note }; }
function cnOrdOpen_(o) { return o.status === 'pending' || o.status === 'ready'; }
function cnKidSid_(token) { var s = msSession_(token); if (s.role !== 'kid' || !s.sid) throw new Error('Sign in with your own code.'); return s.sid; }
function cnOrderMenu(token) {
  var sid = cnKidSid_(token), mine = cnOrders_().filter(function (o) { return o.sid === sid; });
  return { ok: true, cash: cnBalance_(sid),
    menu: cnMenu_(true).map(function (m) { return { id: m.id, name: m.name, price: m.price, emoji: m.emoji, pic: m.pic, out: m.stock !== '' && m.stock <= 0, left: m.stock === '' ? null : m.stock }; }),
    open: mine.filter(cnOrdOpen_).map(cnOrdOut_), recent: mine.filter(function (o) { return !cnOrdOpen_(o); }).slice(-3).reverse().map(cnOrdOut_) };
}
function cnOrderPlace(token, cart, clientId) {
  var sid = cnKidSid_(token);
  var id = 'O' + String(clientId || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 24); if (id.length < 9) throw new Error('Try again.');
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var all = cnOrders_(), dup = all.filter(function (o) { return o.id === id; })[0];
    if (dup) return { ok: true, order: cnOrdOut_(dup) };
    if (all.some(function (o) { return o.sid === sid && cnOrdOpen_(o); })) throw new Error('You already have an order waiting. Pick it up or cancel it first.');
    var cash = cnBalance_(sid); if (cash === null) throw new Error('You don’t have a Canteen Cash account yet. Ask the office.');
    var menu = {}; cnMenu_(true).forEach(function (m) { menu[m.id] = m; });
    var qty = {}; (cart || []).slice(0, 20).forEach(function (c) { var k = String(c.id || ''), q = Math.floor(Number(c.qty) || 0); if (q > 0) qty[k] = (qty[k] || 0) + q; });
    var items = [], cents = 0;
    Object.keys(qty).forEach(function (k) {
      var m = menu[k], q = Math.min(qty[k], 10); if (!m) throw new Error('Something in your order is not on the menu any more.');
      if (m.stock !== '' && q > m.stock) throw new Error(m.name + (m.stock ? ': only ' + m.stock + ' left.' : ' is sold out.'));
      items.push({ id: m.id, qty: q, name: m.name, emoji: m.emoji, price: m.price }); cents += Math.round(m.price * 100) * q;
    });
    if (!items.length) throw new Error('Your order is empty.');
    if (Math.round(cash * 100) < cents) return { ok: false, short: true, cash: cash, total: cents / 100 };
    var b = cnBoys_().filter(function (x) { return x.id === sid; })[0], now = new Date();
    cnOrdTab_().appendRow([id, sid, b ? b.name : sid, JSON.stringify(items), cents / 100, 'pending', now, now, 'app', '', '']);
    return { ok: true, order: { id: id, sid: sid, items: items, est: cents / 100, status: 'pending', at: now.getTime(), upd: now.getTime() } };
  } finally { lock.releaseLock(); }
}
function cnOrderCancel(token, orderId) {
  var sid = cnKidSid_(token), lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var o = cnOrders_().filter(function (x) { return x.id === String(orderId) && x.sid === sid; })[0];
    if (!o) throw new Error('Order not found.');
    if (o.status !== 'pending') throw new Error(o.status === 'ready' ? 'Your order is already ready. Tell the canteen if you don’t want it.' : 'This order is closed.');
    cnOrdSet_(o, 'cancelled', 'boy', '', 'Cancelled by the boy');
    return { ok: true };
  } finally { lock.releaseLock(); }
}
/* kiosk side */
function cnKioskOrders(token) {
  cnKiosk_(token); var today = cnDay_(), all = cnOrders_();
  return { open: all.filter(cnOrdOpen_).map(cnOrdOut_), done: all.filter(function (o) { return !cnOrdOpen_(o) && cnDay_(new Date(o.upd || o.at)) === today; }).slice(-12).reverse().map(cnOrdOut_) };
}
function cnKioskOrderSet(token, orderId, status, reason) {
  var k = cnKiosk_(token); if (status !== 'ready' && status !== 'cancelled' && status !== 'pending') throw new Error('Bad status.');
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var o = cnOrders_().filter(function (x) { return x.id === String(orderId); })[0]; if (!o) throw new Error('Order not found.');
    if (!cnOrdOpen_(o)) throw new Error('This order is already ' + (o.status === 'picked' ? 'picked up' : o.status) + '.');
    cnOrdSet_(o, status, k.name, '', status === 'cancelled' ? 'Cancelled at the canteen' + (reason ? ': ' + cnClean_(reason, 80) : '') : '');
    return cnKioskOrders(token);
  } finally { lock.releaseLock(); }
}
function cnKioskOrderPickup(token, orderId, cashier) {
  var k = cnKiosk_(token), o = cnOrders_().filter(function (x) { return x.id === String(orderId); })[0];
  if (!o) throw new Error('Order not found.');
  if (o.status === 'picked') return { ok: true, dup: true, orders: cnKioskOrders(token) };
  if (!cnOrdOpen_(o)) throw new Error('This order was cancelled.');
  var ticket = Utilities.getUuid(); CacheService.getScriptCache().put('cn_boy_' + ticket, o.sid, 300);
  var r = cnKioskBuy(token, ticket, o.items.map(function (i) { return { id: i.id, qty: i.qty }; }), cashier, o.id);   /* same checks and purchase row as a counter sale */
  if (!r.ok) return { ok: false, short: !!r.short, before: r.before, total: r.total, name: o.name };
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try { var o2 = cnOrders_().filter(function (x) { return x.id === o.id; })[0]; if (o2) cnOrdSet_(o2, 'picked', k.name, o.id, 'Paid ' + r.total.toFixed(2)); } finally { lock.releaseLock(); }
  return { ok: true, total: r.total, after: r.after, items: r.items, name: o.name, orders: cnKioskOrders(token) };
}
