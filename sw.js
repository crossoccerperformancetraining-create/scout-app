const CACHE_NAME = 'scout-intelligence-v73-1-36-player-card-ficha';
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
  event.waitUntil(caches.open(CACHE_NAME).then(cache => Promise.allSettled(STATIC_ASSETS.map(asset => cache.add(asset)))));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request, {cache:'no-store'}).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(OFFLINE_URL, response.clone()));
      return response;
    }).catch(() => caches.match(OFFLINE_URL)));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request, {cache:'no-cache'}).then(response => {
    if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    return response;
  })));
});
