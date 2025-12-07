import React from 'react';
import './MapArea.css';

const MapArea = ({
	availableSpaces,
	bookedSpaces,
	selectedSpace,
	handleSelectSpace,
}) => {
	const totalSpaces = 53; // Общее количество мест
	const freeSpaces = totalSpaces - bookedSpaces.length;

	const renderSpaces = () => {
		const rows = [
			{ size: 15, spaces: availableSpaces.slice(0, 15) }, // Верхний ряд
			{ size: 12, spaces: availableSpaces.slice(15, 27) }, // Первый сдвоенный ряд
			{ size: 12, spaces: availableSpaces.slice(27, 39) }, // Второй сдвоенный ряд
			{ size: 14, spaces: availableSpaces.slice(39, 53) }, // Нижний ряд
		];

		return rows.map((row, rowIndex) => (
			<div
				key={rowIndex}
				className={`map-row ${
					rowIndex === 1 || rowIndex === 2 ? 'double-row' : ''
				}`} // Добавляем класс для сдвоенных рядов
			>
				{Array.from({ length: row.size }, (_, i) => {
					const spaceIndex = row.spaces[i];
					return (
						<div
							key={spaceIndex || `empty-${i}`}
							className={`map-space ${
								bookedSpaces.includes(spaceIndex)
									? 'booked'
									: selectedSpace === spaceIndex
									? 'selected'
									: 'available'
							}`}
							onClick={() => spaceIndex && handleSelectSpace(spaceIndex)}
						>
							{spaceIndex || ''}
						</div>
					);
				})}
			</div>
		));
	};

	return (
		<div className='map-area'>
			<h3>Карта пространства</h3>
			<div className='map-info'>
				<p>Всего мест: {totalSpaces}</p>
				<p>Занято: {bookedSpaces.length}</p>
				<p>Свободно: {freeSpaces}</p>
			</div>
			<div className='map-grid'>{renderSpaces()}</div>
		</div>
	);
};

export default MapArea;
