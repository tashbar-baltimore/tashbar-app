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
let DB = null, FS = {}, LIVE = null, CODEHASH = '', CODEAT = 0;
/* Keep the server code the same as the live Apps Script editor: every 2 minutes ask Apps Script for its source
   (apiExport 'source', key-protected); if it changed, load it. A file that does not parse is refused and the old code stays. */
async function syncCode() {
  if (Date.now() - CODEAT < 120000) return; CODEAT = Date.now();
  try { const KEY = process.env.TL_EXPORT_KEY || ''; const r = await appsScriptResult('apiExport', [KEY, 'source']);
    if (r && r.files && r.hash && r.hash !== CODEHASH) { require('./app/server/runtime.js').setCode(r.files); CODEHASH = r.hash; console.log('server code updated', r.hash.slice(0, 12), r.files.length + ' files'); }
  } catch (e) { console.warn('code sync failed (old code stays):', String(e.message || e).slice(0, 200)); }
}
/* Is Firebase answering the app's calls? Read every 10 s. */
async function liveState() {
  if (LIVE && Date.now() - LIVE.at < 10000) return LIVE;
  DB = DB || new Firestore(); const d = await DB.collection('sys').doc('live').get(); const on = d.exists && d.data().on;
  const { FsServer } = require('./app/server/fsstore.js');
  await syncCode();
  if (on && (!LIVE || !LIVE.srv || LIVE.stamp !== d.data().stamp)) LIVE = { on, at: Date.now(), stamp: d.data().stamp, srv: new FsServer(DB, { ns: 'LIVE', preload: true }) };
  else LIVE = Object.assign(LIVE || {}, { on, at: Date.now() });
  return LIVE;
}
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
    const stg = new FsServer(DB, { ns: 'IMPORT_' + st.stamp, props, preload: true });
    const [A, B] = await Promise.all([appsScriptResult(fn, a.args || []), stg.run(fn, a.args || [])]);
    if (B.error) return { ok: true, result: { same: false, firebaseError: String(B.error).slice(0, 200) } };
    const diffs = []; (function walk(x, y, path) { if (diffs.length > 40) return;
      if (typeof x !== typeof y || Array.isArray(x) !== Array.isArray(y) || (x === null) !== (y === null)) { diffs.push(path + ' (type)'); return; }
      if (x && typeof x === 'object') { if (Array.isArray(x) && x.length !== y.length) diffs.push(path + ' (length ' + x.length + ' vs ' + y.length + ')');
        const ks = new Set([...Object.keys(x), ...Object.keys(y)]); for (const k of ks) { if (!(k in x) || !(k in y)) { diffs.push(path + '.' + k + ' (missing on ' + (k in x ? 'Firebase' : 'Apps Script') + ')'); continue; } walk(x[k], y[k], path + (Array.isArray(x) ? '[' + k + ']' : '.' + k)); } return; }
      if (x !== y) diffs.push(path); })(A, B.result, fn);
    return { ok: true, result: { same: !diffs.length, differences: diffs, firebaseMs: B.ms, runs: B.runs } };
  }
  if (action === 'compareBalances') {
    /* every student's balance: live ledger vs the Firebase copy. Reports counts only, never names or amounts. */
    const d = await job.get(); if (!d.exists || !d.data().finished) return { ok: false, error: 'No finished import.' }; const st = d.data();
    const live = await appsScriptResult('apiExport', [KEY, 'props']);
    const props = Object.assign({}, live, { SCHOOL_STAGING_DATABASE_ID: 'IMPORT_' + st.stamp + '__main', CANTEEN_SHEET_ID: 'IMPORT_' + st.stamp + '__canteen' });
    const stg = new FsServer(DB, { ns: 'IMPORT_' + st.stamp, props, preload: true });
    const [A, B] = await Promise.all([appsScriptResult('apiExport', [KEY, 'balances']), stg.run('apiBalances_', [])]);
    if (B.error) return { ok: true, result: { firebaseError: String(B.error).slice(0, 200) } };
    const ids = new Set([...Object.keys(A), ...Object.keys(B.result)]); let same = 0, differ = 0, onlyOne = 0, centsOff = 0;
    ids.forEach(i => { if (!(i in A) || !(i in B.result)) onlyOne++; else if (A[i] === B.result[i]) same++; else { differ++; centsOff += Math.abs(A[i] - B.result[i]); } });
    return { ok: true, result: { students: ids.size, same, differ, onlyOnOneSide: onlyOne, totalCentsApart: centsOff, firebaseMs: B.ms } };
  }
  if (action === 'comparePrints') {
    /* each student's screen, part by part, by fingerprint only. Reports counts per part, never ids or values. */
    const d = await job.get(); if (!d.exists || !d.data().finished) return { ok: false, error: 'No finished import.' }; const st = d.data();
    const live = await appsScriptResult('apiExport', [KEY, 'props']);
    const props = Object.assign({}, live, { SCHOOL_STAGING_DATABASE_ID: 'IMPORT_' + st.stamp + '__main', CANTEEN_SHEET_ID: 'IMPORT_' + st.stamp + '__canteen' });
    const stg = new FsServer(DB, { ns: 'IMPORT_' + st.stamp, props, preload: true });
    const [A, B] = await Promise.all([appsScriptResult('apiExport', [KEY, 'prints']), stg.run('apiPrints_', [])]);
    if (B.error) return { ok: true, result: { firebaseError: String(B.error).slice(0, 200) } };
    const parts = {}; let students = 0, allSame = 0;
    for (const sid of new Set([...Object.keys(A), ...Object.keys(B.result)])) { students++; const x = A[sid] || {}, y = B.result[sid] || {}; let ok = true;
      for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) { const c = parts[k] || (parts[k] = { same: 0, differ: 0, errLive: 0, errFirebase: 0 });
        if (x[k] === 'err') c.errLive++; if (y[k] === 'err') c.errFirebase++; if (x[k] === y[k]) c.same++; else { c.differ++; ok = false; } }
      if (ok) allSame++; }
    return { ok: true, result: { students, studentsFullyIdentical: allSame, parts, firebaseMs: B.ms } };
  }
  if (action === 'compareStaff') {
    const d = await job.get(); if (!d.exists || !d.data().finished) return { ok: false, error: 'No finished import.' }; const st = d.data();
    const live = await appsScriptResult('apiExport', [KEY, 'props']);
    const props = Object.assign({}, live, { SCHOOL_STAGING_DATABASE_ID: 'IMPORT_' + st.stamp + '__main', CANTEEN_SHEET_ID: 'IMPORT_' + st.stamp + '__canteen' });
    const stg = new FsServer(DB, { ns: 'IMPORT_' + st.stamp, props, preload: true });
    const [A, B] = await Promise.all([appsScriptResult('apiExport', [KEY, 'staffprints']), stg.run('apiStaffPrints_', [])]);
    if (B.error) return { ok: true, result: { firebaseError: String(B.error).slice(0, 200) } };
    const screens = {}; let same = 0;
    for (const k of new Set([...Object.keys(A), ...Object.keys(B.result)])) { const x = A[k], y = B.result[k];
      screens[k] = x === y ? (String(x).indexOf('err') === 0 ? 'same error on both' : 'same') : ((String(x).indexOf('err') === 0 ? 'live error' : 'live ok') + ' / ' + (String(y).indexOf('err') === 0 ? 'firebase error' : String(y) === 'missing' ? 'firebase missing' : 'firebase ok') + ' / different');
      if (x === y) same++; }
    return { ok: true, result: { screens: Object.keys(screens).length, same, detail: screens, firebaseMs: B.ms } };
  }
  if (action === 'timeStaff') {
    /* run each staff screen on the staging copy with a temporary internal head session; report time and reruns only */
    const d = await job.get(); const st = d.data(); const live = await appsScriptResult('apiExport', [KEY, 'props']);
    const props = Object.assign({}, live, { SCHOOL_STAGING_DATABASE_ID: 'IMPORT_' + st.stamp + '__main', CANTEEN_SHEET_ID: 'IMPORT_' + st.stamp + '__canteen' });
    const stg = new FsServer(DB, { ns: 'IMPORT_' + st.stamp, props, preload: true }); const out = {}; const t0 = Date.now();
    const names = a.only ? [a.only] : ['sgLoad','sgDesk','sgToday','sgWeek','sgMoney','sgLevels','sgKodeshGrid','sgReports','sgNotes','sgNow','sgGroups','acMyScope','stStaffOrders','tmList','tmCatalog','crCatalog','sgParshaInfo','sgPickCatalog','sgWeekNotes','sgClassSky','sbLoad','acAdminLoad'];
    for (const fn of names) { if (Date.now() - t0 > 240000) { out[fn] = 'skipped (time)'; continue; } const r = await stg.run('apiTimeOne_', [fn]); out[fn] = r.error ? 'error ' + String(r.error).slice(0, 60) : (r.ms + ' ms, runs ' + r.runs + ', loads ' + r.loads + ', inner ' + r.result + ' ms'); }
    return { ok: true, result: out };
  }
  if (action === 'goLive') {
    /* From now on the app's calls are answered by Firebase from the given import (which becomes the live database). */
    const stamp = String(a.stamp || ''); const d = await DB.collection('sys').doc('import_' + stamp).get(); if (!d.exists || !d.data().finished) return { ok: false, error: 'No finished import with that number.' };
    const live = await appsScriptResult('apiExport', [KEY, 'props']);
    const props = Object.assign({}, live, { SCHOOL_STAGING_DATABASE_ID: 'IMPORT_' + stamp + '__main', CANTEEN_SHEET_ID: 'IMPORT_' + stamp + '__canteen' });
    await DB.collection('sys').doc('props_LIVE').set({ map: props }); await DB.collection('sys').doc('live').set({ on: true, stamp, since: new Date().toISOString() }); LIVE = null;
    return { ok: true, result: { live: true, stamp } };
  }
  if (action === 'codeStatus') { CODEAT = 0; await syncCode(); return { ok: true, result: { codeHash: CODEHASH || '(from deploy)', checked: new Date(CODEAT).toISOString() } }; }
  if (action === 'goOff') { await DB.collection('sys').doc('live').set({ on: false, since: new Date().toISOString() }); LIVE = null; return { ok: true, result: { live: false } }; }
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

exports.api = onRequest({ region: 'us-east4', cors: true, memory: '4GiB', cpu: 2, timeoutSeconds: 300, secrets: ['TL_EXPORT_KEY'], maxInstances: 50, minInstances: 1 }, async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(200).json({ ok: true, result: 'Tashbar server' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body && Object.keys(req.body).length ? req.body : JSON.parse((req.rawBody || '{}').toString()));
    if (body && body.api === 1 && body.admin) return res.status(200).json(await admin(String(body.admin), String(body.key || ''), body.a || {}).catch(e => ({ ok: false, error: 'admin step failed: ' + String(e.message || e).slice(0, 300) })));
    const fn = String((body && body.fn) || '');
    if (!body || body.api !== 1 || !/^[a-z][A-Za-z0-9]*$/.test(fn)) return res.status(200).json({ ok: false, error: 'Not an app request.' });
    const args = Array.isArray(body.args) ? body.args.slice(0, 8) : [];
    if (body.fbtest) return res.status(200).json(await testLane(String(body.fbtest), fn, args));
    if (Object.prototype.hasOwnProperty.call(MOVED, fn)) return res.status(200).json({ ok: true, result: await MOVED[fn].apply(null, args) });
    const L = await liveState();
    if (L.on) { const r = await L.srv.run(fn, args);
      if (r.error && /not available on this server yet|is not defined|NEED /.test(r.error)) { /* Drive, Docs, email...: still answered by Apps Script */ return res.status(200).type('application/json').send(await appsScript(fn, args)); }
      return res.status(200).json(r.error ? { ok: false, error: r.error } : { ok: true, result: r.result === undefined ? null : r.result }); }
    res.status(200).type('application/json').send(await appsScript(fn, args));
  } catch (e) { res.status(200).json({ ok: false, error: String((e && e.message) || e).slice(0, 300) }); }
});
