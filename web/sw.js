/* Serves the newer student page kept on the device (see boot.js), else the page from the fast host. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.mode !== 'navigate' || u.origin !== location.origin || (u.pathname !== '/' && u.pathname !== '/index.html')) return;
  e.respondWith(caches.open('tl-page').then(function (c) { return c.match('/__page'); }).then(function (r) { return r || fetch(e.request); }).catch(function () { return fetch(e.request); }));
});
