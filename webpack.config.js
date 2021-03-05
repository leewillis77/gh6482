// Load the default @wordpress/scripts config object
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

// Use the defaultConfig but replace the entry and output properties
module.exports = {
	...defaultConfig,
	entry: {
		'setup-tasks': './js/src/setup-tasks.js',
	},
	output: {
		filename: '[name].js',
		path: __dirname + '/js/dist',
	},
};
