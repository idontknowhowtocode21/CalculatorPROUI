const CACHE_NAME = 'calc-v2';
const ASSETS = [
  '/CalculatorPROUI/',
  '/CalculatorPROUI/index.html',
  '/CalculatorPROUI/acaan.js',
  '/CalculatorPROUI/toxic.js',
  '/CalculatorPROUI/engine.js',
  '/CalculatorPROUI/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
