/* Runs the app's own Apps Script server code (src/*.js), unchanged, outside Apps Script.
   The Google services the code uses are replaced by stand-ins. The spreadsheet stand-in keeps each tab as rows in a
   "store" (in memory here; Firestore later). The code is synchronous, so a call works on tabs already in memory.
   STATUS: runs the student sign-in, load and save paths against made-up data (server/selftest.js). Not live. */
const fs = require('fs'), vm = require('vm'), path = require('path'), crypto = require('crypto');
const SRC = path.join(__dirname, '..', 'src');

/* Google Sheets changes what you type: "12" becomes 12, "TRUE" becomes true, "2026-11-16" becomes a date. */
function coerce(v) {
  if (v === undefined || v === null) return '';
  if (v instanceof Date || typeof v === 'number' || typeof v === 'boolean') return v;
  const s = String(v);
  if (s === '') return '';
  if (/^-?(\d+\.?\d*|\.\d+)$/.test(s.trim()) && s.trim().length < 16) return Number(s);
  if (/^true$/i.test(s)) return true; if (/^false$/i.test(s)) return false;
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/); if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); if (m) return new Date(+m[3], +m[1] - 1, +m[2]);
  return s;
}
const chain = o => new Proxy(o, { get: (t, k) => (k in t ? t[k] : (typeof k === 'string' && /^(set|auto|hide|show|protect|clearFormat|merge|activate|freeze)/.test(k) ? () => chain(o) : undefined)) });

function makeBook(store, id) {
  const book = store.books[id] || (store.books[id] = { tabs: {}, order: [] });
  const sheet = name => {
    const tab = book.tabs[name]; const rows = tab.rows, text = tab.text || (tab.text = {});
    const width = () => rows.reduce((a, r) => Math.max(a, r.length), 0);
    const cell = (r, c) => { const row = rows[r - 1]; const v = row ? row[c - 1] : ''; return v === undefined ? '' : v; };
    const put = (r, c, v) => { while (rows.length < r) rows.push([]); const row = rows[r - 1]; while (row.length < c) row.push(''); row[c - 1] = text[c] ? (v === null || v === undefined ? '' : (typeof v === 'string' ? v : v)) : coerce(v); store.dirty[id + '|' + name] = 1; };
    const lastRow = () => { let n = rows.length; while (n > 0 && rows[n - 1].every(x => x === '' || x === undefined)) n--; return n; };
    const range = (r, c, nr, nc) => chain({
      getRow: () => r, getColumn: () => c, getNumRows: () => nr, getNumColumns: () => nc,
      getValues: () => { const out = []; for (let i = 0; i < nr; i++) { const row = []; for (let j = 0; j < nc; j++) row.push(cell(r + i, c + j)); out.push(row); } return out; },
      getValue: () => cell(r, c),
      getDisplayValues() { return this.getValues().map(row => row.map(v => v instanceof Date ? v.toISOString() : String(v))); },
      setValues(vals) { if (vals.length !== nr || vals.some(x => x.length !== nc)) throw new Error('The number of rows or columns in the data does not match the range.'); for (let i = 0; i < nr; i++) for (let j = 0; j < nc; j++) put(r + i, c + j, vals[i][j]); return this; },
      setValue(v) { for (let i = 0; i < nr; i++) for (let j = 0; j < nc; j++) put(r + i, c + j, v); return this; },
      setNumberFormat(f) { if (f === '@') for (let j = 0; j < nc; j++) text[c + j] = 1; return this; },
      clearContent() { return this.setValue(''); }, clear() { return this.setValue(''); }
    });
    const self = chain({
      getName: () => name, getSheetName: () => name, getLastRow: lastRow, getLastColumn: width, getMaxRows: () => Math.max(1000, rows.length), getMaxColumns: () => Math.max(26, width()),
      getRange: (r, c, nr, nc) => range(r, c, nr === undefined ? 1 : nr, nc === undefined ? 1 : nc),
      getDataRange: () => range(1, 1, Math.max(1, lastRow()), Math.max(1, width())),
      appendRow(arr) { const n = lastRow() + 1; arr.forEach((v, j) => put(n, j + 1, v)); if (!arr.length) put(n, 1, ''); return self; },
      deleteRow(r) { rows.splice(r - 1, 1); store.dirty[id + '|' + name] = 1; return self; },
      deleteRows(r, n) { rows.splice(r - 1, n); store.dirty[id + '|' + name] = 1; return self; },
      createTextFinder(q) { let whole = false; const f = { matchEntireCell(b) { whole = !!b; return f; }, matchCase() { return f; }, findAll() { const out = []; rows.forEach((row, i) => row.forEach((v, j) => { const s = String(v); if (whole ? s === String(q) : s.indexOf(String(q)) >= 0) out.push(range(i + 1, j + 1, 1, 1)); })); return out; }, findNext() { return f.findAll()[0] || null; } }; return f; }
    });
    return self;
  };
  return chain({
    getId: () => id, getName: () => 'book ' + id, getUrl: () => 'https://example.invalid/sheet/' + id,
    getSheetByName: n => (book.tabs[n] ? sheet(n) : null),
    insertSheet(n) { if (book.tabs[n]) throw new Error('A sheet with the name "' + n + '" already exists.'); book.tabs[n] = { rows: [] }; book.order.push(n); store.dirty[id + '|' + n] = 1; return sheet(n); },
    getSheets: () => book.order.map(sheet),
    deleteSheet(s) { const n = s.getName(); delete book.tabs[n]; book.order = book.order.filter(x => x !== n); }
  });
}

function formatDate(d, tz, f) {      /* the Java date patterns this code uses */
  d = d instanceof Date ? d : new Date(d);
  const p = {}; new Intl.DateTimeFormat('en-US', { timeZone: tz || 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, weekday: 'short' }).formatToParts(d).forEach(x => { p[x.type] = x.value; });
  const long = t => new Intl.DateTimeFormat('en-US', { timeZone: tz || 'America/New_York', [t]: 'long' }).format(d), short = t => new Intl.DateTimeFormat('en-US', { timeZone: tz || 'America/New_York', [t]: 'short' }).format(d);
  const H = p.hour === '24' ? '00' : p.hour, h12 = ((+H + 11) % 12) + 1;
  return String(f).replace(/'([^']*)'|yyyy|yy|MMMM|MMM|MM|M|dd|d|EEEE|EEE|E|HH|H|hh|h|mm|ss|a|u/g, (t, lit) => lit !== undefined ? lit : ({ yyyy: p.year, yy: p.year.slice(2), MMMM: long('month'), MMM: short('month'), MM: p.month, M: String(+p.month), dd: p.day, d: String(+p.day), EEEE: long('weekday'), EEE: p.weekday, E: p.weekday, HH: H, H: String(+H), hh: ('0' + h12).slice(-2), h: String(h12), mm: p.minute, ss: p.second, a: +H < 12 ? 'AM' : 'PM', u: String(((new Date(d.toLocaleString('en-US', { timeZone: tz || 'America/New_York' })).getDay() + 6) % 7) + 1) }[t]));
}

function createRuntime(opts) {
  opts = opts || {}; const store = opts.store || { books: {}, dirty: {}, cache: {}, props: {} };
  store.dirty = store.dirty || {}; store.cache = store.cache || {}; store.props = store.props || {};
  const html = n => { const p = path.join(SRC, n + '.html'); if (!fs.existsSync(p)) throw new Error('No HTML file named ' + n); return fs.readFileSync(p, 'utf8'); };
  const out = h => ({ h, setTitle() { return this; }, addMetaTag() { return this; }, setXFrameOptionsMode() { return this; }, setFaviconUrl() { return this; }, setSandboxMode() { return this; }, getContent() { return this.h; }, append(x) { this.h += x; return this; } });
  const cache = { get(k) { const e = store.cache[k]; if (!e) return null; if (e.until < Date.now()) { delete store.cache[k]; return null; } return e.v; }, put(k, v, secs) { store.cache[k] = { v: String(v), until: Date.now() + 1000 * Math.min(21600, secs || 600) }; }, remove(k) { delete store.cache[k]; },
    getAll(keys) { const o = {}; keys.forEach(k => { const v = cache.get(k); if (v !== null) o[k] = v; }); return o; }, putAll(o, secs) { Object.keys(o).forEach(k => cache.put(k, o[k], secs)); }, removeAll(keys) { keys.forEach(k => delete store.cache[k]); } };
  const props = { getProperty: k => (k in store.props ? store.props[k] : null), setProperty(k, v) { store.props[k] = String(v); return props; }, deleteProperty(k) { delete store.props[k]; return props; }, getProperties: () => Object.assign({}, store.props), setProperties(o) { Object.assign(store.props, o); return props; } };
  const digest = (alg, v) => [...crypto.createHash(alg === 'MD5' ? 'md5' : alg === 'SHA_1' ? 'sha1' : 'sha256').update(typeof v === 'string' ? Buffer.from(v, 'utf8') : Buffer.from(v)).digest()].map(b => (b > 127 ? b - 256 : b));
  const need = what => () => { throw new Error(what + ' is not available on this server yet.'); };
  const ctx = { console, JSON, Math, Date, Intl,
    SpreadsheetApp: { openById: id => makeBook(store, String(id)), flush() {}, create: need('Creating a new spreadsheet') },
    CacheService: { getScriptCache: () => cache, getUserCache: () => cache }, LockService: { getScriptLock: () => ({ waitLock() {}, tryLock: () => true, releaseLock() {}, hasLock: () => true }) },
    PropertiesService: { getScriptProperties: () => props, getUserProperties: () => props },
    Utilities: { DigestAlgorithm: { MD5: 'MD5', SHA_1: 'SHA_1', SHA_256: 'SHA_256' }, Charset: { UTF_8: 'UTF_8' }, computeDigest: (a, v) => digest(a, v), getUuid: () => crypto.randomUUID(), formatDate, sleep() {},
      base64Encode: v => Buffer.from(typeof v === 'string' ? v : Uint8Array.from(v.map(b => b & 255))).toString('base64'), base64EncodeWebSafe: v => Buffer.from(typeof v === 'string' ? v : Uint8Array.from(v.map(b => b & 255))).toString('base64').replace(/\+/g, '-').replace(/\//g, '_'),
      base64Decode: s => [...Buffer.from(String(s), 'base64')].map(b => (b > 127 ? b - 256 : b)), base64DecodeWebSafe: s => [...Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64')].map(b => (b > 127 ? b - 256 : b)),
      computeHmacSha256Signature: (v, k) => [...crypto.createHmac('sha256', typeof k === 'string' ? k : Buffer.from(k)).update(typeof v === 'string' ? v : Buffer.from(v)).digest()].map(b => (b > 127 ? b - 256 : b)),
      newBlob: (data, type, name) => ({ getBytes: () => (typeof data === 'string' ? [...Buffer.from(data, 'utf8')] : data), getDataAsString: () => (typeof data === 'string' ? data : Buffer.from(data).toString('utf8')), getContentType: () => type, getName: () => name }) },
    HtmlService: { createHtmlOutputFromFile: n => out(html(n)), createHtmlOutput: h => out(h || ''), createTemplateFromFile: n => ({ evaluate: () => out(html(n)) }), XFrameOptionsMode: { DEFAULT: 1, ALLOWALL: 2 }, SandboxMode: { IFRAME: 1 } },
    ContentService: { createTextOutput: s => ({ s, setMimeType() { return this; }, getContent() { return this.s; } }), MimeType: { JSON: 'json', TEXT: 'text' } },
    ScriptApp: { getService: () => ({ getUrl: () => opts.appUrl || 'https://tashbar-learning-live.web.app/' }), getProjectTriggers: () => [], newTrigger: need('Timers'), deleteTrigger() {} },
    Session: { getActiveUser: () => ({ getEmail: () => '' }), getEffectiveUser: () => ({ getEmail: () => opts.owner || '' }), getScriptTimeZone: () => 'America/New_York' },
    Logger: { log() {} }, DriveApp: { getFileById: need('Google Drive files'), getFolderById: need('Google Drive folders') }, Drive: {}, DocumentApp: { openById: need('Google Docs') }, MailApp: { sendEmail: need('Email') }, UrlFetchApp: { fetch: need('Outside web calls') } };
  vm.createContext(ctx); const loadErrors = [];
  for (const f of fs.readdirSync(SRC).filter(x => x.endsWith('.js')).sort()) { try { vm.runInContext(fs.readFileSync(path.join(SRC, f), 'utf8'), ctx, { filename: f }); } catch (e) { loadErrors.push(f + ': ' + String(e).slice(0, 160)); } }
  if (opts.packs) { ctx.__pack = opts.packs; vm.runInContext('tlPackRead_=function(name){ return __pack(name); }; tlPackHealth_=function(){};', ctx); }
  return { ctx, store, loadErrors, has: fn => vm.runInContext('typeof ' + fn + ' === "function"', ctx),
    call(fn, args) { if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(fn)) throw new Error('bad name'); ctx.__args = JSON.parse(JSON.stringify(args || [])); return JSON.parse(vm.runInContext('JSON.stringify((function(){ var r = ' + fn + '.apply(null, __args); return r === undefined ? null : r; })())', ctx)); } };
}
module.exports = { createRuntime, coerce, formatDate };
