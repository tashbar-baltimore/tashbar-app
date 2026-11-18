/* DeptTodo.js — DEPARTMENTS Phase 2: the TO-DO board (Head of School 2026-11-18: "help beef up the departments for individuals to focus on
   one area only and have access to see everything that needs doing in their department"). rabbikhaver-cloud-builder-1.
   One call, dpTodo(token, deptId), gathers EVERYTHING waiting in one department, using only data the app already keeps:
   1. now:    boys who need a teacher right now on this department's lessons (sgNow: stuck, check failed, guessing; today, real boys).
   2. slip:   boys whose mastered skills here are slipping in spaced review (StaffReview.js srvSum_).
   3. reteach: questions here that boys keep missing (sgStuckSpots, last 14 days, no boy names).
   4. reports: open "Report a problem" items on this department's lessons (Reports.js); a member can mark one fixed (sgReportDone).
   5. fixes:  known content errors from HQ "09 CURRICULUM COLD READ 2026-11-18" (DT_FIXES below), until a builder marks them done.
   6. tasks:  the department's own task list (tab MS_DeptTasks): anyone in the department adds a task, picks who does it and a date, ticks it done.
   Same access as Departments.js: the Head of School sees every department; a head or member sees only his own. Every call checks it here.
   READ ONLY except the task list and marking a problem report fixed. No money, mastery, lesson or student-record changes.
   Calls (API_ALLOW): dpTodo, dpTask. */
var DT = { TAB: 'MS_DeptTasks', HEAD: ['task_id', 'dept', 'text', 'owner_id', 'due', 'status', 'by', 'at', 'done_by', 'done_at'] };
/* Known content errors (HQ 09 CURRICULUM COLD READ 2026-11-18, the VERIFIED and confirmed items). dept = Departments.js id; skill optional. */
var DT_FIXES = [
  { dept: 'LK', skill: 'LK.TRY.A009', text: 'Kiddush Hashem is Rambam positive mitzvah #9, not #5 (card, typed answer, hint, why).' },
  { dept: 'LK', skill: '', text: 'Parsha names (ChumashPage): פְּקוּדֵי and תַּזְרִיעַ need a dagesh; no dagesh in the first letter of שְׁמִינִי, מְצֹרָע, מַטּוֹת; נָשֹׂא needs its cholam.' },
  { dept: 'LK', skill: 'LK.YT.L04.01', text: 'Kitzur Chanukah texts (YT.L04.01-03): about 13 missing shin/sin dots; יִשְׂרָאֵל.' },
  { dept: 'LK', skill: '', text: 'The Name is written ה\' about 260 times; it should be ה׳ (KodeshMore, KriyahMore).' },
  { dept: 'LK', skill: '', text: 'Chemdas: L04.42 key must be the 8 begadim; L04.32 double "one Hashem" option; 66 "How many are in the list of Seven…" items give the number; 34 skills point to a booklet page that is not shown.' },
  { dept: 'LK', skill: '', text: 'Half Hallel (TEF.L03.02): add Chol Hamoed Pesach; the "My creations are drowning" reason is for Pesach only.' },
  { dept: 'LK', skill: '', text: 'Pasted-in duplicate sentences: HAL.L03.02 (tefillin), HAL.L03.04 (eruv), YT.L03.04 (Arba Minim).' },
  { dept: 'LK', skill: '', text: 'Grades 3-4 are missing in Tefillah, Halacha, Middos, Navi and Parsha.' },
  { dept: 'MATH', skill: '', text: 'After a missed check the "Answer:" shown is wrong in 17 skills (fracOrNum: 2/6+2/6 shows 10667/16000, 7/8 shows 0.88).' },
  { dept: 'MATH', skill: '', text: '"Lowest terms" items accept unsimplified answers; old-ID mapping credits Slope to Systems and inches/cm to Money; "0 − 14" hint says both numbers are negative.' },
  { dept: 'MATH', skill: '', text: 'Gaps: thirds (gr 2), fraction × whole number (gr 4), number lines and line plots (gr 2), exponents (gr 6), functions from graphs (gr 8). No Common Core codes on any skill.' },
  { dept: 'SCI', skill: 'SCI.MATT.L04.01', text: 'Moon "weight" given in kg (mass does not change); also SCI.SKY.L05.03 and about 8 items.' },
  { dept: 'SCI', skill: 'SCI.SKY.L04.02', text: 'Seasons taught with no Earth tilt. Also: clouds called a gas (SCI.MATT.L06.01), sun overhead at noon (SCI.SKY.L03.02), brightness as distance (SCI.SKY.L02.02), chrysalis called a cocoon (SCI.ANIM.L04.01).' },
  { dept: 'SCI', skill: '', text: '10 questions give the answer in the question; °C/°F and km/miles mixed without teaching.' },
  { dept: 'RW', skill: 'READ.LV.L03.01', text: 'Vowel-team game items swapped between READ.LV.L03.01 and L03.02.' },
  { dept: 'RW', skill: '', text: 'Snap words: "I ___ a boy" must also accept "see"; "Where ___ you going?" must also accept "were".' },
  { dept: 'RW', skill: 'READ.PHON.L02.01', text: '"wh" is taught but never practiced or checked.' },
  { dept: 'RW', skill: 'READ.COMP.L01.02', text: 'A kindergarten listening item reads the story order (the answer) aloud.' },
  { dept: 'SOC', skill: 'LIFE.FIN.L05.02', text: 'Ribbis: must say a Jew may not lend to OR borrow from another Jew with interest; add practice and check items. Jewish-named interest word problems need a note.' },
  { dept: 'SOC', skill: 'SS.HIST.L09.02', text: 'Active lessons depend on the held Holocaust lessons (SS.HIST.L09.02, SS.JHIST.L12.01). Right answer too often the longest choice in Social Studies.' },
  { dept: 'ELEC', skill: '', text: 'Woodshop and Kitchen lessons have no home row (ElectivesMore strand list); Fix-It files under Fact Finders (BoyLibrary pattern).' },
  { dept: 'ELEC', skill: '', text: 'Typing is "mastered" by multiple choice; 14 Python stems wrongly capitalized ("Def", "Sorted"); trades "1×10" board is 9¼ in wide.' },
  { dept: 'ELEC', skill: '', text: 'For the Head of School: girls\' names in Computing word problems; "Hot Cross Buns" in Piano; music has no Sefira / Three Weeks cut-off.' }
];
function dtTab_() {
  var b = msBook_(), sh = b.getSheetByName(DT.TAB);
  if (!sh) { sh = b.insertSheet(DT.TAB); sh.getRange(1, 1, 1, DT.HEAD.length).setValues([DT.HEAD]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function dtTasks_() {
  var sh = dtTab_(), n = sh.getLastRow(); if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, DT.HEAD.length).getValues().map(function (r, i) {
    var d = function (v) { return v instanceof Date ? Utilities.formatDate(v, 'America/New_York', 'yyyy-MM-dd') : String(v || ''); };
    return { row: i + 2, id: String(r[0]), dept: String(r[1]), text: String(r[2]), owner: String(r[3] || ''), due: d(r[4]), status: String(r[5] || 'open'), by: String(r[6] || ''), at: d(r[7]), doneBy: String(r[8] || ''), doneAt: d(r[9]) };
  }).filter(function (t) { return t.id; });
}
function dtGate_(token, deptId) {
  var who = dpWho_(token), cfg = dpCfg_(); deptId = String(deptId || '');
  var d = cfg.depts.filter(function (x) { return x.id === deptId; })[0]; if (!d) throw new Error('No such department.');
  var role = dpRole_(cfg, who, deptId); if (!role) throw new Error('You are not in this department.');
  return { who: who, cfg: cfg, d: d, role: role };
}
function dpTodo(token, deptId) {
  var g = dtGate_(token, deptId), d = g.d, cfg = g.cfg, cat = dpCatalog_(), inD = {};
  Object.keys(cat).forEach(function (id) { if (dpIn_(d, id, cfg.moves)) inD[id] = 1; });
  var here = function (skill) { return !!inD[String(skill || '')] || dpIn_(d, String(skill || ''), cfg.moves); };
  var nm = function (id) { return cat[id] || id; }, out = { dept: { id: d.id, name: d.name, icon: d.icon }, role: g.role };
  try { out.now = (sgNow(token).list || []).filter(function (x) { return here(x.skill); }).map(function (x) { return { sid: x.sid, name: x.name, kind: x.kind, skill: x.skill, skillName: nm(x.skill), n: x.n, at: x.at }; }); } catch (e) { out.now = []; out.nowErr = String(e.message || e); }
  try {
    var t = srvDay_(), names = {}; msRoster_().forEach(function (r) { if (!/^TEST-/.test(r.id)) names[r.id] = r.name; });
    var slip = {};
    msRows_('state').forEach(function (r) { var sid = String(r[0] || ''); if (!names[sid]) return; var st = {}; try { st = JSON.parse(r[1]) || {}; } catch (e) { return; }
      (srvSum_(st, t).slip || []).forEach(function (id) { if (!here(id)) return; (slip[id] = slip[id] || []).push(names[sid]); }); });
    out.slip = Object.keys(slip).map(function (id) { return { skill: id, skillName: nm(id), boys: slip[id].slice(0, 12), n: slip[id].length }; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 30);
  } catch (e) { out.slip = []; }
  try { out.reteach = (sgStuckSpots(token).rows || []).filter(function (x) { return here(x.skill); }); } catch (e) { out.reteach = []; }
  try { out.reports = (sgReports(token).reports || []).filter(function (x) { return here(x.skill); }).map(function (x) { return { skill: x.skill, skillName: nm(x.skill), item: String(x.item).slice(0, 160), n: x.n, reasons: x.reasons, notes: (x.notes || []).slice(0, 3), last: x.last }; }); } catch (e) { out.reports = []; }
  var tasks = dtTasks_().filter(function (x) { return x.dept === d.id && x.status !== 'removed'; });
  var done = {}; tasks.forEach(function (x) { if (/^fix:/.test(x.id) && x.status === 'done') done[x.id] = x; });
  out.fixes = DT_FIXES.map(function (f, i) { return { key: 'fix:' + i, text: f.text, skill: f.skill, dept: f.dept }; })
    .filter(function (f) { return f.dept === d.id || (f.skill && dpIn_(d, f.skill, cfg.moves)); })
    .map(function (f) { var x = done[f.key + ':' + d.id]; return { key: f.key, text: f.text, skill: f.skill, skillName: f.skill ? nm(f.skill) : '', done: !!x, doneBy: x ? dpStaffName_(x.doneBy) : '', doneAt: x ? x.doneAt : '' }; });
  var mem = cfg.members[d.id] || {};
  out.people = Object.keys(mem).map(function (k) { return { id: k, name: dpStaffName_(k), role: mem[k] }; });
  out.tasks = tasks.filter(function (x) { return !/^fix:/.test(x.id); }).map(function (x) { return { id: x.id, text: x.text, owner: x.owner, ownerName: x.owner ? dpStaffName_(x.owner) : '', due: x.due, status: x.status, by: dpStaffName_(x.by), at: x.at, doneBy: x.doneBy ? dpStaffName_(x.doneBy) : '', doneAt: x.doneAt }; })
    .sort(function (a, b) { return (a.status === 'done') - (b.status === 'done') || (a.due || '9999') .localeCompare(b.due || '9999'); });
  out.me = g.who.id; out.today = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd');
  return out;
}
/* what: 'add' {text, owner, due} | 'done' {id} | 'reopen' {id} | 'remove' {id} | 'fixdone' {key} | 'fixopen' {key} | 'report' {skill, item} */
function dpTask(token, deptId, what, a) {
  var g = dtGate_(token, deptId); a = a || {};
  var clip = function (s, n) { return String(s == null ? '' : s).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n); };
  if (what === 'report') { sgReportDone(token, clip(a.skill, 40), String(a.item || '')); return dpTodo(token, deptId); }
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = dtTab_(), all = dtTasks_(), now = new Date(), me = g.who.id;
    if (what === 'add') {
      var text = clip(a.text, 300); if (text.length < 3) throw new Error('Write the task.');
      var owner = clip(a.owner, 40); if (owner && !(g.cfg.members[g.d.id] || {})[owner] && !dpStaff_().some(function (s) { return s.id === owner; })) throw new Error('Unknown staff member.');
      var due = clip(a.due, 10); if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) throw new Error('Bad date.');
      sh.appendRow(['T' + now.getTime().toString(36) + Math.floor(Math.random() * 1e4), g.d.id, text, owner, due, 'open', me, now, '', '']);
    } else if (what === 'fixdone' || what === 'fixopen') {
      var key = clip(a.key, 20); if (!/^fix:\d+$/.test(key)) throw new Error('Bad item.');
      var id = key + ':' + g.d.id, cur = all.filter(function (x) { return x.id === id; })[0];
      if (!cur) sh.appendRow([id, g.d.id, 'Known content error fixed', '', '', what === 'fixdone' ? 'done' : 'open', me, now, what === 'fixdone' ? me : '', what === 'fixdone' ? now : '']);
      else sh.getRange(cur.row, 6, 1, 5).setValues([[what === 'fixdone' ? 'done' : 'open', cur.by, cur.at, what === 'fixdone' ? me : '', what === 'fixdone' ? now : '']]);
    } else {
      var t = all.filter(function (x) { return x.id === String(a.id || '') && x.dept === g.d.id; })[0]; if (!t) throw new Error('Task not found.');
      if (what === 'done') sh.getRange(t.row, 6).setValue('done'), sh.getRange(t.row, 9, 1, 2).setValues([[me, now]]);
      else if (what === 'reopen') sh.getRange(t.row, 6).setValue('open'), sh.getRange(t.row, 9, 1, 2).setValues([['', '']]);
      else if (what === 'remove') { if (!(g.role === 'hos' || g.role === 'head' || t.by === me)) throw new Error('Only the person who wrote it or the department head can remove it.'); sh.getRange(t.row, 6).setValue('removed'); }
      else throw new Error('Unknown change.');
    }
  } finally { lock.releaseLock(); }
  return dpTodo(token, deptId);
}
