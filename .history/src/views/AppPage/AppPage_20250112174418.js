// src/views/AppPage/AppPage.js

import React from 'react';
import Layout from '../../components/Layout/Layout'; // Путь к Layout
import Header from '../../components/Header/Header'; // Путь к Header
import Footer from '../../components/Footer/Footer'; // Путь к Footer
import MapArea from '../../components/MapArea/MapArea'; // Путь к MapArea
import BookingTable from '../../components/BookingTable/BookingTable'; // Путь к BookingTable
import './AppPage.styles.css'; // Путь к стилям

function AppPage() {
	return (
		<Layout>
			<Header />
			<main>
				<h2>Схема парковки</h2>
				{/* Компонент MapArea отрисовывает карту */}
				<MapArea />

				{/* Опционально: вы можете оставить BookingTable или другие элементы */}
				<div className='info-section'>
					<h3>Забронированные места</h3>
					<BookingTable bookedSpaces={[]} /> {/* Пустой массив для примера */}
				</div>
			</main>
			<Footer />
		</Layout>
	);
}

export default AppPage;
