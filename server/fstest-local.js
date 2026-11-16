/* The Firestore-backed store, tested on this machine with a stand-in Firestore and made-up students. Run: node server/fstest-local.js */
const assert = require('assert'), vm = require('vm'); const { fake } = require('./fakefs.js'), { FsServer } = require('./fsstore.js'), { createRuntime } = require('./runtime.js');
(async () => {
  const db = fake(), BOOK = 'SELFTEST_1'; const mkSrv = () => new FsServer(db, { ns: BOOK, props: { SCHOOL_STAGING_DATABASE_ID: BOOK } }); let srv = mkSrv();
  const probe = createRuntime({ store: { books: {}, props: { SCHOOL_STAGING_DATABASE_ID: BOOK } } }); const TABLES = JSON.parse(vm.runInContext('JSON.stringify(TABLES)', probe.ctx)), practice = JSON.parse(vm.runInContext('JSON.stringify(MS.PRACTICE)', probe.ctx)), kid = practice[0], kid2 = practice[1];
  await srv.bookRef(BOOK).set({ tabs: TABLES.map(n => 'TL ' + n) }); for (const n of TABLES) { await srv.tabRef(BOOK, 'TL ' + n).set({ ver: 1, nRows: 1, per: 20, text: {} }); await srv.tabRef(BOOK, 'TL ' + n).collection('chunks').doc('c0').set({ rows: JSON.stringify([['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']]) }); }
  const R = async (s, fn, ...a) => { const r = await s.run(fn, a); if (process.env.V) console.log(fn, r.error || '', 'loads', r.loads, 'runs', r.runs); return r; };
  await R(srv, 'msBootstrap'); const si = (await R(srv, 'msSignInCode', kid[5])).result, si2 = (await R(srv, 'msSignInCode', kid2[5])).result; assert.ok(si.ok && si2.ok, 'sign-in');
  const mk = (k, n) => { const now = Date.now(), skill = 'MATH.NUM.L01.0' + n; return [{ id: k[0], name: k[1], skills: { [skill]: { m: true, at: now, first: true, stars: 3 } }, fails: {}, fallback: {}, balance: 0, ledger: [], flags: [], writing: {}, signoffs: {}, boss: {}, weekBonus: false, xp: 0, badges: [], worlds: ['MATH'], day: { d: '', n: 1 } },
    [0, 1, 2].map(i => ({ id: 't' + now + i + k[0], at: now + i, student: k[0], skill, phase: 'check', item: 'made-up question ' + i + ' of lesson ' + n, first: true, tries: 1, hints: 0, ms: 0, ok: true })), [{ at: now, amt: 5, why: 'Mastered ' + skill }, { at: now, amt: 999, why: 'Made-up reward that must be refused' }]]; };
  const a = mk(kid, 1); const s1 = await R(srv, 'msSave', si.token, kid[0], ...a), s2 = await R(srv, 'msSave', si.token, kid[0], ...a);
  console.log('first save balance', s1.result.balance, '| same save again', s2.result.balance); assert.strictEqual(s1.result.balance, 14.5, 'same as the in-memory run'); assert.strictEqual(s2.result.balance, s1.result.balance, 'a repeated save pays once');
  const srvB = mkSrv(), b1 = mk(kid, 2), b2 = mk(kid2, 2); const [p, q] = await Promise.all([srv.run('msSave', [si.token, kid[0], ...b1]), srvB.run('msSave', [si2.token, kid2[0], ...b2])]); assert.ok(!p.error && !q.error, (p.error || '') + (q.error || ''));
  const ALL = [3, 4, 5, 6, 7, 8].map(n => ({ n, k: n % 2 ? kid : kid2, d: mk(n % 2 ? kid : kid2, n) }));
  const many = await Promise.all(ALL.map(x => (x.n % 3 ? srv : srvB).run('msSave', [x.k === kid ? si.token : si2.token, x.k[0], ...x.d]))); assert.ok(many.every(x => !x.error), many.map(x => x.error).join());
  const fresh = mkSrv(); const l1 = (await fresh.run('msLoad', [si.token])).result.states[kid[0]], l2 = (await fresh.run('msLoad', [si2.token])).result.states[kid2[0]];
  console.log('student 1: balance', l1.balance, 'lessons', Object.keys(l1.skills).length, '| student 2: balance', l2.balance, 'lessons', Object.keys(l2.skills).length, '| reruns in the 6-at-once test:', many.map(x => x.runs).join(','));
  /* yardstick: the same saves, one at a time, on the plain in-memory store (the way Apps Script runs them) */
  const mem = { books: { M: { tabs: {}, order: [] } }, props: { SCHOOL_STAGING_DATABASE_ID: 'M' }, cache: {} }; TABLES.forEach(n => { mem.books.M.tabs['TL ' + n] = { rows: [['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']] }; mem.books.M.order.push('TL ' + n); });
  const M = (fn, ...x) => createRuntime({ store: mem }).call(fn, x); M('msBootstrap'); const m1 = M('msSignInCode', kid[5]), m2 = M('msSignInCode', kid2[5]);
  M('msSave', m1.token, kid[0], ...a); M('msSave', m1.token, kid[0], ...a); M('msSave', m1.token, kid[0], ...b1); M('msSave', m2.token, kid2[0], ...b2);
  ALL.forEach(x => M('msSave', x.k === kid ? m1.token : m2.token, x.k[0], ...x.d));
  const e1 = M('msLoad', m1.token).states[kid[0]].balance, e2 = M('msLoad', m2.token).states[kid2[0]].balance;
  console.log('yardstick (in memory, one at a time): student 1', e1, '| student 2', e2);
  assert.strictEqual(l1.balance, e1, 'student 1 balance matches the one-at-a-time run'); assert.strictEqual(l2.balance, e2, 'student 2 balance matches the one-at-a-time run');
  console.log('\nLOCAL FIRESTORE-STORE TEST PASSED');
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
