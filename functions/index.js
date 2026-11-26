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
/* Google Drive work is asked of the Apps Script app (apiExport 'drive'). Drive files are kept here for 30 minutes (music, Chumash). */
const DRIVE_FILES = new Map(); let DRIVE_BYTES = 0;
async function driveRemote(name, args) {
  const KEY = process.env.TL_EXPORT_KEY || '';
  if (name !== 'file') return appsScriptResult('apiExport', [KEY, 'drive', name, args]);
  const id = String(args[0]), hit = DRIVE_FILES.get(id); if (hit && Date.now() - hit.at < 1800000) return hit.v;
  let v = null; const { Storage } = require('@google-cloud/storage'), obj = new Storage().bucket('tashbar-learning-live-backups').file('drive/' + id);
  try { const [m] = await obj.getMetadata(); if (Date.now() - new Date(m.updated).getTime() < 864e5) { const [buf] = await obj.download(); v = { name: (m.metadata || {}).name || '', size: buf.length, type: m.contentType || '', b64: buf.toString('base64') }; } } catch (e) { v = null; }   /* fast copy, refreshed daily */
  if (!v) { v = await appsScriptResult('apiExport', [KEY, 'drive', 'file', [id]]); obj.save(Buffer.from(v.b64 || '', 'base64'), { contentType: v.type || 'application/octet-stream', metadata: { metadata: { name: v.name || '' } } }).catch(() => {}); }
  const n = (v && v.b64 || '').length;
  if (n < 30e6) { DRIVE_FILES.set(id, { at: Date.now(), v, n }); DRIVE_BYTES += n; for (const [k, x] of DRIVE_FILES) { if (DRIVE_BYTES < 300e6) break; DRIVE_FILES.delete(k); DRIVE_BYTES -= x.n; } }
  return v;
}
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
  if (on && (!LIVE || !LIVE.srv || LIVE.stamp !== d.data().stamp)) LIVE = { on, at: Date.now(), stamp: d.data().stamp, srv: new FsServer(DB, { ns: 'LIVE', preload: true, remote: driveRemote }) };
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
/* SELF-BUILD (firebase builder 2026-11-18): Apps Script hit its 200-version limit, so new work could not reach the boys.
   When sys/selfbuild {on:true}, the pages and lesson pieces are built HERE from this server's own copy of the editor code (app/src,
   copied at each deploy) instead of from the Apps Script deployment's version. Any error -> the Apps Script answer, as before. */
let SELF = { on: false, at: 0 };
/* FROM GITHUB = BUILT HERE (HoS 2026-11-20: "it switches back to the old one ... a crazy amount of flashing of the old pages"). The site is
   built from THIS REPOSITORY (publish-from-github), but the page and add-ons the server handed out still came from the old Apps Script app,
   so each Chromebook opened the new page, was told it was out of date, took the OLD pieces and reloaded, over and over. When this function
   was deployed from GitHub (TL_SELFBUILD=1, set by firebase-deploy), it always builds them from its own copy of the same code. */
const SELF_FROM_DEPLOY = process.env.TL_SELFBUILD === '1';
async function selfOn() { if (SELF_FROM_DEPLOY) return true; if (Date.now() - SELF.at < 15000) return SELF.on; SELF.at = Date.now(); try { DB = DB || new Firestore(); const d = await DB.collection('sys').doc('selfbuild').get(); SELF.on = !!(d.exists && d.data().on); } catch (e) {} return SELF.on; }
async function selfRun(fn, args) { await liveState(); if (!LIVE || !LIVE.srv) throw new Error('not live'); const r = await LIVE.srv.run(fn, args); if (r.error) throw new Error(fn + ': ' + r.error); return r.result; }
async function srcOf(fn, args) { if (await selfOn()) { try { return await selfRun(fn, args); } catch (e) { console.warn('self-build failed, using Apps Script:', String(e.message || e).slice(0, 160)); } } return appsScriptResult(fn, args); }
const pageAnswer = (name) => async (have) => { const p = await shared(name, () => srcOf(name, [''])); return String(have || '') === p.h ? { h: p.h, same: true } : { h: p.h, html: p.html }; };

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
  if (action === 'sheetsCopy') {
    /* Nightly: every live tab is copied into the read-only "21 FIREBASE NIGHTLY COPY" spreadsheet (Apps Script writes it; rows travel server to server). */
    await liveState(); if (!LIVE || !LIVE.srv) return { ok: false, error: 'Not live.' };
    const SHEET = '1di5MMew_3DSbi9u2FbyyOQAADsp_A0KPHfpeMeJtdqI', pd = await DB.collection('sys').doc('props_LIVE').get(), props = pd.exists ? pd.data().map : {};
    const books = [['main', props.SCHOOL_STAGING_DATABASE_ID], ['canteen', props.CANTEEN_SHEET_ID]].filter(x => x[1]);
    const store = { books: {}, cache: {}, read: {} }; await LIVE.srv.preload(store, books.map(x => x[1]));
    const cell = v => (v == null ? '' : v instanceof Date ? v.toISOString() : typeof v === 'object' ? (v.$d ? new Date(v.$d).toISOString() : JSON.stringify(v)) : v);
    let tabs = 0, rows = 0; const t0 = Date.now();
    for (const [label, id] of books) { const bk = store.books[id]; if (!bk) continue;
      for (const t of bk.order) { const all = (bk.tabs[t].rows || []).filter(r => r && r.length).map(r => r.map(cell)); const name = (label === 'main' ? '' : 'canteen · ') + t;
        for (let i = 0; i < Math.max(all.length, 1); i += 3000) await appsScriptResult('apiExport', [KEY, 'drive', 'sheetWrite', [SHEET, name, i, all.slice(i, i + 3000), i === 0]]);
        tabs++; rows += all.length; } }
    await appsScriptResult('apiExport', [KEY, 'drive', 'sheetWrite', [SHEET, 'ℹ about this copy', 0, [['Read-only copy of the live Firebase data. Rebuilt every night. Changes here do nothing.'], ['Last copied', new Date().toISOString()], ['Tabs', tabs], ['Rows', rows]], true]]);
    return { ok: true, result: { tabs, rows, seconds: Math.round((Date.now() - t0) / 1000) } };
  }
  if (action === 'timeLive') {   /* times each staff screen on the live data with a random one-off head session (removed after); returns timings only */
    await liveState(); if (!LIVE || !LIVE.srv) return { ok: false, error: 'Not live.' }; const out = {}; const t0 = Date.now();
    const names = a.only ? [a.only] : ['sgLoad','sgNow','tmList','tmCatalog','sgDesk','sgToday','sgWeek','sgLevels','sgKodeshGrid','sgReports','sgNotes','sgGroups','acMyScope','sgWeekNotes','sgClassSky','acAdminLoad'];
    for (const fn of names) { if (Date.now() - t0 > 240000) { out[fn] = 'skipped'; continue; } const s = Date.now(); const r = await LIVE.srv.run('apiTimeOne_', [fn]); out[fn] = r.error ? 'error ' + String(r.error).slice(0, 60) : ((Date.now() - s) + ' ms total, ' + r.result + ' ms code, runs ' + r.runs + ', loads ' + r.loads); }
    return { ok: true, result: out };
  }
  if (action === 'deptCheck') { await liveState(); if (!LIVE || !LIVE.srv) return { ok: false, error: 'Not live.' }; const r = await LIVE.srv.run('apiDeptCheck_', []); return r.error ? { ok: false, error: String(r.error).slice(0, 300) } : { ok: true, result: r.result }; }
  if (action === 'selfCompare') {   /* counts and hashes only: the Apps Script answers vs the ones built here */
    const out = {};
    for (const fn of ['apiKidPage', 'apiStaffPage', 'msQuestTools', 'msQuestToolsParts']) { const args = fn === 'msQuestToolsParts' ? [[]] : fn === 'msQuestTools' ? [] : [''];
      const t0 = Date.now(); let a = null, b = null, ea = '', eb = '';
      try { a = await appsScriptResult(fn, args); } catch (e) { ea = String(e.message || e).slice(0, 120); }
      const t1 = Date.now(); try { b = await selfRun(fn, args); } catch (e) { eb = String(e.message || e).slice(0, 200); }
      const sum = x => !x ? null : fn === 'msQuestToolsParts' ? { parts: x.order.length, bytes: Object.values(x.parts).reduce((s, p) => s + p.length, 0), same: x.order.join(',') } : fn === 'msQuestTools' ? { jsBytes: (x.js || '').length, cssBytes: (x.css || '').length } : { h: x.h, bytes: (x.html || '').length };
      const A = sum(a), B = sum(b); if (A && B && A.same) { const sa = new Set(A.same.split(',')), sb = B.same.split(','); B.onlyHere = sb.filter(h => !sa.has(h)).length; B.notHere = [...sa].filter(h => sb.indexOf(h) < 0).length; delete A.same; delete B.same; }
      out[fn] = { appsScript: A || ea, here: B || eb, msHere: Date.now() - t1, msAppsScript: t1 - t0 }; }
    return { ok: true, result: out };
  }
  if (action === 'selfSet') { DB = DB || new Firestore(); await DB.collection('sys').doc('selfbuild').set({ on: !!a.on, at: new Date().toISOString() }); SELF.at = 0; Object.keys(store).forEach(k => delete store[k]); return { ok: true, result: { on: !!a.on } }; }
  if (action === 'photoCron') { await liveState(); if (!LIVE || !LIVE.srv) return { ok: false, error: 'Not live.' }; const r = await LIVE.srv.run('photoCron', []); return r.error ? { ok: false, error: String(r.error).slice(0, 200) } : { ok: true, result: r.result }; }
  /* FLAG CHECKER (HoS 2026-11-24): the hourly checker (workflow flag-checker.yml) reads the open "Report a problem" flags
     (question, reasons, boys' notes with names blanked; never an id or name) and marks each one fine / fixed / open. Reports.js rpBot*. */
  if (action === 'flagList') { await liveState(); if (!LIVE || !LIVE.srv) return { ok: false, error: 'Not live.' }; const r = await LIVE.srv.run('rpBotList_', []); return r.error ? { ok: false, error: String(r.error).slice(0, 300) } : { ok: true, result: r.result }; }
  if (action === 'flagMark') { await liveState(); if (!LIVE || !LIVE.srv) return { ok: false, error: 'Not live.' }; const r = await LIVE.srv.run('rpBotMark_', [Array.isArray(a.marks) ? a.marks.slice(0, 60) : [], Number(a.upTo) || 0]); return r.error ? { ok: false, error: String(r.error).slice(0, 300) } : { ok: true, result: r.result }; }
  if (action === 'goOff') { await DB.collection('sys').doc('live').set({ on: false, since: new Date().toISOString() }); LIVE = null; return { ok: true, result: { live: false } }; }
  return { ok: false, error: 'Unknown admin action.' };
}

const MOVED = {
  ping: async () => ({ pong: true, at: new Date().toISOString(), server: 'firebase' }),
  msQuestTools: () => shared('msQuestTools', () => srcOf('msQuestTools', [])),
  msQuestToolsParts: async (have) => {
    const all = await shared('msQuestToolsParts', async () => { const r = await srcOf('msQuestToolsParts', [[]]); if (!r || !r.order || r.order.some(h => typeof r.parts[h] !== 'string')) throw new Error('incomplete parts'); return r; });
    const got = {}; (Array.isArray(have) ? have : []).forEach(h => { got[String(h)] = 1; });
    const parts = {}; all.order.forEach(h => { if (!got[h]) parts[h] = all.parts[h]; });
    return { v: all.v || 2, order: all.order, parts };
  },
  apiKidPage: pageAnswer('apiKidPage'),
  apiStaffPage: pageAnswer('apiStaffPage')
};

/* Lesson packs: every copy loads all of them at start, in parallel, from a Cloud Storage copy (filled from Drive the first time; checked by sha256). */
async function packWarm() {
  const vm = require('vm'), crypto = require('crypto'), rt = require('./app/server/runtime.js');
  const probe = rt.createRuntime({ store: { books: {}, props: {} } }); const packs = JSON.parse(vm.runInContext('JSON.stringify(typeof TL_PACKS === "object" ? TL_PACKS : {})', probe.ctx));
  const { Storage } = require('@google-cloud/storage'); const bucket = new Storage().bucket('tashbar-learning-live-backups'); let n = 0, fromDrive = 0;
  const list = Object.keys(packs).map(k => packs[k]).filter(p => p && p[0] && p[1] && !rt.packHas(p[1]));
  const one = async p => { const f = bucket.file('packs/' + p[1] + '.txt'); let buf = null;
    try { buf = (await f.download())[0]; } catch (e) { buf = null; }
    if (!buf || crypto.createHash('sha256').update(buf).digest('hex') !== p[1]) { const v = await driveRemote('file', [p[0]]); buf = Buffer.from(v.b64, 'base64'); if (crypto.createHash('sha256').update(buf).digest('hex') !== p[1]) return; fromDrive++; f.save(buf).catch(() => {}); }
    rt.packPut(p[1], buf.toString('utf8')); n++; };
  for (let i = 0; i < list.length; i += 8) await Promise.all(list.slice(i, i + 8).map(p => one(p).catch(() => {})));
  console.log('warm: ' + n + ' of ' + list.length + ' lesson packs ready (' + fromDrive + ' from Drive)');
}
setTimeout(() => { packWarm().catch(e => console.warn('pack warm-up failed:', String(e.message || e).slice(0, 120))).then(() => liveState()).then(() => LIVE && LIVE.srv && LIVE.srv.run('msBootstrap', [])).then(() => console.log('warm: database loaded')).catch(e => console.warn('warm-up failed:', String(e.message || e).slice(0, 120))); }, 0);
/* ===== VOICE: natural, expressive speech for the whole app (Google Chirp 3 HD). GET ?tts=1&t=<text>&l=en|he&r=<rate>.
   Each phrase is made once, kept in Cloud Storage (tts/<sha>.mp3) and in memory, then reused: fast and cheap. Text up to 600 characters.
   Hebrew uses Google's Israeli-Hebrew voice FOR NOW (Head of School 2026-11-18); Litvish recordings replace it item by item. */
const TTS_VOICE = { en: 'en-US-Chirp3-HD-Puck', he: 'he-IL-Chirp3-HD-Puck' };
const TTS_MEM = new Map(); let TTS_MADE = 0, TTS_WIN = Date.now();
async function ttsToken() { const r = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', { headers: { 'Metadata-Flavor': 'Google' } }); return (await r.json()).access_token; }
async function tts(text, lang, rate) {
  const crypto = require('crypto'); lang = lang === 'he' ? 'he' : 'en'; rate = Math.max(0.75, Math.min(1.25, Number(rate) || 1));
  const voice = TTS_VOICE[lang], key = crypto.createHash('sha256').update(voice + '|' + rate.toFixed(2) + '|' + text).digest('hex');
  if (TTS_MEM.has(key)) return TTS_MEM.get(key);
  const { Storage } = require('@google-cloud/storage'), obj = new Storage().bucket('tashbar-learning-live-backups').file('tts/' + key + '.mp3');
  try { const [buf] = await obj.download(); TTS_MEM.set(key, buf); return buf; } catch (e) {}
  if (Date.now() - TTS_WIN > 600000) { TTS_WIN = Date.now(); TTS_MADE = 0; } if (++TTS_MADE > 1500) throw new Error('busy');
  const body = { input: { text }, voice: { languageCode: lang === 'he' ? 'he-IL' : 'en-US', name: voice }, audioConfig: { audioEncoding: 'MP3', speakingRate: rate } };
  const r = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', { method: 'POST', headers: { Authorization: 'Bearer ' + await ttsToken(), 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json(); if (!j.audioContent) throw new Error('voice: ' + JSON.stringify(j).slice(0, 160));
  const buf = Buffer.from(j.audioContent, 'base64'); obj.save(buf, { contentType: 'audio/mpeg' }).catch(() => {});
  if (TTS_MEM.size > 3000) TTS_MEM.delete(TTS_MEM.keys().next().value); TTS_MEM.set(key, buf); return buf;
}
/* Only the functions on the app's approved list (API_ALLOW, ApiRoute.js) may be called from a page, exactly as on Apps Script. */
let ALLOW = null;
function allowed(fn) {
  if (!ALLOW) { try { const rt = require('./app/server/runtime.js'), vm = require('vm'), fs = require('fs'), path = require('path'); const p = rt.createRuntime({ store: { books: {}, props: {} } });
      ALLOW = new Set(JSON.parse(vm.runInContext('JSON.stringify(typeof API_ALLOW !== "undefined" ? API_ALLOW : [])', p.ctx)));
      /* plus every function some page of the app calls (pages served on Firebase and the pages linked from it); editor-only tools stay blocked */
      const dir = path.join(__dirname, 'app', 'src'); const pats = [/run\(\s*'([a-z][A-Za-z0-9]*)'/g, /remote\(\s*'([a-z][A-Za-z0-9]*)'/g, /google\.script\.run(?:\.with\w+\([^)]*\))*\.([a-z][A-Za-z0-9]*)\(/g, /\.withSuccessHandler\([^)]*\)\.([a-z][A-Za-z0-9]*)\(/g, /call\(\s*'([a-z][A-Za-z0-9]*)'/g];
      fs.readdirSync(dir).filter(x => x.endsWith('.html')).forEach(x => { const s = fs.readFileSync(path.join(dir, x), 'utf8'); pats.forEach(re => { for (const m of s.matchAll(re)) ALLOW.add(m[1]); }); });
      console.log('allow list: ' + ALLOW.size + ' functions'); } catch (e) { console.error('allow list failed', e.message); ALLOW = null; return true; } }
  return ALLOW.has(fn);
}
/* KESER GIRLS 3.0 (HoS 2026-11-26): the girls' records live in their own Firestore database "keser" (M. Heinemann, choice 1).
   Only server/keser.js gets that database, and it gets nothing else: no boys' database, no boys' server code. Loaded on the first girls' call. */
let KDB = null;
const keserDb = () => KDB || (KDB = new Firestore({ databaseId: 'keser' }));
function keserIp(req) { const f = String((req.headers && req.headers['x-forwarded-for']) || '').split(',').map(x => x.trim()).filter(Boolean); return f.length ? f[f.length - 1] : String(req.ip || ''); }
async function keserCall(body, req) { return require('./app/server/keser.js').route(body, keserIp(req), keserDb, process.env.TL_EXPORT_KEY || ''); }
/* log any very large answer, by name only */
function noteSize(fn, body) { try { const n = Buffer.byteLength(body); if (n > 4e6) console.warn('large answer', fn, Math.round(n / 1e6) + ' MB'); } catch (e) {} }
exports.api = onRequest({ region: 'us-east4', cors: true, memory: '4GiB', cpu: 2, timeoutSeconds: 300, secrets: ['TL_EXPORT_KEY'], maxInstances: 50, minInstances: 1 }, async (req, res) => {
  try {
    if (req.method === 'GET' && req.query && req.query.tts) {
      const t = String(req.query.t || '').replace(/\s+/g, ' ').trim().slice(0, 600); if (!t) return res.status(400).send('no text');
      try { const buf = await tts(t, String(req.query.l || ''), req.query.r); res.set('Cache-Control', 'public, max-age=31536000, immutable'); return res.status(200).type('audio/mpeg').send(buf); }
      catch (e) { console.warn('voice failed', String(e.message || e).slice(0, 160)); return res.status(503).send('voice unavailable'); }
    }
    if (req.method !== 'POST') return res.status(200).json({ ok: true, result: 'Tashbar server' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body && Object.keys(req.body).length ? req.body : JSON.parse((req.rawBody || '{}').toString()));
    if (body && body.api === 1 && body.keser) return res.status(200).json(await keserCall(body, req));   /* Keser Girls 3.0: the girls' records only, never the boys' code or database */
    if (body && body.api === 1 && body.admin) return res.status(200).json(await admin(String(body.admin), String(body.key || ''), body.a || {}).catch(e => ({ ok: false, error: 'admin step failed: ' + String(e.message || e).slice(0, 300) })));
    const fn = String((body && body.fn) || '');
    if (!body || body.api !== 1 || !/^[a-z][A-Za-z0-9]*$/.test(fn)) return res.status(200).json({ ok: false, error: 'Not an app request.' });
    const args = Array.isArray(body.args) ? body.args.slice(0, 8) : [];
    if (body.fbtest) return res.status(200).json(await testLane(String(body.fbtest), fn, args));
    if (Object.prototype.hasOwnProperty.call(MOVED, fn)) { const j = JSON.stringify({ ok: true, result: await MOVED[fn].apply(null, args) }); noteSize(fn, j); return res.status(200).type('application/json').send(j); }
    if (!allowed(fn)) return res.status(200).json({ ok: false, error: 'Not allowed.' });   /* same approved list as the Apps Script app (API_ALLOW in ApiRoute.js) */
    const L = await liveState();
    if (L.on) { const r = await L.srv.run(fn, args);
      if (r.error && /not available on this server yet|is not defined|NEED /.test(r.error)) { /* Drive, Docs, email...: still answered by Apps Script */ return res.status(200).type('application/json').send(await appsScript(fn, args)); }
      const j = JSON.stringify(r.error ? { ok: false, error: r.error } : { ok: true, result: r.result === undefined ? null : r.result }); noteSize(fn, j); if (r.ms > 3000) console.warn('slow call', fn, r.ms + ' ms, runs ' + r.runs + ', loads ' + r.loads); return res.status(200).type('application/json').send(j); }
    console.log('passed to Apps Script:', fn); res.status(200).type('application/json').send(await appsScript(fn, args));
  } catch (e) { res.status(200).json({ ok: false, error: String((e && e.message) || e).slice(0, 300) }); }
});
