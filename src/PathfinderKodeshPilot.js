/* PathfinderKodeshPilot.js — PF-BUILD-V8 Stage 8 / 08 PFK build prompt v1.2 Stage K7: the Kodesh pilot exports (PFK-PILOT1).
   Claude Code builder (4cc@), 2026-11-16. READ ONLY: nothing here writes a placement, a profile or money.
   pfkPilotExport(token[, folderId]) returns the CSVs that `node pfk_pilot_analyze.js <folder>` reads, with the exact headers it prints,
   for TEST codes only (app codes, never names), limited to the boys this staff member may see. With a folderId it also writes them
   into a NEW sub-folder there ("PFK pilot export <time>") and returns its id.
     profile.csv    code,grade,strand,raw_level,saved_level      saved_level = the app's automatic level, computed with NO rebbe override
                                                                 (the analyzer re-computes the caps with no override)
     placement.csv  code,strand,saved_level,first_lesson_level,first_skill,start_skill   saved = his level now (a rebbe override wins);
                                                                 first lesson = the first daily-path stop after that placement (PF_Daily
                                                                 first); Kriyah complete has no Kriyah lesson (its time goes to Chumash): no row
     lock.csv       code,grade,strand,level_requested,served     his level, his level + 1 and Level 9, through pfkCanOpenFor_; a boy with a
                                                                 rebbe override is left out (the rebbe opened it by hand; the analyzer cannot judge it)
     timings.csv    code,grade,sitting,minutes                   a new sitting after a 20-minute gap between answers
     answers.csv    code,item_id,right,placed_level
     r2r.csv        code,passage,wcpm,acc,rebbe_level            rebbe_level: yes = the app's level from that reading (the passage if
                                                                 passed, one below if not), lower = -1, higher = +1; "no" = not counted
     clips.csv      clip,recorded
   smiley.csv and rebbe.csv come from staff (the boy's smiley and the rebbe's blind week-2 level), not from here. */
var PFKP = { GAP_MIN: 20 };

function pfkpCsv_(head, rows) {
  var q = function (v) { v = v == null ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  return [head].concat(rows.map(function (r) { return r.map(q).join(','); })).join('\n') + '\n';
}
/* his latest Kodesh profile (PF_Results subject KODESH), or null */
function pfkLatestProfile_(sid, rows) {
  var best = null;
  (rows || pfRows_('results')).forEach(function (v) { if (String(v[2]) !== sid || String(v[3]) !== 'KODESH') return; var d = pfJson_(v[19], null); if (d && d.test === PFK.TEST && d.strands) best = { at: new Date(v[0]).getTime(), session: String(v[1]), profile: d }; });
  return best;
}
/* The server lock (engine pfkCanOpen) for one boy: his latest profile and his grade. A boy with no profile can open nothing here. */
function pfkCanOpenFor_(sid, strand, level, rows) {
  var p = pfkLatestProfile_(String(sid), rows); if (!p) return false;
  var g = null; try { g = pfGrade_({ id: String(sid) }, null); } catch (e) { g = null; }
  return pfkCanOpen_(p.profile, g, String(strand), Number(level));
}

function pfkPilotExport(token, folderId) {
  pfStaff_(token);
  var see = {}; msRoster_().forEach(function (r) { see[r.id] = 1; });
  var res = pfRows_('results'), codes = {};
  res.forEach(function (v) { var sid = String(v[2]); if ((String(v[3]) === 'KODESH' || /^K\./.test(String(v[3]))) && see[sid] && pfIsTest_(sid)) codes[sid] = 1; });
  var gradeOf = function (sid) { try { var g = pfGrade_({ id: sid }, null); return g == null ? '' : g; } catch (e) { return ''; } };
  var profile = [], placement = [], lock = [], timings = [], answers = [], r2r = [], placed = {};
  Object.keys(codes).sort().forEach(function (sid) {
    var g = gradeOf(sid), P = pfkLatestProfile_(sid, res); if (!P) return;
    var S = pfkSessionsOf_(sid).filter(function (x) { return x.id === P.session; })[0] || null, secs = S && S.state && S.state.secs || {};
    placed[sid] = {};
    var D = null; try { D = typeof pfdRead_ === 'function' ? pfdRead_(sid).D : null; } catch (e) { D = null; }   /* read only */
    var auto = P.profile.strands; try { if (S) { var cp = JSON.parse(JSON.stringify(S.state)); cp.override = {}; auto = pfkProfile_(cp, Date.now()).strands; } } catch (e) { auto = P.profile.strands; }
    var hasOv = Object.keys(P.profile.rebbe_override || {}).some(function (k) { return P.profile.rebbe_override[k] && P.profile.rebbe_override[k].level != null; });
    PFK.ORDER.forEach(function (k) {
      var o = P.profile.strands[k] || {}, saved = auto[k] ? auto[k].level : null;
      var sec = secs[k], raw = sec && sec.done && sec.result ? sec.result.level : null;
      if (k === 'KRI' && o.tap !== undefined) raw = Math.max(o.tap == null ? -1 : o.tap, o.rtr == null ? -1 : o.rtr); if (raw === -1) raw = null;
      profile.push([sid, g, k, raw == null ? '' : raw, saved == null ? '' : saved]);
      placed[sid][k] = o.level;
      if (o.level != null && !(k === 'KRI' && o.complete)) {
        var F = D && D.s && D.s[k] && D.s[k].first ? D.s[k].first : null;
        placement.push([sid, k, o.level, F ? F.lv : '', F ? F.skill : '', o.start_skill || '']);
      }
      if (!hasOv) [o.level == null ? 1 : o.level, (o.level || 1) + 1, 9].forEach(function (lv) { lock.push([sid, g, k, lv, pfkCanOpenFor_(sid, k, lv, res) ? 1 : 0]); });
    });
  });
  /* answers and sittings (PF_Answers, section K.<strand>) */
  var A = PF.TABS.answers, ix = {}; A.forEach(function (c, i) { ix[c] = i; });
  var times = {};
  pfRows_('answers').forEach(function (v) { var sid = String(v[ix.student_id]); var sec = String(v[ix.section]); if (!codes[sid] || !/^K\./.test(sec) || sec === 'K.RTR') return;
    var strand = sec.slice(2), id = String(v[ix.item_id]), x = v[ix.correct] === true || v[ix.correct] === 1 || String(v[ix.correct]).toUpperCase() === 'TRUE';
    var pl = placed[sid] && placed[sid][strand]; answers.push([sid, id, x ? 1 : 0, pl == null ? '' : pl]);
    (times[sid] = times[sid] || []).push(new Date(v[ix.at]).getTime()); });
  Object.keys(times).sort().forEach(function (sid) { var ts = times[sid].sort(function (a, b) { return a - b; }), sit = 1, start = ts[0], prev = ts[0], gap = PFKP.GAP_MIN * 60000;
    for (var i = 1; i <= ts.length; i++) { var t = ts[i]; if (i === ts.length || t - prev > gap) { timings.push([sid, gradeOf(sid), sit, Math.round((prev - start) / 6000) / 10]); sit++; start = t; } prev = t; } });
  /* Read to Rebbe (PF_Results K.RTR) */
  res.forEach(function (v) { var sid = String(v[2]); if (String(v[3]) !== 'K.RTR' || !codes[sid]) return; var d = pfJson_(v[19], {}) || {}; if (!d.level) return;
    var app = d.pass ? Number(d.level) : Number(d.level) - 1, says = String(d.rebbe_says || ''), rl = says === 'yes' ? app : says === 'lower' ? app - 1 : says === 'higher' ? app + 1 : null;
    if (rl == null) return; r2r.push([sid, d.level, d.wcpm, d.accuracy, rl]); });
  /* clips */
  var have = pfkClips_(), keys = {}; Object.keys(pfkIx_().byId).forEach(function (id) { var it = pfkIx_().byId[id]; if (it.clip) keys[it.clip] = 1; });
  var clips = Object.keys(keys).sort().map(function (c) { return [c, have[c] ? 1 : 0]; });
  var files = {
    'profile.csv': pfkpCsv_('code,grade,strand,raw_level,saved_level', profile),
    'placement.csv': pfkpCsv_('code,strand,saved_level,first_lesson_level,first_skill,start_skill', placement),
    'lock.csv': pfkpCsv_('code,grade,strand,level_requested,served', lock),
    'timings.csv': pfkpCsv_('code,grade,sitting,minutes', timings),
    'answers.csv': pfkpCsv_('code,item_id,right,placed_level', answers),
    'r2r.csv': pfkpCsv_('code,passage,wcpm,acc,rebbe_level', r2r),
    'clips.csv': pfkpCsv_('clip,recorded', clips)
  };
  var out = { codes: Object.keys(codes).length, files: files };
  if (folderId) {
    var f = DriveApp.getFolderById(String(folderId)).createFolder('PFK pilot export ' + Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd HHmm'));
    Object.keys(files).forEach(function (n) { f.createFile(n, files[n], 'text/csv'); });
    out.folder = f.getId();
  }
  return out;
}
