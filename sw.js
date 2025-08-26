const CACHE_NAME = 'staraya-shkola-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/site.webmanifest',
    '/favicon.ico',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/apple-touch-icon.png'
];

// Установка Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Error during cache installation:', error);
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Перехват сетевых запросов
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Возвращаем кэшированный ответ, если он есть
                if (response) {
                    return response;
                }

                // Клонируем запрос, так как он может быть использован только один раз
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(response => {
                    // Проверяем, что получили валидный ответ
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Клонируем ответ, так как он может быть использован только один раз
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            // Кэшируем только GET запросы
                            if (event.request.method === 'GET') {
                                cache.put(event.request, responseToCache);
                            }
                        });

                    return response;
                }).catch(error => {
                    console.error('Fetch failed:', error);
                    
                    // Возвращаем fallback для HTML страниц
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

// Обработка push уведомлений
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/favicon-192x192.png',
            badge: '/favicon-96x96.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Посмотреть меню',
                    icon: '/icon-menu.png'
                },
                {
                    action: 'reserve',
                    title: 'Забронировать',
                    icon: '/icon-reservation.png'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/#menu')
        );
    } else if (event.action === 'reserve') {
        event.waitUntil(
            clients.openWindow('/#reservation')
        );
    } else {
        // Открываем главную страницу по умолчанию
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Обработка фоновой синхронизации
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Здесь можно добавить логику для фоновой синхронизации
            // например, отправку отложенных запросов на сервер
            console.log('Background sync triggered')
        );
    }
});

// Обработка сообщений от основного потока
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Обработка ошибок
self.addEventListener('error', event => {
    console.error('Service Worker error:', event.error);
});

// Обработка необработанных промисов
self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker unhandled rejection:', event.reason);
});
