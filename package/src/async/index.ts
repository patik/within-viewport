import { determineConfig, determineRootMargin } from './options'
import { Options, Side } from './types'

/**
 * Determines whether an element is within the viewport
 * @param  {HTMLElement}      elem       DOM Element (required)
 * @param  {String | Object}  options    Optional settings
 * @return {Boolean}                     Whether the element was completely within the viewport
 */
export async function withinviewportAsync(elem: HTMLElement, options?: Side | Partial<Options>): Promise<boolean> {
    const config = determineConfig(elem, options)

    return new Promise((resolve) => {
        const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            // console.log('matched! ', entries.length, { entries })
            entries.forEach((entry) => {
                observer.disconnect()

                resolve(entry.isIntersecting)
            })
        }

        new IntersectionObserver(callback, {
            root: config.container,
            rootMargin: determineRootMargin(config),
            threshold: 1.0,
        }).observe(elem)
    })
}

/**
 * Optional enhancements and shortcuts
 *
 * @description Uncomment or comment these pieces as they apply to your project and coding preferences
 */

// Shortcut methods for each side of the viewport
// Example: `withinviewport.top(elem)` is the same as `withinviewport(elem, 'top')`
export async function topAsync(element: HTMLElement): Promise<boolean> {
    return await withinviewportAsync(element, 'top')
}

export async function rightAsync(element: HTMLElement): Promise<boolean> {
    return await Promise.resolve(withinviewportAsync(element, 'right'))
}

export async function bottomAsync(element: HTMLElement): Promise<boolean> {
    return await Promise.resolve(withinviewportAsync(element, 'bottom'))
}

export async function leftAsync(element: HTMLElement): Promise<boolean> {
    return await Promise.resolve(withinviewportAsync(element, 'left'))
}
