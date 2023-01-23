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
                // Disable type-checking by Jest because it's tedious while debugging (we'll rely on our lint scripts to prevent pushing bad code)
                isolatedModules: true,
            },
        ],
    },
}

export default config
