/* Lesson saves when a whole class saves at once, on the Firebase engine (server/fsstore.js) with a stand-in Firestore and
   MADE-UP boys only. Before: MS_State and MS_Evidence made every save start over when ANY other boy saved at the same moment,
   so a class saving together got slow saves and "The school server is busy". Now they settle row by row, like Pathfinder and
   TL Money: another boy's save goes through side by side; the same boy's two saves still take turns.
   Proves: 16 boys on 4 server copies save 3 rounds at the same instant with no "busy" and few restarts; then each boy sends
   TWO different saves at the same instant on two copies; every accepted save's answers are stored exactly once, each boy has
   exactly one progress row, it is one of his own saves, and no pay-once key is paid twice. Returns { fails, oks }. */
const R = require('path').join(__dirname, '..', '..', 'server') + '/';
const { fake } = require(R + 'fakefs.js'), { FsServer } = require(R + 'fsstore.js'), { createRuntime } = require(R + 'runtime.js'), vm = require('vm'), crypto = require('crypto');
module.exports = async function saveLoad() {
  const fails = [], oks = [], N = 16, COPIES = 4, BOOK = 'SELFTEST_SAVELOAD', db = fake(10);
  const chk = (c, msg) => { if (!c) fails.push('class saving at once: ' + msg); return c; };
  const mk = () => new FsServer(db, { ns: BOOK, props: { SCHOOL_STAGING_DATABASE_ID: BOOK }, preload: true });
  const probe = createRuntime({ store: { books: {}, props: { SCHOOL_STAGING_DATABASE_ID: BOOK } } });
  const TABLES = JSON.parse(vm.runInContext('JSON.stringify(TABLES)', probe.ctx)), built = JSON.parse(vm.runInContext('JSON.stringify(plBuilt_())', probe.ctx));
  const ck = k => crypto.createHash('sha1').update(k).digest('hex');
  const boot = mk();
  await boot.bookRef(BOOK).set({ tabs: TABLES.map(n => 'TL ' + n) });
  for (const n of TABLES) { await boot.tabRef(BOOK, 'TL ' + n).set({ ver: 1, nRows: 1, per: 20, text: {} }); await boot.tabRef(BOOK, 'TL ' + n).collection('chunks').doc('c0').set({ rows: JSON.stringify([['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']]) }); }
  const b = await boot.run('msBootstrap', []); if (!chk(!b.error, 'bootstrap failed: ' + b.error)) return { fails, oks };
  const roster = boot.tabRef(BOOK, 'MS_Roster'), meta = (await roster.get()).data(), per = meta.per, rows = [];
  (await roster.collection('chunks').get()).forEach(c => { JSON.parse(c.data().rows).forEach((r, j) => { rows[Number(c.id.slice(1)) * per + j] = r; }); });
  const boys = []; for (let i = 1; i <= N; i++) { const id = (i % 2 ? 'TEST-SV' : 'SVMADEUP') + String(i).padStart(2, '0'); boys.push(id); rows.push([id, 'Made-up Boy ' + i, 'A', 'A', 'A', 'x', 'x', true, 'grade 4 · made up']); }
  for (let c = 0; c * per < rows.length; c++) await roster.collection('chunks').doc('c' + c).set({ rows: JSON.stringify(rows.slice(c * per, (c + 1) * per)) });
  await roster.set({ ver: meta.ver + 1, nRows: rows.length, per, text: meta.text || {} });
  const tok = {}, until = Date.now() + 3600e3;
  for (const id of boys) { tok[id] = 'tok-' + id; const k = 'ms_tok_' + tok[id]; await db.collection('cache').doc(ck(BOOK + '|' + k)).set({ ns: BOOK, k, v: JSON.stringify({ role: 'kid', sid: id, pid: null, staff: null, who: null }), until, expireAt: new Date(until), at: Date.now() }); }
  const srvs = Array.from({ length: COPIES }, mk), on = i => srvs[i % COPIES];
  const pool = ['READ.', 'MATH.', 'LANG.'].map(p => built.filter(x => x.indexOf(p) === 0)), okSaves = {}, marks = {};
  boys.forEach(id => { okSaves[id] = 0; marks[id] = []; });
  let q = 0, busy = 0, errs = [];
  const save = (i, id, skill, mark) => { const ev = [0, 1, 2].map(() => ({ skill, phase: 'check', item: 'c' + (++q), ok: true, first: true, at: Date.now() }));
    return on(i).run('msSave', [tok[id], id, { id, skills: {}, mark }, ev, [{ why: 'Mastered ' + skill, amt: 10 }]]).then(r => {
      if (r.error) { if (/busy/i.test(r.error)) busy++; else errs.push(r.error); } else { okSaves[id]++; marks[id].push(mark); } return r; }); };
  /* warm-up: the first save creates tabs (on the live server they exist already) */
  { const r = await save(0, boys[0], pool[0][0], 'w'); chk(!r.error, 'a single save failed: ' + r.error); }
  srvs.forEach(x => { x.clashes = {}; });
  for (let round = 0; round < 3; round++) await Promise.all(boys.map((id, i) => save(i, id, pool[round][(i + round * 5) % pool[round].length], 'r' + round)));
  const cl = {}; srvs.forEach(x => Object.entries(x.clashes || {}).forEach(([k, v]) => { cl[k] = (cl[k] || 0) + v; }));
  chk(!busy && !errs.length, 'saves must not be refused when boys save together (busy ' + busy + ', errors ' + JSON.stringify(errs.slice(0, 2)) + ')');
  chk(!cl.MS_State && !cl.MS_Evidence, "another boy's save must not make a save start over (restarts: " + JSON.stringify(cl) + ')');
  /* the same boy, two different saves at the same instant on two server copies: both kept, nothing lost, nothing doubled */
  await Promise.all(boys.map((id, i) => Promise.all([save(i, id, pool[0][(i + 30) % pool[0].length], 'x'), save(i + 1, id, pool[1][(i + 30) % pool[1].length], 'y')])));
  chk(!busy && !errs.length, 'a double save must not be refused (busy ' + busy + ', errors ' + JSON.stringify(errs.slice(0, 2)) + ')');
  const store = { books: {}, cache: {}, read: {} }; await mk().preload(store, [BOOK]); const T = store.books[BOOK].tabs;
  const st = (T.MS_State.rows || []).slice(1).filter(r => r[0]), ev = (T.MS_Evidence.rows || []).slice(1).filter(r => r[1]);
  let bad = 0, wrong = 0;
  for (const id of boys) { const mine = st.filter(r => String(r[0]) === id), ne = ev.filter(r => String(r[1]) === id).length;
    if (mine.length !== 1 || ne !== 3 * okSaves[id]) { bad++; if (bad <= 3) fails.push('class saving at once: ' + id + ' has ' + mine.length + ' progress row(s) and ' + ne + ' answer rows for ' + okSaves[id] + ' saves'); }
    else { let m = ''; try { m = JSON.parse(mine[0][1]).mark; } catch (e) {} if (m !== 'x' && m !== 'y') wrong++; } }
  chk(!wrong, 'after a double save his progress row must be one of his own two saves (' + wrong + ' boys were not)');
  const money = (T['TL Money'] ? T['TL Money'].rows : []).slice(1).filter(r => r[0]), keys = {}; let twice = 0;
  money.forEach(r => { const k = String(r[9] || ''); if (k) { if (keys[k]) twice++; keys[k] = 1; } });
  chk(!twice, 'no pay-once key may be paid twice (' + twice + ')');
  if (!fails.length) oks.push('class saving at once (Firebase engine): ' + N + ' made-up boys on ' + COPIES + ' copies, no "busy", no restarts from other boys; a double save keeps both, every answer stored once, one progress row each, no double pay');
  return { fails, oks };
};
