/* Tashbar Daily Sign-Off, Canteen Cash, Canteen kiosk and Canteen Crew (v18, 2026-11-09, by CLAUDE for the Head of School).
   MONEY RULES (Head of School, final):
   - Tashbar Bank "$" = lesson money (Money.gs). v162 (HoS 2026-11-13): a boy may buy a Canteen Card in the Tashbar Store (Store.js);
     it is written to Canteen Purchases as a credit row (minus amount, 'Store card <id>'), so the sheet's own formula adds it.
   - Canteen Cash = the rewards sheet (Student Accounts H). ONLY staff add it, ONLY through the daily sign-off below:
     3 goals a session (On time, Did his work, Middos), $0.20 each (Program Rules B6); AM+PM Mon-Thu, AM only Fri and Sun.
   - Canteen Cash goes down only through canteen purchases (one row per sale in Canteen Purchases).
   Nothing a boy does in the app adds Canteen Cash. Formulas in the rewards sheet are never written to.
   v378 (Head of School 2026-11-17, canteen overhaul): Canteen Cash is COUNTED BY CODE in the tab CN_Wallet (see "Canteen Wallet" below),
   because the Firebase database never runs the sheet's formula. Boys pay the moment they order in the app; the canteen taps Done or Still waiting.
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
    if (!b || (session === 'AM' ? b.am : b.pm) !== cls) throw new Error('A student on this list is not in ' + cls + '.');
    var att = ['P', 'L', 'A'].indexOf(r.att) >= 0 ? r.att : 'P';
    return { b: b, att: att, ot: att === 'A' ? 0 : (r.ot ? 1 : 0), wk: att === 'A' ? 0 : (r.wk ? 1 : 0), md: att === 'A' ? 0 : (r.md ? 1 : 0) };
  });
  if (!rows.length) throw new Error('No students to sign off.');
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    var ss = cnBook_(), dp = ss.getSheetByName('Daily Points'), acct = cnHasAccount_(), btz = cnBookTz_(ss);
    try { cnSheetH_(); } catch (e) {}
    rows.forEach(function (x) { if (acct[x.b.id]) cnWalOpen_(x.b.id); });   /* v378: wallets open BEFORE new sheet rows */
    var credits = [];
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
        credits.push({ sid: x.b.id, goals: x.att === 'A' ? 0 : x.ot + x.wk + x.md });
        written++;
      } else skipped++;
      log.push([now, date, session, cls, s.id, s.name, x.b.id, x.att, x.ot, x.wk, x.md, acct[x.b.id] ? action : 'no rewards account']);
    });
    /* v378 Canteen Wallet: 20 cents a goal; a fix writes only the difference */
    credits.forEach(function (c) {
      var pre = 'so:' + date + '|' + session + '|' + c.sid, have = 0, n = 0;
      cnWalRows_().forEach(function (r) { if (r.key.indexOf(pre + '#') === 0) { have += r.cents; n++; } });
      var want = c.goals * CN.GOAL_CENTS;
      if (want !== have) cnWalPost_(c.sid, want - have, 'signoff', pre + '#' + (n + 1), s.name, 'Sign-off ' + date + ' ' + session + ': ' + c.goals + ' of 3 goals' + (n ? ' (fixed)' : ''));
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
  var b = cnBoys_().filter(function (x) { return x.id === String(sid); })[0]; if (!b) throw new Error('Unknown student.');
  msTab_('roster').getRange(b.row, which === 'PM' ? 11 : 10).setValue(cnClean_(cls, 60));
  return { ok: true };
}
function cnSetStaffClass(token, staffId, which, cls) {
  var s = cnStaff_(token); cnHead_(s);
  var t = cnStaffAll_().filter(function (x) { return x.id === String(staffId); })[0]; if (!t) throw new Error('Unknown staff member.');
  msBook_().getSheetByName('MS_Staff').getRange(t.row, which === 'PM' ? 8 : 7).setValue(cnClean_(cls, 60));
  return { ok: true };
}

/* ---------- Canteen Wallet (v378, Head of School 2026-11-17 "total overhaul of the canteen money"): Canteen Cash is counted by CODE ----------
   Why: the rewards sheet's balance (Student Accounts H) is a spreadsheet formula. The Firebase school database keeps values only and never
   runs formulas, so that number froze. Now every boy's Canteen Cash = the sum of his rows in the tab CN_Wallet (school book):
   - one 'open' row = his column H balance the first time his wallet is touched (made BEFORE any new rewards-sheet row is written),
   - then one row per change: 'signoff' (3 goals x 20 cents a session, a fix writes only the difference), 'sale' and 'void' (kiosk),
     'order' (paid the moment he orders in the app) and 'refund' (cancelled order), 'card' (Canteen Card from the Tashbar Store).
   Every row has a unique key, so a double tap never charges twice. The office rows in the rewards sheet are still written as before.
   A boy whose wallet was never touched still shows his column H number. TEST- boys get $5.00 practice money and never touch the rewards sheet.
   Callers that write must hold the script lock. */
CN.WAL = 'CN_Wallet';
CN.WAL_HDR = ['at', 'student_id', 'cents', 'kind', 'key', 'by', 'note'];
CN.GOAL_CENTS = 20;
CN.TEST_START = 500;
var CN_WAL_MEMO_ = null, CN_H_MEMO_ = null;
function cnWalTab_() {
  var b = msBook_(), sh = b.getSheetByName(CN.WAL);
  if (!sh) { sh = b.insertSheet(CN.WAL); sh.getRange(1, 1, 1, CN.WAL_HDR.length).setValues([CN.WAL_HDR]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function cnWalRows_() {
  if (CN_WAL_MEMO_) return CN_WAL_MEMO_;
  var sh = cnWalTab_(), n = sh.getLastRow(), out = [];
  if (n >= 2) sh.getRange(2, 1, n - 1, CN.WAL_HDR.length).getValues().forEach(function (r) {
    if (!r[1]) return;
    out.push({ at: r[0] ? new Date(r[0]).getTime() : 0, sid: String(r[1]), cents: Math.round(Number(r[2]) || 0), kind: String(r[3] || ''), key: String(r[4] || ''), by: String(r[5] || ''), note: String(r[6] || '') });
  });
  return (CN_WAL_MEMO_ = out);
}
function cnSheetH_() {
  if (CN_H_MEMO_) return CN_H_MEMO_;
  var sa = cnBook_().getSheetByName('Student Accounts'), v = sa.getRange(5, 1, Math.max(1, sa.getLastRow() - 4), 8).getValues(), o = {};
  v.forEach(function (r) { if (r[0]) o[String(r[0])] = Math.round(Number(r[7] || 0) * 100) / 100; });
  return (CN_H_MEMO_ = o);
}
function cnTestSid_(sid) { try { return typeof msIsTest_ === 'function' && !!msIsTest_(String(sid)); } catch (e) { return false; } }
function cnBalances_() {
  var h = {}, o = {}, sum = {}, open = {};
  try { h = cnSheetH_(); } catch (e) {}
  cnWalRows_().forEach(function (r) { sum[r.sid] = (sum[r.sid] || 0) + r.cents; if (r.kind === 'open') open[r.sid] = 1; });
  Object.keys(h).forEach(function (sid) { o[sid] = open[sid] ? (sum[sid] || 0) / 100 : h[sid]; });
  Object.keys(open).forEach(function (sid) { if (!Object.prototype.hasOwnProperty.call(o, sid)) o[sid] = (sum[sid] || 0) / 100; });
  return o;
}
function cnBalance_(sid) {
  sid = String(sid || ''); var o = cnBalances_();
  if (Object.prototype.hasOwnProperty.call(o, sid)) return o[sid];
  return cnTestSid_(sid) ? CN.TEST_START / 100 : null;
}
function cnWalHas_(key) { return cnWalRows_().some(function (r) { return r.key === key; }); }
function cnWalAppend_(row) {
  cnWalTab_().appendRow(row);
  if (CN_WAL_MEMO_) CN_WAL_MEMO_.push({ at: row[0].getTime(), sid: String(row[1]), cents: Number(row[2]), kind: String(row[3]), key: String(row[4]), by: String(row[5]), note: String(row[6]) });
}
/* make the 'open' row once; false = this boy has no Canteen Cash account */
function cnWalOpen_(sid) {
  sid = String(sid || '');
  if (cnWalRows_().some(function (r) { return r.sid === sid && r.kind === 'open'; })) return true;
  var h = {}; try { h = cnSheetH_(); } catch (e) {}
  var has = Object.prototype.hasOwnProperty.call(h, sid);
  if (!has && !cnTestSid_(sid)) return false;
  cnWalAppend_([new Date(), sid, has ? Math.round(h[sid] * 100) : CN.TEST_START, 'open', 'open:' + sid, 'system',
    has ? 'Opening balance from the rewards sheet (Student Accounts H)' : 'TEST practice money']);
  return true;
}
function cnWalPost_(sid, cents, kind, key, by, note) {
  sid = String(sid || ''); cents = Math.round(Number(cents) || 0);
  if (key && cnWalHas_(key)) return { ok: true, dup: true };
  if (!cnWalOpen_(sid)) throw new Error('No Canteen Cash account for this student. Ask the office.');
  cnWalAppend_([new Date(), sid, cents, String(kind), String(key || ''), String(by || '').slice(0, 60), String(note || '').slice(0, 160)]);
  return { ok: true };
}
/* the boy's money story: his last rows, newest first */
function cnWalStory_(sid, n) {
  return cnWalRows_().filter(function (r) { return r.sid === sid; }).slice(-(n || 8)).reverse().map(function (r) {
    return { at: r.at, cents: r.cents, kind: r.kind, note: r.kind === 'open' ? (cnTestSid_(sid) ? 'Practice money to start' : 'Money you already had') : r.note };
  });
}
/* Head of School fix: a written reason, its own row (like a staff correction in the Tashbar Bank) */
function cnWalletFix(token, sid, dollars, reason) {
  var s = cnStaff_(token); cnHead_(s);
  sid = String(sid || ''); reason = cnClean_(reason, 120); if (reason.length < 3) throw new Error('Write a reason.');
  var cents = Math.round(Number(dollars) * 100); if (!cents || Math.abs(cents) > 10000) throw new Error('Amount must be between -$100 and $100, not 0.');
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try { cnWalPost_(sid, cents, 'fix', 'fix:' + sid + ':' + Date.now(), s.name, reason); return { ok: true, balance: cnBalance_(sid) }; }
  finally { lock.releaseLock(); }
}
/* a row in Canteen Purchases for the office (never for TEST boys) */
function cnCpRow_(sid, items, total, cashier, note) {
  if (cnTestSid_(sid)) return;
  var cp = cnBook_().getSheetByName('Canteen Purchases'), scan = cnCpScan_(cp), row = scan.last + 1;
  if (row > CN.CP_LAST) throw new Error('The purchase list is full.');
  cp.getRange(row, 1, 1, 6).setValues([[cnDay_(), sid, items, total, cashier, note]]);
}
function cnStockAdj_(items, sign) {
  var msh = cnMenuSheet_(), menu = {}; cnMenu_(false).forEach(function (m) { menu[m.id] = m; });
  (items || []).forEach(function (i) { var m = menu[i.id]; if (m && m.stock !== '') msh.getRange(m.row, 6).setValue(Math.max(0, m.stock + sign * i.qty)); });
}
/* the boy-facing 🎫 Level Pass note: < 1 while a Math / Reading level he is on still waits for its level check (PathfinderGate.js pfRewardRate_) */
function cnPfRate_(sid) { try { return typeof pfRewardRate_ === 'function' ? pfRewardRate_(sid) : 1; } catch (e) { return 1; } }

function cnStates_() { var o = {}; msRows_('state').forEach(function (r) { try { o[String(r[0])] = JSON.parse(r[1]); } catch (e) {} }); return o; }
function cnCrewDone_(sid, states) {
  var st = (states || cnStates_())[sid] || {}, sk = st.skills || {}, keys = [];
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
  return { ok: true, cash: cnBalance_(sid), pf: cnPfRate_(sid), order: open, menuN: menuN, crew: { assigned: !!b && (b.crew === 'assigned' || b.crew === 'crew'), isCrew: isCrew, done: done, all: CN.CREW } };
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
  var b = cnBoys_().filter(function (x) { return x.id === String(sid); })[0]; if (!b) throw new Error('Unknown student.');
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
      if (!cb || !(cb.crew === 'crew' || cnCrewDone_(cb.id).length === CN.CREW.length)) throw new Error('Only Canteen Crew students can be cashier.');
      cashierName = cb.name + ' (Crew)';
    }
    SpreadsheetApp.flush();
    var before = cnBalance_(sid);
    if (before === null) throw new Error('No Canteen Cash account for this student. Ask the office.');
    cnWalOpen_(sid);
    var total = cents / 100;
    if (Math.round(before * 100) < cents) return { ok: false, short: true, before: before, total: total };
    var row = scan.last + 1;
    if (row > CN.CP_LAST) throw new Error('The purchase list is full (row ' + CN.CP_LAST + '). Tell the office.');
    var itemsText = lines.map(function (l) { return l.m.name + (l.q > 1 ? ' x' + l.q : ''); }).join(', ');
    cp.getRange(row, 1, 1, 6).setValues([[cnDay_(), sid, itemsText, total, cashierName, 'Sale ' + saleId + ' · kiosk ' + k.name]]);
    cnWalPost_(sid, -cents, 'sale', 'sale:' + saleId, cashierName, itemsText);
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
    cnWalOpen_(last.sid);
    cp.getRange(row, 1, 1, 6).setValues([[cnDay_(), last.sid, 'VOID of ' + last.items, -last.total, k.name, 'Void of Sale ' + last.saleId + ': ' + reason]]);
    cnWalPost_(last.sid, Math.round(last.total * 100), 'void', 'void:' + last.saleId, k.name, 'Void: ' + last.items + ' (' + reason + ')');
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
    if (/^(Sale|Order) /.test(f)) { sales++; total += Number(r[3]) || 0; String(r[2]).split(', ').forEach(function (t) { var m = /^(.*?)(?: x(\d+))?$/.exec(t); items[m[1]] = (items[m[1]] || 0) + Number(m[2] || 1); }); }
    else if (/^(Void of Sale|Refund of Order) /.test(f)) { voids++; voidTotal += -(Number(r[3]) || 0); String(r[2]).replace(/^(VOID|REFUND) of /, '').split(', ').forEach(function (t) { var m = /^(.*?)(?: x(\d+))?$/.exec(t); items[m[1]] = (items[m[1]] || 0) - Number(m[2] || 1); }); }
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

/* ---------- App orders (v378, Head of School 2026-11-17: "when they buy, the money is then deducted"; the canteen taps Done or Still waiting) ----------
   Boy's app: sees his Canteen Cash and the menu. Too-expensive food is locked. Buy = the money comes off RIGHT AWAY (wallet row 'order').
   Canteen kiosk, Orders tab: ✅ Done (food handed over), ⏳ Still waiting (the boy sees the canteen is making it), ✕ Can't make it (all money back).
   The boy may cancel while it waits: all money back. Stock comes off at order time and goes back on a refund.
   Older orders from before v378 were not paid yet: Done charges them through the normal kiosk sale, as before.
   Orders live in the school database tab CN_Orders. Column sale_id = 'paid' marks an order paid when ordered. */
CN.ORD = 'CN_Orders';
CN.CANCEL_MS = 2 * 60000;   /* v379: a boy may cancel in the app only in the first 2 minutes */
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
  cnOrdTab_().getRange(o.row, 6, 1, 6).setValues([[status, new Date(o.at), new Date(), String(by || '').slice(0, 60), saleId || o.saleId || '', String(note == null ? o.note : note).slice(0, 120)]]);
}
function cnOrdCents_(o) { return (o.items || []).reduce(function (a, i) { return a + Math.round(Number(i.price) * 100) * (Number(i.qty) || 0); }, 0) || Math.round(o.est * 100); }
function cnOrdText_(o) { return (o.items || []).map(function (i) { return i.name + (i.qty > 1 ? ' x' + i.qty : ''); }).join(', '); }
function cnOrdOut_(o) { return { id: o.id, sid: o.sid, name: o.name, items: o.items, est: o.est, status: o.status, at: o.at, upd: o.upd, by: o.by, note: o.note, paid: o.saleId === 'paid', seen: /^Still waiting/.test(o.note), practice: cnTestSid_(o.sid) }; }
function cnOrdOpen_(o) { return o.status === 'pending' || o.status === 'ready'; }
function cnKidSid_(token) { var s = msSession_(token); if (s.role !== 'kid' || !s.sid) throw new Error('Sign in with your own code.'); return s.sid; }
function cnOrderMenu(token) {
  var sid = cnKidSid_(token), mine = cnOrders_().filter(function (o) { return o.sid === sid; });
  return { ok: true, cash: cnBalance_(sid), pf: cnPfRate_(sid), story: cnWalStory_(sid, 8),
    menu: cnMenu_(true).map(function (m) { return { id: m.id, name: m.name, price: m.price, emoji: m.emoji, pic: m.pic, out: m.stock !== '' && m.stock <= 0, left: m.stock === '' ? null : m.stock }; }),
    open: mine.filter(cnOrdOpen_).map(cnOrdOut_), recent: mine.filter(function (o) { return !cnOrdOpen_(o); }).slice(-3).reverse().map(cnOrdOut_) };
}
function cnOrderPlace(token, cart, clientId) {
  var sid = cnKidSid_(token);
  var id = 'O' + String(clientId || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 24); if (id.length < 9) throw new Error('Try again.');
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var all = cnOrders_(), dup = all.filter(function (o) { return o.id === id; })[0];
    if (dup) { if (dup.sid !== sid) throw new Error('Try again.'); return { ok: true, order: cnOrdOut_(dup), cash: cnBalance_(sid) }; }
    if (all.some(function (o) { return o.sid === sid && cnOrdOpen_(o); })) throw new Error('You already have food waiting. Get it at the canteen first.');
    var cash = cnBalance_(sid); if (cash === null) throw new Error('You don’t have a Canteen Cash account yet. Ask the office.');
    var menu = {}; cnMenu_(true).forEach(function (m) { menu[m.id] = m; });
    var qty = {}; (cart || []).slice(0, 20).forEach(function (c) { var k = String(c.id || ''), q = Math.floor(Number(c.qty) || 0); if (q > 0) qty[k] = (qty[k] || 0) + q; });
    var items = [], cents = 0;
    Object.keys(qty).forEach(function (k) {
      var m = menu[k], q = Math.min(qty[k], 10); if (!m) throw new Error('Something you picked is not on the menu any more.');
      if (m.stock !== '' && q > m.stock) throw new Error(m.name + (m.stock ? ': only ' + m.stock + ' left.' : ' is sold out.'));
      items.push({ id: m.id, qty: q, name: m.name, emoji: m.emoji, price: m.price }); cents += Math.round(m.price * 100) * q;
    });
    if (!items.length) throw new Error('Pick some food first.');
    var charged = cnWalHas_('ord:' + id);   /* a retry after a half-finished order: the money already came off */
    if (!charged && Math.round(cash * 100) < cents) return { ok: false, short: true, cash: cash, total: cents / 100 };
    var b = cnBoys_().filter(function (x) { return x.id === sid; })[0], now = new Date(), o = { id: id, items: items, est: cents / 100 }, text = cnOrdText_(o);
    if (!charged) {
      cnWalOpen_(sid);
      cnWalPost_(sid, -cents, 'order', 'ord:' + id, 'app', text);
      try { cnCpRow_(sid, text, cents / 100, 'App order', 'Order ' + id + ' · paid in the app'); } catch (e) {}
      if (!cnTestSid_(sid)) try { cnStockAdj_(items, -1); } catch (e) {}   /* practice orders never take real stock */
    }
    cnOrdTab_().appendRow([id, sid, b ? b.name : sid, JSON.stringify(items), cents / 100, 'pending', now, now, 'app', 'paid', '']);
    return { ok: true, before: cash, cash: cnBalance_(sid), order: { id: id, sid: sid, items: items, est: cents / 100, status: 'pending', at: now.getTime(), upd: now.getTime(), paid: true, seen: false } };
  } finally { lock.releaseLock(); }
}
/* all money back for a paid order (once) */
function cnOrdRefund_(o, by, why) {
  if (!cnWalHas_('ord:' + o.id)) return 0;
  var cents = cnOrdCents_(o);
  var r = cnWalPost_(o.sid, cents, 'refund', 'ref:' + o.id, by, 'Money back: ' + cnOrdText_(o) + (why ? ' (' + why + ')' : ''));
  if (r.dup) return 0;
  try { cnCpRow_(o.sid, 'REFUND of ' + cnOrdText_(o), -cents / 100, String(by || '').slice(0, 40), 'Refund of Order ' + o.id + (why ? ': ' + why : '')); } catch (e) {}
  if (!cnTestSid_(o.sid)) try { cnStockAdj_(o.items, 1); } catch (e) {}
  return cents;
}
function cnOrderCancel(token, orderId) {
  var sid = cnKidSid_(token), lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var o = cnOrders_().filter(function (x) { return x.id === String(orderId) && x.sid === sid; })[0];
    if (!o) throw new Error('Order not found.');
    if (!cnOrdOpen_(o)) throw new Error('This order is closed.');
    if (o.note && /^Still waiting/.test(o.note)) throw new Error('The canteen is already making it. Ask at the canteen.');
    if (o.status !== 'pending' || Date.now() - o.at > CN.CANCEL_MS) throw new Error('It is too late to cancel in the app. Ask at the canteen.');   /* v379: no cancel after the food could be in his hands */
    var back = cnOrdRefund_(o, 'boy', 'cancelled by the student');
    cnOrdSet_(o, 'cancelled', 'boy', '', 'Cancelled by the student' + (back ? ', money back' : ''));
    return { ok: true, back: back / 100, cash: cnBalance_(sid) };
  } finally { lock.releaseLock(); }
}
/* kiosk side */
function cnKioskOrders(token) {
  cnKiosk_(token); var today = cnDay_(), all = cnOrders_();
  return { open: all.filter(cnOrdOpen_).map(cnOrdOut_), done: all.filter(function (o) { return !cnOrdOpen_(o) && cnDay_(new Date(o.upd || o.at)) === today; }).slice(-15).reverse().map(cnOrdOut_) };
}
/* status: 'done' (food handed over), 'waiting' (still making it), 'cancelled' (can't make it: all money back). 'ready' and 'pending' kept for old screens. */
function cnKioskOrderSet(token, orderId, status, reason, cashier) {
  var k = cnKiosk_(token);
  if (['done', 'waiting', 'cancelled', 'ready', 'pending'].indexOf(status) < 0) throw new Error('Bad status.');
  var o = cnOrders_().filter(function (x) { return x.id === String(orderId); })[0]; if (!o) throw new Error('Order not found.');
  if (status === 'done' && o.saleId !== 'paid') return cnKioskOrderPickup(token, orderId, cashier);   /* an older, unpaid order */
  var lock = LockService.getScriptLock(), res = {}; lock.waitLock(20000);
  try {
    o = cnOrders_().filter(function (x) { return x.id === String(orderId); })[0];
    if (!cnOrdOpen_(o)) { if (status === 'done' && o.status === 'picked') res.dup = true; else throw new Error('This order is already ' + (o.status === 'picked' ? 'done' : o.status) + '.'); }
    else if (status === 'done') cnOrdSet_(o, 'picked', k.name, 'paid', 'Given by ' + k.name);
    else if (status === 'waiting' || status === 'pending') cnOrdSet_(o, 'pending', k.name, '', 'Still waiting · the canteen is making it');
    else if (status === 'ready') cnOrdSet_(o, 'ready', k.name, '', 'Ready');
    else { var why = cnClean_(reason, 80); res.back = cnOrdRefund_(o, k.name, why || 'the canteen could not make it') / 100; cnOrdSet_(o, 'cancelled', k.name, '', 'Cancelled at the canteen' + (why ? ': ' + why : '') + (res.back ? ', money back' : '')); }
  } finally { lock.releaseLock(); }
  var out = cnKioskOrders(token); out.ok = true; out.name = o.name; out.res = res; out.orders = { open: out.open, done: out.done }; return out;
}
function cnKioskOrderPickup(token, orderId, cashier) {
  var k = cnKiosk_(token), o = cnOrders_().filter(function (x) { return x.id === String(orderId); })[0];
  if (!o) throw new Error('Order not found.');
  if (o.status === 'picked') return { ok: true, dup: true, orders: cnKioskOrders(token) };
  if (!cnOrdOpen_(o)) throw new Error('This order was cancelled.');
  if (o.saleId === 'paid') { var r0 = cnKioskOrderSet(token, orderId, 'done'); return { ok: true, paidBefore: true, total: o.est, after: cnBalance_(o.sid), items: cnOrdText_(o), name: o.name, orders: r0.orders }; }
  var ticket = Utilities.getUuid(); CacheService.getScriptCache().put('cn_boy_' + ticket, o.sid, 300);
  var r = cnKioskBuy(token, ticket, o.items.map(function (i) { return { id: i.id, qty: i.qty }; }), cashier, o.id);   /* same checks and purchase row as a counter sale */
  if (!r.ok) return { ok: false, short: !!r.short, before: r.before, total: r.total, name: o.name };
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try { var o2 = cnOrders_().filter(function (x) { return x.id === o.id; })[0]; if (o2) cnOrdSet_(o2, 'picked', k.name, o.id, 'Paid ' + r.total.toFixed(2)); } finally { lock.releaseLock(); }
  return { ok: true, total: r.total, after: r.after, items: r.items, name: o.name, orders: cnKioskOrders(token) };
}
