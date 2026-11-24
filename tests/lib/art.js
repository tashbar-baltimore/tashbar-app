/* SHARED ART LIBRARY check (HoS 2026-11-24, art/README.md). No browser needed. Fails when:
   a file in art/ has no catalog row; a catalog row points to a missing file; an item has no source, licence or alt text;
   a picture is over its size limit; the same file is in the library twice. The rules live in tools/art-catalog.js (--check). */
module.exports = function () {
  const C = require('../../tools/art-catalog.js'), out = { fails: [], oks: [] };
  let p; try { p = C.check(); } catch (e) { p = ['the art check crashed: ' + e.message]; }
  p.forEach(x => out.fails.push('art library: ' + x));
  if (!p.length) out.oks.push('art library: ' + C.libraryFiles().length + ' files, every one cataloged with source, licence and alt text, within size limits, no duplicates');
  return out;
};
