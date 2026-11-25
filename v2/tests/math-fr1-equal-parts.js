/* 2.0 TEST (v2/tests/, run by tests/run.js): Math Ladder rung FR1 "Equal parts" (v2/app/math/equal-parts.html), a 3D lesson,
   and its paper page (equal-parts-print.html). Builds v2/, opens the lesson at Chromebook size and phone size with ?fast=1
   (no waiting for the voice or motion), and plays it as a made-up boy: the 3D picture really draws; the lesson, chant and
   "watch me" run; he answers equal / not equal (one wrong answer is explained, then he answers again); he opens "How to do it";
   Mistake Detective; he cuts food into equal parts (one wrong cut is explained, then he tries again); the check with all right
   gives 3 stars; every spoken line is 12 words or fewer; no "bite"; the printer button opens the paper page, which draws.
   Returns { fails, oks }. */
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const R = path.join(__dirname, '..', '..');
module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 math FR1 equal parts: ' + m);
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'v2fr1-'));
  try { cp.execFileSync(process.execPath, [path.join(R, 'v2', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: dist }), stdio: 'pipe' }); }
  catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
  for (const f of ['equal-parts.html', 'equal-parts-print.html', 'lib/three.module.min.js', 'lib/RoomEnvironment.js', 'lib/RoundedBoxGeometry.js'])
    if (!fs.existsSync(path.join(dist, 'math', f))) { bad(f + ' is not in the built site'); return out; }

  async function playAt(w, h, label) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }), pg = await ctx.newPage(), errs = [];
    pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await pg.route('**/*', r => { const u = new URL(r.request().url());
      if (u.host === 'v2.test') { const f = path.join(dist, u.pathname.slice(1)); if (f.startsWith(dist) && fs.existsSync(f)) return r.fulfill({ path: f }); return r.fulfill({ status: 404, body: '' }); }
      return r.abort(); });
    const S = () => pg.evaluate(() => window.__eq);
    const shown = sel => pg.waitForFunction(s => document.querySelector(s).classList.contains('show') && window.__eq.asking, sel, { timeout: 15000 });
    const drawn = async what => {
      const n = await pg.evaluate(() => { const c = document.getElementById('view'), g = document.createElement('canvas'); g.width = 64; g.height = 64;
        const x = g.getContext('2d'); x.drawImage(c, 0, 0, 64, 64); const d = x.getImageData(0, 0, 64, 64).data, seen = new Set();
        for (let i = 0; i < d.length; i += 4) seen.add((d[i] >> 4) + ',' + (d[i + 1] >> 4) + ',' + (d[i + 2] >> 4)); return seen.size; });
      if (n < 12) bad(label + ': "' + what + '" looks blank (' + n + ' colors)');
    };
    const judgeRight = async () => { await shown('#judge'); const s = await pg.evaluate(() => window.__eq.sizes()); await pg.click(s.every(x => x === s[0]) ? '#yes' : '#no'); };
    const judgeWrong = async () => { await shown('#judge'); const s = await pg.evaluate(() => window.__eq.sizes()); await pg.click(s.every(x => x === s[0]) ? '#no' : '#yes'); };
    const solution = (d, n) => n === 2 ? (d.cols % 2 === 0 ? ['v' + d.cols / 2] : ['h1']) : (d.cols % 4 === 0 ? ['v' + d.cols / 4, 'v' + d.cols / 2, 'v' + 3 * d.cols / 4] : ['v' + d.cols / 2, 'h1']);
    const tapLines = async ids => { for (const id of ids) { const p = (await pg.evaluate(() => window.__eq.groovePts())).find(g => g.id === id);
      if (!p) { bad(label + ': cut line ' + id + ' is missing'); return; } await pg.mouse.click(p.x, p.y); await pg.waitForTimeout(40); } };
    const cutRight = async () => { await shown('#cutbar'); const st = await S(); const ids = solution(st.dims, st.want); await tapLines(ids);
      const on = (await pg.evaluate(() => window.__eq.groovePts())).filter(g => g.on).map(g => g.id).sort().join();
      if (on !== ids.slice().sort().join()) bad(label + ': tapping the cut lines did not cut (' + on + ' vs ' + ids + ')');
      await pg.click('#done'); };
    try {
      await pg.goto('http://v2.test/math/equal-parts.html?fast=1');
      const gl = await pg.waitForFunction(() => window.__eq && window.__eq.ready, null, { timeout: 15000 }).then(() => true).catch(() => false);
      if (!gl) { bad(label + ': the 3D lesson did not start' + (errs.length ? ': ' + errs.join(' | ') : '')); await ctx.close(); return; }
      await pg.waitForTimeout(200); await drawn('start');
      await pg.click('#start', { force: true });
      await pg.waitForFunction(() => window.__eq.name === 'judge', null, { timeout: 20000 });
      const st0 = await S();
      for (const n of ['learn', 'chant', 'watch']) if (!st0.log.includes(n)) bad(label + ': the "' + n + '" part did not run');
      if (!st0.said.some(t => /halves/.test(t)) || !st0.said.some(t => /fourths/.test(t))) bad(label + ': the lesson never names halves and fourths');
      if (!st0.said.some(t => /not the same shape/.test(t))) bad(label + ': "watch me" never teaches same size, not the same shape');
      await drawn('equal or not');
      /* his turn: item 1 right; item 2 wrong first (explained), then right; he opens "How to do it" on item 3 */
      await judgeRight();
      await judgeWrong(); await pg.waitForFunction(() => window.__eq.said.includes('Let us check together.'), null, { timeout: 15000 }).catch(() => bad(label + ': a wrong answer was not explained'));
      await judgeRight();
      await shown('#judge'); await pg.click('#help');
      if (!(await pg.evaluate(() => document.getElementById('howto').classList.contains('show')))) bad(label + ': "How to do it" did not open');
      await pg.click('#help'); await judgeRight();
      /* Mistake Detective: Yanky's parts are not halves */
      await shown('#right'); await pg.click('#thumbDown');
      await pg.waitForFunction(() => window.__eq.said.includes('These are not halves. Halves are equal parts.'), null, { timeout: 15000 }).catch(() => bad(label + ': Mistake Detective did not explain'));
      /* cutting: Yanky's kugel right; chocolate wrong first (explained), then right; honey cake in fourths */
      await cutRight();
      await shown('#cutbar'); await tapLines(['v1']); await pg.click('#done');
      await pg.waitForFunction(() => window.__eq.said.includes('Not the same size. Try another line.'), null, { timeout: 15000 }).catch(() => bad(label + ': a wrong cut was not explained'));
      await cutRight(); await cutRight();
      /* the check: all right */
      await pg.waitForFunction(() => window.__eq.name === 'check', null, { timeout: 15000 });
      await judgeRight(); await judgeRight(); await cutRight(); await cutRight();
      await pg.waitForFunction(() => window.__eq.done, null, { timeout: 15000 }).catch(() => bad(label + ': the lesson did not reach the end'));
      const st = await S();
      if (st.stars !== 3 || st.checkRight !== 4) bad(label + ': all-right check gave ' + st.stars + ' stars (' + st.checkRight + '/4)');
      await drawn('end');
      const long = st.said.filter(t => t.split(/\s+/).filter(Boolean).length > 12); if (long.length) bad(label + ': spoken lines over 12 words: ' + long.join(' | '));
      const txt = (await pg.content()) + st.said.join(' '); if (/\bbites?\b/i.test(txt.replace(/<!--[\s\S]*?-->/g, ''))) bad(label + ': the word "bite"');
      await pg.click('#print'); await pg.waitForURL(/equal-parts-print\.html/, { timeout: 10000 });
      const figs = await pg.evaluate(() => ['q1', 'q2', 'q3'].map(id => document.querySelectorAll('#' + id + ' svg').length));
      if (figs.join() !== '6,4,4') bad(label + ': the paper page did not draw its pictures (' + figs + ')');
      if (errs.length) bad(label + ': page errors: ' + errs.join(' | '));
    } catch (e) { const st = await S().catch(() => ({})); bad(label + ': ' + String(e).split('\n')[0].slice(0, 160) + ' (at ' + st.name + ', last said: ' + JSON.stringify((st.said || []).slice(-2)) + ')'); }
    await ctx.close();
  }
  const before = out.fails.length;
  await playAt(1366, 768, 'Chromebook');
  await playAt(390, 844, 'phone');
  if (out.fails.length === before) out.oks.push('2.0 math FR1 equal parts: played to 3 stars at Chromebook and phone size (lesson, chant, watch me, equal or not, How to do it, Mistake Detective, cutting, check), paper page draws');
  return out;
};
