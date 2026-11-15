/* Tashbar Sound: saves each person's background-sound choices to their school account.
   Tab Sound_Prefs in the app database (TL.sheet): account | prefs_json | updated_at.
   Nothing is saved on the device. Version snd-1.0.0.
   Accounts:  ms     → Quest / middle school code sign-in (token from msSignInCode)
              portal → main Tashbar Learning personal-code sign-in (token from loginCode)
              owner  → the school administrator using the app without a code */
var SND = { VERSION: 'snd-1.0.0', TAB: 'Sound_Prefs', HEAD: ['account', 'prefs_json', 'updated_at'], TIMERS: [0, 15, 30, 45, 60] };

function sndAccount_(kind, token) {
  kind = String(kind || '');
  if (kind === 'ms') {
    var s = msSession_(String(token || ''));
    if (s.role === 'staff') {
      var em = '';
      try { em = String(Session.getActiveUser().getEmail() || '').toLowerCase(); } catch (e) {}
      return 'MS-STAFF:' + (em || 'shared');
    }
    if (!s.sid) throw new Error('Please sign in again.');
    return 'MS:' + s.sid;
  }
  if (kind === 'portal') { var u = sessionUser_(String(token || '')); return 'APP:' + u.id; }
  if (kind === 'owner') { var o = identity_(Session.getActiveUser().getEmail(), 'owner'); return 'APP:' + o.id; }
  throw new Error('Unknown account.');
}
function sndClean_(p) {
  p = (p && typeof p === 'object') ? p : {};
  var id = String(p.id || '').slice(0, 16);
  var vol = Number(p.vol);
  var fav = Array.isArray(p.fav) ? p.fav : [];
  var out = {
    id: /^[a-z]{2,16}$/.test(id) ? id : 'rain',
    vol: isFinite(vol) ? Math.max(0, Math.min(1, Math.round(vol * 100) / 100)) : 0.5,
    fav: fav.map(function (x) { return String(x).slice(0, 16); }).filter(function (x, i, a) { return /^[a-z]{2,16}$/.test(x) && a.indexOf(x) === i; }).slice(0, 30),
    on: p.on === true,
    timer: SND.TIMERS.indexOf(Number(p.timer)) >= 0 ? Number(p.timer) : 0
  };
  return out;
}
function sndTab_() {
  var ss = SpreadsheetApp.openById(TL.sheet), sh = ss.getSheetByName(SND.TAB);
  if (!sh) { sh = ss.insertSheet(SND.TAB); sh.getRange(1, 1, 1, 3).setValues([SND.HEAD]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function sndFindRow_(sh, account) {
  var n = sh.getLastRow(); if (n < 2) return 0;
  var hit = sh.getRange(2, 1, n - 1, 1).createTextFinder(account).matchEntireCell(true).findNext();
  return hit ? hit.getRow() : 0;
}

/* ---- calls from the pages ---- */
function soundGet(kind, token) {
  try {
    var acct = sndAccount_(kind, token), sh = sndTab_(), r = sndFindRow_(sh, acct);
    if (!r) return { ok: true, prefs: null };
    var raw = sh.getRange(r, 2).getValue();
    return { ok: true, prefs: sndClean_(JSON.parse(String(raw || '{}'))) };
  } catch (e) { return { ok: false, error: String(e.message || e) }; }
}
function soundSave(kind, token, prefs) {
  try {
    var acct = sndAccount_(kind, token), clean = sndClean_(prefs), json = JSON.stringify(clean);
    var lock = LockService.getScriptLock(); lock.waitLock(15000);
    try {
      var sh = sndTab_(), r = sndFindRow_(sh, acct), now = new Date();
      if (r) sh.getRange(r, 2, 1, 2).setValues([[json, now]]);
      else sh.appendRow([acct, json, now]);
    } finally { lock.releaseLock(); }
    return { ok: true };
  } catch (e) { return { ok: false, error: String(e.message || e) }; }
}
/* Puts the sound button on a page: inserts the TashbarSound file just before </body>. */
function tlSound_(html) {
  var w = HtmlService.createHtmlOutputFromFile('TashbarSound').getContent();
  var i = html.lastIndexOf('</body>');
  return i < 0 ? html + w : html.slice(0, i) + w + html.slice(i);
}

/* Self-test: run from the editor. Uses a made-up account row and removes it after. */
function zzSoundSelfTest() {
  var log = [], pass = 0, fail = 0;
  function ok(c, m) { if (c) pass++; else fail++; log.push((c ? 'PASS ' : 'FAIL ') + m); }
  var c = sndClean_({ id: 'birds', vol: 3, fav: ['ocean', 'ocean', 'BAD!', 'bach'], on: true, timer: 17 });
  ok(c.id === 'birds' && c.vol === 1 && c.fav.join() === 'ocean,bach' && c.on === true && c.timer === 0, 'cleans bad values');
  ok(sndClean_({ id: '<script>' }).id === 'rain', 'rejects a bad sound id');
  ok(soundGet('ms', 'not-a-token').ok === false, 'refuses a fake token');
  ok(soundSave('portal', 'x', {}).ok === false, 'refuses a fake portal token');
  var sh = sndTab_(), acct = 'ZZTEST:' + Utilities.getUuid().slice(0, 8);
  sh.appendRow([acct, JSON.stringify({ id: 'canon', vol: 0.4, fav: ['rain'], on: true, timer: 30 }), new Date()]);
  var r = sndFindRow_(sh, acct);
  ok(r > 1, 'finds the account row');
  var back = sndClean_(JSON.parse(sh.getRange(r, 2).getValue()));
  ok(back.id === 'canon' && back.timer === 30 && back.fav[0] === 'rain', 'reads the saved choice back');
  sh.deleteRow(r);
  ok(sndFindRow_(sh, acct) === 0, 'test row removed');
  ok(tlSound_('<html><body><p>x</p></body></html>').indexOf('TashbarSound') > 0, 'adds the sound button to a page');
  Logger.log(log.join('\n') + '\n' + pass + ' passed, ' + fail + ' failed');
  return { pass: pass, fail: fail, log: log };
}
