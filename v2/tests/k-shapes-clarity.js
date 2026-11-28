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
/* games where the lesson is not the look of the shape (flat vs solid, building, position, colour): plain one-colour pieces too, so nothing pulls the eye (shapes-c) */
const ALSO_PLAIN = ['flat-or-solid', 'build-shapes', 'where-is-it', 'sort-colors'];
ALSO_PLAIN.push('mystery-shape', 'solid-shapes');   /* shapes-b: he counts corners in Mystery shape; The solid shapes is the first meeting with the solids (rules 1, 6) */
module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 K shapes clarity: ' + m);
  /* rule 10: no flying creatures behind the game. Every painted world was looked at; the ones with butterflies or birds have them painted out (look.js FLYERS).
     A new painting must be looked at and added here (and to FLYERS if anything flies in it). */
  const LOOKED = { garden: 4, jungle: 2, toyland: 0, sky: 0, bakery: 0, space: 0, beach: 0, underwater: 0, traintown: 0, snow: 0, farm: 0, party: 0 };
  const lookSrc = fs.readFileSync(path.join(R, 'v2', 'app', 'k-shapes', 'look.js'), 'utf8'), fm = lookSrc.match(/const FLYERS = (\{[\s\S]*?\});/);
  let FLY = {}; try { FLY = fm ? Function('return ' + fm[1])() : {}; } catch (e) { bad('look.js FLYERS cannot be read'); }
  if (!fm) bad('look.js has no FLYERS list (butterflies and birds painted out of the backdrops)');
  for (const f of fs.readdirSync(path.join(R, 'v2', 'app', 'k-shapes', 'worlds')).filter(f => /^[a-z]+\.jpg$/.test(f))) {
    const w = f.slice(0, -4);
    if (!(w in LOOKED)) bad('the painting worlds/' + f + ' was never checked for butterflies or birds (add it to LOOKED in this test, and to FLYERS in look.js if anything flies in it)');
    else if ((FLY[w] || []).length !== LOOKED[w]) bad('worlds/' + f + ' has ' + LOOKED[w] + ' flying creatures, but look.js FLYERS paints out ' + (FLY[w] || []).length);
  }
  /* the "no corners" card must not look like a circle (review 1): dot cards are rounded dice cards, never a disc */
  if (/CircleGeometry\(0\.37/.test(fs.readFileSync(path.join(R, 'v2', 'app', 'k-shapes', 'kit.js'), 'utf8'))) bad('the dot cards on the corner boxes are round discs again (an empty one looks like a circle label)');
  /* review 5 (round 5 of the clarity pass): a lit corner or side must stand out from the piece. Gold balls on a yellow hexagon and green bars on a green square could not be seen */
  { const K = fs.readFileSync(path.join(R, 'v2', 'app', 'k-shapes', 'kit.js'), 'utf8');
    if (!/m\.material = cMat\(o\)/.test(K) || !/const cMat = o =>/.test(K)) bad('lit corners no longer pick a colour that stands out from the piece (kit.js cMat): gold on a yellow hexagon cannot be seen');
    if (!/const pick = \(hex, alt\) => \(near\(o\.color, hex\)/.test(K)) bad('lit sides no longer avoid the piece\'s own colour (kit.js sideSteps pick): green bars on a green square cannot be seen');
    /* rule 8: a label on a box must never look like one more thing to count */
    const BS = fs.readFileSync(path.join(R, 'v2', 'app', 'k-shapes', 'big-and-small.html'), 'utf8');
    if (/paint: '(?!none)/.test(BS)) bad('big-and-small has a picture painted on a box again (it looked like one more thing to count; the boxes themselves are big and small)'); }
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
        if (FIRST.includes(g) || ALSO_PLAIN.includes(g)) {
          if (!r.plain) bad(L + ': this game must use plain shapes (plain: true)');
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
