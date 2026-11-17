/* Tashbar Learning: Middle School Week module (pilot). Made-up students only until approved.
   Adds tabs MS_Roster, MS_State, MS_Evidence, MS_Bank to the existing staging database (TL.sheet).
   Opened with the app link + ?ms=1. Skill IDs match the Tashbar Learning Blueprint. */
var MS = {
  VERSION: 'ms-1.2.0',
  TABS: {
    roster: ['student_id','name','math_range','read_range','writ_range','code_salt','code_hash','active','note'],
    state: ['student_id','state_json','updated_at','version'],
    evidence: ['timestamp','student_id','skill_id','phase','item','correct','first_try','attempts','hints','seconds'],
    bank: ['timestamp','student_id','amount','reason']   /* LEGACY tab, no longer written: T$ lives in the one ledger (Money.gs) */
  },
  PRACTICE: [
    ['TMS-101','Ari','A','A','A','2411'],['TMS-102','Baruch','B','A','A','3527'],['TMS-103','Chaim','B','B','B','4613'],['TMS-104','Dovid','C','B','B','5739'],
    ['TMS-105','Eli','C','C','C','6845'],['TMS-106','Feivel','C','C','B','7951'],['TMS-107','Gershon','D','C','C','8162'],['TMS-108','Hillel','D','D','D','9273']
  ],
  STAFF_PRACTICE_CODE: '7300',
  TOKEN_HOURS: 6
};

function msDoGet_(e) {
  var page = e && e.parameter && e.parameter.staff === '1' ? 'MiddleSchoolPage' : 'QuestPage';
  return HtmlService.createHtmlOutput(tlSound_(tlTheme_(HtmlService.createHtmlOutputFromFile(page).getContent(), page === 'QuestPage' ? 'boy' : 'staff')))
    .setTitle('Tashbar Learning · Middle School')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

function msBook_() { return SpreadsheetApp.openById(TL.sheet); }
function msTab_(name) {
  var ss = msBook_(), full = 'MS_' + name.charAt(0).toUpperCase() + name.slice(1);
  var sh = ss.getSheetByName(full);
  if (!sh) { sh = ss.insertSheet(full); sh.getRange(1, 1, 1, MS.TABS[name].length).setValues([MS.TABS[name]]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function msHash_(salt, code) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + '|' + String(code), Utilities.Charset.UTF_8);
  return raw.map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
}
function msRows_(name) {
  var sh = msTab_(name), n = sh.getLastRow();
  if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, MS.TABS[name].length).getValues();
}
/* Creates the tabs and the made-up practice roster once. Never touches other tabs. */
function msEnsureSetup_() {
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = msTab_('roster');
    if (sh.getLastRow() < 2) {
      var rows = MS.PRACTICE.map(function (p) { var salt = Utilities.getUuid(); return [p[0], p[1], p[2], p[3], p[4], salt, msHash_(salt, p[5]), true, 'made-up practice student']; });
      sh.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
    }
    msTab_('state'); msTab_('evidence');
    var props = PropertiesService.getScriptProperties();
    if (!props.getProperty('MS_STAFF_HASH')) { var s = Utilities.getUuid(); props.setProperty('MS_STAFF_SALT', s); props.setProperty('MS_STAFF_HASH', msHash_(s, MS.STAFF_PRACTICE_CODE)); }
  } finally { lock.releaseLock(); }
}
/* v214 speed (developer2@): with hundreds of boys, MS_State holds hundreds of large JSON states. A save or a boy's sign-in needs one row,
   so read only the id column to find it, then only that row. Staff screens still read the whole tab (msRows_). Returns -1 / [] if not found.
   If an id appears twice, the FIRST row is used, the same row msSave has always written. */
function msStateIdx_(sh, sid) {
  var n = sh.getLastRow(); if (n < 2) return -1;
  var ids = sh.getRange(2, 1, n - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === sid) return i;
  return -1;
}
function msStateRowOf_(sid) {
  var sh = msTab_('state'), i = msStateIdx_(sh, sid);
  return i < 0 ? [] : sh.getRange(i + 2, 1, 1, MS.TABS.state.length).getValues();
}
function msRoster_() {
  return msRows_('roster').filter(function (r) { return r[0] && r[7] !== false; }).map(function (r) {
    return { id: String(r[0]), name: String(r[1]), ranges: { MATH: String(r[2]), READ: String(r[3]), WRIT: String(r[4]) }, salt: r[5], hash: r[6] };
  }).filter(function (r) { return !TL_SCOPE_ || !!TL_SCOPE_[r.id]; });   /* Access.js: a signed-in person lists only the students he may see */
}
/* Test student (Head of School, 2026-11-08): one clearly marked test boy, TEST-01, for playing lessons start to finish.
   IDs that start with TEST- are left out of the staff dashboard. Run msAddTestStudent once in the editor; it prints the code. */
function msIsTest_(id) { return /^TEST-/.test(String(id || '')); }
function msAddTestStudent() {
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var rows = msRows_('roster');
    if (rows.some(function (r) { return String(r[0]) === 'TEST-01'; })) { Logger.log('TEST-01 already exists. Its code is in the HQ LOG.'); return 'exists'; }
    var code, n = 0;
    do { code = String(7000 + Math.floor(Math.random() * 2000)); n++; }
    while (n < 50 && (code === '7300' || msStaffMatch_(code) || rows.some(function (r) { return r[5] && msHash_(r[5], code) === r[6]; })));
    var salt = Utilities.getUuid();
    msTab_('roster').appendRow(['TEST-01', 'Test Boy (TEST)', 'A', 'A', 'A', salt, msHash_(salt, code), true, 'TEST - not a real student. Hidden from staff reports.']);
    Logger.log('Test student TEST-01 code: ' + code); return code;
  } finally { lock.releaseLock(); }
}
function msSession_(token) {
  if (!token || typeof token !== 'string' || token.length > 80) throw new Error('Please sign in again.');
  var raw = CacheService.getScriptCache().get('ms_tok_' + token);
  if (!raw) throw new Error('Please sign in again.');
  var s = JSON.parse(raw);
  if (typeof tlApplyScope_ === 'function') tlApplyScope_(token, s);   /* Access.js: who this session may see */
  return s;
}
function msCanSee_(sess, sid) { return (sess.role === 'staff' && (!TL_SCOPE_ || !!TL_SCOPE_[String(sid)])) || sess.sid === sid; }   /* Access.js scope */

/* ---- calls from the page ---- */
function msBootstrap() {
  msEnsureSetup_();
  return { version: MS.VERSION, students: msRoster_().map(function (r) { return { id: r.id, name: r.name }; }) };
}
function msSignIn(who, code) {
  who = String(who || '').slice(0, 20); code = String(code || '').replace(/\D/g, '').slice(0, 8);
  TL_SCOPE_ = null; TL_SCOPE_INFO_ = null;
  var cache = CacheService.getScriptCache(), tk = 'ms_try_' + who, tries = Number(cache.get(tk) || 0);
  if (tries >= 5) return { ok: false, wait: true };
  var ok = false, sid = null, role = 'kid', staffInfo = null;
  if (who === 'staff') {
    var p = PropertiesService.getScriptProperties();
    ok = !!msStaffMatch_(code); role = 'staff'; staffInfo = ok && typeof cnStaffInfo_ === 'function' ? cnStaffInfo_(code) : null;
  } else {
    var r = msRoster_().filter(function (x) { return x.id === who; })[0];
    ok = !!r && msHash_(r.salt, code) === r.hash; sid = r ? r.id : null;
  }
  if (!ok) { cache.put(tk, String(tries + 1), 600); return { ok: false, wait: tries + 1 >= 5 }; }
  cache.remove(tk);
  var token = Utilities.getUuid();
  cache.put('ms_tok_' + token, JSON.stringify({ role: role, sid: sid, staff: staffInfo, who: role === 'staff' && typeof sgStaffRow_ === 'function' ? sgStaffRow_(code) : null }), MS.TOKEN_HOURS * 3600);
  return { ok: true, token: token, role: role, sid: sid };
}
function msLoad(token) {
  var sess = msSession_(token);
  var roster = msRoster_(), states = {};
  if (sess.role === 'kid') {   /* v67 speed: the weekly interest check needs the school-wide lock only once per boy per week (then remembered), not at every sign-in */
    var ic = CacheService.getScriptCache(), ik = 'msint_' + sess.sid + '_' + moneyWeekStart_(moneyDay_());
    if (!ic.get(ik)) { var lk = LockService.getScriptLock(); lk.waitLock(20000); try { moneyInterest_(sess.sid); } finally { lk.releaseLock(); } try { ic.put(ik, '1', 21600); } catch (e) {} }
  }
  var stRows = sess.role === 'kid' ? msStateRowOf_(String(sess.sid)) : msRows_('state');   /* v214 speed: a boy reads only his own row */
  stRows.forEach(function (r) { if (msCanSee_(sess, String(r[0])) && !(sess.role === 'staff' && msIsTest_(r[0]))) { try { var s = JSON.parse(r[1]); s.balance = msBalanceDollars_(String(r[0])); s.ledger = msLedger_(String(r[0])); if (sess.role === 'kid') { try { if (typeof moneyChestStatus_ === 'function') s.chest = moneyChestStatus_(String(r[0])); } catch (e) {} } states[r[0]] = s; } catch (e) {} } });
  try { if (typeof sgpMergeMarks_ === 'function') sgpMergeMarks_(states); } catch (e) {}   /* v177: rebbe bechina marks (KD_Marks, StaffViews.js) show as mastered on the boy's screen */
  return { role: sess.role, sid: sess.sid,
    roster: roster.filter(function (r) { return (msCanSee_(sess, r.id) || sess.role === 'staff') && !(sess.role === 'staff' && msIsTest_(r.id)); }).map(function (r) { var pl = null; try { if (typeof plPlanFor_ === 'function') pl = plPlanFor_(r.id, r.ranges); } catch (e) { pl = null; } var o = { id: r.id, name: r.name, ranges: pl ? pl.ranges : r.ranges, place: pl ? pl.place : null }; try { if (sess.role === 'kid' && r.id === sess.sid && typeof pfdForLoad_ === 'function') { var pd = pfdForLoad_(r.id, states[r.id]); if (pd) o.pfd = pd; } } catch (e) {} return o; }),   /* PF stage D (PathfinderDaily.js): his daily path; TEST boys only, real boys get no new field */
    states: states };
}
/* T$ is checked here, not trusted from the browser. Pay goes into the ONE T$ ledger (Money.gs) in integer cents;
   the server sets every amount from the rules table. Each pay row must match a rule and the answers sent with it. */
var MS_PAY_RULE = { mastered: 'msSkillMastered', first: 'msSkillFirstTry', week3: 'msWeek3', boss: 'levelUp', revise: 'resubmitted', signoff: 'teacherDone', reviseMax: 3, okPerSkill: 40 };
/* v5 badges (Nov 8): name sent by the page -> [badge key in saved state, T$ rule]. Paid once per student per badge. */
var MS_BADGE_PAY = { 'Perfect Lesson': ['sharp', 'msBadge50'], 'Never Quit': ['comeback', 'msBadge50'], 'Published Writer': ['ink', 'msBadge50'], 'All 4 Subjects': ['explorer', 'msBadge50'], '$1,000 Club': ['saver', 'msBadge100'], 'Master Builder': ['builder', 'msBadge200'] };
function msBalanceDollars_(sid) { return moneyBalance_(sid) / 100; }
function msLedger_(sid) { return moneySummary_(sid).statement.slice(0, 40).map(function (r) { return { at: new Date(r.at).getTime(), amt: r.cents / 100, why: r.reason }; }); }
function msCheckPay_(sess, sid, bankIn, evIn, badges) {
  var prefix = 'ms:' + sid + ':', mine = moneyRowsFor_(sid).filter(function (r) { return r.key.indexOf(prefix) === 0; });
  var taken = mine.map(function (r) { return r.key.slice(prefix.length).replace(/#\d+$/, ''); });
  var out = [], rejected = [], paid = false;
  function has(why) { return taken.indexOf(why) >= 0; }
  function count(re) { return taken.filter(function (w) { return re.test(w); }).length; }
  function checksOk(id) { return (evIn || []).filter(function (r) { return String(r.skill) === id && r.phase === 'check' && r.ok; }).length; }
  function bossOk() { return (evIn || []).filter(function (r) { return r.phase === 'boss' && r.ok; }).length; }
  function post(rule, key, why, skill) {
    var row = moneyEarn_(sid, rule, prefix + key, skill || '', '', why);
    taken.push(key.replace(/#\d+$/, '')); if (row) { paid = true; out.push({ at: row.at, amt: row.cents / 100, why: why }); }
  }
  /* every right answer earns money; first try earns a little more (hints are free). Capped per skill. */
  (evIn || []).forEach(function (r) {
    if (!r || !r.ok) return;
    if (/^TCH\./.test(String(r.skill || ''))) return;   /* v128: teacher-made lessons never pay (CLAUDE.md money rule) */
    var skill = String(r.skill || '').slice(0, 40), item = String(r.phase || '').slice(0, 12) + '|' + String(r.item || '').slice(0, 120);
    if (!skill || count(new RegExp('^ok:' + skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\|')) >= MS_PAY_RULE.okPerSkill) return;
    if (has('ok:' + skill + '|' + item)) return;
    post('correct', 'ok:' + skill + '|' + item, 'Correct answer · ' + skill, skill);
    if (r.first) post('firstTry', 'first:' + skill + '|' + item, 'Right on the first try · ' + skill, skill);
  });
  bankIn.slice().reverse().forEach(function (b) {
    var why = String(b.why || '').slice(0, 120), m, rule = '', key = why;
    if (/^(Mastered|First-try bonus:|Revision:) TCH\./.test(why)) { rejected.push(why); return; }   /* v128: teacher-made lessons never pay */
    if ((m = /^Mastered (\S+)$/.exec(why))) { if (!has(why) && checksOk(m[1]) >= 3) rule = MS_PAY_RULE.mastered; }
    else if ((m = /^First-try bonus: (\S+)$/.exec(why))) { if (!has(why) && has('Mastered ' + m[1])) rule = MS_PAY_RULE.first; }
    else if (why === '3 skills this week') { if (!has(why) && count(/^Mastered /) >= 3) rule = MS_PAY_RULE.week3; }
    else if (/^Boss challenge: (Math|Reading|Writing)$/.test(why)) { if (!has(why) && bossOk() >= 7) rule = MS_PAY_RULE.boss; }
    else if ((m = /^Revision: (\S+)$/.exec(why))) { var n = count(new RegExp('^Revision: ' + m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$')); if (n < MS_PAY_RULE.reviseMax) { rule = MS_PAY_RULE.revise; key = why + '#' + n; } }
    else if (/^Hands-on sign-off: (\S+)$/.test(why)) { if (!has(why) && sess.role === 'staff') rule = MS_PAY_RULE.signoff; }
    else if ((m = /^Badge: (.+)$/.exec(why)) && Object.prototype.hasOwnProperty.call(MS_BADGE_PAY, m[1])) { if (!has(why) && Array.isArray(badges) && badges.indexOf(MS_BADGE_PAY[m[1]][0]) >= 0) rule = MS_BADGE_PAY[m[1]][1]; m = null; }
    if (rule) post(rule, key, why, m && m[1]); else rejected.push(why);
  });
  var daily = moneyDailyGoal_(sid);
  if (daily) { paid = true; out.push({ at: daily.at, amt: daily.cents / 100, why: daily.reason }); }
  var chest = typeof moneyWeeklyChest_ === 'function' ? moneyWeeklyChest_(sid) : null;   /* v151: weekly treasure chest (HoS 2026-11-13) */
  if (chest) { paid = true; out.push({ at: chest.at, amt: chest.cents / 100, why: chest.reason }); }
  return { ok: out, rejected: rejected, paid: paid, daily: !!daily };
}
function msSave(token, sid, state, evidenceRows, bankRows) { tlGuard_(token, sid);
  var sess = msSession_(token); sid = String(sid || '');
  if (!msCanSee_(sess, sid)) throw new Error('Not allowed.');
  if (!msRoster_().some(function (r) { return r.id === sid; })) throw new Error('Unknown student.');
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var evIn = (evidenceRows || []).slice(0, 60);
    var pay = msCheckPay_(sess, sid, (bankRows || []).slice(0, 10), evIn, (state && state.badges) || []);
    var balance = msBalanceDollars_(sid);
    state = state || {}; state.balance = balance; state.ledger = msLedger_(sid);
    var json = JSON.stringify(state); if (json.length > 45000) throw new Error('Too much data.');
    var sh = msTab_('state'), idx = msStateIdx_(sh, sid);   /* v214 speed: read the id column, not every boy's state */
    var ver = idx >= 0 ? Number(sh.getRange(idx + 2, 4).getValue() || 0) + 1 : 1;
    var line = [sid, json, new Date(), ver];
    if (idx >= 0) sh.getRange(idx + 2, 1, 1, 4).setValues([line]); else sh.appendRow(line);
    var ev = evIn.map(function (r) { return [new Date(r.at || Date.now()), sid, String(r.skill || '').slice(0, 40), String(r.phase || '').slice(0, 12), String(r.item || '').slice(0, 120), r.ok ? 1 : 0, r.first ? 1 : 0, Number(r.tries) || 0, Number(r.hints) || 0, Math.round((Number(r.ms) || 0) / 1000)]; });
    if (ev.length) { var es = msTab_('evidence'); es.getRange(es.getLastRow() + 1, 1, ev.length, ev[0].length).setValues(ev); }
    if (pay.paid) moneyStreak_(sid);
    balance = msBalanceDollars_(sid);
    var out = { ok: true, version: ver, balance: balance, ledger: msLedger_(sid), rejected: pay.rejected.length, daily: pay.daily ? 10 : 0, chest: typeof moneyChestStatus_ === 'function' ? moneyChestStatus_(sid) : null };
    try { if (typeof pf72HdAfterSave_ === 'function') pf72HdAfterSave_(sid, evIn); } catch (e) {}   /* PF v7.2 rule HD (PathfinderPlaceHD.js): TEST boys only, returns at once for real boys, adds nothing to out */
    try { if (typeof pfdAfterSave_ === 'function') { var pd = pfdAfterSave_(sid, evIn, state); if (pd) out.pfd = pd; } } catch (e) {}   /* PF stage D: quick climb + today's path; TEST boys only (no money: pay above is untouched) */
    return out;
  } finally { lock.releaseLock(); }
}
function msSetRange(token, sid, curr, range) { tlGuard_(token, sid);
  var sess = msSession_(token); if (sess.role !== 'staff') throw new Error('Staff only.');
  var col = { MATH: 3, READ: 4, WRIT: 5 }[curr]; if (!col || ['A','B','C','D'].indexOf(range) < 0) throw new Error('Bad range.');
  var sh = msTab_('roster'), rows = msRows_('roster');
  for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === sid) { sh.getRange(i + 2, col).setValue(range); return { ok: true }; }
  throw new Error('Unknown student.');
}
function msEvidence(token, sid) { tlGuard_(token, sid);
  var sess = msSession_(token); if (!msCanSee_(sess, sid)) throw new Error('Not allowed.');
  return msRows_('evidence').filter(function (r) { return String(r[1]) === sid; }).slice(-500).map(function (r) {
    return { at: new Date(r[0]).getTime(), student: r[1], skill: r[2], phase: r[3], item: r[4], ok: r[5] == 1, first: r[6] == 1, tries: r[7], hints: r[8], ms: Number(r[9]) * 1000 };
  });
}
function msReset(token, sid) { tlGuard_(token, sid);
  var sess = msSession_(token); if (sess.role !== 'staff') throw new Error('Staff only.');
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    if (/^TMS-/.test(sid)) moneyStore_().remove(function (r) { return r.sid === sid && r.key.indexOf('ms:' + sid + ':') === 0; });   /* made-up practice boys only */
    ['state', 'evidence'].forEach(function (t) {
      var col = t === 'state' ? 0 : 1, sh = msTab_(t), rows = msRows_(t);
      for (var i = rows.length - 1; i >= 0; i--) if (String(rows[i][col]) === sid) sh.deleteRow(i + 2);
    });
    return { ok: true };
  } finally { lock.releaseLock(); }
}
