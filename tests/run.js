/* Tashbar test kit. Run: node tests/run.js   (options by environment variable)
     SAMPLE=40      how many lessons to play start-to-finish (spread evenly over all lessons; default 40)
     PLAY=ID,ID     also play these lesson ids (or id prefixes, e.g. LK.CHU.L03)
     ALL=1          play every lesson (slow: about 2 hours)
     UPDATE=1       rewrite tests/baseline.json from this run (use only when a number is meant to change)
     PAGES=4        how many kid pages play lessons side by side (default 4; PAGES=1 plays them all on one page, as before)
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
  /* SHARED ART LIBRARY (HoS 2026-11-24): every file in art/ cataloged, sources and licences recorded, size limits, no duplicates */
  try { const a = require('./lib/art.js')(); a.fails.forEach(fail); a.oks.forEach(ok); } catch (e) { fail('art library check crashed: ' + String(e).slice(0, 200)); }
}

/* PICS-1: every picture link must pass tools/pics-check.js (real screen, real file, licence recorded, size limits,
   no marks on question screens, labels only with words the screen's "how" line teaches). */
function picsCheck() {
  const { execFileSync } = require('child_process'), os = require('os');
  const tmp = path.join(os.tmpdir(), 'tl-screens-' + process.pid + '.json');
  try {
    execFileSync('python3', [path.join(B.ROOT, 'tools', 'pics-screens.py'), tmp], { stdio: 'pipe' });
    const out = execFileSync('node', [path.join(B.ROOT, 'tools', 'pics-check.js'), path.join(B.SRC, 'RealPics.html'), tmp, path.join(B.ROOT, 'art', 'pics')], { stdio: 'pipe' }).toString().trim().split('\n').pop();
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
  /* the test boy is an active boy: code taps are not pointer events, so without this the real 5-quiet-minutes auto sign-out (src/SignOutBar.html)
     fires in the middle of long runs and wipes A.st / A.play ("Cannot set properties of null", "skipped Your turn"). A synthetic wheel event is what
     SignOutBar counts as activity; nothing else in the app listens for it, and it changes nothing on the page. */
  await ctx.addInitScript(() => { setInterval(() => { try { document.documentElement.dispatchEvent(new WheelEvent('wheel', { bubbles: true })); } catch (e) {} }, 30000); });
  const pg = await ctx.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push('page error: ' + String(e).slice(0, 240)));
  pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('console error: ' + m.text().slice(0, 240)); });
  /* the content store (job T): /texts/<ID>.json is served from texts/ the way web/build.js publishes it, so a lesson can open a real text */
  const TXP = [path.join(__dirname, '..', 'tools', 'core', 'texts.js'), path.join(process.cwd(), 'tools', 'core', 'texts.js')].find(p => fs.existsSync(p));
  let TX = null; const realText = id => { if (!TX) { TX = {}; try { require(TXP).load().out.forEach(t => { TX[t.id] = t; }); } catch (e) {} } return TX[id]; };
  await pg.route('**/*', r => { const u = r.request().url(); if (u === 'http://app.test/') return r.fulfill({ contentType: 'text/html', body: html });
    const m = /\/texts\/([A-Za-z0-9.]+)\.json$/.exec(u), t = m && realText(m[1]); return t ? r.fulfill({ contentType: 'application/json', body: JSON.stringify(t) }) : r.abort(); });
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
  /* K-1 FIRST (tests/lib/k1fast.js): on a K-1 Chromebook the K boy's PLAY shows fast */
  try { const kf = await require('./lib/k1fast.js')(browser, openPage, K); kf.fails.forEach(fail); kf.oks.forEach(ok); } catch (e) { fail('K-1 first check crashed: ' + String(e).slice(0, 200)); }
  /* 2.0 (v2/README.md): every test a 2.0 piece brings in v2/tests/*.js runs here; each exports async (browser) => { fails, oks } */
  try { const V2T = path.join(__dirname, '..', 'v2', 'tests'); if (fs.existsSync(V2T)) for (const f of fs.readdirSync(V2T).filter(x => x.endsWith('.js')).sort()) {
      try { const r = await require(path.join(V2T, f))(browser); (r.fails || []).forEach(fail); (r.oks || []).forEach(ok); } catch (e) { fail('2.0 test ' + f + ' crashed: ' + String(e).slice(0, 200)); } } } catch (e) { fail('2.0 tests could not run: ' + String(e).slice(0, 200)); }
  /* lessons */
  /* the lessons page, plus PAGES-1 more kid pages opened the same way: the sampled lessons and the One Bite bites are shared out over them
     and played side by side (the kit had grown past 40 minutes on one page). Every lesson is still played once, with the same checks. */
  const kidPage = async () => { const P = await openPage(browser, K.page, K, 0); await P.pg.goto('http://app.test/');
    await P.pg.waitForFunction(() => window.TLT && typeof BANK_ALL !== 'undefined' && Object.keys(BANK_ALL).length > 500, null, { timeout: 180000 }); await P.pg.waitForTimeout(20000); return P; };
  const [main, ...extra] = await Promise.all(Array.from({ length: Math.max(1, Number(process.env.PAGES || 4)) }, kidPage));
  const { ctx, pg, errs } = main, pages = [pg].concat(extra.map(P => P.pg));
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
  const all = (await Promise.all(pages.map(p => p.evaluate(() => { window.OB_LIVE = 'off'; window.TL_CHEM_SING = false; return Object.keys(BANK_ALL); }))))[0]; let ids = [];   /* the engine's own flow; One Bite has its own test below. The Chemdas song screen (TorahTracks.html) waits for a tap before LK.CHEM.L04.* starts, so it is switched off here like One Bite. */
  if (process.env.ALL) ids = all; else { const n = Math.max(1, Number(process.env.SAMPLE || 40)); const step = Math.max(1, Math.floor(all.length / n)); for (let i = 0; i < all.length && ids.length < n; i += step) ids.push(all[i]);
    (process.env.PLAY || '').split(',').filter(Boolean).forEach(p => all.filter(id => id.indexOf(p) === 0).forEach(id => { if (ids.indexOf(id) < 0) ids.push(id); })); }
  let done = 0;
  const played = (await Promise.all(pages.map((p, k) => (async () => { const out = [];
    for (let i = k; i < ids.length; i += pages.length) { const id = ids[i]; out.push([i, await p.evaluate(async id => { const sleep = ms => new Promise(r => setTimeout(r, ms)); const o = { id, steps: 0, noBox: 0 };
      try { document.dispatchEvent(new Event('wheel')); A.overlay = null; SRV.token = 't'; SRV.states = {}; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.session = 0; A.view = 'hub';
        const pre = id.split('.')[0], map = /^(LK|HEB)$/.test(pre) ? 'LK' : /^(READ|WRIT|LANG)$/.test(pre) ? 'READ' : /^(SS|SOC|FACT)$/.test(pre) ? 'SS' : /^(COMP|VOC)$/.test(pre) ? 'COMP' : pre; const subj = WORLD[pre] ? pre : WORLD[map] ? map : Object.keys(WORLD)[0];
        startMission(subj, id, 'skill'); const p = A.play;
        while (A.view === 'play' && A.play === p && o.steps < 80) { o.steps++; A.overlay = null; render(); const it = p.items[p.i]; const el = document.querySelector('.play'); if (!el) { o.err = 'no lesson screen at question ' + p.i; break; }
          if (it.phase !== 'check' && it.phase !== 'warm' && !/How to do it/i.test(el.innerHTML)) o.noBox++;
          p.shownAt = 0; p.cool = 0; if (it.t === 'write') p.text = new Array((it.min || 5) + 2).join('word ');
          answer(it.t === 'num' ? String(it.a) : it.t === 'write' ? p.text : it.correct); if (!(p.fb && p.fb.ok)) { o.err = 'right answer not accepted at question ' + p.i + ' (' + it.t + '): ' + String(it.q).slice(0, 60); break; }
          await sleep(5); next(); await sleep(5); }
        o.m = !!(A.st && A.st.skills[id] && A.st.skills[id].m); } catch (e) { o.err = String(e && e.stack || e).slice(0, 240); } return o; }, id)]); }
    return out; })()))).flat().sort((x, y) => x[0] - y[0]).map(x => x[1]);
  for (const r of played) { const id = r.id;
    if (!r.m || r.err) fail('lesson ' + id + ' did not play to mastered: ' + (r.err || 'not mastered after ' + r.steps + ' questions')); else done++;
    if (r.noBox) notes.push(id + ': ' + r.noBox + ' teach or practice screen(s) with no "How to do it" box'); }
  /* the boy's map home (GameMap.html), drawn from a real kmMyMap answer (tests/lib/kidmap.js, made-up boys): shows on the home with his
     goal now and the real skill, PLAY starts that lesson, a locked level says so, the doors still open, nothing shows off the home */
  try { const km = require('./lib/kidmap.js')();
    /* the 🎫 level check card (HoS 2026-11-20): with his level's check waiting, the goal card says so honestly and PLAY still leads on */
    const lcg = await pg.evaluate(async M => { const sleep = ms => new Promise(r => setTimeout(r, ms)), o = {};
      A.overlay = null; A.play = null; SRV.token = 't'; window.TL_MAP = M; A.st = loadStudent({ id: M.sid, name: 'Made-up Boy A' }); A.view = 'hub'; GM.world = 'MATH'; GM.sig = ''; render(); await sleep(50);
      const gm = document.getElementById('gm'); if (!gm) return o; const mt0 = gm.querySelector('.gm-hts [data-gmnav=map]'); if (mt0) { mt0.click(); await sleep(50); } o.h1 = (gm.querySelector('.gm-goal h1') || {}).textContent || ''; o.m = (gm.querySelector('.gm-goal .m') || {}).textContent || ''; o.node = (gm.querySelector('.gm-l.now') || {}).textContent || '';
      gm.querySelector('.gm-goal [data-gm=play]').click(); await sleep(400); o.play = A.view === 'play' && A.play && A.play.id; const cf = document.getElementById('pf-cf'); if (cf) cf.remove();
      A.play = null; A.view = 'hub'; window.TL_MAP = null; GM.world = ''; render(); await sleep(30); return o; }, km.map);
    const wantLc = km.map.names[km.map.subjects.MATH.now] || [];
    if (!km.map.lc || km.map.lc.MATH[km.map.subjects.MATH.level - 1] !== 1) fail('map home: the made-up boy\'s Math level should have a level check waiting');
    else if (!/Level Check/.test(lcg.h1) || lcg.m.indexOf('then: ' + wantLc[0]) < 0 || !/LEVEL CHECK/.test(lcg.node)) fail('map home: a level with its check waiting must show "🎫 Level Check · then: ' + wantLc[0] + '" (got "' + lcg.h1 + '" / "' + lcg.m + '" / "' + lcg.node + '")');
    else if (lcg.play !== km.map.subjects.MATH.now) fail('map home: PLAY on the level check card must lead on (got ' + lcg.play + ')');
    else ok('map home: a level whose check is waiting shows the 🎫 Level Check card and the lesson after it; PLAY leads into it');
    const passMap = JSON.parse(JSON.stringify(km.map)); if (passMap.lc) ['MATH', 'READ'].forEach(k => { passMap.lc[k] = passMap.lc[k].map(v => (v ? 2 : 0)); });
    const g = await pg.evaluate(async M => { const sleep = ms => new Promise(r => setTimeout(r, ms)), o = {};
      A.overlay = null; A.play = null; window.TL_MAP = M; A.st = loadStudent({ id: M.sid, name: 'Made-up Boy A' }); A.view = 'hub'; GM.sid = ''; render();  /* GM.sid = '': a fresh sign-in, which always lands on the home */ await sleep(50);
      const gm = document.getElementById('gm'); o.on = document.body.classList.contains('gm-on') && !!gm; if (!o.on) return o;
      /* HOME (HoS 2026-11-23, docs/HOME-SIMPLE-PROMPT.md): the first screen is six equal tiles, his work first and glowing, the Canteen its own door, no tab bar */
      const tl = [...gm.querySelectorAll('.gm-hts > .gm-ht')], sz = tl.map(x => { const r = x.getBoundingClientRect(), tp = x.querySelector('.top').getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), tp.height / r.height]; });
      o.home = { n: tl.length, first: tl[0] && tl[0].classList.contains('work') && tl[0].classList.contains('now') && /DO THIS NOW/i.test(tl[0].textContent), equal: sz.every(s => s[0] === sz[0][0] && s[1] === sz[0][1]), half: sz.every(s => s[2] > 0.44 && s[2] < 0.56),
        canteen: !!gm.querySelector('.gm-hts .gm-ht.food[data-cno=open]'), noBar: !document.querySelector('#gm-nav button') || getComputedStyle(document.getElementById('gm-nav')).display === 'none', others: gm.querySelectorAll('button:not(.gm-ht)').length };
      /* THE 3D CANTEEN (HoS 2026-11-23: "they can't see all the stuff about the canteen ... all its related aspects should all be available ... immersive 3D"):
         the Canteen tile opens the canteen room with its 4 doors (Buy food, Get money, My story, Lessons); the room never catches a tap; Home closes it */
      { const ft = gm.querySelector('.gm-hts .gm-ht.food'); if (ft) { ft.click(); await sleep(120); } const cs = document.getElementById('cn-shop'), room = cs && cs.querySelector('.cw-room'), roomOff = !!room && getComputedStyle(room).pointerEvents === 'none';
        const doors = cs ? [...cs.querySelectorAll('.cw-door')].map(d => d.dataset.p).join(',') : ''; let panels = '';
        if (cs) for (const p of ['cash', 'story', 'learn', 'buy']) { const d = cs.querySelector('.cw-door[data-p=' + p + ']'); if (d) { d.click(); await sleep(40); } panels += (cs.querySelector('.cw-door.on') || {}).dataset ? cs.querySelector('.cw-door.on').dataset.p : '-'; }
        const learn = cs ? (cs.querySelector('.cw-door[data-p=learn]').click(), await sleep(40), cs.querySelectorAll('[data-cno=lesson][data-c=LIFE]').length) : 0;
        const home = cs && cs.querySelector('[data-cno=close]'); if (home) { home.click(); await sleep(60); }
        o.home.cw = { open: !!(cs && cs.classList.contains('cw3d')), room: roomOff, doors, panels, learn, closed: !document.getElementById('cn-shop') && !document.body.classList.contains('cn-open') }; }
      const go = async t => { const h = document.querySelector('#gm .tlk-home[data-gmnav=home]'); if (h) { h.click(); await sleep(30); } const b = gm.querySelector('.gm-hts [data-gmnav=' + t + ']'); if (b) { b.click(); await sleep(30); } };
      await go('map');
      o.bright = document.body.classList.contains('gm-lite') && !document.body.classList.contains('w3d') && getComputedStyle(gm).backgroundImage.indexOf('255, 247, 214') >= 0;
      o.goal = (gm.querySelector('.gm-goal h1') || {}).textContent || ''; o.learn = (gm.querySelector('.gm-goal .learn') || {}).textContent || ''; o.nodes = gm.querySelectorAll('.gm-n').length; o.boss = gm.querySelectorAll('.gm-n.boss').length;
      /* button system step 5 (information is never a button): the money by the house is a kit money pill, not a button; every label a boy only reads is flat (no shadow, outline or hand pointer) */
      { const cs = e => getComputedStyle(e); o.info = { pill: gm.querySelectorAll('.gm-hud .tlk-pill.tlk-money').length, btn: gm.querySelectorAll('.gm-hud [data-gmnav=money], .gm-hud .gm-money').length,
        loud: [...gm.querySelectorAll('.tlk-pill,.tlk-box')].filter(e => !e.closest('button') && (cs(e).boxShadow !== 'none' || parseFloat(cs(e).borderTopWidth) > 0 || cs(e).cursor === 'pointer')).map(e => e.textContent.trim()).slice(0, 3) }; }
      o.tabs = gm.querySelectorAll('.tlk-home[data-gmnav=home]').length; { const hb = gm.querySelector('.tlk-home[data-gmnav=home]'), r = hb && hb.getBoundingClientRect(); o.homeBtn = !!r && r.left < 220 && r.top < 90 && !document.querySelector('#gm-nav button'); } o.plays = gm.querySelectorAll('.gm-play').length; o.worldTabsOnMap = gm.querySelectorAll('[data-gm=world]').length;
      const chg = gm.querySelector('[data-gmnav=subjects]'); if (chg) { chg.click(); await sleep(30); }
      const ch = gm.querySelector('[data-gm=world][data-k="K:CHU"]'); if (ch) { ch.click(); await sleep(30); const lk = gm.querySelector('.gm-n.u'); o.chu = (gm.querySelector('.gm-goal h1') || {}).textContent || ''; if (lk) { lk.click(); o.toast = (gm.querySelector('.gm-pop') || gm.querySelector('.gm-toast') || {}).textContent || ''; } const c2 = gm.querySelector('[data-gmnav=subjects]'); if (c2) { c2.click(); await sleep(30); } const mt = gm.querySelector('[data-gm=world][data-k="MATH"]'); if (mt) { mt.click(); await sleep(30); } }
      await go('more'); { const sub = (TL_MAP && Object.keys(TL_MAP.subjects || {}).length + Object.keys(TL_MAP.kodesh || {}).length) || 0;   /* MY PROFILE (HoS 2026-11-24): the page "My things" became */
        o.prof = { title: (gm.querySelector('.pr-title') || {}).textContent || '', levels: gm.querySelectorAll('.pr-lv').length, sub, badges: gm.querySelectorAll('.pr-b').length, out: !!gm.querySelector('.tlk-quiet[data-gm=pfout]'), lib: !!gm.querySelector('.pr-tile[data-gm=lib]'), tiles: gm.querySelectorAll('.pr-tile').length };
        const ch = gm.querySelector('[data-gm=pfav]'); if (ch) { ch.click(); await sleep(30); } const pk = document.querySelectorAll('#pr-pick [data-gm=pfavk]'); o.prof.pick = pk.length; if (pk[2]) { pk[2].click(); await sleep(30); }
        o.prof.av = (A.st && A.st.av) || ''; o.prof.big = (gm.querySelector('.pr-bav') || {}).textContent || ''; o.prof.pickGone = !document.getElementById('pr-pick');
        const hb = document.querySelector('#gm .tlk-home[data-gmnav=home]'); if (hb) { hb.click(); await sleep(30); } o.prof.dot = (document.querySelector('#pr-av') || {}).textContent || ''; o.prof.tile = (document.querySelector('.gm-ht.things b') || {}).textContent || ''; o.prof.onTile = (document.querySelector('.gm-ht.things .pr-tav') || {}).textContent || '';  await go('more');
        /* BACK (HoS 2026-11-24): a page reached from My profile has the kit's Back, and it returns to My profile; the home and a page opened from the home have none */
        o.prof.backOnProfile = !!gm.querySelector('[data-gm=gmback]'); const lt = gm.querySelector('.pr-tile[data-gm=lib]'); if (lt) { lt.click(); await sleep(30); }
        const bb = gm.querySelector('.tlk-back[data-gm=gmback]'); o.prof.backOnLib = !!bb; if (bb) { bb.click(); await sleep(30); } o.prof.backTo = GM.tab; }
      gm.querySelector('[data-gm=lib]').click(); await sleep(30); o.lib = GM.tab === 'lib' && document.body.classList.contains('gm-on');
      await go('games'); o.oldDoor = document.body.classList.contains('hf-games') || document.body.classList.contains('hf-lib') || document.body.classList.contains('hf-mine');
      await go('map'); o.back = document.body.classList.contains('gm-on');
      await go('missions'); o.rounds = gm.querySelectorAll('.gm-rd:not(.final):not(.rebbe)').length; o.live = gm.querySelectorAll('.gm-rd.live').length;
      await go('games'); o.locked = !!gm.querySelector('.gm-lock') && document.body.classList.contains('gm-on');
      await go('map');
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
      const H = g.home || {};
      if (!g.bright) fail('one look (HoS 2026-11-23): his map must be the bright page (light background, no 3D galaxy behind it)');
      if (H.n !== 6 || !H.first || !H.equal || !H.half || !H.canteen || !H.noBar || H.others) fail('home (HoS 2026-11-23): 6 equal tiles, icon on the top half, "My work · DO THIS NOW" first, a Canteen tile that opens the canteen, no tab bar and no other buttons (got ' + JSON.stringify(H) + ')');
      { const c = H.cw || {}; if (!c.open || !c.room || c.doors !== 'buy,cash,story,learn' || c.panels !== 'cashstorylearnbuy' || c.learn < 5 || !c.closed) fail('3D canteen (HoS 2026-11-23): the Canteen tile must open the 3D canteen room (never catching a tap) with 4 doors Buy food / Get money / My story / Lessons that each open, the money lessons listed, and Home closing it (got ' + JSON.stringify(c) + ')');
        else ok('3D canteen: the Canteen tile opens the 3D room; doors Buy food, Get money, My story, Lessons (' + c.learn + ' money lessons) each open; Home closes it'); }
      { const I = g.info || {}; if (I.pill !== 1 || I.btn || (I.loud || []).length) fail('button system step 5: the money by the house must be ONE kit money pill and not a button, and no label may look like a button (got ' + JSON.stringify(I) + ')');
        else ok('button system step 5: the money by the house is a flat kit money pill (not a button); every label on My map is flat'); }
      if (g.tabs !== 1 || !g.homeBtn) fail('button system step 2: every page but the home has ONE kit house top left and no HOME bar (got ' + g.tabs + ' houses, top left: ' + g.homeBtn + ')');
      if (g.plays !== 1 || g.worldTabsOnMap) fail('one button, one job: the map has ONE big PLAY and no subject tabs (got ' + g.plays + ' PLAY, ' + g.worldTabsOnMap + ' subject tabs)');
      { const P = g.prof || {};   /* MY PROFILE (HoS 2026-11-24): replaces My things; his picture is kept in his state and shown on the page, the home tile and the small circle by Workbook */
        if (P.title !== 'My profile' || P.tile !== 'My profile') fail('My profile (HoS 2026-11-24): the home tile and the page must be called "My profile" (got "' + P.tile + '" / "' + P.title + '")');
        else if (!P.sub || P.levels !== P.sub) fail('My profile: one level row for every subject on his map (' + P.sub + '), got ' + P.levels);
        else if (P.badges !== 8 || !P.out || !P.lib || P.tiles < 6) fail('My profile: the 8 badges, a quiet Sign out, All my lessons and the doors from My stuff must be there (got ' + JSON.stringify(P) + ')');
        else if (P.pick !== 16 || !P.av || P.big !== P.av || !P.pickGone || P.dot !== P.av || P.onTile !== P.av) fail('My profile: Change opens 16 pictures; the one he taps is kept and shows on the page, the home tile and the circle by Workbook (got ' + JSON.stringify(P) + ')');
        else if (!P.backOnLib || P.backTo !== 'more' || P.backOnProfile) fail('Back (HoS 2026-11-24): All my lessons opened from My profile must have the round Back, and it must return to My profile; My profile itself (opened from the home) has none (got ' + JSON.stringify({ lib: P.backOnLib, to: P.backTo, onProfile: P.backOnProfile }) + ')');
        else ok('My profile: home tile and page named My profile; a level row per subject, 8 badges, Sign out, the old doors; his picture (16 to pick) shows on the page, the tile and the circle by Workbook; Back from All my lessons returns to My profile'); }
      if (g.goal === want[0] && g.play === km.map.subjects.MATH.now && g.noMap && g.lib && g.back && g.rounds === 3 && g.locked && g.tabs === 1 && g.plays === 1 && H.n === 6 && H.equal && H.canteen) ok('home: 6 equal tiles (work first, Canteen its own door), the kit house top left elsewhere; map: one PLAY, Change subject; My profile; next level + real skill, path with BOSS, PLAY starts it, locked says so, All lessons is a game screen, no old pages; missions: 3 rounds, Arcade locked until cleared'); }
    /* TODAY'S LIST on My work (Core Growth job D, tests/lib/dailyplan.js) */
    try { const dp = await require('./lib/dailyplan.js').page(pg, km.map); dp.fails.forEach(fail); dp.oks.forEach(ok); } catch (e) { fail("today's list page test crashed: " + String(e && e.stack || e).slice(0, 300)); }
  }
  catch (e) { fail('map home test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  /* CORE GROWTH (tests/lib/core.js, job T): every core lesson reached the page, no clash with an existing lesson */
  try { const cg = await require('./lib/core.js').page(pg); cg.fails.forEach(fail); cg.oks.forEach(ok); } catch (e) { fail('core skills page check crashed: ' + String(e).slice(0, 200)); }
  /* ONE BITE player (tests/lib/onebite.js) */
  try { const ob = await require('./lib/onebite.js')(pg, pages.slice(1)); ob.fails.forEach(fail); ob.oks.forEach(ok); Object.assign(report.counts, ob.counts); }
  catch (e) { fail('One Bite test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  /* PICS-2 teaching pictures (tests/lib/teachpics.js): TODAY WE LEARN, WATCH ME and passages show a linked picture and do not break the screen */
  try { const tp = await require('./lib/teachpics.js')(pg); tp.fails.forEach(fail); tp.oks.forEach(ok); }
  catch (e) { fail('teaching pictures test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  /* QUALITY GATE + K-1 GAMES ONLY (HoS 2026-11-22: "we need guardrails"): new lessons must meet the quality rules, listed ones may not get worse */
  try { const q = await require('./lib/obquality.js')(pg); q.fails.forEach(fail); q.oks.forEach(ok); Object.assign(report.counts, q.counts); } catch (e) { fail('quality gate crashed: ' + String(e).slice(0, 200)); }
  try { const k = await require('./lib/k1home.js')(pg); k.fails.forEach(fail); k.oks.forEach(ok); } catch (e) { fail('K-1 games-only check crashed: ' + String(e).slice(0, 200)); }
  try { const w = await require('./lib/warp3d.js')(pg); w.fails.forEach(fail); w.oks.forEach(ok); } catch (e) { fail('3D sign-in/home check crashed: ' + String(e).slice(0, 200)); }
  /* BLOCK BUILDERS workbook (tests/lib/blockbuilders.js, HoS 2026-11-22) */
  try { const bb = await require('./lib/blockbuilders.js')(pg); bb.fails.forEach(fail); bb.oks.forEach(ok); Object.assign(report.counts, bb.counts); }
  catch (e) { fail('Block Builders test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  /* Store Fun tab (tests/lib/storefx.js, HoS 2026-11-22): no two items share a name, a picture, a tap blast, a trail or nearly the same app colors */
  /* THE BUTTON SYSTEM (tests/lib/uikit.js, src/UiKit.html, HoS 2026-11-23): every part of the kit, measured inside the real page */
  try { const uk = await require('./lib/uikit.js')(pg); uk.fails.forEach(fail); uk.oks.forEach(ok); }
  catch (e) { fail('button system test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  /* CHANUKAH OLIVE OIL (tests/lib/oiltrail.js, src/OilTrail.html, HoS 2026-11-23) */
  try { const ot = await require('./lib/oiltrail.js')(pg); ot.fails.forEach(fail); ot.oks.forEach(ok); }
  catch (e) { fail('olive oil test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  /* CHANUKAH SUFGANIYAH JELLY TRAIL (tests/lib/jellytrail.js, src/JellyTrail.html, HoS 2026-11-24) */
  try { const jt = await require('./lib/jellytrail.js')(pg); jt.fails.forEach(fail); jt.oks.forEach(ok); } catch (e) { fail('jelly trail test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  try { const sf = require('./lib/storefx.js'), n = sf.names(), e = await sf.effects(pg); n.fails.concat(e.fails).forEach(fail);
    if (!n.fails.length && !e.fails.length) ok('store Fun tab: ' + n.count + ' items, no two share a name, picture, tap blast, trail or app colors (closest app colors: ' + (e.closest && e.closest.d) + ')'); }
  catch (e) { fail('store check crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  report.counts.lessonsPlayed = ids.length; report.counts.lessonsMastered = done; report.counts.screensWithNoHowToBox = notes.length; if (done === ids.length) ok(done + ' of ' + ids.length + ' sampled lessons played to mastered');
  (await pg.evaluate(() => window.__srvErr)).forEach(e => fail('server call failed: ' + e)); errs.forEach(e => fail('kid page: ' + e)); await ctx.close();
  for (const P of extra) { (await P.pg.evaluate(() => window.__srvErr)).forEach(e => fail('server call failed: ' + e)); P.errs.forEach(e => fail('kid page: ' + e)); await P.ctx.close(); }
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
  try { const v = require('./lib/v2check.js')(); v.fails.forEach(fail); v.oks.forEach(ok); } catch (e) { fail('2.0 check crashed: ' + String(e).slice(0, 200)); }
  try { const c = await require('./lib/canteen.js')(); c.fails.forEach(fail); if (!c.fails.length) ok('canteen on the Firebase engine: sell, same sale charged once, crew cashier, two kiosks at once, last sale, undo'); report.timings.canteenSaleMs = c.ms.sale; }
  catch (e) { fail('canteen test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  try { const sl = await require('./lib/saveload.js')(); sl.fails.forEach(fail); sl.oks.forEach(ok); }   /* a class saving lessons at once: no "busy" (MS_State/MS_Evidence row-merge) */
  catch (e) { fail('class saving test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  try { const cs = require('./lib/core.js').server(); cs.fails.forEach(fail); cs.oks.forEach(ok); } catch (e) { fail('core skills check crashed: ' + String(e).slice(0, 200)); }   /* CORE GROWTH: the one way to add a skill (src/CoreSkills.js) */
  try { const k = require('./lib/kidmap.js')(); k.fails.forEach(fail); if (!k.fails.length) ok("boy's own map (kmMyMap): rides with sign-in, only his own data, goal now, unit, Kodesh, growth; staff and bad tokens refused"); report.timings.kidMapMs = k.ms.map; report.timings.kidSignInWithMapMs = k.ms.signIn; }
  catch (e) { fail('kid map test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  try { const sc = await require('./lib/staffcard.js')(browser); sc.fails.forEach(fail); sc.oks.forEach(ok); }
  catch (e) { fail('staff card test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  try { const d = require('./lib/dailyplan.js').server(); d.fails.forEach(fail); d.oks.forEach(ok); }
  catch (e) { fail("today's list test crashed: " + String(e && e.stack || e).slice(0, 300)); }
  try { const fc = require('./lib/flagchecker.js')(); fc.fails.forEach(fail); fc.oks.forEach(ok); } catch (e) { fail('flag checker check crashed: ' + String(e).slice(0, 200)); }   /* HoS 2026-11-24: docs/FLAG-CHECKER.md */
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
