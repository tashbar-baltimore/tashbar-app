/* Kindergarten Kriyah Unit 1: the path (v2/app/k-kriyah/index.html).
   A new boy sees real 3D (not blank), only the first stone is open, a locked stone and a locked game send him back kindly,
   tapping the open stone starts the game, and a computer without 3D gets a clean flat screen, never a blank one. */
const K = require('./k-kriyah-lib/kit.js');
module.exports = async browser0 => {
  const browser = await K.glBrowser(browser0);
  const fails = [], oks = [], view = process.env.KK_VIEW || 'chromebook', tag = 'k-kriyah path (' + view + ')';
  try {
    { const { ctx, pg, errs } = await K.open(browser, { view, url: 'index.html?fast=1' });
      await pg.waitForSelector('body[data-drawn]', { timeout: 120000 }); await pg.waitForTimeout(1200); await K.shot(pg, 'path-' + view + '-new');
      const col = await K.canvasColours(pg); if (col >= 12) oks.push(tag + ': shows real 3D (' + col + ' colours)'); else fails.push(tag + ': the path looks blank (' + col + ' colours)');
      const st = (await K.info(pg)).stops;
      if (st.length === 7 && st[0].open && st.slice(1).every(s => !s.open)) oks.push(tag + ': a new boy has only the first stone open'); else fails.push(tag + ': wrong stones open for a new boy: ' + JSON.stringify(st.map(s => s.open)));
      await pg.mouse.click(...st[3].xy); await pg.waitForTimeout(700);
      if ((await pg.evaluate(() => window.__lines.join(' '))).includes('First play the glowing one')) oks.push(tag + ': a locked stone kindly says to play the glowing one'); else fails.push(tag + ': tapping a locked stone said nothing');
      await pg.mouse.click(...st[0].xy); await pg.waitForURL(/play\.html\?g=u1g0/, { timeout: 30000 }).then(() => oks.push(tag + ': tapping the glowing stone starts the opener story'), () => fails.push(tag + ': tapping the first stone did not start the game'));
      errs.forEach(e => fails.push(tag + ': ' + e)); await ctx.close(); }
    { const { ctx, pg } = await K.open(browser, { view, url: 'play.html?g=u1g4&fast=1' });
      await pg.waitForURL(/index\.html/, { timeout: 30000 }).then(() => oks.push(tag + ': a locked game sends him back to the path'), () => fails.push(tag + ': a locked game could be opened')); await ctx.close(); }
    { const { ctx, pg, errs } = await K.open(browser, { view, url: 'play.html?g=u1g0&fast=1&noGL=1' });
      await pg.waitForSelector('body[data-flat]', { timeout: 30000 }); const n = await pg.evaluate(() => document.querySelectorAll('#flat button').length); await K.shot(pg, 'path-' + view + '-no3d');
      if (n === 3) oks.push(tag + ': without 3D he gets a clean flat screen with the three letters'); else fails.push(tag + ': no-3D screen is missing its letters');
      errs.forEach(e => fails.push(tag + ' (no 3D): ' + e)); await ctx.close(); }
  } catch (e) { fails.push(tag + ': ' + String(e).slice(0, 200)); }
  return { fails, oks };
};
