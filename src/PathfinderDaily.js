/* PATHFINDER STAGE D: the daily path from his profile (blueprint PF-TWO1 by 4cc@, sections 4.4, 4.5, 4.6 and 5; local build).
   BEHIND A HARD FLAG. PFD_LIVE = false: TEST- boys only. For every other boy every function here returns null at the first line,
   before any sheet is read, and the hooks that call it add nothing (no new field, no new row).
   What it does for a TEST boy who has a Pathfinder profile (General and/or Kodesh):
   - 5 the path: one stop per required subject at HIS level in that subject; the stop's lesson is the first skill at that level, in
     curriculum order, that he has not mastered (4.4 start_skill). Kodesh first, then General, the same order every day.
     Minutes per grade band (K-2, 3-5, 6-8) are a SETTING (pfdSettings_; staff change them with pfdSetMinutes), never hard-coded
     anywhere else. The school's subject lists are in the same setting.
   - 5 booster: his weakest strand (furthest below grade; Level = grade + 1) gets one extra 5-minute stop a day, until it is within
     1 level of grade or for 4 weeks, whichever is first. Never more than one booster a day (one booster at a time; a strand that
     had its booster is not boosted again, so the next weakest may start the next day).
   - 4.5 quick climb (first 2 weeks after placement): 5 first-try rights in a row at his level = up one level ("level up" moment);
     3 misses in his first 6 answers at a level = down one level ("let's build this step", never "down"). Never more than 1 level a
     week without the rebbe. A level the rebbe set (Kodesh rebbe_override) or a staff placement (PL_Place by staff) is LOCKED: it is
     never moved; staff see "lessons suggest Level N". A Math/Reading first-lesson check that is still pending (Pathfinder E2,
     pfConfirmPending_) holds the climb for that subject, and a check move counts as that week's move: no double move.
     Adapt.html (fast track = skip the lesson inside a skill; step back = a warm-up) never changes a level, so it is not repeated here.
   - 4.6 the boy never gets a level number: his payload (pfdBoy_) carries skill ids, names and minutes only.
   Storage: PF_Daily (one row per boy: student_id, updated_at, state_json). The profiles are only READ (PF_Results, PL_Place);
   a climb moves the level used by this path only. It never writes PL_Place, PF_Results or a profile.
   NO MONEY: nothing here pays or changes any amount. The server keeps setting every amount, exactly as before. */
/* STAGE 8 (PF-BUILD-V8, HoS 1940-ET; 4cc@ 2026-11-16): Kodesh strands only. Quick climb v2 (PathfinderKodesh.js pfkClimb_, a 90%-sure
   running score) when PFK.CLIMB_ON is on for the boy (TEST boys only now); with it off, a Kodesh "step back" is never made: it only
   shows the rebbe "lessons suggest a step back" (v7.1 item 7). Kodesh age lock = grade level + 1 (grade + 2; PF-TWO1 4.3).
   Kriyah complete (profile KRI.complete, PF-KODESH1): no Kriyah stop; his Kriyah time goes to Chumash. */
var PFD_LIVE = true;   /* the daily path for real boys: ON (Head of School 2026-11-16 "turn it all on", newer than the earlier off). A boy gets a path only once he has a Pathfinder profile or a staff Kodesh placement. false = TEST- boys only. */
var PFD = {
  VERSION: 'pfd-0.1.0',
  PROP: 'PFD_SETTINGS',   /* Script Property: JSON that overrides DEFAULTS (written by pfdSetMinutes, staff only) */
  DEFAULTS: {
    minutes: { 'K-2': 20, '3-5': 35, '6-8': 45 },                                  /* the rebbe sets the minutes (PF-TWO1 5) */
    kodesh: ['KRI', 'HEB', 'CHU', 'RAS', 'MSH', 'GEM'],                            /* the school sets the subjects; Kodesh first */
    general: ['MATH', 'READ', 'LANG'],
    booster: { minutes: 5, days: 28, within: 1, minGap: 2 },
    climb: { days: 14, up: 5, missOf: 6, miss: 3, weekDays: 7 }
  },
  NAMES: { KRI: 'Kriyah', HEB: 'Lashon Hakodesh', CHU: 'Chumash', RAS: 'Rashi', MSH: 'Mishnayos', GEM: 'Gemara', MATH: 'Math', READ: 'Reading', LANG: 'Writing' },
  ICONS: { KRI: '🔤', HEB: '📜', CHU: '📖', RAS: '✒️', MSH: '📚', GEM: '🏛️', MATH: '📐', READ: '📖', LANG: '✒️' },
  PAGE: { MATH: 'MATH', READ: 'READ', LANG: 'WRIT' },                           /* the boy page's world for a General subject */
  COLS: ['student_id', 'updated_at', 'state_json'],
  MAX_EVENTS: 80
};

/* ================================================================== KNOWLEDGE STOP (v385, rabbikhaver-cloud-builder-3, 2026-11-18)
   PF-TWO1 4.5 says the path ends with "the school's other steps (Science or Social Studies)"; it was never built, so new Science
   (Levels 7-8, v383) never reached a boy's day. Head of School 2026-11-17: "do all the stuff that's ready", decisions delegated.
   ONE stop a day, after Writing: Science and Social Studies take turns by day. Placed BY GRADE (no Pathfinder test for these):
   Level = grade + 1 (K = Level 1; grade 6 = Science Level 7; grade 7 = Science Level 8), or the staff placement (Placement / Command
   Center) when a teacher set one. Built fresh each day and NOT stored in his state: no climb, booster or age lock touches it.
   Grade unknown = no knowledge stop (exactly as before). No money. */
PFD.NAMES.SCI = 'Science'; PFD.NAMES.SOC = 'Social Studies'; PFD.ICONS.SCI = '🔬'; PFD.ICONS.SOC = '🗺️'; PFD.PAGE.SCI = 'SCI'; PFD.PAGE.SOC = 'SS';
var PFD_PLACE_ = null;   /* this boy's PL_Place row, set by pfdState_ for the request (never saved) */
function pfdKnowledgeStop_(skills, grade, now) {
  if (grade == null || grade === '' || isNaN(Number(grade))) return null;
  var d = new Date(now), day = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 1)) / 86400000);
  var order = day % 2 === 0 ? ['SCI', 'SOC'] : ['SOC', 'SCI'];
  for (var i = 0; i < order.length; i++) { var k = order[i]; if (!pfdLadder_(k).length) continue;
    var pl = PFD_PLACE_ && PFD_PLACE_[k] && PFD_PLACE_[k].level ? PFD_PLACE_[k] : null;
    var lv = pl ? Number(pl.level) : Math.max(1, Number(grade) + 1);
    var t = pfdStop_(k, { level: lv, locked: false }, skills, grade); if (!t.start) continue;   /* everything mastered there: try the other subject */
    t.area = 'general'; t.level = lv; t.name = PFD.NAMES[k]; t.knowledge = 1; t.placedBy = pl ? 'staff' : 'grade'; return t; }
  return null;
}

/* ================================================================== GATE */
function pfdOn_(sid) { if (PFD_LIVE) return true; return typeof pfIsTest_ === 'function' ? pfIsTest_(sid) : /^TEST-/.test(String(sid)); }

/* ================================================================== SETTINGS (one place) */
function pfdSettings_() {
  var s = JSON.parse(JSON.stringify(PFD.DEFAULTS)), o = null;
  try { o = JSON.parse(PropertiesService.getScriptProperties().getProperty(PFD.PROP) || 'null'); } catch (e) { o = null; }
  if (o && typeof o === 'object') {
    if (o.minutes) Object.keys(s.minutes).forEach(function (b) { var m = Number(o.minutes[b]); if (m >= 5 && m <= 120) s.minutes[b] = Math.round(m); });
    if (Array.isArray(o.kodesh)) s.kodesh = o.kodesh.filter(function (k) { return PFD.DEFAULTS.kodesh.indexOf(k) >= 0; });
    if (Array.isArray(o.general)) s.general = o.general.filter(function (k) { return PFD.DEFAULTS.general.indexOf(k) >= 0; });
  }
  return s;
}
function pfdBand_(grade) { var g = grade == null || grade === '' ? null : Number(grade); return g == null || isNaN(g) ? '3-5' : g <= 2 ? 'K-2' : g <= 5 ? '3-5' : '6-8'; }
/* Staff only: the rebbe / school changes the minutes for a grade band. Writes one Script Property; nothing else. */
function pfdSetMinutes(token, band, minutes) {
  var s = typeof pfStaff_ === 'function' ? pfStaff_(token) : null; if (!s) throw new Error('Staff only.');
  if (!PFD.DEFAULTS.minutes.hasOwnProperty(band)) throw new Error('Pick K-2, 3-5 or 6-8.');
  var m = Number(minutes); if (!(m >= 5 && m <= 120)) throw new Error('Minutes: 5 to 120.');
  var p = PropertiesService.getScriptProperties(), o = {}; try { o = JSON.parse(p.getProperty(PFD.PROP) || '{}') || {}; } catch (e) { o = {}; }
  o.minutes = o.minutes || {}; o.minutes[band] = Math.round(m); o.by = typeof pfWho_ === 'function' ? pfWho_(s) : 'staff'; o.at = new Date().toISOString();
  p.setProperty(PFD.PROP, JSON.stringify(o));
  return pfdSettings_();
}

/* ================================================================== PURE HELPERS */
function pfdLv_(id) { var m = /\.L(\d\d)\./.exec(String(id)); return m ? Number(m[1]) : null; }
function pfdArea_(k) { return PFD.DEFAULTS.kodesh.indexOf(k) >= 0 ? 'kodesh' : 'general'; }
function pfdStrandOf_(skill) {
  var id = String(skill || ''), m;
  if (/^HEB\./.test(id)) return 'HEB';
  if ((m = /^LK\.([A-Z]+)\./.exec(id))) return m[1];
  if ((m = /^(MATH|READ|LANG|WRIT)\./.exec(id))) return m[1] === 'WRIT' ? 'LANG' : m[1];
  if ((m = /^(SCI|SS)\./.exec(id))) return m[1] === 'SS' ? 'SOC' : 'SCI';   /* v385 knowledge stop: names only (no D.s strand, so climb skips it) */
  return null;
}
function pfdDayKey_(now) { var d = new Date(now); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
var PFD_LADDER_ = {};
/* the lessons of one subject in curriculum order (Kodesh: the KodeshMore ladders, as the staff Kodesh grid reads them; General: Placement.js) */
function pfdLadder_(k) {
  if (PFD_LADDER_[k]) return PFD_LADDER_[k];
  var L = [];
  try {
    if (pfdArea_(k) === 'kodesh') { var o = typeof sgpKodeshLessons_ === 'function' ? (sgpKodeshLessons_().order || {}) : {}; L = (o[k === 'HEB' ? 'LSH' : k] || []).slice(); }
    else L = typeof pfLadder_ === 'function' ? pfLadder_(k) : ((typeof plList_ === 'function' ? plList_(k) : null) || []).map(function (x) { return x[0]; });
  } catch (e) { L = []; }
  return (PFD_LADDER_[k] = L);
}
function pfdNameOf_(id) {
  try { if (/^(LK|HEB)\./.test(id) && typeof sgpKodeshLessons_ === 'function') { var n = sgpKodeshLessons_().names || {}; if (n[id]) return n[id]; } } catch (e) {}
  try { var k = pfdStrandOf_(id), L = typeof plList_ === 'function' ? plList_(k) : null, r = (L || []).filter(function (x) { return x[0] === id; })[0]; if (r) return r[1]; } catch (e) {}
  return id;
}
function pfdHasLevel_(k, lv) { return pfdLadder_(k).some(function (id) { return pfdLv_(id) === lv; }); }
/* the level whose lessons he plays: his level, or (when the ladder has no lessons there, e.g. Rashi starts at Level 3) the nearest level
   that has lessons, above first. Staff see both. */
function pfdEff_(k, lv) {
  if (lv == null || pfdHasLevel_(k, lv)) return lv;
  for (var d = 1; d <= 9; d++) { if (pfdHasLevel_(k, lv + d)) return lv + d; if (lv - d >= 1 && pfdHasLevel_(k, lv - d)) return lv - d; }
  return lv;
}
/* the stop for one strand: the first not-mastered skill at his level (curriculum order); ids = what is left at his level, then
   (unless his level is locked or at the age lock) the level above, so the page can go on during the day without a new trip */
function pfdStop_(k, S, skills, grade) {
  var L = pfdLadder_(k), done = function (id) { return !!(skills && skills[id] && skills[id].m); };
  var ev = pfdEff_(k, S.level), at = L.filter(function (id) { return pfdLv_(id) === ev; }), cap = pfdArea_(k) === 'kodesh' && grade != null ? grade + 2 : 99;
  var up = !S.locked && ev + 1 <= cap ? L.filter(function (id) { return pfdLv_(id) === ev + 1; }) : [];
  var left = at.filter(function (id) { return !done(id); }), ids = left.concat(up.filter(function (id) { return !done(id); })).slice(0, 12);
  return { k: k, start: ids[0] || null, ids: ids, atLevelLeft: left.length, atLevel: at.length, lessonsAt: ev };
}

/* ================================================================== STATE (pure: D is the PF_Daily state of one boy) */
function pfdEvent_(D, now, k, kind, text, extra) {
  var e = { at: now, k: k, kind: kind, text: text }; if (extra) Object.keys(extra).forEach(function (x) { e[x] = extra[x]; });
  D.ev = (D.ev || []).concat([e]).slice(-PFD.MAX_EVENTS); return e;
}
/* prof = {kodesh: {at, profile} | null, general: {K: {at, level}}}; place = PL_Place of this boy; hold = subjects with a pending check */
function pfdSync_(D, prof, place, hold, set, now, kp) {
  D.s = D.s || {}; D.ev = D.ev || []; D.v = 1;
  var want = {};
  if (prof.kodesh && prof.kodesh.profile && prof.kodesh.profile.strands) {
    var P = prof.kodesh.profile, ovs = P.rebbe_override || {};
    set.kodesh.forEach(function (k) { var o = P.strands[k]; if (!o || o.level == null) return; var ov = ovs[k] && ovs[k].level != null ? ovs[k] : null;
      want[k] = { done: k === 'KRI' && !!o.complete && !ov, level: Number(o.level), at: prof.kodesh.at, locked: !!ov, lockBy: ov ? (ov.by || 'the rebbe') : '', stamp: 'K' + o.level + '|' + (ov ? ov.level + '@' + (ov.at || '') : ''), src: ov ? 'rebbe' : 'profile', profileAt: prof.kodesh.at }; });
  }
  Object.keys(kp || {}).forEach(function (k) { if (set.kodesh.indexOf(k) < 0) return; var x = kp[k]; if (!x || !x.level) return;   /* LIBRARY: staff placement = locked, like a rebbe override */
    want[k] = { level: Number(x.level), at: x.at || now, locked: true, lockBy: x.by || 'staff', stamp: 'S' + x.level + '@' + (x.at || ''), src: 'staff', profileAt: x.at || now }; });
  set.general.forEach(function (k) { var g = prof.general && prof.general[k]; if (!g || g.level == null) return;
    var pl = place && place[k] && place[k].level ? place[k] : null, staff = pl && !/^pathfinder/.test(String(pl.by || ''));
    var lv = pl ? Number(pl.level) : Number(g.level);
    want[k] = { level: lv, at: g.at, locked: !!staff, lockBy: staff ? String(pl.by) : '', stamp: 'G' + lv + '|' + (pl ? pl.by + '@' + pl.at : ''), src: staff ? 'staff' : pl && String(pl.by) === 'pathfinder-hd' ? 'hd' : pl && Number(pl.level) !== Number(g.level) ? 'check' : 'profile', profileAt: g.at }; });
  Object.keys(D.s).forEach(function (k) { if (!want[k]) { pfdEvent_(D, now, k, 'removed', 'no profile level now'); delete D.s[k]; } });
  Object.keys(want).forEach(function (k) {
    var w = want[k], S = D.s[k];
    if (!S || (S.stamp !== w.stamp && w.src === 'profile')) {
      /* first time, or a NEW Pathfinder result (retake, or the rebbe cleared his lock): start fresh from it */
      D.s[k] = { area: pfdArea_(k), level: w.level, placed: w.level, placedAt: w.at || now, profileAt: w.profileAt, stamp: w.stamp, locked: w.locked, lockBy: w.lockBy, moves: [], run: 0, n: 0, miss: 0, suggest: null };
      pfdEvent_(D, now, k, 'placed', 'path starts at his profile level', { to: w.level, locked: w.locked });
    } else if (S.stamp !== w.stamp) {
      /* the profile or placement changed under him: a rebbe/staff level (locked), or the Pathfinder first-lesson check moved it */
      var why = w.src === 'rebbe' || w.src === 'staff' ? 'rebbe' : w.src === 'check' || w.src === 'hd' ? 'check' : 'profile';   /* v7.2: a rule HD move counts as the week's move */
      if (S.level !== w.level) S.moves.push({ at: now, from: S.level, to: w.level, why: why });
      pfdEvent_(D, now, k, why === 'rebbe' ? 'set by staff' : w.src === 'hd' ? 'rule HD' : why === 'check' ? 'first-lesson check' : 'profile', w.locked ? 'level locked by ' + w.lockBy : 'level from ' + (w.src === 'hd' ? 'rule HD (weekly re-place)' : why), { from: S.level, to: w.level, locked: w.locked });
      S.level = w.level; S.stamp = w.stamp; S.locked = w.locked; S.lockBy = w.lockBy; S.profileAt = w.profileAt; S.run = 0; S.n = 0; S.miss = 0; S.suggest = null;
    }
    D.s[k].hold = hold && hold.indexOf(k) >= 0 ? 'first-lesson check pending' : '';
    if (w.done) D.s[k].done = 'Kriyah complete'; else delete D.s[k].done;
  });
  return D;
}
function pfdWeekMoves_(S, now, set) { return (S.moves || []).filter(function (m) { return (m.why === 'climb' || m.why === 'check') && now - m.at < set.climb.weekDays * 86400000; }).length; }
/* may this strand move one level (dir +1/-1)? returns '' or the reason it may not (then staff see "lessons suggest Level N") */
function pfdBlock_(D, k, dir, grade, set, now, cur) {
  var S = D.s[k], to = (cur == null ? S.level : cur) + dir;
  if (to < 1 || to > 9) return 'end of the ladder';
  if (S.locked) return 'locked by ' + (S.lockBy || 'the rebbe');
  if (pfdWeekMoves_(S, now, set) >= 1) return 'already moved this week';
  if (!pfdHasLevel_(k, to)) return 'no lessons at that level yet';
  if (dir > 0 && S.area === 'kodesh') {
    if (grade != null && to > grade + 2) return 'age lock: grade + 1 needs the rebbe';
    if (k === 'CHU' && D.s.KRI && !D.s.KRI.done && D.s.KRI.level < 4 && to > D.s.KRI.level + 1) return 'capped by Kriyah';   /* not once Kriyah is complete */
    if (k === 'RAS' && D.s.CHU && to > D.s.CHU.level) return 'capped by Chumash';
  }
  return '';
}
/* 4.5: one answer at his level. rows = msSave evidence rows ({skill, phase, ok, first}). Returns the moments for the boy. */
function pfdClimb_(D, rows, grade, set, now, v2) {
  var moments = [];
  (rows || []).forEach(function (r) {
    if (!r || (r.phase !== 'practice' && r.phase !== 'check')) return;
    var k = pfdStrandOf_(r.skill), S = k && D.s[k]; if (!S) return;
    var cur = pfdEff_(k, S.level); if (pfdLv_(r.skill) !== cur) return;   /* only lessons at his level count */
    if (now - (S.placedAt || 0) > set.climb.days * 86400000) { if (!S.steady) { S.steady = now; pfdEvent_(D, now, k, 'steady', 'quick climb over (2 weeks): level is steady'); } return; }
    if (S.hold) return;                                                /* the Pathfinder first-lesson check decides first */
    var right = !!r.ok && !!r.first;
    if (S.area === 'kodesh' && v2 && typeof pfkClimb_ === 'function') {   /* quick climb v2 (engine v1.2) */
      var C = S.c2 = S.c2 || { up: 0, down: 0, n: 0 }, R = PFK.CLIMB, bound = Math.log((1 - R.ERR) / R.ERR);
      C.n++; C.up += right ? Math.log(R.EASY / R.OK) : Math.log((1 - R.EASY) / (1 - R.OK)); C.down += right ? Math.log(R.HARD / R.OK) : Math.log((1 - R.HARD) / (1 - R.OK));
      if (C.up < -bound) C.up = 0; if (C.down < -bound) C.down = 0;
      var d2 = C.down >= bound ? -1 : C.up >= bound ? 1 : 0; if (!d2) return;
      var why2 = pfdBlock_(D, k, d2, grade, set, now, cur), to2 = cur + d2;
      if (why2) { if (why2 !== 'end of the ladder' && S.suggest !== to2) { S.suggest = to2; pfdEvent_(D, now, k, 'suggest', 'lessons suggest Level ' + to2 + ' (' + why2 + ')', { from: cur, to: to2 }); } return; }   /* scores kept, as the engine does */
      S.c2 = { up: 0, down: 0, n: 0 }; S.moves.push({ at: now, from: cur, to: to2, why: 'climb' }); S.suggest = null;
      pfdEvent_(D, now, k, d2 > 0 ? 'climb up' : 'climb down', 'quick climb v2: 90% sure his level is ' + (d2 > 0 ? 'higher' : 'lower'), { from: cur, to: to2 });
      S.level = to2; moments.push({ kind: d2 > 0 ? 'up' : 'build', k: k, name: PFD.NAMES[k] || k }); return;
    }
    S.n++; if (right) S.run++; else { S.run = 0; if (S.n <= set.climb.missOf) S.miss++; }
    var dir = S.run >= set.climb.up ? 1 : (S.n <= set.climb.missOf && S.miss >= set.climb.miss) ? -1 : 0;
    if (!dir) return;
    var why = pfdBlock_(D, k, dir, grade, set, now, cur), to = cur + dir;
    if (!why && dir < 0 && S.area === 'kodesh') { S.run = 0; S.n = 0; S.miss = 0; if (S.suggest !== to) { S.suggest = to; pfdEvent_(D, now, k, 'suggest', 'lessons suggest a step back (Level ' + to + ')', { from: cur, to: to }); } return; }   /* climb v2 off: never a Kodesh move down */
    S.run = 0; S.n = 0; S.miss = 0;
    if (why === 'end of the ladder') return;
    if (why) {
      if (S.suggest !== to) { S.suggest = to; pfdEvent_(D, now, k, 'suggest', 'lessons suggest Level ' + to + ' (' + why + ')', { from: cur, to: to }); }
      return;
    }
    S.moves.push({ at: now, from: cur, to: to, why: 'climb' }); S.suggest = null;
    pfdEvent_(D, now, k, dir > 0 ? 'climb up' : 'climb down', (dir > 0 ? '5 first-try rights in a row' : '3 misses in his first 6 answers') + (cur !== S.level ? ' (his lessons were at Level ' + cur + ')' : ''), { from: cur, to: to });
    S.level = to;
    moments.push({ kind: dir > 0 ? 'up' : 'build', k: k, name: PFD.NAMES[k] || k });
  });
  return moments;
}
/* Normal progress (not a climb): when he has mastered every lesson at his level, his level is the next one, as on any ladder.
   Not for a locked level (staff see "all done at this level"), and never past the age lock or a Kodesh cap. Not counted as a week's move. */
function pfdProgress_(D, skills, grade, set, now) {
  Object.keys(D.s).forEach(function (k) { var S = D.s[k], g = 0;
    while (g++ < 3) { var t = pfdStop_(k, S, skills, grade), cur = pfdEff_(k, S.level);
      if (S.locked || t.atLevel === 0 || t.atLevelLeft > 0) return;
      var why = pfdBlock_(D, k, 1, grade, set, now, cur); if (why && why !== 'already moved this week') return;
      S.moves.push({ at: now, from: cur, to: cur + 1, why: 'finished level' }); pfdEvent_(D, now, k, 'level done', 'mastered every lesson at his level', { from: cur, to: cur + 1 });
      S.level = cur + 1; S.run = 0; S.n = 0; S.miss = 0; if (S.suggest === S.level) S.suggest = null; }
  });
}
/* 5: the booster. At most one at a time (so at most one a day); weakest = furthest below grade level (grade + 1). */
function pfdBooster_(D, grade, set, now) {
  if (grade == null) return null;
  var gl = Number(grade) + 1, B = D.boost;
  if (B) {
    var S = D.s[B.k], why = !S ? 'no level now' : gl - S.level <= set.booster.within ? 'within 1 level of grade' : now - B.start >= set.booster.days * 86400000 ? '4 weeks done' : '';
    if (!why) return B.k;
    D.boosted = D.boosted || {}; D.boosted[B.k] = now; D.boost = null; D.boostEnded = pfdDayKey_(now);
    pfdEvent_(D, now, B.k, 'booster stop', why);
  }
  if (D.boostEnded === pfdDayKey_(now)) return null;                    /* never two boosters in one day */
  var best = null, order = set.kodesh.concat(set.general);
  order.forEach(function (k) { var S = D.s[k]; if (!S || S.done || (D.boosted && D.boosted[k])) return; var gap = gl - S.level;
    if (gap >= set.booster.minGap && (!best || gap > best.gap)) best = { k: k, gap: gap }; });
  if (!best) return null;
  D.boost = { k: best.k, start: now, day: pfdDayKey_(now) };
  pfdEvent_(D, now, best.k, 'booster start', 'weakest strand: ' + best.gap + ' levels below grade level', { level: D.s[best.k].level, gradeLevel: gl });
  return best.k;
}
/* the day's path (staff shape: with levels). Kodesh first, then General, in the setting's order, every day the same. */
function pfdPath_(D, skills, grade, set, now) {
  pfdProgress_(D, skills, grade, set, now);
  var stops = [], bk = pfdBooster_(D, grade, set, now);
  var kriDone = !!(D.s.KRI && D.s.KRI.done);
  set.kodesh.concat(set.general).forEach(function (k) { var S = D.s[k]; if (!S || S.done) return; var t = pfdStop_(k, S, skills, grade);
    t.area = S.area; t.level = S.level; t.name = PFD.NAMES[k]; if (k === 'CHU' && kriDone) t.kriyahTime = 1; stops.push(t);
    if (!S.first && t.start) S.first = { lv: t.lessonsAt, skill: t.start, at: now };   /* his first lesson after this placement (pilot check KJ) */ });
  try { var ks = pfdKnowledgeStop_(skills, grade, now); if (ks) stops.push(ks); } catch (e) {}   /* v385: Science or Social Studies, by grade */
  var booster = null;
  if (bk && D.s[bk]) { booster = pfdStop_(bk, D.s[bk], skills, grade); booster.area = D.s[bk].area; booster.level = D.s[bk].level; booster.name = PFD.NAMES[bk]; booster.booster = 1; }
  return { day: pfdDayKey_(now), band: pfdBand_(grade), total: set.minutes[pfdBand_(grade)], boostMin: set.booster.minutes, stops: stops, booster: booster };
}
/* 4.6: a lesson name as the boy may see it: no "Level 3", no "4-7" step code (staff see the full name) */
function pfdBoyName_(n) { return String(n || '').replace(/\s*\bLevel\s*\d+\b/gi, '').replace(/\s*\b\d+-\d+\b/g, '').replace(/\s+:/g, ':').replace(/^\s*:\s*/, '').trim(); }
/* 4.6: what the boy's page gets. No level numbers, no "below grade": skill ids (for the buttons), names, icons and minutes. */
function pfdBoy_(path, moments) {
  var one = function (t) { var o = { k: t.k, c: t.area === 'kodesh' ? 'LK' : PFD.PAGE[t.k], area: t.area, name: t.name, ic: PFD.ICONS[t.k] || '⭐', ids: t.ids.slice(), names: {} };
    t.ids.forEach(function (id) { o.names[id] = pfdBoyName_(pfdNameOf_(id)); }); if (t.booster) o.booster = 1; return o; };
  var out = { v: 1, day: path.day, total: path.total, boostMin: path.boostMin, stops: path.stops.map(one) };
  if (path.booster) out.booster = one(path.booster);
  if (moments && moments.length) out.moments = moments.map(function (m) { return { kind: m.kind, name: m.name }; });
  return out;
}

/* ================================================================== SHEETS (TEST boys only: never reached for a real boy) */
function pfdTab_() { var ss = msBook_(), sh = ss.getSheetByName('PF_Daily'); if (!sh) { sh = ss.insertSheet('PF_Daily'); sh.getRange(1, 1, 1, PFD.COLS.length).setValues([PFD.COLS]).setFontWeight('bold'); sh.setFrozenRows(1); } return sh; }
function pfdRead_(sid) {
  var sh = pfdTab_(), n = sh.getLastRow(), v = n < 2 ? [] : sh.getRange(2, 1, n - 1, PFD.COLS.length).getValues();
  for (var i = 0; i < v.length; i++) if (String(v[i][0]) === sid) return { row: i + 2, D: pfJson_(v[i][2], {}) };
  return { row: 0, D: {} };
}
function pfdWrite_(sid, R) {
  var sh = pfdTab_(), line = [sid, new Date(), JSON.stringify(R.D)];
  if (R.row) sh.getRange(R.row, 1, 1, PFD.COLS.length).setValues([line]); else { sh.appendRow(line); R.row = sh.getLastRow(); }
}
/* his profiles: the latest Kodesh profile row (subject KODESH, detail test:"kodesh") and the latest General result per subject */
function pfdProfiles_(sid, set) {
  var out = { kodesh: null, general: {} };
  pfRows_('results').forEach(function (v) {
    if (String(v[2]) !== sid || String(v[4]) !== 'done') return;
    var subj = String(v[3]), at = new Date(v[0]).getTime();
    if (subj === 'KODESH') { var d = pfJson_(v[19], null); if (d && d.test === 'kodesh' && d.strands) out.kodesh = { at: at, profile: d }; return; }
    if (set.general.indexOf(subj) >= 0 && String(v[18]) !== 'pathfinder-kodesh' && v[5] !== '' && v[5] != null && !isNaN(Number(v[5]))) out.general[subj] = { at: at, level: Number(v[5]) };
  });
  return out;
}
function pfdGrade_(sid) { try { return typeof pfGrade_ === 'function' ? pfGrade_({ id: sid }, null) : null; } catch (e) { return null; } }
function pfdHold_(sid) { try { return typeof pfConfirmPending_ === 'function' ? pfConfirmPending_(pfSessionsOf_(sid)) : []; } catch (e) { return []; } }
/* load + sync his state. Returns null when he has no profile level at all (then nothing changes for him either). */
function pfdState_(sid, now) {
  var set = pfdSettings_(), prof = pfdProfiles_(sid, set);
  var kp = {}; try { kp = typeof libKodeshPlace_ === 'function' ? (libKodeshPlace_(sid) || {}) : {}; } catch (e) { kp = {}; }   /* LIBRARY: a staff Kodesh placement (Command Center) */
  if (!prof.kodesh && !Object.keys(prof.general).length && !Object.keys(kp).length) return null;
  var R = pfdRead_(sid), place = {}; try { place = (plPlacements_() || {})[sid] || {}; } catch (e) { place = {}; }
  PFD_PLACE_ = place;   /* v385: the knowledge stop reads a staff Science / Social Studies placement from here */
  pfdSync_(R.D, prof, place, pfdHold_(sid), set, now, kp);
  if (!Object.keys(R.D.s).length) return null;
  return { R: R, set: set, grade: pfdGrade_(sid) };
}

/* ================================================================== HOOKS (each called with typeof guards) */
/* msLoad (MiddleSchool.js): the boy's own roster entry gets .pfd. Real boys: null at once. */
function pfdForLoad_(sid, state) {
  sid = String(sid || ''); if (!pfdOn_(sid)) return null;
  try { var now = Date.now(), X = pfdState_(sid, now); if (!X) return null;
    var path = pfdPath_(X.R.D, (state && state.skills) || {}, X.grade, X.set, now); pfdWrite_(sid, X.R);
    return pfdBoy_(path, null);
  } catch (e) { return null; }
}
/* msSave (MiddleSchool.js), after his answers are stored: the quick climb, then today's path. Real boys: null at once. */
function pfdAfterSave_(sid, evIn, state) {
  sid = String(sid || ''); if (!pfdOn_(sid)) return null;
  try { var now = Date.now(), X = pfdState_(sid, now); if (!X) return null;
    pfdProgress_(X.R.D, (state && state.skills) || {}, X.grade, X.set, now);
    var moments = pfdClimb_(X.R.D, typeof pf72HdClimbRows_ === 'function' ? pf72HdClimbRows_(sid, X.grade, evIn) : evIn, X.grade, X.set, now, typeof pfkClimbOn_ === 'function' && pfkClimbOn_(sid))   /* v7.2: rule HD owns Reading/Math for grades 3-8 */, path = pfdPath_(X.R.D, (state && state.skills) || {}, X.grade, X.set, now);
    pfdWrite_(sid, X.R);
    return pfdBoy_(path, moments);
  } catch (e) { return null; }
}
/* the boy page asks again (add-ons loaded after sign-in). Kid token; TEST boys only. */
function pfdToday(token) {
  var s = msSession_(token); if (s.role !== 'kid') return null; if (!pfdOn_(s.sid)) return null;
  var row = typeof msStateRowOf_ === 'function' ? msStateRowOf_(String(s.sid)) : [], st = {}; try { st = row && row[0] ? JSON.parse(row[0][1]) : {}; } catch (e) { st = {}; }
  return pfdForLoad_(s.sid, st);
}
/* staff report (pfReport in Pathfinder.js): numbers for staff only. Real boys: null. */
function pfdReport_(sid) {
  sid = String(sid || ''); if (!pfdOn_(sid)) return null;
  try { var now = Date.now(), X = pfdState_(sid, now); if (!X) return null;
    var row = typeof msStateRowOf_ === 'function' ? msStateRowOf_(sid) : [], st = {}; try { st = row && row[0] ? JSON.parse(row[0][1]) : {}; } catch (e) { st = {}; }
    var path = pfdPath_(X.R.D, st.skills || {}, X.grade, X.set, now); pfdWrite_(sid, X.R);
    var view = pfdStaffView_(X.R.D, path, X.grade, X.set, now); try { if (typeof pf72HdView_ === 'function') pf72HdView_(sid, view); } catch (e) {}   /* v7.2 rule HD: suggestions and moves */
    return view;
  } catch (e) { return { on: true, error: String(e && e.message || e) }; }
}
function pfdStaffView_(D, path, grade, set, now) {
  var one = function (t) { return { k: t.k, name: t.name, kriyahTime: !!t.kriyahTime, level: t.level, start: t.start, startName: t.start ? pfdNameOf_(t.start) : '', left: t.atLevelLeft, lessonsAt: t.lessonsAt, booster: !!t.booster }; };
  var strands = Object.keys(D.s).map(function (k) { var S = D.s[k]; return { k: k, name: PFD.NAMES[k], done: S.done || '', area: S.area, level: S.level, placed: S.placed, locked: !!S.locked, lockBy: S.lockBy || '',
    sure: now - (S.placedAt || 0) > set.climb.days * 86400000 ? 'steady' : 'first look', suggest: S.suggest, hold: S.hold || '', moves: S.moves || [],
    gradeLevel: grade == null ? null : Number(grade) + 1 }; });
  return { on: true, live: PFD_LIVE, version: PFD.VERSION, grade: grade, band: path.band, total: path.total, boostMin: path.boostMin, minutes: set.minutes, day: path.day,
    stops: path.stops.map(one), booster: path.booster ? one(path.booster) : null, boost: D.boost || null, strands: strands, events: (D.ev || []).slice(-30).reverse() };
}
