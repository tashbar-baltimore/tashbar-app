/* node ucheck.js OUT UNIT : a made-up TEST boy plays the unit check (boss level) to the end, all right, at 1366x768 and 390x844, a picture per screen. */
const S = require('/home/user/tashbar-app/tests/lib/screens.js'), fs = require('fs'), path = require('path');
const OUT = process.argv[2], UNIT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  for (const [w, h, tag] of [[1366, 768, 'cb'], [390, 844, 'ph']]) {
    const { browser, pg, errs } = await S.kidPage({ width: w, height: h }); let n = 0;
    await pg.waitForFunction(u => window.TLCORE && TLCORE.units && TLCORE.units.byId[u], UNIT, { timeout: 120000 });
    const shot = async nm => { await sleep(350); await pg.screenshot({ path: path.join(OUT, tag + '-' + String(++n).padStart(2, '0') + '-' + nm + '.png') }); };
    await pg.evaluate(() => { window.OB_LIVE = 'test'; A.st = loadStudent({ id: 'TEST-01', name: 'Made-up Boy A' });
      const orig = google.script.run; const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
        return (...a) => setTimeout(() => { if (k === 'cuSave') return okf && okf({ ok: true, row: { unit: a[1], passed: a[2] === 'check' && a[3].right / a[3].total >= .8, shown: [] } }); if (k === 'cuMine') return okf && okf({ ok: true, units: {} }); if (k === 'cwMine') return okf && okf({ ok: true, pieces: [] }); let o = orig; if (okf) o = o.withSuccessHandler(okf); if (nof) o = o.withFailureHandler(nof); return o[k](...a); }, 10); } });
      google.script.run = chain(null, null); });
    const p = pg.evaluate(u => TLCORE.units.check(TLCORE.units.byId[u]).then(r => JSON.stringify(r)), UNIT);
    await sleep(600); await shot('entrance');
    await pg.evaluate(() => document.querySelector('#cun [data-cu=start]').click()); await sleep(300);
    const log = [];
    for (let i = 0; i < 15; i++) {
      const st = await pg.evaluate(() => TLCORE.units.state()); if (!st || st.view !== 'q') break;
      await shot('q' + (st.i + 1) + '-' + st.kinds[st.i]);
      const r = await pg.evaluate(async () => { const sl = ms => new Promise(r => setTimeout(r, ms)); const U = TLCORE.units, s = U.__solve(), st = U.state(), Q = q => document.querySelector(q);
        const k = st.kinds[st.i];
        if (k === 'mc') { [...document.querySelectorAll('#cun [data-cu=pick]')][s.pick].click(); }
        else if (k === 'order') { for (const j of s.order) { Q('#cun [data-cu=tile][data-k="' + j + '"]').click(); await sl(30); } Q('#cun [data-cu=check]').click(); }
        else if (k === 'kit') { const a = s.act; if (a.type === 'evidence') Q('#cun [data-obk=sent][data-k="' + a.a + '"]').click(); else if (a.type === 'cloze') { Q('#cun [data-obk=word][data-k="' + a.a + '"]').click(); await sl(60); Q('#cun [data-cu=kcheck]').click(); } else return 'unknown kit ' + a.type; }
        await sl(150); return k + ':' + (document.querySelector('#cun .cu-fb') || {}).textContent; });
      log.push(r); await shot('q' + (st.i + 1) + '-answered');
      await pg.evaluate(() => { const b = document.querySelector('#cun [data-cu=next]'); if (b) b.click(); }); await sleep(300);
    }
    await shot('end');
    console.log(tag, log.join(' | '), 'errors', errs);
    await pg.evaluate(() => { const b = document.querySelector('#cun [data-cu=done]'); if (b) b.click(); }); console.log(tag, 'result', await Promise.race([p, sleep(3000).then(() => 'open')]));
    await browser.close();
  }
})();
