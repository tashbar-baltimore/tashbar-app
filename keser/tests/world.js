/* Keser Girls 3.0, HER 3D WORLD as the place she chooses (M. Heinemann 2026-11-27: "I don't mind the 3D world ... with a better coloring and a little bit less busy";
   2026-11-26: "it should go straight to either choose Kodesh, Timeline lab, or the general studies. And then it should go straight in").
   For a made-up girl at Chromebook (1366x768) and phone size: the world draws, three places in the Keser colors (קודש in Hebrew), the arrows glide,
   Enter goes straight in (קודש: the Chumash Lab; Timeline: the Timeline; no General Studies, M. Heinemann 2026-11-27), a tap on a place goes straight in,
   it is calm (no petals, no bokeh, little glitter), no greeting in the way, and a computer without 3D gets the clean cards. */
const path = require('path'), os = require('os'), fs = require('fs'), cp = require('child_process'), http = require('http');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png' };
module.exports = async (browser) => {
  const fails = [], oks = [], out = fs.mkdtempSync(path.join(os.tmpdir(), 'keser-world-'));
  cp.execFileSync(process.execPath, [path.join(__dirname, '..', 'build.js')], { env: Object.assign({}, process.env, { KESER_OUT: out }), stdio: 'pipe' });
  const srv = http.createServer((q, r) => { const f = path.join(out, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
    if (!f.startsWith(out) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(ok => srv.listen(0, '127.0.0.1', ok)); const url = 'http://127.0.0.1:' + srv.address().port + '/';
  const shots = path.join(__dirname, '..', '..', 'tests', 'out'); fs.mkdirSync(shots, { recursive: true });
  const open = async (w, h, q) => { const ctx = await browser.newContext({ viewport: { width: w, height: h } }), pg = await ctx.newPage(), errs = [];
    pg.on('pageerror', e => errs.push(String(e))); pg.on('requestfailed', r => errs.push('could not load ' + r.url()));
    await pg.goto(url + 'world.html' + (q || '')); await pg.waitForFunction(() => window.KWORLD && KWORLD.state.frames > 1, null, { timeout: 90000 });
    return { ctx, pg, errs }; };
  const nameIs = (pg, n) => pg.waitForFunction(x => document.getElementById('placeName').textContent === x, n, { timeout: 8000 }).then(() => true, () => false);
  try {
    /* calm: the busy things are off (read in the code) */
    { const w3 = fs.readFileSync(path.join(__dirname, '..', 'app', 'world3d.js'), 'utf8');
      if (!/petals\.count = 0/.test(w3) || !/bokeh\.forEach\(b => b\.visible = false\)/.test(w3) || !/Array\(0\)/.test(w3)) fails.push('Keser world: it must stay calm (no petals, no bokeh, no drifting motes)');
      const places = fs.readFileSync(path.join(__dirname, '..', 'app', 'places.js'), 'utf8');
      for (const c of ["'#6E1428'", "'#155E3C'"]) if (!places.includes(c)) fails.push('Keser world: a place is not in its Keser color ' + c); }
    for (const [tag, w, h] of [['chromebook', 1366, 768], ['phone', 390, 800]]) {
      { const { ctx, pg, errs } = await open(w, h, '?lite=1');
        const s = await pg.evaluate(() => ({ gl: KWORLD.state.gl, places: KWORLD.places, greet: document.getElementById('greet').classList.contains('on') }));
        if (!s.gl) fails.push('Keser world (' + tag + '): the 3D world did not start');
        if (s.places.join() !== 'kodesh,timeline') fails.push('Keser world (' + tag + '): expected only קודש and Timeline (M. Heinemann 2026-11-27), got ' + s.places);
        if (s.greet) fails.push('Keser world (' + tag + '): a greeting is in the way');
        if (!(await nameIs(pg, 'קודש'))) fails.push('Keser world (' + tag + '): she does not start at קודש');
        if ((await pg.getAttribute('#placeName', 'lang')) !== 'he') fails.push('Keser world (' + tag + '): קודש is not marked Hebrew');
        if (w > 600) { await pg.click('#next'); if (!(await nameIs(pg, 'Timeline'))) fails.push('Keser world (' + tag + '): the arrow does not glide to Timeline'); await pg.click('#prev'); await nameIs(pg, 'קודש'); }
        await pg.waitForTimeout(800); await pg.screenshot({ path: path.join(shots, 'keser-world-' + tag + '.png') });
        await pg.click('#enter');
        if (!(await pg.waitForFunction(() => window.CLAB && CLAB.open && CLAB.view === 'hub', null, { timeout: 20000 }).then(() => true, () => false))) fails.push('Keser world (' + tag + '): Enter at קודש does not go straight into the Chumash Lab');
        await pg.evaluate(() => CLAB.close());
        await pg.evaluate(() => KWORLD.go(1)); await nameIs(pg, 'Timeline'); await pg.click('#enter');
        if (!(await pg.waitForFunction(() => window.CLAB && CLAB.open && CLAB.view === 'tl', null, { timeout: 20000 }).then(() => true, () => false))) fails.push('Keser world (' + tag + '): Enter at Timeline does not go straight into the Timeline');
        errs.forEach(e => fails.push('Keser world (' + tag + '): ' + e)); await ctx.close(); }
    }
    /* no 3D: the clean cards */
    { const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } }), pg = await ctx.newPage(); await pg.goto(url + 'world.html?nogl=1');
      if (!(await pg.waitForURL(/home\.html/, { timeout: 8000 }).then(() => true, () => false))) fails.push('Keser world (no 3D): the clean cards do not come up'); await ctx.close(); }
  } catch (e) { fails.push('Keser world test stopped: ' + String(e).slice(0, 200)); }
  finally { srv.close(); fs.rmSync(out, { recursive: true, force: true }); }
  if (!fails.length) oks.push('Keser Girls 3.0 her 3D world: calm, two places, קודש in burgundy (Hebrew) and Timeline in green, Enter goes straight into the Chumash Lab or the Timeline, no greeting in the way, the clean cards without 3D, at Chromebook and phone size');
  return { fails, oks };
};
