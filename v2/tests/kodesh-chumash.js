/* 2.0 · Kodesh · Chumash (v2/app/kodesh/): the Chumash & Timeline Lab as six separate daily items, starting at grade 2.
   Builds 2.0, serves it like the real site, and at Chromebook (1366x768) and phone (390) size checks:
   - the 2.0 front page has the Kodesh door; the Kodesh page shows the 6 items, "0 of 6 done today", each one a link to its own page;
   - each item page opens only that item (no six-lab menu), starts with "Today's lesson", has the big K-3 Home button, and its house goes to /kodesh/;
   - grade 2 start: Milim and Shorashim come 5 to a group;
   - Today's lesson on Milim plays the Meet step by taps, and then the Kodesh page shows "Done today" for Milim (1 of 6);
   - a Shorashim spelling, a Prefix build, a Stop Signs break-up, a Timeline question in English and in Hebrew still work by taps;
   - the timeline pictures load from the shared art library; every question screen has "How to do it"; no money; nothing wider than the screen. */
const path = require('path'), os = require('os'), fs = require('fs'), cp = require('child_process'), http = require('http');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' };
const ITEMS = [['milim', 'ml'], ['shorashim', 'sh'], ['prefixes', 'ps'], ['stop-signs', 'tr'], ['pasuk', 'pw'], ['timeline', 'tl']];
module.exports = async (browser) => {
  const fails = [], oks = [], out = fs.mkdtempSync(path.join(os.tmpdir(), 'v2-kodesh-'));
  try { cp.execFileSync(process.execPath, [path.join(__dirname, '..', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: out }), stdio: 'pipe' }); }
  catch (e) { fs.rmSync(out, { recursive: true, force: true }); return { fails: ['2.0 Kodesh: the 2.0 build failed: ' + String(e.stderr || e).slice(0, 300)], oks }; }
  const srv = http.createServer((q, r) => { const f = path.join(out, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
    if (!f.startsWith(out) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(ok => srv.listen(0, '127.0.0.1', ok)); const url = 'http://127.0.0.1:' + srv.address().port + '/';
  const shots = path.join(__dirname, '..', '..', 'tests', 'out'); fs.mkdirSync(shots, { recursive: true });
  try {
    for (const [name, w, h] of [['chromebook', 1366, 768], ['phone', 390, 800]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }), pg = await ctx.newPage(), errs = [], F = m => fails.push('2.0 Kodesh (' + name + '): ' + m);
      await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());   /* no outside network in the test */
      pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
      pg.on('requestfailed', q => { if (!/fonts\.(googleapis|gstatic)/.test(q.url())) errs.push('could not load ' + q.url()); });
      const wide = async where => { const wd = await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2 || [...document.querySelectorAll('.clab-body')].some(b => b.scrollWidth > b.clientWidth + 2)); if (wd) F('wider than the screen on ' + where); };

      /* the front page and the Kodesh page */
      await pg.goto(url); await pg.waitForTimeout(200);
      if (!(await pg.$('a.door[href="/kodesh/"]'))) F('the 2.0 front page has no Kodesh door');
      await pg.goto(url + 'kodesh/'); await pg.waitForTimeout(300);
      const kd = await pg.evaluate(() => ({ urls: [...document.querySelectorAll('.kd-item[data-url]')].map(b => b.dataset.url), txt: document.body.innerText, home: !!document.querySelector('.kd-top .tlk-home.tlk-home-k3') }));
      if (kd.urls.length !== 6) F('the Kodesh page must show 6 items (got ' + kd.urls.length + ')');
      if (!/0 of 6 done today/.test(kd.txt)) F('the Kodesh page must start at "0 of 6 done today"');
      if (!kd.home) F('the Kodesh page needs the big K-3 Home button');
      ITEMS.forEach(([d]) => { if (kd.urls.indexOf('/kodesh/' + d + '/') < 0) F('the Kodesh page has no link to ' + d); });
      await wide('the Kodesh page'); await pg.screenshot({ path: path.join(shots, 'v2-kodesh-' + name + '.png') });

      /* each item on its own page */
      for (const [d, k] of ITEMS) {
        await pg.goto(url + 'kodesh/' + d + '/'); await pg.waitForTimeout(k === 'tl' ? 700 : 300);
        const r = await pg.evaluate(() => { const root = document.getElementById('clab'); if (!root) return null;
          return { labs: root.querySelectorAll('[data-lab]').length, today: !!root.querySelector('.clab-today [data-today]'), home: !!root.querySelector('.clab-top .tlk-home.tlk-home-k3'), back: !!root.querySelector('.clab-top .tlk-back'), title: (root.querySelector('.clab-top h1') || {}).textContent }; });
        if (!r) { F(d + ': the page did not open'); continue; }
        if (r.labs) F(d + ': shows the six-lab menu; it must open only its own item');
        if (!r.today) F(d + ': no "Today\'s lesson" button at the top');
        if (!r.home || r.back) F(d + ': the top must have only the big Home button (home ' + r.home + ', back ' + r.back + ')');
        await wide(d); await pg.screenshot({ path: path.join(shots, 'v2-kodesh-' + d + '-' + name + '.png') });
        await pg.click('#clab .clab-top .tlk-home'); await pg.waitForTimeout(300);
        if (!/\/kodesh\/$/.test(pg.url())) F(d + ': the house must go back to the Kodesh page (went to ' + pg.url() + ')');
      }

      /* grade 2 start and Today's lesson on Milim */
      await pg.goto(url + 'kodesh/milim/'); await pg.waitForTimeout(300);
      const m = await pg.evaluate(async () => { const sleep = ms => new Promise(r => setTimeout(r, ms)), root = document.getElementById('clab'), G = window.CLAB.groups(), o = { sizes: [G.MLG[0].length, G.SHG[0].length], noHow: 0 };
        root.querySelector('[data-today]').click(); await sleep(30); o.first = (root.querySelector('.clab-top h1') || {}).textContent;
        for (let t = 0; t < 8; t++) { const n = root.querySelector('[data-a=next]'); if (!n || !/Meet/.test((root.querySelector('.clab-top h1') || {}).textContent)) break; if (!/How to do it/.test(root.innerHTML)) o.noHow++; n.click(); await sleep(30); }
        o.after = (root.querySelector('.clab-top h1') || {}).textContent; o.did = !!(window.CLAB.prog().day && window.CLAB.prog().day.did.ml); return o; });
      if (m.sizes[0] !== 5 || m.sizes[1] !== 5) F('grade 2 start: Milim and Shorashim groups must have 5 (got ' + m.sizes.join(', ') + ')');
      if (!/Meet/.test(m.first || '')) F('Today\'s lesson on Milim must start with Meet (got ' + m.first + ')');
      if (!m.did) F('finishing Meet on Milim must count as today\'s lesson');
      if (m.noHow) F('Milim Meet: ' + m.noHow + ' screen(s) with no "How to do it"');
      await pg.goto(url + 'kodesh/'); await pg.waitForTimeout(300);
      const after = await pg.evaluate(() => ({ txt: document.body.innerText, ml: (document.querySelector('.kd-item[data-url="/kodesh/milim/"]') || {}).innerText || '' }));
      if (!/1 of 6 done today/.test(after.txt) || !/Done today/.test(after.ml)) F('after Milim, the Kodesh page must show Milim "Done today" and 1 of 6');
      await pg.screenshot({ path: path.join(shots, 'v2-kodesh-after-' + name + '.png') });
      await pg.goto(url + 'kodesh/milim/'); await pg.waitForTimeout(300);
      if (!/Done today/.test(await pg.evaluate(() => (document.querySelector('.clab-today') || {}).innerText || ''))) F('Milim must show "Done today" on Today\'s lesson after the step');

      /* the old lab checks, each on its own page */
      const play = async (d, fn) => { await pg.goto(url + 'kodesh/' + d + '/'); await pg.waitForTimeout(d === 'timeline' ? 800 : 300); return pg.evaluate(fn); };
      const COMMON = `const sleep = ms => new Promise(r => setTimeout(r, ms)), X = window.CLAB, root = () => document.getElementById('clab'), o = { noHow: 0, money: 0 };
        const click = s => { const b = typeof s === 'string' ? root().querySelector(s) : s; if (b && !b.disabled) { b.click(); return true; } return false; };
        const scan = () => { if (root().querySelector('.fbx') && !/How to do it/.test(root().innerHTML)) o.noHow++; if (/\\bgems?\\b|\\bpoints\\b(?! to)|\\$\\d|My money/i.test(root().innerText)) o.money++; };`;
      const sh = await play('shorashim', new Function('return (async () => {' + COMMON + `
        click('[data-u="0"]'); await sleep(20); click('[data-s=meet]'); await sleep(20); scan(); click('[data-a=next]'); await sleep(20); scan();
        const x = X.groups().SHG[0][0]; for (const L of x.r.replace(/[\\u0591-\\u05C7]/g, '').split('').map(c => ({ 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' }[c] || c))) click(root().querySelector('.hk[data-c="' + L + '"]'));
        await sleep(20); o.ok = !root().querySelector('[data-a=next]').disabled; return o; })()`));
      if (!sh.ok) F('Shorashim: spelling a shoresh from memory was not accepted');
      const ps = await play('prefixes', new Function('return (async () => {' + COMMON + `
        click('[data-u="0"]'); await sleep(20); scan(); click('[data-s=practice]'); await sleep(20);
        for (let t = 0; t < 6 && X.cur && X.cur.Q.kind !== 'buildparts'; t++) { const c = X.cur; click(root().querySelector('.qbox [data-i="' + c.ch.indexOf(c.Q.right) + '"]')); await sleep(10); click('.qbox [data-a=nx]'); await sleep(10); }
        if (X.cur && X.cur.Q.kind === 'buildparts') { scan(); for (let n = 0; n < X.cur.Q.x.parts.length; n++) click(root().querySelector('.bank [data-j="' + X.cur.tiles.findIndex(t => t.i === n) + '"]')); click('[data-a=chk]'); await sleep(10); o.ok = !!root().querySelector('.qbox .clab-fb.good'); }
        return o; })()`));
      if (ps.ok === false) F('Prefixes: building a word from its pieces was not accepted');
      const tr = await play('stop-signs', new Function('return (async () => {' + COMMON + `const q = X.breakQ(1); o.ok = !!(q && q.P && q.P.t.length); return o; })()`));
      if (!tr.ok) F('Stop Signs: no pasuk to break up');
      const tl = await play('timeline', new Function('return (async () => {' + COMMON + `
        const imgs = [...root().querySelectorAll('.tl-hero img')]; o.pics = imgs.length; o.picsLoaded = imgs.filter(i => i.complete && i.naturalWidth > 0).length;
        for (const lang of ['en', 'he']) { X.tlHome(); await sleep(20); click('[data-lang=' + lang + ']'); await sleep(20); click('[data-k=l1][data-m=q]'); await sleep(400); scan();
          const tq = X.curTl; if (tq.t === 'pick') click(root().querySelector('.clab-opt[data-i="' + tq.ans + '"]')); else if (tq.t === 'order') { for (const it of tq.items) click(root().querySelector('.clab-opt[data-i="' + tq.shown.indexOf(it) + '"]')); } else { for (const dg of String(tq.ans)) click(root().querySelector('[data-n="' + dg + '"]')); click('[data-a=chk]'); }
          await sleep(20); o['ok_' + lang] = !!root().querySelector('[data-a=nx]'); o['title_' + lang] = (root().querySelector('.clab-top h1') || {}).textContent; }
        X.tlHome(); return o; })()`));
      if (!tl.ok_en || !tl.ok_he || !/צִיר/.test(tl.title_he || '')) F('Timeline: a question in English and in Hebrew must accept its right answer');
      if (!tl.pics || tl.picsLoaded !== tl.pics) F('Timeline: the pictures did not load from the shared art library (' + tl.picsLoaded + ' of ' + tl.pics + ')');
      for (const [n, r] of [['Shorashim', sh], ['Prefixes', ps], ['Timeline', tl]]) { if (r.noHow) F(n + ': ' + r.noHow + ' question screen(s) with no "How to do it"'); if (r.money) F(n + ': money, points or gems appear'); }
      errs.forEach(e => F(e));
      await ctx.close();
    }
  } finally { srv.close(); fs.rmSync(out, { recursive: true, force: true }); }
  if (!fails.length) oks.push('2.0 Kodesh · Chumash: front-page door; Kodesh page with 6 items and today\'s count; each item on its own page with Today\'s lesson and the big Home; grade 2 groups of 5; Milim Meet counts for today; spelling, building, break-up and Timeline (English and Hebrew) work by taps; pictures from art/; How to do it; no money; fits Chromebook and phone');
  return { fails, oks };
};
