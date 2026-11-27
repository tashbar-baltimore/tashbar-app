/* 2.0 TEST (run by tests/run.js): Kindergarten Numbers clarity rules a script can check (v2/curriculum/K-CLARITY-RULES.md).
   - The map: on a Chromebook (1366x768) and a phone (390x844), every stop of every unit is fully on screen and no two stops overlap.
   - Unit 2 path stones: every stone shows its own amount (n dots for n), so 6 to 10 never look alike (rule 8, "things to count are clear").
   - No faces on objects: the peek cloth and towel have no eyes (school rule; rule 10, no silly props).
   - Candle cards: 4 and 5 Shabbos candles never overlap each other (rule 8).
   Returns { fails, oks }. */
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const R = path.join(__dirname, '..', '..');

module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 K Numbers clarity: ' + m);
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'v2kc-'));
  try { cp.execFileSync(process.execPath, [path.join(R, 'v2', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: dist }), stdio: 'pipe' }); }
  catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
  async function open(file, w, h) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 800 }), pg = await ctx.newPage(), errs = [];
    pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await pg.route('**/*', r => { const u = new URL(r.request().url());
      if (u.host === 'v2.test') { let f = path.join(dist, decodeURIComponent(u.pathname.slice(1))); if (u.pathname.endsWith('/')) f = path.join(f, 'index.html');
        if (f.startsWith(dist) && fs.existsSync(f) && fs.statSync(f).isFile()) return r.fulfill({ path: f }); return r.fulfill({ status: 404, body: '' }); }
      return r.abort(); });
    await pg.goto('http://v2.test/k-numbers/' + file);
    return { ctx, pg, errs };
  }
  try {
    /* 1. the map fits and no stop sits on another */
    for (const [w, h] of [[1366, 768], [390, 844]]) {
      const m = await open('index.html?look=1', w, h);
      try {
        await m.pg.waitForSelector('.stop', { timeout: 10000 });
        const units = await m.pg.evaluate(() => NK_UNITS.map((u, i) => [i, u.stops.length]).filter(x => x[1]));
        for (const [i] of units) {
          await m.pg.evaluate(i => document.querySelector('.uchip[data-u="' + i + '"]').click(), i); await m.pg.waitForTimeout(60);
          const r = await m.pg.evaluate(() => [...document.querySelectorAll('.stop')].map(s => { const b = s.getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom]; }));
          const offs = r.filter(b => b[0] < -1 || b[1] < -1 || b[2] > w + 1 || b[3] > h + 1).length;
          if (offs) bad('map, unit ' + (i + 1) + ' (' + w + ' wide): ' + offs + ' stop(s) off the screen');
          let over = 0; for (let a = 0; a < r.length; a++) for (let b = a + 1; b < r.length; b++) {
            const x = Math.min(r[a][2], r[b][2]) - Math.max(r[a][0], r[b][0]), y = Math.min(r[a][3], r[b][3]) - Math.max(r[a][1], r[b][1]);
            if (x > 6 && y > 6) over++; }
          if (over) bad('map, unit ' + (i + 1) + ' (' + w + ' wide): ' + over + ' pair(s) of stops on top of each other');
        }
        m.errs.forEach(e => bad('map page error: ' + e));
      } finally { await m.ctx.close(); }
    }
    /* 2. Unit 2 stones show their own amount */
    const s = await open('next.html', 1366, 768);
    try {
      await s.pg.waitForFunction(() => window.U2 && U2.stone, null, { timeout: 10000 });
      const wrong = await s.pg.evaluate(() => { const o = []; for (let n = 1; n <= 15; n++) { const st = U2.stone(n); if (st.querySelectorAll('i').length !== n || st.querySelector('use[href="#nkStar"]')) o.push(n); } return o; });
      if (wrong.length) bad('Unit 2 stones that do not show their own amount: ' + wrong.join(', '));
      /* 4. candles never overlap (frame card) */
      const ov = await s.pg.evaluate(() => { const o = []; [4, 5].forEach(n => FR.LAYOUTS[n].forEach((L, li) => {
        const c = FR.card(n, 'candle', L); c.style.cssText = 'position:fixed;left:0;top:0;width:300px'; document.body.appendChild(c);
        const r = [...c.querySelectorAll('svg.q')].map(e => { const q = e.getBoundingClientRect(); return { left: q.left + q.width * .3, right: q.right - q.width * .3, top: q.top, bottom: q.bottom }; }); c.remove();   /* the candle and its stick fill the middle 40% of its picture */
        for (let a = 0; a < r.length; a++) for (let b = a + 1; b < r.length; b++) { const x = Math.min(r[a].right, r[b].right) - Math.max(r[a].left, r[b].left), y = Math.min(r[a].bottom, r[b].bottom) - Math.max(r[a].top, r[b].top); if (x > 2 && y > 2) o.push(n + '/' + li); } })); return o; });
      if (ov.length) bad('candle cards with candles on top of each other: ' + [...new Set(ov)].join(', '));
    } finally { await s.ctx.close(); }
    /* 3. no eyes on the cloth or towel */
    for (const f of ['opener1.html', 'peek.html', 'fingers.html', 'check1.html']) {
      const p = await open(f, 1366, 768);
      try { await p.pg.waitForTimeout(300);
        const eyes = await p.pg.evaluate(() => [...document.querySelectorAll('.eyes')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && getComputedStyle(e).display !== 'none'; }).length);
        if (eyes) bad(f + ': the cloth or towel has eyes (no faces on objects)');
      } finally { await p.ctx.close(); }
    }
  } catch (e) { bad('crashed: ' + String(e).slice(0, 200)); }
  finally { fs.rmSync(dist, { recursive: true, force: true }); }
  if (!out.fails.length) out.oks.push('2.0 K Numbers clarity: the map fits both screens, every path stone shows its amount, no faces on objects, candles never overlap');
  return out;
};
