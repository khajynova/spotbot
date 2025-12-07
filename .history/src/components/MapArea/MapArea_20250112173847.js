import React from 'react';
import './MapArea.css'; // Обратите внимание на правильный импорт стилей

const MapArea = () => {
	const parkingSlots = [
		{ id: 'A1', status: 'free' },
		{ id: 'A2', status: 'occupied' },
		{ id: 'A3', status: 'free' },
		// Добавьте остальные места
	];

	const renderRow = (rowLabel, slotsCount) => {
		return (
			<div className='row'>
				{Array.from({ length: slotsCount }, (_, i) => {
					const slotId = `${rowLabel}${i + 1}`;
					const slot = parkingSlots.find(slot => slot.id === slotId) || {
						status: 'free',
					};
					return (
						<div
							key={slotId}
							className={`parking-slot ${slot.status}`}
							title={slotId}
						>
							{slotId}
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<div className='parking-map'>
			<h2>Схема парковки</h2>
			{renderRow('A', 10)}
			{renderRow('B', 10)}
			{renderRow('C', 10)}
			{renderRow('D', 10)}
		</div>
	);
};

export default MapArea;
