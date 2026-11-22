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
  picsCheck();
}

/* PICS-1: every picture link must pass tools/pics-check.js (real screen, real file, licence recorded, size limits,
   no marks on question screens, labels only with words the screen's "how" line teaches). */
function picsCheck() {
  const { execFileSync } = require('child_process'), os = require('os');
  const tmp = path.join(os.tmpdir(), 'tl-screens-' + process.pid + '.json');
  try {
    execFileSync('python3', [path.join(B.ROOT, 'tools', 'pics-screens.py'), tmp], { stdio: 'pipe' });
    const out = execFileSync('node', [path.join(B.ROOT, 'tools', 'pics-check.js'), path.join(B.SRC, 'RealPics.html'), tmp, path.join(B.ROOT, 'web', 'pics')], { stdio: 'pipe' }).toString().trim().split('\n').pop();
    ok('pictures: ' + out);
  } catch (e) {
    const lines = String((e.stdout || '') + (e.stderr || '') || e).trim().split('\n');
    lines.slice(0, -1).slice(0, 40).forEach(l => fail('pictures: ' + l)); fail('pictures: ' + lines[lines.length - 1]);
  } finally { try { fs.unlinkSync(tmp); } catch (e) {} }
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
      const taught = low(JSON.stringify(items.filter(x => x.phase !== 'check')) + JSON.stringify((window.TL_TEACH || {})[id] || '') + JSON.stringify((window.ONE_BITE || {})[id] || ''));   /* a hand-written One Bite is teaching the boy sees */
      items.filter(x => x.phase === 'check' && (x.t === 'mc' || x.t === 'type') && typeof x.correct === 'string' && x.correct.length > 2).forEach(x => { const a = low(JSON.stringify(x.correct).slice(1, -1)); if (a && taught.indexOf(a) < 0) out.untaught.push(id + ' | ' + String(x.q).slice(0, 70) + ' | ' + x.correct.slice(0, 40)); }); }
    return out; });
  report.counts.lessons = audit.skills; report.counts.checkAnswersNeverTaught = audit.untaught.length; report.untaught = audit.untaught;
  audit.broken.forEach(b => fail('broken lesson: ' + b)); if (!audit.broken.length) ok(audit.skills + ' lessons build with well-formed questions');
  const all = await pg.evaluate(() => { window.OB_LIVE = 'off'; return Object.keys(BANK_ALL); }); let ids = [];   /* the engine's own flow; One Bite has its own test below */
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
  /* the boy's map home (GameMap.html), drawn from a real kmMyMap answer (tests/lib/kidmap.js, made-up boys): shows on the home with his
     goal now and the real skill, PLAY starts that lesson, a locked level says so, the doors still open, nothing shows off the home */
  try { const km = require('./lib/kidmap.js')();
    /* the 🎫 level check card (HoS 2026-11-20): with his level's check waiting, the goal card says so honestly and PLAY still leads on */
    const lcg = await pg.evaluate(async M => { const sleep = ms => new Promise(r => setTimeout(r, ms)), o = {};
      A.overlay = null; A.play = null; SRV.token = 't'; window.TL_MAP = M; A.st = loadStudent({ id: M.sid, name: 'Made-up Boy A' }); A.view = 'hub'; GM.world = 'MATH'; GM.sig = ''; render(); await sleep(50);
      const gm = document.getElementById('gm'); if (!gm) return o; o.h1 = (gm.querySelector('.gm-goal h1') || {}).textContent || ''; o.m = (gm.querySelector('.gm-goal .m') || {}).textContent || ''; o.node = (gm.querySelector('.gm-l.now') || {}).textContent || '';
      gm.querySelector('.gm-goal [data-gm=play]').click(); await sleep(400); o.play = A.view === 'play' && A.play && A.play.id; const cf = document.getElementById('pf-cf'); if (cf) cf.remove();
      A.play = null; A.view = 'hub'; window.TL_MAP = null; GM.world = ''; render(); await sleep(30); return o; }, km.map);
    const wantLc = km.map.names[km.map.subjects.MATH.now] || [];
    if (!km.map.lc || km.map.lc.MATH[km.map.subjects.MATH.level - 1] !== 1) fail('map home: the made-up boy\'s Math level should have a level check waiting');
    else if (!/Level Check/.test(lcg.h1) || lcg.m.indexOf('then: ' + wantLc[0]) < 0 || !/LEVEL CHECK/.test(lcg.node)) fail('map home: a level with its check waiting must show "🎫 Level Check · then: ' + wantLc[0] + '" (got "' + lcg.h1 + '" / "' + lcg.m + '" / "' + lcg.node + '")');
    else if (lcg.play !== km.map.subjects.MATH.now) fail('map home: PLAY on the level check card must lead on (got ' + lcg.play + ')');
    else ok('map home: a level whose check is waiting shows the 🎫 Level Check card and the lesson after it; PLAY leads into it');
    const passMap = JSON.parse(JSON.stringify(km.map)); if (passMap.lc) ['MATH', 'READ'].forEach(k => { passMap.lc[k] = passMap.lc[k].map(v => (v ? 2 : 0)); });
    const g = await pg.evaluate(async M => { const sleep = ms => new Promise(r => setTimeout(r, ms)), o = {};
      A.overlay = null; A.play = null; window.TL_MAP = M; A.st = loadStudent({ id: M.sid, name: 'Made-up Boy A' }); A.view = 'hub'; render(); await sleep(50);
      const gm = document.getElementById('gm'); o.on = document.body.classList.contains('gm-on') && !!gm; if (!o.on) return o;
      o.goal = (gm.querySelector('.gm-goal h1') || {}).textContent || ''; o.learn = (gm.querySelector('.gm-goal .learn') || {}).textContent || ''; o.nodes = gm.querySelectorAll('.gm-n').length; o.boss = gm.querySelectorAll('.gm-n.boss').length;
      o.tabs = document.querySelectorAll('#gm-nav [data-gmnav]').length; o.plays = gm.querySelectorAll('.gm-play').length; o.worldTabsOnMap = gm.querySelectorAll('[data-gm=world]').length;
      const chg = gm.querySelector('[data-gmnav=subjects]'); if (chg) { chg.click(); await sleep(30); }
      const ch = gm.querySelector('[data-gm=world][data-k="K:CHU"]'); if (ch) { ch.click(); await sleep(30); const lk = gm.querySelector('.gm-n.u'); o.chu = (gm.querySelector('.gm-goal h1') || {}).textContent || ''; if (lk) { lk.click(); o.toast = (gm.querySelector('.gm-pop') || gm.querySelector('.gm-toast') || {}).textContent || ''; } const c2 = gm.querySelector('[data-gmnav=subjects]'); if (c2) { c2.click(); await sleep(30); } const mt = gm.querySelector('[data-gm=world][data-k="MATH"]'); if (mt) { mt.click(); await sleep(30); } }
      document.querySelector('#gm-nav [data-gmnav=more]').click(); await sleep(30); o.shelves = gm.querySelectorAll('.gm-shelf').length;
      gm.querySelector('[data-gm=lib]').click(); await sleep(30); o.lib = GM.tab === 'lib' && document.body.classList.contains('gm-on');
      document.querySelector('#gm-nav [data-gmnav=more]').click(); await sleep(30); gm.querySelector('[data-gmnav=games]').click(); await sleep(30); o.oldDoor = document.body.classList.contains('hf-games') || document.body.classList.contains('hf-lib') || document.body.classList.contains('hf-mine');
      document.querySelector('#gm-nav [data-gmnav=map]').click(); await sleep(30); o.back = document.body.classList.contains('gm-on');
      document.querySelector('#gm-nav [data-gmnav=missions]').click(); await sleep(30); o.rounds = gm.querySelectorAll('.gm-rd:not(.final):not(.rebbe)').length; o.live = gm.querySelectorAll('.gm-rd.live').length;
      document.querySelector('#gm-nav [data-gmnav=more]').click(); await sleep(30); gm.querySelector('[data-gmnav=games]').click(); await sleep(30); o.locked = !!gm.querySelector('.gm-lock') && document.body.classList.contains('gm-on');
      document.querySelector('#gm-nav [data-gmnav=map]').click(); await sleep(30);
      gm.querySelector('[data-gm=play]').click(); await sleep(30); o.play = A.view === 'play' && A.play && A.play.id; o.offHome = !document.body.classList.contains('gm-on') && !document.body.classList.contains('gm-nav');
      A.play = null; A.view = 'hub'; window.TL_MAP = null; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); render(); await sleep(30); o.noMap = document.body.classList.contains('gm-on') && !!document.querySelector('#gm .gm-none'); return o; }, passMap);
    const want = km.map.names[km.map.subjects.MATH.now] || [];
    if (!g.on) fail('map home did not show for a boy with a map'); else {
      if (g.goal !== want[0] || g.learn.indexOf(want[1]) < 0) fail('map home: next level should be "' + want[0] + '" with "' + want[1] + '" (got "' + g.goal + '" / "' + g.learn + '")');
      if (!g.nodes || g.boss !== 1) fail('map home: the path needs its levels and one BOSS (got ' + g.nodes + ' levels, ' + g.boss + ' boss)');
      if (!/Locked/.test(g.toast || '')) fail('map home: a locked Chumash level must say so (got "' + g.toast + '")');
      if (g.chu !== (km.map.names[km.map.kodesh['K:CHU'].now] || [])[0]) fail('map home: the Chumash world must show his Chumash goal (got "' + g.chu + '")');
      if (!g.lib || !g.back) fail('map home: All lessons must open the game Library and Map must come back');
      if (g.oldDoor) fail('map home: no old-style door page may open (HoS 2026-11-20: no old style pages left)');
      if (g.play !== km.map.subjects.MATH.now || !g.offHome) fail('map home: PLAY must start his goal now (got ' + g.play + ')');
      if (!g.noMap) fail('map home: a boy with no map must get the game screen ("Your map is almost ready"), never the old home');
      if (g.rounds !== 3 || g.live !== 1) fail('missions: 3 rounds with one live round expected (got ' + g.rounds + ' rounds, ' + g.live + ' live)');
      if (!g.locked) fail('missions: the Arcade must be locked before the 3 rounds are cleared');
      if (g.tabs !== 4) fail('one button, one job: the bottom bar must have 4 tabs (got ' + g.tabs + ')');
      if (g.plays !== 1 || g.worldTabsOnMap) fail('one button, one job: the map has ONE big PLAY and no subject tabs (got ' + g.plays + ' PLAY, ' + g.worldTabsOnMap + ' subject tabs)');
      if (g.shelves < 4 || g.shelves > 5) fail('one button, one job: More must hold 4-5 shelves (got ' + g.shelves + ')');
      if (g.goal === want[0] && g.play === km.map.subjects.MATH.now && g.noMap && g.lib && g.back && g.rounds === 3 && g.locked && g.tabs === 4 && g.plays === 1) ok('map home: 4 tabs, one PLAY, Change subject + More shelves; next level + real skill, path with BOSS, PLAY starts it, locked says so, All lessons is a game screen, no old pages; missions: 3 rounds, Arcade locked until cleared'); } }
  catch (e) { fail('map home test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  /* ONE BITE player (tests/lib/onebite.js) */
  try { const ob = await require('./lib/onebite.js')(pg); ob.fails.forEach(fail); ob.oks.forEach(ok); Object.assign(report.counts, ob.counts); }
  catch (e) { fail('One Bite test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  /* Store Fun tab (tests/lib/storefx.js, HoS 2026-11-22): no two items share a name, a picture, a tap blast, a trail or nearly the same app colors */
  try { const sf = require('./lib/storefx.js'), n = sf.names(), e = await sf.effects(pg); n.fails.concat(e.fails).forEach(fail);
    if (!n.fails.length && !e.fails.length) ok('store Fun tab: ' + n.count + ' items, no two share a name, picture, tap blast, trail or app colors (closest app colors: ' + (e.closest && e.closest.d) + ')'); }
  catch (e) { fail('store check crashed: ' + String(e && e.stack || e).slice(0, 300)); }
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
  try { const c = await require('./lib/canteen.js')(); c.fails.forEach(fail); if (!c.fails.length) ok('canteen on the Firebase engine: sell, same sale charged once, crew cashier, two kiosks at once, last sale, undo'); report.timings.canteenSaleMs = c.ms.sale; }
  catch (e) { fail('canteen test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  try { const k = require('./lib/kidmap.js')(); k.fails.forEach(fail); if (!k.fails.length) ok("boy's own map (kmMyMap): rides with sign-in, only his own data, goal now, unit, Kodesh, growth; staff and bad tokens refused"); report.timings.kidMapMs = k.ms.map; report.timings.kidSignInWithMapMs = k.ms.signIn; }
  catch (e) { fail('kid map test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  try { const sc = await require('./lib/staffcard.js')(browser); sc.fails.forEach(fail); sc.oks.forEach(ok); }
  catch (e) { fail('staff card test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  try { const l = require('./lib/levelpass.js')(); l.fails.forEach(fail); if (!l.fails.length) ok('level checks and the 🎫 Level Pass: 25% before the check, full pay after, known skills skipped and not paid, one check per level, staff placement wins, no check = never cut'); report.timings.levelCheckStartMs = l.ms.start; report.timings.levelCheckSaveMs = l.ms.save; }
  catch (e) { fail('level pass test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  await browser.close();
  const bp = path.join(__dirname, 'baseline.json'); const base = fs.existsSync(bp) ? JSON.parse(fs.readFileSync(bp, 'utf8')) : null;
  if (process.env.UPDATE || !base) { fs.writeFileSync(bp, JSON.stringify({ checkAnswersNeverTaught: report.counts.checkAnswersNeverTaught, lessons: report.counts.lessons }, null, 1) + '\n'); console.log('baseline written'); }
  else { if (report.counts.checkAnswersNeverTaught > base.checkAnswersNeverTaught) fail('check questions whose answer is never taught went UP: ' + report.counts.checkAnswersNeverTaught + ' (baseline ' + base.checkAnswersNeverTaught + '). See tests/out/report.json "untaught".');
    if (report.counts.lessons < base.lessons) fail('lessons went DOWN: ' + report.counts.lessons + ' (baseline ' + base.lessons + ')'); }
  report.notes = notes; report.fails = fails; fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true }); fs.writeFileSync(path.join(__dirname, 'out', 'report.json'), JSON.stringify(report, null, 1));
  console.log('\nTIMINGS (CPU slowed 4x): ' + JSON.stringify(report.timings)); console.log('COUNTS: ' + JSON.stringify(report.counts));
  console.log(fails.length ? '\n' + fails.length + ' FAILURE(S)' : '\nALL TESTS PASSED'); process.exit(fails.length ? 1 : 0);
})();
