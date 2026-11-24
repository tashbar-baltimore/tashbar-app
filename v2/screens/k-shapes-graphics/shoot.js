/* Pictures of the Kindergarten Shapes games as a boy sees them (the REAL look, not the ?fast=1 test look).
   It reuses each unit's own test player (v2/tests/k-shapes-unitN.js), so every game mode is played the right way, but:
   - the game opens without ?fast=1 (full detail, real motion), the voice "speaks" for 250 ms and outside calls are refused;
   - waits are made longer (real motion takes real time);
   - a picture is taken each time the screen changes (start, lesson, watch, find, drop, mistake, end).
   Run:  node v2/screens/k-shapes-graphics/shoot.js <unit number> <out folder> <prefix> [game,game] [cb|phone|both]
   Not a test: its pass/fail lines are ignored. Takes about 6 minutes per game per size on a computer with no graphics card. */
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
    if (!want) {   /* the run we do not picture: play it fast, nothing is shown */
      const realPage = ctx.newPage.bind(ctx); ctx.newPage = async () => { const p = await realPage(); p.goto = async () => null; p.waitForFunction = async () => { throw new Error('skipped'); }; return p; };
      return ctx;
    }
    const realPage = ctx.newPage.bind(ctx);
    ctx.newPage = async () => {
      const pg = await realPage();
      await pg.addInitScript(() => { try { const s = window.speechSynthesis; s.speak = u => { setTimeout(() => { try { u.onstart && u.onstart(); } catch (e) {} }, 5); setTimeout(() => { try { u.onend && u.onend(); } catch (e) {} }, 250); }; s.cancel = () => {}; } catch (e) {} });
      let game = 'game', seen = {}, k = 0, stop = false, busy = false, drops = 0;
      const snap = async (tag) => { if (stop) return; const f = path.join(outDir, `${prefix}-${game}-${size}-${String(++k).padStart(2, '0')}-${tag}.png`); try { await pg.screenshot({ path: f }); console.log('  shot', path.basename(f)); } catch (e) {} };
      const goto = pg.goto.bind(pg);
      pg.goto = async (u, o2) => { game = (u.match(/k-shapes\/([a-z0-9-]+)\.html/) || [])[1] || game; const r = await goto(u.replace(/[?&]fast=1/, ''), o2);
        await pg.waitForTimeout(2500); await snap('start');
        (async function watch() {   /* a picture at each new screen */
          let last = '';
          while (!stop) {
            let s = null; try { s = await pg.evaluate(() => window.__shp && { n: window.__shp.name, d: window.__shp.done, j: !!document.querySelector('.judge.show') }); } catch (e) { return; }
            if (s) { const tag = s.d ? 'end' : s.j ? 'mistake' : s.n; if (tag !== last) { last = tag; seen[tag] = (seen[tag] || 0) + 1;
                if (seen[tag] <= 2 && !busy) { busy = true; await pg.waitForTimeout(tag === 'end' ? 700 : 1400); await snap(tag); if (tag === 'end') { await pg.waitForTimeout(3500); await snap('end-stars'); } busy = false; } } }
            await pg.waitForTimeout(300);
          }
        })();
        return r; };
      const wf = pg.waitForFunction.bind(pg); pg.waitForFunction = (f, a, o2) => wf(f, a, Object.assign({}, o2, { timeout: Math.max(90000, ((o2 && o2.timeout) || 30000) * 8) }));
      const ws = pg.waitForSelector.bind(pg); pg.waitForSelector = (s, o2) => ws(s, Object.assign({}, o2, { timeout: 90000 }));
      const wt = pg.waitForTimeout.bind(pg); pg.waitForTimeout = ms => wt(ms * 5);
      const up = pg.mouse.up.bind(pg.mouse); pg.mouse.up = async (o2) => { const r = await up(o2); if (drops++ < 2) { await wt(900); await snap('drop'); } return r; };
      const close = ctx.close.bind(ctx); ctx.close = async () => { stop = true; return close(); };
      return pg;
    };
    return ctx;
  };
  return b;
};
const t0 = Date.now();
require(path.join(__dirname, '..', '..', 'tests', 'k-shapes-unit' + unit + '.js'))(null).then(r => { console.log('done in', Math.round((Date.now() - t0) / 1000), 's; (test lines ignored:', r.fails.length, ')'); process.exit(0); });
