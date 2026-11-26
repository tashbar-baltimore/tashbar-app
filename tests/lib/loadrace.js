/* LOAD RACE (gap A6): a lesson must never start before the Core activity kinds (src/CoreKitActs.html) have joined the One Bite kit.
   The page loader (src/Speed.js) holds every timer a piece starts until the last piece has run, then replays a tap made during loading at once.
   CoreKitActs used to join on a 50 ms timer, so a held tap started the lesson first and its cloze / evidence / combine ... activities were
   dropped as "unknown" (a boy got 1 "with me" + 2 "your turn" with no warning).
     held(): CoreKitActs then OneBiteKit run with every timer held (never fired): the kinds are in the kit as soon as OneBiteKit has run.
     page(pg): on the real page, take the Core kinds back out and clear the joined flag, then set up a core lesson that uses them:
               it gets every one of its activities (OneBite.html joins the kinds before it sets a lesson up). */
const fs = require('fs'), path = require('path'), vm = require('vm');
const SRC = path.join(__dirname, '..', '..', 'src');
const body = f => fs.readFileSync(path.join(SRC, f), 'utf8').replace(/^[\s\S]*?<script>/, '').replace(/<\/script>[\s\S]*$/, '');
function held() {
  const fails = [], oks = []; const timers = [];
  const el = () => ({ style: {}, setAttribute() {}, appendChild() {}, classList: { add() {}, remove() {} } });
  const doc = { getElementById: () => null, createElement: el, head: el(), body: el(), documentElement: el(), addEventListener() {}, querySelector: () => null, querySelectorAll: () => [] };
  const win = { document: doc, setTimeout: f => { timers.push(f); return timers.length; }, setInterval: f => { timers.push(f); return timers.length; }, clearTimeout() {}, clearInterval() {},
    addEventListener() {}, matchMedia: () => ({ matches: false }), console: { log() {}, warn() {}, error() {} }, navigator: {}, localStorage: { getItem: () => null, setItem() {} } };
  win.window = win; win.self = win; const ctx = vm.createContext(win);
  try {
    vm.runInContext(body('CoreKitActs.html'), ctx, { filename: 'CoreKitActs.html' });
    const before = vm.runInContext('!!(window.TLCORE && window.TLCORE.actsJoined)', ctx);
    vm.runInContext(body('OneBiteKit.html'), ctx, { filename: 'OneBiteKit.html' });
    const r = JSON.parse(vm.runInContext('JSON.stringify({ joined: !!(TLCORE && TLCORE.actsJoined), kinds: Object.keys(TLCORE.acts || {}), missing: Object.keys(TLCORE.acts || {}).filter(k => !OBK.types[k]) })', ctx));
    if (before) fails.push('load race: CoreKitActs says it joined before the kit exists (test is not testing anything)');
    if (!r.kinds.length) fails.push('load race: CoreKitActs gave no activity kinds');
    else if (!r.joined || r.missing.length) fails.push('load race: with the loader holding timers, the Core activity kinds are not in the kit when OneBiteKit has run (missing: ' + r.missing.join(', ') + '); a tap replayed after loading would start a lesson without them');
    else oks.push('load race (gap A6): the ' + r.kinds.length + ' Core activity kinds join the kit the moment it exists, with every timer held (' + timers.length + ' held timers never fired)');
  } catch (e) { fails.push('load race check crashed: ' + String(e && e.stack || e).slice(0, 300)); }
  return { fails, oks };
}
async function page(pg) {
  const fails = [], oks = [];
  const r = await pg.evaluate(() => {
    const out = {}; const acts = window.TLCORE && TLCORE.acts; if (!acts || !window.OBK || !window.OB || !OB.kitOrder || !window.ONE_BITE) { out.err = 'the page has no TLCORE.acts / OBK / OB.kitOrder'; return out; }
    const kinds = Object.keys(acts);
    const id = Object.keys(ONE_BITE).find(k => { const b = ONE_BITE[k] || {}; return [].concat(b.do || [], b.your || []).some(d => d && kinds.indexOf(d.type) >= 0); });
    if (!id) { out.err = 'no One Bite lesson uses a Core activity kind'; return out; }
    out.id = id; out.full = OB.kitOrder(id).length;
    const warn = console.warn, warned = []; console.warn = function () { warned.push([].join.call(arguments, ' ')); };
    const keep = {}; kinds.forEach(k => { keep[k] = OBK.types[k]; delete OBK.types[k]; }); TLCORE.actsJoined = false;
    try { out.early = OB.kitOrder(id).length; } finally { console.warn = warn; kinds.forEach(k => { if (!OBK.types[k]) OBK.types[k] = keep[k]; }); TLCORE.actsJoined = true; }
    out.skipped = warned.filter(w => /skipped an activity/.test(w)).length; return out;
  });
  if (r.err) fails.push('load race (page): ' + r.err);
  else if (r.early !== r.full || r.skipped) fails.push('load race (page): ' + r.id + ' set up before the Core kinds joined gets ' + r.early + ' activities instead of ' + r.full + ' (' + r.skipped + ' skipped)');
  else oks.push('load race (page): ' + r.id + ' set up before the Core kinds joined still gets all ' + r.full + ' of its activities');
  return { fails, oks };
}
module.exports = { held, page };
