/* Keser Girls 3.0, THE STAFF PAGE (keser/app/staff/): played by MADE-UP staff with MADE-UP girls, at Chromebook (1366x768) and phone size.
   The page talks to the real girls' records code (server/keser.js) on a stand-in database, so every step is the real server's answer:
   - first time: the setup word and a name make the lead's code (shown once); she signs in on the one code pad;
   - home: one button per job (My girls, Add a girl, Add staff for the lead);
   - Add a girl: first name, grade, class, crown colour; her code shows once, then never again (not in My girls, not on her card);
   - her card: profile, Change, New code (the old code stops), and what she did: finished, not done yet, found hard;
   - Add staff; Sign out; a wrong code; nothing off the screen, nothing too small to tap, no page errors, no money or points.
   Pictures of every screen go to tests/out/keser-staff-*.png. */
const path = require('path'), os = require('os'), fs = require('fs'), cp = require('child_process'), http = require('http');
const ROOT = path.join(__dirname, '..', '..');
const K = require(path.join(ROOT, 'server', 'keser.js')), { fake } = require(path.join(ROOT, 'server', 'fakefs.js'));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png' };
module.exports = async (browser) => {
  const fails = [], oks = [], out = fs.mkdtempSync(path.join(os.tmpdir(), 'keser-staff-'));
  cp.execFileSync(process.execPath, [path.join(__dirname, '..', 'build.js')], { env: Object.assign({}, process.env, { KESER_OUT: out }), stdio: 'pipe' });
  const srv = http.createServer((q, r) => { const f = path.join(out, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
    if (!f.startsWith(out) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(ok => srv.listen(0, '127.0.0.1', ok)); const url = 'http://127.0.0.1:' + srv.address().port + '/staff/';
  const shots = path.join(ROOT, 'tests', 'out'); fs.mkdirSync(shots, { recursive: true });
  try {
    for (const [tag, w, h] of [['chromebook', 1366, 768], ['phone', 390, 844]]) {
      const db = fake(); db.databaseId = 'keser'; db.docs.set('sys/setup', { word: 'made-up-setup-word' });
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }), pg = await ctx.newPage(), errs = [];
      pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
      pg.on('dialog', d => d.accept());
      await pg.addInitScript(() => { window.KESER_API = 'http://keser-api.test/'; });
      await pg.route('http://keser-api.test/**', async rt => { const body = JSON.parse(rt.request().postData() || '{}');
        const res = await K.route(body, '10.0.0.' + (tag === 'phone' ? 2 : 1), () => db, ''); await rt.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(res) }); });
      const say = m => fails.push('Keser staff (' + tag + '): ' + m);
      const on = () => pg.evaluate(() => (document.querySelector('section.on') || {}).id);
      const snap = async name => (await pg.waitForTimeout(400), pg).screenshot({ path: path.join(shots, 'keser-staff-' + tag + '-' + name + '.png'), fullPage: true });
      const tidy = async where => { const r = await pg.evaluate(() => { const vw = innerWidth, bad = [];
          for (const el of document.querySelectorAll('section.on button, header button')) { const b = el.getBoundingClientRect(); if (!b.width || el.hidden) continue;
            if (b.left < -1 || b.right > vw + 1) bad.push((el.textContent.trim() || el.getAttribute('aria-label')) + ' is off the screen');
            if (b.height < 44 || b.width < 44) bad.push((el.textContent.trim() || el.getAttribute('aria-label')) + ' is too small to tap'); }
          return { bad, wide: document.documentElement.scrollWidth > vw + 1, text: document.body.innerText }; });
        if (r.wide) say(where + ': the page is wider than the screen'); r.bad.forEach(b => say(where + ': ' + b));
        if (/\$|\bcoins?\b|\bpoints?\b|\bgems?\b|\bprices?\b|\bmoney\b|T\$/i.test(r.text)) say(where + ': money, points or gems on a staff screen'); return r.text; };
      const pad = async code => { for (const d of code) await pg.click('#pad button[data-k="' + d + '"]'); await pg.waitForTimeout(400); };

      await pg.goto(url); await pg.waitForSelector('#pad button'); await tidy('sign-in'); await snap('1-signin');
      await pad('12345678'); if (!/did not open/.test(await pg.textContent('#msg'))) say('a wrong staff code did not say "That code did not open"');
      /* first time */
      await pg.click('#toFirst'); await pg.fill('#fWord', 'made-up-setup-word'); await pg.fill('#fName', 'Mrs. Made-up Lead'); await tidy('first time'); await snap('2-first');
      await pg.click('#fGo'); await pg.waitForFunction(() => /^[0-9]{8}$/.test(document.getElementById('codeNum').textContent), null, { timeout: 8000 }).catch(() => say('first time: no staff code was shown'));
      const leadCode = await pg.textContent('#codeNum'); await tidy('staff code'); await snap('3-lead-code');
      await pg.click('#codeDone'); if ((await pg.textContent('#codeNum')) !== '') say('the staff code stayed on the page after Done');
      await pad(leadCode); if ((await on()) !== 'home') say('the lead could not sign in with her new code');
      const homeBtns = await pg.evaluate(() => [...document.querySelectorAll('#home .big')].filter(b => !b.hidden).map(b => b.firstChild.textContent.trim()));
      if (homeBtns.join('|') !== 'My girls|Add a girl|Add staff') say('home should have exactly My girls, Add a girl, Add staff (the lead), got ' + homeBtns.join(', '));
      await tidy('home'); await snap('4-home');
      /* add two girls */
      const codes = {};
      for (const [first, grade, cls, crown] of [['Tova', '3', 'Room 3A', 'rose'], ['Esther Malka', 'K', 'Kindergarten B', 'sapphire']]) {
        await pg.click('#home [data-go=add]'); await pg.fill('#aFirst', first); await pg.click('#aGrade [data-g="' + grade + '"]'); await pg.fill('#aCls', cls); await pg.click('#aCrown [data-c="' + crown + '"]');
        if (first === 'Tova') { await tidy('add a girl'); await snap('5-add'); }
        await pg.click('#aSave'); await pg.waitForFunction(() => /^[0-9]{6}$/.test(document.getElementById('codeNum').textContent), null, { timeout: 8000 }).catch(() => say('Add a girl: no code was shown'));
        codes[first] = await pg.textContent('#codeNum'); if (first === 'Tova') { await tidy('her code'); await snap('6-girl-code'); }
        await pg.click('#codeDone'); await pg.waitForFunction(() => document.getElementById('h-card').textContent !== 'Loading…');
        if ((await pg.textContent('#h-card')) !== first) say('after Add a girl, her card did not open'); await pg.click('#card [data-go=girls]'); await pg.waitForSelector('#girlList .row'); await pg.click('#girls [data-go=home]'); }
      /* made-up Tova learns, on the girls' side */
      const gi = await K.route({ api: 1, keser: 'signIn', args: [codes.Tova] }, '10.5.0.1', () => db, '');
      await K.route({ api: 1, keser: 'saveSteps', args: [gi.result.token, [
        { sid: 'a1', lesson: 'KDS.SHORESH.1', step: 'q1', q: 'Find the shoresh of הָלַךְ', right: false }, { sid: 'a2', lesson: 'KDS.SHORESH.1', step: 'q1', q: 'Find the shoresh of הָלַךְ', right: false },
        { sid: 'a3', lesson: 'KDS.SHORESH.1', step: 'q1', q: 'Find the shoresh of הָלַךְ', right: true }, { sid: 'a4', lesson: 'KDS.SHORESH.1', step: 'end', done: true },
        { sid: 'a5', lesson: 'TL.ORDER.1', step: 'q1', q: 'Which came first?', right: true }]] }, '10.5.0.1', () => db, '');
      /* my girls and her card */
      await pg.click('#home [data-go=girls]'); await pg.waitForSelector('#girlList .row');
      const listText = await tidy('my girls'); await snap('7-my-girls');
      if (!/Tova/.test(listText) || !/Esther Malka/.test(listText) || !/Room 3A/i.test(listText)) say('My girls does not list both girls by class');
      if (Object.values(codes).some(c => listText.includes(c))) say('My girls shows a girl\'s code');
      await pg.click('#girlList .row >> text=Tova'); await pg.waitForFunction(() => document.getElementById('h-card').textContent === 'Tova');
      const cardText = await tidy('her card'); await snap('8-card');
      if (!/Finished[\s\S]*KDS · SHORESH · 1[\s\S]*Not done yet[\s\S]*TL · ORDER · 1[\s\S]*Found hard[\s\S]*Find the shoresh of הָלַךְ[\s\S]*missed twice, then got it/.test(cardText)) say('her card does not show finished, not done yet and found hard in plain words');
      if (cardText.includes(codes.Tova)) say('her card shows her code');
      /* change her profile */
      await pg.click('#cEdit'); await pg.click('#aGrade [data-g="4"]'); await pg.fill('#aCls', 'Room 4B'); await tidy('change her'); await pg.click('#aSave');
      await pg.waitForFunction(() => /Grade 4 · Room 4B/.test(document.getElementById('cSub').textContent), null, { timeout: 8000 }).catch(() => say('Change did not save her grade and class'));
      /* new code */
      await pg.click('#cCode'); await pg.waitForFunction(() => /^[0-9]{6}$/.test(document.getElementById('codeNum').textContent), null, { timeout: 8000 }).catch(() => say('New code: no code was shown'));
      const nc = await pg.textContent('#codeNum'); await snap('9-new-code'); await pg.click('#codeDone');
      if (nc === codes.Tova) say('New code made the same code');
      if ((await K.route({ api: 1, keser: 'signIn', args: [codes.Tova] }, '10.6.0.1', () => db, '')).ok) say('after New code, her old code still opens');
      if (!(await K.route({ api: 1, keser: 'signIn', args: [nc] }, '10.6.0.1', () => db, '')).ok) say('her new code does not open');
      /* add staff, sign out */
      await pg.click('#card [data-go=girls]'); await pg.click('#girls [data-go=home]'); await pg.click('#toStaff'); await pg.fill('#sName', 'Mrs. Made-up Teacher'); await tidy('add staff'); await snap('10-add-staff');
      await pg.click('#sGo'); await pg.waitForFunction(() => /^[0-9]{8}$/.test(document.getElementById('codeNum').textContent), null, { timeout: 8000 }).catch(() => say('Add staff: no code was shown'));
      const tc = await pg.textContent('#codeNum'); await pg.click('#codeDone');
      await pg.click('#out'); if ((await on()) !== 'signin') say('Sign out did not go back to the code pad');
      await pad(tc); const teacherBtns = await pg.evaluate(() => [...document.querySelectorAll('#home .big')].filter(b => !b.hidden).length);
      if (teacherBtns !== 2) say('a staff member who is not the lead should see 2 buttons (no Add staff), saw ' + teacherBtns);
      await pg.reload(); await pg.waitForSelector('#pad button', { state: 'attached' }); await pg.waitForTimeout(800); if ((await on()) !== 'home') say('after a reload, a signed-in staff member was not kept signed in');
      errs.forEach(e => say(e));
      if (!fails.some(f => f.indexOf('(' + tag + ')') >= 0)) oks.push('Keser staff (' + tag + '): first time, sign-in pad, home with one button per job, Add a girl (code once), My girls, her card (finished, not done yet, found hard), Change, New code, Add staff, Sign out; no codes in lists, nothing off screen, no money');
      await ctx.close();
    }
  } catch (e) { fails.push('Keser staff test crashed: ' + String(e && e.stack || e).slice(0, 400)); }
  finally { srv.close(); fs.rmSync(out, { recursive: true, force: true }); }
  return { fails, oks };
};
