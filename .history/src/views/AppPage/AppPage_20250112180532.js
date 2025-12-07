// src/views/AppPage/AppPage.js

import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MapArea from '../../components/MapArea/MapArea';
import BookingTable from '../../components/BookingTable/BookingTable';
import './AppPage.styles.css';

function AppPage() {
	const [availableSpaces, setAvailableSpaces] = useState(
		Array.from({ length: 40 }, (_, i) => i + 1),
	); // Доступные места (1-40)
	const [bookedSpaces, setBookedSpaces] = useState([]); // Забронированные места
	const [selectedSpace, setSelectedSpace] = useState(null); // Выбранное место

	const handleSelectSpace = space => {
		if (!bookedSpaces.includes(space)) {
			setSelectedSpace(space);
		}
	};

	const handleConfirmSelection = () => {
		if (selectedSpace !== null) {
			setAvailableSpaces(
				availableSpaces.filter(space => space !== selectedSpace),
			);
			setBookedSpaces([...bookedSpaces, selectedSpace]);
			setSelectedSpace(null);
		}
	};

	const handleUpdateMap = () => {
		console.log('Обновление карты');
	};

	const handleFindAvailableSpace = () => {
		console.log('Поиск свободных мест');
	};

	return (
		<Layout>
			<Header />
			<main>
				<h2>Парковка</h2>
				<MapArea
					availableSpaces={availableSpaces}
					bookedSpaces={bookedSpaces}
					selectedSpace={selectedSpace}
					handleSelectSpace={handleSelectSpace}
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
