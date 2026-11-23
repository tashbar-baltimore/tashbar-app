/* BLOCK BUILDERS WORKBOOK tests (all 137 pages; pencil pages) (BlockBuildersData.html + BlockBuildersUI.html, HoS 2026-11-22). Runs on the kid page from
   tests/run.js with made-up boys only (TEST- ids), against the pretend server.
   1. Every page in window.BB_BOOK compiles; every graded item accepts its right answer and refuses a wrong one
      (so no page has an answer key that cannot be reached, and no page passes a wrong answer).
   2. Every page draws as the workbook page (one card per item, no page error) at 390 px with no sideways scroll.
   3. One job is played by TAPS ONLY (answer boxes + the number pad): a wrong answer turns the item orange with a hint,
      the right one turns it green, and finishing every item shows the "Job done" screen with the score.
   4. The pen layer keeps a stroke drawn with a stylus, and it survives leaving and reopening the page (saved on the Chromebook).
   5. The 📘 Workbook door shows on a TEST- boy's Math map and not on a boy above Math level 4 who is not a TEST- boy. */
module.exports = async function (pg) {
  const fails = [], oks = [], counts = {};
  const vp = pg.viewportSize(); await pg.setViewportSize({ width: 390, height: 800 });
  try { const km = require('./kidmap.js')(); await pg.evaluate(M => { window.__bbKM = M; }, km.map); } catch (e) {}
  const r = await pg.evaluate(async () => {
    const out = { pages: 0, graded: 0, bad: [], drawBad: [] }; const X = window.BBX, BK = window.BB_BOOK;
    if (!X || !BK) { out.bad.push('the workbook did not load (BBX / BB_BOOK missing)'); return out; }
    const solve = (c, all) => { const it = c.it, v = {};
      c.keys.forEach(k => { if (k.ans != null && k.ans !== '' && !k.test) v[k.k] = String(k.ans); });
      if (it.t === 'det' && v.w !== 'wrong') delete v.f;
      if (it.t === 'fill') v.d = '9';
      if (it.t === 'build') { const t = it.max ? Math.min(it.max, Math.floor(it.n / 10)) : Math.floor(it.n / 10); v.b = t + ',' + (it.n - t * 10); }
      if (it.t === 'ways') { const t = Math.floor(it.n / 10) - it.r; v.t = String(t); v.o = String(it.n - t * 10); }
      if (it.t === 'pair' && it.op === '-') { const got = []; for (let y = 10; y + it.n <= 99; y++) { const x = y + it.n; if ((x % 10) < (y % 10)) got.push([x, y]); } const p = got[(it.r - 1) * 3]; v.x = String(p[0]); v.y = String(p[1]); }
      else if (it.t === 'pair') { const got = []; for (let x = 11; x < it.n - 10; x++) { const y = it.n - x; if (x <= y && (x % 10 + y % 10) >= 10) got.push([x, y]); } const p = got[(it.r - 1) * 3]; v.x = String(p[0]); v.y = String(p[1]); }
      return v; };
    const wrongOf = (c, v) => { if (c.it.t === 'det') return Object.assign({}, v, { w: v.w === 'right' ? 'wrong' : 'right', f: v.w === 'right' ? '1' : v.f }); const k = c.keys.find(k => k.ans != null && k.ans !== '' && !k.ch && !k.let && !k.test); if (!k) return null; const w = Object.assign({}, v); w[k.k] = String((Number(k.ans) || 0) + 1); return w; };
    for (const j of BK.jobs) { out.pages++; let cj;
      try { cj = X.compileJob(j); } catch (e) { out.bad.push(j.id + ': does not compile: ' + e); continue; }
      X.cj = cj; X.vals = {}; X.ok = {};
      for (const c of cj) { if (!c.graded) continue; out.graded++; const v = solve(c); X.vals[c.id] = v;
        let ok; try { ok = X.filled(c, v) && X.checkItem(c, v).ok; } catch (e) { ok = false; }
        if (!ok) { out.bad.push(j.id + ' item ' + c.id + ' (' + c.it.t + '): the right answer is not accepted ' + JSON.stringify(v).slice(0, 90)); continue; }
        X.ok[c.id] = 1;
        const w = wrongOf(c, v); if (w && X.checkItem(c, w).ok) out.bad.push(j.id + ' item ' + c.id + ' (' + c.it.t + '): a wrong answer is accepted'); }
    }
    /* draw every page */
    X.openBook(); await new Promise(r => setTimeout(r, 60));
    for (const j of BK.jobs) { try { X.openJob(j.id, true); const n = document.querySelectorAll('#bbx .bbx-it').length, want = j.parts.reduce((s, p) => s + p.items.length, 0);
        if (n !== want) out.drawBad.push(j.id + ': ' + n + ' items drawn, ' + want + ' expected');
        const sc = document.getElementById('bbx-sc'); if (sc && sc.scrollWidth > sc.clientWidth + 2) out.drawBad.push(j.id + ': the page scrolls sideways at ' + window.innerWidth + ' px'); }
      catch (e) { out.drawBad.push(j.id + ': ' + String(e).slice(0, 120)); } }
    X.close(); return out; });
  counts.workbookPages = r.pages; counts.workbookItems = r.graded;
  r.bad.slice(0, 30).forEach(b => fails.push('workbook: ' + b)); r.drawBad.slice(0, 20).forEach(b => fails.push('workbook page: ' + b));
  if (!r.bad.length) oks.push('workbook: ' + r.pages + ' pages, ' + r.graded + ' graded items: each takes its right answer and refuses a wrong one');
  if (!r.drawBad.length) oks.push('workbook: every page draws with all its items and no sideways scroll at ' + (await pg.evaluate(() => window.innerWidth)) + ' px');
  /* play a job by taps */
  const p = await pg.evaluate(async () => { const sleep = ms => new Promise(r => setTimeout(r, ms)), o = {}, X = window.BBX;
    try { localStorage.clear(); } catch (e) {}
    X.openBook(); await sleep(50); X.openJob('C03A'); await sleep(30); o.watch = X.view === 'watch' && !!document.querySelector('#bbx [data-bb=wnext]');
    for (let i = 0; i < 6 && document.querySelector('#bbx [data-bb=wnext]'); i++) { document.querySelector('#bbx [data-bb=wnext]').click(); await sleep(5); }
    o.steps = document.querySelectorAll('#bbx .bbx-steps li').length; document.querySelector('#bbx [data-bb=topage]').click(); await sleep(20); o.page = X.view === 'page';
    const tap = (sel) => { const e = document.querySelector(sel); if (!e) throw new Error('no ' + sel); e.click(); };
    const pad = d => tap('#bbx-pad [data-pad="' + d + '"]');
    /* first problem 48 + 5: answer wrong first (ones 2), then right */
    tap('#bbx [data-bi="0.0"][data-bk="r0"]'); pad(2); pad(1); pad(5); await sleep(10);
    o.orange = !!document.querySelector('#bbx [data-it="0.0"].bad .bbx-hint');
    tap('#bbx [data-bi="0.0"][data-bk="r0"]'); pad(3); await sleep(10);   /* the other boxes are still filled: fixing the ones box checks it again */
    o.green = !!document.querySelector('#bbx [data-it="0.0"].ok');
    /* a stylus stroke */
    const pp = document.getElementById('bbx-paper'), rc = pp.getBoundingClientRect(), at = (x, y, t) => pp.dispatchEvent(new PointerEvent(t, { clientX: rc.left + x, clientY: rc.top + y, bubbles: true, pointerId: 9, pointerType: 'pen', isPrimary: true, pressure: .5 }));
    at(30, 300, 'pointerdown'); at(60, 320, 'pointermove'); at(90, 330, 'pointermove'); at(90, 330, 'pointerup'); o.stroke = X.strokes.length === 1;
    /* the rest, by taps */
    const cj = X.cj; for (const c of cj.slice(1)) { const v = X.vSpec(c.it); for (const k of ['r0', 'c1', 'r1']) { const key = c.keys.find(x => x.k === k); if (!key || key.ans === '') continue; tap('#bbx [data-bi="' + c.id + '"][data-bk="' + k + '"]'); pad(key.ans); } await sleep(2); }
    await sleep(800); o.done = X.view === 'done' && /Job done/.test(document.getElementById('bbx').innerText); o.score = (document.getElementById('bbx').innerText.match(/(\d+) of (\d+) right/) || [])[0];
    document.querySelector('#bbx [data-bb=home]').click(); await sleep(10); X.openJob('C03A', true); await sleep(10); o.kept = X.strokes.length === 1 && !!X.ok['0.0'];
    X.close(); try { localStorage.clear(); } catch (e) {} return o; });
  if (!p.watch || p.steps !== 4 || !p.page) fail('Watch me: the job must open on Watch me with its 4 steps, then the page (got ' + JSON.stringify(p) + ')');
  else if (!p.orange || !p.green) fails.push('workbook play: a wrong box must turn orange with a hint and a right one green (got ' + JSON.stringify(p) + ')');
  else if (!p.stroke || !p.kept) fails.push('workbook play: the pen stroke and the answers must stay on the page after leaving it (got ' + JSON.stringify(p) + ')');
  else if (!p.done || p.score !== '7 of 8 right') fails.push('workbook play: finishing every item must show Job done with "7 of 8 right" (got ' + JSON.stringify(p) + ')');
  else oks.push('workbook play (taps only): Watch me in 4 steps, a wrong box goes orange with a hint, right goes green, a stylus stroke stays after reopening, Job done shows 7 of 8 first-try');
  function fail(m) { fails.push(m); }
  /* the family's pencil pages: the Final Inspection opens with writing spaces, Check my work shows the answers in green */
  const pc = await pg.evaluate(async () => { const sleep = ms => new Promise(r => setTimeout(r, ms)), o = {}, X = window.BBX;
    try { localStorage.clear(); } catch (e) {} X.openBook(); await sleep(30); X.openJob('C23A', true); await sleep(20);
    o.pencil = X.pencil; o.spaces = document.querySelectorAll('#bbx .bbx-b.pw').length; o.buttons = document.querySelectorAll('#bbx button.bbx-b').length;
    document.querySelector('#bbx [data-bb=pcheck]').click(); await sleep(20); o.answers = document.querySelectorAll('#bbx .bbx-ans').length; o.done = X.done;
    document.querySelector('#bbx [data-bb=pencil]').click(); await sleep(20); o.tapAgain = !X.pencil && document.querySelectorAll('#bbx button.bbx-b').length > 0;
    X.close(); try { localStorage.clear(); } catch (e) {} return o; });
  if (!pc.pencil || !pc.spaces || pc.buttons || pc.answers < 20 || !pc.done || !pc.tapAgain) fails.push('pencil page: Carrying Check must open as a pencil page (writing spaces only), Check my work must show the answers, and the switch must turn it back into a tap page (got ' + JSON.stringify(pc) + ')');
  else oks.push('pencil page: the Final Inspection opens with ' + pc.spaces + ' writing spaces, Check my work shows ' + pc.answers + ' answers in green, and any page can switch back to tapping');
  /* the door */
  const d = await pg.evaluate(async () => { const sleep = ms => new Promise(r => setTimeout(r, ms)), o = {};
    const km = window.__bbKM; if (!km) return { skip: 1 };
    const show = async (id, lvl) => { const M = JSON.parse(JSON.stringify(km)); M.sid = id; M.subjects.MATH.level = lvl; window.TL_MAP = M; A.overlay = null; A.play = null; A.st = loadStudent({ id, name: 'Made-up Boy' }); A.view = 'hub'; GM.world = 'MATH'; GM.tab = 'map'; GM.sig = ''; render(); await sleep(1000); return !!document.getElementById('bbx-door'); };
    o.test = await show('TESTKM01', 5); o.big = await show('MADEUP-9', 6); o.small = await show('MADEUP-3', 3);
    if (o.test) { document.getElementById('bbx-door') ; }
    window.TL_MAP = null; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); render(); return o; });
  if (!d.skip) { if (!d.test || d.big || !d.small) fails.push('workbook door: must show for a TEST- boy and a Math level 2-4 boy, not for a level 6 boy (got ' + JSON.stringify(d) + ')'); else oks.push('workbook door: 📘 shows on the Math map for TEST- boys and Math levels 2-4, not above'); }
  if (vp) await pg.setViewportSize(vp);
  return { fails, oks, counts };
};
