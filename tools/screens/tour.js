/* The button tour (HoS 2026-11-26): the hint by the lightbulb, every tour card, and My profile's "How the buttons work", at 1366x768 and 390x844.
   node tools/screens/tour.js OUT TAG GRADE   (2 = a K-3 boy: 6 cards, read aloud; 5 = grade 4+: 12 cards). Made-up boy only. */
const S = require('../../tests/lib/screens.js');
const OUT = process.argv[2], TAG = process.argv[3] || 'after', GR = Number(process.argv[4] || 5);
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  for (const [w, h, nm] of [[1366, 768, 'cb'], [390, 844, 'ph']]) {
    const { browser, pg, errs } = await S.kidPage({ width: w, height: h });
    await pg.evaluate(g => { try { Object.keys(localStorage).filter(k => k.indexOf('tl-tourhint') === 0).forEach(k => localStorage.removeItem(k)); } catch (e) {} TL_MAP.grade = g; A.st.grade = g; A.overlay = null; A.view = 'hub'; render(); }, GR);
    await pg.waitForTimeout(4000);
    await pg.screenshot({ path: `${OUT}/${TAG}-hint-${nm}.png` }); console.log(nm, 'hint shown:', await pg.evaluate(() => !!document.getElementById('tl-tourhint')));
    await pg.evaluate(() => document.querySelector('#gm [data-gm="pftour"]').click()); await pg.waitForTimeout(800);
    const n = await pg.evaluate(() => TLTOUR.cards().length);
    for (let i = 0; i < n; i++) {
      await pg.screenshot({ path: `${OUT}/${TAG}-card${i + 1}-${nm}.png` });
      console.log(nm, 'card', i + 1, JSON.stringify(await pg.evaluate(() => { const r = document.querySelector('#tl-tour .tlt-ring'), b = document.querySelector('#tl-tour .tlt-bub').getBoundingClientRect();
        return { lit: !!r, name: document.querySelector('#tl-tour h2').textContent, inScreen: b.top >= 0 && b.bottom <= innerHeight && b.left >= 0 && b.right <= innerWidth, nonkit: document.querySelectorAll('#tl-tour .tlt-act button:not(.tlk),#tl-tour .tlt-top button:not(.tlk)').length }; })));
      await pg.evaluate(() => { const b = document.querySelector('#tl-tour [data-tlt="next"],#tl-tour .tlt-act [data-tlt="x"]'); b.click(); }); await pg.waitForTimeout(400);
    }
    console.log(nm, 'closed at the end:', await pg.evaluate(() => !document.getElementById('tl-tour')));
    await pg.evaluate(() => { const b = document.querySelector('#gm [data-gmnav="more"]'); if (b) b.click(); }); await pg.waitForTimeout(1200);
    await pg.screenshot({ path: `${OUT}/${TAG}-profile-${nm}.png` }); console.log(nm, 'profile has the tour card:', await pg.evaluate(() => !!document.querySelector('#gm .pr-tour[data-gm="pftour"]')));
    if (errs.length) console.log('page errors', errs.slice(0, 5));
    await browser.close();
  }
})();
