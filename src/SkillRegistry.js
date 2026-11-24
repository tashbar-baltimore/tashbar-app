/* SkillRegistry.js: ONE way to add a new skill (Core Growth, job T, 2026-11-24). Read docs/core-growth/HOW-TO-ADD-A-SKILL.md.

   A content job adds new skills with TWO files it owns, and touches nothing else:
     1. src/SkillsCore<Job>.js  (server; this file's name must start with "SkillsCore" so it loads AFTER this file):
          crAdd_({ job: 'F', files: ['CoreDataF1'], skills: [
            { id: 'READ.PHON.L02.20', after: 'READ.PHON.L02.06', game: 'Magic E Workshop', skill: 'Read words with silent e', unit: 'F-1-3' },   (or before: 'ID')
            ... ] });
     2. src/CoreData<Job><n>.html  (the boy page; the lessons themselves): CORE_ADD('F', { 'READ.PHON.L02.20': { name: ..., teach, practice, check, tt, bite } });
   Each row is put into the right ladder (READ_K8 for READ.*, LANG_K8 for LANG.* and WRIT.*, SCI_K8, SS_K12) right after its `after`
   skill, so the boy's map and path, placement, level checks, the staff grid, the library and the Department course map all see it.
   The page loads every file in `files` (Photos.js and Speed.js read crDataFiles_(), so no job edits those two files).
   plBuilt_ (Placement.js) also reads these files, so a skill counts as "built" as soon as its lesson is in its CoreData file.

   Files load in name order on the server (server/runtime.js, tests/lib/build.js): Placement.js and CurriculumIndex.js are already
   loaded here, and every SkillsCore*.js file loads after this one. A mistake (unknown `after`, a bad or repeated id, a wrong ladder)
   throws, which fails the tests, so a broken row never goes live. */
var CR_JOBS = {};        /* job -> { files: [...], skills: [rows] } */
var CR_SKILLS = {};      /* id -> row (with .job and .k = ladder key) */
var CR_ID_RE_ = /^(READ|LANG|WRIT|SCI|SS)\.[A-Z]+\.L\d\d\.\d\d(\.[a-z])?$/;
var CR_FILE_RE_ = /^CoreData[A-Z][A-Z0-9]*$/;

function crLadderKey_(id) { var p = String(id).split('.')[0]; return p === 'READ' ? 'READ' : (p === 'LANG' || p === 'WRIT') ? 'LANG' : p === 'SCI' ? 'SCI' : p === 'SS' ? 'SOC' : ''; }
function crLadder_(k) { return k === 'READ' ? READ_K8 : k === 'LANG' ? LANG_K8 : k === 'SCI' ? SCI_K8 : k === 'SOC' ? SS_K12 : null; }
function crLevel_(id) { var m = /\.L(\d\d)\./.exec(String(id)); return m ? Number(m[1]) : 0; }

function crAdd_(spec) {
  var job = String(spec && spec.job || '');
  if (!/^[A-Z][A-Z0-9]*$/.test(job)) throw new Error('crAdd_: job must be a code like F, C45, W13 or C45H1 (got "' + job + '")');
  if (CR_JOBS[job]) throw new Error('crAdd_: job ' + job + ' is added twice; put all its rows in one crAdd_ call');
  var files = (spec.files || []).map(String);
  files.forEach(function (f) {
    if (!CR_FILE_RE_.test(f)) throw new Error('crAdd_ ' + job + ': data file "' + f + '" must be named CoreData<Job><n> (e.g. CoreData' + job + '1)');
    Object.keys(CR_JOBS).forEach(function (j) { if (CR_JOBS[j].files.indexOf(f) >= 0) throw new Error('crAdd_ ' + job + ': data file ' + f + ' already belongs to job ' + j); });
  });
  var rows = [];
  (spec.skills || []).forEach(function (r, i) {
    var id = String(r && r.id || ''), where = 'crAdd_ ' + job + ' row ' + (i + 1) + ' (' + id + '): ';
    if (!CR_ID_RE_.test(id)) throw new Error(where + 'the id must look like READ.COMP.L05.21 (strand prefix, level = grade + 1, next free number)');
    if (CR_SKILLS[id]) throw new Error(where + 'this id is already added by job ' + CR_SKILLS[id].job);
    var k = crLadderKey_(id), L = crLadder_(k);
    if (!L) throw new Error(where + 'no ladder for this subject');
    if (L.some(function (x) { return x[0] === id; })) throw new Error(where + 'this id is already on the ' + k + ' ladder (pick the next free number)');
    if (!r.game || !r.skill) throw new Error(where + 'needs game (the rung name the boy sees) and skill (plain words for staff)');
    var before = String(r.before || ''), after = before ? '' : String(r.after || ''), anchor = before || after, at = -1;
    if (r.before && r.after) throw new Error(where + 'give after OR before, not both');
    for (var j = 0; j < L.length; j++) if (L[j][0] === anchor) { at = j; break; }
    if (at < 0) throw new Error(where + (before ? 'before' : 'after') + ' "' + anchor + '" is not on the ' + k + ' ladder (it must be an existing skill, or one added above)');
    if (crLevel_(anchor) !== crLevel_(id)) throw new Error(where + '"' + anchor + '" is on another level; a skill goes next to a skill of its own level');
    L.splice(before ? at : at + 1, 0, [id, String(r.game), String(r.skill)]);
    var row = { id: id, after: after, before: before, game: String(r.game), skill: String(r.skill), unit: String(r.unit || ''), job: job, k: k };
    rows.push(row); CR_SKILLS[id] = row;
    crIndexAdd_(row);
  });
  CR_JOBS[job] = { files: files, skills: rows };
  return rows.length;
}

/* The Department course map (DeptMap.js) and the staff name lookups read CI_INDEX: put the row there too, at the same place. */
function crIndexAdd_(row) {
  if (typeof CI_INDEX === 'undefined' || !CI_INDEX) return;
  var lad = CI_INDEX.lad && CI_INDEX.lad[row.k];
  if (lad) {
    var i = -1, anchor = row.before || row.after; for (var j = 0; j < lad.length; j++) if (lad[j][0] === anchor) { i = j; break; }
    if (i >= 0 && row.before) i--;
    if (i < 0 && !row.before) { for (j = lad.length - 1; j >= 0; j--) if (crLevel_(lad[j][0]) === crLevel_(row.id)) { i = j; break; } }
    lad.splice(i + 1, 0, [row.id, row.game, row.skill]);
  }
  if (CI_INDEX.sk && !CI_INDEX.sk[row.id]) CI_INDEX.sk[row.id] = [row.skill, 0, 0, 3, '', 'c', [], []];   /* 'c' = a Core Growth skill */
  CI_INDEX.built = String(CI_INDEX.built || '').replace(/\+cr\d+$/, '') + '+cr' + Object.keys(CR_SKILLS).length;   /* new cache key for the course map */
}

/* Every CoreData file, in job order (the order the jobs' SkillsCore files load). Photos.js and Speed.js load these on the boy page. */
function crDataFiles_() {
  var out = []; Object.keys(CR_JOBS).sort().forEach(function (j) { CR_JOBS[j].files.forEach(function (f) { if (out.indexOf(f) < 0) out.push(f); }); });
  return out;
}

/* plBuilt_ (Placement.js) reads the page's lesson files; the CoreData files are read here and added. Same rule: the text 'ID':{name: */
var crPlBuiltBase_ = typeof plBuilt_ === 'function' ? plBuilt_ : function () { return []; };
plBuilt_ = function () {
  var base = crPlBuiltBase_(), files = crDataFiles_();
  if (!files.length) return base;
  var c = CacheService.getScriptCache(), hit = c.get('cr_built_v1');
  var extra = hit ? JSON.parse(hit) : null;
  if (!extra) {
    extra = []; var re = /['"]((?:READ|WRIT|LANG|SCI|SS)\.[A-Z]+\.L\d\d\.\d\d(?:\.[a-z])?)['"]\s*\]?\s*[:=]\s*\{\s*["']?name["']?\s*:/g, m;
    files.forEach(function (f) { var t = ''; try { t = tlFileText_(f); } catch (e) {} re.lastIndex = 0; while ((m = re.exec(t))) if (extra.indexOf(m[1]) < 0) extra.push(m[1]); });
    c.put('cr_built_v1', JSON.stringify(extra), 300);
  }
  var out = base.slice(); extra.forEach(function (id) { if (out.indexOf(id) < 0) out.push(id); });
  return out;
};

/* The add-on text for the boy page: CoreKit first, then every CoreData file, each in its own try (as msQuestToolsBody_ does). */
function crToolNames_() { return ['CoreKit'].concat(crDataFiles_()); }
