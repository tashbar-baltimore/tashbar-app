/* ClassesBucket.js — "Your Classes & Bucket" (asked for 2026-11-27).
   "From 1:20 to 3:30, Monday to Thursday, the Chromebooks replace the afternoon: two Teacher Time classes, then Independent Study.
    During each class a boy can open only what his teacher assigned for that class. Teachers can change all of it easily."
   THE DEFAULT AFTERNOON (school time, America/New_York, Monday to Thursday only; every other day and hour the app is as before):
     Teacher Time 1   1:20 - 1:55   only what his Teacher Time 1 teacher assigned for today
     Teacher Time 2   1:55 - 2:30   only what his Teacher Time 2 teacher assigned for today
     Independent Study 2:30 - 3:30  his bucket list (next step; until he has one, the app is as usual)
   WHO: only a boy in a class that has a period (Teacher Time 1 or 2), grade 2 and up. K-1 and every other boy: unchanged.
   NOTHING ASSIGNED for a Teacher Time period: that period is Independent Study.
   HOW THE LOCK WORKS: the boy page already asks tmMine (TeacherMode.js) every 25 seconds and at sign-in; ClassMode.html locks his
   screen to the lessons in the answer. tmMine asks ycMine_ first. The newest of (a teacher's live class, a Free Play / Independent
   Study override) wins; with neither, the schedule decides.
   SWITCH: settings.live 'off' = nobody, 'test' = TEST- boys only (the default until the HoS says), 'on' = every boy in a class.
   STORAGE: settings in Script Properties (YC.KEY); classes' periods, assignments and overrides in the MS_YC tab (one row per kind+key).
   Nothing here pays or changes money, mastery or placement. */
var YC = { KEY: 'yc_settings_v1', TAB: 'MS_YC', H: ['id', 'kind', 'key', 'json', 'updated', 'by', 'active'], AHEAD: 14, OMIN: 5, OMAX: 180,
  PERIODS: ['T1', 'T2', 'IS'],
  DEF: { live: 'test', days: [1, 2, 3, 4],
    periods: { T1: { name: 'Teacher Time 1', from: '13:20', to: '13:55' }, T2: { name: 'Teacher Time 2', from: '13:55', to: '14:30' }, IS: { name: 'Independent Study', from: '14:30', to: '15:30' } } } };

function ycNow_() { return Date.now(); }   /* tests replace this to walk through an afternoon */
function ycMin_(hhmm) { var m = /^(\d{1,2}):(\d\d)$/.exec(String(hhmm || '')); return m ? Number(m[1]) * 60 + Number(m[2]) : -1; }
function ycHHMM_(min) { return ('0' + Math.floor(min / 60)).slice(-2) + ':' + ('0' + (min % 60)).slice(-2); }
function ycShow_(hhmm) { var m = ycMin_(hhmm), h = Math.floor(m / 60), h12 = ((h + 11) % 12) + 1; return h12 + ':' + ('0' + (m % 60)).slice(-2); }
function ycClock_(now) {
  var d = new Date(now), f = Utilities.formatDate(d, 'America/New_York', 'yyyy-MM-dd u HH mm').split(' ');
  return { date: f[0], dow: Number(f[1]), min: Number(f[2]) * 60 + Number(f[3]), day0: now - (Number(f[2]) * 60 + Number(f[3])) * 60000 - d.getSeconds() * 1000 - d.getMilliseconds() };
}
function ycDateOk_(s) { return /^\d{4}-\d\d-\d\d$/.test(String(s || '')); }

/* ---------- settings ---------- */
function ycSettings_() {
  var raw = null; try { raw = JSON.parse(PropertiesService.getScriptProperties().getProperty(YC.KEY) || 'null'); } catch (e) { raw = null; }
  var s = JSON.parse(JSON.stringify(YC.DEF));
  if (raw && typeof raw === 'object') {
    if (/^(off|test|on)$/.test(raw.live)) s.live = raw.live;
    if (Array.isArray(raw.days) && raw.days.length) s.days = raw.days.map(Number).filter(function (d) { return d >= 1 && d <= 7; });
    YC.PERIODS.forEach(function (k) { var p = raw.periods && raw.periods[k]; if (p && ycMin_(p.from) >= 0 && ycMin_(p.to) > ycMin_(p.from)) { s.periods[k].from = p.from; s.periods[k].to = p.to; } });
  }
  return s;
}
function ycHead_(token) { var s = sgStaff_(token), w = sgWho_(s); if (!w || w.role !== 'head') throw new Error('Only the Head of School can change the afternoon schedule.'); return w; }
function ycSaveSettings(token, x) {
  ycHead_(token); x = x || {};
  var s = ycSettings_();
  if (x.live != null) { if (!/^(off|test|on)$/.test(String(x.live))) throw new Error('Pick off, test or on.'); s.live = String(x.live); }
  if (x.periods) YC.PERIODS.forEach(function (k) { var p = x.periods[k]; if (!p) return;
    if (!(ycMin_(p.from) >= 0 && ycMin_(p.to) > ycMin_(p.from))) throw new Error(s.periods[k].name + ': the end must be after the start.');
    s.periods[k].from = ycHHMM_(ycMin_(p.from)); s.periods[k].to = ycHHMM_(ycMin_(p.to)); });
  return sgLock_(function () { PropertiesService.getScriptProperties().setProperty(YC.KEY, JSON.stringify({ live: s.live, days: s.days, periods: s.periods })); return ycSettings_(); });
}

/* ---------- the MS_YC tab ---------- */
function ycTab_() {
  var ss = msBook_(), sh = ss.getSheetByName(YC.TAB);
  if (!sh) { sh = ss.insertSheet(YC.TAB); sh.getRange(1, 1, 1, YC.H.length).setValues([YC.H]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function ycRows_() {
  var ss = msBook_(), sh = ss.getSheetByName(YC.TAB); if (!sh) return [];
  var n = sh.getLastRow(); if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, YC.H.length).getValues().map(function (r, i) {
    var j = {}; try { j = JSON.parse(r[3] || '{}') || {}; } catch (e) { j = {}; }
    return { row: i + 2, id: String(r[0]), kind: String(r[1]), key: String(r[2]), j: j, at: String(r[4]), by: String(r[5]), active: !(r[6] === false || String(r[6]).toUpperCase() === 'FALSE') };
  }).filter(function (x) { return x.active && x.id; });
}
/* one row per kind+key: replace it (or switch it off with j === null) */
function ycPut_(kind, key, j, by) {
  var sh = ycTab_(), rows = ycRows_(), now = new Date().toISOString(), hit = rows.filter(function (x) { return x.kind === kind && x.key === key; });
  hit.forEach(function (x, i) { if (i || j === null) sh.getRange(x.row, 7).setValue(false); });
  if (j === null) return null;
  if (hit.length) { sh.getRange(hit[0].row, 4, 1, 3).setValues([[JSON.stringify(j), now, by || '']]); return hit[0].id; }
  var id = Utilities.getUuid().slice(0, 8); sh.appendRow([id, kind, key, JSON.stringify(j), now, by || '', true]); return id;
}

/* ---------- a boy's afternoon ---------- */
function ycMyClasses_(sid, rows) {
  var per = {}; rows.forEach(function (x) { if (x.kind === 'cls' && YC.PERIODS.indexOf(x.j.period) >= 0 && x.j.period !== 'IS') per[x.key] = x; });
  if (!Object.keys(per).length || typeof crRows_ !== 'function') return [];
  return crRows_(CR.CLS).map(crClassRow_).filter(function (c) { return c.active && per[c.id] && c.sids.indexOf(sid) >= 0; })
    .map(function (c) { var p = per[c.id]; return { id: c.id, name: c.name, subject: c.subject, staffId: c.staffId, staff: c.staff, period: p.j.period, from: p.j.from || '', to: p.j.to || '', at: p.at }; });
}
/* the windows of his day today: [{k, name, from, to, cls}] with class times (today's change, then the class default, then the school's) */
function ycWindows_(sid, rows, S, clk) {
  var mine = ycMyClasses_(sid, rows), out = [];
  ['T1', 'T2'].forEach(function (k) {
    var c = mine.filter(function (x) { return x.period === k; }).sort(function (a, b) { return a.at < b.at ? 1 : -1; })[0]; if (!c) return;
    var today = rows.filter(function (x) { return x.kind === 'tim' && x.key === c.id + '|' + clk.date; })[0];
    var from = (today && today.j.from) || c.from || S.periods[k].from, to = (today && today.j.to) || c.to || S.periods[k].to;
    out.push({ k: k, name: S.periods[k].name, from: ycMin_(from), to: ycMin_(to), cls: c });
  });
  out.push({ k: 'IS', name: S.periods.IS.name, from: ycMin_(S.periods.IS.from), to: ycMin_(S.periods.IS.to), cls: null });
  return { mine: mine, list: out };
}
/* what is on for this boy right now: null = the schedule does not touch him (app as usual) */
function ycState_(sid, now) {
  sid = String(sid || ''); if (!sid) return null;
  var S = ycSettings_(); if (S.live === 'off' || (S.live === 'test' && sid.indexOf('TEST-') !== 0)) return null;
  var clk = ycClock_(now); if (S.days.indexOf(clk.dow) < 0) return null;
  var lo = 24 * 60, hi = 0; YC.PERIODS.forEach(function (k) { lo = Math.min(lo, ycMin_(S.periods[k].from)); hi = Math.max(hi, ycMin_(S.periods[k].to)); });
  if (clk.min < lo - 60 || clk.min >= hi + 60) return null;   /* far from the afternoon: no reads at all (class times can move by up to an hour) */
  var rows = ycRows_(); if (!rows.length) return null;
  var W = ycWindows_(sid, rows, S, clk);   /* only boys put into a class or given a bucket */
  if (!W.mine.length && !rows.some(function (x) { return x.kind === 'bkt' && x.key === sid; })) return null;
  var g = typeof kmGradeOf_ === 'function' ? kmGradeOf_(sid) : null; if (g != null && g < 2) return null;   /* K-1 keep their games path */
  var at = function (m) { return clk.day0 + m * 60000; };
  var tw = W.list.filter(function (w) { return w.k !== 'IS' && clk.min >= w.from && clk.min < w.to; })[0];
  var isw = W.list.filter(function (w) { return w.k === 'IS'; })[0];
  var cur = tw || (clk.min >= isw.from && clk.min < isw.to ? isw : null); if (!cur) return null;
  var later = W.list.filter(function (w) { return w.from > clk.min && w !== cur; }).sort(function (a, b) { return a.from - b.from; })[0];
  var st = { date: clk.date, k: cur.k, name: cur.name, until: at(cur.to), next: later ? { k: later.k, name: later.name, at: at(later.from), show: ycShow_(ycHHMM_(later.from)) } : null, cls: cur.cls, rows: rows };
  if (cur.k !== 'IS') {
    var a = rows.filter(function (x) { return x.kind === 'asg' && x.key === cur.cls.id + '|' + clk.date + '|' + cur.k; })[0];
    if (a && (!a.j.sids || !a.j.sids.length || a.j.sids.indexOf(sid) >= 0) && (a.j.skills || []).length) { st.skills = a.j.skills; st.asg = a; }
    else st.empty = true;   /* nothing assigned: Independent Study for this period */
  }
  return st;
}
/* which of these worksheets he handed in */
function ycHanded_(sid, skills, rows) { var o = {}; skills.forEach(function (k) { if (!/^SHEET\./.test(k)) return; var a = ycAnsRow_(k.slice(6), sid, rows); if (a && a.j.status === 'handed') o[k] = 1; }); return o; }
/* the boy's live override (Free Play / Independent Study now), newest first */
function ycOverrideOf_(sid, rows, now) {
  return rows.filter(function (x) { return x.kind === 'ovr' && (x.j.sids || []).indexOf(sid) >= 0 && Number(x.j.from) <= now && Number(x.j.until) > now; })
    .sort(function (a, b) { return Number(b.j.seq) - Number(a.j.seq); })[0] || null;
}
/* Called by tmMine. Returns undefined = the schedule does not touch him (tmMine goes on as before); null = nothing locked; or the lock. */
function ycMine_(sid, session) {
  try {
    var now = ycNow_(), st = ycState_(sid, now); if (!st) return undefined;
    var ov = ycOverrideOf_(sid, st.rows, now);
    if (session && (!ov || Number(session.start) > Number(ov.j.seq))) return undefined;   /* a teacher's live class is newer: it wins (both stamped with the real clock) */
    if (ov && ov.j.mode === 'free') return null;   /* Free Play: the app is open as usual */
    if (!ov && st.k !== 'IS' && st.skills) {
      var skills = st.skills, lessons = [];
      skills.forEach(function (id) { if (/^TCH\./.test(id) && typeof crLessonBody_ === 'function') { var b = crLessonBody_(id); if (b) lessons.push(b); } });
      var nm = skills.length === 1 ? (st.asg.j.names && st.asg.j.names[skills[0]]) || (lessons[0] && lessons[0].title) || skills[0] : st.cls.name;
      return { id: 'yc:' + st.date + ':' + st.k + ':' + st.asg.id + ':' + st.asg.at, skill: skills[0], skills: skills, lessons: lessons, clsName: st.cls.name, name: nm,
        subj: typeof tmSubjOf_ === 'function' ? tmSubjOf_(skills[0]) : '', by: st.cls.staff, until: st.until, now: now,
        names: st.asg.j.names || {}, handed: ycHanded_(sid, skills, st.rows), doors: ycOpenFor_(sid, now, st.rows, false),
        yc: { k: st.k, label: st.name, cls: st.cls.name, next: st.next } };
    }
    /* Independent Study (the period itself, an empty Teacher Time, or "Independent Study now"): his bucket list.
       A boy with no bucket (or nothing in it he can do): his app is as usual. */
    var B = ycBucketNow_(sid, st, now); if (!B) return null;
    return { id: 'yc:' + st.date + ':IS:' + B.sig, skill: B.skills[0], skills: B.skills, lessons: [], clsName: 'Independent Study', name: 'Independent Study',
      subj: '', by: B.by, until: ov ? Math.min(Number(ov.j.until), st.until) : st.until, now: now,
      yc: { k: 'IS', label: 'Independent Study', cls: 'Your bucket list', next: st.next, why: st.k !== 'IS' ? (ov ? 'now' : 'empty') : '' }, bucket: B.view,
      doors: ycOpenFor_(sid, now, st.rows, B.view.complete) };
  } catch (e) { try { console.error('ycMine_', e); } catch (x) {} return undefined; }   /* never block a boy because of this */
}

/* ---------- staff ---------- */
function ycDays_() { var out = [], now = ycNow_(); for (var i = 0; i < YC.AHEAD; i++) out.push(ycClock_(now + i * 864e5).date); return out; }
function ycMine(token) {
  var me = crMe_(token), rows = ycRows_(), S = ycSettings_(), clk = ycClock_(ycNow_()), days = ycDays_();
  var per = {}; rows.forEach(function (x) { if (x.kind === 'cls') per[x.key] = x.j; });
  var classes = crMyClasses_(me).map(function (c) {
    var p = per[c.id] || {}, today = rows.filter(function (x) { return x.kind === 'tim' && x.key === c.id + '|' + clk.date; })[0];
    var asg = rows.filter(function (x) { return x.kind === 'asg' && x.key.indexOf(c.id + '|') === 0 && days.indexOf(x.key.split('|')[1]) >= 0; })
      .map(function (x) { var k = x.key.split('|'); return { date: k[1], period: k[2], skills: x.j.skills || [], names: x.j.names || {}, sids: x.j.sids || [], by: x.by }; })
      .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    return { id: c.id, name: c.name, subject: c.subject, sids: c.sids, period: p.period || '', from: p.from || '', to: p.to || '', today: today ? today.j : null, assigned: asg };
  });
  var mySids = {}; classes.forEach(function (c) { c.sids.forEach(function (s) { mySids[s] = 1; }); });
  var now = ycNow_(), ovs = rows.filter(function (x) { return x.kind === 'ovr' && Number(x.j.until) > now && (me.head || x.j.byId === me.id || (x.j.sids || []).some(function (s) { return mySids[s]; })); })
    .map(function (x) { return { id: x.key, mode: x.j.mode, sids: x.j.sids, until: Number(x.j.until), by: x.by, cls: x.j.clsName || '' }; });
  return { me: me, settings: S, today: clk.date, dow: clk.dow, days: days, classes: classes, overrides: ovs };
}
function ycMyClass_(me, classId) {
  var c = crMyClasses_(me).filter(function (x) { return x.id === String(classId || ''); })[0];
  if (!c) throw new Error('Pick one of your classes.');
  return c;
}
/* which period a class is (T1, T2 or none), and its own default times (empty = the school's) */
function ycSetPeriod(token, classId, period, from, to) {
  var me = crMe_(token), c = ycMyClass_(me, classId); period = String(period || '');
  if (period && ['T1', 'T2'].indexOf(period) < 0) throw new Error('Pick Teacher Time 1 or Teacher Time 2.');
  from = String(from || ''); to = String(to || '');
  if ((from || to) && !(ycMin_(from) >= 0 && ycMin_(to) > ycMin_(from))) throw new Error('The end time must be after the start time.');
  return sgLock_(function () { ycPut_('cls', c.id, period ? { period: period, from: from ? ycHHMM_(ycMin_(from)) : '', to: to ? ycHHMM_(ycMin_(to)) : '' } : null, me.name); return ycMine(token); });
}
/* change this class's times for one day only (empty from/to = back to its usual times) */
function ycSetToday(token, classId, date, from, to) {
  var me = crMe_(token), c = ycMyClass_(me, classId); date = String(date || ycClock_(ycNow_()).date);
  if (!ycDateOk_(date) || ycDays_().indexOf(date) < 0) throw new Error('Pick a day from today to two weeks ahead.');
  from = String(from || ''); to = String(to || '');
  if ((from || to) && !(ycMin_(from) >= 0 && ycMin_(to) > ycMin_(from))) throw new Error('The end time must be after the start time.');
  return sgLock_(function () { ycPut_('tim', c.id + '|' + date, from ? { from: ycHHMM_(ycMin_(from)), to: ycHHMM_(ycMin_(to)) } : null, me.name); return ycMine(token); });
}
/* the work for one class on one day: built lessons and/or the teacher's own lessons; sids empty = the whole class */
function ycAssign(token, classId, date, skills, sids) {
  var me = crMe_(token), c = ycMyClass_(me, classId), rows = ycRows_(), p = rows.filter(function (x) { return x.kind === 'cls' && x.key === c.id; })[0];
  if (!p || ['T1', 'T2'].indexOf(p.j.period) < 0) throw new Error('First pick which Teacher Time this class is.');
  date = String(date || ''); if (!ycDateOk_(date) || ycDays_().indexOf(date) < 0) throw new Error('Pick a day from today to two weeks ahead.');
  var mine = {}; crAllLessons_().forEach(function (l) { if (l.staffId === me.id) mine['TCH.' + l.id] = l.title; });
  var built = {}; plBuilt_().forEach(function (x) { built[x] = 1; });
  var names = {}; crCatalog_().forEach(function (x) { names[x[0]] = x[1]; });
  rows.forEach(function (x) { if (x.kind === 'sht' && x.j.ready) names['SHEET.' + x.key] = x.j.title; });   /* worksheets (active sheets) too */
  skills = (Array.isArray(skills) ? skills : []).map(String).filter(function (x, i, a) { return a.indexOf(x) === i && (mine[x] || built[x] || names[x]); }).slice(0, 12);
  sids = (Array.isArray(sids) ? sids : []).map(String).filter(function (x, i, a) { return a.indexOf(x) === i && c.sids.indexOf(x) >= 0; });
  var nm = {}; skills.forEach(function (x) { nm[x] = mine[x] || names[x] || x; });
  return sgLock_(function () { ycPut_('asg', c.id + '|' + date + '|' + p.j.period, skills.length ? { skills: skills, names: nm, sids: sids, byId: me.id } : null, me.name); return ycMine(token); });
}
/* right now: Free Play or Independent Study for chosen boys (or a whole class), for some minutes; ends any older live class for them */
function ycOverride(token, x) {
  var me = crMe_(token); x = x || {};
  var mode = String(x.mode || ''), minutes = Math.round(Number(x.minutes) || 0);
  if (['free', 'IS'].indexOf(mode) < 0) throw new Error('Pick Free Play or Independent Study.');
  if (!(minutes >= YC.OMIN && minutes <= YC.OMAX)) throw new Error('Pick how long: ' + YC.OMIN + ' to ' + YC.OMAX + ' minutes.');
  var cls = x.classId ? ycMyClass_(me, x.classId) : null, allowed = {};
  crMyClasses_(me).forEach(function (c) { c.sids.forEach(function (s) { allowed[s] = 1; }); });
  var sids = (Array.isArray(x.sids) && x.sids.length ? x.sids : (cls ? cls.sids : [])).map(String)
    .filter(function (s, i, a) { return a.indexOf(s) === i && (allowed[s] || me.head); });
  if (me.head && sids.length) { var roster = {}; msRoster_().forEach(function (r) { roster[r.id] = 1; }); sids = sids.filter(function (s) { return roster[s]; }); }
  if (!sids.length) throw new Error('Pick at least one of your students.');
  var now = ycNow_(), id = Utilities.getUuid().slice(0, 8);
  return sgLock_(function () {
    ycPut_('ovr', id, { mode: mode, sids: sids, from: now, until: now + minutes * 60000, seq: Date.now(), byId: me.id, clsName: cls ? cls.name : '' }, me.name);
    return ycMine(token);
  });
}
function ycEndOverride(token, id) {
  var me = crMe_(token); id = String(id || '');
  return sgLock_(function () {
    var r = ycRows_().filter(function (x) { return x.kind === 'ovr' && x.key === id; })[0];
    if (r && (r.j.byId === me.id || me.head)) ycPut_('ovr', id, null, me.name); else if (r) throw new Error('Only the teacher who started it can end it.');
    return ycMine(token);
  });
}
/* what a boy sees right now (for the teacher's "Right now" list and for tests) */
function ycBoyNow(token, sid) {
  crMe_(token); tlGuard_(token, [sid]); sid = String(sid || '');
  var sess = tmRead_().filter(function (x) { return x.sids.indexOf(sid) >= 0; }).pop() || null, r = ycMine_(sid, sess);
  if (r === undefined) return sess ? { what: 'class', name: sess.name } : { what: 'usual' };
  if (r === null) { var st = ycState_(sid, ycNow_()), ov = st && ycOverrideOf_(sid, st.rows, ycNow_()); return { what: ov && ov.j.mode === 'free' ? 'free' : 'IS' }; }
  return { what: r.yc.k, name: r.name, skills: r.skills, until: r.until };
}

/* ---------- Independent Study: the bucket list ----------
   A boy's bucket (kind 'bkt', key = his id) stays the same every day until staff change it (a daily regimen):
     core:   usually 3 to 6 things he MUST do, in any order he likes;
     addons: electives, trades and extras; they open once all his core is done.
   Each thing is either a SUBJECT at his level ({t:'subj', k:'MATH'}: his next lesson there, from his own map) or one LESSON ({t:'lesson', id}).
   Done = the server paid "Mastered" for it today (a subject: any lesson of that subject today, one per line), or a lesson he had already
   mastered. Any staff member with his own code can set a bucket for boys in his school. Nothing here pays money. */
YC.SUBJ = [['READ', 'Reading'], ['LANG', 'Writing'], ['MATH', 'Math'], ['K:CHU', 'Chumash'], ['K:RAS', 'Rashi'], ['K:MSH', 'Mishnah'], ['K:GEM', 'Gemara'], ['HEB', 'Lashon Hakodesh'],
  ['SCI', 'Science'], ['SOC', 'Social Studies'], ['COMP', 'Computing'], ['ELEC', 'Electives'], ['VOC', 'Trades'], ['LIFE', 'Life & Money']];
YC.MAXCORE = 8; YC.MAXADD = 12;
function ycSubjName_(k) { var x = YC.SUBJ.filter(function (y) { return y[0] === k; })[0]; return x ? x[1] : k; }
/* which bucket subject a lesson id belongs to */
function ycKeyOf_(id) {
  var p = String(id || '').split('.'); if (!p[0]) return '';
  if (p[0] === 'LK') return 'K:' + p[1]; if (p[0] === 'WRIT') return 'LANG'; if (p[0] === 'SS') return 'SOC';
  return p[0];
}
function ycDayOf_(iso) { return moneyDay_(iso); }   /* tests replace this with the day of their made-up clock */
function ycCleanItems_(list, max) {
  var names = {}; try { crCatalog_().forEach(function (x) { names[x[0]] = x[1]; }); } catch (e) {}
  var built = {}; try { plBuilt_().forEach(function (x) { built[x] = 1; }); } catch (e) {}
  return (Array.isArray(list) ? list : []).map(function (x) {
    x = x || {};
    if (x.t === 'subj' && YC.SUBJ.some(function (y) { return y[0] === x.k; })) return { t: 'subj', k: x.k, name: ycSubjName_(x.k) + ' at his level' };
    var id = String(x.id || ''); if (x.t === 'lesson' && (names[id] || built[id])) return { t: 'lesson', id: id, name: names[id] || id };
    if (x.t === 'sheet') { var sh = ycSheetRow_(id); if (sh && sh.j.ready) return { t: 'sheet', id: sh.key, name: sh.j.title }; }
    return null;
  }).filter(Boolean).slice(0, max);
}
/* his own map, kept 10 minutes: what "his level" means for each subject */
function ycNowIds_(sid) {
  var c = CacheService.getScriptCache(), ck = 'yc_now_' + sid, hit = c.get(ck); if (hit) { try { return JSON.parse(hit); } catch (e) {} }
  var m = null; try { m = kmMapFor_(String(sid)); } catch (e) { m = null; } if (!m) return {};
  var out = { now: {}, names: m.names || {} }, S = m.subjects || {}, K = m.kodesh || {};
  Object.keys(S).forEach(function (k) { if (S[k] && S[k].now) out.now[k] = S[k].now; });
  Object.keys(K).forEach(function (k) { if (K[k] && K[k].now) out.now[k] = K[k].now; });
  var small = { now: out.now, names: {} }; Object.keys(out.now).forEach(function (k) { var id = out.now[k]; small.names[id] = out.names[id] ? out.names[id][0] : ''; });
  try { c.put(ck, JSON.stringify(small), 600); } catch (e) {}
  return small;
}
function ycMasteredToday_(sid, day) {
  var pre = 'ms:' + sid + ':Mastered ', out = [];
  try { moneyRowsFor_(sid).forEach(function (r) { if (String(r.key || '').indexOf(pre) === 0 && ycDayOf_(r.at) === day) out.push(String(r.key).slice(pre.length)); }); } catch (e) {}
  return out;
}
function ycMasteredEver_(sid) { var st = {}; try { msStateRowOf_(sid).forEach(function (r) { if (String(r[0]) === sid) st = JSON.parse(r[1]) || {}; }); } catch (e) {} try { return sgMastered_(st) || {}; } catch (e) { return {}; } }
/* his bucket today, resolved: which lesson each line opens, what is done; null = no bucket / nothing he can do */
function ycBucketNow_(sid, st, now) {
  var b = st.rows.filter(function (x) { return x.kind === 'bkt' && x.key === sid; })[0]; if (!b || !(b.j.core || []).length) return null;
  var N = ycNowIds_(sid), today = ycMasteredToday_(sid, st.date), ever = null, usedToday = {};
  var line = function (x) {
    var o = { t: x.t, name: x.name, k: x.t === 'subj' ? x.k : ycKeyOf_(x.id) };
    if (x.t === 'subj') {
      var hit = today.filter(function (id) { return !usedToday[id] && ycKeyOf_(id) === x.k; })[0];
      if (hit) { usedToday[hit] = 1; o.done = true; o.skill = hit; o.name = ycSubjName_(x.k); return o; }
      o.skill = N.now && N.now[x.k] || ''; o.name = ycSubjName_(x.k); o.lesson = o.skill && N.names ? N.names[o.skill] || '' : '';
      return o.skill ? o : null;   /* nothing at his level in that subject: the line is left out */
    }
    if (x.t === 'sheet') { var sh = ycSheetRow_(x.id, st.rows); if (!sh || !sh.j.ready) return null; var an = ycAnsRow_(sh.key, sid, st.rows);
      o.skill = 'SHEET.' + sh.key; o.k = 'SHEET'; o.name = sh.j.title; o.done = !!(an && an.j.status === 'handed'); return o; }
    o.skill = x.id; ever = ever || ycMasteredEver_(sid);
    if (today.indexOf(x.id) >= 0 || ever[x.id]) o.done = true;
    return o;
  };
  var core = (b.j.core || []).map(line).filter(Boolean), adds = (b.j.addons || []).map(line).filter(Boolean);
  if (!core.length && !adds.length) return null;
  var done = core.filter(function (x) { return x.done; }).length, complete = done >= core.length;
  var skills = core.map(function (x) { return x.skill; }).concat(complete ? adds.map(function (x) { return x.skill; }) : []).filter(function (x, i, a) { return x && a.indexOf(x) === i; });
  if (!skills.length) skills = core.map(function (x) { return x.skill; });
  return { skills: skills, by: b.by, sig: b.id + ':' + b.at + ':' + done + (complete ? 'c' : ''),
    view: { core: core, addons: adds, done: done, total: core.length, complete: complete } };
}
/* staff: the boys he may set buckets for (his school), and their buckets */
function ycBucketBoys_(token) {
  return (typeof tlSchoolScope_ === 'function' ? tlSchoolScope_(function () { return msRoster_(); }) : msRoster_()).map(function (r) { return { id: r.id, name: r.name }; })
    .sort(function (a, b) { return a.name.localeCompare(b.name); });
}
function ycBuckets(token) {
  crMe_(token); var boys = ycBucketBoys_(token), ok = {}; boys.forEach(function (b) { ok[b.id] = 1; });
  var out = {}; ycRows_().forEach(function (x) { if (x.kind === 'bkt' && ok[x.key]) out[x.key] = { core: x.j.core || [], addons: x.j.addons || [], by: x.by, at: x.at }; });
  return { boys: boys, buckets: out, subjects: YC.SUBJ.map(function (y) { return { k: y[0], name: y[1] }; }) };
}
/* give the same bucket to one boy or many (a level group); empty core = take the bucket away */
function ycSaveBucket(token, sids, core, addons) {
  var me = crMe_(token), boys = ycBucketBoys_(token), ok = {}; boys.forEach(function (b) { ok[b.id] = 1; });
  sids = (Array.isArray(sids) ? sids : []).map(String).filter(function (x, i, a) { return ok[x] && a.indexOf(x) === i; });
  if (!sids.length) throw new Error('Pick at least one boy.');
  core = ycCleanItems_(core, YC.MAXCORE); addons = ycCleanItems_(addons, YC.MAXADD);
  if (!core.length && addons.length) throw new Error('Add at least one core item. The add-ons open after the core.');
  return sgLock_(function () { sids.forEach(function (sid) { ycPut_('bkt', sid, core.length ? { core: core, addons: addons, byId: me.id } : null, me.name); }); return ycBuckets(token); });
}

/* ---------- ACTIVE SHEETS: worksheets a boy fills in on the screen ----------
   A teacher either UPLOADS a worksheet (a PDF or a photo; the staff page turns every page into a picture before sending it), or
   WRITES one in the app (a title and the questions; the page draws it as a clean worksheet). Either way it is a sheet "SHEET.<id>"
   that can be assigned like a lesson (Teacher Time) or put in a bucket. The boy types in boxes he places, and writes and draws with
   his finger, mouse or pen; his work saves by itself; he taps Hand it in; his teacher sees the filled-in sheet.
   Files (page pictures and the boy's work) live in Cloud Storage through the Firebase server (TL_REMOTE_ 'ycPut' / 'ycGet',
   functions/index.js), never in the database tabs. The records (kind 'sht' and 'ans') are in MS_YC. */
YC.SHEET = { PAGES: 20, PAGE_BYTES: 1500000, ANS_BYTES: 800000, LINES: 40 };
function ycFilePut_(key, b64, type) { return TL_REMOTE_('ycPut', [key, b64, type]); }
function ycFileGet_(key) { return TL_REMOTE_('ycGet', [key]); }
function ycSheetRow_(id, rows) { id = String(id || '').replace(/^SHEET\./, ''); return (rows || ycRows_()).filter(function (x) { return x.kind === 'sht' && x.key === id; })[0] || null; }
function ycSheetPublic_(x) { return { id: x.key, skill: 'SHEET.' + x.key, title: x.j.title, kind: x.j.kind, pages: x.j.pages || 0, ready: !!x.j.ready, by: x.by, byId: x.j.byId, lines: x.j.kind === 'text' ? x.j.lines : undefined, at: x.at }; }
function ycSheets(token) { var me = crMe_(token); return ycRows_().filter(function (x) { return x.kind === 'sht' && x.j.ready; }).map(ycSheetPublic_).map(function (s) { s.mine = s.byId === me.id; return s; }).sort(function (a, b) { return a.at < b.at ? 1 : -1; }); }
function ycSheetNew(token, x) {
  var me = crMe_(token); x = x || {};
  var title = crClean_(x.title, 80); if (!title) throw new Error('Give the worksheet a title.');
  var kind = x.kind === 'text' ? 'text' : 'pages', id = Utilities.getUuid().replace(/-/g, '').slice(0, 12), j = { title: title, kind: kind, byId: me.id, pages: 0, ready: false };
  if (kind === 'text') {
    j.lines = (Array.isArray(x.lines) ? x.lines : []).map(function (l) { return crClean_(l, 200); }).filter(String).slice(0, YC.SHEET.LINES);
    if (!j.lines.length) throw new Error('Write at least one question.');
    j.pages = Math.max(1, Math.ceil(j.lines.length / 8)); j.ready = true;
  }
  return sgLock_(function () { ycPut_('sht', id, j, me.name); return { id: id, skill: 'SHEET.' + id, sheets: kind === 'text' ? ycSheets(token) : null }; });
}
function ycMySheet_(me, id) { var r = ycSheetRow_(id); if (!r) throw new Error('That worksheet is not on the list.'); if (r.j.byId !== me.id && !me.head) throw new Error('That is not your worksheet.'); return r; }
/* one page picture of an uploaded worksheet (a JPEG or PNG data URL, made by the staff page) */
function ycSheetPage(token, id, i, dataUrl) {
  var me = crMe_(token), r = ycMySheet_(me, id); i = Math.round(Number(i)); if (r.j.kind !== 'pages') throw new Error('That worksheet has no pages to upload.');
  if (!(i >= 0 && i < YC.SHEET.PAGES)) throw new Error('A worksheet can have up to ' + YC.SHEET.PAGES + ' pages.');
  var m = /^data:image\/(jpeg|png);base64,([A-Za-z0-9+\/=]+)$/.exec(String(dataUrl || '')); if (!m) throw new Error('That page did not come through. Please try again.');
  if (m[2].length * 3 / 4 > YC.SHEET.PAGE_BYTES) throw new Error('That page is too big.');
  ycFilePut_('sheets/' + r.key + '/p' + i, m[2], 'image/' + m[1]);
  return { ok: true, page: i };
}
function ycSheetReady(token, id, pages) {
  var me = crMe_(token), r = ycMySheet_(me, id); pages = Math.round(Number(pages));
  if (!(pages >= 1 && pages <= YC.SHEET.PAGES)) throw new Error('No pages came through. Please try again.');
  return sgLock_(function () { var j = r.j; j.pages = pages; j.ready = true; ycPut_('sht', r.key, j, r.by); return ycSheets(token); });
}
function ycSheetDelete(token, id) { var me = crMe_(token), r = ycMySheet_(me, id); return sgLock_(function () { ycPut_('sht', r.key, null, me.name); return ycSheets(token); }); }
/* may this boy open this sheet right now? (it is in what his screen is locked to) */
function ycBoyOpen_(sid, skill) {
  var sess = tmRead_().filter(function (x) { return x.sids.indexOf(sid) >= 0; }).pop() || null, r = ycMine_(sid, sess);
  var skills = r === undefined ? (sess ? (sess.skills || [sess.skill]) : []) : (r ? r.skills : []);
  return skills.indexOf(skill) >= 0;
}
function ycAnsRow_(id, sid, rows) { return (rows || ycRows_()).filter(function (x) { return x.kind === 'ans' && x.key === id + '|' + sid; })[0] || null; }
/* the boy opens a sheet: its pages (or questions) and his own work so far */
function ycSheetOpen(token, id) {
  var s = crKid_(token), r = ycSheetRow_(id); if (!r || !r.j.ready) throw new Error('That worksheet is not ready yet.');
  var a = ycAnsRow_(r.key, s.sid), can = ycBoyOpen_(s.sid, 'SHEET.' + r.key);
  if (!can && !a) throw new Error('This worksheet is not open now.');
  var work = null; if (a) { var f = ycFileGet_('answers/' + r.key + '/' + s.sid + '.json'); if (f && f.b64) { try { work = JSON.parse(Utilities.newBlob(Utilities.base64Decode(f.b64)).getDataAsString()); } catch (e) { work = null; } } }
  return { sheet: ycSheetPublic_(r), work: work, status: a ? a.j.status : 'new', canEdit: can && !(a && a.j.status === 'handed') };
}
/* one page picture: the boy (when the sheet is his now, or he has work on it) or any staff member */
function ycSheetImg(token, id, i) {
  var s = msSession_(token), r = ycSheetRow_(id); if (!r || r.j.kind !== 'pages') throw new Error('That worksheet is not on the list.');
  if (s.role === 'kid') { if (!ycBoyOpen_(s.sid, 'SHEET.' + r.key) && !ycAnsRow_(r.key, s.sid)) throw new Error('This worksheet is not open now.'); }
  else crMe_(token);
  i = Math.round(Number(i)); if (!(i >= 0 && i < (r.j.pages || 0))) throw new Error('No such page.');
  var f = ycFileGet_('sheets/' + r.key + '/p' + i); if (!f || !f.b64) throw new Error('That page did not load. Please try again.');
  return 'data:' + (f.type || 'image/jpeg') + ';base64,' + f.b64;
}
/* the boy's work saves by itself; handIn = he is done (then it is closed for him) */
function ycSheetSave(token, id, work, handIn) {
  var s = crKid_(token), r = ycSheetRow_(id); if (!r || !r.j.ready) throw new Error('That worksheet is not on the list.');
  if (!ycBoyOpen_(s.sid, 'SHEET.' + r.key)) throw new Error('This worksheet is closed now. Your work was saved before.');
  var a = ycAnsRow_(r.key, s.sid); if (a && a.j.status === 'handed') throw new Error('You already handed this in.');
  var body = JSON.stringify(work && typeof work === 'object' ? { v: 1, pages: Array.isArray(work.pages) ? work.pages.slice(0, YC.SHEET.PAGES) : [] } : { v: 1, pages: [] });
  if (body.length > YC.SHEET.ANS_BYTES) throw new Error('Your page has too much on it to save. Try erasing some lines.');
  ycFilePut_('answers/' + r.key + '/' + s.sid + '.json', Utilities.base64Encode(body), 'application/json');
  var now = new Date().toISOString();
  return sgLock_(function () { ycPut_('ans', r.key + '|' + s.sid, { status: handIn ? 'handed' : 'started', at: now, handedAt: handIn ? now : '', title: r.j.title }, s.sid); return { ok: true, status: handIn ? 'handed' : 'started', at: now }; });
}
/* staff: who started and who handed in a sheet; and one boy's filled-in sheet */
function ycSheetWork(token, id) {
  crMe_(token); var rows = ycRows_(), r = ycSheetRow_(id, rows); if (!r) throw new Error('That worksheet is not on the list.');
  var names = {}; msRoster_().forEach(function (b) { names[b.id] = b.name; });
  return { sheet: ycSheetPublic_(r), boys: rows.filter(function (x) { return x.kind === 'ans' && x.key.indexOf(r.key + '|') === 0; })
    .map(function (x) { var sid = x.key.split('|')[1]; return { sid: sid, name: names[sid] || sid, status: x.j.status, at: x.j.at }; }).filter(function (b) { return names[b.sid]; })
    .sort(function (a, b) { return a.name.localeCompare(b.name); }) };
}
function ycSheetAnswer(token, id, sid) {
  crMe_(token); tlGuard_(token, [sid]); sid = String(sid || ''); var r = ycSheetRow_(id); if (!r) throw new Error('That worksheet is not on the list.');
  var a = ycAnsRow_(r.key, sid); if (!a) return { sheet: ycSheetPublic_(r), work: null, status: 'new' };
  var f = ycFileGet_('answers/' + r.key + '/' + sid + '.json'), work = null; if (f && f.b64) { try { work = JSON.parse(Utilities.newBlob(Utilities.base64Decode(f.b64)).getDataAsString()); } catch (e) { work = null; } }
  return { sheet: ycSheetPublic_(r), work: work, status: a.j.status, at: a.j.at };
}
/* the teacher can open a handed-in sheet again for the boy */
function ycSheetReopen(token, id, sid) {
  var me = crMe_(token); tlGuard_(token, [sid]); var r = ycSheetRow_(id), a = r && ycAnsRow_(r.key, String(sid)); if (!a) throw new Error('He has no work on this worksheet.');
  return sgLock_(function () { var j = a.j; j.status = 'started'; ycPut_('ans', a.key, j, me.name); return ycSheetWork(token, id); });
}

/* ---------- WHO GETS WHAT, WHEN: the app's doors ----------
   Every part of the app a boy can open is a "door" (YC.DOORS). During the afternoon schedule every door is shut except his class work or
   bucket. Any teacher can open doors for his own boys with a RULE: which doors, which days and times, for which class (or all his boys),
   and whether only after the boy finished his core ("after 3:00, boys who finished their core get the Canteen and Chavrusa duels").
   Any teacher can also TAKE A DOOR AWAY from a boy until a day and time (it comes back by itself); that holds all day, not only in the afternoon.
   Rules: kind 'acc' in MS_YC. Take-aways: kind 'nox' in MS_YC, with a small list in Script Properties (YC.NOX) so a boy with none costs nothing. */
YC.NOX = 'yc_nox_v1';
YC.DOORS = [];   /* filled below: [id, name, icon] */
function ycDoorIds_() { var o = {}; YC.DOORS.forEach(function (d) { o[d[0]] = 1; }); return o; }
function ycCleanDoors_(list) { var ok = ycDoorIds_(); return (Array.isArray(list) ? list : []).map(String).filter(function (d, i, a) { return ok[d] && a.indexOf(d) === i; }); }
function ycNoxList_() { try { return JSON.parse(PropertiesService.getScriptProperties().getProperty(YC.NOX) || '{}') || {}; } catch (e) { return {}; } }
function ycNoxSync_(rows) {   /* keep the small list in step with the live take-aways */
  var now = ycNow_(), o = {}; rows.forEach(function (x) { if (x.kind === 'nox' && Number(x.j.until) > now) (x.j.sids || []).forEach(function (s) { o[s] = Math.max(o[s] || 0, Number(x.j.until)); }); });
  PropertiesService.getScriptProperties().setProperty(YC.NOX, JSON.stringify(o));
}
/* doors taken away from this boy right now */
function ycClosedFor_(sid, now, rows) {
  var L = ycNoxList_(); if (!(Number(L[sid]) > now)) return [];
  var out = []; (rows || ycRows_()).forEach(function (x) { if (x.kind === 'nox' && Number(x.j.until) > now && (x.j.sids || []).indexOf(sid) >= 0) (x.j.doors || []).forEach(function (d) { if (out.indexOf(d) < 0) out.push(d); }); });
  return out;
}
/* doors the teachers' rules open for this boy right now (coreDone: he finished his bucket's core today) */
function ycOpenFor_(sid, now, rows, coreDone) {
  var clk = ycClock_(now), mine = {}; crRows_(CR.CLS).map(crClassRow_).forEach(function (c) { if (c.active && c.sids.indexOf(sid) >= 0) mine[c.id] = 1; });
  var out = [];
  rows.forEach(function (x) {
    if (x.kind !== 'acc') return; var j = x.j;
    if ((j.days || [1, 2, 3, 4]).indexOf(clk.dow) < 0) return;
    if (!(clk.min >= ycMin_(j.from) && clk.min < ycMin_(j.to))) return;
    if (j.when === 'core' && !coreDone) return;
    var forMe = j.classId ? !!mine[j.classId] : (j.sids || []).indexOf(sid) >= 0;
    if (!forMe) return;
    (j.doors || []).forEach(function (d) { if (out.indexOf(d) < 0) out.push(d); });
  });
  return out;
}
/* staff: the door list, my rules, and take-aways for my boys */
function ycAccess(token) {
  var me = crMe_(token), rows = ycRows_(), now = ycNow_(), classes = crMyClasses_(me), mySids = {};
  classes.forEach(function (c) { c.sids.forEach(function (s) { mySids[s] = 1; }); });
  var names = {}; msRoster_().forEach(function (b) { names[b.id] = b.name; });
  var cname = {}; crRows_(CR.CLS).map(crClassRow_).forEach(function (c) { cname[c.id] = c.name + ' (' + c.staff + ')'; });
  return {
    doors: YC.DOORS.map(function (d) { return { id: d[0], name: d[1], icon: d[2] }; }),
    classes: classes.map(function (c) { return { id: c.id, name: c.name, sids: c.sids }; }),
    boys: Object.keys(mySids).map(function (s) { return { id: s, name: names[s] || s }; }).sort(function (a, b) { return a.name.localeCompare(b.name); }),
    rules: rows.filter(function (x) { return x.kind === 'acc' && (x.j.byId === me.id || me.head || (x.j.classId && classes.some(function (c) { return c.id === x.j.classId; }))); })
      .map(function (x) { return { id: x.key, doors: x.j.doors, from: x.j.from, to: x.j.to, days: x.j.days, when: x.j.when, classId: x.j.classId || '', cls: cname[x.j.classId] || '', sids: x.j.sids || [], by: x.by, mine: x.j.byId === me.id }; }),
    takeaways: rows.filter(function (x) { return x.kind === 'nox' && Number(x.j.until) > now && (me.head || x.j.byId === me.id || (x.j.sids || []).some(function (s) { return mySids[s]; })); })
      .map(function (x) { return { id: x.key, sids: x.j.sids, names: (x.j.sids || []).map(function (s) { return names[s] || s; }), doors: x.j.doors, until: Number(x.j.until), why: x.j.why || '', by: x.by, mine: x.j.byId === me.id }; })
  };
}
function ycSaveRule(token, r) {
  var me = crMe_(token); r = r || {};
  var doors = ycCleanDoors_(r.doors); if (!doors.length) throw new Error('Tick at least one thing to open.');
  var from = String(r.from || ''), to = String(r.to || ''); if (!(ycMin_(from) >= 0 && ycMin_(to) > ycMin_(from))) throw new Error('The end time must be after the start time.');
  var days = (Array.isArray(r.days) && r.days.length ? r.days : [1, 2, 3, 4]).map(Number).filter(function (d, i, a) { return d >= 1 && d <= 7 && a.indexOf(d) === i; });
  var classId = String(r.classId || ''), sids = [];
  if (classId) ycMyClass_(me, classId);
  else { var ok = {}; crMyClasses_(me).forEach(function (c) { c.sids.forEach(function (s) { ok[s] = 1; }); }); sids = (Array.isArray(r.sids) ? r.sids : []).map(String).filter(function (s, i, a) { return (ok[s] || me.head) && a.indexOf(s) === i; }); if (!sids.length) throw new Error('Pick a class or at least one boy.'); }
  var id = String(r.id || '') || Utilities.getUuid().slice(0, 8), old = id && ycRows_().filter(function (x) { return x.kind === 'acc' && x.key === id; })[0];
  if (old && old.j.byId !== me.id && !me.head) throw new Error('Only the teacher who made this rule can change it.');
  return sgLock_(function () { ycPut_('acc', id, { doors: doors, from: ycHHMM_(ycMin_(from)), to: ycHHMM_(ycMin_(to)), days: days, when: r.when === 'core' ? 'core' : 'any', classId: classId, sids: sids, byId: old ? old.j.byId : me.id }, me.name); return ycAccess(token); });
}
function ycDeleteRule(token, id) {
  var me = crMe_(token); id = String(id || ''); var r = ycRows_().filter(function (x) { return x.kind === 'acc' && x.key === id; })[0];
  if (r && r.j.byId !== me.id && !me.head) throw new Error('Only the teacher who made this rule can remove it.');
  return sgLock_(function () { if (r) ycPut_('acc', id, null, me.name); return ycAccess(token); });
}
/* take doors away from boys until a time (ms) */
function ycTakeAway(token, x) {
  var me = crMe_(token); x = x || {};
  var doors = ycCleanDoors_(x.doors); if (!doors.length) throw new Error('Tick at least one thing to take away.');
  var ok = {}; crMyClasses_(me).forEach(function (c) { c.sids.forEach(function (s) { ok[s] = 1; }); });
  var sids = (Array.isArray(x.sids) ? x.sids : []).map(String).filter(function (s, i, a) { return (ok[s] || me.head) && a.indexOf(s) === i; });
  if (!sids.length) throw new Error('Pick at least one of your boys.');
  var now = ycNow_(), until = Number(x.until); if (!(until > now + 60000 && until <= now + 30 * 864e5)) throw new Error('Pick when it comes back (up to 30 days).');
  return sgLock_(function () { ycPut_('nox', Utilities.getUuid().slice(0, 8), { sids: sids, doors: doors, until: until, why: crClean_(x.why, 120), byId: me.id }, me.name); ycNoxSync_(ycRows_()); return ycAccess(token); });
}
function ycGiveBack(token, id) {
  var me = crMe_(token); id = String(id || ''); var r = ycRows_().filter(function (x) { return x.kind === 'nox' && x.key === id; })[0];
  if (r && r.j.byId !== me.id && !me.head) throw new Error('Only the teacher who took it away (or the Head of School) can give it back.');
  return sgLock_(function () { if (r) ycPut_('nox', id, null, me.name); ycNoxSync_(ycRows_()); return ycAccess(token); });
}

/* tmMine's last step: take-aways hold all day. A lock keeps its open doors minus the taken ones; no lock but taken doors = {open:true, closed}. */
function ycDecorate_(sid, res) {
  try {
    var now = ycNow_(), closed = ycClosedFor_(sid, now); if (!closed.length) return res;
    if (res) { res.closed = closed; res.doors = (res.doors || []).filter(function (d) { return closed.indexOf(d) < 0; }); return res; }
    return { open: true, id: 'yc-open:' + closed.join(','), closed: closed, now: Date.now() };
  } catch (e) { return res; }
}
