/* Builds the 2.0 site: copies v2/app/ into v2/dist/ (later: also each approved piece), plus the art it names from the shared library art/. Nothing from 1.0's src/ is read here:
   2.0 keeps its own copies, so a 1.0 change can never reach 2.0 without an approver's yes (v2/README.md).
   Run: node v2/build.js   Output: v2/dist/ */
const fs = require('fs'), path = require('path');
const APP = path.join(__dirname, 'app'), OUT = process.env.V2_OUT || path.join(__dirname, 'dist');
const API = process.env.V2_API_URL || 'https://api-q26c275eaa-uk.a.run.app';   /* the same school server as 1.0: same boys, codes, progress */
fs.rmSync(OUT, { recursive: true, force: true }); fs.cpSync(APP, OUT, { recursive: true });
/* game packs are kept in v2/app/games/ as the exact 1.0 pack file (one <script>); the site serves them as plain .js */
const G = path.join(OUT, 'games');
if (fs.existsSync(G)) for (const f of fs.readdirSync(G)) if (f.endsWith('.html')) {
  const t = fs.readFileSync(path.join(G, f), 'utf8'), js = t.replace(/^\s*<script>/, '').replace(/<\/script>\s*$/, '');
  if (js === t || /<\/?script/i.test(js)) throw new Error(f + ' is not a single <script> pack');
  fs.writeFileSync(path.join(G, f.replace(/\.html$/, '.js')), js); fs.rmSync(path.join(G, f)); }
let n = 0;
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f);
  if (fs.statSync(p).isDirectory()) walk(p);
  else { n++; if (/\.(html|js)$/.test(f)) { const t = fs.readFileSync(p, 'utf8'); if (t.includes('__V2_API_URL__')) fs.writeFileSync(p, t.split('__V2_API_URL__').join(API)); } } } })(OUT);
/* SHARED ART LIBRARY (HoS 2026-11-24): pictures, sounds and models live once in art/ at the top of the repository, shared with 1.0
   and every app. 2.0 names a file as /pics/<file>, /sounds/<file> or /models/<file>; this copies just those files from art/ into
   the site. Only art is shared: 2.0's code and screens stay its own. A name that is not in the library stops the build. */
const ART = path.join(__dirname, '..', 'art'), used = new Set(), missing = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f);
  if (fs.statSync(p).isDirectory()) walk(p);
  else if (/\.(html|js|css|json)$/.test(f)) { const re = /\/(pics|sounds|models)\/([a-z0-9][a-z0-9-]*\.[a-z0-9]+)/g; let m; const t = fs.readFileSync(p, 'utf8'); while ((m = re.exec(t))) used.add(m[1] + '/' + m[2]); } } })(OUT);
for (const u of used) { const from = path.join(ART, u); if (!fs.existsSync(from)) { missing.push(u); continue; } fs.mkdirSync(path.dirname(path.join(OUT, u)), { recursive: true }); fs.copyFileSync(from, path.join(OUT, u)); n++; }
if (missing.length) { console.error('2.0 BUILD FAILED: not in the shared art library (art/): ' + missing.join(', ')); process.exit(1); }
fs.writeFileSync(path.join(OUT, 'built.json'), JSON.stringify({ built: Date.now(), files: n, art: used.size }));
console.log('2.0 built: ' + n + ' files in ' + OUT + ' (' + used.size + ' from the shared art library)');
