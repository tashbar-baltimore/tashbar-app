/* Stands in for google.script.run when the student page is served from a file host instead of Apps Script.
   - the page's add-ons and lesson packs come from static files (cached by the browser and the host);
   - every other call goes to the Apps Script server as one small POST. No app code changes. */
(function () {
  var API = '__API_URL__';
  function getJSON(u) { return fetch(u, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + u); return r.json(); }); }
  var local = {
    msQuestTools: function () { return getJSON('/tools.json'); },
    msQuestToolsParts: function (have) {
      return getJSON('/parts/manifest.json').then(function (m) { var got = {}; (have || []).forEach(function (h) { got[h] = 1; }); var need = m.order.filter(function (h) { return !got[h]; });
        return Promise.all(need.map(function (h) { return fetch('/parts/' + h + '.js').then(function (r) { if (!r.ok) throw new Error('part ' + h); return r.text(); }); }))
          .then(function (texts) { var parts = {}; need.forEach(function (h, i) { parts[h] = texts[i]; }); return { v: 2, order: m.order, parts: parts }; }); });
    },
    msAppUrl: function () { return Promise.resolve(API || location.origin + '/'); }
  };
  function remote(fn, args) {
    if (!API) return Promise.reject(new Error('The server link is not set.'));
    /* text/plain keeps this a "simple" request, which Apps Script web apps accept from another site */
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ api: 1, fn: fn, args: args }), redirect: 'follow' })
      .then(function (r) { return r.json(); }).then(function (j) { if (!j || !j.ok) throw new Error((j && j.error) || 'Server error'); return j.result; });
  }
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
})();
