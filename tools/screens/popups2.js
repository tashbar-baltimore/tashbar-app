const S = require('../../tests/lib/screens.js');
const OUT = process.argv[2], TAG = process.argv[3] || 'before', ONLY = process.argv[4];
require('fs').mkdirSync(OUT, { recursive: true });
const CLEAN = () => { document.querySelectorAll('#hlx-shelf').forEach(x => x.remove()); try { A.overlay = null; A.view = 'hub'; render(); } catch (e) {} };
const inj = h => { const w = document.createElement('div'); w.style.cssText='position:fixed;left:-999px;top:0'; w.innerHTML = h; document.body.appendChild(w); w.firstChild.click(); setTimeout(()=>w.remove(),100); };
const ITEMS = [
  ['shelf', `(${inj})('<button data-hlxshelf="MATH">b</button>')`],
  ['music', `(${inj})('<button data-act="mubtn">b</button>')`],
  ['weekreport', `p3Shabbos()`],
  ['story', `window.tlHashemMoment()`],
  ['gamzu', `window.tlGamZu()`],
  ['notesent', `(async()=>{ window.tlTalkRebbe(); await new Promise(r=>setTimeout(r,500)); const s=document.getElementById('tr-to'); if(s){ s.innerHTML+='<option value="R1">Rabbi Made-up</option>'; s.value='R1'; s.dispatchEvent(new Event('change')); } document.getElementById('tr-text').value='Thank you for the lesson today.'; (${inj})('<button data-tr="send">b</button>'); })()`],
  ['levels', `(${inj})('<button data-hp="levels">b</button>')`],
];
(async () => {
  for (const [w, h, nm] of [[1366, 768, 'cb'], [390, 844, 'ph']]) {
    const { browser, pg, errs } = await S.kidPage({ width: w, height: h });
    await pg.evaluate(() => { const real = google.script.run; const F = { crSend: () => ({ ok: true, to: 'Rabbi Made-up' }), crStaffList: () => [{ id: 'R1', name: 'Rabbi Made-up' }] };
      const mk = (ok, no) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => mk(f, no); if (k === 'withFailureHandler') return f => mk(ok, f); if (k === 'withUserObject') return () => mk(ok, no);
        if (F[k]) return (...a) => setTimeout(() => ok && ok(F[k](...a)), 20); let r = real; if (ok) r = r.withSuccessHandler(ok); if (no) r = r.withFailureHandler(no); return r[k]; } });
      google.script.run = mk(null, null); A.st.balance = 42.5; render(); });
    for (const [id, code] of ITEMS) {
      if (ONLY && !ONLY.split(',').includes(id)) continue;
      await pg.evaluate(CLEAN); await pg.waitForTimeout(300);
      try { await pg.evaluate(code); } catch (e) { console.log(id, 'ERR', String(e).slice(0, 150)); }
      await pg.waitForTimeout(1800);
      await pg.screenshot({ path: `${OUT}/${TAG}-${id}-${nm}.png` }); console.log(nm, id, JSON.stringify(await pg.evaluate(require('./overlap.js'))));
    }
    if (errs.length) console.log('page errors', errs);
    await browser.close();
  }
})();
