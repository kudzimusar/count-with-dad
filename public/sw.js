// public/sw.js - Enhanced for Education App (Offline + Sync)
const CACHE = "count-to-100-v2";
const OFFLINE_PAGE = "/count-with-dad/offline.html";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.6.0/workbox-sw.js');

workbox.setConfig({ debug: false });

// Precache offline page
workbox.precaching.precacheAndRoute([
  { url: OFFLINE_PAGE, revision: '1' }
]);

// Cache assets (JS, CSS, images)
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp|js|css|woff2?|ttf)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'assets-cache'
  })
);

// HTML navigation fallback (offline support)
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ event }) => {
    try {
      const preloadResponse = await event.preloadResponse;
      if (preloadResponse) return preloadResponse;
      return await fetch(event.request);
    } catch (error) {
      const cache = await caches.open(CACHE);
      const cachedResponse = await cache.match(OFFLINE_PAGE);
      return cachedResponse || new Response('Offline', { status: 503 });
    }
  }
);

// Background Sync: Queue failed requests (e.g., save lesson progress offline)
workbox.routing.registerRoute(
  /api\/progress/,
  new workbox.strategies.NetworkOnly({
    plugins: [
      new workbox.backgroundSync.BackgroundSyncPlugin('progressQueue', {
        maxRetentionTime: 24 * 60 // Retry for 24 hours
      })
    ]
  })
);

// Periodic Sync: Daily sync (e.g., fetch new challenges when online)
if ('serviceWorkerRegistration' in navigator) {
  navigator.serviceWorker.ready.then((reg) => {
    reg.periodicSync.register('/count-with-dad/sync-daily', {
      minPeriod: 24 * 60 * 60 * 1000 // 24 hours
    }).catch((e) => console.error('Periodic sync failed:', e));
  });
}

// Enable navigation preload
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Claim clients & skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
