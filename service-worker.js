/* eslint-disable no-restricted-globals */

// Импорт необходимых модулей Workbox
import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

// Precaching: кэширование файлов, сгенерированных при сборке
precacheAndRoute(self.__WB_MANIFEST || []);

// App Shell Routing: обрабатывает навигационные запросы и возвращает index.html
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(({ request, url }) => {
	if (request.mode !== 'navigate') {
		return false;
	}
	if (url.pathname.startsWith('/_')) {
		return false;
	}
	if (url.pathname.match(fileExtensionRegexp)) {
		return false;
	}
	return true;
}, createHandlerBoundToURL(`${process.env.PUBLIC_URL}/index.html`));

// Runtime Caching: пример стратегии для изображений
registerRoute(
	({ request }) => request.destination === 'image',
	new StaleWhileRevalidate({
		cacheName: 'image-cache',
		plugins: [
			new ExpirationPlugin({
				maxEntries: 50,
				maxAgeSeconds: 30 * 24 * 60 * 60,
			}), // Максимум 50 изображений, срок хранения 30 дней
		],
	}),
);

// Обработчик для событий `message`
self.addEventListener('message', event => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		console.log('Service Worker: Пропускаем стадию ожидания...');
		self.skipWaiting();
	}
});

// Обработчик события `install`
self.addEventListener('install', event => {
	console.log('Service Worker: Установлен');
	self.skipWaiting(); // Пропускаем стадию ожидания сразу
});

// Обработчик события `activate`
self.addEventListener('activate', event => {
	console.log('Service Worker: Активирован');
	// Очистка старого кэша, если потребуется
	event.waitUntil(
		caches.keys().then(cacheNames =>
			Promise.all(
				cacheNames.map(cacheName => {
					if (cacheName !== 'static-cache-v1' && cacheName !== 'image-cache') {
						console.log('Service Worker: Удаляем старый кэш', cacheName);
						return caches.delete(cacheName);
					}
				}),
			),
		),
	);
});

// Логика событий `fetch`
self.addEventListener('fetch', event => {
	// Кэширование запросов только для GET
	if (event.request.method === 'GET') {
		event.respondWith(
			caches.match(event.request).then(response => {
				if (response) {
					return response; // Возвращаем кэшированный ответ
				}
				return fetch(event.request).then(networkResponse => {
					return caches.open('static-cache-v1').then(cache => {
						cache.put(event.request, networkResponse.clone());
						return networkResponse;
					});
				});
			}),
		);
	}
});
