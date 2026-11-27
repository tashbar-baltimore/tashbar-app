/* Kindergarten Kriyah: clarity rules a script can check (v2/curriculum/K-CLARITY-RULES.md, rules 10 and 13).
   Opens every game (v2/app/k-kriyah/units.js) at Chromebook size, and every fifth game at phone size, and checks before he presses Play:
   - the game's name is on screen (rule 13), and the Play button is on screen and at least 64 px;
   - the calm look is on (rule 10): no butterflies, birds, drifting clouds, swaying flags or floating light (engine.js CALM). */
const K = require('./k-kriyah-lib/kit.js');
module.exports = async browser0 => {
  const fails = [], oks = [], browser = await K.glBrowser(browser0);
  const runs = [];
  K.ALL.forEach((g, i) => { runs.push([g.id, 'chromebook']); if (i % 5 === 0) runs.push([g.id, 'phone']); });
  for (const [id, view] of runs) {
    const tag = 'k-kriyah clarity ' + id + ' (' + view + ')';
    let ctx;
    try {
      const o = await K.open(browser, { view, save: K.passedBefore(id), url: 'play.html?g=' + id + '&fast=1' }); ctx = o.ctx; const pg = o.pg;
      await pg.waitForSelector('body[data-start-ready]', { timeout: 120000 });
      const r = await pg.evaluate(async () => {
        const box = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(), cs = getComputedStyle(e);
          return { x: b.left, y: b.top, w: b.width, h: b.height, shown: cs.display !== 'none' && cs.visibility !== 'hidden', text: e.textContent.trim() }; };
        const E = await import('./engine.js');
        return { t: box('#gtitle'), p: box('#start'), W: innerWidth, H: innerHeight, calm: E.CALM };
      });
      const on = b => b && b.shown && b.w > 0 && b.x >= 0 && b.y >= 0 && b.x + b.w <= r.W + 1 && b.y + b.h <= r.H + 1;
      if (!on(r.t) || !r.t.text) fails.push(tag + ': the game name is not on screen');
      if (!on(r.p)) fails.push(tag + ': the Play button is not on screen');
      else if (r.p.w < 64 || r.p.h < 64) fails.push(tag + ': the Play button is ' + Math.round(r.p.w) + ' px (at least 64)');
      if (!r.calm) fails.push(tag + ': the calm look is off');
    } catch (e) { fails.push(tag + ': ' + String(e).slice(0, 160)); }
    if (ctx) await ctx.close();
  }
  if (!fails.length) oks.push('k-kriyah clarity: all ' + K.ALL.length + ' games show their name and a big Play button (Chromebook, and every fifth game on a phone), in the calm look');
  return { fails, oks };
};
