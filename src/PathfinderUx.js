/* PATHFINDER UX (07 PATHFINDER BUILD PROMPT v7.2, Stage 5: items 13, 18 and 25). 2026-11-16, Claude Code builder (ui).
   TEST boys only (pfIsTest_). A boy who is not a TEST boy never reaches any of this: every hook in Pathfinder.js checks
   pfIsTest_ or a section flag (sec.pfuK) that is only ever set for TEST boys. PF_LIVE_GRADES is not touched.
   - Item 13 (PF-EXP3 rule F), K-2 TEST boys, Reading and Math: the picker aims at estimate - 0.62; the first 2 questions are
     warm-ups at estimate - 1.5 (scored as normal); the section ends with ONE kind last question at estimate - 2.5 that is shown
     and saved (PF_Answers phase "kind (not scored)") but never scored and never paid. "Take your time" pause at most twice a section.
     The scoring engine (pfPost_, pfRecord_, pfResult_) is unchanged.
   - Item 18 (PF-AUD1): a sound check before every sitting (TEST boys): 4 minimal-pair taps at 70% volume (the browser's
     speechSynthesis reads the word; no recorded audio files exist yet). 2 or more wrong: "Let's make the sound clearer! Please
     call your teacher." and the section does not open until a re-run passes. Not scored, not paid. Device report: tab PF_Sound
     (device id + device type + result, never a name) and pfuSoundReport (staff only).
   - Item 25 (PF-FIRSTDAY1 v2): intro screens, boy day-1 screens and rebbe screens; the words live in PFU.TEXT (word for word).
   - Cha-ching (HoS DECISION 2026-11-16, LOG 1510): in Pathfinder the cha-ching plays ONCE at the end of each section with the
     section's total. This file only COUNTS what pfAfterAnswer_ already paid (sec.pfuCents); it pays nothing and changes no amount.
   Page side: PathfinderUxPage.html. Lesson link on the home page: PathfinderGo.html. */
var PFU = {
  VERSION: 'pfu-1.0.0',
  PICK_OFF: -0.62, WARM_OFF: -1.5, WARM_N: 2, KIND_OFF: -2.5,           /* PF-EXP3 "For the builder" 1-3 */
  SLOW_MAX: 2,                                                          /* "Take your time": at most twice per section */
  STEPS: 8,                                                             /* the progress path: 8 stones, no numbers */
  SOUND: { n: 4, failAt: 2, volume: 0.7,                                /* PF-AUD1: 4 taps, 2+ wrong = call staff, 70% volume */
    /* minimal-pair sets (draft; "the content screen chooses the final sets", PF-AUD1). [word, picture] */
    SETS: [[['cat', '🐈'], ['cap', '🧢'], ['cab', '🚕']], [['pin', '📌'], ['pen', '🖊️'], ['pan', '🍳']], [['map', '🗺️'], ['mop', '🧹'], ['mug', '☕']],
      [['ship', '🚢'], ['sheep', '🐑'], ['shop', '🏪']], [['log', '🪵'], ['dog', '🐕'], ['fog', '🌫️']], [['sock', '🧦'], ['rock', '🪨'], ['lock', '🔒']], [['fan', '🪭'], ['van', '🚐'], ['can', '🥫']]] },
  SOUND_TAB: ['at', 'device_id', 'device', 'result', 'wrong', 'of', 'try', 'band', 'session_id'],
  /* the road's lands by level (same names as the Journey Map in QuestPage, LANDS): a level is a place, never a number */
  LANDS: ['The Village', 'Green Meadows', 'Tall Forest', 'River Crossing', 'Rolling Hills', 'Red Canyon', 'Cactus Desert', 'Snowy Pass', 'The Summit'],
  /* PF-R1 v3 strength lines (3-8) and short K-2 names; which strand points to which strength is this builder's mapping (OPEN QUESTION) */
  STRENGTH: { reading: 'You read with a smooth, strong voice.', comprehension: 'You understand stories and find the important ideas.', listening: 'You understand a lot when you listen.',
    vocab: 'You know many words and what they mean.', math_facts: 'You know your math facts quickly.', math_problem: 'You can figure out word problems.', effort: 'You kept trying, even on hard questions.' },
  STRENGTH_K2: { reading: 'reading words', comprehension: 'stories', listening: 'listening', vocab: 'words', math_facts: 'numbers', math_problem: 'math puzzles', effort: 'trying hard' },
  STRAND_STRENGTH: { READ: { PA: 'listening', DEC: 'reading', WRD: 'reading', FLU: 'reading', VOC: 'vocab', LIT: 'comprehension', INF: 'comprehension' },
    MATH: { NPV: 'math_facts', AS: 'math_facts', MD: 'math_facts', FD: 'math_problem', MMT: 'math_problem', GEO: 'math_problem', DATA: 'math_problem', RA: 'math_problem' } },
  SUBJ: { READ: 'Reading', MATH: 'Math' },
  /* PF-FIRSTDAY1 v2, word for word ({x} = filled by the app). Checked by pfuWordCheck_ and by pf_day1.js / pf_notice1.js. */
  TEXT: {
    intro38: [['hello', 'Hello, {first}! This is Pathfinder.'], ['what', 'Pathfinder helps us find the best place to start your lessons.'],
      ['how', 'Some questions will feel easy and some will feel hard. That is how it works. Nobody gets every one.'],
      ['try', 'Just try your best. If you are not sure, choose the answer you think is best.'],
      ['time', 'There is no rush. You can take a short rest when the app offers one.'], ['go', 'Ready? Tap Start.']],
    introK2: [['hello', 'Hi, {first}! Let us play.'], ['listen', 'Put on your headphones.'], ['what', 'You will look, listen and tap.'],
      ['how', 'Some are easy. Some are hard. That is fine.'], ['try', 'Just do your best.'], ['go', 'Tap the big green arrow to start.']],
    day1K2: [['done', 'You did it, {first}! Thank you for trying hard.'], ['strengths', 'You are great at this: {strength_1}.'], ['roads', 'Here is your road. Next stop: {next_land}.'],
      ['today', 'Let us start your first lesson!'], ['changes', 'Your road grows with you.'], ['retake', 'We will do one part later. A rebbe will help.']],
    boy: [['done', 'You finished Pathfinder, {first}!', 'Thank you for trying your best. Now we know where your path starts.'],
      ['strengths', 'Here is what you are great at:', '{strength_1} / {strength_2} / {strength_3}'],
      ['roads', 'Your roads', '{subject}: you are in {land}. Next stop: {next_land}.'],
      ['today', 'Your first lesson today', '{subject}: {goal_skill_name}. Your first step: {first_step}'],
      ['changes', 'Your path grows with you', 'As you do your lessons, your path keeps finding the right next step for you.'],
      ['own_goal', 'You told us you want to get better at {own_goal}.', 'Here is how we will work on it: {own_goal_step}'],
      ['retake', 'One more try another day', 'Your {section} section will be finished on another day, with a staff member next to you. Your other roads are ready now.']],
    rebbe: [['profile', 'Pathfinder profile for {first} {last_initial}', 'One screen: every result with how sure we are (PF-ONE1).'],
      ['watch', 'What to watch this week', '1. His first 5 lesson answers in each subject re-place him automatically. You will see any change here. 2. Skills marked "check in class": a quick look in class settles them. 3. Any section waiting for a retake.'],
      ['override', 'You can change any level', 'Tap a level to change it. Your choice wins, and the app notes who changed it and when.'],
      ['flags', 'Look closer', '{flags_or_none}. Flags are prompts, never a diagnosis, and are never shown to the boy.'],
      ['home', 'Parent summary', 'Ready when you are. Nothing goes home until a staff member sends it.']],
    /* screen order after the last section (PF-FIRSTDAY1 v2 "For the builder") */
    ORDER: ['done', 'strengths', 'roads', 'own_goal', 'retake', 'changes', 'today'],
    slowK2: 'Take your time. Read it once more.',                       /* PF-EXP3 */
    soundHead: 'Sound check!', soundAsk: 'Listen. Tap the picture you hear.', soundFix: 'Let\'s make the sound clearer! Please call your teacher.'   /* PF-AUD1 */
  },
  /* own goal (About me "better"): one concrete step. Draft wording by this builder (OPEN QUESTION) */
  GOAL_STEP: [[/read/i, 'read the same short page three times; each time it gets smoother.'], [/spell/i, 'practice 3 tricky words a week, not 20.'], [/writ|hand/i, 'write a few careful sentences in your lessons each day.'],
    [/math|number|fraction|times|divid/i, 'a few minutes of math practice in your lessons every day.'], [/./, 'your lessons will give you a little practice with it every day.']]
};

/* ---------------------------------------------------------------- who gets what (TEST only) */
function pfuK2_(S) { var g = S.grade === '' || S.grade == null ? null : Number(S.grade); return !!S.state.young || (g != null && g <= 2); }
/* pfOpen hook: a NEW core section of a K-2 TEST boy uses the kind picker (rule F). Returns nothing. */
function pfuSecInit_(S, r, sec, subject) {
  if (!pfV8On_(r.id) || PF.CORE.indexOf(subject) < 0) return;
  sec.pfuCents = 0;
  if (pfuK2_(S)) sec.pfuK = 1;
}

/* ---------------------------------------------------------------- item 13: the kind picker (pure; used by pfPickAdaptive_ / pfNext_) */
/* The point the picker aims at: 2 warm-ups at estimate - 1.5, then estimate - 0.62 (about 65% right without guessing). */
function pfuPickTheta_(sec) { return sec.theta + (sec.ans.length < PFU.WARM_N ? PFU.WARM_OFF : PFU.PICK_OFF); }
/* The kind last question: one easy question at estimate - 2.5, after the section's last scored question. Not part of a passage. */
function pfuKind_(sec, seen, rnd) {
  if (sec.pfuKq) return null;
  var avail = pfAvail_(sec, seen).filter(function (x) { return !x.it.passage; }); if (!avail.length) return null;
  var fresh = avail.filter(function (x) { return x.fresh; }); if (fresh.length) avail = fresh;   /* exposure (PF-E3) still applies */
  var th = sec.theta + PFU.KIND_OFF, lvl = pfLevelOf_(th), win = [], d;
  for (d = 0; d <= 8 && !win.length; d++) win = avail.filter(function (x) { return Math.abs(x.it.level - lvl) <= d; });
  win.sort(function (a, b) { return pfInfo_(th, b.it) - pfInfo_(th, a.it); });
  var top = win.slice(0, Math.min(3, win.length)), it = top[Math.floor((rnd || Math.random)() * top.length) % top.length].it;
  sec.pfuKq = it.id; sec.phase = 'kind';
  return it;
}
/* pfAnswer hook: the boy answered the kind last question. Saved (PF_Answers, phase "kind (not scored)"), never scored, never paid. */
function pfuKindAnswer_(S, r, k, sec, a, now) {
  var it = pfIx_().byId[sec.cur.i], value = String(a.value == null ? '' : a.value).slice(0, 60), sc = a.idk ? { x: 0, code: 'IDK' } : pfScore_(it, value);
  sec.pfuKa = { i: it.id, x: sc.x, c: sc.code, t: Math.round(Number(a.ms) || 0), k: a.idk ? 1 : 0, at: now };
  pfTab_('answers').appendRow([new Date(), S.id, r.id, k, sec.ans.length + 1, it.id, it.skill, it.strand, it.level, it.fmt, value, sc.x, sc.code, sec.pfuKa.t, 0, sec.pfuKa.k, '', Math.round(sec.theta * 100) / 100, Math.round(sec.se * 100) / 100, 'kind (not scored)', it.status !== 'Approved' ? 'draft' : '']);
  S.state.sit.last = now; sec.cur = null;
  return pfFinish_(S, r, k, { paid: { cents: 0, edge: false, edgeCents: 0, rapid: false, dkn: !!a.idk } });
}
/* pfAnswer hook after pfAfterAnswer_ (TEST boys): count what was just paid (for the one cha-ching at the end of the section), and
   the K-2 "Take your time" cap: the pause shows at most twice per section; after that the staff alert is still written. */
function pfuAfter_(S, k, sec, rec, extra, now) {
  sec.pfuCents = (sec.pfuCents || 0) + ((extra.paid && extra.paid.cents) || 0);
  if (sec.pfuK && sec.rapidRun >= PF.RAPID.run) {
    if ((sec.pfuSlow || 0) >= PFU.SLOW_MAX) { sec.rapidRun = 0; S.flags.push({ at: new Date(now).toISOString(), by: 'pathfinder', action: '3 rapid guesses in a row in ' + k + ' (no pause: "Take your time" already shown twice)', alert: 1 }); }
    else sec.pfuSlow = (sec.pfuSlow || 0) + 1;
  }
}

/* ---------------------------------------------------------------- what the page sees (pfView_ hook; TEST boys only) */
function pfuView_(S, r, v) {
  var k = S.state.cursec, sec = k ? S.state.sections[k] : null, out = { on: 1, version: PFU.VERSION, k2: pfuK2_(S), band: pfuK2_(S) ? 'K-2' : '3-8', volume: PFU.SOUND.volume };
  if (sec && !sec.done && sec.pfuK) {
    var E = pfEng_(sec.subj), n = pfScored_(sec).length, near = sec.phase === 'boundary' || sec.phase === 'kind' || n >= E.totalMax - 3 || (n >= E.minItems && pfSeEff_(sec) <= E.seStop + 0.08);
    /* the footprints move forward after every answer (right or wrong alike); "Almost done!" only when the stop rule is near */
    var frac = sec.phase === 'kind' ? 1 : Math.min(near ? 0.95 : 0.85, Math.max(near ? 0.88 : 0, sec.ans.length / (E.minItems + 15)));
    out.kind = 1; out.prog = { frac: Math.round(frac * 1000) / 1000, steps: Math.floor(frac * PFU.STEPS), of: PFU.STEPS, near: near };
  }
  if (v.finished) { var fs = S.state.sections[v.finished.section]; out.secCents = (fs && fs.pfuCents) || 0; out.secTotal = out.secCents + (v.finished.jar || 0) + (v.finished.finish || 0); }
  return out;
}

/* ---------------------------------------------------------------- item 18: sound check */
function pfuTab_() {
  var ss = msBook_(), sh = ss.getSheetByName('PF_Sound');
  if (!sh) { sh = ss.insertSheet('PF_Sound'); sh.getRange(1, 1, 1, PFU.SOUND_TAB.length).setValues([PFU.SOUND_TAB]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function pfuSoundSets_(rnd) {
  rnd = rnd || Math.random; var idx = PFU.SOUND.SETS.map(function (x, i) { return i; }), out = [];
  for (var i = idx.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
  idx.slice(0, PFU.SOUND.n).forEach(function (si) { var set = PFU.SOUND.SETS[si], tg = set[Math.floor(rnd() * set.length) % set.length][0];
    var opts = set.slice(); for (var a = opts.length - 1; a > 0; a--) { var b = Math.floor(rnd() * (a + 1)), u = opts[a]; opts[a] = opts[b]; opts[b] = u; }
    out.push({ word: tg, opts: opts.map(function (o) { return { w: o[0], e: o[1] }; }) }); });
  return out;
}
/* pure: how many of his picks miss the word that was said; 2 or more = the sound needs fixing */
function pfuSoundScore_(sets, picks) { var wrong = 0; sets.forEach(function (s, i) { if (String((picks || [])[i] || '') !== s.word) wrong++; }); return { wrong: wrong, of: sets.length, ok: wrong < PFU.SOUND.failAt }; }
/* pfOpen / pfStart hook (TEST boys): no question is shown in a sitting until its sound check passed. Returns a view, or null to go on. */
function pfuGate_(S, r, subject, now) {
  var st = S.state.sit, snd = S.state.pfuSnd = S.state.pfuSnd || { tries: 0, fails: 0 };
  if (snd.ok && snd.sit === st.start) return null;
  var seed = pfHash_(S.id + '|' + snd.tries + '|' + st.start) || 1;   /* its own random numbers: the question picker's are not touched */
  snd.cur = pfuSoundSets_(function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }); snd.subject = subject; snd.ok = 0;
  pfSaveSession_(S);
  return pfView_(S, r, { cur: null, pfuSound: { subject: subject, sets: snd.cur, stuck: snd.fails > 0 && !snd.ok, volume: PFU.SOUND.volume } });   /* no question until it passes */
}
/* The boy's 4 taps. device = {id, info} from the page (a random id kept on this device, and its type). */
function pfuSoundSave(token, picks, device) {
  var r = pfMe_(token); if (!pfV8On_(r.id)) throw new Error('That part of the road opens later.');
  return pfLock_(function () {
    var S = pfActive_(r.id); if (!S) throw new Error('Please start again.');
    var snd = S.state.pfuSnd; if (!snd || !snd.cur) throw new Error('Please start again.');
    var sc = pfuSoundScore_(snd.cur, picks); snd.tries++;
    var res = sc.ok ? (snd.fails ? 'fixed' : 'passed') : 'failed';
    if (sc.ok) { snd.ok = 1; snd.sit = S.state.sit.start; snd.fails = 0; } else snd.fails++;
    snd.cur = null; snd.last = { at: Date.now(), result: res, wrong: sc.wrong };
    if (!sc.ok) S.flags.push({ at: new Date().toISOString(), by: 'pathfinder', action: 'sound check: ' + sc.wrong + ' of ' + sc.of + ' missed; asked staff to check the headphones', alert: 1 });
    var d = device || {};
    pfuTab_().appendRow([new Date(), String(d.id || '').slice(0, 24), String(d.info || '').slice(0, 80), res, sc.wrong, sc.of, snd.tries, pfuK2_(S) ? 'K-2' : '3-8', S.id]);
    pfSaveSession_(S);
    return { ok: sc.ok, result: res, subject: snd.subject || '' };
  });
}
/* Office report (staff only): devices by how often their sound check fails. */
function pfuSoundReport(token) {
  pfStaff_(token); var sh = pfuTab_(), n = sh.getLastRow(), by = {};
  if (n >= 2) sh.getRange(2, 1, n - 1, PFU.SOUND_TAB.length).getValues().forEach(function (v) { var id = String(v[1] || '?'), o = by[id] = by[id] || { device: id, info: String(v[2] || ''), checks: 0, failed: 0, fixed: 0, lastFail: '' };
    o.checks++; if (v[3] === 'failed') { o.failed++; o.lastFail = new Date(v[0]).toISOString(); } if (v[3] === 'fixed') o.fixed++; });
  return Object.keys(by).map(function (k) { return by[k]; }).sort(function (a, b) { return b.failed - a.failed || b.checks - a.checks; });
}

/* ---------------------------------------------------------------- item 25: day-1 screens (boy) and rebbe screens (staff) */
function pfuFill_(t, f) { return String(t).replace(/\{(\w+)\}/g, function (m, k) { return f[k] != null ? String(f[k]) : m; }); }
function pfuLand_(lv) { lv = Math.max(1, Math.min(9, Number(lv) || 1)); return PFU.LANDS[lv - 1]; }
function pfuStrengths_(S) {
  var g = S.grade === '' || S.grade == null ? null : Number(S.grade), gl = g == null ? null : g + 1, rows = [], rapid = 0;
  PF.CORE.forEach(function (k) { var sec = S.state.sections[k]; if (!sec || !sec.done) return; rapid += sec.rapidN || 0;
    var res = pfResult_(JSON.parse(JSON.stringify(sec)), pfLadder_(k));
    Object.keys(res.strands).forEach(function (st) { var key = (PFU.STRAND_STRENGTH[k] || {})[st]; if (key) rows.push({ key: key, d: res.strands[st].level - (gl == null ? res.level : gl), se: res.strands[st].se }); }); });
  rows.sort(function (a, b) { return b.d - a.d || a.se - b.se; });   /* PF-R1 v3: furthest above his grade's Level first; ties: the narrower range */
  var out = []; rows.forEach(function (x) { if (out.indexOf(x.key) < 0) out.push(x.key); });
  if (!rapid && out.indexOf('effort') < 0) out.splice(Math.min(2, out.length), 0, 'effort');
  return out.slice(0, 3);
}
/* The boy's day-1 data (after his last core section). No level numbers anywhere: levels become lands. */
function pfuDay1(token) {
  var r = pfMe_(token); if (!pfV8On_(r.id)) return null;
  var all = pfSessionsOf_(r.id), S = all[all.length - 1]; if (!S) return null;
  var k2 = pfuK2_(S), first = String(r.name).split(' ')[0], plan = plPlanFor_(r.id, {}).place, roads = [], retake = [], lesson = null;
  PF.CORE.forEach(function (k) { var sec = S.state.sections[k]; if (!sec || !sec.done || !sec.result) return;
    if (sec.result.status === 'retake') { retake.push(PFU.SUBJ[k]); return; }
    var p = plan[k]; if (!p || !p.level) return;
    roads.push({ k: k, subject: PFU.SUBJ[k], land: pfuLand_(p.level), next_land: p.level >= 9 ? 'the top of the road' : pfuLand_(p.level + 1) });
    if (!lesson && p.path && p.path.length) { var row = (plList_(k) || []).filter(function (x) { return x[0] === p.path[0]; })[0];
      if (row) lesson = { c: k, id: row[0], subject: PFU.SUBJ[k], goal_skill_name: row[1], first_step: String(row[2] || '').replace(/\.?$/, '.') }; } });
  var sk = pfuStrengths_(S), ab = S.state.sections.ABOUT, better = ab && ab.answers && ab.answers.better ? [].concat(ab.answers.better).filter(Boolean) : [];
  var goal = better.length ? String(better[0]) : '', step = goal ? PFU.GOAL_STEP.filter(function (x) { return x[0].test(goal); })[0][1] : '';
  var f = { first: first, strength_1: '', strength_2: '', strength_3: '' };
  sk.forEach(function (key, i) { f['strength_' + (i + 1)] = k2 ? PFU.STRENGTH_K2[key] : PFU.STRENGTH[key]; });
  var o = pfuScreens_({ k2: k2, f: f, strengths: sk.map(function (key) { return k2 ? PFU.STRENGTH_K2[key] : PFU.STRENGTH[key]; }), roads: roads, retake: retake, lesson: lesson, goal: goal, goalStep: step });
  o.sid = r.id; return o;
}
/* pure: the screens in PF-FIRSTDAY1 order, filled. Each screen: {id, head, lines[]} (K-2: head = the one read-aloud sentence). */
function pfuScreens_(d) {
  var T = PFU.TEXT, out = [], f = d.f;
  function k2(id) { return T.day1K2.filter(function (x) { return x[0] === id; })[0]; }
  function boy(id) { return T.boy.filter(function (x) { return x[0] === id; })[0]; }
  T.ORDER.forEach(function (id) {
    if (id === 'own_goal' && (!d.goal || d.k2)) return;                      /* only if he named a goal (K-2 has no own-goal wording) */
    if (id === 'retake' && !d.retake.length) return;                          /* only if a section was marked for retake */
    if (id === 'roads' && !d.roads.length) return;
    if (d.k2) {
      var w = k2(id); if (!w) return;
      if (id === 'strengths') { if (!d.strengths.length) return; out.push({ id: id, head: pfuFill_(w[1], { strength_1: d.strengths[0] }) }); return; }
      if (id === 'roads') { d.roads.forEach(function (x) { out.push({ id: id, head: pfuFill_(w[1], x), k: x.k, subject: x.subject, land: x.land }); }); return; }
      out.push({ id: id, head: pfuFill_(w[1], f), lesson: id === 'today' ? d.lesson : undefined }); return;
    }
    var b = boy(id);
    if (id === 'strengths') { if (!d.strengths.length) return; out.push({ id: id, head: b[1], lines: d.strengths.slice() }); return; }
    if (id === 'roads') { out.push({ id: id, head: b[1], lines: d.roads.map(function (x) { return pfuFill_(b[2], x); }), roads: d.roads }); return; }
    if (id === 'today') { if (!d.lesson) { out.push({ id: id, head: b[1], lines: [] }); return; } out.push({ id: id, head: b[1], lines: [pfuFill_(b[2], d.lesson)], lesson: d.lesson }); return; }
    if (id === 'own_goal') { out.push({ id: id, head: pfuFill_(b[1], { own_goal: d.goal }), lines: [pfuFill_(b[2], { own_goal_step: d.goalStep })] }); return; }
    if (id === 'retake') { d.retake.forEach(function (s) { out.push({ id: id, head: b[1], lines: [pfuFill_(b[2], { section: s })] }); }); return; }
    out.push({ id: id, head: pfuFill_(b[1], f), lines: [pfuFill_(b[2], f)] });
  });
  return { k2: d.k2, screens: out, lesson: d.lesson };
}
/* The rebbe's 5 screens for one TEST boy (staff only). They sit on top of the staff report. Staff may see level numbers. */
function pfuRebbe(token, sid) {
  var s = pfStaff_(token); sid = String(sid || ''); if (!pfV8On_(sid)) return null;
  var r = msRoster_().filter(function (x) { return x.id === sid; })[0]; if (!r) throw new Error('That student is not on the list.');
  var nm = String(r.name).split(' '), all = pfSessionsOf_(sid), last = all[all.length - 1], place = plPlacements_()[sid] || {}, rows = [], flags = [];
  pfRows_('results').filter(function (v) { return String(v[2]) === sid && last && String(v[1]) === last.id && PF.CORE.indexOf(String(v[3])) >= 0; }).forEach(function (v) {
    var rg = pfJson_(v[9], {}), k = String(v[3]), p = place[k] || {};
    rows.push({ k: k, subject: PFU.SUBJ[k], status: String(v[4]), level: Number(v[5]), lo: rg.levelLo, hi: rg.levelHi, placed: p.level || null, by: p.by || '', sure: 'Fairly sure' });   /* PF-ONE1 v2: day 1 = "Fairly sure" */
    pfJson_(v[15], []).forEach(function (x) { flags.push(PFU.SUBJ[k] + ': ' + x); }); });
  (last ? last.flags : []).filter(function (x) { return x.alert; }).forEach(function (x) { flags.push(x.action); });
  var f = { first: nm[0], last_initial: (nm[nm.length - 1] || '').charAt(0) + '.', flags_or_none: flags.length ? flags.join('; ') : 'None' };
  return { screens: PFU.TEXT.rebbe.map(function (x) { return { id: x[0], head: pfuFill_(x[1], f), text: pfuFill_(x[2], f) }; }), rows: rows, flags: flags, staff: pfWho_(s) };
}
/* "Tap a level to change it": the existing staff placement (plPlace), plus a note of who changed it and when on his Pathfinder. */
function pfuOverride(token, sid, subject, level) {
  var s = pfStaff_(token); sid = String(sid || ''); if (!pfV8On_(sid)) throw new Error('Pathfinder is not open for this boy yet.');
  if (PF.CORE.indexOf(String(subject)) < 0) throw new Error('Unknown subject.');
  plPlace(token, [sid], subject, level, '');
  pfLock_(function () { var all = pfSessionsOf_(sid), S = all[all.length - 1]; if (S) { S.flags.push({ at: new Date().toISOString(), by: pfWho_(s), action: 'rebbe set ' + subject + ' to Level ' + level }); pfSaveSession_(S); } });
  return pfuRebbe(token, sid);
}

/* ---------------------------------------------------------------- checks (called by pfSelfTest) */
var PFU_NEVER_ = ['low', 'lowest', 'weak', 'weakness', 'behind', 'below grade', 'deficit', 'disability', 'disabled', 'dyslexia', 'dyslexic', 'ADHD', 'diagnosis', 'diagnose', 'lazy', 'slow learner', 'remedial', 'failing', 'failed', 'bad at', 'smart', 'gifted', 'genius', 'than other boys', 'than his classmates', 'percentile', 'grade level', 'not growing', 'no progress', 'stalled', 'stuck', 'wrong', 'mistakes', 'level'];
function pfuWordCheck_(texts) {
  var re = new RegExp('\\b(' + PFU_NEVER_.map(function (w) { return w.replace(/ /g, '\\s+'); }).join('|') + ')\\b', 'i'), bad = [];
  texts.forEach(function (t) { if (re.test(t)) bad.push('never-use word "' + t.match(re)[0] + '" in: ' + t); if (/\bL\d|\bLevel\b|\d+\s+of\s+\d+/i.test(t)) bad.push('level number or "n of m" in: ' + t); if (/other boys|than you|classmates|everyone else/i.test(t)) bad.push('comparison in: ' + t); });
  return bad;
}
/* K-2 rule F simulation (made-up boys): share right, longest run of misses, last scored answer a miss, kind question shown. */
function pfuSimulate_(n, subj, seed, kind) {
  var s = seed || 5; function rnd() { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }
  var right = 0, shown = 0, endMiss = 0, kindN = 0, kindRight = 0, runs = 0, errs = 0, items = 0, warmRight = 0, warmN = 0, kindScored = 0;
  for (var k = 0; k < n; k++) {
    var grade = Math.floor(rnd() * 3), trueTh = pfThetaOfLevel_(grade + 1) - 1 + rnd() * 2;   /* K-2 boys around their grade's Level */
    var sec = pfNewSection_(subj, grade, 0, false, false, 0), it, g = 0, run = 0, best = 0, last = null;
    if (kind) sec.pfuK = 1;
    while ((it = pfNext_(sec, null, rnd)) && g++ < 90) {
      var x = rnd() < pfP_(trueTh, it.b, pfGuess_(it));
      if (sec.pfuKq === it.id) { kindN++; if (x) kindRight++; sec.cur = null; sec.done = true; break; }
      pfRecord_(sec, it, x ? it.ans : (it.wrong && it.wrong.length ? it.wrong[0][0] : 'zz'), 20000, false, '');
      shown++; if (x) right++; run = x ? 0 : run + 1; best = Math.max(best, run); last = x;
      if (sec.ans.length <= PFU.WARM_N) { warmN++; if (x) warmRight++; }
    }
    var res = pfResult_(sec, pfLadder_(subj)); if (res.used !== pfScored_(sec).length) kindScored++;
    runs += best; if (last === false) endMiss++; errs += Math.abs(sec.theta - trueTh); items += res.used;
  }
  var pc = function (a, b) { return Math.round(100 * a / Math.max(1, b)); };
  return { boys: n, subject: subj, rule: kind ? 'F (kind)' : 'now', rightPct: pc(right, shown), warmUpRightPct: pc(warmRight, warmN), longestMissRun: Math.round(10 * runs / n) / 10,
    lastScoredIsMissPct: pc(endMiss, n), endsOnKindQuestionPct: pc(kindN, n), kindRightPct: pc(kindRight, kindN), meanItems: Math.round(10 * items / n) / 10, meanAbsError: Math.round(100 * errs / n) / 100, kindCountedInScore: kindScored };
}
function pfuSelfTest_(opts) {
  opts = opts || {}; var out = { version: PFU.VERSION, problems: [] }, P = out.problems;
  /* words: every boy screen is free of never-use words and level numbers; placeholders all known */
  var known = { first: 1, last_initial: 1, strength_1: 1, strength_2: 1, strength_3: 1, subject: 1, land: 1, next_land: 1, goal_skill_name: 1, first_step: 1, own_goal: 1, own_goal_step: 1, section: 1, flags_or_none: 1 };
  var boyTexts = [].concat(PFU.TEXT.intro38.map(function (x) { return x[1]; }), PFU.TEXT.introK2.map(function (x) { return x[1]; }), PFU.TEXT.day1K2.map(function (x) { return x[1]; }), PFU.TEXT.boy.map(function (x) { return x[1] + ' ' + x[2]; }),
    Object.keys(PFU.STRENGTH).map(function (k) { return PFU.STRENGTH[k] + ' ' + PFU.STRENGTH_K2[k]; }), PFU.LANDS, PFU.GOAL_STEP.map(function (x) { return x[1]; }), [PFU.TEXT.slowK2, PFU.TEXT.soundHead, PFU.TEXT.soundAsk, PFU.TEXT.soundFix]);
  pfuWordCheck_(boyTexts.map(function (t) { return t.replace(/\bintro\b/, ''); })).forEach(function (x) { P.push('words: ' + x); });
  [].concat(boyTexts, PFU.TEXT.rebbe.map(function (x) { return x[1] + ' ' + x[2]; })).forEach(function (t) { (String(t).match(/\{(\w+)\}/g) || []).forEach(function (m) { if (!known[m.slice(1, -1)]) P.push('unknown placeholder ' + m); }); });
  if (PFU.TEXT.boy.length !== 7 || PFU.TEXT.rebbe.length !== 5 || PFU.TEXT.intro38.length !== 6 || PFU.TEXT.introK2.length !== 6) P.push('screen counts are not 7 boy / 5 rebbe / 6+6 intro');
  /* order: done -> strengths -> roads -> (own goal) -> (retake) -> path grows -> first lesson today */
  var demo = pfuScreens_({ k2: false, f: { first: 'Test' }, strengths: ['a', 'b', 'c'], roads: [{ k: 'READ', subject: 'Reading', land: 'Tall Forest', next_land: 'River Crossing' }], retake: ['Math'], lesson: { c: 'READ', id: 'X', subject: 'Reading', goal_skill_name: 'G', first_step: 'S.' }, goal: 'reading faster', goalStep: 'x' });
  var ids = demo.screens.map(function (x) { return x.id; }).join('>');
  if (ids !== 'done>strengths>roads>own_goal>retake>changes>today') P.push('day-1 order is ' + ids);
  var demo2 = pfuScreens_({ k2: false, f: { first: 'Test' }, strengths: ['a'], roads: [], retake: [], lesson: null, goal: '', goalStep: '' });
  if (demo2.screens.some(function (x) { return x.id === 'own_goal' || x.id === 'retake'; })) P.push('own goal / retake shown when they should not be');
  /* sound check rule */
  var sets = pfuSoundSets_(function () { return 0.4; });
  if (sets.length !== 4 || sets.some(function (x) { return x.opts.length !== 3 || !x.opts.some(function (o) { return o.w === x.word; }); })) P.push('sound check sets are not 4 x 3 with the word among them');
  var all = sets.map(function (x) { return x.word; }), one = all.slice(); one[0] = 'zz'; var two = one.slice(); two[1] = 'zz';
  if (!pfuSoundScore_(sets, all).ok || !pfuSoundScore_(sets, one).ok || pfuSoundScore_(sets, two).ok) P.push('sound check: 0-1 missed must pass and 2 missed must stop');
  /* picker offsets */
  var sec = { theta: 0, ans: [] }; if (pfuPickTheta_(sec) !== PFU.WARM_OFF) P.push('warm-up offset'); sec.ans = [1, 2]; if (pfuPickTheta_(sec) !== PFU.PICK_OFF) P.push('picker offset');
  /* the kind question pays nothing and is never scored; rule F gets about 2 in 3 right for K-2 */
  var n = opts.boys || 60;
  out.simK2 = { READ: pfuSimulate_(n, 'READ', 21, true), READ_now: pfuSimulate_(n, 'READ', 21, false), MATH: pfuSimulate_(n, 'MATH', 22, true) };
  ['READ', 'MATH'].forEach(function (k) { var x = out.simK2[k];
    /* acceptance test 9 is Reading: about 2 in 3. Math K-2 lands nearer 60% (strand balance and the Level 1 floor; see the report) */
    if (x.rightPct < (k === 'READ' ? 60 : 55) || x.rightPct > 78) P.push(k + ' K-2 rule F: ' + x.rightPct + '% right (want about 2 in 3)');
    if (x.endsOnKindQuestionPct < 95) P.push(k + ' K-2: only ' + x.endsOnKindQuestionPct + '% end on the kind question');
    if (x.kindCountedInScore) P.push(k + ' K-2: the kind question was counted in the score'); });
  return out;
}
