// importScripts('./cache-polyfill');


var CACHE_NAME = 'iptv-v1';
var urlsToCache = [
    '/',
    './offline.html',
    './bundle.js',
    './index.html'
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});


self.addEventListener('fetch', function(event) {

    event.respondWith(async function() {
        try {
            return await fetch(event.request);
        } catch (err) {
            const cache = await caches.match(event.request);

            if (!cache)
                return caches.match('./offline.html');

            return cache;
        }
    }());

    // event.respondWith(
    // 	caches.match(event.request).then(function(response) {
    // 		return response || fetch(event.request);
    // 	})
    // );
});
