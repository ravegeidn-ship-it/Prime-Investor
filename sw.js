/* ============================================= */
/* SERVICE WORKER — PVI                            */
/* ============================================= */

const CACHE_NAME = 'pvi-cache-v1';
const URLS_TO_CACHE = [
  'home.html',
  'auth.html',
  'harga-wajar.html',
  'average.html',
  'right-issue.html',
  'portofolio.html',
  'tentang.html',
  'profile.html',
  'lupa-password.html',
  'css/global.css',
  'css/home.css',
  'css/auth.css',
  'js/global.js',
  'js/auth.js',
  'js/home.js'
];

/* Install — simpan file ke cache */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

/* Aktifkan — hapus cache lama */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

/* Fetch — ambil dari cache dulu, kalau tidak ada ambil dari jaringan */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

