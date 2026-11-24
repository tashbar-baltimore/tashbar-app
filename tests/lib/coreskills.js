/* CORE GROWTH, job T: "one way to add a skill" (src/SkillRegistry.js, src/CoreKit.html, docs/core-growth/HOW-TO-ADD-A-SKILL.md).
   Part 1 (server, real engine server/runtime.js, made-up data only):
     - a made-up job's rows land on the right ladder at the right place, in CI_INDEX, in plList_ and plBuilt_;
     - its data file is loaded on the boy page (msQuestToolsBody_ AND the Speed.js pieces, byte for byte the same);
     - mistakes are refused (unknown anchor, other level, repeated id, bad id, bad file name, a job added twice).
   Part 2 (every REAL job): each row's lesson is in one of its own CoreData files as 'ID':{name:, every lesson there has a row,
     each CoreData file is under 150 KB, has no double slash and is a real file.
   Part 3 (boy page, `coreskills.page(pg)`): every real row is a lesson the page can build, with a hand-written bite that has
     do and your activities (so tests/lib/obquality.js checks every rule on it), and CORE_ADD puts a made-up lesson
     into BANK_ALL, WRIT, TL_TEACH and ONE_BITE (then removes it again). */
const path = require('path'), fs = require('fs'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..'), SRC = path.join(ROOT, 'src');
const { createRuntime } = require(path.join(ROOT, 'server', 'runtime.js'));

function fresh() { const rt = createRuntime({ store: { books: {}, props: {} } }); return rt; }
const ev = (rt, s) => JSON.parse(vm.runInContext('JSON.stringify(' + s + ')', rt.ctx));

function server() {
  const fails = [], oks = [], f = m => fails.push('add a skill: ' + m);
  /* ---- Part 1: the mechanism, with a made-up job ---- */
  let rt = fresh(); if (rt.loadErrors.length) return { fails: rt.loadErrors.map(e => 'server file failed to load: ' + e), oks };
  const realRows = ev(rt, 'Object.keys(CR_SKILLS).length');
  const read0 = ev(rt, 'READ_K8.map(function(x){return x[0]})'), lang0 = ev(rt, 'LANG_K8.map(function(x){return x[0]})');
  const aR = read0.filter(id => /\.L04\./.test(id))[1], aL = lang0.filter(id => /\.L06\./.test(id))[0];
  const FIX = "<script>\nCORE_ADD('ZZ', { 'READ.COMP.L04.91': { name: 'Made-up test skill', teach: [], practice: [], check: [] } });\n</script>\n";
  vm.runInContext('TL_PACK_MEMO_["CoreDataZZ1"] = ' + JSON.stringify(FIX), rt.ctx);
  try {
    vm.runInContext("crAdd_({ job: 'ZZ', files: ['CoreDataZZ1'], skills: [" +
      "{ id: 'READ.COMP.L04.91', after: " + JSON.stringify(aR) + ", game: 'Test Rung', skill: 'made-up skill one', unit: 'ZZ-3-1' }," +
      "{ id: 'READ.COMP.L04.92', after: 'READ.COMP.L04.91', game: 'Test Rung 2', skill: 'made-up skill two' }," +
      "{ id: 'WRIT.PARA.L06.91', before: " + JSON.stringify(aL) + ", game: 'Test Rung 3', skill: 'made-up skill three' } ] })", rt.ctx);
  } catch (e) { f('a good made-up job was refused: ' + String(e).slice(0, 200)); return { fails, oks }; }
  const read1 = ev(rt, 'READ_K8.map(function(x){return x[0]})'), lang1 = ev(rt, 'LANG_K8.map(function(x){return x[0]})');
  const i = read1.indexOf(aR);
  if (read1[i + 1] !== 'READ.COMP.L04.91' || read1[i + 2] !== 'READ.COMP.L04.92') f('rows did not land right after their "after" skill on READ_K8');
  if (lang1[lang1.indexOf(aL) - 1] !== 'WRIT.PARA.L06.91') f('a "before" row did not land right before its skill on LANG_K8');
  if (read1.length !== read0.length + 2 || lang1.length !== lang0.length + 1) f('ladders changed by more than the rows added');
  const lad = ev(rt, 'CI_INDEX.lad.READ.map(function(x){return x[0]})'), j = lad.indexOf(aR);
  if (lad[j + 1] !== 'READ.COMP.L04.91') f('the row is not in CI_INDEX.lad.READ after its skill (Department course map)');
  if (!ev(rt, '!!CI_INDEX.sk["WRIT.PARA.L06.91"]')) f('the row is not in CI_INDEX.sk');
  if (!/\+cr\d+$/.test(ev(rt, 'CI_INDEX.built'))) f('CI_INDEX.built did not change (the course map cache would keep the old list)');
  if (ev(rt, 'plPathOf_("READ", ' + JSON.stringify(aR) + ')')[1] !== 'READ.COMP.L04.91') f("the boy's path (plPathOf_) does not go through the new row");
  const built = ev(rt, 'plBuilt_()');
  if (built.indexOf('READ.COMP.L04.91') < 0) f('a skill whose lesson is in its CoreData file does not count as built (plBuilt_)');
  if (built.indexOf('READ.COMP.L04.92') >= 0) f('a skill with no lesson yet counts as built');
  if (built.indexOf('READ.COMP.L05.01') < 0) f('plBuilt_ lost the skills it had before');
  const names = ev(rt, 'crToolNames_()');
  if (names[0] !== 'CoreKit' || names.indexOf('CoreDataZZ1') < 0) f('crToolNames_ must be CoreKit, then every CoreData file (got ' + names.join(',') + ')');
  const body = ev(rt, 'msQuestToolsBody_().js');
  if (body.indexOf("Made-up test skill") < 0) f('the made-up CoreData file is not loaded on the boy page (Photos.js)');
  if (body.indexOf('"CoreKit",e)') < 0 || body.indexOf('"CoreKit",e)') < body.indexOf('"OneBiteDataUpper",e)') || body.indexOf('"CoreKit",e)') > body.indexOf('"OneBiteKit",e)')) f('CoreKit must load after OneBiteDataUpper and before OneBiteKit');
  const pieces = ev(rt, 'tlToolParts_().map(function(p){return p.get()}).join("")');
  if (pieces !== body) f('the Speed.js pieces are not byte for byte the add-on body (TL_PART_FILES out of step with Photos.js)');
  const bad = [
    ["{ job: 'ZY', files: [], skills: [{ id: 'READ.COMP.L04.93', after: 'READ.NOPE.L04.01', game: 'x', skill: 'x' }] }", 'an unknown "after" skill'],
    ["{ job: 'ZY', files: [], skills: [{ id: 'READ.COMP.L04.93', after: " + JSON.stringify(read0.filter(x => /\.L05\./.test(x))[0]) + ", game: 'x', skill: 'x' }] }", 'an anchor on another level'],
    ["{ job: 'ZY', files: [], skills: [{ id: 'READ.COMP.L04.91', after: " + JSON.stringify(aR) + ", game: 'x', skill: 'x' }] }", 'an id another job already added'],
    ["{ job: 'ZY', files: [], skills: [{ id: " + JSON.stringify(aR) + ", after: " + JSON.stringify(aR) + ", game: 'x', skill: 'x' }] }", 'an id already on the ladder'],
    ["{ job: 'ZY', files: [], skills: [{ id: 'READ.COMP.4.93', after: " + JSON.stringify(aR) + ", game: 'x', skill: 'x' }] }", 'a badly formed id'],
    ["{ job: 'ZY', files: [], skills: [{ id: 'MATH.OPS.L04.93', after: 'MATH.OPS.L04.01', game: 'x', skill: 'x' }] }", 'a Math id (Math is not in Core Growth)'],
    ["{ job: 'ZY', files: [], skills: [{ id: 'READ.COMP.L04.93', after: " + JSON.stringify(aR) + " }] }", 'a row with no game or skill name'],
    ["{ job: 'ZY', files: ['OneBiteDataRead'], skills: [] }", 'a data file not named CoreData…'],
    ["{ job: 'ZY', files: ['CoreDataZZ1'], skills: [] }", "another job's data file"],
    ["{ job: 'ZZ', files: [], skills: [] }", 'the same job added twice'] ];
  bad.forEach(([spec, what]) => { let threw = false; try { vm.runInContext('crAdd_(' + spec + ')', rt.ctx); } catch (e) { threw = true; } if (!threw) f('it should refuse ' + what); });
  if (!fails.length) oks.push('add a skill (SkillRegistry.js): rows land on the ladder, course map, path and "built" list; the data file loads on the boy page (pieces match); 10 kinds of mistake are refused');

  /* ---- Part 2: every real job ---- */
  rt = fresh(); const jobs = ev(rt, 'CR_JOBS'); let nRows = 0, nFiles = 0;
  Object.keys(jobs).forEach(job => {
    const J = jobs[job], text = {};
    J.files.forEach(fn => { nFiles++; const p = path.join(SRC, fn + '.html');
      if (!fs.existsSync(p)) { f('job ' + job + ': data file src/' + fn + '.html does not exist'); text[fn] = ''; return; }
      const t = fs.readFileSync(p, 'utf8'); text[fn] = t;
      if (t.length > 150 * 1024) f('job ' + job + ': src/' + fn + '.html is ' + Math.round(t.length / 1024) + ' KB (keep each data file under 150 KB; start the next file)');
      if (/(^|[^:"'\\])\/\/(?![^\n]*['"])/m.test(t.replace(/https?:\/\/[^\s'"]+/g, ''))) f('job ' + job + ': src/' + fn + '.html has a double slash (use block comments)'); });
    const all = Object.values(text).join('\n'), re = /['"]((?:READ|WRIT|LANG|SCI|SS)\.[A-Z]+\.L\d\d\.\d\d(?:\.[a-z])?)['"]\s*:\s*\{\s*["']?name["']?\s*:/g; let m; const inData = [];
    while ((m = re.exec(all))) inData.push(m[1]);
    J.skills.forEach(r => { nRows++; if (inData.indexOf(r.id) < 0) f('job ' + job + ': ' + r.id + ' is on the ladder but its lesson is not in ' + J.files.join(', ') + " as '" + r.id + "': { name: …"); });
    inData.forEach(id => { if (!J.skills.some(r => r.id === id)) f('job ' + job + ': ' + id + ' has a lesson but no row in its SkillsCore file (it would never show on a map)'); });
  });
  if (!fails.length) oks.push('add a skill: ' + nRows + ' Core Growth skill(s) in ' + Object.keys(jobs).length + ' job(s), ' + nFiles + ' data file(s): every row has its lesson and every lesson has its row');
  return { fails, oks, rows: realRows, ids: ev(rt, 'Object.keys(CR_SKILLS)') };
}

/* Part 3, on the boy page the test kit already opened (all add-ons loaded). */
async function page(pg, ids) {
  const fails = [], oks = [];
  const r = await pg.evaluate(ids => {
    const o = { missing: [], notCore: [], noBite: [], kit: !!window.CORE_ADD };
    ids.forEach(id => { if (typeof BANK_ALL === 'undefined' || !BANK_ALL[id]) o.missing.push(id); else if (!(window.CORE_LESSONS || {})[id]) o.notCore.push(id);
      const b = (window.ONE_BITE || {})[id]; if (!b || !(b.do || []).length || !(b.your || []).length) o.noBite.push(id); });
    if (!o.kit) return o;
    const id = 'WRIT.PARA.L06.99';
    const L = { name: 'Made-up kit test', teach: [{ q: 'Pick the topic sentence.', o: ['A', 'B', 'C'], how: 'Find the big idea.' }], practice: [{ q: 'Which one?', o: ['A', 'B'], h: 'Look again.' }],
      check: [{ q: 'One?', o: ['A', 'B'] }, { q: 'Two?', o: ['A', 'B'] }, { q: 'Three?', o: ['A', 'B'] }], tt: { big: 'x' }, bite: { band: 'E45' }, how: { s: 'x' } };
    CORE_ADD('ZZ', { [id]: L });
    o.added = !!(BANK_ALL[id] && WRIT[id] && TL_TEACH[id] && ONE_BITE[id] && TL_DO[id] && !BANK_ALL[id].tt && !BANK_ALL[id].bite);
    try { o.builds = buildMission(id).length > 0; } catch (e) { o.builds = false; }
    delete BANK_ALL[id]; delete WRIT[id]; delete TL_TEACH[id]; delete ONE_BITE[id]; delete TL_DO[id]; delete CORE_LESSONS[id];
    return o; }, ids || []);
  if (!r.kit) fails.push('add a skill: CORE_ADD is missing on the boy page (CoreKit.html did not load)');
  else {
    if (!r.added) fails.push('add a skill: CORE_ADD did not put a lesson into BANK_ALL, WRIT, TL_TEACH, ONE_BITE and TL_DO');
    if (!r.builds) fails.push('add a skill: a lesson added with CORE_ADD does not build (buildMission)');
  }
  r.missing && r.missing.forEach(id => fails.push('add a skill: ' + id + ' is on a ladder but is not a lesson on the boy page'));
  r.notCore && r.notCore.forEach(id => fails.push('add a skill: ' + id + ' is on a ladder as a Core Growth skill but its lesson was not added with CORE_ADD'));
  r.noBite && r.noBite.forEach(id => fails.push('add a skill: ' + id + ' needs a hand-written lesson (bite) with do and your activities, so the quality gate checks it'));
  if (!fails.length) oks.push('add a skill: CORE_ADD works on the boy page; all ' + (ids || []).length + ' Core Growth skill(s) are lessons there');
  return { fails, oks };
}

module.exports = { server, page };
if (require.main === module) { const r = server(); console.log(r.oks.join('\n')); console.log(r.fails.length ? r.fails.join('\n') : 'ADD A SKILL OK'); }
