/* Information on the kit labels (button system step 5): the home tiles' badges, the Store page and pop-up, the K-1 games path
   and Mistake Detective's end screen. node tools/screens/info.js OUT TAG GRADE [ids]   (2 = a K-3 boy, 5 = a grade 4+ boy;
   the K-1 path always uses a made-up Grade 1 boy). Made-up boy only. Prints anything information-like that still looks like a button. */
const S = require('../../tests/lib/screens.js');
const OUT = process.argv[2], TAG = process.argv[3] || 'before', GR = Number(process.argv[4] || 5), ONLY = process.argv[5];
require('fs').mkdirSync(OUT, { recursive: true });
const CLEAN = () => { try { document.querySelectorAll('[data-st="close"]').forEach(b => b.click()); } catch (e) {} document.querySelectorAll('#tlstore,.stov').forEach(x => x.remove());
  try { TL_MD.close(); } catch (e) {} try { localStorage.removeItem('tl-k1only'); window.K1O && (K1O.grade = null); } catch (e) {}
  try { A.overlay = null; A.view = 'hub'; GM.from = null; GM.tab = 'home'; GM.sig = ''; render(); } catch (e) {} };
const ITEMS = [
  ['home', `1`],
  ['store', `(()=>{ GM.tab='money'; GM.sig=''; render(); })()`],
  ['storepop', `window.tlStore()`],
  ['k1path', `(()=>{ localStorage.setItem('tl-k1only','1'); K1O.grade=1; K1O.subj='MATH'; A.overlay=null; A.view='hub'; render(); return !!document.getElementById('k1o'); })()`],
  ['mdend', `(async()=>{ const s=ms=>new Promise(r=>setTimeout(r,ms)); TL_MD.open(); const t0=Date.now();
     while(Date.now()-t0<120000 && !document.querySelector('#mdx .mdend')){ const b=[...document.querySelectorAll('#mdx .mdgo:not([data-md="again"]):not([data-md="close"]),#mdx .mdb:not([disabled])')].pop(); if(b) b.click(); await s(1300); }
     return !!document.querySelector('#mdx .mdend'); })()`],
];
/* information that looks like a button: a pill or box with a shadow, an outline or a hand pointer (one inside a tile button may show the tile's pointer) */
const CHECK = () => [...document.querySelectorAll('.tlk-pill,.tlk-box')].filter(e => e.offsetParent && !e.closest('button,[role=button],a')).map(e => { const c = getComputedStyle(e);
  return (c.boxShadow !== 'none' || (parseFloat(c.borderTopWidth) > 0 && c.borderTopStyle !== 'none') || c.cursor === 'pointer') ? (e.className + ' "' + e.textContent.trim().slice(0, 20) + '"') : null; }).filter(Boolean);
(async () => {
  for (const [w, h, nm] of [[1366, 768, 'cb'], [390, 844, 'ph']]) {
    const { browser, pg, errs } = await S.kidPage({ width: w, height: h });
    await pg.evaluate(([INFO, g]) => { const real = google.script.run; const mk = (ok, no) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => mk(f, no); if (k === 'withFailureHandler') return f => mk(ok, f); if (k === 'withUserObject') return () => mk(ok, no);
      if (k === 'stInfo') return () => setTimeout(() => ok && ok(INFO), 20); let r = real; if (ok) r = r.withSuccessHandler(ok); if (no) r = r.withFailureHandler(no); return r[k]; } });
      google.script.run = mk(null, null); A.st.balance = 42.5; TL_MAP.grade = g; A.st.grade = g; GM.sig = ''; render(); }, [Object.assign(require('./stinfo.js')(), { balance: 42.5 }), GR]);
    for (const [id, code] of ITEMS) {
      if (ONLY && !ONLY.split(',').includes(id)) continue;
      await pg.evaluate(CLEAN); await pg.waitForTimeout(300);
      try { console.log(nm, id, 'open:', await pg.evaluate(code)); } catch (e) { console.log(id, 'ERR', String(e).slice(0, 150)); }
      await pg.waitForTimeout(id === 'storepop' ? 6000 : 1800);
      await pg.screenshot({ path: `${OUT}/${TAG}-${id}-${nm}.png` });
      console.log(nm, id, 'info that looks like a button:', JSON.stringify(await pg.evaluate(CHECK)));
    }
    if (errs.length) console.log('page errors', errs);
    await browser.close();
  }
})();
