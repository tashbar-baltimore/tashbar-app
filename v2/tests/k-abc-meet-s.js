/* 2.0 TEST (v2/tests/, run by tests/run.js): Kindergarten ABC, "Meet the snake sound" (v2/app/k-abc/meet-s.html), the 3D version.
   Builds v2/, opens the game with ?fast=1 (no voice, quick motion, simple graphics) at Chromebook size and phone size, and plays it as a made-up boy:
   - it loads with no page errors and the 3D world draws real pictures (the screen is not blank);
   - the 3D library is the copy inside the game folder (no outside website needed);
   - the computer draws the snake along the s; tapping the snake makes the snake sound; in the wiggle chant he taps the snake 3 times;
   - he traces the s with a real finger path: the snake grows under his finger to the end; a start far from the green light does not count;
   - "is this the snake sound?": a wrong answer is explained, three rounds;
   - find the snake letter among 3D letters: a wrong tap shows the snake inside the right letter; 1 miss + 2 right = 2 stars;
   - a boy with fewer than 2 stars gets an easier round and can earn at most 2 stars;
   - the voice never says the letter NAME, and every spoken line is 12 words or fewer.
   Returns { fails, oks }. */
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const R = path.join(__dirname, '..', '..');
module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 K ABC meet-s: ' + m);
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'v2kabc-'));
  try { cp.execFileSync(process.execPath, [path.join(R, 'v2', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: dist }), stdio: 'pipe' }); }
  catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
  ['k-abc/meet-s.html', 'k-abc/world.js', 'k-abc/lib/three.min.js'].forEach(f => { if (!fs.existsSync(path.join(dist, f))) bad(f + ' is not in the built site'); });
  if (out.fails.length) return out;
  const html = fs.readFileSync(path.join(dist, 'k-abc', 'meet-s.html'), 'utf8');
  if (/<script[^>]+src=["']https?:/i.test(html)) bad('the game loads a script from an outside website (it must use its own copy)');

  async function playAt(w, h, label) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }), pg = await ctx.newPage(), errs = [], outside = [];
    pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await pg.route('**/*', r => { const u = new URL(r.request().url());
      if (u.host === 'v2.test') { const f = path.join(dist, u.pathname.slice(1)); if (f.startsWith(dist) && fs.existsSync(f)) return r.fulfill({ path: f }); return r.fulfill({ status: 404, body: '' }); }
      if (!/^tts-/.test(u.host)) outside.push(u.host); return r.abort(); });
    const name = n => pg.waitForFunction(x => window.__abc.name === x, n, { timeout: 60000 });
    const next = async () => { await pg.waitForSelector('#next.show', { timeout: 60000 }); await pg.click('#next', { force: true }); };
    const notBlank = async what => { const buf = await pg.screenshot(); if (buf.length < 15000) bad(label + ': "' + what + '" looks blank (' + buf.length + ' bytes)'); };
    try {
      await pg.goto('http://v2.test/k-abc/meet-s.html?fast=1');
      await pg.waitForFunction(() => window.__abc && (window.__abc.name === 'nogl' || (window.__abc.isReady && window.__abc.isReady())), null, { timeout: 60000 });
      if (await pg.evaluate(() => window.__abc.name) === 'nogl') { bad(label + ': the 3D world did not start: ' + await pg.evaluate(() => window.__abc.err)); await ctx.close(); return; }
      await notBlank('start'); await pg.click('#start', { force: true });
      await pg.waitForSelector('#next.show', { timeout: 60000 }); await notBlank('the snake is drawn');
      if (await pg.evaluate(() => window.__abc.progress) < 0.99) bad(label + ': the computer did not finish drawing the snake');
      const hd = await pg.evaluate(() => window.__abc.screenOfHead()), h0 = await pg.evaluate(() => window.__abc.hiss);
      await pg.mouse.click(hd.x, hd.y); await pg.waitForTimeout(150);
      if (await pg.evaluate(() => window.__abc.hiss) <= h0) bad(label + ': tapping the snake makes no sound');
      await next(); await name('morph'); await pg.waitForSelector('#next.show', { timeout: 60000 }); await notBlank('the snake turns into the letter');
      await next(); await name('mouth'); await pg.waitForSelector('#next.show', { timeout: 60000 });
      if (!(await pg.evaluate(() => document.getElementById('mouth').classList.contains('on')))) bad(label + ': the mouth picture does not show');
      await next(); await name('wiggle'); await pg.waitForFunction(() => window.__abc.wiggleReady(), null, { timeout: 60000 });
        for (let wt = 0; wt < 3; wt++) { await pg.waitForFunction(() => window.__abc.wiggleReady() || window.__abc.wiggleTaps >= 3, null, { timeout: 60000 }); const hh = await pg.evaluate(() => window.__abc.screenOfHead()); await pg.mouse.click(hh.x, hh.y + 20); await pg.waitForFunction(n => (window.__abc.wiggleTaps || 0) >= n, wt + 1, { timeout: 30000 }); }
        await pg.waitForSelector('#next.show', { timeout: 60000 });
      await next(); await name('trace'); await pg.waitForFunction(() => !document.querySelector('#again.wait'), null, { timeout: 60000 });
      await pg.mouse.click(30, h - 30); await pg.waitForTimeout(100);
      if (await pg.evaluate(() => window.__abc.progress) > 0) bad(label + ': a tap far from the green light started the snake');
      let p = await pg.evaluate(() => window.__abc.screenOfTrace(0)); await pg.mouse.move(p.x, p.y); await pg.mouse.down();
      for (let i = 8; i <= 160; i += 8) { p = await pg.evaluate(i => window.__abc.screenOfTrace(i), i); await pg.mouse.move(p.x + 5, p.y - 4); }
      const half = await pg.evaluate(() => window.__abc.progress); if (half < 0.4 || half > 0.6) bad(label + ': halfway along the s the snake is at ' + half.toFixed(2) + ' (should be about 0.5)');
      for (let i = 168; i <= 320; i += 8) { p = await pg.evaluate(i => window.__abc.screenOfTrace(i), i); await pg.mouse.move(p.x - 4, p.y + 5); }
      await pg.mouse.up(); await pg.waitForSelector('#next.show', { timeout: 60000 }).catch(() => bad(label + ': tracing the whole s did not finish the snake'));
      await notBlank('he made the snake');
      await next(); await name('listen');
      for (let r = 0; r < 3; r++) { await pg.waitForFunction(k => window.__abc.lround === k && !document.querySelector('#ask .right'), r, { timeout: 60000 });
        const yes = await pg.evaluate(() => window.__abc.lsn[window.__abc.lround]);
        if (r === 0) { await pg.click('#ask [data-a="' + (yes ? 'no' : 'yes') + '"]'); await pg.waitForTimeout(100);
          if (!(await pg.evaluate(() => window.__abc.said.some(t => /listen again/i.test(t))))) bad(label + ': a wrong answer in the listening round is not explained'); }
        await pg.click('#ask [data-a="' + (yes ? 'yes' : 'no') + '"]'); }
      if (!(await pg.evaluate(() => window.__abc.hum > 0))) bad(label + ': the listening round never played the not-snake sound');
      await name('find');
      const findRounds = async (missFirst, missAll) => { for (let r = 0; r < 3; r++) {
          await pg.waitForFunction(k => window.__abc.round === k && window.__abc.letters().length >= 2 && window.__abc.screenOfLetter('s'), r, { timeout: 60000 }); await pg.waitForTimeout(150);
          if ((missFirst && r === 0) || (missAll && r < 2)) { const g0 = await pg.evaluate(() => window.__abc.ghost || 0); const o = await pg.evaluate(() => window.__abc.screenOfOther()); await pg.mouse.click(o.x, o.y);
            await pg.waitForFunction(g => (window.__abc.ghost || 0) > g, g0, { timeout: 30000 }).catch(() => bad(label + ': a wrong letter does not show the snake inside the right one')); await pg.waitForTimeout(100); }
          const s = await pg.evaluate(() => window.__abc.screenOfLetter('s')); await pg.mouse.click(s.x, s.y);
          await pg.waitForFunction(k => window.__abc.round > k || window.__abc.done || window.__abc.easy, r, { timeout: 30000 }).catch(() => bad(label + ': tapping the s in round ' + (r + 1) + ' did nothing')); } };
      if (await pg.evaluate(() => window.__abc.letters().length) !== 4) bad(label + ': find-it should show 4 letters');
      await findRounds(true, false);
      await pg.waitForFunction(() => window.__abc.done, null, { timeout: 60000 }).catch(() => bad(label + ': the game cannot be finished'));
      if (await pg.evaluate(() => window.__abc.stars) !== 2) bad(label + ': one miss then two right should give 2 stars, got ' + await pg.evaluate(() => window.__abc.stars));
      if ((await pg.$$('#stars .star')).length !== 3) bad(label + ': the end screen does not show the stars');
      await notBlank('the end');
      const said = await pg.evaluate(() => window.__abc.said);
      if (said.some(t => /\b(ess|letter s|the s)\b/i.test(t))) bad(label + ': the voice says the letter NAME; only the sound belongs here');
      if (said.some(t => t.split(/\s+/).length > 12)) bad(label + ': a spoken line is longer than 12 words');
      if (label === 'Chromebook') {   /* a boy who struggles: two misses -> easier round with 2 letters, at most 2 stars */
        await pg.waitForSelector('#end.on #replay', { timeout: 30000 }); await pg.click('#replay', { force: true }); await name('intro');
        for (const n of ['morph', 'mouth', 'wiggle']) { await next(); await name(n); }
        await pg.waitForFunction(() => window.__abc.wiggleReady(), null, { timeout: 60000 });
        for (let wt = 0; wt < 3; wt++) { await pg.waitForFunction(() => window.__abc.wiggleReady() || window.__abc.wiggleTaps >= 3, null, { timeout: 60000 }); const hh = await pg.evaluate(() => window.__abc.screenOfHead()); await pg.mouse.click(hh.x, hh.y + 20); await pg.waitForFunction(n => (window.__abc.wiggleTaps || 0) >= n, wt + 1, { timeout: 30000 }); }
        await pg.waitForSelector('#next.show', { timeout: 60000 }); await next(); await name('trace'); await pg.waitForFunction(() => !document.querySelector('#again.wait'), null, { timeout: 60000 });
        p = await pg.evaluate(() => window.__abc.screenOfTrace(0)); await pg.mouse.move(p.x, p.y); await pg.mouse.down();
        for (let i = 8; i <= 320; i += 8) { p = await pg.evaluate(i => window.__abc.screenOfTrace(i), i); await pg.mouse.move(p.x, p.y); } await pg.mouse.up();
        await next(); await name('listen');
        for (let r = 0; r < 3; r++) { await pg.waitForFunction(k => window.__abc.lround === k && !document.querySelector('#ask .right'), r, { timeout: 60000 }); const yes = await pg.evaluate(() => window.__abc.lsn[window.__abc.lround]); await pg.click('#ask [data-a="' + (yes ? 'yes' : 'no') + '"]'); }
        await name('find'); await findRounds(false, true);
        await pg.waitForFunction(() => window.__abc.easy && window.__abc.letters().length === 2, null, { timeout: 60000 }).catch(() => bad(label + ': a boy with 1 star does not get the easier round'));
        for (let r = 0; r < 3; r++) { await pg.waitForFunction(k => window.__abc.round === k && window.__abc.letters().length === 2 && window.__abc.screenOfLetter('s'), r, { timeout: 60000 }); await pg.waitForTimeout(150); const s = await pg.evaluate(() => window.__abc.screenOfLetter('s')); await pg.mouse.click(s.x, s.y); await pg.waitForFunction(k => window.__abc.round > k || window.__abc.done, r, { timeout: 30000 }); }
        await pg.waitForFunction(() => window.__abc.done, null, { timeout: 60000 });
        if (await pg.evaluate(() => window.__abc.stars) > 2) bad(label + ': a boy who needed the easier round got 3 stars');
      }
      if (errs.length) bad(label + ': page errors: ' + errs.join(' | '));
      if (outside.length) bad(label + ': the game tried to reach outside websites: ' + [...new Set(outside)].join(', '));
    } catch (e) { let at = ''; try { at = await pg.evaluate(() => window.__abc && (window.__abc.name + ' round ' + window.__abc.round)); } catch (x) {} bad(label + ' (at ' + at + '): ' + String(e.message || e).split('\n')[0].slice(0, 200)); }
    await ctx.close();
  }
  await playAt(1366, 768, 'Chromebook');
  await playAt(390, 844, 'phone');
  if (!out.fails.length) out.oks.push('2.0 K ABC "Meet the snake sound" (3D): plays to the end at Chromebook and phone size; the snake grows as he traces the s; wrong answers are explained; a struggling boy gets an easier round');
  fs.rmSync(dist, { recursive: true, force: true });
  return out;
};
