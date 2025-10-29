// public/sw.js
const CACHE = "count-to-100-v1";
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

// HTML navigation fallback
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

// Enable navigation preload
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Claim clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
