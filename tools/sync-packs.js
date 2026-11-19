/* Copies every lesson pack listed in src/ContentPacks.js (TL_PACKS) from Google Drive into packs/<name>.html.
   Each file is fetched through the live Apps Script app (apiExport 'drive' 'file', key-protected), and kept ONLY if its
   sha256 and size match the TL_PACKS line exactly — so packs/ is byte-for-byte what the boys get.
   Run: TL_EXPORT_KEY=... node tools/sync-packs.js [EXEC_URL]     (the key is read from the environment, never printed)
   Exit code 1 if any pack could not be copied. Writes packs/SYNC-REPORT.txt. */
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..');
const EXEC = process.argv[2] || 'https://script.google.com/macros/s/AKfycbwcTw8upBIAN3n1D36TON-3u6_VQdo-6zLYJT_bMa11yeFwN9IhL_saGDciQP5QK70pEw/exec';
const KEY = process.env.TL_EXPORT_KEY; if (!KEY) { console.error('TL_EXPORT_KEY is not set.'); process.exit(1); }

const ctx = {}; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(ROOT, 'src', 'ContentPacks.js'), 'utf8'), ctx);
const PACKS = JSON.parse(vm.runInContext('JSON.stringify(TL_PACKS)', ctx));

async function call(fn, args) {
  for (let i = 0; i < 4; i++) { try {
    const r = await fetch(EXEC, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ api: 1, fn, args }), redirect: 'follow' });
    const j = await r.json(); if (!j.ok) throw new Error(String(j.error || 'error').slice(0, 200)); return j.result;
  } catch (e) { if (i === 3) throw e; await new Promise(r => setTimeout(r, 4000 * (i + 1))); } }
}

(async () => {
  const out = path.join(ROOT, 'packs'); fs.mkdirSync(out, { recursive: true });
  const report = []; let bad = 0, changed = 0;
  for (const [name, [id, sha, bytes]] of Object.entries(PACKS)) {
    const file = path.join(out, name + '.html');
    if (fs.existsSync(file)) { const have = fs.readFileSync(file); if (have.length === bytes && crypto.createHash('sha256').update(have).digest('hex') === sha) { report.push('same     ' + name); continue; } }
    try {
      const r = await call('apiExport', [KEY, 'drive', 'file', [id]]);
      const buf = Buffer.from(String(r.b64 || ''), 'base64'), h = crypto.createHash('sha256').update(buf).digest('hex');
      if (h !== sha || buf.length !== bytes) { bad++; report.push('MISMATCH ' + name + ' (Drive file ' + id + ' is ' + buf.length + ' bytes, sha ' + h.slice(0, 12) + '; table says ' + bytes + ', ' + sha.slice(0, 12) + ')'); continue; }
      fs.writeFileSync(file, buf); changed++; report.push('copied   ' + name + ' (' + bytes + ' bytes)');
    } catch (e) { bad++; report.push('FAILED   ' + name + ': ' + String(e.message || e).slice(0, 160)); }
  }
  const text = report.join('\n') + '\n\n' + Object.keys(PACKS).length + ' packs in TL_PACKS (stamp ' + vm.runInContext('TL_PACK_STAMP', ctx) + '): ' + changed + ' copied, ' + bad + ' problems.\n';
  fs.writeFileSync(path.join(out, 'SYNC-REPORT.txt'), text); console.log(text);
  process.exit(bad ? 1 : 0);
})();
