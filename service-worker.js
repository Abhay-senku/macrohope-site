/* ==========================================================================
   TERMINAL//WORD — Offline-First Service Worker
   ========================================================================== */

const CACHE_NAME = 'terminal-word-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './words.js',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // Cache same-origin files and Google Fonts stylesheets/woff2 for offline reuse
          if (response && response.status === 200) {
            const url = new URL(event.request.url);
            if (url.origin === self.location.origin || url.hostname.includes('fonts.g')) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
          }
          return response;
        })
        .catch(() => {
          // Fallback to cached app shell if navigating offline
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('', { status: 503, statusText: 'Offline' });
        });
    })
  );
});
