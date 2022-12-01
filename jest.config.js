const { pathsToModuleNameMapper } = require('ts-jest');

const tsConfigPaths = {
    '@/*': ['src/*'],
    '@tests/*': ['tests/*'],
};

module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__test__/.*|/tests/.*|(\\.|/)(test|spec))\\.[tj]sx?$',
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/coverage/', '/tests/TestClasses/', '/tests/TestData/'],
    moduleFileExtensions: ['js', 'ts'],
    moduleNameMapper: pathsToModuleNameMapper(tsConfigPaths, { prefix: `${__dirname}/` }),

    coverageDirectory: './coverage',
    coverageReporters: ['html-spa', 'text'],
    collectCoverageFrom: [
        'src/*.js',
        'src/*.ts',
        'src/**/*.js',
        'src/**/*.ts',
        '!**/build/**',
        '!**/dist/**',
        '!**/node_modules/**',
        '!**/tests/**',
        '!**/vendor/**',
    ],
};
