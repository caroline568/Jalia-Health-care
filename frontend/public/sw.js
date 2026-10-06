const CACHE_VERSION = "jalia-v3";
const APP_SHELL = [
  "/",
  "/app",
  "/app/learn",
  "/manifest.json",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
  "/assets/anatomy.svg",
  "/assets/anatomy-sw.svg",
  "/assets/pain-map.svg",
  "/assets/pain-map-sw.svg",
  "/assets/jalia-hero.svg",
  "/assets/life-stage-teen.jpg",
  "/assets/life-stage-adult.jpg",
  "/assets/life-stage-family.jpg",
  "/assets/life-stage-later.jpg",
  "/assets/life-stage-community.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return; // writes go through the offline queue instead

  const url = new URL(request.url);

  // API GET requests: network first, fall back to last cached response when offline.
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // App shell / static assets: cache first, then network, then offline fallback to root.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
          return res;
        })
        .catch(() => caches.match("/"));
    })
  );
});
