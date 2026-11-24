/* SHARED ART LIBRARY (HoS 2026-11-24): which library files an app uses, and copying them into its site at build time.
   An app USES a file in art/pics, art/sounds or art/models when its file name appears in the app's own files
   (1.0: src/, packs/, texts/  e.g. TL_PICS in src/RealPics.html or '/sounds/theme.mp3' in src/GameMap.html).
   copyUsed(dirs, out) copies each used file to <out>/pics/, <out>/sounds/, <out>/models/ (the addresses the apps already use).
   art/originals is never copied (full-size originals are for re-cropping, not for the site). */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), ART = path.join(ROOT, 'art'), KINDS = ['pics', 'sounds', 'models'];
function textOf(dirs) { let all = ''; (function walk(ds) { for (const d of ds) { if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d)) { const p = path.join(d, f), s = fs.statSync(p); if (s.isDirectory()) { if (f !== 'node_modules' && f !== 'dist') walk([p]); }
    else if (/\.(html|js|css|json|txt|md)$/.test(f)) all += fs.readFileSync(p, 'utf8') + '\n'; } } })(dirs.map(d => path.isAbsolute(d) ? d : path.join(ROOT, d))); return all; }
function used(dirs) { const text = textOf(dirs), out = {};
  for (const k of KINDS) { const d = path.join(ART, k); out[k] = fs.existsSync(d) ? fs.readdirSync(d).filter(f => !f.startsWith('.') && !f.endsWith('.md') && text.includes(f)) : []; }
  return out; }
function copyUsed(dirs, out) { const u = used(dirs), n = {};
  for (const k of KINDS) { n[k] = u[k].length; if (!u[k].length) continue; fs.mkdirSync(path.join(out, k), { recursive: true });
    for (const f of u[k]) fs.copyFileSync(path.join(ART, k, f), path.join(out, k, f)); }
  return n; }
module.exports = { used, copyUsed };
