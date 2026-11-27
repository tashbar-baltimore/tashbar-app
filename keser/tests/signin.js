/* Keser Girls 3.0: the way in (M. Heinemann 2026-11-26: "too many openings ... Once they put the code in, it should go straight to either choose
   Kodesh, Timeline lab, or the general studies. And then it should go straight in ... clean and neat and fresh, not ... pinky").
   Played as a made-up girl at Chromebook (1366x768) and phone size, and with "reduce motion":
   - the welcome's Enter leads to her code; the code screen shows the Keser logo and 12 keys that fit and are big enough to tap;
   - a wrong code shakes and clears; the practice code goes straight to home;
   - home has two choices, קודש (Hebrew) and Timeline, in the Keser colors, each with its picture (no General Studies, M. Heinemann 2026-11-27);
   - קודש goes straight into the Chumash Lab, Timeline straight into the Timeline; the sign-in has a little more sparkle;
   - no money or points, no sideways scroll, no errors; no pink anywhere in the app's own styles. */
const path = require('path'), os = require('os'), fs = require('fs'), cp = require('child_process'), http = require('http');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png' };
const PINK = /#ff(5f|8f|c2|b3|3d|7a|e3|f0|f5)[0-9a-f]{2}\b|rgba\(255,\s*(95|143|194|179),/i;
module.exports = async (browser) => {
  const fails = [], oks = [], out = fs.mkdtempSync(path.join(os.tmpdir(), 'keser-sign-'));
  cp.execFileSync(process.execPath, [path.join(__dirname, '..', 'build.js')], { env: Object.assign({}, process.env, { KESER_OUT: out }), stdio: 'pipe' });
  const srv = http.createServer((q, r) => { const f = path.join(out, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
    if (!f.startsWith(out) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(ok => srv.listen(0, '127.0.0.1', ok)); const url = 'http://127.0.0.1:' + srv.address().port + '/';
  const shots = path.join(__dirname, '..', '..', 'tests', 'out'); fs.mkdirSync(shots, { recursive: true });
  const fits = (pg) => pg.evaluate(() => { const vw = innerWidth, bad = [];
    document.querySelectorAll('button,a.k-btn').forEach(b => { const r = b.getBoundingClientRect(); if (!r.width || getComputedStyle(b).display === 'none' || b.closest('#general') && !document.body.classList.contains('gs')) return;
      if (r.left < -1 || r.right > vw + 1) bad.push((b.id || b.dataset.k || b.dataset.go || b.textContent.trim()) + ' is off the screen');
      if (r.width < 40 || r.height < 40) bad.push((b.id || b.dataset.k || b.dataset.go) + ' is too small to tap'); });
    return { bad, wide: document.documentElement.scrollWidth > vw + 1, text: document.body.innerText }; });
  try {
    /* no pink in the app's own styles */
    for (const f of ['kit.css', 'index.html', 'signin.html', 'home.html', 'kodesh/lab.css']) { const t = fs.readFileSync(path.join(__dirname, '..', 'app', f), 'utf8');
      if (PINK.test(t)) fails.push('Keser look: ' + f + ' still uses a pink color (' + t.match(PINK)[0] + ')'); }
    for (const [tag, w, h, opts] of [['chromebook', 1366, 768], ['phone', 390, 800], ['reduce motion', 390, 800, { reducedMotion: 'reduce' }]]) {
      const ctx = await browser.newContext(Object.assign({ viewport: { width: w, height: h } }, opts || {})), pg = await ctx.newPage(), errs = [];
      pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); pg.on('requestfailed', r => errs.push('could not load ' + r.url()));
      /* welcome -> code */
      await pg.goto(url); await pg.click('#enter');
      if (!(await pg.waitForURL(/signin\.html/, { timeout: 8000 }).then(() => true, () => false))) fails.push('Keser (' + tag + '): Enter does not lead to her code');
      await pg.waitForFunction(() => window.KSIGN, null, { timeout: 15000 });
      const v = await pg.evaluate(() => ({ keys: document.querySelectorAll('.key').length, logo: [...document.querySelectorAll('.pad img, .girls')].every(i => i.complete && i.naturalWidth > 0) }));
      { const tw = await pg.evaluate(() => document.querySelectorAll('.k-twinkles i').length); if (tw < 20) fails.push('Keser sign-in (' + tag + '): it should be a little more sparkly (got ' + tw + ' twinkles)'); }
      if (v.keys !== 12) fails.push('Keser sign-in (' + tag + '): expected 12 keys, got ' + v.keys);
      if (!v.logo) fails.push('Keser sign-in (' + tag + '): the Keser logo did not load');
      { const f = await fits(pg); f.bad.forEach(b => fails.push('Keser sign-in (' + tag + '): ' + b)); if (f.wide) fails.push('Keser sign-in (' + tag + '): the page is wider than the screen'); }
      if (tag !== 'reduce motion') await pg.screenshot({ path: path.join(shots, 'keser-signin-' + tag + '.png') });
      for (const d of '9876') await pg.click('.key[data-k="' + d + '"]');
      await pg.waitForTimeout(700);
      const wrong = await pg.evaluate(() => ({ code: KSIGN.state.code, tries: KSIGN.state.tries, url: location.pathname }));
      if (wrong.code !== '' || wrong.tries !== 1 || !/signin/.test(wrong.url)) fails.push('Keser sign-in (' + tag + '): a wrong code must clear and stay on the code screen (' + JSON.stringify(wrong) + ')');
      for (const d of '1234') await pg.click('.key[data-k="' + d + '"]');
      if (!(await pg.waitForURL(/world\.html/, { timeout: 8000 }).then(() => true, () => false))) { fails.push('Keser sign-in (' + tag + '): the practice code does not go straight into her world'); await ctx.close(); continue; }
      /* the clean cards (home.html) are what a computer without 3D gets: check them too */
      await pg.goto(url + 'home.html');
      /* home: three choices */
      await pg.waitForFunction(() => window.KHOME, null, { timeout: 15000 });
      const hm = await pg.evaluate(() => [...document.querySelectorAll('.choice')].map(c => ({ go: c.dataset.go, name: c.querySelector('b').textContent, he: c.querySelector('b').getAttribute('lang'), bg: getComputedStyle(c).backgroundColor })));
      if (hm.map(c => c.go).join() !== 'kodesh,timeline') fails.push('Keser home (' + tag + '): expected only קודש and Timeline, got ' + hm.map(c => c.go));
      if (!hm[0] || hm[0].name !== 'קודש' || hm[0].he !== 'he') fails.push('Keser home (' + tag + '): קודש is not written in Hebrew');
      const want = ['rgb(110, 20, 40)', 'rgb(21, 94, 60)'];   /* burgundy, green */
      hm.forEach((c, i) => { if (c.bg !== want[i]) fails.push('Keser home (' + tag + '): ' + c.go + ' is not in its Keser color (' + c.bg + ')'); });
      await pg.waitForTimeout(500);
      const pics = await pg.evaluate(() => Promise.all([...document.querySelectorAll('.choice .pic')].map(p => new Promise(ok => { const i = new Image(); i.onload = () => ok(true); i.onerror = () => ok(false); i.src = getComputedStyle(p).backgroundImage.slice(5, -2); }))));
      if (pics.some(p => !p)) fails.push('Keser home (' + tag + '): a choice picture did not load');
      { const f = await fits(pg); f.bad.forEach(b => fails.push('Keser home (' + tag + '): ' + b)); if (f.wide) fails.push('Keser home (' + tag + '): the page is wider than the screen');
        if (/\$|\bcoins?\b|\bpoints?\b|\bprices?\b|\bmoney\b/i.test(f.text)) fails.push('Keser home (' + tag + '): money or points on the screen'); }
      { const tw = await pg.evaluate(() => document.querySelectorAll('.k-twinkles i').length);   /* a little sparkle, never overwhelming (M. Heinemann 2026-11-27) */
        if (tw < 1 || tw > 12) fails.push('Keser home (' + tag + '): expected a few twinkles (1 to 12), got ' + tw); }
      if (tag !== 'reduce motion') await pg.screenshot({ path: path.join(shots, 'keser-home-' + tag + '.png') });
      /* קודש: straight into the lab; Timeline: straight into the Timeline */
      await pg.click('.choice[data-go="kodesh"]');
      if (!(await pg.waitForFunction(() => window.CLAB && CLAB.open && CLAB.view === 'hub', null, { timeout: 20000 }).then(() => true, () => false))) fails.push('Keser home (' + tag + '): קודש does not go straight into the Chumash Lab');
      await pg.evaluate(() => CLAB.close());
      await pg.click('.choice[data-go="timeline"]');
      if (!(await pg.waitForFunction(() => window.CLAB && CLAB.open && CLAB.view === 'tl', null, { timeout: 20000 }).then(() => true, () => false))) fails.push('Keser home (' + tag + '): Timeline does not go straight into the Timeline');
      errs.forEach(e => fails.push('Keser (' + tag + '): ' + e)); await ctx.close();
    }
  } catch (e) { fails.push('Keser sign-in and home test stopped: ' + String(e).slice(0, 200)); }
  finally { srv.close(); fs.rmSync(out, { recursive: true, force: true }); }
  if (!fails.length) oks.push('Keser Girls 3.0 way in: welcome, code (wrong code clears, practice code goes straight into her world), the clean cards for computers without 3D, a sparkly sign-in, home with קודש and Timeline in burgundy and green, each straight in, at Chromebook and phone size, reduce motion, a few twinkles, no pink');
  return { fails, oks };
};
