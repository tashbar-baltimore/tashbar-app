/* Core Growth (job F helper, K-1 listen-along stories): the 'story' piece of a K-1 game (src/CoreK1.html) and the listen-along games
   (src/CoreDataFH3.html, texts/F/). In the browser, with a made-up K boy:
   - every listen-along game passes TLCORE.k1.err and sits on the Kindergarten ABC path;
   - a bad story piece is refused (no text id; two stories in one game);
   - the story piece shows the book and one big button; it opens the Reader (K-1 band) on the story, with the page's own picture;
   - leaving early keeps the piece open ("Keep listening"); reaching the end marks it done (no star needed, no miss) and the game goes on;
   - the stars at the end count only the pieces he played, not the story. Returns { fails, oks }. */
module.exports = async function (pg) {
  const fails = [], oks = [];
  const r = await pg.evaluate(async () => {
    const o = { bad: [] }, sleep = ms => new Promise(x => setTimeout(x, ms)), Q = s => document.querySelector(s);
    for (let i = 0; i < 100 && !(window.TLCORE && TLCORE.k1 && TLCORE.reader && window.KR); i++) await sleep(50);
    const ids = ['READ.LIT.L01.01', 'READ.LIT.L01.02', 'READ.LIT.L01.03', 'READ.LIT.L01.04'];
    o.missing = ids.filter(id => !TLCORE.k1.games[id]); o.errs = ids.filter(id => TLCORE.k1.games[id] && TLCORE.k1.err(TLCORE.k1.games[id])).map(id => id + ': ' + TLCORE.k1.err(TLCORE.k1.games[id]));
    o.onPath = ids.filter(id => KR.list().some(x => x[0] === id)).length;
    const g = TLCORE.k1.games[ids[0]];
    o.errNoText = TLCORE.k1.err(Object.assign({}, g, { acts: [{ type: 'story', say: 'Listen.' }].concat(g.acts.slice(1)) }));
    o.errTwo = TLCORE.k1.err(Object.assign({}, g, { acts: [g.acts[0], g.acts[0]].concat(g.acts.slice(1, 4)) }));
    const keep = { st: A.st, view: A.view };
    A.st = loadStudent({ id: 'TEST-STORY', name: 'Made-up Boy' }); A.st.klr = {};
    TLCORE.k1.play(ids[0]); await sleep(300);
    o.view0 = TLCORE.k1.state(); o.btn = !!Q('#k1cov [data-k1c=story].tlk-main');
    for (let i = 0; i < 40 && !/Eli/.test((Q('#k1cov .k1c-bt') || {}).textContent || ''); i++) await sleep(50);
    o.title = (Q('#k1cov .k1c-bt') || {}).textContent || '';
    Q('#k1cov [data-k1c=story]').click();
    for (let i = 0; i < 60 && !TLCORE.reader.isOpen(); i++) await sleep(50);
    o.readerOpen = TLCORE.reader.isOpen(); o.band = TLCORE.reader.state() && TLCORE.reader.state().band;
    Q('#crd [data-crd=start]').click(); await sleep(80);
    o.pagePic = !!Q('#crd .crd-pp'); o.gameHidden = getComputedStyle(Q('#k1cov')).visibility === 'hidden';
    TLCORE.reader.close(); for (let i = 0; i < 40 && TLCORE.reader.isOpen(); i++) await sleep(50); await sleep(80);
    o.early = TLCORE.k1.state(); o.keep = ((Q('#k1cov [data-k1c=story]') || {}).textContent || '').trim();
    Q('#k1cov [data-k1c=story]').click(); for (let i = 0; i < 60 && !TLCORE.reader.isOpen(); i++) await sleep(50);
    for (let i = 0; i < 30; i++) { const s = TLCORE.reader.state(); if (!s) break; const b = Q('#crd [data-crd=start]') || Q('#crd [data-crd=next]') || Q('#crd [data-crd=finish]'); if (!b) break; b.click(); await sleep(40); }
    await sleep(1500); o.after = TLCORE.k1.state();
    /* the rest: all right first try, then the stars */
    for (let k = 0; k < 8; k++) { const s = TLCORE.k1.state(); if (!s || s.view !== 'act') break; const d = TLCORE.k1.games[s.id].acts[s.i];
      try { OBK.solve(d, OBK.init(d, {})); } catch (e) {}
      const opts = [...document.querySelectorAll('#k1cov [data-obk]')];
      if (d.type === 'listen') { const b = opts.find(b => b.textContent.trim() === d.a); if (b) b.click(); }
      else if (d.type === 'sort') { for (let n = 0; n < d.cards.length; n++) { const c = Q('#k1cov [data-obk=card]'); if (!c) break; const cd = d.cards.find(x => x[0] === c.textContent.trim()); Q('#k1cov [data-obk=bin][data-k="' + (cd ? cd[1] : 0) + '"]').click(); await sleep(30); } }
      else if (d.type === 'match') { for (const [l, rr] of d.pairs) { [...document.querySelectorAll('#k1cov [data-obk=L]')].find(b => b.textContent.trim() === l).click(); await sleep(20); [...document.querySelectorAll('#k1cov [data-obk=R]')].find(b => b.textContent.trim() === rr).click(); await sleep(30); } }
      await sleep(1300); const s2 = TLCORE.k1.state(); if (s2 && s2.view === 'act' && s2.i === s.i) { o.bad.push('piece ' + s.i + ' ' + d.type + ' did not finish'); break; } }
    o.end = TLCORE.k1.state(); o.saved = A.st.klr[ids[0]];
    TLCORE.k1.close(); A.st = keep.st; A.view = keep.view;
    return o;
  });
  const chk = (c, m) => { if (!c) fails.push('listen-along story: ' + m); };
  chk(!r.missing.length && !r.errs.length, 'every listen-along game must load and pass its check (' + JSON.stringify(r.missing.concat(r.errs)) + ')');
  chk(r.onPath === 4, 'the 4 listen-along games must be on the Kindergarten ABC path (found ' + r.onPath + ')');
  chk(/text id/.test(r.errNoText || '') && /one story/.test(r.errTwo || ''), 'a story piece with no text, or two stories in a game, must be refused (got "' + r.errNoText + '", "' + r.errTwo + '")');
  chk(r.view0 && r.view0.type === 'story' && r.btn, 'the game starts on the story: the book and one big Listen button');
  chk(/Eli's First Day/.test(r.title), 'the book card shows the story title (got "' + r.title + '")');
  chk(r.readerOpen && r.band === 'K1' && r.pagePic && r.gameHidden, 'Listen opens the Reader in the K-1 band over the game, with the page picture (open ' + r.readerOpen + ', band ' + r.band + ', pic ' + r.pagePic + ', game hidden ' + r.gameHidden + ')');
  chk(r.early && r.early.type === 'story' && !r.early.over && /Keep listening/.test(r.keep), 'leaving the story early keeps it open with "Keep listening" (got ' + JSON.stringify(r.early) + ', "' + r.keep + '")');
  chk(r.after && r.after.i === 1 && r.after.view === 'act', 'reaching the end of the story moves the game on to its first question (got ' + JSON.stringify(r.after) + ')');
  chk(!r.bad.length && r.end && r.end.view === 'end' && r.end.stars === 3 && r.saved === 3, 'all pieces right first try = 3 stars, saved in st.klr (story not counted) (got ' + JSON.stringify(r.end) + ', saved ' + r.saved + ', ' + r.bad.join('; ') + ')');
  if (!fails.length) oks.push("K-1 listen-along stories: 4 games on the K ABC path; the story piece opens the Reader (K-1 band, page pictures) over the game, leaving early keeps it open, the end moves on; stars count only the questions");
  return { fails, oks };
};
