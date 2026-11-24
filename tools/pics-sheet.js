/* PICS-1 contact sheet through the real add-on. Run: node tools/pics-sheet.js src/RealPics.html art/pics out.png "LESSON.ID|question" ... */
// contact sheet: render screens through the real RealPics.html. Args: html picsDir out.png then "LESSON|question" ...
const { chromium } = require('playwright'); const fs = require('fs'); const [,, html, dir, out, ...keys] = process.argv;
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 380 * Math.min(keys.length, 4), height: 900 }, deviceScaleFactor: 1 });
  await pg.route('https://tashbar-learning-live.web.app/pics/**', r => r.fulfill({ body: fs.readFileSync(dir + '/' + r.request().url().split('/pics/')[1]), contentType: 'image/jpeg' }));
  const addon = fs.readFileSync(html, 'utf8').replace(/^\s*<script>/, '').replace(/<\/script>\s*$/, '');
  await pg.setContent('<!doctype html><meta charset="utf-8"><body style="font-family:system-ui;margin:0;display:flex;flex-wrap:wrap"></body>');
  await pg.evaluate(([addon, keys]) => { (0, eval)(addon); const old = window.render;
    keys.forEach(k => { const [id, ...q] = k.split('|'); const it = { q: q.join('|') }; window.A = { view: 'play', play: { id, i: 0, items: [it] } };
      const box = document.createElement('div'); box.style.cssText = 'width:360px;padding:10px'; box.innerHTML = `<div class="qcard"><div class="qrow" style="font:700 15px system-ui">${it.q}</div><div class="tlpic">❓</div></div>`; document.body.appendChild(box);
      document.querySelectorAll('.qcard').forEach((c, i, all) => { if (i < all.length - 1) c.className = 'qdone'; }); rpDecorate(); }); }, [addon, keys]);
  await pg.waitForTimeout(1500); await pg.screenshot({ path: out, fullPage: true }); await b.close(); })();
