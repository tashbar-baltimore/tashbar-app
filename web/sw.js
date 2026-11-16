/* Serves the newer student page kept on the device (see boot.js), else the page from the fast host. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.mode !== 'navigate' || u.origin !== location.origin || u.search) return;
  var key = (u.pathname === '/' || u.pathname === '/index.html') ? '/__page' : (u.pathname === '/staff/' || u.pathname === '/staff' || u.pathname === '/staff/index.html') ? '/__page_staff' : null; if (!key) return;
  e.respondWith(caches.open('tl-page').then(function (c) { return c.match(key); }).then(function (r) { return r || fetch(e.request); }).catch(function () { return fetch(e.request); }));
});
