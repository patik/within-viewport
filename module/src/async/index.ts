import { getConfig } from '../common/options'
import { MultipleSides, Side, UserOptions } from '../common/types'
import { strictCallbackAndRootMargin } from './strictCallbackAndRootMargin'

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
        const { callback, rootMargin } = strictCallbackAndRootMargin(elem, config, resolve, debug)
        // const { callback, rootMargin } = looseCallbackAndRootMargin(elem, config, resolve, debug)

        new IntersectionObserver(callback, {
            root: config.container,
            rootMargin,
            threshold: 1.0,
        }).observe(elem ?? document.body)
    })
}
