/* (2026-11-23: K-1 first is switched off for the boys until the white game window seen on a real Chromebook is understood; this check switches it on by hand, tl-k1fast, so the fast path keeps working for when it comes back.)
   K-1 FIRST guardrail (HoS 2026-11-22: "it has to be fast, quick, smooth"). On a Chromebook whose last boy was K-1 (tl-k1dev), the
   page loads his games and game path first (Speed.js). Fails the build if a made-up K boy on such a Chromebook does not see his PLAY
   button within 8 seconds of the page opening, if the page shows errors, or if, once everything has loaded, the K-1 games-only rules
   (tests/lib/k1home.js) or the lesson count change. openPage(browser, html, init, throttle) and K come from tests/run.js. */
module.exports = async function (browser, openPage, K) {
  const out = { fails: [], oks: [] };
  const { ctx, pg, errs } = await openPage(browser, K.page, K, 0);
  try {
    await ctx.addInitScript(() => { try { localStorage.setItem('tl-k1fast', '1'); localStorage.setItem('tl-k1dev', '1'); localStorage.setItem('tl-k1only', '1'); } catch (e) {} });
    const t0 = Date.now(); await pg.goto('http://app.test/', { waitUntil: 'commit' });
    await pg.waitForFunction(() => typeof A !== 'undefined' && typeof render === 'function' && typeof loadStudent === 'function', null, { timeout: 60000 });
    await pg.evaluate(() => { SRV.token = 't'; const me = { id: 'KFAST-01', name: 'Fast Boy' }; if (!ROSTER.some(x => x.id === me.id)) ROSTER.push(me); A.st = loadStudent(me); A.session = 0; A.view = 'hub'; render(); });
    const ok = await pg.waitForFunction(() => !!document.querySelector('#k1o .k1-play'), null, { timeout: 8000 }).then(() => true, () => false);
    const ms = Date.now() - t0;
    if (!ok) out.fails.push('K-1 FIRST: a K boy on a K-1 Chromebook did not see PLAY within 8 seconds');
    await pg.waitForFunction(() => typeof BANK_ALL !== 'undefined' && Object.keys(BANK_ALL).length > 500, null, { timeout: 120000 }); await pg.waitForTimeout(15000);
    const k = await require('./k1home.js')(pg); k.fails.forEach(f => out.fails.push('K-1 FIRST (after everything loaded): ' + f));
    const n = await pg.evaluate(() => Object.keys(BANK_ALL).length); if (n < 1000) out.fails.push('K-1 FIRST: only ' + n + ' lessons loaded');
    errs.forEach(e => out.fails.push('K-1 FIRST page: ' + e));
    if (!out.fails.length) out.oks.push('K-1 first: on a K-1 Chromebook a K boy sees PLAY in ' + (ms / 1000).toFixed(1) + ' s; after everything loads the K-1 rules still hold and all ' + n + ' lessons are there');
  } catch (e) { out.fails.push('K-1 FIRST check crashed: ' + String(e).slice(0, 200)); }
  await ctx.close(); return out;
};
