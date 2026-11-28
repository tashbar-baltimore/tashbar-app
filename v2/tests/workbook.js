/* 2.0 Block Builders workbook (Mrs. Khaver 2026-11-23): "Teacher: the whole job as one worksheet for the class.
   Boy: only one example at a time; he finishes it, gets a good 'done!' feeling, and moves to the next."
   Played as a made-up boy (no real names or codes) and as a teacher, from v2/app/workbook only. */
const path = require('path');
const W = 'file://' + path.join(__dirname, '..', 'app', 'workbook') + '/';
module.exports = async function (browser) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 workbook: ' + m);
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } }); const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  try {
    await p.goto(W + 'index.html'); await p.waitForFunction(() => window.BBX && window.BB_BOOK && document.getElementById('bbx'), null, { timeout: 15000 });
    const book = await p.evaluate(() => { const bad = []; BB_BOOK.jobs.forEach(j => { try { if (!BBX.compileJob(j).length) bad.push(j.id + ' has no examples'); } catch (e) { bad.push(j.id + ': ' + e.message); } }); return { n: BB_BOOK.jobs.length, bad }; });
    if (book.n < 136) bad('only ' + book.n + ' pages (the workbook has 136 after the cover)'); book.bad.forEach(b => bad('page ' + b));
    /* the boy: Job 1, one example on the screen at a time, no numbers, Next after each right answer */
    await p.click('[data-bb="job"][data-j="R01"]'); await p.waitForTimeout(200);
    for (let k = 0; k < 10 && !(await p.$('[data-bb="topage"]')); k++) { const w = await p.$('[data-bb="wnext"]'); if (!w) break; await w.click(); }
    await p.click('[data-bb="topage"]'); await p.waitForTimeout(200);
    const n = await p.evaluate(() => BBX.cj.length);
    for (let i = 0; i < n; i++) {
      const s = await p.evaluate(() => ({ items: document.querySelectorAll('#bbx [data-it]').length, num: (document.querySelector('#bbx [data-it] .no') || {}).textContent || '', next: !!document.querySelector('#bbx [data-bb="onext"]'), cur: BBX.cur }));
      if (s.items !== 1) { bad('example ' + (i + 1) + ': ' + s.items + ' examples on the screen (should be 1)'); break; }
      if (s.num) bad('example ' + (i + 1) + ' shows a number'); if (s.next) bad('Next shows before he answers');
      const keys = await p.evaluate(() => { const c = BBX.cj[BBX.cur]; return { id: c.id, keys: c.keys.map(k => ({ k: k.k, ans: String(k.ans == null ? '' : k.ans), ch: !!k.ch })) }; });
      for (const k of keys.keys) {
        if (k.ch) { await p.click(`#bbx [data-ci="${keys.id}"][data-ck="${k.k}"][data-cv="${k.ans}"]`); continue; }
        if (await p.evaluate(kk => !(BBX.sel && BBX.sel.k === kk), k.k)) await p.click(`#bbx [data-bi="${keys.id}"][data-bk="${k.k}"]`);
        for (const ch of k.ans) await p.keyboard.press(ch); if (await p.evaluate(() => !!BBX.sel)) await p.keyboard.press('Enter');
      }
      await p.waitForTimeout(80);
      const r = await p.evaluate(() => ({ ok: !!BBX.ok[BBX.cj[BBX.cur].id], next: !!document.querySelector('#bbx [data-bb="onext"]'), yay: !!document.querySelector('#bbx .bbx-yay'), view: BBX.view }));
      if (!r.ok || !r.next || !r.yay) { bad('example ' + (i + 1) + ': a right answer did not show "done" and Next'); break; }
      if (r.view !== 'page') { bad('jumped away before he pressed Next'); break; }
      await p.keyboard.press('Enter'); await p.waitForTimeout(80);
    }
    if (await p.evaluate(() => BBX.view) !== 'done') bad('after the last example the "Job done" screen did not show');
    else out.oks.push('2.0 workbook: the boy sees one example at a time, "done!" and Next after each, then Job done (' + n + ' examples, ' + book.n + ' pages)');
    await ctx.close();
    /* the teacher: the whole page as one worksheet, Show answers, nothing saved */
    const t = await browser.newContext({ viewport: { width: 1366, height: 768 } }); const q = await t.newPage(); q.on('pageerror', e => errs.push('teacher: ' + e.message));
    await q.goto(W + 'teacher.html'); await q.waitForFunction(() => window.BBX && document.getElementById('bbx'), null, { timeout: 15000 });
    await q.evaluate(() => BBX.openJob('R01', 1)); await q.waitForTimeout(200);
    const tv = await q.evaluate(() => ({ items: document.querySelectorAll('#bbx [data-it]').length, all: BBX.cj.length, star: !!document.querySelector('#bbx .bbx-star'), fin: !!document.querySelector('#bbx .bbx-fin') }));
    if (tv.items !== tv.all) bad('teacher page shows ' + tv.items + ' of ' + tv.all + ' examples (should be the whole page)');
    if (tv.star || tv.fin) bad('teacher page shows a score or a finish button');
    await q.click('[data-bb="tans"]'); await q.waitForTimeout(150);
    if (!(await q.evaluate(() => document.querySelectorAll('#bbx .bbx-ans').length > 5))) bad('Show answers did not show the answers');
    if (await q.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('bbx')).length)) bad('the teacher page saved something');
    if (!out.fails.length) out.oks.push('2.0 workbook: the teacher sees the whole page, can show the answers, nothing is saved');
    await t.close();
  } catch (e) { bad('crashed: ' + String(e).slice(0, 200)); }
  errs.forEach(e => bad('page error: ' + e));
  return out;
};
