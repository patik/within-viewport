/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    testPathIgnorePatterns: ['.js'],
    moduleNameMapper: {
        '^dof$': '<rootDir>/dist/index.js',
    },
}
