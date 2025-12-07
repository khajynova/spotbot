// src/views/AppPage/AppPage.js

import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout'; // Путь к Layout
import Header from '../../components/Header/Header'; // Путь к Header
import Footer from '../../components/Footer/Footer'; // Путь к Footer
import MapArea from '../../components/MapArea/MapArea'; // Путь к MapArea
import BookingTable from '../../components/BookingTable/BookingTable'; // Путь к BookingTable
import './AppPage.styles.css'; // Путь к стилям

function AppPage() {
	const [availableSpaces, setAvailableSpaces] = useState([
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
	]); // Доступные места
	const [bookedSpaces, setBookedSpaces] = useState([]); // Забронированные места
	const [selectedSpace, setSelectedSpace] = useState(null); // Выбранное место

	// Обработчик выбора места
	const handleSelectSpace = space => {
		setSelectedSpace(space);
	};

	// Обработчик подтверждения бронирования
	const handleConfirmSelection = () => {
		if (selectedSpace !== null) {
			setAvailableSpaces(
				availableSpaces.filter(space => space !== selectedSpace),
			);
			setBookedSpaces([...bookedSpaces, selectedSpace]);
			setSelectedSpace(null);
		}
	};

	// Обработчик обновления карты
	const handleUpdateMap = () => {
		console.log('Обновление карты');
	};

	// Обработчик поиска свободных мест
	const handleFindAvailableSpace = () => {
		console.log('Поиск свободных мест');
	};

	return (
		<Layout>
			<Header />
			<main>
				<h2>Место для отрисовки карты пространства</h2>
				<MapArea
					availableSpaces={availableSpaces}
					selectedSpace={selectedSpace}
					handleSelectSpace={handleSelectSpace}
					bookedSpaces={bookedSpaces}
				/>
				<div className='buttons'>
					<button onClick={handleUpdateMap}>Обновить карту</button>
					<button onClick={handleFindAvailableSpace}>
						Найти свободное место
					</button>
				</div>
				{availableSpaces.length > 0 && (
					<div>
						<h3>Свободные места</h3>
						<ul>
							{availableSpaces.map(space => (
								<li key={space}>
									<button
										onClick={() => handleSelectSpace(space)}
									>{`Место ${space}`}</button>
								</li>
							))}
						</ul>
						{selectedSpace && (
							<button onClick={handleConfirmSelection}>Подтвердить</button>
						)}
					</div>
				)}
				<BookingTable bookedSpaces={bookedSpaces} />
			</main>
			<Footer />
		</Layout>
	);
}

export default AppPage;
