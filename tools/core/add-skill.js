#!/usr/bin/env node
/* Core Growth (job T): add a NEW skill in one step. Read docs/core-growth/HOW-TO-ADD-A-SKILL.md first.

   node tools/core/add-skill.js next READ.COMP.L06
       prints the next free id with that start (it checks every ladder, the curriculum index, every job list and every file)
   node tools/core/add-skill.js <JOB> <ID> "<game name>" "<plain objective>" --file CoreData<JOB><n> [--after ID | --before ID] [--std RL.5.2] [--min 8]
       adds one row to src/CoreData<JOB>.js (made if missing) and makes src/CoreData<JOB><n>.html (if missing) ready for lessons.
       No --after/--before: the skill goes right after this job's last skill (same ladder and level only).
   node tools/core/add-skill.js check
       lists every problem in every job's list (the tests run the same check).

   It never edits Placement.js, CurriculumIndex.js, Photos.js or Speed.js: CoreSkills.js adds the skill to all of them at start-up. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..'), SRC = path.join(ROOT, 'src'), PACKS = path.join(ROOT, 'packs');
const B = require(path.join(ROOT, 'tests', 'lib', 'build.js'));
const die = m => { console.error('add-skill: ' + m); process.exit(1); };

function server() { const { ctx, loadErrors } = B.sandbox(); if (loadErrors.length) die('src does not load: ' + loadErrors.join('; ')); return ctx; }
function report(ctx) { return JSON.parse(vm.runInContext('JSON.stringify(coreReport_())', ctx)); }
function ladderIds(ctx) { return JSON.parse(vm.runInContext('JSON.stringify([].concat(READ_K8, LANG_K8, SCI_K8, SS_K12).map(function (x) { return x[0]; }))', ctx)); }
function everyText() {
  const out = [];
  for (const d of [SRC, PACKS]) for (const f of fs.readdirSync(d)) if (/\.(js|html)$/.test(f)) out.push(fs.readFileSync(path.join(d, f), 'utf8'));
  return out.join('\n');
}
function used(ctx, id) {
  if (ladderIds(ctx).includes(id)) return 'on a ladder';
  if (vm.runInContext('!!(CI_INDEX.sk[' + JSON.stringify(id) + '])', ctx)) return 'in the curriculum index';
  if (new RegExp('["\']' + id.replace(/\./g, '\\.') + '["\']').test(everyText())) return 'already used in src/ or packs/';
  return '';
}

const a = process.argv.slice(2);
if (!a.length) { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(0); }

if (a[0] === 'check') {
  const r = report(server());
  console.log('core skills added: ' + r.merged.added + '; files: ' + (r.files.join(', ') || 'none'));
  r.problems.forEach(p => console.log('PROBLEM ' + p));
  process.exit(r.problems.length ? 1 : 0);
}

if (a[0] === 'next') {
  const pre = String(a[1] || ''); if (!/^(READ|LANG|WRIT|SCI|SS)\.[A-Z]+\.L\d\d$/.test(pre)) die('give a start like READ.COMP.L06');
  const ctx = server(), text = everyText(), re = new RegExp(pre.replace(/\./g, '\\.') + '\\.(\\d\\d)', 'g'); let m, max = 0;
  while ((m = re.exec(text))) max = Math.max(max, Number(m[1]));
  ladderIds(ctx).forEach(id => { if (id.startsWith(pre + '.')) max = Math.max(max, Number(id.split('.')[3]) || 0); });
  if (max >= 99) die('no free number left after ' + pre + '.99');
  console.log(pre + '.' + String(max + 1).padStart(2, '0'));
  process.exit(0);
}

/* add */
const [job, id, name, obj] = a; const opt = {};
for (let i = 4; i < a.length; i++) { if (!/^--/.test(a[i])) die('unexpected ' + a[i]); opt[a[i].slice(2)] = a[i + 1]; i++; }
if (!/^[A-Z][A-Z0-9]*$/.test(job || '')) die('JOB must be the job letters, like F, C45, W48 (capitals and digits)');
if (!/^(READ|LANG|WRIT|SCI|SS)\.[A-Z]+\.L\d\d\.\d\d$/.test(id || '')) die('ID must look like READ.COMP.L06.12 (use "next" to get a free one)');
if (!name || !obj) die('give a game name and a plain objective, each in quotes');
if (name.length > 40) die('the game name is longer than 40 letters');
const file = opt.file || ''; if (!new RegExp('^CoreData' + job + '\\d+$').test(file)) die('--file must be CoreData' + job + '<n>, for example CoreData' + job + '1 (keep each file under 150 KB)');
if (opt.after && opt.before) die('give --after or --before, not both');
const ctx = server(); const u = used(ctx, id); if (u) die(id + ' is ' + u + '. Pick a free id: node tools/core/add-skill.js next ' + id.split('.').slice(0, 3).join('.'));

const reg = path.join(SRC, 'CoreData' + job + '.js');
if (!fs.existsSync(reg)) fs.writeFileSync(reg,
`/* CoreData${job}.js: Core Growth job ${job}, its NEW skills in teaching order (docs/core-growth/HOW-TO-ADD-A-SKILL.md).
   One row per skill: [id, game name, plain objective, { after or before: where it goes on the ladder, std: Common Core code, file: its lesson data file, min: minutes for a typical boy }].
   A row with no after/before comes right after the row above it. Add rows with: node tools/core/add-skill.js ${job} ...
   CoreSkills.js puts these into the ladders (Placement.js), the curriculum index and the boy's page at start-up. */
var CORE_SKILLS = (typeof CORE_SKILLS !== 'undefined' && CORE_SKILLS) || {};
CORE_SKILLS.${job} = [
];
`);
let src = fs.readFileSync(reg, 'utf8');
const vc = {}; vm.createContext(vc); vm.runInContext(src, vc); const rows = (vc.CORE_SKILLS && vc.CORE_SKILLS[job]) || [];
const o = {};
if (opt.after) o.after = opt.after; else if (opt.before) o.before = opt.before;
else {
  const last = rows[rows.length - 1]; if (!last) die('the first skill of a job needs --after ID or --before ID');
  const lad = x => ({ READ: 'R', LANG: 'L', WRIT: 'L', SCI: 'S', SS: 'O' })[x.split('.')[0]], lv = x => x.split('.')[2];
  if (lad(last[0]) !== lad(id) || lv(last[0]) !== lv(id)) die('the last skill in your list (' + last[0] + ') is on another ladder or level: give --after ID or --before ID');
}
const anchor = o.after || o.before;
if (anchor && !ladderIds(ctx).includes(anchor)) die(anchor + ' is not on any ladder');
if (opt.std) o.std = opt.std; o.file = file; if (opt.min) o.min = Number(opt.min);
const row = '  [' + [id, name, obj].map(x => JSON.stringify(x)).join(', ') + ', { ' + Object.keys(o).map(k => k + ': ' + JSON.stringify(o[k])).join(', ') + ' }]';
const end = src.lastIndexOf('];'); if (end < 0) die(reg + ' has no closing ];');
let head = src.slice(0, end).replace(/\s*$/, ''); if (rows.length) head += ',';
src = head + '\n' + row + '\n' + src.slice(end);
fs.writeFileSync(reg, src);

const data = path.join(SRC, file + '.html');
if (!fs.existsSync(data)) fs.writeFileSync(data,
`<script>
/* ${file}.html: Core Growth job ${job}, lesson data (docs/core-growth/HOW-TO-ADD-A-SKILL.md). Keep this file under 150 KB.
   Every lesson listed for this file in src/CoreData${job}.js goes in LESSONS, written  'ID':{name:'...', teach:[...], practice:[...], check:[...], re:[...]}
   (the server finds a lesson by that exact shape: quoted id, colon, brace, name first). Optional: Teacher Time, How-to boxes, One Bite. */
(function () {
  var LESSONS = {
  };
  var TEACH = {}, HOWTO = {}, BITE = {};
  if (window.TLCORE) TLCORE.add('${job}', LESSONS, { teach: TEACH, howto: HOWTO, bite: BITE });
})();
</script>
`);

const r = report(server());
const mine = r.problems.filter(p => p.indexOf(job + ' ' + id + ':') === 0);
if (mine.length) { console.log(mine.join('\n')); die('the row was written but has problems: fix them in ' + path.relative(ROOT, reg)); }
console.log('added ' + id + ' "' + name + '" to src/CoreData' + job + '.js (' + (anchor ? (o.after ? 'after ' : 'before ') + anchor : 'after ' + rows[rows.length - 1][0]) + '), lessons in src/' + file + '.html');
console.log('it is on the boy\'s map once its lesson is in src/' + file + '.html. Then: node tests/run.js with PLAY=' + id);
