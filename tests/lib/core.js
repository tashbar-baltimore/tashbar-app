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
      ['READ.COMP.L06.01', 'Dup', 'Already there', { after: 'READ.COMP.L06.02', file: 'CoreDataZZTEST1' }] ] };
      CORE_DATA_FILES = { ZZTEST: ['CoreDataZZTEST3', 'CoreDataZZTEST1', 'not a file name'] };`, ctx);
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
    const ci = JSON.parse(vm.runInContext('JSON.stringify({ lad: CI_INDEX.lad.READ.map(function (x) { return x[0]; }), names: CI_INDEX.lad.READ.filter(function (x) { return x[0] === "READ.COMP.L06.91"; })[0], sk: CI_INDEX.sk["READ.COMP.L06.91"], built: CI_INDEX.built })', ctx));
    if (ci.lad.indexOf('READ.COMP.L06.91') !== ci.lad.indexOf('READ.COMP.L06.01') + 1 || !ci.names || ci.names[1] !== 'Test A' || ci.sk || !/\+core3\.[0-9a-z]+$/.test(ci.built)) fail('the curriculum index must get the new skills in the same order, with names, no "built" entry, and a new cache key');
    if (r.files[0] !== 'CoreKit' || JSON.stringify(r.files.filter(f => /^CoreData/.test(f))) !== JSON.stringify(['CoreDataZZTEST1', 'CoreDataZZTEST2', 'CoreDataZZTEST3'])) fail('the page must load CoreKit first, then each data file once, upgrade-only files (CORE_DATA_FILES) too, bad names never (got ' + r.files.join(', ') + ')');
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
    r.files.filter(f => !/^Core(Kit|Reader|Write)/.test(f)).forEach(f => { const p = path.join(B.SRC, f + '.html'); if (!fs.existsSync(p)) fail('src/' + f + '.html is listed but missing'); else if (fs.statSync(p).size > 150 * 1024) fail('src/' + f + '.html is over 150 KB: start the next file'); });
    const body = vm.runInContext('msQuestToolsBody_().js', ctx), parts = JSON.parse(vm.runInContext('JSON.stringify(msQuestToolsParts([]))', ctx));
    if (parts.order.map(h => parts.parts[h]).join('') !== body) fail("the boy's page pieces (Speed.js) do not match msQuestToolsBody_ (Photos.js)");
    const reg = fs.readdirSync(B.SRC).filter(f => /^CoreData[A-Z][A-Z0-9]*\.js$/.test(f));
    reg.forEach(f => { const t = fs.readFileSync(path.join(B.SRC, f), 'utf8'), job = f.slice(8, -3); if (t.indexOf('CORE_SKILLS.' + job + ' = [') < 0 && t.indexOf('CORE_DATA_FILES.' + job + ' = [') < 0) fail('src/' + f + ' must set CORE_SKILLS.' + job + ' or CORE_DATA_FILES.' + job + ' (its own job only)'); });
    try { const cw = require('./corewrite.js')(); cw.fails.forEach(x => fails.push(x)); if (!cw.fails.length) oks.push('writing inbox (server): draft, send, locked while the teacher has it, other boys kept out, send back needs a note, fix and resend, publish to his book, no money'); } catch (e) { fail('writing inbox server check crashed: ' + String(e).slice(0, 200)); }
    try { const cu = require('./coreunits.js').server(); cu.fails.forEach(x => fails.push(x)); (cu.oks || []).forEach(o => oks.push(o)); } catch (e) { fail('unit checks server check crashed: ' + String(e).slice(0, 200)); }
    if (!r.problems.length) oks.push('core skills: ' + r.merged.added + ' new skill(s) from ' + reg.length + ' job list(s), ' + r.files.filter(f => /^CoreData/.test(f)).length + ' data file(s), no problems');
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
  if (!got.kit) fail('CoreKit did not load on the boy\'s page');
  got.clash.forEach(c => fail('a core lesson tried to replace an existing lesson: ' + c + ' (improve it in its own file, or pick a new id)'));
  got.bad.forEach(id => fail(id + ' needs 3 or more check questions'));
  const built = new Set(rep && rep.built || []);
  got.missing.filter(id => built.has(id)).forEach(id => fail(id + ' is "built" on the server but not a lesson on the page'));
  const notYet = got.missing.filter(id => !built.has(id));
  /* the content store: a made-up text, served the way the site serves /texts/<ID>.json, loads only when asked, once */
  {
    const F = require('../../tools/core/textfmt.js');
    const r = F.parse(FIXTURE_TEXT, 'fixture'); const probs = r.problems.concat(F.check(r.text, null));
    if (probs.length) fail('the made-up text has problems: ' + probs.join('; '));
    let hits = 0;
    await pg.route('**/texts/ZZTEST.ANTS.01.json', route => { hits++; route.fulfill({ contentType: 'application/json', body: JSON.stringify(r.text) }); });
    await pg.route('**/texts/ZZTEST.NOPE.01.json', route => route.fulfill({ status: 404, body: 'not found' }));
    const t = await pg.evaluate(async () => {
      const a = await TLCORE.text('ZZTEST.ANTS.01'), b = await TLCORE.text('ZZTEST.ANTS.01');
      let miss = ''; try { await TLCORE.text('ZZTEST.NOPE.01'); } catch (e) { miss = String(e.message || e); }
      let bad = ''; try { await TLCORE.text('../x'); } catch (e) { bad = String(e.message || e); }
      return { same: a === b, title: a.title, pages: a.pages.length, n: TLCORE.textSentences(a).length, word: a.glossary.colony, miss, bad };
    });
    if (hits !== 1 || !t.same) fail('a text must be fetched once and kept (fetched ' + hits + ' times)');
    if (t.title !== 'The Busy Ant Colony' || t.pages !== 2 || t.n !== r.text.pages.reduce((n, pg) => n + pg.reduce((m, p) => m + p.s.length, 0), 0) || !t.word) fail('the text did not arrive whole: ' + JSON.stringify(t));
    if (!/not on the site/.test(t.miss) || !/not a text id/.test(t.bad)) fail('a missing text or a bad id must give a clear error (got ' + t.miss + ' | ' + t.bad + ')');
    const T = require('../../tools/core/texts.js').load(); T.problems.forEach(p => fail('text: ' + p));
    if (!fails.length) oks.push('content store: a long text loads only when opened, once; ' + T.out.length + ' real text(s) in texts/, no problems');
  }
  /* the Reader (src/CoreReader.html), with a made-up chapter (tests/fixtures/ZZTEST.KEY.01.txt), as a boy taps it */
  {
    const F = require('../../tools/core/textfmt.js');
    const RT = F.parse(fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'ZZTEST.KEY.01.txt'), 'utf8'), 'fixture').text;
    await pg.route('**/texts/ZZTEST.KEY.01.json', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(RT) }));
    const sents = []; RT.pages.forEach((pg2, i) => pg2.forEach(par => par.s.forEach(x => sents.push({ page: i, s: x }))));
    const proof = sents.findIndex(x => /Dovid gasped/.test(x.s)), wrong = sents.findIndex(x => /flowerpot/.test(x.s));
    const one = async (vp) => {
      await pg.setViewportSize(vp);
      return pg.evaluate(async ([proof, wrong]) => {
        const out = { steps: [] }, Q = s => document.querySelector(s), tick = () => new Promise(r => setTimeout(r, 60));
        const look = async name => { await new Promise(r => setTimeout(r, 380)); const el = Q('#crd'); const mains = el.querySelectorAll('.tlk-main').length, all = [...el.querySelectorAll('button')];
          out.steps.push({ name, mains, ownButtons: all.filter(b => !b.classList.contains('tlk')).length, wide: el.scrollWidth > innerWidth + 1 || (Q('#crd .crd-main') && Q('#crd .crd-main').scrollWidth > innerWidth + 1), exitTL: !!el.querySelector('.tlk-home.tlk-at-tl,.tlk-x.tlk-at-tl') }); };
        if (!A.st) A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' });   /* the Reader keeps his page in his own state */
        try { if (A.st) delete (A.st.reads || {})['ZZTEST.KEY.01']; } catch (e) {}
        const pr = TLCORE.reader.open('ZZTEST.KEY.01', { grade: 3 }); await new Promise(r => { const t = setInterval(() => { if (Q('#crd .crd-cover')) { clearInterval(t); r(); } }, 30); });
        await look('cover'); Q('#crd [data-crd=start]').click(); await tick(); await look('page 1');
        out.backOnFirst = !!Q('#crd [data-crd=back]'); out.prog = (Q('#crd .tlk-pill') || {}).textContent;
        const g = Q('#crd .crd-g'); g.click(); await tick(); out.bubble = (Q('#crd .crd-bub') || {}).textContent || '';
        Q('#crd [data-crd=next]').click(); await tick(); await look('page 2'); out.back2 = !!Q('#crd [data-crd=back]');
        Q('#crd [data-crd=next]').click(); await tick(); Q('#crd [data-crd=next]').click(); await tick(); await look('end'); out.end = (Q('#crd .crd-end h2') || {}).textContent;
        Q('#crd [data-crd=finish]').click(); out.res = await pr; out.closed = !Q('#crd'); out.saved = A.st && A.st.reads && A.st.reads['ZZTEST.KEY.01'];
        const pa = TLCORE.reader.open('ZZTEST.KEY.01', { grade: 3, exit: 'x', ask: { q: 'Which sentence shows Dovid was surprised?', proof: 'Dovid gasped', how: 'Find the words that show a surprise.', look: 'how Dovid felt' } });
        await new Promise(r => { const t = setInterval(() => { if (Q('#crd.pick')) { clearInterval(t); r(); } }, 30); });
        await look('ask'); out.askOpenEarlyAnswer = !!Q('#crd .crd-s.yes'); out.askMain = Q('#crd .tlk-main') ? Q('#crd .tlk-main').textContent : '';
        Q('#crd [data-crds="' + wrong + '"]').click(); await tick(); out.miss = (Q('#crd .crd-fb') || {}).textContent;
        Q('#crd [data-crds="' + proof + '"]').click(); await tick(); out.hit = (Q('#crd .crd-fb') || {}).textContent; out.yes = !!Q('#crd [data-crds="' + proof + '"].yes'); await look('proof');
        Q('#crd [data-crd=finish]').click(); out.askRes = await pa; out.afterAsk = A.st && A.st.reads && A.st.reads['ZZTEST.KEY.01'];
        const pk = TLCORE.reader.open('ZZTEST.KEY.01', { grade: 0, page: 0 }); await new Promise(r => { const t = setInterval(() => { if (Q('#crd .crd-cover')) { clearInterval(t); r(); } }, 30); });
        out.k1 = Q('#crd').className; out.k1home = !!Q('#crd .tlk-home-k3'); TLCORE.reader.close(); out.k1res = await pk;
        return out;
      }, [proof, wrong]);
    };
    for (const vp of [{ width: 1366, height: 768 }, { width: 390, height: 844 }]) {
      const at = vp.width + 'px: '; let o;
      try { o = await one(vp); } catch (e) { fail(at + 'the Reader crashed: ' + String(e).slice(0, 200)); continue; }
      o.steps.forEach(st => { if (st.mains > 1) fail(at + st.name + ' has ' + st.mains + ' main buttons (at most one)'); if (st.ownButtons) fail(at + st.name + ' draws ' + st.ownButtons + ' button(s) outside the button system'); if (st.wide) fail(at + st.name + ' scrolls sideways'); if (!st.exitTL) fail(at + st.name + ': the way out must be top left'); });
      if (o.backOnFirst) fail(at + 'no Back on the first page');
      if (!o.back2) fail(at + 'Grade 3 gets ‹ Back on page 2');
      if (o.prog !== 'Page 1 of 3') fail(at + 'progress must say Page 1 of 3 (got ' + o.prog + ')');
      if (!/puzzled/.test(o.bubble) || !/figure it out/.test(o.bubble)) fail(at + 'tapping a word must show its meaning (got ' + o.bubble + ')');
      if (o.end !== 'Chapter 1 done!' || !o.res.done || !o.closed || o.saved !== 'd') fail(at + 'finishing must show "Chapter 1 done!", close, and keep it as done (' + JSON.stringify({ end: o.end, res: o.res, saved: o.saved }) + ')');
      if (o.askOpenEarlyAnswer) fail(at + 'the proof must not be shown before he tries');
      if (!/does not say it/.test(o.miss || '') || !/Yes!/.test(o.hit || '') || !o.yes) fail(at + 'tap the sentence: a miss names what to look for, the proof lights up (' + o.miss + ' | ' + o.hit + ')');
      if (o.afterAsk !== 'd') fail(at + 'a question must not change where he stopped reading (got ' + o.afterAsk + ')');
      if (!o.askRes.proof || !o.askRes.proof.right || o.askRes.proof.tries !== 2) fail(at + 'the proof result must say right after 2 tries (' + JSON.stringify(o.askRes.proof) + ')');
      if (!/b-K1/.test(o.k1) || !o.k1home) fail(at + 'a K boy gets the big K1 type and the K-3 Home button (' + o.k1 + ')');
    }
    await pg.setViewportSize({ width: 1366, height: 768 });
    if (!fails.length) oks.push('Reader: cover, pages, tap a word for its meaning, Back from Grade 3, chapter done and kept, tap the sentence that proves it (miss names the step, no early answer), K-1 band; button system only, no sideways scroll at 1366 and 390');
  }
  try { const k1 = await require('./corek1.js')(pg); k1.fails.forEach(f => fails.push(f)); k1.oks.forEach(o => oks.push(o)); } catch (e) { fail('K-1 games crashed: ' + String(e).slice(0, 200)); }
  try { const ks = await require('./corestory.js')(pg); ks.fails.forEach(f => fails.push(f)); ks.oks.forEach(o => oks.push(o)); } catch (e) { fail('K-1 listen-along story test crashed: ' + String(e).slice(0, 200)); }   /* job F helper: the story piece (CoreK1.html) and CoreDataFH3 */
  try { const un = await require('./coreunits.js').page(pg); un.fails.forEach(f => fails.push(f)); un.oks.forEach(o => oks.push(o)); } catch (e) { fail('unit checks (page) crashed: ' + String(e).slice(0, 200)); }
  try { const su = await require('./ssunits.js').page(pg); su.fails.forEach(f => fails.push(f)); su.oks.forEach(o => oks.push(o)); } catch (e) { fail('Social Studies unit checks crashed: ' + String(e).slice(0, 200)); }   /* HoS 2026-11-25 (#432): src/CoreDataS11.html */
  try { const cu = await require('./corewriteui.js')(pg); cu.fails.forEach(f => fails.push(f)); cu.oks.forEach(o => oks.push(o)); } catch (e) { fail('Writing Workshop screens crashed: ' + String(e).slice(0, 200)); }
  try { const qw = await require('./quickwrite.js')(pg); qw.fails.forEach(f => fails.push(f)); qw.oks.forEach(o => oks.push(o)); } catch (e) { fail('quick writes crashed: ' + String(e).slice(0, 200)); }   /* W13 helper, HoS 2026-11-27: src/CoreDataW13H7.html */
  await pg.setViewportSize({ width: 390, height: 844 });
  try { const ca = await require('./coreacts.js')(pg); ca.fails.forEach(f => fails.push('390px: ' + f)); } catch (e) { fail('new activity kinds (390 px) crashed: ' + String(e).slice(0, 200)); }
  await pg.setViewportSize({ width: 1366, height: 768 });
  try { const ca = await require('./coreacts.js')(pg); ca.fails.forEach(f => fails.push(f)); ca.oks.forEach(o => oks.push(o)); } catch (e) { fail('new activity kinds crashed: ' + String(e).slice(0, 200)); }
  /* TLCORE.upgrade: a One Bite lesson for a skill that already has its lesson (job S), with nothing replaced; refusals are named */
  {
    const u = await pg.evaluate(() => {
      const C = window.TLCORE, out = { bad: [] }; if (!C || !C.upgrade) return { bad: ['TLCORE.upgrade is missing'] };
      const id = Object.keys(BANK_ALL).filter(x => /^SCI\.[A-Z]+\.L0[5-9]\.\d\d$/.test(x) && !(window.ONE_BITE || {})[x] && !(C.up || {})[x]).sort()[0];
      if (!id) return { bad: ['no Science skill without a One Bite lesson to test with'] };
      const keepQ = JSON.stringify(BANK_ALL[id]), n0 = C.clash.length, bite = { band: 'E45', today: 'Test', do: [], your: [] };
      const n = C.upgrade('ZZTEST', { bite: { [id]: bite, 'SCI.NOPE.L05.99': bite } });
      if (n !== 1 || ONE_BITE[id] !== bite) out.bad.push('a real skill must get its One Bite lesson (got ' + n + ')');
      if (JSON.stringify(BANK_ALL[id]) !== keepQ) out.bad.push('the skill\'s own questions must not change');
      if (!C.clash.slice(n0).some(x => /SCI\.NOPE\.L05\.99: upgrade of a skill that has no lesson/.test(x))) out.bad.push('a skill with no lesson must be refused and named');
      const other = { band: 'E45', today: 'Other' }; C.upgrade('ZZTEST2', { bite: { [id]: other } });
      if (ONE_BITE[id] !== bite || !C.clash.slice(n0).some(x => x.indexOf('ZZTEST2 ' + id) === 0)) out.bad.push('a second upgrade must never replace the first, and must be named');
      delete ONE_BITE[id]; delete C.up[id]; C.clash.length = n0;   /* put the page back */
      return out;
    }).catch(e => ({ bad: ['crashed: ' + String(e).slice(0, 200)] }));
    u.bad.forEach(b => fail('TLCORE.upgrade: ' + b));
    if (!u.bad.length) oks.push('TLCORE.upgrade: an existing skill gets a One Bite lesson with its questions untouched; a skill with no lesson, and a second upgrade, are refused and named');
  }
  try { const rk = await require('./corereadkinds.js')(pg); rk.fails.forEach(f => fails.push(f)); rk.oks.forEach(o => oks.push(o)); } catch (e) { fail('read and proof kinds crashed: ' + String(e).slice(0, 200)); }
  if (!fails.length) oks.push('core skills (page): ' + got.mine.length + ' core lesson(s) loaded, no clash' + (notYet.length ? '; listed, no lesson yet (hidden from boys): ' + notYet.length : ''));
  return { fails, oks };
}

const FIXTURE_TEXT = `id: ZZTEST.ANTS.01
title: The Busy Ant Colony
grade: 5
kind: article
topic: Ants
source: original
---
${'An ant colony is like a busy town. Every ant has a job to do, and the whole colony works together. '.repeat(30)}

The queen lays the eggs. Worker ants find food, and soldier ants guard the nest.
===
When Avi and his Zaidy watched an ant hill in the park, they counted more than fifty ants in one minute. "They never stop," said Avi.
--- words
colony: a big group of ants that live and work together
`;

module.exports = { server, page };
