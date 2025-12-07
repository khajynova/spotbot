import React from 'react';
import './MapArea.css';

const MapArea = ({
	availableSpaces,
	bookedSpaces,
	selectedSpace,
	handleSelectSpace,
}) => {
	const totalSpaces = 53; // Всего мест
	const freeSpaces = totalSpaces - bookedSpaces.length;

	const renderSpaces = () => {
		// Создаем ряды
		const rows = [
			{ count: 15, offsetLeft: 0, gapBelow: 300, startIndex: 0 }, // Верхний ряд
			{ count: 12, offsetLeft: 200, gapBelow: 0, startIndex: 15 }, // Второй ряд
			{ count: 12, offsetLeft: 200, gapBelow: 300, startIndex: 27 }, // Третий ряд
			{ count: 14, offsetLeft: 100, gapBelow: 0, startIndex: 39 }, // Нижний ряд
		];

		return rows.map((row, rowIndex) => (
			<div
				key={rowIndex}
				className='map-row'
				style={{
					marginLeft: `${row.offsetLeft}px`,
					marginBottom: `${row.gapBelow}px`,
				}}
			>
				{Array.from({ length: row.count }, (_, i) => {
					const spaceIndex = row.startIndex + i + 1; // Индекс текущей ячейки
					return (
						<div
							key={spaceIndex}
							className={`map-space ${
								bookedSpaces.includes(spaceIndex)
									? 'booked'
									: selectedSpace === spaceIndex
									? 'selected'
									: 'available'
							}`}
							onClick={() => {
								if (!bookedSpaces.includes(spaceIndex)) {
									handleSelectSpace(spaceIndex);
								}
							}}
						>
							{spaceIndex}
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
