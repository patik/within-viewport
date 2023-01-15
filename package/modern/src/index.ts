import { determineConfig } from './options'

/**
 * Determines whether an element is within the viewport
 * @param  {Object}  elem       DOM Element (required)
 * @param  {Object}  options    Optional settings
 * @return {Boolean}            Whether the element was completely within the viewport
 */
export async function withinviewport(elem: HTMLElement, options?: Side | Partial<Options>): Promise<boolean> {
    // let containerBoundingRect: DOMRect
    // let containerScrollTop = 0
    // let containerScrollLeft = 0
    // const scrollBarWidths = [0, 0]

    const config = determineConfig(elem, options)

    return await new Promise((resolve) => {
        const callback = async (entries: IntersectionObserverEntry[] /* , observer: IntersectionObserver */) => {
            // console.log('matched! ', entries.length, { entries })
            entries.forEach((entry) => {
                resolve(entry.isIntersecting)

                // Each entry describes an intersection change for one observed
                // target element:
                //   entry.boundingClientRect
                //   entry.intersectionRatio
                //   entry.intersectionRect
                //   entry.isIntersecting
                //   entry.rootBounds
                //   entry.target
                //   entry.time
            })
        }

        const observer = new IntersectionObserver(callback, {
            root: config.container,
            rootMargin: `${config.top}px ${config.right}px ${config.bottom}px ${config.left}px`,
            threshold: 1.0,
        })

        observer.observe(elem)
    })

    // // Get the element's bounding rectangle with respect to the viewport
    // const elemBoundingRect = elem.getBoundingClientRect()

    // // Get viewport dimensions and offsets
    // if (config.container === window) {
    //     containerBoundingRect = document.documentElement.getBoundingClientRect()
    //     containerScrollTop = document.body.scrollTop
    //     containerScrollLeft = window.scrollX || document.body.scrollLeft
    // } else if (config.container !== window) {
    //     containerBoundingRect = config.container.getBoundingClientRect()
    //     containerScrollTop = config.container.scrollTop
    //     containerScrollLeft = config.container.scrollLeft
    // }

    // // Don't count the space consumed by scrollbars
    // if (containerScrollLeft) {
    //     scrollBarWidths[0] = 18
    // }

    // if (containerScrollTop) {
    //     scrollBarWidths[1] = 16
    // }
}

/**
 * Optional enhancements and shortcuts
 *
 * @description Uncomment or comment these pieces as they apply to your project and coding preferences
 */

// Shortcut methods for each side of the viewport
// Example: `withinviewport.top(elem)` is the same as `withinviewport(elem, 'top')`
export async function top(element: HTMLElement): Promise<boolean> {
    return await withinviewport(element, 'top')
}

export async function right(element: HTMLElement): Promise<boolean> {
    return await Promise.resolve(withinviewport(element, 'right'))
}

export async function bottom(element: HTMLElement): Promise<boolean> {
    return await Promise.resolve(withinviewport(element, 'bottom'))
}

export async function left(element: HTMLElement): Promise<boolean> {
    return await Promise.resolve(withinviewport(element, 'left'))
}
