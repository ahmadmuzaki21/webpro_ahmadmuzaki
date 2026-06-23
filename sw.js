const CACHE = "web-profil-v1";

const ASSETS = [
  "/",
  "/index.html",
  "/bundle.js",
  "/manifest.json",
  "/images/1.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => (key !== CACHE ? caches.delete(key) : null)),
        ),
      ),
  );
  // ⚠️ HAPUS clients.claim() — ini biang refresh paksa
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip request non-GET (POST login, dll)
  if (request.method !== "GET") return;

  // Skip request selain http/https (seperti chrome-extension://)
  if (!url.protocol.startsWith("http")) return;

  // Skip request API
  if (url.pathname.startsWith("/api/")) return;

  // Cache-First untuk aset statis
  if (ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((res) => res || fetch(request)),
    );
    return;
  }

  // Network-First untuk halaman — tapi JANGAN cache response API
  event.respondWith(
    fetch(request)
      .then((res) => {
        // Hanya cache response yang valid dan bukan API
        if (res.ok && res.type === "basic") {
          const clone = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request)),
  );
});
