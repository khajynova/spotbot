import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppPage from '@views/AppPage/AppPage';
import '@assets/styles/index.css';
import * as serviceWorkerRegistration from './services/serviceWorkerRegistration';

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
	console.log('beforeinstallprompt event fired');
	e.preventDefault();
	deferredPrompt = e;

	if (!localStorage.getItem('installDismissed')) {
		showInstallBanner();
	}
});

function showInstallBanner() {
	const banner = document.createElement('div');
	banner.id = 'install-banner';
	banner.style.position = 'fixed';
	banner.style.bottom = '0';
	banner.style.left = '0';
	banner.style.right = '0';
	banner.style.padding = '20px';
	banner.style.backgroundColor = '#256068';
	banner.style.color = '#fff';
	banner.style.textAlign = 'center';
	banner.style.boxShadow = '0 -2px 5px rgba(0, 0, 0, 0.1)';
	banner.innerHTML = `
    <p style="margin: 0;">Установи SpotBot приложение для удобства!</p>
    <button id="install-button" style="margin-left: 10px; padding: 10px 20px; background-color: #fff; color: #256068; border: none; border-radius: 4px; cursor: pointer;">Установить</button>
    <button id="dismiss-button" style="margin-left: 10px; padding: 10px 20px; background-color: #fff; color: #256068; border: none; border-radius: 4px; cursor: pointer;">Нет, спасибо</button>
  `;

	document.body.appendChild(banner);

	const installButton = document.getElementById('install-button');
	const dismissButton = document.getElementById('dismiss-button');

	installButton.addEventListener('click', () => {
		banner.remove();
		promptInstall();
	});

	dismissButton.addEventListener('click', () => {
		banner.remove();
		localStorage.setItem('installDismissed', 'true');
	});
}

function promptInstall() {
	if (deferredPrompt) {
		deferredPrompt.prompt();

		deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				console.log('User accepted the install prompt');
			} else {
				console.log('User dismissed the install prompt');
			}

			deferredPrompt = null;
		});
	}
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter basename='/spotbot'>
		<AppPage />
	</BrowserRouter>,
);

// Регистрация service worker ТОЛЬКО в production
serviceWorkerRegistration.register();

// Если хотите отключить service worker в development:
if (process.env.NODE_ENV === 'production') {
	serviceWorker();
}
