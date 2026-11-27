/* Kindergarten Kriyah: "Remember these?" (the spaced review before the stars, curriculum/k-kriyah/RESEARCH.md).
   Three earlier letters; a letter he missed last time comes first, then the one he hasn't seen longest; a wrong tap
   is named kindly and shows the right one; every answer is remembered per letter; openers, checks and bonus rounds skip it. */
const K = require('./k-kriyah-lib/kit.js');
module.exports = async browser0 => {
  const browser = await K.glBrowser(browser0);
  const fails = [], oks = [], view = process.env.KK_VIEW || 'chromebook', tag = 'k-kriyah remember-these (' + view + ')';
  const now = Date.now();
  const save = { games: {}, letters: { alef: { r: 3, w: 0, at: now - 1000, ok: true }, beis: { r: 2, w: 1, at: now - 500, ok: false, lastWrong: now - 500 }, veis: { r: 1, w: 0, at: now - 9e6, ok: true } } };
  try {
    const { ctx, pg, errs } = await K.open(browser, { view, save, url: 'index.html?fast=1' });
    await pg.waitForSelector('body[data-ready]', { state: 'attached', timeout: 90000 });
    const picks = await pg.evaluate(async () => (await import('./engine.js')).reviewPicks(['alef', 'beis', 'veis']));
    if (picks[0] === 'beis' && picks[1] === 'veis' && picks.length === 3) oks.push(tag + ': the letter he missed comes first, then the one not seen for longest'); else fails.push(tag + ': wrong order: ' + picks.join(','));
    const skip = await pg.evaluate(async () => { const E = await import('./engine.js'); const u = { known: ['alef'], letters: ['gimmel'] };
      const t = Date.now(); await E.quickReview(u, { kind: 'story2' }); await E.quickReview(u, { kind: 'mastery', mastery: true }); await E.quickReview(u, { kind: 'bonus', bonus: true }); await E.quickReview({ known: [], letters: ['alef'] }, { kind: 'feel' });
      return !document.body.dataset.review && Date.now() - t < 500; });
    if (skip) oks.push(tag + ': no review in an opener, a check, a bonus round or Unit 1'); else fails.push(tag + ': a review ran where it should not');
    const lines0 = await pg.evaluate(() => window.__lines.length);
    await pg.evaluate(() => { import('./engine.js').then(E => E.quickReview({ known: ['alef', 'beis', 'veis'], letters: ['gimmel', 'daled', 'hei'] }, { kind: 'feel' }).then(() => { window.__revDone = 1; })); });
    let first = true; const asked = new Set();
    for (let t = Date.now(); Date.now() - t < 60000 && !(await pg.evaluate(() => window.__revDone));) {
      const r = await pg.evaluate(() => window.__review && window.__review.ready ? window.__review : null);
      if (!r) { await pg.waitForTimeout(120); continue; }
      const keys = Object.keys(r.at);
      if (first) { first = false; const wrong = keys.find(k => k !== r.want); await K.shot(pg, 'remember-' + view + '-1-ask'); await pg.mouse.click(...r.at[wrong]); await pg.waitForTimeout(500); await K.shot(pg, 'remember-' + view + '-2-wrong');
        const said = await pg.evaluate(() => window.__lines.slice(-2).join(' ')); if (/That is .+\. This is /.test(said)) oks.push(tag + ': a wrong tap names the letter and shows the right one'); else fails.push(tag + ': a wrong tap was not explained: ' + said);
        await pg.waitForFunction(() => window.__review && window.__review.ready && !document.querySelector('#rev button.right'), null, { timeout: 20000 }).catch(() => {}); }
      if (keys.length === 3 && keys.includes(r.want)) asked.add(r.want);
      await pg.mouse.click(...r.at[r.want]); await pg.waitForTimeout(400);
    }
    if (asked.size === 3) oks.push(tag + ': asks three earlier letters, each with two others'); else fails.push(tag + ': asked ' + asked.size + ' different letters');
    const lines = await pg.evaluate(n => window.__lines.slice(n), lines0);
    const long = lines.filter(l => l.split(/\s+/).filter(w => /[A-Za-z\[]/.test(w)).length > 12); if (!long.length) oks.push(tag + ': every spoken line is 12 words or fewer'); else fails.push(tag + ': a line is too long: ' + long[0]);
    const sv = await K.saved(pg), m = sv.letters || {};
    if (m.beis && m.beis.w === 2 && m.veis && m.veis.r === 2 && m.alef && m.alef.r === 4) oks.push(tag + ': every answer is remembered per letter (a miss counts once)'); else fails.push(tag + ': letters not remembered right: ' + JSON.stringify(m));
    const gone = await pg.evaluate(() => !document.querySelector('#rev.show') && !document.body.dataset.review); if (gone) oks.push(tag + ': the review closes by itself'); else fails.push(tag + ': the review stayed on screen');
    errs.forEach(e => fails.push(tag + ': ' + e)); await ctx.close();
  } catch (e) { fails.push(tag + ': ' + String(e).slice(0, 220)); }
  return { fails, oks };
};
