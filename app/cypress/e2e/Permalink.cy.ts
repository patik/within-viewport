import { del } from 'idb-keyval'
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

    it('Adds hash to a clean URL', () => {
        cy.visit(baseUrl)

        cy.url().should('not.include', '#')

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500)
        cy.get('button').contains('Add Lens').click()

        cy.url().should('include', '#5,m;Lens%203,35,f-2,full')
    })

    describe('Reads the distance and units from the initial hash and applies them to the input', () => {
        it('Modern URL pattern with metric units', () => {
            cy.visit(`${baseUrl}/#23,m`)

            cy.get('[data-testid="distance"] input').should('have.value', '23')
            cy.get('button[value="metric"][aria-pressed="true"]').should('be.visible')
            cy.get('button[value="imperial"][aria-pressed="false"]').should('be.visible')
        })

        it('Modern URL pattern with imperial units', () => {
            cy.visit(`${baseUrl}/#34,i`)

            cy.get('[data-testid="distance"] input').should('have.value', '34')
            cy.get('button[value="metric"][aria-pressed="false"]').should('be.visible')
            cy.get('button[value="imperial"][aria-pressed="true"]').should('be.visible')
        })

        it('Legacy URL pattern without units (which defaults to imperial)', () => {
            cy.visit(`${baseUrl}/#56`)

            cy.get('[data-testid="distance"] input').should('have.value', '56')
            cy.get('button[value="metric"][aria-pressed="false"]').should('be.visible')
            cy.get('button[value="imperial"][aria-pressed="true"]').should('be.visible')
        })
    })

    it('Reads a single lens from initial hash and adds it to the table', () => {
        cy.visit(`${baseUrl}/#5,m;Alpha%20bravo,20,f-3.6,16mm`)

        cy.get('[data-testid^="lens-name-"] input').first().should('have.value', 'Alpha bravo')
        cy.get('[data-testid^="focal-length-"] input').first().should('have.value', '20')
        cy.get('[data-testid^="aperture-"]').first().contains('f/3.6')
        cy.get('[data-testid^="sensor-"]').first().contains('Standard 16mm film')
        cy.get('[data-testid^="dof-"]').first().contains('4.75')
    })

    it('Reads two lenses from initial hash and adds them to the table', () => {
        cy.visit(`${baseUrl}/#12,i;Alpha%20bravo,20,f-3.6,16mm;Charlie-Delta,55,f-5,iPhone14`)

        cy.get('[data-testid^="lens-name-"] input').first().should('have.value', 'Alpha bravo')
        cy.get('[data-testid^="focal-length-"] input').first().should('have.value', '20')
        cy.get('[data-testid^="aperture-"]').first().contains('f/3.6')
        cy.get('[data-testid^="sensor-"]').first().contains('Standard 16mm film')
        cy.get('[data-testid^="dof-"]')
            .first()
            .then(($elem) => {
                console.log('actual value A: ', $elem.val())
            })
        cy.get('[data-testid^="dof-"]').first().contains(`25' 1 1/4"`)

        cy.get('[data-testid^="lens-name-"] input').last().should('have.value', 'Charlie-Delta')
        cy.get('[data-testid^="focal-length-"] input').last().should('have.value', '55')
        cy.get('[data-testid^="aperture-"]').last().contains('f/5')
        cy.get('[data-testid^="sensor-"]').last().contains('iPhone 14')
        cy.get('[data-testid^="dof-"]')
            .last()
            .then(($elem) => {
                console.log('actual value B: ', $elem.val())
            })
        cy.get('[data-testid^="dof-"]').last().contains(`4' 9"`)
    })
})

export {}
