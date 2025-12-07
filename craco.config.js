const path = require('path');

module.exports = {
	reactScriptsVersion: 'react-scripts',
	devServer: {
		port: 3000, // явно указываем порт
		historyApiFallback: {
			index: '/spotbot/index.html',
		},
	},
	webpack: {
		configure: (webpackConfig) => {
			webpackConfig.output.publicPath = '/spotbot/';
			return webpackConfig;
		},
		alias: {
			'@assets': path.resolve(__dirname, 'src/assets'),
			'@views': path.resolve(__dirname, 'src/views'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@services': path.resolve(__dirname, 'src/services'),
		},
	},
};
