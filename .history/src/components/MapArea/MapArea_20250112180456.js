import React from 'react';
import './MapArea.css'; // Импорт стилей

const MapArea = ({
	availableSpaces,
	bookedSpaces,
	selectedSpace,
	handleSelectSpace,
}) => {
	const renderSpaces = () => {
		const rows = [];
		const spacesPerRow = 10; // Количество мест в одном ряду
		for (let i = 0; i < 40; i += spacesPerRow) {
			rows.push(availableSpaces.slice(i, i + spacesPerRow));
		}

		return rows.map((row, rowIndex) => (
			<div key={rowIndex} className='map-row'>
				{row.map(space => (
					<div
						key={space}
						className={`map-space ${
							bookedSpaces.includes(space)
								? 'booked'
								: selectedSpace === space
								? 'selected'
								: 'available'
						}`}
						onClick={() => handleSelectSpace(space)}
					>
						{space}
					</div>
				))}
			</div>
		));
	};

	return (
		<div className='map-area'>
			<h3>Карта парковки</h3>
			{renderSpaces()}
		</div>
	);
};

export default MapArea;
