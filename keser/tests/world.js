/* Keser Girls 3.0, HER WORLD (home): builds, is served like the real site, and works for a made-up girl at Chromebook (1366x768) and phone size.
   - the 3D jewel box starts (light mode for speed here; one full-look check), with no errors and nothing that fails to load;
   - five places: Kodesh, Reading, Math, Science, Writing; the arrows, dots, keys and a swipe glide between them; Enter opens the place, Back returns;
   - it fits the screen (no sideways scroll), the buttons are big enough to tap and nothing important is off screen;
   - progress shows only as crown jewels: no money, coins, points or prices anywhere on the screen; bad saved progress cannot break it;
   - computers without 3D get the still cards (same places, dots and button); "reduce motion" is respected; the welcome page's Enter leads here. */
const path = require('path'), os = require('os'), fs = require('fs'), cp = require('child_process'), http = require('http');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg' };
const NAMES = ['Kodesh', 'Reading', 'Math', 'Science', 'Writing'];
module.exports = async (browser) => {
  const fails = [], oks = [], out = fs.mkdtempSync(path.join(os.tmpdir(), 'keser-world-'));
  cp.execFileSync(process.execPath, [path.join(__dirname, '..', 'build.js')], { env: Object.assign({}, process.env, { KESER_OUT: out }), stdio: 'pipe' });
  const srv = http.createServer((q, r) => { const f = path.join(out, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
    if (!f.startsWith(out) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(ok => srv.listen(0, '127.0.0.1', ok)); const url = 'http://127.0.0.1:' + srv.address().port + '/';
  const shots = path.join(__dirname, '..', '..', 'tests', 'out'); fs.mkdirSync(shots, { recursive: true });
  const open = async (w, h, q, opts) => { const ctx = await browser.newContext(Object.assign({ viewport: { width: w, height: h } }, opts || {})), pg = await ctx.newPage(), errs = [];
    pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); pg.on('requestfailed', r => errs.push('could not load ' + r.url()));
    await pg.goto(url + 'world.html' + (q || '')); await pg.waitForFunction(() => window.KWORLD && (KWORLD.state.frames > 1 || document.documentElement.classList.contains('nogl')), null, { timeout: 90000 });
    return { ctx, pg, errs }; };
  const nameIs = (pg, n) => pg.waitForFunction(x => document.getElementById('placeName').textContent === x, n, { timeout: 8000 }).then(() => true, () => false);
  const check = async (pg, tag) => {
    const r = await pg.evaluate(() => { const vw = innerWidth, vh = innerHeight, bad = [];
      for (const el of document.querySelectorAll('button,.k-btn')) { const b = el.getBoundingClientRect(), cs = getComputedStyle(el); if (!b.width || cs.display === 'none' || cs.visibility === 'hidden' || el.closest('#room') && !document.body.classList.contains('inside')) continue;
        if (b.left < -1 || b.top < -1 || b.right > vw + 1 || b.bottom > vh + 1) bad.push((el.id || el.getAttribute('aria-label') || el.className) + ' is off the screen');
        if (!el.closest('.k-dots') && (b.width < 40 || b.height < 40)) bad.push((el.id || el.getAttribute('aria-label')) + ' is too small to tap'); }
      return { bad, wide: document.documentElement.scrollWidth > vw + 1, text: document.body.innerText }; });
    if (r.wide) fails.push('Keser world (' + tag + '): the page is wider than the screen');
    r.bad.forEach(b => fails.push('Keser world (' + tag + '): ' + b));
    if (/\$|\bcoins?\b|\bpoints?\b|\bprices?\b|\bdollars?\b|\bmoney\b/i.test(r.text)) fails.push('Keser world (' + tag + '): money or points on the screen (progress must be jewels only)');
  };
  try {
    /* a made-up girl at Chromebook and phone size (light mode keeps the test quick on a computer with no graphics card) */
    for (const [tag, w, h] of [['chromebook', 1366, 768], ['phone', 390, 800]]) {
      const { ctx, pg, errs } = await open(w, h, '?demo=1&lite=1');
      const s = await pg.evaluate(() => ({ gl: KWORLD.state.gl, places: KWORLD.places, dots: document.querySelectorAll('#dots button').length, prog: KWORLD.progress }));
      if (!s.gl) fails.push('Keser world (' + tag + '): the 3D jewel box did not start');
      if (s.places.join() !== 'kodesh,reading,math,science,writing' || s.dots !== 5) fails.push('Keser world (' + tag + '): expected 5 places with 5 dots, got ' + s.places + ' / ' + s.dots);
      if (!(s.prog.kodesh > 0 && s.prog.writing === 0)) fails.push('Keser world (' + tag + '): the made-up girl\'s progress did not load');
      if (!(await nameIs(pg, 'Reading'))) fails.push('Keser world (' + tag + '): she does not start at Reading');
      const gr = await pg.evaluate(() => { const g = document.getElementById('greet'), i = g.querySelector('img'); return { on: g.classList.contains('on'), pic: i.complete && i.naturalWidth > 0 }; });
      if (!gr.pic) fails.push('Keser world (' + tag + '): the four sisters\' welcome picture did not load');
      await pg.waitForTimeout(1000); await check(pg, tag);
      await pg.screenshot({ path: path.join(shots, 'keser-world-' + tag + '.png') });
      await pg.click('#enter', { trial: true }).catch(() => fails.push('Keser world (' + tag + '): the Enter button cannot be tapped'));
      if (w > 600) { await pg.click('#next'); if (!(await nameIs(pg, 'Math'))) fails.push('Keser world (' + tag + '): the next arrow does not glide to Math');
        await pg.click('#prev'); await pg.click('#prev'); if (!(await nameIs(pg, 'Kodesh'))) fails.push('Keser world (' + tag + '): the back arrow does not glide to Kodesh');
        if ((await pg.textContent('.name .he')) !== 'קודש') fails.push('Keser world (' + tag + '): Kodesh has no Hebrew name');
        await pg.keyboard.press('ArrowLeft'); if (!(await nameIs(pg, 'Writing'))) fails.push('Keser world (' + tag + '): the left key does not go round to Writing'); }
      else { await pg.mouse.move(300, 380); await pg.mouse.down(); await pg.mouse.move(200, 382, { steps: 4 }); await pg.mouse.move(90, 384, { steps: 4 }); await pg.mouse.up();
        if (!(await nameIs(pg, 'Math'))) fails.push('Keser world (phone): a swipe to the left does not glide to the next place'); }
      await pg.click('#dots button:nth-child(4)'); if (!(await nameIs(pg, 'Science'))) fails.push('Keser world (' + tag + '): tapping a dot does not glide to that place');
      await pg.click('#enter');
      const inside = await pg.waitForFunction(() => document.body.classList.contains('inside') && document.getElementById('roomName').textContent === 'Science', null, { timeout: 8000 }).then(() => true, () => false);
      if (!inside) fails.push('Keser world (' + tag + '): Enter does not open the place');
      else { const host = await pg.waitForFunction(() => { const i = document.getElementById('roomHost'); return i.complete && i.naturalWidth > 0 && /keser-cast-shira/.test(i.src); }, null, { timeout: 8000 }).then(() => true, () => false);
        if (!host) fails.push('Keser world (' + tag + '): Shira, the Science host, does not show inside Science');
        await pg.waitForTimeout(1500); await check(pg, tag + ', inside'); await pg.screenshot({ path: path.join(shots, 'keser-world-' + tag + '-inside.png') });
        await pg.click('#back'); const back = await pg.waitForFunction(() => !document.body.classList.contains('inside') && !KWORLD.state.entered, null, { timeout: 8000 }).then(() => true, () => false);
        if (!back) fails.push('Keser world (' + tag + '): Back does not return to her world'); }
      errs.forEach(e => fails.push('Keser world (' + tag + '): ' + e)); await ctx.close();
    }
    /* the girls' cast (Keser Girls only pictures) is in the site, and every place has its host */
    { const want = ['keser-cast-group', 'keser-cast-shira', 'keser-cast-rivky', 'keser-cast-ayelet', 'keser-cast-malka', 'keser-cast-ima', 'keser-cast-bubby', 'keser-style-sheet'];
      const miss = want.filter(n => !fs.existsSync(path.join(out, 'pics', n + '.webp'))); if (miss.length) fails.push('Keser world: these cast pictures are not in the built site: ' + miss.join(', '));
      const places = fs.readFileSync(path.join(__dirname, '..', 'app', 'places.js'), 'utf8'); if ((places.match(/host: '/g) || []).length !== 5) fails.push('Keser world: every place needs a host girl from the cast'); }
    /* the full look (mirror, glow, crystal) also starts with no errors */
    { const { ctx, pg, errs } = await open(1366, 768, '?demo=1&full=1'); const st = await pg.evaluate(() => ({ gl: KWORLD.state.gl, lite: KWORLD.state.lite }));
      if (!st.gl || st.lite) fails.push('Keser world (full look): the full 3D look did not start'); errs.forEach(e => fails.push('Keser world (full look): ' + e)); await ctx.close(); }
    /* no 3D on this computer: still cards */
    { const { ctx, pg, errs } = await open(390, 800, '?nogl=1&demo=1'); const n = await pg.evaluate(() => ({ cards: document.querySelectorAll('.flat .place').length, shown: getComputedStyle(document.querySelector('.flat')).display !== 'none' }));
      if (n.cards !== 5 || !n.shown) fails.push('Keser world (no 3D): the still cards do not show (' + n.cards + ')');
      await pg.click('.flat .place:nth-child(3)'); if (!(await nameIs(pg, 'Math'))) fails.push('Keser world (no 3D): tapping a card does not move to it');
      await pg.click('#enter'); if (!(await pg.waitForFunction(() => document.body.classList.contains('inside'), null, { timeout: 5000 }).then(() => true, () => false))) fails.push('Keser world (no 3D): Enter does not open the place');
      await check(pg, 'no 3D'); await pg.screenshot({ path: path.join(shots, 'keser-world-no3d-phone.png') }); errs.forEach(e => fails.push('Keser world (no 3D): ' + e)); await ctx.close(); }
    /* reduce motion */
    { const { ctx, pg, errs } = await open(1366, 768, '?lite=1', { reducedMotion: 'reduce' }); if (!(await pg.evaluate(() => KWORLD.state.calm))) fails.push('Keser world: "reduce motion" is not respected');
      errs.forEach(e => fails.push('Keser world (reduce motion): ' + e)); await ctx.close(); }
    /* saved progress that is broken or out of range cannot break her world */
    { const { ctx, pg } = await open(390, 800, '?nogl=1'); await pg.evaluate(() => localStorage.setItem('keser.progress', '{"kodesh":7,"math":-2,"reading":"x","science":0.5}'));
      await pg.reload(); await pg.waitForFunction(() => window.KWORLD); const p = await pg.evaluate(() => KWORLD.progress);
      if (p.kodesh !== 1 || p.math !== 0 || p.reading !== 0 || p.science !== 0.5 || p.writing !== 0) fails.push('Keser world: bad saved progress is not cleaned (' + JSON.stringify(p) + ')');
      await pg.evaluate(() => localStorage.setItem('keser.progress', 'not json')); await pg.reload(); await pg.waitForFunction(() => window.KWORLD);
      if (await pg.evaluate(() => Object.values(KWORLD.progress).some(v => v !== 0))) fails.push('Keser world: unreadable saved progress is not treated as a fresh start'); await ctx.close(); }
    /* the welcome page leads into her world */
    { const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } }), pg = await ctx.newPage(); await pg.goto(url);
      const href = await pg.getAttribute('#enter', 'href'); if (href !== 'signin.html') fails.push('Keser welcome: the Enter button does not lead to her sign-in');
      await ctx.close(); }
  } catch (e) { fails.push('Keser world test stopped: ' + String(e).slice(0, process.env.KESER_LONG ? 3000 : 200)); }
  finally { srv.close(); fs.rmSync(out, { recursive: true, force: true }); }
  if (!fails.length) oks.push('Keser Girls 3.0 her world: 3D jewel box at Chromebook and phone size, 5 places, arrows/dots/keys/swipe glide, Enter and Back, the sisters\' welcome and each place\'s host girl, jewels not money, still cards without 3D, reduce motion');
  return { fails, oks };
};
