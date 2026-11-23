/* Speed.js — v162 (takeover3, HoS 2026-11-13: "no 6-second waits, no 3-second button pushes").
   1. msSignInFast(code): ONE trip to the server at sign-in instead of three (code check, then msLoad, then tmMine).
      Returns exactly what msSignInCode returns, plus .load (= msLoad) and .tm (= tmMine) for a boy. HomePage.html uses it.
   2. Add-ons cached PIECE BY PIECE on the Chromebook (IndexedDB "tashbar-parts"), instead of one 10 MB bundle with one hash.
      After a publish a Chromebook downloads only the pieces that changed. The server also no longer reads every pack
      at every page load just to answer "nothing changed": a pack piece is named by its sha256 from ContentPacks.js.
      The pieces, joined in order, are byte for byte msQuestToolsBody_().js (same files, same order, same try/catch).
      If anything goes wrong the page falls back to the old loader (msQuestToolsGet), so the add-ons always load.
   KEEP IN STEP: TL_PART_FILES must list the same files in the same order as msQuestToolsBody_ in Photos.js. */
var TL_PART_FILES = ['CanteenKid', 'MathMore', 'ReadMore', ['ScienceMore', 'ScienceMore2'], 'ElectivesMore', 'FactsMore', 'TradesMore', 'ComputingMore', 'LifeMore', 'SocialMore',
  'KodeshMore', 'SimchaMore', 'Shine', 'Helpers', 'Review', 'Adapt', 'Motivation', 'JokeJar', 'SimchaLife', 'TalkRebbe', ['KodeshQuestPage', 'KodeshArt2'], 'KinderKriyah',
  'Guides', 'Pictures', ['Music', 'EnergyMusic'], ['HowToDo', 'HowToDo2', 'HowToDo3'], 'FactsHowTo', 'AnswerGuard', 'HomePlus', 'StoreKid', 'Activities', ['KindsMore', 'KindsMore2', 'KindsMore3'], 'RebbePick', 'OlamHaba', 'TorahPlus', 'ChumashPage', 'KriyahMore', ['TorahTracks', 'TaryagQuest'], 'ArenaPage', 'ClassMode', 'HomeLift', 'LearnWays', 'DailyPath', ['BoyLibrary', 'HomeLayout', 'MasteryReview', 'WelcomeJoy', 'HomeFocus', 'LessonPop', 'LearnFlow', 'VoicePro', 'WorldThemeUI', 'KMathGamesUI', 'K1LettersUI', 'LblGateUI'], 'KLessons', 'KReading', 'RealPics', 'ScreenFit', 'KKriyah', 'G1Math', 'G1Reading', 'G2Math', 'G2Reading', 'G3Math', 'G4Math', 'G5Math', 'G6Math', 'G3Reading', 'KLearn', 'KScience', 'KWriting', 'G1Science', 'G1Writing', 'G2Science', 'G2Writing', 'G3Science', 'G3Writing', 'KElectives', 'AlgebraAscent', 'GameMap', 'OneBiteDataMath', 'OneBiteDataRead', 'OneBiteDataWrit', 'OneBiteDataKodesh', 'OneBiteDataMore', 'OneBiteDataRead2', 'OneBiteDataMath2', 'OneBiteDataUpper', 'OneBiteKit', 'OneBite', 'OneBiteMoney', 'BlockBuildersData', 'BlockBuildersUI', 'K1Only'];   /* BLOCK BUILDERS workbook (HoS 2026-11-22), before K1Only */   /* K1Only (HoS 2026-11-22 morning): K-1 boys get the games only, loads last */   /* ONE BITE (HoS 2026-11-21): bite data, then the player, after GameMap */   /* PF stage D: DailyPath LAST, as in msQuestToolsBody_ */

function msSignInFast(code) {
  var r = msSignInCode(code);
  if (r && r.ok) { try { r.url = ScriptApp.getService().getUrl(); } catch (e) {} }   /* v164: the page needs the app's address for the math check, Spark Path and staff: no extra trip later */
  if (!r || !r.ok || r.role !== 'kid') return r;
  try { r.load = msLoad(r.token); } catch (e) { r.load = null; }
  try { r.tm = typeof tmMine === 'function' ? tmMine(r.token) : null; r.tmOk = true; } catch (e) { r.tmOk = false; }
  try { r.map = typeof kmMyMap === 'function' ? kmMyMap(r.token) : null; } catch (e) { r.map = null; }   /* v1 boy's map (KidMap.js): rides along, no extra trip */
  return r;
}

function tlStrip_(t) { return String(t).replace(/^\s*<script>/, '').replace(/<\/script>\s*$/, ''); }
var TL_PART_NOSEP = { ComputingMore: 1, LifeMore: 1, SocialMore: 1, KodeshMore: 1, SimchaMore: 1, Shine: 1, Helpers: 1, Review: 1, Adapt: 1 };   /* msQuestToolsBody_ joins these without "\n;" in front; copied so the pieces match it byte for byte */
function tlWrap_(label, text) { return (TL_PART_NOSEP[label] ? '' : '\n;') + 'try{(0,eval)(' + JSON.stringify(text) + ');}catch(e){console.error("' + label + '",e);}'; }
function tlMd5_(s) { return tlHex_(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, s, Utilities.Charset.UTF_8)); }
function tlHasCode_(name) { try { HtmlService.createHtmlOutputFromFile(name).getContent(); return true; } catch (e) { return false; } }

/* The pieces in order: [{h: hash, get: function () { return the piece's text }}]. */
function tlToolParts_() {
  /* SAFETY: if someone adds a file to msQuestToolsBody_ (Photos.js) and not to TL_PART_FILES, stop here: the page then uses the old loader (slower, still right) */
  var listed = {}; TL_PART_FILES.forEach(function (f) { (typeof f === 'string' ? [f] : f).forEach(function (n) { listed[n] = 1; }); });
  var src = String(msQuestToolsBody_), re = /tlFileText_\('([A-Za-z0-9_]+)'\)/g, m;
  while ((m = re.exec(src))) if (!listed[m[1]]) throw new Error('Speed.js TL_PART_FILES is missing ' + m[1]);
  var out = [{ h: 'M' + tlMd5_(QUEST_TOOLS.js), get: function () { return QUEST_TOOLS.js; } }];
  TL_PART_FILES.forEach(function (f) {
    var names = typeof f === 'string' ? [f] : f, label = names[0];
    var packOnly = names.every(function (n) { return TL_PACKS[n] && !tlHasCode_(n); });
    var build = function () {   /* same rules as msQuestToolsBody_: a missing file gives '' */
      var t = ''; names.forEach(function (n, i) { try { t += (i ? '\n' : '') + tlStrip_(tlFileText_(n)); } catch (e) {} }); return tlWrap_(label, t);
    };
    if (packOnly) {
      out.push({ h: 'P' + names.map(function (n) { return TL_PACKS[n][1].slice(0, 32); }).join('.'), get: function () {
        /* no try here: if a pack cannot be read, the call fails and the page uses the old loader (never cache a broken piece under a pack's name) */
        return tlWrap_(label, names.map(function (n) { return tlStrip_(tlFileText_(n)); }).join('\n')); } });
    } else {
      var js = build(); out.push({ h: 'M' + tlMd5_(js), get: function () { return js; } });
    }
  });
  return out;
}

/* Called by the page's loader: have = the piece hashes this Chromebook already has. Sends only the missing pieces. */
function msQuestToolsParts(have) {
  var got = {}; (have || []).forEach(function (h) { got[String(h)] = 1; });
  var parts = tlToolParts_(), order = [], send = {};
  parts.forEach(function (p) { order.push(p.h); if (!got[p.h] && !send[p.h]) send[p.h] = p.get(); });
  return { v: 2, order: order, parts: send };
}

/* The page's loader (runs in the browser). OLD = the previous loader, used if anything here fails. */
function tlLoader2Src_(OLD) {
  var DBN = 'tashbar-parts', ST = 'p', db = null, done = false;
  /* FAST START (HoS 2026-11-22: "kindergarten and first grade ... opens up just to a white screen for the first 20 seconds"): the
     add-ons (about 40 MB) used to run as ONE block, so a Chromebook could not draw anything until all of them had run. Now the pieces
     run in order, a few at a time, with a short break between, so the screen draws and taps work while they load. The pieces and
     their order are the same as before. A K-1 boy (his K-1 switch or his grade is kept on this Chromebook) sees a friendly
     "getting your games ready" screen, not the big-boy home, until his game path (K1Only, the last piece) has loaded. */
  function k1Wait() { try { if (window.K1O || typeof A === 'undefined' || !A || A.view !== 'hub' || !A.st || !A.st.id) return false;
      var f = localStorage.getItem('tl-k1only'); if (f === '0') return false; if (f === '1') return true;
      var g = localStorage.getItem('tl-k1g:' + A.st.id); return g === '0' || g === '1'; } catch (e) { return false; } }
  function cover(on) { var c = document.getElementById('tl-k1wait'); if (!on) { if (c) c.remove(); return; } if (c || !document.body) return;
    c = document.createElement('div'); c.id = 'tl-k1wait'; c.setAttribute('role', 'status');
    c.style.cssText = 'position:fixed;inset:0;z-index:2147483600;background:#FFF4D6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;font:800 clamp(28px,5vw,48px) system-ui,sans-serif;color:#16202C';
    c.innerHTML = '<div style="font-size:clamp(70px,14vw,140px);animation:tlk1b 1s ease-in-out infinite alternate">🎮</div><div>Getting your games ready…</div><style>@keyframes tlk1b{from{transform:translateY(0)}to{transform:translateY(-18px)}}</style>';
    document.body.appendChild(c); }
  var waitIv = setInterval(function () { if (window.K1O) { clearInterval(waitIv); cover(false); return; } cover(k1Wait()); }, 150);
  function stopWait() { clearInterval(waitIv); cover(false); }
  /* While a piece runs, a timer it starts is HELD until every piece has run, then started. That is what happened when all the
     pieces ran as one block (a timer could not fire in the middle), so the pieces behave exactly as before. Timers started by taps
     and screens between the slices are not held. */
  var W = window, nST = W.setTimeout, nSI = W.setInterval, nCT = W.clearTimeout, nCI = W.clearInterval, held = [], holding = false;
  function mk(k) { return function (f, ms) { if (!holding) return (k === 'i' ? nSI : nST).apply(W, arguments);
    var r = { tl: k, f: f, ms: ms, a: Array.prototype.slice.call(arguments, 2), x: 0, id: null }; held.push(r); return r; }; }
  W.setTimeout = mk('t'); W.setInterval = mk('i');
  W.clearTimeout = W.clearInterval = function (r) { if (r && typeof r === 'object' && r.tl) { r.x = 1; if (r.id != null) { nCT.call(W, r.id); nCI.call(W, r.id); } return; } nCT.call(W, r); nCI.call(W, r); };
  function release() { var list = held; held = []; W.setTimeout = nST; W.setInterval = nSI;
    list.forEach(function (r) { if (!r.x) r.id = (r.tl === 'i' ? nSI : nST).apply(W, [r.f, r.ms].concat(r.a)); }); }
  function run1(js) { holding = true; try { (0, eval)(js); } catch (e) { console.error('QuestTools', e); } holding = false; }
  /* K-1 FIRST (HoS 2026-11-22: "it has to be fast, quick, smooth"): on a Chromebook whose last boy was K-1 (K1Only.html keeps
     tl-k1dev), his games (KL, KR, KK, G1M, G1R) and his game path (K1Only) run FIRST, so his PLAY button shows in a moment. The other
     pieces then run in their own order, and they wait while a game is open, so the games stay smooth. If a boy who is not K-1 signs in
     on that Chromebook, the page loads again once the usual way (in this tab), so nothing changes for him. */
  var K1RE = /window\.(KL|KR|KK|G1M|G1R|K1O)\s*=|\/\* OneBiteData[A-Za-z0-9]*\.html: hand-written/, fast = false;   /* the games, the path, and the lesson pictures (One Bite data) */
  try { fast = localStorage.getItem('tl-k1dev') === '1' && sessionStorage.getItem('tl-load-normal') !== '1'; } catch (e) {}
  function gameOpen() { return !!document.querySelector('#klov,#krov,#kkov,#kkov2,#g1mov,#g1rov'); }
  function notK1() { try { return !!(window.K1O && typeof K1O.on === 'function' && typeof A !== 'undefined' && A && A.st && A.st.id && A.view !== 'signin' && !K1O.on()); } catch (e) { return false; } }
  /* LAZY LOADING, step 1 (HoS 2026-11-22: "do the lazy loading project too ... fast, quick, smooth"):
     - never a half-loaded app: a tap on the home (not the sign-in pad, not a K-1 boy's games) before every piece has run is held,
       a small "One moment..." shows, the rest runs at full speed, and then the tap goes through;
     - smooth: the pieces wait while the boy scrolls or types. */
  var rush = false, lastMove = 0, pending = null, finished = false;
  function wait1(on) { var c = document.getElementById('tl-wait1'); if (!on) { if (c) c.remove(); return; } if (c || !document.body) return;
    c = document.createElement('div'); c.id = 'tl-wait1'; c.setAttribute('role', 'status');
    c.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483646;background:#16202C;color:#fff;padding:18px 28px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.35);font:800 22px system-ui,sans-serif';
    c.textContent = '⏳ One moment…'; document.body.appendChild(c); }
  function allowed(t) { try { if (typeof A === 'undefined' || !A || A.view === 'signin') return true;
      return !!(t && t.closest && t.closest('#k1o,#klov,#krov,#kkov,#kkov2,#g1mov,#g1rov,#tl-wait1')); } catch (e) { return true; } }
  document.addEventListener('click', function (e) { if (finished || allowed(e.target)) return; e.preventDefault(); e.stopImmediatePropagation();
    var el = (e.target && e.target.closest && e.target.closest('button,a,[data-act],[role=button],[onclick]')) || e.target;
    pending = { el: el, tag: el.tagName, id: el.id || '', ds: JSON.stringify(el.dataset || {}), tx: String(el.textContent || '').trim().slice(0, 60) }; rush = true; wait1(true); }, true);
  function same(p) { if (p.el && p.el.isConnected) return p.el; var all = document.querySelectorAll(p.tag);
    for (var k = 0; k < all.length; k++) { var x = all[k]; if ((x.id || '') === p.id && JSON.stringify(x.dataset || {}) === p.ds && String(x.textContent || '').trim().slice(0, 60) === p.tx) return x; } return null; }
  ['wheel', 'touchmove', 'keydown'].forEach(function (n) { document.addEventListener(n, function () { lastMove = Date.now(); }, { capture: true, passive: true }); });
  function go(list) { var order = [], i = 0, firstN = 0;
    if (fast) { list.forEach(function (t, k) { if (k === 0 || K1RE.test(t)) order.push(k); }); firstN = order.length; list.forEach(function (t, k) { if (!(k === 0 || K1RE.test(t))) order.push(k); }); }
    else list.forEach(function (t, k) { order.push(k); });
    var watch = fast ? nSI.call(W, function () { if (notK1()) { nCI.call(W, watch); try { sessionStorage.setItem('tl-load-normal', '1'); } catch (e) {} location.reload(); } }, 400) : null;
    function slice() { var t0 = Date.now();
      if (!rush && fast && i >= firstN && i < order.length && gameOpen()) return nST.call(W, slice, 400);
      if (!rush && Date.now() - lastMove < 700) return nST.call(W, slice, 200);
      while (i < order.length) { run1(list[order[i]]); i++;
        if (fast && i === firstN && !rush) { try { if (window.K1O && K1O.hook) K1O.hook(); if (typeof A !== 'undefined' && A.view === 'hub') render(); } catch (e) {} cover(k1Wait()); return nST.call(W, slice, 3000); }
        if (Date.now() - t0 > (rush ? 400 : 50)) break; }
      if (i < order.length) { cover(k1Wait()); return nST.call(W, slice, 0); }
      finished = true; release(); stopWait();
      try { if (window.K1O && K1O.hook) K1O.hook(); } catch (e) {}
      try { if (typeof A !== 'undefined' && (A.view === 'play' || A.view === 'hub' || A.view === 'result')) render(); } catch (e) {}
      wait1(false); var p = pending; pending = null;
      if (p) nST.call(W, function () { try { var x = same(p); if (x) x.click(); } catch (e) {} }, 0); }
    nST.call(W, slice, 30); }
  function fallback(why) { if (done) return; done = true; try { console.warn('QuestTools v2: using the old loader', why); } catch (e) {} stopWait(); try { (0, eval)(OLD); } catch (e) { console.error('QuestTools', e); } finished = true; wait1(false); var p = pending; pending = null; if (p) setTimeout(function () { try { var x = same(p); if (x) x.click(); } catch (e) {} }, 0); }
  function store(mode) { return db.transaction(ST, mode).objectStore(ST); }
  function getMany(ks, cb) { var out = {}, n = ks.length; if (!n || !db) return cb(out); try { var s = store('readonly'); ks.forEach(function (k) { var q = s.get(k); q.onsuccess = function () { out[k] = q.result; if (--n === 0) cb(out); }; q.onerror = function () { if (--n === 0) cb(out); }; }); } catch (e) { cb(out); } }
  function save(parts, order) { if (!db) return; try { var s = store('readwrite'); Object.keys(parts).forEach(function (h) { s.put(parts[h], h); }); s.put(order, '__order');
    var q = s.getAllKeys(); q.onsuccess = function () { (q.result || []).forEach(function (k) { if (k !== '__order' && order.indexOf(k) < 0) s.delete(k); }); }; } catch (e) {}
    try { indexedDB.deleteDatabase('tashbar-tools'); } catch (e) {} }   /* the old one-piece copy (about 10 MB) is no longer needed */
  function join(order, fresh, cached) { var a = []; for (var i = 0; i < order.length; i++) { var h = order[i], v = fresh[h] != null ? fresh[h] : cached[h]; if (typeof v !== 'string') return null; a.push(v); } return a; }
  function offline(e) { if (done) return; getMany(['__order'], function (o) { var order = o.__order; if (!order || !order.length) return fallback(e);
    getMany(order, function (c) { var js = join(order, {}, c); if (js === null) return fallback(e); done = true; go(js); }); }); }
  function ask(have) { google.script.run.withSuccessHandler(function (r) { if (done) return; if (!r || !r.order || !r.parts) return fallback('bad reply');
      var need = r.order.filter(function (h) { return r.parts[h] == null; });
      getMany(need, function (cached) { var js = join(r.order, r.parts, cached); if (js === null) return fallback('missing piece'); done = true; go(js); save(r.parts, r.order); }); })
    .withFailureHandler(offline).msQuestToolsParts(have); }
  try { var rq = indexedDB.open(DBN, 1); rq.onupgradeneeded = function () { rq.result.createObjectStore(ST); };
    rq.onsuccess = function () { db = rq.result; try { var q = store('readonly').getAllKeys(); q.onsuccess = function () { ask((q.result || []).filter(function (k) { return k !== '__order'; })); }; q.onerror = function () { ask([]); }; } catch (e) { ask([]); } };
    rq.onerror = function () { ask([]); }; rq.onblocked = function () { ask([]); }; } catch (e) { ask([]); }
}
function tlLoader2_() { return '(' + tlLoader2Src_.toString() + ')(' + JSON.stringify(TL_TOOLS_LOADER) + ');'; }
