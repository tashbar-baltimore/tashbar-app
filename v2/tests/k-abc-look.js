/* 2.0 TEST (v2/tests/, run by tests/run.js): Kindergarten ABC, the new-look GRAPHICS SAMPLE (v2/app/k-abc/look.html, kit3d.js, worlds.js)
   and the menu page (v2/app/k-abc/index.html).
   Builds v2/ and plays both worlds (s = the snake's garden pond, a = the apple orchard) as a made-up boy at Chromebook size and phone size, with ?fast=1:
   - no page errors, the 3D world draws a real picture (not blank), three.js r180 comes from the copy in the game folder (no outside website);
   - play -> the friend says hi and shows how the letter is made -> his turn: a tap far from the green light does not start;
     tracing every stroke with a real finger path grows the picture to the end; then the end buttons show;
   - tapping the friend gets a reaction and the letter's PURE sound (made by the device, never spoken);
   - every spoken line is 12 words or fewer and the voice never says a letter NAME;
   - the menu has a picture button for every game, and each one opens a page that exists;
   - on a slow computer (no fast flag), the picture steps down by itself to a simpler one.
   Returns { fails, oks }. */
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const R = path.join(__dirname, '..', '..');
module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 K ABC look: ' + m);
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'v2look-'));
  try { cp.execFileSync(process.execPath, [path.join(R, 'v2', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: dist }), stdio: 'pipe' }); }
  catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
  ['k-abc/index.html', 'k-abc/look.html', 'k-abc/kit3d.js', 'k-abc/worlds.js', 'k-abc/lib/three-r180/three.module.min.js', 'k-abc/lib/three-r180/three.core.min.js', 'k-abc/lib/three-r180/THREE-LICENSE.txt']
    .forEach(f => { if (!fs.existsSync(path.join(dist, f))) bad(f + ' is not in the built site'); });
  if (out.fails.length) return out;
  for (const f of ['look.html', 'index.html']) { const html = fs.readFileSync(path.join(dist, 'k-abc', f), 'utf8');
    if (/<script[^>]+src=["']https?:|from\s+['"]https?:|"https?:\/\/[^"]+\.js"/i.test(html)) bad(f + ' loads a script from an outside website'); }

  async function open(w, h, url) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }), pg = await ctx.newPage(), errs = [], outside = [];
    pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await pg.route('**/*', r => { const u = new URL(r.request().url());
      if (u.host === 'v2.test') { const f = path.join(dist, u.pathname.slice(1)); if (f.startsWith(dist) && fs.existsSync(f) && fs.statSync(f).isFile()) return r.fulfill({ path: f }); if (f.startsWith(dist) && fs.existsSync(path.join(f, 'index.html'))) return r.fulfill({ path: path.join(f, 'index.html') }); return r.fulfill({ status: 404, body: '' }); }
      if (!/^tts-/.test(u.host)) outside.push(u.host); return r.abort(); });
    await pg.goto('http://v2.test' + url);
    return { ctx, pg, errs, outside };
  }
  const blank = async (pg, label, what) => { const buf = await pg.screenshot(); if (buf.length < 15000) bad(label + ': "' + what + '" looks blank (' + buf.length + ' bytes)'); };

  async function play(w, h, world) {
    const label = world + ' ' + w + 'x' + h, { ctx, pg, errs, outside } = await open(w, h, '/k-abc/look.html?w=' + world + '&fast=1');
    try {
      await pg.waitForFunction(() => window.__look && (window.__look.ready || window.__look.name === 'nogl'), null, { timeout: 60000 });
      if (await pg.evaluate(() => window.__look.name) === 'nogl') { bad(label + ': the 3D world did not start: ' + await pg.evaluate(() => window.__look.err)); return; }
      await pg.waitForTimeout(400); await blank(pg, label, 'start');
      await pg.click('#play', { force: true });
      await pg.waitForFunction(() => window.__look.name === 'trace', null, { timeout: 60000 });
      await pg.mouse.click(25, h - 25); await pg.waitForTimeout(100);
      if (await pg.evaluate(() => window.__look.progress()) > 0) bad(label + ': a tap far from the green light started the tracing');
      const lens = await pg.evaluate(() => window.__look.tracePoints()); let base = 0;
      for (let s = 0; s < lens.length; s++) { const n = lens[s];
        let p = await pg.evaluate(i => window.__look.screenOfTrace(i), base); await pg.mouse.move(p.x, p.y); await pg.mouse.down();
        for (let i = 6; i < n; i += 6) { p = await pg.evaluate(i => window.__look.screenOfTrace(i), base + Math.min(n - 1, i)); await pg.mouse.move(p.x + 4, p.y - 3);
          if (s === lens.length - 1 && i >= n / 2 && i < n / 2 + 6) { const k = await pg.evaluate(() => window.__look.progress()); const want = (base + n / 2) / lens.reduce((a, b) => a + b, 0);
            if (Math.abs(k - want) > 0.15) bad(label + ': halfway along the last stroke the picture is at ' + k.toFixed(2) + ' (should be about ' + want.toFixed(2) + ')'); } }
        p = await pg.evaluate(i => window.__look.screenOfTrace(i), base + n - 1); await pg.mouse.move(p.x, p.y); await pg.mouse.up(); base += n; }
      await pg.waitForSelector('#end.on', { timeout: 60000 }).catch(() => bad(label + ': tracing the whole letter did not finish'));
      await blank(pg, label, 'he made the letter');
      const a0 = await pg.evaluate(() => [window.__look.pokes, window.__look.audio.hissN, window.__look.audio.aN]);
      const hs = await pg.evaluate(() => window.__look.heroScreen()); await pg.mouse.click(hs.x, hs.y); await pg.waitForTimeout(200);
      const a1 = await pg.evaluate(() => [window.__look.pokes, window.__look.audio.hissN, window.__look.audio.aN]);
      if (a1[0] <= a0[0]) bad(label + ': tapping the friend does nothing');
      if ((world === 's' ? a1[1] - a0[1] : a1[2] - a0[2]) <= 0) bad(label + ': tapping the friend makes no letter sound');
      const said = await pg.evaluate(() => window.__look.said.slice());
      if (!said.length) bad(label + ': nothing was spoken');
      said.forEach(t => { if (t.split(/\s+/).filter(Boolean).length > 12) bad(label + ': a spoken line is longer than 12 words: "' + t + '"');
        if (/\b(ess|ay|letter)\b/i.test(t) || /\b[sS]\b/.test(t)) bad(label + ': the voice says a letter name: "' + t + '"');
        if (/\bbites?\b/i.test(t)) bad(label + ': the voice says the word "bite"'); });
      if (await pg.evaluate(() => window.__look.tier()) !== 0) bad(label + ': the test run should use the simplest picture');
      errs.forEach(e => bad(label + ': page error: ' + e)); outside.forEach(x => bad(label + ': reached an outside website: ' + x));
    } catch (e) { bad(label + ': crashed: ' + String(e).slice(0, 200)); }
    finally { await ctx.close(); }
  }
  for (const [w, h] of [[1366, 768], [390, 800]]) for (const world of ['s', 'a']) await play(w, h, world);

  /* the menu: a picture button for every game, each opens a page that exists */
  { const { ctx, pg, errs } = await open(1366, 768, '/k-abc/');
    try { await pg.waitForSelector('a.card', { timeout: 20000 });
      const cards = await pg.evaluate(() => [...document.querySelectorAll('a.card')].map(a => ({ href: a.getAttribute('href'), img: a.querySelector('img') && a.querySelector('img').getAttribute('src'), ok: a.querySelector('img') && a.querySelector('img').naturalWidth > 0 })));
      if (cards.length < 3) bad('the menu has ' + cards.length + ' games (should have at least 3)');
      cards.forEach(c => { const page = c.href.split('?')[0]; if (!fs.existsSync(path.join(dist, 'k-abc', page))) bad('the menu button ' + c.href + ' opens a page that does not exist');
        if (!c.ok) bad('the menu button ' + c.href + ' has no picture'); });
      errs.forEach(e => bad('menu: page error: ' + e));
    } catch (e) { bad('menu crashed: ' + String(e).slice(0, 200)); } finally { await ctx.close(); } }

  /* a slow computer gets a simpler picture by itself (the test computer draws without a graphics chip, so it is slow) */
  { const { ctx, pg } = await open(1366, 768, '/k-abc/look.html?w=s');
    try { await pg.waitForFunction(() => window.__look && window.__look.ready, null, { timeout: 60000 });
      const t0 = await pg.evaluate(() => window.__look.tier());
      const fps = await pg.evaluate(() => new Promise(r => { let n = 0; const t = performance.now(); (function f() { if (++n < 20) requestAnimationFrame(f); else r(n / ((performance.now() - t) / 1000)); })(); }));
      if (fps < 30) { await pg.waitForFunction(t0 => window.__look.tier() < t0, t0, { timeout: 45000 }).catch(() => {});
        const t1 = await pg.evaluate(() => window.__look.tier()); if (!(t1 < t0)) bad('on a slow computer the picture did not step down (stayed at ' + t1 + ', ' + fps.toFixed(0) + ' frames a second)'); }
    } catch (e) { bad('slow-computer check crashed: ' + String(e).slice(0, 200)); } finally { await ctx.close(); } }

  fs.rmSync(dist, { recursive: true, force: true });
  if (!out.fails.length) out.oks.push('2.0 K ABC look: both worlds (s pond, a orchard) play at Chromebook and phone size: friend shows the letter, he traces every stroke, pure sounds on tap, short spoken lines, no letter names; menu buttons open real pages; slow computers step down to a simpler picture');
  return out;
};
