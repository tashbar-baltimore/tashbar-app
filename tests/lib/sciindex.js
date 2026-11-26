/* SCIENCE INDEX NAMES (issue #391, HoS decision 2026-11-25, option a): the name staff see for a Science skill (the Departments
   course map and the skill-flow chart read CI_INDEX.lad.SCI; the staff grid reads SCI_K8) is the name of the lesson a boy really
   gets under that id (BANK_ALL[id].name). The old index topics that have no lesson (the Torah-linked ones: Kiddush HaChodesh,
   the Molad, Kilayim, Shemitah, Birkas HaChamah, and others) stay in the index as PLANNED skills: never on a boy's path.
     server(): the index and the ladder agree, planned rows are well formed, and a Core Growth merge keeps them.
     page(pg): on the boy's page, every Science lesson's own name matches the index and the ladder. */
const vm = require('vm'), B = require('./build.js');
const NEED = ['Kiddush HaChodesh', 'Molad', 'Kilayim', 'Shemitah', 'Birkas HaChamah'];
const norm = s => String(s == null ? '' : s).replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
const PLANNED_RE = /^SCI\.[A-Z]+\.L\d\d\.9\d$/;

function read(ctx) { return JSON.parse(vm.runInContext('JSON.stringify({ lad: CI_INDEX.lad.SCI, k8: SCI_K8 })', ctx)); }

function check(d, fails, where) {
  const k8 = {}; d.k8.forEach(r => { k8[r[0]] = r; });
  const seen = {}; let planned = 0;
  d.lad.forEach(r => {
    if (seen[r[0]]) fails.push(where + r[0] + ' is in the Science index twice'); seen[r[0]] = 1;
    if (k8[r[0]]) { if (norm(k8[r[0]][1]) !== norm(r[1])) fails.push(where + r[0] + ': the index says "' + r[1] + '" but the Science path (SCI_K8) says "' + k8[r[0]][1] + '"'); return; }
    planned++;
    if (!PLANNED_RE.test(r[0]) || !/^Planned/.test(r[2] || '')) fails.push(where + r[0] + ' "' + r[1] + '" is in the index but not on the Science path: a planned skill needs a .9x number and a "Planned" note');
  });
  d.k8.forEach(r => { if (!seen[r[0]]) fails.push(where + r[0] + ' is on the Science path but missing from the Science index'); if (PLANNED_RE.test(r[0])) fails.push(where + r[0] + ' is a planned skill (.9x) but it is on a boy\'s Science path'); });
  NEED.forEach(t => { if (!d.lad.some(r => PLANNED_RE.test(r[0]) && r[1].indexOf(t) >= 0)) fails.push(where + 'the planned Torah-linked topic "' + t + '" is missing from the Science index'); });
  return planned;
}

function server() {
  const fails = [], oks = [];
  { const { ctx, loadErrors } = B.sandbox(); if (loadErrors.length) return { fails: loadErrors.map(e => 'science index: ' + e), oks };
    vm.runInContext('if (typeof coreMerge_ === "function") coreMerge_();', ctx);
    const n = check(read(ctx), fails, 'science index: ');
    if (!fails.length) oks.push('science index (#391): every Science skill has the name of its real lesson on the staff map and path; ' + n + ' planned topics (Kiddush HaChodesh, the Molad, Kilayim, Shemitah, Birkas HaChamah, …) kept off the boys\' path'); }
  /* a Core Growth Science skill rebuilds CI_INDEX.lad.SCI from the ladder: the planned rows must survive it */
  { const { ctx } = B.sandbox();
    vm.runInContext('CORE_MERGED_ = null; CORE_SKILLS = { ZZTEST: [["SCI.SKY.L07.05", "Test skill", "Test", { after: "SCI.SKY.L07.04", file: "CoreDataZZTEST" }]] };', ctx);
    vm.runInContext('coreMerge_();', ctx); const d = read(ctx), f2 = [];
    if (!d.k8.some(r => r[0] === 'SCI.SKY.L07.05')) f2.push('science index: the test Core Growth Science skill was not merged (the check below proves nothing)');
    check(d, f2, 'science index after a Core Growth merge: ');
    const ids = d.lad.map(r => r[0]), at = ids.indexOf('SCI.SKY.L07.91'); if (at < 1 || !/^SCI\.SKY\.L07\.0\d$/.test(ids[at - 1])) f2.push('science index after a Core Growth merge: the planned Molad row moved out of its unit');
    f2.forEach(x => fails.push(x)); if (!f2.length) oks.push('science index: a Core Growth Science skill keeps the planned topics in place'); }
  return { fails, oks };
}

async function page(pg) {
  const fails = [], oks = [];
  const { ctx } = B.sandbox(); vm.runInContext('if (typeof coreMerge_ === "function") coreMerge_();', ctx); const d = read(ctx);
  const names = await pg.evaluate(() => { const o = {}; Object.keys(BANK_ALL).filter(id => /^SCI\./.test(id)).forEach(id => { o[id] = BANK_ALL[id] && BANK_ALL[id].name; }); return o; });
  const lad = {}, k8 = {}; d.lad.forEach(r => { lad[r[0]] = r[1]; }); d.k8.forEach(r => { k8[r[0]] = r[1]; });
  let n = 0;
  Object.keys(names).forEach(id => {
    if (!lad[id] && !k8[id]) return;   /* Science lessons outside the K–8 ladder (high school) are not on this map */
    n++;
    if (norm(names[id]) !== norm(lad[id])) fails.push('science index (#391): ' + id + ' is called "' + lad[id] + '" on the staff map, but the lesson a boy gets is "' + names[id] + '"');
    if (norm(names[id]) !== norm(k8[id])) fails.push('science index (#391): ' + id + ' is called "' + k8[id] + '" on the Science path (SCI_K8), but the lesson a boy gets is "' + names[id] + '"');
  });
  Object.keys(lad).filter(id => PLANNED_RE.test(id) && names[id]).forEach(id => fails.push('science index: ' + id + ' is marked planned, but a lesson "' + names[id] + '" now exists under it: give it its real place on the Science path'));
  /* a real Science lesson must not show "No lesson yet" on the staff map (a Core Growth skill waits for the next index rebuild, by design) */
  const sk = JSON.parse(vm.runInContext('JSON.stringify(Object.keys(CI_INDEX.sk).filter(function (id) { return /^SCI\\./.test(id); }))', ctx)), core = JSON.parse(vm.runInContext('JSON.stringify((CORE_MERGED_ && CORE_MERGED_.ids) || [])', ctx));
  Object.keys(names).filter(id => k8[id] && sk.indexOf(id) < 0 && core.indexOf(id) < 0).forEach(id => fails.push('science index: ' + id + ' "' + names[id] + '" is a real lesson, but the staff map says "No lesson yet" (no CI_INDEX.sk entry)'));
  if (!n) fails.push('science index: no Science lessons found on the boy\'s page');
  if (!fails.length) oks.push('science index (#391): all ' + n + ' Science lessons on the boy\'s page have the same name on the staff map and the Science path');
  return { fails, oks };
}

module.exports = { server, page };
