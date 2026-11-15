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
/* SPEED 2 (Nov 15): ONE boy's saved record, without reading every boy's record (each can be 45,000 characters).
   Reads the id column, then only his row. Returns { sh, idx (0-based, -1 = none yet), row: [id, json, updated, version] }. */
function msStateRow_(sid) {
  var sh = msTab_('state'), n = sh.getLastRow(); sid = String(sid);
  if (n >= 2) { var ids = sh.getRange(2, 1, n - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === sid) return { sh: sh, idx: i, row: sh.getRange(i + 2, 1, 1, MS.TABS.state.length).getValues()[0] }; }
  return { sh: sh, idx: -1, row: null };
}
/* Creates the tabs and the made-up practice roster once. Never touches other tabs. */
function msEnsureSetup_() {
  /* SPEED 2 (Nov 15): this ran at EVERY page load and EVERY sign-in and waited in the same line as the saves.
     Once the tabs are known to exist, remember it for 6 hours and skip the wait. */
  var okCache = CacheService.getScriptCache(); try { if (okCache.get('ms_setup_ok')) return; } catch (e) {}
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
    try { okCache.put('ms_setup_ok', '1', 21600); } catch (e) {}
  } finally { lock.releaseLock(); }
}
function msRoster_() {
  return msRows_('roster').filter(function (r) { return r[0] && r[7] !== false; }).map(function (r) {
    return { id: String(r[0]), name: String(r[1]), ranges: { MATH: String(r[2]), READ: String(r[3]), WRIT: String(r[4]) }, salt: r[5], hash: r[6] };
  });
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
  return JSON.parse(raw);
}
function msCanSee_(sess, sid) { return sess.role === 'staff' || sess.sid === sid; }

/* ---- calls from the page ---- */
function msBootstrap() {
  msEnsureSetup_();
  return { version: MS.VERSION, students: msRoster_().map(function (r) { return { id: r.id, name: r.name }; }) };
}
function msSignIn(who, code) {
  who = String(who || '').slice(0, 20); code = String(code || '').replace(/\D/g, '').slice(0, 8);
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
  var stRows = msRows_; if (sess.role === 'kid') { var mine = msStateRow_(sess.sid); stRows = function () { return mine.row ? [mine.row] : []; }; }   /* SPEED 2: a boy needs only his own row */
  stRows('state').forEach(function (r) { if (msCanSee_(sess, String(r[0])) && !(sess.role === 'staff' && msIsTest_(r[0]))) { try { var s = JSON.parse(r[1]); s.rev = Number(r[3]) || 0;   /* SPEED 1: which save this is, so a Chromebook can tell if the school has anything newer than its own unsent work */ s.balance = msBalanceDollars_(String(r[0])); s.ledger = msLedger_(String(r[0])); if (sess.role === 'kid') { try { if (typeof moneyChestStatus_ === 'function') s.chest = moneyChestStatus_(String(r[0])); } catch (e) {} } states[r[0]] = s; } catch (e) {} } });
  try { if (typeof sgpMergeMarks_ === 'function') sgpMergeMarks_(states); } catch (e) {}   /* v177: rebbe bechina marks (KD_Marks, StaffViews.js) show as mastered on the boy's screen */
  return { role: sess.role, sid: sess.sid,
    roster: roster.filter(function (r) { return (msCanSee_(sess, r.id) || sess.role === 'staff') && !(sess.role === 'staff' && msIsTest_(r.id)); }).map(function (r) { var pl = null; try { if (typeof plPlanFor_ === 'function') pl = plPlanFor_(r.id, r.ranges); } catch (e) { pl = null; } return { id: r.id, name: r.name, ranges: pl ? pl.ranges : r.ranges, place: pl ? pl.place : null }; }),
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
function msSave(token, sid, state, evidenceRows, bankRows) {
  var sess = msSession_(token); sid = String(sid || '');
  if (!msCanSee_(sess, sid)) throw new Error('Not allowed.');
  if (!msRoster_().some(function (r) { return r.id === sid; })) throw new Error('Unknown student.');
  var lock = LockService.getScriptLock(), bank = null; lock.waitLock(20000);
  try {
    bank = moneyStore_(); if (bank.hold) bank.hold();   /* SPEED 2: all of this save's T$ rows go to the sheet in ONE write (below), not one write per row */
    var evIn = (evidenceRows || []).slice(0, 60);
    var pay = msCheckPay_(sess, sid, (bankRows || []).slice(0, 10), evIn, (state && state.badges) || []);
    var balance = msBalanceDollars_(sid);
    var cur = msStateRow_(sid), sh = cur.sh, idx = cur.idx;   /* SPEED 2: only his row, not every boy's record */
    var ver = idx >= 0 ? Number(cur.row[3] || 0) + 1 : 1;
    state = state || {}; state.balance = balance; state.ledger = msLedger_(sid); state.rev = ver;
    var json = JSON.stringify(state); if (json.length > 45000) throw new Error('Too much data.');
    var line = [sid, json, new Date(), ver];
    if (idx >= 0) sh.getRange(idx + 2, 1, 1, 4).setValues([line]); else sh.appendRow(line);
    /* SPEED 1: a save that is retried (Wi-Fi drop, busy server) may send an answer twice. Each answer has an id from the page;
       ids already stored are remembered for 6 hours and skipped, so the evidence tab gets every answer once. Pay was already safe (keys). */
    var seenCache = CacheService.getScriptCache(), seenKey = 'ms_evid_' + sid, seen = [];
    try { seen = JSON.parse(seenCache.get(seenKey) || '[]'); } catch (e) { seen = []; }
    var newIds = [];
    evIn = evIn.filter(function (r) {
      var id = r && r.id ? String(r.id).slice(0, 40) : ''; if (!id) return true;
      if (seen.indexOf(id) >= 0 || newIds.indexOf(id) >= 0) return false;
      newIds.push(id); return true;
    });
    var ev = evIn.map(function (r) { return [new Date(r.at || Date.now()), sid, String(r.skill || '').slice(0, 40), String(r.phase || '').slice(0, 12), String(r.item || '').slice(0, 120), r.ok ? 1 : 0, r.first ? 1 : 0, Number(r.tries) || 0, Number(r.hints) || 0, Math.round((Number(r.ms) || 0) / 1000)]; });
    if (ev.length) { var es = msTab_('evidence'); es.getRange(es.getLastRow() + 1, 1, ev.length, ev[0].length).setValues(ev); }
    if (newIds.length) { try { seenCache.put(seenKey, JSON.stringify(seen.concat(newIds).slice(-400)), 21600); } catch (e) {} }
    if (pay.paid) moneyStreak_(sid);
    balance = msBalanceDollars_(sid);
    return { ok: true, version: ver, balance: balance, ledger: msLedger_(sid), rejected: pay.rejected.length, daily: pay.daily ? 10 : 0, chest: typeof moneyChestStatus_ === 'function' ? moneyChestStatus_(sid) : null };
  } finally { try { if (bank && bank.flush) bank.flush(); } finally { lock.releaseLock(); } }
}
function msSetRange(token, sid, curr, range) {
  var sess = msSession_(token); if (sess.role !== 'staff') throw new Error('Staff only.');
  var col = { MATH: 3, READ: 4, WRIT: 5 }[curr]; if (!col || ['A','B','C','D'].indexOf(range) < 0) throw new Error('Bad range.');
  var sh = msTab_('roster'), rows = msRows_('roster');
  for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === sid) { sh.getRange(i + 2, col).setValue(range); return { ok: true }; }
  throw new Error('Unknown student.');
}
function msEvidence(token, sid) {
  var sess = msSession_(token); if (!msCanSee_(sess, sid)) throw new Error('Not allowed.');
  return msRows_('evidence').filter(function (r) { return String(r[1]) === sid; }).slice(-500).map(function (r) {
    return { at: new Date(r[0]).getTime(), student: r[1], skill: r[2], phase: r[3], item: r[4], ok: r[5] == 1, first: r[6] == 1, tries: r[7], hints: r[8], ms: Number(r[9]) * 1000 };
  });
}
function msReset(token, sid) {
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
