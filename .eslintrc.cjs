// eslint-disable-next-line no-undef
module.exports = {
	root: true,
	ignorePatterns: [
		'dist/**',
	],
	env: {
		es2023: true,
		browser: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2023,
	},
	plugins: [
		'@typescript-eslint',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],
	rules: {
		'comma-dangle' : [
			'error',
			'always-multiline',
		],
		'eol-last': 'error',
		'eqeqeq': 'error',
		'indent': [
			'error',
			'tab',
			{ 'SwitchCase' : 1 },
		],
		'init-declarations': 'error',
		'linebreak-style': 'error',
		'keyword-spacing': 'error',
		'no-multiple-empty-lines': [
			'error',
			{ 'max': 1 },
		],
		'no-trailing-spaces': 'error',
		'prefer-const': 'error',
		'quotes': [
			'error',
			'single',
			{
				'avoidEscape': true,
				'allowTemplateLiterals': true,
			},
		],
		'semi': [
			'error',
			'never',
		],
		'space-before-blocks' : 'error',
		'strict': 'error',
	},
}
