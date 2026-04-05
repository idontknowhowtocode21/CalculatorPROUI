const CACHE_NAME = 'calc-v3';

// Relative paths ensure it works within your GitHub /CalculatorPROUI/ subfolder
const ASSETS = [
  './',
  './index.html',
  './acaan.js',
  './toxic.js',
  './engine.js',
  './manifest.json',
  'https://img.icons8.com/ios-filled/512/calculator.png'
];

// Install stage: Cache all defined assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching Files');
      return cache.addAll(ASSETS);
    })
  );
});

// Activate stage: Clean up old caches if the version name changes
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch stage: Serve files from cache for offline use and faster loading
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
