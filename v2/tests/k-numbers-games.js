/* 2.0 TEST (run by tests/run.js): Kindergarten Numbers — every game built on the shared frame, and the Numbers map, played as a made-up boy.
   For each game page (quick mode): it loads with its start picture and no errors; the demo shows first ("Now you!") where there is one;
   a wrong move is answered kindly and he can go on; the game can be won to the end; stars are saved and 2+ stars marks it passed;
   every spoken line is 12 words or fewer and never says "bite"; on a phone everything fits and the big buttons are at least 64 px.
   The map: the next stop shines, later stops and units are locked, a passed stop shows its stars, a locked tap is explained.
   Pictures go to tests/out/k-numbers-*.png. Returns { fails, oks }. */
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const R = path.join(__dirname, '..', '..');
const GAMES = (() => { try { const src = fs.readFileSync(path.join(R, 'v2', 'app', 'k-numbers', 'units.js'), 'utf8'); const w = {}; new Function('window', src)(w);
  return [].concat(...w.NK_UNITS.map(u => u.stops)).filter(s => s[1] !== 'peek.html').map(s => [s[0], s[1]]); } catch (e) { return null; } })();

module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 K Numbers: ' + m);
  if (!GAMES) { bad('units.js does not read'); return out; }
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'v2kn-'));
  try { cp.execFileSync(process.execPath, [path.join(R, 'v2', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: dist }), stdio: 'pipe' }); }
  catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
  const shots = path.join(R, 'tests', 'out'); fs.mkdirSync(shots, { recursive: true });
  async function open(file, w, h, store) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 800 }), pg = await ctx.newPage(), errs = [];
    pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await pg.route('**/*', r => { const u = new URL(r.request().url());
      if (u.host === 'v2.test') { const f = path.join(dist, decodeURIComponent(u.pathname.slice(1))); if (f.startsWith(dist) && fs.existsSync(f) && fs.statSync(f).isFile()) return r.fulfill({ path: f }); return r.fulfill({ status: 404, body: '' }); }
      return r.abort(); });
    if (store) { await pg.goto('http://v2.test/k-numbers/units.js'); await pg.evaluate(s => localStorage.setItem('tl2.kNumbers', JSON.stringify(s)), store); }
    await pg.goto('http://v2.test/k-numbers/' + file);
    return { ctx, pg, errs };
  }
  const until = (pg, f, t) => pg.waitForFunction(f, null, { timeout: t || 25000, polling: 30 });
  async function act(pg, list) {
    for (const a of list) {
      if (a.tap) { await pg.click(a.tap, { force: true }); await pg.waitForTimeout(40); }
      if (a.path) { const P = a.path; await pg.mouse.move(P[0][0], P[0][1]); await pg.mouse.down(); for (const p of P.slice(1)) await pg.mouse.move(p[0], p[1], { steps: 2 }); await pg.mouse.up(); await pg.waitForTimeout(40); }
      if (a.drag) { const s = await pg.locator(a.drag[0]).boundingBox(), t = await pg.locator(a.drag[1]).boundingBox();
        await pg.mouse.move(s.x + s.width / 2, s.y + s.height / 2); await pg.mouse.down(); await pg.mouse.move(s.x + s.width / 2 + 20, s.y + s.height / 2 + 20, { steps: 3 });
        await pg.mouse.move(t.x + t.width / 2, t.y + t.height / 2, { steps: 5 }); await pg.mouse.up(); await pg.waitForTimeout(40); }
      if (a.trace) { const p = a.trace; await pg.mouse.move(p[0][0], p[0][1]); await pg.mouse.down();   /* a finger traces through these screen points */
        for (const q of p.slice(1)) await pg.mouse.move(q[0], q[1], { steps: 2 }); await pg.mouse.up(); await pg.waitForTimeout(40); }
    }
  }

  for (const [id, file] of GAMES) {
    let w;
    try {
      w = await open(file + '?fast=1', 1366, 768); const pg = w.pg, name = file.replace('.html', '');
      await pg.waitForSelector('#play', { timeout: 15000 });
      const look = await pg.evaluate(() => ({ hero: (document.getElementById('hero').innerHTML || '').length, bg: getComputedStyle(document.body).backgroundImage }));
      if (look.hero < 40) bad(file + ': the start screen has no picture'); if (!/gradient/.test(look.bg)) bad(file + ': the background is plain');
      /* the boy must SEE the Play button and the title on the start screen (a too-big start picture once pushed them off; Esti, 2026-11-27) */
      for (const [vw, vh] of [[1366, 768], [390, 844]]) { await pg.setViewportSize({ width: vw, height: vh }); await pg.waitForTimeout(100);
        const r = await pg.evaluate(() => { const p = document.getElementById('play').getBoundingClientRect(), t = document.querySelector('.title').getBoundingClientRect(); return [p.top, p.bottom, p.left, p.right, t.top, t.bottom]; });
        if (r[0] < 0 || r[1] > vh || r[2] < 0 || r[3] > vw || r[4] < 0 || r[5] > vh) bad(file + ': on the start screen (' + vw + ' wide) the Play button or title is off the screen'); }
      await pg.setViewportSize({ width: 1366, height: 768 });
      await pg.click('#play', { force: true });
      await until(pg, () => GAME.phase === 'answer' && GAME.right, 40000);
      const said0 = await pg.evaluate(() => NK.said.slice());
      if (await pg.evaluate(() => !!document.querySelector('#hand')) && said0.some(s => /Watch me/.test(s)) && !said0.some(s => /^Now you!/.test(s))) bad(file + ': the demo does not end with "Now you!"');
      await pg.screenshot({ path: path.join(shots, 'k-numbers-' + name + '-round-chromebook.png') });
      let wrong = false, moves = 0;
      while (moves < 120) {
        await until(pg, () => (GAME.phase === 'answer' && GAME.right) || GAME.phase === 'done', 40000);
        if (await pg.evaluate(() => GAME.phase === 'done')) break;
        if (!wrong && await pg.evaluate(() => !!GAME.wrong)) {
          wrong = true; const before = await pg.evaluate(() => NK.said.length);
          await act(pg, await pg.evaluate(() => GAME.wrong()));
          await until(pg, () => GAME.phase === 'answer' && GAME.right, 30000).catch(() => bad(file + ': after a wrong move the game does not go on'));
          const after = await pg.evaluate(n => NK.said.slice(n).join(' | '), before);
          if (!/look|Look|Fix|Find|Put|show|Show/.test(after)) bad(file + ': a wrong move is not explained: ' + after.slice(0, 120));
          await pg.screenshot({ path: path.join(shots, 'k-numbers-' + name + '-wrong-chromebook.png') });
          continue;
        }
        await act(pg, await pg.evaluate(() => GAME.right())); moves++;
      }
      await until(pg, () => GAME.phase === 'done', 40000);
      const end = await pg.evaluate(id => ({ s: FR.S.stars, g: (JSON.parse(localStorage.getItem('tl2.kNumbers') || '{}').games || {})[id], said: NK.said }), id);
      if (!end.g || !end.g.passed || end.s < 2) bad(file + ': winning with one slip should pass (2+ stars, saved): ' + JSON.stringify(end.g));
      const long = end.said.filter(s => s.split(/\s+/).length > 12); if (long.length) bad(file + ': spoken lines longer than 12 words: ' + long.join(' | '));
      if (end.said.some(s => /\bbites?\b/i.test(s))) bad(file + ': a spoken line has a word boys must never see');
      await pg.screenshot({ path: path.join(shots, 'k-numbers-' + name + '-end-chromebook.png') });
      w.errs.forEach(e => bad(file + ' page error: ' + e)); await w.ctx.close(); w = null;

      w = await open(file + '?fast=1', 390, 844); const ph = w.pg;
      await ph.click('#play', { force: true }); await until(ph, () => GAME.phase === 'answer' && GAME.right, 40000);
      const fit = await ph.evaluate(() => [...document.querySelectorAll('#stage *, .top button')].filter(e => e.offsetParent && !e.closest('svg') && !e.closest('.cloth')).map(e => { const r = e.getBoundingClientRect(); return { q: e.id || e.className, r: [r.left, r.top, r.right, r.bottom] }; }));
      const cut = fit.filter(f => f.r[0] < -2 || f.r[1] < -2 || f.r[2] > 392 || f.r[3] > 846); if (cut.length) bad(file + ': on a phone something is cut off: ' + cut.slice(0, 3).map(c => c.q).join(', '));
      const small = await ph.evaluate(() => [...document.querySelectorAll('#stage button, .top button')].filter(b => b.offsetParent && getComputedStyle(b).visibility !== 'hidden').map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className, Math.min(r.width, r.height)]; }).filter(x => x[1] < 63));
      if (small.length) bad(file + ': on a phone these buttons are under 64 px: ' + small.map(x => x[0] + ' ' + Math.round(x[1])).join(', '));
      const tiny = await ph.evaluate(() => [...document.querySelectorAll('.ff:not(.locked) .box, #src .numcard, .srcs .numcard, .stone, #rolls svg')].filter(b => b.offsetParent || b.getBoundingClientRect().width).map(b => { const r = b.getBoundingClientRect(); return [b.className.baseVal != null ? 'svg' : b.className, Math.min(r.width, r.height)]; }).filter(x => x[1] < 63));
      if (tiny.length) bad(file + ': on a phone these things he taps are under 64 px: ' + tiny.slice(0, 4).map(x => x[0] + ' ' + Math.round(x[1])).join(', '));
      await ph.screenshot({ path: path.join(shots, 'k-numbers-' + name + '-round-phone.png') });
      w.errs.forEach(e => bad(file + ' page error (phone): ' + e)); await w.ctx.close(); w = null;
    } catch (e) { bad(file + ' crashed: ' + String(e).slice(0, 200)); }
    finally { if (w) await w.ctx.close().catch(() => {}); }
  }

  /* the map */
  let m;
  try {
    m = await open('index.html', 1366, 768, { games: { 'u1-opener': { best: 3, passed: true }, meet123: { best: 2, passed: true } } });
    await m.pg.waitForSelector('.stop', { timeout: 10000 });
    const st = await m.pg.evaluate(() => [...document.querySelectorAll('.stop')].map(s => ({ lock: s.classList.contains('lock'), now: s.classList.contains('now'), stars: s.querySelectorAll('.st svg').length })));
    if (st.length !== 8) bad('the map should show Unit 1\'s 8 stops (got ' + st.length + ')');
    if (!st[2] || !st[2].now || st[2].lock) bad('on the map, the stop after the last passed one should shine');
    if (st.slice(3).some(s => !s.lock)) bad('on the map, later stops should be locked');
    if (st[0].stars !== 3 || st[1].stars !== 2) bad('on the map, passed stops should show their stars');
    if (await m.pg.evaluate(() => !document.querySelector('.uchip[data-u="1"]').classList.contains('lock'))) bad('on the map, Unit 2 should be locked until Unit 1 is done');
    await m.pg.click('.stop[data-k="4"]', { force: true }); await m.pg.waitForTimeout(80);
    if (!(await m.pg.evaluate(() => NK.said.some(s => /shining one first/.test(s))))) bad('tapping a locked stop does not say what to do');
    await m.pg.screenshot({ path: path.join(shots, 'k-numbers-map-chromebook.png') });
    m.errs.forEach(e => bad('map page error: ' + e)); await m.ctx.close(); m = null;
  } catch (e) { bad('map crashed: ' + String(e).slice(0, 200)); }
  finally { if (m) await m.ctx.close().catch(() => {}); fs.rmSync(dist, { recursive: true, force: true }); }
  if (!out.fails.length) out.oks.push('2.0 K Numbers: ' + GAMES.length + ' games load, show first, explain a mistake, can be won, save stars, fit a phone; the map opens stops in order');
  return out;
};
