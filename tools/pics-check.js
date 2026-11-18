/* PICS-1 check: every picture link names a real screen, every picture exists. Run: node tools/pics-check.js src/RealPics.html <all-questions.json> web/pics */
// every TL_PIC_MAP key must name a real screen (lesson id + exact question), every picture id must be in TL_PICS, every file in web/pics
const fs = require('fs'), vm = require('vm'); const [,, html, allq, picsDir] = process.argv;
const ctx = { window: {}, addEventListener() {}, requestAnimationFrame() {}, document: { head: { insertAdjacentHTML() {} } } }; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(html, 'utf8').replace(/^\s*<script>/, '').replace(/<\/script>\s*$/, ''), ctx);
const norm = s => String(s).replace(/\\"/g, '"').replace(/\s+/g, ' ').trim(); const Q = new Set(JSON.parse(fs.readFileSync(allq, 'utf8')).map(x => x.id + '|' + norm(x.q)));
let bad = 0; for (const [k, v] of Object.entries(ctx.TL_PIC_MAP)) { const [id, ...q] = k.split('|'); const qq = q.join('|');
  if (qq !== '*' && !Q.has(id + '|' + norm(qq))) { bad++; console.log('NO SUCH SCREEN:', k); }
  if (!ctx.TL_PICS[v.id]) { bad++; console.log('NO SUCH PICTURE:', v.id); }
  (v.mark || []).forEach(m => { if (!Array.isArray(m.box) || m.box.length !== 4 || m.box.some(n => typeof n !== 'number')) { bad++; console.log('BAD BOX', k); } }); }
for (const [id, p] of Object.entries(ctx.TL_PICS)) if (!fs.existsSync(picsDir + '/' + p.file)) { bad++; console.log('MISSING FILE', p.file); }
console.log(Object.keys(ctx.TL_PIC_MAP).length, 'screens,', Object.keys(ctx.TL_PICS).length, 'pictures,', bad, 'problems'); process.exit(bad ? 1 : 0);
