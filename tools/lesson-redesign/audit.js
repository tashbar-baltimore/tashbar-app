/* Lesson Redesign audit (HoS 2026-11-27): plays real lessons as a made-up TEST- boy, counts every tap, and takes a picture of every screen.
   node tools/lesson-redesign/audit.js OUTDIR ID,ID,...   [W=1366 H=768]
   A tap = one click a boy makes. A "thinking tap" = a tap that answers something (an activity move, a ready/check answer);
   a "next tap" = a forward button that only shows more. Made-up boy only. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const B = require('../../tests/lib/build.js'), FAKE = require('../audit/fake.js'), OB = require('../../tests/lib/onebite.js');
const OUT = process.argv[2], IDS = String(process.argv[3] || '').split(',').filter(Boolean);
const W = +(process.env.W || 1366), H = +(process.env.H || 768);
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const K = B.kid(), br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 }); await ctx.addInitScript(FAKE, { tools: K.tools, parts: K.parts });
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  let TX = null; const realText = id => { if (!TX) { TX = {}; try { require('../core/texts.js').load().out.forEach(t => { TX[t.id] = t; }); } catch (e) {} } return TX[id]; };
  await pg.route('**/*', r => { const u = r.request().url(); if (u === 'http://app.test/') return r.fulfill({ contentType: 'text/html', body: K.page });
    const m = /\/texts\/([A-Za-z0-9.]+)\.json$/.exec(u), t = m && realText(m[1]); return t ? r.fulfill({ contentType: 'application/json', body: JSON.stringify(t) }) : r.abort(); });
  await pg.goto('http://app.test/');
  await pg.waitForFunction(() => window.TLT && typeof BANK_ALL !== 'undefined' && Object.keys(BANK_ALL).length > 500, null, { timeout: 180000 }); await pg.waitForTimeout(12000);
  await pg.evaluate(src => { window.__obkStep = (0, eval)('(' + src + ')'); }, OB.obkStep.toString());
  const rows = [];
  for (const id of IDS) {
    const r = await pg.evaluate(async id => {
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      const pre = id.split('.')[0], map = /^(LK|HEB)$/.test(pre) ? 'LK' : /^(READ|WRIT|LANG)$/.test(pre) ? 'READ' : /^(SS|SOC|FACT)$/.test(pre) ? 'SS' : /^(COMP|VOC)$/.test(pre) ? 'COMP' : pre;
      const world = WORLD[pre] ? pre : WORLD[map] ? map : Object.keys(WORLD)[0];
      A.overlay = null; A.play = null; A.res = null; SRV.token = 't'; SRV.states = {}; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.st.grade = 5; A.view = 'hub'; render();
      await sleep(20); startMission(world, id, 'skill'); await sleep(30);
      window.__aud = { id, taps: 0, think: 0, next: 0, screens: [], words: 0 }; return !!(A.play && A.play.ob);
    }, id);
    if (!r) { rows.push({ id, err: 'did not open as a lesson' }); continue; }
    let n = 0, last = '', guard = 0;
    while (guard++ < 300) {
      const st = await pg.evaluate(async () => {
        const sleep = ms => new Promise(r => setTimeout(r, ms)); const a = window.__aud, p = A.play;
        if (A.view !== 'play' || !p || !p.ob) return { end: true };
        const stg = p.ob.stage, key = stg + ':' + (p.ob.kit ? p.ob.kit.i : '') + ':' + (p.ob.ws || 0) + ':' + (p.ob.li || 0) + ':' + p.i;
        const txt = (document.querySelector('#app main, #app .play') || {}).innerText || '';
        return { stg, key, words: txt.split(/\s+/).filter(Boolean).length };
      });
      if (st.end) break;
      if (st.key !== last) { last = st.key; n++; await pg.waitForTimeout(450); await pg.screenshot({ path: path.join(OUT, id + '-' + String(n).padStart(2, '0') + '-' + st.stg + '.png') }); }
      const res = await pg.evaluate(async () => {
        const sleep = ms => new Promise(r => setTimeout(r, ms)); const a = window.__aud, p = A.play, st = p.ob.stage;
        if (st === 'do' || st === 'your' || (st === 'learn' && p.ob.kit)) { const x = window.__obkStep(false); if (/^(book opening)$/.test(x)) { await sleep(60); return x; } a.taps++; if (x === 'next') a.next++; else a.think++; await sleep(5); return x; }
        if (st !== 'q') { const opt = document.querySelector('#app [data-ob=rpick]:not([disabled]), #app [data-ob=hpick]:not([disabled]), #app [data-ob=wpick]:not([disabled])');
          if (opt) { const q = (p.ob.bite.ready || [])[p.ob.ri]; let el = opt; if (opt.dataset.ob === 'rpick' && q) el = document.querySelector('#app [data-ob=rpick][data-k="' + q.o.indexOf(q.a) + '"]') || opt;
            if (opt.dataset.ob === 'wpick') { const w = p.ob.who; el = document.querySelector('#app [data-ob=wpick][data-k="' + (w ? +w.a : 0) + '"]') || opt; }
            el.click(); a.taps++; a.think++; await sleep(5); return 'pick'; }
          const go = document.querySelector('#app .ob-foot .ob-go'); if (!go) return 'stuck'; go.click(); a.taps++; a.next++; await sleep(5); return 'go'; }
        const it = p.items[p.i]; p.shownAt = 0; p.cool = 0; if (it.t === 'write') p.text = new Array((it.min || 5) + 2).join('word ');
        answer(it.t === 'num' ? String(it.a) : it.t === 'write' ? p.text : it.correct); a.taps++; a.think++; await sleep(3); next(); a.taps++; a.next++; await sleep(3); return 'q';
      });
      if (res === 'stuck' || /^no |missing|unknown/.test(res)) { console.log(id, 'stuck at', st.stg, res); break; }
    }
    await pg.waitForTimeout(200); n++; await pg.screenshot({ path: path.join(OUT, id + '-' + String(n).padStart(2, '0') + '-done.png') });
    const a = await pg.evaluate(() => Object.assign({}, window.__aud, { mastered: !!(A.st.skills[window.__aud.id] && A.st.skills[window.__aud.id].m), band: A.play && A.play.ob ? A.play.ob.bite.band : (OB.res && OB.res.bite || {}).band }));
    a.pictures = n; rows.push(a); console.log(JSON.stringify(a));
  }
  fs.writeFileSync(path.join(OUT, 'audit.json'), JSON.stringify(rows, null, 1));
  console.log('page errors', errs.length, errs.slice(0, 3)); await br.close();
})();
