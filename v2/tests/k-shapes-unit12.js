/* 2.0 TEST (v2/tests/, run by tests/run.js): Kindergarten Shapes, Reviews (Shape party 1-3) and Unit 12 (Graduation day) (v2/app/k-shapes/): Shape party 1, 2, 3 and Graduation day.
   Builds v2/, opens each game with ?fast=1 (no waiting for the voice or motion) and plays it as a made-up boy:
   the 3D picture really draws (not blank); in the lesson he taps the corners (or the circle); a boy who does nothing gets a reminder;
   a wrong piece is explained and goes back, and after 2 mistakes the rule is taught again; every right piece goes into its box (by drag,
   and by tap where there is one box); find the mistake (a wrong answer is explained, then the right one, and he shows the corners);
   stars match the mistakes; a boy with no mistakes gets the bonus round and 3 stars; spoken lines are 12 words or fewer; no "bite";
   buttons are big and on screen. Chromebook size plays every game twice (with mistakes, then perfect); phone size plays each once.
   Returns { fails, oks }. */
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const R = path.join(__dirname, '..', '..');
const GAMES = (process.env.KSHAPES_ONLY || 'shape-party-1,shape-party-2,shape-party-3,graduation').split(',');
module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 K shapes reviews and graduation: ' + m);
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'v2ku12-'));
  try { cp.execFileSync(process.execPath, [path.join(R, 'v2', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: dist }), stdio: 'pipe' }); }
  catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
  for (const f of [...GAMES.map(g => g + '.html'), 'kit.js', 'kit.css', 'lib/three.module.min.js', 'lib/RoomEnvironment.js', 'lib/RoundedBoxGeometry.js'])
    if (!fs.existsSync(path.join(dist, 'k-shapes', f))) { bad(f + ' is not in the built site'); return out; }
  /* a 3D game needs WebGL: test machines have no graphics card, so open our own browser with the software renderer switched on */
  let own = null;
  try { own = await require('playwright').chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); browser = own; } catch (e) {}

  async function play(game, w, h, label, perfect) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }), pg = await ctx.newPage(), errs = [];
    const L = game + ' (' + label + (perfect ? ', no mistakes' : '') + ')';
    pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await pg.route('**/*', r => { const u = new URL(r.request().url());
      if (u.host === 'v2.test') { const f = path.join(dist, u.pathname.slice(1)); if (f.startsWith(dist) && fs.existsSync(f)) return r.fulfill({ path: f }); return r.fulfill({ status: 404, body: '' }); }
      return r.abort(); });
    const S = () => pg.evaluate(() => window.__shp);
    const drawn = async (what) => {
      const n = await pg.evaluate(() => { const c = document.getElementById('view'), g = document.createElement('canvas'); g.width = 64; g.height = 64;
        const x = g.getContext('2d'); x.drawImage(c, 0, 0, 64, 64); const d = x.getImageData(0, 0, 64, 64).data, seen = new Set();
        for (let i = 0; i < d.length; i += 4) seen.add((d[i] >> 4) + ',' + (d[i + 1] >> 4) + ',' + (d[i + 2] >> 4)); return seen.size; });
      if (n < 12) bad(L + ': "' + what + '" looks blank (' + n + ' colors)');
    };
    const drag = async (id, box) => {
      const a = await pg.evaluate(i => window.__shp.shapePt(i), id), b = await pg.evaluate(i => window.__shp.boxPt(i), box);
      await pg.mouse.move(a.x, a.y); await pg.mouse.down(); await pg.mouse.move(a.x + 15, a.y + 15, { steps: 3 });
      await pg.mouse.move(b.x, b.y, { steps: 8 }); await pg.mouse.up(); await pg.waitForTimeout(80);
    };
    const onRug = id => pg.evaluate(i => window.__shp.list().some(x => x.id === i), id);
    const into = async (id, box) => {   /* a right piece must end up in its box; a missed drag on a slow machine is tried again */
      for (let t = 0; t < 3; t++) {
        await pg.waitForFunction(i => { const s = window.__shp.list().find(x => x.id === i); return !s || !s.busy; }, id, { timeout: 5000 }).catch(() => {});
        if (!(await onRug(id))) return;
        await drag(id, box); await pg.waitForTimeout(150 + t * 300);
      }
      if (await onRug(id)) bad(L + ': ' + id + ' would not go into its box: ' + JSON.stringify(await pg.evaluate(() => ({ name: window.__shp.name, said: window.__shp.said.slice(-3) }))));
    };
    const tapCorners = async (what) => {
      await pg.waitForFunction(() => window.__shp.cornerPts().length > 0, null, { timeout: 15000 }).catch(() => bad(L + ': ' + what + ': no corners to tap'));
      const n0 = (await S()).cornerTaps || 0, n = (await pg.evaluate(() => window.__shp.cornerPts())).length;
      for (let i = 0; i < n; i++) { const pts = await pg.evaluate(() => window.__shp.cornerPts()); if (!pts.length) break; await pg.mouse.click(pts[0].x, pts[0].y); await pg.waitForTimeout(60); }
      if (((await S()).cornerTaps || 0) - n0 !== n) bad(L + ': ' + what + ': tapping the corners did not count them');
    };
    /* the lesson: tap what it asks (corners, or the circle) until the game begins */
    const lesson = async () => {
      for (let guard = 0; guard < 20; guard++) {
        await pg.waitForFunction(() => window.__shp.name === 'find' || (window.__shp.name === 'tap' && window.__shp.waitingTap()), null, { timeout: 30000 });
        if ((await S()).name === 'find') return;
        if ((await pg.evaluate(() => window.__shp.cornerPts().length)) > 0) await tapCorners('the lesson');
        else { const p = await pg.evaluate(() => window.__shp.tapTarget()); if (p) { await pg.mouse.click(p.x, p.y); await pg.waitForTimeout(150); } }
        await pg.waitForFunction(() => window.__shp.name !== 'tap', null, { timeout: 15000 }).catch(() => bad(L + ': the lesson waits forever for a tap'));
      }
    };
    try {
      await pg.goto('http://v2.test/k-shapes/' + game + '.html?fast=1');
      if (!(await pg.waitForFunction(() => window.__shp && window.__shp.ready, null, { timeout: 15000 }).then(() => true).catch(() => false))) {
        bad(L + ': the 3D game did not start' + (errs.length ? ': ' + errs.join(' | ') : '')); await ctx.close(); return; }
      await pg.waitForTimeout(150); await drawn('start');
      await pg.click('#start', { force: true });
      await lesson();
      let st = await S();
      if (!st.said.some(t => /watch me/i.test(t))) bad(L + ': there is no "watch me" before he tries');
      if (st.hasChant && !(st.claps >= 6)) bad(L + ': the clap chant did not play');
      await drawn('the game');
      if (!perfect) {
        await pg.evaluate(() => window.__shp.idleNow()); await pg.waitForTimeout(80);
        if (!((await S()).reminders > 0)) bad(L + ': a boy who does nothing gets no reminder');
      }
      /* play every round: with mistakes, the first two tries are wrong (a wrong piece, or a right piece in the wrong box) */
      let wrongs = 0, sawBonus = false;
      for (let guard = 0; guard < 80; guard++) {
        const st0 = await S();
        if (st0.name === 'mistake') break;
        if (st0.name === 'bonus') sawBonus = true;
        const list = await pg.evaluate(() => window.__shp.list().filter(x => !x.busy));
        if (!['find', 'bonus'].includes(st0.name) || !list.length) { await pg.waitForTimeout(150); continue; }
        if (!perfect && wrongs < 2 && st0.name === 'find') {
          const nb = st0.nb || 1, w = list.find(x => x.box < 0), r = list.find(x => x.box >= 0);
          const [id, box] = w ? [w.id, 0] : nb > 1 && r ? [r.id, (r.box + 1) % nb] : [null, 0];
          if (id) {
            const said0 = st0.said.length, m0 = st0.misses;
            await drag(id, box); await pg.waitForTimeout(250); wrongs++;
            const st = await S();
            if (st.misses !== m0 + 1) bad(L + ': a wrong try was not counted as a mistake');
            if (!st.said.slice(said0).some(t => /^(That is|That shape|Look closely|This shape|Count again|Look\. It has|Too short|Too long|That stick)/.test(t))) bad(L + ': a wrong try is not explained: ' + JSON.stringify(st.said.slice(said0)));
            await pg.waitForTimeout(300); continue;
          }
        }
        const r = list.find(x => x.box >= 0);
        if (r) await into(r.id, r.box); else await pg.waitForTimeout(150);
      }
      if (!perfect && !(await S()).said.some(t => /^Remember/.test(t))) bad(L + ': after 2 mistakes the rule is not taught again');
      if (perfect && (await S()).hasBonus && !sawBonus) bad(L + ': a boy with no mistakes gets no bonus round');
      await pg.waitForFunction(() => window.__shp.name === 'mistake', null, { timeout: 20000 });
      await pg.waitForSelector('.judge.show', { timeout: 15000 }); await drawn('find the mistake');
      if (!perfect) {
        const m0 = (await S()).misses;
        await pg.click(await pg.evaluate(() => window.__shp.wrongSel), { force: true }); await pg.waitForTimeout(80);
        await pg.click(await pg.evaluate(() => window.__shp.wrongSel), { force: true }); await pg.waitForTimeout(80);
        if ((await S()).misses !== m0 + 1) bad(L + ': a wrong answer to the friend should cost one star, once');
      }
      await pg.click(await pg.evaluate(() => window.__shp.answerSel), { force: true });
      await pg.waitForTimeout(150);
      if ((await pg.evaluate(() => window.__shp.cornerPts().length)) > 0) await tapCorners('find the mistake');
      await pg.waitForFunction(() => window.__shp.done, null, { timeout: 20000 }).catch(() => bad(L + ': the game cannot be finished'));
      st = await S();
      const want = perfect ? 3 : 1;
      if (st.stars !== want) bad(L + ': expected ' + want + ' stars, got ' + st.stars + ' (' + st.misses + ' mistakes)');
      if (game === 'graduation' && !(await pg.$('#cert svg'))) bad(L + ': graduation shows no certificate');
      if ((await pg.$$('.star')).length !== 3) bad(L + ': the end screen does not show the stars');
      await drawn('the end');
      const btns = await pg.$$eval('button', b => b.filter(x => x.offsetParent !== null).map(x => { const r = x.getBoundingClientRect(); return [r.width, r.height, r.left, r.right, r.top, r.bottom]; }));
      if (btns.some(r => r[0] < 64 || r[1] < 64)) bad(L + ': a button is smaller than 64 pixels');
      if (btns.some(r => r[2] < -2 || r[3] > w + 2 || r[4] < -2 || r[5] > h + 2)) bad(L + ': a button is cut off the screen');
      const long = st.said.find(t => t.split(/\s+/).length > 12); if (long) bad(L + ': a spoken line is longer than 12 words: ' + long);
      if (st.said.some(t => /\bbite\b/i.test(t))) bad(L + ': the word "bite" is spoken');
      if (errs.length) bad(L + ': page errors: ' + errs.join(' | '));
    } catch (e) { let at = ''; try { at = await pg.evaluate(() => window.__shp.name); } catch (x) {} bad(L + ' (at ' + at + '): ' + String(e.message || e).split('\n')[0].slice(0, 200)); }
    await ctx.close();
  }
  for (const g of GAMES) { await play(g, 1366, 768, 'Chromebook', false); await play(g, 1366, 768, 'Chromebook', true); await play(g, 390, 844, 'phone', false); }
  if (own) await own.close();
  if (!out.fails.length) out.oks.push('2.0 K shapes reviews (3D): shape party 1, 2, 3 and graduation day each play to the end at Chromebook and phone size, with mistakes explained, a re-teach, the bonus round and find-the-mistake');
  fs.rmSync(dist, { recursive: true, force: true });
  return out;
};
