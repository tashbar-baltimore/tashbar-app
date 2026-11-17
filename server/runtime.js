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

/* When the store is lazy (Firestore), data is fetched only when the code first touches it: the stand-in notes what is
   missing and throws; the caller loads it and runs the function again from the start. */
function need(store, kind, key) { const e = new Error('NEED ' + kind + ' ' + key); e.__need = { kind, key }; (store.needs || (store.needs = [])).push(e.__need); throw e; }
function makeBook(store, id) {
  if (store.lazy && !store.books[id]) need(store, 'book', id);
  const book = store.books[id] || (store.books[id] = { tabs: {}, order: [] });
  const sheet = name => {
    (store.touched || (store.touched = {}))[id + '|' + name] = 1;   /* only tabs the code really opened count for clashes */
    if (store.lazy && !book.tabs[name].rows) need(store, 'tab', id + '|' + name);
    const tab = book.tabs[name]; const text = tab.text || (tab.text = {});
    const cow = () => { if (tab.shared) { tab.rows = tab.rows.map(r => r.slice()); tab.shared = false; } };   /* copy on first write: the shared copy is never changed */
    const width = () => tab.rows.reduce((a, r) => Math.max(a, r.length), 0);
    const cell = (r, c) => { const row = tab.rows[r - 1]; const v = row ? row[c - 1] : ''; return v === undefined ? '' : v; };
    const mark = r => { store.dirty[id + '|' + name] = 1; const d = store.dirtyRows || (store.dirtyRows = {}); const k = id + '|' + name; if (d[k] === undefined || r < d[k].min) (d[k] = d[k] || { min: r, rows: {} }).min = Math.min(d[k].min, r); d[k].rows[r] = 1; };
    const put = (r, c, v) => { cow(); mark(r); while (tab.rows.length < r) tab.rows.push([]); const row = tab.rows[r - 1]; while (row.length < c) row.push(''); row[c - 1] = text[c] ? (v === null || v === undefined ? '' : (typeof v === 'string' ? v : v)) : coerce(v); store.dirty[id + '|' + name] = 1; };
    const lastRow = () => { let n = tab.rows.length; while (n > 0 && tab.rows[n - 1].every(x => x === '' || x === undefined)) n--; return n; };
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
      getName: () => name, getSheetName: () => name, getLastRow: lastRow, getLastColumn: width, getMaxRows: () => Math.max(1000, tab.rows.length), getMaxColumns: () => Math.max(26, width()),
      getRange: (r, c, nr, nc) => range(r, c, nr === undefined ? 1 : nr, nc === undefined ? 1 : nc),
      getDataRange: () => range(1, 1, Math.max(1, lastRow()), Math.max(1, width())),
      appendRow(arr) { const n = lastRow() + 1; arr.forEach((v, j) => put(n, j + 1, v)); if (!arr.length) put(n, 1, ''); return self; },
      deleteRow(r) { cow(); tab.rows.splice(r - 1, 1); mark(r); (store.shifted || (store.shifted = {}))[id + '|' + name] = Math.min(r, (store.shifted[id + '|' + name] || r)); return self; },
      deleteRows(r, n) { cow(); tab.rows.splice(r - 1, n); mark(r); (store.shifted || (store.shifted = {}))[id + '|' + name] = Math.min(r, (store.shifted[id + '|' + name] || r)); return self; },
      createTextFinder(q) { let whole = false; const f = { matchEntireCell(b) { whole = !!b; return f; }, matchCase() { return f; }, findAll() { const out = []; tab.rows.forEach((row, i) => row.forEach((v, j) => { const s = String(v); if (whole ? s === String(q) : s.indexOf(String(q)) >= 0) out.push(range(i + 1, j + 1, 1, 1)); })); return out; }, findNext() { return f.findAll()[0] || null; } }; return f; }
    });
    return self;
  };
  return chain({
    getId: () => id, getName: () => 'book ' + id, getUrl: () => 'https://example.invalid/sheet/' + id,
    getSheetByName: n => (book.tabs[n] ? sheet(n) : null),
    insertSheet(n) { if (book.tabs[n]) throw new Error('A sheet with the name "' + n + '" already exists.'); book.tabs[n] = { rows: [], isNew: true }; book.order.push(n); store.dirty[id + '|' + n] = 1; (store.dirtyBooks || (store.dirtyBooks = {}))[id] = 1; return sheet(n); },
    getSheets: () => book.order.map(sheet),
    deleteSheet(s) { const n = s.getName(); delete book.tabs[n]; book.order = book.order.filter(x => x !== n); }
  });
}

const FMT = {};   /* building a date formatter is slow; build each one once */
function fmtr(tz, kind) { const k = tz + '|' + kind; return FMT[k] || (FMT[k] = kind === 'parts'
  ? new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, weekday: 'short' })
  : new Intl.DateTimeFormat('en-US', { timeZone: tz, [kind.split(':')[0]]: kind.split(':')[1] })); }
function formatDate(d, tz, f) {      /* the Java date patterns this code uses */
  d = d instanceof Date ? d : new Date(d); tz = tz || 'America/New_York';
  const p = {}; fmtr(tz, 'parts').formatToParts(d).forEach(x => { p[x.type] = x.value; });
  const long = t => fmtr(tz, t + ':long').format(d), short = t => fmtr(tz, t + ':short').format(d);
  const H = p.hour === '24' ? '00' : p.hour, h12 = ((+H + 11) % 12) + 1;
  const dow = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[p.weekday];
  return String(f).replace(/'([^']*)'|yyyy|yy|MMMM|MMM|MM|M|dd|d|EEEE|EEE|E|HH|H|hh|h|mm|ss|a|u/g, (t, lit) => lit !== undefined ? lit : ({ yyyy: p.year, yy: p.year.slice(2), MMMM: long('month'), MMM: short('month'), MM: p.month, M: String(+p.month), dd: p.day, d: String(+p.day), EEEE: long('weekday'), EEE: p.weekday, E: p.weekday, HH: H, H: String(+H), hh: ('0' + h12).slice(-2), h: String(h12), mm: p.minute, ss: p.second, a: +H < 12 ? 'AM' : 'PM', u: String(dow) }[t]));
}

/* The server code: from src/ on disk, or (when the live code has been fetched) from setCode(files). */
let COMPILED = null, CODE = null;
function setCode(files) {   /* files: [{name, type: 'SERVER_JS'|'HTML', source}] exactly as the Apps Script editor holds them */
  const js = files.filter(f => f.type === 'SERVER_JS').sort((a, b) => (a.name < b.name ? -1 : 1));
  const compiledNew = js.map(f => ({ file: f.name + '.js', script: new vm.Script(f.source, { filename: f.name + '.js' }) }));   /* throws if a file does not parse: the old code stays */
  const html = {}; files.filter(f => f.type === 'HTML').forEach(f => { html[f.name] = f.source; });
  COMPILED = compiledNew; CODE = { html };
}
function compiled() { return COMPILED || (COMPILED = fs.readdirSync(SRC).filter(x => x.endsWith('.js')).sort().map(f => ({ file: f, script: new vm.Script(fs.readFileSync(path.join(SRC, f), 'utf8'), { filename: f }) }))); }
function createRuntime(opts) {
  opts = opts || {}; const store = opts.store || { books: {}, dirty: {}, cache: {}, props: {} };
  store.dirty = store.dirty || {}; store.cache = store.cache || {}; store.props = store.props || {};
  const html = n => { if (CODE && Object.prototype.hasOwnProperty.call(CODE.html, n)) return CODE.html[n]; const p = path.join(SRC, n + '.html'); if (!fs.existsSync(p)) throw new Error('No HTML file named ' + n); return fs.readFileSync(p, 'utf8'); };
  const out = h => ({ h, setTitle() { return this; }, addMetaTag() { return this; }, setXFrameOptionsMode() { return this; }, setFaviconUrl() { return this; }, setSandboxMode() { return this; }, getContent() { return this.h; }, append(x) { this.h += x; return this; } });
  const cache = { get(k) { if (store.lazy && !(k in store.cache) && (!store.cacheComplete || /^ms_tok_/.test(k))) need(store, 'cache', k);   /* a sign-in made seconds ago on another server copy is not in this copy's 5-second list yet: look it up directly */ const e = store.cache[k]; if (!e) return null; if (e.until < Date.now()) return null; return e.v; }, put(k, v, secs) { store.cache[k] = { v: String(v), until: Date.now() + 1000 * Math.min(21600, secs || 600) }; (store.dirtyCache || (store.dirtyCache = {}))[k] = 1; }, remove(k) { store.cache[k] = null; (store.dirtyCache || (store.dirtyCache = {}))[k] = 1; },
    getAll(keys) { const o = {}; keys.forEach(k => { const v = cache.get(k); if (v !== null) o[k] = v; }); return o; }, putAll(o, secs) { Object.keys(o).forEach(k => cache.put(k, o[k], secs)); }, removeAll(keys) { keys.forEach(k => cache.remove(k)); } };
  const props = { getProperty: k => (k in store.props ? store.props[k] : null), setProperty(k, v) { store.props[k] = String(v); store.dirtyProps = 1; return props; }, deleteProperty(k) { delete store.props[k]; store.dirtyProps = 1; return props; }, getProperties: () => Object.assign({}, store.props), setProperties(o) { Object.assign(store.props, o); return props; } };
  const digest = (alg, v) => [...crypto.createHash(alg === 'MD5' ? 'md5' : alg === 'SHA_1' ? 'sha1' : 'sha256').update(typeof v === 'string' ? Buffer.from(v, 'utf8') : Buffer.from(v)).digest()].map(b => (b > 127 ? b - 256 : b));
  const nope = what => () => { throw new Error(what + ' is not available on this server yet.'); };
  const ctx = { console, JSON, Math, Date, Intl,
    SpreadsheetApp: { openById: id => makeBook(store, String(id)), flush() {}, create: nope('Creating a new spreadsheet') },
    CacheService: { getScriptCache: () => cache, getUserCache: () => cache }, LockService: { getScriptLock: () => ({ waitLock() {}, tryLock: () => true, releaseLock() {}, hasLock: () => true }) },
    PropertiesService: { getScriptProperties: () => props, getUserProperties: () => props },
    Utilities: { DigestAlgorithm: { MD5: 'MD5', SHA_1: 'SHA_1', SHA_256: 'SHA_256' }, Charset: { UTF_8: 'UTF_8' }, computeDigest: (a, v) => digest(a, v), getUuid: () => crypto.randomUUID(), formatDate, sleep() {},
      base64Encode: v => Buffer.from(typeof v === 'string' ? v : Uint8Array.from(v.map(b => b & 255))).toString('base64'), base64EncodeWebSafe: v => Buffer.from(typeof v === 'string' ? v : Uint8Array.from(v.map(b => b & 255))).toString('base64').replace(/\+/g, '-').replace(/\//g, '_'),
      base64Decode: s => [...Buffer.from(String(s), 'base64')].map(b => (b > 127 ? b - 256 : b)), base64DecodeWebSafe: s => [...Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64')].map(b => (b > 127 ? b - 256 : b)),
      computeHmacSha256Signature: (v, k) => [...crypto.createHmac('sha256', typeof k === 'string' ? k : Buffer.from(k)).update(typeof v === 'string' ? v : Buffer.from(v)).digest()].map(b => (b > 127 ? b - 256 : b)),
      newBlob: (data, type, name) => ({ getBytes: () => (typeof data === 'string' ? [...Buffer.from(data, 'utf8')] : data), getDataAsString: () => (typeof data === 'string' ? data : Buffer.from(data).toString('utf8')), getContentType: () => type, getName: () => name }) },
    HtmlService: { createHtmlOutputFromFile: n => out(html(n)), createHtmlOutput: h => out(h || ''), createTemplateFromFile: n => ({ evaluate: () => out(html(n)) }), XFrameOptionsMode: { DEFAULT: 1, ALLOWALL: 2 }, SandboxMode: { IFRAME: 1 } },
    ContentService: { createTextOutput: s => ({ s, setMimeType() { return this; }, getContent() { return this.s; } }), MimeType: { JSON: 'json', TEXT: 'text' } },
    ScriptApp: { getService: () => ({ getUrl: () => opts.appUrl || 'https://tashbar-learning-live.web.app/' }), getProjectTriggers: () => [], newTrigger: nope('Timers'), deleteTrigger() {} },
    Session: { getActiveUser: () => ({ getEmail: () => '' }), getEffectiveUser: () => ({ getEmail: () => opts.owner || '' }), getScriptTimeZone: () => 'America/New_York' },
    Logger: { log() {} }, DriveApp: { getFileById: nope('Google Drive files'), getFolderById: nope('Google Drive folders') }, Drive: {}, DocumentApp: { openById: nope('Google Docs') }, MailApp: { sendEmail: nope('Email') }, UrlFetchApp: { fetch: nope('Outside web calls') } };
  vm.createContext(ctx); const loadErrors = [];
  for (const sc of compiled()) { try { sc.script.runInContext(ctx); } catch (e) { if (e && e.__need) throw e; loadErrors.push(sc.file + ': ' + String(e).slice(0, 160)); } }
  vm.runInContext("function apiTimeOne_(fn){ var c=CacheService.getScriptCache(), tok='cmp-t'; c.put('ms_tok_'+tok, JSON.stringify({role:'staff',sid:null,pid:null,staff:null,who:{id:'CMP',name:'Comparison',role:'head'}}),600); TL_SCOPE_=null; TL_SCOPE_INFO_=null; var t=Date.now(); try{ eval(fn)(tok); }catch(e){} return Date.now()-t; }", ctx);
  if (opts.packs) { ctx.__pack = opts.packs; vm.runInContext('tlPackRead_=function(name){ return __pack(name); }; tlPackHealth_=function(){};', ctx); }
  return { ctx, store, loadErrors, has: fn => vm.runInContext('typeof ' + fn + ' === "function"', ctx),
    call(fn, args) { if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(fn)) throw new Error('bad name'); ctx.__args = JSON.parse(JSON.stringify(args || [])); return JSON.parse(vm.runInContext('JSON.stringify((function(){ var r = ' + fn + '.apply(null, __args); return r === undefined ? null : r; })())', ctx)); } };
}
module.exports = { createRuntime, coerce, formatDate, setCode };
