const CACHE = 'conduct-cache-v8';
const ASSETS = ['./','./index.html','./styles.css','./app.js','./data.json','./manifest.webmanifest','./assets/logo.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(res => res || fetch(req).then(net => {
      if (req.method === 'GET' && new URL(req.url).origin === location.origin) {
        const copy = net.clone();
        caches.open(CACHE).then(cache => cache.put(req, copy));
      }
      return net;
    }).catch(() => caches.match('./index.html')))
  );
});
