// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Массив мест (53 места: 0 - свободно, 1 - занято)
let spaces = Array(53).fill(0);

// Симуляция изменения состояния мест
function simulateSpaces() {
	spaces = spaces.map(() => Math.round(Math.random())); // Случайная генерация состояния (0 или 1)
}

// Middleware для обработки JSON запросов и настройки CORS
app.use(express.json());
app.use(cors());

// Указываем Express, где находятся статические файлы
app.use(express.static(path.join(__dirname, 'build')));

// API для получения состояния всех мест
app.get('/getFreeSpaces', (req, res) => {
	res.json(spaces);
});

// API для бронирования места
app.get('/reserve', (req, res) => {
	const index = parseInt(req.query.index);

	if (isNaN(index) || index < 0 || index >= spaces.length) {
		return res.status(400).send('Неверный индекс места.');
	}

	if (spaces[index] === 0) {
		spaces[index] = 1;
		res.send(`Место ${index + 1} забронировано!`);
	} else {
		res.status(400).send(`Место ${index + 1} уже занято!`);
	}
});

// Если запрос не относится к API, возвращаем главный HTML-файл
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Симуляция изменения состояния мест каждую секунду
setInterval(simulateSpaces, 10000);

// Запуск сервера
app.listen(port, () => {
	console.log(`Сервер работает на http://localhost:${port}`);
});
