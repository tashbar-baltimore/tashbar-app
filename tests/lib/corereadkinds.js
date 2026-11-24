/* Core Growth (job T): the "read" and "proof" activity kinds (src/CoreKitActs.html) open the Reader from a lesson's data alone.
   1. Played inside the REAL One Bite player as a TEST- boy, with the made-up chapter tests/fixtures/ZZTEST.KEY.01.txt (core.js serves it):
      read: Open the book, close it early (he is told to read to the end), open again, read to the end: the activity is right.
      proof: Find the proof, one wrong sentence (the Reader says what to look for), then the proof: right, but not first try.
      The lesson goes on to the next activity both times. Unit checks and K-1 games refuse these two kinds.
   2. Every real lesson that uses them names a text that is in texts/, and a proof that is in exactly ONE sentence of it; read only in "do". */
const path = require('path');
module.exports = async function (pg) {
  const fails = [], oks = [];
  const r = await pg.evaluate(async () => {
    const out = { bad: [], seen: {} }, sleep = ms => new Promise(x => setTimeout(x, ms)), Q = s => document.querySelector(s);
    const until = async (f, ms) => { for (let i = 0; i < (ms || 3000) / 30; i++) { if (f()) return true; await sleep(30); } return false; };
    for (let i = 0; i < 100 && !(window.TLCORE && TLCORE.actsJoined); i++) await sleep(50);
    ['read', 'proof'].forEach(k => { if (!OBK.types[k]) out.bad.push(k + ' did not join the Activity Kit'); });
    if (out.bad.length) return out;
    if (!OBK.err({ type: 'read', text: 'nope' }, 'B23')) out.bad.push('read: a bad text id was not refused');
    if (!OBK.err({ type: 'proof', text: 'ZZTEST.KEY.01', q: 'Why?', proof: 'Dovid' }, 'B23')) out.bad.push('proof: a one-word proof was not refused');
    if (TLCORE.units && !/Reader/.test(TLCORE.units.err({ id: 'ZZ.U01', title: 'x', c: 'READ', skills: ['a', 'b'], items: [{ skill: 'a', type: 'proof', text: 'ZZTEST.KEY.01', q: 'q', proof: 'Dovid gasped' }] }))) out.bad.push('a unit check must refuse a proof item');
    if (TLCORE.k1 && !/Reader/.test(TLCORE.k1.err({ id: 'READ.PHON.L01.91', grade: 0, name: 'x', acts: [{ type: 'read', text: 'ZZTEST.KEY.01' }, { type: 'listen', hear: 'b', o: ['b', 'd'], a: 'b' }, { type: 'listen', hear: 'b', o: ['b', 'd'], a: 'b' }, { type: 'listen', hear: 'b', o: ['b', 'd'], a: 'b' }] }) || '')) out.bad.push('a K-1 game must refuse a read act');
    const FIX = Object.keys(BANK_ALL).find(x => /^READ\.COMP\.L04\./.test(x)) || Object.keys(BANK_ALL).find(x => /^READ\./.test(x));
    const keep = ONE_BITE[FIX], prev = window.OB_LIVE, KEEP = { st: A.st }; window.OB_LIVE = 'test';
    const world = (() => { const pre = FIX.split('.')[0]; return WORLD[pre] ? pre : 'READ'; })();
    try {
      ONE_BITE[FIX] = { band: 'B23', pic: '📖', today: 'Reader test lesson', why: 'Testing.', watch: { q: 'Watch', steps: ['One.', 'Two.'] }, oops: { wrong: '1', right: '2', why: 'x' }, ways: ['a', 'b'],
        do: [{ type: 'read', text: 'ZZTEST.KEY.01', page: 0 }, { type: 'proof', text: 'ZZTEST.KEY.01', q: 'Which sentence shows Dovid was surprised?', proof: 'Dovid gasped', look: 'how Dovid felt' }],
        your: [{ type: 'cloze', t: 'The ant carried a ___.', o: ['crumb', 'cloud'], a: 'crumb' }, { type: 'order', steps: ['One.', 'Two.', 'Three.'] }, { type: 'cloze', t: 'A ___ barks.', o: ['dog', 'cup'], a: 'dog' }, { type: 'order', steps: ['A.', 'B.'] }, { type: 'cloze', t: 'I ___ water.', o: ['drink', 'sing'], a: 'drink' }] };
      A.overlay = null; A.play = null; A.res = null; SRV.token = 't'; SRV.states = {}; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); try { delete (A.st.reads || {})['ZZTEST.KEY.01']; } catch (e) {} A.view = 'hub'; render(); await sleep(15);
      startMission(world, FIX, 'skill'); await sleep(20);
      const p = A.play; if (!p || !p.ob) throw new Error('the made-up lesson did not open as a One Bite lesson');
      for (let n = 0; n < 40 && p.ob.stage !== 'do'; n++) { const rp = Q('#app [data-ob=rpick]:not([disabled])'); if (rp) { const q = p.ob.bite.ready[p.ob.ri]; Q('#app [data-ob=rpick][data-k="' + q.o.indexOf(q.a) + '"]').click(); await sleep(5); continue; }
        const g = Q('#app .ob-foot .ob-go'); if (!g) break; g.click(); await sleep(5); }
      if (p.ob.stage !== 'do' || p.ob.kit.acts[p.ob.kit.i].type !== 'read') throw new Error('did not reach the read activity (stage ' + p.ob.stage + ')');
      /* read: open, close early, open again, read to the end */
      out.seen.readBtn = (Q('#app [data-obk=open]') || {}).textContent || '';
      Q('#app [data-obk=open]').click(); if (!await until(() => Q('#crd .crd-cover'))) throw new Error('read: the Reader did not open');
      const shows = () => { const c = Q('#crd'), b = c && c.getBoundingClientRect(); return !!b && b.width >= innerWidth - 1 && b.height >= innerHeight - 1 && getComputedStyle(c).display !== 'none' && document.elementFromPoint(innerWidth / 2, innerHeight / 2).closest('#crd'); };
      out.seen.readShows = shows(); out.seen.readTitle = (Q('#app .cka-bt') || {}).textContent || '';
      Q('#crd [data-crd=exit]').click(); await until(() => !Q('#crd') && Q('#app [data-obk=open]:not([disabled])'));
      out.seen.early = (Q('#app .ob-soft') || {}).textContent || ''; out.seen.earlyOver = p.ob.kit.s.over;
      Q('#app [data-obk=open]').click(); await until(() => Q('#crd .crd-cover')); Q('#crd [data-crd=start]').click(); await sleep(60);
      for (let i = 0; i < 6 && Q('#crd [data-crd=next]'); i++) { Q('#crd [data-crd=next]').click(); await sleep(60); }
      if (!Q('#crd [data-crd=finish]')) throw new Error('read: no chapter-done screen');
      Q('#crd [data-crd=finish]').click(); await until(() => p.ob.kit.s.over);
      out.seen.readRes = Object.assign({}, p.results[p.ob.krec.length - 1] || {}); out.seen.readOk = p.ob.kit.s.ok;
      Q('#app .ob-foot [data-ob=knext]').click(); await sleep(20);
      if (p.ob.kit.acts[p.ob.kit.i].type !== 'proof') throw new Error('did not reach the proof activity');
      out.seen.proofQ = (Q('#app .obk-q') || {}).textContent || '';
      Q('#app [data-obk=open]').click(); if (!await until(() => Q('#crd.pick'))) throw new Error('proof: the Reader question did not open');
      out.seen.proofShows = shows(); const S = TLCORE.reader.state(), want = S.ask.proof[0], wrong = [...document.querySelectorAll('#crd [data-crds]')].map(x => +x.getAttribute('data-crds')).find(i => i !== want);
      Q('#crd [data-crds="' + wrong + '"]').click(); await sleep(60); out.seen.miss = (Q('#crd .crd-fb') || {}).textContent || '';
      Q('#crd [data-crds="' + want + '"]').click(); await sleep(60); Q('#crd [data-crd=finish]').click(); await until(() => p.ob.kit.s.over);
      out.seen.proofRes = Object.assign({}, p.results[p.ob.krec.length - 1] || {}); out.seen.proofOk = p.ob.kit.s.ok;
      Q('#app .ob-foot [data-ob=knext]').click(); await sleep(20); out.seen.after = p.ob.stage + ':' + (p.ob.kit ? p.ob.kit.acts[p.ob.kit.i].type : '');
      out.seen.wide = document.documentElement.scrollWidth > innerWidth + 1;
    } catch (e) { out.bad.push(String(e.message || e).slice(0, 300)); }
    try { if (TLCORE.reader.isOpen()) TLCORE.reader.close(); } catch (e) {}
    if (keep) ONE_BITE[FIX] = keep; else delete ONE_BITE[FIX]; window.OB_LIVE = prev;
    A.overlay = null; A.play = null; A.res = null; A.st = KEEP.st || loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.view = 'hub'; render();
    /* every real lesson's read and proof activities, for the static check below */
    out.uses = [];
    Object.keys(ONE_BITE).forEach(id => { const b = ONE_BITE[id] || {}; ['do', 'your'].forEach(list => (b[list] || []).forEach((a, i) => { if (a && (a.type === 'read' || a.type === 'proof')) out.uses.push({ id, list, i, a }); })); });
    return out;
  }).catch(e => ({ bad: ['crashed: ' + String(e).slice(0, 300)], seen: {}, uses: [] }));
  const s = r.seen || {};
  r.bad.forEach(b => fails.push('read and proof kinds: ' + b));
  if (!r.bad.length) {
    if (!s.readShows || !s.proofShows) fails.push('the Reader must cover the whole screen, on top, when a lesson opens it (read ' + s.readShows + ', proof ' + s.proofShows + ')');
    if (!/Open the book/.test(s.readBtn)) fails.push('read: the button must say "Open the book" (got "' + s.readBtn + '")');
    if (s.earlyOver || !/end of the chapter/.test(s.early)) fails.push('read: closing the book early must say to read to the end, and not finish the activity (got "' + s.early + '")');
    if (!s.readOk || !s.readRes.ok || !s.readRes.first) fails.push('read: reading to the end must finish the activity, right (' + JSON.stringify(s.readRes) + ')');
    if (!/surprised/.test(s.proofQ)) fails.push('proof: the question must show before the book opens');
    if (!/look for|does not say/i.test(s.miss)) fails.push('proof: a wrong sentence must say what to look for (got "' + s.miss + '")');
    if (!s.proofOk || !s.proofRes.ok || s.proofRes.first) fails.push('proof: found on the second try must count as right, not first try (' + JSON.stringify(s.proofRes) + ')');
    if (s.after !== 'wiggle:' && s.after !== 'your:cloze') fails.push('the lesson must go on after the two Reader activities (got ' + s.after + ')');
    if (s.wide) fails.push('read and proof kinds: the page scrolls sideways');
  }
  /* the static check of real lessons */
  const T = require(path.join(__dirname, '..', '..', 'tools', 'core', 'texts.js')).load(), byId = {}; T.out.forEach(t => { byId[t.id] = t; });
  (r.uses || []).forEach(u => { const at = u.id + ' ' + u.list + ' ' + (u.i + 1) + ' (' + u.a.type + '): ', t = byId[u.a.text];
    if (!t) return fails.push(at + 'text ' + u.a.text + ' is not in texts/');
    if (u.a.type === 'read' && u.list !== 'do') fails.push(at + 'read goes in "do" (in "your" it would count as a free right answer)');
    if (u.a.type === 'read' && u.a.page != null && !(u.a.page < t.pages.length)) fails.push(at + 'page ' + u.a.page + ' is past the end of ' + t.id);
    if (u.a.type === 'proof') { const sents = []; t.pages.forEach(pg2 => pg2.forEach(par => (par.s || []).forEach(x => sents.push(x))));
      const pr = u.a.proof, hits = Array.isArray(pr) ? pr.filter(i => i >= 0 && i < sents.length).length : sents.filter(x => x.toLowerCase().indexOf(String(pr).toLowerCase()) >= 0).length;
      if (Array.isArray(pr) ? hits !== pr.length : hits !== 1) fails.push(at + 'the proof "' + pr + '" must be in exactly one sentence of ' + t.id + ' (found ' + hits + ')'); } });
  if (!fails.length) oks.push('read and proof kinds: a lesson opens the Reader from its data alone ("read" to the end, "find the proof" with one wrong tap), the lesson goes on; unit checks and K-1 games refuse them; ' + (r.uses || []).length + ' real use(s) point at real texts and one sentence each');
  return { fails, oks };
};
