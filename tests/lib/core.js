/* Core Growth (job T, 2026-11-24): the one way to add a new skill (src/CoreSkills.js, docs/core-growth/HOW-TO-ADD-A-SKILL.md).
   server(): with made-up rows, a new skill lands in the right place on its ladder, in the curriculum index and in plList_; a chain of
             rows follows its first row; bad rows are refused and reported. Then the REAL job lists (src/CoreData<Job>.js) have no
             problems, every data file they name exists and is under 150 KB, and the boy's page pieces still match the old loader byte for byte.
   page(pg): on the boy's page every lesson in a core data file reached BANK_ALL with no clash, and every listed skill that is "built"
             on the server is a real lesson on the page. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const B = require('./build.js');

function server() {
  const fails = [], oks = [], fail = m => fails.push('core skills: ' + m);
  /* 1. the mechanism, with made-up rows (no file is written) */
  {
    const { ctx } = B.sandbox();
    vm.runInContext(`CORE_MERGED_ = null; CORE_SKILLS = { ZZTEST: [
      ['READ.COMP.L06.91', 'Test A', 'Made-up skill A', { after: 'READ.COMP.L06.01', std: 'RI.5.2', file: 'CoreDataZZTEST1', min: 8 }],
      ['READ.COMP.L06.92', 'Test B', 'Made-up skill B', { file: 'CoreDataZZTEST1' }],
      ['LANG.GRAM.L09.91', 'Test C', 'Made-up skill C', { before: 'LANG.GRAM.L09.01', file: 'CoreDataZZTEST2' }],
      ['READ.COMP.L06.93', 'Bad level', 'Wrong level', { after: 'READ.COMP.L05.01', file: 'CoreDataZZTEST1' }],
      ['READ.COMP.L06.94', 'No place', 'Unknown place', { after: 'READ.COMP.L06.77', file: 'CoreDataZZTEST1' }],
      ['READ.COMP.L06.01', 'Dup', 'Already there', { after: 'READ.COMP.L06.02', file: 'CoreDataZZTEST1' }] ] };`, ctx);
    const r = JSON.parse(vm.runInContext('JSON.stringify(coreReport_())', ctx));
    const ids = JSON.parse(vm.runInContext('JSON.stringify(plList_("READ").map(function (x) { return x[0]; }))', ctx));
    const lang = JSON.parse(vm.runInContext('JSON.stringify(plList_("LANG").map(function (x) { return x[0]; }))', ctx));
    const i = ids.indexOf('READ.COMP.L06.01');
    if (ids[i + 1] !== 'READ.COMP.L06.91' || ids[i + 2] !== 'READ.COMP.L06.92') fail('a new skill must sit right after its place, and the next row after it (got ' + ids.slice(i, i + 3).join(', ') + ')');
    if (lang[lang.indexOf('LANG.GRAM.L09.01') - 1] !== 'LANG.GRAM.L09.91') fail('"before" must put the skill right in front of its place');
    if (ids.filter(x => x === 'READ.COMP.L06.01').length !== 1) fail('an existing skill must never be added twice');
    if (ids.includes('READ.COMP.L06.93') || ids.includes('READ.COMP.L06.94')) fail('a row on the wrong level or with an unknown place must not be added');
    const need = ['READ.COMP.L06.93: its place', 'READ.COMP.L06.94: was not added', 'READ.COMP.L06.01: already on the ladder'];
    need.forEach(n => { if (!r.problems.some(p => p.indexOf(n) >= 0)) fail('the problem list must report ' + n); });
    if (r.problems.some(p => /L06\.9[12]|L09\.91/.test(p))) fail('good rows were reported as problems: ' + r.problems.filter(p => /L06\.9[12]|L09\.91/.test(p)).join(' | '));
    const ci = JSON.parse(vm.runInContext('JSON.stringify({ lad: CI_INDEX.lad.READ.map(function (x) { return x[0]; }), sk: CI_INDEX.sk["READ.COMP.L06.91"], built: CI_INDEX.built })', ctx));
    if (ci.lad.indexOf('READ.COMP.L06.91') !== ci.lad.indexOf('READ.COMP.L06.01') + 1 || !ci.sk || ci.sk[0] !== 'Test A' || !/\+core3$/.test(ci.built)) fail('the curriculum index must get the new skills in the same order, with names and a new cache key');
    if (JSON.stringify(r.files) !== JSON.stringify(['CoreKit', 'CoreDataZZTEST1', 'CoreDataZZTEST2'])) fail('the page must load CoreKit first, then each data file once (got ' + r.files.join(', ') + ')');
    const again = vm.runInContext('coreMerge_(); coreMerge_(); plList_("READ").filter(function (x) { return x[0] === "READ.COMP.L06.91"; }).length', ctx);
    if (again !== 1) fail('merging twice must not add a skill twice');
    const sg = vm.runInContext('sgNames_()["READ.COMP.L06.91"]', ctx);
    if (!sg || sg[0] !== 'Test A') fail('the staff grid names must include a new Reading skill');
    if (!fails.length) oks.push('core skills: a new skill joins its ladder in the right place (after, before, chains), the curriculum index and the staff grid; bad rows are refused and named');
  }
  /* 2. the real job lists */
  {
    const { ctx, loadErrors } = B.sandbox(); if (loadErrors.length) return { fails: fails.concat(loadErrors.map(e => 'core skills: ' + e)), oks };
    const r = JSON.parse(vm.runInContext('JSON.stringify(coreReport_())', ctx));
    r.built = JSON.parse(vm.runInContext('JSON.stringify(plBuilt_())', ctx)).filter(id => r.merged.ids.includes(id));
    r.problems.forEach(p => fail(p));
    r.files.forEach(f => { const p = path.join(B.SRC, f + '.html'); if (!fs.existsSync(p)) fail('src/' + f + '.html is listed but missing'); else if (fs.statSync(p).size > 150 * 1024) fail('src/' + f + '.html is over 150 KB: start the next file'); });
    const body = vm.runInContext('msQuestToolsBody_().js', ctx), parts = JSON.parse(vm.runInContext('JSON.stringify(msQuestToolsParts([]))', ctx));
    if (parts.order.map(h => parts.parts[h]).join('') !== body) fail("the boy's page pieces (Speed.js) do not match msQuestToolsBody_ (Photos.js)");
    const reg = fs.readdirSync(B.SRC).filter(f => /^CoreData[A-Z][A-Z0-9]*\.js$/.test(f));
    reg.forEach(f => { const t = fs.readFileSync(path.join(B.SRC, f), 'utf8'), job = f.slice(8, -3); if (t.indexOf('CORE_SKILLS.' + job + ' = [') < 0) fail('src/' + f + ' must set CORE_SKILLS.' + job + ' (its own job only)'); });
    if (!r.problems.length) oks.push('core skills: ' + r.merged.added + ' new skill(s) from ' + reg.length + ' job list(s), ' + Math.max(0, r.files.length - 1) + ' data file(s), no problems');
    return { fails, oks, rep: r };
  }
}

async function page(pg, rep) {
  if (!rep) rep = server().rep;
  const fails = [], oks = [], fail = m => fails.push('core skills (page): ' + m);
  const got = await pg.evaluate(ids => {
    const C = window.TLCORE || { ids: {}, clash: [] }, BA = (typeof BANK_ALL !== 'undefined') ? BANK_ALL : {};
    return { kit: !!window.TLCORE, clash: C.clash || [], mine: Object.keys(C.ids || {}), missing: ids.filter(id => !BA[id] || !BA[id].name), bad: Object.keys(C.ids || {}).filter(id => { const L = BA[id]; return !L || !Array.isArray(L.check) || L.check.length < 3; }) };
  }, (rep && rep.merged.ids) || []);
  const files = (rep && rep.files) || [];
  if (files.length && !got.kit) fail('CoreKit did not load on the boy\'s page');
  got.clash.forEach(c => fail('a core lesson tried to replace an existing lesson: ' + c + ' (improve it in its own file, or pick a new id)'));
  got.bad.forEach(id => fail(id + ' needs 3 or more check questions'));
  const built = new Set(rep && rep.built || []);
  got.missing.filter(id => built.has(id)).forEach(id => fail(id + ' is "built" on the server but not a lesson on the page'));
  const notYet = got.missing.filter(id => !built.has(id));
  if (!fails.length) oks.push('core skills (page): ' + got.mine.length + ' core lesson(s) loaded, no clash' + (notYet.length ? '; listed, no lesson yet (hidden from boys): ' + notYet.length : ''));
  return { fails, oks };
}

module.exports = { server, page };
