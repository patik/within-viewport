import { defineConfig } from 'cypress'

export default defineConfig({
    projectId: 'oxu623',
    e2e: {
        supportFile: false,
        setupNodeEvents(/* on, config */) {
            // implement node event listeners here
        },
    },
})
