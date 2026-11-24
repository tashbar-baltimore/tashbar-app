/* Builds the Firebase copy of the student app FROM THE LIVE SERVER (the truth), so it always matches what is published.
   Output: web/dist/  index.html, boot.js, sw.js, page-hash.json, tools.json, parts/ (each add-on and lesson pack as a cached file).
   Run: NODE_USE_ENV_PROXY=1 node web/build.js [API_URL]   (default: the first live /exec link). Needs no local src/ or packs/. */
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const OUT = process.env.TL_OUT || path.join(__dirname, 'dist');
const API = process.argv[2] || 'https://script.google.com/macros/s/AKfycbwcTw8upBIAN3n1D36TON-3u6_VQdo-6zLYJT_bMa11yeFwN9IhL_saGDciQP5QK70pEw/exec';   /* where this build reads the live page from */
const CALLS = process.env.TL_CALLS_URL || 'https://api-q26c275eaa-uk.a.run.app';   /* where the pages send their server calls: the Firebase server function */
/* TL_FROM_REPO=1: build from the code in this repository (src/ + packs/) through the Firebase engine, not from the live
   Apps Script app. This is what lets the Apps Script editor stop being the source. OUT can be changed with TL_OUT. */
const FROM_REPO = process.env.TL_FROM_REPO === '1'; let RT = null;
async function call(fn, args) {
  if (FROM_REPO) { if (!RT) RT = require('../server/runtime.js').createRuntime({ store: { books: {}, props: {} } });
    const r = RT.call(fn, args); if (r && r.error) throw new Error(fn + ': ' + r.error); return r && r.result !== undefined ? r.result : r; }
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
  /* BUILT: one time stamp for this publish, in manifest.json, page-hash.json and the pages. boot.js drops any copy kept on a device
     that is OLDER than this publish, so no Chromebook stays on an old version (2026-11-20, moshe@ session). */
  const BUILT = Date.now();
  let bytes = 0, gz = 0;
  for (const h of parts.order) { if (!/^[A-Za-z0-9_.-]+$/.test(h)) throw new Error('Unexpected part name ' + h); const js = parts.parts[h]; fs.writeFileSync(path.join(OUT, 'parts', h + '.js'), js); bytes += Buffer.byteLength(js); gz += zlib.gzipSync(js).length; }
  fs.writeFileSync(path.join(OUT, 'parts', 'manifest.json'), JSON.stringify({ v: parts.v || 2, order: parts.order, built: BUILT }));
  fs.writeFileSync(path.join(OUT, 'tools.json'), JSON.stringify(tools));
  fs.writeFileSync(path.join(OUT, 'boot.js'), fs.readFileSync(path.join(__dirname, 'boot.js'), 'utf8').replace('__API_URL__', CALLS).replace('__APPS_URL__', API));
  fs.copyFileSync(path.join(__dirname, 'sw.js'), path.join(OUT, 'sw.js'));
  /* SHARED ART LIBRARY (HoS 2026-11-24): pictures, sounds and models come from art/ (one copy for 1.0, 2.0 and every app).
     Every library file that 1.0 names (in src/, packs/ or texts/: e.g. TL_PICS in RealPics.html, the theme tune in GameMap.html)
     is served at /pics/, /sounds/ and /models/, the same addresses as before. Without this a rebuild REMOVES them from the site. */
  { const n = require('../tools/art-use.js').copyUsed(['src', 'packs', 'texts'], OUT); console.log('art: ' + n.pics + ' pictures, ' + n.sounds + ' sounds, ' + n.models + ' models from art/'); }
  /* the screen-snapshot helper (html2canvas 1.4.1, MIT) for the Chanukah olive oil on the home screen (OilTrail.html), served at /vendor/ from our own site. */
  const VENDOR = path.join(__dirname, 'vendor'); if (fs.existsSync(VENDOR)) fs.cpSync(VENDOR, path.join(OUT, 'vendor'), { recursive: true });
  /* CORE GROWTH content store (job T): long texts (texts/<JOB>/<ID>.txt) as /texts/<ID>.json, loaded only when a boy opens one (TLCORE.text in CoreKit.html). A text with a problem stops the build. */
  { const n = require('../tools/core/texts.js').build(path.join(OUT, 'texts')); console.log('texts: ' + n); }
  fs.writeFileSync(path.join(OUT, 'page-hash.json'), JSON.stringify({ h: pageR.h, built: BUILT }));
  let page = pageR.html; const at = page.indexOf('<head>'); if (at < 0) throw new Error('no <head> in the student page');
  page = page.slice(0, at + 6) + '<meta name="viewport" content="width=device-width, initial-scale=1"><title>Tashbar Learning</title><script>window.TL_PAGE_HASH="' + pageR.h + '";window.TL_PAGE_BUILT=' + BUILT + ';</script><script src="/boot.js"></script>' + page.slice(at + 6);
  if (!/^\s*<!doctype/i.test(page)) page = '<!doctype html>\n' + page;
  fs.writeFileSync(path.join(OUT, 'index.html'), page);
  /* the staff portal, the same way */
  const st = await call('apiStaffPage', ['']); if (!st.html) throw new Error('The server did not send the staff page.');
  let sp = st.html; const sa = sp.indexOf('<head>'); if (sa < 0) throw new Error('no <head> in the staff page');
  sp = sp.slice(0, sa + 6) + '<meta name="viewport" content="width=device-width, initial-scale=1"><title>Tashbar Learning · Staff</title><script>window.TL_PAGE_KIND="staff";window.TL_PAGE_HASH="' + st.h + '";window.TL_PAGE_BUILT=' + BUILT + ';</script><script src="/boot.js"></script>' + sp.slice(sa + 6);
  if (!/^\s*<!doctype/i.test(sp)) sp = '<!doctype html>\n' + sp;
  fs.mkdirSync(path.join(OUT, 'staff'), { recursive: true }); fs.writeFileSync(path.join(OUT, 'staff', 'index.html'), sp); fs.writeFileSync(path.join(OUT, 'staff', 'page-hash.json'), JSON.stringify({ h: st.h, built: BUILT }));
  /* ALL PAGES ON FIREBASE (HoS 2026-11-19): the pages the Apps Script link still drew (canteen, sign-off, placement check, parents,
     Curriculum Preview, Spark Path, Pathfinder) are drawn once here and served as fast files at /pages/<kind>/ (apiPageHtml,
     FireBridge.js). boot.js and FireLinks.html send links there. A page that does not draw is skipped: its old link keeps working. */
  const PAGES = ['canteen', 'so', 'pl', 'pp', 'cp', 'spark', 'pf', 'pfstaff'], made = [];
  for (const k of PAGES) { try { let h = await call('apiPageHtml', [k]); if (typeof h !== 'string' || h.indexOf('TL_FIRE_ON') < 0) throw new Error('no page');
      const hi = h.search(/<head[^>]*>/i); const add = '<meta name="viewport" content="width=device-width, initial-scale=1">' + (/<title>/i.test(h) ? '' : '<title>Tashbar Learning</title>');
      if (hi >= 0) { const j = h.indexOf('>', hi) + 1; h = h.slice(0, j) + add + h.slice(j); }
      if (!/^\s*<!doctype/i.test(h)) h = '<!doctype html>\n' + h;
      fs.mkdirSync(path.join(OUT, 'pages', k), { recursive: true }); fs.writeFileSync(path.join(OUT, 'pages', k, 'index.html'), h); made.push(k);
    } catch (e) { console.warn('page ' + k + ' skipped (its old link keeps working): ' + e.message); } }
  fs.mkdirSync(path.join(OUT, 'pages'), { recursive: true }); fs.writeFileSync(path.join(OUT, 'pages', 'list.json'), JSON.stringify({ pages: made }));
  console.log('pages on Firebase: ' + (made.join(', ') || 'none'));
  console.log('built ' + OUT + ' from ' + (FROM_REPO ? 'THIS REPOSITORY' : 'the live server') + ': page ' + Math.round(Buffer.byteLength(page) / 1024) + ' KB (hash ' + pageR.h.slice(0, 8) + '), ' + parts.order.length + ' parts, ' + (bytes / 1048576).toFixed(1) + ' MB (' + (gz / 1048576).toFixed(1) + ' MB compressed); staff page ' + Math.round(st.html.length / 1024) + ' KB (hash ' + st.h.slice(0, 8) + ')');
})().catch(e => { console.error('BUILD FAILED: ' + e.message); process.exit(1); });
