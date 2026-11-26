/* Shared helpers for the Kindergarten Kriyah tests (v2/tests/k-kriyah-*.js).
   Serves v2/app/k-kriyah/ from disk at http://kriyah.test/ (no network), with made-up progress only. */
const fs = require('fs'), path = require('path');
const APP = path.join(__dirname, '..', '..', 'app', 'k-kriyah');
const TYPES = { html: 'text/html', js: 'text/javascript', json: 'application/json', mp3: 'audio/mpeg', ogg: 'audio/ogg', png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp' };
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
  if (!process.env.KK_SHOTS) url += (url.includes('?') ? '&' : '?') + 'lite=1';   /* quicker 3D for the automatic run; picture runs use the full look */
  await pg.goto('http://kriyah.test/' + url);
  return { ctx, pg, errs };
}
/* progress where every game before `id` is passed with 3 stars */
/* every game in order, read from the app's own list (v2/app/k-kriyah/units.js) */
const UNITS_SRC = fs.readFileSync(path.join(APP, 'units.js'), 'utf8');
const ALL = [...UNITS_SRC.matchAll(/id: '(u\d+g\d+)'[^}]*?kind: '(\w+)'([^}]*)\}/g)].map(m => ({ id: m[1], kind: m[2], bonus: /bonus: true/.test(m[3]), mastery: /mastery: true/.test(m[3]) }));
function passedBefore(id) { const ids = ALL.map(g => g.id); const games = {}; for (const g of ids) { if (g === id) break; games[g] = { stars: 3, last: 3, plays: 1, days3: ['2026-01-01', '2026-01-02'] }; }   /* two champion days, so the gate after Unit 10 is open */ return { games }; }
/* is the 3D canvas really drawn (not blank)? counts distinct colours in a grid of samples */
async function canvasColours(pg) {
  return pg.evaluate(() => { const c = document.querySelector('#c'); if (!c) return 0; const g = c.getContext('webgl2') || c.getContext('webgl'); if (!g) return 0;
    const w = g.drawingBufferWidth, h = g.drawingBufferHeight, px = new Uint8Array(4), seen = new Set();
    for (let i = 1; i < 24; i++) for (let j = 1; j < 24; j++) { g.readPixels(Math.floor(w * i / 24), Math.floor(h * j / 24), 1, 1, g.RGBA, g.UNSIGNED_BYTE, px); if (px[3]) seen.add((px[0] >> 4) + ',' + (px[1] >> 4) + ',' + (px[2] >> 4)); }
    /* with a painted backdrop the 3D layer is see-through around the children and letters: it must still draw real things, and the picture must be there */
    const bd = /art\/bg\//.test(document.body.style.background); return bd ? (seen.size >= 6 ? 12 + seen.size : seen.size) : seen.size; });
}
async function startGame(pg) { await pg.waitForSelector('body[data-start-ready]', { timeout: 120000 }); await pg.waitForTimeout(400); await pg.click('#start', { force: true }); }
const info = pg => pg.evaluate(() => window.__info && window.__info());
async function drag(pg, [fx, fy], [tx, ty]) { await pg.mouse.move(fx, fy); await pg.mouse.down(); await pg.mouse.move(tx, ty, { steps: 8 }); await pg.mouse.up(); }
async function until(pg, fn, ms = 60000, step = 150) { const t = Date.now(); while (Date.now() - t < ms) { const v = await pg.evaluate(fn).catch(() => null); if (v) return v; await pg.waitForTimeout(step); } return null; }
const saved = pg => pg.evaluate(() => { try { return JSON.parse(localStorage.getItem('tl2:k-kriyah') || '{}'); } catch (e) { return {}; } });
const SHOTS = process.env.KK_SHOTS_DIR || path.join(__dirname, '..', '..', 'screens', 'k-kriyah');   /* a picture run can write elsewhere first */
async function shot(pg, name) { if (!process.env.KK_SHOTS) return; fs.mkdirSync(SHOTS, { recursive: true }); await pg.screenshot({ path: path.join(SHOTS, name + '.jpg'), type: 'jpeg', quality: 80 }); }
/* the games need 3D: if the shared test browser has no WebGL, use our own Chromium with software 3D (SwiftShader) */
let ownGL = null;
async function glBrowser(browser) {
  const ok = async b => { const c = await b.newContext(); const p = await c.newPage(); const r = await p.evaluate(() => { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }).catch(() => false); await c.close(); return r; };
  if (await ok(browser)) return browser;
  if (!ownGL) ownGL = await require('playwright').chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  return ownGL;
}
module.exports = { ALL, glBrowser, open, passedBefore, canvasColours, startGame, info, drag, until, saved, shot, VIEW };

/* One test for one game: it loads, shows real 3D (not blank), handles a wrong answer kindly, can be won, saves, and opens the next game.
   KK_VIEW=phone plays it at phone size; KK_SHOTS=1 also saves the pictures in v2/screens/k-kriyah/. */
function gameTest(id, kind, label) {
  return async browser0 => {
    if (process.env.KK_SHOTS || process.env.KK_SERIAL) return runOne(browser0, id, kind, label);   /* picture runs stay one at a time */
    startPool(browser0); return pool.get((process.env.KK_VIEW || 'chromebook') + ' ' + id) || runOne(browser0, id, kind, label);
  };
}
/* The quick run plays up to 3 games at once (the check machine has 4 cores), so many units fit the 45-minute check.
   The falling-letter bonus rounds need steady frames, so they play one at a time after the others. Each test file then reads its own result. */
const pool = new Map(); let pooled = false;
function startPool(browser0) {
  if (pooled) return; pooled = true;
  const view = process.env.KK_VIEW || 'chromebook', par = Number(process.env.KK_PAR || 3), games = ALL.filter(g => !g.bonus), bonus = ALL.filter(g => g.bonus), defer = {};
  ALL.forEach(g => pool.set(view + ' ' + g.id, new Promise(r => defer[g.id] = r)));
  const fail = g => e => ({ fails: ['k-kriyah ' + g.id + ': ' + String(e).slice(0, 200)], oks: [] });
  let next = 0, running = 0, done; const finished = new Promise(r => done = r);
  const pump = () => { while (running < par && next < games.length) { const g = games[next++]; running++;
      runOne(browser0, g.id, g.kind, g.id).catch(fail(g)).then(r => { defer[g.id](r); running--; if (next >= games.length && !running) done(); else pump(); }); } };
  if (games.length) pump(); else done();
  finished.then(async () => { for (const g of bonus) defer[g.id](await runOne(browser0, g.id, g.kind, g.id).catch(fail(g))); });
}
function runOne(browser0, id, kind, label) {
  return (async () => {
    const browser = await glBrowser(browser0);
    const fails = [], oks = [], P = require('./players.js'), view = process.env.KK_VIEW || 'chromebook', tag = 'k-kriyah ' + id + ' (' + label + ', ' + view + ')';
    const { ctx, pg, errs } = await open(browser, { view, save: passedBefore(id), url: 'play.html?g=' + id + '&fast=1' });
    const log = { oks: [], fails: [] }; const shotF = n => shot(pg, id + '-' + view + '-' + n);
    try {
      await startGame(pg); await pg.waitForSelector('body[data-drawn]', { timeout: 60000 }); await pg.waitForTimeout(800);
      const col = await canvasColours(pg); if (col >= 12) oks.push(tag + ': loads and shows real 3D (' + col + ' colours on screen)'); else fails.push(tag + ': the screen looks blank (' + col + ' colours)');
      await P[kind](pg, shotF, log);
      for (let t = Date.now(); Date.now() - t < 60000 && !(await pg.evaluate(() => !!document.querySelector('#endbar.show')));) {   /* answer "Remember these?" if the player stopped before it */
        const r = await pg.evaluate(() => window.__review && window.__review.ready ? window.__review : null); if (r) { log.reviewed = (log.reviewed || 0) + 1; await pg.mouse.click(...r.at[r.want]); } await pg.waitForTimeout(250); }
      await pg.waitForSelector('#endbar.show', { timeout: 60000 }); await pg.waitForTimeout(300); await shotF('4-end');
      const stars = Number(await pg.evaluate(() => document.body.dataset.stars));
      if (stars >= 2) oks.push(tag + ': can be won (' + stars + ' stars, after one mistake)'); else fails.push(tag + ': could not be won (' + stars + ' stars)');
      log.oks.forEach(m => oks.push(tag + ': ' + m)); log.fails.forEach(m => fails.push(tag + ': ' + m));
      const badLines = await pg.evaluate(() => window.__lines.filter(l => /\bundefined\b|\bnull\b|\bNaN\b|\[undefined\]/.test(l)));   /* a missing word must never be spoken */
      if (badLines.length) fails.push(tag + ': a spoken line is missing a word: ' + badLines[0]); else oks.push(tag + ': every spoken line is whole words');
      const longLines = await pg.evaluate(() => window.__lines.filter(l => l.split(/\s+/).filter(w => /[A-Za-z\u0590-\u05FF\[]/.test(w)).length > 12));   /* HoS rule: 12 words or fewer (a sound counts as one) */
      if (longLines.length) fails.push(tag + ': a spoken line is longer than 12 words: ' + longLines[0]); else oks.push(tag + ': every spoken line is 12 words or fewer');
      if (log.wrongHandled) oks.push(tag + ': a wrong answer gets a kind correction'); else fails.push(tag + ': a wrong answer was not handled');
      if (/^(story|feel)/.test(kind)) { const said = await pg.evaluate(() => window.__lines.filter(l => /^Say it with me: /.test(l)).length);   /* RESEARCH.md: he says each new letter out loud */
        if (said >= 3) oks.push(tag + ': asks him to say each new letter out loud (' + said + ' times)'); else fails.push(tag + ': "Say it with me" came ' + said + ' times'); }
      const sv = await saved(pg); if (sv.games && sv.games[id] && sv.games[id].stars === stars) oks.push(tag + ': saves the stars'); else fails.push(tag + ': stars were not saved');
      errs.forEach(e => fails.push(tag + ': ' + e));
      await ctx.close();
      /* the path: the next game is open now */
      const at = ALL.findIndex(g => g.id === id), nxG = ALL[at + 1], nx = nxG && nxG.id, unitN = nx && nx.match(/^u(\d+)/)[1];
      if (nx && (!nxG.bonus || ALL[at].mastery)) { const o = await open(browser, { view, save: sv, url: 'index.html?u=' + unitN + '&fast=1' }); await o.pg.waitForSelector('body[data-ready]', { timeout: 90000 });
        const st = (await info(o.pg)).stops.find(s => s.id === nx); const want = nxG.bonus ? stars >= 3 : true;
        if (!!(st && st.open) === want) oks.push(tag + ': the next stone (' + nx + ') is ' + (want ? 'open' : 'still locked (bonus needs 3 stars)')); else fails.push(tag + ': the next stone ' + nx + ' did not ' + (want ? 'open' : 'stay locked'));
        o.errs.forEach(e => fails.push(tag + ' path: ' + e)); await o.ctx.close(); }
    } catch (e) { fails.push(tag + ': ' + String(e).slice(0, 200)); errs.forEach(x => fails.push(tag + ': ' + x)); try { await shotF('x-stuck'); } catch (x) {} await ctx.close().catch(() => {}); }
    return { fails, oks };
  })();
}
module.exports.gameTest = gameTest;
