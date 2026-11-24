/* TODAY'S LIST (Core Growth job D, src/DailyPlan.js + the daily bonus in src/Money.js) on the real server code, MADE-UP boys only.
   Proves, for a TEST- boy (TDL_LIVE 'test'): his list comes from his own map, core first (Reading, Writing, Math, Kodesh, Science or
   Social Studies); a subject he has nothing in gives its lines to Reading; a line is covered only by a lesson the SERVER paid as
   mastered today; 3 lessons no longer pay the daily bonus, the WHOLE list does, once, with the same amount and a clear reason; extra
   lessons in one subject never fill another; a staff amount for the boy is used. For a real boy nothing changes: no list, and the
   bonus still comes after 3 lessons. A K-1 boy keeps his games-only day (no list yet).
   Also server(): the page part, page(pg, map): "My work" shows one row per thing on the list, "0 of 6 done", the Arcade locked; all
   done opens it; a boy with no list keeps the 3 rounds. Returns { fails, oks }. */
const R = require('path').join(__dirname, '..', '..', 'server') + '/';
const { createRuntime } = require(R + 'runtime.js'), vm = require('vm');
function server() {
  const fails = [], oks = [], BOOK = 'SELFTEST_DP1';
  const store = { books: {}, props: { SCHOOL_STAGING_DATABASE_ID: BOOK } };
  const rt = createRuntime({ store }); const call = (fn, ...a) => rt.call(fn, a);
  const ev = s => JSON.parse(vm.runInContext('JSON.stringify(' + s + ')', rt.ctx));
  if (rt.loadErrors.length) return { fails: rt.loadErrors.map(e => 'server file failed to load: ' + e), oks };
  const TABLES = JSON.parse(vm.runInContext('JSON.stringify(TABLES)', rt.ctx)), bk = store.books[BOOK] = { tabs: {}, order: [] };
  TABLES.forEach(n => { bk.tabs['TL ' + n] = { rows: [['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']] }; bk.order.push('TL ' + n); });
  call('msBootstrap');
  const H = (s, c) => vm.runInContext('msHash_(' + JSON.stringify(s) + ',' + JSON.stringify(c) + ')', rt.ctx);
  const boys = [['TEST-DP01', 'Made-up Boy A', '7411', 'grade 4'], ['TEST-DP02', 'Made-up Boy B', '7412', 'grade 4'], ['DPREAL01', 'Made-up Boy C', '7413', 'grade 4'],
    ['TEST-DP03', 'Made-up Boy D', '7414', 'grade 1'], ['TEST-DP04', 'Made-up Boy E', '7415', 'grade 4'], ['TEST-DP05', 'Made-up Boy F', '7416', 'grade 4']];
  const roster = bk.tabs.MS_Roster.rows; boys.forEach((b, i) => { const row = roster[0].map(() => ''); row[0] = b[0]; row[1] = b[1]; row[5] = 'dpsalt' + i; row[6] = H('dpsalt' + i, b[2]); row[7] = true; row[8] = b[3]; roster.push(row); });
  vm.runInContext("CacheService.getScriptCache().put('ms_tok_dp-staff', JSON.stringify({role:'staff',sid:null,pid:null,staff:null,who:{id:'DPT',name:'Made-up Rebbe',role:'head'}}), 600)", rt.ctx);
  const place = (sid, key, level) => { try { call('libApply', 'dp-staff', { action: 'place', boys: [sid], key, level }); } catch (e) { fails.push('daily plan: placing ' + key + ' ' + level + ' failed: ' + e.message); } };
  boys.forEach(b => bk.tabs.MS_State.rows.push([b[0], JSON.stringify({ id: b[0], skills: {} }), new Date(), 1]));
  ['TEST-DP01', 'TEST-DP04'].forEach(s => { place(s, 'K:CHU', 3); place(s, 'SCI', 5); place(s, 'SOC', 5); });
  const chk = (c, msg) => { if (!c) fails.push('daily plan: ' + msg); return c; };
  const sign = code => { const si = call('msSignInFast', code); return si && si.ok ? si : null; };
  /* master one lesson through the real msSave: 3 right checks + the "Mastered" pay row the lesson page sends */
  let q = 0; const master = (tok, sid, id) => { const evr = [0, 1, 2].map(() => ({ skill: id, phase: 'check', item: 'c' + (++q), ok: true, first: true, at: Date.now() }));
    return call('msSave', tok, sid, { id: sid, skills: {} }, evr, [{ why: 'Mastered ' + id, amt: 10 }]); };
  const bonus = sid => ev("moneyRowsFor_('" + sid + "')").filter(r => String(r.key).indexOf('daily3:' + sid + ':') === 0);
  const built = (M, k, n) => { const c = (M.subjects || {})[k] || (M.kodesh || {})[k]; return c ? (c.skills || []).filter(y => y[1] && !y[2]).map(y => y[0]).slice(0, n) : []; };
  /* 1. a TEST- boy with Reading, Writing, Math, Chumash, Science and Social Studies at his level */
  const a = sign('7411'); if (!chk(a, 'made-up boy A could not sign in')) return { fails, oks };
  const L = call('tdlToday', a.token);
  if (!chk(L && L.on && Array.isArray(L.items), 'a TEST- boy must get his list (got ' + JSON.stringify(L).slice(0, 160) + ')')) return { fails, oks };
  const shape = L.items.map(x => x.k + x.n).join(',');
  chk(shape === 'READ2,LANG1,MATH1,KODESH1,KNOW1' && L.total === 6 && L.done === 0 && !L.complete, 'his list must be 2 Reading, 1 Writing, 1 Math, 1 Kodesh, 1 Science or Social Studies, 0 of 6 done (got ' + shape + ', ' + L.done + ' of ' + L.total + ')');
  chk(L.items.find(x => x.k === 'KODESH').w === 'K:CHU' && /^(SCI|SOC)$/.test(L.items.find(x => x.k === 'KNOW').w), 'Kodesh plays his Chumash world, and the knowledge line Science or Social Studies');
  chk(!/minute|timer/i.test(JSON.stringify(L)), 'no minutes and no timers in his list');
  chk(L.bonusCents === ev("MONEY.RULES.dailyGoal.cents"), 'the bonus amount comes from the rules table');
  const M = a.map || call('kmMyMap', a.token);
  const rd = built(M, 'READ', 4), lg = built(M, 'LANG', 1), mt = built(M, 'MATH', 1), ch = built(M, 'K:CHU', 1), kn = built(M, L.items.find(x => x.k === 'KNOW').w, 1);
  if (!chk(rd.length >= 3 && lg.length && mt.length && ch.length && kn.length, 'the made-up boy needs lessons in every subject (got ' + [rd.length, lg.length, mt.length, ch.length, kn.length] + ')')) return { fails, oks };
  /* 2. 3 lessons (the old daily goal) do NOT pay the bonus any more: the list is not done */
  master(a.token, 'TEST-DP01', rd[0]); master(a.token, 'TEST-DP01', rd[1]); master(a.token, 'TEST-DP01', rd[2]);
  const L2 = call('tdlToday', a.token);
  chk(L2.items[0].c === 2 && L2.done === 2, 'a third Reading lesson must not fill another line (got ' + L2.done + ' of ' + L2.total + ')');
  chk(!bonus('TEST-DP01').length, '3 lessons must no longer pay the daily bonus for a boy with a list');
  /* 3. covered only by what the server paid: a "Mastered" claim with no right checks covers nothing */
  call('msSave', a.token, 'TEST-DP01', { id: 'TEST-DP01', skills: {} }, [], [{ why: 'Mastered ' + lg[0], amt: 10 }]);
  chk(call('tdlToday', a.token).done === 2, 'a mastery the server did not pay must not cover a line');
  /* 4. the whole list pays the SAME bonus once, with a clear reason */
  master(a.token, 'TEST-DP01', lg[0]); master(a.token, 'TEST-DP01', mt[0]); master(a.token, 'TEST-DP01', ch[0]);
  chk(!bonus('TEST-DP01').length, 'the bonus waits until the last line (5 of 6 done)');
  const last = master(a.token, 'TEST-DP01', kn[0]);
  const B = bonus('TEST-DP01'), L3 = call('tdlToday', a.token);
  chk(L3.complete && L3.done === 6 && L3.paid, 'the list is done after all 6 (got ' + L3.done + ' of ' + L3.total + ')');
  chk(B.length === 1 && B[0].cents === ev("MONEY.RULES.dailyGoal.cents") && B[0].reason === "Daily bonus · You finished today's list", 'the whole list pays the daily bonus once, same amount, reason "Daily bonus · You finished today\'s list" (got ' + JSON.stringify(B) + ')');
  chk(last && last.daily === 10, 'the save that finishes the list tells the page the bonus was paid');
  master(a.token, 'TEST-DP01', rd[3] || rd[2]); chk(bonus('TEST-DP01').length === 1, 'the bonus is paid once a day');
  chk(ev("moneyChestStatus_('TEST-DP01')").days === 1, 'the treasure chest counts the list day as a bonus day');
  /* 5. a boy with nothing in Kodesh, Science or Social Studies: those lines go to Reading (core first) */
  const b = sign('7412'); const Lb = b && call('tdlToday', b.token);
  chk(Lb && Lb.items.map(x => x.k + x.n).join(',') === 'READ4,LANG1,MATH1' && Lb.total === 6, 'subjects he has nothing in give their lines to Reading (got ' + (Lb && Lb.items.map(x => x.k + x.n).join(',')) + ')');
  /* 5b. a level check covers a line only when he really knew it (80%+), at his own level, once a subject a day */
  { const lcRun = (tok, subj, lvl, right) => { const st = call('pfLevelCheckStart', tok, subj, lvl); if (!st || !st.items || !st.items.length) return null;
      const ans = st.items.map(it => ev('(function(){ var it=pfIx_().byId[' + JSON.stringify(it.id) + ']; return it.ans; })()'));
      return call('pfLevelCheckSave', tok, subj, lvl, st.items.map((it, j) => ({ item: it.id, value: right ? ans[j] : 'zz-not-it' }))); };
    if (b) { const sv = lcRun(b.token, 'MATH', 5, false); if (sv) chk(call('tdlToday', b.token).items.find(x => x.k === 'MATH').c === 0, 'an empty level check (0 right) must not cover a line'); }
    const f = sign('7416'); if (f) { const sv = lcRun(f.token, 'MATH', 5, true); if (sv) { const Lf = call('tdlToday', f.token); chk(Lf.items.find(x => x.k === 'MATH').c === 1, 'a level check he got right at his own level covers his Math line (he showed he knows it)'); }
      const s3 = lcRun(f.token, 'MATH', 3, true); if (s3) chk(call('tdlToday', f.token).items.find(x => x.k === 'MATH').c === 1, 'a level check below his level must not cover another line'); } }
  /* 6. a staff amount for one boy is used */
  vm.runInContext("put_('Settings', { id: 'tdl:boy:TEST-DP04', value: { READ: 1, LANG: 0, MATH: 0, KODESH: 0, KNOW: 0 } }, 'test')", rt.ctx);
  const e = sign('7415'); const Le = e && call('tdlToday', e.token);
  chk(Le && Le.total === 1 && Le.items.length === 1 && Le.items[0].k === 'READ', 'a staff amount for the boy sets his list (got ' + JSON.stringify(Le && Le.items) + ')');
  if (Le) { const Me = e.map || call('kmMyMap', e.token); master(e.token, 'TEST-DP04', built(Me, 'READ', 1)[0]); chk(bonus('TEST-DP04').length === 1, 'his one-line list pays the bonus when done'); }
  /* 7. a real boy: no list, and the bonus still comes after 3 lessons, as before */
  const c = sign('7413'); if (chk(c, 'made-up boy C could not sign in')) {
    chk(call('tdlToday', c.token) === null, 'a real boy gets no list while it is for TEST- boys only');
    const Mc = c.map || call('kmMyMap', c.token), r = built(Mc, 'READ', 3);
    master(c.token, 'DPREAL01', r[0]); master(c.token, 'DPREAL01', r[1]); chk(!bonus('DPREAL01').length, 'a real boy: no bonus after 2 lessons');
    master(c.token, 'DPREAL01', r[2]); const Bc = bonus('DPREAL01');
    chk(Bc.length === 1 && Bc[0].reason === 'Daily goal: 3 lessons today', 'a real boy still gets the daily bonus after 3 lessons, as before (got ' + JSON.stringify(Bc) + ')'); }
  /* 8. a K-1 boy keeps his games-only day */
  const d = sign('7414'); chk(d && call('tdlToday', d.token) === null, 'a K-1 boy gets no list yet (his games-only home stays)');
  /* 9. only boys ask for a list */
  let refused = false; try { call('tdlToday', 'dp-staff'); } catch (x) { refused = true; } chk(refused, 'a staff token must be refused');
  const demo = { map: M, list: L };   /* for pictures (made-up boy A) */
  if (!fails.length) oks.push("today's list (server, TEST- boys): core first from his own map, empty subjects go to Reading, covered only by paid mastery, 3 lessons no longer pay, the whole list pays the same bonus once (chest counts it), staff amount per boy; real boys unchanged; K-1 unchanged");
  return { fails, oks, demo };
}
/* the page: "My work" with a list (one row per thing, "0 of 6 done", Next, Arcade locked) and when it is all done */
async function page(pg, map) {
  const fails = [], oks = [];
  const r = await pg.evaluate(async M0 => { const sleep = ms => new Promise(r => setTimeout(r, ms)), o = {}, sid = 'TEST-DPPAGE', tok = SRV.token;
    const M = JSON.parse(JSON.stringify(M0)); M.sid = sid; SRV.token = null;   /* no server here: the list is handed in below */
    A.overlay = null; A.play = null; window.TL_MAP = M; A.st = loadStudent({ id: sid, name: 'Made-up Boy D' }); A.view = 'hub'; GM.sid = ''; await sleep(20);
    const mid = M.subjects.MATH.now, rid = M.subjects.READ.now, items = [{ k: 'READ', n: 2, c: 0, ids: [], w: 'READ', name: 'Reading' }, { k: 'LANG', n: 1, c: 0, ids: [], w: 'LANG', name: 'Writing' },
      { k: 'MATH', n: 1, c: 0, ids: [], w: 'MATH', name: 'Math' }, { k: 'KODESH', n: 1, c: 0, ids: [], w: 'K:CHU', name: 'Kodesh' }, { k: 'KNOW', n: 1, c: 0, ids: [], w: 'SCI', name: 'Science' }];
    window.TL_TDL.by[sid] = { v: 1, on: true, items, done: 0, total: 6, complete: false, paid: false }; render(); await sleep(30);
    const gm = document.getElementById('gm'); const go = async t => { const h = document.querySelector('#gm-nav [data-gmnav=home]'); if (h) { h.click(); await sleep(30); } const b = gm.querySelector('.gm-hts [data-gmnav=' + t + ']'); if (b) { b.click(); await sleep(30); } };
    await go('home'); o.homeLine = (gm.querySelector('.gm-hi p') || {}).textContent || '';
    await go('missions'); o.rows = gm.querySelectorAll('.gm-rd:not(.final):not(.rebbe)').length; o.live = gm.querySelectorAll('.gm-rd.live').length; o.head = (gm.querySelector('.gm-marq') || {}).textContent || '';
    o.first = (gm.querySelector('.gm-rd.live') || {}).dataset ? gm.querySelector('.gm-rd.live').dataset.id : ''; o.next = (gm.querySelector('.gm-cta .gm-play') || {}).textContent || ''; o.timer = /minute|timer|⏱/i.test(gm.textContent);
    o.readIds = [...gm.querySelectorAll('.gm-rd[data-id]')].filter(b => /READING/.test(b.textContent)).map(b => b.dataset.id);
    await go('games'); o.locked = !!gm.querySelector('.gm-lock'); o.lockText = (gm.querySelector('.gm-lock') || {}).textContent || '';
    /* he masters a Reading lesson on this page: the row turns done at once */
    A.st.skills = A.st.skills || {}; A.st.skills[rid] = { m: true, at: Date.now(), first: true, stars: 3 }; GM.sig = ''; await go('missions'); o.after = (gm.querySelector('.gm-marq h1') || {}).textContent || ''; o.won = gm.querySelectorAll('.gm-rd.won').length;
    /* the server says the whole list is done */
    window.TL_TDL.by[sid] = { v: 1, on: true, items: items.map(x => Object.assign({}, x, { c: x.n, ids: Array.from({ length: x.n }, (_, i) => x.k + '.X.L05.0' + i) })), done: 6, total: 6, complete: true, paid: true };
    GM.sig = ''; await go('missions'); o.doneHead = (gm.querySelector('.gm-marq') || {}).textContent || ''; await go('games'); o.open = !gm.querySelector('.gm-lock');
    /* a boy with no list keeps the 3 rounds */
    delete window.TL_TDL.by[sid]; GM.sig = ''; await go('missions'); o.old = gm.querySelectorAll('.gm-rd:not(.final):not(.rebbe)').length;
    delete A.st.skills[rid]; window.TL_MAP = null; SRV.token = tok; A.view = 'hub'; return o; }, map);
  const chk = (c, msg) => { if (!c) fails.push("today's list (page): " + msg); };
  chk(r.rows === 6 && r.live === 1, 'My work must show one row per thing on the list, one live (got ' + r.rows + ' rows, ' + r.live + ' live)');
  chk(/TODAY'S LIST/.test(r.head) && /0 of 6 done/.test(r.head), 'the top must say "TODAY\'S LIST · 0 of 6 done" (got "' + r.head + '")');
  chk(/0 of 6 done today/.test(r.homeLine), 'the home line must say "0 of 6 done today" (got "' + r.homeLine + '")');
  chk(r.first === map.subjects.READ.now, 'the first live row is his next Reading step, core first (got ' + r.first + ')');
  chk(r.readIds.length === 2 && r.readIds[0] !== r.readIds[1], 'two Reading lines show this step and the one after it, not the same lesson twice (got ' + r.readIds + ')');
  chk(/Next/.test(r.next), 'one Next button walks him through the list (got "' + r.next + '")');
  chk(!r.timer, 'no minutes and no timers on My work');
  chk(r.locked && /6 more things on today's list/.test(r.lockText), 'the Arcade is locked until the list is done, and says so (got "' + r.lockText + '")');
  chk(/1 of 6 done/.test(r.after) && r.won === 1, 'a lesson he masters shows as done at once (got "' + r.after + '", ' + r.won + ' done)');
  chk(/All done/.test(r.doneHead) && r.open, 'when the whole list is done: "All done" and the Arcade opens (got "' + r.doneHead + '", open ' + r.open + ')');
  chk(r.old === 3, 'a boy with no list keeps the 3 rounds (got ' + r.old + ')');
  if (!fails.length) oks.push("today's list (page): My work shows one row per thing (core first), \"0 of 6 done\", one Next button, no timers, Arcade locked; a mastered lesson turns done at once; all done opens the Arcade; no list = the 3 rounds as before");
  return { fails, oks };
}
module.exports = { server, page };
