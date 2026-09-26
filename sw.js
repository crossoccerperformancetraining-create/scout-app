/* Scout Intelligence Service Worker — V75.8.1 */
const APP_CACHE = 'scout-intelligence-v75.8.1';
const CORE = ['./', './index.html', './manifest.json'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil((async () => {
    const cache = await caches.open(APP_CACHE);
    for (const url of CORE) {
      try { await cache.add(new Request(url, {cache: 'reload'})); } catch (_) {}
    }
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name !== APP_CACHE).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigations are network-first so a new index.html is visible immediately after deployment.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req, {cache: 'no-store'});
        if (fresh && fresh.ok) {
          const cache = await caches.open(APP_CACHE);
          cache.put('./index.html', fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch (_) {
        return (await caches.match(req)) || (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  // Same-origin assets: prefer network, then cache for offline use.
  event.respondWith((async () => {
    try {
      const fresh = await fetch(req, {cache: 'no-cache'});
      if (fresh && fresh.ok) {
        const cache = await caches.open(APP_CACHE);
        cache.put(req, fresh.clone()).catch(() => {});
      }
      return fresh;
    } catch (_) {
      return (await caches.match(req)) || Response.error();
    }
  })());
});
