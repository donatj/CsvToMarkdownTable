import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import {nodeResolve} from '@rollup/plugin-node-resolve';

const input = 'src/CsvToMarkdown.ts';
const compatInput = 'src/CsvToMarkdown.compat.ts';
const name = 'csvToMarkdown';

// Shared TypeScript configuration
const typescriptPlugin = typescript({
	tsconfig       : './tsconfig.json',
	compilerOptions: {
		// Override emitDeclarationOnly for Rollup builds
		emitDeclarationOnly: false
	}
});

export default [
	// UMD build (for browsers, works as a global)
	{
		input: compatInput,
		output : {
			file   : 'lib/CsvToMarkdown.js',
			format : 'umd',
			name,
			exports: 'default',
			sourcemap: true
		},
		plugins: [
			nodeResolve(),
			typescriptPlugin
		]
	},
	// UMD minified
	{
		input: compatInput,
		output : {
			file     : 'lib/CsvToMarkdown.min.js',
			format   : 'umd',
			name,
			exports  : 'default',
			sourcemap: true
		},
		plugins: [
			nodeResolve(),
			typescriptPlugin,
			terser()
		]
	},
	// ESM build (for modern JS imports)
	{
		input,
		external: ['csv-walker'],
		output : {
			file  : 'lib/CsvToMarkdown.mjs',
			format: 'es',
			sourcemap: true
		},
		plugins: [
			nodeResolve(),
			typescriptPlugin
		]
	},
	// CommonJS build (for Node.js require)
	{
		input: compatInput,
		output : {
			file   : 'lib/CsvToMarkdown.cjs',
			format : 'cjs',
			exports: 'default',
			sourcemap: true
		},
		plugins: [
			nodeResolve(),
			typescriptPlugin
		]
	}
];
