// Nom du cache
const CACHE_NAME = 'maths-academy-cache-v1';

// Fichiers à mettre en cache au moment de l'installation
const urlsToCache = [
  '/',
  '/index.html',
  '/college.html',
  '/lycee.html',
  '/primaire.html',
  '/conseils.html',
  '/contact.html',
  '/style.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Installation du Service Worker et mise en cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('[ServiceWorker] Mise en cache initiale');
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// Activation du Service Worker et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[ServiceWorker] Cache supprimé :', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            if (response) {
                // Retourne le cache si disponible
                return response;
            }
            // Sinon, fait la requête réseau
            return fetch(event.request)
            .then((networkResponse) => {
                // Mise en cache dynamique
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
        .catch(() => {
            // Optionnel : page de fallback hors connexion
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
            }
        })
    );
});
