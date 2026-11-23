/* 2.0 TEST (run by tests/run.js): Kindergarten Numbers, Unit 1, game 1 "Peek!" played as a made-up boy.
   Builds v2/ and opens the game at Chromebook size (1366x768) and phone size (390x844), quick mode (?fast=1).
   Checks: it loads with real pictures (not a blank screen) and no errors; the demo SHOWS first ("Watch me ... Now you!");
   a wrong answer is handled kindly (the towel lifts, we look again, the basket shows what to fix) and can be fixed;
   drag and tap both work; the game can be won to the end; stars are saved and 2+ stars marks it passed (opens the next game);
   every spoken line is 12 words or fewer; everything fits on a phone with buttons at least 64 pixels.
   Pictures go to tests/out/k-numbers-peek-*.png. Returns { fails, oks }. */
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const R = path.join(__dirname, '..', '..');
module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 K Numbers Peek: ' + m);
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'v2peek-'));
  try { cp.execFileSync(process.execPath, [path.join(R, 'v2', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: dist }), stdio: 'pipe' }); }
  catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
  const shots = path.join(R, 'tests', 'out'); fs.mkdirSync(shots, { recursive: true });

  async function open(w, h) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 800 }), pg = await ctx.newPage(), errs = [];
    pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await pg.route('**/*', r => { const u = new URL(r.request().url());
      if (u.host === 'v2.test') { const f = path.join(dist, u.pathname === '/' ? 'index.html' : decodeURIComponent(u.pathname.slice(1))); if (f.startsWith(dist) && fs.existsSync(f)) return r.fulfill({ path: f }); return r.fulfill({ status: 404, body: '' }); }
      return r.abort(); });
    await pg.goto('http://v2.test/k-numbers/peek.html?fast=1');
    return { ctx, pg, errs };
  }
  const until = (pg, f, t) => pg.waitForFunction(f, null, { timeout: t || 20000, polling: 30 });
  const tapApple = async pg => { await pg.click('#crate .pa >> nth=0', { force: true }); await pg.waitForTimeout(40); };

  async function playRound(pg, how) {
    await until(pg, () => PEEK.phase === 'answer');
    const t = await pg.evaluate(() => PEEK.target);
    if (how === 'drag') {
      const a = await pg.locator('#crate .pa').first().boundingBox(), b = await pg.locator('#basket').boundingBox();
      await pg.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await pg.mouse.down(); await pg.mouse.move(a.x + 30, a.y - 30, { steps: 4 });
      await pg.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 6 }); await pg.mouse.up(); await pg.waitForTimeout(60);
      if (await pg.evaluate(() => PEEK.basket) !== 1) bad('dragging an apple into the basket did not put it in');
      for (let i = 1; i < t; i++) await tapApple(pg);
    } else for (let i = 0; i < t; i++) await tapApple(pg);
    await pg.click('#check', { force: true });
  }

  let w;
  try {
    /* ---- Chromebook ---- */
    w = await open(1366, 768); const pg = w.pg;
    await pg.waitForSelector('#play', { timeout: 15000 });
    const look = await pg.evaluate(() => ({ apples: [...document.querySelectorAll('#hero svg.ta')].filter(s => s.getBoundingClientRect().width > 40).length,
      bg: getComputedStyle(document.body).backgroundImage, play: document.getElementById('play').getBoundingClientRect().width, text: document.body.innerText }));
    if (look.apples < 3) bad('the start screen does not show its apple picture'); if (!/gradient/.test(look.bg)) bad('the page background is plain (blank-looking)');
    if (look.play < 64) bad('the play button is smaller than 64 pixels');
    await pg.screenshot({ path: path.join(shots, 'k-numbers-peek-start-chromebook.png') });
    await pg.click('#play', { force: true });
    await until(pg, () => PEEK.phase === 'answer', 30000);
    const demo = await pg.evaluate(() => NK.said.slice());
    if (!demo.some(s => /Watch me/.test(s)) || !demo.some(s => /^Now you!/.test(s))) bad('the game does not show how first ("Watch me ... Now you!")');
    const real = await pg.evaluate(() => ({ plate: document.querySelectorAll('#plate .ta').length, crate: [...document.querySelectorAll('#crate .pa')].filter(s => s.getBoundingClientRect().width > 40).length }));
    if (real.plate < 1 || real.crate !== 6) bad('the game screen is missing its apples (plate ' + real.plate + ', crate ' + real.crate + ')');
    await pg.screenshot({ path: path.join(shots, 'k-numbers-peek-round-chromebook.png') });

    /* a wrong answer: one too many */
    const t0 = await pg.evaluate(() => PEEK.target);
    for (let i = 0; i < t0 + 1; i++) await tapApple(pg);
    await pg.click('#check', { force: true });
    await until(pg, () => PEEK.phase === 'fix');
    const wrong = await pg.evaluate(() => ({ open: document.getElementById('peek').classList.contains('open'), extra: document.querySelectorAll('#inb .ba.extra').length, said: NK.said.slice(-9).join(' | ') }));
    if (!wrong.open) bad('after a wrong answer the towel does not lift to look again');
    if (wrong.extra !== 1) bad('after a wrong answer the basket does not show the extra apple');
    if (!/Let's look again/.test(wrong.said) || !/Take one out/.test(wrong.said)) bad('a wrong answer is not explained kindly: ' + wrong.said);
    await pg.screenshot({ path: path.join(shots, 'k-numbers-peek-wrong-chromebook.png') });
    await pg.click('#inb .ba >> nth=-1', { force: true }); await pg.waitForTimeout(60); await pg.click('#check', { force: true });
    await until(pg, () => PEEK.round >= 1).catch(() => bad('after fixing the basket the game does not go on'));

    /* the rest, right; one by dragging */
    for (let r = 1; r < 8; r++) await playRound(pg, r === 1 ? 'drag' : 'tap');
    await until(pg, () => PEEK.phase === 'done');
    const end = await pg.evaluate(() => ({ stars: PEEK.stars, first: PEEK.firstTry, saved: JSON.parse(localStorage.getItem('tl2.kNumbers') || '{}'), next: !document.getElementById('next').hidden, said: NK.said }));
    if (end.stars !== 2 || end.first !== 7) bad('7 of 8 right first time should give 2 stars (got ' + end.stars + ')');
    const g = end.saved.games && end.saved.games.peek;
    if (!g || g.best !== 2 || !g.passed) bad('the stars were not saved, or 2 stars did not open the next game');
    if (!end.next) bad('with 2 stars the "go on" button is missing');
    const long = end.said.filter(s => s.split(/\s+/).length > 12); if (long.length) bad('spoken lines longer than 12 words: ' + long.join(' | '));
    if (end.said.some(s => /\bbites?\b/i.test(s))) bad('a spoken line has a word boys must never see');
    await pg.screenshot({ path: path.join(shots, 'k-numbers-peek-end-chromebook.png') });
    w.errs.forEach(e => bad('page error: ' + e)); await w.ctx.close(); w = null;

    /* ---- phone: everything fits, big buttons, and a perfect game gets the bonus round and 3 stars ---- */
    w = await open(390, 844); const ph = w.pg;
    await ph.click('#play', { force: true }); await until(ph, () => PEEK.phase === 'answer', 30000);
    const fit = await ph.evaluate(() => ['#again', '#home', '#peek', '#basket', '#crate', '#check'].map(q => { const r = document.querySelector(q).getBoundingClientRect(); return { q, r: [r.left, r.top, r.right, r.bottom, r.width, r.height] }; }));
    fit.forEach(f => { if (f.r[0] < -1 || f.r[1] < -1 || f.r[2] > 391 || f.r[3] > 845) bad('on a phone ' + f.q + ' is cut off'); });
    fit.filter(f => /again|home|check/.test(f.q)).forEach(f => { if (Math.min(f.r[4], f.r[5]) < 64) bad('on a phone the ' + f.q + ' button is smaller than 64 pixels'); });
    await tapApple(ph); await ph.waitForTimeout(350); const hole = await ph.evaluate(() => Math.min(document.querySelector('#crate .pa').getBoundingClientRect().width, document.querySelector('#inb .ba').getBoundingClientRect().width)); if (hole < 56) bad('on a phone the apples are too small to tap (' + Math.round(hole) + 'px)'); await ph.click('#inb .ba', { force: true }); await ph.waitForTimeout(350); if (await ph.evaluate(() => PEEK.basket) !== 0) bad('on a phone tapping an apple in the basket does not take it out');
    await ph.screenshot({ path: path.join(shots, 'k-numbers-peek-round-phone.png') });
    for (let r = 0; r < 8; r++) await playRound(ph, 'tap');
    await until(ph, () => PEEK.bonus === true && PEEK.phase === 'answer').catch(() => bad('a perfect game does not give the bonus round'));
    for (let r = 0; r < 2; r++) await playRound(ph, 'tap');
    await until(ph, () => PEEK.phase === 'done');
    if (await ph.evaluate(() => PEEK.stars) !== 3) bad('a perfect game should give 3 stars');
    await ph.screenshot({ path: path.join(shots, 'k-numbers-peek-end-phone.png') });
    w.errs.forEach(e => bad('page error (phone): ' + e)); await w.ctx.close(); w = null;
  } catch (e) { bad('crashed: ' + String(e).slice(0, 240)); }
  finally { if (w) await w.ctx.close().catch(() => {}); fs.rmSync(dist, { recursive: true, force: true }); }
  if (!out.fails.length) out.oks.push('2.0 K Numbers Peek: loads with real pictures, shows first, a mistake teaches, drag and tap work, can be won, saves stars, bonus round, fits a phone');
  return out;
};
