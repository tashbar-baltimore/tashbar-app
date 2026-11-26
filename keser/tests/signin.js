/* Keser Girls 3.0, HER SIGN-IN (the jewel vault): builds, is served like the real site, and works for a made-up girl at Chromebook (1366x768)
   and phone size: the vault and 12 gem keys show, the paintings load, a wrong code shakes the vault and clears, the practice code opens the
   vault and flies her into her treasure house, five globes show (a subject she has not started waits, dimmed), a globe takes her to that
   place in her world, it fits the screen with no sideways scroll, no money or points, and "reduce motion" still lets her in quickly.
   The welcome page's Enter leads here (keser/tests/welcome.js). Until the girls' records are built, only the practice code opens it. */
const path = require('path'), os = require('os'), fs = require('fs'), cp = require('child_process'), http = require('http');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png' };
module.exports = async (browser) => {
  const fails = [], oks = [], out = fs.mkdtempSync(path.join(os.tmpdir(), 'keser-sign-'));
  cp.execFileSync(process.execPath, [path.join(__dirname, '..', 'build.js')], { env: Object.assign({}, process.env, { KESER_OUT: out }), stdio: 'pipe' });
  const srv = http.createServer((q, r) => { const f = path.join(out, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
    if (!f.startsWith(out) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(ok => srv.listen(0, '127.0.0.1', ok)); const url = 'http://127.0.0.1:' + srv.address().port + '/';
  const shots = path.join(__dirname, '..', '..', 'tests', 'out'); fs.mkdirSync(shots, { recursive: true });
  try {
    for (const [tag, w, h, opts] of [['chromebook', 1366, 768], ['phone', 390, 800], ['reduce motion', 390, 800, { reducedMotion: 'reduce' }]]) {
      const ctx = await browser.newContext(Object.assign({ viewport: { width: w, height: h } }, opts || {})), pg = await ctx.newPage(), errs = [];
      pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); pg.on('requestfailed', r => errs.push('could not load ' + r.url()));
      await pg.goto(url + 'signin.html'); await pg.waitForFunction(() => window.KSIGN, null, { timeout: 15000 }); await pg.waitForTimeout(800);
      const v = await pg.evaluate(() => { const vw = innerWidth, vh = innerHeight, off = [];
        const pics = [...document.querySelectorAll('#vault img')].every(i => i.complete && i.naturalWidth > 0);
        document.querySelectorAll('#vault button').forEach(b => { const r = b.getBoundingClientRect(); if (r.left < -1 || r.top < -1 || r.right > vw + 1 || r.bottom > vh + 1 || r.width < 44) off.push(b.dataset.k); });
        return { keys: document.querySelectorAll('.key').length, pics, off, wide: document.documentElement.scrollWidth > vw + 1 }; });
      if (v.keys !== 12) fails.push('Keser sign-in (' + tag + '): expected 12 gem keys, got ' + v.keys);
      if (!v.pics) fails.push('Keser sign-in (' + tag + '): the vault paintings did not load');
      if (v.off.length) fails.push('Keser sign-in (' + tag + '): keys off the screen or too small to tap: ' + v.off.join(', '));
      if (v.wide) fails.push('Keser sign-in (' + tag + '): the page is wider than the screen');
      if (tag === 'chromebook') await pg.screenshot({ path: path.join(shots, 'keser-signin-vault.png') });
      for (const d of '9876') await pg.click('.key[data-k="' + d + '"]');
      await pg.waitForTimeout(1100);
      const wrong = await pg.evaluate(() => ({ stage: KSIGN.state.stage, code: KSIGN.state.code, tries: KSIGN.state.tries }));
      if (wrong.stage !== 'vault' || wrong.code !== '' || wrong.tries !== 1) fails.push('Keser sign-in (' + tag + '): a wrong code must not open the vault and must clear (' + JSON.stringify(wrong) + ')');
      for (const d of '1234') await pg.click('.key[data-k="' + d + '"]');
      const home = await pg.waitForFunction(() => KSIGN.state.stage === 'home' && document.body.classList.contains('home'), null, { timeout: 12000 }).then(() => true, () => false);
      if (!home) { fails.push('Keser sign-in (' + tag + '): the practice code did not open the vault into her treasure house'); errs.forEach(e => fails.push('Keser sign-in (' + tag + '): ' + e)); await ctx.close(); continue; }
      await pg.waitForTimeout(1200);
      const t = await pg.evaluate(() => ({ globes: [...document.querySelectorAll('.globe')].map(g => ({ id: g.dataset.place, waiting: g.classList.contains('waiting'), ok: g.querySelector('img').complete && g.querySelector('img').naturalWidth > 0 })),
        text: document.body.innerText, house: document.querySelector('#house .bg').naturalWidth > 0 }));
      if (t.globes.map(g => g.id).join() !== 'kodesh,reading,math,science,writing' || t.globes.some(g => !g.ok) || !t.house) fails.push('Keser sign-in (' + tag + '): her treasure house must show five globes and its painting (' + JSON.stringify(t.globes) + ')');
      if (!t.globes.every(g => g.waiting)) fails.push('Keser sign-in (' + tag + '): with no progress yet, every globe should be waiting');
      if (/\$|\bcoins?\b|\bpoints?\b|\bprices?\b|\bmoney\b/i.test(t.text)) fails.push('Keser sign-in (' + tag + '): money or points on the screen');
      if (tag === 'chromebook') await pg.screenshot({ path: path.join(shots, 'keser-signin-treasure-house.png') });
      await pg.$eval('.globe[data-place="math"]', b => b.click());   /* the ring keeps turning, so tap it where it is */
      const went = await pg.waitForURL(/world\.html\?place=math/, { timeout: 6000 }).then(() => true, () => false);
      if (!went) fails.push('Keser sign-in (' + tag + '): a globe does not take her to that place in her world');
      else { const at = await pg.waitForFunction(() => document.getElementById('placeName') && document.getElementById('placeName').textContent === 'Math', null, { timeout: 15000 }).then(() => true, () => false);
        if (!at) fails.push('Keser sign-in (' + tag + '): her world did not open at Math after she tapped the Math globe'); }
      errs.filter(e => !/world3d|WebGL/.test(e)).forEach(e => fails.push('Keser sign-in (' + tag + '): ' + e)); await ctx.close();
    }
  } catch (e) { fails.push('Keser sign-in test stopped: ' + String(e).slice(0, 200)); }
  finally { srv.close(); fs.rmSync(out, { recursive: true, force: true }); }
  if (!fails.length) oks.push('Keser Girls 3.0 sign-in: the jewel vault at Chromebook and phone size, a wrong code shakes and clears, the practice code opens it into her treasure house with five globes, a globe takes her to that place, reduce motion');
  return { fails, oks };
};
