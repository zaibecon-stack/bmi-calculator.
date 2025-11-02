// Define the name of the cache and the files to cache
const CACHE_NAME = 'bmi-calculator-v1';

// List all files that are essential for the app to run offline
const urlsToCache = [
  './', // The root path, which is index.html
  './index.html',
  './manifest.json',
  './service-worker.js', // Cache the service worker itself
  './icon-192.png', 
  './icon-512.png',
  'https://cdn.tailwindcss.com' // Caching the external library
];

/* * 1. INSTALL EVENT
 * When the app is first installed, it caches all the files listed above.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  // Forces the service worker to activate immediately
  self.skipWaiting();
});

/* * 2. ACTIVATE EVENT
 * Cleans up old cached versions of the app.
 */
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

/* * 3. FETCH EVENT
 * Intercepts all requests and serves the cached version first.
 */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
