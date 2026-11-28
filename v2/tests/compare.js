/* 2.0 TEST: the review page (v2/app/compare/). HoS 2026-11-22: "two sides ... 1.0 ... and then 2.0 on the other side".
   Checks the page shows today's 1.0 on the left and this 2.0 on the right, with side-by-side / one side / phone size, and that
   ?a= / ?b= cannot point a side at another website. */
const fs = require('fs'), path = require('path');
module.exports = async function () {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 review page: ' + m);
  const f = path.join(__dirname, '..', 'app', 'compare', 'index.html');
  if (!fs.existsSync(f)) { bad('v2/app/compare/index.html is missing'); return out; }
  const t = fs.readFileSync(f, 'utf8');
  if (!/tashbar-learning-live\.web\.app/.test(t)) bad('the left side must be today\'s 1.0 app');
  if (!/location\.origin \+ '\/'/.test(t)) bad('the right side must be this 2.0 (the look link being reviewed)');
  ['data-show="both"', 'data-show="old"', 'data-show="new"', 'data-size="phone"', 'data-act="reload"'].forEach(k => { if (t.indexOf(k) < 0) bad('missing control ' + k); });
  const m = /function safe\(p\) \{([^}]*)\}/.exec(t);
  if (!m) bad('no safe() guard for ?a= / ?b='); else { const safe = new Function('p', m[1]);
    if (safe('https://evil.example/') !== '' && /:/.test(safe('https://evil.example/'))) bad('?a= / ?b= can point at another website');
    if (safe('staff/') !== 'staff/') bad('?a=staff/ should open 1.0 staff'); if (safe('compare') !== '') bad('2.0 side must not open the review page inside itself'); }
  if (!out.fails.length) out.oks.push('2.0 review page: 1.0 on the left, this 2.0 on the right, side by side / one side / phone size, safe ?a= ?b=');
  return out;
};
