const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Настройка CORS
app.use(
	cors({
		origin: 'http://localhost:3000', // явно указываем фронтенд
		credentials: true,
	}),
);

app.use(express.json());

let spaces = Array(53).fill(0);

// API endpoints
app.get('/getFreeSpaces', (req, res) => {
	console.log('📡 GET /getFreeSpaces - запрос от фронтенда');
	console.log('Origin:', req.headers.origin);
	res.json(spaces);
});

app.get('/reserve', (req, res) => {
	const index = parseInt(req.query.index);
	console.log(`📡 GET /reserve?index=${index}`);

	if (isNaN(index) || index < 0 || index >= spaces.length) {
		return res.status(400).json({ error: 'Invalid index' });
	}

	if (spaces[index] === 0) {
		spaces[index] = 1;
		console.log(`✅ Место ${index + 1} забронировано`);
		res.json({
			message: `Место ${index + 1} забронировано!`,
			success: true,
		});
	} else {
		console.log(`❌ Место ${index + 1} уже занято`);
		res.status(400).json({
			error: `Место ${index + 1} уже занято!`,
			success: false,
		});
	}
});

// Health check
app.get('/health', (req, res) => {
	res.json({
		status: 'OK',
		server: 'Mock API',
		port: PORT,
		spacesCount: spaces.length,
		freeSpaces: spaces.filter((s) => s === 0).length,
	});
});

app.listen(PORT, () => {
	console.log(`✅ Сервер API запущен на http://localhost:${PORT}`);
	console.log(`📡 Endpoints:`);
	console.log(`   • http://localhost:${PORT}/getFreeSpaces`);
	console.log(`   • http://localhost:${PORT}/reserve?index=0`);
	console.log(`   • http://localhost:${PORT}/health`);
});
