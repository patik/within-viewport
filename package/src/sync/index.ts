import { Options, Side } from './types'

const defaultOptions: Options = {
    container: typeof document !== 'undefined' ? document.body : window,
    sides: ['all'],
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
}

declare global {
    interface Window {
        scrollTop: HTMLElement['scrollTop']
        scrollLeft: HTMLElement['scrollLeft']
        getBoundingClientRect: HTMLElement['getBoundingClientRect']
    }
}

function isSide(side: string | Options | Partial<Options> | undefined): side is Side {
    return Boolean(side) && typeof side === 'string' && ['all', 'top', 'right', 'bottom', 'left'].includes(side)
}

function isSides(sides: string | string[] | Options | Partial<Options> | undefined): sides is Side[] {
    if (Array.isArray(sides)) {
        return sides.every((side) => ['all', 'top', 'right', 'bottom', 'left'].includes(side))
    }

    if (typeof sides !== 'string') {
        return false
    }

    return sides.split(' ').every((side) => ['all', 'top', 'right', 'bottom', 'left'].includes(side))
}

/**
 * Determines whether an element is within the viewport
 * @param  {Object}  elem       DOM Element (required)
 * @param  {Object}  options    Optional settings
 * @return {Boolean}            Whether the element was completely within the viewport
 */
export function withinviewport(elem: HTMLElement, options?: Side | Partial<Options>): boolean {
    let settings: Options
    let containerBoundingRect: DOMRect
    let containerScrollTop = 0
    let containerScrollLeft = 0
    const scrollBarWidths = [0, 0]

    if (typeof elem !== 'object' || elem.nodeType !== 1) {
        throw new Error('First argument must be an element')
    }

    // Settings argument may be a simple string (`top`, `right`, etc)
    if (isSide(options)) {
        settings = {
            ...defaultOptions,
            sides: [options],
        }
    } else if (isSides(options)) {
        settings = {
            ...defaultOptions,
            sides: options,
        }
    } else {
        settings = Object.assign({}, defaultOptions, options)
    }

    // Build configuration from defaults and user-provided settings and metadata
    const config: Options = Object.assign({}, defaultOptions, settings)

    // Use the window as the container if the user specified the body or a non-element
    if (
        config.container === document.body ||
        (config.container && 'nodeType' in config.container && config.container.nodeType !== 1)
    ) {
        config.container = window
    }

    const isContainerTheWindow = config.container === window

    // Get the element's bounding rectangle with respect to the viewport
    const elemBoundingRect = elem.getBoundingClientRect()

    // Get viewport dimensions and offsets
    if (config.container === window) {
        containerBoundingRect = document.documentElement.getBoundingClientRect()
        containerScrollTop = document.body.scrollTop
        containerScrollLeft = window.scrollX || document.body.scrollLeft
    } else if (config.container && config.container !== window) {
        containerBoundingRect = config.container.getBoundingClientRect()
        containerScrollTop = config.container.scrollTop
        containerScrollLeft = config.container.scrollLeft
    }

    // Don't count the space consumed by scrollbars
    if (containerScrollLeft) {
        scrollBarWidths[0] = 18
    }

    if (containerScrollTop) {
        scrollBarWidths[1] = 16
    }

    // Element testing methods
    const isWithin = {
        // Element is below the top edge of the viewport
        top() {
            if (isContainerTheWindow) {
                return elemBoundingRect.top >= config.top
            }

            return (
                elemBoundingRect.top >=
                containerScrollTop - (containerScrollTop - containerBoundingRect.top) + config.top
            )
        },

        // Element is to the left of the right edge of the viewport
        right() {
            // Note that `elemBoundingRect.right` is the distance from the *left* of the viewport to the element's far right edge

            if (isContainerTheWindow) {
                return elemBoundingRect.right <= containerBoundingRect.right + containerScrollLeft - config.right
            }

            return elemBoundingRect.right <= containerBoundingRect.right - scrollBarWidths[0] - config.right
        },

        // Element is above the bottom edge of the viewport
        bottom() {
            let containerHeight = 0

            if (config.container === window) {
                // FIXME
                containerHeight = config.container.innerHeight
            } else {
                containerHeight = containerBoundingRect.bottom
            }

            // Note that `elemBoundingRect.bottom` is the distance from the *top* of the viewport to the element's bottom edge
            return elemBoundingRect.bottom <= containerHeight - scrollBarWidths[1] - config.bottom
        },

        // Element is to the right of the left edge of the viewport
        left() {
            if (isContainerTheWindow) {
                return elemBoundingRect.left >= config.left
            }

            return (
                elemBoundingRect.left >=
                containerScrollLeft - (containerScrollLeft - containerBoundingRect.left) + config.left
            )
        },

        // Element is within all four boundaries
        all() {
            // Test each boundary in order of efficiency and likeliness to be false. This way we can avoid running all four functions on most elements.
            //     1. Top: Quickest to calculate + most likely to be false
            //     2. Bottom: Not quite as quick to calculate, but also very likely to be false
            //     3-4. Left and right are both equally unlikely to be false since most sites only scroll vertically, but left is faster to calculate
            return isWithin.top() && isWithin.bottom() && isWithin.left() && isWithin.right()
        },
    }

    // Test the element against each side of the viewport that was requested
    return config.sides.every((side) => isWithin[side]())
}

/**
 * Optional enhancements and shortcuts
 *
 * @description Uncomment or comment these pieces as they apply to your project and coding preferences
 */

// Shortcut methods for each side of the viewport
// Example: `withinviewport.top(elem)` is the same as `withinviewport(elem, 'top')`
export function top(element: HTMLElement): boolean {
    return withinviewport(element, 'top')
}

export function right(element: HTMLElement): boolean {
    return withinviewport(element, 'right')
}

export function bottom(element: HTMLElement): boolean {
    return withinviewport(element, 'bottom')
}

export function left(element: HTMLElement): boolean {
    return withinviewport(element, 'left')
}
