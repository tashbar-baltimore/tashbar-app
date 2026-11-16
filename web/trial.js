/* Stage 1 trial timing. Serves web/dist from this machine (gzip on, like a file host) with a pretend server API,
   and, with LIVE=1, also times the real live Apps Script link (sign-in pad only; nobody signs in). */
const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib'); const { chromium } = require('playwright');
const DIST = path.join(__dirname, 'dist'), LIVE = 'https://script.google.com/macros/s/AKfycbwcTw8upBIAN3n1D36TON-3u6_VQdo-6zLYJT_bMa11yeFwN9IhL_saGDciQP5QK70pEw/exec';
const srv = http.createServer((q, r) => {
  if (q.method === 'POST') { let b = ''; q.on('data', d => b += d); q.on('end', () => { let j = {}; try { j = JSON.parse(b); } catch (e) {} const res = j.fn === 'msBootstrap' ? { version: 't', students: [] } : null; r.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }); r.end(JSON.stringify({ ok: true, result: res })); }); return; }
  let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html'; const f = path.join(DIST, p); if (!f.startsWith(DIST) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  const type = f.endsWith('.html') ? 'text/html; charset=utf-8' : f.endsWith('.json') ? 'application/json' : 'application/javascript; charset=utf-8';
  r.writeHead(200, { 'Content-Type': type, 'Content-Encoding': 'gzip', 'Cache-Control': /\/parts\/.*\.js$/.test(p) ? 'public, max-age=31536000, immutable' : 'no-cache' }); r.end(zlib.gzipSync(fs.readFileSync(f)));
});
const pad = () => [...document.querySelectorAll('button')].some(b => /^\s*[0-9]\s*$/.test(b.textContent));
async function time(browser, url, label, frames) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } }); const out = [];
  for (const visit of ['first visit', 'second visit']) { const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 120)));
    const cdp = await ctx.newCDPSession(pg); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); const t0 = Date.now(); await pg.goto(url, { waitUntil: 'commit', timeout: 60000 });
    let padMs = null; const end = Date.now() + 60000; while (Date.now() < end && padMs === null) { for (const f of pg.frames()) { try { if (await f.evaluate(pad)) { padMs = Date.now() - t0; break; } } catch (e) {} } if (padMs === null) await pg.waitForTimeout(50); }
    let lessonsMs = null; const end2 = Date.now() + 120000; while (Date.now() < end2 && lessonsMs === null) { for (const f of pg.frames()) { try { if (await f.evaluate(() => typeof BANK_ALL !== 'undefined' && window.TLT && Object.keys(BANK_ALL).length > 1000)) { lessonsMs = Date.now() - t0; break; } } catch (e) {} } if (lessonsMs === null) await pg.waitForTimeout(100); }
    out.push({ visit, signInPadMs: padMs, allLessonsReadyMs: lessonsMs, pageErrors: errs.length }); await pg.close(); }
  console.log(label, JSON.stringify(out)); await ctx.close();
}
srv.listen(0, async () => { const port = srv.address().port; const fsx = require('fs'); const s = fsx.readFileSync(path.join(DIST, 'shim.js'), 'utf8'); fsx.writeFileSync(path.join(DIST, 'shim.js'), s.replace("var API = '';", "var API = 'http://localhost:" + port + "/api';"));
  const b = await chromium.launch(); if (process.env.URL) await time(b, process.env.URL, 'FIREBASE (real):   '); else await time(b, 'http://localhost:' + port + '/', 'FILE HOST (trial):'); if (process.env.LIVE) await time(b, LIVE, 'LIVE APPS SCRIPT:  '); await b.close(); srv.close(); });
