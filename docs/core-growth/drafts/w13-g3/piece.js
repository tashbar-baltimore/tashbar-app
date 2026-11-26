/* node piece.js OUT UNIT : a made-up TEST boy writes the unit's Workshop piece (Plan, Write, Fix, Finish, Send) at 1366x768 and 390x844;
   every call to the writing server goes to the REAL server code (server/runtime.js); then the teacher's Writing inbox in the staff portal. */
const ROOT = '/home/user/tashbar-app', S = require(ROOT + '/tests/lib/screens.js'), B = require(ROOT + '/tests/lib/build.js');
const { createRuntime } = require(ROOT + '/server/runtime.js'), vm = require('vm'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const OUT = process.argv[2], UNIT = process.argv[3] || 'W13.U32', STORY = JSON.parse(fs.readFileSync(process.argv[4], 'utf8'));
fs.mkdirSync(OUT, { recursive: true });
const BOOK = 'SELFTEST_PIECE', store = { books: {}, props: { SCHOOL_STAGING_DATABASE_ID: BOOK } }, rt = createRuntime({ store });
if (rt.loadErrors.length) { console.log('load errors', rt.loadErrors); process.exit(1); }
const TABLES = JSON.parse(vm.runInContext('JSON.stringify(TABLES)', rt.ctx)), bk = store.books[BOOK] = { tabs: {}, order: [] };
TABLES.forEach(n => { bk.tabs['TL ' + n] = { rows: [['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']] }; bk.order.push('TL ' + n); });
const res = (fn, ...a) => { try { const r = rt.call(fn, a); return r && r.error ? { error: String(r.error) } : (r && r.result !== undefined ? r.result : r); } catch (e) { return { error: String(e && e.message || e) }; } };
res('msBootstrap');
const H = (s, c) => vm.runInContext('msHash_(' + JSON.stringify(s) + ',' + JSON.stringify(c) + ')', rt.ctx);
const roster = bk.tabs.MS_Roster.rows; const row = roster[0].map(() => ''); row[0] = 'TEST-W301'; row[1] = 'Made-up Boy Grade 3'; row[5] = 'pcsalt'; row[6] = H('pcsalt', '6123'); row[7] = true; roster.push(row);
vm.runInContext("CacheService.getScriptCache().put('ms_tok_pc-staff', JSON.stringify({role:'staff',sid:null,pid:null,staff:null,who:{id:'PCT',name:'Made-up Teacher',role:'head'}}), 6000)", rt.ctx);
const row2 = roster[0].map(() => ''); row2[0] = 'TEST-W302'; row2[1] = 'Made-up Boy Grade 3 B'; row2[5] = 'pcsalt2'; row2[6] = H('pcsalt2', '6124'); row2[7] = true; roster.push(row2);
const boys = { cb: res('msSignInFast', '6123'), ph: res('msSignInFast', '6124') }; if (!boys.cb.token || !boys.ph.token) { console.log('no sign-in'); process.exit(1); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  let n = 0;
  for (const [w, h, tag] of [[1366, 768, 'cb'], [390, 844, 'ph']]) {
    const { browser, pg, errs } = await S.kidPage({ width: w, height: h });
    await pg.exposeFunction('__realSrv', (fn, args) => JSON.stringify(res(fn, ...JSON.parse(args))));
    await pg.evaluate(tokn => { SRV.token = tokn; const old = google.script.run;
      const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
        if (!/^cw/.test(k)) { let o = old; if (okf) o = o.withSuccessHandler(okf); if (nof) o = o.withFailureHandler(nof); return o[k]; }
        return (...a) => { window.__realSrv(k, JSON.stringify(a)).then(s => { const r = JSON.parse(s); if (r && r.error) { nof && nof(new Error(r.error)); } else okf && okf(r); }); }; } });
      window.google.script.run = chain(null, null); }, boys[tag].token);
    const shot = async nm => { await sleep(500); await pg.screenshot({ path: path.join(OUT, String(++n).padStart(2, '0') + '-' + tag + '-' + nm + '.png') }); };
    const p = pg.evaluate(u => TLCORE.units.project(u).then(r => JSON.stringify(r)), UNIT);
    await sleep(800); await shot('plan-empty');
    await pg.evaluate(plan => { Object.keys(plan).forEach(k => { const el = document.querySelector('#cwr [data-cwp="' + k + '"]'); if (el) { el.value = plan[k]; el.dispatchEvent(new Event('input', { bubbles: true })); } }); }, STORY.plan);
    await sleep(600); await shot('plan');
    const nx = async () => { const dis = await pg.evaluate(() => { const b = document.querySelector('#cwr [data-cw=next]'); const d = b.getAttribute('aria-disabled'); b.click(); return d; }); await sleep(400); return dis; };
    let d = await nx(); if (d === 'true') console.log(tag, 'plan Next disabled:', await pg.evaluate(() => (document.querySelector('#cwr .cw-why') || {}).textContent));
    await pg.evaluate(t => { const el = document.querySelector('#cwr [data-cw-text]'); el.value = t; el.dispatchEvent(new Event('input', { bubbles: true })); }, STORY.text);
    await sleep(700); await shot('write');
    d = await nx(); if (d === 'true') console.log(tag, 'write Next disabled:', await pg.evaluate(() => (document.querySelector('#cwr .cw-why') || {}).textContent));
    await sleep(500); await shot('fix-before-ticks');
    for (let i = 0; i < 6; i++) { const ok = await pg.evaluate(() => { const b = document.querySelector('#cwr [data-cw=self]'); if (!b) return false; b.click(); return true; }); if (!ok) break; await sleep(200); }
    await sleep(500); await shot('fix');
    d = await nx(); if (d === 'true') console.log(tag, 'FIX Next disabled:', await pg.evaluate(() => (document.querySelector('#cwr .cw-why') || {}).textContent));
    await pg.evaluate(t => { const el = document.querySelector('#cwr [data-cw-title]'); if (el) { el.value = t; el.dispatchEvent(new Event('input', { bubbles: true })); } const pc = document.querySelector('#cwr [data-cw=pic]'); if (pc) pc.click(); }, STORY.title);
    await sleep(500); await shot('finish');
    d = await nx(); await sleep(1500); await shot('sent');
    console.log(tag, 'sent view:', await pg.evaluate(() => (document.querySelector('#cwr') || {}).innerText || 'closed').then(s => s.slice(0, 160)), 'errors:', errs);
    await pg.evaluate(() => { const b = document.querySelector('#cwr [data-cw=close],#cwr [data-cw=exit]'); if (b) b.click(); }); console.log(tag, 'project result', await p.catch(e => String(e)));
    await browser.close();
  }
  const ib = res('cwInbox', 'pc-staff'); console.log('INBOX', JSON.stringify(ib).slice(0, 700));
  fs.writeFileSync(path.join(OUT, 'inbox.json'), JSON.stringify(ib, null, 1));
  /* the teacher: the real staff portal page, every server call to the real server code */
  const Ks = B.staff(); const browser = await chromium.launch();
  for (const [w, h, tag] of [[1366, 768, 'cb'], [390, 844, 'ph']]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('tl-session', JSON.stringify({ role: 'staff', sid: null, at: Date.now(), token: 'pc-staff' })); } catch (e) {}
      const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
        return (...a) => { const go = () => window.__realSrv ? window.__realSrv(k, JSON.stringify(a)).then(s => { const r = JSON.parse(s); if (r && r.error && !/^cw/.test(k)) { okf && okf(null); } else if (r && r.error) nof && nof(new Error(r.error)); else okf && okf(r); }) : setTimeout(go, 50); go(); }; } });
      window.google = { script: { run: chain(null, null), host: { close() {}, setHeight() {} } } }; });
    const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
    await pg.exposeFunction('__realSrv', (fn, args) => JSON.stringify(res(fn, ...JSON.parse(args))));
    await pg.route('**/*', r => r.request().url() === 'http://app.test/' ? r.fulfill({ contentType: 'text/html', body: Ks.page }) : r.abort());
    await pg.goto('http://app.test/'); await sleep(6000);
    await pg.evaluate(() => { const b = document.getElementById('cws-btn'); if (b) b.click(); }); await sleep(2000);
    await pg.screenshot({ path: path.join(OUT, String(++n).padStart(2, '0') + '-' + tag + '-teacher-inbox.png') });
    const opened = await pg.evaluate(() => { const c = document.querySelector('[data-cws=open],[data-cws="open"],#cws [data-k]'); if (c) { c.click(); return c.outerHTML.slice(0, 120); } return 'no piece button'; });
    await sleep(1500); await pg.screenshot({ path: path.join(OUT, String(++n).padStart(2, '0') + '-' + tag + '-teacher-piece.png') });
    console.log(tag, 'staff opened', opened, 'errors', errs.slice(0, 5)); await ctx.close();
  }
  await browser.close();
})();
