/* The same made-up-student test as selftest.js, but with the data kept in the real Firestore database, in a
   book named SELFTEST that holds nothing real. Run: node server/fstest.js <access-token-file> */
const fs = require('fs'); const assert = require('assert'); const vm = require('vm');
const { Firestore } = require('../functions/node_modules/@google-cloud/firestore'); const { OAuth2Client } = require('../functions/node_modules/google-auth-library');
const auth = new OAuth2Client(); auth.quotaProjectId = 'tashbar-learning-live'; auth.setCredentials({ access_token: fs.readFileSync(process.argv[2], 'utf8').trim() });
const db = new Firestore({ projectId: 'tashbar-learning-live', preferRest: true, authClient: auth });
const { FsServer } = require('./fsstore.js'); const { createRuntime } = require('./runtime.js');
(async () => {
  const BOOK = 'SELFTEST_' + Date.now();   /* a fresh made-up book each run */ const srv = new FsServer(db, { props: { SCHOOL_STAGING_DATABASE_ID: BOOK } });
  const probe = createRuntime({ store: { books: {}, props: { SCHOOL_STAGING_DATABASE_ID: BOOK } } });
  const TABLES = JSON.parse(vm.runInContext('JSON.stringify(TABLES)', probe.ctx)), practice = JSON.parse(vm.runInContext('JSON.stringify(MS.PRACTICE)', probe.ctx)), kid = practice[0], kid2 = practice[1];
  const batch = db.batch(); batch.set(srv.bookRef(BOOK), { tabs: TABLES.map(n => 'TL ' + n) });
  TABLES.forEach(n => { batch.set(srv.tabRef(BOOK, 'TL ' + n), { ver: 1, nRows: 1, per: 20, text: {} }); batch.set(srv.tabRef(BOOK, 'TL ' + n).collection('chunks').doc('c0'), { rows: JSON.stringify([['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']]) }); }); await batch.commit();
  const R = async (fn, ...a) => { const r = await srv.run(fn, a); console.log((fn + '            ').slice(0, 14), (r.ms + ' ms').padStart(8), 'loads', String(r.loads).padStart(2), 'runs', r.runs, r.error ? 'ERROR ' + r.error : ''); return r; };
  await R('msBootstrap'); const si = (await R('msSignInCode', kid[5])).result; assert.ok(si && si.ok, 'sign-in'); const si2 = (await R('msSignInCode', kid2[5])).result;
  const load = (await R('msLoad', si.token)).result; assert.strictEqual(load.sid, kid[0]);
  const mk = (k, n) => { const now = Date.now(), skill = 'MATH.NUM.L01.0' + n; return [{ id: k[0], name: k[1], skills: { [skill]: { m: true, at: now, first: true, stars: 3 } }, fails: {}, fallback: {}, balance: 0, ledger: [], flags: [], writing: {}, signoffs: {}, boss: {}, weekBonus: false, xp: 0, badges: [], worlds: ['MATH'], day: { d: '', n: 1 } },
    [0, 1, 2].map(i => ({ id: 't' + now + i + k[0], at: now + i, student: k[0], skill, phase: 'check', item: 'made-up question ' + i, first: true, tries: 1, hints: 0, ms: 0, ok: true })), [{ at: now, amt: 5, why: 'Mastered ' + skill }, { at: now, amt: 999, why: 'Made-up reward that must be refused' }]]; };
  const a = mk(kid, 1); const save = (await R('msSave', si.token, kid[0], a[0], a[1], a[2])).result; assert.ok(save && save.balance < 999, 'server decides the money'); console.log('   balance after first save:', save.balance);
  const again = (await R('msSave', si.token, kid[0], a[0], a[1], a[2])).result; assert.strictEqual(again.balance, save.balance, 'a repeated save pays once');
  /* two students saving at the same moment, on two separate server copies: nothing may be lost */
  const srvB = new FsServer(db, { props: { SCHOOL_STAGING_DATABASE_ID: BOOK } }); const b1 = mk(kid, 2), b2 = mk(kid2, 2);
  const [p, q] = await Promise.all([srv.run('msSave', [si.token, kid[0], b1[0], b1[1], b1[2]]), srvB.run('msSave', [si2.token, kid2[0], b2[0], b2[1], b2[2]])]);
  console.log('two saves at once ->', p.error || ('ok ' + p.ms + ' ms, runs ' + p.runs), '|', q.error || ('ok ' + q.ms + ' ms, runs ' + q.runs)); assert.ok(!p.error && !q.error);
  const fresh = new FsServer(db, { props: { SCHOOL_STAGING_DATABASE_ID: BOOK } });      /* a brand-new server copy must see everything */
  const l1 = (await fresh.run('msLoad', [si.token])).result, l2 = (await fresh.run('msLoad', [si2.token])).result;
  console.log('   student 1: balance', l1.states[kid[0]].balance, 'lessons mastered', Object.keys(l1.states[kid[0]].skills).length, '| student 2: balance', l2.states[kid2[0]].balance, 'lessons mastered', Object.keys(l2.states[kid2[0]].skills).length);
  assert.ok(l2.states[kid2[0]] && l2.states[kid2[0]].balance > 0, 'second student saved'); assert.ok(l1.states[kid[0]].balance > save.balance, 'first student second save counted');
  const bad = await R('msLoad', 'not-a-token'); assert.ok(/sign in/i.test(bad.error || ''));
  console.log('\nFIRESTORE TEST PASSED: the real sign-in, load and save code keeps its data in Firebase.'); process.exit(0);
})().catch(e => { console.error('FAILED:', e && e.stack || e); process.exit(1); });
