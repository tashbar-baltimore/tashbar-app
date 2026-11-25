const S = require('../../tests/lib/screens.js'); const OUT=process.argv[2], TAG=process.argv[3], NAME=process.argv[4];
(async()=>{ for (const [w,h,nm] of [[1366,768,'cb'],[390,844,'ph']]) { const { browser, pg, errs } = await S.kidPage({ width:w, height:h });
  await pg.evaluate(n=>{ const g=document.createElement('div'); g.id='lg-games'; document.body.appendChild(g); window.__closed=0;
    KMG.start({ mount:g, skills:[{id:'MATH.K.TEST',name:n}], skillId:'MATH.K.TEST', oneRound:true, record(){}, onDone(){}, onClose(){ window.__closed++; g.remove(); } }); }, NAME);
  await pg.waitForTimeout(1500); await pg.screenshot({ path:`${OUT}/${TAG}-kgame-${nm}.png` }); console.log(nm, JSON.stringify(await pg.evaluate(require('./overlap.js'))));
  const x = await pg.$('#lg-games [aria-label="Close"]'); if (x) { await x.click(); await pg.waitForTimeout(300); }
  console.log(nm, 'closed by ✕:', await pg.evaluate(()=>window.__closed), errs.slice(0,3)); await browser.close(); } })();
