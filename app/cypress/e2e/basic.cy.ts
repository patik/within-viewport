const baseUrl = `http://localhost:1234`

export {}

describe('Basic rendering', () => {
    it('Renders the page', () => {
        cy.visit(baseUrl)

        cy.get('#boxContainer > div').should('have.length.at.least', 100)

        // Has some that are considered in view, and some that are out
        cy.get('#boxContainer [aria-hidden="true"]').should('have.length.at.least', 10)
        cy.get('#boxContainer [aria-hidden="false"]').should('have.length.at.least', 10)
    })

    it('Updates the boxes when scrolling down', () => {
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
                        // Scroll down just enough for some boxes to become out of view
                        cy.scrollTo(0, 10)

                        // Now there should be fewer boxes in view
                        cy.get('#boxContainer [aria-hidden="false"]').should('have.length.below', inViewCount)

                        // And there should be more boxes out of view
                        cy.get('#boxContainer [aria-hidden="true"]').should('have.length.above', outOfViewCount)
                    })
            })
    })

    it('Updates the boxes when scrolling right', () => {
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
                        // Scroll down just enough for some boxes to become out of view
                        cy.scrollTo(10, 0)

                        // Now there should be fewer boxes in view
                        cy.get('#boxContainer [aria-hidden="false"]').should('have.length.below', inViewCount)

                        // And there should be more boxes out of view
                        cy.get('#boxContainer [aria-hidden="true"]').should('have.length.above', outOfViewCount)
                    })
            })
    })
})
