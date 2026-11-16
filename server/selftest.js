/* Proves the real server code runs on the stand-ins, with made-up students only. Run: node server/selftest.js */
const { createRuntime } = require('./runtime.js'); const assert = require('assert');
const rt = createRuntime({ store: { books: {}, props: { SCHOOL_STAGING_DATABASE_ID: 'TESTBOOK' } } }); const R = (fn, ...a) => rt.call(fn, a);
assert.deepStrictEqual(rt.loadErrors, [], 'server files load');
/* the school's "TL ..." tabs exist in the real database (installTashbar made them); make empty ones here */
const TABLES = JSON.parse(require('vm').runInContext('JSON.stringify(TABLES)', rt.ctx)); const bk = rt.store.books.TESTBOOK = { tabs: {}, order: [] };
TABLES.forEach(n => { bk.tabs['TL ' + n] = { rows: [['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']] }; bk.order.push('TL ' + n); });
const boot = R('msBootstrap'); console.log('msBootstrap ->', JSON.stringify(boot).slice(0, 90));
const practice = JSON.parse(require('vm').runInContext('JSON.stringify(MS.PRACTICE)', rt.ctx)); const kid = practice[0];
const bad = R('msSignInCode', '0000'); console.log('wrong code ->', JSON.stringify(bad));
const si = R('msSignInCode', kid[5]); assert.ok(si && si.ok && si.token, 'practice student signs in'); console.log('sign-in ->', JSON.stringify({ ok: si.ok, role: si.role, sid: si.sid, token: typeof si.token }));
const load = R('msLoad', si.token); assert.strictEqual(load.sid, kid[0]); console.log('msLoad -> role', load.role, 'roster', load.roster.length, 'states', Object.keys(load.states).length);
const now = Date.now(), skill = 'MATH.NUM.L01.01';
const state = { id: kid[0], name: kid[1], skills: { [skill]: { m: true, at: now, first: true, stars: 3 } }, fails: {}, fallback: {}, balance: 0, ledger: [], flags: [], writing: {}, signoffs: {}, boss: {}, weekBonus: false, xp: 0, badges: [], worlds: ['MATH'], day: { d: '', n: 1 } };
const ev = [0, 1, 2].map(i => ({ id: 't' + now + i, at: now + i, student: kid[0], skill, phase: 'check', item: 'made-up question ' + i, first: true, tries: 1, hints: 0, ms: 0, ok: true }));
const bank = [{ at: now, amt: 5, why: 'Mastered ' + skill }, { at: now, amt: 999, why: 'Made-up reward that must be refused' }];
const save = R('msSave', si.token, kid[0], state, ev, bank); console.log('msSave ->', JSON.stringify(save).slice(0, 200));
assert.ok(typeof save.balance === 'number' && save.balance < 999, 'the server, not the page, decides the money');
const again = R('msSave', si.token, kid[0], state, ev, bank); assert.strictEqual(again.balance, save.balance, 'saving the same thing twice pays once');
const load2 = R('msLoad', si.token); assert.ok(load2.states[kid[0]] && load2.states[kid[0]].skills[skill].m, 'the saved lesson comes back'); console.log('reload -> balance', load2.states[kid[0]].balance, 'mastered', Object.keys(load2.states[kid[0]].skills).length);
let refused = ''; try { R('msLoad', 'not-a-token'); } catch (e) { refused = e.message; } assert.ok(/sign in/i.test(refused), 'a bad token is refused'); console.log('bad token ->', refused);
const tabs = Object.keys(rt.store.books.TESTBOOK.tabs); console.log('tabs created:', tabs.join(', '));
console.log('answer rows stored after saving the same 3 answers twice:', rt.store.books.TESTBOOK.tabs.MS_Evidence.rows.length - 1);
console.log('money rows:', (rt.store.books.TESTBOOK.tabs['TL Money'] || { rows: [[]] }).rows.length - 1);
console.log('\nSELF-TEST PASSED: the real sign-in, load and save code runs outside Apps Script.');
