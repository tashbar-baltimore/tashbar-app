/* PathfinderLevel.js — LEVEL CHECKS AND THE 🎫 LEVEL PASS (Head of School DECISION 2026-11-20: "split the Pathfinder").
   Claude Code builder. Replaces the ONE big placement test:
   (a) STARTING POINT: no big test. A new boy starts from his "Find my levels" checks (Placement.js plCheckSave) or, with none, his
       grade's level (grade + 1, Level 1 = K: KidMap.js kmMapFor_, LearnByLevel.js). Nothing here places a boy.
   (b) LEVEL CHECK: before his FIRST lesson in a Math or Reading level, a short check of that level, built on the old first-lesson
       "confirm" pieces (pfItemOk_, pfPresent_, pfScore_, PF_Answers): about 1 question per built skill there, in teaching order,
       a 2nd question for a skill while the bank has unseen ones and the check is under PF_LC.CAP (10). Scored HERE; the page never
       sees a key. A skill whose questions were ALL right is "already know it": his lineup skips it (kmMapFor_ and plPlanFor_ through
       pfLcPlanPatch_), the same idea as pf72Order_ skipping "solid" skills. It is NOT mastery: nothing is written to his skills, so
       nothing is paid for it. At most ONE check per subject level per boy. The check never moves a level: a staff placement
       (by 'staff') always wins, and the ±1 level a week rules (PathfinderDaily.js, PathfinderPlaceHD.js) are untouched.
       The check pays nothing.
       KODESH IS LEFT OUT: the Kodesh bank (PathfinderBankKodesh.js) is Hebrew tap / listen-and-tap items keyed to sub-skills, with
       recorded clips still missing; it does not fit this simple check cleanly. So Kodesh lessons never have a check and are never cut.
   (c) THE 25¢ RULE = the LEVEL PASS: taking a level's check (any score) gives that level's Level Pass, saved HERE in PF_Passes
       (never trusted from the page). Lesson earnings (Money.js moneyPost_) are cut to PF_REWARD.rate (25%) ONLY for a lesson in a
       Math / Reading level where a check is available (pfLcAvail_) and he has no pass yet (pfLevelRate_). Every other amount is
       paid in full. An applied result of the old big Pathfinder counts as the pass for the level it placed (old results still count).
   (f) kmMapFor_ adds .lc to his map (it rides with sign-in): no extra trip to the server on the way home.
   Storage: PF_Passes (one row per check taken). Answers also go to PF_Answers (phase "level check"). */
var PF_LC = {
  ON: true,
  SUBJ: ['MATH', 'READ'],
  CAP: 10,          /* questions at most */
  MIN: 3,           /* a level with fewer usable questions has no check (and so is never cut) */
  MIN_SKILLS: 2,
  MINUTES: 3,
  FROM_LEVEL: 3,     /* HoS DECISION 2026-11-22: no level check for Levels 1-2 (K-1): its reading-only questions are not right for that age. No check = never cut */
  COLS: ['at', 'student_id', 'subject', 'level', 'check_id', 'items_json', 'values_json', 'marks_json', 'right', 'of', 'known_json', 'by']
};
function pfLcTab_() { if (!PF.TABS.passes) PF.TABS.passes = PF_LC.COLS; return pfTab_('passes'); }
function pfLcSubj_(id) { var m = /^(MATH|READ)\./.exec(String(id || '')); return m ? m[1] : ''; }
/* a question the simple check screen shows faithfully: tap a choice or type an answer, words only (no drawing, no audio-only part) */
function pfLcItemOk_(it, appr) {
  if (!it || (it.fmt !== 'CHOICE' && it.fmt !== 'TYPE') || !pfItemOk_(it, appr)) return false;
  if (it.art || (typeof PF_ART !== 'undefined' && PF_ART[it.id]) || it.pic || it.labels || (it.cmode && it.cmode !== 'text') || it.screenNote) return false;
  if (it.say && pfNorm_(it.say) !== pfNorm_(it.stem)) return false;
  if (it.passage) { var P = PF_BANK.passages[it.passage]; if (!P || P.listen || P.extras) return false; }
  return true;
}
/* the usable questions at one subject level, by built skill in teaching order (pure; memo per request) */
var PF_LC_POOL_ = {};
function pfLcPool_(subj, lvl, appr) {
  var key = subj + '|' + lvl + '|' + appr; if (PF_LC_POOL_[key]) return PF_LC_POOL_[key];
  var B = {}; try { plBuilt_().forEach(function (x) { B[x] = 1; }); } catch (e) {}
  var order = (plList_(subj) || []).map(function (x) { return x[0]; }).filter(function (id) { return plMathLevel_(id) === lvl && B[id]; });
  var by = {}; (pfIx_().bySubj[subj] || []).forEach(function (it) { if (it.level === lvl && order.indexOf(it.skill) >= 0 && pfLcItemOk_(it, appr)) (by[it.skill] = by[it.skill] || []).push(it); });
  return (PF_LC_POOL_[key] = { skills: order.filter(function (id) { return by[id]; }), by: by });
}
/* Pure: the question ids for his check. seen = {item id: 1}. Unseen questions first; a seen one fills in only when a skill has no other.
   Reading: at most one story (the one he has not read that covers the most skills), its questions one per skill, then single questions. */
function pfLcPick_(subj, lvl, seen, appr, salt) {
  var P = pfLcPool_(subj, lvl, appr), cap = PF_LC.CAP, out = [], per = {}, used = {};
  var key = function (it) { return (seen[it.id] ? 1e7 : 0) + pfHash_(salt + '|' + it.id) % 1e6; };
  var take = function (it) { out.push(it.id); used[it.id] = 1; per[it.skill] = (per[it.skill] || 0) + 1; };
  var story = '';
  if (subj === 'READ') {
    var cover = {}; P.skills.forEach(function (sk) { P.by[sk].forEach(function (it) { if (it.passage) { var c = cover[it.passage] = cover[it.passage] || { sk: {}, seen: 0 }; c.sk[sk] = 1; if (seen[it.id]) c.seen = 1; } }); });
    var ids = Object.keys(cover).sort(function (a, b) { return cover[a].seen - cover[b].seen || Object.keys(cover[b].sk).length - Object.keys(cover[a].sk).length || pfHash_(salt + a) - pfHash_(salt + b); });
    story = ids[0] || '';
  }
  var ok = function (it) { return !used[it.id] && (!it.passage || it.passage === story); };
  /* round 1: one per skill, in teaching order */
  P.skills.forEach(function (sk) { if (out.length >= cap) return; var c = P.by[sk].filter(ok).sort(function (a, b) { return (a.passage ? 0 : 1) - (b.passage ? 0 : 1) || key(a) - key(b); })[0]; if (c) take(c); });
  /* round 2: a second unseen question for a skill while there is room */
  P.skills.forEach(function (sk) { if (out.length >= cap || !per[sk]) return; var c = P.by[sk].filter(function (it) { return ok(it) && !seen[it.id]; }).sort(function (a, b) { return key(a) - key(b); })[0]; if (c) take(c); });
  /* story questions together, in story order, then the rest */
  var ix = pfIx_();
  var st = out.filter(function (id) { return ix.byId[id].passage; }), so = out.filter(function (id) { return !ix.byId[id].passage; });
  return st.concat(so);
}
/* Is there a level check at this subject level? (static: the bank and the built lessons; never his own answers) */
var PF_LC_AV_ = {};
function pfLcAvail_(subj, lvl, appr) {
  if (!PF_LC.ON || PF_LC.SUBJ.indexOf(subj) < 0 || !(lvl >= PF_LC.FROM_LEVEL && lvl <= 9)) return false;
  var key = subj + '|' + lvl + '|' + appr; if (key in PF_LC_AV_) return PF_LC_AV_[key];
  var ids = pfLcPick_(subj, lvl, {}, appr, 'avail'), sk = {}, story = ''; ids.forEach(function (id) { var it = pfIx_().byId[id]; sk[it.skill] = 1; if (it.passage) story = it.passage; });
  var words = story && PF_BANK.passages[story] ? String(PF_BANK.passages[story].text || '').split(/\s+/).length : 0;
  PF_LC_MIN_[key] = Math.max(2, Math.round(ids.length * 0.3 + words / 120));   /* about how long: 10 Math questions = 3 minutes */
  return (PF_LC_AV_[key] = ids.length >= PF_LC.MIN && Object.keys(sk).length >= PF_LC.MIN_SKILLS);
}
var PF_LC_MIN_ = {};
function pfLcMinutes_(subj, lvl, appr) { return pfLcAvail_(subj, lvl, appr) ? PF_LC_MIN_[subj + '|' + lvl + '|' + appr] || PF_LC.MINUTES : 0; }
/* His passes: {MATH: {'5': {at, right, of, old}}, READ: {...}, known: {skill: 1}}. Cached 6 hours and written through on every save
   (the only way a pass is added), with a memo for this request. */
var PF_LP_MEMO_ = {};
function pfLcPasses_(sid) {
  sid = String(sid || ''); if (PF_LP_MEMO_[sid]) return PF_LP_MEMO_[sid];
  var c = null; try { c = CacheService.getScriptCache(); var hit = c.get('pf_lp_' + sid); if (hit) return (PF_LP_MEMO_[sid] = JSON.parse(hit)); } catch (e) {}
  var out = { MATH: {}, READ: {}, known: {} };
  try { var sh = pfLcTab_(), n = sh.getLastRow(); if (n >= 2) sh.getRange(2, 1, n - 1, PF_LC.COLS.length).getValues().forEach(function (v) {
    if (String(v[1]) !== sid || !out[String(v[2])]) return;
    out[String(v[2])][String(Number(v[3]))] = { at: new Date(v[0]).getTime(), right: Number(v[8]) || 0, of: Number(v[9]) || 0 };
    pfJson_(v[10], []).forEach(function (id) { out.known[id] = 1; }); }); } catch (e) {}
  try { pfRows_('results').forEach(function (v) { var k = String(v[3]), L = String(Number(v[5])); if (String(v[2]) !== sid || String(v[17]) !== 'yes' || !out[k] || !(Number(v[5]) >= 1)) return; if (!out[k][L]) out[k][L] = { at: new Date(v[0]).getTime(), old: 1 }; }); } catch (e) {}
  try { if (c) c.put('pf_lp_' + sid, JSON.stringify(out), 21600); } catch (e) {}
  return (PF_LP_MEMO_[sid] = out);
}
function pfLcHas_(sid, subj, lvl) { var p = pfLcPasses_(sid); return !!(p[subj] && p[subj][String(lvl)]); }
/* THE MONEY RULE (Money.js moneyPost_): the share of an automatic lesson earning he gets. 25% only for a lesson in a Math / Reading
   level that has a level check and no Level Pass yet; 1 for everything else (other subjects, Kodesh, no lesson id, no check there). */
function pfLevelRate_(sid, lessonId) {
  if (typeof PF_REWARD === 'undefined' || !PF_REWARD.ON || !PF_LC.ON) return 1;
  var subj = pfLcSubj_(lessonId), lvl = plMathLevel_(lessonId);
  if (!subj || !lvl || !pfLcAvail_(subj, lvl, pfAppr_(sid))) return 1;
  return pfLcHas_(sid, subj, lvl) ? 1 : PF_REWARD.rate;
}
/* for the boy's map (kmMapFor_): per subject, levels 1-9: 0 = no check there, 1 = check waiting (lessons there pay 25%), 2 = Level Pass;
   plus the skills he already knows (skipped). */
function pfLcMap_(sid) {
  var p = pfLcPasses_(sid), appr = pfAppr_(sid), out = { min: {}, known: Object.keys(p.known || {}) };
  PF_LC.SUBJ.forEach(function (k) { var a = [], m = []; for (var L = 1; L <= 9; L++) { a.push(!pfLcAvail_(k, L, appr) ? 0 : p[k][String(L)] ? 2 : 1); m.push(pfLcMinutes_(k, L, appr)); } out[k] = a; out.min[k] = m; });
  return out;
}
/* plPlanFor_ (Placement.js): the lineup skips skills he showed he already knows */
function pfLcPlanPatch_(sid, out) {
  var kn = pfLcPasses_(sid).known || {}; if (!Object.keys(kn).length) return;
  ['MATH', 'READ'].forEach(function (k) { var o = out[k]; if (!o || !o.path || !o.path.length) return;
    var path = o.path.filter(function (id) { return !kn[id]; }); if (path.length === o.path.length || !path.length) return;
    var n = o.path.length - path.length; o.path = path; if (kn[o.start]) o.start = path[0]; o.skippedKnown = n; });
}
/* every question he has answered in the Pathfinder, its old first-lesson checks and his level checks */
function pfLcSeen_(sid) {
  var seen = {}; try { seen = pfAnsweredBy_(sid); } catch (e) {}
  try { var sh = pfLcTab_(), n = sh.getLastRow(); if (n >= 2) sh.getRange(2, 1, n - 1, 6).getValues().forEach(function (v) { if (String(v[1]) === sid) pfJson_(v[5], []).forEach(function (id) { seen[id] = 1; }); }); } catch (e) {}
  return seen;
}
function pfLcKid_(token, subj, lvl) {
  var s = msSession_(token); if (!s || s.role !== 'kid' || !s.sid) throw new Error('Please sign in with your own code.');
  subj = String(subj || ''); lvl = Math.round(Number(lvl));
  if (PF_LC.SUBJ.indexOf(subj) < 0 || !(lvl >= 1 && lvl <= 9)) throw new Error('There is no level check here.');
  return { sid: String(s.sid), subj: subj, lvl: lvl, appr: pfAppr_(String(s.sid)) };
}
function pfLcItems_(q) {
  var ck = 'pf_lc_cur_' + q.sid + '_' + q.subj + q.lvl, c = null, ids = null;
  try { c = CacheService.getScriptCache(); var hit = c.get(ck); if (hit) ids = JSON.parse(hit); } catch (e) {}
  if (!ids) { ids = pfLcPick_(q.subj, q.lvl, pfLcSeen_(q.sid), q.appr, q.sid + '|' + q.subj + q.lvl); try { if (c) c.put(ck, JSON.stringify(ids), 21600); } catch (e) {} }
  return ids.filter(function (id) { return pfIx_().byId[id]; });
}
/* the boy opens the check for one subject level. null = no check there; {done: true} = he already has this Level Pass */
function pfLevelCheckStart(token, subj, lvl) {
  var q = pfLcKid_(token, subj, lvl);
  if (!pfLcAvail_(q.subj, q.lvl, q.appr)) return null;
  if (pfLcHas_(q.sid, q.subj, q.lvl)) return { done: true, subject: q.subj, level: q.lvl };
  var ids = pfLcItems_(q); if (!ids.length) return null;
  var fake = { ans: [], eng: 'E', appr: q.appr };
  return { subject: q.subj, level: q.lvl, minutes: pfLcMinutes_(q.subj, q.lvl, q.appr), items: ids.map(function (id) { var o = pfPresent_(pfIx_().byId[id], fake, q.sid + '|lc'); delete o.n; delete o.minMs; return o; }) };
}
/* answers: [{item, value}]. Scored here. Saves his Level Pass (any score) and the skills he already knows. Pays nothing. */
function pfLevelCheckSave(token, subj, lvl, answers) {
  var q = pfLcKid_(token, subj, lvl);
  if (!pfLcAvail_(q.subj, q.lvl, q.appr)) throw new Error('There is no level check here.');
  return pfLock_(function () {
    PF_LP_MEMO_ = {}; try { CacheService.getScriptCache().remove('pf_lp_' + q.sid); } catch (e) {}
    var have = pfLcPasses_(q.sid)[q.subj][String(q.lvl)];
    if (have) return { subject: q.subj, level: q.lvl, already: true, pass: true, right: have.right || 0, of: have.of || 0, known: [] };
    var ix = pfIx_(), ids = pfLcItems_(q); if (!ids.length) throw new Error('There is no level check here.');
    var got = {}; (answers || []).forEach(function (a) { if (a && a.item != null) got[String(a.item)] = String(a.value == null ? '' : a.value).slice(0, 60); });
    var sc = ids.map(function (id) { return got[id] != null && got[id] !== '' ? pfScore_(ix.byId[id], got[id]) : { x: 0, code: 'blank' }; });
    var marks = sc.map(function (s) { return s.x ? 1 : 0; }), right = marks.reduce(function (a, b) { return a + b; }, 0), bySk = {};
    ids.forEach(function (id, j) { var sk = ix.byId[id].skill; bySk[sk] = (bySk[sk] == null ? 1 : bySk[sk]) && marks[j]; });
    var known = Object.keys(bySk).filter(function (sk) { return bySk[sk]; });
    known.sort(function (a, b) { return ids.indexOf(ids.filter(function (id) { return ix.byId[id].skill === a; })[0]) - ids.indexOf(ids.filter(function (id) { return ix.byId[id].skill === b; })[0]); });
    var at = new Date(), cid = 'LC-' + Utilities.getUuid().slice(0, 8);
    pfLcTab_().appendRow([at, q.sid, q.subj, q.lvl, cid, JSON.stringify(ids), JSON.stringify(ids.map(function (id) { return got[id] == null ? '' : got[id]; })), JSON.stringify(marks), right, ids.length, JSON.stringify(known), 'boy']);
    try { var A = pfTab_('answers'), rows = ids.map(function (id, j) { var it = ix.byId[id]; return [at, cid, q.sid, q.subj, j + 1, it.id, it.skill, it.strand, it.level, it.fmt, got[id] == null ? '' : got[id], marks[j], sc[j].code || '', '', '', '', '', '', '', 'level check', it.status !== 'Approved' ? 'draft' : '']; });
      A.getRange(A.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows); } catch (e) {}
    try { CacheService.getScriptCache().remove('pf_lc_cur_' + q.sid + '_' + q.subj + q.lvl); } catch (e) {}
    PF_LP_MEMO_ = {}; try { CacheService.getScriptCache().remove('pf_lp_' + q.sid); } catch (e) {}
    pfLcPasses_(q.sid);   /* re-read and re-cache with the new pass */
    var names = {}; (plList_(q.subj) || []).forEach(function (x) { names[x[0]] = [x[1], x[2] || '']; });
    return { subject: q.subj, level: q.lvl, pass: true, right: right, of: ids.length, known: known, names: known.map(function (id) { return names[id] || [id, '']; }) };
  });
}
/* staff Pathfinder report (pfReport .levelChecks): every level check he took */
function pfLcReport_(sid) {
  var out = [], names = {}; ['MATH', 'READ'].forEach(function (k) { (plList_(k) || []).forEach(function (x) { names[x[0]] = x[1]; }); });
  try { var sh = pfLcTab_(), n = sh.getLastRow(); if (n >= 2) sh.getRange(2, 1, n - 1, PF_LC.COLS.length).getValues().forEach(function (v) {
    if (String(v[1]) !== sid) return;
    out.push({ at: new Date(v[0]).getTime(), subject: String(v[2]), level: Number(v[3]), right: Number(v[8]) || 0, of: Number(v[9]) || 0, known: pfJson_(v[10], []).map(function (id) { return [id, names[id] || id]; }) }); }); } catch (e) {}
  return out;
}
/* the Store / Canteen note (cnPfRate_ -> pfRewardRate_): a quarter when a level he is on now still waits for its check */
function pfLcNoteRate_(sid) {
  if (typeof PF_REWARD === 'undefined' || !PF_REWARD.ON || !PF_LC.ON) return 1;
  var pl = {}; try { pl = plPlacements_()[sid] || {}; } catch (e) {}
  var g = null; try { g = typeof kmGradeOf_ === 'function' ? kmGradeOf_(sid) : null; } catch (e) {}
  var appr = pfAppr_(sid);
  for (var i = 0; i < PF_LC.SUBJ.length; i++) { var k = PF_LC.SUBJ[i], L = pl[k] && pl[k].level ? Number(pl[k].level) : (g != null && g >= 0 ? Math.min(9, g + 1) : 0);
    if (L && pfLcAvail_(k, L, appr) && !pfLcHas_(sid, k, L)) return PF_REWARD.rate; }
  return 1;
}
