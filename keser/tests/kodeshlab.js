/* KESER GIRLS 3.0 · KODESH: the Chumash & Timeline Lab, played as a made-up girl. The same play-through as 1.0's tests/lib/chumashlab.js,
   run on Keser's own copy in keser/app/kodesh/. It builds and serves the Keser site, opens home, taps קודש straight into the lab and taps
   "Chumash & Timeline Lab". Then:
   1. every timeline picture the lab names is listed for the build (kodesh/pics.js) and is in the built site;
   2. the data loaded (200 shorashim, the milim, 12 prefix/suffix units, 6 stop-sign units, 7 Workshop pesukim); no pasuk writes a Divine Name;
   3. 300 random questions of every kind are well formed;
   4. she PLAYS by taps: Shorashim group 1, Prefix & Suffix unit 1, Stop Signs unit 1 and breaking up pesukim, the first Workshop pasuk,
      the Timeline Level 1 questions in English and in Hebrew, and the Timeline Game; every question screen has a "How to do it" box;
   5. only Keser kit buttons, the house top left on the lab's home, the lesson X on question screens, no money, points or gems, no sideways scroll at 390 px;
   6. it speaks to a girl: no masculine Hebrew instruction is left (לְחַץ, בְּחַר, שֶׁלְּךָ, אַתָּה ...) and no "his own" / "a talmid uses". */
const path = require('path'), os = require('os'), fs = require('fs'), cp = require('child_process'), http = require('http');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png' };
module.exports = async (browser) => {
  const fails = [], oks = [], K = path.join(__dirname, '..'), out = fs.mkdtempSync(path.join(os.tmpdir(), 'keser-lab-'));
  cp.execFileSync(process.execPath, [path.join(K, 'build.js')], { env: Object.assign({}, process.env, { KESER_OUT: out }), stdio: 'pipe' });
  /* 6. a girl's words */
  { const lab = fs.readFileSync(path.join(K, 'app', 'kodesh', 'lab.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const masc = ['לְחַץ', 'בְּחַר', 'בְחַר ', 'לְמַד ', 'שֶׁלְּךָ', 'בְּיָדְךָ', 'אַתָּה', 'הֲיָדַעְתָּ', 'בָּנִיתָ', 'אַשְׁרֶיךָ', 'הִסְתַּכֵּל', 'נַסֵּה', 'הַרְאֵה', 'הַסְתֵּר', 'הַנַּח', 'הַשְׁוֵה', 'סַדֵּר', 'חַסֵּר', 'חַפֵּשׂ', 'זְכֹר', 'מְצָא', 'כַּסֵּה', 'הַתְחֵל', 'תָּקוּעַ', 'צָרִיךְ עֶזְרָה'].filter(w => lab.includes(w));
    /* every button word the lab asks the kit for exists (the reviewer found a blank "Try again" and a backwards "Leave this lesson?" box) */
    const kit = fs.readFileSync(path.join(K, 'app', 'kodesh', 'tlk.js'), 'utf8'), noWord = [...new Set((lab.match(/WORDS\.(\w+)/g) || []).map(w => w.slice(6)))].filter(w => !new RegExp('\\b' + w + '\\s*:').test(kit));
    if (noWord.length) fails.push('Keser Kodesh lab: the Keser kit has no button word for ' + noWord.join(', '));
    if (masc.length) fails.push('Keser Kodesh lab: Hebrew still speaks to a boy: ' + masc.join(', '));
    if (/\bhis own\b|a talmid uses/.test(lab)) fails.push('Keser Kodesh lab: English still speaks to a boy ("his own" / "a talmid uses")'); }
  /* 1. pictures */
  { const lab = fs.readFileSync(path.join(K, 'app', 'kodesh', 'lab.js'), 'utf8'), list = fs.readFileSync(path.join(K, 'app', 'kodesh', 'pics.js'), 'utf8');
    const named = [...new Set(lab.match(/tlab-card-\d\d\.webp/g) || [])], missing = named.filter(f => !list.includes('/pics/' + f) || !fs.existsSync(path.join(out, 'pics', f)));
    if (missing.length) fails.push('Keser Kodesh lab: timeline pictures not in the built site: ' + missing.join(', ')); else oks.push('Keser Kodesh lab: all ' + named.length + ' timeline pictures are in the site'); }
  const srv = http.createServer((q, r) => { const f = path.join(out, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
    if (!f.startsWith(out) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(ok => srv.listen(0, '127.0.0.1', ok));
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } }), pg = await ctx.newPage(), errs = [];
  pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error' && !/fonts\.g/.test(m.text())) errs.push(m.text()); });
  try {
    await pg.goto('http://127.0.0.1:' + srv.address().port + '/home.html'); await pg.waitForFunction(() => window.KHOME);
    await pg.click('.choice[data-go="kodesh"]'); await pg.waitForSelector('#clab', { timeout: 20000 });   /* home: קודש goes straight into the lab */
    fs.mkdirSync(path.join(__dirname, '..', '..', 'tests', 'out'), { recursive: true });
    await pg.screenshot({ path: path.join(__dirname, '..', '..', 'tests', 'out', 'keser-kodesh-lab.png') });
    const vp = pg.viewportSize();
    const r = await pg.evaluate(async () => {
        const out = { bad: [], played: {}, noHow: 0, nonKit: [], money: 0, wide: [] }; const sleep = ms => new Promise(r => setTimeout(r, ms));
        const X = window.CLAB, D = window.CLAB_DATA; if (!X || !D) { out.bad.push('the lab did not load (CLAB / CLAB_DATA missing)'); return out; }
        /* 2. data */
        out.data = { sh: D.sh.length, ml: D.ml.length, units: D.UNITS.length, tunits: D.TUNITS.length, work: D.WORK.length, pes: D.pes.length };
        D.WORK.forEach(w => { if (!D.pes.some(p => p.ref === w.ref && p.t.length === w.words.length)) out.bad.push('Workshop pasuk ' + w.ref + ' is not in the pesukim'); });
        const strip = s => String(s).replace(/[֑-ׇ]/g, '');
        D.pes.forEach(p => p.t.forEach(w => { const s = strip(w); if (/יהוה|אלהים/.test(s) || /(^|־)[לבוה]?אל($|־)/.test(s.replace(/[׃]/g, '')) && /אֵל/.test(w.replace(/[\u0591-\u05AF]/g, '')) || /^(?:[לבו]?)?אדני$/.test(s.replace(/[׃־]/g, '')) && /דֹנָי/.test(w.replace(/[֑-֯]/g, ''))) out.bad.push('pasuk ' + p.ref + ' writes a Divine Name: ' + w); }));
        const banned = /בְּרֵאשִׁית (י״ט:(ה׳|ח׳|ל׳|ל״[א-ח])|ט׳:(כ׳|כ״[א-ה])|ל״ט:(ז׳|ח׳|ט׳|י׳|י״[א-ט]|כ׳))$/; D.pes.forEach(p => { if (banned.test(p.ref)) out.bad.push('pasuk ' + p.ref + ' is not for young girls'); });
        D.ml.concat(D.sh).forEach(x => { if (x.ex && banned.test(x.ex.ref)) out.bad.push('example ' + x.ex.ref + ' is not for young girls'); });
        /* the girl (Keser: one girl per computer until sign-in) */
        try { localStorage.removeItem('clab:keser-girl'); } catch (e) {}
        X.openLab(); await sleep(30); const root = document.getElementById('clab');
        if (!root) { out.bad.push('the lab did not open'); return out; }
        const scan = () => { const b = root.querySelector('.clab-body'); if (root.querySelector('.fbx') && !/How to do it/.test(root.innerHTML)) out.noHow++;
          [...root.querySelectorAll('button')].forEach(x => { if (!x.classList.contains('tlk') && !x.classList.contains('tw') && !x.classList.contains('gap')) out.nonKit.push(x.outerHTML.slice(0, 80)); });
          if (/\bgems?\b|\bpoints\b(?! to)|\$\d|My money|T\$/i.test(root.innerText)) out.money++;
          if (b && b.scrollWidth > b.clientWidth + 2) out.wide.push((root.querySelector('.clab-top h1') || {}).textContent); };
        scan(); out.hub = { tiles: root.querySelectorAll('[data-lab]').length, crowns: !!root.querySelector('.clab-crowns'), house: !!root.querySelector('.clab-top .tlk-home'), x: !!root.querySelector('.clab-top .tlk-x') };
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
        return out; });

      const d = r.data || {};
      r.bad.forEach(b => fails.push('Keser Kodesh lab: ' + b));
      if (d.sh !== 200 || d.units !== 12 || d.tunits !== 6 || d.work !== 7 || !(d.ml > 150) || !(d.pes > 300)) fails.push('Keser Kodesh lab: data incomplete ' + JSON.stringify(d));
      if (r.hub && r.hub.crowns) fails.push('Keser Kodesh lab: the Keser banners must not be on the lab home (M. Heinemann 2026-11-27)');
    if (!r.hub || r.hub.tiles !== 5 || !r.hub.house || r.hub.x) fails.push('Keser Kodesh lab: the lab home must show 5 labs (no Timeline tile, M. Heinemann 2026-11-27) and the house top left (got ' + JSON.stringify(r.hub) + ')');
      if (!r.runX) fails.push('Keser Kodesh lab: a question screen must have the lesson X top left');
      const pl = r.played || {}, want = ['shPractice', 'sh', 'ps', 'tr', 'trBreak', 'pw', 'tl_en', 'tl_he', 'game'], miss = want.filter(k => !pl[k]);
      if (miss.length) fails.push('Keser Kodesh lab: did not play to the end by taps: ' + miss.join(', '));
      if (r.noHow) fails.push('Keser Kodesh lab: ' + r.noHow + ' question screen(s) with no "How to do it" box');
      if (r.nonKit && r.nonKit.length) fails.push('Keser Kodesh lab: buttons not from the button system: ' + [...new Set(r.nonKit)].slice(0, 3).join(' | '));
      if (r.money) fails.push('Keser Kodesh lab: money, points or gems appear on ' + r.money + ' screen(s)');
      if (!/Timeline/.test(r.tlTitle_en || '') || !/צִיר/.test(r.tlTitle_he || '')) fails.push('Keser Kodesh lab: the Timeline must switch between English and Hebrew (got "' + r.tlTitle_en + '" / "' + r.tlTitle_he + '")');
      if (!fails.length) oks.push('Keser Kodesh lab: ' + r.builders + ' questions well formed; played by taps: Shorashim group 1, Prefix & Suffix unit 1, Stop Signs unit 1 and breaking up pesukim, a Workshop pasuk, Timeline Level 1 in English and Hebrew, the Timeline Game; How to do it on every question; kit buttons only; no money');
      /* 390 px: no sideways scroll on any screen played above */
      await pg.setViewportSize({ width: 390, height: 800 });
      const w = await pg.evaluate(async () => { const sleep = ms => new Promise(r => setTimeout(r, ms)), out = []; const X = window.CLAB; if (!X) return out;
        for (const k of ['', 'sh', 'ps', 'tr', 'pw', 'tl']) { X.openLab(k); await sleep(20); const b = document.querySelector('#clab .clab-body'); if (b && b.scrollWidth > b.clientWidth + 2) out.push(k || 'hub'); }
        X.close(); return out; });
      if (w.length || (r.wide || []).length) fails.push('Keser Kodesh lab: sideways scroll at 390 px on: ' + w.concat(r.wide || []).join(', ')); else oks.push('Keser Kodesh lab: no sideways scroll at 390 px');
      await pg.setViewportSize(vp);

  } catch (e) { fails.push('Keser Kodesh lab test stopped: ' + String(e).slice(0, 300)); }
  finally { errs.forEach(e => fails.push('Keser Kodesh lab: ' + e)); await ctx.close(); srv.close(); fs.rmSync(out, { recursive: true, force: true }); }
  return { fails, oks };
};
