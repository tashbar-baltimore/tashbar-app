/* Core Growth (job T, T-9): new K-1 games on the K-1 game path (src/CoreK1.html). A made-up Kindergarten game is added after the first ABC
   game; for a made-up K boy (K1Only on) it shows on his ABC path in that place, locked until game 1 is passed; then PLAY opens it full screen,
   it is played by TAP ONLY (find, sort, match, tiles + Check, with one wrong tap), every screen keeps the button system, a big target and no
   sideways scroll at 1366 and 390; the end gives stars, saves them where the ABC pack saves its stars (st.klr), and the next game opens.
   Bad game data is refused. Nothing about money or mastery is written. */
module.exports = async function (pg) {
  const fails = [], oks = [];
  for (const vp of [{ width: 1366, height: 768 }, { width: 390, height: 844 }]) {
    await pg.setViewportSize(vp); const at = vp.width + 'px: ';
    const r = await pg.evaluate(async () => {
      const out = { bad: [], looks: [] }, sleep = ms => new Promise(x => setTimeout(x, ms)), Q = s => document.querySelector(s);
      for (let i = 0; i < 100 && !(window.K1O && window.KR && window.TLCORE && TLCORE.k1); i++) await sleep(50);
      if (!window.KR || !TLCORE.k1) { out.bad.push('the ABC game pack or CoreK1 did not load'); return out; }
      const first = KR.list().map(x => x[0]).filter(id => /\.L01\./.test(id))[0];
      const G = { id: 'READ.PHON.L01.91', grade: 0, name: 'Made-up Sound Game', pic: '🐝', after: first, acts: [
        { type: 'findall', grid: ['b', 'd', 'b', 'p', 'b', 'q'], find: 'b', findSay: 'b', say: 'Find the letter for bee. Tap every one.', how: 'Bee starts with this letter. Look at each one.' },
        { type: 'sort', bins: ['Starts with b', 'Not b'], cards: [['🐝', 0], ['🍎', 1], ['⚽', 0]], say: 'Does it start with b?', how: 'Say the word. Hear the first sound.', mis: true },
        { type: 'match', pairs: [['B', 'b'], ['D', 'd'], ['P', 'p']], say: 'Match big and small letters.', how: 'Find the same letter.' },
        { type: 'tiles', w: ['b', 'e', 'e'], say: 'Build the word bee.', how: 'Say it slowly. Tap the sounds in order.' } ] };
      out.errGood = TLCORE.k1.err(G); out.errBad = TLCORE.k1.err(Object.assign({}, G, { id: 'READ.PHON.L02.91' })); out.errFew = TLCORE.k1.err(Object.assign({}, G, { acts: G.acts.slice(0, 2) }));
      out.badAdded = TLCORE.k1.add(Object.assign({}, G, { id: 'READ.PHON.L01.93', acts: G.acts.slice(0, 2) }));
      TLCORE.k1.add(G);
      const keep = { st: A.st, view: A.view, overlay: A.overlay };
      try { localStorage.setItem('tl-k1only', '1'); } catch (e) {}
      A.overlay = null; A.st = loadStudent({ id: 'KCHECK-' + innerWidth, name: 'Made-up Boy' }); A.st.klr = {}; A.view = 'hub'; K1O.grade = 0; K1O.subj = 'READ'; render(); await sleep(250);
      const tiles = () => [...document.querySelectorAll('#k1o .k1-t')].map(t => t.dataset.id);
      out.pos = tiles().indexOf(G.id); out.lockedFirst = !!Q('#k1o .k1-t[data-id="' + G.id + '"].lock');
      A.st.klr = {}; A.st.klr[first] = 3; render(); await sleep(120);
      out.openAfter = !Q('#k1o .k1-t[data-id="' + G.id + '"].lock');
      const play = Q('#k1o .k1-play'); out.playId = play && play.dataset.id; if (play) play.click(); await sleep(200);
      out.opened = !!Q('#k1cov');
      const look = async name => { await sleep(60); const el = Q('#k1cov'); if (!el) return; const all = [...el.querySelectorAll('button')];
        out.looks.push({ name, mains: el.querySelectorAll('.tlk-main').length, own: all.filter(b => !b.classList.contains('tlk') && !b.closest('.obk')).length,
          wide: document.documentElement.scrollWidth > innerWidth + 1 || el.scrollWidth > innerWidth + 1, small: [...el.querySelectorAll('.obk [data-obk]')].filter(b => { const q = b.getBoundingClientRect(); return q.width > 0 && Math.min(q.width, q.height) < 44; }).length,
          top: (() => { const e = document.elementFromPoint(innerWidth / 2, innerHeight / 2); return !!(e && e.closest('#k1cov')) || (e ? (e.id || e.className || e.tagName) + ' < ' + (e.parentElement ? e.parentElement.id || e.parentElement.className : '') : 'none'); })() }); };
      const tap = sel => { const b = Q('#k1cov ' + sel); if (!b) throw new Error('no ' + sel); b.click(); };
      const next = async () => { await sleep(30); const n = Q('#k1cov [data-k1c=next]'); if (n) n.click(); await sleep(40); };
      try {
        /* 1 findall, with one wrong tap first */
        await look('find'); tap('[data-obk=cell][data-k="1"]'); await sleep(30); out.missMsg = (Q('#k1cov .k1c-msg') || {}).textContent || '';
        for (const k of [0, 2, 4]) { tap('[data-obk=cell][data-k="' + k + '"]'); await sleep(15); } await next();
        /* 2 sort: one card at a time, the right bin */
        await look('sort'); for (let n = 0; n < 3; n++) { const s = TLCORE.k1.state(); const card = Q('#k1cov [data-obk=card]'); const txt = card && card.textContent; const bin = txt === '🍎' ? 1 : 0; tap('[data-obk=bin][data-k="' + bin + '"]'); await sleep(20); } await next();
        /* 3 match */
        await look('match'); for (let i = 0; i < 3; i++) { tap('[data-obk=L][data-k="' + i + '"]'); await sleep(10); tap('[data-obk=R][data-k="' + i + '"]'); await sleep(10); } await next();
        /* 4 tiles + Check */
        await look('tiles'); for (const ch of ['b', 'e', 'e']) { const t = [...document.querySelectorAll('#k1cov [data-obk=tile]')].find(b => b.textContent.trim() === ch); if (!t) throw new Error('no tile ' + ch); t.click(); await sleep(15); }
        tap('[data-k1c=check]'); await sleep(50); await next();
      } catch (e) { out.bad.push('playing the game: ' + e.message + ' (state ' + JSON.stringify(TLCORE.k1.state()) + ')'); }
      await look('end'); const st = TLCORE.k1.state(); out.end = st && st.view; out.stars = st && st.stars; out.saved = A.st.klr && A.st.klr[G.id];
      const done = Q('#k1cov [data-k1c=done]'); if (done) done.click(); await sleep(150);
      out.closed = !Q('#k1cov'); out.nextOpen = (() => { const ids = tiles(), i = ids.indexOf(G.id); return i >= 0 && ids[i + 1] ? !Q('#k1o .k1-t[data-id="' + ids[i + 1] + '"].lock') : null; })();
      try { localStorage.removeItem('tl-k1only'); K1O.grade = null; K1O.sid = null; } catch (e) {}
      A.st = keep.st; A.view = keep.view; A.overlay = keep.overlay; try { render(); } catch (e) {}
      return out;
    }).catch(e => ({ bad: ['crashed: ' + String(e).slice(0, 300)], looks: [] }));
    r.bad.forEach(b => fails.push(at + b)); if (r.bad.length) continue;
    if (r.errGood !== '' || !r.errBad || !r.errFew) fails.push(at + 'game check: good -> "' + r.errGood + '", wrong level -> "' + r.errBad + '", 2 acts -> "' + r.errFew + '"');
    if (r.badAdded !== false) fails.push(at + 'a broken game must be refused, so it never sits on the path');
    if (r.pos !== 1 || !r.lockedFirst) fails.push(at + 'the new game must sit right after its "after" game, locked at first (position ' + r.pos + ')');
    if (!r.openAfter || r.playId !== 'READ.PHON.L01.91' || !r.opened) fails.push(at + 'after game 1 is passed, PLAY must open the new game full screen');
    if (!/b/i.test(r.missMsg || '')) fails.push(at + 'a wrong tap must say something to do (got "' + r.missMsg + '")');
    r.looks.forEach(l => { if (l.mains > 1) fails.push(at + l.name + ': ' + l.mains + ' main buttons'); if (l.own) fails.push(at + l.name + ': ' + l.own + ' button(s) outside the button system'); if (l.wide) fails.push(at + l.name + ': scrolls sideways'); if (l.small) fails.push(at + l.name + ': a tap target under 44 px'); if (l.top !== true) fails.push(at + l.name + ': the game is not on top of everything (' + l.top + ')'); });
    if (r.end !== 'end' || r.stars !== 2 || r.saved !== 2) fails.push(at + 'the end must give 2 stars (3 of 4 right on the first try) and save them in st.klr (' + JSON.stringify({ end: r.end, stars: r.stars, saved: r.saved }) + ')');
    if (!r.closed || r.nextOpen === false) fails.push(at + 'closing must go back to the path with the next game open');
  }
  await pg.setViewportSize({ width: 1366, height: 768 });
  if (!fails.length) oks.push('K-1 games: a new K game joins the ABC path after its game (locked until then), plays full screen by tap (find, sort, match, tiles), gives stars saved where the pack saves them, and opens the next game; button system, big targets, at 1366 and 390');
  return { fails: fails.map(f => 'K-1 games: ' + f), oks };
};
