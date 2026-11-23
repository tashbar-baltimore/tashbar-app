/* PICS-2: which screens still have NO picture, for one id prefix.
   node tools/pics-todo.js <screens.json from tools/pics-screens.py> <ID-PREFIX> [lane ...] [--json out.json]
   e.g. node tools/pics-todo.js /tmp/screens.json SCI.ANIM          -> prints "ID|question  <<how>>" per screen, grouped by lesson
   Screens already linked in src/RealPics.html (exact key or 'LESSON.ID|*') or in any lane folder given (map.json) are left out. */
const fs = require('fs'), vm = require('vm'), path = require('path');
const args = process.argv.slice(2); const ji = args.indexOf('--json'); const jout = ji >= 0 ? args.splice(ji, 2)[1] : null;
const [allq, prefix, ...lanes] = args;
if (!allq || !prefix) { console.log('usage: node tools/pics-todo.js screens.json ID-PREFIX [lane ...] [--json out.json]'); process.exit(1); }
const root = path.join(__dirname, '..');
const ctx = { window: {}, addEventListener() {}, requestAnimationFrame() {}, document: { head: { insertAdjacentHTML() {} } } }; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'src/RealPics.html'), 'utf8').replace(/^\s*<script>/, '').replace(/<\/script>\s*$/, ''), ctx);
const map = Object.assign({}, ctx.TL_PIC_MAP);
for (const l of lanes) { const f = path.join(l, 'map.json'); if (fs.existsSync(f)) Object.assign(map, JSON.parse(fs.readFileSync(f, 'utf8'))); }
const norm = s => String(s).replace(/\\"/g, '"').replace(/\s+/g, ' ').trim();
const seen = new Set(), out = [];
for (const x of JSON.parse(fs.readFileSync(allq, 'utf8'))) {
  if (!x.id || !x.id.startsWith(prefix)) continue; const k = x.id + '|' + norm(x.q);
  if (seen.has(k) || map[k] || map[x.id + '|*']) continue; seen.add(k); out.push({ key: k, id: x.id, q: norm(x.q), how: norm(x.how), pic: norm(x.pic) });
}
let last = ''; for (const s of out) { if (s.id !== last) { console.log('\n# ' + s.id); last = s.id; } console.log(s.key + (s.how ? '  <<' + s.how + '>>' : '')); }
if (jout) fs.writeFileSync(jout, JSON.stringify(out, null, 1));
console.log('\n' + out.length + ' screens with no picture under ' + prefix + ' (' + new Set(out.map(s => s.id)).size + ' lessons)');
