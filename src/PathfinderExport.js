/* PathfinderExport.js — PF-BUILD-V8 Stage 9: the staff "Export today" button (HoS DECISION 1634-ET; PF-LIVE-RUN1 daily routine).
   Claude Code builder (PF-BUILD-V8 claim 1853-ET), 2026-11-16. Read only: nothing here writes, pays or places.
   pfExportToday(token[, day]) returns the day's five CSVs for pf_pilot_analyze_v6.js --live, with APP CODES ONLY (student ids, never names):
     devices.csv    device,passed
     timings.csv    code,band,sitting,minutes
     items.csv      item_id,seen,right
     placement.csv  code,subject,placed_level,first_lesson_level,first_skill_status
     day1.csv       code,started_lesson_same_day
   day = 'yyyy-MM-dd' (school time zone); default today. Staff only (pfStaff_), limited to the boys this staff member may see. */
var PFX = { TZ: 'America/New_York' };

function pfxDay_(d) { return Utilities.formatDate(d instanceof Date ? d : new Date(d), PFX.TZ, 'yyyy-MM-dd'); }
function pfxCsv_(head, rows) {
  var q = function (v) { v = v == null ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  return [head.join(',')].concat(rows.map(function (r) { return r.map(q).join(','); })).join('\n') + '\n';
}
function pfxBand_(g) { if (g == null || g === '' || isNaN(Number(g))) return ''; g = Number(g); return g <= 2 ? 'K-2' : g <= 5 ? '3-5' : '6-8'; }
function pfxRows_(name, cols) { var sh = msBook_().getSheetByName(name); if (!sh) return []; var n = sh.getLastRow(); return n < 2 ? [] : sh.getRange(2, 1, n - 1, cols).getValues(); }

function pfExportToday(token, day) {
  pfStaff_(token);
  day = String(day || '') || pfxDay_(new Date());
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error('Pick a day like 2026-11-17.');
  var see = {}; msRoster_().forEach(function (r) { see[r.id] = 1; });   /* Access.js scope: only boys this staff member may see */
  var ok = function (sid) { return !!see[String(sid)]; };
  var gradeOf = {}, sessGrade = {};
  pfxRows_('PF_Sessions', PF.TABS.sessions.length).forEach(function (v) { if (v[4] !== '' && v[4] != null) sessGrade[String(v[0])] = v[4]; });
  var grade = function (sid, sess) { if (sess && sessGrade[sess] != null) return sessGrade[sess]; if (!(sid in gradeOf)) { try { gradeOf[sid] = pfGrade_({ id: sid }, null); } catch (e) { gradeOf[sid] = null; } } return gradeOf[sid]; };

  /* answers today -> items.csv and timings.csv */
  var A = PF.TABS.answers, ix = {}; A.forEach(function (c, i) { ix[c] = i; });
  var items = {}, times = {};
  pfxRows_('PF_Answers', A.length).forEach(function (v) {
    if (!v[ix.at] || pfxDay_(v[ix.at]) !== day) return; var sid = String(v[ix.student_id]); if (!ok(sid)) return;
    var id = String(v[ix.item_id] || ''); if (id) { var it = items[id] = items[id] || [0, 0]; it[0]++; if (v[ix.correct] === true || String(v[ix.correct]).toUpperCase() === 'TRUE' || v[ix.correct] === 1) it[1]++; }
    (times[sid + '|' + v[ix.session_id]] = times[sid + '|' + v[ix.session_id]] || []).push(new Date(v[ix.at]).getTime());
  });
  var gapMs = (PF.SIT && PF.SIT.newSittingGapMin ? PF.SIT.newSittingGapMin : 20) * 60000, timing = [];
  Object.keys(times).forEach(function (k) { var p = k.split('|'), ts = times[k].sort(function (a, b) { return a - b; }), sit = 1, start = ts[0], prev = ts[0];
    for (var i = 1; i <= ts.length; i++) { var t = ts[i]; if (i === ts.length || t - prev > gapMs) { timing.push([p[0], pfxBand_(grade(p[0], p[1])), sit, Math.round((prev - start) / 6000) / 10]); sit++; start = t; } prev = t; } });

  /* results today -> placement.csv (+ who finished today, for day1.csv) */
  var R = PF.TABS.results, rx = {}; R.forEach(function (c, i) { rx[c] = i; });
  var placement = [], finished = {};
  pfxRows_('PF_Results', R.length).forEach(function (v) {
    if (!v[rx.at] || pfxDay_(v[rx.at]) !== day) return; var sid = String(v[rx.student_id]), subj = String(v[rx.subject]); if (!ok(sid) || PF.CORE.indexOf(subj) < 0) return;
    var start = String(v[rx.start_skill] || ''), cls = '';
    try { (JSON.parse(v[rx.skills_json] || '[]') || []).some(function (s) { if (s[0] === start) { cls = String(s[1] || ''); return true; } return false; }); } catch (e) {}
    placement.push([sid, subj, v[rx.level], start ? plMathLevel_(start) : '', cls || (String(v[rx.status]) === 'done' ? 'unknown' : String(v[rx.status]))]);
    var at = new Date(v[rx.at]).getTime(); if (!finished[sid] || at < finished[sid]) finished[sid] = at;
  });

  /* day1.csv: did he start a lesson the same day, after his first Pathfinder result? (MS_Evidence = lesson answers) */
  var started = {};
  try { var ev = msRows_('evidence'); for (var i = ev.length - 1; i >= 0; i--) { var e = ev[i], sid2 = String(e[1]); if (!finished[sid2] || started[sid2]) continue; var t2 = new Date(e[0]).getTime(); if (pfxDay_(e[0]) === day && t2 >= finished[sid2]) started[sid2] = 1; } } catch (x) {}
  var day1 = Object.keys(finished).sort().map(function (sid) { return [sid, started[sid] ? 1 : 0]; });

  /* devices.csv from the sound check report (PF_Sound): a device passed if its last check today passed */
  var dev = {};
  pfxRows_('PF_Sound', typeof PFU !== 'undefined' ? PFU.SOUND_TAB.length : 9).forEach(function (v) { if (!v[0] || pfxDay_(v[0]) !== day) return; var id = String(v[1] || v[2] || ''); if (!id) return; dev[id] = String(v[3]) === 'failed' ? 0 : 1;   /* PathfinderUx: passed | fixed | failed */ });

  return { day: day, files: {
    'devices.csv': pfxCsv_(['device', 'passed'], Object.keys(dev).sort().map(function (k) { return [k, dev[k]]; })),
    'timings.csv': pfxCsv_(['code', 'band', 'sitting', 'minutes'], timing),
    'items.csv': pfxCsv_(['item_id', 'seen', 'right'], Object.keys(items).sort().map(function (k) { return [k, items[k][0], items[k][1]]; })),
    'placement.csv': pfxCsv_(['code', 'subject', 'placed_level', 'first_lesson_level', 'first_skill_status'], placement),
    'day1.csv': pfxCsv_(['code', 'started_lesson_same_day'], day1)
  } };
}
