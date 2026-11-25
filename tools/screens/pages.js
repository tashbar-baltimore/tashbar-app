/* Full pages (house top left): My map, Change subject, My work, My profile, All my lessons (from My profile), Chumash page, Workbook.
   node tools/screens/pages.js OUT TAG GRADE [ids]   (GRADE 2 = a K-3 boy, 5 = a grade 4+ boy). Made-up boy only. */
const S = require('../../tests/lib/screens.js');
const OUT = process.argv[2], TAG = process.argv[3] || 'before', GR = Number(process.argv[4] || 5), ONLY = process.argv[5];
require('fs').mkdirSync(OUT, { recursive: true });
const CLEAN = () => { try { window.tlChm && tlChm.close(); } catch (e) {} try { window.BBX && BBX.open && BBX.close(); } catch (e) {} try { A.overlay = null; A.view = 'hub'; GM.from = null; GM.tab = 'home'; GM.sig = ''; render(); } catch (e) {} };
const nav = t => `(async()=>{ const s=ms=>new Promise(r=>setTimeout(r,ms)); for(const k of ${JSON.stringify(t)}){ const b=document.querySelector('#gm [data-gmnav="'+k+'"],#gm [data-gm="'+k+'"]'); if(b) b.click(); await s(150); } })()`;
const ITEMS = [
  ['map', nav(['map'])],
  ['subjects', nav(['map', 'subjects'])],
  ['work', nav(['missions'])],
  ['profile', nav(['more'])],
  ['lessons', nav(['more', 'lib'])],
  ['chumash', `tlChm.open()`],
  ['workbook', `BBX.openBook()`],
];
(async () => {
  for (const [w, h, nm] of [[1366, 768, 'cb'], [390, 844, 'ph']]) {
    const { browser, pg, errs } = await S.kidPage({ width: w, height: h });
    await pg.evaluate(g => { TL_MAP.grade = g; A.st.grade = g; GM.sig = ''; render(); }, GR);
    for (const [id, code] of ITEMS) {
      if (ONLY && !ONLY.split(',').includes(id)) continue;
      await pg.evaluate(CLEAN); await pg.waitForTimeout(300);
      try { await pg.evaluate(code); } catch (e) { console.log(id, 'ERR', String(e).slice(0, 150)); }
      await pg.waitForTimeout(1800);
      await pg.screenshot({ path: `${OUT}/${TAG}-${id}-${nm}.png` }); console.log(nm, id, JSON.stringify(await pg.evaluate(require('./overlap-home.js'))));
      console.log(nm, id, 'workbook door touches top row:', await pg.evaluate(() => { const d = document.getElementById('bbx-door'); if (!d) return 'no door'; const r = d.getBoundingClientRect(); return [...document.querySelectorAll('#gm .gm-hud > *')].filter(e => { const q = e.getBoundingClientRect(); return !(q.right <= r.left - 4 || q.left >= r.right + 4 || q.bottom <= r.top - 4 || q.top >= r.bottom + 4); }).map(e => e.className).join(',') || 'nothing'; }));
    }
    if (errs.length) console.log('page errors', errs);
    await browser.close();
  }
})();
