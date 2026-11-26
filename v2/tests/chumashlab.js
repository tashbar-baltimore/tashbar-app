/* 2.0 · Chumash & Timeline Lab (v2/app/lab/): builds, is served like the real site, and at Chromebook (1366x768) and phone (390) size:
   the 2.0 front page has the lab's door; the lab opens on its own (no sign-in) with its six labs; the timeline pictures load from the
   shared art library; a boy can play a Shorashim spelling, a Prefix build, a Stop Signs break-up, a Timeline question in English and in
   Hebrew; every question screen has a "How to do it" box; no money; the house goes back to the 2.0 front page; nothing is wider than the screen. */
const path = require('path'), os = require('os'), fs = require('fs'), cp = require('child_process'), http = require('http');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' };
module.exports = async (browser) => {
  const fails = [], oks = [], out = fs.mkdtempSync(path.join(os.tmpdir(), 'v2-lab-'));
  try { cp.execFileSync(process.execPath, [path.join(__dirname, '..', 'build.js')], { env: Object.assign({}, process.env, { V2_OUT: out }), stdio: 'pipe' }); }
  catch (e) { fs.rmSync(out, { recursive: true, force: true }); return { fails: ['2.0 lab: the 2.0 build failed: ' + String(e.stderr || e).slice(0, 300)], oks }; }
  const srv = http.createServer((q, r) => { const f = path.join(out, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
    if (!f.startsWith(out) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(ok => srv.listen(0, '127.0.0.1', ok)); const url = 'http://127.0.0.1:' + srv.address().port + '/';
  const shots = path.join(__dirname, '..', '..', 'tests', 'out'); fs.mkdirSync(shots, { recursive: true });
  try {
    for (const [name, w, h] of [['chromebook', 1366, 768], ['phone', 390, 800]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }), pg = await ctx.newPage(), errs = [];
      await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());   /* no outside network in the test */
      pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
      pg.on('requestfailed', q => { if (!/fonts\.(googleapis|gstatic)/.test(q.url())) errs.push('could not load ' + q.url()); });
      await pg.goto(url); await pg.waitForTimeout(300);
      if (!(await pg.$('a.door[href="/lab/"]'))) fails.push('2.0 lab (' + name + '): the 2.0 front page has no door to the lab');
      await pg.goto(url + 'lab/'); await pg.waitForTimeout(600);
      const r = await pg.evaluate(async () => { const sleep = ms => new Promise(r => setTimeout(r, ms)), o = { bad: [], noHow: 0, money: 0, wide: [] }, X = window.CLAB, root = () => document.getElementById('clab');
        if (!X || !root()) { o.bad.push('the lab did not open by itself'); return o; }
        const scan = () => { const b = root().querySelector('.clab-body'); if (root().querySelector('.fbx') && !/How to do it/.test(root().innerHTML)) o.noHow++;
          if (/\bgems?\b|\bpoints\b(?! to)|\$\d|My money/i.test(root().innerText)) o.money++; if (b && b.scrollWidth > b.clientWidth + 2) o.wide.push((root().querySelector('.clab-top h1') || {}).textContent); };
        scan(); o.labs = root().querySelectorAll('[data-lab]').length; o.house = !!root().querySelector('.clab-top .tlk-home');
        const click = s => { const b = typeof s === 'string' ? root().querySelector(s) : s; if (b && !b.disabled) { b.click(); return true; } return false; };
        /* Shorashim: meet the first one and spell it from memory */
        click('[data-lab=sh]'); await sleep(20); click('[data-u="0"]'); await sleep(20); click('[data-s=meet]'); await sleep(20); scan(); click('[data-a=next]'); await sleep(20); scan();
        const x = X.groups().SHG[0][0]; for (const L of x.r.replace(/[֑-ׇ]/g, '').split('').map(c => ({ 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' }[c] || c))) click(root().querySelector('.hk[data-c="' + L + '"]'));
        await sleep(20); o.spelled = !root().querySelector('[data-a=next]').disabled;
        /* Prefix unit 1: one build question */
        X.openLab('ps'); await sleep(20); click('[data-u="0"]'); await sleep(20); scan(); click('[data-s=practice]'); await sleep(20);
        for (let t = 0; t < 6 && X.cur && X.cur.Q.kind !== 'buildparts'; t++) { const c = X.cur; click(root().querySelector('.qbox [data-i="' + c.ch.indexOf(c.Q.right) + '"]')); await sleep(10); click('.qbox [data-a=nx]'); await sleep(10); }
        if (X.cur && X.cur.Q.kind === 'buildparts') { scan(); for (let n = 0; n < X.cur.Q.x.parts.length; n++) click(root().querySelector('.bank [data-j="' + X.cur.tiles.findIndex(t => t.i === n) + '"]')); click('[data-a=chk]'); await sleep(10); o.built = !!root().querySelector('.qbox .clab-fb.good'); }
        /* Stop Signs: break up one pasuk */
        const q = X.breakQ(1); o.breakOk = q && q.P && q.P.t.length > 0;
        /* Timeline: one question in English, one in Hebrew; the pictures load */
        for (const lang of ['en', 'he']) { X.openLab('tl'); await sleep(20); click('[data-lang=' + lang + ']'); await sleep(20); click('[data-k=l1][data-m=q]'); await sleep(400); scan();
          const tq = X.curTl; if (tq.t === 'pick') click(root().querySelector('.clab-opt[data-i="' + tq.ans + '"]')); else if (tq.t === 'order') { for (const it of tq.items) click(root().querySelector('.clab-opt[data-i="' + tq.shown.indexOf(it) + '"]')); } else { for (const d of String(tq.ans)) click(root().querySelector('[data-n="' + d + '"]')); click('[data-a=chk]'); }
          await sleep(20); o['tl_' + lang] = !!root().querySelector('[data-a=nx]'); o['tlTitle_' + lang] = (root().querySelector('.clab-top h1') || {}).textContent; }
        X.openLab('tl'); await sleep(800); const imgs = [...root().querySelectorAll('.tl-hero img')]; o.pics = imgs.length; o.picsLoaded = imgs.filter(i => i.complete && i.naturalWidth > 0).length;
        X.openLab(); await sleep(20); return o; });
      (r.bad || []).forEach(b => fails.push('2.0 lab (' + name + '): ' + b));
      if (r.labs !== 6 || !r.house) fails.push('2.0 lab (' + name + '): the lab home must show 6 labs and the house (got ' + r.labs + ', house ' + r.house + ')');
      if (!r.spelled) fails.push('2.0 lab (' + name + '): spelling a shoresh from memory was not accepted');
      if (r.built === false) fails.push('2.0 lab (' + name + '): building a word from its pieces was not accepted');
      if (!r.breakOk) fails.push('2.0 lab (' + name + '): no pasuk to break up');
      if (!r.tl_en || !r.tl_he || !/צִיר/.test(r.tlTitle_he || '')) fails.push('2.0 lab (' + name + '): a Timeline question in English and in Hebrew must accept its right answer');
      if (!r.pics || r.picsLoaded !== r.pics) fails.push('2.0 lab (' + name + '): the timeline pictures did not load from the shared art library (' + r.picsLoaded + ' of ' + r.pics + ')');
      if (r.noHow) fails.push('2.0 lab (' + name + '): ' + r.noHow + ' question screen(s) with no "How to do it" box');
      if (r.money) fails.push('2.0 lab (' + name + '): money, points or gems appear');
      if ((r.wide || []).length) fails.push('2.0 lab (' + name + '): wider than the screen on: ' + r.wide.join(', '));
      await pg.screenshot({ path: path.join(shots, 'v2-lab-' + name + '.png') });
      await pg.click('#clab .clab-top .tlk-home'); await pg.waitForTimeout(400);
      if (!(await pg.$('a.door[href="/lab/"]'))) fails.push('2.0 lab (' + name + '): the house must go back to the 2.0 front page');
      errs.forEach(e => fails.push('2.0 lab (' + name + '): ' + e));
      await ctx.close();
    }
  } finally { srv.close(); fs.rmSync(out, { recursive: true, force: true }); }
  if (!fails.length) oks.push('2.0 Chumash & Timeline Lab: front-page door; opens on its own with 6 labs; spelling, building, break-up and a Timeline question in English and Hebrew work by taps; pictures load from art/; How to do it everywhere; no money; house goes home; fits Chromebook and phone');
  return { fails, oks };
};
