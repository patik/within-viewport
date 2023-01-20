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
                        cy.log(
                            `Finished counting, found ${inViewCount} in-view boxes and ${outOfViewCount} out-of-view boxes. About to perform first scroll.`,
                        )
                        cy.scrollTo(100, 0)

                        cy.log(`Finished first scroll. Now filling in the boundary form.`)
                        console.log(`Finished first scroll. Now filling in the boundary form.`)

                        // Open the form
                        cy.get('.boundary-form details').click()

                        cy.get('#boundary-left-value').type('10').trigger('change')

                        cy.log('About to perform second scroll')
                        console.log('About to perform second scroll')

                        cy.scrollTo(-20, 0)

                        cy.log(
                            `Finished second scroll. Now looking for in-view boxes to make sure there are exactly ${inViewCount} of them`,
                        )
                        console.log(
                            `Finished second scroll. Now looking for in-view boxes to make sure there are exactly ${inViewCount} of them`,
                        )
                        // Now there should be fewer boxes in view
                        cy.get('#boxContainer [aria-hidden="false"]').should('have.length', inViewCount)

                        cy.log(
                            `Lastly, looking for out-of-view boxes to make sure there are exactly ${outOfViewCount} of them`,
                        )
                        console.log(
                            `Lastly, looking for out-of-view boxes to make sure there are exactly ${outOfViewCount} of them`,
                        )

                        // And there should be more boxes out of view
                        cy.get('#boxContainer [aria-hidden="true"]').should('have.length', outOfViewCount)
                        cy.log(`Done`)
                        console.log(`Done`)
                    })
            })
    })
})
