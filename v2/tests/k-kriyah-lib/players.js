/* A made-up boy who plays each Kriyah game from start to end (used by the tests and the picture runs).
   Each player makes ONE deliberate mistake first (so the kind correction is checked), then plays right.
   shot(name) is called at: the start, the middle, right after the mistake, and the end. */
const K = require('./kit.js');
const isDone = pg => pg.evaluate(() => !!document.body.dataset.done);
async function loop(pg, step, ms = 420000) { const t = Date.now(); while (!(await isDone(pg))) { if (Date.now() - t > ms) throw new Error('did not finish in ' + Math.round(ms / 1000) + 's'); const did = await step(); if (!did) await pg.waitForTimeout(200); } }
const P = {};
P.story = async (pg, shot, log) => {
  await pg.waitForTimeout(1200); await shot('1-start'); let n = 0, wrong = false;
  await loop(pg, async () => { const tap = await pg.evaluate(() => document.body.dataset.tapReady || null); if (!tap) return false;
    const i = await K.info(pg); n++;
    if (!wrong && n === 1) { wrong = true; await pg.mouse.click(40, (await pg.viewportSize()).height - 120); await pg.waitForTimeout(600); log.wrongHandled = (await pg.evaluate(() => document.body.dataset.tapReady || null)) === tap; await shot('3-wrong'); }
    if (n === 3) await shot('2-middle');
    await pg.mouse.click(...i[tap.split(',')[0]]); await pg.waitForTimeout(700); return true; });
};
P.detective = async (pg, shot, log) => {
  await pg.waitForSelector('body[data-drag-ready]', { timeout: 180000 }); await shot('1-start'); let n = 0;
  let i = await K.info(pg); await K.drag(pg, i.card, i.k === 'beis' ? i.hv : i.hb); await pg.waitForTimeout(700); await shot('3-wrong');
  const lines0 = await pg.evaluate(() => window.__lines.length); await pg.waitForTimeout(1500);
  log.wrongHandled = (await pg.evaluate(() => window.__lines.slice(-3).join(' '))).includes('Look!');
  await loop(pg, async () => { i = await K.info(pg); if (!i || !i.ready) return false; await K.drag(pg, i.card, i.k === 'beis' ? i.hb : i.hv); if (++n === 3) { await pg.waitForTimeout(400); await shot('2-middle'); } await pg.waitForTimeout(300); return true; });
};
P.feel = async (pg, shot, log) => {
  let wrong = false, n = 0;
  await loop(pg, async () => { const i = await K.info(pg); if (i && i.dot) { await pg.mouse.click(...i.dot); await pg.waitForTimeout(500); log.dotTapped = true; return true; }
    if (i && (i.key === 'beis' || i.key === 'kaf')) log.sawBeis = true;
    if (!i || !i.active || i.next >= i.total) return false;
    if (!wrong) { wrong = true; await shot('1-start'); const vs = await pg.viewportSize(); await pg.mouse.click(30, vs.height - 90); await pg.waitForTimeout(800); log.wrongHandled = (await K.info(pg)).off > 0; await shot('3-wrong'); await pg.waitForTimeout(1200); return true; }
    const bs = i.beads; await pg.mouse.move(...bs[i.next]); await pg.mouse.down(); for (let j = i.next + 1; j < bs.length; j++) await pg.mouse.move(...bs[j], { steps: 3 }); await pg.mouse.up();
    if (++n === 2) await shot('2-middle'); await pg.waitForTimeout(400); return true; });
  if (log.sawBeis) (log.dotTapped ? log.oks : log.fails).push('on Beis (or Kaf) he taps the dot');
};
P.hunt = async (pg, shot, log) => {
  await pg.waitForSelector('body[data-hunt-ready]', { timeout: 180000 }); await shot('1-start');
  let i = await K.info(pg);
  { const vs = await pg.viewportSize(); let bad = [], off = [], small = 1e9;   /* hiding places never touch, never leave the screen, and stay big enough to tap */
    i.rects.forEach((a, x) => { small = Math.min(small, a[2] - a[0], a[3] - a[1]); if (a[0] < 0 || a[2] > vs.width || a[1] < 0 || a[3] > vs.height) off.push(x);
      i.rects.forEach((b, y) => { if (x < y && a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]) bad.push(x + '&' + y); }); });
    (bad.length ? log.fails : log.oks).push(bad.length ? 'hiding places touch on screen: ' + bad.join(', ') : 'no two hiding places touch on screen');
    (off.length ? log.fails : log.oks).push(off.length ? 'hiding places off the screen: ' + off.join(', ') : 'every hiding place is fully on screen');
    (small >= 60 ? log.oks : log.fails).push('the smallest letter tile is ' + Math.round(small) + 'px'); } await pg.mouse.click(...i.others[0]); await pg.waitForTimeout(500); await shot('3-wrong');
  await pg.waitForTimeout(1500); log.wrongHandled = (await pg.evaluate(() => window.__lines.join(' '))).includes('That is'); let r2 = false;
  await loop(pg, async () => { i = await K.info(pg); if (!i || !i.active || !i.targets.length) return false; await pg.mouse.click(...i.targets[0]); await pg.waitForTimeout(350);
    if (i.round === 1 && !r2) { r2 = true; await shot('2-middle'); } return true; });
};
P.mistake = async (pg, shot, log) => {
  let n = 0, wrongJ = false, wrongT = false;
  await loop(pg, async () => { const i = await K.info(pg); if (!i) return false;
    if (i.ask && i.yes && i.no) { n++; const right = i.shownKey === i.claim; if (n === 1) await shot('1-start');
      if (!wrongJ && !right) {   /* one mistake: says Yaakov is right when he isn't, then (same round) drags a wrong letter first */ wrongJ = true; await pg.mouse.click(...(right ? i.no : i.yes)); await pg.waitForTimeout(700); await shot('3-wrong'); await pg.waitForTimeout(800); log.wrongHandled = (await pg.evaluate(() => window.__lines.join(' '))).includes('Look again'); }
      else await pg.mouse.click(...(right ? i.yes : i.no)); await pg.waitForTimeout(300); return true; }
    if (i.fix && i.tiles.length === 3 && await pg.evaluate(() => !!document.body.dataset.fixReady)) { const t = i.tiles.find(x => x.k === i.fix);
      if (!wrongT) { wrongT = true; const w = i.tiles.find(x => x.k !== i.fix); await K.drag(pg, w.xy, i.board); await pg.waitForTimeout(2500); await shot('2-middle'); return true; }
      await K.drag(pg, t.xy, i.board); await pg.waitForTimeout(500); return true; }
    return false; });
};
P.mastery = async (pg, shot, log) => {
  let n = 0;
  await loop(pg, async () => { const i = await K.info(pg); if (!i || !i.active || !i.letters[i.want]) return false; n++;
    if (n === 1) await shot('1-start');
    if (n >= 2 && !log.wrongHandled && (log.tries || 0) < 5) {   /* one deliberate wrong tap; if the tap slips past a moving letter, try again on a later question */
      log.tries = (log.tries || 0) + 1; const w = Object.keys(i.letters).find(k => k !== i.want); await pg.mouse.click(...i.letters[w]);
      const got = await K.until(pg, () => window.__lines.join(' ').includes('Here is'), 6000, 150); if (got) { log.wrongHandled = true; await shot('3-wrong'); } return true; }
    if (n === 5) await shot('2-middle');
    await pg.mouse.click(...i.letters[i.want]); await pg.waitForTimeout(300); return true; });
};
P.bonus = async (pg, shot, log) => {
  let wrong = false, n = 0;
  await loop(pg, async () => { const i = await K.info(pg); if (!i || !i.active || !(await pg.evaluate(() => !!document.body.dataset.rainReady))) return false;
    if (!wrong && i.others.length) { if (!log.tries) await shot('1-start'); log.tries = (log.tries || 0) + 1; await pg.mouse.click(...i.others[0]); await pg.waitForTimeout(300);
      log.wrongHandled = (await pg.evaluate(() => window.__lines.join(' '))).includes('That is');   /* a falling letter can slip past the tap: try again (up to 6 times) */
      if (log.wrongHandled || log.tries >= 6) { wrong = true; await shot('3-wrong'); } return true; }
    if (i.targets.length) { await pg.mouse.click(...i.targets[0]); if (++n === 5) await shot('2-middle'); await pg.waitForTimeout(80); return true; } return false; });
};
module.exports = P;
P.soundmatch = async (pg, shot, log) => {
  await pg.waitForSelector('body[data-drag-ready]', { timeout: 180000 }); await shot('1-start'); let n = 0;
  let i = await K.info(pg); const wrongK = Object.keys(i.peds).find(k => k !== i.want);
  await K.drag(pg, i.card, i.peds[wrongK]); await pg.waitForTimeout(600); await shot('3-wrong');
  log.wrongHandled = !!(await K.until(pg, () => window.__lines.join(' ').includes('Listen.'), 8000));
  await loop(pg, async () => { i = await K.info(pg); if (!i || !i.ready) return false; await K.drag(pg, i.card, i.peds[i.want]); if (++n === 2) { await pg.waitForTimeout(400); await shot('2-middle'); } await pg.waitForTimeout(300); return true; });
};
P.train = async (pg, shot, log) => {
  await pg.waitForSelector('body[data-train-ready]', { timeout: 180000 }); await shot('1-start'); let n = 0, wrong = false;
  await loop(pg, async () => { const i = await K.info(pg); if (!i || !i.ready || i.needSlot == null) return false;
    const to = i.slots[i.needSlot];
    if (!wrong) { const w = i.cars.find(c => c.k !== i.need); if (w) { wrong = true; await K.drag(pg, w.xy, to); await pg.waitForTimeout(500); await shot('3-wrong');
      log.wrongHandled = !!(await K.until(pg, () => window.__lines.join(' ').includes('goes here'), 15000)); return true; } }
    const c = i.cars.find(x => x.k === i.need); if (!c) return false; await K.drag(pg, c.xy, to); if (++n === 3) { await pg.waitForTimeout(300); await shot('2-middle'); } await pg.waitForTimeout(300); return true; });
};
P.story2 = P.story;
P.sorter = async (pg, shot, log) => {
  await pg.waitForSelector('body[data-drag-ready]', { timeout: 180000 }); await shot('1-start'); let n = 0;
  let i = await K.info(pg); const wrongK = Object.keys(i.crates).find(k => k !== i.k);
  await K.drag(pg, i.card, i.crates[wrongK]); await pg.waitForTimeout(500); await shot('3-wrong');
  log.wrongHandled = !!(await K.until(pg, () => window.__lines.join(' ').includes('Look!'), 8000));
  await loop(pg, async () => { i = await K.info(pg); if (!i || !i.ready || !i.crates[i.k]) return false; await K.drag(pg, i.card, i.crates[i.k]); if (++n === 9) { await pg.waitForTimeout(300); await shot('2-middle'); } await pg.waitForTimeout(250); return true; });
};
P.story3 = P.story;
P.story4 = P.story;
P.story5 = P.story;
P.story6 = P.story;
P.story7 = P.story;
