import { determineConfig } from './options'

/**
 * Determines whether an element is within the viewport
 * @param  {HTMLElement}      elem       DOM Element (required)
 * @param  {String | Object}  options    Optional settings
 * @return {Boolean}                     Whether the element was completely within the viewport
 */
export async function withinviewport(elem: HTMLElement, options?: Side | Partial<Options>): Promise<boolean> {
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
            rootMargin: `${-config.top}px ${-config.right}px ${-config.bottom}px ${-config.left}px`,
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
