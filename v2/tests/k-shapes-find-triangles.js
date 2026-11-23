/* 2.0 TEST (v2/tests/, run by tests/run.js): Kindergarten Shapes, "Find the triangles" (v2/app/k-shapes/find-triangles.html), a 3D game.
   Builds v2/, opens the game at Chromebook size and phone size with ?fast=1 (no waiting for the voice or motion), and plays it as a made-up boy:
   the 3D picture really draws (many colors, not a blank screen); the lesson counts sides and corners and turns the triangle; "watch me"
   puts one triangle in the box; he drags a NOT-triangle to the box (it is explained, its corners are counted, it goes back); he drags every
   triangle in; find the mistake (a wrong "yes" is explained); the end shows stars; spoken lines are 12 words or fewer; no "bite".
   Returns { fails, oks }. */
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const R = path.join(__dirname, '..', '..');
module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 K shapes find-triangles: ' + m);
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'v2ktri-'));
  try { cp.execFileSync(process.execPath, [path.join(R, 'v2', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: dist }), stdio: 'pipe' }); }
  catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
  for (const f of ['find-triangles.html', 'lib/three.module.min.js', 'lib/RoomEnvironment.js', 'lib/RoundedBoxGeometry.js'])
    if (!fs.existsSync(path.join(dist, 'k-shapes', f))) { bad(f + ' is not in the built site'); return out; }

  async function playAt(w, h, label) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }), pg = await ctx.newPage(), errs = [];
    pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await pg.route('**/*', r => { const u = new URL(r.request().url());
      if (u.host === 'v2.test') { const f = path.join(dist, u.pathname.slice(1)); if (f.startsWith(dist) && fs.existsSync(f)) return r.fulfill({ path: f }); return r.fulfill({ status: 404, body: '' }); }
      return r.abort(); });
    const S = () => pg.evaluate(() => window.__shp);
    /* not blank: the 3D canvas must hold many different colors */
    const drawn = async (what) => {
      const n = await pg.evaluate(() => { const c = document.getElementById('view'), g = document.createElement('canvas'); g.width = 64; g.height = 64;
        const x = g.getContext('2d'); x.drawImage(c, 0, 0, 64, 64); const d = x.getImageData(0, 0, 64, 64).data, seen = new Set();
        for (let i = 0; i < d.length; i += 4) seen.add((d[i] >> 4) + ',' + (d[i + 1] >> 4) + ',' + (d[i + 2] >> 4)); return seen.size; });
      if (n < 12) bad(label + ': "' + what + '" looks blank (' + n + ' colors)');
    };
    const drag = async (id) => {
      const a = await pg.evaluate(i => window.__shp.shapePt(i), id), b = await pg.evaluate(() => window.__shp.boxPt());
      await pg.mouse.move(a.x, a.y); await pg.mouse.down(); await pg.mouse.move(a.x + 15, a.y + 15, { steps: 3 });
      await pg.mouse.move(b.x, b.y, { steps: 8 }); await pg.mouse.up(); await pg.waitForTimeout(80);
    };
    const tapCorners = async (what) => {
      await pg.waitForFunction(() => window.__shp.cornerPts().length === 3, null, { timeout: 15000 }).catch(() => bad(label + ': ' + what + ': the corners to tap did not appear'));
      const n0 = (await S()).cornerTaps || 0;
      for (let i = 0; i < 3; i++) { const pts = await pg.evaluate(() => window.__shp.cornerPts()); if (!pts.length) break; await pg.mouse.click(pts[0].x, pts[0].y); await pg.waitForTimeout(60); }
      if (((await S()).cornerTaps || 0) - n0 !== 3) bad(label + ': ' + what + ': tapping the 3 corners did not count them');
    };
    try {
      await pg.goto('http://v2.test/k-shapes/find-triangles.html?fast=1');
      const gl = await pg.waitForFunction(() => window.__shp && window.__shp.ready, null, { timeout: 15000 }).then(() => true).catch(() => false);
      if (!gl) { bad(label + ': the 3D game did not start' + (errs.length ? ': ' + errs.join(' | ') : '')); await ctx.close(); return; }
      await pg.waitForTimeout(150); await drawn('start');
      await pg.click('#start', { force: true });
      await pg.waitForFunction(() => window.__shp.name === 'tap', null, { timeout: 20000 });
      await drawn('tap the corners'); await tapCorners('the lesson');
      if (!(await S()).said.includes('One!')) bad(label + ': tapping a corner does not count out loud');
      await pg.waitForFunction(() => window.__shp.name === 'find', null, { timeout: 20000 });
      const said0 = (await S()).said;
      for (const want of [/count the sides/i, /count the corners/i, /upside down/i, /small, but still a triangle/i, /watch me/i])
        if (!said0.some(t => want.test(t))) bad(label + ': the lesson is missing "' + want.source + '"');
      if (!((await S()).claps >= 9)) bad(label + ': the clap chant did not play');
      await drawn('find the triangles');
      let list = await pg.evaluate(() => window.__shp.list());
      if (list.filter(s => s.tri).length !== 3 || list.filter(s => !s.tri).length !== 4) bad(label + ': should show 3 triangles and 4 other shapes, got ' + JSON.stringify(list));
      // a square into the box: explained, corners counted, it goes back
      await drag('sq'); await pg.waitForTimeout(100);
      let st = await S();
      if (!st.said.some(t => /that is a square/i.test(t)) || !st.said.includes('Four.')) bad(label + ': a square in the box is not explained');
      if (!(await pg.evaluate(() => window.__shp.list().some(s => s.id === 'sq')))) bad(label + ': the square stayed in the triangle box');
      // the curvy almost-triangle: explained
      await drag('cv'); await pg.waitForTimeout(100);
      if (!(await S()).said.some(t => /curvy/i.test(t))) bad(label + ': the curvy shape is not explained');
      if (!(await S()).said.some(t => /remember: a triangle has three corners/i.test(t))) bad(label + ': after 2 misses the rule is not taught again');
      for (const id of ['t2', 't3', 't4']) { await drag(id); await pg.waitForTimeout(100); }
      st = await S();
      if (st.found < 4) bad(label + ': not every triangle went into the box (found ' + st.found + ')');
      if (!st.said.some(t => /upside down is still a triangle/i.test(t))) bad(label + ': the upside-down triangle is not praised by its rule');
      await pg.waitForFunction(() => window.__shp.name === 'mistake', null, { timeout: 15000 });
      await pg.waitForSelector('.judge.show', { timeout: 15000 }); await drawn('find the mistake');
      await pg.click('.judge .yes', { force: true }); await pg.waitForTimeout(80);
      if (!(await S()).said.some(t => /count the corners/i.test(t) && /let us/i.test(t))) bad(label + ': a wrong "yes" is not explained');
      await pg.click('.judge .no', { force: true });
      await tapCorners('find the mistake');
      await pg.waitForFunction(() => window.__shp.done, null, { timeout: 15000 }).catch(() => bad(label + ': the game cannot be finished'));
      st = await S();
      if (st.stars !== 1) bad(label + ': three misses should give 1 star, got ' + st.stars);
      if ((await pg.$$('.star')).length !== 3) bad(label + ': the end screen does not show the stars');
      await drawn('the end');
      const btns = await pg.$$eval('button', b => b.filter(x => x.offsetParent !== null).map(x => { const r = x.getBoundingClientRect(); return [r.width, r.height, r.left, r.right, r.top, r.bottom]; }));
      if (btns.some(r => r[0] < 64 || r[1] < 64)) bad(label + ': a button is smaller than 64 pixels');
      if (btns.some(r => r[2] < -2 || r[3] > w + 2 || r[4] < -2 || r[5] > h + 2)) bad(label + ': a button is cut off the screen');
      if (st.said.some(t => t.split(/\s+/).length > 12)) bad(label + ': a spoken line is longer than 12 words: ' + st.said.find(t => t.split(/\s+/).length > 12));
      if (st.said.some(t => /\bbite\b/i.test(t))) bad(label + ': the word "bite" is spoken');
      // play again with no mistakes: 3 stars
      await pg.click('#replay', { force: true });
      await pg.waitForFunction(() => window.__shp.name === 'tap', null, { timeout: 20000 }); await tapCorners('the lesson, second game');
      await pg.waitForFunction(() => window.__shp.name === 'find' && window.__shp.misses === 0, null, { timeout: 20000 });
      for (const id of ['t2', 't3', 't4']) { await drag(id); await pg.waitForTimeout(100); }
      // no mistakes: the quick boy gets the bonus round (a miss there is explained but costs no star)
      await pg.waitForFunction(() => window.__shp.name === 'bonus' && window.__shp.list().some(s => s.id === 'tw'), null, { timeout: 15000 }).catch(() => bad(label + ': a boy with no mistakes gets no bonus round'));
      await drawn('bonus round'); await drag('hx'); await pg.waitForTimeout(100);
      if (!(await S()).said.some(t => /six corners/i.test(t))) bad(label + ': the hexagon in the bonus round is not explained');
      for (const id of ['tw', 'tk']) { await drag(id); await pg.waitForTimeout(100); }
      await pg.waitForSelector('.judge.show', { timeout: 15000 }); await pg.click('.judge .no', { force: true });
      await tapCorners('find the mistake, second game');
      await pg.waitForFunction(() => window.__shp.done && window.__shp.misses === 0, null, { timeout: 15000 }).catch(() => bad(label + ': the second game did not finish'));
      if ((await S()).stars !== 3) bad(label + ': a boy with no mistakes should get 3 stars');
      if (errs.length) bad(label + ': page errors: ' + errs.join(' | '));
    } catch (e) { let at = ''; try { at = await pg.evaluate(() => window.__shp.name); } catch (x) {} bad(label + ' (at ' + at + '): ' + String(e.message || e).split('\n')[0].slice(0, 200)); }
    await ctx.close();
  }
  /* a 3D game needs WebGL: test machines have no graphics card, so open our own browser with the software renderer switched on */
  let own = null;
  try { own = await require('playwright').chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); browser = own; } catch (e) {}
  await playAt(1366, 768, 'Chromebook');
  await playAt(390, 844, 'phone');
  if (own) await own.close();
  if (!out.fails.length) out.oks.push('2.0 K shapes "Find the triangles" (3D): draws, teaches sides and corners, wrong shapes are explained, plays to the end at Chromebook and phone size');
  fs.rmSync(dist, { recursive: true, force: true });
  return out;
};
