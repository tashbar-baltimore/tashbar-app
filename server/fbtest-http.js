/* Runs the made-up-student test against the LIVE Firebase server's test lane (data in Firestore, books named SELFTEST_<number>). */
const assert = require('assert'); const U = 'https://api-q26c275eaa-uk.a.run.app', BOOK = 'SELFTEST_' + Date.now();
async function C(fn, ...args) { const t = Date.now(); const r = await fetch(U, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ api: 1, fbtest: BOOK, fn, args }) }); const j = await r.json(); j.total = Date.now() - t; return j; }
const show = (name, j) => console.log((name + '                  ').slice(0, 20), ('server ' + (j.ms === undefined ? '-' : j.ms) + ' ms').padEnd(15), ('round trip ' + j.total + ' ms').padEnd(20), j.loads === undefined ? '' : 'loads ' + j.loads + ' runs ' + j.runs, j.ok ? '' : 'REFUSED: ' + j.error);
(async () => {
  const setup = await C('setupTest'); assert.ok(setup.ok, setup.error); const [kid, kid2] = setup.result.practice; show('setup', setup);
  let j = await C('msBootstrap'); show('msBootstrap', j); assert.ok(j.ok, j.error);
  const si = await C('msSignInCode', kid[5]); show('sign in', si); assert.ok(si.ok && si.result.ok, 'sign-in'); const si2 = await C('msSignInCode', kid2[5]);
  const wrong = await C('msSignInCode', '0000'); assert.ok(wrong.ok && !wrong.result.ok); show('wrong code', wrong);
  j = await C('msLoad', si.result.token); show('load student', j); assert.strictEqual(j.result.sid, kid[0]);
  const mk = (k, n) => { const now = Date.now(), skill = 'MATH.NUM.L01.0' + n; return [{ id: k[0], name: k[1], skills: { [skill]: { m: true, at: now, first: true, stars: 3 } }, fails: {}, fallback: {}, balance: 0, ledger: [], flags: [], writing: {}, signoffs: {}, boss: {}, weekBonus: false, xp: 0, badges: [], worlds: ['MATH'], day: { d: '', n: 1 } },
    [0, 1, 2].map(i => ({ id: 't' + now + i + k[0], at: now + i, student: k[0], skill, phase: 'check', item: 'made-up question ' + i, first: true, tries: 1, hints: 0, ms: 0, ok: true })), [{ at: now, amt: 5, why: 'Mastered ' + skill }, { at: now, amt: 999, why: 'Made-up reward that must be refused' }]]; };
  const a = mk(kid, 1); const save = await C('msSave', si.result.token, kid[0], ...a); show('save lesson', save); assert.ok(save.ok, save.error); assert.ok(save.result.balance < 999, 'the server decides the money');
  const again = await C('msSave', si.result.token, kid[0], ...a); show('save again (same)', again); assert.strictEqual(again.result.balance, save.result.balance, 'a repeated save pays once');
  const b1 = mk(kid, 2), b2 = mk(kid2, 2); const [p, q] = await Promise.all([C('msSave', si.result.token, kid[0], ...b1), C('msSave', si2.result.token, kid2[0], ...b2)]); show('2 saves at once: A', p); show('2 saves at once: B', q); assert.ok(p.ok && q.ok, (p.error || '') + (q.error || ''));
  const many = await Promise.all([3, 4, 5, 6, 7, 8].map(n => C('msSave', n % 2 ? si.result.token : si2.result.token, n % 2 ? kid[0] : kid2[0], ...mk(n % 2 ? kid : kid2, n)))); console.log('6 saves at once      ', many.map(x => x.ok ? x.total + ' ms (runs ' + x.runs + ')' : 'REFUSED ' + x.error).join(' | ')); assert.ok(many.every(x => x.ok));
  await C('newServer'); const l1 = await C('msLoad', si.result.token), l2 = await C('msLoad', si2.result.token); show('reload student 1', l1);
  const s1 = l1.result.states[kid[0]], s2 = l2.result.states[kid2[0]]; console.log('   student 1: balance', s1.balance, '| student 2: balance', s2.balance);
  const tally = st => { const o = {}; (st.ledger || []).forEach(x => { o[x.why] = (o[x.why] || 0) + 1; }); return Object.keys(o).sort().map(k => o[k] + 'x ' + k).join(' | '); };
  console.log('   student 1 ledger:', tally(s1)); console.log('   student 2 ledger:', tally(s2));
  assert.ok(s1.balance > save.result.balance && s2.balance > 0, 'every save counted');
  const bad = await C('msLoad', 'not-a-token'); show('bad token', bad); assert.ok(!bad.ok && /sign in/i.test(bad.error));
  const real = await fetch(U, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ api: 1, fbtest: 'REALBOOK', fn: 'msBootstrap', args: [] }) }).then(r => r.json()); assert.ok(!real.ok, 'the test lane refuses any book that is not a test book');
  console.log('\nPASSED ON FIREBASE: the real sign-in, load and save code runs on the Firebase server with its data in the Firebase database.');
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
