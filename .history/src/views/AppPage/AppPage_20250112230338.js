import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MapArea from '../../components/MapArea/MapArea';
import './AppPage.styles.css';

function AppPage() {
	const [availableSpaces, setAvailableSpaces] = useState(
		Array.from({ length: 53 }, (_, i) => i + 1),
	); // Доступные места
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

	return (
		<Layout>
			<Header />
			<main>
				<h2>Пространство</h2>
				<MapArea
					availableSpaces={availableSpaces}
					bookedSpaces={bookedSpaces}
					selectedSpace={selectedSpace}
					handleSelectSpace={handleSelectSpace}
				/>
				<div className='buttons'>
					{selectedSpace && (
						<button onClick={handleConfirmSelection}>Подтвердить</button>
					)}
				</div>
			</main>
			<Footer />
		</Layout>
	);
}

export default AppPage;
