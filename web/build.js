/* STAGE 1 TRIAL: builds a static copy of the student app for a fast file host (Firebase Hosting).
   Output: web/dist/  index.html (the student page), parts/ (every add-on and lesson pack as its own cached file),
   shim.js (stands in for google.script.run: static files for the page parts, the Apps Script server for everything else).
   Run: node web/build.js [API_URL]      API_URL = the Apps Script /exec link that will answer server calls. */
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const B = require('../tests/lib/build.js');
const OUT = path.join(__dirname, 'dist'), API = process.argv[2] || '';
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(path.join(OUT, 'parts'), { recursive: true });
const K = B.kid(); if (K.loadErrors.length) { console.error(K.loadErrors); process.exit(1); }
let bytes = 0, gz = 0;
for (const h of K.parts.order) { const js = K.parts.parts[h]; fs.writeFileSync(path.join(OUT, 'parts', h + '.js'), js); bytes += Buffer.byteLength(js); gz += zlib.gzipSync(js).length; }
fs.writeFileSync(path.join(OUT, 'parts', 'manifest.json'), JSON.stringify({ v: 2, order: K.parts.order }));
fs.writeFileSync(path.join(OUT, 'tools.json'), JSON.stringify(K.tools));
const shim = fs.readFileSync(path.join(__dirname, 'shim.js'), 'utf8').replace('__API_URL__', API);
fs.writeFileSync(path.join(OUT, 'shim.js'), shim);
let page = K.page; const at = page.indexOf('<head>'); if (at < 0) throw new Error('no <head> in the student page');
page = page.slice(0, at + 6) + '<meta name="viewport" content="width=device-width, initial-scale=1"><script src="/shim.js"></script>' + page.slice(at + 6);
if (!/^\s*<!doctype/i.test(page)) page = '<!doctype html>\n' + page;
fs.writeFileSync(path.join(OUT, 'index.html'), page);
console.log('built web/dist: page ' + Math.round(Buffer.byteLength(page) / 1024) + ' KB, ' + K.parts.order.length + ' parts, ' + (bytes / 1048576).toFixed(1) + ' MB (' + (gz / 1048576).toFixed(1) + ' MB when the host compresses them), API ' + (API || '(not set)'));
