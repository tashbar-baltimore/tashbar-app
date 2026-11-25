/* Look at any boy screen at any size: a made-up TEST- boy, the same pretend server as tests/run.js.
   Run: VW=1366 VH=768 OUTF=/path/shot.png JS='BBX.openBook()' node tools/audit/probe.js
   JS runs in the page (await allowed); STEPS='js1;;js2' takes a picture after each step (OUTF gets -1, -2 ...). */
const S = require('../../tests/lib/screens.js');
(async () => {
  const { browser, pg, errs } = await S.kidPage({ width: +(process.env.VW || 390), height: +(process.env.VH || 844), scale: +(process.env.DPR || 1) });
  await pg.evaluate(() => { window.OB_LIVE = 'test'; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); render(); });
  const steps = (process.env.STEPS || process.env.JS || '').split(';;').filter(Boolean), out = process.env.OUTF || 'probe.png';
  for (let i = 0; i < steps.length; i++) {
    const r = await pg.evaluate(new Function('return (async () => {' + steps[i] + '})()'));
    if (r !== undefined) console.log('step', i + 1, JSON.stringify(r, null, 1).slice(0, +(process.env.MAXOUT || 4000)));
    await pg.waitForTimeout(+(process.env.WAIT || 500));
    await pg.screenshot({ path: steps.length > 1 ? out.replace(/\.png$/, '-' + (i + 1) + '.png') : out, fullPage: !!process.env.FULL });
  }
  console.log('page errors', errs.length, errs.slice(0, 3)); await browser.close();
})();
