/* 2.0 TEST (v2/tests/, run by tests/run.js): Kindergarten Shapes clarity rules a script can check (v2/curriculum/K-CLARITY-RULES.md).
   Opens every Kindergarten Shapes game in the full look (?fast=1&shot=1: test speed, the boy's look) at Chromebook (1366x768) and phone (390x844) size:
   - rule 13: the game's title and the Play button are on screen, and the Play button is at least 64 px;
   - rule 4: every piece with corners has one marker for EVERY corner (never only some);
   - rule 1: the first games where a boy meets a shape (FIRST below) use plain flat shapes in one colour: nothing painted on any piece.
   Returns { fails, oks }. */
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const R = path.join(__dirname, '..', '..');
/* the first game for each flat shape (Unit 1, and corner counting in Unit 2): plain shapes only */
const FIRST = ['find-circles', 'find-triangles', 'find-squares', 'find-rectangles', 'shape-sorter', 'count-corners', 'find-hexagons'];
module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 K shapes clarity: ' + m);
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'v2kclar-'));
  try { cp.execFileSync(process.execPath, [path.join(R, 'v2', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: dist }), stdio: 'pipe' }); }
  catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
  const dir = path.join(dist, 'k-shapes');
  const games = (process.env.KSHAPES_ONLY ? process.env.KSHAPES_ONLY.split(',') : fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html').map(f => f.slice(0, -5))).sort();
  for (const g of FIRST) if (!games.includes(g) && !process.env.KSHAPES_ONLY) bad(g + ' is missing');
  let own = null;
  try { own = await require('playwright').chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); browser = own; } catch (e) {}
  let checked = 0;
  for (const g of games) for (const [w, h, size] of [[1366, 768, 'Chromebook'], [390, 844, 'phone']]) {
    const L = g + ' (' + size + ')', ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }), pg = await ctx.newPage();
    await pg.route('**/*', r => { const u = new URL(r.request().url());
      if (u.host === 'v2.test') { const f = path.join(dist, u.pathname.slice(1)); if (f.startsWith(dist) && fs.existsSync(f)) return r.fulfill({ path: f }); return r.fulfill({ status: 404, body: '' }); }
      return r.abort(); });
    try {
      await pg.goto('http://v2.test/k-shapes/' + g + '.html?fast=1&shot=1');
      if (!(await pg.waitForFunction(() => window.__shp && window.__shp.ready, null, { timeout: 60000 }).then(() => true).catch(() => false))) { bad(L + ': the game did not start'); await ctx.close(); continue; }
      const box = sel => pg.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
        return { x: r.left, y: r.top, w: r.width, h: r.height, shown: cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.2, text: (e.textContent || '').trim() }; }, sel);
      const onScreen = b => b && b.shown && b.w > 0 && b.x >= 0 && b.y >= 0 && b.x + b.w <= w + 1 && b.y + b.h <= h + 1;
      const t = await box('#gtitle'), p = await box('#start');
      if (!onScreen(t) || !t.text) bad(L + ': the title is not on screen');
      if (!onScreen(p)) bad(L + ': the Play button is not on screen');
      else if (p.w < 64 || p.h < 64) bad(L + ': the Play button is ' + Math.round(p.w) + 'x' + Math.round(p.h) + ' px (at least 64)');
      if (size === 'Chromebook') {
        const r = await pg.evaluate(async () => { const { KINDS } = await import('./kit.js');
          return { plain: window.__shp.plain, pieces: window.__shp.pieces().map(o => Object.assign(o, { want: KINDS[o.k] ? (KINDS[o.k].pts ? KINDS[o.k].pts.length : KINDS[o.k].semi ? 2 : 0) : null })) }; });
        for (const o of r.pieces) if (o.want != null && o.marks !== o.want) bad(L + ': piece ' + o.id + ' (' + o.k + ') has ' + o.want + ' corners but ' + o.marks + ' corner markers');
        if (FIRST.includes(g)) {
          if (!r.plain) bad(L + ': a first-meeting game must use plain shapes (plain: true)');
          const painted = r.pieces.filter(o => o.painted).map(o => o.id);
          if (painted.length) bad(L + ': pieces with a picture painted on them in a first-meeting game: ' + painted.join(', '));
        }
      }
      checked++;
    } catch (e) { bad(L + ': ' + String(e).slice(0, 160)); }
    await ctx.close();
  }
  if (own) await own.close();
  if (!out.fails.length) out.oks.push('2.0 K shapes clarity: ' + games.length + ' games at Chromebook and phone size show their title and a big Play button; every corner has its marker; first-meeting games use plain shapes');
  return out;
};
