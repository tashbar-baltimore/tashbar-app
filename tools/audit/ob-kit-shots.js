/* Phone pictures (390 px, 2x) of Activity Kit activities, for PRs and docs/screens/ob-kit-*.png.
   Run: ACTS='[{"type":"tenframe","n":4,"start":9}]' BAND=K1 NAME=takeaway node tools/audit/ob-kit-shots.js
   Each activity gets a picture when it opens (and STEPS=n more after n taps toward the answer). Out: tools/audit/out/kit-shots/ */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const B = require('../../tests/lib/build.js'), FAKE = require('./fake.js');
const OUT = path.join(__dirname, 'out', 'kit-shots'); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const K = B.kid(), br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: +(process.env.DPR || 2) }); await ctx.addInitScript(FAKE, { tools: K.tools, parts: K.parts });
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await pg.route('**/*', r => r.request().url() === 'http://app.test/' ? r.fulfill({ contentType: 'text/html', body: K.page }) : r.abort());
  await pg.goto('http://app.test/');
  await pg.waitForFunction(() => window.TLT && typeof BANK_ALL !== 'undefined' && Object.keys(BANK_ALL).length > 500, null, { timeout: 180000 }); await pg.waitForTimeout(12000);
  await pg.evaluate(src => { window.__obkStep = (0, eval)('(' + src + ')'); }, require('../../tests/lib/onebite.js').obkStep.toString());
  const acts = JSON.parse(process.env.ACTS), band = process.env.BAND || 'K1', name = process.env.NAME || 'kit', steps = +(process.env.STEPS || 0), files = [];
  for (let i = 0; i < acts.length; i++) {
    await pg.evaluate(({ acts, band, i }) => { window.OB_LIVE = 'test'; const id = ['MATH.OPS.L01.04', 'MATH.CNT.L01.01'].find(x => BANK_ALL[x] || (typeof GEN !== 'undefined' && GEN[x])) || Object.keys(BANK_ALL).find(x => /^MATH\..*\.L01\./.test(x));
      ONE_BITE[id] = { band, pic: '🔢', today: 'Kit picture', why: 'x', watch: { q: 'Watch', steps: ['One.', 'Two.'] }, oops: { wrong: '1', right: '2', why: 'x' }, ways: ['a', 'b'], do: [acts[i]], your: [acts[i], acts[i], acts[i]] };
      A.overlay = null; SRV.token = 't'; SRV.states = {}; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.view = 'hub'; render(); const pre = id.split('.')[0]; startMission(WORLD[pre] ? pre : Object.keys(WORLD)[0], id, 'skill');
      const p = A.play; p.ob.stage = 'your'; p.ob.kit = { list: 'your', acts: p.ob.kitYour, i: 0, streak: 1, n: 0, s: OBK.init(p.ob.kitYour[0], {}) }; render(); scrollTo(0, 0); }, { acts, band, i });
    await pg.waitForTimeout(300); let f = name + '-' + (i + 1) + '.png'; await pg.screenshot({ path: path.join(OUT, f) }); files.push(f);
    for (let k = 0; k < steps; k++) await pg.evaluate(() => window.__obkStep(false));
    if (steps) { await pg.waitForTimeout(200); f = name + '-' + (i + 1) + 'b.png'; await pg.screenshot({ path: path.join(OUT, f) }); files.push(f); }
  }
  console.log('pictures', files.join(' '), 'page errors', errs.length, errs.slice(0, 3)); await br.close();
})();
