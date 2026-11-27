/* THE NEW SHELL, workstream D (src/ShCity.html, docs/SHELL-CONTRACT.md): the Golden City games, on the boy page, with made-up server answers.
   - K-1 (grade 1) sees none of these places; a grade 5 boy whose work is not done sees "Opens when your work is done" (Arena, Pavilion) and no server call is made.
   - THE ARENA: home (arMyStats, arCfList; Arena points, never money), a live duel (arOpen with his topic's questions, arPoll, 3-2-1, arPower, arCheer,
     arAnswer, the answer saved as evidence 'arena'), Lightning (mode 'lightning'), Makshan, the end (arShake, arTeach, rematch = a new arOpen, and
     "Practice what I missed" opens the lesson through SHK.openLesson), joining with a code (arJoin), the Class Chidon (chJoin, chQs, chPoll, chAnswer),
     challenges (arCfMake, arCfAns, arCfDone, arCfGet from the list and by code), the Shtender duel (no server call), the avatar, the Siyum chart.
   - THE PAVILION: Mistake Detective played to the end (best score on this Chromebook; a missed case's lesson opens through SHK.openLesson), the Daily Mix,
     Kodesh Quest (all lands and Kodesh lands only).
   - THE WORKSHOP: the Block Builders tile (door blockbuilders) only for TEST- boys and Math levels 2-4; the Chumash Lab tile (door chumashlab) only for
     grade 3 and up and TEST- boys; each opens its workbook.
   Every screen: only kit buttons, one house top left (and the round Back only on an inner screen), at most one main button. Restores the page afterwards. */
module.exports.page = async function (pg, map) {
  const fails = [], oks = [];
  const o = await pg.evaluate(async (KM) => {
    const sleep = ms => new Promise(r => setTimeout(r, ms)), o = { bad: [] }, K = window.SHK;
    if (!K || !window.SHC) { o.missing = true; return o; }
    const keep = { st: A.st, view: A.view, play: A.play, tok: SRV.token, map: window.TL_MAP, av: (() => { try { return localStorage.getItem('arAv'); } catch (e) { return null; } })(), ev: SRV.pendingEv ? SRV.pendingEv.slice() : null, rvDue: window.TLREVIEW && TLREVIEW.due, rvMix: window.TLREVIEW && TLREVIEW.startMix, ol: K.openLesson };
    const bad = m => o.bad.push(m), log = [];
    const READ = Object.keys(BANK_ALL).filter(id => /^READ\./.test(id) && BANK_ALL[id].name);
    const qs = n => Array.from({ length: n }, (_, i) => ({ q: 'Made-up question ' + (i + 1), o: ['right ' + i, 'wrong ' + i, 'other ' + i], pic: '', a: 0, id: READ[i % READ.length] }));
    let POLL = { state: 'wait' }, CH = null;
    const F = {
      arMyStats: () => ({ pts: 42, wins: 7, played: 15, taught: 3, shakes: 2, lwins: 1, on: true, subj: {}, pars: ['Bereishis'], quests: [['⚔️', 'Play 3 showdowns', 2, 3]] }),
      arCfList: () => ({ open: [{ code: '54321', byName: 'Made-up Dovid', label: 'Made-up topic' }], mine: [{ code: '12345', label: 'Made-up topic', score: 8, n: 10, by: [{ name: 'Made-up Eli', sc: 9, beat: true }] }] }),
      arOpen: (t, p) => ({ code: '4821', label: p.label, n: p.qs.length, me: { name: 'Made-up Boy', done: 0, score: 0 }, state: 'wait', qs: p.qs, mode: p.mode, host: true, now: Date.now() }),
      arJoin: (t, code, av) => ({ code, label: 'Made-up topic', n: 3, me: { name: 'Made-up Boy', done: 0, score: 0, av }, them: { name: 'Made-up Chaim', done: 0, score: 0 }, state: 'go', start: Date.now() + 60000, now: Date.now(), qs: qs(3), mode: 'classic' }),
      arPoll: () => POLL,
      arAnswer: (t, code, i, c) => ({ ok: c === 0, right: 0, view: { me: { name: 'Made-up Boy', done: i + 1, score: c === 0 ? 1 : 0, pu: { split: 1 } }, them: { name: 'Made-up Chaim', done: i, score: 0 } } }),
      arPower: (t, code, k, i) => ({ ok: true, view: { me: { name: 'Made-up Boy', done: i, score: 0, pu: { [k]: 1, hide: { [i]: [1] } } } } }),
      arCheer: () => ({ ok: true }), arTeach: () => ({ ok: true }), arShake: () => ({ ok: true, done: false, view: { shake: { me: true } } }),
      arCfMake: (t, p) => ({ code: '67890', qs: p.qs, label: p.label }),
      arCfGet: (t, code) => ({ code, qs: qs(3), label: 'Made-up topic', byName: 'Made-up Dovid', ghost: [500, null, null] }),
      arCfAns: (t, code, i, k) => ({ ok: k === 0, right: 0 }), arCfDone: () => ({ winner: 'me', score: 3, theirs: 1, byName: 'Made-up Dovid', review: [] }),
      chJoin: (t, code) => ({ code, state: 'lobby', label: 'Made-up Chidon', count: 20, need: { topic: READ[0] }, me: { teamName: 'Yehuda', color: '#2D9CDB', right: 0 } }),
      chQs: (t, code, q) => ({ code, state: 'lobby', label: 'Made-up Chidon', count: 20, me: { teamName: 'Yehuda', color: '#2D9CDB' } }),
      chPoll: () => CH || { code: '1111', state: 'lobby', label: 'Made-up Chidon', count: 20, me: { teamName: 'Yehuda', color: '#2D9CDB' } },
      chAnswer: (t, code, i, c) => ({ code, state: 'q', i, n: 10, q: { q: 'Made-up class question', o: ['one', 'two', 'three'] }, qStart: Date.now(), qSec: 20, now: Date.now(), label: 'Made-up Chidon', count: 20, me: { teamName: 'Yehuda', color: '#2D9CDB', mine: { c } } })
    };
    const G = window.google.script.run, D0 = Object.getOwnPropertyDescriptor(window.google.script, 'run');
    const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
      if (F[k]) return (...a) => { log.push([k].concat(a.slice(1))); setTimeout(() => { try { okf && okf(F[k](...a)); } catch (e) { nof && nof(e); } }, 10); };
      let b = G; if (okf) b = b.withSuccessHandler(okf); if (nof) b = b.withFailureHandler(nof); return (...a) => b[k](...a); } });
    Object.defineProperty(window.google.script, 'run', { configurable: true, get: () => chain(null, null) });
    const lessons = []; K.openLesson = id => { lessons.push(id); return keep.ol(id); };
    const boy = (id, grade, math, done) => { const M = JSON.parse(JSON.stringify(KM)); M.sid = id; M.grade = grade; if (M.subjects && M.subjects.MATH) M.subjects.MATH.level = math; window.TL_MAP = M;
      A.st = loadStudent({ id, name: 'Made-up Boy' }); A.st.skills = A.st.skills || {}; if (done) READ.slice(0, 3).forEach(r => { A.st.skills[r] = { m: 1, at: Date.now() }; }); A.view = 'hub'; A.play = null; };
    const pageOf = id => document.getElementById('shk-' + id);
    const click = (id, sel) => { const b = pageOf(id) && pageOf(id).querySelector(sel); if (!b) { bad('no button ' + sel + ' on ' + id + ' (screen ' + (window.SHC.arena.v) + ')'); return false; } b.click(); return true; };
    const calls = k => log.filter(x => x[0] === k);
    const until = async (f, ms) => { for (let t = 0; t < (ms || 3000); t += 50) { if (f()) return true; await sleep(50); } return false; };
    const screen = (id, tag, back) => { const p = pageOf(id); if (!p) { bad(tag + ': page ' + id + ' not open'); return; }
      const nk = [...p.querySelectorAll('button')].filter(b => !b.classList.contains('tlk')); if (nk.length) bad(tag + ': ' + nk.length + ' buttons not from the kit');
      const h = p.querySelectorAll('.tlk-home'), r = h[0] && h[0].getBoundingClientRect(); if (h.length !== 1 || !(r.left < 220 && r.top < 90)) bad(tag + ': needs one house top left');
      const bk = p.querySelectorAll('.tlk-back').length; if (back !== undefined && bk !== (back ? 1 : 0)) bad(tag + ': round Back should ' + (back ? '' : 'not ') + 'show (got ' + bk + ')');
      if (p.querySelectorAll('.tlk-main').length > 1) bad(tag + ': more than one main button'); if (p.querySelectorAll('.tlk-x').length) bad(tag + ': a full page has no x');
      if (/\$\s?\d|T\$/.test(p.querySelector('.shk-body').textContent)) bad(tag + ': shows money'); o.screens = (o.screens || 0) + 1; };
    const go = async id => { K.closeAll(); K.go(id); await sleep(80); };
    try {
      SRV.token = SRV.token || 't'; SRV.pendingEv = SRV.pendingEv || [];
      /* K-1: nothing */
      boy('MADEUP-SC1', 1, 3, true); await go('arena'); await go('games'); await go('workshop');
      o.k1 = !pageOf('arena') && !pageOf('games') && !pageOf('workshop') && !K.places('c').some(d => ['arena', 'games', 'workshop'].indexOf(d.id) >= 0);
      /* grade 5, work not done: locked, and the server is not asked */
      boy('MADEUP-SC5', 5, 3, false);
      const t = document.createElement('div'); t.innerHTML = K.tile('arena') + K.tile('games') + K.tile('workshop'); const tl = [...t.children];
      o.tiles = tl.length === 3 && tl[0].getAttribute('data-shdoor') === 'arena' && tl[1].getAttribute('data-shdoor') === 'games' && !tl[2].hasAttribute('data-shdoor') && tl.every(b => b.classList.contains('tlk-tile'))
        && /Opens when your work is done/.test(tl[0].textContent) && /Opens when your work is done/.test(tl[1].textContent);
      await go('arena'); screen('arena', 'arena locked', false); o.locked = /Opens when your work is done/.test((pageOf('arena') || {}).textContent || '') && !calls('arMyStats').length && !!(pageOf('arena') && pageOf('arena').querySelector('.tlk-main[data-cy="towork"]'));
      await go('games'); screen('games', 'pavilion locked', false); o.gLocked = /Opens when your work is done/.test((pageOf('games') || {}).textContent || '') && !pageOf('games').querySelector('[data-cy="md"],[data-cy="kq"]');
      /* work done: the Arena */
      boy('MADEUP-SC5', 5, 3, true); await go('arena');
      await until(() => calls('arMyStats').length && calls('arCfList').length && /42 Arena points/.test(pageOf('arena').textContent));
      screen('arena', 'arena home', false); o.home = /42 Arena points/.test(pageOf('arena').textContent) && /Talmid|Chaver|Bar Plugta/.test(pageOf('arena').textContent) && calls('arMyStats')[0].length === 1;
      click('arena', '[data-cy="av"]'); await sleep(30); o.av = localStorage.getItem('arAv') === window.SHC.arena.av && window.SHC.arena.av !== (keep.av || '🦁');
      if (window.tlChm) { click('arena', '[data-cy="syopen"]'); await sleep(30); o.siyum = /Sefer Bereishis/.test(pageOf('arena').textContent); }
      /* a live duel */
      click('arena', '[data-cy="new"]'); await sleep(40); screen('arena', 'arena subjects', true); o.par = !window.tlChm || !!pageOf('arena').querySelector('[data-cy="subj"][data-k="PAR"]');
      click('arena', '[data-cy="subj"][data-k="READ"]'); await sleep(40); screen('arena', 'arena topics', true);
      const inp = pageOf('arena').querySelector('.cy-srch'); if (inp) { inp.value = 'zzzzqqq'; inp.dispatchEvent(new Event('input', { bubbles: true })); o.search = /No topics match/.test(pageOf('arena').textContent); inp.value = ''; inp.dispatchEvent(new Event('input', { bubbles: true })); }
      click('arena', '[data-cy="topic"]'); await until(() => window.SHC.arena.v === 'wait');
      const op = calls('arOpen')[0]; o.open = !!(op && op[1] && op[1].subject === 'READ' && Array.isArray(op[1].qs) && op[1].qs.length >= 5 && op[1].mode === 'classic' && op[1].av && op[1].qs.every(q => q.o && q.o.length >= 2 && q.a >= 0));
      screen('arena', 'arena wait', true); o.code = /4821/.test(pageOf('arena').textContent.replace(/\s/g, ''));
      click('arena', '[data-cy="home"]'); await sleep(40);
      click('arena', '[data-cy="new"]'); click('arena', '[data-cy="subj"][data-k="READ"]'); await sleep(30); click('arena', '[data-cy="lt"]'); click('arena', '[data-cy="mk"]'); await sleep(30); click('arena', '[data-cy="topic"]');
      await until(() => calls('arOpen').length === 2 && window.SHC.arena.v === 'wait'); const op2 = calls('arOpen')[1];
      o.lightning = !!(op2 && op2[1].mode === 'lightning' && /^⚡/.test(op2[1].label) && /Makshan/.test(op2[1].label) && op2[1].qs.every(q => /^Agree|^Kasha/.test(q.o[0]) || !/🗣️/.test(q.q)));
      POLL = { state: 'go', start: Date.now() + 1000, now: Date.now(), them: { name: 'Made-up Chaim', done: 0, score: 0 } };
      await until(() => window.SHC.arena.v === 'count', 3000); screen('arena', 'arena 3-2-1', false);
      await until(() => window.SHC.arena.v === 'play', 4000); screen('arena', 'arena duel', false); o.fuse = !!pageOf('arena').querySelector('#cy-fuse');
      o.cheerTools = pageOf('arena').querySelectorAll('.tlk-tool[data-cy="cheer"]').length === 6;
      click('arena', '[data-cy="pw"][data-k="split"]'); await until(() => calls('arPower').length); const pw = calls('arPower')[0]; o.power = !!(pw && pw[1] === '4821' && pw[2] === 'split' && pw[3] === 0);
      click('arena', '[data-cy="cheer"][data-k="yasher"]'); await until(() => calls('arCheer').length); o.cheer = JSON.stringify(calls('arCheer')[0]) === JSON.stringify(['arCheer', '4821', 'yasher']);
      const n0 = SRV.pendingEv.length; await sleep(60); click('arena', '.cy-op[data-cy="ans"]'); await until(() => calls('arAnswer').length); await sleep(60);
      const an = calls('arAnswer')[0]; o.answer = !!(an && an[1] === '4821' && an[2] === 0 && typeof an[3] === 'number'); o.ev = SRV.pendingEv.length > n0 && SRV.pendingEv[SRV.pendingEv.length - 1].phase === 'arena';
      o.answered = !!pageOf('arena').querySelector('.cy-ops.cy-done');
      const R = window.SHC.arena; POLL = { state: 'done', res: { winner: 'MADEUP-OTHER', hs: 2, gs: 5 }, review: R.m.qs.map(q => ({ q: q.q, o: q.o, a: q.a, me: (q.a + 1) % q.o.length, them: q.a, pic: '' })), shake: {} };
      await until(() => R.v === 'done' && R.reveal === 2, 6000); screen('arena', 'arena end', true);
      click('arena', '[data-cy="shake"]'); await until(() => calls('arShake').length && !R.busy); o.shake = !!calls('arShake').length && calls('arShake')[0][1] === '4821';
      click('arena', '[data-cy="taught"]'); await until(() => calls('arTeach').length && !R.busy); o.taught = !!calls('arTeach').length && calls('arTeach')[0][1] === '4821';
      click('arena', '[data-cy="rematch"]'); await until(() => calls('arOpen').length === 3 && R.v === 'wait' && R.m); o.rematch = calls('arOpen').length === 3;
      POLL = { state: 'done', res: { winner: 'MADEUP-OTHER', hs: 2, gs: 5 }, review: R.m.qs.map(q => ({ q: q.q, o: q.o, a: q.a, me: (q.a + 1) % q.o.length, them: q.a })), shake: {} };
      R.v = 'play'; R.i = R.m.n - 1; await until(() => R.v === 'done' && R.reveal === 2, 6000);
      const pr = pageOf('arena') && pageOf('arena').querySelector('[data-cy="lesson"]'); const pid = pr && pr.getAttribute('data-id');
      if (pr) { pr.click(); await sleep(1200); } o.lesson = !!pid && lessons[0] === pid && !pageOf('arena') && (typeof window.GM_PLAY !== 'function' || (A.view === 'play' && A.play && A.play.id === pid));
      A.view = 'hub'; A.play = null; A.overlay = null;
      /* join with a code */
      await go('arena'); await until(() => pageOf('arena') && window.SHC.arena.v === 'home'); POLL = { state: 'wait' };
      click('arena', '[data-cy="join"]'); await sleep(30); screen('arena', 'arena join', true); ['1', '2', '3', '4'].forEach(k => click('arena', `[data-cy="key"][data-k="${k}"]`));
      await until(() => calls('arJoin').length, 2000); const jn = calls('arJoin')[0]; o.join = !!(jn && jn[1] === '1234' && jn[2] === window.SHC.arena.av);
      /* the Class Chidon */
      await go('arena'); click('arena', '[data-cy="cjoin"]'); ['1', '1', '1', '1'].forEach(k => click('arena', `[data-cy="key"][data-k="${k}"]`)); await until(() => calls('chJoin').length, 2000);
      await until(() => calls('chQs').length, 2000); o.chJoin = calls('chJoin')[0] && calls('chJoin')[0][1] === '1111'; o.chQs = !!calls('chQs')[0] && Array.isArray(calls('chQs')[0][2]) && calls('chQs')[0][2].length >= 5;
      screen('arena', 'arena chidon', true);
      CH = { code: '1111', state: 'q', i: 0, n: 10, q: { q: 'Made-up class question', o: ['one', 'two', 'three'] }, qStart: Date.now(), qSec: 20, now: Date.now(), label: 'Made-up Chidon', count: 20, me: { teamName: 'Yehuda', color: '#2D9CDB' } };
      await until(() => calls('chPoll').length && pageOf('arena').querySelector('[data-cy="cans"]'), 3500); click('arena', '[data-cy="cans"]'); await until(() => calls('chAnswer').length);
      o.chAnswer = !!calls('chAnswer')[0] && calls('chAnswer')[0][1] === '1111' && calls('chAnswer')[0][2] === 0; CH = null;
      /* challenges */
      await go('arena'); click('arena', '[data-cy="cfnew"]'); click('arena', '[data-cy="subj"][data-k="READ"]'); await sleep(30); click('arena', '[data-cy="topic"]');
      await until(() => calls('arCfMake').length && window.SHC.arena.v === 'cf'); const mk = calls('arCfMake')[0]; o.cfMake = !!(mk && mk[1].subject === 'READ' && mk[1].qs.length >= 5);
      screen('arena', 'arena challenge', true); window.SHC.arena.cf.i = window.SHC.arena.cf.qs.length - 1; click('arena', '.cy-op[data-cy="cfans"]');
      await until(() => calls('arCfDone').length && window.SHC.arena.v === 'cfdone', 4000); o.cfAns = calls('arCfAns').length === 1 && calls('arCfAns')[0][1] === '67890'; o.cfDone = calls('arCfDone')[0] && calls('arCfDone')[0][1] === '67890';
      screen('arena', 'arena challenge ready', true);
      await go('arena'); await until(() => pageOf('arena') && pageOf('arena').querySelector('[data-cy="cftake"]')); click('arena', '[data-cy="cftake"]'); await until(() => calls('arCfGet').length);
      o.cfGet = calls('arCfGet')[0] && calls('arCfGet')[0][1] === '54321';
      await go('arena'); click('arena', '[data-cy="cfjoin"]'); ['9', '8', '7', '6', '5'].forEach(k => click('arena', `[data-cy="key"][data-k="${k}"]`)); await until(() => calls('arCfGet').length === 2, 2000);
      o.cfCode = calls('arCfGet')[1] && calls('arCfGet')[1][1] === '98765';
      /* the Shtender duel: one Chromebook, no server call */
      await go('arena'); const before = log.length; click('arena', '[data-cy="ppnew"]'); await sleep(20); screen('arena', 'shtender names', true);
      document.getElementById('cy-p2').value = 'Made-up Yossi'; click('arena', '[data-cy="ppgo"]'); click('arena', '[data-cy="subj"][data-k="READ"]'); await sleep(30); click('arena', '[data-cy="topic"]'); await sleep(30);
      const PP = window.SHC.arena.pp; o.pp1 = PP && PP.step === 'play' && PP.n[1] === 'Made-up Yossi'; PP.i = PP.qs.length - 1; click('arena', '.cy-op[data-cy="ppans"]'); await until(() => PP.step === 'pass', 2500);
      screen('arena', 'shtender pass', true); click('arena', '[data-cy="ppnext"]'); await sleep(20); PP.i = PP.qs.length - 1; click('arena', '.cy-op[data-cy="ppans"]'); await until(() => PP.step === 'done', 2500);
      o.pp = PP.step === 'done' && log.slice(before).every(x => /^ar(MyStats|CfList)$/.test(x[0]));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); await sleep(80); K.closeAll();
      /* the Pavilion */
      await go('games'); screen('games', 'pavilion', false); const gp = pageOf('games');
      o.gTiles = !!gp.querySelector('.tlk-tile[data-cy="md"]') === !!window.TL_MD && !!gp.querySelector('.tlk-tile[data-cy="kq"]') === (typeof window.tlKinderKriyah === 'function');
      if (window.TL_MD) { click('games', '[data-cy="md"]'); await sleep(30); screen('games', 'detective intro', true);
        const list = window.SHC.md.md.list; o.mdList = !!list && list.length >= 3;
        if (list) { const bk = 'tl_md_best_MADEUP-SC5'; localStorage.removeItem(bk); click('games', '[data-cy="mdgo"]'); await sleep(20); screen('games', 'detective case', true);
          for (let i = 0; i < list.length; i++) {
            const c = list[i]; click('games', `[data-cy="s1"][data-v="${c.trap ? 0 : 1}"]`); await sleep(10);
            if (!c.trap) { const w = c.fix.findIndex(x => x.trim().toLowerCase() !== c.right.trim().toLowerCase()); click('games', `[data-cy="s2"][data-i="${w}"]`); await sleep(10); }
            click('games', `[data-cy="s3"][data-i="${c.whys.indexOf(c.why)}"]`); await sleep(10); if (i === 0) screen('games', 'detective solved', true); click('games', '[data-cy="mdnext"]'); await sleep(10); }
          screen('games', 'detective rank', true); o.mdEnd = /Detective|Inspector/.test(pageOf('games').textContent) && Number(localStorage.getItem(bk)) === window.SHC.md.md.pts && window.SHC.md.md.pts > 0;
          const pl = pageOf('games').querySelector('[data-cy="lesson"]'); const lid = pl && pl.getAttribute('data-id'); localStorage.removeItem(bk);
          if (pl) { pl.click(); await sleep(1200); } o.mdLesson = !pl || (lessons[lessons.length - 1] === lid && !pageOf('games') && (typeof window.GM_PLAY !== 'function' || A.view === 'play')); A.view = 'hub'; A.play = null; A.overlay = null; } }
      if (window.TLREVIEW) { let mixed = 0; TLREVIEW.due = () => [READ[0]]; TLREVIEW.startMix = () => { mixed++; }; await go('games'); click('games', '.tlk-tile[data-cy="mix"]'); await sleep(30); o.mix = mixed === 1 && !pageOf('games'); }
      if (typeof window.tlKinderKriyah === 'function') { await go('games'); click('games', '[data-cy="kq"]'); await sleep(60); const kq = document.getElementById('kkov'); o.kq = !!kq && !pageOf('games'); if (kq) kq.remove();
        await go('games'); click('games', '[data-cy="kqk"]'); await sleep(60); const kq2 = document.getElementById('kkov'); o.kqk = !!kq2 && /"kodesh":true/.test(kq2.querySelector('iframe').srcdoc || ''); if (kq2) kq2.remove(); }
      /* the Workshop and its two doors */
      const ws = async (id, g, m) => { boy(id, g, m, true); K.closeAll(); const shown = K.places('c').some(d => d.id === 'workshop'); K.go('workshop'); await sleep(60); const p = pageOf('workshop');
        const r = { shown, bb: !!(p && p.querySelector('.tlk-tile[data-cy="bb"][data-shdoor="blockbuilders"]')), cl: !!(p && p.querySelector('.tlk-tile[data-cy="clab"][data-shdoor="chumashlab"]')) }; if (p) screen('workshop', 'workshop', false); return r; };
      o.w5m3 = await ws('MADEUP-W1', 5, 3); o.w5m6 = await ws('MADEUP-W2', 5, 6); o.wTest = await ws('TEST-W3', 2, 6); o.w2m6 = await ws('MADEUP-W4', 2, 6);
      await ws('MADEUP-W1', 5, 3); click('workshop', '[data-cy="bb"]'); await sleep(80); o.bbOpen = !!window.BBX && BBX.open === true && !pageOf('workshop'); try { BBX.close(); } catch (e) {}
      await ws('MADEUP-W1', 5, 3); click('workshop', '[data-cy="clab"]'); await sleep(80); o.clOpen = !!document.getElementById('clab') && !pageOf('workshop'); try { CLAB.close(); } catch (e) {}
      o.calls = [...new Set(log.map(x => x[0]))].sort();
    } catch (e) { o.err = String(e && e.stack || e).slice(0, 400); }
    K.closeAll(); K.openLesson = keep.ol; if (window.TLREVIEW && keep.rvDue) { TLREVIEW.due = keep.rvDue; TLREVIEW.startMix = keep.rvMix; }
    try { if (keep.av == null) localStorage.removeItem('arAv'); else localStorage.setItem('arAv', keep.av); } catch (e) {}
    if (D0) Object.defineProperty(window.google.script, 'run', D0); else window.google.script.run = G;
    if (keep.ev) SRV.pendingEv = keep.ev; window.TL_MAP = keep.map; A.st = keep.st; A.view = 'hub'; A.play = null; A.overlay = null; SRV.token = keep.tok; render();
    await sleep(2800); document.querySelectorAll('.shk-fly,#kkov,#bbx,#clab').forEach(x => x.remove()); o.left = K.open.length;
    return o;
  }, map);
  if (process.env.CYDEBUG) console.log(JSON.stringify(o));
  const chk = (c, m) => { if (!c) fails.push('new shell D (city games): ' + m); };
  if (o.missing) { fails.push('new shell D (city games): window.SHK or window.SHC is missing (src/ShCity.html did not load)'); return { fails, oks }; }
  if (o.err) fails.push('new shell D (city games) crashed: ' + o.err);
  o.bad.forEach(b => fails.push('new shell D (city games): ' + b));
  chk(o.k1, 'a Grade 1 boy must see none of the city games');
  chk(o.tiles, 'the tiles are the kit\'s, the Arena and the Pavilion carry their doors (arena, games) and say "Opens when your work is done" until his work is done');
  chk(o.locked && o.gLocked, 'before his work is done the Arena and the Pavilion show "Opens when your work is done" with "Go to my work", and the server is not asked');
  chk(o.home, 'the Arena home asks arMyStats and shows his Arena points and title (got ' + JSON.stringify(o) .slice(0, 300) + ')');
  chk(o.av, 'picking an avatar keeps it on this Chromebook');
  chk(o.siyum !== false, 'the Parsha Siyum chart opens');
  chk(o.par && o.search, 'the subjects include Parsha; the topic search filters');
  chk(o.open && o.code, 'Start a showdown sends arOpen with his subject and its questions, and shows the code');
  chk(o.lightning, 'Lightning and Makshan reach arOpen (mode lightning, Makshan questions)');
  chk(o.fuse && o.cheerTools, 'a Lightning duel shows the fuse; the six cheers are kit tools');
  chk(o.power && o.cheer, 'power-ups (arPower) and cheers (arCheer) go to the server with the code');
  chk(o.answer && o.ev && o.answered, 'an answer goes to arAnswer, is saved as evidence (arena), and the choices turn into information');
  chk(o.shake && o.taught && o.rematch, 'the end: Yasher koach (arShake), He taught me (arTeach), Rematch (a new arOpen)');
  chk(o.lesson, '"Practice what I missed" opens his lesson through SHK.openLesson (and the lesson really opens once GM_PLAY exists, issue 647)');
  chk(o.join, 'joining with a code sends arJoin with the 4 numbers and his avatar');
  chk(o.chJoin && o.chQs && o.chAnswer, 'the Class Chidon: chJoin, chQs (his page sends the questions), chPoll, chAnswer');
  chk(o.cfMake && o.cfAns && o.cfDone && o.cfGet && o.cfCode, 'challenges: arCfMake, arCfAns, arCfDone, arCfGet from the list and by a 5-number code');
  chk(o.pp1 && o.pp, 'the Shtender duel plays two boys on one Chromebook with no server call');
  chk(o.gTiles, 'the Pavilion shows Mistake Detective and Kodesh Quest');
  chk(o.mdList !== false && o.mdEnd !== false && o.mdLesson !== false, 'Mistake Detective plays 3 steps a case to a rank, keeps the best score on this Chromebook, and a missed case\'s lesson opens through SHK.openLesson');
  chk(o.mix !== false, 'the Daily Mix starts from the Pavilion');
  chk(o.kq !== false && o.kqk !== false, 'Kodesh Quest opens (all lands, and Kodesh lands only)');
  chk(o.w5m3 && o.w5m3.shown && o.w5m3.bb && o.w5m3.cl, 'a grade 5 boy at Math level 3 sees Block Builders (door blockbuilders) and the Chumash Lab (door chumashlab) (got ' + JSON.stringify(o.w5m3) + ')');
  chk(o.w5m6 && !o.w5m6.bb && o.w5m6.cl, 'Block Builders is not shown above Math level 4 (got ' + JSON.stringify(o.w5m6) + ')');
  chk(o.wTest && o.wTest.bb && o.wTest.cl, 'a TEST- boy sees both workbooks (got ' + JSON.stringify(o.wTest) + ')');
  chk(o.w2m6 && !o.w2m6.shown && !o.w2m6.bb && !o.w2m6.cl, 'a grade 2 boy above Math level 4 sees no Workshop (got ' + JSON.stringify(o.w2m6) + ')');
  chk(o.bbOpen && o.clOpen, 'the Block Builders and Chumash Lab tiles open their workbooks');
  chk(o.left === 0, 'no page is left open');
  if (!fails.length) oks.push('new shell D (city games): ' + (o.screens || 0) + ' screens with only kit buttons, one house top left, Back only inside, no money; locked until his work is done; K-1 sees nothing; Arena (' + (o.calls || []).length + ' server calls: ' + (o.calls || []).join(', ') + '), lesson through SHK.openLesson; Mistake Detective to a rank; Daily Mix; Kodesh Quest; Workshop doors (Block Builders Math 2-4 or TEST-, Chumash Lab grade 3+ or TEST-)');
  return { fails, oks };
};
