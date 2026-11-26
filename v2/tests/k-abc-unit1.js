/* 2.0 TEST (v2/tests/, run by tests/run.js): Kindergarten ABC, Unit 1 "Ears On" (v2/app/k-abc/play.html?u=1&g=..., units/u1.js).
   Builds v2/ and plays EVERY Unit 1 game to the end as a made-up boy, with a real mouse (taps, drags, finger tracing), ?fast=1,
   at Chromebook size (1366x768) and phone size (390x844):
   - no page errors, no outside websites, the 3D world is not blank, the game reaches its stars;
   - on the first round of each game he makes one wrong move first: a gentle fix must follow (a kind spoken line), never a dead end;
   - a boy who gets everything right first time earns 3 stars;
   - every spoken line is 12 words or fewer, never says "bite", never a letter name, never the Divine Name;
   - every button he can see is 64 px or more;
   - the menu has a picture button for every Unit 1 game in order, each opening a game that exists.
   Returns { fails, oks }. The play() helper is also used to take the pictures in v2/screens/k-abc-unit1/. */
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const R = path.join(__dirname, '..', '..');
const UNIT = 1, GAMES = ['opener', 'rhyme', 'clap', 'sort', 'train', 'paths', 'fixit', 'review', 'check'];
const NOWRONG = ['opener', 'paths'];   /* games with nothing a boy can do wrong (a lesson, a trace) */

function build() { const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'v2abc-'));
  cp.execFileSync(process.execPath, [path.join(R, 'v2', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: dist }), stdio: 'pipe' }); return dist; }
async function open(browser, dist, w, h, url) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: false }), pg = await ctx.newPage(), errs = [], outside = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await pg.route('**/*', r => { const u = new URL(r.request().url());
    if (u.host === 'v2.test') { const f = path.join(dist, decodeURIComponent(u.pathname.slice(1))); if (f.startsWith(dist) && fs.existsSync(f) && fs.statSync(f).isFile()) return r.fulfill({ path: f });
      if (f.startsWith(dist) && fs.existsSync(path.join(f, 'index.html'))) return r.fulfill({ path: path.join(f, 'index.html') }); return r.fulfill({ status: 404, body: '' }); }
    if (!/^tts-/.test(u.host)) outside.push(u.host); return r.abort(); });
  await pg.goto('http://v2.test' + url);
  return { ctx, pg, errs, outside };
}
async function act(pg, a) {
  if (!a) return;
  if (a.kind === 'tap') { await pg.mouse.click(a.x, a.y); return; }
  if (a.kind === 'drag') { await pg.mouse.move(a.x, a.y); await pg.mouse.down(); for (let i = 1; i <= 4; i++) await pg.mouse.move(a.x + (a.x2 - a.x) * i / 4, a.y + (a.y2 - a.y) * i / 4); await pg.mouse.up(); return; }
  if (a.kind === 'trace') { const strokes = await pg.evaluate(() => window.__abc.traceStrokes ? window.__abc.traceStrokes() : [window.__abc.tracePts()]);   /* one finger stroke per letter stroke */
    for (const pts of strokes) { await pg.mouse.move(pts[0].x, pts[0].y); await pg.mouse.down();
      for (let i = 4; i < pts.length; i += 4) await pg.mouse.move(pts[i].x + 3, pts[i].y - 2); await pg.mouse.move(pts[pts.length - 1].x, pts[pts.length - 1].y); await pg.mouse.up(); await pg.waitForTimeout(60); } }
}
/* play one game to the end. opt.wrong: make one wrong move in the first round; opt.shot(name): called at key moments */
async function play(pg, opt = {}) {
  await pg.waitForFunction(() => window.__abc && (window.__abc.ready || /nogl|nounit|nogame/.test(window.__abc.name)), null, { timeout: 60000, polling: 100 });
  const nm = await pg.evaluate(() => window.__abc.name); if (/nogl|nounit|nogame/.test(nm)) throw new Error('did not start: ' + nm);
  if (opt.shot) await opt.shot('start');
  await pg.click('#play', { force: true });
  let wronged = !opt.wrong, waitWrong = 0, shotRounds = new Set(); const t0 = Date.now();
  while (Date.now() - t0 < (opt.limit || 240000)) {
    const st = await pg.evaluate(() => ({ name: window.__abc.name, step: window.__abc.step || 0, round: window.__abc.round || 0, fixes: window.__abc.fixes, next: window.__abc.nextScreen(), wrong: window.__abc.wrongScreen ? window.__abc.wrongScreen() : null }));
    if (process.env.ABC_DEBUG) console.log((Date.now() % 100000) + ' ' + st.name + ' r' + st.round + ' step' + st.step + ' ' + (st.next && st.next.kind));
    if (st.name === 'end') break;
    if (opt.stopAt && st.round >= opt.stopAt) return pg.evaluate(() => ({ partial: true, items: window.__abc.items(), said: window.__abc.said.slice(), fixes: window.__abc.fixes, mendy: window.__abc.mendyScreen() }));
    if (!st.next) { await pg.waitForTimeout(60); continue; }
    if (opt.shot && !shotRounds.has(st.round)) { shotRounds.add(st.round); await opt.shot('round' + st.round); }
    if (!wronged && !st.wrong && st.next.kind !== 'trace') { waitWrong = waitWrong || Date.now(); if (Date.now() - waitWrong < 8000) { await pg.waitForTimeout(100); continue; } }   /* moving pictures: wait a moment for a wrong one to come by */
    if (!wronged && st.wrong) { wronged = true; await act(pg, st.wrong);
      await pg.waitForFunction(f => window.__abc.fixes > f, st.fixes, { timeout: 4000, polling: 100 }).catch(() => {});
      if (opt.shot) await opt.shot('fix'); continue; }
    await act(pg, st.next);
    await pg.waitForFunction(s => window.__abc.step !== s || window.__abc.name === 'end', st.step, { timeout: 5000, polling: 50 }).catch(() => {});
  }
  await pg.waitForSelector('#end.on', { timeout: 30000 });
  if (opt.shot) await opt.shot('end');
  return pg.evaluate(() => ({ stars: window.__abc.stars, fixes: window.__abc.fixes, rounds: window.__abc.rounds, said: window.__abc.said.slice(), helps: window.__abc.helps }));
}
const checkLines = (said, bad, label) => said.forEach(t => {
  if (t.split(/\s+/).filter(Boolean).length > 12) bad(label + ': a spoken line is longer than 12 words: "' + t + '"');
  if (/\bbites?\b/i.test(t)) bad(label + ': the voice says the word "bite"');
  if (/\b(ess|em|ay|tee|pee|dee)\b/i.test(t) || /\bletter [a-z]\b/i.test(t) || /(^|[^'\w])[b-hj-zB-HJ-Z](?=[\s!,.?]|$)/.test(t) || /\b[aA][!,]/.test(t)) bad(label + ': the voice may say a letter name: "' + t + '"');   /* letters are heard as pure sounds (made by the device), never as single spoken letters */
  if (/\bG-?d\b|\bGod\b/i.test(t)) bad(label + ': the voice says the Divine Name'); });

/* the test for one unit: every game in order (shared by k-abc-unit2.js and later units) */
function unitTest(UNIT, GAMES, o = {}) { const NOWRONG = o.noWrong || [], NAME = o.name || ('unit ' + UNIT);
 return async function (shared) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 K ABC ' + NAME + ': ' + m);
  /* its own browser, closed at the end: the 3D games use a lot of memory, which must not stay behind for the tests that run after */
  let browser = shared, own = null; try { own = await require('playwright').chromium.launch(); browser = own; } catch (e) {}
  try { return await body(browser, out, bad); } finally { if (own) await own.close().catch(() => {}); } };
 async function body(browser, out, bad) {
  let dist; try { dist = build(); } catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
  for (const f of ['play.html', 'game.js', 'cast.js', 'props.js', 'scenes.js', 'units/u' + UNIT + '.js', 'art/mendy-idle.webp', 'art/mendy-talk.webp'])
    if (!fs.existsSync(path.join(dist, 'k-abc', f))) bad(f + ' is not in the built site');
  /* phone size: the first rounds of every game, with a wrong move; every picture and Mendy must be on the screen */
  for (const g of GAMES) { const w = 390, h = 844, label = g + ' ' + w + 'x' + h, { ctx, pg, errs, outside } = await open(browser, dist, w, h, '/k-abc/play.html?u=' + UNIT + '&g=' + g + '&fast=1');
    try { const r = await play(pg, { wrong: !NOWRONG.includes(g), stopAt: 2 });
      if (r.partial) { r.items.forEach(it => { if (it.roam) return; /* pictures that float in and out by design (a parade, bubbles, butterflies) */ if (it.x < 0 || it.x > w || it.y < 0 || it.y > h) bad(label + ': the picture "' + it.name + '" is off the screen'); });
        if (r.mendy.x < 0 || r.mendy.x > w || r.mendy.y < 0 || r.mendy.y > h) bad(label + ': Mendy is off the screen'); }
      checkLines(r.said, bad, label);
    } catch (e) { bad(label + ': ' + String(e).slice(0, 220)); }
    errs.forEach(e => bad(label + ': page error: ' + e)); outside.forEach(x => bad(label + ': reached an outside website: ' + x)); await ctx.close(); }
  /* Chromebook size: every game to the end */
  for (const [w, h] of [[1366, 768]]) for (const g of GAMES) {
    const label = g + ' ' + w + 'x' + h, { ctx, pg, errs, outside } = await open(browser, dist, w, h, '/k-abc/play.html?u=' + UNIT + '&g=' + g + '&fast=1');
    try {
      const wrong = !NOWRONG.includes(g) && g !== 'check';   /* the check is played perfectly: 3 stars */
      const r = await play(pg, { wrong });
      const buf = await pg.screenshot(); if (buf.length < 15000) bad(label + ': the end screen looks blank');
      if (wrong && r.fixes < 1) bad(label + ': a wrong move got no gentle fix');
      if (!(r.stars >= 1)) bad(label + ': no stars at the end');
      if (!wrong && r.stars !== 3) bad(label + ': all right first time, but only ' + r.stars + ' stars');
      if (!r.said.length) bad(label + ': nothing was spoken');
      checkLines(r.said, bad, label);
      const small = await pg.evaluate(() => [...document.querySelectorAll('.btn')].filter(b => getComputedStyle(b).opacity > 0.5 && getComputedStyle(b).pointerEvents !== 'none').map(b => b.getBoundingClientRect()).filter(r => r.width && (r.width < 64 || r.height < 64)).length);
      if (small) bad(label + ': ' + small + ' button(s) smaller than 64 px');
      const nx = await pg.evaluate(() => document.getElementById('next').getAttribute('href'));
      if (!fs.existsSync(path.join(dist, 'k-abc', nx.split('?')[0] || 'index.html')) && nx !== './') bad(label + ': the next button goes nowhere');
    } catch (e) { bad(label + ': ' + String(e).slice(0, 220)); }
    errs.forEach(e => bad(label + ': page error: ' + e)); outside.forEach(x => bad(label + ': reached an outside website: ' + x));
    await ctx.close();
  }
  /* the menu: Unit 1 has a picture button for every game, in order */
  { const { ctx, pg, errs } = await open(browser, dist, 1366, 768, '/k-abc/');
    try { await pg.waitForSelector('a.game', { timeout: 20000 });
      const tiles = await pg.evaluate(u => [...document.querySelectorAll('[data-unit="' + u + '"] a.game')].map(a => ({ href: a.getAttribute('href'), img: a.querySelector('img') && a.querySelector('img').getAttribute('src') })), String(UNIT));
      const ids = tiles.map(t => (t.href.match(/[?&]g=([a-z0-9-]+)/) || [])[1]);
      if (ids.join() !== GAMES.join()) bad('the menu shows Unit ' + UNIT + ' games ' + ids.join(', ') + ' (should be ' + GAMES.join(', ') + ')');
      tiles.forEach(t => { if (!t.img || !fs.existsSync(path.join(dist, 'k-abc', t.img))) bad('the menu button ' + t.href + ' has no picture'); });
      errs.forEach(e => bad('menu: page error: ' + e));
    } catch (e) { bad('menu: ' + String(e).slice(0, 200)); } finally { await ctx.close(); } }
  fs.rmSync(dist, { recursive: true, force: true });
  if (!out.fails.length) out.oks.push('2.0 K ABC ' + NAME + ': all ' + GAMES.length + ' games play to the end at Chromebook and phone size with a real mouse; wrong moves get a gentle fix; perfect play earns 3 stars; short spoken lines; big buttons; menu in order');
  return out;
 }
}
module.exports = unitTest(1, GAMES, { noWrong: NOWRONG, name: 'unit 1 (Ears On)' });
module.exports.unitTest = unitTest;
module.exports.play = play; module.exports.open = open; module.exports.build = build; module.exports.GAMES = GAMES;
