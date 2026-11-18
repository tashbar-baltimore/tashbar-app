/* Builds the Firebase copy of the student app FROM THE LIVE SERVER (the truth), so it always matches what is published.
   Output: web/dist/  index.html, boot.js, sw.js, page-hash.json, tools.json, parts/ (each add-on and lesson pack as a cached file).
   Run: NODE_USE_ENV_PROXY=1 node web/build.js [API_URL]   (default: the first live /exec link). Needs no local src/ or packs/. */
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const OUT = path.join(__dirname, 'dist');
const API = process.argv[2] || 'https://script.google.com/macros/s/AKfycbwcTw8upBIAN3n1D36TON-3u6_VQdo-6zLYJT_bMa11yeFwN9IhL_saGDciQP5QK70pEw/exec';   /* where this build reads the live page from */
const CALLS = process.env.TL_CALLS_URL || 'https://api-q26c275eaa-uk.a.run.app';   /* where the pages send their server calls: the Firebase server function */
async function call(fn, args) {
  for (let i = 0; i < 4; i++) { try {
    const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ api: 1, fn, args }), redirect: 'follow' });
    const j = await r.json(); if (!j.ok) throw new Error(fn + ': ' + j.error); return j.result;
  } catch (e) { if (i === 3) throw e; await new Promise(r => setTimeout(r, 3000 * (i + 1))); } }
}
(async () => {
  const pageR = await call('apiKidPage', ['']), tools = await call('msQuestTools', []), parts = await call('msQuestToolsParts', [[]]);
  if (!pageR.html || !parts.order || !parts.order.length) throw new Error('The server did not send the page or the parts.');
  const missing = parts.order.filter(h => typeof parts.parts[h] !== 'string'); if (missing.length) throw new Error('The server left out ' + missing.length + ' parts.');
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(path.join(OUT, 'parts'), { recursive: true });
  let bytes = 0, gz = 0;
  for (const h of parts.order) { if (!/^[A-Za-z0-9_.-]+$/.test(h)) throw new Error('Unexpected part name ' + h); const js = parts.parts[h]; fs.writeFileSync(path.join(OUT, 'parts', h + '.js'), js); bytes += Buffer.byteLength(js); gz += zlib.gzipSync(js).length; }
  fs.writeFileSync(path.join(OUT, 'parts', 'manifest.json'), JSON.stringify({ v: parts.v || 2, order: parts.order }));
  fs.writeFileSync(path.join(OUT, 'tools.json'), JSON.stringify(tools));
  fs.writeFileSync(path.join(OUT, 'boot.js'), fs.readFileSync(path.join(__dirname, 'boot.js'), 'utf8').replace('__API_URL__', CALLS).replace('__APPS_URL__', API));
  fs.copyFileSync(path.join(__dirname, 'sw.js'), path.join(OUT, 'sw.js'));
  /* PICS-1: real pictures for lessons (RealPics.html), served at /pics/ */
  const PICS = path.join(__dirname, 'pics'); if (fs.existsSync(PICS)) fs.cpSync(PICS, path.join(OUT, 'pics'), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'page-hash.json'), JSON.stringify({ h: pageR.h }));
  let page = pageR.html; const at = page.indexOf('<head>'); if (at < 0) throw new Error('no <head> in the student page');
  page = page.slice(0, at + 6) + '<meta name="viewport" content="width=device-width, initial-scale=1"><title>Tashbar Learning</title><script>window.TL_PAGE_HASH="' + pageR.h + '";window.TL_PAGE_BUILT=' + Date.now() + ';</script><script src="/boot.js"></script>' + page.slice(at + 6);
  if (!/^\s*<!doctype/i.test(page)) page = '<!doctype html>\n' + page;
  fs.writeFileSync(path.join(OUT, 'index.html'), page);
  /* the staff portal, the same way */
  const st = await call('apiStaffPage', ['']); if (!st.html) throw new Error('The server did not send the staff page.');
  let sp = st.html; const sa = sp.indexOf('<head>'); if (sa < 0) throw new Error('no <head> in the staff page');
  sp = sp.slice(0, sa + 6) + '<meta name="viewport" content="width=device-width, initial-scale=1"><title>Tashbar Learning · Staff</title><script>window.TL_PAGE_KIND="staff";window.TL_PAGE_HASH="' + st.h + '";window.TL_PAGE_BUILT=' + Date.now() + ';</script><script src="/boot.js"></script>' + sp.slice(sa + 6);
  if (!/^\s*<!doctype/i.test(sp)) sp = '<!doctype html>\n' + sp;
  fs.mkdirSync(path.join(OUT, 'staff'), { recursive: true }); fs.writeFileSync(path.join(OUT, 'staff', 'index.html'), sp); fs.writeFileSync(path.join(OUT, 'staff', 'page-hash.json'), JSON.stringify({ h: st.h }));
  console.log('built web/dist from the live server: page ' + Math.round(Buffer.byteLength(page) / 1024) + ' KB (hash ' + pageR.h.slice(0, 8) + '), ' + parts.order.length + ' parts, ' + (bytes / 1048576).toFixed(1) + ' MB (' + (gz / 1048576).toFixed(1) + ' MB compressed); staff page ' + Math.round(st.html.length / 1024) + ' KB (hash ' + st.h.slice(0, 8) + ')');
})().catch(e => { console.error('BUILD FAILED: ' + e.message); process.exit(1); });
