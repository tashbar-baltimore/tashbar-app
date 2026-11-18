/* Pathfinder under a whole class at once, on this machine: N made-up TEST boys answer in the same moment.
   Uses the real server code (src/*.js) on the Firestore store with a stand-in Firestore. No real students.
   Run: node server/pfload-local.js [boys=30] [rounds=6]
   Reports how many reruns each call needed and any "server is busy" refusals, then checks every boy's
   session and answer rows are all there (nothing lost, nothing doubled). */
const assert = require('assert'), vm = require('vm'), crypto = require('crypto');
const { fake } = require('./fakefs.js'), { FsServer } = require('./fsstore.js'), { createRuntime } = require('./runtime.js');
const N = +process.argv[2] || 30, ROUNDS = +process.argv[3] || 6, BOOK = 'PFLOAD_1', COPIES = 4;
/* THINK=ms: each boy thinks a random 0..THINK ms before each answer (a real class); 0 = all in the same instant (worst case). MERGE=0: the old engine. */
const THINK = +process.env.THINK || 0, OLD = process.env.MERGE === '0';
const ck = k => crypto.createHash('sha1').update(k).digest('hex');
(async () => {
  const db = fake(+process.env.LAG || 40); const mk = () => new FsServer(db, { ns: BOOK, props: { SCHOOL_STAGING_DATABASE_ID: BOOK }, preload: true, merge: !OLD });
  const probe = createRuntime({ store: { books: {}, props: { SCHOOL_STAGING_DATABASE_ID: BOOK } } }); const TABLES = JSON.parse(vm.runInContext('JSON.stringify(TABLES)', probe.ctx));
  const boot = mk();
  await boot.bookRef(BOOK).set({ tabs: TABLES.map(n => 'TL ' + n) });
  for (const n of TABLES) { await boot.tabRef(BOOK, 'TL ' + n).set({ ver: 1, nRows: 1, per: 20, text: {} }); await boot.tabRef(BOOK, 'TL ' + n).collection('chunks').doc('c0').set({ rows: JSON.stringify([['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']]) }); }
  const b = await boot.run('msBootstrap', []); assert.ok(!b.error, b.error);
  /* made-up TEST boys on the roster (grade 3), each with a sign-in ticket in shared memory */
  const roster = boot.tabRef(BOOK, 'MS_Roster'), meta = (await roster.get()).data(), per = meta.per;
  const rows = []; (await roster.collection('chunks').get()).forEach(c => { JSON.parse(c.data().rows).forEach((r, j) => { rows[Number(c.id.slice(1)) * per + j] = r; }); });
  const boys = []; for (let i = 1; i <= N; i++) { const id = 'TEST-L' + String(i).padStart(3, '0'); boys.push(id); rows.push([id, 'Load Boy ' + i + ' (TEST)', 'A', 'A', 'A', 'x', 'x', true, 'grade 3 · TEST - not a real student']); }
  for (let c = 0; c * per < rows.length; c++) await roster.collection('chunks').doc('c' + c).set({ rows: JSON.stringify(rows.slice(c * per, (c + 1) * per)) });
  await roster.set({ ver: meta.ver + 1, nRows: rows.length, per, text: meta.text || {} });
  /* FILL=1: tabs as big as the live ones, with made-up rows for made-up TEST-F boys (PF_Answers 12,000, TL Money 18,000, PF_Sessions 300 x 20 KB) */
  if (process.env.FILL === '1') { const put = async (t, head, n, mkRow) => { const per = /Money/.test(t) ? 400 : 20, rs = [head]; for (let i = 0; i < n; i++) rs.push(mkRow(i));
      for (let c = 0; c * per < rs.length; c++) await boot.tabRef(BOOK, t).collection('chunks').doc('c' + c).set({ rows: JSON.stringify(rs.slice(c * per, (c + 1) * per)) });
      await boot.tabRef(BOOK, t).set({ ver: 1, nRows: rs.length, per, text: {} }); const bd = (await boot.bookRef(BOOK).get()).data(); if (bd.tabs.indexOf(t) < 0) await boot.bookRef(BOOK).set({ tabs: bd.tabs.concat([t]) }); };
    const pf = JSON.parse(vm.runInContext('JSON.stringify(PF.TABS)', probe.ctx)), mh = JSON.parse(vm.runInContext('JSON.stringify(MONEY.HEAD)', probe.ctx)), pad = 'x'.repeat(20000);
    await put('PF_Sessions', pf.sessions, 300, i => ['pfF' + i, 'TEST-F' + i, 'done', 'full', 3, '', '', 'boy', JSON.stringify({ filler: pad }), '[]']);
    await put('PF_Answers', pf.answers, 12000, i => [new Date(0).toISOString(), 'pfF' + (i % 300), 'TEST-F' + (i % 300), 'MATH', i, 'X', 'S', 'NPV', 3, 'CHOICE', 'a', 1, '', 3000, 0, 0, '', 0, 0.5, 'adaptive', '']);
    await put('TL Money', mh, 18000, i => ['txn-f' + i, new Date(0).toISOString(), 'TEST-F' + (i % 300), 'earn', 200, 'filler', 'PATHFINDER', '', 'system', 'fill:' + i]); }
  const tok = {}; const until = Date.now() + 6 * 3600e3;
  for (const id of boys) { tok[id] = 'tok-' + id; const k = 'ms_tok_' + tok[id]; await db.collection('cache').doc(ck(BOOK + '|' + k)).set({ ns: BOOK, k, v: JSON.stringify({ role: 'kid', sid: id, pid: null, staff: null, who: null }), until, expireAt: new Date(until), at: Date.now() }); }
  /* several server copies, like the live function's warm copies */
  const srvs = Array.from({ length: COPIES }, mk); const on = i => srvs[i % COPIES];
  const stats = {}; const note = (fn, r) => { const s = stats[fn] || (stats[fn] = { n: 0, runs: [], ms: [], busy: 0, err: {} }); s.n++; s.runs.push(r.runs); s.ms.push(r.ms); if (r.error) { if (/busy/i.test(r.error)) s.busy++; else s.err[r.error] = (s.err[r.error] || 0) + 1; } return r; };
  const think = () => (THINK ? new Promise(r => setTimeout(r, Math.random() * THINK)) : null);
  const all = (fn, argsOf) => Promise.all(boys.map((id, i) => Promise.resolve(think()).then(() => on(i).run(fn, argsOf(id))).then(r => note(fn, r))));
  const view = {}; const r0 = { reads: db.stats.reads, bytes: db.stats.bytes };
  /* TEST boys pass the sound check first (PathfinderUx.js) */
  const sound = async (srv, id, o) => { if (o && o.result && o.result.pfuSound) { const r = await srv.run('pfuSoundSave', [tok[id], o.result.pfuSound.sets.map(x => x.word), 'load-test']); note('pfuSoundSave', r); } };
  /* the Pathfinder tabs already exist on the live server: let one boy open it alone first so they exist here too */
  { const w = await srvs[0].run('pfStart', [tok[boys[0]]]); assert.ok(!w.error, w.error); const a = await srvs[0].run('pfPractice', [tok[boys[0]], ['⭐', 'in', '7']]); await srvs[0].run('pfOpen', [tok[boys[0]], 'MATH']).then(o => sound(srvs[0], boys[0], o)); const o = await srvs[0].run('pfOpen', [tok[boys[0]], 'MATH']); assert.ok(o.result && o.result.cur, 'a question: ' + (o.error || '')); const q = o.result.cur.item; const x = await srvs[0].run('pfAnswer', [tok[boys[0]], { item: q.id, value: '', ms: 4000, idk: true }]); assert.ok(!x.error, x.error); }
  (await all('pfStart', id => [tok[id]])).forEach((r, i) => { view[boys[i]] = r.result; });
  await all('pfPractice', id => [tok[id], ['⭐', 'in', '7']]);
  await Promise.all((await all('pfOpen', id => [tok[id], 'MATH'])).map((r, i) => sound(on(i), boys[i], r)));
  (await all('pfOpen', id => [tok[id], 'MATH'])).forEach((r, i) => { view[boys[i]] = r.result; });
  let answered = {}; boys.forEach(id => { answered[id] = 0; }); answered[boys[0]] = 1;
  for (let round = 0; round < ROUNDS; round++) {
    const sent = {}; const res = await all('pfAnswer', id => { const v = view[id] || {}, q = (v.cur && v.cur.item) || {}; sent[id] = q.id || ''; return [tok[id], { item: q.id || '', value: '', ms: 4000, idk: true }]; });
    res.forEach((r, i) => { const id = boys[i]; if (!r.error && r.result) { if (sent[id] && !r.result.stale) answered[id]++; view[id] = r.result; } });
    /* a boy whose last call failed or who is not on a question asks where he is, like the page does */
    await Promise.all(boys.map((id, i) => { const v = view[id]; if (v && v.cur && v.cur.item) return null; return on(i).run('pfOpen', [tok[id], 'MATH']).then(r => { note('pfOpen', r); if (r.result && r.result.pfuSound) return sound(on(i), id, r).then(() => on(i).run('pfOpen', [tok[id], 'MATH'])).then(r2 => { note('pfOpen', r2); if (r2.result) view[id] = r2.result; }); if (r.result) view[id] = r.result; }); }));
  }
  console.log(`database reads during the test: ${db.stats.reads - r0.reads} documents, ${((db.stats.bytes - r0.bytes) / 1e6).toFixed(0)} MB`);
  /* double tap: every boy's same answer arrives twice at once, on two different server copies. It must count once. */
  { const sent = {}; const two = await Promise.all(boys.map((id, i) => { const v = view[id] || {}, q = (v.cur && v.cur.item) || {}; sent[id] = q.id || ''; const a = { item: q.id || '', value: '', ms: 4000, idk: true };
      return Promise.all([on(i).run('pfAnswer', [tok[id], a]), on(i + 1).run('pfAnswer', [tok[id], a])]).then(rs => { rs.forEach(r => note('pfAnswer x2', r)); return rs; }); }));
    let dbl = 0; two.forEach((rs, i) => { const id = boys[i], ok = rs.filter(r => !r.error && r.result && !r.result.stale).length; if (sent[id] && ok) answered[id]++; if (ok > 1) dbl++; });
    console.log('double taps: boys where both copies said "accepted":', dbl, '(the stored rows decide; checked below)'); }
  const pct = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
  console.log(`${N} TEST boys, ${COPIES} server copies, ${ROUNDS} answer rounds, think 0-${THINK} ms, ${OLD ? 'OLD engine (whole-tab clashes)' : 'row-merge engine'}`);
  for (const [fn, s] of Object.entries(stats)) console.log(`${fn.padEnd(11)} calls ${s.n}  reruns avg ${(s.runs.reduce((a, b) => a + b, 0) / s.n).toFixed(1)} max ${Math.max(...s.runs)}  ms p50 ${pct(s.ms, .5)} p95 ${pct(s.ms, .95)}  busy ${s.busy}` + (Object.keys(s.err).length ? '  errors ' + JSON.stringify(s.err).slice(0, 300) : ''));
  console.log('tab reads: whole tab', srvs.reduce((a, x) => a + (x.fullReads || 0), 0), '| changed blocks only', srvs.reduce((a, x) => a + (x.incReads || 0), 0));
  if (process.env.FS_WHY) { const w = {}; srvs.forEach(x => Object.entries(x.why || {}).forEach(([k, v]) => { w[k] = (w[k] || 0) + v; })); console.log('whole-tab reads by reason:', JSON.stringify(Object.entries(w).sort((a, b) => b[1] - a[1]).slice(0, 12))); }
  const cl = {}; srvs.forEach(x => Object.entries(x.clashes || {}).forEach(([k, v]) => { cl[k] = (cl[k] || 0) + v; })); console.log('restarts caused by:', JSON.stringify(cl));
  /* nothing lost or doubled: each boy has one session, and his answer rows equal the answers the server accepted */
  const fresh = mk();
  const store = { books: {}, cache: {}, read: {} }; await fresh.preload(store, [BOOK]); const T = store.books[BOOK].tabs;
  const sess = (T.PF_Sessions.rows || []).slice(1).filter(r => r[1]); const ans = (T.PF_Answers.rows || []).slice(1).filter(r => r[2]);
  let bad = 0; for (const id of boys) { const ns = sess.filter(r => String(r[1]) === id).length, na = ans.filter(r => String(r[2]) === id).length; if (ns !== 1 || na !== answered[id]) { bad++; if (bad <= 5) console.log('MISMATCH', id, 'sessions', ns, 'answer rows', na, 'accepted', answered[id]); } }
  const sum = Object.values(answered).reduce((a, b) => a + b, 0);
  console.log(`sessions ${sess.length} for ${N} boys | answer rows ${ans.length}, answers accepted ${sum} | boys with a mismatch: ${bad}`);
  const money = (T['TL Money'] ? T['TL Money'].rows : []).slice(1).filter(r => r[0]), keys = {}; let twice = 0, mine = 0; money.forEach(r => { if (/^TEST-L/.test(String(r[2]))) mine++; const k = String(r[9] || ''); if (k) { if (keys[k]) twice++; keys[k] = 1; } });
  console.log(`money rows for the load boys: ${mine} | pay-once keys used twice: ${twice}`);
  assert.strictEqual(twice, 0, 'no pay-once key is paid twice');
  assert.strictEqual(bad, 0, 'every boy has exactly one session and every accepted answer is stored once');
  assert.ok(sum > 0, 'answers were accepted');
  console.log('\nPATHFINDER LOAD TEST PASSED');
})().catch(e => { console.error('FAILED:', e.stack || e.message); process.exit(1); });
