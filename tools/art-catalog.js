#!/usr/bin/env node
/* SHARED ART LIBRARY (HoS 2026-11-24): builds art/CATALOG.md, one row per piece of art, for 1.0, 2.0 and every future app.
   Run:   node tools/art-catalog.js              rebuild art/CATALOG.md (re-run any time; it keeps hand-written rows and cells)
          node tools/art-catalog.js --branches   also list art that sits on other branches and is not in the library yet
          node tools/art-catalog.js --check      only check (exit 1 on a problem); node tests/run.js runs the same check
   What it does:
   - lists every file in art/pics, art/originals, art/sounds and art/models (a picture's original has the same name as its
     app-ready file: pics/x.webp + originals/x.jpg are ONE item, id "x");
   - fills empty cells from what the apps already know: alt text, source, licence and author from TL_PICS (src/RealPics.html),
     which screens show it from TL_PIC_MAP (question screens and the PICS-2 teaching keys of src/RealPicsTeach.html), texts
     (texts/: "pic:"), any 1.0 file in src/ or packs/ or 2.0 file in v2/app/ that names the file, and the date it first came in (git);
   - lists art that is packed inside code or a lesson pack (data:image / data:audio) as "cataloged, not moved";
   - KEEPS what a person wrote: a cell that already has text is never overwritten. Only the "used by" cell is refreshed
     (its "1.0 ..." and "2.0 ..." parts are re-counted; anything else a person wrote there stays).
   Checks (also in node tests/run.js, tests/lib/art.js): every file has a row; every row's file exists; every item has a source,
   a licence and alt text; size limits (pics: WebP or JPEG, at most 1,100 px wide and 200 KB; originals: JPEG or PNG, at most
   1.5 MB; sounds 2 MB; models 10 MB); short lowercase file names; no file in the library twice (same bytes). */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), vm = require('vm'), cp = require('child_process');
const ROOT = path.join(__dirname, '..'), ART = path.join(ROOT, 'art'), CAT = path.join(ART, 'CATALOG.md');
const KINDS = ['pics', 'originals', 'sounds', 'models'];
const LIMIT = { pics: 200 * 1024, originals: 1.5 * 1024 * 1024, sounds: 2 * 1024 * 1024, models: 10 * 1024 * 1024 }, MAX_W = 1100;
const EXT = { pics: /\.(webp|jpe?g)$/, originals: /\.(jpe?g|png)$/, sounds: /\.(mp3|ogg|wav|m4a)$/, models: /\.(glb|gltf|obj|usdz)$/ };
const COLS = ['id', 'files', 'shows', 'cast', 'band', 'source', 'licence', 'author', 'ordered / made by', 'used by', 'date', 'alt', 'sha256'];
const HEAD = { id: 'id', files: 'files', shows: 'what it shows', cast: 'characters', band: 'band', source: 'source', licence: 'licence', author: 'author',
  'ordered / made by': 'ordered / made by', 'used by': 'used by (app: screens)', date: 'date', alt: 'alt text', sha256: 'sha256 (first 12)' };
const AUTO_USE = /^(1\.0|2\.0)\b|^picture ids:/;

const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const cell = s => String(s == null ? '' : s).replace(/\r?\n/g, ' ').replace(/\|/g, '/').replace(/\s+/g, ' ').trim();
const read = p => { try { return fs.readFileSync(p, 'utf8'); } catch (e) { return ''; } };
const listDir = d => fs.existsSync(d) ? fs.readdirSync(d).filter(f => !f.startsWith('.') && fs.statSync(path.join(d, f)).isFile()) : [];

/* ---------- the catalog file ---------- */
function parseCatalog(text) {
  const rows = [], order = [];
  for (const line of String(text || '').split('\n')) {
    if (!/^\|/.test(line) || /^\|\s*-/.test(line)) continue;
    const c = line.replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map(s => s.trim());
    if (c[0] === HEAD.id || c[0] === 'id') { order.length = 0; c.forEach(h => order.push(Object.keys(HEAD).find(k => HEAD[k] === h) || h)); continue; }
    const r = {}; (order.length ? order : COLS).forEach((k, i) => { r[k] = c[i] || ''; }); if (r.id) rows.push(r);
  }
  return rows;
}
const filesOf = r => String(r.files || '').split(/\s*[,;]\s*/).map(s => s.replace(/`/g, '').trim()).filter(Boolean);
const where = r => { const f = String(r.files || ''); if (/^\s*`?in /.test(f)) return 'repo'; if (/^\s*`?on branch/.test(f)) return 'branch'; return 'art'; };

/* ---------- what the apps know ---------- */
function loadPics() {
  const ctx = { addEventListener() {}, requestAnimationFrame() {}, document: { head: { insertAdjacentHTML() {} } } }; ctx.window = ctx; vm.createContext(ctx);
  for (const f of ['RealPics.html', 'RealPicsTeach.html']) { const t = read(path.join(ROOT, 'src', f)); if (!t) continue;
    try { vm.runInContext(t.replace(/^\s*<script>/, '').replace(/<\/script>\s*$/, ''), ctx); } catch (e) { /* RealPicsTeach needs a page; its keys live in TL_PIC_MAP anyway */ } }
  return { lib: ctx.TL_PICS || {}, map: ctx.TL_PIC_MAP || {} };
}
function legacySources() {   /* web/pics/SOURCES.md (before the move) — "- file | source | licence | author" */
  const out = {}; for (const p of ['web/pics/SOURCES.md', 'art/pics/SOURCES.md']) for (const l of read(path.join(ROOT, p)).split('\n')) {
    const m = l.match(/^- ([^|]+?) \| (.*?) \| (.*?) \| (.*)$/); if (m) out[m[1].trim()] = { source: m[2], licence: m[3], author: m[4] }; }
  return out;
}
function band(ids) { const b = new Set(); for (const id of ids) { const m = String(id).match(/\.L0?(\d)(?:\.|$)/); if (!m) continue; const n = +m[1];
  b.add(n <= 2 ? 'K1' : n <= 4 ? 'B23' : n <= 6 ? 'E45' : 'M68'); } return ['K1', 'B23', 'E45', 'M68'].filter(x => b.has(x)).join(', '); }
function textsUsing() { const out = {}, T = path.join(ROOT, 'texts'); (function walk(d) { if (!fs.existsSync(d)) return; for (const f of fs.readdirSync(d)) {
  const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.txt')) { const m = read(p).match(/^pic:\s*(\S+)/m); if (m) (out[m[1]] = out[m[1]] || []).push(path.relative(ROOT, p)); } } })(T); return out; }
function codeFiles() { const out = []; const add = (d, re, deep) => { const D = path.join(ROOT, d); if (!fs.existsSync(D)) return;
  (function walk(x) { for (const f of fs.readdirSync(x)) { const p = path.join(x, f); if (fs.statSync(p).isDirectory()) { if (deep) walk(p); } else if (re.test(f)) out.push(p); } })(D); };
  add('src', /\.(html|js)$/); add('packs', /\.html$/); add('v2/app', /\.(html|js|css|json)$/, true); return out; }
function firstAdded() {   /* basename -> {date, subject}: when each file first came into the repository */
  const out = {}; let cur = null;
  try { const log = cp.execFileSync('git', ['log', '--diff-filter=A', '--name-only', '--format=@@%ad %s', '--date=short', '--reverse', '--', 'web/pics', 'web/sounds', 'voice-samples', 'art'],
      { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 }).toString();
    for (const l of log.split('\n')) { if (l.startsWith('@@')) { cur = { date: l.slice(2, 12), subject: l.slice(13) }; continue; } const b = path.basename(l.trim()); if (b && cur && !out[b]) out[b] = cur; }
  } catch (e) {}
  return out;
}

/* ---------- art packed inside code or lesson packs (cataloged, not moved) ---------- */
const PACKED = {   /* what we know about each place that packs art inside code */
  'packs/KodeshQuestPage.html': { source: 'Microsoft Fluent Emoji (3D), https://github.com/microsoft/fluentui-emoji, made smaller as WebP', licence: 'MIT', author: 'Microsoft', by: 'Kodesh lesson builders (picture cards in the Kodesh pack)', band: 'K1, B23' },
  'src/Music.html': { source: 'Kenney.nl sound packs (effects); the fanfare is a recording of the Haydn "Lark" quartet finale (see the comment at the top of src/Music.html)', licence: 'CC0 / public domain', author: 'Kenney.nl; Joseph Haydn', by: 'UPGRADE Phase 5 builder (music and sound, 2026-11-10)', band: 'K1, B23, E45, M68' },
  'src/SchoolDefinitions.js': { source: 'a picture taken from a curriculum source PDF (the staff curriculum snapshot names the PDF)', licence: 'as its source PDF (not supplied by the source)', author: 'the source PDF\'s publisher', by: 'curriculum import (staff)', band: 'staff' },
};
function packedArt() {
  const items = new Map();
  for (const p of codeFiles()) { const rel = path.relative(ROOT, p); if (rel.startsWith('v2/')) continue; const t = read(p);
    const re = /data:(image|audio)\/([a-z0-9.+-]+);base64,([A-Za-z0-9+/=]{400,})/g; let m, n = 0;
    while ((m = re.exec(t))) { n++; if (m[2] === 'svg+xml') continue;   /* SVG written in code stays in its code (rule 1) */
      const before = t.slice(Math.max(0, m.index - 600), m.index);
      const key = ((before.match(/\\?["']?([A-Za-z_][\w-]*)\\?["']?\s*:\s*\\?["']?$/) || [])[1] || '').toLowerCase();
      const alt = (before.match(/\\?"alt\\?"\s*:\s*\\?"([^"\\]{3,300})\\?"[^{}]*$/) || [])[1] || '';
      const h = sha(Buffer.from(m[3], 'base64'));
      const name = key && key !== 'data' ? key : 'item' + n;
      const id = 'packed-' + path.basename(rel).replace(/\.\w+$/, '').replace(/[^A-Za-z0-9]+/g, '-').toLowerCase() + '-' + name.replace(/[^a-z0-9]+/g, '-');
      const it = items.get(h) || { id, sha: h, kind: m[1], fmt: m[2], places: new Set(), rel, key: name, alt };
      it.places.add(rel + (key && key !== 'data' ? ' (' + key + ')' : '')); if (!it.alt && alt) it.alt = alt; items.set(h, it); } }
  const seen = new Set(); for (const it of items.values()) { let id = it.id, k = 2; while (seen.has(id)) id = it.id + '-' + k++; it.id = id; seen.add(id); }
  return [...items.values()];
}

/* ---------- art on other branches (--branches): listed so nobody re-makes it; never edited ---------- */
function branchArt(libShas) {
  const git = (...a) => cp.execFileSync('git', a, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 256 * 1024 * 1024 });
  const refs = git('for-each-ref', '--format=%(refname:short)', 'refs/remotes/origin').toString().split('\n').filter(r => r && !/HEAD$|\/main$|^origin$/.test(r));
  const mainOids = new Set(git('ls-tree', '-r', 'origin/main', '--format=%(objectname)').toString().split('\n'));
  const SKIP = /(^|\/)(screens?|screenshots?|samples|out|dist|node_modules)\/|sheet|screenshot|-phone\.|-chromebook\.|-cb\.|-ph\./i;
  const ART_EXT = /\.(webp|png|jpe?g|gif|mp3|ogg|wav|m4a|glb|gltf)$/i, found = new Map();
  for (const ref of refs) { let tree; try { tree = git('ls-tree', '-r', ref, '--format=%(objectname) %(path)').toString(); } catch (e) { continue; }
    for (const l of tree.split('\n')) { const i = l.indexOf(' '); if (i < 0) continue; const oid = l.slice(0, i), p = l.slice(i + 1);
      if (!ART_EXT.test(p) || SKIP.test(p) || mainOids.has(oid)) continue;
      const f = found.get(oid) || { oid, path: p, refs: [] }; f.refs.push(ref.replace(/^origin\//, '')); found.set(oid, f); } }
  const libCache = {}, info = (ref, p) => {   /* alt / source from the branch's own lane lib.json or RealPics.html */
    const lane = p.replace(/\/pics\/[^/]+$/, ''), base = path.basename(p);
    const tryJson = f => { try { return JSON.parse(git('show', ref + ':' + f).toString()); } catch (e) { return null; } };
    if (/\/pics\/[^/]+$/.test(p) && !p.startsWith('web/')) { const k = ref + ':' + lane; libCache[k] = libCache[k] || tryJson(lane + '/lib.json') || {};
      const e = Object.values(libCache[k]).find(x => x && x.file === base); if (e) return e; }
    if (p.startsWith('web/pics/')) { const k = ref + ':RealPics'; if (!libCache[k]) { libCache[k] = {}; try { const ctx = { addEventListener() {}, document: { head: { insertAdjacentHTML() {} } } }; ctx.window = ctx; vm.createContext(ctx);
        vm.runInContext(git('show', ref + ':src/RealPics.html').toString().replace(/^\s*<script>/, '').replace(/<\/script>\s*$/, ''), ctx); libCache[k] = ctx.TL_PICS || {}; } catch (e) {} }
      const e = Object.values(libCache[k]).find(x => x && x.file === base); if (e) return e; }
    return {}; };
  const out = [];
  for (const f of found.values()) { let b; try { b = git('cat-file', 'blob', f.oid); } catch (e) { continue; } const h = sha(b); if (libShas.has(h)) continue;
    const ref = f.refs[0], e = info('origin/' + ref, f.path);
    out.push({ id: 'branch-' + path.basename(f.path).replace(/\.\w+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-'), sha: h, path: f.path, refs: f.refs, alt: e.alt || '', source: e.source || '', licence: e.licence || '', author: e.author || '' }); }
  const seen = new Set(); for (const it of out) { let id = it.id, k = 2; while (seen.has(id)) id = it.id + '-' + k++; it.id = id; seen.add(id); }
  return out;
}

/* ---------- the library itself ---------- */
function widthOf(b) {
  if (b[0] === 0x89 && b.toString('ascii', 1, 4) === 'PNG') return b.readUInt32BE(16);
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') { const c = b.toString('ascii', 12, 16);
    if (c === 'VP8 ') return b.readUInt16LE(26) & 0x3fff; if (c === 'VP8L') return 1 + (((b[22] & 0x3f) << 8) | b[21]); if (c === 'VP8X') return 1 + b.readUIntLE(24, 3); }
  if (b[0] === 0xff && b[1] === 0xd8) { let i = 2; while (i < b.length) { if (b[i] !== 0xff) { i++; continue; } const m = b[i + 1]; if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
    const len = b.readUInt16BE(i + 2); if ((m >= 0xc0 && m <= 0xcf) && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return b.readUInt16BE(i + 7); i += 2 + len; } }
  return null;
}
function libraryFiles() { const out = []; for (const k of KINDS) for (const f of listDir(path.join(ART, k))) if (!/\.md$/i.test(f)) out.push({ kind: k, name: f, rel: k + '/' + f, abs: path.join(ART, k, f) }); return out; }
const stem = f => f.replace(/\.[^.]+$/, '');

function build(opts) {
  opts = opts || {};
  const old = parseCatalog(read(CAT)), byId = new Map(old.map(r => [r.id, r]));
  const { lib, map } = loadPics(), legacy = legacySources(), texts = textsUsing(), added = firstAdded();
  const code = codeFiles().map(p => ({ rel: path.relative(ROOT, p), text: read(p) }));
  /* which screens use which picture file */
  const idsOf = {}; for (const [id, p] of Object.entries(lib)) if (p && p.file) (idsOf[p.file] = idsOf[p.file] || []).push(id);
  const screens = {}; for (const [k, v] of Object.entries(map)) { const p = lib[v && v.id]; if (!p) continue; (screens[p.file] = screens[p.file] || []).push(k); }
  const items = new Map();   /* id -> {files:[], ...} */
  for (const f of libraryFiles()) { const id = stem(f.name).toLowerCase(); const it = items.get(id) || { id, files: [] }; it.files.push(f); items.set(id, it); }
  const rows = [];
  for (const it of [...items.values()].sort((a, b) => a.id.localeCompare(b.id))) {
    const app = it.files.find(f => f.kind !== 'originals') || it.files[0], name = app.name;
    const ids = idsOf[name] || [], P = lib[ids[0]] || {}, L = legacy[name] || {}, keys = screens[name] || [];
    const q = keys.filter(k => !/\|@(today|watch)$/.test(k) && !k.startsWith('@passage|')), teach = keys.filter(k => /\|@(today|watch)$/.test(k)), pass = keys.filter(k => k.startsWith('@passage|'));
    const lessons = [...new Set(q.concat(teach).map(k => k.split('|')[0]))];
    const use = [];
    if (q.length) use.push('1.0 lesson screens: ' + q.length + ' (' + lessons.slice(0, 3).join(', ') + (lessons.length > 3 ? ', +' + (lessons.length - 3) + ' more lessons' : '') + ')');
    if (teach.length) use.push('1.0 TODAY WE LEARN / WATCH ME: ' + teach.map(k => k.replace(/\|@/, ' @')).slice(0, 3).join(', ') + (teach.length > 3 ? ', +' + (teach.length - 3) : ''));
    if (pass.length) use.push('1.0 reading passage: ' + pass.map(k => k.split('|')[1]).join(', '));
    if (texts[name]) use.push('1.0 texts: ' + texts[name].join(', '));
    const inCode = code.filter(c => c.text.includes(name) && !/RealPics(Teach)?\.html$/.test(c.rel)).map(c => c.rel);
    inCode.filter(r => !r.startsWith('v2/')).forEach(r => use.push('1.0 ' + r)); inCode.filter(r => r.startsWith('v2/')).forEach(r => use.push('2.0 ' + r));
    const a = added[name] || {}, o = byId.get(it.id) || {};
    const fresh = { id: it.id, files: it.files.map(f => '`' + f.rel + '`').join(', '), shows: P.alt || '', cast: '', band: band(lessons) || '', source: P.source || L.source || '',
      licence: P.licence || L.licence || '', author: P.author || L.author || '', 'ordered / made by': a.subject ? 'added in: ' + a.subject : '',
      date: a.date || new Date().toISOString().slice(0, 10), alt: P.alt || '', sha256: sha(fs.readFileSync(app.abs)).slice(0, 12) };
    const r = {}; for (const k of COLS) r[k] = cell(o[k] || fresh[k] || '');
    r.files = cell(fresh.files); r.sha256 = fresh.sha256;
    const hand = String(o['used by'] || '').split(/\s*;\s*/).filter(s => s && !AUTO_USE.test(s) && s !== 'not used yet');
    if (ids.length > 1) use.push('picture ids: ' + ids.join(', '));   /* one file, several TL_PICS ids (kept as one item) */
    r['used by'] = cell(hand.concat(use).join('; ') || 'not used yet');
    rows.push(r); byId.delete(it.id);
  }
  /* art packed inside code (cataloged, not moved) */
  const packed = [];
  for (const it of packedArt()) { const info = PACKED[it.rel] || {}, o = byId.get(it.id) || {};
    const fresh = { id: it.id, files: 'in ' + [...it.places].join(', '), shows: it.kind === 'audio' ? 'sound: ' + it.key : (it.alt || 'picture card: ' + it.key), cast: '', band: info.band || '',
      source: info.source || '', licence: info.licence || '', author: info.author || '', 'ordered / made by': info.by || '', 'used by': '1.0 ' + it.rel, date: '', alt: it.alt || (it.kind === 'audio' ? 'sound effect: ' + it.key : it.key), sha256: it.sha.slice(0, 12) };
    const r = {}; for (const k of COLS) r[k] = cell(o[k] || fresh[k] || ''); r.files = cell(fresh.files); r.sha256 = fresh.sha256; packed.push(r); byId.delete(it.id); }
  /* art on other branches */
  const branch = [];
  if (opts.branches) { const shas = new Set(rows.concat(packed).map(r => r.sha256));
    for (const it of branchArt(new Set())) { if (shas.has(it.sha.slice(0, 12))) continue; const o = byId.get(it.id) || {};
      const fresh = { id: it.id, files: 'on branch ' + it.refs.slice(0, 3).join(', ') + (it.refs.length > 3 ? ' +' + (it.refs.length - 3) : '') + ': ' + it.path, shows: it.alt, source: it.source, licence: it.licence, author: it.author,
        'ordered / made by': 'builder of that branch (not in the library yet)', 'used by': 'waiting on its branch', date: '', alt: it.alt, sha256: it.sha.slice(0, 12) };
      const r = {}; for (const k of COLS) r[k] = cell(o[k] || fresh[k] || ''); r.files = cell(fresh.files); branch.push(r); byId.delete(it.id); } }
  /* hand-written rows the script did not make: kept as they are (a row whose file is gone is reported by --check) */
  for (const o of byId.values()) { if (!opts.branches && where(o) === 'branch') { branch.push(o); continue; } (where(o) === 'repo' ? packed : where(o) === 'branch' ? branch : rows).push(o); }
  return { rows, packed, branch };
}

function render({ rows, packed, branch }) {
  const table = list => ['| ' + COLS.map(k => HEAD[k]).join(' | ') + ' |', '|' + COLS.map(() => '---').join('|') + '|'].concat(list.map(r => '| ' + COLS.map(k => cell(r[k])).join(' | ') + ' |')).join('\n');
  return `# Art catalog: the shared art library of Tashbar Learning

One row per piece of art, for 1.0, 2.0 and every future app. **Search this page first** (Ctrl+F: a thing, a character, a lesson id),
reuse what fits, and add what you make. How: \`art/README.md\`. Made by \`node tools/art-catalog.js\` (it keeps hand-written rows and cells).

- In the library: **${rows.length}** items (\`art/pics\`, \`art/originals\`, \`art/sounds\`, \`art/models\`).
- Cataloged, not moved (packed inside code or a lesson pack): **${packed.length}** items.
- On other branches, not in the library yet: **${branch.length}** items.

Bands: K1 = K–1, B23 = 2–3, E45 = 4–5, M68 = 6–8, staff. Characters by cast name (\`docs/CORE-GROWTH-LANES.md\`, "Casts").

## In the library

${table(rows)}

## Cataloged, not moved (packed inside code or a lesson pack)

These stay where they are (moving them would change a lesson pack or code that boys use). Reuse them by copying the bytes into \`art/\` as a new item.

${table(packed)}

## On other branches (not in the library yet)

Art that a builder has on a branch that is not merged. Listed so nobody makes it again. Its builder adds it to \`art/\` (with a full row) when that work goes in.

${table(branch)}
`;
}

/* ---------- checks ---------- */
function check() {
  const problems = [], rows = parseCatalog(read(CAT));
  if (!fs.existsSync(CAT)) return ['art/CATALOG.md is missing'];
  const files = libraryFiles(), seenFile = new Map(), ids = new Set();
  for (const r of rows) { if (ids.has(r.id)) problems.push('the id "' + r.id + '" has two rows'); ids.add(r.id);
    const w = where(r);
    if (w === 'art') for (const f of filesOf(r)) { if (!fs.existsSync(path.join(ART, f))) problems.push('row ' + r.id + ' points to a missing file: art/' + f);
      if (seenFile.has(f)) problems.push('art/' + f + ' has two rows (' + seenFile.get(f) + ', ' + r.id + ')'); seenFile.set(f, r.id); }
    if (w === 'repo') { const p = String(r.files).replace(/^\s*`?in /, '').split(/\s*,\s*/).map(s => s.replace(/\s*\(.*$/, '').replace(/`/g, '').trim());
      p.forEach(x => { if (x && !fs.existsSync(path.join(ROOT, x))) problems.push('row ' + r.id + ' says it lives in ' + x + ', which is missing'); }); }
    if (w !== 'branch') { const need = ['source', 'licence', 'alt'].filter(k => !String(r[k] || '').trim() || /^[-—?]$/.test(String(r[k]).trim()));
      if (need.length) problems.push('row ' + r.id + ' has no ' + need.join(', ')); }
  }
  const byHash = new Map();
  for (const f of files) { if (!seenFile.has(f.rel)) problems.push('art/' + f.rel + ' has no row in art/CATALOG.md (run: node tools/art-catalog.js, then fill in its row)');
    if (!/^[a-z0-9][a-z0-9-]*\.[a-z0-9]+$/.test(f.name) || f.name.length > 64) problems.push('art/' + f.rel + ': file names are short, lowercase, letters, numbers and "-" only');
    if (!EXT[f.kind].test(f.name)) problems.push('art/' + f.rel + ': ' + f.kind + ' holds only ' + String(EXT[f.kind]).replace(/^\/\\\.\(|\)\$\/$/g, '').split('|').join(', ') + ' files');
    const b = fs.readFileSync(f.abs); if (b.length > LIMIT[f.kind]) problems.push('art/' + f.rel + ' is too big (' + Math.round(b.length / 1024) + ' KB, max ' + Math.round(LIMIT[f.kind] / 1024) + ' KB)');
    if (f.kind === 'pics') { const w = widthOf(b); if (w == null) problems.push('art/' + f.rel + ': cannot read the picture size'); else if (w > MAX_W) problems.push('art/' + f.rel + ' is too wide (' + w + ' px, max ' + MAX_W + ')'); }
    const h = sha(b); if (byHash.has(h)) problems.push('the same file is in the library twice: art/' + byHash.get(h) + ' and art/' + f.rel + ' (keep one)'); else byHash.set(h, f.rel); }
  for (const f of listDir(ART)) if (!/^(README|CATALOG)\.md$/.test(f)) problems.push('art/' + f + ': put art in art/pics, art/originals, art/sounds or art/models');
  return problems;
}

module.exports = { build, render, check, parseCatalog, libraryFiles, ART, CAT };
if (require.main === module) {
  const a = process.argv.slice(2);
  if (a.includes('--check')) { const p = check(); p.forEach(x => console.log('PROBLEM ' + x)); console.log('art library: ' + libraryFiles().length + ' files, ' + p.length + ' problems'); process.exit(p.length ? 1 : 0); }
  const r = build({ branches: a.includes('--branches') }); fs.mkdirSync(ART, { recursive: true }); fs.writeFileSync(CAT, render(r));
  console.log('art/CATALOG.md: ' + r.rows.length + ' in the library, ' + r.packed.length + ' cataloged, not moved, ' + r.branch.length + ' on other branches');
  const p = check(); p.slice(0, 40).forEach(x => console.log('PROBLEM ' + x)); console.log(p.length + ' problems');
}
