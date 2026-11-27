/* 2.0 TEST (v2/tests/, run by tests/run.js): Grade 1 Math, Unit 2 "Count on, count back" in the Harbor (v2/app/g1-math/unit2.html).
   Builds v2/, opens every game with ?fast=1 at Chromebook size and phone size, and plays it as a made-up boy:
   - the dock: 8 posts in order, only the first open; a locked post says why; the open one starts the lesson;
   - the lesson: Mendy puts 8 in his head and counts on; the boy taps 3 barrels (7, 8, 9) and writes 9 (a wrong answer is explained), then taps 11, 10, 9 to count back;
   - Sail on: he drags the boat buoy by buoy; sailing too far is explained, then he writes the answer; 1 miss in 4 = 2 stars;
   - Big pile first: choosing the small pile first shows the long count and asks again; he counts on the small pile and writes;
   - Spin the plank: he writes 3 + 8, spins the plank with his finger, and writes 8 + 3 (the same);
   - Pull it back: each pull on the rope brings the boat back one buoy; too many pulls are explained and he tries again;
   - Find the mistake: tapping a right hop is explained; he finds Dovid's extra count, sails the right hops himself and writes the answer;
   - Mastery check (no help, blank buoys, the last 3 with no buoys) and the review (Unit 1 and K): all right = 3 stars;
   - "How to do it" boxes, buttons 64 px or more, spoken lines 12 words or fewer, no page errors, nothing from outside websites, never blank.
   Returns { fails, oks }. */
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const R = path.join(__dirname, '..', '..');
module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 G1 Math unit 2: ' + m);
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'v2g1m2-'));
  try { cp.execFileSync(process.execPath, [path.join(R, 'v2', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: dist }), stdio: 'pipe' }); }
  catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
  ['g1-math/unit2.html', 'g1-math/u2.js', 'g1-math/harbor.js', 'g1-math/kit3d.js'].forEach(f => { if (!fs.existsSync(path.join(dist, f))) bad(f + ' is not in the built site'); });
  /* every game file must parse (a quote typo would break every screen) */
  for (const f of ['u2.js', 'harbor.js', 'kit3d.js']) { const tmp = path.join(dist, 'g1-math', '.check-' + f.replace('.js', '.mjs')); fs.copyFileSync(path.join(dist, 'g1-math', f), tmp);
    try { cp.execFileSync(process.execPath, ['--check', tmp], { stdio: 'pipe' }); } catch (e) { bad(f + ' does not parse: ' + String(e.stderr || e).split('\n').slice(0, 4).join(' ')); } fs.rmSync(tmp, { force: true }); }
  if (out.fails.length) return out;

  async function open(w, h, g, label, extra) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }), pg = await ctx.newPage(), errs = [], outside = [];
    pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await pg.route('**/*', r => { const u = new URL(r.request().url());
      if (u.host === 'v2.test') { const f = path.join(dist, decodeURIComponent(u.pathname).slice(1)); if (f.startsWith(dist) && fs.existsSync(f)) return r.fulfill({ path: f }); return r.fulfill({ status: 404, body: '' }); }
      outside.push(u.host); return r.abort(); });
    if (extra) await pg.addInitScript(extra);
    await pg.goto('http://v2.test/g1-math/unit2.html?fast=1' + (g ? '&g=' + g : ''));
    await pg.waitForFunction(() => window.__g1 && (window.__g1.name === 'nogl' || window.__g1.err || (window.__g1.isReady && window.__g1.isReady())), null, { timeout: 60000 });
    const st = await pg.evaluate(() => ({ n: __g1.name, e: __g1.err }));
    if (st.n === 'nogl' || st.e) throw new Error('did not start: ' + (st.e || 'no 3D').slice(0, 200));
    return { ctx, pg, errs, outside, label: label + ' ' + (g || 'dock') };
  }
  const W = (pg, fn, arg, ms) => pg.waitForFunction(fn, arg, { timeout: ms || 30000 });
  const pos = (pg, hook, ...a) => pg.evaluate(([h, a]) => { const [k, f] = h.split('.'); return f ? __g1[k][f](...a) : __g1[k](...a); }, [hook, a]);
  const tap = async (pg, hook, ...a) => { const p = await pos(pg, hook, ...a); await pg.mouse.click(p.x, p.y); };
  const dragTo = async (pg, from, to) => { await pg.mouse.move(from.x, from.y); await pg.mouse.down(); await pg.mouse.move((from.x + to.x) / 2, (from.y + to.y) / 2, { steps: 4 }); await pg.mouse.move(to.x, to.y, { steps: 6 }); await pg.mouse.up(); await pg.waitForTimeout(120); };
  const notBlank = async (P, what) => { const buf = await P.pg.screenshot(); if (buf.length < 15000) bad(P.label + ': "' + what + '" looks blank (' + buf.length + ' bytes)'); };
  async function typePad(pg, n) { await W(pg, () => __g1.padOn); await pg.waitForTimeout(60); await pg.evaluate(n => __g1.padType(n), n); }
  /* on a slow test machine a tap can land while the 3D picture is still catching up: try it again (fresh position, up to 3 times) if nothing happened */
  async function tryUntil(pg, act, ok, ms = 4000) { for (let i = 0; i < 3; i++) { await act(); try { await W(pg, ok.fn, ok.arg, ms); return true; } catch (e) {} } return false; }
  const saidSince = (pg, k, re) => pg.evaluate(([k, re]) => __g1.said.slice(k).some(t => new RegExp(re, 'i').test(t)), [k, re]);
  const saidN = pg => pg.evaluate(() => __g1.said.length);
  async function finish(P, stars) {
    await W(P.pg, () => __g1.done, null, 60000).catch(() => bad(P.label + ': the game cannot be finished'));
    const s = await P.pg.evaluate(() => __g1.stars); if (s !== stars) bad(P.label + ': expected ' + stars + ' stars, got ' + s);
    if ((await P.pg.$$('#stars .star.on')).length !== s) bad(P.label + ': the end screen does not show the stars');
    await notBlank(P, 'the end');
    const info = await P.pg.evaluate(() => ({ long: __g1.long, said: __g1.said }));
    if (info.long.length) bad(P.label + ': spoken lines longer than 12 words: ' + info.long.join(' | '));
    if (info.said.some(t => /\bbites?\b/i.test(t))) bad(P.label + ': the voice says "bite"');
    if (P.errs.length) bad(P.label + ': page errors: ' + P.errs.join(' | '));
    if (P.outside.length) bad(P.label + ': tried to reach outside websites: ' + [...new Set(P.outside)].join(', '));
    await P.ctx.close();
  }
  /* sail the boat to buoy n (drag), then write the answer */
  async function sailTo(pg, n) { await W(pg, () => __g1.state === 'drag'); await dragTo(pg, await pos(pg, 'hit.boat'), await pos(pg, 'hit.buoy', n)); }
  async function solve(pg, q) {
    await W(pg, q => (__g1.q || 0) > q, q);
    const [a, cur] = await pg.evaluate(() => [__g1.ask, __g1.q]);
    if (a.kind === 'sail' || a.kind === 'back') { await sailTo(pg, a.answer); await typePad(pg, a.answer); }
    else await typePad(pg, a.answer);
    return cur;
  }

  async function playAll(w, h, label) {
    let P;
    const step = async (name, fn) => { try { await fn(); } catch (e) { let at = ''; try { at = await P.pg.evaluate(() => __g1.name + ' q' + __g1.q + ' ' + __g1.state); } catch (x) {} bad(label + ' ' + name + ' (at ' + at + '): ' + String(e.message || e).split('\n')[0].slice(0, 200)); try { await P.ctx.close(); } catch (x) {} } };
    await step('dock', async () => { P = await open(w, h, '', label, () => { try { localStorage.clear(); } catch (e) {} });
      await W(P.pg, () => __g1.name === 'dock-ready'); await notBlank(P, 'the dock');
      for (const id of ['again', 'help', 'home']) { const b = await P.pg.$eval('#' + id, e => { const r = e.getBoundingClientRect(); return Math.min(r.width, r.height); }); if (b < 64) bad(P.label + ': the ' + id + ' button is ' + b + ' px'); }
      const op = await P.pg.evaluate(() => __g1.open); if (op.length !== 8 || !op[0] || op.slice(1).some(Boolean)) bad(P.label + ': a new boy should see 8 posts with only the first open');
      const k = await saidN(P.pg); await tap(P.pg, 'stationAt', 4); await P.pg.waitForTimeout(150); if (!(await saidSince(P.pg, k, 'glowing post first'))) bad(P.label + ': a locked post does not say why');
      await Promise.all([P.pg.waitForURL(/g=opener/, { timeout: 15000 }), tap(P.pg, 'stationAt', 0)]).catch(() => bad(P.label + ': the first post does not start the lesson'));
      await P.ctx.close(); });
    await step('opener', async () => { P = await open(w, h, 'opener', label);
      await W(P.pg, () => __g1.state === 'tapcount', null, 60000); await notBlank(P, 'count on');
      if (!(await P.pg.evaluate(() => __g1.said.some(t => /in my head/.test(t))))) bad(P.label + ': the lesson does not teach "in my head"');
      for (let i = 0; i < 3; i++) { if (!(await tryUntil(P.pg, () => tap(P.pg, 'hit.barrel', i), { fn: n => __g1.said.includes(String(n)), arg: 7 + i }))) bad(P.label + ': tapping a barrel does not count on'); }
      await W(P.pg, () => __g1.state === 'write');
      const k = await saidN(P.pg); await typePad(P.pg, 8); await P.pg.waitForTimeout(150); if (!(await saidSince(P.pg, k, 'then 7, 8, 9'))) bad(P.label + ': a wrong answer in the lesson is not explained');
      await typePad(P.pg, 9);
      await W(P.pg, () => __g1.state === 'tapback', null, 60000).catch(() => bad(P.label + ': the lesson does not let him count back'));
      for (let k = 11; k >= 9; k--) { await W(P.pg, k => __g1.next === k, k); await tap(P.pg, 'hit.buoy', k); }
      await W(P.pg, () => __g1.said.some(t => /take away 3 is 9/.test(t)), null, 60000).catch(() => bad(P.label + ': the lesson does not show counting back'));
      await finish(P, 3); });
    await step('sail', async () => { P = await open(w, h, 'sail', label);
      await P.pg.click('#help'); if ((await P.pg.$$eval('#howl li', l => l.length)) < 2) bad(P.label + ': the How to do it box has no steps'); await P.pg.click('#howx');
      let q = 1;   /* the demo is round 1 */
      for (let r = 0; r < 4; r++) { await W(P.pg, q => (__g1.q || 0) > q && __g1.state === 'drag', q, 60000); const a = await P.pg.evaluate(() => __g1.ask); q = await P.pg.evaluate(() => __g1.q);
        if (r === 0) { await notBlank(P, 'sail'); const k = await saidN(P.pg); await sailTo(P.pg, a.answer + 1); await P.pg.waitForTimeout(150);
          if (!(await saidSince(P.pg, k, 'You sailed'))) bad(P.label + ': sailing too far is not explained'); }
        await sailTo(P.pg, a.answer); await typePad(P.pg, a.answer); }
      await finish(P, 2); });
    await step('bigfirst', async () => { P = await open(w, h, 'bigfirst', label);
      let q = 0;
      for (let r = 0; r < 4; r++) { await W(P.pg, q => (__g1.q || 0) > q && __g1.state === 'choose', q, 60000); const a = await P.pg.evaluate(() => __g1.ask); q = await P.pg.evaluate(() => __g1.q);
        if (r === 0) { const k = await saidN(P.pg); await tap(P.pg, 'hit.pile', a.small); await W(P.pg, () => __g1.state === 'choose', null, 30000); if (!(await saidSince(P.pg, k, 'big pile first'))) bad(P.label + ': choosing the small pile first is not explained'); }
        await tap(P.pg, 'hit.pile', a.big); await W(P.pg, () => __g1.state === 'tapcount');
        for (let i = 0; i < a.small; i++) { await tap(P.pg, 'hit.barrel', i); await P.pg.waitForTimeout(60); }
        await typePad(P.pg, a.answer); }
      await finish(P, 2); });
    await step('turn', async () => { P = await open(w, h, 'turn', label);
      let q = 0;
      for (let r = 0; r < 3; r++) { await W(P.pg, q => (__g1.q || 0) > q && __g1.state === 'write', q, 60000); const a = await P.pg.evaluate(() => __g1.ask); q = await P.pg.evaluate(() => __g1.q);
        if (r === 0) { const k = await saidN(P.pg); await typePad(P.pg, a.answer + 1); await P.pg.waitForTimeout(150); if (!(await saidSince(P.pg, k, 'in your head'))) bad(P.label + ': a wrong sum is not explained'); }
        await typePad(P.pg, a.answer); await W(P.pg, () => __g1.state === 'spin');
        await dragTo(P.pg, await pos(P.pg, 'hit.wheel'), await pos(P.pg, 'hit.spinTo'));
        await W(P.pg, () => __g1.state === 'write2', null, 15000).catch(() => bad(P.label + ': dragging the wheel does not spin the plank'));
        if (!(await P.pg.evaluate(a => __g1.said.some(t => t.includes(a.b + ' plus ' + a.a)), a))) bad(P.label + ': after the spin the sum is not turned around');
        await typePad(P.pg, a.answer); }
      await finish(P, 2); });
    await step('pull', async () => { P = await open(w, h, 'pull', label);
      let q = 1;
      for (let r = 0; r < 3; r++) { await W(P.pg, q => (__g1.q || 0) > q && __g1.state === 'pull', q, 60000); const a = await P.pg.evaluate(() => __g1.ask); q = await P.pg.evaluate(() => __g1.q);
        const pullN = async n => { for (let i = 0; i < n; i++) { const before = await P.pg.evaluate(() => __g1.at); if (!(await tryUntil(P.pg, async () => dragTo(P.pg, await pos(P.pg, 'hit.ring'), await pos(P.pg, 'hit.pullTo')), { fn: b => __g1.at === b - 1, arg: before }, 5000))) {
          const info = await P.pg.evaluate(() => ({ ring: __g1.hit.ring(), to: __g1.hit.pullTo(), at: __g1.at, state: __g1.state, w: innerWidth, h: innerHeight, frames: __g1.frames }));
          try { fs.mkdirSync(path.join(R, 'tests', 'out'), { recursive: true }); await P.pg.screenshot({ path: path.join(R, 'tests', 'out', 'g1-math-unit2-pull-' + w + '.png') }); } catch (e) {}
          bad(P.label + ': a pull on the rope does not bring the boat back ' + JSON.stringify(info)); } } };
        if (r === 0) { await pullN(a.k + 1); const k = await saidN(P.pg); await tap(P.pg, 'hit.anchor'); await W(P.pg, () => __g1.state === 'pull'); if (!(await saidSince(P.pg, k, 'You pulled'))) bad(P.label + ': too many pulls are not explained'); }
        await pullN(a.k); await tap(P.pg, 'hit.anchor'); await typePad(P.pg, a.answer); }
      await finish(P, 2); });
    await step('mistake', async () => { P = await open(w, h, 'mistake', label);
      let q = 0;
      for (let r = 0; r < 3; r++) { await W(P.pg, q => (__g1.q || 0) > q && __g1.state === 'find', q, 60000); const a = await P.pg.evaluate(() => __g1.ask); q = await P.pg.evaluate(() => __g1.q);
        if (r === 0) { const k = await saidN(P.pg); await tap(P.pg, 'hit.label', 1); await W(P.pg, () => __g1.state === 'find'); if (!(await saidSince(P.pg, k, 'That hop is fine'))) bad(P.label + ': tapping a right hop is not explained'); }
        await tap(P.pg, 'hit.label', 0); await W(P.pg, () => __g1.state === 'drag'); await dragTo(P.pg, await pos(P.pg, 'hit.boat'), await pos(P.pg, 'hit.buoy', a.answer)); await typePad(P.pg, a.answer);
        await W(P.pg, n => __g1.said.some(t => t === 'Yes! ' + n + '. Thank you!'), a.answer).catch(() => bad(P.label + ': the mistake was not fixed')); }
      await finish(P, 2); });
    await step('check', async () => { P = await open(w, h, 'check', label);
      if (!(await P.pg.$eval('#help', e => e.classList.contains('off')))) bad(P.label + ': the check shows the help button');
      let q = 0; for (let i = 0; i < 8; i++) q = await solve(P.pg, q);
      await W(P.pg, () => __g1.done, null, 60000); if (!(await P.pg.evaluate(() => __g1.mastered))) bad(P.label + ': 8 of 8 right is not "mastered"');
      await finish(P, 3); });
    await step('review', async () => { P = await open(w, h, 'review', label);
      let q = 0; for (let i = 0; i < 5; i++) q = await solve(P.pg, q);
      await finish(P, 3); });
  }
  await playAll(1366, 768, 'Chromebook');
  await playAll(390, 844, 'phone');
  if (!out.fails.length) out.oks.push('2.0 G1 Math unit 2 (Count on, count back, 3D harbor): the dock, the lesson and 7 games play to the end at Chromebook and phone size; wrong moves are explained; the check needs no help');
  fs.rmSync(dist, { recursive: true, force: true });
  return out;
};
