/* CHUMASH & TIMELINE LAB tests (src/ChumashLab.html + src/ChumashLabData.html, 2026-11-26). Runs on the kid page from tests/run.js
   with made-up boys only, against the pretend server.
   1. Every timeline picture the lab names is in art/pics, and no tlab-card picture in the library is left unused.
   2. The data loaded: 200 shorashim, the milim, 12 prefix/suffix units, 6 stop-sign units, 7 Workshop pesukim, every Workshop pasuk found.
      No pasuk in the data writes out a Divine Name.
   3. Question builders: 300 random questions of every kind are well formed (the right answer is among the choices, a tile build can be made).
   4. A boy PLAYS by taps: Shorashim group 1 (meet, practice, quiz, passed), Prefix & Suffix unit 1 (practice, quiz, passed),
      Stop Signs unit 1 (quiz, passed), the first Workshop pasuk (all four steps), and the Timeline Level 1 questions, in English and in Hebrew,
      and the Level 1 Timeline Game to the end. Every question screen has a "How to do it" box.
   5. Only kit buttons (plus the pasuk's own word and space taps), the house top left on the lab's home, the lesson X on question screens;
      no money, points or gems anywhere; no sideways scroll at 390 px.
   6. The door: shows on the home for a grade 5 boy and a TEST- boy, never for a grade 1 boy. */
const fs = require('fs'), path = require('path');
module.exports = async function (pg) {
  const fails = [], oks = [];
  /* 1. pictures */
  { const src = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'ChumashLab.html'), 'utf8');
    const named = [...new Set((src.match(/tlab-card-\d\d\.webp/g) || []))], lib = fs.readdirSync(path.join(__dirname, '..', '..', 'art', 'pics')).filter(f => /^tlab-card-/.test(f));
    const missing = named.filter(f => lib.indexOf(f) < 0), unused = lib.filter(f => named.indexOf(f) < 0);
    if (missing.length || unused.length) fails.push('Chumash Lab: timeline pictures missing from art/pics: ' + missing.join(', ') + '; in art/pics but unused: ' + unused.join(', '));
    else oks.push('Chumash Lab: all ' + named.length + ' timeline pictures are in the art library'); }
  const vp = pg.viewportSize();
  try { const km = require('./kidmap.js')(); await pg.evaluate(M => { window.__clKM = M; }, km.map); } catch (e) {}
  const r = await pg.evaluate(async () => {
    const out = { bad: [], played: {}, noHow: 0, nonKit: [], money: 0, wide: [] }; const sleep = ms => new Promise(r => setTimeout(r, ms));
    const X = window.CLAB, D = window.CLAB_DATA; if (!X || !D) { out.bad.push('the lab did not load (CLAB / CLAB_DATA missing)'); return out; }
    /* 2. data */
    out.data = { sh: D.sh.length, ml: D.ml.length, units: D.UNITS.length, tunits: D.TUNITS.length, work: D.WORK.length, pes: D.pes.length };
    D.WORK.forEach(w => { if (!D.pes.some(p => p.ref === w.ref && p.t.length === w.words.length)) out.bad.push('Workshop pasuk ' + w.ref + ' is not in the pesukim'); });
    const strip = s => String(s).replace(/[֑-ׇ]/g, '');
    D.pes.forEach(p => p.t.forEach(w => { const s = strip(w); if (/יהוה|אלהים/.test(s) || /(^|־)[לבוה]?אל($|־)/.test(s.replace(/[׃]/g, '')) && /אֵל/.test(w.replace(/[\u0591-\u05AF]/g, '')) || /^(?:[לבו]?)?אדני$/.test(s.replace(/[׃־]/g, '')) && /דֹנָי/.test(w.replace(/[֑-֯]/g, ''))) out.bad.push('pasuk ' + p.ref + ' writes a Divine Name: ' + w); }));
    const banned = /בְּרֵאשִׁית (י״ט:(ה׳|ח׳|ל׳|ל״[א-ח])|ט׳:(כ׳|כ״[א-ה])|ל״ט:(ז׳|ח׳|ט׳|י׳|י״[א-ט]|כ׳))$/; D.pes.forEach(p => { if (banned.test(p.ref)) out.bad.push('pasuk ' + p.ref + ' is not for young boys'); });
    D.ml.concat(D.sh).forEach(x => { if (x.ex && banned.test(x.ex.ref)) out.bad.push('example ' + x.ex.ref + ' is not for young boys'); });
    /* the boy */
    SRV.token = 't'; A.overlay = null; A.play = null; A.st = loadStudent({ id: 'TEST-CL1', name: 'Test Kid' }); A.view = 'hub'; render(); await sleep(30);
    try { localStorage.removeItem('clab:TEST-CL1'); } catch (e) {}
    X.openLab(); await sleep(30); const root = document.getElementById('clab');
    if (!root) { out.bad.push('the lab did not open'); return out; }
    const scan = () => { const b = root.querySelector('.clab-body'); if (root.querySelector('.fbx') && !/How to do it/.test(root.innerHTML)) out.noHow++;
      [...root.querySelectorAll('button')].forEach(x => { if (!x.classList.contains('tlk') && !x.classList.contains('tw') && !x.classList.contains('gap')) out.nonKit.push(x.outerHTML.slice(0, 80)); });
      if (/\bgems?\b|\bpoints\b(?! to)|\$\d|My money|T\$/i.test(root.innerText)) out.money++;
      if (b && b.scrollWidth > b.clientWidth + 2) out.wide.push((root.querySelector('.clab-top h1') || {}).textContent); };
    scan(); out.hub = { tiles: root.querySelectorAll('[data-lab]').length, house: !!root.querySelector('.clab-top .tlk-home'), x: !!root.querySelector('.clab-top .tlk-x') };
    /* 3. builders */
    const G = X.groups(); let nq = 0;
    for (let t = 0; t < 300; t++) { try {
      const k = t % 2 ? 'sh' : 'ml', gs = k === 'sh' ? G.SHG : G.MLG, g = t % gs.length, it = gs[g][t % gs[g].length], pool = gs.slice(0, Math.max(g + 1, 3)).flat();
      const Q = X.listQ(k, it, pool, [[['he', 'en', 'tf', 'root'][t % 4], 'spell', 'hunt'][t % 3 ? 0 : 1]]); nq++;
      if (Q.opts && Q.opts.indexOf(Q.right) < 0) out.bad.push(k + ' ' + it.id + ': right answer not among the choices');
      if (Q.kind === 'root' && Q.roots.indexOf(Q.right) < 0) out.bad.push(k + ' ' + it.id + ': shoresh not among the choices');
      const u = D.UNITS[t % 12], x = u.items[t % u.items.length], P2 = X.psQ(t % 12, x, [['affix', 'pos', 'part', 'spot'][t % 4]]); nq++;
      if (/What does this word mean|Build the word that means/.test(P2.q || '')) out.bad.push('Prefixes & Suffixes asks to translate a whole word (staff: only the prefixes and suffixes)');
      if (P2.kind === 'spot' && !P2.want.some(Boolean)) out.bad.push('unit ' + (t % 12 + 1) + ' ' + x.w + ': spot question with no letters to tap');
      if (P2.opts && P2.opts.indexOf(P2.right) < 0) out.bad.push('unit ' + (t % 12 + 1) + ' ' + x.w + ': right answer not among the choices');
      const tq = X.trQ(['endTap', 'count', 'tap:esn', 'half', 'name', 'break1', 'break', 'break3', 'tap:zk', 'tap:rv'][t % 10]); nq++;
      if (tq.opts && tq.opts.indexOf(tq.right) < 0) out.bad.push('stop signs ' + tq.kind + ': right answer not among the choices');
      if (tq.kind === 'tap' && !tq.ans.some(Boolean)) out.bad.push('stop signs tap: no word has the sign');
    } catch (e) { out.bad.push('question builder crashed: ' + String(e).slice(0, 160)); break; } }
    out.builders = nq;
    /* 4. play by taps */
    const click = sel => { const b = typeof sel === 'string' ? root.querySelector(sel) : sel; if (b && !b.disabled) { b.click(); return true; } return false; };
    const solve = async () => { const c = X.cur, Q = c && c.Q; if (!Q) return false;
      if (Q.kind === 'spot') { root.querySelectorAll('.qbox .gtile').forEach(b => { if (c.want[+b.dataset.g]) b.click(); }); click('[data-a=chk]'); }
      else if (Q.kind === 'spell' || Q.kind === 'buildparts' || Q.kind === 'affix') { const used = new Set();
        const want = Q.kind === 'spell' ? (() => { const g = []; for (const ch of String(Q.right)) { if (/[א-ת]/.test(ch) || !g.length) g.push(ch); else g[g.length - 1] += ch; } return g; })() : (Q.kind === 'affix' ? Q.order : Q.x.parts).map((_, i) => i);
        for (const w of want) { const j = c.tiles.findIndex((t, j) => !used.has(j) && (Q.kind === 'spell' ? t.t === w : t.i === w)); if (j < 0) return false; used.add(j); click(root.querySelector('.bank [data-j="' + j + '"]')); }
        click('[data-a=chk]'); }
      else if (Q.kind === 'hunt' || Q.kind === 'tap') click(root.querySelectorAll('.qbox button.tw')[c.toks.findIndex(t => t.a)]);
      else if (Q.kind === 'root') { click(root.querySelector('.s1 [data-i="' + c.ch.indexOf(Q.right) + '"]')); await sleep(5); const b = [...root.querySelectorAll('.s2o .clab-opt')].find(b => b.textContent === Q.x.m); click(b); }
      else if (Q.kind === 'break') { root.querySelectorAll('.qbox .gap').forEach(g => { if (c.want[+g.dataset.i]) g.click(); }); click('[data-a=chk]'); }
      else click(root.querySelector('.qbox [data-i="' + c.ch.indexOf(Q.right) + '"]'));
      return true; };
    const runAll = async (label, max) => { let n = 0, wrong = 0;
      for (; n < (max || 120); n++) { await sleep(2); scan();
        if (!root.querySelector('.qbox')) break;
        const nx = root.querySelector('.qbox [data-a=nx]'); if (nx) { if (root.querySelector('.qbox .clab-fb.bad')) wrong++; nx.click(); continue; }
        if (root.querySelector('.qbox [data-a=bk],.qbox [data-a=go]')) break;
        const before = root.querySelector('.qbox').innerHTML; await solve(); await sleep(400); if (root.querySelector('.qbox') && root.querySelector('.qbox').innerHTML === before) { out.bad.push(label + ': stuck at a question'); break; } }
      if (wrong) out.bad.push(label + ': ' + wrong + ' right answer(s) were not accepted'); return n; };
    const P = () => X.prog();
    /* Shorashim group 1 */
    root.querySelector('[data-lab=sh]').click(); await sleep(10); scan(); root.querySelector('[data-u="0"]').click(); await sleep(10); scan();
    root.querySelector('[data-s=meet]').click(); await sleep(10);
    for (let i = 0; i < 10; i++) { scan(); click('[data-a=next]'); await sleep(5); /* spell from memory */
      const x = G.SHG[0][i]; const letters = x.r.replace(/[֑-ׇ]/g, '').split('').map(ch => ({ 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' }[ch] || ch));
      for (const L of letters) click(root.querySelector('.hk[data-c="' + L + '"]')); await sleep(5); if (!click('[data-a=next]')) { out.bad.push('Shorashim: spelling ' + x.r + ' from memory was not accepted'); break; } await sleep(5); }
    await runAll('Shorashim practice', 120); out.played.shPractice = !!(P().steps.sh0 && P().steps.sh0.practice);
    click('.qbox [data-a=go]'); await sleep(10); await runAll('Shorashim quiz', 40); out.played.sh = P().done.sh.indexOf(0) >= 0;
    click('.qbox [data-a=bk]'); await sleep(10);
    /* Prefix & Suffix unit 1 */
    X.openLab('ps'); await sleep(10); scan(); root.querySelector('[data-u="0"]').click(); await sleep(10); scan();
    root.querySelector('[data-s=practice]').click(); await sleep(10); await runAll('Prefix & Suffix practice', 80);
    click('.qbox [data-a=go]'); await sleep(10); await runAll('Prefix & Suffix quiz', 40); out.played.ps = P().done.ps.indexOf(0) >= 0;
    /* Stop Signs unit 1 and unit 6 practice (breaking up pesukim) */
    X.openLab('tr'); await sleep(10); scan(); root.querySelector('[data-u="0"]').click(); await sleep(10); scan();
    root.querySelector('[data-s=quiz]').click(); await sleep(10); await runAll('Stop Signs quiz', 40); out.played.tr = P().done.tr.indexOf(0) >= 0;
    X.openLab('tr'); await sleep(10); P().done.tr = [0, 1, 2, 3, 4]; X.save(); X.openLab('tr'); await sleep(10); root.querySelector('[data-u="5"]').click(); await sleep(10);
    root.querySelector('[data-s=practice]').click(); await sleep(10); await runAll('Break up the pasuk', 40); out.played.trBreak = !!(P().steps.tr5 && P().steps.tr5.practice);
    /* Workshop pasuk 1 */
    X.openLab('pw'); await sleep(10); scan(); root.querySelector('[data-u="0"]').click(); await sleep(10); scan();
    click('[data-a=show]'); await sleep(5); click('[data-a=go2]'); await sleep(5);
    for (let i = 0; i < 80 && !root.querySelector('[data-a=fin]'); i++) { scan(); const w = X.curW; if (!w) { out.bad.push('Workshop: no word to answer (' + (root.querySelector('.askw') || {}).innerHTML + ')'.slice(0, 200)); break; }
      if (w.chunk != null) { const b = [...root.querySelectorAll('.askw .clab-opt')].find(b => b.textContent === w.right); if (!b) { out.bad.push('Workshop: the part\'s English was not among the choices'); break; } b.click(); }
      else if (w.tiles) { for (let n = 0; n < w.x.parts.length; n++) click(root.querySelector('.askw .bank [data-j="' + w.tiles.findIndex(t => t.i === n) + '"]')); click('[data-a=wchk]'); await sleep(3); if (!click('[data-a=wnx]')) { out.bad.push('Workshop: building a word from its pieces was not accepted'); break; } }
      else { const b = [...root.querySelectorAll('.askw .clab-opt')].find(b => b.textContent === w.x.m); if (!b) { out.bad.push('Workshop: the meaning was not among the choices'); break; } b.click(); }
      await sleep(5); }
    click('[data-a=fin]'); await sleep(5); out.played.pw = P().done.pw.indexOf(0) >= 0;
    /* Timeline, English and Hebrew */
    for (const lang of ['en', 'he']) {
      X.openLab('tl'); await sleep(10); scan(); click('[data-lang=' + lang + ']'); await sleep(10); out['tlTitle_' + lang] = (root.querySelector('.clab-card h2') || {}).textContent;
      click('[data-k=l1][data-m=q]'); await sleep(10); let n = 0;
      for (; n < 60; n++) { scan(); const nx = root.querySelector('[data-a=nx]'); if (nx) { nx.click(); await sleep(5); continue; } const q = X.curTl; if (!root.querySelector('.numpad,.clab-opts') || !q) break;
        if (q.t === 'pick') click(root.querySelector('.clab-opt[data-i="' + q.ans + '"]'));
        else if (q.t === 'order') { for (const it of q.items) click(root.querySelector('.clab-opt[data-i="' + q.shown.indexOf(it) + '"]')); }
        else { for (const d of String(q.ans)) click(root.querySelector('[data-n="' + d + '"]')); click('[data-a=chk]'); }
        await sleep(5); if (!root.querySelector('[data-a=nx]')) { out.bad.push('Timeline (' + lang + '): a right answer was not accepted (' + q.part + ')'); break; } }
      out.played['tl_' + lang] = !!P().tl.done.l1 && !!root.querySelector('[data-a=hm]'); P().tl.done = {}; X.save(); }
    /* Timeline game */
    X.openLab('tl'); await sleep(10); click('[data-lang=en]'); await sleep(5); click('[data-k=l1][data-m=g]'); await sleep(10); scan();
    for (let i = 0; i < 60 && X.game && !X.game.done; i++) { const want = X.game.items[X.game.next]; const b = [...root.querySelectorAll('.gpool .clab-opt')].find(b => X.game.items[+b.dataset.i] === want); if (!b) break; b.click(); await sleep(3); }
    out.played.game = !!(X.game && X.game.done && X.game.miss === 0); scan();
    out.runX = !!root.querySelector('.clab-top .tlk-x');
    X.close(); await sleep(10);
    /* 6. the door */
    const km = window.__clKM; if (km) { const show = async (id, g) => { const M = JSON.parse(JSON.stringify(km)); M.sid = id; M.grade = g; window.TL_MAP = M; A.overlay = null; A.play = null; A.st = loadStudent({ id, name: 'Made-up Boy' }); A.view = 'hub'; GM.sid = ''; GM.tab = 'home'; GM.sig = ''; render(); await sleep(900); return !!document.getElementById('clab-door'); };
      out.door = { g5: await show('MADEUP-G5', 5), test: await show('TEST-CL2', 1), g1: await show('MADEUP-G1', 1) };
      const d = document.getElementById('clab-door'); window.TL_MAP = null; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); render(); }
    return out; });
  const d = r.data || {};
  r.bad.forEach(b => fails.push('Chumash Lab: ' + b));
  if (d.sh !== 200 || d.units !== 12 || d.tunits !== 6 || d.work !== 7 || !(d.ml > 150) || !(d.pes > 300)) fails.push('Chumash Lab: data incomplete ' + JSON.stringify(d));
  if (!r.hub || r.hub.tiles !== 6 || !r.hub.house || r.hub.x) fails.push('Chumash Lab: the lab home must show 6 labs and the house top left (got ' + JSON.stringify(r.hub) + ')');
  if (!r.runX) fails.push('Chumash Lab: a question screen must have the lesson X top left');
  const pl = r.played || {}, want = ['shPractice', 'sh', 'ps', 'tr', 'trBreak', 'pw', 'tl_en', 'tl_he', 'game'], miss = want.filter(k => !pl[k]);
  if (miss.length) fails.push('Chumash Lab: did not play to the end by taps: ' + miss.join(', '));
  if (r.noHow) fails.push('Chumash Lab: ' + r.noHow + ' question screen(s) with no "How to do it" box');
  if (r.nonKit && r.nonKit.length) fails.push('Chumash Lab: buttons not from the button system: ' + [...new Set(r.nonKit)].slice(0, 3).join(' | '));
  if (r.money) fails.push('Chumash Lab: money, points or gems appear on ' + r.money + ' screen(s)');
  if (r.door && (!r.door.g5 || !r.door.test || r.door.g1)) fails.push('Chumash Lab door: must show for a grade 5 boy and a TEST- boy and never for a grade 1 boy (got ' + JSON.stringify(r.door) + ')');
  if (!/Timeline/.test(r.tlTitle_en || '') || !/צִיר/.test(r.tlTitle_he || '')) fails.push('Chumash Lab: the Timeline must switch between English and Hebrew (got "' + r.tlTitle_en + '" / "' + r.tlTitle_he + '")');
  if (!fails.length) oks.push('Chumash Lab: ' + r.builders + ' questions well formed; played by taps: Shorashim group 1, Prefix & Suffix unit 1, Stop Signs unit 1 and breaking up pesukim, a Workshop pasuk, Timeline Level 1 in English and Hebrew, the Timeline Game; How to do it on every question; kit buttons only; no money; door for grade 3+ and TEST- boys only');
  /* 390 px: no sideways scroll on any screen played above */
  await pg.setViewportSize({ width: 390, height: 800 });
  const w = await pg.evaluate(async () => { const sleep = ms => new Promise(r => setTimeout(r, ms)), out = []; const X = window.CLAB; if (!X) return out;
    for (const k of ['', 'sh', 'ps', 'tr', 'pw', 'tl']) { X.openLab(k); await sleep(20); const b = document.querySelector('#clab .clab-body'); if (b && b.scrollWidth > b.clientWidth + 2) out.push(k || 'hub'); }
    X.close(); return out; });
  if (w.length || (r.wide || []).length) fails.push('Chumash Lab: sideways scroll at 390 px on: ' + w.concat(r.wide || []).join(', ')); else oks.push('Chumash Lab: no sideways scroll at 390 px');
  await pg.setViewportSize(vp);
  return { fails, oks };
};
