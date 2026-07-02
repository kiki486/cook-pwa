const CACHE = 'cook-pwa-v15';
const CORE = [
  './',
  'index.html',
  'styles.css',
  'overrides.css',
  'supabase-config.js',
  'cloud-sync.js',
  'app.js',
  'manifest.webmanifest',
  'assets/app.png',
  'assets/app-192.png',
  'assets/app-maskable.png',
  'assets/icon2.48.png',
  'assets/icon3.48.png',
  'assets/icon4.48.png',
  'assets/icon2.144.png',
  'assets/icon3.144.png',
  'assets/icon4.144.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
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
      fetch(request)
        .then(response => {
          if (response.ok) caches.open(CACHE).then(cache => cache.put('./', response.clone()));
          return response;
        })
        .catch(() => caches.match('./'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok && response.type === 'basic') {
        caches.open(CACHE).then(cache => cache.put(request, response.clone()));
      }
      return response;
    }))
  );
});
