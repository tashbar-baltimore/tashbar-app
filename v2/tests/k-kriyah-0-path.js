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
    /* Unit 2: closed for a new boy; open once Unit 1's check is passed, with a button back to Unit 1 */
    { const { ctx, pg } = await K.open(browser, { view, url: 'index.html?u=2&fast=1' }); await pg.waitForSelector('body[data-ready]', { timeout: 120000 });
      const i = await K.info(pg); if (i.unit === 1) oks.push(tag + ': Unit 2 stays closed for a new boy (he sees Unit 1)'); else fails.push(tag + ': a new boy could open Unit 2'); await ctx.close(); }
    { const { ctx, pg, errs } = await K.open(browser, { view, save: K.passedBefore('u2g0'), url: 'index.html?fast=1' }); await pg.waitForSelector('body[data-drawn]', { timeout: 120000 }); await pg.waitForTimeout(1200); await K.shot(pg, 'path-' + view + '-unit2');
      const i = await K.info(pg), back = await pg.$('#unit1');
      if (i.unit === 2 && i.stops.length === 8 && i.stops[0].open && !i.stops[1].open) oks.push(tag + ': after Unit 1, the path opens on Unit 2 with its first stone open'); else fails.push(tag + ': Unit 2 path is wrong: ' + JSON.stringify(i.stops.map(s => s.open)));
      if (back) { await back.click(); await pg.waitForURL(/u=1/, { timeout: 30000 }).then(() => oks.push(tag + ': the Unit 1 button goes back to Unit 1'), () => fails.push(tag + ': the Unit 1 button did nothing')); } else fails.push(tag + ': no button back to Unit 1');
      errs.forEach(e => fails.push(tag + ' (Unit 2): ' + e)); await ctx.close(); }
    { const { ctx, pg } = await K.open(browser, { view, url: 'play.html?g=u1g4&fast=1' });
      await pg.waitForURL(/index\.html/, { timeout: 30000 }).then(() => oks.push(tag + ': a locked game sends him back to the path'), () => fails.push(tag + ': a locked game could be opened')); await ctx.close(); }
    { const { ctx, pg, errs } = await K.open(browser, { view, url: 'play.html?g=u1g0&fast=1&noGL=1' });
      await pg.waitForSelector('body[data-flat]', { timeout: 30000 }); const n = await pg.evaluate(() => document.querySelectorAll('#flat button').length); await K.shot(pg, 'path-' + view + '-no3d');
      if (n === 3) oks.push(tag + ': without 3D he gets a clean flat screen with the three letters'); else fails.push(tag + ': no-3D screen is missing its letters');
      errs.forEach(e => fails.push(tag + ' (no 3D): ' + e)); await ctx.close(); }
  } catch (e) { fails.push(tag + ': ' + String(e).slice(0, 200)); }
  return { fails, oks };
};
