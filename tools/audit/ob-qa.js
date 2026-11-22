/* One Bite LIVE QA (Lane A2). Loads the kid page with the pretend server and made-up boys (like ob-quick.js), then checks every
   hand-written bite that has do/your activities, in the REAL DOM at 390 px:
     a) kit errors (OBK.err) and activities the player skips; an activity that cannot be finished by tap
     b) layout: card/cell text that overflows or wraps past 2 lines, anything cut off, small targets (48 px; K1 76 px), sideways scroll
     c) age fit: K1 > 3 choices or lines over 12 words; B23 heavy reading; E45 with no "tap the reason"; M68 babyish
     d) variety: fewer than 3 kinds in a bite; the same kind pattern 4+ bites in a row in one lane
     e) taught, then asked: check answers not found in the bite's text (same rule as tests/run.js)
     f) rules: the word "bite" where a boy sees it; Hebrew in an English say/how; the Divine Name; a line break in a card
     g) math a script can check: tenframe/hop/blocks vs their prompt, sums in match pairs, fraction = decimal = percent pairs, even/odd sorts
   Run:  node tools/audit/ob-qa.js            (all bites)   IDS=MATH.OPS.L03,READ.PHON node tools/audit/ob-qa.js   (id prefixes)
   Out:  tools/audit/out/ob-qa.json and tools/audit/out/ob-qa.md (grouped by lane). Report only: it never fails a build. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const B = require('../../tests/lib/build.js');
const FAKE = require('./fake.js');
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const LANES = { OneBiteDataMath: 'B (Math Gr K-3)', OneBiteDataMath2: 'B2 (Math Gr 4-8)', OneBiteDataRead: 'C (Reading K-1)', OneBiteDataWrit: 'C2 (Writing and Language)',
  OneBiteDataRead2: 'C3 (Reading Gr 2-8)', OneBiteDataKodesh: 'D (Kriyah)', OneBiteDataMore: 'E (Science/SS/Computing)' };

/* which data file (lane) writes each id: the last file that mentions 'ID' wins */
function laneMap() { const m = {};
  fs.readdirSync(B.SRC).filter(f => /^OneBiteData.*\.html$/.test(f)).sort().forEach(f => { const t = fs.readFileSync(path.join(B.SRC, f), 'utf8'), base = f.replace(/\.html$/, '');
    const re = /['"]((?:MATH|READ|WRIT|LANG|LK|HEB|SCI|SS|SOC|COMP|LIFE|FACT|VOC|ELEC)\.[A-Z0-9.a-z_]+)['"]/g; let x; while ((x = re.exec(t))) m[x[1]] = LANES[base] || base; });
  return m; }

(async () => {
  const K = B.kid(); const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }); await ctx.addInitScript(FAKE, { tools: K.tools, parts: K.parts });
  const pg = await ctx.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await pg.route('**/*', r => r.request().url() === 'http://app.test/' ? r.fulfill({ contentType: 'text/html', body: K.page }) : r.abort());
  await pg.goto('http://app.test/');
  await pg.waitForFunction(() => window.TLT && typeof BANK_ALL !== 'undefined' && Object.keys(BANK_ALL).length > 500, null, { timeout: 180000 }); await pg.waitForTimeout(15000);
  await pg.evaluate(src => { window.__obkStep = (0, eval)('(' + src + ')'); }, require('../../tests/lib/onebite.js').obkStep.toString());
  const pre = (process.env.IDS || '').split(',').filter(Boolean);
  const res = await pg.evaluate(async pre => {
    const sleep = ms => new Promise(r => setTimeout(r, ms)), S = x => String(x == null ? '' : x), low = x => S(x).toLowerCase().replace(/\s+/g, ' ').trim();
    const words = s => S(s).trim().split(/\s+/).filter(Boolean).length;
    const ids = Object.keys(ONE_BITE).filter(id => { const b = ONE_BITE[id]; return (b.do || b.your) && (!pre.length || pre.some(p => id.indexOf(p) === 0)); }).sort();
    const worldOf = id => { const p = id.split('.')[0], map = /^(LK|HEB)$/.test(p) ? 'LK' : /^(READ|WRIT|LANG)$/.test(p) ? 'READ' : /^(SS|SOC|FACT)$/.test(p) ? 'SS' : /^(COMP|VOC)$/.test(p) ? 'COMP' : p; return WORLD[p] ? p : WORLD[map] ? map : Object.keys(WORLD)[0]; };
    const fresh = () => { A.overlay = null; A.play = null; A.res = null; SRV.token = 't'; SRV.states = {}; A.st = loadStudent({ id: 'TEST-01', name: 'Test Kid' }); A.view = 'hub'; render(); };
    /* text rects of a card, leaving out the corner badges (the ✓ and count numbers) and ghost letters */
    const txtRects = el => { const out = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) { if (!n.textContent.trim() || (n.parentElement && n.parentElement.closest('b,.ghost'))) continue; const r = document.createRange(); r.selectNodeContents(n); [...r.getClientRects()].forEach(q => { if (q.width > 1) out.push(q); }); }
      return out; };
    const textLines = el => { const tops = []; txtRects(el).forEach(q => { if (!tops.some(t => Math.abs(t - q.top) < 4)) tops.push(q.top); }); return tops.length; };
    const textOver = el => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el), L = r.left + parseFloat(cs.borderLeftWidth), R = r.right - parseFloat(cs.borderRightWidth); let w = 0;
      txtRects(el).forEach(q => { w = Math.max(w, q.right - R, L - q.left); }); return w > 2 ? Math.round(w) : 0; };
    const HEB = /[֐-׿]/, NIQ = /[֑-ׇ]/g;
    const divine = s => { const h = S(s).replace(NIQ, ''); return /יהוה|אלהים|אלוהים/.test(h) || /\bGod\b/.test(S(s)); };
    const num = s => { s = S(s).trim().replace(/[¢$]/g, ''); let m; if ((m = s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/))) return +m[1] + m[2] / m[3]; if ((m = s.match(/^(-?\d+)\/(\d+)$/))) return m[1] / m[2];
      if ((m = s.match(/^(-?\d*\.?\d+)\s*%$/))) return m[1] / 100; if (/^-?\d*\.?\d+$/.test(s)) return +s; return null; };
    const expr = s => { s = S(s).replace(/[×x]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-').trim(); if (!/^[\d\s+\-*/().]+$/.test(s) || !/\d\s*[+\-*/]\s*\d/.test(s)) return null; try { const v = Function('return (' + s + ')')(); return isFinite(v) ? v : null; } catch (e) { return null; } };
    const out = {};
    for (const id of ids) {
      const b = ONE_BITE[id], band = b.band || OB.band(id), f = []; const add = (cat, what, fix, sev) => f.push({ cat, what, fix: fix || '', sev: sev || 'warn' });
      const D = b.do || [], Y = b.your || [], all = D.concat(Y);
      /* a) kit errors and skips */
      all.forEach((d, k) => { const e = OBK.err(d, band); if (e) add('kit', (k < D.length ? 'do ' + (k + 1) : 'your ' + (k - D.length + 1)) + ': ' + e, 'fix the activity data to the PLAYBOOK section 10 shape', 'fail'); });
      let ord = []; try { ord = OB.kitOrder(id); } catch (e) {}
      if (ord.length < all.length) add('kit', 'the player skips ' + (all.length - ord.length) + ' of ' + all.length + ' activities', 'do: 1-3, your: 3-5, and fix the kit errors above', 'fail');
      /* c) age fit on the words */
      all.forEach((d, k) => { const tag = (k < D.length ? 'do ' + (k + 1) : 'your ' + (k - D.length + 1)) + ' (' + d.type + ')', say = OBK.say(d), how = OBK.how(d);
        if (band === 'K1') { if (words(say) > 12) add('age', tag + ': spoken line is ' + words(say) + ' words: "' + say + '"', 'K1 lines are 12 words or fewer'); if (words(d.q) > 6) add('age', tag + ': prompt q is long for K1: "' + d.q + '"', 'K1: keep q to a few words'); }
        if (band === 'B23' && words(say) + words(d.q) > 18) add('age', tag + ': heavy reading for Gr 2-3 (' + (words(say) + words(d.q)) + ' words in say + q)', 'Gr 2-3: about 15 words or fewer on screen');
        /* f) rules */
        const vis = [say, how, d.q, d.cap, d.findSay].concat(d.grid || [], (d.pairs || []).flat(), (d.cards || []).map(c => c && c[0]), d.bins || [], d.o || [], d.w || [], d.why ? [d.why.q].concat(d.why.o || []) : []).map(S);
        if (vis.some(v => /\bbites?\b/i.test(v))) add('rules', tag + ': uses the word "bite" (boys never see it)', 'say "lesson" or "level"', 'fail');
        if (!d.he && [say, how, d.hear].some(v => HEB.test(S(v)))) add('rules', tag + ': Hebrew inside an English say/how/hear (the computer voice cannot read it)', 'move the Hebrew to a tile/card with he:true, or use a recorded clip', 'fail');
        if (vis.some(divine)) add('rules', tag + ': the Divine Name is written', 'use ה׳ (and אלקים for Elokim); in English write Hashem', 'fail');
        const cardTxt = (d.grid || []).concat((d.pairs || []).flat(), (d.cards || []).map(c => c && c[0]), d.w || []).map(S);
        if (cardTxt.some(v => /\n/.test(v))) add('display', tag + ': a card has a line break (\\n)', 'until the kit honors \\n, it shows as a space; keep it short', 'info');
        /* g) math */
        const m2 = S(d.q || d.say).match(/^\s*(\d+)\s*([+\-−])\s*(\d+)\s*(?:=\s*\??)?\s*(?:[.?!]|$)/);   /* only a plain "a + b" prompt, not "83 - 25: first - 20" */
        if (m2) { const a = +m2[1], c = m2[2] === '+' ? +m2[3] : -m2[3];
          if (d.type === 'tenframe' && d.start === a && d.n !== a + c) add('math', tag + ': "' + m2[0].trim() + '" but the frame wants ' + d.n, 'n should be ' + (a + c), 'fail');
          if (d.type === 'hop' && d.q && d.start === a && d.add !== c) add('math', tag + ': q "' + d.q + '" but the frog hops ' + d.add, 'add should be ' + c, 'fail');
          if (d.type === 'hop' && !d.q && d.start === a && d.add !== c && Math.abs(d.add) > Math.abs(c)) add('math', tag + ': say "' + m2[0].trim() + '" but the frog hops ' + d.add, 'check add', 'warn'); }
        if (d.type === 'blocks' && d.q) { const v = expr(d.q) != null ? expr(d.q) : num(d.q); if (v != null && /^\s*[\d+\-×x*\s]+$/.test(S(d.q)) && v !== d.n) add('math', tag + ': q "' + d.q + '" but blocks build ' + d.n, 'n should be ' + v, 'fail'); }
        if (d.type === 'match') (d.pairs || []).forEach(p => { const L = expr(p[0]) != null ? expr(p[0]) : num(p[0]), R = expr(p[1]) != null ? expr(p[1]) : num(p[1]);
          const plainL = num(p[0]) != null, plainR = num(p[1]) != null;   /* "7 - 3" with "70 - 30" is a related-facts pair, not an equation: only check expression = value, or value = value */
          if (L != null && R != null && Math.abs(L - R) > 1e-9 && (plainL || plainR) && (expr(p[0]) != null || expr(p[1]) != null || /[/%.]/.test(S(p[0]) + S(p[1])))) add('math', tag + ': pair ' + JSON.stringify(p) + ' is not equal (' + (+L.toFixed(4)) + ' vs ' + (+R.toFixed(4)) + ')', 'fix the pair', 'fail'); });
        if (d.type === 'sort' && d.bins && /even/i.test(d.bins.join()) && /odd/i.test(d.bins.join())) { const ev = d.bins.findIndex(x => /even/i.test(x));
          (d.cards || []).forEach(c => { const v = num(c[0]); if (v != null && Number.isInteger(v) && ((v % 2 === 0) !== (c[1] === ev))) add('math', tag + ': ' + c[0] + ' is sorted into the wrong even/odd box', 'fix the bin number', 'fail'); }); }
        if (d.type === 'sort') (d.cards || []).forEach(c => { const v = expr(c[0]); const bn = d.bins[c[1]]; const bv = num(S(bn).replace(/^=\s*/, '')); if (v != null && bv != null && /^=?\s*-?[\d./]+$/.test(S(bn).trim()) && Math.abs(v - bv) > 1e-9) add('math', tag + ': card ' + c[0] + ' = ' + v + ' but goes in "' + bn + '"', 'fix the bin number', 'fail'); });
        if (d.type === 'count' && d.q) { const v = expr(d.q); if (v != null && v !== d.n) add('math', tag + ': q "' + d.q + '" but n is ' + d.n, 'n should be ' + v, 'fail'); }
      });
      /* c) band-level */
      if (band === 'E45' && !all.some(d => d.why)) add('age', 'Gr 4-5 lesson has no "tap the reason" (why:{q,o,a}) on any activity', 'add why to 1-2 activities');
      if (band === 'M68') { const baby = all.filter(d => d.type === 'count' || d.type === 'trace' || (d.type === 'tenframe' && d.n <= 10)).length; if (baby) add('age', 'Gr 6-8 lesson uses ' + baby + ' little-kid activities (count / trace / small ten-frame)', 'use blocks, tiles, sort, match, hop with real numbers');
        if (all.filter(d => d.pic && !/^art:/.test(S(d.pic))).length > 2) add('age', 'Gr 6-8 lesson has many cartoon pictures', 'fewer pictures for Masters'); }
      /* d) variety */
      const kinds = {}; all.forEach(d => kinds[d.type] = 1); if (Object.keys(kinds).length < 3) add('variety', 'only ' + Object.keys(kinds).length + ' kinds of activity (' + Object.keys(kinds).join(', ') + ')', 'mix in a 3rd kind');
      /* e) taught, then asked */
      let items = []; try { items = buildMission(id); } catch (e) {}
      const taught = low(JSON.stringify(items.filter(x => x.phase !== 'check')) + JSON.stringify((window.TL_TEACH || {})[id] || '') + JSON.stringify(b));
      items.filter(x => x.phase === 'check' && (x.t === 'mc' || x.t === 'type') && typeof x.correct === 'string' && x.correct.length > 2).forEach(x => { const a = low(JSON.stringify(x.correct).slice(1, -1)); if (a && taught.indexOf(a) < 0) add('taught', 'check "' + S(x.q).slice(0, 70) + '" answer "' + x.correct.slice(0, 40) + '" is never shown', 'put "' + x.correct.slice(0, 40) + '" in watch/oops/an activity', 'warn'); });
      /* b) layout in the real DOM, each activity, stepping it to the end by tap */
      const min = band === 'K1' ? 76 : 48, seen = {};
      for (let k = 0; k < ord.length; k++) {
        fresh(); await sleep(5); startMission(worldOf(id), id, 'skill'); await sleep(5);
        const p = A.play; if (!p || !p.ob || !p.ob.kitOn) { add('kit', 'did not open with activities', '', 'fail'); break; }
        const inDo = k < p.ob.kitDo.length, acts = inDo ? p.ob.kitDo : p.ob.kitYour, i = inDo ? k : k - p.ob.kitDo.length, d = acts[i];
        p.ob.stage = inDo ? 'do' : 'your'; p.ob.kit = { list: p.ob.stage, acts, i, streak: 0, n: 0, s: OBK.init(d, {}) }; render(); await sleep(5);
        const tag = (inDo ? 'do ' : 'your ') + (i + 1) + ' (' + d.type + ')';
        const meas = () => { const app = document.getElementById('app');
          if (document.documentElement.scrollWidth > innerWidth + 1) { const key = 'side'; if (!seen[key + k]) { seen[key + k] = 1; add('layout', tag + ': the page scrolls sideways (' + document.documentElement.scrollWidth + ' px)', 'shorten the widest card/tile', 'fail'); } }
          app.querySelectorAll('.obk-card,.obk-fc,.obk-m,.obk-tile,.obk-slot,.obk-opt,.obk-bin-t,.obk-q,.obk-obj').forEach(el => { const r = el.getBoundingClientRect(); if (!r.width) return; const t = (el.innerText || '').replace(/\s*\n\s*[✓\d]+$/, '').trim().slice(0, 30);
            const ln = textLines(el), cls = el.className.split(' ')[0];
            const ov = textOver(el); if (ov && !seen['ov' + cls + t]) { seen['ov' + cls + t] = 1; add('layout', tag + ': "' + t + '" sticks out of its ' + cls.replace('obk-', '') + ' by ' + ov + ' px', 'shorten it (or use \\n to stack, once the kit honors it)', 'fail'); }
            else if (ln > 2 && !seen['ln' + cls + t]) { seen['ln' + cls + t] = 1; add('layout', tag + ': "' + t + '" wraps to ' + ln + ' lines in a ' + cls.replace('obk-', ''), 'shorten it to fit 2 lines'); }
            if ((r.right > innerWidth + 1 || r.left < -1) && !seen['cut' + t]) { seen['cut' + t] = 1; add('layout', tag + ': "' + t + '" is cut off at the edge', 'fewer or shorter items', 'fail'); } });
          app.querySelectorAll('.obk [data-obk]').forEach(el => { const r = el.getBoundingClientRect(); if (!r.width || el.classList.contains('ob-link')) return; const s = Math.min(r.width, r.height), grid = el.matches('.obk-cell,.obk-obj,.obk-tb,.obk-ob'), mn = grid ? 44 : min;   /* ten-frame cells, count pictures and the blocks on the mat are kit grids (the kit owns their size): 44 px */
            if (s < mn && !seen['tg' + el.className + k]) { seen['tg' + el.className + k] = 1; add('layout', tag + ': a tap target is ' + Math.round(r.width) + 'x' + Math.round(r.height) + ' px (' + el.className.split(' ')[0] + '); want ' + mn, band === 'K1' ? 'fewer items in the grid (K1 targets are 76 px)' : 'fewer items', s < 44 ? 'fail' : 'warn'); } }); };
        meas(); let n = 0, last = '';
        while (n++ < 60) { const s = p.ob.kit && p.ob.kit.s; if (!s || s.over) break; const a = window.__obkStep(false); if (/^no |missing|unknown|nokit/.test(a)) { add('kit', tag + ': cannot be finished by tap (' + a + ')', 'check the data', 'fail'); break; } await sleep(1); meas(); last = a; }
        const s = p.ob.kit && p.ob.kit.s; if (s && !s.over) add('kit', tag + ': not finished after 60 taps', 'check the data', 'fail'); else if (s && !s.ok) add('kit', tag + ': the right answer (by tap) was not accepted', 'check the answer data', 'fail');
      }
      out[id] = { band, kinds: all.map(d => d.type), n: all.length, f };
    }
    fresh(); return out; }, pre);
  /* d) the same kind pattern 4+ bites in a row in one lane (ids in order) */
  const lanes = laneMap(), byLane = {};
  Object.keys(res).sort().forEach(id => { const L = lanes[id] || '?'; (byLane[L] = byLane[L] || []).push(id); });
  Object.keys(byLane).forEach(L => { const list = byLane[L]; let run = 1;
    for (let i = 1; i <= list.length; i++) { const sig = i < list.length ? [...new Set(res[list[i]].kinds)].sort().join('+') : null, prev = [...new Set(res[list[i - 1]].kinds)].sort().join('+');
      if (sig === prev) run++; else { if (run >= 4) res[list[i - 1]].f.push({ cat: 'variety', what: run + ' lessons in a row (' + list.slice(i - run, i).join(', ') + ') use the same kinds: ' + prev, fix: 'swap in a different kind in some of them', sev: 'warn' }); run = 1; } } });
  const json = { when: new Date().toISOString(), pageErrors: errs, lanes: byLane, bites: res };
  fs.writeFileSync(path.join(OUT, 'ob-qa.json'), JSON.stringify(json, null, 1));
  let md = '', tot = { fail: 0, warn: 0, info: 0 };
  Object.keys(byLane).sort().forEach(L => { const list = byLane[L]; let sec = '';
    list.forEach(id => { const r = res[id]; if (!r.f.length) return; sec += '- **' + id + '** (' + r.band + ')\n' + r.f.map(x => { tot[x.sev] = (tot[x.sev] || 0) + 1; return '  - ' + (x.sev === 'fail' ? '❗ ' : x.sev === 'info' ? 'ℹ️ ' : '') + '[' + x.cat + '] ' + x.what + (x.fix ? ' → ' + x.fix : ''); }).join('\n') + '\n'; });
    md += '### Lane ' + L + ' (' + list.length + ' lessons with activities, ' + list.filter(id => !res[id].f.length).length + ' clean)\n' + (sec || '- all clean\n') + '\n'; });
  md = 'Checked ' + Object.keys(res).length + ' lessons. ❗ ' + tot.fail + ' must-fix, ' + tot.warn + ' should-fix, ' + (tot.info || 0) + ' info. Page errors: ' + errs.length + '\n\n' + md;
  fs.writeFileSync(path.join(OUT, 'ob-qa.md'), md);
  console.log(md.slice(0, 6000)); await br.close();
})();
