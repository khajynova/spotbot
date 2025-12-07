import React, { useEffect, useState } from 'react';
import './MapArea.css';

const MapArea = ({
	bookedSpaces,
	selectedSpace,
	handleSelectSpace,
	handleConfirmSelection,
}) => {
	const [availableSpaces, setAvailableSpaces] = useState([]);

	// Загрузка данных с ESP32
	const fetchFreeSpots = async () => {
		try {
			const response = await fetch(`http://${ESP32_IP}/spot`); // Замените IP-адрес на ваш ESP32
			const data = await response.json();
			setAvailableSpaces(data);
		} catch (error) {
			console.error('Error fetching free spots:', error);
		}
	};

	useEffect(() => {
		fetchFreeSpots(); // Загрузка данных при первом рендере
	}, []);

	return (
		<div className='map-area'>
			<div className='map-grid'>
				{availableSpaces.map((space, index) => (
					<div
						key={index}
						className={`map-space ${
							bookedSpaces.includes(space.x + ',' + space.y)
								? 'booked'
								: selectedSpace === space.x + ',' + space.y
								? 'selected'
								: 'available'
						}`}
						onClick={() =>
							!bookedSpaces.includes(space.x + ',' + space.y)
								? handleSelectSpace(space.x + ',' + space.y)
								: null
						}
					>
						{space.x}, {space.y}
					</div>
				))}
			</div>
			<button onClick={fetchFreeSpots}>Обновить карту</button>
		</div>
	);
};

export default MapArea;
