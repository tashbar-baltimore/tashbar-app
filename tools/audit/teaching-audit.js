/* One Bite teaching audit: loads the student page with made-up boys (same pretend server as tests/run.js),
   mines every lesson's data, and (SHOTS=1) plays chosen lessons at 390px taking a picture of every screen.
   Run: node tools/audit/teaching-audit.js   Output: tools/audit/out/ (git-ignored pictures) + data.json */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const B = require('../../tests/lib/build.js');
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const FAKE = ({ tools, parts }) => {
  window.__calls = {}; let rev = 0;
  const api = { msBootstrap: () => ({ version: 't', students: [] }), msAppUrl: () => 'https://example.invalid/app', msQuestTools: () => tools,
    msQuestToolsParts: have => { const got = {}; (have || []).forEach(h => got[h] = 1); const send = {}; parts.order.forEach(h => { if (!got[h]) send[h] = parts.parts[h]; }); return { v: 2, order: parts.order, parts: send }; },
    msSignInCode: () => ({ ok: true, token: 't', role: 'kid', sid: 'TEST-01', name: 'Test Kid' }),
    msLoad: () => ({ role: 'kid', sid: 'TEST-01', roster: [{ id: 'TEST-01', name: 'Test Kid' }], states: {} }),
    msSave: (t, sid, st) => ({ ok: true, balance: Number(st && st.balance) || 0, ledger: (st && st.ledger) || [], rev: ++rev }), soundLoad: () => null, pfHello: () => ({ show: false }) };
  const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
    return (...a) => { window.__calls[k] = (window.__calls[k] || 0) + 1; setTimeout(() => { try { okf && okf(api[k] ? api[k](...a) : null); } catch (e) { nof && nof(e); } }, 20); }; } });
  window.google = { script: { run: chain(null, null), host: { close() {}, setHeight() {} } } };
};
(async () => {
  const K = B.kid();
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(FAKE, { tools: K.tools, parts: K.parts });
  const pg = await ctx.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await pg.route('**/*', r => r.request().url() === 'http://app.test/' ? r.fulfill({ contentType: 'text/html', body: K.page }) : r.abort());
  await pg.goto('http://app.test/');
  await pg.waitForFunction(() => window.TLT && typeof BANK_ALL !== 'undefined' && Object.keys(BANK_ALL).length > 500, null, { timeout: 180000 });
  await pg.waitForTimeout(20000);
  const data = await pg.evaluate(() => {
    const low = x => String(x == null ? '' : x).toLowerCase().replace(/\s+/g, ' ').trim();
    const words = s => String(s || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const out = [];
    for (const id of Object.keys(BANK_ALL)) {
      let items = []; try { items = buildMission(id); } catch (e) {}
      const T = (window.TL_TEACH || {})[id] || null;
      const ph = p => items.filter(x => x.phase === p);
      const taught = low(JSON.stringify(items.filter(x => x.phase !== 'check')) + JSON.stringify(T || ''));
      const untaught = (typeof GEN !== 'undefined' && GEN[id]) ? 0 : ph('check').filter(x => (x.t === 'mc' || x.t === 'type') && typeof x.correct === 'string' && x.correct.length > 2 && taught.indexOf(low(JSON.stringify(x.correct).slice(1, -1))) < 0).length;
      const kinds = {}; items.forEach(x => { const k = x.kind || x.t; kinds[k] = (kinds[k] || 0) + 1; });
      const qw = items.map(x => words(x.q)); const how = items.map(x => words(typeof x.how === 'string' ? x.how : JSON.stringify(x.how || '')));
      out.push({ id, name: (typeof skillName === 'function' ? skillName(id) : ''), gen: !!(typeof GEN !== 'undefined' && GEN[id]), n: items.length,
        teach: ph('teach').length, practice: ph('practice').length, check: ph('check').length,
        teachKinds: Object.keys(kinds), kinds, hasTL: !!T, tlEx: T && T.ex ? T.ex.length : 0, tlKeys: T ? Object.keys(T) : [],
        qWordsMax: Math.max(0, ...qw), qWordsAvg: qw.length ? Math.round(qw.reduce((a, b) => a + b, 0) / qw.length) : 0,
        howWordsAvg: how.length ? Math.round(how.reduce((a, b) => a + b, 0) / how.length) : 0, untaught,
        sig: items.map(x => x.t).join('') });
    }
    return out;
  });
  fs.writeFileSync(path.join(OUT, 'data.json'), JSON.stringify(data));
  console.log('lessons', data.length, 'errors', errs.length);
  await browser.close();
})();
