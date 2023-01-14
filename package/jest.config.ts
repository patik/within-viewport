import type { Config } from 'jest'

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    rootDir: '.',
    testPathIgnorePatterns: ['.js'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/jest-setup.ts'],
}

export default config
