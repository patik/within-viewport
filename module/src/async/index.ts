import { AsyncConfig, getConfig } from '../common/options'
import { MultipleSides, Side, UserOptions } from '../common/types'
import { determineRootMargin } from './options'

function isWithinTop(entry: IntersectionObserverEntry) {
    const { intersectionRect, boundingClientRect } = entry
    const isHeightAndWidthZero = intersectionRect.height === 0 && intersectionRect.width === 0

    return (
        // Below the top of the viewport
        (!isHeightAndWidthZero && intersectionRect.y > 0) ||
        // Totally out of the viewport to the left
        (isHeightAndWidthZero && boundingClientRect.y > 0)
    )
}

function getElemWidth(elem: AsyncConfig['container']) {
    // Is an element, but no the Document
    return 'clientWidth' in elem
        ? elem.clientWidth
        : // Must be the body, but we need to use the window to get the viewport dimensions
          window.innerWidth
}

function getElemHeight(elem: AsyncConfig['container']) {
    // Is an element, but no the Document
    return 'clientHeight' in elem
        ? elem.clientHeight
        : // Must be the body, but we need to use the window to get the viewport dimensions
          window.innerHeight
}

function isWithinRight(entry: IntersectionObserverEntry, config: AsyncConfig, debug = false) {
    const { intersectionRect, boundingClientRect } = entry
    const isHeightAndWidthZero = intersectionRect.height === 0 && intersectionRect.width === 0

    if (!isHeightAndWidthZero && intersectionRect.right < getElemWidth(config.container)) {
        if (debug) {
            console.log('right A ')
        }
        return true
    }
    // Totally out of the viewport to the bottom

    if (
        isHeightAndWidthZero &&
        boundingClientRect.right > 0 &&
        boundingClientRect.right < getElemWidth(config.container)
    ) {
        if (debug) {
            console.log('right B ', getElemWidth(config.container))
        }
        return true
    }

    // Totally out of the viewport to the left

    if (isHeightAndWidthZero && boundingClientRect.right < 0) {
        if (debug) {
            console.log('right C')
        }
        return true
    }

    if (debug) {
        console.log('right D')
    }
    return false
}

function isWithinBottom(entry: IntersectionObserverEntry, config: AsyncConfig, debug = false) {
    const { intersectionRect, boundingClientRect } = entry
    const isHeightAndWidthZero = intersectionRect.height === 0 && intersectionRect.width === 0
    const containerHeight = getElemHeight(config.container)

    if (!isHeightAndWidthZero && intersectionRect.bottom < containerHeight) {
        if (debug) {
            console.log('bottom A')
        }
        return true
    }

    if (!isHeightAndWidthZero && intersectionRect.bottom < containerHeight) {
        if (debug) {
            console.log('bottom B ', containerHeight)
        }
        return true
    }

    // Totally out of the viewport to the left
    if (isHeightAndWidthZero && boundingClientRect.bottom > 0 && boundingClientRect.bottom < containerHeight) {
        if (debug) {
            console.log('bottom C ', containerHeight, config.container)
        }
        return true
    }

    // Totally out of the viewport to the top
    if (isHeightAndWidthZero && boundingClientRect.bottom < 0 && boundingClientRect.top < 0) {
        if (debug) {
            console.log('bottom C ', containerHeight, config.container)
        }
        return true
    }

    return false
}

function isWithinLeft(entry: IntersectionObserverEntry) {
    const { intersectionRect, boundingClientRect } = entry
    const isHeightAndWidthZero = intersectionRect.height === 0 && intersectionRect.width === 0

    return (
        (!isHeightAndWidthZero && intersectionRect.x > 0) ||
        // Partially out of the viewport to the top
        (!isHeightAndWidthZero && intersectionRect.x === 0 && boundingClientRect.x === 0) ||
        // Totally out of the viewport to the bottom
        (isHeightAndWidthZero && boundingClientRect.left >= 0 && boundingClientRect.x >= 0)
    )
}

/**
 * Determines whether an element is within the viewport
 * @param  {HTMLElement}      elem           DOM Element (required)
 * @param  {String | Object}  userOptions    Optional settings
 * @return {Promise<Boolean>}                Whether the element was completely within the viewport
 */
export async function withinViewportAsync(
    elem: HTMLElement,
    userOptions?: Side | MultipleSides | Partial<UserOptions>,
    debug = elem.getAttribute('data-boxid') === '90',
): Promise<boolean> {
    return new Promise((resolve) => {
        const config = getConfig('async', elem, userOptions)
        const rootMargin = determineRootMargin(config)

        const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            entries.forEach((entry) => {
                observer.disconnect()
                const { isIntersecting, intersectionRect } = entry

                if (debug) {
                    console.log(intersectionRect, entry)
                }

                if (!entry.isIntersecting) {
                    const { top, right, bottom, left } = config

                    let numSidesPassing = 0

                    if (top === 'ignore' || isWithinTop(entry)) {
                        numSidesPassing++
                        if (debug) {
                            console.log('top + ', top)
                        }
                    } else if (debug) {
                        console.log('top -')
                    }

                    if (right === 'ignore' || isWithinRight(entry, config, debug)) {
                        numSidesPassing++
                        if (debug) {
                            console.log('right + ', right)
                        }
                    } else if (debug) {
                        console.log('right -')
                    }

                    if (bottom === 'ignore' || isWithinBottom(entry, config, debug)) {
                        numSidesPassing++
                        if (debug) {
                            console.log('bottom + ', bottom)
                        }
                    } else if (debug) {
                        console.log('bottom -')
                    }

                    if (left === 'ignore' || isWithinLeft(entry)) {
                        numSidesPassing++
                        if (debug) {
                            console.log('left + ', left)
                        }
                    } else if (debug) {
                        console.log('left -')
                    }

                    if (debug) {
                        console.log('numSidesPassing ', numSidesPassing)
                        console.log('returning ', numSidesPassing === 4)
                    }

                    resolve(numSidesPassing === 4)
                    return
                }

                if (debug) {
                    console.log('returning ', isIntersecting)
                }
                resolve(isIntersecting)
                return
            })
        }

        new IntersectionObserver(callback, {
            root: config.container,
            rootMargin,
            threshold: 1.0,
        }).observe(elem ?? document.body)
    })
}
