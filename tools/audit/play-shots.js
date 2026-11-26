/* Plays chosen lessons as a made-up boy at 390px and saves a picture of every screen (pop-ups included).
   Run: IDS=MATH.OPS.L05.02,LK.KRI.L01.07.c node tools/audit/play-shots.js   Output: tools/audit/out/shots/ + shots.json
   Options: VW=1366 VH=768 (Chromebook size; default 390x844 phone), DPR=2, DIR=name (output folder under out/). */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const B = require('../../tests/lib/build.js');
const OUT = path.join(__dirname, 'out', process.env.DIR || (process.env.OB ? 'shots-ob' : 'shots')); fs.mkdirSync(OUT, { recursive: true });
const FAKE = require('./fake.js');
(async () => {
  const K = B.kid(); const errs = [];
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: +(process.env.VW || 390), height: +(process.env.VH || 844) }, deviceScaleFactor: +(process.env.DPR || 1) });
  await ctx.addInitScript(FAKE, { tools: K.tools, parts: K.parts });
  const ids = (process.env.IDS || '').split(',').filter(Boolean); const rec = {};
  for (const id of ids) {
  const pg = await ctx.newPage();
    pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
    await pg.route('**/*', r => r.request().url() === 'http://app.test/' ? r.fulfill({ contentType: 'text/html', body: K.page }) : r.abort());
    await pg.goto('http://app.test/');
    await pg.waitForFunction(() => window.TLT && typeof BANK_ALL !== 'undefined' && Object.keys(BANK_ALL).length > 500, null, { timeout: 180000 });
    await pg.waitForTimeout(15000);
    if (process.env.OB) await pg.evaluate(v => { window.OB_LIVE = v; }, process.env.OB);
    const tag = id.replace(/[^A-Za-z0-9]+/g, '_'); rec[id] = [];
    await pg.evaluate(id => { A.overlay = null; SRV.token = 't'; SRV.states = {}; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.session = 0; A.view = 'hub'; render();
      const pre = id.split('.')[0], map = /^(LK|HEB)$/.test(pre) ? 'LK' : /^(READ|WRIT|LANG)$/.test(pre) ? 'READ' : /^(SS|SOC|FACT)$/.test(pre) ? 'SS' : /^(COMP|VOC)$/.test(pre) ? 'COMP' : pre;
      const c = WORLD[pre] ? pre : WORLD[map] ? map : Object.keys(WORLD)[0]; startMission(c, id, 'skill'); }, id);
    await pg.evaluate(src => { window.__obkStep = (0, eval)('(' + src + ')'); }, require('../../tests/lib/onebite.js').obkStep.toString());
    await pg.waitForTimeout(700);
    let lastKit = '', kitTaps = 0;
    let n = 0, wrongDone = false, ttTaken = !process.env.TT, ttLeft = 0;
    while (n < 70 && kitTaps < 400) {
      /* Activity Kit screens (round 2): one picture when an activity opens and one when it is done; taps in between are not pictured */
      const kst = await pg.evaluate(() => { const p = A.play, k = p && p.ob && p.ob.kit; if (A.view !== 'play' || !k || !/^(do|your)$/.test(p.ob.stage)) return null; return p.ob.stage + k.i + (k.s.over ? 'done' : k.s.phase === 'why' ? 'why' : ''); });
      if (kst) { kitTaps++;
        if (kst !== lastKit) { lastKit = kst; const file = tag + '_' + String(n).padStart(2, '0') + '.png'; await pg.screenshot({ path: path.join(OUT, file) }); rec[id].push({ kit: kst, file }); n++; }
        await pg.evaluate(() => window.__obkStep(false)); await pg.waitForTimeout(kst.endsWith('done') ? 350 : 60); continue; }
      const st = await pg.evaluate(() => { const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        const btns = [...document.querySelectorAll('button,[data-act]')].filter(vis);
        return { view: A.view, i: A.play ? A.play.i : -1, of: A.play ? A.play.items.length : 0, phase: A.play && A.play.items[A.play.i] ? A.play.items[A.play.i].phase : '', t: A.play && A.play.items[A.play.i] ? A.play.items[A.play.i].t : '',
          overlay: !!document.querySelector('.overlay, [role=dialog]'), buttons: btns.length, words: document.body.innerText.split(/\s+/).filter(Boolean).length, fb: !!(A.play && A.play.fb) }; });
      const file = tag + '_' + String(n).padStart(2, '0') + '.png'; await pg.screenshot({ path: path.join(OUT, file) }); st.file = file; rec[id].push(st); n++;
      if (st.view !== 'play') break;
      const acted = await pg.evaluate(tt => { const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        const cl = [...document.querySelectorAll('button,[data-act],a')].filter(vis); const find = re => cl.find(b => re.test((b.textContent || '').trim()));
        const ro = document.querySelector('[data-ob=rpick]:not([disabled])'); if (ro) { ro.click(); return 'ob'; }
        const og = document.querySelector('.ob-foot .ob-go'); if (og && A.play && A.play.ob && A.play.ob.stage !== 'q') { og.click(); return 'ob'; }
        if (tt.want && !tt.done) { const f = find(/Play the fun lesson/i); if (f) { f.click(); return 'tt'; } }
        if (tt.ttLeft > 0) { const nx = find(/^Next/); if (nx && document.body.innerText.indexOf('Start the questions') >= 0) { nx.click(); return 'ttnext'; } }
        for (const re of [/Start the questions/i, /I.m ready/i, /Let.s go/i, /Full lesson/i, /^Start/i, /Got it/i, /Continue/i, /^OK/i]) { const b = find(re); if (b && (document.querySelector('.overlay,[role=dialog]') || /Start the questions|I.m ready/.test(b.textContent))) { b.click(); return 'ov'; } }
        return ''; }, { want: !ttTaken, done: false, ttLeft });
      if (acted === 'tt') { ttTaken = true; ttLeft = 7; await pg.waitForTimeout(1200); continue; }
      if (acted === 'ttnext') { ttLeft--; await pg.waitForTimeout(1500); continue; }
      if (acted === 'ov') { ttLeft = 0; }
      if (acted === 'ob') { await pg.waitForTimeout(450); continue; }
      if (acted) { await pg.waitForTimeout(400); continue; }
      const r = await pg.evaluate(w => { const p = A.play, it = p.items[p.i]; if (p.fb && p.fb.ok) { p.shownAt = 0; next(); return 'next'; }
        if (p.fb && !p.fb.ok && it.phase === 'check') { next(); return 'next'; }
        p.shownAt = 0; p.cool = 0; if (it.t === 'write') p.text = 'word word word word word word word';
        if (!w && it.phase !== 'check' && it.t === 'mc') { const bad = (it.shown || []).find(x => x !== it.correct); if (bad != null) { answer(bad); return 'wrong'; } }
        answer(it.t === 'num' ? String(it.a) : it.t === 'write' ? p.text : it.correct); return 'right'; }, wrongDone);
      if (r === 'wrong') wrongDone = true;
      await pg.waitForTimeout(r === 'wrong' ? 500 : 350);
    }
    await pg.close();
  }
  fs.writeFileSync(path.join(OUT, '..', 'shots-' + (process.env.OB ? 'ob' : 'old') + (process.env.TAG||'') + '.json'), JSON.stringify(rec, null, 1));
  console.log('done', Object.keys(rec).map(k => k + ':' + rec[k].length).join(' '), 'errors', errs.length, errs.slice(0, 3));
  await browser.close();
})();
