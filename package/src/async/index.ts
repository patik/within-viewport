import { Side, SideOption } from '../common/common.types'
import { getConfig, determineRootMargin } from './options'
import { AsyncOptions } from './async.types'

/**
 * Determines whether an element is within the viewport
 * @param  {HTMLElement}      elem           DOM Element (required)
 * @param  {String | Object}  userOptions    Optional settings
 * @return {Boolean}                         Whether the element was completely within the viewport
 */
export async function withinViewportAsync(
    elem: HTMLElement,
    userOptions?: Side | SideOption | Partial<AsyncOptions>,
): Promise<boolean> {
    console.log('async version')
    const config = getConfig(elem, userOptions)

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
