/* KODESH PATHFINDER, stage B (blueprint PF-TWO1 by 4cc@, 2026-11-16; local build by the Claude Code builder).
   TEST BOYS ONLY. A standalone Kodesh placement test on the existing Pathfinder engine and page (?pf=1&test=kodesh):
   - 4.1 a staircase per section (Kriyah, Lashon Hakodesh, Chumash, Rashi, Mishnayos, Gemara): start at his grade's level,
     2 items a level (a 3rd when split), up 1 on a pass (up 2 on the first step only), down 1 on a fail, stop when a passed level
     sits right under a failed one or after 12 items; never fewer than 6 unless he hits the top or the bottom.
   - 4.3 caps: Chumash <= Kriyah + 1, Rashi <= Chumash, Mishnayos needs Chumash 4+, Gemara grade 5+ and Mishnayos 5+,
     age lock (no level above grade + 1 without the rebbe), rebbe override (staff only, locked, logged with who and when).
   - 4.4 the profile ({test:"kodesh", date, form, strands, rebbe_override}) is saved in PF_Results like every Pathfinder result
     (subject KODESH, detail_json = the profile); every answer goes to PF_Answers (section K.<strand>).
     His Kodesh sessions live in their own tab, PF_Ksessions (same columns as PF_Sessions), so the General Studies
     Pathfinder never sees them (pfActive_, pfHello, the staff grid all read PF_Sessions only).
   - 8.2-8.4, 8.7: Hebrew tap units = space-separated words (a maqaf group is one unit), right to left; Rashi font when
     pic.font or pic.rashi_font is "rashi"; speech reads only the English stem; listen-and-tap items whose recorded clip is
     missing are skipped; a boy never sees the same item twice within 12 months; Form A first, then B.
   STAGE C (PathfinderKodeshRebbe.js): Read to Rebbe feeds the Kriyah level (pfkKriyahMerge_) and the grade 3+ plan (pfkPlan_).
   NOT HERE: the home-screen hookup, quick climb and booster (stage D). NO MONEY: nothing here pays,
   and no placement is applied to his lessons (the profile is saved for stage D and the rebbe).
   Real boys: pfkAllowed_ is TEST boys only (PFK_LIVE stays false until a Head of School DECISION), and every item also goes
   through pfItemOk_ (a real boy would get Approved items only; the bank is all Draft). Hebrew comes only from
   PathfinderBankKodesh.js (PF_KODESH). */
/* STAGE 8 UPGRADE (PF-BUILD-V8, HoS DECISION 1940-ET; Claude Code builder 4cc@, 2026-11-16), all in place on the v294 design (DECISION 1510-ET):
   - bank pfk1 v3 (kit v3.2, 406 items: Chumash 9, Rashi 8-9 with Ramban); the shaky-top rule (engine v1.2): a top pass of 2 of 3
     starts him one level lower; the age lock is PF-TWO1 4.3 / engine: no level above his grade level + 1 (grade + 2) without the rebbe;
   - quick climb v2 (engine pfkClimb, a 90%-sure running score) for Kodesh strands of the daily path, behind PFK.CLIMB_ON ('test'):
     PathfinderDaily.js pfdClimb_; with it off a "down" only adds "lessons suggest a step back" for the rebbe;
   - pfkCanOpen_ (engine pfkCanOpen): the server lock on Kodesh levels (daily path, pilot lock export);
   - PF-KODESH1 only: the content tracks placed by grade (profile.tracks) and "Kriyah complete gives his Kriyah time to Chumash";
   - pfkPilotExport: the PFK-PILOT1 CSVs (TEST codes only).
   v337: PFK_LIVE true and PFK.CLIMB_ON 'all' (Head of School: "turn it on for everyone"). */
var PFK_LIVE = true;   /* Kodesh Pathfinder for real boys: ON for every real boy, every grade (Head of School 2026-11-16 20:2x ET, "turn it on for everyone"; v337). PF_PAUSE_NEW still stops NEW starts. false = TEST boys only. */
var PFK = {
  VERSION: 'pfk-0.2.0',
  TEST: 'kodesh',
  ORDER: ['KRI', 'HEB', 'CHU', 'RAS', 'MSH', 'GEM'],
  NAMES: { KRI: 'Kriyah', HEB: 'Lashon Hakodesh', CHU: 'Chumash', RAS: 'Rashi', MSH: 'Mishnayos', GEM: 'Gemara' },
  LANDS: { KRI: { ic: '🔤', color: '#1f6f8b' }, HEB: { ic: '📜', color: '#6c5ce7' }, CHU: { ic: '📖', color: '#2e7d32' }, RAS: { ic: '✒️', color: '#8e44ad' }, MSH: { ic: '📚', color: '#b7950b' }, GEM: { ic: '🏛️', color: '#a0522d' } },
  PER_LEVEL: 2, MAX_ITEMS: 12, MIN_ITEMS: 6, PASS_SHARE: 2 / 3,
  EXPOSE_DAYS: 365,
  BREAK_EVERY: 8, BREAK_S: 10,
  FMT: { 'read it, choose 1 of 4': 'CHOICE', 'tap the word': 'TAP', 'listen and tap': 'LISTEN', 'tap the same word': 'SAME', 'tap the same letter': 'SAME', 'put in order': 'ORDER' },
  /* recorded clips (PF-TWO1 8.1): clip key (the item's audio field after "CLIP ") -> a playable URL. Empty until a rebbe records
     them; the Script Property PFK_CLIPS (a JSON object of the same shape) is read too. An item whose clip is missing is skipped. */
  CLIPS: {},
  /* quick climb v2 (engine v1.2 PFK_RULES.CLIMB): 'test' = TEST boys only (open Head of School item); 'off'; 'all' only by a DECISION */
  CLIMB_ON: 'all',   /* v337 Head of School: on for everyone */
  CLIMB: { OK: 0.80, EASY: 0.94, HARD: 0.45, ERR: 0.10, DAYS: 14, WEEK_LIMIT: 1 },
  /* PF-KODESH1: content tracks are knowledge sequences placed by grade, no test (K -> 1, grade 1 -> 2, grades 2-8 -> 3);
     for grades 3-8 Levels 1-2 are "review available", not "not yet" */
  TRACKS: ['HAL', 'MID', 'NAV', 'PAR', 'TEF', 'YT'],
  TRACK_NAMES: { HAL: 'Halacha', MID: 'Middos and Pirkei Avos', NAV: 'Navi', PAR: 'Parsha', TEF: 'Tefillah', YT: 'Yom Tov' },
  KRI_TOP: 4,   /* Kriyah Levels 1-4: placed at 4 = Kriyah complete */
  /* ONLY WHAT A YESHIVA TEACHES (Head of School 2026-11-17: "no one knows what makaf or esnachta is. These are not taught skills…
     do better research what classic yeshivish style is teaching and expecting"). Typical boys' yeshiva: K-1 Aleph-Bais, nekudos,
     reading; late 1st-2nd Chumash with shorashim, prefixes and suffixes; 3rd Rashi and Rashi script; 3rd-4th Mishnayos; 5th-6th Gemara.
     Trop marks (makaf, esnachta), Targum Onkelos and Ramban are not part of the elementary curriculum, and "which seder / which sefer"
     is trivia, not a skill. Questions of these kinds are never asked (53 of 406; the bank file itself is unchanged). */
  NOT_TAUGHT: [/joined by a little line on top/i, /half-way rest mark/i, /^In which seder of the Mishnah/i, /^In which sefer of the Torah/i, /brings the Targum/i, /^Ramban\b/i]
};

/* ================================================================== BANK ADAPTER (pure) */
var PFK_IX_ = null;
function pfkUnits_(text) { return String(text == null ? '' : text).split(/\s+/).filter(function (w) { return w; }); }   /* a maqaf (U+05BE) is not a space: a maqaf group stays one unit */
function pfkNorm_(s) { return typeof pfNfc_ === 'function' ? pfNfc_(s) : String(s == null ? '' : s).normalize('NFC'); }
function pfkIx_() {
  if (PFK_IX_) return PFK_IX_;
  var byId = {}, byStrand = {};
  ((typeof PF_KODESH !== 'undefined' && PF_KODESH.items) || []).forEach(function (j) {
    var p = j.pic || {}, clip = /^CLIP\s+/.test(String(j.audio || '')) ? String(j.audio).replace(/^CLIP\s+/, '') : '';
    var it = { id: j.item_id, skill: j.skill_id, strand: j.strand, level: Number(j.level), format: j.format, fmt: PFK.FMT[j.format] || '', stem: String(j.stem || ''), audio: String(j.audio || ''), clip: clip,
      ans: j.answer, wrong: (j.wrong || []).map(function (w) { return [w.answer, w.code]; }), pic: p, b: j.b, form: j.form || 'A', status: j.status || 'Draft', hold: j.hold || '',
      idx: j.answer_index && j.answer_index.length ? Number(j.answer_index[0]) : null, subject: 'KODESH',
      /* "no form or twin repeated" (4.1): one item per target word form and per right answer in a section */
      twin: j.strand + '|' + pfkNorm_(j.target || j.answer), text: pfkNorm_(p.text || '') };
    byId[it.id] = it; (byStrand[it.strand] = byStrand[it.strand] || []).push(it);
  });
  return (PFK_IX_ = { byId: byId, byStrand: byStrand });
}
function pfkClips_() {
  var o = {}; Object.keys(PFK.CLIPS).forEach(function (k) { if (PFK.CLIPS[k]) o[k] = String(PFK.CLIPS[k]); });
  try { if (typeof pfkClipsFound_ === 'function') { var fd = pfkClipsFound_(); Object.keys(fd).forEach(function (k) { o[k] = fd[k]; }); } } catch (e) {}   /* the rebbe's uploads in HQ/"PFK clips ..." (PathfinderKodeshClips.js) */
  try { var p = PropertiesService.getScriptProperties().getProperty('PFK_CLIPS'), j = p ? JSON.parse(p) : {}; Object.keys(j || {}).forEach(function (k) { if (j[k]) o[k] = String(j[k]); }); } catch (e) {}
  return o;
}
/* Can this item be asked? ctx = {appr, seen, clips} */
function pfkTaught_(it) { if (it.pic && it.pic.kind === 'ramban') return false; for (var i = 0; i < PFK.NOT_TAUGHT.length; i++) if (PFK.NOT_TAUGHT[i].test(String(it.stem || ''))) return false; return true; }
function pfkUsable_(it, ctx) {
  if (!it || !it.fmt || !pfkTaught_(it)) return false;                                                   /* Read to Rebbe (stage C) and unknown formats */
  var ok = typeof pfItemOk_ === 'function' ? pfItemOk_(it, ctx.appr) : (ctx.appr ? it.status === 'Approved' && !it.hold : true);
  if (!ok) return false;                                                              /* a real boy: Approved with no hold only */
  if (it.fmt === 'LISTEN' && !(ctx.clips || {})[it.clip]) return false;               /* 8.4: missing clip -> the item is skipped */
  if (it.fmt === 'TAP' && (it.idx == null || it.idx < 0 || it.idx >= pfkUnits_(it.pic.text).length)) return false;
  if (it.fmt === 'ORDER' && String(it.ans).split('|').length < 2) return false;
  if (ctx.seen && ctx.seen[it.id]) return false;                                      /* 8.7: never the same item within 12 months */
  return true;
}
/* The levels this section can use for him: levels with at least 2 usable items, low to high. */
function pfkLevels_(k, ctx) {
  var n = {}; (pfkIx_().byStrand[k] || []).forEach(function (it) { if (pfkUsable_(it, ctx)) n[it.level] = (n[it.level] || 0) + 1; });
  return Object.keys(n).map(Number).filter(function (l) { return n[l] >= PFK.PER_LEVEL; }).sort(function (a, b) { return a - b; });
}

/* ================================================================== STAIRCASE (pure; 4.1) */
/* sec = {k, levels, visit: {li, ids}, first, rech, ans: [{i, x, c, t, lv, at}], done, stop, result} */
function pfkNewSection_(k, grade, ctx, now) {
  var lv = pfkLevels_(k, ctx), want = grade == null ? 4 : Number(grade) + 1, li = 0;
  for (var i = 0; i < lv.length; i++) if (lv[i] <= want) li = i;                     /* his grade's level; below the first level -> the first */
  var sec = { k: k, levels: lv, start: lv.length ? lv[li] : null, visit: { li: li, ids: [] }, first: true, rech: {}, ans: [], done: false, stop: '', started: now || Date.now(), cur: null };
  if (!lv.length) pfkStop_(sec, 'bank');
  return sec;
}
function pfkAt_(sec, j) { var L = sec.levels[j]; return sec.ans.filter(function (a) { return a.lv === L; }); }
/* A level is passed when at least 2 of 3 of everything asked there is right (2 of 2, 2 of 3; the same rule on a recheck). */
function pfkStatus_(sec, j) {
  var a = pfkAt_(sec, j), r = a.filter(function (x) { return x.x; }).length;
  if (a.length < 2) return '';
  return r / a.length >= PFK.PASS_SHARE - 1e-9 ? 'pass' : 'fail';
}
function pfkBoundary_(sec) { for (var j = sec.levels.length - 2; j >= 0; j--) if (pfkStatus_(sec, j) === 'pass' && pfkStatus_(sec, j + 1) === 'fail') return j; return -1; }
function pfkPool_(sec, ctx, j) {
  var L = sec.levels[j], ix = pfkIx_(), used = {}, twins = {};
  sec.ans.forEach(function (a) { var it = ix.byId[a.i]; used[a.i] = 1; if (it) twins[it.twin] = 1; });
  if (sec.cur) used[sec.cur.i] = 1;
  return (ix.byStrand[sec.k] || []).filter(function (it) { return it.level === L && !used[it.id] && !twins[it.twin] && pfkUsable_(it, ctx); });
}
/* Pick one item at the visit's level: his form first (A, then B on a later test), a passage he has not just read, then a fixed shuffle. */
function pfkPick_(sec, ctx) {
  var pool = pfkPool_(sec, ctx, sec.visit.li); if (!pool.length) return null;
  var ix = pfkIx_(), texts = {}; sec.ans.forEach(function (a) { var it = ix.byId[a.i]; if (it && it.text) texts[it.text] = 1; });
  var h = function (it) { return typeof pfHash_ === 'function' ? pfHash_((ctx.salt || '') + '|' + sec.k + '|' + it.id) : 0; };
  pool.sort(function (a, b) { return (a.form === (ctx.form || 'A') ? 0 : 1) - (b.form === (ctx.form || 'A') ? 0 : 1) || (texts[a.text] ? 1 : 0) - (texts[b.text] ? 1 : 0) || h(a) - h(b) || (a.id < b.id ? -1 : 1); });
  return pool[0];
}
function pfkStop_(sec, why) { sec.done = true; sec.stop = why; sec.cur = null; sec.result = pfkPlace_(sec); return 'stop'; }
function pfkVisit_(sec, j) { sec.visit = { li: j, ids: [] }; sec.vn = (sec.vn || 0) + 1; return 'go'; }
/* The visit is decided after 2 items that agree, or after 3. */
function pfkVisitDecided_(sec) {
  var ix = sec.visit.ids, L = sec.levels[sec.visit.li], a = sec.ans.filter(function (x) { return ix.indexOf(x.i) >= 0 && x.lv === L; }), r = a.filter(function (x) { return x.x; }).length;
  return a.length >= 3 || (a.length === 2 && r !== 1);
}
/* After a decided visit (or a level with no items left): move up or down, recheck, or stop. Returns 'go' or 'stop'. */
function pfkMove_(sec, ctx) {
  var li = sec.visit.li, top = sec.levels.length - 1, total = sec.ans.length, st = pfkStatus_(sec, li), wasFirst = sec.first;
  sec.first = false;
  if (total >= PFK.MAX_ITEMS) return pfkStop_(sec, 'max');
  if (!st) st = pfkAt_(sec, li).some(function (a) { return a.x; }) ? 'pass' : 'fail';   /* fewer than 2 asked (bank ran out): a single right counts as a pass */
  var b = pfkBoundary_(sec);
  if (b >= 0) {
    if (total >= PFK.MIN_ITEMS) return pfkStop_(sec, 'boundary');
    /* fewer than 6: check the edge again with fresh items (the failed level first, then the passed one), once each */
    var cand = [b + 1, b].filter(function (j) { return !sec.rech[j] && pfkPool_(sec, ctx, j).length > 0; });
    if (!cand.length) return pfkStop_(sec, 'boundary');
    sec.rech[cand[0]] = 1; return pfkVisit_(sec, cand[0]);
  }
  var t;
  if (st === 'pass') {
    if (li >= top) return pfkStop_(sec, 'top');
    t = li + (wasFirst && li + 2 <= top ? 2 : 1);                                       /* the first step only: up 2 */
    while (t <= top && (pfkStatus_(sec, t) === 'pass' || !pfkPool_(sec, ctx, t).length)) t++;
    if (t > top) return pfkStop_(sec, 'top');
  } else {
    if (li <= 0) return pfkStop_(sec, 'bottom');
    t = li - 1;
    while (t >= 0 && (pfkStatus_(sec, t) === 'fail' || !pfkPool_(sec, ctx, t).length)) t--;
    if (t < 0) return pfkStop_(sec, 'bottom');
  }
  return pfkVisit_(sec, t);
}
/* The next item for this section, or null when the section is finished. */
function pfkNext_(sec, ctx) {
  for (var guard = 0; guard < 30 && !sec.done; guard++) {
    if (sec.ans.length >= PFK.MAX_ITEMS) { pfkStop_(sec, 'max'); break; }
    var it = pfkPick_(sec, ctx);
    if (it) { sec.cur = { i: it.id, at: Date.now() }; return it; }
    if (pfkMove_(sec, ctx) === 'stop') break;                                             /* no item left at this level: decide with what he has */
  }
  return null;
}
/* Score one response. TAP: the unit index he tapped. ORDER: the pieces joined with " | ". Otherwise the chosen text (NFC). */
function pfkScore_(it, v) {
  v = String(v == null ? '' : v);
  if (it.fmt === 'TAP') { if (v !== '' && /^\d+$/.test(v) && Number(v) === it.idx) return { x: 1, code: '' }; return { x: 0, code: v === '' ? 'NO-TAP' : 'WRONG-WORD' }; }
  if (it.fmt === 'ORDER') { var key = function (s) { return pfkNorm_(s).split('|').map(function (x) { return x.trim(); }).join('|'); }; return key(v) === key(it.ans) ? { x: 1, code: '' } : { x: 0, code: (it.wrong[0] || [])[1] || 'SEQUENCE' }; }
  if (pfkNorm_(v) === pfkNorm_(it.ans)) return { x: 1, code: '' };
  var w = it.wrong.filter(function (p) { return pfkNorm_(p[0]) === pfkNorm_(v); })[0];
  return { x: 0, code: w ? w[1] : 'other' };
}
function pfkRecord_(sec, it, value, ms, ctx, now) {
  var sc = pfkScore_(it, value), a = { i: it.id, x: sc.x, c: sc.code, t: Math.round(Number(ms) || 0), lv: it.level, at: now || Date.now(), v: sec.vn || 0 };
  sec.ans.push(a); sec.visit.ids.push(it.id); sec.cur = null; sec.last = a.at;
  if (sec.ans.length >= PFK.MAX_ITEMS) pfkStop_(sec, 'max');
  else if (pfkVisitDecided_(sec)) pfkMove_(sec, ctx);
  return a;
}
/* 4.1.4-6: his starting level = the highest level he passed; top -> "may be higher: rebbe check"; bottom -> "getting ready". */
function pfkPlace_(sec) {
  var L = sec.levels, top = L.length - 1, best = -1, flags = [], level = null, j;
  if (!L.length) return { level: null, raw: null, flags: ['no questions yet for this section'], items: 0, right: 0, stop: sec.stop };
  for (j = 0; j <= top; j++) if (pfkStatus_(sec, j) === 'pass') best = j;
  if (best >= 0) { level = L[best]; if (best === top) flags.push('may be higher: rebbe check'); }
  else {
    var asked = sec.ans.map(function (a) { return a.lv; }), low = asked.length ? Math.min.apply(null, asked) : L[0], li = L.indexOf(low);
    level = L[0];
    if (li <= 0) flags.push('getting ready'); else { level = L[li - 1]; flags.push('not sure: rebbe check'); }
  }
  if (sec.stop === 'max' && pfkBoundary_(sec) < 0 && flags.indexOf('may be higher: rebbe check') < 0) flags.push('not sure: rebbe check');
  /* engine v1.2 shaky top: his top pass was decided on 3 answers (2 of 3), not at the top of the bank, and the level under it was not
     failed -> start him one level lower, where he surely succeeds (PF-TWO1 4.1 rule 4); quick climb lifts him back if he is higher */
  if (best > 0 && best < top && sec.stop !== 'top') {
    var atB = pfkAt_(sec, best), lastV = Math.max.apply(null, atB.map(function (a) { return a.v || 0; })), step = atB.filter(function (a) { return (a.v || 0) === lastV; });
    if (step.length === 3 && pfkStatus_(sec, best - 1) !== 'fail') { level = L[best - 1]; flags.push('shaky top pass: started one level lower'); }
  }
  return { level: level, raw: level, flags: flags, items: sec.ans.length, right: sec.ans.filter(function (a) { return a.x; }).length, stop: sec.stop,
    byLevel: L.map(function (l, i) { var a = pfkAt_(sec, i); return a.length ? [l, a.filter(function (x) { return x.x; }).length, a.length, pfkStatus_(sec, i)] : null; }).filter(function (x) { return x; }) };
}

/* ================================================================== SECTIONS AND CAPS (pure; PF-TWO1 2 and 4.3) */
/* Section 2: which Kodesh sections his grade takes. Kriyah tap from grade 3 up is given only when Read to Rebbe is below 95%
   (stage C): rtr = his Read to Rebbe summary (pfkRtrSummary_). With no reading yet, every boy takes the Kriyah tap section
   (his Kriyah level is needed for the caps); a reading that set no level (no passage passed) also keeps the tap section. */
function pfkPlan_(grade, rtr) {
  var g = grade == null ? 3 : Number(grade);
  if (g >= 3 && rtr && rtr.n && !rtr.tapNeeded) return pfkPlan_(grade).filter(function (k) { return k !== 'KRI'; });
  if (g <= 0) return ['KRI'];
  if (g === 1) return ['KRI', 'HEB', 'CHU'];
  if (g === 2) return ['KRI', 'HEB', 'CHU', 'RAS'];
  if (g <= 4) return ['KRI', 'HEB', 'CHU', 'RAS', 'MSH'];
  return PFK.ORDER.slice();
}
var PFK_NOT_YET_ = { KRI: 'not yet: grade K+', HEB: 'not yet: grade 1+', CHU: 'not yet: grade 1+', RAS: 'not yet: grade 2+', MSH: 'not yet: grade 3+', GEM: 'not yet: grade 5+' };
/* 4.2: his Kriyah level = the higher of the tap section and Read to Rebbe; 2+ levels apart -> "check Kriyah" for staff.
   tap = pfkPlace_ result (or null), rtr = pfkRtrSummary_ (or null). Returns a pfkPlace_-like {level, flags, tap, rtr} or null. */
function pfkKriyahMerge_(tap, rtr) {
  var tl = tap && tap.level != null ? tap.level : null, rl = rtr && rtr.level != null ? rtr.level : null, flags = [];
  if (!rtr || !rtr.n) return tap || null;
  if (tl == null && rl == null) return tap ? { level: null, flags: (tap.flags || []).concat(rtr.flags || []), tap: null, rtr: null } : null;
  var lv = Math.max(tl == null ? -1 : tl, rl == null ? -1 : rl);
  if (tl != null && lv === tl) flags = flags.concat(tap.flags || []);
  if (rl != null && lv === rl && (tl == null || rl > tl)) flags = flags.concat(rtr.flags || []);
  if (tl != null && rl != null) { flags.push('Kriyah: tap Level ' + tl + ', Read to Rebbe Level ' + rl); if (Math.abs(tl - rl) >= (typeof PFK_RTR !== 'undefined' ? PFK_RTR.GAP : 2)) flags.push('check Kriyah'); }
  else if (tl == null) flags.push('Kriyah from Read to Rebbe');
  else flags = flags.concat(rtr.flags || []);
  return { level: lv, flags: flags, tap: tl, rtr: rl };
}
/* raw: {strand: pfkPlace_ result} for the sections he finished; override: {strand: {level, by, at}}; rtr: Read to Rebbe summary.
   Returns the strands block of the profile with every cap applied and named in flags. */
function pfkCaps_(raw, grade, plan, override, rtr) {
  var out = {}, g = grade == null || grade === '' ? null : Number(grade), age = g == null ? null : g + 2;   /* grade level (g + 1) + 1: PF-TWO1 4.3, engine pfkApplyCaps */
  override = override || {};
  PFK.ORDER.forEach(function (k) {
    var o = { level: null, start_skill: null, how_sure: 'first look', flags: [] }, r = raw[k];
    if (k === 'KRI' && rtr && rtr.n) { r = pfkKriyahMerge_(r, rtr); if (r) { o.tap = r.tap; o.rtr = r.rtr; } }
    if (k === 'KRI' && r && r.level != null && r.level < PFK.KRI_TOP && (r.flags || []).indexOf('may be higher: rebbe check') >= 0) {   /* he passed every Kriyah question there is */
      r = { level: PFK.KRI_TOP, flags: (r.flags || []).filter(function (x) { return x !== 'may be higher: rebbe check'; }).concat(['passed every Kriyah question: Kriyah complete (the rebbe may check with Read to Rebbe)']), tap: r.tap, rtr: r.rtr }; }
    if (plan.indexOf(k) < 0 && !(k === 'KRI' && rtr && rtr.n)) o.flags.push(PFK_NOT_YET_[k]);
    else if (k === 'MSH' && (!out.CHU || out.CHU.level == null || out.CHU.level < 4)) o.flags.push('not yet: Chumash Level 4 first');
    else if (k === 'GEM' && (g == null || g < 5)) o.flags.push('not yet: grade 5+');
    else if (k === 'GEM' && (!out.MSH || out.MSH.level == null || out.MSH.level < 5)) o.flags.push('not yet: Mishnayos Level 5 first');
    else if (!r) o.flags = ['not taken yet'].concat(k === 'KRI' && rtr ? rtr.flags || [] : []);
    else {
      var lv = r.level; o.flags = (r.flags || []).slice();
      if (lv != null && age != null && lv > age) { lv = age; o.flags.push('age lock: grade + 1'); }
      if (lv != null && k === 'CHU' && out.KRI && out.KRI.level != null && out.KRI.level < PFK.KRI_TOP && lv > out.KRI.level + 1) {   /* the Kriyah cap holds back a boy still building his reading; once Kriyah is complete it does not limit Chumash (HoS 2026-11-17) */ lv = out.KRI.level + 1; o.flags.push('capped by Kriyah'); }
      if (lv != null && k === 'RAS' && out.CHU && out.CHU.level != null && lv > out.CHU.level) { lv = out.CHU.level; o.flags.push('capped by Chumash'); }
      o.level = lv; if (r.level !== lv) o.tested = r.level;
    }
    var ov = override[k];
    if (ov && ov.level != null) { if (o.level !== Number(ov.level)) o.suggest = o.level; o.level = Number(ov.level); o.flags.push('rebbe set (locked)'); o.locked = true; o.by = ov.by || ''; o.at = ov.at || ''; }
    out[k] = o;
  });
  return out;
}
/* the first skill at that level in curriculum order (the Kodesh lesson ladders), else the bank's first skill at that level */
var PFK_ORDER_ = null;
function pfkStartSkill_(k, lv) {
  if (lv == null) return null;
  var lvOf = function (id) { var m = /\.L(\d\d)\./.exec(String(id)); return m ? Number(m[1]) : null; };
  if (PFK_ORDER_ == null) { PFK_ORDER_ = {}; try { if (typeof sgpKodeshLessonsRead_ === 'function') PFK_ORDER_ = sgpKodeshLessonsRead_().order || {}; } catch (e) { PFK_ORDER_ = {}; } }
  var ladder = PFK_ORDER_[k === 'HEB' ? 'LSH' : k] || [], hit = ladder.filter(function (id) { return lvOf(id) === lv; })[0];
  if (hit) return hit;
  /* no ladder here (KodeshMore not readable): the bank's own skill of this strand at this level, else none (never made up) */
  var pre = k === 'HEB' ? 'HEB.' : 'LK.' + k + '.', ids = {}; (pfkIx_().byStrand[k] || []).forEach(function (it) { if (lvOf(it.skill) === lv && it.skill.indexOf(pre) === 0) ids[it.skill] = 1; });
  return Object.keys(ids).sort()[0] || null;
}
/* 4.4: the profile */
function pfkProfile_(st, date) {
  var raw = {}; Object.keys(st.secs || {}).forEach(function (k) { var s = st.secs[k]; if (s.done && s.result) raw[k] = s.result; });
  var strands = pfkCaps_(raw, st.grade, st.plan || pfkPlan_(st.grade, st.rtr), st.override || {}, st.rtr || null);
  Object.keys(strands).forEach(function (k) { var o = strands[k]; if (o.level == null) { delete o.start_skill; delete o.how_sure; } else o.start_skill = pfkStartSkill_(k, o.level); });
  /* PF-KODESH1: Kriyah complete (placed at the top of Kriyah) -> his Kriyah time goes to Chumash */
  if (strands.KRI && strands.KRI.level != null && strands.KRI.level >= PFK.KRI_TOP) { strands.KRI.complete = true; strands.KRI.flags.push('Kriyah complete: Kriyah time goes to Chumash'); }
  var d = new Date(date || Date.now());
  return { test: PFK.TEST, tracks: pfkTracks_(st.grade), date: d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2), form: st.form || 'A', strands: strands, rebbe_override: st.override || {} };
}

/* PF-KODESH1 content tracks: placed by grade, no test. Each has a level and its first skill there (curriculum order). */
function pfkTracks_(grade) {
  var g = grade == null || grade === '' || isNaN(Number(grade)) ? null : Number(grade), out = {};
  PFK.TRACKS.forEach(function (k) {
    var lv = g == null ? null : g <= 0 ? 1 : g === 1 ? 2 : 3;
    out[k] = { level: lv, start_skill: lv == null ? null : pfkStartSkill_(k, lv), how: 'by grade', review: g != null && g >= 3 ? [1, 2] : [], flags: lv == null ? ['no grade on the roster'] : g >= 3 ? ['Levels 1-2: review available'] : [] };
  });
  return out;
}
/* engine pfkCanOpen: only his level and below, never above his grade level + 1. A strand with no level cannot be opened. */
function pfkCanOpen_(profile, grade, strand, level) {
  var st = profile && profile.strands ? profile.strands[strand] : null;
  if (!st || st.level == null) return false;
  return Number(level) <= Number(st.level) && (grade == null || grade === '' || Number(level) <= Number(grade) + 2);
}
/* engine pfkClimb (quick climb v2): st = {level, up, down, n, day0, moves: [{day, delta}], locked}; returns 'up' | 'down' | null */
function pfkClimbStart_(level, day0, locked) { return { level: level, up: 0, down: 0, n: 0, day0: day0 || 0, moves: [], locked: !!locked }; }
function pfkClimb_(st, right, day, minLevel, maxLevel) {
  var R = PFK.CLIMB;
  if (st.locked || day - st.day0 >= R.DAYS) return null;
  minLevel = minLevel || 1; maxLevel = maxLevel || 9;
  st.n++;
  st.up += right ? Math.log(R.EASY / R.OK) : Math.log((1 - R.EASY) / (1 - R.OK));
  st.down += right ? Math.log(R.HARD / R.OK) : Math.log((1 - R.HARD) / (1 - R.OK));
  var bound = Math.log((1 - R.ERR) / R.ERR);
  if (st.up < -bound) st.up = 0;
  if (st.down < -bound) st.down = 0;
  var move = null;
  if (st.down >= bound && st.level > minLevel) move = -1;
  else if (st.up >= bound && st.level < maxLevel) move = 1;
  if (!move) return null;
  if (st.moves.filter(function (m) { return day - m.day < 7; }).length >= R.WEEK_LIMIT) return null;
  st.level += move; st.up = 0; st.down = 0; st.n = 0; st.moves.push({ day: day, delta: move });
  return move > 0 ? 'up' : 'down';
}
function pfkClimbOn_(sid) { return PFK.CLIMB_ON === 'all' || (PFK.CLIMB_ON === 'test' && typeof pfIsTest_ === 'function' && pfIsTest_(sid)); }

/* ================================================================== SIMULATION (pure; for pfkSelfTest and the Node harness) */
/* n TEST boys; each has a true level per strand. P(right) = c + (1 - c) / (1 + e^(-2.5 (true - level + 0.5))), c = 1 / options. */
function pfkSimulate_(n, seed, o) {
  o = o || {}; var s = seed || 7; function rnd() { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }
  var ctx = { appr: o.appr ? 1 : 0, seen: null, clips: o.clips || {}, form: 'A', salt: 'sim' }, rows = {};
  for (var b = 0; b < n; b++) {
    PFK.ORDER.forEach(function (k) {
      if (o.only && o.only !== k) return;
      var lv0 = pfkLevels_(k, ctx); if (!lv0.length) return;
      var tl = o.level != null ? o.level : lv0[0] - 1 + Math.floor(rnd() * (lv0[lv0.length - 1] - lv0[0] + 3));   /* true level, one past either end of the bank */
      var grade = o.grade != null ? o.grade : Math.max(0, Math.min(8, tl - 1 + Math.floor(rnd() * 5) - 2));
      ctx.salt = 'sim' + b;
      var sec = pfkNewSection_(k, grade, ctx, 0), it, g = 0;
      while ((it = pfkNext_(sec, ctx)) && g++ < 40) {
        var opts = it.fmt === 'TAP' ? pfkUnits_(it.pic.text).length : it.fmt === 'ORDER' ? 6 : 1 + it.wrong.length, c = 1 / Math.max(2, opts);
        var p = c + (1 - c) / (1 + Math.exp(-2.5 * (tl - it.level + 0.5))), x = rnd() < p;
        var v = it.fmt === 'TAP' ? String(x ? it.idx : (it.idx + 1) % opts) : it.fmt === 'ORDER' ? (x ? it.ans : 'x | y') : (x ? it.ans : (it.wrong[0] || ['zz'])[0]);
        pfkRecord_(sec, it, v, 9000, ctx, 0);
      }
      var res = sec.result || pfkPlace_(sec), want = Math.max(sec.levels[0], Math.min(sec.levels[sec.levels.length - 1], tl));
      var R = rows[k] = rows[k] || { boys: 0, exact: 0, within1: 0, below: 0, above: 0, items: [], tooFew: 0, tooMany: 0, stops: {} };
      R.boys++; if (res.level === want) R.exact++; if (Math.abs(res.level - want) <= 1) R.within1++; if (res.level < want) R.below++; if (res.level > want) R.above++;
      R.items.push(sec.ans.length); R.stops[sec.stop] = (R.stops[sec.stop] || 0) + 1;
      if (sec.ans.length > PFK.MAX_ITEMS) R.tooMany++;
      if (sec.ans.length < PFK.MIN_ITEMS && sec.stop !== 'top' && sec.stop !== 'bottom') R.tooFew++;
    });
  }
  Object.keys(rows).forEach(function (k) { var R = rows[k], it = R.items; R.minItems = Math.min.apply(null, it); R.maxItems = Math.max.apply(null, it); R.meanItems = Math.round(it.reduce(function (a, b) { return a + b; }, 0) / it.length * 10) / 10; delete R.items; });
  return rows;
}

/* ================================================================== SERVER (Google services) */
function pfkAllowed_(sid) { if (pfIsTest_(sid)) return true; if (!PFK_LIVE) return false; return !(typeof PF_PAUSE_NEW !== 'undefined' && PF_PAUSE_NEW && !pfkActive_(sid)); }   /* v337: every real boy, every grade (not tied to PF_LIVE_GRADES) */
function pfkTab_() { if (!PF.TABS.ksessions) PF.TABS.ksessions = PF.TABS.sessions.slice(); return pfTab_('ksessions'); }   /* PF_Ksessions */
function pfkSessionsOf_(sid) {
  var sh = pfkTab_(), n = sh.getLastRow(); if (n < 2) return [];
  var v = sh.getRange(2, 1, n - 1, PF.TABS.ksessions.length).getValues(), out = [];
  for (var i = 0; i < v.length; i++) if (String(v[i][1]) === sid) out.push({ row: i + 2, id: String(v[i][0]), sid: sid, status: String(v[i][2]), kind: String(v[i][3]), grade: v[i][4], created: v[i][5], by: String(v[i][7]), state: pfJson_(v[i][8], {}), flags: pfJson_(v[i][9], []) });
  return out;
}
function pfkActive_(sid) { var all = pfkSessionsOf_(sid); for (var i = all.length - 1; i >= 0; i--) if (all[i].status === 'active') return all[i]; return null; }
function pfkSave_(S) {
  var json = JSON.stringify(S.state); if (json.length > 48000) throw new Error('This Pathfinder record is too large. Ask staff to start a retake.');
  pfkTab_().getRange(S.row, 1, 1, PF.TABS.ksessions.length).setValues([[S.id, S.sid, S.status, S.kind, S.grade == null ? '' : S.grade, S.created, new Date(), S.by, json, JSON.stringify(S.flags || [])]]);
}
/* items he answered in a Kodesh Pathfinder in the last 12 months (8.7) */
function pfkSeenSince_(all, now) {
  var o = {}, from = now - PFK.EXPOSE_DAYS * 86400000;
  all.forEach(function (S) { Object.keys((S.state && S.state.secs) || {}).forEach(function (k) { (S.state.secs[k].ans || []).forEach(function (a) { if ((a.at || 0) >= from) o[a.i] = 1; }); }); });
  return o;
}
function pfkCreate_(sid, grade, by, now) {
  var all = pfkSessionsOf_(sid), form = all.length % 2 ? 'B' : 'A';                 /* 8.7: Form A first, then B */
  var rtr = typeof pfkRtrSummaryOf_ === 'function' ? pfkRtrSummaryOf_(sid, now) : null;   /* stage C: his Read to Rebbe so far */
  var S = { id: 'PFK-' + Utilities.getUuid().slice(0, 8), sid: sid, status: 'active', kind: 'kodesh', grade: grade == null ? '' : grade, created: new Date(now), by: by, flags: [],
    state: { v: 1, test: PFK.TEST, grade: grade == null ? null : grade, form: form, plan: pfkPlan_(grade, rtr), secs: {}, skip: {}, cur: null, n: 0, seen: Object.keys(pfkSeenSince_(all, now)), override: {}, rtr: rtr } };
  if (grade == null) S.flags.push({ at: new Date(now).toISOString(), by: 'pathfinder', action: 'grade unknown: grade 3 sections used' });
  var sh = pfkTab_(); sh.appendRow([S.id, sid, S.status, S.kind, S.grade, S.created, new Date(), by, JSON.stringify(S.state), JSON.stringify(S.flags)]); S.row = sh.getLastRow();
  return S;
}
function pfkCtx_(S) { var seen = {}; (S.state.seen || []).forEach(function (id) { seen[id] = 1; }); return { appr: pfAppr_(S.sid), seen: seen, clips: pfkClips_(), form: S.state.form || 'A', salt: S.id }; }
function pfkMe_(token) {
  var s = pfKid_(token), r = msRoster_().filter(function (x) { return x.id === s.sid; })[0];
  if (!r) throw new Error('Please sign in again.');
  if (!pfkAllowed_(r.id)) throw new Error('The Kodesh Pathfinder is not open yet. Your teacher will tell you when.');
  return r;
}
function pfkAnswerRow_(S, k, sec, it, value, a) {
  pfTab_('answers').appendRow([new Date(a.at), S.id, S.sid, 'K.' + k, sec.ans.length, it.id, it.skill, it.strand, it.level, it.fmt, (it.fmt === 'TAP' && /^\d+$/.test(String(value)) ? String(value) + ':' + (pfkUnits_(it.pic.text)[Number(value)] || '') : String(value)).slice(0, 200), a.x,   /* K4: a tap is stored as index + word */ a.c, a.t, 0, 0, '', '', '', 'kodesh', it.status !== 'Approved' ? 'draft' : '']);
}
/* A section ends: one PF_Results row (subject K.<strand>, detail_json tagged test:"kodesh"). No placement change, no pay. */
function pfkSectionRow_(S, k, sec) {
  var r = sec.result || {}, errs = {}; sec.ans.forEach(function (a) { if (!a.x && a.c && a.c !== 'other') errs[a.c] = (errs[a.c] || 0) + 1; });
  pfTab_('results').appendRow([new Date(), S.id, S.sid, 'K.' + k, 'done', r.level == null ? '' : r.level, '', '', '', '{}', '', '{}', '[]', '[]', JSON.stringify(errs), JSON.stringify(r.flags || []), sec.ans.length, 'no', 'pathfinder-kodesh',
    JSON.stringify({ test: PFK.TEST, kind: 'section', strand: k, start: sec.start, stop: sec.stop, levels: sec.levels, byLevel: r.byLevel, right: r.right, items: r.items, form: S.state.form })]);
}
function pfkProfileRow_(S, by) {
  var pr = pfkProfile_(S.state, Date.now());
  pfTab_('results').appendRow([new Date(), S.id, S.sid, 'KODESH', 'done', '', '', '', '', '{}', 'first look', JSON.stringify(pr.strands), '[]', '[]', '{}', '[]', Object.keys(S.state.secs).reduce(function (n, k) { return n + S.state.secs[k].ans.length; }, 0), 'no', by || 'pathfinder-kodesh', JSON.stringify(pr)]);
  return pr;
}
/* Move on to the next section that is due (or finish the test). Returns the item to show, or null when the test is done. */
function pfkAdvance_(S, ctx, now, extra) {
  var st = S.state;
  for (var i = 0; i < st.plan.length; i++) {
    var k = st.plan[i], sec = st.secs[k];
    if (sec && sec.done) continue;
    if (st.skip[k]) continue;
    if (!sec) {
      var why = pfkSkipWhy_(st, k); if (why) { st.skip[k] = why; continue; }
      sec = st.secs[k] = pfkNewSection_(k, st.grade, ctx, now);
      if (sec.done) { pfkSectionRow_(S, k, sec); continue; }
      if (extra && st.cur && st.cur !== k) extra.next = { k: k, label: PFK.NAMES[k] };
    }
    st.cur = k;
    if (sec.cur) return pfkIx_().byId[sec.cur.i];
    var it = pfkNext_(sec, ctx); if (it) return it;
    pfkSectionRow_(S, k, sec);
    if (extra) extra.finished = { k: k, label: PFK.NAMES[k] };
  }
  st.cur = null;
  if (S.status === 'active') { S.status = 'complete'; st.profile = pfkProfileRow_(S); if (extra) extra.end = 1; }
  return null;
}
/* Stage C: a Read to Rebbe saved while his test is open re-plans the sections he has not started (grade 3+ Kriyah tap rule). */
function pfkReplan_(st) {
  var want = pfkPlan_(st.grade, st.rtr);
  st.plan = PFK.ORDER.filter(function (k) { return want.indexOf(k) >= 0 || st.secs[k]; });
  return st.plan;
}
/* Mishnayos waits for Chumash Level 4; Gemara for grade 5 and Mishnayos Level 5 (4.3): those sections are not asked. */
function pfkSkipWhy_(st, k) {
  if (k !== 'MSH' && k !== 'GEM') return '';
  var pr = pfkProfile_(st, Date.now()).strands, o = pr[k];
  return o.level == null && o.flags.some(function (f) { return /^not yet/.test(f); }) && !(st.secs[k]) ? o.flags.filter(function (f) { return /^not yet/.test(f); })[0] : '';
}
function pfkView_(S, r, extra) {
  var st = S.state, k = st.cur, sec = k && st.secs[k], g = st.grade, kv = { test: PFK.TEST, version: PFK.VERSION, form: st.form, n: st.n || 0 };
  kv.sections = st.plan.map(function (x) { var s = st.secs[x]; return { k: x, label: PFK.NAMES[x], ic: PFK.LANDS[x].ic, color: PFK.LANDS[x].color, status: s && s.done ? 'done' : st.skip[x] ? 'later' : s ? 'going' : 'todo' }; });
  if (sec && sec.cur) { var it = pfkIx_().byId[sec.cur.i]; kv.section = { k: k, label: PFK.NAMES[k], asked: sec.ans.length, max: PFK.MAX_ITEMS }; kv.item = pfkPresent_(it, S, sec); }
  if (extra) Object.keys(extra).forEach(function (x) { kv[x] = extra[x]; });
  if (S.status === 'complete') kv.end = 1;
  kv.brk = !!(extra && extra.brk);
  return { kodesh: kv, appUrl: ScriptApp.getService().getUrl(), name: r.name, first: String(r.name).split(' ')[0], grade: g, young: g != null && g <= 2, draft: pfIsTest_(S.sid), practice: { right: 3, of: 3 }, version: PF.VERSION, road: {}, lands: {} };
}
/* What the page may see of an item: never the key (no answer, no answer_index). Hebrew only from the bank. */
/* Head of School 2026-11-17 ("which word has a dash that's read as two? I don't know what that is"): kid-clear English for the bank's
   confusing instructions. Same task, same answer, no extra hint; only the English the boy reads and hears changes. */
var PFK_STEMS = {
  'What does the glowing word mean? Count every part.': 'What does the glowing word mean? Careful: every little piece of the word counts.',
  'No nekudos here. What does the glowing word mean? Count every part.': 'No nekudos this time! What does the glowing word mean? Every little piece of the word counts.',
  'No nekudos here. What does the glowing word mean?': 'No nekudos this time! What does the glowing word mean?',
  'Tap the same letter in regular letters.': 'This letter is in Rashi script. Find the same letter in regular print and tap it.',
  'Tap the word that is exactly the same.': 'Find the twin! Tap the word that is exactly the same.',
  'The glowing word is a short form of two words. What does it mean?': 'The glowing word is a shortcut for two words (roshei teivos). What does it mean?',
  'Two Rashis are printed one after the other. Tap the first word of the second Rashi.': 'Two Rashis are printed back to back. Where does the second Rashi start? Tap its first word.',
  'In this Rashi, Rashi brings the Targum (Onkelos). Tap the word that tells you.': 'In this Rashi, Rashi quotes the Targum (Onkelos). Tap the word that shows it.',
  'Listen to the sound. Tap the letter that makes it.': 'Listen to the sound. Which letter makes that sound? Tap it.'
};
function pfkStem_(it) { return PFK_STEMS[it.stem] || it.stem; }
function pfkSay_(it) { return /^No read-aloud/i.test(it.audio) ? '' : String(pfkStem_(it)).replace(/[֐-׿יִ-ﭏ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function pfkPresent_(it, S, sec) {
  var p = it.pic || {}, heb = /[֐-׿]/;
  var o = { id: it.id, fmt: it.fmt, stem: pfkStem_(it), say: pfkSay_(it), draft: pfIsTest_(S.sid) && it.status !== 'Approved',   /* the draft tag only for TEST boys */ n: sec.ans.length + 1,
    pic: { kind: p.kind || '', units: p.text ? pfkUnits_(p.text) : [], hl: (p.highlight || []).slice(), font: p.font === 'rashi' ? 'rashi' : 'square', trop: !!p.trop, big: !!p.big, ref: p.ref || '',
      rashi: p.rashi || '', rashiFont: p.rashi ? (p.rashi_font === 'rashi' ? 'rashi' : 'square') : '' } };
  if (it.fmt === 'CHOICE' || it.fmt === 'LISTEN' || it.fmt === 'SAME') { o.choices = pfShuffle_([it.ans].concat(it.wrong.map(function (w) { return w[0]; })), it.id + '|' + S.id); o.hebChoices = o.choices.some(function (c) { return heb.test(c); }); }
  if (it.fmt === 'LISTEN') { var cv = pfkClips_()[it.clip] || ''; o.clip = typeof pfkClipSrc_ === 'function' ? pfkClipSrc_(cv) : cv; }
  if (it.fmt === 'ORDER') { var parts = String(it.ans).split('|').map(function (x) { return x.trim(); }); o.tiles = pfShuffle_(parts, it.id + '|' + S.id); if (o.tiles.join('|') === parts.join('|')) o.tiles.reverse(); }
  if (it.fmt === 'TAP') o.tap = 1;
  return o;
}

/* ---- calls from the boy's page (?pf=1&test=kodesh) ---- */
/* again: a TEST boy who finished may start another one (Form B next; items seen in 12 months are left out). */
function pfkStart(token, again) {
  var r = pfkMe_(token);
  return pfLock_(function () {
    var now = Date.now(), S = pfkActive_(r.id), extra = {};
    if (!S) { var last = pfkSessionsOf_(r.id).pop(); if (last && last.status === 'complete' && !again) return pfkView_(last, r, { end: 1 }); S = pfkCreate_(r.id, pfGrade_(r, null), 'boy', now); extra.welcome = 1; }
    pfkAdvance_(S, pfkCtx_(S), now, extra);
    pfkSave_(S);
    return pfkView_(S, r, extra);
  });
}
/* One answer: a = {item, value, ms}. Saved at once; then the next item (or the next section, or the end). */
function pfkAnswer(token, a) {
  var r = pfkMe_(token);
  return pfLock_(function () {
    var S = pfkActive_(r.id), now = Date.now(), extra = {}; if (!S) throw new Error('Please start again.');
    var st = S.state, k = st.cur, sec = k && st.secs[k];
    if (!sec || !sec.cur) return pfkView_(S, r);
    if (!a || String(a.item) !== sec.cur.i) return pfkView_(S, r, { stale: 1 });
    var it = pfkIx_().byId[sec.cur.i], value = a.idk ? '' : String(a.value == null ? '' : a.value).slice(0, 400), ctx = pfkCtx_(S);   /* "I don't know this yet" (Head of School 2026-11-16): a miss, saved as IDK */
    var rec = pfkRecord_(sec, it, value, Math.max(0, Number(a.ms) || 0), ctx, now);
    if (a.idk) rec.c = 'IDK';
    pfkAnswerRow_(S, k, sec, it, a.idk ? "(I don't know this yet)" : value, rec);
    st.n = (st.n || 0) + 1; if (st.n % PFK.BREAK_EVERY === 0) extra.brk = 1;           /* a 10-second stretch every 8 questions */
    if (sec.done) { pfkSectionRow_(S, k, sec); extra.finished = { k: k, label: PFK.NAMES[k] }; }
    pfkAdvance_(S, ctx, now, extra);
    pfkSave_(S);
    return pfkView_(S, r, extra);
  });
}

/* ---- staff ---- */
/* For pfReport (staff): his Kodesh profiles, newest last, and the sections behind them. Numbers are for staff only (4.6). */
function pfkReport_(sid) {
  try {
    var rows = pfRows_('results').filter(function (v) { return String(v[2]) === sid && (String(v[3]) === 'KODESH' || /^K\./.test(String(v[3]))); });
    var out = { profiles: [], sections: [], names: PFK.NAMES, open: pfkSessionsOf_(sid).filter(function (S) { return S.status === 'active'; }).map(function (S) { return { id: S.id, done: Object.keys(S.state.secs || {}).filter(function (k) { return S.state.secs[k].done; }) }; }) };
    out.readings = []; out.rtr = null;
    rows.forEach(function (v) { var d = pfJson_(v[19], null); if (!d || d.test !== PFK.TEST) return;
      if (d.kind === 'rtr') { out.readings.push({ at: new Date(v[0]).getTime(), by: String(v[18]), level: d.level, seconds: d.seconds, reached: d.reached, wrong: d.wrong, right: d.right, wcpm: d.wcpm, accuracy: d.accuracy, pass: !!d.pass, says: d.rebbe_says || '' }); return; }
      if (String(v[3]) === 'KODESH') out.profiles.push({ at: new Date(v[0]).getTime(), session: String(v[1]), by: String(v[18]), profile: d }); else out.sections.push({ at: new Date(v[0]).getTime(), session: String(v[1]), strand: d.strand, level: v[5] === '' ? null : Number(v[5]), items: d.items, right: d.right, byLevel: d.byLevel, start: d.start, stop: d.stop, flags: pfJson_(v[15], []) }); });
    if (out.readings.length && typeof pfkRtrSummary_ === 'function') out.rtr = pfkRtrSummary_(out.readings, Date.now());   /* stage C: Read to Rebbe (numbers only) */
    return out;
  } catch (e) { return null; }
}
/* 4.3 / 4.4: the rebbe opens or sets a level for one boy (staff only). His choice wins and is locked; who and when are kept.
   level null clears the override. A new profile row is saved; nothing else changes (no lessons, no money). */
function pfkOverride(token, sid, strand, level) {
  if (typeof tlGuard_ === 'function') tlGuard_(token, sid);
  var s = pfStaff_(token); sid = String(sid || ''); strand = String(strand || '');
  if (PFK.ORDER.indexOf(strand) < 0) throw new Error('Pick a Kodesh section.');
  var lv = level == null || level === '' ? null : Number(level); if (lv != null && !(lv >= 1 && lv <= 9 && Math.round(lv) === lv)) throw new Error('Pick a level, 1 to 9.');
  if (!msRoster_().some(function (x) { return x.id === sid; })) throw new Error('That student is not on the list.');
  return pfLock_(function () {
    var all = pfkSessionsOf_(sid), S = all.filter(function (x) { return x.status === 'complete'; }).pop(); if (!S) throw new Error('There is no finished Kodesh Pathfinder for this student yet.');
    var ov = S.state.override = S.state.override || {}, who = pfWho_(s), at = new Date().toISOString();
    if (lv == null) delete ov[strand]; else ov[strand] = { level: lv, by: who, at: at };
    S.flags.push({ at: at, by: who, action: lv == null ? 'rebbe override cleared: ' + strand : 'rebbe set ' + strand + ' to Level ' + lv });
    pfkSave_(S);
    var pr = pfkProfileRow_(S, who); S.state.profile = pr; pfkSave_(S);
    return pr;
  });
}

/* Run from the editor: bank checks, the staircase simulation, and the TEST-only gate. Writes nothing. */
function pfkSelfTest() {
  var out = { version: PFK.VERSION, bank: (typeof PF_KODESH !== 'undefined' ? PF_KODESH.bank + ' v' + PF_KODESH.version : 'missing'), problems: [] }, ix = pfkIx_(), n = 0;
  Object.keys(ix.byId).forEach(function (id) { var it = ix.byId[id]; n++;
    if (it.fmt === 'TAP' && (it.idx == null || it.idx >= pfkUnits_(it.pic.text).length)) out.problems.push(id + ': tap index outside the words');
    if (it.fmt && it.fmt !== 'TAP' && it.fmt !== 'ORDER' && pfkScore_(it, it.ans).x !== 1) out.problems.push(id + ': its own answer does not score right');
    it.wrong.forEach(function (w) { if (it.fmt !== 'ORDER' && pfkScore_(it, w[0]).x) out.problems.push(id + ': a wrong answer scores right'); });
    if (/[֐-׿]/.test(pfkSay_(it))) out.problems.push(id + ': Hebrew would be sent to speech'); });
  out.items = n;
  out.simulation = pfkSimulate_(100, 11);
  if (!PFK_LIVE && pfkAllowed_('R-SELFTEST-NOT-TEST')) out.problems.push('a real boy could open the Kodesh Pathfinder');
  if (typeof pfkRtrPassages_ === 'function') {   /* stage C: the 3 Read to Rebbe passages and their pass lines */
    var rp = pfkRtrPassages_(); out.readToRebbe = rp.map(function (p) { return 'L' + p.level + ' ' + p.units.length + ' words ' + p.wcpm + ' wcpm ' + Math.round(p.acc * 100) + '%' + (p.trop ? ' trop' : ''); });
    if (rp.map(function (p) { return p.level; }).join() !== '2,3,4') out.problems.push('Read to Rebbe passages are not Levels 2, 3, 4');
    rp.forEach(function (p) { var L = PFK_RTR.SPEC[p.level]; if (!L || L.wcpm !== p.wcpm || Math.abs(L.acc - p.acc) > 1e-9) out.problems.push(p.id + ': pass line differs from PF-TWO1 4.2'); if (p.level === 4 && !p.trop) out.problems.push(p.id + ': Level 4 should have trop'); });
  }
  /* stage 8 (engine v1.2 rules) */
  var c = pfkClimbStart_(3, 0), ups = [], i;
  for (i = 0; i < 14; i++) ups.push(pfkClimb_(c, true, 1));
  if (ups.indexOf('up') !== 13 || c.level !== 4) out.problems.push('climb v2: 14 first-try rights should give one level up on the 14th');
  for (i = 0; i < 14; i++) if (pfkClimb_(c, true, 2)) out.problems.push('climb v2: a second level up in the same week');
  c = pfkClimbStart_(3, 0); var dn = [pfkClimb_(c, false, 1), pfkClimb_(c, false, 1), pfkClimb_(c, false, 1)];
  if (dn[2] !== 'down' || dn[0] || dn[1]) out.problems.push('climb v2: 3 misses in a row should give one step back');
  c = pfkClimbStart_(3, 0); for (i = 0; i < 100; i++) if (pfkClimb_(c, i % 5 !== 4, 1 + Math.floor(i / 20))) { out.problems.push('climb v2: one miss in five moved him'); break; }
  c = pfkClimbStart_(7, 0, true); for (i = 0; i < 20; i++) if (pfkClimb_(c, true, 1)) out.problems.push('climb v2: a locked level moved');
  var pr = { strands: { CHU: { level: 4 }, GEM: { level: null } } };
  if (!pfkCanOpen_(pr, 3, 'CHU', 4) || pfkCanOpen_(pr, 3, 'CHU', 5) || pfkCanOpen_(pr, 3, 'GEM', 6) || pfkCanOpen_({ strands: { CHU: { level: 9 } } }, 3, 'CHU', 6)) out.problems.push('pfkCanOpen_ lets the wrong level open');
  var tr = pfkTracks_(4); if (PFK.TRACKS.some(function (k) { return tr[k].level !== 3 || tr[k].review.join() !== '1,2'; }) || pfkTracks_(0).HAL.level !== 1 || pfkTracks_(1).HAL.level !== 2 || pfkTracks_(2).HAL.review.length) out.problems.push('content tracks by grade are wrong');
  var sh = { k: 'CHU', levels: [2, 3, 4, 5, 6], ans: [{ lv: 3, x: 1, v: 0 }, { lv: 3, x: 1, v: 0 }, { lv: 5, x: 1, v: 1 }, { lv: 5, x: 0, v: 1 }, { lv: 5, x: 1, v: 1 }, { lv: 6, x: 0, v: 2 }, { lv: 6, x: 0, v: 2 }], stop: 'boundary' };
  var shr = pfkPlace_(sh); if (shr.level !== 4 || shr.flags.indexOf('shaky top pass: started one level lower') < 0) out.problems.push('shaky top: a 2-of-3 top pass should start him one level lower');
  sh.ans[4].x = 1; sh.ans[3].x = 1; sh.ans.splice(4, 1); if (pfkPlace_(sh).level !== 5) out.problems.push('shaky top: a clean 2-of-2 pass must not move');
  Logger.log(JSON.stringify(out, null, 1));
  return out;
}
