/* LESSON DATA FILES (B1b, 26 Nov 2026): every row in a src/CoreData*.js skill list that names a data file (file: "X") must find its
   lesson in src/X.html. On 25 Nov two helpers chose the same file name (CoreDataC45H3.html); the second PR replaced the first file,
   and 6 Book Club lessons silently vanished from the boys' path (a listed skill with no lesson is hidden, so no test failed).
   A row with no file (a planned skill) is not checked. Pick a new, unused file name for new lesson data. */
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '..', '..', 'src');
module.exports = function () {
  const fails = [], oks = []; let rows = 0;
  fs.readdirSync(SRC).filter(f => /^CoreData.*\.js$/.test(f)).forEach(list => {
    const s = fs.readFileSync(path.join(SRC, list), 'utf8');
    for (const m of s.matchAll(/\[\s*["']([A-Z0-9.]+)["'][^\]\n]*?file:\s*["'](\w+)["']/g)) {
      rows++; const id = m[1], file = m[2], p = path.join(SRC, file + '.html');
      if (!fs.existsSync(p)) { fails.push('lesson data files: ' + list + ' lists ' + id + ' in ' + file + '.html, which does not exist'); continue; }
      const h = fs.readFileSync(p, 'utf8');
      if (h.indexOf("'" + id + "'") < 0 && h.indexOf('"' + id + '"') < 0) fails.push('lesson data files: ' + list + ' lists ' + id + ' in ' + file + '.html, but that file has no lesson ' + id + ' (was the file replaced by another PR with the same name?)');
    }
  });
  if (!fails.length) oks.push('lesson data files: all ' + rows + ' listed lessons that name a data file are in that file');
  return { fails, oks };
};
