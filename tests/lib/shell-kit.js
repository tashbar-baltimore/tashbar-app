/* THE NEW SHELL's kit (src/ShellKit.html, docs/SHELL-CONTRACT.md), on the boy page:
   - every new shell file loaded (no page error), window.SHK is there;
   - a place's tile is the button kit's tile and carries its class-lock door;
   - a full page has exactly one house (top left), only kit buttons, and the house closes it;
   - a pop-up has exactly one round x (top right), only kit buttons; outside tap and Escape close it;
   - a flight leaves nothing behind (tap skips it), so nothing is drawn at rest.
   Restores the page afterwards. */
module.exports.page = async function (pg) {
  const fails = [], oks = [];
  const o = await pg.evaluate(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms)), o = {};
    const K = window.SHK; o.kit = !!K; if (!K) return o;
    const onlyKit = el => [...el.querySelectorAll('button')].every(b => b.classList.contains('tlk'));
    K.place({ id: 'zz-test', name: 'Made-up place', world: 'k', icon: 'ycw-ic-work', door: 'store', order: 99, sub: 'for the test', open: () => K.page({ id: 'zz-test', world: 'k', scene: 'ycw-k-hall', title: 'Made-up place', icon: 'ycw-ic-work', body: '<div class="shk-card"><p>Hello</p>' + window.TLK.main('Start', 'data-zz="go"') + '</div>' }) });
    const t = document.createElement('div'); t.innerHTML = K.tile('zz-test'); const b = t.firstElementChild;
    o.tile = !!(b && b.classList.contains('tlk') && b.classList.contains('tlk-tile') && b.getAttribute('data-shdoor') === 'store' && b.getAttribute('data-shgo') === 'zz-test');
    o.listed = K.places('k').some(d => d.id === 'zz-test');
    document.body.appendChild(t); b.click(); await sleep(60);
    const pgEl = document.getElementById('shk-zz-test');
    o.pageOpen = !!pgEl; if (pgEl) { const h = pgEl.querySelectorAll('.tlk-home'); o.houses = h.length; const r = h[0] && h[0].getBoundingClientRect(); o.houseTL = !!(r && r.left < 220 && r.top < 90); o.pageKit = onlyKit(pgEl); o.mains = pgEl.querySelectorAll('.tlk-main').length; h[0] && h[0].click(); await sleep(60); }
    o.pageClosed = !document.getElementById('shk-zz-test'); t.remove();
    let closed = '';
    K.pop({ id: 'zz-pop', world: 'c', title: 'Made-up pop-up', icon: '⭐', body: '<p>Hi</p>' + window.TLK.quiet('Not now', 'data-zz="no"'), onClose: how => { closed = how; } });
    const pp = document.getElementById('shk-zz-pop'); o.popOpen = !!pp;
    if (pp) { const x = pp.querySelectorAll('.tlk-x'); o.xs = x.length; const r = x[0] && x[0].getBoundingClientRect(), c = pp.querySelector('.shk-card').getBoundingClientRect(); o.xTR = !!(r && r.left > c.left + c.width / 2 && r.top < c.top + 80); o.popKit = onlyKit(pp); }
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); await sleep(30); o.escClosed = !document.getElementById('shk-zz-pop') && closed === 'x';
    K.pop({ id: 'zz-pop', title: 'Again' }); const sc = document.querySelector('#shk-zz-pop .shk-scrim'); sc && sc.click(); await sleep(30); o.outClosed = !document.getElementById('shk-zz-pop');
    let opened = 0; K.fly('c', () => { opened++; }, { force: true }); o.flyOpenedFirst = opened === 1; await sleep(80);
    const f = document.querySelector('.shk-fly'); o.flyShown = !!f; f && f.click(); await sleep(500); o.flyGone = !document.querySelector('.shk-fly');
    K.unplace('zz-test'); o.unlisted = !K.places().some(d => d.id === 'zz-test'); o.left = K.open.length;
    return o;
  });
  const chk = (c, m) => { if (!c) fails.push('new shell kit: ' + m + ' (got ' + JSON.stringify(o) + ')'); };
  chk(o.kit, 'window.SHK is missing (src/ShellKit.html did not load)');
  if (o.kit) {
    chk(o.tile && o.listed, "a place's tile is the kit's tlk-tile with its door (data-shdoor) and is listed");
    chk(o.pageOpen && o.houses === 1 && o.houseTL && o.pageKit && o.mains <= 1, 'a full page has one house top left, at most one main button, only kit buttons');
    chk(o.pageClosed, 'the house closes the page');
    chk(o.popOpen && o.xs === 1 && o.xTR && o.popKit, 'a pop-up has one round x top right and only kit buttons');
    chk(o.escClosed && o.outClosed, 'Escape and a tap outside close a pop-up');
    chk(o.flyOpenedFirst && o.flyShown && o.flyGone, 'a flight opens the place at once, shows, and leaves nothing behind when tapped');
    chk(o.unlisted && o.left === 0, 'the test place is gone and no page is left open');
  }
  if (!fails.length) oks.push('new shell kit: tiles are the kit\'s with their class-lock door; a page has one house top left, a pop-up one x top right (Escape and outside tap close it); only kit buttons; a flight leaves nothing behind');
  return { fails, oks };
};
