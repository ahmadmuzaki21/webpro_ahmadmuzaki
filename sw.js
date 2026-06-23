const CACHE_NAME = "pwa-v3";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/bundle.js",
  "/manifest.json",
  "/images/1.jpg"
];

self.addEventListener("install", (event) => {
  self.skipWaiting(); // Paksa SW baru langsung aktif
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Hapus cache versi lama
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith("http")) return;

  // Strategi Network First: Selalu ambil dari server internet dulu (Vercel)
  // Jika server mati/offline, baru ambil dari Cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Simpan versi terbarunya ke cache
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, resClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
