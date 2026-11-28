/* THE NEW SHELL (docs/SHELL-CONTRACT.md): pictures of new-shell places, as a made-up boy, WITH the world pictures (art/pics served at /pics/).
   node tools/screens/shell.js OUT TAG GRADE id1,id2,...   (GRADE 3 = a K-3 boy, 5 = a grade 4+ boy; ids are SHK place ids, or "home")
   Optional: SETUP='js code run on the page first' (for example made-up money or made-up server answers).
   Saves OUT/TAG-<id>-cb.png (1366x768) and OUT/TAG-<id>-ph.png (390x844), waits for the flight to end, and prints the house/x overlap
   checks and any visible button that is not from the button kit. Made-up boy only. Do not run it at the same time as node tests/run.js. */
const S = require('../../tests/lib/screens.js');
const OUT = process.argv[2], TAG = process.argv[3] || 'shell', GR = Number(process.argv[4] || 5), IDS = String(process.argv[5] || 'home').split(',');
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  for (const [w, h, nm] of [[1366, 768, 'cb'], [390, 844, 'ph']]) {
    const { browser, pg, errs } = await S.kidPage({ width: w, height: h, pics: true, grade: GR });
    if (process.env.SETUP) { try { await pg.evaluate(process.env.SETUP); } catch (e) { console.log('SETUP failed', String(e).slice(0, 200)); } }
    for (const id of IDS) {
      await pg.evaluate(() => { try { SHK.closeAll(); } catch (e) {} });
      const opened = await pg.evaluate(id => { if (id === 'home') { try { render(); } catch (e) {} return true; } return !!(window.SHK && SHK.go(id)); }, id);
      await pg.waitForTimeout(3200);   /* the flight (about 2 s) and the pictures */
      await pg.screenshot({ path: `${OUT}/${TAG}-${id}-${nm}.png` });
      const nonKit = await pg.evaluate(() => [...document.querySelectorAll('.shk-page button,.shk-pop button')].filter(b => b.offsetParent && !b.classList.contains('tlk')).map(b => b.outerHTML.slice(0, 80)));
      console.log(nm, id, 'opened:', opened, 'house/back:', JSON.stringify(await pg.evaluate(require('./overlap-home.js'))), 'x:', JSON.stringify(await pg.evaluate(require('./overlap.js'))), nonKit.length ? 'NOT KIT: ' + JSON.stringify(nonKit) : '');
    }
    if (errs.length) console.log('page errors', errs);
    await browser.close();
  }
})();
