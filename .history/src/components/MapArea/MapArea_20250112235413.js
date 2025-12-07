import React from 'react';
import './MapArea.css';

const MapArea = ({
	availableSpaces,
	bookedSpaces,
	selectedSpace,
	handleSelectSpace,
}) => {
	const rows = [
		availableSpaces.slice(0, 15), // Верхний ряд: 15 ячеек
		availableSpaces.slice(15, 27), // Второй ряд: 12 ячеек
		availableSpaces.slice(27, 39), // Третий ряд: 12 ячеек
		availableSpaces.slice(39, 53), // Нижний ряд: 14 ячеек
	];

	return (
		<div className='map-area'>
			<div className='map-grid'>
				{rows.map((row, rowIndex) => (
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
								onClick={() =>
									!bookedSpaces.includes(space)
										? handleSelectSpace(space)
										: null
								}
							>
								{space}
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default MapArea;
