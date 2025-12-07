// serviceWorkerRegistration.js
const isLocalhost = Boolean(
	window.location.hostname === 'localhost' ||
		window.location.hostname === '[::1]' ||
		window.location.hostname.match(
			/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
		),
);

export function register(config) {
	// РЕГИСТРИРУЕМ ТОЛЬКО В PRODUCTION
	if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
		const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);

		if (publicUrl.origin !== window.location.origin) {
			return;
		}

		window.addEventListener('load', () => {
			const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

			if (isLocalhost) {
				// Проверка Service Worker на localhost
				checkValidServiceWorker(swUrl, config);
			} else {
				// Регистрация для production
				registerValidSW(swUrl, config);
			}
		});
	} else {
		console.log('Service Worker: режим разработки, регистрация отключена');
	}
}

function registerValidSW(swUrl, config) {
	navigator.serviceWorker
		.register(swUrl)
		.then((registration) => {
			console.log('Service Worker зарегистрирован:', registration);

			registration.onupdatefound = () => {
				const installingWorker = registration.installing;
				if (installingWorker == null) {
					return;
				}

				installingWorker.onstatechange = () => {
					if (installingWorker.state === 'installed') {
						if (navigator.serviceWorker.controller) {
							console.log(
								'Новая версия приложения доступна. Перезагрузите страницу для обновления.',
							);

							if (config && config.onUpdate) {
								config.onUpdate(registration);
							}
						} else {
							console.log('Приложение готово к работе офлайн');

							if (config && config.onSuccess) {
								config.onSuccess(registration);
							}
						}
					}
				};
			};
		})
		.catch((error) => {
			console.error('Ошибка при регистрации Service Worker:', error);
		});
}

function checkValidServiceWorker(swUrl, config) {
	fetch(swUrl, {
		headers: { 'Service-Worker': 'script' },
	})
		.then((response) => {
			const contentType = response.headers.get('content-type');

			if (
				response.status === 404 ||
				(contentType != null && contentType.indexOf('javascript') === -1)
			) {
				navigator.serviceWorker.ready.then((registration) => {
					registration.unregister().then(() => {
						window.location.reload();
					});
				});
			} else {
				registerValidSW(swUrl, config);
			}
		})
		.catch(() => {
			console.warn(
				'Нет подключения к интернету. Приложение работает в оффлайн-режиме.',
			);
		});
}

export function unregister() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.ready
			.then((registration) => {
				registration.unregister();
				console.log('Service Worker отключен');
			})
			.catch((error) => {
				console.error('Ошибка при отключении Service Worker:', error);
			});
	}
}
