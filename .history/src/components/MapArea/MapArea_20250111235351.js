import React from 'react';

const MapArea = ({ availableSpaces, selectedSpace, handleSelectSpace }) => {
	return (
		<div className='map-area'>
			{/* Здесь можно отобразить карту, которая будет отображать доступные места */}
			<h3>Карта пространства</h3>
			<div>
				{availableSpaces.map(space => (
					<div
						key={space}
						className={`map-space ${selectedSpace === space ? 'selected' : ''}`}
						onClick={() => handleSelectSpace(space)}
					>
						{`Место ${space}`}
					</div>
				))}
			</div>
		</div>
	);
};

export default MapArea;
