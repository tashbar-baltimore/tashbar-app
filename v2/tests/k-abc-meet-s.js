/* 2.0 TEST (v2/tests/, run by tests/run.js): Kindergarten ABC, "Meet the snake sound" (v2/app/k-abc/meet-s.html).
   Builds v2/, opens the game at Chromebook size and phone size with ?fast=1 (no waiting for the voice), and plays it as a made-up boy:
   it loads with no errors; every step shows real pictures (not a blank screen); the snake makes its sound; a wrong tap is explained
   (the right letter is shown with the snake inside it) and he can try again; the game can be won with stars; nothing is cut off
   on the phone; the voice never says the letter NAME (only the pure sound is made, by the device). Returns { fails, oks }. */
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const R = path.join(__dirname, '..', '..');
module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 K ABC meet-s: ' + m);
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'v2kabc-'));
  try { cp.execFileSync(process.execPath, [path.join(R, 'v2', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: dist }), stdio: 'pipe' }); }
  catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
  if (!fs.existsSync(path.join(dist, 'k-abc', 'meet-s.html'))) { bad('the game is not in the built site'); return out; }

  async function playAt(w, h, label) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }), pg = await ctx.newPage(), errs = [];
    pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await pg.route('**/*', r => { const u = new URL(r.request().url());
      if (u.host === 'v2.test') { const f = path.join(dist, u.pathname.slice(1)); if (f.startsWith(dist) && fs.existsSync(f)) return r.fulfill({ path: f }); return r.fulfill({ status: 404, body: '' }); }
      return r.abort(); });
    const shown = async () => pg.evaluate(() => { const s = document.getElementById('stage'); const r = s.getBoundingClientRect();
      const kids = [...s.querySelectorAll('svg, button')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 40 && b.height > 40; });
      const off = kids.filter(e => { const b = e.getBoundingClientRect(); return b.left < -2 || b.right > innerWidth + 2 || b.top < -2 || b.bottom > innerHeight + 2; });
      return { n: kids.length, off: off.length, paths: s.querySelectorAll('path').length, h: r.height }; });
    const need = async (what) => { const s = await shown(); if (!s.n || !s.paths) bad(label + ': "' + what + '" shows a blank screen'); if (s.off) bad(label + ': "' + what + '" has something cut off the screen'); };
    try {
      await pg.goto('http://v2.test/k-abc/meet-s.html?fast=1'); await pg.waitForSelector('#start', { timeout: 10000 });
      await need('start'); await pg.click('#start', { force: true });
      const step = async (name) => { await pg.waitForFunction(n => window.__abc.name === n, name, { timeout: 15000 }); };
      const next = async () => { await pg.waitForSelector('#next.show', { timeout: 15000 }); await pg.click('#next', { force: true }); };
      await step('intro'); await pg.waitForSelector('#next.show', { timeout: 15000 }); await need('snake');
      const h0 = await pg.evaluate(() => window.__abc.hiss); await pg.click('#snk', { force: true }); await pg.waitForTimeout(50);
      if (await pg.evaluate(() => window.__abc.hiss) <= h0) bad(label + ': tapping the snake makes no sound');
      await next(); await step('morph'); await pg.waitForSelector('#next.show', { timeout: 15000 }); await need('the snake becomes the letter');
      await next(); await step('mouth'); await pg.waitForSelector('#next.show', { timeout: 15000 }); await need('the mouth picture');
      await next(); await step('sky'); await pg.waitForSelector('#did', { state: 'visible', timeout: 15000 }); await need('draw it in the air'); await pg.click('#did', { force: true });
      await step('hold'); await need('hold for a long sound');
      const b = await (await pg.$('#hold')).boundingBox(); await pg.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await pg.mouse.down(); await pg.waitForTimeout(300); await pg.mouse.up();
      await next(); await step('find'); await pg.waitForSelector('.tile'); await need('find the snake letter');
      if (await pg.$$eval('.tile', t => t.length) !== 4) bad(label + ': find-it should show 4 letters');
      await pg.click('.tile:not([data-k="s"])'); await pg.waitForSelector('.tile.hint', { timeout: 10000 }).catch(() => bad(label + ': a wrong tap does not show him the right letter'));
      if (!(await pg.evaluate(() => window.__abc.said.some(t => /not that one/i.test(t))))) bad(label + ': a wrong tap is not explained');
      for (let r = 0; r < 3; r++) { await pg.waitForSelector('.tile[data-k="s"]:not(.yes)', { timeout: 10000 }); await pg.click('.tile[data-k="s"]'); }
      await pg.waitForFunction(() => window.__abc.done, null, { timeout: 15000 }).catch(() => bad(label + ': the game cannot be finished'));
      const st = await pg.evaluate(() => window.__abc);
      if (st.stars !== 2) bad(label + ': one miss then two right should give 2 stars, got ' + st.stars);
      if ((await pg.$$('.star')).length !== 3) bad(label + ': the end screen does not show the stars');
      if (st.said.some(t => /\b(ess|letter s|the s)\b/i.test(t))) bad(label + ': the voice says the letter NAME; only the sound belongs here');
      if (st.said.some(t => t.split(/\s+/).length > 12)) bad(label + ': a spoken line is longer than 12 words');
      // a boy who struggles: two misses -> he sees the snake inside the letter again and gets an easier round (2 choices)
      await pg.waitForSelector('#replay', { state: 'visible', timeout: 10000 }); await pg.click('#replay', { force: true });
      await step('intro'); await next(); await step('morph'); await next(); await step('mouth'); await next(); await step('sky');
      await pg.waitForSelector('#did', { state: 'visible', timeout: 15000 }); await pg.click('#did', { force: true }); await step('hold');
      const b2 = await (await pg.$('#hold')).boundingBox(); await pg.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2); await pg.mouse.down(); await pg.waitForTimeout(300); await pg.mouse.up();
      await next(); await step('find');
      for (let r = 0; r < 3; r++) { await pg.waitForFunction(k => window.__abc.round === k && !document.querySelector('.tile.yes'), r, { timeout: 10000 });
        if (r < 2) { await pg.click('.tile:not([data-k="s"])'); await pg.waitForSelector('.tile.hint', { timeout: 10000 }); } await pg.click('.tile[data-k="s"]'); }
      await pg.waitForFunction(() => window.__abc.easy && document.querySelectorAll('.tile').length === 2, null, { timeout: 15000 }).catch(() => bad(label + ': a boy with 1 star does not get the easier round'));
      if (errs.length) bad(label + ': page errors: ' + errs.join(' | '));
    } catch (e) { let at = ''; try { at = await pg.evaluate(() => window.__abc && (window.__abc.name + ' round ' + window.__abc.round)); } catch (x) {} bad(label + ' (at ' + at + '): ' + String(e.message || e).split('\n')[0].slice(0, 200)); }
    await ctx.close();
  }
  await playAt(1366, 768, 'Chromebook');
  await playAt(390, 844, 'phone');
  if (!out.fails.length) out.oks.push('2.0 K ABC "Meet the snake sound": plays to the end at Chromebook and phone size, a wrong tap is explained, a struggling boy gets an easier round');
  fs.rmSync(dist, { recursive: true, force: true });
  return out;
};
