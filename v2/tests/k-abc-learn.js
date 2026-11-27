/* 2.0 TEST (v2/tests/, run by tests/run.js): Kindergarten ABC, the calm way (v2/app/k-abc/learn.html, learn.js), Esti 2026-11-27.
   Plays the five games of the sample letter (hear, meet, write, find, read) to the end as a made-up boy with a real mouse,
   at Chromebook size (1366x768, one wrong move each where he can make one: a gentle fix must follow) and phone size (390x844, played perfectly):
   - no page errors, no outside websites; every painted picture on the screen has loaded;
   - each picture is big (at least 1/5 of the screen height on a Chromebook) and on the screen;
   - perfect play earns 3 stars; spoken lines are 12 words or fewer, never "bite", never a letter name, never the Divine Name;
   - every button he can see is 64 px or more; the next button leads to the next game in order.
   Shares the games out between the test kit parts like the other K ABC tests. */
const path = require('path'), fs = require('fs');
const T = require('./k-abc-unit1.js');
const GAMES = ['hear', 'meet', 'write', 'find', 'read'], L = 'p';
module.exports = async function (shared) {
  const out = { fails: [], oks: [] }, bad = m => out.fails.push('2.0 K ABC calm games (' + L + '): ' + m);
  let browser = shared, own = null; try { own = await require('playwright').chromium.launch(); browser = own; } catch (e) {}
  try {
    let dist; try { dist = T.build(); } catch (e) { bad('build failed: ' + String(e.stderr || e).slice(0, 200)); return out; }
    for (const f of ['learn.html', 'learn.js', 'art/pics/pot.webp', 'art/mendy-idle.webp']) if (!fs.existsSync(path.join(dist, 'k-abc', f))) bad(f + ' is not in the built site');
    const pm = /^(\d+)\/(\d+)$/.exec(process.env.PART || '1/1'), pk = pm ? +pm[1] : 1, pn = pm ? +pm[2] : 1, MINE = GAMES.filter((g, i) => i % pn === pk - 1);
    for (const [w, h] of [[1366, 768], [390, 844]]) for (const g of MINE) {
      const label = g + ' ' + w + 'x' + h, { ctx, pg, errs, outside } = await T.open(browser, dist, w, h, '/k-abc/learn.html?l=' + L + '&g=' + g + '&fast=1');
      try {
        const wrong = w === 1366 && g !== 'write';
        let looked = false;
        const r = await T.play(pg, { wrong, shot: async nm => { if (!/^round[2-3]$/.test(nm) || looked) return; looked = true;
          const it = await pg.evaluate(() => ({ items: window.__abc.items(), imgs: [...document.querySelectorAll('#board img')].map(i => ({ ok: i.complete && i.naturalWidth > 0, src: i.getAttribute('src'), h: i.parentElement.getBoundingClientRect().height })) }));
          it.imgs.forEach(i => { if (!i.ok) bad(label + ': the picture ' + i.src + ' did not load'); if (w === 1366 && i.h < h / 5) bad(label + ': the picture ' + i.src + ' is small (' + Math.round(i.h) + ' px)'); });
          it.items.forEach(i => { if (i.x < 0 || i.x > w || i.y < 0 || i.y > h) bad(label + ': "' + i.name + '" is off the screen'); }); } });
        if (wrong && r.fixes < 1) bad(label + ': a wrong move got no gentle fix');
        if (!wrong && r.stars !== 3) bad(label + ': all right first time, but only ' + r.stars + ' stars');
        if (!r.said.length) bad(label + ': nothing was spoken');
        r.said.forEach(t => { if (t.split(/\s+/).filter(Boolean).length > 12) bad(label + ': a spoken line is longer than 12 words: "' + t + '"');
          if (/\bbites?\b/i.test(t)) bad(label + ': the voice says "bite"');
          if (/\b(ess|em|ay|tee|pee|dee)\b/i.test(t) || /\bletter [a-z]\b/i.test(t) || /(^|[^'\w])[b-hj-zB-HJ-Z](?=[\s!,.?]|$)/.test(t)) bad(label + ': the voice may say a letter name: "' + t + '"');
          if (/\bG-?d\b|\bGod\b/i.test(t)) bad(label + ': the voice says the Divine Name'); });
        const small = await pg.evaluate(() => [...document.querySelectorAll('.btn')].filter(b => getComputedStyle(b).opacity > 0.5 && getComputedStyle(b).pointerEvents !== 'none').map(b => b.getBoundingClientRect()).filter(r => r.width && (r.width < 64 || r.height < 64)).length);
        if (small) bad(label + ': ' + small + ' button(s) smaller than 64 px');
        const nx = await pg.evaluate(() => document.getElementById('next').getAttribute('href')), want = GAMES[GAMES.indexOf(g) + 1];
        if (want ? !nx.startsWith('learn.html?l=' + L + '&g=' + want) : nx !== './') bad(label + ': the next button goes to ' + nx);
      } catch (e) { bad(label + ': ' + String(e).slice(0, 220)); }
      errs.forEach(e => bad(label + ': page error: ' + e)); outside.forEach(x => bad(label + ': reached an outside website: ' + x));
      await ctx.close();
    }
    if (!out.fails.length) out.oks.push('2.0 K ABC calm games (' + L + '): ' + (pn > 1 ? MINE.length + ' of the ' + GAMES.length + ' games (part ' + pk + ' of ' + pn + ')' : 'all ' + GAMES.length + ' games') + ' (hear, meet, write, find, read) play to the end at Chromebook and phone size; wrong moves get a gentle fix; big painted pictures that load; short spoken lines; big buttons');
  } finally { if (own) await own.close().catch(() => {}); }
  return out;
};
