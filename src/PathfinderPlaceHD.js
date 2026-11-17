/* PATHFINDER v7.2 Stages 1, 2 and 4 (07 PATHFINDER BUILD PROMPT v7.2; 2026-11-16, Claude Code builder, srv agent). TEST boys only.
   SWITCH: PF_V72.LIVE = false -> every rule here runs for TEST- boys only (pf72On_). Real boys reach none of it: each hook in
   Pathfinder.js / MiddleSchool.js / PathfinderDaily.js checks pf72On_ first and then runs the old code unchanged.
   Live use needs a Head of School go-live DECISION in the LOG (HoS approved rule HD 2026-11-16 1510, go-live still waits).
   - Stage 1 (Addendum F v2 F8.1): person fit lz is never a flag and never output. pfResult_ still computes it; pfFinish_ moves it
     into PF_Results detail_json.research (research only) and pfReport strips it. F8.2 CUSUM note and F8.3 rapid rule already exist
     (pfCusum_, pfResult_); unit tests below. F8.4 is NOT built: v7.2 Stage 4 item 6 replaces it.
   - Stage 2 (PF-PLACE1 v4): (c) his lineup at the placed level = "not yet" skills first, then gap fillers below the level, then
     "check in class" (working) skills, then the levels above; "shown" (solid) skills at the level are skipped (pf72PlanPatch_).
     (d) hook for item 17 (Math strand starts): PF_V72.ITEM17 = false, no behaviour. (f) a staff/rebbe level LOCKS: a later Pathfinder
     finish never overwrites it; it records "Pathfinder suggests Level N" for staff (pfFinish_ hook, pf72Locked_).
     Computing / Life and Money are reported, not placed, by Pathfinder (Pathfinder5.js), so the "2 below grade" limit has nothing to bound.
   - Stage 4 item 6 (PF-REL1): the 5 first-lesson answers are scored with the SAME engine (pfP_ on the same grid) together with his
     Pathfinder answers, and he is re-placed at theta - 0.674 x SE_eff (the E2 rule): down by at most 1, never "0-2 right -> down".
     5/5 still opens the E2 step-up check; at the step-up he moves up only if the combined re-place says so (at most 1).
   - Stage 4 item 7 (PF-REL2, PF-REL3 rule HD, LOG 1541): grades 3-8, Reading and Math. Lesson answers count at weight 0.5 in the same
     engine (first-try right = 1). Re-placed once a week: weeks 1-2 up only if P(above the level line) > 0.5, down by rule C
     (theta - 0.674 SE below the level); from week 3 the plain estimate. At most 1 level a week, never more than 1 from his start
     without a rebbe (then staff see "lessons suggest Level N"). NO "under 40% -> down" rule. A staff level is locked: the rule runs in
     the background and only shows "lessons suggest Level N". K-2 and an unknown grade: unchanged (PF-K2ROUTE not specified enough;
     the daily quick climb keeps running for them). For grades 3-8 the daily quick climb (PathfinderDaily.js) skips Reading and
     Math so a level never moves twice; the daily path follows PL_Place, which rule HD writes (by 'pathfinder-hd').
   Storage: PF_HD (student_id, updated_at, state_json), TEST boys only. NO MONEY anywhere in this file. */
var PF_V72 = {
  LIVE: true,   /* v338: live now with every grade (Head of School); was date-gated to 2026-11-17 */   /* PF-BUILD-V8 Stage 9 day 1 (HoS 1634: rule HD approved for live), same day as PF_LIVE_START; false before = TEST boys only */
  ITEM17: false,    /* BUILD-NEXT item 17 (Math strand starts) not built: Math starts at the Math starting level */
  HD: { minGrade: 3, maxGrade: 8, subjects: ['READ', 'MATH'], w: 0.5, lessonC: 0.05, weekDays: 7, carefulWeeks: 2, upP: 0.5, maxFromStart: 1, suggestMin: 5, keep: 600, logMax: 40 },
  COLS: ['student_id', 'updated_at', 'state_json']
};
function pf72On_(sid) { return PF_V72.LIVE || pfIsTest_(String(sid || '')); }

/* ================================================================== ENGINE (pure). The same grid and pfP_ as pfPost_, with a weight per answer. */
/* ans: [{b, c, x, w}] (w defaults to 1). With every w = 1 this equals pfPost_. Returns {theta, se, above(t)}: above = P(theta >= t). */
function pf72Post_(ans, mu, sd) {
  var lo = mu - 6 * sd - 3, hi = mu + 6 * sd + 3, step = 0.05, sw = 0, s1 = 0, s2 = 0, lps = [], ths = [], th, i, lp, m = -Infinity;
  for (th = lo; th <= hi + 1e-9; th += step) {
    lp = -0.5 * Math.pow((th - mu) / sd, 2);
    for (i = 0; i < ans.length; i++) { var p = pfP_(th, ans[i].b, ans[i].c), w = ans[i].w == null ? 1 : ans[i].w; lp += w * (ans[i].x ? Math.log(p) : Math.log(1 - p)); }
    lps.push(lp); ths.push(th); if (lp > m) m = lp;
  }
  var ws = lps.map(function (v) { return Math.exp(v - m); });
  for (i = 0; i < ws.length; i++) { sw += ws[i]; s1 += ws[i] * ths[i]; s2 += ws[i] * ths[i] * ths[i]; }
  var mean = s1 / sw, v = Math.max(0, s2 / sw - mean * mean);
  return { theta: mean, se: Math.sqrt(v), above: function (t) { var a = 0; for (var j = 0; j < ths.length; j++) if (ths[j] >= t) a += ws[j]; return a / sw; } };
}
/* SE_eff as pfSeEff_ (Addendum E 2): passage questions share a story. */
function pf72SeEff_(ans, se) { var n = 0, np = 0; ans.forEach(function (a) { if ((a.w == null ? 1 : a.w) === 1) { n++; if (a.p) np++; } }); return se * Math.sqrt(1 + PF.E.deff * (n ? np / n : 0)); }
function pf72Item_(id, x) { var it = pfIx_().byId[id]; return it ? { b: it.b, c: pfGuess_(it), x: x ? 1 : 0, w: 1, p: it.passage ? 1 : 0 } : null; }
/* his Pathfinder answers in one subject (scored, not rapid) plus every first-lesson check answer he has given */
function pf72PfAnswers_(S, subj) {
  var sec = S.state.sections[subj], out = [], c = (S.state.confirm || {})[subj];
  pfScored_(sec).forEach(function (a) { var o = pf72Item_(a.i, a.x); if (o) out.push(o); });
  ((c && c.hist) || []).forEach(function (h) { (h.items || []).forEach(function (id, j) { if (h.marks) { var o = pf72Item_(id, h.marks[j]); if (o) out.push(o); } }); });
  return out;
}

/* ================================================================== STAGE 1: lz is research only */
function pf72LzResearch_(res, eDetail) {
  var lz = res.lz; delete res.lz;
  if (eDetail) { delete eDetail.lz; eDetail.research = { lz: lz == null ? null : lz }; }
}
function pf72StripLz_(out) { (out.results || []).forEach(function (x) { if (x.detail && typeof x.detail === 'object') { delete x.detail.lz; delete x.detail.research; } }); }

/* ================================================================== STAGE 2: lock and lineup */
/* a level a person set (staff / rebbe / Library / editor helper) is locked; Pathfinder's own and the boy's placement check are not */
function pf72LockedP_(p) { return !!(p && p.level && !/^pathfinder/.test(String(p.by || '')) && String(p.by || '') !== 'check'); }
function pf72Locked_(sid, k) { var p = (plPlacements_()[sid] || {})[k]; return pf72LockedP_(p) ? p : null; }
/* pure: the lineup at the placed level L. ids = the subject's ladder (teaching order); cls = {skill: 'solid'|'working'|'not'} from Pathfinder;
   gaps = below-level "not yet" skills he was asked. Skills with no Pathfinder class are kept (never skipped without evidence). */
function pf72Order_(ids, L, cls, gaps) {
  var at = ids.filter(function (id) { return plMathLevel_(id) === L; }), not = [], chk = [], shown = [];
  at.forEach(function (id) { var c = cls[id]; if (c === 'not') not.push(id); else if (c === 'solid') shown.push(id); else chk.push(id); });
  var g = (gaps || []).filter(function (id) { return plMathLevel_(id) < L && ids.indexOf(id) >= 0; });
  var above = ids.filter(function (id) { return plMathLevel_(id) > L; });
  /* HoS DECISION 1940-ET (acceptance test 1): no "not yet" skill at his level -> his first lesson is the first "working" skill there */
  var path = not.length ? not.concat(g, chk, above) : chk.concat(g, above);
  return { path: path, notYet: not, gaps: g, check: chk, skipped: shown };
}
/* his latest applied Pathfinder result per subject (TEST boys only) */
function pf72Applied_(sid) {
  var out = {}; pfRows_('results').forEach(function (v) { if (String(v[2]) !== sid || String(v[17]) !== 'yes') return;
    out[String(v[3])] = { start: String(v[6]), level: Number(v[5]), gaps: pfJson_(v[13], []), skills: pfJson_(v[12], []), strands: pfJson_(v[11], {}) }; });
  return out;
}
/* plPlanFor_ -> pfPlanPatch_ -> here, for TEST boys. Only a Pathfinder-set level (by pathfinder / pathfinder-hd) is reordered;
   a staff level keeps the plain lineup the staff chose. */
function pf72PlanPatch_(sid, p, out) {
  var A = null;
  ['READ', 'MATH'].forEach(function (k) {
    var o = out[k], pk = p[k]; if (!o || !o.path || !pk || !/^pathfinder/.test(String(pk.by || ''))) return;
    A = A || pf72Applied_(sid); var R = A[k]; if (!R) return;
    var cls = {}; (R.skills || []).forEach(function (s) { cls[s[0]] = s[1]; });
    var ids = (plList_(k) || []).map(function (x) { return x[0]; }), r = pf72Order_(ids, Number(pk.level), cls, R.gaps);
    if (!r.path.length) return;
    o.path = r.path; o.start = r.path[0]; if (r.gaps.length) o.gaps = r.gaps;
    /* (d) item 17 hook: once Math strand levels drive the start (PF-ROUTE1), reorder here from R.strands. Off: no behaviour change. */
    if (k === 'MATH' && PF_V72.ITEM17 && typeof pfMathStrandStarts_ === 'function') pfMathStrandStarts_(sid, o, R.strands);
  });
}

/* ================================================================== STAGE 4 item 6: first-lesson check = add and re-place */
/* pure: ans = Pathfinder + check answers (weight 1); stage 'placed' | 'recheck' | 'up'; from = his level now; right = this check's count */
function pf72Replace_(ans, mu, sd, stage, from, right) {
  var e = pf72Post_(ans, mu, sd), seE = pf72SeEff_(ans, e.se), lvl = pfLevelOf_(e.theta - PF.E.placeZ * seE), move = 0, next = 'done', log;
  var est = { theta: Math.round(e.theta * 100) / 100, se: Math.round(seE * 100) / 100, n: ans.length, placed: lvl };
  if (stage === 'up') { move = lvl >= from + 1 ? 1 : 0; log = 'confirmation step-up re-place (Pathfinder + check answers, same engine): placed Level ' + lvl + (move ? ', moves up 1' : ', stays'); }
  else { move = lvl < from ? -1 : 0; if (!move && right >= PF.CONFIRM.n && stage === 'placed') next = 'up';
    log = 'confirmation re-place (Pathfinder + check answers, same engine): placed Level ' + lvl + (move ? ', moves down 1' : ', stays') + (next === 'up' ? '; the next lesson checks the Level above' : ''); }
  return { move: move, next: next, log: log, est: est };
}
function pf72ConfirmStep_(S, subj, c, marks, right) {
  var sec = S.state.sections[subj]; if (!sec || pfEngOf_(sec) !== 'E') return pfConfirmStep_(c.stage, right, !!c.typed);
  var ans = pf72PfAnswers_(S, subj); (c.items || []).forEach(function (id, j) { var o = pf72Item_(id, marks[j]); if (o) ans.push(o); });
  return pf72Replace_(ans, sec.mu, sec.sd, c.stage, c.level, right);
}

/* ================================================================== STAGE 4 item 7: rule HD */
/* pure: post = pf72Post_ result; L = level now; week = full weeks since placement (1, 2, ...). Returns the level the rule wants (L, L+1 or L-1). */
function pf72HdRule_(post, L, week) {
  if (week <= PF_V72.HD.carefulWeeks) {
    if (L < 9 && post.above(L + 0.5 - 5) > PF_V72.HD.upP) return L + 1;          /* H: up only if P(above the level line) > 0.5 */
    return pfLevelOf_(post.theta - PF.E.placeZ * post.se) < L ? L - 1 : L;     /* down as rule C */
  }
  var d = pfLevelOf_(post.theta);                                               /* D: the plain estimate, one level a week */
  return d > L ? L + 1 : d < L ? L - 1 : L;
}
function pf72HdGrade_(g) { return g != null && g !== '' && !isNaN(Number(g)) && Number(g) >= PF_V72.HD.minGrade && Number(g) <= PF_V72.HD.maxGrade; }
function pf72LessonB_(skill) { var k = pfSkill_(skill); return k && typeof k.b === 'number' ? k.b : plMathLevel_(skill) - 5; }
function pf72HdTab_() { var ss = msBook_(), sh = ss.getSheetByName('PF_HD'); if (!sh) { sh = ss.insertSheet('PF_HD'); sh.getRange(1, 1, 1, PF_V72.COLS.length).setValues([PF_V72.COLS]).setFontWeight('bold'); sh.setFrozenRows(1); } return sh; }
function pf72HdRead_(sid) { var sh = pf72HdTab_(), n = sh.getLastRow(), v = n < 2 ? [] : sh.getRange(2, 1, n - 1, 3).getValues(); for (var i = 0; i < v.length; i++) if (String(v[i][0]) === sid) return { row: i + 2, D: pfJson_(v[i][2], {}) }; return { row: 0, D: {} }; }
function pf72HdWrite_(sid, R) { var sh = pf72HdTab_(), line = [sid, new Date(), JSON.stringify(R.D)]; if (R.row) sh.getRange(R.row, 1, 1, 3).setValues([line]); else { sh.appendRow(line); R.row = sh.getLastRow(); } }
function pf72HdLog_(st, now, text, extra) { var e = { at: now, text: text }; if (extra) Object.keys(extra).forEach(function (x) { e[x] = extra[x]; }); st.log = (st.log || []).concat([e]).slice(-PF_V72.HD.logMax); }
/* the session whose finished section placed this subject (latest applied) */
function pf72HdSrc_(all, k) { for (var i = all.length - 1; i >= 0; i--) { var sec = (all[i].state.sections || {})[k]; if (sec && sec.done && sec.result && sec.result.applied) return { S: all[i], sec: sec }; } return null; }
/* msSave hook (after his answers are stored, before the daily path). Real boys: null at the first line, nothing read or written. */
function pf72HdAfterSave_(sid, rows) {
  sid = String(sid || ''); if (!pf72On_(sid)) return null;
  try {
    var all = pfSessionsOf_(sid); if (!all.length) return null;
    var grade = pfGrade_({ id: sid }, all[all.length - 1].grade); if (!pf72HdGrade_(grade)) return null;   /* K-2 / unknown: as today */
    var now = Date.now(), R = pf72HdRead_(sid), D = R.D; D.s = D.s || {}; var changed = false, H = PF_V72.HD, wk = H.weekDays * 86400000;
    H.subjects.forEach(function (k) {
      var src = pf72HdSrc_(all, k); if (!src) return;
      var st = D.s[k];
      if (!st || st.sess !== src.S.id) { st = D.s[k] = { sess: src.S.id, at0: src.sec.last || now, L0: null, lastWeek: 0, ans: [], moves: [], log: [], sug: null }; changed = true; }
      var re = new RegExp('^' + k + '\\.');
      (rows || []).forEach(function (r) { if (!r || (r.phase !== 'practice' && r.phase !== 'check') || !re.test(String(r.skill || ''))) return;
        st.ans.push([Math.round(pf72LessonB_(String(r.skill)) * 100) / 100, r.ok && r.first ? 1 : 0, now]); changed = true; });
      if (st.ans.length > H.keep) st.ans = st.ans.slice(-H.keep);
      var c = (src.S.state.confirm || {})[k], p = (plPlacements_()[sid] || {})[k]; if (!p || !p.level) return;
      if (!pf72LockedP_(p) && c && c.stage !== 'done') return;                            /* the first-lesson check decides first */
      if (st.L0 == null) { st.L0 = c ? c.level : plMathLevel_(src.sec.result.start); changed = true; }
      var ans = pf72PfAnswers_(src.S, k).concat(st.ans.map(function (a) { return { b: a[0], c: H.lessonC, x: a[1], w: H.w }; }));
      var post = pf72Post_(ans, src.sec.mu, src.sec.sd), week = Math.floor((now - st.at0) / wk), cur = Number(p.level);
      if (pf72LockedP_(p)) {                                                              /* staff / rebbe level: never moved */
        var sg = st.ans.length >= H.suggestMin ? pf72HdRule_(post, cur, Math.max(1, week)) : cur;
        if ((sg !== cur ? sg : null) !== st.sug) { st.sug = sg !== cur ? sg : null; pf72HdLog_(st, now, st.sug ? 'lessons suggest Level ' + st.sug + ' (level locked by ' + p.by + ')' : 'lessons agree with the locked level', { kind: 'suggest', from: cur, to: st.sug }); changed = true; }
        return;
      }
      if (week < 1 || week <= st.lastWeek) return;                                        /* once a week */
      var want = pf72HdRule_(post, cur, week), last = 0;
      (st.moves || []).forEach(function (m) { last = Math.max(last, m.at); });
      ((c && c.hist) || []).forEach(function (h) { if (h.to != null && h.from != null && h.to !== h.from) last = Math.max(last, h.at); });
      if (want !== cur && now - last < wk) return;                                         /* at most 1 move a week (the check counts) */
      st.lastWeek = week; changed = true;
      var line = 'week ' + week + ' (' + (week <= H.carefulWeeks ? 'careful: up only if P(above) > 0.5' : 'plain estimate') + ', ' + st.ans.length + ' lesson answers at weight ' + H.w + ')';
      if (want === cur) { st.sug = null; pf72HdLog_(st, now, line + ': stays at Level ' + cur, { kind: 'stays', to: cur }); return; }
      if (Math.abs(want - st.L0) > H.maxFromStart) { st.sug = want; pf72HdLog_(st, now, line + ': lessons suggest Level ' + want + ' (more than 1 from his start: needs the rebbe)', { kind: 'suggest', from: cur, to: want }); return; }
      plUpsert_(sid, k, want, plFirst_(k, want), 'pathfinder-hd'); PL_CACHE_ = null;
      st.moves.push({ at: now, from: cur, to: want, week: week }); st.sug = null;
      pf72HdLog_(st, now, line + ': Starting level ' + st.L0 + ' → working level ' + want + ' (week ' + week + ')', { kind: 'move', from: cur, to: want });
    });
    if (changed) pf72HdWrite_(sid, R);
    return null;
  } catch (e) { return null; }
}
/* PathfinderDaily: for grades 3-8 rule HD owns Reading and Math, so the quick climb does not also move them (no double move) */
function pf72HdClimbRows_(sid, grade, rows) {
  if (!pf72On_(sid) || !pf72HdGrade_(grade)) return rows;
  return (rows || []).filter(function (r) { return !(r && /^(READ|MATH)\./.test(String(r.skill || ''))); });
}
/* staff view (pfReport.hd and the daily-path table): starting -> working level, the week, suggestions, the log */
function pf72HdReport_(sid) {
  sid = String(sid || ''); if (!pf72On_(sid)) return null;
  var D = pf72HdRead_(sid).D; if (!D.s || !Object.keys(D.s).length) return null;
  var pl = plPlacements_()[sid] || {}, now = Date.now(), out = { on: true, rule: 'HD', live: PF_V72.LIVE, subjects: {} };
  Object.keys(D.s).forEach(function (k) { var st = D.s[k], p = pl[k] || {}, week = Math.floor((now - st.at0) / (PF_V72.HD.weekDays * 86400000));
    out.subjects[k] = { start: st.L0, working: p.level || null, by: p.by || '', locked: pf72LockedP_(p), week: week, lessons: st.ans.length,
      line: st.L0 != null && p.level ? 'Starting level ' + st.L0 + ' → working level ' + p.level + ' (week ' + Math.max(1, week) + ')' : '', suggest: st.sug != null ? 'lessons suggest Level ' + st.sug : '', moves: st.moves || [], log: (st.log || []).slice(-10) }; });
  return out;
}
function pf72HdView_(sid, view) {
  var hd = pf72HdReport_(sid); if (!hd || !view || !view.strands) return;
  view.strands.forEach(function (x) { var h = hd.subjects[x.k]; if (h && h.suggest) x.suggest = Number(h.suggest.replace(/\D+/g, '')); });
  var ev = []; Object.keys(hd.subjects).forEach(function (k) { hd.subjects[k].log.forEach(function (e) { ev.push({ at: e.at, k: k, kind: 'rule HD', from: e.from, to: e.to, text: e.text }); }); });
  view.events = ev.concat(view.events || []).sort(function (a, b) { return b.at - a.at; }).slice(0, 30); view.hd = hd;
}

/* ================================================================== SELF-TEST (called by pfSelfTest) */
function pf72SelfTest_() {
  var P = [], out = { problems: P }, ok = function (c, m) { if (!c) P.push(m); };
  /* engine: weights of 1 = pfPost_; weight 0.5 moves the estimate less */
  var a1 = [{ b: 0, c: 0.25, x: 1 }, { b: 1, c: 0, x: 0 }, { b: -1, c: 0, x: 1 }, { b: 0.5, c: 0.25, x: 0 }];
  var q = pfPost_(a1, 0, 1), r = pf72Post_(a1, 0, 1);
  ok(Math.abs(q.theta - r.theta) < 1e-9 && Math.abs(q.se - r.se) < 1e-9, 'engine: weighted grid with w = 1 differs from pfPost_');
  var wr = [], wh = []; for (var i = 0; i < 6; i++) { wr.push({ b: 0, c: 0.05, x: 0, w: 1 }); wh.push({ b: 0, c: 0.05, x: 0, w: 0.5 }); }
  ok(pf72Post_(wh, 0, 1).theta > pf72Post_(wr, 0, 1).theta, 'engine: weight 0.5 lesson answers count as much as test answers');
  /* F8.1: lz is research only */
  var res = { lz: -2.7, cusum: { note: false } }, ed = { kind: 'core', lz: -2.7 }; pf72LzResearch_(res, ed);
  ok(!('lz' in res) && !('lz' in ed) && ed.research && ed.research.lz === -2.7, 'F8.1: lz still in the result or not kept for research');
  var rep = { results: [{ detail: { engine: 'E', lz: 1, research: { lz: 1 } } }] }; pf72StripLz_(rep); ok(!/lz/.test(JSON.stringify(rep)), 'F8.1: lz left in the staff report');
  /* F8.2: CUSUM note when the pattern changes partway (all right, then all wrong after question 12); none for a steady pattern */
  var ch = [], st2 = []; for (i = 0; i < 24; i++) { ch.push({ b: 0, c: 0, x: i < 12 ? 1 : 0 }); st2.push({ b: 0, c: 0, x: i % 2 }); }
  ok(pfCusum_(ch, pfPost_(ch, 0, 1).theta).note === true, 'F8.2: no CUSUM note after a change partway through');
  ok(pfCusum_(st2, pfPost_(st2, 0, 1).theta).note === false, 'F8.2: CUSUM note on a steady pattern');
  /* F8.3: 3 or more rapid answers -> retake; lz never becomes a flag */
  var sec = pfNewSection_('MATH', 4, 0, false, false, 0), it, n = 0, seen = {};
  while ((it = pfNext_(sec, seen, function () { return 0.3; })) && n < 22) { seen[it.id] = 1; pfRecord_(sec, it, n % 3 ? it.ans : 'zz', n >= 2 && n <= 5 ? 100 : 20000, false, ''); n++; }
  var rr = pfResult_(sec, pfLadder_('MATH'));
  ok(rr.status === 'retake', 'F8.3: 4 rapid answers did not mark the section for retake (' + rr.status + ')');
  ok(!rr.flags.some(function (f) { return /lz|person fit/i.test(f); }), 'F8.1: a person-fit flag was raised');
  /* Stage 2 (f): who locks */
  ok(pf72LockedP_({ level: 5, by: 'staff' }) && pf72LockedP_({ level: 5, by: 'test' }), 'lock: a staff level is not locked');
  ok(!pf72LockedP_({ level: 5, by: 'pathfinder' }) && !pf72LockedP_({ level: 5, by: 'pathfinder-hd' }) && !pf72LockedP_({ level: 5, by: 'check' }) && !pf72LockedP_(null), 'lock: a Pathfinder or check level is locked');
  /* Stage 2 (c): lineup order */
  var ids = ['R.A.L04.01', 'R.A.L04.02', 'R.A.L05.01', 'R.A.L05.02', 'R.A.L05.03', 'R.A.L05.04', 'R.A.L06.01'];
  var o = pf72Order_(ids, 5, { 'R.A.L05.01': 'solid', 'R.A.L05.02': 'working', 'R.A.L05.03': 'not', 'R.A.L04.02': 'not' }, ['R.A.L04.02']);
  ok(o.path.join() === 'R.A.L05.03,R.A.L04.02,R.A.L05.02,R.A.L05.04,R.A.L06.01', 'lineup: wrong order ' + o.path.join());
  ok(o.skipped.join() === 'R.A.L05.01', 'lineup: a "shown" skill was not skipped');
  var o2 = pf72Order_(ids, 5, { 'R.A.L05.01': 'solid', 'R.A.L05.02': 'working', 'R.A.L05.03': 'working', 'R.A.L04.02': 'not' }, ['R.A.L04.02']);
  ok(o2.path[0] === 'R.A.L05.02', 'lineup: no "not yet" at his level, first lesson must be the first "working" skill there (HoS 1940), got ' + o2.path[0]);
  /* item 6: add and re-place; down at most 1; no right-count rule */
  var pf = []; for (i = 0; i < 30; i++) pf.push({ b: (i % 5) / 4 - 0.5, c: 0, x: i % 2, w: 1 });   /* a firm Level 5 boy (theta about 0) */
  var base = pf72Post_(pf, 0, 1), L = pfLevelOf_(base.theta - PF.E.placeZ * pf72SeEff_(pf, base.se));
  var w5 = pf.concat([0, 0, 0, 0, 0].map(function () { return { b: L - 5, c: 0, x: 0, w: 1 }; })), s5 = pf72Replace_(w5, 0, 1, 'placed', L, 0);
  ok(s5.move >= -1 && s5.move <= 0, 'item 6: moved more than 1 down');
  var bad = []; for (i = 0; i < 5; i++) bad.push({ b: 3, c: 0, x: 0, w: 1 }); ok(pf72Replace_(bad.concat(bad, bad), 0, 1, 'placed', 9, 0).move === -1, 'item 6: a far-off boy moved more than 1');
  var two = pf.concat([1, 1, 0, 0, 0].map(function (x) { return { b: L - 5, c: 0, x: x, w: 1 }; })); ok(pf72Replace_(two, 0, 1, 'placed', L, 2).move === 0, 'item 6: 2/5 moved a firmly placed boy down (right-count rule still on)');
  var all = pf.concat([1, 1, 1, 1, 1].map(function () { return { b: L - 5, c: 0, x: 1, w: 1 }; })), s55 = pf72Replace_(all, 0, 1, 'placed', L, 5);
  ok(s55.move === 0 && s55.next === 'up', 'item 6: 5/5 does not open the step-up check');
  /* item 7: rule HD */
  var mk = function (m) { return pf72Post_([], m, 0.3); };
  ok(pf72HdRule_(mk(0.05), 5, 1) === 5, 'HD: a boy in the middle of his level moved in week 1');
  ok(pf72HdRule_(mk(0.45), 5, 1) === 5 && pf72HdRule_(mk(0.65), 5, 1) === 6, 'HD weeks 1-2: up only when P(above) > 0.5');
  ok(pf72HdRule_(mk(0.45), 5, 3) === 5 && pf72HdRule_(mk(0.6), 5, 3) === 6, 'HD week 3: not the plain estimate');
  ok(pf72HdRule_(mk(-0.4), 5, 1) === 4 && pf72HdRule_(mk(-0.4), 5, 3) === 5, 'HD: week 1 down rule C / week 3 plain');
  ok(pf72HdRule_(mk(3), 5, 3) === 6 && pf72HdRule_(mk(-3), 5, 1) === 4, 'HD: more than 1 level in one week');
  /* no "under 40% -> down": a firm Level 5 boy with 35% right on hard lesson questions stays */
  var les = pf.slice(); for (i = 0; i < 20; i++) les.push({ b: 0.4, c: 0.05, x: i % 20 < 7 ? 1 : 0, w: 0.5 });
  ok(pf72HdRule_(pf72Post_(les, 0, 1), L, 1) >= L, 'HD: under 40% right on hard lessons moved him down');
  ok(pf72HdGrade_(3) && pf72HdGrade_(8) && !pf72HdGrade_(2) && !pf72HdGrade_(0) && !pf72HdGrade_(null), 'HD: grade range is not 3-8');
  /* daily climb coexists: grades 3-8 drop Reading/Math rows; K-2 and real boys keep them */
  var rows = [{ skill: 'READ.LIT.L05.01' }, { skill: 'MATH.NBT.L05.01' }, { skill: 'LK.CHU.L03.01' }];
  ok(pf72HdClimbRows_('TEST-90', 5, rows).length === 1 && pf72HdClimbRows_('TEST-90', 1, rows).length === 3 && pf72HdClimbRows_('R-1', 5, rows).length === (PF_V72.LIVE ? 1 : 3), 'HD: the daily climb filter is wrong');
  ok(PF_V72.LIVE === (PF_LIVE_GRADES.length > 0), 'switch: rule HD must be live exactly when Pathfinder is live for real boys');
  out.tests = 27;
  return out;
}
