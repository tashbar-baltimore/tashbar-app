/* Button system "labels everywhere": Mistake Detective (start, a case, the end), the My week page, the old rooms (badges, week, bank, journey map),
   a One Bite lesson and a boss round (lesson screens), the Arena home tiles and the Chumash activity cards, at 1366x768 and 390x844.
   node tools/screens/labels.js OUT TAG GRADE [ids]   (2 = a K-3 boy, 5 = a grade 4+ boy). Made-up boy only; tiny made-up Parsha as in step7.js.
   Prints any visible non-kit button and any label with a shadow, outline or hand pointer. */
const S = require('../../tests/lib/screens.js');
const OUT = process.argv[2], TAG = process.argv[3] || 'after', GR = Number(process.argv[4] || 5), ONLY = process.argv[5];
require('fs').mkdirSync(OUT, { recursive: true });
const PARSHA = JSON.stringify({ name: 'Bereishis', sefer: 'Bereishis', hi: [0],
  p: [{ r: '1:5', e: 'And it was evening and it was morning, one day.', w: [['וַ/יְהִי', 'and/it was', 'H1961', 1], ['עֶרֶב', 'evening', 'H6153', 0], ['בֹקֶר', 'morning', 'H1242', 0], ['יוֹם', 'day', 'H3117', 0], ['אֶחָד', 'one', 'H259', 0]] }],
  lex: { H1961: ['היה', 'be', 'word', 1], H6153: ['ערב', 'evening', 'word', 1], H1242: ['בקר', 'morning', 'word', 1], H3117: ['יום', 'day', 'word', 1], H259: ['אחד', 'one', 'word', 1] } });
const FAKECHM = P => { const real = google.script.run;
  const mk = (ok, no) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => mk(f, no); if (k === 'withFailureHandler') return f => mk(ok, f); if (k === 'withUserObject') return () => mk(ok, no);
    if (k === 'chmParsha') return () => setTimeout(() => ok && ok(P), 20); if (k === 'arCfList') return () => setTimeout(() => ok && ok({ open: [], mine: [] }), 20); let c = real; if (ok) c = c.withSuccessHandler(ok); if (no) c = c.withFailureHandler(no); return c[k]; } });
  google.script.run = mk(null, null); };
const W = ms => `await new Promise(r=>setTimeout(r,${ms}));`;
const ROOM = t => `(()=>{ const w=document.createElement('div'); w.innerHTML='<button data-gm="room" data-t="${t}">b</button>'; document.body.appendChild(w); w.firstChild.click(); w.remove(); })()`;
const WORLDOF = `const worldOf=id=>{ const pre=id.split('.')[0], map=/^(LK|HEB)$/.test(pre)?'LK':/^(READ|WRIT|LANG)$/.test(pre)?'READ':/^(SS|SOC|FACT)$/.test(pre)?'SS':/^(COMP|VOC)$/.test(pre)?'COMP':pre; return WORLD[pre]?pre:WORLD[map]?map:Object.keys(WORLD)[0]; };`;
const ITEMS = [
  ['mdintro', `TL_MD.open()`],
  ['mdcase', `(async()=>{ TL_MD.open(); ${W(400)} document.querySelector('#mdx [data-md="start"]').click(); })()`],
  ['mdend', `(async()=>{ const s=ms=>new Promise(r=>setTimeout(r,ms)); TL_MD.open(); const t0=Date.now();
     while(Date.now()-t0<120000 && !document.querySelector('#mdx .mdend')){ const b=[...document.querySelectorAll('#mdx [data-md="start"],#mdx [data-md="next"],#mdx .mdb:not([disabled])')].pop(); if(b) b.click(); await s(1300); } })()`],
  ['myweek', `(()=>{ const b=document.querySelector('#gm [data-gmnav="me"]'); if(b) b.click(); else { GM.tab='me'; GM.sig=''; render(); } })()`],
  ['rbadges', ROOM('badges')], ['rweek', ROOM('week')], ['rbank', ROOM('bank')], ['rjourney', ROOM('map')],
  ['lesson', `(async()=>{ ${WORLDOF} const band=${GR}<=1?'K1':${GR}<=3?'B23':${GR}<=5?'E45':'M68'; const id=Object.keys(ONE_BITE).find(k=>ONE_BITE[k].band===band&&(ONE_BITE[k].do||[]).length)||Object.keys(ONE_BITE)[0]; A.overlay=null; startMission(worldOf(id),id,'skill'); ${W(500)}
     for(let k=0;k<3&&!document.querySelector('.ob-qtag');k++){ const b=document.querySelector('.overlay [data-act="closeov"],.ob-foot .ob-go'); if(b) b.click(); ${W(500)} } })()`],
  ['boss', `(async()=>{ const c=Object.keys(A.st.ranges||{}).find(k=>WORLD[k])||'MATH'; A.overlay=null; startMission(c,null,'boss'); ${W(500)} const b=document.querySelector('.overlay [data-act="closeov"]'); if(b) b.click(); })()`],
  ['arena', `tlArena.open()`],
  ['chumash', `tlChm.open('Bereishis')`],
  ['chumashlv', `(async()=>{ tlChm.open('Bereishis'); ${W(700)} const l=document.querySelector('#chm-ov [data-chm="levels"]'); if(l) l.click(); })()`],
];
const CLEAN = () => { try { TL_MD.close(); } catch (e) {} try { document.getElementById('gm-room') && document.getElementById('gm-room').remove(); } catch (e) {} try { window.tlChm && tlChm.close(); } catch (e) {} try { window.tlArena && tlArena.close && tlArena.close(); } catch (e) {}
  try { document.body.classList.remove('ob-on'); A.overlay = null; A.play = null; A.view = 'hub'; GM.from = null; GM.tab = 'home'; GM.sig = ''; render(); } catch (e) {} };
const CHECK = () => { const vis = e => e.offsetParent || getComputedStyle(e).position === 'fixed';
  const scope = '#mdx,#gm-room,#chm-ov,#ar-ov,.ob,.play,.lf-card';
  const nonkit = [...document.querySelectorAll([...scope.split(',')].map(s => s + ' button:not(.tlk)').join(','))].filter(vis).map(b => (b.className || b.dataset.act || '') + ':' + b.textContent.trim().slice(0, 18));
  const badLab = [...document.querySelectorAll('.tlk-pill,.tlk-box')].filter(e => vis(e) && !e.closest('button')).filter(e => { const s = getComputedStyle(e); return s.boxShadow !== 'none' || parseFloat(s.borderTopWidth) > 0 || s.cursor === 'pointer'; }).map(e => e.textContent.slice(0, 20));
  return { nonkit: [...new Set(nonkit)].slice(0, 14), badLabels: badLab }; };
(async () => {
  for (const [w, h, nm] of [[1366, 768, 'cb'], [390, 844, 'ph']]) {
    const { browser, pg, errs } = await S.kidPage({ width: w, height: h });
    await pg.evaluate(FAKECHM, PARSHA);
    await pg.evaluate(g => { TL_MAP.grade = g; A.st.grade = g; GM.sig = ''; render(); }, GR);
    for (const [id, code] of ITEMS) {
      if (ONLY && !ONLY.split(',').includes(id)) continue;
      await pg.evaluate(CLEAN); await pg.waitForTimeout(300);
      try { await pg.evaluate(code); } catch (e) { console.log(id, 'ERR', String(e).slice(0, 150)); }
      await pg.waitForTimeout(id === 'mdend' ? 2500 : 1800);
      await pg.screenshot({ path: `${OUT}/${TAG}-${id}-${nm}.png` });
      console.log(nm, id, JSON.stringify(await pg.evaluate(CHECK)));
    }
    if (errs.length) console.log('page errors', errs.slice(0, 5));
    await browser.close();
  }
})();
