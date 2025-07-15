
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('riyaz-cache').then(cache => {
      return cache.addAll([
        'index.html',
        'History.html',
        'profile.html',
        'style.css',
        'script.js',
        'icon.png'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
