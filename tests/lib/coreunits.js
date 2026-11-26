/* Core Growth (job T, T-5): unit checks and test-out. MADE-UP boys only.
   server(): on the real server code, a TEST- boy's pre-check is kept once (no second try to fish for skips), the skills he showed leave
             his Reading path, a skill he then missed in a unit check comes back, a passed check stays passed; a boy who is not a TEST- boy
             is changed with CU_LIVE 'on' (the live setting) and not while it is 'test'; staff and bad tokens are refused; no money and no mastery are written.
   page(pg):  with a made-up unit of real Reading lessons: the boss entrance, every question answered right -> "Unit cleared!" and the save;
             answered wrong -> "Almost there!" with "Practice: <the missed lesson>" that opens exactly that lesson; the pre-check shows what he
             skips; starting a unit's first lesson as a TEST- boy opens the pre-check first. Button system only, at 1366 and 390. */
const R = require('path').join(__dirname, '..', '..', 'server') + '/';
const { createRuntime } = require(R + 'runtime.js'), vm = require('vm');
function server() {
  const fails = [], f = m => fails.push('unit checks (server): ' + m), BOOK = 'SELFTEST_CU1';
  const store = { books: {}, props: { SCHOOL_STAGING_DATABASE_ID: BOOK } };
  const rt = createRuntime({ store });
  if (rt.loadErrors.length) return { fails: rt.loadErrors.map(e => 'server file failed to load: ' + e) };
  const TABLES = JSON.parse(vm.runInContext('JSON.stringify(TABLES)', rt.ctx)), bk = store.books[BOOK] = { tabs: {}, order: [] };
  TABLES.forEach(n => { bk.tabs['TL ' + n] = { rows: [['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']] }; bk.order.push('TL ' + n); });
  const res = (fn, ...a) => { try { const r = rt.call(fn, a); return r && r.error ? { error: String(r.error) } : (r && r.result !== undefined ? r.result : r); } catch (e) { return { error: String(e && e.message || e) }; } };
  res('msBootstrap');
  const H = (s, c) => vm.runInContext('msHash_(' + JSON.stringify(s) + ',' + JSON.stringify(c) + ')', rt.ctx);
  const boys = [['TEST-CU01', 'Made-up Boy A', '8123'], ['CU000002', 'Made-up Boy B', '8124']];
  const roster = bk.tabs.MS_Roster.rows; boys.forEach((b, i) => { const row = roster[0].map(() => ''); row[0] = b[0]; row[1] = b[1]; row[5] = 'cusalt' + i; row[6] = H('cusalt' + i, b[2]); row[7] = true; roster.push(row); });
  vm.runInContext("CacheService.getScriptCache().put('ms_tok_cu-staff', JSON.stringify({role:'staff',sid:null,pid:null,staff:null,who:{id:'CUT',name:'Made-up Rebbe',role:'head'}}), 600)", rt.ctx);
  boys.forEach(b => res('libApply', 'cu-staff', { action: 'place', boys: [b[0]], key: 'READ', level: 5 }));
  const plan = sid => JSON.parse(vm.runInContext('JSON.stringify(plPlanFor_(' + JSON.stringify(sid) + ', {}).place.READ || null)', rt.ctx));
  const p0 = plan('TEST-CU01'); if (!p0 || !p0.path || p0.path.length < 4) return { fails: ['unit checks (server): the made-up boy has no Reading path to test with (' + JSON.stringify(p0).slice(0, 120) + ')'] };
  const show = p0.path.slice(1, 3);
  const A = res('msSignInFast', '8123'), B = res('msSignInFast', '8124');
  if (!A || !A.token || !B || !B.token) return { fails: ['unit checks (server): the made-up boys could not sign in'] };
  const before = JSON.stringify(bk.tabs.MS_State.rows) + JSON.stringify(bk.tabs.MS_Bank || '');
  const s1 = res('cuSave', A.token, 'ZZTEST.U01', 'pre', { shown: show });
  if (!s1 || !s1.ok || !s1.row.pre || s1.row.shown.join() !== show.join()) f('the pre-check did not save (' + JSON.stringify(s1) + ')');
  const s2 = res('cuSave', A.token, 'ZZTEST.U01', 'pre', { shown: p0.path.slice(0, 4) });
  if (!s2 || !s2.already || s2.row.shown.join() !== show.join()) f('a second pre-check must not change the first');
  const p1 = plan('TEST-CU01');
  if (show.some(id => p1.path.indexOf(id) >= 0) || p1.path.length !== p0.path.length - 2 || p1.skippedShown !== 2) f('the skills he showed must leave his path (' + JSON.stringify({ before: p0.path.slice(0, 4), after: p1.path.slice(0, 3) }) + ')');
  res('cuSave', B.token, 'ZZTEST.U01', 'pre', { shown: show });
  if (vm.runInContext('CU_LIVE', rt.ctx) !== 'on') f('unit checks must be on for every boy (HoS decision 2026-11-24): CU_LIVE is ' + vm.runInContext('CU_LIVE', rt.ctx));
  const pOn = plan('CU000002'); if (show.some(id => pOn.path.indexOf(id) >= 0)) f('with CU_LIVE "on", the skills any boy showed must leave his path');
  vm.runInContext("CU_LIVE = 'test'", rt.ctx);
  const pb = plan('CU000002'); if (show.some(id => pb.path.indexOf(id) < 0)) f('while CU_LIVE is "test", a boy who is not a TEST- boy must keep his whole path');
  vm.runInContext("CU_LIVE = 'on'", rt.ctx);
  const c1 = res('cuSave', A.token, 'ZZTEST.U01', 'check', { right: 6, total: 10, missed: [show[0]] });
  if (!c1 || c1.row.passed || c1.row.missed[0] !== show[0]) f('6 of 10 must not pass, and keep the missed skill');
  if (plan('TEST-CU01').path.indexOf(show[0]) < 0) f('a skill he missed in the unit check must come back into his path');
  const c2 = res('cuSave', A.token, 'ZZTEST.U01', 'check', { right: 9, total: 10, missed: [] });
  if (!c2 || !c2.row.passed || c2.row.tries !== 2) f('9 of 10 must pass (' + JSON.stringify(c2) + ')');
  const c3 = res('cuSave', A.token, 'ZZTEST.U01', 'check', { right: 1, total: 10, missed: [show[1]] });
  if (!c3 || !c3.row.passed) f('a passed unit must stay passed');
  const sx = res('cuSave', A.token, 'ZZTEST.U03', 'pre', { shown: ['SS.GEO.L05.01', 'SS.HIST.L05.02', 'SCI.SKY.L05.01', 'NOPE.X.L05.01'] });   /* Social Studies (#432): its skill ids are kept like Science's */
  if (!sx || !sx.ok || sx.row.shown.join() !== 'SS.GEO.L05.01,SS.HIST.L05.02,SCI.SKY.L05.01') f('a Social Studies pre-check must keep its SS skill ids, and drop an unknown id (' + JSON.stringify(sx && sx.row && sx.row.shown) + ')');
  const m = res('cuMine', A.token); if (!m || !m.units || !m.units['ZZTEST.U01'] || !m.live) f('cuMine must give his units, and say the checks are on');
  if (res('cuMine', B.token).units['ZZTEST.U01'].pre !== true) f('boy B keeps his own row');
  if (!res('cuSave', 'cu-staff', 'ZZTEST.U01', 'pre', { shown: [] }).error) f('a staff token must be refused');
  if (!res('cuSave', A.token, 'bad id', 'pre', { shown: [] }).error) f('a bad unit id must be refused');
  if (!res('cuSave', A.token, 'ZZTEST.U02', 'gold', {}).error) f('an unknown kind must be refused');
  if (JSON.stringify(bk.tabs.MS_State.rows) + JSON.stringify(bk.tabs.MS_Bank || '') !== before) f('unit checks must not write mastery or money');
  return { fails, oks: fails.length ? [] : ['unit checks (server): one pre-check per unit, shown skills leave the path (on for every boy; the test switch still keeps it to TEST- boys), a missed skill comes back, 80% passes and stays passed, no money or mastery'] };
}

const LONG_OLD = ['C68.U75', 'W13.U31', 'S.U04', 'S.U06', 'S.U07', 'S.U08'];   /* may only shrink */
async function page(pg) {
  const fails = [], oks = [];
  /* every live unit: a lesson question keeps its reading passage in the boss level (the lesson keeps it in pic), and the unit's own
     "tap the proof" items do not all put the right sentence in the same place (that kind is never shuffled: a boy learns "tap the top one") */
  const live = await pg.evaluate((LONG_OLD) => { const bad = [], U = TLCORE.units; let lessonQs = 0;
    U.list.forEach(u => {
      const src = {}; (u.skills || []).concat(u.review || []).forEach(id => { let it = []; try { it = buildMission(id).filter(x => x.phase === 'check'); } catch (e) {} it.forEach(x => { src[id + '|' + x.q] = x; }); });
      for (let r = 0; r < 4; r++) (U.questions(u, 'check') || []).forEach(q => { if (q.kind !== 'mc' && q.kind !== 'order') return; lessonQs++; const x = src[q.skill + '|' + q.q];
        if (x && !x.p && x.pic && /[A-Za-z0-9]/.test(String(x.pic)) && q.p !== String(x.pic)) bad.push(u.id + ' ' + q.skill + ': "' + String(q.q).slice(0, 50) + '" loses its passage'); });
      const ev = (u.items || []).filter(x => x.type === 'evidence' && !Array.isArray(x.a));
      if (ev.length >= 3 && ev.every(x => +x.a === +ev[0].a)) bad.push(u.id + ': all ' + ev.length + ' "tap the proof" items have the answer in place ' + (+ev[0].a + 1));
      /* "tap the longest answer" must not pass a boss level: the right answer may be the longest choice in at most half of the unit's own items
         (re-score 26 Nov). LONG_OLD: units that broke this before the rule; fix them and take them off, never add one. */
      const tap = (u.items || []).filter(x => (x.type === 'evidence' && !Array.isArray(x.a)) || x.type === 'cloze');
      const longest = tap.filter(x => { const o = (x.type === 'cloze' ? x.o : x.p).map(String), k = x.type === 'cloze' ? o.indexOf(String(x.a)) : +x.a; return k >= 0 && o.every((t, i) => i === k || t.length < o[k].length); }).length;
      if (tap.length >= 4 && longest * 2 > tap.length && LONG_OLD.indexOf(u.id) < 0) bad.push(u.id + ': the right answer is the longest choice in ' + longest + ' of ' + tap.length + ' items (a boy who taps the longest answer passes)');
    });
    return { bad: bad.filter((x, i, a) => a.indexOf(x) === i), units: U.list.length, lessonQs }; }, LONG_OLD).catch(e => ({ bad: ['crashed: ' + String(e).slice(0, 200)] }));
  live.bad.slice(0, 12).forEach(b => fails.push('live units: ' + b)); if (live.bad.length > 12) fails.push('live units: ... and ' + (live.bad.length - 12) + ' more');
  if (!live.bad.length) oks.push('unit checks (live units): ' + live.units + ' units, ' + live.lessonQs + ' lesson questions drawn: every passage shows; "tap the proof" answers are not all in one place; the longest choice is not the key in most items');
  for (const vp of [{ width: 1366, height: 768 }, { width: 390, height: 844 }]) {
    await pg.setViewportSize(vp); const at = vp.width + 'px: ';
    const r = await pg.evaluate(async () => {
      const out = { bad: [], looks: [], saves: [] }, sleep = ms => new Promise(x => setTimeout(x, ms)), Q = s => document.querySelector(s);
      const ids = Object.keys(BANK_ALL).filter(id => /^READ\.COMP\.L05\.\d\d$/.test(id)).sort().slice(0, 4);
      if (ids.length < 4) { out.bad.push('not enough Level 5 Reading lessons for the made-up unit'); return out; }
      const KEEP = { st: A.st, view: A.view, play: A.play, overlay: A.overlay, live: window.OB_LIVE };
      window.OB_LIVE = 'test'; A.overlay = null; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.st.skills = {};   /* a TEST- boy: One Bite and the unit checks are on for him */
      const U = TLCORE.units; const unit = { id: 'ZZTEST.U77', title: 'Made-up Unit', c: 'READ', grade: 4, skills: ids.slice(0, 3), review: [ids[3]], n: 8,
        task: { id: 'ZZTEST.PROJ.01', title: 'My made-up project', grade: 4, kind: 'information', prompt: 'Tell what you found out.', strategy: { name: 'TIDE', steps: [['T', 'Topic'], ['I', 'Important details'], ['E', 'Ending']] }, plan: [{ k: 'topic', label: 'Topic' }, { k: 'd1', label: 'Detail' }, { k: 'end', label: 'Ending' }], min: 20, checks: [{ t: 'I wrote at least 3 sentences.', sentences: 3 }, { t: 'Capitals and end marks.', caps: true }, { t: 'I read it out loud.', self: true }], rubric: ['Clear topic', 'Details'] } };
      out.err = U.err(unit); U.add(unit); U.reset();
      const orig = window.google.script.run;
      const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
        return (...a) => setTimeout(() => { if (k === 'cuSave') { out.saves.push([a[1], a[2], a[3]]); return okf && okf({ ok: true, row: { unit: a[1], pre: a[2] === 'pre', passed: a[2] === 'check' && a[3].right / a[3].total >= .8, shown: a[3].shown || [] } }); }
          if (k === 'cuMine') return okf && okf({ ok: true, live: true, units: {} });
          if (k === 'cwMine') return okf && okf({ ok: true, pieces: window.__cwPieces || [] }); return orig.withSuccessHandler(okf).withFailureHandler(nof)[k](...a); }, 10); } });
      window.google.script.run = chain(null, null);
      const look = async name => { await sleep(80); const el = Q('#cun'); if (!el) { out.bad.push(name + ': not open'); return; } const all = [...el.querySelectorAll('button')];
        out.looks.push({ name, mains: el.querySelectorAll('.tlk-main').length, own: all.filter(b => !b.classList.contains('tlk')).length, wide: document.documentElement.scrollWidth > innerWidth + 1 || el.scrollWidth > innerWidth + 1, x: !!el.querySelector('.tlk-x.tlk-at-tl') }); };
      const play = async (right) => { let n = 0; while (U.state() && U.state().view === 'q' && n++ < 20) { const s = U.__solve(), st = U.state();
          if (st.kinds[st.i] === 'mc') { const ch = [...document.querySelectorAll('#cun [data-cu=pick]')]; const k = right ? s.pick : (s.pick + 1) % ch.length; ch[k].click(); }
          else if (st.kinds[st.i] === 'order') { const ord = right ? s.order : s.order.slice().reverse(); for (const j of ord) { Q('#cun [data-cu=tile][data-k="' + j + '"]').click(); await sleep(5); } Q('#cun [data-cu=check]').click(); }
          await sleep(10); if (n === 1) await look('question'); Q('#cun [data-cu=next]').click(); await sleep(10); } };
      /* 1. the boss level, all right */
      let p = U.check(unit); await sleep(60); await look('entrance'); out.n = U.state() && U.state().n; out.kinds = U.state() && U.state().kinds; out.review = U.state() && U.state().skills.indexOf(ids[3]) >= 0;
      Q('#cun [data-cu=start]').click(); await sleep(20); await play(true); await look('win'); out.win = (Q('#cun .cu-end h2') || {}).textContent;
      /* the unit project: "Start your project" opens his Writing Workshop piece; U.projects() lists it until the piece is sent */
      out.projBtn = !!Q('#cun [data-cu=project]'); window.__cwPieces = []; out.projList = (await U.projects()).map(x => x.task);
      if (out.projBtn) Q('#cun [data-cu=project]').click(); else Q('#cun [data-cu=done]').click(); out.r1 = await p; await sleep(80);
      out.projOpen = !!document.getElementById('cwr') && TLCORE.write.state() && TLCORE.write.state().task; TLCORE.write.close();
      window.__cwPieces = [{ id: 'x', task: 'ZZTEST.PROJ.01', status: 'sent' }]; out.projAfterSend = (await U.projects()).length; window.__cwPieces = [];
      out.ssOk = U.err(Object.assign({}, unit, { id: 'ZZTEST.U79', c: 'SS' })); out.xxBad = U.err(Object.assign({}, unit, { id: 'ZZTEST.U79', c: 'XX' }));   /* Social Studies has a path (#432); an unknown subject is still refused */
      out.badTask = U.err(Object.assign({}, unit, { id: 'ZZTEST.U78', task: { id: 'ZZTEST.PROJ.02', title: 'x' } }));
      /* 2. all wrong: practice the missed lesson */
      p = U.check(unit); await sleep(60); Q('#cun [data-cu=start]').click(); await sleep(20); await play(false); await look('almost'); out.almost = (Q('#cun .cu-end h2') || {}).textContent;
      out.practice = [...document.querySelectorAll('#cun [data-cu=practice]')].map(b => b.getAttribute('data-k'));
      Q('#cun [data-cu=practice]').click(); out.r2 = await p; await sleep(60); out.started = A.play ? [A.play.c, A.play.id, A.play.kind, !!A.play.ob] : null; A.play = null; A.view = 'hub';
      /* 3. the pre-check: first two right */
      p = U.pre(unit); await sleep(60); await look('pre-entrance'); Q('#cun [data-cu=start]').click(); await sleep(20);
      let k = 0; while (U.state() && U.state().view === 'q' && k < 10) { const s = U.__solve(), st = U.state(), good = k < 2;
        if (st.kinds[st.i] === 'mc') { const ch = [...document.querySelectorAll('#cun [data-cu=pick]')]; ch[good ? s.pick : (s.pick + 1) % ch.length].click(); }
        else { const ord = good ? s.order : s.order.slice().reverse(); for (const j of ord) { Q('#cun [data-cu=tile][data-k="' + j + '"]').click(); await sleep(5); } Q('#cun [data-cu=check]').click(); }
        await sleep(10); Q('#cun [data-cu=next]').click(); await sleep(10); k++; }
      await look('pre-result'); out.preText = (Q('#cun .cu-end h2') || {}).textContent; Q('#cun [data-cu=done]').click(); out.r3 = await p;
      /* 4. the hook: a TEST- boy starting the unit's first lesson gets the pre-check first */
      const prevLive = window.CU_LIVE; window.CU_LIVE = 'test'; U.reset(); A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.st.skills = {};
      startMission('READ', unit.skills[0], 'skill'); await sleep(150); out.noWait = !Q('#cun') && !!A.play;   /* results not loaded yet: the lesson just opens */
      A.play = null; A.view = 'hub'; await U.mine();
      startMission('READ', unit.skills[0], 'skill'); await sleep(150); out.hook = !!Q('#cun') && U.state() && U.state().mode; if (Q('#cun')) Q('#cun [data-cu=exit]').click();
      await sleep(80); out.afterPre = A.play ? [A.play.id, !!A.play.ob] : null; A.play = null; A.view = 'hub';
      window.CU_LIVE = prevLive; window.google.script.run = orig;
      /* take the made-up unit away again, so it never touches a later test; put the page back (never an empty boy) */
      delete U.byId[unit.id]; const li = U.list.indexOf(unit); if (li >= 0) U.list.splice(li, 1); unit.skills.forEach(id => { if (U.ofSkill[id] === unit.id) delete U.ofSkill[id]; }); U.reset();
      A.play = null; A.st = KEEP.st || loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.view = 'hub'; A.overlay = null; window.OB_LIVE = KEEP.live; try { render(); } catch (e) {}
      return out;
    }).catch(e => ({ bad: ['crashed: ' + String(e).slice(0, 300)], looks: [], saves: [] }));
    r.bad.forEach(b => fails.push(at + b)); if (r.bad.length) continue;
    r.looks.forEach(l => { if (l.mains > 1) fails.push(at + l.name + ': ' + l.mains + ' main buttons'); if (l.own) fails.push(at + l.name + ': ' + l.own + ' button(s) outside the button system'); if (l.wide) fails.push(at + l.name + ': scrolls sideways'); if (!l.x) fails.push(at + l.name + ': the X must be top left'); });
    if (r.err) fails.push(at + 'the made-up unit was refused: ' + r.err);
    if (!(r.n >= 4) || !r.review) fails.push(at + 'the unit check must mix every skill and a review skill (' + r.n + ' questions, review ' + r.review + ')');
    if (r.win !== 'Unit cleared!' || !r.r1.passed) fails.push(at + 'all right must clear the unit (' + r.win + ')');
    if (!r.projBtn || !r.r1.project || r.projOpen !== 'ZZTEST.PROJ.01') fails.push(at + '"Unit cleared!" must offer "Start your project", and it must open the unit\'s Writing Workshop piece (' + JSON.stringify({ btn: r.projBtn, open: r.projOpen }) + ')');
    if (JSON.stringify(r.projList) !== '["ZZTEST.PROJ.01"]' || r.projAfterSend !== 0) fails.push(at + 'TLCORE.units.projects() must list the project of a passed unit until its piece is sent (' + JSON.stringify([r.projList, r.projAfterSend]) + ')');
    if (r.ssOk !== '' || !/^c must be READ, WRIT, SCI or SS/.test(r.xxBad || '')) fails.push(at + 'a Social Studies unit (c: SS) must be taken and an unknown subject refused (' + JSON.stringify([r.ssOk, r.xxBad]) + ')');
    if (!/^task \(the unit project\)/.test(r.badTask || '')) fails.push(at + 'a unit with a broken project task must be refused (' + r.badTask + ')');
    if (r.almost !== 'Almost there!' || r.r2.passed || !r.practice.length) fails.push(at + 'all wrong must say "Almost there!" with lessons to practice');
    if (!r.started || r.started[1] !== r.practice[0] || !r.started[3]) fails.push(at + '"Practice" must open exactly the missed lesson, as a One Bite lesson (' + JSON.stringify(r.started) + ')');
    if (!r.noWait) fails.push(at + 'before his unit results load, a lesson must open at once (never wait on the internet)');
    if (!r.afterPre || !r.afterPre[1]) fails.push(at + 'after the pre-check, his lesson must open, still as a One Bite lesson (' + JSON.stringify(r.afterPre) + ')');
    const pre = r.saves.find(s => s[1] === 'pre'), chk = r.saves.filter(s => s[1] === 'check');
    if (!pre || pre[2].shown.length !== 2 || !/already know 2/.test(r.preText || '')) fails.push(at + 'the pre-check must save the 2 skills he showed and tell him (' + r.preText + ')');
    if (chk.length !== 2 || chk[0][2].right !== chk[0][2].total || chk[1][2].right !== 0) fails.push(at + 'each unit check must be saved once with its score');
    if (r.hook !== 'pre') fails.push(at + 'starting the first lesson of a unit (TEST- boy) must open the pre-check first (got ' + r.hook + ')');
  }
  await pg.setViewportSize({ width: 1366, height: 768 });
  if (!fails.length) oks.push('unit checks (page): boss entrance, cleared at 80%+ with "Start your project" (the unit Workshop piece, listed by projects() until sent), "Almost there!" with Practice that opens exactly the missed lesson, pre-check skips what he showed, the pre-check opens before a unit (TEST- boys); button system only at 1366 and 390');
  return { fails: fails.map(x => 'unit checks: ' + x), oks };
}
module.exports = { server, page };
