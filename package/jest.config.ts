import type { Config } from 'jest'

const config: Config = {
    testEnvironment: 'jsdom',
    rootDir: '.',
    testPathIgnorePatterns: ['.js'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/jest-setup.ts'],
    transform: {
        '^.+\\.(ts|tsx)?$': [
            'ts-jest',
            {
                isolatedModules: true,
            },
        ],
    },
}

export default config
