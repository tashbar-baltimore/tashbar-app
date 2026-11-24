/* Core Growth (job T, T-6): the new activity kinds (src/CoreKitActs.html) inside the REAL One Bite player, played by tap only, as a TEST- boy.
   Each kind: a made-up lesson whose do/your use it; one wrong tap where the kind has a wrong answer (the miss must name what to look for, never
   just "wrong"), then the right taps; Check where the kind has one; the lesson plays on to "mastered". Also: every kind's err() refuses bad data,
   every kind joined OBK.types, and the screens fit at 390 px (no sideways scroll, every tap target 44 px or more). */
module.exports = async function (pg, shots) {
  const fails = [], oks = [];
  const r = await pg.evaluate(async () => {
    const out = { bad: [], kinds: {}, shots: [] }, sleep = ms => new Promise(x => setTimeout(x, ms));
    for (let i = 0; i < 100 && !(window.TLCORE && TLCORE.actsJoined); i++) await sleep(50);
    const KINDS = ['evidence', 'combine', 'storymap', 'parts', 'cloze', 'dictation', 'order'];
    KINDS.forEach(k => { if (!OBK.types[k]) out.bad.push(k + ' did not join the Activity Kit'); });
    /* bad data is refused */
    const badData = { evidence: { type: 'evidence', p: ['One.'], a: 0, q: 'x' }, combine: { type: 'combine', a: 'A.', b: 'B.', o: ['and', 'but'], j: 'so' }, storymap: { type: 'storymap', slots: ['Who'], cards: ['x'] },
      parts: { type: 'parts', parts: ['un', 'kind'] }, cloze: { type: 'cloze', t: 'No gap here.', o: ['a', 'b'], a: 'a' }, dictation: { type: 'dictation', hear: 'The cat sat.', w: ['The', 'dog', 'sat.'] }, order: { type: 'order', steps: ['only one'] } };
    KINDS.forEach(k => { if (!OBK.err(badData[k], 'B23')) out.bad.push(k + ': bad data was not refused'); });
    /* one fixture per kind: [activity, wrong tap (a, k) or null, right taps [[a,k],...]] */
    const F = {
      evidence: [{ type: 'evidence', q: 'Which sentence shows Dovid was surprised?', p: ['Dovid walked to shul.', 'Dovid gasped.', 'He sat down.'], a: 1, look: 'how Dovid felt' }, ['sent', 0], [['sent', 1]]],
      combine: [{ type: 'combine', a: 'Avi was tired.', b: 'He kept walking.', o: ['but', 'so', 'because'], j: 'but' }, ['join', 'so'], [['join', 'but']]],
      storymap: [{ type: 'storymap', slots: ['Who', 'Where', 'Problem'], cards: ['Dovid and Zaidy', 'the shul', 'The key is missing'] }, null, 'map'],
      parts: [{ type: 'parts', parts: ['un', 'help', 'ful'], extra: ['re'], mean: 'not helpful' }, null, 'seq'],
      cloze: [{ type: 'cloze', t: 'The ant carried a ___ twice its size.', o: ['crumb', 'cloud', 'song'], a: 'crumb' }, null, 'cloze'],
      dictation: [{ type: 'dictation', hear: 'The cat sat on the mat.', w: ['The', 'cat', 'sat', 'on', 'the', 'mat.'], extra: ['sit'] }, null, 'seq'],
      order: [{ type: 'order', steps: ['Dovid saw paw prints.', 'He followed them.', 'He found Biscuit.'] }, null, 'seq'] };
    const app = document.getElementById('app'), Q = s => app.querySelector(s), click = el => { if (!el || el.disabled) return false; el.click(); return true; };
    /* one tap toward solving the current screen of one of the new kinds */
    function step(d, s, wrongOnce) {
      if (s.over) return click(Q('.ob-foot [data-ob=knext]')) ? 'next' : 'no next';
      if (s.phase === 'why') { const j = d.why.o.indexOf(d.why.a); return click(Q('[data-obk=why][data-k="' + j + '"]')) ? 'why' : 'no why'; }
      const f = F[d.type]; if (!f) return 'unknown';
      if (wrongOnce && f[1] && !s.__w) { s.__w = 1; return click(Q('[data-obk="' + f[1][0] + '"][data-k="' + f[1][1] + '"]')) ? 'wrong' : 'no wrong target'; }
      const chk = () => click(Q('.ob-foot [data-obk=check]')) ? 'check' : 'no check';
      if (Array.isArray(f[2])) { const t = f[2].find(x => !Q('[data-obk="' + x[0] + '"][data-k="' + x[1] + '"][disabled]')) || f[2][0]; return click(Q('[data-obk="' + t[0] + '"][data-k="' + t[1] + '"]')) ? 'tap' : 'no target ' + t.join(); }
      if (f[2] === 'cloze') { if (OBK.ready(d, s)) return chk(); return click(Q('[data-obk=word][data-k="' + d.a + '"]')) ? 'word' : 'no word'; }
      if (f[2] === 'map') { if (OBK.ready(d, s)) return chk(); const i = s.at.indexOf(-1), want = d.cards[i]; if (s.sel < 0) { const j = s.pool.findIndex((x, jj) => x === want && !s.used[jj]); return click(Q('[data-obk=card][data-k="' + j + '"]')) ? 'card' : 'no card'; } return click(Q('[data-obk=box][data-k="' + i + '"]')) ? 'box' : 'no box'; }
      if (f[2] === 'seq') { if (OBK.ready(d, s)) return chk(); const list = d.parts || d.w || d.steps, i = s.slots.indexOf(-1), want = String(list[i]); const j = s.pool.findIndex((x, jj) => x === want && !s.used[jj]);
        const a = d.type === 'parts' ? 'part' : d.type === 'order' ? 'strip' : 'tile'; return click(Q('[data-obk=' + a + '][data-k="' + j + '"]')) ? a : 'no ' + a; }
      return 'no plan'; }
    const worldOf = id => { const pre = id.split('.')[0]; return WORLD[pre] ? pre : WORLD.READ ? 'READ' : Object.keys(WORLD)[0]; };
    const fresh = () => { A.overlay = null; A.play = null; A.res = null; SRV.token = 't'; SRV.states = {}; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.view = 'hub'; render(); };
    const FIX = Object.keys(BANK_ALL).find(x => /^READ\.COMP\.L04\./.test(x)) || Object.keys(BANK_ALL).find(x => /^READ\./.test(x));
    const keep = ONE_BITE[FIX], prev = window.OB_LIVE; window.OB_LIVE = 'test';
    const base = { band: 'B23', pic: '📖', today: 'Kit test lesson', why: 'Testing the new activities.', watch: { q: 'Watch', steps: ['One.', 'Two.'] }, oops: { wrong: '1', right: '2', why: 'x' }, ways: ['a', 'b'] };
    const plans = [ { do: ['evidence', 'combine'], your: ['storymap', 'parts', 'cloze', 'dictation', 'order'], wrongAt: { do0: 1, do1: 1 } },
                    { do: ['order', 'cloze'], your: ['combine', 'evidence', 'dictation', 'parts', 'storymap'], wrongAt: { your0: 1, your1: 1 } } ];
    for (const plan of plans) {
      ONE_BITE[FIX] = Object.assign({}, base, { do: plan.do.map(k => Object.assign({}, F[k][0])), your: plan.your.map(k => Object.assign({}, F[k][0])) });
      fresh(); await sleep(15); startMission(worldOf(FIX), FIX, 'skill'); await sleep(20);
      const p = A.play; if (!p || !p.ob) { out.bad.push('the made-up lesson did not open as a One Bite lesson'); break; }
      let n = 0, lastKey = '', err = '';
      while (A.view === 'play' && A.play === p && n++ < 400) {
        const st = p.ob.stage;
        if (st === 'do' || st === 'your') { const k = p.ob.kit, d = k.acts[k.i], key = st + k.i;
          if (key !== lastKey) { lastKey = key; out.kinds[d.type] = (out.kinds[d.type] || 0) + 1; await sleep(20);
            if (document.documentElement.scrollWidth > innerWidth + 1) { err = d.type + ': scrolls sideways at ' + innerWidth + ' px'; break; }
            const small = [...app.querySelectorAll('.obk [data-obk]')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && Math.min(r.width, r.height) < 44; });
            if (small.length) { err = d.type + ': a tap target is smaller than 44 px (' + small[0].className + ')'; break; }
            if (window.__ckaShotsOn && !(window.__ckaShot || {})[d.type]) { (window.__ckaShot = window.__ckaShot || {})[d.type] = 1; out.shots.push(d.type); window.__ckaWait = d.type; for (let w = 0; w < 100 && window.__ckaWait; w++) await sleep(30); } }
          const wrong = !!plan.wrongAt[st + k.i] && !k.s.__w; const before = k.s.misses;
          const a = step(d, k.s, wrong);
          if (/^no |unknown/.test(a)) { err = st + ' ' + (k.i + 1) + ' (' + d.type + '): ' + a; break; }
          if (a === 'wrong') { await sleep(10); const msg = (Q('.ob-soft') || {}).textContent || k.s.msg || ''; if (!/look|read|does it make sense|try/i.test(msg)) err = d.type + ': a miss must say what to do next (got "' + msg + '")'; if (err) break; }
          await sleep(3); continue; }
        if (st !== 'q') { const opt2 = Q('[data-ob=rpick]:not([disabled])'); if (opt2) { const q = p.ob.bite.ready[p.ob.ri]; click(Q('[data-ob=rpick][data-k="' + q.o.indexOf(q.a) + '"]')); await sleep(3); continue; }
          if (!click(Q('.ob-foot .ob-go'))) { err = st + ': no forward button'; break; } await sleep(3); continue; }
        const it = p.items[p.i]; p.shownAt = 0; p.cool = 0; if (it.t === 'write') p.text = new Array((it.min || 5) + 2).join('word ');
        answer(it.t === 'num' ? String(it.a) : it.t === 'write' ? p.text : it.correct); await sleep(2); next(); await sleep(2); }
      if (!err && !(A.st.skills[FIX] && A.st.skills[FIX].m)) err = 'the lesson did not reach "mastered" (stage ' + (A.play && A.play.ob && A.play.ob.stage) + ')';
      if (err) out.bad.push('plan ' + (plans.indexOf(plan) + 1) + ': ' + err);
    }
    if (keep) ONE_BITE[FIX] = keep; else delete ONE_BITE[FIX]; window.OB_LIVE = prev; fresh();
    return out;
  }).catch(e => ({ bad: ['crashed: ' + String(e).slice(0, 300)], kinds: {}, shots: [] }));
  r.bad.forEach(b => fails.push('new activity kinds: ' + b));
  const missing = ['evidence', 'combine', 'storymap', 'parts', 'cloze', 'dictation', 'order'].filter(k => !r.kinds[k]);
  if (missing.length) fails.push('new activity kinds: never played: ' + missing.join(', '));
  if (!fails.length) oks.push('new activity kinds: evidence, combine, story map, word parts, fill the gap, dictation and story order play by tap inside the real lesson player to "mastered"; misses say what to do; bad data refused');
  return { fails, oks };
};
