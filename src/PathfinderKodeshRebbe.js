/* KODESH PATHFINDER, stage C: READ TO REBBE (blueprint PF-TWO1 4.2 and 8.5; local build by the Claude Code builder).
   TEST BOYS ONLY (the same gate as the Kodesh Pathfinder: pfkAllowed_). Every call here is STAFF ONLY (pfStaff_ + tlGuard_ scope).
   - The rebbe opens a boy's card on his own screen (app link + ?pf=1&rebbe=<id>, or ?pf=1&rebbe=1 to pick a boy),
     picks a passage (the bank's 3 "rebbe listens" passages, Levels 2, 3, 4; Level 4 with trop), runs the 60-second timer,
     taps each word read wrong, then taps the last word reached. Words read right per minute and accuracy are computed.
   - Saved: ONLY numbers (seconds, words reached, words wrong, words right, wcpm, accuracy, pass) plus the rebbe's one-question
     answer "Is this his Kriyah level?" (yes / no / higher / lower) for tuning the pass lines later. No audio, no recording,
     not even which words were wrong. One PF_Results row per reading (subject K.RTR, detail_json tagged test:"kodesh", kind:"rtr").
   - His Read to Rebbe level = the highest passage whose latest reading passed. It is copied into his Kodesh session (PF_Ksessions
     state.rtr); a finished session gets a new KODESH profile row. Kriyah level = the higher of the tap section and Read to Rebbe;
     2+ apart -> "check Kriyah" (pfkKriyahMerge_ in PathfinderKodesh.js).
   - Grade 3+: the Kriyah tap section is given only when Read to Rebbe accuracy is below 95% (pfkPlan_), once a reading exists.
   Pass lines are PROVISIONAL and come from the bank (benchmark_wcpm, benchmark_accuracy). No auto-tuning. NO MONEY. Hebrew only from
   PathfinderBankKodesh.js; nothing here is ever spoken. */
var PFK_RTR = {
  SECONDS: 60,                 /* the timer */
  MIN_SECONDS: 5,              /* a reading shorter than this is not scored */
  TAP_ACC: 0.95,               /* grade 3+: the Kriyah tap section only when Read to Rebbe accuracy is below this */
  GAP: 2,                      /* tap and Read to Rebbe this many levels apart -> "check Kriyah" */
  DAYS: 365,                   /* readings older than this no longer count */
  SAYS: ['yes', 'no', 'higher', 'lower'],
  SAYS_TEXT: { yes: 'Yes, this is his level', no: 'No', higher: 'His level is higher', lower: 'His level is lower' },
  SPEC: { 2: { wcpm: 25, acc: 0.95 }, 3: { wcpm: 40, acc: 0.95 }, 4: { wcpm: 55, acc: 0.97 } }   /* PF-TWO1 4.2, for pfkSelfTest only */
};

/* ================================================================== PURE */
var PFK_RTR_IX_ = null;
/* The bank's Read to Rebbe passages, low to high. Hebrew exactly as the bank has it. */
function pfkRtrPassages_() {
  if (PFK_RTR_IX_) return PFK_RTR_IX_;
  var out = [];
  ((typeof PF_KODESH !== 'undefined' && PF_KODESH.items) || []).forEach(function (j) {
    if (!j.rebbe_card) return;
    var p = j.pic || {};
    out.push({ id: j.item_id, level: Number(j.level), skill: j.skill_id, text: String(p.text || ''), units: pfkUnits_(p.text), trop: !!p.trop, ref: p.ref || '', words: Number(p.words) || pfkUnits_(p.text).length,
      wcpm: Number(j.benchmark_wcpm), acc: Number(j.benchmark_accuracy), provisional: j.provisional !== false, form: j.form || 'A', status: j.status || 'Draft', stem: String(j.stem || '') });
  });
  out.sort(function (a, b) { return a.level - b.level; });
  return (PFK_RTR_IX_ = out);
}
function pfkRtrPassage_(id) { return pfkRtrPassages_().filter(function (p) { return p.id === String(id); })[0] || null; }
/* One reading. wrong = word indexes read wrong (only those up to the last word count); last = index of the last word reached;
   seconds = time read (60 when the timer ran out, less when he finished the passage early). */
function pfkRtrScore_(p, wrong, last, seconds) {
  var n = p.units.length; last = Number(last); seconds = Number(seconds);
  if (!(last >= 0 && last < n && Math.round(last) === last)) throw new Error('Tap the last word he reached.');
  if (!(seconds >= PFK_RTR.MIN_SECONDS)) throw new Error('That reading was too short to score. Start the timer again.');
  seconds = Math.min(PFK_RTR.SECONDS, Math.round(seconds * 10) / 10);
  var w = {}; (Array.isArray(wrong) ? wrong : []).forEach(function (i) { i = Number(i); if (i >= 0 && i <= last && Math.round(i) === i) w[i] = 1; });
  var reached = last + 1, nw = Object.keys(w).length, right = reached - nw;
  var wcpm = Math.round(right * 60 / seconds), acc = Math.round(right / reached * 1000) / 1000;
  return { item: p.id, level: p.level, seconds: seconds, reached: reached, wrong: nw, right: right, wcpm: wcpm, accuracy: acc,
    pass: wcpm >= p.wcpm && acc >= p.acc - 1e-9, line: { wcpm: p.wcpm, acc: p.acc }, finished: last === n - 1 };
}
/* readings: [{level, wcpm, accuracy, pass, at}]. His Read to Rebbe result: the highest passage whose LATEST reading passed. */
function pfkRtrSummary_(readings, now) {
  var from = (now || Date.now()) - PFK_RTR.DAYS * 86400000, latest = {}, P = pfkRtrPassages_(), top = P.length ? P[P.length - 1].level : null, low = P.length ? P[0].level : null;
  (readings || []).filter(function (r) { return (r.at || 0) >= from; }).sort(function (a, b) { return (a.at || 0) - (b.at || 0); }).forEach(function (r) { latest[r.level] = r; });
  var lv = Object.keys(latest).map(Number).sort(function (a, b) { return a - b; }), n = lv.length;
  if (!n) return null;
  var passed = lv.filter(function (l) { return latest[l].pass; }), best = passed.length ? latest[passed[passed.length - 1]] : null, flags = [];
  var accOf = best ? best.accuracy : Math.max.apply(null, lv.map(function (l) { return latest[l].accuracy; }));
  if (best && best.level === top) flags.push('may be higher: rebbe check');
  if (!best) flags.push(latest[low] ? 'Read to Rebbe: below the Level ' + low + ' passage' : 'Read to Rebbe: no passage passed yet');
  return { n: n, level: best ? best.level : null, accuracy: accOf, wcpm: best ? best.wcpm : null, item: best ? best.item : null, flags: flags,
    tapNeeded: !best || accOf < PFK_RTR.TAP_ACC - 1e-9,
    byLevel: lv.map(function (l) { var r = latest[l]; return [l, r.wcpm, r.accuracy, r.pass ? 'pass' : 'fail']; }) };
}
/* Which passage to offer next: none read -> his grade's level (2 to 4); after a pass -> one up; after a fail -> one down. */
function pfkRtrSuggest_(grade, readings) {
  var P = pfkRtrPassages_(); if (!P.length) return null;
  var levels = P.map(function (p) { return p.level; }), done = {}, last = null;
  (readings || []).slice().sort(function (a, b) { return (a.at || 0) - (b.at || 0); }).forEach(function (r) { done[r.level] = r; last = r; });
  if (!last) { var want = grade == null ? 3 : Number(grade) + 1, pick = levels[0]; levels.forEach(function (l) { if (l <= want) pick = l; }); return pick; }
  var i = levels.indexOf(last.level), j = last.pass ? i + 1 : i - 1;
  return j >= 0 && j < levels.length && !done[levels[j]] ? levels[j] : null;
}

/* ================================================================== SERVER (Google services) */
/* his Read to Rebbe readings (PF_Results rows K.RTR), oldest first; rows = pfRows_('results') when already read */
function pfkRtrReadings_(sid, rows) {
  return (rows || pfRows_('results')).filter(function (v) { return String(v[2]) === sid && String(v[3]) === 'K.RTR'; }).map(function (v) {
    var d = pfJson_(v[19], {}) || {}; return { at: new Date(v[0]).getTime(), session: String(v[1]), by: String(v[18]), item: d.item, level: Number(d.level), seconds: d.seconds, reached: d.reached, wrong: d.wrong, right: d.right,
      wcpm: Number(d.wcpm), accuracy: Number(d.accuracy), pass: !!d.pass, line: d.line || null, says: d.rebbe_says || '' };
  }).filter(function (r) { return r.item; });
}
function pfkRtrSummaryOf_(sid, now) { try { return pfkRtrSummary_(pfkRtrReadings_(sid), now || Date.now()); } catch (e) { return null; } }
/* staff only, and the boy must be one the Kodesh Pathfinder is open to (TEST boys only while PFK_LIVE is false) */
function pfkRtrStaff_(token, sid) {
  var s = pfStaff_(token);
  if (sid != null) {
    tlGuard_(token, sid);
    if (!msRoster_().some(function (x) { return x.id === sid; })) throw new Error('That student is not on the list.');
    if (!pfkAllowed_(sid)) throw new Error('Read to Rebbe is open for TEST students only for now.');
  }
  return s;
}
/* The boys a rebbe may read with: TEST boys in his scope (the same gate as the Kodesh Pathfinder). */
function pfkRtrBoys(token) {
  pfkRtrStaff_(token, null);
  var rows = pfRows_('results'), scope = typeof TL_SCOPE_ !== 'undefined' ? TL_SCOPE_ : null;
  return msRoster_().filter(function (r) { return pfkAllowed_(r.id) && (!scope || scope[r.id]); }).map(function (r) {
    var sm = pfkRtrSummary_(pfkRtrReadings_(r.id, rows), Date.now()); return { id: r.id, name: r.name, grade: pfGrade_(r, null), readings: sm ? sm.n : 0, level: sm ? sm.level : null };
  });
}
/* The rebbe card for one boy: the passages (words exactly as the bank has them), pass lines, his readings, the suggested passage. */
function pfkRtrCard(token, sid) {
  sid = String(sid || ''); var s = pfkRtrStaff_(token, sid), r = msRoster_().filter(function (x) { return x.id === sid; })[0], g = pfGrade_(r, null), rd = pfkRtrReadings_(sid);
  return { sid: sid, name: r.name, grade: g, staff: pfWho_(s), draft: true, seconds: PFK_RTR.SECONDS, says: PFK_RTR.SAYS.map(function (k) { return { k: k, t: PFK_RTR.SAYS_TEXT[k] }; }),
    passages: pfkRtrPassages_().map(function (p) { return { id: p.id, level: p.level, units: p.units.slice(), trop: p.trop, ref: p.ref, words: p.units.length, line: { wcpm: p.wcpm, acc: p.acc }, provisional: p.provisional, draft: p.status !== 'Approved' }; }),
    readings: rd.map(function (x) { return { at: x.at, level: x.level, wcpm: x.wcpm, accuracy: x.accuracy, pass: x.pass, says: x.says, by: x.by }; }),
    summary: pfkRtrSummary_(rd, Date.now()), suggest: pfkRtrSuggest_(g, rd), tapRuleFromGrade: 3 };
}
/* Save one reading. a = {item, wrong: [word index], last, seconds, says}. Returns the reading, his summary and the card. */
function pfkRtrSave(token, sid, a) {
  sid = String(sid || ''); var s = pfkRtrStaff_(token, sid); a = a || {};
  var p = pfkRtrPassage_(a.item); if (!p) throw new Error('Pick a passage.');
  var says = String(a.says || ''); if (PFK_RTR.SAYS.indexOf(says) < 0) throw new Error('Answer the question: is this his Kriyah level?');
  var sc = pfkRtrScore_(p, a.wrong, a.last, a.seconds), who = pfWho_(s);
  return pfLock_(function () {
    var now = Date.now(), all = pfkSessionsOf_(sid), S = all.filter(function (x) { return x.status === 'active'; }).pop() || all.filter(function (x) { return x.status === 'complete'; }).pop() || null;
    var detail = { test: PFK.TEST, kind: 'rtr', item: p.id, level: p.level, seconds: sc.seconds, reached: sc.reached, wrong: sc.wrong, right: sc.right, wcpm: sc.wcpm, accuracy: sc.accuracy, pass: sc.pass,
      line: sc.line, provisional: p.provisional, rebbe_says: says, finished: sc.finished, form: p.form };
    pfTab_('results').appendRow([new Date(now), S ? S.id : 'PFK-RTR', sid, 'K.RTR', 'done', sc.pass ? p.level : '', '', '', '', '{}', '', '{}', '[]', '[]', '{}', JSON.stringify(sc.pass ? [] : ['not passed']), sc.reached, 'no', who, JSON.stringify(detail)]);
    var sm = pfkRtrSummaryOf_(sid, now);
    if (S) {
      S.state.rtr = sm;
      S.flags.push({ at: new Date(now).toISOString(), by: who, action: 'Read to Rebbe Level ' + p.level + ': ' + sc.wcpm + ' wcpm, ' + Math.round(sc.accuracy * 100) + '%' + (sc.pass ? ' (passed)' : '') });
      if (S.status === 'active') pfkReplan_(S.state);
      pfkSave_(S);
      if (S.status === 'complete') { S.state.profile = pfkProfileRow_(S, who); pfkSave_(S); }
    }
    var card = pfkRtrCard(token, sid);
    return { reading: sc, says: says, summary: sm, card: card, profile: S && S.status === 'complete' ? S.state.profile : null };
  });
}
/* For tuning the pass lines later (4.2 calibration). Staff only. Every TEST reading in his scope with the rebbe's answer; per
   passage, how often the app's pass/fail agrees with the rebbe ("yes"/"higher" on a pass, "lower" on a fail; "no" is not counted).
   No names are returned, and nothing is changed: no auto-tuning. */
function pfkRtrCalibration(token) {
  pfkRtrStaff_(token, null);
  var scope = typeof TL_SCOPE_ !== 'undefined' ? TL_SCOPE_ : null, rows = pfRows_('results'), by = {}, list = [];
  rows.forEach(function (v) { if (String(v[3]) !== 'K.RTR') return; var sid = String(v[2]); if (scope && !scope[sid]) return; var d = pfJson_(v[19], {}) || {}; if (!d.item) return;
    list.push({ level: d.level, wcpm: d.wcpm, accuracy: d.accuracy, pass: !!d.pass, says: d.rebbe_says || '' });
    var B = by[d.level] = by[d.level] || { readings: 0, answered: 0, agree: 0, says: { yes: 0, no: 0, higher: 0, lower: 0 } };
    B.readings++; if (B.says[d.rebbe_says] != null) B.says[d.rebbe_says]++;
    if (d.rebbe_says === 'no' || !d.rebbe_says) return; B.answered++;
    if ((d.pass && (d.rebbe_says === 'yes' || d.rebbe_says === 'higher')) || (!d.pass && d.rebbe_says === 'lower')) B.agree++; });
  return { lines: pfkRtrPassages_().map(function (p) { return { level: p.level, wcpm: p.wcpm, acc: p.acc, provisional: p.provisional }; }), byLevel: by, readings: list, target: '8 in 10 agree, after 40 boys' };
}
