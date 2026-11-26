/* Keser Girls 3.0, HER WORLD STAYS TIDY (HoS 2026-11-26: "the added graphics shouldn't just be put wherever ... it should remain clean
   and everything should be put in its appropriate place ... make sure it stays super sharp").
   For a made-up girl at Chromebook (1366x768) and phone size, at each place, once the world has come to rest:
   - every picture has its own spot: the place in front, its host girl, her crown and Bubby never overlap one another
     (measured on the screen, with a small gap), and none of them covers the place name, the jewel dots or Enter;
   - every picture is wholly on the screen;
   - the place in front shows its host girl; no other host girl and no side picture is left standing (no clutter, no ghosts).
   A new picture or a moved one that breaks this fails the tests. */
const path = require('path'), os = require('os'), fs = require('fs'), cp = require('child_process'), http = require('http');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg' };
const GAP = 4;   /* pixels: pictures may not touch */
module.exports = async (browser) => {
  const fails = [], oks = [], out = fs.mkdtempSync(path.join(os.tmpdir(), 'keser-tidy-'));
  cp.execFileSync(process.execPath, [path.join(__dirname, '..', 'build.js')], { env: Object.assign({}, process.env, { KESER_OUT: out }), stdio: 'pipe' });
  const srv = http.createServer((q, r) => { const f = path.join(out, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
    if (!f.startsWith(out) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(ok => srv.listen(0, '127.0.0.1', ok)); const url = 'http://127.0.0.1:' + srv.address().port + '/';
  const hit = (a, b) => a.l < b.r + GAP && b.l < a.r + GAP && a.t < b.b + GAP && b.t < a.b + GAP;
  const shots = path.join(__dirname, '..', '..', 'tests', 'out'); fs.mkdirSync(shots, { recursive: true });
  try {
    for (const [tag, w, h] of [['chromebook', 1366, 768], ['phone', 390, 844]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' }), pg = await ctx.newPage();
      await pg.goto(url + 'world.html?demo=1&lite=1&nogreet=1');
      await pg.waitForFunction(() => window.KWORLD && (KWORLD.state.frames > 1 || document.documentElement.classList.contains('nogl')), null, { timeout: 90000 });
      if (!(await pg.evaluate(() => KWORLD.state.gl && !!KWORLD.layout()))) { fails.push('Keser tidy (' + tag + '): the 3D world did not start, so its layout could not be checked'); await ctx.close(); continue; }
      const n = (await pg.evaluate(() => KWORLD.places.length)); let bad = 0;
      for (let k = 0; k < n; k++) {
        if (k) await pg.evaluate(() => KWORLD.next());
        await pg.waitForTimeout(1500);   /* come to rest */
        const L = await pg.evaluate(() => { const r = id => { const e = document.getElementById(id); if (!e) return null; const b = e.getBoundingClientRect(); return b.width ? { l: b.left, r: b.right, t: b.top, b: b.bottom } : null; };
          return Object.assign(KWORLD.layout(), { name: r('placeName'), dots: r('dots'), enter: r('enter'), place: KWORLD.places[KWORLD.state.focus] }); });
        const where = 'Keser tidy (' + tag + ', ' + L.place + '): ', pics = { picture: L.picture, 'host girl': L.host, crown: L.crown, Bubby: L.bubby };
        const say = m => { fails.push(where + m); bad++; };
        if (!L.hostShown) say('the host girl of the place in front is not showing');
        if (L.sideHosts) say(L.sideHosts + ' other host girl(s) are left standing on the stage');
        if (L.sides.length) say(L.sides.length + ' side picture(s) are left showing when the world is at rest');
        const names = Object.keys(pics);
        for (let i = 0; i < names.length; i++) { const a = pics[names[i]];
          if (a.l < 0 || a.t < 0 || a.r > w || a.b > h) say('the ' + names[i] + ' runs off the screen');
          for (let j = i + 1; j < names.length; j++) if (hit(a, pics[names[j]])) say('the ' + names[i] + ' and the ' + names[j] + ' overlap');
          for (const [ui, r] of [['place name', L.name], ['jewel dots', L.dots], ['Enter button', L.enter]]) if (r && hit(a, r)) say('the ' + names[i] + ' covers the ' + ui); }
        await pg.screenshot({ path: path.join(shots, 'keser-tidy-' + tag + '-' + L.place + '.png') });
      }
      if (!bad) oks.push('Keser tidy (' + tag + '): at every place each picture has its own spot (place, host girl, crown, Bubby), none overlap, all on screen, no clutter or ghosts');
      await ctx.close();
    }
  } finally { srv.close(); fs.rmSync(out, { recursive: true, force: true }); }
  return { fails, oks };
};
