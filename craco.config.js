const path = require('path');

module.exports = {
	reactScriptsVersion: 'react-scripts',
	webpack: {
		configure: (webpackConfig, { env, paths }) => {
			// Для GitHub Pages
			webpackConfig.output.publicPath = '/spotbot/';

			// Для PWA
			if (env === 'production') {
				webpackConfig.plugins.forEach((plugin) => {
					if (plugin.constructor.name === 'GenerateSW') {
						plugin.config.maximumFileSizeToCacheInBytes = 10 * 1024 * 1024; // 10MB
						plugin.config.clientsClaim = true;
						plugin.config.skipWaiting = true;
					}
				});
			}

			return webpackConfig;
		},
		alias: {
			'@assets': path.resolve(__dirname, 'src/assets'),
			'@views': path.resolve(__dirname, 'src/views'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@services': path.resolve(__dirname, 'src/services'),
		},
	},
	devServer: {
		historyApiFallback: true,
	},
};
