/* ===== CoreChecks.js: CORE GROWTH UNIT CHECKS AND TEST-OUT, the server (job T, T-5, 2026-11-24). The boy's screens are src/CoreUnits.html.
   Prompt section 3, step 2: before a unit, a short PRE-CHECK; a skill he already has is "shown" and he skips it ("No boy sits through what he
   already knows"). After the unit, a UNIT CHECK (the "boss level"): passing opens the next unit; a miss sends him to exactly the small skill.
   Storage: one tab, CU_Results, one row per boy per unit.
   Calls (API_ALLOW):
     cuSave(token, unitId, kind, result)   the signed-in boy: kind 'pre' (result.shown = skill ids he showed he knows) or 'check'
                                           (result.right / result.total, result.missed = skill ids). Kid tokens only.
     cuMine(token)                         the signed-in boy: his rows (which pre-checks are done, which units are passed)
   The pre-check's "shown" skills are taken out of his path in plPlanFor_ (Placement.js), the same way the Pathfinder level check skips known
   skills (PathfinderLevel.js pfLcPlanPatch_). Nothing is marked mastered, and NO MONEY is paid for a pre-check or a unit check (any money for
   them needs a Head of School DECISION). Switch: CU_LIVE 'test' (TEST- boys only, the default until the HoS sees it), 'on', or 'off'. */
var CU_LIVE = 'test';
var CU = { TAB: 'CU_Results', HEAD: ['student_id', 'unit_id', 'pre_done', 'shown_json', 'check_passed', 'check_right', 'check_total', 'missed_json', 'tries', 'updated_at'], PASS: 0.8 };

function cuOn_(sid) { if (CU_LIVE === 'off') return false; if (CU_LIVE === 'on') return true; try { return msIsTest_(String(sid)); } catch (e) { return /^TEST-/.test(String(sid)); } }
function cuTab_() { var ss = msBook_(), sh = ss.getSheetByName(CU.TAB); if (!sh) { sh = ss.insertSheet(CU.TAB); sh.getRange(1, 1, 1, CU.HEAD.length).setValues([CU.HEAD]); } return sh; }
function cuRows_() { var sh = cuTab_(), n = sh.getLastRow(); return n < 2 ? [] : sh.getRange(2, 1, n - 1, CU.HEAD.length).getValues(); }
function cuJson_(t, d) { try { return JSON.parse(t || '') || d; } catch (e) { return d; } }
function cuKid_(token) { var s = msSession_(token); if (!s || s.role !== 'kid' || !s.sid) throw new Error('This is for students only.'); return String(s.sid); }
function cuOkUnit_(id) { id = String(id || ''); if (!/^[A-Z][A-Z0-9]*\.U\d{2}$/.test(id)) throw new Error('Unknown unit.'); return id; }
function cuIds_(a) { return (Array.isArray(a) ? a : []).map(String).filter(function (x) { return /^(READ|LANG|WRIT|SCI)\.[A-Z]+\.L\d\d\.\d\d(\.[a-z])?$/.test(x); }).slice(0, 12); }   /* a unit has at most 12 skills */
function cuRow_(r) { return { unit: String(r[1]), pre: !!Number(r[2]), shown: cuJson_(r[3], []), passed: !!Number(r[4]), right: Number(r[5]) || 0, total: Number(r[6]) || 0, missed: cuJson_(r[7], []), tries: Number(r[8]) || 0, at: r[9] ? new Date(r[9]).getTime() : 0 }; }

function cuSave(token, unitId, kind, result) {
  var sid = cuKid_(token); unitId = cuOkUnit_(unitId); result = result || {};
  if (kind !== 'pre' && kind !== 'check') throw new Error('Unknown check.');
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = cuTab_(), rows = cuRows_(), at = -1;
    for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === sid && String(rows[i][1]) === unitId) { at = i; break; }
    var r = at >= 0 ? rows[at].slice() : [sid, unitId, 0, '[]', 0, 0, 0, '[]', 0, ''];
    if (kind === 'pre') { if (Number(r[2])) return { ok: true, row: cuRow_(r), already: true };   /* one pre-check per unit: no fishing for skips */
      if (at < 0 && rows.filter(function (x) { return String(x[0]) === sid && Number(x[2]); }).length >= 60) throw new Error('Too many pre-checks.');   /* a cap, so skips cannot be piled up without end */
      r[2] = 1; r[3] = JSON.stringify(cuIds_(result.shown)); }
    else { var tot = Math.max(1, Math.min(30, Math.round(Number(result.total) || 0))), right = Math.max(0, Math.min(tot, Math.round(Number(result.right) || 0)));
      var passed = right / tot >= CU.PASS; r[4] = (Number(r[4]) || passed) ? 1 : 0; r[5] = right; r[6] = tot; r[7] = JSON.stringify(passed ? [] : cuIds_(result.missed)); r[8] = (Number(r[8]) || 0) + 1; }
    r[9] = new Date();
    if (at >= 0) sh.getRange(at + 2, 1, 1, CU.HEAD.length).setValues([r]); else sh.appendRow(r);
    return { ok: true, row: cuRow_(r) };
  } finally { lock.releaseLock(); }
}

function cuMine(token) {
  var sid = cuKid_(token), out = {};
  cuRows_().forEach(function (r) { if (String(r[0]) === sid) out[String(r[1])] = cuRow_(r); });
  return { ok: true, live: cuOn_(sid), units: out };
}

/* Called by plPlanFor_ (Placement.js): skills he SHOWED in a pre-check leave his path. A skill he missed in a unit check is never skipped. */
function coreUnitPlanPatch_(sid, out) {
  if (!cuOn_(sid)) return;
  var shown = {}, missed = {};
  cuRows_().forEach(function (r) { if (String(r[0]) !== String(sid)) return; cuJson_(r[3], []).forEach(function (id) { shown[id] = 1; }); cuJson_(r[7], []).forEach(function (id) { missed[id] = 1; }); });
  Object.keys(missed).forEach(function (id) { delete shown[id]; });
  if (!Object.keys(shown).length) return;
  ['READ', 'WRIT', 'SCI'].forEach(function (k) { var o = out[k]; if (!o || !o.path || !o.path.length) return;
    var path = o.path.filter(function (id) { return !shown[id]; }); if (path.length === o.path.length || !path.length) return;
    o.skippedShown = (o.skippedShown || 0) + (o.path.length - path.length); o.path = path; if (shown[o.start]) o.start = path[0]; });
}
