/* QUALITY GATE for One Bite lessons (HoS 2026-11-22: "We need to have safeguards. We need to have guardrails ... make sure this doesn't
   keep on happening"). It checks every hand-written lesson that has hands-on activities (ONE_BITE[id].do / .your) against the parts of the
   HoS quality standard a script can check. It FAILS THE BUILD (so nothing goes live) when:
     - a lesson that is not on the list in tests/quality-baseline.json breaks any rule (every NEW lesson must pass every rule), or
     - a lesson on the list breaks a rule it did not break before (no lesson may get worse), or
     - the list grows past FROZEN (nobody may add lessons to the list to get past the gate).
   When a listed lesson is fixed, its entry should be removed (QUALITY_UPDATE=1 node tests/run.js rewrites the list from this run, and can only
   shrink it). The rules (codes in the list):
     count    "Do it with me" has exactly 2 activities and "Your turn" exactly 5
     kinds    at least 3 different activity kinds
     repeat   never the same kind twice in a row (the order the player really plays)
     mistake  one activity is built on the boy's likely mistake (sort right/mistake, find the mistake, look-alike pairs ...; mark it mis:true), in do 1-2 or your 1-3,
              because "Your turn" ends after 3 right in a row and a strong boy never sees your 4-5
     typing   no tiles that only type the digits of an answer (tiles are for order that matters: steps, sounds, story events, sentence parts)
     say      every activity has a spoken line of 12 words or fewer and a "How to do it" line
     song     Little Learners (K1) and Builders (B23): a chant or movement in Watch Me
     why      Explorers (E45): "tap the reason" on 2 or more activities
     teach    Masters (M68): a teach-it-back / chavrusa step in Watch Me
     bite     the word "bite" where a boy sees it (HoS: boys never see that word)
   It cannot judge everything (is it really a game? is it warm? does it build from easy to hard?): that still needs a person or an independent
   reviewer looking at the pictures (CLAUDE.md, "Quality guardrails"). */
const fs = require('fs'), path = require('path');
const FILE = path.join(__dirname, '..', 'quality-baseline.json');

module.exports = async function (pg) {
  const out = { fails: [], oks: [], counts: {} };
  const found = await pg.evaluate(() => {
    const S = x => String(x == null ? '' : x), words = s => S(s).trim().split(/\s+/).filter(Boolean).length;
    const MIS = /mistake|wrong|flipped|forgot|dropped|oops|mixed up|look-?alike|sneaky|tricky|trap|not right|is it right|which (one )?is right|right or|fix it|find the error|silly|❌|✗|✘/i;
    const res = {};
    Object.keys(window.ONE_BITE || {}).forEach(id => { const b = ONE_BITE[id]; if (!b || !(b.do || b.your)) return;
      const D = b.do || [], Y = b.your || [], all = D.concat(Y), v = [];
      if (D.length !== 2 || Y.length !== 5) v.push('count');
      if (new Set(all.map(a => a && a.type)).size < 3) v.push('kinds');
      let ord = all; try { if (window.OB && OB.kitOrder) ord = OB.kitOrder(id); } catch (e) {}
      for (let k = 1; k < ord.length; k++) if (ord[k] && ord[k - 1] && ord[k].type === ord[k - 1].type) { v.push('repeat'); break; }
      const early = D.concat(Y.slice(0, 3));
      if (!early.some(a => a && (a.mis === true || MIS.test(JSON.stringify([a.bins, a.say, a.how, a.q, a.pairs, a.findSay, a.hear, a.cap]))))) v.push('mistake');
      if (all.some(a => a && a.type === 'tiles' && Array.isArray(a.w) && a.w.length >= 2 && a.w.every(t => /^\d$/.test(S(t))))) v.push('typing');
      if (all.some(a => !a || !a.say || words(a.say) > 12 || !a.how)) v.push('say');
      const steps = (b.watch && b.watch.steps) || [];
      if ((b.band === 'K1' || b.band === 'B23') && !steps.some(s => s && s.m && /chant|move/.test(s.m.type))) v.push('song');
      if (b.band === 'E45' && all.filter(a => a && a.why).length < 2) v.push('why');
      if (b.band === 'M68' && !steps.some(s => /chavrusa|teach it back|teach-it-back|tell (it to )?a (friend|partner)/i.test(typeof s === 'object' ? JSON.stringify(s) : S(s)))) v.push('teach');
      const seen = JSON.stringify([b.today, b.why, b.done, b.watch, b.oops, all.map(a => a && [a.say, a.how, a.q, a.bins, a.cards, a.pairs, a.o, a.grid, a.w])]);
      if (/\bbites?\b/i.test(seen)) v.push('bite');
      if (v.length) res[id] = v; });
    return { res, total: Object.keys(ONE_BITE || {}).filter(id => ONE_BITE[id] && (ONE_BITE[id].do || ONE_BITE[id].your)).length };
  });
  let base = { frozen: 0, lessons: {} };
  try { base = JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch (e) {}
  const listed = base.lessons || {}, frozen = Number(base.frozen) || 0, listSize = Object.keys(listed).length;
  const now = found.res, bad = [];
  Object.keys(now).forEach(id => { const was = listed[id];
    if (!was) bad.push(id + ' breaks the quality rules: ' + now[id].join(', ') + ' (a new or fixed lesson must pass every rule; see tests/lib/obquality.js)');
    else { const worse = now[id].filter(c => was.indexOf(c) < 0); if (worse.length) bad.push(id + ' got worse: now also breaks ' + worse.join(', ')); } });
  if (frozen && listSize > frozen) bad.push('tests/quality-baseline.json lists ' + listSize + ' lessons, more than the frozen ' + frozen + ': lessons may only come OFF the list');
  if (process.env.QUALITY_UPDATE) {
    const keep = {}; Object.keys(now).forEach(id => { if (listed[id]) keep[id] = now[id].filter(c => listed[id].indexOf(c) >= 0); if (keep[id] && !keep[id].length) delete keep[id]; });
    const firstTime = !Object.keys(listed).length && !frozen;
    const lessons = firstTime ? now : keep;
    fs.writeFileSync(FILE, JSON.stringify({ note: 'One Bite lessons that do not yet meet the HoS quality standard (tests/lib/obquality.js). This list may only shrink. Fix a lesson, then take it off.', frozen: firstTime ? Object.keys(now).length : Math.min(frozen || 1e9, Object.keys(keep).length), lessons }, null, 1) + '\n');
    out.oks.push('quality list rewritten (' + Object.keys(lessons).length + ' lessons still to fix)');
  }
  bad.forEach(x => out.fails.push('QUALITY GATE: ' + x));
  const fixed = Object.keys(listed).filter(id => !now[id]).length;
  out.counts.qualityLessonsChecked = found.total; out.counts.qualityLessonsToFix = Object.keys(now).length;
  if (!bad.length) out.oks.push('Quality gate: ' + found.total + ' lessons with activities checked; ' + (found.total - Object.keys(now).length) + ' meet every rule, ' + Object.keys(now).length + ' on the to-fix list (none new, none worse' + (fixed ? ', ' + fixed + ' fixed since the list was made' : '') + ')');
  return out;
};
