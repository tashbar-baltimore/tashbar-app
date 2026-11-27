/* 2.0 TEST (v2/tests/, run by tests/run.js): Kindergarten Shapes, K-CLARITY-RULES 7 "comparisons are obvious" (v2/curriculum/K-CLARITY-RULES.md).
   No browser: it reads each comparing game's settings (the object the page hands to startGame) and checks that a child could never argue the answer:
   - Big and small: every big piece is at least 2 times every small piece; each sorted kind of thing comes in a big AND a small size (so he compares like with like);
     the lesson shows the small ball beside the big one (keep), and the friend's mistake has a piece beside it to compare with.
   - Line them up: in every round, the lengths (or tower heights) differ by at least 0.8 (a whole scarf-width), and the friend's mistake really looks wrong
     (the shorter one sticks out further) and is shown lined up after.
   - Heavy and light: every pair differs a lot in weight (3 times or more); a balloon or a feather is always the lighter one, a rock or a hay bale the heavier;
     when the light thing is bigger ("big is not always heavy"), it is a balloon (every child knows a balloon is light), never a puzzle like yarn.
   Returns { fails, oks }. */
const path = require('path'), fs = require('fs');
const APP = path.join(__dirname, '..', 'app', 'k-shapes');
function settings(game) {   /* run the page's script with a stand-in startGame, to read its settings */
  const html = fs.readFileSync(path.join(APP, game + '.html'), 'utf8');
  const body = (html.match(/<script type="module">([\s\S]*?)<\/script>/) || [, ''])[1].replace(/^\s*import[^\n]*\n/m, '');
  let cfg = null; new Function('startGame', 'FAMILY', 'wrongFor', body)(c => { cfg = c; }, k => k, () => []);
  return cfg;
}
module.exports = async function () {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 K shapes compare (rule 7): ' + m);
  try {
    /* Big and small */
    const B = settings('big-and-small'), sizes = B.set.map(p => ({ k: p[1], s: p[3] }));
    const big = sizes.filter(p => p.s >= 0.85), small = sizes.filter(p => p.s < 0.85);
    if (!big.length || !small.length) bad('big-and-small needs big and small pieces');
    else if (Math.min(...big.map(p => p.s)) < 2 * Math.max(...small.map(p => p.s))) bad('big-and-small: a big piece is not at least 2 times every small piece (' + Math.min(...big.map(p => p.s)) + ' vs ' + Math.max(...small.map(p => p.s)) + ')');
    for (const p of big) if (!small.some(q => q.k === p.k)) bad('big-and-small: the big ' + p.k + ' has no small ' + p.k + ' to compare with');
    if (!B.lessons.some(l => l.keep)) bad('big-and-small: the lesson must show the small ball beside the big one (keep: true)');
    if (!B.mistake.beside) bad('big-and-small: the friend\'s mistake needs a piece beside it to compare with');
    if (!B.plain) bad('big-and-small: the pieces must be plain (one colour), so size is the only thing that differs');
    /* Line them up */
    const L = settings('line-them-up');
    const len = it => it.L != null ? it.L : it.n * 0.8;   /* a tower block counts as 0.8 */
    [{ items: L.measureLesson.items, name: 'the lesson' }, ...L.rounds.map((r, i) => ({ items: r.items, name: 'round ' + (i + 1) })), ...(L.bonusRounds || []).map((r, i) => ({ items: r.items, name: 'bonus ' + (i + 1) }))].forEach(R => {
      const v = R.items.map(len).sort((a, b) => a - b);
      for (let i = 1; i < v.length; i++) if (v[i] - v[i - 1] < 0.8 - 1e-9) bad('line-them-up ' + R.name + ': two lengths are too close to tell (' + v[i - 1] + ', ' + v[i] + ')');
    });
    const lessonEnds = L.measureLesson.items.map(it => it.L + (it.off || 0)), lessonLen = L.measureLesson.items.map(it => it.L);
    if (lessonEnds.indexOf(Math.max(...lessonEnds)) !== lessonLen.indexOf(Math.min(...lessonLen)) || Math.max(...lessonEnds) - Math.min(...lessonEnds) < 1) bad('line-them-up: in the lesson the shorter scarf must clearly stick out further (it "looks longer")');
    const M = L.mistake.measure, mEnds = M.map(it => it.L + (it.off || 0)), mLen = M.map(it => it.L);
    if (mEnds.indexOf(Math.max(...mEnds)) !== mLen.indexOf(Math.min(...mLen)) || Math.max(...mEnds) - Math.min(...mEnds) < 1) bad('line-them-up: in the mistake the shorter scarf must clearly stick out further');
    /* Heavy and light */
    const H = settings('heavy-and-light'), LIGHT = ['balloon', 'feather'], HEAVY = ['rock', 'block'];
    [{ items: H.balanceLesson.items, name: 'the lesson' }, ...H.rounds.map((r, i) => ({ items: r.items, name: 'round ' + (i + 1) })), ...(H.bonusRounds || []).map((r, i) => ({ items: r.items, name: 'bonus ' + (i + 1) })), { items: H.mistake.balance, name: 'the mistake' }].forEach(R => {
      const [a, b] = R.items, hi = a.w >= b.w ? a : b, lo = hi === a ? b : a;
      if (hi.w < 3 * lo.w) bad('heavy-and-light ' + R.name + ': the weights must differ a lot (' + hi.w + ' vs ' + lo.w + ')');
      if (!LIGHT.includes(lo.look)) bad('heavy-and-light ' + R.name + ': the light one must be a balloon or a feather, not a ' + lo.look);
      if (!HEAVY.includes(hi.look)) bad('heavy-and-light ' + R.name + ': the heavy one must be a rock or a hay bale, not a ' + hi.look);
      if ((lo.s || 1) > (hi.s || 1) && lo.look !== 'balloon') bad('heavy-and-light ' + R.name + ': a big light thing must be a balloon (every child knows it is light)');
    });
  } catch (e) { bad('could not read the games: ' + String(e.message || e).split('\n')[0]); }
  if (!out.fails.length) out.oks.push('2.0 K shapes compare: Big and small, Line them up and Heavy and light only compare things where the answer is obvious (rule 7)');
  return out;
};
