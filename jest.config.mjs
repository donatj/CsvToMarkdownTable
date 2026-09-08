/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
	preset                : 'ts-jest/presets/default-esm',
	testEnvironment       : 'node',
	transform             : {
		'^.+\\.tsx?$': ['ts-jest', {
			tsconfig: 'tsconfig.json',
			useESM: true,
		}],
	},
	moduleFileExtensions  : ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	testMatch             : ['**/test/**/*.ts', '**/test/**/*.js'],
	testPathIgnorePatterns: ['/node_modules/', '/lib/', '.*\\.d\\.ts$'],
	collectCoverageFrom   : [
		'src/**/*.ts',
		'!**/node_modules/**',
	],
	coverageReporters     : ['text', 'lcov'],
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper      : {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
};

export default config;
