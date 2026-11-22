/* ONE BITE player tests (OneBite.html, HoS 2026-11-21). Runs on the kid page from tests/run.js with made-up boys only.
   1. Every hand-written bite in window.ONE_BITE: real skill, band, today line, why, a worked example (2+ steps), 2+ ways of learning,
      a Mistake Detective card, ready questions whose answer is among the choices, and a bridge that is a real skill.
   2. Every pilot bite and 6 auto-bites play as a TEST- boy through all six steps to "mastered": each screen before the questions has
      6 dots, a read-aloud line and exactly ONE forward button; no pop-up during the bite; the Bite Done screen shows.
   3. A boy who is not a TEST- boy does not get One Bite while the switch is 'test'. */
module.exports = async function oneBiteTests(pg) {
  const out = { fails: [], oks: [], counts: {} };
  const r = await pg.evaluate(async () => {
    const sleep = ms => new Promise(res => setTimeout(res, ms)), o = { bad: [], played: 0, mastered: 0, steps: {}, notTest: null, bites: 0 };
    if (!window.OB || !window.ONE_BITE) { o.bad.push('OneBite.html did not load (window.OB missing)'); return o; }
    const has = id => !!((typeof BANK_ALL !== 'undefined' && BANK_ALL[id]) || (typeof GEN !== 'undefined' && GEN[id]));
    const ids = Object.keys(ONE_BITE); o.bites = ids.length;
    ids.forEach(id => { const b = ONE_BITE[id], m = s => o.bad.push(id + ': ' + s);
      if (!has(id)) m('is not a real lesson id');
      if (!/^(K1|B23|E45|M68)$/.test(b.band || '')) m('band must be K1, B23, E45 or M68');
      if (!b.today || String(b.today).split(/\s+/).length > 10) m('needs a short today line (10 words or fewer)');
      if (!b.why) m('needs a why line');
      if (!b.watch || !b.watch.steps || b.watch.steps.length < 2) m('needs a worked example with 2 or more steps');
      if (!b.ways || b.ways.length < 2) m('needs 2 or more ways of learning');
      if (!b.oops || !b.oops.wrong || !b.oops.right || !b.oops.why) m('needs a Mistake Detective card (oops: wrong, right, why)');
      (b.ready || []).forEach((q, k) => { if (!q.q || !q.o || q.o.indexOf(q.a) < 0) m('ready question ' + (k + 1) + ': the answer must be one of the choices'); });
      if (b.bridge && !has(b.bridge)) m('bridge ' + b.bridge + ' is not a real lesson');
      if (b.band === 'K1' && b.watch && b.watch.steps.some(s => String(typeof s === 'object' ? s.t : s).split(/\s+/).length > 14)) m('K1 watch steps must stay short (14 words or fewer)');
    });
    const auto = Object.keys(BANK_ALL).filter((x, i) => i % 230 === 7).slice(0, 6);
    const prev = window.OB_LIVE; window.OB_LIVE = 'test';
    for (const id of ids.concat(auto)) { const s = { id, screens: 0, err: '' };
      try { A.overlay = null; A.play = null; A.res = null; SRV.token = 't'; SRV.states = {}; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.view = 'hub'; render(); await sleep(20);
        const pre = id.split('.')[0], map = /^(LK|HEB)$/.test(pre) ? 'LK' : /^(READ|WRIT|LANG)$/.test(pre) ? 'READ' : /^(SS|SOC|FACT)$/.test(pre) ? 'SS' : /^(COMP|VOC)$/.test(pre) ? 'COMP' : pre;
        const c = WORLD[pre] ? pre : WORLD[map] ? map : Object.keys(WORLD)[0]; startMission(c, id, 'skill'); await sleep(20);
        const p = A.play; if (!p || !p.ob) { s.err = 'did not open as a bite'; o.bad.push(id + ': ' + s.err); continue; }
        o.played++; const seen = {};
        while (A.view === 'play' && A.play === p && s.screens < 120) { s.screens++;
          if (A.overlay) { s.err = 'a pop-up opened during the bite'; break; }
          if (p.ob.stage !== 'q') { seen[p.ob.stage] = 1;
            const dots = document.querySelectorAll('#app .ob-dots li').length, go = document.querySelectorAll('#app .ob-foot .ob-go').length, say = document.querySelector('#app .ob-say');
            if (dots !== 6) { s.err = p.ob.stage + ' screen has ' + dots + ' dots (want 6)'; break; }
            if (!say || !say.dataset.text) { s.err = p.ob.stage + ' screen has no read-aloud text'; break; }
            const opt = document.querySelector('#app [data-ob=rpick]:not([disabled])');
            if (opt) { const q = p.ob.bite.ready[p.ob.ri]; const k = q.o.indexOf(q.a); document.querySelector('#app [data-ob=rpick][data-k="' + k + '"]').click(); await sleep(5); continue; }
            if (go !== 1) { s.err = p.ob.stage + ' screen has ' + go + ' forward buttons (want exactly 1)'; break; }
            document.querySelector('#app .ob-foot .ob-go').click(); await sleep(5); continue; }
          seen.q = 1; const it = p.items[p.i]; const el = document.querySelector('.play.ob-play'); if (!el) { s.err = 'question ' + p.i + ' has no calm lesson frame'; break; }
          if (document.querySelectorAll('.play.ob-play .ob-dots li').length !== 6) { s.err = 'question ' + p.i + ' has no 6-dot strip'; break; }
          p.shownAt = 0; p.cool = 0; if (it.t === 'write') p.text = new Array((it.min || 5) + 2).join('word ');
          answer(it.t === 'num' ? String(it.a) : it.t === 'write' ? p.text : it.correct); if (!(p.fb && p.fb.ok)) { s.err = 'right answer not accepted at question ' + p.i; break; }
          await sleep(3); next(); await sleep(3); }
        if (!s.err) { if (!seen.today || !seen.watch && p.ob.bite.watch) s.err = 'skipped Today or Watch Me';
          else if (!(A.st.skills[id] && A.st.skills[id].m)) s.err = 'not mastered after ' + s.screens + ' screens';
          else if (A.view !== 'result' || !document.querySelector('#app .ob-done')) s.err = 'no Bite Done screen';
          else o.mastered++; }
        o.steps[id] = s.screens; } catch (e) { s.err = String(e && e.stack || e).slice(0, 200); }
      if (s.err) o.bad.push(id + ': ' + s.err); }
    try { A.overlay = null; A.play = null; A.res = null; A.st = loadStudent({ id: 'BOY-77', name: 'Made-up Boy B' }); A.view = 'hub'; render(); const id = ids[0] || Object.keys(BANK_ALL)[0];
      const pre = id.split('.')[0]; startMission(WORLD[pre] ? pre : Object.keys(WORLD)[0], id, 'skill'); o.notTest = !!(A.play && A.play.ob); } catch (e) { o.notTest = 'crash ' + e; }
    window.OB_LIVE = prev; A.play = null; A.res = null; A.overlay = null; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.view = 'hub'; render();
    return o; });
  r.bad.forEach(b => out.fails.push('One Bite: ' + b));
  if (r.notTest !== false) out.fails.push('One Bite: a boy who is not a TEST- boy must not get One Bite while OB_LIVE is "test" (got ' + r.notTest + ')');
  out.counts = { oneBiteHandWritten: r.bites, oneBitePlayed: r.played, oneBiteMastered: r.mastered };
  if (!out.fails.length) out.oks.push('One Bite: ' + r.bites + ' hand-written bites well-formed; ' + r.mastered + ' of ' + r.played + ' bites played through all 6 steps to Bite Done (one button, 6 dots, read-aloud, no pop-ups); real boys untouched while in test');
  return out;
};
