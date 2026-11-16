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

exports.api = onRequest({ region: 'us-east4', cors: true, memory: '1GiB', timeoutSeconds: 300, maxInstances: 50, minInstances: 1 }, async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(200).json({ ok: true, result: 'Tashbar server' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body && Object.keys(req.body).length ? req.body : JSON.parse((req.rawBody || '{}').toString()));
    const fn = String((body && body.fn) || '');
    if (!body || body.api !== 1 || !/^[a-z][A-Za-z0-9]*$/.test(fn)) return res.status(200).json({ ok: false, error: 'Not an app request.' });
    const args = Array.isArray(body.args) ? body.args.slice(0, 8) : [];
    if (body.fbtest) return res.status(200).json(await testLane(String(body.fbtest), fn, args));
    if (Object.prototype.hasOwnProperty.call(MOVED, fn)) return res.status(200).json({ ok: true, result: await MOVED[fn].apply(null, args) });
    res.status(200).type('application/json').send(await appsScript(fn, args));
  } catch (e) { res.status(200).json({ ok: false, error: String((e && e.message) || e).slice(0, 300) }); }
});
