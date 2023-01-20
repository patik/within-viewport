import { defineConfig } from 'cypress'
import installLogsPrinter from 'cypress-terminal-report/src/installLogsPrinter'

export default defineConfig({
    projectId: 'e6vu7j',
    e2e: {
        supportFile: false,
        setupNodeEvents(on /* , config */) {
            installLogsPrinter(on)
        },
    },
})
