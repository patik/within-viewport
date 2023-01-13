import { defineConfig } from 'cypress'

export default defineConfig({
    projectId: 'oxu623',
    e2e: {
        supportFile: false,
    },
    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack',
        },
    },
})
