import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MapArea from '../../components/MapArea/MapArea';
import './AppPage.styles.css';

function AppPage() {
	const [availableSpaces] = useState(
		Array.from({ length: 53 }, (_, i) => i + 1),
	); // Всего мест
	const [bookedSpaces, setBookedSpaces] = useState([]); // Занятые места
	const [selectedSpace, setSelectedSpace] = useState(null); // Выбранное место

	const handleSelectSpace = space => {
		if (!bookedSpaces.includes(space)) {
			setSelectedSpace(space);
		}
	};

	const handleConfirmSelection = () => {
		if (selectedSpace !== null) {
			setBookedSpaces([...bookedSpaces, selectedSpace]);
			setSelectedSpace(null);
		}
	};

	const handleResetMap = () => {
		setBookedSpaces([]);
		setSelectedSpace(null);
	};

	return (
		<>
			<Header />
			<main>
				<h2>Карта пространства</h2>
				<div className='map-info'>
					<p>Всего мест: 53</p>
					<p>Занято: {bookedSpaces.length}</p>
					<p>Свободно: {53 - bookedSpaces.length}</p>
				</div>
				<MapArea
					availableSpaces={availableSpaces}
					bookedSpaces={bookedSpaces}
					selectedSpace={selectedSpace}
					handleSelectSpace={handleSelectSpace}
				/>
				<div className='buttons'>
					<button onClick={handleResetMap}>Обновить карту</button>
					{selectedSpace && (
						<button onClick={handleConfirmSelection}>Подтвердить место</button>
					)}
				</div>
			</main>
			<Footer />
		</>
	);
}

export default AppPage;
