/* PICS-1 lane check: test one worker's lane folder against the real checker BEFORE it is merged.
   A lane folder holds: lib.json (TL_PICS entries), map.json (TL_PIC_MAP entries), pics/*.webp, sources.md.
   node tools/pics-lane.js check <lane> <screens.json>        -> runs tools/pics-check.js on RealPics.html + this lane (must say 0 problems)
   node tools/pics-lane.js sheet <lane> <out.png> "ID|q" ...  -> draws those screens through the real add-on (look at it!)
   node tools/pics-lane.js block <lane>                       -> prints the TL_PIC_ADD block
   node tools/pics-lane.js merge <lane> "<comment>"           -> adds the block to src/RealPics.html, copies pics into web/pics, adds the SOURCES.md lines */
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const [,, cmd, lane, ...rest] = process.argv; const root = path.join(__dirname, '..');
const rd = f => fs.existsSync(path.join(lane, f)) ? JSON.parse(fs.readFileSync(path.join(lane, f), 'utf8')) : {};
const lib = rd('lib.json'), map = rd('map.json');
const block = `TL_PIC_ADD(${JSON.stringify(lib, null, 1)}, ${JSON.stringify(map, null, 1)});\n`;
if (cmd === 'block') { process.stdout.write(block); process.exit(0); }
if (cmd === 'merge') {
  const rp = path.join(root, 'src/RealPics.html'); const cur = fs.readFileSync(rp, 'utf8');
  if (!/<\/script>\s*$/.test(cur)) { console.log('RealPics.html does not end with </script>'); process.exit(1); }
  const note = (rest[0] || 'lane ' + path.basename(lane)).replace(/\*\//g, '');
  fs.writeFileSync(rp, cur.replace(/<\/script>\s*$/, `/* ${note} */\n` + block + '</script>\n'));
  const used = new Set(Object.values(lib).map(p => p.file)); let n = 0;
  for (const f of fs.readdirSync(path.join(lane, 'pics'))) if (used.has(f)) { fs.copyFileSync(path.join(lane, 'pics', f), path.join(root, 'web/pics', f)); n++; }
  const sp = path.join(root, 'web/pics/SOURCES.md'); let src = fs.readFileSync(sp, 'utf8'); if (!src.endsWith('\n')) src += '\n';
  const have = new Set(src.split('\n').map(l => l.split(' | ')[0]));
  const add = (fs.existsSync(path.join(lane, 'sources.md')) ? fs.readFileSync(path.join(lane, 'sources.md'), 'utf8') : '').split('\n').filter(l => l.trim() && used.has(l.slice(2).split(' | ')[0]) && !have.has(l.split(' | ')[0]));
  fs.writeFileSync(sp, src + add.map(l => l + '\n').join(''));
  console.log('merged', Object.keys(lib).length, 'pictures,', Object.keys(map).length, 'links,', n, 'files,', add.length, 'source lines'); process.exit(0);
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lane-')); const pics = path.join(tmp, 'pics'); fs.mkdirSync(pics);
for (const d of [path.join(root, 'web/pics'), path.join(lane, 'pics')]) if (fs.existsSync(d)) for (const f of fs.readdirSync(d)) { const t = path.join(pics, f); if (fs.existsSync(t)) fs.unlinkSync(t); fs.symlinkSync(path.resolve(d, f), t); }
const html = fs.readFileSync(path.join(root, 'src/RealPics.html'), 'utf8').replace(/<\/script>\s*$/, block + '</script>\n');
fs.writeFileSync(path.join(tmp, 'RealPics.html'), html);
const ids = new Set(); const tl = fs.readFileSync(path.join(root, 'src/RealPics.html'), 'utf8');
for (const k of Object.keys(lib)) if (new RegExp(`['"]${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]\\s*:\\s*\\{\\s*['"]?file`).test(tl)) console.log('NOTE: picture id already exists in RealPics.html (yours replaces it):', k);
try {
  if (cmd === 'check') execFileSync('node', [path.join(root, 'tools/pics-check.js'), path.join(tmp, 'RealPics.html'), rest[0], pics], { stdio: 'inherit' });
  else if (cmd === 'sheet') execFileSync('node', [path.join(root, 'tools/pics-sheet.js'), path.join(tmp, 'RealPics.html'), pics, ...rest], { stdio: 'inherit' });
  else { console.log('usage: check|sheet|block'); process.exit(1); }
} catch (e) { process.exit(1); }
