/* TeacherMode.js — "Teacher mode" (v51, 2026-11-11, Head of School request).
   A teacher picks some boys + one lesson + how long. Until the time is up (or the teacher ends it),
   those boys' screens show ONLY that lesson (ClassMode.html locks everything else on the boy page).
   Sessions live in Script Properties (TM.KEY) with a copy in the script cache, so boys can check often.
   Nothing here changes money, mastery or placement: the lesson itself is the normal startMission. */
var TM = { KEY: 'tm_sessions_v1', CACHE: 'tm_sessions_c1', CAT: 'tm_catalog_v1', MIN: 5, MAX: 180,
  SUBJ: { MATH: 'Math', READ: 'Reading', WRIT: 'Writing', SCI: 'Science', ELEC: 'Electives' } };

function tmSubjOf_(id) { var p = String(id).split('.')[0]; return p === 'LANG' ? 'WRIT' : p; }
function tmLevelOf_(id) { var m = /\.L(\d\d)\./.exec(String(id)); return m ? Number(m[1]) : 0; }

function tmRead_() {
  var c = CacheService.getScriptCache(), hit = c.get(TM.CACHE), list;
  if (hit !== null) { try { list = JSON.parse(hit); } catch (e) { list = null; } }
  if (!list) { try { list = JSON.parse(PropertiesService.getScriptProperties().getProperty(TM.KEY) || '[]'); } catch (e) { list = []; } c.put(TM.CACHE, JSON.stringify(list), 21600); }
  var now = Date.now();
  return list.filter(function (s) { return s && !s.ended && s.until > now; });
}
function tmWrite_(list) {
  var now = Date.now(); list = list.filter(function (s) { return s && !s.ended && s.until > now; });
  var j = JSON.stringify(list);
  PropertiesService.getScriptProperties().setProperty(TM.KEY, j);
  CacheService.getScriptCache().put(TM.CACHE, j, 21600);
  return list;
}
function tmPublic_(s) { return { id: s.id, skill: s.skill, skills: s.skills || [s.skill], cls: s.cls || '', clsName: s.clsName || '', name: s.name, subj: s.subj, sids: s.sids, by: s.by, byId: s.byId || '', start: s.start, until: s.until }; }

/* all built lessons with their names, for the teacher's picker */
function tmCatalog_() {
  var c = CacheService.getScriptCache(), hit = c.get(TM.CAT); if (hit) return JSON.parse(hit);
  var html = HtmlService.createHtmlOutputFromFile('QuestPage').getContent() + plFileText_('MathMore') + plFileText_('ReadMore') + plFileText_('ScienceMore') + plFileText_('ScienceMore2') + plFileText_('ElectivesMore') + plFileText_('OneBiteDataRead');
  var re = /'((?:MATH|READ|WRIT|LANG|SCI|ELEC)\.[A-Z]+\.L\d\d\.\d\d(?:\.[a-z])?)'\s*\]?\s*[:=]\s*\{\s*name\s*:\s*(['"`])((?:\\.|(?!\2)[^\\])*)\2/g, m, seen = {}, out = [];
  var known = {}; [].concat(MATH_K8, READ_K8, typeof SCI_K8 !== 'undefined' ? SCI_K8 : []).forEach(function (x) { known[x[0]] = x[1]; });
  while ((m = re.exec(html))) {
    var id = m[1]; if (seen[id]) continue; seen[id] = 1;
    var nm = known[id] || m[3].replace(/\\(.)/g, '$1');
    out.push({ id: id, name: nm, subj: tmSubjOf_(id), level: tmLevelOf_(id) });
  }
  out.sort(function (a, b) { return a.subj.localeCompare(b.subj) || a.level - b.level || a.id.localeCompare(b.id); });
  c.put(TM.CAT, JSON.stringify(out), 600);
  return out;
}

/* ---- staff ---- */
function tmCatalog(token) { sgStaff_(token); return { subjects: TM.SUBJ, lessons: tmCatalog_() }; }
function tmList(token) { sgStaff_(token); return tmRead_().map(tmPublic_); }
function tmStart(token, sids, skill, minutes) { tlGuard_(token, sids);
  var s = sgStaff_(token), who = sgWho_(s);
  skill = String(skill || ''); minutes = Math.round(Number(minutes) || 0);
  if (!Array.isArray(sids) || !sids.length) throw new Error('Pick at least one student.');
  var roster = {}; msRoster_().forEach(function (r) { roster[r.id] = r.name; });
  sids = sids.map(String).filter(function (x, i, a) { return roster[x] && a.indexOf(x) === i; });
  if (!sids.length) throw new Error('Those students are not on the list.');
  var lesson = tmCatalog_().filter(function (x) { return x.id === skill; })[0];
  if (!lesson) throw new Error('Pick a lesson.');
  if (!(minutes >= TM.MIN && minutes <= TM.MAX)) throw new Error('Pick how long: ' + TM.MIN + ' to ' + TM.MAX + ' minutes.');
  return sgLock_(function () {
    var list = tmRead_();
    list.forEach(function (x) { x.sids = x.sids.filter(function (id) { return sids.indexOf(id) < 0; }); });   /* a boy is in one class at a time: newest wins */
    list = list.filter(function (x) { return x.sids.length; });
    var now = Date.now();
    list.push({ id: Utilities.getUuid(), skill: lesson.id, name: lesson.name, subj: lesson.subj, sids: sids, by: who.name, start: now, until: now + minutes * 60000 });
    return tmWrite_(list).map(tmPublic_);
  });
}
function tmEnd(token, id) {
  sgStaff_(token); id = String(id || '');
  return sgLock_(function () { return tmWrite_(tmRead_().filter(function (x) { return x.id !== id; })).map(tmPublic_); });
}
/* add more time (or take some away) to a running class */
function tmExtend(token, id, minutes) {
  sgStaff_(token); id = String(id || ''); minutes = Math.round(Number(minutes) || 0);
  if (!minutes || Math.abs(minutes) > 120) throw new Error('Pick how many minutes.');
  return sgLock_(function () { var list = tmRead_(); list.forEach(function (x) { if (x.id === id) x.until = Math.min(x.until + minutes * 60000, Date.now() + TM.MAX * 60000); }); return tmWrite_(list).map(tmPublic_); });
}

/* ---- boy: is my screen locked to a class lesson right now? ---- */
function tmMine(token) {
  var sess = msSession_(token); if (!sess || !sess.sid) return null;
  var s = tmRead_().filter(function (x) { return x.sids.indexOf(sess.sid) >= 0; }).pop();
  if (!s) return null;
  var skills = s.skills || [s.skill], lessons = [];   /* v128 (DECISION 2230): several lessons per class + teacher-made lessons (TCH.*) sent with their questions */
  skills.forEach(function (id) { if (/^TCH\./.test(id) && typeof crLessonBody_ === 'function') { var b = crLessonBody_(id); if (b) lessons.push(b); } });
  return { id: s.id, skill: s.skill, skills: skills, lessons: lessons, clsName: s.clsName || '', name: s.name, subj: s.subj, by: s.by, until: s.until, now: Date.now() };
}
