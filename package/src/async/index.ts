import { Side } from '../common/types'
import { getConfig, determineRootMargin } from './options'
import { AsyncOptions } from './types'

/**
 * Determines whether an element is within the viewport
 * @param  {HTMLElement}      elem       DOM Element (required)
 * @param  {String | Object}  options    Optional settings
 * @return {Boolean}                     Whether the element was completely within the viewport
 */
export async function withinViewportAsync(
    elem?: HTMLElement,
    options?: Side | Partial<AsyncOptions>,
): Promise<boolean> {
    const config = getConfig(elem, options)

    return new Promise((resolve) => {
        const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            entries.forEach((entry) => {
                observer.disconnect()

                resolve(entry.isIntersecting)
            })
        }

        new IntersectionObserver(callback, {
            root: config.container,
            rootMargin: determineRootMargin(config),
            threshold: 1.0,
        }).observe(elem ?? document.body)
    })
}
