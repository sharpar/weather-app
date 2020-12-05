module.exports = {
	env: {
		browser: true,
		node: true,
	},
	settings: {
		react: {
			version: 'detect',
		},
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx'],
			},
		},
	},
	extends: ['eslint:recommended', 'react-app', 'plugin:react/recommended'],
	plugins: ['react-hooks'],
};
