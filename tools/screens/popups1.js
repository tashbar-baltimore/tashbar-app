const S = require('../../tests/lib/screens.js');
const OUT = process.argv[2], TAG = process.argv[3] || 'before';
const fs = require('fs'); fs.mkdirSync(OUT, { recursive: true });
const CLEAN = () => { document.querySelectorAll('.rpzoom').forEach(x=>x.remove()); try{ document.querySelectorAll('[data-st="close"]').forEach(b=>b.click()); }catch(e){} document.querySelectorAll('#tlstore,.stov,#gm-room,.hpdraw,#kkov,.kkov,.rpzoom,.tq-ov,.tq-pv,#tr-ov,.tt-ov,.tt-pv,#bl-ov,.bl-ov').forEach(x => x.remove()); try { if (window.HP) HP.open = null; } catch (e) {} try { A.overlay = null; A.view = 'hub'; render(); } catch (e) {} };
const clickInj = (html) => { const w = document.createElement('div'); w.innerHTML = html; w.style.cssText = 'position:fixed;left:-999px'; document.body.appendChild(w); w.firstElementChild.click(); setTimeout(() => w.remove(), 50); };
const ITEMS = [
  ['store', () => window.tlStore()],
  ['bank', () => { const w = document.createElement('div'); w.innerHTML = '<button data-gm="room" data-t="bank">b</button>'; document.body.appendChild(w); w.firstChild.click(); }],
  ['trophies', () => { const w = document.createElement('div'); w.innerHTML = '<button data-gm="room" data-t="badges">b</button>'; document.body.appendChild(w); w.firstChild.click(); }],
  ['homeplus', () => { const k = Object.keys(HP.panels || {})[0]; HP.open = k; render(); }],
  ['kodeshquest', () => window.tlKinderKriyah()],
  ['taryag', () => { const w = document.createElement('div'); w.innerHTML = '<button data-tq="open">b</button>'; document.body.appendChild(w); w.firstChild.click(); }],
  ['sparkpath', () => { window.TL_APP_URL='about:blank'; const w = document.createElement('div'); w.innerHTML = '<button data-tr="spark">b</button>'; document.body.appendChild(w); w.firstChild.click(); }],
  ['torahtracks', () => { const w = document.createElement('div'); w.innerHTML = '<button data-tj="trk" data-k="HAL">b</button>'; document.body.appendChild(w); w.firstChild.click(); }],
  ['journey', () => { const w = document.createElement('div'); w.innerHTML = '<button data-gm="room" data-t="map">b</button>'; document.body.appendChild(w); w.firstChild.click(); }],
  ['week', () => { const w = document.createElement('div'); w.innerHTML = '<button data-gm="room" data-t="week">b</button>'; document.body.appendChild(w); w.firstChild.click(); }],
  ['piczoom', async () => { const ids = Object.keys(window.TL_PIC_MAP || {}); for (const id of ids.slice(0, 40)) { try { A.overlay = null; startMission(id.split('.')[0], id, 'skill'); } catch (e) { continue; } await new Promise(r => setTimeout(r, 600)); for (let k = 0; k < 6 && !document.querySelector('.qcard .rp'); k++) { const b = document.querySelector('.overlay [data-act="closeov"], [data-act="next"], [data-act="cont"]'); if (b) b.click(); await new Promise(r => setTimeout(r, 400)); } const z = document.querySelector('.qcard .rp .rpz,.qcard .rp .rpbox'); if (z) { z.click(); return id; } } return 'none'; }],
  ['library', () => { const w = document.createElement('div'); w.innerHTML = '<button data-bl-open="1">b</button>'; document.body.appendChild(w); w.firstChild.click(); }],
];
(async () => {
  for (const [w, h, nm] of [[1366, 768, 'cb'], [390, 844, 'ph']]) {
    const { browser, pg, errs } = await S.kidPage({ width: w, height: h });
    await pg.evaluate(INFO => { const real = google.script.run; const mk = (ok, no) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => mk(f, no); if (k === 'withFailureHandler') return f => mk(ok, f); if (k === 'withUserObject') return () => mk(ok, no);
      if (k === 'stInfo') return () => setTimeout(() => ok && ok(INFO), 20); let r = real; if (ok) r = r.withSuccessHandler(ok); if (no) r = r.withFailureHandler(no); return r[k]; } });
      google.script.run = mk(null, null); A.st.balance = 42.5; render(); }, Object.assign(require('./stinfo.js')(), { balance: 42.5 }));
    for (const [id, fn] of ITEMS) {
      if (process.argv[4] && !process.argv[4].split(',').includes(id)) continue;
      await pg.evaluate(CLEAN); await pg.waitForTimeout(300);
      try { await pg.evaluate(fn); } catch (e) { console.log(id, 'ERR', String(e).slice(0, 150)); }
      await pg.waitForTimeout(id==='store'?6000:1500); if(id==='sparkpath') console.log('tr-ov?', await pg.evaluate(()=>!!document.getElementById('tr-ov')));
      await pg.screenshot({ path: `${OUT}/${TAG}-${id}-${nm}.png` }); console.log(nm, id, JSON.stringify(await pg.evaluate(require('./overlap.js'))));
      console.log('shot', id, nm);
    }
    if (errs.length) console.log('page errors', errs);
    await browser.close();
  }
})();
