/* Core Growth (job T): the content store's text format. A long text (story, chapter, article, poem, play) is written as a plain
   file texts/<JOB>/<ID>.txt and published as /texts/<ID>.json on the site (web/build.js). The boy's page loads it only when he
   opens it (TLCORE.text in src/CoreKit.html), so long texts never make the start-up download bigger.
   Read docs/core-growth/HOW-TO-ADD-A-TEXT.md. The file:

     id: C45.ANTS.01
     title: The Busy Ant Colony
     grade: 5                      (K, 1 ... 8)
     kind: article                 (story, chapter, article, poem, play, letter, speech, fable)
     topic: Ants                   (texts in a topic set share a topic)
     book: The Lost Map            (chapters only)  ·  chapter: 3
     pic: ants-colony.webp         (optional: a picture in web/pics, with its line in web/pics/SOURCES.md)
     source: original              (original, or "adapted from <public-domain work>")
     ---
     First paragraph. A blank line starts a new paragraph.

     Second paragraph.
     ===
     (=== on its own line starts a new page)
     --- words
     colony: a big group of ants that live and work together
     queen: the one ant that lays all the eggs

   A play line is  NAME: words  in a paragraph of its own; the Reader shows the name as the speaker. */
const KINDS = ['story', 'chapter', 'article', 'poem', 'play', 'letter', 'speech', 'fable'];
const ID_RE = /^[A-Z][A-Z0-9]*(\.[A-Z0-9]+){1,3}$/;
/* Words per text, by grade (CORE-GROWTH-PROMPT.md section 2). A short poem, letter or speech may be shorter: only the top is checked for those. */
const BAND = { 0: [20, 400], 1: [30, 600], 2: [80, 800], 3: [150, 900], 4: [300, 1500], 5: [500, 1500], 6: [500, 2500], 7: [600, 2500], 8: [800, 2500] };

/* split a paragraph into sentences: ends at . ! ? (and a closing quote) followed by a space and a capital, a quote or a digit */
function sentences(p) {
  const out = []; let s = '';
  const t = p.replace(/\s+/g, ' ').trim();
  for (let i = 0; i < t.length; i++) {
    s += t[i];
    if (/[.!?]/.test(t[i])) {
      let j = i + 1; while (j < t.length && /["'”’)]/.test(t[j])) { s += t[j]; j++; }
      if (j >= t.length || (t[j] === ' ' && /["'“‘A-Z0-9(]/.test(t[j + 1] || ''))) {
        if (!/\b(Mr|Mrs|Dr|St|Mt|R|Rabbi|Rav|No|vs)\.$/.test(s.trim())) { out.push(s.trim()); s = ''; }
      }
      i = j - 1;
    }
  }
  if (s.trim()) out.push(s.trim());
  return out;
}
const wordCount = s => (s.match(/[A-Za-z0-9֐-׿’']+/g) || []).length;

function parse(src, file) {
  const problems = [], txt = String(src).replace(/\r\n/g, '\n');
  const cut = txt.indexOf('\n---\n'); if (cut < 0) return { problems: [(file || 'text') + ': needs a header, then a line with --- , then the text'] };
  const head = {}; txt.slice(0, cut).split('\n').forEach(l => { const m = /^([a-z]+):\s*(.*)$/.exec(l.trim()); if (m) head[m[1]] = m[2].trim(); else if (l.trim()) problems.push('header line not understood: ' + l.trim()); });
  let body = txt.slice(cut + 5), glo = '';
  const gi = body.search(/^--- words\s*$/m); if (gi >= 0) { glo = body.slice(gi).replace(/^--- words\s*\n?/, ''); body = body.slice(0, gi); }
  const pages = body.split(/^===\s*$/m).map(pg => pg.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean).map(par => {
    const m = /^([A-Z][A-Za-z' ]{0,24}):\s+(.+)$/s.exec(par); const who = head.kind === 'play' && m ? m[1] : '';
    const words = who ? m[2] : par; return who ? { who, s: sentences(words) } : { s: sentences(words) };
  })).filter(pg => pg.length);
  const words = {}; glo.split('\n').map(x => x.trim()).filter(Boolean).forEach(l => { const m = /^([^:]{1,40}):\s*(.+)$/.exec(l); if (m) words[m[1].trim().toLowerCase()] = m[2].trim(); else problems.push('word line not understood: ' + l); });
  const grade = head.grade === 'K' ? 0 : Number(head.grade);
  const all = pages.map(pg => pg.map(p => p.s.join(' ')).join(' ')).join(' ');
  const T = { id: head.id || '', title: head.title || '', grade, kind: head.kind || '', topic: head.topic || '', book: head.book || '', chapter: head.chapter ? Number(head.chapter) : 0,
    pic: head.pic || '', source: head.source || '', words: wordCount(all), pages, glossary: words };
  return { text: T, problems };
}

/* The rules a script can check. pics = a Set of file names in web/pics (or null to skip). */
function check(T, pics) {
  const p = [];
  if (!ID_RE.test(T.id)) p.push('id must look like C45.ANTS.01 (job letters first, capitals, digits and dots)');
  if (!T.title || T.title.length > 60) p.push('needs a title of 60 letters or fewer');
  if (!(T.grade >= 0 && T.grade <= 8)) p.push('grade must be K or 1 to 8');
  if (KINDS.indexOf(T.kind) < 0) p.push('kind must be one of ' + KINDS.join(', '));
  if (T.kind === 'chapter' && (!T.book || !(T.chapter > 0))) p.push('a chapter needs book: and chapter:');
  if (!/^(original|adapted from .{3,})$/i.test(T.source)) p.push('source must be "original" or "adapted from <public-domain work>" (never copy a copyrighted book or article)');
  if (!T.pages.length) p.push('has no text');
  const band = BAND[T.grade]; const shortOk = ['poem', 'letter', 'speech', 'play'].indexOf(T.kind) >= 0;
  if (band && T.words > band[1]) p.push(T.words + ' words is too long for grade ' + (T.grade || 'K') + ' (at most ' + band[1] + '); split it into chapters');
  if (band && !shortOk && T.words < band[0]) p.push(T.words + ' words is too short for grade ' + (T.grade || 'K') + ' (at least ' + band[0] + ')');
  const flat = JSON.stringify(T);
  if (/\bG[o0]d\b|\bLord\b|\bJehovah\b|\bYahweh\b/i.test(flat) || /י[֑-ׇ]*ה[֑-ׇ]*ו[֑-ׇ]*ה/.test(flat)) p.push('never write the Divine Name (use Hashem, or ה׳ in Hebrew)');
  T.pages.forEach((pg, i) => pg.forEach((par, j) => par.s.forEach(s => { if (s.length > 400) p.push('page ' + (i + 1) + ', paragraph ' + (j + 1) + ': a sentence over 400 letters (missing a full stop?)'); })));
  const low = T.pages.map(pg => pg.map(par => par.s.join(' ')).join(' ')).join(' ').toLowerCase();
  Object.keys(T.glossary).forEach(w => { if (low.indexOf(w) < 0) p.push('word "' + w + '" is not in the text'); if (T.glossary[w].length > 120) p.push('meaning of "' + w + '" is longer than 120 letters'); });
  if (T.pic && pics && !pics.has(T.pic)) p.push('picture ' + T.pic + ' is not in web/pics');
  if (Buffer.byteLength(JSON.stringify(T)) > 60 * 1024) p.push('over 60 KB: split it into chapters');
  return p;
}

module.exports = { parse, check, sentences, wordCount, KINDS, BAND, ID_RE };
