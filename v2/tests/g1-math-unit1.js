/* 2.0 TEST (v2/tests/, run by tests/run.js): Grade 1 Math, Unit 1 "Counting to 120" on Orchard Hill (v2/app/g1-math/unit1.html).
   Builds v2/, opens every game with ?fast=1 (no voice, quick motion, simple graphics) at Chromebook size and phone size, and plays it as a made-up boy:
   - the hill: 7 stones in order, only the first open; a locked stone says why; tapping the open one starts the lesson;
   - the opener lesson: Mendy counts by tens, then past 100 ("Watch me"), then the boy taps 103 ... 110 himself; a wrong tap is explained;
   - Hop ahead: a wrong guess is fixed (Mendy hops and counts with him), then he tries again; 1 miss in 4 = 2 stars;
   - Fix the wall: he drags stones into the 120-chart wall; a stone dropped in the wrong gap goes back with a hint; 1 miss = 2 stars;
   - Crate count: an apple before the crates gets "tens first"; a wrong written number is explained, then he writes it right; 2 stars;
   - Find the mistake: tapping a right stone is explained; he finds 200 and 1001 and 1003 and writes 110, 101, 103;
   - Mastery check: no help button; 8 of 8 right = mastered, 3 stars;
   - Review (Kindergarten skills): all right = 3 stars;
   - every game has a "How to do it" box with steps; buttons are 64 px or more; every spoken line is 12 words or fewer;
     no page errors; nothing loads from an outside website; the screen is never blank.
   Returns { fails, oks }. */
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const R = path.join(__dirname, '..', '..');
module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 G1 Math unit 1: ' + m);
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'v2g1m-'));
  try { cp.execFileSync(process.execPath, [path.join(R, 'v2', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: dist }), stdio: 'pipe' }); }
  catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
  ['g1-math/unit1.html', 'g1-math/u1.js', 'g1-math/kit3d.js', 'g1-math/lib/three.module.min.js', 'g1-math/lib/three.core.min.js'].forEach(f => { if (!fs.existsSync(path.join(dist, f))) bad(f + ' is not in the built site'); });
  if (out.fails.length) return out;
  for (const f of ['unit1.html', 'index.html']) { const t = fs.readFileSync(path.join(dist, 'g1-math', f), 'utf8'); if (/<script[^>]+src=["']https?:/i.test(t)) bad(f + ' loads a script from an outside website'); }
  const src = fs.readFileSync(path.join(dist, 'g1-math', 'u1.js'), 'utf8') + fs.readFileSync(path.join(dist, 'g1-math', 'kit3d.js'), 'utf8');
  if (/from ['"]https?:/.test(src)) bad('the games import code from an outside website');

  async function open(w, h, g, label, extra) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }), pg = await ctx.newPage(), errs = [], outside = [];
    pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await pg.route('**/*', r => { const u = new URL(r.request().url());
      if (u.host === 'v2.test') { const f = path.join(dist, decodeURIComponent(u.pathname).slice(1)); if (f.startsWith(dist) && fs.existsSync(f)) return r.fulfill({ path: f }); return r.fulfill({ status: 404, body: '' }); }
      outside.push(u.host); return r.abort(); });
    if (extra) await pg.addInitScript(extra);
    await pg.goto('http://v2.test/g1-math/unit1.html?fast=1' + (g ? '&g=' + g : ''));
    await pg.waitForFunction(() => window.__g1 && (window.__g1.name === 'nogl' || window.__g1.err || (window.__g1.isReady && window.__g1.isReady())), null, { timeout: 60000 });
    const st = await pg.evaluate(() => ({ n: __g1.name, e: __g1.err }));
    if (st.n === 'nogl' || st.e) throw new Error('did not start: ' + (st.e || 'no 3D').slice(0, 200));
    return { ctx, pg, errs, outside, label: label + ' ' + (g || 'hill') };
  }
  const W = (pg, fn, arg, ms) => pg.waitForFunction(fn, arg, { timeout: ms || 30000 });
  const tap = async (pg, hook, ...a) => { const p = await pg.evaluate(([h, a]) => { const [k, f] = h.split('.'); return f ? __g1[k][f](...a) : __g1[k](...a); }, [hook, a]); await pg.mouse.click(p.x, p.y); };
  const notBlank = async (P, what) => { const buf = await P.pg.screenshot(); if (buf.length < 15000) bad(P.label + ': "' + what + '" looks blank (' + buf.length + ' bytes)'); };
  async function typePad(pg, n) { await W(pg, () => __g1.padOn); await pg.waitForTimeout(60); await pg.evaluate(n => __g1.padType(n), n); }
  async function finish(P, stars, exact = true) {
    await W(P.pg, () => __g1.done, null, 60000).catch(() => bad(P.label + ': the game cannot be finished'));
    const s = await P.pg.evaluate(() => __g1.stars);
    if (exact ? s !== stars : s < stars) bad(P.label + ': expected ' + stars + ' stars, got ' + s);
    if ((await P.pg.$$('#stars .star.on')).length !== s) bad(P.label + ': the end screen does not show the stars');
    await notBlank(P, 'the end');
    const info = await P.pg.evaluate(() => ({ long: __g1.long, said: __g1.said }));
    if (info.long.length) bad(P.label + ': spoken lines longer than 12 words: ' + info.long.join(' | '));
    if (info.said.some(t => /\bbites?\b/i.test(t))) bad(P.label + ': the voice says "bite"');
    if (P.errs.length) bad(P.label + ': page errors: ' + P.errs.join(' | '));
    if (P.outside.length) bad(P.label + ': tried to reach outside websites: ' + [...new Set(P.outside)].join(', '));
    await P.ctx.close();
  }
  /* answer whatever the current round asks (used by the games, the check and the review) */
  async function solve(pg, q) {
    await W(pg, q => (__g1.q || 0) > q, q);
    const a = await pg.evaluate(() => __g1.ask);
    if (a.kind === 'hop') { await W(pg, () => __g1.state === 'ask'); await tap(pg, 'hit.stone', a.answer); }
    else if (a.kind === 'wall') { await W(pg, () => __g1.state === 'ask'); for (const n of await pg.evaluate(() => __g1.looseLeft())) await drag(pg, n, n); }
    else if (a.kind === 'crates') { await W(pg, () => __g1.state === 'tapcount'); const t = Math.floor(a.answer / 10), o = a.answer % 10;
      for (let i = 0; i < t; i++) await tap(pg, 'hit.crate', i); for (let i = 0; i < o; i++) await tap(pg, 'hit.apple', i); await typePad(pg, a.answer); }
    else if (a.kind === 'hear') await typePad(pg, a.answer);
    return pg.evaluate(() => __g1.q);
  }
  async function drag(pg, n, to) { const f = await pg.evaluate(n => __g1.hit.loose(n), n), t = await pg.evaluate(n => __g1.hit.gap(n), to);
    await pg.mouse.move(f.x, f.y); await pg.mouse.down(); await pg.mouse.move((f.x + t.x) / 2, (f.y + t.y) / 2, { steps: 4 }); await pg.mouse.move(t.x, t.y, { steps: 4 }); await pg.mouse.up(); await pg.waitForTimeout(120); }
  const saidSince = (pg, k, re) => pg.evaluate(([k, re]) => __g1.said.slice(k).some(t => new RegExp(re, 'i').test(t)), [k, re]);

  async function playAll(w, h, label) {
    let P;
    const step = async (name, fn) => { try { await fn(); } catch (e) { let at = ''; try { at = await P.pg.evaluate(() => __g1.name + ' q' + __g1.q + ' ' + __g1.state); } catch (x) {} bad(label + ' ' + name + ' (at ' + at + '): ' + String(e.message || e).split('\n')[0].slice(0, 200)); try { await P.ctx.close(); } catch (x) {} } };
    /* buttons are 64 px or more */
    await step('buttons', async () => { P = await open(w, h, 'hop', label);
      for (const id of ['again', 'help', 'home']) { const b = await P.pg.$eval('#' + id, e => { const r = e.getBoundingClientRect(); return Math.min(r.width, r.height); }); if (b < 64) bad(label + ': the ' + id + ' button is ' + b + ' px (needs 64)'); }
      await P.ctx.close(); });
    /* the hill */
    await step('hill', async () => { P = await open(w, h, '', label, () => { try { localStorage.clear(); } catch (e) {} });
      await W(P.pg, () => __g1.name === 'hill-ready'); await notBlank(P, 'the hill');
      const op = await P.pg.evaluate(() => __g1.open); if (op.length !== 7 || !op[0] || op.slice(1).some(Boolean)) bad(P.label + ': a new boy should see 7 stones with only the first open, got ' + JSON.stringify(op));
      const k = await P.pg.evaluate(() => __g1.said.length); await tap(P.pg, 'stationAt', 3); await P.pg.waitForTimeout(150);
      if (!(await saidSince(P.pg, k, 'before it first'))) bad(P.label + ': a locked stone does not say why');
      await Promise.all([P.pg.waitForURL(/g=opener/, { timeout: 15000 }), tap(P.pg, 'stationAt', 0)]).catch(() => bad(P.label + ': tapping the first stone does not start the lesson'));
      await P.ctx.close(); });
    /* the opener lesson */
    await step('opener', async () => { P = await open(w, h, 'opener', label);
      await W(P.pg, () => __g1.state === 'tapnext', null, 60000); await notBlank(P, 'past 100');
      const said = await P.pg.evaluate(() => __g1.said.join(' | '));
      if (!/by tens/i.test(said) || !/\b100\b/.test(said) || !/\b101\b/.test(said)) bad(P.label + ': the lesson does not count by tens and past 100 first');
      for (let n = 103; n <= 110; n++) { await W(P.pg, n => __g1.next === n && __g1.hit && __g1.hit.next, n);
        if (n === 103) { const k = await P.pg.evaluate(() => __g1.said.length), p = await P.pg.evaluate(() => __g1.hit.prev()); await P.pg.mouse.click(p.x, p.y); await P.pg.waitForTimeout(150);
          if (!(await saidSince(P.pg, k, 'glowing'))) bad(P.label + ': a wrong tap in the lesson is not explained'); }
        await tap(P.pg, 'hit.next'); }
      const sd = await P.pg.evaluate(() => __g1.said.join(' | ')); if (!/\b110\b/.test(sd) || !/\b120\b/.test(sd)) bad(P.label + ': the lesson does not reach 110 and 120');
      await finish(P, 3); });
    /* Hop ahead */
    await step('hop', async () => { P = await open(w, h, 'hop', label);
      await P.pg.click('#help'); const hs = await P.pg.$$eval('#howl li', l => l.length); if (hs < 2) bad(P.label + ': the How to do it box has no steps'); await P.pg.click('#howx');
      let q = 0;
      for (let r = 0; r < 4; r++) { await W(P.pg, q => (__g1.q || 0) > q && __g1.state === 'ask', q, 60000); const a = await P.pg.evaluate(() => __g1.ask);
        if (r === 0) { const k = await P.pg.evaluate(() => __g1.said.length); await tap(P.pg, 'hit.stone', a.answer + 1); await P.pg.waitForTimeout(150);
          await W(P.pg, () => __g1.state === 'ask', null, 60000); if (!(await saidSince(P.pg, k, 'count the hops together'))) bad(P.label + ': a wrong landing is not explained'); await notBlank(P, 'hop fix'); }
        q = await P.pg.evaluate(() => __g1.q); await tap(P.pg, 'hit.stone', a.answer); }
      await finish(P, 2); });
    /* Fix the wall */
    await step('wall', async () => { P = await open(w, h, 'wall', label);
      let q = 0;
      for (let r = 0; r < 3; r++) { await W(P.pg, q => (__g1.q || 0) > q && __g1.state === 'ask', q, 60000); q = await P.pg.evaluate(() => __g1.q);
        const left = await P.pg.evaluate(() => __g1.looseLeft());
        if (r === 0) { if (left.length !== 2) bad(P.label + ': after the demo, 2 stones should be left'); await notBlank(P, 'the wall');
          const k = await P.pg.evaluate(() => __g1.said.length); await drag(P.pg, left[0], left[1]); await P.pg.waitForTimeout(200);
          if (!(await saidSince(P.pg, k, 'This stone is'))) bad(P.label + ': a stone in the wrong gap gets no hint');
          if ((await P.pg.evaluate(() => __g1.looseLeft())).length !== 2) bad(P.label + ': a stone in the wrong gap stayed there'); }
        for (const n of left) await drag(P.pg, n, n); }
      await finish(P, 2); });
    /* Crate count */
    await step('crates', async () => { P = await open(w, h, 'crates', label);
      let q = 0;
      for (let r = 0; r < 3; r++) { await W(P.pg, q => (__g1.q || 0) > q && __g1.state === 'tapcount', q, 60000); q = await P.pg.evaluate(() => __g1.q);
        const a = await P.pg.evaluate(() => __g1.ask), t = Math.floor(a.answer / 10), o = a.answer % 10;
        if (r === 0) { const k = await P.pg.evaluate(() => __g1.said.length); await tap(P.pg, 'hit.apple', 0); await P.pg.waitForTimeout(120); if (!(await saidSince(P.pg, k, 'Tens first'))) bad(P.label + ': an apple before the crates is not explained'); }
        for (let i = 0; i < t; i++) await tap(P.pg, 'hit.crate', i); for (let i = 0; i < o; i++) await tap(P.pg, 'hit.apple', i);
        if (r === 0) { await notBlank(P, 'counted'); const k = await P.pg.evaluate(() => __g1.said.length); await typePad(P.pg, a.answer + 10); await P.pg.waitForTimeout(200);
          if (!(await saidSince(P.pg, k, 'crates is'))) bad(P.label + ': a wrong written number is not explained'); }
        await typePad(P.pg, a.answer); }
      await finish(P, 2); });
    /* Find the mistake */
    await step('mistake', async () => { P = await open(w, h, 'mistake', label);
      let q = 0;
      for (let r = 0; r < 3; r++) { await W(P.pg, q => (__g1.q || 0) > q && __g1.state === 'find', q, 60000); q = await P.pg.evaluate(() => __g1.q); const a = await P.pg.evaluate(() => __g1.ask);
        if (r === 0) { const k = await P.pg.evaluate(() => __g1.said.length); await tap(P.pg, 'hit.stone', 0); await P.pg.waitForTimeout(150); await W(P.pg, () => __g1.state === 'find', null, 60000); if (!(await saidSince(P.pg, k, 'That one is right'))) bad(P.label + ': tapping a right stone is not explained'); }
        await tap(P.pg, 'hit.stone', a.bad); await typePad(P.pg, a.answer); }
      const said = await P.pg.evaluate(() => __g1.said.join(' | ')); if (!/\b110\b/.test(said) || !/\b103\b/.test(said)) bad(P.label + ': the mistakes past 100 were not fixed');
      await finish(P, 2); });
    /* Mastery check */
    await step('check', async () => { P = await open(w, h, 'check', label);
      if (!(await P.pg.$eval('#help', e => e.classList.contains('off')))) bad(P.label + ': the check shows the help button');
      let q = 0; for (let i = 0; i < 8; i++) q = await solve(P.pg, q);
      await W(P.pg, () => __g1.done, null, 60000); if (!(await P.pg.evaluate(() => __g1.mastered))) bad(P.label + ': 8 of 8 right is not "mastered"');
      await finish(P, 3); });
    /* Review */
    await step('review', async () => { P = await open(w, h, 'review', label);
      let q = 0; for (let i = 0; i < 6; i++) q = await solve(P.pg, q);
      await finish(P, 3); });
  }
  await playAll(1366, 768, 'Chromebook');
  await playAll(390, 844, 'phone');
  if (!out.fails.length) out.oks.push('2.0 G1 Math unit 1 (Counting to 120, 3D): the hill, the lesson and 6 games play to the end at Chromebook and phone size; wrong moves are explained; the check needs no help');
  fs.rmSync(dist, { recursive: true, force: true });
  return out;
};
