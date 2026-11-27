/* W13 quick writes (HoS 2026-11-27): the Writing Workshop's short mode (src/CoreWrite.html, kind:'quick') and the prompts in
   src/CoreDataW13H7.html, as a TEST- boy at 1366x768 and 390 px with a stand-in server.
   Data: every quick write the page registered passes TLCORE.write.err, names a text that is in texts/ with the same title, and uses a
   writing skill that is on the page; no text has more than 2. A lesson that opened a text with quick writes (read or proof) is offered
   one at Level clear (TLCORE.write.quick.forBite); a lesson with no such text is not.
   Screens: the picker shows the text's prompts as tiles; a picked prompt opens on Write (step 1 of 2) with the prompt and the
   "How to do it" box; Next waits for the words; Check is the checklist he must meet; Send goes out once, as 'sent', with the prompt for
   the teacher; the picker then shows that prompt as sent. Every screen: the button system only, one main button at most, the way out top
   left, no sideways scroll. */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
function title(id) { const m = /^(\w+)\./.exec(id); const p = m && path.join(ROOT, 'texts', m[1], id + '.txt'); if (!p || !fs.existsSync(p)) return null; const t = /^title:\s*(.+)$/m.exec(fs.readFileSync(p, 'utf8')); return t ? t[1].trim() : ''; }
module.exports = async function (pg) {
  const fails = [], oks = [];
  const data = await pg.evaluate(() => {
    const W = window.TLCORE && TLCORE.write && TLCORE.write.quick; if (!W) return { none: true };
    const list = (window.W13_QUICK || []).map(q => ({ id: q.id, text: q.text, story: q.story, skill: q.skill, err: TLCORE.write.err(q), kind: q.kind, on: W.of(q.text).some(x => x.id === q.id) }));
    const skills = {}; try { Object.keys(CORE_SKILLS || {}).forEach(j => (CORE_SKILLS[j] || []).forEach(r => { skills[r[0]] = 1; })); } catch (e) {}
    try { (LANG_K8 || []).forEach(r => { skills[r[0]] = 1; }); } catch (e) {}
    return { list, skills, offer: W.forBite({ do: [{ type: 'read', text: 'C23.ST.01' }], your: [] }), offerProof: W.forBite({ do: [], your: [{ type: 'proof', text: 'C23.B1.01' }] }), noOffer: W.forBite({ do: [{ type: 'sort' }], your: [] }) };
  });
  if (data.none) return { fails: ['quick writes: TLCORE.write.quick is not on the page'], oks };
  if (!data.list.length) fails.push('quick writes: src/CoreDataW13H7.html registered none');
  const per = {};
  data.list.forEach(q => {
    per[q.text] = (per[q.text] || 0) + 1;
    if (q.err || q.kind !== 'quick') fails.push('quick writes: ' + q.id + ' is not a good quick write (' + (q.err || 'kind must be quick') + ')');
    if (!q.on) fails.push('quick writes: ' + q.id + ' was not registered on the page');
    const t = title(q.text); if (t == null) fails.push('quick writes: ' + q.id + ' names text ' + q.text + ', which is not in texts/'); else if (t !== q.story) fails.push('quick writes: ' + q.id + ' calls its text "' + q.story + '", but ' + q.text + ' is "' + t + '"');
    if (!data.skills[q.skill]) fails.push('quick writes: ' + q.id + ' uses skill ' + q.skill + ', which is not on the page');
  });
  Object.keys(per).forEach(t => { if (per[t] > 2) fails.push('quick writes: ' + t + ' has ' + per[t] + ' (two per text)'); });
  if (!data.offer || data.offer.text !== 'C23.ST.01' || !data.offerProof || data.offerProof.text !== 'C23.B1.01' || data.noOffer) fails.push('quick writes: Level clear must offer one after a lesson that opened a text with quick writes, and only then (' + JSON.stringify([data.offer, data.offerProof, data.noOffer]) + ')');

  for (const vp of [{ width: 1366, height: 768 }, { width: 390, height: 844 }]) {
    await pg.setViewportSize(vp); const at = vp.width + 'px: ';
    const r = await pg.evaluate(async () => {
      const out = { steps: [], bad: [], sent: [], payload: null }, sleep = ms => new Promise(x => setTimeout(x, ms)), Q = s => document.querySelector(s);
      const orig = window.google.script.run, mine = [];
      const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
        return (...a) => setTimeout(() => { try {
          if (k === 'cwMine') return okf && okf({ ok: true, pieces: mine });
          if (k === 'cwSave') { const p = a[1]; out.sent.push(p.status); if (p.status === 'sent') out.payload = p; const id = p.id || 'CW-qw1'; const i = mine.findIndex(x => x.id === id); const row = Object.assign({}, p, { id }); if (i >= 0) mine[i] = row; else mine.push(row); return okf && okf({ ok: true, id, status: p.status }); }
          return orig[k] ? orig.withSuccessHandler(okf).withFailureHandler(nof)[k](...a) : okf && okf(null); } catch (e) { nof && nof(e); } }, 10); } });
      window.google.script.run = chain(null, null);
      try { Object.keys(localStorage).filter(k => /^cw-.*W13\.QW\./.test(k)).forEach(k => localStorage.removeItem(k)); } catch (e) {}
      const look = async name => { await sleep(120); const el = Q('#cwr'); if (!el) { out.bad.push(name + ': the workshop is not open'); return; }
        const all = [...el.querySelectorAll('button')];
        out.steps.push({ name, mains: el.querySelectorAll('.tlk-main').length, own: all.filter(b => !b.classList.contains('tlk')).length, wide: document.documentElement.scrollWidth > innerWidth + 1 || el.scrollWidth > innerWidth + 1, out: !!el.querySelector('.tlk-x.tlk-at-tl,.tlk-home.tlk-at-tl') }); };
      const type = (sel, v) => { const t = Q(sel); t.value = v; t.dispatchEvent(new Event('input', { bubbles: true })); };
      const next = async () => { Q('#cwr [data-cw=next]').click(); await sleep(80); };
      const W = TLCORE.write.quick, two = W.of('C23.ST.01'), task = two[0];
      let done = W.pick('C23.ST.01', { exit: 'x' }); await sleep(150); await look('1-pick');
      out.tiles = [...document.querySelectorAll('#cwr [data-cw=qpick]')].map(b => b.getAttribute('data-k'));
      Q('#cwr [data-cw=qpick][data-k="' + task.id + '"]').click(); await sleep(150); await look('2-write');
      const s1 = TLCORE.write.state(); out.write = s1 && s1.quick && s1.st === 1 && s1.task === task.id;
      out.prompt = (Q('#cwr .cw-qp p') || {}).textContent; out.how = document.querySelectorAll('#cwr .cw-how li').length; out.prog = (Q('#cwr .cw-top .tlk-pill') || {}).textContent;
      type('[data-cw-text]', 'First Dovid heard a noise.'); await sleep(400); await next(); out.stillWrite = TLCORE.write.state().st === 1; out.writeWhy = (Q('#cwr .cw-why') || {}).textContent;
      type('[data-cw-text]', 'First, Dovid heard a scratch in the sukkah. next, he clicked on his flashlight. Then he saw a little gray squirrel with challah. Last, the boys put the challah in a box with a tight lid');
      await sleep(400); await next(); out.st2 = TLCORE.write.state().st; await look('3-check');
      await next(); out.stillCheck = TLCORE.write.state().st === 2 && TLCORE.write.state().view === 'fix'; out.checkWhy = (Q('#cwr .cw-why') || {}).textContent;
      type('[data-cw-text]', 'First, Dovid heard a scratch in the sukkah. Next, he clicked on his flashlight. Then he saw a little gray squirrel with challah. Last, the boys put the challah in a box with a tight lid.');
      await sleep(400); [...document.querySelectorAll('#cwr [data-cw=self]')].forEach(b => b.click()); await sleep(80); out.checks = TLCORE.write.state().checks; out.sendWord = (Q('#cwr [data-cw=next]') || {}).textContent; await look('4-check-met');
      await next(); await sleep(150); out.view = TLCORE.write.state() && TLCORE.write.state().view; await look('5-sent');
      Q('#cwr [data-cw=close]').click(); out.res = await done;
      done = W.pick('C23.ST.01', { exit: 'x' }); await sleep(200); out.sentTile = (Q('#cwr [data-cw=qpick][data-k="' + task.id + '"]') || {}).getAttribute && Q('#cwr [data-cw=qpick][data-k="' + task.id + '"]').getAttribute('aria-disabled');
      Q('#cwr [data-cw=exit]').click(); await done;
      window.google.script.run = orig; out.want = { ids: two.map(x => x.id), prompt: task.prompt, title: task.title };
      return out;
    }).catch(e => ({ bad: ['crashed: ' + String(e).slice(0, 300)], steps: [], sent: [] }));
    r.bad.forEach(b => fails.push(at + b));
    (r.steps || []).forEach(s => { if (s.mains > 1) fails.push(at + s.name + ': ' + s.mains + ' main buttons'); if (s.own) fails.push(at + s.name + ': ' + s.own + ' button(s) outside the button system'); if (s.wide) fails.push(at + s.name + ': scrolls sideways'); if (!s.out) fails.push(at + s.name + ': the way out must be top left'); });
    if (r.bad.length) continue;
    if (JSON.stringify(r.tiles) !== JSON.stringify(r.want.ids)) fails.push(at + 'the picker must show the text\'s two prompts (' + JSON.stringify(r.tiles) + ')');
    if (!r.write || r.prompt !== r.want.prompt || r.how < 2 || !/1 of 2/.test(r.prog || '')) fails.push(at + 'a picked prompt must open on Write, step 1 of 2, with the prompt and the How to do it box');
    if (!r.stillWrite || !/more words/.test(r.writeWhy || '')) fails.push(at + 'Write: Next must wait for 25 words (' + r.writeWhy + ')');
    if (r.st2 !== 2) fails.push(at + 'Write -> Check did not open');
    if (!r.stillCheck || !/Not yet/.test(r.checkWhy || '')) fails.push(at + 'Check: a missing capital and end mark must keep him on Check and say which line (' + r.checkWhy + ')');
    if (!(r.checks || []).every(Boolean) || !/Send/.test(r.sendWord || '')) fails.push(at + 'Check: after fixing, every line must be met and the button must say Send (' + JSON.stringify(r.checks) + ', ' + r.sendWord + ')');
    if (r.view !== 'sent' || r.sent.filter(s => s === 'sent').length !== 1 || !r.res || !r.res.sent) fails.push(at + 'the quick write must be sent exactly once and reach the sent screen (' + r.sent.join(',') + ', ' + r.view + ')');
    if (!r.payload || r.payload.plan.prompt !== r.want.prompt || r.payload.title !== r.want.title || !(r.payload.rubric || []).length) fails.push(at + 'the teacher must get the prompt, the title and the rubric with his writing');
    if (r.sentTile !== 'true') fails.push(at + 'the picker must show a sent prompt as sent');
  }
  await pg.setViewportSize({ width: 1366, height: 768 });
  if (!fails.length) oks.push('quick writes: ' + data.list.length + ' prompts on ' + Object.keys(per).length + ' texts (each a good quick write, its text and skill real); offered at Level clear after a lesson that opened the text; pick, write (25+ words), check (a checklist he must meet), sent once with the prompt for the teacher; button system only at 1366 and 390');
  return { fails: fails.map(x => /^quick writes/.test(x) ? x : 'quick writes: ' + x), oks };
};
