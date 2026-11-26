/* Kindergarten Kriyah: the champion gate (MAP.md, Unit 10). The nekudos open only after 3 stars on the champion check on
   two DIFFERENT days (the boy's own date, not UTC); "My hard letters" opens once he has tried the check. */
const K = require('./k-kriyah-lib/kit.js');
module.exports = async browser0 => {
  const fails = [], oks = [], b = await K.glBrowser(browser0), tag = 'k-kriyah gate';
  const base = K.passedBefore('u10g6'); delete base.games.u10g6;
  const run = async (save, fn) => { const { ctx, pg } = await K.open(b, { save, url: 'index.html?u=10&fast=1' }); await pg.waitForSelector('body[data-ready]', { timeout: 90000 });
    const r = await pg.evaluate(fn); await ctx.close(); return r; };
  const day = (s, days) => { const c = JSON.parse(JSON.stringify(s)); c.games.u10g6 = { stars: 3, last: 3, plays: days.length, days3: days }; return c; };
  const r0 = await run(base, async () => { const E = await import('./engine.js'); const d = new Date(); return { open: E.gateOpen('u10g6'), practice: E.unlocked('u10g7'), today: E.today(), local: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') }; });
  (!r0.open ? oks : fails).push(tag + ': no champion days, the gate is shut');
  (!r0.practice ? oks : fails).push(tag + ': My hard letters waits until he has tried the check');
  (r0.today === r0.local ? oks : fails).push(tag + ': days are counted by his own clock (' + r0.today + ')');
  const r1 = await run(day(base, ['2026-01-01']), async () => { const E = await import('./engine.js'); return { open: E.gateOpen('u10g6'), practice: E.unlocked('u10g7') }; });
  (!r1.open ? oks : fails).push(tag + ': one champion day is not enough');
  (r1.practice ? oks : fails).push(tag + ': after a try, My hard letters is open');
  const r2 = await run(day(base, ['2026-01-01', '2026-01-02']), async () => { const E = await import('./engine.js'); return { open: E.gateOpen('u10g6') }; });
  (r2.open ? oks : fails).push(tag + ': two different champion days open the gate');
  const r3 = await run(base, async () => { const E = await import('./engine.js'); E.record('u10g6', 3); E.record('u10g6', 3); return { days: E.gateDays('u10g6') }; });
  (r3.days === 1 ? oks : fails).push(tag + ': two 3-star checks on the same day count as one day');
  return { fails, oks };
};
