/* Kindergarten Kriyah: the game gallery (v2/app/k-kriyah/gallery.html).
   Every game of every unit is on it once, in order, with its own picture, a line on what the boy does and a button that opens it. */
const fs = require('fs'), path = require('path');
const K = require('./k-kriyah-lib/kit.js');
module.exports = async browser => {
  const fails = [], oks = [];
  for (const view of ['chromebook', 'phone']) {
    const tag = 'k-kriyah gallery (' + view + ')';
    try {
      const { ctx, pg, errs } = await K.open(browser, { view, url: 'gallery.html' });
      await pg.waitForSelector('body[data-ready]', { state: 'attached', timeout: 30000 }); await pg.waitForTimeout(800);
      await K.shot(pg, 'gallery-' + view);
      const cards = await pg.evaluate(() => [...document.querySelectorAll('.card')].map(c => ({
        href: c.querySelector('a.open').getAttribute('href'), name: c.querySelector('.name').textContent,
        what: c.querySelector('.what').textContent, img: !!c.querySelector('img') && c.querySelector('img').naturalWidth > 0 })));
      const ids = cards.map(c => (c.href.match(/g=(u\d+g\d+)/) || [])[1]);
      const want = ids.slice().sort((a, b) => { const p = s => s.slice(1).split('g').map(Number); const [x, y] = [p(a), p(b)]; return x[0] - y[0] || x[1] - y[1]; });
      if (cards.length >= 7 && ids.every(Boolean) && new Set(ids).size === ids.length && ids.join() === want.join()) oks.push(tag + ': lists all ' + cards.length + ' games once, in order');
      else fails.push(tag + ': the game list is wrong: ' + ids.join(','));
      const noLine = cards.filter(c => c.what.trim().length < 15).map(c => c.name); if (!noLine.length) oks.push(tag + ': every game says what the boy does'); else fails.push(tag + ': no line for ' + noLine.join(', '));
      const noPic = ids.filter((id, i) => !cards[i].img || !fs.existsSync(path.join(__dirname, '..', 'app', 'k-kriyah', 'gallery', id + '.jpg')));
      if (!noPic.length) oks.push(tag + ': every game has its picture'); else fails.push(tag + ': no picture for ' + noPic.join(', '));
      const wide = await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1); if (!wide) oks.push(tag + ': nothing runs off the side'); else fails.push(tag + ': the page scrolls sideways');
      errs.forEach(e => fails.push(tag + ': ' + e));
      if (view === 'chromebook') {
        await pg.click('a.open'); await pg.waitForURL(/play\.html\?g=u1g0/, { timeout: 30000 }).then(() => oks.push(tag + ': "Open" starts the game'), () => fails.push(tag + ': "Open" did not start the game'));
      }
      await ctx.close();
    } catch (e) { fails.push(tag + ': ' + String(e).slice(0, 200)); }
  }
  return { fails, oks };
};
