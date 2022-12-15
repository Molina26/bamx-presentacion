const STATIC_CACHE_NAME = 'static-cache-v1.0';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.0';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.0';

const cleanCache = (cacheName, limitItems) => {
    caches.open(cacheName).then((cache) => {
        return cache.keys().then((keys) => {
            if (keys.length > limitItems) {
                cache.delete(keys[0]).then(cleanCache(cacheName, limitItems));
            }
        });
    });
};

self.addEventListener('install', (event) => {
    console.log("Instalado");
    const respCache = caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll([
            '/',
            'index.html',
            'images/BAMX.ico',
            'js/app.js',
            'js/functions.js',
            'js/camera.js',
            'images/icons/bamx-launchericon-48-48.png',
            'images/icons/bamx-launchericon-72-72.png',
            'images/icons/bamx-launchericon-96-96.png',
            'images/icons/bamx-launchericon-144-144.png',
            'images/icons/bamx-launchericon-192-192.png',
            'images/icons/bamx-launchericon-512-512.png',
            'manifest.json',
            'pages/login.html',
            'pages/recolectionDetail.html',
            'pages/recolections.html',
        ]);
    });
    const respCacheInmutable = caches.open(INMUTABLE_CACHE_NAME).then((cache) => {
        return cache.addAll([
            'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js'
        ]);
    });
    event.waitUntil(Promise.all([respCache, respCacheInmutable]));
});

self.addEventListener('activate', (event) => {
    console.log("Activado!");
    const proDelete = caches.keys().then((cachesItems) => {
        cachesItems.forEach(element => {
            if (element !== STATIC_CACHE_NAME && element.includes('static')) {
                return caches.delete(element);
            }
        })
    })
    event.waitUntil(proDelete);
})

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('api') && event.request.method != "POST") {
        const resp = fetch(event.request).then((respWeb) => {
            if (!respWeb) {
                return caches.match(event.request);
            }
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                cache.put(event.request, respWeb)
                cleanCache(DYNAMIC_CACHE_NAME, 41);
            })
            return respWeb.clone();
        }).catch(() => {
            return caches.match(event.request);
        });
        event.respondWith(resp)
    } else {
        const respCache = caches.match(event.request)
        event.respondWith(respCache);
    }
});

self.addEventListener('sync', (event)=>{
    console.log('Sincronizando');
})