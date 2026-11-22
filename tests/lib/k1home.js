/* K-1 GAMES-ONLY GUARDRAIL (HoS 2026-11-22: "kindergarten and first grade ... a game only ... no pop-ups, no nothing ... games in
   sequential order of the skills"). Fails the build if a Kindergarten boy (made-up, K1Only switched on for him) does not get:
     - the full-screen game path (#k1o) right after the home is drawn and the welcome runs, with nothing else on the screen (no pop-up,
       map, tabs or store: the element in the middle and at the top corners belongs to the path);
     - only Kindergarten (Level 1) games, in each game pack's own order, game 1 open and every later game locked;
     - PLAY opening a real game pack window (train / matching / balloon games), shown above everything, with the full-screen styles
       and the voice bridge put in front of the game page;
     - a Grade 1 boy seeing only Level 2 games.
   It cleans up after itself (the made-up boy is signed out of the check, the switch is removed). */
module.exports = async function (pg) {
  const out = { fails: [], oks: [] };
  const r = await pg.evaluate(async () => {
    const sleep = ms => new Promise(res => setTimeout(res, ms)), bad = [];
    if (!window.K1O) return { bad: ['K1Only.html did not load (window.K1O missing)'] };
    const keep = { st: A.st, view: A.view, overlay: A.overlay, tok: SRV.token };
    try {
      localStorage.setItem('tl-k1only', '1');
      A.overlay = null; A.st = loadStudent({ id: 'KCHECK-01', name: 'Check Boy' }); A.view = 'hub'; K1O.grade = 0; K1O.subj = 'MATH'; render();
      try { welcome(); } catch (e) {}
      await sleep(400);
      const shelf = document.getElementById('k1o');
      if (!shelf || !document.body.classList.contains('k1-home')) bad.push('a K boy\'s home is not the game path');
      else {
        [[innerWidth / 2, innerHeight / 2], [innerWidth - 20, 20], [20, innerHeight - 20]].forEach(([x, y]) => { const el = document.elementFromPoint(x, y); if (!el || !el.closest('#k1o')) bad.push('something else is on the K boy\'s screen at ' + Math.round(x) + ',' + Math.round(y) + ' (' + (el ? (el.id || el.className || el.tagName) : 'nothing') + ')'); });
        const tiles = [...shelf.querySelectorAll('.k1-t')].map(t => t.dataset.id), want = (window.KL ? KL.list().map(x => x[0]) : []).filter(id => /\.L01\./.test(id));
        if (!tiles.length) bad.push('the K Numbers path has no games');
        if (tiles.some(id => !/\.L01\./.test(id))) bad.push('the K path shows a game that is not Kindergarten level: ' + tiles.find(id => !/\.L01\./.test(id)));
        if (JSON.stringify(tiles) !== JSON.stringify(want)) bad.push('the K Numbers path is not the game pack\'s own skill order');
        const locked = shelf.querySelectorAll('.k1-t.lock').length; if (locked !== tiles.length - 1) bad.push('a new K boy should have game 1 open and ' + (tiles.length - 1) + ' locked (got ' + locked + ' locked)');
        if (/\bbites?\b/i.test(shelf.innerText)) bad.push('the word "bite" shows on the K path');
        const play = shelf.querySelector('.k1-play'); if (!play) bad.push('no PLAY on the K path'); else {
          play.click(); await sleep(300);
          const ov = ['klov', 'krov', 'kkov', 'kkov2', 'g1mov', 'g1rov'].map(i => document.getElementById(i)).find(Boolean);
          if (!ov) bad.push('PLAY on the K path did not open a real game');
          else { const f = ov.querySelector('iframe'), src = (f && f.srcdoc) || '';
            if (getComputedStyle(ov).display === 'none') bad.push('the game window is hidden behind the path');
            if (src.indexOf('id="k1fit"') < 0) bad.push('the game does not get the full-screen styles');
            if (src.indexOf('k1say') < 0) bad.push('the game does not get the voice bridge');
            const x = ov.querySelector('button'); if (x) x.click(); ov.remove(); } } }
      K1O.grade = 1; render(); await sleep(100);
      const g1 = [...document.querySelectorAll('#k1o .k1-t')].map(t => t.dataset.id);
      if (!g1.length) bad.push('a Grade 1 boy has no games'); else if (g1.some(id => !/\.L02\./.test(id))) bad.push('the Grade 1 path shows a game that is not Grade 1 level');
    } catch (e) { bad.push('crashed: ' + e); }
    try { localStorage.removeItem('tl-k1only'); K1O.grade = null; K1O.sid = null; } catch (e) {}
    A.st = keep.st; A.view = keep.view; A.overlay = keep.overlay; SRV.token = keep.tok; try { render(); } catch (e) {}
    return { bad };
  });
  r.bad.forEach(b => out.fails.push('K-1 GAMES ONLY: ' + b));
  if (!r.bad.length) out.oks.push('K-1 games only: a K boy gets the full-screen game path with nothing else on screen, Kindergarten games only in skill order (game 1 open, the rest locked), PLAY opens a real game full screen with the voice bridge; a Grade 1 boy gets Grade 1 games only');
  return out;
};
