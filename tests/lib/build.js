/* Builds the pages the way the Apps Script server does, with no Google account and no real data.
   src/ is loaded into a sandbox with stand-ins for the Google services; lesson packs come from packs/. */
const fs = require('fs'), vm = require('vm'), path = require('path'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..', '..'), SRC = path.join(ROOT, 'src'), PACKS = path.join(ROOT, 'packs');

function sandbox() {
  const out = h => ({ h, setTitle() { return this; }, addMetaTag() { return this; }, setXFrameOptionsMode() { return this; }, setFaviconUrl() { return this; }, setSandboxMode() { return this; }, getContent() { return this.h; }, append(x) { this.h += x; return this; } });
  const tpl = n => ({ evaluate() { return out(read(n)); }, getRawContent() { return read(n); } });
  const read = n => { const p = path.join(SRC, n + '.html'); if (!fs.existsSync(p)) throw new Error('no file ' + n); return fs.readFileSync(p, 'utf8'); };
  const props = { getProperty: () => null, setProperty() {}, getProperties: () => ({}), deleteProperty() {} };
  const ctx = { console, JSON, Math, Date,
    HtmlService: { createHtmlOutputFromFile: n => out(read(n)), createHtmlOutput: h => out(h || ''), createTemplateFromFile: tpl, XFrameOptionsMode: { DEFAULT: 1, ALLOWALL: 2 }, SandboxMode: { IFRAME: 1 } },
    Utilities: { DigestAlgorithm: { MD5: 1, SHA_256: 2 }, Charset: { UTF_8: 1 }, computeDigest: (a, s) => [...crypto.createHash(a === 1 ? 'md5' : 'sha256').update(s).digest()], base64Encode: s => Buffer.from(s).toString('base64'), getUuid: () => crypto.randomUUID(), formatDate: () => '2026-01-01' },
    CacheService: { getScriptCache: () => ({ get: () => null, put() {}, remove() {}, getAll: () => ({}), putAll() {} }) },
    PropertiesService: { getScriptProperties: () => props, getUserProperties: () => props },
    ScriptApp: { getService: () => ({ getUrl: () => 'https://example.invalid/app' }) },
    Session: { getActiveUser: () => ({ getEmail: () => '' }), getScriptTimeZone: () => 'America/New_York' },
    LockService: { getScriptLock: () => ({ waitLock() {}, tryLock: () => true, releaseLock() {} }) },
    DriveApp: {}, Drive: {}, SpreadsheetApp: {}, ContentService: {}, MailApp: {} };
  vm.createContext(ctx);
  const loadErrors = [];
  for (const f of fs.readdirSync(SRC).filter(x => x.endsWith('.js')).sort()) {
    try { vm.runInContext(fs.readFileSync(path.join(SRC, f), 'utf8'), ctx, { filename: f }); } catch (e) { loadErrors.push(f + ': ' + String(e).slice(0, 160)); }
  }
  ctx.__pack = name => { const p = path.join(PACKS, name + '.html'); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; };
  vm.runInContext('tlPackRead_=function(name){ return __pack(name); }; tlPackHealth_=function(){};', ctx);
  return { ctx, loadErrors };
}

function packTable() {
  const src = fs.readFileSync(path.join(SRC, 'ContentPacks.js'), 'utf8'), c = {}; vm.createContext(c);
  vm.runInContext(src.slice(src.indexOf('var TL_PACKS'), src.indexOf('var TL_PACK_CHUNK')), c); return c.TL_PACKS;
}

function kid() {
  const { ctx, loadErrors } = sandbox();
  const page = vm.runInContext('sgQuest_().getContent()', ctx);
  const tools = JSON.parse(vm.runInContext('JSON.stringify(msQuestTools())', ctx));
  const parts = JSON.parse(vm.runInContext('JSON.stringify(msQuestToolsParts([]))', ctx));
  return { page, tools, parts, loadErrors };
}

function staff() {
  const { ctx, loadErrors } = sandbox();
  let page = null, error = null;
  /* The live staff portal is the Firebase page, built from apiStaffPage (web/build.js does the same). The old Apps Script
     doGet now only shows "Tashbar has moved", so it is the fallback. */
  try { page = vm.runInContext('(function(){ if (typeof apiStaffPage === "function") { var s = apiStaffPage(""); if (s && s.html) return s.html; } var r = doGet({parameter:{sg:"1"},parameters:{sg:["1"]},queryString:"sg=1"}); return r && r.getContent ? r.getContent() : null; })()', ctx); } catch (e) { error = String(e && e.stack || e).slice(0, 400); }
  return { page, error, loadErrors };
}

module.exports = { ROOT, SRC, PACKS, kid, staff, packTable, sandbox };
