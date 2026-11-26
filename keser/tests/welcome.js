/* Keser Girls 3.0 welcome page: builds, opens at Chromebook (1366x768) and phone size with no errors, shows the name, fits the screen. */
const path = require('path'), os = require('os'), fs = require('fs'), cp = require('child_process');
module.exports = async (browser) => {
  const fails = [], oks = [], out = fs.mkdtempSync(path.join(os.tmpdir(), 'keser-w-'));
  cp.execFileSync(process.execPath, [path.join(__dirname, '..', 'build.js')], { env: Object.assign({}, process.env, { KESER_OUT: out }), stdio: 'pipe' });
  const shots = path.join(__dirname, '..', '..', 'tests', 'out'); fs.mkdirSync(shots, { recursive: true });
  for (const [name, w, h] of [['chromebook', 1366, 768], ['phone', 390, 800]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } }), pg = await ctx.newPage(), errs = [];
    pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await pg.goto('file://' + path.join(out, 'index.html'));
    const r = await pg.evaluate(() => ({ text: document.body.innerText, wide: document.documentElement.scrollWidth > window.innerWidth }));
    if (!/Keser Girls/.test(r.text)) fails.push('Keser welcome (' + name + '): the name "Keser Girls" is not shown');
    if (r.wide) fails.push('Keser welcome (' + name + '): the page is wider than the screen');
    errs.forEach(e => fails.push('Keser welcome (' + name + '): ' + e));
    await pg.screenshot({ path: path.join(shots, 'keser-welcome-' + name + '.png') }); await ctx.close();
  }
  if (!fails.length) oks.push('Keser Girls 3.0 welcome page opens at Chromebook and phone size, no errors, fits the screen');
  fs.rmSync(out, { recursive: true, force: true });
  return { fails, oks };
};
