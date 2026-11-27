/* THE NEW SHELL's home (src/ShHome.html, docs/SHELL-OVERHAUL.md step 1) on the boy page, as a made-up grade 5 TEST boy:
   - the Great Terrace shows on the home tab: his greeting, his money pill, one Sign out and one tour tool, ONE "Do this now" tile (his work) first,
     then a tile per kingdom place, then the way up to the Golden City; every button is the kit's; every place tile carries its class-lock door;
   - the switch: a boy who is not a TEST- boy does not see it while SH_LIVE is 'test'; grade 1 never sees it; a class lock hides it;
   - the Golden City page has a tile per city place and one house top left; the house brings him back home;
   - a stand-in place opens today's screen (My money opens the money page) and the home comes back when he goes home.
   Restores the page afterwards. */
module.exports.page = async function (pg) {
  const fails = [], oks = [];
  const o = await pg.evaluate(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms)), o = {};
    if (!window.SHK || !window.SH_SYNC) { o.missing = true; return o; }
    const keep = { grade: TL_MAP.grade, id: A.st.id, tab: GM.tab, live: window.SH_LIVE };
    const home = () => document.getElementById('sh-home');
    const goHome = async () => { const b = document.createElement('button'); b.setAttribute('data-gmnav', 'home'); b.style.display = 'none'; document.body.appendChild(b); b.click(); b.remove(); await sleep(80); };
    try {
      TL_MAP.grade = 5; window.SH_LIVE = 'test'; await goHome(); SH_SYNC();
      const h = home(); o.shown = !!h;
      if (h) {
        const btns = [...h.querySelectorAll('button')]; o.allKit = btns.every(b => b.classList.contains('tlk'));
        o.money = h.querySelectorAll('.tlk-money').length; o.out = h.querySelectorAll('[data-gm="pfout"]').length; o.tour = h.querySelectorAll('[data-gm="pftour"]').length;
        const tiles = [...h.querySelectorAll('.shk-tile')]; o.first = tiles[0] && tiles[0].getAttribute('data-shgo'); o.nowPill = !!(tiles[0] && /Do this now|Done for today/.test(tiles[0].textContent));
        o.nows = h.querySelectorAll('.sh-now').length; o.city = h.querySelectorAll('[data-shgo="city"]').length; o.tiles = tiles.length;
        const need = { bank: 'store', trophies: 'profile', profile: 'profile' }; o.doors = Object.keys(need).every(k => { const t = h.querySelector(`[data-shgo="${k}"]`); return t && t.getAttribute('data-shdoor') === need[k]; });
        const sig0 = h.innerHTML; SH_SYNC(); o.quiet = h.innerHTML === sig0;
      }
      const sid = TL_MAP.sid; A.st.id = 'X-01'; TL_MAP.sid = 'X-01'; o.onForReal = SHK.on(); SH_SYNC(); o.hiddenForReal = o.onForReal && !home(); A.st.id = keep.id; TL_MAP.sid = sid;
      TL_MAP.grade = 1; SH_SYNC(); o.hiddenK1 = !home(); TL_MAP.grade = 5;
      document.body.classList.add('yc-lock'); SH_SYNC(); o.hiddenLock = !home(); document.body.classList.remove('yc-lock'); SH_SYNC();
      SHK.go('city'); await sleep(120); const c = document.getElementById('shk-city');
      o.cityOpen = !!c; if (c) { o.cityTiles = [...c.querySelectorAll('.shk-tile')].map(b => b.getAttribute('data-shgo')); o.cityHouse = c.querySelectorAll('.tlk-home').length; o.cityKit = [...c.querySelectorAll('button')].every(b => b.classList.contains('tlk')); c.querySelector('.tlk-home').click(); await sleep(120); }
      o.cityClosed = !document.getElementById('shk-city');
      document.querySelectorAll('.shk-fly').forEach(f => f.click()); await sleep(400);
      const bank = home() && home().querySelector('[data-shgo="bank"]'); if (bank) { bank.click(); await sleep(150); }
      o.bankTab = GM.tab; o.bankHidesHome = !home();
      document.querySelectorAll('.shk-fly').forEach(f => f.click()); await sleep(400);
      await goHome(); o.backHome = !!home();
    } finally {
      SHK.closeAll(); TL_MAP.grade = keep.grade; A.st.id = keep.id; window.SH_LIVE = keep.live; GM.tab = keep.tab || 'home'; document.querySelectorAll('.shk-fly').forEach(f => f.remove());
      try { render(); } catch (e) {} SH_SYNC(); o.leftOver = !!home();
    }
    return o;
  });
  const chk = (c, m) => { if (!c) fails.push('new shell home: ' + m + ' (got ' + JSON.stringify(o) + ')'); };
  chk(!o.missing, 'SHK or SH_SYNC is missing (src/ShellKit.html / src/ShHome.html did not load)');
  if (!o.missing) {
    chk(o.shown && o.allKit, 'the Great Terrace shows for a grade 5 TEST boy on the home tab, with only kit buttons');
    chk(o.money === 1 && o.out === 1 && o.tour === 1, 'one money pill, one Sign out, one tour tool');
    chk(o.first === 'work' && o.nowPill && o.nows === 1 && o.city === 1 && o.tiles >= 6, 'his work first as the one big "Do this now", kingdom tiles, one way up to the Golden City');
    chk(o.doors, 'every place tile carries its class-lock door');
    chk(o.quiet, 'drawing again with nothing changed changes nothing');
    chk(o.hiddenForReal && o.hiddenK1 && o.hiddenLock, 'not shown to a real boy while the switch is on test, never to grade 1, never during a class lock');
    chk(o.cityOpen && o.cityHouse === 1 && o.cityKit && (o.cityTiles || []).includes('store') && (o.cityTiles || []).includes('canteen') && o.cityClosed, 'the Golden City page: a tile per city place (Store, Canteen, ...), one house that brings him home');
    chk(o.bankTab === 'money' && o.bankHidesHome && o.backHome, "My money opens today's money page, and the home comes back when he goes home");
    chk(!o.leftOver, 'the page is restored afterwards');
  }
  if (!fails.length) oks.push('new shell home: the Great Terrace for grade 2+ (TEST boys while the switch is on test): one "Do this now" first, kingdom tiles with their class-lock doors, the Golden City page, kit buttons only; hidden for K-1, real boys and class lock; stand-ins open today\'s screens');
  return { fails, oks };
};
