/* Tashbar test kit. Run: node tests/run.js   (options by environment variable)
     SAMPLE=40      how many lessons to play start-to-finish (spread evenly over all lessons; default 40)
     PLAY=ID,ID     also play these lesson ids (or id prefixes, e.g. LK.CHU.L03)
     ALL=1          play every lesson (slow: about 2 hours)
     UPDATE=1       rewrite tests/baseline.json from this run (use only when a number is meant to change)
   Everything runs against a pretend server with made-up kids. No Google account, no real student data.
   Fails on: a file that does not parse, a changed web-app access setting, a lesson pack that does not match
   ContentPacks.js, any page error or console error, a lesson that cannot be built or played to "mastered",
   or MORE check questions whose answer was never taught than tests/baseline.json allows. */
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');
const { chromium } = require('playwright');
const B = require('./lib/build.js');
const fails = [], notes = [], report = { timings: {}, counts: {} };
const fail = m => { fails.push(m); console.log('FAIL  ' + m); }, ok = m => console.log('ok    ' + m);

function staticChecks() {
  const files = fs.readdirSync(B.SRC);
  for (const f of files.filter(x => x.endsWith('.js'))) { try { new vm.Script(fs.readFileSync(path.join(B.SRC, f), 'utf8'), { filename: f }); } catch (e) { fail('src/' + f + ' does not parse: ' + String(e).slice(0, 120)); } }
  for (const f of files.filter(x => x.endsWith('.html'))) {            /* every script block in an add-on must parse */
    const t = fs.readFileSync(path.join(B.SRC, f), 'utf8'); const re = /<script>([\s\S]*?)<\/script>/g; let m, n = 0;
    while ((m = re.exec(t))) { n++; if (/<\?/.test(m[1])) continue; try { new vm.Script(m[1], { filename: f + '#' + n }); } catch (e) { fail('src/' + f + ' script block ' + n + ' does not parse: ' + String(e).slice(0, 120)); } }
  }
  const base = {}; files.forEach(f => { const b = f.replace(/\.(js|html)$/, ''); (base[b] = base[b] || []).push(f); });
  Object.values(base).filter(v => v.length > 1).forEach(v => fail('Apps Script forbids a .js and .html with the same name: ' + v.join(', ')));
  const mf = JSON.parse(fs.readFileSync(path.join(B.SRC, 'appsscript.json'), 'utf8'));
  if (!mf.webapp || mf.webapp.access !== 'ANYONE_ANONYMOUS') fail('appsscript.json webapp.access must stay ANYONE_ANONYMOUS'); else ok('web-app access is ANYONE_ANONYMOUS');
  if (fs.existsSync(path.join(B.ROOT, '.clasprc.json'))) fail('.clasprc.json (a sign-in token) is in the repository folder');
  const T = B.packTable(); let bad = 0;
  for (const [name, p] of Object.entries(T)) {
    const fp = path.join(B.PACKS, name + '.html'); if (!fs.existsSync(fp)) { fail('packs/' + name + '.html is missing'); bad++; continue; }
    const b = fs.readFileSync(fp); const h = crypto.createHash('sha256').update(b).digest('hex');
    if (h !== p[1] || b.length !== p[2]) { fail('packs/' + name + '.html does not match ContentPacks.js (sha256 ' + h.slice(0, 12) + ', ' + b.length + ' bytes; table says ' + p[1].slice(0, 12) + ', ' + p[2] + ')'); bad++; }
  }
  if (!bad) ok(Object.keys(T).length + ' lesson packs match ContentPacks.js');
  report.counts.packs = Object.keys(T).length;
}

const FAKE = ({ tools, parts }) => {
  window.__calls = {}; window.__srvErr = []; let rev = 0;
  const api = { msBootstrap: () => ({ version: 't', students: [] }), msAppUrl: () => 'https://example.invalid/app', msQuestTools: () => tools,
    msQuestToolsParts: have => { const got = {}; (have || []).forEach(h => got[h] = 1); const send = {}; parts.order.forEach(h => { if (!got[h]) send[h] = parts.parts[h]; }); return { v: 2, order: parts.order, parts: send }; },
    msSignInCode: () => ({ ok: true, token: 't', role: 'kid', sid: 'TEST-01', name: 'Test Kid' }),
    msLoad: () => ({ role: 'kid', sid: 'TEST-01', roster: [{ id: 'TEST-01', name: 'Test Kid' }], states: {} }),
    msSave: (t, sid, st) => ({ ok: true, balance: Number(st && st.balance) || 0, ledger: (st && st.ledger) || [], rev: ++rev }), soundLoad: () => null, pfHello: () => ({ show: false }) };
  const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
    return (...a) => { window.__calls[k] = (window.__calls[k] || 0) + 1; setTimeout(() => { try { okf && okf(api[k] ? api[k](...a) : null); } catch (e) { window.__srvErr.push(k + ': ' + e); nof && nof(e); } }, 20); }; } });
  window.google = { script: { run: chain(null, null), host: { close() {}, setHeight() {} } } };
};

async function openPage(browser, html, init, throttle, staffSession) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } }); if (staffSession) await ctx.addInitScript(() => { try { sessionStorage.setItem('tl-session', JSON.stringify({ role: 'staff', sid: null, at: Date.now(), token: 't' })); } catch (e) {} }); if (init) await ctx.addInitScript(FAKE, init); else await ctx.addInitScript(FAKE, { tools: { css: '', js: '' }, parts: { order: [], parts: {} } });
  const pg = await ctx.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push('page error: ' + String(e).slice(0, 240)));
  pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('console error: ' + m.text().slice(0, 240)); });
  await pg.route('**/*', r => r.request().url() === 'http://app.test/' ? r.fulfill({ contentType: 'text/html', body: html }) : r.abort());
  if (throttle) { const cdp = await ctx.newCDPSession(pg); await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle }); }
  return { ctx, pg, errs };
}

async function kidTests(browser) {
  const K = B.kid(); K.loadErrors.forEach(e => fail('server file failed to load: ' + e));
  /* timings, CPU slowed 4x like a school Chromebook */
  { const { ctx, pg, errs } = await openPage(browser, K.page, K, 4); const t0 = Date.now(); await pg.goto('http://app.test/', { waitUntil: 'commit' });
    await pg.waitForFunction(() => [...document.querySelectorAll('button')].some(b => /^\s*[0-9]\s*$/.test(b.textContent)), null, { timeout: 90000 }); report.timings.signInPadMs = Date.now() - t0;
    await pg.waitForFunction(() => window.TLT && typeof BANK_ALL !== 'undefined' && Object.keys(BANK_ALL).length > 500, null, { timeout: 180000 }).catch(() => fail('lesson add-ons did not finish loading in 3 minutes')); report.timings.allLessonsLoadedMs = Date.now() - t0;
    const t1 = Date.now(); await pg.evaluate(() => { SRV.token = 't'; const me = { id: 'TEST-01', name: 'Test Kid' }; if (!ROSTER.some(x => x.id === me.id)) ROSTER.push(me); A.st = loadStudent(me); A.session = 0; A.view = 'hub'; render(); });
    await pg.waitForFunction(() => document.body.innerText.length > 200, null, { timeout: 60000 }); report.timings.kidHomeMs = Date.now() - t1; await pg.waitForTimeout(3000);
    report.counts.serverCallsToKidHome = Object.values(await pg.evaluate(() => window.__calls)).reduce((a, b) => a + b, 0);
    await pg.setViewportSize({ width: 390, height: 800 }); await pg.waitForTimeout(500); fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true }); await pg.screenshot({ path: path.join(__dirname, 'out', 'kid-home-phone.png') });
    errs.forEach(e => fail('kid page (timing run): ' + e)); await ctx.close(); }
  /* lessons */
  const { ctx, pg, errs } = await openPage(browser, K.page, K, 0); await pg.goto('http://app.test/');
  await pg.waitForFunction(() => window.TLT && typeof BANK_ALL !== 'undefined' && Object.keys(BANK_ALL).length > 500, null, { timeout: 180000 }); await pg.waitForTimeout(20000);
  const audit = await pg.evaluate(() => { const out = { skills: 0, broken: [], untaught: [] }; const low = x => String(x == null ? '' : x).toLowerCase().replace(/\s+/g, ' ').trim();
    for (const id of Object.keys(BANK_ALL)) { out.skills++; let items; try { items = buildMission(id); } catch (e) { out.broken.push(id + ': cannot build (' + String(e).slice(0, 80) + ')'); continue; }
      if (!items || !items.length) { out.broken.push(id + ': no questions'); continue; }
      items.forEach((it, i) => { if (it._bad) out.broken.push(id + ' #' + i + ': ' + it._bad); if (it.t === 'mc' && (!it.shown || it.shown.indexOf(it.correct) < 0)) out.broken.push(id + ' #' + i + ': right answer is not among the choices'); });
      if (typeof GEN !== 'undefined' && GEN[id]) continue;
      const taught = low(JSON.stringify(items.filter(x => x.phase !== 'check')) + JSON.stringify((window.TL_TEACH || {})[id] || ''));
      items.filter(x => x.phase === 'check' && (x.t === 'mc' || x.t === 'type') && typeof x.correct === 'string' && x.correct.length > 2).forEach(x => { const a = low(JSON.stringify(x.correct).slice(1, -1)); if (a && taught.indexOf(a) < 0) out.untaught.push(id + ' | ' + String(x.q).slice(0, 70) + ' | ' + x.correct.slice(0, 40)); }); }
    return out; });
  report.counts.lessons = audit.skills; report.counts.checkAnswersNeverTaught = audit.untaught.length; report.untaught = audit.untaught;
  audit.broken.forEach(b => fail('broken lesson: ' + b)); if (!audit.broken.length) ok(audit.skills + ' lessons build with well-formed questions');
  const all = await pg.evaluate(() => Object.keys(BANK_ALL)); let ids = [];
  if (process.env.ALL) ids = all; else { const n = Math.max(1, Number(process.env.SAMPLE || 40)); const step = Math.max(1, Math.floor(all.length / n)); for (let i = 0; i < all.length && ids.length < n; i += step) ids.push(all[i]);
    (process.env.PLAY || '').split(',').filter(Boolean).forEach(p => all.filter(id => id.indexOf(p) === 0).forEach(id => { if (ids.indexOf(id) < 0) ids.push(id); })); }
  let done = 0;
  for (const id of ids) { const r = await pg.evaluate(async id => { const sleep = ms => new Promise(r => setTimeout(r, ms)); const o = { id, steps: 0, noBox: 0 };
      try { document.dispatchEvent(new Event('wheel')); A.overlay = null; SRV.token = 't'; SRV.states = {}; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.session = 0; A.view = 'hub';
        const pre = id.split('.')[0], map = /^(LK|HEB)$/.test(pre) ? 'LK' : /^(READ|WRIT|LANG)$/.test(pre) ? 'READ' : /^(SS|SOC|FACT)$/.test(pre) ? 'SS' : /^(COMP|VOC)$/.test(pre) ? 'COMP' : pre; const subj = WORLD[pre] ? pre : WORLD[map] ? map : Object.keys(WORLD)[0];
        startMission(subj, id, 'skill'); const p = A.play;
        while (A.view === 'play' && A.play === p && o.steps < 80) { o.steps++; A.overlay = null; render(); const it = p.items[p.i]; const el = document.querySelector('.play'); if (!el) { o.err = 'no lesson screen at question ' + p.i; break; }
          if (it.phase !== 'check' && it.phase !== 'warm' && !/How to do it/i.test(el.innerHTML)) o.noBox++;
          p.shownAt = 0; p.cool = 0; if (it.t === 'write') p.text = new Array((it.min || 5) + 2).join('word ');
          answer(it.t === 'num' ? String(it.a) : it.t === 'write' ? p.text : it.correct); if (!(p.fb && p.fb.ok)) { o.err = 'right answer not accepted at question ' + p.i + ' (' + it.t + '): ' + String(it.q).slice(0, 60); break; }
          await sleep(5); next(); await sleep(5); }
        o.m = !!(A.st && A.st.skills[id] && A.st.skills[id].m); } catch (e) { o.err = String(e && e.stack || e).slice(0, 240); } return o; }, id);
    if (!r.m || r.err) fail('lesson ' + id + ' did not play to mastered: ' + (r.err || 'not mastered after ' + r.steps + ' questions')); else done++;
    if (r.noBox) notes.push(id + ': ' + r.noBox + ' teach or practice screen(s) with no "How to do it" box'); }
  report.counts.lessonsPlayed = ids.length; report.counts.lessonsMastered = done; report.counts.screensWithNoHowToBox = notes.length; if (done === ids.length) ok(done + ' of ' + ids.length + ' sampled lessons played to mastered');
  (await pg.evaluate(() => window.__srvErr)).forEach(e => fail('server call failed: ' + e)); errs.forEach(e => fail('kid page: ' + e)); await ctx.close();
}

async function staffTests(browser) {
  const S = B.staff(); if (!S.page) return fail('staff portal did not build: ' + S.error);
  const { ctx, pg, errs } = await openPage(browser, S.page, null, 4, true); const t0 = Date.now(); await pg.goto('http://app.test/', { waitUntil: 'commit' });
  await pg.waitForFunction(() => document.body && document.body.innerText.trim().length > 20, null, { timeout: 60000 }).catch(() => fail('staff portal showed nothing in 60 seconds')); report.timings.staffFirstScreenMs = Date.now() - t0;
  await pg.waitForTimeout(3000); report.counts.serverCallsStaffFirstScreen = Object.values(await pg.evaluate(() => window.__calls)).reduce((a, b) => a + b, 0);
  await pg.screenshot({ path: path.join(__dirname, 'out', 'staff-first-screen.png') }); errs.forEach(e => fail('staff portal: ' + e)); if (!errs.length) ok('staff portal first screen opens with no errors'); await ctx.close();
}

(async () => {
  staticChecks();
  const browser = await chromium.launch();
  try { await kidTests(browser); await staffTests(browser); } catch (e) { fail('test run crashed: ' + String(e && e.stack || e).slice(0, 400)); }
  await browser.close();
  const bp = path.join(__dirname, 'baseline.json'); const base = fs.existsSync(bp) ? JSON.parse(fs.readFileSync(bp, 'utf8')) : null;
  if (process.env.UPDATE || !base) { fs.writeFileSync(bp, JSON.stringify({ checkAnswersNeverTaught: report.counts.checkAnswersNeverTaught, lessons: report.counts.lessons }, null, 1) + '\n'); console.log('baseline written'); }
  else { if (report.counts.checkAnswersNeverTaught > base.checkAnswersNeverTaught) fail('check questions whose answer is never taught went UP: ' + report.counts.checkAnswersNeverTaught + ' (baseline ' + base.checkAnswersNeverTaught + '). See tests/out/report.json "untaught".');
    if (report.counts.lessons < base.lessons) fail('lessons went DOWN: ' + report.counts.lessons + ' (baseline ' + base.lessons + ')'); }
  report.notes = notes; report.fails = fails; fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true }); fs.writeFileSync(path.join(__dirname, 'out', 'report.json'), JSON.stringify(report, null, 1));
  console.log('\nTIMINGS (CPU slowed 4x): ' + JSON.stringify(report.timings)); console.log('COUNTS: ' + JSON.stringify(report.counts));
  console.log(fails.length ? '\n' + fails.length + ' FAILURE(S)' : '\nALL TESTS PASSED'); process.exit(fails.length ? 1 : 0);
})();
