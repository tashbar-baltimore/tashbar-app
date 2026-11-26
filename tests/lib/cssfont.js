/* CSS FONT SHORTHAND (gap A4, issue #402): "font:900 40px/1.1 inherit" is not valid CSS, so the browser drops the whole rule and the
   text falls back to the page size (a K-1 question line showed about 11 px on a Chromebook). "inherit" may stand alone ("font:inherit")
   or as a var() fallback ("var(--display,inherit)"), never next to a size or weight. Write the parts on their own instead:
   "font-weight:900;font-size:40px;line-height:1.1". Checks every app file in src/ and web/. */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const BAD = /font\s*:\s*([^;'"}{]*?)\binherit\b/g;
module.exports = function () {
  const fails = [], oks = []; let files = 0;
  ['src', 'web'].forEach(dir => {
    const d = path.join(ROOT, dir); if (!fs.existsSync(d)) return;
    (function walk(p) {
      fs.readdirSync(p, { withFileTypes: true }).forEach(e => {
        const f = path.join(p, e.name);
        if (e.isDirectory()) { if (e.name !== 'node_modules' && e.name !== 'dist') walk(f); return; }
        if (!/\.(html|js|css)$/.test(e.name)) return;
        files++; const lines = fs.readFileSync(f, 'utf8').split('\n');
        lines.forEach((ln, i) => {
          let m; BAD.lastIndex = 0;
          while ((m = BAD.exec(ln))) {
            const before = m[1].trim();
            if (!before || /var\(\s*--[\w-]+\s*,\s*$/.test(before)) continue;   /* font:inherit, or a var() fallback */
            fails.push('invalid CSS ' + path.relative(ROOT, f) + ':' + (i + 1) + ' "font:' + before + ' inherit" (the browser drops it; write font-weight/font-size/line-height on their own)');
          }
        });
      });
    })(d);
  });
  if (!fails.length) oks.push('CSS font rules: no "font:<size> inherit" shorthand in ' + files + ' app files (issue #402)');
  return { fails, oks };
};
