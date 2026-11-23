/* PICS-1 check. Run: node tools/pics-check.js src/RealPics.html <screens.json from tools/pics-screens.py> web/pics
   Fails (exit 1) on any of these:
   - a TL_PIC_MAP key that names no real screen (lesson id + exact question), or a picture id not in TL_PICS, or a bad box;
   - a TL_PICS entry missing file, alt, source, licence or author, or whose file is not in web/pics;
   - a picture file over 200 KB or wider than 1200 px;
   - a mark (box/label) on a pure question screen (its "how" line is empty): those get the plain picture;
   - a label with a word that is not in that screen's "how" line (labels only name what the screen already teaches).
   A 'LESSON.ID|*' key is checked against every screen of that lesson it would show on.
   PICS-2 teaching keys (src/RealPicsTeach.html): 'SKILL.ID|@today' and 'SKILL.ID|@watch' (a skill id or a unit prefix of one)
   and '@passage|KEY' (a reading passage used as p:'KEY'). They take no marks (no "how" line to teach a label).
   WARNS (does not fail) when a linked screen's own picture text is short words or numbers (under 40 characters, with a Latin letter
   or digit, no Hebrew) and the link has no "keep": true: the picture would hide text the boy needs. Set "keep": true or un-link. */
const fs = require('fs'), vm = require('vm'); const [,, html, allq, picsDir] = process.argv;
const MAX_BYTES = 200 * 1024, MAX_W = 1200;
const ctx = { window: {}, addEventListener() {}, requestAnimationFrame() {}, document: { head: { insertAdjacentHTML() {} } } }; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(html, 'utf8').replace(/^\s*<script>/, '').replace(/<\/script>\s*$/, ''), ctx);
const norm = s => String(s).replace(/\\"/g, '"').replace(/\s+/g, ' ').trim();
const words = s => (norm(s).toLowerCase().replace(/[’']/g, "'").match(/[\p{L}\p{N}'׳״"]+/gu) || []).map(w => w.replace(/^['"]+|['"]+$/g, '')).filter(Boolean);
const screens = JSON.parse(fs.readFileSync(allq, 'utf8'));
const PIC = new Map(); for (const x of screens) { const k = x.id + '|' + norm(x.q); if (x.pic && !PIC.has(k)) PIC.set(k, norm(x.pic)); }
const hides = t => t && t.length < 40 && /[A-Za-z0-9]/.test(t) && !/[\u0590-\u05FF]/.test(t);
let warn = 0; const hid = (k, t) => { warn++; console.log('WARN HIDES THE SCREEN\'S OWN TEXT (add "keep": true):', k, ' <<' + t + '>>'); };
const Q = new Map(); for (const x of screens) { const k = x.id + '|' + norm(x.q); const p = Q.get(k); Q.set(k, p == null ? norm(x.how) : (p || norm(x.how))); }
const byLesson = new Map(); for (const x of screens) { if (!byLesson.has(x.id)) byLesson.set(x.id, []); byLesson.get(x.id).push(x); }
let bad = 0; const say = (...a) => { bad++; console.log(...a); };

/* a label word counts as taught if the "how" line has it (also with a plural -s/-es or a leading Hebrew prefix letter) */
const SMALL = new Set(['a', 'an', 'the', 'it', 'its', 'of', 'on', 'in', 'at', 'to', 'and', 'or', 'is', 'this', 'that', 'here', 'with', 'for']);
function taughtWord(w, howWords) {
  w = w.replace(/'s$/, ''); if (SMALL.has(w) || howWords.has(w)) return true;
  for (const v of [w + 's', w + 'es', w.replace(/e?s$/, ''), w.replace(/^[והבכלמש]/, '')]) if (v && howWords.has(v)) return true;
  return false;
}
function checkMarks(key, marks, how) {
  if (!marks.length) return;
  if (!how) { say('MARK ON A QUESTION SCREEN (no "how" line; use the plain picture):', key); return; }
  const hw = new Set(words(how));
  marks.forEach(m => { const miss = words(m.label || '').filter(w => !taughtWord(w, hw)); if (miss.length) say('LABEL NOT TAUGHT ON THIS SCREEN ("' + miss.join('", "') + '" not in its "how" line):', key, '→', m.label); });
}

let passText = null; const srcText = () => { if (passText == null) { const path = require('path'), root = path.join(__dirname, '..'); passText = '';
  for (const d of ['src', 'packs']) for (const f of fs.readdirSync(path.join(root, d))) if (f.endsWith('.html')) passText += fs.readFileSync(path.join(root, d, f), 'utf8'); } return passText; };
const passUsed = key => { srcText(); return new RegExp(`\\bp\\s*:\\s*['"]${key.replace(/[^\w-]/g, '')}['"]`).test(passText) && /^[\w-]+$/.test(key); };
for (const [k, v] of Object.entries(ctx.TL_PIC_MAP)) {
  const [id, ...q] = k.split('|'); const qq = q.join('|'); const marks = v.mark || [];
  if (!ctx.TL_PICS[v.id]) say('NO SUCH PICTURE:', v.id);
  marks.forEach(m => { if (!Array.isArray(m.box) || m.box.length !== 4 || m.box.some(n => typeof n !== 'number')) say('BAD BOX', k); });
  if (id === '@passage' || qq === '@today' || qq === '@watch') {
    if (marks.length) say('NO MARKS ON A TEACHING PICTURE (TODAY / WATCH / passage):', k);
    if (id === '@passage') { if (!passUsed(qq)) say('NO SUCH PASSAGE (no item uses p:\'' + qq + '\'):', k); }
    else if (!/^[A-Z][A-Z0-9]*(\.[A-Za-z0-9]+)+$/.test(id) || (![...byLesson.keys()].some(s => s === id || s.startsWith(id + '.')) && !new RegExp(`['"]${id.replace(/\./g, '\\.')}(\\.[A-Za-z0-9]+)*['"]`).test(srcText()))) say('NO SUCH SKILL OR UNIT:', k);
    continue;
  }
  if (qq === '*') {
    const list = (byLesson.get(id) || []).filter(x => !ctx.TL_PIC_MAP[id + '|' + norm(x.q)]);
    if (!byLesson.has(id)) say('NO SUCH LESSON:', k);
    list.forEach(x => { checkMarks(k + ' (shows on "' + norm(x.q).slice(0, 60) + '")', marks, norm(x.how)); const t = PIC.get(id + '|' + norm(x.q)); if (!v.keep && hides(t)) hid(id + '|' + norm(x.q), t); });
  } else if (!Q.has(id + '|' + norm(qq))) say('NO SUCH SCREEN:', k);
  else { checkMarks(k, marks, Q.get(id + '|' + norm(qq))); const t = PIC.get(id + '|' + norm(qq)); if (!v.keep && hides(t)) hid(k, t); }
}

function widthOf(b) {
  if (b[0] === 0x89 && b.toString('ascii', 1, 4) === 'PNG') return b.readUInt32BE(16);
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const c = b.toString('ascii', 12, 16);
    if (c === 'VP8 ') return b.readUInt16LE(26) & 0x3fff;
    if (c === 'VP8L') return 1 + (((b[22] & 0x3f) << 8) | b[21]);
    if (c === 'VP8X') return 1 + b.readUIntLE(24, 3);
  }
  if (b[0] === 0xff && b[1] === 0xd8) { let i = 2;
    while (i < b.length) { if (b[i] !== 0xff) { i++; continue; } const m = b[i + 1]; if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
      const len = b.readUInt16BE(i + 2); if ((m >= 0xc0 && m <= 0xcf) && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return b.readUInt16BE(i + 7); i += 2 + len; } }
  return null;
}
for (const [id, p] of Object.entries(ctx.TL_PICS)) {
  const need = ['file', 'alt', 'source', 'licence', 'author'].filter(f => !String(p[f] || '').trim());
  if (need.length) say('PICTURE MISSING', need.join(', ') + ':', id);
  const fp = picsDir + '/' + p.file; if (!p.file || !fs.existsSync(fp)) { say('MISSING FILE', p.file); continue; }
  const b = fs.readFileSync(fp), w = widthOf(b);
  if (b.length > MAX_BYTES) say('FILE TOO BIG (' + Math.round(b.length / 1024) + ' KB, max 200):', p.file);
  if (w == null) say('CANNOT READ PICTURE SIZE:', p.file); else if (w > MAX_W) say('PICTURE TOO WIDE (' + w + ' px, max ' + MAX_W + '):', p.file);
}
console.log(Object.keys(ctx.TL_PIC_MAP).length, 'screens,', Object.keys(ctx.TL_PICS).length, 'pictures,', bad, 'problems' + (warn ? ', ' + warn + ' hidden-text warnings' : '')); process.exit(bad ? 1 : 0);
