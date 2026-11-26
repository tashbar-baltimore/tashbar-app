/* Keser Girls 3.0 welcome page: builds, is served like the real site, opens at Chromebook (1366x768) and phone size with no errors,
   shows the name, fits the screen, the gold Keser crown (from the Keser Academy logo) loads on royal purple, and Enter leads to her world. */
const path = require('path'), os = require('os'), fs = require('fs'), cp = require('child_process'), http = require('http');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.txt': 'text/plain', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg' };
module.exports = async (browser) => {
  const fails = [], oks = [], out = fs.mkdtempSync(path.join(os.tmpdir(), 'keser-w-'));
  cp.execFileSync(process.execPath, [path.join(__dirname, '..', 'build.js')], { env: Object.assign({}, process.env, { KESER_OUT: out }), stdio: 'pipe' });
  const srv = http.createServer((q, r) => { const f = path.join(out, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
    if (!f.startsWith(out) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(ok => srv.listen(0, '127.0.0.1', ok)); const url = 'http://127.0.0.1:' + srv.address().port + '/';
  const shots = path.join(__dirname, '..', '..', 'tests', 'out'); fs.mkdirSync(shots, { recursive: true });
  try {
    for (const [name, w, h] of [['chromebook', 1366, 768], ['phone', 390, 800]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }), pg = await ctx.newPage(), errs = [];
      pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
      pg.on('requestfailed', q => errs.push('could not load ' + q.url()));
      await pg.goto(url); await pg.waitForTimeout(2500);
      const r = await pg.evaluate(() => { const c = document.querySelector('#crown img'), s = document.querySelector('.sky'); return { text: document.body.innerText, wide: document.documentElement.scrollWidth > window.innerWidth,
        flat: !(c && c.complete && c.naturalWidth > 0 && /keser-academy-crown/.test(c.src) && s && /gradient/.test(getComputedStyle(s).backgroundImage)), enter: (document.getElementById('enter') || {}).getAttribute && document.getElementById('enter').getAttribute('href') }; });
      if (r.enter !== 'world.html') fails.push('Keser welcome (' + name + '): the Enter button does not lead to her world');
      if (!/Keser Girls/.test(r.text)) fails.push('Keser welcome (' + name + '): the name "Keser Girls" is not shown');
      if (r.wide) fails.push('Keser welcome (' + name + '): the page is wider than the screen');
      if (r.flat) fails.push('Keser welcome (' + name + '): the Keser crown or the purple sky did not show');
      errs.forEach(e => fails.push('Keser welcome (' + name + '): ' + e));
      await pg.screenshot({ path: path.join(shots, 'keser-welcome-' + name + '.png') }); await ctx.close();
    }
  } finally { srv.close(); fs.rmSync(out, { recursive: true, force: true }); }
  if (!fails.length) oks.push('Keser Girls 3.0 welcome page: the gold Keser crown on royal purple shows at Chromebook and phone size, Enter leads to her world, no errors, fits the screen');
  return { fails, oks };
};
