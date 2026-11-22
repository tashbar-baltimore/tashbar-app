/* Screen harness for looking at real boy screens with MADE-UP boys only (no real data).
   Usage from node: const S = require('./tests/lib/screens.js'); const { pg, browser } = await S.kidPage({ width: 390 }); ...
   The boy's map comes from tests/lib/kidmap.js (real server code, made-up boys). */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const B = require('./build.js');
const FAKE = ({ tools, parts }) => {
  window.__calls = {}; window.__srvErr = []; let rev = 0;
  const api = { msBootstrap: () => ({ version: 't', students: [] }), msAppUrl: () => 'https://example.invalid/app', msQuestTools: () => tools,
    msQuestToolsParts: have => { const got = {}; (have || []).forEach(h => got[h] = 1); const send = {}; parts.order.forEach(h => { if (!got[h]) send[h] = parts.parts[h]; }); return { v: 2, order: parts.order, parts: send }; },
    msLoad: () => ({ role: 'kid', sid: 'TEST-01', roster: [], states: {} }),
    msSave: (t, sid, st) => ({ ok: true, balance: Number(st && st.balance) || 0, ledger: (st && st.ledger) || [], rev: ++rev }), soundLoad: () => null, pfHello: () => ({ show: false }) };
  const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
    return (...a) => { window.__calls[k] = (window.__calls[k] || 0) + 1; setTimeout(() => { try { okf && okf(api[k] ? api[k](...a) : null); } catch (e) { window.__srvErr.push(k + ': ' + e); nof && nof(e); } }, 20); }; } });
  window.google = { script: { run: chain(null, null), host: { close() {}, setHeight() {} } } };
};
async function kidPage(opt) {
  opt = opt || {}; const K = B.kid(); const browser = opt.browser || await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: opt.width || 390, height: opt.height || 844 }, deviceScaleFactor: opt.scale || 1 });
  await ctx.addInitScript(FAKE, K); const pg = await ctx.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await pg.route('**/*', r => r.request().url() === 'http://app.test/' ? r.fulfill({ contentType: 'text/html', body: K.page }) : r.abort());
  await pg.goto('http://app.test/');
  await pg.waitForFunction(() => window.TLT && typeof BANK_ALL !== 'undefined' && Object.keys(BANK_ALL).length > 500, null, { timeout: 180000 });
  await pg.waitForTimeout(4000);
  const map = require('./kidmap.js')().map;
  await pg.evaluate(M => { SRV.token = 't'; window.TL_MAP = M; A.st = loadStudent({ id: M.sid, name: 'Made-up Boy A' }); A.session = 0; A.view = 'hub'; A.overlay = null; render(); }, map);
  await pg.waitForTimeout(800);
  return { browser, ctx, pg, errs, map };
}
module.exports = { kidPage };
