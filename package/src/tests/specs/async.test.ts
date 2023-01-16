import { screen } from '@testing-library/dom'
import { withinViewportAsync } from '../../async/index'

test('uses jest-dom', () => {
    document.body.innerHTML = `
    <span data-testid="not-empty"><span data-testid="empty"></span></span>
    <div data-testid="visible">Visible Example</div>
  `

    expect(screen.queryByTestId('not-empty')).not.toBeEmptyDOMElement()
    expect(screen.getByText('Visible Example')).toBeVisible()
})

describe('uses within-viewport', () => {
    test('basic', () => {
        document.body.innerHTML = `
  <span data-testid="not-empty"><span data-testid="empty"></span></span>
  <div data-testid="visible">Visible Example</div>
`

        expect(screen.queryByTestId('not-empty')).not.toBeEmptyDOMElement()

        const elem = screen.getByText('Visible Example')
        expect(elem).toBeVisible()

        expect(withinViewportAsync(elem)).toBe(true)
    })

    test('out of viewport', () => {
        document.body.innerHTML = `
<span data-testid="not-empty"><span data-testid="empty"></span></span>
<div data-testid="tall" style="height: 2000px;">Tall div</div>
<div data-testid="tall" style="min-height: 2000px;">Tall div</div>
<div data-testid="visible">Visible Example</div>
`

        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 150,
        })

        window.dispatchEvent(new Event('resize'))

        expect(screen.queryByTestId('not-empty')).not.toBeEmptyDOMElement()

        // const elem = screen.getByText('Visible Example')
        // expect(elem).toBeVisible()

        const elem: HTMLElement | null = window.document.querySelector('[data-testid="visible"]')

        if (elem) {
            expect(withinViewportAsync(elem)).toBe(false)
        }
    })
})

describe('test window height', () => {
    it('test the height', () => {
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 150,
        })

        window.dispatchEvent(new Event('resize'))

        expect(window.innerHeight).toBe(150)
    })
})
