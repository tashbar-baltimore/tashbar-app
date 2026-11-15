/* PATHFINDER — Tashbar's full assessment and placement. Phase 1: engine + Reading and Math (2026-11-10, by CLAUDE, Claude Code builder).
   Spec: Claude Docs "Pathfinder — Tashbar's Full Assessment and Placement"; 07 PATHFINDER BUILD PROMPT v2; 08 PATHFINDER ITEM-BANK BLUEPRINT v1.
   Anyone may edit this file: log what you change in HQ.
   - Page: app link + ?pf=1 (a boy, reached from the "Start your Pathfinder" card)  ·  staff report: app link + ?pf=1&report=<student id>
   - Saves every answer the moment it is given (tabs PF_Sessions, PF_Answers, PF_Results; PF_Queue waits for writing and recordings).
   - Scoring: Rasch model (1 parameter; 4-option questions allow for a lucky guess), starts at his grade's Level, the most useful next
     question from the least-covered strand, stops when precise (SE about 0.38, 15-35 questions), then 3-5 boundary questions.
   - Rapid guesses are left out of scoring; 3 in a row pauses him ("Let's slow down") and alerts staff; 30% or more marks the section "retake".
   - Placement: the result applies unless a teacher overrides it later; start one step below the edge; gap fillers first (see pfPlanPatch_).
   - PF_LIVE_GRADES = [] (07 PATHFINDER BUILD PROMPT v4, replaces PF.LIVE): an empty list means only TEST- boys can open it. A boy who
     is not a TEST boy sees Pathfinder only if his grade (K = 0) is in the list, and is given ONLY Approved questions with no hold.
     TEST boys keep getting Draft questions, and their screens say "draft". Changing the list needs a Head of School DECISION in the LOG. */
var PF_LIVE_GRADES = [];
var PF = {
  VERSION: 'pf-2.2.0',
  /* v6 MASTER Stage 2 (Engine E + E2, 2026-11-12). New sections start on ENGINE_VERSION; a section remembers the engine it began
     with (sec.eng), so a section started before the change finishes on v4. 'v4' stays callable (set it here, or pass
     {engine:'v4'} to pfSimulate_ / pfSimTable_) for comparison. E = Addendum E sections 1-4 and 7, with E2: placement margin
     z = 0.674 (not 1.645) and the confirmation step-up. */
  ENGINE_VERSION: 'E',
  E: { passPerLevel: 2, passPerLevelHi: 3, passHiFrom: 5, deff: 0.3, placeZ: 0.674, rangeZ: 1.645, rapidMinMs: 2000, rapidChoiceMs: 2000, rapidPassageMs: 3000, rapidMedShare: 0.10, rapidMedN: 30, rapidRetake: 3, lzMinItems: 10, cusumUp: 0.158, cusumDown: 0.162 },
  CONFIRM: { n: 5, keep: 4, recheck: 3, up: 4, typedRecheck: 2, typedMin: 3 },   /* first-lesson check (Addendum E 5 + E2 step-up + Addendum F v2 F8.4); TEST boys only */
  TABS: {
    sessions: ['session_id', 'student_id', 'status', 'kind', 'grade', 'created_at', 'updated_at', 'by', 'state_json', 'flags_json'],
    answers: ['at', 'session_id', 'student_id', 'section', 'seq', 'item_id', 'skill_id', 'strand', 'level', 'format', 'response', 'correct', 'error_code', 'rt_ms', 'rapid', 'idk', 'confidence', 'theta', 'se', 'phase', 'draft'],
    results: ['at', 'session_id', 'student_id', 'subject', 'status', 'level', 'start_skill', 'theta', 'se', 'range_json', 'confidence', 'strands_json', 'skills_json', 'gaps_json', 'errors_json', 'flags_json', 'items_used', 'applied', 'by', 'detail_json'],
    queue: ['at', 'session_id', 'student_id', 'kind', 'ref', 'status', 'detail_json', 'scored_at', 'score_json'],
    notes: ['at', 'student_id', 'by', 'kind', 'text']                                /* v5: staff-only notes (About me family box) */
  },
  /* the eight measured stops on his road; Phase 1 builds Reading and Math */
  STOPS: [['READ', 'Reading', 1], ['MATH', 'Math', 1], ['WRIT', 'Writing', 0], ['LANG', 'Language Arts', 0], ['HEB', 'Limudei Kodesh · Lashon Hakodesh', 0], ['COMP', 'Computing', 0], ['LIFE', 'Life and Money', 0], ['HELP', 'What helps me', 0]],
  CORE: ['READ', 'MATH'],
  STRANDS: {
    MATH: { NPV: 'Number sense and place value', AS: 'Addition and subtraction', MD: 'Multiplication and division', FD: 'Fractions and decimals', MMT: 'Measurement, money and time', GEO: 'Geometry', DATA: 'Data', RA: 'Ratios and algebra' },
    LANG: { GRAM: 'Grammar', MECH: 'Capitals, punctuation and spelling', USE: 'Word use', SENT: 'Sentences' },
    READ: { PA: 'Sounds', DEC: 'Letters and decoding', WRD: 'Sight words', FLU: 'Fluency', VOC: 'Vocabulary', LIT: 'Stories and listening', INF: 'Information texts' }
  },
  ENGINE: { minItems: 15, maxItems: 30, totalMax: 35, hardMax: 45, seStop: 0.40, minPerStrand: 4, boundaryMin: 3, boundaryMax: 5, boundaryBand: 0.6, sdCurrent: 1.0, sdNew: 1.5, perSkillMax: 2, sameFormatMax: 4, ceilMin: 3 },
  RAPID: { run: 3, share: 0.30, minShare: 5, minMs: 1200, perWordMs: 120, maxMs: 5000, slowMs: 10000 },
  SIT: { youngMin: 22, oldMin: 35, breakMin: 30, newSittingGapMin: 20 },
  KEEP_DAYS: 14,
  IDK_MS: 5000,
  IDK_YOUNG_MS: 8000,                                   /* K-2: counted from when the question audio ends */
  /* Phase 2 (07 PATHFINDER BUILD PROMPT v3): stretch break after 12 minutes of question time; "How sure are you?" for grades 3-8 */
  BREAK: { qMin: 12, readyS: 15, capMs: 90000 },
  SURE: { minGrade: 3, every: 3 },
  CHEER_GAP: 3,
  /* Blueprint v1 section 6: fixed fluency measures (timed or teacher report), never adaptive items */
  FIXED: ['READ.FLU.L02.02', 'READ.FLU.L03.01', 'READ.FLU.L04.01', 'READ.FLU.L04.02', 'READ.FLU.L05.01'],
  PRACTICE: [
    { id: 'P1', kind: 'tap', say: 'Tap the star.', stem: 'Tap the star.', choices: ['⭐', '🌙', '☀️', '☁️'], ans: '⭐' },
    { id: 'P2', kind: 'drag', say: 'Drag the apple into the basket.', stem: 'Drag the apple into the basket.', tile: '🍎', ans: 'in' },
    { id: 'P3', kind: 'type', say: 'Type the number seven.', stem: 'Type the number 7.', ans: '7' }
  ]
};

/* ================================================================== ENGINE (pure: no Google services, tested in Node) */
function pfSig_(x) { return 1 / (1 + Math.exp(-x)); }
function pfGuess_(it) { return it.fmt === 'CHOICE' ? 1 / Math.max(2, 1 + (it.wrong || []).length) : 0; }
function pfP_(th, b, c) { return c + (1 - c) * pfSig_(th - b); }
function pfInfo_(th, it) { var c = pfGuess_(it), s = pfSig_(th - it.b), p = c + (1 - c) * s, d = (1 - c) * s * (1 - s); return d * d / Math.max(1e-9, p * (1 - p)); }
/* Posterior over a grid (EAP). ans: [{b, c, x}] with x 1 right / 0 wrong. Returns {theta, se}. */
function pfPost_(ans, mu, sd) {
  var lo = mu - 6 * sd - 3, hi = mu + 6 * sd + 3, step = 0.05, sw = 0, s1 = 0, s2 = 0, lps = [], ths = [], th, i, lp, m = -Infinity;
  for (th = lo; th <= hi + 1e-9; th += step) {
    lp = -0.5 * Math.pow((th - mu) / sd, 2);
    for (i = 0; i < ans.length; i++) { var p = pfP_(th, ans[i].b, ans[i].c); lp += ans[i].x ? Math.log(p) : Math.log(1 - p); }
    lps.push(lp); ths.push(th); if (lp > m) m = lp;
  }
  for (i = 0; i < lps.length; i++) { var w = Math.exp(lps[i] - m); sw += w; s1 += w * ths[i]; s2 += w * ths[i] * ths[i]; }
  var mean = s1 / sw, v = Math.max(0, s2 / sw - mean * mean);
  return { theta: mean, se: Math.sqrt(v) };
}
/* v5: Language Arts runs the same engine with its own stop rule (PF5.ENGINE_LANG); Math and Reading use PF.ENGINE unchanged */
var PF_ENG_ = {};
function pfEng_(subj) {
  if (subj !== 'LANG' || typeof PF5 === 'undefined') return PF.ENGINE;
  if (!PF_ENG_[subj]) { var o = {}; Object.keys(PF.ENGINE).forEach(function (k) { o[k] = PF.ENGINE[k]; }); Object.keys(PF5.ENGINE_LANG).forEach(function (k) { o[k] = PF5.ENGINE_LANG[k]; }); PF_ENG_[subj] = o; }
  return PF_ENG_[subj];
}
function pfLevelOf_(th) { return Math.max(1, Math.min(9, Math.round(th + 5))); }
function pfThetaOfLevel_(lv) { return lv - 5; }
/* Engine E (v6 Stage 2). sec.eng is set when a section starts; a section without it began before Stage 2 and stays on v4. */
function pfEngOf_(sec) { return sec && sec.eng === 'E' ? 'E' : 'v4'; }
/* SE for the stopping rule, the range and placement: passage questions share a story, so they count for less
   (Addendum E 2: SE_eff = SE x sqrt(1 + 0.3 x share of scored questions that came from passages)). v4: plain SE. */
function pfSeEff_(sec) {
  if (pfEngOf_(sec) !== 'E') return sec.se;
  var sc = pfScored_(sec), ix = pfIx_(), np = 0; sc.forEach(function (a) { var it = ix.byId[a.i]; if (it && it.passage) np++; });
  return sec.se * Math.sqrt(1 + PF.E.deff * (sc.length ? np / sc.length : 0));
}
/* Passages per level in one section (Addendum E 2; drafter ANSWER to BLOCKER 1345, pay-spread Step A): 3 at Levels 5-9, 2 at Levels 1-4. */
function pfPassCap_(lv) { return lv >= PF.E.passHiFrom ? PF.E.passPerLevelHi : PF.E.passPerLevel; }
/* Addendum F v2 F8.2: CUSUM of residuals (x - P) / n in answer order at the final ability. Staff-only note when the upper sum
   passes 0.158 or the lower sum passes -0.162 (until the pilot sets the 5% cut-off). Never changes the result or placement. */
function pfCusum_(list, th) {
  var n = list.length, up = 0, dn = 0, maxUp = 0, minDn = 0;
  list.forEach(function (r) { var t = (r.x - pfP_(th, r.b, r.c)) / n; up = Math.max(0, up + t); dn = Math.min(0, dn + t); if (up > maxUp) maxUp = up; if (dn < minDn) minDn = dn; });
  return { up: Math.round(maxUp * 1000) / 1000, down: Math.round(minDn * 1000) / 1000, note: maxUp > PF.E.cusumUp || minDn < -PF.E.cusumDown };
}
/* Standardized person fit lz (Drasgow et al.) with P = c + (1 - c) logistic(theta - b). Large negative = unusual pattern. */
function pfLz_(list, th) {
  var l0 = 0, e = 0, v = 0;
  list.forEach(function (r) { var p = Math.min(1 - 1e-6, Math.max(1e-6, pfP_(th, r.b, r.c))), lp = Math.log(p), lq = Math.log(1 - p), lg = Math.log(p / (1 - p));
    l0 += r.x ? lp : lq; e += p * lp + (1 - p) * lq; v += p * (1 - p) * lg * lg; });
  return v > 0 ? (l0 - e) / Math.sqrt(v) : 0;
}

/* bank index (built once per run) */
var PF_IX_ = null;
function pfIx_() {
  if (PF_IX_) return PF_IX_;
  var B = PF_BANK, byId = {}, bySubj = { MATH: [], READ: [], LANG: [] }, byPassage = {};
  B.items.forEach(function (it) {
    byId[it.id] = it;
    if (bySubj[it.subject]) bySubj[it.subject].push(it);
    if (it.passage) (byPassage[it.passage] = byPassage[it.passage] || []).push(it.id);
  });
  if (typeof pf5Ix_ === 'function') pf5Ix_().la.forEach(function (it) { byId[it.id] = it; bySubj.LANG.push(it); });   /* v5 Language Arts (PathfinderBankLA.js) */
  return (PF_IX_ = { byId: byId, bySubj: bySubj, byPassage: byPassage });
}
/* appr: a boy who is not a TEST boy (only Approved questions with no hold). TEST boys also get Draft questions. */
function pfItemOk_(it, appr) { if (appr) return it.status === 'Approved' && !it.hold; return it.status === 'Approved' || it.status === 'Reviewed' || it.status === 'Draft'; }
function pfLadder_(subj) { var L = typeof plList_ === 'function' ? plList_(subj) : null; return (L || []).map(function (x) { return x[0]; }).filter(function (id) { return subj !== 'LANG' || /^LANG\./.test(id); }); }
function pfSkill_(id) { return PF_BANK.skills[id] || (typeof pf5Ix_ === 'function' ? pf5Ix_().laSkills[id] : null) || null; }
/* The highest level with enough usable questions (PF.ENGINE.ceilMin), in the subject or in one strand. */
function pfTopLevel_(subj, appr, strand) {
  var n = {}, t = 0; pfIx_().bySubj[subj].forEach(function (it) { if (pfItemOk_(it, appr) && (!strand || it.strand === strand)) n[it.level] = (n[it.level] || 0) + 1; });
  Object.keys(n).forEach(function (l) { if (n[l] >= PF.ENGINE.ceilMin && +l > t) t = +l; });
  return t;
}
function pfScored_(sec) { return sec.ans.filter(function (a) { return !a.r; }); }
function pfAnsForPost_(list) { var ix = pfIx_(); return list.map(function (a) { var it = ix.byId[a.i]; return { b: it.b, c: pfGuess_(it), x: a.x }; }); }

/* A new section's engine state. grade: 0 = K ... 8; null when unknown. placedLevel: his current level in this subject (or 0). */
function pfNewSection_(subj, grade, placedLevel, isNew, young, appr) {
  var lv = grade != null && grade >= 0 ? grade + 1 : (placedLevel || 3);
  if (young) lv = Math.min(lv, 2);
  var sd = isNew || grade == null ? PF.ENGINE.sdNew : PF.ENGINE.sdCurrent, mu = pfThetaOfLevel_(lv);
  return { subj: subj, mu: mu, sd: sd, theta: mu, se: sd, phase: 'adaptive', ans: [], cur: null, queue: [], bnd: [], rapidRun: 0, rapidN: 0, startLevel: lv, started: Date.now(), last: Date.now(), done: false, appr: appr ? 1 : 0, eng: PF.ENGINE_VERSION };
}
function pfUpdate_(sec) { var p = pfPost_(pfAnsForPost_(pfScored_(sec)), sec.mu, sec.sd); sec.theta = p.theta; sec.se = p.se; return p; }

/* Strands that matter for him: those with questions within one level of where he is now. */
function pfStrandCounts_(sec) { var ix = pfIx_(), c = {}; pfScored_(sec).forEach(function (a) { var st = ix.byId[a.i].strand; c[st] = (c[st] || 0) + 1; }); return c; }
function pfAvail_(sec, seen) {
  var used = {}, skillN = {}, passUsed = {}; sec.ans.forEach(function (a) { used[a.i] = 1; }); if (sec.cur) used[sec.cur.i] = 1;
  var ix = pfIx_();
  var capP = pfEngOf_(sec) === 'E', passLv = {};
  sec.ans.forEach(function (a) { var it = ix.byId[a.i]; skillN[it.skill] = (skillN[it.skill] || 0) + 1; if (it.passage) { if (capP && !passUsed[it.passage]) passLv[it.level] = (passLv[it.level] || 0) + 1; passUsed[it.passage] = 1; } });
  return ix.bySubj[sec.subj].filter(function (it) {
    if (!pfItemOk_(it, sec.appr) || used[it.id]) return false;
    if (it.passage && passUsed[it.passage]) return false;                  /* a passage's questions come together, once */
    if (capP && it.passage && (passLv[it.level] || 0) >= pfPassCap_(it.level)) return false;   /* E: passage cap per level */
    if ((skillN[it.skill] || 0) >= pfEng_(sec.subj).perSkillMax && sec.phase === 'adaptive') return false;
    return true;
  }).map(function (it) { return { it: it, fresh: !(seen && seen[it.id]) }; });
}
function pfRelevantStrands_(sec, avail, lvl) {
  var s = {}; avail.forEach(function (x) { if (Math.abs(x.it.level - lvl) <= 1) s[x.it.strand] = (s[x.it.strand] || 0) + 1; });
  return s;
}
/* Next item for the adaptive phase. rnd: random 0..1 function (seeded in tests). */
function pfPickAdaptive_(sec, seen, rnd) {
  var avail = pfAvail_(sec, seen); if (!avail.length) return null;
  var fresh = avail.filter(function (x) { return x.fresh; }); if (fresh.length) avail = fresh;  /* a retake draws questions he has not seen */
  var lvl = pfLevelOf_(sec.theta), window = [], d;
  for (d = 0; d <= 8 && !window.length; d++) window = avail.filter(function (x) { return Math.abs(x.it.level - lvl) <= d; });  /* on-grade first, then one level at a time */
  var counts = pfStrandCounts_(sec), strands = {};
  window.forEach(function (x) { strands[x.it.strand] = 1; });
  var order = Object.keys(strands).sort(function (a, b) { return (counts[a] || 0) - (counts[b] || 0) || a.localeCompare(b); });
  var last = sec.ans.length ? pfIx_().byId[sec.ans[sec.ans.length - 1].i] : null, recent = sec.ans.slice(-pfEng_(sec.subj).sameFormatMax).map(function (a) { return pfIx_().byId[a.i].fmt; });
  var sameFmt = recent.length === pfEng_(sec.subj).sameFormatMax && recent.every(function (f) { return f === recent[0]; }) ? recent[0] : null;
  for (var k = 0; k < order.length; k++) {
    var pool = window.filter(function (x) { return x.it.strand === order[k] && (!last || x.it.skill !== last.skill); });
    if (sameFmt) { var vary = pool.filter(function (x) { return x.it.fmt !== sameFmt; }); if (vary.length) pool = vary; }
    if (!pool.length) continue;
    pool.sort(function (a, b) { return pfInfo_(sec.theta, b.it) - pfInfo_(sec.theta, a.it); });
    var top = pool.slice(0, Math.min(3, pool.length)), pick = top[Math.floor(rnd() * top.length) % top.length].it;
    return pick;
  }
  return window[0].it;
}
/* Is it time to stop the adaptive phase? */
function pfShouldStop_(sec, seen) {
  var E = pfEng_(sec.subj), n = pfScored_(sec).length, shown = sec.ans.length;
  if (n >= E.maxItems || shown >= E.hardMax) return 'max';
  var avail = pfAvail_(sec, seen); if (!avail.length) return 'bank';
  if (n < E.minItems) return '';
  var lvl = pfLevelOf_(sec.theta), rel = pfRelevantStrands_(sec, avail, lvl), counts = pfStrandCounts_(sec), ok = true;
  Object.keys(rel).forEach(function (st) { if ((counts[st] || 0) < Math.min(E.minPerStrand, (counts[st] || 0) + rel[st])) ok = false; });
  if (!ok) return '';
  var seE = pfSeEff_(sec), f = sec.se > 0 ? seE / sec.se : 1;              /* E: SE_eff; v4: f = 1 */
  if (seE <= E.seStop) return 'precise';
  var best = 0; avail.forEach(function (x) { best = Math.max(best, pfInfo_(sec.theta, x.it)); });
  var newSe = 1 / Math.sqrt(1 / (sec.se * sec.se) + best);
  if (f * (sec.se - newSe) < 0.01) return 'flat';                               /* more questions would barely sharpen it */
  return '';
}
/* Boundary confirmation: 3-5 questions on the skills right at his estimated edge. */
function pfPickBoundary_(sec, seen, rnd) {
  var E = pfEng_(sec.subj); if (sec.bnd.length >= E.boundaryMax || pfScored_(sec).length >= E.totalMax) return null;
  if (sec.bnd.length >= E.boundaryMin) {
    var xs = sec.ans.filter(function (a) { return a.ph === 'b' && !a.r; }).map(function (a) { return a.x; });
    var mixed = xs.some(function (x) { return x; }) && xs.some(function (x) { return !x; });
    if (!mixed) return null;                                              /* they agree: the boundary is confirmed */
  }
  var asked = {}; sec.ans.forEach(function (a) { asked[pfIx_().byId[a.i].skill] = (asked[pfIx_().byId[a.i].skill] || 0) + 1; });
  var avail = pfAvail_(sec, seen).filter(function (x) { return !x.it.passage && Math.abs(x.it.b - sec.theta) <= E.boundaryBand; });
  if (!avail.length) avail = pfAvail_(sec, seen).filter(function (x) { return !x.it.passage; }).sort(function (a, b) { return Math.abs(a.it.b - sec.theta) - Math.abs(b.it.b - sec.theta); }).slice(0, 4);
  if (!avail.length) return null;
  var fresh = avail.filter(function (x) { return x.fresh; }); if (fresh.length) avail = fresh;
  avail.sort(function (a, b) { return (asked[a.it.skill] || 0) - (asked[b.it.skill] || 0) || Math.abs(a.it.b - sec.theta) - Math.abs(b.it.b - sec.theta); });
  var top = avail.slice(0, Math.min(2, avail.length));
  return top[Math.floor(rnd() * top.length) % top.length].it;
}
/* The next item id for this section, or null when the section is finished. Handles passage testlets. */
function pfNext_(sec, seen, rnd) {
  rnd = rnd || Math.random;
  if (sec.queue.length && pfEngOf_(sec) === 'E' && pfScored_(sec).length >= pfEng_(sec.subj).totalMax) sec.queue = [];   /* E: the 35 cap holds inside a passage */
  if (sec.queue.length) return pfIx_().byId[sec.queue.shift()];
  var it = null;
  if (sec.phase === 'adaptive') {
    var why = pfShouldStop_(sec, seen);
    if (why) { sec.stopWhy = why; sec.phase = why === 'bank' ? 'done' : 'boundary'; }
    else it = pfPickAdaptive_(sec, seen, rnd);
  }
  if (!it && sec.phase === 'boundary') { it = pfPickBoundary_(sec, seen, rnd); if (!it) sec.phase = 'done'; else sec.bnd.push(it.id); }
  if (!it) { sec.done = true; return null; }
  if (it.passage && sec.phase === 'adaptive') sec.queue = (pfIx_().byPassage[it.passage] || []).filter(function (id) { return id !== it.id && pfItemOk_(pfIx_().byId[id], sec.appr); });
  return it;
}

/* ---- answers ---- */
function pfNum_(s) {
  s = String(s).trim(); var m;
  if ((m = /^(-?\d+)\s+(\d+)\/(\d+)$/.exec(s))) { var w = Number(m[1]); return w + (w < 0 ? -1 : 1) * Number(m[2]) / Number(m[3]); }
  if ((m = /^(-?\d+)\/(\d+)$/.exec(s))) return Number(m[2]) ? Number(m[1]) / Number(m[2]) : NaN;
  if (/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return Number(s);
  return NaN;
}
var PF_VULGAR_ = { '½': '1/2', '⅓': '1/3', '⅔': '2/3', '¼': '1/4', '¾': '3/4', '⅕': '1/5', '⅖': '2/5', '⅗': '3/5', '⅘': '4/5', '⅙': '1/6', '⅚': '5/6', '⅛': '1/8', '⅜': '3/8', '⅝': '5/8', '⅞': '7/8' };
/* Unicode NFC (PF-LH1 finding, v6 Stage 1): the same letters typed or stored with different code points compare equal.
   Harmless for English; needed before any Hebrew item exists. Every answer comparison goes through this. */
function pfNfc_(s) { s = String(s); return s.normalize ? s.normalize('NFC') : s; }
/* Typed or handwritten (Handwrite on the on-screen keyboard) answers: Unicode minus, fraction slash and ½-style fractions,
   thousands commas, spaces around / and :, and remainders ("234 R1", "234 r 1", "234 remainder 1" all become "234 r 1"). */
function pfNorm_(s) {
  return pfNfc_(s == null ? '' : s).replace(/[−–—‐‑]/g, '-').replace(/ /g, ' ').replace(/[⁄∕]/g, '/').replace(/[∶：]/g, ':')
    .replace(/(\d?)\s*([½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/g, function (a, d, f) { return (d ? d + ' ' : '') + PF_VULGAR_[f]; })
    .replace(/,(?=\d{3}\b)/g, '').replace(/\s*\/\s*/g, '/').replace(/\s*:\s*/g, ':').replace(/\s+/g, ' ').trim().toLowerCase()
    .replace(/(\d)\s*(?:remainder|rem\.?|r)\s*(\d)/g, '$1 r $2');
}
function pfSame_(a, b) {
  a = pfNorm_(a); b = pfNorm_(b); if (a === b) return true;
  if (/:/.test(a) || /:/.test(b)) { var ta = /^(\d{1,2}):(\d\d)$/.exec(a), tb = /^(\d{1,2}):(\d\d)$/.exec(b); return !!(ta && tb && Number(ta[1]) === Number(tb[1]) && ta[2] === tb[2]); }
  var x = pfNum_(a), y = pfNum_(b); return !isNaN(x) && !isNaN(y) && Math.abs(x - y) < 1e-9;
}
/* Drag-to-order: the order he left the tiles in, compared without spaces ("−8, −3, 0, 5" = "-8,-3,0,5"). */
function pfOrderKey_(s) { return pfNorm_(s).replace(/\s+/g, ''); }
/* Tap a point: "x,y" from the grid, or the point's description (the bank's own words). */
function pfPointOf_(it, resp) {
  var m = /^\(?\s*(-?\d+)\s*,\s*(-?\d+)\s*\)?$/.exec(pfNorm_(resp)); if (m) return [Number(m[1]), Number(m[2])];
  if (pfNfc_(resp) === pfNfc_(it.ans)) return it.pt;
  for (var i = 0; i < (it.wrong || []).length; i++) if (pfNfc_(resp) === pfNfc_(it.wrong[i][0])) return (it.wpt || [])[i] || null;
  return null;
}
/* Score one response. resp: typed text (TYPE), the chosen value (CHOICE), the tile order (ORDER) or "x,y" (POINT). Returns {x, code}. */
function pfScore_(it, resp) {
  if (it.fmt === 'ORDER') {
    var k = pfOrderKey_(resp); if (k === pfOrderKey_(it.ans)) return { x: 1, code: '' };
    var wo = (it.wrong || []).filter(function (p) { return pfOrderKey_(p[0]) === k; })[0];   /* a coded wrong order is named */
    return { x: 0, code: wo ? wo[1] : 'other' };
  }
  if (it.fmt === 'POINT') {
    var pt = pfPointOf_(it, resp), same = function (a, b) { return !!(a && b && a[0] === b[0] && a[1] === b[1]); };
    if (same(pt, it.pt)) return { x: 1, code: '' };
    for (var j = 0; j < (it.wrong || []).length; j++) if (same(pt, (it.wpt || [])[j])) return { x: 0, code: it.wrong[j][1] };
    return { x: 0, code: 'other' };
  }
  if (it.fmt === 'CHOICE') {
    if (pfNfc_(resp) === pfNfc_(it.ans)) return { x: 1, code: '' };                    /* exact, case-sensitive (b is not B) */
    var w = (it.wrong || []).filter(function (p) { return pfNfc_(p[0]) === pfNfc_(resp); })[0];
    return { x: 0, code: w ? w[1] : 'other' };
  }
  if (pfSame_(resp, it.ans) || (it.accept || []).some(function (a) { return pfSame_(resp, a); })) return { x: 1, code: '' };
  var hit = (it.wrong || []).filter(function (p) { return pfSame_(resp, p[0]); })[0];
  return { x: 0, code: hit ? hit[1] : 'other' };
}
/* Fastest believable answer time for this item: faster than it could be read = a rapid guess. */
function pfWords_(it) {
  if (it.rw != null) return it.rw;                                        /* words he must read himself, counted when the bank was built */
  var t = [it.fmt === 'CHOICE' ? (it.wrong || []).map(function (w) { return w[0]; }).concat([it.ans]).join(' ') : '', it.show || '', it.audioOnly ? '' : it.stem || ''].join(' ');
  return (t.match(/\S+/g) || []).length;
}
function pfRapidMs_(it, eng) {
  if (eng === 'E') {   /* Addendum E 3: 10% of this question's median time (at least 2 s); until 30 answers exist, 2 s (choice) or 3 s (passage) */
    var m = pfMed_()[it.id]; if (m && m[0] >= PF.E.rapidMedN) return Math.max(PF.E.rapidMinMs, Math.round(PF.E.rapidMedShare * m[1]));
    return it.passage ? PF.E.rapidPassageMs : PF.E.rapidChoiceMs;
  }
  var R = PF.RAPID; return Math.max(R.minMs, Math.min(R.maxMs, pfWords_(it) * R.perWordMs));
}
/* Median answer time per question, from PF_Answers ({item_id: [answers, median ms]}; "I don't know" left out). Cached 10 minutes.
   Empty when the sheet cannot be read (tests): then the fixed 2 s / 3 s rule applies. */
var PF_MED_ = null;
function pfMed_() {
  if (PF_MED_) return PF_MED_;
  try {
    var c = CacheService.getScriptCache(), hit = c.get('pf_med_v1'); if (hit) return (PF_MED_ = JSON.parse(hit));
    var by = {}, out = {};
    pfRows_('answers').forEach(function (v) { var id = String(v[5]), t = Number(v[13]); if (!id || String(v[15]) === '1' || v[15] === true || !(t > 0)) return; (by[id] = by[id] || []).push(t); });
    Object.keys(by).forEach(function (id) { var a = by[id].sort(function (x, y) { return x - y; }), n = a.length; out[id] = [n, n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2]; });
    try { c.put('pf_med_v1', JSON.stringify(out), 600); } catch (e2) {}
    return (PF_MED_ = out);
  } catch (e) { return (PF_MED_ = {}); }
}

/* Record one answer into the section state. Returns the stored answer. */
function pfRecord_(sec, it, resp, rtMs, idk, conf) {
  var sc = idk ? { x: 0, code: 'IDK' } : pfScore_(it, resp);
  var rapid = !idk && Number(rtMs) < pfRapidMs_(it, pfEngOf_(sec));
  var a = { i: it.id, x: sc.x, c: sc.code, t: Math.round(Number(rtMs) || 0), r: rapid ? 1 : 0, k: idk ? 1 : 0, f: conf || '', ph: sec.phase === 'boundary' ? 'b' : 'a', at: Date.now() };
  sec.ans.push(a); sec.cur = null; sec.last = Date.now();
  if (rapid) { sec.rapidRun++; sec.rapidN++; } else sec.rapidRun = 0;
  pfUpdate_(sec);
  return a;
}

/* ---- the result of a finished section ---- */
function pfClass_(answers, P) {
  if (answers.length) {
    var r = answers.filter(function (a) { return a.x; }).length;
    if (r === answers.length) return answers.some(function (a) { return a.f === 'unsure'; }) ? 'working' : 'solid';
    if (r === 0) return 'not';
    return 'working';
  }
  return P >= 0.75 ? 'solid' : P < 0.4 ? 'not' : 'working';
}
function pfResult_(sec, ladder) {
  var ix = pfIx_(), scored = pfScored_(sec), th = sec.theta, seRaw = sec.se, subj = sec.subj, isE = pfEngOf_(sec) === 'E';
  var se = pfSeEff_(sec);                                                   /* E: SE_eff for range, confidence and placement */
  var top = pfTopLevel_(subj, sec.appr), est = pfLevelOf_(th), flags = [];
  /* E2: place at the level at theta - 0.674 x SE_eff (lower edge of the 50% range); the report still shows the estimate and range */
  var lvl = isE ? pfLevelOf_(th - PF.E.placeZ * se) : est;
  var shown = sec.ans.length, rapidShare = shown ? sec.rapidN / shown : 0;
  var status = 'done';
  if (isE) { if (sec.rapidN >= PF.E.rapidRetake) { status = 'retake'; flags.push('low effort: ' + sec.rapidN + ' answers too fast to read them (not scored); section marked for retake'); } }
  else if (shown >= PF.RAPID.minShare && rapidShare >= PF.RAPID.share) { status = 'retake'; flags.push('rapid guessing ' + Math.round(rapidShare * 100) + '%'); }
  var ceiling = th > pfThetaOfLevel_(top) + 0.5;
  if (ceiling) { lvl = est = top; if (status === 'done') status = 'ceiling'; flags.push('above the questions ' + (sec.appr ? 'approved' : 'written') + ' so far (Level ' + top + ')'); }
  if (th < pfThetaOfLevel_(1) - 0.5 || (scored.length >= 10 && !scored.some(function (a) { return a.x; }))) flags.push('at the floor: missed nearly everything; check the student understood the screens');
  var bySkill = {}; scored.forEach(function (a) { var s = ix.byId[a.i].skill; (bySkill[s] = bySkill[s] || []).push(a); });
  var skills = ladder.map(function (id) { var k = pfSkill_(id); if (!k) return null; var P = pfSig_(th - k.b); return { id: id, level: k.level, strand: k.strand, b: k.b, P: P, asked: (bySkill[id] || []).length, cls: pfClass_(bySkill[id] || [], P) }; }).filter(Boolean);
  /* the edge: first skill at his level that is not solid; start one step below it (or on his last "working on it" skill) */
  var atL = skills.filter(function (s) { return s.level === lvl; }), edge = null, i;
  for (i = 0; i < atL.length; i++) if (atL[i].cls !== 'solid') { edge = atL[i]; break; }
  if (!edge) edge = skills.filter(function (s) { return s.level === lvl + 1; })[0] || atL[atL.length - 1] || skills[0];
  var ei = skills.indexOf(edge), start = edge;
  for (i = ei - 1; i >= 0 && skills[i].level >= lvl; i--) if (skills[i].cls === 'working') { start = skills[i]; break; }
  if (start === edge && ei > 0 && skills[ei - 1].level >= lvl - 1) start = skills[ei - 1];
  if (isE && !ceiling && start.level < lvl && atL.length) start = atL[0];   /* E2: he starts on the placed Level; gap fillers cover below it */
  if (ceiling) start = atL[atL.length - 1] || start;
  var gaps = skills.filter(function (s) { return s.level < start.level && s.asked && s.cls === 'not'; }).map(function (s) { return s.id; }).slice(0, 6);
  var band = skills.map(function (s, j) { return s.P >= 0.3 && s.P <= 0.7 ? j : -1; }).filter(function (j) { return j >= 0; });
  var rz = isE ? PF.E.rangeZ : 1;                                          /* E: the 90% range (theta +/- 1.645 SE_eff); v4: +/- 1 SE */
  var range = { lo: band.length ? skills[band[0]].id : edge.id, hi: band.length ? skills[band[band.length - 1]].id : edge.id, loPos: band.length ? band[0] + 1 : ei + 1, hiPos: band.length ? band[band.length - 1] + 1 : ei + 1, levelLo: pfLevelOf_(th - rz * se), levelHi: pfLevelOf_(th + rz * se), startPos: skills.indexOf(start) + 1 };
  /* boundary agreement: right share on boundary items close to what the estimate expects */
  var bd = scored.filter(function (a) { return a.ph === 'b'; }), agree = true;
  if (bd.length) { var exp = 0, obs = 0; bd.forEach(function (a) { var it = ix.byId[a.i]; exp += pfP_(th, it.b, pfGuess_(it)); obs += a.x; }); agree = Math.abs(obs - exp) / bd.length <= 0.34; }
  var conf = se <= 0.40 && agree ? 'High' : se <= 0.55 ? 'Medium' : 'Low';
  if (status !== 'done') conf = 'Low';
  /* strands: each strand's own estimate, pulled toward the overall one */
  var strands = {}; scored.forEach(function (a) { var st = ix.byId[a.i].strand; (strands[st] = strands[st] || []).push(a); });
  Object.keys(strands).forEach(function (st) { var p = pfPost_(pfAnsForPost_(strands[st]), th, 1.0); strands[st] = { n: strands[st].length, right: strands[st].filter(function (a) { return a.x; }).length, level: Math.min(ceiling ? top : 9, pfLevelOf_(p.theta)), theta: Math.round(p.theta * 100) / 100, se: Math.round(p.se * 100) / 100 }; });
  /* v4: a strand whose estimate passes the highest level with enough usable (for real boys: Approved) questions gets one staff line */
  var ceil = [];
  Object.keys(strands).sort().forEach(function (st) { var stTop = pfTopLevel_(subj, sec.appr, st);
    if (stTop && strands[st].theta > pfThetaOfLevel_(stTop) + 0.5) { strands[st].level = Math.min(strands[st].level, stTop); ceil.push('Ceiling reached in ' + ((PF.STRANDS[subj] || {})[st] || st) + '; placement held at Level ' + stTop + '.'); } });
  ceil.forEach(function (x) { flags.push(x); });
  /* error patterns, and an odd-pattern check (hard ones right, easy ones wrong) */
  var errors = {}, odd = 0; scored.forEach(function (a) { if (!a.x && a.c && a.c !== 'other' && a.c !== 'IDK') errors[a.c] = (errors[a.c] || 0) + 1; var it = ix.byId[a.i], p = pfP_(th, it.b, pfGuess_(it)); if ((a.x && p < 0.15 && it.fmt === 'TYPE') || (!a.x && p > 0.9)) odd++; });
  if (odd >= 3) flags.push('odd pattern (' + odd + ' surprising answers)');
  /* Addendum F v2 F8.1 (replaces Addendum E 4): person fit lz is stored for research only: no flag, never changes placement.
     F8.2: a CUSUM staff note when the answer pattern changes partway through; the result still stands. */
  var lz = null, cusum = null;
  if (isE && scored.length >= PF.E.lzMinItems) {
    var post = pfAnsForPost_(scored); lz = pfLz_(post, th); cusum = pfCusum_(post, th);
    if (cusum.note) flags.push('Answer pattern changed partway through. Worth a look.');
  }
  var unsureWrong = scored.filter(function (a) { return !a.x && a.f === 'sure'; }).map(function (a) { return ix.byId[a.i].skill; });
  return {
    subject: subj, status: status, level: ceiling ? top : est, startLevel: start.level, start: start.id, theta: Math.round(th * 100) / 100, se: Math.round(se * 100) / 100,
    range: range, confidence: conf, strands: strands,
    skills: skills.filter(function (s) { return s.asked || Math.abs(s.level - est) <= 1; }).map(function (s) { return [s.id, s.cls, s.asked]; }),
    engine: pfEngOf_(sec), seRaw: Math.round(seRaw * 100) / 100, placedLevel: lvl, z: isE ? PF.E.placeZ : 0, lz: lz == null ? null : Math.round(lz * 100) / 100, cusum: cusum,
    gaps: gaps, errors: errors, flags: flags, sureWrong: unsureWrong, used: scored.length, shown: shown, rapid: sec.rapidN, stopWhy: sec.stopWhy || '', ceiling: ceiling, ceil: ceil
  };
}

/* Simulation for pfSelfTest: boys at known levels answer by the model. Returns mean error and questions used.
   o (optional): {level: every boy's true level is inside this level, appr: Approved questions only (a real boy),
   engine: 'E' | 'v4' (default PF.ENGINE_VERSION), world: true = the Addendum E test world (true difficulty = seed b + N(0, 0.6) per boy,
   passage effect N(0, 0.5) shared by a passage's questions, 10% of boys rapid-guess 15% of answers)}.
   Also returns (v6 Stage 2): bias, in90 (true theta inside theta +/- 1.645 SE, SE_eff under E), placed / below / above
   (the Level his start skill is on, i.e. what the app would place), and the share with the CUSUM staff note or marked retake. */
function pfSimulate_(n, subj, seed, o) {
  o = o || {};
  var s = seed || 7; function rnd() { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }
  function norm() { var u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  var top = pfTopLevel_(subj, o.appr), errs = [], used = [], ladder = pfLadder_(subj), lvlHit = 0, inRange = 0, in90 = 0, pl = { same: 0, below: 0, above: 0 }, unrel = 0, retake = 0;
  for (var k = 0; k < n; k++) {
    var trueTh = o.level ? pfThetaOfLevel_(o.level) - 0.5 + rnd() : -4.5 + rnd() * (pfThetaOfLevel_(top) + 4.5), grade = Math.max(0, Math.min(8, Math.round(trueTh + 5 - 1 + (rnd() - 0.5) * 2)));
    var sec = pfNewSection_(subj, grade, 0, false, false, o.appr), it, guard = 0;
    if (o.engine) sec.eng = o.engine;
    var tb = {}, pe = {}, rapidBoy = !!o.world && rnd() < 0.10;
    while ((it = pfNext_(sec, null, rnd)) && guard++ < 80) {
      var bT = it.b, u = 0;
      if (o.world) { if (tb[it.id] == null) tb[it.id] = it.b + 0.6 * norm(); bT = tb[it.id]; if (it.passage) { if (pe[it.passage] == null) pe[it.passage] = 0.5 * norm(); u = pe[it.passage]; } }
      var rapid = rapidBoy && rnd() < 0.15, c = pfGuess_(it);
      var x = rapid ? rnd() < (c || 0.05) : rnd() < pfP_(trueTh + u, bT, c);
      var resp = x ? it.ans : (it.wrong && it.wrong.length ? it.wrong[0][0] : 'zz');
      pfRecord_(sec, it, resp, rapid ? 400 : 20000, false, '');
    }
    var res = pfResult_(sec, ladder), tl = pfLevelOf_(trueTh), placed = res.startLevel;
    errs.push(sec.theta - trueTh); used.push(res.used);
    if (pfLevelOf_(sec.theta) === tl) lvlHit++;
    if (tl >= res.range.levelLo && tl <= res.range.levelHi) inRange++;
    if (Math.abs(trueTh - sec.theta) <= PF.E.rangeZ * pfSeEff_(sec)) in90++;
    if (placed === tl) pl.same++; else if (placed === tl - 1) pl.below++; else if (placed > tl) pl.above++;
    if (res.cusum && res.cusum.note) unrel++; if (res.status === 'retake') retake++;
  }
  var mean = function (a) { return a.reduce(function (x, y) { return x + y; }, 0) / a.length; }, pc = function (v) { return Math.round(100 * v / n) + '%'; };
  return { boys: n, subject: subj, level: o.level || '', engine: o.engine || PF.ENGINE_VERSION, world: !!o.world, meanError: Math.round(mean(errs) * 100) / 100, meanAbsError: Math.round(mean(errs.map(Math.abs)) * 100) / 100, rmse: Math.round(Math.sqrt(mean(errs.map(function (e) { return e * e; }))) * 100) / 100, meanItems: Math.round(mean(used) * 10) / 10, minItems: Math.min.apply(null, used), maxItems: Math.max.apply(null, used), exactLevel: pc(lvlHit), levelInRange: pc(inRange),
    in90: pc(in90), placedTrue: pc(pl.same), placedBelow: pc(pl.below), placedAbove: pc(pl.above), cusumNote: pc(unrel), retake: pc(retake) };
}

/* What the page may see of an item: never the answer key. Choice order is shuffled once and kept, so a resume shows the same screen. */
function pfShuffle_(arr, seedStr) { var h = 0, i; for (i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) | 0; var a = arr.slice(); for (i = a.length - 1; i > 0; i--) { h = (h * 1103515245 + 12345) | 0; var j = Math.abs(h) % (i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function pfPresent_(it, sec, salt) {
  var out = { id: it.id, fmt: it.fmt, stem: it.stem, say: it.say || '', pic: it.pic || '', show: it.show || '', cmode: it.cmode || 'text', screen: it.screenNote || '', unit: it.unit || '', audioOnly: !!it.audioOnly, level: it.level, strand: it.strand, draft: it.status !== 'Approved', subject: it.subject };
  if (it.labels) out.labels = it.labels;
  out.minMs = pfRapidMs_(it, pfEngOf_(sec));
  if (it.fmt === 'CHOICE') out.choices = pfShuffle_([it.ans].concat((it.wrong || []).map(function (w) { return w[0]; })), it.id + '|' + salt);
  if (it.fmt === 'ORDER') out.tiles = (it.tiles || []).slice();                 /* in the order the question lists them */
  if (it.fmt === 'POINT') out.grid = (it.grid || [0, 8]).slice();
  if (it.fmt === 'TYPE' && /\d\s*R\s*\d/.test(String(it.ans))) out.rem = true;  /* "write the remainder with R": the pad shows an R key */
  if (it.passage) { var P = PF_BANK.passages[it.passage]; if (P) { out.passage = { id: P.id, title: P.title, text: P.text, listen: !!P.listen, kind: P.kind || '', sources: P.sources || 0 }; if (P.extras) out.passage.extras = P.extras; } }
  out.n = sec.ans.length + 1;
  return out;
}

/* ================================================================== SERVER (Google services) */
function pfDoGet_(e) {
  /* v5: the screens for the v5 stops live in PathfinderMore.html, added before </body> */
  var html = HtmlService.createHtmlOutputFromFile('PathfinderPage').getContent(), more = '';
  try { more = HtmlService.createHtmlOutputFromFile('PathfinderMore').getContent(); } catch (x) {}
  if (more) html = html.replace('</body>', function () { return more + '</body>'; });   /* a function: "$" in the script stays as written */
  return HtmlService.createHtmlOutput(tlTheme_(html, (e && e.parameter && e.parameter.report) ? 'staff' : 'boy'))
    .setTitle('Tashbar Learning · Pathfinder')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}
function pfTab_(k) {
  var ss = msBook_(), name = 'PF_' + k.charAt(0).toUpperCase() + k.slice(1), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.getRange(1, 1, 1, PF.TABS[k].length).setValues([PF.TABS[k]]).setFontWeight('bold'); sh.setFrozenRows(1); }
  else if (sh.getLastColumn() < PF.TABS[k].length && sh.getLastRow() >= 1) sh.getRange(1, 1, 1, PF.TABS[k].length).setValues([PF.TABS[k]]);   /* v5 added a column */
  return sh;
}
function pfRows_(k) { var sh = pfTab_(k), n = sh.getLastRow(); return n < 2 ? [] : sh.getRange(2, 1, n - 1, PF.TABS[k].length).getValues(); }
function pfLock_(fn) { var l = LockService.getScriptLock(); if (!l.tryLock(20000)) throw new Error('The school server is busy. Your answer is still here: tap Next again.'); try { PL_CACHE_ = null; return fn(); } finally { PL_CACHE_ = null; l.releaseLock(); } }
function pfJson_(s, d) { try { return s ? JSON.parse(s) : d; } catch (e) { return d; } }
function pfIsTest_(sid) { return typeof msIsTest_ === 'function' ? msIsTest_(sid) : /^TEST-/.test(String(sid)); }
/* Who may open Pathfinder: TEST boys always; any other boy only when his grade is in PF_LIVE_GRADES (empty = TEST boys only). */
function pfLiveGrade_(g) { return g != null && g !== '' && PF_LIVE_GRADES.indexOf(Number(g)) >= 0; }
function pfEnabled_(sid, r) {
  if (pfIsTest_(sid)) return true;
  if (!PF_LIVE_GRADES.length) return false;
  var S = pfActive_(sid), g = S && S.grade !== '' ? Number(S.grade) : pfGrade_(r || { id: sid }, null);
  return pfLiveGrade_(g);
}
function pfAppr_(sid) { return pfIsTest_(sid) ? 0 : 1; }
function pfKid_(token) { var s = msSession_(token); if (s.role !== 'kid') throw new Error('Please sign in with your own code.'); return s; }
function pfStaff_(token) { var s = msSession_(token); if (s.role !== 'staff') throw new Error('Staff only. Sign in with a staff code.'); return s; }
function pfWho_(s) { return s && s.who ? s.who.name + ' (' + s.who.id + ')' : 'staff'; }
/* His grade, from the roster note ("grade 3 · added ...") or a grade set on his Pathfinder by staff. null when unknown. */
function pfGrade_(r, sessGrade) {
  if (sessGrade !== '' && sessGrade != null && !isNaN(Number(sessGrade))) return Number(sessGrade);
  var row = msRows_('roster').filter(function (x) { return String(x[0]) === r.id; })[0], m = row ? /grade\s+(K|\d)\b/i.exec(String(row[8] || '')) : null;
  return m ? (m[1].toUpperCase() === 'K' ? 0 : Number(m[1])) : null;
}
function pfSessionsOf_(sid) {
  var sh = pfTab_('sessions'), n = sh.getLastRow(); if (n < 2) return [];
  var v = sh.getRange(2, 1, n - 1, PF.TABS.sessions.length).getValues(), out = [];
  for (var i = 0; i < v.length; i++) if (String(v[i][1]) === sid) out.push({ row: i + 2, id: String(v[i][0]), sid: sid, status: String(v[i][2]), kind: String(v[i][3]), grade: v[i][4], created: v[i][5], updated: v[i][6], by: String(v[i][7]), state: pfJson_(v[i][8], {}), flags: pfJson_(v[i][9], []) });
  return out;
}
function pfActive_(sid) {
  var all = pfSessionsOf_(sid); for (var i = all.length - 1; i >= 0; i--) if (all[i].status === 'active') return all[i];
  var last = all[all.length - 1];   /* v5: a TEST boy keeps his session after Reading and Math while v5 stops remain */
  if (last && last.status === 'core' && pfIsTest_(sid) && typeof pf5Left_ === 'function' && pf5Left_(last) > 0) return last;
  return null;
}
function pfSaveSession_(S) {
  var json = JSON.stringify(S.state); if (json.length > 48000) throw new Error('This Pathfinder record is too large. Ask staff to start a retake.');
  pfTab_('sessions').getRange(S.row, 1, 1, PF.TABS.sessions.length).setValues([[S.id, S.sid, S.status, S.kind, S.grade == null ? '' : S.grade, S.created, new Date(), S.by, json, JSON.stringify(S.flags || [])]]);
}
function pfCreate_(sid, kind, by, grade) {
  var seen = {}; pfSessionsOf_(sid).forEach(function (o) { Object.keys(o.state.sections || {}).forEach(function (k) { (o.state.sections[k].ans || []).forEach(function (a) { seen[a.i] = 1; }); });
    Object.keys(o.state.confirm || {}).forEach(function (k) { (o.state.confirm[k].hist || []).forEach(function (h) { (h.items || []).forEach(function (id) { seen[id] = 1; }); }); }); });   /* v6 Stage 2: confirmation questions count as seen */
  var S = { id: 'PF-' + Utilities.getUuid().slice(0, 8), sid: sid, status: 'active', kind: kind, grade: grade == null ? '' : grade, created: new Date(), by: by, flags: [], state: { v: 1, practice: null, young: false, sections: {}, seen: Object.keys(seen), sit: { start: Date.now(), last: Date.now(), paused: 0 }, pause: null } };
  var sh = pfTab_('sessions'); sh.appendRow([S.id, sid, S.status, kind, S.grade, S.created, new Date(), by, JSON.stringify(S.state), '[]']); S.row = sh.getLastRow();
  return S;
}
function pfSeen_(S) { var o = {}; (S.state.seen || []).forEach(function (id) { o[id] = 1; }); return o; }
function pfCap_(grade, young) { return ((grade != null && grade <= 2) || young ? PF.SIT.youngMin : PF.SIT.oldMin) * 60000; }
/* Sitting rules: capped sitting, then a break before the next one. Returns a pause object or null. */
function pfSitting_(S, now) {
  var st = S.state.sit = S.state.sit || { start: now, last: now, paused: 0 };
  if (st.paused) { if (now - st.paused < PF.SIT.breakMin * 60000) return { kind: 'sitting', until: st.paused + PF.SIT.breakMin * 60000 }; st.paused = 0; st.start = now; }
  else if (now - st.last > PF.SIT.newSittingGapMin * 60000) st.start = now;
  st.last = now; return null;
}
function pfCapReached_(S, now) { var st = S.state.sit; if (now - st.start >= pfCap_(S.grade === '' ? null : Number(S.grade), S.state.young)) { st.paused = now; return true; } return false; }
/* 14-day rule: an unfinished section older than that restarts with fresh questions. */
function pfStale_(S, now) {
  Object.keys(S.state.sections || {}).forEach(function (k) { var sec = S.state.sections[k]; if (!sec.done && now - (sec.last || sec.started) > PF.KEEP_DAYS * 86400000) { (sec.ans || []).forEach(function (a) { S.state.seen.push(a.i); }); delete S.state.sections[k]; S.flags.push({ at: new Date(now).toISOString(), by: 'pathfinder', action: 'restarted ' + k + ' (older than ' + PF.KEEP_DAYS + ' days)' }); } });
}
function pfRoad_(S) {
  var R = {}; PF.STOPS.forEach(function (s) { var sec = S && S.state.sections[s[0]]; R[s[0]] = { label: s[1], ready: !!s[2], status: !sec ? 'todo' : sec.done ? (sec.result ? sec.result.status : 'done') : 'going', n: sec ? sec.ans.length : 0 }; });
  return typeof pf5Road_ === 'function' ? pf5Road_(S, R) : R;   /* v5: the TEST boys' road adds the v5 stops */
}
function pfView_(S, r, extra) {
  var cur = null, k = S.state.cursec, sec = k ? S.state.sections[k] : null;
  var g = S.grade === '' ? null : Number(S.grade);
  if (sec && sec.cur && !sec.done) { cur = { section: k, item: pfPresent_(pfIx_().byId[sec.cur.i], sec, S.id) }; cur.item.sure = pfAskSure_(S, g, cur.item.id); }
  var v = { appUrl: ScriptApp.getService().getUrl(), name: r.name, first: String(r.name).split(' ')[0], grade: g, young: !!S.state.young || (g != null && g <= 2), practice: S.state.practice, road: pfRoad_(S), cur: cur, pause: S.state.pause || null, draft: pfIsTest_(S.sid), idkMs: (!!S.state.young || (g != null && g <= 2)) ? PF.IDK_YOUNG_MS : PF.IDK_MS, version: PF.VERSION, slowMs: PF.RAPID.slowMs,
    lands: pfLands_(), core: PF.CORE, badges: S.state.badges || [], earned: S.state.earned || 0, power: sec && !sec.done ? Math.round((sec.power || 0) * 10) / 10 : 0, powerMax: PF.ENGINE.totalMax,
    jar: sec && !sec.done && PF.CORE.indexOf(k) >= 0 ? { cents: sec.jar || PF_PAY.JAR } : null, breakReadyS: PF.BREAK.readyS,
    v5: typeof pf5View_ === 'function' ? pf5View_(S) : null };
  if (extra) Object.keys(extra).forEach(function (x) { v[x] = extra[x]; });
  return v;
}
function pfMe_(token) {
  var s = pfKid_(token), r = msRoster_().filter(function (x) { return x.id === s.sid; })[0];
  if (!r) throw new Error('Please sign in again.');
  if (!pfEnabled_(r.id, r)) throw new Error('Pathfinder is not open yet. Your teacher will tell you when.');
  return r;
}

/* ---- calls from the boy's page ---- */
function pfHello(token) {
  var s = msSession_(token); if (s.role !== 'kid') return { show: false };
  if (!pfEnabled_(s.sid)) return { show: false };
  var all = pfSessionsOf_(s.sid), last = all[all.length - 1], road = last ? pfRoad_(last) : null;
  var done = road ? PF.CORE.filter(function (k) { return road[k].status !== 'todo' && road[k].status !== 'going'; }).length : 0;
  var jars = road ? PF.CORE.filter(function (k) { return road[k].status === 'going'; }).length : 0;
  var more = last && pfIsTest_(s.sid) && typeof pf5Left_ === 'function' ? pf5Left_(last) : 0;   /* v5: TEST boys come back for the v5 stops */
  return { show: !last || last.status === 'active' && done < PF.CORE.length || (last.status === 'core' && more > 0), started: !!last, done: done, of: PF.CORE.length, left: PF.CORE.length - done, jars: jars, draft: pfIsTest_(s.sid), more: more,
    confirm: pfIsTest_(s.sid) ? pfConfirmPending_(all) : [] };   /* E2: subjects whose next lesson opens with the 5-question check */
}
function pfStart(token) {
  var r = pfMe_(token);
  return pfLock_(function () {
    var S = pfActive_(r.id), now = Date.now();
    if (!S) S = pfCreate_(r.id, 'full', 'boy', pfGrade_(r, null));
    pfStale_(S, now);
    var pause = pfSitting_(S, now);
    if (S.state.pause && S.state.pause.kind === 'slow' && now >= S.state.pause.until) S.state.pause = null;
    S.state.payV = S.state.payV || PF_PAY.VERSION;
    S.state.pause = pause || S.state.pause;
    pfSaveSession_(S);
    return pfView_(S, r);
  });
}
function pfPractice(token, answers) {
  var r = pfMe_(token);
  return pfLock_(function () {
    var S = pfActive_(r.id); if (!S) throw new Error('Please start again.');
    var right = PF.PRACTICE.filter(function (p, i) { return answers && pfNfc_(answers[i]) === pfNfc_(p.ans); }).length;
    S.state.practice = { right: right, of: 3, at: Date.now() }; S.state.young = right < 2;
    pfSaveSession_(S);
    return pfView_(S, r, { practiceRight: right });
  });
}
/* Open (or continue) a section and return its current question. */
function pfOpen(token, subject) {
  var r = pfMe_(token); subject = String(subject);
  var v5 = typeof pf5IsStop_ === 'function' && pf5IsStop_(subject);
  if (PF.CORE.indexOf(subject) < 0 && !v5) throw new Error('That part of the road opens later.');
  return pfLock_(function () {
    var S = pfActive_(r.id), now = Date.now(); if (!S) throw new Error('Please start again.');
    if (!S.state.practice) throw new Error('Do the three practice questions first.');
    var pause = pfSitting_(S, now); if (pause) { S.state.pause = pause; pfSaveSession_(S); return pfView_(S, r); }
    if (S.state.pause && (S.state.pause.kind === 'slow' || S.state.pause.kind === 'stretch')) { pfSaveSession_(S); return pfView_(S, r); }
    S.state.pause = null; var extra = {}; S.state.payV = S.state.payV || PF_PAY.VERSION;
    if (v5 && subject !== 'LANG') return pf5Open_(S, r, subject, now);
    if (v5 && !pf5ReadyFor_(S, subject)) throw new Error('That part of the road opens later.');
    var sec = S.state.sections[subject];
    if (sec && sec.done) throw new Error('This part is finished.');
    if (!sec) {
      var g = S.grade === '' ? null : Number(S.grade), placed = (plPlacements_()[r.id] || {})[subject];
      var isNew = !placed && !msRows_('state').some(function (x) { return String(x[0]) === r.id; });
      sec = S.state.sections[subject] = pfNewSection_(subject, g, placed ? placed.level : 0, isNew, S.state.young, pfAppr_(r.id));
      if (PF.CORE.indexOf(subject) >= 0) sec.jar = PF_PAY.JAR;
      else { var rl = pf5LevelOf_(S, 'READ'); if (rl) { sec.startLevel = rl; sec.mu = sec.theta = pfThetaOfLevel_(rl); sec.sd = sec.se = PF.ENGINE.sdCurrent; } }   /* Language Arts starts at his Reading estimate; no jar */
      extra.reveal = subject;
    }
    S.state.cursec = subject; sec.appr = pfAppr_(r.id);
    if (!sec.cur) { var it = pfNext_(sec, pfSeen_(S)); if (!it) return pfFinish_(S, r, subject, extra); pfSetCur_(sec, it, now); }
    pfSaveSession_(S);
    return pfView_(S, r, extra);
  });
}
/* One answer: saved at once, then the next question (or the pause / end screen). a = {item, value, ms, idk, conf} */
function pfAnswer(token, a) {
  var r = pfMe_(token);
  return pfLock_(function () {
    var S = pfActive_(r.id), now = Date.now(); if (!S) throw new Error('Please start again.');
    var k = S.state.cursec, sec = k && S.state.sections[k];
    if (!sec || !sec.cur) return pfView_(S, r);                               /* nothing pending (a double tap): just show where he is */
    if (!a || String(a.item) !== sec.cur.i) return pfView_(S, r, { stale: true });
    sec.appr = pfAppr_(r.id);
    var it = pfIx_().byId[sec.cur.i], value = String(a.value == null ? '' : a.value).slice(0, 60), pNow = sec.cur.p, extra = {};
    var rec = pfRecord_(sec, it, value, Math.max(0, Number(a.ms) || 0), !!a.idk, a.conf === 'sure' || a.conf === 'unsure' ? a.conf : '');
    pfTab_('answers').appendRow([new Date(), S.id, r.id, k, sec.ans.length, it.id, it.skill, it.strand, it.level, it.fmt, value, rec.x, rec.c, rec.t, rec.r, rec.k, rec.f, Math.round(sec.theta * 100) / 100, Math.round(sec.se * 100) / 100, rec.ph === 'b' ? 'boundary' : 'adaptive', it.status !== 'Approved' ? 'draft' : '']);
    S.state.sit.last = now; rec.p = pNow;
    pfAfterAnswer_(S, r, k, sec, it, rec, extra);
    if (sec.rapidRun >= PF.RAPID.run) {                                        /* 3 rapid guesses in a row */
      sec.rapidRun = 0; S.state.pause = { kind: 'slow', until: now + PF.RAPID.slowMs, section: k };
      S.flags.push({ at: new Date(now).toISOString(), by: 'pathfinder', action: 'paused: 3 rapid guesses in a row in ' + k, alert: 1 });
      pfSaveSession_(S); return pfView_(S, r, extra);
    }
    var nx = pfNext_(sec, pfSeen_(S));
    if (!nx) return pfFinish_(S, r, k, extra);
    if (pfCapReached_(S, now)) { S.state.pause = { kind: 'sitting', until: now + PF.SIT.breakMin * 60000 }; pfSetCur_(sec, nx, now); pfSaveSession_(S); return pfView_(S, r, extra); }
    pfSetCur_(sec, nx, now);
    pfMaybeBreak_(S, sec, rec, it, nx, now, extra);
    pfSaveSession_(S);
    return pfView_(S, r, extra);
  });
}
function pfReady(token) { /* after "Let's slow down": clear the pause, then carry on in the same section */
  var r = pfMe_(token);
  var k = pfLock_(function () { var S = pfActive_(r.id), now = Date.now(); if (!S) throw new Error('Please start again.'); if (S.state.pause && (S.state.pause.kind === 'slow' || S.state.pause.kind === 'stretch') && now >= S.state.pause.until - 1500) S.state.pause = null; pfSaveSession_(S); return S.state.cursec || (S.state.pause && S.state.pause.section) || ''; });
  return k ? pfOpen(token, k) : pfStart(token);
}
/* A section ends: result row, placement (unless retake / bank ceiling), session status. Runs inside the lock. */
function pfFinish_(S, r, k, extra) {
  extra = extra || {};
  var sec = S.state.sections[k]; sec.done = true; sec.cur = null; S.state.cursec = null;
  var res = pfResult_(sec, pfLadder_(k)), applied = false;
  var core = PF.CORE.indexOf(k) >= 0;   /* v5: Language Arts is reported, not placed, and pays nothing */
  if (res.status === 'done' && core) { plUpsert_(r.id, k, plMathLevel_(res.start), res.start, 'pathfinder'); applied = true; }
  res.applied = applied;
  /* E2: the first lesson after Pathfinder opens with a 5-question check of the placed level (TEST boys only while PF_LIVE_GRADES = []) */
  if (applied && res.engine === 'E' && pfIsTest_(r.id)) { var cf = S.state.confirm = S.state.confirm || {}; cf[k] = { stage: 'placed', level: plMathLevel_(res.start), from: plMathLevel_(res.start), at: Date.now(), hist: [] }; }
  var eDetail = res.engine === 'E' ? { kind: 'core', engine: 'E', placedLevel: res.placedLevel, z: res.z, seRaw: res.seRaw, lz: res.lz, cusum: res.cusum } : null;
  pfTab_('results').appendRow([new Date(), S.id, r.id, k, res.status, res.level, res.start, res.theta, res.se, JSON.stringify(res.range), res.confidence, JSON.stringify(res.strands), JSON.stringify(res.skills).slice(0, 45000), JSON.stringify(res.gaps), JSON.stringify(res.errors), JSON.stringify(res.flags), res.used, applied ? 'yes' : 'no', 'pathfinder'].concat(core ? (eDetail ? [JSON.stringify(eDetail)] : []) : [JSON.stringify({ kind: 'lang', startLevel: sec.startLevel, top2: Object.keys(res.errors).sort(function (a, b) { return res.errors[b] - res.errors[a]; }).slice(0, 2) })]));
  sec.result = { status: res.status, level: res.level, start: res.start, applied: applied, confidence: res.confidence, gaps: res.gaps };
  var road = pfRoad_(S), coreDone = core && PF.CORE.every(function (c) { return road[c].status !== 'todo' && road[c].status !== 'going'; });
  if (coreDone) { S.status = 'core'; S.flags.push({ at: new Date().toISOString(), by: 'pathfinder', action: 'core sections done' }); }
  var jarPaid = core ? pfPay_(S, sec.jar || PF_PAY.JAR, k + '|jar', 'jar for finishing ' + k, '') : 0;
  pfBadge_(S, 'explorer-' + k);
  var finPaid = 0; if (coreDone) { finPaid = pfPay_(S, PF_PAY.FINISH, 'finish', 'reached the Finish line', ''); pfBadge_(S, 'pathfinder'); }
  pfSaveSession_(S);
  extra.finished = { section: k, label: PF.STOPS.filter(function (s) { return s[0] === k; })[0][1], status: res.status, coreDone: coreDone, jar: jarPaid, finish: finPaid, v5: core ? 0 : 1 };
  return pfView_(S, r, extra);
}

/* ================================================================== PHASE 2: rewards, effort rules, road (07 PATHFINDER BUILD PROMPT v3)
   Pay is for effort only (amounts in Money.gs PF_PAY): a real try, "I don't know this yet" after the wait, an edge bonus, a jar per
   finished section, and the Finish line. A right answer as such pays nothing; rapid guesses pay 0. Every payment has its own ledger key,
   so a resume or a double tap never pays twice. Staff screens show effort counts, never money. */
var PF_LANDS = {   /* the road's lands; MATH/READ/WRIT reuse the Journey Map names. The art chat may swap these. */
  READ: { name: 'Story Road', ic: '📖', color: '#2e9b47' }, MATH: { name: 'Number Road', ic: '📐', color: '#2f5bd3' },
  WRIT: { name: 'Writer’s Desk', ic: '✒️', color: '#8e44ad' }, LANG: { name: 'Word Bridge', ic: '🔤', color: '#d35400' },
  HEB: { name: 'Aleph-Beis Hills', ic: '🕎', color: '#1f6f8b' }, COMP: { name: 'Circuit City', ic: '💻', color: '#34495e' },
  LIFE: { name: 'Market Square', ic: '🪙', color: '#b7950b' }, HELP: { name: 'Compass Point', ic: '🧭', color: '#7f8c8d' }
};
function pfLands_() { if (typeof PF5 !== 'undefined') Object.keys(PF5.LANDS).forEach(function (k) { PF_LANDS[k] = PF_LANDS[k] || PF5.LANDS[k]; }); return PF_LANDS; }   /* v5 lands (file load order safe) */
function pfSetCur_(sec, it, now) { sec.cur = { i: it.id, at: now, p: Math.round(pfP_(sec.theta, it.b, pfGuess_(it)) * 1000) / 1000 }; }
function pfEdge_(p) { return p != null && p >= PF_PAY.EDGE_LO && p <= PF_PAY.EDGE_HI; }
/* Pure: what one answer pays. a = stored answer {r rapid, k idk}; p = chance right when shown; dknOk = the button wait was respected. */
function pfPayFor_(a, p, dknOk) {
  if (a.r) return { cents: 0, edge: false };
  if (a.k) return { cents: dknOk ? PF_PAY.DKN : 0, edge: false };
  return { cents: PF_PAY.TRY + PF_PAY.EDGE_ALL, edge: true };   /* v107 option B: effort bonus on every real try (was: only when well matched) */
}
function pfPay_(S, cents, keyTail, reason, itemId) {
  if (!cents || cents <= 0 || typeof moneyPost_ !== 'function') return 0;
  var row = moneyPost_({ sid: S.sid, type: 'earn', cents: cents, reason: 'Pathfinder: ' + reason, key: 'pf|' + S.id + '|' + keyTail, lessonId: 'PATHFINDER', itemId: itemId || '' });
  if (!row) return 0;
  S.state.earned = (S.state.earned || 0) + cents; return cents;
}
function pfBadge_(S, b) { var a = S.state.badges = S.state.badges || []; if (a.indexOf(b) < 0) a.push(b); }
function pfHash_(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
/* "How sure are you?": grades 3-8 only, about 1 in 3 scored questions (the page skips it after a rapid answer or "I don't know"). */
function pfAskSure_(S, g, itemId) { return g != null && g >= PF.SURE.minGrade && !S.state.young && pfHash_(S.id + '|' + itemId) % PF.SURE.every === 0; }
/* After one stored answer: pay, streak, brain power, celebration. Fills extra for the page. */
function pfAfterAnswer_(S, r, k, sec, it, rec, extra) {
  var young = !!S.state.young || (S.grade !== '' && Number(S.grade) <= 2), wait = young ? PF.IDK_YOUNG_MS : PF.IDK_MS;
  var dknOk = rec.k && rec.t >= wait - 1000, pay = pfPayFor_(rec, rec.p, dknOk), got = 0, edge = 0;
  if (PF.CORE.indexOf(k) < 0) pay = { cents: 0, edge: false };             /* v5: Language Arts pays nothing (no new money rewards) */
  if (pay.cents) {
    if (rec.k) got = pfPay_(S, PF_PAY.DKN, it.id + '|dkn', "I don't know this yet", it.id);
    else { got = pfPay_(S, PF_PAY.TRY, it.id + '|try', 'a real try', it.id); if (pay.edge) edge = pfPay_(S, PF_PAY.EDGE_ALL, it.id + '|edge', 'effort bonus', it.id); }
  }
  extra.paid = { cents: got + edge, edge: !!edge, edgeCents: edge, rapid: !!rec.r, dkn: !!rec.k };
  sec.power = (sec.power || 0) + (rec.r ? 0 : rec.k ? 0.5 : 1);
  sec.streak = !rec.r && !rec.k && rec.x ? (sec.streak || 0) + 1 : 0;
  if (sec.streak >= 3) extra.spark = sec.streak;
  var real = sec.ans.filter(function (a) { return !a.r && !a.k; }), n = real.length;
  if (!rec.r && !rec.k && rec.x && n - (sec.cheerAt || 0) >= PF.CHEER_GAP) {
    var hard = real.filter(function (a) { return a.p != null && a.p < 0.5; }).length;
    var msgs = ['That’s ' + n + ' real tries.', hard >= 4 ? 'You stuck with ' + hard + ' hard ones.' : 'You read every question. That’s how it’s done.', rec.t >= 8000 ? 'You took your time. That’s how it’s done.' : 'Steady work. Keep going.'];
    extra.cheer = msgs[Math.floor(n / PF.CHEER_GAP) % msgs.length]; sec.cheerAt = n;
  }
  extra.power = Math.round(sec.power * 10) / 10;
}
/* Stretch break after 12 minutes of question time in this sitting (sum of answer times, each capped), never during boundary
   questions and never right after a wrong answer: only after a right answer or when the next question is a new strand. */
function pfMaybeBreak_(S, sec, rec, it, nx, now, extra) {
  var st = S.state.sit; st.qms = (st.qms || 0) + Math.min(PF.BREAK.capMs, rec.t || 0); st.brk = st.brk || 0;
  if (st.qms - st.brk < PF.BREAK.qMin * 60000) return;
  if (sec.phase === 'boundary' || rec.ph === 'b') return;
  var newStrand = nx && nx.strand !== it.strand;
  if (!(rec.x && !rec.r && !rec.k) && !newStrand) return;
  st.brk = st.qms; S.state.pause = { kind: 'stretch', until: now + PF.BREAK.readyS * 1000, section: S.state.cursec }; extra.stretch = 1;
}
/* Effort for the staff report: tries, "I don't know" and rapid counts per section (no money), and sure-but-wrong skills. */
function pfEffort_(S) {
  var out = {}, ix = pfIx_();
  Object.keys(S.state.sections || {}).forEach(function (k) {
    var ans = S.state.sections[k].ans || [], sw = {};
    ans.forEach(function (a) { if (a.f === 'sure' && !a.x && !a.r && !a.k) { var sk = ix.byId[a.i] ? ix.byId[a.i].skill : ''; if (sk) sw[sk] = (sw[sk] || 0) + 1; } });
    out[k] = { tries: ans.filter(function (a) { return !a.r && !a.k; }).length, dkn: ans.filter(function (a) { return a.k; }).length, rapid: ans.filter(function (a) { return a.r; }).length, sureWrong: sw };
  });
  return out;
}
/* Pay checks for pfSelfTest (a)-(g). Pure where it can be; (d) uses an in-memory ledger. */
function pfPaySelfTest_() {
  var out = { problems: [] };
  /* (a) + (e): simulate 200 boys per subject; pay per section and edge share by level */
  ['MATH', 'READ'].forEach(function (subj) {
    var s = 17; function rnd() { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }
    var top = pfTopLevel_(subj), byLv = {};
    for (var n = 0; n < 200; n++) {
      var trueTh = -4.5 + rnd() * (pfThetaOfLevel_(top) + 4.5), lv = pfLevelOf_(trueTh), grade = Math.max(0, Math.min(8, lv - 1));
      var sec = pfNewSection_(subj, grade, 0, false, false), it, guard = 0, cents = PF_PAY.JAR, edges = 0, tries = 0;
      while ((it = pfNext_(sec, null, rnd)) && guard++ < 80) {
        var p = pfP_(sec.theta, it.b, pfGuess_(it)), x = rnd() < pfP_(trueTh, it.b, pfGuess_(it));
        var rec = pfRecord_(sec, it, x ? it.ans : (it.wrong && it.wrong.length ? it.wrong[0][0] : 'zz'), 20000, false, '');
        var pay = pfPayFor_(rec, p, false); cents += pay.cents; tries++; if (pay.edge) edges++;
      }
      var b = byLv[lv] = byLv[lv] || { n: 0, cents: 0, edge: 0, tries: 0 }; b.n++; b.cents += cents; b.edge += edges; b.tries += tries;
    }
    var rows = Object.keys(byLv).filter(function (l) { return byLv[l].n >= 5; }).map(function (l) { var b = byLv[l]; return { level: +l, pay: Math.round(b.cents / b.n), edgeShare: Math.round(100 * b.edge / Math.max(1, b.tries)) / 100 }; });
    /* the bank's top level is checked apart: boys there run out of questions sooner (fewer written so far), so they pay less */
    var body = rows.filter(function (x) { return x.level < top; }), topRow = rows.filter(function (x) { return x.level === top; })[0];
    var pays = (body.length ? body : rows).map(function (x) { return x.pay; }), mean = pays.reduce(function (a, b) { return a + b; }, 0) / pays.length;
    var spread = Math.max.apply(null, pays.map(function (x) { return Math.abs(x - mean) / mean; }));
    out[subj] = { meanPayDollars: Math.round(mean) / 100, maxOffMean: Math.round(spread * 100) + '%', byLevel: rows };
    if (topRow && body.length && Math.abs(topRow.pay - mean) / mean > 0.05) out[subj].note = 'Level ' + top + ' (top of the questions written so far) pays ' + Math.round(100 * (topRow.pay - mean) / mean) + '% vs the mean: fewer questions exist there yet';
    if (spread > 0.10) out.problems.push(subj + ': pay per section differs by more than 10% across levels (' + Math.round(spread * 100) + '%)');
    var es = rows.map(function (x) { return x.edgeShare; }); if (Math.max.apply(null, es) - Math.min.apply(null, es) > 0.25) out.problems.push(subj + ': edge-bonus share varies a lot by level');
  });
  /* (b) DKN never pays more than a try; (c) rapid pays 0; (g) no right-answer pay path */
  if (PF_PAY.DKN > PF_PAY.TRY) out.problems.push('DKN pays more than a try');
  if (pfPayFor_({ r: 1, k: 0, x: 1 }, 0.5, true).cents !== 0) out.problems.push('a rapid guess pays');
  [0.1, 0.5, 0.9].forEach(function (p) { if (pfPayFor_({ r: 0, k: 0, x: 1 }, p, false).cents !== pfPayFor_({ r: 0, k: 0, x: 0 }, p, false).cents) out.problems.push('pay depends on right/wrong'); });
  if (pfPayFor_({ r: 0, k: 1 }, 0.5, false).cents !== 0) out.problems.push('"I don\'t know" pays before the wait');
  /* (d) a resume or double submit never pays twice; the jar pays once per section */
  if (typeof moneyPost_ === 'function') {
    var keep = MONEY_STORE_, rows = []; MONEY_STORE_ = { rows: function () { return rows; }, append: function (o) { rows = rows.concat(o); }, remove: function () { return 0; } };
    try {
      var S = { id: 'PF-selftest', sid: 'TEST-SELFTEST', state: {} };
      pfPay_(S, PF_PAY.TRY, 'X|try', 't', 'X'); pfPay_(S, PF_PAY.TRY, 'X|try', 't', 'X'); pfPay_(S, PF_PAY.JAR, 'READ|jar', 'j', ''); pfPay_(S, PF_PAY.JAR, 'READ|jar', 'j', '');
      if (rows.length !== 2) out.problems.push('double pay: ' + rows.length + ' rows for 2 events');
    } finally { MONEY_STORE_ = keep; }
  }
  /* (f) held items are never selected for a boy who is not a TEST boy */
  var held = PF_BANK.items.filter(function (it) { return it.hold; }).map(function (it) { return it.id; }); out.held = held;
  held.forEach(function (id) { if (pfItemOk_(pfIx_().byId[id], 1)) out.problems.push(id + ' is held but could be selected'); });
  return out;
}

/* ---- staff ---- */
function pfGridMap_() {
  var out = {}, sh = pfTab_('sessions'), n = sh.getLastRow();
  if (n >= 2) sh.getRange(2, 1, n - 1, PF.TABS.sessions.length).getValues().forEach(function (v) {
    var sid = String(v[1]); if (!sid) return;
    var st = pfJson_(v[8], {}), flags = pfJson_(v[9], []), done = 0;
    Object.keys(st.sections || {}).forEach(function (k) { if (st.sections[k].done) done++; });
    out[sid] = { session: String(v[0]), status: String(v[2]), done: done, of: PF.STOPS.length + (pfIsTest_(sid) && typeof PF5 !== 'undefined' ? PF5.NEW_STOPS.length : 0), alert: flags.some(function (f) { return f.alert && !f.seen; }), unreliable: flags.some(function (f) { return f.unreliable; }) };
  });
  pfRows_('results').forEach(function (v) { var sid = String(v[2]), o = out[sid]; if (!o || String(v[1]) !== o.session || PF.CORE.indexOf(String(v[3])) < 0) return;   /* v5 stops show on his report, not in the grid */ (o.assessed = o.assessed || {})[String(v[3])] = { level: Number(v[5]) || 0, status: String(v[4]), confidence: String(v[10]), start: String(v[6]) }; });
  Object.keys(out).forEach(function (sid) { var o = out[sid]; o.dot = o.status === 'complete' ? 'complete' : o.status === 'core' ? 'core' : o.done || o.status === 'active' ? 'going' : 'none'; });
  return out;
}
function pfReport(token, sid) { tlGuard_(token, sid);
  var s = pfStaff_(token); sid = String(sid || '');
  var r = msRoster_().filter(function (x) { return x.id === sid; })[0]; if (!r) throw new Error('That student is not on the list.');
  var all = pfSessionsOf_(sid), res = pfRows_('results').filter(function (v) { return String(v[2]) === sid; }).map(function (v) {
    return { at: new Date(v[0]).getTime(), session: String(v[1]), subject: String(v[3]), status: String(v[4]), level: Number(v[5]), start: String(v[6]), theta: Number(v[7]), se: Number(v[8]), range: pfJson_(v[9], {}), confidence: String(v[10]), strands: pfJson_(v[11], {}), skills: pfJson_(v[12], []), gaps: pfJson_(v[13], []), errors: pfJson_(v[14], {}), flags: pfJson_(v[15], []), used: Number(v[16]), applied: String(v[17]) === 'yes', detail: pfJson_(v[19], null) };
  });
  var names = {}; ['MATH', 'READ', 'LANG'].forEach(function (k) { (plList_(k) || []).forEach(function (x) { names[x[0]] = x[1]; }); });
  var codes = {}; res.forEach(function (x) { Object.keys(x.errors).forEach(function (c) { codes[c] = typeof pf5CodeName_ === 'function' ? pf5CodeName_(c) : (PF_BANK.codes || {})[c] || c; }); });
  return { name: r.name, sid: sid, staff: pfWho_(s), live: !pfIsTest_(sid), liveGrades: PF_LIVE_GRADES.slice(), strandNames: PF.STRANDS, names: names, codes: codes, stops: PF.STOPS,
    notes: typeof pf5Notes_ === 'function' ? pf5Notes_(sid) : [], aboutFamilyAsk: typeof PF_X !== 'undefined' ? (PF_X.about_me || []).filter(function (x) { return x.id === 'family'; }).map(function (x) { return x.screen; })[0] || '' : '',
    sessions: all.map(function (o) { return { id: o.id, status: o.status, kind: o.kind, grade: o.grade, created: new Date(o.created).getTime(), by: o.by, flags: o.flags, practice: o.state.practice, young: o.state.young, road: pfRoad_(o), effort: pfEffort_(o), confirm: o.state.confirm || null }; }), results: res, place: plPlacements_()[sid] || {} };
}
/* Any staff member may start a retake or mark a session unreliable; logged with who and when. */
function pfRetake(token, sid, why, unreliable) { tlGuard_(token, sid);
  var s = pfStaff_(token); sid = String(sid || ''); why = String(why || '').slice(0, 200);
  var r = msRoster_().filter(function (x) { return x.id === sid; })[0]; if (!r) throw new Error('That student is not on the list.');
  return pfLock_(function () {
    var all = pfSessionsOf_(sid), last = all[all.length - 1], at = new Date().toISOString(), who = pfWho_(s);
    if (last) { last.flags.push({ at: at, by: who, action: unreliable ? 'marked unreliable' : 'retake started', why: why, unreliable: unreliable ? 1 : 0 }); if (last.status === 'active') last.status = 'closed'; pfSaveSession_(last); }
    var S = pfCreate_(sid, 'retake', who, last ? (last.grade === '' ? null : last.grade) : pfGrade_(r, null));
    S.flags.push({ at: at, by: who, action: 'retake created', why: why }); pfSaveSession_(S);
    return pfReport(token, sid);
  });
}
function pfSeenAlert(token, sid) { tlGuard_(token, sid);
  pfStaff_(token); sid = String(sid || '');
  return pfLock_(function () { pfSessionsOf_(sid).forEach(function (o) { var ch = false; o.flags.forEach(function (f) { if (f.alert && !f.seen) { f.seen = 1; ch = true; } }); if (ch) pfSaveSession_(o); }); return true; });
}
function pfSetGrade(token, sid, grade) { tlGuard_(token, sid);
  pfStaff_(token); sid = String(sid || ''); var g = String(grade).toUpperCase() === 'K' ? 0 : Number(grade);
  if (!(g >= 0 && g <= 8)) throw new Error('Pick a grade, K to 8.');
  return pfLock_(function () { var S = pfActive_(sid); if (!S) throw new Error('There is no Pathfinder open for this student. Start one first.'); S.grade = g; pfSaveSession_(S); return true; });
}
/* Called by plPlanFor_ (Placement.gs): gap fillers go at the front of his lineup while Pathfinder's placement stands. */
var PF_GAPS_ = null;
function pfGapsMap_() {
  if (PF_GAPS_) return PF_GAPS_; var out = {};
  try { pfRows_('results').forEach(function (v) { if (String(v[17]) !== 'yes') return; out[String(v[2]) + '|' + String(v[3])] = { start: String(v[6]), gaps: pfJson_(v[13], []) }; }); } catch (e) {}
  return (PF_GAPS_ = out);
}
function pfPlanPatch_(sid, p, out) {
  Object.keys(out).forEach(function (k) {
    var o = out[k], pk = p[k]; if (!o || !o.path || !pk || pk.by !== 'pathfinder') return;
    var g = pfGapsMap_()[sid + '|' + k]; if (!g || g.start !== o.start || !g.gaps.length) return;
    var gaps = g.gaps.filter(function (id) { return o.path.indexOf(id) < 0; }); if (!gaps.length) return;
    o.path = gaps.concat(o.path); o.start = gaps[0]; o.gaps = gaps;
  });
}

/* ================================================================== CONFIRMATION (Addendum E 5 with E2; v6 Stage 2). TEST boys only.
   The first lesson in Reading / Math after a Pathfinder placement opens with a 5-question check of the placed Level (questions
   from that Level's skills in the Pathfinder bank, ones he did not see in the Pathfinder first). 4-5 right: keep. 3: keep and
   recheck after the next lesson. 0-2: move down one Level ("confirmation move"). E2: 5/5 -> the next lesson opens with the check
   of the Level above; 4+/5 there -> move up one Level ("confirmation move up"). No money: the check pays nothing.
   A staff placement (by !== 'pathfinder') cancels a pending check. State: session.state.confirm[subject]. */
function pfConfirmStep_(stage, right, typed) {
  var C = PF.CONFIRM, rc = typed ? C.typedRecheck : C.recheck;   /* F8.4: typed check moves down at 0-1 of 5; 4-choice at 0-2 */
  if (stage === 'up') return right >= C.up ? { move: 1, next: 'done', log: 'confirmation move up' } : { move: 0, next: 'done', log: 'confirmation step-up check ' + right + '/' + C.n + ': stays' };
  if (right >= C.n) return { move: 0, next: 'up', log: 'confirmation ' + right + '/' + C.n + ': keep; the next lesson checks the Level above' };
  if (right >= C.keep) return { move: 0, next: 'done', log: 'confirmation ' + right + '/' + C.n + ': keep' };
  if (right >= rc) return stage === 'recheck' ? { move: 0, next: 'done', log: 'confirmation recheck ' + right + '/' + C.n + ': keep' } : { move: 0, next: 'recheck', log: 'confirmation ' + right + '/' + C.n + ': keep and recheck after the next lesson' };
  return { move: -1, next: 'done', log: 'confirmation move' };
}
function pfConfirmPending_(all) {
  var out = {}; (all || []).forEach(function (o) { var c = (o.state && o.state.confirm) || {}; Object.keys(c).forEach(function (k) { out[k] = c[k].stage !== 'done'; }); });
  return Object.keys(out).filter(function (k) { return out[k]; });
}
/* the latest session that holds a confirmation record for this subject */
function pfConfirmSession_(sid, subj) { var all = pfSessionsOf_(sid); for (var i = all.length - 1; i >= 0; i--) if (all[i].state && all[i].state.confirm && all[i].state.confirm[subj]) return all[i]; return null; }
/* Pure: 5 question ids at one level. Never a question he already answered (Addendum F v2 F1.1); typed questions first (F8.4),
   one per skill, then choice; a passage he has not read fills in when too few. ("check in class" skills first, F1.5, waits for
   the F1.4 skill labels.) Fewer than 5 back = the bank is exhausted at that level. */
function pfConfirmPick_(subj, lvl, seen, appr, salt) {
  var ix = pfIx_(), n = PF.CONFIRM.n, pool = (ix.bySubj[subj] || []).filter(function (it) { return it.level === lvl && !seen[it.id] && pfItemOk_(it, appr) && (it.fmt === 'CHOICE' || it.fmt === 'TYPE'); });
  var key = function (it) { return (it.fmt === 'TYPE' ? 0 : 1e7) + pfHash_(salt + '|' + it.id) % 1e6; };
  var solo = pool.filter(function (it) { return !it.passage; }).sort(function (a, b) { return key(a) - key(b); }), out = [], sk = {};
  solo.forEach(function (it) { if (out.length < n && !sk[it.skill]) { out.push(it.id); sk[it.skill] = 1; } });
  solo.forEach(function (it) { if (out.length < n && out.indexOf(it.id) < 0) out.push(it.id); });
  if (out.length < n) {
    var ps = {}; pool.forEach(function (it) { if (it.passage) (ps[it.passage] = ps[it.passage] || []).push(it); });
    var pids = Object.keys(ps).filter(function (pid) { return !(ix.byPassage[pid] || []).some(function (id) { return seen[id]; }); }).sort(function (a, b) { return pfHash_(salt + a) - pfHash_(salt + b); });
    if (pids.length) ps[pids[0]].forEach(function (it) { if (out.length < n) out.push(it.id); });
  }
  return out;
}
/* every Pathfinder and confirmation question this boy has answered (all his sessions) */
function pfAnsweredBy_(sid) {
  var seen = {}; pfSessionsOf_(sid).forEach(function (o) { (o.state.seen || []).forEach(function (id) { seen[id] = 1; });
    Object.keys(o.state.sections || {}).forEach(function (k) { (o.state.sections[k].ans || []).forEach(function (a) { seen[a.i] = 1; }); });
    Object.keys(o.state.confirm || {}).forEach(function (k) { (o.state.confirm[k].hist || []).forEach(function (h) { (h.items || []).forEach(function (id) { seen[id] = 1; }); }); }); });
  return seen;
}
function pfConfirmStart(token, subj) {
  var r = pfMe_(token); subj = String(subj); if (!pfIsTest_(r.id) || PF.CORE.indexOf(subj) < 0) return null;
  return pfLock_(function () {
    var S = pfConfirmSession_(r.id, subj); if (!S) return null;
    var c = S.state.confirm[subj], now = Date.now(); if (!c || c.stage === 'done') return null;
    var p = (plPlacements_()[r.id] || {})[subj];
    if (!p || p.by !== 'pathfinder' || p.level !== c.level) { c.stage = 'done'; c.hist.push({ at: now, log: 'confirmation cancelled: placement changed by staff' }); pfSaveSession_(S); return null; }
    if (c.stage === 'recheck' && c.wait) { c.wait = 0; pfSaveSession_(S); return null; }   /* "recheck after the next lesson": this lesson runs first */
    var lvl = c.stage === 'up' ? c.level + 1 : c.level;
    if (!c.items || c.itemsFor !== c.stage + lvl) {
      c.items = lvl <= 9 ? pfConfirmPick_(subj, lvl, pfAnsweredBy_(r.id), pfAppr_(r.id), S.id + '|' + c.stage) : []; c.itemsFor = c.stage + lvl;
      c.typed = c.items.filter(function (id) { return pfIx_().byId[id].fmt === 'TYPE'; }).length >= PF.CONFIRM.typedMin ? 1 : 0;
    }
    if (c.items.length < PF.CONFIRM.n) { c.stage = 'done'; c.hist.push({ at: now, log: 'confirmation skipped: bank exhausted at Level ' + lvl + ' (questions not yet answered)' }); pfSaveSession_(S); return null; }
    pfSaveSession_(S);
    var fake = { ans: [], eng: 'E' };
    return { subject: subj, stage: c.stage, level: lvl, draft: true, items: c.items.map(function (id) { var o = pfPresent_(pfIx_().byId[id], fake, S.id + '|cf'); delete o.n; return o; }) };
  });
}
/* answers: [{item, value}] in the order shown. Scored here; the page never sees a key. */
function pfConfirmSave(token, subj, answers) {
  var r = pfMe_(token); subj = String(subj); if (!pfIsTest_(r.id) || PF.CORE.indexOf(subj) < 0) throw new Error('This check is not open.');
  return pfLock_(function () {
    var S = pfConfirmSession_(r.id, subj), c = S && S.state.confirm[subj]; if (!c || c.stage === 'done' || !c.items) throw new Error('This check is finished.');
    var got = {}; (answers || []).forEach(function (a) { if (a && a.item != null) got[String(a.item)] = String(a.value == null ? '' : a.value).slice(0, 60); });
    var marks = c.items.map(function (id) { return got[id] != null ? pfScore_(pfIx_().byId[id], got[id]).x : 0; }), right = marks.reduce(function (x, y) { return x + y; }, 0);
    var step = pfConfirmStep_(c.stage, right, !!c.typed), from = c.level, to = Math.max(1, Math.min(9, from + step.move)), at = Date.now(), checked = c.stage === 'up' ? from + 1 : from;
    if (to !== from) { plUpsert_(r.id, subj, to, plFirst_(subj, to), 'pathfinder'); c.level = to; }
    /* logged here, apart from his Pathfinder answers: a confirmation never changes his Pathfinder estimate */
    c.hist.push({ at: at, stage: c.stage, level: checked, typed: c.typed ? 1 : 0, right: right, of: c.items.length, items: c.items.slice(), values: c.items.map(function (id) { return got[id] == null ? '' : got[id]; }), marks: marks, log: step.log, from: from, to: to });
    S.flags.push({ at: new Date(at).toISOString(), by: 'pathfinder', action: step.log + ' · ' + (subj === 'READ' ? 'Reading' : 'Math') + ' check of Level ' + checked + ': ' + right + '/' + c.items.length + (to !== from ? ' · Level ' + from + ' → ' + to : '') });
    c.stage = step.next; c.items = null; c.itemsFor = ''; if (step.next === 'recheck') c.wait = 1;
    pfSaveSession_(S);
    return { subject: subj, right: right, of: marks.length, moved: to - from, level: to, next: step.next };
  });
}

/* Per-level simulation table (07 PATHFINDER BUILD PROMPT v4): n boys whose true level is inside each level 1-9, for Math and Reading.
   Each row: mean absolute error (logits), share whose true level is inside the reported range, average questions. */
function pfSimTable_(n, o) {
  o = o || {}; var out = {};
  ['MATH', 'READ'].forEach(function (k) { out[k] = []; for (var lv = 1; lv <= 9; lv++) { var r = pfSimulate_(n, k, 101 + lv, { level: lv, appr: o.appr, engine: o.engine, world: o.world }); out[k].push({ level: lv, mae: r.meanAbsError, inRange: r.levelInRange, items: r.meanItems, bias: r.meanError, in90: r.in90, placed: r.placedTrue, below: r.placedBelow, above: r.placedAbove, cusumNote: r.cusumNote, retake: r.retake }); } });
  return out;
}
/* Run from the editor. Checks the bank against the map and simulates 200 boys per subject. Creates the PF_ tabs if missing.
   v4 adds: counts per subject and level (Approved vs Draft), every ladder skill has questions, passage links and A/B pairs,
   accepted answer forms, drag-to-order and tap-a-point keys, the live switch. opts.levels: also run pfSimTable_(opts.levels). */
function pfSelfTest(opts) {
  opts = opts && typeof opts === 'object' && !opts.authMode ? opts : {};
  var ix = pfIx_(), out = { version: PF.VERSION, bank: PF_BANK.version, liveGrades: PF_LIVE_GRADES.slice(), items: PF_BANK.items.length, problems: [] };
  var allIds = PF_BANK.items.map(function (it) { return it.id; }), seenId = {};
  allIds.forEach(function (id) { if (seenId[id]) out.problems.push('duplicate item_id ' + id); seenId[id] = 1; });
  ['MATH', 'READ'].forEach(function (k) {
    var ladder = pfLadder_(k), ids = ix.bySubj[k].map(function (it) { return it.id; }), per = {}, bySkill = {};
    out[k] = { items: ids.length, skillsWithItems: Object.keys(ix.bySubj[k].reduce(function (o, it) { o[it.skill] = 1; return o; }, {})).length, topLevel: pfTopLevel_(k), topLevelApproved: pfTopLevel_(k, 1) };
    ix.bySubj[k].forEach(function (it) {
      var c = per[it.level] = per[it.level] || { items: 0, approved: 0, draft: 0, held: 0 }; c.items++; if (it.status === 'Approved' && !it.hold) c.approved++; else c.draft++; if (it.hold) c.held++;
      (bySkill[it.skill] = bySkill[it.skill] || []).push(it);
      if (ladder.indexOf(it.skill) < 0) out.problems.push(it.id + ': skill not on the map');
      if (!it.wrong || !it.wrong.length) out.problems.push(it.id + ': no coded wrong answers');
      (it.wrong || []).forEach(function (w) { if (!w[1] || !(PF_BANK.codes || {})[w[1]]) out.problems.push(it.id + ': undefined code ' + w[1]); });
      if (pfScore_(it, it.ans).x !== 1) out.problems.push(it.id + ': its own answer does not score right');
      (it.accept || []).forEach(function (a) { if (pfScore_(it, a).x !== 1) out.problems.push(it.id + ': accepted form "' + a + '" does not score right'); });
      (it.wrong || []).forEach(function (w) { var sc = pfScore_(it, w[0]); if (sc.x || sc.code !== w[1]) out.problems.push(it.id + ': wrong answer "' + w[0] + '" scores ' + (sc.x ? 'right' : sc.code)); });
      if (it.passage && !PF_BANK.passages[it.passage]) out.problems.push(it.id + ': links to a missing passage ' + it.passage);
      if (/^PF\.R\.L\d\d\.[SI]\.[AB]\.Q/.test(it.id) && !it.passage) out.problems.push(it.id + ': passage question with no passage');
      if (it.fmt === 'ORDER' && (!it.tiles || it.tiles.length < 2 || pfScore_(it, it.tiles.join(', ')).x)) out.problems.push(it.id + ': drag tiles missing or already in order');
      if (it.fmt === 'POINT' && (!it.pt || !it.grid || (it.wpt || []).length !== it.wrong.length || pfScore_(it, it.pt.join(',')).x !== 1)) out.problems.push(it.id + ': tap-a-point key missing');
    });
    out[k].byLevel = per;
    /* every ladder skill has questions: 3 forms (A/B/C), or for a passage skill one question in each passage version (A and B) */
    var thin = [];
    ladder.forEach(function (id) { if (PF.FIXED.indexOf(id) >= 0) return; var its = bySkill[id] || [], pas = its.filter(function (it) { return it.passage; });
      var ok = its.length >= 3 || (pas.length === its.length && its.length >= 2 && pas.some(function (it) { return /\.A$/.test(it.passage); }) && pas.some(function (it) { return /\.B$/.test(it.passage); }));
      if (!ok) thin.push(id + ' (' + its.length + ')'); });
    if (thin.length) out.problems.push(k + ': skills with too few questions: ' + thin.join(', '));
    out[k].passageSkillsAB = ladder.filter(function (id) { var its = bySkill[id] || []; return its.length && its.length < 3 && its.every(function (it) { return it.passage; }); }).length;
    var dup = ids.filter(function (x, i) { return ids.indexOf(x) !== i; }); if (dup.length) out.problems.push(k + ' duplicate ids: ' + dup.join(', '));
    out[k].simulation = pfSimulate_(200, k, 11);
  });
  /* every A/B passage pair asks the same skills, in the same order */
  var pairs = {}; Object.keys(PF_BANK.passages).forEach(function (pid) { var m = /^(.*)\.([AB])$/.exec(pid); if (m) (pairs[m[1]] = pairs[m[1]] || {})[m[2]] = (ix.byPassage[pid] || []).slice().sort().map(function (id) { return ix.byId[id].skill; }).join(','); });
  out.passagePairs = Object.keys(pairs).length;
  Object.keys(pairs).forEach(function (k) { var p = pairs[k]; if (!p.A || !p.B) out.problems.push(k + ': passage has no A/B partner'); else if (p.A !== p.B) out.problems.push(k + ': versions A and B ask different skills'); });
  /* answer boxes: the typed forms the v4 banks list */
  [['234 R1', '234 r 1'], ['234 R1', '234 remainder 1'], ['234 R1', '234R1'], ['-1 1/2', '−1 1/2'], ['-3/2', '−1 1/2'], ['1/2', '½'], ['3 1/2', '3½'], ['1:05', '1 : 05'], ['3/9', '1/3'], ['-4', '−4']].forEach(function (x) {
    if (!pfSame_(x[0], x[1])) out.problems.push('answer box: "' + x[1] + '" is not read as "' + x[0] + '"'); });
  if (pfSame_('234 R1', '234')) out.problems.push('answer box: a remainder answer accepts the quotient alone');
  /* the live switch: empty list = TEST boys only; a real boy gets only Approved questions with no hold */
  if (PF_LIVE_GRADES.some(function (g) { return !(g >= 0 && g <= 8); })) out.problems.push('PF_LIVE_GRADES holds a grade outside K-8');
  ['MATH', 'READ'].forEach(function (k) { var sec = pfNewSection_(k, 4, 0, false, false, 1), it, n = 0;
    while ((it = pfNext_(sec, null, function () { return 0.3; })) && n++ < 60) { if (it.status !== 'Approved' || it.hold) { out.problems.push('a real student was given ' + it.id + ' (' + it.status + ')'); break; } pfRecord_(sec, it, it.ans, 20000, false, ''); } });
  if (opts.levels) out.levels = pfSimTable_(opts.levels);
  if (typeof pf5SelfTest_ === 'function') { var v5 = pf5SelfTest_(); out.v5 = v5; v5.problems.forEach(function (x) { out.problems.push('v5: ' + x); }); }
  var pay = pfPaySelfTest_(); out.pay = pay; pay.problems.forEach(function (x) { out.problems.push('pay: ' + x); });
  try { ['sessions', 'answers', 'results', 'queue', 'notes'].forEach(pfTab_); out.tabs = 'PF_Sessions, PF_Answers, PF_Results, PF_Queue, PF_Notes ready'; } catch (e) { out.tabs = 'not checked: ' + e.message; }
  Logger.log(JSON.stringify(out, null, 1));
  return out;
}
