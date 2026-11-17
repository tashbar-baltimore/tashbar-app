/* Drive work on the Firebase server, tested on this machine with made-up students and a stand-in for the Apps Script app.
   Checks: a photo answer is saved once and recorded here; the 15-minute photo check applies a results file and pays once; a music file is read. Run: node server/drivetest-local.js */
const assert = require('assert'), vm = require('vm'); const { fake } = require('./fakefs.js'), { FsServer } = require('./fsstore.js'), { createRuntime } = require('./runtime.js');
(async () => {
  const db = fake(), BOOK = 'SELFTEST_D'; const calls = []; let results = [];
  const remote = async (name, args) => { calls.push(name);
    if (name === 'photoSave') return { fileId: 'FILE' + calls.length, text: 'my work 6 x 7 = 42', note: '' };
    if (name === 'photoResults') return results; if (name === 'photoDone') { results = []; return true; } if (name === 'photoWaiting') return true;
    if (name === 'fileMeta') return { name: 'song.mp3', size: 5, type: 'audio/mpeg' };
    if (name === 'file') return { name: 'song.mp3', size: 5, type: 'audio/mpeg', b64: Buffer.from('hello').toString('base64') };
    throw new Error('Not allowed.'); };
  const srv = new FsServer(db, { ns: BOOK, props: { SCHOOL_STAGING_DATABASE_ID: BOOK }, remote });
  const probe = createRuntime({ store: { books: {}, props: { SCHOOL_STAGING_DATABASE_ID: BOOK } } }); const TABLES = JSON.parse(vm.runInContext('JSON.stringify(TABLES)', probe.ctx)), kid = JSON.parse(vm.runInContext('JSON.stringify(MS.PRACTICE)', probe.ctx))[0];
  await srv.bookRef(BOOK).set({ tabs: TABLES.map(n => 'TL ' + n) }); for (const n of TABLES) { await srv.tabRef(BOOK, 'TL ' + n).set({ ver: 1, nRows: 1, per: 20, text: {} }); await srv.tabRef(BOOK, 'TL ' + n).collection('chunks').doc('c0').set({ rows: JSON.stringify([['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']]) }); }
  const R = async (fn, ...a) => { const r = await srv.run(fn, a); if (r.error) throw new Error(fn + ': ' + r.error); return r.result; };
  await R('msBootstrap'); const si = await R('msSignInCode', kid[5]); assert.ok(si.ok, 'sign-in');
  const pic = 'data:image/jpeg;base64,' + Buffer.from('fake picture').toString('base64');
  const p1 = await R('msPhotoSubmit', si.token, kid[0], 'MATH.NUM.L01.01', 'practice|What is 6 x 7?', 'What is 6 x 7?', '42', pic);
  console.log('photo with the right answer:', p1.status, '| saved to Drive', calls.filter(x => x === 'photoSave').length, 'time(s)');
  assert.strictEqual(p1.status, 'right'); assert.strictEqual(calls.filter(x => x === 'photoSave').length, 1, 'saved once');
  const p2 = await R('msPhotoSubmit', si.token, kid[0], 'MATH.NUM.L01.01', 'practice|What is 9 x 9?', 'What is 9 x 9?', '81', pic); assert.strictEqual(p2.status, 'waiting');
  const bal = async () => R('msBalanceDollars_', kid[0]); const b0 = await bal();
  results = [{ id: 'RES1', text: JSON.stringify([{ photoId: p2.photoId, mark: 'right', note: 'Right!' }]) }];
  const c1 = await R('photoCron'); const b1 = await bal(); const c2 = await R('photoCron'); const b2 = await bal();
  console.log('photo check:', JSON.stringify(c1), '| balance', b0, '->', b1, '| run again:', JSON.stringify(c2), 'balance', b2);
  assert.strictEqual(c1.applied, 1); assert.ok(b1 > b0, 'paid'); assert.strictEqual(b2, b1, 'paid once');
  const notes = await R('msPhotoNotes', si.token); assert.ok(notes.some(n => n.id === p2.photoId), 'the boy sees the note');
  const info = await R('msMusicInfo', si.token); console.log('music list:', info && info.tracks ? info.tracks.length + ' tracks' : JSON.stringify(info).slice(0, 80));
  const onApps = createRuntime({ store: { books: {}, props: {} } }); assert.strictEqual(vm.runInContext('typeof TL_REMOTE_', onApps.ctx) !== 'undefined', true);
  console.log('\nLOCAL DRIVE TEST PASSED');
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
