/* Tashbar Store, Fun tab: no two items alike (HoS 2026-11-22). Fails if two Fun items share a name (or start with the same two words),
   share a picture (emoji), end up as the same tap blast or the same trail (a trail brings its matching blast and a blast its matching
   trail, so we compare what the boy really gets), or have app colors so close a boy could not tell them apart.
   names(): from src/Store.js alone. effects(pg): on the open boy page (StoreKid.html puts its effect tables on window.TL_STORE_FX). */
const fs = require('fs'), path = require('path'), vm = require('vm');
function items() {
  const c = { MONEY: { TYPES: [] } }; vm.createContext(c);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'Store.js'), 'utf8') + '\n;this.__S = STORE;', c);
  return c.__S.ITEMS.filter(it => it.cat === 'fun').map(it => ({ id: it.id, name: it.name, emoji: it.emoji, slot: it.slot || '' }));
}
function names() {
  const fails = [], fun = items(), norm = s => String(s).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const seen = {}, two = {}, emo = {};
  fun.forEach(it => {
    const n = norm(it.name), t = n.split(' ').slice(0, 2).join(' ');
    if (seen[n]) fails.push('store: "' + it.name + '" has the same name as "' + seen[n] + '"'); else seen[n] = it.name;
    if (two[t]) fails.push('store: "' + it.name + '" and "' + two[t] + '" start with the same words ("' + t + '"): a boy could mix them up'); else two[t] = it.name;
    if (emo[it.emoji]) fails.push('store: "' + it.name + '" and "' + emo[it.emoji] + '" have the same picture ' + it.emoji); else emo[it.emoji] = it.name;
  });
  return { fails, count: fun.length };
}
async function effects(pg) {
  const fun = items();
  return pg.evaluate(fun => {
    const F = window.TL_STORE_FX, fails = []; if (!F) return { fails: ['store: window.TL_STORE_FX is missing (StoreKid.html)'] };
    /* kinds that draw a fixed picture, whatever colors or emojis they carry */
    const FIXED = { bubbles: 1, sparkle: 1, coins: 1 };
    const tapKey = t => t ? (FIXED[t.kind] ? 'kind:' + t.kind : JSON.stringify(t)) : '';
    const tapSeen = {}, trailSeen = {};
    fun.filter(it => it.slot === 'tap' || it.slot === 'trail').forEach(it => {
      const tp = tapKey(F.tapOf(it.id)), tr = F.trailOf(it.id) ? JSON.stringify(F.trailOf(it.id)) : '';
      if (!tp && !tr) fails.push('store: "' + it.name + '" has no effect at all');
      if (tp) { if (tapSeen[tp]) fails.push('store: "' + it.name + '" and "' + tapSeen[tp] + '" make the same tap blast'); else tapSeen[tp] = it.name; }
      /* HoS 2026-11-22: the store picture must look like what he gets. A tap blast with no trail of its own gets the app's glowing streak
         when the mouse or finger moves, so its picture must show that streak (pvRibbon), in that blast's own colors. */
      if (F.pvStatic && it.slot === 'tap' && !tr) { const h = F.pvStatic(it.id, it.emoji), c = (F.tapOf(it.id) || {}).cols || [];
        if (h.indexOf('class="pvrb"') < 0) fails.push('store: "' + it.name + '" picture is missing the streak the boy really gets when he moves');
        else if (c.length && h.indexOf(c[c.length - 1]) < 0) fails.push('store: "' + it.name + '" picture streak is not in its own colors'); }
      if (tr) { if (trailSeen[tr]) fails.push('store: "' + it.name + '" and "' + trailSeen[tr] + '" make the same trail'); else trailSeen[tr] = it.name; }
    });
    /* app colors: how different two palettes look (CIE Lab color difference, averaged over the tint, the second tint, the main color and
       the glow; the near-white page color and the dark text color are left out because every palette has them). Old Royal Purple vs Purim
       was 11 (almost the same); every pair must be 30 or more. */
    const lab = h => { const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => c > .04045 ? ((c + .055) / 1.055) ** 2.4 : c / 12.92);
      const x = (r * .4124 + g * .3576 + b * .1805) / .95047, y = r * .2126 + g * .7152 + b * .0722, z = (r * .0193 + g * .1192 + b * .9505) / 1.08883, f = t => t > .008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
      return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))]; };
    const dist = (a, b) => [1, 2, 3, 5].reduce((s, i) => { const x = lab(a[i]), y = lab(b[i]); return s + Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); }, 0) / 4;
    const cols = fun.filter(it => it.slot === 'color'), minD = { d: 1e9 };
    cols.forEach(it => { if (!F.COLORS[it.id]) fails.push('store: "' + it.name + '" has no app colors'); });
    for (let i = 0; i < cols.length; i++) for (let j = i + 1; j < cols.length; j++) {
      const a = F.COLORS[cols[i].id], b = F.COLORS[cols[j].id]; if (!a || !b) continue; const d = dist(a, b);
      if (d < minD.d) { minD.d = Math.round(d); minD.pair = cols[i].name + ' / ' + cols[j].name; }
      if (d < 30) fails.push('store: "' + cols[i].name + '" and "' + cols[j].name + '" app colors look almost the same (difference ' + Math.round(d) + ', needs 30+)'); }
    return { fails, closest: minD };
  }, fun);
}
module.exports = { names, effects, items };
if (require.main === module) { const r = names(); console.log(r.fails.length ? r.fails.join('\n') : 'STORE NAMES OK (' + r.count + ' Fun items)'); }
