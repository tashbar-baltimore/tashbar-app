/* 2.0 TEST (run by tests/run.js): Kindergarten Numbers clarity, Units 5 and 6 (v2/curriculum/K-CLARITY-RULES.md).
   Plays every Unit 5 and Unit 6 stop (quick mode, Chromebook and phone size) with the right moves, and at every moment he must answer checks:
   - rule 8/9: every hand, ten-frame and bead rack on screen really shows (a hand with no height once showed nothing to count in Review 6);
   - rule 9: no empty panel is drawn (an empty white bar once sat under the path);
   - rule 12: the number he must make in Bead push and Show me (Unit 5) is at least 80 px tall on a Chromebook.
   Returns { fails, oks }. */
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const R = path.join(__dirname, '..', '..');
const STOPS = (() => { try { const src = fs.readFileSync(path.join(R, 'v2', 'app', 'k-numbers', 'units.js'), 'utf8'); const w = {}; new Function('window', src)(w);
  return [].concat(...w.NK_UNITS.map(u => u.stops)).filter(s => /^u[56]-/.test(s[0])).map(s => s[1]); } catch (e) { return null; } })();

module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 K Numbers clarity (Units 5-6): ' + m);
  if (!STOPS || !STOPS.length) { bad('units.js does not list the Unit 5 and 6 stops'); return out; }
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'v2kc56-'));
  try { cp.execFileSync(process.execPath, [path.join(R, 'v2', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: dist }), stdio: 'pipe' }); }
  catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
  let own = null;
  if (!browser) { own = await require('playwright').chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); browser = own; }
  const until = (pg, f, t) => pg.waitForFunction(f, null, { timeout: t || 40000, polling: 40 });
  async function act(pg, list) {
    for (const a of list) {
      if (a.tap) { await pg.click(a.tap, { force: true }); await pg.waitForTimeout(30); }
      const P = a.path || a.trace; if (P) { await pg.mouse.move(P[0][0], P[0][1]); await pg.mouse.down(); for (const p of P.slice(1)) await pg.mouse.move(p[0], p[1], { steps: 2 }); await pg.mouse.up(); await pg.waitForTimeout(30); }
      if (a.drag) { const s = await pg.locator(a.drag[0]).boundingBox(), t = await pg.locator(a.drag[1]).boundingBox();
        await pg.mouse.move(s.x + s.width / 2, s.y + s.height / 2); await pg.mouse.down(); await pg.mouse.move(s.x + s.width / 2 + 20, s.y + s.height / 2 + 20, { steps: 3 });
        await pg.mouse.move(t.x + t.width / 2, t.y + t.height / 2, { steps: 5 }); await pg.mouse.up(); await pg.waitForTimeout(30); }
    }
  }
  const look = () => {
    const vis = e => { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || !e.getClientRects().length) return false; for (let p = e; p; p = p.parentElement) if (getComputedStyle(p).display === 'none' || p.hidden) return false; return true; };
    const probs = [];
    document.querySelectorAll('#stage .fhand, #stage .tf, #stage .hands2, #stage .rack').forEach(e => { if (!vis(e)) return; const r = e.getBoundingClientRect(); /* zero width is hidden on purpose ("no picture now"); wide but flat is a picture that does not show */ if (r.width >= 30 && r.height < 30) probs.push('a ' + (e.className.baseVal != null ? 'picture' : e.className.split(' ')[0]) + ' shows at ' + Math.round(r.width) + 'x' + Math.round(r.height) + ' px'); });
    document.querySelectorAll('#stage .ui').forEach(u => { if (!vis(u)) return; const kids = [...u.children].filter(vis); if (!kids.length) probs.push('an empty panel is on screen'); });
    const num = document.querySelector('#num'); if (num && vis(num) && innerWidth > 900) { const s = num.querySelector('svg'); if (s && vis(s) && s.getBoundingClientRect().height < 80) probs.push('the number to make is only ' + Math.round(s.getBoundingClientRect().height) + ' px tall'); }
    return probs;
  };
  for (const file of STOPS.filter(f => !process.env.KN_ONLY || process.env.KN_ONLY.split(',').includes(f))) for (const [w, h] of [[1366, 768], [390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 800 }), pg = await ctx.newPage();
    await pg.route('**/*', r => { const u = new URL(r.request().url());
      if (u.host === 'v2.test') { const f = path.join(dist, decodeURIComponent(u.pathname.slice(1))); if (f.startsWith(dist) && fs.existsSync(f) && fs.statSync(f).isFile()) return r.fulfill({ path: f }); return r.fulfill({ status: 404, body: '' }); }
      return r.abort(); });
    const seen = new Set();
    try {
      await pg.goto('http://v2.test/k-numbers/' + file + '?fast=1'); await pg.waitForSelector('#play', { timeout: 20000 }); await pg.click('#play', { force: true });
      for (let moves = 0; moves < 120; moves++) {
        await until(pg, () => (GAME.phase === 'answer' && GAME.right) || GAME.phase === 'done');
        if (await pg.evaluate(() => GAME.phase === 'done')) break;
        await pg.waitForTimeout(120);
        for (const p of await pg.evaluate(look)) if (!seen.has(p)) { seen.add(p); bad(file + ' (' + (w > 900 ? 'Chromebook' : 'phone') + '): ' + p); }
        await act(pg, await pg.evaluate(() => GAME.right()));
      }
    } catch (e) { bad(file + ' (' + w + ' wide) could not be played: ' + String(e.message || e).split('\n')[0].slice(0, 160)); }
    await ctx.close();
  }
  if (own) await own.close();
  fs.rmSync(dist, { recursive: true, force: true });
  if (!out.fails.length) out.oks.push('2.0 K Numbers clarity: the ' + STOPS.length + ' Unit 5 and 6 stops always show what he counts, never an empty panel, and the number to make is big');
  return out;
};
