import React from 'react';
import './MapArea.css';

const MapArea = ({
	availableSpaces,
	selectedSpace,
	handleSelectSpace,
	bookedSpaces,
}) => {
	const rows = 6; // количество рядов на парковке
	const cols = 10; // количество мест в каждом ряду

	// Генерация сетки парковки
	const renderParkingGrid = () => {
		const spaces = [];
		let spaceNumber = 1;

		for (let row = 0; row < rows; row++) {
			const rowSpaces = [];
			for (let col = 0; col < cols; col++) {
				const isAvailable = availableSpaces.includes(spaceNumber);
				const isBooked = bookedSpaces.includes(spaceNumber);
				const isSelected = selectedSpace === spaceNumber;

				rowSpaces.push(
					<div
						key={spaceNumber}
						className={`parking-space ${
							isBooked
								? 'occupied'
								: isSelected
								? 'selected'
								: isAvailable
								? 'available'
								: ''
						}`}
						onClick={() => isAvailable && handleSelectSpace(spaceNumber)}
					>
						{spaceNumber}
					</div>,
				);
				spaceNumber++;
			}
			spaces.push(
				<div key={`row-${row}`} className='parking-row'>
					{rowSpaces}
				</div>,
			);
		}
		return spaces;
	};

	return (
		<div className='map-area'>
			<h3>Карта парковки</h3>
			<div className='parking-grid'>{renderParkingGrid()}</div>
		</div>
	);
};

export default MapArea;
