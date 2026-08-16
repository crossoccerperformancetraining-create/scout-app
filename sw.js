const CACHE='coachvoice-v4.5-mentor-ia-real';
const FILES=['/','/index.html','/manifest.webmanifest','/icon-192.png','/icon-512.png','/studio.css','/studio.js','/studio-framing.js','/coachvoice-v33.js','/coachday.css','/coachday-v40.js','/coachprep.css','/coachprep-v42.js','/mentor-v45.css','/mentor-v45.js'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
  event.respondWith(
    fetch(event.request,{cache:'no-store'}).then(response=>{
      if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
      return response;
    }).catch(async()=>{
      const cached=await caches.match(event.request);
      if(cached)return cached;
      if(event.request.mode==='navigate')return caches.match('/index.html');
      return new Response('Offline',{status:503,statusText:'Offline'});
    })
  );
});
