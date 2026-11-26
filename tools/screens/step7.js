/* Button system step 7: the Arena (home, Shtender duel), the Chumash page (home and a pasuk) and the Workbook (home, a job, the paper page) with their kit buttons.
   node tools/screens/step7.js OUT TAG GRADE [ids]   (2 = a K-3 boy, 5 = a grade 4+ boy). Made-up boy only.
   The Chumash text comes from Drive on the real server, so here it is a tiny made-up Parsha (two short pesukim, no Divine Name). */
const S = require('../../tests/lib/screens.js');
const OUT = process.argv[2], TAG = process.argv[3] || 'after', GR = Number(process.argv[4] || 5), ONLY = process.argv[5];
require('fs').mkdirSync(OUT, { recursive: true });
const PARSHA = JSON.stringify({ name: 'Bereishis', sefer: 'Bereishis', hi: [0],
  p: [{ r: '1:5', e: 'And it was evening and it was morning, one day.', w: [['וַ/יְהִי', 'and/it was', 'H1961', 1], ['עֶרֶב', 'evening', 'H6153', 0], ['וַ/יְהִי', 'and/it was', 'H1961', 1], ['בֹקֶר', 'morning', 'H1242', 0], ['יוֹם', 'day', 'H3117', 0], ['אֶחָד', 'one', 'H259', 0]] },
      { r: '1:8', e: 'And it was evening and it was morning, a second day.', w: [['וַ/יְהִי', 'and/it was', 'H1961', 1], ['עֶרֶב', 'evening', 'H6153', 0], ['וַ/יְהִי', 'and/it was', 'H1961', 1], ['בֹקֶר', 'morning', 'H1242', 0], ['יוֹם', 'day', 'H3117', 0], ['שֵׁנִי', 'second', 'H8145', 0]] }],
  lex: { H1961: ['היה', 'be', 'word', 1], H6153: ['ערב', 'evening', 'word', 1], H1242: ['בקר', 'morning', 'word', 1], H3117: ['יום', 'day', 'word', 1], H259: ['אחד', 'one', 'word', 1], H8145: ['שני', 'second', 'word', 1] } });
const FAKECHM = P => { const real = google.script.run;
  const mk = (ok, no) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => mk(f, no); if (k === 'withFailureHandler') return f => mk(ok, f); if (k === 'withUserObject') return () => mk(ok, no);
    if (k === 'chmParsha') return () => setTimeout(() => ok && ok(P), 20); if (k === 'arCfList') return () => setTimeout(() => ok && ok({ open: [], mine: [] }), 20); let c = real; if (ok) c = c.withSuccessHandler(ok); if (no) c = c.withFailureHandler(no); return c[k]; } });
  google.script.run = mk(null, null); };
const W = ms => `await new Promise(r=>setTimeout(r,${ms}));`;
const CLICK = sel => `{ const b=document.querySelector(${JSON.stringify(sel)}); if(b) b.click(); }`;
const ITEMS = [
  ['chumash', `(async()=>{ tlChm.open('Bereishis'); })()`],
  ['pasuk', `(async()=>{ tlChm.open('Bereishis'); ${W(700)} ${CLICK('#chm-ov [data-chm="read"]')} })()`],
  ['arena', `tlArena.open()`],
  ['duel', `(async()=>{ tlArena.open(); ${W(700)} ${CLICK('#ar-ov [data-ar="ppnew"]')} })()`],
  ['workbook', `BBX.openBook()`],
  ['job', `(async()=>{ BBX.openBook(); ${W(800)} ${CLICK('#bbx [data-bb="job"]')} })()`],
  ['jobpage', `(async()=>{ BBX.openBook(); ${W(800)} ${CLICK('#bbx [data-bb="job"]')} ${W(600)} ${CLICK('#bbx [data-bb="topage"]')} })()`],
];
const CLEAN = () => { try { window.tlChm && tlChm.close(); } catch (e) {} try { window.tlArena && tlArena.close && tlArena.close(); } catch (e) {} try { window.BBX && BBX.open && BBX.close(); } catch (e) {} try { A.overlay = null; A.view = 'hub'; render(); } catch (e) {} };
(async () => {
  for (const [w, h, nm] of [[1366, 768, 'cb'], [390, 844, 'ph']]) {
    const { browser, pg, errs } = await S.kidPage({ width: w, height: h });
    await pg.evaluate(FAKECHM, PARSHA);
    await pg.evaluate(g => { TL_MAP.grade = g; A.st.grade = g; render(); }, GR);
    for (const [id, code] of ITEMS) {
      if (ONLY && !ONLY.split(',').includes(id)) continue;
      await pg.evaluate(CLEAN); await pg.waitForTimeout(300);
      try { await pg.evaluate(code); } catch (e) { console.log(id, 'ERR', String(e).slice(0, 150)); }
      await pg.waitForTimeout(1800);
      await pg.screenshot({ path: `${OUT}/${TAG}-${id}-${nm}.png` });
      if (process.env.DBG) console.log(await pg.evaluate(new Function(process.env.DBG)));
      console.log(nm, id, JSON.stringify(await pg.evaluate(require('./overlap-home.js'))),
        'non-kit buttons:', await pg.evaluate(() => [...document.querySelectorAll('#chm-ov button:not(.tlk),#bbx button:not(.tlk),#ar-ov button:not(.tlk)')].filter(b => b.offsetParent).map(b => (b.dataset.chm || b.dataset.ar || b.dataset.bb || b.dataset.tool || b.dataset.color || b.className) + ':' + b.textContent.trim().slice(0, 20)).join(' | ') || 'none'));
    }
    if (errs.length) console.log('page errors', errs);
    await browser.close();
  }
})();
