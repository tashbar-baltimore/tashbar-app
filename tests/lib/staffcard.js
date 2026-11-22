/* "One button, one job" on the staff side (HoS 2026-11-21 simplify step 4), on the real staff page + real server code, MADE-UP boys only:
   - a boy card has exactly 5 big buttons and one quiet "More about him" link;
   - "More about him" is a list (one row per job), and each row opens only its own part (never the whole old card);
   - closing that part brings his card back;
   - "Start a class lesson" opens the pick-the-boys / pick-the-lesson / Start screen at once, with the other ways as quiet links.
   Returns { fails: [...], oks: [...] }. */
const H = require('./staffscreens.js');
module.exports = async function staffCard(browser) {
  const fails = [], oks = []; let ctx;
  try {
    const S = await H.staffPage({ browser, width: 1366, wait: 5000 }); ctx = S.ctx; const pg = S.pg;
    const o = await pg.evaluate(async () => { const sleep = ms => new Promise(r => setTimeout(r, ms)), o = {};
      const tab = t => { const b = [...document.querySelectorAll('#sh-top button')].find(b => b.textContent.indexOf(t) >= 0); if (b) b.click(); };
      tab('Students'); await sleep(500);
      const n = [...document.querySelectorAll('[data-shb],[data-act=card]')].find(b => /Made-up Fifth/.test(b.textContent)); if (!n) return o; n.click(); await sleep(600);
      o.acts = [...document.querySelectorAll('#sh-dlg .acts button:not(.more)')].map(b => b.textContent.trim()); o.more = !!document.querySelector('#sh-dlg .acts button.more');
      document.querySelector('#sh-dlg [data-bc=more]').click(); await sleep(300); o.rows = document.querySelectorAll('#sh-dlg .mrow').length; o.rowBtns = document.querySelectorAll('#sh-dlg .mrow[data-bc]').length;
      document.querySelector('#sh-dlg [data-bc=code]').click(); await sleep(1500);
      const d = document.querySelector('#app aside.drawer'); o.focus = !!(d && d.classList.contains('sh-focus'));
      o.shown = d ? [...d.children].filter(c => c.offsetParent !== null && !c.classList.contains('dh')).map(c => (c.querySelector('h3') || c).textContent.trim().slice(0, 20)) : [];
      const x = d && d.querySelector('button.x'); if (x) x.click(); await sleep(1200); o.back = !!document.querySelector('#sh-dlg.boy .acts');
      document.querySelectorAll('#sh-dlg [data-st=close]').forEach(b => b.click()); await sleep(200);
      tab('Today'); await sleep(500); const st = [...document.querySelectorAll('button')].find(b => /Start a class lesson/.test(b.textContent) && b.offsetParent); if (st) st.click(); await sleep(1800);
      const t = document.querySelector('#app aside.drawer'); o.tmTitle = t ? ((t.querySelector('h2') || {}).textContent || '') : ''; o.tmStart = !!(t && [...t.querySelectorAll('button')].some(b => /Start class lesson/.test(b.textContent)));
      o.alt = t ? t.querySelectorAll('.sh-alt button').length : 0; o.chooser = !!document.querySelector('#sh-dlg [data-shs=cls].opt');
      return o; });
    if (!o.acts || o.acts.length !== 5) fails.push('staff boy card: exactly 5 big buttons expected (got ' + JSON.stringify(o.acts) + ')');
    if (!o.more) fails.push('staff boy card: the quiet "More about him" link is missing');
    if (!(o.rows >= 8 && o.rows === o.rowBtns)) fails.push('staff boy card: "More about him" must be a list with one row per job (got ' + o.rows + ' rows)');
    if (!o.focus || o.shown.length !== 1 || !/Sign-in code/.test(o.shown[0] || '')) fails.push('staff boy card: "Sign-in code" must open ONLY that part of the old card (got ' + JSON.stringify(o.shown) + ')');
    if (!o.back) fails.push('staff boy card: closing a part must bring his card back');
    if (!/Start a class lesson/.test(o.tmTitle || '') || !o.tmStart || o.chooser) fails.push('staff: "Start a class lesson" must open the pick-boys / pick-lesson / Start screen at once (got "' + o.tmTitle + '", start button ' + o.tmStart + ', chooser ' + o.chooser + ')');
    (await pg.evaluate(() => window.__srvErr)).forEach(e => fails.push('staff card: server call failed: ' + e)); S.errs.forEach(e => fails.push('staff card page: ' + e));
    if (!fails.length) oks.push('staff boy card: 5 buttons + "More about him" list; each row opens only its part and comes back; "Start a class lesson" is one screen');
  } catch (e) { fails.push('staff card test crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  try { if (ctx) await ctx.close(); } catch (e) {}
  return { fails, oks };
};
