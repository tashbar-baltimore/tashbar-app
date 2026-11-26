/* Builds the Keser Girls 3.0 site: copies keser/app/ into keser/dist/, plus the art it names from the shared library art/. Nothing from 1.0 (src/, packs/)
   or 2.0 (v2/) is read here: Keser Girls 3.0 keeps its own copies, so a change to the boys' apps never reaches it without an approver's yes (keser/README.md).
   Run: node keser/build.js   Output: keser/dist/ */
const fs = require('fs'), path = require('path');
const APP = path.join(__dirname, 'app'), OUT = process.env.KESER_OUT || path.join(__dirname, 'dist');
fs.rmSync(OUT, { recursive: true, force: true }); fs.cpSync(APP, OUT, { recursive: true });
let n = 0;
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f);
  if (fs.statSync(p).isDirectory()) walk(p);
  else n++; } })(OUT);
/* SHARED ART LIBRARY (HoS 2026-11-24): pictures, sounds and models live once in art/ at the top of the repository, shared with 1.0
   2.0 and every app. Girls' pictures are marked "Keser Girls only" in the catalog and are never used in the boys' apps. Keser Girls 3.0 names a file as /pics/<file>, /sounds/<file> or /models/<file>; this copies just those files from art/ into
   the site. Only art is shared: its code and screens stay its own. A name that is not in the library stops the build. */
const ART = path.join(__dirname, '..', 'art'), used = new Set(), missing = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f);
  if (fs.statSync(p).isDirectory()) walk(p);
  else if (/\.(html|js|css|json)$/.test(f)) { const re = /\/(pics|sounds|models)\/([a-z0-9][a-z0-9-]*\.[a-z0-9]+)/g; let m; const t = fs.readFileSync(p, 'utf8'); while ((m = re.exec(t))) used.add(m[1] + '/' + m[2]); } } })(OUT);
for (const u of used) { const from = path.join(ART, u); if (!fs.existsSync(from)) { missing.push(u); continue; } fs.mkdirSync(path.dirname(path.join(OUT, u)), { recursive: true }); fs.copyFileSync(from, path.join(OUT, u)); n++; }
if (missing.length) { console.error('KESER GIRLS 3.0 BUILD FAILED: not in the shared art library (art/): ' + missing.join(', ')); process.exit(1); }
fs.writeFileSync(path.join(OUT, 'built.json'), JSON.stringify({ built: Date.now(), files: n, art: used.size }));
console.log('Keser Girls 3.0 built: ' + n + ' files in ' + OUT + ' (' + used.size + ' from the shared art library)');
