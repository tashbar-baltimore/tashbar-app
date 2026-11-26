/* node play.js OUTDIR id1,id2,...  : plays each One Bite lesson as a made-up TEST boy at 1366x768 and 390x844, one picture per screen,
   then a contact sheet per lesson and size. Made-up boy only. */
const S = require('/home/user/tashbar-app/tests/lib/screens.js');
const { obkStep } = require('/home/user/tashbar-app/tests/lib/onebite.js');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const OUT = process.argv[2], IDS = process.argv[3].split(','), SIZES = (process.argv[4] || 'cb,ph').split(',');
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const report = {};
  for (const sz of SIZES) {
    const [w, h] = sz === 'cb' ? [1366, 768] : [390, 844];
    const { browser, pg, errs } = await S.kidPage({ width: w, height: h });
    await pg.waitForFunction(ids => window.TLCORE && window.OB && ids.every(i => window.ONE_BITE[i] && BANK_ALL[i]), IDS, { timeout: 180000 }); await sleep(3000);
    await pg.evaluate(src => { window.__obkStep = (0, eval)('(' + src + ')'); window.OB_LIVE = 'test'; }, obkStep.toString());
    for (const id of IDS) {
      const dir = path.join(OUT, id + '-' + sz); fs.mkdirSync(dir, { recursive: true }); fs.readdirSync(dir).forEach(f => fs.unlinkSync(path.join(dir, f)));
      const e0 = errs.length;
      await pg.evaluate(id => { A.overlay = null; A.play = null; A.res = null; SRV.token = 't'; SRV.states = {}; A.st = loadStudent({ id: 'TEST-01', name: 'Made-up Boy A' }); A.view = 'hub'; render();
        const pre = id.split('.')[0]; const wd = WORLD[pre] ? pre : WORLD.READ ? 'READ' : Object.keys(WORLD)[0]; startMission(wd, id, 'skill'); }, id);
      await sleep(400);
      let n = 0, last = '', shots = 0, info = { screens: [], err: '' };
      while (n++ < 300) {
        const st = await pg.evaluate(() => { const p = A.play; if (A.view !== 'play' || !p) return { view: A.view, done: !!document.querySelector('#app .ob-done') };
          const ob = p.ob, s = ob.stage; const k = ob.kit; return { view: 'play', stage: s, key: s + (s === 'do' || s === 'your' ? ':' + k.i + ':' + k.acts[k.i].type : s === 'q' ? ':' + p.i : s === 'watch' ? ':' + ob.ws : ''), overlay: !!A.overlay }; });
        if (st.view !== 'play') { await sleep(500); await pg.screenshot({ path: path.join(dir, String(++shots).padStart(2, '0') + '-done.png') }); info.screens.push('done'); info.mastered = await pg.evaluate(id => !!(A.st.skills[id] && A.st.skills[id].m), id); break; }
        if (st.overlay) { info.err = 'pop-up during lesson'; break; }
        if (st.key !== last) { last = st.key; await sleep(250); await pg.screenshot({ path: path.join(dir, String(++shots).padStart(2, '0') + '-' + st.key.replace(/[:]/g, '_') + '.png') }); info.screens.push(st.key);
          const m = await pg.evaluate(() => ({ sx: document.documentElement.scrollWidth > innerWidth + 1, below: (() => { const f = document.querySelector('#app .ob-foot'); return f ? Math.round(f.getBoundingClientRect().bottom) > innerHeight + 2 : false; })() }));
          if (m.sx) info.err += ' sideways scroll at ' + st.key + ';'; }
        const a = await pg.evaluate(() => { const p = A.play, ob = p.ob, st = ob.stage;
          if (st === 'do' || st === 'your') return window.__obkStep(false);
          if (st !== 'q') { const opt2 = document.querySelector('#app [data-ob=rpick]:not([disabled])');
            if (opt2) { const q = ob.bite.ready[ob.ri]; const k = q.o.indexOf(q.a); document.querySelector('#app [data-ob=rpick][data-k="' + k + '"]').click(); return 'ready'; }
            const go = document.querySelector('#app .ob-foot .ob-go'); if (!go) return 'no go'; go.click(); return 'go'; }
          const it = p.items[p.i]; p.shownAt = 0; p.cool = 0; answer(it.t === 'num' ? String(it.a) : it.correct); if (!(p.fb && p.fb.ok)) return 'no: right answer not accepted';
          return 'answered'; });
        if (a === 'answered') { await sleep(300); await pg.screenshot({ path: path.join(dir, String(++shots).padStart(2, '0') + '-' + last.replace(/[:]/g, '_') + '-fb.png') }); await pg.evaluate(() => next()); }
        if (/^no/.test(a) || /unknown|nokit/.test(a)) { info.err += ' ' + last + ': ' + a; break; }
        await sleep(/^(book opening|page|proof|open)$/.test(a) ? 120 : 60);
      }
      info.pageErrors = errs.slice(e0);
      report[id + '-' + sz] = info; console.log(id, sz, JSON.stringify(info));
    }
    await browser.close();
  }
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1));
})();
