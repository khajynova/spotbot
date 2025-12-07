// В НАЧАЛЕ файла AppPage.js ДОЛЖНА быть эта строка:
const serverIP = 'http://localhost:3001'; // или process.env.REACT_APP_API_URL || 'http://localhost:3001'

// Пример полного начала файла:
import React, { useEffect, useState } from 'react';
import './AppPage.styles.css';

const AppPage = () => {
	const serverIP =
		process.env.NODE_ENV === 'production'
			? 'https://khajynova.github.io/spotbot/api'
			: 'http://localhost:3001';
	const [freeSpaces, setFreeSpaces] = useState(Array(53).fill(0));
	const [reservedSpaces, setReservedSpaces] = useState([]);
	const [time, setTime] = useState('--:--:--');
	const [error, setError] = useState(null);

	const loadMap = () => {
		console.log('🔄 Загрузка данных с сервера...');
		console.log('URL:', `${serverIP}/getFreeSpaces`);

		fetch(`${serverIP}/getFreeSpaces`)
			.then((response) => {
				console.log('📥 Ответ сервера:', response.status, response.statusText);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				console.log('✅ Данные получены:', data.length, 'элементов');
				console.log('Пример данных:', data.slice(0, 5));

				setFreeSpaces(data);

				let freeCount = 0;
				let occupiedCount = 0;

				data.forEach((space, index) => {
					if (reservedSpaces.find((reserved) => reserved.id === index + 1)) {
						return; // Забронированное место
					}
					if (space === 0) {
						freeCount++;
					} else {
						occupiedCount++;
					}
				});

				// Обновляем данные на странице
				document.getElementById('free-count-box').innerText = freeCount;
				document.getElementById('occupied-count-box').innerText = occupiedCount;
				document.getElementById('reserved-count-box').innerText =
					reservedSpaces.length;

				// Очищаем ошибки при успешной загрузке
				setError(null);
			})
			.catch((error) => {
				console.error('❌ Ошибка загрузки:', error);
				setError('Не удалось загрузить данные. Проверьте сервер.');
			});
	};

	const reserveSpace = (index) => {
		if (freeSpaces[index] === 0) {
			const now = new Date();

			fetch(serverIP + '/reserve?index=' + index)
				.then((response) => {
					if (!response.ok) {
						throw new Error('Ошибка при бронировании места.');
					}
					return response.text();
				})
				.then((message) => {
					alert(message);

					setFreeSpaces((prev) => {
						const updatedSpaces = [...prev];
						updatedSpaces[index] = 1; // Обновляем состояние места на "занято"
						return updatedSpaces;
					});

					setReservedSpaces((prev) => [...prev, { id: index + 1, time: now }]);
					loadMap();
				})
				.catch((error) => {
					console.error(error);
					setError('Ошибка при бронировании места. Попробуйте снова.');
				});
		} else {
			alert('Это место уже занято!');
		}
	};

	const cancelReservation = (id) => {
		setReservedSpaces((prev) => prev.filter((reserved) => reserved.id !== id));
		setFreeSpaces((prev) => {
			const updatedSpaces = [...prev];
			updatedSpaces[id - 1] = 0; // Освобождаем место
			return updatedSpaces;
		});
		loadMap();
	};

	const updateReservedList = () => {
		const reservedList = document.getElementById('reserved-list');
		reservedList.innerHTML = '';

		reservedSpaces.forEach((space) => {
			const duration = calculateDuration(space.time);
			const li = document.createElement('li');
			li.innerHTML = `
        Место ${space.id} - бронь в ${space.time.toLocaleTimeString('ru-RU', {
				timeZone: 'Europe/Minsk',
			})} (${duration})
        <button class="cancel-reservation" data-id="${space.id}">Отмена</button>
      `;
			reservedList.appendChild(li);
		});

		// Обработчики для кнопок отмены бронирования
		document.querySelectorAll('.cancel-reservation').forEach((button) => {
			button.addEventListener('click', (event) =>
				cancelReservation(parseInt(event.target.getAttribute('data-id'), 10)),
			);
		});
	};

	const calculateDuration = (startTime) => {
		const now = new Date();
		const duration = Math.floor((now - startTime) / 1000); // Время в секундах
		const hours = Math.floor(duration / 3600);
		const minutes = Math.floor((duration % 3600) / 60);
		const seconds = duration % 60;
		return `${hours}ч ${minutes}м ${seconds}с`;
	};

	useEffect(() => {
		const timeInterval = setInterval(() => {
			const now = new Date();
			const options = {
				timeZone: 'Europe/Minsk',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			};
			setTime(now.toLocaleTimeString('ru-RU', options));
		}, 1000);

		loadMap();

		const mapInterval = setInterval(() => {
			loadMap();
		}, 5000);

		return () => {
			clearInterval(timeInterval);
			clearInterval(mapInterval);
		};
	}, []);

	return (
		<div className='app-page'>
			{/* Отображение ошибки */}
			{error && (
				<div
					style={{
						position: 'fixed',
						top: '10px',
						right: '10px',
						backgroundColor: '#e74c3c',
						color: '#fff',
						padding: '10px 20px',
						borderRadius: '5px',
						boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
						zIndex: '1000',
					}}
				>
					{error}
				</div>
			)}

			<header>
				<h1>SpotBot - Find the Spot!</h1>
				<p>
					Автоматизированное решение для анализа и управления свободными местами
				</p>
			</header>

			<div className='container'>
				<div className='parking-area'>
					{/* Первый ряд */}
					<div className='row row-1'>
						{[...Array(15)].map((_, index) => (
							<div
								key={index}
								className={`space ${
									reservedSpaces.find((reserved) => reserved.id === index + 1)
										? 'reserved'
										: freeSpaces[index] === 0
										? 'free'
										: 'occupied'
								}`}
								id={`space-${index + 1}`}
								onClick={() => reserveSpace(index)}
							>
								{index + 1}
							</div>
						))}
					</div>

					{/* Второй ряд */}
					<div className='row row-2'>
						{[...Array(12)].map((_, index) => (
							<div
								key={index + 15}
								className={`space ${
									reservedSpaces.find((reserved) => reserved.id === index + 16)
										? 'reserved'
										: freeSpaces[index + 15] === 0
										? 'free'
										: 'occupied'
								}`}
								id={`space-${index + 16}`}
								onClick={() => reserveSpace(index + 15)}
							>
								{index + 16}
							</div>
						))}
					</div>

					{/* Третий ряд */}
					<div className='row row-3'>
						{[...Array(12)].map((_, index) => (
							<div
								key={index + 27}
								className={`space ${
									reservedSpaces.find((reserved) => reserved.id === index + 28)
										? 'reserved'
										: freeSpaces[index + 27] === 0
										? 'free'
										: 'occupied'
								}`}
								id={`space-${index + 28}`}
								onClick={() => reserveSpace(index + 27)}
							>
								{index + 28}
							</div>
						))}
					</div>

					{/* Четвёртый ряд */}
					<div className='row row-4'>
						{[...Array(14)].map((_, index) => (
							<div
								key={index + 39}
								className={`space ${
									reservedSpaces.find((reserved) => reserved.id === index + 40)
										? 'reserved'
										: freeSpaces[index + 39] === 0
										? 'free'
										: 'occupied'
								}`}
								id={`space-${index + 40}`}
								onClick={() => reserveSpace(index + 39)}
							>
								{index + 40}
							</div>
						))}
					</div>
				</div>

				<div className='info'>
					<div>
						<strong>Общее количество мест:</strong>
						<div className='space transparent'>53</div>
					</div>
					<div>
						<strong>Свободных мест:</strong>
						<div className='space free' id='free-count-box'>
							0
						</div>
					</div>
					<div>
						<strong>Занятых мест:</strong>
						<div className='space occupied' id='occupied-count-box'>
							0
						</div>
					</div>
					<div>
						<strong>Забронированных мест:</strong>
						<div className='space reserved' id='reserved-count-box'>
							0
						</div>
					</div>
					<ul id='reserved-list'></ul>
				</div>
				<div>
					<strong>Текущее время:</strong>
					<span id='time-counter'>{time}</span>
				</div>
			</div>
			<footer>
				<p>
					&copy; 2026 SpotBot. Все права защищены.{' '}
					<a href='mailto:khajynova@gmail.com'>Свяжитесь с нами</a>
				</p>
			</footer>
		</div>
	);
};

export default AppPage;
