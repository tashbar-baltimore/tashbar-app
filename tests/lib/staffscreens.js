/* Staff screen harness: the real staff portal page on the real server code (server/runtime.js), with MADE-UP boys only.
   const H = require('./tests/lib/staffscreens.js'); const { browser, pg, errs, rt } = await H.staffPage({ width: 1366 });
   Every google.script.run call goes to the real server functions, signed in as a made-up head rebbe. */
const path = require('path'), vm = require('vm');
const { chromium } = require('playwright');
const B = require('./build.js');
const R = path.join(__dirname, '..', '..', 'server') + '/';
function seed() {
  const { createRuntime } = require(R + 'runtime.js'); const BOOK = 'SELFTEST_SS1';
  const store = { books: {}, props: { SCHOOL_STAGING_DATABASE_ID: BOOK } }; const rt = createRuntime({ store }); const call = (fn, ...a) => rt.call(fn, a);
  if (rt.loadErrors.length) throw new Error('server load: ' + rt.loadErrors.join('; '));
  const TABLES = JSON.parse(vm.runInContext('JSON.stringify(TABLES)', rt.ctx)), bk = store.books[BOOK] = { tabs: {}, order: [] };
  TABLES.forEach(n => { bk.tabs['TL ' + n] = { rows: [['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']] }; bk.order.push('TL ' + n); });
  call('msBootstrap');
  const H = (s, c) => vm.runInContext('msHash_(' + JSON.stringify(s) + ',' + JSON.stringify(c) + ')', rt.ctx);
  const boys = [['TESTSS01', 'Made-up Fifth', '6501', 'grade 5'], ['TESTSS02', 'Made-up Third', '6502', 'grade 3'], ['TESTSS03', 'Made-up First', '6503', 'grade 1'], ['TESTSS04', 'Made-up Seventh', '6504', 'grade 7'], ['TESTSS05', 'Made-up Fourth', '6505', 'grade 4']];
  const roster = bk.tabs.MS_Roster.rows; boys.forEach((b, i) => { const row = roster[0].map(() => ''); row[0] = b[0]; row[1] = b[1]; row[5] = 'sssalt' + i; row[6] = H('sssalt' + i, b[2]); row[7] = true; row[8] = b[3]; roster.push(row); });
  vm.runInContext("CacheService.getScriptCache().put('ms_tok_ss-staff', JSON.stringify({role:'staff',sid:null,pid:null,staff:null,who:{id:'SST',name:'Made-up Rebbe',role:'head'}}), 3600)", rt.ctx);
  const place = (sid, key, level) => { try { call('libApply', 'ss-staff', { action: 'place', boys: [sid], key, level }); } catch (e) {} };
  place('TESTSS01', 'MATH', 5); place('TESTSS01', 'READ', 5); place('TESTSS02', 'MATH', 3); place('TESTSS02', 'READ', 3); place('TESTSS03', 'MATH', 1); place('TESTSS04', 'MATH', 7); place('TESTSS05', 'READ', 4);
  const now = Date.now(), day = 864e5, m = at => ({ m: true, at, first: true, stars: 3 });
  bk.tabs.MS_State.rows.push(['TESTSS01', JSON.stringify({ id: 'TESTSS01', skills: { 'MATH.OPS.L05.03': m(now - 2 * day), 'MATH.OPS.L05.04': m(now - day) } }), new Date(), 1]);
  return { rt, call };
}
async function staffPage(opt) {
  opt = opt || {}; const { rt, call } = seed(); const S = B.staff(); if (!S.page) throw new Error('staff page did not build: ' + S.error);
  const browser = opt.browser || await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: opt.width || 1366, height: opt.height || 768 }, deviceScaleFactor: opt.scale || 1 });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('tl-session', JSON.stringify({ role: 'staff', sid: null, at: Date.now(), token: 'ss-staff' })); } catch (e) {} });
  await ctx.exposeFunction('__srv', (fn, args) => { try { const r = rt.call(fn, args); return JSON.stringify({ ok: 1, r: r === undefined ? null : r }); } catch (e) { return JSON.stringify({ ok: 0, e: String(e && e.message || e) }); } });
  await ctx.addInitScript(() => { window.__calls = {}; window.__srvErr = [];
    const chain = (okf, nof, uo) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof, uo); if (k === 'withFailureHandler') return f => chain(okf, f, uo); if (k === 'withUserObject') return u => chain(okf, nof, u);
      return (...a) => { window.__calls[k] = (window.__calls[k] || 0) + 1; window.__srv(k, JSON.parse(JSON.stringify(a))).then(t => { const x = JSON.parse(t); if (x.ok) { try { okf && okf(x.r, uo); } catch (e) { window.__srvErr.push(k + ' handler: ' + e); } } else { window.__srvErr.push(k + ': ' + x.e); nof && nof(new Error(x.e), uo); } }); }; } });
    window.google = { script: { run: chain(null, null), host: { close() {}, setHeight() {} } } }; });
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await pg.route('**/*', r => r.request().url() === 'http://app.test/' ? r.fulfill({ contentType: 'text/html', body: S.page }) : r.abort());
  await pg.goto('http://app.test/'); await pg.waitForTimeout(opt.wait || 6000);
  return { browser, ctx, pg, errs, rt, call };
}
module.exports = { staffPage };
