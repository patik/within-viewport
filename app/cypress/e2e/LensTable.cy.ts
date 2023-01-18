import { del } from 'idb-keyval'
import useDofStore from '../../src/store/index'
import { config } from '../../package.json'

const baseUrl = `http://localhost:3000${config.basePath}`

describe('LensTable', () => {
    beforeEach(async () => {
        try {
            cy.log('Deleting local storage...')
            await del('dof-storage')
            cy.log('Deleting local storage finished.')
            window.location.hash = ''
        } catch (e) {
            cy.log('Deleting local storage failed: ', e)
        }
    })

    it('Removes all existing lenses', () => {
        cy.visit(baseUrl)

        const state = useDofStore.getState().lenses

        cy.log(`State has ${state.length} lenses before selecting`)
        console.log(`State has ${state.length} lenses before selecting`)

        // Make sure there are some lenses
        cy.get('button').contains('Add Lens').click()
        cy.get('[data-testid^="lens-name-"]').should('have.length.above', 0)
        cy.get('.lens-table-row').should('have.length.above', 0)

        cy.get('.lens-table-row').then(($elems) => {
            cy.log(`Table has ${$elems.length} rows before selecting`)
            console.log(`Table has ${$elems.length} rows before selecting`)
        })

        // Select All checkbox -> Delete button
        cy.get('[data-testid="select-all"]').click()
        cy.get('[data-testid="selected-count"]').contains(/\d+ selected/)
        cy.get('[data-testid="selected-count"]').then(($elems) => {
            cy.log(`Selected count: ${$elems.length}`)
            console.log(`Selected count: ${$elems.length}`)
        })

        cy.get('button[aria-label="Delete"]').click()

        cy.log(`State has ${state.length} lenses after deleting`)
        console.log(`State has ${state.length} lenses after deleting`)

        cy.get('[data-testid^="lens-name-"]').should('have.length', 0)
    })

    describe('Updates the depth of field calculation when the lens inputs are changed', () => {
        it('metric', () => {
            cy.visit(baseUrl)
            // Ensure that there is exactly one lens in the table
            cy.get('button').contains('Add Lens').click()
            cy.get('[data-testid="select-all"]').click()
            cy.get('button[aria-label="Delete"]').click()
            cy.get('button').contains('Add Lens').click()

            cy.get('button[value="metric"]').click()

            // Make sure the initial value isn't the same one we'll be testing for in the end so thst we know for sure it's updated
            cy.get('[data-testid^="dof-"]').last().should('not.have.text', '0.61')

            cy.get('[data-testid^="focal-length-"] input').last().focus().type('{selectall}').type('72')
            cy.get('[data-testid^="aperture-"]').last().parent().click().get('ul > li[data-value="f/3.4"]').click()
            cy.get('[data-testid^="sensor-"]').last().parent().click().get('ul > li[data-value="NikonD3k"]').click()

            cy.get('[data-testid^="dof-"]').last().should('have.text', '0.61')

            // Check DoF details
            cy.get('[aria-label="expand row"]').last().click()
            cy.get('[aria-label="depth of field details"]').should('be.visible')
            cy.get('[data-testid="dof-precise"]').last().should('have.text', '0.6097723318293538')
        })

        it('imperial', () => {
            cy.visit(baseUrl)
            // Ensure that there is exactly one lens in the table
            cy.get('button').contains('Add Lens').click()
            cy.get('[data-testid="select-all"]').click()
            cy.get('button[aria-label="Delete"]').click()
            cy.get('button').contains('Add Lens').click()

            cy.get('button[value="imperial"]').click()

            // Make sure the initial value isn't the same one we'll be testing for in the end so thst we know for sure it's updated
            cy.get('[data-testid^="dof-"]').last().should('not.have.text', `0' 2 1/4"`)

            cy.get('[data-testid^="focal-length-"] input').last().focus().type('{selectall}').type('90')
            cy.get('[data-testid^="aperture-"]').last().parent().click().get('ul > li[data-value="f/4"]').click()
            cy.get('[data-testid^="sensor-"]').last().parent().click().get('ul > li[data-value="iPhone13"]').click()

            cy.get('[data-testid^="dof-"]').last().should('have.text', `0' 2 1/4"`)

            // Check DoF details
            cy.get('[aria-label="expand row"]').last().click()
            cy.get('[aria-label="depth of field details"]').should('be.visible')
            cy.get('[data-testid="dof-precise"]').last().should('have.text', `0.05665367011304934`)
        })
    })

    describe('Updates the depth of field calculation when the distance is changed', () => {
        it('metric', () => {
            cy.visit(baseUrl)
            // Ensure that there is exactly one lens in the table
            cy.get('button').contains('Add Lens').click()
            cy.get('[data-testid="select-all"]').click()
            cy.get('button[aria-label="Delete"]').click()
            cy.get('button').contains('Add Lens').click()

            cy.get('button[value="metric"]').click()

            // Make sure the initial value isn't the same one we'll be testing for in the end so thst we know for sure it's updated
            cy.get('[data-testid^="dof-"]').last().should('not.have.text', '0.61')

            // Change the distance
            cy.get('[data-testid="distance"] input').last().focus().type('{selectall}').type('10')

            // DoF should have a new value
            cy.get('[data-testid^="dof-"]').last().should('have.text', '12.81')

            // Check DoF details
            cy.get('[aria-label="expand row"]').last().click()
            cy.get('[aria-label="depth of field details"]').should('be.visible')
            cy.get('[data-testid="dof-precise"]').last().should('have.text', '12.81430309460011')
        })

        it('imperial', () => {
            cy.visit(baseUrl)
            // Ensure that there is exactly one lens in the table
            cy.get('button').contains('Add Lens').click()
            cy.get('[data-testid="select-all"]').click()
            cy.get('button[aria-label="Delete"]').click()
            cy.get('button').contains('Add Lens').click()

            cy.get('button[value="imperial"]').click()

            // Make sure the initial value isn't the same one we'll be testing for in the end so thst we know for sure it's updated
            cy.get('[data-testid^="dof-"]').last().should('not.have.text', `0' 2 1/4"`)

            // Change the distance
            cy.get('[data-testid="distance"] input').last().focus().type('{selectall}').type('10')

            // DoF should have a new value
            cy.get('[data-testid^="dof-"]').last().should('have.text', `9' 10 3/4"`)

            // Check DoF details
            cy.get('[aria-label="expand row"]').last().click()
            cy.get('[aria-label="depth of field details"]').should('be.visible')
            cy.get('[data-testid="dof-precise"]').last().should('have.text', '3.0172208423706834')
        })
    })

    describe('Adding more lenses', () => {
        it('The Add Lens button adds another lens to the table', () => {
            cy.visit(baseUrl)

            // Count how many lenses there are before adding the new lens
            cy.get('[data-testid^="lens-name-"]').then(($originalLensSet) => {
                const originalCount = $originalLensSet.length
                cy.log(`originalCount is: ${originalCount}`)

                cy.get('button').contains('Add Lens').click()

                // Now there should be one more
                cy.get(`[data-testid^="lens-name-"]`).then(($finalLensSet) => {
                    const finalCount = $finalLensSet.length
                    cy.log(`finalCount is: ${finalCount}`)

                    expect(finalCount).equal(originalCount + 1)
                })
            })
        })

        it('The Duplicate Lens button adds another lens to the table with the same values as the first lens', () => {
            cy.visit(baseUrl)
            // Ensure that there is exactly one lens in the table
            cy.get('button').contains('Add Lens').click()
            cy.get('[data-testid="select-all"]').click()
            cy.get('button[aria-label="Delete"]').click()
            cy.get('button').contains('Add Lens').click()
            cy.get('button[value="metric"]').click()

            // Add custom values to the existing lens
            cy.get('[data-testid^="lens-name-"] input').last().focus().type('{selectall}').type('Sieben-Eins')
            cy.get('[data-testid^="focal-length-"] input').last().focus().type('{selectall}').type('20')
            cy.get('[data-testid^="aperture-"]').last().parent().click().get('ul > li[data-value="f/1.4"]').click()
            cy.get('[data-testid^="sensor-"]').last().parent().click().get('ul > li[data-value="16mm"]').click()
            cy.get('[data-testid^="dof-"]').last().should('have.text', '1.63')

            // Before adding the new lens, get the ID if the latest existing lens, so we know what the next ID should be
            cy.get('[data-testid^="lens-name-"]')
                .last()
                .invoke('get')
                .then((lastLens) => {
                    // Find the most recent lens ID
                    const lastId = lastLens[0].dataset.testid.replace(/^lens-name-/, '')
                    cy.log(`Original lens has ID: ${lastId}. Dataset was: ${JSON.stringify(lastLens[0].dataset)}`)

                    // Duplicate the lens
                    cy.get(`[data-testid="lens-checkbox-${lastId}"]`).click()
                    cy.get('button[aria-label="Duplicate"]').click()

                    // Find the newly added lens
                    cy.get('[data-testid^="lens-name-"]')
                        .last()
                        .invoke('get')
                        .then((parentDiv) => {
                            const nextId = parentDiv[0].dataset.testid.replace(/^lens-name-/, '')

                            cy.log(`Duplicate lens has ID: “${nextId}”`)

                            // Should have the same values as the first lens
                            cy.get(`[data-testid="lens-name-${nextId}"] input`).should('have.value', 'Sieben-Eins copy')
                            cy.get(`[data-testid="focal-length-${nextId}"] input`).should('have.value', '20')
                            cy.get(`[data-testid="aperture-${nextId}"]`).contains('f/1.4')
                            cy.get(`[data-testid="sensor-${nextId}"]`).contains('Standard 16mm film')
                            cy.get(`[data-testid="dof-${nextId}"]`).contains('1.63')
                        })

                    // And make sure the first one is still there
                    cy.get('[data-testid^="lens-name-"] input').first().should('have.value', 'Sieben-Eins')
                })
        })
    })
})
