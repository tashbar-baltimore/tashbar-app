/* Arena (house top left; Back before it on an inner page) and Mistake Detective review (kit ✕ top left).
   node tools/screens/arena.js OUT TAG GRADE   (2 = a K-3 boy, 5 = a grade 4+ boy). Made-up boy only. */
const S = require('../../tests/lib/screens.js');
const OUT = process.argv[2], TAG = process.argv[3] || 'before', GR = Number(process.argv[4] || 5);
require('fs').mkdirSync(OUT, { recursive: true });
const ITEMS = [
  ['arena', `tlArena.open()`],
  ['arenainner', `(async()=>{ tlArena.open(); await new Promise(r=>setTimeout(r,600)); const b=document.querySelector('#ar-ov [data-ar="new"]'); if(b) b.click(); })()`],
  ['detective', `(()=>{ TL_MD.open(); if(!document.querySelector('#mdx.on')){ const L=Object.keys(BANK_ALL).slice(0,40); A.st.skills=A.st.skills||{}; TL_MD.open(); } return !!document.querySelector('#mdx.on'); })()`],
];
(async () => {
  for (const [w, h, nm] of [[1366, 768, 'cb'], [390, 844, 'ph']]) {
    const { browser, pg, errs } = await S.kidPage({ width: w, height: h });
    await pg.evaluate(g => { TL_MAP.grade = g; A.st.grade = g; render(); }, GR);
    for (const [id, code] of ITEMS) {
      await pg.evaluate(() => { try { tlArena.close(); } catch (e) {} try { TL_MD.close(); } catch (e) {} });
      await pg.waitForTimeout(300);
      try { console.log(id, 'open:', await pg.evaluate(code)); } catch (e) { console.log(id, 'ERR', String(e).slice(0, 150)); }
      await pg.waitForTimeout(1500);
      await pg.screenshot({ path: `${OUT}/${TAG}-${id}-${nm}.png` });
      console.log(nm, id, 'house/back:', JSON.stringify(await pg.evaluate(require('./overlap-home.js'))), 'x:', JSON.stringify(await pg.evaluate(require('./overlap.js'))));
    }
    if (errs.length) console.log('page errors', errs);
    await browser.close();
  }
})();
