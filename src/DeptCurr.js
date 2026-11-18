/* DeptCurr.js — DEPARTMENTS: the CURRICULUM view, the department head's main screen (Head of School 2026-11-18: "remember the primary part
   of the departments is to allow the head of each department to view what curriculum is available and act accordingly").
   rabbikhaver-cloud-builder-1. The page (DeptCurrUI.html) draws the department's lessons (from dpOpen) as a grade-by-topic map with
   filters; this file adds, per lesson, what a head needs to decide:
   - review status from the Curriculum Guide (tab CP_Review: approved / rebbe-checked / flagged + note, new, changed since review),
   - open problem reports, how often boys miss it (last 14 days), and known content errors (DeptTodo.js DT_FIXES),
   - the link to the Curriculum Preview to see the lesson exactly as a boy sees it (?cp=1&skill=ID).
   Acting: dpReview (approve / rebbe-checked / flag with a note / clear) writes the SAME CP_Review row the Curriculum Guide uses.
   "Add a task" and "Ask for a lesson" use DeptTodo.js dpTask. Same access as Departments.js; checked here on every call.
   No lesson content, mastery, money or student record is changed. Calls (API_ALLOW): dpCurr, dpReview. */
function dcGate_(token, deptId) {
  var who = dpWho_(token), cfg = dpCfg_(); deptId = String(deptId || '');
  var d = cfg.depts.filter(function (x) { return x.id === deptId; })[0]; if (!d) throw new Error('No such department.');
  var role = dpRole_(cfg, who, deptId); if (!role) throw new Error('You are not in this department.');
  return { who: who, cfg: cfg, d: d, role: role };
}
function dpCurr(token, deptId) {
  var g = dcGate_(token, deptId), d = g.d, cfg = g.cfg, cat = dpCatalog_(), inD = {};
  Object.keys(cat).forEach(function (id) { if (dpIn_(d, id, cfg.moves)) inD[id] = 1; });
  var rev = {}, now = Date.now(), iso = function (v) { try { return v ? (v instanceof Date ? v : new Date(v)).getTime() : 0; } catch (e) { return 0; } };
  try { cgRows_(cgTab_()).forEach(function (r) { var id = String(r[0]); if (!inD[id]) return;
    var st = String(r[4] || ''), first = iso(r[2]), chg = iso(r[3]);
    rev[id] = { s: st, note: String(r[5] || ''), by: String(r[6] || ''), at: iso(r[7]), changed: !!(st && String(r[8] || '') && String(r[8]) !== String(r[1])), isNew: !!(first && now - first < 14 * 864e5), recent: !!(chg && now - chg < 14 * 864e5) }; }); } catch (e) {}
  var reports = {}; try { (sgReports(token).reports || []).forEach(function (x) { if (inD[x.skill]) reports[x.skill] = (reports[x.skill] || 0) + x.n; }); } catch (e) {}
  var miss = {}; try { (sgStuckSpots(token).rows || []).forEach(function (x) { if (inD[x.skill] && (!miss[x.skill] || x.missPct > miss[x.skill])) miss[x.skill] = x.missPct; }); } catch (e) {}
  var fixes = {}; try { (typeof DT_FIXES !== 'undefined' ? DT_FIXES : []).forEach(function (f) { if (f.skill && inD[f.skill]) fixes[f.skill] = f.text; }); } catch (e) {}
  var url = ''; try { url = ScriptApp.getService().getUrl(); } catch (e) {}
  return { dept: d.id, role: g.role, canReview: g.role === 'hos' || g.role === 'head', rev: rev, reports: reports, miss: miss, fixes: fixes, url: url };
}
/* status: 'ok' (approved) | 'rebbe' (rebbe-checked) | 'flag' (needs fixing, note required) | '' (clear). Head of School or this department's head. */
function dpReview(token, deptId, skill, status, note) {
  var g = dcGate_(token, deptId);
  if (!(g.role === 'hos' || g.role === 'head')) throw new Error('Only the department head or the Head of School can approve or flag lessons.');
  skill = String(skill || '').slice(0, 60); if (!/^[A-Z]+\.[A-Za-z0-9.]+$/.test(skill) || !dpIn_(g.d, skill, g.cfg.moves)) throw new Error('That lesson is not in this department.');
  status = String(status || ''); if (['', 'ok', 'rebbe', 'flag'].indexOf(status) < 0) throw new Error('Unknown status.');
  note = String(note == null ? '' : note).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, 500);
  if (status === 'flag' && note.length < 3) throw new Error('Write what needs fixing.');
  var hash = ''; try { cgRows_(cgTab_()).forEach(function (r) { if (String(r[0]) === skill) hash = String(r[1] || ''); }); } catch (e) {}
  cgReview(token, skill, status, note, hash);
  return dpCurr(token, deptId);
}
/* NICHE departments (Head of School 2026-11-18: "department heads are people who create and maintain the age group of topic or one particular
   niche"). The Head of School makes a department for one person's area. Its rules are ALL required together (AND):
   subjects (the Departments.js families), a grade range, and/or lesson-code prefixes (e.g. LK.TRY for the Taryag Quest, MATH.FRAC for fractions).
   Example: "Kindergarten Math" = subject MATH + grades K to K. Stored with the other setup in TL_DEPTS (cfg.extra), so Departments.js shows it
   everywhere like the 11 starting departments. Retiring hides it (nothing is deleted). Calls (API_ALLOW): dpDeptAdd, dpDeptRetire. */
var DC_FAMS = ['LK', 'MATH', 'READ', 'SCI', 'SOC', 'ELEC', 'HEART'];
function dpDeptAdd(token, a) {
  var who = dpWho_(token); if (!who.head) throw new Error('Only the Head of School can make a department.');
  a = a || {}; var clip = function (s, n) { return String(s == null ? '' : s).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n); };
  var name = clip(a.name, 40); if (name.length < 2) throw new Error('Give the department a name.');
  var subj = (Array.isArray(a.subj) ? a.subj : []).map(String).filter(function (x) { return DC_FAMS.indexOf(x) >= 0; });
  var gn = function (v) { if (v === '' || v == null) return null; var n = Number(v); return n >= 0 && n <= 8 ? Math.floor(n) : null; };
  var g0 = gn(a.g0), g1 = gn(a.g1); if (g0 == null && g1 != null) g0 = g1; if (g1 == null && g0 != null) g1 = g0; if (g0 != null && g1 < g0) { var t = g0; g0 = g1; g1 = t; }
  var pre = String(a.pre || '').toUpperCase().split(/[\s,]+/).filter(function (p) { return /^[A-Z]+(\.[A-Z0-9]+)*$/.test(p); }).slice(0, 10);
  if (!subj.length && g0 == null && !pre.length) throw new Error('Pick a subject, a grade range or a lesson code.');
  var cfg = dpCfg_(); if (cfg.extra.length >= 40) throw new Error('Too many departments.');
  if (cfg.depts.some(function (d) { return d.name.toLowerCase() === name.toLowerCase(); })) throw new Error('There is already a department with that name.');
  cfg.extra.push({ id: 'N' + Date.now().toString(36).toUpperCase(), name: name, icon: clip(a.icon, 4) || '⭐', grades: g0 == null ? null : [g0, g1], subj: subj.length ? subj : null, pre: pre.length ? pre : null, and: true, goal: clip(a.goal, 120) || 'A focused area.' });
  dpSaveCfg_(cfg);
  return dpAdmin(token);
}
function dpDeptRetire(token, id) {
  var who = dpWho_(token); if (!who.head) throw new Error('Only the Head of School can remove a department.');
  var cfg = dpCfg_(); id = String(id || '');
  if (!cfg.extra.some(function (d) { return d.id === id; })) throw new Error('Only departments you made can be removed here.');
  cfg.retired = cfg.retired || {}; cfg.retired[id] = 1; dpSaveCfg_(cfg);
  return dpAdmin(token);
}
