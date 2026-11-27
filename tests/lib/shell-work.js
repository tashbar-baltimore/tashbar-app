/* THE NEW SHELL, workstream C (src/ShWork.html, docs/SHELL-CONTRACT.md): My work and the Trail (his map), with made-up server answers.
   Guarantees for the new places what tests/run.js (map home block) and tests/lib/dailyplan.js guarantee for the old ones:
   - My work: DO THIS NOW first; no list = 3 rounds, one live; Today's list = one row per thing (core first, two Reading rows are two
     different steps), "TODAY'S LIST · 0 of 6 done", one Next, no minutes or timers, the Game Pavilion locked until the list is done and
     saying why; a mastered lesson shows done at once; the whole list done (the server says so) = "All done" and it opens;
     his rebbe's pick, a new shout-out opens big once and "Thank you" sends sgShoutSeen; Today's path for a TEST- boy; the school goal.
   - It asks the server itself (tdlToday, sgMyDesk, msSchoolGoal, pfdToday; kmMyMap after a mastered step), with his token.
   - The Trail: ONE Start that opens his goal through SHK.openLesson (the lesson really starts), the level check says "then: <next>",
     the real skill, stops with exactly one BOSS, a locked stop says Locked, Change subject (round Back) moves the map to Chumash,
     the skill tree (round Back), SHK.subjects() lists his subjects and level panels, Find my levels, a panel's lesson opens.
   - Only kit buttons, at most one main, one house top left on a page (K-3: the bigger Home), one x top right on a pop-up.
   - Grade 2 and up only: a Grade 1 boy gets no tiles. Made-up boys only. Restores the page afterwards. */
module.exports.page = async function (pg, map) {
  const fails = [], oks = [];
  const o = await pg.evaluate(async M0 => {
    const sleep = ms => new Promise(r => setTimeout(r, ms)), o = {}, K = window.SHK;
    if (!K || !window.SHW) { o.missing = true; return o; }
    const keep = { st: A.st, view: A.view, tok: SRV.token, map: window.TL_MAP, play: A.play, ov: A.overlay, ol: K.openLesson };
    const G = window.google.script.run, D0 = Object.getOwnPropertyDescriptor(window.google.script, 'run'), calls = [], ans = {};
    const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
      if (ans[k]) return (...a) => { calls.push([k].concat(a)); setTimeout(() => okf && okf(ans[k](...a)), 20); };
      let b = G; if (okf) b = b.withSuccessHandler(okf); if (nof) b = b.withFailureHandler(nof); return (...a) => { calls.push([k].concat(a)); return b[k](...a); }; } });
    Object.defineProperty(window.google.script, 'run', { configurable: true, get: () => chain(null, null) });
    const opened = []; K.openLesson = function (id) { opened.push(id); return keep.ol.apply(this, arguments); };
    const called = (k, ...a) => calls.some(c => c[0] === k && c[1] === 't' && a.every((x, i) => JSON.stringify(c[i + 2]) === JSON.stringify(x)));
    const onlyKit = el => [...el.querySelectorAll('button')].every(b => b.classList.contains('tlk'));
    const house = el => { const h = el.querySelectorAll('.tlk-home'), r = h[0] && h[0].getBoundingClientRect(); return h.length === 1 && !!(r && r.left < 220 && r.top < 90); };
    const skipFly = async () => { await sleep(30); const f = document.querySelector('.shk-fly'); if (f) f.click(); await sleep(420); };
    const open = async id => { K.closeAll(); K.go(id); await skipFly(); await sleep(150); return document.getElementById('shk-' + id); };
    const hub = async () => { K.closeAll(); A.view = 'hub'; A.play = null; A.overlay = null; render(); await sleep(60); };
    try {
      const M = JSON.parse(JSON.stringify(M0)); M.sid = 'TEST-SHWORK'; M.grade = 5; window.TL_MAP = M; SRV.token = 't';
      const nm = id => (M.names && M.names[id] ? M.names[id][0] : id), now = Date.now(), rid = M.subjects.READ.now, mid = M.subjects.MATH.now, cid = M.kodesh['K:CHU'].now;
      ans.tdlToday = () => null; ans.msSchoolGoal = () => ({ month: 'Kislev', goal: 100, total: 40, top: [] });
      ans.sgMyDesk = () => ({ sid: M.sid, picks: [{ id: cid, by: 'Rabbi Made-up', note: 'Made-up note' }], shouts: [{ id: 'sh1', kind: 'praise', text: 'Made-up praise for a made-up boy', by: 'Rabbi Made-up', at: now }] });
      ans.pfdToday = () => ({ stops: [{ k: 'MATH', c: 'MATH', ic: '🧮', name: 'Math', area: 'core', ids: [mid], names: {} }], total: 30 });
      ans.sgShoutSeen = () => ({ ok: true }); ans.kmMyMap = () => null;
      A.st = loadStudent({ id: M.sid, name: 'Made-up Boy C' }); A.st.skills = A.st.skills || {}; A.view = 'hub'; A.overlay = null; render(); await sleep(40);
      o.on = K.on(); o.tiles = K.places('k').filter(d => d.id === 'work' || d.id === 'map').map(d => d.id).join(',');
      const tw = document.createElement('div'); tw.innerHTML = K.tile('work'); o.workTile = /Do this now/i.test(tw.textContent);

      /* 1. MY WORK, no list: DO THIS NOW first, 3 rounds, one live, the server asked, the shout-out, the pick, Today's path, the school goal */
      let p = await open('work'); await sleep(120);
      o.work = !!p; if (p) {
        o.wHouse = house(p); o.wKit = onlyKit(p); o.wMains = p.querySelectorAll('.tlk-main').length;
        const first = p.querySelector('.shw-wrap > *'); o.firstNow = !!(first && first.classList.contains('shw-now') && /Do this now/i.test(first.textContent));
        o.rounds = p.querySelectorAll('.shw-today .shw-rows > :not(:last-child)').length; o.live = p.querySelectorAll('.shw-today .shw-row.live').length;
        o.pick = !!p.querySelector('.shw-pick[data-id="' + cid + '"]'); o.path = /TODAY'S PATH/.test(p.textContent); o.goal = /School goal for Kislev/.test(p.textContent);
        o.lock1 = K.today().lock;
      }
      o.calls1 = called('tdlToday') && called('sgMyDesk') && called('msSchoolGoal') && called('pfdToday');
      const sp = document.getElementById('shk-shw-shout'); o.shout = !!sp;
      if (sp) { const xs = sp.querySelectorAll('.tlk-x'), r = xs[0] && xs[0].getBoundingClientRect(), c = sp.querySelector('.shk-card').getBoundingClientRect(); o.shoutX = xs.length === 1 && !!(r && r.left > c.left + c.width / 2 && r.top < c.top + 80) && onlyKit(sp);
        o.shoutText = /Made-up praise/.test(sp.textContent); const ty = sp.querySelector('.tlk-main'); ty && ty.click(); await sleep(60); }
      o.thanks = called('sgShoutSeen', ['sh1'], true); o.shoutGone = !document.getElementById('shk-shw-shout');
      p = document.getElementById('shk-work'); const go = p && p.querySelector('.shw-now .tlk-main'); o.startWord = go ? go.textContent : ''; const goId = go && go.getAttribute('data-id');
      go && go.click(); await sleep(400); o.workPlay = opened.indexOf(goId) >= 0 && A.view === 'play' && !!A.play && A.play.id === goId && !document.getElementById('shk-work');
      await hub();

      /* 2. TODAY'S LIST (Grade 2 up): one row per thing, core first, one Next, no minutes, locked until done, done at once, all done opens */
      const items = [{ k: 'READ', n: 2, c: 0, ids: [], w: 'READ', name: 'Reading' }, { k: 'LANG', n: 1, c: 0, ids: [], w: 'LANG', name: 'Writing' },
        { k: 'MATH', n: 1, c: 0, ids: [], w: 'MATH', name: 'Math' }, { k: 'KODESH', n: 1, c: 0, ids: [], w: 'K:CHU', name: 'Kodesh' }, { k: 'KNOW', n: 1, c: 0, ids: [], w: 'SCI', name: 'Science' }];
      ans.tdlToday = () => ({ v: 1, on: true, items, done: 0, total: 6, complete: false, paid: false });
      p = await open('work'); await sleep(120); p = document.getElementById('shk-work'); K.close('shw-shout', 'x');
      if (p) { o.lRows = p.querySelectorAll('.shw-today .shw-rows > :not(:last-child)').length; o.lLive = p.querySelectorAll('.shw-today .shw-row.live').length;
        o.lHead = (p.querySelector('.shw-today .shw-head') || {}).textContent || ''; o.lFirst = (p.querySelector('.shw-today .shw-row.live') || { getAttribute: () => '' }).getAttribute('data-id');
        o.lRead = [...p.querySelectorAll('.shw-today .shw-row[data-id]')].filter(b => /READING/.test(b.textContent)).map(b => b.getAttribute('data-id'));
        o.lNext = (p.querySelector('.shw-now .tlk-main') || {}).textContent || ''; o.lTimer = /minute|timer|⏱/i.test(p.textContent); o.lKit = onlyKit(p) && p.querySelectorAll('.tlk-main').length === 1; }
      o.lToday = K.today();
      A.st.skills[rid] = { m: true, at: Date.now(), first: true, stars: 3 }; p = await open('work'); await sleep(120); p = document.getElementById('shk-work');
      o.lAfter = p ? (p.querySelector('.shw-today h2') || {}).textContent : ''; o.lWon = p ? p.querySelectorAll('.shw-today .shw-done.won').length : 0;
      ans.tdlToday = () => ({ v: 1, on: true, items: items.map(x => Object.assign({}, x, { c: x.n, ids: Array.from({ length: x.n }, (_, i) => x.k + '.X.L05.0' + i) })), done: 6, total: 6, complete: true, paid: true });
      p = await open('work'); await sleep(120); p = document.getElementById('shk-work'); o.lDone = p ? (p.querySelector('.shw-today .shw-head') || {}).textContent : ''; o.lOpen = K.today().open;
      ans.tdlToday = () => null; delete A.st.skills[rid]; await hub();

      /* 3. THE TRAIL: one Start into his goal (level check says what comes next), one BOSS, locked says so, Change subject, skill tree */
      p = await open('map'); o.map = !!p;
      if (p) { o.mHouse = house(p); o.mKit = onlyKit(p); o.mMains = p.querySelectorAll('.tlk-main').length; o.goalH = (p.querySelector('.shw-goal h2') || {}).textContent || '';
        o.goalM = (p.querySelector('.shw-goal .m') || {}).textContent || ''; o.learn = (p.querySelector('.shw-goal .shw-learn') || {}).textContent || ''; o.lc = !!p.querySelector('.shw-goal.shw-lcg');
        o.stops = p.querySelectorAll('.shw-stop').length; o.boss = p.querySelectorAll('.shw-stop.s-boss').length; o.nowStop = p.querySelectorAll('.shw-stop.s-now').length;
        const st0 = p.querySelector('.tlk-main'); o.mGoId = st0 && st0.getAttribute('data-id'); st0 && st0.click(); await sleep(400);
        o.mPlay = opened[opened.length - 1] === mid && A.view === 'play' && !!A.play && A.play.id === mid && !document.getElementById('shk-map'); }
      await hub(); p = await open('map');
      if (p) { const cs = p.querySelector('[data-shw="subjects"]'); cs && cs.click(); await sleep(80); const sj = document.getElementById('shk-shw-subjects');
        o.subj = !!sj && sj.querySelectorAll('.tlk-back').length === 1 && house(sj) && onlyKit(sj); o.subjChu = !!(sj && sj.querySelector('[data-shw="world"][data-k="K:CHU"]'));
        const more = sj ? sj.querySelectorAll('[data-shw="panel"]').length : 0; o.panels = more;
        const ch = sj && sj.querySelector('[data-shw="world"][data-k="K:CHU"]'); ch && ch.click(); await sleep(120);
        o.subjGone = !document.getElementById('shk-shw-subjects'); o.chuGoal = (p.querySelector('.shw-goal h2') || {}).textContent || '';
        const lk = p.querySelector('.shw-stop.s-lock'); if (lk) { lk.click(); await sleep(60); o.lockMsg = (p.querySelector('.shw-msg') || {}).textContent || ''; } else o.lockMsg = 'no locked stop';
        const tr = p.querySelector('[data-shw="tree"]'); tr && tr.click(); await sleep(80); const tp = document.getElementById('shk-shw-tree');
        o.tree = !!tp && tp.querySelectorAll('.tlk-back').length === 1 && onlyKit(tp) && tp.querySelectorAll('.shw-node').length > 0;
        const bk = tp && tp.querySelector('.tlk-back'); bk && bk.click(); await sleep(60); o.treeBack = !document.getElementById('shk-shw-tree') && !!document.getElementById('shk-map'); }
      /* a mastered step: the Trail fetches his fresh map (kmMyMap) */
      calls.length = 0; A.st.skills[mid] = { m: true, at: Date.now() }; await open('map'); await sleep(60); o.km = called('kmMyMap'); delete A.st.skills[mid];

      /* 4. SHK.subjects(): his subjects and level panels; a panel page; Find my levels */
      const S = K.subjects(); o.sMap = S.filter(x => x.kind === 'map').map(x => x.k).sort().join(','); o.sPanels = S.filter(x => x.kind === 'panel').length; o.sFind = S.some(x => x.kind === 'find');
      const lkp = S.find(x => x.k === 'lkpanel' && x.items.some(i => i.state === 'go')) || S.find(x => x.kind === 'panel' && x.items.some(i => i.state === 'go'));
      if (lkp) { lkp.open(); await sleep(80); const pp = document.getElementById('shk-shw-panel'); o.panelPage = !!pp && onlyKit(pp) && pp.querySelectorAll('.tlk-back').length === 1 && pp.querySelectorAll('[data-shw="item"]').length > 0;
        const it = pp && pp.querySelector('[data-shw="item"]'); const n0 = opened.length; it && it.click(); await sleep(400); o.panelPlay = A.view === 'play' || opened.length > n0; o.panelName = lkp.name; }
      await hub(); p = await open('map'); const sj2 = p && p.querySelector('[data-shw="subjects"]'); sj2 && sj2.click(); await sleep(80);
      const lv = document.querySelector('#shk-shw-subjects [data-shw="levels"]'); lv && lv.click(); await sleep(60); const lp = document.getElementById('shk-shw-levels');
      o.levels = !!lp && lp.querySelectorAll('.tlk-x').length === 1 && lp.querySelectorAll('[data-shw="check"]').length === 3 && onlyKit(lp);

      /* 5. K-3 gets the bigger Home; Grade 1 gets nothing */
      K.closeAll(); M.grade = 3; p = await open('map'); o.k3 = !!(p && p.querySelector('.tlk-home.tlk-home-k3'));
      K.closeAll(); M.grade = 1; o.g1 = K.places('k').filter(d => d.id === 'work' || d.id === 'map').length;
    } catch (e) { o.err = String(e && e.stack || e).slice(0, 300); }
    finally {
      K.closeAll(); K.openLesson = keep.ol; if (D0) Object.defineProperty(window.google.script, 'run', D0);
      window.TL_MAP = keep.map; SRV.token = keep.tok; A.st = keep.st; A.play = keep.play; A.overlay = keep.ov; A.view = keep.view === 'play' ? 'hub' : keep.view; try { render(); } catch (e) {}
      await sleep(30); o.left = K.open.length;
    }
    return o;
  }, map);
  const chk = (c, m) => { if (!c) fails.push('new shell C (My work, the Trail): ' + m); };
  if (o.missing) { fails.push('new shell C: window.SHK or src/ShWork.html did not load'); return { fails, oks }; }
  const J = x => JSON.stringify(x);
  chk(!o.err, 'the test crashed: ' + o.err);
  chk(o.on && o.tiles === 'work,map' && o.workTile, 'a Grade 5 boy has the My work and My map tiles, My work says Do this now (got ' + J([o.on, o.tiles, o.workTile]) + ')');
  chk(o.work && o.wHouse && o.wKit && o.wMains === 1, 'My work is a full page with one house top left, only kit buttons and one main button (got ' + J([o.work, o.wHouse, o.wKit, o.wMains]) + ')');
  chk(o.firstNow, 'DO THIS NOW is the first thing on My work');
  chk(o.rounds === 3 && o.live === 1, 'with no list, My work shows the 3 rounds, one live (got ' + o.rounds + ' rounds, ' + o.live + ' live)');
  chk(/3 more rounds/.test(o.lock1 || ''), 'the Game Pavilion is locked until his work is done and says why (got "' + o.lock1 + '")');
  chk(o.calls1, 'opening My work asks the server for his list (tdlToday), his rebbe\'s desk (sgMyDesk), the school goal (msSchoolGoal) and a TEST boy\'s path (pfdToday), with his token');
  chk(o.pick && o.path && o.goal, 'his rebbe\'s pick, Today\'s path and the school goal show on My work (got ' + J([o.pick, o.path, o.goal]) + ')');
  chk(o.shout && o.shoutX && o.shoutText, 'a new shout-out opens big once, as a pop-up with one x top right and only kit buttons (got ' + J([o.shout, o.shoutX, o.shoutText]) + ')');
  chk(o.thanks && o.shoutGone, '"Thank you" sends sgShoutSeen(token, [id], true) and closes it');
  chk(o.startWord === 'Start' && o.workPlay, 'DO THIS NOW\'s Start opens his lesson through SHK.openLesson and the shell steps away (got ' + J([o.startWord, o.workPlay]) + ')');
  chk(o.lRows === 6 && o.lLive === 1, 'with Today\'s list, one row per thing on the list, one live (got ' + o.lRows + ' rows, ' + o.lLive + ' live)');
  chk(/TODAY'S LIST/.test(o.lHead || '') && /0 of 6 done/.test(o.lHead || ''), 'the top says "TODAY\'S LIST · 0 of 6 done" (got "' + o.lHead + '")');
  chk(o.lToday && o.lToday.line === '0 of 6 done today' && /6 more things on today's list/.test(o.lToday.lock), 'SHK.today() gives the home "0 of 6 done today" and the lock "6 more things on today\'s list" (got ' + J(o.lToday) + ')');
  chk(o.lFirst === map.subjects.READ.now, 'the first live row is his next Reading step, core first (got ' + o.lFirst + ')');
  chk(o.lRead && o.lRead.length === 2 && o.lRead[0] !== o.lRead[1], 'two Reading lines are this step and the one after it (got ' + J(o.lRead) + ')');
  chk(o.lNext === 'Next' && o.lKit, 'one Next button walks him through the list, only kit buttons (got "' + o.lNext + '")');
  chk(!o.lTimer, 'no minutes and no timers on My work');
  chk(/1 of 6 done/.test(o.lAfter || '') && o.lWon === 1, 'a lesson he masters shows as done at once (got "' + o.lAfter + '", ' + o.lWon + ')');
  chk(/All done/.test(o.lDone || '') && o.lOpen, 'when the server says the whole list is done: "All done" and the Game Pavilion opens (got "' + o.lDone + '", ' + o.lOpen + ')');
  chk(o.map && o.mHouse && o.mKit && o.mMains === 1, 'My map is a full page with one house top left, only kit buttons and ONE Start (got ' + J([o.map, o.mHouse, o.mKit, o.mMains]) + ')');
  chk(o.lc ? (/Level Check/.test(o.goalH) && o.goalM.indexOf('then: ' + (map.names[map.subjects.MATH.now] || [''])[0]) >= 0) : (o.goalH === (map.names[map.subjects.MATH.now] || [''])[0] && /learn|Real skill/.test(o.learn)), 'the goal card shows his next level and the real skill (a level check says "then: <next>") (got ' + J([o.lc, o.goalH, o.goalM, o.learn]) + ')');
  chk(o.stops > 0 && o.boss === 1 && o.nowStop === 1, 'the trail shows his stops with exactly one BOSS and one "you are here" (got ' + J([o.stops, o.boss, o.nowStop]) + ')');
  chk(o.mGoId === map.subjects.MATH.now && o.mPlay, 'Start opens his goal through SHK.openLesson and the shell steps away during the lesson (got ' + J([o.mGoId, o.mPlay]) + ')');
  chk(o.subj && o.subjChu && o.subjGone && o.chuGoal === (map.names[map.kodesh['K:CHU'].now] || [''])[0], 'Change subject is a page with the round Back and the house; Chumash moves the map to its goal (got ' + J([o.subj, o.subjChu, o.subjGone, o.chuGoal]) + ')');
  chk(/Locked/.test(o.lockMsg || ''), 'a locked stop says Locked (got "' + o.lockMsg + '")');
  chk(o.tree && o.treeBack, 'the skill tree opens with the round Back, which returns to the map');
  chk(o.km, 'after a mastered step the Trail asks the server for his fresh map (kmMyMap)');
  chk(o.sMap === 'K:CHU,MATH,READ' && o.sPanels > 0 && o.sFind, 'SHK.subjects() lists his map subjects, his level panels and Find my levels (got ' + J([o.sMap, o.sPanels, o.sFind]) + ')');
  chk(o.panels > 0 && o.panelPage && o.panelPlay, 'a level panel opens as a page (round Back, kit only) and its lesson starts (got ' + J([o.panels, o.panelPage, o.panelPlay, o.panelName]) + ')');
  chk(o.levels, 'Find my levels is a pop-up with one x and a check for Math, Reading and Social Studies');
  chk(o.k3, 'a K-3 boy gets the bigger Home on the Trail');
  chk(o.g1 === 0, 'a Grade 1 boy gets no My work or My map tile (K-1 keep their games)');
  chk(o.left === 0, 'every page is closed at the end (got ' + o.left + ')');
  if (!fails.length) oks.push('new shell C: My work (DO THIS NOW first; 3 rounds or Today\'s list with one Next, no timers, done at once, all done opens the Game Pavilion; rebbe pick, shout-out + Thank you, Today\'s path, school goal; tdlToday/sgMyDesk/msSchoolGoal/pfdToday asked) and the Trail (one Start through SHK.openLesson, level check, one BOSS, locked says so, Change subject, skill tree, kmMyMap), SHK.subjects() and Find my levels; kit buttons only; K-1 get nothing');
  return { fails, oks };
};
