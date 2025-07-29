import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import {nodeResolve} from '@rollup/plugin-node-resolve';

const input = 'src/CsvToMarkdown.ts';
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
		input,
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
		input,
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
		input,
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
