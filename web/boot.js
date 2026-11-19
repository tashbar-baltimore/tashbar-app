/* Runs first on the Firebase-hosted student page. Three jobs:
   1. SELF-UPDATE: the files on Firebase are a fast snapshot. The Apps Script server is the truth. After each open the
      page asks the server "is my page still current?" (apiKidPage). If not, the new page is kept on the device and
      used from the next open on. So a new publish reaches students without anyone rebuilding Firebase.
   2. Stand in for google.script.run: every server call is one small POST to the Apps Script /exec link.
   3. Lesson packs and add-ons: ask the server which pieces are current, take each piece from the device, else from
      the fast file host, else from the server. */
(function () {
  var API = '__API_URL__', APPS = '__APPS_URL__', H = window.TL_PAGE_HASH || '', KIND = window.TL_PAGE_KIND === 'staff' ? 'staff' : 'kid';
  var PAGE_FN = KIND === 'staff' ? 'apiStaffPage' : 'apiKidPage', PAGE_KEY = KIND === 'staff' ? '/__page_staff' : '/__page', HASH_URL = KIND === 'staff' ? '/staff/page-hash.json' : '/page-hash.json';
  /* links: ?sg=1 is the staff portal (also on this host); the other special pages still live on the Apps Script link */
  try { var q = location.search || ''; if (KIND === 'kid' && /[?&]sg=1/.test(q)) { location.replace('/staff/'); return; }
    /* ALL PAGES ON FIREBASE (2026-11-19): those pages are fast files on this site now (/pages/<kind>/, built by web/build.js) */
    var pk = /[?&]canteen=1(&|$)/.test(q) ? 'canteen' : /[?&]so=1(&|$)/.test(q) ? 'so' : /[?&]pp=1(&|$)/.test(q) ? 'pp' : /[?&]cp=1(&|$)/.test(q) ? 'cp'
      : /[?&]spark=1(&|$)/.test(q) ? 'spark' : (/[?&]pl=1(&|$)/.test(q) && /[?&]check=1(&|$)/.test(q)) ? 'pl' : /[?&]pf=1(&|$)/.test(q) ? (/[?&](report|rebbe)=/.test(q) ? 'pfstaff' : 'pf') : '';
    if (pk && !/[?&]old=1(&|$)/.test(q)) { location.replace('/pages/' + pk + '/' + q + location.hash); return; }
    if (APPS && /[?&](pf|cp|pp|canteen|so|pl|spark)=/.test(q)) { location.replace(APPS + q); return; } } catch (e) {}
  function inject(html, h, at) { var i = html.indexOf('<head>'); if (i < 0) return null;
    return html.slice(0, i + 6) + '<meta name="viewport" content="width=device-width, initial-scale=1"><script>window.TL_PAGE_HASH=' + JSON.stringify(h) + ';window.TL_PAGE_BUILT=' + Number(at) + ';window.TL_PAGE_FROM="device";window.TL_PAGE_KIND="' + KIND + '";<\/script><script src="/boot.js"><\/script>' + html.slice(i + 6); }
  function remote(fn, args) {
    if (!API) return Promise.reject(new Error('The server link is not set.'));
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ api: 1, fn: fn, args: args }), redirect: 'follow' })
      .then(function (r) { return r.json(); }).then(function (j) { if (!j || !j.ok) throw new Error((j && j.error) || 'Server error'); return j.result; });
  }
  function getJSON(u) { return fetch(u, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + u); return r.json(); }); }
  var manifest = null; function staticList() { return manifest || (manifest = getJSON('/parts/manifest.json').then(function (m) { return m.order || []; }, function () { return []; })); }
  function cacheGet(k) { return window.caches ? caches.open('tl-page').then(function (c) { return c.match(k); }).then(function (r) { return r ? r.json() : null; }).catch(function () { return null; }) : Promise.resolve(null); }
  function cachePut(k, o) { return caches.open('tl-page').then(function (c) { return o ? c.put(k, new Response(JSON.stringify(o), { headers: { 'Content-Type': 'application/json' } })) : c.delete(k); }); }
  function keptParts() { return cacheGet('/__parts'); }
  /* in the background: ask the server for its current list of pieces. If it differs, keep the new list and the new
     pieces on the device for the next open. If the fast host has caught up, drop what was kept. */
  function verifyParts(order, onHost, kept) { var known = {}; onHost.forEach(function (h) { known[h] = 1; }); if (kept && kept.parts) Object.keys(kept.parts).forEach(function (h) { known[h] = 1; });
    remote('msQuestToolsParts', [Object.keys(known)]).then(function (r) { if (!r || !r.order) return; var same = r.order.length === onHost.length && r.order.every(function (h, i) { return h === onHost[i]; });
      if (same) { window.TL_PARTS_CHECK = 'current'; if (kept) cachePut('/__parts', null); return; }
      var parts = {}; r.order.forEach(function (h) { if (r.parts && typeof r.parts[h] === 'string') parts[h] = r.parts[h]; else if (kept && kept.parts && typeof kept.parts[h] === 'string') parts[h] = kept.parts[h]; });
      var changed = r.order.length !== order.length || r.order.some(function (h, i) { return h !== order[i]; });
      cachePut('/__parts', { order: r.order, parts: parts }).then(function () { window.TL_PARTS_CHECK = changed ? 'newer kept for next open' : 'current (kept on device)'; }, function () { window.TL_PARTS_CHECK = 'newer, but the device could not keep it'; });
    }, function (e) { window.TL_PARTS_CHECK = 'check failed: ' + e.message; }); }
  var local = {
    msQuestTools: function () { return window.TL_PAGE_FROM === 'device' ? remote('msQuestTools', []) : getJSON('/tools.json').catch(function () { return remote('msQuestTools', []); }); },
    msQuestToolsParts: function (have) { have = have || []; var mine = {}; have.forEach(function (h) { mine[h] = 1; });
      /* fast path: the list kept on this device (if the server had newer pieces last time), else the fast host's list */
      return Promise.all([staticList(), keptParts()]).then(function (a) { var onHost = a[0], kept = a[1], order = kept && kept.order && kept.order.length ? kept.order : onHost;
        if (!order.length) return remote('msQuestToolsParts', [have]);
        var hostHas = {}; onHost.forEach(function (h) { hostHas[h] = 1; }); var parts = {}, need = order.filter(function (h) { return !mine[h]; });
        return Promise.all(need.map(function (h) { if (kept && kept.parts && typeof kept.parts[h] === 'string') return kept.parts[h];
            if (!hostHas[h]) throw new Error('part not on host ' + h); return fetch('/parts/' + h + '.js').then(function (x) { if (!x.ok) throw new Error('part ' + h); return x.text(); }); }))
          .then(function (texts) { need.forEach(function (h, i) { parts[h] = texts[i]; }); setTimeout(function () { verifyParts(order, onHost, kept); }, 8000); return { v: 2, order: order, parts: parts }; })
          .catch(function () { return remote('msQuestToolsParts', [have]); }); });
    },
    msAppUrl: function () { return Promise.resolve(location.origin + '/'); }
  };
  function chain(ok, no, user) {
    return new Proxy({}, { get: function (_, k) {
      if (k === 'withSuccessHandler') return function (f) { return chain(f, no, user); };
      if (k === 'withFailureHandler') return function (f) { return chain(ok, f, user); };
      if (k === 'withUserObject') return function (u) { return chain(ok, no, u); };
      return function () { var args = Array.prototype.slice.call(arguments);
        (local[k] ? local[k].apply(null, args) : remote(k, args)).then(function (r) { if (ok) ok(r, user); }, function (e) { if (no) no(e, user); else console.error(k, e); }); };
    } });
  }
  window.google = window.google || {}; window.google.script = { run: chain(null, null, undefined), host: { close: function () {}, setHeight: function () {}, origin: location.origin }, url: { getLocation: function (cb) { cb({ parameter: {}, parameters: {}, hash: location.hash }); } }, history: { push: function () {}, replace: function () {} } };
  window.TL_STATIC_HOST = true;
  /* 1b. after the page is up, check with the server. A newer page is kept on the device (Cache Storage) and the
     service worker (sw.js) serves it from the next open on. When the fast host catches up, the kept copy is dropped. */
  function keep(doc) { return caches.open('tl-page').then(function (c) { return doc ? c.put(PAGE_KEY, new Response(doc, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })) : c.delete(PAGE_KEY); }); }
  function check() { remote(PAGE_FN, [H]).then(function (r) {
      if (r && r.same) { window.TL_PAGE_CHECK = 'current';
        if (window.TL_PAGE_FROM === 'device') getJSON(HASH_URL).then(function (j) { if (j && j.h === H) keep(null); }, function () {}); return; }
      if (r && r.h && r.html) { var doc = inject(r.html, r.h, Date.now()); if (!doc) { window.TL_PAGE_CHECK = 'newer, but not understood'; return; }
        keep(doc).then(function () { window.TL_PAGE_CHECK = 'newer kept for next open'; NEWER = r.h; swapIfIdle(); }, function () { window.TL_PAGE_CHECK = 'newer, but the device could not keep it'; }); }
      else window.TL_PAGE_CHECK = 'no answer'; }, function (e) { window.TL_PAGE_CHECK = 'check failed: ' + e.message; }); }
  /* A newer page goes on screen at once, but only while nobody is working: the sign-in screen is showing (or the tab is hidden).
     Chromebooks that stay open all day check again every 2 minutes. */
  var NEWER = false;
  function idle() { try { if (KIND === 'staff') return !(typeof S !== 'undefined' && S && S.token); return typeof A !== 'undefined' && A && A.view === 'signin' && !A.pin; } catch (e) { return false; } }
  /* STAFF (HoS 2026-11-19 "I opened the staff page and I don't see it"): a signed-in staff member is never "idle", so a new staff page
     never went on screen. Now a bar offers it: tap to update (the sign-in is kept in this tab). */
  function staffBar() { if (KIND !== 'staff' || !NEWER || document.getElementById('tl-newver')) return; var b = document.createElement('div'); b.id = 'tl-newver';
    b.setAttribute('role', 'status'); b.style.cssText = 'position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:2147483646;display:flex;gap:12px;align-items:center;background:#16202C;color:#fff;padding:10px 12px 10px 18px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.3);font:700 15px system-ui,sans-serif;max-width:calc(100vw - 24px)';
    b.innerHTML = '<span>✨ A new version of the staff portal is ready.</span><button type="button" style="border:0;border-radius:999px;padding:8px 16px;background:#FDE047;color:#16202C;font:800 14px system-ui,sans-serif;cursor:pointer">Update now</button>';
    b.querySelector('button').onclick = function () { location.reload(); }; (document.body || document.documentElement).appendChild(b); }
  function swapIfIdle() { staffBar(); if (!NEWER || !idle()) return; var k = 'tl-swapped-' + KIND; try { if (sessionStorage.getItem(k) === NEWER) return; sessionStorage.setItem(k, NEWER); } catch (e) { return; } location.reload(); }   /* once per new page: never a reload loop */
  setInterval(function () { if (NEWER) return swapIfIdle(); if (idle() || document.hidden || KIND === 'staff') check(); }, 120000);   /* staff: check every 2 minutes even while signed in (the bar asks before reloading) */
  /* lesson pieces changed (a new add-on such as the new voice) without a new page: also reload on the sign-in screen, once per change */
  var PARTS0 = null; getJSON('/parts/manifest.json').then(function (m) { PARTS0 = (m.order || []).join(','); }, function () {});
  setInterval(function () { if (NEWER || PARTS0 == null) return; getJSON('/parts/manifest.json').then(function (m) { var now = (m.order || []).join(','); if (now && now !== PARTS0) { NEWER = 'parts:' + now.length + ':' + now.slice(-24); swapIfIdle(); } }, function () {}); }, 120000);
  setInterval(swapIfIdle, 15000);
  try { if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js'); } catch (e) {}
  if (API && window.caches) { if (document.readyState === 'complete') setTimeout(check, 4000); else window.addEventListener('load', function () { setTimeout(check, 4000); }); }
})();
