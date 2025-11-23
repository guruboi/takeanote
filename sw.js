const CACHE_NAME = 'notebookos-v1.0.0';
const DATA_CACHE_NAME = 'notebookos-data-v1.0.0';
const urlsToCache = [
  '/',
  '/notebookos.html',
  'https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap',
  '/manifest.json',
  '/sw.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached resources when offline
self.addEventListener('fetch', event => {
  // Handle API requests differently
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'AI service unavailable offline' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // For static assets, try cache first then network
  if (event.request.destination === 'script' || event.request.destination === 'style' || 
      event.request.destination === 'image' || event.request.destination === 'font') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request).catch(() => {
            // Try to return a fallback for images
            if (event.request.destination === 'image') {
              return caches.match('/icons/icon-192x192.png');
            }
          });
        })
    );
  } else {
    // For documents (HTML), try network first, then cache
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then(response => {
          if (response) {
            return response;
          }
          // If it's the main page, return the main page from cache
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service worker activated and old caches cleaned up');
    })
  );
});

// Listen for messages from the client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SAVE_DATA') {
    // Cache the user's data
    caches.open(DATA_CACHE_NAME).then(cache => {
      cache.put('user-data', new Response(JSON.stringify(event.data.payload)));
    });
  } else if (event.data && event.data.type === 'GET_DATA_REQUEST') {
    // Return cached data to the client
    caches.open(DATA_CACHE_NAME).then(cache => {
      cache.match('user-data').then(response => {
        if (response) {
          response.json().then(data => {
            event.ports[0].postMessage({
              type: 'GET_DATA_RESPONSE',
              payload: data
            });
          });
        } else {
          // No cached data available
          event.ports[0].postMessage({
            type: 'GET_DATA_RESPONSE',
            payload: null
          });
        }
      });
    });
  }
});