const baseUrl = 'http://localhost:3000'

describe('LensTable', () => {
    beforeEach(() => {
        try {
            cy.log('Deleting local storage...')
            cy.log('Deleting local storage finished.')
            window.location.hash = ''
        } catch (e) {
            cy.log('Deleting local storage failed: ', e)
        }
    })

    it('Reads two lenses from initial hash and adds them to the table', () => {
        cy.visit(`${baseUrl}`)

        cy.get('[data-testid^="dof-"]')
            .first()
            .then(($elem) => {
                console.log('actual value A: ', $elem.val())
            })
    })
})

export {}
