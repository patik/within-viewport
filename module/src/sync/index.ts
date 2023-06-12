import { getConfig } from '../common/options.js'
import { sides } from '../common/sides.js'
import { MultipleSides, Side, UserOptions } from '../common/types.js'

declare global {
    interface Window {
        scrollTop: HTMLElement['scrollTop']
        scrollLeft: HTMLElement['scrollLeft']
        getBoundingClientRect: HTMLElement['getBoundingClientRect']
    }
}

/**
 * Determines whether an element is within the viewport
 * @param  {Object}  elem           DOM Element (required)
 * @param  {Object}  userOptions    Optional settings
 * @return {Boolean}                Whether the element was completely within the viewport
 */
export function withinViewport(elem: HTMLElement, userOptions?: Side | MultipleSides | Partial<UserOptions>): boolean {
    let containerBoundingRect: DOMRect
    let containerScrollTop = 0
    let containerScrollLeft = 0
    const scrollBarWidths = [0, 0]

    const config = getConfig('sync', elem, userOptions)
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
            if (config.top === 'ignore') {
                return true
            }

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
            if (config.right === 'ignore') {
                return true
            }

            // Note that `elemBoundingRect.right` is the distance from the *left* of the viewport to the element's far right edge

            if (isContainerTheWindow) {
                return elemBoundingRect.right <= containerBoundingRect.right + containerScrollLeft - config.right
            }

            return elemBoundingRect.right <= containerBoundingRect.right - scrollBarWidths[0] - config.right
        },

        // Element is above the bottom edge of the viewport
        bottom() {
            if (config.bottom === 'ignore') {
                return true
            }

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
            if (config.left === 'ignore') {
                return true
            }

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
    return sides.every((side) => isWithin[side]())
}
