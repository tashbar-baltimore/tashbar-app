/* MoneyArchive.js — keeps the T$ ledger (tab "TL Money") small enough to stay fast (Nov 15, Head of School: "close it into an archive").

   WHY: every right answer writes 1 or 2 rows to the ledger, and every save and sign-in reads the whole ledger.
   With 500 boys that is tens of thousands of rows a day; a Google Sheet stops at 10 million cells.

   WHAT IT DOES, each night:
   - Takes the "Correct answer" and "Right on the first try" rows of days that are OVER (never today's).
   - Copies them, unchanged, to a separate Google Sheet (the archive; one tab per month).
   - Puts ONE row per boy per day in their place: "Right answers (N) on <day>", with the same total.
   So every balance, every day's total and every week's total stay EXACTLY the same. Nothing is ever deleted: the detail is in the archive.

   WHAT IT NEVER TOUCHES: skill mastered, bonuses, badges, daily goal, treasure chest, streaks, interest, store, gifts, tzedakah,
   staff bonuses and corrections. Those rows stay in the ledger as they are.

   PAY RULE KEPT: a boy still earns at most 40 right-answer payments per skill, ever. The day row remembers how many he has per skill
   (msCheckPay_ in MiddleSchool.js adds them). One small difference: a question he was paid for on an earlier day can pay again
   if he meets it again, but only inside that same limit of 40 per skill.

   HOW TO USE (Apps Script editor):
   1. moneyArchiveCheck()    look only: writes what WOULD move to the log. Changes nothing.
   2. moneyArchiveNightly()  run it once by hand and look at the ledger and the archive.
   3. moneyArchiveInstall()  turns on the nightly run (about 2 am; skipped on Shabbos). moneyArchiveRemove() turns it off.
   Until step 3 nothing here runs by itself. */
var MONEY_ARCH = { PROP: 'MONEY_ARCHIVE_ID_', WINDOW: 20000, MAX_MS: 240000, BY: 'archive' };

/* is this a per-answer pay row of its own boy? returns 'ok', 'first' or '' */
function moneyArchKind_(r) {
  if (r.type !== 'earn' || !(r.cents > 0)) return '';
  var pre = 'ms:' + r.sid + ':';
  if (r.key.indexOf(pre + 'ok:') === 0) return 'ok';
  if (r.key.indexOf(pre + 'first:') === 0) return 'first';
  return '';
}
/* right-answer payments already folded into day rows, per skill: { skill: count } (used by msCheckPay_ for the 40-per-skill limit) */
function moneyCarried_(rows, sid) {
  var pre = 'ms:' + sid + ':carry:', out = {};
  rows.forEach(function (r) {
    if (r.key.indexOf(pre) !== 0) return;
    try { var m = JSON.parse(r.itemId || '{}'); Object.keys(m).forEach(function (k) { out[k] = (out[k] || 0) + (Number(m[k]) || 0); }); } catch (e) {}
  });
  return out;
}
function moneyArchBook_(year) {
  var p = PropertiesService.getScriptProperties(), key = MONEY_ARCH.PROP + year, id = p.getProperty(key), ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  if (!ss) { ss = SpreadsheetApp.create('Tashbar T$ archive ' + year + ' (right-answer rows moved out of TL Money)'); p.setProperty(key, ss.getId()); }
  return ss;
}
function moneyArchTab_(ss, name, head) {
  var sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}

/* One window of the ledger. dry = look only. Returns { moved, boys, cents, left } (left = more old rows are waiting). */
function moneyArchiveStep_(dry) {
  var H = MONEY.HEAD, sh = SpreadsheetApp.openById(TL.sheet).getSheetByName(MONEY.TAB);
  var n = sh ? sh.getLastRow() : 0; if (n < 2) return { moved: 0, boys: 0, cents: 0, left: false };
  var today = moneyDay_();
  function obj(v) { return { sid: String(v[2]), type: String(v[3]), cents: Number(v[4]) || 0, key: String(v[9] || ''), at: v[1] instanceof Date ? v[1] : new Date(v[1]) }; }
  function old(v) { if (!v[0]) return ''; var o = obj(v), k = moneyArchKind_(o); return k && moneyDay_(o.at.toISOString()) < today ? k : ''; }
  /* find the first old per-answer row: read the ledger in slices, so a long ledger is not read whole for nothing */
  var first = -1, at = 2;
  while (at <= n && first < 0) {
    var cnt = Math.min(MONEY_ARCH.WINDOW, n - at + 1), part = sh.getRange(at, 1, cnt, H.length).getValues();
    for (var i = 0; i < part.length; i++) if (old(part[i])) { first = at + i; break; }
    at += cnt;
  }
  if (first < 0) return { moved: 0, boys: 0, cents: 0, left: false };
  var len = Math.min(MONEY_ARCH.WINDOW, n - first + 1), vals = sh.getRange(first, 1, len, H.length).getValues();
  var keep = [], move = [], groups = {}, order = [], before = 0, moveCents = 0;
  vals.forEach(function (v) {
    if (!v[0]) return;                                   /* an empty line left by an earlier run: dropped */
    before += Number(v[4]) || 0;
    var kind = old(v); if (!kind) { keep.push(v); return; }
    var o = obj(v), day = moneyDay_(o.at.toISOString()), gk = o.sid + '|' + day, g = groups[gk];
    if (!g) { g = groups[gk] = { sid: o.sid, day: day, cents: 0, n: 0, at: o.at, skills: {} }; order.push(gk); }
    g.cents += o.cents; moveCents += o.cents; if (o.at > g.at) g.at = o.at;
    if (kind === 'ok') { g.n++; var rest = o.key.slice(('ms:' + o.sid + ':ok:').length), skill = rest.slice(0, rest.indexOf('|') < 0 ? rest.length : rest.indexOf('|')); g.skills[skill] = (g.skills[skill] || 0) + 1; }
    move.push(v);
  });
  var stamp = Utilities.formatDate(new Date(), 'America/New_York', 'yyyyMMddHHmmss');
  var carry = order.map(function (gk) { var g = groups[gk];
    return ['txn-' + Utilities.getUuid(), g.at, g.sid, 'earn', g.cents, 'Right answers (' + g.n + ') on ' + g.day, '', JSON.stringify(g.skills), MONEY_ARCH.BY, 'ms:' + g.sid + ':carry:' + g.day + '#' + Utilities.getUuid().slice(0, 8)]; });
  var after = keep.concat(carry).reduce(function (a, v) { return a + (Number(v[4]) || 0); }, 0);
  if (after !== before) throw new Error('T$ archive stopped: totals do not match (' + before + ' before, ' + after + ' after). Nothing was changed.');
  var boys = {}; order.forEach(function (gk) { boys[groups[gk].sid] = 1; });
  var out = { moved: move.length, boys: Object.keys(boys).length, cents: moveCents, left: first + len - 1 < n };
  if (dry || !move.length) return out;

  /* 1. copy the rows to the archive (by month), and make sure they are there */
  var byTab = {}; move.forEach(function (v) { var d = moneyDay_(obj(v).at.toISOString()), y = d.slice(0, 4), t = y + '|' + d.slice(0, 7); (byTab[t] = byTab[t] || []).push(v); });
  Object.keys(byTab).forEach(function (t) {
    var ss = moneyArchBook_(t.split('|')[0]), tab = moneyArchTab_(ss, t.split('|')[1], H), was = tab.getLastRow(), rows = byTab[t];
    if (was > 1) { var have = {}; tab.getRange(2, 1, was - 1, 1).getValues().forEach(function (x) { have[String(x[0])] = 1; });   /* a run that stopped half-way already copied some: never copy a row twice */
      rows = rows.filter(function (v) { return !have[String(v[0])]; }); }
    if (!rows.length) return;
    tab.getRange(was + 1, 1, rows.length, H.length).setValues(rows); SpreadsheetApp.flush();
    if (tab.getLastRow() !== was + rows.length) throw new Error('T$ archive stopped: the copy to the archive could not be confirmed. The ledger was not changed.');
    moneyArchTab_(ss, 'LOG', ['when', 'tab', 'rows', 'cents', 'run']).appendRow([new Date(), t.split('|')[1], rows.length, rows.reduce(function (a, v) { return a + (Number(v[4]) || 0); }, 0), stamp]);
  });
  /* 2. ONE write puts the kept rows + the day rows in the window (the rest of the window becomes empty lines, which every reader skips) */
  var block = keep.concat(carry), blank = []; for (var c = 0; c < H.length; c++) blank.push('');
  while (block.length < len) block.push(blank.slice());
  sh.getRange(first, 1, len, H.length).setValues(block); SpreadsheetApp.flush();
  /* 3. take the empty lines away */
  var used = keep.length + carry.length;
  if (len - used > 0) sh.deleteRows(first + used, len - used);
  MONEY_LIVE_ = null;
  return out;
}

/* LOOK ONLY: what would move tonight (first window). Changes nothing. */
function moneyArchiveCheck() {
  var evMsg = ''; try { evMsg = ' ' + evArchiveRun_(true); } catch (e) { evMsg = ' Answers tab: ' + (e && e.message ? e.message : e); }
  var r = moneyArchiveStep_(true);
  var msg = 'T$ archive check: ' + r.moved + ' right-answer rows of ' + r.boys + ' boys ($' + (r.cents / 100).toFixed(2) + ') would move to the archive' + (r.left ? ', and more are waiting behind them.' : '.') + ' Nothing was changed.' + evMsg;
  Logger.log(msg); return msg;
}
/* The nightly run. Safe to run by hand. Holds the school lock, so it runs when the boys are not working. */
function moneyArchiveNightly() {
  if (Utilities.formatDate(new Date(), 'America/New_York', 'u') === '6') return 'Shabbos: not run.';
  var evMsg = ''; try { evMsg = ' ' + evArchiveRun_(false); } catch (e) { evMsg = ' Answers tab: ' + (e && e.message ? e.message : e); }
  return moneyArchiveMoney_() + evMsg;
}
function moneyArchiveMoney_() {
  var t0 = Date.now(), total = { moved: 0, cents: 0, runs: 0 }, lock = LockService.getScriptLock();
  while (Date.now() - t0 < MONEY_ARCH.MAX_MS) {
    if (!lock.tryLock(30000)) break;
    var r; try { r = moneyArchiveStep_(false); } finally { lock.releaseLock(); }
    total.moved += r.moved; total.cents += r.cents; total.runs++;
    if (!r.left && !r.moved) break; if (!r.left) break;
  }
  var msg = 'T$ archive: moved ' + total.moved + ' right-answer rows ($' + (total.cents / 100).toFixed(2) + ') in ' + total.runs + ' step(s). Balances are unchanged.';
  Logger.log(msg); return msg;
}
function moneyArchiveRemove() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'moneyArchiveNightly') ScriptApp.deleteTrigger(t); });
  return 'The nightly T$ archive is off.';
}
function moneyArchiveInstall() {
  moneyArchiveRemove();
  ScriptApp.newTrigger('moneyArchiveNightly').timeBased().everyDays(1).atHour(2).inTimezone('America/New_York').create();
  return 'The nightly T$ archive is on (about 2 am, not on Shabbos).';
}

/* ===== The answers tab (MS_Evidence): every answer of every boy is one row here, so it grows fastest of all. =====
   Staff screens and reports read only the newest rows (today, this week and last week). So each night the OLD rows move,
   unchanged, to the same archive file (tabs "answers YYYY-MM"). Kept in the app: the last 21 days, and never more than 400,000 rows.
   Today's rows never move. Nothing is deleted: the archive has every row.
   Two things read further back and will not see moved rows: the old teacher page's list of a boy's last 500 answers, and the count of
   right "check" answers for a photo answer on a skill he started more than 21 days ago. */
var EV_ARCH = { KEEP_DAYS: 21, KEEP_ROWS: 400000, WINDOW: 20000, MAX_MS: 120000, PROP: 'EV_ARCHIVE_PENDING' };
function evArchSig_(v) { var d = v[0] instanceof Date ? v[0].getTime() : String(v[0]); return [d, v[1], v[2], v[4]].join('|'); }
/* one block of old rows from the top of the tab. Returns how many moved (0 = nothing old is left). */
function evArchiveStep_(dry) {
  var sh = msTab_('evidence'), n = sh.getLastRow(), W = MS.TABS.evidence.length; if (n < 2) return 0;
  var today = moneyDay_(), cut = moneyShift_(today, -EV_ARCH.KEEP_DAYS), extra = Math.max(0, (n - 1) - EV_ARCH.KEEP_ROWS);
  var len = Math.min(EV_ARCH.WINDOW, n - 1), vals = sh.getRange(2, 1, len, W).getValues(), k = 0;
  for (; k < vals.length; k++) {
    var at = vals[k][0] instanceof Date ? vals[k][0] : new Date(vals[k][0]), day = isNaN(at) ? '' : moneyDay_(at.toISOString());
    if (day >= today) break;                           /* today's answers never move */
    if (!(day < cut) && k >= extra) break;             /* young enough, and the tab is not over its size */
  }
  if (dry) return k;
  var p = PropertiesService.getScriptProperties(), pend = null;
  try { pend = JSON.parse(p.getProperty(EV_ARCH.PROP) || 'null'); } catch (e) { pend = null; }
  /* a run that stopped after copying and before removing: those rows are already in the archive, so only remove them */
  if (pend && pend.k > 0 && vals.length >= pend.k && evArchSig_(vals[0]) === pend.first && evArchSig_(vals[pend.k - 1]) === pend.last) {
    sh.deleteRows(2, pend.k); SpreadsheetApp.flush(); p.deleteProperty(EV_ARCH.PROP); return pend.k; }
  if (!k) return 0;
  var rows = vals.slice(0, k), copied = false;
  if (!copied) {
    var byTab = {}; rows.forEach(function (v) { var a = v[0] instanceof Date ? v[0] : new Date(v[0]), d = isNaN(a) ? today : moneyDay_(a.toISOString()); (byTab[d.slice(0, 4) + '|answers ' + d.slice(0, 7)] = byTab[d.slice(0, 4) + '|answers ' + d.slice(0, 7)] || []).push(v); });
    Object.keys(byTab).forEach(function (t) {
      var tab = moneyArchTab_(moneyArchBook_(t.split('|')[0]), t.split('|')[1], MS.TABS.evidence), was = tab.getLastRow(), r = byTab[t];
      tab.getRange(was + 1, 1, r.length, W).setValues(r); SpreadsheetApp.flush();
      if (tab.getLastRow() !== was + r.length) throw new Error('the copy to the archive could not be confirmed. Nothing was removed.');
    });
    p.setProperty(EV_ARCH.PROP, JSON.stringify({ k: k, first: evArchSig_(rows[0]), last: evArchSig_(rows[k - 1]) }));
  }
  sh.deleteRows(2, k); SpreadsheetApp.flush();
  p.deleteProperty(EV_ARCH.PROP);
  return k;
}
function evArchiveRun_(dry) {
  if (dry) { var w = evArchiveStep_(true); return 'Answers tab: ' + (w >= EV_ARCH.WINDOW ? 'at least ' : '') + w + ' old rows would move to the archive.'; }
  var t0 = Date.now(), moved = 0, lock = LockService.getScriptLock();
  while (Date.now() - t0 < EV_ARCH.MAX_MS) {
    if (!lock.tryLock(30000)) break;
    var k; try { k = evArchiveStep_(false); } finally { lock.releaseLock(); }
    moved += k; if (k < EV_ARCH.WINDOW) break;
  }
  return 'Answers tab: moved ' + moved + ' old rows to the archive.';
}
