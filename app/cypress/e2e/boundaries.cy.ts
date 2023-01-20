const baseUrl = `http://localhost:1234`

export {}

const scrollSpeed = 1000

;['async', 'sync'].forEach((method) => {
    describe(`Boundaries`, () => {
        before(() => {
            cy.visit(baseUrl)

            // Open the form and select the correct method
            cy.get('.boundary-form details').click()

            cy.get(`#method-${method}`).scrollIntoView().check()

            // Close the form again so the tests start with a fresh state
            cy.get('.boundary-form details').click()
        })

        describe(`${method} method`, () => {
            it('Setting a positive left boundary reduces the number of boxes that are in view', () => {
                cy.visit(baseUrl).scrollTo(0, 0)

                let inViewCount = 0
                let outOfViewCount = 0

                cy.get('#box-container .out-of-view')
                    .then(($elem) => {
                        outOfViewCount = $elem.length
                    })
                    .then(() => {
                        cy.get('#box-container .in-view')
                            .then(($elem) => {
                                inViewCount = $elem.length
                            })
                            .then(() => {
                                // Open the form
                                cy.get('.boundary-form details').click()

                                cy.get('#boundary-left-value').type('10').trigger('change')

                                // Now there should be fewer boxes in view...
                                cy.get('#box-container .in-view').should('have.length.below', inViewCount)

                                // ...but make sure it's a sane number
                                cy.get('#box-container .in-view').should('have.length.above', 1)

                                // And there should be more boxes out of view
                                cy.get('#box-container .out-of-view').should('have.length.above', outOfViewCount)
                            })
                    })
            })

            it.only('Ignoring the left boundary removes the effect it had', () => {
                cy.visit(baseUrl).scrollTo(0, 0)

                let inViewCount = 0
                let outOfViewCount = 0

                cy.get('#box-container .out-of-view')
                    .then(($elem) => {
                        outOfViewCount = $elem.length
                    })
                    .then(() => {
                        cy.get('#box-container .in-view')
                            .then(($elem) => {
                                inViewCount = $elem.length
                            })
                            .then(() => {
                                // Open the form
                                cy.get('.boundary-form details').click()

                                cy.get('#boundary-left-value').type('10').trigger('change')

                                // Now there should be fewer boxes in view...
                                cy.get('#box-container .in-view').should('have.length.below', inViewCount)

                                // ...but make sure it's a sane number
                                cy.get('#box-container .in-view').should('have.length.above', 1)

                                // And there should be more boxes out of view
                                cy.get('#box-container .out-of-view').should('have.length.above', outOfViewCount)

                                // Now ignore the boundary
                                cy.get('#left-ignore').check()

                                // The counts should be back to how they were at the beginning
                                cy.get('#box-container .in-view').should('have.length', inViewCount)
                                cy.get('#box-container .out-of-view').should('have.length', outOfViewCount)
                            })
                    })
            })

            it('Scrolling right a lot, then setting a small positive left boundary, has no effect on the number of boxes that are in view', () => {
                cy.visit(baseUrl).scrollTo(0, 0)

                let inViewCount = 0
                let outOfViewCount = 0

                cy.get('#box-container .out-of-view')
                    .then(($elem) => {
                        outOfViewCount = $elem.length
                    })
                    .then(() => {
                        cy.get('#box-container .in-view')
                            .then(($elem) => {
                                inViewCount = $elem.length
                            })
                            .then(() => {
                                // Shift focus to the page before scrolling
                                cy.get('#box-container').first().focus()

                                // First, scroll further than the boundary we'll be setting later
                                cy.scrollTo('bottomRight', { duration: scrollSpeed })

                                // Open the form
                                cy.get('.boundary-form details').click()

                                // Set a boundary that is smaller than the amount we have scrolled
                                cy.get('#boundary-left-value').type('10').trigger('change')

                                cy.scrollTo(0, 0, { duration: scrollSpeed }).then(() => {
                                    // Now there should be the same number of boxes in view
                                    cy.get('#box-container .in-view').should('have.length', inViewCount)

                                    // And there should be same number of boxes out of view
                                    cy.get('#box-container .out-of-view').should('have.length', outOfViewCount)
                                })
                            })
                    })
            })

            it('Scrolling right, setting a positive left boundary, and then scrolling back only part way, results in the same number of boxes that are in view', () => {
                cy.visit(baseUrl).scrollTo(0, 0)

                let inViewCount = 0
                let outOfViewCount = 0

                cy.get('#box-container .out-of-view')
                    .then(($elem) => {
                        outOfViewCount = $elem.length
                    })
                    .then(() => {
                        cy.get('#box-container .in-view')
                            .then(($elem) => {
                                inViewCount = $elem.length
                            })
                            .then(() => {
                                cy.log(
                                    `Finished counting, found ${inViewCount} in-view boxes and ${outOfViewCount} out-of-view boxes. About to perform first scroll.`,
                                )
                                cy.scrollTo('bottomRight', { duration: scrollSpeed }).then(() => {
                                    cy.log(`Finished first scroll. Now filling in the boundary form.`)
                                    console.log(`Finished first scroll. Now filling in the boundary form.`)

                                    // Open the form
                                    cy.get('.boundary-form details').click()

                                    cy.get('#boundary-left-value').type('10').trigger('change')

                                    // Shift focus back to the page before scrolling
                                    cy.get('#box-container').first().focus()

                                    cy.log('About to perform second scroll')
                                    console.log('About to perform second scroll')

                                    cy.get('body').scrollTo('50%', 0)

                                    cy.log(
                                        `Finished second scroll. Now looking for in-view boxes to make sure there are exactly ${inViewCount} of them`,
                                    )
                                    console.log(
                                        `Finished second scroll. Now looking for in-view boxes to make sure there are exactly ${inViewCount} of them`,
                                    )
                                    // Now there should be fewer boxes in view
                                    cy.get('#box-container .in-view').should('have.length', inViewCount)

                                    cy.log(
                                        `Lastly, looking for out-of-view boxes to make sure there are exactly ${outOfViewCount} of them`,
                                    )
                                    console.log(
                                        `Lastly, looking for out-of-view boxes to make sure there are exactly ${outOfViewCount} of them`,
                                    )

                                    // And there should be more boxes out of view
                                    cy.get('#box-container .out-of-view').should('have.length', outOfViewCount)
                                    cy.log(`Done`)
                                    console.log(`Done`)
                                })
                            })
                    })
            })
        })
    })
})
