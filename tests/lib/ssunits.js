/* Social Studies Unit 1 checks, Grades 4-8 (HoS decision 2026-11-25, issue 432; src/CoreDataS11.html). MADE-UP boys only.
   page(pg): the five units S.U06-S.U10 are on the page as Social Studies units (c 'SS'), Grades 4 to 8 in order; each covers every
   lesson of its level on the Explorer Trail (held lessons left out), starts with the trail's first lesson of that level, reviews the
   grade before, and has a Writing Workshop project that TLCORE.write.err takes. Every unit-check question is the unit's own (no 2-choice
   question from a lesson's old check), with 3+ choices, a "how" line and a skill of the unit. Played as a TEST- boy at 1366 and 390:
   every question answered right -> "Unit cleared!" -> "Start your project" opens his piece; the Grade 4 pre-check asks one question per
   lesson; and on the trail, a boy who finished Grade 4 and starts a Grade 5 lesson gets the Grade 4 unit check first. Button system only. */
const UNITS = ['S.U06', 'S.U07', 'S.U08', 'S.U09', 'S.U10'];

async function page(pg) {
  const fails = [], oks = [];
  for (const vp of [{ width: 1366, height: 768 }, { width: 390, height: 844 }]) {
    await pg.setViewportSize(vp); const at = vp.width + 'px: ';
    const r = await pg.evaluate(async (UNITS) => {
      const out = { bad: [], looks: [], plays: [] }, sleep = ms => new Promise(x => setTimeout(x, ms)), Q = s => document.querySelector(s);
      const U = TLCORE.units, SS = window.TL_SS || {}, HOLD = window.TL_SS_HOLD || [], lvl = id => +((/\.L(\d\d)\./.exec(id) || [])[1] || 0);
      const trail = Object.keys(SS).filter(id => HOLD.indexOf(id) < 0);
      const units = UNITS.map(id => U.byId[id]);
      if (units.some(u => !u)) { out.bad.push('missing unit(s): ' + UNITS.filter((id, i) => !units[i]).join(', ')); return out; }
      const ssList = U.list.filter(u => u.c === 'SS').map(u => u.id);
      if (ssList.slice(0, 5).join() !== UNITS.join()) out.bad.push('the Social Studies units must be listed Grade 4 to 8 in order (got ' + ssList.join(', ') + ')');
      units.forEach((u, g) => {
        const L = g + 5, mine = trail.filter(id => lvl(id) === L), name = u.id + ' (Grade ' + u.grade + ')';
        if (u.c !== 'SS' || u.grade !== g + 4) out.bad.push(name + ': must be c SS, grade ' + (g + 4));
        if (u.skills.some(id => !BANK_ALL[id] || HOLD.indexOf(id) >= 0)) out.bad.push(name + ': a skill with no lesson, or a held one: ' + u.skills.filter(id => !BANK_ALL[id] || HOLD.indexOf(id) >= 0).join(', '));
        if (mine.some(id => u.skills.indexOf(id) < 0) || u.skills.some(id => lvl(id) !== L)) out.bad.push(name + ': must hold every Level ' + L + ' trail lesson and nothing else (missing ' + mine.filter(id => u.skills.indexOf(id) < 0).join(', ') + ')');
        if (u.skills[0] !== mine[0]) out.bad.push(name + ': must start with the trail’s first Level ' + L + ' lesson ' + mine[0] + ' (the pre-check opens there), not ' + u.skills[0]);
        if (g > 0 && (!u.review || u.review.length < 2 || u.review.some(id => lvl(id) !== L - 1 || !BANK_ALL[id]))) out.bad.push(name + ': must review 2 lessons of the grade before');
        const te = TLCORE.write.err(u.task); if (te || !u.task || u.task.grade !== u.grade) out.bad.push(name + ': the project must be a good Workshop task for his grade (' + te + ')');
        if (u.task && !(u.task.min >= (u.grade >= 6 ? 35 : 25))) out.bad.push(name + ': the project needs a real word minimum');
        const sk = u.skills.concat(u.review || []);
        sk.forEach(id => { if (!(u.items || []).some(x => x.skill === id)) out.bad.push(name + ': ' + id + ' has no question of its own'); });
        (u.items || []).forEach((x, i) => { const e = OBK.err(x), o = OBK.types[x.type].opts ? OBK.types[x.type].opts(x) : (x.steps || []);
          if (e) out.bad.push(name + ' question ' + (i + 1) + ': ' + e);
          if (sk.indexOf(x.skill) < 0) out.bad.push(name + ' question ' + (i + 1) + ': skill ' + x.skill + ' is not in the unit');
          if (!x.how) out.bad.push(name + ' question ' + (i + 1) + ': no "how" line');
          if (!o || o.length < 3) out.bad.push(name + ' question ' + (i + 1) + ': needs 3 or more choices'); });
        const pos = (u.items || []).filter(x => x.type === 'evidence').map(x => x.a); if (pos.length >= 3 && new Set(pos).size < 2) out.bad.push(name + ': the right sentence sits in the same place in every "tap the sentence" question (that kind does not shuffle)');
      });
      if (out.bad.length) return out;
      /* play them as a TEST- boy, with the server faked */
      const KEEP = { st: A.st, view: A.view, play: A.play, overlay: A.overlay, live: window.OB_LIVE, cu: window.CU_LIVE };
      window.OB_LIVE = 'test'; A.overlay = null; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.st.skills = {};
      const orig = window.google.script.run; let mine = {}; out.saves = [];
      const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
        return (...a) => setTimeout(() => { if (k === 'cuSave') { out.saves.push([a[1], a[2], a[3]]); return okf && okf({ ok: true, row: { unit: a[1], pre: a[2] === 'pre', passed: a[2] === 'check' && a[3].right / a[3].total >= .8, shown: a[3].shown || [] } }); }
          if (k === 'cuMine') return okf && okf({ ok: true, live: true, units: mine });
          if (k === 'cwMine') return okf && okf({ ok: true, pieces: [] }); return orig.withSuccessHandler(okf).withFailureHandler(nof)[k](...a); }, 10); } });
      window.google.script.run = chain(null, null);
      const look = async name => { await sleep(60); const el = Q('#cun'); if (!el) { out.bad.push(name + ': not open'); return; } const all = [...el.querySelectorAll('button')];
        out.looks.push({ name, mains: el.querySelectorAll('.tlk-main').length, own: all.filter(b => !b.classList.contains('tlk') && !b.hasAttribute('data-obk')).length, wide: document.documentElement.scrollWidth > innerWidth + 1 || el.scrollWidth > innerWidth + 1 }); };
      const answerRight = async () => { const st = U.state(), uq = U.byId[st.unit], i = st.i, el = Q('#cun .cu-kit');
        if (st.kinds[i] !== 'kit' || !el) return 'not one of the unit’s own questions (' + st.kinds[i] + ')';
        const tx = el.textContent, key = x => x.type === 'evidence' ? x.p[0] : x.type === 'order' ? x.steps[0] : (String(x.t).split('___')[0].trim() || String(x.t).split('___')[1].trim());
        const act = (uq.items || []).filter(x => x.skill === st.skills[i]).find(x => tx.indexOf(key(x)) >= 0);
        if (!act) return 'question not found in the unit data';
        if (act.type === 'evidence') Q('#cun [data-obk=sent][data-k="' + act.a + '"]').click();
        else if (act.type === 'cloze') { [...document.querySelectorAll('#cun [data-obk=word]')].find(b => b.getAttribute('data-k') === act.a).click(); await sleep(5); Q('#cun [data-cu=kcheck]').click(); }
        else if (act.type === 'order') { for (const t of act.steps) { [...document.querySelectorAll('#cun [data-obk=strip]')].find(b => b.textContent === t && !b.disabled).click(); await sleep(5); } Q('#cun [data-cu=kcheck]').click(); }
        else return 'unknown kind ' + act.type;
        await sleep(15); return ''; };
      const list = vp1366() ? units : [units[2]];   /* every unit at 1366; one (Grade 6) at 390 */
      function vp1366() { return innerWidth > 1000; }
      for (const u of list) {
        const p = U.check(u); await sleep(60); await look(u.id + ' entrance'); const st0 = U.state(); if (!st0) { out.bad.push(u.id + ': the check did not open'); continue; }
        const play = { unit: u.id, n: st0.n, kinds: st0.kinds.slice(), errs: [] };
        Q('#cun [data-cu=start]').click(); await sleep(20); let k = 0;
        while (U.state() && U.state().view === 'q' && k++ < 14) { const e = await answerRight(); if (e) { play.errs.push(e); break; } if (k === 1) await look(u.id + ' question'); const nx = Q('#cun [data-cu=next]'); if (!nx) { play.errs.push('no Next after an answer'); break; } nx.click(); await sleep(15); }
        if (play.errs.length && Q('#cun [data-cu=exit]')) { Q('#cun [data-cu=exit]').click(); await p; out.plays.push(play); continue; }
        await look(u.id + ' win'); play.win = (Q('#cun .cu-end h2') || {}).textContent; play.projBtn = !!Q('#cun [data-cu=project]');
        if (play.projBtn) Q('#cun [data-cu=project]').click(); else if (Q('#cun [data-cu=done]')) Q('#cun [data-cu=done]').click(); play.r = await p; await sleep(80);
        play.projOpen = TLCORE.write.state() && TLCORE.write.state().task; try { TLCORE.write.close(); } catch (e) {}
        out.plays.push(play);
      }
      /* the Grade 4 pre-check: one question per lesson, all the unit's own */
      if (vp1366()) { const p = U.pre(units[0]); await sleep(60); const s = U.state(); out.pre = s ? { n: s.n, kinds: s.kinds, skills: s.skills } : null; if (Q('#cun')) Q('#cun [data-cu=exit]').click(); await p; }
      /* the trail: Grade 4 all learned, he starts the first Grade 5 lesson, so the Grade 4 unit check comes first (the Practice chain, CoreUnits.html hook) */
      window.CU_LIVE = 'test'; U.reset(); mine = { 'S.U06': { unit: 'S.U06', pre: true, shown: [], passed: false } }; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' });
      A.st.skills = {}; units[0].skills.forEach(id => { A.st.skills[id] = { m: 1 }; }); await U.mine();
      startMission('SS', units[1].skills[0], 'skill'); await sleep(150); out.chain = U.state() ? [U.state().mode, U.state().unit] : null; if (Q('#cun')) Q('#cun [data-cu=exit]').click(); await sleep(80);
      out.after = A.play ? [A.play.c, A.play.id] : null;
      window.google.script.run = orig; window.CU_LIVE = KEEP.cu; U.reset();
      A.play = null; A.st = KEEP.st || loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.view = 'hub'; A.overlay = null; window.OB_LIVE = KEEP.live; try { render(); } catch (e) {}
      return out;
    }, UNITS).catch(e => ({ bad: ['crashed: ' + String(e).slice(0, 300)], looks: [], plays: [] }));
    r.bad.forEach(b => fails.push(at + b)); if (r.bad.length) continue;
    r.looks.forEach(l => { if (l.mains > 1) fails.push(at + l.name + ': ' + l.mains + ' main buttons'); if (l.own) fails.push(at + l.name + ': ' + l.own + ' button(s) outside the button system'); if (l.wide) fails.push(at + l.name + ': scrolls sideways'); });
    r.plays.forEach(p => { const u = p.unit;
      if (p.errs.length) fails.push(at + u + ': ' + p.errs.join('; '));
      if (p.kinds.some(k => k !== 'kit')) fails.push(at + u + ': every question must be the unit’s own (got ' + p.kinds.join(',') + ')');
      if (p.n < 8) fails.push(at + u + ': the unit check must ask 8 or more questions (got ' + p.n + ')');
      if (p.win !== 'Unit cleared!' || !p.r || !p.r.passed) fails.push(at + u + ': all right must clear the unit (' + p.win + ')');
      if (!p.projBtn || !p.projOpen || !/^S\.PROJ\d\.SS1$/.test(p.projOpen)) fails.push(at + u + ': "Start your project" must open his Writing Workshop piece (' + p.projOpen + ')'); });
    if (r.pre && (r.pre.n !== 6 || r.pre.kinds.some(k => k !== 'kit'))) fails.push(at + 'the Grade 4 pre-check must ask one of the unit’s own questions per lesson (' + JSON.stringify(r.pre) + ')');
    if (!r.chain || r.chain[0] !== 'check' || r.chain[1] !== 'S.U06') fails.push(at + 'a boy who learned Grade 4 and starts the first Grade 5 lesson must get the Grade 4 unit check first (got ' + JSON.stringify(r.chain) + ')');
    if (!r.after || r.after[0] !== 'SS') fails.push(at + 'after he closes the check, his Social Studies lesson must open (' + JSON.stringify(r.after) + ')');
  }
  await pg.setViewportSize({ width: 1366, height: 768 });
  if (!fails.length) oks.push('Social Studies unit checks (Gr 4-8, S.U06-S.U10): each holds its whole trail level, reviews the grade before, asks 8+ of its own 3-choice questions, clears at all right and opens its map or timeline project; the pre-check asks one per lesson; finishing Grade 4 and starting Grade 5 opens the Grade 4 check; button system only at 1366 and 390');
  return { fails: fails.map(x => 'Social Studies units: ' + x), oks };
}
module.exports = { page };
