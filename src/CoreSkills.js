/* CoreSkills.js: Core Growth (job T, 2026-11-24). ONE simple way to add a new skill.
   Read docs/core-growth/HOW-TO-ADD-A-SKILL.md. In short:
     1. A job lists its new skills in its OWN file src/CoreData<Job>.js (made by: node tools/core/add-skill.js ...):
          var CORE_SKILLS = (typeof CORE_SKILLS !== 'undefined' && CORE_SKILLS) || {};
          CORE_SKILLS.F = [
            ['READ.PHON.L02.20', 'Magic E Train', 'Read words with a silent e', { after: 'READ.PHON.L02.05', std: 'RF.1.3c', file: 'CoreDataF1', min: 8 }],
            ['READ.PHON.L02.21', 'Two Vowels Walk', 'Read ai and ay words', { std: 'RF.1.3c', file: 'CoreDataF1', min: 8 }]   (no after: comes right after the row above)
          ];
     2. The lessons themselves go in that job's data file src/CoreData<Job><n>.html (window.TLCORE.add, see src/CoreKit.html).
   This file then puts every listed skill into every list that needs it, at start-up, without anyone editing those lists:
     - the ladders in Placement.js (READ_K8, LANG_K8, SCI_K8, SS_K12): the boy's map, his path, placement, the staff grid,
       "Give him this skill", the Library and the Pathfinder level lists all read these;
     - the curriculum index (CI_INDEX.lad and .sk): the Departments course map and skill names;
     - "built" (plBuilt_ in Placement.js scans every listed data file);
     - the boy's page (Photos.js and Speed.js load every listed data file, after OneBiteDataUpper, before OneBiteKit).
   A skill whose lesson is not in its data file yet is listed but not "built", so a boy never meets an empty lesson.
   Nothing here touches money, saving or mastery. */
var CORE_SKILLS = (typeof CORE_SKILLS !== 'undefined' && CORE_SKILLS) || {};
var CORE_ID_RE = /^(READ|LANG|WRIT|SCI|SS)\.[A-Z]+\.L\d\d\.\d\d$/;
var CORE_FILE_RE = /^CoreData[A-Z][A-Z0-9]*$/;
var CORE_KIT_FILE = 'CoreKit';   /* src/CoreKit.html: the helper every data file uses; it loads first */
var CORE_MERGED_ = null;

/* Which ladder an id belongs to (the same lists Placement.js uses). */
function coreLadderKey_(id) { var p = String(id).split('.')[0]; return p === 'READ' ? 'READ' : (p === 'LANG' || p === 'WRIT') ? 'LANG' : p === 'SCI' ? 'SCI' : p === 'SS' ? 'SOC' : ''; }
function coreLadder_(k) {
  try { return k === 'READ' ? READ_K8 : k === 'LANG' ? LANG_K8 : k === 'SCI' ? SCI_K8 : k === 'SOC' ? SS_K12 : null; } catch (e) { return null; }
}
function coreLevel_(id) { var m = /\.L(\d\d)\./.exec(String(id)); return m ? Number(m[1]) : 0; }

/* Every registered row, in job order (jobs by name, rows as written): [{job, id, name, obj, after, before, std, file, min}]. */
function coreRows_() {
  var out = [];
  Object.keys(CORE_SKILLS || {}).sort().forEach(function (job) {
    var prev = '';
    (CORE_SKILLS[job] || []).forEach(function (r) {
      if (!r || !r[0]) return;
      var o = r[3] || {};
      out.push({ job: job, id: String(r[0]), name: String(r[1] || ''), obj: String(r[2] || ''), after: o.after ? String(o.after) : (o.before ? '' : prev), before: o.before ? String(o.before) : '',
        std: String(o.std || ''), file: String(o.file || ''), min: Number(o.min) || 0 });
      prev = String(r[0]);
    });
  });
  return out;
}

/* Problems that stop a row from being added. tests/lib/core.js fails on any of these, so they never reach a boy. */
function coreProblems_() {
  var rows = coreRows_(), probs = [], seen = {}, base = {}, mine = {};
  ((CORE_MERGED_ && CORE_MERGED_.ids) || []).forEach(function (id) { mine[id] = 1; });
  ['READ', 'LANG', 'SCI', 'SOC'].forEach(function (k) { (coreLadder_(k) || []).forEach(function (x) { if (!mine[x[0]]) base[x[0]] = 1; }); });
  rows.forEach(function (r) {
    var at = r.job + ' ' + r.id + ': ';
    if (!CORE_ID_RE.test(r.id)) probs.push(at + 'the id must look like READ.COMP.L06.12 (READ, LANG, WRIT, SCI or SS; level 2 digits; number 2 digits)');
    if (seen[r.id]) probs.push(at + 'listed twice (also in job ' + seen[r.id] + ')'); seen[r.id] = r.job;
    if (base[r.id]) probs.push(at + 'already on the ladder in Placement.js: an existing skill is improved in place, not added again');
    if (!r.name || !r.obj) probs.push(at + 'needs a game name and a plain objective');
    if (r.name.length > 40) probs.push(at + 'game name is longer than 40 letters');
    if (!r.after && !r.before) probs.push(at + 'needs { after: ... } or { before: ... } (the first row of a job must say where it goes)');
    var anchor = r.after || r.before;
    if (anchor && coreLadderKey_(anchor) !== coreLadderKey_(r.id)) probs.push(at + 'its place (' + anchor + ') is on a different ladder');
    if (anchor && coreLevel_(anchor) !== coreLevel_(r.id)) probs.push(at + 'its place (' + anchor + ') is on level ' + coreLevel_(anchor) + ', but the skill is level ' + coreLevel_(r.id) + ' (a skill sits inside its own level)');
    if (!CORE_FILE_RE.test(r.file)) probs.push(at + 'needs { file: "CoreData<Job><n>" } (its lesson data file)');
    if (r.std && !/^[A-Z][A-Za-z0-9.\-]+$/.test(r.std)) probs.push(at + 'std looks wrong (' + r.std + '); use a code like RL.5.2 or RF.1.3c');
    if (CORE_MERGED_ && CORE_MERGED_.skipped.indexOf(r.id) >= 0 && !mine[r.id]) probs.push(at + 'was not added: its place (' + anchor + ') is not on the ladder');
  });
  return probs;
}

/* Puts every registered row into the ladders and the curriculum index. Safe to call many times: it works once. */
function coreMerge_() {
  if (CORE_MERGED_) return CORE_MERGED_;
  var rows = coreRows_(), placed = {}, skipped = [], added = 0, left = rows.slice(), guard = 0;
  var bad = {}; coreProblemsBefore_(rows).forEach(function (id) { bad[id] = 1; });
  /* rows can hang on other new rows, so keep going while something new finds its place */
  while (left.length && guard++ < 50) {
    var next = [];
    left.forEach(function (r) {
      if (bad[r.id]) { skipped.push(r.id); return; }
      var L = coreLadder_(coreLadderKey_(r.id)); if (!L) { skipped.push(r.id); return; }
      var anchor = r.after || r.before, i = -1;
      for (var j = 0; j < L.length; j++) if (L[j][0] === anchor) { i = j; break; }
      if (i < 0) { next.push(r); return; }
      for (var k = 0; k < L.length; k++) if (L[k][0] === r.id) { skipped.push(r.id); return; }
      L.splice(r.after ? i + 1 : i, 0, [r.id, r.name, r.obj]); placed[r.id] = r; added++;
    });
    if (next.length === left.length) { next.forEach(function (r) { skipped.push(r.id); }); break; }
    left = next;
  }
  /* curriculum index: the same order (Departments map) and a name for every new skill */
  try {
    if (typeof CI_INDEX !== 'undefined' && CI_INDEX) {
      var lk = { READ: 'READ', LANG: 'LANG', SCI: 'SCI', SOC: 'SOC' };
      Object.keys(lk).forEach(function (k) { var src = coreLadder_(k), lad = CI_INDEX.lad && CI_INDEX.lad[lk[k]]; if (!src || !lad) return;
        if (Object.keys(placed).some(function (id) { return coreLadderKey_(id) === k; })) CI_INDEX.lad[lk[k]] = src.map(function (x) { return [x[0], x[1], x[2]]; }); });
      Object.keys(placed).forEach(function (id) { if (CI_INDEX.sk && !CI_INDEX.sk[id]) CI_INDEX.sk[id] = [placed[id].name, 0, 0, 0, '', 'c', [], []]; });
      if (added) CI_INDEX.built = String(CI_INDEX.built || '') + '+core' + added;   /* new cache key for the Departments map */
    }
  } catch (e) {}
  CORE_MERGED_ = { added: added, skipped: skipped, ids: Object.keys(placed) };
  return CORE_MERGED_;
}
function coreProblemsBefore_(rows) {
  var bad = [];
  rows.forEach(function (r) { var a = r.after || r.before; if (!CORE_ID_RE.test(r.id) || !CORE_FILE_RE.test(r.file) || !a || coreLadderKey_(a) !== coreLadderKey_(r.id) || coreLevel_(a) !== coreLevel_(r.id)) bad.push(r.id); });
  return bad;
}

/* The data files the boy's page loads, in order: the kit first, then every file a row names (jobs by name, files by first use). */
function coreFiles_() {
  var out = [], seen = {};
  coreRows_().forEach(function (r) { if (CORE_FILE_RE.test(r.file) && !seen[r.file]) { seen[r.file] = 1; out.push(r.file); } });
  return out.length ? [CORE_KIT_FILE].concat(out) : [];
}

/* One piece per file for the boy's page. Photos.js (msQuestToolsBody_) and Speed.js (tlToolParts_) both use this, so they match byte for byte. */
function coreToolsJs_() {
  return coreFiles_().map(function (n) { var t = ''; try { t = tlStrip_(tlFileText_(n)); } catch (e) {} return tlWrap_(n, t); }).join('');
}

/* Staff and tests: what was added and what was not. */
function coreReport_() { coreMerge_(); return { merged: CORE_MERGED_, problems: coreProblems_(), files: coreFiles_() }; }
