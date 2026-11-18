/* LEARN BY LEVEL, server helper (Head of School DECISION 2026-11-18 2245-ET: "ok" to the LEARN-BY-LEVEL spec and the age-worlds addendum).
   Claude Code builder. For the home (HomeFocus, firebase builder): one call tells the page, for the signed-in boy,
     - his WORLD (the look): chosen by his roster grade, never by level   (K-1 Little Explorers, 2-3 Adventurers, 4-5 Trailblazers, 6-8 Navigators)
     - his OPEN SUBJECTS: chosen by grade (LBL.GRADES), plus any subject staff opened for him, plus Chumash in grade 2 once Kriyah is complete
     - his LEVEL in each open subject: staff placement, else his Pathfinder result, else his grade's own level (source says which)
     - TODAY: at most 3 subjects (K-2: Kodesh, Math, Reading; 3-8: a daily rotation)
   Read only (no writes) except lblSetOpen (staff). No money, mastery, evidence or placement changes. Hidden subjects are simply not listed:
   the page must not show anything outside plan.open, and nothing above plan.levels[k].level. */
var LBL = {
  GRADES: {   /* grade (0 = K) -> open subjects. Keys = the home page's subject keys. */
    0: { kod: ['KRI'], gen: ['MATH', 'READ'] },
    1: { kod: ['KRI'], gen: ['MATH', 'READ'] },
    2: { kod: ['KRI'], gen: ['MATH', 'READ', 'WRIT'], chumashAfterKriyah: true },
    3: { kod: ['CHU', 'RAS'], gen: ['MATH', 'READ', 'WRIT'] },
    4: { kod: ['CHU', 'RAS', 'MSH'], gen: ['MATH', 'READ', 'WRIT', 'SCI'] },
    5: { kod: ['CHU', 'RAS', 'MSH', 'GEM'], gen: ['MATH', 'READ', 'WRIT', 'SCI', 'SS'] },
    6: { kod: ['CHU', 'RAS', 'MSH', 'GEM'], gen: ['MATH', 'READ', 'WRIT', 'SCI', 'SS'] },
    7: { kod: ['CHU', 'RAS', 'MSH', 'GEM', 'NAV'], gen: ['MATH', 'READ', 'WRIT', 'SCI', 'SS', 'COMP', 'ARTS', 'NUC', 'SPARK', 'VOC', 'LIFE', 'FF'] },
    8: { kod: ['CHU', 'RAS', 'MSH', 'GEM', 'NAV'], gen: ['MATH', 'READ', 'WRIT', 'SCI', 'SS', 'COMP', 'ARTS', 'NUC', 'SPARK', 'VOC', 'LIFE', 'FF'] }
  },
  /* only when assigned (Library) or opened by staff for one boy; seasonal Yomim Tovim is the page's job */
  ASSIGNED_ONLY: ['LSH', 'HAL', 'TEF', 'YT', 'MID', 'PAR', 'CHEM', 'TRY', 'HM', 'SIM'],
  WORLDS: [
    { key: 'explorers', name: 'Little Explorers', grades: [0, 1], reading: 'none', buttons: 'huge' },
    { key: 'adventurers', name: 'Adventurers', grades: [2, 3], reading: 'short', buttons: 'large' },
    { key: 'trailblazers', name: 'Trailblazers', grades: [4, 5], reading: 'full', buttons: 'normal' },
    { key: 'navigators', name: 'Navigators', grades: [6, 7, 8], reading: 'full', buttons: 'compact' }
  ],
  KOD_STRANDS: { KRI: 'KRI', CHU: 'CHU', RAS: 'RAS', MSH: 'MSH', GEM: 'GEM' },   /* subject key -> Kodesh Pathfinder strand */
  PROP: 'LBL_OPEN'   /* script property: {sid: [subject keys staff opened for him]} */
};
function lblWorld_(grade) { var g = grade == null ? null : Number(grade); for (var i = 0; i < LBL.WORLDS.length; i++) if (LBL.WORLDS[i].grades.indexOf(g) >= 0) return LBL.WORLDS[i]; return null; }
function lblOpenMap_() { try { return JSON.parse(PropertiesService.getScriptProperties().getProperty(LBL.PROP) || '{}') || {}; } catch (e) { return {}; } }
function lblDay_(now) { var d = new Date(now || Date.now()); return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 864e5); }
function lblPlanFor_(sid, now) {
  sid = String(sid || '');
  /* v2 (section 3, GETTING EACH BOY'S GRADE RIGHT): only the STAFF roster grade counts. A grade the boy gave (his first-sign-in answer,
     or the grade he typed in the Pathfinder) is UNCONFIRMED: it picks the look (world) only. Subjects and levels then come from the
     kindergarten row of LBL.GRADES plus his placements, so an unconfirmed grade can never open anything above what staff allow. */
  var grade = lblRosterGrade_(sid), unconfirmed = null;
  if (grade == null) unconfirmed = lblUnconfirmedGrade_(sid);
  if (grade == null && unconfirmed == null) return { sid: sid, grade: null, world: null, open: [], today: [], levels: {}, askGrade: !lblAskMap_()[sid], gradeUnconfirmed: false, problem: 'no grade on file: staff please set his grade (Student Lookup)' };
  var world = lblWorld_(grade != null ? grade : unconfirmed);
  if (grade == null) grade = 0;
  var G = LBL.GRADES[grade];
  var prof = { kodesh: null, general: {} }; try { prof = pfdProfiles_(sid, { general: ['MATH', 'READ', 'LANG'] }); } catch (e) {}
  var strands = (prof.kodesh && prof.kodesh.profile && prof.kodesh.profile.strands) || {};
  var place = {}; try { place = (plPlacements_() || {})[sid] || {}; } catch (e) {}
  var kp = {}; try { kp = typeof libKodeshPlace_ === 'function' ? (libKodeshPlace_(sid) || {}) : {}; } catch (e) {}
  var kod = G.kod.slice(), gen = G.gen.slice();
  var kriDone = !!(strands.KRI && (strands.KRI.complete || (strands.KRI.level != null && typeof PFK !== 'undefined' && strands.KRI.level >= PFK.KRI_TOP)));
  if (G.chumashAfterKriyah && kriDone) kod = ['CHU'];   /* grade 2: Kriyah complete -> his Kodesh time goes to Chumash */
  var extra = (lblOpenMap_()[sid] || []).filter(function (k) { return kod.indexOf(k) < 0 && gen.indexOf(k) < 0; });
  var open = kod.concat(gen, extra);
  var levels = {};
  open.forEach(function (k) {
    var st = LBL.KOD_STRANDS[k];
    if (place[k] && place[k].level) levels[k] = { level: place[k].level, source: 'staff placement' };
    else if (st && kp[st] && kp[st].level != null) levels[k] = { level: Number(kp[st].level), source: 'staff placement' };
    else if (st && strands[st] && strands[st].level != null) levels[k] = { level: Number(strands[st].level), source: 'Pathfinder' };
    else if (prof.general[k] && prof.general[k].level) levels[k] = { level: prof.general[k].level, source: 'Pathfinder' };
    else levels[k] = { level: grade + 1, source: 'grade' };   /* Level 1 = kindergarten */
  });
  var day = lblDay_(now), today;
  if (grade <= 2) today = [kod[0], 'MATH', 'READ'];
  else {
    var rest = gen.filter(function (k) { return k !== 'MATH'; }).concat(extra);
    today = [kod[day % kod.length], 'MATH', rest.length ? rest[day % rest.length] : null];
  }
  today = today.filter(function (k, i, a) { return k && open.indexOf(k) >= 0 && a.indexOf(k) === i; }).slice(0, 3);
  var out = { sid: sid, grade: unconfirmed == null ? grade : null, world: world, open: open, kodesh: kod, general: gen, extra: extra, today: today, levels: levels, kriyahComplete: kriDone, gradeUnconfirmed: unconfirmed != null };
  if (unconfirmed != null) { out.lookGrade = unconfirmed; out.problem = 'grade not confirmed: staff please confirm it (Grades to confirm)'; }
  return out;
}
/* v2 grade sources. Roster note "grade K".."grade 8" = staff truth (Student Lookup, Class lists, Grades to confirm write it). */
function lblGradeNum_(g) { g = String(g == null ? '' : g).toUpperCase().trim(); if (g === 'K' || g === 'KG' || g === '0') return 0; var n = Number(g); return (g !== '' && Math.round(n) === n && n >= 0 && n <= 8) ? n : null; }
function lblRosterGrade_(sid) {
  try { var r = msRows_('roster').filter(function (x) { return String(x[0]) === String(sid) && x[7] !== false; })[0]; if (!r) return null;
    var m = /grade\s+(K|\d)/i.exec(String(r[8] || '')); return m ? lblGradeNum_(m[1]) : null; } catch (e) { return null; }
}
function lblAskMap_() { try { return JSON.parse(PropertiesService.getScriptProperties().getProperty('LBL_GRADE_ASK') || '{}') || {}; } catch (e) { return {}; } }
function lblUnconfirmedGrade_(sid) {
  var a = lblAskMap_()[sid]; if (a && lblGradeNum_(a.g) != null) return lblGradeNum_(a.g);
  var g = null; try { g = typeof pfGrade_ === 'function' ? pfGrade_({ id: sid }, null) : null; } catch (e) { g = null; }
  return (g == null || g === '') ? null : lblGradeNum_(g);
}
/* the boy's page */
function lblPlan(token) {
  var s = msSession_(token); if (!s || s.role !== 'kid' || !s.sid) throw new Error('Please sign in again.');
  return lblPlanFor_(s.sid);
}
/* staff: see any boy's plan (Student Lookup can show it) and open/close one subject for one boy */
function lblPlanStaff(token, sid) { sgStaff_(token); tlGuard_(token, sid); return lblPlanFor_(sid); }
function lblSetOpen(token, sid, key, on) {
  var s = sgStaff_(token); sid = String(sid || ''); key = String(key || '').toUpperCase(); tlGuard_(token, sid);
  var known = {}; Object.keys(LBL.GRADES).forEach(function (g) { LBL.GRADES[g].kod.concat(LBL.GRADES[g].gen).forEach(function (k) { known[k] = 1; }); }); LBL.ASSIGNED_ONLY.forEach(function (k) { known[k] = 1; });
  if (!known[key]) throw new Error('Unknown subject.');
  return sgLock_(function () {
    var m = lblOpenMap_(), list = (m[sid] || []).filter(function (k) { return k !== key; });
    if (on) list.push(key);
    if (list.length) m[sid] = list; else delete m[sid];
    PropertiesService.getScriptProperties().setProperty(LBL.PROP, JSON.stringify(m));
    return { sid: sid, open: list, by: (s.who && s.who.name) || 'staff' };
  });
}
