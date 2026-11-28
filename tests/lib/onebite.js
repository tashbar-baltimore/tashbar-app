/* ONE BITE player tests (OneBite.html + OneBiteKit.html, HoS 2026-11-21). Runs on the kid page from tests/run.js with made-up boys only.
   1. Every hand-written bite in window.ONE_BITE: real skill, band, today line, why, a worked example (2+ steps), 2+ ways of learning,
      a Mistake Detective card, ready questions whose answer is among the choices, and a bridge that is a real skill.
      Round 2: every do/your activity is well-formed for the Activity Kit; 1-3 guided, 3-5 practice; 2+ different activity types;
      never the same activity twice in a row; Little Learners get 3 choices at most.
   2. Activity Kit at 390 px: fixture bites use all 10 activity types; each is played by TAP ONLY (taps, tap-tap, tap-dots for trace).
      Every kit screen has 6 dots, at most ONE footer button, big targets and no sideways scroll. "Your turn" stops after 3 right in a row,
      a miss resets the run, and the bite still plays to "mastered". Activity results are recorded as engine results (evidence rows).
   3. Every pilot bite, every bite with do/your and 6 auto-bites play as a TEST- boy through all six steps to "mastered": each screen before
      the questions has 6 dots, a read-aloud line and ONE forward button; no pop-up during the bite; a bite with do/your reaches Show me in
      8 activities or fewer; a bite without them plays at most 2 guided + 5 practice questions; the Bite Done screen shows.
   4. A boy who is not a TEST- boy does not get One Bite while the switch is 'test'. */

/* One tap toward solving the current Activity Kit screen. Runs in the page. It only clicks what a boy can tap
   (and, for trace, taps dots on the canvas). wrong=true makes one wrong tap on pick/sort/find/match screens. */
function obkStep(wrong) {
  const p = A.play, ob = p && p.ob, kit = ob && ob.kit; if (!kit) return 'nokit';
  const d = kit.acts[kit.i], s = kit.s, app = document.getElementById('app'), S = x => String(x);
  const q = sel => app.querySelector(sel), click = el => { if (!el || el.disabled) return false; if (el.click) el.click(); else el.dispatchEvent(new MouseEvent('click', { bubbles: true })); return true; };
  if (s.over) return click(q('.ob-foot [data-ob=knext]')) ? 'next' : 'no next button';
  if (s.phase === 'why') { const j = d.why.o.map(S).indexOf(S(d.why.a)); return click(q('[data-obk=why][data-k="' + j + '"]')) ? 'why' : 'no reason button'; }
  const check = () => click(q('.ob-foot [data-obk=check]')) ? 'check' : 'check button missing or off';
  const tap = (a, k) => click(q('[data-obk="' + a + '"]' + (k == null ? '' : '[data-k="' + k + '"]'))) ? a : 'no ' + a + ' to tap';
  const w = wrong && !s.misses;
  switch (d.type) {
    case 'tenframe': { const f = s.cells.filter(v => v === 1 || v === 2).length; if (f < d.n) { const g = s.cells.indexOf(3); return tap('cell', g >= 0 ? g : s.cells.indexOf(0)); } if (f > d.n) return tap('cell', s.cells.lastIndexOf(1)); return check(); }
    case 'hop': { const b = d.start + d.add; if (d.land) { if (s.pos !== b) return tap('land', w ? b + (d.unit || 1) * (d.add > 0 ? 1 : -1) : b); return check(); } if (s.pos < b) return tap('fwd'); if (s.pos > b) return tap('back'); return check(); }
    case 'count': { if (s.tap.length < d.n) { for (let i = 0; i < d.n; i++) if (s.tap.indexOf(i) < 0) return tap('obj', i); }
      const j = w ? s.o.findIndex((o, k) => o !== S(d.n) && !s.off[k]) : s.o.indexOf(S(d.n)); return tap('pick', j); }
    case 'blocks': { const T = Math.floor(d.n / 10), O = d.n % 10; if (s.t < T) return tap('ten'); if (s.t > T) return tap('rmt', 0); if (s.o < O) return tap('one'); if (s.o > O) return tap('rmo', 0); return check(); }
    case 'tiles': { for (let i = 0; i < d.w.length; i++) { const j = s.slots[i]; if (j >= 0 && s.pool[j] !== S(d.w[i])) return tap('slot', i);
        if (j < 0) { const k = s.pool.findIndex((t, kk) => t === S(d.w[i]) && !s.used[kk]); return tap('tile', k); } } return check(); }
    case 'findall': { const t = (Array.isArray(d.find) ? d.find : [d.find]).map(S); const i = d.grid.findIndex((x, k) => (w ? t.indexOf(S(x)) < 0 : t.indexOf(S(x)) >= 0 && !s.found[k])); return tap('cell', i); }
    case 'match': { const i = d.pairs.findIndex((x, k) => !s.done[k]); if (!s.sel) return tap('L', i); if (s.sel.side === 'L') return tap('R', w ? (s.sel.k + 1) % d.pairs.length : s.sel.k); return tap('L', s.sel.k); }
    case 'sort': { const cur = s.order.find(i => s.place[i] == null); const b = d.cards[cur][1]; return tap('bin', w ? (b + 1) % d.bins.length : b); }
    case 'trace': { const cv = q('canvas[data-obk-trace]'); if (!cv) return 'no trace canvas'; const tg = s.tgt || []; const left = tg.filter(i => !s.hit[i]);
      if (!s.strokes.length || left.length > tg.length * 0.1) { const r = cv.getBoundingClientRect(), n = 25;
        left.slice(0, 12).forEach(i => { const x = r.left + ((i % n) + 0.5) * 12 * r.width / 300, y = r.top + (Math.floor(i / n) + 0.5) * 12 * r.height / 300, o = { clientX: x, clientY: y, bubbles: true, pointerId: 7, isPrimary: true };
          cv.dispatchEvent(new PointerEvent('pointerdown', o)); cv.dispatchEvent(new PointerEvent('pointerup', o)); });
        if (!tg.length) { const r2 = cv.getBoundingClientRect(), o = { clientX: r2.left + 5, clientY: r2.top + 5, bubbles: true, pointerId: 7 }; cv.dispatchEvent(new PointerEvent('pointerdown', o)); cv.dispatchEvent(new PointerEvent('pointerup', o)); }
        return 'trace dots'; }
      return check(); }
    case 'listen': { const j = w ? s.o.findIndex((o, k) => o !== S(d.a) && !s.off[k]) : s.o.indexOf(S(d.a)); return tap('pick', j); }
    /* the seven new kinds (src/CoreKitActs.html), played by tap only, as in tests/lib/coreacts.js, so real lessons that use them play to "mastered" */
    case 'evidence': { const a = (Array.isArray(d.a) ? d.a : [d.a]).map(Number); if (w) return tap('sent', d.p.findIndex((x, k) => a.indexOf(k) < 0)); return tap('sent', a.find(k => !s.hit[k])); }
    case 'combine': { if (w) return tap('join', d.o.map(S).find(x => x !== S(d.j))); return tap('join', S(d.j)); }
    case 'cloze': { if (OBK.ready(d, s)) return check(); return tap('word', S(d.a)); }
    case 'storymap': { if (OBK.ready(d, s)) return check(); const i = s.at.indexOf(-1), want = S(d.cards[i]);
      if (s.sel < 0) return tap('card', s.pool.findIndex((x, jj) => x === want && !s.used[jj])); return tap('box', i); }
    case 'parts': case 'dictation': case 'order': { if (OBK.ready(d, s)) return check(); const list = d.parts || d.w || d.steps, i = s.slots.indexOf(-1), want = S(list[i]);
      return tap(d.type === 'parts' ? 'part' : d.type === 'order' ? 'strip' : 'tile', s.pool.findIndex((x, jj) => x === want && !s.used[jj])); }
    case 'timeline': { const j = d.events.findIndex((x, jj) => s.at[jj] == null); if (j < 0) return 'timeline has no event left'; if (s.sel !== j) return tap('ev', j);
      return tap('card', w ? (d.events[j][1] + 1) % Math.min(d.cards.length, d.open || d.cards.length) : d.events[j][1]); }
    case 'map': { const st = d.steps[s.k]; if (!st) return 'map has no step left'; if (w) { const o = [...document.querySelectorAll('.cka-pin[data-obk=place]')].map(x => x.dataset.k).find(k => k !== st.tap); if (o) return tap('place', o); }
      return tap('place', st.tap); }
    /* the two Reader kinds (src/CoreKitActs.html): the book opens over the lesson; read every page to the end, or tap the proof sentence */
    case 'read': case 'proof': { const R = window.TLCORE && TLCORE.reader, cr = document.getElementById('crd'), cq = sel => cr && cr.querySelector(sel);
      if (R && R.isOpen() && cr) { const st = R.state();
        if (d.type === 'proof' && st.ask && !st.ask.over) { const pf = st.ask.proof[0], all = [...cr.querySelectorAll('[data-crds]')].map(x => +x.getAttribute('data-crds'));
          const i = w && st.ask.tries === 0 ? all.find(k => st.ask.proof.indexOf(k) < 0) : pf; return click(cq('[data-crds="' + i + '"]')) ? 'proof' : 'no proof sentence on the page'; }
        return click(cq('[data-crd=start]') || cq('[data-crd=next]') || cq('[data-crd=finish]')) ? 'page' : 'no way forward in the book'; }
      if (s.busy) return 'book opening';
      if (s.msg && /did not open/.test(s.msg)) return 'no book: ' + s.msg;
      return tap('open'); }
  }
  return 'unknown type ' + d.type;
}

/* Runs in the page (step 1 below). On the main page: the well-formed checks and the Activity Kit fixtures; returns the list of bites
   to play. On every page: leaves the player (window.__obPlay) for step 2. worker = true: an extra page that only plays bites. */
async function oneBiteSetup(worker) {
    const sleep = ms => new Promise(res => setTimeout(res, ms)), o = { bad: [], played: 0, mastered: 0, steps: {}, notTest: null, bites: 0, kitBites: 0, kitTypes: {}, kitActs: 0 };
    if (!window.OB || !window.ONE_BITE) { o.bad.push('OneBite.html did not load (window.OB missing)'); return o; }
    if (!window.OBK) { o.bad.push('OneBiteKit.html did not load (window.OBK missing)'); return o; }
    const has = id => !!((typeof BANK_ALL !== 'undefined' && BANK_ALL[id]) || (typeof GEN !== 'undefined' && GEN[id]));
    const ids = Object.keys(ONE_BITE); o.bites = ids.length;
    if (!worker) ids.forEach(id => { const b = ONE_BITE[id], m = s => o.bad.push(id + ': ' + s);
      if (!has(id)) m('is not a real lesson id');
      if (!/^(K1|B23|E45|M68)$/.test(b.band || '')) m('band must be K1, B23, E45 or M68');
      if (b.hook || b.learn || b.play) { o.nfBites = (o.nfBites || 0) + 1;   /* NEW LESSONS (HoS 2026-11-27): hook + learn + play; the quality gate (obquality.js) checks the teaching rules */
        if (!OB.isNF(b)) { m('a new-shape lesson needs hook, learn (cards) and play (activities)'); return; }
        if (!b.today || String(b.today).split(/\s+/).length > 10) m('needs a short today line (10 words or fewer)');
        if (b.do || b.your) m('a new-shape lesson has play, not do/your');
        (b.hook.o || []).forEach((g, k) => { if (!String(g || '').trim()) m('hook guess ' + (k + 1) + ' is empty'); });
        b.learn.forEach((c, k) => { if (c && c.act) { const e = OBK.err(c.act, b.band); if (e) m('learn ' + (k + 1) + ': ' + e); } if (c && c.m && !OB.model(c.m)) m('learn ' + (k + 1) + ': the picture model does not draw'); });
        b.play.forEach((d, k) => { const e = OBK.err(d, b.band); if (e) m('play ' + (k + 1) + ': ' + e); });
        if (b.bridge && !has(b.bridge)) m('bridge ' + b.bridge + ' is not a real lesson');
        o.kitBites++; return; }
      if (!b.today || String(b.today).split(/\s+/).length > 10) m('needs a short today line (10 words or fewer)');
      if (!b.why) m('needs a why line');
      if (!b.watch || !b.watch.steps || b.watch.steps.length < 2) m('needs a worked example with 2 or more steps');
      if (!b.ways || b.ways.length < 2) m('needs 2 or more ways of learning');
      if (!b.oops || !b.oops.wrong || !b.oops.right || !b.oops.why) m('needs a Mistake Detective card (oops: wrong, right, why)');
      (b.ready || []).forEach((q, k) => { if (!q.q || !q.o || q.o.indexOf(q.a) < 0) m('ready question ' + (k + 1) + ': the answer must be one of the choices'); });
      if (b.bridge && !has(b.bridge)) m('bridge ' + b.bridge + ' is not a real lesson');
      if (b.band === 'K1' && b.watch && b.watch.steps.some(s => String(typeof s === 'object' ? s.t : s).split(/\s+/).length > 14)) m('K1 watch steps must stay short (14 words or fewer)');
      if (b.do || b.your) { o.kitBites++;
        const D = b.do || [], Y = b.your || [];
        if (!Array.isArray(D) || D.length < 1 || D.length > 3) m('do: needs 1 to 3 guided activities (2 is best)');
        if (!Array.isArray(Y) || Y.length < 3 || Y.length > 5) m('your: needs 3 to 5 practice activities');
        D.concat(Y).forEach((d, k) => { const e = OBK.err(d, b.band); if (e) m((k < D.length ? 'do ' + (k + 1) : 'your ' + (k - D.length + 1)) + ': ' + e); });
        const types = {}; D.concat(Y).forEach(d => { if (d && d.type) types[d.type] = 1; }); if (Object.keys(types).length < 2) m('do + your must mix at least 2 different activity types');
        const ord = OB.kitOrder(id); for (let k = 1; k < ord.length; k++) if (ord[k].type === ord[k - 1].type) { m('the same activity (' + ord[k].type + ') comes twice in a row; mix the list'); break; } }
    });

    /* ---- the Activity Kit, all 10 types, tap only, at 390 px ---- */
    const kitScreen = (p, tag) => { const app = document.getElementById('app');
      if (document.querySelectorAll('#app .ob-dots li').length !== (p.ob.bite.nf ? 5 : 6)) return tag + ': no ' + (p.ob.bite.nf ? 5 : 6) + '-dot strip';
      const foot = app.querySelectorAll('.ob-foot .ob-go').length; if (foot > 1) return tag + ': ' + foot + ' footer buttons (want at most 1)';
      const say = app.querySelector('.ob-say'); if (!say || !say.dataset.text) return tag + ': no read-aloud text';
      if (document.documentElement.scrollWidth > window.innerWidth + 1) return tag + ': the page scrolls sideways at ' + window.innerWidth + ' px (' + document.documentElement.scrollWidth + ')';
      const small = [...app.querySelectorAll('.obk [data-obk]')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && Math.min(r.width, r.height) < 44 && !el.classList.contains('ob-link'); });
      if (small.length) return tag + ': a tap target is smaller than 44 px (' + small[0].className + ' ' + Math.round(small[0].getBoundingClientRect().width) + 'x' + Math.round(small[0].getBoundingClientRect().height) + ')';
      return ''; };
    const worldOf = id => { const pre = id.split('.')[0], map = /^(LK|HEB)$/.test(pre) ? 'LK' : /^(READ|WRIT|LANG)$/.test(pre) ? 'READ' : /^(SS|SOC|FACT)$/.test(pre) ? 'SS' : /^(COMP|VOC)$/.test(pre) ? 'COMP' : pre;
      return WORLD[pre] ? pre : WORLD[map] ? map : Object.keys(WORLD)[0]; };
    const fresh = () => { A.overlay = null; A.play = null; A.res = null; SRV.token = 't'; SRV.states = {}; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.view = 'hub'; render(); };
    /* plays one bite to the end; wrongAt: index of the "your" activity that gets one wrong tap first */
    async function play(id, opt) { opt = opt || {}; const s = { id, screens: 0, err: '', kit: 0, your: 0, items: null };
      fresh(); await sleep(15); startMission(worldOf(id), id, 'skill'); await sleep(15);
      const p = A.play; if (!p || !p.ob) { s.err = 'did not open as a bite'; return s; }
      if (!p.ob.kitOn) { const t = p.items.filter(x => x.phase === 'teach').length, pr = p.items.filter(x => x.phase === 'practice').length; if (t > 2 || pr > 5) { s.err = 'no-kit bite plays ' + t + ' guided + ' + pr + ' practice (want at most 2 + 5)'; return s; } }
      const seen = {}; let lastKey = '';
      while (A.view === 'play' && A.play === p && s.screens < 260) { s.screens++;
        if (A.overlay) { s.err = 'a pop-up opened during the bite'; break; }
        const st = p.ob.stage;
        if (st === 'learn' && !p.ob.kit) { seen.learn = 1;
          if (document.querySelectorAll('#app .ob-dots li').length !== 5) { s.err = 'learn screen has no 5-dot strip'; break; }
          const w = p.ob.who, wp = document.querySelector('#app [data-ob=wpick]:not([disabled])');
          if (w && wp) { if (p.ob.wselTried) { s.err = 'Who\'s right? did not take the tap'; break; } p.ob.wselTried = 1; document.querySelector('#app [data-ob=wpick][data-k="' + (+w.a) + '"]').click(); await sleep(3); continue; }
          p.ob.wselTried = 0; const g = document.querySelectorAll('#app .ob-foot .ob-go'); if (g.length !== 1) { s.err = 'learn card ' + (p.ob.li + 1) + ' has ' + g.length + ' forward buttons (want exactly 1)'; break; }
          g[0].click(); await sleep(3); continue; }
        if (st === 'do' || st === 'your' || st === 'learn') { seen[st] = 1; const k = p.ob.kit, key = st + p.ob.li + ':' + k.i;
          if (key !== lastKey) { lastKey = key; const e = kitScreen(p, id + ' ' + st + ' ' + (k.i + 1) + ' (' + k.acts[k.i].type + ')'); if (e) { s.err = e; break; } o.kitTypes[k.acts[k.i].type] = 1; }
          const wrong = st === 'your' && opt.wrongAt === k.i; const a = window.__obkStep(wrong);
          if (/^no |missing|unknown|nokit/.test(a)) { s.err = st + ' ' + (k.i + 1) + ' (' + k.acts[k.i].type + '): ' + a; break; }
          if (/^(book opening|page|proof|open)$/.test(a)) { s.screens--; await sleep(40); continue; }   /* the book (a Reader kind) loads and turns its pages: these steps do not count as screens */
          await sleep(2); continue; }
        if (st !== 'q') { seen[st] = 1;
          const dots = document.querySelectorAll('#app .ob-dots li').length, go = document.querySelectorAll('#app .ob-foot .ob-go').length, say = document.querySelector('#app .ob-say');
          if (dots !== (p.ob.bite.nf ? 5 : 6)) { s.err = st + ' screen has ' + dots + ' dots (want ' + (p.ob.bite.nf ? 5 : 6) + ')'; break; }
          if (!say || !say.dataset.text) { s.err = st + ' screen has no read-aloud text'; break; }
          const hp = document.querySelector('#app [data-ob=hpick]:not([disabled])'); if (hp) { hp.click(); await sleep(3); continue; }
          const opt2 = document.querySelector('#app [data-ob=rpick]:not([disabled])');
          if (opt2) { const q = p.ob.bite.ready[p.ob.ri]; const k = q.o.indexOf(q.a); document.querySelector('#app [data-ob=rpick][data-k="' + k + '"]').click(); await sleep(3); continue; }
          if (go !== 1) { s.err = st + ' screen has ' + go + ' forward buttons (want exactly 1)'; break; }
          document.querySelector('#app .ob-foot .ob-go').click(); await sleep(3); continue; }
        if (!seen.q) { seen.q = 1; s.kit = p.ob.krec ? p.ob.krec.length : 0; s.first = p.results.slice(0, s.kit).filter(r => r && r.ok && r.first).length; s.your = p.ob.krec ? p.ob.krec.filter(x => x.phase === 'practice').length : 0; }
        const it = p.items[p.i]; const el = document.querySelector('.play.ob-play'); if (!el) { s.err = 'question ' + p.i + ' has no calm lesson frame'; break; }
        if (document.querySelectorAll('.play.ob-play .ob-dots li').length !== (p.ob.bite.nf ? 5 : 6)) { s.err = 'question ' + p.i + ' has no ' + (p.ob.bite.nf ? 5 : 6) + '-dot strip'; break; }
        p.shownAt = 0; p.cool = 0; if (it.t === 'write') p.text = new Array((it.min || 5) + 2).join('word ');
        answer(it.t === 'num' ? String(it.a) : it.t === 'write' ? p.text : it.correct); if (!(p.fb && p.fb.ok)) { s.err = 'right answer not accepted at question ' + p.i; break; }
        await sleep(2); next(); await sleep(2); }
      if (!s.err && p.ob.bite.nf) { if (!seen.hook || !seen.learn) s.err = 'skipped Think or Learn';
        else if (!seen.your) s.err = 'skipped Try it';
        else if (s.kit > 10) s.err = 'took ' + s.kit + ' activities to reach Show me (want 10 or fewer)';
        else if (!(A.st.skills[id] && A.st.skills[id].m)) s.err = 'not mastered after ' + s.screens + ' screens';
        else if (A.view !== 'result' || !document.querySelector('#app .ob-done')) s.err = 'no Done screen';
        else if (p.ob.bite.hook.pay && !document.querySelector('#app .ob-pay')) s.err = 'the Done screen does not pay off the hook';
        else s.ok = true; return s; }
      if (!s.err) { if (!seen.today || !seen.watch && p.ob.bite.watch) s.err = 'skipped Today or Watch Me';
        else if (p.ob.kitOn && !seen.your && p.ob.kitYour.length) s.err = 'skipped Your turn';
        else if (p.ob.kitOn && s.kit > 8) s.err = 'took ' + s.kit + ' activities to reach Show me (want 8 or fewer)';
        else if (p.ob.kitOn && p.results.slice(0, s.kit).some(r => !r || r.phase === 'check')) s.err = 'an activity was not recorded as a practice result';
        else if (!(A.st.skills[id] && A.st.skills[id].m)) s.err = 'not mastered after ' + s.screens + ' screens';
        else if (A.view !== 'result' || !document.querySelector('#app .ob-done')) s.err = 'no Bite Done screen';
        else if (p.ob.bite.band === 'K1' && !document.querySelector('#app .ob-party')) s.err = 'no Little Learners celebration on Bite Done';
        else s.ok = true; }
      return s; }
    window.__obO = o; window.__obPlay = id => play(id); window.__obWorldOf = worldOf;
    if (worker) return null;

    o.prev = window.OB_LIVE; window.OB_LIVE = 'test';
    const FIX = ['MATH.OPS.L01.04', 'MATH.CNT.L01.01'].find(has) || Object.keys(BANK_ALL).find(x => /^MATH\..*\.L01\./.test(x)) || Object.keys(BANK_ALL)[0];
    const keep = ONE_BITE[FIX];
    const base = { band: 'K1', pic: '🔢', today: 'Kit test bite', why: 'Testing every activity.', watch: { q: 'Watch', steps: ['One.', 'Two.'] }, oops: { wrong: '1', right: '2', why: 'x' }, ways: ['a', 'b'] };
    const fixtures = [
      { name: 'stops after 3 right in a row', want: { kit: 5, your: 3 }, bite: { do: [{ type: 'tenframe', n: 4 }, { type: 'hop', start: 2, add: 3 }],
        your: [{ type: 'count', n: 5, pic: '🍎' }, { type: 'blocks', n: 13 }, { type: 'tiles', w: ['c', 'a', 't'], extra: ['b'], hear: 'cat' }, { type: 'findall', grid: ['b', 'd', 'b', 'p', 'q', 'b'], find: 'b' }, { type: 'match', pairs: [['🍎', 'a'], ['🐝', 'b'], ['🐱', 'c']] }] } },
      { name: 'a miss resets the run; the list ends; tap the reason', opt: { wrongAt: 0 }, want: { kit: 5, your: 3 }, bite: { do: [{ type: 'findall', grid: ['⚪', '🔺', '⚪', '🟦'], find: '⚪', findSay: 'circle' }, { type: 'match', pairs: [['1', '🍎'], ['2', '🍎🍎']] }],
        your: [{ type: 'sort', bins: ['Circle', 'Not a circle'], cards: [['⚪', 0], ['🔺', 1], ['🟠', 0], ['🟦', 1]] }, { type: 'trace', glyph: 'b' }, { type: 'listen', hear: 'ball', o: ['b', 'd', 'p'], a: 'b', why: { q: 'Why b?', o: ['Ball starts with b', 'It is round'], a: 'Ball starts with b' } }] } },
      { name: 'Explorers: real-world hop, blocks, tiles and count', want: { kit: 5, your: 3 }, bite: { band: 'E45', do: [{ type: 'hop', start: 20, add: 30, unit: 10, q: '20 + 30' }, { type: 'blocks', n: 47 }],
        your: [{ type: 'tiles', w: ['2', '4', '6', '8'] }, { type: 'count', n: 12, pic: 'art:apple', o: ['11', '12', '13', '14'] }, { type: 'tenframe', n: 13, start: 9 }] } },
      { name: 'ten-frame take-away (start > n, n = 0), \\n line breaks in cards, a thin Hebrew letter traced', want: { kit: 5, your: 3 }, bite: { do: [{ type: 'tenframe', n: 4, start: 9 }, { type: 'sort', bins: ['Ball on top', 'Box on top'], cards: [['⚽\n📦', 0], ['📦\n⚽', 1]] }],
        your: [{ type: 'tenframe', n: 0, start: 3 }, { type: 'match', pairs: [['one hundred thirteen', '113'], ['one hundred four', '104'], ['seventeen', '17']] }, { type: 'trace', glyph: 'ז', name: 'Zayin', he: true }] } } ];
    for (const f of fixtures) {
      ONE_BITE[FIX] = Object.assign({}, base, f.bite);
      try { const s = await play(FIX, f.opt); if (s.err) o.bad.push('Activity Kit (' + f.name + '): ' + s.err);
        else if (s.first !== s.kit - (f.opt && f.opt.wrongAt != null ? 1 : 0)) o.bad.push('Activity Kit (' + f.name + '): only ' + s.first + ' of ' + s.kit + ' activities were right on the first try by tap (an activity cannot be solved by tap)');
        else if (s.kit !== f.want.kit || s.your !== f.want.your) o.bad.push('Activity Kit (' + f.name + '): played ' + s.kit + ' activities (' + s.your + ' in Your turn), want ' + f.want.kit + ' (' + f.want.your + ')'); }
      catch (e) { o.bad.push('Activity Kit (' + f.name + '): ' + String(e && e.stack || e).slice(0, 200)); } }
    /* fit-text and line breaks (Lane A2): long match words shrink to 2 lines and stay inside; a \n card stacks its rows */
    try { ONE_BITE[FIX] = Object.assign({}, base, fixtures[3].bite); fresh(); await sleep(10); startMission(worldOf(FIX), FIX, 'skill'); await sleep(10);
      const p = A.play, show = (list, i) => { p.ob.stage = list; const acts = list === 'do' ? p.ob.kitDo : p.ob.kitYour; p.ob.kit = { list, acts, i, streak: 0, n: 0, s: OBK.init(acts[i], {}) }; render(); };
      const lines = el => { const tops = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (!n.textContent.trim() || n.parentElement.closest('b')) continue; const r = document.createRange(); r.selectNodeContents(n); [...r.getClientRects()].forEach(q => { if (q.width > 1 && !tops.some(t => Math.abs(t - q.top) < 4)) tops.push(q.top); }); } return tops.length; };
      const mi = p.ob.kitYour.findIndex(d => d.type === 'match'); show('your', mi); await sleep(5);
      [...document.querySelectorAll('#app .obk-m')].forEach(el => { const r = el.getBoundingClientRect(), t = el.textContent.trim(); if (lines(el) > 2) o.bad.push('Activity Kit fit-text: match item "' + t + '" wraps to ' + lines(el) + ' lines at 390 px (want 2 at most)');
        const rg = document.createRange(); rg.selectNodeContents(el); const tr = rg.getBoundingClientRect(); if (tr.right > r.right + 1 || tr.left < r.left - 1) o.bad.push('Activity Kit fit-text: match item "' + t + '" sticks out of its box'); });
      const si = p.ob.kitDo.findIndex(d => d.type === 'sort'); show('do', si); await sleep(5);
      const card = document.querySelector('#app .obk-card'); if (!card || lines(card) !== 2) o.bad.push('Activity Kit: a sort card with "\\n" must show 2 stacked rows (got ' + (card ? lines(card) : 'no card') + ')');
      /* 3 bins with long names at K1 size stay on the screen */
      p.ob.kitDo[si] = { type: 'sort', bins: ['Beginning', 'Middle', 'End'], cards: [['First', 0], ['Next', 1], ['Last', 2]] }; show('do', si); await sleep(5);
      [...document.querySelectorAll('#app .obk-bin')].forEach(el => { const r = el.getBoundingClientRect(); if (r.right > innerWidth + 1 || r.left < -1) o.bad.push('Activity Kit: sort bin "' + el.textContent.trim() + '" is cut off at the edge at 390 px');
        const t = el.querySelector('.obk-bin-t'), rg = document.createRange(); rg.selectNodeContents(t); const tr = rg.getBoundingClientRect(); if (tr.right > r.right + 1 || tr.left < r.left - 1) o.bad.push('Activity Kit: sort bin name "' + t.textContent + '" sticks out of its box'); });
      const ti = p.ob.kitDo.findIndex(d => d.type === 'tenframe'); show('do', ti); await sleep(5);
      if (document.querySelectorAll('#app .obk-cell.on').length !== 9 || document.querySelector('#app .obk-tray')) o.bad.push('Activity Kit: take-away ten-frame must start with 9 dots he can tap off (and no dot tray)');
      const s = p.ob.kit.s, d = p.ob.kit.acts[ti]; document.querySelector('#app .obk-cell.on').click(); await sleep(2); if (!document.querySelector('#app .obk-cell.gone')) o.bad.push('Activity Kit: tapping a dot in a take-away ten-frame must take it away');
      const r1 = OBK.judge(d, p.ob.kit.s); if (r1.ok) o.bad.push('Activity Kit: take-away ten-frame accepted 8 dots for 9 take away 5'); }
    catch (e) { o.bad.push('Activity Kit (fit-text / take-away draw): ' + String(e && e.stack || e).slice(0, 200)); }
    if (keep) ONE_BITE[FIX] = keep; else delete ONE_BITE[FIX];
    OBK.list.forEach(t => { if (!o.kitTypes[t]) o.bad.push('Activity Kit: the ' + t + ' activity was never shown and played by tap'); });

    /* ---- every real bite (and 6 auto-bites) to mastered: played in step 2 (module.exports) ---- */
    o.list = ids.concat(Object.keys(BANK_ALL).filter((x, i) => i % 230 === 7).slice(0, 6));
    return o;
}

/* pg: the kid page. more: extra kid pages opened the same way (tests/run.js), used only to play the real bites side by side so the
   kit finishes in time; every bite is still played, start to finish, with the same checks, on exactly one page.
   part (tests/run.js PART): this run plays only the bites part.mine picks; the other parts' runs play the rest. */
module.exports = async function oneBiteTests(pg, more, part) {
  const out = { fails: [], oks: [], counts: {} }, pages = [pg].concat(more || []);
  const size = pg.viewportSize();
  /* step 1, on every page: the player helpers (the main page also runs the well-formed checks and the Activity Kit fixtures) */
  const setup = async (page, worker) => { await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(src => { window.__obkStep = (0, eval)('(' + src + ')'); }, obkStep.toString());
    return page.evaluate(oneBiteSetup, worker); };
  const [r] = await Promise.all(pages.map((page, k) => setup(page, k > 0)));
  /* step 2: every real bite (and 6 auto-bites) to mastered, the list shared out over the pages */
  const list = (r.list || []).filter(part ? part.mine : () => true), parts = pages.length;
  const got = await Promise.all(pages.map((page, k) => page.evaluate(async ({ list, part, parts }) => {
    const res = []; window.OB_LIVE = 'test';
    for (let i = part; i < list.length; i += parts) { const id = list[i]; let s;
      /* the boy's page signs out after 5 minutes with no tap (SignOutBar.html IDLE); scripted clicks are not taps, and with 260+ bites
         this loop runs longer than that, so the test boy was signed out mid-run (A.st null). Count each lesson as a tap. */
      try { document.dispatchEvent(new Event('pointerdown')); } catch (e) {}
      try { s = await window.__obPlay(id); } catch (e) { s = { err: String(e && e.stack || e).slice(0, 200) }; }
      res.push({ i, id, err: s.err, kit: s.kit, screens: s.screens }); }
    return { res, kitTypes: window.__obO.kitTypes }; }, { list, part: k, parts })));
  got.map(g => g.res).flat().sort((a, b) => a.i - b.i).forEach(s => { if (s.err) r.bad.push(s.id + ': ' + s.err); else { r.played++; r.mastered++; r.kitActs += s.kit || 0; } r.steps[s.id] = s.screens; });
  got.forEach(g => Object.assign(r.kitTypes, g.kitTypes));
  /* step 3, on the main page: a boy who is not a TEST- boy does not get One Bite; put the page back */
  if (r.list) r.notTest = await pg.evaluate(() => { let notTest; const o = window.__obO, ids = Object.keys(ONE_BITE);
    try { A.overlay = null; A.play = null; A.res = null; A.st = loadStudent({ id: 'BOY-77', name: 'Made-up Boy B' }); A.view = 'hub'; render(); const id = ids[0] || Object.keys(BANK_ALL)[0];
      startMission(window.__obWorldOf(id), id, 'skill'); notTest = !!(A.play && A.play.ob); } catch (e) { notTest = 'crash ' + e; }
    window.OB_LIVE = o.prev; A.play = null; A.res = null; A.overlay = null; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.view = 'hub'; render();
    return notTest; });
  if (size) await pg.setViewportSize(size);
  r.bad.forEach(b => out.fails.push('One Bite: ' + b));
  if (r.notTest !== false) out.fails.push('One Bite: a boy who is not a TEST- boy must not get One Bite while OB_LIVE is "test" (got ' + r.notTest + ')');
  out.counts = { oneBiteHandWritten: r.bites, oneBiteWithActivities: r.kitBites, oneBitePlayed: r.played, oneBiteMastered: r.mastered };
  if (!out.fails.length) out.oks.push('One Bite: ' + r.bites + ' hand-written bites well-formed (' + r.kitBites + ' with activities); Activity Kit: all ' + Object.keys(r.kitTypes).length + ' activity types played by tap at 390 px, 3-in-a-row stop works; ' + r.mastered + ' of ' + (r.played) + ' bites' + ((part && part.tag) || '') + ' played through all 6 steps to Bite Done (one button, 6 dots, read-aloud, no pop-ups); real boys untouched while in test');
  return out;
};
module.exports.obkStep = obkStep;
