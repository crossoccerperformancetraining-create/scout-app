const CACHE_NAME = 'procoach-2072-ficha-campo-final';
const APP_SHELL = [
  './', './index.html', './atleta.html',
  './manifest.webmanifest', './athlete-manifest.webmanifest', './procoach-icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then(response => {
    if (response && response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    }
    return response;
  }).catch(() => caches.match(event.request).then(hit => hit || caches.match('./index.html'))));
});

self.addEventListener('push', event => {
  let data = {title:'ProCoach', body:'Você tem uma nova atualização.', url:'./'};
  try { if (event.data) data = {...data, ...event.data.json()}; } catch(e) {}
  event.waitUntil(self.registration.showNotification(data.title || 'ProCoach', {
    body: data.body || '', icon:'./procoach-icon.svg', badge:'./procoach-icon.svg', data:data.url || './'
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data || './'));
});
