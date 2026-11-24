/* Pictures of the Kindergarten Shapes games as a boy sees them (the full look).
   It reuses each unit's own test player (v2/tests/k-shapes-unitN.js), so every game mode is played the right way, but:
   - the game opens with ?fast=1&shot=1: test speed, but the full look (full detail, glow, painted world, confetti);
     it is drawn only while a picture is taken (a computer with no graphics card is slow to draw);
   - just before the made-up boy acts (taps, drags, answers), and at the end, a picture is taken when the screen is new
     (start, lesson, find, drop, mistake, end). The game waits for the boy at those moments, so the picture is what he sees.
   Run:  node v2/screens/k-shapes-graphics/shoot.js <unit number> <out folder> <prefix> [game,game] [cb|phone|both]
   Not a test: its pass/fail lines are ignored. */
const path = require('path'), fs = require('fs');
const [unit, outDir, prefix, only, sizes = 'both'] = process.argv.slice(2);
if (only) process.env.KSHAPES_ONLY = only;
fs.mkdirSync(outDir, { recursive: true });
const pw = require('playwright'), realLaunch = pw.chromium.launch.bind(pw.chromium);
let ctxN = 0;
pw.chromium.launch = async (o) => {
  const b = await realLaunch(o), realCtx = b.newContext.bind(b);
  b.newContext = async (co) => {
    const n = ctxN++, w = co.viewport.width, size = w < 600 ? 'phone' : 'chromebook';
    /* the tests play each game: Chromebook with mistakes, Chromebook perfect, phone. Pictures: the first Chromebook and the phone run. */
    const want = (n % 3 === 0 && sizes !== 'phone') || (n % 3 === 2 && sizes !== 'cb');
    const ctx = await realCtx(co);
    const realPage = ctx.newPage.bind(ctx);
    if (!want) { ctx.newPage = async () => { const p = await realPage(); p.goto = async () => null; p.waitForFunction = async () => { throw new Error('skipped'); }; return p; }; return ctx; }
    ctx.newPage = async () => {
      const pg = await realPage();
      let game = 'game', k = 0, last = '', drops = 0, seen = {};
      const snap = async (tag) => { const f = path.join(outDir, `${prefix}-${game}-${size}-${String(++k).padStart(2, '0')}-${tag}.png`);
        try { await pg.evaluate(() => { window.__shotDraw = true; }); await pg.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r)))));
          await pg.screenshot({ path: f, timeout: 240000 }); console.log('  shot', path.basename(f)); } catch (e) { console.log('  (no picture', tag, String(e).slice(0, 80), ')'); }
        try { await pg.evaluate(() => { window.__shotDraw = false; }); } catch (e) {} };
      const state = async () => { try { return await pg.evaluate(() => window.__shp && (window.__shp.done ? 'end' : document.querySelector('.judge.show') ? 'mistake' : window.__shp.name)); } catch (e) { return null; } };
      const before = async () => { const t = await state(); if (t && t !== last) { last = t; seen[t] = (seen[t] || 0) + 1; if (seen[t] <= 2) { await pg.waitForTimeout(t === 'mistake' ? 3000 : 400); await snap(t); } } };
      const goto = pg.goto.bind(pg);
      pg.goto = async (u, o2) => { game = (u.match(/k-shapes\/([a-z0-9-]+)\.html/) || [])[1] || game; const r = await goto(u.replace('fast=1', 'fast=1&shot=1'), o2);
        await pg.waitForTimeout(2500); await snap('start'); last = 'start'; return r; };
      const M = pg.mouse, down = M.down.bind(M), up = M.up.bind(M), click = M.click.bind(M), pclick = pg.click.bind(pg);
      M.down = async (o2) => { await before(); return down(o2); };
      M.click = async (x, y, o2) => { await before(); return click(x, y, o2); };
      M.up = async (o2) => { const r = await up(o2); if (drops++ < 2 && last === 'find') { await pg.waitForTimeout(300); await snap('drop'); } return r; };
      pg.click = async (sel, o2) => { await before(); return pclick(sel, o2); };
      const wf = pg.waitForFunction.bind(pg); pg.waitForFunction = (f, a, o2) => wf(f, a, Object.assign({}, o2, { timeout: Math.max(60000, ((o2 && o2.timeout) || 30000) * 3) }));
      const close = ctx.close.bind(ctx); ctx.close = async () => { const t = await state(); if (t === 'end') { await pg.waitForTimeout(700); await snap('end'); } return close(); };
      return pg;
    };
    return ctx;
  };
  return b;
};
const t0 = Date.now();
process.on('unhandledRejection', e => console.log('  (ignored)', String(e).split('\n')[0].slice(0, 160)));
require(path.join(__dirname, '..', '..', 'tests', 'k-shapes-unit' + unit + '.js'))(null).then(r => { console.log('done in', Math.round((Date.now() - t0) / 1000), 's; test lines (ignored):', JSON.stringify(r.fails).slice(0, 1500)); process.exit(0); });
