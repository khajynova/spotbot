import React, { useEffect, useState } from 'react';
import './AppPage.styles.css';

const AppPage = () => {
	const serverIP = 'http://localhost:3000'; // Адрес локального мок-сервера
	const [freeSpaces, setFreeSpaces] = useState(Array(53).fill(0));
	const [reservedSpaces, setReservedSpaces] = useState([]);
	const [time, setTime] = useState('--:--:--');
	const [error, setError] = useState(null);

	const loadMap = () => {
		fetch(serverIP + '/getFreeSpaces')
			.then(response => {
				if (!response.ok) {
					throw new Error('Ошибка загрузки данных с сервера.');
				}
				return response.json();
			})
			.then(data => {
				setFreeSpaces(data);

				let freeCount = 0;
				let occupiedCount = 0;

				data.forEach((space, index) => {
					if (reservedSpaces.find(reserved => reserved.id === index + 1)) {
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
			.catch(error => {
				console.error(error);
				setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
			});
	};

	const reserveSpace = index => {
		if (freeSpaces[index] === 0) {
			const now = new Date();

			fetch(serverIP + '/reserve?index=' + index)
				.then(response => response.text())
				.then(message => {
					alert(message);

					setFreeSpaces(prev => {
						const updatedSpaces = [...prev];
						updatedSpaces[index] = 1; // Обновляем состояние места на "занято"
						return updatedSpaces;
					});

					setReservedSpaces(prev => [...prev, { id: index + 1, time: now }]);

					loadMap();
				})
				.catch(error => {
					console.error(error);
					alert('Ошибка при бронировании места. Попробуйте снова.');
				});
		} else {
			alert('Это место уже занято!');
		}
	};

	const cancelReservation = id => {
		setReservedSpaces(prev => prev.filter(reserved => reserved.id !== id));
		setFreeSpaces(prev => {
			const updatedSpaces = [...prev];
			updatedSpaces[id - 1] = 0; // Освобождаем место
			return updatedSpaces;
		});
		loadMap();
	};

	const updateReservedList = () => {
		const reservedList = document.getElementById('reserved-list');
		reservedList.innerHTML = '';

		reservedSpaces.forEach(space => {
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
		document.querySelectorAll('.cancel-reservation').forEach(button => {
			button.addEventListener('click', event =>
				cancelReservation(parseInt(event.target.getAttribute('data-id'), 10)),
			);
		});
	};

	const calculateDuration = startTime => {
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
		}, 500);

		return () => {
			clearInterval(timeInterval);
			clearInterval(mapInterval);
		};
	}, []);

	return (
		<div className='app-page'>
			<header>
				<h1>SpotBot - Find the Spot!</h1>
				<p>
					Автоматизированное решение для анализа и управления свободными местами
				</p>
			</header>
			<div className='container'>
				<div className='parking-area'>
					{/* Генерация мест на основе индекса */}
					{[...Array(53)].map((_, index) => (
						<div
							key={index}
							className={`space ${
								reservedSpaces.find(reserved => reserved.id === index + 1)
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
					&copy; 2025 SpotBot. Все права защищены.{' '}
					<a href='mailto:deniskhajyn@gmail.com'>Свяжитесь с нами</a>
				</p>
			</footer>
		</div>
	);
};

export default AppPage;
