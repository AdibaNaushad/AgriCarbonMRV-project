const CACHE = 'agrimrv-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
];
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then((res) =>
      res || fetch(req).then((net) => {
        const copy = net.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return net;
      }).catch(() => res || new Response('Offline', { status: 200, headers: { 'Content-Type': 'text/plain' } }))
    )
  );
});
