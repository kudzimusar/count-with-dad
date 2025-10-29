// public/sw.js - FULL FINAL VERSION
const CACHE = "count-to-100-v3";
const OFFLINE_PAGE = "/count-with-dad/offline.html";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.6.0/workbox-sw.js');

workbox.setConfig({ debug: false });

// Precache offline page
workbox.precaching.precacheAndRoute([
  { url: OFFLINE_PAGE, revision: '1' }
]);

// Cache assets
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp|js|css|woff2?|ttf)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'assets-cache'
  })
);

// HTML fallback
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

// Background Sync (for progress saves)
workbox.routing.registerRoute(
  /api\/progress/,
  new workbox.strategies.NetworkOnly({
    plugins: [
      new workbox.backgroundSync.BackgroundSyncPlugin('progressQueue', {
        maxRetentionTime: 24 * 60
      })
    ]
  })
);

// PUSH NOTIFICATIONS
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Time to count!',
    icon: '/count-with-dad/android-launchericon-192-192.png',
    badge: '/count-with-dad/badge.png',
    vibrate: [100, 50, 100],
    data: { url: '/count-with-dad/' },
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'close', title: 'Later' }
    ]
  };
  event.waitUntil(
    self.registration.showNotification('Count to 100', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/count-with-dad/')
    );
  }
});

// Enable navigation preload
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Clean old caches
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
