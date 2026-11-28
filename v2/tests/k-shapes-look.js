/* 2.0 TEST (v2/tests/, run by tests/run.js): Kindergarten Shapes, the new look (v2/app/k-shapes/look.js).
   The game tests (k-shapes-unitN.js) play every game on the plain test look, so they stay quick. This test opens one game in each
   of the 12 worlds with the new look switched on (?fast=1&look=1) and checks: it starts, no page errors, the 3D picture really draws,
   the painted pictures (backdrop and ground) are in the built site, and every game names a world that exists.
   Returns { fails, oks }. */
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const R = path.join(__dirname, '..', '..'), APP = path.join(R, 'v2', 'app', 'k-shapes');
const ONE_PER_WORLD = { toyland: 'find-circles', garden: 'count-corners', sky: 'find-hexagons', bakery: 'what-comes-next', space: 'solid-shapes', beach: 'build-shapes',
  underwater: 'where-is-it', traintown: 'pattern-train', jungle: 'sort-colors', snow: 'line-them-up', farm: 'heavy-and-light', party: 'graduation' };
module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 K shapes look: ' + m);
  /* every game names a world, and that world has its painted pictures */
  const look = fs.readFileSync(path.join(APP, 'look.js'), 'utf8');
  /* the look-around page (index.html) opens every game, nothing locked */
  const idx = fs.existsSync(path.join(APP, 'index.html')) ? fs.readFileSync(path.join(APP, 'index.html'), 'utf8') : '';
  if (!idx) bad('index.html (the page of all games) is missing');
  for (const f of fs.readdirSync(APP).filter(x => x.endsWith('.html') && x !== 'index.html')) if (idx && !idx.includes('href="' + f + '"')) bad('index.html does not open ' + f);
  for (const f of fs.readdirSync(APP).filter(x => x.endsWith('.html') && x !== 'index.html')) {
    const m = fs.readFileSync(path.join(APP, f), 'utf8').match(/world: '([a-z]+)'/);
    if (!m) { bad(f + ' has no world'); continue; }
    if (!new RegExp('function ' + m[1] + '\\(').test(look)) bad(f + ' names a world that does not exist: ' + m[1]);
    for (const p of [m[1] + '.jpg', m[1] + '-ground.jpg']) if (!fs.existsSync(path.join(APP, 'worlds', p))) bad(f + ': worlds/' + p + ' is missing');
  }
  /* the painted pictures (art/, from the picture account): every one the code names is there and small enough for a school Chromebook */
  const code = ['treasures.js', 'look.js', 'kit.js'].map(f => fs.readFileSync(path.join(APP, f), 'utf8')).join('\n');
  const have = (code.match(/const HAVE = new Set\(\[([^\]]*)\]\)/) || [, ''])[1].match(/[a-z0-9-]+\.(?:png|jpg)/g) || [];
  const mats = ((code.match(/const MATS = new Set\(\[([^\]]*)\]\)/) || [, ''])[1].match(/[a-z]+/g) || []).map(w => 'mat-' + w + '.png');
  const friends = ((code.match(/const FRIENDS = \[([^\]]*)\]/) || [, ''])[1].match(/[a-z]+/g) || []).flatMap(w => ['idle', 'talk'].map(p => w + '-' + p + '.png'));
  for (const f of [...mats, ...friends, ...have, ...['mendy', 'shmuel'].flatMap(w => ['idle', 'talk'].map(p => w + '-' + p + '.png')), ...['red', 'blue', 'yellow', 'green'].map(c => 'cupcake-' + c + '.png')]) {
    const fp = path.join(APP, 'art', f);
    if (!fs.existsSync(fp)) bad('art/' + f + ' is missing');
    else if (fs.statSync(fp).size > 160 * 1024) bad('art/' + f + ' is too big for a school Chromebook (' + Math.round(fs.statSync(fp).size / 1024) + ' KB; keep each under 160 KB)');
  }
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'v2look-'));
  try { cp.execFileSync(process.execPath, [path.join(R, 'v2', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: dist }), stdio: 'pipe' }); }
  catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
  let own = null;
  try { own = await require('playwright').chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); browser = own; } catch (e) {}
  for (const [world, game, extra] of [...Object.entries(ONE_PER_WORLD), ['bakery (painted look)', 'what-comes-next', '&kids=painted'], ['snow, a tower round (painted look)', 'line-them-up', '&jump=round3']]) {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 }), pg = await ctx.newPage(), errs = [];
    pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await pg.route('**/*', r => { const u = new URL(r.request().url());
      if (u.host === 'v2.test') { const f = path.join(dist, u.pathname.slice(1)); if (f.startsWith(dist) && fs.existsSync(f)) return r.fulfill({ path: f }); return r.fulfill({ status: 404, body: '' }); }
      return r.abort(); });
    try {
      await pg.goto('http://v2.test/k-shapes/' + game + '.html?fast=1&look=1' + (extra || ''));
      if (!(await pg.waitForFunction(() => window.__shp && window.__shp.ready, null, { timeout: 30000 }).then(() => true).catch(() => false))) bad(world + ' (' + game + '): the game did not start');
      else {
        if (/jump=/.test(extra || '')) {   /* play into that round: the calm look once crashed when it built the towers (no snow cap came back as null) */
          await pg.click('#start', { force: true }).catch(() => {});
          if (!(await pg.waitForFunction(() => ['find', 'count'].includes(window.__shp.name), null, { timeout: 30000 }).then(() => true).catch(() => false))) bad(world + ' (' + game + '): the round did not open');
        }
        await pg.waitForTimeout(600);
        if (!(await pg.evaluate(() => document.body.classList.contains('world')))) bad(world + ' (' + game + '): the new look is not on');
        const n = await pg.evaluate(() => { const c = document.getElementById('view'), g = document.createElement('canvas'); g.width = 64; g.height = 64;
          const x = g.getContext('2d'); x.drawImage(c, 0, 0, 64, 64); const d = x.getImageData(0, 0, 64, 64).data, seen = new Set();
          for (let i = 0; i < d.length; i += 4) seen.add((d[i] >> 4) + ',' + (d[i + 1] >> 4) + ',' + (d[i + 2] >> 4)); return seen.size; });
        if (n < 12) bad(world + ' (' + game + '): the picture looks blank (' + n + ' colors)');
      }
      if (errs.length) bad(world + ' (' + game + '): page errors: ' + errs.join(' | '));
    } catch (e) { bad(world + ' (' + game + '): ' + String(e.message || e).split('\n')[0].slice(0, 200)); }
    await ctx.close();
  }
  if (own) await own.close();
  fs.rmSync(dist, { recursive: true, force: true });
  if (!out.fails.length) out.oks.push('2.0 K shapes look: all 12 worlds (and the painted look, and a tower round) start, draw, and have no page errors; every game names a world with its painted pictures; every painted picture is there and small');
  return out;
};
