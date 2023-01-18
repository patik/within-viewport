const baseUrl = `http://localhost:1234`

export {}

describe('Boundaries', () => {
    it('Setting a positive left boundary reduces the number of boxes that are in view', () => {
        cy.visit(baseUrl)

        let inViewCount = 0
        let outOfViewCount = 0

        cy.get('#boxContainer [aria-hidden="true"]')
            .then(($elem) => {
                outOfViewCount = $elem.length
            })
            .then(() => {
                cy.get('#boxContainer [aria-hidden="false"]')
                    .then(($elem) => {
                        inViewCount = $elem.length
                    })
                    .then(() => {
                        // Open the form
                        cy.get('.boundary-form details').click()

                        cy.get('#boundary-left-value').type('10').trigger('change')

                        // Now there should be fewer boxes in view
                        cy.get('#boxContainer [aria-hidden="false"]').should('have.length.below', inViewCount)

                        // And there should be more boxes out of view
                        cy.get('#boxContainer [aria-hidden="true"]').should('have.length.above', outOfViewCount)
                    })
            })
    })

    it('Setting a positive left boundary and then scrolling results in the same number of boxes that are in view', () => {
        cy.visit(baseUrl)

        let inViewCount = 0
        let outOfViewCount = 0

        cy.get('#boxContainer [aria-hidden="true"]')
            .then(($elem) => {
                outOfViewCount = $elem.length
            })
            .then(() => {
                cy.get('#boxContainer [aria-hidden="false"]')
                    .then(($elem) => {
                        inViewCount = $elem.length
                    })
                    .then(() => {
                        cy.scrollTo(100, 0)

                        // Open the form
                        cy.get('.boundary-form details').click()

                        cy.get('#boundary-left-value').type('10').trigger('change')

                        cy.scrollTo(-15, 0)

                        // Now there should be fewer boxes in view
                        cy.get('#boxContainer [aria-hidden="false"]').should('have.length', inViewCount)

                        // And there should be more boxes out of view
                        cy.get('#boxContainer [aria-hidden="true"]').should('have.length', outOfViewCount)
                    })
            })
    })
})
