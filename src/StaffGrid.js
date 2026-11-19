/* Tashbar ONE staff screen + one sign-in (07 BUILD PROMPT v3, Phase 1, 2026-11-09, curriculum@ chat). Anyone may edit: log changes in HQ.
   - One sign-in screen for everyone (QuestPage). A staff code lands here (?sg=1). Every other link (plain, ?ms=1, old ?pl=1, old ?ms=1&staff=1) opens that sign-in screen.
   - Grid: every boy x every subject. Tap a square: where he is, now, next, and Give him this skill / Skip ahead / Go back a step.
   - Tap a name: his card. Remove student (archive, never delete). Fix points: Head of School only (MS_Staff role "head"), logged in SG_PointFixes.
   - No money anywhere on this screen for other staff. Uses PL_Place, MS_State, MS_Evidence, MS_Roster, TL Money (unchanged formats). */
var SG = { VERSION: 'sg-1.0.0', IDLE_MIN: 5, FIX_TAB: 'SG_PointFixes', FIX_HEAD: ['at', 'by_id', 'by_name', 'student_id', 'cents', 'reason', 'txn_id', 'undo_of'] };
var SG_SUBJ = [['MATH', 'Math'], ['READ', 'Reading'], ['LANG', 'Writing'], ['SCI', 'Science'], ['SOC', 'Social Studies'], ['COMP', 'Computing'], ['HEB', 'Limudei Kodesh · Lashon Hakodesh'], ['ELEC', 'Electives'], ['VOC', 'Trades'], ['LIFE', 'Life & Money']];

/* Called first by doGet (Code.gs). Returns a page, or null to let doGet carry on as before. */
function sgRoute_(e) {
  var p = (e && e.parameter) || {};
  if (p.canteen === '1' || p.so === '1') return null;                 /* canteen kiosk and daily sign-off: unchanged */
  if (p.pl === '1' && p.check === '1') return null;                   /* a boy's placement check: unchanged */
  if (p.ms === '1' && p.staff === '1' && p.old === '1') return null;  /* old teacher page, only for checking written work */
  if (p.pf === '1' && typeof pfDoGet_ === 'function') return pfDoGet_(e);   /* PATHFINDER (Phase 1): a boy's Pathfinder, or a staff report (&report=id) */
  if (p.sg === '1') return sgPage_();
  if (p.pp === '1' && typeof ppPage_ === 'function') return ppPage_();   /* Access.js: the parent portal */
  if (p.cp === '1' && typeof cpPage_ === 'function') return cpPage_();   /* Access.js: Curriculum Preview (staff) */
  if (p.spark === '1') return HtmlService.createHtmlOutput((function (h) { try { var i = h.indexOf('</head>'); return i < 0 || typeof tlLogoTag_ !== 'function' ? h : h.slice(0, i) + tlLogoTag_() + h.slice(i); } catch (e) { return h; } })(HtmlService.createHtmlOutputFromFile('SparkPath').getContent())).setTitle('Spark Path · Electricity').addMetaTag('viewport', 'width=device-width, initial-scale=1').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);   /* v54: Trades · Electricity lessons, opened inside the boy page (TradesMore.html) */                                 /* the one staff screen (reached by a staff code) */
  /* everything else (plain link, ?ms=1, old ?ms=1&staff=1, old ?pl=1) = the ONE sign-in screen; old Owner screen retired */
  return sgQuest_();
}
/* The boy/staff sign-in page (QuestPage) plus SignOutBar: Sign out top-right on every boy screen, auto sign-out after 5 quiet minutes. */
function sgQuest_() {
  var page = HtmlService.createHtmlOutputFromFile('QuestPage').getContent(), bar = '';
  try { bar = HtmlService.createHtmlOutputFromFile('SignOutBar').getContent(); } catch (e) { bar = ''; }
  try { bar += HtmlService.createHtmlOutputFromFile('PathfinderCard').getContent(); } catch (e) {}
  try { bar += HtmlService.createHtmlOutputFromFile('FireLinks').getContent(); } catch (e) {}   /* EVERYTHING ON FIREBASE: links from web.app carry the sign-in (FireBridge.js) */
  try { bar += HtmlService.createHtmlOutputFromFile('PathfinderGo').getContent(); } catch (e) {}   /* v7.2 Stage 5: opens the first lesson after a TEST boy's Pathfinder day-1 screens (inert otherwise) */
  try { bar += HtmlService.createHtmlOutputFromFile('HomePage').getContent(); } catch (e) {}
  try { bar += HtmlService.createHtmlOutputFromFile('SignInEnergy').getContent(); } catch (e) {}   /* 2026-11-18 HoS: the first page, super-upgraded energy look (off switch TL_SIGNIN_V6=false) */
  try { bar += HtmlService.createHtmlOutputFromFile('KidReminders').getContent(); } catch (e) {}   /* Access.js: reminders from home pop up at their time */   /* the front home page: logo, code pad, flying subjects, encouraging messages */   /* PATHFINDER: "Start your Pathfinder" card on his home screen */
  try { bar += HtmlService.createHtmlOutputFromFile('CalmScreens').getContent(); } catch (e) {}   /* HoS 2026-11-19: no flashing opening screens, pop-ups that do not blink, a calmer home. LAST: it lifts the cover below */
  var i = page.lastIndexOf('</body>');
  if (bar) page = i < 0 ? page + bar : page.slice(0, i) + bar + page.slice(i);
  if (bar.indexOf('__tlCalm') >= 0) { var hd = page.indexOf('</head>');   /* the cover: nothing is drawn until the last layer is ready (CalmScreens lifts it; it lifts itself after 4 s) */
    var cover = '<style id="tl-boot-css">html.tl-boot,html.tl-boot body{background:#0B0630!important}html.tl-boot body>*{visibility:hidden!important}html.tl-boot::after{content:"";position:fixed;inset:0;z-index:2147483647;background:#0B0630}</style><script>document.documentElement.classList.add("tl-boot");setTimeout(function(){document.documentElement.classList.remove("tl-boot");},4000);</script>';
    if (hd >= 0) page = page.slice(0, hd) + cover + page.slice(hd); }
  return HtmlService.createHtmlOutput(tlSound_(tlTheme_(page, 'boy')))
    .setTitle('Tashbar Learning · Middle School')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}
function sgPage_() {
  var page = HtmlService.createHtmlOutputFromFile('StaffScreen').getContent(), add = '';
  try { add = HtmlService.createHtmlOutputFromFile('StaffMore').getContent(); } catch (e) {}
  try { add += HtmlService.createHtmlOutputFromFile('StoreStaff').getContent(); } catch (e) {}   /* v162: Store orders (real prizes, refunds, tzedakah totals) */   /* v128 (DECISION 2230): Messages, My classes, My lessons */
  try { add += HtmlService.createHtmlOutputFromFile('StaffPlus').getContent(); } catch (e) {}   /* v176: tabs (Today, General Studies, Limudei Kodesh grid, Levels), clean header, filters (StaffViews.js). LAST, so it sees every button */
  try { add += HtmlService.createHtmlOutputFromFile('StaffDesk').getContent(); } catch (e) {}   /* v182: picks, notes, shout-outs, This week (StaffNotes.js); right AFTER StaffPlus (uses window.SPX) */
  try { add += HtmlService.createHtmlOutputFromFile('StaffLive').getContent(); } catch (e) {}
  try { add += HtmlService.createHtmlOutputFromFile('StaffAccess').getContent(); } catch (e) {}
  try { add += HtmlService.createHtmlOutputFromFile('SchoolBuilderPage').getContent(); } catch (e) {}   /* v266 takeover3: Schools & Families front door + See what the kids see banner (SchoolBuilder.js) */   /* Access.js: schools, roles, parents (Head of School and school admins) */   /* v197: walk-around (phone), class Olam Haba sky, Torah moments, bechina day, Parsha of the week; LAST (uses SPX and SPD) */
  try { add += HtmlService.createHtmlOutputFromFile('FireLinks').getContent(); } catch (e) {}   /* EVERYTHING ON FIREBASE: links from web.app carry the sign-in (FireBridge.js) */
  try { add += HtmlService.createHtmlOutputFromFile('ScreenFit').getContent(); } catch (e) {}   /* SCREEN-FIT safety net (yosef@ audit 2026-11-18 0945-ET): full-screen boxes that do not fit scroll */
  try { add += HtmlService.createHtmlOutputFromFile('StaffReviewPage').getContent(); } catch (e) {}
  try { add += HtmlService.createHtmlOutputFromFile('StuckSpotsPage').getContent(); } catch (e) {}
  try { add += HtmlService.createHtmlOutputFromFile('DepartmentsPage').getContent(); } catch (e) {}
  try { add += HtmlService.createHtmlOutputFromFile('DeptTodoUI').getContent(); } catch (e) {}
  try { add += HtmlService.createHtmlOutputFromFile('DeptCurrUI').getContent(); } catch (e) {}   /* HoS 2026-11-18: the department head's Curriculum tab + niche departments (DeptCurr.js) */   /* HoS 2026-11-18: Departments Phase 2, the To do board (DeptTodo.js) */   /* HoS 2026-11-18: Departments, Phase 1 (Departments.js) */   /* HoS 2026-11-18: Where kids get stuck (StuckSpots.js), read only */   /* v387 Teaching rule Stage C: rebbe view, automatic and slipping (StaffReview.js) */
  try { add += HtmlService.createHtmlOutputFromFile('DeptMapUI').getContent(); } catch (e) {}
  try { add += HtmlService.createHtmlOutputFromFile('SkillFlowUI').getContent(); } catch (e) {}   /* HoS 2026-11-19: the Skill flow chart (SkillFlow.js), opened from the Course map tab */   /* HoS 2026-11-18: the Course map (every subject, level and lesson in teaching order, gaps) + curriculum/placement band at the top (DeptMap.js) */
  try { add += HtmlService.createHtmlOutputFromFile('StudentLookupUI').getContent(); } catch (e) {}   /* STUDENT LOOKUP (HoS 2026-11-18): Find a student, one page, everything changeable (StudentLookup.js) */
  try { add += HtmlService.createHtmlOutputFromFile('GradeIntakeUI').getContent(); } catch (e) {}   /* LEARN BY LEVEL section 3: Class lists, Grades to confirm, Move up, Learn by level on the student page (GradeIntake.js) */
  try { add += HtmlService.createHtmlOutputFromFile('StaffLibrary').getContent(); } catch (e) {}
  try { add += HtmlService.createHtmlOutputFromFile('StaffHome').getContent(); } catch (e) {}   /* HoS 2026-11-19: the new staff home (5 areas: Students, Today, Curriculum, Reports, School). LAST: it organizes all the others */   /* Library & One-Tap Command Center (Library.js); floating button, own overlay, LAST */
  var i = page.lastIndexOf('</body>'); if (add) page = i < 0 ? page + add : page.slice(0, i) + add + page.slice(i);
  return HtmlService.createHtmlOutput(tlTheme_(page, 'staff'))
    .setTitle('Tashbar Learning · Staff')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

/* ---- who is signed in ---- */
function sgStaffRow_(code) {
  code = String(code || '');
  var sh = msBook_().getSheetByName('MS_Staff'), n = sh ? sh.getLastRow() : 0;
  if (n < 2) return null;
  var rows = sh.getRange(2, 1, n - 1, 6).getValues();
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (!r[0] || r[4] === false || String(r[4]).toUpperCase() === 'FALSE') continue;
    if (msHash_(String(r[2]), code) === String(r[3])) return { id: String(r[0]), name: String(r[1]), role: String(r[5] || '').toLowerCase() };
  }
  return null;
}
function sgStaff_(token) { var s = msSession_(token); if (s.role !== 'staff') throw new Error('Please sign in with a staff code.'); return s; }
function sgIsHead_(s) { return !!(s && s.who && s.who.role === 'head'); }
function sgHead_(token) { var s = sgStaff_(token); if (!sgIsHead_(s)) throw new Error('Only the Head of School can fix points.'); return s; }
function sgWho_(s) { return s && s.who ? s.who : { id: 'staff', name: 'Staff', role: '' }; }
function sgLock_(fn) { var l = LockService.getScriptLock(); l.waitLock(20000); try { PL_CACHE_ = null; return fn(); } finally { PL_CACHE_ = null; l.releaseLock(); } }
function sgToday_() { return Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd'); }

/* ---- grid data ---- */
function sgSubjOf_(id) { var p = String(id).split('.')[0]; return p === 'WRIT' ? 'LANG' : p === 'SS' ? 'SOC' : p; }   /* Social Studies skill IDs are SS.*; the staff/placement column key stays SOC */
function sgEvidence_(only) {
  var sh = msTab_('evidence'), n = sh.getLastRow(), out = {}, today = sgToday_();
  if (n < 2) return out;
  var from = Math.max(2, n - 8000 + 1), v = sh.getRange(from, 1, n - from + 1, 6).getValues();
  v.forEach(function (r) {
    var sid = String(r[1] || ''), sk = String(r[2] || ''); if (!sid || !sk || (only && sid !== only)) return;
    var b = out[sid] = out[sid] || {}, x = b[sk] = b[sk] || { miss: 0, missToday: 0, ok: 0, last: 0 };
    var at = r[0] instanceof Date ? r[0] : new Date(r[0]), day = isNaN(at) ? '' : Utilities.formatDate(at, 'America/New_York', 'yyyy-MM-dd');
    if (Number(r[5]) === 1) x.ok++; else { x.miss++; if (day === today) x.missToday++; }
    if (!isNaN(at)) x.last = Math.max(x.last, at.getTime());
  });
  return out;
}
function sgCtx_() {
  var B = {}; plBuilt_().forEach(function (x) { B[x] = 1; });
  var states = {}; msRows_('state').forEach(function (r) { try { states[String(r[0])] = JSON.parse(r[1]); } catch (e) {} });
  var pf = {}; try { if (typeof pfGridMap_ === 'function') pf = pfGridMap_(); } catch (e) { pf = {}; }   /* PATHFINDER status dot + assessed level */
  return { built: B, place: plPlacements_(), states: states, ev: sgEvidence_(), pf: pf };
}
function sgMastered_(st) { var m = {}; Object.keys((st && st.skills) || {}).forEach(function (k) { if (st.skills[k] && st.skills[k].m) m[k] = 1; }); return m; }
function sgCell_(sid, k, ctx, mast, ev) {
  var p = (ctx.place[sid] || {})[k] || null, lvl = p ? p.level : 0, c = { level: lvl, status: 'gray', dot: false, now: '', next: '', prev: '', skills: [] };
  var mine = Object.keys(ev).filter(function (sk) { return sgSubjOf_(sk) === k; });
  var anyMast = Object.keys(mast).some(function (sk) { return sgSubjOf_(sk) === k; });
  var list = plList_(k);
  if (list && lvl && lvl <= 9) {
    var start = p.start || plFirst_(k, lvl), ids = list.map(function (x) { return x[0]; }), i0 = Math.max(0, ids.indexOf(start));
    var built = ids.filter(function (x) { return ctx.built[x]; });
    var cur = '', i;
    for (i = i0; i < ids.length; i++) if (ctx.built[ids[i]] && !mast[ids[i]]) { cur = ids[i]; break; }
    c.now = cur;
    if (cur) { var bi = built.indexOf(cur); c.next = built[bi + 1] || ''; c.prev = bi > 0 ? built[bi - 1] : ''; }
    else { c.prev = built.filter(function (x) { return ids.indexOf(x) < i0; }).pop() || ''; }
    c.skills = list.filter(function (x) { return plMathLevel_(x[0]) === lvl; }).map(function (x) { return [x[0], ctx.built[x[0]] ? 1 : 0, mast[x[0]] ? 1 : 0]; });
    var e = cur ? ev[cur] : null;
    if (!cur) c.status = anyMast ? 'green' : 'gray';
    else if (e && e.miss >= 4 && !mast[cur]) c.status = 'red';
    else if (e) c.status = 'yellow';
    else if (anyMast || mine.length) c.status = 'yellow';
    c.dot = !!(e && e.missToday >= 3);
    return c;
  }
  if (mine.length || anyMast) {
    c.status = mine.some(function (sk) { return ev[sk].miss >= 4 && !mast[sk]; }) ? 'red' : 'yellow';
    c.dot = mine.some(function (sk) { return ev[sk].missToday >= 3 && !mast[sk]; });
  }
  return c;
}
function sgRow_(r, ctx) {
  var mast = sgMastered_(ctx.states[r.id]), ev = ctx.ev[r.id] || {}, cells = {};
  SG_SUBJ.forEach(function (s) { cells[s[0]] = sgCell_(r.id, s[0], ctx, mast, ev); });
  var st = ctx.states[r.id] || {}, sk = st.skills || {}, m0 = new Date(); m0 = new Date(m0.getFullYear(), m0.getMonth(), 1).getTime(), mm = 0, mt = 0;   /* v72: mastered this month / ever */
  Object.keys(sk).forEach(function (k) { if (sk[k] && sk[k].m) { mt++; if (Number(sk[k].at) >= m0) mm++; } });
  return { id: r.id, name: r.name, test: /^TEST-/.test(r.id), cells: cells, pf: (ctx.pf && ctx.pf[r.id]) || null, mm: mm, mt: mt };
}
function sgNames_() { var o = {}; MATH_K8.concat(READ_K8).forEach(function (x) { o[x[0]] = [x[1], x[2]]; }); try { var k = typeof famKodeshNames_ === 'function' ? famKodeshNames_() : {}; Object.keys(k).forEach(function (id) { if (!o[id]) o[id] = [k[id], 'Limudei Kodesh']; }); } catch (e) {} return o; }   /* v91: + Kodesh names */
function sgLoad(token) {
  try { if (typeof tlPackExportAll_ === 'function') tlPackExportAll_(); } catch (e) {}   /* v103: content-pack export (once per file content) */
  var s = sgStaff_(token), ctx = sgCtx_();
  var rows = msRoster_().map(function (r) { return sgRow_(r, ctx); }).sort(function (a, b) { return (a.test ? 1 : 0) - (b.test ? 1 : 0) || a.name.localeCompare(b.name); });
  return { version: SG.VERSION, cat: sgCatalog_(), subjects: SG_SUBJ, worlds: PL.WORLDS, names: sgNames_(), boys: rows, head: sgIsHead_(s), staffName: sgWho_(s).name, musicOff: (typeof msMusicOff_ === 'function' ? msMusicOff_() : false), idleMin: SG.IDLE_MIN, appUrl: ScriptApp.getService().getUrl() };
}
function sgBoy(token, sid) { tlGuard_(token, sid);
  sgStaff_(token); sid = String(sid || '');
  var r = msRoster_().filter(function (x) { return x.id === sid; })[0]; if (!r) throw new Error('That student is not on the list.');
  return sgRow_(r, sgCtxFor_(sid));   /* v65: only this boy's data (was the whole school on every tap) */
}
/* ===== v65 (takeover builder, 2026-11-11): fast one-boy refresh + curriculum catalog ("what is in each box") ===== */
function sgCtxFor_(sid) {
  var B = {}; plBuilt_().forEach(function (x) { B[x] = 1; });
  var states = {}; msRows_('state').some(function (r) { if (String(r[0]) === sid) { try { states[sid] = JSON.parse(r[1]); } catch (e) {} return true; } return false; });
  var ev = {}; ev[sid] = sgEvidence_(sid)[sid] || {};
  return { built: B, place: plPlacements_(), states: states, ev: ev, pf: {} };   /* pf left out: the page keeps the Pathfinder dot it already has */
}
var SG_STRAND = {
  MATH: { NUM: 'Numbers', PV: 'Place value', OPS: 'Operations', FRAC: 'Fractions', MEAS: 'Measuring', GEO: 'Shapes and space', STAT: 'Data', ALG: 'Algebra', FUNC: 'Functions' },
  READ: { PA: 'Hearing sounds', PHON: 'Phonics', LV: 'Reading words', FLU: 'Smooth reading', VOC: 'Word meaning', COMP: 'Understanding', LIT: 'Stories' },
  LANG: { HAND: 'Handwriting', SENT: 'Sentences', PARA: 'Paragraphs', ESSAY: 'Essays', RES: 'Research', GRAM: 'Grammar', MECH: 'Capitals and punctuation', USE: 'Using words' },
  SCI: { SKY: 'The Heavens', PHYS: 'Physics', EARTH: 'The Earth', LAND: 'The Earth', ANIM: 'Animals', LIFE: 'Living things', PLANT: 'Plants', BODY: 'The Human Body', INQ: 'Science skills', MATT: 'Matter and Energy' },
  COMP: { DIG: 'Using the computer', PROG: 'Coding', TYPE: 'Typing' },
  LIFE: { FIN: 'Money', BUD: 'Budgeting', STUDY: 'Study habits' },
  SOC: { COMM: 'Community', GEO: 'Maps and places', HIST: 'History', JHIST: 'Jewish history', CIV: 'Citizenship', ECON: 'Economics' },
  ELEC: { NUC: 'Nuclear Science', LOGIC: 'Logic', SPEAK: 'Speaking', ART: 'Art', MUS: 'Music', PHOTO: 'Photography', PIANO: 'Piano', SEW: 'Sewing', FIX: 'Fix-It', KNOT: 'Knots', BEAT: 'Music Maker', WOOD: 'Woodshop', KITCH: 'Kitchen' }
};
var SG_CURR = { MATH: 'Tashbar Math K-8 · Number Road', READ: 'Tashbar Reading K-8 · Story Road', LANG: 'Writing and Language Arts K-8', SCI: 'Niflaos HaBorei Science K-8', SOC: 'Social Studies · Explorer Trail', COMP: 'Computing · Computer Town', HEB: 'Limudei Kodesh · Lashon Hakodesh L1-9 (a track of the Limudei Kodesh panel)', ELEC: 'Electives · Journey Into the Atom · Thinking & Arts', VOC: 'Trades · Spark Path (Electricity)', LIFE: 'Life & Money · Main Street' };
function sgCatalog_() {
  var built = {}; plBuilt_().forEach(function (x) { built[x] = 1; });
  var list = {};
  ['MATH', 'READ', 'LANG', 'SCI'].forEach(function (k) { list[k] = (plList_(k) || []).map(function (x) { return [x[0], x[1], x[2] || '', built[x[0]] ? 1 : 0]; }); });
  var c = CacheService.getScriptCache(), x = null, hit = c.get('sg_xcat_v6');
  if (hit) { try { x = JSON.parse(hit); } catch (e) { x = null; } }
  if (!x) {
    x = {}; var seen = {}, m, txt = plFileText_('ComputingMore') + plFileText_('ElectivesMore') + plFileText_('LifeMore') + plFileText_('SocialMore'),
      re = /['"]((?:COMP|ELEC|LIFE|SS)\.[A-Z]+\.L\d\d\.\d\d)['"]\s*\]?\s*[:=]\s*\{\s*["']?name["']?\s*:\s*(['"])((?:\\.|(?!\2)[^\\])*)\2/g;
    while ((m = re.exec(txt))) { if (seen[m[1]]) continue; seen[m[1]] = 1; var k = m[1].split('.')[0]; if (k === 'SS') k = 'SOC'; (x[k] = x[k] || []).push([m[1], m[3].replace(/\\(.)/g, '$1'), '', 1]); }
    try { c.put('sg_xcat_v6', JSON.stringify(x), 600); } catch (e) {}
  }
  Object.keys(x).forEach(function (k) { list[k] = x[k]; });
  return { list: list, strands: SG_STRAND, curr: SG_CURR };
}

/* ---- change his work (one tap) ---- */
function sgGive(token, sid, subject, skill) { tlGuard_(token, sid);
  var s = sgStaff_(token); sid = String(sid || ''); subject = String(subject || ''); skill = String(skill || '');
  var list = plList_(subject); if (!list || !list.some(function (x) { return x[0] === skill; })) throw new Error('That skill is not in this subject.');
  if (!msRoster_().some(function (x) { return x.id === sid; })) throw new Error('That student is not on the list.');
  sgLock_(function () { plUpsert_(sid, subject, plMathLevel_(skill), skill, 'staff'); });
  return sgBoy(token, sid);
}
function sgLevel(token, sid, subject, level) { tlGuard_(token, sid);
  sgStaff_(token); plPlace(token, [String(sid || '')], String(subject || ''), Number(level) || 0, '');
  return sgBoy(token, sid);
}

/* ---- add / remove a boy ---- */
function sgCodeTaken_(code) {
  var sh = msBook_().getSheetByName('MS_Staff'), n = sh ? sh.getLastRow() : 0;
  if (n > 1 && sh.getRange(2, 1, n - 1, 4).getValues().some(function (r) { return r[0] && msHash_(String(r[2]), code) === String(r[3]); })) return true;
  if (msStaffMatch_(code)) return true;
  if (typeof acParentRows_ === 'function' && acParentRows_().some(function (p) { return p.salt && msHash_(p.salt, code) === p.hash; })) return true;   /* Access.js: parent codes too */
  return msRows_('roster').some(function (r) { return r[0] && r[5] && msHash_(r[5], code) === r[6]; });
}
function sgAddStudent(token, name, grade, code, onRoster) {
  var s = sgStaff_(token), who = sgWho_(s);
  name = String(name || '').replace(/\s+/g, ' ').trim().slice(0, 60); code = String(code || '').replace(/\D/g, '');
  var g = String(grade || '').toUpperCase(), gn = g === 'K' ? 0 : Number(g);
  if (onRoster !== true) throw new Error('Tick the box to confirm this is a real Tashbar student.');
  if (name.length < 3 || name.indexOf(' ') < 0) throw new Error('Type the student’s first and last name.');
  if (!(gn >= 0 && gn <= 8 && Math.round(gn) === gn)) throw new Error('Pick the grade, K to 8.');
  if (!/^\d{4}$/.test(code)) throw new Error('The sign-in code must be 4 digits.');
  if (!sgCodeOk_(code)) throw new Error('That code is too easy to guess. Pick a different one, or tap \u201cMake one for me\u201d.');
  return sgLock_(function () {
    var rows = msRows_('roster');
    if (rows.some(function (r) { return r[7] !== false && String(r[1]).toLowerCase() === name.toLowerCase(); })) throw new Error(name + ' is already on the list.');
    if (sgCodeTaken_(code)) throw new Error('That code is already used. Pick a different 4-digit code.');
    var max = 0; rows.forEach(function (r) { var m = /^T(\d+)$/.exec(String(r[0])); if (m) max = Math.max(max, Number(m[1])); });
    var id = 'T' + ('00' + (max + 1)).slice(-3), band = plBand_(gn + 1), salt = Utilities.getUuid();
    msTab_('roster').appendRow([id, name, band, band, band, salt, msHash_(salt, code), true, 'grade ' + (gn === 0 ? 'K' : gn) + ' \u00b7 added ' + sgToday_() + ' by ' + who.name]);
    if (typeof tlAssignNewStudent_ === 'function') tlAssignNewStudent_(id);   /* Access.js: he joins the adding staff member's school */
    return { id: id, name: name };
  });
}
/* ---- sign-in codes: make a free one; change a boy's code (v47). Codes are stored only as salt + hash, so an old code cannot be shown, only replaced. ---- */
function sgCodeOk_(code) {
  if (!/^\d{4}$/.test(code) || code === '7300') return false;
  if (/^(\d)\1{3}$/.test(code) || '0123456789'.indexOf(code) >= 0 || '9876543210'.indexOf(code) >= 0) return false;
  return true;
}
function sgFreeCode(token) {
  sgStaff_(token);
  for (var k = 0; k < 400; k++) { var c = ('000' + Math.floor(Math.random() * 10000)).slice(-4); if (sgCodeOk_(c) && !sgCodeTaken_(c)) return { code: c }; }
  throw new Error('Could not find a free code. Try again.');
}
function sgSetCode(token, sid, code) { tlGuard_(token, sid);
  var s = sgStaff_(token), who = sgWho_(s); sid = String(sid || ''); code = String(code || '').replace(/\D/g, '');
  if (!/^\d{4}$/.test(code)) throw new Error('The sign-in code must be 4 digits.');
  if (!sgCodeOk_(code)) throw new Error('That code is too easy to guess. Pick a different one, or tap \u201cMake one for me\u201d.');
  return sgLock_(function () {
    var sh = msTab_('roster'), rows = msRows_('roster');
    for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === sid && rows[i][7] !== false) {
      var r = rows[i];
      if (r[5] && msHash_(String(r[5]), code) === String(r[6])) return { ok: true, name: String(r[1]), same: true };
      if (sgCodeTaken_(code)) throw new Error('That code is already used. Pick a different 4-digit code.');
      var salt = Utilities.getUuid();
      sh.getRange(i + 2, 6, 1, 2).setValues([[salt, msHash_(salt, code)]]);
      sh.getRange(i + 2, 9).setValue(String(r[8] || '') + ' \u00b7 code changed ' + sgToday_() + ' by ' + who.name);
      return { ok: true, name: String(r[1]) };
    }
    throw new Error('That student is not on the list.');
  });
}
function sgArchive(token, sid) { tlGuard_(token, sid);
  var s = sgStaff_(token), who = sgWho_(s); sid = String(sid || '');
  if (/^TEST-/.test(sid)) throw new Error('The test student stays on the list for testing.');
  return sgLock_(function () {
    var sh = msTab_('roster'), rows = msRows_('roster');
    for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === sid) {
      sh.getRange(i + 2, 8, 1, 2).setValues([[false, String(rows[i][8] || '') + ' \u00b7 removed ' + sgToday_() + ' by ' + who.name]]);
      return { ok: true };
    }
    throw new Error('That student is not on the list.');
  });
}

/* ---- Fix points: Head of School only. Each fix is its own ledger row (type correction) plus a row in SG_PointFixes. ---- */
function sgFixTab_() {
  var ss = msBook_(), sh = ss.getSheetByName(SG.FIX_TAB);
  if (!sh) { sh = ss.insertSheet(SG.FIX_TAB); sh.getRange(1, 1, 1, SG.FIX_HEAD.length).setValues([SG.FIX_HEAD]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function sgFixRows_(sid) {
  var sh = sgFixTab_(), n = sh.getLastRow(); if (n < 2) return [];
  var v = sh.getRange(2, 1, n - 1, SG.FIX_HEAD.length).getValues(), undone = {};
  v.forEach(function (r) { if (r[7]) undone[String(r[7])] = 1; });
  return v.filter(function (r) { return String(r[3]) === sid; }).map(function (r) {
    return { at: r[0] instanceof Date ? r[0].getTime() : 0, by: String(r[2]), cents: Number(r[4]) || 0, reason: String(r[5]), txn: String(r[6]), undoOf: String(r[7] || ''), undone: !!undone[String(r[6])] };
  }).reverse().slice(0, 12);
}
function sgMoney(token, sid) { tlGuard_(token, sid); sgHead_(token); sid = String(sid || ''); return { balanceCents: moneyBalance_(sid), fixes: sgFixRows_(sid) }; }
function sgFixPoints(token, sid, cents, reason) { tlGuard_(token, sid);
  var s = sgHead_(token), who = sgWho_(s); sid = String(sid || ''); cents = Number(cents); reason = String(reason || '').trim().slice(0, 160);
  if (!Number.isInteger(cents) || cents === 0 || Math.abs(cents) > 100000) throw new Error('Type an amount from $0.01 to $1,000.00.');
  if (reason.length < 3) throw new Error('Write a short reason. Every fix needs one.');
  if (!msRoster_().some(function (x) { return x.id === sid; })) throw new Error('That student is not on the list.');
  return sgLock_(function () {
    if (moneyBalance_(sid) + cents < 0) throw new Error('That would take the balance below $0.00.');
    var row = moneyPost_({ sid: sid, type: 'correction', cents: cents, reason: 'Fix by Head of School: ' + reason, by: who.name, key: 'sgfix:' + Utilities.getUuid() });
    sgFixTab_().appendRow([new Date(), who.id, who.name, sid, cents, reason, row ? row.id : '', '']);
    return { balanceCents: moneyBalance_(sid), fixes: sgFixRows_(sid) };
  });
}
function sgUndoFix(token, sid, txn) { tlGuard_(token, sid);
  var s = sgHead_(token), who = sgWho_(s); sid = String(sid || ''); txn = String(txn || '');
  return sgLock_(function () {
    var f = sgFixRows_(sid).filter(function (x) { return x.txn === txn && !x.undoOf; })[0];
    if (!f) throw new Error('That fix was not found.');
    if (f.undone) throw new Error('That fix was already undone.');
    if (moneyBalance_(sid) - f.cents < 0) throw new Error('Undoing it would take the balance below $0.00.');
    var row = moneyPost_({ sid: sid, type: 'correction', cents: -f.cents, reason: 'Undo of an earlier fix: ' + f.reason, by: who.name, key: 'sgundo:' + txn });
    sgFixTab_().appendRow([new Date(), who.id, who.name, sid, -f.cents, 'Undo: ' + f.reason, row ? row.id : '', txn]);
    return { balanceCents: moneyBalance_(sid), fixes: sgFixRows_(sid) };
  });
}

/* Run from the editor to check the wiring (read-only except it creates SG_PointFixes if missing). */
function sgSelfTest() {
  var ctx = sgCtx_(), boys = msRoster_(), rows = boys.map(function (r) { return sgRow_(r, ctx); }), count = { gray: 0, yellow: 0, green: 0, red: 0 }, dots = 0;
  rows.forEach(function (b) { Object.keys(b.cells).forEach(function (k) { count[b.cells[k].status]++; if (b.cells[k].dot) dots++; }); });
  Logger.log(JSON.stringify({ version: SG.VERSION, boys: rows.length, squares: count, stuckToday: dots, fixTab: sgFixTab_().getName(), routes: { plain: !!sgRoute_({ parameter: {} }), oldStaff: !!sgRoute_({ parameter: { ms: '1', staff: '1' } }), staff: !!sgRoute_({ parameter: { sg: '1' } }), check: sgRoute_({ parameter: { pl: '1', check: '1' } }) === null, canteen: sgRoute_({ parameter: { canteen: '1' } }) === null, oldPage: sgRoute_({ parameter: { ms: '1', staff: '1', old: '1' } }) === null } }));
}

/* v90 (takeover builder): Limudei Kodesh staff page — how many Kodesh lessons are built per ladder and level.
   Reads the LK skill IDs in KodeshMore.html, so new batches show up by themselves. Curriculum only, no student data. */
function sgKodeshBuilt() {
  var ROW = { KRI: 'kri', CHU: 'chu', RAS: 'rsh', MSH: 'mis', GEM: 'gem', KES: 'kes', LSH: 'lhk', PAR: 'par', NAV: 'nav', MFG: 'mfg', TEF: 'tef', HAL: 'hal', YT: 'yt', MID: 'mid', TOL: 'his' };
  var t = ''; try { t = tlFileText_('KodeshMore'); } catch (e) { return {}; }
  var re = /['"](LK\.([A-Z]+)\.L(\d\d)\.\d\d(?:\.[a-z])?)['"]\s*:\s*\{/g, m, seen = {}, out = {};
  while ((m = re.exec(t))) { if (seen[m[1]]) continue; seen[m[1]] = 1; var r = ROW[m[2]]; if (!r) continue; var k = r + ':' + Number(m[3]); out[k] = (out[k] || 0) + 1; }
  /* Lashon Hakodesh L1-9 = the HEB ladder (DECISION 2026-11-12 0135 #9): HEB lessons in KodeshMore count on row lhk, with their names.
     While window.LK_HEB_LIVE is not true in KodeshMore, they are marked _test (TEST- boys only until a rebbe approves). */
  var hre = /['"](HEB\.[A-Z]+\.L(\d\d)\.\d\d)['"]\s*:\s*\{\s*["']?name["']?\s*:\s*(['"])((?:\\.|(?!\3)[^\\])*)\3/g, live = /window\.LK_HEB_LIVE\s*=\s*true/.test(t);
  while ((m = hre.exec(t))) {
    if (seen[m[1]] || Number(m[2]) < 1 || Number(m[2]) > 9) continue; seen[m[1]] = 1;
    var hk = 'lhk:' + Number(m[2]); out[hk] = (out[hk] || 0) + 1;
    out._names = out._names || {}; (out._names[hk] = out._names[hk] || []).push([m[1], m[4].replace(/\\(.)/g, '$1')]);
    if (!live) { out._test = out._test || {}; out._test[hk] = 1; }
  }
  return out;
}

/* v99 (takeover builder 2): Limudei Kodesh staff page (07 KODESH BUILD PROMPT Parts 2–3, in the live staff screen).
   Per boy and per track: lessons mastered, total built, and the next lesson (teaching order = order in KodeshMore.html).
   Kodesh never enters the General Studies grid or totals. TEST boys are left out. */
function sgKodesh(token) {
  sgStaff_(token);
  var t = ''; try { t = tlFileText_('KodeshMore'); } catch (e) {}
  var re = /['"](LK\.([A-Z]+)\.L(\d\d)\.\d\d(?:\.[a-z])?)['"]\s*:\s*\{\s*name\s*:\s*(['"])((?:\\.|(?!\4)[^\\])*)\4/g, m, seen = {}, order = {}, names = {};
  while ((m = re.exec(t))) { if (seen[m[1]]) continue; seen[m[1]] = 1; (order[m[2]] = order[m[2]] || []).push(m[1]); names[m[1]] = m[5]; }
  var states = {}; msRows_('state').forEach(function (r) { try { states[String(r[0])] = JSON.parse(r[1]); } catch (e) {} });
  var TR = ['KRI', 'CHU', 'RAS', 'MSH', 'GEM'];
  var boys = msRoster_().filter(function (r) { return !/^TEST-/.test(r.id); }).map(function (r) {
    var sk = (states[r.id] || {}).skills || {}, tr = {};
    TR.forEach(function (k) { var ids = order[k] || [], done = ids.filter(function (id) { return sk[id] && sk[id].m; }).length, nx = ids.filter(function (id) { return !(sk[id] && sk[id].m); })[0];
      tr[k] = { done: done, total: ids.length, next: nx ? names[nx] : '' }; });
    return { id: r.id, name: r.name, tr: tr };
  }).sort(function (a, b) { return a.name.localeCompare(b.name); });
  return { tracks: TR, built: sgKodeshBuilt(), boys: boys };
}
