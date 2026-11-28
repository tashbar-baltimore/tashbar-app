/* 2.0 TEST (v2/tests/, run by tests/run.js): THE K-1 GAMES PLAYED AS A BOY (made-up boys only, on the real server code via server/runtime.js; nothing real is touched).
   Builds v2/ and opens it in a browser at Chromebook size, with the school server answered by the pretend server.
   Checks: a wrong code is refused; a Kindergarten boy gets only the full-screen game path, Kindergarten games only, in each
   game pack's own order, game 1 open and the rest locked; PLAY opens a real game window above everything with the full-screen
   styles and the voice bridge; a game's stars are saved into HIS record without losing anything 1.0 saved there; a Grade 1 boy
   gets only Grade 1 games; a Grade 3 boy is told his grade is coming and pointed to the regular app; sign-out returns to sign-in.
   Saves pictures in tests/out/v2-*.png (Chromebook and phone). Returns { fails, oks }. */
const path = require('path'), fs = require('fs'), os = require('os'), vm = require('vm'), cp = require('child_process');
const R = path.join(__dirname, '..', '..'), { createRuntime } = require(path.join(R, 'server', 'runtime.js'));
module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 as a boy: ' + m);
  const BOOK = 'SELFTEST_V2', store = { books: {}, props: { SCHOOL_STAGING_DATABASE_ID: BOOK } };
  const rt = createRuntime({ store }); if (rt.loadErrors.length) { bad('server failed to load: ' + rt.loadErrors[0]); return out; }
  const call = (fn, a) => rt.call(fn, a);
  const TABLES = JSON.parse(vm.runInContext('JSON.stringify(TABLES)', rt.ctx)), bk = store.books[BOOK] = { tabs: {}, order: [] };
  TABLES.forEach(n => { bk.tabs['TL ' + n] = { rows: [['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']] }; bk.order.push('TL ' + n); });
  call('msBootstrap', []);
  const H = (s, c) => vm.runInContext('msHash_(' + JSON.stringify(s) + ',' + JSON.stringify(c) + ')', rt.ctx);
  const boys = [['TESTV2K', 'Made-up Kinder Boy', '7311', 'grade K'], ['TESTV2G1', 'Made-up First Boy', '7312', 'grade 1'], ['TESTV2G3', 'Made-up Third Boy', '7313', 'grade 3']];
  const roster = bk.tabs.MS_Roster.rows;
  boys.forEach((b, i) => { const row = roster[0].map(() => ''); row[0] = b[0]; row[1] = b[1]; row[5] = 'v2salt' + i; row[6] = H('v2salt' + i, b[2]); row[7] = true; row[8] = b[3]; roster.push(row); });
  bk.tabs.MS_State.rows.push(['TESTV2K', JSON.stringify({ id: 'TESTV2K', skills: { 'MATH.NUM.L01.01': { m: true, at: 1, stars: 3 } }, xp: 42 }), new Date(), 1]);

  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'v2play-'));
  try { cp.execFileSync(process.execPath, [path.join(R, 'v2', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: dist, V2_API_URL: 'http://api.test/' }), stdio: 'pipe' }); }
  catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
  const shots = path.join(R, 'tests', 'out'); fs.mkdirSync(shots, { recursive: true });
  async function open(w, h) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }), pg = await ctx.newPage(), errs = [];
    pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await pg.route('**/*', async r => { const u = new URL(r.request().url());
      if (u.host === 'api.test') { let res; try { const b = JSON.parse(r.request().postData() || '{}'); const x = call(b.fn, b.args || []); res = x && x.error ? { ok: false, error: x.error } : { ok: true, result: x && x.result !== undefined ? x.result : x }; } catch (e) { res = { ok: false, error: String(e.message || e) }; }
        return r.fulfill({ contentType: 'application/json', body: JSON.stringify(res) }); }
      if (u.host === 'v2.test') { const f = path.join(dist, u.pathname === '/' ? 'index.html' : u.pathname.slice(1)); if (f.startsWith(dist) && fs.existsSync(f)) return r.fulfill({ path: f }); return r.fulfill({ status: 404, body: '' }); }
      return r.abort(); });
    await pg.goto('http://v2.test/'); await pg.waitForSelector('.signin .pad', { timeout: 15000 });
    return { ctx, pg, errs };
  }
  const code = async (pg, c) => { for (const d of c) await pg.click('.key[data-k="' + d + '"]'); };
  let w;
  try {
    w = await open(1366, 768); const pg = w.pg;
    await pg.screenshot({ path: path.join(shots, 'v2-signin-chromebook.png') });
    await code(pg, '9999'); await pg.waitForSelector('.err', { timeout: 8000 }).catch(() => bad('a wrong code shows no message'));
    await code(pg, '7311'); await pg.waitForSelector('#k1o .k1-play', { timeout: 15000 });
    const k = await pg.evaluate(() => ({ tiles: [...document.querySelectorAll('#k1o .k1-t')].map(t => t.dataset.id), locked: document.querySelectorAll('#k1o .k1-t.lock').length,
      want: KL.list().map(x => x[0]).filter(id => /\.L01\./.test(id)), subj: [...document.querySelectorAll('.k1-s')].map(b => b.dataset.s), text: document.body.innerText,
      others: [...document.body.children].filter(e => e.id !== 'app' && e.tagName !== 'SCRIPT' && getComputedStyle(e).display !== 'none').map(e => e.id || e.className || e.tagName) }));
    if (!k.tiles.length) bad('the Kindergarten path has no games');
    if (k.tiles.some(id => !/\.L01\./.test(id))) bad('a game that is not Kindergarten level is on the K path');
    if (JSON.stringify(k.tiles) !== JSON.stringify(k.want)) bad('the K Numbers path is not the game pack\'s own skill order');
    if (k.locked !== k.tiles.length - 1) bad('a new K boy should have game 1 open and the rest locked (' + k.locked + ' locked of ' + k.tiles.length + ')');
    if (JSON.stringify(k.subj) !== '["MATH","READ","LK"]') bad('K subjects should be Numbers, ABC, Kriyah (got ' + k.subj + ')');
    if (k.others.length) bad('something else is on the screen: ' + k.others.join(', '));
    if (/\bbites?\b/i.test(k.text)) bad('the word "bite" shows');
    await pg.screenshot({ path: path.join(shots, 'v2-k1-path-chromebook.png') });
    await pg.click('#k1o .k1-play', { force: true }); await pg.waitForTimeout(700);
    const g = await pg.evaluate(() => { const ov = ['klov', 'krov', 'kkov', 'kkov2', 'g1mov', 'g1rov'].map(i => document.getElementById(i)).find(Boolean); if (!ov) return null;
      const f = ov.querySelector('iframe'), r = ov.getBoundingClientRect(), top = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
      return { src: (f && f.srcdoc) || '', full: r.width >= innerWidth - 2 && r.height >= innerHeight - 2, onTop: !!(top && ov.contains(top)) }; });
    if (!g) bad('PLAY did not open a real game'); else {
      if (!g.full || !g.onTop) bad('the game window does not fill the screen above everything');
      if (g.src.indexOf('id="k1fit"') < 0) bad('the game does not get the full-screen styles');
      if (g.src.indexOf('k1say') < 0) bad('the game does not get the voice bridge'); }
    await pg.waitForTimeout(1500); await pg.screenshot({ path: path.join(shots, 'v2-k1-game-chromebook.png') });
    await pg.click('.klx').catch(() => {}); await pg.waitForTimeout(400);
    const first = k.tiles[0];
    await pg.evaluate(id => { A.st.klm = A.st.klm || {}; A.st.klm[id] = 3; saveStudent(A.st); }, first); await pg.waitForTimeout(1500);
    const saved = JSON.parse((bk.tabs.MS_State.rows.find(r => r[0] === 'TESTV2K') || [])[1] || '{}');
    if (!saved.klm || saved.klm[first] !== 3) bad('the game\'s stars were not saved in his record');
    if (!saved.skills || !saved.skills['MATH.NUM.L01.01'] || saved.xp !== 42) bad('saving from 2.0 lost something 1.0 had saved in his record');
    const after = await pg.evaluate(() => ({ done: document.querySelectorAll('#k1o .k1-t.done').length, locked: document.querySelectorAll('#k1o .k1-t.lock').length, n: document.querySelectorAll('#k1o .k1-t').length }));
    if (after.done !== 1 || after.locked !== after.n - 2) bad('after passing game 1, game 1 should show done and game 2 open (' + JSON.stringify(after) + ')');
    await pg.click('.k1-out'); await pg.waitForSelector('.signin .pad', { timeout: 5000 }).catch(() => bad('Bye does not return to sign-in'));
    await code(pg, '7312'); await pg.waitForSelector('#k1o .k1-t', { timeout: 15000 });
    const g1 = await pg.evaluate(() => [...document.querySelectorAll('#k1o .k1-t')].map(t => t.dataset.id));
    if (!g1.length || g1.some(id => !/\.L02\./.test(id))) bad('the Grade 1 path should show only Grade 1 (Level 2) games');
    await pg.click('.k1-out'); await pg.waitForSelector('.signin .pad', { timeout: 5000 });
    await code(pg, '7313'); await pg.waitForSelector('.note', { timeout: 15000 });
    const n3 = await pg.evaluate(() => document.querySelector('.note').innerText);
    if (!/coming to 2\.0/i.test(n3) || !/regular app/i.test(n3)) bad('a Grade 3 boy should be told his grade is coming and sent to the regular app (saw: ' + n3.replace(/\s+/g, ' ').slice(0, 120) + ')');
    if (w.errs.length) bad('page errors: ' + w.errs.slice(0, 2).join(' | '));
    await w.ctx.close();
    const ph = await open(390, 844); await code(ph.pg, '7311'); await ph.pg.waitForSelector('#k1o .k1-play', { timeout: 15000 });
    await ph.pg.screenshot({ path: path.join(shots, 'v2-k1-path-phone.png') });
    const wide = await ph.pg.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1); if (wide) bad('the phone screen scrolls sideways');
    if (ph.errs.length) bad('page errors on phone: ' + ph.errs.slice(0, 2).join(' | '));
    await ph.ctx.close();
  } catch (e) { bad('crashed: ' + String(e).slice(0, 240)); try { if (w) await w.ctx.close(); } catch (x) {} }
  fs.rmSync(dist, { recursive: true, force: true });
  if (!out.fails.length) out.oks.push('2.0 as a boy: wrong code refused; K boy gets only the full-screen K game path in skill order (game 1 open, rest locked); PLAY opens a real game full screen with the voice bridge; stars saved into his record without losing 1.0 data; Grade 1 boy gets Grade 1 games; Grade 3 boy is pointed to the regular app; pictures in tests/out/v2-*.png');
  return out;
};
