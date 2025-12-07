import React, { useEffect, useState } from 'react';
import './AppPage.styles.css';

const serverIP = 'http://localhost:3000';

const AppPage = () => {
	const [freeSpaces, setFreeSpaces] = useState(Array(53).fill(0));
	const [reservedSpaces, setReservedSpaces] = useState([]);
	const [freeCount, setFreeCount] = useState(0);
	const [occupiedCount, setOccupiedCount] = useState(0);
	const [currentTime, setCurrentTime] = useState('--:--:--');
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Загрузка состояния мест с сервера
	const loadMap = async () => {
		try {
			const response = await fetch(`${serverIP}/getFreeSpaces`);
			const data = await response.json();
			setFreeSpaces(data);

			let free = 0;
			let occupied = 0;

			data.forEach((space, index) => {
				if (space === 0) free++;
				else occupied++;
			});

			setFreeCount(free);
			setOccupiedCount(occupied);
		} catch (error) {
			console.error('Ошибка загрузки данных:', error);
		}
	};

	// Обновление текущего времени
	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();
			setCurrentTime(
				now.toLocaleTimeString('ru-RU', { timeZone: 'Europe/Minsk' }),
			);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	// Обработка бронирования места
	const reserveSpace = async index => {
		if (freeSpaces[index] === 0) {
			try {
				const response = await fetch(`${serverIP}/reserve?index=${index}`);
				const message = await response.text();
				alert(message);

				setFreeSpaces(prev => {
					const updatedSpaces = [...prev];
					updatedSpaces[index] = 1;
					return updatedSpaces;
				});

				setReservedSpaces(prev => [
					...prev,
					{ id: index + 1, time: new Date() },
				]);
			} catch (error) {
				console.error('Ошибка при бронировании:', error);
			}
		} else {
			alert('Это место уже занято!');
		}
	};

	// Отмена бронирования
	const cancelReservation = id => {
		setReservedSpaces(prev => prev.filter(space => space.id !== id));
		setFreeSpaces(prev => {
			const updatedSpaces = [...prev];
			updatedSpaces[id - 1] = 0;
			return updatedSpaces;
		});
	};

	// Обновление карты
	useEffect(() => {
		loadMap();
		const interval = setInterval(loadMap, 500);
		return () => clearInterval(interval);
	}, []);

	// Обработка открытия/закрытия модального окна
	const toggleModal = () => {
		setIsModalOpen(prev => !prev);
	};

	return (
		<div className='container'>
			{/* Шапка */}
			<header>
				<h1>SpotBot - Find the Spot!</h1>
				<p>
					Автоматизированное решение для анализа и управления свободными местами
				</p>
			</header>

			{/* Карта парковки */}
			<div className='parking-area'>
				{[...Array(53)].map((_, index) => (
					<div
						key={index}
						id={`space-${index + 1}`}
						className={`space ${
							reservedSpaces.some(space => space.id === index + 1)
								? 'reserved'
								: freeSpaces[index] === 0
								? 'free'
								: 'occupied'
						}`}
						onClick={() => reserveSpace(index)}
					>
						{index + 1}
					</div>
				))}
			</div>

			{/* Информация о местах */}
			<div className='info'>
				<div>
					<strong>Общее количество мест:</strong>
					<div className='space transparent'>53</div>
				</div>
				<div>
					<strong>Свободных мест:</strong>
					<div className='space free'>{freeCount}</div>
				</div>
				<div>
					<strong>Занятых мест:</strong>
					<div className='space occupied'>{occupiedCount}</div>
				</div>
				<div>
					<strong>Забронированных мест:</strong>
					<div className='space reserved'>{reservedSpaces.length}</div>
				</div>
			</div>

			{/* Список забронированных мест */}
			<div className='booked'>
				<ul>
					{reservedSpaces.map(space => (
						<li key={space.id}>
							Место {space.id} - бронь в{' '}
							{space.time.toLocaleTimeString('ru-RU', {
								timeZone: 'Europe/Minsk',
							})}
							<button onClick={() => cancelReservation(space.id)}>
								Отмена
							</button>
						</li>
					))}
				</ul>
			</div>

			{/* Текущее время */}
			<div>
				<strong>Текущее время:</strong> <span>{currentTime}</span>
			</div>

			{/* Модальное окно */}
			<div className={`modal ${isModalOpen ? 'open' : ''}`} id='robot-modal'>
				<div className='modal-content'>
					<span className='close-btn' onClick={toggleModal}>
						&times;
					</span>
					<h2>Технические характеристики робота</h2>
					<p>модуль ESP32 (ESP-WROOM-32) 30pin</p>
					<p>драйвер двигателя L298N (2 шт)</p>
					<p>двигатель DC3V-6V DC мотор-редуктор(угловой) (2 шт)</p>
					<p>ультразвуковой датчик расстояния Ардуино HC-SR04 (3 шт)</p>
					<p>3-х осевой гироскоп и акселерометр GY-521 (MPU 6050)</p>
				</div>
			</div>
			<div className='robot' onClick={toggleModal}>
				<img src='robot.png' alt='Робот' />
				<span className='tooltip'>
					Нажмите на изображение, чтобы узнать характеристики робота
				</span>
			</div>

			{/* Подвал */}
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
