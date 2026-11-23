/* Shared helpers for the Kindergarten Kriyah tests (v2/tests/k-kriyah-*.js).
   Serves v2/app/k-kriyah/ from disk at http://kriyah.test/ (no network), with made-up progress only. */
const fs = require('fs'), path = require('path');
const APP = path.join(__dirname, '..', '..', 'app', 'k-kriyah');
const TYPES = { html: 'text/html', js: 'text/javascript', json: 'application/json', mp3: 'audio/mpeg', ogg: 'audio/ogg', png: 'image/png' };
const VIEW = { chromebook: { width: 1366, height: 768 }, phone: { width: 390, height: 844 } };

async function open(browser, { view = 'chromebook', save = null, url = 'index.html?fast=1', touch = false } = {}) {
  const ctx = await browser.newContext({ viewport: VIEW[view] || view, hasTouch: touch || view === 'phone', isMobile: false });
  if (save) await ctx.addInitScript(s => { try { if (!sessionStorage.getItem('kk-seeded')) { localStorage.setItem('tl2:k-kriyah', JSON.stringify(s)); sessionStorage.setItem('kk-seeded', '1'); } } catch (e) {} }, save);
  const pg = await ctx.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push('page error: ' + String(e).slice(0, 240)));
  pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('console error: ' + m.text().slice(0, 240)); });
  await pg.route('**/*', r => {
    const u = new URL(r.request().url()); if (u.host !== 'kriyah.test') return r.abort();
    const f = path.join(APP, decodeURIComponent(u.pathname).replace(/^\/+/, '') || 'index.html');
    if (!f.startsWith(APP) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({ status: 404, body: '' });
    r.fulfill({ contentType: TYPES[path.extname(f).slice(1)] || 'application/octet-stream', body: fs.readFileSync(f) });
  });
  await pg.goto('http://kriyah.test/' + url);
  return { ctx, pg, errs };
}
/* progress where every game before `id` is passed with 3 stars */
function passedBefore(id) { const ids = ['u1g0', 'u1g1', 'u1g2', 'u1g3', 'u1g4', 'u1g5', 'u1g6']; const games = {}; for (const g of ids) { if (g === id) break; games[g] = { stars: 3, last: 3, plays: 1 }; } return { games }; }
/* is the 3D canvas really drawn (not blank)? counts distinct colours in a grid of samples */
async function canvasColours(pg) {
  return pg.evaluate(() => { const c = document.querySelector('#c'); if (!c) return 0; const g = c.getContext('webgl2') || c.getContext('webgl'); if (!g) return 0;
    const w = g.drawingBufferWidth, h = g.drawingBufferHeight, px = new Uint8Array(4), seen = new Set();
    for (let i = 1; i < 12; i++) for (let j = 1; j < 12; j++) { g.readPixels(Math.floor(w * i / 12), Math.floor(h * j / 12), 1, 1, g.RGBA, g.UNSIGNED_BYTE, px); seen.add((px[0] >> 4) + ',' + (px[1] >> 4) + ',' + (px[2] >> 4)); }
    return seen.size; });
}
async function startGame(pg) { await pg.waitForSelector('body[data-start-ready]', { timeout: 120000 }); await pg.waitForTimeout(400); await pg.click('#start', { force: true }); }
const info = pg => pg.evaluate(() => window.__info && window.__info());
async function drag(pg, [fx, fy], [tx, ty]) { await pg.mouse.move(fx, fy); await pg.mouse.down(); await pg.mouse.move(tx, ty, { steps: 8 }); await pg.mouse.up(); }
async function until(pg, fn, ms = 60000, step = 150) { const t = Date.now(); while (Date.now() - t < ms) { const v = await pg.evaluate(fn).catch(() => null); if (v) return v; await pg.waitForTimeout(step); } return null; }
const saved = pg => pg.evaluate(() => { try { return JSON.parse(localStorage.getItem('tl2:k-kriyah') || '{}'); } catch (e) { return {}; } });
const SHOTS = path.join(__dirname, '..', '..', 'screens', 'k-kriyah');
async function shot(pg, name) { if (!process.env.KK_SHOTS) return; fs.mkdirSync(SHOTS, { recursive: true }); await pg.screenshot({ path: path.join(SHOTS, name + '.png') }); }
/* the games need 3D: if the shared test browser has no WebGL, use our own Chromium with software 3D (SwiftShader) */
let ownGL = null;
async function glBrowser(browser) {
  const ok = async b => { const c = await b.newContext(); const p = await c.newPage(); const r = await p.evaluate(() => { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }).catch(() => false); await c.close(); return r; };
  if (await ok(browser)) return browser;
  if (!ownGL) ownGL = await require('playwright').chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  return ownGL;
}
module.exports = { glBrowser, open, passedBefore, canvasColours, startGame, info, drag, until, saved, shot, VIEW };

/* One test for one game: it loads, shows real 3D (not blank), handles a wrong answer kindly, can be won, saves, and opens the next game.
   KK_VIEW=phone plays it at phone size; KK_SHOTS=1 also saves the pictures in v2/screens/k-kriyah/. */
function gameTest(id, kind, label) {
  return async browser0 => {
    const browser = await glBrowser(browser0);
    const fails = [], oks = [], P = require('./players.js'), view = process.env.KK_VIEW || 'chromebook', tag = 'k-kriyah ' + id + ' (' + label + ', ' + view + ')';
    const { ctx, pg, errs } = await open(browser, { view, save: passedBefore(id), url: 'play.html?g=' + id + '&fast=1' });
    const log = {}; const shotF = n => shot(pg, id + '-' + view + '-' + n);
    try {
      await startGame(pg); await pg.waitForSelector('body[data-drawn]', { timeout: 60000 }); await pg.waitForTimeout(800);
      const col = await canvasColours(pg); if (col >= 12) oks.push(tag + ': loads and shows real 3D (' + col + ' colours on screen)'); else fails.push(tag + ': the screen looks blank (' + col + ' colours)');
      await P[kind](pg, shotF, log);
      await pg.waitForSelector('#endbar.show', { timeout: 60000 }); await pg.waitForTimeout(300); await shotF('4-end');
      const stars = Number(await pg.evaluate(() => document.body.dataset.stars));
      if (stars >= 2) oks.push(tag + ': can be won (' + stars + ' stars, after one mistake)'); else fails.push(tag + ': could not be won (' + stars + ' stars)');
      if (log.wrongHandled) oks.push(tag + ': a wrong answer gets a kind correction'); else fails.push(tag + ': a wrong answer was not handled');
      const sv = await saved(pg); if (sv.games && sv.games[id] && sv.games[id].stars === stars) oks.push(tag + ': saves the stars'); else fails.push(tag + ': stars were not saved');
      errs.forEach(e => fails.push(tag + ': ' + e));
      await ctx.close();
      /* the path: the next game is open now */
      const ids = ['u1g0', 'u1g1', 'u1g2', 'u1g3', 'u1g4', 'u1g5', 'u1g6'], nx = ids[ids.indexOf(id) + 1];
      if (nx) { const o = await open(browser, { view, save: sv, url: 'index.html?fast=1' }); await o.pg.waitForSelector('body[data-ready]', { timeout: 90000 });
        const st = (await info(o.pg)).stops.find(s => s.id === nx); const want = nx === 'u1g6' ? stars >= 3 : true;
        if (!!(st && st.open) === want) oks.push(tag + ': the next stone (' + nx + ') is ' + (want ? 'open' : 'still locked (bonus needs 3 stars)')); else fails.push(tag + ': the next stone ' + nx + ' did not ' + (want ? 'open' : 'stay locked'));
        o.errs.forEach(e => fails.push(tag + ' path: ' + e)); await o.ctx.close(); }
    } catch (e) { fails.push(tag + ': ' + String(e).slice(0, 200)); errs.forEach(x => fails.push(tag + ': ' + x)); try { await shotF('x-stuck'); } catch (x) {} await ctx.close().catch(() => {}); }
    return { fails, oks };
  };
}
module.exports.gameTest = gameTest;
