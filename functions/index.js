/* Tashbar server on Firebase (Stage 2). One HTTPS function, "api".
   A call is answered HERE if its name is in MOVED; every other call is passed through to the Apps Script server
   unchanged. Functions move here one at a time.
   MOVED so far (no student data in any of them):
     ping                  health check
     msQuestTools          the add-on loader
     msQuestToolsParts     "which lesson pieces are current, and send me the ones I lack"
     apiKidPage            "is my student page current?"
     apiStaffPage          "is my staff page current?"
   These are the calls every device makes when it opens the app. They are the same for everyone, so this server
   asks Apps Script once every 2 minutes and answers all devices from memory. A new publish is seen within 2 minutes. */
const { onRequest } = require('firebase-functions/v2/https');
const { Firestore } = require('@google-cloud/firestore');
const vm = require('vm');
let DB = null, FS = {};
/* TEST LANE: the app's own server code running here with its data in Firestore, in made-up books named SELFTEST_<number>.
   It cannot touch real data: the book name is forced, and real calls never take this path. */
async function testLane(book, fn, args) {
  if (!/^SELFTEST_[0-9]{6,}$/.test(book)) return { ok: false, error: 'Test books are named SELFTEST_<number>.' };
  const { FsServer } = require('./app/server/fsstore.js'), { createRuntime } = require('./app/server/runtime.js');
  DB = DB || new Firestore(); const srv = FS[book] || (FS[book] = new FsServer(DB, { ns: book, props: { SCHOOL_STAGING_DATABASE_ID: book } }));
  if (fn === 'setupTest') { const probe = createRuntime({ store: { books: {}, props: { SCHOOL_STAGING_DATABASE_ID: book } } });
    const TABLES = JSON.parse(vm.runInContext('JSON.stringify(TABLES)', probe.ctx)), practice = JSON.parse(vm.runInContext('JSON.stringify(MS.PRACTICE)', probe.ctx));
    const batch = DB.batch(); batch.set(srv.bookRef(book), { tabs: TABLES.map(n => 'TL ' + n) });
    TABLES.forEach(n => { batch.set(srv.tabRef(book, 'TL ' + n), { ver: 1, nRows: 1, per: 20, text: {} }); batch.set(srv.tabRef(book, 'TL ' + n).collection('chunks').doc('c0'), { rows: JSON.stringify([['Record ID', 'Record JSON', 'Updated at (UTC)', 'Updated by']]) }); });
    await batch.commit(); return { ok: true, result: { practice: practice.slice(0, 3) } }; }
  if (fn === 'newServer') { FS[book] = new FsServer(DB, { ns: book, props: { SCHOOL_STAGING_DATABASE_ID: book } }); return { ok: true, result: true }; }
  let r; try { r = await srv.run(fn, args); } catch (e) { return { ok: false, error: 'server step failed: ' + String(e.message || e).slice(0, 400) }; }
  return r.error ? { ok: false, error: r.error, ms: r.ms, loads: r.loads, runs: r.runs } : { ok: true, result: r.result, ms: r.ms, loads: r.loads, runs: r.runs };
}
const APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbwcTw8upBIAN3n1D36TON-3u6_VQdo-6zLYJT_bMa11yeFwN9IhL_saGDciQP5QK70pEw/exec';
const TTL = 120000;

async function appsScript(fn, args) {
  const r = await fetch(APPS_SCRIPT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ api: 1, fn, args: args || [] }), redirect: 'follow' });
  return r.text();
}
async function appsScriptResult(fn, args) { const j = JSON.parse(await appsScript(fn, args)); if (!j.ok) throw new Error(j.error || 'Server error'); return j.result; }

/* one shared copy per name: refreshed at most every TTL, one refresh at a time, and the old copy is kept if a refresh fails */
const store = {};
function shared(name, load) {
  const s = store[name] || (store[name] = { at: 0, value: undefined, busy: null });
  const fresh = Date.now() - s.at < TTL;
  if (s.value !== undefined && fresh) return Promise.resolve(s.value);
  if (!s.busy) s.busy = load().then(v => { s.value = v; s.at = Date.now(); s.busy = null; return v; }, e => { s.busy = null; if (s.value !== undefined) return s.value; throw e; });
  return s.value !== undefined ? Promise.resolve(s.value) : s.busy;   /* serve the old copy while a refresh runs */
}
const pageAnswer = (name) => async (have) => { const p = await shared(name, () => appsScriptResult(name, [''])); return String(have || '') === p.h ? { h: p.h, same: true } : { h: p.h, html: p.html }; };

/* ADMIN LANE: copying the school's records from Apps Script into Firestore, server to server. Every call must carry
   the export key (kept in Secret Manager as tl-export-key; the function gets it as the environment value TL_EXPORT_KEY).
   Records are stored under a STAGING book name (IMPORT_<stamp>__main / __canteen). Nothing reads them for real calls.
   Replies carry counts and yes/no only, never the records themselves. */
const crypto = require('crypto');
const md5 = t => crypto.createHash('md5').update(t, 'utf8').digest('hex');
async function admin(action, key, a) {
  const KEY = process.env.TL_EXPORT_KEY || ''; if (!KEY || !key || key.length !== KEY.length || !crypto.timingSafeEqual(Buffer.from(String(key)), Buffer.from(KEY))) return { ok: false, error: 'Not allowed.' };
  const { FsServer } = require('./app/server/fsstore.js'); DB = DB || new Firestore(); const srv = new FsServer(DB, {});
  const job = DB.collection('sys').doc('import_' + String(a.stamp || '').replace(/[^0-9A-Za-z_]/g, ''));
  if (action === 'importStart') { const stamp = String(Date.now()); const books = {};
    for (const b of ['main', 'canteen']) { const t = await appsScriptResult('apiExport', [KEY, 'tabs', b]); books[b] = t.tabs.map(x => ({ name: x.name, rows: x.rows, cols: x.cols, next: 1, per: 0, done: x.rows < 1, blocks: 0, bad: 0 })); }
    await DB.collection('sys').doc('import_' + stamp).set({ stamp, started: new Date().toISOString(), books });
    return { ok: true, result: { stamp, tabs: { main: books.main.length, canteen: books.canteen.length }, rows: { main: books.main.reduce((n, x) => n + x.rows, 0), canteen: books.canteen.reduce((n, x) => n + x.rows, 0) } } }; }
  if (action === 'importStep') { const d = await job.get(); if (!d.exists) return { ok: false, error: 'No such import.' }; const st = d.data(); const t0 = Date.now(); let moved = 0;
    for (const b of ['main', 'canteen']) for (const tab of st.books[b]) { const book = 'IMPORT_' + st.stamp + '__' + b;
      while (!tab.done && Date.now() - t0 < 200000) {
        const want = tab.per && tab.per < 50 ? 400 : 3000; const r = await appsScriptResult('apiExport', [KEY, 'rows', b, tab.name, [tab.next, want]]); const body = JSON.stringify(r.rows);
        if (md5(body) !== r.sum && r.rows.length) tab.bad++;
        if (!tab.per) { const biggest = r.rows.reduce((m, row) => Math.max(m, JSON.stringify(row).length), 1); tab.per = Math.max(1, Math.min(400, Math.floor(600000 / biggest))); tab.text = r.text || {}; }
        if ((tab.next - 1) % tab.per !== 0) throw new Error('import is out of step on ' + tab.name);
        const last = r.rows.length < want || tab.next + r.rows.length > r.last;                    /* nothing after this batch */
        const use = last ? r.rows.length : Math.floor(r.rows.length / tab.per) * tab.per;           /* keep whole blocks; the tail is fetched again next time */
        if (!last && use < 1) throw new Error('rows of ' + tab.name + ' are too large for one block');
        for (let i = 0; i < use; i += tab.per) { const slice = r.rows.slice(i, Math.min(use, i + tab.per)); const c = Math.floor((tab.next - 1 + i) / tab.per); const txt = JSON.stringify(slice); if (txt.length > 950000) throw new Error('a block of ' + tab.name + ' is too large'); await srv.tabRef(book, tab.name).collection('chunks').doc('c' + c).set({ rows: txt, sum: md5(txt) }); tab.blocks++; }
        moved += use; tab.next += use;
        if (last) { tab.done = true; tab.got = tab.next - 1; await srv.tabRef(book, tab.name).set({ ver: 1, nRows: tab.got, per: tab.per, text: tab.text || {} }); }
      }
      if (!tab.done) { await job.set(st); return { ok: true, result: { done: false, movedRows: moved, at: b + ' / tab ' + (st.books[b].indexOf(tab) + 1) + ' of ' + st.books[b].length } }; } }
    for (const b of ['main', 'canteen']) await srv.bookRef('IMPORT_' + st.stamp + '__' + b).set({ tabs: st.books[b].map(x => x.name), ver: 1 });
    st.finished = new Date().toISOString(); await job.set(st); return { ok: true, result: { done: true, movedRows: moved } }; }
  if (action === 'importReport') { const d = await job.get(); if (!d.exists) return { ok: false, error: 'No such import.' }; const st = d.data(); const out = {};
    for (const b of ['main', 'canteen']) { const tabs = st.books[b]; out[b] = { tabs: tabs.length, done: tabs.filter(x => x.done).length, rowsExpected: tabs.reduce((n, x) => n + x.rows, 0), rowsStored: tabs.reduce((n, x) => n + (x.got || 0), 0), blocks: tabs.reduce((n, x) => n + x.blocks, 0), blocksWithBadChecksum: tabs.reduce((n, x) => n + x.bad, 0), tabsWhereCountsDiffer: tabs.filter(x => x.done && (x.got || 0) !== x.rows).map(x => x.name + ' ' + x.rows + '->' + (x.got || 0)) }; }
    return { ok: true, result: { stamp: st.stamp, finished: st.finished || null, books: out } }; }
  if (action === 'compare') {
    /* Run one READ-ONLY call on live Apps Script and on the staging copy; report only whether they match and,
       if not, the paths that differ. Never the values. */
    const SAFE = { msBootstrap: 1 }; const fn = String(a.fn || ''); if (!SAFE[fn]) return { ok: false, error: 'Only read-only calls may be compared.' };
    const d = await job.get(); if (!d.exists || !d.data().finished) return { ok: false, error: 'No finished import.' }; const st = d.data();
    const live = await appsScriptResult('apiExport', [KEY, 'props']);
    const props = Object.assign({}, live, { SCHOOL_STAGING_DATABASE_ID: 'IMPORT_' + st.stamp + '__main', CANTEEN_SHEET_ID: 'IMPORT_' + st.stamp + '__canteen' });
    const stg = new FsServer(DB, { ns: 'IMPORT_' + st.stamp, props });
    const [A, B] = await Promise.all([appsScriptResult(fn, a.args || []), stg.run(fn, a.args || [])]);
    if (B.error) return { ok: true, result: { same: false, firebaseError: String(B.error).slice(0, 200) } };
    const diffs = []; (function walk(x, y, path) { if (diffs.length > 40) return;
      if (typeof x !== typeof y || Array.isArray(x) !== Array.isArray(y) || (x === null) !== (y === null)) { diffs.push(path + ' (type)'); return; }
      if (x && typeof x === 'object') { if (Array.isArray(x) && x.length !== y.length) diffs.push(path + ' (length ' + x.length + ' vs ' + y.length + ')');
        const ks = new Set([...Object.keys(x), ...Object.keys(y)]); for (const k of ks) { if (!(k in x) || !(k in y)) { diffs.push(path + '.' + k + ' (missing on ' + (k in x ? 'Firebase' : 'Apps Script') + ')'); continue; } walk(x[k], y[k], path + (Array.isArray(x) ? '[' + k + ']' : '.' + k)); } return; }
      if (x !== y) diffs.push(path); })(A, B.result, fn);
    return { ok: true, result: { same: !diffs.length, differences: diffs, firebaseMs: B.ms, runs: B.runs } };
  }
  return { ok: false, error: 'Unknown admin action.' };
}

const MOVED = {
  ping: async () => ({ pong: true, at: new Date().toISOString(), server: 'firebase' }),
  msQuestTools: () => shared('msQuestTools', () => appsScriptResult('msQuestTools', [])),
  msQuestToolsParts: async (have) => {
    const all = await shared('msQuestToolsParts', async () => { const r = await appsScriptResult('msQuestToolsParts', [[]]); if (!r || !r.order || r.order.some(h => typeof r.parts[h] !== 'string')) throw new Error('incomplete parts'); return r; });
    const got = {}; (Array.isArray(have) ? have : []).forEach(h => { got[String(h)] = 1; });
    const parts = {}; all.order.forEach(h => { if (!got[h]) parts[h] = all.parts[h]; });
    return { v: all.v || 2, order: all.order, parts };
  },
  apiKidPage: pageAnswer('apiKidPage'),
  apiStaffPage: pageAnswer('apiStaffPage')
};

exports.api = onRequest({ region: 'us-east4', cors: true, memory: '1GiB', timeoutSeconds: 300, secrets: ['TL_EXPORT_KEY'], maxInstances: 50, minInstances: 1 }, async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(200).json({ ok: true, result: 'Tashbar server' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body && Object.keys(req.body).length ? req.body : JSON.parse((req.rawBody || '{}').toString()));
    if (body && body.api === 1 && body.admin) return res.status(200).json(await admin(String(body.admin), String(body.key || ''), body.a || {}).catch(e => ({ ok: false, error: 'admin step failed: ' + String(e.message || e).slice(0, 300) })));
    const fn = String((body && body.fn) || '');
    if (!body || body.api !== 1 || !/^[a-z][A-Za-z0-9]*$/.test(fn)) return res.status(200).json({ ok: false, error: 'Not an app request.' });
    const args = Array.isArray(body.args) ? body.args.slice(0, 8) : [];
    if (body.fbtest) return res.status(200).json(await testLane(String(body.fbtest), fn, args));
    if (Object.prototype.hasOwnProperty.call(MOVED, fn)) return res.status(200).json({ ok: true, result: await MOVED[fn].apply(null, args) });
    res.status(200).type('application/json').send(await appsScript(fn, args));
  } catch (e) { res.status(200).json({ ok: false, error: String((e && e.message) || e).slice(0, 300) }); }
});
