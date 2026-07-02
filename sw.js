const CACHE = 'cook-pwa-v11';
const ASSETS = ['./','index.html','styles.css','overrides.css','supabase-config.js','cloud-sync.js','app.js','manifest.webmanifest','assets/app.png','assets/app-192.png','assets/shopping-title.png','assets/2.jpg','assets/icon1.png','assets/icon2.png','assets/icon3.png','assets/icon4.png','assets/icon6.png','assets/icon7.png','assets/icon8.png','assets/设置.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const copy=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return res; }).catch(()=>caches.match('./')))));
