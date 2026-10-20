// Service worker: the whole game is static, so it is cached on install and works offline.
// Strategy: cache-first for the app shell (fast, offline), refreshed in the background (stale-while-revalidate),
// so a new deploy is picked up on the next launch. Bump CACHE_VERSION to drop old caches immediately.
const CACHE_VERSION = 'v2';
const CACHE = `design-${CACHE_VERSION}`;
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "styles/main.css",
  "js/audio.js",
  "js/characterEngine.js",
  "js/conditions.js",
  "js/effects.js",
  "js/eventEngine.js",
  "js/gameEngine.js",
  "js/immersive.js",
  "js/main.js",
  "js/meta.js",
  "js/objectives.js",
  "js/portraits.js",
  "js/pwa.js",
  "js/rng.js",
  "js/saveManager.js",
  "js/state.js",
  "js/ui.js",
  "js/views.js",
  "data/achievements.js",
  "data/channels.js",
  "data/characters.js",
  "data/echoes.js",
  "data/endings.js",
  "data/events.js",
  "data/laws.js",
  "data/objectives.js",
  "data/world.js",
  "data/events/climax.js",
  "data/events/court.js",
  "data/events/d1.js",
  "data/events/d2.js",
  "data/events/d3.js",
  "data/events/d4.js",
  "data/events/d5.js",
  "data/events/more.js",
  "data/events/people.js",
  "data/events/rivals.js",
  "data/events/shadows.js",
  "fonts/nunito-latin-400-normal.woff2",
  "fonts/nunito-latin-600-normal.woff2",
  "fonts/nunito-latin-700-normal.woff2",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-192.png",
  "icons/icon-maskable-512.png"
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('design-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const refresh = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
      if (cached) { refresh.catch(() => {}); return cached; }
      return (await refresh) || (req.mode === 'navigate' ? cache.match('index.html') : Response.error());
    }),
  );
});
