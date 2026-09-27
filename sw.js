const CACHE_NAME = 'kolo-nestesti-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

// Instalace service workeru a kešování souborů
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Zpracování requestů (slouží offline pokud je uloženo)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Pokud najdeme shodu v keši, vrátíme ji
      if (response) {
        return response;
      }
      
      // Jinak stáhneme ze sítě
      return fetch(event.request).then((networkResponse) => {
        // Kontrola jestli je response validní
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Naklonujeme response, protože stream se může přečíst jen jednou
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Zde by mohla být offline fallback stránka, kdybychom nějakou měli
      });
    })
  );
});

// Aktualizace service workeru a vyčištění staré keše
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
});
