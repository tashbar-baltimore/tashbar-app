/* Core Growth (job T, T-4): the Writing Workshop screens (src/CoreWrite.html) as a TEST- boy, at 1366x768 and 390 px, with a stand-in server.
   Plan: Next waits until every plan box has words, and says which box. Write: a sentence starter goes in where he is typing; the word count
   grows; Next waits for the task's words. Fix: the checklist he must MEET (sentences, capitals and end marks, linking words, his plan, a
   self-check he ticks) and Next waits until every line is met. Finish: title and picture, then Send: the piece goes out once, as 'sent', with
   the checklist. Sent screen. My book shows a published piece. Every screen: the button system only, one main button, the way out top left,
   no sideways scroll. The task data is checked (TLCORE.write.err). */
const TASK = { id: 'ZZTEST.OPIN.01', title: 'Should our class have a pet?', grade: 5, kind: 'opinion', prompt: 'Your class may get a pet. Should it? Tell your opinion and give reasons.',
  strategy: { name: 'POW + TREE', steps: [['P', 'Pick my idea'], ['O', 'Organize my notes'], ['W', 'Write and say more']], more: [['T', 'Topic sentence'], ['R', 'Reasons'], ['E', 'Ending'], ['E', 'Examine']] },
  plan: [{ k: 'topic', label: 'T · My opinion', hint: 'I think our class should…' }, { k: 'r1', label: 'R · Reason 1' }, { k: 'r2', label: 'R · Reason 2' }, { k: 'end', label: 'E · My ending' }],
  starters: ['I think', 'One reason is', 'Another reason is', 'In the end,'], min: 40,
  checks: [{ t: 'I wrote at least 5 sentences.', sentences: 5 }, { t: 'I told my opinion first.', first: 'topic' }, { t: 'I used linking words.', any: ['one reason', 'another', 'also'] },
    { t: 'Every sentence starts with a capital and ends with . ! or ?', caps: true }, { t: 'I used every part of my plan.', plan: true }, { t: 'I read it out loud to myself.', self: true }],
  rubric: ['My opinion is clear', 'Reasons with details', 'Order and linking words', 'Capitals, end marks and spelling'], pics: ['🐠', '🐹', '🦜', '📚'] };
module.exports = async function (pg, shot) {
  const fails = [], oks = [];
  for (const vp of [{ width: 1366, height: 768 }, { width: 390, height: 844 }]) {
    await pg.setViewportSize(vp); const at = vp.width + 'px: ';
    const r = await pg.evaluate(async ([TASK, shots]) => {
      const out = { steps: [], bad: [], sent: [] }, sleep = ms => new Promise(x => setTimeout(x, ms)), Q = s => document.querySelector(s);
      const orig = window.google.script.run, mine = [];
      const chain = (okf, nof) => new Proxy({}, { get(_, k) { if (k === 'withSuccessHandler') return f => chain(f, nof); if (k === 'withFailureHandler') return f => chain(okf, f); if (k === 'withUserObject') return () => chain(okf, nof);
        return (...a) => setTimeout(() => { try {
          if (k === 'cwMine') return okf && okf({ ok: true, pieces: mine });
          if (k === 'cwSave') { const p = a[1]; out.sent.push(p.status); const id = p.id || 'CW-test1'; const i = mine.findIndex(x => x.id === id); const row = Object.assign({}, p, { id, words: (p.text.match(/[A-Za-z0-9’']+/g) || []).length }); if (i >= 0) mine[i] = row; else mine.push(row); return okf && okf({ ok: true, id, status: p.status }); }
          return orig[k] ? orig.withSuccessHandler(okf).withFailureHandler(nof)[k](...a) : okf && okf(null); } catch (e) { nof && nof(e); } }, 10); } });
      window.google.script.run = chain(null, null);
      try { localStorage.removeItem('cw-' + (A.st && A.st.id || 'me') + '-' + TASK.id); } catch (e) {}
      const look = async name => { await sleep(120); const el = Q('#cwr'); if (!el) { out.bad.push(name + ': the workshop is not open'); return; }
        const all = [...el.querySelectorAll('button')];
        out.steps.push({ name, mains: el.querySelectorAll('.tlk-main').length, own: all.filter(b => !b.classList.contains('tlk')).length, wide: document.documentElement.scrollWidth > innerWidth + 1 || el.scrollWidth > innerWidth + 1, out: !!el.querySelector('.tlk-home.tlk-at-tl,.tlk-x.tlk-at-tl') });
        if (shots) { window.__cwShot = name; for (let w = 0; w < 100 && window.__cwShot; w++) await sleep(30); } };
      const type = (sel, v) => { const t = Q(sel); t.value = v; t.dispatchEvent(new Event('input', { bubbles: true })); };
      const next = async () => { Q('#cwr [data-cw=next]').click(); await sleep(80); };
      out.err = TLCORE.write.err(TASK); out.errBad = TLCORE.write.err(Object.assign({}, TASK, { checks: [{ t: 'x', self: true }, { t: 'y', self: true }, { t: 'z', self: true }] }));
      const done = TLCORE.write.open(TASK, { grade: 5 }); await sleep(150); await look('1-plan');
      await next(); out.planWhy = (Q('#cwr .cw-why') || {}).textContent; out.stillPlan = TLCORE.write.state().st === 0;
      type('[data-cwp=topic]', 'our class should get a fish'); type('[data-cwp=r1]', 'fish are calm and quiet'); type('[data-cwp=r2]', 'we learn to care for it'); type('[data-cwp=end]', 'a fish is the best pet'); await sleep(400);
      await next(); out.st1 = TLCORE.write.state().st; await look('2-write');
      Q('#cwr [data-cw-text]').focus(); Q('#cwr [data-cw=starter][data-k="I think"]').click(); await sleep(50); out.starter = Q('#cwr [data-cw-text]').value;
      await next(); out.stillWrite = TLCORE.write.state().st === 1; out.writeWhy = (Q('#cwr .cw-why') || {}).textContent;
      type('[data-cw-text]', 'I think our class should get a fish. One reason is that fish are calm and quiet. another reason is that we learn to care for it. Also, it is fun to watch them swim. In the end, a fish is the best pet for our busy class');
      await sleep(400); out.count = (Q('#cwr .cw-count') || {}).textContent; await next(); out.st2 = TLCORE.write.state().st; await look('3-fix');
      out.checks1 = TLCORE.write.state().checks; await next(); out.stillFix = TLCORE.write.state().st === 2; out.fixWhy = (Q('#cwr .cw-why') || {}).textContent;
      type('[data-cw-text]', 'I think our class should get a fish. One reason is that fish are calm and quiet. Another reason is that we learn to care for it. Also, it is fun to watch them swim. In the end, a fish is the best pet for our busy class.');
      await sleep(400); Q('#cwr [data-cw=self]').click(); await sleep(80); out.checks2 = TLCORE.write.state().checks; await look('4-fix-met');
      await next(); out.st3 = TLCORE.write.state().st; Q('#cwr [data-cw=pic][data-k="🐠"]').click(); await sleep(60); await look('5-finish');
      await next(); await sleep(150); out.view = TLCORE.write.state() && TLCORE.write.state().view; await look('6-sent');
      Q('#cwr [data-cw=close]').click(); out.res = await done;
      mine[0].status = 'published'; mine[0].note = 'Well done!';
      const bk = TLCORE.write.book({ grade: 5 }); await sleep(200); out.book = [...document.querySelectorAll('#cwr .cw-card b')].map(b => b.textContent); await look('7-book');
      Q('#cwr [data-cw=openp]').click(); await sleep(80); out.readNote = (Q('#cwr .cw-note') || {}).textContent; await look('8-book-page');
      Q('#cwr [data-cw=exit]').click(); await bk;
      window.google.script.run = orig;
      return out;
    }, [TASK, !!shot]).catch(e => ({ bad: ['crashed: ' + String(e).slice(0, 300)], steps: [], sent: [] }));
    r.bad.forEach(b => fails.push(at + b));
    (r.steps || []).forEach(s => { if (s.mains > 1) fails.push(at + s.name + ': ' + s.mains + ' main buttons'); if (s.own) fails.push(at + s.name + ': ' + s.own + ' button(s) outside the button system'); if (s.wide) fails.push(at + s.name + ': scrolls sideways'); if (!s.out) fails.push(at + s.name + ': the way out must be top left'); });
    if (r.bad.length) continue;
    if (r.err !== '' || !r.errBad) fails.push(at + 'task check: good task -> "' + r.err + '", task with only self-checks -> "' + r.errBad + '"');
    if (!r.stillPlan || !/My opinion/.test(r.planWhy || '')) fails.push(at + 'Plan: Next must wait for the plan and name the empty box (' + r.planWhy + ')');
    if (r.st1 !== 1) fails.push(at + 'Plan -> Write did not open');
    if (!/^I think $/.test(r.starter || '')) fails.push(at + 'a sentence starter must go into his writing (got "' + r.starter + '")');
    if (!r.stillWrite || !/more words/.test(r.writeWhy || '')) fails.push(at + 'Write: Next must wait for enough words (' + r.writeWhy + ')');
    if (!/ of 40 words/.test(r.count || '')) fails.push(at + 'Write: the word count must show (' + r.count + ')');
    if (r.st2 !== 2) fails.push(at + 'Write -> Fix did not open');
    if (!r.stillFix || !/Not yet/.test(r.fixWhy || '') || (r.checks1 || []).every(Boolean)) fails.push(at + 'Fix: a missing capital and end mark must keep him on Fix and say which line (' + r.fixWhy + ')');
    if (!(r.checks2 || []).every(Boolean)) fails.push(at + 'Fix: after fixing, every checklist line must be met (' + JSON.stringify(r.checks2) + ')');
    if (r.st3 !== 3 || r.view !== 'sent') fails.push(at + 'Finish -> Send did not reach the sent screen (' + r.view + ')');
    if (r.sent.filter(s => s === 'sent').length !== 1) fails.push(at + 'the piece must be sent exactly once (' + r.sent.join(',') + ')');
    if (!r.res || !r.res.sent) fails.push(at + 'the workshop must report the piece as sent');
    if (!r.book || r.book[0] !== 'Should our class have a pet?' || !/Well done/.test(r.readNote || '')) fails.push(at + 'My book must show the published piece and the teacher\'s note (' + JSON.stringify(r.book) + ')');
  }
  await pg.setViewportSize({ width: 1366, height: 768 });
  if (!fails.length) oks.push('Writing Workshop: plan, write (starters, word count), fix (a checklist he must meet: sentences, capitals and end marks, linking words, his plan, a self-check), finish, sent once; My book; button system only at 1366 and 390');
  return { fails: fails.map(x => 'Writing Workshop: ' + x), oks, TASK };
};
module.exports.TASK = TASK;
