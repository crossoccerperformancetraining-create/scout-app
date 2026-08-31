const CACHE_NAME = 'scout-intelligence-v73-1-32-import-vercel-fix';
const BASE_URL = new URL('./', self.location.href);
const OFFLINE_URL = new URL('index.html', BASE_URL).href;

const STATIC_ASSETS = [
  BASE_URL.href,
  OFFLINE_URL,
  new URL('manifest.json', BASE_URL).href,
  new URL('icon-192.png', BASE_URL).href,
  new URL('icon-512.png', BASE_URL).href,
  new URL('apple-touch-icon.png', BASE_URL).href,
  new URL('brand-icon.svg', BASE_URL).href,
  new URL('brand-logo-horizontal.svg', BASE_URL).href,
  new URL('modelo-temporadas.csv', BASE_URL).href,
  new URL('modelo-importacao-atletas-scout.xlsx', BASE_URL).href,
  new URL('modelo-importacao-alertas-scout.xlsx', BASE_URL).href,
  new URL('EXEMPLO-ESTATISTICAS.txt', BASE_URL).href
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache =>
    Promise.allSettled(STATIC_ASSETS.map(asset => cache.add(asset)))
  ));
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(OFFLINE_URL, copy));
          }
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request, { cache: 'no-cache' })
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
