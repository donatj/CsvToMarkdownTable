import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
	{
		ignores: ['node_modules/**', 'lib/**', 'coverage/**']
	},
	{
		files          : ['**/*.ts'],
		languageOptions: {
			parser     : tsParser,
			ecmaVersion: 2020,
			sourceType : 'module',
		},
		plugins        : {
			'@typescript-eslint': tseslint,
		},
		rules          : {
			// Equivalent to class-name: true in TSLint
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'class',
					format  : ['PascalCase']
				}
			],

			// Equivalent to indent: [true, "tabs"] in TSLint
			'indent': ['error', 'tab'],

			// Disabled rules from TSLint
			'quotes'                            : 'off', // quotemark: false
			'@typescript-eslint/no-explicit-any': 'off', // align: false (partial equivalent)
			'eqeqeq'                            : 'off', // triple-equals: false
			'max-len'                           : 'off', // max-line-length: false
			'eol-last'                          : 'off', // eofline: false
			'no-empty'                          : 'off', // no-empty: false
			'one-var'                           : 'off', // one-variable-per-declaration: false
			'max-classes-per-file'              : 'off', // max-classes-per-file: false
			'no-bitwise'                        : 'off', // no-bitwise: false

			// Additional whitespace rules to match whitespace: false in TSLint
			'space-before-function-paren': 'off',
			'space-before-blocks'        : 'off',
			'keyword-spacing'            : 'off',
			'space-infix-ops'            : 'off',
		},
	},
];
