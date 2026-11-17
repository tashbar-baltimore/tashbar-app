/* Tashbar Dollars (T$): ONE ledger for the whole app, amounts in integer cents.
   Source of rules: HQ "05 MONEY_SYSTEM v001" (Head of School decision, 2026-11-06).
   - Replaces app "points" and the separate MS_Bank. Balance = sum of ledger rows, never typed by hand.
   - Money is NEVER taken away for wrong answers. Hints are FREE.
   - Each event pays once (idempotent key: student + lesson/assignment + item + event).
   - Staff bonus or correction needs a written reason (it is its own ledger row and an Audit row).
   - v162 (Head of School 2026-11-13): dollars are SPENT only in the Tashbar Store (Store.js): fun upgrades, real prizes, tzedakah back to Tashbar,
     gifts to a friend, and Canteen Cards (Tashbar $ -> Canteen Cash at STORE.CANTEEN_RATE, capped weekly). Spending rows are negative ledger rows. */
var MONEY = {
  VERSION: 'money-1.0.0',
  TAB: 'TL Money',
  HEAD: ['TxnID', 'timestamp', 'studentID', 'type', 'amount_cents', 'reason', 'lessonID', 'itemID', 'by', 'key'],
  TYPES: ['earn', 'bonus', 'interest', 'correction'],
  /* ONE settings table. Integer cents. Head of School may change any number here. */
  RULES: {
    /* Head of School 2026-11-08: a full day of work earns about $100 (LOG 2026-11-08_1145 DECISION). */
    correct:         { cents: 100,  label: 'Correct answer' },
    firstTry:        { cents: 50,   label: 'Correct on first try (extra)' },
    lessonFinished:  { cents: 1000, label: 'Lesson finished (sent to teacher)' },
    resubmitted:     { cents: 500,  label: 'Fixed work after teacher feedback' },
    teacherDone:     { cents: 1000, label: 'Teacher marked the lesson Done' },
    levelUp:         { cents: 2500, label: 'Level up in a topic' },
    streak3:         { cents: 1000, label: 'Worked 3 school days in a row' },
    streak5:         { cents: 2500, label: 'Worked 5 school days in a row' },
    dailyGoal:       { cents: 1000, label: '3 lessons in one day' },
    /* Head of School 2026-11-13 ("you decide on the amount"): the weekly treasure chest = daily goal reached on 4 days of one week (Sun-Fri). Builder set $50 (half a ~$100 full day). */
    weeklyChest:     { cents: 5000, label: 'Treasure chest: daily goal on 4 days this week' },
    msSkillMastered: { cents: 1000, label: 'Skill mastered' },
    msSkillFirstTry: { cents: 500,  label: 'Skill mastered with no misses' },
    msWeek3:         { cents: 1500, label: '3 skills this week' },
    msBadge50:       { cents: 500,  label: 'Badge earned' },
    msBadge100:      { cents: 1000, label: 'Badge earned' },
    msBadge200:      { cents: 2000, label: 'Badge earned' },
    /* Head of School 2026-11-11 (chat 20:45, "use your judgment"): monthly prizes, paid once by the Head of School's "Award prizes" button (Family.js sgAwardPrizes). */
    monthImproved1:  { cents: 10000, label: 'Most improved this month: 1st place' },
    monthImproved2:  { cents: 7500,  label: 'Most improved this month: 2nd place' },
    monthImproved3:  { cents: 5000,  label: 'Most improved this month: 3rd place' },
    monthSchoolGoal: { cents: 2500,  label: 'School goal reached this month' }
  },
  INTEREST: { percent: 2, capCents: 2000 },          /* every Sunday, on the balance before that Sunday */
  CANTEEN_RATE: null,                               /* v162: the real rate is STORE.CANTEEN_RATE in Store.js (Canteen Cards). */
  SINCE: '2026-11-06',                              /* no interest or streak pay for days before this */
  REVISION_MAX: 3,
  GOAL_MAX_CENTS: 10000000
};

/* PATHFINDER pay (Phase 2). Head of School approved the amounts in 07 PATHFINDER BUILD PROMPT v3 (DECISION LOG 2026-11-11_0420).
   D = Tashbar dollars for a normal full lesson day (about $100, LOG 2026-11-08_1145). Unit U = max(1, round(D / 70)) dollars.
   Effort only: a real try pays, a right answer as such pays nothing; rapid guesses pay 0. Read by Pathfinder.gs; change amounts only here. */
/* v107 HoS DECISION 1550 (option B, PF-PAY1): the Pathfinder effort bonus is paid on EVERY real try (not rapid, not "I don't know"),
   at EDGE_ALL = 55% of EDGE, the old average edge share, so an average section pays what it paid before; fair across levels. */
var PF_PAY = (function () {
  var D = 100, U = Math.max(1, Math.round(D / 70)), c = U * 100;
  return { VERSION: 'pfpay-1.0', D: D, U: U, TRY: 2 * c, DKN: 1 * c, EDGE: 1 * c, EDGE_ALL: Math.round(0.55 * c), JAR: 15 * c, FINISH: 15 * c, EDGE_LO: 0.35, EDGE_HI: 0.65 };
})();

var MONEY_STORE_ = null;   /* tests replace this with an in-memory store */
var MONEY_LIVE_ = null;

function moneyStore_() {
  if (MONEY_STORE_) return MONEY_STORE_;
  if (MONEY_LIVE_) return MONEY_LIVE_;
  var ss = SpreadsheetApp.openById(TL.sheet), sh = ss.getSheetByName(MONEY.TAB), H = MONEY.HEAD;
  if (!sh) { sh = ss.insertSheet(MONEY.TAB); sh.getRange(1, 1, 1, H.length).setValues([H]).setFontWeight('bold'); sh.setFrozenRows(1); }
  var cache = null;
  function toObj(r) {
    return { id: String(r[0]), at: r[1] instanceof Date ? r[1].toISOString() : String(r[1]), sid: String(r[2]), type: String(r[3]),
      cents: Number(r[4]) || 0, reason: String(r[5]), lessonId: String(r[6] || ''), itemId: String(r[7] || ''), by: String(r[8] || ''), key: String(r[9] || '') };
  }
  /* v231 SPEED (developer2@, HoS 2026-11-15 "decide the best case"): one boy's rows without reading the whole ledger.
     The ledger only grows at the bottom (append) and shrinks only in remove(). So a boy's rows up to sheet row U never change.
     rowsFor(sid) keeps "his rows up to row U" in the script cache (sheet-derived only), then reads ONLY rows U+1..last and keeps his.
     remove() bumps MONEY_GEN in Script Properties, which retires every cached copy. Cache missing or gone: one full read, exactly as before.
     Same rows, same order as rows().filter(sid). Pay rules unchanged. */
  var per = {}, CG = null, PRE = null;
  function gen() { if (PRE === null) { try { PRE = 'tlm' + (PropertiesService.getScriptProperties().getProperty('MONEY_GEN') || '0') + ':'; } catch (e) { PRE = 'tlm0:'; } } return PRE; }
  function cc() { if (!CG) { try { CG = CacheService.getScriptCache(); } catch (e) { CG = false; } } return CG; }
  function pack(r) { return [r.id, r.at, r.type, r.cents, r.reason, r.lessonId, r.itemId, r.by, r.key]; }
  function unpack(a, sid) { return { id: a[0], at: a[1], sid: sid, type: a[2], cents: a[3], reason: a[4], lessonId: a[5], itemId: a[6], by: a[7], key: a[8] }; }
  function cget(sid) { var c = cc(); if (!c) return null; try { var k = gen() + sid, h = c.get(k); if (!h) return null; h = JSON.parse(h); var keys = [];
      for (var i = 0; i < h.n; i++) keys.push(k + '#' + i); var got = h.n ? c.getAll(keys) : {}, txt = ''; for (var j = 0; j < h.n; j++) { if (got[keys[j]] == null) return null; txt += got[keys[j]]; }
      return { upto: h.upto, rows: JSON.parse(txt || '[]').map(function (a) { return unpack(a, sid); }) }; } catch (e) { return null; } }
  function cput(sid, upto, rows) { var c = cc(); if (!c) return; try { var k = gen() + sid, txt = JSON.stringify(rows.map(pack)), CH = 90000, o = {}, n = 0;
      for (var i = 0; i < txt.length; i += CH) { o[k + '#' + n] = txt.slice(i, i + CH); n++; } if (n > 60) return; o[k] = JSON.stringify({ upto: upto, n: n }); c.putAll(o, 21600); } catch (e) {} }
  MONEY_LIVE_ = {
    rows: function () { if (cache) return cache; var n = sh.getLastRow(); cache = n < 2 ? [] : sh.getRange(2, 1, n - 1, H.length).getValues().filter(function (r) { return r[0]; }).map(toObj); return cache; },
    rowsFor: function (sid) {
      sid = String(sid);
      if (cache) return cache.filter(function (r) { return r.sid === sid; });
      var n = sh.getLastRow(), m = per[sid];
      if (m && m.upto === n) return m.rows.slice();
      var hit = m || cget(sid);
      if (!hit || hit.upto > n) { var all = this.rows(), mine = all.filter(function (r) { return r.sid === sid; }); per[sid] = { upto: n, rows: mine }; cput(sid, n, mine); return mine.slice(); }
      var add = hit.upto < n ? sh.getRange(hit.upto + 1, 1, n - hit.upto, H.length).getValues().filter(function (r) { return r[0] && String(r[2]) === sid; }).map(toObj) : [];
      var rows = add.length ? hit.rows.concat(add) : hit.rows; per[sid] = { upto: n, rows: rows, mem: !!(m && m.mem) }; if ((add.length || !m) && !(m && m.mem)) cput(sid, n, rows); return rows.slice();
    },
    /* v242 SPEED (developer2@): every boy's balance for the staff bank list. A running total per boy up to sheet row U is kept in the
       script cache (one small entry); only rows U+1..last are read and added. Same totals as summing rows(); remove() retires it (MONEY_GEN). */
    balances: function () {
      var b = {}, add = function (rs) { rs.forEach(function (r) { b[r.sid] = (b[r.sid] || 0) + r.cents; }); };
      if (cache) { add(cache); return b; }
      var n = sh.getLastRow(), c = cc(), k = gen() + '#tot', t = null;
      try { t = c ? JSON.parse(c.get(k) || 'null') : null; } catch (e) { t = null; }
      if (!t || !(t.upto <= n) || typeof t.b !== 'object') { add(this.rows()); }
      else { b = t.b; if (t.upto < n) add(sh.getRange(t.upto + 1, 1, n - t.upto, H.length).getValues().filter(function (r) { return r[0]; }).map(toObj)); }
      if (c && (!t || t.upto !== n)) { try { var txt = JSON.stringify({ upto: n, b: b }); if (txt.length < 90000) c.put(k, txt, 21600); } catch (e) {} }
      return b;
    },
    append: function (objs) {
      if (!objs.length) return;
      var vals = objs.map(function (o) { return [o.id, new Date(o.at), o.sid, o.type, o.cents, o.reason, o.lessonId, o.itemId, o.by, o.key]; });
      var last = sh.getLastRow();
      sh.getRange(last + 1, 1, vals.length, H.length).setValues(vals);
      if (cache) cache = cache.concat(objs);
      var to = last + vals.length;
      Object.keys(per).forEach(function (s) { if (per[s].upto === last) per[s] = { upto: to, rows: per[s].rows.concat(objs.filter(function (o) { return o.sid === s; })), mem: true }; else delete per[s]; });
    },
    remove: function (pred) {
      var n = sh.getLastRow(); if (n < 2) return 0;
      var vals = sh.getRange(2, 1, n - 1, H.length).getValues(), gone = 0;
      for (var i = vals.length - 1; i >= 0; i--) if (vals[i][0] && pred(toObj(vals[i]))) { sh.deleteRow(i + 2); gone++; }
      if (gone) { try { var P = PropertiesService.getScriptProperties(); P.setProperty('MONEY_GEN', String(Number(P.getProperty('MONEY_GEN') || 0) + 1)); } catch (e) {} PRE = null; per = {}; }
      cache = null; return gone;
    }
  };
  return MONEY_LIVE_;
}

/* ---------- dates (America/New_York school days) ---------- */
function moneyDay_(iso) { return Utilities.formatDate(iso ? new Date(iso) : new Date(), 'America/New_York', 'yyyy-MM-dd'); }
function moneyDow_(day) { var p = day.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])).getUTCDay(); }   /* 0 Sun … 6 Sat */
function moneyShift_(day, n) { var p = day.split('-'), d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + n)); return d.toISOString().slice(0, 10); }
function moneyPrevSchoolDay_(day) { var d = moneyShift_(day, -1); return moneyDow_(d) === 6 ? moneyShift_(d, -1) : d; }   /* skip Shabbos */
function moneyWeekStart_(day) { return moneyShift_(day, -moneyDow_(day)); }   /* the Sunday on or before */

/* ---------- ledger ---------- */
function moneyRule_(name) { var r = MONEY.RULES[name]; if (!r) throw Error('Unknown T$ rule.'); return r.cents; }
function moneyRowsFor_(sid) { var st = moneyStore_(); if (st.rowsFor) return st.rowsFor(sid); return st.rows().filter(function (r) { return r.sid === sid; }); }
function moneyBalance_(sid) { return moneyRowsFor_(sid).reduce(function (a, r) { return a + r.cents; }, 0); }
/* v231: keys that always name their own boy and are only ever paid to him (ms:<sid>:, streak3/5:<sid>:, interest:<sid>:, daily3:<sid>:, chest:<sid>:)
   are checked in that boy's rows. Every other key (prizes, gifts to a friend, refunds, store, Pathfinder, staff fixes) is checked in the whole ledger, as before. */
function moneyHasKey_(key) {
  var m = /^(ms|streak3|streak5|interest|daily3|chest):([A-Za-z0-9_.\-]+):/.exec(String(key)), st = moneyStore_();
  if (m && st.rowsFor) return st.rowsFor(m[2]).some(function (r) { return r.key === key; });
  return st.rows().some(function (r) { return r.key === key; });
}

/* Caller must hold the script lock (all callers run inside locked_ / msSave's lock). */
function moneyPost_(e) {
  var sid = String(e.sid || ''), cents = e.cents, type = e.type;
  if (!sid) throw Error('T$: student required.');
  if (!Number.isInteger(cents)) throw Error('T$ amounts must be whole cents.');
  if (MONEY.TYPES.indexOf(type) < 0) throw Error('Unknown T$ entry type.');
  if ((type === 'earn' || type === 'interest' || type === 'bonus') && cents <= 0) return null;   /* never take money for mistakes */
  if (type === 'correction' && cents === 0) return null;
  var key = String(e.key || '').slice(0, 300);
  if (key && moneyHasKey_(key)) return null;   /* each event pays once */
  /* Head of School 2026-11-16: until he finishes the Pathfinder, automatic earnings are paid at a quarter (PathfinderGate.js).
     Not the Pathfinder's own pay, and never a staff row (bonus / correction are other types; a staff-written earn has e.by). */
  if (type === 'earn' && String(e.lessonId || '') !== 'PATHFINDER' && !e.by && typeof pfRewardRate_ === 'function') {
    var rate = 1; try { rate = pfRewardRate_(sid); } catch (x) { rate = 1; }
    if (rate < 1) { cents = Math.max(1, Math.round(cents * rate)); e.reason = String(e.reason || '') + ' (1/4 until the Pathfinder is done)'; }
  }
  var row = { id: 'txn-' + Utilities.getUuid(), at: e.at || new Date().toISOString(), sid: sid, type: type, cents: cents,
    reason: String(e.reason || '').slice(0, 200), lessonId: String(e.lessonId || '').slice(0, 120), itemId: String(e.itemId || '').slice(0, 120),
    by: String(e.by || 'system').slice(0, 254), key: key };
  moneyStore_().append([row]);
  return row;
}
function moneyEarn_(sid, rule, key, lessonId, itemId, reason) {
  return moneyPost_({ sid: sid, type: 'earn', cents: moneyRule_(rule), reason: reason || MONEY.RULES[rule].label, key: key, lessonId: lessonId, itemId: itemId });
}

/* Streak: days with learning pay, counted back from today, Shabbos skipped. Pays on reaching 3 and 5. */
function moneyStreak_(sid) {
  var today = moneyDay_(), days = {};
  if (today < MONEY.SINCE) return;
  moneyRowsFor_(sid).forEach(function (r) { if (r.type === 'earn' && r.key.indexOf('streak') !== 0) days[moneyDay_(r.at)] = true; });
  var n = 0, d = today;
  while (days[d] && d >= MONEY.SINCE) { n++; d = moneyPrevSchoolDay_(d); }
  if (n === 3) moneyEarn_(sid, 'streak3', 'streak3:' + sid + ':' + today);
  if (n === 5) moneyEarn_(sid, 'streak5', 'streak5:' + sid + ':' + today);
}

/* Weekly interest, paid once for the most recent Sunday, on the balance before that Sunday. */
function moneyInterest_(sid) {
  var sunday = moneyWeekStart_(moneyDay_());
  if (sunday < MONEY.SINCE) return null;
  var key = 'interest:' + sid + ':' + sunday;
  if (moneyHasKey_(key)) return null;
  var base = moneyRowsFor_(sid).filter(function (r) { return moneyDay_(r.at) < sunday; }).reduce(function (a, r) { return a + r.cents; }, 0);
  var amt = Math.min(MONEY.INTEREST.capCents, Math.floor(base * MONEY.INTEREST.percent / 100));
  if (amt <= 0) return null;
  return moneyPost_({ sid: sid, type: 'interest', cents: amt, key: key, reason: 'Weekly interest ' + MONEY.INTEREST.percent + '% (Sunday ' + sunday + ')' });
}

/* Old "points" awards (made-up students only so far) become one T$ teacherDone row each. */
function moneyLegacy_(sid) {
  rows_('Work').filter(function (w) { return w.studentId === sid && w.learningAward; }).forEach(function (w) {
    moneyEarn_(sid, 'teacherDone', 'done:' + w.assignmentId, w.assignmentId, '', 'Teacher marked the lesson Done (converted from old points)');
  });
}
function moneyEnsure_(sid) { moneyLegacy_(sid); moneyInterest_(sid); }

/* Daily goal: the 3rd lesson mastered today pays dailyGoal once per boy per day (server side). Returns the row or null. */
function moneyDailyGoal_(sid) {
  var today = moneyDay_(), key = 'daily3:' + sid + ':' + today;
  if (moneyHasKey_(key)) return null;
  var n = moneyRowsFor_(sid).filter(function (r) { return moneyDay_(r.at) === today && (r.key.indexOf('ms:' + sid + ':Mastered ') === 0 || r.key.indexOf('finish:') === 0); }).length;
  return n >= 3 ? moneyEarn_(sid, 'dailyGoal', key, '', '', 'Daily goal: 3 lessons today') : null;
}

/* v151 weekly treasure chest: paid once per week (week starts Sunday) when the daily goal was paid on 4 different days that week. */
var MONEY_CHEST_DAYS = 4;
function moneyChestStatus_(sid) {
  var week = moneyWeekStart_(moneyDay_()), pre = 'daily3:' + sid + ':', days = {};
  moneyRowsFor_(sid).forEach(function (r) { if (r.key.indexOf(pre) === 0) { var d = r.key.slice(pre.length); if (moneyWeekStart_(d) === week) days[d] = 1; } });
  return { days: Object.keys(days).length, need: MONEY_CHEST_DAYS, paid: moneyHasKey_('chest:' + sid + ':' + week), week: week, cents: moneyRule_('weeklyChest') };
}
function moneyWeeklyChest_(sid) {
  var c = moneyChestStatus_(sid);
  if (c.paid || c.days < MONEY_CHEST_DAYS) return null;
  return moneyEarn_(sid, 'weeklyChest', 'chest:' + sid + ':' + c.week, '', '', 'Treasure chest: daily goal on 4 days this week');
}

function moneyGoal_(sid) { var g = get_('Settings', 'tdGoal:' + sid); return g && g.value ? g.value : null; }
function moneySummary_(sid) {
  var rows = moneyRowsFor_(sid).slice().sort(function (a, b) { return a.at < b.at ? 1 : a.at > b.at ? -1 : 0; });
  var week = moneyWeekStart_(moneyDay_());
  return {
    studentId: sid,
    balanceCents: rows.reduce(function (a, r) { return a + r.cents; }, 0),
    weekCents: rows.filter(function (r) { return moneyDay_(r.at) >= week; }).reduce(function (a, r) { return a + r.cents; }, 0),
    interestCents: rows.filter(function (r) { return r.type === 'interest'; }).reduce(function (a, r) { return a + r.cents; }, 0),
    goal: moneyGoal_(sid),
    statement: rows.slice(0, 200).map(function (r) { return { at: r.at, type: r.type, cents: r.cents, reason: r.reason, by: r.type === 'bonus' || r.type === 'correction' ? r.by : '' }; })
  };
}
function moneyPublicRules_() {
  return { version: MONEY.VERSION, rules: Object.keys(MONEY.RULES).map(function (k) { return { id: k, label: MONEY.RULES[k].label, cents: MONEY.RULES[k].cents }; }),
    interest: MONEY.INTEREST, canteenRate: MONEY.CANTEEN_RATE, transfer: false };
}

/* ---------- hooks used by Code.gs ---------- */
function moneyBootstrap_(u) {
  var out = moneyPublicRules_();
  try {
    if (u.role === 'student') { locked_(function () { moneyEnsure_(u.studentId); }); out.balanceCents = moneyBalance_(u.studentId); }
    else { var st = moneyStore_(), all = st.balances ? st.balances() : null; out.balances = visibleStudents_(u).map(function (s) { return { studentId: s.id, balanceCents: all ? (all[s.id] || 0) : moneyBalance_(s.id) }; }); }
  } catch (e) { out.error = 'The Tashbar Bank is not available right now.'; }
  return out;
}

/* Called inside the saveWork/submitWork lock, after the Work record is written. Returns the new balance (cents). */
function moneyOnWork_(a, l, w, old, action) {
  var sid = a.studentId, aid = a.id, paid = false;
  function earn(rule, key, item) { if (moneyEarn_(sid, rule, key, l.id, item || '')) paid = true; }
  var sum = w.activitySummary && w.activitySummary.items;
  if (sum) Object.keys(sum).forEach(function (id) {
    var x = sum[id]; if (!x || !x.correct) return;
    earn('correct', 'ok:' + aid + ':' + id, id);
    if ((x.attempts || []).length === 1) earn('firstTry', 'first:' + aid + ':' + id, id);
  });
  var ss = w.studioSummary && w.studioSummary.items;
  if (ss) Object.keys(ss).forEach(function (id) {
    var x = ss[id]; if (!x || x.correct !== true) return;
    earn('correct', 'ok:' + aid + ':' + id, id);
    if (x.firstTry) earn('firstTry', 'first:' + aid + ':' + id, id);
  });
  if (action === 'submitWork') {
    if (old && old.status === 'revision_requested') {
      var n = moneyRowsFor_(sid).filter(function (r) { return r.key.indexOf('resub:' + aid + ':') === 0; }).length;
      if (n < MONEY.REVISION_MAX) earn('resubmitted', 'resub:' + aid + ':' + w.version);
    } else { earn('lessonFinished', 'finish:' + aid); if (moneyDailyGoal_(sid)) paid = true; }
  }
  if (paid) moneyStreak_(sid);
  return moneyBalance_(sid);
}

/* Called from learningAward_ when a teacher first marks submitted work Done. */
function moneyOnDone_(a, u) {
  var row = moneyPost_({ sid: a.studentId, type: 'earn', cents: moneyRule_('teacherDone'), key: 'done:' + a.id, lessonId: a.lessonId,
    reason: MONEY.RULES.teacherDone.label + ': ' + String(a.title || a.lessonId).slice(0, 80), by: u.email || u.id });
  if (row) moneyStreak_(a.studentId);
  return moneyRule_('teacherDone');
}

/* ---------- page calls (through dispatch_) ---------- */
function moneyApi_(u, action, p) {
  p = p || {};
  if (action === 'moneyMine') {
    requireRole_(u, ['student']);
    return locked_(function () { moneyEnsure_(u.studentId); var s = moneySummary_(u.studentId); s.rules = moneyPublicRules_(); return s; });
  }
  if (action === 'moneySetGoal') {
    requireRole_(u, ['student']);
    var cents = Number(p.cents), label = text_(p.label || '', 60);
    if (!Number.isInteger(cents) || cents < 100 || cents > MONEY.GOAL_MAX_CENTS) throw Error('Choose a goal from $1 to $100,000.');
    return locked_(function () { put_('Settings', { id: 'tdGoal:' + u.studentId, value: { cents: cents, label: label } }, u.id); return { cents: cents, label: label }; });
  }
  if (action === 'moneyStaff') {
    requireRole_(u, ['teacher', 'admin']);
    var out = moneyPublicRules_();
    out.students = visibleStudents_(u).filter(function (s) { return s.active; }).map(function (s) { var x = moneySummary_(s.id); return { studentId: s.id, name: s.name, balanceCents: x.balanceCents, weekCents: x.weekCents }; });
    return out;
  }
  if (action === 'moneyStudent') {
    requireRole_(u, ['teacher', 'admin']); var sid = text_(p.studentId, 80); studentAllowed_(u, sid);
    return locked_(function () { moneyEnsure_(sid); return moneySummary_(sid); });
  }
  if (action === 'moneyAdjust') {
    requireRole_(u, ['teacher', 'admin']); var id = text_(p.studentId, 80); studentAllowed_(u, id);
    var type = p.type === 'correction' ? 'correction' : p.type === 'bonus' ? 'bonus' : '';
    var amt = Number(p.cents), why = text_(p.reason || '', 200).trim();
    if (!type) throw Error('Choose bonus or correction.');
    if (!Number.isInteger(amt) || amt === 0 || Math.abs(amt) > 100000) throw Error('Enter an amount in dollars and cents (up to $1,000.00).');
    if (type === 'bonus' && amt < 0) throw Error('A bonus adds money. Use a correction to take some back.');
    if (why.length < 3) throw Error('Write the reason. Every bonus or correction needs one.');
    return locked_(function () {
      if (moneyBalance_(id) + amt < 0) throw Error('A correction cannot make the balance less than $0.00.');
      var row = moneyPost_({ sid: id, type: type, cents: amt, reason: why, by: u.email || u.id, key: 'adj:' + Utilities.getUuid() });
      audit_(u.id, 'money-' + type, id + ':' + amt);
      return { row: row, summary: moneySummary_(id) };
    });
  }
  throw Error('Unknown action.');
}

/* ---------- Sentence Studio evidence (TL-016): hints and attempts are saved for the teacher ---------- */
var STUDIO_LESSON_ID = 'DEMO-SENTENCE-STUDIO-CDH-V1';
function studioItems_() { return typeof TashbarSentenceStudio !== 'undefined' ? TashbarSentenceStudio.items : []; }
function cleanStudioProgress_(raw) {
  var items = studioItems_(); if (!raw || typeof raw !== 'object' || Array.isArray(raw)) raw = {};
  Object.keys(raw).forEach(function (id) { if (!items.some(function (i) { return i.id === id; })) throw Error('Unknown activity progress.'); });
  var out = {};
  items.forEach(function (i) {
    var v = raw[i.id] || {}, attempts = v.attempts || [], hints = v.hints === undefined ? 0 : v.hints, max = i.kind === 'classify' ? i.choices.length - 1 : 0;
    if (!Array.isArray(attempts) || attempts.length > 40 || attempts.some(function (n) { return !Number.isInteger(n) || n < 0 || n > max; })) throw Error('Invalid attempt history.');
    if (!Number.isInteger(hints) || hints < 0 || hints > 20) throw Error('Invalid hint count.');
    out[i.id] = { attempts: attempts.slice(), hints: hints };
  });
  return out;
}
function studioReport_(answers, progress) {
  var items = studioItems_(), out = {}, hints = 0, tries = 0, independent = 0;
  items.forEach(function (i) {
    var p = progress[i.id] || { attempts: [], hints: 0 }, a = answers && answers[i.id] || {};
    var correct = i.kind === 'classify' ? (a.choice === i.answer) : null;
    var firstTry = i.kind === 'classify' && correct === true && p.attempts.length === 1 && i.choices[p.attempts[0]] === i.answer;
    out[i.id] = { phase: i.phase, kind: i.kind, attempts: p.attempts.length, hints: p.hints, correct: correct, firstTry: firstTry };
    hints += p.hints; tries += p.attempts.length;
    if (i.phase === 'mastery' && firstTry && p.hints === 0) independent++;
  });
  return { items: out, hintsTotal: hints, attemptsTotal: tries, independentFirstTry: independent };
}
/* Called in saveWork/submitWork for lessons without the subtraction activity. */
function studioOnSave_(l, w, raw, old) {
  if (l.id !== STUDIO_LESSON_ID || !studioItems_().length) return;
  w.studioProgress = raw === undefined ? cleanStudioProgress_(old && old.studioProgress) : cleanStudioProgress_(raw);
  w.studioSummary = studioReport_(w.answers, w.studioProgress);
}
