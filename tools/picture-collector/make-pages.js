#!/usr/bin/env node
/* Builds two pages from credits.json:
   credits.html  the Credits page for the app (who took each picture, its licence, where it came from)
   review.html   a picture gallery for a person to check every picture before it goes into lessons
   Run on its own: node tools/picture-collector/make-pages.js [picture-library folder] */
'use strict';
const fs = require('fs'), path = require('path'); const L = require('./lib');
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const SITE = { wikimedia: 'Wikimedia Commons', openverse: 'Openverse', pixabay: 'Pixabay', pexels: 'Pexels', nasa: 'NASA', loc: 'Library of Congress' };
const CAT = { animals: 'Animals', plants: 'Plants', tools: 'Tools', places: 'Places' };

const STYLE = `:root{--bg:#fbfaf7;--fg:#1d2430;--mut:#5c6675;--line:#e3e0d8;--card:#fff;--link:#1d5fa8}
@media (prefers-color-scheme:dark){:root{--bg:#14171c;--fg:#e8e6e1;--mut:#a3abb7;--line:#2c323b;--card:#1b1f26;--link:#8ab8ee}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:1100px;margin:0 auto;padding:24px 16px 64px}h1{font-size:26px;margin:0 0 4px}h2{margin:32px 0 8px;font-size:20px;border-bottom:1px solid var(--line);padding-bottom:4px}
h3{margin:18px 0 6px;font-size:16px}p.lead{color:var(--mut);margin:0 0 16px}a{color:var(--link)}ul{padding-left:18px;margin:0}li{margin:2px 0;color:var(--mut)}li b{color:var(--fg);font-weight:600}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}.card{background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden;font-size:12px}
.card img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;background:var(--line)}.card div{padding:6px 8px;color:var(--mut);overflow-wrap:anywhere}.card b{color:var(--fg)}
.stats{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 16px}.stats span{background:var(--card);border:1px solid var(--line);border-radius:999px;padding:2px 10px;font-size:13px}`;

function page(title, body) { return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>${STYLE}</style></head><body><main>${body}</main></body></html>\n`; }
function grouped(credits) {
  const g = new Map();
  for (const c of credits) { const k = c.category; if (!g.has(k)) g.set(k, new Map()); const t = g.get(k); if (!t.has(c.topic)) t.set(c.topic, []); t.get(c.topic).push(c); }
  return g;
}
const credLine = c => `<b>${esc(c.topicName)}</b> (${esc(path.basename(c.file))}): photo by ${esc(c.author)}, ` +
  `<a href="${esc(c.licenceUrl)}" rel="license noopener">${esc(c.licence)}</a>, from <a href="${esc(c.pageUrl)}" rel="noopener">${esc(SITE[c.source] || c.source)}${c.provider && c.provider !== c.source ? ' / ' + esc(c.provider) : ''}</a>`;

function build(out) {
  const credits = L.readJSON(path.join(out, 'credits.json'), []);
  const g = grouped(credits); const count = k => credits.reduce((m, c) => (m[c[k]] = (m[c[k]] || 0) + 1, m), {});
  let body = `<h1>Picture credits</h1><p class="lead">The photos in Tashbar Learning come from these photographers and collections. Thank you! Each picture is used under the licence shown; follow the links for the original picture and the licence. ${credits.length} pictures.</p>`;
  for (const [cat, topics] of g) {
    body += `<h2>${esc(CAT[cat] || cat)}</h2>`;
    for (const [, list] of topics) body += `<ul>${list.map(c => `<li>${credLine(c)}</li>`).join('')}</ul>`;
  }
  fs.writeFileSync(path.join(out, 'credits.html'), page('Picture credits', body));

  let rv = `<h1>Picture review</h1><p class="lead">Check every picture before it is used. To remove one: <code>node tools/picture-collector/reject.js &lt;file name&gt;</code></p>`;
  rv += `<div class="stats">${Object.entries(count('source')).map(([k, v]) => `<span>${esc(SITE[k] || k)}: ${v}</span>`).join('')}${Object.entries(count('category')).map(([k, v]) => `<span>${esc(CAT[k] || k)}: ${v}</span>`).join('')}</div>`;
  for (const [cat, topics] of g) {
    rv += `<h2>${esc(CAT[cat] || cat)}</h2>`;
    for (const [, list] of topics) {
      rv += `<h3>${esc(list[0].topicName)} (${list.length})</h3><div class="grid">` + list.map(c =>
        `<div class="card"><a href="images/${esc(c.file)}"><img loading="lazy" src="images/${esc(c.file)}" alt="${esc(c.topicName)}"></a><div><b>${esc(SITE[c.source] || c.source)}</b> · ${c.width}×${c.height}<br>${esc(c.licence)} · ${esc(c.author).slice(0, 60)}<br>${esc(path.basename(c.file))}</div></div>`).join('') + `</div>`;
    }
  }
  fs.writeFileSync(path.join(out, 'review.html'), page('Picture review', rv));
}
module.exports = { build };
if (require.main === module) build(path.resolve(process.argv[2] || path.join(__dirname, '..', '..', 'picture-library')));
