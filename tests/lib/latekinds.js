/* GAP A6: A LESSON NEVER STARTS WITHOUT ITS ACTIVITY KINDS (2026-11-26).
   What happened: the parts loader (src/Speed.js) HOLDS every timer a piece starts until all pieces have run. CoreKitActs.html (the new
   kinds: cloze, evidence, combine, storymap, ...) joined the Activity Kit (OneBiteKit.html) only from such a timer, and the loader replays
   a boy's held tap at 0 ms, before that 50 ms timer. His lesson started while those kinds were "unknown", and the One Bite player dropped
   them with no message (WRIT.SENT.L03.01 played 4 activities instead of 7).
   page(pg): in a fresh page, run CoreKitActs.html and then OneBiteKit.html the way the loader does (every timer they start is held and
             never fires). Every new kind must already be in OBK.types with no timer, and OBK.err must accept a real activity of each kind.
   source(): the One Bite player joins the kinds before it picks a lesson's activities (kitSetup). */
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '..', '..', 'src');
const js = f => { const t = fs.readFileSync(path.join(SRC, f), 'utf8'); const m = /<script>([\s\S]*)<\/script>/.exec(t); return m ? m[1] : ''; };

function source() {
  const fails = [], t = fs.readFileSync(path.join(SRC, 'OneBite.html'), 'utf8'), i = t.indexOf('function kitSetup(');
  const head = i < 0 ? '' : t.slice(i, t.indexOf('ob.kitDo=(', i));
  if (!/TLCORE\.joinActs\(\)/.test(head)) fails.push('late kinds: src/OneBite.html kitSetup must call TLCORE.joinActs() before it picks a lesson\'s activities (gap A6)');
  return fails;
}

async function page(pg) {
  const fails = source(), oks = [];
  const p = await pg.context().newPage();
  try {
    await p.setContent('<!doctype html><html><head></head><body></body></html>');
    const r = await p.evaluate(([acts, kit]) => {
      const held = []; window.setTimeout = window.setInterval = (f, ms) => { held.push(ms); return held.length; };   /* the loader's hold: nothing fires */
      const out = { bad: [] };
      try { (0, eval)(acts); } catch (e) { out.bad.push('CoreKitActs.html did not run: ' + e); return out; }
      const kinds = Object.keys((window.TLCORE && TLCORE.acts) || {}); out.kinds = kinds;
      if (!kinds.length) { out.bad.push('CoreKitActs.html gave no kinds (TLCORE.acts)'); return out; }
      if (window.OBK) { out.bad.push('the kit already existed before OneBiteKit.html ran'); return out; }
      try { (0, eval)(kit); } catch (e) { out.bad.push('OneBiteKit.html did not run: ' + e); return out; }
      const missing = kinds.filter(k => !OBK.types[k]);
      if (missing.length) out.bad.push('with the loader holding timers, these kinds were not in the kit when it was made: ' + missing.join(', ') + ' (a lesson started then drops them)');
      if (!TLCORE.actsJoined) out.bad.push('TLCORE.actsJoined is not set once the kit exists');
      const sample = { cloze: { type: 'cloze', t: 'The ___ ran.', o: ['dog', 'blue'], a: 'dog' }, evidence: { type: 'evidence', q: 'Why did Dovid run?', p: ['Dovid ran.', 'He was late.'], a: 1, look: 'why he ran' },
        combine: { type: 'combine', a: 'Avi was tired.', b: 'He kept walking.', o: ['but', 'so'], j: 'but' } };
      Object.keys(sample).filter(k => kinds.indexOf(k) >= 0).forEach(k => { const e = OBK.err(sample[k], 'B23'); if (e) out.bad.push('OBK.err refused a real ' + k + ' activity: ' + e); });
      return out;
    }, [js('CoreKitActs.html'), js('OneBiteKit.html')]);
    r.bad.forEach(b => fails.push('late kinds: ' + b));
    if (!fails.length) oks.push('late kinds (gap A6): with the loader holding timers, all ' + r.kinds.length + ' new activity kinds (' + r.kinds.join(', ') + ') are in the kit the moment it exists, and the lesson player joins them before it picks activities');
  } finally { await p.close(); }
  return { fails, oks };
}

module.exports = { source, page };
