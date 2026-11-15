/* PATHFINDER v5 (07 PATHFINDER BUILD PROMPT v5, Stage A; local build 2026-11-12 by the Claude Code builder).
   Adds, for TEST boys only while every record is Draft: Language Arts (adaptive, through the v4 engine), the silent-reading maze,
   listening/reading pairs with the profile rules and the grade-below confirm step, Computing (with the typing check),
   Life and Money, What helps me, About me, and sentence tiles (the first part of the Writing stop).
   Content lives in PathfinderBankLA.js, PathfinderBankX.js, PathfinderBankLit.js and PathfinderWriting.js (exact HQ JSON).
   Rules kept from v4: PF_LIVE_GRADES is unchanged; a boy who is not a TEST boy is offered a v5 stop only when every record it
   would use is Approved with no hold (none are yet), so real boys see exactly the v4 road.
   Money: the v5 stops pay nothing (no try pay, no jar). Amounts stay in Money.js; Reading and Math pay exactly as in v4.
   Not here: Stage B (copying, spelling, the writing piece, teacher-confirm screen, sweep) and Stage C (oral reading, word list,
   rapid naming: they wait for the microphone permission, the parent notice and the speech-tool decision). The fluency norms are
   stored and pf5Orf_ scores a reading (pure, no screen), because the decoding-barrier profile rule needs a percentile. */
var PF5 = {
  VERSION: 'pf5-1.0.0',
  /* the road for a TEST boy, in order (v4 stops keep their places for real boys) */
  ROAD: ['READ', 'MATH', 'LANG', 'MAZE', 'LR', 'WRIT', 'COMP', 'LIFE', 'HELP', 'ABOUT', 'HEB'],
  STOPS: ['LANG', 'MAZE', 'LR', 'WRIT', 'COMP', 'LIFE', 'HELP', 'ABOUT'],
  NEW_STOPS: [['MAZE', 'Silent reading', 0], ['LR', 'Listening and reading', 0], ['ABOUT', 'About me', 0]],
  LANDS: { MAZE: { name: 'Quiet Woods', ic: '🌲', color: '#2d6a4f' }, LR: { name: 'Echo Valley', ic: '🎧', color: '#6c5ce7' }, ABOUT: { name: 'Home Base', ic: '🏠', color: '#a0522d' } },
  STRANDS_LANG: { GRAM: 'Grammar', MECH: 'Capitals, punctuation and spelling', USE: 'Word use', SENT: 'Sentences' },
  /* Language Arts: adaptive like Reading, starts at his Reading estimate, stops at SE 0.40 or 25 questions */
  ENGINE_LANG: { minItems: 12, maxItems: 25, totalMax: 25, hardMax: 30, seStop: 0.40, minPerStrand: 3, boundaryMin: 2, boundaryMax: 4 },
  MAZE_MS: 180000, MAZE_GRACE_MS: 20000,
  TYPE_MS: 60000,
  TILE_PRACTICE: [['I', 'ran', '.'], ['We', 'sat', '.'], ['Dogs', 'bark', '.']],
  FACES: [['love', 'Love it', '😍'], ['like', 'Like it', '🙂'], ['soso', 'So-so', '😐'], ['notyet', 'Not fun yet', '😕']],
  VOICE: 'temporary voice'                       /* the browser speech voice, until a man records the audio */
};

/* ================================================================== CONTENT ADAPTERS (pure) */
var PF5_IX_ = null;
function pf5Ix_() {
  if (PF5_IX_) return PF5_IX_;
  var o = { la: [], laSkills: {}, maze: {}, mazeList: [], lr: {}, lrItems: {}, x: {}, comp: [], life: [], whm: {}, tiles: {}, codes: {} };
  /* Language Arts -> the v4 engine's record shape (the bank file keeps the JSON shape) */
  var ladderName = {}; try { (plList_('LANG') || []).forEach(function (x) { ladderName[x[0]] = x[1]; }); } catch (e) {}
  var bs = {};
  (PF_LA.items || []).forEach(function (j) {
    var plain = String(j.stem).replace(/<\/?i>/g, ''), choices = [j.answer].concat(j.wrong.map(function (w) { return w.answer; }));
    var it = { id: j.item_id, skill: j.skill_id, subject: 'LANG', strand: j.strand, level: j.level, ccss: j.ccss, fmt: 'CHOICE', stem: j.stem,
      say: j.level <= 2 ? plain + ' ' + choices.map(function (c) { return String(c).replace(/<\/?i>/g, ''); }).join(', or ') + '?' : '',
      ans: j.answer, wrong: j.wrong.map(function (w) { return [w.answer, w.code]; }), b: j.b, form: j.form, status: j.status || 'Draft', show: '', cmode: 'text', screenNote: '', audioOnly: false,
      rw: (plain + ' ' + choices.join(' ')).replace(/<\/?i>/g, '').split(/\s+/).filter(Boolean).length, hold: j.hold || '' };
    o.la.push(it); (bs[j.skill_id] = bs[j.skill_id] || []).push(it);
  });
  Object.keys(bs).forEach(function (id) { var a = bs[id]; o.laSkills[id] = { level: a[0].level, strand: a[0].strand, b: Math.round(a.reduce(function (s, it) { return s + it.b; }, 0) / a.length * 100) / 100, name: ladderName[id] || id, ccss: a[0].ccss }; });
  /* maze passages A/B (PF-P4B) and C/D (PF-P4D) */
  [PF_MAZE_AB, PF_MAZE_CD].forEach(function (f) { (f.passages || []).forEach(function (p) { o.maze[p.passage_id] = p; o.mazeList.push(p); }); });
  /* listening / reading pairs (PF-P4C v2) */
  (PF_LR.passages || []).forEach(function (p) { o.lr[p.passage_id] = p; });
  (PF_LR.items || []).forEach(function (j) { o.lrItems[j.item_id] = j; });
  /* Computing / Life and Money */
  (PF_X.computing || []).forEach(function (j) { o.comp.push(j); o.x[j.item_id] = j; });
  (PF_X.money || []).forEach(function (j) { o.life.push(j); o.x[j.item_id] = j; });
  (PF_X.what_helps_me || []).forEach(function (s) { o.whm[s.skill_id] = s; });
  /* sentence tiles: id band.form.n */
  Object.keys(PF_W.tiles || {}).forEach(function (band) { Object.keys(PF_W.tiles[band]).forEach(function (form) { PF_W.tiles[band][form].forEach(function (t, i) { var id = band + '.' + form + '.' + (i + 1); o.tiles[id] = { id: id, band: band, form: form, tiles: t, alts: (PF_W.tile_alternatives || {})[id] || [] }; }); }); });
  /* every v5 mistake code with its plain meaning */
  [PF_LA.codes, PF_X.codes, PF_MAZE_AB.codes, PF_MAZE_CD.codes, PF_W.tile_codes, PF_ORF.error_codes].forEach(function (c) { Object.keys(c || {}).forEach(function (k) { if (!o.codes[k]) o.codes[k] = c[k]; }); });
  return (PF5_IX_ = o);
}
/* one code table for the report: v4 codes first, then the v5 ones */
function pf5CodeName_(c) { return (PF_BANK.codes || {})[c] || pf5Ix_().codes[c] || c; }
function pf5FileStatus_(f) { return f && f.status === 'Approved' ? 'Approved' : 'Draft'; }
function pf5Ok_(status, hold, appr) { return appr ? status === 'Approved' && !hold : true; }

/* ================================================================== SCORING (pure; unit-tested in Node) */
/* MAZE: picks = {n: {o: option, ms}}. Score = correct − ½ × incorrect. A choice before the last one he reached with no pick is
   skipped = not attempted (not wrong). Per-minute score only when he finished every choice before the 3 minutes. */
function pf5MazeScore_(p, picks, elapsedMs) {
  var correct = 0, incorrect = 0, syn = 0, mean = 0, last = 0, attempted = 0, codes = {};
  (p.choices || []).forEach(function (c) { var k = picks[c.n] || picks[String(c.n)]; if (k && k.o != null && k.o !== '') last = Math.max(last, c.n); });
  (p.choices || []).forEach(function (c) {
    var k = picks[c.n] || picks[String(c.n)]; if (!k || k.o == null || k.o === '') return;
    attempted++;
    if (pfNfc_(k.o) === pfNfc_(c.answer)) correct++;
    else { incorrect++; var w = (c.wrong || []).filter(function (x) { return pfNfc_(x.answer) === pfNfc_(k.o); })[0], code = w ? w.code : 'other'; codes[code] = (codes[code] || 0) + 1; if (code === 'MAZE-SYNTAX') syn++; else if (code === 'MAZE-MEANING') mean++; }
  });
  var total = (p.choices || []).length, score = correct - 0.5 * incorrect, ms = Math.max(1000, Math.min(PF5.MAZE_MS, Number(elapsedMs) || PF5.MAZE_MS));
  var early = attempted === total && total > 0 && ms < PF5.MAZE_MS;
  return { correct: correct, incorrect: incorrect, syntax: syn, meaning: mean, attempted: attempted, last: last, skipped: last - attempted, total: total,
    score: score, perMin: early ? Math.round(score / (ms / 60000) * 10) / 10 : null, finishedEarly: early, ms: Math.round(ms), codes: codes };
}
/* Listening / reading profile (PF-P4C rules). Scores are 0-5. orf: {below25: bool, lowList: bool} or null (Stage C not built).
   Returns the rules that fire; decoding_barrier fires on the listen/read pattern and is "pending" until oral reading exists. */
function pf5ProfileRules_(L, R, orf) {
  var out = [], inR = function (x, lo, hi) { return x >= lo && x <= hi; };
  if (inR(L, 4, 5) && inR(R, 0, 2)) { var o = orf ? !!(orf.below25 || orf.lowList) : null; if (o !== false) out.push({ name: 'decoding_barrier', pending: o === null }); }
  if (inR(L, 0, 2) && inR(R, 0, 2)) out.push({ name: 'language_barrier' });
  if (inR(L, 0, 2) && inR(R, 4, 5)) out.push({ name: 'listening_low' });
  return out;
}
/* The confirm step: a flag is kept only if the same rule fires again on the grade-below pair. first/confirm: {listen, read}. */
function pf5ProfileFinal_(first, confirm, orf) {
  var a = pf5ProfileRules_(first.listen, first.read, orf), names = { decoding_barrier: false, language_barrier: false, listening_low: false }, lines = [];
  if (!a.length) return { flags: names, candidates: [], confirmed: [], lines: lines, needConfirm: false };
  if (!confirm) return { flags: names, candidates: a.map(function (x) { return x.name; }), confirmed: [], lines: ['Pattern seen once (' + a.map(function (x) { return x.name; }).join(', ') + '); no lower pair to confirm it.'], needConfirm: true };
  var b = pf5ProfileRules_(confirm.listen, confirm.read, orf).map(function (x) { return x.name; }), kept = [];
  a.forEach(function (x) { if (b.indexOf(x.name) >= 0) { kept.push(x.name); names[x.name] = x.pending ? 'pending' : true; } });
  var words = { decoding_barrier: 'Listening is strong but reading the same kind of text is low: decoding may be the barrier', language_barrier: 'Both listening and reading are low: language understanding may be the barrier', listening_low: 'Reading is strong but listening is low: check attention or hearing when he listens' };
  kept.forEach(function (n) { lines.push(words[n] + (names[n] === 'pending' ? ' (waits for the oral-reading measure to confirm)' : '') + '.'); });
  a.forEach(function (x) { if (kept.indexOf(x.name) < 0) lines.push(x.name + ' seen on his grade pair but not on the grade-below pair: not kept.'); });
  return { flags: names, candidates: a.map(function (x) { return x.name; }), confirmed: kept, lines: lines, needConfirm: true };
}
/* Computing / Life and Money: results [{level, x}] in the order asked. Stop after 3 misses in a row; level = the highest level with
   both right and at least one right at every level below (Levels 2-9; 1 = below Level 2). */
function pf5StopNow_(results) { var run = 0; for (var i = results.length - 1; i >= 0 && !results[i].x; i--) run++; return run >= ((PF_X.rules || {}).stop_after_misses_in_a_row || 3); }
function pf5LevelRule_(results) {
  var by = {}; results.forEach(function (r) { (by[r.level] = by[r.level] || []).push(r.x ? 1 : 0); });
  var best = 1;
  for (var L = 2; L <= 9; L++) {
    var okBelow = true; for (var j = 2; j < L; j++) if (!(by[j] || []).some(function (x) { return x; })) okBelow = false;
    var both = (by[L] || []).length >= 2 && by[L].every(function (x) { return x; });
    if (both && okBelow) best = L;
  }
  return best;
}
/* Typed money and unit answers. Cents answers accept "45", "45¢", "$0.45"; dollar answers accept "$1.65", "1.65", "165¢".
   A bare whole number takes the answer's own unit; a number with a unit word ("6 weeks") also accepts the number alone. */
function pf5Cents_(s, unit) {
  s = pfNorm_(s).replace(/\s+/g, ''); var m;
  if ((m = /^\$(\d+(?:\.\d{1,2})?|\.\d{1,2})$/.exec(s))) return Math.round(Number(m[1]) * 100);
  if ((m = /^(\d+)(?:¢|c|cents?)$/.exec(s))) return Number(m[1]);
  if ((m = /^(\d+\.\d{1,2}|\.\d{1,2})(?:dollars?)?$/.exec(s))) return Math.round(Number(m[1]) * 100);
  if ((m = /^(\d+)(dollars?)?$/.exec(s))) return m[2] || unit === '$' ? Number(m[1]) * 100 : Number(m[1]);
  return NaN;
}
function pf5TypedSame_(resp, ans) {
  ans = pfNfc_(ans); var m;
  if (/^\$/.test(ans) || /¢$/.test(ans)) { var unit = /^\$/.test(ans) ? '$' : '¢', a = pf5Cents_(ans, unit), r = pf5Cents_(resp, unit); return !isNaN(a) && a === r; }
  if ((m = /^([\d.,]+)\s+(\S+)$/.exec(ans))) {
    var num = m[1], u = m[2].toLowerCase().replace(/s$/, ''), rr = pfNorm_(resp).replace(/\s+/g, ' ').trim(), mm = /^([\d.,]+)\s*(\S*)$/.exec(rr);
    if (!mm || !pfSame_(mm[1], num)) return false;
    return !mm[2] || mm[2].toLowerCase().replace(/s$/, '') === u;
  }
  return pfSame_(resp, ans);
}
function pf5ScoreX_(j, resp, typed) {
  var same = typed ? function (a, b) { return pf5TypedSame_(a, b); } : function (a, b) { return pfNfc_(a) === pfNfc_(b); };
  if (same(resp, j.answer)) return { x: 1, code: '' };
  var w = (j.wrong || []).filter(function (x) { return same(resp, x.answer); })[0];
  return { x: 0, code: w ? w.code : 'other' };
}
/* Sentence tiles: right if his order is the item or a listed alternative (commas ignored in alternatives; tiles cannot change
   case on screen, so alternatives compare without case). Otherwise the first rule that applies: ORDER-CAP, ORDER-PUNCT, ORDER-WORD. */
function pf5TileScore_(tiles, alts, order) {
  var j = function (a) { return a.join(' '); }, noC = function (a) { return a.filter(function (t) { return t !== ','; }); }, low = function (a) { return a.map(function (t) { return String(t).toLowerCase(); }); };
  order = (order || []).map(pfNfc_); tiles = tiles.map(pfNfc_); alts = (alts || []).map(function (a) { return a.map(pfNfc_); });   /* NFC (v6 Stage 1) */
  if (order.length !== tiles.length || j(order.slice().sort()) !== j(tiles.slice().sort())) return { x: 0, code: 'ORDER-WORD', bad: 1 };
  if (j(order) === j(tiles)) return { x: 1, code: '' };
  var altOk = (alts || []).some(function (a) { return j(low(noC(a))) === j(low(noC(order))); });
  if (altOk) return { x: 1, code: '', alt: 1 };
  var firsts = [tiles[0]].concat((alts || []).map(function (a) { return a[0]; })).map(function (t) { return String(t).toLowerCase(); });
  if (firsts.indexOf(String(order[0]).toLowerCase()) < 0) return { x: 0, code: 'ORDER-CAP' };        /* the sentence does not start with its capital tile */
  var end = tiles[tiles.length - 1];
  if (order[order.length - 1] !== end) return { x: 0, code: 'ORDER-PUNCT' };
  var base = [tiles].concat(alts || []).some(function (a) { return j(low(noC(a))) === j(low(noC(order))); });
  if (base) return { x: 0, code: 'ORDER-PUNCT' };
  return { x: 0, code: 'ORDER-WORD' };
}
/* A shuffled tile order that is not already right (seeded, so a reload shows the same screen). */
function pf5TileShuffle_(tiles, alts, seed) {
  for (var k = 0; k < 20; k++) { var o = pfShuffle_(tiles, seed + '|' + k); if (!pf5TileScore_(tiles, alts, o).x) return o; }
  return tiles.slice().reverse();
}
/* What helps me: state {check: 1-4, hints: shown so far, fastPending}. Returns the next step after an answer:
   {done, hintsNeeded (0-3 or 'not yet'), unlockedBy} or {next: 'hint'|'check', hint: 'picture'|'example'|'first_step', check: n}.
   Reading: a right Check 1 in under 3 s counts only if Check 2 (asked straight after, with no hint) is also right; if Check 2 is
   wrong the ladder carries on as if Check 1 were missed: Hint 1 → Check 3, Hint 2 → Check 4, Hint 3 → Check 2 again. */
var PF5_HINTS = ['picture', 'example', 'first_step'];
function pf5WhmNext_(st, right, ms, reading) {
  st.path = st.path || [];
  st.path.push({ check: st.check, x: right ? 1 : 0, ms: Math.round(ms || 0), hints: st.hints });
  if (st.verify) {                                          /* this answer was Check 2 asked to confirm a fast Check 1 */
    st.verify = false;
    if (right) return pf5WhmDone_(st, 0);
    st.order = [3, 4, 2]; st.hints = 1; st.check = 3; return { next: 'hint', hint: PF5_HINTS[0], check: 3 };
  }
  if (right) {
    if (reading && st.hints === 0 && st.check === 1 && Number(ms) < 3000) { st.verify = true; st.check = 2; return { next: 'check', check: 2, verify: true }; }
    return pf5WhmDone_(st, st.hints);
  }
  if (st.hints >= 3) return pf5WhmDone_(st, 'not yet');
  var order = st.order || [2, 3, 4];
  st.hints++; st.check = order[st.hints - 1];
  return { next: 'hint', hint: PF5_HINTS[st.hints - 1], check: st.check };
}
function pf5WhmDone_(st, n) { st.done = true; st.hintsNeeded = n; st.unlockedBy = n === 'not yet' || n === 0 ? 'none' : PF5_HINTS[n - 1]; return { done: true, hintsNeeded: n, unlockedBy: st.unlockedBy }; }
/* Typing check: correct characters = the longest common subsequence of what he typed and the passage (up to a little past what
   he reached); WPM = correct characters ÷ 5 per minute; accuracy = correct ÷ typed. */
function pf5Typing_(target, typed, ms) {
  typed = String(typed || '').replace(/\r/g, '').replace(/\s+/g, ' ').replace(/^ /, ''); target = String(target || '');
  var t = target.slice(0, typed.length + 12), n = typed.length, m = t.length, prev = new Array(m + 1).fill(0), cur, i, j2;
  for (i = 1; i <= n; i++) { cur = new Array(m + 1).fill(0); for (j2 = 1; j2 <= m; j2++) cur[j2] = typed.charAt(i - 1) === t.charAt(j2 - 1) ? prev[j2 - 1] + 1 : Math.max(prev[j2], cur[j2 - 1]); prev = cur; }
  var correct = n ? prev[m] : 0, min = Math.max(0.25, Math.min(1, (Number(ms) || PF5.TYPE_MS) / 60000));
  return { typed: n, correct: correct, wpm: Math.round(correct / 5 / min * 10) / 10, accuracy: n ? Math.round(correct / n * 1000) / 1000 : 0, minutes: Math.round(min * 100) / 100 };
}
/* Oral reading (PF-P4 norms and flag rules). Pure: no screen records a reading until Stage C. season from the date
   (Winter from 12-01, Spring from 03-16, else Fall). Returns WCPM, accuracy, the norms used and the flag. */
function pf5SeasonOf_(d) {   /* 0 fall, 1 winter (from 12-01), 2 spring (from 03-16); August starts a new fall */
  d = new Date(d); var md = (d.getMonth() + 1) * 100 + d.getDate(), w = PF_ORF.season_cutoffs || {};
  var wf = Number(String(w.winter_from || '12-01').replace('-', '')), sf = Number(String(w.spring_from || '03-16').replace('-', ''));
  if (md >= wf || md < sf) return 1; if (md < 801) return 2; return 0;
}
function pf5Orf_(grade, date, wordsRead, errors, seconds, readingLevel) {
  var sec = Number(seconds) || 60;
  var wcpm = Math.round((Math.max(0, wordsRead - errors)) * 60 / sec), acc = wordsRead > 0 ? Math.round((wordsRead - errors) / wordsRead * 1000) / 1000 : 0;
  return pf5OrfJudge_(grade, date, wcpm, acc, readingLevel);
}
/* the norms and flag rules for one WCPM and accuracy (split out of pf5Orf_ in v6 Stage 2 so the two-passage average uses the same rules) */
function pf5OrfJudge_(grade, date, wcpm, acc, readingLevel) {
  var s = pf5SeasonOf_(date), N = (PF_ORF.norms || {})[String(grade)] || null;
  var out = { wcpm: wcpm, accuracy: acc, season: ['fall', 'winter', 'spring'][s], p50: N ? N.p50[s] : null, p25: N ? N.p25[s] : null, flag: 'none', lines: [] };
  if (!N || out.p50 == null) { out.flag = 'no norm'; return out; }
  var R = PF_ORF.rules || {};
  if (wcpm < out.p25 || acc < (R.strong_flag_accuracy_below || 0.9)) { out.flag = 'strong'; out.lines.push(wcpm < out.p25 ? 'below the 25th percentile' : 'accuracy under 90%'); }
  else if (wcpm <= out.p50 - (R.flag_below_p50_by || 10)) { out.flag = 'look closer'; out.lines.push('10 or more words below the 50th percentile'); }
  if (wcpm >= out.p50 && readingLevel != null && readingLevel - 1 <= grade - 2)   /* ladder Level L is grade L-1 */
    out.lines.push('Fluent but comprehension is low: the gap is understanding.');
  out.below25 = wcpm < out.p25;
  return out;
}
/* Addendum E 7 (v6 Stage 2): when the first WCPM is within 10 words of the 25th or the 50th percentile line for his grade and season,
   he reads the Form B passage too and WCPM = the average of the two. Rapid naming and the word list are unchanged. Pure; the
   recording screen comes with v5 Stage C. a, b: {words, errors, seconds}; b may be missing (then needsB says whether to ask). */
var PF5_ORF_NEAR = 10;
function pf5OrfNeedsB_(o) { return !!(o && o.p25 != null && o.p50 != null && (Math.abs(o.wcpm - o.p25) <= PF5_ORF_NEAR || Math.abs(o.wcpm - o.p50) <= PF5_ORF_NEAR)); }
function pf5OrfPair_(grade, date, a, b, readingLevel) {
  var A = pf5Orf_(grade, date, a.words, a.errors, a.seconds, readingLevel), need = pf5OrfNeedsB_(A);
  if (!need || !b) { A.needsB = need; A.forms = 1; return A; }
  var B = pf5Orf_(grade, date, b.words, b.errors, b.seconds, readingLevel), w = (Number(a.words) || 0) + (Number(b.words) || 0);
  var acc = w > 0 ? Math.round((w - (Number(a.errors) || 0) - (Number(b.errors) || 0)) / w * 1000) / 1000 : 0;
  var out = pf5OrfJudge_(grade, date, Math.round((A.wcpm + B.wcpm) / 2), acc, readingLevel);
  out.needsB = true; out.forms = 2; out.wcpmA = A.wcpm; out.wcpmB = B.wcpm; return out;
}

/* ================================================================== WHO SEES WHAT */
function pf5IsStop_(k) { return PF5.STOPS.indexOf(k) >= 0; }
function pf5Grade_(S) { return S.grade === '' || S.grade == null ? null : Number(S.grade); }
/* his Reading / Math level: this Pathfinder's result first, then his placement */
function pf5LevelOf_(S, subj) {
  var sec = S.state.sections[subj]; if (sec && sec.result && sec.result.level) return sec.result.level;
  try { var p = (plPlacements_()[S.sid] || {})[subj]; if (p && p.level) return p.level; } catch (e) {}
  return null;
}
/* the grade a measure uses: his enrolled grade, else one below his Reading level, else grade 3 */
function pf5GradeFor_(S, lo, hi) { var g = pf5Grade_(S); if (g == null) { var rl = pf5LevelOf_(S, 'READ'); g = rl ? rl - 2 : 3; } return Math.max(lo, Math.min(hi, g)); }
function pf5Band_(g, bands) { for (var i = 0; i < bands.length; i++) { var m = /^(K|\d)-(\d)$/.exec(bands[i]), lo = m[1] === 'K' ? 0 : +m[1]; if (g >= lo && g <= +m[2]) return bands[i]; } return bands[bands.length - 1]; }
/* forms in order of his earlier results for that stop (first Pathfinder A, then B, ...) */
function pf5Prior_(sid, k) { try { return pfRows_('results').filter(function (v) { return String(v[2]) === sid && String(v[3]) === k; }).length; } catch (e) { return 0; } }
/* alternate by boy: his place in the roster (even / odd); salt shifts which pairs of boys alternate */
function pf5Alt_(sid, salt) { var ids = []; try { ids = msRoster_().map(function (r) { return r.id; }); } catch (e) {} var i = ids.indexOf(sid); if (i < 0) i = pfHash_(sid); return (salt ? Math.floor(i / 2) : i) % 2; }
/* A real (not TEST) boy is offered a stop only when every record it would use for him is Approved with no hold. */
function pf5ReadyFor_(S, k) {
  var test = pfIsTest_(S.sid), appr = test ? 0 : 1, g = pf5Grade_(S), X = pf5Ix_();
  if (k === 'MAZE' && g != null && g < 2) return false;                     /* grade 1 (and K) does not take the maze */
  if (test) return true;
  if (k === 'LANG') return pfTopLevel_('LANG', 1) > 0;
  if (k === 'MAZE') return X.mazeList.some(function (p) { return p.grade === pf5GradeFor_(S, 2, 8) && pf5Ok_(p.status, p.hold, appr); });
  if (k === 'LR') { var gg = pf5GradeFor_(S, 0, 8); return Object.keys(X.lr).every(function (id) { var p = X.lr[id]; return Number(p.grade) !== gg || pf5Ok_(p.status, p.hold, appr); }) && Object.keys(X.lrItems).every(function (id) { var j = X.lrItems[id]; return Number(j.grade) !== gg || pf5Ok_(j.status, j.hold, appr); }); }
  if (k === 'COMP') return X.comp.every(function (j) { return pf5Ok_(j.status, j.hold, appr); }) && pf5FileStatus_(PF_X) === 'Approved';
  if (k === 'LIFE') return X.life.every(function (j) { return pf5Ok_(j.status, j.hold, appr); });
  if (k === 'HELP') return Object.keys(X.whm).every(function (id) { return pf5Ok_(X.whm[id].status, X.whm[id].hold, appr); });
  if (k === 'ABOUT' || k === 'WRIT') return pf5FileStatus_(k === 'ABOUT' ? PF_X : PF_W) === 'Approved';
  return false;
}
/* v5 stops he may still do in this session */
function pf5Left_(S) { return PF5.STOPS.filter(function (k) { var sec = S.state.sections[k]; return pf5ReadyFor_(S, k) && !(sec && sec.done); }).length; }
/* The road for the page: v4 stops for a real boy (unchanged), the full v5 road for a TEST boy. */
function pf5Road_(S, R) {
  if (!S || !pfIsTest_(S.sid)) return R;
  var out = {}, all = {}; PF.STOPS.concat(PF5.NEW_STOPS).forEach(function (s) { all[s[0]] = s; });
  PF5.ROAD.forEach(function (k) {
    var s = all[k], sec = S.state.sections[k], ready = PF.CORE.indexOf(k) >= 0 ? true : pf5IsStop_(k) ? pf5ReadyFor_(S, k) : false;
    if (k === 'MAZE' && !ready) { out[k] = { label: s[1], ready: false, status: 'skip', n: 0, why: 'Grade 2 and up' }; return; }
    out[k] = { label: s[1], ready: ready, status: !sec ? 'todo' : sec.done ? (sec.result ? sec.result.status : 'done') : 'going', n: sec ? (sec.ans || []).length : 0, extra: PF.CORE.indexOf(k) < 0 };
  });
  return out;
}

/* ================================================================== SERVER: open, act, finish */
function pf5Label_(k) { var s = PF.STOPS.concat(PF5.NEW_STOPS).filter(function (x) { return x[0] === k; })[0]; return s ? s[1] : k; }
function pf5Answer_(S, r, k, sec, id, skill, level, fmt, resp, sc, ms, phase) {
  sec.ans.push({ i: id, x: sc.x, c: sc.code || '', t: Math.round(Number(ms) || 0), r: 0, k: 0, f: '', ph: phase || '', at: Date.now() });
  sec.last = Date.now();
  pfTab_('answers').appendRow([new Date(), S.id, r.id, k, sec.ans.length - 1, id, skill || '', '', level || '', fmt, String(resp).slice(0, 200), sc.x, sc.code || '', Math.round(Number(ms) || 0), 0, 0, '', '', '', phase || 'v5', 'draft']);
}
function pf5New_(S, r, k, now) {
  var g = pf5Grade_(S), X = pf5Ix_(), sec = { v5: 1, k: k, ans: [], started: now, last: now, done: false, step: 'intro' };
  if (k === 'MAZE') {
    var mg = pf5GradeFor_(S, 2, 8), forms = ['A', 'B', 'C', 'D'], form = forms[pf5Prior_(r.id, 'MAZE') % 4];
    var p = X.mazeList.filter(function (x) { return x.grade === mg && x.form === form; })[0];
    sec.pid = p.passage_id; sec.grade = mg; sec.form = form; sec.picks = {};
  } else if (k === 'LR') {
    var lg = pf5GradeFor_(S, 0, 8), lf = ['A', 'B'][pf5Prior_(r.id, 'LR') % 2];
    sec.grade = lg; sec.form = lf; sec.order = pf5Alt_(r.id, 0) === 0 ? 'listen-first' : 'read-first'; sec.voice = PF5.VOICE;
    sec.parts = pf5LrParts_(lg, lf, sec.order); sec.pi = 0; sec.qi = 0; sec.step = 'intro';
  } else if (k === 'COMP' || k === 'LIFE') {
    var xf = ['A', 'B'][pf5Prior_(r.id, k) % 2], list = (k === 'COMP' ? X.comp : X.life).filter(function (j) { return j.form === xf; });
    list.sort(function (a, b) { return a.level - b.level; });
    sec.form = xf; sec.list = list.map(function (j) { return j.item_id; }); sec.qi = 0; sec.res = [];
    if (k === 'COMP') { var tg = g == null ? pf5GradeFor_(S, 0, 8) : g; sec.band = pf5Band_(Math.max(2, tg), Object.keys(PF_X.typing)); sec.typeOptional = tg <= 1; }
  } else if (k === 'HELP') {
    var subj = pf5Alt_(r.id, 1) === 0 ? 'MATH' : 'READ', base = pf5LevelOf_(S, subj) || (g != null ? g + 1 : 3), lvl = Math.max(1, Math.min(9, base + 1));
    var seq = Object.keys(X.whm).map(function (id) { return X.whm[id]; }).filter(function (s) { return s.skill_id.indexOf(subj + '.') === 0 && plMathLevel_(s.skill_id) === lvl; })[0];
    sec.subj = subj; sec.level = lvl; sec.base = base; sec.skill = seq.skill_id; sec.st = { check: 1, hints: 0 }; sec.step = 'teach';
  } else if (k === 'ABOUT') {
    sec.screen = 0; sec.answers = {};
  } else if (k === 'WRIT') {
    var wg = pf5GradeFor_(S, 0, 8), band = pf5Band_(wg, Object.keys(PF_W.tiles)), wf = ['A', 'B'][pf5Prior_(r.id, 'WRIT') % 2];
    sec.band = band; sec.form = wf; sec.step = 'practice'; sec.pi = 0; sec.pright = 0; sec.ti = 0; sec.tres = [];
  }
  return sec;
}
function pf5LrParts_(g, form, order) {
  var modes = order === 'listen-first' ? ['listen', 'read'] : ['read', 'listen'];
  return modes.map(function (m) { var pid = 'PF.LR.G' + g + '.' + (m === 'listen' ? 'L' : 'R') + '.' + form;
    return { grade: g, mode: m, pid: pid, qs: (PF_LR.items || []).filter(function (j) { return j.passage === pid; }).map(function (j) { return j.item_id; }), plays: 0, score: null }; });
}
/* pfOpen hands a v5 stop here (inside the lock). */
function pf5Open_(S, r, k, now) {
  if (!pf5ReadyFor_(S, k)) throw new Error('That part of the road opens later.');
  var sec = S.state.sections[k], extra = {};
  if (sec && sec.done) throw new Error('This part is finished.');
  if (!sec) { sec = S.state.sections[k] = pf5New_(S, r, k, now); extra.reveal = k; }
  S.state.cursec = k;
  if (k === 'MAZE' && sec.step === 'run' && now - sec.start > PF5.MAZE_MS + PF5.MAZE_GRACE_MS) return pf5Finish_(S, r, k, pf5MazeResult_(sec, now), extra);   /* he left during the maze: score what was saved */
  pfSaveSession_(S);
  return pfView_(S, r, extra);
}
/* One action on a v5 stop. p = {k, act, ...}. Every answer is saved at once. */
function pf5Act(token, p) {
  var r = pfMe_(token); p = p || {};
  return pfLock_(function () {
    var S = pfActive_(r.id), now = Date.now(); if (!S) throw new Error('Please start again.');
    var k = String(p.k || ''), sec = S.state.sections[k];
    if (!sec || sec.done || S.state.cursec !== k) return pfView_(S, r, { stale: true });
    S.state.sit.last = now;
    var res = pf5Do_(S, r, k, sec, p, now);
    if (res && res.finish) return pf5Finish_(S, r, k, res.finish, {});
    pfSaveSession_(S);
    return pfView_(S, r, res && res.extra || {});
  });
}
function pf5Do_(S, r, k, sec, p, now) {
  var X = pf5Ix_(), a = String(p.act || ''), ms = Math.max(0, Number(p.ms) || 0);
  if (k === 'MAZE') {
    var P = X.maze[sec.pid];
    if (a === 'start' && sec.step === 'intro') { sec.step = 'run'; sec.start = now; return; }
    if (sec.step !== 'run') return;
    var lim = PF5.MAZE_MS + PF5.MAZE_GRACE_MS;
    (p.picks || []).forEach(function (q) { var c = P.choices[Number(q.n) - 1]; if (!c || c.options.indexOf(String(q.o)) < 0 || Number(q.ms) > lim) return; sec.picks[c.n] = { o: String(q.o), ms: Math.round(Number(q.ms) || 0) }; });
    if (a === 'done' || now - sec.start > lim) return { finish: pf5MazeResult_(sec, now, Number(p.ms)) };
    return;
  }
  if (k === 'LR') {
    var part = sec.parts[sec.pi];
    if (a === 'begin' && sec.step === 'intro') { sec.step = 'passage'; return; }
    if (a === 'play' && sec.step === 'passage' && part.mode === 'listen') { if (part.plays >= 2) return { extra: { note: 'played' } }; part.plays++; if (part.plays === 2) part.replay = 1; return; }
    if (a === 'ready' && sec.step === 'passage') { if (part.mode === 'listen' && !part.plays) return; sec.step = 'q'; sec.qi = 0; return; }
    if (a === 'answer' && sec.step === 'q') {
      var qid = part.qs[sec.qi]; if (String(p.item) !== qid) return { extra: { stale: true } };
      var j = X.lrItems[qid], sc = pf5ScoreX_(j, String(p.value), false);
      pf5Answer_(S, r, k, sec, qid, j.skill, j.grade, 'CHOICE', p.value, sc, ms, part.mode + (sec.pi >= 2 ? '-confirm' : ''));
      sec.qi++;
      if (sec.qi < part.qs.length) return;
      part.score = sec.ans.slice(-part.qs.length).filter(function (x) { return x.x; }).length;
      sec.pi++; sec.qi = 0;
      if (sec.pi === 2) {                                                    /* both of his grade's passages done: profile, maybe confirm */
        var sc2 = pf5LrScores_(sec.parts.slice(0, 2)), cand = pf5ProfileRules_(sc2.listen, sc2.read, null);
        if (cand.length && sec.grade >= 1) { sec.parts = sec.parts.concat(pf5LrParts_(sec.grade - 1, sec.form, sec.order)); sec.confirming = 1; sec.step = 'confirm'; return; }
        return { finish: pf5LrResult_(sec) };
      }
      if (sec.pi >= sec.parts.length) return { finish: pf5LrResult_(sec) };
      sec.step = 'passage'; return;
    }
    if (a === 'go' && sec.step === 'confirm') { sec.step = 'passage'; return; }
    return;
  }
  if (k === 'COMP' || k === 'LIFE') {
    if (a === 'begin' && sec.step === 'intro') { sec.step = 'q'; return; }
    if (a === 'answer' && sec.step === 'q') {
      var id = sec.list[sec.qi]; if (String(p.item) !== id) return { extra: { stale: true } };
      var jx = X.x[id], typed = !!jx.typed, scx = pf5ScoreX_(jx, String(p.value), typed);
      pf5Answer_(S, r, k, sec, id, jx.skill_id, jx.level, typed ? 'TYPE' : 'CHOICE', p.value, scx, ms, 'level-order');
      sec.res.push({ level: jx.level, x: scx.x }); sec.qi++;
      if (pf5StopNow_(sec.res) || sec.qi >= sec.list.length) {
        if (k === 'COMP') { sec.step = 'typing'; return; }
        return { finish: pf5XResult_(sec, k) };
      }
      return;
    }
    if (k === 'COMP' && sec.step === 'typing') {
      if (a === 'typestart') { sec.typeStart = now; return; }
      if (a === 'typeskip' && sec.typeOptional) { sec.typing = { skipped: 1 }; return { finish: pf5XResult_(sec, k) }; }
      if (a === 'typedone' && sec.typeStart) { var el = Math.min(now - sec.typeStart + 2000, Math.max(ms, 1000)); sec.typing = pf5Typing_(PF_X.typing[sec.band][sec.form], String(p.text || '').slice(0, 1200), Math.min(el, PF5.TYPE_MS)); sec.typing.band = sec.band; sec.typing.text = String(p.text || '').slice(0, 600); return { finish: pf5XResult_(sec, k) }; }
    }
    return;
  }
  if (k === 'HELP') {
    var seq = X.whm[sec.skill];
    if (a === 'next' && (sec.step === 'teach' || sec.step === 'hint')) { sec.step = 'check'; sec.shownAt = now; return; }
    if (a === 'answer' && sec.step === 'check') {
      var ch = seq.checks[sec.st.check - 1], cid = sec.skill + '.C' + ch.n;
      if (String(p.item) !== cid) return { extra: { stale: true } };
      var sch = ch.wrong ? pf5ScoreX_(ch, String(p.value), false) : (pfSame_(String(p.value), ch.answer) ? { x: 1, code: '' } : { x: 0, code: 'other' });
      pf5Answer_(S, r, k, sec, cid, sec.skill, sec.level, ch.wrong ? 'CHOICE' : 'TYPE', p.value, sch, ms, 'check ' + ch.n + ' after ' + sec.st.hints + ' hints');
      var nx = pf5WhmNext_(sec.st, !!sch.x, ms, sec.subj === 'READ');
      if (nx.done) return { finish: pf5WhmResult_(sec) };
      sec.step = nx.next; return;
    }
    return;
  }
  if (k === 'ABOUT') {
    var scr = pf5AboutScreens_()[sec.screen]; if (!scr || a !== 'answer' || String(p.id) !== scr.id) return;
    var vals = (p.values || []).map(String);
    if (scr.id === 'feel') { var o = {}; scr.options.forEach(function (s, i) { var f = String((p.values || [])[i] || ''); if (PF5.FACES.some(function (x) { return x[0] === f; })) o[s] = f; }); sec.answers.feel = o; }
    else { vals = vals.filter(function (v) { return scr.options.indexOf(v) >= 0; }); if (scr.id === 'better') vals = vals.slice(0, 2); sec.answers[scr.id] = vals; }
    sec.ans.push({ i: 'ABOUT.' + scr.id, x: 1, c: '', t: Math.round(ms), r: 0, k: 0, f: '', at: now });
    sec.screen++;
    if (sec.screen >= pf5AboutScreens_().length) return { finish: pf5AboutResult_(sec) };
    return;
  }
  if (k === 'WRIT') {
    if (sec.step === 'practice' && a === 'tiles') {
      var pr = PF5.TILE_PRACTICE[sec.pi], ok = pf5TileScore_(pr, [], p.order || []).x;
      sec.ans.push({ i: 'TILES.P' + (sec.pi + 1), x: ok, c: '', t: Math.round(ms), r: 0, k: 0, f: '', ph: 'practice', at: now });
      if (ok) sec.pright++; sec.pi++;
      if (sec.pi < 3) return { extra: { practiceOk: !!ok } };
      if (sec.pright < 2) return { finish: pf5TilesResult_(sec) };            /* practice gate not passed: no scored tiles */
      sec.step = 'tiles'; return { extra: { practiceOk: !!ok } };
    }
    if (sec.step === 'tiles' && a === 'tiles') {
      var tid = sec.band + '.' + sec.form + '.' + (sec.ti + 1), T = X.tiles[tid]; if (String(p.item) !== tid) return { extra: { stale: true } };
      var st = pf5TileScore_(T.tiles, T.alts, p.order || []);
      pf5Answer_(S, r, k, sec, 'PF.W.TILES.' + tid, 'WRIT.SENT', '', 'ORDER', (p.order || []).join(' '), st, ms, 'tiles');
      sec.tres.push({ id: tid, x: st.x, code: st.code, alt: st.alt ? 1 : 0 }); sec.ti++;
      if (sec.ti >= 3) return { finish: pf5TilesResult_(sec) };
      return;
    }
    return;
  }
}
function pf5MazeResult_(sec, now, clientMs) {
  var P = pf5Ix_().maze[sec.pid], el = Math.min(now - sec.start, clientMs > 0 ? clientMs : now - sec.start), sc = pf5MazeScore_(P, sec.picks, el);
  return { status: 'done', level: '', detail: { kind: 'maze', passage: sec.pid, grade: sec.grade, form: sec.form, correct: sc.correct, incorrect: sc.incorrect, syntax: sc.syntax, meaning: sc.meaning, score: sc.score, perMin: sc.perMin, last: sc.last, skipped: sc.skipped, attempted: sc.attempted, total: sc.total, ms: sc.ms, finishedEarly: sc.finishedEarly },
    errors: sc.codes, flags: [] };
}
function pf5LrScores_(parts) { var o = {}; parts.forEach(function (p) { o[p.mode] = p.score; }); return o; }
function pf5LrResult_(sec) {
  var first = pf5LrScores_(sec.parts.slice(0, 2)), conf = sec.parts.length > 2 ? pf5LrScores_(sec.parts.slice(2, 4)) : null;
  var cand = pf5ProfileRules_(first.listen, first.read, null), fin = cand.length ? pf5ProfileFinal_(first, conf, null) : { flags: { decoding_barrier: false, language_barrier: false, listening_low: false }, confirmed: [], candidates: [], lines: [] };
  var errs = {}; sec.ans.forEach(function (a) { if (!a.x && a.c && a.c !== 'other') errs[a.c] = (errs[a.c] || 0) + 1; });
  return { status: 'done', level: '', errors: errs, flags: fin.lines,
    detail: { kind: 'lr', grade: sec.grade, form: sec.form, order: sec.order, voice: sec.voice, listen: first.listen, read: first.read, replays: sec.parts.filter(function (p) { return p.mode === 'listen' && p.plays > 1; }).length,
      plays: sec.parts.map(function (p) { return p.mode === 'listen' ? p.plays : null; }), confirm: conf ? { grade: sec.grade - 1, listen: conf.listen, read: conf.read } : null,
      decoding_barrier: fin.flags.decoding_barrier, language_barrier: fin.flags.language_barrier, listening_low: fin.flags.listening_low, candidates: fin.candidates, confirmed: fin.confirmed } };
}
function pf5XResult_(sec, k) {
  var lvl = pf5LevelRule_(sec.res), errs = {}; sec.ans.forEach(function (a) { if (!a.x && a.c && a.c !== 'other') errs[a.c] = (errs[a.c] || 0) + 1; });
  var d = { kind: k === 'COMP' ? 'computing' : 'money', form: sec.form, asked: sec.res.length, right: sec.res.filter(function (x) { return x.x; }).length, stoppedEarly: sec.res.length < sec.list.length, byLevel: sec.res };
  if (k === 'COMP') d.typing = sec.typing || null;
  return { status: 'done', level: lvl, errors: errs, flags: [], detail: d };
}
function pf5WhmResult_(sec) {
  var st = sec.st, seq = pf5Ix_().whm[sec.skill];
  return { status: 'done', level: sec.level, errors: {}, flags: [], detail: { kind: 'whm', subject: sec.subj, skill: sec.skill, name: seq.name, level: sec.level, from: sec.base, hints_needed: st.hintsNeeded, unlocked_by: st.unlockedBy, path: st.path } };
}
function pf5AboutScreens_() { return (PF_X.about_me || []).filter(function (s) { return s.id !== 'family'; }); }
function pf5AboutResult_(sec) { return { status: 'done', level: '', errors: {}, flags: [], detail: { kind: 'about', answers: sec.answers } }; }
function pf5TilesResult_(sec) {
  var codes = {}; (sec.tres || []).forEach(function (t) { if (t.code) codes[t.code] = (codes[t.code] || 0) + 1; });
  var passed = sec.pright >= 2;
  return { status: passed ? 'done' : 'practice', level: '', errors: codes, flags: passed ? [] : ['Did not pass the tile practice (' + sec.pright + ' of 3): check he can drag tiles before reading anything into this.'],
    detail: { kind: 'tiles', band: sec.band, form: sec.form, practice: sec.pright, right: (sec.tres || []).filter(function (t) { return t.x; }).length, of: (sec.tres || []).length, items: sec.tres || [] } };
}
/* A v5 stop ends: one PF_Results row (detail in detail_json), no placement change, no pay. */
function pf5Finish_(S, r, k, res, extra) {
  extra = extra || {};
  var sec = S.state.sections[k]; sec.done = true; sec.step = 'done'; S.state.cursec = null;
  pfTab_('results').appendRow([new Date(), S.id, r.id, k, res.status, res.level === '' ? '' : res.level, '', '', '', '{}', '', JSON.stringify(res.strands || {}), '[]', '[]', JSON.stringify(res.errors || {}), JSON.stringify(res.flags || []), (sec.ans || []).length, 'no', 'pathfinder', JSON.stringify(res.detail || {}).slice(0, 45000)]);
  sec.result = { status: res.status, level: res.level, v5: 1 };
  pfBadge_(S, 'explorer-' + k);
  pfSaveSession_(S);
  extra.finished = { section: k, label: pf5Label_(k), status: res.status, coreDone: false, jar: 0, finish: 0, v5: 1 };
  return pfView_(S, r, extra);
}

/* ================================================================== WHAT THE PAGE SEES (never an answer key) */
function pf5Sanitize_(s) { return String(s == null ? '' : s); }
/* "Listen: ..." text is spoken only: the screen shows what comes before it, the speech gets the rest */
function pf5Listen_(stem) { var m = /^(.*?)Listen:\s*([\s\S]*)$/.exec(String(stem)); return m ? { show: (m[1] + 'Listen.').trim(), say: m[2] } : { show: String(stem), say: '' }; }
function pf5View_(S) {
  var k = S.state.cursec, sec = k && S.state.sections[k]; if (!sec || !sec.v5 || sec.done) return null;
  var X = pf5Ix_(), v = { k: k, step: sec.step, label: pf5Label_(k), draft: true };
  if (k === 'MAZE') {
    var P = X.maze[sec.pid]; v.grade = sec.grade;
    if (sec.step === 'run') { v.left = Math.max(0, PF5.MAZE_MS - (Date.now() - sec.start)); v.title = P.title; v.first = P.first_sentence; v.tokens = P.tokens;
      v.choices = P.choices.map(function (c) { return { n: c.n, i: c.token_index, b: c.before, a: c.after, o: c.options.slice() }; }); v.picks = sec.picks; }
  } else if (k === 'LR') {
    var part = sec.parts[sec.pi]; v.mode = part ? part.mode : ''; v.confirming = !!sec.confirming && sec.pi >= 2; v.order = sec.order; v.voice = sec.voice; v.partN = sec.pi + 1; v.parts = sec.parts.length;
    if (part) { var Pp = X.lr[part.pid]; v.title = Pp.title; v.plays = part.plays; v.replayLeft = part.mode === 'listen' ? Math.max(0, 2 - part.plays) : 0;
      v.text = Pp.text;                                                       /* listening: only for the speech voice; the page never draws it */
      if (sec.step === 'q') { var j = X.lrItems[part.qs[sec.qi]]; v.q = { id: j.item_id, stem: j.stem, n: sec.qi + 1, of: part.qs.length, choices: pfShuffle_([j.answer].concat(j.wrong.map(function (w) { return w.answer; })), j.item_id + '|' + S.id) }; } }
  } else if (k === 'COMP' || k === 'LIFE') {
    if (sec.step === 'q') { var jx = X.x[sec.list[sec.qi]]; v.q = { id: jx.item_id, stem: jx.stem, level: jx.level, n: sec.qi + 1, typed: !!jx.typed, money: !!jx.typed && /[$¢]/.test(jx.answer) };
      if (!jx.typed) v.q.choices = pfShuffle_([jx.answer].concat(jx.wrong.map(function (w) { return w.answer; })), jx.item_id + '|' + S.id); }
    if (sec.step === 'typing') { v.typing = { text: PF_X.typing[sec.band][sec.form], band: sec.band, optional: !!sec.typeOptional, started: !!sec.typeStart, ms: PF5.TYPE_MS }; }
  } else if (k === 'HELP') {
    var seq = X.whm[sec.skill]; v.name = seq.name; v.subject = sec.subj;
    if (sec.step === 'teach') { var tl = pf5Listen_(seq.teach); v.teach = tl.show; v.teachSay = tl.say || seq.teach; }
    if (sec.step === 'hint') { var hk = PF5_HINTS[sec.st.hints - 1]; v.hint = { kind: hk, n: sec.st.hints, text: seq.hints[hk], picture: hk === 'picture' }; }
    if (sec.step === 'check') { var ch = seq.checks[sec.st.check - 1], L = pf5Listen_(ch.stem); v.q = { id: sec.skill + '.C' + ch.n, stem: L.show, listen: L.say, n: ch.n, typed: !ch.wrong };
      if (ch.wrong) v.q.choices = pfShuffle_([ch.answer].concat(ch.wrong.map(function (w) { return w.answer; })), v.q.id + '|' + S.id); }
  } else if (k === 'ABOUT') {
    var scr = pf5AboutScreens_()[sec.screen]; v.screen = { id: scr.id, text: scr.screen, type: scr.type, options: scr.options, n: sec.screen + 1, of: pf5AboutScreens_().length }; v.faces = PF5.FACES;
  } else if (k === 'WRIT') {
    v.band = sec.band;
    if (sec.step === 'practice') { var pr = PF5.TILE_PRACTICE[sec.pi]; v.tiles = { id: 'P' + (sec.pi + 1), n: sec.pi + 1, of: 3, practice: true, tiles: pf5TileShuffle_(pr, [], 'P' + sec.pi + '|' + S.id) }; }
    if (sec.step === 'tiles') { var tid = sec.band + '.' + sec.form + '.' + (sec.ti + 1), T = X.tiles[tid]; v.tiles = { id: tid, n: sec.ti + 1, of: 3, tiles: pf5TileShuffle_(T.tiles, T.alts, tid + '|' + S.id) }; }
  }
  return v;
}

/* ================================================================== STAFF: the About me family box (staff or parent only) */
/* Kept in its own tab PF_Notes; never shown to the boy, never in the writing tab, never sent to Claude. */
function pfAboutFamily(token, sid, text) {
  var s = pfStaff_(token); sid = String(sid || ''); text = String(text || '').slice(0, 2000);
  if (!msRoster_().some(function (x) { return x.id === sid; })) throw new Error('That boy is not on the list.');
  return pfLock_(function () { pfTab_('notes').appendRow([new Date(), sid, pfWho_(s), 'about-family', text]); return pfReport(token, sid); });
}
function pf5Notes_(sid) { try { return pfRows_('notes').filter(function (v) { return String(v[1]) === sid; }).map(function (v) { return { at: new Date(v[0]).getTime(), by: String(v[2]), kind: String(v[3]), text: String(v[4]) }; }); } catch (e) { return []; } }

/* ================================================================== SELF-TEST (called by pfSelfTest) */
function pf5SelfTest_() {
  var X = pf5Ix_(), out = { version: PF5.VERSION, problems: [] }, P = out.problems, ids = {};
  var dup = function (id, where) { if (!id) P.push(where + ': record with no id'); else if (ids[id]) P.push('duplicate id ' + id); ids[id] = 1; };
  PF_BANK.items.forEach(function (it) { ids[it.id] = 1; });
  var codeOk = function (c) { return !!(PF_BANK.codes || {})[c] || !!X.codes[c]; };
  var chk = function (id, ans, wrong, where, allowNoWrong) {
    dup(id, where); if (ans == null || ans === '') P.push(id + ': no answer');
    if (!wrong || !wrong.length) { if (!allowNoWrong) P.push(id + ': no coded wrong answers'); return; }
    wrong.forEach(function (w) { if (!w.code || !codeOk(w.code)) P.push(id + ': undefined code ' + w.code); if (pfNfc_(w.answer) === pfNfc_(ans)) P.push(id + ': a wrong answer equals the answer'); });
  };
  /* Language Arts */
  out.LANG = { items: X.la.length, skills: Object.keys(X.laSkills).length, draft: X.la.filter(function (i) { return i.status !== 'Approved'; }).length, codes: Object.keys(PF_LA.codes).length };
  X.la.forEach(function (it) { chk(it.id, it.ans, it.wrong.map(function (w) { return { answer: w[0], code: w[1] }; }), 'LANG'); if (pfScore_(it, it.ans).x !== 1) P.push(it.id + ': its own answer does not score right'); if ((it.level <= 2) !== (it.wrong.length === 2)) P.push(it.id + ': Levels 1-2 need 3 choices, 3-9 need 4'); });
  if (X.la.length !== 102) P.push('LANG: expected 102 questions, found ' + X.la.length);
  out.LANG.simulation = pfSimulate_(200, 'LANG', 13);
  /* maze */
  var mz = function (f) { return { passages: f.passages.length, choices: f.passages.reduce(function (s, p) { return s + p.choices.length; }, 0) }; };
  out.MAZE = { AB: mz(PF_MAZE_AB), CD: mz(PF_MAZE_CD) };
  if (out.MAZE.AB.passages !== 14 || out.MAZE.AB.choices !== 495) P.push('maze A/B: expected 14 / 495, found ' + out.MAZE.AB.passages + ' / ' + out.MAZE.AB.choices);
  if (out.MAZE.CD.passages !== 14 || out.MAZE.CD.choices !== 467) P.push('maze C/D: expected 14 / 467 (LOG 2309), found ' + out.MAZE.CD.passages + ' / ' + out.MAZE.CD.choices);
  X.mazeList.forEach(function (p) { dup(p.passage_id, 'maze'); p.choices.forEach(function (c) { var cid = p.passage_id + '.' + c.n; if (c.options.length !== 3 || c.options.indexOf(c.answer) < 0) P.push(cid + ': needs 3 options including the answer'); chk(cid, c.answer, c.wrong, 'maze');
    if (String(p.tokens[c.token_index]).replace(/^\W+|\W+$/g, '') !== String(c.before + c.answer + c.after).replace(/^\W+|\W+$/g, '')) P.push(cid + ': answer does not match its place in the text'); }); });
  for (var g = 2; g <= 8; g++) ['A', 'B', 'C', 'D'].forEach(function (f) { if (!X.mazeList.some(function (p) { return p.grade === g && p.form === f; })) P.push('maze: no grade ' + g + ' form ' + f); });
  /* listening / reading pairs */
  out.LR = { passages: Object.keys(X.lr).length, questions: Object.keys(X.lrItems).length };
  if (out.LR.passages !== 36 || out.LR.questions !== 180) P.push('pairs: expected 36 / 180, found ' + out.LR.passages + ' / ' + out.LR.questions);
  Object.keys(X.lr).forEach(function (id) { dup(id, 'pairs'); var n = Object.keys(X.lrItems).filter(function (q) { return X.lrItems[q].passage === id; }).length; if (n !== 5) P.push(id + ': ' + n + ' questions (5 expected)'); });
  Object.keys(X.lrItems).forEach(function (id) { var j = X.lrItems[id]; chk(id, j.answer, j.wrong, 'pairs'); if (!X.lr[j.passage]) P.push(id + ': missing passage'); });
  for (var g2 = 0; g2 <= 8; g2++) ['A', 'B'].forEach(function (f) { ['L', 'R'].forEach(function (m) { if (!X.lr['PF.LR.G' + g2 + '.' + m + '.' + f]) P.push('pairs: no PF.LR.G' + g2 + '.' + m + '.' + f); }); });
  /* Computing, Life and Money, What helps me */
  out.COMP = { questions: X.comp.length }; out.LIFE = { questions: X.life.length, typed: X.life.filter(function (j) { return j.typed; }).length };
  if (X.comp.length !== 32) P.push('computing: expected 32, found ' + X.comp.length);
  if (X.life.length !== 32) P.push('money: expected 32, found ' + X.life.length);
  X.comp.concat(X.life).forEach(function (j) { chk(j.item_id, j.answer, j.wrong, 'X'); var s = pf5ScoreX_(j, j.answer, !!j.typed); if (s.x !== 1) P.push(j.item_id + ': its own answer does not score right');
    j.wrong.forEach(function (w) { var t = pf5ScoreX_(j, w.answer, !!j.typed); if (t.x || t.code !== w.code) P.push(j.item_id + ': wrong answer "' + w.answer + '" scores ' + (t.x ? 'right' : t.code)); }); });
  ['COMP', 'LIFE'].forEach(function (k) { var L = k === 'COMP' ? X.comp : X.life; for (var lv = 2; lv <= 9; lv++) ['A', 'B'].forEach(function (f) { var n = L.filter(function (j) { return j.level === lv && j.form === f; }).length; if (n !== 2) P.push(k + ' Level ' + lv + ' form ' + f + ': ' + n + ' questions (2 expected)'); }); });
  var whm = Object.keys(X.whm); out.HELP = { sequences: whm.length, checks: whm.reduce(function (s, id) { return s + X.whm[id].checks.length; }, 0) };
  if (whm.length !== 18 || out.HELP.checks !== 72) P.push('What helps me: expected 18 x 4 checks, found ' + whm.length + ' / ' + out.HELP.checks);
  whm.forEach(function (id) { var s = X.whm[id]; PF5_HINTS.forEach(function (h) { if (!s.hints[h]) P.push(id + ': no ' + h + ' hint'); }); s.checks.forEach(function (c) { chk(id + '.C' + c.n, c.answer, c.wrong, 'WHM', id.indexOf('MATH.') === 0); }); });
  ['MATH', 'READ'].forEach(function (sj) { for (var lv = 1; lv <= 9; lv++) if (!whm.some(function (id) { return id.indexOf(sj + '.') === 0 && plMathLevel_(id) === lv; })) P.push('What helps me: no ' + sj + ' sequence at Level ' + lv); });
  out.ABOUT = { screens: (PF_X.about_me || []).length, boyScreens: pf5AboutScreens_().length };
  if (out.ABOUT.screens !== 5) P.push('About me: expected 5 screens');
  /* Writing content used in Stage A (tiles) and the counts for the rest of PF-W1 */
  var tl = Object.keys(X.tiles); out.WRIT = { tiles: tl.length, spellingLists: Object.keys(PF_W.spelling).length, spellingWords: Object.keys(PF_W.spelling).map(function (k) { return PF_W.spelling[k].length; }), prompts: Object.keys(PF_W.prompts).reduce(function (s, b) { return s + Object.keys(PF_W.prompts[b]).length; }, 0) };
  if (tl.length !== 24) P.push('tiles: expected 24, found ' + tl.length);
  if (out.WRIT.spellingLists !== 4 || out.WRIT.spellingWords.some(function (n) { return n !== 26; })) P.push('spelling: expected 4 x 26');
  if (out.WRIT.prompts !== 6) P.push('prompts: expected 6');
  tl.forEach(function (id) { var T = X.tiles[id]; dup('PF.W.TILES.' + id, 'tiles'); if (!/^[A-Z]/.test(T.tiles[0]) || !/^[.?!]$/.test(T.tiles[T.tiles.length - 1])) P.push(id + ': must start with a capital tile and end with an end mark');
    if (!pf5TileScore_(T.tiles, T.alts, T.tiles).x) P.push(id + ': its own order is not right'); T.alts.forEach(function (a) { var o = a.filter(function (t) { return t !== ','; }); var lc = function (a) { return a.map(function (t) { return pfNfc_(t).toLowerCase(); }).sort().join('|'); }; if (lc(o) !== lc(T.tiles.filter(function (t) { return t !== ','; }))) P.push(id + ': alternative uses other tiles'); });
    if (pf5TileScore_(T.tiles, T.alts, pf5TileShuffle_(T.tiles, T.alts, 'x')).x) P.push(id + ': shuffle left it right'); });
  ['ORDER-WORD', 'ORDER-CAP', 'ORDER-PUNCT', 'MAZE-SYNTAX', 'MAZE-MEANING', 'ORF-SUB', 'ORF-OMIT', 'ORF-HES', 'ORF-SC', 'ORF-INS'].forEach(function (c) { if (!X.codes[c]) P.push('code table: ' + c + ' missing'); });
  out.codes = Object.keys(X.codes).length;
  /* stored for Stage C, counted only */
  out.ORF = { passages: PF_ORF.passages.length, wordLists: PF_ORF.word_lists.length, rapidNaming: PF_ORF.rapid_naming.length, normGrades: Object.keys(PF_ORF.norms).length };
  /* a real boy is never offered a v5 stop while its records are Draft */
  var fake = { sid: 'R-SELFTEST', grade: 4, state: { sections: {} } };
  PF5.STOPS.forEach(function (k) { if (pf5ReadyFor_(fake, k)) P.push('a real boy would be offered ' + k + ' (records still Draft)'); });
  return out;
}
