const baseUrl = `http://localhost:1234`

export {}
;['async', 'sync'].forEach((method) => {
    describe(`Basic rendering`, () => {
        before(() => {
            cy.visit(baseUrl)

            // Open the form and select the correct method
            cy.get('.boundary-form details').click()

            cy.get(`#method-${method}`).scrollIntoView().check()

            // Close the form again so the tests start with a fresh state
            cy.get('.boundary-form details').click()
        })

        describe(`${method} method`, () => {
            it('Renders the page', () => {
                cy.visit(baseUrl)

                cy.get('#box-container > div').should('have.length.at.least', 100)

                // Has some that are considered in view, and some that are out
                cy.get('#box-container [aria-hidden="true"]').should('have.length.at.least', 10)
                cy.get('#box-container [aria-hidden="false"]').should('have.length.at.least', 10)
            })

            it('Updates the boxes when scrolling down', () => {
                cy.visit(baseUrl)

                let inViewCount = 0
                let outOfViewCount = 0

                cy.get('#box-container [aria-hidden="true"]')
                    .then(($elem) => {
                        outOfViewCount = $elem.length
                    })
                    .then(() => {
                        cy.get('#box-container [aria-hidden="false"]')
                            .then(($elem) => {
                                inViewCount = $elem.length
                            })
                            .then(() => {
                                // Scroll down just enough for some boxes to become out of view
                                cy.scrollTo(0, 10)

                                // Now there should be fewer boxes in view
                                cy.get('#box-container [aria-hidden="false"]').should('have.length.below', inViewCount)

                                // And there should be more boxes out of view
                                cy.get('#box-container [aria-hidden="true"]').should(
                                    'have.length.above',
                                    outOfViewCount,
                                )
                            })
                    })
            })

            it('Updates the boxes when scrolling right', () => {
                cy.visit(baseUrl)

                let inViewCount = 0
                let outOfViewCount = 0

                cy.get('#box-container [aria-hidden="true"]')
                    .then(($elem) => {
                        outOfViewCount = $elem.length
                    })
                    .then(() => {
                        cy.get('#box-container [aria-hidden="false"]')
                            .then(($elem) => {
                                inViewCount = $elem.length
                            })
                            .then(() => {
                                // Scroll down just enough for some boxes to become out of view
                                cy.scrollTo(10, 0)

                                // Now there should be fewer boxes in view
                                cy.get('#box-container [aria-hidden="false"]').should('have.length.below', inViewCount)

                                // And there should be more boxes out of view
                                cy.get('#box-container [aria-hidden="true"]').should(
                                    'have.length.above',
                                    outOfViewCount,
                                )
                            })
                    })
            })
        })
    })
})
