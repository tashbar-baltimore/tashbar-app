/* PATHFINDER TAP — tap questions (07 PATHFINDER BUILD PROMPT v7.2 Stage 3, items 2-5; spec PF-TAP1, QA PF-TAPQA1). 2026-11-16, by CLAUDE (Claude Code builder).
   Anyone may edit this file: log what you change in HQ.
   - Item 2  engine: PF_TAP below is the PF-TAP1 reference engine pf_tap.js, copied unchanged (one splitter for authoring checks AND the app).
             Tap questions have fmt 'TAP'; c (guess rate) = PF_TAP.check(item, passageText).c computed at load (stored c is ignored).
   - Item 3  bank: PathfinderBankTap.js (PF_BANK_TAP), all Draft, applied once inside pfIx_() by pftApply_. The 12 PF-RD2-FIX1 "convert"
             ids become tap questions; the 4-choice version they replace is kept as <id>.MC, its twin (for devices without tap).
   - Item 4  twins: a boy is never given both a tap question and its 4-choice twin; the tap form is the default (pftHide_).
             "No tap on this device" (pftTapOff) gives the 4-choice twins instead and leaves out tap questions that have none.
   - Item 5  stored taps: the answer row's response holds {"tap":"sentence|word","i":index,"text":"..."}; the session's answer record holds u:{i,t}.
   TEST only: tap questions are Draft (pfItemOk_ gives a real boy Approved questions only) and every hook returns at once for a real boy
   (sec.appr = 1), so real boys behave exactly as before. Hooks: Pathfinder.js pfGuess_, pfIx_, pfAvail_, pfNext_, pfScore_, pfPresent_,
   pfAnswer, pfOpen, pfDoGet_, pfSelfTest (each marked "PF-TAP1"); page: PathfinderPage.html + PathfinderTapUI.html. */

/* ================================================================== ENGINE (pf_tap.js, PF-TAP1 reference, unchanged) */
/* pf_tap.js — PF-TAP1 reference engine for Pathfinder "tap in the passage" questions.
   Runs as-is in Apps Script (V8) and in Node. No student data.
   One splitter for authoring checks AND for the live app, so a passage is cut into the same
   sentences everywhere (if they differ, a boy can tap the right sentence and be marked wrong). */
var PF_TAP = (function () {
  var FEATURE = /^(Source \d+|Title|Heading|Picture caption|Caption|Word to Know|Fact Box|Glossary)\s*:/i;
  var ABBR = ['Mr', 'Mrs', 'Ms', 'Dr', 'St', 'Mt', 'Jr', 'Sr', 'Rav', 'R', 'vs', 'etc', 'No', 'Ave', 'Rd', 'e.g', 'i.e', 'a.m', 'p.m', 'U.S'];
  function isAbbrevEnd(s) { var m = s.match(/([A-Za-z][A-Za-z.]*)\.["”']?$/); return !!m && ABBR.indexOf(m[1]) >= 0; }
  // Cut text into units with character offsets. Lines are hard breaks. Within a line, a unit ends at . ! ? (plus an optional closing quote) followed by a space,
  // unless the word before the period is an abbreviation, or the next character is lower-case (e.g. '"Stop!" he said.' stays one unit).
  function units(text) {
    var out = [], lines = text.split('\n'), off = 0;
    lines.forEach(function (line) {
      var start = 0, re = /[.!?]["”']?(\s+)/g, m;
      while ((m = re.exec(line))) { var end = m.index + m[0].length - m[1].length, piece = line.slice(start, end), next = line.charAt(re.lastIndex);
        if (isAbbrevEnd(piece) || /[a-z]/.test(next)) continue; push(line.slice(start, end), off + start); start = re.lastIndex; }
      push(line.slice(start), off + start); off += line.length + 1; });
    function push(s, at) { var t = s.trim(); if (!t) return; var lead = s.indexOf(t); out.push({ text: t, start: at + lead, end: at + lead + t.length, feature: FEATURE.test(t) || /^\d+\.$/.test(t) }); }
    // numbered steps "1. Do this." keep the number with the step
    for (var i = out.length - 2; i >= 0; i--) if (/^\d+\.$/.test(out[i].text)) { out[i + 1].text = out[i].text + ' ' + out[i + 1].text; out[i + 1].start = out[i].start; out[i + 1].feature = FEATURE.test(out[i + 1].text); out.splice(i, 1); }
    return out;
  }
  function tappable(text) { return units(text).filter(function (u) { return !u.feature; }); }
  function norm(s) { return s.replace(/^\d+\.\s+/, '').replace(/[“”]/g, '"').replace(/[’]/g, "'").replace(/\s+/g, ' ').trim(); }
  function words(text) { var out = [], re = /[A-Za-z][A-Za-z'’-]*/g, m; while ((m = re.exec(text))) out.push({ text: m[0], key: m[0].toLowerCase().replace(/['’]s$/, ''), start: m.index, end: m.index + m[0].length }); return out; }
  // Score: unit tap -> index into tappable(text); word tap -> index into words(text).
  function scoreSentence(item, text, tappedIndex) { var U = tappable(text), u = U[tappedIndex]; if (!u) return false; return item.answers.some(function (a) { return norm(a) === norm(u.text); }); }
  function scoreWord(item, text, tappedIndex) { var W = words(text), w = W[tappedIndex]; return !!w && w.key === item.answer_word.toLowerCase(); }
  // Authoring check for one item. Returns a list of problems (empty = OK) and the guessing floor c.
  function check(item, text) { var P = [], c;
    if (item.type === 'tap_word') { var W = words(text), n = W.filter(function (w) { return w.key === item.answer_word.toLowerCase(); }).length; if (!n) P.push('answer word not in passage'); c = n / W.length; }
    else { var U = tappable(text); (item.answers || []).forEach(function (a) { var n = U.filter(function (u) { return norm(u.text) === norm(a); }).length; if (n !== 1) P.push('answer matches ' + n + ' tappable sentences: "' + a.slice(0, 50) + '"'); }); c = (item.answers || []).length / U.length; }
    units(text).forEach(function (u) { if (u.feature && /^Source \d+:/.test(u.text) && u.text.split(/\s+/).length > 12) P.push('header runs into a sentence (put a line break after the title): "' + u.text.slice(0, 60) + '"'); });
    return { problems: P, c: +c.toFixed(3) }; }
  return { units: units, tappable: tappable, words: words, scoreSentence: scoreSentence, scoreWord: scoreWord, check: check, norm: norm };
})();
if (typeof module !== 'undefined') module.exports = PF_TAP;

/* ================================================================== APP GLUE (TEST boys only) */
var PFT = { VERSION: 'pf-tap-1', twin: {}, skipped: [] };   /* twin: id -> its twin's id, both ways (kept here: Approved items are never changed) */
function pftText_(it) { var P = it && it.passage && PF_BANK.passages[it.passage]; return P ? String(P.text || '') : ''; }
/* Install PF_BANK_TAP once (from pfIx_). Converts take the old id; the old 4-choice version stays as <id>.MC. Never touches an Approved item. */
function pftApply_() {
  if (typeof PF_BANK_TAP === 'undefined' || typeof PF_BANK === 'undefined' || PF_BANK_TAP.applied) return;
  var T = PF_BANK_TAP, at = {}, added = [];
  PF_BANK.items.forEach(function (it, i) { at[it.id] = i; });
  PF_BANK.codes = PF_BANK.codes || {}; Object.keys(T.codes || {}).forEach(function (k) { if (!PF_BANK.codes[k]) PF_BANK.codes[k] = T.codes[k]; });
  Object.keys(T.passages || {}).forEach(function (k) { if (!PF_BANK.passages[k]) PF_BANK.passages[k] = T.passages[k]; });
  T.items.forEach(function (src) {
    var it = {}; Object.keys(src).forEach(function (k) { it[k] = src[k]; });
    if (it.convert) {
      var i = at[it.id], old = i == null ? null : PF_BANK.items[i];
      if (!old || old.fmt !== 'CHOICE' || old.status === 'Approved' || at[it.id + '.MC'] != null) { PFT.skipped.push(it.id + ': convert target missing, not 4-choice or Approved'); return; }
      var mc = {}; Object.keys(old).forEach(function (k) { mc[k] = old[k]; }); mc.id = old.id + '.MC';
      ['skill', 'strand', 'ccss', 'level', 'form'].forEach(function (k) { if (it[k] == null || k === 'strand' || k === 'ccss') it[k] = old[k]; });
      it.twin = mc.id; PF_BANK.items[i] = it; PF_BANK.items.push(mc); at[mc.id] = PF_BANK.items.length - 1;
    } else {
      if (at[it.id] != null) { PFT.skipped.push(it.id + ': id already in the bank'); return; }
      PF_BANK.items.push(it); at[it.id] = PF_BANK.items.length - 1;
    }
    added.push(it);
  });
  added.forEach(function (it) {
    var sk = PF_BANK.skills[it.skill] || {}; if (!it.strand) it.strand = sk.strand; if (!it.ccss) it.ccss = sk.ccss || '';
    if (it.twin) { var tw = PF_BANK.items[at[it.twin]]; if (!tw) { PFT.skipped.push(it.id + ': twin ' + it.twin + ' missing'); delete it.twin; } else { PFT.twin[it.id] = it.twin; PFT.twin[it.twin] = it.id; if (it.bTwinPlus != null) it.b = Math.round((tw.b + it.bTwinPlus) * 100) / 100; } }
    if (it.fmt === 'TAP') it.tapC = PF_TAP.check(it.tap, pftText_(it)).c;   /* guess rate from the engine, at load */
  });
  T.applied = true;
}
/* Item picker hook (pfAvail_, pfNext_ queue). Never both twins; tap form by default; no tap form when the device has no tap. Real boys: false. */
function pftHide_(sec, it, pickedId) {
  if (!sec || sec.appr === 1) return false;   /* Stage 9: appr 2 (live boy, drafts allowed) gets tap like TEST */
  if (it.fmt === 'TAP' && sec.tapOff) return true;
  var tw = PFT.twin[it.id]; if (!tw) return false;
  if (pickedId === tw || (sec.cur && sec.cur.i === tw) || sec.ans.some(function (a) { return a.i === tw; })) return true;   /* never both */
  if (it.fmt === 'TAP') return false;
  var t = pfIx_().byId[tw]; return !sec.tapOff && !!t && pfItemOk_(t, sec.appr);                                                /* default to the tap form */
}
/* resp: "#<index>" (what the page sends) or the unit's own text (self-test, simulation). Returns the index into tappable()/words(), or -1. */
function pftIndexOf_(it, text, resp) {
  var s = String(resp == null ? '' : resp), m = /^#(\d+)$/.exec(s.trim()), word = it.tap.type === 'tap_word';
  var L = word ? PF_TAP.words(text) : PF_TAP.tappable(text);
  if (m) return +m[1] < L.length ? +m[1] : -1;
  for (var i = 0; i < L.length; i++) if (word ? L[i].key === s.trim().toLowerCase().replace(/['’]s$/, '') : PF_TAP.norm(L[i].text) === PF_TAP.norm(s)) return i;
  return -1;
}
function pftScore_(it, resp) {
  var text = pftText_(it), i = pftIndexOf_(it, text, resp); if (i < 0) return { x: 0, code: 'other' };
  var ok = it.tap.type === 'tap_word' ? PF_TAP.scoreWord(it.tap, text, i) : PF_TAP.scoreSentence(it.tap, text, i);
  return { x: ok ? 1 : 0, code: ok ? '' : 'other' };
}
/* What the page gets: the units with offsets (never which one is right). Feature lines come with t:-1 (shown, not tappable). */
function pftPresent_(it, out) {
  var text = pftText_(it);
  if (it.tap.type === 'tap_word') out.tap = { kind: 'word', units: PF_TAP.words(text).map(function (w, i) { return { i: i, s: w.start, e: w.end }; }) };
  else { var n = 0; out.tap = { kind: 'sentence', units: PF_TAP.units(text).map(function (u) { return { i: u.feature ? -1 : n++, s: u.start, e: u.end }; }) }; }
  out.tap.text = text;
}
/* Answer logging hook (pfAnswer): the unit he tapped, index and text, in the answer row and in his session record. */
function pftLog_(it, value, rec) {
  var text = pftText_(it), i = pftIndexOf_(it, text, value), word = it.tap.type === 'tap_word', L = word ? PF_TAP.words(text) : PF_TAP.tappable(text), t = i >= 0 ? L[i].text : '';
  rec.u = { i: i, t: t };
  return JSON.stringify({ tap: word ? 'word' : 'sentence', i: i, text: t });
}
/* pfOpen hook: the device setting rides on each section (TEST boys only). */
function pftSecHook_(S, sec) { if (sec && sec.appr !== 1) sec.tapOff = S.state.tapOff ? 1 : 0; }
/* From the page: "this device cannot tap in the passage" (off = true) or back on. TEST boys only. The current tap question, if any,
   is swapped for its 4-choice twin (or the next question when it has none); nothing is scored. */
function pftTapOff(token, off) {
  var r = pfMe_(token); if (!pfV8On_(r.id)) return pfStart(token);
  return pfLock_(function () {
    var S = pfActive_(r.id), now = Date.now(); if (!S) throw new Error('Please start again.');
    S.state.tapOff = off ? 1 : 0; var k = S.state.cursec, sec = k && S.state.sections[k];
    if (sec && !sec.done) { sec.appr = pfAppr_(r.id); pftSecHook_(S, sec);
      var cur = sec.cur && pfIx_().byId[sec.cur.i];
      if (cur && cur.fmt === 'TAP' && sec.tapOff) { var tw = pfIx_().byId[PFT.twin[cur.id]]; sec.cur = null; sec.queue = (sec.queue || []).filter(function (id) { return pfIx_().byId[id].fmt !== 'TAP'; });
        var nx = tw && pfItemOk_(tw, sec.appr) ? tw : pfNext_(sec, pfSeen_(S)); if (!nx) return pfFinish_(S, r, k, {}); pfSetCur_(sec, nx, now); } }
    pfSaveSession_(S); return pfView_(S, r);
  });
}

/* ================================================================== SELF-TEST (called by pfSelfTest) */
function pftSelfTest_() {
  var ix = pfIx_(), out = { version: PFT.VERSION, tapItems: 0, sentence: 0, word: 0, twins: 0, problems: [] }, P = out.problems;
  var u = function (s) { return PF_TAP.tappable(s).map(function (x) { return x.text; }).join('|'); };
  if (u('Mr. Levin came. He sat.') !== 'Mr. Levin came.|He sat.') P.push('engine: split after "Mr."');
  if (u('Title: Bees\nHeading: Food\nSource 1: A Letter\nBees fly. They sip.') !== 'Bees fly.|They sip.') P.push('engine: a feature line is tappable');
  if (u('Do this:\n1. Open the box. 2. Lift the lid.') !== 'Do this:|1. Open the box.|2. Lift the lid.') P.push('engine: numbered steps');
  PFT.skipped.forEach(function (x) { P.push('not installed: ' + x); });
  var tapN = 0;
  PF_BANK.items.forEach(function (it) {
    if (it.fmt !== 'TAP') return; tapN++; out[it.tap.type === 'tap_word' ? 'word' : 'sentence']++;
    var text = pftText_(it); if (!text) { P.push(it.id + ': passage missing'); return; }
    if (it.status === 'Approved') P.push(it.id + ': tap question is Approved (real boys would get it)');
    var ck = PF_TAP.check(it.tap, text); ck.problems.forEach(function (x) { P.push(it.id + ': ' + x); });
    if (Math.abs((it.tapC || 0) - ck.c) > 1e-9 || !(it.tapC > 0)) P.push(it.id + ': guess rate not from the engine');
    if (pfGuess_(it) !== it.tapC) P.push(it.id + ': pfGuess_ does not use the engine c');
    if (typeof it.b !== 'number' || isNaN(it.b)) P.push(it.id + ': no seed b');
    var word = it.tap.type === 'tap_word', L = word ? PF_TAP.words(text) : PF_TAP.tappable(text), right = -1, wrong = -1;
    L.forEach(function (x, i) { var ok = word ? PF_TAP.scoreWord(it.tap, text, i) : PF_TAP.scoreSentence(it.tap, text, i); if (ok && right < 0) right = i; if (!ok && wrong < 0) wrong = i; });
    if (right < 0 || pftScore_(it, '#' + right).x !== 1) P.push(it.id + ': the right unit does not score right');
    if (wrong < 0 || pftScore_(it, '#' + wrong).x !== 0) P.push(it.id + ': a wrong unit does not score wrong');
    if (pfScore_(it, it.ans).x !== 1) P.push(it.id + ': pfScore_ hook does not score its own answer right');
    var rec = {}, lg = JSON.parse(pftLog_(it, '#' + wrong, rec)); if (lg.i !== wrong || lg.text !== L[wrong].text || rec.u.i !== wrong) P.push(it.id + ': tapped unit not logged');
    var pr = { }; pftPresent_(it, pr); var nT = pr.tap.units.filter(function (x) { return x.i >= 0; }).length; if (nT !== L.length) P.push(it.id + ': page units differ from the engine');
    if (it.twin) { out.twins++; var tw = ix.byId[it.twin]; if (!tw || tw.fmt !== 'CHOICE' || PFT.twin[it.twin] !== it.id) P.push(it.id + ': 4-choice twin ' + it.twin + ' missing'); }
  });
  out.tapItems = tapN;
  /* twins: simulated TEST sections never hold both; tap form by default; no tap form with tap off; real boys never see a tap question */
  ['READ'].forEach(function (k) {
    [0, 1].forEach(function (off) { for (var g = 0; g <= 8; g++) { var sec = pfNewSection_(k, g, 0, false, false, 0), it, n = 0, got = {}; sec.tapOff = off;
      while ((it = pfNext_(sec, null, function () { return 0.5; })) && n++ < 60) { got[it.id] = 1; if (off && it.fmt === 'TAP') P.push('tap off but a tap question was given: ' + it.id); pfRecord_(sec, it, it.ans, 20000, false, ''); }
      Object.keys(got).forEach(function (id) { if (PFT.twin[id] && got[PFT.twin[id]]) P.push('grade ' + g + ': both twins given: ' + id); if (!off && ix.byId[id].fmt === 'CHOICE' && PFT.twin[id]) P.push('grade ' + g + ': 4-choice twin given although the tap form was free: ' + id); });
      (sec.ans || []).forEach(function (a) { if (ix.byId[a.i].fmt === 'TAP') out.tapGiven = (out.tapGiven || 0) + 1; }); } });
    for (var g2 = 0; g2 <= 8; g2++) { var rs = pfNewSection_(k, g2, 0, false, false, 1), it2, n2 = 0; while ((it2 = pfNext_(rs, null, function () { return 0.5; })) && n2++ < 60) { if (it2.fmt === 'TAP' || it2.status !== 'Approved') P.push('a real student was given ' + it2.id); pfRecord_(rs, it2, it2.ans, 20000, false, ''); } }
  });
  return out;
}
