import { determineConfig } from '../common/options'
import { MultipleSides, Side, UserOptions } from '../common/types'
import { determineRootMargin } from './options'

/**
 * Determines whether an element is within the viewport
 * @param  {HTMLElement}      elem           DOM Element (required)
 * @param  {String | Object}  userOptions    Optional settings
 * @return {Promise<Boolean>}                Whether the element was completely within the viewport
 */
export async function withinViewportAsync(
    elem: HTMLElement,
    userOptions?: Side | MultipleSides | Partial<UserOptions>,
): Promise<boolean> {
    const config = determineConfig('async', elem, userOptions)

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
