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
module.exports = { open, passedBefore, canvasColours, startGame, info, drag, until, saved, shot, VIEW };
