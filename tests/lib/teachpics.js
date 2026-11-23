/* PICS-2 teaching pictures (src/RealPicsTeach.html, 2026-11-23). Runs on the kid page from tests/run.js with a made-up boy only.
   With a picture linked for the test (a live library picture, removed again afterwards) it checks, at 390 px and at 1366x768:
   - TODAY WE LEARN ('SKILL|@today', also through a UNIT prefix key): the picture shows, the big emoji hides, one forward button,
     no sideways scroll, the picture is no taller than half the screen;
   - WATCH ME ('SKILL|@watch'): the picture shows under the tag, no sideways scroll, no taller than a third of the screen;
   - a reading passage ('@passage|KEY'): the picture shows inside the passage box;
   - with nothing linked, the screens are exactly as before (no picture, the emoji stays).
   SHOTS=dir saves the screens as PNG (for the pull request). */
const fs = require('fs'), path = require('path');
module.exports = async function teachPicsTests(pg) {
  const out = { fails: [], oks: [] }, root = path.join(__dirname, '..', '..');
  const size = pg.viewportSize(), shots = process.env.SHOTS;
  const serve = r => { const f = path.join(root, 'web/pics', decodeURIComponent(r.request().url().split('/pics/')[1] || '').replace(/[\\/]/g, ''));
    return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'image/webp' }) : r.abort(); };
  await pg.route('https://tashbar-learning-live.web.app/pics/**', serve);
  try {
    for (const vp of [{ width: 390, height: 844 }, { width: 1366, height: 768 }]) {
      await pg.setViewportSize(vp);
      await pg.evaluate(async () => { window.__rtRun = async function* () {
        const sleep = ms => new Promise(res => setTimeout(res, ms)), o = { bad: [], id: '', pass: '', shots: [] };
        if (typeof window.rtDecorate !== 'function') { o.bad.push('RealPicsTeach.html did not load (rtDecorate missing)'); return o; }
        const prevLive = window.OB_LIVE; window.OB_LIVE = 'test';   /* tests/run.js turns One Bite off for its own lesson play; a TEST- boy gets it here */
        try {
        const has = id => !!((typeof BANK_ALL !== 'undefined' && BANK_ALL[id]) || (typeof GEN !== 'undefined' && GEN[id]));
        const worldOf = id => { const pre = id.split('.')[0], map = /^(LK|HEB)$/.test(pre) ? 'LK' : /^(READ|WRIT|LANG)$/.test(pre) ? 'READ' : /^(SS|SOC|FACT)$/.test(pre) ? 'SS' : /^(COMP|VOC)$/.test(pre) ? 'COMP' : pre;
          return WORLD[pre] ? pre : WORLD[map] ? map : Object.keys(WORLD)[0]; };
        const fresh = () => { A.overlay = null; A.play = null; A.res = null; SRV.token = 't'; SRV.states = {}; A.st = loadStudent({ id: 'TEST-PICS2', name: 'Made-up Boy P' }); A.view = 'hub'; render(); };
        const app = () => document.getElementById('app');
        const wide = () => document.documentElement.scrollWidth > window.innerWidth + 1;
        const figH = sel => { const f = app().querySelector(sel + ' .rpbox'); return f ? f.getBoundingClientRect().height : 0; };
        /* a hand-written bite whose first WATCH step has no drawn model */
        const id = Object.keys(ONE_BITE).find(k => { const b = ONE_BITE[k], w = b.watch || {}, s0 = (w.steps || [])[0]; return has(k) && b.band !== 'K1' && !w.m && s0 && typeof s0 === 'string' && /^SCI|^SS|^READ|^MATH/.test(k); });
        if (!id) { o.bad.push('no bite to test with'); return o; } o.id = id;
        const pic = Object.keys(TL_PICS).find(k => TL_PICS[k].w > TL_PICS[k].h * 1.3) || Object.keys(TL_PICS)[0];
        const M = TL_PIC_MAP, keys = [id + '|@today', id + '|@watch'];
        /* 1. nothing linked: as before */
        fresh(); await sleep(10); startMission(worldOf(id), id, 'skill'); await sleep(20);
        if (!A.play || !A.play.ob || A.play.ob.stage !== 'today') { o.bad.push(id + ': did not open on TODAY WE LEARN (got ' + (A.play ? (A.play.ob ? 'stage ' + A.play.ob.stage : 'no One Bite, kind ' + A.play.kind) : 'no lesson') + ')'); return o; }
        if (app().querySelector('.rt')) o.bad.push('TODAY with no picture linked still shows a picture');
        /* 2. TODAY, through the UNIT prefix key */
        const unit = id.split('.').slice(0, -1).join('.'); M[unit + '|@today'] = { id: pic, mark: [], cap: 'Test picture' }; render(); await sleep(400);
        const big = app().querySelector('.ob-main > .ob-bigpic');
        if (!app().querySelector('.rt-today')) o.bad.push('TODAY: the unit picture (' + unit + '|@today) did not show');
        else { if (big && getComputedStyle(big).display !== 'none') o.bad.push('TODAY: the emoji still shows next to the picture');
          if (figH('.rt-today') > innerHeight * 0.5 + 1) o.bad.push('TODAY: the picture is taller than half the screen (' + Math.round(figH('.rt-today')) + ' px of ' + innerHeight + ')');
          if (app().querySelectorAll('.ob-foot button').length !== 1) o.bad.push('TODAY: want ONE forward button'); }
        if (wide()) o.bad.push('TODAY with a picture scrolls sideways at ' + innerWidth + ' px');
        yield ['today', o];
        delete M[unit + '|@today']; M[keys[0]] = { id: pic, mark: [], cap: 'Test picture' }; render(); await sleep(50);
        if (!app().querySelector('.rt-today')) o.bad.push('TODAY: the skill picture (' + keys[0] + ') did not show');
        /* 3. WATCH ME */
        M[keys[1]] = { id: pic, mark: [], cap: 'Test picture' }; A.play.ob.stage = 'watch'; A.play.ob.ws = 0; render(); await sleep(400);
        if (!app().querySelector('.rt-watch')) o.bad.push('WATCH ME: the picture did not show');
        else if (figH('.rt-watch') > innerHeight * 0.34 + 1) o.bad.push('WATCH ME: the picture is taller than a third of the screen');
        if (wide()) o.bad.push('WATCH ME with a picture scrolls sideways at ' + innerWidth + ' px');
        yield ['watch', o];
        keys.forEach(k => delete M[k]); render(); await sleep(20);
        if (app().querySelector('.rt')) o.bad.push('WATCH ME: the picture stayed after it was un-linked');
        /* 4. a reading passage */
        let pid = '', pk = '';
        for (const k of Object.keys(BANK_ALL)) { const b = BANK_ALL[k]; const it = [...(b.teach || []), ...(b.practice || []), ...(b.check || [])].find(x => x && x.p && PASS[x.p]); if (it) { pid = k; pk = it.p; break; } }
        if (!pid) { o.bad.push('no lesson with a reading passage to test with'); return o; } o.pass = pid + ' / ' + pk;
        M['@passage|' + pk] = { id: pic, mark: [], cap: 'Test picture' };
        fresh(); await sleep(10); startMission(worldOf(pid), pid, 'skill'); await sleep(20);
        const p = A.play; if (p && p.ob) p.ob.stage = 'q'; const j = p ? p.items.findIndex(x => x.p === pk) : -1;
        if (j < 0) o.bad.push(pid + ': the passage item is not in the lesson');
        else { p.i = j; render(); await sleep(400);
          if (!app().querySelector('aside.passage .rt-pass')) o.bad.push('passage ' + pk + ': the picture did not show in the passage box');
          if (wide()) o.bad.push('passage with a picture scrolls sideways at ' + innerWidth + ' px');
          const pas = app().querySelector('aside.passage'); if (pas) pas.scrollIntoView(); yield ['passage', o]; }
        delete M['@passage|' + pk];
        return o;
        } finally { window.OB_LIVE = prevLive; } }; window.__rtIt = window.__rtRun(); });
      let r = null;
      for (;;) { const st = await pg.evaluate(async () => { const n = await window.__rtIt.next(); return { done: n.done, v: n.done ? n.value : n.value[1], tag: n.done ? '' : n.value[0] }; });
        if (st.done) { r = st.v; break; }
        if (shots) { fs.mkdirSync(shots, { recursive: true }); await pg.screenshot({ path: path.join(shots, 'teach-' + st.tag + '-' + vp.width + '.png') }); } }
      r.bad.forEach(b => out.fails.push('teaching pictures (' + vp.width + ' px): ' + b));
      if (!r.bad.length) out.oks.push('teaching pictures at ' + vp.width + ' px: TODAY WE LEARN (skill and unit key), WATCH ME and a reading passage show the picture, emoji hidden, no sideways scroll (' + r.id + '; ' + r.pass + ')');
    }
  } finally {
    await pg.unroute('https://tashbar-learning-live.web.app/pics/**', serve).catch(() => {});
    if (size) await pg.setViewportSize(size);
    await pg.evaluate(() => { try { A.overlay = null; A.play = null; A.view = 'hub'; render(); } catch (e) {} }).catch(() => {});
  }
  return out;
};
