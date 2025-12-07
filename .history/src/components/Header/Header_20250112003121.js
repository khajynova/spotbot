import React from 'react';
import logo from '../../assets/images/logo.png'; // Путь к логотипу

const Header = () => {
	return (
		<header className='header'>
			<img src={logo} alt='Logo' className='logo' />
			<h1>SpotBot - приложение для поиска свободного места</h1>
		</header>
	);
};

export default Header;
