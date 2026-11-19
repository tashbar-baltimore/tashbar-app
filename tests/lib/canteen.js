/* Canteen on the Firebase engine (server/fsstore.js + runtime.js) with a stand-in Firestore and MADE-UP boys only.
   HoS 2026-11-19: canteen sales were failing on Firebase (the engine had no sheet.getParent / getSpreadsheetTimeZone).
   This plays a kiosk day: sign in, open, check a boy, sell, the same sale again (paid once), two kiosks at once, last sale, undo.
   Returns { fails: [...], ms: { open, sale, undo } }. */
const R = require('path').join(__dirname, '..', '..', 'server') + '/';
const { fake } = require(R + 'fakefs.js'), { FsServer } = require(R + 'fsstore.js'), { createRuntime } = require(R + 'runtime.js'), vm = require('vm');
module.exports = async function canteenDay() {
  const fails = [], ms = {}, db = fake(0), MAIN = 'SELFTEST_900001', CANT = 'SELFTEST_900002', props = { SCHOOL_STAGING_DATABASE_ID: MAIN, CANTEEN_SHEET_ID: CANT };
  const mk = () => new FsServer(db, { ns: MAIN, props, preload: true }), srv = mk();
  const probe = createRuntime({ store: { books: {}, props: {} } }), H = (s, c) => vm.runInContext('msHash_(' + JSON.stringify(s) + ',' + JSON.stringify(c) + ')', probe.ctx);
  const per = n => (/Evidence|Money|Ledger|Log|Audit|History|Throttle/i.test(n) ? 400 : 20);
  const seed = async (book, tabs) => { await srv.bookRef(book).set({ tabs: Object.keys(tabs) });
    for (const [n, rows] of Object.entries(tabs)) { const p = per(n); await srv.tabRef(book, n).set({ ver: 1, nRows: rows.length, per: p, shift: 0, incFrom: 1, text: {} });
      for (let c = 0; c * p < rows.length; c++) await srv.tabRef(book, n).collection('chunks').doc('c' + c).set({ rows: JSON.stringify(rows.slice(c * p, (c + 1) * p).map(r => r.map(v => (v instanceof Date ? { $d: v.getTime() } : v)))), v: 1 }); } };
  const boys = []; for (let i = 0; i < 40; i++) { const id = 'TESTCN' + (100 + i); boys.push([id, 'Made-up Boy ' + i, '', '', '', 'salt' + i, H('salt' + i, String(2000 + i)), true, '', 'A', 'B', i < 2 ? 'crew' : '']); }
  const wal = [['at', 'student_id', 'cents', 'kind', 'key', 'by', 'note']]; boys.forEach(b => wal.push([new Date(), b[0], 2000, 'open', 'open:' + b[0], 'system', 'made-up']));
  await seed(MAIN, { MS_Roster: [['student_id', 'name', 'math_range', 'read_range', 'writ_range', 'code_salt', 'code_hash', 'active', 'note', 'am', 'pm', 'crew']].concat(boys),
    MS_Staff: [['id', 'name', 'salt', 'hash', 'active', 'role', 'am', 'pm'], ['TK1', 'Made-up Kiosk', 'ks', H('ks', '4321'), true, 'canteen', '', '']],
    MS_State: [['student_id', 'state_json', 'updated_at', 'version']].concat(boys.map(b => [b[0], '{}', new Date(), 1])), CN_Wallet: wal });
  const hdr = [[''], [''], [''], ['h']];
  await seed(CANT, { 'Student Accounts': hdr.concat(boys.map(b => [b[0], b[1], 'A', '', '', '', '', 20])), 'Canteen Purchases': hdr.concat([['2026-11-01', boys[0][0], 'Chips', 1.5, 'Staff', 'Sale old1 · kiosk K']]),
    'Canteen Menu': [['Item ID', 'Item', 'Price $', 'Emoji', 'Pic', 'Stock', 'On'], ['M001', 'Chips', 1.5, '', '', '', true], ['M002', 'Pretzel', 1, '', '', 50, true]] });
  const run = async (s, fn, ...a) => { const t = Date.now(), r = await s.run(fn, a); r.wall = Date.now() - t; return r; };
  const si = await run(srv, 'cnKioskSignIn', '4321'); if (!si.result || !si.result.ok) return { fails: ['canteen kiosk sign-in: ' + (si.error || JSON.stringify(si.result))], ms };
  const tok = si.result.token, boot = await run(srv, 'cnKioskBoot', tok); ms.open = boot.wall; if (boot.error) fails.push('canteen kiosk open: ' + boot.error);
  const sell = async (i, s, saleId, cashier) => { s = s || srv; const ck = await run(s, 'cnKioskCheckBoy', tok, boys[i][0], String(2000 + i)); if (!ck.result || !ck.result.ok) return { error: 'boy code: ' + (ck.error || JSON.stringify(ck.result)) };
    const b = await run(s, 'cnKioskBuy', tok, ck.result.ticket, [{ id: 'M001', qty: 1 }, { id: 'M002', qty: 2 }], cashier || 'staff', saleId); return b.error ? { error: b.error } : Object.assign({ wall: b.wall }, b.result); };
  const a = await sell(5, srv, 'sale-test-0005'); ms.sale = a.wall;
  if (a.error || !a.ok) fails.push('canteen sale failed: ' + (a.error || JSON.stringify(a))); else if (Math.round(a.after * 100) !== 2000 - 350) fails.push('canteen sale: balance after is ' + a.after + ', expected 16.5');
  const again = await sell(5, srv, 'sale-test-0005'); if (again.error || !again.ok || Math.round(again.after * 100) !== 1650) fails.push('canteen: the same sale twice must charge once (got ' + JSON.stringify(again).slice(0, 120) + ')');
  const crew = await sell(6, srv, 'sale-test-0006', boys[0][0]); if (crew.error || !crew.ok) fails.push('canteen sale with a crew cashier: ' + (crew.error || JSON.stringify(crew)));
  const two = await Promise.all([sell(7, srv, 'sale-test-0007'), sell(8, mk(), 'sale-test-0008')]); two.forEach((x, j) => { if (x.error || !x.ok) fails.push('canteen: two kiosks at once, sale ' + (j + 1) + ': ' + (x.error || JSON.stringify(x))); });
  const last = await run(srv, 'cnKioskLastSale', tok); if (last.error || !last.result || !/^sale-test-000[78]$/.test(last.result.saleId)) fails.push('canteen last sale: ' + (last.error || JSON.stringify(last.result)));
  else { const v = await run(srv, 'cnKioskVoid', tok, last.result.saleId, 'made-up test'); ms.undo = v.wall; if (v.error || !v.result || !v.result.ok || Math.round(v.result.after * 100) !== 2000) fails.push('canteen undo sale: ' + (v.error || JSON.stringify(v.result))); }
  return { fails, ms };
};
